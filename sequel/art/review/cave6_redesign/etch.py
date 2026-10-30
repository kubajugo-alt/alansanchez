# Etch the seven signs into the Cave 6 paintings as carved grooves: in the lower floor in front of each socket
# (floor order) and above each triangle (wall order), in the upper cave and in the lower view up through the opening.
import math, numpy as np, json
from PIL import Image, ImageDraw, ImageFilter
SS = 4
def glyph(n):
    P = []
    if n == 'rings':
        P += [[(math.cos(a / 40 * 2 * math.pi), math.sin(a / 40 * 2 * math.pi)) for a in range(41)],
              [(.45 * math.cos(a / 30 * 2 * math.pi), .45 * math.sin(a / 30 * 2 * math.pi)) for a in range(31)]]
    elif n == 'spiral':
        P.append([(t / 14 * math.cos(t), t / 14 * math.sin(t)) for t in np.arange(0, 14, .2)])
    elif n == 'zigzag':
        P.append([(-1 + k * 2 / 6, -.45 if k % 2 else .45) for k in range(7)])
    elif n == 'chequer':
        P += [[(-1, -1), (1, -1), (1, 1), (-1, 1), (-1, -1)], [(0, -1), (0, 1)], [(-1, 0), (1, 0)]]
    elif n == 'triangle':
        P.append([(-1, -.8), (1, -.8), (0, 1), (-1, -.8)])
    elif n == 'crescent':   # the pintaderas' half-circle fan: the moon (or the sun) half gone into the sea
        P.append([(math.cos(a), -math.sin(a) + .45) for a in np.arange(0, math.pi + .01, .1)] + [(1, .45)])
        P.append([(.35 * math.cos(a), -.35 * math.sin(a) + .45) for a in np.arange(0, math.pi + .01, .15)])
        for k in range(1, 6):
            a = k * math.pi / 6; P.append([(.35 * math.cos(a), -.35 * math.sin(a) + .45), (math.cos(a), -math.sin(a) + .45)])
    else:
        P.append([(.38 * math.cos(a / 30 * 2 * math.pi), .38 * math.sin(a / 30 * 2 * math.pi)) for a in range(31)])
        for k in range(8):
            a = k * math.pi / 4; P.append([(.6 * math.cos(a), .6 * math.sin(a)), (1 * math.cos(a), 1 * math.sin(a))])
    return P
def etch(img, marks, depth=.5):
    W, H = img.size; m = Image.new('L', (W * SS, H * SS), 0); d = ImageDraw.Draw(m)
    for n, cx, cy, r, sy, w in marks:
        for pl in glyph(n):
            d.line([((cx + x * r) * SS, (cy + y * r * sy) * SS) for x, y in pl], fill=255, width=max(1, round(w * SS)), joint='curve')
    m = m.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(.4))
    M = np.asarray(m, np.float32) / 255
    up = np.roll(M, 1, 0); dn = np.roll(M, -1, 0)
    shade = np.clip(M - dn, 0, 1)            # the upper inner wall of the groove: in shadow
    lit = np.clip(up - M, 0, 1)              # the lip just below the groove: catches the light from above
    a = np.asarray(img.convert('RGB'), np.float32)
    a = a * (1 - depth * M[..., None]) * (1 - .35 * shade[..., None]) + 60 * lit[..., None] * depth
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
WALL = ['rings', 'spiral', 'zigzag', 'sun', 'crescent', 'triangle', 'chequer']
FLOOR = WALL[::-1]
if __name__ == '__main__':
    meta = json.load(open('discs/discs.json')); X = [m['x'] + m['w'] / 2 for m in meta]
    floor = [(FLOOR[i], X[i], 612, 13, .42, 1.6) for i in range(7)]
    lowtri = [(WALL[i], x, y, 6, .9, .9) for i, (x, y) in enumerate(zip([460, 505, 549, 637, 730, 775, 820], [86, 88, 90, 66, 90, 88, 86]))]
    for src, out in [('low_real_1280.png', 'low_real_etched.png'), ('low_real_one_disc.png', 'low_real_one_disc_etched.png'), ('low_real_empty.png', 'low_real_empty_etched.png')]:
        im = etch(Image.open(src), floor, .55); im = etch(im, lowtri, .45); im.save(out)
    uptri = [(WALL[i], x, y, r, 1, 2) for i, (x, y, r) in enumerate(zip([320, 401, 481, 646, 819, 905, 990], [244, 246, 248, 192, 248, 246, 244], [11, 11, 11, 14, 11, 11, 11]))]
    etch(Image.open('up_real_1280.png'), uptri, .55).save('up_real_etched.png')
