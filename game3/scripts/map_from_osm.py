#!/usr/bin/env python3
"""Paint Game III's hub map of the Zona Colonial from real geography (forked from Game II's map_from_osm.py).

  python3 game3/scripts/map_from_osm.py <stitched OSM render.png> <out.jpg>

The input is a north-up render of OpenStreetMap's standard tiles at zoom 17, x 40086-40095, y 58687-58693
(about 18.465-18.481 N, 69.876-69.899 W), stitched once (2560x1792). It is cropped to the Zona Colonial, the Ozama
and its east bank, and the shore. Nothing of the render is copied as it looks: only what each pixel is (water,
street, building, park, port, sand) is kept, then painted in the game's palette on paper, with no labels. North is
up. Map data © OpenStreetMap contributors (ODbL): the credits must say so.
"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
# the crop: Parque Independencia (west) to the Ozama's east bank, Calle Restauración to the sea, 16:9
rgb = np.asarray(Image.open(src).convert('RGB').crop((660, 470, 2360, 1426))).astype(np.int32)
H, W, _ = rgb.shape
def near(c, tol):
    return (np.abs(rgb - np.array(c)).sum(axis=2) <= tol)
def near_any(cs, tol):
    m = np.zeros((H, W), bool)
    for c in cs: m |= near(c, tol)
    return m

# what each pixel is. OSM's labels, their white halos, POI icons and boundary dashes are none of these: they are
# marked unknown and take the class of the nearest known pixel, so no text or icon survives.
SEA, LAND, ROAD, MAJOR, BLD, PARK, PORT, SAND = range(8)
cls = np.full((H, W), -1, np.int8)
def put(mask, c):
    cls[mask & (cls < 0)] = c
put(near((170, 211, 223), 14), SEA)
put(near_any([(249, 178, 156), (232, 146, 162), (252, 214, 164), (247, 250, 191)], 20), MAJOR)
put(near_any([(217, 208, 201), (196, 182, 171), (188, 174, 162), (193, 178, 166)], 10), BLD)
put(near_any([(174, 223, 163), (205, 235, 177), (200, 250, 204), (136, 224, 190), (173, 209, 158), (223, 252, 226)], 14), PARK)
put(near_any([(235, 219, 232), (242, 218, 217)], 8), PORT)
put(near_any([(255, 241, 186), (247, 236, 183), (245, 233, 198), (238, 229, 220)], 10), SAND)
put(near_any([(242, 239, 233), (224, 223, 223), (232, 232, 232), (236, 236, 236), (222, 220, 216)], 8), LAND)
white = near((255, 255, 255), 6)
dark = rgb.sum(axis=2) < 560
halo = white & ndimage.binary_dilation(dark, iterations=3)   # the white rim round label letters
put(white & ~halo, ROAD)
cls[ndimage.binary_dilation(dark, iterations=1)] = -1
unknown = cls < 0
_, (iy, ix) = ndimage.distance_transform_edt(unknown, return_indices=True)
cls = cls[iy, ix]
sea = cls == SEA
sea = ndimage.binary_closing(sea, iterations=2)
lab, n = ndimage.label(~sea)
sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
for i, sz in enumerate(sizes, 1):
    if sz < 900: sea[lab == i] = True
# fountains and ponds are not the sea
lab, n = ndimage.label(sea)
sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
for i, sz in enumerate(sizes, 1):
    if sz < 900: sea[lab == i] = False
land = ~sea
roads_major = ndimage.binary_opening((cls == MAJOR) & land, iterations=1)
roads = ndimage.binary_opening((cls == ROAD) & land, iterations=1) | roads_major
buildings = (cls == BLD) & land
parks = ndimage.binary_opening((cls == PARK) & land, iterations=1)
port = (cls == PORT) & land
sand = (cls == SAND) & land

rng = np.random.default_rng(7)
def tone(c, amt=10):
    return np.clip(np.array(c, float) + rng.normal(0, amt, (H, W, 1)), 0, 255)
# the sea: turquoise over the shallows, deep Atlantic blue away from the shore
d = ndimage.distance_transform_edt(sea)
k = np.clip(d / 420.0, 0, 1)[..., None]
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

# fit the wide screen (north up)
img = img.resize((1280, 720), Image.LANCZOS)

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

# a compass rose in the open sea, bottom right: north up
g = ImageDraw.Draw(img, 'RGBA')
cx, cy, R = 1060, 640, 50
ink, gold = (60, 40, 25, 230), (205, 160, 70, 235)
g.ellipse((cx - R, cy - R, cx + R, cy + R), outline=ink, width=2)
g.ellipse((cx - R + 8, cy - R + 8, cx + R - 8, cy + R - 8), outline=(60, 40, 25, 140), width=1)
for ang, L, wdt in [(270, R + 6, 13), (0, R - 6, 10), (90, R - 6, 10), (180, R - 6, 10)]:
    t = np.radians(ang); ux, uy = np.cos(t), np.sin(t); px, py = -uy, ux
    tip = (cx + ux * L, cy + uy * L)
    g.polygon([tip, (cx + px * wdt, cy + py * wdt), (cx - px * wdt, cy - py * wdt)], fill=gold if ang == 270 else (235, 220, 190, 230), outline=ink)
# the N, drawn as strokes above the north point
nx, ny = cx, cy - R - 22
g.line([(nx - 5, ny + 7), (nx - 5, ny - 7), (nx + 5, ny + 7), (nx + 5, ny - 7)], fill=ink, width=2)
img.save(out, quality=92)
print(out, img.size)
