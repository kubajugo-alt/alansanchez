#!/usr/bin/env python3
"""Build Game III's game art from its designs, and copy in what it borrows.  python3 game3/scripts/import_assets.py

Game I and Game II are read, never written; nothing in game3/ loads from their folders at run time.

- Borrowed walkers (the user, 2026-11-04: "use Alan and Vasco from Game II and Ines from Game I"): Game II's Alan in his
  vest (alanv: side, front, back and the Ludo walk cycles), Game II's Vasco (vascor), Game I's Inês (her stand, talk and
  walk frames). Their face kits (blinks, lip-sync shapes) come with them.
- The Game III cast: each approved front (art/designs/<id>_g3_front.png) cut off its green to a 720 px sprite <id>_g3.
- Rooms: art/designs/rooms/*.png, rooms/variants/*.png, the hub map and the placeholders (chart, dominoes) to
  art/bg/<id>.jpg at 1280x720; Game I's shop, bedroom and street for Lisbon (as shop, flat, rua).
- Close-ups: art/designs/stills/*.png to art/closeups/; the vèvè parts to art/closeups/veve_*.png.
- Icons: art/designs/items/*.png to art/icons/<id>.webp (192 px).
- Sound effects: Game II's audio/sfx (and its manifest).
Writes js/sprites_g3.js (all sprite metadata), js/faces.js (the borrowed face kits) and js/story/ludo.js (walk cycles).
"""
import glob, json, os, shutil, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

G3 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(G3)
G2 = os.path.join(ROOT, 'sequel')
A = lambda *p: os.path.join(G3, 'art', *p)
for d in ('bg', 'sprites', 'faces', 'icons', 'closeups'): os.makedirs(A(d), exist_ok=True)

def js_obj(path, var):
    t = open(path, encoding='utf8').read()
    i = t.index('window.%s = ' % var) + len('window.%s = ' % var)
    s = t[i:].strip()
    if s.startswith('Object.assign'): s = s[s.index('{'):s.rindex('}') + 1]
    else: s = s.rstrip(';')
    return json.loads(s)

def load_all_sprites(folder):
    out = {}
    for f in glob.glob(os.path.join(folder, 'js', 'sprites*.js')):
        t = open(f, encoding='utf8').read()
        for marker in ('window.SPRITES = Object.assign(window.SPRITES || {}, ', 'window.SPRITES = '):
            if marker in t:
                s = t[t.index(marker) + len(marker):]
                dec = json.JSONDecoder()
                try: obj, _ = dec.raw_decode(s.lstrip())
                except ValueError: continue
                out.update(obj); break
    return out

sprites, faces = {}, {}
# ---------------------------------------------------------------- borrowed walkers
g2spr = load_all_sprites(G2)
g1spr = js_obj(os.path.join(ROOT, 'js/sprites.js'), 'SPRITES')
g2faces = js_obj(os.path.join(G2, 'js/faces.js'), 'FACES')
g1faces = js_obj(os.path.join(ROOT, 'js/faces.js'), 'FACES')
t = open(os.path.join(G2, 'js/sprites_ludo.js'), encoding='utf8').read()
ludo_all = json.JSONDecoder().raw_decode(t[t.index('window.LUDO = ') + len('window.LUDO = '):])[0]
ludo = {k: v for k, v in ludo_all.items() if k in ('alanv_walk_side', 'alanv_walk_front', 'alanv_walk_back')}
g2keys = ['alanv_side_k', 'alanv_front_k', 'alanv_back_k', 'vascor_side_k', 'vascor_front_k', 'vascos_back_k']
for v in ludo.values(): g2keys += v['frames']
g1keys = ['ines', 'ines_idle2', 'ines_talk', 'ines_talk2', 'ines_walk1', 'ines_walk2', 'ines_front', 'ines_back',
          'ines_front_walk1', 'ines_front_walk2', 'ines_back_walk1', 'ines_back_walk2']
