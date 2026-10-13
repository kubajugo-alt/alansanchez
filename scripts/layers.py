# Cuts animation layers out of the painted backgrounds using "clean plates"
# (the same painting regenerated without an object).
#   python3 scripts/layers.py <dir with plate_shop.png, plate_antiques.png, plate_cistern.png>
# Writes art/layers/*.webp; prints each layer's position for js/story.js.
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out = os.path.join(root, 'art', 'layers')
W, H = 1280, 720

def load(p): return np.asarray(Image.open(p).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
def diffmask(a, b, box, thr=18, grow=3, feather=1.6, keep=None):
    x0, y0, x1, y1 = box
    d = ndi.gaussian_filter(np.abs(a - b).mean(2), 1.5)
    m = np.zeros((H, W), bool); m[y0:y1, x0:x1] = d[y0:y1, x0:x1] > thr
    if keep is not None: m &= keep
    m = ndi.binary_opening(m, iterations=1)
    lab, n = ndi.label(m)
    if n:
        sizes = ndi.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 40])
    m = ndi.binary_fill_holes(ndi.binary_closing(m, iterations=3))
    m = ndi.binary_dilation(m, iterations=grow)
    return np.clip(ndi.gaussian_filter(m.astype(np.float32), feather) * 1.2, 0, 1)
def save(name, rgb, alpha):
    ys, xs = np.where(alpha > 0.01)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgba = np.dstack([rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1] * 255]).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(os.path.join(out, name + '.webp'), 'WEBP', quality=92, method=6)
    print(name, json.dumps({'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}))

bg = lambda n: load(os.path.join(root, 'art', 'bg', n + '.jpg'))
plate = lambda n: load(os.path.join(src, 'plate_' + n + '.png'))

# bookshop: the desk without the magnifying glass
a, p = bg('shop'), plate('shop')
save('shop_nomag', p, diffmask(a, p, (185, 415, 310, 458), thr=14, grow=5, feather=2.5))

# antiques: empty display case; clock case without weights/pendulum; pendulum; weights
a, p = bg('antiques'), plate('antiques')
save('antiques_case', p, diffmask(a, p, (668, 300, 862, 418), thr=16, grow=4, feather=2))
clock = diffmask(a, p, (535, 215, 610, 405), thr=14, grow=2, feather=1.2)
save('antiques_clock', p, np.clip(ndi.gaussian_filter((clock > 0.02).astype(np.float32), 2) * 1.5, 0, 1))
yy, xx = np.mgrid[0:H, 0:W]
# pendulum = the centre rod and the disc; the side chains with weights hang still
pend = ((np.abs(xx - 571) <= 7) & (yy >= 226) & (yy <= 350)) | (((xx - 570) / 25.0) ** 2 + ((yy - 367) / 24.0) ** 2 <= 1)
pend = np.clip(ndi.gaussian_filter(pend.astype(np.float32), 1) * 1.3, 0, 1) * (clock > 0.02)
save('antiques_pendulum', a, pend)
save('antiques_weights', a, np.clip(clock - pend, 0, 1) * (np.abs(xx - 571) > 7))

# cistern: the vault without the bell, and the bell with its chain
a, p = bg('cistern'), plate('cistern')
bell = diffmask(a, p, (520, 0, 790, 395), thr=16, grow=4, feather=1.5)
save('cistern_plate', p, np.clip(ndi.gaussian_filter((bell > 0.02).astype(np.float32), 4) * 1.6, 0, 1))
save('cistern_bell', a, bell)
