# Audits the cut-out of every sprite the game can draw for background left behind, and (with `fix`) writes
# cleaned candidates for review. Nothing in the game is changed: results go to art/review/cutout/.
#
#   python3 scripts/cutout_audit.py audit [--crops]        -> art/review/cutout/report.json (+ crops/ of each finding)
#   python3 scripts/cutout_audit.py audit --dir art/review/cutout/sprites   (re-audit the cleaned files)
#   python3 scripts/cutout_audit.py fix NAME[:fixes] ...   -> art/review/cutout/sprites/NAME.webp + before_after/NAME.png
#
# The images: art/sprites/*.webp, the bath and Duarte sets loadApproved() (js/story/main.js) always loads
# (art/review/alan/{bath_new,duarte_new}/sprites/), and the review candidates approved in art/review/approvals.json.
# Face patches (art/faces/) are rectangles laid over the painting by design: only checked for key colour.
#
# What counts as background left behind (each finding: type, pixel count, bbox [x, y, w, h] in sprite pixels):
#   key      chroma green / magenta in the pixels (premultiplied excess: how much of it reaches the screen)
#   halo     a pale rim round the outline: edge pixels lighter and greyer than the paint just inside them
#   speck    islands detached from the figure (small; props and flying clothes are big and come out as 'island')
#   haze     faint pixels (alpha 1-63) more than 3 px from any solid paint: invisible on screen until lit or warped
#   hole     flat, colourless pale patches inside the silhouette (studio backdrop caught between arm and body)
#   border   paint on the outermost pixel of the canvas, or long dead-straight cut edges (a rectangle's side)
import glob, json, os, sys
import numpy as np, cv2
from PIL import Image

WIDE = 5.5     # px: pale bands along the outline wider than this are paint, not a backdrop rim
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/cutout')


def sprite_files():
    """(name, path relative to ROOT, kind) for every sprite the game can draw."""
    out = [(os.path.basename(p)[:-5], os.path.relpath(p, ROOT), 'sprite') for p in sorted(glob.glob(f'{ROOT}/art/sprites/*.webp'))]
    for s in ('bath_new', 'duarte_new'):
        meta = json.load(open(f'{ROOT}/art/review/alan/{s}/sprites.json'))
        out += [(k, m['src'], s) for k, m in sorted(meta.items())]
    C = json.load(open(f'{ROOT}/art/review/candidates.json'))['candidates']
    A = json.load(open(f'{ROOT}/art/review/approvals.json'))
    out += [(c['id'], c['src'], 'candidate') for c in C if A.get(c['id'], {}).get('decision') == 'approved' and c.get('src')]
    return out


def load(p):
    return np.asarray(Image.open(p).convert('RGBA'))


def bbox(m):
    ys, xs = np.where(m)
    return [int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)]


def clusters(m, min_px=1, gap=6):
    """Group a mask's pixels into clusters (pixels within `gap` px join), biggest first: (mask, count)."""
    if not m.any(): return []
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (gap * 2 + 1, gap * 2 + 1))
    n, lab = cv2.connectedComponents(cv2.dilate(m.astype(np.uint8), k), connectivity=8)
    res = []
    for i in range(1, n):
        c = m & (lab == i)
        if c.sum() >= min_px: res.append((c, int(c.sum())))
    return sorted(res, key=lambda r: -r[1])


