# Gemini in-betweens for the way into and out of every combined sprite (scripts/pair_ibs.json), 4 at a time.
#   python3 scripts/gen_pair_ibs.py [pair_key ... | steps]     (existing results are kept; delete one to redo it)
# 'steps': the in-betweens from one pair painting to the next in a sequence (scripts/pair_ibs.json 'steps').
# Each call edits the pair painting itself, with the partner's and Alan's solo frames as the other references,
# so both people stay the same; the results go to art/review/alan/phase3/ib_<pair>_<in|out>.png for review.
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(ROOT, 'scripts/pair_ibs.json')))['pairs']
SP = lambda k: f'art/sprites/{k}.webp'


def prompt(who, side, d, note=''):
    alan, them = ('left', 'right') if side[0] == 0 else ('right', 'left')
    head = (f'TWO people, exactly as in the first image: {who} on the {them} and Alan (dark hair, brown leather jacket, '
            f'blue jeans) on the {alan}, the same size, on the same floor line, in the same framing as the first image. '
            'The SECOND image is the other person on their own, the THIRD is Alan on his own. ' + (note + ' ' if note else ''))
    if d == 'in':
        return head + ('This is an in-between frame for the moment Alan steps into the pose of the first image: draw the moment JUST BEFORE it, '
                       'the two of them a little further apart, Alan\'s arms and hands only starting toward the pose in the first image, '
                       'the other person still standing as in their solo image. Keep both faces, builds and clothes exactly as in the images.')
    return head + ('This is an in-between frame for the moment Alan steps back out of the pose of the first image: draw the moment JUST AFTER it, '
                   'Alan\'s hands leaving the other person and dropping toward his sides, his weight going back onto his own feet, '
                   'the other person settling back toward their solo pose. Keep both faces, builds and clothes exactly as in the images.')


def job(args):
    key, solo, who, side, d, note = args
    out = f'art/review/alan/phase3/ib_{key[5:]}_{d}.png'
    if os.path.exists(os.path.join(ROOT, out)): return f'{out} (kept)'
    r = subprocess.run([sys.executable, 'scripts/gen_image.py', '--ref', SP(key), '--ref', SP(solo), '--ref', SP('alan_side'),
                        '--prompt', prompt(who, side, d, note), '--out', out], cwd=ROOT, capture_output=True, text=True)
    return (r.stdout.strip().splitlines() or [''])[-1] if r.returncode == 0 else f'{out} FAILED: {(r.stderr or r.stdout).strip().splitlines()[-1:]}'


def step_job(args):
    a, b, who = args
    out = f'art/review/alan/phase3/ib_{a[5:]}__{b.split("_")[-1]}.png'
    if os.path.exists(os.path.join(ROOT, out)): return f'{out} (kept)'
    pr = (f'TWO people, exactly as in the first image: {who} and Alan (dark hair, blue jeans), the same size, on the same floor line, '
          'in the same framing as the first image. This is an in-between frame from the pose in the FIRST image to the pose in the SECOND image: '
          'draw the moment half way between the two, the same two people in the same places, their arms, hands and heads part way '
          'from the first pose to the second, with clothes exactly as in the FIRST image. Keep both faces, builds and clothes exactly as in the images.')
    r = subprocess.run([sys.executable, 'scripts/gen_image.py', '--ref', SP(a), '--ref', SP(b), '--prompt', pr, '--out', out], cwd=ROOT, capture_output=True, text=True)
    return (r.stdout.strip().splitlines() or [''])[-1] if r.returncode == 0 else f'{out} FAILED: {(r.stderr or r.stdout).strip().splitlines()[-1:]}'


only = sys.argv[1:]
steps = json.load(open(os.path.join(ROOT, 'scripts/pair_ibs.json'))).get('steps', [])
if not only or 'steps' in only:
    with ThreadPoolExecutor(4) as ex:
        for line in ex.map(step_job, [(a, b, w) for a, b, w, _ in steps]): print(line, flush=True)
    if only: sys.exit()
jobs = [(r[0], r[1], r[2], r[3], d, r[6] if len(r) > 6 else '') for r in T if not only or r[0] in only for d in r[4]]
with ThreadPoolExecutor(4) as ex:
    for line in ex.map(job, jobs): print(line, flush=True)
