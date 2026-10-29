#!/usr/bin/env python3
"""Lip-sync and blinking for Game II's talking figures (forked from Game I's scripts/face_kit.py, its borrow and build).

  python3 sequel/scripts/face_kit.py find  [who ...]   the face in every frame of each figure's set (YuNet), heads at 6x
  python3 sequel/scripts/face_kit.py gen   [who ...]   Gemini: mouths A-F and shut eyes, on the figure's standing frame only
  python3 sequel/scripts/face_kit.py build [who ...]   every other frame of the set borrows those edits (its head lined up
                                                       on the standing frame's), then the patches are cut for all of them

Each figure stands on its Ludo talk loop's first frame and talks through the loop (js/story/core.js), so one set of
Gemini edits on that frame serves the whole loop: the loop's heads are the same painting, moved a little. A frame
whose head doesn't line up well enough (FIT_MIN: turned, or a hand across the face) gets no set; the engine plays
only the frames with a set while the figure speaks. Writes art/faces/<frame>_<state>.webp and js/faces.js
(window.FACES; "ok": false until the user approves them). Work files: art/review/faces/<who>/<frame>/ (git-ignored).
The models (OpenCV Zoo's YuNet and SFace) are in scripts/models/ (git-ignored). Gemini: GEMINI_API_KEY in the root
.env, never printed; every edit is logged with its cost in art/review/faces/log.md.
"""
import base64, datetime, io, json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import cv2, numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(SEQ)
WORKS = os.path.join(SEQ, 'art/review/faces/')
MODELS = os.path.join(SEQ, 'scripts/models/')
UP = 6
BG = (60, 64, 80)
FIT_MIN = 0.80
GEMINI = 'gemini-nano-banana-2.1'
PRICE = (1.50, 7.50, 30.00)  # USD per 1M tokens: input, text out, image out
# who: (the loops they talk in, the head for Gemini, a woman)
WHO = {
    'alan': (['alanv_talk_a', 'alanv_talk_b'], 'the head of Alan, a man of thirty-eight with dark curly hair, clean-shaven', False),
    'alanb': (['alanb_talk_a'], 'the head of Alan, a man of thirty-eight with dark curly hair, clean-shaven', False),
    'vasco': (['vasco_talk_a'], 'the head of Vasco, a man in his thirties with dark curly hair and light stubble', False),
    'carmen': (['talk_carmen'], 'the head of Carmen, a Canarian archivist in her early forties with short thick black hair', True),
    'baute': (['talk_baute'], 'the head of Dr. Rayco Baute, a Canarian archaeologist of fifty-six', False),
    'rafa': (['talk_rafa'], 'the head of Rafa, a Canarian painter of twenty-three with dark curly hair', False),
    'chano': (['talk_chano'], 'the head of Chano, a Canarian man who runs a beach kiosk', False),
    'nieves': (['talk_nieves'], 'the head of Nieves, the hotel receptionist, a woman', True),
    'yeray': (['talk_yeray'], 'the head of Yeray, a young Canarian dig volunteer', False),
    'pino': (['talk_pino'], 'the head of Doña Pino, an old Canarian fisherwoman', True),
    'mercedes': (['talk_mercedes'], 'the head of Mercedes, an older Canarian woman, a librarian', True),
    'surfer': (['talk_surfer'], 'the head of a young surfer with long hair', False),
    'guard': (['talk_guard'], 'the head of a museum security guard, a man', False),
    'clerk': (['talk_clerk'], 'the head of an airport clerk, a woman', True),
    'fermin': (['talk_fermin'], 'the head of Don Fermín, an old Canarian sacristan', False),
    'lolo': (['talk_lolo'], 'the head of Don Lolo, an old Canarian man', False),
    'montesdeoca': (['talk_montesdeoca'], 'the head of Ignacio Montesdeoca, a portly, self-satisfied Canarian businessman', False),
    'gail': (['talk_gail'], 'the head of Gail, an old English lady', True),
    'derek': (['talk_derek'], 'the head of Derek, an old English gentleman', False),
}
MOUTHS = {
    'A': 'lips pressed together and closed, as for P, B or M (relaxed, no smile)',
    'B': 'lips slightly parted with the teeth together and just visible, as for K, S, T or EE',
    'C': 'mouth open about a finger\'s width, upper teeth and a little dark mouth visible, the jaw dropped a little, as for EH or AE',
    'D': 'mouth wide open, jaw dropped, dark mouth and tongue visible, as for AA (the widest shape)',
    'E': 'lips rounded and slightly open, pushed a little forward around an open oval, as for AO or ER',
    'F': 'lips puckered and pushed forward into a small round opening, as for OO or W',
}


