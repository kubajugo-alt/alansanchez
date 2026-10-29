# Face height / figure height on every repaint's front view (YuNet), the approved cast's range first.
import sys, os
sys.argv = ['x', '']
exec(open(os.path.join(os.path.dirname(__file__), 'lineup.py')).read().split('H=860')[0])
sys.path.insert(0, R + 'scripts'); import head_scale
def frontof(f):
    a = key(R + 'art/designs/' + f + '.png'); return Image.fromarray(a).crop(figures(a)[-1])
def sprite(n):
    im = Image.open(R + 'art/sprites/' + n + '.webp').convert('RGBA'); a = np.asarray(im); ys, xs = np.where(a[..., 3] > 40)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
L = [('Alan', sprite('alanv_front_k')), ('Vasco', frontof('vasco_v9')), ('Baute', frontof('baute_v5_front')), ('Rafa', frontof('rafa_v3')),
     ('Yeray', frontof('yeray_v7')), ('Carmen', frontof('carmen_v2')), ('Nieves', frontof('nieves_v2')), ('Guard', frontof('guard_v4'))]
L += [(n.capitalize(), frontof(n + '_hf1')) for n in ['clerk', 'chano', 'pino', 'lolo', 'fermin', 'mercedes', 'montesdeoca', 'surfer', 'gail', 'derek']]
for n, im in L:
    im = im.resize((round(im.width * 1000 / im.height), 1000), Image.LANCZOS); b = head_scale.face(im)
    print(f'{n:12s} face/height {b[3] / 1000:.3f}' if b else f'{n:12s} no face found')
