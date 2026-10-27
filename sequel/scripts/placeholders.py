#!/usr/bin/env python3
"""Placeholder art for The Shortest Night, so the whole game can be played before anything is painted.

  python3 sequel/scripts/placeholders.py            # everything missing
  python3 sequel/scripts/placeholders.py --force    # rewrite every placeholder (never a painting: see below)

Writes, only where no real art exists yet (a file without a `.ph` marker beside it is real art and is never touched):
  art/bg/<room>.jpg          1280x720 rooms: a gradient, a few shapes for the place, its name in the corner
  art/stills/<still>.jpg     1536x864 paintings-to-be: what the painting should show, as text (the art list)
  art/sprites/<id>.webp      figures for the new cast: a flat silhouette in the character's palette, name on the chest
  js/sprites_placeholders.js their frame metadata (same fields as Game I's js/sprites.js)

The engine draws every hotspot of a placeholder room as a labelled box (js/story/core.js, S.placeholderBoxes), so
nothing about where things are is baked into these pictures. Replace a placeholder by dropping the painting in under
the same name and deleting its `.ph` marker.
"""
import json, os, sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORCE = '--force' in sys.argv
W, H = 1280, 720


def font(size, bold=False):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSerif%s.ttf' % ('-Bold' if bold else ''),
              '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else '')]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def writable(path):
    """True if path is free for a placeholder: missing, or itself a placeholder (marker beside it)."""
    if not os.path.exists(path):
        return True
    return os.path.exists(path + '.ph') and FORCE


def mark(path):
    open(path + '.ph', 'w').write('placeholder: scripts/placeholders.py\n')


def grad(top, bottom, w=W, h=H):
    im = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return im


def hexrgb(s):
    s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


# ---------------------------------------------------------------- rooms
# top / bottom: the wall or sky; floor: the walkable band (y 560-720); motifs: shapes for the place
ROOMS = {
    'elena_car':     ('Elena\'s Renault 4 · 21 Dec 1995', '#141a26', '#2a3346', '#15110e', ['windscreen', 'cloudsea_night']),
    'gando':         ('Gando airport · arrivals', '#e9e2cf', '#cfc6ae', '#8a8270', ['windows_wide', 'belt']),
    'hotel_lobby':   ('Hotel Reina Isabel · lobby, Las Canteras', '#e6d8bb', '#c9b38a', '#6e4e34', ['desk', 'palms', 'window']),
    'hotel_room':    ('Hotel room · fourth floor, sea view', '#d7c7a7', '#bba684', '#7d6046', ['window_sea', 'bed']),
    'canteras':      ('Las Canteras · the promenade', '#a9b0b3', '#c8c3b4', '#d9c9a2', ['sea', 'promenade', 'kiosk', 'phonebox']),
    'map':           ('Las Palmas de Gran Canaria · 1996', '#c9b88f', '#b3a17a', '#b3a17a', ['island']),
    'museum_hall':   ('El Museo Canario · hall', '#d9c9a6', '#b49a72', '#5a3c26', ['arches', 'cases', 'door_courtyard']),
    'baute_office':  ('El Museo Canario · Dr. Baute\'s office', '#8f7a5c', '#6b583e', '#3f2d1d', ['shelves', 'window', 'desk']),
    'archive':       ('El Museo Canario · the archive', '#7d6e55', '#5d503c', '#3a2e22', ['shelves', 'lamp', 'desk']),
    'santa_ana':     ('Plaza de Santa Ana · the cathedral', '#b8bcc0', '#d2c8b0', '#9d8f78', ['cathedral', 'dogs']),
    'belfry':        ('Santa Ana · the bell chamber', '#6f6a62', '#4e4a44', '#3a352f', ['bell', 'clockwork', 'arch_window']),
    'colon':         ('Casa de Colón · the library', '#cdb48a', '#a98d63', '#5b4127', ['shelves', 'balcony', 'parrot']),
    'isleta':        ('La Isleta · Doña Pino\'s quay', '#9ba3a6', '#b6b2a4', '#7c7466', ['sea', 'boats', 'nets']),
    'rafa_bar':      ('Vegueta · Rafa\'s bar', '#3a2a22', '#24180f', '#2a1c12', ['bar', 'bottles', 'lamp']),
    'rafa_studio':   ('Vegueta · Rafa\'s studio', '#e8dcc4', '#cbb994', '#7a6047', ['window', 'easel', 'bed']),
    'carmen_flat':   ('Triana · Carmen\'s flat', '#8b6f55', '#6c533e', '#4a3727', ['shelves', 'window', 'machine']),
    'landrover':     ('The road up · Carmen\'s Land Rover', '#05070f', '#151a2a', '#0e0d0c', ['windscreen', 'stars']),
    'camp':          ('Risco Caído · the dig camp', '#4d7fbf', '#f0e4c8', '#a57a52', ['cloudsea', 'tents']),
    'cave6':         ('Risco Caído · Cave 6', '#3a2c22', '#2a1f18', '#4a3628', ['dome', 'triangles', 'sockets']),
    'title':         ('Alan Sanches II · The Shortest Night', '#1c2c4c', '#6a4a3a', '#1a1a22', ['cloudsea_night']),
    'vault':         ('Risco Caído · the granary vault', '#18130f', '#0f0c09', '#1d1712', ['grille', 'crates']),
}


