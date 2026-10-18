# Lip-sync and blinking for every frame Alan appears in, beyond the side frames (scripts/face_transfer.py).
#   python3 scripts/face_kit.py find            his face in every frame (YuNet; in a pair, the face most like his)
#   python3 scripts/face_kit.py gen [frame ...] Gemini: the eight mouth shapes and two eyelid states per head
#   python3 scripts/face_kit.py build [frame ...] cut the patches (art/faces/) and update js/faces.js
# Work files go to art/review/alan/faces/<frame>/ (head.png at 6x, Gemini's results). The face models are
# OpenCV Zoo's YuNet and SFace, kept out of git in scripts/models/ (fetched on first use).
import json, os, subprocess, sys, urllib.request
import cv2, numpy as np
cv2.setLogLevel(2) if hasattr(cv2, 'setLogLevel') else None
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, 'art/review/alan/faces/')
MODELS = os.path.join(ROOT, 'scripts/models/')
ZOO = 'https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/'
NETS = {'yunet.onnx': 'face_detection_yunet/face_detection_yunet_2023mar.onnx',
        'sface.onnx': 'face_recognition_sface/face_recognition_sface_2021dec.onnx'}
UP = 6  # head crops are worked on at 6x sprite px, like alan_side's
# in a combined painting, which of the two faces is his (checked by eye: the face model mixes him up with
# Duarte); none for a painting where his face is hidden
LEFT = ('pair_vasco_', 'pair_guitar_p1', 'pair_guitar_underwear')
HIDDEN = ('pair_kiss',)


def net(name):
    p = MODELS + name
    if not os.path.exists(p):
        os.makedirs(MODELS, exist_ok=True); urllib.request.urlretrieve(ZOO + NETS[name], p)
    return p


def frames():
    return sorted(f[:-5] for f in os.listdir(ROOT + '/art/sprites') if f.endswith('.webp') and (f.startswith('alan_') or f.startswith('pair_')))


def on_bg(fr):
    im = Image.open(f'{ROOT}/art/sprites/{fr}.webp').convert('RGBA')
    bg = Image.new('RGBA', im.size, (60, 64, 80, 255)); bg.alpha_composite(im)
    return im, cv2.cvtColor(np.asarray(bg.convert('RGB')), cv2.COLOR_RGB2BGR)


def find():
    """Alan's face in every frame: box, eyes, nose and mouth corners (sprite px), and a head crop at 6x."""
    rec = cv2.FaceRecognizerSF_create(net('sface.onnx'), '')
    faces = {}
    for fr in frames():
        _, a = on_bg(fr); a2 = cv2.resize(a, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC); H, W = a2.shape[:2]
        det = cv2.FaceDetectorYN_create(net('yunet.onnx'), '', (W, H), 0.85, 0.3, 50)
        out = []
        for flip in (0, 1):
            img = a2[:, ::-1].copy() if flip else a2
            _, f = det.detect(img)
            for r in (f if f is not None else []):
                emb = rec.feature(rec.alignCrop(img, r)).flatten()
                # YuNet: x, y, w, h, then right eye, left eye, nose tip, right and left mouth corners, score
                v = np.delete(r[:14].reshape(7, 2), 1, 0).copy()
                if flip: v[:, 0] = W - v[:, 0]; v[0, 0] -= r[2]; v[[1, 2]] = v[[2, 1]]; v[[4, 5]] = v[[5, 4]]
                v /= 2
                d = dict(score=float(r[14]), box=[float(v[0, 0]), float(v[0, 1]), float(r[2] / 2), float(r[3] / 2)],
                         eyes=v[1:3].tolist(), nose=v[3].tolist(), mouth=v[4:6].tolist(), emb=emb / np.linalg.norm(emb))
                if all(abs(d['box'][0] - o['box'][0]) > 15 or abs(d['box'][1] - o['box'][1]) > 15 for o in out): out.append(d)
                else:
                    o = next(o for o in out if abs(d['box'][0] - o['box'][0]) <= 15 and abs(d['box'][1] - o['box'][1]) <= 15)
                    if d['score'] > o['score']: out[out.index(o)] = d
        faces[fr] = out
    me = np.mean([f['emb'] for fr, fs in faces.items() if fr.startswith('alan_') for f in fs], 0); me /= np.linalg.norm(me)
    index = {}
    for fr, fs in faces.items():
        if not fs or fr.startswith(HIDDEN): continue
        fs.sort(key=lambda f: f['box'][0])
        f = max(fs, key=lambda f: f['score']) if fr.startswith('alan_') else fs[0] if fr.startswith(LEFT) else fs[-1]
        x, y, w, h = f['box']; cx, cy = x + w / 2, y + h * 0.5; s = 1.9 * max(w, h)
        im, _ = on_bg(fr)
        hb = [int(round(cx - s / 2)), int(round(cy - s * 0.55)), int(round(s)), int(round(s))]
        head = Image.new('RGBA', (hb[2], hb[3])); head.alpha_composite(im.crop((hb[0], hb[1], hb[0] + hb[2], hb[1] + hb[3])))
        os.makedirs(WORK + fr, exist_ok=True)
        head.resize((hb[2] * UP, hb[3] * UP), Image.LANCZOS).save(WORK + fr + '/head.png')
        index[fr] = dict(box=[round(v, 1) for v in f['box']], eyes=np.round(f['eyes'], 1).tolist(), nose=np.round(f['nose'], 1).tolist(),
                         mouth=np.round(f['mouth'], 1).tolist(), head=hb, like=round(float(f['emb'] @ me), 3))
        print(fr, index[fr]['like'], flush=True)
    json.dump(index, open(WORK + 'index.json', 'w'), indent=1)


