# The card players on one table: both frames become the same empty furniture (art/review/cards/furniture.png, painted
# from npc_cards) with that frame's two men (art/review/cards/men_<frame>.png, Gemini, the furniture painted out)
# layered in, so the table and chairs never move when the frames swap.
#   python3 scripts/cards_compose.py   -> art/review/cards/sprites/<frame>.webp + meta.json
# Layers, back to front, as the original painting overlaps them: chairs, the left man, the table, the right man.
# Placement: each man by SIFT onto his own original frame (same painting, painted out), then that frame onto the
# furniture by the outer edges of the two chairs and the floor line (repaints don't SIFT-match each other).
import json, os, sys
import cv2, numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
import gen_image as gi
D = os.path.join(ROOT, 'art/review/cards'); OUT = os.path.join(D, 'sprites'); os.makedirs(OUT, exist_ok=True)
t = open(os.path.join(ROOT, 'js/sprites.js')).read(); META = json.loads(t[t.index('{'):t.rindex('}') + 1])
sift = cv2.SIFT_create(6000)


def crop(a):
    ys, xs = np.where(a[..., 3] > 128); return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def split_men(a):
    """The two men in a men-only image: left and right by the widest empty column gap between them."""
    cols = (a[..., 3] > 128).sum(0); mid = a.shape[1] // 2; span = range(int(a.shape[1] * 0.3), int(a.shape[1] * 0.7))
    gap = min(span, key=lambda x: cols[x])
    L = a.copy(); L[:, gap:, 3] = 0; R = a.copy(); R[:, :gap, 3] = 0
    return L, R


def sim(A, B, mA=None, mB=None):
    """Similarity transform taking A's pixels onto B's (2x3), from SIFT matches."""
    g = lambda x: cv2.cvtColor(np.ascontiguousarray(x[..., :3]), cv2.COLOR_RGB2GRAY)
    m = lambda x, mm: ((x[..., 3] > 128) if mm is None else mm).astype(np.uint8) * 255
    k1, d1 = sift.detectAndCompute(g(A), m(A, mA)); k2, d2 = sift.detectAndCompute(g(B), m(B, mB))
    ms = [p for p, q in (x for x in cv2.BFMatcher().knnMatch(d1, d2, k=2) if len(x) == 2) if p.distance < 0.75 * q.distance]
    P = np.float32([k1[x.queryIdx].pt for x in ms]); Q = np.float32([k2[x.trainIdx].pt for x in ms])
    T, inl = cv2.estimateAffinePartial2D(P, Q, method=cv2.RANSAC, ransacReprojThreshold=4)
    return T, int(inl.sum())


def compose(T1, T2):
    a = np.vstack([T1, [0, 0, 1]]); b = np.vstack([T2, [0, 0, 1]]); return (b @ a)[:2]


def lower(a, f=0.5):
    """Mask of the lower part (legs) of a figure."""
    al = a[..., 3] > 128; ys, _ = np.where(al); y0 = int(ys.min() + (ys.max() - ys.min()) * f)
    m = np.zeros_like(al); m[y0:] = al[y0:]; return m


def edges(a):
    """(left, right, bottom) of a painting: the two chairs' outer edges and the floor."""
    ys, xs = np.where(a[..., 3] > 128); return float(xs.min()), float(xs.max()), float(ys.max())


def to_furn(o, f):
    l0, r0, b0 = edges(o); l1, r1, b1 = edges(f); k = (r1 - l1) / (r0 - l0)
    return np.float32([[k, 0, l1 - l0 * k], [0, k, b1 - b0 * k]])


