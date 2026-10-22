import json, sys, cv2, numpy as np
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
MS = json.load(open('measure.json')); REG = json.load(open('reg.json'))
det = cv2.FaceDetectorYN_create(R + '/scripts/models/yunet.onnx', '', (320, 320), 0.6, 0.3, 50)
U = 400.0
def drawn(k):
    a = cv2.imread(R + f'/art/sprites/{k}.webp', cv2.IMREAD_UNCHANGED); m = M[k]; s = U / m['h']
    a = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    al = a[..., 3:4].astype(np.float32) / 255
    g = cv2.cvtColor((a[..., :3].astype(np.float32) * al + 128 * (1 - al)).astype(np.uint8), cv2.COLOR_BGR2GRAY)
    return g, a, m['ax'] * s, m['fy'] * s
def search(T, G):
    best = None
    for sc in np.arange(0.75, 1.255, 0.01):
        t2 = cv2.resize(T, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
        if t2.shape[0] >= G.shape[0] or t2.shape[1] >= G.shape[1]: continue
        r = cv2.matchTemplate(G, t2, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(r)
        if best is None or mx > best[0]: best = (mx, sc, loc, t2.shape)
    return best
chars = sys.argv[1:] or [c for c in REG if c != "pessoa"]
OUT = {}
for c in chars:
    b = REG[c]['base']; g, a, ax, fy = drawn(b)
    f = None; det.setInputSize((a.shape[1] * 2, a.shape[0] * 2)); _, ff = det.detect(cv2.resize(a[..., :3], None, fx=2, fy=2))
    f = max(ff, key=lambda r: r[14]); x, y, w, h = [q / 2 for q in f[:4]]; cx, cy = x + w / 2, y + h / 2; S = max(w, h) * 1.5
    H = g[max(0, int(cy - S / 2)):int(cy + S / 2), max(0, int(cx - S / 2)):int(cx + S / 2)]
    ys, xs = np.where(a[..., 3] > 128); fb = int(ys.max()); ft = int(fb - (fb - ys.min()) * 0.16)
    row = a[ft:fb + 1, :, 3] > 128; cols = np.where(row.any(0))[0]
    Fe = g[ft:fb + 1, max(0, cols.min() - 4):cols.max() + 5]
    print(f'== {c} base {b}')
    for k in [r['k'] for r in MS[c]['rows'] if not r['pair'] and r['k'] != b]:
        G = drawn(k)[0]; h1 = search(H, G); f1 = search(Fe, G)
        print(f'  {k:26s} head {(h1[1]-1)*100:+4.0f}% ({h1[0]:.2f})   feet {(f1[1]-1)*100:+4.0f}% ({f1[0]:.2f})')
        OUT.setdefault(c, {})[k] = dict(head=[float(h1[1]), float(h1[0])], feet=[float(f1[1]), float(f1[0])])
json.dump(OUT, open("two.json", "w"), indent=1)
