# Lip-sync and blinking for every frame Alan talks in, from the one set made on alan_side (scripts/mouth_swaps.py):
# each frame's head is lined up with alan_side's (template match, then an affine fit on the face above the mouth),
# its own lips are painted out, and alan_side's finished lower faces (mouth shapes and jaw in-betweens) and eyelids
# are carried over into it. Writes art/faces/<frame>_<state>.webp (a patch for the frame's head box: mouths
# replace the box, eyes are laid over it) and js/faces.js (window.FACES, read by js/engine/actor.js).
#   python3 scripts/face_transfer.py [frame ...]        (default: the side frames he speaks in)
#   python3 scripts/face_transfer.py --ludo [prefix]     the Ludo in-between frames (review candidates alan_lu_*): each
#       drawn at its own size (about twice his paintings'), the head found from its anchors and a template match; a
#       frame whose face doesn't line up with alan_side's well enough (turned to us, a bad match) is left without
#       (FIT_MIN, and the affine's scale and turn); their sets carry the candidate's src, as js/engine/faces.js wants
import json, os, sys
import cv2, numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'art/review/alan/phase4/')
OUT = os.path.join(ROOT, 'art/faces/')
_t = open(os.path.join(ROOT, 'js/sprites.js')).read(); SPR = json.loads(_t[_t.index('{'):_t.rindex('}') + 1])
CAND = {c['id']: c for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates'] if c.get('meta')}
LUDO = sys.argv[1:2] == ['--ludo']
FIT_MIN = 0.80
if LUDO:
    pre = 'alan_lu_' + (sys.argv[2] if len(sys.argv) > 2 else '')
    FRAMES = sorted(k for k in CAND if k.startswith(pre) and not CAND[k]['meta'].get('rigid'))
else:
    FRAMES = sys.argv[1:] or ['alan_side', 'alan_idle2', 'alan_talk', 'alan_talk2']
NO_MOUTH = {'alan_smoke_exhale', 'alan_smoke_hold', 'alan_smoke_inhale', 'alan_smoke_light'}  # a cigarette at his lips: blinks only
BOX = (70, 30, 80, 90)                  # alan_side's head box (sprite px); side_head.png is it at 6x
K6 = 6
LIPS = ((318, 327), (66, 24), 4)        # his painted lips in side_head.png (centre, axes, angle)
EYE = (272, 172)                        # his eye in side_head.png

side = np.asarray(Image.open(P + 'side_head.png').convert('RGBA')).astype(np.float32)
H, W = side.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]
STATES = sorted(f[5:-4] for f in os.listdir(P + 'full') if f.startswith('side_'))
FULL = {s: np.asarray(Image.open(P + f'full/side_{s}.png').convert('RGBA')).astype(np.float32) for s in STATES}
gray = lambda a: cv2.cvtColor((a[..., :3] / 255).astype(np.float32), cv2.COLOR_RGB2GRAY)


def eye_layers():
    """Eyes half-closed and closed (Gemini, art/review/alan/phase4/eye_*.png), lined up on side_head, as soft overlays."""
    sys.path.insert(0, os.path.join(ROOT, 'scripts')); argv = sys.argv; sys.argv = ['x']
    import gen_image as g
    sys.argv = argv
    keyed = g.on_key(Image.open(P + 'side_head.png').convert('RGBA')); kw, kh = keyed.size; pad = ((kw - W) // 2, (kh - H) // 2)
    cx, cy = EYE
    am = np.ones((H, W), np.uint8) * 255; am[(np.abs(xx - cx) < 70) & (np.abs(yy - cy) < 45)] = 0; am[side[..., 3] < 128] = 0
    out = {}
    for s in ('half', 'closed'):
        im = Image.open(P + f'eye_{s}.png').convert('RGBA').resize((kw, kh), Image.LANCZOS).crop((pad[0], pad[1], pad[0] + W, pad[1] + H))
        warp = np.eye(2, 3, dtype=np.float32)
        _, warp = cv2.findTransformECC(gray(side), gray(np.asarray(im).astype(np.float32)), warp, cv2.MOTION_AFFINE,
                                       (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), am, 5)
        a = cv2.warpAffine(np.asarray(im), warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP).astype(np.float32)
        band = (np.abs(xx - cx) < 90) & (np.abs(yy - cy) < 60) & (np.abs(xx - cx) > 55) & (side[..., 3] > 200)
        a[..., :3] = np.clip(a[..., :3] + (side[band, :3].mean(0) - a[band, :3].mean(0)), 0, 255)
        diff = np.abs(a[..., :3] - side[..., :3]).sum(-1); zone = (np.abs(xx - cx) < 70) & (np.abs(yy - cy) < 45) & (a[..., 3] > 128)
        mk = cv2.dilate(cv2.morphologyEx(((diff > 50) & zone).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)), np.ones((11, 11), np.uint8))
        m = cv2.GaussianBlur(mk.astype(np.float32), (0, 0), 4)
        out[s] = np.dstack([a[..., :3], m * a[..., 3]])
    return out


