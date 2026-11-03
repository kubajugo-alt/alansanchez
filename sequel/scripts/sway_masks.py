#!/usr/bin/env python3
"""Sway masks: only the plant or the cloth moves (docs/review/env_movement.md G3; HANDOFF entry 142).

  python3 sequel/scripts/sway_masks.py [bg ...]      (no names: all of BOXES)

For each painting, every row-shift box its room draws (FX.sway, billow, breathe in js/story/*.js, the same rects) gets
the pixels that should move: the plant's greens, or the cloth's colour, picked by hue, saturation and value on the
1280x720 painting, closed and grown 2 px so a frond's edge can stir over the sky, softened, then faded to nothing over
8 px at the box's edges (except at the edge of the picture), so nothing tears against the still painting. A box listed
with rule None stays black: it no longer moves (things the review found rigid). Writes art/fx/<bg>_sway.png (white, its alpha =
how much it moves) and art/review/sway/<bg>.jpg (the mask tinted over the painting, the boxes outlined) to check by
eye. js/fx.js uses a mask when the painting is listed in window.SWAY_MASKS (js/story/core.js) and ?env=2 is on.
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# rules: (hue range in degrees, min saturation 0..1, min value 0..1, max value)
GREEN = ((45, 175), 0.14, 0.10, 1.0)
PALM_NIGHT = ((45, 215), 0.12, 0.06, 1.0)      # the lobby's palms through the windows, blue-green against a blue sky
CLOTH = ((15, 55), 0.12, 0.30, 0.95)           # the camp's tan awning (not the white cloud, not the dark poles)
ALL = 'all'
BOXES = {
    'gando': [((1212, 282, 50, 70), GREEN)],
    'hotel_lobby': [((100, 82, 110, 66), PALM_NIGHT), ((0, 62, 74, 64), PALM_NIGHT)],
    'hotel_lobby_day': [((100, 82, 110, 66), GREEN), ((0, 62, 74, 64), GREEN)],
    'hotel_room': [((722, 70, 66, 455), ALL), ((1035, 52, 92, 490), ALL)],
    'canteras': [((920, 40, 250, 240), GREEN, [(1097, 150, 200, 200)]),   # (not the HOTEL CRISTINA sign's green letters)
                 ((1060, 0, 220, 140), GREEN), ((35, 334, 222, 62), ALL)],
    'beach': [((62, 334, 240, 84), None), ((168, 160, 80, 95), GREEN), ((330, 225, 60, 70), GREEN)],
    'beach_sun': [((62, 334, 240, 84), None), ((168, 160, 80, 95), GREEN), ((330, 225, 60, 70), GREEN)],
    'museum_hall': [((1102, 330, 40, 140), GREEN), ((1150, 395, 40, 70), GREEN)],
    'museum_courtyard': [((945, 135, 300, 155), None), ((295, 160, 140, 300), GREEN)],
    'mercado': [((1000, 280, 280, 200), None)],
    'colon': [((28, 150, 66, 190), GREEN), ((178, 185, 34, 110), GREEN), ((320, 215, 70, 82), GREEN)],
    'carmen_flat': [((535, 88, 40, 58), GREEN)],
    'rafa_studio': [((792, 158, 48, 62), GREEN)],
    'isleta': [((288, 215, 60, 46), GREEN)],
    'santa_ana': [((880, 0, 370, 110), GREEN), ((860, 130, 180, 120), GREEN), ((0, 0, 240, 150), GREEN)],
    'belfry': [((1040, 356, 48, 36), GREEN), ((606, 445, 50, 160), None), ((372, 70, 22, 390), None)],
    'colon_out': [((780, 330, 110, 215), ((45, 175), 0.14, 0.10, 1.0), [(878, 330, 20, 215)]), ((780, 330, 110, 215), ((270, 345), 0.18, 0.15, 1.0), [(878, 330, 20, 215)])],
    'camp': [((336, 176, 290, 42), CLOTH), ((770, 300, 70, 46), GREEN), ((1050, 400, 120, 70), GREEN)],
}
FEATHER, GROW = 8, 2


def pick(p, rule):
    hsv = np.asarray(Image.fromarray(p).convert('HSV')).astype(np.float32) / 255
    (h0, h1), smin, vmin, vmax = rule
    h = hsv[..., 0] * 360
    return (h >= h0) & (h <= h1) & (hsv[..., 1] >= smin) & (hsv[..., 2] >= vmin) & (hsv[..., 2] <= vmax)


def edge_fade(w, h, x, y):
    ex = np.minimum(np.arange(w) + 0.5, w - np.arange(w) - 0.5) / FEATHER
    ey = np.minimum(np.arange(h) + 0.5, h - np.arange(h) - 0.5) / FEATHER
    if x == 0: ex = np.where(np.arange(w) < w / 2, 1.0, ex)
    if y == 0: ey = np.where(np.arange(h) < h / 2, 1.0, ey)
    if x + w >= 1280: ex = np.where(np.arange(w) >= w / 2, 1.0, ex)
    if y + h >= 720: ey = np.where(np.arange(h) >= h / 2, 1.0, ey)
    s = lambda v: (lambda c: c * c * (3 - 2 * c))(np.clip(v, 0, 1))
    return s(ey)[:, None] * s(ex)[None, :]


def make(bg):
    im = Image.open(os.path.join(SEQ, 'art/bg', bg + '.jpg')).convert('RGB').resize((1280, 720), Image.LANCZOS)
    p = np.asarray(im)
    out = np.zeros((720, 1280), np.float32)
    for (x, y, w, h), rule, *ex in BOXES[bg]:
        if rule is None: continue
        if rule == ALL: m = np.ones((h, w), np.float32)
        else:
            m = Image.fromarray((pick(p[y:y + h, x:x + w], rule) * 255).astype(np.uint8))
            m = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))           # close pinholes
            m = m.filter(ImageFilter.MaxFilter(2 * GROW + 1)).filter(ImageFilter.GaussianBlur(1.5))
            m = np.asarray(m).astype(np.float32) / 255
        for ex0, ey0, ew, eh in (ex[0] if ex else []):     # parts of the box that must never move, softened 2 px
            cut = np.ones((h, w), np.float32); cut[max(0, ey0 - y):max(0, ey0 + eh - y), max(0, ex0 - x):max(0, ex0 + ew - x)] = 0
            m = m * (np.asarray(Image.fromarray((cut * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1))).astype(np.float32) / 255)
        out[y:y + h, x:x + w] = np.maximum(out[y:y + h, x:x + w], m * edge_fade(w, h, x, y))
    for (x, y, w, h), rule, *_ in BOXES[bg]:      # a box that no longer moves stays black, even where another box overlaps it
        if rule is None: out[y:y + h, x:x + w] = 0
    os.makedirs(os.path.join(SEQ, 'art/fx'), exist_ok=True)
    # (white, the mask in the alpha: the canvas masks by alpha, destination-in; a grey 'L' image is opaque everywhere)
    m = Image.new('RGBA', (1280, 720), (255, 255, 255, 0)); m.putalpha(Image.fromarray((out * 255).round().astype(np.uint8), 'L'))
    m.save(os.path.join(SEQ, 'art/fx', bg + '_sway.png'), optimize=True)
    # the check: the mask in magenta over the painting, each box outlined (green: moves, red: stopped)
    tint = np.asarray(im).astype(np.float32)
    tint = tint * (1 - 0.6 * out[..., None]) + np.array([255, 0, 255]) * 0.6 * out[..., None]
    chk = Image.fromarray(tint.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(chk)
    for (x, y, w, h), rule, *_ in BOXES[bg]: d.rectangle([x, y, x + w, y + h], outline=(255, 40, 40) if rule is None else (40, 255, 40))
    os.makedirs(os.path.join(SEQ, 'art/review/sway'), exist_ok=True)
    chk.save(os.path.join(SEQ, 'art/review/sway', bg + '.jpg'), quality=85)
    print(bg, 'moving px %d' % (out > 0.05).sum())


if __name__ == '__main__':
    for bg in (sys.argv[1:] or BOXES): make(bg)
    print("window.SWAY_MASKS = %s" % sorted(BOXES))
