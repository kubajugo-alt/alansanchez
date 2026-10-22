# Audits the cut-out of every sprite the game can draw for background left behind, and (with `fix`) writes
# cleaned candidates for review. Nothing in the game is changed: results go to art/review/cutout/.
#
#   python3 scripts/cutout_audit.py audit [--crops]        -> art/review/cutout/report.json (+ crops/ of each finding)
#   python3 scripts/cutout_audit.py audit --dir art/review/cutout/sprites   (re-audit the cleaned files)
#   python3 scripts/cutout_audit.py fix NAME[:fixes] ...   -> art/review/cutout/sprites/NAME.webp + before_after/NAME.png
#
# The images: art/sprites/*.webp, the bath and Duarte sets loadApproved() (js/story/main.js) always loads
# (art/review/alan/{bath_new,duarte_new}/sprites/), and the review candidates approved in art/review/approvals.json.
# Face patches (art/faces/) are rectangles laid over the painting by design: only checked for key colour.
#
# What counts as background left behind (each finding: type, pixel count, bbox [x, y, w, h] in sprite pixels):
#   key      chroma green / magenta in the pixels (premultiplied excess: how much of it reaches the screen)
#   halo     a pale rim round the outline: edge pixels lighter and greyer than the paint just inside them
#   speck    islands detached from the figure (small; props and flying clothes are big and come out as 'island')
#   haze     faint pixels (alpha 1-63) more than 3 px from any solid paint: invisible on screen until lit or warped
#   hole     flat, colourless pale patches inside the silhouette (studio backdrop caught between arm and body)
#   border   paint on the outermost pixel of the canvas, or long dead-straight cut edges (a rectangle's side)
import glob, json, os, sys
import numpy as np, cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/cutout')


def sprite_files():
    """(name, path relative to ROOT, kind) for every sprite the game can draw."""
    out = [(os.path.basename(p)[:-5], os.path.relpath(p, ROOT), 'sprite') for p in sorted(glob.glob(f'{ROOT}/art/sprites/*.webp'))]
    for s in ('bath_new', 'duarte_new'):
        meta = json.load(open(f'{ROOT}/art/review/alan/{s}/sprites.json'))
        out += [(k, m['src'], s) for k, m in sorted(meta.items())]
    C = json.load(open(f'{ROOT}/art/review/candidates.json'))['candidates']
    A = json.load(open(f'{ROOT}/art/review/approvals.json'))
    out += [(c['id'], c['src'], 'candidate') for c in C if A.get(c['id'], {}).get('decision') == 'approved' and c.get('src')]
    return out


def load(p):
    return np.asarray(Image.open(p).convert('RGBA'))


def bbox(m):
    ys, xs = np.where(m)
    return [int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)]


def clusters(m, min_px=1, gap=6):
    """Group a mask's pixels into clusters (pixels within `gap` px join), biggest first: (mask, count)."""
    if not m.any(): return []
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (gap * 2 + 1, gap * 2 + 1))
    n, lab = cv2.connectedComponents(cv2.dilate(m.astype(np.uint8), k), connectivity=8)
    res = []
    for i in range(1, n):
        c = m & (lab == i)
        if c.sum() >= min_px: res.append((c, int(c.sum())))
    return sorted(res, key=lambda r: -r[1])