EYES = eye_layers()
# where the mouth states change his face, over all of them: one region for the frame, so every state replaces the same area
REGION = np.zeros((H, W), np.float32)
for s, a in FULL.items():
    REGION = np.maximum(REGION, ((np.abs(a - side).max(-1) > 20)).astype(np.float32))
REGION = cv2.GaussianBlur(cv2.dilate(REGION.astype(np.uint8), np.ones((21, 21), np.uint8)).astype(np.float32), (0, 0), 5)


def place_ludo(frame):
    """A Ludo frame: its head box (BOX at its own scale) from where alan_side's head sits on its anchors, then a
    template match of alan_side's head nearby; the warp from side_head into it (6x) as for the paintings."""
    c = CAND[frame]; m = c['meta']; S0 = SPR['alan_side']
    spr = np.asarray(Image.open(os.path.join(ROOT, c['src'])).convert('RGBA')).astype(np.float32)
    k = m['h'] / S0['h']; bw, bh = int(round(BOX[2] * k)), int(round(BOX[3] * k))
    ex = m['ax'] + (BOX[0] - S0['ax']) * k; ey = m['fy'] + (BOX[1] - S0['fy']) * k
    if m.get('facesLeft'): return None
    tpl = cv2.resize(gray(side), (bw, bh)); tm = cv2.resize((side[..., 3] > 128).astype(np.uint8), (bw, bh))
    r = int(0.12 * m['h'])
    x0, y0 = max(0, int(ex) - r), max(0, int(ey) - r)
    area = gray(spr)[y0:int(ey) + bh + r, x0:int(ex) + bw + r]
    if area.shape[0] < bh or area.shape[1] < bw: return None
    res = cv2.matchTemplate(area, tpl, cv2.TM_CCORR_NORMED, mask=tm.astype(np.float32))
    _, _, _, (mx, my) = cv2.minMaxLoc(res)
    bx, by = x0 + mx, y0 + my
    crop = np.clip(cv2.resize(spr[by:by + bh, bx:bx + bw], (W, H), interpolation=cv2.INTER_CUBIC), 0, 255)
    am = np.zeros((H, W), np.uint8); am[:270] = 255; am[side[..., 3] < 128] = 0
    warp = np.eye(2, 3, dtype=np.float32)
    try:
        cc, warp = cv2.findTransformECC(gray(crop), gray(side), warp, cv2.MOTION_AFFINE,
                                        (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), am, 5)
    except cv2.error: return None
    sc = np.sqrt(abs(np.linalg.det(warp[:, :2]))); turn = abs(np.degrees(np.arctan2(warp[1, 0], warp[0, 0])))
    if cc < FIT_MIN or not 0.85 < sc < 1.15 or turn > 15: return None
    return spr, (bx, by), warp, cc, (bw, bh)


def place(frame):
    """The frame's head box (sprite px) and the warp from side_head into it (6x), or None if the head can't be found."""
    if frame in CAND and frame not in SPR: return place_ludo(frame)
    spr = np.asarray(Image.open(os.path.join(ROOT, f'art/sprites/{frame}.webp')).convert('RGBA')).astype(np.float32)
    if frame == 'alan_side': return spr, (BOX[0], BOX[1]), np.eye(2, 3, dtype=np.float32), 1.0, (BOX[2], BOX[3])
    # coarse: where scripts/face_kit.py found his face, relative to alan_side's
    I = json.load(open(os.path.join(ROOT, 'art/review/alan/faces/index.json')))
    f, s0 = I[frame]['box'], I['alan_side']['box']
    bx, by = int(round(BOX[0] + f[0] - s0[0])), int(round(BOX[1] + f[1] - s0[1]))
    crop = np.clip(cv2.resize(spr[by:by + BOX[3], bx:bx + BOX[2]], (W, H), interpolation=cv2.INTER_CUBIC), 0, 255)  # cubic overshoots; uint8 would wrap it
    am = np.zeros((H, W), np.uint8); am[:270] = 255; am[side[..., 3] < 128] = 0
    warp = np.eye(2, 3, dtype=np.float32)
    cc, warp = cv2.findTransformECC(gray(crop), gray(side), warp, cv2.MOTION_AFFINE,
                                    (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), am, 5)
    return spr, (bx, by), warp, cc, (BOX[2], BOX[3])