# ---------------------------------------------------------------- gen: Gemini, one edit per state
# Rhubarb's shapes A-F get their own paintings; G (F/V) and H (L) borrow B and C in the engine. Eyes: shut only
# (the blink goes open, shut, open). Frames already covered by alan_side's set (face_transfer.py) are skipped.
MOUTHS = {
    'A': 'lips pressed together and closed, as for P, B or M (relaxed, no smile)',
    'B': 'lips slightly parted with the teeth together and just visible, as for K, S, T or EE',
    'C': 'mouth open about a finger\'s width, upper teeth and a little dark mouth visible, the jaw dropped a little, as for EH or AE',
    'D': 'mouth wide open, jaw dropped, dark mouth and tongue visible, as for AA (the widest shape)',
    'E': 'lips rounded and slightly open, pushed a little forward around an open oval, as for AO or ER',
    'F': 'lips puckered and pushed forward into a small round opening, as for OO or W',
}
SIDE = ['alan_side', 'alan_idle2', 'alan_talk', 'alan_talk2', 'alan_drink', 'alan_pass', 'alan_pull', 'alan_reach',
        'alan_smoke_exhale', 'alan_smoke_hold', 'alan_smoke_inhale', 'alan_smoke_light', 'alan_throw1', 'alan_untie',
        'alan_walkA', 'alan_walkB', 'alan_walkDown']  # alan_walkUp didn't line up; ring and wring grimace (their own set keeps it)
# no mouth: a cigarette, a hand or another face at his lips, or asleep; no blink: his eyes are shut or squeezed already
NO_MOUTH = {'alan_smoke_exhale', 'alan_smoke_hold', 'alan_smoke_inhale', 'alan_smoke_light', 'alan_yawn', 'alan_asleep',
            'pair_brow', 'pair_cop_neck', 'pair_vasco_kiss'}
NO_EYES = {'alan_asleep', 'alan_wash1', 'alan_wash2', 'alan_wash4', 'alan_wash5', 'alan_wash6', 'alan_wash_surface', 'alan_swoon',
           'alan_yawn', 'alan_wink', 'alan_jacket_wink', 'alan_enchanted2', 'alan_swim_wave', 'pair_brow', 'pair_cop_neck', 'pair_vasco_kiss'}
BG = (60, 64, 80)


# smiling paintings: a talking mouth inside a painted grin looks wrong (the raised cheeks and smile lines stay put
# while the lips move), so for these the smile is let go across the lower face and the patch covers the cheeks
SMILING = {'pair_cop_belt', 'pair_cop_belt2', 'pair_cop_buttons', 'pair_cop_cuffs', 'pair_cop_jacket', 'pair_cop_shelf2',
           'pair_guitar_lesson', 'pair_vasco_card', 'pair_vasco_thumb'}

