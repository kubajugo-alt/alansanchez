# Matches the skin tone of sprite frames to a reference frame (only skin-like
# pixels change):  python3 scripts/skinmatch.py ref_name name [name ...]
import sys, numpy as np
from PIL import Image
def load(n): return np.asarray(Image.open(f'art/sprites/{n}.webp').convert('RGBA')).astype(np.float64) / 255
def skin_weight(rgb):
    mx, mn = rgb.max(2), rgb.min(2); s = (mx - mn) / (mx + 1e-6)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.degrees(np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)) % 360
    ramp = lambda x, a, b: np.clip((x - a) / (b - a), 0, 1)
    return ramp(h, 8, 14) * (1 - ramp(h, 38, 46)) * ramp(s, 0.18, 0.28) * ramp(mx, 0.25, 0.4)
def median_skin(a):
    w = skin_weight(a[..., :3]); m = (w > 0.9) & (a[..., 3] > 0.9) & (a[..., :3].max(2) > 0.45)
    return np.median(a[..., :3][m], 0)
# Lab colour space (D65), so lightness and the two colour axes are matched separately
M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
WP = np.array([0.95047, 1.0, 1.08883])
def to_lab(rgb):
    l = np.where(rgb > 0.04045, ((rgb + 0.055) / 1.055) ** 2.4, rgb / 12.92)
    xyz = l @ M.T / WP
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)
def from_lab(lab):
    fy = (lab[..., 0] + 16) / 116; fx = fy + lab[..., 1] / 500; fz = fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f > 0.2069, f ** 3, (f - 16 / 116) / 7.787) * WP
    l = np.clip(xyz @ np.linalg.inv(M).T, 0, 1)
    return np.where(l > 0.0031308, 1.055 * l ** (1 / 2.4) - 0.055, 12.92 * l)
def skin_stats(a):
    w = skin_weight(a[..., :3]); m = (w > 0.9) & (a[..., 3] > 0.9)
    lab = to_lab(a[..., :3][m]); return lab.mean(0), lab.std(0)
rm, rs = skin_stats(load(sys.argv[1]))
for n in sys.argv[2:]:
    a = load(n); cm, cs = skin_stats(a); cur = median_skin(a)
    lab = to_lab(a[..., :3])
    moved = (lab - cm) * (rs / cs) + rm  # mean and spread of the reference skin
    w = skin_weight(a[..., :3])[..., None]
    a[..., :3] = np.clip(a[..., :3] * (1 - w) + from_lab(moved) * w, 0, 1)
    Image.fromarray((a * 255 + 0.5).astype(np.uint8)).save(f'art/sprites/{n}.webp', 'WEBP', quality=90, method=6)
    print(n, (cur * 255).round(), '->', (median_skin(a) * 255).round())
