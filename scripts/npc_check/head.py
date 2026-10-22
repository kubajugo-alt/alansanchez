# the base frame's head, searched over scale in every other frame, all at on-screen size (figure 400 px tall)
import json, cv2, numpy as np
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
REG = json.load(open('reg.json')); MS = json.load(open('measure.json'))
det = cv2.FaceDetectorYN_create(R + '/scripts/models/yunet.onnx', '', (320, 320), 0.6, 0.3, 50)
U = 400.0
def drawn(k):
    a = cv2.imread(R + f'/art/sprites/{k}.webp', cv2.IMREAD_UNCHANGED); m = M[k]; s = U / m['h']
    a = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    rgb = a[..., :3].astype(np.float32); al = a[..., 3:4].astype(np.float32) / 255
    g = cv2.cvtColor((rgb * al + 128 * (1 - al)).astype(np.uint8), cv2.COLOR_BGR2GRAY)
    return g, a, m['ax'] * s, m['fy'] * s
def facebox(img):
    det.setInputSize((img.shape[1], img.shape[0])); _, f = det.detect(img)
    if f is None: return None
    return max(f, key=lambda r: r[14])
out = {}
for c, v in REG.items():
    b = v['base']; g, a, ax, fy = drawn(b)
    big = cv2.resize(a[..., :3], None, fx=2, fy=2); f = facebox(big)
    if f is None: print(c, 'no face in base'); continue
    x, y, w, h = [q / 2 for q in f[:4]]; cx, cy = x + w / 2, y + h / 2; S = max(w, h) * 1.5
    x0, y0, x1, y1 = int(cx - S / 2), int(cy - S / 2), int(cx + S / 2), int(cy + S / 2)
    x0, y0 = max(0, x0), max(0, y0); T = g[y0:y1, x0:x1]
    hx, hy = (x0 + x1) / 2 - ax, (y0 + y1) / 2 - fy  # head centre relative to the feet anchor
    rows = []
    for r in v['rows']:
        k = r['k']; G, A, AX, FY = drawn(k); best = None
        for sc in np.arange(0.80, 1.205, 0.01):
            t2 = cv2.resize(T, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
            if t2.shape[0] >= G.shape[0] or t2.shape[1] >= G.shape[1]: continue
            res = cv2.matchTemplate(G, t2, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(res)
            if best is None or mx > best[0]: best = (mx, sc, loc, t2.shape)
        if best is None: continue
        mx, sc, loc, sh = best
        HX, HY = loc[0] + sh[1] / 2 - AX, loc[1] + sh[0] / 2 - FY
        rows.append(dict(k=k, score=round(float(mx), 3), scale=round(float(sc), 2), dhx=round((HX - hx) / U * 100, 1), dhy=round((HY - hy) / U * 100, 1)))
    out[c] = dict(base=b, rows=rows)
json.dump(out, open('head.json', 'w'), indent=1)
for c, v in out.items():
    print(f"\n== {c} (base {v['base']})")
    for r in v['rows']:
        fl = ' <<' if r['score'] > 0.6 and abs(r['scale'] - 1) >= 0.05 else ''
        print(f"  {r['k']:28s} head {(r['scale']-1)*100:+5.0f}%  match {r['score']:.2f}  head pos dx {r['dhx']:+5.1f}% dy {r['dhy']:+5.1f}%{fl}")