def LUDO():
    js = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.LUDO))"
    return json.loads(subprocess.run(['node', '-e', js, os.path.join(SEQ, 'js/sprites_ludo.js')], capture_output=True, text=True, check=True).stdout)


def frames_of(who):
    L = LUDO(); return [f for run in WHO[who][0] for f in L[run]['frames']]


def base_of(who): return frames_of(who)[0]
def work(who): return os.path.join(WORKS, who) + '/'
def sprite(fr): return os.path.join(SEQ, 'art/sprites', fr + '.webp')


def pron(t, she):
    if not she: return t
    for a, b in ((r'\bhis\b', 'her'), (r'\bhim\b', 'her'), (r'\bhe\b', 'she'), (r'\bHis\b', 'Her'), (r'\bHe\b', 'She'), (r'\ba man\b', 'a woman')):
        t = re.sub(a, b, t)
    return t


def on_bg(fr):
    im = Image.open(sprite(fr)).convert('RGBA')
    bg = Image.new('RGBA', im.size, BG + (255,)); bg.alpha_composite(im)
    return im, cv2.cvtColor(np.asarray(bg.convert('RGB')), cv2.COLOR_RGB2BGR)


def gray(a): return cv2.cvtColor((a[..., :3] / 255).astype(np.float32), cv2.COLOR_RGB2GRAY)


# ---------------------------------------------------------------- find: the face on the standing frame, the same head box on the rest
def find(whos):
    for who in whos:
        W = work(who); os.makedirs(W, exist_ok=True)
        fr0 = base_of(who); _, a = on_bg(fr0)
        a2 = cv2.resize(a, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC); H, Wd = a2.shape[:2]
        det = cv2.FaceDetectorYN_create(MODELS + 'yunet.onnx', '', (Wd, H), 0.6, 0.3, 50)
        best = None
        for flip in (0, 1):
            img = a2[:, ::-1].copy() if flip else a2
            _, f = det.detect(img)
            for r in (f if f is not None else []):
                v = np.delete(r[:14].reshape(7, 2), 1, 0).copy()
                if flip: v[:, 0] = Wd - v[:, 0]; v[0, 0] -= r[2]; v[[1, 2]] = v[[2, 1]]; v[[4, 5]] = v[[5, 4]]
                v /= 2
                if best is None or r[14] > best[0]:
                    best = (float(r[14]), dict(box=[float(v[0, 0]), float(v[0, 1]), float(r[2] / 2), float(r[3] / 2)], eyes=v[1:3].tolist(), nose=v[3].tolist(), mouth=v[4:6].tolist()))
        if not best: print(who, fr0, 'NO FACE FOUND'); continue
        f = best[1]; x, y, w, h = f['box']; cx, cy = x + w / 2, y + h * 0.5; s = 1.9 * max(w, h)
        hb = [int(round(cx - s / 2)), int(round(cy - s * 0.55)), int(round(s)), int(round(s))]
        index = {}
        for fr in frames_of(who):   # one canvas per run (ludo_fit.py): the head box is the same place on every frame
            im = Image.open(sprite(fr)).convert('RGBA')
            head = Image.new('RGBA', (hb[2], hb[3])); head.alpha_composite(im.crop((hb[0], hb[1], hb[0] + hb[2], hb[1] + hb[3])))
            os.makedirs(W + fr, exist_ok=True)
            head.resize((hb[2] * UP, hb[3] * UP), Image.LANCZOS).save(W + fr + '/head.png')
            index[fr] = dict(box=[round(v, 1) for v in f['box']], eyes=np.round(f['eyes'], 1).tolist(), nose=np.round(f['nose'], 1).tolist(),
                             mouth=np.round(f['mouth'], 1).tolist(), head=hb)
        json.dump({'base': fr0, 'score': round(best[0], 3), 'frames': index}, open(W + 'index.json', 'w'), indent=1)
        print(who, fr0, 'face', round(best[0], 3), 'head', hb, len(index), 'frames', flush=True)


