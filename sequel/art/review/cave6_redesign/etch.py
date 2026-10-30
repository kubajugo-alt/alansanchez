# Etch the seven signs into the Cave 6 paintings as carved grooves: in the lower floor in front of each socket
# (floor order) and above each triangle (wall order), in the upper cave and in the lower view up through the opening.
# The six small discs are the moon's phases (waxing left of the sun, waning right of him on the wall), the seventh the
# rayed sun. A phase is the moon's outline cut as a groove and her lit part cut out whole.
import math, numpy as np, json
from PIL import Image, ImageDraw, ImageFilter
SS = 4
PHASES = {'wax_crescent': (1, .3), 'first_quarter': (1, 0), 'wax_gibbous': (1, -.5),
          'wan_gibbous': (-1, -.5), 'last_quarter': (-1, 0), 'wan_crescent': (-1, .3)}
def phase_fill(n):   # the lit part: the limb on the lit side, back along the terminator
    side, k = PHASES[n]; ts = np.linspace(-math.pi / 2, math.pi / 2, 24)
    limb = [(side * math.cos(t), math.sin(t)) for t in ts]
    term = [(side * k * math.cos(t), math.sin(t)) for t in ts[::-1]]
    return limb + term
def glyph(n):
    P = []
    if n in PHASES:
        P.append([(math.cos(a / 40 * 2 * math.pi), math.sin(a / 40 * 2 * math.pi)) for a in range(41)])
    elif n == 'rings':
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
        if n in PHASES:
            d.polygon([((cx + x * r) * SS, (cy + y * r * sy) * SS) for x, y in phase_fill(n)], fill=255)
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
WALL = ['wax_crescent', 'first_quarter', 'wax_gibbous', 'sun', 'wan_gibbous', 'last_quarter', 'wan_crescent']
FLOOR = WALL[::-1]
if __name__ == '__main__':
    meta = json.load(open('discs/discs.json')); X = [m['x'] + m['w'] / 2 for m in meta]
    floor = [(FLOOR[i], X[i], 613, 15, .45, 1.6) for i in range(7)]
    lowtri = [(WALL[i], x, y, 6, .9, .9) for i, (x, y) in enumerate(zip([460, 505, 549, 637, 730, 775, 820], [86, 88, 90, 66, 90, 88, 86]))]
    for src, out in [('low_real_1280.png', 'low_real_etched.png'), ('low_real_one_disc.png', 'low_real_one_disc_etched.png'), ('low_real_empty.png', 'low_real_empty_etched.png')]:
        im = etch(Image.open(src), floor, .55); im = etch(im, lowtri, .45); im.save(out)
    uptri = [(WALL[i], x, y, r, 1, 2) for i, (x, y, r) in enumerate(zip([320, 401, 481, 646, 819, 905, 990], [244, 246, 248, 192, 248, 246, 244], [11, 11, 11, 14, 11, 11, 11]))]
    etch(Image.open('up_real_1280.png'), uptri, .55).save('up_real_etched.png')