def motif(im, d, m, ph):
    if m == 'sea':
        d.rectangle([0, 330, W, 520], fill=(92, 112, 120)); d.line([0, 330, W, 330], fill=(160, 170, 170), width=2)
    elif m in ('cloudsea', 'cloudsea_night'):
        c = (236, 236, 236) if m == 'cloudsea' else (120, 130, 150)
        for i in range(14):
            x = i * 100 - 20; d.ellipse([x, 380 + (i % 3) * 14, x + 220, 470 + (i % 2) * 20], fill=c)
        d.rectangle([0, 440, W, 540], fill=c)
    elif m == 'promenade':
        d.rectangle([0, 520, W, 560], fill=(170, 160, 140))
        for i in range(5): d.line([0, 540 - i * 6, W, 540 - i * 6], fill=(150, 142, 125))
    elif m == 'kiosk':
        d.rectangle([60, 300, 260, 560], fill=(150, 90, 60)); d.polygon([(40, 300), (280, 300), (240, 260), (80, 260)], fill=(200, 60, 50))
    elif m == 'phonebox':
        d.rectangle([300, 300, 380, 560], fill=(60, 110, 160)); d.rectangle([312, 320, 368, 460], fill=(170, 200, 220))
    elif m == 'island':
        d.polygon([(400, 140), (760, 110), (930, 260), (900, 560), (520, 620), (330, 420)], fill=(186, 160, 110), outline=(90, 70, 40))
    elif m in ('arches', 'arch_window'):
        for x in range(80, W, 260):
            d.rectangle([x, 200, x + 160, 520], fill=tuple(max(0, c - 30) for c in im.getpixel((x, 210))))
            d.ellipse([x, 120, x + 160, 280], fill=tuple(max(0, c - 30) for c in im.getpixel((x, 210))))
    elif m == 'shelves':
        for x in range(40, W, 300):
            d.rectangle([x, 80, x + 220, 540], fill=(70, 48, 30))
            for y in range(110, 540, 70):
                for k in range(0, 200, 14): d.rectangle([x + 10 + k, y, x + 20 + k, y + 52], fill=((k * 7) % 120 + 80, 60, 40))
    elif m in ('window', 'window_sea', 'balcony'):
        d.rectangle([860, 120, 1120, 400], fill=(170, 186, 196)); d.rectangle([860, 120, 1120, 400], outline=(60, 45, 30), width=10)
        if m == 'window_sea': d.rectangle([870, 300, 1110, 390], fill=(110, 130, 140))
    elif m == 'windows_wide':
        d.rectangle([60, 100, 1220, 380], fill=(200, 214, 226)); d.rectangle([60, 300, 1220, 380], fill=(140, 140, 130))
    elif m == 'belt':
        d.rectangle([140, 470, 760, 520], fill=(60, 60, 64))
    elif m == 'desk':
        d.rectangle([380, 420, 900, 560], fill=(90, 60, 38))
    elif m == 'bed':
        d.rectangle([140, 420, 640, 580], fill=(236, 230, 214)); d.rectangle([140, 380, 200, 580], fill=(110, 80, 56))
    elif m == 'palms':
        for x in (100, 1150):
            d.rectangle([x, 300, x + 20, 560], fill=(110, 80, 50)); d.ellipse([x - 70, 220, x + 90, 330], fill=(70, 110, 60))
    elif m == 'cases':
        for x in (180, 520, 860): d.rectangle([x, 380, x + 200, 540], fill=(150, 170, 170), outline=(70, 50, 30), width=6)
    elif m == 'door_courtyard':
        d.rectangle([1100, 200, 1240, 560], fill=(240, 220, 170))
    elif m == 'cathedral':
        d.rectangle([380, 80, 900, 560], fill=(160, 150, 136)); d.rectangle([300, 40, 420, 560], fill=(150, 140, 126)); d.rectangle([860, 40, 980, 560], fill=(150, 140, 126))
        d.rectangle([580, 380, 700, 560], fill=(70, 50, 36))
    elif m == 'dogs':
        for x in (180, 1080): d.rectangle([x, 470, x + 90, 540], fill=(80, 84, 82))
    elif m == 'bell':
        d.polygon([(560, 160), (720, 160), (790, 420), (490, 420)], fill=(110, 90, 50)); d.ellipse([600, 120, 680, 180], fill=(110, 90, 50))
    elif m == 'clockwork':
        for (x, y, r) in [(180, 300, 70), (280, 360, 40), (1050, 320, 80)]: d.ellipse([x - r, y - r, x + r, y + r], outline=(150, 120, 70), width=8)
    elif m == 'parrot':
        d.ellipse([140, 260, 200, 330], fill=(60, 160, 70))
    elif m == 'boats':
        for x in (120, 560, 940): d.polygon([(x, 470), (x + 240, 470), (x + 200, 520), (x + 40, 520)], fill=(40, 90, 150))
    elif m == 'nets':
        for i in range(0, 300, 12): d.line([700 + i, 560, 760 + i, 620], fill=(200, 190, 150))
    elif m == 'bar':
        d.rectangle([0, 430, 900, 560], fill=(80, 46, 26)); d.rectangle([0, 420, 900, 440], fill=(120, 76, 44))
    elif m == 'bottles':
        for x in range(60, 860, 34): d.rectangle([x, 230, x + 18, 300], fill=((x * 3) % 120 + 60, 90, 60))
    elif m == 'lamp':
        d.ellipse([560, 60, 720, 120], fill=(250, 210, 140))
    elif m == 'easel':
        d.rectangle([760, 220, 980, 470], fill=(238, 232, 220)); d.line([870, 470, 840, 600], fill=(90, 60, 40), width=8)
    elif m == 'machine':
        d.rectangle([420, 420, 540, 470], fill=(30, 30, 32)); d.ellipse([505, 430, 520, 445], fill=(220, 40, 30))
    elif m == 'windscreen':
        d.polygon([(120, 60), (1160, 60), (1240, 520), (40, 520)], fill=tuple(int(c * 0.8) for c in im.getpixel((640, 200))))
        d.rectangle([0, 520, W, H], fill=(40, 34, 28)); d.ellipse([520, 560, 760, 720], outline=(20, 20, 20), width=18)
    elif m == 'stars':
        for i in range(160):
            x, y = (i * 7919) % W, (i * 104729) % 420 + 70; d.point((x, y), fill=(230, 230, 255))
    elif m == 'tents':
        for x in (120, 360, 980): d.polygon([(x, 560), (x + 100, 420), (x + 200, 560)], fill=(180, 130, 70))
    elif m == 'dome':
        d.ellipse([60, -260, 1220, 640], fill=(92, 70, 54)); d.ellipse([140, -180, 1140, 600], fill=(70, 52, 40))
    elif m == 'triangles':
        for i in range(26):
            x, y = 140 + (i % 13) * 76, 200 + (i // 13) * 120
            d.polygon([(x, y), (x + 44, y), (x + 22, y + 46)], outline=(170, 140, 110), width=4)
    elif m == 'beam':
        d.polygon([(620, 0), (660, 0), (900, 420), (840, 430)], fill=(255, 226, 150))
    elif m == 'sockets':
        for i in range(7): d.ellipse([480 + i * 44, 24, 506 + i * 44, 50], fill=(20, 16, 14), outline=(160, 130, 90), width=3)
    elif m == 'grille':
        for x in range(380, 900, 40): d.line([x, 120, x, 560], fill=(70, 62, 56), width=10)
        d.line([380, 120, 900, 120], fill=(70, 62, 56), width=14)
    elif m == 'crates':
        for x in (120, 200, 1040, 1120): d.rectangle([x, 440, x + 90, 540], fill=(90, 66, 40))


def rooms():
    os.makedirs(os.path.join(SEQ, 'art/bg'), exist_ok=True)
    n = 0
    for rid, (name, top, bottom, floor, motifs) in ROOMS.items():
        path = os.path.join(SEQ, 'art/bg', rid + '.jpg')
        if not writable(path):
            continue
        im = grad(hexrgb(top), hexrgb(bottom))
        d = ImageDraw.Draw(im)
        fl = hexrgb(floor)
        for y in range(560, H):
            t = (y - 560) / (H - 560)
            d.line([(0, y), (W, y)], fill=tuple(int(c * (0.85 + 0.25 * t)) for c in fl))
        for m in motifs:
            motif(im, d, m, name)
        im = im.filter(ImageFilter.GaussianBlur(1.2))
        d = ImageDraw.Draw(im)
        if rid == 'title':  # (the title screen writes its own words over it)
            im.save(path, quality=88); mark(path); n += 1
            continue
        # the name low on the left, clear of the menu buttons (top corners) and the inventory (bottom edge)
        tw = d.textlength(name, font=font(18))
        d.rectangle([16, 640, 40 + tw, 672], fill=(0, 0, 0))
        d.text((28, 645), name, font=font(18), fill=(240, 228, 200))
        d.text((28, 676), 'placeholder room: the game draws its hotspots', font=font(13), fill=(255, 255, 255))
        im.save(path, quality=88); mark(path); n += 1
    return n


# ---------------------------------------------------------------- stills: what each painting should show
STILLS = {
    'still_elena_bar':   ('Artenara, 23:40, 21 December 1995', 'A tiny mountain bar, shutters half down. Elena Suárez (40s, dusty field jacket, hair up with a pencil through it) at a wall phone, feeding it coins. The barman stacks chairs behind her.'),
    'still_barranco':    ('The barranco, the morning after', 'Bright winter sun above the cloud. A dry barranco of red rock and spurge; the Renault 4 upright at the bottom, undamaged, windows shut. Two Guardia Civil. On the windscreen a triangle, point down, dried in a crust of salt.'),
    'still_title':       ('Title', 'ALAN SANCHES II: THE SHORTEST NIGHT. The sea of cloud at sunrise from Risco Caído; far below, a single black stain in the grey over Las Palmas.'),
    'still_arrival':     ('Tue 18 · Gando', 'A plane on the tarmac under a flat grey sky; heat shimmer; Alan in a creased shirt, one carry-on, already pink.'),
    'still_mist':        ('Tue 18 · Las Canteras at dusk', 'The beach at dusk under the grey panza de burro. A low black mist rolls in off the water, against the wind. Tourists pack up, not looking.'),
    'still_love_1':      ('Tue 18 · the first night', 'The hotel room, the balcony door open on the sea. Alan and Vasco in bed, laughing, eight months easy. Warm lamp, the sheet tangled. (Discreet setting skips it.)'),
    'still_pepe':        ('Wed 19 · night, La Isleta', 'A fisherman\'s bedroom in La Isleta at night. The bed wet through, the floor dry. A rosary on the bedside table. No body shown.'),
    'still_caught':      ('Thu 20 · the dinner', 'Baute\'s office door open on the lit hall: Alan by the open desk drawer, Baute in the doorway, sponsors behind him, Vasco among them, glass in hand, face gone still.'),
    'still_fight':       ('Fri 21 · the fight', 'The hotel room in grey morning light. Vasco by the door with his field bag; Alan on the edge of the bed. Neither looking at the other.'),
    'still_rafa_night':  ('Fri 21 · Rafa\'s bar, late', 'The bar nearly empty, chairs up. Rafa leaning over the counter, sketching on a napkin without looking down; Alan laughing too hard; at the far end, Yeray alone, talking to nobody.'),
    'still_rafa_drawing':('Sat 22 · the drawing', 'Rafa\'s charcoal drawing of Alan asleep, on rough paper, morning light across it. Alan looks younger in it than he is.'),
    'still_isleta_flood':('Sat 22 · La Isleta floods', 'La Isleta\'s streets at evening ankle-deep in black water; the fishermen standing in their doorways; the water has come in against the wind.'),
    'still_vault_dark':  ('Sat 22 · the vault', 'Black. The faint ring of a dying torch on rough tuff; scratched in the rock: 23° 26′, and under it, A.'),
    'still_cloud_climb': ('Sun 23 · above the cloud', 'The Land Rover breaking out of the panza de burro into a clear night full of stars. Below, the cloud glows orange where the San Juan bonfires burn along the whole coast.'),
    'still_bad_ending':  ('Sun 23 · the airport', 'Gando departures. Alan alone at the window, boarding card in hand. On the horizon, under the cloud over Las Palmas, a black stain spreading.'),
    'still_chain':       ('Mon 24 · the chain of hands', 'Cave 6 at sunrise: Alan dragged toward the door in the floor; Vasco holding his wrist, Carmen holding Vasco, Yeray holding Carmen, Baute holding Yeray. The beam falling true across the triangles.'),
    'still_sunrise':     ('Mon 24 · the sea of cloud', 'The sun rising over a sea of cloud. Far below, the black mist sinking back; only the ordinary grey of the panza de burro over the city.'),
    'still_road_down':   ('Mon 24 · the road down', 'The Land Rover on a hairpin road above the clouds, Alan driving, Vasco\'s hand over his on the gearstick.'),
    'still_fireworks':   ('Mon 24 · 518 years', 'Las Palmas at night from the hotel balcony: fireworks over Las Canteras, bonfire smoke on the beach.'),
    'still_love_2':      ('Mon 24 · the last night', 'The hotel room by the light of the fireworks. Quieter than the first night: two men choosing each other, carefully. (Discreet setting skips it.)'),
}


def wrap(text, f, width, d):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=f) > width:
            lines.append(cur); cur = w
        else:
            cur = t
    if cur: lines.append(cur)
    return lines


