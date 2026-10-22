# The shop at a real scale, as patches on the original painting: each object edited up close in a crop (Gemini,
# art/review/shop/crops/) and pasted back only inside a box around the object, feathered, so the rest of the
# painting keeps its own pixels (the books, the desk, the furniture's texture).
#   python3 scripts/shop_patch.py [src.jpg] [out.jpg]     (default art/bg/shop.jpg -> art/review/bg/shop_new.jpg)
import json, sys, numpy as np, cv2
from PIL import Image
D = 'art/review/shop/crops'
src = sys.argv[1] if len(sys.argv) > 1 else 'art/bg/shop.jpg'
out = sys.argv[2] if len(sys.argv) > 2 else 'art/review/bg/shop_new.jpg'
crops = json.load(open(f'{D}/boxes.json'))
# edited crop, and the box (in painting px) that takes it: the old object and the new one, with room to feather
# (the counter takes two boxes: the till's, by the wall, and the counter top's under the door glass, which keeps its own)
PATCH = {'lamp': ('lamp_edit.png', [(100, 345, 256, 452)]),  # the new lamp only; the shelf above it is rebuilt below 'counter': ('counter_edit2.png', [(842, 205, 1018, 474), (1018, 326, 1266, 474)]),
         'tin': ('tin_edit.png', [(636, 346, 708, 418)])}
base = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
res = base.copy()
for k, (f, boxes) in PATCH.items():
    cx0, cy0, cx1, cy1 = crops[k]
    ed = np.asarray(Image.open(f'{D}/{f}').convert('RGB').resize((cx1 - cx0, cy1 - cy0), Image.LANCZOS)).astype(np.float32)
    full = base.copy(); full[cy0:cy1, cx0:cx1] = ed
    m = np.zeros(base.shape[:2], np.float32)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 1
    m = cv2.GaussianBlur(m, (0, 0), 5)
    res = res * (1 - m[..., None]) + full * m[..., None]
# the shelf behind the old, bigger shade (x 112-238, y 288-345), rebuilt from the painting's own books, never repainted:
# the standing books' bottoms carried straight down, then the plank and the lying books continued from their left
src_img = base
sh = res.copy()
X0, X1, Y0, Y1 = 112, 238, 288, 345
sh[Y0:295, X0:X1] = src_img[287:288, X0:X1]
w = X0 - 40
for x in range(X0, X1):
    i = (x - X0) % (2 * w); sx = X0 - 1 - i if i < w else 40 + (i - w)   # mirrored, so the copies meet without a seam
    sh[295:Y1, x] = src_img[295:Y1, sx]
# then each row's light runs evenly from its left neighbour to its right one (the copies were lit differently)
band = sh[295:Y1, X0:X1]
smooth = cv2.GaussianBlur(band, (0, 0), sigmaX=14, sigmaY=1.5) + 1
L = src_img[295:Y1, X0 - 8:X0].mean(1, keepdims=True); R = src_img[295:Y1, X1:X1 + 8].mean(1, keepdims=True)
t = np.linspace(0, 1, X1 - X0)[None, :, None]
sh[295:Y1, X0:X1] = band * ((L * (1 - t) + R * t + 1) / smooth)
m = np.zeros(base.shape[:2], np.float32); m[Y0:Y1, X0:X1] = 1; m = cv2.GaussianBlur(m, (0, 0), 2)
res = res * (1 - m[..., None]) + sh * m[..., None]
Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(out, quality=94)
print('wrote', out)
