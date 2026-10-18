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
                v = r[:14].reshape(7, 2).copy()
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


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'find': find()
    else: sys.exit(__doc__ if False else 'usage: face_kit.py find | gen [frame ...] | build [frame ...]')
