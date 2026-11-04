// The Shortest Night — the Sea's water (HANDOFF entry 108). A horizontal plane at a height above each room's floor,
// seen in the room's own perspective: everything below it is under water, the floor, the walls up to the waterline and
// each figure up to its own waterline. Not a tint over the camera: the water is darker and denser the deeper it is,
// bends what is under it, lights it with faint caustics, carries ripples and glints on its surface and a pale broken
// line where it meets the walls and the people.
//
// How a room knows its floor: where its walls meet the floor is marked by hand on the painting (S.WATER_ROOMS[room].seam,
// a polyline across the width). A floor pixel stands on its own row; a wall pixel on the seam's row below it (walls are
// vertical, so the column is the same). Its height above the floor in figure heights is then h = (yf - y) / s(yf), s the
// px a standing figure measures at that row, here taken through the painting's own horizon (hz) so a waterline on a side
// wall runs parallel to the wall's courses and friezes, converging on the vanishing point. Under water where h < H.
// (A room with no seam falls back on its depth map, art/bg/<room>_depth.png: inverse depth is affine in the floor row,
// so a line fitted depth -> row over the walk polygon gives each pixel its floor row; it is less sure on the walls.)
// A figure is its own little wall: h = (yfeet - y) / s(yfeet), so its waterline is yfeet - H * s(yfeet).
//
// The level keeps its old scale (S.water[key] 0..1, S.waterTo); S.waterH(level) is the height in figure heights, a
// table matched to the lines (0.12 the shins, 0.17 the knees, 0.3 the waist, 0.4 the chest, 0.42 the chin, 0.46 the nose).
//
// Drawing (js/engine/render.js calls E.waterPass): WebGL, one full-screen pass after the figures and before the room's
// animFg (the vault's bars, the torch's dark are drawn over it). The frame so far is the texture; a mask canvas says
// which figure covers each pixel (their own sprite silhouettes, in depth order). Without WebGL: a 2D version, the
// painting's water under the figures (from the same floor rows, at 320 px) and each figure's submerged part over it.
// ?water=2d forces the 2D version, ?water=off turns the water off (tests).
(function () {
  const E = window.Engine, S = window.S, F = S.F;
  const W = 1280, H = 720;
  const qs = new URLSearchParams(location.search);
  const MODE = qs.get('water') || '';      // '' | '2d' | 'off'
  // the GL pass's size, of 1280 x 720 (?waterq=0.5 for tests; half on a device render.js found too slow, WARP false)
  const OQ = Math.max(0.25, Math.min(1, +(qs.get('waterq') || 0.75)));
  // the level (S.water[key], 0..1, as the story sets it) to a height above the floor in figure heights, matched to
  // what the lines say: 0.12 the shins, 0.17 the knees, 0.3 the waist, 0.4 the chest, 0.42 the chin, 0.46 the nose
  const LEVELS = [[0, 0], [0.12, 0.2], [0.17, 0.28], [0.3, 0.6], [0.4, 0.76], [0.42, 0.85], [0.46, 0.92], [1, 2]];
  S.waterH = function (l) {
    for (let i = 1; i < LEVELS.length; i++) if (l <= LEVELS[i][0]) { const [a, A] = LEVELS[i - 1], [b, B] = LEVELS[i]; return A + (B - A) * (l - a) / (b - a); }
    return 2;
  };

  // ---------------------------------------------------------------- the rooms with water
  // key: S.water[key]; far / near: the water body ends there (a floor row: the grille in the cell, the bars in the
  // vault); clip: the only rect it can be in; sAt: [row, px]: a figure's height at that row there (the room's scale
  // doesn't hold behind the vault's bars: Vasco stands at 512 with h 270); flat: [row, px per figure height], a room with
  // no walk floor (the Land Rover's footwell, inside poly). Colours 0..1: deep (what the water turns to with depth),
  // refl (the dim sheen on its surface), foam; sigma: how fast it closes (per figure height of water looked through);
  // light: [x, y, strength, spread] where the room's light glints on it; wave: how much the line moves (the car sloshes);
  // feather: px of soft edge round poly; mirror: how much of the room it reflects (1); lc: the light's colour.
  // seam: where the walls meet the floor, marked by hand on the painting (a polyline across the whole width): a wall
  // pixel stands on the floor row of the seam below it, a floor pixel on its own row; hz: the painting's horizon (where
  // its wall lines meet), so a waterline on a side wall runs parallel to the wall's own courses and friezes. A room with
  // no seam falls back on its depth map (a line fitted depth -> floor row over the walk polygon).
  const ROOMS = S.WATER_ROOMS = {
    cave6_low: { key: 'cave6_low', seam: [[0, 585], [240, 524], [960, 524], [1280, 588]], hz: 400, anchor: 640, sigma: 1.05, mirror: 0.55, lc: [0.92, 0.86, 0.70], deep: [0.026, 0.040, 0.042], refl: [0.30, 0.27, 0.20], foam: [0.78, 0.78, 0.70],
      light: [642, 140, 1, 260], caustic: 0.5 },   // (clearer than elsewhere: the sockets and the discs stay readable under it)
    vault_cell: { key: 'vault', seam: [[0, 815], [185, 594], [1060, 594], [1280, 791]], hz: 200, anchor: 670, sigma: 2.4, lc: [1.0, 0.72, 0.42], deep: [0.012, 0.026, 0.030], refl: [0.16, 0.15, 0.13], foam: [0.66, 0.66, 0.60],
      light: [1050, 260, 0.7, 260], caustic: 0.25 },
    vault: { key: 'vault', when: () => !F().vasco_free, clip: [366, 64, 476, 448], seam: [[0, 512], [1280, 512]], near: 512, sAt: [512, 270], sigma: 1.9, lc: [1.0, 0.7, 0.38], mirror: 0.6,
      deep: [0.012, 0.024, 0.028], refl: [0.20, 0.15, 0.10], foam: [0.66, 0.64, 0.58], light: [733, 244, 0.9, 140], caustic: 0.2 },
    landrover: { key: 'landrover', flat: [718, 325], poly: [[590, 556], [1280, 548], [1280, 720], [560, 720]], feather: 26, wave: 3, sigma: 3.4,
      deep: [0.006, 0.012, 0.016], refl: [0.09, 0.11, 0.14], foam: [0.55, 0.60, 0.62], light: [700, 500, 0.5, 300], caustic: 0.1, lc: [0.6, 1.0, 0.6] },
  };
  const cfgOf = room => {
    const c = room && ROOMS[room.id];
    return c && (!c.when || c.when()) ? c : null;
  };
  const levelOf = c => Math.max(0, S.water[c.key] || 0);

  // ---------------------------------------------------------------- the room's floor rows (cached per room)
  // { yf: Float32Array(W*H) the floor row of each scene pixel, body: Uint8Array (1: water can be there), sa, sb, sMul }
  const maps = {}, loading = {};
  function lin(room, c) {
    if (c.flat) return { sa: c.flat[1], sb: 0 };
    const sc = room.scale || [540, 300, 716, 360], sb = (sc[3] - sc[1]) / (sc[2] - sc[0]);
    if (c.hz == null) return { sa: sc[1] - sb * sc[0], sb };
    // through the painting's horizon, matching the room's figures at the anchor row
    const a = c.anchor || 640, t = Math.max(0, Math.min(1, (a - sc[0]) / (sc[2] - sc[0]))), sA = sc[1] + (sc[3] - sc[1]) * t, k = sA / (a - c.hz);
    return { sa: -k * c.hz, sb: k };
  }
  const inPoly = (P, x, y) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) r = !r; } return r; };
  function build(room, c, depthIm) {
    const L = lin(room, c), yf = new Float32Array(W * H), body = new Uint8Array(W * H);
    let d = null;
    if (depthIm) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d'); x.drawImage(depthIm, 0, 0, W, H); d = x.getImageData(0, 0, W, H).data; }
    let A = 0, B = 0;
    const seamAt = c.seam && (x => { const P = c.seam; for (let i = 1; i < P.length; i++) if (x <= P[i][0] || i === P.length - 1) { const [x0, y0] = P[i - 1], [x1, y1] = P[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } });
    if (d && !c.flat && !c.seam) {
      // least squares row = A * depth + B over the walk polygon (every 3rd px), then again without the worst outliers
      const P = room.walk || S.FLOOR, pts = [];
      for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (inPoly(P, x, y)) pts.push([d[(y * W + x) * 4] / 255, y]);
      const fit = ps => { let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0; for (const [u, v] of ps) { n++; sx += u; sy += v; sxx += u * u; sxy += u * v; } const a = (n * sxy - sx * sy) / Math.max(1e-9, n * sxx - sx * sx); return [a, (sy - a * sx) / n]; };
      [A, B] = fit(pts);
      const res = pts.map(([u, v]) => Math.abs(v - (A * u + B))), lim = 2.5 * Math.sqrt(res.reduce((s, r) => s + r * r, 0) / Math.max(1, res.length));
      [A, B] = fit(pts.filter((p, i) => res[i] <= lim));
      c.fit = [A, B];
    }
    const sMul = c.sAt ? c.sAt[1] / (L.sa + L.sb * c.sAt[0]) : 1;
    for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) {
      let v = c.flat ? c.flat[0] : seamAt ? Math.max(y, seamAt(x)) : d ? A * d[i * 4] / 255 + B : y;
      if (c.far != null) v = Math.max(v, c.far);
      if (c.near != null) v = Math.min(v, c.near);
      yf[i] = v;
      let b = 1;
      if (c.clip) { const [cx, cy, cw, ch] = c.clip; b = x >= cx && x < cx + cw && y >= cy && y <= cy + ch + 2 ? 1 : 0; }
      if (b && c.poly) b = inPoly(c.poly, x, y) ? 1 : 0;
      body[i] = b * 255;
    }
    if (c.feather) feather(body, c.feather);
    return { yf, body, sa: L.sa, sb: L.sb, sMul };
  }
  // a soft edge round the body (a box blur, across then down)
  function feather(b, r) {
    const tmp = new Float32Array(W * H);
    for (let y = 0; y < H; y++) { let acc = 0; for (let x = -r; x < W + r; x++) { if (x + r < W) acc += b[y * W + Math.max(0, x + r)]; if (x - r - 1 >= 0) acc -= b[y * W + x - r - 1]; if (x >= 0 && x < W) tmp[y * W + x] = acc / (2 * r + 1); } }
    for (let x = 0; x < W; x++) { let acc = 0; for (let y = -r; y < H + r; y++) { if (y + r < H) acc += tmp[Math.min(H - 1, y + r) * W + x]; if (y - r - 1 >= 0) acc -= tmp[(y - r - 1) * W + x]; if (y >= 0 && y < H) b[y * W + x] = Math.round(acc / (2 * r + 1)); } }
  }
  function mapFor(room, c) {
    if (maps[room.id]) return maps[room.id];
    if (c.flat || c.seam) return (maps[room.id] = build(room, c, null));
    if (!loading[room.id]) {
      loading[room.id] = true;
      const im = new Image();
      im.onload = () => { try { maps[room.id] = build(room, c, im); } catch (e) { console.warn('water map', room.id, e); } };
      im.onerror = () => { console.warn('water: no depth map for', room.id); maps[room.id] = build(room, Object.assign({}, c, { far: null, near: null }), null); };
      im.src = 'art/bg/' + room.bg + '_depth.png';
    }
    return null;
  }
  // a figure's height in px where it stands (the room's, or its own placed height: Vasco behind the bars)
  const figS = a => a.h || E.scaleAt(a.y);
  const bodyAt = (M, x, y) => { const X = Math.max(0, Math.min(W - 1, x | 0)), Y = Math.max(0, Math.min(H - 1, y | 0)); return M.body[Y * W + X]; };

  // ---------------------------------------------------------------- the figures' silhouettes
  // each figure's own sprite frame(s), as drawn (Actor.place: the frame and where it sits from the feet), filled with
  // a code for which figure it is; drawn in depth order, so whoever stands in front covers whoever is behind
  const tmp = document.createElement('canvas'), tg = tmp.getContext('2d');
  function silhouette(ctx, a, q, fill) {
    const keys = [[a.cur, a.curFlip]];
    if (a.prev && a.fadeT > 0) keys.push([a.prev, a.prevFlip]);
    let drew = false;
    for (const [k, fl] of keys) {
      const P = k && a.place(k, !!fl); if (!P || !P.im) continue;
      const x0 = (a.x + P.x) * q, y0 = (a.y + P.y + (a.sink || 0) * a.height()) * q, w = Math.ceil(P.w * q) + 2, h = Math.ceil(P.h * q) + 2;
      if (w < 2 || h < 2) continue;
      if (tmp.width < w || tmp.height < h) { tmp.width = Math.max(tmp.width, w); tmp.height = Math.max(tmp.height, h); }
      tg.setTransform(1, 0, 0, 1, 0, 0); tg.globalCompositeOperation = 'source-over'; tg.clearRect(0, 0, w, h);
      tg.save(); if (P.flipped) { tg.translate(P.w * q, 0); tg.scale(-1, 1); } tg.drawImage(P.im, 0, 0, P.w * q, P.h * q); tg.restore();
      tg.globalCompositeOperation = 'source-in'; tg.fillStyle = fill; tg.fillRect(0, 0, w, h);
      ctx.save(); ctx.globalAlpha = a.alpha == null ? 1 : Math.max(0, Math.min(1, a.alpha));
      if (a.sink) { ctx.beginPath(); ctx.rect(0, 0, W * q, a.y * q); ctx.clip(); }
      ctx.drawImage(tmp, 0, 0, w, h, x0, y0, w, h); ctx.restore();
      drew = true;
    }
    if (!drew) {   // (a frame not loaded, a rigged figure: a body-shaped blob)
      const h = a.height() * q, w = h * 0.3;
      ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(a.x * q, a.y * q - h / 2, w / 2, h / 2, 0, 0, 7); ctx.fill(); ctx.restore();
    }
  }

  // ---------------------------------------------------------------- WebGL
  const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;
