#!/usr/bin/env python3
"""Game I's natural mouths for everyone (scripts/mouth_swaps.py there, made for alan_side), worked out from each face's
landmarks instead of by hand (the user, 2026-10-29: "we had a great solution for very natural blending of the mouth
with the face... I want the solutions to be replicated").

  python3 sequel/scripts/face_jaw.py [who ...]     (default: everyone in scripts/face_kit.py's WHO)

For each shape, the figure's own painted lower jaw moves down as far as Gemini's painting of that shape drops the chin
(a face in profile swings it about the hinge below the ear, as Game I; a face turned towards us pulls it straight
down, fading out at the cheeks); the old lips are painted out first; then only Gemini's lips and open mouth go on top,
found where its painting differs from the moved jaw, feathered. C to F also get in-betweens at 40% and 70% open (the
jaw part way, the lower lip and teeth coming up with it), so the engine's jaw never jumps (js/engine/faces.js). Uses
the Gemini edits scripts/face_kit.py made (art/review/faces/<who>/<frame>/mouth_*.png) and keeps its eyelids.
"""
import json, os, sys
import cv2, numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SEQ, 'scripts'))
import face_kit as K

UP, BG = K.UP, np.array(K.BG, np.float32)
ss = lambda e0, e1, v: (lambda q: q * q * (3 - 2 * q))(np.clip((v - e0) / (e1 - e0), 0, 1))


