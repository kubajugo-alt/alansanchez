#!/usr/bin/env python3
"""Emotions on a painted face, without repainting the sprite (the user, 2026-10-29: "just have elements of their face
change, to show joy, fear, anger, sadness, concern etc. ... test it on Alan ... use Gemini for that").

  python3 sequel/scripts/face_emotions.py gen   [emotion ...]     Gemini paints the head with each expression
  python3 sequel/scripts/face_emotions.py build                   cut the patches and make the review sheet and clips

Same idea as the mouths and blinks (scripts/face_from_game1.py): the head is cropped from the sprite and enlarged,
Gemini repaints only the brows, eyes and mouth, the result is lined up on the head (an affine fit on the hair, ear
and neck, which must not move), and only the face in front of the ear is kept, feathered and shifted to the
sprite's skin colour. Two patches per emotion, in the face set's box (js/faces.js):
  <frame>_emo_<e>.webp     the whole box with the emotion (silent: replaces the box like a mouth does)
  <frame>_emo_<e>_up.webp  brows and eyes only, soft-edged (talking: laid over the lip-sync mouth, under the blink)
Everything goes to art/review/emotions/<frame>/ for review; nothing here touches the game.
The Gemini key comes from the root .env and is never printed.
"""
import base64, datetime, io, json, os, subprocess, sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(SEQ)
FRAME = 'alanv_side_k'
CROP = (50, 20, 190, 170)  # sprite px: head, ear and neck with room around
K = 5                      # enlargement sent to Gemini
KEY = (0, 177, 64)
OUT = os.path.join(SEQ, 'art/review/emotions', FRAME)
MODEL, PRICE = 'gemini-nano-banana-2.1', (1.50, 7.50, 30.00)
EMO = {
    'joy': 'genuine joy: a broad open smile showing the top teeth, cheeks raised, eyes narrowed and crinkled at the corner, brows relaxed and lifted',
    'fear': 'fear: brows raised high and pulled together, upper eyelid raised so more of the eye shows, lips parted and stretched back tense',
    'anger': 'anger: brows pulled down hard and together, a deep furrow, eyes narrowed in a glare, lips pressed tight in a hard line, jaw set',
    'sadness': 'sadness: the inner end of the brow raised and the outer end dropped, upper eyelid drooping, gaze lowered, mouth corners turned down',
    'concern': 'worried concern: brows slightly raised and drawn together, a small crease between them, eyes attentive, lips closed and slightly tightened, no smile',
    'surprise': 'surprise: brows raised high and arched, eyes wide open, jaw dropped a little with the mouth open in a small oval',
}


def api_key():
    if os.environ.get('GEMINI_API_KEY'): return os.environ['GEMINI_API_KEY']
    for line in open(os.path.join(ROOT, '.env')):
        k, _, v = line.strip().partition('=')
        if k == 'GEMINI_API_KEY': return v.strip().strip('"\'')
    sys.exit('GEMINI_API_KEY missing from .env')


def sprite():
    return Image.open(os.path.join(SEQ, 'art/sprites', FRAME + '.webp')).convert('RGBA')


def base_crop():
    """The head crop, enlarged (RGBA) and on the key colour (what Gemini sees)."""
    c = sprite().crop(CROP).resize(((CROP[2] - CROP[0]) * K, (CROP[3] - CROP[1]) * K), Image.LANCZOS)
    bg = Image.new('RGBA', c.size, KEY + (255,)); bg.alpha_composite(c)
    return c, bg.convert('RGB')


def gen(names):
    from google import genai
    client = genai.Client(api_key=api_key(), http_options={'timeout': 240_000})
    os.makedirs(OUT, exist_ok=True)
    _, keyed = base_crop()
    buf = io.BytesIO(); keyed.save(buf, 'PNG'); data = base64.b64encode(buf.getvalue()).decode()
    ledger = os.path.join(OUT, 'ledger.json'); led = json.load(open(ledger)) if os.path.exists(ledger) else {'spent': 0, 'calls': []}
    for e in names:
        text = ('This is a close-up of a painted character from a point-and-click adventure game: his head in profile, facing right. '
                f'Change ONLY his facial expression, to {EMO[e]}. Only the eyebrows, eyelids, eyes, mouth and the small creases '
                'around them may change. Keep everything else exactly as it is, pixel for pixel: the head\'s position, size and '
                'angle (do not turn or move the head), the hair, the ear, the nose, the jaw and neck, the skin colour, the lighting, '
                'the painted style, the outline and the framing. The expression must read clearly even when the image is shown '
                f'very small. Same flat plain green background (RGB {KEY}).')
        it = client.interactions.create(model=MODEL, input=[{'type': 'text', 'text': text}, {'type': 'image', 'data': data, 'mime_type': 'image/png'}],
                                        response_format={'type': 'image', 'aspect_ratio': '1:1', 'image_size': '1K'})
        if not getattr(it, 'output_image', None) or not it.output_image.data: print(e, 'no image'); continue
        Image.open(io.BytesIO(base64.b64decode(it.output_image.data))).save(os.path.join(OUT, f'{e}_raw.png'))
        u = it.usage
        img_out = sum(m.tokens or 0 for m in (u.output_tokens_by_modality or []) if str(m.modality).lower().endswith('image'))
        txt_out = (u.total_output_tokens or 0) - img_out + (u.total_thought_tokens or 0)
        cost = (u.total_input_tokens or 0) * PRICE[0] / 1e6 + txt_out * PRICE[1] / 1e6 + img_out * PRICE[2] / 1e6
        led['spent'] = round(led['spent'] + cost, 4); led['calls'].append({'e': e, 'usd': round(cost, 4), 'at': f'{datetime.datetime.utcnow():%Y-%m-%d %H:%M}'})
        json.dump(led, open(ledger, 'w'), indent=1)
        print(e, f'${cost:.4f}', 'total', led['spent'])


