#!/usr/bin/env python3
# A keyframe for stepping into a pair painting: Alan and his partner as two standing figures, placed where the pair
# painting has their feet (its ax/fy for Alan, px/pfy for the partner), on the pair painting's canvas and scale.
#   python3 scripts/ludo_pair_key.py <out name> <pair frame> <alan frame> <partner frame> [--partner-scale 1.0]
# Writes art/review/ludo/keys/<out name>.png and <out name>.json (the pair painting's sprite data, which the key
# shares: its feet are where the pair has them), for scripts/ludo.py and scripts/ludo_fit.py as 'file:<out name>'.
import argparse, json, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('pair'); ap.add_argument('alan'); ap.add_argument('partner')
ap.add_argument('--partner-scale', type=float, default=1.0); a = ap.parse_args()
t = open(os.path.join(ROOT, 'js/sprites.js')).read(); S = json.loads(t[t.index('{'):t.rindex('}') + 1])
P = S[a.pair]; pair = Image.open(os.path.join(ROOT, f'art/sprites/{a.pair}.webp'))
W, H = pair.size; pad = 200  # room either side: two figures apart can be wider than the pair
canvas = Image.new('RGBA', (W + 2 * pad, H))
def put(name, fx, fy, face_left, k):
    m = S[name]; im = Image.open(os.path.join(ROOT, f'art/sprites/{name}.webp')).convert('RGBA')
    ax = m['ax']
    if bool(m.get('facesLeft')) != face_left: im = im.transpose(Image.FLIP_LEFT_RIGHT); ax = im.width - ax
    s = P['h'] / m['h'] * k
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    canvas.alpha_composite(im, (round(pad + fx - ax * s), round(fy - m['fy'] * s)))
# the partner stands on the left facing right, Alan on the right facing him (as every pair painting has them)
put(a.partner, P['px'], P['pfy'], False, a.partner_scale)
put(a.alan, P['ax'], P['fy'], True, 1.0)
canvas.save(os.path.join(ROOT, f'art/review/ludo/keys/{a.out}.png'))
meta = dict(P, w=float(canvas.width), ax=P['ax'] + pad, px=P['px'] + pad)
json.dump(meta, open(os.path.join(ROOT, f'art/review/ludo/keys/{a.out}.json'), 'w'), indent=1)
print(a.out, canvas.size)
