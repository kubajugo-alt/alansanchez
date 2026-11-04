#!/usr/bin/env python3
"""Game II's emotions for Alan (sequel/art/faces/<frame>_emo_<e>[_up].webp) carried onto Game I's Alan, for review only.

  python3 scripts/face_emotions_g2.py build [target ...]     patches + emo.json into art/review/emotions_g2/
  python3 scripts/face_emotions_g2.py sheet [target ...]     a contact sheet per frame (game size and 3x)

No paid service: local image work only. Per target frame and Game II source of the same view:
  1. the source head (neutral S0, and S0 with the emotion's whole-box patch, Se) is lined up on the target's head with an
     affine ECC fit on the face (4x, masked to the face: the hair differs between the paintings);
  2. what the emotion changes (|Se - S0|, dilated and feathered, inside the face) is the only area that changes;
  3. there the result is the source's detail with the target's own colour and shading: warp(Se) + blur(T - warp(S0))
     (the emotion's strokes in Game I's skin; a blush the emotion paints comes with it, the cheek's colour never sets the
     face's), and the outline moves by the source's change (lips that part or purse);
  4. two patches in the frame's emotion box, as the engine (js/engine/faces.js) wants them: <t>_emo_<e>.webp (the whole
     box: quiet) and <t>_emo_<e>_up.webp (brows and eyes only, soft-edged: over the lip-sync mouth while he talks).
The talk frames' painted mouths are open: their quiet emotion starts from their own closed lip-sync mouth (A).
Nothing here touches js/faces.js or art/faces/: ?emo=1 previews it (js/story/emo_preview.js).
"""
import json, os, sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEQ = os.path.join(ROOT, 'sequel')
OUT = os.path.join(ROOT, 'art/review/emotions_g2')
EMOS = ['fear', 'anger', 'sadness', 'concern', 'surprise', 'joy', 'embarrassed', 'mischievous']
K = 4  # working enlargement
# target -> (source, base mouth for the quiet face: None = the painting's own, else a lip-sync patch, face zone, upper split)
#   zone: the face in front of the ear in target sprite px (polygon), where anything may change
#   split: the nose's underside (target sprite y): the _up patch keeps only what lies above it
SIDE_ZONE = lambda x, y: [(x + 22, y + 8), (x + 64, y + 4), (x + 80, y + 30), (x + 80, y + 90), (x + 30, y + 90), (x + 26, y + 50)]
TARGETS = {
    'alan_side': dict(src='alanv_side_k', base=None),
    'alan_idle2': dict(src='alanv_side_k', base=None),
    'alan_talk': dict(src='alanv_side_k', base='A'),
    'alan_talk2': dict(src='alanv_side_k', base='A'),
    'alan_front': dict(src='alanv_front_k', base=None),
}


def faces(path):
    return json.loads(open(path).read().split('window.FACES = ', 1)[1].rstrip().rstrip(';'))


F1, F2 = faces(os.path.join(ROOT, 'js/faces.js')), faces(os.path.join(SEQ, 'js/faces.js'))
rgba = lambda p: np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)
gray = lambda a: cv2.cvtColor(np.clip(a[..., :3] / 255, 0, 1).astype(np.float32), cv2.COLOR_RGB2GRAY)


def paste(img, patch, box, clear):
    x, y, w, h = box; out = img.copy()
    if clear: out[y:y + h, x:x + w] = 0
    a = patch[..., 3:4] / 255; reg = out[y:y + h, x:x + w]
    rgb = patch[..., :3] * a + reg[..., :3] * (reg[..., 3:4] / 255) * (1 - a)
    al = a + reg[..., 3:4] / 255 * (1 - a)
    reg[..., :3] = np.where(al > 0, rgb / np.maximum(al, 1e-6), 0); reg[..., 3:4] = al * 255
    return out


def up(a): return cv2.resize(a, (a.shape[1] * K, a.shape[0] * K), interpolation=cv2.INTER_CUBIC)
def down(a, w, h): return cv2.resize(a, (w, h), interpolation=cv2.INTER_AREA)


