// Floor geometry and hit tests: point in polygon, a click clamped onto the floor, a route round
// cut-outs with rounded corners; hotspot areas and sprite-pixel hits.
(function () {
  const E = window.Engine;
  const { GROUND_K } = E;

  // ---------------------------------------------------------------- geometry
  const CORNER_R = 0.32;        // radius of a rounded corner on a routed path (arcs instead of pivots)
  function inPoly(x, y, p) {
    let ins = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i], [xj, yj] = p[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
    }
    return ins;
  }
  function clampToPoly(x, y, p) {
    if (inPoly(x, y, p)) return [x, y];
    let best = null, bd = Infinity;
    for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length];
      const vx = bx - ax, vy = by - ay, l = vx * vx + vy * vy;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / l));
      const cx = ax + vx * t, cy = ay + vy * t, d = Math.hypot(x - cx, y - cy);
      if (d < bd) { bd = d; best = [cx, cy]; }
    }
    const mx = p.reduce((a, q) => a + q[0], 0) / p.length, my = p.reduce((a, q) => a + q[1], 0) / p.length;
    const dx = mx - best[0], dy = my - best[1], dl = Math.hypot(dx, dy) || 1;
    return [best[0] + dx / dl * 3, best[1] + dy / dl * 3];
  }
  // A walk across a cut-out (a notch round a basin, a stool, a pit) follows the
  // shortest way round its corners; a straight line that stays on the floor is kept.
  function segInside(a, b, p) {
    const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
    for (let i = 1; i < n; i++) { const t = i / n; if (!inPoly(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, p)) return false; }
    return true;
  }
  function edgeDist(x, y, p) {
    let d = Infinity;
    for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length], vx = bx - ax, vy = by - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1)));
      d = Math.min(d, Math.hypot(x - ax - vx * t, y - ay - vy * t));
    }
    return d;
  }
  function route(a, b, p) {
    if (!inPoly(a[0], a[1], p) || !inPoly(b[0], b[1], p) || segInside(a, b, p)) return [b];
    const nodes = [a, b];
    for (const [vx, vy] of p) { // each corner, nudged just inside the floor
      let best = null, bd = -1;
      for (let k = 0; k < 16; k++) {
        const an = k * Math.PI / 8, q = [vx + Math.cos(an) * 4, vy + Math.sin(an) * 4];
        if (!inPoly(q[0], q[1], p)) continue;
        const d = edgeDist(q[0], q[1], p); if (d > bd) { bd = d; best = q; }
      }
      if (best) nodes.push(best);
    }
    const cost = (u, v) => Math.hypot(u[0] - v[0], (u[1] - v[1]) * GROUND_K);
    const dist = nodes.map(() => Infinity), prev = nodes.map(() => -1), done = nodes.map(() => false);
    dist[0] = 0;
    for (;;) {
      let u = -1;
      for (let i = 0; i < nodes.length; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0 || u === 1) break;
      done[u] = true;
      for (let v = 0; v < nodes.length; v++) {
        if (done[v]) continue;
        const d = dist[u] + cost(nodes[u], nodes[v]);
        if (d < dist[v] && segInside(nodes[u], nodes[v], p)) { dist[v] = d; prev[v] = u; }
      }
    }
    if (prev[1] < 0) return [b];
    const out = [];
    for (let i = 1; i > 0; i = prev[i]) out.unshift(nodes[i]);
    return out;
  }
  // A routed path's corners become arcs: each corner is replaced by a cubic curve that leaves the
  // incoming leg and joins the outgoing one tangentially, swinging wide through the routed corner
  // point itself (so it keeps clear of the furniture the corner goes round). Kept only where the
  // whole curve stays on the floor; otherwise the corner stays sharp.
  function roundCorners(a, pts, p, hh) {
    if (!(CORNER_R > 0) || pts.length < 2 || window.FAST) return pts;
    const all = [a].concat(pts), out = [];
    let last = a;
    for (let i = 1; i < all.length - 1; i++) {
      const A = all[i - 1], P = all[i], B = all[i + 1];
      const la = Math.hypot(P[0] - A[0], P[1] - A[1]), lb = Math.hypot(B[0] - P[0], B[1] - P[1]);
      let done = false;
      for (const f of [1, 0.5]) {
        const r = Math.min(CORNER_R * hh * f, la * 0.45, lb * 0.45);
        if (!(r > 6) || !la || !lb) break;
        const u = [(P[0] - A[0]) / la, (P[1] - A[1]) / la], w = [(B[0] - P[0]) / lb, (B[1] - P[1]) / lb];
        const P0 = [P[0] - u[0] * r, P[1] - u[1] * r], P2 = [P[0] + w[0] * r, P[1] + w[1] * r];
        const C1 = [P[0] + u[0] * r / 3, P[1] + u[1] * r / 3], C2 = [P[0] - w[0] * r / 3, P[1] - w[1] * r / 3];
        const N = 8, arc = [];
        for (let k = 0; k <= N; k++) {
          const t = k / N, m = 1 - t;
          arc.push([m * m * m * P0[0] + 3 * m * m * t * C1[0] + 3 * m * t * t * C2[0] + t * t * t * P2[0], m * m * m * P0[1] + 3 * m * m * t * C1[1] + 3 * m * t * t * C2[1] + t * t * t * P2[1]]);
        }
        let ok = arc.every(q => inPoly(q[0], q[1], p)) && segInside(last, arc[0], p);
        for (let k = 1; ok && k < arc.length; k++) ok = segInside(arc[k - 1], arc[k], p);
        if (ok) { out.push(...arc); last = arc[arc.length - 1]; done = true; break; }
      }
      if (!done) { out.push(P); last = P; }
    }
    out.push(all[all.length - 1]);
    return out;
  }
  function hitShape(h, x, y) {
    if (h.poly) return inPoly(x, y, h.poly);
    const [rx, ry, rw, rh] = h.rect;
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  }
  const alphaCache = new Map();
  function alphaAt(im, u, v) {
    let c = alphaCache.get(im);
    if (!c) {
      const w = Math.min(im.naturalWidth || im.width, 400), h = Math.round(w * (im.naturalHeight || im.height) / (im.naturalWidth || im.width));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, w, h);
      c = { w, h, d: cx.getImageData(0, 0, w, h).data }; alphaCache.set(im, c);
    }
    const px = Math.min(c.w - 1, Math.floor(u * c.w)), py = Math.min(c.h - 1, Math.floor(v * c.h));
    return c.d[(py * c.w + px) * 4 + 3];
  }
  function hotArea(h) {
    if (h.rect) return h.rect[2] * h.rect[3];
    let a = 0; const p = h.poly; for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]);
    return Math.abs(a / 2);
  }

  Object.assign(E, { clampToPoly, route, roundCorners, hitShape, alphaAt, hotArea });
})();
