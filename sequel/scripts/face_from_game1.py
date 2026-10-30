#!/usr/bin/env python3
"""Alan's lip-sync and blinking from Game I, carried onto his Game II paintings (the user, 2026-10-29: "we had a great
solution for very natural blending of the mouth with the face... I want the solutions to be replicated. Alan's face is
probably already done there and can be applied").

  python3 sequel/scripts/face_from_game1.py [frame ...]        (default: alanv_side_k alanb_side_k)

Game I's finished faces for alan_side (scripts/mouth_swaps.py there: his own jaw swung about the hinge below his ear,
Gemini's lips and open mouth on top, in-betweens at 40% and 70% open; art/review/alan/phase4/full/side_*.png, with
the half-shut and shut eyes) are carried over as Game I's scripts/face_transfer.py did: the frame's head is lined up
with alan_side's (an affine fit on the face above the mouth), its own lips are painted out, and each state's region is
laid in, shifted to the frame's skin colour. Writes art/faces/<frame>_<state>.webp and the frame's set in js/faces.js.
Reads Game I's files (never changes them); the game itself loads only what is written here.
"""
import json, os, sys
import cv2, numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G1 = os.path.dirname(SEQ)
P = os.path.join(G1, 'art/review/alan/phase4/')
OUT = os.path.join(SEQ, 'art/faces/')
BOX = (70, 30, 80, 90)                 # alan_side's head box in Game I (sprite px); side_head.png is it at 6x
LIPS = ((318, 327), (66, 24), 4)       # his painted lips in side_head.png
EYE = (272, 172)
FIT_MIN = 0.80
gray = lambda a: cv2.cvtColor((a[..., :3] / 255).astype(np.float32), cv2.COLOR_RGB2GRAY)

side = np.asarray(Image.open(P + 'side_head.png').convert('RGBA')).astype(np.float32)
H, W = side.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]
STATES = sorted(f[5:-4] for f in os.listdir(P + 'full') if f.startswith('side_'))
FULL = {s: np.asarray(Image.open(P + f'full/side_{s}.png').convert('RGBA')).astype(np.float32) for s in STATES}
REGION = np.zeros((H, W), np.float32)
for s, a in FULL.items(): REGION = np.maximum(REGION, (np.abs(a - side).max(-1) > 20).astype(np.float32))
REGION = cv2.GaussianBlur(cv2.dilate(REGION.astype(np.uint8), np.ones((21, 21), np.uint8)).astype(np.float32), (0, 0), 5)


def eye_layers():
    """Game I's half-shut and shut eyes for alan_side (Gemini), lined up on side_head, as soft overlays."""
    K = (0, 177, 64)
    cx, cy = EYE; out = {}
    am = np.ones((H, W), np.uint8) * 255; am[(np.abs(xx - cx) < 70) & (np.abs(yy - cy) < 45)] = 0; am[side[..., 3] < 128] = 0
    for s in ('half', 'closed'):
        src = Image.open(P + f'eye_{s}.png').convert('RGBA')
        pad = int(H * 0.06); kw, kh = W + 2 * pad, H + 2 * pad   # (gen_image.on_key's framing: 6% of the height on each side)
        im = src.resize((kw, kh), Image.LANCZOS).crop((pad, pad, pad + W, pad + H))
        warp = np.eye(2, 3, dtype=np.float32)
        _, warp = cv2.findTransformECC(gray(side), gray(np.asarray(im).astype(np.float32)), warp, cv2.MOTION_AFFINE,
                                       (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), am, 5)
        a = cv2.warpAffine(np.asarray(im), warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP).astype(np.float32)
        band = (np.abs(xx - cx) < 90) & (np.abs(yy - cy) < 60) & (np.abs(xx - cx) > 55) & (side[..., 3] > 200)
        a[..., :3] = np.clip(a[..., :3] + (side[band, :3].mean(0) - a[band, :3].mean(0)), 0, 255)
        diff = np.abs(a[..., :3] - side[..., :3]).sum(-1); zone = (np.abs(xx - cx) < 70) & (np.abs(yy - cy) < 45) & (a[..., 3] > 128)
        mk = cv2.dilate(cv2.morphologyEx(((diff > 50) & zone).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)), np.ones((11, 11), np.uint8))
        out[s] = np.dstack([a[..., :3], cv2.GaussianBlur(mk.astype(np.float32), (0, 0), 4) * a[..., 3]])
    return out


