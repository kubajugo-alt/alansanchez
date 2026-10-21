# The new bath scene's paintings lined up one to the next (the user: "align them all so that the transition is as little
# visible as possible"): in each run of the scene that stays in one place (undressing on the floor, behind the tank, in
# the water, at the rim, dressing in the towel) every painting is slid sideways to where it overlaps the one before it
# the most (the two figures' shapes, at game size and facing as the scene plays them), chained from the run's first
# painting. The result is each painting's anchor (`ax` in sprites.json); a painting met again later (the undressing
# in-betweens played backwards while dressing) keeps the place it was given first. Feet stay on the floor (the
# vertical anchor is untouched). Run after scripts/bath_new_fit.py.
#   python3 scripts/bath_new_align.py
import json, numpy as np
from PIL import Image

J = 'art/review/alan/bath_new/sprites.json'
H = 360  # his standing height in the room, px
# the scene's runs, in order: (painting, mirrored); see S.bathNew in js/story/ch2.js
RUNS = [
    ['jacket_shrug', 'x_jacket_arm', 'jacket_off', 'x_jacket_drop', 'tee_lift<', 'x_tee_up', 'tee', 'x_tee_toss', 'belt',
     'x_unbutton', 'jeans_half', 'x_jeans_knees', 'jeans_off<', 'x_kick', 'pants', 'x_turn', 'walk', 'x_walk2'],
    ['reach', 'x_raise', 'fling', 'x_crouch'],
    ['x_surface', 'hair<', 'x_hands_down', 'relax', 'x_scoop<', 'splash<', 'x_wipe'],
    ['rim', 'x_haul'],
    ['climb', 'x_climb_down', 'stepdown', 'x_tuck<', 'towel<', 'x_pick_up<', 'pants_on<', 'x_shorts_knees<', 'pants_up<',
     'x_jeans_ready<', 'jeans_off', 'y_jeans_up<', 'zip<', 'y_button<', 'belt<', 'y_tee_ready<', 'tee<', 'y_tee_down<',
     'jacket_off<', 'y_jacket_on<', 'dressed<'],
]


def mask(m, flip):
    a = np.asarray(Image.open(m['src']))[..., 3]
    s = H / m['h']
    a = np.asarray(Image.fromarray(a).resize((max(1, round(m['w'] * s)), max(1, round(m['hh'] * s))))) > 100
    return a[:, ::-1] if flip else a, s


def canvas(m, flip, x):
    """the painting's shape on a 600 x 500 field, its anchor at x and its foot (or cut) line at row 480"""
    a, s = mask(m, flip)
    ax = (m['w'] - m['ax']) * s if flip else m['ax'] * s
    c = np.zeros((500, 600), bool)
    x0, y0 = int(round(x - ax)), int(round(480 - m['fy'] * s))
    ys, xs = slice(max(0, y0), min(500, y0 + a.shape[0])), slice(max(0, x0), min(600, x0 + a.shape[1]))
    c[ys, xs] = a[ys.start - y0:ys.stop - y0, xs.start - x0:xs.stop - x0]
    return c


def main():
    sp = json.load(open(J))
    before = {k: m['ax'] for k, m in sp.items()}
    placed = {}  # painting -> its anchor, as a fraction of its width from the left of the unmirrored painting
    for run in RUNS:
        prev = None
        for step in run:
            flip = step.endswith('<'); k = 'alan_bn_' + step.rstrip('<'); m = sp[k]
            if k in placed:
                m['ax'] = placed[k]
            elif prev is not None:
                ref = canvas(*prev, 300)
                best = max(range(-90, 91), key=lambda d: (canvas(m, flip, 300 + d) & ref).sum() / max(1, (canvas(m, flip, 300 + d) | ref).sum()))
                s = H / m['h']
                # moving the painting right by d is moving its anchor left by d (mirrored: the other way)
                m['ax'] = round(m['ax'] + (best / s if flip else -best / s), 1)
                placed[k] = m['ax']
                print(f'{k:26s} {"<" if flip else " "} slid {best:+4d} px')
            else:
                placed[k] = m['ax']
            prev = (m, flip)
    # thrown things painted with a frame keep their place by it
    for l in sp.values():
        if 'from' in l: l['dx'] = round(l['dx'] - (sp[l['from']]['ax'] - before[l['from']]), 1)
    json.dump(sp, open(J, 'w'), indent=1)


if __name__ == '__main__':
    main()