# ---------------------------------------------------------------- cutting the patches
gray = lambda a: cv2.cvtColor((a[..., :3] / 255).astype(np.float32), cv2.COLOR_RGB2GRAY)


def key_out(rgb):
    a = rgb.astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    al = np.where((g > r + 25) & (g > b + 15), 0, 255).astype(np.uint8)
    al = cv2.erode(al, np.ones((3, 3), np.uint8))
    out = np.dstack([rgb, al]).astype(np.float32)
    out[..., 1] = np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2]) + 10)  # green spill off the outline
    return out


def build():
    base, _ = base_crop(); B = np.asarray(base).astype(np.float32); H, W = B.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    fx, fy, fw, fh = json.loads(open(os.path.join(SEQ, 'js/faces.js')).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))[FRAME]['box']
    # the face in front of the ear, brow to chin (crop px): only here may the expression change
    zone = np.zeros((H, W), np.uint8)
    cv2.fillPoly(zone, [np.array([(290, 170), (470, 150), (560, 240), (560, 560), (330, 560), (290, 420)], np.int32)], 255)
    zone = cv2.GaussianBlur(zone.astype(np.float32) / 255, (0, 0), 10)
    upper = np.clip((345 - yy) / 30, 0, 1).astype(np.float32)          # brows and eyes: above the nose's underside
    fitmask = np.zeros((H, W), np.uint8); fitmask[B[..., 3] > 128] = 255; fitmask[zone > 0.05] = 0
    cheek = (yy > 300) & (yy < 360) & (xx > 330) & (xx < 400) & (B[..., 3] > 200)
    spr = np.asarray(sprite()).astype(np.float32)
    boxA = spr[fy:fy + fh, fx:fx + fw]
    res = {}
    for e in EMO:
        p = os.path.join(OUT, f'{e}_raw.png')
        if not os.path.exists(p): continue
        N = key_out(np.asarray(Image.open(p).convert('RGB').resize((W, H), Image.LANCZOS)))
        warp = np.eye(2, 3, dtype=np.float32)
        try: cc, warp = cv2.findTransformECC(gray(B), gray(N), warp, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), fitmask, 5)
        except cv2.error: cc = 0
        N = cv2.warpAffine(N, warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        N[..., :3] = np.clip(N[..., :3] + (B[cheek, :3].mean(0) - N[cheek, :3].mean(0)), 0, 255)
        full = N * zone[..., None] + B * (1 - zone[..., None])
        up = N.copy(); up[..., 3] = N[..., 3] * zone * upper
        # back to sprite px, and into the face set's box
        def tobox(a):
            s = cv2.resize(a, (CROP[2] - CROP[0], CROP[3] - CROP[1]), interpolation=cv2.INTER_AREA)
            return s[fy - CROP[1]:fy - CROP[1] + fh, fx - CROP[0]:fx - CROP[0] + fw]
        fb, ub = tobox(full), tobox(up)
        Image.fromarray(np.clip(fb, 0, 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, f'{FRAME}_emo_{e}.webp'), lossless=True)
        Image.fromarray(np.clip(ub, 0, 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, f'{FRAME}_emo_{e}_up.webp'), lossless=True)
        res[e] = round(float(cc), 3); print(e, 'fit', res[e])
    sheet(res)


def compose(box_img=None, up=None, lid=None, scale=1):
    """The sprite with a full-box patch (or a mouth), then the brows-and-eyes patch, then a blink, like js/engine/faces.js."""
    D = json.loads(open(os.path.join(SEQ, 'js/faces.js')).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))[FRAME]
    x, y, w, h = D['box']; im = sprite()
    for p, full in ((box_img, True), (up, False), (lid, False)):
        if p is None: continue
        pi = Image.open(p).convert('RGBA') if isinstance(p, str) else p
        if full: im.paste(Image.new('RGBA', (w, h), (0, 0, 0, 0)), (x, y))
        im.alpha_composite(pi, (x, y))
    return im


