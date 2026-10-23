#!/usr/bin/env python3
# Ludo frames (scripts/ludo.py, the 1.5x upscaled export) made into review candidates for Alan's in-betweens:
#   python3 scripts/ludo_fit.py <name> [--fps 20] [--n 8] [--sheet out.jpg]
# Reads art/review/ludo/<name>/job.json (its keyframes: a [-> mid] -> b) and up/f*.png. For each keyframe it finds
# where his painting sits in Ludo's canvas (scale and offset, fitted on the cut-out's outline), so every frame gets
# anchors on his own feet; frames between two keyframes take the fit interpolated by how far the motion has got.
# The still frames at either end are dropped and the rest sampled evenly by motion. Each frame's colours are
# moved toward his paintings' (mean and spread per channel in Lab, interpolated between the two keyframes).
# Consistency is measured on every frame (colour drift before the correction, head against his painting's head, his
# height against the keyframes') and written to art/review/ludo/<name>/fit.json; frames past the limits are flagged.
# Writes art/review/candidates/alan_lu_<name>_<seg><i>.webp at Ludo's 1.5x resolution and their entries in
# art/review/candidates.json (kind 'ludo', wired as inbetween 'a>b' with its frame rate in ibFps). Nothing is
# approved here: the review screen decides.
import argparse, glob, json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(ROOT, 'art/sprites')
CAND = os.path.join(ROOT, 'art/review/candidates')
MOTION_PER_FRAME = 10.0  # one in-between per this much measured change (scripts/ludo_fit.py's step), 4 to 10 a segment
LIMITS = {'drift': 14.0, 'head': 0.55, 'height': 0.06}   # Lab distance, head histogram correlation (min), height change


def sprites():
    src = open(os.path.join(ROOT, 'js/sprites.js')).read()
    S = json.loads(src[src.index('{'):src.rindex('}') + 1])
    for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']:
        if c.get('meta') and c['id'] not in S: S[c['id']] = dict(c['meta'], src=c['src'])
    return S


def load_key(k, S):
    if k.startswith('file:'):  # a composed keyframe (scripts/ludo_pair_key.py): its picture and the pair's data
        b = os.path.join(ROOT, 'art/review/ludo/keys', k[5:])
        return Image.open(b + '.png').convert('RGBA'), json.load(open(b + '.json'))
    p = os.path.join(SPR, k + '.webp')
    if not os.path.exists(p): p = os.path.join(ROOT, S[k]['src'])
    return Image.open(p).convert('RGBA'), S[k]


def mirror_meta(m, im):
    m = dict(m); m['ax'] = im.width - m['ax']; m['facesLeft'] = not m.get('facesLeft')
    if 'px' in m: m['px'] = im.width - m['px']
    return m