uniform sampler2D uScene, uMap, uFig;
uniform float uH, uT, uSigma, uCaus, uE, uWave, uMirror;
uniform vec3 uS;                 // sa, sb, sMul: the perspective (px a figure measures at row y = sa + sb y)
uniform vec4 uFigs[8];           // yfeet, px tall, wet, -
uniform vec3 uDeep, uRefl, uFoam, uLC;
uniform vec4 uLight;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
// the surface: a slow swell and smaller cross ripples (world units: figure heights); value and slope
vec3 waves(vec2 p, float t){
  vec3 r = vec3(0.0);
  vec2 k1 = vec2(2.3, 0.9), k2 = vec2(-1.6, 2.6), k3 = vec2(6.1, -3.8), k4 = vec2(-4.4, -7.3), k5 = vec2(11.0, 5.2);
  float a1 = 0.50, a2 = 0.38, a3 = 0.16, a4 = 0.11, a5 = 0.06;
  float p1 = dot(p, k1) + t * 0.55, p2 = dot(p, k2) - t * 0.47, p3 = dot(p, k3) + t * 1.10, p4 = dot(p, k4) - t * 1.35, p5 = dot(p, k5) + t * 1.9;
  r.x = a1 * sin(p1) + a2 * sin(p2) + a3 * sin(p3) + a4 * sin(p4) + a5 * sin(p5);
  r.yz = a1 * cos(p1) * k1 + a2 * cos(p2) * k2 + a3 * cos(p3) * k3 + a4 * cos(p4) * k4 + a5 * cos(p5) * k5;
  return r;
}
// caustics: a web of light moving over what is under the water
float caustic(vec2 p, float t){
  vec2 q = p * 5.0; float c = 0.0;
  for (int i = 0; i < 3; i++) {
    q += vec2(cos(q.y * 1.3 + t * 0.6 + float(i)), sin(q.x * 1.1 - t * 0.5 + float(i) * 1.7)) * 0.7;
    c += 1.0 / (1.0 + 12.0 * abs(sin(q.x) * sin(q.y)));
  }
  return pow(c / 3.0, 3.0);
}
float decodeY(vec4 m){ return (floor(m.r * 255.0 + 0.5) * 256.0 + floor(m.g * 255.0 + 0.5)) / 32.0; }
// the water at a scene pixel px whose floor row is yf, where a figure measures s px; body: water can be there
vec4 water(vec2 px, float yf, float s, float body, float isFig){
  if (body < 0.004) return vec4(0.0);
  float h = (yf - px.y) / s;
  if (h - uH > 0.06) return vec4(0.0);          // well above the water: nothing to do here
  // where the ray meets the surface: the px a figure would measure there, and its place on the plane (figure heights)
  float ss = max(20.0, (uS.x + uS.y * px.y) * uS.z / max(0.2, 1.0 - uS.y * uS.z * uH));
  vec2 wp = vec2((px.x - 640.0) / ss, 1000.0 / ss);
  vec3 wv = waves(wp * vec2(1.0, 1.6), uT);
  float rip = noise(wp * vec2(14.0, 22.0) + vec2(uT * 0.7, -uT * 0.4)) - 0.5;
  float hs = uH + (0.010 * wv.x + 0.004 * rip) * uWave;
  float d = hs - h, e = uE / s;
  float sub = smoothstep(-e, e, d);
  // the line where it meets wall or body: on a wall a soft wet band and a thin pale edge; on a body only a thin,
  // broken, wavering glint with a little shadow just under it (never a sash)
  float fn = noise(wp * vec2(30.0, 48.0) + vec2(uT * 0.9, 0.0));
  float fn2 = noise(vec2(px.x * 0.11 + uT * 1.7, px.y * 0.05 - uT * 0.4));
  float band = (1.0 - smoothstep(0.0, 0.02, abs(d - 0.004))) * (0.35 + 0.65 * fn) * (1.0 - isFig);
  float edge = (1.0 - smoothstep(0.0, mix(2.2, 1.2, isFig) * e, abs(d - 0.5 * e))) * mix(0.55 + 0.45 * fn, smoothstep(0.35, 0.75, fn2), isFig);
  if (sub <= 0.0 && band <= 0.0 && edge <= 0.0) return vec4(0.0);
  float far = clamp(1.0 - s / 420.0, 0.0, 1.0);
  // bent: what is under the surface wobbles, more the deeper it is
  vec2 slope = wv.yz * 0.05 + vec2(rip, -rip) * 0.6;
  float k = s / 300.0;
  vec2 off = slope * (1.5 + 9.0 * clamp(d, 0.0, 0.8)) * k * smoothstep(0.0, 0.04, d);
  vec3 sc = texture2D(uScene, clamp((px + off) / vec2(1280.0, 720.0), 0.001, 0.999)).rgb;
  // looked through: the first half figure of water stays fairly clear (a body is seen through it), then it closes:
  // the colours go grey, reds first, then everything; the deep is near black
  float dd = max(0.0, d);
  float L = (0.3 * dd + 0.7 * dd * dd / (dd + 0.4)) * (1.0 + 1.3 * far) + 0.02;
  float T = exp(-uSigma * L);
  sc = mix(sc, vec3(dot(sc, vec3(0.3, 0.55, 0.15))), 0.5 * (1.0 - T));
  vec3 T3 = exp(-uSigma * L * vec3(1.3, 1.0, 1.04));
  vec2 cp = vec2((px.x - 640.0) / s, 1000.0 / s + h * 1.4);
  float ca = caustic(cp, uT) * uCaus * T * smoothstep(0.0, 0.05, d) * (0.6 + 0.4 * uLight.z);
  // (and lit less, the deeper it lies: the light comes down through the water too)
  vec3 col = sc * T3 * exp(-0.35 * uSigma * L) * (1.0 + ca) + uDeep * (1.0 - T);
  // just under a body's line, a little shadow
  col *= 1.0 - 0.22 * isFig * (1.0 - smoothstep(0.0, 0.05, d)) * smoothstep(0.0, 1.5 * e, d);
  // the surface: what stands above the water here, upside down in it (the wall above its line, a body above its own),
  // broken by the ripples; more of it far off and on the ripples' backs; a dim sheen of the room's light
  float yl = yf - hs * s;
  vec2 rp = vec2(px.x + slope.x * 16.0 * k, 2.0 * yl - px.y + slope.y * 12.0 * k);
  vec3 rc = texture2D(uScene, clamp(rp / vec2(1280.0, 720.0), 0.001, 0.999)).rgb;
  float crest = clamp(slope.y * 0.5 + rip * 0.6, 0.0, 1.0);
  float fres = 0.06 + 0.34 * far * far + 0.22 * crest;
  float surf = smoothstep(0.0, 0.012, d);
  col = mix(col, rc * 0.7 + uRefl * 0.3, clamp(fres * uMirror, 0.0, 0.55) * surf);
  // the room's light in it: a broken, shimmering trail below the lamp, dashes that come and go with the ripples
  float lx = exp(-pow((px.x - uLight.x + slope.x * 40.0 * k) / (uLight.w * 0.22), 2.0)) * uLight.z;
  float dash = smoothstep(0.55, 0.85, noise(wp * vec2(5.0, 46.0) + vec2(uT * 0.25, uT * 1.1)));
  col += uLC * lx * dash * (0.12 + 0.3 * far) * surf * (1.0 - isFig * 0.7);
  // the ripples catch the light: a faint moving sheen on their backs, and small sharp glints
  float lw = exp(-pow((px.x - uLight.x) / uLight.w, 2.0)) * uLight.z;
  col += uLC * crest * crest * (0.03 + 0.10 * lw) * surf;
  float sp = noise(wp * vec2(70.0, 90.0) + vec2(uT * 2.1, -uT * 1.7)) * noise(wp * vec2(23.0, 31.0) - vec2(uT * 0.9, uT * 0.5));
  float gl = pow(sp, 5.0) * (0.5 + 0.5 * wv.x);
  col += uLC * gl * (0.6 + 3.0 * lw) * (0.35 + far) * surf;
  // the line: pale, broken, never white
  col = mix(col, uFoam * (0.8 + 0.5 * lw), clamp(band * 0.35 + edge * mix(0.6, 0.45, isFig), 0.0, 0.8));
  float a = max(sub, max(band * 0.25, edge * mix(0.5, 0.35, isFig)));
  a *= body;
  return vec4(col * a, a);
}
void main(){
  vec2 px = v * vec2(1280.0, 720.0);
  vec4 m = texture2D(uMap, v);
  float s0 = (uS.x + uS.y * decodeY(m)) * uS.z;
  vec4 bg = water(px, decodeY(m), max(20.0, s0), m.b, 0.0);
  vec4 f = texture2D(uFig, v);
  if (f.a < 0.02) { gl_FragColor = bg; return; }
  float idx = floor(f.r * 255.0 / 32.0) - 1.0;
  vec4 fg = vec4(0.0);
  for (int i = 0; i < 8; i++) if (float(i) == idx) fg = water(px, uFigs[i].x, uFigs[i].y, uFigs[i].z, 1.0);
  gl_FragColor = mix(bg, fg, clamp(f.a, 0.0, 1.0));
}`;
  let cv = null, gl = null, prog = null, U = {}, tScene = null, tMap = null, tFig = null, mapFor_ = null, failed = MODE === '2d', losses = 0;
  const mask = document.createElement('canvas'), mg = mask.getContext('2d');
  function lost(e) { e.preventDefault(); if (e.target !== cv) return; gl = null; cv = null; mapFor_ = null; if (++losses >= 3) { failed = true; console.info('Water: 2D (the GL context keeps being lost)'); } }
  function init() {
    if (gl && gl.isContextLost()) return false;
    if (gl || failed) return !!gl;
    try {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      cv.addEventListener('webglcontextlost', lost);
      gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
      if (!gl) throw new Error('no webgl');
      const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*0.5+0.5,0.5-p.y*0.5);gl_Position=vec4(p,0.,1.);}'));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const p = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uScene', 'uMap', 'uFig', 'uH', 'uT', 'uSigma', 'uCaus', 'uE', 'uWave', 'uMirror', 'uS', 'uFigs', 'uDeep', 'uRefl', 'uFoam', 'uLC', 'uLight']) U[n] = gl.getUniformLocation(prog, n);
      gl.uniform1i(U.uScene, 0); gl.uniform1i(U.uMap, 1); gl.uniform1i(U.uFig, 2);
      const tex = filt => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, filt], [gl.TEXTURE_MAG_FILTER, filt], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
        return t; };
      tScene = tex(gl.LINEAR); tMap = tex(gl.NEAREST); tFig = tex(gl.NEAREST);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      return true;
    } catch (e) { console.info('Water: 2D version (' + (e.message || e) + ')'); failed = true; gl = null; return false; }
  }
  // the floor rows as a texture: 16 bits of row (x32) in red and green, the body in blue
  function mapTexture(M) {
    const px = new Uint8Array(W * H * 4);
    for (let i = 0; i < W * H; i++) { const v = Math.max(0, Math.min(65535, Math.round(M.yf[i] * 32))); px[i * 4] = v >> 8; px[i * 4 + 1] = v & 255; px[i * 4 + 2] = M.body[i]; px[i * 4 + 3] = 255; }
    return px;
  }
  const figs = [];
  const stats = S.waterStats = { avg: 0, max: 0, n: 0, mode: '' };
  function drawGL(g, room, c, M, lvl) {
    if (!init()) return false;
    const t0 = performance.now(), Hh = S.waterH(lvl), q = window.WARP === false ? Math.min(OQ, 0.5) : OQ, ow = Math.round(W * q), oh = Math.round(H * q);
    if (cv.width !== ow || cv.height !== oh) { cv.width = ow; cv.height = oh; }
    // the frame so far (the painting, what moves in it, the figures)
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tScene);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, E.canvas);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tMap);
    if (mapFor_ !== M) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, mapTexture(M)); mapFor_ = M; }
    // who covers which pixel
    if (mask.width !== ow || mask.height !== oh) { mask.width = ow; mask.height = oh; }
    mg.setTransform(1, 0, 0, 1, 0, 0); mg.clearRect(0, 0, mask.width, mask.height);
    const fu = new Float32Array(32);
    figs.slice(0, 7).forEach((a, i) => {
      const wet = bodyAt(M, a.x, a.y - 2) ? 1 : 0;
      fu.set([a.y, Math.max(20, figS(a)), wet, 0], i * 4);
      silhouette(mg, a, q, `rgb(${(i + 1) * 32 + 16},0,0)`);
    });
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, tFig);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    gl.uniform4fv(U.uFigs, fu);
    gl.uniform1f(U.uH, Hh); gl.uniform1f(U.uT, E.time % 600); gl.uniform1f(U.uSigma, c.sigma || 2.4); gl.uniform1f(U.uCaus, c.caustic == null ? 0.3 : c.caustic);
    gl.uniform3f(U.uS, M.sa, M.sb, M.sMul);
    gl.uniform3fv(U.uDeep, c.deep); gl.uniform3fv(U.uRefl, c.refl); gl.uniform3fv(U.uFoam, c.foam); gl.uniform3fv(U.uLC, c.lc || c.foam);
    gl.uniform4fv(U.uLight, c.light || [640, 200, 0, 300]);
    gl.uniform1f(U.uE, 0.9 / q); gl.uniform1f(U.uWave, c.wave || 1); gl.uniform1f(U.uMirror, c.mirror == null ? 1 : c.mirror);
    gl.viewport(0, 0, ow, oh); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(cv, 0, 0, E.canvas.width, E.canvas.height); g.restore();
    const ms = performance.now() - t0;
    stats.n++; stats.avg += (ms - stats.avg) / Math.min(stats.n, 60); stats.max = Math.max(stats.max * 0.98, ms); stats.mode = 'webgl';
    return true;
  }

  // ---------------------------------------------------------------- 2D (no WebGL)
  const SW = 320, SH = 180, small = document.createElement('canvas'); small.width = SW; small.height = SH;
  const sg = small.getContext('2d'); let img = null;
  const mixc = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  function under2D(g, c, M, lvl) {
    const t0 = performance.now(), Hh = S.waterH(lvl), t = E.time;
    if (!img) img = sg.createImageData(SW, SH);
    const D = img.data, sh = c.deep.map(v => v * 255 + 18), dp = c.deep.map(v => v * 255), fo = c.foam.map(v => v * 255);
    for (let j = 0; j < SH; j++) {
      const y = (j + 0.5) * H / SH;
      for (let i = 0; i < SW; i++) {
        const x = (i + 0.5) * W / SW, k = ((y | 0) * W + (x | 0)), o = (j * SW + i) * 4;
        if (!M.body[k]) { D[o + 3] = 0; continue; }
        const bk = M.body[k] / 255;
        const s = Math.max(20, (M.sa + M.sb * M.yf[k]) * M.sMul), h = (M.yf[k] - y) / s;
        const d = Hh + (c.wave || 1) * 0.008 * Math.sin(x * 0.03 + t * 1.4) + 0.005 * Math.sin(x * 0.011 - t * 0.8) - h;
        if (d <= -0.01) { D[o + 3] = 0; continue; }
        const T = Math.exp(-(c.sigma || 2.4) * Math.max(0, d) * 1.4), col = mixc(dp, sh, T);
        const line = Math.max(0, 1 - Math.abs(d - 0.004) / 0.03), cc = mixc(col, fo, line * 0.45);
        D[o] = cc[0]; D[o + 1] = cc[1]; D[o + 2] = cc[2];
        D[o + 3] = bk * (d < 0 ? line * 80 : Math.min(255, 255 * (0.5 + 0.48 * (1 - T)) + line * 40));
      }
    }
    sg.putImageData(img, 0, 0);
    g.save(); g.imageSmoothingEnabled = true; g.drawImage(small, 0, 0, W, H); g.restore();
    stats.n++; stats.avg += (performance.now() - t0 - stats.avg) / Math.min(stats.n, 60); stats.mode = '2d';
  }
  // a figure's submerged part, over it: its silhouette below its own waterline, darker with depth
  const fcv = document.createElement('canvas'), fcg = fcv.getContext('2d');
  function figure2D(g, a, c, M, lvl) {
    if (!bodyAt(M, a.x, a.y - 2)) return;
    const s = figS(a), Hh = S.waterH(lvl), yw = a.y - Hh * s + 2 * Math.sin(E.time * 1.4 + a.x * 0.03);
    if (yw >= a.y + 4) return;
    const RS = E.RS || 1;
    if (fcv.width !== W * RS) { fcv.width = W * RS; fcv.height = H * RS; }
    fcg.setTransform(1, 0, 0, 1, 0, 0); fcg.clearRect(0, 0, fcv.width, fcv.height);
    silhouette(fcg, a, RS, '#000');
    fcg.globalCompositeOperation = 'source-in';
    const gr = fcg.createLinearGradient(0, yw * RS, 0, a.y * RS), dp = c.deep.map(v => Math.round(v * 255)), fo = c.foam.map(v => Math.round(v * 255));
    gr.addColorStop(0, `rgba(${fo},0.55)`); gr.addColorStop(Math.min(0.5, 6 / Math.max(6, a.y - yw)), `rgba(${dp.map(v => v + 30)},0.55)`); gr.addColorStop(1, `rgba(${dp},${Math.min(0.95, 0.6 + Hh * 0.4)})`);
    fcg.fillStyle = gr; fcg.fillRect(0, yw * RS, fcv.width, fcv.height);
    fcg.clearRect(0, 0, fcv.width, Math.max(0, yw * RS));
    fcg.globalCompositeOperation = 'source-over';
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(fcv, 0, 0); g.restore();
  }

  // ---------------------------------------------------------------- the engine's hook (js/engine/render.js)
  let cur = null;   // this frame: { room, c, M, lvl }
  E.waterPass = {
    // before the figures: is there water in this room this frame? (2D: the painting's water goes down now)
    begin(g) {
      cur = null; figs.length = 0;
      if (MODE === 'off') return false;
      const room = E.room, c = cfgOf(room); if (!c) return false;
      const M = mapFor(room, c), lvl = levelOf(c);
      if (!M || !(lvl > 0.001)) return false;
      cur = { room, c, M, lvl };
      if (failed || !init()) under2D(g, c, M, lvl);
      return true;
    },
    // each figure, just drawn (in depth order)
    figure(g, a) {
      if (!cur) return;
      if (failed || !gl) figure2D(g, a, cur.c, cur.M, cur.lvl); else figs.push(a);
    },
    // after the figures, before the room's animFg
    end(g) {
      if (!cur) return;
      const k = cur; cur = null;
      if (!failed && gl) { try { if (!drawGL(g, k.room, k.c, k.M, k.lvl)) under2D(g, k.c, k.M, k.lvl); } catch (e) { console.warn('water', e); failed = true; } }
    },
    // (for tests and the review: a room's floor rows, whether they're ready)
    map: id => maps[id] || null,
    debug: () => ({ mask, figs: figs.map(a => [a.id, a.x, a.y, figS(a)]) }),
  };
})();
