# v2 room-state layers, cut from Canva "edit" variants of each painting.
#   python3 scripts/layers2.py <dir with the exported variant PNGs>
# Each layer is a full-frame 1280x720 RGBA webp (transparent outside the
# change), so the engine draws it at 0,0 over the background.
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out = os.path.join(root, 'art', 'layers')
W, H = 1280, 720
def load(p): return np.asarray(Image.open(p).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
def bg(n): return load(os.path.join(root, 'art', 'bg', n + '.jpg'))
def unzoom(im, s):
    # Canva's fill scales a page image ~2% past the edges; undo it, reflecting into the trimmed border
    w, h = im.size
    if s >= 0.999: return im.convert('RGB')
    pw, ph = int(round(w * (1 / s - 1) / 2)), int(round(h * (1 / s - 1) / 2))
    a = np.pad(np.asarray(im.convert('RGB')), ((ph, ph), (pw, pw), (0, 0)), mode='reflect')
    return Image.fromarray(a)
def best_scale(im, ref):
    # centred zoom that best matches the reference painting
    small = np.asarray(Image.fromarray(ref.astype(np.uint8)).convert('L').resize((320, 180))).astype(float)
    best = (1e9, 1.0)
    for s in np.arange(0.965, 1.0001, 0.0025):
        b = np.asarray(unzoom(im, s).convert('L').resize((320, 180), Image.LANCZOS)).astype(float)
        e = np.median(np.abs(b - small))
        if e < best[0]: best = (e, s)
    return best[1]
def var(n, ref=None, fixed=None):
    im = Image.open(os.path.join(src, n + '.png'))
    if ref is not None:
        s = max(best_scale(im, ref), 0.975) if fixed is None else fixed
        if s < 0.999: print(n, 'unzoom', round(s, 4)); im = unzoom(im, s)
    return np.asarray(im.convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)

def mask(a, b, box, thr=16, grow=4, feather=2.0, minsize=60):
    x0, y0, x1, y1 = box
    d = ndi.gaussian_filter(np.abs(a - b).mean(2), 1.5)
    m = np.zeros((H, W), bool); m[y0:y1, x0:x1] = d[y0:y1, x0:x1] > thr
    m = ndi.binary_opening(m, iterations=1)
    lab, n = ndi.label(m)
    if n:
        sizes = ndi.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > minsize])
    m = ndi.binary_fill_holes(ndi.binary_closing(m, iterations=4))
    m = ndi.binary_dilation(m, iterations=grow)
    a_ = np.clip(ndi.gaussian_filter(m.astype(np.float32), feather) * 1.3, 0, 1)
    # never bleed outside the box
    box_m = np.zeros((H, W), np.float32); box_m[y0:y1, x0:x1] = 1
    return a_ * ndi.gaussian_filter(box_m, 3)
def save(name, rgb, alpha):
    Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA').save(os.path.join(out, name + '.webp'), 'WEBP', quality=90, method=6)
    ys, xs = np.where(alpha > 0.05)
    print(name, 'box', (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None)

jobs = [
    ('police_drawer', 'police', 'police_drawer_open', (1095, 440, 1215, 640), 14),
    ('convent_stone', 'convent', 'convent_stone_washed', (25, 100, 235, 500), 14),
    ('cabin_notile', 'cabin', 'cabin_notile', (820, 400, 1280, 720), 18),
    ('antiques_case_weight', 'antiques', 'plate_antiques_weight', (655, 280, 875, 440), 16),
]
for name, b, v, box, thr in jobs:
    p = os.path.join(src, v + '.png')
    if not os.path.exists(p): print('skip', name); continue
    A = bg(b); B = var(v, A)
    save(name, B, mask(A, B, box, thr))

# the cistern: the vault without the bell, and the bell (with its chain) to swing
if os.path.exists(os.path.join(src, 'cistern2_plate.png')):
    A = bg('cistern'); P = var('cistern2_plate', A)
    bell = mask(A, P, (500, 0, 800, 400), thr=16, grow=4, feather=1.5)
    plate = np.clip(ndi.gaussian_filter((bell > 0.02).astype(np.float32), 5) * 1.6, 0, 1)
    save('cistern_plate', P, plate)
    save('cistern_bell', A, bell)

# night repaints of whole rooms, brought back onto the day painting's geometry
for name, day, v in [('convent_night', 'convent', 'bg_convent_night2')]  # shop_night: scripts/nightgrade.py (Canva's repaint moved the room):
    p = os.path.join(src, v + '.png')
    if not os.path.exists(p): continue
    N = var(v, bg(day), 0.98)  # repaints don't diff cleanly; Canva's fill zoom is ~2%
    Image.fromarray(N.astype(np.uint8)).save(os.path.join(root, 'art', 'bg', name + '.jpg'), quality=90)
    print('bg', name)