def one(who):
    Wd = K.work(who); idx = json.load(open(Wd + 'index.json')); fr = idx['base']; info = idx['frames'][fr]
    head = np.asarray(Image.open(Wd + fr + '/head.png').convert('RGBA')).astype(np.float32)
    H, W = head.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    al = head[..., 3] / 255; on = head[..., :3] * al[..., None] + BG * (1 - al[..., None])
    hb = np.array(info['head'][:2], np.float32); P = lambda p: (np.array(p, np.float32) - hb) * UP
    bx, by, bw, bh = info['box']; bw *= UP; bh *= UP
    e1, e2 = P(info['eyes'][0]), P(info['eyes'][1]); nose = P(info['nose']); m1, m2 = P(info['mouth'][0]), P(info['mouth'][1])
    mc = (m1 + m2) / 2; ec = (e1 + e2) / 2
    side = 1 if nose[0] >= ec[0] else -1                       # which way the face looks
    frontal = abs(e2[0] - e1[0]) > 0.33 * bw                   # both eyes well apart: turned towards us
    lip_y = mc[1] + 0.07 * bh                                   # under the lower lip
    col = np.abs(xx - mc[0]) < 0.22 * bw
    def chin(alpha):                                            # the lowest row of the face under the mouth
        rows = np.where(((alpha > 0.5) & col & (yy > mc[1])).any(1))[0]; return float(rows.max()) if len(rows) else mc[1] + 0.3 * bh
    c0 = chin(al)
    # the jaw: below the line under the lower lip, soft at its edges; in profile, from the hinge below the ear forwards
    if frontal:
        J = ss(lip_y - 0.03 * bh, lip_y + 0.06 * bh, yy) * np.exp(-(((xx - mc[0]) / (0.55 * bw)) ** 4))
        hinge = None
    else:
        hinge = np.array([mc[0] - side * 0.62 * bw, mc[1] - 0.06 * bh])
        t = (xx - hinge[0]) * side                              # how far forward of the hinge
        line = hinge[1] + (lip_y - hinge[1]) * np.clip(t / max(1, (mc[0] - hinge[0]) * side), 0, 1.5)
        J = ss(line - 0.025 * bh, line + 0.05 * bh, yy) * ss(0, 0.18 * bw, t)
    J = cv2.GaussianBlur((J * ss(mc[1] + 0.42 * bh, mc[1] + 0.3 * bh, yy)).astype(np.float32), (0, 0), 4)   # (fading out under the chin: the neck and collar stay put)
    lips = np.zeros((H, W), np.uint8); mw = max(np.linalg.norm(m2 - m1), 0.28 * bw)
    cv2.ellipse(lips, (int(mc[0]), int(mc[1])), (int(mw * 0.62), int(mw * 0.24)), 0, 0, 360, 255, -1); lips[al < 0.8] = 0
    clean = head.copy()   # (its own colours at the outline's soft edge, not mixed with the flat background: no grey fringe)
    ip = cv2.inpaint(on.astype(np.uint8), lips, 9, cv2.INPAINT_TELEA).astype(np.float32); lm = (lips > 0)[..., None]
    clean[..., :3] = np.where(lm, ip, head[..., :3])

    def moved(f):                                               # the head with the jaw opened by f (in px at the chin, or degrees)
        if hinge is None: dx, dy = 0 * xx, f * J
        else:
            th = np.radians(f) * side; c, s = np.cos(th), np.sin(th)
            rx, ry = xx - hinge[0], yy - hinge[1]
            dx = (c * rx - s * ry + hinge[0] - xx) * J; dy = (s * rx + c * ry + hinge[1] - yy) * J
        mv = cv2.remap(clean, (xx - dx).astype(np.float32), (yy - dy).astype(np.float32), cv2.INTER_LINEAR,
                       borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        # laid over the face as it was, its outline's soft (light) halo trimmed: over the neck it showed as a white line
        ma = cv2.GaussianBlur(cv2.erode((mv[..., 3] > 235).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 1.2)
        ma = np.where(clean[..., 3] > 235, ma, mv[..., 3] / 255)[..., None]   # (over the background, its own edge as painted)
        out = clean.copy(); out[..., :3] = mv[..., :3] * ma + clean[..., :3] * (1 - ma)
        out[..., 3] = np.maximum(clean[..., 3] * (1 - ma[..., 0]) + mv[..., 3] * ma[..., 0], 0)
        return out, dx, dy
    def drop_of(f):
        if hinge is None: return f
        th = np.radians(f) * side; p = np.array([mc[0], c0]) - hinge
        return (np.sin(th) * p[0] + np.cos(th) * p[1]) - p[1]

    states = {}
    for st in 'ABCDEF':
        gp = Wd + fr + f'/mouth_{st}.png'
        if not os.path.exists(gp): continue
        g = np.asarray(Image.open(gp).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
        # Gemini's painting lined up on the face above the mouth (as the eyes and nose must not move)
        keep = ((al > 0.5) & (yy < mc[1] - 0.08 * bh)).astype(np.uint8) * 255
        w = np.eye(2, 3, dtype=np.float32)
        try: _, w = cv2.findTransformECC(K.gray(on), K.gray(g), w, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), keep, 5)
        except cv2.error: pass
        g = cv2.warpAffine(g, w, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        ring = (al > 0.9) & (yy > ec[1]) & (yy < mc[1] - 0.05 * bh) & (np.abs(xx - mc[0]) < 0.5 * bw)
        if ring.any(): g = np.clip(g + (on[ring].mean(0) - g[ring].mean(0)), 0, 255)   # Gemini's colour drift
        galpha = (np.abs(g - BG).max(-1) > 40).astype(np.float32)
        # how far the jaw drops: about half the height of the dark opening Gemini painted (the chin can't be read off the
        # outline: a neck carries on under it)
        near = (np.abs(xx - mc[0]) < 0.35 * bw) & (yy > mc[1] - 0.12 * bh) & (yy < mc[1] + 0.3 * bh) & (galpha > 0)
        dark = ((g.sum(-1) < 200) & (on.sum(-1) > 300) & near).astype(np.uint8)   # (new dark only: not a beard, hair or shirt)
        dark = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        rows = np.where(dark.any(1))[0]
        want = 0.4 * float(rows.max() - rows.min()) if len(rows) else 0.0
        if st == 'C': want = max(want, 2 * UP)
        if st in 'AB': want = min(want, 0.7 * UP)
        want = min(want, 0.055 * bh)
        f = want
        if hinge is not None:
            f = 0.0
            while drop_of(f) < want and f < 16: f += 0.25
        jaw, dx, dy = moved(f)
        # Gemini's lips and open mouth: where its painting differs from the face with the jaw moved, near the mouth
        diff = np.abs(g - (jaw[..., :3] * (jaw[..., 3:] / 255) + BG * (1 - jaw[..., 3:] / 255))).sum(-1)
        # (only the mouth: down to just under the opening, so Gemini's own chin outline, with the cut-out's light halo
        # painted into it, never comes in)
        mbot = (rows.max() + 0.035 * bh) if len(rows) else mc[1] + 0.1 * bh
        zone = (yy > nose[1] + 0.02 * bh) & (yy < mbot) & (np.abs(xx - mc[0]) < 0.5 * bw) & (galpha > 0)
        mk = cv2.morphologyEx(((diff > 70) & zone).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
        n, lab, stt, _ = cv2.connectedComponentsWithStats(mk, 8)
        if n > 1: mk = (lab == 1 + np.argmax(stt[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
        mk = cv2.dilate(mk, np.ones((13, 13), np.uint8))
        mz = cv2.GaussianBlur(mk.astype(np.float32), (0, 0), 5) * ss(nose[1], nose[1] + 0.04 * bh, yy)
        if hinge is not None:                                    # side-on: in front of the mouth, Gemini's outline wins (an open mouth is a hollow)
            for y in range(H):
                xs = np.where(mk[y])[0]
                if len(xs):
                    e = xs.max() if side < 0 else xs.min()
                    sl = slice(e, W) if side > 0 else slice(0, e + 1)
                    ramp = np.clip((xx[y, sl] - e) * side / 10, 0, 1)
                    mz[y, sl] = np.maximum(mz[y, sl], ramp * mz[y, sl].max())
        # Gemini's painting only inside the face (its own outline is a light rim on the flat background)
        inside = cv2.erode((jaw[..., 3] > 240).astype(np.uint8), np.ones((17, 17), np.uint8)).astype(np.float32)
        mz = mz * cv2.GaussianBlur(inside, (0, 0), 2)
        gr = np.dstack([g, galpha * 255])
        comp = jaw.copy(); m = mz[..., None]
        comp = gr * m + comp * (1 - m)
        states[st] = comp
        # in-betweens: the jaw part way, the lower part of the painted mouth coming up with it, the upper lip where it is
        dk = (g.sum(-1) < 180) & (mk > 0)
        if st in 'CDEF' and want >= 1.5 * UP and dk.any():
            yc = float(np.where(dk)[0].mean()); wl = np.clip((yy - yc) / 8 + 0.5, 0, 1)
            for fr_ in (0.4, 0.7):
                jaw2, dx2, dy2 = moved(f * fr_)
                back = 1 - fr_   # the lower lip sampled from where it would be at full open
                lo = cv2.remap(gr, (xx + dx * back).astype(np.float32), (yy + dy * back).astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
                mlo = cv2.remap((mz * wl).astype(np.float32), (xx + dx * back).astype(np.float32), (yy + dy * back).astype(np.float32), cv2.INTER_LINEAR)
                mlo = mlo * cv2.GaussianBlur(cv2.erode((jaw2[..., 3] > 240).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32), (0, 0), 2)
                c = jaw2.copy(); mu = (mz * (1 - wl))[..., None]
                c = gr * mu + c * (1 - mu); ml = mlo[..., None]; c = lo * ml + c * (1 - ml)
                states[f'{st}_{int(fr_ * 100)}'] = c
        print(who, st, 'jaw', round(f, 2), 'deg' if hinge is not None else 'px', 'chin drop', round(want / UP, 1), 'px', flush=True)
    return fr, info, head, states


def save(who, fr, info, head, states):
    H, W = head.shape[:2]; hb = info['head']
    R = np.zeros((H, W), np.float32)
    for c in states.values(): R = np.maximum(R, (np.abs(c - head).max(-1) > 12).astype(np.float32))
    ys, xs = np.where(cv2.dilate(R.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0)
    if not len(xs): return None
    bx0, by0 = int(np.floor(xs.min() / UP)), int(np.floor(ys.min() / UP)); bx1, by1 = int(np.ceil((xs.max() + 1) / UP)), int(np.ceil((ys.max() + 1) / UP))
    spr = Image.open(K.sprite(fr)).convert('RGBA')
    sx, sy, bw, bh = hb[0] + bx0, hb[1] + by0, bx1 - bx0, by1 - by0
    for st, c in states.items():
        big = np.zeros((bh * UP, bw * UP, 4), np.float32)
        y0, x0 = max(0, by0 * UP), max(0, bx0 * UP); src = c[y0:by1 * UP, x0:bx1 * UP]
        big[y0 - by0 * UP:y0 - by0 * UP + src.shape[0], x0 - bx0 * UP:x0 - bx0 * UP + src.shape[1]] = src
        Image.fromarray(np.clip(big, 0, 255).astype(np.uint8), 'RGBA').resize((bw, bh), Image.LANCZOS).save(f'{SEQ}/art/faces/{fr}_{st}.webp', lossless=True)
    return [int(sx), int(sy), bw, bh]


if __name__ == '__main__':
    whos = sys.argv[1:] or [w for w in K.WHO if w not in K.NO_MOUTH]
    data = K.faces_js()
    for who in whos:
        fr, info, head, states = one(who)
        old = data.get(fr) or {}
        box = save(who, fr, info, head, states)
        if not box: print(who, 'nothing to save'); continue
        # the eyelids were cut for face_kit's box: re-cut them for this one (both are patches over the same painting)
        ob = old.get('box')
        if ob and 'closed' in old.get('eyes', []):
            e = Image.open(f'{SEQ}/art/faces/{fr}_eyes_closed.webp').convert('RGBA')
            ne = Image.new('RGBA', (box[2], box[3])); ne.alpha_composite(e, (ob[0] - box[0], ob[1] - box[1])) if ob[0] >= box[0] and ob[1] >= box[1] else None
            if not (ob[0] >= box[0] and ob[1] >= box[1]):  # (the old box reaches outside: paste what fits)
                big = Image.new('RGBA', (max(box[0] + box[2], ob[0] + ob[2]) - min(box[0], ob[0]), max(box[1] + box[3], ob[1] + ob[3]) - min(box[1], ob[1])))
                big.alpha_composite(e, (ob[0] - min(box[0], ob[0]), ob[1] - min(box[1], ob[1])))
                ne = big.crop((box[0] - min(box[0], ob[0]), box[1] - min(box[1], ob[1]), box[0] - min(box[0], ob[0]) + box[2], box[1] - min(box[1], ob[1]) + box[3]))
            ne.save(f'{SEQ}/art/faces/{fr}_eyes_closed.webp', lossless=True)
        data[fr] = {'box': box, 'mouths': sorted(states), 'eyes': old.get('eyes', []), 'ok': True, 'who': who, 'from': 'jaw'}
    K.write_faces(data)
