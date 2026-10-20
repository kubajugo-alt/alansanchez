# A contact frame whose leading heel the painter left hanging above the floor: stretch that shin down so the heel
# lands, with a smooth displacement that is zero at the knee and behind the hips and full at the front boot (the
# rest of the figure doesn't move).  python3 scripts/walk_heel_down.py <in.png> <out.png> <ax> <fy> <h>
import sys, numpy as np, cv2
from PIL import Image
src, out, ax, fy, h = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:6])
a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32); H, W = a.shape[:2]
al = a[..., 3] > 128
front = al[:, int(ax + 0.08 * h):]; ys = np.nonzero(front.any(1))[0]
gap = fy - (ys.max() + 1)                                  # how far the front boot's lowest pixel is above the floor
print(f'front boot {gap:.0f}px above the floor')
if gap <= 1: sys.exit(0)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
knee = fy - 0.27 * h
wx = np.clip((xx - ax) / (0.12 * h), 0, 1)               # 0 behind the hips, 1 from just ahead of them
# backward map: the output pixel at y comes from y - d; solve d at the source row approximately by iterating
sy = yy.copy()
for _ in range(4): sy = yy - gap * np.clip((sy - knee) / (fy - knee), 0, 1) ** 1.2 * wx
res = np.nan_to_num(cv2.remap(a, xx, sy.astype(np.float32), cv2.INTER_LINEAR))
Image.fromarray(np.clip(res, 0, 255).astype(np.uint8), 'RGBA').save(out)
