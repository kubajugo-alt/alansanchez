import json, sys
from PIL import Image, ImageDraw, ImageFont
R = '/home/user/alansanchez'
t = open(R + '/js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
def place(k, U, meta=None):
    m = dict(M[k], **(meta or {})); s = U / m['h']; im = Image.open(R + f'/art/sprites/{k}.webp').convert('RGBA')
    return im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS), m['ax'] * s, m['fy'] * s
def ghost(pairs, out, U=300, metas=None):
    cw, ch = 360, U + 80; S = Image.new('RGB', (cw * len(pairs), ch), (210, 210, 205)); d = ImageDraw.Draw(S)
    for i, (a, b) in enumerate(pairs):
        L = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
        for k, al in ((a, 0.5), (b, 0.5)):
            im, ax, fy = place(k, U, (metas or {}).get(k)); im.putalpha(im.getchannel('A').point(lambda v: int(v * al)))
            L.alpha_composite(im, (int(cw / 2 - ax), int(ch - 30 - fy)))
        S.paste(L, (i * cw, 0), L); d.text((i * cw + 4, ch - 14), f'{a} + {b}', fill=(0, 0, 0))
        d.line([(i * cw, ch - 30), (i * cw + cw, ch - 30)], fill=(200, 0, 0))
    S.save(out)
if __name__ == '__main__':
    ghost([('vasco', 'vasco_keys'), ('vasco_talk2', 'vasco_talk4'), ('abilio', 'abilio_read'), ('rui', 'rui_talk'), ('ze', 'ze_hammer'), ('npc_washer1', 'npc_washer1_b'), ('ze', 'ze_strip3')], 'ghost.png')
