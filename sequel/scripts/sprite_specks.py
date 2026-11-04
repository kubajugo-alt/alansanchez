#!/usr/bin/env python3
"""Clear stray specks from a run's sprite frames (HANDOFF entry 140).

Ludo sometimes leaves a small detached blob on the floor (alanv_setdown: the thing he put down stays as a brown speck
for frames 22-29, then pops out). For each art/sprites/<run>_NN.webp this finds the opaque islands apart from the
figure: an island of at most MAX_AREA pixels whose nearest pixel is more than GAP px from the figure is made
transparent. The contact shadow under the shoes touches the figure, so it stays. Lossless re-save of changed frames.
  python3 scripts/sprite_specks.py [--dry] <run> ...
"""
import sys, glob, os
import numpy as np, cv2
from PIL import Image
MAX_AREA, GAP = 400, 12
SPR = os.path.join(os.path.dirname(__file__), '..', 'art', 'sprites')
dry = '--dry' in sys.argv
for run in [a for a in sys.argv[1:] if not a.startswith('--')]:
    for f in sorted(glob.glob(os.path.join(SPR, run + '_[0-9][0-9].webp'))):
        im = np.array(Image.open(f).convert('RGBA'))
        a = (im[:, :, 3] > 0).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(a, connectivity=8)
        if n <= 2: continue
        big = st[1:, 4].argmax() + 1
        dist = cv2.distanceTransform((lab != big).astype(np.uint8), cv2.DIST_L2, 3)
        gone = []
        for k in range(1, n):
            if k == big or st[k, 4] > MAX_AREA: continue
            if dist[lab == k].min() > GAP:
                im[lab == k, 3] = 0; gone.append(tuple(int(v) for v in st[k]))
        if gone:
            print(os.path.basename(f), 'cleared (x, y, w, h, px):', gone)
            if not dry: Image.fromarray(im).save(f, 'WEBP', lossless=True, method=6)
