#!/usr/bin/env python3
"""The review page for every animation (art/review/anim/index.html), from review_anim.py's clips and the emotion tests.

  python3 sequel/scripts/review_page.py
"""
import json, os, html

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(SEQ, 'art/review/anim')
meta = json.load(open(os.path.join(A, 'anim.json')))
NAMES = {'alan': 'Alan', 'alanf': 'Alan', 'vasco': 'Vasco', 'carmen': 'Carmen', 'baute': 'Baute', 'rafa': 'Rafa', 'chano': 'Chano',
         'nieves': 'Nieves', 'yeray': 'Yeray', 'pino': 'Doña Pino', 'mercedes': 'Mercedes', 'surfer': 'The surfer', 'guard': 'The guard',
         'clerk': 'The clerk', 'fermin': 'Don Fermín', 'lolo': 'Don Lolo', 'montesdeoca': 'Montesdeoca', 'gail': 'Gail', 'derek': 'Derek'}
WALK = {'alanv': 'tank top', 'alanb': 'blazer'}
VIEW = {'side': 'side', 'front': 'towards us', 'back': 'away'}


def walk_card(run):
    o, _, v = run.split('_', 2)[0], None, run.rsplit('_', 1)[1]
    return (f'<figure class="clip walk"><video src="walk_{run}.mp4" autoplay muted loop playsinline preload="metadata"></video>'
            f'<figcaption><b>{WALK[o]}</b> · walking {VIEW[v]}<span class="tech">{run} · 36 frames · 12 fps</span></figcaption></figure>')


def talk_card(t):
    who = NAMES.get(t['who'], t['who']); fr = t['frame']
    sub = {'alanv_side_k': 'tank top, side', 'alanb_side_k': 'blazer, side', 'alanv_front_k': 'tank top, front'}.get(fr, '')
    pill = '<span class="pill ok">in the game</span>' if t['ok'] else '<span class="pill wait">waiting for you</span>'
    return (f'<figure class="clip talk"><video src="talk_{fr}.mp4" controls playsinline preload="metadata"></video>'
            f'<figcaption><b>{html.escape(who)}</b>{" · " + sub if sub else ""} {pill}<span class="tech">{fr} · line {t["line"]}</span></figcaption></figure>')


walks = ''.join(walk_card(r) for r in meta['walks'])
order = ['alanv_side_k', 'alanb_side_k', 'alanv_front_k']
talks = sorted(meta['talks'], key=lambda t: (order.index(t['frame']) if t['frame'] in order else 9, NAMES.get(t['who'], t['who'])))
talk_html = ''.join(talk_card(t) for t in talks)

