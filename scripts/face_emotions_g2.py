#!/usr/bin/env python3
"""Game II's emotions for Alan (sequel/art/faces/<frame>_emo_<e>[_up].webp) carried onto Game I's Alan, for review only.

  python3 scripts/face_emotions_g2.py build [target ...]     patches + emo.json into art/review/emotions_g2/
  python3 scripts/face_emotions_g2.py sheet [target ...]     a contact sheet per frame (game size and 3x)
  python3 scripts/face_emotions_g2.py clip  [target ...]     a clip per frame: one line spoken in each emotion, with the voice

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
CAP = float(os.environ.get('EMO_CAP', 28))  # most the target's colour may shift the source's detail (0-255)
LO, HI = float(os.environ.get('EMO_LO', 12)), float(os.environ.get('EMO_HI', 34))  # change strength (0-255) ramp
# target -> (source, base mouth for the quiet face: None = the painting's own, else a lip-sync patch, face zone, upper split)
#   zone: the face in front of the ear in target sprite px (polygon), where anything may change
#   split: the nose's underside (target sprite y): the _up patch keeps only what lies above it
SIDE_ZONE = lambda x, y: [(x + 22, y + 13), (x + 64, y + 12), (x + 80, y + 30), (x + 80, y + 90), (x + 30, y + 90), (x + 26, y + 50)]
TARGETS = {
    'alan_side': dict(src='alanv_side_k', base=None),
    'alan_idle2': dict(src='alanv_side_k', base=None),
    'alan_talk': dict(src='alanv_side_k', base='A', cap=10),  # (cap 10: its head is tilted from the source's, so less of its shading is trusted)
    'alan_talk2': dict(src='alanv_side_k', base='A', cap=10),
    'alan_front': dict(src='alanv_front_k', base=None),
    # Chapter V's cistern frame (the lantern): a profile turned a little towards us, its face box only the front of the face;
    # lined up by the eyes (zone: box-relative, brow to chin)
    'alan_lantern': dict(src='alanv_side_k', base=None, eyes=True, upper_only=('fear', 'anger', 'sadness', 'concern', 'surprise'),
                         skip=('embarrassed',),  # (its lips notch the nose tip on this turned head: left out)
                         zone=[(-4, 4), (36, 2), (36, 60), (0, 60), (-8, 30)]),
}


def eye_centre(faces_dir, frame, box):
    """Where the frame's eyes are (sprite px): the middle of its own shut-eye patch."""
    a = np.asarray(Image.open(os.path.join(faces_dir, frame + '_eyes_closed.webp')).convert('RGBA'))[..., 3]
    ys, xs = np.nonzero(a > 128)
    return box[0] + xs.mean(), box[1] + ys.mean()


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
    cfg = TARGETS[tname]; src = cfg['src']; cap = cfg.get('cap', CAP)
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
    if cfg.get('eyes'):  # line the eyes up, each frame's own shut-eye patch
        (ex, ey), (fx_, fy_) = eye_centre(os.path.join(SEQ, 'art/faces'), src, D2['box']), eye_centre(os.path.join(ROOT, 'art/faces'), tname, D1['box'])
        ox, oy = round(ex - fx_), round(ey - fy_)
    elif front:  # line the eyes up: Game II's front eyes are at sprite y 79 (face_emotions.py VIEWS), Game I's ~12 px into its box
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
    TA = paste(T, rgba(os.path.join(ROOT, 'art/faces', f'{tname}_A.webp')), D1['box'], True)
    Tc, Tqc = premul_up(T[cy0:cy1, cx0:cx1]), premul_up(Tq[cy0:cy1, cx0:cx1])
    S0c = premul_up(scrop(S0))
    Hk, Wk = Tc.shape[:2]
    yy, xx = np.mgrid[0:Hk, 0:Wk]
    # the face (target, 4x): only here is the fit measured and may anything change
    zone = np.zeros((Hk, Wk), np.uint8)
    if front:
        cv2.ellipse(zone, (int((tx + tw / 2 - cx0) * K), int((ty + th / 2 - 8 - cy0) * K)), (int(tw * 0.5 * K), int((th / 2 + 14) * K)), 0, 0, 360, 255, -1)
    else:
        pts = [(tx + px, ty + py) for px, py in cfg['zone']] if cfg.get('zone') else SIDE_ZONE(tx, ty)
        cv2.fillPoly(zone, [np.array([((px - cx0) * K, (py - cy0) * K) for px, py in pts], np.int32)], 255)
    fitm = ((zone > 0) & (Tqc[..., 3] > 200) & (S0c[..., 3] > 200)).astype(np.uint8) * 255
    cc, warp = fit(Tqc, S0c, fitm)  # (on the closed mouth: a talk frame's open jaw would pull the fit)
    wp = lambda a: cv2.warpAffine(a, warp, (Wk, Hk), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    S0w = wp(S0c)
    zonef = cv2.GaussianBlur(zone.astype(np.float32) / 255, (0, 0), 3 * K)
    # a band along the target's silhouette, about 2 px deep (its ink line)
    sil = (Tc[..., 3] > 128).astype(np.uint8)
    edge = (cv2.dilate(sil, np.ones((3, 3), np.uint8)) - cv2.erode(sil, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (4 * K + 1, 4 * K + 1)))).astype(np.float32)
    edge = cv2.GaussianBlur(edge, (0, 0), 0.6 * K)
    lipy = eye_centre(os.path.join(ROOT, 'art/faces'), tname, D1['box'])[1] + 19 if cfg.get('eyes') else ty + (46 if not front else 48)
    lips = yy > (lipy - cy0) * K   # below the nose's underside: where lips may move the outline
    res = {'fit': round(float(cc), 3), 'warp': warp.round(4).tolist(), 'emos': {}}
    # the target's emotion box: its face box, grown to whatever any emotion changes
    patches, boxes = {}, []
    for e in EMOS:
        pe = os.path.join(SEQ, 'art/faces', f'{src}_emo_{e}.webp'); pu = os.path.join(SEQ, 'art/faces', f'{src}_emo_{e}_up.webp')
        if not os.path.exists(pe) or e in cfg.get('skip', ()): continue
        Se = paste(S0, rgba(pe), sbox, True)
        Sew = wp(premul_up(scrop(Se)))
        Uw = wp(up(scrop(paste(np.zeros_like(S0), rgba(pu), sbox, True))[..., 3]))  # where the source's _up patch reaches
        # what the emotion changes, on the target
        d = np.abs(Sew[..., :3] - S0w[..., :3]).max(-1) * (np.maximum(Sew[..., 3], S0w[..., 3]) > 60)
        d = np.maximum(d, np.abs(Sew[..., 3] - S0w[..., 3]))
        # how strongly: faint drift in Gemini's repaint (under LO) keeps Game I's own strokes; a real change (over HI) is taken
        db = cv2.GaussianBlur(d, (0, 0), 1.0 * K)
        M = np.clip((db - LO) / (HI - LO), 0, 1); M = M * M * (3 - 2 * M)
        M = cv2.dilate(M, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * K + 1, 2 * K + 1)))
        M = cv2.GaussianBlur(M, (0, 0), 1.2 * K) * zonef
        # Game I's inked outline (nose, lips, chin) stays, except where the source's own outline moves (lips that part)
        M *= 1 - edge * (1 - cv2.GaussianBlur(cv2.dilate(((cv2.GaussianBlur(np.abs(Sew[..., 3] - S0w[..., 3]), (0, 0), K) > 40) & lips).astype(np.float32),
                                                       cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3 * K + 1, 3 * K + 1))), (0, 0), K))
        lo = lambda a: cv2.GaussianBlur(a, (0, 0), 1.5 * K)
        def blend(base):
            R = Sew[..., :3] + np.clip(lo(base[..., :3] - S0w[..., :3]), -cap, cap)  # (capped: a shading mismatch must not paint a blot)
            out = base.copy()
            out[..., :3] = base[..., :3] * (1 - M[..., None]) + R * M[..., None]
            out[..., 3] = np.clip(base[..., 3] + M * (Sew[..., 3] - S0w[..., 3]), 0, 255)
            return out
        Q, Tk = blend(Tqc), blend(Tc)
        Mu = M * np.clip(Uw / 255 * 1.5, 0, 1)
        # back at sprite size, mixed in by the mask there: where nothing changes the pixels stay exactly Game I's
        mm, mu = down(M, W, H)[..., None], down(Mu, W, H)
        mix = lambda base, hi: base * (1 - mm) + down(hi, W, H) * mm
        q = mix(Tq[cy0:cy1, cx0:cx1], Q)
        if e in cfg.get('upper_only', ()):  # the source's mouth doesn't sit on this face: its own closed mouth, the brows and eyes over it
            q = TA[cy0:cy1, cx0:cx1].copy(); ua = None
        u = mix(T[cy0:cy1, cx0:cx1], Tk); u[..., 3] *= mu
        if e in cfg.get('upper_only', ()):
            a = u[..., 3:4] / 255; q[..., :3] = u[..., :3] * a + q[..., :3] * (1 - a)
        mm = mm[..., 0]
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


