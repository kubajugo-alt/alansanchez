# Walk step 4: the one-sheet walk (scripts/walk_sheet.py) for the rest of the cast. Same Gemini sheet; the fitting is
# generic instead of Alan's (his used the jeans to find the waist and the brown boots to find the feet):
#   size   the 8 figures are scaled together so their median height is the median height of the character's walk
#          frames in the game now; if the heads then come out a different size from those frames' heads (Gemini
#          shortened Alan's legs ~9%), the whole set is scaled to the head and the legs (below half the figure) are
#          stretched or squeezed back to the height (at most +-10%: the head match gives way first)
#   canvas one canvas for all 8, wide enough for the longest stride; the head sits over the anchor as it does in the
#          reference frame
#   feet   each foot is a blob of the bottom 10% of the figure (alpha only); which one carries the weight follows the
#          pose (see fit); their centres give S.WALK_PLANT
#   heads  if the two rows' heads differ by more than 2% (hair painted differently), scripts/walk_head_swap.py
#   heel   contact frames get their leading heel onto the floor (scripts/walk_heel_down.py)
# Writes art/review/<who>/walk6/pose<N>.png, candidates <prefix>_walk6_p<N> (art/review/candidates.json, walkSlot 0-7,
# walkBase = the 8 new frames) and prints the plant data for js/story/core.js.
#   python3 scripts/walk_sheet_cast.py generate ines vasco ...      one Gemini call each ($0.07)
#   python3 scripts/walk_sheet_cast.py fit ines vasco ...           split, fit, candidates, plant data
import json, os, subprocess, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from walk_sheet import generate, POSES, ROOT
from canva_restyle_fit import key_out

CAST = {  # char key in S.CHARS: sprite prefix, reference walk frame, the walk frames in the game now, words for Gemini
    # (Alan's chosen set is fitted by walk_sheet.py; he is here for the editor's library: his other tries, sheet_raw_<n>)
    'alan': ('alan', 'alan_walkA', ['alan_walkA', 'alan_walkDown', 'alan_pass', 'alan_walkUp', 'alan_walkB'], 'his',
             'a man with dark wavy hair, a brown leather jacket, a white T-shirt, blue jeans and brown boots'),
    'ines': ('ines', 'ines_walk1', ['ines_walk1', 'ines_walk2'], 'her',
             'a young woman with long dark curly hair, a black blazer over a printed top, high-waisted blue jeans and black heels, holding a dark blue book against her hip in her far hand, the book visible in the same hand in all eight figures'),
    'vasco': ('vasco', 'vasco_walk2', ['vasco_walk_upN', 'vasco_walk_passN', 'vasco_walk_far', 'vasco_walk_passF', 'vasco_walk2', 'vasco_pass1'], 'his',
              'a man in his thirties with short dark hair and stubble, a brown tweed jacket over a blue shirt and loose dark tie, khaki trousers and brown boots'),
    'lacerda': ('lacerda', 'lacerda_walk1', ['lacerda_walk1', 'lacerda_pass1', 'lacerda_walk2', 'lacerda_pass2'], 'his',
                'an elderly man with swept-back white hair, a cream three-piece suit, a dark red cravat and brown shoes; BOTH legs of his trousers are the same cream as his jacket, the far leg only a little shaded, never grey'),
    'celeste': ('celeste', 'celeste_walkA', ['celeste_walkA', 'celeste_walkB'], 'her',
                'a heavy-set older washerwoman with a black headscarf, a black blouse and long black skirt, a blue checked apron and black boots'),
    'ze': ('ze', 'ze_walkA', ['ze_walkA', 'ze_walkB'], 'his',
           'a burly fisherman with short dark hair and stubble, a navy roll-neck sweater, yellow oilskin dungarees and black rubber boots'),
    'cop_visit': ('cop', 'cop_walk1', ['cop_walk1', 'cop_walk2'], 'his',
                  'a young police officer with short dark hair, a navy uniform shirt and trousers with a belt, black shoes; he carries his peaked police cap in his far hand, down at his side, in ALL EIGHT figures'),
    'guitar_visit': ('guitar', 'guitar_walk1', ['guitar_walk1', 'guitar_walk2'], 'his',
                     'a slim man with dark hair and a moustache, a black suit with an open white shirt, brown shoes; the dark guitar case hangs on his back by its strap in ALL EIGHT figures'),
}
_t = open(os.path.join(ROOT, 'js/sprites.js')).read(); SPR = json.loads(_t[_t.index('{'):_t.rindex('}') + 1])
PAD = 24          # headroom above the tallest figure
# Which Gemini sheet each character uses (sheet_raw_<n>.png; the rest were tries): the one with the most even steps
# (each step the planted foot travels, as a share of the longest; Gemini often paints one pose with the feet in the
# wrong place, and that step then shrinks to nothing and the pose never shows).
SHEET = {'ines': 2, 'vasco': 3, 'celeste': 2, 'ze': 2, 'cop_visit': 3, 'guitar_visit': 2}  # (cop, guitar: the only tries with the cap / case in all 8)
# A pose that came out wrong in the chosen sheet takes its counterpart from the other half of the stride (the same
# body position with the legs swapped; only the legs' overlap differs): Ines's 13 has two books, Celeste's 15 and
# Ze's 7 stand with the feet a whole stride apart.
REUSE = {'ines': {13: 5}, 'celeste': {15: 7}, 'ze': {7: 15}}
FOOT = 0.10       # the feet: the bottom 10% of the figure (the walk lab uses the same band)


