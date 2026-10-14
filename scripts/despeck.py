# Removes small near-white specks on a sprite's outline (backdrop caught in
# hair curls):  python3 scripts/despeck.py art/sprites/name.webp [...]
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
for f in sys.argv[1:]:
    im = np.asarray(Image.open(f).convert('RGBA')).copy()
    rgb, a = im[..., :3].astype(int), im[..., 3]
    white = (rgb.min(2) > 175) & ((rgb.max(2) - rgb.min(2)) < 30) & (a > 0)
    lab, n = ndi.label(white)
    if not n: continue
    near = ndi.binary_dilation(a < 40, iterations=3)
    sz = ndi.sum(np.ones_like(lab), lab, range(1, n + 1)); touch = ndi.maximum(near, lab, range(1, n + 1))
    kill = np.isin(lab, [i + 1 for i in range(n) if sz[i] < 400 and touch[i]])
    kill = ndi.binary_dilation(kill, iterations=1) & (rgb.min(2) > 140)
    im[..., 3][kill] = 0
    Image.fromarray(im).save(f, quality=90) if f.endswith('.webp') else Image.fromarray(im).save(f)
    print(f, int(kill.sum()))