# ---------------------------------------------------------------- gen: Gemini on the standing frame
def api_key():
    if os.environ.get('GEMINI_API_KEY'): return os.environ['GEMINI_API_KEY']
    m = re.search(r'^GEMINI_API_KEY=(.+)$', open(os.path.join(ROOT, '.env')).read(), re.M)
    if not m: sys.exit('GEMINI_API_KEY missing from .env')
    return m.group(1).strip().strip('"\'')


def jobs(who):
    she = WHO[who][2]
    out = [('mouth_' + k, pron('Repaint ONLY his mouth, lips and, where the shape needs it, a slight drop of the jaw and chin, '
                               f'to make this mouth shape for lip-sync: {k}: {v}.', she)) for k, v in MOUTHS.items()]
    out.append(('eyes_closed', pron('Repaint ONLY his eyes and eyelids: both eyes fully CLOSED, the upper eyelids down so only '
                                    'the lash lines show, as at the bottom of a blink. Keep his eyebrows exactly where they are.', she)))
    return out


def gen_one(who, name, edit):
    from google import genai
    W = work(who); fr = base_of(who); out = f'{W}{fr}/{name}.png'
    if os.path.exists(out): return f'{who} {name}: kept', 0.0
    head = Image.open(W + fr + '/head.png').convert('RGBA')
    bg = Image.new('RGBA', head.size, BG + (255,)); bg.alpha_composite(head); bg = bg.convert('RGB')
    if max(bg.size) > 1024: bg = bg.resize((1024, 1024), Image.LANCZOS)
    buf = io.BytesIO(); bg.save(buf, 'PNG'); b64 = base64.b64encode(buf.getvalue()).decode()
    text = ('This is a close-up from a painted 1990s point-and-click adventure game: ' + WHO[who][1] + '. ' + edit +
            ' Everything else stays pixel-identical: the same head position, angle and size, eyes, eyebrows, nose, ears, hair, '
            'skin colour, lighting, line work and framing, on the same flat background. Same painted style.')
    client = genai.Client(api_key=api_key(), http_options={'timeout': 240_000})
    it = None
    for attempt in range(3):
        try:
            it = client.interactions.create(model=GEMINI, input=[{'type': 'text', 'text': text}, {'type': 'image', 'data': b64, 'mime_type': 'image/png'}],
                                            response_format={'type': 'image', 'aspect_ratio': '1:1', 'image_size': '1K'})
            if getattr(it, 'output_image', None) and it.output_image.data: break
        except Exception as e:
            err = e
    else:
        return f'{who} {name}: FAILED', 0.0
    Image.open(io.BytesIO(base64.b64decode(it.output_image.data))).convert('RGB').resize(head.size, Image.LANCZOS).save(out)
    u = it.usage
    img_out = sum(m.tokens or 0 for m in (u.output_tokens_by_modality or []) if str(m.modality).lower().endswith('image'))
    txt_out = (u.total_output_tokens or 0) - img_out + (u.total_thought_tokens or 0)
    cost = (u.total_input_tokens or 0) * PRICE[0] / 1e6 + txt_out * PRICE[1] / 1e6 + img_out * PRICE[2] / 1e6
    lp = os.path.join(WORKS, 'log.md')
    with open(lp, 'a') as fh:
        if fh.tell() == 0: fh.write('# Gemini face edits\n\n| date | who | state | cost USD |\n|---|---|---|---|\n')
        fh.write(f'| {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%d %H:%M} | {who} | {name} | {cost:.4f} |\n')
    return f'{who} {name}: ${cost:.4f}', cost