def clip(tname, data, line='alan_let_go', fps=25):
    """The line spoken in each emotion (Game I's own Rhubarb cues and voice), then a second quiet; a blink now and then.
    Body at game size on the left, the head at 4x on the right. Writes clip_<frame>.mp4."""
    import subprocess, tempfile
    D = F1[tname]
    L = json.loads(open(os.path.join(ROOT, 'js/lipsync.js')).read().split('window.LIPSYNC = ', 1)[1].rstrip().rstrip(';'))['alan'][line]
    dur, cues = L
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
    x, y, w, h = data[tname]['box']; m = 14
    tmp = tempfile.mkdtemp(dir=OUT); n = 0
    emos = ['neutral'] + [e for e in EMOS if os.path.exists(os.path.join(OUT, 'faces', f'{tname}_emo_{e}.webp'))]
    cache = {}
    def shape(t):
        s = 'X'
        for t0, v in cues:
            if t0 <= t + 0.06: s = v
        s = {'X': 'A', 'G': 'B', 'H': 'C'}.get(s, s)
        return s if s in D['mouths'] else 'A'
    for e in emos:
        em = None if e == 'neutral' else e
        for i in range(int((dur + 1.2) * fps)):
            t = i / fps
            talk = shape(t) if t < dur else None
            blink = 1.9 < t < 2.02
            k = (em, talk, blink)
            if k not in cache: cache[k] = Image.fromarray(np.clip(compose(tname, em, talk, blink, data), 0, 255).astype(np.uint8), 'RGBA')
            im = cache[k]
            fr = Image.new('RGB', (1280, 720), (58, 54, 50))
            body = im.resize((round(im.width * 640 / im.height), 640), Image.LANCZOS); fr.paste(body, (60, 40), body)
            hd = im.crop((x - m, y - m, x + w + m, y + h + m)); s4 = min(560 / hd.height, 4)
            hd = hd.resize((round(hd.width * s4), round(hd.height * s4)), Image.LANCZOS); fr.paste(hd, (440, 60), hd)
            ImageDraw.Draw(fr).text((440, 650), f'{tname}: {e}' + ('  (talking)' if t < dur else '  (quiet)'), fill=(235, 230, 220), font=font)
            fr.save(os.path.join(tmp, f'{n:05d}.png')); n += 1
    voice = os.path.join(ROOT, 'audio/voice', line + '.mp3')
    seg, allw = os.path.join(tmp, 'seg.wav'), os.path.join(tmp, 'all.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', voice, '-af', f'apad=whole_dur={dur + 1.2}', '-ar', '44100', '-ac', '1', seg], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + sum([['-i', seg] for _ in emos], []) + ['-filter_complex', ''.join(f'[{k}:a]' for k in range(len(emos))) + f'concat=n={len(emos)}:v=0:a=1', allw], check=True)
    out = os.path.join(OUT, f'clip_{tname}.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(tmp, '%05d.png'), '-i', allw,
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-shortest', out], check=True)
    subprocess.run(['rm', '-r', tmp]); print(out)


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
    elif cmd == ['clip']:
        for n in names: clip(n, data)
    else: sys.exit(__doc__)
