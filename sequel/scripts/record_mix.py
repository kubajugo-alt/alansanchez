#!/usr/bin/env python3
"""Lay the game's voice lines (and a room's music, low) onto a silent recording from tests/record_scene.mjs, at the
times the game started them. Playwright records picture only. 2026-10-30, the user: 'the recording seems to not
have sound'.

  python3 sequel/scripts/record_mix.py <video.webm> <lines.json> <out.mp4> <seconds to trim from the start>
"""
# lay the voice lines (and the room's music, low) onto a silent recording at the times the game started them
import json, subprocess, sys, os
video, logf, out, trim = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
SEQ = '/home/user/alansanchez/sequel'
log = json.load(open(logf))['log']
inputs, filters, labels = ['-ss', str(trim), '-i', video], [], []
music = os.path.join(SEQ, 'audio/music/museum_hall.aac.m4a')
inputs += ['-stream_loop', '-1', '-i', music]; filters.append('[1:a]volume=0.18[m]'); labels.append('[m]')
n = 2
for t, lid in log:
    f = os.path.join(SEQ, 'audio/voice', lid + '.mp3')
    if not os.path.exists(f) or t < trim: continue
    ms = int((t - trim) * 1000) + 150
    inputs += ['-i', f]; filters.append(f'[{n}:a]adelay={ms}|{ms},volume=1.6[v{n}]'); labels.append(f'[v{n}]'); n += 1
filters.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=first[a]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filters), '-map', '0:v', '-map', '[a]',
                '-c:v', 'libx264', '-crf', '28', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
                '-shortest', '-movflags', '+faststart', out], check=True)
print(n - 2, 'lines laid in')
