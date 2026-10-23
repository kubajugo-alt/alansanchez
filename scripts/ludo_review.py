#!/usr/bin/env python3
# The Ludo runs ready for the user's review: fits every finished run that has no candidates yet (scripts/ludo_fit.py,
# scripts/ludo_walk_fit.py) and builds the review board's files in art/review/ludo/board/:
#   <name>.webp   one strip per run: painting A, the run's frames, painting B (a walk: its cycle), each cell placed
#                 on his feet at one scale, so the strip plays back as it would on screen
#   runs.json     per run: what it is, its frames and frame rate, the consistency readings, the credits it cost
#   python3 scripts/ludo_review.py [--refit]
import json, os, subprocess, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LUDO = os.path.join(ROOT, 'art/review/ludo'); BOARD = os.path.join(LUDO, 'board')
CELL_H = 300; FOOT = 288   # the strip's cell height and where his feet sit in it (px)
sys.path.insert(0, os.path.join(ROOT, 'scripts')); import ludo_fit as LF


def cell(im, m, flip, w):
    """A frame on a cell: scaled so his standing height is 260 px, its anchor at the cell's centre and FOOT."""
    s = 260 / m['h']
    ax = im.width - m['ax'] if flip else m['ax']
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    c = Image.new('RGBA', (w, CELL_H)); c.paste(im, (round(w / 2 - ax * s), round(FOOT - m['fy'] * s)), im)
    return c


def main():
    spec = json.load(open(os.path.join(ROOT, 'scripts/ludo_alan.json')))['runs']
    refit = '--refit' in sys.argv
    os.makedirs(BOARD, exist_ok=True)
    C = {c['id']: c for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']}
    S = LF.sprites()
    out = []
    for r in spec:
        d = os.path.join(LUDO, r['name']); jp = os.path.join(d, 'job.json')
        if not os.path.exists(jp) or 'up' not in json.load(open(jp)) or not os.path.exists(os.path.join(d, 'up')): continue
        if refit or not os.path.exists(os.path.join(d, 'fit.json')):
            cmd = ['python3', 'scripts/ludo_walk_fit.py', r['name'], r['slot'], r['base']] if r.get('slot') else ['python3', 'scripts/ludo_fit.py', r['name']] + (['--pair', r['pair']] if r.get('pair') else [])
            print(subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True).stdout.strip())
            C = {c['id']: c for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']}
        job = json.load(open(jp))
        pre = f'pair_lu_{r["name"]}_' if r.get('pair') else f'alan_lu_{r["name"]}_'
        ids = sorted(k for k in C if k.startswith(pre))
        if not ids: continue
        walk = bool(r.get('slot'))
        keys = [] if walk else [k for k in (r['a'], r.get('mid'), r['b']) if k]
        segs = []
        if not walk:   # the run's segments in order: A, its frames, (mid, its frames,) B
            seq = [('key', keys[0])]
            for j, seg in enumerate('abc'[:len(keys) - 1]):
                seq += [('lu', k) for k in ids if k[len(pre)] == seg] + [('key', keys[j + 1])]
            W_ = lambda c: c['wire'].get('inbetween') or c['wire'].get('pairRun') or {('(standing) > ' + k): 0 for k in c['wire'].get('pairRunIn', {})}
            segs = sorted({next(iter(W_(C[k]))) for k in ids})
        else: seq = [('lu', k) for k in ids]
        cells = []
        W = 420 if r.get('pair') else 220 if not walk else 180
        for kind, k in seq:
            if kind == 'key':
                im, m = LF.load_key(k, S)
                cells.append(cell(im, m, bool(m.get('facesLeft')), W))
            else:
                cells.append(cell(Image.open(os.path.join(ROOT, C[k]['src'])).convert('RGBA'), C[k]['meta'], False, W))
        strip = Image.new('RGBA', (W * len(cells), CELL_H))
        for i, c in enumerate(cells): strip.alpha_composite(c, (i * W, 0))
        strip.save(os.path.join(BOARD, r['name'] + '.webp'), 'WEBP', quality=86, method=6)
        cons = [C[k].get('consistency', {}) for k in ids]
        fps = None if walk else next(iter((C[ids[0]]['wire'].get('ibFps') or C[ids[0]]['wire'].get('pairRunFps') or {}).values()), None)
        out.append({'name': r['name'], 'walk': r.get('slot'), 'keys': keys, 'cells': [k for _, k in seq], 'w': W, 'h': CELL_H,
                    'what': r.get('what', r['name']), 'note': r.get('note', ''), 'frames': len(ids), 'fps': fps, 'wires': segs if not walk else [r['slot']], 'bath': bool(r.get('bath')),
                    'credits': sum(job[x].get('credits', 0) for x in ('hydra', 'improve') if x in job),
                    'flags': sorted({f for c in cons for f in c.get('flags', [])}),
                    'worst': {'drift': max((c.get('drift', 0) for c in cons), default=0), 'head': min((c.get('head', 1) for c in cons), default=1),
                              'height': max((c.get('height', 0) for c in cons), default=0)}})
    json.dump({'runs': out}, open(os.path.join(BOARD, 'runs.json'), 'w'), indent=1)
    print(len(out), 'runs on the board')


if __name__ == '__main__':
    main()
