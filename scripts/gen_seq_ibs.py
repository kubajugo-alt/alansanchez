# In-betweens for Alan's scripted sequences (the bath, the swim, dressing in the cabin): one Gemini painting halfway
# between two frames that follow each other and neither morph nor have an in-between. They go to
# art/review/alan/phase2/ib_<a>__<b>.png and onto the review screen (scripts/review_candidates.py, SEQ_IBS).
#   python3 scripts/gen_seq_ibs.py [a>b ...]          (default: every pair in SEQ_IBS without a painting yet)
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/alan/phase2/')
LIST = os.path.join(ROOT, 'scripts/seq_ibs.json')   # [[a, b, what the in-between shows], ...]


def name(a, b): return f"ib_{a.replace('alan_', '')}__{b.replace('alan_', '')}"


def one(job):
    a, b, what = job
    out = OUT + name(a, b) + '.png'
    if os.path.exists(out): return f'{a}>{b}: kept'
    prompt = (f'Paint the moment EXACTLY HALFWAY between the first image and the second: {what}. '
              'His body, limbs and clothes are halfway from the first pose to the second, as one frame of a smooth animation '
              'between them. Same person, same face, hair, clothes and props as in both images, same size, same lighting and '
              'same painted style; he faces the same way as in the first image. He has exactly two arms and two legs. '
              'Do not mirror the picture.')
    sp = lambda n: os.path.join(ROOT, f'art/sprites/{n}.webp')
    r = subprocess.run([sys.executable, 'scripts/gen_image.py', '--ref', sp(a), '--ref', sp(b), '--match-height', '--no-palette',
                        '--prompt', prompt, '--out', out], cwd=ROOT, capture_output=True, text=True, timeout=600)
    return f'{a}>{b}: ' + (r.stdout.strip().splitlines() or [r.stderr.strip()[-200:]])[-1]


if __name__ == '__main__':
    jobs = json.load(open(LIST))
    if sys.argv[1:]: jobs = [j for j in jobs if f'{j[0]}>{j[1]}' in sys.argv[1:]]
    os.makedirs(OUT, exist_ok=True)
    with ThreadPoolExecutor(6) as ex:
        for msg in ex.map(one, jobs): print(msg, flush=True)
