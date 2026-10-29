#!/usr/bin/env python3
"""Alan's six Ludo walk cycles made to loop seamlessly (the user, 2026-10-29: "these walks need to be seamlessly
loopable - they are not at the moment").

  python3 sequel/scripts/walk_loop.py [run ...]     looped frames, LUDO entries, seam report and clips for review
  python3 sequel/scripts/walk_loop.py install       puts the reviewed loops into the game (only after approval)

What was wrong. Ludo drew each walk as a 36-frame clip, not a cycle: it starts from the standing keyframe (the first
three or four frames are the feet coming apart), runs through about one and a half strides, and stops wherever frame 35
falls; meanwhile the figure creeps inside the box (front and back: up to 17 px sideways, 1-2% bigger or smaller; side:
a few px forward). The engine plays a walk as frame = floor(phase) % 36 (js/engine/actor.js), so every 36 frames the
pose jumps back to the start of the stride and the body jumps back to where it began.

What this does, per run (frames read from art/sprites/, which carry the hair clean-up of scripts/hair_clean.py; the
fitted frames under art/review/ludo/ are not used):
  1. The loop window. Every pair of frames (a, c), a past the standing start (a >= 4) and c at least 8 frames on, is
     compared pose against pose (low-res, each frame's torso centre and feet lined up), and the best few are lined up
     properly (scale about the feet and a shift, searched): the window is a .. c-1 for the pair whose c sits best on a.
     Frame c is then the frame that would follow the last one, and it is the same pose as frame a: a whole stride (two
     steps, the same foot) and the loop's seam is a frame step like any other.
  2. Drift. The scale and shift that put frame c on frame a are what the figure drifted over the loop; frame a+k gets
     k/L of the opposite, so the body ends where it started and nothing jumps at the seam. A frame that needs no change
     is copied as it is; the rest are resampled once (Lanczos, premultiplied alpha), the box unchanged.
  3. An in-between at the seam, only if the seam, after 2, is still clearly bigger than the run's typical frame step
     (SEAM_IB): the last K frames are dissolved towards the frames that lead into frame a (lined up the same way).
  4. The loop is turned so its first frame is the pose nearest the standing painting (alanv_side_k etc.), so a walk
     starts from the stride closest to the stance it leaves.
  5. Measures for the engine (window.LUDO): steps per loop and ground per frame. Side views: the planted foot's slide
     from frame to frame in the box (it is the ground going by), averaged over the loop, in heights (meta h), so the
     feet don't slide in the game. Front and back: two steps a stride, and Game I's 0.34 heights a step
     (scripts/ludo_measure.py STEP_H), so the cadence is the same as before whatever the loop's length.

Seam number (report.json): the frame-to-frame change across the seam (last frame to first, mean absolute colour
difference over the figure, premultiplied alpha, 0-255) divided by the median of the same over the loop's other frame
steps. 1.0 means the seam is an ordinary frame step; the old runs are measured the same way (frame 35 to frame 0).

Writes art/review/walk_loop/: frames/<run>_NN.webp, ludo_walk_loop.json (per run: the new LUDO entry, the sprite box,
which source frames were kept, the drift taken out, the seam numbers), report.json, and per run walk_<run>.mp4 (the
figure in place, looped four times, at its frame rate: scripts/review_anim.py's walk()) and oldnew_<run>.mp4 (the old
run and the new loop side by side, same length). Nothing in the game changes.

install (after the user's approval): copies the frames over art/sprites/<run>_NN.webp, deletes that run's old frames
past the new count, and rewrites the six runs' entries (window.SPRITES boxes and window.LUDO) in js/sprites_ludo.js.
Re-running scripts/ludo_install.py afterwards would undo this (and the hair clean-up): run this script's install again.
"""
import glob, json, os, re, shutil, subprocess, sys, tempfile
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(SEQ, 'art/sprites')
OUT = os.path.join(SEQ, 'art/review/walk_loop')
LUDO_JS = os.path.join(SEQ, 'js/sprites_ludo.js')
RUNS = ['alanv_walk_side', 'alanv_walk_front', 'alanv_walk_back', 'alanb_walk_side', 'alanb_walk_front', 'alanb_walk_back']
START = 4          # the first frames are the feet coming apart from the standing keyframe: a loop starts after them
MIN_L = 8          # the shortest loop considered (frames)
STEP_H = 0.34      # front/back: a step towards or away from the camera, in heights (scripts/ludo_measure.py)
SEAM_IB = 1.3      # in-between at the seam only if the seam is still this many times the median frame step
IB_K = 3           # ...over this many frames
BG = (46, 43, 52)  # the review clips' background (scripts/review_anim.py)
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)


