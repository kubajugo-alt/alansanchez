# Closes see-through patches where a pale grey shirt matched the grey backdrop:
# an enclosed hole ringed by pale, unsaturated paint is made opaque again.
#   python3 scripts/fillshirt.py art/sprites/name.webp [...]
import os, sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
for f in sys.argv[1:]:
    im = np.asarray(Image.open(f).convert('RGBA')).copy()
    m = im[..., 3] > 245
    lab, n = ndi.label(ndi.binary_fill_holes(m) & ~m)
    rgb = im[..., :3].astype(int); fixed = 0
    for i in range(1, n + 1):
        z = lab == i
        ring = ndi.binary_dilation(z, iterations=3) & ~z & m
        if not ring.any(): continue
        c = rgb[ring].mean(0)
        if c.min() > 85 and c.max() - c.min() < 24:
            zz = ndi.binary_dilation(z, iterations=1) & ~m | z
            im[..., 3][zz] = 255; fixed += int(z.sum())
    Image.fromarray(im).save(f, quality=90) if f.endswith('.webp') else Image.fromarray(im).save(f)
    print(f, fixed)
    # white specks left inside the shirt by the keying: repaint from the surrounding cloth
    im = np.asarray(Image.open(f).convert('RGBA')).copy()
    inner = ndi.binary_erosion(im[..., 3] > 245, iterations=4)
    rgb = im[..., :3].astype(int)
    wh = inner & (rgb.min(2) > 185) & (rgb.max(2) - rgb.min(2) < 22)
    if os.environ.get('NO_SPECKS'): wh[:] = False  # frames with a white T-shirt in them (Alan)
    if wh.any():
        good = inner & ~ndi.binary_dilation(wh, iterations=1)
        acc = np.zeros(rgb.shape, float); cnt = np.zeros(rgb.shape[:2], float)
        for c in range(3): acc[..., c] = ndi.uniform_filter(rgb[..., c] * good, 9)
        cnt = ndi.uniform_filter(good.astype(float), 9) + 1e-6
        fill = (acc / cnt[..., None]).clip(0, 255).astype(np.uint8)
        zz = ndi.binary_dilation(wh, iterations=1) & inner
        im[..., :3][zz] = fill[zz]
        Image.fromarray(im).save(f, quality=90) if f.endswith('.webp') else Image.fromarray(im).save(f)
    print(' specks', int(wh.sum()))
