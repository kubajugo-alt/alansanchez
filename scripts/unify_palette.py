# Makes Alan's clothes the same colour in every frame: the muted leather and denim of the side/walk set.
#   python3 scripts/unify_palette.py                 -> art/review/alan/colour/ (proposals + before/after sheet)
#   python3 scripts/unify_palette.py --apply         -> also overwrites art/sprites/<frame>.webp
#   add --pairs to include the shared frames (only Alan's side of each picture is touched)
# Only leather (jacket, boots, belt) and denim pixels move, by a Lab mean/spread transfer toward the
# reference set, feathered at the mask edge. Skin, the T-shirt and the outlines are left alone. A frame is
# only touched when a material is visibly off (lightness > 3 or colour > 2 Lab units from the reference).
import json, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/alan/colour')
# the jacket colour the user chose (less saturated): the side / walk / talk set
REF = ['alan_side', 'alan_idle2', 'alan_talk', 'alan_talk2', 'alan_walkA', 'alan_walkB', 'alan_pass', 'alan_read',
       'alan_write', 'alan_smoke_hold', 'alan_drink', 'alan_phone']
# every solo frame where he wears the jacket or jeans (close-ups and towel frames have neither)
WARM = ['alan_walkDown', 'alan_walkUp', 'alan_asleep', 'alan_back', 'alan_coffees', 'alan_cutpalm', 'alan_dress1', 'alan_dress2',
        'alan_pickup', 'alan_pull', 'alan_untie', 'alan_reach', 'alan_ring', 'alan_throw1', 'alan_throw2', 'alan_wobble',
        'alan_wring', 'alan_smoke_light', 'alan_smoke_inhale', 'alan_smoke_exhale', 'alan_undress3', 'alan_undress4',
        'alan_talk2', 'alan_read', 'alan_write', 'alan_drink', 'alan_phone', 'alan_idle2', 'alan_pass',
        'alan_jacket', 'alan_jacket_grin', 'alan_jacket_wink', 'alan_fling', 'alan_jump',
'alan_front', 'alan_front_walk1', 'alan_front_walk2', 'alan_back', 'alan_back_walk1', 'alan_back_walk2',
        'alan_flirt', 'alan_wink', 'alan_fluster', 'alan_swoon', 'alan_button', 'alan_coffees', 'alan_enchanted1',
        'alan_enchanted2', 'alan_rapt1', 'alan_rapt2', 'alan_rapt3', 'alan_lantern', 'alan_lwalk1', 'alan_lwalk2',
        'alan_yawn', 'alan_stretch', 'alan_undress1', 'alan_undress2', 'alan_dress3', 'alan_dress4']
WARM = list(dict.fromkeys(WARM))


# frames with bare skin: tanned skin in shadow is the same colour as the leather, so the leather fix is
# limited to boxes round the jacket / towel / boots (fractions of the frame: x0, y0, x1, y1)
BOXES = {'alan_jacket': [(0, .43, 1, .66)], 'alan_jacket_grin': [(0, .44, 1, .68)], 'alan_jacket_wink': [(0, .43, 1, .64)],
         'alan_fling': [(.25, .44, 1, .68)], 'alan_jump': [(.45, .54, 1, .80)],
         'alan_undress2': [(.55, .08, 1, .43), (0, .9, 1, 1)], 'alan_undress3': [(.45, .12, .75, .33), (0, .9, 1, 1)],
         'alan_undress4': [(.65, .30, 1, .60)], 'alan_dress1': [(.5, .32, .95, .55)], 'alan_dress2': [(0, .2, .4, .55)],
         'alan_dress3': [(0, .15, .3, .55), (0, .9, 1, 1)]}
# shared frames: only Alan's side of the picture (x0, x1 as fractions of the width)
PAIRS = {'pair_brow': (.45, 1), 'pair_kiss': (.5, 1), 'pair_unbutton': (.5, 1),
         **{f'pair_cop_{k}': (.5, 1) for k in ['arm', 'belt', 'belt2', 'buttons', 'chest', 'shelf2', 'trousers', 'tshirt']},
         **{f'pair_cop_{k}': (.45, 1) for k in ['jacket', 'neck', 'shelf']},
         **{f'pair_guitar_{k}': (.5, 1) for k in ['d1', 'd2', 'h1', 'h2', 'hop', 'j0', 'j1', 'j2', 'jackets', 'lasso', 's1', 's2',
                                                   'shirtfly', 'u1', 'u2', 'undress2', 'l1', 'l2']},
         'pair_guitar_lesson': (.45, 1),
         **{f'pair_vasco_{k}': (0, .48) for k in ['card', 'catch', 'clapper', 'coffee', 'fragment', 'kiss', 'kneel', 'ladder',
                                                   'lanyard', 'shirtless', 'thumb']},
         **{f'pair_wring_{k}': (.55, 1) for k in '123'}}
WARM = list(dict.fromkeys(WARM + (list(PAIRS) if '--pairs' in sys.argv else [])))
# shared frames where Alan is shirtless: only his jeans are corrected (his skin reads as leather)
NO_LEATHER = {'pair_cop_' + k for k in ['belt', 'belt2', 'buttons', 'shelf2', 'trousers', 'tshirt']} | \
             {'pair_guitar_' + k for k in ['d1', 'd2', 'h1', 'h2', 'hop', 'lasso', 's1', 's2', 'shirtfly', 'u1', 'u2', 'undress2',
                                           'l1', 'l2']} | {'pair_vasco_shirtless'}
CUR = None  # frame being processed (for BOXES / PAIRS)


def pair_limit(keep):
    if CUR in PAIRS:
        x0, x1 = PAIRS[CUR]; W = keep.shape[1]; lim = np.zeros_like(keep); lim[:, int(x0 * W):int(x1 * W)] = 1
        keep = keep * lim
    return keep