def premul_up(a):
    """RGBA enlarged without dark fringes: colours bled into the transparent outside first."""
    p = a.copy(); p[..., :3] *= p[..., 3:4] / 255
    P = up(p); A = np.clip(P[..., 3:4], 1e-3, None)
    P[..., :3] = np.where(P[..., 3:4] > 1, P[..., :3] / (A / 255), 0)
    return P


def fit(T, S0, mask):
    """Affine warp lining S0 up on T (both 4x crops of the same size)."""
    best = (-1, None)
    H, W = T.shape[:2]; cx, cy = W / 2, H / 2
    for sc in (0.85, 1.0, 1.15):
      for dx in (-8, 0, 8):
        for dy in (-8, 0, 8):
            # (inverse map: target px -> source px) scaled about the crop's centre
            w = np.array([[sc, 0, dx + cx * (1 - sc)], [0, sc, dy + cy * (1 - sc)]], np.float32)
            try:
                cc, w = cv2.findTransformECC(gray(T), gray(S0), w, cv2.MOTION_AFFINE,
                                             (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 400, 1e-7), mask, 5)
            except cv2.error: continue
            if cc > best[0]: best = (cc, w)
    return best


def build(tname):
    cfg = TARGETS[tname]; src = cfg['src']
    D1, D2 = F1[tname], F2[src]
    tx, ty, tw, th = D1['box']
    sbox = D2['emo']['box']
    T = rgba(os.path.join(ROOT, 'art/sprites', tname + '.webp'))
    Tq = T if not cfg['base'] else paste(T, rgba(os.path.join(ROOT, 'art/faces', f'{tname}_{cfg["base"]}.webp')), D1['box'], True)
    S0 = rgba(os.path.join(SEQ, 'art/sprites', src + '.webp'))
    # working crops: the target's face box with room around (brows above a front box); the source's emotion box likewise
    front = 'front' in tname
    m = 14
    cx0, cy0 = max(tx - m, 0), max(ty - (30 if front else m), 0)
    cx1, cy1 = min(tx + tw + m, T.shape[1]), min(ty + th + m, T.shape[0])
    sx, sy, sw, sh = sbox
    # the source crop is placed so its box sits where the target's does (a first guess the fit refines)
    if front:  # line the eyes up: Game II's front eyes are at sprite y 79 (face_emotions.py VIEWS), Game I's ~12 px into its box
        ox, oy = round(sx + sw / 2 - (tx + tw / 2)), round(79 - (ty + 12))
    else:
        ox, oy = sx - tx, sy - ty
    W, H = cx1 - cx0, cy1 - cy0

    def scrop(a):
        out = np.zeros((H, W, 4), np.float32)
        x0, y0 = cx0 + ox, cy0 + oy
        xs0, ys0 = max(x0, 0), max(y0, 0); xs1, ys1 = min(x0 + W, a.shape[1]), min(y0 + H, a.shape[0])
        out[ys0 - y0:ys1 - y0, xs0 - x0:xs1 - x0] = a[ys0:ys1, xs0:xs1]
        return out
    Tc, Tqc = premul_up(T[cy0:cy1, cx0:cx1]), premul_up(Tq[cy0:cy1, cx0:cx1])
    S0c = premul_up(scrop(S0))
    Hk, Wk = Tc.shape[:2]
    yy, xx = np.mgrid[0:Hk, 0:Wk]
    # the face (target, 4x): only here is the fit measured and may anything change
    zone = np.zeros((Hk, Wk), np.uint8)
    if front:
        cv2.ellipse(zone, (int((tx + tw / 2 - cx0) * K), int((ty + th / 2 - 8 - cy0) * K)), (int(tw * 0.5 * K), int((th / 2 + 14) * K)), 0, 0, 360, 255, -1)
    else:
        cv2.fillPoly(zone, [np.array([((px - cx0) * K, (py - cy0) * K) for px, py in SIDE_ZONE(tx, ty)], np.int32)], 255)
    fitm = ((zone > 0) & (Tc[..., 3] > 200) & (S0c[..., 3] > 200)).astype(np.uint8) * 255
    cc, warp = fit(Tc, S0c, fitm)
    wp = lambda a: cv2.warpAffine(a, warp, (Wk, Hk), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    S0w = wp(S0c)
    zonef = cv2.GaussianBlur(zone.astype(np.float32) / 255, (0, 0), 3 * K)
    res = {'fit': round(float(cc), 3), 'warp': warp.round(4).tolist(), 'emos': {}}
    # the target's emotion box: its face box, grown to whatever any emotion changes
    patches, boxes = {}, []
    for e in EMOS:
        pe = os.path.join(SEQ, 'art/faces', f'{src}_emo_{e}.webp'); pu = os.path.join(SEQ, 'art/faces', f'{src}_emo_{e}_up.webp')
        if not os.path.exists(pe): continue
        Se = paste(S0, rgba(pe), sbox, True)
        Sew = wp(premul_up(scrop(Se)))
        Uw = wp(up(scrop(paste(np.zeros_like(S0), rgba(pu), sbox, True))[..., 3]))  # where the source's _up patch reaches
        # what the emotion changes, on the target
        d = np.abs(Sew[..., :3] - S0w[..., :3]).max(-1) * (np.maximum(Sew[..., 3], S0w[..., 3]) > 60)
        d = np.maximum(d, np.abs(Sew[..., 3] - S0w[..., 3]))
        M = (cv2.GaussianBlur(d, (0, 0), 1.0 * K) > 10).astype(np.uint8)
        M = cv2.dilate(M, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (4 * K + 1, 4 * K + 1)))
        M = cv2.GaussianBlur(M.astype(np.float32), (0, 0), 1.6 * K) * zonef
        M = np.clip(M * 1.3, 0, 1)
        lo = lambda a: cv2.GaussianBlur(a, (0, 0), 1.5 * K)
        def blend(base):
            R = Sew[..., :3] + lo(base[..., :3] - S0w[..., :3])
            out = base.copy()
            out[..., :3] = base[..., :3] * (1 - M[..., None]) + R * M[..., None]
            out[..., 3] = np.clip(base[..., 3] + M * (Sew[..., 3] - S0w[..., 3]), 0, 255)
            return out
        Q, Tk = blend(Tqc), blend(Tc)
        Mu = M * np.clip(Uw / 255 * 1.5, 0, 1)
        Up = Tk.copy(); Up[..., 3] = Tk[..., 3] * Mu
        q = down(Q, W, H); u = down(Up, W, H); mm = down(M, W, H)
        patches[e] = (q, u)
        ys, xs = np.nonzero(mm > 0.02)
        if len(xs): boxes.append((xs.min() + cx0, ys.min() + cy0, xs.max() + cx0 + 1, ys.max() + cy0 + 1))
        res['emos'][e] = {'changed_px': int((mm > 0.1).sum())}
    bx0 = min([tx] + [b[0] for b in boxes]); by0 = min([ty] + [b[1] for b in boxes])
    bx1 = max([tx + tw] + [b[2] for b in boxes]); by1 = max([ty + th] + [b[3] for b in boxes])
    eb = [int(bx0), int(by0), int(bx1 - bx0), int(by1 - by0)]
    res['box'] = eb
    os.makedirs(os.path.join(OUT, 'faces'), exist_ok=True)
    full_base = Tq.copy()
    for e, (q, u) in patches.items():
        fs = full_base.copy(); fs[cy0:cy1, cx0:cx1] = q
        qb = fs[by0:by1, bx0:bx1]
        us = np.zeros_like(T); us[cy0:cy1, cx0:cx1] = u; ub = us[by0:by1, bx0:bx1]
        for arr, suf in ((qb, ''), (ub, '_up')):
            a = np.clip(arr, 0, 255).astype(np.uint8); a[a[..., 3] == 0, :3] = 0
            Image.fromarray(a, 'RGBA').save(os.path.join(OUT, 'faces', f'{tname}_emo_{e}{suf}.webp'), lossless=True)
    print(tname, 'from', src, 'fit', res['fit'], 'box', eb)
    return res


