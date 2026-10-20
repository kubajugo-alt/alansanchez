# Alan's far-leg contact, built from alan_walkA's own paint (no repainting, so nothing can swap the legs back):
#   - walkA's BACK leg is his real far leg (inner side of the jeans, in shadow). It is cut out and swung forward about
#     the hip, behind him; a darkened copy of the near leg underneath fills what the near thigh hid in walkA.
#   - walkA's front (near) leg, from the rig (art/rigs/alan/side/, cut from walkA), is swung back about the hip, on top.
#   - his near arm swings forward over the jacket; the far arm, back, shows behind him.
#   python3 scripts/walk_far_step.py out.png [stride leg_back_deg arm_deg]     (stride 1: the contact; ~0.55: the short
#   steps either side of it, the far leg reaching forward and the far leg taking his weight)
import json, math, sys, numpy as np, cv2
from PIL import Image
R = 'art/rigs/alan/side/'; r = json.load(open(R + 'rig.json')); W, H = r['size']; B = r['bones']


def layer(k):
    c = Image.new('RGBA', (W, H)); p = r['parts'][k]; c.alpha_composite(Image.open(R + k + '.png').convert('RGBA'), (p['x'], p['y'])); return c


def shade(im, f):
    a = np.asarray(im).astype(np.float32); a[..., :3] *= np.asarray(f, np.float32); return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def rot(im, deg, c): return im.rotate(deg, resample=Image.BICUBIC, center=tuple(c))


out_path = sys.argv[1]; stride = float(sys.argv[2]) if len(sys.argv) > 2 else 1
leg_back = (float(sys.argv[3]) if len(sys.argv) > 3 else 39) * stride; arm = (float(sys.argv[4]) if len(sys.argv) > 4 else -45) * stride
walk = np.asarray(Image.open('art/sprites/alan_walkA.webp').convert('RGBA'))
near_leg, torso, near_arm = layer('near_leg'), layer('torso'), layer('near_arm')
hip = B['near_leg']['hip']
# the back leg: walkA's paint below the jacket, not the near leg, not the torso, left of the near leg's line
nl = np.asarray(near_leg)[..., 3] > 0; to = np.asarray(torso)[..., 3] > 0; na = np.asarray(near_arm)[..., 3] > 0
m = (walk[..., 3] > 0) & ~cv2.dilate(nl.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & ~to & ~na
m[:hip[1] - 20] = False
n, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); m = lab == k                     # the leg itself, not stray bits
back = walk.copy(); back[..., 3] = (back[..., 3] * m).astype(np.uint8); back = Image.fromarray(back)
ys, xs = np.nonzero(m); low = ys > ys.max() - 40; bx, by = xs[low].min(), ys.max()   # the back boot's heel
fx, fy = B['near_leg']['ankle']                                                        # where the near ankle was
down = math.atan2(1, 0); fwd = math.atan2(fy - hip[1], fx - hip[0])
ang = math.degrees(math.atan2(by - hip[1], bx - hip[0]) - (down + (fwd - down) * stride))   # forward by `stride` of walkA's
far_fwd = rot(back, ang, hip)
# the far leg's cut top (where the near thigh hid it in walkA): the filler takes the far leg's own tone there, and
# the cut is feathered into it
fa = np.asarray(far_fwd).astype(np.float32); fm = fa[..., 3] > 200
nla = np.asarray(near_leg).astype(np.float32); nm = nla[..., 3] > 200
band = fm & nm; ys = np.nonzero(band)[0]; band &= (np.arange(H)[:, None] < ys.min() + 40)
tone = np.median(fa[band][:, :3], 0) / np.maximum(1, np.median(nla[band][:, :3], 0))
edge = cv2.GaussianBlur(cv2.erode(fm.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32), (0, 0), 4)
fa[..., 3] = np.minimum(fa[..., 3], edge * 255); far_fwd = Image.fromarray(fa.astype(np.uint8))
out = Image.new('RGBA', (W, H))
out.alpha_composite(shade(rot(near_arm, -arm * 0.6, B['near_arm']['shoulder']), 0.7))   # far arm, swung back
out.alpha_composite(shade(near_leg, tone))                                             # filler under the far thigh, in its tone
out.alpha_composite(far_fwd)                                                           # far leg, forward
out.alpha_composite(rot(near_leg, -leg_back, hip))                                     # near leg, back, on top
out.alpha_composite(torso)
out.alpha_composite(rot(near_arm, -arm, B['near_arm']['shoulder']))                    # near arm, forward
out.save(out_path)
print('far leg swung', round(ang, 1), 'deg; back boot was at', bx, by)
