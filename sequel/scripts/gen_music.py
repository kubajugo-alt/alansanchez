#!/usr/bin/env python3
"""Instrumental soundtracks for the rooms, from Google's Lyria 3 Pro (Gemini API), for the user to pick from.

  python3 sequel/scripts/gen_music.py [--takes 2] [ids...]      (no ids: every brief below)

Each brief is a room (or a room's mood); each take is one ~2-minute instrumental, saved raw to
audio/music_src/<id>_<take>.mp3 (git-ignored). The rooms keep their ambience beds: the music sits on top of them, as
in Game I. Every call is logged with its cost in audio/music_src/ledger.json, and nothing is started past the budget
(the user: stay within the 23 USD credit; we stop at 20). The key is GEMINI_API_KEY in the root .env, never printed.
"""
import base64, json, os, re, sys, threading, time, urllib.request, urllib.error

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(SEQ)
SRC = os.path.join(SEQ, 'audio/music_src')
LEDGER = os.path.join(SRC, 'ledger.json')
MODEL, PRICE, BUDGET = 'lyria-3-pro-preview', 0.08, 20.0

BASE = ('Instrumental only, no vocals, no singing, no spoken words. Score for a point-and-click adventure game set in '
        'Las Palmas de Gran Canaria in June 1996, the week of San Juan: a quiet literary mystery about a cave, the sea '
        'and an old bell. About two minutes, steady from start to end so it can loop, no big ending, no fade-out. ')
BRIEFS = {
    'title': 'Main theme. A slow, haunting melody on nylon-string guitar and timple over soft strings and a distant bell; '
             'warm and melancholy, the shortest night of the year, something lost under the sea.',
    'elena_car': 'Night, 1996, a woman driving alone up a mountain road into cloud. Sparse, uneasy: a low pulsing synth pad, '
                 'a muted piano figure, faint radio-static texture. Tense but restrained.',
    'gando': 'An island airport arrivals hall in the afternoon: light, bright, a little wry. Soft bossa-like guitar and '
             'brushed drums, a vibraphone, holiday arrival with a hint of something unsaid.',
    'hotel_lobby': 'A slightly faded 1960s seaside hotel lobby: a gentle lounge piece, upright piano and soft double bass, '
                   'a little old-fashioned and charming, unhurried.',
    'hotel_room': 'A small hotel room at night with the balcony open to the sea: intimate, tender, slow solo nylon guitar '
                  'with a soft cello line. Quiet, close, a little sad.',
    'hotel_restaurant': 'A hotel breakfast restaurant: light, cheerful palm-court music, piano and a small string trio, '
                        'polite and a little kitsch, background music for tourists.',
    'canteras': 'A long city beach promenade under grey summer cloud: Canarian timple and nylon guitar, gentle waves of '
                'rhythm, warm and slightly melancholy, people strolling.',
    'beach': 'On the sand of a city beach under the panza de burro, the low grey summer cloud: airy, open, gentle; '
             'soft guitar harmonics, light hand percussion, a sense of the Atlantic breathing.',
    'museum_hall': 'An evening reception in an old island museum full of skulls in glass cases: chamber music with a '
                   'dark edge, string quartet, elegant on top and quietly unsettling underneath.',
    'museum_courtyard': 'A stone courtyard behind a party at dusk, a woman smoking alone: a solo classical guitar, '
                        'reflective and intimate, the party muffled far away.',
    'archive': 'A basement archive of old papers and photographs: hushed, patient, curious. Plucked strings, a clock-like '
               'pizzicato, soft low clarinet, dust and secrets.',
    'baute_office': 'A senior archaeologist\'s office at night, being searched: tense, careful, pizzicato strings and a low '
                    'pulse, stealthy.',
    'santa_ana': 'A sunny cathedral square with bronze dog statues and street musicians: Canarian folk, timple and guitar, '
                 'bright and easy, a little festive.',
    'santa_ana_inside': 'Inside a cool, dim Gothic cathedral: slow organ drones and a distant wordless choir texture, '
                        'reverent, spacious, still.',
    'belfry': 'A bell chamber at the top of a cathedral tower with a stopped clock: suspended, airy, ticking textures, '
              'soft bell-like tones and strings, time standing still.',
    'colon': 'An old colonial house turned library with a parrot: scholarly and warm, harpsichord and guitar, a dry wit.',
    'isleta': 'A fishermen\'s quarter by the harbour: weathered, salty folk guitar and accordion, slow, the nets and the boats.',
    'rafa_bar': 'A late-night bar in the old town with a domino table: smoky, warm, a little drunk; Cuban-tinged guitar '
                'and double bass, a lazy bolero rhythm.',
    'rafa_studio': 'A painter\'s studio full of drawings at night: dreamy and intimate, piano and soft strings, something '
                   'beautiful and a little frightening being remembered.',
    'carmen_flat': 'A small apartment with a balcony over the old town at first light: quiet, tender, hopeful; a gentle solo piano with a soft cello.',
    'landrover': 'Driving up into the mountains at night towards the summit: urgent and driving, pulsing low strings, '
                 'percussion, rising tension.',
    'camp': 'An archaeologists\' camp high in the mountains above the clouds at night: vast, cold, starry; sustained '
            'strings and a lonely flute.',
    'cave6': 'Inside a sacred Guanche cave by torchlight: ancient and mysterious, low drones, hand drums far away, '
             'breathy flute, stone and darkness.',
    'vault': 'A sealed underground vault where the sea is rising: dark, tense, slow heartbeat percussion, deep brass and '
             'strings, dread building but controlled.',
    'map': 'The city map: a short light travelling theme on guitar and timple, curious, gently moving.',
}


