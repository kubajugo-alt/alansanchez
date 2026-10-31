#!/usr/bin/env python3
"""Add (or replace) approved Ludo runs in the game without rebuilding the others.

  python3 sequel/scripts/ludo_add.py <run> [<run> ...]

scripts/ludo_install.py rebuilds every run from art/review/ludo/<run>/fit/, which a fresh container doesn't have (fit/ is
git-ignored), and would undo scripts/walk_loop.py's loops. This takes only the runs named: their fitted frames
(scripts/ludo_fit.py) are copied to art/sprites/<run>_NN.webp, their sprite data and window.LUDO entry (frames, fps, and
for an action its hold frame, scripts/ludo_measure.py) are merged into js/sprites_ludo.js, everything else kept as it is.
HOLD overrides the measured hold frame where the story should wait somewhere else.
"""
import glob, json, os, shutil, subprocess, sys

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SEQ, 'scripts'))
import ludo_measure

L = os.path.join(SEQ, 'art/review/ludo')
SPR = os.path.join(SEQ, 'art/sprites')
LUDO_JS = os.path.join(SEQ, 'js/sprites_ludo.js')
# the smoking in-betweens run from one painted pose to the next and wait on the last frame (the pose itself)
HOLD = {}


def game_data():
    js = "global.window={};require('./js/sprites_ludo.js');console.log(JSON.stringify({S:window.SPRITES,L:window.LUDO}))"
    return json.loads(subprocess.run(['node', '-e', js], cwd=SEQ, capture_output=True, text=True, check=True).stdout)


def header():
    with open(LUDO_JS) as f:
        return [l for l in f.read().split('\n') if l.startswith('//')]


if __name__ == '__main__':
    runs = sys.argv[1:]
    if not runs: sys.exit(__doc__)
    data, head = game_data(), header()
    S, Ld = data['S'], data['L']
    for n in runs:
        fit = json.load(open(os.path.join(L, n, 'fit.json'))); m = fit['meta']
        files = sorted(glob.glob(os.path.join(L, n, 'fit', 'f*.webp')))
        for k in Ld.get(n, {}).get('frames', []): S.pop(k, None)
        for f in glob.glob(os.path.join(SPR, n + '_[0-9][0-9].webp')): os.remove(f)
        keys = []
        for i, f in enumerate(files):
            key = f'{n}_{i:02d}'; keys.append(key)
            shutil.copyfile(f, os.path.join(SPR, key + '.webp'))
            S[key] = dict(m)
        e = {'frames': keys, 'fps': fit['fps']}
        if '_smoke_' in n: e['hold'] = len(keys) - 1
        else: e.update(ludo_measure.action(n))
        if n in HOLD: e['hold'] = HOLD[n]
        Ld[n] = e
        print(f'{n}: {len(keys)} frames, hold {e.get("hold")}')
    if not any('ludo_add.py' in l for l in head): head.append('// Runs added later by scripts/ludo_add.py (merged, the others untouched).')
    with open(LUDO_JS, 'w') as f:
        f.write('\n'.join(head) + '\n')
        f.write('window.SPRITES = Object.assign(window.SPRITES || {}, ' + json.dumps(S, separators=(',', ':')) + ');\n')
        f.write('window.LUDO = ' + json.dumps(Ld, indent=1) + ';\n')