def alpha(im, k=4):
    a = np.asarray(im.getchannel('A').resize((max(1, im.width // k), max(1, im.height // k))), dtype=np.float32) / 255
    return a > 0.5


def bbox(a):
    ys, xs = np.nonzero(a)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def fit(src, frame):
    """Scale s and offset (ox, oy) with frame_px = s * src_px + o, best alpha overlap (search round the bbox fit)."""
    k = 4
    A, B = alpha(src, 1), alpha(frame, k)
    sx0, sy0, sx1, sy1 = bbox(A); fx0, fy0, fx1, fy1 = [v * k for v in bbox(B)]
    s0 = (fy1 - fy0) / (sy1 - sy0)
    best = None
    for s in s0 * np.linspace(0.94, 1.06, 13):
        w, h = int(src.width * s / k), int(src.height * s / k)
        a = np.asarray(src.getchannel('A').resize((max(1, w), max(1, h))), dtype=np.float32) > 127
        # feet on feet, centres level, then a small shift search
        cy = (fy1 - sy1 * s) / k; cx = ((fx0 + fx1) / 2 - (sx0 + sx1) / 2 * s) / k
        for dy in range(-4, 5):
            for dx in range(-8, 9):
                ox, oy = int(round(cx + dx)), int(round(cy + dy))
                canvas = np.zeros_like(B)
                y0, x0 = max(0, oy), max(0, ox); y1, x1 = min(B.shape[0], oy + h), min(B.shape[1], ox + w)
                if y1 <= y0 or x1 <= x0: continue
                canvas[y0:y1, x0:x1] = a[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
                iou = (canvas & B).sum() / max(1, (canvas | B).sum())
                if best is None or iou > best[0]: best = (iou, s, ox * k, oy * k)
    return {'iou': float(best[0]), 's': float(best[1]), 'ox': float(best[2]), 'oy': float(best[3])}


def lab(im):
    rgb = np.asarray(im.convert('RGB'), dtype=np.float32) / 255
    rgb = np.where(rgb > 0.04045, ((rgb + 0.055) / 1.055) ** 2.4, rgb / 12.92)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = rgb @ M.T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def unlab(L):
    fy = (L[..., 0] + 16) / 116; fx = fy + L[..., 1] / 500; fz = fy - L[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f > 0.2069, f ** 3, (f - 16 / 116) / 7.787) * np.array([0.9505, 1.0, 1.089])
    M = np.array([[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]])
    rgb = np.clip(xyz @ M.T, 0, 1)
    rgb = np.where(rgb > 0.0031308, 1.055 * rgb ** (1 / 2.4) - 0.055, 12.92 * rgb)
    return (np.clip(rgb, 0, 1) * 255 + 0.5).astype(np.uint8)


def stats(im):
    L = lab(im); a = np.asarray(im.getchannel('A')) > 200
    v = L[a]; return v.mean(0), v.std(0) + 1e-3


def head_hist(im):
    a = alpha(im, 1); x0, y0, x1, y1 = bbox(a)
    hh = int((y1 - y0) * 0.13)
    crop = im.crop((x0, y0, x1, y0 + hh)).convert('RGBA')
    hsv = np.asarray(crop.convert('RGB').convert('HSV'), dtype=np.float32); m = np.asarray(crop.getchannel('A')) > 200
    h, _ = np.histogramdd(hsv[m][:, :2], bins=(12, 6), range=((0, 256), (0, 256)))
    h = h.ravel(); return h / max(1, h.sum())


def corr(p, q):
    p = p - p.mean(); q = q - q.mean(); return float((p * q).sum() / np.sqrt((p * p).sum() * (q * q).sum() + 1e-9))


def small(im, k=6):
    return np.asarray(im.resize((im.width // k, im.height // k)).convert('RGBa'), dtype=np.float32)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('name'); ap.add_argument('--fps', type=float, default=20)
    ap.add_argument('--n', type=int, default=0, help='frames per segment (0: from the amount of motion)')
    ap.add_argument('--first', type=int, default=None); ap.add_argument('--last', type=int, default=None)
    ap.add_argument('--keys', help='override the keyframes, comma separated (a frame name, ~ for mirrored)')
    ap.add_argument('--wire', help='how the segments are wired: a>b,b>c (default: from the keyframes)')
    ap.add_argument('--noalias', action='store_true')
    ap.add_argument('--pair', choices=['step', 'in'], help="a pair painting's run: between two pairs, or into one from the two standing")
    a = ap.parse_args()
    d = os.path.join(ROOT, 'art/review/ludo', a.name)
    job = json.load(open(os.path.join(d, 'job.json'))); spec = job['spec']
    keys = a.keys.split(',') if a.keys else [k for k in (spec['a'], spec.get('mid'), spec.get('b')) if k]
    S = sprites()
    files = sorted(glob.glob(os.path.join(d, 'up/f*.png')))
    frames = [Image.open(f).convert('RGBA') for f in files]
    lo = a.first or 0; hi = a.last if a.last is not None else len(frames) - 1
    srcs = []
    for k in keys:
        mir = k.endswith('~'); kk = k.rstrip('~')
        im, m = load_key(kk, S)
        if mir != bool(m.get('facesLeft')): im = im.transpose(Image.FLIP_LEFT_RIGHT); m = mirror_meta(m, im)  # (as scripts/ludo.py sent it: facing right)
        srcs.append((kk + ('~' if mir else ''), im, m))
    # where each keyframe is in the run: the frame nearest its painting (the first at the start, the last at the end)
    sm = [small(f) for f in frames]
    def nearest(im, rng):
        """The frame whose outline best matches the painting's (scaled to the frame's height, feet and centre aligned)."""
        A = alpha(im, 1); ax0, ay0, ax1, ay1 = bbox(A)
        best = None
        for i in rng:
            B = alpha(frames[i], 8); bx0, by0, bx1, by1 = bbox(B)
            s = (by1 - by0) / (ay1 - ay0)
            a = np.asarray(Image.fromarray((A[ay0:ay1, ax0:ax1] * 255).astype(np.uint8)).resize((max(1, round((ax1 - ax0) * s)), by1 - by0))) > 127
            # both outlines on one canvas, feet on the same line, centred
            W = max(a.shape[1], bx1 - bx0) + 4; H = by1 - by0
            ca = np.zeros((H, W), bool); cb = np.zeros((H, W), bool)
            ca[:, (W - a.shape[1]) // 2:(W - a.shape[1]) // 2 + a.shape[1]] = a
            cb[:, (W - (bx1 - bx0)) // 2:(W - (bx1 - bx0)) // 2 + (bx1 - bx0)] = B[by0:by1, bx0:bx1]
            iou = (ca & cb).sum() / max(1, (ca | cb).sum())
            if best is None or iou > best[0]: best = (iou, i)
        return best[1]
    at, fits = [], []
    for j, (k, im, m) in enumerate(srcs):
        i = lo if j == 0 else hi if j == len(srcs) - 1 else None
        f = fit(im, frames[i]) if i is not None else None
        if 0 < j < len(srcs) - 1:  # the middle keyframe: the frame most like it, then fitted there
            i = nearest(im, range(lo + 3, hi - 2)); f = fit(im, frames[i])
        at.append(i); fits.append(f)
    # the motion between consecutive frames, and the still ends of each segment dropped
    step = [0.0] + [float(np.abs(sm[i] - sm[i - 1]).mean()) for i in range(1, len(frames))]
    report = {'keys': [s[0] for s in srcs], 'at': at, 'fits': fits, 'segments': []}
    wires = a.wire.split(',') if a.wire else [f'{srcs[j][0]}>{srcs[j + 1][0]}' for j in range(len(srcs) - 1)]
    C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))
    prefix = f'pair_lu_{a.name}_' if a.pair else f'alan_lu_{a.name}_'
    C['candidates'] = [c for c in C['candidates'] if not c['id'].startswith(prefix)]
    sheet = []
    for j in range(len(srcs) - 1):
        (ka, ima, ma), (kb, imb, mb) = srcs[j], srcs[j + 1]
        i0, i1 = at[j], at[j + 1]
        thr = 0.15 * max(step[i0 + 1:i1 + 1] or [1])
        while i0 < i1 - 1 and step[i0 + 1] < thr: i0 += 1      # still frames after the start
        while i1 > i0 + 1 and step[i1] < thr: i1 -= 1          # ...and before the end
        cum = np.cumsum([0] + step[i0 + 1:i1 + 1]); cum = cum / max(cum[-1], 1e-6)
        motion = float(sum(step[i0 + 1:i1 + 1]))           # how much changes across the segment (pixel units)
        n = a.n or int(np.clip(round(motion / MOTION_PER_FRAME), 4, 10))
        picks = []
        for q in range(1, n + 1):
            t = q / (n + 1); idx = i0 + int(np.searchsorted(cum, t)); idx = min(max(idx, i0 + 1), i1 - 1)
            if idx not in picks: picks.append(idx)
        sa, sb = stats(ima), stats(imb)
        ha = head_hist(ima)
        ids, segrep = [], []
        hk = lambda m, f: (m['fy'] - m['top']) * f['s']   # painted height in Ludo pixels
        for q, idx in enumerate(picks):
            t = float(cum[idx - i0]) if idx - i0 < len(cum) else 1.0
            F = {k: fits[j][k] * (1 - t) + fits[j + 1][k] * t for k in ('s', 'ox', 'oy')}
            m = ma if t < 0.5 else mb
            fr = frames[idx]
            # colour: toward the paintings' (Lab mean and spread, interpolated)
            mu, sd = stats(fr); tmu = sa[0] * (1 - t) + sb[0] * t; tsd = sa[1] * (1 - t) + sb[1] * t
            drift = float(np.linalg.norm(mu - tmu))
            L = lab(fr); L = (L - mu) / sd * tsd + tmu
            rgb = unlab(L); out = Image.fromarray(np.dstack([rgb, np.asarray(fr.getchannel('A'))]), 'RGBA')
            head = corr(head_hist(out), ha)
            bx = out.getbbox(); pad = 4
            x0, y0 = max(0, bx[0] - pad), max(0, bx[1] - pad); x1, y1 = min(out.width, bx[2] + pad), min(out.height, bx[3] + pad)
            crop = out.crop((x0, y0, x1, y1))
            # anchors: the painting's own, carried through the fit (interpolated between the two keyframes)
            axa, axb = ma['ax'] * fits[j]['s'] + fits[j]['ox'], mb['ax'] * fits[j + 1]['s'] + fits[j + 1]['ox']
            fya, fyb = ma['fy'] * fits[j]['s'] + fits[j]['oy'], mb['fy'] * fits[j + 1]['s'] + fits[j + 1]['oy']
            ha_, hb_ = ma['h'] * fits[j]['s'], mb['h'] * fits[j + 1]['s']
            meta = {'w': float(crop.width), 'hh': float(crop.height), 'h': round(ha_ * (1 - t) + hb_ * t, 1),
                    'ax': round(axa * (1 - t) + axb * t - x0, 1), 'fy': round(fya * (1 - t) + fyb * t - y0, 1), 'top': float(max(0, bx[1] - y0))}
            if m.get('facesLeft'): meta['facesLeft'] = True
            if 'px' in ma and 'px' in mb:  # a pair: the partner's feet too, carried the same way; drawn as a pair painting
                pxa, pxb = ma['px'] * fits[j]['s'] + fits[j]['ox'], mb['px'] * fits[j + 1]['s'] + fits[j + 1]['ox']
                pfa, pfb = ma['pfy'] * fits[j]['s'] + fits[j]['oy'], mb['pfy'] * fits[j + 1]['s'] + fits[j + 1]['oy']
                meta.update(px=round(pxa * (1 - t) + pxb * t - x0, 1), pfy=round(pfa * (1 - t) + pfb * t - y0, 1), rigid=True)
            # height: his figure's height in game units, against the two keyframes' (a pop in size shows here)
            gh = (bx[3] - bx[1]) / meta['h']
            gha = (alpha(ima, 1).any(1).sum()) / ma['h']; ghb = (alpha(imb, 1).any(1).sum()) / mb['h']
            hdev = float(abs(gh - (gha * (1 - t) + ghb * t)) / max(gha, ghb))
            seg = 'abcdefgh'[j]
            cid = f'{prefix}{seg}{q + 1:02d}'
            crop.save(os.path.join(CAND, cid + '.webp'), 'WEBP', quality=90, method=6, exact=True)
            flags = [x for x, bad in (('drift', drift > LIMITS['drift']), ('head', head < LIMITS['head']), ('height', hdev > LIMITS['height'])) if bad]
            segrep.append({'id': cid, 'frame': idx, 't': round(t, 3), 'drift': round(drift, 1), 'head': round(head, 3), 'height': round(hdev, 3), 'flags': flags, 'meta': meta})
            ids.append(cid); sheet.append(crop)
        w = wires[j]
        report['segments'].append({'motion': round(motion, 2), 'wire': w, 'from': at[j], 'to': at[j + 1], 'used': [i0, i1], 'frames': segrep})
        # wiring: the whole run for this change (played backwards for the way back), at its own frame rate
        wire = {'inbetween': {w: ids}, 'ibFps': {w: a.fps}}
        if a.pair == 'step': wire = {'pairRun': {w: ids}, 'pairRunFps': {w: a.fps}}
        elif a.pair == 'in': k = w.split('>')[1]; wire = {'pairRunIn': {k: ids}, 'pairRunFps': {'in:' + k: a.fps}}
        elif not a.noalias and w.startswith('alan_side>'):
            # his second standing painting is the same stance: the same run serves it
            wire['inbetween']['alan_idle2>' + w.split('>')[1]] = ids; wire['ibFps']['alan_idle2>' + w.split('>')[1]] = a.fps
        for k, (cid, r) in enumerate(zip(ids, segrep)):
            C['candidates'].append({'id': cid, 'char': 'alan', 'phase': 4, 'kind': 'ludo', 'what': f'Ludo in-between {w} ({k + 1} of {len(ids)})',
                                    'src': f'art/review/candidates/{cid}.webp',
                                    'originals': [(f'art/review/ludo/keys/{x[5:]}.png' if x.startswith('file:') else f'art/sprites/{x.rstrip("~")}.webp') for x in (ka, kb)],
                                    'meta': r['meta'], 'wire': wire,
                                    'consistency': {x: r[x] for x in ('drift', 'head', 'height', 'flags')}})
    json.dump(report, open(os.path.join(d, 'fit.json'), 'w'), indent=1)
    json.dump(C, open(os.path.join(ROOT, 'art/review/candidates.json'), 'w'), indent=1)
    for seg in report['segments']:
        print(seg['wire'], 'motion', seg['motion'], 'frames', seg['used'], '->', len(seg['frames']), 'picked;',
              'flags:', [(f['id'][-3:], f['flags']) for f in seg['frames'] if f['flags']] or 'none')
        print('   drift', [f['drift'] for f in seg['frames']], 'head', [f['head'] for f in seg['frames']], 'height', [f['height'] for f in seg['frames']])
    print('fits', [(round(f['iou'], 3), round(f['s'], 3)) for f in fits], 'at', at)


if __name__ == '__main__':
    main()
