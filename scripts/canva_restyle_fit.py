# A Canva restyle (generate-image with the sprite and Canva-style references, exported at full size on the green
# ground) brought back onto the sprite it repaints: the green keyed out, then the figure scaled and moved until its
# silhouette lies over the original's (a small search on the masks), so anchors, feet and the frames around it stay
# where they were. Writes a candidate the size of the original sprite.
#   python3 scripts/canva_restyle_fit.py <sprite key> <canva export.png> <pads.json> <out.webp>
import json, sys, numpy as np, cv2
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
    # the export is the padded canvas, rescaled: back to it, then to the sprite's own pixels
    g = Image.fromarray(gen, 'RGBA').resize((PW, PH), Image.LANCZOS).crop((bx, by, bx + bw, by + bh)).resize((W, H), Image.LANCZOS)
    ga = np.asarray(g)[..., 3] > 128; oa = np.asarray(orig)[..., 3] > 128
    # fine fit: scale about the centre and shift, on masks at a quarter size
    s4 = 4; o4 = cv2.resize(oa.astype(np.uint8), (W // s4, H // s4)) > 0
    best = (-1, 1.0, 0, 0)
    for sc in np.arange(0.92, 1.081, 0.01):
        M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, sc)
        gs = cv2.warpAffine(ga.astype(np.uint8), M, (W, H), flags=cv2.INTER_NEAREST)
        g4 = cv2.resize(gs, (W // s4, H // s4)) > 0
        for dx in range(-10, 11):
            for dy in range(-10, 11):
                sh = np.roll(np.roll(g4, dy, 0), dx, 1)
                iou = (sh & o4).sum() / max(1, (sh | o4).sum())
                if iou > best[0]: best = (iou, sc, dx * s4, dy * s4)
    iou, sc, dx, dy = best
    M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, sc); M[0, 2] += dx; M[1, 2] += dy
    fit = cv2.warpAffine(np.asarray(g), M, (W, H), flags=cv2.INTER_LANCZOS4, borderValue=(0, 0, 0, 0))
    Image.fromarray(fit, 'RGBA').save(out, 'WEBP', quality=92, method=6)
    print(f'{k}: fit iou {iou:.3f} scale {sc:.2f} shift {dx},{dy} -> {out}')


if __name__ == '__main__':
    main(*sys.argv[1:5])