def interior_fill(a):
    """The colour of the paint just inside the outline, spread outwards (for comparing and recolouring edges)."""
    solid = cv2.erode((a[..., 3] >= 250).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    if solid.sum() < 50: solid = a[..., 3] >= 200
    return cv2.inpaint(np.ascontiguousarray(a[..., :3]), (~solid).astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA).astype(np.float32), solid


# ---------------------------------------------------------------- detectors
def halo_mask(a, fill=None):
    """Edge pixels lighter (on screen) and greyer than the paint just inside them: the old backdrop's rim."""
    al = a[..., 3]; vis = al > 0
    if fill is None: fill, inner = interior_fill(a)
    else: inner = cv2.erode((al >= 250).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    rgb = a[..., :3].astype(np.float32)
    edge = vis & ~inner & (cv2.distanceTransform((al >= 128).astype(np.uint8) ^ 1, cv2.DIST_L2, 3) <= 3) \
        & (cv2.distanceTransform((al >= 20).astype(np.uint8), cv2.DIST_L2, 3) <= 3)
    lum, flum = rgb.mean(-1), fill.mean(-1)
    sat = rgb.max(-1) - rgb.min(-1)
    strength = (lum - flum) * al / 255.0  # how much lighter it shows than the paint, on screen
    return edge & (lum > flum + 35) & (sat < 50) & (lum > 120) & (strength > 18), strength, edge


def key_mask(a):
    rgb = a[..., :3].astype(np.int16); r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    al = a[..., 3].astype(np.float32)
    gx = g - np.maximum(r, b); mx = np.minimum(r, b) - g
    green = (gx > 35) & (g > 70)
    mag = (mx > 60) & (r > 140) & (b > 140)
    excess = np.where(green, gx, np.where(mag, mx, 0)) * al / 255.0  # what reaches the screen
    return (green | mag) & (al > 0), excess


def find(a, faces=False):
    al = a[..., 3]; H, W = al.shape
    vis = al > 0
    F = []
    keyed, excess = key_mask(a)
    dist_t = cv2.distanceTransform((al >= 20).astype(np.uint8), cv2.DIST_L2, 3)
    # 1. key colour. 'key' = reaches the screen as a tint (premultiplied excess >= 6 levels) or sits in solid paint;
    #    'key_trace' = hue only in near-invisible edge pixels (alpha mostly < 32)
    vis_key = keyed & ((excess >= 6) | (al >= 128))
    for m, n in clusters(vis_key, 3):
        F.append(dict(type='key', px=n, bbox=bbox(m), max_excess=round(float(excess[m].max()), 1),
                      interior=int((m & (dist_t >= 4)).sum())))
    trace = keyed & ~vis_key
    if trace.sum() >= 1:
        F.append(dict(type='key_trace', px=int(trace.sum()), bbox=bbox(trace), max_excess=round(float(excess[trace].max()), 1)))
    if faces: return F
    # 4. haze: faint pixels well away from solid paint
    solid = al >= 64
    near = cv2.distanceTransform((~solid).astype(np.uint8), cv2.DIST_L2, 3) <= 3.0
    haze = vis & ~near
    if haze.any():
        for m, n in clusters(haze, 1, 12)[:12]:
            F.append(dict(type='haze', px=n, bbox=bbox(m), max_alpha=int(al[m].max())))
    # 3. islands detached from the figure (any visible pixel; joined at 8-connectivity over alpha >= 1)
    n, lab, st, _ = cv2.connectedComponentsWithStats((vis & near).astype(np.uint8), connectivity=8)
    if n > 1:
        big = st[1:, cv2.CC_STAT_AREA].max()
        for i in range(1, n):
            ar = st[i, cv2.CC_STAT_AREA]
            if ar == big: continue
            m = lab == i
            kind = 'speck' if ar < max(400, big * 0.004) else 'island'
            F.append(dict(type=kind, px=int(ar), bbox=[int(v) for v in st[i, :4]], max_alpha=int(al[m].max()),
                          colour=[int(v) for v in a[..., :3][m].mean(0)]))
    # 2. halo: edge pixels (within 3 px of transparency) much lighter and greyer than the paint inside them
    halo, strength, edge = halo_mask(a)
    rgb = a[..., :3].astype(np.float32); lum = rgb.mean(-1); sat = rgb.max(-1) - rgb.min(-1)
    perim = max(1, int(edge.sum()))
    for m, k in clusters(halo, 6, 4)[:20]:
        F.append(dict(type='halo', px=k, bbox=bbox(m), perimeter_frac=round(k / perim, 4),
                      mean_strength=round(float(strength[m].mean()), 1)))
    # 5. holes: flat, colourless pale patches inside the figure (studio white / grey caught in a gap)
    g = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2GRAY).astype(np.float32)
    mu = cv2.blur(g, (5, 5)); var = cv2.blur(g * g, (5, 5)) - mu * mu
    flat = (var < 4.0) & (sat < 14) & (lum > 200) & (al >= 200)
    flat = cv2.morphologyEx(flat.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0
    nh, lh, sh, _ = cv2.connectedComponentsWithStats(flat.astype(np.uint8), connectivity=8)
    for i in range(1, nh):
        if sh[i, cv2.CC_STAT_AREA] < 30: continue
        m = lh == i
        F.append(dict(type='hole', px=int(sh[i, cv2.CC_STAT_AREA]), bbox=[int(v) for v in sh[i, :4]],
                      colour=[int(v) for v in a[..., :3][m].mean(0)],
                      touches_edge=bool((cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)[al < 20].any())))
    # 6. border: paint on the canvas's outermost pixel; long straight cut edges
    ring = np.zeros_like(vis); ring[0, :] = ring[-1, :] = ring[:, 0] = ring[:, -1] = True
    if (vis & ring).any():
        F.append(dict(type='border', px=int((vis & ring).sum()), bbox=bbox(vis & ring), max_alpha=int(al[vis & ring].max())))
    sol = (al >= 128).astype(np.uint8)
    for axis, name in ((0, 'h'), (1, 'v')):
        # a transition between solid and clear at the same place over a long straight run
        d = np.abs(np.diff(sol.astype(np.int8), axis=axis)) > 0  # (H-1, W) for axis 0: horizontal edges
        k = np.ones((1, 61), np.uint8) if axis == 0 else np.ones((61, 1), np.uint8)
        run = cv2.erode(d.astype(np.uint8), k) > 0
        if run.any():
            m = cv2.dilate(run.astype(np.uint8), k) > 0
            for c, cnt in clusters(m, 61, 2):
                F.append(dict(type='straight_edge', px=cnt, bbox=bbox(c), dir=name))
    return F


# ---------------------------------------------------------------- crops of findings
def on(a, bgc):
    al = a[..., 3:4].astype(np.float32) / 255
    if bgc == 'checker':
        H, W = a.shape[:2]; yy, xx = np.mgrid[:H, :W]
        b = np.where(((yy // 8 + xx // 8) % 2 == 0)[..., None], np.array([255, 0, 255], np.float32), np.array([0, 200, 255], np.float32))
    else:
        b = np.zeros(a.shape[:2] + (3,), np.float32); b[:] = bgc
    return (a[..., :3] * al + b * (1 - al)).astype(np.uint8)


def zoom_crop(img, bb, pad=14, maxside=420):
    x, y, w, h = bb; H, W = img.shape[:2]
    x0, y0, x1, y1 = max(0, x - pad), max(0, y - pad), min(W, x + w + pad), min(H, y + h + pad)
    c = img[y0:y1, x0:x1]
    z = max(1, min(8, maxside // max(c.shape[0], c.shape[1])))
    return cv2.resize(c, (c.shape[1] * z, c.shape[0] * z), interpolation=cv2.INTER_NEAREST), (x0, y0, x1, y1, z)


def label(img, text):
    bar = np.full((18, img.shape[1], 3), 30, np.uint8)
    cv2.putText(bar, text[:max(1, img.shape[1] // 7)], (3, 13), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (235, 235, 235), 1, cv2.LINE_AA)
    return np.concatenate([bar, img], 0)


def hstack(ims, gap=6):
    H = max(i.shape[0] for i in ims)
    ims = [np.pad(i, ((0, H - i.shape[0]), (0, 0), (0, 0)), constant_values=255) for i in ims]
    sp = np.full((H, gap, 3), 255, np.uint8)
    out = [ims[0]]
    for i in ims[1:]: out += [sp, i]
    return np.concatenate(out, 1)


def crop_sheet(a, f, mark=None):
    """Checker / dark / highlighted (the finding in red, over mid grey), zoomed on the finding."""
    panels = []
    for bgc, t in (('checker', 'checker'), ((24, 24, 28), 'dark'), ((235, 235, 235), 'light')):
        z, _ = zoom_crop(on(a, bgc), f['bbox']); panels.append(label(z, t))
    if mark is not None:
        hl = on(a, (128, 128, 128)).copy(); hl[mark] = (255, 0, 0)
        z, _ = zoom_crop(hl, f['bbox']); panels.append(label(z, f['type'] + ' (red)'))
    return hstack(panels)


# ---------------------------------------------------------------- audit
def audit(files, crops=False, faces=True, tag=''):
    os.makedirs(OUT + '/crops', exist_ok=True)
    rep = {}
    for name, rel, kind in files:
        a = load(os.path.join(ROOT, rel))
        F = find(a)
        rep[name] = dict(src=rel, kind=kind, size=[a.shape[1], a.shape[0]], findings=F)
        if crops:
            for i, f in enumerate(F):
                if f['type'] == 'key_trace': continue
                Image.fromarray(crop_sheet(a, f)).save(f"{OUT}/crops/{name}__{i:02d}_{f['type']}.png")
    face = {}
    if faces:
        for p in sorted(glob.glob(f'{ROOT}/art/faces/*.webp')):
            a = load(p); F = find(a, faces=True)
            F = [f for f in F if f['type'] == 'key']
            if F: face[os.path.basename(p)[:-5]] = F
    return rep, face


def summary(rep):
    from collections import Counter
    c = Counter(); s = Counter()
    for n, r in rep.items():
        ts = set(f['type'] for f in r['findings'])
        for t in ts: s[t] += 1
        for f in r['findings']: c[f['type']] += 1
    return dict(sprites=len(rep), sprites_with=dict(s), findings=dict(c))


def main():
    args = sys.argv[1:]
    if not args or args[0] == 'audit':
        crops = '--crops' in args
        if '--dir' in args:
            d = args[args.index('--dir') + 1]
            files = [(os.path.basename(p)[:-5], os.path.relpath(p, ROOT), 'cleaned') for p in sorted(glob.glob(os.path.join(ROOT, d, '*.webp')))]
            rep, face = audit(files, crops=False, faces=False)
            out = os.path.join(OUT, 'report_cleaned.json')
        else:
            rep, face = audit(sprite_files(), crops=crops)
            out = os.path.join(OUT, 'report_raw.json')
        json.dump(dict(summary=summary(rep), faces_with_key=face, sprites=rep), open(out, 'w'), indent=1)
        print(json.dumps(summary(rep), indent=1), 'faces with key colour:', len(face))


if __name__ == '__main__':
    main()
