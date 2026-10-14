# Sky mask for the midnight convent: hand-traced sky openings, trimmed where the
# painting is clearly stone (dark ink lines), then feathered.
#   python3 scripts/skymask.py
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
POLYS = {'convent_night': [
    [(110, 0), (300, 0), (300, 44), (205, 44)],
    [(562, 0), (965, 0), (955, 40), (915, 60), (905, 120), (870, 150), (860, 200), (840, 212), (810, 195), (775, 183),
     (740, 195), (715, 208), (705, 198), (690, 165), (620, 160), (600, 110), (585, 50), (562, 0)],
    [(442, 72), (475, 46), (500, 40), (495, 110), (470, 150), (446, 140)],
    [(1008, 0), (1052, 0), (1046, 160), (1030, 165), (1015, 90)],
    [(1142, 0), (1200, 0), (1200, 232), (1150, 232), (1146, 165)],
]}
for name, polys in POLYS.items():
    a = np.asarray(Image.open(os.path.join(root, 'art', 'bg', name + '.jpg')).convert('L')).astype(float)
    m = Image.new('L', (1280, 720), 0); d = ImageDraw.Draw(m)
    for p in polys: d.polygon(p, fill=255)
    if name == 'convent_night': d.line([(700, 205), (735, 130), (775, 88), (815, 130), (862, 205)], fill=0, width=20, joint='curve')  # free-standing arch rib
    m = np.asarray(m) > 0
    ink = ndi.binary_dilation(ndi.gaussian_filter(a, 0.8) < 9, iterations=1)  # near-black outlines
    m = m & ~ink
    m = ndi.binary_opening(m, iterations=1)
    alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
    out = Image.merge('RGBA', [Image.new('L', (1280, 720), 255)] * 3 + [alpha])
    out.save(os.path.join(root, 'art', 'layers', name + '_sky.webp'), 'WEBP', quality=90)
    print(name, int(m.sum()))
