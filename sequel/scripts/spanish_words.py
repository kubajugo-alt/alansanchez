#!/usr/bin/env python3
"""Spanish words in the Spanish cast's English (the user, 2026-10-30: "replace some words they say in english with their
spanish equivalents. things that are obvious (fiesta, playa, sol, museo etc.)... in about 30% of the sentences they say").

  python3 sequel/scripts/spanish_words.py           list what would change
  python3 sequel/scripts/spanish_words.py --apply   write js/lines.js and print the changed ids (to re-record)

Speakers: those cast.json gives language_code "es" (not the parrot). A line takes one swap from SWAPS (whole
words, case kept), and lines are picked until about 30% of each speaker's sentences have a Spanish word (counting the
ones that already do: señor, cariño, chacho...). The pick is a stable hash of the line id, so a re-run picks the same.
"""
import hashlib, json, os, re, subprocess, sys

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SWAPS = [  # (English, Spanish): longest first; only words a listener understands from context
    ("thank you very much", "muchas gracias"), ("thank you", "gracias"), ("thanks", "gracias"), ("good morning", "buenos días"),
    ("good night", "buenas noches"), ("good evening", "buenas noches"), ("my God", "Dios mío"), ("of course", "claro"),
    ("please", "por favor"), ("hello", "hola"), ("goodbye", "adiós"), ("the beach", "la playa"),
    ("beach", "playa"), ("the party", "la fiesta"), ("party", "fiesta"), ("the sun", "el sol"), ("the museum", "el museo"),
    ("museum", "museo"), ("the sea", "el mar"), ("the island", "la isla"), ("tomorrow", "mañana"), ("coffee", "café"),
    ("the cave", "la cueva"), ("the mountain", "la montaña"), ("the church", "la iglesia"), ("the cathedral", "la catedral"),
    ("the street", "la calle"), ("money", "dinero"), ("the doctor", "el doctor"), ("grandmother", "abuela"), ("yes", "sí"),
    ("okay", "vale"), ("listen,", "oye,"), ("nothing", "nada"), ("the bell", "la campana"), ("wine", "vino"), ("the boat", "el barco"),
]
ALREADY = re.compile(r"señor|señora|cariño|chacho|mi niño|sábila|panza de burro|guagua|papas|gracias|hola|vale|claro|amigo|fiesta|playa|¡|¿", re.I)


def load():
    js = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.LINES))"
    return json.loads(subprocess.run(['node', '-e', js, os.path.join(SEQ, 'js/lines.js')], capture_output=True, text=True, check=True).stdout)


def swap(text):
    out, n = text, 0
    for en, es in SWAPS:
        if n >= 1: break
        pat = re.compile(r'(?<![\w\'])' + re.escape(en) + r'(?![\w\'])', re.I)
        m = pat.search(out)
        if not m: continue
        rep = es[0].upper() + es[1:] if m.group(0)[0].isupper() else es
        out = out[:m.start()] + rep + out[m.end():]; n += 1
    return out if n else None


def main(apply):
    cast = json.load(open(os.path.join(SEQ, 'scripts/cast.json')))['voices']
    who = {k for k, v in cast.items() if v.get('language_code') == 'es' and k != 'parrot'}
    L = load(); changes = {}
    for w in sorted(who):
        ids = [i for i, (s, t) in L.items() if s == w]
        have = sum(1 for i in ids if ALREADY.search(L[i][1]))
        need = round(0.3 * len(ids)) - have
        cands = sorted((i for i in ids if not ALREADY.search(L[i][1]) and swap(L[i][1])), key=lambda i: hashlib.md5(i.encode()).hexdigest())
        for i in cands[:max(0, need)]: changes[i] = swap(L[i][1])
        print(f'{w}: {len(ids)} lines, {have} with Spanish already, +{min(len(cands), max(0, need))}')
    if not apply:
        for i, t in changes.items(): print(f'  {i}: {t}')
        return
    p = os.path.join(SEQ, 'js/lines.js'); s = open(p).read()
    for i, t in changes.items():
        old = L[i][1]; a = json.dumps(old, ensure_ascii=False)
        line_re = re.compile(r'^(  ' + re.escape(i) + r": \['\w+', )(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')", re.M)
        m = line_re.search(s)
        if not m: print('!! not found', i); continue
        q = m.group(2)[0]
        new = q + (t.replace('\\', '\\\\').replace(q, '\\' + q)) + q
        s = s[:m.start(2)] + new + s[m.end(2):]
    open(p, 'w').write(s)
    print(' '.join(changes))


if __name__ == '__main__':
    main('--apply' in sys.argv)
