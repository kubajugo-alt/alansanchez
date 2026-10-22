# per NPC: every frame it can show, its figure height, face size and feet anchor in the character's own units
import json, sys, os, re, cv2, numpy as np
from PIL import Image
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
D = json.load(open('dump.json'))
groups = {}
for room, v in D['rooms'].items():
    for n in v['list']:
        fr = n.get('frames') or D['chars'].get(n['ch'], {}).get('frames', [])
        g = groups.setdefault(n['ch'], {'rooms': set(), 'frames': set(), 'h': set()}); g['rooms'].add(room); g['frames'] |= set(fr); g['h'].add(n.get('h'))
for c, v in D['chars'].items():
    if c in groups: groups[c]['frames'] |= set(v['frames'])
EXTRA = {'ze': ['ze_dress', 'ze_shirtless', 'ze_strip1', 'ze_strip3', 'ze_suspenders'], 'npc_guitar': ['duarte_dn_kneel', 'duarte_dn_stand']}
for c, l in EXTRA.items():
    if c in groups: groups[c]['frames'] |= set(l)
det = cv2.FaceDetectorYN_create(R + '/scripts/models/yunet.onnx', '', (320, 320), 0.6, 0.3, 50)
def face(k):
    p = R + f'/art/sprites/{k}.webp'
    if not os.path.exists(p): return None
    im = Image.open(p).convert('RGBA'); a = np.asarray(im)
    rgb = a[..., :3].copy(); rgb[a[..., 3] < 128] = 128
    s = 2; big = cv2.resize(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), None, fx=s, fy=s, interpolation=cv2.INTER_CUBIC)
    best = None
    for fl in (0, 1):
        img = big[:, ::-1].copy() if fl else big
        det.setInputSize((img.shape[1], img.shape[0])); _, f = det.detect(img)
        for r in (f if f is not None else []):
            if best is None or r[14] > best[14]: best = r
    alpha = a[..., 3] > 128
    ys, xs = np.where(alpha)
    return dict(face=None if best is None else float(best[3] / s), score=None if best is None else float(best[14]),
                eye=None if best is None else float(abs(best[4] - best[6]) / s), bw=float(xs.max() - xs.min()) if len(xs) else 0)
out = {}
for c, g in sorted(groups.items()):
    rows = []
    for k in sorted(g['frames']):
        m = M.get(k)
        if not m or m.get('pw'): continue
        f = face(k)
        if f is None: continue
        h = m['h']; rows.append(dict(k=k, fig=(m['fy'] - m.get('top', 0)) / h, face=f['face'] / h if f['face'] else None, eye=f['eye'] / h if f['eye'] else None,
                                     score=f['score'], bw=f['bw'] / h, ax=m['ax'], w=m['w'], h=h, fy=m['fy'], top=m.get('top'), pair='px' in m))
    out[c] = dict(rooms=sorted(g['rooms']), h=sorted(str(x) for x in g['h']), rows=rows)
json.dump(out, open('measure.json', 'w'), indent=1)
for c, v in out.items():
    fs = [r['face'] for r in v['rows'] if r['face'] and r['score'] > 0.75]
    med = np.median(fs) if fs else None
    print(f"\n== {c}  rooms {v['rooms']} h {v['h']}  frames {len(v['rows'])}  median face {med and round(med,4)}")
    for r in v['rows']:
        d = (r['face'] / med - 1) * 100 if med and r['face'] else None
        print(f"  {r['k']:28s} fig {r['fig']:.3f}  face {'%+6.1f%%' % d if d is not None else '   -   '} sc {r['score'] or 0:.2f}  bw {r['bw']:.2f}  h {r['h']}{' pair' if r['pair'] else ''}")
