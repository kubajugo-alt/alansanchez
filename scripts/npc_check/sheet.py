import json, sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
MS = json.load(open('measure.json')); REG = json.load(open('reg.json'))
U = 260; F = ImageFont.load_default()
for c, v in MS.items():
    ks = [r['k'] for r in v['rows'] if not r['pair']]
    if c in REG: b = REG[c]['base']; ks = [b] + [k for k in ks if k != b]
    ims = []
    for k in ks:
        m = M[k]; s = U / m['h']; im = Image.open(R + f'/art/sprites/{k}.webp').convert('RGBA')
        im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
        ims.append((k, im, m['ax'] * s, m['fy'] * s))
    up = max(fy for _, _, _, fy in ims) + 10; dn = max(im.height - fy for _, im, _, fy in ims) + 20
    cols = min(len(ims), 10); rows = (len(ims) + cols - 1) // cols
    cw = max(int(max(ax, im.width - ax)) * 2 for _, im, ax, _ in ims) + 10; cw = min(cw, 420)
    ch = int(up + dn); S = Image.new('RGB', (cw * cols, ch * rows), (205, 205, 200)); d = ImageDraw.Draw(S)
    b0 = ims[0]; top0 = (M[b0[0]]['top'] or 0) * U / M[b0[0]]['h']
    for i, (k, im, ax, fy) in enumerate(ims):
        X, Y = (i % cols) * cw, (i // cols) * ch
        S.paste(im, (int(X + cw / 2 - ax), int(Y + up - fy)), im)
        d.line([(X, Y + up), (X + cw, Y + up)], fill=(200, 40, 40)); d.line([(X, Y + up - U + top0 * 0 ), (X + cw, Y + up - U)], fill=(40, 40, 200))
        d.line([(X + cw / 2, Y + up - 6), (X + cw / 2, Y + up + 6)], fill=(200, 40, 40))
        d.text((X + 3, Y + ch - 14), k, fill=(0, 0, 0), font=F)
    S.save(f'sheets/{c}.png')
print('ok')