page = f'''<title>Shortest Night Animation Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap">
<style>
/* layout: a screening-room contact sheet; sections stack, clips sit in a wrapping grid */
:root {{
  --bg: #efeae4; --panel: #e4ddd5; --ink: #231f26; --muted: #6b6270; --accent: #8a3b5c; --ok: #2f6b4f; --wait: #9a5b12; --screen: #2e2b34;
  --display: "Fraunces", Georgia, serif; --body: "Source Sans 3", system-ui, sans-serif; --mono: "JetBrains Mono", ui-monospace, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #1b1920; --panel: #25222b; --ink: #ece6ee; --muted: #a39aa8; --accent: #d38aa8; --ok: #7cc4a0; --wait: #e2a85a; --screen: #2e2b34; color-scheme: dark }} }}
:root[data-theme="dark"] {{ --bg: #1b1920; --panel: #25222b; --ink: #ece6ee; --muted: #a39aa8; --accent: #d38aa8; --ok: #7cc4a0; --wait: #e2a85a; --screen: #2e2b34; color-scheme: dark }}
body {{ background: var(--bg); color: var(--ink); font: 16px/1.5 var(--body); }}
main {{ max-width: 1240px; margin: 0 auto; padding-block: 32px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 48px; }}
header h1 {{ font: 700 clamp(30px, 5vw, 46px)/1.05 var(--display); margin: 0 0 10px; text-wrap: balance; }}
header p {{ margin: 0; max-width: 65ch; color: var(--muted); }}
.eyebrow {{ font: 400 12px var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }}
section h2 {{ font: 500 26px/1.2 var(--display); margin: 0 0 6px; text-wrap: balance; }}
section > p {{ margin: 0 0 18px; max-width: 65ch; color: var(--muted); }}
.grid {{ display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); }}
.grid.walks {{ grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 1fr)); }}
.clip {{ margin: 0; display: grid; gap: 8px; min-width: 0; }}
.clip video, .clip img {{ width: 100%; max-width: 100%; display: block; background: var(--screen); border-radius: 6px; }}
figcaption {{ font-size: 15px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; min-width: 0; }}
.tech {{ flex-basis: 100%; font: 400 12px var(--mono); color: var(--muted); overflow-wrap: anywhere; }}
.pill {{ font: 600 11px var(--body); letter-spacing: .04em; text-transform: uppercase; padding: 1px 8px; border-radius: 99px; border: 1px solid currentColor; }}
.pill.ok {{ color: var(--ok); }} .pill.wait {{ color: var(--wait); }}
.note {{ background: var(--panel); border-radius: 8px; padding: 14px 18px; max-width: 70ch; }}
.note b {{ font-weight: 600; }}
.wide {{ overflow-x: auto; }} .wide img {{ max-width: none; width: 1400px; }}
@media (prefers-reduced-motion: reduce) {{ .walk video {{ animation: none; }} }}
</style>
<main>
<header>
  <div class="eyebrow">Game II · The Shortest Night · 29 October</div>
  <h1>Every animation in the game, and the ones waiting for you</h1>
  <p>Walks loop silently. Talking clips play with the voice: press play. Every clip is rendered from the game's own files, the same paintings and patches the game draws.</p>
</header>
<section>
  <div class="eyebrow">In the game</div>
  <h2>Alan walking</h2>
  <p>The only full-body animation left in the game: both outfits, three directions. Everyone else stands on their painting.</p>
  <div class="grid walks">{walks}</div>
</section>
<section>
  <div class="eyebrow">In the game, except Alan's front view</div>
  <h2>Talking and blinking</h2>
  <p>Each figure says one of their lines with the lip-sync mouths, blinks, then stays quiet for a moment. Alan's side faces were redone today from the cleaned-up hair and checked at 5x over a dark room colour for pale specks at the jaw. His front view's mouths are new and wait for your approval.</p>
  <div class="grid">{talk_html}</div>
</section>
<section>
  <div class="eyebrow">Test · not in the game</div>
  <h2>Alan's emotions</h2>
  <p>Only the brows, eyes and mouth change. While he talks, the brows and eyes keep the emotion over the lip-sync mouth; when he is quiet, the emotion's own mouth shows. Blinks work in every emotion.</p>
  <div class="grid">
    <figure class="clip talk"><video src="emo_side.mp4" controls playsinline preload="metadata"></video><figcaption><b>Side view</b> · one line in each emotion<span class="tech">neutral, joy, fear, anger, sadness, concern, surprise, embarrassed, mischievous</span></figcaption></figure>
    <figure class="clip talk"><video src="emo_front.mp4" controls playsinline preload="metadata"></video><figcaption><b>Front view</b> · one line in each emotion<span class="tech">same nine, with the new front mouths</span></figcaption></figure>
  </div>
  <figure class="clip" style="margin-top:18px"><div class="wide"><img src="emo_both.jpg" alt="Alan's nine expressions on his side and front views, close up and at game size"></div><figcaption><b>All nine on both views</b><span class="tech">scroll sideways</span></figcaption></figure>
</section>
<section class="note"><b>Not on this page:</b> the rooms' ambient motion (approved earlier), and the cast repaints, which are still being made in Canva. The emotions need an engine layer and a tag per line before they can go in.</section>
</main>
'''
open(os.path.join(A, 'index.html'), 'w').write(page)
print('ok', len(meta['walks']), 'walks', len(meta['talks']), 'talks')
