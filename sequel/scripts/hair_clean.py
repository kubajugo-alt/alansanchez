#!/usr/bin/env python3
"""The light leftovers of the painting's background taken out of Alan's hair (the user, 2026-10-29: "remove the white
leftovers of the background from Alan's hair gaps").

  python3 sequel/scripts/hair_clean.py [frame ...]     cleaned copies + review sheet (the game is not touched)
  python3 sequel/scripts/hair_clean.py install         copies the reviewed copies over art/sprites/ (after approval)

Default frames: every Alan sprite the game uses now (js/story/core.js `still()`): alanv_/alanb_ side_k, front_k,
back_k and their Ludo walk cycles (window.LUDO runs alanv_walk_* / alanb_walk_*). Writes art/review/hair_clean/
<frame>.webp (only the frames that changed; same size, WEBP q90 like ludo_install.py), report.json (pixels changed per
frame) and sheet.jpg (each changed frame's head, before and after, 3x, on (40,40,40) and on (128,128,128)).

Only the hair is touched (the top of the figure, within a few px of dark hair; the navy blazer and skin are not hair):
  1. Leftovers: groups of light, grey-white pixels (bright, low colour spread) next to the hair. A group that touches
     the transparent outside is background caught along the hair's edge; a group with no outside contact is taken only
     when it is near-white, small and ringed by dark hair (a pocket between curls). Any group that borders skin is left
     (eyes, teeth). Taken pixels become transparent.
  2. Fringe: what is left on the hair's outer edge (touching the outside or a taken pixel) and still lighter than the
     hair beside it is read as hair mixed with background: its alpha comes down by the background's share and its
     colour becomes the neighbouring hair's. Two passes (a fringe is about two px wide).
Painted highlights sit inside the hair (dark on both sides, no outside contact) and are mid grey, not near-white, so
they are left; when in doubt, a pixel is left.
"""
import glob, json, os, re, shutil, sys
import cv2, numpy as np
from PIL import Image, ImageDraw

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(SEQ, 'art/sprites')
OUT = os.path.join(SEQ, 'art/review/hair_clean')

HEAD = 0.21          # the head region: the top 21% of the figure's height
HAIR_L, LIGHT_L = 95, 130   # luma: hair is darker than HAIR_L; a leftover is at least LIGHT_L
SPREAD = 42          # a leftover's colour spread (max - min channel) at most this: grey/white, not skin
PEAK = 170           # a leftover's brightest pixel at least this (pale to white)
MAX_PX = 80          # a leftover group at most this many px (bigger light areas are something painted)
EDGE = 5             # a group this close (px) to the transparent outside is the edge's background
POCKET = 215         # deeper in, only a near-white group fully ringed by hair counts (a gap between curls)
BG_L = 240.0         # the background's luma, for the fringe's mix
K8 = np.ones((3, 3), np.uint8)


def frames():
    names = [f'{p}_{v}_k' for p in ('alanv', 'alanb') for v in ('side', 'front', 'back')]
    for p in ('alanv', 'alanb'):
        for v in ('side', 'front', 'back'):
            names += sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(SPR, f'{p}_walk_{v}_[0-9][0-9].webp')))
    return [n for n in names if os.path.exists(os.path.join(SPR, n + '.webp'))]


def local_mean(val, mask, r):
    k = (2 * r + 1, 2 * r + 1)
    s = cv2.boxFilter(val * mask, -1, k, normalize=False, borderType=cv2.BORDER_CONSTANT)
    n = cv2.boxFilter(mask, -1, k, normalize=False, borderType=cv2.BORDER_CONSTANT)
    return s / np.maximum(n, 1e-6), n


def clean(im):
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    rgb, A = a[..., :3], a[..., 3]
    H, W = A.shape
    ys = np.nonzero((A > 0).any(1))[0]
    top, bot = ys[0], ys[-1]
    rows = np.zeros((H, W), bool); rows[top:top + int((bot - top) * HEAD)] = True
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    L = 0.299 * r + 0.587 * g + 0.114 * b
    mx, mn = rgb.max(-1), rgb.min(-1)
    hair = rows & (A >= 160) & (L < HAIR_L) & (b < r + 15)                       # dark, not navy
    skin = (A >= 160) & (r - b > 45) & (L >= 70)
    out = A < 64
    zone = rows & (cv2.dilate(hair.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))) > 0)
    light = zone & (A >= 64) & (L >= LIGHT_L) & (mx - mn <= SPREAD)
    dist = cv2.distanceTransform((~out).astype(np.uint8), cv2.DIST_L2, 3)        # px from the transparent outside
    take = np.zeros((H, W), bool); kinds = []
    n, lab, st, _ = cv2.connectedComponentsWithStats(light.astype(np.uint8), connectivity=8)
    for i in range(1, n):
        x, y, w, h, sz = st[i]
        if sz > MAX_PX: continue
        y0, x0 = max(0, y - 1), max(0, x - 1); win = np.s_[y0:y + h + 1, x0:x + w + 1]   # the group and its ring
        c = lab[win] == i
        ring = (cv2.dilate(c.astype(np.uint8), K8) > 0) & ~c
        k, peak = ring.sum(), mx[win][c].max()
        if not k or peak < PEAK or (skin[win] & ring).sum() > 0.1 * k: continue
        if (hair[win] | out[win])[ring].mean() < 0.6: continue                      # not among the hair
        if dist[win][c].min() <= EDGE: take[win] |= c; kinds.append('edge')         # along the hair's outer edge
        elif peak >= POCKET and (hair[win] & ring).sum() >= 0.8 * k: take[win] |= c; kinds.append('pocket')  # ringed by hair
    A2, rgb2 = A.copy(), rgb.copy()
    # hair colour beside each pixel (for the taken pixels' hidden colour and the fringe)
    hm = hair.astype(np.float32)
    hc = np.stack([local_mean(rgb[..., j], hm, 3)[0] for j in range(3)], -1)
    hL, hn = local_mean(L, hm, 2)
    A2[take] = 0; rgb2[take] = hc[take]
    gone = out | take
    for _ in range(2):
        edge = (cv2.dilate(gone.astype(np.uint8), K8) > 0) & ~gone
        f = edge & zone & (A2 > 0) & ~hair & ~skin & (mx - mn <= SPREAD + 8) & (hn > 0) & (L > hL + 30)
        mix = np.clip((L - hL) / np.maximum(BG_L - hL, 1), 0, 1)
        A2[f] = A2[f] * (1 - mix[f]); rgb2[f] = hc[f]
        gone = gone | (f & (A2 < 64))
    o = np.dstack([rgb2, A2]).round().clip(0, 255).astype(np.uint8)
    a8 = np.asarray(im.convert('RGBA'))
    changed = (o[..., 3] != a8[..., 3]) | ((o[..., :3] != a8[..., :3]).any(-1) & (o[..., 3] > 0))
    return Image.fromarray(o), int(changed.sum()), int(take.sum()), int((changed & ~take).sum()), (top, bot), kinds


