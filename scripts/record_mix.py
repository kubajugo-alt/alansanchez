#!/usr/bin/env python3
"""Put the sound onto a recording from scripts/tests/record_scene.mjs (ported from Game II's sequel/scripts/record_mix.py,
2026-11-04). Playwright records picture only.

  python3 scripts/record_mix.py <recording dir> [out.mp4] [--trim SECONDS] [--rebuild]

The recording dir holds the video (<hash>.webm), log.json and, when the capture worked, audio.webm: the game's own mix
(voices, music, effects, ambience, reverb and ducking as the player hears them). That is laid onto the video by the
sync mark record_scene.mjs makes as the scene starts (a white frame in the picture, a 2 kHz pip in the sound). Without it (or with --rebuild) the sound is rebuilt from log.json as Game II did: each voice line
(audio/voice/<id>.mp3) at the moment the game started it, the music the game played (audio/music/<id>.aac.m4a, low,
from each cue to the next) and the room's ambience beds (LOOPS in js/audio.js, audio/sfx/<file>.mp3, lower). The rebuilt mix has no
effects, no reverb and no ducking: a check of timing, not of the sound.
--trim cuts that many seconds off the start; the default cuts the title screen, the loading and the sync mark.
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
flags, args, rest = sys.argv[1:], [], iter(sys.argv[1:])
for a in rest:
    if a == '--trim': next(rest, None)
    elif not a.startswith('--'): args.append(a)
if not args: raise SystemExit(__doc__)
d = args[0]
rec = json.load(open(os.path.join(d, 'log.json')))
out = args[1] if len(args) > 1 else os.path.join(d, rec['scene'] + '.mp4')
video = os.path.join(d, rec['video'])


import numpy as np
MARK = next((t for t, w, _ in rec['log'] if w == 'mark'), None)   # the sync mark: a white frame and a 2 kHz pip


def video_sync():
    """where the video's clock is against the log's: the white frame record_scene.mjs shows at its mark"""
    if MARK is None: return 0.0
    FPS, W, H = 50, 32, 18
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-t', str(MARK + 15), '-i', video, '-vf', f'fps={FPS},scale={W}:{H},format=gray',
                          '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
    w = np.frombuffer(raw, np.uint8).reshape(-1, H * W).mean(1) > 245
    # the white runs, but not the blank page the recording opens on (white too)
    starts = [i for i in range(1, len(w)) if w[i] and not w[i - 1]]
    if not starts: return 0.0, None
    i = min(starts, key=lambda i: abs(i / FPS - MARK)); j = i
    while j < len(w) and w[j]: j += 1
    return i / FPS - MARK, j / FPS   # (and where the white ends: a busy page can hold it on screen past its 300 ms)


def audio_mark(a):
    """where the pip is in the captured mix (s from its start): the first 10 ms with most of its energy at 2 kHz"""
    SR = 16000
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-t', '60', '-i', a, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                                     capture_output=True, check=True).stdout, np.int16).astype(np.float32) / 32768
    N = SR // 100; k = np.arange(N); ref = np.exp(-2j * np.pi * 2000 * k / SR)
    fr = x[:len(x) // N * N].reshape(-1, N)
    tone = np.abs(fr @ ref) / N * 2; rms = np.sqrt((fr ** 2).mean(1)) * 1.4142 + 1e-6
    hit = np.nonzero((tone > 0.2) & (tone / rms > 0.8))[0]
    return hit[0] / 100 if len(hit) else None


off, white_end = video_sync()   # seconds to add to a log time to land on the video
print(f'sync: the video runs {off:+.2f} s against the log')
for e in rec['log']: e[0] += off
rec['start'] += off; rec['end'] += off
if MARK is not None: MARK += off
trim = float(flags[flags.index('--trim') + 1]) if '--trim' in flags else (max(MARK + 0.35, (white_end or 0) + 0.04) if MARK is not None else max(0.0, rec['start'] - 0.5))
enc = ['-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
       '-movflags', '+faststart']

pip = audio_mark(os.path.join(d, rec['audio'])) if rec.get('audio') and MARK is not None and '--rebuild' not in flags else None
if pip is not None:
    # the captured mix: its pip on the video's white frame, then both trimmed together (past the mark)
    at = MARK - pip
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-itsoffset', f'{at:.3f}', '-i', os.path.join(d, rec['audio']),
                    '-ss', f'{trim:.3f}', '-map', '0:v', '-map', '1:a', *enc, '-shortest', out], check=True)
    print(f'captured mix laid in at {at:.2f} s (its pip at {pip:.2f} s) ->', out)
    raise SystemExit(0)
if rec.get('audio') and '--rebuild' not in flags: print('no sync pip found in the captured mix: rebuilding from the log')

inputs, filters, labels = ['-ss', f'{trim:.3f}', '-i', video], [], []
n = 1
def lay(f, t0, t1, vol, loop=False):
    """one file from t0 to t1 (s on the video's clock, before the trim)"""
    global n
    if not os.path.exists(f) or (t1 is not None and t1 <= trim): return
    ms = max(0, int((t0 - trim) * 1000))
    skip = max(0.0, trim - t0)   # (a bed already playing when the trimmed video starts)
    inputs.extend((['-stream_loop', '-1'] if loop else []) + ['-ss', f'{skip:.3f}', '-i', f])
    cut = f'atrim=0:{t1 - max(t0, trim):.3f},' if t1 is not None else ''
    filters.append(f'[{n}:a]{cut}adelay={ms}|{ms},volume={vol}[a{n}]'); labels.append(f'[a{n}]'); n += 1

log, end = rec['log'], rec['end']
lines = 0
for t, what, lid in log:
    if what == 'voice' and lid:
        lay(os.path.join(ROOT, 'audio/voice', lid + '.mp3'), t, None, 1.0); lines += 1
# the music: each play / cue / song until the next one, or a stop
mus = [(t, w, i) for t, w, i in log if w.startswith('music-')]
for k, (t, w, i) in enumerate(mus):
    if w not in ('music-play', 'music-cue', 'music-song') or not i: continue
    t1 = next((u for u, *_ in mus[k + 1:]), end)
    lay(os.path.join(ROOT, 'audio/music', i + '.aac.m4a'), t, t1, 0.35, loop=True)
# the ambience: a room's bed is one or more loops (LOOPS in js/audio.js: name -> [file, level] or [[file, level], ...])
js = ("const s=require('fs').readFileSync(process.argv[1],'utf8');const m=s.match(/const LOOPS = (\\{[\\s\\S]*?\\});/);"
      "console.log(JSON.stringify(m?eval('('+m[1]+')'):{}))")
LOOPS = json.loads(subprocess.run(['node', '-e', js, os.path.join(ROOT, 'js/audio.js')], capture_output=True, text=True).stdout or '{}')
amb = [(t, i) for t, w, i in log if w == 'ambience' and i]
for k, (t, i) in enumerate(amb):
    t1 = amb[k + 1][0] if k + 1 < len(amb) else end
    beds = LOOPS.get(i, [])
    for f, v in ([beds] if beds and isinstance(beds[0], str) else beds):
        lay(os.path.join(ROOT, 'audio/sfx', f + '.mp3'), t, t1, round(0.6 * v, 3), loop=True)
if not labels: raise SystemExit('nothing to lay in: no lines, music or ambience in the log')
filters.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest[a]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filters), '-map', '0:v', '-map', '[a]',
                *enc, '-shortest', out], check=True)
print(lines, 'lines,', len(labels) - lines, 'music/ambience beds rebuilt ->', out)
