# A walk pose painted by Canva (on green, from a stick-figure pose in art/review/walkref/) brought onto the canvas of
# the character's contact frame (alan_walkA), so it plays in the same cycle: keyed out, scaled so the head-to-waist
# length matches (the legs change length from pose to pose, the trunk doesn't), the lowest foot on the frame's floor
# line, the head over its head.
#   python3 scripts/walk_canva_fit.py <base sprite> <canva export.png> <out.png> [scale]
# (a set painted at one framing should share one scale: pass the median of the measured ones)
import sys, numpy as np
from PIL import Image
sys.path.insert(0, 'scripts')
from canva_restyle_fit import key_out


def measure(rgba):
    a = rgba[..., 3] > 128; ys, xs = np.nonzero(a); top, bot = ys.min(), ys.max()
    head = a[top:top + max(6, (bot - top) // 14)]; hx = np.nonzero(head)[1].mean()
    rgb = rgba[..., :3].astype(int); blue = (rgb[..., 2] > rgb[..., 0] + 15) & a       # the jeans
    rows = np.nonzero(blue.sum(1) > 8)[0]; waist = rows[rows > top + (bot - top) * 0.3].min()
    return top, bot, hx, waist


def main(base, src, out, fixed=None):
    b = np.asarray(Image.open(f'art/sprites/{base}.webp').convert('RGBA')); H, W = b.shape[:2]
    g = key_out(np.asarray(Image.open(src).convert('RGB')))
    bt, bb, bx, bw = measure(b); gt, gb, gx, gw = measure(g)
    s = float(fixed) if fixed else (bw - bt) / (gw - gt)
    gi = Image.fromarray(g, 'RGBA'); gi = gi.resize((round(gi.width * s), round(gi.height * s)), Image.LANCZOS)
    g2 = np.asarray(gi); t2, b2, x2, _ = measure(g2)
    c = Image.new('RGBA', (W, H)); c.paste(gi, (int(round(bx - x2)), int(round(bb - b2))), gi)
    c.save(out); print(f'{src}: scale {s:.3f}, figure {b2 - t2}px tall (base {bb - bt})')


if __name__ == '__main__':
    main(*sys.argv[1:5])
