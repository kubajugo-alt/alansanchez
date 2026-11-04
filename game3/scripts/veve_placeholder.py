#!/usr/bin/env python3
"""S6 / finale phase 1: a PLACEHOLDER boat sign in parts, drawn in code. It is NOT Agwe's vèvè.

  python3 game3/scripts/veve_placeholder.py <out dir>

The bible (S6) builds the sign from parts: hull, mast, sail, flag, three wave lines, crosses, stars. This draws a
plain boat sign with exactly those parts, each as its own transparent PNG (so the memory puzzle and the chest
drawing can place them one by one), plus the whole sign. The real vèvè art is for the Dominican and Haitian
consultant read the bible requires (production: "Consultant read"); until then nothing here should be taken as
the real sign, and every file says PLACEHOLDER.
"""
import sys, os, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

out = sys.argv[1]; os.makedirs(out, exist_ok=True)
N = 1024
INK = (246, 240, 226, 255)
def layer():
    im = Image.new('RGBA', (N, N), (0, 0, 0, 0)); return im, ImageDraw.Draw(im)
def soft(im):                                  # chalk-like: slightly blurred stroke edges
    return im.filter(ImageFilter.GaussianBlur(1.2))
W = 14
parts = {}
im, d = layer()                                 # hull: a crescent boat with a keel line
d.arc((222, 380, 802, 700), 20, 160, fill=INK, width=W)
d.line((262, 560, 762, 560), fill=INK, width=W)
parts['hull'] = im
im, d = layer()                                 # mast
d.line((512, 560, 512, 210), fill=INK, width=W)
parts['mast'] = im
im, d = layer()                                 # sail: a triangle with a seam
d.polygon([(530, 230), (530, 530), (720, 530)], outline=INK, width=W)
d.line((530, 380, 625, 455), fill=INK, width=W // 2)
parts['sail'] = im
im, d = layer()                                 # flag at the masthead
d.polygon([(500, 210), (500, 290), (400, 250)], outline=INK, width=W)
parts['flag'] = im
im, d = layer()                                 # three wave lines under the hull
for k in range(3):
    y = 740 + k * 62
    pts = [(200 + t, y + 18 * math.sin(t / 48.0)) for t in range(0, 625, 6)]
    d.line(pts, fill=INK, width=W - 2)
parts['waves'] = im
im, d = layer()                                 # crosses, either side of the mast
for cx, cy in ((330, 330), (694, 170)):
    d.line((cx - 40, cy, cx + 40, cy), fill=INK, width=W); d.line((cx, cy - 40, cx, cy + 40), fill=INK, width=W)
parts['crosses'] = im
im, d = layer()                                 # stars: small five-pointed outlines
for cx, cy in ((250, 200), (800, 300), (840, 520), (190, 520)):
    pts = []
    for i in range(10):
        r = 34 if i % 2 == 0 else 14; a = -math.pi / 2 + i * math.pi / 5
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    d.polygon(pts, outline=INK, width=W // 2 + 2)
parts['stars'] = im

f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
whole = Image.new('RGBA', (N, N), (0, 0, 0, 0))
for name, im in parts.items():
    im = soft(im); im.save(os.path.join(out, f'veve_part_{name}.png')); whole.alpha_composite(im)
whole.save(os.path.join(out, 'veve_whole.png'))
# a preview on a dark floor, labelled
prev = Image.new('RGBA', (N, N), (46, 34, 26, 255)); prev.alpha_composite(whole)
ImageDraw.Draw(prev).text((24, N - 48), 'PLACEHOLDER - not the real vèvè; awaits the consultant read', fill=(255, 200, 120, 255), font=f)
prev.convert('RGB').save(os.path.join(out, 'veve_preview.jpg'), quality=90)
print('parts:', ', '.join(parts))
