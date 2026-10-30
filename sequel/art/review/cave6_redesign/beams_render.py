# The light over Cave 6's two paintings: the noon column down the shaft onto all seven discs; each disc's column back up
# to its own triangle, ending on the wall as a soft patch of light (no light-made shapes); everything stops at real edges.
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
W, H = 1280, 720
yy = np.mgrid[0:H, 0:W][0]
def mask_poly(pts, blur=2):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([tuple(p) for p in pts], fill=255)
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255
def mask_ell(box, blur=2):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse(box, fill=255)
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255
def col_pts(p0, w0, p1, w1):
    (x0, y0), (x1, y1) = p0, p1; dx, dy = x1 - x0, y1 - y0; L = (dx * dx + dy * dy) ** 0.5; nx, ny = -dy / L, dx / L
    return [(x0 + nx * w0 / 2, y0 + ny * w0 / 2), (x1 + nx * w1 / 2, y1 + ny * w1 / 2), (x1 - nx * w1 / 2, y1 - ny * w1 / 2), (x0 - nx * w0 / 2, y0 - ny * w0 / 2)]
def dust(acc, m, n, a, seed):
    ys, xs = np.nonzero(m > 0.6)
    if len(xs) == 0: return
    for k in np.random.RandomState(seed).choice(len(xs), size=min(n, len(xs)), replace=False): acc[ys[k], xs[k]] += a
def light(base, acc, col=(255, 228, 160)):
    b = np.asarray(base.convert('RGB'), np.float32) / 255; a = np.clip(acc, 0, 1.3)[..., None]; c = np.array(col, np.float32)[None, None] / 255
    out = 1 - (1 - b) * (1 - c * a * 0.8); out += b * c * a * 0.3
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))
def patch(c, w, a):   # where a column meets the wall: a soft oval of light the column's width
    return mask_ell((c[0] - w * 0.6, c[1] - w * 0.45, c[0] + w * 0.6, c[1] + w * 0.45), w * 0.18) * a
TRI = [[(288, 268), (348, 268), (317, 335)], [(368, 272), (430, 272), (399, 337)], [(449, 274), (510, 274), (479, 339)],
       [(535, 215), (760, 215), (642, 415)], [(787, 274), (853, 274), (817, 340)], [(873, 272), (939, 272), (903, 338)], [(957, 268), (1020, 268), (990, 335)]]
def cen(t): return (sum(p[0] for p in t) / 3, sum(p[1] for p in t) / 3)
def wid(t): return t[1][0] - t[0][0]
up = Image.open('upper_rope2_1280.png'); low = Image.open('lower_final_1280.png')
HOLE = (421, 495, 852, 597); hole = mask_ell(HOLE, 1.5)
air_or_hole = np.clip((yy < 545).astype(np.float32) * (1 - mask_ell((421, 545, 852, 720), 0)) + hole, 0, 1)
XS = [596, 609, 622, 636, 650, 663, 676]
def upper(state):
    acc = np.zeros((H, W), np.float32)
    m = mask_poly([(620, 46), (652, 46), (690, 660), (582, 660)], 3) * air_or_hole; acc += m * 0.42; dust(acc, m, 160, 0.25, 1)
    for i in (range(7) if state == 'closed' else [4]):
        t = TRI[6 - i]; c = cen(t); w = wid(t) * 0.75
        m = mask_poly(col_pts((XS[i], 640), 26, c, w), 3) * air_or_hole; acc += m * 0.32; dust(acc, m, 60, 0.2, 10 + i)
        acc += patch(c, w, 0.4)
    if state == 'baute': acc += hole * mask_ell((560, 520, 712, 590), 6) * 0.35
    return light(up, acc)
def to_low(p): return (417 + (p[0] - 230) * 440 / 830, 50 + (p[1] - 180) * 143 / 270)
TRIL = [[to_low(p) for p in t] for t in TRI]
OPEN = (405, 24, 870, 172); through = mask_ell(OPEN, 1.5)
D = [(396, 565), (475, 565), (558, 565), (638, 565), (719, 565), (799, 565), (879, 565)]
POOL = (346, 540, 932, 594); RIM = 150
def lower(state):
    acc = np.zeros((H, W), np.float32)
    m = mask_poly([(622, 34), (658, 34), (932, 567), (346, 567)], 3) * np.where(yy < RIM, through, 1); acc += m * 0.30; dust(acc, m, 220, 0.22, 2)
    acc += mask_ell(POOL, 6) * 0.45
    pairs = [(i, 6 - i) for i in range(7)] if state == 'closed' else [(4, 2), (6, None)]
    for i, k in pairs:
        p = D[i]
        if k is None:
            m = mask_poly(col_pts((p[0], p[1] - 4), 34, (638, 640), 70), 3); acc += m * 0.4; acc += mask_ell((560, 618, 716, 662), 5) * 0.55; continue
        t = TRIL[k]; c = cen(t); w = wid(t) * 0.8
        m = mask_poly(col_pts((p[0], p[1] - 6), 40, c, w), 3) * np.where(yy < RIM, through, 1); acc += m * 0.34; dust(acc, m, 60, 0.2, 30 + i)
        acc += patch(c, w, 0.45) * through
        acc += mask_ell((p[0] - 26, p[1] - 10, p[0] + 26, p[1] + 10), 3) * 0.6
    return light(low, acc)
frames = [upper('closed'), lower('closed'), upper('baute'), lower('baute')]
for f, n in zip(frames, ['edge_closed_upper', 'edge_closed_lower', 'edge_baute_upper', 'edge_baute_lower']): f.save(n + '.png')
s = Image.new('RGB', (2570, 1450), (15, 15, 15))
for k, f in enumerate(frames): s.paste(f, ((k % 2) * 1290, (k // 2) * 730))
s.save('beams_edges.jpg', quality=88)