def face_box(spr):
    """His face (YuNet) in a painting, sprite px."""
    a = spr.astype(np.float32); al = a[..., 3:] / 255
    rgb = (a[..., :3] * al + np.array([60, 64, 80]) * (1 - al)).astype(np.uint8)
    img = cv2.resize(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    det = cv2.FaceDetectorYN_create(os.path.join(SEQ, 'scripts/models/yunet.onnx'), '', (img.shape[1], img.shape[0]), 0.6, 0.3, 50)
    _, f = det.detect(img)
    if f is None: return None
    r = max(f, key=lambda r: r[14]); return [r[0] / 2, r[1] / 2, r[2] / 2, r[3] / 2]


def place(frame):
    spr = np.asarray(Image.open(os.path.join(SEQ, 'art/sprites', frame + '.webp')).convert('RGBA')).astype(np.float32)
    g1 = np.asarray(Image.open(os.path.join(G1, 'art/sprites/alan_side.webp')).convert('RGBA'))
    f0, f1 = face_box(g1), face_box(spr.astype(np.uint8))
    k = f1[3] / f0[3]
    bw, bh = int(round(BOX[2] * k)), int(round(BOX[3] * k))
    bx, by = int(round(f1[0] - (f0[0] - BOX[0]) * k)), int(round(f1[1] - (f0[1] - BOX[1]) * k))
    padded = np.zeros((spr.shape[0] + 2 * bh, spr.shape[1] + 2 * bw, 4), np.float32); padded[bh:bh + spr.shape[0], bw:bw + spr.shape[1]] = spr
    crop = np.clip(cv2.resize(padded[by + bh:by + 2 * bh, bx + bw:bx + 2 * bw], (W, H), interpolation=cv2.INTER_CUBIC), 0, 255)
    am = np.zeros((H, W), np.uint8); am[:270] = 255; am[side[..., 3] < 128] = 0
    warp = np.eye(2, 3, dtype=np.float32)
    try: cc, warp = cv2.findTransformECC(gray(crop), gray(side), warp, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), am, 5)
    except cv2.error: return None
    return spr, padded, (bx, by), warp, float(cc), (bw, bh), crop


if __name__ == '__main__':
    frames = sys.argv[1:] or ['alanv_side_k', 'alanb_side_k']
    EYES = eye_layers()
    fp = os.path.join(SEQ, 'js/faces.js'); head, body = open(fp).read().split('window.FACES = ', 1)
    data = json.loads(body.rstrip().rstrip(';'))
    for frame in frames:
        pl = place(frame)
        if not pl or pl[4] < FIT_MIN: print(frame, 'no good fit', pl and round(pl[4], 3)); continue
        spr, padded, (bx, by), warp, cc, (BW, BH), crop = pl
        w6 = lambda a: cv2.warpAffine(a, warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        lips = np.zeros((H, W), np.uint8); cv2.ellipse(lips, *LIPS[:2], LIPS[2], 0, 360, 255, -1)
        lips = (w6(lips.astype(np.float32)) > 127).astype(np.uint8) * 255; lips[crop[..., 3] < 200] = 0
        clean = crop.copy(); clean[..., :3] = cv2.inpaint(crop[..., :3].astype(np.uint8), lips, 9, cv2.INPAINT_TELEA).astype(np.float32)
        R = w6(REGION)[..., None]
        cheek = (w6(((yy > 230) & (yy < 280) & (xx > 220) & (side[..., 3] > 200)).astype(np.float32)) > 0.5) & (crop[..., 3] > 200)
        shift = (crop[cheek, :3].mean(0) - w6(side)[cheek, :3].mean(0)) if cheek.any() else np.zeros(3)
        for s in STATES:
            a = w6(FULL[s]); a[..., :3] = np.clip(a[..., :3] + shift, 0, 255)
            out = a * R + clean * (1 - R)
            Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA').resize((BW, BH), Image.LANCZOS).save(OUT + f'{frame}_{s}.webp', lossless=True)
        for s, e in EYES.items():
            a = w6(e); a[..., :3] = np.clip(a[..., :3] + shift, 0, 255)
            Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA').resize((BW, BH), Image.LANCZOS).save(OUT + f'{frame}_eyes_{s}.webp', lossless=True)
        emo = (data.get(frame) or {}).get('emo')   # (the emotions, scripts/face_emotions.py install, are kept)
        data[frame] = {'box': [bx, by, BW, BH], 'mouths': STATES, 'eyes': ['half', 'closed'], 'ok': True, 'who': 'alan', 'from': 'game1', **({'emo': emo} if emo else {})}
        print(frame, 'head at', (bx, by), (BW, BH), 'fit', round(cc, 3))
    open(fp, 'w').write(head + 'window.FACES = ' + json.dumps(data, indent=1) + ';\n')
    import face_defringe   # no pale fringe or stray strokes at the jaw while he talks (scripts/face_defringe.py)
    for frame in frames:
        if frame in data: print(frame, face_defringe.frame(frame), 'px cleaned')
