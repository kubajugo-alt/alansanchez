# Removes what is left of the white background around Alan's cut-outs: the pale band outside his ink outline and
# pockets of background caught in gaps (between an arm and the body, in the hair). Only pale, colourless pixels the
# transparency reaches without crossing the painting's dark outline go, so a white T-shirt inside the outline
# stays; then the soft edge pixels that are left take the colour of the paint just inside them (no white tint).
#   python3 scripts/defringe.py            -> art/review/alan/fringe/ (sheet of what would go, in red), nothing written
#   python3 scripts/defringe.py --apply    -> also rewrites the images (sprites and approved review frames)
# Run once per image (name new ones: --apply alan_walk_up1 ...): each run shaves the soft edge a little further.
import glob, json, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/alan/fringe/')
REACH = 28      # how far into the figure a pocket of background may go (px)
# painted water, foam and splashes are pale and colourless too: these frames keep only the thin rim cleaning
# background caught between an arm and the body, closed off by the outline (frame: [x, y, w, h], sprite px)
POCKETS = {'alan_rapt2': [(158, 318, 17, 59)], 'alan_enchanted1': [(163, 248, 23, 111), (170, 368, 11, 26)],
           'alan_enchanted2': [(202, 239, 25, 146), (220, 367, 9, 18)]}
NAME = ['']
WET = ('alan_wash', 'alan_drip', 'alan_swim', 'pair_wring_', 'pair_ib_wring_', 'alan_climb', 'alan_trunks_on')


def background(a):
    """Pale, low-colour, not warm (paper white or light grey, not a cream T-shirt or skin highlight)."""
    rgb = a[..., :3].astype(int); r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    return (mn > 165) & (mx - mn < 38) & (b >= r - 8) & (a[..., 3] > 0)


def fringe(a, reach_px=REACH):
    """The background pixels reachable from transparency through background only, within reach_px."""
    bg = background(a)
    free = a[..., 3] < 24
    seed = free.copy(); reach = np.zeros_like(free)
    k = np.ones((3, 3), np.uint8)
    for _ in range(reach_px):                          # a flood that only walks over background-coloured pixels
        grown = cv2.dilate(seed.astype(np.uint8), k) > 0
        new = grown & bg & ~reach & ~free
        if not new.any(): break
        reach |= new; seed = free | reach
    # a whole region is only taken if it really is a pocket or a rim: skip wide pale areas (a sleeve, a shirt in light)
    n, lab, st, _ = cv2.connectedComponentsWithStats(reach.astype(np.uint8), 8)
    keep = np.zeros_like(reach)
    for i in range(1, n):
        comp = lab == i
        if st[i, cv2.CC_STAT_AREA] > 4000: continue
        keep |= comp
    # pockets the outline closes off (checked by eye: a neutral rule would also take shirt shading and boxers)
    for x, y, w, h in POCKETS.get(NAME[0], []):
        box = np.zeros_like(keep); box[y:y + h, x:x + w] = True
        keep |= box & bg
    return keep


def clean(a, wet=False):
    a = a.copy(); f = fringe(a, 1 if wet else REACH)
    a[..., 3] = np.where(f, 0, a[..., 3])
    # the soft rim: semi-transparent edge pixels take the colour of the opaque paint next to them
    solid = a[..., 3] >= 250
    soft = (a[..., 3] > 0) & ~solid
    if soft.any():
        fill = cv2.inpaint(np.ascontiguousarray(a[..., :3]), (~solid).astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
        pale_soft = soft & (a[..., :3].min(-1) > 150)
        a[..., :3] = np.where(pale_soft[..., None], fill, a[..., :3])
    # the new edge gets the same one-pixel softening as the rest of the outline
    al = a[..., 3].astype(np.float32)
    edge = cv2.dilate(f.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    a[..., 3] = np.where(edge, cv2.GaussianBlur(al, (3, 3), 0.6), al).astype(np.uint8)
    return a, f


def images():
    only = [a for a in sys.argv[1:] if not a.startswith('--')]  # named files only (a second run on a treated file would treat it again)
    out = sorted(glob.glob(f'{ROOT}/art/sprites/alan_*.webp') + glob.glob(f'{ROOT}/art/sprites/pair_*.webp'))
    c = json.load(open(f'{ROOT}/art/review/candidates.json'))['candidates']
    out += [os.path.join(ROOT, x['src']) for x in c if x.get('src') and (x['id'].startswith('alan_') or x['id'].startswith('pair_'))]
    if only: out = [o for o in out if any((o[1] if isinstance(o, tuple) else o).endswith(n + '.webp') or (o[1] if isinstance(o, tuple) else o).endswith(n) for n in only)]
    return out


def main():
    apply = '--apply' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    rows = []
    for p in images():
        a = np.asarray(Image.open(p).convert('RGBA'))
        NAME[0] = os.path.basename(p)[:-5]
        b, f = clean(a, os.path.basename(p).startswith(WET))
        if f.sum() < 15: continue
        rows.append((os.path.relpath(p, ROOT), int(f.sum())))
        if apply: Image.fromarray(b, 'RGBA').save(p, lossless=True, quality=100)
        else:
            bg = Image.new('RGBA', (a.shape[1], a.shape[0]), (40, 44, 58, 255)); bg.alpha_composite(Image.fromarray(a))
            hl = np.asarray(bg.convert('RGB')).copy(); hl[f] = [255, 0, 0]
            af = Image.new('RGBA', (a.shape[1], a.shape[0]), (40, 44, 58, 255)); af.alpha_composite(Image.fromarray(b))
            sheet = Image.fromarray(np.concatenate([hl, np.asarray(af.convert('RGB'))], 1))
            sheet.save(OUT + os.path.basename(p).replace('.webp', '.png'))
    json.dump(rows, open(OUT + 'list.json', 'w'), indent=0)
    print(len(rows), 'images' + (' cleaned' if apply else ' with background left'), sum(r[1] for r in rows), 'px')


if __name__ == '__main__':
    main()
