# The two halves of a one-sheet walk (scripts/walk_sheet.py) can come back with the hair painted a little differently
# (Alan's far-leg row had the back of the hair slimmer), which flickers twice a step. This gives each frame of the
# second half the head of its counterpart in the first half (1->9, 3->11, 5->13, 7->15): the counterpart's head is
# aligned on the face (smallest difference over small shifts), pasted above the chin and blended into the neck.
#   python3 scripts/walk_head_swap.py <dir with pose<N>.png> <chin as a share of the figure height, e.g. 0.15>
import sys, numpy as np
from PIL import Image
d, chin = sys.argv[1], float(sys.argv[2])
PAIRS = [(1, 9), (3, 11), (5, 13), (7, 15)]
for src, dst in PAIRS:
    A = np.asarray(Image.open(f'{d}/pose{src}.png').convert('RGBA')).astype(np.float32)
    B = np.asarray(Image.open(f'{d}/pose{dst}.png').convert('RGBA')).astype(np.float32)
    rows = np.nonzero((B[..., 3] > 128).any(1))[0]; top, bot = rows.min(), rows.max()
    cut = int(top + chin * (bot - top)); face = slice(top + int(0.03 * (bot - top)), cut)    # forehead to chin
    best = None
    for dy in range(-12, 13):
        for dx in range(-20, 21):
            a = np.roll(np.roll(A, dy, 0), dx, 1)
            e = np.abs(a[face, :, :3] - B[face, :, :3]).mean() + np.abs(a[face, :, 3] - B[face, :, 3]).mean()
            if best is None or e < best[0]: best = (e, dy, dx)
    a = np.roll(np.roll(A, best[1], 0), best[2], 1)
    # weight 1 above the chin, fading to 0 over 10 px into the neck; only where the head is (top fifth of the figure)
    y = np.arange(B.shape[0])[:, None].astype(np.float32)
    w = np.clip((cut + 10 - y) / 10, 0, 1) * np.ones((1, B.shape[1]), np.float32)
    w[:top - 20 if top > 20 else 0] = 1
    out = a * w[..., None] + B * (1 - w[..., None])
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA').save(f'{d}/pose{dst}.png')
    print(f'pose{dst}: head from pose{src}, shifted {best[2]:+d},{best[1]:+d} px (difference {best[0]:.1f})')
