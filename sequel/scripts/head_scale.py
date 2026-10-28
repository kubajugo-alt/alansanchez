#!/usr/bin/env python3
"""A character's head made a little larger in their frames, to bring everyone to the game's proportions (the user,
2026-10-28: Alan and Pino have the slightly large heads of the game's style; Vasco, Baute and Yeray are realistic).

  python3 sequel/scripts/head_scale.py preview OUT.png                       a comparison sheet (nothing changes)

The head grows about the neck: a smooth bulge, full inside the head and fading to nothing across the neck and the
shoulders, so no edge or seam appears and nothing below the neck moves. The face is found by YuNet (scripts/models/).
"""
import json, os, sys
import cv2, numpy as np
from PIL import Image, ImageDraw

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(SEQ, 'scripts/models/')


def face(im):
    a = np.asarray(im.convert('RGBA')).astype(np.float32); al = a[..., 3:] / 255
    rgb = (a[..., :3] * al + np.array([60, 64, 80]) * (1 - al)).astype(np.uint8)
    img = cv2.resize(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    det = cv2.FaceDetectorYN_create(MODELS + 'yunet.onnx', '', (img.shape[1], img.shape[0]), 0.6, 0.3, 50)
    best = None
    for flip in (0, 1):
        x = img[:, ::-1].copy() if flip else img
        _, f = det.detect(x)
        for r in (f if f is not None else []):
            bx = (img.shape[1] - r[0] - r[2]) if flip else r[0]
            if best is None or r[14] > best[4]: best = (bx / 2, r[1] / 2, r[2] / 2, r[3] / 2, r[14])
    return best


def grow(im, box, k, pad=40):
    """The head (from the face box) scaled by k about the neck, inside a padded canvas (pad px added on top)."""
    x, y, w, h = box[:4]
    src = Image.new('RGBA', (im.width, im.height + pad)); src.alpha_composite(im.convert('RGBA'), (0, pad))
    a = np.asarray(src).astype(np.float32)
    H, W = a.shape[:2]
    cx, ny = x + w / 2, y + pad + h * 1.15          # the neck: just under the chin
    R = h * 1.25                                    # the head's reach from the neck
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = xx - cx, yy - ny
    d = np.sqrt(dx ** 2 + (dy * 0.9) ** 2) / R
    above = np.clip((ny + h * 0.25 - yy) / (h * 0.5), 0, 1); above = above * above * (3 - 2 * above)   # fades out across the neck
    inner = np.clip((1.6 - d) / 0.6, 0, 1); inner = inner * inner * (3 - 2 * inner)                    # and beyond the head
    s = 1 + (k - 1) * above * inner                # local scale
    mx, my = cx + dx / s, ny + dy / s
    out = cv2.remap(a, mx, my, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA')


def preview(out):
    who = [('alan', 'alanv_talk_a_00'), ('pino', 'talk_pino_00')]
    test = [('vasco', 'vasco_talk_a_00'), ('baute', 'talk_baute_00'), ('yeray', 'talk_yeray_00')]
    H = 520; cols = []
    def fig(fr, k=1.0):
        im = Image.open(os.path.join(SEQ, 'art/sprites', fr + '.webp')).convert('RGBA')
        b = face(im)
        im = grow(im, b, k) if k != 1.0 else grow(im, b, 1.0)
        s = H / im.height; return im.resize((round(im.width * s), H), Image.LANCZOS)
    for n, fr in who: cols.append((n, fig(fr)))
    for n, fr in test:
        for k in (1.0, 1.08, 1.15): cols.append((f'{n} {round((k - 1) * 100)}%', fig(fr, k)))
    Wt = sum(c.width for _, c in cols) + 10 * len(cols)
    sheet = Image.new('RGB', (Wt, H + 30), (236, 231, 222)); dr = ImageDraw.Draw(sheet); x = 0
    for n, c in cols:
        sheet.paste(c, (x, 0), c); dr.text((x + 6, H + 8), n, fill=(30, 30, 30)); x += c.width + 10
    sheet.save(out); print(out, sheet.size)


if __name__ == '__main__':
    if sys.argv[1:2] == ['preview']: preview(sys.argv[2])
    else: sys.exit(__doc__)
