#!/usr/bin/env python3
"""Ludo frames (scripts/ludo.py, the 1.5x upscaled export) made ready for the game, and a preview for the review page.

  python3 sequel/scripts/ludo_fit.py [names...]      (no names: every finished run in scripts/ludo_runs.json)

For each run, reads art/review/ludo/<name>/up/f*.png (transparent, one figure on Ludo's fixed canvas). The camera in
Ludo's canvas does not move, so every frame is cropped to the same box (the union of the figure over all frames) and
scaled by one factor, chosen so the figure in the first frame (the keyframe pose) is 720 px tall, as the game's
figures are. That keeps the motion exactly as Ludo drew it: no frame is re-centred, so nothing slides or jumps.
Writes art/review/ludo/<name>/fit/fNN.webp and fit.json: the frames' sprite data (w, hh, h, ax, fy, top: the same
fields as js/sprites.js; ax/fy are the first frame's feet) and per-frame checks (the figure's height against the
first frame, and how far the feet's centre moves), flagged past the limits. Nothing goes into the game here: the
review page decides. With --preview DIR it also writes DIR/<name>.webp, an animated preview 300 px tall.
"""
import glob, json, os, sys
import numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SEQ, 'art/review/ludo')
LIMITS = {'height': 0.08, 'feet': 0.10}   # height change vs frame 0; feet-centre drift as a share of the figure's height
FPS = {'talk': 10, 'walk': 12, 'turn': 12, 'act': 12}


def kind(name):
    for k in ('walk', 'turn', 'talk'):
        if '_' + k in name or name.startswith(k + '_'): return k
    return 'act'


def bbox(a):
    ys, xs = np.where(a > 24)
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1) if len(xs) else None


def feet(a):
    """The feet's centre: the middle of the lowest 4% of the figure's rows."""
    ys, xs = np.where(a > 24)
    lo = ys.max() - max(4, int(0.04 * (ys.max() - ys.min())))
    return float(xs[ys >= lo].mean()), float(ys.max())


def fit(name, preview_dir=None):
    d = os.path.join(OUT, name)
    fs = sorted(glob.glob(os.path.join(d, 'up', 'f*.png')))
    if not fs: return None
    ims = [Image.open(f).convert('RGBA') for f in fs]
    al = [np.asarray(i)[:, :, 3] for i in ims]
    bbs = [bbox(a) for a in al]
    x0 = min(b[0] for b in bbs); y0 = min(b[1] for b in bbs); x1 = max(b[2] for b in bbs); y1 = max(b[3] for b in bbs)
    pad = 12; x0 = max(0, x0 - pad); y0 = max(0, y0 - pad); x1 = min(ims[0].width, x1 + pad); y1 = min(ims[0].height, y1 + pad)
    h0 = bbs[0][3] - bbs[0][1]
    s = 720.0 / h0
    W, H = round((x1 - x0) * s), round((y1 - y0) * s)
    fd = os.path.join(d, 'fit'); os.makedirs(fd, exist_ok=True)
    for f in glob.glob(os.path.join(fd, '*.webp')): os.remove(f)
    fx0, fy0 = feet(al[0])
    checks, frames = [], []
    for i, (im, a, b) in enumerate(zip(ims, al, bbs)):
        out = im.crop((x0, y0, x1, y1)).resize((W, H), Image.LANCZOS)
        out.save(os.path.join(fd, f'f{i:02d}.webp'), 'WEBP', quality=90, method=6)
        frames.append(out)
        fx, fy = feet(a)
        hr = (b[3] - b[1]) / h0
        drift = abs(fx - fx0) / h0
        flag = abs(hr - 1) > LIMITS['height'] or (kind(name) in ('talk', 'act') and drift > LIMITS['feet'])
        checks.append({'i': i, 'height': round(hr, 3), 'feet_drift': round(drift, 3), 'flag': bool(flag)})
    meta = {'w': W, 'hh': H, 'h': 720.0, 'ax': round((fx0 - x0) * s, 1), 'fy': round((fy0 - y0) * s, 1),
            'top': round((bbs[0][1] - y0) * s, 1)}
    res = {'name': name, 'kind': kind(name), 'frames': len(fs), 'fps': FPS[kind(name)], 'meta': meta,
           'flagged': sum(c['flag'] for c in checks), 'checks': checks}
    json.dump(res, open(os.path.join(d, 'fit.json'), 'w'), indent=1)
    if preview_dir:
        os.makedirs(preview_dir, exist_ok=True)
        ph = 300; pw = round(W * ph / H)
        bg = Image.new('RGBA', (pw, ph), (236, 231, 222, 255))
        pv = []
        for fr in frames:
            c = bg.copy(); c.alpha_composite(fr.resize((pw, ph), Image.LANCZOS)); pv.append(c.convert('RGB'))
        pv[0].save(os.path.join(preview_dir, name + '.webp'), 'WEBP', save_all=True, append_images=pv[1:],
                   duration=round(1000 / res['fps']), loop=0, quality=72, method=4)
    return res


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    pv = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None
    if pv in args: args.remove(pv)
    names = args or [r['name'] for r in json.load(open(os.path.join(SEQ, 'scripts/ludo_runs.json')))['runs']]
    for n in names:
        r = fit(n, pv)
        if r: print(f"{n}: {r['frames']} frames, {r['meta']['w']}x{r['meta']['hh']}, flagged {r['flagged']}")
