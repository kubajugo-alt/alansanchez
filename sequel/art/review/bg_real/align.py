# Fit each repaint (raw_<name>.png) back onto the original painting's exact framing: find the scale and offset
# (raw = original * k + d) that best match the original's edges, warp to the original's size, save <name>.jpg,
# and report the match (edge correlation) and the drift.
import sys, numpy as np
from PIL import Image, ImageFilter
def edges(im, w, h):
    a = np.asarray(im.convert('L').resize((w, h), Image.LANCZOS), np.float32)
    g = np.abs(np.diff(a, axis=0))[:, :-1] + np.abs(np.diff(a, axis=1))[:-1]
    g = Image.fromarray(np.clip(g * 3, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    return np.asarray(g, np.float32)
def score(er, xs, ys, v, kx, ky, dx, dy):
    X = np.clip(np.round(xs * kx + dx).astype(int), 0, er.shape[1] - 1); Y = np.clip(np.round(ys * ky + dy).astype(int), 0, er.shape[0] - 1)
    u = er[Y, X]; return float(((u - u.mean()) / (u.std() + 1e-6) * v).mean())
def fit(name, orig=None):
    o = Image.open(orig or f'../../bg/{name}.jpg').convert('RGB'); r = Image.open(f'raw_{name}.png').convert('RGB')
    W, H = o.size; R = r.size; best = None
    for w in (320, 640):
        f = W / w; eo = edges(o, w, round(H / f)); er = edges(r, round(R[0] / f), round(R[1] / f))
        ys, xs = np.mgrid[6:eo.shape[0] - 6:2, 6:eo.shape[1] - 6:2]; v = eo[ys, xs]; v = (v - v.mean()) / (v.std() + 1e-6)
        if best is None:
            k0 = R[0] / W; cands = [(kx, ky, dx, dy) for kx in np.arange(k0 - .04, k0 + .041, .005) for ky in np.arange(k0 - .04, k0 + .041, .005)
                                    for dx in range(-14, 15, 2) for dy in range(-14, 15, 2)]
        else:
            _, kx0, ky0, dx0, dy0 = best
            cands = [(kx, ky, dx, dy) for kx in np.arange(kx0 - .006, kx0 + .0061, .002) for ky in np.arange(ky0 - .006, ky0 + .0061, .002)
                     for dx in np.arange(dx0 * 2 - 3, dx0 * 2 + 3.1, 1) for dy in np.arange(dy0 * 2 - 3, dy0 * 2 + 3.1, 1)]
        best = max(((score(er, xs, ys, v, *c),) + c for c in cands), key=lambda t: t[0])
    c, kx, ky, dx, dy = best; DX, DY = dx * W / 640, dy * W / 640
    r.transform((W, H), Image.AFFINE, (kx, 0, DX, 0, ky, DY), Image.BICUBIC).save(f'{name}.jpg', quality=92)
    return f'{name:18s} match {c:.3f}  scale {kx:.4f} {ky:.4f}  offset {DX:+.0f} {DY:+.0f}'
if __name__ == '__main__':
    for n in sys.argv[1:]: print(fit(n), flush=True)
