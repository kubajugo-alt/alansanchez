# The rewritten Duarte scene's paintings (Canva, Duarte on the left, Alan on the right, both standing, on green) made
# pair sprites for review: the green keyed out, each painting scaled so Alan stands his game height (720 px), cut to
# the two figures, and anchored on Alan's feet (ax, fy) with Duarte's feet (px, pfy) for stepping in and out of the
# painting. The four legs are found at shin height; the two left ones are Duarte's, the two right Alan's. Alan stays on
# his own feet from painting to painting (no sliding to the best overlap, as with the bath: here the two of them move
# towards each other, and an overlap match would walk Alan across the room).
#   python3 scripts/duarte_new_fit.py <dir of Canva exports, named as in ORDER>
#   -> art/review/alan/duarte_new/sprites/*.webp and sprites.json
import json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from canva_restyle_fit import key_out

OUT = 'art/review/alan/duarte_new'
H = 720  # Alan's standing height in a pair sprite
# scene order: key paintings and the in-between after each
ORDER = [('k1', 'book'), ('i1', 'book_ib'), ('k2', 'terms'), ('i2', 'terms_ib'), ('k3', 'lesson'), ('i3', 'lesson_ib'),
         ('k4', 'kiss'), ('i4n', 'kiss_ib'), ('k5n', 'jackets'), ('k5k', 'kiss2'), ('tee', 'tee'), ('k6', 'shirts'), ('push', 'push')]
# paintings where Alan's head isn't at his standing height (leaning in to kiss; arms and T-shirt over his head):
# scaled like the ones either side instead
LEANING = {'i3', 'k4', 'i4n', 'k5k', 'tee', 'push'}


def legs(a, bot, h):
    for f in (0.25, 0.2, 0.3, 0.15, 0.35):  # shin height; a little higher or lower where two legs touch there
        row = a[int(bot - h * f)]; cols = np.nonzero(row)[0]
        runs = np.split(cols, np.nonzero(np.diff(cols) > 3)[0] + 1)
        runs = sorted((r for r in runs if len(r) > 20), key=lambda r: r[0])
        if len(runs) == 4: return runs
    raise ValueError(f'{len(runs)} legs')


def measure(a):
    ys, xs = np.nonzero(a); bot = ys.max(); top = ys.min(); h = bot - top
    L = legs(a, bot, h)
    split = (L[1][-1] + L[2][0]) // 2
    # between the two ankles (each leg followed down from the shin to just above the boot, kept within its own
    # columns so a jacket on the floor beside it doesn't count)
    def ankle(run):
        row = a[int(bot - h * 0.07), run[0] - 30:run[-1] + 31]; cols = np.nonzero(row)[0] + run[0] - 30
        near = cols[np.abs(cols - run.mean()) < (run[-1] - run[0])]
        return near.mean() if len(near) else run.mean()
    ax = (ankle(L[2]) + ankle(L[3])) / 2
    px = (ankle(L[0]) + ankle(L[1])) / 2
    # soles: the lowest row of each figure's own columns
    # soles: the lowest row under each figure's own legs (the jackets on the floor beside them reach lower)
    fy = np.nonzero(a[:, L[2][0]:L[3][-1] + 1].any(1))[0].max() + 1
    pfy = np.nonzero(a[:, L[0][0]:L[1][-1] + 1].any(1))[0].max() + 1
    atop = np.nonzero(a[:, split + 20:].any(1))[0].min()
    return dict(ax=ax, fy=fy, px=px, pfy=pfy, alan_h=fy - atop, split=split)


