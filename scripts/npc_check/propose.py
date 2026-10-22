import json, cv2, numpy as np
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
REG = json.load(open('reg.json')); D = json.load(open('dump.json')); SP = json.load(open('scale_prop.json'))
# scale: the reference is the frame the player sees most (Abilio: his main frame; Vasco: between his base and idle median)
SP['abilio'] = dict(fix={'abilio_idle2': 0.87})
SP['vasco']['fix'] = {k: round(v * 1.049 / 1.04, 3) for k, v in SP['vasco']['fix'].items() if abs(v * 1.049 / 1.04 - 1) >= 0.05}
NEW = {k: dict(M[k]) for k in M}
changes = {}
for c, v in SP.items():
    for k, f in v['fix'].items():
        NEW[k]['h'] = round(M[k]['h'] * f, 2); changes.setdefault(k, {})['h'] = [M[k]['h'], NEW[k]['h']]
main = {}
for r, v in D['rooms'].items():
    for n in v['list']: main.setdefault(n['ch'], set()).update(n.get('main') or D['chars'].get(n['ch'], {}).get('main', []))
U = 400.0
def band(k, m):
    a = cv2.imread(R + f'/art/sprites/{k}.webp', cv2.IMREAD_UNCHANGED); s = U / m['h']
    al = cv2.resize((a[..., 3] > 128).astype(np.uint8), None, fx=s, fy=s, interpolation=cv2.INTER_NEAREST)
    ys, xs = np.where(al); bot = ys.max(); y0 = int(bot - U * 0.12)
    yy, xx = np.where(al[y0:bot + 1]); return np.stack([xx - m['ax'] * s, yy + y0 - m['fy'] * s], 1)
SKIP = {'maria', 'cop_bed', 'guitar_floor', 'pessoa'}  # lying and reclining figures: their anchors are set to the bed / floor
fj = {}
for c, v in REG.items():
    if c in SKIP: continue
    b = v['base']; B = band(b, NEW[b]); W, Hh = 1200, 200
    grid = np.zeros((Hh, W), bool); grid[(B[:, 1] + Hh / 2).astype(int).clip(0, Hh - 1), (B[:, 0] + W / 2).astype(int).clip(0, W - 1)] = True
    res = {b: (1.0, 0, 0)}
    for r in v['rows']:
        k = r['k']; P = band(k, NEW[k]); best = None
        for dy in range(-12, 13, 1):
            for dx in range(-120, 121, 1):
                X = (P[:, 0] + dx + W / 2).astype(int); Y = (P[:, 1] + dy + Hh / 2).astype(int)
                ok = (X >= 0) & (X < W) & (Y >= 0) & (Y < Hh); inter = grid[Y[ok], X[ok]].sum()
                iou = inter / (len(B) + len(P) - inter)
                if best is None or iou > best[0]: best = (iou, dx, dy)
        res[k] = best
    # the reference: the median offset of the main (idle / talk) frames that overlap well
    good = [res[k] for k in main.get(c, []) if k in res and res[k][0] >= 0.6] or [res[b]]
    rx, ry = float(np.median([g[1] for g in good])), float(np.median([g[2] for g in good]))
    for k, (iou, dx, dy) in res.items():
        ex, ey = dx - rx, dy - ry
        if iou < 0.6: continue
        if abs(ex) / U < 0.02 and abs(ey) / U < 0.01: continue
        s = U / NEW[k]['h']
        ch = changes.setdefault(k, {})
        if abs(ex) / U >= 0.02: ch['ax'] = [M[k]['ax'], round(NEW[k]['ax'] - ex / s, 1)]; NEW[k]['ax'] = ch['ax'][1]
        if abs(ey) / U >= 0.01: ch['fy'] = [M[k]['fy'], round(NEW[k]['fy'] - ey / s, 1)]; NEW[k]['fy'] = ch['fy'][1]
        ch['overlap'] = round(float(iou), 2)
    fj[c] = {k: [round(float(x), 3) if i == 0 else round((x - (rx if i == 1 else ry)) / U * 100, 1) for i, x in enumerate(v)] for k, v in res.items()}
byc = {}
for c, v in REG.items():
    for k in [v['base']] + [r['k'] for r in v['rows']]:
        if k in changes: byc.setdefault(c, {})[k] = changes[k]
json.dump(dict(changes=byc, feet=fj), open('proposal.json', 'w'), indent=1)
for c, v in byc.items():
    print('==', c)
    for k, ch in v.items(): print('  ', k, {a: b for a, b in ch.items()})
