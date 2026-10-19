# The far-leg frames of a side walk, built from one painting by changing which leg is in front (the user, 19 Oct: "the
# leg far away needs to extend forward"). In every painting the NEAR leg is the one drawn over the other; a rotated
# copy of it (walk_swap_cut.py) read as the same leg again, and Gemini put the old order back when it repainted.
# Here the legs keep their painted positions and only the overlap changes: the leg named in TOP (outlined in full,
# hidden part included, in sprite px) comes forward over the other, which goes into shadow behind it.
#   A (from a contact frame): the BACK leg on top, so the far leg is the one reaching forward;
#   B (from a passing frame): the STRAIGHT standing leg on top, so the far leg is the bent swinging one.
#   python3 scripts/walk_leg_swap.py <name> <out.png>
import os, sys, numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUTS = {
    'alan_walkA': {'hip': 335, 'top': [(110, 330), (215, 330), (210, 370), (185, 430), (160, 490), (130, 560), (100, 640), (105, 702), (0, 702), (0, 655), (30, 630), (55, 590), (75, 540), (92, 480), (100, 420), (105, 370)],
                   'hands': [[(50, 320), (112, 320), (112, 398), (50, 398)], [(268, 300), (340, 300), (340, 372), (268, 372)]]},
    'alan_pass': {'hip': 335, 'top': [(35, 330), (110, 330), (105, 420), (100, 500), (98, 580), (100, 640), (130, 672), (132, 715), (40, 715), (40, 650), (42, 580), (40, 500), (35, 420)],
                  'hands': [[(95, 350), (160, 350), (160, 432), (95, 432)]]},
    'ines_walk1': {'hip': 335, 'top': [(110, 330), (200, 330), (195, 380), (170, 440), (140, 510), (110, 580), (85, 640), (80, 709), (0, 709), (0, 660), (25, 640), (45, 600), (65, 540), (85, 470), (100, 400)],
                   'hands': [[(15, 300), (82, 300), (82, 416), (15, 416)], [(230, 315), (320, 315), (320, 432), (230, 432)]]},
    'ines_pass1': {'hip': 335, 'top': [(95, 330), (165, 330), (160, 420), (150, 500), (140, 560), (135, 620), (140, 670), (185, 700), (185, 725), (100, 725), (105, 680), (100, 620), (100, 560), (100, 480), (95, 400)],
                   'hands': [[(38, 300), (88, 300), (88, 412), (38, 412)], [(168, 305), (240, 305), (240, 402), (168, 402)]]},
}


def poly(pts, size):
    m = Image.new('L', size, 0); ImageDraw.Draw(m).polygon(pts, fill=255); return np.asarray(m) > 0


def main(name, out, under_shade=0.7):
    c = CUTS[name]; im = Image.open(os.path.join(ROOT, f'art/sprites/{name}.webp')).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    W, H = im.size; solid = a[..., 3] > 8
    hands = np.zeros((H, W), bool)
    for h in c['hands']: hands |= poly(h, (W, H))
    legs = solid & (np.arange(H)[:, None] > c['hip']) & ~hands
    top = poly(c['top'], (W, H)) & legs
    under = legs & ~top
    o = a.copy()
    # the leg behind: in shadow, a little cooler, as the far limbs are painted
    o[under, :3] = a[under, :3] * under_shade * np.array([0.96, 0.98, 1.04])
    # the overlap edge: a soft dark line where the front leg's outline crosses the one behind
    edge = cv2.morphologyEx(top.astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)) > 0
    edge &= cv2.dilate(under.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    o[edge, :3] *= 0.62
    Image.fromarray(np.clip(o, 0, 255).astype(np.uint8), 'RGBA').save(out); print('saved', out)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
