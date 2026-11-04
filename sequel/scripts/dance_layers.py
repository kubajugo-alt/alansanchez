# The women of light (the closing of Cave 6, HANDOFF entry 110): the approved Higgsfield/Kling dance loop
# (art/review/harimaguadas/dance_a7.mp4: seven women of warm light dancing in a ring on black, 8 s, last frame = first)
# split into two loops, so Alan can stand inside the ring: BACK (the far half of the ring, drawn behind him) and FRONT
# (the near half, drawn over him). Both on black, for 'screen' blending: back + front give the original frame back.
#
#   python3 sequel/scripts/dance_layers.py <depth-model.onnx> [src.mp4]
#   model: Depth Anything V2 small, ONNX (as scripts/depth_map.py):
#          https://huggingface.co/onnx-community/depth-anything-v2-small (onnx/model.onnx); not kept in the repo
#
# How the split works, per frame:
#  1. luminance core: the frame's brightest channel, blurred 2 px, over 0.3 (the women's bodies, robes, hair; not the
#     faint trails and glow);
#  2. depth: Depth Anything V2 on the frame (relative inverse depth, larger = nearer), normalised over the core's 3rd..97th
#     percentiles; the women of the near half come out clearly nearer than the far half (the ring is seen from above, so
#     their feet are lower and they are bigger, and the model reads that);
#  3. a threshold between the two (Otsu on the core's depth histogram, then a circular median over 9 frames so it does
#     not jump), and a soft vote per core pixel (sigmoid, width 0.05);
#  4. the vote spread to every pixel by normalised convolution weighted by brightness (8 px near the bodies, 30 px for
#     the glow and trails far from them), so each woman's glow goes with her and the mask is soft;
#  5. over time: a circular gaussian (sigma 1.5 frames, the loop wraps), so nobody flickers between the layers;
#  6. front = frame x smoothstep(0.35, 0.65, vote), back = frame x (1 - that); the near-black lifted to pure black.
# The last frame (= the first) is dropped, so the loop is 192 frames, 8.0 s at 24 fps.
# Writes art/video/harimaguadas.mp4 (H.264) and .webm (VP9), 960 x 1080: BACK on top, FRONT below (one video, not
# two: two video elements drift a frame apart and a woman split across the halves would tear), and the review strips
# art/review/harimaguadas/split_*.jpg (red = front, blue = back).
import os, sys, subprocess, numpy as np, cv2, onnxruntime as ort
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = sys.argv[1]
SRC = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'art/review/harimaguadas/dance_a7.mp4')
OUT = os.path.join(ROOT, 'art/video'); REV = os.path.join(ROOT, 'art/review/harimaguadas')
W, H, FPS = 960, 540, 24

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-fps_mode', 'passthrough', '-vf', f'scale={W}:{H}:flags=area',
                      '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)[:-1]   # (the last frame is the first again)
N = len(fr); print('frames', N)

