# The other step of a side walk, roughed out straight from one painting (no rig): for a character whose painted
# strides all have the NEAR leg in front (each step on the same leg reads as a skip). The near leg is swung back about
# the hip and drawn on top, the far leg becomes the old near leg darkened, the near arm swings forward over the body
# and the old forward (far) hand is taken away. Gemini then repaints the rough into a clean painting.
# Outlines are hand-drawn per painting (sprite px) in CUTS below.
#   python3 scripts/walk_swap_cut.py vasco_walk1 out.png [leg_deg arm_deg]
import os, sys, numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUTS = {
    'vasco_walk1': {
        'hip': (175, 345), 'shoulder': (125, 190), 'hem': 300,
        'near_leg': [(128, 330), (228, 296), (238, 420), (262, 520), (300, 630), (327, 690), (327, 716), (238, 716), (222, 612), (190, 530), (150, 445), (122, 400)],
        'far_leg': [(100, 380), (150, 420), (150, 450), (110, 540), (75, 620), (60, 716), (0, 716), (0, 640), (30, 600), (70, 520), (95, 440)],
        'near_arm': [(96, 172), (120, 178), (112, 280), (98, 330), (94, 418), (40, 418), (46, 350), (60, 280), (80, 200)],
        'far_hand': [(222, 250), (262, 258), (318, 322), (318, 384), (262, 388), (232, 324)],
    },
}


def poly(pts, size):
    m = Image.new('L', size, 0); ImageDraw.Draw(m).polygon(pts, fill=255); return np.asarray(m) > 0


def layer(a, m): return Image.fromarray(np.where(m[..., None], a, 0).astype(np.uint8), 'RGBA')


def shade(im, f):
    a = np.asarray(im).astype(np.float32); a[..., :3] *= f; return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def main():
    name, out = sys.argv[1], sys.argv[2]
    leg_a = float(sys.argv[3]) if len(sys.argv) > 3 else 39; arm_a = float(sys.argv[4]) if len(sys.argv) > 4 else -45
    c = CUTS[name]; im = Image.open(os.path.join(ROOT, f'art/sprites/{name}.webp')).convert('RGBA'); a = np.asarray(im)
    W, H = im.size; solid = a[..., 3] > 8
    near_leg = poly(c['near_leg'], (W, H)) & solid
    near_arm = poly(c['near_arm'], (W, H)) & solid
    # the body without the legs, the forward (far) hand and the near forearm below the jacket (the upper sleeve, against
    # his back, reads as the jacket and stays)
    low = np.arange(H)[:, None] > c['hem']
    gone = poly(c['far_leg'], (W, H)) | poly(c['far_hand'], (W, H)) | near_leg | (near_arm & low)
    body = a.copy(); body[..., 3] = np.where(gone, 0, a[..., 3])
    body = Image.fromarray(body, 'RGBA')
    leg, arm = layer(a, near_leg), layer(a, near_arm)
    rough = Image.new('RGBA', (W, H))
    rough.alpha_composite(shade(arm.rotate(10, resample=Image.BICUBIC, center=c['shoulder']), 0.72))  # far arm: a little less far back, behind
    rough.alpha_composite(shade(leg, 0.78))                                                                     # far leg, forward, behind
    rough.alpha_composite(leg.rotate(-leg_a, resample=Image.BICUBIC, center=c['hip']))                         # near leg, back, on top
    rough.alpha_composite(body)
    rough.alpha_composite(arm.rotate(-arm_a, resample=Image.BICUBIC, center=c['shoulder']))                    # near arm, forward, on top
    rough.save(out); print('saved', out)


if __name__ == '__main__':
    main()
