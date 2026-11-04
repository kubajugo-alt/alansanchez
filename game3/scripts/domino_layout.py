#!/usr/bin/env python3
"""TH6 dominoes: the fixed endgame position (PLACEHOLDER art), drawn in code so the position is exact.

  python3 game3/scripts/domino_layout.py <out.png> <out.json>

Dominican doubles, double-six set, all 28 tiles dealt. Alan (south) partners Fello (north) against Nando (east)
and Don Cuco (west; a placeholder name). Play goes south -> east -> north -> west. On the table: twelve tiles,
open ends 3 and 5. Fello holds one tile, 3|5: a capicua, it fits both ends. Nando, who plays between Alan and
Fello, passed earlier on 3 and 5, so the player can know he will pass again. Alan holds 5|5, 5|6, 2|3:
  5|5 keeps the ends 3 and 5 -> Nando passes -> Fello plays the capicua and wins (the right answer);
  5|6 makes the ends 3/6 and 2|3 makes them 2/5 -> Fello can still go out, but not with a capicua.
The script checks the position (every tile once, Nando holding no 3 or 5) and writes it as JSON for the engine.
"""
import sys, json, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

out_png, out_json = sys.argv[1], sys.argv[2]
ALL = [(a, b) for a in range(7) for b in range(a, 7)]
norm = lambda t: tuple(sorted(t))
line = [(3, 1), (1, 1), (1, 5), (5, 4), (4, 4), (4, 6), (6, 6), (6, 2), (2, 2), (2, 0), (0, 0), (0, 5)]
alan = [(5, 5), (5, 6), (2, 3)]
fello = [(3, 5)]
used = [norm(t) for t in line + alan + fello]
rest = [t for t in ALL if t not in used]
nando = [t for t in rest if 3 not in t and 5 not in t]
cuco = [t for t in rest if t not in nando]
# balance the two hands at six each, keeping every 3 and 5 out of Nando's
while len(nando) > 6: cuco.append(nando.pop())
while len(cuco) > 6:
    t = next(t for t in cuco if 3 not in t and 5 not in t); cuco.remove(t); nando.append(t)
assert len(set(used + nando + cuco)) == 28 and len(nando) == 6 and len(cuco) == 6
assert all(3 not in t and 5 not in t for t in nando)
for a, b in zip(line, line[1:]): assert a[1] == b[0]
ends = (line[0][0], line[-1][1]); assert ends == (3, 5)

W, H = 1680, 944
rng = np.random.default_rng(5)
# the table: old painted wood, top-down
yy, xx = np.mgrid[0:H, 0:W]
grain = np.sin(yy / 7.0 + np.sin(xx / 90.0) * 3) * 6 + rng.normal(0, 4, (H, W))
base = np.array([112, 74, 44.0])
tab = base + grain[..., None] * np.array([1, 0.8, 0.6])
img = Image.fromarray(np.clip(tab, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
d = ImageDraw.Draw(img, 'RGBA')
L, S = 96, 48                                  # tile long and short side
PIPS = {0: [], 1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
        5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}
def half(cx, cy, n, vertical):
    for px, py in PIPS[n]:
        if vertical: px, py = py, px
        x, y = cx + px * 12, cy + py * 12
        d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(20, 18, 16))
def tile(cx, cy, a, b, vertical=False, face=True):
    w, h = (S, L) if vertical else (L, S)
    d.rounded_rectangle((cx - w / 2 + 4, cy - h / 2 + 5, cx + w / 2 + 4, cy + h / 2 + 5), 7, fill=(0, 0, 0, 90))
    d.rounded_rectangle((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), 7, fill=(238, 232, 214) if face else (30, 30, 34), outline=(90, 84, 70))
    if not face: return
    if vertical:
        d.line((cx - w / 2 + 6, cy, cx + w / 2 - 6, cy), fill=(90, 84, 70), width=2); half(cx, cy - L / 4, a, True); half(cx, cy + L / 4, b, True)
    else:
        d.line((cx, cy - h / 2 + 6, cx, cy + h / 2 - 6), fill=(90, 84, 70), width=2); half(cx - L / 4, cy, a, False); half(cx + L / 4, cy, b, False)
# the line across the middle; doubles crosswise
gap = 4
widths = [S if a == b else L for a, b in line]
x = (W - sum(widths) - gap * (len(line) - 1)) / 2
cy = H / 2 - 10
for (a, b), w in zip(line, widths):
    tile(x + w / 2, cy, a, b, vertical=(a == b)); x += w + gap
# Alan's hand, face up, south
for i, (a, b) in enumerate(alan):
    tile(W / 2 + (i - 1) * (S + 30), H - 90, a, b, vertical=True)
# Fello north (one tile), Nando east, Don Cuco west: face down
tile(W / 2, 80, 0, 0, vertical=True, face=False)
for i in range(6):
    tile(W - 70, 190 + i * (S + 12), 0, 0, vertical=False, face=False)
    tile(70, 190 + i * (S + 12), 0, 0, vertical=False, face=False)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
d.text((16, H - 34), 'PLACEHOLDER: TH6 domino endgame, drawn in code', fill=(255, 240, 200, 160), font=f)
img.save(out_png)
json.dump({'line': line, 'ends': ends, 'hands': {'alan': alan, 'fello': fello, 'nando': sorted(nando), 'cuco': sorted(cuco)},
           'order': ['alan', 'nando', 'fello', 'cuco'], 'known_passes': {'nando': [3, 5]},
           'answer': [5, 5], 'capicua': [3, 5]}, open(out_json, 'w'), indent=1)
print(out_png, img.size, 'nando', sorted(nando), 'cuco', sorted(cuco))
