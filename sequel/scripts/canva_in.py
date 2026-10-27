#!/usr/bin/env python3
"""Bring a Canva export into the game: download it, keep the original, size it for its slot, retire the placeholder.

  python3 sequel/scripts/canva_in.py <kind> <name> <export url> [canva media id] [note]

kind: bg (1280x720 room painting, art/bg/<name>.jpg), still (1536x864, art/stills/<name>.jpg),
      figure (a character design on a flat background, kept as art/designs/<name>.png for cutting out).
The original export goes to art/canva/<name>.png (git-ignored), every call is logged in art/canva/log.md.
"""
import os, sys, urllib.request, datetime
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
kind, name, url = sys.argv[1:4]
media = sys.argv[4] if len(sys.argv) > 4 else ''
note = sys.argv[5] if len(sys.argv) > 5 else ''
raw_dir = os.path.join(SEQ, 'art/canva'); os.makedirs(raw_dir, exist_ok=True)
raw = os.path.join(raw_dir, name + '.png')
urllib.request.urlretrieve(url, raw)
im = Image.open(raw).convert('RGB' if kind != 'figure' else 'RGBA')
if kind in ('bg', 'still'):
    W, H = (1280, 720) if kind == 'bg' else (1536, 864)
    # fill the frame (crop the long side to 16:9), then resize
    r = W / H
    if im.width / im.height > r:
        nw = round(im.height * r); x = (im.width - nw) // 2; im = im.crop((x, 0, x + nw, im.height))
    else:
        nh = round(im.width / r); y = (im.height - nh) // 2; im = im.crop((0, y, im.width, y + nh))
    im = im.resize((W, H), Image.LANCZOS)
    out = os.path.join(SEQ, 'art', 'bg' if kind == 'bg' else 'stills', name + '.jpg')
    im.save(out, quality=90)
else:
    d = os.path.join(SEQ, 'art/designs'); os.makedirs(d, exist_ok=True)
    out = os.path.join(d, name + '.png'); im.save(out)
if os.path.exists(out + '.ph'):
    os.remove(out + '.ph')
with open(os.path.join(raw_dir, 'log.md'), 'a') as f:
    f.write(f'- {datetime.date.today()} {kind} `{name}` Canva media {media} -> {os.path.relpath(out, SEQ)} {note}\n')
print(out, im.size)
