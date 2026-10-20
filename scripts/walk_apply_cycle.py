# Puts a walk cycle the user built in the review page's cycle editor into the game, as approved candidates.
# The cycle comes from the page's database (decision/<char>: {cycle: [{id, dx, dy} | {gap, text}], pick}); each step's
# frame is found in the editor's library (art/review/<prefix>/walk6 for the proposed set's candidates, the library
# folder for the other tries, art/sprites for frames in the game) and becomes candidate <prefix>_walk7_s<i>: the
# picture under art/review/<prefix>/walk7/ and art/review/candidates/, its nudge baked into the meta (ax -= dx,
# fy -= dy), wired as walkSlot i of a walk of exactly these steps (walkBase). The character's walk6 candidates leave
# candidates.json (walkAll needs every walk candidate of a character approved). Prints the plant data for core.js.
#   python3 scripts/walk_apply_cycle.py <char> <decision.json> <library data.json> <library folder>
import json, os, sys, numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ch, dec_p, data_p, libdir = sys.argv[1:5]
dec = json.load(open(dec_p)); data = json.load(open(data_p))[ch]; LIB = {e['id']: e for e in data['lib']}
steps = [s for s in dec['cycle'] if not s.get('gap')]
if len(steps) != len(dec['cycle']): sys.exit('the cycle has missing frames: paint them first')
pre = data['proposed'][0].split('_walk6_')[0]
C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))
CM = {c['id']: c for c in C['candidates']}


def source(k):
    if k in CM: return os.path.join(ROOT, CM[k]['src'])
    if '_try' in k:
        t, n = k.split('_try')[1].split('_p'); return os.path.join(libdir, f'{pre}_try{t}', f'pose{n}.png')
    return os.path.join(ROOT, f'art/sprites/{k}.webp')


out = os.path.join(ROOT, f'art/review/{pre}/walk7'); os.makedirs(out, exist_ok=True)
ids = [f'{pre}_walk7_s{i + 1}' for i in range(len(steps))]
C['candidates'] = [c for c in C['candidates'] if not (c['char'] == ch and c.get('wire', {}).get('walkSlot') is not None)]
plant = {}
for i, (s, cid) in enumerate(zip(steps, ids)):
    e = LIB[s['id']]; im = Image.open(source(s['id'])).convert('RGBA'); a = np.asarray(im)
    im.save(os.path.join(out, f's{i + 1}.png'))
    src = f'art/review/candidates/{cid}.webp'; im.save(os.path.join(ROOT, src), quality=92, method=6)
    m = e['meta']; dx, dy = s.get('dx', 0), s.get('dy', 0)
    top = float(np.nonzero((a[..., 3] > 128).any(1))[0].min())
    meta = {'w': im.width, 'hh': im.height, 'h': m['h'], 'ax': round(m['ax'] - (-dx if m.get('facesLeft') else dx), 1), 'fy': m['fy'] - dy, 'top': top}
    if m.get('facesLeft'): meta['facesLeft'] = True
    C['candidates'].append({'id': cid, 'char': ch, 'phase': 2, 'kind': 'walk', 'what': f"walk step {i + 1} of {len(steps)} as built on the review page ({s['id']})",
                            'src': src, 'originals': [], 'meta': meta, 'wire': {'walkSlot': i, 'walkBase': ids}})
    plant[cid] = [round(v + dx / m['h'], 3) for v in e['plant']]
json.dump(C, open(os.path.join(ROOT, 'art/review/candidates.json'), 'w'), indent=1)
W = list(plant); L = [plant[f][0] - (plant[W[(i + 1) % len(W)]][1] if len(plant[W[(i + 1) % len(W)]]) > 1 else plant[W[(i + 1) % len(W)]][0]) for i, f in enumerate(W)]
print(f'{ch}: steps ' + ' '.join(f'{x:+.3f}' for x in L) + f'  (shortest/longest {min(L) / max(L):.2f})')
print(f'  // {ch}: the cycle the user built on the review page (scripts/walk_apply_cycle.py)\n  ' + ', '.join(f'{k}: [{", ".join(f"{v:.3f}" for v in vs)}]' for k, vs in plant.items()))