def gen(whos):
    todo = [(w, n, e) for w in whos for n, e in jobs(w)]
    print(len(todo), 'edits', flush=True); tot = 0.0
    with ThreadPoolExecutor(6) as ex:
        for f in as_completed([ex.submit(gen_one, *j) for j in todo]):
            msg, c = f.result(); tot += c; print(msg, flush=True)
    print(f'this run: ${tot:.2f}')


# ---------------------------------------------------------------- borrow and build (Game I's, for one head box per set)
def borrow(W, target, source):
    t = Image.open(W + target + '/head.png').convert('RGBA'); W6, H6 = t.size
    sh = Image.open(W + source + '/head.png').convert('RGBA').resize((W6, H6), Image.LANCZOS)
    flat = lambda im: (np.asarray(im).astype(np.float32)[..., :3] * (np.asarray(im)[..., 3:] / 255) + np.array(BG, np.float32) * (1 - np.asarray(im)[..., 3:] / 255))
    w = np.eye(2, 3, dtype=np.float32)
    try:
        cc, w = cv2.findTransformECC(gray(flat(t)), gray(flat(sh)), w, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6),
                                     (np.asarray(t)[..., 3] > 128).astype(np.uint8) * 255, 5)
    except cv2.error: return 0.0
    # a big scale or turn means a different head (a hand across it, a turn): not borrowed
    sc = np.sqrt(abs(np.linalg.det(w[:, :2])))
    if abs(sc - 1) > 0.08 or abs(np.degrees(np.arctan2(w[1, 0], w[0, 0]))) > 6: return 0.0
    for f in os.listdir(W + source):
        if not f.startswith(('mouth_', 'eyes_')) or not f.endswith('.png'): continue
        g = np.asarray(Image.open(W + source + '/' + f).convert('RGB').resize((W6, H6), Image.LANCZOS)).astype(np.float32)
        g = cv2.warpAffine(g, w, (W6, H6), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).save(W + target + '/' + f)
    return float(cc)


