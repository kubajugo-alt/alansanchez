# The bookshop at night, graded from the day painting so every hotspot and walk line still fits:
# moonlit blue everywhere, the fogged window and door glass turned to night sky,
# and a warm pool from the banker's lamp on the desk.   python3 scripts/nightgrade.py
import os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
a = np.asarray(Image.open(os.path.join(root, 'art', 'bg', 'shop.jpg')).convert('RGB')).astype(float) / 255
H, W = a.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]
lum = a @ [0.3, 0.59, 0.11]
# glass: bright, low-saturation fog in the window and the door
sat = a.max(2) - a.min(2)
glass = (lum > 0.55) & (sat < 0.16) & (yy < 470)
glass = ndi.binary_opening(glass, iterations=2)
glass = ndi.gaussian_filter(glass.astype(float), 2.5)
night = np.power(a, 1.35) * np.array([0.34, 0.40, 0.58])
sky = (0.10 + 0.22 * lum[..., None]) * np.array([0.55, 0.68, 1.0])
out = night * (1 - glass[..., None]) + sky * glass[..., None]
# lamp pool (shade at 178,305): warm, falling off over the desk and floor
for cx, cy, r, k, col in [(178, 300, 330, 0.9, (1.0, 0.78, 0.45)), (178, 560, 420, 0.45, (1.0, 0.75, 0.42))]:
    d = np.hypot((xx - cx) / r, (yy - cy) / (r * 0.8))
    g = np.clip(1 - d, 0, 1) ** 2 * k
    out = out + a * np.array(col) * g[..., None]
# soft vignette
v = 1 - 0.35 * np.clip(np.hypot((xx - W / 2) / (W * 0.62), (yy - H / 2) / (H * 0.7)) - 0.4, 0, 1)
out = np.clip(out * v[..., None], 0, 1)
Image.fromarray((out * 255).astype(np.uint8)).save(os.path.join(root, 'art', 'bg', 'shop_night.jpg'), quality=90)
print('shop_night')