def stills():
    os.makedirs(os.path.join(SEQ, 'art/stills'), exist_ok=True)
    n = 0
    for sid, (title, desc) in STILLS.items():
        path = os.path.join(SEQ, 'art/stills', sid + '.jpg')
        if not writable(path):
            continue
        im = grad((40, 36, 34), (18, 16, 15), 1536, 864)
        d = ImageDraw.Draw(im)
        d.rectangle([60, 60, 1476, 804], outline=(150, 120, 80), width=3)
        d.text((110, 120), title, font=font(46, True), fill=(236, 214, 170))
        y = 220
        for line in wrap(desc, font(32), 1300, d):
            d.text((110, y), line, font=font(32), fill=(220, 210, 196)); y += 48
        d.text((110, 740), 'placeholder painting · ' + sid, font=font(22), fill=(160, 150, 140))
        im.save(path, quality=88); mark(path); n += 1
    return n


# ---------------------------------------------------------------- figures for the new cast
# id: (name, height in figure px of 720, colours [hair, top, bottom, skin], frames)
CAST = {
    'carmen':      ('Carmen', 0.92, ['#1a1a1a', '#a85a32', '#b8a77a', '#b8875e']),
    'carmen_field':('Carmen', 0.92, ['#1a1a1a', '#5d6136', '#b8a77a', '#b8875e']),
    'baute':       ('Baute', 1.05, ['#c8c8c8', '#c9b48c', '#c9b48c', '#9a6a44']),
    'baute_dig':   ('Baute', 1.05, ['#c8c8c8', '#d8cfb8', '#6e5e44', '#9a6a44']),
    'rafa':        ('Rafa', 1.0, ['#2a1c14', '#2c56b8', '#5c7aa6', '#a87048']),
    'yeray':       ('Yeray', 0.98, ['#2a2018', '#6e7a4a', '#8a7a5a', '#a87048']),
    'nieves':      ('Nieves', 0.9, ['#2a1a12', '#24364e', '#24364e', '#c09070']),
    'chano':       ('Chano', 0.9, ['#2a2622', '#e8e2d2', '#4a4038', '#b07a50']),
    'pino':        ('Doña Pino', 0.82, ['#9a9a9a', '#2a2a2e', '#2a2a2e', '#a07050']),
    'lolo':        ('Don Lolo', 0.86, ['#5a5048', '#6a5e4c', '#3e3a34', '#9a6a48']),
    'fermin':      ('Don Fermín', 0.8, ['#7a7a7a', '#141414', '#141414', '#c09a7a']),
    'mercedes':    ('Mercedes Quintana', 0.82, ['#9a9a9a', '#7a7a7e', '#4a4a50', '#c8a080']),
    'montesdeoca': ('Montesdeoca', 0.98, ['#3a3430', '#f2f0e6', '#c8b896', '#a8704a']),
    'gail':        ('Gail', 0.88, ['#d8b878', '#e89aa8', '#e8e0d0', '#e8b8a0']),
    'derek':       ('Derek', 0.94, ['#a8a090', '#9ab8d8', '#c8202a', '#e8a890']),
    'guard':       ('Museum guard', 0.95, ['#3a3430', '#5a6070', '#3a3e4a', '#b08060']),
    'elena':       ('Elena Suárez', 0.92, ['#4a3020', '#7a6a4a', '#5a4a3a', '#c09070']),
    'clerk':       ('Check-in clerk', 0.9, ['#2a2018', '#2e4a7a', '#2e4a7a', '#b08060']),
    'surfer':      ('Surfer', 0.98, ['#e8d090', '#1a1a1a', '#1a1a1a', '#b07a50']),
}
FW, FH = 300, 760


