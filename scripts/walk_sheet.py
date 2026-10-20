# Walk step 2: a whole 8-pose walk cycle painted by Gemini in ONE image, so every pose shares the same person,
# clothes, light and scale (the cycles built pose by pose mixed sources and sizes). The guide is the 2x4 sheet of
# stick figures from art/review/walkref/pose<N>.png (near limbs white, far limbs dark): top row 1 3 5 7 (near leg
# leading), bottom row 9 11 13 15 (far leg leading). The result is split into its 8 figures, each fitted onto the
# base frame's canvas at ONE shared scale (median of the head-to-waist fits), feet on the floor line, head over head.
#   python3 scripts/walk_sheet.py alan alan_walkA "<who: a man in a brown leather jacket...>" art/review/alan/walk6
#   python3 scripts/walk_sheet.py --split-only alan alan_walkA "" art/review/alan/walk6     (re-split a saved raw)
# then, if the two halves' hair differs: python3 scripts/walk_head_swap.py art/review/alan/walk6 0.15
# Logs to art/review/log.md like gen_image.py. The API key comes from .env and is never printed.
import base64, datetime, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_image import api_key, on_key, png_b64, MODEL, PRICE, ROOT
from canva_restyle_fit import key_out
from walk_canva_fit import measure

POSES = [1, 3, 5, 7, 9, 11, 13, 15]
CURRENT = {'alan_walkA': ['alan_walkA', 'alan_walkDown', 'alan_pass', 'alan_walkUp', 'alan_walkB']}  # the frames in the game now
_t = open(os.path.join(ROOT, 'js/sprites.js')).read(); SPR = json.loads(_t[_t.index('{'):_t.rindex('}') + 1])
CW, CH = 480, 720
PAD = 40  # headroom over the base frame's canvas: the stretched legs lift the head (the candidates' meta adds it to fy and hh)
# after the trunk fit, one more uniform scale so the head is the size it is in his other frames: Alan's sheet came
# back with heads 91.5 px wide (walk lab measure) against 93 in the walk he has now and 94.5 standing; x1.025 puts
# it between the two
HEAD_K = {'alan_walkA': 1.025}


