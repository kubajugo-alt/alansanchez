# Re-composites figures painted on a flat grey backdrop onto white, so
# matte.py's white keying works:  python3 scripts/greykey.py file.png [...]
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
for f in sys.argv[1:]:
    im = np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
    border = np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)])
    bgc = np.median(border, 0)
    if bgc.min() > 240: continue
    # a smooth backdrop model: blur of the border-connected flat area
    d = np.abs(im - bgc).max(2)
    flat = (d < 14) & ((im.max(2) - im.min(2)) < 16)
    lab, n = ndi.label(flat)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    # local backdrop colour (handles a soft vignette)
    w = ndi.gaussian_filter(bg.astype(np.float32), 25) + 1e-3
    loc = np.dstack([ndi.gaussian_filter(im[..., c] * bg, 25) / w for c in range(3)])
    loc[w < 0.02] = bgc
    dist = np.abs(im - loc).max(2)
    a = np.clip((dist - 6) / 34, 0, 1)
    a[bg] = 0
    a = np.maximum(a, ndi.binary_erosion(~bg, iterations=3))
    # un-mix the backdrop from edge pixels, then lay over white
    a3 = np.clip(a, 0.05, 1)[..., None]
    fg = np.clip((im - (1 - a3) * loc) / a3, 0, 255)
    out = fg * a[..., None] + 255 * (1 - a[..., None])
    Image.fromarray(out.astype(np.uint8)).save(f)
    print('keyed', f, bgc)