# frames whose painted smile crease lies outside what the new mouths change: the whole mouth-and-cheek zone is replaced
FULL_ZONE = {'pair_cop_belt2'}


def jobs(fr):
    out = []
    if fr in SMILING:
        out += [('mouth_' + k, 'Repaint his mouth, lips, the corners of his mouth, his cheeks and the lines beside his mouth, and where the shape '
                 'needs it a slight drop of the jaw and chin, so that he is TALKING, not smiling: his smile is gone from the whole lower face, '
                 'the corners of the lips relaxed (not pulled up), the cheeks relaxed and lowered, no smile creases or dimples' + (' (paint the cheek beside the mouth smooth: no dark line, mark or dimple there)' if fr in FULL_ZONE else '') + ', as a man in the '
                 f'middle of saying a word. Mouth shape for lip-sync: {k}: {v}.') for k, v in MOUTHS.items()]
    elif fr not in NO_MOUTH: out += [('mouth_' + k, 'Repaint ONLY his mouth, lips and, where the shape needs it, a slight drop of the jaw and chin, '
                                    f'to make this mouth shape for lip-sync: {k}: {v}.') for k, v in MOUTHS.items()]
    if fr not in NO_EYES: out.append(('eyes_closed', 'Repaint ONLY his eyes and eyelids: both eyes fully CLOSED, the upper eyelids down so only '
                                      'the lash lines show, as at the bottom of a blink. Keep his eyebrows exactly where they are.'))
    return out


def gen_one(fr, name, edit):
    import base64, datetime, io
    sys.path.insert(0, os.path.join(ROOT, 'scripts')); import gen_image as g
    out = f'{WORK}{fr}/{name}.png'
    if os.path.exists(out): return f'{fr} {name}: kept'
    head = Image.open(WORK + fr + '/head.png').convert('RGBA')
    bg = Image.new('RGBA', head.size, BG + (255,)); bg.alpha_composite(head); bg = bg.convert('RGB')
    pair = fr.startswith('pair_')
    text = ('This is a close-up from a painted 1990s point-and-click adventure game: the head of Alan, a man with dark curly hair, '
            'clean-shaven' + (', with part of another person beside him' if pair else '') + '. ' + edit +
            ' Everything else stays pixel-identical: the same head position, angle and size, eyes, eyebrows, nose, ears, hair, stubble, '
            'skin colour, lighting, line work and framing' + (', and the other person exactly as they are' if pair else '') +
            ', on the same flat background. Same painted style.')
    from google import genai
    client = genai.Client(api_key=g.api_key(), http_options={'timeout': 240_000})
    for attempt in range(3):
        try:
            it = client.interactions.create(model=g.MODEL, input=[{'type': 'text', 'text': text}, {'type': 'image', 'data': g.png_b64(bg), 'mime_type': 'image/png'}],
                                            response_format={'type': 'image', 'aspect_ratio': '1:1', 'image_size': '1K'})
            if getattr(it, 'output_image', None) and it.output_image.data: break
        except Exception as e:  # a timeout or a refusal: try again, then give up on this one
            err = e
    else:
        return f'{fr} {name}: FAILED'
    raw = Image.open(io.BytesIO(base64.b64decode(it.output_image.data))).convert('RGB').resize(head.size, Image.LANCZOS)
    raw.save(out)
    u = it.usage; pin, ptxt, pimg = g.PRICE[g.MODEL]
    img_out = sum(m.tokens or 0 for m in (u.output_tokens_by_modality or []) if str(m.modality).lower().endswith('image'))
    txt_out = (u.total_output_tokens or 0) - img_out + (u.total_thought_tokens or 0)
    cost = (u.total_input_tokens or 0) * pin / 1e6 + txt_out * ptxt / 1e6 + img_out * pimg / 1e6
    rel = lambda x: os.path.relpath(x, ROOT)
    with open(os.path.join(ROOT, 'art/review/log.md'), 'a') as fh:
        fh.write(f"| {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%d %H:%M} | {g.MODEL} | {rel(WORK + fr + '/head.png')} | "
                 f"{edit.replace('|', '/')} | {rel(out)} | {u.total_input_tokens}/{img_out}+{txt_out} | {cost:.4f} |\n")
    return f'{fr} {name}: ${cost:.4f}'


