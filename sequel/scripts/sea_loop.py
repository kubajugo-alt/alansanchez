#!/usr/bin/env python3
"""Seamless sea loops (docs/review/env_movement.md, fix G1; HANDOFF entry 137).

  python3 sequel/scripts/sea_loop.py <room> [<room> ...]     (--check: measure only)

Kling eases into a loop's start and end image, so the game's sea clips (scripts/sea_clips.py, art/video/<room>.mp4)
slowed to a near stop over their last frames and then jumped back to the first: 3 to 8 times a normal frame's change,
every five seconds. For each room this:
  1. measures the change from frame to frame inside the clip's mask (art/video/<room>_mask.png, alpha);
  2. drops the eased frames at both ends (a step under SLOW x the median);
  3. cross-fades the last N frames into the first N (frame i of the loop's end gets the head's frame i with weight
     (i + 1) / N), so the last frame is the head's frame N - 1 and leads into the first exactly as any two frames lead into each other;
  4. re-encodes art/video/<room>.mp4 (h264, crf 20) and .webm (VP9), the clip's size and place unchanged.
The clips before this are kept in art/designs/sea_loops_v1/ (left out of the export).
"""
import json, os, shutil, subprocess, sys
import numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VID = os.path.join(SEQ, 'art/video')
KEEP = os.path.join(SEQ, 'art/designs/sea_loops_v1')
SLOW, N, FPS = 0.4, 16, 24


def size(p):
    o = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height',
                                   '-of', 'json', p], capture_output=True, text=True, check=True).stdout)['streams'][0]
    return o['width'], o['height']


def frames(p):
    w, h = size(p)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32)


def mask(room, w, h):
    im = Image.open(os.path.join(VID, room + '_mask.png'))
    a = im.getchannel('A') if im.mode == 'RGBA' else im.convert('L')
    return np.asarray(a.resize((w, h)), np.float32) / 255.0


def steps(a, m):
    d = [float((np.abs(a[k + 1] - a[k]).mean(2) * m).sum() / m.sum()) for k in range(len(a) - 1)]
    jump = float((np.abs(a[0] - a[-1]).mean(2) * m).sum() / m.sum())
    return d, jump


def loop(room, check=False):
    src = os.path.join(KEEP, room + '.mp4') if os.path.exists(os.path.join(KEEP, room + '.mp4')) else os.path.join(VID, room + '.mp4')
    a = frames(src); h, w = a.shape[1:3]; m = mask(room, w, h)
    d, jump = steps(a, m); med = float(np.median(d))
    print(f'{room}: {len(a)} frames, step median {med:.2f}, last 6 {np.mean(d[-6:]):.2f}, jump {jump:.2f} ({jump / med:.1f}x)')
    if check: return
    s, e = 0, len(a) - 1
    while s < len(d) and d[s] < SLOW * med: s += 1
    while e > s and d[e - 1] < SLOW * med: e -= 1
    a = a[s:e + 1]; L = len(a)
    body = a[N:L - N]
    tail = [a[L - N + i] * (1 - (i + 1) / N) + a[i] * ((i + 1) / N) for i in range(N)]
    out = np.concatenate([body, np.stack(tail)]).clip(0, 255).astype(np.uint8)
    d2, j2 = steps(out.astype(np.float32), m)
    print(f'  trimmed {s} + {len(a) and (len(frames(src)) - 1 - e)}, cross-fade {N}: {len(out)} frames ({len(out) / FPS:.1f} s), '
          f'step median {np.median(d2):.2f}, min {min(d2):.2f}, wrap {j2:.2f} ({j2 / np.median(d2):.1f}x)')
    os.makedirs(KEEP, exist_ok=True)
    for ext in ('mp4', 'webm'):
        k = os.path.join(KEEP, room + '.' + ext)
        if not os.path.exists(k): shutil.copyfile(os.path.join(VID, room + '.' + ext), k)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(FPS),
                          '-i', '-', '-an', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-x264-params', 'ipratio=1.0:pbratio=1.0:bframes=0:mbtree=0:aq-mode=0',
                          '-movflags', '+faststart', os.path.join(VID, room + '.mp4')], stdin=subprocess.PIPE)
    p.communicate(out.tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(VID, room + '.mp4'), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0',
                    '-crf', '34', '-row-mt', '1', os.path.join(VID, room + '.webm')], check=True)


if __name__ == '__main__':
    rooms = [x for x in sys.argv[1:] if not x.startswith('--')]
    for r in rooms: loop(r, '--check' in sys.argv)
