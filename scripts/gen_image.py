# Edits an existing Canva sprite with Gemini (variations only: new poses, in-betweens, mouths, fixes).
#   python3 scripts/gen_image.py --ref art/sprites/alan_side.webp [--ref extra.png ...] \
#       --prompt "same pose, facing left" --out art/review/alan/test/alan_side_left.png
# The first --ref is the main reference: palette, canvas size and feet anchor are matched to it.
# Every call also sends art/style_refs/*.png and the fixed style text. Each result is keyed to
# transparency, colour-matched, framed, saved, put side by side with the reference in the output
# folder (<out>_sbs.png) and logged to art/review/log.md. Nothing here touches the game.
# The API key comes from .env (GEMINI_API_KEY) and is never printed or written anywhere.
import argparse, base64, datetime, glob, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = 'gemini-nano-banana-2.1'
STYLE = ('Match the reference images exactly: same painted 1990s point-and-click adventure style, '
         'same line weight, same colour palette, same lighting and proportions. '
         'Change only what the prompt asks for.')
KEY_RGB = (0, 177, 64)  # flat chroma green behind every reference; keyed out of the result
# USD per 1M tokens (ai.google.dev pricing, standard tier)
PRICE = {'gemini-nano-banana-2.1': (1.50, 7.50, 30.00), 'gemini-3-pro-image': (2.00, 12.00, 120.00),
         'gemini-3.1-flash-lite-image': (0.25, 1.50, 30.00)}


def api_key():
    if os.environ.get('GEMINI_API_KEY'): return os.environ['GEMINI_API_KEY']
    for line in open(os.path.join(ROOT, '.env')):
        k, _, v = line.strip().partition('=')
        if k == 'GEMINI_API_KEY': return v.strip().strip('"\'')
    sys.exit('GEMINI_API_KEY missing from .env')


def sprite_meta(path):
    """Anchor (ax, fy) from js/sprites.js when the reference is a game sprite."""
    name = os.path.splitext(os.path.basename(path))[0]
    try:
        txt = open(os.path.join(ROOT, 'js/sprites.js')).read()
        return json.loads(txt[txt.index('{'):txt.rindex('}') + 1]).get(name)
    except (OSError, ValueError):
        return None


def on_key(im):
    """RGBA sprite -> RGB on the flat key colour, padded so the figure has room."""
    im = im.convert('RGBA'); pad = int(im.height * 0.06)
    bg = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), KEY_RGB + (255,))
    bg.alpha_composite(im, (pad, pad)); return bg.convert('RGB')


def png_b64(im, max_side=1024):
    if max(im.size) > max_side:  # keep requests small; the result is re-framed to the reference anyway
        s = max_side / max(im.size); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'PNG'); return base64.b64encode(buf.getvalue()).decode()


def aspect_for(w, h):
    opts = {'1:1': 1, '2:3': 2 / 3, '3:4': .75, '4:5': .8, '9:16': 9 / 16, '1:4': .25,
            '3:2': 1.5, '4:3': 4 / 3, '16:9': 16 / 9}
    return min(opts, key=lambda k: abs(np.log(opts[k] / (w / h))))


def key_out(im):
    """Flat green background -> alpha, with despill on the edge pixels."""
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = g - np.maximum(r, b)                      # how much greener than the other channels
    alpha = np.clip(1 - (green - 25) / 60, 0, 1)      # solid >= 85 over, opaque <= 25 over
    spill = np.clip(green, 0, None) * (alpha < 1)     # pull the leftover green out of the fringe
    a[..., 1] -= spill * 0.85
    out = np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8)
    out = Image.fromarray(out, 'RGBA')
    # keep only the largest connected figure (drops stray specks)
    import cv2
    m = (np.asarray(out)[..., 3] > 128).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    if n > 2:
        keep = np.zeros_like(m)
        big = st[1:, cv2.CC_STAT_AREA].max()
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] >= big * 0.02: keep[lab == i] = 1
        arr = np.asarray(out).copy(); arr[..., 3] = arr[..., 3] * cv2.dilate(keep, np.ones((3, 3), np.uint8))
        out = Image.fromarray(arr, 'RGBA')
    return out


