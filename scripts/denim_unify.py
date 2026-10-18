# Gives Alan's jeans one colour in every frame: the faded grey-blue most of his paintings have (the user chose it over
# the bright blue of a few side and walk frames, which made the jeans flicker as he walked).
# The denim (blue, below his chest) of a frame that is visibly off moves by a Lab mean/spread transfer toward the
# reference, feathered at the edge; nothing else changes. Frames already close are left alone.
#   python3 scripts/denim_unify.py            -> art/review/alan/denim/ (before/after sheet), nothing overwritten
#   python3 scripts/denim_unify.py --apply    -> also overwrites the frames (sprites and approved review frames)
import glob, json, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/alan/denim/')
REF = ['alan_walkDown', 'alan_pass', 'alan_walkUp', 'alan_front', 'alan_back', 'alan_lantern', 'alan_idle2', 'alan_phone',
       'alan_front_walk1', 'alan_back_walk1', 'alan_lwalk1', 'alan_dress4', 'alan_flirt']


def denim(a):
    rgb = a[..., :3]; hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    m = (a[..., 3] > 200) & (hsv[..., 0] > 92) & (hsv[..., 0] < 128) & (hsv[..., 1] > 25) & (hsv[..., 2] > 30)
    m[:int(a.shape[0] * 0.35)] = False          # his eyes, a blue phone or cup at chest height stay as they are
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    return m


def lab(a): return cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)


def target():
    L = []
    for f in REF:
        a = np.asarray(Image.open(f'{ROOT}/art/sprites/{f}.webp').convert('RGBA')); L.append(lab(a)[denim(a)])
    L = np.concatenate(L); return L.mean(0), L.std(0)


def unify(a, t):
    m = denim(a)
    if m.sum() < 1500: return None, 0
    x = lab(a); mu, sd = x[m].mean(0), x[m].std(0)
    off = max(abs(mu[0] - t[0][0]), np.hypot(mu[1] - t[0][1], mu[2] - t[0][2]))
    if off < 2.5: return None, off
    new = (x - mu) / np.maximum(sd, 1) * t[1] + t[0]
    w = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)[..., None]
    rgb = cv2.cvtColor(np.clip(x * (1 - w) + new * w, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    return np.dstack([rgb, a[..., 3]]), off


def frames():
    out = [(os.path.basename(p)[:-5], p) for p in sorted(glob.glob(f'{ROOT}/art/sprites/alan_*.webp'))]
    c = json.load(open(f'{ROOT}/art/review/candidates.json'))['candidates']
    out += [(x['id'], os.path.join(ROOT, x['src'])) for x in c if x.get('char') == 'alan' and x['id'].startswith('alan_') and x.get('src')]
    return out


def main():
    apply = '--apply' in sys.argv
    t = target(); os.makedirs(OUT, exist_ok=True)
    changed = []
    for name, path in frames():
        a = np.asarray(Image.open(path).convert('RGBA'))
        b, off = unify(a, t)
        if b is None: continue
        changed.append((name, path, a, b, off))
        if apply: Image.fromarray(b.astype(np.uint8), 'RGBA').save(path, lossless=True, quality=100)
    # before/after sheet: the lower half of each changed frame
    tiles = []
    for name, _, a, b, off in changed:
        cells = []
        for im in (a, b):
            p = Image.fromarray(im.astype(np.uint8), 'RGBA'); bg = Image.new('RGBA', p.size, (60, 64, 80, 255)); bg.alpha_composite(p)
            c = bg.crop((0, int(p.height * 0.35), p.width, p.height)); c.thumbnail((150, 300)); cells.append(c.convert('RGB'))
        t_ = Image.new('RGB', (320, 320), (30, 30, 34)); t_.paste(cells[0], (5, 15)); t_.paste(cells[1], (165, 15))
        ImageDraw.Draw(t_).text((4, 2), f'{name} ({off:.0f})', fill=(255, 230, 150)); tiles.append(t_)
    cols = 6; rows = (len(tiles) + cols - 1) // cols
    sh = Image.new('RGB', (cols * 320, max(1, rows) * 320))
    for i, t_ in enumerate(tiles): sh.paste(t_, ((i % cols) * 320, (i // cols) * 320))
    sh.save(OUT + 'before_after.jpg', quality=85)
    print(len(changed), 'frames' + (' rewritten' if apply else ' would change'), [c[0] for c in changed])


if __name__ == '__main__':
    main()
