# Cuts painted character frames out of their white backgrounds.
#   python3 scripts/matte.py <png dir> art/sprites
# Every frame of a character is scaled by the same factor (taken from the
# character's standing frame), so crouching, reaching or raised-arm poses keep
# their true size instead of being stretched to full height. Results are merged
# into js/sprites.js.
import sys, glob, json, os, re
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, dst = sys.argv[1], sys.argv[2]
js = os.path.join(os.path.dirname(os.path.abspath(dst.rstrip('/'))), '..', 'js', 'sprites.js')
meta = {}
if os.path.exists(js):
    txt = open(js).read()
    meta = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
# raw standing height (px on the 1024x1536 canvas) of each character
REF = {'alan': 1407, 'ines': 1415, 'rui': 1396, 'amalia': 1438, 'tomas': 1432, 'lacerda': 1475, 'robe': 1478}
# newer characters take their reference from their own base frame (cached here)
REF_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sprite_refs.json')
if os.path.exists(REF_FILE): REF.update(json.load(open(REF_FILE)))
BASES = {'celeste': 'celeste', 'ze': 'ze', 'abilio': 'abilio', 'pessoa': 'pessoa_sleep', 'joaquim1955': 'joaquim1955'}
# frames whose attention is to the left (mirrored the other way)
FACES_LEFT = {'rui', 'rui_idle2', 'robe_talk', 'robe_read', 'lacerda_walkA', 'lacerda_walkB', 'tomas_sweepL', 'abilio', 'abilio_idle2', 'npc_washer2', 'npc_washer2_b', 'npc_mender2', 'npc_mender2_b'}
# frames anchored on the legs rather than the head (head band is cluttered by raised arms or props)
LEG_ANCHOR = {'alan_ring', 'robe_terror', 'robe_lunge', 'ines_tied_struggle', 'tomas_sweepL', 'tomas_sweepR'}
# frames with a prop reaching the floor (broom, dropped rope): the feet line is
# measured on the shoes near the body axis, not on the lowest pixel
FEET_BAND = {'tomas', 'tomas_talk', 'tomas_sweep', 'tomas_sweepL', 'tomas_sweepR', 'ines_free'}
def char_of(name):
    if name.startswith('lacerda_robe') or name.startswith('robe'): return 'robe'
    if name.startswith('npc_') or name.startswith('prop_'): return name[:-2] if name.endswith('_b') else name
    return re.split('_', name)[0]
def raw_fig_height(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.int16)
    fg = im.min(2) < 225
    rows = np.where(fg.sum(1) > 3)[0]
    return int(rows.max() - rows.min())
# measure reference heights for any base frame present in this batch
for c, base in list(BASES.items()) + [(os.path.basename(f)[:-4], os.path.basename(f)[:-4]) for f in glob.glob(os.path.join(src, 'npc_*.png')) + glob.glob(os.path.join(src, 'prop_*.png')) if not f.endswith('_b.png')]:
    p = os.path.join(src, base + '.png')
    if os.path.exists(p): REF[c] = raw_fig_height(p)
json.dump({k: v for k, v in REF.items() if k not in ('alan', 'ines', 'rui', 'amalia', 'tomas', 'lacerda', 'robe')}, open(REF_FILE, 'w'), indent=1)
for f in sorted(glob.glob(os.path.join(src, '*.png'))):
    name = os.path.basename(f)[:-4]
    if name.startswith('plate'): continue
    src_im = Image.open(f)
    keyed = np.asarray(src_im.convert('RGBA'))[..., 3] < 128 if src_im.mode == 'RGBA' else None
    im = np.asarray(src_im.convert('RGB')).astype(np.float32)
    mn, mx = im.min(2), im.max(2)
    cand = (mn > 228) & ((mx - mn) < 22)
    lab, n = ndi.label(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    # enclosed pure-white pockets (gaps between arm and body)
    strict = (mn > 244) & ((mx - mn) < 10)
    lab2, n2 = ndi.label(strict & ~bg)
    if n2:
        sizes = ndi.sum(np.ones_like(lab2), lab2, range(1, n2 + 1))
        big = [i + 1 for i, s in enumerate(sizes) if s > 400]
        bg |= np.isin(lab2, big)
    if keyed is not None: bg |= keyed  # pre-keyed backdrop (scripts/greykey.py)
    bg = ndi.binary_opening(bg, iterations=1) | bg & ndi.binary_erosion(bg, iterations=2)
    alpha = (~bg).astype(np.float32)
    # soft edge: pixels near background get alpha from how far they are from white
    edge = ndi.binary_dilation(bg, iterations=2) & ~bg
    lum = mn
    a_edge = np.clip((255 - lum) / 70.0, 0, 1)
    alpha[edge] = np.minimum(1, a_edge[edge] * 1.15)
    alpha = ndi.gaussian_filter(alpha, 0.6) * (~bg | edge)
    # remove white fringe (un-premultiply against white)
    a3 = np.clip(alpha, 0.05, 1)[..., None]
    rgb = np.clip((im - (1 - a3) * 255) / a3, 0, 255)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.where(alpha > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    pad = 6
    y0, x0 = max(0, y0 - pad), max(0, x0 - pad); y1, x1 = min(im.shape[0] - 1, y1 + pad), min(im.shape[1] - 1, x1 + pad)
    crop = rgba[y0:y1 + 1, x0:x1 + 1]
    a = crop[..., 3] > 128
    rows = np.where(a.any(1))[0]
    top, feet = rows.min(), rows.max()
    headband = a[top: top + max(8, int((feet - top) * 0.09))]
    hx = np.where(headband.any(0))[0]
    ax = (hx.min() + hx.max()) / 2
    figh = feet - top
    if name in LEG_ANCHOR:
        band = a[top + int(figh * 0.72): top + int(figh * 0.9)]
        cols = np.where(band.any(0))[0]
        ax = (cols.min() + cols.max()) / 2
    if name in FEET_BAND:
        c0, c1 = int(max(0, ax - figh * 0.11)), int(ax + figh * 0.11)
        frows = np.where(a[:, c0:c1].any(1))[0]
        feet = frows.max()
    # one scale per character: the standing figure ends up ~720px tall
    ref = REF.get(char_of(name), figh)
    k = min(1.0, 720.0 / ref)
    out = Image.fromarray(crop, 'RGBA')
    if k < 1: out = out.resize((round(out.width * k), round(out.height * k)), Image.LANCZOS)
    out.save(os.path.join(dst, name + '.webp'), 'WEBP', quality=90, method=6)
    meta[name] = dict(w=out.width, hh=out.height, h=round(ref * k), ax=round(ax * k, 1), fy=round(feet * k, 1), top=round(top * k, 1))
    if name in FACES_LEFT: meta[name]['facesLeft'] = True
    print(name, meta[name])
for n in FACES_LEFT:
    if n in meta: meta[n]['facesLeft'] = True
meta = dict(sorted(meta.items()))
with open(js, 'w') as fh:
    fh.write('// Generated by scripts/matte.py: painted sprite frames (size, head anchor, feet line).\nwindow.SPRITES = ' + json.dumps(meta, indent=1) + ';\n')
