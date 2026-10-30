#!/usr/bin/env python3
"""The background people into the game, where the user placed them in the placement tool (art/review/extras/placer/,
https://claude.ai/artifact/1wi1TWruWDpxmZY97YAn9n; the user, 2026-10-29: "placement done").

  python3 sequel/scripts/extras_install.py

Reads art/designs/extras/placements.json (the tool's `placements` collection, saved as {doc id: record}):
  {extra, room, x, y, size, rot, flip, z}  a background figure: its cut-out (art/review/extras/cut/<extra>.png, scripts/
                                           extras.py) becomes art/sprites/x_<extra>.webp (720 px figure, feet at the
                                           middle of the bottom, like scripts/figure_cut.py) and an entry in its room's
                                           `ambient` list: no name, no hotspot, scale = its painted height factor
  {cast, room, x, y, size, flip}           a cast member moved: their stand in that room (S.LAYOUT[room].npcs), turned
                                           round when flipped from how the game stood them (cast_rooms.json)
and writes js/story/extras.js (S.EXTRAS, S.CAST_AT; js/story/layout.js puts them into the rooms) and the sprites'
metadata (art/designs/sprites.json -> js/sprites_canva.js).
"""
import json, os, subprocess, unicodedata
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = json.load(open(os.path.join(SEQ, 'art/designs/extras/placements.json')))
SPEC = {e['id']: e for e in json.load(open(os.path.join(SEQ, 'art/designs/extras/extras.json')))['extras']}
PLACER = os.path.join(SEQ, 'art/review/extras/placer/')
CAST = json.load(open(PLACER + 'data.json'))['cast']                 # how the tool first showed each cast member
GAME = json.load(open(PLACER + 'cast_rooms.json'))                    # how the game stood them (id, dir)
LAY = json.loads(subprocess.run(['node', '-e', "global.window={S:{}};require(process.argv[1]);console.log(JSON.stringify(window.S.LAYOUT))",
                                  os.path.join(SEQ, 'js/story/layout.js')], capture_output=True, text=True, check=True).stdout)


# a room laid out a second way for an occasion (the tool's own tab; js/story/layout.js S.VARIANTS puts it into the room)
BASE = {'museum_hall_dinner': 'museum_hall'}


def depth(room, y):   # (the tool's height at a depth, y0-y1 extended past the floor; the game clamps it to the floor's range)
    y0, h0, y1, h1 = LAY[BASE.get(room, room)]['scale']; free = h0 + (h1 - h0) * (y - y0) / (y1 - y0)
    return free, h0 + (h1 - h0) * max(0, min(1, (y - y0) / (y1 - y0)))


ID = lambda n: unicodedata.normalize('NFD', n).encode('ascii', 'ignore').decode().lower()


def sprite(xid):
    im = Image.open(os.path.join(SEQ, 'art/review/extras/cut', xid + '.png')).convert('RGBA')
    im = im.crop(im.getchannel('A').getbbox()); s = 720 / im.height
    im = im.resize((max(1, round(im.width * s)), 720), Image.LANCZOS); pad = 20
    c = Image.new('RGBA', (im.width + 2 * pad, 720 + 2 * pad), (0, 0, 0, 0)); c.paste(im, (pad, pad), im)
    c.save(os.path.join(SEQ, 'art/sprites', 'x_' + xid + '.webp'), quality=90, alpha_quality=100)
    return {'w': c.width, 'hh': c.height, 'h': 720.0, 'ax': round(c.width / 2, 1), 'fy': 740.0, 'top': 20.0}


def main():
    side = os.path.join(SEQ, 'art/designs/sprites.json'); meta = json.load(open(side))
    extras, cast, n = {}, {}, {}
    for doc, p in sorted(P.items(), key=lambda t: (t[1]['room'], t[1]['y'] + t[1].get('z', 0))):
        r = p['room']
        if p.get('extra') == 'restaurant_gail_derek':
            # Gail and Derek's table is two people in the game (seat_gail, seat_derek: one painting split in two halves);
            # the tool centres the picture on x, the game stands the sprite on its own anchor (ax): move x across, and
            # size it as the tool showed it (depth unclamped there, clamped in the game)
            m = meta['gail_seated']; free, game = depth(r, p['y']); size = p.get('size', 1) * free / game
            Hd = free * 0.74 * p.get('size', 1); wd = Hd * (m['w'] / 720); fx = m['ax'] / m['w']
            if p.get('flip'): fx = 1 - fx   # (mirrored: the anchor mirrors with it)
            xg = round(p['x'] - wd / 2 + fx * wd)
            for sid in ('seat_gail', 'seat_derek'): cast.setdefault(r, {})[sid] = [xg, p['y'], 'w' if p.get('flip') else 'e'] + ([round(size, 3)] if abs(size - 1) > 0.005 else [])
            continue
        if 'extra' in p:
            x = p['extra']; k = SPEC[x]['place'][2]
            if f'x_{x}' not in meta: meta[f'x_{x}'] = sprite(x)
            n[x] = n.get(x, 0) + 1
            e = {'id': f'x_{x}' + (f'_{n[x]}' if n[x] > 1 else ''), 'frames': [f'x_{x}'], 'x': p['x'], 'y': p['y'], 'dir': 'w' if p.get('flip') else 'e',
                 'scale': round(float(k), 3), 'size': p.get('size', 1), 'h': round(depth(r, p['y'])[0], 1)}
            if p.get('flip'): e['flip'] = True
            if p.get('z'): e['z'] = p['z']
            if p.get('rot'): e['rot'] = p['rot']
            extras.setdefault(r, []).append(e)
        else:
            cid = ID(p['cast']); g = GAME[r][cid]; first = next((c for c in CAST[r] if ID(c['name']) == cid), None)
            # (a cast member the tool no longer shows in this room, e.g. the restaurant's standing Gail and Derek: their own flip)
            d = ('w' if p.get('flip') else 'e') if first is None else g['dir'] if p.get('flip') == first['flip'] else {'e': 'w', 'w': 'e'}[g['dir']]
            free, game = depth(r, p['y']); size = round(p.get('size', 1) * free / game, 3)
            cast.setdefault(r, {})[cid] = [p['x'], p['y'], d] + ([size] if abs(size - 1) > 0.005 else [])
    json.dump(meta, open(side, 'w'), indent=1, sort_keys=True)
    with open(os.path.join(SEQ, 'js/sprites_canva.js'), 'w') as f:
        f.write('// Generated by sequel/scripts/figure_cut.py: the cast designed in Canva, cut out for the game. Do not edit by hand.\n')
        f.write('window.SPRITES = Object.assign(window.SPRITES || {}, ' + json.dumps(meta, indent=0, sort_keys=True) + ');\n')
    with open(os.path.join(SEQ, 'js/story/extras.js'), 'w') as f:
        f.write('// Generated by sequel/scripts/extras_install.py from the placement tool (art/designs/extras/placements.json). Do not edit\n'
                '// by hand. S.EXTRAS: the background people per room (ambient: no name, no hotspot); S.CAST_AT: where the user stood\n'
                '// the cast in each room, [x, y, dir, size?]. js/story/layout.js puts both into the rooms.\n')
        f.write('window.S = window.S || {};\nwindow.S.EXTRAS = ' + json.dumps(extras, indent=1) + ';\nwindow.S.CAST_AT = ' + json.dumps(cast, indent=1) + ';\n')
    print(sum(len(v) for v in extras.values()), 'extras in', len(extras), 'rooms;', sum(len(v) for v in cast.values()), 'cast stands')


if __name__ == '__main__':
    main()
