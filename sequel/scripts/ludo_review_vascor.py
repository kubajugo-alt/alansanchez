#!/usr/bin/env python3
"""Review clips for Vasco's repainted walking set (vascor_*, vascor_dinner_*), next to Alan's equivalents in the game.
Review only: nothing goes into the game here.

  python3 sequel/scripts/ludo_review_vascor.py

Per run (frames from scripts/ludo_fit.py: art/review/ludo/<run>/fit/fNN.webp, fit.json):
  art/review/ludo/<run>/preview.mp4   the run at its frame rate, 480 px tall, walks looped 3x, turns played 3x
  art/review/ludo/<run>/strip.png     a contact strip (every frame of a turn, every third of a walk)
And art/review/ludo/vascor_set_preview.mp4: a grid, one column a run (walk side/front/back, turn side->front/left/
back), rows Alan (vest; the installed, looped frames from art/sprites/), Vasco (repaint) and Vasco (dinner). Every
figure is scaled the same (720 px figure height -> one cell height) and stood on the same baseline by its feet.
"""
import glob, json, os, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = os.path.join(SEQ, 'art/review/ludo')
SPR = os.path.join(SEQ, 'art/sprites')
BG = (46, 43, 52)
FPS = 12
COLS = ['walk_side', 'walk_front', 'walk_back', 'turn_side_front', 'turn_side_left', 'turn_side_back']
ROWS = [('alanv', 'Alan (game, installed)'), ('vascor', 'Vasco repaint (new)'), ('vascor_dinner', 'Vasco dinner (new)')]
FONT = '/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf'


def font(n):
    try: return ImageFont.truetype(FONT, n)
    except OSError: return ImageFont.load_default()


def sprite_meta():
    js = "global.window={};for(const f of require('fs').readdirSync('js'))if(/^sprites.*\\.js$/.test(f))require('./js/'+f);console.log(JSON.stringify(window.SPRITES||{}))"
    return json.loads(subprocess.run(['node', '-e', js], cwd=SEQ, capture_output=True, text=True, check=True).stdout)


def run_frames(run, meta):
    """[(image, meta)] for a review run (fit/) or, failing that, the installed frames in art/sprites/."""
    fs = sorted(glob.glob(os.path.join(L, run, 'fit', 'f*.webp')))
    if fs:
        m = json.load(open(os.path.join(L, run, 'fit.json')))['meta']
        return [(Image.open(f).convert('RGBA'), m) for f in fs]
    keys = sorted(k for k in meta if k.startswith(run + '_') and k[len(run) + 1:].isdigit())
    return [(Image.open(os.path.join(SPR, k + '.webp')).convert('RGBA'), meta[k]) for k in keys]


def place(canvas, im, m, cx, base, fig_h):
    """Puts a frame on canvas: its feet (ax, fy) at (cx, base), its 720 px figure fig_h tall."""
    s = fig_h / m['h']
    fr = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    canvas.alpha_composite(fr, (round(cx - m['ax'] * s), round(base - m['fy'] * s)))


def encode(d, out, fps=FPS):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(d, '%04d.png'),
                    '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out], check=True)


def sequence(n, walk, total):
    """Frame indices for total output frames: a walk loops; a turn plays, holds its last frame half a second, repeats."""
    if walk: return [i % n for i in range(total)]
    cyc = list(range(n)) + [n - 1] * (FPS // 2)
    return [cyc[i % len(cyc)] for i in range(total)]


def per_run(run, fr):
    walk = '_walk_' in run
    H = 480; fig = 420; W = round(max(m['w'] for _, m in fr) * fig / 720) + 60
    tmp = tempfile.mkdtemp()
    n = len(fr); total = n * 3 if walk else (n + FPS // 2) * 3
    for k, i in enumerate(sequence(n, walk, total)):
        c = Image.new('RGBA', (W, H), BG + (255,)); im, m = fr[i]
        place(c, im, m, W / 2, H - 30, fig)
        ImageDraw.Draw(c).text((8, 6), f'{run}  {i:02d}/{n}', fill=(220, 214, 200), font=font(16))
        c.convert('RGB').save(os.path.join(tmp, f'{k:04d}.png'))
    encode(tmp, os.path.join(L, run, 'preview.mp4')); shutil.rmtree(tmp)
    pick = list(range(0, n, 3)) if walk else list(range(n))
    ch = 260; cw = round(max(m['w'] for _, m in fr) * (ch - 20) / 720) + 6
    st = Image.new('RGBA', (cw * len(pick), ch + 18), BG + (255,))
    for j, i in enumerate(pick):
        im, m = fr[i]; place(st, im, m, j * cw + cw / 2, ch - 4, ch - 20)
        ImageDraw.Draw(st).text((j * cw + 3, ch), f'{i:02d}', fill=(200, 194, 180), font=font(12))
    st.convert('RGB').save(os.path.join(L, run, 'strip.png'))


def montage(meta):
    cw, chh, top, left = 220, 300, 30, 150
    W, H = left + cw * len(COLS), top + chh * len(ROWS)
    cells = {}
    for p, _ in ROWS:
        for c in COLS:
            fr = run_frames(f'{p}_{c}', meta)
            cells[(p, c)] = fr
    total = FPS * 10
    tmp = tempfile.mkdtemp(); f1, f2 = font(15), font(13)
    for k in range(total):
        cv = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(cv)
        for ci, c in enumerate(COLS): d.text((left + ci * cw + 8, 6), c.replace('_', ' '), fill=(230, 224, 210), font=f1)
        for ri, (p, label) in enumerate(ROWS):
            y0 = top + ri * chh
            d.text((8, y0 + chh / 2 - 10), label, fill=(230, 224, 210), font=f2)
            d.line([(0, y0), (W, y0)], fill=(70, 66, 78))
            for ci, c in enumerate(COLS):
                fr = cells[(p, c)]; x0 = left + ci * cw
                if not fr:
                    d.text((x0 + 12, y0 + chh / 2 - 16), 'no back view\npainted', fill=(150, 144, 135), font=f2)
                    continue
                i = sequence(len(fr), '_walk_' in c or c.startswith('walk'), k + 1)[k]
                im, m = fr[i]; place(cv, im, m, x0 + cw / 2, y0 + chh - 12, chh - 40)
        cv.convert('RGB').save(os.path.join(tmp, f'{k:04d}.png'))
    encode(tmp, os.path.join(L, 'vascor_set_preview.mp4')); shutil.rmtree(tmp)


def main():
    meta = sprite_meta()
    for p in ('vascor', 'vascor_dinner'):
        for c in COLS:
            run = f'{p}_{c}'
            fr = run_frames(run, meta) if os.path.isdir(os.path.join(L, run, 'fit')) else []
            if fr: per_run(run, fr); print('wrote', run, len(fr), 'frames')
    montage(meta); print('wrote', os.path.join(L, 'vascor_set_preview.mp4'))


if __name__ == '__main__':
    main()
