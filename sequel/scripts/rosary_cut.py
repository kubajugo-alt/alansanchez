#!/usr/bin/env python3
"""The Land Rover's rosary as a swinging cut-out (docs/review/env_movement.md, the Land Rover; HANDOFF entry 143).

  python3 sequel/scripts/rosary_cut.py

The rosary hangs off the mirror in front of the windscreen; the room used to row-shear a 62x166 box of the painting,
so the wall and the road behind it warped like jelly. Here, on the 1280x720 painting (the room's coordinates) at 2x:
the beads and the cross picked by colour (warm brown, darker than the road), closed and grown a pixel, cut out as
art/fx/landrover_rosary.png; the windscreen behind them filled in (OpenCV Telea inpainting, then softened) as
art/fx/landrover_rosary_plate.png, which covers the painted rosary. js/story/sun.js draws the plate, then the cut-out
turned a little about where it hangs off the mirror. The painting itself is untouched. Also art/review/rosary/check.jpg.
"""
import os
import numpy as np, cv2
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
X, Y, W, H = 660, 146, 78, 176        # the box round the rosary (room px)
K = 2                                  # cut at 2x, from the 2560 painting
im = Image.open(os.path.join(SEQ, 'art/bg/landrover.jpg')).convert('RGB')
im = im.resize((1280 * K, 720 * K), Image.LANCZOS).crop((X * K, Y * K, (X + W) * K, (Y + H) * K))
p = np.asarray(im)
hsv = cv2.cvtColor(p, cv2.COLOR_RGB2HSV).astype(np.int32)      # h 0..180
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
warm = ((h <= 22) | (h >= 165)) & (s >= 105) & (v >= 12) & (v <= 80)
# only inside the rosary's outline, drawn by hand on the 2x cut (the road and the wall's shadow are warm and dark too)
ENV = np.array([(45, 0), (113, 0), (113, 165), (100, 172), (100, 260), (110, 270), (110, 335), (57, 335), (57, 260),
                (22, 235), (25, 185), (47, 165)], np.int32)
inside = np.zeros(warm.shape, np.uint8); cv2.fillPoly(inside, [ENV], 1)
m = (warm & (inside > 0)).astype(np.uint8) * 255
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
# keep the pieces joined to the strand (the biggest few), drop specks of warm road or wall
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
keep = np.zeros_like(m)
for k in range(1, n):
    if st[k, 4] >= 120: keep[lab == k] = 255
m = cv2.dilate(keep, np.ones((3, 3), np.uint8))
alpha = cv2.GaussianBlur(m, (3, 3), 0)
cut = np.dstack([p, alpha])
plate = cv2.inpaint(p, cv2.dilate(m, np.ones((5, 5), np.uint8)), 7, cv2.INPAINT_TELEA)
os.makedirs(os.path.join(SEQ, 'art/fx'), exist_ok=True)
Image.fromarray(cut, 'RGBA').save(os.path.join(SEQ, 'art/fx/landrover_rosary.png'), optimize=True)
Image.fromarray(plate).save(os.path.join(SEQ, 'art/fx/landrover_rosary_plate.png'), optimize=True)
os.makedirs(os.path.join(SEQ, 'art/review/rosary'), exist_ok=True)
chk = np.concatenate([p, np.dstack([alpha] * 3), plate], 1)
Image.fromarray(chk).resize((chk.shape[1] * 2, chk.shape[0] * 2), Image.NEAREST).save(os.path.join(SEQ, 'art/review/rosary/check.jpg'), quality=90)
print('box', (X, Y, W, H), 'px', int((m > 0).sum()))
