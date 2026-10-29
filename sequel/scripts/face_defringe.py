#!/usr/bin/env python3
"""No white specks at the jaw while a face talks (the user, 2026-10-29: "make sure there are no white lines/specks in his
jaw when he speaks").

  python3 sequel/scripts/face_defringe.py [frame ...]    (default: every set in js/faces.js)

A lip-sync mouth replaces its whole box (js/engine/faces.js), so whatever its edge holds is what shows against the room.
Two leftovers of how the mouths were cut, cleaned in every mouth patch of the frame, in place:
  1. pale fringe: along the face's outline (within 2 px of the transparent outside), pixels much lighter than the
     solid face just inside them and grey, or grey and light at a soft edge even when nearly transparent (the old key or a
     light halo, not skin), take the colour of that solid face; their alpha (the outline's soft edge) is kept;
  2. see-through pixels inside the face (more than 2 px from the outside, alpha under 255: teeth and lips laid in
     with a soft alpha) are made solid, so the cleared box never shows through the mouth.
  3. hair-thin strokes outside the painting's own outline (the old lips' or chin's line left behind) are removed.
Eyelid patches are soft overlays by design and are left alone. scripts/face_from_game1.py and scripts/face_jaw.py call
this after writing a set, so a rebuilt set comes out clean.
"""
import json, os, sys
import cv2, numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE, PALER, GREY = 2.0, 22, 55


def clean(a, base=None):
    """RGBA float array (and the painting's own box, RGBA) -> (cleaned, pixels changed)."""
    a = a.copy(); al = a[..., 3]
    n0 = 0
    if base is not None:
        # 3. stray strokes outside the painting's outline (the old lips' or chin's line left behind, a hair-thin tick):
        # where the painting is transparent, keep only what is part of something at least 3 px thick (a lowered chin,
        # the new lips) and its soft edge
        out = (base[..., 3] < 20) & (al > 0)
        core = cv2.morphologyEx((al > 60).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        keep = cv2.dilate(core, np.ones((3, 3), np.uint8)) > 0
        sp = a[..., :3].max(-1) - a[..., :3].min(-1)
        solidish = cv2.dilate((al >= 100).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
        # (and faint grey wisps, or faint pixels touching nothing solid: a grey dot under the chin)
        stray = out & (~keep | ((al < 128) & (sp < 35)) | ((al < 100) & ~solidish))
        a[stray, 3] = 0; al = a[..., 3]; n0 = int(stray.sum())
    outside = (al < 20).astype(np.uint8)
    dist = cv2.distanceTransform(1 - outside, cv2.DIST_L2, 3)
    solid = (al >= 250) & (dist > EDGE)
    # the solid face's colour around each pixel (a 7x7 mean of the solid pixels only)
    k = (7, 7); w = cv2.blur(solid.astype(np.float32), k)
    ref = np.dstack([cv2.blur(a[..., c] * solid, k) for c in range(3)]) / np.maximum(w, 1e-6)[..., None]
    L, Lr = a[..., :3].mean(-1), ref.mean(-1)
    spread = a[..., :3].max(-1) - a[..., :3].min(-1)
    edge = (al > 0) & (al < 250) & (dist <= EDGE) & (w > 0.05)
    # lighter than the face just inside and greyish, or plainly grey and light (a faint white halo, even at low alpha)
    fringe = ((al > 0) & (dist <= EDGE) & (w > 0.05) & (L > Lr + PALER) & (spread < GREY)) | (edge & (spread < 35) & (L > 100))
    if base is not None:   # outside the painting's own outline a pale fringe is nothing of the face: gone, not recoloured
        gone = fringe & (base[..., 3] < 20); a[gone, 3] = 0; fringe &= ~gone
    a[fringe, :3] = ref[fringe]
    holes = (al < 250) & (dist > EDGE)
    a[holes, 3] = 255
    return a, n0 + int(fringe.sum() + holes.sum())


def frame(fr):
    D = json.loads(open(os.path.join(SEQ, 'js/faces.js')).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))[fr]
    x, y, w, h = D['box']; n = 0
    spr = Image.open(os.path.join(SEQ, 'art/sprites', fr + '.webp')).convert('RGBA')
    base = np.zeros((h, w, 4), np.float32); c = np.asarray(spr.crop((x, y, x + w, y + h))).astype(np.float32); base[:c.shape[0], :c.shape[1]] = c
    for m in D['mouths']:
        p = os.path.join(SEQ, 'art/faces', f'{fr}_{m}.webp')
        a, k = clean(np.asarray(Image.open(p).convert('RGBA')).astype(np.float32), base)
        if k: Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA').save(p, lossless=True); n += k
    return n


if __name__ == '__main__':
    frames = sys.argv[1:] or list(json.loads(open(os.path.join(SEQ, 'js/faces.js')).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';')))
    for fr in frames: print(fr, frame(fr), 'px cleaned')