def figure(name, scale, cols, kind):
    hair, top, bottom, skin = [hexrgb(c) for c in cols]
    im = Image.new('RGBA', (FW, FH), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    h = 720 * scale
    y0 = FH - 20 - h
    cx = FW // 2
    head = h * 0.13
    leg = 0 if kind != 'walk1' else 22
    # legs, body, arms, head
    d.polygon([(cx - 42, y0 + h * 0.52), (cx - 6, y0 + h * 0.52), (cx - 14 + leg, y0 + h), (cx - 52 + leg, y0 + h)], fill=bottom)
    d.polygon([(cx + 6, y0 + h * 0.52), (cx + 42, y0 + h * 0.52), (cx + 52 - leg, y0 + h), (cx + 14 - leg, y0 + h)], fill=bottom)
    d.rounded_rectangle([cx - 52, y0 + head * 1.25, cx + 52, y0 + h * 0.56], 22, fill=top)
    d.rounded_rectangle([cx - 70, y0 + head * 1.4, cx - 48, y0 + h * 0.5], 10, fill=top)
    arm = 30 if kind == 'talk' else 0
    d.rounded_rectangle([cx + 48, y0 + head * 1.4 - arm, cx + 70, y0 + h * 0.5 - arm], 10, fill=top)
    d.ellipse([cx - head * 0.5, y0, cx + head * 0.5, y0 + head * 1.2], fill=skin)
    d.chord([cx - head * 0.55, y0 - 6, cx + head * 0.55, y0 + head * 0.7], 180, 360, fill=hair)
    # facing right: an eye and a nose on the right of the face; the mouth open when talking
    d.ellipse([cx + head * 0.2, y0 + head * 0.45, cx + head * 0.3, y0 + head * 0.55], fill=(20, 16, 14))
    if kind == 'talk':
        d.ellipse([cx + head * 0.12, y0 + head * 0.82, cx + head * 0.38, y0 + head * 0.98], fill=(70, 20, 20))
    else:
        d.line([cx + head * 0.12, y0 + head * 0.9, cx + head * 0.36, y0 + head * 0.9], fill=(70, 30, 30), width=3)
    # (no name on the figure: it would mirror when they face left; the game writes it above their head)
    meta = {'w': FW, 'hh': FH, 'h': 720.0, 'ax': float(cx), 'fy': float(FH - 20), 'top': round(y0, 1), 'placeholder': True}
    return im, meta


def cast():
    os.makedirs(os.path.join(SEQ, 'art/sprites'), exist_ok=True)
    metas = {}
    for cid, (name, scale, cols) in CAST.items():
        for kind in ('idle', 'talk', 'walk1'):
            k = '%s_ph_%s' % (cid, kind)
            path = os.path.join(SEQ, 'art/sprites', k + '.webp')
            im, meta = figure(name, scale, cols, kind)
            metas[k] = meta
            if writable(path):
                im.save(path, quality=90); mark(path)
    # what is still a placeholder (a .ph marker beside it): the game draws those rooms' hotspots as boxes
    still = lambda sub, ext: sorted(f[:-len(ext) - 3] for f in os.listdir(os.path.join(SEQ, 'art', sub)) if f.endswith(ext + '.ph'))
    art = {'bg': still('bg', '.jpg'), 'stills': still('stills', '.jpg')}
    with open(os.path.join(SEQ, 'js/sprites_placeholders.js'), 'w') as fh:
        fh.write('// Generated by sequel/scripts/placeholders.py: stand-in figures for the new cast, and the list of art that is\n'
                 '// still a placeholder. Do not edit by hand.\n')
        fh.write('window.SPRITES = Object.assign(window.SPRITES || {}, ' + json.dumps(metas, indent=0, sort_keys=True) + ');\n')
        fh.write('window.PLACEHOLDER_ART = ' + json.dumps(art) + ';\n')
    return len(metas)


if __name__ == '__main__':
    print('rooms %d, stills %d, cast frames %d' % (rooms(), stills(), cast()))