# ---------------------------------------------------------------- frames and data
def node(js):
    return json.loads(subprocess.run(['node', '-e', 'global.window={};' + js], capture_output=True, text=True,
                                     check=True, cwd=SEQ).stdout)


def game_data():
    return node("require('./js/sprites_ludo.js');console.log(JSON.stringify({S:window.SPRITES,L:window.LUDO}))")


def load(key):
    return np.asarray(Image.open(os.path.join(SPR, key + '.webp')).convert('RGBA')).astype(np.float32) / 255


def pm(a):  # premultiplied
    b = a.copy(); b[..., :3] *= b[..., 3:]; return b


def unpm(p):
    a = p.copy(); al = np.maximum(a[..., 3:], 1e-6); a[..., :3] = np.where(a[..., 3:] > 1e-4, a[..., :3] / al, 0)
    return np.clip(a, 0, 1)


def warp(p, s, dx, dy, ax, fy, interp=cv2.INTER_LINEAR):
    """scale s about the feet (ax, fy), then shift (dx, dy); p premultiplied"""
    M = np.float32([[s, 0, ax - s * ax + dx], [0, s, fy - s * fy + dy]])
    return cv2.warpAffine(p, M, (p.shape[1], p.shape[0]), flags=interp, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))


def diff(p, q):
    """mean absolute difference over the figure (either frame's), premultiplied, 0-255"""
    u = (p[..., 3] > 0.05) | (q[..., 3] > 0.05)
    return float(np.abs(p - q)[u].mean() * 255)


