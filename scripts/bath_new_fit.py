# The new bath scene (2026-10-21): Canva paintings on green (art/review/alan/bath_new/*_export.png) keyed, sized to the
# game and saved as sprites with their meta. Every frame is scaled so his head is the size it is in the first frame,
# and the first frame is scaled to Alan's standing height (alan_side, h 720): one head size across the scene, whatever
# the pose. Full-figure frames stand on their lowest pixel; waist-up frames (drawn at the tank's waterline, WASH in
# ch2.js) stand on their bottom row, the cut.
#   python3 scripts/bath_new_fit.py      -> art/review/alan/bath_new/sprites/<id>.webp + sprites.json
import glob, json, os, sys, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from canva_restyle_fit import key_out
from skin_match import skin_mask, lab_median, shift

O = 'art/review/alan/bath_new/'
# id -> (source, waist-up?)
FRAMES = {
    'alan_bn_jacket_shrug': ('c_A_jacket_shrug', False), 'alan_bn_jacket_off': ('b01_jacket_off', False),
    'alan_bn_tee_lift': ('c_B_tee_lift', False), 'alan_bn_tee': ('c_C_tee_over', False), 'alan_bn_belt': ('c_D_belt', False),
    'alan_bn_jeans_half': ('c_E_jeans_half', False), 'alan_bn_jeans_off': ('b03u_jeans_off', False),
    'alan_bn_pants': ('c_F_boxers', False), 'alan_bn_fling': ('b05u_fling', True), 'alan_bn_hair': ('c_G_hair_wet', True),
    'alan_bn_splash': ('b07_splash', True), 'alan_bn_climb': ('b08t_climb_towel', False),
    'alan_bn_towel': ('b09t_drip_towel', False), 'alan_bn_pants_on': ('c_J_towel_step', False),
    'alan_bn_pants_up': ('c_K_boxers_up', False), 'alan_bn_zip': ('c_L_zip', False), 'alan_bn_dressed': ('b10_dressed', False),
    # earlier versions the user asked to change, kept for the board's library
    'alan_bn_tee_v1': ('b02_tee_off', False), 'alan_bn_pants_v1': ('b04u_underwear', False),
    'alan_bn_hair_v1': ('b06_hair_back', True), 'alan_bn_pants_on_v1': ('b11u_pants_in_hand', False),
}
# skin evened out to the other frames' median (the user: "skintone slightly darker than the rest")
SKIN_MATCH = {'alan_bn_splash'}
# the head match fails here (hands over the head; bent double): the scale of a frame Canva drew the same way
FIXED = {'alan_bn_hair': 1.32, 'alan_bn_jeans_half': 1.0}
# standing upright: scaled to the first frame's full height (his height is the surest measure there; the head match
# drifts by up to 8% on a turned or tilted head). The rest (hopping, climbing, waist-up) by the head.
STAND = {'alan_bn_jacket_shrug', 'alan_bn_tee_lift', 'alan_bn_tee', 'alan_bn_belt', 'alan_bn_pants', 'alan_bn_towel', 'alan_bn_zip',
         'alan_bn_dressed', 'alan_bn_tee_v1', 'alan_bn_pants_v1', 'alan_bn_pants_on_v1'}
H_GAME = 720       # sprite px for his full standing height (alan_side)
PAD = 6


def cut(name):
    a = key_out(np.asarray(Image.open(O + name + '_export.png').convert('RGB')))
    a[..., 3][a[..., 3] < 40] = 0
    ys, xs = np.nonzero(a[..., 3] > 128)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def gray(a):
    al = a[..., 3:4] / 255.0
    return (cv2.cvtColor(a[..., :3], cv2.COLOR_RGB2GRAY)[..., None] * al + 255 * (1 - al))[..., 0].astype(np.float32)


def head_scale(ref_head, a):
    """the scale of the first frame's head that best matches this frame (mirrored and tilted too)"""
    g, best = gray(a), (-1, 1.0)
    for flip in (False, True):
        T = ref_head[:, ::-1] if flip else ref_head
        for ang in (-20, -10, 0, 10, 20):
            M = cv2.getRotationMatrix2D((T.shape[1] / 2, T.shape[0] / 2), ang, 1)
            Tr = cv2.warpAffine(T, M, (T.shape[1], T.shape[0]), borderValue=255)
            for s in np.arange(0.5, 2.6, 0.03):
                t = cv2.resize(Tr, None, fx=s, fy=s)
                if t.shape[0] >= g.shape[0] or t.shape[1] >= g.shape[1]: continue
                v = cv2.minMaxLoc(cv2.matchTemplate(g, t, cv2.TM_CCOEFF_NORMED))[1]
                if v > best[0]: best = (v, s)
    return best


def main():
    cuts = {k: cut(src) for k, (src, _) in FRAMES.items()}
    meds = {k: lab_median(a, skin_mask(a)) for k, a in cuts.items() if not k.endswith('_v1')}
    target = np.median(np.array([v for k, v in meds.items() if k not in SKIN_MATCH]), axis=0)
    for k in SKIN_MATCH:
        cuts[k] = shift(cuts[k], target - meds[k]); print(k, 'skin moved by', np.round(target - meds[k], 1))
    ref = cuts['alan_bn_jacket_off']
    hh = int(ref.shape[0] * 0.15); hx0 = int(ref.shape[1] * 0.25)   # his head: the top 15% of the standing frame
    ref_head = gray(ref)[0:hh, hx0:hx0 + int(ref.shape[1] * 0.6)]
    base = H_GAME / ref.shape[0]
    out = {}
    os.makedirs(O + 'sprites', exist_ok=True)
    for f in glob.glob(O + 'sprites/*.webp'): os.remove(f)
    for k, (src, waist) in FRAMES.items():
        a = cuts[k]
        v, s = (1.0, 1.0) if k == 'alan_bn_jacket_off' else (0.0, a.shape[0] / ref.shape[0]) if k in STAND else (0.0, FIXED[k]) if k in FIXED else head_scale(ref_head, a)
        f = base / s
        im = Image.fromarray(a, 'RGBA').resize((max(1, round(a.shape[1] * f)), max(1, round(a.shape[0] * f))), Image.LANCZOS)
        W, Hh = im.width + 2 * PAD, im.height + 2 * PAD
        canvas = Image.new('RGBA', (W, Hh)); canvas.paste(im, (PAD, PAD), im)
        al = np.asarray(canvas)[..., 3] > 128
        ys, xs = np.nonzero(al); bot = ys.max()
        band = al[max(0, bot - int(0.06 * H_GAME)):bot + 1]                 # feet (or the waist cut)
        ax = float(np.nonzero(band)[1].mean())
        canvas.save(O + 'sprites/' + k + '.webp', 'WEBP', quality=92, method=6)
        out[k] = {'src': O + 'sprites/' + k + '.webp', 'w': W, 'hh': Hh, 'h': float(H_GAME), 'ax': round(ax, 1),
                  'fy': float(bot), 'top': float(ys.min()), 'waist': waist, 'head_match': round(float(v), 2), 'head_scale': round(float(s), 3)}
        print(f"{k:20s} head x{s:.2f} (match {v:.2f})  {W}x{Hh}")
    json.dump(out, open(O + 'sprites.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