def lift_hand(Lm, table, rows, apron):
    """Frame B: the card he slaps down was painted on a taller table; bend his reaching forearm up so the hand lands
    on this tabletop. Only the forearm moves (weight 0 at the elbow, 1 at the hand); his lap below stays put."""
    r, g, b, a = [Lm[..., i].astype(int) for i in range(4)]
    card = (r > 140) & (g < 110) & (b < 120) & (a > 128); card[:apron - 90] = False
    ys, xs = np.where(card)
    if not len(ys): return Lm
    hx, hy = float(np.median(xs)), float(np.median(ys))
    target = rows.min() + (apron - rows.min()) * 0.35  # on the tabletop, a little in from its front edge
    lift = max(0.0, hy - target)
    H, W = Lm.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    reach = 0.9 * (hx - (np.where((Lm[..., 3] > 128).any(0))[0].min()))  # from near his back to the hand
    wx = np.clip((xx - (hx - reach)) / reach, 0, 1); wx = wx * wx * (3 - 2 * wx)
    wy = np.clip(((hy + 8) - yy) / 22, 0, 1)                       # nothing below the hand moves (his lap) ...
    flash = cv2.dilate(card.astype(np.uint8), np.ones((61, 61), np.uint8)).astype(bool)
    pale = (r > 200) & (g > 190) & (b > 170) & (a > 60) & flash    # ... except the card and its white flash lines
    whole = cv2.dilate((card | pale).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32)
    wy = np.maximum(wy, cv2.GaussianBlur(whole, (0, 0), 1.5))
    wy *= np.clip((yy - (hy - 260)) / 120, 0, 1)                   # nor his shoulder and the cards held up high
    m = (lift * wx * wy).astype(np.float32)
    out = cv2.remap(Lm, xx, yy + m, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    print('frame B: forearm lifted %.0f px (hand at %.0f,%.0f; tabletop rows %d-%d)' % (lift, hx, hy, rows.min(), apron))
    return out


def main():
    furn = np.asarray(Image.open(os.path.join(D, 'furniture.png')).convert('RGBA'))
    furn = np.pad(furn, ((furn.shape[0] // 3, 0), (furn.shape[1] // 8, furn.shape[1] // 8), (0, 0)))  # room for their caps
    place = {}
    for k, i in (('npc_cards', 0), ('npc_cards_b', 2)):
        orig = np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{k}.webp')).convert('RGBA'))
        T_of = to_furn(orig, furn)
        if k == 'npc_cards': T_ref, orig0 = T_of, orig
        L, R = split_men(np.asarray(Image.open(os.path.join(D, f'men_{k}.png')).convert('RGBA')))
        for side, m in (('L', L), ('R', R)):
            T, n = sim(m, orig); place.setdefault(side, [None] * 4)
            place[side][i], place[side][i + 1] = m, compose(T, T_of); print(k, side, 'man -> original', n, 'inliers')
    T_of, orig = T_ref, orig0
    # the table: the furniture's middle columns (between the two chair seats)
    al = furn[..., 3] > 128; cols = al.sum(0); W = furn.shape[1]
    xs = np.where(cols > 0)[0]
    # chair seats are the two dense runs at the sides; the table spans the columns in between
    third = (xs.max() - xs.min()) / 3
    tl, tr = int(xs.min() + third * 0.95), int(xs.max() - third * 0.95)
    table = furn.copy(); table[:, :tl, 3] = 0; table[:, tr:, 3] = 0
    chairs = furn.copy(); chairs[:, tl:tr, 3] = 0
    H = furn.shape[0]
    def warp(img, T): return cv2.warpAffine(img, T, (W, H), flags=cv2.INTER_LANCZOS4, borderValue=(0, 0, 0, 0))
    def over(dst, src):
        a = src[..., 3:4].astype(np.float32) / 255; d = dst.astype(np.float32)
        out = src[..., :3] * a + d[..., :3] * (1 - a); al = a[..., 0] * 255 + d[..., 3] * (1 - a[..., 0])
        return np.dstack([out, al]).clip(0, 255).astype(np.uint8)
    # the tabletop and its apron: the rows where the table is at its widest; the left man is behind the table
    # below the tabletop's front edge (his legs, under the table), in front of it above (his arms and hands on it)
    tw = (table[..., 3] > 128).sum(1); rows = np.where(tw > tw.max() * 0.8)[0]; apron = int(rows.max())
    frames = {}
    for k, idx in (('npc_cards', 0), ('npc_cards_b', 2)):
        c = chairs.copy()
        Lm = warp(place['L'][idx], place['L'][idx + 1])
        if k == 'npc_cards_b': Lm = lift_hand(Lm, table, rows, apron)
        edge = int(rows.min() + (apron - rows.min()) * 0.45)  # the tabletop's front edge
        lo = Lm.copy(); lo[:edge, :, 3] = 0; hi = Lm.copy(); hi[edge:, :, 3] = 0
        c = over(c, lo)
        c = over(c, table)
        c = over(c, hi)
        c = over(c, warp(place['R'][idx], place['R'][idx + 1]))
        frames[k] = c
    # one canvas for both, cropped to their union, scaled to the original's resolution
    union = np.zeros((H, W), bool)
    for c in frames.values(): union |= c[..., 3] > 8
    ys, xs = np.where(union); y0, y1, x0, x1 = max(0, ys.min() - 4), ys.max() + 5, max(0, xs.min() - 4), xs.max() + 5
    print("touches canvas edge" if ys.min() < 2 or xs.min() < 2 or ys.max() > H - 3 or xs.max() > W - 3 else "inside canvas")
    s = (orig.shape[0]) / (y1 - y0) * 1.0  # about the original's height in px
    m0 = META['npc_cards']
    # the original's feet anchor and size, carried through original -> furniture -> crop -> scale
    k_of = float(np.hypot(T_of[0, 0], T_of[1, 0]))
    p = T_of @ np.array([m0['ax'], m0['fy'], 1.0])
    meta = {}
    for k, c in frames.items():
        im = Image.fromarray(c[y0:y1, x0:x1], 'RGBA'); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        im.save(os.path.join(OUT, f'{k}.webp'), quality=90)
        a = np.asarray(im)[..., 3]; yy, _ = np.where(a > 128)
        meta[k] = dict(w=im.width, hh=im.height, h=round(m0['h'] * k_of * s, 2), ax=round((p[0] - x0) * s, 1), fy=round((p[1] - y0) * s, 1), top=float(yy.min()))
    json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1); print(meta)


if __name__ == '__main__':
    main()