def sheet(res):
    F = os.path.join(SEQ, 'art/faces/')
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
    cols = [('neutral', None, None)] + [(e, os.path.join(OUT, f'{FRAME}_emo_{e}.webp'), os.path.join(OUT, f'{FRAME}_emo_{e}_up.webp')) for e in res]
    tiles = []
    for n, full, up in cols:
        quiet = compose(full)
        talk = compose(F + f'{FRAME}_D.webp', up)
        blink = compose(full, None, F + f'{FRAME}_eyes_closed.webp')
        heads = [im.crop(CROP).resize(((CROP[2] - CROP[0]) * 2, (CROP[3] - CROP[1]) * 2), Image.LANCZOS) for im in (quiet, talk, blink)]
        game = quiet.crop((0, 0, quiet.width, quiet.height)).resize((round(quiet.width * 300 / quiet.height), 300), Image.LANCZOS)
        t = Image.new('RGB', (max(heads[0].width, game.width) + 20, 300 + 3 * heads[0].height + 120), (232, 228, 222))
        d = ImageDraw.Draw(t); d.text((10, 6), n, fill=(30, 30, 30), font=font)
        t.paste(game, (10, 30), game); yy = 340
        for lab, h_ in zip(('quiet', 'talking (D)', 'blink'), heads):
            t.paste(h_, (10, yy), h_); d.text((14, yy + 2), lab, fill=(90, 90, 90), font=font); yy += h_.height + 25
        tiles.append(t)
    W = sum(t.width for t in tiles); S = Image.new('RGB', (W, tiles[0].height), (232, 228, 222)); x = 0
    for t in tiles: S.paste(t, (x, 0)); x += t.width
    S.save(os.path.join(OUT, 'sheet.jpg'), quality=90); print('sheet', S.size)



def clip(line='alan_ask_baute_cave', fps=25):
    """One line spoken in each emotion (Rhubarb cues, no in-betweens), then a second quiet; with the voice."""
    import tempfile
    F = os.path.join(SEQ, 'art/faces/')
    L = json.loads(open(os.path.join(SEQ, 'js/lipsync.js')).read().split('window.LIPSYNC = ', 1)[1].rstrip().rstrip(';'))['alan'][line]
    dur, cues = L
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
    tmp = tempfile.mkdtemp(dir=OUT); n = 0
    emos = ['neutral'] + [e for e in EMO if os.path.exists(os.path.join(OUT, f'{FRAME}_emo_{e}.webp'))]
    for e in emos:
        full = None if e == 'neutral' else os.path.join(OUT, f'{FRAME}_emo_{e}.webp')
        up = None if e == 'neutral' else os.path.join(OUT, f'{FRAME}_emo_{e}_up.webp')
        for i in range(int((dur + 1.2) * fps)):
            t = i / fps; s = 'X'
            for t0, v in cues:
                if t0 <= t + 0.06: s = v
            s = {'X': 'A', 'G': 'B'}.get(s, s)
            blink = F + f'{FRAME}_eyes_closed.webp' if 1.5 < t % 3.2 < 1.62 else None
            im = compose(F + f'{FRAME}_{s}.webp', up, blink) if t < dur else compose(full, None, blink)
            fr = Image.new('RGB', (1280, 720), (60, 58, 56))
            body = im.resize((round(im.width * 640 / im.height), 640), Image.LANCZOS); fr.paste(body, (80, 40), body)
            head = im.crop(CROP).resize(((CROP[2] - CROP[0]) * 4, (CROP[3] - CROP[1]) * 4), Image.LANCZOS); fr.paste(head, (520, 60), head)
            ImageDraw.Draw(fr).text((520, 660), e + ('  (talking)' if t < dur else '  (quiet)'), fill=(235, 230, 220), font=font)
            fr.save(os.path.join(tmp, f'{n:05d}.png')); n += 1
    voice = os.path.join(SEQ, 'audio/voice', line + '.mp3')
    seg = os.path.join(tmp, 'seg.wav'); allw = os.path.join(tmp, 'all.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', voice, '-af', f'apad=whole_dur={dur + 1.2}', '-ar', '44100', '-ac', '1', seg], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + sum([['-i', seg] for _ in emos], []) + ['-filter_complex', ''.join(f'[{k}:a]' for k in range(len(emos))) + f'concat=n={len(emos)}:v=0:a=1', allw], check=True)
    out = os.path.join(OUT, 'talk_clip.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(tmp, '%05d.png'), '-i', allw,
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-shortest', out], check=True)
    subprocess.run(['rm', '-r', tmp]); print(out)

if __name__ == '__main__':
    cmd = sys.argv[1:2]
    if cmd == ['gen']: gen(sys.argv[2:] or list(EMO))
    elif cmd == ['build']: build()
    elif cmd == ['clip']: clip(*sys.argv[2:3])
    else: sys.exit(__doc__)