def gen(names):
    from concurrent.futures import ThreadPoolExecutor
    index = json.load(open(WORK + 'index.json'))
    todo = [(fr, n, e) for fr in (names or index) if fr in index and fr not in SIDE for n, e in jobs(fr)]
    print(len(todo), 'edits', flush=True)
    with ThreadPoolExecutor(8) as ex:
        for msg in ex.map(lambda j: gen_one(*j), todo): print(msg, flush=True)


# ---------------------------------------------------------------- build: patches for the game
def gray(a): return cv2.cvtColor((a[..., :3] / 255).astype(np.float32), cv2.COLOR_RGB2GRAY)


def build_one(fr, info):
    """Lines each Gemini edit up with the frame's head, keeps only what changed around the mouth (one region for all the
    shapes, so each replaces the same area) and the eyes, and composes the patches at sprite px over the painting itself."""
    head = Image.open(WORK + fr + '/head.png').convert('RGBA'); H6, W6 = head.size[1], head.size[0]
    h = np.asarray(head).astype(np.float32); al = h[..., 3:] / 255
    hb = info['head']; o = np.array(hb[:2], np.float32)
    P = lambda p: (np.array(p, np.float32) - o) * UP                     # sprite px -> head.png px
    on = h[..., :3] * al + np.array(BG, np.float32) * (1 - al)            # the head as Gemini saw it
    yy, xx = np.mgrid[0:H6, 0:W6]
    # in a profile the far eye and mouth corner are guesses, sometimes far off: keep each point inside the face box
    bx, by, bw_, bh_ = info['box']
    inside = lambda p: bx - 0.1 * bw_ <= p[0] <= bx + 1.1 * bw_ and by - 0.1 * bh_ <= p[1] <= by + 1.1 * bh_
    def pts(two):
        a, b = two; a, b = (a if inside(a) else b), (b if inside(b) else a)
        return (a, b) if inside(a) else ([bx + bw_ / 2, by + bh_ * (0.38 if two is info['eyes'] else 0.78)],) * 2
    (m1, m2), nose, (e1, e2) = map(P, pts(info['mouth'])), P(info['nose']), map(P, pts(info['eyes']))
    mc = (m1 + m2) / 2; mw = np.clip(np.linalg.norm(m2 - m1), 0.25 * bw_ * UP, 0.5 * bw_ * UP); drop = max(mc[1] - nose[1], mw * 0.35)
    ec = (e1 + e2) / 2; ew = np.clip(np.linalg.norm(e2 - e1), 0.3 * bw_ * UP, 0.55 * bw_ * UP)
    # zones: the mouth and chin (from under the nose to below the chin), the eyes (a band through both)
    wide = 1.7 if fr in SMILING else 1.15                               # a smile reaches into the cheeks
    mzone = (((xx - mc[0]) / (mw * wide)) ** 2 + ((yy - (mc[1] + drop * 0.45)) / (drop * 1.75)) ** 2 < 1) & (yy > nose[1] - (drop * 0.3 if fr in SMILING else -drop * 0.2))
    ezone = np.zeros_like(mzone)
    for e in (e1, e2): ezone |= ((xx - e[0]) / (ew * 0.42)) ** 2 + ((yy - e[1]) / (ew * 0.26)) ** 2 < 1
    states = sorted(f[:-4] for f in os.listdir(WORK + fr) if f.startswith(('mouth_', 'eyes_')) and f.endswith('.png'))
    if not states: return None
    al_mask = (al[..., 0] > 0.5).astype(np.uint8) * 255
    A = {}
    for st in states:
        g = np.asarray(Image.open(f'{WORK}{fr}/{st}.png').convert('RGB').resize((W6, H6))).astype(np.float32)
        keep = al_mask.copy(); keep[mzone | ezone] = 0                    # line up on everything that should not change
        w = np.eye(2, 3, dtype=np.float32)
        try: cc, w = cv2.findTransformECC(gray(on), gray(g), w, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), keep, 5)
        except cv2.error: cc = 0
        g = cv2.warpAffine(g, w, (W6, H6), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        A[st] = (g, float(cc))
    def region(names, zone):
        R = np.zeros((H6, W6), np.float32)
        for st in names:
            d = np.abs(A[st][0] - on).max(-1)
            R = np.maximum(R, ((d > 28) & zone).astype(np.float32))
        R = cv2.morphologyEx(R, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
        R = cv2.dilate(R, np.ones((13, 13), np.uint8)) * zone
        return cv2.GaussianBlur(R, (0, 0), 5)
    mouths = [s for s in states if s.startswith('mouth_')]; eyes = [s for s in states if s.startswith('eyes_')]
    RM = region(mouths, mzone) if mouths else np.zeros((H6, W6), np.float32)
    if fr in FULL_ZONE and mouths:  # the painting's own smile crease goes too, up the cheek to just under the eye
        cheek = (np.abs(xx - mc[0]) < mw * 2.2) & (yy > ec[1] + ew * 0.35) & (yy < mc[1] + drop * 1.6) & (al[..., 0] > 0.5)
        RM = cv2.GaussianBlur((mzone | cheek).astype(np.float32), (0, 0), 6)
    RE = region(eyes, ezone) if eyes else np.zeros((H6, W6), np.float32)
    # his own lips painted out under the mouth region, so none of them shows through its soft edge
    lips = np.zeros((H6, W6), np.uint8); cv2.ellipse(lips, (int(mc[0]), int(mc[1])), (int(mw * 0.7), int(mw * 0.3)), 0, 0, 360, 255, -1)
    clean = on.copy(); clean = cv2.inpaint(on.astype(np.uint8), lips, 9, cv2.INPAINT_TELEA).astype(np.float32) if mouths else clean
    # the patch box (sprite px): wherever either region reaches
    ys, xs = np.where((RM > 0.02) | (RE > 0.02))
    if not len(xs): return None
    bx0, by0 = int(np.floor(xs.min() / UP)) - 1, int(np.floor(ys.min() / UP)) - 1
    bx1, by1 = int(np.ceil((xs.max() + 1) / UP)) + 1, int(np.ceil((ys.max() + 1) / UP)) + 1
    bw, bh = bx1 - bx0, by1 - by0
    spr = Image.open(f'{ROOT}/art/sprites/{fr}.webp').convert('RGBA')
    sx, sy = hb[0] + bx0, hb[1] + by0
    base = Image.new('RGBA', (bw, bh)); base.alpha_composite(spr.crop((sx, sy, sx + bw, sy + bh)))
    base = np.asarray(base).astype(np.float32)
    sl = (slice(by0 * UP, by1 * UP), slice(bx0 * UP, bx1 * UP))
    def small(a):  # a 6x array over the box -> sprite px
        pad = np.zeros(((by1 - by0) * UP, (bx1 - bx0) * UP) + a.shape[2:], np.float32)
        y0, x0 = max(0, by0 * UP), max(0, bx0 * UP); src = a[y0:by1 * UP, x0:bx1 * UP]
        pad[y0 - by0 * UP:y0 - by0 * UP + src.shape[0], x0 - bx0 * UP:x0 - bx0 * UP + src.shape[1]] = src
        return cv2.resize(pad, (bw, bh), interpolation=cv2.INTER_AREA)
    rm, re_ = small(RM)[..., None], small(RE)[..., None]
    lip_s = small(cv2.GaussianBlur(lips.astype(np.float32) / 255, (0, 0), 4))[..., None]
    under = base.copy(); under[..., :3] = base[..., :3] * (1 - lip_s) + small(clean) * lip_s
    os.makedirs(ROOT + '/art/faces', exist_ok=True)
    out = {'box': [int(sx), int(sy), bw, bh], 'mouths': [], 'eyes': [], 'fit': {}}
    for st in states:
        g, cc = A[st]; out['fit'][st] = round(cc, 3)
        R = RM if st.startswith('mouth_') else RE
        ring = (cv2.dilate((R > 0.05).astype(np.uint8), np.ones((25, 25), np.uint8)) > 0) & (R < 0.05) & (al[..., 0] > 0.9)
        if ring.any(): g = np.clip(g + (on[ring].mean(0) - g[ring].mean(0)), 0, 255)   # Gemini's colour drift
        gs = small(g)
        # where the new shape paints over what was background (a dropped chin), it becomes opaque
        solid = small(((np.abs(g - np.array(BG, np.float32)).max(-1) > 30)).astype(np.float32))[..., None]
        if st.startswith('mouth_'):
            p = under.copy(); p[..., :3] = gs * rm + under[..., :3] * (1 - rm)
            p[..., 3:] = np.maximum(under[..., 3:], rm * solid * 255)
            Image.fromarray(np.clip(p, 0, 255).astype(np.uint8), 'RGBA').save(f'{ROOT}/art/faces/{fr}_{st[6:]}.webp', lossless=True)
            out['mouths'].append(st[6:])
        else:
            p = np.dstack([gs, re_[..., 0] * base[..., 3] / 255 * 255])
            Image.fromarray(np.clip(p, 0, 255).astype(np.uint8), 'RGBA').save(f'{ROOT}/art/faces/{fr}_eyes_{st[5:]}.webp', lossless=True)
            out['eyes'].append(st[5:])
    return out


def build(names):
    index = json.load(open(WORK + 'index.json'))
    try: data = json.loads(open(os.path.join(ROOT, 'js/faces.js')).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))
    except (OSError, ValueError, IndexError): data = {}
    for fr in (names or index):
        if fr not in index or fr in SIDE: continue
        r = build_one(fr, index[fr])
        if not r: continue
        fit = r.pop('fit'); r['ok'] = (data.get(fr) or {}).get('ok', False)   # in the game once approved on the review page
        data[fr] = r
        print(fr, r['box'], ' '.join(f'{k}:{v}' for k, v in fit.items()), flush=True)
    open(os.path.join(ROOT, 'js/faces.js'), 'w').write(
        '// Generated by scripts/face_transfer.py (the side frames) and scripts/face_kit.py (the rest): lip-sync mouths and\n'
        '// blinking eyelids per frame (art/faces/<frame>_<state>.webp, a patch for the box in sprite px). Mouth states replace\n'
        '// the box; eyes are laid over it. "ok": false until approved on the review page (shown only with ?faces=all).\n'
        'window.FACES = ' + json.dumps(data, indent=1) + ';\n')


# ---------------------------------------------------------------- borrow: another frame's set, for the same painted head
def borrow(target, source):
    """For a frame whose head is the same painting as one already done (faces_sim.json): the source's Gemini edits,
    lined up on the target's head, stand in for its own (build then cuts them as usual). Noted in borrowed.txt."""
    t = Image.open(WORK + target + '/head.png').convert('RGBA'); W6, H6 = t.size
    sh = Image.open(WORK + source + '/head.png').convert('RGBA').resize((W6, H6), Image.LANCZOS)
    flat = lambda im: (np.asarray(im).astype(np.float32)[..., :3] * (np.asarray(im)[..., 3:] / 255) + np.array(BG, np.float32) * (1 - np.asarray(im)[..., 3:] / 255))
    w = np.eye(2, 3, dtype=np.float32)
    cc, w = cv2.findTransformECC(gray(flat(t)), gray(flat(sh)), w, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6),
                                 (np.asarray(t)[..., 3] > 128).astype(np.uint8) * 255, 5)
    for n, _ in jobs(target):
        src = f'{WORK}{source}/{n}.png'
        if not os.path.exists(src): continue
        g = np.asarray(Image.open(src).convert('RGB').resize((W6, H6), Image.LANCZOS)).astype(np.float32)
        g = cv2.warpAffine(g, w, (W6, H6), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).save(f'{WORK}{target}/{n}.png')
    open(f'{WORK}{target}/borrowed.txt', 'w').write(f'{source} {cc:.3f}\n')
    print(target, '<-', source, 'fit', round(float(cc), 3))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'find': find()
    elif cmd == 'gen': gen(sys.argv[2:])
    elif cmd == 'build': build(sys.argv[2:])
    elif cmd == 'borrow': borrow(*sys.argv[2:4])
    else: sys.exit(__doc__ if False else 'usage: face_kit.py find | gen [frame ...] | build [frame ...]')
