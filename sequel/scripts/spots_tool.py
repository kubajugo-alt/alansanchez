#!/usr/bin/env python3
"""The hotspot tool's files (HANDOFF entry 146): the rooms' paintings at 1280x720 and the hotspot data.

  node sequel/scripts/tests/spots_dump.mjs http://localhost:8099/ sequel/art/review/spots/data.json   (the game served)
  python3 sequel/scripts/spots_tool.py <out dir>

Copies art/review/spots/index.html and data.json into <out dir> and writes <out dir>/bg/<painting>.jpg (1280x720,
JPEG q80) for every painting data.json names; publish <out dir> as the artifact (index.html with the rest as files).
The map is left out: its hotspots are the pins, drawn where core.js puts them.
"""
import json, os, shutil, sys
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(SEQ, 'art/review/spots')
out = sys.argv[1]
os.makedirs(os.path.join(out, 'bg'), exist_ok=True)
data = json.load(open(os.path.join(SRC, 'data.json')))
data.pop('map', None)
json.dump(data, open(os.path.join(out, 'data.json'), 'w'), separators=(',', ':'))
shutil.copy(os.path.join(SRC, 'index.html'), os.path.join(out, 'index.html'))
n = 0
for r in data.values():
    for bg in r['bgs']:
        p = os.path.join(SEQ, 'art/bg', bg + '.jpg'); q = os.path.join(out, 'bg', bg + '.jpg')
        if os.path.exists(p) and not os.path.exists(q):
            Image.open(p).convert('RGB').resize((1280, 720), Image.LANCZOS).save(q, quality=80, optimize=True); n += 1
print(len(data), 'rooms;', n, 'paintings written to', out)
