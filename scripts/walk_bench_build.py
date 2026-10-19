# Data and images for the walk-cycle tool: every character's cycles as the game has them, and a pool of their frames.
# Run from a scratch folder holding ../tests/walks.json (every cycle the game plays, dumped from Game.chars()); writes data.json and img/ for the Walk Cycle Bench page.
import json, os, re, sys
from PIL import Image
R = '/home/user/alansanchez/'
src = open(R + 'js/sprites.js').read()
SP = json.loads(src[src.index('{'):src.rindex('}') + 1])
W = json.load(open('../tests/walks.json'))
CAND = {c['id']: c for c in json.load(open(R + 'art/review/candidates.json'))['candidates']}
NAMES = {'alan': 'Alan', 'ines': 'Inês', 'vasco': 'Vasco', 'lacerda': 'Lacerda', 'celeste': 'Celeste', 'ze': 'Zé', 'lino': 'Lino',
         'cop_visit': 'Teixeira', 'guitar_visit': 'Duarte', 'pessoa': 'Pessoa', 'rui': 'Rui'}
PREFIX = {'cop_visit': ['cop_'], 'guitar_visit': ['guitar_']}
CYCLE = {'walk': 'Side walk', 'frontWalk': 'Walking towards camera', 'backWalk': 'Walking away', 'set:lantern': 'Side walk with the lantern',
         'set:coffees': 'Side walk with the coffees', 'set:carry': 'Side walk carrying'}
W.setdefault('lino', {'walks': {}})
W['lino']['walks'] = {'walk': ['lino_walk1', 'lino_pass1', 'lino_walk2', 'lino_pass2'], 'set:carry': ['lino_carry1', 'lino_carrypass1', 'lino_carry2', 'lino_carrypass2']}
W['rui']['walks'] = {'walk': ['rui']}
WALKISH = re.compile(r'walk|pass|stride|step|front|back|lantern|carry|coffee|idle|^[a-z]+$|_visit$')
chars, frames = [], {}
def add(k):
    if k in frames: return True
    c = CAND.get(k)
    meta = SP.get(k) or (c and c.get('meta'))
    path = R + 'art/sprites/' + k + '.webp' if k in SP else (c and R + c['src'])
    if not meta or not path or not os.path.exists(path): return False
    im = Image.open(path).convert('RGBA'); s = 420 / im.height
    im.resize((max(1, round(im.width * s)), 420), Image.LANCZOS).save(f'img/{k}.webp', 'WEBP', quality=82)
    frames[k] = {k2: meta[k2] for k2 in ('w', 'hh', 'h', 'ax', 'fy') if k2 in meta}
    frames[k]['left'] = bool(meta.get('facesLeft'))
    if k not in SP: frames[k]['candidate'] = c.get('what', '')
    return True
os.makedirs('img', exist_ok=True)
for cid, c in W.items():
    pre = PREFIX.get(cid, [cid + '_'])
    cyc = []
    for k, seq in c['walks'].items():
        seq = [f for f in seq if add(f)]
        cyc.append({'id': k, 'name': CYCLE.get(k, k), 'game': seq})
    if cid == 'alan':
        new = ['alan_walkA'] + [i for i, x in sorted(((CAND[i]['wire']['walkSlot'], i) for i in CAND if CAND[i]['char'] == 'alan' and CAND[i].get('wire', {}).get('walkSlot') is not None))]
        new = ['alan_walkA'] + [x for _, x in sorted((CAND[i]['wire']['walkSlot'], i) for i in CAND if CAND[i]['char'] == 'alan' and CAND[i].get('wire', {}).get('walkSlot') is not None)]
        cyc.insert(1, {'id': 'walk_new', 'name': 'Side walk, new version (waiting for your approval)', 'game': [f for f in new if add(f)]})
    pool = sorted({k for k in list(SP) + list(CAND) if any(k.startswith(p) or k == p[:-1] for p in pre) and WALKISH.search(k[len(pre[0]):] or k)
                   and not re.search(r'pair_|__|_ib_(?!coffee|walk|weight)', k)} | {f for cy in cyc for f in cy['game']})
    pool = [k for k in pool if add(k)]
    core = re.compile(r'walk|pass|stride|step|front|back$|back_walk|back_pass|lantern$|lwalk|lpass|carry|coffee|idle|_side$|_visit$')
    used = {f for cy in cyc for f in cy['game']}
    chars.append({'id': cid, 'name': NAMES.get(cid, cid), 'cycles': cyc, 'pool': pool,
                  'core': [k for k in pool if k in used or core.search(k) or k == cid or k in (pre[0][:-1],)]})
order = list(NAMES)
chars.sort(key=lambda c: order.index(c['id']) if c['id'] in order else 99)
json.dump({'chars': chars, 'frames': frames}, open('data.json', 'w'))
print(len(frames), 'frames'); [print(c['name'], len(c['pool']), [(x['id'], len(x['game'])) for x in c['cycles']]) for c in chars]