def defringe(im):
    """Remove the pale 'sticker' outline Gemini draws: pale, unsaturated pixels within 3px of
    transparency become transparent, then the edge is softened by one pixel."""
    import cv2
    a = np.asarray(im).copy(); al = a[..., 3]
    rgb = a[..., :3].astype(np.int16); mx, mn = rgb.max(-1), rgb.min(-1)
    pale = (mx > 60) & (mx - mn < 40)          # lighter than the ink line and greyish: halo, not paint
    for _ in range(4):                         # peel the rim from the outside in, up to 4px
        edge = cv2.dilate((al <= 128).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
        kill = edge & pale & (al > 0)
        if not kill.any(): break
        al[kill] = 0
    al[:] = cv2.GaussianBlur(al, (3, 3), 0.6)
    a[..., 3] = al; return Image.fromarray(a, 'RGBA')


def match_palette(im, ref):
    """Lock colours: per-channel mean/std transfer in Lab over opaque pixels (Reinhard)."""
    import cv2
    a, r = np.asarray(im).copy(), np.asarray(ref.convert('RGBA'))
    ma, mr = a[..., 3] > 200, r[..., 3] > 200
    la = cv2.cvtColor(a[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    lr = cv2.cvtColor(r[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    for c in range(3):
        sa, sr = la[..., c][ma], lr[..., c][mr]
        k = np.clip(sr.std() / max(sa.std(), 1e-3), 0.8, 1.25)
        la[..., c] = (la[..., c] - sa.mean()) * k + sr.mean()
    a[..., :3] = cv2.cvtColor(np.clip(la, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    return Image.fromarray(a, 'RGBA')


def feet(im):
    """(x, y) of the point between the feet: centre of the lowest 4% of the figure, bottom row."""
    al = np.asarray(im)[..., 3] > 128; ys, xs = np.where(al)
    bot = ys.max(); sel = ys > bot - (bot - ys.min()) * 0.04
    return float(xs[sel].mean()), float(bot)


def frame_to(im, ref, meta, keyed_size):
    """Put the result in the reference's pixel space, keeping Gemini's own composition: the reference was sent
    padded on the key colour, and the result has the same aspect, so one scale maps it back (pose changes
    such as a raised arm no longer shrink him). Feet that land near the reference's feet line snap onto it.
    Returns (image, meta): the canvas grows to fit the figure, and meta holds the reference's anchor moved
    into the new canvas."""
    kw, kh = keyed_size; pad = (kw - ref.width) // 2
    s = kh / im.height
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    al = np.asarray(im)[..., 3] > 128; ys, xs = np.where(al)
    x0, y0, x1, y1 = xs.min() - pad, ys.min() - pad, xs.max() + 1 - pad, ys.max() + 1 - pad  # figure box in ref coords
    fy = meta['fy'] if meta else float(np.where(np.asarray(ref)[..., 3] > 128)[0].max())
    dy = fy - (y1 - 1) if abs(fy - (y1 - 1)) < ref.height * 0.08 else 0             # stand on the feet line
    L, T = min(0, x0) - 6, min(0, y0 + dy) - 6
    R, B = max(ref.width, x1) + 6, max(ref.height, y1 + dy) + 6
    canvas = Image.new('RGBA', (int(R - L), int(B - T)), (0, 0, 0, 0))
    canvas.alpha_composite(im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)), (int(x0 - L), int(y0 + dy - T)))
    m = dict(meta or {}); m['ax'] = round((meta['ax'] if meta else ref.width / 2) - L, 1); m['fy'] = round(fy - T, 1)
    m['w'], m['hh'] = canvas.width, canvas.height
    return canvas, m


def fig_height(im):
    ys = np.where((np.asarray(im)[..., 3] > 128).any(1))[0]
    return float(ys.max() - ys.min())


def match_height(im, m, refs, meta):
    """Scale the framed result so the figure is as tall as the references are on average (each measured in
    its own standing height h, and put in the main reference's), about the feet; h stays the reference's."""
    hs = [fig_height(Image.open(r).convert('RGBA')) / sprite_meta(r)['h'] for r in refs if sprite_meta(r)]
    if not hs or not meta: return im, m
    k = (sum(hs) / len(hs)) * meta['h'] / fig_height(im)
    if abs(k - 1) < 0.01: return im, m
    print(f'height matched: x{k:.3f}')
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    m = dict(m); m['ax'] = round(m['ax'] * k, 1); m['fy'] = round(m['fy'] * k, 1); m['w'], m['hh'] = im.width, im.height
    return im, m


def reframe(raw_path, ref_path, out, palette=True):
    """Re-run keying, clean-up, palette and framing on a saved raw result (no API call). palette=False for a
    new pose whose clothes differ from the reference (a whole-figure colour match would tint them)."""
    ref = Image.open(ref_path).convert('RGBA'); meta = sprite_meta(ref_path); keyed = on_key(ref)
    new = defringe(key_out(Image.open(raw_path)))
    if palette: new = match_palette(new, ref)
    new, m = frame_to(new, ref, meta, keyed.size)
    new.save(out); json.dump(m, open(os.path.splitext(out)[0] + '_meta.json', 'w'))
    side_by_side(ref, new, os.path.splitext(out)[0] + '_sbs.png')


def side_by_side(ref, new, path):
    h = 720; tiles = []
    for im, label in ((ref, 'original'), (new, 'new')):
        s = h / im.height; t = im.resize((round(im.width * s), h), Image.LANCZOS)
        bg = Image.new('RGBA', (max(t.width, 300) + 40, h + 40), (40, 44, 52, 255))
        bg.alpha_composite(t, ((bg.width - t.width) // 2, 10)); ImageDraw.Draw(bg).text((10, h + 18), label, fill=(230, 230, 230, 255))
        tiles.append(bg)
    out = Image.new('RGB', (sum(t.width for t in tiles), h + 40))
    x = 0
    for t in tiles: out.paste(t, (x, 0)); x += t.width
    out.save(path)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--ref', action='append', required=True, help='main reference first; more allowed')
    p.add_argument('--prompt', required=True)
    p.add_argument('--out', required=True, help='output PNG path (under art/review/)')
    p.add_argument('--model', default=MODEL)
    p.add_argument('--size', default='2K', choices=['1K', '2K'])
    p.add_argument('--no-frame', action='store_true', help='skip anchor/size matching (e.g. close-ups)')
    p.add_argument('--no-palette', action='store_true', help='new pose with different clothes: skip the whole-figure colour match')
    p.add_argument('--match-height', action='store_true', help='solo in-betweens: scale the figure to the mean height of the --ref sprites (Gemini sometimes paints him smaller)')
    a = p.parse_args()

    from google import genai
    client = genai.Client(api_key=api_key(), http_options={'timeout': 240_000})
    main_ref = Image.open(a.ref[0]).convert('RGBA'); meta = sprite_meta(a.ref[0])
    keyed = on_key(main_ref)
    style = sorted(glob.glob(os.path.join(ROOT, 'art/style_refs/*.png')))
    style = [s for s in style if os.path.basename(s).split('.')[0] != os.path.basename(a.ref[0]).split('.')[0]]
    text = (f'{STYLE}\n\nThe FIRST image is the character to edit. The other images are style references only. '
            f'Keep exactly the same person, clothes, face and proportions as the first image. '
            f'Full figure, head to feet, nothing cropped, on a perfectly flat plain green background '
            f'(RGB {KEY_RGB}) with no shadow, floor or scenery.\n\nEdit: {a.prompt}')
    parts = [{'type': 'text', 'text': text}, {'type': 'image', 'data': png_b64(keyed), 'mime_type': 'image/png'}]
    for extra in a.ref[1:]:
        parts.append({'type': 'image', 'data': png_b64(on_key(Image.open(extra))), 'mime_type': 'image/png'})
    for s in style:
        parts.append({'type': 'image', 'data': png_b64(on_key(Image.open(s))), 'mime_type': 'image/png'})

    it = client.interactions.create(model=a.model, input=parts,
                                    response_format={'type': 'image', 'aspect_ratio': aspect_for(*keyed.size), 'image_size': a.size})
    if not getattr(it, 'output_image', None) or not it.output_image.data:
        sys.exit('no image returned')
    raw = Image.open(io.BytesIO(base64.b64decode(it.output_image.data)))
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    stem = os.path.splitext(a.out)[0]
    raw.save(stem + '_raw.png')

    new = defringe(key_out(raw))
    if not a.no_palette: new = match_palette(new, main_ref)
    if not a.no_frame:
        new, m = frame_to(new, main_ref, meta, keyed.size)
        if a.match_height: new, m = match_height(new, m, a.ref, meta)
        json.dump(m, open(stem + '_meta.json', 'w'))
    new.save(a.out)
    side_by_side(main_ref, new, stem + '_sbs.png')

    u = it.usage; pin, ptxt, pimg = PRICE.get(a.model, PRICE[MODEL])
    img_out = sum(m.tokens or 0 for m in (u.output_tokens_by_modality or []) if str(m.modality).lower().endswith('image'))
    txt_out = (u.total_output_tokens or 0) - img_out + (u.total_thought_tokens or 0)
    cost = (u.total_input_tokens or 0) * pin / 1e6 + txt_out * ptxt / 1e6 + img_out * pimg / 1e6
    log = os.path.join(ROOT, 'art/review/log.md')
    if not os.path.exists(log):
        open(log, 'w').write('# Gemini generation log\n\n| date | model | reference | prompt | output | tokens in/out | cost USD |\n|---|---|---|---|---|---|---|\n')
    rel = lambda x: os.path.relpath(os.path.abspath(x), ROOT)
    with open(log, 'a') as fh:
        fh.write(f"| {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%d %H:%M} | {a.model} | {', '.join(rel(r) for r in a.ref)} | "
                 f"{a.prompt.replace('|', '/')} | {rel(a.out)} | {u.total_input_tokens}/{img_out}+{txt_out} | {cost:.4f} |\n")
    print(f'saved {rel(a.out)} and {rel(stem + "_sbs.png")}; cost ${cost:.4f}')


if __name__ == '__main__':
    main()
