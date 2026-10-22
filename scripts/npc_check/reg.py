# on-screen size and feet drift of every NPC frame against the character's base frame (SIFT + RANSAC similarity)
import json, os, sys, cv2, numpy as np
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
MS = json.load(open('measure.json')); D = json.load(open('dump.json'))
sift = cv2.SIFT_create(4000)
cache = {}
def feat(k):
    if k in cache: return cache[k]
    a = cv2.imread(R + f'/art/sprites/{k}.webp', cv2.IMREAD_UNCHANGED)
    g = cv2.cvtColor(a[..., :3], cv2.COLOR_BGR2GRAY); m = (a[..., 3] > 128).astype(np.uint8) * 255
    m = cv2.erode(m, np.ones((5, 5), np.uint8))
    kp, de = sift.detectAndCompute(g, m); cache[k] = (kp, de); return cache[k]
bf = cv2.BFMatcher()
def reg(a, b):
    ka, da = feat(a); kb, db = feat(b)
    if da is None or db is None or len(ka) < 8 or len(kb) < 8: return None
    ms = [m for m, n in (x for x in bf.knnMatch(da, db, k=2) if len(x) == 2) if m.distance < 0.75 * n.distance]
    if len(ms) < 8: return None
    P = np.float32([ka[m.queryIdx].pt for m in ms]); Q = np.float32([kb[m.trainIdx].pt for m in ms])
    T, inl = cv2.estimateAffinePartial2D(P, Q, method=cv2.RANSAC, ransacReprojThreshold=4, maxIters=5000)
    if T is None: return None
    n = int(inl.sum()); s = float(np.hypot(T[0, 0], T[1, 0])); return T, s, n
res = {}
for c, v in MS.items():
    ks = [r['k'] for r in v['rows'] if not r['pair']]
    idle = D['chars'].get(c, {}).get('frames', [])
    base = c if c in ks else (idle[0] if idle and idle[0] in ks else ks[0]) if ks else None
    if not base: continue
    mb = M[base]; out = []
    for k in ks:
        if k == base: continue
        r = reg(base, k)
        mf = M[k]
        if r is None: out.append(dict(k=k, n=0)); continue
        T, s, n = r
        scr = s * mb['h'] / mf['h']
        ft = T @ np.array([mb['ax'], mb['fy'], 1.0])
        dx = (mf['ax'] - ft[0]) / mf['h'] * 100; dy = (mf['fy'] - ft[1]) / mf['h'] * 100  # % of figure height, + = frame's anchor right/below
        out.append(dict(k=k, n=n, scale=scr, dx=dx, dy=dy))
    res[c] = dict(base=base, rows=out)
json.dump(res, open('reg.json', 'w'), indent=1)
for c, v in res.items():
    print(f"\n== {c}  (base {v['base']})")
    for r in v['rows']:
        if not r['n']: print(f"  {r['k']:28s} no match"); continue
        flag = ' <<' if r['n'] >= 25 and (abs(r['scale'] - 1) > 0.04 or abs(r['dx']) > 3 or abs(r['dy']) > 2) else ''
        print(f"  {r['k']:28s} size {(r['scale']-1)*100:+6.1f}%  feet dx {r['dx']:+5.1f}% dy {r['dy']:+5.1f}%  inliers {r['n']}{flag}")
