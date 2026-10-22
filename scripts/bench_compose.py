# The bench man on one bench: every frame becomes the same empty bench (art/review/bench/bench_empty_front.png,
# painted from npc_bench_talk1) with that frame's man (art/review/bench/man_<frame>.png, Gemini, the bench
# painted out) sat on it, so the bench never moves when his frames swap.
#   python3 scripts/bench_compose.py        -> art/review/bench/out/<frame>.png + meta.json + sheet.png
# Placement: the man keeps his place on the bench from his own painting (the painted bench's width and
# bottom map to the empty bench's); his size is the same in every frame (his head, measured on the man alone).
import json, os, sys
import cv2, numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
import gen_image as gi
D = os.path.join(ROOT, 'art/review/bench'); OUT = os.path.join(D, 'out'); os.makedirs(OUT, exist_ok=True)
FR = ['npc_bench', 'npc_bench_awake', 'npc_bench_b', 'npc_bench_confide', 'npc_bench_doze2', 'npc_bench_drowsy',
      'npc_bench_talk1', 'npc_bench_talk2', 'npc_bench_talk3', 'npc_bench_wistful']
t = open(os.path.join(ROOT, 'js/sprites.js')).read(); META = json.loads(t[t.index('{'):t.rindex('}') + 1])


def rgba(p): return np.asarray(Image.open(p).convert('RGBA'))


def bench_mask(a):
    """The painted bench in an original frame: green-tinted paint (rough, used only for its extent)."""
    b, g, r = a[..., 2].astype(int), a[..., 1].astype(int), a[..., 0].astype(int)
    m = (g > r + 4) & (g >= b - 2) & (a[..., 3] > 128)
    return cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)


def extent(m):
    ys, xs = np.where(m)
    return np.percentile(xs, 1), np.percentile(xs, 99), np.percentile(ys, 99)


def man_of(k, orig):
    man = Image.open(os.path.join(D, f'man_{k}.png')).convert('RGBA')  # keyed by gen_image (raw kept out of git)
    # colours: matched to the man's own pixels in the original (not the bench's green)
    ref = orig.copy(); ref[..., 3] = np.where(bench_mask(orig), 0, ref[..., 3])
    man = gi.match_palette(man, Image.fromarray(ref, 'RGBA'))
    a = np.asarray(man); ys, xs = np.where(a[..., 3] > 128)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def place_on_orig(man, orig):
    """Scale and offset that lay the man alone over his original painting (SIFT on the man)."""
    sift = cv2.SIFT_create(4000)
    g1 = cv2.cvtColor(np.ascontiguousarray(man[..., :3]), cv2.COLOR_RGB2GRAY); g2 = cv2.cvtColor(np.ascontiguousarray(orig[..., :3]), cv2.COLOR_RGB2GRAY)
    k1, d1 = sift.detectAndCompute(g1, (man[..., 3] > 128).astype(np.uint8) * 255)
    k2, d2 = sift.detectAndCompute(g2, (~bench_mask(orig) & (orig[..., 3] > 128)).astype(np.uint8) * 255)
    ms = [m for m, n in (x for x in cv2.BFMatcher().knnMatch(d1, d2, k=2) if len(x) == 2) if m.distance < 0.75 * n.distance]
    P = np.float32([k1[m.queryIdx].pt for m in ms]); Q = np.float32([k2[m.trainIdx].pt for m in ms])
    T, inl = cv2.estimateAffinePartial2D(P, Q, method=cv2.RANSAC, ransacReprojThreshold=4)
    return float(np.hypot(T[0, 0], T[1, 0])), float(T[0, 2]), float(T[1, 2]), int(inl.sum())


def main():
    plate = np.asarray(Image.open(os.path.join(D, 'bench_empty_front.png')).convert('RGBA'))
    ys, xs = np.where(plate[..., 3] > 128); plate = plate[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    PW, PH = plate.shape[1], plate.shape[0]
    res = {}
    for k in FR:
        orig = rgba(os.path.join(ROOT, f'art/sprites/{k}.webp'))
        man = man_of(k, orig)
        s, tx, ty, n = place_on_orig(man, orig)
        x0, x1, yb = extent(bench_mask(orig))
        K = PW / (x1 - x0)  # original px -> plate px
        res[k] = dict(man=man, s=s * K, x=(tx - x0) * K, y=(ty - yb) * K + PH, inliers=n)
        print(f'{k:22s} man on original: scale {s:.3f} inliers {n}; bench width {x1 - x0:.0f}px -> plate x{K:.3f}')
    # one size for him in every frame: the median of the frames' scales
    S = float(np.median([r['s'] for r in res.values()]))
    top = min(r['y'] for r in res.values()); left = min(0, min(r['x'] for r in res.values()))
    right = max(PW, max(r['x'] + r['man'].shape[1] * S for r in res.values()))
    bottom = max(PH, max(r['y'] + r['man'].shape[0] * S for r in res.values()))
    pad = 8; W = int(right - left) + 2 * pad; H = int(bottom - min(0, top)) + 2 * pad
    ox, oy = -left + pad, -min(0, top) + pad
    meta = {}
    for k, r in res.items():
        c = Image.new('RGBA', (W, H)); c.alpha_composite(Image.fromarray(plate, 'RGBA'), (int(ox), int(oy)))
        m = Image.fromarray(r['man'], 'RGBA'); sz = (round(m.width * S), round(m.height * S))
        # keep each man's seat where his own painting had it: scale about his own placement point
        cx = r['x'] + r['man'].shape[1] * (r['s'] - S) / 2; cy = r['y'] + r['man'].shape[0] * (r['s'] - S)
        c.alpha_composite(m.resize(sz, Image.LANCZOS), (int(ox + cx), int(oy + cy)))
        c.save(os.path.join(OUT, f'{k}.png'))
    print('canvas', W, H, 'man scale', round(S, 3))
    json.dump(dict(W=W, H=H, plate=[ox, oy, PW, PH]), open(os.path.join(OUT, 'layout.json'), 'w'))


if __name__ == '__main__':
    main()