def alpha(a): return a[..., 3] > 128


def box(a):
    ys, xs = np.nonzero(alpha(a)); return ys.min(), ys.max(), xs.min(), xs.max()


def head(a):
    """(head x, head width): the top 9% of the figure, as the walk lab measures it"""
    m = alpha(a); t, b, _, _ = box(a); rows = [np.nonzero(m[j])[0] for j in range(t, t + max(4, int((b - t) * 0.09)))]
    rows = [r for r in rows if len(r)]
    return float(np.mean([(r.min() + r.max()) / 2 for r in rows])), float(np.median([r.max() - r.min() for r in rows]))


def sprite(k): return np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{k}.webp')).convert('RGBA'))


def split_sheet(raw):
    import cv2
    g = key_out(np.asarray(Image.open(raw).convert('RGB')))
    # a ground line Gemini sometimes paints under a row (1-3 px tall): an opening with a 7 px tall kernel removes it
    keep = cv2.morphologyEx((g[..., 3] > 40).astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 1), np.uint8))
    g[..., 3] = g[..., 3] * cv2.dilate(keep, np.ones((3, 3), np.uint8))
    m = (g[..., 3] > 128).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(m, np.ones((15, 15), np.uint8)), 8)
    big = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > st[1:, cv2.CC_STAT_AREA].max() * 0.2]
    if len(big) != 8: sys.exit(f'{raw}: expected 8 figures, found {len(big)}')
    cy = {i: st[i, 1] + st[i, 3] / 2 for i in big}; mid = np.median(list(cy.values()))
    rows = [sorted([i for i in big if cy[i] < mid], key=lambda i: st[i, 0]), sorted([i for i in big if cy[i] >= mid], key=lambda i: st[i, 0])]
    if [len(r) for r in rows] != [4, 4]: sys.exit(f'rows of {[len(r) for r in rows]}')
    figs, floors = [], []
    for r in rows:
        fl = max(st[i, 1] + st[i, 3] for i in r)                     # the row's ground line: its lowest foot
        for i in r:
            x, y, w, h = st[i, :4]; f = g[y:y + h, x:x + w].copy(); f[..., 3] = f[..., 3] * (lab[y:y + h, x:x + w] == i)
            figs.append(f); floors.append(fl - (y + box(f)[1]))         # how far this figure's lowest pixel is above it
    return figs, floors


def resize(a, s, sy=None):
    im = Image.fromarray(a, 'RGBA'); return np.asarray(im.resize((max(1, round(im.width * s)), max(1, round(im.height * (sy or s)))), Image.LANCZOS))


def stretch_legs(a, k):
    """scale the bottom half of the figure by k vertically, about the feet; the top half moves whole"""
    import cv2
    a = a.astype(np.float32); t, b, _, _ = box(a.astype(np.uint8)); w = t + (b - t) * 0.5
    pad = max(0, int((b - w) * (k - 1)) + 2); a = np.pad(a, ((pad, 0), (0, 0), (0, 0))); w += pad; b += pad
    H, W = a.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); wn = b - (b - w) * k
    sy = np.where(yy >= wn, b - (b - yy) / k, yy + (w - wn)).astype(np.float32)
    return np.clip(cv2.remap(a, xx, sy, cv2.INTER_LINEAR), 0, 255).astype(np.uint8)


def feet(a, ax, fy, h):
    """[(x, lift)] in heights from the anchor, front first: blobs of the bottom 10% of the figure"""
    import cv2
    t, b, _, _ = box(a); band = np.zeros(a.shape[:2], np.uint8); y0 = int(b - (b - t) * FOOT)
    band[y0:b + 1] = alpha(a)[y0:b + 1]
    n, lab, st, _ = cv2.connectedComponentsWithStats(band, 8); out = []
    for i in range(1, n):
        if st[i, 4] < 40: continue
        ys, xs = np.nonzero(lab == i); out.append((round(float((xs.mean() - ax) / h), 3), round(float((fy - ys.max()) / h), 3)))
    return sorted(out, reverse=True)


