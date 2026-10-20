# Sharper stills: the paintings the game zooms into (up to 1.2x, js/engine/stills.js ZMAX) were stored at exactly
# 1280x720, so every zoom upscaled them. Where a painting came from a Gemini repaint, its full-size result
# (<name>_raw.png, 2752x1536) still exists: this resizes it to 1536x864 (the canvas at the largest zoom) and matches
# its colours to the painting in the game now (scripts/gen_image.py match_palette), then replaces art/stills/<name>.jpg.
# A raw is used only if it is the same picture as the game's still (correlation of small greyscale copies > 0.97).
#   python3 scripts/stills_hires.py art/review/stills/crisp2 [art/review/stills/crisp ...]
import glob, os, sys, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_image import match_palette
SIZE = (1536, 864)

def small(im): return np.asarray(im.convert('L').resize((96, 54), Image.BILINEAR), np.float32).ravel()

for d in sys.argv[1:]:
    for raw in sorted(glob.glob(os.path.join(d, 'still_*_raw.png'))):
        name = os.path.basename(raw)[:-len('_raw.png')]; dst = f'art/stills/{name}.jpg'
        if not os.path.exists(dst): print(f'{name}: not in the game, skipped'); continue
        cur = Image.open(dst).convert('RGB'); hi = Image.open(raw).convert('RGB').resize(SIZE, Image.LANCZOS)
        r = np.corrcoef(small(cur), small(hi))[0, 1]
        if r < 0.97: print(f'{name}: the game has a different painting (r={r:.3f}), skipped'); continue
        if cur.size != (1280, 720): print(f'{name}: already {cur.size}, skipped'); continue
        out = match_palette(hi.convert('RGBA'), cur.convert('RGBA')).convert('RGB')
        out.save(dst, quality=90)
        print(f'{name}: r={r:.3f}, {os.path.getsize(dst) // 1024} KB')
