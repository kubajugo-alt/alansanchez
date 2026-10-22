# how far the feet jump when a frame replaces the base frame, at in-game size (figure 400 px tall): best overlap of the
# lowest 12% of the figure (shoes and ankles), in the feet-anchor frame, searched over dx/dy
import json, sys, cv2, numpy as np
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
MS = json.load(open('measure.json')); REG = json.load(open('reg.json'))
U = 400.0; BAND = float(sys.argv[1]) if len(sys.argv) > 1 else 0.12
def band(k):
    a = cv2.imread(R + f'/art/sprites/{k}.webp', cv2.IMREAD_UNCHANGED); m = M[k]; s = U / m['h']
    al = cv2.resize((a[..., 3] > 128).astype(np.uint8), None, fx=s, fy=s, interpolation=cv2.INTER_NEAREST)
    ys, xs = np.where(al); bot = ys.max(); y0 = int(bot - U * BAND)
    yy, xx = np.where(al[y0:bot + 1]); return np.stack([xx - m['ax'] * s, yy + y0 - m['fy'] * s], 1)
res = {}
for c, v in REG.items():
    if c == 'pessoa': continue
    b = v['base']; B = band(b); W = 1200; Hh = 200
    grid = np.zeros((Hh, W), bool); gx = (B[:, 0] + W / 2).astype(int).clip(0, W - 1); gy = (B[:, 1] + Hh / 2).astype(int).clip(0, Hh - 1); grid[gy, gx] = True
    rows = []
    for r in v['rows']:
        k = r['k']; P = band(k); best = None
        for dy in range(-12, 13, 2):
            for dx in range(-120, 121, 2):
                X = (P[:, 0] + dx + W / 2).astype(int); Y = (P[:, 1] + dy + Hh / 2).astype(int)
                ok = (X >= 0) & (X < W) & (Y >= 0) & (Y < Hh); inter = grid[Y[ok], X[ok]].sum()
                iou = inter / (len(B) + len(P) - inter)
                if best is None or iou > best[0]: best = (iou, dx, dy)
        rows.append(dict(k=k, iou=round(float(best[0]), 2), dx=best[1] / U * 100, dy=best[2] / U * 100))
    res[c] = dict(base=b, rows=rows)
json.dump(res, open('feetjump.json', 'w'), indent=1)
for c, v in res.items():
    print(f'== {c} (base {v["base"]})')
    for r in v['rows']:
        fl = ' <<' if r['iou'] >= 0.45 and abs(r['dx']) >= 2.5 else ''
        print(f"  {r['k']:26s} feet jump {r['dx']:+5.1f}% of height  dy {r['dy']:+4.1f}%  overlap {r['iou']:.2f}{fl}")
