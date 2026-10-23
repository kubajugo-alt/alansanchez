#!/usr/bin/env python3
# A Ludo walk (scripts/ludo.py, a looping in-place walk drawn from one standing painting) made into a candidate cycle:
#   python3 scripts/ludo_walk_fit.py <name> <slot> <base frame> [--n 8]
#     slot: walk | frontWalk | backWalk | lantern (the lantern set's walk)
# One full cycle (two steps) is found in the run by where it repeats itself; n frames are taken evenly through it.
# His painting is fitted once to the frame most like it, and every frame keeps that placement (an in-place walk:
# the anchor stays put, as in the painted cycles). Colours moved toward the painting's, as in scripts/ludo_fit.py,
# and the same consistency readings per frame. A side walk also gets its foot data (S.WALK_PLANT's form: the planted
# boot from each frame on; a contact frame also gives the boot that carried him up to it), measured from the art.
# Candidates alan_lu_<name>_<i> (kind 'ludo-walk'), wired as walkCycle: the whole cycle replaces that slot only
# once every one of its frames is approved (js/story/main.js); the walk the game plays now is untouched until then.
import argparse, glob, json, os
import numpy as np
from PIL import Image
import ludo_fit as LF

ROOT = LF.ROOT


def boots(im, m):
    """The brown boots: [x from the anchor, lift] in his heights, front to back (scripts/walk_plant.py's measure)."""
    import cv2
    a = np.asarray(im.convert('RGBA'))[..., 3] > 128
    rgb = np.asarray(im.convert('RGB')).astype(int)
    b = a & (rgb[..., 0] > rgb[..., 2] + 25)
    b[:int(m['fy'] - 0.13 * m['h'])] = False
    n, lab, st, _ = cv2.connectedComponentsWithStats(b.astype(np.uint8), 8)
    out = []
    for i in range(1, n):
        if st[i, 4] < 250 * (m['h'] / 720) ** 2: continue
        ys, xs = np.where(lab == i)
        out.append([float((xs.mean() - m['ax']) / m['h']), float((m['fy'] - ys.max()) / m['h'])])
    return sorted(out, reverse=True)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('name'); ap.add_argument('slot'); ap.add_argument('base'); ap.add_argument('--n', type=int, default=0)
    a = ap.parse_args()
    d = os.path.join(ROOT, 'art/review/ludo', a.name)
    S = LF.sprites()
    files = sorted(glob.glob(os.path.join(d, 'up/f*.png')))
    frames = [Image.open(f).convert('RGBA') for f in files]
    sm = [LF.small(f, 8) for f in frames]
    N = len(frames)
    # the cycle's length: the lag at which the run looks most like itself (at least 8 frames: two steps)
    best = None
    for L in range(8, N):
        e = np.mean([np.abs(sm[i] - sm[i + L]).mean() for i in range(0, N - L)])
        if best is None or e < best[0]: best = (e, L)
    P = best[1]
    n = a.n or (10 if a.slot == 'walk' else 8)
    picks = [int(round(i * P / n)) for i in range(n)]
    base, bm = LF.load_key(a.base, S)
    if bm.get('facesLeft'): base = base.transpose(Image.FLIP_LEFT_RIGHT); bm = LF.mirror_meta(bm, base)
    # placement: his painting fitted to each frame of the cycle; the best fit's scale and offset serve them all
    fits = [(LF.fit(base, frames[i]), i) for i in picks]
    F, at = max(fits, key=lambda x: x[0]['iou'])
    sb = LF.stats(base); hb = LF.head_hist(base)
    prefix = f'alan_lu_{a.name}_'
    C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))
    C['candidates'] = [c for c in C['candidates'] if not c['id'].startswith(prefix)]
    ids, rep, metas, ims = [], [], [], []
    for k, i in enumerate(picks):
        fr = frames[i]
        mu, sd = LF.stats(fr); drift = float(np.linalg.norm(mu - sb[0]))
        L = LF.lab(fr); L = (L - mu) / sd * sb[1] + sb[0]
        out = Image.fromarray(np.dstack([LF.unlab(L), np.asarray(fr.getchannel('A'))]), 'RGBA')
        bx = out.getbbox(); pad = 4
        x0, y0 = max(0, bx[0] - pad), max(0, bx[1] - pad); x1, y1 = min(out.width, bx[2] + pad), min(out.height, bx[3] + pad)
        crop = out.crop((x0, y0, x1, y1))
        meta = {'w': float(crop.width), 'hh': float(crop.height), 'h': round(bm['h'] * F['s'], 1),
                'ax': round(bm['ax'] * F['s'] + F['ox'] - x0, 1), 'fy': round(bm['fy'] * F['s'] + F['oy'] - y0, 1), 'top': float(max(0, bx[1] - y0))}
        head = LF.corr(LF.head_hist(out), hb)
        gh = (bx[3] - bx[1]) / meta['h']; gb = LF.alpha(base, 1).any(1).sum() / bm['h']
        hdev = float(abs(gh - gb) / gb)
        cid = f'{prefix}{k + 1:02d}'
        crop.save(os.path.join(LF.CAND, cid + '.webp'), 'WEBP', quality=90, method=6, exact=True)
        flags = [x for x, bad in (('drift', drift > LF.LIMITS['drift']), ('head', head < LF.LIMITS['head']), ('height', hdev > 0.08)) if bad]
        rep.append({'id': cid, 'frame': i, 'drift': round(drift, 1), 'head': round(head, 3), 'height': round(hdev, 3), 'flags': flags})
        ids.append(cid); metas.append(meta); ims.append(crop)
    wire = {'walkCycle': {'slot': a.slot, 'ids': ids}}
    if a.slot == 'walk':
        # the contacts: the two frames, one in each half of the cycle, where his boots are furthest apart (heel down in
        # front, toe behind). From each, the front boot carries him back to the next contact, evenly per frame: reading
        # the lower boot frame by frame mistakes one boot for the other where his legs pass
        ft = [boots(im, m) for im, m in zip(ims, metas)]
        sep = [(f[0][0] - f[-1][0]) if len(f) >= 2 else 0 for f in ft]
        h2 = n // 2
        c1 = max(range(h2), key=lambda k: sep[k]); c2 = max(range(h2, n), key=lambda k: sep[k])
        plant = {}
        for c, nxt in ((c1, c2), (c2, c1 + n)):
            front, back = ft[c][0][0], ft[c][-1][0]
            span = nxt - c; travel = front - back       # one step: the front boot ends where the back one started
            for q in range(span):
                cid = ids[(c + q) % n]
                plant[cid] = [round(front, 3), round(back, 3)] if q == 0 else [round(front - travel * q / span, 3)]
        if len(plant) == len(ids): wire['walkCycle']['plant'] = plant
        print('plant', plant)
    else:
        wire['walkCycle']['lens'] = [round(0.68 / n, 4)] * n   # the painted 4-frame cycles' ground per cycle (0.17 a frame)
    for k, cid in enumerate(ids):
        C['candidates'].append({'id': cid, 'char': 'alan', 'phase': 4, 'kind': 'ludo-walk', 'what': f'Ludo {a.slot} cycle, frame {k + 1} of {n}',
                                'src': f'art/review/candidates/{cid}.webp', 'originals': [f'art/sprites/{a.base}.webp'],
                                'meta': metas[k], 'wire': wire, 'consistency': {x: rep[k][x] for x in ('drift', 'head', 'height', 'flags')}})
    json.dump(C, open(os.path.join(ROOT, 'art/review/candidates.json'), 'w'), indent=1)
    json.dump({'period': P, 'picks': picks, 'fit': F, 'fit_at': at, 'frames': rep}, open(os.path.join(d, 'fit.json'), 'w'), indent=1)
    print(a.name, 'cycle', P, 'frames; picked', picks, 'fit iou', round(F['iou'], 3))
    print('  drift', [r['drift'] for r in rep], 'head', [r['head'] for r in rep], 'height', [r['height'] for r in rep])
    print('  flags', [(r['id'][-2:], r['flags']) for r in rep if r['flags']] or 'none')


if __name__ == '__main__':
    main()