def interior_fill(a, exclude=None):
    """The colour of the paint just inside the outline, spread outwards (for comparing and recolouring edges).
    exclude: pixels not to take colour from (a thick opaque rim of backdrop would otherwise count as paint)."""
    solid = cv2.erode((a[..., 3] >= 250).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    if exclude is not None: solid &= ~exclude
    if solid.sum() < 50: solid = a[..., 3] >= 200
    return cv2.inpaint(np.ascontiguousarray(a[..., :3]), (~solid).astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA).astype(np.float32), solid


# ---------------------------------------------------------------- detectors
def pale_mask(a):
    rgb = a[..., :3].astype(np.int16)  # the halo test's own notion of pale (mean > 120, spread < 50)
    return (rgb.mean(-1) > 120) & (rgb.max(-1) - rgb.min(-1) < 50) & (a[..., 3] > 0)


def pale_paint(a, reach=5, walk=6):
    """Pale paint (a white shirt, an apron, a fringe): pale pixels deep inside the figure, and the pale pixels
    joined to them within `walk` px. A rim of backdrop is thin and outside the outline, so it isn't reached."""
    pale = pale_mask(a)
    dist = cv2.distanceTransform((a[..., 3] >= 20).astype(np.uint8), cv2.DIST_L2, 3)
    prot = pale & (dist > reach + 1)
    k = np.ones((3, 3), np.uint8)
    for _ in range(walk):
        prot = (cv2.dilate(prot.astype(np.uint8), k) > 0) & pale
    return prot


def pale_rim_candidates(a, reach=5, prot=None):
    """Pale, greyish pixels near the outline that aren't pale paint: maybe backdrop, so never a source of colour."""
    if prot is None: prot = pale_paint(a, reach)
    return pale_mask(a) & ~prot & (cv2.distanceTransform((a[..., 3] >= 20).astype(np.uint8), cv2.DIST_L2, 3) <= reach)


def halo_mask(a, fill=None, reach=3):
    """Edge pixels lighter (on screen) and greyer than the paint just inside them: the old backdrop's rim."""
    al = a[..., 3]; vis = al > 0
    prot = pale_paint(a, reach)
    if fill is None: fill, _ = interior_fill(a, pale_rim_candidates(a, reach, prot))
    rgb = a[..., :3].astype(np.float32)
    # a rim hugs darker paint; pale strands (a fringe, hair, a rope) reach further out than that
    hug = cv2.distanceTransform((~((al >= 250) & ~pale_mask(a))).astype(np.uint8), cv2.DIST_L2, 3) <= 4.5
    near = cv2.distanceTransform((al >= 20).astype(np.uint8), cv2.DIST_L2, 3) <= reach
    # a rim is a thin band (up to ~5 px across); a wider pale shape along the outline is paint (a shirt's fold)
    cand = (pale_mask(a) & ~prot & near).astype(np.uint8)
    wide = cv2.dilate(cv2.distanceTransform(cand, cv2.DIST_L2, 3), np.ones((7, 7), np.uint8)) * 2 > WIDE
    edge = vis & ~prot & hug & near & ~(wide & cand.astype(bool))
    lum, flum = rgb.mean(-1), fill.mean(-1)
    sat = rgb.max(-1) - rgb.min(-1)
    strength = (lum - flum) * al / 255.0  # how much lighter it shows than the paint, on screen
    return edge & (lum > flum + 35) & (sat < 50) & (lum > 120) & (strength > 18), strength, edge


def key_mask(a):
    rgb = a[..., :3].astype(np.int16); r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    al = a[..., 3].astype(np.float32)
    gx = g - np.maximum(r, b); mx = np.minimum(r, b) - g
    green = (gx > 35) & (g > 70)
    mag = (mx > 60) & (r > 140) & (b > 140)
    excess = np.where(green, gx, np.where(mag, mx, 0)) * al / 255.0  # what reaches the screen
    return (green | mag) & (al > 0), excess


def find(a, faces=False):
    al = a[..., 3]; H, W = al.shape
    vis = al > 0
    F = []
    keyed, excess = key_mask(a)
    dist_t = cv2.distanceTransform((al >= 20).astype(np.uint8), cv2.DIST_L2, 3)
    # 1. key colour. 'key' = reaches the screen as a tint (premultiplied excess >= 6 levels) or sits in solid paint;
    #    'key_trace' = hue only in near-invisible edge pixels (alpha mostly < 32)
    vis_key = keyed & ((excess >= 6) | (al >= 128))
    for m, n in clusters(vis_key, 3):
        F.append(dict(type='key', px=n, bbox=bbox(m), max_excess=round(float(excess[m].max()), 1),
                      interior=int((m & (dist_t >= 4)).sum())))
    trace = keyed & ~vis_key
    if trace.sum() >= 1:
        F.append(dict(type='key_trace', px=int(trace.sum()), bbox=bbox(trace), max_excess=round(float(excess[trace].max()), 1)))
    if faces: return F
    # 4. haze: faint pixels well away from solid paint
    solid = al >= 64
    near = cv2.distanceTransform((~solid).astype(np.uint8), cv2.DIST_L2, 3) <= 3.0
    haze = vis & ~near
    if haze.any():
        for m, n in clusters(haze, 1, 12)[:12]:
            F.append(dict(type='haze', px=n, bbox=bbox(m), max_alpha=int(al[m].max())))
    # 3. islands detached from the figure (any visible pixel; joined at 8-connectivity over alpha >= 1)
    n, lab, st, _ = cv2.connectedComponentsWithStats((vis & near).astype(np.uint8), connectivity=8)
    if n > 1:
        big = st[1:, cv2.CC_STAT_AREA].max()
        for i in range(1, n):
            ar = st[i, cv2.CC_STAT_AREA]
            if ar == big: continue
            m = lab == i
            kind = 'speck' if ar < max(400, big * 0.004) else 'island'
            F.append(dict(type=kind, px=int(ar), bbox=[int(v) for v in st[i, :4]], max_alpha=int(al[m].max()),
                          colour=[int(v) for v in a[..., :3][m].mean(0)]))
    # 2. halo: edge pixels (within 3 px of transparency) much lighter and greyer than the paint inside them
    halo, strength, edge = halo_mask(a)
    rgb = a[..., :3].astype(np.float32); lum = rgb.mean(-1); sat = rgb.max(-1) - rgb.min(-1)
    perim = max(1, int(edge.sum()))
    for m, k in clusters(halo, 6, 4)[:20]:
        F.append(dict(type='halo', px=k, bbox=bbox(m), perimeter_frac=round(k / perim, 4),
                      mean_strength=round(float(strength[m].mean()), 1)))
    # 5. holes: flat, colourless pale patches inside the figure (studio white / grey caught in a gap)
    g = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2GRAY).astype(np.float32)
    mu = cv2.blur(g, (5, 5)); var = cv2.blur(g * g, (5, 5)) - mu * mu
    flat = (var < 4.0) & (sat < 14) & (lum > 200) & (al >= 200)
    flat = cv2.morphologyEx(flat.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0
    nh, lh, sh, _ = cv2.connectedComponentsWithStats(flat.astype(np.uint8), connectivity=8)
    for i in range(1, nh):
        if sh[i, cv2.CC_STAT_AREA] < 30: continue
        m = lh == i
        F.append(dict(type='hole', px=int(sh[i, cv2.CC_STAT_AREA]), bbox=[int(v) for v in sh[i, :4]],
                      colour=[int(v) for v in a[..., :3][m].mean(0)],
                      touches_edge=bool((cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)[al < 20].any())))
    # 6. border: paint on the canvas's outermost pixel; long straight cut edges
    ring = np.zeros_like(vis); ring[0, :] = ring[-1, :] = ring[:, 0] = ring[:, -1] = True
    if (vis & ring).any():
        F.append(dict(type='border', px=int((vis & ring).sum()), bbox=bbox(vis & ring), max_alpha=int(al[vis & ring].max())))
    sol = (al >= 128).astype(np.uint8)
    for axis, name in ((0, 'h'), (1, 'v')):
        # a transition between solid and clear at the same place over a long straight run
        d = np.abs(np.diff(sol.astype(np.int8), axis=axis)) > 0  # (H-1, W) for axis 0: horizontal edges
        k = np.ones((1, 61), np.uint8) if axis == 0 else np.ones((61, 1), np.uint8)
        run = cv2.erode(d.astype(np.uint8), k) > 0
        if run.any():
            m = cv2.dilate(run.astype(np.uint8), k) > 0
            for c, cnt in clusters(m, 61, 2):
                F.append(dict(type='straight_edge', px=cnt, bbox=bbox(c), dir=name))
    return F


# ---------------------------------------------------------------- crops of findings
def on(a, bgc):
    al = a[..., 3:4].astype(np.float32) / 255
    if bgc == 'checker':
        H, W = a.shape[:2]; yy, xx = np.mgrid[:H, :W]
        b = np.where(((yy // 8 + xx // 8) % 2 == 0)[..., None], np.array([255, 0, 255], np.float32), np.array([0, 200, 255], np.float32))
    else:
        b = np.zeros(a.shape[:2] + (3,), np.float32); b[:] = bgc
    return (a[..., :3] * al + b * (1 - al)).astype(np.uint8)


def zoom_crop(img, bb, pad=14, maxside=420):
    x, y, w, h = bb; H, W = img.shape[:2]
    x0, y0, x1, y1 = max(0, x - pad), max(0, y - pad), min(W, x + w + pad), min(H, y + h + pad)
    c = img[y0:y1, x0:x1]
    z = max(1, min(8, maxside // max(c.shape[0], c.shape[1])))
    return cv2.resize(c, (c.shape[1] * z, c.shape[0] * z), interpolation=cv2.INTER_NEAREST), (x0, y0, x1, y1, z)


def label(img, text):
    bar = np.full((18, img.shape[1], 3), 30, np.uint8)
    cv2.putText(bar, text[:max(1, img.shape[1] // 7)], (3, 13), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (235, 235, 235), 1, cv2.LINE_AA)
    return np.concatenate([bar, img], 0)


def hstack(ims, gap=6):
    H = max(i.shape[0] for i in ims)
    ims = [np.pad(i, ((0, H - i.shape[0]), (0, 0), (0, 0)), constant_values=255) for i in ims]
    sp = np.full((H, gap, 3), 255, np.uint8)
    out = [ims[0]]
    for i in ims[1:]: out += [sp, i]
    return np.concatenate(out, 1)


def crop_sheet(a, f, mark=None):
    """Checker / dark / highlighted (the finding in red, over mid grey), zoomed on the finding."""
    panels = []
    for bgc, t in (('checker', 'checker'), ((24, 24, 28), 'dark'), ((235, 235, 235), 'light')):
        z, _ = zoom_crop(on(a, bgc), f['bbox']); panels.append(label(z, t))
    if mark is not None:
        hl = on(a, (128, 128, 128)).copy(); hl[mark] = (255, 0, 0)
        z, _ = zoom_crop(hl, f['bbox']); panels.append(label(z, f['type'] + ' (red)'))
    return hstack(panels)


# ---------------------------------------------------------------- cleaning (alpha and edge colour only)
def in_boxes(shape, boxes, pad=0):
    m = np.zeros(shape, bool)
    for x, y, w, h in boxes: m[max(0, y - pad):y + h + pad, max(0, x - pad):x + w + pad] = True
    return m


def pocket(a, box, tol=12):
    """The flat backdrop caught in a gap: flood from the flattest pixel inside box over colours within tol."""
    x, y, w, h = box
    rgb = np.ascontiguousarray(a[..., :3]); g = rgb.astype(np.float32).mean(-1)
    var = cv2.blur(g * g, (3, 3)) - cv2.blur(g, (3, 3)) ** 2
    sub = var[y:y + h, x:x + w] + (a[y:y + h, x:x + w, 3] < 250) * 1e6
    sy, sx = np.unravel_index(np.argmin(sub), sub.shape)
    m = np.zeros((a.shape[0] + 2, a.shape[1] + 2), np.uint8)
    cv2.floodFill(rgb.copy(), m, (int(x + sx), int(y + sy)), (0, 0, 0), (tol,) * 3, (tol,) * 3,
                  8 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8))
    return m[1:-1, 1:-1] > 0


def backdrop_colour(a, fill):
    """The old studio backdrop, from the opaque part of the pale rim (white when there is too little of it)."""
    halo, _, _ = halo_mask(a, fill)
    rgb = a[..., :3].astype(np.float32); sat = rgb.max(-1) - rgb.min(-1)
    rim = halo & (a[..., 3] >= 150) & (sat < 30)
    return np.median(rgb[rim], 0) if rim.sum() >= 10 else np.array([245.0, 245.0, 245.0])


def unmix_rim(a, B, keep=None, rounds=4):
    """Edge pixels that are a mix of the paint inside them (F) and the backdrop (B): keep only the paint's share
    as alpha and take the paint's colour. Pixels much lighter than the paint and close to the backdrop become clear."""
    a = a.copy(); n = 0
    for _ in range(rounds):
        al = a[..., 3].astype(np.float32)
        fill, _ = interior_fill(a, pale_rim_candidates(a, 5))
        halo, strength, edge = halo_mask(a, fill, reach=5)
        rgb = a[..., :3].astype(np.float32)
        lum, flum, blum = rgb.mean(-1), fill.mean(-1), float(B.mean())
        sat = rgb.max(-1) - rgb.min(-1)
        band = edge & (al > 0) & (lum > flum + 12) & (sat < 60) & (blum - flum > 30)
        # where the rim is clearly backdrop (the halo test), or a faint pale tail of it next to the halo
        band &= cv2.dilate(halo.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        if keep is not None: band &= ~keep
        if not band.any(): break
        share = np.clip((blum - lum) / np.maximum(blum - flum, 1), 0, 1)       # the paint's part of the pixel
        na = np.where(band, al * share, al)
        a[..., 3] = np.clip(np.round(na), 0, 255).astype(np.uint8)
        a[..., :3] = np.where(band[..., None], np.clip(fill, 0, 255), rgb).astype(np.uint8)
        n += int(band.sum())
    return a, n


def strands(a):
    """Thin, long, pale painted strands (a shawl's fringe): pale components at least twice as tall as wide."""
    p = (a[..., :3].min(-1) > 150) & (a[..., 3] > 160)
    n, lab, st, _ = cv2.connectedComponentsWithStats(p.astype(np.uint8))
    m = np.zeros(p.shape, bool)
    for i in range(1, n):
        x, y, w, h, ar = st[i]
        if ar >= 15 and h > 2 * w: m[max(0, y - 6):y + h + 40, max(0, x - 10):x + w + 10] = True  # tips hang below
    return m


def straw(a):
    """A broom's bristles (straw-coloured paint in the lowest 40% of the frame), padded: their pale tips stay."""
    rgb = a[..., :3].astype(np.int16); r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    m = (r > 140) & (g > 90) & (r - b > 60) & (a[..., 3] > 128)
    m[:int(a.shape[0] * 0.6)] = False
    n, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    out = np.zeros(m.shape, bool)
    if n > 1:
        i = 1 + int(np.argmax(st[1:, 4])); x, y, w, h = st[i, :4]
        out[max(0, y - 12):y + h + 12, max(0, x - 12):x + w + 12] = True
    return out


def white_pockets(a, skip=()):
    """Flat pure white (min > 228, spread < 14) patches of 8-3000 px, at least 60% ringed by non-pale paint,
    grown over the white-ish anti-aliasing next to them (2 px)."""
    rgb = a[..., :3].astype(np.int16); g = rgb.mean(-1); sat = rgb.max(-1) - rgb.min(-1)
    w = (rgb.min(-1) > 228) & (sat < 14) & (a[..., 3] > 200)
    n, lab, st, _ = cv2.connectedComponentsWithStats(w.astype(np.uint8))
    out = np.zeros(w.shape, bool)
    skipm = in_boxes(w.shape, skip) if skip else None
    for i in range(1, n):
        if not 8 <= st[i, 4] <= 3000: continue
        m = lab == i
        if skipm is not None and (m & skipm).any(): continue
        ring = (cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0) & ~m
        if ((g[ring] < 170) | (sat[ring] > 40)).mean() >= 0.6: out |= m
    # near the pockets found (a net's mesh), the slightly greyer white ones too
    if out.any():
        zone = cv2.dilate(out.astype(np.uint8), np.ones((31, 31), np.uint8)) > 0
        w2 = (rgb.min(-1) > 205) & (sat < 20) & (a[..., 3] > 200) & zone & ~out
        n, lab, st, _ = cv2.connectedComponentsWithStats(w2.astype(np.uint8))
        for i in range(1, n):
            if not 4 <= st[i, 4] <= 3000: continue
            m = lab == i
            if skipm is not None and (m & skipm).any(): continue
            ring = (cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0) & ~m & ~out
            if ring.any() and ((g[ring] < 170) | (sat[ring] > 40)).mean() >= 0.6: out |= m
    whiteish = (rgb.min(-1) > 190) & (sat < 30)
    for _ in range(2): out |= (cv2.dilate(out.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0) & whiteish
    return out


def clean(a, keep=(), holes=(), hole_tol=12, wet=False, halo=True, keep_strands=False, broom=False, white=True, white_skip=(), corners=False):
    """keep: boxes left alone by the speck/haze/rim passes (drops, smoke); holes: boxes of trapped backdrop."""
    a = a.copy(); H, W = a.shape[:2]; log = {}
    keepm = in_boxes((H, W), keep) if keep else np.zeros((H, W), bool)
    if keep_strands: keepm |= strands(a)
    if broom: keepm |= straw(a)
    orig_alpha = a[..., 3].copy()
    # 5. trapped backdrop: clear, with the pocket's own rim then unmixed like any edge
    if holes:
        pm = np.zeros((H, W), bool)
        for b in holes: pm |= pocket(a, b[:4], b[4] if len(b) > 4 else hole_tol)
        a[..., 3][pm] = 0; log['hole'] = int(pm.sum())
    # 5b. pure white pockets: flat white (the studio paper) closed in by paint (between fingers, inside curls,
    #     through a net, between chair rails); checked by eye, with the exceptions in fixes.json
    if white:
        wm = white_pockets(a, white_skip)
        if wm.any(): a[..., 3][wm] = 0; log['white_pocket'] = int(wm.sum())
    # 1. key colour: the paint's colour under the alpha the pixel has
    km, _ = key_mask(a)
    if km.any():
        fill, _ = interior_fill(a)
        a[..., :3][km] = np.clip(fill[km], 0, 255).astype(np.uint8); log['key'] = int(km.sum())
    # 2. pale rim
    if halo:
        fill, _ = interior_fill(a, pale_rim_candidates(a))
        B = backdrop_colour(a, fill)
        a, n = unmix_rim(a, B, keepm)
        if n: log['halo'] = n; log['backdrop'] = [int(v) for v in B]
    al = a[..., 3]
    # 4. haze: faint paint more than 3 px from solid paint (wet frames: only up to 6 px out, the matte's noise
    #    ring; water running off, spray and smoke further out are painted on purpose)
    dsol = cv2.distanceTransform((~(al >= 64)).astype(np.uint8), cv2.DIST_L2, 3)
    near = dsol <= 3.0
    hz = (al > 0) & ~near & ~keepm
    if wet: hz &= dsol <= 6.0
    if hz.any(): al[hz] = 0; log['haze'] = int(hz.sum())
    # 3. specks: detached bits that are faint or tiny (opaque specks of 5+ px are listed for an eye check instead)
    n, lab, st, _ = cv2.connectedComponentsWithStats((al > 0).astype(np.uint8), connectivity=8)
    if n > 2:
        big = st[1:, cv2.CC_STAT_AREA].max(); killed = 0
        for i in range(1, n):
            ar = st[i, cv2.CC_STAT_AREA]
            if ar == big or ar >= max(400, big * 0.004): continue
            m = lab == i
            if (m & keepm).any(): continue
            mx = int(al[m].max())
            if wet:  # drops (pale) stay; matte dust right by the figure and dark matte bits go
                kill = (mx < 24 and dsol[m].min() <= 6.0) or a[..., :3][m].astype(np.float32).mean() < 90
            else: kill = mx < 128 or ar <= 12
            if kill:
                al[m] = 0; killed += int(ar)
        if killed: log['speck'] = killed
    a[..., 3] = al
    # white corners left in cut pockets (a chair's gaps): small pure-white bits at the outline, mostly ringed by paint
    if corners:
        rgb = a[..., :3].astype(np.int16); sat = rgb.max(-1) - rgb.min(-1); g = rgb.mean(-1)
        w = (rgb.min(-1) > 190) & (sat < 20) & (al > 0) & ~keepm
        n, lab, st, _ = cv2.connectedComponentsWithStats(w.astype(np.uint8))
        clear = (al < 20)
        kill = np.zeros(w.shape, bool)
        for i in range(1, n):
            if st[i, 4] > 200: continue
            m = lab == i
            ring = (cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0) & ~m
            if (ring & clear).any() and (ring & ~clear).any() and ((g[ring & ~clear] < 170) | (sat[ring & ~clear] > 40)).mean() >= 0.5: kill |= m
        if kill.any():
            al[kill] = 0; log['corner'] = int(kill.sum())
            a, n2 = unmix_rim(a, np.array([245.0, 245.0, 245.0]), keepm, rounds=2); al = a[..., 3]
    a[..., 3] = al
    a[..., :3][al == 0] = 0
    return a, log


# ---------------------------------------------------------------- fix: cleaned candidates and before/after sheets
def densest(m, win=90):
    """The win x win window holding most of mask m (x, y, w, h)."""
    H, W = m.shape; win = min(win, H, W)
    ii = cv2.integral(m.astype(np.uint8))
    s = ii[win:, win:] - ii[:-win, win:] - ii[win:, :-win] + ii[:-win, :-win]
    y, x = np.unravel_index(np.argmax(s), s.shape)
    return [int(x), int(y), win, win]


def before_after(a, b, name, boxes):
    rows = []
    vis_a = on(a, (20, 20, 24)); full = []
    for bgc, t in (('checker', 'checker'), ((128, 128, 128), 'mid grey'), ((20, 20, 24), 'dark')):
        pa, _ = zoom_crop(on(a, bgc), boxes[0], pad=4, maxside=330); pb, _ = zoom_crop(on(b, bgc), boxes[0], pad=4, maxside=330)
        full += [label(pa, 'before ' + t), label(pb, 'after ' + t)]
    rows.append(hstack(full))
    for bb in boxes[1:3]:
        r = []
        for bgc, t in (('checker', 'checker'), ((20, 20, 24), 'dark')):
            pa, _ = zoom_crop(on(a, bgc), bb, pad=4, maxside=330); pb, _ = zoom_crop(on(b, bgc), bb, pad=4, maxside=330)
            r += [label(pa, 'before ' + t), label(pb, 'after ' + t)]
        rows.append(hstack(r))
    # the whole sprite, small, after, on dark, with the zoomed boxes outlined
    wh = on(b, (20, 20, 24)).copy()
    for i, (x, y, w, h) in enumerate(boxes[:3]): cv2.rectangle(wh, (x - 2, y - 2), (x + w + 1, y + h + 1), (255, 60, 60), 2)
    k = min(1.0, 300 / wh.shape[0]); wh = cv2.resize(wh, (max(1, int(wh.shape[1] * k)), max(1, int(wh.shape[0] * k))), interpolation=cv2.INTER_AREA)
    rows.append(label(wh, name + ': after, whole (boxes = zooms)'))
    W = max(r.shape[1] for r in rows)
    rows = [np.pad(r, ((0, 6), (0, W - r.shape[1]), (0, 0)), constant_values=255) for r in rows]
    Image.fromarray(np.concatenate(rows, 0)).save(f'{OUT}/before_after/{name}.png')


def changed(a, b):
    """Visible change: alpha moved, or colour moved on a pixel that shows."""
    da = np.abs(a[..., 3].astype(int) - b[..., 3].astype(int))
    dc = np.abs(a[..., :3].astype(int) - b[..., :3].astype(int)).max(-1) * (np.maximum(a[..., 3], b[..., 3]) > 0)
    return (da > 0) | (dc > 0)


def fix(names, cfg, sheets=True):
    os.makedirs(OUT + '/sprites', exist_ok=True); os.makedirs(OUT + '/before_after', exist_ok=True)
    src = {n: r for n, r, k in sprite_files()}
    res = {}
    for n in names:
        c = cfg.get(n, {})
        if c.get('skip'): continue
        a = load(os.path.join(ROOT, src[n]))
        b, log = clean(a, keep=c.get('keep', []), holes=c.get('holes', []), wet=c.get('wet', False), halo=c.get('halo', True),
                       keep_strands=c.get('strands', False), broom=c.get('broom', False),
                       white=c.get('white', True), white_skip=c.get('white_skip', []), corners=c.get('corners', False))
        ch = changed(a, b)
        if not ch.any(): continue
        Image.fromarray(b, 'RGBA').save(f'{OUT}/sprites/{n}.webp', lossless=True, quality=100, method=6, exact=False)
        # where it changed: the whole silhouette's edge vs deep inside (alpha >= 250 and 4+ px from any edge)
        deep = cv2.erode((a[..., 3] >= 250).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
        hole = np.zeros_like(ch)
        for hb in c.get('holes', []): hole |= in_boxes(ch.shape, [hb[:4]], 20)
        res[n] = dict(src=src[n], log=log, changed_px=int(ch.sum()), changed_opaque=int((ch & (a[..., 3] >= 250)).sum()),
                      changed_deep=int((ch & deep & ~hole).sum()), alpha_sum_before=int(a[..., 3].astype(np.int64).sum() // 255),
                      alpha_sum_after=int(b[..., 3].astype(np.int64).sum() // 255))
        if sheets:
            boxes = [h[:4] for h in c.get('holes', [])][:1]
            m = ch.copy()
            for _ in range(3 - len(boxes)):
                if not m.any(): break
                bb = densest(m); boxes.append(bb); x, y, w, h = bb; m[y:y + h, x:x + w] = False
            before_after(a, b, n, boxes)
    return res


# ---------------------------------------------------------------- audit
def visible(f):
    """Findings that show on screen (the rest are traces: alpha under ~16-64, key hue under 6 levels)."""
    t = f['type']
    if t in ('key', 'hole'): return True
    if t == 'halo': return f['px'] >= 12
    if t == 'speck': return f['max_alpha'] >= 64 and f['px'] >= 2
    if t == 'haze': return f['max_alpha'] >= 16
    if t == 'border': return f['max_alpha'] >= 64
    return False


def audit(files, crops=False, faces=True, tag=''):
    os.makedirs(OUT + '/crops', exist_ok=True)
    rep = {}
    for name, rel, kind in files:
        a = load(os.path.join(ROOT, rel))
        F = find(a)
        rep[name] = dict(src=rel, kind=kind, size=[a.shape[1], a.shape[0]], findings=F)
        if crops:  # the visible findings only, biggest first, at most 8 per sprite
            vis = [(i, f) for i, f in enumerate(F) if visible(f)]
            vis.sort(key=lambda t: -t[1]['px'])
            for i, f in vis[:8]:
                Image.fromarray(crop_sheet(a, f)).save(f"{OUT}/crops/{name}__{i:03d}_{f['type']}.png")
    face = {}
    if faces:
        for p in sorted(glob.glob(f'{ROOT}/art/faces/*.webp')):
            a = load(p); F = find(a, faces=True)
            F = [f for f in F if f['type'] == 'key']
            if F: face[os.path.basename(p)[:-5]] = F
    return rep, face


def summary(rep):
    from collections import Counter
    c = Counter(); s = Counter()
    for n, r in rep.items():
        ts = set(f['type'] for f in r['findings'])
        for t in ts: s[t] += 1
        for f in r['findings']: c[f['type']] += 1
    return dict(sprites=len(rep), sprites_with=dict(s), findings=dict(c))


def main():
    args = sys.argv[1:]
    if not args or args[0] == 'audit':
        crops = '--crops' in args
        if '--dir' in args:
            d = args[args.index('--dir') + 1]
            files = [(os.path.basename(p)[:-5], os.path.relpath(p, ROOT), 'cleaned') for p in sorted(glob.glob(os.path.join(ROOT, d, '*.webp')))]
            rep, face = audit(files, crops=False, faces=False)
            out = os.path.join(OUT, 'report_cleaned.json')
        else:
            rep, face = audit(sprite_files(), crops=crops)
            out = os.path.join(OUT, 'report_raw.json')
        json.dump(dict(summary=summary(rep), faces_with_key=face, sprites=rep), open(out, 'w'), indent=1)
        print(json.dumps(summary(rep), indent=1), 'faces with key colour:', len(face))
    elif args[0] == 'report':  # report_raw.json + report_cleaned.json + logs/ + notes.json -> report.json
        raw = json.load(open(f'{OUT}/report_raw.json')); cl = json.load(open(f'{OUT}/report_cleaned.json'))['sprites']
        notes = json.load(open(f'{OUT}/notes.json')) if os.path.exists(f'{OUT}/notes.json') else {}
        out, tally = {}, {}
        def short(F):
            keep = [f for f in F if visible(f)]
            tr = {}
            for f in F:
                if not visible(f) and f['type'] not in ('island', 'straight_edge'):
                    t = tr.setdefault(f['type'], dict(findings=0, px=0)); t['findings'] += 1; t['px'] += f['px']
            return dict(visible=keep, traces=tr, kept_as_painted=[f for f in F if f['type'] in ('island', 'straight_edge')])
        for n, r in raw['sprites'].items():
            lp = f'{OUT}/logs/{n}.json'; fx = json.load(open(lp)) if os.path.exists(lp) else None
            after = cl.get(n)
            types = sorted(set(f['type'] for f in r['findings'] if visible(f)))
            for t in types: tally[t] = tally.get(t, 0) + 1
            out[n] = dict(src=r['src'], kind=r['kind'], size=r['size'], before=short(r['findings']), fix=fx,
                          cleaned=(f'art/review/cutout/sprites/{n}.webp' if fx else None),
                          after=short(after['findings']) if after else None, note=notes.get(n))
        S = dict(sprites_checked=len(out), sprites_with_visible_findings=sum(1 for v in out.values() if v['before']['visible']),
                 sprites_by_visible_type=tally, cleaned_files=sum(1 for v in out.values() if v['fix']),
                 faces_with_key_colour=raw.get('faces_with_key', {}))
        json.dump(dict(summary=S, sprites=out), open(f'{OUT}/report.json', 'w'), indent=1)
        print(json.dumps(S, indent=1))
    elif args[0] == 'fix':
        cfgp = os.path.join(OUT, 'fixes.json')
        cfg = json.load(open(cfgp)) if os.path.exists(cfgp) else {}
        names = [x for x in args[1:] if not x.startswith('--') and '/' not in x] or [n for n, r, k in sprite_files()]
        if '--part' in args:  # --part i/n: every n-th sprite, for running several processes side by side
            i, k = map(int, args[args.index('--part') + 1].split('/')); names = names[i::k]
        os.makedirs(OUT + '/logs', exist_ok=True)
        done = 0
        for n in names:
            lp = f'{OUT}/logs/{n}.json'
            if '--resume' in args and os.path.exists(lp): continue
            res = fix([n], cfg, sheets='--nosheets' not in args)
            json.dump(res.get(n), open(lp, 'w'))  # null: nothing to clean
            done += 1
        print(done, 'processed')


if __name__ == '__main__':
    main()
