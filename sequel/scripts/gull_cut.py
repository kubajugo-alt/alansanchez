#!/usr/bin/env python3
"""Isleta's two gulls painted in mid-air, cut out so they can glide (docs/review/env_movement.md, Isleta; HANDOFF 145).

  python3 sequel/scripts/gull_cut.py

On the 1280x720 painting at 2x: in each box the gull is what is clearly lighter than the grey sky round it (the
sky's median plus a margin), closed and grown a pixel, cut to art/fx/isleta_gull_<n>.png; the sky behind it filled in
(OpenCV Telea) to art/fx/isleta_gull_<n>_plate.png. js/story/wed.js draws each plate over its painted gull, then the
gull drifting slowly about where it was painted, tilting with the air. The painting is untouched. Check:
art/review/gulls/check.jpg.
"""
import os
import numpy as np, cv2
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOXES = [(288, 92, 56, 52), (570, 114, 64, 42)]     # room px: round each painted gull
K = 2
full = Image.open(os.path.join(SEQ, 'art/bg/isleta.jpg')).convert('RGB').resize((1280 * K, 720 * K), Image.LANCZOS)
rows = []
os.makedirs(os.path.join(SEQ, 'art/fx'), exist_ok=True); os.makedirs(os.path.join(SEQ, 'art/review/gulls'), exist_ok=True)
for n, (x, y, w, h) in enumerate(BOXES):
    p = np.asarray(full.crop((x * K, y * K, (x + w) * K, (y + h) * K)))
    g = cv2.cvtColor(p, cv2.COLOR_RGB2GRAY).astype(np.float32)
    bg = cv2.medianBlur(g.astype(np.uint8), 31).astype(np.float32)
    dark = g < bg - 38          # the dark wing tips
    light = g > bg + 22
    m = (light | dark).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    nlab, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    if nlab > 1:
        big = 1 + int(np.argmax(st[1:, 4]))
        for k in range(1, nlab):
            if k == big or st[k, 4] > 0.15 * st[big, 4]: keep[lab == k] = 255
    # (the grey of a wing is close to the sky's: fill every hole inside the outline, so the whole bird is cut)
    ff = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)); fl = ff.copy()
    cv2.floodFill(fl, np.zeros((fl.shape[0] + 2, fl.shape[1] + 2), np.uint8), (0, 0), 255)
    keep = ff | cv2.bitwise_not(fl)
    m = cv2.dilate(keep, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(m, (3, 3), 0)
    Image.fromarray(np.dstack([p, alpha]), 'RGBA').save(os.path.join(SEQ, f'art/fx/isleta_gull_{n}.png'), optimize=True)
    plate = cv2.inpaint(p, cv2.dilate(m, np.ones((7, 7), np.uint8)), 9, cv2.INPAINT_TELEA)
    plate = np.where(cv2.dilate(m, np.ones((9, 9), np.uint8))[..., None] > 0, cv2.GaussianBlur(plate, (9, 9), 0), p)
    Image.fromarray(plate.astype(np.uint8)).save(os.path.join(SEQ, f'art/fx/isleta_gull_{n}_plate.png'), optimize=True)
    rows.append(np.concatenate([p, np.dstack([alpha] * 3), plate.astype(np.uint8)], 1))
    print('gull', n, (x, y, w, h), 'px', int((m > 0).sum()))
W = max(r.shape[1] for r in rows)
chk = np.concatenate([np.pad(r, ((0, 4), (0, W - r.shape[1]), (0, 0))) for r in rows], 0)
Image.fromarray(chk).resize((chk.shape[1] * 2, chk.shape[0] * 2), Image.NEAREST).save(os.path.join(SEQ, 'art/review/gulls/check.jpg'), quality=90)
