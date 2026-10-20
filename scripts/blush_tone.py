# Tones a painted blush down to a target strength: in the skin, how much redder than the face's own median a pixel is
# (Lab a*) is scaled down, with b* pulled back to the median alongside, so the cheeks keep their shading and only
# the pink fades. The frame's face patches (in <dir>/faces/) get the same change, measured on the frame itself.
#   python3 scripts/blush_tone.py <dir> <target excess | k=0.5> frame ...     (edits <dir>/<frame>.webp in place;
#   k= scales every frame's blush by the same factor)
import glob, os, sys, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from skin_match import skin_mask


def stats(rgba):
    m = skin_mask(rgba) > 0.5; lab = cv2.cvtColor(rgba[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)[m]
    a0, b0 = np.median(lab[:, 1]), np.median(lab[:, 2])
    return a0, b0, np.percentile(lab[:, 1] - a0, 95), np.percentile(lab[:, 1] - a0, 50)


def tone(rgba, a0, b0, k):
    m = skin_mask(rgba); lab = cv2.cvtColor(rgba[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    ex = lab[..., 1] - a0; w = np.clip((ex - 3) / 6, 0, 1) * m       # how much of a pixel is blush
    f = 1 - (1 - k) * w
    lab[..., 1] = a0 + ex * f; lab[..., 2] = b0 + (lab[..., 2] - b0) * f
    out = rgba.copy(); out[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    return out


def main(d, target, frames):
    fixed = float(target[2:]) if target.startswith('k=') else None; target = None if fixed is not None else float(target)
    for fr in frames:
        p = f'{d}/{fr}.webp'; a = np.asarray(Image.open(p).convert('RGBA'))
        a0, b0, p95, p50 = stats(a); k = fixed if fixed is not None else max(0.0, min(1.0, (target - p50) / max(1e-3, p95 - p50)))
        Image.fromarray(tone(a, a0, b0, k), 'RGBA').save(p, quality=92, method=6)
        for q in glob.glob(f'{d}/faces/{fr}_*.webp'):
            Image.fromarray(tone(np.asarray(Image.open(q).convert('RGBA')), a0, b0, k), 'RGBA').save(q, quality=92, method=6)
        print(f'{fr}: blush {p95:.1f} over the median -> scaled by {k:.2f}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
