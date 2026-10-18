# Where each walk frame's feet are, relative to the frame's anchor, in his heights: [[x, lift], ...] per boot
# (front to back). The engine times each step of the walk by how far the standing foot travels (walkLen), so the
# foot that carries his weight stays on the same spot of floor.
#   python3 scripts/walk_plant.py frame ...
import json, sys, numpy as np, cv2
from PIL import Image
t = open('js/sprites.js').read(); M = json.loads(t[t.index('{'):t.rindex('}') + 1])
C = {c['id']: c for c in json.load(open('art/review/candidates.json'))['candidates']}


def feet(f):
    m = M.get(f) or C[f]['meta']; im = Image.open(f'art/sprites/{f}.webp' if f in M else C[f]['src'])
    a = (np.asarray(im.convert('RGBA'))[..., 3] > 128).astype(np.uint8)
    rgb = np.asarray(im.convert('RGB')).astype(int)
    boot = a.astype(bool) & (rgb[..., 0] > rgb[..., 2] + 25)          # the brown boots, not the blue jeans
    boot[:int(m['fy'] - 0.13 * m['h'])] = False
    n, lab, st, _ = cv2.connectedComponentsWithStats(boot.astype(np.uint8), 8)
    out = []
    for i in range(1, n):
        if st[i, 4] < 250: continue
        ys, xs = np.where(lab == i)
        out.append([round(float((xs.mean() - m['ax']) / m['h']), 3), round(float((m['fy'] - ys.max()) / m['h']), 3)])
    return sorted(out, reverse=True)


if __name__ == '__main__':
    for f in sys.argv[1:]: print(f, feet(f))
