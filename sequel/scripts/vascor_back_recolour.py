#!/usr/bin/env python3
# Review keyframe for Vasco's repaint (no repainted back view yet): vascos_back_k with its blue shirt recoloured to the
# cream of vascor_front_k (LAB transfer inside a blue-pixel mask, shirt rows only). Run from sequel/. Writes
# art/review/ludo/vascor_walk_back/keyframe_back.webp (review only, not a game sprite).
import cv2, numpy as np
from PIL import Image
b = np.array(Image.open('art/sprites/vascos_back_k.webp').convert('RGBA'))
f = np.array(Image.open('art/sprites/vascor_front_k.webp').convert('RGBA'))
def mask_blue(im, y0, y1):
    r,g,bb,a = [im[...,i].astype(int) for i in range(4)]
    m = (bb >= r - 25) & (a > 100) & ((r+g+bb) > 60)
    yy = np.arange(im.shape[0])[:,None]
    return m & (yy >= y0) & (yy <= y1)
mb = mask_blue(b, 95, 300)
# soften mask edges
mbs = cv2.GaussianBlur(mb.astype(np.float32), (5,5), 0)
# reference cream: front shirt pixels (warm, bright) in the shirt box
fr = f[150:300, 60:200]
fr = fr[(fr[...,3] > 200)]
lab_f = cv2.cvtColor(fr[None,:,:3].astype(np.uint8), cv2.COLOR_RGB2LAB)[0].astype(float)
# keep only cream-ish (bright, low a/b spread) pixels: L high
lab_f = lab_f[lab_f[:,0] > 170]
lab_b = cv2.cvtColor(b[...,:3], cv2.COLOR_RGB2LAB).astype(float)
src = lab_b[mb]
out = lab_b.copy()
for c in range(3):
    s_m, s_s = src[:,c].mean(), src[:,c].std() + 1e-6
    t_m, t_s = lab_f[:,c].mean(), lab_f[:,c].std()
    if c == 0: out[...,c] = (lab_b[...,c] - s_m) / s_s * min(t_s, s_s * 1.1) + t_m - 4
    else: out[...,c] = (lab_b[...,c] - s_m) * 0.25 + t_m
rgb = cv2.cvtColor(np.clip(out,0,255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(float)
res = b.copy().astype(float)
res[...,:3] = rgb * mbs[...,None] + b[...,:3] * (1 - mbs[...,None])
res = res.astype(np.uint8)
Image.fromarray(res).save('art/review/ludo/vascor_walk_back/keyframe_back.webp', lossless=True)
print(mb.sum(), lab_f.mean(0), src.mean(0))