def stick_sheet():
    sheet = Image.new('RGB', (CW * 4, CH * 2), 'white')
    for i, n in enumerate(POSES):
        p = Image.open(os.path.join(ROOT, f'art/review/walkref/pose{n}.png')).convert('RGB')
        d = ImageDraw.Draw(p); d.rectangle((0, 0, 40, 24), fill='white')          # drop the pose number
        sheet.paste(p, ((i % 4) * CW + (CW - p.width) // 2, (i // 4) * CH))
    return sheet


def generate(base, who, out_dir):
    from google import genai
    client = genai.Client(api_key=api_key(), http_options={'timeout': 300_000})
    ref = Image.open(os.path.join(ROOT, f'art/sprites/{base}.webp')).convert('RGBA')
    sheet = stick_sheet(); sheet.save(os.path.join(out_dir, 'guide.png'))
    text = ('Match the FIRST image exactly: the same person, face, hair, clothes, colours, painted 1990s point-and-click '
            'adventure style, line weight and lighting.\n\n'
            f'Paint a walk-cycle sheet of this character ({who}): EIGHT full figures, head to feet, in two rows of four, laid '
            'out exactly like the stick figures in the SECOND image, every figure in the pose of the stick figure in the same '
            'place. All eight walk to the RIGHT, seen exactly from the side, at exactly the same size as each other, with the '
            'feet of each row on one level ground line. In the stick figures the WHITE limbs are his NEAR arm and leg (the '
            'side facing the viewer) and the DARK limbs are his FAR arm and leg (half hidden behind his body). Follow which '
            'leg is in front in every figure: in the top row his NEAR leg is the one in front, in the bottom row his FAR '
            'leg is in front. Keep the head height and body length the same in all eight; only the legs and arms change. '
            f'Plain flat green background (RGB (0, 177, 64)) everywhere, no shadows, no floor, no lines, no numbers, '
            'figures well apart, nothing cropped.')
    parts = [{'type': 'text', 'text': text},
             {'type': 'image', 'data': png_b64(on_key(ref)), 'mime_type': 'image/png'},
             {'type': 'image', 'data': png_b64(sheet, 1600), 'mime_type': 'image/png'}]
    it = client.interactions.create(model=MODEL, input=parts,
                                    response_format={'type': 'image', 'aspect_ratio': '4:3', 'image_size': '2K'})
    if not getattr(it, 'output_image', None) or not it.output_image.data: sys.exit('no image returned')
    raw = Image.open(io.BytesIO(base64.b64decode(it.output_image.data))); raw.save(os.path.join(out_dir, 'sheet_raw.png'))
    u = it.usage; pin, ptxt, pimg = PRICE[MODEL]
    img_out = sum(m.tokens or 0 for m in (u.output_tokens_by_modality or []) if str(m.modality).lower().endswith('image'))
    txt_out = (u.total_output_tokens or 0) - img_out + (u.total_thought_tokens or 0)
    cost = (u.total_input_tokens or 0) * pin / 1e6 + txt_out * ptxt / 1e6 + img_out * pimg / 1e6
    with open(os.path.join(ROOT, 'art/review/log.md'), 'a') as fh:
        fh.write(f"| {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%d %H:%M} | {MODEL} | art/sprites/{base}.webp, "
                 f"walkref sheet | walk sheet, 8 poses (scripts/walk_sheet.py) | {os.path.relpath(out_dir, ROOT)}/sheet_raw.png | "
                 f"{u.total_input_tokens}/{img_out}+{txt_out} | {cost:.4f} |\n")
    print(f'sheet saved; cost ${cost:.4f}')


def split(base, out_dir):
    import cv2
    g = key_out(np.asarray(Image.open(os.path.join(out_dir, 'sheet_raw.png')).convert('RGB')))
    m = (g[..., 3] > 128).astype(np.uint8)
    # join each figure's pieces (a gap at the boots or a hand) before labelling
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(m, np.ones((15, 15), np.uint8)), 8)
    big = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > st[1:, cv2.CC_STAT_AREA].max() * 0.2]
    if len(big) != 8: sys.exit(f'expected 8 figures, found {len(big)}')
    cy = {i: st[i, 1] + st[i, 3] / 2 for i in big}; mid = np.median(list(cy.values()))
    rows = [sorted([i for i in big if cy[i] < mid], key=lambda i: st[i, 0]), sorted([i for i in big if cy[i] >= mid], key=lambda i: st[i, 0])]
    if [len(r) for r in rows] != [4, 4]: sys.exit(f'rows of {[len(r) for r in rows]}, not 4 and 4')
    figs = []
    for i in rows[0] + rows[1]:
        x, y, w, h = st[i, :4]; f = g[y:y + h, x:x + w].copy(); f[..., 3] *= (lab[y:y + h, x:x + w] == i)
        figs.append(f)
    b = np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{base}.webp')).convert('RGBA')); H, W = b.shape[:2]
    bt, bb, bx, bw = measure(b)
    scales = []
    for f in figs:
        t, bo, x, w = measure(f); scales.append((bw - bt) / (w - t))
    s = float(np.median(scales)); print('per-figure scales', ' '.join(f'{k:.3f}' for k in scales), f'-> one scale {s:.3f}')
    s *= HEAD_K.get(base, 1.0)
    ys = [measure(f)[1] for f in figs]
    for r in range(2):  # each row stands on one ground line: its lowest foot
        row_floor = max(ys[r * 4:(r + 1) * 4])
        for k in range(r * 4, (r + 1) * 4): ys[k] = row_floor
    # Gemini paints the legs shorter than the game's frames do (the trunk matches, so the scale above is right for
    # the body): stretch every figure below the waist by ONE factor, so the legs are as long as in the character's
    # current walk frames (median waist-to-floor) and he doesn't shrink when he starts walking
    cur = [measure(np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{k}.webp')).convert('RGBA'))) for k in CURRENT[base]]
    target = float(np.median([bo - w for t, bo, x, w in cur]))
    legs = [(measure(f)[1] - measure(f)[3]) * s / HEAD_K.get(base, 1.0) for f in figs]  # the legs' target is set before the head scale
    k = target / float(np.median(legs)); print(f'legs {np.median(legs):.0f}px -> {target:.0f}px: stretched x{k:.3f}')
    for n_, f, floor in zip(POSES, figs, ys):
        gi = Image.fromarray(f, 'RGBA'); gi = gi.resize((round(gi.width * s), round(gi.height * s)), Image.LANCZOS)
        gi = stretch_legs(gi, k)
        t2, b2, x2, _ = measure(np.asarray(gi))
        lift = (floor - measure(f)[1]) * s * k    # a foot raised off the row's ground line stays raised
        c = Image.new('RGBA', (W, H + PAD)); c.alpha_composite(gi, (int(round(bx - x2)), int(round(PAD + bb - b2 - lift))))
        path = os.path.join(out_dir, f'pose{n_}.png'); c.save(path)
        print(f'pose{n_}: figure {b2 - t2}px tall (base {bb - bt}), raised {lift:.0f}px')
        if n_ in (1, 9):  # contact frames: the leading heel on the floor (scripts/walk_heel_down.py)
            import subprocess
            m = SPR[base]; subprocess.run([sys.executable, os.path.join(ROOT, 'scripts/walk_heel_down.py'), path, path,
                                           str(m['ax']), str(m['fy'] + PAD), str(m['h'])], check=True)


def stretch_legs(im, k):
    """Scale the part of the figure below the waist by k vertically, about the feet; the trunk moves up whole."""
    import cv2
    a = np.asarray(im).astype(np.float32); t, bo, x, w = measure(a.astype(np.uint8))
    pad = int((bo - w) * (k - 1)) + 2; a = np.pad(a, ((pad, 0), (0, 0), (0, 0)))
    w += pad; bo += pad; H2, W2 = a.shape[:2]
    yy, xx = np.mgrid[0:H2, 0:W2].astype(np.float32)
    w_new = bo - (bo - w) * k                      # the waist's new row
    sy = np.where(yy >= w_new, bo - (bo - yy) / k, yy + (w - w_new)).astype(np.float32)
    return Image.fromarray(np.clip(cv2.remap(a, xx, sy, cv2.INTER_LINEAR), 0, 255).astype(np.uint8), 'RGBA')


if __name__ == '__main__':
    args = sys.argv[1:]; only = args[0] == '--split-only'
    if only: args = args[1:]
    who, base, desc, out = args[0], args[1], args[2], os.path.join(ROOT, args[3])
    os.makedirs(out, exist_ok=True)
    if not only: generate(base, desc, out)
    split(base, out)
