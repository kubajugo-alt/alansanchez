# Cuts Alan's side view into parts for the skeletal rig (trial: walk and idle).
# The base is alan_walkA, mid-stride, because it is the one painting where both legs and both arms show apart.
# Each part is the painting under a hand-drawn outline (sprite px of alan_walkA), kept at its own size with an
# offset; what the part hides of the one behind it is filled from that part's own paint, so a bent joint shows no
# hole. Writes art/rigs/alan/side/<part>.png and rig.json (part offsets, bone pivots, draw order).
#   python3 scripts/rig_cut.py
import json, os
import cv2, numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/rigs/alan/side/')
BASE = 'alan_walkA'

# outlines (alan_walkA px). The near arm swings back here, the far one forward in front of his chest.
NEAR_ARM = [(102, 136), (152, 136), (142, 190), (127, 250), (117, 300), (113, 330), (111, 360), (110, 422), (48, 422), (52, 330), (66, 250), (86, 186)]
FAR_ARM = [(226, 250), (252, 258), (292, 296), (328, 326), (330, 378), (278, 378), (248, 342), (226, 334)]
# the seam between the legs: the back edge of the near thigh, down to where the legs part
SEAM = [(112, 318), (118, 340), (125, 360), (140, 390), (155, 415), (172, 445), (182, 470)]
HEM = 324           # the jacket's lower edge: legs start under it (hidden there), the torso covers them
TORSO_BACK = [(108, 140), (114, 230), (120, 326)]   # his back under the near arm (hidden): the torso's edge there

# bones (alan_walkA px): pivots and the joints along each limb
BONES = {
    'torso':    {'hip': (165, 340), 'neck': (176, 118)},
    'near_arm': {'shoulder': (124, 172), 'elbow': (96, 262), 'wrist': (84, 356)},
    'far_arm':  {'shoulder': (196, 176), 'elbow': (236, 286), 'wrist': (292, 326)},
    'near_leg': {'hip': (188, 350), 'knee': (219, 508), 'ankle': (262, 632), 'toe': (345, 668)},
    'far_leg':  {'hip': (144, 350), 'knee': (106, 505), 'ankle': (58, 622), 'toe': (100, 688)},
}
ORDER = ['far_arm', 'far_leg', 'near_leg', 'torso', 'near_arm']
FAR_SHADE = 0.74   # the far limbs are in his own shadow
# where the far limb hangs from, against the near one: the far hip just behind the near (so its top always stays
# hidden behind the near buttock and the jacket), the far shoulder at the painting's far shoulder
FAR_OFFSET = {'far_leg': (-16, 0), 'far_arm': (72, 4)}


def poly_mask(pts, size):
    m = Image.new('L', size, 0); ImageDraw.Draw(m).polygon(pts, fill=255); return np.asarray(m) > 0


def side_of(seam, size):
    """True left of the seam polyline (and of its vertical extensions above and below)."""
    w, h = size
    pts = [(seam[0][0], -10)] + seam + [(seam[-1][0], h + 10)]
    return poly_mask([(-10, -10)] + pts + [(-10, h + 10)], size)


