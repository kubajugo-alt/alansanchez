#!/usr/bin/env python3
"""Background characters: the people who fill the rooms (the user, 2026-10-29: "add more background characters, keeping
the same style for all... guests and waiters for the museum party... people on the beach/tourists/surfers, also for
vegueta... some people in the cathedral, a waiter in the hotel restaurant, some more fishermen at the quay... in
different poses... they just need their sprites in situ").

  python3 sequel/scripts/extras.py        cut-outs, per-room previews and a sheet, under art/review/extras/

art/designs/extras/extras.json lists each one (its room, what it is, where it stands for the preview); the paintings
are art/designs/extras/<id>.png (Higgsfield, GPT Image 2.5, the approved cast sheet as the style reference). Each is
keyed off its green, trimmed, saved as art/review/extras/cut/<id>.png, and laid into its room's painting at the size a
figure has at that depth (js/story/layout.js scale), so the preview shows them as the game would. Nothing here
touches the game.
"""
import json, os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(SEQ, 'art/designs/extras'); O = os.path.join(SEQ, 'art/review/extras')
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)


def layout():
    js = "global.window={S:{}};require(process.argv[1]);console.log(JSON.stringify(window.S.LAYOUT))"
    return json.loads(subprocess.run(['node', '-e', js, os.path.join(SEQ, 'js/story/layout.js')], capture_output=True, text=True, check=True).stdout)


def cut(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    al = np.where((g > r + 25) & (g > b + 15), 0, 255).astype(np.uint8)
    al = np.asarray(Image.fromarray(al).filter(ImageFilter.MinFilter(3)))
    rgb = a.astype(np.uint8).copy(); sp = (g > np.maximum(r, b)) & (al > 0)        # green spill on the outline
    rgb[..., 1] = np.where(sp, np.maximum(r, b), g).astype(np.uint8)
    im = Image.fromarray(np.dstack([rgb, al]), 'RGBA'); ys, xs = np.where(al > 0)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def main():
    spec = json.load(open(os.path.join(D, 'extras.json'))); L = layout()
    os.makedirs(os.path.join(O, 'cut'), exist_ok=True)
    rooms = {}
    for e in spec['extras']:
        p = os.path.join(D, e['id'] + '.png')
        if not os.path.exists(p): continue
        im = cut(p); im.save(os.path.join(O, 'cut', e['id'] + '.png')); rooms.setdefault(e['room'], []).append((e, im))
    for room, items in rooms.items():
        bg = Image.open(os.path.join(SEQ, 'art/bg', room + '.jpg')).convert('RGBA')
        y0, h0, y1, h1 = L[room]['scale']
        for e, im in sorted(items, key=lambda t: t[0]['place'][1]):   # back to front
            x, y, k = e['place']; H = h0 + (h1 - h0) * (y - y0) / (y1 - y0)
            s = (H / im.width) if k == 'w' else (H * k / im.height)
            t = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            bg.alpha_composite(t, (round(x - t.width / 2), round(y - t.height)))
        bg.convert('RGB').save(os.path.join(O, f'room_{room}.jpg'), quality=88)
    # every cut-out at one size, by room
    tiles = [(e['id'], im) for r in rooms.values() for e, im in r]
    th = 360; cells = [im.resize((round(im.width * th / im.height), th), Image.LANCZOS) for _, im in tiles]
    W = 2000; rows = []; row = []; x = 0
    for (n, _), c in zip(tiles, cells):
        if x + c.width + 20 > W and row: rows.append(row); row = []; x = 0
        row.append((n, c)); x += c.width + 20
    if row: rows.append(row)
    S = Image.new('RGB', (W, len(rows) * (th + 40) + 10), (232, 228, 222)); d = ImageDraw.Draw(S)
    for i, row in enumerate(rows):
        x = 10
        for n, c in row: S.paste(c, (x, 10 + i * (th + 40)), c); d.text((x, th + 14 + i * (th + 40)), n, fill=(40, 40, 40), font=FONT); x += c.width + 20
    S.save(os.path.join(O, 'sheet.jpg'), quality=88)
    print(len(tiles), 'extras in', len(rooms), 'rooms')


if __name__ == '__main__':
    main()