def head(im, box):
    c = im.crop(box)
    tiles = []
    for bg in ((40, 40, 40), (128, 128, 128)):
        t = Image.new('RGBA', c.size, bg + (255,)); t.alpha_composite(c)
        tiles.append(t.convert('RGB').resize((c.width * 3, c.height * 3), Image.NEAREST))
    return tiles


def sheet(rows, path):
    """rows: (name, before, after, count, box). Per row: before|after on dark, before|after on mid grey."""
    tiles = [(n, head(b, box), head(a, box), k) for n, b, a, k, box in rows]
    th = max(t[1][0].height for t in tiles) + 22
    tw = max(t[1][0].width for t in tiles)
    per = 2                                                     # two sprites side by side
    rw = 4 * tw + 3 * 6
    S = Image.new('RGB', (per * rw + (per - 1) * 30 + 20, ((len(tiles) + per - 1) // per) * th + 30), (20, 20, 20))
    d = ImageDraw.Draw(S)
    d.text((10, 6), 'hair_clean: before | after on (40,40,40), then before | after on (128,128,128); 3x', fill=(220, 220, 220))
    for i, (n, bt, at, k) in enumerate(tiles):
        x0, y0 = 10 + (i % per) * (rw + 30), 26 + (i // per) * th
        d.text((x0, y0), f'{n}: {k} px changed', fill=(230, 200, 120))
        for j, t in enumerate((bt[0], at[0], bt[1], at[1])):
            S.paste(t, (x0 + j * (tw + 6), y0 + 14))
    S.save(path, quality=90)


def run(names):
    os.makedirs(OUT, exist_ok=True)
    rep, rows = {}, []
    for nm in names:
        im = Image.open(os.path.join(SPR, nm + '.webp')).convert('RGBA')
        new, k, taken, fringe, (top, bot), kinds = clean(im)
        rep[nm] = {'changed': k, 'taken': taken, 'fringe': fringe, 'edge_groups': kinds.count('edge'), 'pockets': kinds.count('pocket')}
        dst = os.path.join(OUT, nm + '.webp')
        if k:
            new.save(dst, 'WEBP', quality=90, method=6)
            al = np.asarray(im)[..., 3]; cols = np.nonzero((al[top:top + int((bot - top) * HEAD)] > 0).any(0))[0]
            rows.append((nm, im, new, k, (int(cols[0]) - 4, max(0, top - 4), int(cols[-1]) + 5, top + int((bot - top) * HEAD))))
        elif os.path.exists(dst): os.remove(dst)
        print(f'{nm}: {k} px changed ({taken} taken, {fringe} fringe; groups: {kinds.count("edge")} edge, {kinds.count("pocket")} pocket)')
    old = {}
    rp = os.path.join(OUT, 'report.json')
    if os.path.exists(rp) and set(names) != set(frames()): old = json.load(open(rp))
    old.update(rep)
    json.dump(old, open(rp, 'w'), indent=1)
    if rows: sheet(rows, os.path.join(OUT, 'sheet.jpg'))
    print(f'{len(rows)} of {len(names)} frames changed, {sum(v["changed"] for v in rep.values())} px; sheet {OUT}/sheet.jpg')


def install():
    done = 0
    for f in sorted(glob.glob(os.path.join(OUT, '*.webp'))):
        nm = os.path.basename(f)
        if not re.match(r'alan[vb]_', nm) or not os.path.exists(os.path.join(SPR, nm)): continue
        shutil.copyfile(f, os.path.join(SPR, nm)); done += 1
    print(f'{done} sprites replaced in art/sprites/. The side frames\' face patches (art/faces/, box in js/faces.js) '
          'cover hair: run scripts/face_from_game1.py again.')


if __name__ == '__main__':
    if sys.argv[1:2] == ['install']: install()
    else: run(sys.argv[1:] or frames())
