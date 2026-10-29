# The repaints so far, side and front views side by side per character, at the cast's heights (Alan 1.0, the rest 0.92).
import sys, os
sys.argv = ['x', '']
exec(open(os.path.join(os.path.dirname(__file__), 'lineup.py')).read().split('H=860')[0])
from PIL import ImageDraw, ImageFont
R = '/home/user/alansanchez/sequel/'
def sprite(n):
    im = Image.open(R + 'art/sprites/' + n + '.webp').convert('RGBA'); a = np.asarray(im); ys, xs = np.where(a[..., 3] > 40)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
def both(f, fb=None):
    figs = figures(key(R + 'art/designs/' + f + '.png')); a = key(R + 'art/designs/' + f + '.png')
    side = Image.fromarray(a).crop(figs[0]); front = Image.fromarray(a).crop(figs[-1])
    if fb: front = Image.fromarray(key(R + 'art/designs/' + fb + '.png')).crop(figures(key(R + 'art/designs/' + fb + '.png'))[-1])
    return side, front
C = [('Alan', (sprite('alanv_side_k'), sprite('alanv_front_k')), 1.0, 'in the game'),
     ('Vasco', both('vasco_v9'), 1.0, 'approved'), ('Baute', both('baute_v4', 'baute_v5_front'), 1.0, 'approved'),
     ('Rafa', both('rafa_v3'), 1.0, 'approved'), ('Yeray', both('yeray_v7'), 1.0, 'approved'), ('Carmen', both('carmen_v2'), .92, 'approved'),
     ('Nieves', both('nieves_v2'), .92, 'kept from overnight'), ('Guard', both('guard_v4'), .92, 'redo 2, new')]
H = 620; font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22); small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
tiles = []
for n, (s, f), k, st in C:
    h = round(H * k); s = s.resize((round(s.width * h / s.height), h), Image.LANCZOS); f = f.resize((round(f.width * h / f.height), h), Image.LANCZOS)
    t = Image.new('RGB', (s.width + f.width + 30, H + 70), (232, 228, 222)); t.paste(s, (5, H + 10 - h), s); t.paste(f, (s.width + 25, H + 10 - h), f)
    d = ImageDraw.Draw(t); d.text((6, H + 18), n, fill=(30, 30, 30), font=font); d.text((6, H + 46), st, fill=(110, 100, 110), font=small); tiles.append(t)
W = sum(t.width for t in tiles) + 20 * (len(tiles) + 1); S = Image.new('RGB', (W, H + 90), (232, 228, 222)); x = 20
d = ImageDraw.Draw(S)
for t in tiles: S.paste(t, (x, 10)); x += t.width + 20
d.line((0, H + 20, W, H + 20), fill=(160, 160, 160), width=2)
S.save(R + 'art/review/cast_repaint/both_angles.jpg', quality=90); print(S.size)
