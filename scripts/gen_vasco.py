# Vasco's new frames (the map: story actions and transitions, idle activities, talk, walks): one Gemini edit of his
# existing paintings per frame. The list is scripts/vasco_frames.json ([{name, group, refs, height, what, prompt}]);
# results go to art/review/vasco/<name>.png and onto the review screen (scripts/review_candidates.py, VASCO).
#   python3 scripts/gen_vasco.py [name ...]          (default: every frame without a painting yet)
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/vasco/')
LIST = os.path.join(ROOT, 'scripts/vasco_frames.json')
LOOK = ('Same man (Dr. Vasco Teles) as in the first image: same face, dark tousled hair, brown tweed jacket with the '
        'sleeves pushed up, light blue shirt, loosened dark tie, a key on a cord round his neck, khaki trousers dusty at '
        'the knees, brown boots; same size, lighting and painted style. He faces the same way as in the first image. '
        'Do not mirror the picture. He has exactly two arms and two legs.')


def one(job):
    out = OUT + job['name'] + '.png'
    if os.path.exists(out): return f"{job['name']}: kept"
    cmd = [sys.executable, 'scripts/gen_image.py']
    for r in job['refs']: cmd += ['--ref', os.path.join(ROOT, r if '/' in r else f'art/sprites/{r}.webp')]  # a sprite name, or a path
    if job.get('height'): cmd.append('--match-height')
    cmd += ['--prompt', job['prompt'] + ' ' + LOOK, '--out', out]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=600)
    return f"{job['name']}: " + (r.stdout.strip().splitlines() or [r.stderr.strip()[-200:]])[-1]


if __name__ == '__main__':
    jobs = json.load(open(LIST))
    if sys.argv[1:]: jobs = [j for j in jobs if j['name'] in sys.argv[1:]]
    os.makedirs(OUT, exist_ok=True)
    with ThreadPoolExecutor(6) as ex:
        for msg in ex.map(one, jobs): print(msg, flush=True)
