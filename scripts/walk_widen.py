# A walk set painted too slim for its character (Lacerda's one-sheet walk, by the user's note: "he and his legs are too
# slim in comparison to other sprites"): widen the figure below the chin by k about the head's x, fading in over
# 24 px under the chin so the head keeps its painted shape. Works on the fitted pose PNGs in place; the canvas grows
# on both sides (the anchor x moves right by the printed pad).
#   python3 scripts/walk_widen.py <dir with pose<N>.png> <k> <chin as a share of the figure height>
import sys, numpy as np, cv2
from PIL import Image
d, k, chin = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
for n in (1, 3, 5, 7, 9, 11, 13, 15):
    p = f'{d}/pose{n}.png'; a = np.asarray(Image.open(p).convert('RGBA')).astype(np.float32); H, W = a.shape[:2]
    m = a[..., 3] > 128; ys = np.nonzero(m.any(1))[0]; t, b = ys.min(), ys.max()
    hr = [np.nonzero(m[j])[0] for j in range(t, t + int((b - t) * 0.09))]; cx = float(np.mean([(r.min() + r.max()) / 2 for r in hr if len(r)]))
    pad = int(W * (k - 1) / 2) + 4; a = np.pad(a, ((0, 0), (pad, pad), (0, 0))); cx += pad; W2 = a.shape[1]
    yy, xx = np.mgrid[0:H, 0:W2].astype(np.float32); cut = t + chin * (b - t)
    kk = 1 + (k - 1) * np.clip((yy - cut) / 24, 0, 1)                       # 1 at the chin, k from 24 px below
    sx = (cx + (xx - cx) / kk).astype(np.float32)
    out = np.clip(cv2.remap(a, sx, yy, cv2.INTER_LINEAR), 0, 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(p)                                     # the canvas grows by pad on each side
    print(f'pose{n}: widened x{k} below row {cut:.0f}; canvas +{pad} px each side (add it to the anchor x)')
