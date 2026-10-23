#!/usr/bin/env python3
# Alan climbing out of the Sé pit over its near rim, facing us (the user, 23 Oct: "don't use the ladder"; front view
# chosen): three Canva paintings (art/review/alan/climb/f1-f3_export.png: hands on the edge, knee coming over, kneeling
# on the rim) keyed and made review candidates alan_climb_k1..k3, at the Ludo frames' resolution (his standing height
# 1440 px). Each is scaled by his head (hair width against alan_front's), so the three agree with each other and with
# his front painting. meta.rim: how high above his lowest point his hands are, in his heights: in the pit the near rim
# cuts the figure there (the engine's sink), so his hands rest on it; 0 for the frames on the floor.
#   python3 scripts/climb_fit.py
import json, os, sys
import cv2, numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from canva_restyle_fit import key_out

O = os.path.join(ROOT, 'art/review/alan/climb/')
H = 1440                         # his standing height in the candidates' pixels (as the Ludo frames)
HAIR = 94 / 742                  # alan_front: hair width in his heights
KEYS = [('k1', 'f1', True, 'Climbing out of the pit: hands flat on the near rim'),
        ('k2', 'f2', True, 'Climbing out: arms locked, a knee coming over the rim'),
        ('k3', 'f3', False, 'Climbing out: kneeling on the rim, getting up')]


def cut(name):
    rgb = np.asarray(Image.open(O + name + '_export.png').convert('RGB'))[:, 70:1010]  # the painting's own area
    a = key_out(rgb); a[..., 3][a[..., 3] < 40] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats((a[..., 3] > 0).astype(np.uint8), 8)
    a[..., 3][lab != 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])] = 0
    ys, xs = np.nonzero(a[..., 3] > 128)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def hair(a):
    al = a[..., 3] > 128; top = np.nonzero(al.any(1))[0].min(); w = 0
    for y in range(top, top + int(0.09 * a.shape[0])):
        d = np.nonzero(al[y] & (a[y, :, :3].astype(int).sum(1) < 160))[0]
        if len(d): w = max(w, d.max() - d.min())
    return w


def main():
    C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))
    C['candidates'] = [c for c in C['candidates'] if not c['id'].startswith('alan_climb_k')]
    for k, src, in_pit, what in KEYS:
        a = cut(src)
        h0 = hair(a) / HAIR                    # his standing height in the export's pixels
        s = H / h0
        im = Image.fromarray(a, 'RGBA').resize((round(a.shape[1] * s), round(a.shape[0] * s)), Image.LANCZOS)
        al = np.asarray(im)[..., 3] > 128
        # his head's centre (the anchor's x: he climbs straight up towards us), his lowest point (its y)
        top = np.nonzero(al.any(1))[0].min(); hx = np.nonzero(al[top:top + int(0.06 * H)].any(0))[0]
        ax = float((hx.min() + hx.max()) / 2); fy = float(np.nonzero(al.any(1))[0].max())
        rim = 0.0
        if in_pit:  # his hands: the widest row of the outline (palms out on the edge), below his shoulders
            widths = [(np.ptp(np.nonzero(r)[0]) if r.any() else 0) for r in al]
            y0 = top + int(0.2 * H); yh = y0 + int(np.argmax(widths[y0:int(fy)]))
            rim = round((fy - yh) / H, 3)
        cid = 'alan_climb_' + k
        im.save(os.path.join(ROOT, f'art/review/candidates/{cid}.webp'), 'WEBP', quality=90, method=6, exact=True)
        meta = {'w': float(im.width), 'hh': float(im.height), 'h': float(H), 'ax': round(ax, 1), 'fy': round(fy, 1), 'top': float(top), 'rim': rim}
        C['candidates'].append({'id': cid, 'char': 'alan', 'phase': 4, 'kind': 'climb', 'what': what,
                                'src': f'art/review/candidates/{cid}.webp', 'originals': ['art/sprites/alan_front.webp'],
                                'meta': meta, 'wire': {}})
        print(cid, im.size, 'scale', round(s, 3), 'rim', rim)
    json.dump(C, open(os.path.join(ROOT, 'art/review/candidates.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
