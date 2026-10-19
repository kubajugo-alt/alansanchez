# A Canva restyle (generate-image with the sprite and Canva-style references, exported at full size on the green
# ground) brought back onto the sprite it repaints: the green keyed out, then the figure scaled and moved until its
# silhouette lies over the original's (a small search on the masks), so anchors, feet and the frames around it stay
# where they were. Writes a candidate the size of the original sprite.
#   python3 scripts/canva_restyle_fit.py <sprite key> <canva export.png> <pads.json> <out.webp>
import json, os, sys, numpy as np, cv2
from PIL import Image

KEY = np.array([0, 177, 64], np.float32)


def key_out(rgb):
    """Alpha from the distance to the green, and the green spill taken off the edges."""
    a = rgb.astype(np.float32)
    d = np.linalg.norm(a - KEY, axis=2)
    g_dom = a[..., 1] - np.maximum(a[..., 0], a[..., 2])           # how much greener than it should be
    alpha = np.clip((d - 60) / 70, 0, 1) * np.clip(1 - (g_dom - 40) / 60, 0, 1)
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.6)
    spill = np.clip(g_dom, 0, None)
    a[..., 1] -= spill * 0.85                                         # despill: green down to the larger of red/blue
    return np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8)


def main(k, src, pads, out):
    orig = Image.open(f'art/sprites/{k}.webp').convert('RGBA'); W, H = orig.size
    p = json.load(open(pads))[k]; PW, PH = p['pad']; bx, by, bw, bh = p['box']
    gen = key_out(np.asarray(Image.open(src).convert('RGB')))
    oa = np.asarray(orig)[..., 3] > 128
    gi = Image.fromarray(gen, 'RGBA')
    if abs(gi.width / gi.height - PW / PH) < 0.04 * PW / PH:
        # the export is the padded canvas, rescaled: back to it, then to the sprite's own pixels
        g = gi.resize((PW, PH), Image.LANCZOS).crop((bx, by, bx + bw, by + bh)).resize((W, H), Image.LANCZOS)
    else:
        # Canva reframed it (another aspect): the figure's box scaled to the original's height, feet on its feet
        ys, xs = np.nonzero(gen[..., 3] > 128); fig = gi.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        oy, ox = np.nonzero(oa); s = (oy.max() + 1 - oy.min()) / fig.height
        fig = fig.resize((max(1, round(fig.width * s)), oy.max() + 1 - oy.min()), Image.LANCZOS)
        g = Image.new('RGBA', (W, H)); g.paste(fig, (round((ox.min() + ox.max()) / 2 - fig.width / 2), int(oy.min())), fig)
    if os.environ.get('FIT_MODE') == 'stand':
        # standing frames: Canva draws him taller and leaner, so a silhouette match stretches him; instead head-to-toe
        # height to the original's, feet on its floor line, the head over its head
        def ext(a):
            ys, xs = np.nonzero(a); top, bot = ys.min(), ys.max() + 1
            hy = a[top:top + max(4, (bot - top) // 12)]; hx = np.nonzero(hy)[1].mean()
            return top, bot, hx
        ga0 = np.asarray(g)[..., 3] > 128
        gt, gb, gx = ext(ga0); ot, ob, ox_ = ext(oa); s = (ob - ot) / (gb - gt)
        M = np.float32([[s, 0, ox_ - gx * s], [0, s, ob - gb * s]])
        fit = cv2.warpAffine(np.asarray(g), M, (W, H), flags=cv2.INTER_LANCZOS4, borderValue=(0, 0, 0, 0))
        Image.fromarray(fit, 'RGBA').save(out, 'WEBP', quality=92, method=6)
        fa = fit[..., 3] > 128
        print(f'{k}: stand fit scale {s:.2f} iou {(fa & oa).sum() / max(1, (fa | oa).sum()):.3f} -> {out}'); return
    ga = np.asarray(g)[..., 3] > 128
    # fine fit: scale about the centre and shift, on masks at a quarter size
    s4 = 4; o4 = cv2.resize(oa.astype(np.uint8), (W // s4, H // s4)) > 0
    # FIT_TOP=0.6: match only the top of the figure (head and shoulders), when Canva drew the body wider or smaller
    top = float(os.environ.get('FIT_TOP', 1)); oy4 = np.nonzero(o4)[0]
    roi = np.zeros_like(o4); roi[:int(oy4.min() + top * (oy4.max() + 1 - oy4.min()))] = True
    best = (-1, 1.0, 0, 0)
    for sc in np.arange(0.85, 1.201, 0.01):
        M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, sc)
        gs = cv2.warpAffine(ga.astype(np.uint8), M, (W, H), flags=cv2.INTER_NEAREST)
        g4 = cv2.resize(gs, (W // s4, H // s4)) > 0
        for dx in range(-10, 11):
            for dy in range(-10, 11):
                sh = np.roll(np.roll(g4, dy, 0), dx, 1)
                iou = (sh & o4 & roi).sum() / max(1, ((sh | o4) & roi).sum())
                if iou > best[0]: best = (iou, sc, dx * s4, dy * s4)
    iou, sc, dx, dy = best
    M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, sc); M[0, 2] += dx; M[1, 2] += dy
    fit = cv2.warpAffine(np.asarray(g), M, (W, H), flags=cv2.INTER_LANCZOS4, borderValue=(0, 0, 0, 0))
    fit[np.nonzero(oa)[0].max() + 3:, :, 3] = 0                       # nothing below the original's cut (Canva adds water lines)
    Image.fromarray(fit, 'RGBA').save(out, 'WEBP', quality=92, method=6)
    print(f'{k}: fit iou {iou:.3f} scale {sc:.2f} shift {dx},{dy} -> {out}')


if __name__ == '__main__':
    main(*sys.argv[1:5])