os.makedirs(OUT, exist_ok=True)
data = {}
try: data = json.loads(open(os.path.join(ROOT, 'js/faces.js')).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))
except (OSError, ValueError, IndexError): pass
def save():
    open(os.path.join(ROOT, 'js/faces.js'), 'w').write(
        '// Generated by scripts/face_transfer.py (the side frames) and scripts/face_kit.py (the rest): lip-sync mouths and\n'
        '// blinking eyelids per frame (art/faces/<frame>_<state>.webp, a patch for the box in sprite px). Mouth states replace\n'
        '// the box; eyes are laid over it. "ok": false until approved on the review page (shown only with ?faces=all).\n'
        'window.FACES = ' + json.dumps(data, indent=1) + ';\n')


skipped = []
for n_done, frame in enumerate(FRAMES):
    if n_done and n_done % 25 == 0: save()  # (a long run: kept as it goes)
    if LUDO and frame in data and os.path.exists(OUT + f'{frame}_eyes_closed.webp'): continue  # done in an earlier run
    pl = place(frame)
    if pl is None: skipped.append(frame); data.pop(frame, None); continue
    spr, (bx, by), warp, cc, (BW, BH) = pl
    w6 = lambda a, flags=cv2.INTER_LINEAR: cv2.warpAffine(a, warp, (W, H), flags=flags + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    crop = np.clip(cv2.resize(spr[by:by + BH, bx:bx + BW], (W, H), interpolation=cv2.INTER_CUBIC), 0, 255)  # cubic overshoots; uint8 would wrap it
    # its own lips painted out first, so nothing of them shows under the soft edge
    lips = np.zeros((H, W), np.uint8); cv2.ellipse(lips, *LIPS[:2], LIPS[2], 0, 360, 255, -1)
    lips = (w6(lips.astype(np.float32)) > 127).astype(np.uint8) * 255; lips[crop[..., 3] < 200] = 0
    clean = crop.copy(); clean[..., :3] = cv2.inpaint(crop[..., :3].astype(np.uint8), lips, 9, cv2.INPAINT_TELEA).astype(np.float32)
    R = w6(REGION)[..., None]
    # its colour on the cheek against alan_side's, so a patch from one sits in the other's light
    cheek = (w6(((yy > 230) & (yy < 280) & (xx > 220) & (side[..., 3] > 200)).astype(np.float32)) > 0.5) & (crop[..., 3] > 200)
    shift = (crop[cheek, :3].mean(0) - w6(side)[cheek, :3].mean(0)) if cheek.any() else np.zeros(3)
    for s in ([] if frame in NO_MOUTH else STATES):
        a = w6(FULL[s]); a[..., :3] = np.clip(a[..., :3] + shift, 0, 255)
        out = a * R + clean * (1 - R)
        Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA').resize((BW, BH), Image.LANCZOS).save(OUT + f'{frame}_{s}.webp', lossless=True)
    for s, e in EYES.items():
        a = w6(e); a[..., :3] = np.clip(a[..., :3] + shift, 0, 255)
        Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA').resize((BW, BH), Image.LANCZOS).save(OUT + f'{frame}_eyes_{s}.webp', lossless=True)
    data[frame] = {'box': [int(bx), int(by), BW, BH], 'mouths': [] if frame in NO_MOUTH else STATES, 'eyes': ['half', 'closed'],
                   'ok': (data.get(frame) or {}).get('ok', False)}  # in the game once approved on the review page
    if frame in CAND and frame not in SPR: data[frame]['src'] = CAND[frame]['src']  # (cut from that candidate's own picture)
    print(frame, 'head at', (bx, by), 'fit', round(float(cc), 3))
if skipped: print(len(skipped), 'left without a face (turned, or no good match):', ' '.join(skipped))
save()
