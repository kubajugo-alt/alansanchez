# Makes Alan's leather jacket the same colour in every frame: the muted brown of the side/walk set.
#   python3 scripts/recolour_jacket.py                 -> art/review/alan/colour/ (proposals + before/after sheet)
#   python3 scripts/recolour_jacket.py --apply         -> also overwrites art/sprites/<frame>.webp
# Only leather pixels move (brown, saturated, not skin-bright), by a Lab mean/spread transfer toward the
# reference set, feathered at the mask edge. Skin, denim, the T-shirt and the outlines are left alone.
import json, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/alan/colour')
# the jacket colour the user chose (less saturated): the side / walk / talk set
REF = ['alan_side', 'alan_idle2', 'alan_talk', 'alan_talk2', 'alan_walkA', 'alan_walkB', 'alan_pass', 'alan_read',
       'alan_write', 'alan_smoke_hold', 'alan_drink', 'alan_phone']
# the warmer, more saturated set
WARM = ['alan_front', 'alan_front_walk1', 'alan_front_walk2', 'alan_back', 'alan_back_walk1', 'alan_back_walk2',
        'alan_flirt', 'alan_wink', 'alan_fluster', 'alan_swoon', 'alan_button', 'alan_coffees', 'alan_enchanted1',
        'alan_enchanted2', 'alan_rapt1', 'alan_rapt2', 'alan_rapt3', 'alan_lantern', 'alan_lwalk1', 'alan_lwalk2',
        'alan_yawn', 'alan_stretch', 'alan_undress1', 'alan_undress2', 'alan_dress3', 'alan_dress4']


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
    return cv2.GaussianBlur(keep.astype(np.float32), (5, 5), 1.2)


def lab_stats(frames):
    px = []
    for k in frames:
        a = load(k); m = leather(a) > 0.5
        px.append(cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)[m])
    px = np.concatenate(px); return px.mean(0), px.std(0)


def recolour(a, ref_mu, ref_sd):
    m = leather(a); sel = m > 0.5
    lab = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)
    mu, sd = lab[sel].mean(0), lab[sel].std(0)
    k = np.clip(ref_sd / np.maximum(sd, 1e-3), 0.75, 1.25)
    k[0] = 1.0                                   # keep the painted light and shade of each frame
    new = (lab - mu) * k + ref_mu
    new[..., 0] = lab[..., 0] + (ref_mu[0] - mu[0])  # lightness: shift only
    out = np.clip(lab + (new - lab) * m[..., None], 0, 255).astype(np.uint8)
    a = a.copy(); a[..., :3] = cv2.cvtColor(out, cv2.COLOR_LAB2RGB); return a, mu


def main():
    os.makedirs(OUT, exist_ok=True)
    ref_mu, ref_sd = lab_stats(REF)
    rows, report = [], {}
    for k in WARM:
        a = load(k); b, mu = recolour(a, ref_mu, ref_sd)
        Image.fromarray(b, 'RGBA').save(os.path.join(OUT, f'{k}.webp'), lossless=True)
        report[k] = {'leather_before_Lab': [round(float(x), 1) for x in mu],
                     'after_Lab': [round(float(x), 1) for x in ref_mu]}
        rows.append((k, a, b))
        if '--apply' in sys.argv:
            Image.fromarray(b, 'RGBA').save(os.path.join(ROOT, f'art/sprites/{k}.webp'), lossless=True)
    json.dump({'reference_frames': REF, 'reference_leather_Lab': [round(float(x), 1) for x in ref_mu], 'frames': report},
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
    sheet.save(os.path.join(OUT, 'jacket_before_after.jpg'), quality=88)
    print('reference leather Lab', [round(float(x), 1) for x in ref_mu], '| frames', len(rows))


if __name__ == '__main__':
    main()