def fit_poses(ch, sheet, d, reuse=None):
    """Split one sheet and fit its 8 figures into d/pose<N>.png; returns (W, H, ax, fy, reference meta)."""
    pre, ref, cur, pron, who = CAST[ch]
    figs, floors = split_sheet(sheet)
    for dst, src in (reuse or {}).items():
        i, j = POSES.index(dst), POSES.index(src); figs[i], floors[i] = figs[j], floors[j]
    cur_a = [sprite(k) for k in cur]
    cur_h = float(np.median([box(a)[1] - box(a)[0] for a in cur_a])); cur_head = float(np.median([head(a)[1] for a in cur_a]))
    new_h = float(np.median([box(f)[1] - box(f)[0] for f in figs]))
    s = cur_h / new_h
    new_head = float(np.median([head(f)[1] for f in figs])) * s
    kh = float(np.clip(cur_head / new_head, 1 / 1.05, 1 / 0.95))           # legs = 2/kh - 1 stays within +-10%
    legs = 2 / kh - 1 if abs(kh - 1) > 0.02 else 1.0                 # keeps the height after a head-matching scale
    if legs == 1.0: kh = 1.0
    print(f'{ch}: height {new_h:.0f}px -> {cur_h:.0f} (x{s:.3f}); head {new_head:.1f} vs {cur_head:.1f} in the game: '
          + (f'scaled x{kh:.3f}, legs x{legs:.3f}' if kh != 1 else 'kept'))
    out = []
    for f, fl in zip(figs, floors):
        a = resize(f, s * kh)
        if legs != 1.0: a = stretch_legs(a, legs)
        out.append((a, fl * s))
    # one canvas: the head over the anchor as in the reference frame
    m = SPR[ref]; r = sprite(ref); dx = head(r)[0] - m['ax']               # head x relative to the anchor
    if m.get('facesLeft'): dx = -dx                                         # (the sheet faces right)
    L = max(head(a)[0] - box(a)[2] for a, _ in out) + 8; R = max(box(a)[3] - head(a)[0] for a, _ in out) + 8
    H = int(max(box(a)[1] - box(a)[0] + lift for a, lift in out) + PAD + 4)
    W = int(L + R); ax = L - dx; fy = H - 4.0
    frames = []
    for n, (a, lift) in zip(POSES, out):
        t, b, x0, x1 = box(a); hx = head(a)[0]
        c = Image.new('RGBA', (W, H)); c.alpha_composite(Image.fromarray(a, 'RGBA'), (int(round(L - hx)), int(round(fy - b - lift))))
        p = os.path.join(d, f'pose{n}.png'); c.save(p); frames.append(p)
    # heads: one shape across the stride
    hw = [head(np.asarray(Image.open(p)))[1] for p in frames]
    if abs(np.median(hw[:4]) / np.median(hw[4:]) - 1) > 0.02:
        print(f'{ch}: rows\' heads {np.median(hw[:4]):.1f} / {np.median(hw[4:]):.1f} px: head swap')
        subprocess.run([sys.executable, os.path.join(ROOT, 'scripts/walk_head_swap.py'), d, '0.15'], check=True)
    for n in (1, 9):
        p = os.path.join(d, f'pose{n}.png')
        subprocess.run([sys.executable, os.path.join(ROOT, 'scripts/walk_heel_down.py'), p, p, str(ax), str(fy), str(m['h'])], check=True)
    return W, H, ax, fy, m


def plant_of(n, a, ax, fy, h):
    """the foot carrying the weight, by the pose (the lowest foot misleads with heels and long skirts): contact 1/9
    front heel and back foot; down 3/11 the front foot; passing 5/13 the lowest; up 7/15 the back foot"""
    fts = feet(a, ax, fy, h)
    if n in (1, 9): return [fts[0][0], fts[-1][0]]
    if n in (3, 11): return [fts[0][0]]
    if n in (5, 13): return [min(fts, key=lambda f: f[1])[0]]
    return [fts[-1][0]]


