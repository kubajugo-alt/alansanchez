# Small moving parts cut out of a painted background without changing the painting: the object is separated from
# its surroundings inside a box (OpenCV GrabCut, helped by a hand-drawn "surely background" margin), saved from the
# ORIGINAL painting as art/layers/<name>.webp, and the room behind it is filled in (OpenCV inpainting) a few pixels
# beyond the object's outline, saved as art/layers/<name>_under.webp. In the room the _under layer is drawn still and
# the object over it, swinging or bobbing a little (js layers: swing / bob about a pivot); at rest the two add up to
# the painting exactly, and the motion only ever uncovers the inpainted margin.
#   python3 scripts/swing_cut.py [name ...]        (default: every item in ITEMS)
# Prints each layer's position for the room's `layers`.
import json, os, sys, numpy as np, cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# name: (painting, box [x0, y0, x1, y1] holding the whole object, pixels it may move (inpaint margin), extra)
# (no bells and no pendulums: nobody is ringing the Sé's bells, and Ferreira's clocks all stopped at 03:12)
ITEMS = {
    'tavern_lantern_l': ('tavern', [425, 55, 485, 232], 9, {'chain': (453, 58, 156)}),
    'tavern_lantern_r': ('tavern', [952, 62, 1020, 212], 9, {'chain': (985, 68, 135)}),
    'cabin_lantern':    ('cabin', [184, 158, 252, 302], 10, {}),
    'street_sign':      ('street', [1150, 262, 1236, 356], 6, {}),
    'street_lantern':   ('street', [1104, 266, 1162, 350], 6, {}),
    'store_lamp':       ('se_store', [612, 0, 696, 146], 7, {}),
    'lav_lamp':         ('lavadouro', [684, 0, 776, 98], 7, {}),
    'tavern_lantern_l_night': ('tavern_night', [425, 55, 485, 232], 9, {'chain': (453, 58, 156), 'outline': 'tavern'}),  # the night paintings, same places (unlit, the
    # left lantern is dark on a dark wall: its outline comes from the day painting)
    'tavern_lantern_r_night': ('tavern_night', [952, 62, 1020, 212], 9, {'chain': (985, 68, 135)}),
    'street_sign_night':      ('street_night', [1150, 262, 1236, 356], 6, {}),
    'street_lantern_night':   ('street_night', [1104, 266, 1162, 350], 6, {}),
    'cais_boats':       ('cais', [700, 378, 1250, 632], 4, {'floor': 560}),
}


def cut(name):
    bg, (x0, y0, x1, y1), margin, ex = ITEMS[name]
    im = np.asarray(Image.open(os.path.join(ROOT, f'art/bg/{bg}.jpg')).convert('RGB'))
    pix = im                                     # the pixels the layers are made of
    if 'outline' in ex: im = np.asarray(Image.open(os.path.join(ROOT, f"art/bg/{ex['outline']}.jpg")).convert('RGB'))  # where to find the object
    H, W = im.shape[:2]
    pad = 14
    X0, Y0, X1, Y1 = max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)
    crop = np.ascontiguousarray(im[Y0:Y1, X0:X1][..., ::-1])
    m = np.full(crop.shape[:2], cv2.GC_BGD, np.uint8)
    m[y0 - Y0:y1 - Y0, x0 - X0:x1 - X0] = cv2.GC_PR_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(crop, m, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg = ((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)).astype(np.uint8)
    # the largest pieces only, holes filled, edge a pixel wider and soft
    n, lab, st, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        big = st[1:, cv2.CC_STAT_AREA].max(); fg = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > big * 0.08]).astype(np.uint8)
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE); cv2.drawContours(fg, cnts, -1, 1, -1)
    fg = cv2.dilate(fg, np.ones((3, 3), np.uint8))
    full = np.zeros((H, W), np.uint8); full[Y0:Y1, X0:X1] = fg
    if 'chain' in ex:  # a hanging lantern: its chain too (dark on a dark wall, the cut misses it), a strip to the pivot
        cx, c0, c1 = ex['chain']; full[c0:c1 + 2, cx - 4:cx + 5] = 1
    alpha = cv2.GaussianBlur(full.astype(np.float32), (0, 0), 0.8)
    # what is behind: the painting inpainted under the object and `margin` px round it
    hole = cv2.dilate(full, np.ones((2 * margin + 1, 2 * margin + 1), np.uint8))
    under = cv2.inpaint(np.ascontiguousarray(pix[..., ::-1]), hole * 255, 7, cv2.INPAINT_TELEA)[..., ::-1]
    ua = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 1.5)
    out = {}
    for nm, rgb, a in ((name, pix, alpha), (name + '_under', under, ua)):
        ys, xs = np.where(a > 0.01); a0, a1, b0, b1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        rgba = np.dstack([rgb[a0:a1, b0:b1], np.clip(a[a0:a1, b0:b1], 0, 1) * 255]).astype(np.uint8)
        Image.fromarray(rgba, 'RGBA').save(os.path.join(ROOT, f'art/layers/{nm}.webp'), 'WEBP', quality=92, method=6)
        out[nm] = {'x': int(b0), 'y': int(a0), 'w': int(b1 - b0), 'h': int(a1 - a0)}
    print(json.dumps(out))


if __name__ == '__main__':
    for n in sys.argv[1:] or ITEMS: cut(n)