def main(src):
    os.makedirs(OUT + '/sprites', exist_ok=True)
    cut, meas = {}, {}
    for f, _ in ORDER:
        rgba = key_out(np.asarray(Image.open(f'{src}/{f}.png').convert('RGB')))
        rgba[..., 3][rgba[..., 3] < 24] = 0
        # Canva's odd magenta patch (a boot in the jacket painting) back to boot brown
        c = rgba[..., :3].astype(int); mg = (c[..., 2] > c[..., 1] + 8) & (c[..., 0] > c[..., 1] + 15)  # purple to magenta: red and blue over green
        rgba[..., :3][mg] = np.stack([c[..., 0][mg] * 1.0, c[..., 0][mg] * 0.6, c[..., 0][mg] * 0.35], 1).clip(0, 255).astype(np.uint8)
        cut[f] = rgba; meas[f] = measure(rgba[..., 3] > 128)
    # the scale: Alan's height where he stands straight; where he leans in, the mean of the standing ones either side
    names = [f for f, _ in ORDER]
    for i, f in enumerate(names):
        if f in LEANING:
            l = next(meas[g]['alan_h'] for g in reversed(names[:i]) if g not in LEANING)
            r = next((meas[g]['alan_h'] for g in names[i + 1:] if g not in LEANING), l)
            meas[f]['stand_h'] = (l + r) / 2
        else: meas[f]['stand_h'] = meas[f]['alan_h']
    sp = {}
    for f, name in ORDER:
        m = meas[f]; s = H / m['stand_h']; rgba = cut[f]
        ys, xs = np.nonzero(rgba[..., 3] > 0)
        x0, x1, y0, y1 = max(0, xs.min() - 4), xs.max() + 5, max(0, ys.min() - 4), ys.max() + 5
        im = Image.fromarray(rgba[y0:y1, x0:x1], 'RGBA')
        w, hh = round(im.width * s), round(im.height * s)
        im = im.resize((w, hh), Image.LANCZOS)
        k = 'pair_duarte_' + name
        im.save(f'{OUT}/sprites/{k}.webp', 'WEBP', quality=92, method=6)
        sp[k] = dict(src=f'{OUT}/sprites/{k}.webp', w=w, hh=hh, h=H, ax=round((m['ax'] - x0) * s, 1), fy=round((m['fy'] - y0) * s, 1),
                     top=0.0, px=round((m['px'] - x0) * s, 1), pfy=round((m['pfy'] - y0) * s, 1), rigid=True)
    json.dump(sp, open(f'{OUT}/sprites.json', 'w'), indent=1)
    for k, m in sp.items(): print(k, {x: m[x] for x in ('w', 'hh', 'ax', 'fy', 'px', 'pfy')})




# The bed part, painted one figure at a time (a pair on the bed was refused): Alan lying back across the bed, Duarte
# standing by it, Duarte kneeling. Each scaled so the figure's standing height (measured, or from the head size for
# the lying and kneeling ones) is 720 px, anchored where it meets the floor; the lap (on Alan) and the hands (on Duarte)
# are kept as points, so the scene can kneel Duarte where his hands land on Alan's thighs.
#   python3 scripts/duarte_new_fit.py --solo <dir>
SOLO = {  # export: (sprite key, standing height in export px, anchor on the floor, {name: point}) in export px
    'lie': ('alan_dn_lie', 1450, (440, 1000), {'lap': (640, 470)}),
    'dstand': ('duarte_dn_stand', None, None, {}),
    'kneel': ('duarte_dn_kneel', 1630, (520, 1312), {'hands': None}),
}


def solo(src):
    sp = json.load(open(f'{OUT}/sprites.json'))
    for f, (k, stand, anchor, pts) in SOLO.items():
        rgba = key_out(np.asarray(Image.open(f'{src}/{f}.png').convert('RGB'))); rgba[..., 3][rgba[..., 3] < 24] = 0
        a = rgba[..., 3] > 128; ys, xs = np.nonzero(a)
        if stand is None:  # standing: head to soles, anchor between the boots
            stand = ys.max() - ys.min()
            band = a[ys.max() - int(stand * 0.04):ys.max() + 1]; anchor = (float(np.nonzero(band)[1].mean()), ys.max() + 1)
        pts = dict(pts)
        if 'hands' in pts:  # the reaching hands: the palms just behind the fingertips
            rx = xs.max(); rows = np.nonzero(a[:, rx - 3:rx + 1].any(1))[0]; pts['hands'] = (rx - 60, float(rows.mean()))
        s = H / stand
        x0, x1, y0, y1 = max(0, xs.min() - 4), xs.max() + 5, max(0, ys.min() - 4), ys.max() + 5
        im = Image.fromarray(rgba[y0:y1, x0:x1], 'RGBA'); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        im.save(f'{OUT}/sprites/{k}.webp', 'WEBP', quality=92, method=6)
        m = dict(src=f'{OUT}/sprites/{k}.webp', w=im.width, hh=im.height, h=H, ax=round((anchor[0] - x0) * s, 1), fy=round((anchor[1] - y0) * s, 1), top=0.0)
        for n, (px, py) in pts.items(): m[n] = [round((px - x0) * s, 1), round((py - y0) * s, 1)]
        sp[k] = m; print(k, m)
    json.dump(sp, open(f'{OUT}/sprites.json', 'w'), indent=1)


if __name__ == '__main__':
    solo(sys.argv[2]) if sys.argv[1] == '--solo' else main(sys.argv[1])
