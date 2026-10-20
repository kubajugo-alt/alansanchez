# Evens out a character's skin tone across their frames: the skin (by hue, in the painting itself, not the clothes) is
# moved in Lab so its median matches a target, feathered at the mask's edge. The face patches cut from a frame
# (art/faces/<frame>_*.webp) get the same shift, so a talking mouth matches the painting it's laid on.
#   python3 scripts/skin_match.py <out dir> <L,a,b target> frame ...      (writes <out dir>/<frame>.webp and its patches)
import glob, os, sys, numpy as np, cv2
from PIL import Image


def skin_mask(rgba):
    rgb = rgba[..., :3]; hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    H, S, V = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
    m = ((H <= 22) | (H >= 172)) & (S > 45) & (V > 55) & (rgba[..., 3] > 0)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)


def lab_median(rgba, m):
    lab = cv2.cvtColor(rgba[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    sel = m > 0.5
    L, A, B = lab[sel].T
    keep = A < np.median(A) + 6           # leave a blush out of the measure
    return np.array([np.median(L[keep]), np.median(A[keep]), np.median(B[keep])])


def shift(rgba, d, m=None):
    m = skin_mask(rgba) if m is None else m
    lab = cv2.cvtColor(rgba[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    lab += d[None, None, :] * m[..., None]
    out = rgba.copy(); out[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    return out


def main(out, target, frames):
    t = np.array([float(v) for v in target.split(',')]); t = np.array([t[0] * 255 / 100, t[1] + 128, t[2] + 128])
    os.makedirs(out + '/faces', exist_ok=True)
    for fr in frames:
        a = np.asarray(Image.open(f'art/sprites/{fr}.webp').convert('RGBA'))
        m = skin_mask(a); d = t - lab_median(a, m)
        Image.fromarray(shift(a, d, m), 'RGBA').save(f'{out}/{fr}.webp', quality=92, method=6)
        for p in glob.glob(f'art/faces/{fr}_*.webp'):
            Image.fromarray(shift(np.asarray(Image.open(p).convert('RGBA')), d), 'RGBA').save(f'{out}/faces/{os.path.basename(p)}', quality=92, method=6)
        print(f'{fr}: shift L {d[0] * 100 / 255:+.1f} a {d[1]:+.1f} b {d[2]:+.1f}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