def fill(rgba, have, want, radius=7):
    """Paint the pixels in want but not in have from the part's own paint around them (Telea), and make them opaque."""
    hole = want & ~have
    # everything outside the part is inpainted from the part alone, so no empty (black) pixel bleeds in
    out = rgba.copy()
    inner = cv2.erode(have.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0  # inside the pale painted outline
    out[..., :3] = cv2.inpaint(np.ascontiguousarray(rgba[..., :3]), (~inner).astype(np.uint8) * 255, radius, cv2.INPAINT_TELEA)
    out[..., :3] = np.where(have[..., None], rgba[..., :3], out[..., :3])
    out[..., 3] = np.where(want, np.where(hole, 255, rgba[..., 3]), 0)
    return out


def main():
    im = Image.open(f'{ROOT}/art/sprites/{BASE}.webp').convert('RGBA'); W, H = im.size
    a = np.asarray(im).copy(); solid = a[..., 3] > 8
    yy, xx = np.mgrid[0:H, 0:W]
    near_arm = poly_mask(NEAR_ARM, (W, H)) & solid
    far_arm = poly_mask(FAR_ARM, (W, H)) & solid
    brown_ = a[..., 0].astype(int) > a[..., 2].astype(int) + 12
    legs = solid & (yy >= HEM - 2) & ~near_arm & ~far_arm & ~(brown_ & (yy < HEM + 30))  # the jacket's hem stays on the torso
    left = side_of(SEAM, (W, H))
    far_leg, near_leg = legs & left, legs & ~left
    # the torso: everything above the hem, and the brown of the jacket (not the blue of the jeans) just below it
    brown = a[..., 0].astype(int) > a[..., 2].astype(int) + 12
    torso = solid & ~near_arm & ~far_arm & ((yy < HEM) | (brown & (yy < HEM + 30)))
    torso = cv2.morphologyEx(torso.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    parts = {}
    # the torso under the near arm: his back, filled from the jacket around it
    back = poly_mask([(p[0], p[1]) for p in TORSO_BACK] + [(150, HEM), (150, 136)], (W, H))
    parts['torso'] = fill(np.where(torso[..., None], a, 0).astype(np.uint8), torso, torso | (back & (yy < HEM + 4)), 9)
    parts['near_arm'] = np.where(near_arm[..., None], a, 0).astype(np.uint8)
    parts['far_arm'] = np.where(far_arm[..., None], a, 0).astype(np.uint8)
    # the far leg behind the near thigh: a strip past the seam, filled from the far leg's own denim
    strip = cv2.dilate(far_leg.astype(np.uint8), np.ones((1, 13), np.uint8)) > 0  # just enough to close the seam
    strip &= (yy < 460) & (yy > HEM - 2) & ~far_leg & solid
    parts['far_leg'] = fill(np.where(far_leg[..., None], a, 0).astype(np.uint8), far_leg, far_leg | strip, 7)
    # both legs reach up under the jacket, so a swung thigh never shows a gap at the hem
    for k in ('far_leg', 'near_leg'):
        p = parts.get(k, np.where(near_leg[..., None], a, 0).astype(np.uint8))
        m = p[..., 3] > 8
        col = np.where(m.any(0))[0]
        top = HEM - 2
        ext = np.zeros_like(m)
        for x in col:
            ys = np.where(m[:, x])[0]
            if len(ys) and top < ys.min() < HEM + 40: ext[top:ys.min(), x] = True  # thigh columns only
        parts[k] = fill(p, m, m | ext, 5)
    if 'near_leg' not in parts: parts['near_leg'] = np.where(near_leg[..., None], a, 0).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True)
    rig = {'base': BASE, 'size': [W, H], 'order': ORDER, 'bones': json.loads(json.dumps(BONES)), 'parts': {}}
    # The far limbs are the near ones again, in his shadow, hung from the far hip and shoulder: the painting hides too
    # much of the far thigh and upper arm to cut them whole (a cut edge shows the moment they swing past the near ones)
    for far, near, d in (('far_leg', 'near_leg', 'hip'), ('far_arm', 'near_arm', 'shoulder')):
        dx = FAR_OFFSET[far]
        p = parts[near].astype(np.float32).copy(); p[..., :3] *= FAR_SHADE
        shifted = np.zeros_like(p)
        x0, y0 = max(0, dx[0]), max(0, dx[1]); sx0, sy0 = max(0, -dx[0]), max(0, -dx[1])
        hh, ww = H - abs(dx[1]), W - abs(dx[0])
        shifted[y0:y0 + hh, x0:x0 + ww] = p[sy0:sy0 + hh, sx0:sx0 + ww]
        if far == 'far_leg':  # its top (the near leg's hip, moved back) stays inside the jacket's back edge
            back = np.where(parts['torso'][HEM - 6, :, 3] > 128)[0].min() + 6
            shifted[: BONES[far]['hip'][1] + 40, :back] = 0
        parts[far] = shifted.astype(np.uint8)
        rig['bones'][far] = {k: [v[0] + dx[0], v[1] + dx[1]] for k, v in BONES[near].items()}
    for k, p in parts.items():
        ys, xs = np.where(p[..., 3] > 0)
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        Image.fromarray(p[y0:y1, x0:x1], 'RGBA').save(f'{OUT}{k}.png')
        rig['parts'][k] = {'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}
    json.dump(rig, open(OUT + 'rig.json', 'w'), indent=1)
    print({k: v for k, v in rig['parts'].items()})


if __name__ == '__main__':
    main()