def build_one(W, fr, info):
    head = Image.open(W + fr + '/head.png').convert('RGBA'); H6, W6 = head.size[1], head.size[0]
    h = np.asarray(head).astype(np.float32); al = h[..., 3:] / 255
    hb = info['head']; o = np.array(hb[:2], np.float32)
    P = lambda p: (np.array(p, np.float32) - o) * UP
    on = h[..., :3] * al + np.array(BG, np.float32) * (1 - al)
    yy, xx = np.mgrid[0:H6, 0:W6]
    bx, by, bw_, bh_ = info['box']
    inside = lambda p: bx - 0.1 * bw_ <= p[0] <= bx + 1.1 * bw_ and by - 0.1 * bh_ <= p[1] <= by + 1.1 * bh_
    def pts(two, eyes):
        a, b = two; a, b = (a if inside(a) else b), (b if inside(b) else a)
        return (a, b) if inside(a) else ([bx + bw_ / 2, by + bh_ * (0.38 if eyes else 0.78)],) * 2
    (m1, m2), nose, (e1, e2) = map(P, pts(info['mouth'], False)), P(info['nose']), map(P, pts(info['eyes'], True))
    mc = (m1 + m2) / 2; mw = np.clip(np.linalg.norm(m2 - m1), 0.25 * bw_ * UP, 0.5 * bw_ * UP); drop = max(mc[1] - nose[1], mw * 0.35)
    ec = (e1 + e2) / 2; ew = np.clip(np.linalg.norm(e2 - e1), 0.3 * bw_ * UP, 0.55 * bw_ * UP)
    mzone = (((xx - mc[0]) / (mw * 1.15)) ** 2 + ((yy - (mc[1] + drop * 0.45)) / (drop * 1.75)) ** 2 < 1) & (yy > nose[1] + drop * 0.2)
    ezone = np.zeros_like(mzone)
    for e in (e1, e2): ezone |= ((xx - e[0]) / (ew * 0.42)) ** 2 + ((yy - e[1]) / (ew * 0.26)) ** 2 < 1
    states = sorted(f[:-4] for f in os.listdir(W + fr) if f.startswith(('mouth_', 'eyes_')) and f.endswith('.png'))
    if not states: return None
    al_mask = (al[..., 0] > 0.5).astype(np.uint8) * 255
    A = {}
    for st in states:
        g = np.asarray(Image.open(f'{W}{fr}/{st}.png').convert('RGB').resize((W6, H6))).astype(np.float32)
        keep = al_mask.copy(); keep[mzone | ezone] = 0
        w = np.eye(2, 3, dtype=np.float32)
        try: cc, w = cv2.findTransformECC(gray(on), gray(g), w, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), keep, 5)
        except cv2.error: cc = 0
        g = cv2.warpAffine(g, w, (W6, H6), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        A[st] = (g, float(cc))
    def region(names, zone):
        R = np.zeros((H6, W6), np.float32)
        for st in names: R = np.maximum(R, ((np.abs(A[st][0] - on).max(-1) > 28) & zone).astype(np.float32))
        R = cv2.morphologyEx(R, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
        R = cv2.dilate(R, np.ones((13, 13), np.uint8)) * zone
        return cv2.GaussianBlur(R, (0, 0), 5)
    mouths = [s for s in states if s.startswith('mouth_')]; eyes = [s for s in states if s.startswith('eyes_')]
    RM = region(mouths, mzone) if mouths else np.zeros((H6, W6), np.float32)
    RE = region(eyes, ezone) if eyes else np.zeros((H6, W6), np.float32)
    lips = np.zeros((H6, W6), np.uint8); cv2.ellipse(lips, (int(mc[0]), int(mc[1])), (int(mw * 0.7), int(mw * 0.3)), 0, 0, 360, 255, -1)
    clean = cv2.inpaint(on.astype(np.uint8), lips, 9, cv2.INPAINT_TELEA).astype(np.float32) if mouths else on.copy()
    ys, xs = np.where((RM > 0.02) | (RE > 0.02))
    if not len(xs): return None
    bx0, by0 = int(np.floor(xs.min() / UP)) - 1, int(np.floor(ys.min() / UP)) - 1
    bx1, by1 = int(np.ceil((xs.max() + 1) / UP)) + 1, int(np.ceil((ys.max() + 1) / UP)) + 1
    bw, bh = bx1 - bx0, by1 - by0
    spr = Image.open(sprite(fr)).convert('RGBA')
    sx, sy = hb[0] + bx0, hb[1] + by0
    base = Image.new('RGBA', (bw, bh)); base.alpha_composite(spr.crop((sx, sy, sx + bw, sy + bh)))
    base = np.asarray(base).astype(np.float32)
    def small(a):
        pad = np.zeros(((by1 - by0) * UP, (bx1 - bx0) * UP) + a.shape[2:], np.float32)
        y0, x0 = max(0, by0 * UP), max(0, bx0 * UP); src = a[y0:by1 * UP, x0:bx1 * UP]
        pad[y0 - by0 * UP:y0 - by0 * UP + src.shape[0], x0 - bx0 * UP:x0 - bx0 * UP + src.shape[1]] = src
        return cv2.resize(pad, (bw, bh), interpolation=cv2.INTER_AREA)
    rm, re_ = small(RM)[..., None], small(RE)[..., None]
    lip_s = small(cv2.GaussianBlur(lips.astype(np.float32) / 255, (0, 0), 4))[..., None]
    under = base.copy(); under[..., :3] = base[..., :3] * (1 - lip_s) + small(clean) * lip_s
    os.makedirs(os.path.join(SEQ, 'art/faces'), exist_ok=True)
    out = {'box': [int(sx), int(sy), bw, bh], 'mouths': [], 'eyes': [], 'fit': {}}
    for st in states:
        g, cc = A[st]; out['fit'][st] = round(cc, 3)
        R = RM if st.startswith('mouth_') else RE
        ring = (cv2.dilate((R > 0.05).astype(np.uint8), np.ones((25, 25), np.uint8)) > 0) & (R < 0.05) & (al[..., 0] > 0.9)
        if ring.any(): g = np.clip(g + (on[ring].mean(0) - g[ring].mean(0)), 0, 255)
        gs = small(g)
        solid = small(((np.abs(g - np.array(BG, np.float32)).max(-1) > 30)).astype(np.float32))[..., None]
        if st.startswith('mouth_'):
            p = under.copy(); p[..., :3] = gs * rm + under[..., :3] * (1 - rm)
            p[..., 3:] = np.maximum(under[..., 3:], rm * solid * 255)
            Image.fromarray(np.clip(p, 0, 255).astype(np.uint8), 'RGBA').save(f'{SEQ}/art/faces/{fr}_{st[6:]}.webp', lossless=True)
            out['mouths'].append(st[6:])
        else:
            p = np.dstack([gs, re_[..., 0] * base[..., 3] / 255 * 255])
            Image.fromarray(np.clip(p, 0, 255).astype(np.uint8), 'RGBA').save(f'{SEQ}/art/faces/{fr}_eyes_{st[5:]}.webp', lossless=True)
            out['eyes'].append(st[5:])
    return out


def faces_js():
    p = os.path.join(SEQ, 'js/faces.js')
    try: return json.loads(open(p).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))
    except (OSError, ValueError, IndexError): return {}


def build(whos):
    data = faces_js()
    for who in whos:
        W = work(who); idx = json.load(open(W + 'index.json')); fr0 = idx['base']
        made = 0
        for fr, info in idx['frames'].items():
            done = W + fr + '/set.json'   # (a frame already built since its edits were made: kept, so a stopped run resumes)
            if os.path.exists(done) and os.path.getmtime(done) > os.path.getmtime(W + fr0 + '/head.png'):
                r = json.load(open(done))
                if r: r['ok'] = (data.get(fr) or {}).get('ok', False); data[fr] = r; made += 1
                else: data.pop(fr, None)
                continue
            if fr != fr0:
                for f in os.listdir(W + fr):
                    if f.startswith(('mouth_', 'eyes_')): os.remove(W + fr + '/' + f)
                cc = borrow(W, fr, fr0)
                if cc < FIT_MIN: data.pop(fr, None); json.dump(None, open(done, 'w')); continue
            r = build_one(W, fr, info)
            if not r: data.pop(fr, None); json.dump(None, open(done, 'w')); continue
            r.pop('fit'); r['who'] = who; json.dump(r, open(done, 'w'))
            r['ok'] = (data.get(fr) or {}).get('ok', False)
            data[fr] = r; made += 1
        print(who, made, 'of', len(idx['frames']), 'frames with a set', flush=True)
        write_faces(data)


def write_faces(data):
    open(os.path.join(SEQ, 'js/faces.js'), 'w').write(
        '// Generated by sequel/scripts/import_game1.py (Game I\'s frames) and sequel/scripts/face_kit.py (the Ludo loops): lip-sync\n'
        '// mouths and blinking eyelids per frame (art/faces/<frame>_<state>.webp, a patch for the box in sprite px). Mouth states\n'
        '// replace the box; eyes are laid over it. "ok": false until approved (shown only with ?faces=all).\n'
        'window.FACES = ' + json.dumps(data, indent=1) + ';\n')


if __name__ == '__main__':
    cmd, whos = (sys.argv[1] if len(sys.argv) > 1 else ''), (sys.argv[2:] or list(WHO))
    if cmd == 'find': find(whos)
    elif cmd == 'gen': gen(whos)
    elif cmd == 'build': build(whos)
    else: sys.exit(__doc__)