def load(k):
    return np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{k}.webp')).convert('RGBA')).copy()


def leather(a):
    """Soft mask (0..1) of jacket leather: brown hue, saturated, darker than lit skin."""
    hsv = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2HSV).astype(np.float32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    m = (h >= 2) & (h <= 22) & (s >= 95) & (v >= 18) & (v <= 185) & (a[..., 3] > 0)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    # keep sizeable regions only (the jacket), drop specks in hair, boots' highlights, skin shadows
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 400: keep[lab == i] = 1
    keep = pair_limit(keep)
    if CUR in BOXES:
        box = np.zeros_like(keep); H, W = keep.shape
        for x0, y0, x1, y1 in BOXES[CUR]: box[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = 1
        keep = keep * box
    return cv2.GaussianBlur(keep.astype(np.float32), (5, 5), 1.2)


def denim(a):
    """Soft mask of jeans: denim blue, some saturation, not the near-black outline."""
    hsv = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2HSV).astype(np.float32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    m = (h >= 92) & (h <= 128) & (s >= 35) & (v >= 35) & (a[..., 3] > 0)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 400: keep[lab == i] = 1
    keep = pair_limit(keep)
    return cv2.GaussianBlur(keep.astype(np.float32), (5, 5), 1.2)


MATERIALS = {'leather': leather, 'denim': denim}


def lab_stats(frames, mask=leather):
    global CUR
    px = []
    for k in frames:
        CUR = k
        a = load(k); m = mask(a) > 0.5
        px.append(cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)[m])
    px = np.concatenate(px); return px.mean(0), px.std(0)


def recolour(a, ref_mu, ref_sd, mask=leather):
    m = mask(a); sel = m > 0.5
    if sel.sum() < 500: return a, None
    lab = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)
    mu = lab[sel].mean(0)
    # colour: scale a*/b* about neutral grey (128), so brown gets less red/saturated but never turns green
    new = lab.copy()
    for c in (1, 2):
        r = np.clip((ref_mu[c] - 128) / max(mu[c] - 128, 1e-3), 0.6, 1.4)
        new[..., c] = 128 + (lab[..., c] - 128) * r
    new[..., 0] = lab[..., 0] + (ref_mu[0] - mu[0])  # lightness: shift only, keeps each frame's light and shade
    out = np.clip(lab + (new - lab) * m[..., None], 0, 255).astype(np.uint8)
    a = a.copy(); a[..., :3] = cv2.cvtColor(out, cv2.COLOR_LAB2RGB); return a, mu


def main():
    os.makedirs(OUT, exist_ok=True)
    refs = {name: lab_stats(REF, fn) for name, fn in MATERIALS.items()}
    rows, report = [], {}
    global CUR
    for k in WARM:
        if '--only-pairs' in sys.argv and k not in PAIRS: continue
        CUR = k
        a = load(k); b = a; changed = {}
        for name, fn in MATERIALS.items():
            if name == 'leather' and k in NO_LEATHER: continue
            m = fn(b) > 0.5
            if m.sum() < 500: continue
            mu = cv2.cvtColor(np.ascontiguousarray(b[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)[m].mean(0)
            d = mu - refs[name][0]
            if abs(d[0]) <= 3 and abs(d[1]) <= 2 and abs(d[2]) <= 2: continue
            b, _ = recolour(b, *refs[name], mask=fn)
            changed[name] = [round(float(x), 1) for x in d]
        if not changed: continue
        Image.fromarray(b, 'RGBA').save(os.path.join(OUT, f'{k}.webp'), lossless=True)
        report[k] = changed
        rows.append((k, a, b))
        if '--apply' in sys.argv:
            Image.fromarray(b, 'RGBA').save(os.path.join(ROOT, f'art/sprites/{k}.webp'), lossless=True)
    json.dump({'reference_frames': REF, 'reference_Lab': {n: [round(float(x), 1) for x in r[0]] for n, r in refs.items()},
               'frames_changed_by (Lab offset before)': report},
              open(os.path.join(OUT, 'recolour.json'), 'w'), indent=1)
    # sheet: reference first, then before/after pairs
    th = 300; tiles = []
    def tile(a, label, col=(40, 44, 52)):
        im = Image.fromarray(a, 'RGBA'); s = th / im.height; im = im.resize((max(1, int(im.width * s)), th), Image.LANCZOS)
        bg = Image.new('RGBA', (max(im.width, 120) + 6, th + 20), col + (255,)); bg.alpha_composite(im, (3, 0))
        ImageDraw.Draw(bg).text((4, th + 4), label, fill=(235, 235, 235, 255)); return bg
    ref_tiles = [tile(load(k), 'REF ' + k[5:], (36, 60, 40)) for k in ['alan_side', 'alan_walkA', 'alan_talk']]
    pair_tiles = [[tile(a, k[5:] + ' before'), tile(b, k[5:] + ' after', (40, 52, 70))] for k, a, b in rows]
    lines = [ref_tiles] + [sum(pair_tiles[i:i + 4], []) for i in range(0, len(pair_tiles), 4)]
    W = max(sum(t.width + 4 for t in ln) for ln in lines); H = len(lines) * (th + 26)
    sheet = Image.new('RGB', (W, H), (20, 20, 20)); y = 0
    for ln in lines:
        x = 0
        for t in ln: sheet.paste(t, (x, y), t); x += t.width + 4
        y += th + 26
    sheet.save(os.path.join(OUT, 'palette_before_after.jpg'), quality=88)
    print('changed', len(rows), 'frames')


if __name__ == '__main__':
    main()
