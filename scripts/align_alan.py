# Alan alignment proposal: one height and one feet anchor for every solo frame.
#   python3 scripts/align_alan.py            -> art/review/alan/phase1/alignment.json (js/sprites.js untouched)
#   python3 scripts/align_alan.py --apply    -> also writes the new ax / h into js/sprites.js
# The engine draws a frame at scale H/h with (ax, fy) on the character's position, so:
#   * ax becomes the point between his feet (midpoint of the two boots); in walk frames, his hips,
#   * h is set so the figure's head-to-feet height maps to the target (720 = alan_side standing),
#   * fy already sits on the soles in every frame and is kept.
# Frames tied to a prop or partner (stool, rope, bell, water, basin, crouch, jump) keep their anchor;
# frames whose top is a raised arm keep their scale (their bounding box is not his height).
import json, sys, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/alan/phase1/alignment.json')
TARGET = 720.0
# walking bob, as head height relative to standing: contact > down < passing > up (about 2.5% overall)
WALK = {'alan_walkA': 0.985, 'alan_walkB': 0.985, 'alan_walkDown': 0.975, 'alan_pass': 0.997, 'alan_walkUp': 0.99,
        'alan_lwalk1': 0.985, 'alan_lwalk2': 0.975, 'alan_front_walk1': 0.99, 'alan_front_walk2': 0.99,
        'alan_back_walk1': 0.99, 'alan_back_walk2': 0.99, 'alan_undress_jeans': 0.95, 'alan_trunks_down': 0.95}
CONTEXT = {'alan_asleep': 'sits on the stool', 'alan_pickup': 'crouched, hand on the floor', 'alan_jump': 'mid-air',
           'alan_swim': 'in the water', 'alan_swim2': 'in the water', 'alan_swim_wave': 'in the water',
           'alan_wash1': 'at the basin (close-up)', 'alan_wash2': 'at the basin (close-up)',
           'alan_pull': 'hauling a rope', 'alan_untie': 'hauling a rope', 'alan_wring': 'rope shared with Celeste',
           'alan_ring': 'swinging at the bell', 'alan_wash3': 'at the basin (close-up)', 'alan_wash4': 'at the basin (close-up)', 'alan_wash5': 'at the basin (close-up)',
           'alan_wash6': 'at the basin (close-up)', 'alan_wash_surface': 'at the basin (close-up)', 'alan_climb': 'climbing out of the tank',
           'alan_jump_crouch': 'leap (placed by the jump arc)', 'alan_jump_rise': 'leap (placed by the jump arc)', 'alan_jump_fall': 'leap (placed by the jump arc)', 'alan_throw1': 'aimed throw (Se)', 'alan_throw2': 'aimed throw (Se)'}
# arms-up frames: the outline's top is a hand, so his head-to-feet height (in sprite px) is estimated from the
# waistband to the soles, using the waist ratio of a frame of the same view (front 0.573, towel set 0.699)
ARMS_UP = {'alan_stretch': 757, 'alan_fling': 709, 'alan_undress2': 745, 'alan_dress3': 728, 'alan_undress_belt': 661}


def load_meta():
    txt = open(os.path.join(ROOT, 'js/sprites.js')).read()
    return json.loads(txt[txt.index('{'):txt.rindex('}') + 1])


def measure(k, walk=False):
    """(top, bottom, anchor_x). Standing: the midpoint between the two boots (the two biggest blobs in
    the lowest 10% of the figure; 3/4 views put the near boot lower). Walking: the hips (centre of the
    figure at 50-56% of its height), so the body glides while the feet alternate."""
    import cv2
    al = np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{k}.webp')).convert('RGBA'))[..., 3] > 128
    ys, xs = np.where(al); top, bot = ys.min(), ys.max(); H = bot - top
    if walk:
        y0, y1 = int(top + H * 0.50), int(top + H * 0.56)
        cols = np.where(al[y0:y1].any(0))[0]
        return float(top), float(bot), float((cols.min() + cols.max()) / 2)
    band = np.zeros_like(al); y0 = int(bot - H * 0.10); band[y0:] = al[y0:]
    n, lab, st, cen = cv2.connectedComponentsWithStats(band.astype(np.uint8), 8)
    blobs = sorted(((st[i, cv2.CC_STAT_AREA], cen[i][0]) for i in range(1, n)), reverse=True)
    blobs = [b for b in blobs if b[0] >= blobs[0][0] * 0.25][:2]
    fx = blobs[0][1] if len(blobs) == 1 else (blobs[0][1] + blobs[1][1]) / 2
    return float(top), float(bot), float(fx)


def main():
    M = load_meta(); res = {}
    for k in sorted(x for x in M if x.startswith('alan_')):
        m = M[k]; top, bot, fx = measure(k, k in WALK)
        drawn = (bot - top) / m['h'] * TARGET
        r = dict(old_ax=m['ax'], old_h=m['h'], fy=m['fy'], drawn_before=round(drawn, 1), feet_x=round(fx, 1))
        if k in CONTEXT:
            r.update(kind='context', note=CONTEXT[k], new_ax=m['ax'], new_h=m['h'])
        else:
            target = TARGET * WALK.get(k, 1.0)
            new_h = round((ARMS_UP[k] if k in ARMS_UP else bot - top) * TARGET / target, 2)
            r.update(kind='walk' if k in WALK else ('arms-up' if k in ARMS_UP else 'stand'),
                     new_ax=round(fx, 1), new_h=new_h)
        r['drawn_after'] = round((bot - top) / r['new_h'] * TARGET, 1)
        r['feet_shift_px'] = round(r['new_ax'] - r['old_ax'], 1)
        res[k] = r
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(res, open(OUT, 'w'), indent=1)
    print('wrote', os.path.relpath(OUT, ROOT))
    if '--apply' in sys.argv:
        for k, r in res.items(): M[k]['ax'], M[k]['h'] = r['new_ax'], r['new_h']
        with open(os.path.join(ROOT, 'js/sprites.js'), 'w') as fh:
            fh.write('// Generated by scripts/matte.py: painted sprite frames (size, head anchor, feet line).\nwindow.SPRITES = '
                     + json.dumps(dict(sorted(M.items())), indent=1) + ';\n')
        print('applied to js/sprites.js')


if __name__ == '__main__':
    main()
