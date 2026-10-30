#!/usr/bin/env python3
"""Put a figure's real face back on frames an animation model distorted (the user, 2026-10-29, on Ludo forge's undress:
"forge distorted Alan's face whilst it's undressing. Can we fix it?").

  python3 sequel/scripts/head_swap.py <reference sprite> <frame prefix>     e.g. alanv_front_k alan_undress_

For each art/sprites/<prefix>NN.webp: YuNet finds the face and its five landmarks (eyes, nose, mouth corners); the
reference sprite's face is warped onto them (a similarity transform), its colour matched to the frame's skin around it,
and laid over an ellipse from brow to chin, feathered, so the frame keeps its own hair, ears and outline. Frames with no
face found (a top over the head) are left as they are. The originals are kept in art/review/head_swap/<prefix>/.
"""
import glob, os, shutil, sys
import cv2, numpy as np
from PIL import Image

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(SEQ, 'scripts/models/yunet.onnx')
BG = (60, 64, 80)


def face(rgba):
    """(score, 5x2 landmarks, box) of the best face, at the sprite's own scale, or None."""
    a = rgba.astype(np.float32); al = a[..., 3:] / 255
    bgr = (a[..., :3] * al + np.array(BG) * (1 - al)).astype(np.uint8)[..., ::-1].copy()
    big = cv2.resize(bgr, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC); H, W = big.shape[:2]
    det = cv2.FaceDetectorYN_create(MODEL, '', (W, H), 0.6, 0.3, 50); _, f = det.detect(big)
    if f is None or not len(f): return None
    f = max(f, key=lambda r: r[-1]) / 2
    return float(f[-1] * 2), f[4:14].reshape(5, 2), f[:4]


def main(ref, prefix):
    R = np.asarray(Image.open(os.path.join(SEQ, 'art/sprites', ref + '.webp')).convert('RGBA'))
    fr = face(R)
    if not fr: sys.exit('no face on ' + ref)
    _, rl, rb = fr
    keep = os.path.join(SEQ, 'art/review/head_swap', prefix.rstrip('_')); os.makedirs(keep, exist_ok=True)
    done = 0
    for p in sorted(glob.glob(os.path.join(SEQ, 'art/sprites', prefix + '[0-9][0-9].webp'))):
        n = os.path.basename(p)[:-5]; orig = os.path.join(keep, n + '.webp')
        if not os.path.exists(orig): shutil.copyfile(p, orig)
        A = np.asarray(Image.open(orig).convert('RGBA')).copy()
        f = face(A)
        if not f or f[0] < 0.75: print(n, 'no face, kept'); continue
        _, fl, fb = f
        M, _ = cv2.estimateAffinePartial2D(rl, fl, method=cv2.LMEDS)
        if M is None: print(n, 'no fit, kept'); continue
        Hh, Ww = A.shape[:2]
        warped = cv2.warpAffine(R, M, (Ww, Hh), flags=cv2.INTER_CUBIC, borderValue=(0, 0, 0, 0)).astype(np.float32)
        # the face ellipse, from the brows to the chin, cheek to cheek (the frame keeps its hair and ears)
        x, y, w, h = fb; cx, cy = x + w / 2, y + h * 0.56
        m = np.zeros((Hh, Ww), np.float32)
        cv2.ellipse(m, (int(cx), int(cy)), (int(w * 0.43), int(h * 0.52)), 0, 0, 360, 1, -1)
        m = cv2.GaussianBlur(m, (0, 0), max(1.5, w * 0.06)) * (warped[..., 3] / 255) * (A[..., 3] / 255)
        # colour: the warped face's skin brought to the frame's own, measured in a ring just inside the ellipse
        ring = (m > 0.2) & (m < 0.6)
        if ring.sum() > 20:
            warped[..., :3] += (A[..., :3][ring].astype(np.float32).mean(0) - warped[..., :3][ring].mean(0))
        out = A.astype(np.float32)
        out[..., :3] = out[..., :3] * (1 - m[..., None]) + np.clip(warped[..., :3], 0, 255) * m[..., None]
        Image.fromarray(out.astype(np.uint8), 'RGBA').save(p, quality=90, alpha_quality=100)
        done += 1; print(n, 'face replaced')
    print(done, 'frames')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
