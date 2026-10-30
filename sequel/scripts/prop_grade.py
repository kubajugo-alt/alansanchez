#!/usr/bin/env python3
"""The props, graded into their rooms (the user, 2026-10-30: "run a filter through the props, to make them a little more
blend in with the background"). The tables and the buffet were painted on their own, brighter and cleaner than the room
around them; each is lit part of the way by its room's light (the colour of the brightest tenth of the painting where the props
stand: lamplight on plaster and stone) and a touch dimmer, darker towards the floor, its colour a little quieter, and the edge of the cut-out
softened by a pixel so it sits in the paint instead of on it. (A first try moved its Lab mean towards the room's: the
white cloths came out dirty grey.)

  python3 sequel/scripts/prop_grade.py            grade every prop below from its ungraded original

The ungraded originals are kept in art/designs/props_ungraded/ (first run copies them there); the game's sprites in
art/sprites/ are rewritten from them, so running it again never grades twice.
"""
import os, shutil
import numpy as np, cv2
from PIL import Image, ImageFilter

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEEP = os.path.join(SEQ, 'art/designs/props_ungraded')
# prop sprite: (room painting, rows of it the props stand among, how far towards the room: 0 none, 1 all the way)
PROPS = {
    'x_museum_buffet': ('museum_hall', (380, 716), 0.45),
    'x_museum_cocktail_table': ('museum_hall', (380, 716), 0.45),
    'x_museum_cocktail_table_glasses': ('museum_hall', (380, 716), 0.45),
    'x_restaurant_table': ('hotel_restaurant', (420, 716), 0.45),
}


def grade(key, room, rows, k):
    src = os.path.join(KEEP, key + '.webp')
    if not os.path.exists(src):
        os.makedirs(KEEP, exist_ok=True); shutil.copy(os.path.join(SEQ, 'art/sprites', key + '.webp'), src)
    a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32)
    rgb, al = a[..., :3] / 255, a[..., 3]
    bg = np.asarray(Image.open(os.path.join(SEQ, 'art/bg', room + '.jpg')).convert('RGB')).astype(np.float32)[rows[0]:rows[1]] / 255
    # the room's light: the colour of its brightest tenth (lamplight on cloth, plaster, stone), as a filter
    lum = bg.mean(2); light = bg[lum >= np.percentile(lum, 90)].mean(0); light = light / light.max()
    lit = rgb * (1 - k + k * light) * (1 - 0.18 * k)             # in its light, and a touch dimmer
    h = rgb.shape[0]; lit *= np.linspace(1.0, 1 - 0.3 * k, h)[:, None, None]   # the light falls from above: darker to the floor
    grey = lit.mean(2, keepdims=True); lit = grey + (lit - grey) * (1 - 0.2 * k)   # a little quieter
    out = (np.clip(lit, 0, 1) * 255).astype(np.uint8)
    alpha = Image.fromarray(al.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    res = Image.fromarray(np.dstack([out, np.minimum(al.astype(np.uint8), np.asarray(alpha))]), 'RGBA')
    res.save(os.path.join(SEQ, 'art/sprites', key + '.webp'), quality=90, alpha_quality=100)
    return light


if __name__ == '__main__':
    for key, (room, rows, k) in PROPS.items():
        light = grade(key, room, rows, k)
        print(key, room, 'light', light.round(2))
