#!/usr/bin/env python3
"""Gando's background people, for review only (the user, 2026-10-31: "we need to add background characters to the
airport - 2 nuns and a german family"; the narrator: "in front of a taxi driver, two nuns and a family from
Düsseldorf"). Nothing here touches the game.

  python3 sequel/art/review/extras_gando/make.py

Paintings: art/designs/extras/gando_nuns.png (Canva), gando_family.png (Higgsfield, Canva was cooling down).
Writes, next to this file:
  cut/<id>.png                 keyed and trimmed (scripts/extras.py's cut)
  placer/x_<id>.webp, placer/extras_entries.json
                               what the placement tool needs (700 px sprites, data.json "extras" entries)
  mock_gando.jpg               the two groups in the painting where they'd stand
  mock_gando_guides.jpg        the same with the hotspots outlined and Alan and Vasco at the kiss
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); SEQ = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, os.path.join(SEQ, 'scripts'))
from extras import cut   # noqa: E402

D = os.path.join(SEQ, 'art/designs/extras'); P = os.path.join(SEQ, 'art/review/extras/placer')
SCALE = [520, 250, 716, 340]   # js/story/layout.js gando.scale: [y0, h0, y1, h1]
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
# k: the sprite's height in figure-heights at its feet (the family's sprite runs from the father's hair to the
# trolley's wheels, a little more than him; the nuns are a little shorter than a man). flip: face the kiss.
EXTRAS = [
    {'id': 'gando_nuns', 'x': 175, 'y': 566, 'k': 0.93, 'flip': False,
     'desc': 'Two Spanish nuns in 1990s habits: the older one, glasses, hand on her chest, scandalised; the younger '
             'trying not to smile. Standing, three-quarter view, watching (Canva).'},
    {'id': 'gando_family', 'x': 985, 'y': 556, 'k': 1.05, 'flip': True,
     'desc': 'A German family from Düsseldorf off the plane with a luggage trolley: father (moustache, socks and '
             'sandals, camcorder bag), mother (perm, pastel windbreaker), a boy in a Germany shirt, a girl pointing. '
             'Standing, staring (Higgsfield).'},
]


def H(y):
    y0, h0, y1, h1 = SCALE
    return h0 + (h1 - h0) * (y - y0) / (y1 - y0)


def place(bg, im, x, y, h, flip=False):
    s = h / im.height; t = im.resize((round(im.width * s), round(h)), Image.LANCZOS)
    if flip: t = t.transpose(Image.FLIP_LEFT_RIGHT)
    bg.alpha_composite(t, (round(x - t.width / 2), round(y - t.height)))


def main():
    os.makedirs(os.path.join(HERE, 'cut'), exist_ok=True); os.makedirs(os.path.join(HERE, 'placer'), exist_ok=True)
    bg = Image.open(os.path.join(SEQ, 'art/bg/gando.jpg')).convert('RGBA').resize((1280, 720), Image.LANCZOS)
    plain = bg.copy(); entries = []; cuts = {}
    for e in EXTRAS:
        im = cut(os.path.join(D, e['id'] + '.png')); cuts[e['id']] = im
        im.save(os.path.join(HERE, 'cut', e['id'] + '.png'))
        s = 700 / im.height; t = im.resize((round(im.width * s), 700), Image.LANCZOS)
        t.save(os.path.join(HERE, 'placer', 'x_' + e['id'] + '.webp'), quality=90, alpha_quality=100)
        entries.append({'id': e['id'], 'room': 'gando', 'k': e['k'], 'x': e['x'], 'y': e['y'], 'w': t.width, 'h': 700,
                        'desc': e['desc']})
    for e in sorted(EXTRAS, key=lambda e: e['y']):
        place(plain, cuts[e['id']], e['x'], e['y'], H(e['y']) * e['k'], e['flip'])
    json.dump(entries, open(os.path.join(HERE, 'placer', 'extras_entries.json'), 'w'), indent=1, ensure_ascii=False)
    plain.convert('RGB').save(os.path.join(HERE, 'mock_gando.jpg'), quality=90)

    # guides: hotspots (tue.js), Alan entering, Alan and Vasco at the kiss (Vasco 312.8/720 of Alan's height right of him)
    g = plain.copy(); data = json.load(open(os.path.join(P, 'data.json')))
    alan = Image.open(os.path.join(P, 'alan.webp')).convert('RGBA'); vasco = Image.open(os.path.join(P, 'c_vascor_side_k.webp')).convert('RGBA')
    vas = next(c for c in data['cast']['gando'] if c['name'] == 'Vasco')
    ax, ay = 580, 650; ah = H(ay)
    place(g, alan, ax, ay, ah)
    vx = ax + 312.8 / 720 * ah; s = ah / vasco.height; vt = vasco.resize((round(vasco.width * s), round(ah)), Image.LANCZOS)
    if vas['flip']: vt = vt.transpose(Image.FLIP_LEFT_RIGHT)
    fx = (1 - vas['ax']) if vas['flip'] else vas['ax']
    g.alpha_composite(vt, (round(vx - vt.width * fx), round(ay - vt.height)))
    d = ImageDraw.Draw(g)
    for name, (x, y, w, h), col in [('Baggage belt', (140, 440, 620, 100), (255, 210, 60)), ('Arrivals board', (880, 120, 260, 120), (90, 200, 255)),
                                    ('Taxi rank', (1160, 250, 110, 320), (255, 120, 120)), ('Back to the city (Sun)', (10, 250, 110, 320), (200, 160, 255))]:
        d.rectangle((x, y, x + w, y + h), outline=col, width=2); d.text((x + 4, y + 3), name, fill=col, font=FONT)
    d.ellipse((200 - 6, 660 - 6, 200 + 6, 660 + 6), outline=(255, 255, 255), width=2); d.text((208, 664), 'Alan enters', fill=(255, 255, 255), font=FONT)
    d.text((ax - 60, ay + 6), 'the kiss (Alan, Vasco)', fill=(255, 255, 255), font=FONT)
    for e in EXTRAS:
        d.line((e['x'] - 8, e['y'], e['x'] + 8, e['y']), fill=(0, 255, 140), width=2)
        d.text((e['x'] - 40, e['y'] + 4), f"{e['id']} ({e['x']},{e['y']})", fill=(0, 255, 140), font=FONT)
    g.convert('RGB').save(os.path.join(HERE, 'mock_gando_guides.jpg'), quality=90)

    # the cut-outs side by side on a neutral ground
    th = 520; tiles = [c.resize((round(c.width * th / c.height), th), Image.LANCZOS) for c in cuts.values()]
    S = Image.new('RGB', (sum(t.width for t in tiles) + 20 * (len(tiles) + 1), th + 60), (232, 228, 222)); x = 20; dd = ImageDraw.Draw(S)
    for (n, _), t in zip(cuts.items(), tiles): S.paste(t, (x, 20), t); dd.text((x, th + 30), n, fill=(40, 40, 40), font=FONT); x += t.width + 20
    S.save(os.path.join(HERE, 'sheet.jpg'), quality=90)
    print('done', [(e['id'], round(H(e['y']) * e['k'])) for e in EXTRAS])


if __name__ == '__main__':
    main()
