#!/usr/bin/env python3
"""Sky masks for the drifting cloud (docs/review/env_movement.md, fix G5; HANDOFF entry 137).

  python3 sequel/scripts/sky_masks.py [room ...]      (no rooms: all of ROOMS)

The same flood as Wednesday's js/story/wed.js skyMask (from seed points through pale, unsaturated pixels whose colour
changes smoothly, so a roof, a palm, a mullion or a gull stops it), run once on the 1280x720 painting instead of in the
browser, and saved as art/fx/<room>_sky.png (white, the sky's alpha softened 1.5 px). The paintings are untouched. The
game draws the two-tone panza through it (js/story/core.js S.panza). Also writes art/review/sky/<room>.jpg: the mask
tinted over the painting, to check by eye.
"""
import os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOP = lambda x0=0, x1=1280, y=3: [(x, y) for x in range(x0 + 5, x1, 20)]
# room: (bg, seeds, ymax, tolerance, rects the flood may not enter)
ROOMS = {
    'gando': ('gando', [(x, y) for x in range(40, 460, 15) for y in (60, 80, 100, 120, 140, 160)], 300, 20, [(270, 30, 520, 90)]),   # (not the ceiling light)
    'hotel_room': ('hotel_room', [(880, 150), (900, 200), (950, 170), (930, 230), (980, 140)], 300, 16, []),
    'canteras': ('canteras', TOP(0, 900) + [(x, 300) for x in range(300, 900, 40)], 520, 14, []),
    'beach': ('beach', TOP(), 300, 14, []),
    'restaurant': ('hotel_restaurant', [(30, 140), (80, 170), (120, 210), (320, 150), (360, 170), (400, 200), (500, 170)], 270, 16, []),
    'courtyard': ('museum_courtyard', TOP(330, 1150), 90, 16, []),
    # the two exteriors that had no movement (HANDOFF 144)
    'colon_out': ('colon_out', TOP(), 230, 14, []),
    'museum_out': ('museum_out', TOP(110, 1250) + [(200, 120), (300, 200), (400, 250), (1180, 200)], 300, 14, []),
}
# the sea of cloud below the camp and through Cave 6's arch (HANDOFF 143): its whites and blue-grey shadows vary too
# much to flood, so it is picked by colour (neutral or cool, light) inside a box, less what stands in front of it
PALE = {
    'camp': ('camp', (0, 86, 800, 340), [(388, 238, 46, 72)]),      # (the paper sign hanging off the awning)
    'cave6': ('cave6', (30, 330, 200, 485), []),
}


def pale(bg, box, block):
    im = Image.open(os.path.join(SEQ, 'art/bg', bg + '.jpg')).convert('RGB').resize((1280, 720), Image.LANCZOS)
    hsv = np.asarray(im.convert('HSV')).astype(np.float32) / 255
    h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
    m = ((s < 0.13) | ((h > 170) & (h < 260) & (s < 0.35))) & (v > 0.5)
    x0, y0, x1, y1 = box; keep = np.zeros_like(m); keep[y0:y1, x0:x1] = True; m &= keep
    for bx, by, bw, bh in block: m[by:by + bh, bx:bx + bw] = False
    a = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    a = a.filter(ImageFilter.GaussianBlur(1.5))
    out = Image.new('RGBA', (1280, 720), (255, 255, 255, 0)); out.putalpha(a)
    return im, out, np.asarray(a) > 127


def mask(bg, seeds, ymax, tol, block):
    im = Image.open(os.path.join(SEQ, 'art/bg', bg + '.jpg')).convert('RGB').resize((1280, 720), Image.LANCZOS)
    p = np.asarray(im).astype(np.int32); H, W = 720, 1280
    mx, mn = p.max(2), p.min(2)
    ok = (mx > 70) & ((mx - mn) / (mx + 1) < 0.2)
    for x0, y0, x1, y1 in block: ok[y0:y1, x0:x1] = False
    m = np.zeros((H, W), bool); q = deque()
    for x, y in seeds:
        if ok[y, x] and not m[y, x]: m[y, x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < W and 0 <= ny < ymax and not m[ny, nx] and ok[ny, nx] and np.abs(p[ny, nx] - p[y, x]).sum() < tol:
                m[ny, nx] = True; q.append((nx, ny))
    a = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
    out = Image.new('RGBA', (W, H), (255, 255, 255, 0)); out.putalpha(a)
    return im, out, m


if __name__ == '__main__':
    names = sys.argv[1:] or list(ROOMS) + list(PALE)
    os.makedirs(os.path.join(SEQ, 'art/fx'), exist_ok=True); os.makedirs(os.path.join(SEQ, 'art/review/sky'), exist_ok=True)
    for n in names:
        im, out, m = pale(*PALE[n]) if n in PALE else mask(*ROOMS[n])
        out.save(os.path.join(SEQ, 'art/fx', n + '_sky.png'), optimize=True)
        tint = Image.new('RGB', im.size, (255, 0, 160))
        Image.composite(Image.blend(im, tint, 0.45), im, out.getchannel('A')).save(os.path.join(SEQ, 'art/review/sky', n + '.jpg'), quality=82)
        ys, xs = np.where(m)
        print(f'{n}: {m.sum()} px of sky' + (f', x {xs.min()}-{xs.max()}, y {ys.min()}-{ys.max()}' if m.any() else ''))
