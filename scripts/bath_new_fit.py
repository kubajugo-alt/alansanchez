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
    'alan_bn_jacket_shrug': ('c_A2_jacket_shrug', False), 'alan_bn_jacket_off': ('b01_jacket_off', False),
    'alan_bn_tee_lift': ('c_B_tee_lift', False), 'alan_bn_tee': ('c_C_tee_over', False), 'alan_bn_belt': ('c_D_belt', False),
    'alan_bn_jeans_half': ('c_E_jeans_half', False), 'alan_bn_jeans_off': ('b03u_jeans_off', False),
    'alan_bn_pants': ('c_F_boxers', False), 'alan_bn_fling': ('b05u_fling', True), 'alan_bn_hair': ('c_G_hair_wet', True),
    'alan_bn_splash': ('b07_splash', True), 'alan_bn_climb': ('b08t_climb_towel', False),
    'alan_bn_towel': ('b09t_drip_towel', False), 'alan_bn_pants_on': ('c_J2_towel_step', False),
    'alan_bn_pants_up': ('c_K2_boxers_up', False),
    # round 3 (the user's board): reaching down behind the tank, pushing up on the rim to get out, two more in the water
    'alan_bn_reach': ('c_M_reach_down', True), 'alan_bn_rim': ('c_N2_rim_push', True),
    'alan_bn_relax': ('c_O_relax', True), 'alan_bn_toss': ('c_P_hair_toss', True),
    # the jump in: Canva paints him in shorts whatever the prompt (and refuses a skinny-dip), so the tuck was painted in
    # black shorts and then, as an edit of that painting, the shorts recoloured to his skin, seamless (c_Q0_* the first)
    'alan_bn_cannonball': ('c_Q_cannonball', False),
    # the walk round to the back of the tank, and two more stages of getting out (sitting on the rim, stepping down)
    'alan_bn_walk': ('c_R_walk_boxers', False), 'alan_bn_sit': ('c_S_sit_rim', False), 'alan_bn_stepdown': ('c_T_step_down', False), 'alan_bn_zip': ('c_L_zip', False), 'alan_bn_dressed': ('b10_dressed', False),
    # earlier versions the user asked to change, kept for the board's library
    'alan_bn_tee_v1': ('b02_tee_off', False), 'alan_bn_pants_v1': ('b04u_underwear', False),
    'alan_bn_hair_v1': ('b06_hair_back', True), 'alan_bn_pants_on_v1': ('b11u_pants_in_hand', False),
    'alan_bn_jacket_shrug_v1': ('c_A_jacket_shrug', False), 'alan_bn_pants_on_v2': ('c_J_towel_step', False),
    'alan_bn_pants_up_v1': ('c_K_boxers_up', False), 'alan_bn_rim_v1': ('c_N_rim_push', True),
}
# skin evened out to the other frames' median (the user: "skintone slightly darker than the rest")
# ...and now every frame his bare skin shows in (the user: "skin colour correction might be needed": the cannonball came
# out oranger, the step down lighter, the tee lift darker), all to the median of those frames. Not the jacket frames:
# the leather is skin-coloured to the mask, so their measure is the jacket's, and his face and hands there are fine
CLOTHED = {'alan_bn_jacket_shrug', 'alan_bn_jacket_off', 'alan_bn_dressed', 'alan_bn_jacket_shrug_v1'}
SKIN_MATCH = {k for k in FRAMES if k not in CLOTHED and not k.endswith(('_v1', '_v2'))}
# the head match fails here (hands over the head; bent double): the scale of a frame Canva drew the same way.
# The waist-up frames by hand (the user: "match the size of his torso images with his actual torso when we see the
# full body"): brow to chin measured on the fitted sprites, 56 px standing (alan_bn_towel), throw 60, hair 73, splash 55
FIXED = {'alan_bn_hair': 1.721, 'alan_bn_jeans_half': 1.0, 'alan_bn_fling': 1.211, 'alan_bn_splash': 1.758,
         'alan_bn_reach': 1.58, 'alan_bn_rim': 1.75, 'alan_bn_relax': 1.24, 'alan_bn_toss': 1.56}
# standing upright: scaled to the first frame's full height (his height is the surest measure there; the head match
# drifts by up to 8% on a turned or tilted head). The rest (hopping, climbing, waist-up) by the head.
STAND = {'alan_bn_jacket_shrug', 'alan_bn_tee_lift', 'alan_bn_tee', 'alan_bn_belt', 'alan_bn_pants', 'alan_bn_towel', 'alan_bn_zip',
         'alan_bn_dressed', 'alan_bn_tee_v1', 'alan_bn_pants_v1', 'alan_bn_pants_on_v1', 'alan_bn_pants_up',
         'alan_bn_jacket_shrug_v1', 'alan_bn_pants_up_v1'}