def key():
    if os.environ.get('GEMINI_API_KEY'): return os.environ['GEMINI_API_KEY']
    m = re.search(r'^GEMINI_API_KEY=(.+)$', open(os.path.join(ROOT, '.env')).read(), re.M)
    if not m: sys.exit('GEMINI_API_KEY missing from .env')
    return m.group(1).strip().strip('"\'')


lock = threading.Lock()


def ledger():
    return json.load(open(LEDGER)) if os.path.exists(LEDGER) else {'calls': [], 'spent': 0.0}


def charge(entry):
    with lock:
        L = ledger(); L['calls'].append(entry); L['spent'] = round(L['spent'] + entry['usd'], 2)
        json.dump(L, open(LEDGER, 'w'), indent=1)
        return L['spent']


def take(mid, n):
    out = os.path.join(SRC, f'{mid}_{n}.mp3')
    if os.path.exists(out): return f'{mid}_{n}: already made'
    with lock:
        if ledger()['spent'] + PRICE > BUDGET: return f'{mid}_{n}: skipped, budget reached'
    body = {'contents': [{'parts': [{'text': BASE + BRIEFS[mid]}]}]}
    for attempt in range(3):
        try:
            req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
                                         data=json.dumps(body).encode(), headers={'x-goog-api-key': key(), 'Content-Type': 'application/json'})
            d = json.loads(urllib.request.urlopen(req, timeout=600).read())
            parts = (d.get('candidates') or [{}])[0].get('content', {}).get('parts', [])
            audio = next((p['inlineData'] for p in parts if 'inlineData' in p), None)
            if not audio:
                charge({'id': mid, 'take': n, 'usd': 0.0, 'note': 'no audio returned'})
                return f'{mid}_{n}: no audio returned ({json.dumps(d)[:160]})'
            open(out, 'wb').write(base64.b64decode(audio['data']))
            spent = charge({'id': mid, 'take': n, 'usd': PRICE, 'time': time.strftime('%Y-%m-%d %H:%M')})
            return f'{mid}_{n}: ok (spent so far {spent:.2f} USD)'
        except urllib.error.HTTPError as e:
            msg = e.read()[:200].decode(errors='replace')
            if e.code in (429, 500, 503) and attempt < 2: time.sleep(20 * (attempt + 1)); continue
            return f'{mid}_{n}: HTTP {e.code} {msg}'
        except Exception as e:
            if attempt < 2: time.sleep(10); continue
            return f'{mid}_{n}: {type(e).__name__} {e}'


if __name__ == '__main__':
    os.makedirs(SRC, exist_ok=True)
    takes = int(sys.argv[sys.argv.index('--takes') + 1]) if '--takes' in sys.argv else 2
    ids = [a for a in sys.argv[1:] if a in BRIEFS] or list(BRIEFS)
    jobs = [(m, n) for m in ids for n in range(1, takes + 1)]
    sem = threading.Semaphore(3)
    def run(j):
        with sem: print(take(*j), flush=True)
    ts = [threading.Thread(target=run, args=(j,)) for j in jobs]
    for t in ts: t.start()
    for t in ts: t.join()
    print(f'spent in all: {ledger()["spent"]:.2f} USD of the {BUDGET:.0f} budget')
