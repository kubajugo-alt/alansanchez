# Correspondence between frames that swap in play, for smooth pose changes.
#   python3 scripts/morphs.py framesets.json   (list of [name, [frame, ...]])
# For each ordered pair a>b it stores, on the mesh-warp grid of frame a (11 x 27 vertices,
# in a's sprite pixels), where each point of a sits in b (frames aligned on their anchors).
# The engine slides a painting along these paths while it cross-fades, instead of
# overlaying two pictures. Pairs the plain flow can't explain (very different poses) get a
# coarse-to-fine silhouette registration; pairs even that can't explain are skipped.
import sys, json, os, itertools, numpy as np, cv2
from PIL import Image
COLS, ROWS = 10, 26
txt = open('js/sprites.js').read(); META = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
out_path = 'js/morphs.js'
MORPHS = {}
if os.path.exists(out_path):
    t = open(out_path).read(); MORPHS = json.loads(t[t.index('{'):t.rindex('}') + 1])
sets = json.load(open(sys.argv[1]))
force = os.environ.get('FORCE')
def load(n):
    im = np.asarray(Image.open(f'art/sprites/{n}.webp').convert('RGBA')).astype(np.float32)
    return im
def place(n, cx, cy, W, H, scale):
    m = META[n]; im = load(n)
    if scale != 1: im = cv2.resize(im, (round(im.shape[1] * scale), round(im.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    c = np.zeros((H, W, 4), np.float32)
    ox, oy = round(cx - m['ax'] * scale), round(cy - m['fy'] * scale)
    y0, x0 = max(0, oy), max(0, ox); y1, x1 = min(H, oy + im.shape[0]), min(W, ox + im.shape[1])
    c[y0:y1, x0:x1] = im[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    return c, ox, oy
def gray(c):
    a = c[..., 3:4] / 255
    g = (c[..., :3] * a + 96 * (1 - a)).mean(2)
    return np.clip(g, 0, 255).astype(np.uint8)
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
dis.setFinestScale(1); dis.setPatchSize(12); dis.setPatchStride(4); dis.setGradientDescentIterations(25); dis.setVariationalRefinementIterations(5)
def smooth_flow(fl, a):
    # trust flow where there is paint; fill elsewhere from neighbours (normalised convolution)
    w = (a > 0.3).astype(np.float32)
    k = 41
    den = cv2.GaussianBlur(w, (0, 0), 9) + 1e-4
    f = np.dstack([cv2.GaussianBlur(fl[..., i] * w, (0, 0), 9) / den for i in range(2)])
    far = cv2.GaussianBlur(w, (0, 0), 40) + 1e-4
    g = np.dstack([cv2.GaussianBlur(fl[..., i] * w, (0, 0), 40) / far for i in range(2)])
    t = np.clip(den * 3, 0, 1)[..., None]
    f = f * t + g * (1 - t)
    # inside the paint keep the detailed flow
    return np.where(w[..., None] > 0, cv2.GaussianBlur(fl, (0, 0), 2.5), f)
def sdf(c):
    # signed distance to the silhouette: gives the flow something to hold on to when limbs swing far
    m = (c[..., 3] > 128).astype(np.uint8)
    s = np.clip(cv2.distanceTransform(m, cv2.DIST_L2, 5), 0, 40) - np.clip(cv2.distanceTransform(1 - m, cv2.DIST_L2, 5), 0, 40)
    return np.clip(128 + s * 3, 0, 255).astype(np.uint8)
dis2 = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
dis2.setFinestScale(1); dis2.setPatchSize(16); dis2.setPatchStride(4); dis2.setGradientDescentIterations(40); dis2.setVariationalRefinementIterations(8)
def register(A, B, mix, blur):
    # coarse-to-fine registration: silhouette at 1/4, 1/2, full size, then paint + silhouette; each
    # stage measures the flow from A to B pulled back through the flow so far and composes it
    H, W = A.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dA, dB = sdf(A), sdf(B)
    fa = (gray(A) * (1 - mix) + dA * mix).astype(np.uint8); fb = (gray(B) * (1 - mix) + dB * mix).astype(np.uint8)
    fab = np.zeros((H, W, 2), np.float32)
    for lev, ia, ib in [(4, dA, dB), (2, dA, dB), (1, dA, dB), (1, fa, fb)]:
        sa = cv2.resize(ia, (W // lev, H // lev))
        sb = cv2.resize(cv2.remap(ib, xx + fab[..., 0], yy + fab[..., 1], cv2.INTER_LINEAR, borderValue=int(ib[0, 0])), (W // lev, H // lev))
        f = cv2.GaussianBlur(cv2.resize(dis2.calc(sa, sb, None), (W, H)) * lev, (0, 0), blur * lev)
        fab = f + cv2.remap(fab, xx + f[..., 0], yy + f[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return fab
def pair(a, b, reg=None):
    ma, mb = META[a], META[b]
    sc = ma['h'] / mb['h']  # engine draws both at the actor's height
    W = int(max(ma['w'], mb['w'] * sc) * 2 + 80); H = int(max(ma['hh'], mb['hh'] * sc) + 80)
    cx, cy = W // 2, H - 40
    A, aox, aoy = place(a, cx, cy, W, H, 1); B, _, _ = place(b, cx, cy, W, H, sc)
    ga, gb = gray(A), gray(B)
    # a global shift first (frames painted a little apart), then the local flow on top
    win = cv2.createHanningWindow((W, H), cv2.CV_32F)
    (sx, sy), resp = cv2.phaseCorrelate(A[..., 3] / 255, B[..., 3] / 255, win)
    if abs(sx) > W * 0.25 or abs(sy) > H * 0.25 or resp < 0.05: sx = sy = 0.0
    Mt = np.float32([[1, 0, -sx], [0, 1, -sy]])
    gb2 = cv2.warpAffine(gb, Mt, (W, H), borderValue=96)
    if reg and reg[0] == 'inv':
        # the way back registers better: measure b -> a and invert it (fixed point x + f(x) = y)
        fba = register(B, A, *reg[1:])
        yy0, xx0 = np.mgrid[0:H, 0:W].astype(np.float32)
        fab = -fba.copy()
        for _ in range(25):
            fab = -cv2.remap(fba, xx0 + fab[..., 0], yy0 + fab[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    elif reg:
        fab = register(A, B, *reg)
    else:
        fab = dis.calc(ga, gb2, None)
        fab[..., 0] += sx; fab[..., 1] += sy
    fab = smooth_flow(fab, A[..., 3] / 255)
    # quality: pull B back through the flow and compare with A, against plain overlap
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    Bw = cv2.remap(B, xx + fab[..., 0], yy + fab[..., 1], cv2.INTER_LINEAR)
    m = (A[..., 3] > 128) | (B[..., 3] > 128)
    def err(X): return float(np.abs(X[..., :3] * X[..., 3:4] / 255 - A[..., :3] * A[..., 3:4] / 255)[m].mean())
    e0, e1 = err(B), err(Bw)
    ia = (A[..., 3] > 128); ib = (Bw[..., 3] > 128); iou = (ia & ib).sum() / max(1, (ia | ib).sum())
    # grid of a, in a's sprite px -> displacement to b
    g = []
    for j in range(ROWS + 1):
        for i in range(COLS + 1):
            x = ma['w'] * i / COLS + aox; y = ma['hh'] * j / ROWS + aoy
            xi, yi = int(np.clip(round(x), 0, W - 1)), int(np.clip(round(y), 0, H - 1))
            g += [int(round(fab[yi, xi, 0])), int(round(fab[yi, xi, 1]))]
    return g, e0, e1, iou
done = skipped = 0
for name, frames in sets:
    for a, b in itertools.permutations(frames, 2):
        key = f'{a}>{b}'
        if key in MORPHS and not force: continue
        if a not in META or b not in META: continue
        g, e0, e1, iou = pair(a, b)
        ok = e1 < e0 * 0.8 and iou > 0.8
        if not ok:  # very different poses: register the silhouettes coarse-to-fine and try again
            for reg in [(0.6, 1.5), (0.4, 1.0), (0.8, 2.0), (1.0, 1.0), ('inv', 0.6, 1.5), ('inv', 0.4, 1.0), (0.2, 0.8)]:
                g2, e0, e1b, iou2 = pair(a, b, reg)
                if e1b < e0 * 0.8 and iou2 > 0.8: g, e1, iou, ok = g2, e1b, iou2, True; break
                if iou2 > iou: e1, iou = e1b, iou2  # report the best attempt
        print(f'{key:55s} overlap {e0:5.1f} morph {e1:5.1f} iou {iou:.2f} {"OK" if ok else "skip"}')
        if ok: MORPHS[key] = g; done += 1
        else: MORPHS.pop(key, None); skipped += 1
# a pair is only used both ways: where the way back registered, invert it for this way
# (a slightly looser fit is fine, the inverse of a verified field stays coherent)
for name, frames in sets:
    for a, b in itertools.permutations(frames, 2):
        if f'{a}>{b}' in MORPHS or f'{b}>{a}' not in MORPHS or a not in META or b not in META: continue
        for reg in [('inv', 0.6, 1.5), ('inv', 0.4, 1.0), ('inv', 0.8, 2.0), ('inv', 0.2, 0.8)]:
            g, e0, e1, iou = pair(a, b, reg)
            if e1 < e0 * 0.8 and iou > 0.72:
                MORPHS[f'{a}>{b}'] = g; done += 1; skipped -= 1
                print(f'{a + ">" + b:55s} overlap {e0:5.1f} morph {e1:5.1f} iou {iou:.2f} OK (inverse)'); break
with open(out_path, 'w') as fh:
    fh.write('// Generated by scripts/morphs.py: where each mesh point of one frame sits in the next (smooth pose changes).\nwindow.MORPHS = ' + json.dumps(MORPHS, separators=(',', ':')) + ';\n')
print('stored', done, 'skipped', skipped, 'total', len(MORPHS))
