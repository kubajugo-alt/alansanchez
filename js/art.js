// Procedural VGA-style pixel art: every background and sprite is drawn in code
// at 320x150 and upscaled with nearest-neighbour filtering.
(function () {
  const W = 320, H = 150;
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  function mkCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    return [c, g];
  }
  function rng(seed) {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  }
  function rect(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function px(g, x, y, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, 1, 1); }
  // Ordered-dither blend of two colours; t = share of c2.
  function dith(g, x, y, w, h, c1, c2, t) {
    rect(g, x, y, w, h, c1);
    g.fillStyle = c2;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      if (BAYER[(y + yy) & 3][(x + xx) & 3] / 16 < t) g.fillRect(x + xx, y + yy, 1, 1);
    }
  }
  // Vertical dithered gradient through a list of colours.
  function vgrad(g, x, y, w, h, cols) {
    for (let r = 0; r < h; r++) {
      const p = h <= 1 ? 0 : r / (h - 1) * (cols.length - 1);
      const i = Math.min(cols.length - 2, Math.floor(p)), t = p - i;
      for (let xx = 0; xx < w; xx++) {
        const c = BAYER[(y + r) & 3][(x + xx) & 3] / 16 < t ? cols[i + 1] : cols[i];
        g.fillStyle = c; g.fillRect(x + xx, y + r, 1, 1);
      }
    }
  }
  function speckle(g, x, y, w, h, c, density, seed) {
    const r = rng(seed); g.fillStyle = c;
    const n = Math.floor(w * h * density);
    for (let i = 0; i < n; i++) g.fillRect(x + Math.floor(r() * w), y + Math.floor(r() * h), 1, 1);
  }
  function line(g, x0, y0, x1, y1, c) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy; g.fillStyle = c;
    for (;;) {
      g.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  // Crisp scanline polygon fill (no anti-aliasing).
  function poly(g, pts, c) {
    let minY = Infinity, maxY = -Infinity;
    for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    g.fillStyle = c;
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
        if ((y1 <= y + 0.5 && y2 > y + 0.5) || (y2 <= y + 0.5 && y1 > y + 0.5)) {
          xs.push(x1 + (y + 0.5 - y1) / (y2 - y1) * (x2 - x1));
        }
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const a = Math.round(xs[i]), b = Math.round(xs[i + 1]);
        if (b > a) g.fillRect(a, y, b - a, 1);
      }
    }
  }
  function disc(g, cx, cy, r, c) {
    g.fillStyle = c;
    for (let y = -r; y <= r; y++) {
      const w = Math.floor(Math.sqrt(r * r - y * y));
      g.fillRect(cx - w, cy + y, w * 2 + 1, 1);
    }
  }
  // Soft light pool, quantised to a few dithered rings.
  function glow(g, cx, cy, r, c, strength) {
    g.fillStyle = c;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      const d = Math.sqrt(x * x + y * y) / r;
      if (d > 1) continue;
      const t = (1 - d) * strength;
      if (BAYER[(cy + y) & 3][(cx + x) & 3] / 16 < t) g.fillRect(cx + x, cy + y, 1, 1);
    }
  }
  // Pointed gothic arch outline (filled with c), top at y, springing at ys.
  function gothicArch(g, x, y, w, ys, yb, c) {
    const pts = [];
    const cx = x + w / 2;
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([x + t * w / 2, ys - Math.sin(t * Math.PI / 2) * (ys - y) + (t * t * 0)]); }
    pts[pts.length - 1] = [cx, y];
    for (let i = 12; i >= 0; i--) { const t = i / 12; pts.push([x + w - t * w / 2, ys - Math.sin(t * Math.PI / 2) * (ys - y)]); }
    pts.push([x + w, yb], [x, yb]);
    poly(g, pts, c);
  }
  // Blue-and-white azulejo tile field.
  function azulejos(g, x, y, w, h, seed, dark) {
    const base = dark ? '#5d6a7e' : '#c9d3dd', blue = dark ? '#2c3a63' : '#2f4f9a', mid = dark ? '#3e4d75' : '#7f97c8';
    rect(g, x, y, w, h, base);
    const r = rng(seed);
    for (let ty = y; ty < y + h; ty += 6) for (let tx = x; tx < x + w; tx += 6) {
      const tw = Math.min(6, x + w - tx), th = Math.min(6, y + h - ty);
      g.fillStyle = mid; g.fillRect(tx, ty, tw, 1); g.fillRect(tx, ty, 1, th);
      if (tw >= 5 && th >= 5) {
        g.fillStyle = blue;
        g.fillRect(tx + 2, ty + 2, 2, 2); g.fillRect(tx + 3, ty + 1, 1, 1); g.fillRect(tx + 1, ty + 3, 1, 1);
        g.fillRect(tx + 4, ty + 3, 1, 1); g.fillRect(tx + 3, ty + 4, 1, 1);
        if (r() < 0.12) { g.fillStyle = base; g.fillRect(tx + 1, ty + 1, 4, 4); }
      }
    }
  }
  function books(g, x, y, w, h, seed) {
    const r = rng(seed);
    const cols = ['#6b2a22', '#2f4a3a', '#5b4a2a', '#2d3354', '#7a5a2e', '#4a2840', '#3d3d3d', '#8a6a3a', '#24413f', '#713a1d'];
    let cx = x;
    while (cx < x + w - 1) {
      const bw = 2 + Math.floor(r() * 3), bh = h - Math.floor(r() * 4);
      const c = cols[Math.floor(r() * cols.length)];
      const realW = Math.min(bw, x + w - cx);
      rect(g, cx, y + h - bh, realW, bh, c);
      if (r() < 0.5) rect(g, cx, y + h - bh + 2, realW, 1, '#c8a860');
      rect(g, cx + realW - 1, y + h - bh, 1, bh, 'rgba(0,0,0,0.35)');
      cx += realW;
      if (r() < 0.08 && cx < x + w - 6) { // leaning book gap
        rect(g, cx, y + h - 2, 3, 2, cols[Math.floor(r() * cols.length)]); cx += 4;
      }
    }
  }
  function bookcase(g, x, y, w, h, seed) {
    rect(g, x, y, w, h, '#3a2416');
    rect(g, x, y, w, 2, '#5a3a22'); rect(g, x, y, 2, h, '#4a2e1a'); rect(g, x + w - 2, y, 2, h, '#2a180e');
    const shelves = Math.floor((h - 4) / 15);
    for (let i = 0; i < shelves; i++) {
      const sy = y + 3 + i * 15;
      rect(g, x + 2, sy, w - 4, 13, '#1e120a');
      books(g, x + 3, sy + 1, w - 6, 12, seed + i * 17);
      rect(g, x + 1, sy + 13, w - 2, 2, '#5a3a22');
    }
  }
  function woodFloor(g, x, y, w, h, c1, c2, c3) {
    vgrad(g, x, y, w, h, [c1, c2]);
    const r = rng(7);
    for (let yy = y + 2, k = 0; yy < y + h; yy += 3 + Math.floor(k++ / 3)) {
      rect(g, x, yy, w, 1, c3);
      for (let i = 0; i < 6; i++) { const sx = x + Math.floor(r() * w); rect(g, sx, yy - 2, 1, 2, c3); }
    }
  }
  function flagstones(g, x, y, w, h, c1, c2, c3, seed) {
    vgrad(g, x, y, w, h, [c1, c2]);
    const r = rng(seed);
    let row = 0;
    for (let yy = y; yy < y + h; row++) {
      const rh = 3 + row * 1.6;
      rect(g, x, Math.round(yy), w, 1, c3);
      const step = 14 + row * 6;
      for (let xx = x - Math.floor(r() * step); xx < x + w; xx += step) rect(g, xx, Math.round(yy), 1, Math.round(rh), c3);
      yy += rh;
    }
  }
  function cobbles(g, x, y, w, h, c1, c2, seed) {
    rect(g, x, y, w, h, c1);
    const r = rng(seed);
    for (let yy = y; yy < y + h; yy += 3) for (let xx = x + ((yy / 3) % 2) * 2; xx < x + w; xx += 4) {
      const c = r() < 0.5 ? c2 : c1;
      rect(g, xx, yy, 3, 2, c);
    }
  }
  function windowPane(g, x, y, w, h, fogTop, fogBot, frame) {
    rect(g, x - 2, y - 2, w + 4, h + 4, frame);
    vgrad(g, x, y, w, h, [fogTop, fogBot]);
    rect(g, x + Math.floor(w / 2), y, 1, h, frame);
    rect(g, x, y + Math.floor(h / 2), w, 1, frame);
  }
  function text3x5(g, x, y, str, c) {
    // tiny pixel font for signs (caps and digits)
    const F = {
      A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
      F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
      K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
      P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
      U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
      Z: '111001010100111', ' ': '000000000000000', '.': '000000000000010', '-': '000000111000000', '2': '110001010100111',
      '8': '111101111101111', '0': '111101101101111', '1': '010110010010111', '5': '111100110001110', '7': '111001010010010', '9': '111101111001110'
    };
    g.fillStyle = c;
    let cx = x;
    for (const ch of str.toUpperCase()) {
      const p = F[ch] || F[' '];
      for (let i = 0; i < 15; i++) if (p[i] === '1') g.fillRect(cx + (i % 3), y + Math.floor(i / 3), 1, 1);
      cx += 4;
    }
  }
  function clock(g, cx, cy, r, face, rim, seed) {
    disc(g, cx, cy, r + 1, rim); disc(g, cx, cy, r, face);
    const rr = rng(seed);
    const a1 = rr() * 6.28, a2 = rr() * 6.28;
    line(g, cx, cy, cx + Math.cos(a1) * (r - 1), cy + Math.sin(a1) * (r - 1), '#201810');
    line(g, cx, cy, cx + Math.cos(a2) * (r - 2) * 0.6, cy + Math.sin(a2) * (r - 2) * 0.6, '#201810');
  }
  function bellShape(g, cx, top, w, h, c, hi, lo) {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const ww = (w * 0.28) + (w * 0.22) * Math.pow(t, 2.2) * 1 + (t > 0.85 ? (t - 0.85) * w * 0.9 : 0);
      pts.push([cx - ww, top + t * h]);
    }
    for (let i = 10; i >= 0; i--) {
      const t = i / 10;
      const ww = (w * 0.28) + (w * 0.22) * Math.pow(t, 2.2) * 1 + (t > 0.85 ? (t - 0.85) * w * 0.9 : 0);
      pts.push([cx + ww, top + t * h]);
    }
    poly(g, pts, c);
    // crown
    rect(g, cx - w * 0.18, top - 3, w * 0.36, 4, c);
    // shading
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      const ww = (w * 0.28) + (w * 0.22) * Math.pow(t, 2.2);
      rect(g, cx - ww + 1, top + t * h, 2, 1, hi);
      rect(g, cx + ww * 0.4, top + t * h, ww * 0.6, 1, lo);
    }
    // wave band
    for (let x = -w * 0.45; x < w * 0.45; x += 2) px(g, cx + x, top + h * 0.75 + Math.round(Math.sin(x * 0.7)), hi);
  }

  // ------------------------------------------------------------------
  // Backgrounds
  // ------------------------------------------------------------------
  const BG = {};

  BG.shop = function (g) {
    // back wall
    vgrad(g, 0, 0, W, 104, ['#2a1a12', '#3b2618', '#4a3020']);
    speckle(g, 0, 0, W, 104, '#24160e', 0.05, 3);
    // ceiling beam
    rect(g, 0, 0, W, 6, '#1a0f08'); rect(g, 0, 6, W, 1, '#5a3a22');
    // left bookcases
    bookcase(g, 4, 10, 46, 92, 11);
    bookcase(g, 52, 10, 46, 92, 29);
    // window
    windowPane(g, 112, 18, 60, 48, '#c9ccc8', '#8f9a9e', '#2a180e');
    speckle(g, 112, 18, 60, 48, '#dfe2de', 0.08, 5);
    // ghost of the street outside
    rect(g, 118, 44, 10, 21, '#7d878c'); rect(g, 130, 38, 12, 27, '#848e92'); rect(g, 150, 46, 18, 19, '#7a8489');
    rect(g, 112, 66, 60, 3, '#5a3a22'); // sill
    // sideboard under window
    rect(g, 108, 80, 68, 22, '#4a2e1a'); rect(g, 108, 80, 68, 2, '#6a4a2a');
    rect(g, 112, 86, 28, 13, '#3a2416'); rect(g, 144, 86, 28, 13, '#3a2416');
    px(g, 138, 92, '#c8a860'); px(g, 146, 92, '#c8a860');
    // kettle + mugs + tin on sideboard
    rect(g, 114, 73, 9, 7, '#7a7a80'); rect(g, 116, 71, 5, 2, '#8a8a90'); rect(g, 123, 74, 2, 2, '#7a7a80');
    rect(g, 127, 76, 3, 4, '#d8d0b8'); rect(g, 131, 76, 3, 4, '#a84030');
    rect(g, 160, 72, 8, 8, '#8a6a2a'); rect(g, 160, 72, 8, 1, '#b89040'); rect(g, 161, 75, 6, 2, '#c8b070');
    // counter (right)
    rect(g, 184, 74, 80, 30, '#4a2e1a'); rect(g, 184, 74, 80, 3, '#6a4a2a'); rect(g, 184, 101, 80, 3, '#2a180e');
    for (let i = 0; i < 4; i++) rect(g, 188 + i * 19, 80, 16, 18, '#3e2616');
    // shelf above counter
    rect(g, 184, 26, 80, 34, '#2a1a10'); bookcase(g, 184, 26, 80, 32, 47);
    // cash register
    rect(g, 236, 60, 22, 14, '#9a7a3a'); rect(g, 236, 60, 22, 2, '#c8a860'); rect(g, 238, 63, 18, 4, '#5a4a2a');
    rect(g, 240, 56, 14, 4, '#b89040'); text3x5(g, 241, 64, '0.00', '#e8d8a0');
    // answering machine
    rect(g, 194, 69, 14, 5, '#1a1a1a'); rect(g, 196, 70, 6, 2, '#3a3a3a');
    // newspaper
    rect(g, 213, 71, 15, 3, '#d8d4c4'); rect(g, 214, 72, 6, 1, '#606060'); rect(g, 221, 72, 6, 1, '#909090');
    // door (exit)
    rect(g, 270, 22, 38, 84, '#1a0f08');
    rect(g, 273, 25, 32, 80, '#5a3820');
    vgrad(g, 277, 29, 24, 30, ['#c9ccc8', '#9aa4a8']);
    rect(g, 288, 29, 1, 30, '#5a3820');
    rect(g, 277, 64, 24, 36, '#4a2e1a'); rect(g, 299, 66, 2, 3, '#c8a860');
    text3x5(g, 279, 50, 'OPEN', '#3a2416');
    // desk (left, against bookcases)
    rect(g, 8, 84, 88, 20, '#5a3820'); rect(g, 6, 82, 92, 3, '#7a5030');
    rect(g, 12, 88, 36, 6, '#4a2e1a'); rect(g, 12, 95, 36, 7, '#4a2e1a');
    rect(g, 28, 90, 4, 1, '#c8a860'); rect(g, 28, 98, 4, 1, '#c8a860');
    px(g, 30, 99, '#000');
    rect(g, 56, 88, 36, 14, '#4a2e1a');
    // things on desk
    rect(g, 14, 76, 18, 6, '#d8d0b0'); rect(g, 15, 77, 16, 1, '#a09880');
    rect(g, 40, 78, 4, 4, '#2a2a2a'); rect(g, 36, 70, 1, 8, '#2a2a2a'); rect(g, 34, 68, 8, 3, '#b8a040'); // lamp
    // magnifier
    rect(g, 66, 79, 5, 1, '#6a4a2a'); disc(g, 74, 79, 2, '#c8a860'); px(g, 74, 79, '#d8e8f0');
    // floor
    woodFloor(g, 0, 104, W, 46, '#3a2414', '#5a3a22', '#2a180c');
    rect(g, 0, 104, W, 1, '#1a0f08');
    // rug
    poly(g, [[110, 118], [210, 118], [230, 142], [90, 142]], '#5a1e1a');
    poly(g, [[114, 120], [206, 120], [224, 140], [96, 140]], '#7a2a20');
    for (let x = 104; x < 222; x += 6) rect(g, x, 129, 3, 2, '#c8a040');
  };
  BG.shop_fg = null;

  BG.street = function (g) {
    vgrad(g, 0, 0, W, 110, ['#9aa3a6', '#b8bdba', '#c6c8c0']);
    // distant houses climbing the hill, fading into fog
    const r = rng(9);
    const layers = [['#a7aeaf', 40, 0.7], ['#959ea1', 52, 0.6], ['#848e92', 64, 0.5]];
    for (const [c, base, ] of layers) {
      for (let x = 70; x < 250; x += 10 + Math.floor(r() * 10)) {
        const h = 10 + Math.floor(r() * 18), w = 9 + Math.floor(r() * 10);
        rect(g, x, base - h + (x > 160 ? (x - 160) * 0.1 : 0), w, h + 40, c);
        poly(g, [[x - 1, base - h], [x + w / 2, base - h - 4], [x + w + 1, base - h]], c);
        if (r() < 0.5) rect(g, x + 3, base - h + 5, 2, 2, '#b0a690');
      }
    }
    // stair in the middle going up
    for (let i = 0; i < 14; i++) {
      const y = 108 - i * 4, x0 = 120 + i * 3, x1 = 200 - i * 3;
      rect(g, x0, y, x1 - x0, 4, i % 2 ? '#8d8a80' : '#9b978c');
      rect(g, x0, y, x1 - x0, 1, '#b4b0a4');
    }
    // left building (bookshop)
    rect(g, 0, 0, 112, 118, '#c7b48a');
    speckle(g, 0, 0, 112, 118, '#b29d72', 0.15, 4);
    azulejos(g, 0, 62, 112, 56, 31, false);
    rect(g, 0, 60, 112, 2, '#8a7a5a');
    // upper windows with shutters
    for (const wx of [12, 48, 84]) {
      rect(g, wx, 14, 16, 26, '#3a3a40'); rect(g, wx - 5, 14, 5, 26, '#2f5a4a'); rect(g, wx + 16, 14, 5, 26, '#2f5a4a');
      rect(g, wx - 2, 40, 22, 2, '#e0d8c8');
      rect(g, wx + 2, 16, 12, 1, '#56565c');
    }
    // shop front
    rect(g, 14, 66, 72, 52, '#2a1a10');
    rect(g, 18, 82, 34, 30, '#8a9496'); books(g, 20, 96, 30, 15, 71);
    rect(g, 58, 70, 24, 48, '#4a2e1a'); vgrad(g, 61, 74, 18, 18, ['#c09050', '#7a5a30']); rect(g, 77, 96, 2, 3, '#c8a860');
    rect(g, 14, 64, 72, 10, '#1e3a30'); text3x5(g, 18, 67, 'LIVRARIA SANCHEZ', '#e0c070');
    // right building (tavern)
    rect(g, 214, 0, 106, 118, '#b88a6a');
    speckle(g, 214, 0, 106, 118, '#a07858', 0.15, 6);
    azulejos(g, 214, 70, 106, 48, 77, false);
    for (const wx of [228, 268, 300]) {
      rect(g, wx, 18, 14, 24, '#3a3030'); rect(g, wx - 2, 42, 18, 2, '#e0d8c8');
      rect(g, wx - 3, 44, 20, 1, '#5a4a3a'); for (let k = 0; k < 5; k++) rect(g, wx - 2 + k * 4, 45, 1, 5, '#3a3a3a');
    }
    rect(g, 246, 62, 34, 56, '#2a1410');
    rect(g, 249, 66, 28, 52, '#6a2a1a'); rect(g, 249, 66, 28, 10, '#3a1a10');
    glow(g, 263, 72, 6, '#ffb060', 0.8);
    rect(g, 236, 52, 54, 9, '#2a1a10'); text3x5(g, 240, 54, 'TABERNA', '#e0c070'); text3x5(g, 270, 54, 'FADO', '#e06040');
    // laundry line
    line(g, 112, 20, 214, 26, '#3a3a3a');
    const shirts = [[124, '#c04030'], [140, '#e0e0d8'], [160, '#3050a0'], [182, '#e0d080'], [198, '#d8d8d0']];
    for (const [sx, c] of shirts) { const sy = 21 + (sx - 112) * 6 / 102; rect(g, sx, sy, 8, 9, c); rect(g, sx + 1, sy + 9, 2, 2, c); rect(g, sx + 5, sy + 9, 2, 2, c); }
    // tram stop
    rect(g, 168, 52, 2, 66, '#2a2a2a'); rect(g, 162, 44, 14, 10, '#e0b020'); text3x5(g, 164, 47, '28', '#2a2a2a');
    // street lamp
    rect(g, 100, 40, 2, 78, '#202020'); rect(g, 96, 34, 10, 8, '#303030'); rect(g, 98, 36, 6, 5, '#ffe8a0');
    // street
    cobbles(g, 0, 118, W, 32, '#6e6a62', '#7d786e', 12);
    rect(g, 0, 118, W, 1, '#4a4640');
    rect(g, 0, 132, W, 1, '#9a8a60'); rect(g, 0, 140, W, 1, '#9a8a60'); // tram rails
  };

  BG.police = function (g) {
    vgrad(g, 0, 0, W, 108, ['#7a8c78', '#8a9a86', '#94a28e']);
    rect(g, 0, 0, W, 4, '#5a6658');
    // fluorescent light
    rect(g, 120, 4, 80, 3, '#e8f0e0'); glow(g, 160, 8, 30, '#c8d8c0', 0.25);
    rect(g, 0, 80, W, 28, '#6a7a66'); rect(g, 0, 80, W, 1, '#4a5646');
    // window with blinds
    rect(g, 196, 16, 76, 54, '#4a5446'); vgrad(g, 199, 19, 70, 48, ['#c0c4c0', '#9aa2a2']);
    for (let y = 20; y < 67; y += 3) rect(g, 199, y, 70, 1, '#d8dcd0');
    // corkboard
    rect(g, 16, 18, 84, 54, '#5a3a20'); rect(g, 19, 21, 78, 48, '#b08850'); speckle(g, 19, 21, 78, 48, '#9a7440', 0.2, 2);
    const photos = [[24, 26], [46, 28], [68, 25], [28, 48], [52, 47], [74, 49]];
    photos.forEach(([x, y], i) => {
      rect(g, x, y, 16, 13, '#e8e4d8'); rect(g, x + 1, y + 1, 14, 9, i < 3 ? '#3a4050' : '#506070');
      rect(g, x + 4, y + 5, 7, 3, '#c8c0b0'); px(g, x + 7, y, '#c02020');
      if (i < 3) { rect(g, x + 9, y + 3, 3, 3, '#3050a0'); }
    });
    line(g, 32, 27, 54, 29, '#c02020'); line(g, 54, 29, 76, 26, '#c02020');
    // filing cabinet
    rect(g, 282, 44, 30, 64, '#6a6e70'); for (let i = 0; i < 4; i++) { rect(g, 284, 47 + i * 15, 26, 13, '#7a7e80'); rect(g, 293, 52 + i * 15, 8, 2, '#3a3a3a'); }
    rect(g, 284, 77, 26, 4, '#e0d8c0'); // drawer that won't close
    // door (left)
    rect(g, 0, 26, 12, 82, '#3a3020'); rect(g, 2, 28, 8, 78, '#7a6a4a');
    // desk
    rect(g, 110, 86, 120, 6, '#6a4a2a'); rect(g, 114, 92, 112, 22, '#4a3420');
    rect(g, 120, 96, 30, 14, '#3e2a18'); rect(g, 190, 96, 30, 14, '#3e2a18');
    // typewriter, phone, papers, coffee, evidence bag
    rect(g, 118, 78, 22, 8, '#2a2a2a'); rect(g, 120, 76, 18, 3, '#3a3a3a');
    rect(g, 146, 81, 18, 5, '#e8e4d8'); rect(g, 148, 80, 16, 1, '#d8d4c8');
    rect(g, 170, 80, 10, 6, '#c8c8f0'); rect(g, 171, 81, 8, 4, '#d0d8f8'); rect(g, 173, 82, 4, 2, '#3050a0'); // bag
    rect(g, 196, 79, 5, 7, '#e0e0e0'); rect(g, 197, 80, 3, 1, '#3a2010'); rect(g, 201, 81, 2, 3, '#e0e0e0');
    rect(g, 208, 80, 14, 6, '#1a1a1a'); rect(g, 210, 78, 10, 2, '#2a2a2a');
    // floor
    vgrad(g, 0, 108, W, 42, ['#5a5a50', '#6a6a5e']);
    for (let x = 0; x < W; x += 16) for (let y = 108; y < 150; y += 8) rect(g, x + ((y / 8) % 2) * 8, y, 8, 8, '#626256');
    rect(g, 0, 108, W, 1, '#3a3a34');
  };

  BG.tavern = function (g) {
    vgrad(g, 0, 0, W, 110, ['#1a0c08', '#3a1a10', '#4a2414']);
    speckle(g, 0, 0, W, 110, '#2a1208', 0.1, 8);
    // beams
    rect(g, 0, 0, W, 5, '#120806'); for (let x = 20; x < W; x += 60) rect(g, x, 0, 6, 12, '#120806');
    // lamps
    for (const lx of [80, 200]) { rect(g, lx, 12, 1, 14, '#0a0604'); rect(g, lx - 3, 26, 7, 5, '#3a2a10'); glow(g, lx, 34, 34, '#ff9a40', 0.35); rect(g, lx - 2, 27, 5, 3, '#ffd080'); }
    // azulejo dado
    azulejos(g, 0, 74, 216, 34, 13, true);
    rect(g, 0, 72, 216, 2, '#2a1208');
    // photo frame
    rect(g, 90, 30, 22, 18, '#6a4a20'); rect(g, 92, 32, 18, 14, '#c8b890'); rect(g, 95, 36, 5, 10, '#504030'); rect(g, 102, 35, 5, 11, '#605040');
    rect(g, 96, 34, 3, 3, '#7a6a50'); rect(g, 103, 33, 3, 3, '#7a6a50');
    // guitar on wall
    disc(g, 150, 52, 8, '#8a5a2a'); disc(g, 150, 52, 3, '#2a1408'); rect(g, 149, 22, 3, 26, '#5a3a1a'); rect(g, 147, 18, 7, 5, '#3a2410');
    for (let i = 0; i < 6; i++) px(g, 148 + i, 20, '#c8c8c8');
    rect(g, 150, 22, 1, 36, '#c8c0a0');
    // fado poster
    rect(g, 30, 24, 26, 36, '#d8c8a0'); rect(g, 33, 28, 20, 14, '#2a1a1a'); text3x5(g, 34, 46, 'FADO', '#8a1a1a'); rect(g, 40, 30, 6, 10, '#c8b890');
    // door left (exit)
    rect(g, 2, 30, 22, 80, '#120806'); rect(g, 4, 32, 18, 76, '#4a2414'); vgrad(g, 7, 36, 12, 18, ['#b8bcb8', '#8a9294']);
    // bar (right)
    rect(g, 216, 20, 104, 52, '#2a140c');
    for (let s = 0; s < 3; s++) {
      rect(g, 220, 34 + s * 14, 96, 2, '#5a3a1a');
      for (let b = 0; b < 12; b++) {
        const bx = 224 + b * 8, by = 22 + s * 14, c = ['#8a1a1a', '#3a5a2a', '#c8a040', '#6a1020'][(b + s) % 4];
        rect(g, bx, by + 4, 4, 8, c); rect(g, bx + 1, by + 1, 2, 3, c); px(g, bx + 1, by + 6, 'rgba(255,255,255,0.5)');
      }
    }
    rect(g, 212, 72, 108, 36, '#5a2e18'); rect(g, 210, 70, 110, 4, '#7a4424'); rect(g, 212, 104, 108, 4, '#2a140c');
    for (let i = 0; i < 5; i++) rect(g, 218 + i * 20, 78, 16, 22, '#4a2414');
    // floor
    vgrad(g, 0, 108, W, 42, ['#2a1408', '#3a2010']);
    for (let y = 112; y < 150; y += 5) rect(g, 0, y, W, 1, '#22100a');
    // table + candle (Amália's)
    rect(g, 140, 104, 50, 4, '#5a3418'); rect(g, 162, 108, 6, 22, '#3a2010'); rect(g, 154, 128, 22, 3, '#3a2010');
    rect(g, 140, 102, 50, 2, '#c8b8a0'); // cloth
    rect(g, 170, 96, 2, 6, '#e8e0c8'); px(g, 170, 95, '#ffd060'); glow(g, 171, 96, 10, '#ffb050', 0.5);
    rect(g, 150, 98, 3, 4, '#8a1a1a'); // glass
    // chairs
    rect(g, 196, 96, 3, 32, '#3a2010'); rect(g, 196, 112, 14, 3, '#3a2010'); rect(g, 208, 112, 2, 16, '#3a2010');
  };

  BG.convent = function (g, night) {
    const sky = night ? ['#0a0e20', '#1a2038', '#2a3048'] : ['#8a8aa0', '#b0a8b0', '#c8bcb0'];
    vgrad(g, 0, 0, W, 112, sky);
    if (night) { speckle(g, 0, 0, W, 50, '#8890b0', 0.01, 5); disc(g, 250, 22, 8, '#d8dcd0'); disc(g, 253, 20, 7, '#c8ccc4'); disc(g, 250, 22, 6, '#e8ece0'); }
    const stone = night ? '#3a3e50' : '#9a9080', stoneD = night ? '#262a3a' : '#7a7062', stoneL = night ? '#50566a' : '#b8ae9a';
    // far end wall with big pointed window
    rect(g, 110, 30, 100, 82, stoneD);
    gothicArch(g, 140, 34, 40, 60, 100, sky[1]);
    rect(g, 159, 40, 2, 60, stoneD);
    // arches receding on both sides (nave arcade)
    const arcs = [[0, 52, 12], [52, 34, 26], [86, 24, 34]];
    for (const [x, w, top] of arcs) {
      rect(g, x, top - 4, w, 112 - top + 4, stone);
      gothicArch(g, x + 4, top + 4, w - 8, top + 30, 112, sky[2]);
      rect(g, x, top - 4, 4, 112 - top + 4, stoneL);
      const mx = W - x - w;
      rect(g, mx, top - 4, w, 112 - top + 4, stone);
      gothicArch(g, mx + 4, top + 4, w - 8, top + 30, 112, sky[2]);
      rect(g, mx + w - 4, top - 4, 4, 112 - top + 4, stoneD);
    }
    // broken rib arches spanning overhead
    for (const [y, sp] of [[8, 1], [18, 0.8], [26, 0.6]]) {
      for (let x = 0; x < W; x++) {
        const t = (x - W / 2) / (W / 2 * sp);
        if (Math.abs(t) > 1) continue;
        const yy = y + (t * t) * 30 * sp;
        if (Math.abs(t) < 0.18 && y === 8) continue; // the broken gap
        rect(g, x, yy, 1, 3, stone);
      }
    }
    // weeping stone (left wall)
    rect(g, 22, 62, 26, 30, stoneL); rect(g, 24, 64, 22, 26, stone);
    for (let i = 0; i < 6; i++) rect(g, 26 + i * 3, 66 + (i % 2) * 2, 2, 22 - (i % 3) * 3, night ? '#9aa0b8' : '#e8e4dc');
    disc(g, 35, 75, 6, stoneD); disc(g, 35, 75, 4, stone);
    // floor
    flagstones(g, 0, 112, W, 38, night ? '#2a2e3e' : '#8a8274', night ? '#3a3e50' : '#a09684', night ? '#1a1e2a' : '#6a6254', 4);
    // grate (right)
    rect(g, 232, 126, 50, 14, '#141414'); for (let x = 234; x < 282; x += 4) rect(g, x, 126, 1, 14, '#5a5048'); rect(g, 232, 126, 50, 1, '#5a5048'); rect(g, 232, 139, 50, 1, '#5a5048');
    // rubble
    const r = rng(3);
    for (let i = 0; i < 14; i++) { const x = Math.floor(r() * W), y = 116 + Math.floor(r() * 30); rect(g, x, y, 3 + Math.floor(r() * 4), 2, stoneL); }
    // broom leaning
    if (!night) { line(g, 196, 100, 204, 128, '#6a4a2a'); rect(g, 202, 126, 6, 4, '#b8a060'); }
  };
  BG.convent_night = (g) => BG.convent(g, true);

  BG.antiques = function (g) {
    vgrad(g, 0, 0, W, 106, ['#1c1a14', '#2e2a1e', '#3a3424']);
    // patterned wallpaper
    for (let y = 8; y < 100; y += 8) for (let x = (y / 8) % 2 * 6; x < W; x += 12) { px(g, x, y, '#4a4230'); px(g, x + 1, y + 1, '#4a4230'); px(g, x - 1, y + 1, '#4a4230'); px(g, x, y + 2, '#4a4230'); }
    // clocks wall
    const r = rng(5);
    for (let i = 0; i < 14; i++) {
      const x = 14 + Math.floor(r() * 100), y = 12 + Math.floor(r() * 50), rr = 3 + Math.floor(r() * 5);
      clock(g, x, y, rr, '#e0d8b8', ['#8a6a2a', '#5a3a1a', '#b89040'][i % 3], i * 7);
    }
    // grandfather clock
    rect(g, 120, 18, 16, 88, '#3a2010'); rect(g, 118, 16, 20, 6, '#5a3a1a'); clock(g, 128, 30, 6, '#e0d8b8', '#b89040', 99);
    rect(g, 124, 44, 8, 40, '#2a1408'); rect(g, 127, 50, 2, 24, '#b89040'); disc(g, 128, 76, 3, '#c8a040');
    // ship's bell on bracket
    rect(g, 150, 22, 16, 2, '#3a2a1a'); bellShape(g, 158, 28, 14, 14, '#a07830', '#d0a850', '#6a4a20');
    // shelves right with curios
    rect(g, 200, 20, 70, 2, '#5a3a1a'); rect(g, 200, 44, 70, 2, '#5a3a1a'); rect(g, 200, 68, 70, 2, '#5a3a1a');
    disc(g, 212, 14, 5, '#b89040'); line(g, 206, 14, 218, 14, '#b89040'); line(g, 212, 8, 212, 20, '#b89040'); // armillary
    rect(g, 230, 12, 8, 8, '#c8c8c0'); rect(g, 246, 10, 6, 10, '#3a5a8a'); rect(g, 258, 14, 10, 6, '#8a2a2a');
    // music box (middle shelf)
    rect(g, 222, 36, 18, 8, '#5a2a3a'); rect(g, 222, 36, 18, 1, '#e0d8e8'); speckle(g, 222, 37, 18, 7, '#e8e0f0', 0.25, 4);
    rect(g, 228, 32, 6, 4, '#d0d0d8'); px(g, 231, 31, '#d0d0d8');
    rect(g, 246, 58, 20, 10, '#2a3a2a'); rect(g, 205, 60, 12, 8, '#8a7a5a');
    // curtain to the back room
    rect(g, 280, 18, 34, 88, '#1a0e08'); for (let x = 282; x < 312; x += 4) rect(g, x, 20, 3, 86, '#5a1420'); for (let x = 284; x < 312; x += 4) rect(g, x, 20, 1, 86, '#3a0a14');
    // display case (center)
    rect(g, 140, 78, 70, 30, '#3a2010'); rect(g, 142, 64, 66, 16, '#9ab0b0'); rect(g, 144, 66, 62, 12, '#5a1420');
    rect(g, 142, 64, 66, 1, '#d8e8e8'); rect(g, 142, 64, 1, 16, '#d8e8e8');
    rect(g, 196, 69, 8, 5, '#e8e0c8');
    // counter (left of case) - Lacerda's
    rect(g, 40, 82, 80, 26, '#4a2a14'); rect(g, 38, 80, 84, 3, '#6a4020');
    rect(g, 46, 74, 16, 6, '#c8a040'); rect(g, 50, 72, 8, 2, '#8a6a20'); // brass scales
    // floor
    vgrad(g, 0, 106, W, 44, ['#2a1c10', '#3a2818']);
    for (let x = -40; x < W + 40; x += 20) line(g, x, 106, x + (x - 160) * 0.4, 150, '#22160c');
    poly(g, [[100, 116], [240, 116], [262, 146], [78, 146]], '#3a1a20');
    poly(g, [[106, 119], [234, 119], [252, 143], [86, 143]], '#5a2430');
    rect(g, 0, 106, W, 1, '#140c06');
  };

  BG.cistern = function (g) {
    vgrad(g, 0, 0, W, 104, ['#04080a', '#0a1618', '#12262a']);
    // receding arches
    for (let d = 0; d < 4; d++) {
      const s = 1 - d * 0.22, cy = 60, cx = 160;
      const w = 300 * s, h = 120 * s;
      const c = ['#2a3a3c', '#223032', '#1a2628', '#121c1e'][d];
      for (let k = -2; k <= 2; k++) {
        const px0 = cx + k * w * 0.4;
        rect(g, px0 - 6 * s, cy - h * 0.3, 12 * s, h * 0.9, c);
        for (let x = -w * 0.2; x < w * 0.2; x++) {
          const t = x / (w * 0.2);
          rect(g, px0 + w * 0.2 + x, cy - h * 0.3 - Math.sqrt(1 - t * t) * 18 * s, 1, 4 * s, c);
        }
      }
    }
    // bell chain + bell
    rect(g, 159, 0, 2, 30, '#3a2a1a'); for (let y = 0; y < 30; y += 3) px(g, 158, y, '#5a4a2a');
    bellShape(g, 160, 32, 52, 46, '#5a4a20', '#8a7a3a', '#3a2a10');
    speckle(g, 140, 36, 40, 40, '#3a6a4a', 0.12, 77); // verdigris
    // walkway (left & front)
    rect(g, 0, 104, W, 46, '#1a2224');
    flagstones(g, 0, 112, W, 38, '#2a3436', '#3a4648', '#141a1c', 9);
    // water channel across the middle
    vgrad(g, 0, 84, W, 26, ['#061214', '#0a2026', '#0c262c']);
    rect(g, 0, 110, W, 2, '#3a4648');
    // pillar (right) where Inês is tied
    rect(g, 262, 30, 18, 82, '#2a3638'); rect(g, 262, 30, 3, 82, '#3a4a4c'); rect(g, 258, 26, 26, 6, '#344244');
    // torches
    for (const tx of [40, 300]) { rect(g, tx, 52, 3, 10, '#3a2a1a'); rect(g, tx - 1, 48, 5, 4, '#ff9a30'); glow(g, tx + 1, 52, 26, '#ff8a30', 0.35); }
  };

  BG.map = function (g) {
    // 1990s tourist map of Lisbon
    rect(g, 0, 0, W, H, '#e8dcb8');
    speckle(g, 0, 0, W, H, '#d8cca4', 0.25, 6);
    // river Tejo
    poly(g, [[0, 112], [60, 106], [140, 112], [220, 104], [320, 110], [320, 150], [0, 150]], '#5a8ab0');
    poly(g, [[0, 118], [60, 113], [140, 118], [220, 111], [320, 116], [320, 150], [0, 150]], '#4a7aa0');
    speckle(g, 0, 118, W, 32, '#7aa8c8', 0.04, 3);
    text3x5(g, 128, 132, 'RIO TEJO', '#2a4a70');
    // parks + streets
    rect(g, 30, 20, 30, 20, '#b8c890'); rect(g, 240, 30, 24, 16, '#b8c890');
    const r = rng(14);
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(r() * W), y = Math.floor(r() * 100);
      line(g, x, y, x + Math.floor(r() * 40 - 20), y + Math.floor(r() * 30 - 15), '#c8b890');
    }
    line(g, 0, 98, 320, 96, '#b8a070'); line(g, 120, 0, 140, 100, '#b8a070'); line(g, 200, 10, 190, 100, '#b8a070');
    // tram route 28 in yellow
    for (let x = 30; x < 290; x++) px(g, x, Math.round(70 + Math.sin(x / 30) * 14), '#d8a820');
    // compass rose
    disc(g, 292, 22, 9, '#c8b890'); line(g, 292, 12, 292, 32, '#6a4a2a'); line(g, 282, 22, 302, 22, '#6a4a2a'); text3x5(g, 291, 6, 'N', '#6a4a2a');
    // frame
    rect(g, 0, 0, W, 2, '#6a4a2a'); rect(g, 0, H - 2, W, 2, '#6a4a2a'); rect(g, 0, 0, 2, H, '#6a4a2a'); rect(g, W - 2, 0, 2, H, '#6a4a2a');
    text3x5(g, 8, 6, 'LISBOA 1995', '#6a4a2a');
  };

  BG.title = function (g) {
    vgrad(g, 0, 0, W, H, ['#0a0c18', '#1a2034', '#3a4256', '#6a7078']);
    // skyline silhouette
    const r = rng(21);
    for (let x = 0; x < W; x += 6 + Math.floor(r() * 8)) {
      const h = 20 + Math.floor(r() * 30);
      rect(g, x, 110 - h, 8 + Math.floor(r() * 6), h + 10, '#10141e');
      if (r() < 0.4) px(g, x + 3, 112 - h + 6, '#d8b060');
    }
    // castle on the hill
    rect(g, 220, 58, 50, 30, '#0c0f18'); for (let x = 220; x < 270; x += 6) rect(g, x, 54, 3, 4, '#0c0f18');
    rect(g, 236, 46, 10, 14, '#0c0f18');
    // river
    vgrad(g, 0, 118, W, 32, ['#141c2a', '#0a0e18']);
    for (let i = 0; i < 30; i++) rect(g, Math.floor(r() * W), 120 + Math.floor(r() * 28), 6, 1, '#3a4660');
    // giant bell ghost in the sky
    bellShape(g, 160, 20, 70, 60, '#2a3040', '#3a4458', '#1a2030');
  };

  // ------------------------------------------------------------------
  // Fog: a tileable soft-noise layer, scrolled per frame.
  // ------------------------------------------------------------------
  function makeFog(seed, color) {
    const [c, g] = mkCanvas(W * 2, H);
    const r = rng(seed);
    for (let i = 0; i < 90; i++) {
      const x = r() * W * 2, y = 20 + r() * (H - 10), rad = 18 + r() * 40;
      for (const dx of [0, -W * 2, W * 2]) {
        const gr = g.createRadialGradient(x + dx, y, 0, x + dx, y, rad);
        gr.addColorStop(0, color.replace('A', '0.35'));
        gr.addColorStop(1, color.replace('A', '0'));
        g.fillStyle = gr;
        g.beginPath(); g.ellipse(x + dx, y, rad * 1.8, rad * 0.5, 0, 0, 6.283); g.fill();
      }
    }
    return c;
  }

  // ------------------------------------------------------------------
  // Character sprites. Specs describe palette + silhouette; frames are
  // cached by key. Sprite canvas is 24x54, feet at (12, 52).
  // ------------------------------------------------------------------
  const SW = 24, SH = 54;
  const spriteCache = new Map();

  function drawSprite(spec, dir, frame, talk, blink) {
    const key = [spec.id, dir, frame, talk, blink].join('|');
    if (spriteCache.has(key)) return spriteCache.get(key);
    const [c, g] = mkCanvas(SW, SH);
    const S = spec;
    const side = dir === 'e' || dir === 'w';
    const back = dir === 'n';
    const long = S.robe; // cassock / dress / robe reaches the ankles
    const o = 2; // x offset so 20-wide figure is centred in 24
    const R = (x, y, w, h, col) => rect(g, x + o, y, w, h, col);

    // legs / feet
    const legY = 33, footY = 50;
    if (!long) {
      if (side) {
        const sw = [0, 3, 0, -3][frame];
        R(7 + sw, legY, 4, footY - legY, S.legs); R(9 - sw, legY, 4, footY - legY, shade(S.legs));
        R(7 + sw + (dir === 'e' ? 1 : -1), footY, 5, 2, S.shoes); R(9 - sw + (dir === 'e' ? 1 : -1), footY, 5, 2, S.shoes);
      } else {
        const l = frame === 1 ? -1 : 0, rr = frame === 3 ? -1 : 0;
        R(6, legY, 4, footY - legY + l, S.legs); R(10, legY, 4, footY - legY + rr, shade(S.legs));
        R(5, footY + l, 5, 2, S.shoes); R(10, footY + rr, 5, 2, S.shoes);
        R(9, legY, 1, 10, shade(S.legs));
      }
    } else {
      const sway = side ? [0, 1, 0, -1][frame] : 0;
      for (let y = 30; y < footY + 1; y++) {
        const w = 10 + Math.floor((y - 30) / 4);
        R(10 - w / 2 + (y > 44 ? sway : 0), y, w, 1, y % 7 === 0 ? shade(S.top) : S.top);
      }
      R(7 + sway, footY + 1, 3, 1, S.shoes); R(11 - sway, footY + 1, 3, 1, S.shoes);
    }
    // torso
    const tw = side ? 9 : 10, tx = side ? 5 : 5;
    R(tx, 15, tw, 18, S.top);
    R(tx, 15, 1, 18, hi(S.top));
    if (S.shirt && !back) { if (side) R(dir === 'e' ? 12 : 6, 15, 2, 7, S.shirt); else R(9, 15, 2, 9, S.shirt); }
    if (S.tie && !back && !side) R(9, 16, 2, 8, S.tie);
    if (S.belt && !long) R(tx, 31, tw, 1, S.belt);
    if (S.shawl) { R(4, 15, 12, 6, S.shawl); R(5, 21, 10, 2, S.shawl); if (!back) R(9, 23, 2, 2, S.shawl); }
    // arms
    if (side) {
      const sw = [0, 2, 0, -2][frame];
      const ax = dir === 'e' ? 8 : 9;
      R(ax + sw, 16, 3, 14, shade(S.top)); R(ax + sw, 30, 3, 2, S.skin);
    } else {
      R(3, 16, 2, 15, shade(S.top)); R(15, 16, 2, 15, shade(S.top));
      R(3, 31, 2, 2, S.skin); R(15, 31, 2, 2, S.skin);
    }
    // neck + head
    R(8, 13, 4, 2, shade(S.skin));
    const hx = side ? (dir === 'e' ? 8 : 6) : 7;
    R(hx, 4, 6, 9, S.skin);
    // hair
    const hair = S.hair, hs = S.hairStyle;
    if (back) {
      R(hx - 1, 2, 8, 10, hair);
      if (hs === 'bob') R(hx - 1, 2, 8, 12, hair);
      if (hs === 'bun') { R(hx + 1, 1, 4, 3, hair); }
      if (hs === 'bald') { R(hx, 4, 6, 4, S.skin); R(hx - 1, 6, 8, 5, hair); }
    } else if (side) {
      const front = dir === 'e';
      if (hs !== 'bald') R(hx - (front ? 1 : 0), 2, 7, 3, hair);
      R(front ? hx - 1 : hx + 5, 3, 2, hs === 'bob' ? 10 : 6, hair);
      if (hs === 'bun') R(front ? hx - 3 : hx + 6, 3, 3, 3, hair);
      if (hs === 'wavy') { R(hx, 1, 5, 1, hair); }
      if (hs === 'bald') R(front ? hx - 1 : hx + 5, 6, 2, 4, hair);
      // face details
      const ex = front ? hx + 4 : hx + 1;
      if (!blink) R(ex, 7, 1, 1, '#1a1010');
      R(front ? hx + 6 : hx - 1, 8, 1, 2, S.skin); // nose
      if (S.mustache) R(front ? hx + 4 : hx, 10, 2, 1, S.mustache);
      if (S.stubble) R(front ? hx + 2 : hx, 11, 4, 2, S.stubble);
      R(front ? hx + 4 : hx + 1, 11, 1, talk ? 2 : 1, talk ? '#4a1010' : shade(S.skin));
    } else {
      if (hs !== 'bald') R(hx - 1, 2, 8, 3, hair);
      if (hs === 'wavy') { R(hx - 1, 4, 1, 4, hair); R(hx + 6, 4, 1, 4, hair); R(hx + 1, 1, 4, 1, hair); }
      if (hs === 'short' || hs === 'slick') { R(hx - 1, 4, 1, 3, hair); R(hx + 6, 4, 1, 3, hair); }
      if (hs === 'bob') { R(hx - 1, 4, 2, 9, hair); R(hx + 5, 4, 2, 9, hair); R(hx, 4, 3, 1, hair); }
      if (hs === 'bun') { R(hx + 1, 0, 4, 3, hair); R(hx - 1, 4, 1, 4, hair); R(hx + 6, 4, 1, 4, hair); }
      if (hs === 'bald') { R(hx - 1, 5, 1, 4, hair); R(hx + 6, 5, 1, 4, hair); }
      if (!blink) { R(hx + 1, 7, 1, 1, '#1a1010'); R(hx + 4, 7, 1, 1, '#1a1010'); }
      R(hx + 1, 6, 1, 1, shade(S.skin)); R(hx + 4, 6, 1, 1, shade(S.skin));
      R(hx + 2, 8, 2, 2, shade(S.skin));
      if (S.mustache) R(hx + 1, 10, 4, 1, S.mustache);
      if (S.stubble) { R(hx, 10, 1, 3, S.stubble); R(hx + 5, 10, 1, 3, S.stubble); R(hx + 1, 12, 4, 1, S.stubble); }
      R(hx + 2, 11, 2, talk ? 2 : 1, talk ? '#4a1010' : shade(S.skin));
    }
    if (S.collar && !back) R(side ? (dir === 'e' ? 11 : 7) : 9, 14, 2, 2, '#f0f0f0');
    spriteCache.set(key, c);
    return c;
  }

  function parseHex(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function toHex(r, g, b) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function shade(c) { if (c[0] !== '#') return c; const [r, g, b] = parseHex(c); return toHex(r * 0.72, g * 0.72, b * 0.72); }
  function hi(c) { if (c[0] !== '#') return c; const [r, g, b] = parseHex(c); return toHex(r * 1.2 + 10, g * 1.2 + 10, b * 1.2 + 10); }

  // Small inventory icons (16x16), drawn once.
  const ICONS = {
    notebook: g => { rect(g, 3, 2, 10, 13, '#3a5a8a'); rect(g, 4, 3, 8, 11, '#e8e4d8'); for (let y = 5; y < 13; y += 2) rect(g, 5, y, 6, 1, '#9aa0b0'); rect(g, 3, 2, 1, 13, '#2a3a5a'); },
    sketch: g => { rect(g, 2, 2, 12, 12, '#e8e4d8'); bellShape(g, 8, 4, 8, 5, '#3a3a3a', '#5a5a5a', '#2a2a2a'); for (let x = 3; x < 13; x++) px(g, x, 11 + Math.round(Math.sin(x)), '#3050a0'); },
    coins: g => { disc(g, 6, 9, 3, '#c8a040'); disc(g, 10, 8, 3, '#d8b850'); disc(g, 8, 11, 3, '#b89030'); px(g, 10, 7, '#f0e0a0'); },
    key: g => { disc(g, 5, 8, 3, '#6a6a6a'); disc(g, 5, 8, 1, '#202020'); rect(g, 8, 7, 7, 2, '#6a6a6a'); rect(g, 12, 9, 1, 2, '#6a6a6a'); rect(g, 14, 9, 1, 3, '#6a6a6a'); },
    ledger: g => { rect(g, 2, 2, 12, 13, '#5a2a14'); rect(g, 3, 3, 10, 11, '#7a3a1a'); rect(g, 12, 3, 1, 11, '#e8e0c8'); rect(g, 5, 6, 6, 1, '#c8a040'); rect(g, 5, 9, 6, 1, '#c8a040'); },
    magnifier: g => { disc(g, 6, 6, 4, '#c8a040'); disc(g, 6, 6, 3, '#b8d8e8'); px(g, 5, 5, '#ffffff'); line(g, 9, 9, 14, 14, '#5a3a1a'); line(g, 10, 9, 14, 13, '#5a3a1a'); },
    ginja: g => { for (const x of [3, 9]) { rect(g, x, 5, 5, 8, '#c8d8e0'); rect(g, x + 1, 7, 3, 5, '#8a1020'); rect(g, x, 13, 5, 1, '#c8d8e0'); } },
    clapper: g => { rect(g, 7, 1, 2, 9, '#6a5a2a'); disc(g, 8, 12, 3, '#7a6a30'); px(g, 7, 11, '#a89a50'); rect(g, 6, 1, 4, 2, '#5a4a20'); },
  };
  const iconCache = {};
  function icon(id) {
    if (!iconCache[id]) { const [c, g] = mkCanvas(16, 16); (ICONS[id] || (() => {}))(g); iconCache[id] = c; }
    return iconCache[id];
  }

  window.Art = { W, H, mkCanvas, BG, rect, px, glow, disc, line, poly, vgrad, dith, makeFog, drawSprite, SW, SH, icon, bellShape, rng };
})();
