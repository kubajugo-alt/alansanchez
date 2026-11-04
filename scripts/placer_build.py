#!/usr/bin/env python3
"""The placement tool, step 2 (ported from Game II's placer, sequel/art/review/extras/placer/, 2026-11-04): the review page
on which the user stands the people in each room (drag, size, flip, to front / to back), built from what
scripts/tests/placer_dump.mjs read out of the running game.

  node scripts/tests/placer_dump.mjs http://localhost:8098/        (writes art/review/placer/rooms.json)
  python3 scripts/placer_build.py [folder]                           (default art/review/placer/)

Writes into the folder: index.html (from scripts/review_pages/placer/), data.json (rooms: floor and depth scale; cast:
everyone in each room where the game stands them; extras: [] since Game I has no spare background figures painted;
alan: his size for scale), bg_<room>.jpg (each painting as the room shows it, 1280x720), c_<frame>.webp (each person's
first frame cut to the figure, top of the head to the feet) and alan.webp. Publish the folder as a private artifact with
the `db` capability (collection `placements`; the page saves as the user moves people) and give the user the link. When
the user says it's done: read the `placements` collection, save it as {doc id: record} to a JSON file and run
scripts/placer_install.py on it. Nothing here touches the game; the paintings are only read.
"""
import json, os, shutil, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, 'art/review/placer')
DUMP = json.load(open(os.path.join(OUT, 'rooms.json')))
IH = 400   # (cut-outs at most this tall: the page shows them at a few hundred px)


def cut(frame, sp, src, name):
    """a sprite's figure, its head to its feet, as name; returns (w, h, anchor x as a fraction)"""
    p = os.path.join(ROOT, src) if src else os.path.join(ROOT, 'art/sprites', frame + '.webp')
    if not os.path.exists(p): p = os.path.splitext(p)[0] + '.png'
    im = Image.open(p).convert('RGBA')
    k = im.width / sp['w']   # (the file may be stored larger than its metadata's canvas)
    im = im.crop((0, round(sp['top'] * k), im.width, round(sp['fy'] * k)))
    s = min(1.0, IH / im.height)
    if s < 1: im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    im.save(os.path.join(OUT, name), quality=88, alpha_quality=90)
    return im.width, im.height, sp['ax'] / sp['w']


def main():
    os.makedirs(OUT, exist_ok=True)
    shutil.copy(os.path.join(ROOT, 'scripts/review_pages/placer/index.html'), os.path.join(OUT, 'index.html'))
    rooms, cast, made = [], {}, {}
    for r in DUMP['rooms']:
        bg = os.path.normpath(os.path.join(ROOT, 'art/bg', r['bg'] + '.jpg'))
        if not os.path.exists(bg): print('no painting for', r['id'], bg); continue
        Image.open(bg).convert('RGB').resize((1280, 720), Image.LANCZOS).save(os.path.join(OUT, f"bg_{r['id']}.jpg"), quality=84)
        rooms.append({'id': r['id'], 'name': r['name'], 'scale': r['scale'], 'walk': r['walk']})
        cs = cast[r['id']] = []
        for p in r['people']:
            if not p['sprite']: print('  no sprite for', r['id'], p['key'], p['frame']); continue
            name = f"c_{p['frame']}.webp"
            if name not in made: made[name] = cut(p['frame'], p['sprite'], p['src'], name)
            w, ih, a = made[name]
            cs.append({'key': p['key'], 'id': p['id'], 'name': p['name'], 'when': p['when'], 'ambient': p['ambient'], 'img': name,
                       'x': p['x'], 'y': p['y'], 'h': round(p['hShown'], 1), 'w': w, 'ih': ih, 'flip': p['flip'],
                       'ax': round(1 - a if p['flip'] else a, 4),   # (the anchor as the page first shows it)
                       # how the game stands them, for scripts/placer_install.py
                       'game': {'dir': p['dir'], 'fixedH': p['fixedH'], 'size': p['size'], 'z': p['z'], 'facesLeft': p['sprite']['facesLeft']}})
    A = DUMP['alan']; w, h, _ = cut(A['frame'], A['sprite'], A['sprite'].get('src'), 'alan.webp')
    json.dump({'rooms': rooms, 'extras': [], 'alan': {'w': w, 'h': h}, 'cast': cast}, open(os.path.join(OUT, 'data.json'), 'w'), indent=1)
    print(len(rooms), 'rooms,', sum(len(v) for v in cast.values()), 'people,', len(made), 'cut-outs ->', OUT)


if __name__ == '__main__':
    main()