# ---------------------------------------------------------------- review sheets
def compose(tname, emo=None, talk=None, blink=False, data=None):
    """As js/engine/faces.js: the lip-sync mouth in the face box, the emotion (whole box when quiet, brows and eyes over a
    talking mouth), then the blink."""
    D = F1[tname]; T = rgba(os.path.join(ROOT, 'art/sprites', tname + '.webp'))
    if talk: T = paste(T, rgba(os.path.join(ROOT, 'art/faces', f'{tname}_{talk}.webp')), D['box'], True)
    if emo:
        eb = data[tname]['box']
        T = paste(T, rgba(os.path.join(OUT, 'faces', f'{tname}_emo_{emo}{"_up" if talk else ""}.webp')), eb, not talk)
    if blink: T = paste(T, rgba(os.path.join(ROOT, 'art/faces', f'{tname}_eyes_closed.webp')), D['box'], False)
    return T


def sheet(tname, data):
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
    D = F1[tname]; x, y, w, h = data[tname]['box']
    talkm = 'D' if 'D' in D['mouths'] else 'C'
    cols = ['neutral'] + [e for e in EMOS if os.path.exists(os.path.join(OUT, 'faces', f'{tname}_emo_{e}.webp'))]
    bgc = (58, 54, 50)
    tiles = []
    gs = 0.62  # about the size he stands in a room on a 1920-wide screen
    for e in cols:
        em = None if e == 'neutral' else e
        quiet, talk, blink = compose(tname, em, data=data), compose(tname, em, talkm, data=data), compose(tname, em, blink=True, data=data)
        def im(a): return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')
        q = im(quiet); g = q.resize((round(q.width * gs), round(q.height * gs)), Image.LANCZOS)
        g = g.crop((0, 0, g.width, round(g.height * 0.38)))
        m = 10
        heads = [im(a).crop((x - m, y - m, x + w + m, y + h + m)) for a in (quiet, talk, blink)]
        heads = [hh.resize((hh.width * 3, hh.height * 3), Image.LANCZOS) for hh in heads]
        tw_ = max(g.width, heads[0].width) + 16
        t = Image.new('RGB', (tw_, 30 + g.height + 3 * (heads[0].height + 22) + 10), bgc)
        d = ImageDraw.Draw(t); d.text((8, 6), e, fill=(240, 235, 225), font=font)
        t.paste(g, (8, 30), g); yy = 30 + g.height + 4
        for lab, hh in zip(('quiet 3x', f'talking ({talkm}) 3x', 'blink 3x'), heads):
            d.text((8, yy), lab, fill=(170, 165, 155), font=font); t.paste(hh, (8, yy + 18), hh); yy += hh.height + 22
        tiles.append(t)
    Wt = sum(t.width for t in tiles); S = Image.new('RGB', (Wt, max(t.height for t in tiles)), bgc); xx = 0
    for t in tiles: S.paste(t, (xx, 0)); xx += t.width
    p = os.path.join(OUT, f'sheet_{tname}.jpg'); S.save(p, quality=92); print(p, S.size)


if __name__ == '__main__':
    cmd, names = sys.argv[1:2], sys.argv[2:] or list(TARGETS)
    jp = os.path.join(OUT, 'emo.json')
    data = json.load(open(jp)) if os.path.exists(jp) else {}
    if cmd == ['build']:
        os.makedirs(OUT, exist_ok=True)
        for n in names: data[n] = build(n)
        json.dump(data, open(jp, 'w'), indent=1)
        for n in names: sheet(n, data)
    elif cmd == ['sheet']:
        for n in names: sheet(n, data)
    else: sys.exit(__doc__)
