#!/usr/bin/env python3
"""Vasco dressed for the museum's parties (the user, 2026-10-30: "we need to put vasco in a jacket at these dinners";
"let's do navy suit for vasco"). art/designs/vasco_jacket/{side,front}_B_navy.png are Higgsfield (gpt_image_2_5)
edits of his sprites in a navy blazer and dark trousers, on green. Each is keyed, scaled and placed so the figure
stands exactly where the everyday sprite does (same height from crown to sole, same feet, same anchor), and his own
head is pasted back from the everyday sprite down to the collar, feathered, so his face kit (blinks, lip-sync) fits
it pixel for pixel: art/sprites/vascor_dinner_side_k.webp, vascor_dinner_front_k.webp.

  python3 sequel/scripts/vasco_dinner.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(SEQ, 'art/designs/vasco_jacket')
# everyday sprite -> (the edit, how far down the head is pasted back, as a fraction of the figure's height)
PAIRS = {'vascor_side_k': ('side_B_navy.png', 0.155), 'vascor_front_k': ('front_B_navy.png', 0.155)}


def key_green(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    al = np.where((g > r + 25) & (g > b + 15), 0, 255).astype(np.uint8)
    al = np.asarray(Image.fromarray(al).filter(ImageFilter.MinFilter(3)))
    rgb = a.astype(np.uint8).copy(); sp = (g > np.maximum(r, b)) & (al > 0)
    rgb[..., 1] = np.where(sp, np.maximum(r, b), g).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, al]), 'RGBA')


def main():
    for key, (src, head) in PAIRS.items():
        base = Image.open(os.path.join(SEQ, 'art/sprites', key + '.webp')).convert('RGBA')
        bx0, by0, bx1, by1 = base.getchannel('A').getbbox()
        new = key_green(os.path.join(D, src)); new = new.crop(new.getchannel('A').getbbox())
        s = (by1 - by0) / new.height
        new = new.resize((round(new.width * s), by1 - by0), Image.LANCZOS)
        out = Image.new('RGBA', base.size, (0, 0, 0, 0))
        # centre the new figure on the old one's centre of mass, feet on the same line
        cx = np.nonzero(np.asarray(base.getchannel('A'))[by1 - 40:by1].sum(0))[0].mean()
        nx = np.nonzero(np.asarray(new.getchannel('A'))[-40:].sum(0))[0].mean()
        out.alpha_composite(new, (round(cx - nx), by0))
        # his own head back, down to the collar, feathered over the last part
        cut = by0 + int((by1 - by0) * head); fe = 14
        m = np.zeros((base.height, base.width), np.float32); m[:cut - fe] = 1
        m[cut - fe:cut] = np.linspace(1, 0, fe)[:, None]
        b = np.asarray(base).astype(np.float32); o = np.asarray(out).astype(np.float32)
        ba = b[..., 3:] / 255 * m[..., None]
        rgb = b[..., :3] * ba + o[..., :3] * (o[..., 3:] / 255) * (1 - ba)
        al = ba + (o[..., 3:] / 255) * (1 - ba)
        rgb = np.where(al > 0, rgb / np.maximum(al, 1e-6), 0)
        res = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), al * 255]).astype(np.uint8), 'RGBA')
        name = key.replace('vascor_', 'vascor_dinner_')
        res.save(os.path.join(SEQ, 'art/sprites', name + '.webp'), quality=92, alpha_quality=100)
        print(name, res.size)


if __name__ == '__main__':
    main()