so = ort.SessionOptions(); so.intra_op_num_threads = os.cpu_count() or 4
sess = ort.InferenceSession(MODEL, so, providers=['CPUExecutionProvider'])
def depth(f):
    x = np.asarray(Image.fromarray(f).resize((518 * W // H // 14 * 14, 518), Image.BICUBIC)).astype(np.float32) / 255
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    d = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    return np.asarray(Image.fromarray(d.astype(np.float32)).resize((W, H), Image.BILINEAR))

def otsu(v):
    h = np.histogram(v, 64, (0, 1))[0].astype(float); c = np.arange(64) / 64 + 1 / 128; best = (0, 0.5)
    for k in range(8, 56):
        w0, w1 = h[:k].sum(), h[k:].sum()
        if w0 and w1:
            s = w0 * w1 * ((h[:k] * c[:k]).sum() / w0 - (h[k:] * c[k:]).sum() / w1) ** 2
            if s > best[0]: best = (s, c[k])
    return best[1]

L = fr.max(-1).astype(np.float32) / 255
DN, CORE, T = [], [], []
for i in range(N):
    l = cv2.GaussianBlur(L[i], (0, 0), 2); core = l > 0.3
    d = depth(fr[i]); lo, hi = np.percentile(d[core], [3, 97]); dn = np.clip((d - lo) / (hi - lo + 1e-6), 0, 1)
    DN.append(dn.astype(np.float16)); CORE.append(l * core); T.append(otsu(dn[core]))
    if i % 24 == 0: print('depth', i)
T = np.array(T); Ts = np.array([np.median(np.take(T, range(i - 4, i + 5), mode='wrap')) for i in range(N)])

nc = lambda a, s: cv2.GaussianBlur(a, (0, 0), s)
V = np.zeros((N, H, W), np.float32)
for i in range(N):
    w = CORE[i]; p = w / (1 + np.exp(-(DN[i].astype(np.float32) - Ts[i]) / 0.05))
    pf = nc(p, 8) / (nc(w, 8) + 1e-4); pc = nc(p, 30) / (nc(w, 30) + 1e-4); a = np.clip(nc(w, 8) * 20, 0, 1)
    V[i] = a * pf + (1 - a) * pc
k = np.exp(-0.5 * (np.arange(-4, 5) / 1.5) ** 2); k /= k.sum()
G = sum(kk * np.roll(V, j, 0) for j, kk in zip(range(-4, 5), k))
M = np.clip((G - 0.35) / 0.3, 0, 1); M = M * M * (3 - 2 * M)

def lift(x):   # near-black to pure black (no grey box under 'screen')
    return np.clip((x - 4) * 255 / 251, 0, 255).astype(np.uint8)
F32 = fr.astype(np.float32)
front = lift(F32 * M[..., None]); back = lift(F32 * (1 - M[..., None]))

def encode(name, frames):
    mp4, webm = os.path.join(OUT, name + '.mp4'), os.path.join(OUT, name + '.webm')
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{frames.shape[2]}x{frames.shape[1]}', '-r', str(FPS), '-i', '-',
                          '-an', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-movflags', '+faststart', mp4], stdin=subprocess.PIPE)
    p.stdin.write(np.ascontiguousarray(frames).tobytes()); p.stdin.close(); p.wait()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', webm], check=True)
    print(name, os.path.getsize(mp4) // 1024, 'KB mp4,', os.path.getsize(webm) // 1024, 'KB webm')
encode('harimaguadas', np.concatenate([back, front], 1))   # (stacked: back on top, front below; one video, so the halves never drift apart)

# ---------------------------------------------------------------- the review strips (red = front, blue = back)
def vis(i, w, h):
    lum = L[i][..., None]; m = M[i][..., None]
    rgb = np.concatenate([lum, lum * 0.3, lum * 0.1], -1) * m + np.concatenate([lum * 0.15, lum * 0.4, lum], -1) * (1 - m)
    return Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).resize((w, h))
def sheet(idx, w, h, cols, path):
    S = Image.new('RGB', (w * cols, h * ((len(idx) + cols - 1) // cols)))
    for j, i in enumerate(idx): S.paste(vis(i, w, h), ((j % cols) * w, (j // cols) * h))
    S.save(path, quality=86); print('saved', path)
sheet(list(range(0, N, 8)), 320, 180, 6, os.path.join(REV, 'split_all.jpg'))          # the whole loop, every 1/3 s
sheet(list(range(56, 152, 2)), 240, 135, 8, os.path.join(REV, 'split_flicker.jpg'))   # the busiest stretch, every 2nd frame
sheet([0, 40, 90, 150], 640, 360, 2, os.path.join(REV, 'split_frames.jpg'))
# the two layers themselves, side by side (back | front), four frames
S = Image.new('RGB', (960, 4 * 270))
for j, i in enumerate([0, 48, 96, 144]):
    S.paste(Image.fromarray(back[i]).resize((480, 270)), (0, j * 270)); S.paste(Image.fromarray(front[i]).resize((480, 270)), (480, j * 270))
S.save(os.path.join(REV, 'split_layers.jpg'), quality=86)