def lowres(p, k):
    return cv2.resize(p, (p.shape[1] // k, p.shape[0] // k), interpolation=cv2.INTER_AREA)


def reg(a):
    """the figure's registration: feet (lowest row), top, height, torso centre x"""
    ys, xs = np.nonzero(a[..., 3] > 0.16); top, bot = ys.min(), ys.max(); h = bot - top
    t = (ys > top + 0.2 * h) & (ys < top + 0.45 * h)
    return dict(top=int(top), bot=int(bot), h=int(h), tx=float(xs[t].mean()))


def align(pa, pb, ax, fy, k=4):
    """(s, dx, dy, err): frame b scaled about the feet and shifted to sit on frame a; searched coarse (1/k) then fine"""
    A, B0 = lowres(pa, k), lowres(pb, k); best = (9e9,)
    for s in np.arange(0.96, 1.0401, 0.005):
        Bs = warp(B0, s, 0, 0, ax / k, fy / k)
        for dx in range(-10, 11):
            for dy in range(-5, 6):
                e = diff(A, np.roll(np.roll(Bs, dy, 0), dx, 1))
                if e < best[0]: best = (e, s, dx * k, dy * k)
    _, s, dx, dy = best; best = (9e9,)
    for s2 in (s - 0.0025, s, s + 0.0025):
        for ddx in range(-k, k + 1):
            for ddy in range(-k, k + 1):
                e = diff(pa, warp(pb, s2, dx + ddx, dy + ddy, ax, fy))
                if e < best[0]: best = (e, s2, dx + ddx, dy + ddy)
    e, s, dx, dy = best
    return float(s), int(dx), int(dy), e


def pose_matrix(P, R, k=4):
    """every frame against every other, each lined up on its torso centre and feet (a cheap first pass)"""
    H, W = P[0].shape[:2]
    N = [lowres(warp(P[i], 1, W / 2 - R[i]['tx'], H - 6 - R[i]['bot'], 0, 0), k) for i in range(len(P))]
    return np.array([[diff(N[i], N[j]) for j in range(len(P))] for i in range(len(P))])


def seam_number(P):
    """the step across the seam (last -> first) over the median of the other frame steps"""
    st = [diff(P[i], P[(i + 1) % len(P)]) for i in range(len(P))]
    return st[-1] / float(np.median(st[:-1])), st[-1], float(np.median(st[:-1]))


def drift_jump(F):
    """the body's jump at the seam against the median frame step: torso x, feet y, height (px)"""
    R = [reg(a) for a in F]; out = {}
    for key in ('tx', 'bot', 'h'):
        v = np.array([r[key] for r in R], float); st = np.abs(np.diff(np.r_[v, v[0]]))
        out[key] = {'seam': round(float(st[-1]), 1), 'median': round(float(np.median(st[:-1])), 1)}
    return out


# ---------------------------------------------------------------- measures
def ground_slide(F, fy, h0):
    """side view: how far the planted foot slides back in the box from each frame to the next (cyclic), heights"""
    lo, hi = int(fy - 0.035 * h0), int(fy + 3)
    S = [a[lo:hi, :, 3] for a in F]; out = []
    for i in range(len(F)):
        a, b = S[i], S[(i + 1) % len(F)]; best = (-1, 0)
        for dx in range(-45, 11):
            sh = np.roll(a, dx, 1)
            if dx < 0: sh[:, dx:] = 0
            elif dx > 0: sh[:, :dx] = 0
            ov = np.minimum(sh, b).sum()
            if ov > best[0]: best = (ov, dx)
        out.append(-best[1] / h0)   # facing right: the planted foot moves left (dx < 0) as the ground goes by
    return out


def side_steps(F):
    """contacts (the feet furthest apart) in the loop, cyclic: scripts/ludo_measure.py's side test"""
    span = []
    for a in F:
        ys, xs = np.nonzero(a[..., 3] > 0.16); lo = ys.max() - int(0.05 * (ys.max() - ys.min())); fx = xs[ys >= lo]
        span.append(fx.max() - fx.min())
    span = np.array(span, float); n = len(span)
    sm = np.array([span[[(i + j) % n for j in range(-2, 3)]].mean() for i in range(n)])
    pk = [i for i in range(n) if sm[i] > sm[(i - 1) % n] and sm[i] >= sm[(i + 1) % n]]
    return [i for i in pk if sm[i] > sm.min() + 0.5 * (sm.max() - sm.min())]


# ---------------------------------------------------------------- the loop
def build(run, data, log=print):
    L0 = data['L'][run]; keys = L0['frames']; meta = data['S'][keys[0]]
    ax, fy, h0 = meta['ax'], meta['fy'], meta['h']
    F = [load(k) for k in keys]; P = [pm(a) for a in F]; R = [reg(a) for a in F]; n = len(F)
    before = seam_number(P)
    # 1. the window
    D = pose_matrix(P, R)
    pairs = sorted((D[a, c], a, c) for a in range(START, n) for c in range(a + MIN_L, n)); seen, cand = [], []
    for v, a, c in pairs:
        if any(abs(a - a2) <= 1 and abs(c - c2) <= 1 for a2, c2 in seen): continue
        seen.append((a, c))
        if len(seen) > 6: break
        cand.append((align(P[a], P[c], ax, fy), a, c))
    (s, dx, dy, err), a, c = min(cand, key=lambda t: t[0][3]); L = c - a
    log(f'{run}: window {a}..{c - 1} ({L} frames; frame {c} sits on frame {a}: {err:.1f} after s={s:.4f} dx={dx} dy={dy})')
    # 2. drift: frame a+k gets k/L of the way to (s, dx, dy); the frames before a (for the in-between) the same, negative
    def fixed(i):
        t = (i - a) / L
        if abs(s ** t - 1) * h0 < 0.25 and round(t * dx) == t * dx and round(t * dy) == t * dy:
            return warp(P[i], 1, t * dx, t * dy, ax, fy, cv2.INTER_NEAREST) if (dx or dy) and t else P[i].copy()
        return warp(P[i], s ** t, t * dx, t * dy, ax, fy, cv2.INTER_LANCZOS4)
    Q = [fixed(i) for i in range(a, c)]
    src = [[i] for i in range(a, c)]
    mid = seam_number(Q)
    # 3. an in-between at the seam, only if still needed
    ib = False
    if mid[0] > SEAM_IB and a >= IB_K:
        for j in range(IB_K):
            w = (j + 1) / (IB_K + 1); pos = L - IB_K + j
            t = (j - IB_K) / L   # frame a-K+j lined up as the frame that leads into the seam
            Q[pos] = (1 - w) * Q[pos] + w * warp(P[a - IB_K + j], s ** t, t * dx, t * dy, ax, fy, cv2.INTER_LANCZOS4)
            src[pos] = [a + pos, a - IB_K + j, round(w, 2)]
        ib = True
    # 4. start nearest the standing painting
    still = load(run.replace('_walk_', '_') + '_k') if os.path.exists(os.path.join(SPR, run.replace('_walk_', '_') + '_k.webp')) else None
    rot = 0
    if still is not None:
        Rs = reg(still); Hs, Ws = still.shape[:2]; H, W = Q[0].shape[:2]
        canvas = np.zeros_like(Q[0]); sp = pm(still)
        y0, x0 = (H - 6 - Rs['bot']), int(round(W / 2 - Rs['tx']))   # the still on the loop's box, feet and torso lined up
        ys0, xs0 = max(0, y0), max(0, x0); ys1, xs1 = min(H, y0 + Hs), min(W, x0 + Ws)
        canvas[ys0:ys1, xs0:xs1] = sp[ys0 - y0:ys1 - y0, xs0 - x0:xs1 - x0]
        ref = lowres(canvas, 4)
        sc = []
        for i, q in enumerate(Q):
            r = reg(unpm(q)); sc.append(diff(ref, lowres(warp(q, 1, W / 2 - r['tx'], H - 6 - r['bot'], 0, 0), 4)))
        rot = int(np.argmin(sc))
    Q = Q[rot:] + Q[:rot]; src = src[rot:] + src[:rot]
    after = seam_number(Q)
    out = [unpm(q) for q in Q]
    # box: the content must stay inside it
    edge = max(max(float(o[0, :, 3].max()), float(o[:, 0, 3].max()), float(o[:, -1, 3].max())) for o in out)
    # 5. measures
    if '_side' in run:
        g = ground_slide(out, fy, h0); at = side_steps(out); steps = max(1, len(at))
        ent = {'frames': None, 'fps': L0['fps'], 'steps': steps, 'step': round(float(np.mean(g)), 4), 'at': at}
        old_g = float(np.mean(ground_slide(F[START:], fy, h0)[:-1]))
    else:
        steps = 2
        ent = {'frames': None, 'fps': L0['fps'], 'steps': steps, 'step': round(steps * STEP_H / L, 4)}
        g, old_g = None, None
    ent['frames'] = [f'{run}_{i:02d}' for i in range(L)]
    rep = {
        'old': {'frames': n, 'steps': L0.get('steps'), 'step': L0.get('step')},
        'new': {'frames': L, 'steps': ent['steps'], 'step': ent['step']},
        'kept': f'{a}..{c - 1}', 'first_frame': a + rot if not ib or rot < L - IB_K else None, 'rotation': rot,
        'drift_removed': {'scale': round(1 / s, 4), 'dx': -dx, 'dy': -dy, 'over_frames': L},
        'match_err': round(err, 1), 'inbetween': ib, 'src': src,
        'seam_before': {'number': round(before[0], 2), 'seam': round(before[1], 1), 'median_step': round(before[2], 1),
                        'body': drift_jump(F)},
        'seam_after_drift_only': round(mid[0], 2),
        'seam_after': {'number': round(after[0], 2), 'seam': round(after[1], 1), 'median_step': round(after[2], 1),
                       'body': drift_jump(out)},
        'edge_alpha': round(edge, 3),
    }
    if g is not None:
        rep['ground_per_frame'] = {'mean': round(float(np.mean(g)), 4), 'min': round(float(min(g)), 4),
                                   'max': round(float(max(g)), 4), 'old_frames_same_measure': round(old_g, 4)}
    log(f'  seam {before[0]:.2f} -> {after[0]:.2f} (drift only {mid[0]:.2f}{", in-between" if ib else ""}); '
        f'{L} frames, {ent["steps"]} steps, step {ent["step"]} (was {n}, {L0.get("steps")}, {L0.get("step")})')
    return out, ent, meta, rep, F


# ---------------------------------------------------------------- review clips
def encode(d, out, fps):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(d, '%05d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out], check=True)


def to_im(a):
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA')


def panel(im, H=520, label=None, tag=None):
    s = H / im.height; W = round(im.width * s) + 40
    fr = Image.new('RGB', (W, H + 40), BG)
    t = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    fr.paste(t, ((W - t.width) // 2, H + 20 - t.height), t)
    dr = ImageDraw.Draw(fr)
    if label: dr.text((10, 8), label, font=FONT, fill=(230, 230, 230))
    if tag: dr.text((W - 10 - dr.textlength(tag, font=FONT), 8), tag, font=FONT, fill=(255, 210, 90))
    return fr


def clips(run, new, old, fps):
    tmp = tempfile.mkdtemp(dir=OUT); k = 0
    for _ in range(4):                       # in place, looped four times
        for im in new:
            fr = panel(im); fr = fr.crop((0, 0, fr.width + fr.width % 2, fr.height)); fr.save(os.path.join(tmp, f'{k:05d}.png')); k += 1
    encode(tmp, os.path.join(OUT, f'walk_{run}.mp4'), fps); shutil.rmtree(tmp)
    tmp = tempfile.mkdtemp(dir=OUT); total = 3 * len(old)
    for k in range(total):                   # old (36 frames) beside new, the same length: three old loops
        i, j = k % len(old), k % len(new)
        A = panel(old[i], label='old', tag=f'{i:02d}' + ('  seam' if i == 0 and k else ''))
        B = panel(new[j], label='new', tag=f'{j:02d}' + ('  seam' if j == 0 and k else ''))
        fr = Image.new('RGB', (A.width + B.width + (A.width + B.width) % 2, A.height), BG)
        fr.paste(A, (0, 0)); fr.paste(B, (A.width, 0)); fr.save(os.path.join(tmp, f'{k:05d}.png'))
    encode(tmp, os.path.join(OUT, f'oldnew_{run}.mp4'), fps); shutil.rmtree(tmp)


# ---------------------------------------------------------------- main
def main(runs):
    data = game_data(); os.makedirs(os.path.join(OUT, 'frames'), exist_ok=True)
    jp, rp = os.path.join(OUT, 'ludo_walk_loop.json'), os.path.join(OUT, 'report.json')
    J = json.load(open(jp)) if os.path.exists(jp) else {}
    REP = json.load(open(rp)) if os.path.exists(rp) else {}
    for run in runs:
        out, ent, meta, rep, old = build(run, data)
        for f in glob.glob(os.path.join(OUT, 'frames', run + '_[0-9][0-9].webp')): os.remove(f)
        ims = [to_im(o) for o in out]
        for key, im in zip(ent['frames'], ims): im.save(os.path.join(OUT, 'frames', key + '.webp'), 'WEBP', quality=90, method=6)
        J[run] = {'ludo': ent, 'sprite': meta}
        REP[run] = rep
        clips(run, [Image.open(os.path.join(OUT, 'frames', k + '.webp')).convert('RGBA') for k in ent['frames']],
              [to_im(a) for a in old], ent['fps'])
    json.dump(J, open(jp, 'w'), indent=1)
    json.dump(REP, open(rp, 'w'), indent=1)
    print('wrote', OUT)


def install():
    J = json.load(open(os.path.join(OUT, 'ludo_walk_loop.json'))); data = game_data()
    S, L = data['S'], data['L']
    for run, e in J.items():
        for k in L[run]['frames']: S.pop(k, None)
        for f in glob.glob(os.path.join(SPR, run + '_[0-9][0-9].webp')): os.remove(f)
        for k in e['ludo']['frames']:
            shutil.copyfile(os.path.join(OUT, 'frames', k + '.webp'), os.path.join(SPR, k + '.webp'))
            S[k] = e['sprite']
        L[run] = e['ludo']
    with open(LUDO_JS, 'w') as f:   # the same layout as scripts/ludo_install.py writes
        f.write('// Generated by sequel/scripts/ludo_install.py: the approved Ludo runs. Do not edit by hand.\n')
        f.write('// Alan\'s six walk runs replaced by their seamless loops (scripts/walk_loop.py install).\n')
        f.write('window.SPRITES = Object.assign(window.SPRITES || {}, ' + json.dumps(S, separators=(',', ':')) + ');\n')
        f.write('window.LUDO = ' + json.dumps(L, indent=1) + ';\n')
    print(len(J), 'walk runs installed:', ', '.join(f'{r} {len(e["ludo"]["frames"])} frames' for r, e in J.items()))


if __name__ == '__main__':
    if sys.argv[1:2] == ['install']: install()
    else: main(sys.argv[1:] or RUNS)