def borrow(keys, spr, fc, folder):
    for k in keys:
        if k not in spr: print('missing sprite', k); continue
        src = os.path.join(folder, 'art/sprites', k + '.webp')
        if not os.path.exists(src): print('missing file', src); continue
        shutil.copyfile(src, A('sprites', k + '.webp'))
        m = dict(spr[k]); m.pop('src', None); sprites[k] = m
        if k in fc and fc[k].get('ok') is True:
            faces[k] = fc[k]
            for f in glob.glob(os.path.join(folder, 'art/faces', k + '_*.webp')):
                shutil.copyfile(f, A('faces', os.path.basename(f)))
borrow(g2keys, g2spr, g2faces, G2)
borrow(g1keys, g1spr, g1faces, ROOT)

# ---------------------------------------------------------------- the Game III cast, cut from the designs
def cut(path, sid, half=None):
    src = Image.open(path).convert('RGB')
    if half: src = src.crop((0, 0, src.width // 2, src.height) if half == 'left' else (src.width // 2, 0, src.width, src.height))
    im = np.asarray(src).astype(np.float32)
    corners = np.concatenate([im[:12, :12].reshape(-1, 3), im[:12, -12:].reshape(-1, 3), im[-12:, :12].reshape(-1, 3), im[-12:, -12:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    d = np.sqrt(((im - bg) ** 2).sum(axis=2))
    alpha = np.clip((d - 40) / 60, 0, 1)
    greenish = bg[1] > bg[0] + 40 and bg[1] > bg[2] + 40
    if greenish:
        g = im[:, :, 1] - np.maximum(im[:, :, 0], im[:, :, 2])
        alpha = np.minimum(alpha, np.clip((90 - g) / 60, 0, 1))
    mask = alpha > 0.5
    lab, n = ndimage.label(mask)
    if n > 1:
        sizes = ndimage.sum(mask, lab, range(1, n + 1))
        big = [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.25]   # (two figures in one design: keep both)
        keep = ndimage.binary_dilation(np.isin(lab, big), iterations=3)
        alpha = alpha * keep
    if greenish:
        lim = np.maximum(im[:, :, 0], im[:, :, 2])
        im[:, :, 1] = np.where(im[:, :, 1] > lim, lim + (im[:, :, 1] - lim) * 0.25, im[:, :, 1])
    img = Image.fromarray(np.dstack([im, alpha * 255]).clip(0, 255).astype(np.uint8), 'RGBA')
    img.putalpha(img.getchannel('A').filter(ImageFilter.GaussianBlur(0.6)))
    ys, xs = np.where(np.asarray(img.getchannel('A')) > 40)
    fig = img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    s = 720 / fig.height
    fig = fig.resize((max(1, round(fig.width * s)), 720), Image.LANCZOS)
    pad = 20
    canvas = Image.new('RGBA', (fig.width + 2 * pad, 720 + 2 * pad), (0, 0, 0, 0))
    canvas.paste(fig, (pad, pad), fig)
    al = np.asarray(canvas.getchannel('A'))
    foot = np.where(al[pad + int(720 * 0.96): pad + 720].max(axis=0) > 60)[0]
    ax = float(foot.mean()) if len(foot) else canvas.width / 2
    canvas.save(A('sprites', sid + '.webp'), quality=90, alpha_quality=100)
    sprites[sid] = {'w': canvas.width, 'hh': canvas.height, 'h': 720.0, 'ax': round(ax, 1), 'fy': float(pad + 720), 'top': float(pad)}

for f in sorted(glob.glob(os.path.join(G3, 'art/designs/*_g3_front.png'))):
    cid = os.path.basename(f)[:-len('_g3_front.png')]
    cut(f, cid + '_g3')
print('cast', len([k for k in sprites if k.endswith('_g3')]))

# ---------------------------------------------------------------- rooms
def room(src, rid):
    # the GPT repaints (art/designs/rooms_hf, Higgsfield gpt_image_2_5 from the painting) win, kept at 2560x1440;
    # the engine draws any size into the 1280x720 frame. The 1280 Canva versions stay in art/designs/rooms_1280.
    hf = os.path.join(G3, 'art/designs/rooms_hf', rid + '.jpg')
    W, H = (2560, 1440) if os.path.exists(hf) else (1280, 720)
    if os.path.exists(hf): src = hf
    im = Image.open(src).convert('RGB')
    if im.size != (W, H):
        # fill 16:9 (the paintings are 1680x944, a hair taller than 16:9)
        r = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
        x, y = (im.width - W) // 2, (im.height - H) // 2
        im = im.crop((x, y, x + W, y + H))
    im.save(A('bg', rid + '.jpg'), quality=88)
rooms = []
for f in sorted(glob.glob(os.path.join(G3, 'art/designs/rooms/*.png')) + glob.glob(os.path.join(G3, 'art/designs/rooms/variants/*.png'))):
    rid = os.path.basename(f)[:-4]; room(f, rid); rooms.append(rid)
room(os.path.join(G3, 'art/designs/rooms/hub_map.jpg'), 'hub_map'); rooms.append('hub_map')
for k in ('hurricane_chart', 'dominoes_th6'):
    shutil.copyfile(os.path.join(G3, 'art/designs/placeholders', k + '.png'), A('closeups', k + '.png'))
for gid, rid in (('shop', 'shop'), ('bedroom', 'flat'), ('street', 'rua')):
    shutil.copyfile(os.path.join(ROOT, 'art/bg', gid + '.jpg'), A('bg', rid + '.jpg')); rooms.append(rid)
print('rooms', len(rooms))

# ---------------------------------------------------------------- close-ups, the vèvè parts, icons
for f in glob.glob(os.path.join(G3, 'art/designs/stills/*.png')):
    Image.open(f).convert('RGB').save(A('closeups', os.path.basename(f)[:-4] + '.jpg'), quality=88)
for f in glob.glob(os.path.join(G3, 'art/designs/placeholders/veve/veve_*.png')):
    shutil.copyfile(f, A('closeups', os.path.basename(f)))
for f in glob.glob(os.path.join(G3, 'art/designs/items/*.png')):
    Image.open(f).resize((192, 192), Image.LANCZOS).save(A('icons', os.path.basename(f)[:-4] + '.webp'), quality=92, alpha_quality=100)
shutil.copyfile(os.path.join(G2, 'art/closeups/paper_aged.jpg'), A('closeups', 'paper_aged.jpg'))

# ---------------------------------------------------------------- sound effects
# Game II's set, copied over what is there; Game III's own (sd_*, made by scripts/make_sound.py) and their manifest
# entries are kept.
dst = os.path.join(G3, 'audio/sfx'); os.makedirs(dst, exist_ok=True)
man = os.path.join(dst, 'manifest.json')
own = {k: v for k, v in json.load(open(man)).items() if k.startswith('sd_')} if os.path.exists(man) else {}
shutil.copytree(os.path.join(G2, 'audio/sfx'), dst, dirs_exist_ok=True)
if own:
    mf = json.load(open(man)); mf.update(own)
    json.dump(mf, open(man, 'w'), sort_keys=True)

# ---------------------------------------------------------------- the generated js
with open(os.path.join(G3, 'js/sprites_g3.js'), 'w') as f:
    f.write('// Generated by game3/scripts/import_assets.py. Do not edit by hand.\n')
    f.write('window.SPRITES = Object.assign(window.SPRITES || {}, ' + json.dumps(sprites, sort_keys=True) + ');\n')
    f.write('window.LUDO = ' + json.dumps(ludo) + ';\n')
    f.write('window.G3_ROOMS = ' + json.dumps(sorted(rooms)) + ';\n')
with open(os.path.join(G3, 'js/faces.js'), 'w') as f:
    f.write('// Generated by game3/scripts/import_assets.py: the borrowed walkers\' face kits. Do not edit by hand.\n')
    f.write('window.FACES = ' + json.dumps(faces) + ';\n')
print('sprites', len(sprites), 'faces', len(faces))
