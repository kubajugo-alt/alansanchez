#!/bin/bash
# partial.sh <sprite key> <top fraction> "<what the upper body shows>": for frames both Canva and Gemini refuse whole,
# restyle only the top part (head, chest, arms) and feather it into the original above the cut
cd /home/user/alansanchez
D=art/review/alan/restyle_gemini; mkdir -p $D/parts
python3 -c "
from PIL import Image
im=Image.open('art/sprites/$1.webp').convert('RGBA');W,H=im.size
im.crop((0,0,W,int(H*$2))).save('$D/parts/$1_top_src.webp')"
P="Style alignment only. Repaint the first image, $3 of a smiling man in a game sprite, in the rougher hand-painted style of the second image of the same man: bold dark ink contour lines, visible brush texture in skin and hair, flatter warmer cel-like shading, less gloss, more defined stubble, face and hair as in the second image. Keep the pose, framing, crop, size, expression and hands exactly as they are. Plain flat green background."
timeout 300 python3 scripts/gen_image.py --ref $D/parts/$1_top_src.webp --ref art/sprites/alan_side.webp --prompt "$P" --out $D/parts/$1_top.png 2>&1 | tail -1
python3 - "$1" "$2" <<'P'
import sys, numpy as np, cv2
from PIL import Image
k, fr = sys.argv[1], float(sys.argv[2]); D = 'art/review/alan/restyle_gemini'
o = np.asarray(Image.open(f'art/sprites/{k}.webp').convert('RGBA')); H, W = o.shape[:2]
t = np.asarray(Image.open(f'{D}/parts/{k}_top.png').convert('RGBA')); ch = int(H * fr)
if t.shape[:2] != (ch, W): t = cv2.resize(t, (W, ch), interpolation=cv2.INTER_AREA)
oa = o[:ch, :, 3] > 128; lim = int(ch * 0.8); best = (-1,)
for sc in np.arange(0.85, 1.16, 0.01):
    M = cv2.getRotationMatrix2D((W / 2, ch / 2), 0, sc)
    ga = cv2.warpAffine((t[..., 3] > 128).astype(np.uint8), M, (W, ch), flags=cv2.INTER_NEAREST) > 0
    for dx in range(-40, 41, 2):
        for dy in range(-30, 31, 2):
            sh = np.roll(np.roll(ga, dy, 0), dx, 1)[:lim]; oo = oa[:lim]
            iou = (sh & oo).sum() / max(1, (sh | oo).sum())
            if iou > best[0]: best = (iou, sc, dx, dy)
iou, sc, dx, dy = best; print(f'{k} top: iou {iou:.3f} scale {sc:.2f} shift {dx},{dy}')
M = cv2.getRotationMatrix2D((W / 2, ch / 2), 0, sc); M[0, 2] += dx; M[1, 2] += dy
fit = cv2.warpAffine(t, M, (W, H), flags=cv2.INTER_LANCZOS4, borderValue=(0, 0, 0, 0)).astype(np.float32)
a, b = int(H * (fr - 0.08)), int(H * (fr - 0.01))
w = np.clip((b - np.arange(H)) / (b - a), 0, 1)[:, None, None]
out = o.astype(np.float32) * (1 - w) + fit * w
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA').save(f'{D}/{k}.png')
bg = (40, 44, 52, 255); A = Image.alpha_composite(Image.new('RGBA', (W, H), bg), Image.fromarray(o)); B = Image.alpha_composite(Image.new('RGBA', (W, H), bg), Image.open(f'{D}/{k}.png'))
c = Image.new('RGB', (W * 2, H)); c.paste(A.convert('RGB')); c.paste(B.convert('RGB'), (W, 0)); c.save(f'{D}/{k}_sbs.png')
P