def fit(ch):
    if ch == 'alan': sys.exit("Alan's chosen set is fitted by scripts/walk_sheet.py (this would overwrite it)")
    pre, ref, cur, pron, who = CAST[ch]; d = os.path.join(ROOT, f'art/review/{pre}/walk6')
    W, H, ax, fy, m = fit_poses(ch, os.path.join(d, f'sheet_raw_{SHEET[ch]}.png' if ch in SHEET else 'sheet_raw.png'), d, REUSE.get(ch))
    # candidates and plant data
    C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))
    ids = [f'{pre}_walk6_p{n}' for n in POSES]
    C['candidates'] = [c for c in C['candidates'] if not (c['char'] == ch and c.get('wire', {}).get('walkSlot') is not None)]
    plant = {}
    for slot, (n, cid) in enumerate(zip(POSES, ids)):
        im = Image.open(os.path.join(d, f'pose{n}.png')); a = np.asarray(im); t = box(a)[0]
        src = f'art/review/candidates/{cid}.webp'; im.save(os.path.join(ROOT, src), quality=92, method=6)
        meta = {'w': W, 'hh': H, 'h': m['h'], 'ax': round(ax, 1), 'fy': fy, 'top': float(t)}
        C['candidates'].append({'id': cid, 'char': ch, 'phase': 2, 'kind': 'walk', 'what': f'walk (one-sheet set): pose {n} of the walk chart',
                                'src': src, 'originals': [f'art/sprites/{ref}.webp'], 'meta': meta,
                                'wire': {'walkSlot': slot, 'walkBase': ids}})
        plant[cid] = plant_of(n, a, ax, fy, m['h'])
    json.dump(C, open(os.path.join(ROOT, 'art/review/candidates.json'), 'w'), indent=1)
    print(f'  plant {ch}: ' + ', '.join(f'{k}: [{", ".join(f"{v:.3f}" for v in vs)}]' for k, vs in plant.items()))
    return plant


def library(ch, out):
    """Every frame the cycle editor on the review page can choose from, fitted, with its meta and plant data:
    the chosen set (the candidates), the poses of the other Gemini tries, and the walk frames in the game now."""
    pre, ref, cur, pron, who = CAST[ch]; d = os.path.join(ROOT, f'art/review/{pre}/walk6'); lib = []
    C = {c['id']: c for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']}
    core = open(os.path.join(ROOT, 'js/story/core.js')).read()
    import re
    P = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r'(\w+_walk6_p\d+): \[([^\]]+)\]', core)}
    for n in POSES:
        k = f'{pre}_walk6_p{n}'; mm = C[k]['meta']
        lib.append({'id': k, 'group': 'new set', 'pose': n, 'src': C[k]['src'], 'meta': {x: mm[x] for x in ('ax', 'fy', 'h')}, 'plant': P[k]})
    tries = sorted(f for f in os.listdir(d) if re.match(r'sheet_raw_\d+\.png$', f))
    for f in tries:
        t = int(re.findall(r'\d+', f)[0])
        if t == SHEET.get(ch): continue
        td = os.path.join(out, f'{pre}_try{t}'); os.makedirs(td, exist_ok=True)
        try: W, H, ax, fy, m = fit_poses(ch, os.path.join(d, f), td)
        except SystemExit as e: print(f'{ch} try {t}: skipped ({e})'); continue
        for n in POSES:
            k = f'{pre}_try{t}_p{n}'; a = np.asarray(Image.open(os.path.join(td, f'pose{n}.png')))
            lib.append({'id': k, 'group': f'try {t}', 'pose': n, 'src': os.path.join(td, f'pose{n}.png'),
                        'meta': {'ax': round(ax, 1), 'fy': fy, 'h': m['h']}, 'plant': plant_of(n, a, ax, fy, m['h'])})
    for k in dict.fromkeys(cur):
        mm = SPR[k]; a = sprite(k)
        if mm.get('facesLeft'): a = a[:, ::-1]; ax = a.shape[1] - mm['ax']
        else: ax = mm['ax']
        fts = feet(np.ascontiguousarray(a), ax, mm['fy'], mm['h'])
        lib.append({'id': k, 'group': 'in the game now', 'pose': None, 'src': f'art/sprites/{k}.webp',
                    'meta': {'ax': mm['ax'], 'fy': mm['fy'], 'h': mm['h'], 'facesLeft': bool(mm.get('facesLeft'))},
                    'plant': [min(fts, key=lambda f: f[1])[0]] if fts else [0.0]})
    return lib


if __name__ == '__main__':
    cmd, who = sys.argv[1], sys.argv[2:] or list(CAST)
    for ch in who:
        pre, ref, cur, pron, desc = CAST[ch]; d = os.path.join(ROOT, f'art/review/{pre}/walk6'); os.makedirs(d, exist_ok=True)
        if cmd == 'generate':
            if ch == 'alan':  # a try for the library: painted in a scratch folder, kept as the next sheet_raw_<n>
                import shutil, tempfile; t = tempfile.mkdtemp(); generate(ref, desc, t, pron)
                n = 2; existing = os.listdir(d)
                while f'sheet_raw_{n}.png' in existing: n += 1
                shutil.move(os.path.join(t, 'sheet_raw.png'), os.path.join(d, f'sheet_raw_{n}.png'))
            else: generate(ref, desc, d, pron, flip=bool(SPR[ref].get('facesLeft')))
        elif cmd == 'fit': fit(ch)
        elif cmd == 'library':
            out = os.environ.get('LIB_OUT', '/tmp/walk_library'); os.makedirs(out, exist_ok=True)
            json.dump(library(ch, out), open(os.path.join(out, f'{ch}.json'), 'w'))
