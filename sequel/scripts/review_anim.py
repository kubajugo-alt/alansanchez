#!/usr/bin/env python3
"""Clips of every animation the game has now, for one review page (the user, 2026-10-29: "do the page showing me all the
animations").

  python3 sequel/scripts/review_anim.py            renders art/review/anim/*.mp4 and anim.json

  walk_<run>.mp4    Alan's Ludo walk cycles (window.LUDO), in place, at their own frame rate, looped twice
  talk_<frame>.mp4  each figure on the painting it stands on, saying one of its lines with the lip-sync mouths and
                    blinking (js/faces.js, js/lipsync.js; the voice under it), then a moment quiet
The mouth follows the line's Rhubarb cues with the engine's stand-ins (js/engine/faces.js: G borrows B, H borrows C,
a pause is A; the jaw's in-betweens on the way open), blinks half / shut / half. Nothing here changes the game.
"""
import json, os, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SEQ, 'art/review/anim')
BG = (46, 43, 52)
FPS = 25
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)


def node(js):
    return json.loads(subprocess.run(['node', '-e', 'global.window={};' + js], capture_output=True, text=True, check=True, cwd=SEQ).stdout)


FACES = node("require('./js/faces.js');console.log(JSON.stringify(window.FACES))")
LIPS = node("require('./js/lipsync.js');console.log(JSON.stringify(window.LIPSYNC))")
LUDO = node("require('./js/sprites_ludo.js');console.log(JSON.stringify(window.LUDO))")
sprite = lambda k: Image.open(os.path.join(SEQ, 'art/sprites', k + '.webp')).convert('RGBA')


def encode(frames_dir, out, audio=None, fps=FPS):
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(frames_dir, '%05d.png')]
    if audio: cmd += ['-i', audio, '-c:a', 'aac', '-b:a', '96k']
    cmd += ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', out]
    subprocess.run(cmd, check=True)


def walk(run):
    keys = LUDO[run]['frames']; fps = LUDO[run]['fps']
    ims = [sprite(k) for k in keys]
    W = max(i.width for i in ims); H = max(i.height for i in ims); s = 520 / H
    tmp = tempfile.mkdtemp(dir=OUT); n = 0
    for _ in range(2):
        for im in ims:
            fr = Image.new('RGB', (round(W * s) + 40 + (round(W * s) + 40) % 2, 560), BG)
            t = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
            fr.paste(t, ((fr.width - t.width) // 2, 540 - t.height), t)
            fr.save(os.path.join(tmp, f'{n:05d}.png')); n += 1
    encode(tmp, os.path.join(OUT, f'walk_{run}.mp4'), fps=fps); subprocess.run(['rm', '-r', tmp])


STANDIN = {'G': 'B', 'H': 'C', 'X': 'A'}


def mouth_for(D, m):
    if m in D['mouths']: return m
    k, _, f = m.partition('_')
    if f and int(f) < 60: k = 'B'
    if k not in D['mouths']: k = STANDIN.get(k)
    return k if k in D['mouths'] else None


def talk(fr, who, line, label):
    D = FACES[fr]; x, y, w, h = D['box']; dur, cues = LIPS[who][line]
    base = sprite(fr); s = 560 / base.height
    lid_at = {1.0: 'half', 1.04: 'closed', 1.11: 'half', 1.15: None}
    def lid(t):
        u = t % 2.7
        if 1.0 <= u < 1.04: return 'half'
        if 1.04 <= u < 1.11: return 'closed'
        if 1.11 <= u < 1.15: return 'half'
        return None
    open_ = {'X': 0, 'A': 0, 'B': .25, 'G': 0, 'F': 1.75, 'H': 2, 'C': 2.75, 'E': 3.25, 'D': 6.25}
    tmp = tempfile.mkdtemp(dir=OUT); n = 0; prev = 'A'; ib = []
    total = dur + 1.0
    for i in range(int(total * FPS)):
        t = i / FPS; m = 'A'; m2 = 'A'
        if t < dur:
            for t0, v in cues:
                if t0 <= t + 0.06: m = v
            m = 'A' if m == 'X' else m
            # opening wider: the jaw passes its 40% and 70% in-betweens, a frame each
            if m != prev and m in 'CDEFH' and open_[m] > open_[prev]: ib = [m + '_40', m + '_70']
            prev = m
            m2 = ib.pop(0) if ib else m
        im = base.copy()
        mk = mouth_for(D, m2) if t < dur else None
        if mk:
            p = Image.open(os.path.join(SEQ, 'art/faces', f'{fr}_{mk}.webp')).convert('RGBA')
            im.paste(Image.new('RGBA', (w, h)), (x, y)); im.alpha_composite(p, (x, y))
        l = lid(t); l = l if l in D['eyes'] else ('closed' if l and 'closed' in D['eyes'] else None)
        if l: im.alpha_composite(Image.open(os.path.join(SEQ, 'art/faces', f'{fr}_eyes_{l}.webp')).convert('RGBA'), (x, y))
        frm = Image.new('RGB', (960, 600), BG)
        body = im.resize((round(im.width * s), 560), Image.LANCZOS); frm.paste(body, (30, 20), body)
        pad = round(max(w, h) * 0.35); hx, hy = max(0, x - pad), max(0, y - pad)
        head = im.crop((hx, hy, x + w + pad, y + h + pad)); k = 520 / head.height
        head = head.resize((round(head.width * k), 520), Image.LANCZOS); frm.paste(head, (min(400, 940 - head.width), 20), head)
        ImageDraw.Draw(frm).text((400, 556), label, fill=(225, 220, 210), font=FONT)
        frm.save(os.path.join(tmp, f'{n:05d}.png')); n += 1
    wav = os.path.join(tmp, 'a.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(SEQ, 'audio/voice', line + '.mp3'), '-af', f'apad=whole_dur={total}', wav], check=True)
    encode(tmp, os.path.join(OUT, f'talk_{fr}.mp4'), wav); subprocess.run(['rm', '-r', tmp])


def pick_line(who):
    L = LIPS[who]; ok = [k for k, v in L.items() if 2.5 <= v[0] <= 5 and os.path.exists(os.path.join(SEQ, 'audio/voice', k + '.mp3'))]
    return sorted(ok or [k for k in L if os.path.exists(os.path.join(SEQ, 'audio/voice', k + '.mp3'))])[0]


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True); meta = {'walks': [], 'talks': []}
    for run in ['alanv_walk_side', 'alanv_walk_front', 'alanv_walk_back', 'alanb_walk_side', 'alanb_walk_front', 'alanb_walk_back']:
        walk(run); meta['walks'].append(run); print('walk', run, flush=True)
    for fr, D in FACES.items():
        who = D.get('who')
        if not who or not D['mouths']: continue
        lw = 'alan' if who in ('alan', 'alanf') else who
        if lw not in LIPS: continue
        line = pick_line(lw)
        talk(fr, lw, line, f'{fr}  ·  {line}' + ('' if D.get('ok') else '  (waiting for approval)'))
        meta['talks'].append({'frame': fr, 'who': who, 'line': line, 'ok': bool(D.get('ok'))}); print('talk', fr, line, flush=True)
    json.dump(meta, open(os.path.join(OUT, 'anim.json'), 'w'), indent=1)
