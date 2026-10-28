#!/usr/bin/env python3
"""Paint the game's map of Las Palmas from real geography (the user: "Please use an accurate map of Las Palmas").

  python3 sequel/scripts/map_from_osm.py <stitched OSM render.png> <out.jpg>

The input is a north-up render of OpenStreetMap's standard tiles over 28.092-28.186 N, 15.392-15.462 W (zoom 15),
stitched once by hand. Nothing of the render is copied as it looks: only what each pixel is (sea, street, building,
park, port) is kept, then painted in the game's palette on paper, with no labels. The map is turned a quarter to the
left (north points left, as the compass shows), so the long city fits the wide screen. Map data © OpenStreetMap
contributors (ODbL): the credits say so.
"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert('RGB')).astype(np.int32)
H, W, _ = rgb.shape
def near(c, tol):
    return (np.abs(rgb - np.array(c)).sum(axis=2) <= tol)
def near_any(cs, tol):
    m = np.zeros((H, W), bool)
    for c in cs: m |= near(c, tol)
    return m

sea = near((170, 211, 223), 20)
sea = ndimage.binary_closing(sea, iterations=2)
# labels and buoys printed on the water leave holes: fill every hole smaller than a small harbour basin
lab, n = ndimage.label(~sea)
sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
for i, s in enumerate(sizes, 1):
    if s < 900: sea[lab == i] = True
land = ~sea
roads_major = near_any([(249, 178, 156), (232, 146, 162), (252, 214, 164), (247, 250, 191)], 24) & land
roads = (near((255, 255, 255), 6) & land) | roads_major
roads = ndimage.binary_opening(roads, iterations=1) | roads_major
buildings = near_any([(217, 208, 201), (195, 181, 170), (188, 174, 162), (193, 178, 166), (212, 212, 211)], 14) & land
parks = near_any([(174, 223, 163), (205, 235, 177), (200, 250, 204), (136, 224, 190), (173, 209, 158)], 22) & land
port = near_any([(235, 219, 232), (221, 221, 232)], 14) & land
sand = near_any([(255, 241, 186), (247, 236, 183), (245, 233, 198)], 22) & land

rng = np.random.default_rng(7)
def tone(c, amt=10):
    return np.clip(np.array(c, float) + rng.normal(0, amt, (H, W, 1)), 0, 255)
# the sea: turquoise over the shallows, deep Atlantic blue away from the shore
d = ndimage.distance_transform_edt(sea)
k = np.clip(d / 260.0, 0, 1)[..., None]
shallow, deep = np.array([92, 160, 170.0]), np.array([28, 62, 104.0])
canvas = shallow * (1 - k) + deep * k
canvas += rng.normal(0, 5, (H, W, 1))
canvas = np.where(land[..., None], tone((222, 202, 160), 6), canvas)
canvas = np.where(port[..., None], tone((176, 166, 158), 5), canvas)
canvas = np.where(parks[..., None], tone((128, 150, 92), 7), canvas)
canvas = np.where(sand[..., None], tone((236, 206, 140), 5), canvas)
canvas = np.where(buildings[..., None], tone((186, 132, 92), 12), canvas)
canvas = np.where(roads[..., None], tone((243, 232, 205), 4), canvas)
canvas = np.where(roads_major[..., None], tone((176, 92, 62), 6), canvas)
# the coast: a foam line on the water, an ink line on the land
edge_land = land & ndimage.binary_dilation(sea, iterations=2)
foam = sea & ndimage.binary_dilation(land, iterations=4) & ~ndimage.binary_dilation(land, iterations=1)
canvas = np.where(foam[..., None], canvas * 0.4 + 255 * 0.6, canvas)
canvas = np.where(edge_land[..., None], np.array([70, 52, 38.0]), canvas)
img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8), 'RGB').filter(ImageFilter.GaussianBlur(0.7))

# a quarter turn left: north points left; then fit the wide screen
img = img.rotate(90, expand=True)
s = 1280 / img.width
img = img.resize((1280, round(img.height * s)), Image.LANCZOS)
top = (img.height - 720) // 2 - 20
img = img.crop((0, top, 1280, top + 720))

# paper: grain, a darker rim, fold lines
a = np.asarray(img).astype(float)
grain = ndimage.gaussian_filter(rng.normal(0, 1, (720, 1280)), 1.2)[..., None] * 9
yy, xx = np.mgrid[0:720, 0:1280]
rim = (np.hypot((xx - 640) / 700, (yy - 360) / 420) ** 3)[..., None]
a = a + grain
a = a * (1 - 0.35 * np.clip(rim, 0, 1)) + np.array([60, 40, 20.0]) * 0.35 * np.clip(rim, 0, 1)
for x in (427, 853):
    a[:, x - 1:x + 2] *= 0.9
a[359:362, :] *= 0.9
img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')

# a compass rose in the open sea, bottom right: north points left
g = ImageDraw.Draw(img, 'RGBA')
cx, cy, R = 150, 615, 58
ink, gold = (60, 40, 25, 230), (205, 160, 70, 235)
g.ellipse((cx - R, cy - R, cx + R, cy + R), outline=ink, width=2)
g.ellipse((cx - R + 8, cy - R + 8, cx + R - 8, cy + R - 8), outline=(60, 40, 25, 140), width=1)
for ang, L, wdt in [(180, R + 6, 13), (0, R - 6, 10), (90, R - 6, 10), (270, R - 6, 10)]:
    t = np.radians(ang); ux, uy = np.cos(t), np.sin(t); px, py = -uy, ux
    tip = (cx + ux * L, cy + uy * L)
    g.polygon([tip, (cx + px * wdt, cy + py * wdt), (cx - px * wdt, cy - py * wdt)], fill=gold if ang == 180 else (235, 220, 190, 230), outline=ink)
# the N, drawn as strokes beside the north point
nx, ny = cx - R - 22, cy
g.line([(nx - 5, ny + 7), (nx - 5, ny - 7), (nx + 5, ny + 7), (nx + 5, ny - 7)], fill=ink, width=2)
img.save(out, quality=92)
print(out, img.size)
