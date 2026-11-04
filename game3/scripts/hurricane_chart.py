#!/usr/bin/env python3
"""Mireya's hurricane tracking chart (PLACEHOLDER art), drawn from real geography.

  python3 game3/scripts/hurricane_chart.py <stitched OSM render.png> <out.png>

The input is OpenStreetMap's standard tiles at zoom 6, x 16-22, y 26-30, stitched (1792x1280), Web Mercator.
Only land and sea are kept (labels, boundaries and icons take the class of their nearest neighbour); the result is
drawn as a 1996 newspaper tracking chart: newsprint paper, grey land, black coast, a 5-degree grid with its
degrees printed at the edges, a dot for Santo Domingo. The day's pins belong to the engine, which can place them
with lonlat_to_px() below. Map data (c) OpenStreetMap contributors (ODbL): the credits must say so.
"""
import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage

Z, X0, Y0 = 6, 16, 26                      # zoom and the top-left tile of the stitched render
LON_W, LON_E, LAT_S, LAT_N = -86.0, -56.0, 9.5, 31.0
OUT_W = 1600

def merc(lon, lat):                        # lon/lat -> pixel in the stitched render
    n = 2 ** Z * 256
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x - X0 * 256, y - Y0 * 256

src, out = sys.argv[1], sys.argv[2]
x0, y0 = merc(LON_W, LAT_N); x1, y1 = merc(LON_E, LAT_S)
rgb = np.asarray(Image.open(src).convert('RGB').crop((round(x0), round(y0), round(x1), round(y1)))).astype(int)
H, W, _ = rgb.shape
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
sea = (np.abs(rgb - np.array([170, 211, 223])).sum(axis=2) <= 24)
dark = rgb.sum(axis=2) < 520
purple = (b > g + 8) & (r > g - 30) & ~sea              # maritime boundaries and water labels
unknown = ndimage.binary_dilation(dark | purple, iterations=2)
known_sea = sea & ~unknown
known_land = ~sea & ~unknown
cls = np.where(known_sea, 1, np.where(known_land, 0, -1))
_, (iy, ix) = ndimage.distance_transform_edt(cls < 0, return_indices=True)
sea = cls[iy, ix] == 1
# specks of "land" left in open water by label halos
lab, n = ndimage.label(~sea)
sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
for i, s in enumerate(sizes, 1):
    if s < 6: sea[lab == i] = True
land = ~sea

scale = OUT_W / W
OUT_H = round(H * scale)
up = lambda m: np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((OUT_W, OUT_H), Image.BILINEAR)) > 127
land = up(land)
rng = np.random.default_rng(3)
paper = np.array([236, 230, 214.0])
canvas = np.ones((OUT_H, OUT_W, 3)) * paper + rng.normal(0, 3, (OUT_H, OUT_W, 1))
# land: newsprint halftone grey
yy, xx = np.mgrid[0:OUT_H, 0:OUT_W]
dots = ((xx % 4 < 2) & (yy % 4 < 2))
canvas[land] = np.array([196, 190, 178.0])
canvas[land & dots] = np.array([168, 162, 150.0])
coast = land & ~ndimage.binary_erosion(land, iterations=2)
canvas[coast] = np.array([40, 36, 32.0])
img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.4))

d = ImageDraw.Draw(img)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
def lonlat_to_px(lon, lat):
    px, py = merc(lon, lat)
    return (px - x0) * scale, (py - y0) * scale
ink = (40, 36, 32)
for lon in range(-85, -55, 5):
    x, _ = lonlat_to_px(lon, LAT_S)
    d.line([(x, 0), (x, OUT_H)], fill=(90, 84, 76), width=1)
    d.text((x + 4, OUT_H - 26), f'{-lon}°O', fill=ink, font=small)
for lat in range(10, 31, 5):
    _, y = lonlat_to_px(LON_W, lat)
    d.line([(0, y), (OUT_W, y)], fill=(90, 84, 76), width=1)
    d.text((6, y + 4), f'{lat}°N', fill=ink, font=small)
sx, sy = lonlat_to_px(-69.88, 18.47)       # Santo Domingo
d.ellipse((sx - 6, sy - 6, sx + 6, sy + 6), fill=ink)
d.text((sx - 40, sy + 30), 'SANTO DOMINGO', fill=ink, font=small)
# title box, top right, generic (no real paper's masthead)
bx, by = OUT_W - 520, 18
d.rectangle((bx, by, bx + 500, by + 70), fill=(236, 230, 214), outline=ink, width=2)
d.text((bx + 16, by + 10), 'TRAYECTORIA DEL HURACÁN', fill=ink, font=font)
d.text((bx + 16, by + 40), 'Temporada 1996 · Marque la posición diaria', fill=ink, font=small)
d.rectangle((1, 1, OUT_W - 2, OUT_H - 2), outline=ink, width=3)
img.save(out)
print(out, img.size)
