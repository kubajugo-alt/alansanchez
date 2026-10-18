# The pale rim some cut-outs keep along their edge (the light outline of the old background, one or two pixels
# wide): those pixels keep their place but take the colour of the paint just inside them. Only edge pixels (within
# 2 px of transparency) much lighter and greyer than that paint change; the warm T-shirt and highlights stay.
#   python3 scripts/derim.py frame ...        (sprite names; run once per frame)
import sys, numpy as np, cv2
from PIL import Image


def derim(a):
    rgb = a[..., :3].astype(np.float32)
    edge = cv2.dilate((a[..., 3] < 20).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    inner = (cv2.erode((a[..., 3] > 200).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0)
    fill = cv2.inpaint(np.ascontiguousarray(a[..., :3]), (~inner).astype(np.uint8) * 255, 4, cv2.INPAINT_TELEA).astype(np.float32)
    lum, flum = rgb.mean(-1), fill.mean(-1)
    sat = rgb.max(-1) - rgb.min(-1)
    # lighter than the paint just inside it and nearly colourless: the old background's rim, not a highlight
    rim = edge & (a[..., 3] > 0) & (lum > flum + 30) & (sat < 45) & (rgb[..., 2] >= rgb[..., 0] - 10)
    if not rim.any(): return a, 0
    out = a.copy(); out[..., :3] = np.where(rim[..., None], fill.astype(np.uint8), a[..., :3])
    return out, int(rim.sum())

if __name__ == '__main__':
    for f in sys.argv[1:]:
        p = f'art/sprites/{f}.webp'; a = np.asarray(Image.open(p).convert('RGBA'))
        b, n = derim(a); Image.fromarray(b).save(p, lossless=True, quality=100); print(f, n, 'rim px recoloured')