# waist-up paintings that go on below his waist: cut there (rows of the 896x1792 export). The reach's hands hang below
# his hips (the tank hides them anyway); the hair toss came with shorts on, and he swims without
CUT_AT = {'c_M_reach_down': 1185, 'c_P_hair_toss': 1332}
DESPILL = {'c_N_rim_push': 1200}
# the shorts Canva painted between his hands (box in the export: x0, y0, x1, y1): anything there that isn't skin goes
NOT_SKIN = {'c_N2_rim_push': (180, 1300, 700, 1545)}
H_GAME = 720       # sprite px for his full standing height (alan_side)
# the boxers Canva painted in the air over the throw: cut out as their own sprite (the game throws them, ch2.js)
LOOSE = {'alan_bn_fling': 'alan_bn_boxers'}
PAD = 6


def cut(name):
    a = key_out(np.asarray(Image.open(O + name + '_export.png').convert('RGB')))
    if name in CUT_AT: a[CUT_AT[name]:, :, 3] = 0
    if name in NOT_SKIN:
        x0, y0, x1, y1 = NOT_SKIN[name]; hsv = cv2.cvtColor(a[..., :3], cv2.COLOR_RGB2HSV).astype(int)
        skin = ((hsv[..., 0] <= 22) | (hsv[..., 0] >= 172)) & (hsv[..., 1] > 60) & (hsv[..., 2] > 80)
        box = np.zeros(skin.shape, bool); box[y0:y1, x0:x1] = True; a[..., 3][box & ~skin] = 0
        strip = np.zeros(skin.shape, bool); strip[y0:y1, :] = True                          # grey-black (the string), not
        a[..., 3][strip & (hsv[..., 1] < 60) & (hsv[..., 2] < 70)] = 0                      # his brown ink outlines
        # ...and any small scrap left there (a strand of the drawstring): only the big pieces stay
        n, lab, st, _ = cv2.connectedComponentsWithStats((a[..., 3] > 0).astype(np.uint8), 8)
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] < 4000 and box[lab == i].all(): a[..., 3][lab == i] = 0
    if name in DESPILL:   # a body fading into the green: no green left in it
        rgb = a[..., :3].astype(int); rgb[..., 1] = np.minimum(rgb[..., 1], np.maximum(rgb[..., 0], rgb[..., 2])); a[..., :3] = rgb
        lo = np.zeros(a.shape[:2], bool); lo[DESPILL[name]:] = True     # ...and below the chest, nothing greener than skin
        r, g, b = (a[..., i].astype(int) for i in range(3)); a[..., 3][lo & (g >= r - 30) & (g > b + 20)] = 0
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


def split_loose(canvas, k, out):
    """the figure is the largest piece; anything else of any size (the flung boxers) goes to its own sprite, saved with
    where it sat relative to the figure's anchor (dx, dy from the bottom-centre of the cut), and the figure is cropped
    to what's left"""
    a = np.asarray(canvas).copy()
    n, lab, st, _ = cv2.connectedComponentsWithStats((a[..., 3] > 40).astype(np.uint8), 8)
    body = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    loose = [i for i in range(1, n) if i != body and st[i, cv2.CC_STAT_AREA] > 400]
    if not loose: return canvas
    m = np.isin(lab, loose)
    m = cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0   # the soft edge with it
    piece = a.copy(); piece[~m, 3] = 0; a[m, 3] = 0
    ys, xs = np.nonzero(piece[..., 3] > 0)
    x0, x1, y0, y1 = xs.min() - PAD, xs.max() + PAD + 1, ys.min() - PAD, ys.max() + PAD + 1
    by, bx = np.nonzero(a[..., 3] > 128)
    fy, ax = by.max(), bx[by >= by.max() - int(0.06 * H_GAME)].mean()
    Image.fromarray(piece[max(0, y0):y1, max(0, x0):x1], 'RGBA').save(O + 'sprites/' + LOOSE[k] + '.webp', 'WEBP', quality=92, method=6)
    w, h = x1 - max(0, x0), y1 - max(0, y0)
    out[LOOSE[k]] = {'src': O + 'sprites/' + LOOSE[k] + '.webp', 'w': int(w), 'hh': int(h), 'h': float(H_GAME), 'ax': w / 2, 'fy': h / 2,
                     'from': k, 'dx': round(float((max(0, x0) + w / 2) - ax), 1), 'dy': round(float((max(0, y0) + h / 2) - fy), 1)}
    # the figure without them, cropped to what's left
    ys, xs = np.nonzero(a[..., 3] > 0)
    return Image.fromarray(a[max(0, ys.min() - PAD):ys.max() + PAD + 1, max(0, xs.min() - PAD):xs.max() + PAD + 1], 'RGBA')


def main():
    cuts = {k: cut(src) for k, (src, _) in FRAMES.items()}
    meds = {k: lab_median(a, skin_mask(a)) for k, a in cuts.items() if not k.endswith('_v1')}
    target = np.median(np.array([v for k, v in meds.items() if k not in CLOTHED]), axis=0)
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
        if k in LOOSE: canvas = split_loose(canvas, k, out)
        W, Hh = canvas.size
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
