// Atmosphere effects (fog, light, particles) and painted inventory icons.
(function () {
  const W = 1280, H = 720;
  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  // Tileable fog bank texture (2x scene width), scrolled every frame.
  function makeFog(seed, rgb, density) {
    const [c, g] = mk(W * 2, H);
    const r = rng(seed);
    const n = Math.round(70 * (density || 1));
    for (let i = 0; i < n; i++) {
      const x = r() * W * 2, y = H * 0.15 + r() * H * 0.85, rad = 60 + r() * 160;
      for (const dx of [0, -W * 2, W * 2]) {
        const gr = g.createRadialGradient(x + dx, y, 0, x + dx, y, rad);
        gr.addColorStop(0, `rgba(${rgb},0.30)`); gr.addColorStop(1, `rgba(${rgb},0)`);
        g.fillStyle = gr; g.beginPath(); g.ellipse(x + dx, y, rad * 2, rad * 0.55, 0, 0, Math.PI * 2); g.fill();
      }
    }
    return c;
  }
  function drawFog(g, tex, t, alpha, speed, yOff) {
    const o = (t * speed) % (W * 2);
    g.globalAlpha = alpha;
    g.drawImage(tex, -o, yOff || 0); g.drawImage(tex, W * 2 - o, yOff || 0);
    g.globalAlpha = 1;
  }
  // Additive light pool.
  function glow(g, x, y, r, rgb, a) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.restore();
  }
  function flicker(t, seed) { return 0.82 + 0.1 * Math.sin(t * 11 + seed) + 0.06 * Math.sin(t * 27 + seed * 3) + 0.04 * Math.sin(t * 53); }
  // Slanted light shaft through a window.
  // soft: the beam fades in from nothing at its top (a shaft out of open sky, with no window edge to start from)
  function shaft(g, pts, rgb, a, soft) {
    const gr = g.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1]);
    gr.addColorStop(0, `rgba(${rgb},${soft ? 0 : a})`); if (soft) gr.addColorStop(soft, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.closePath(); g.fill(); g.restore();
  }
  // Floating dust motes inside a rect.
  function motes(g, t, x, y, w, h, n, rgb) {
    const r = rng(77);
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const sx = r(), sy = r(), sp = 0.3 + r();
      const px = x + ((sx * w + Math.sin(t * 0.3 * sp + i) * 20) % w + w) % w;
      const py = y + ((sy * h - t * 6 * sp) % h + h) % h;
      g.fillStyle = `rgba(${rgb},${0.25 + 0.25 * Math.sin(t * 2 + i)})`;
      g.beginPath(); g.arc(px, py, 1.2 + r(), 0, 7); g.fill();
    }
    g.restore();
  }
  // Shimmering highlights on water.
  function water(g, t, x, y, w, h, rgb) {
    const r = rng(5);
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) {
      const bx = x + r() * w, by = y + r() * h, len = 8 + r() * 30;
      const a = 0.12 + 0.12 * Math.sin(t * (1 + r() * 2) + i);
      g.strokeStyle = `rgba(${rgb},${Math.max(0, a)})`; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(bx + Math.sin(t + i) * 6, by); g.lineTo(bx + len + Math.sin(t + i) * 6, by); g.stroke();
    }
    g.restore();
  }
  // Soft cloud bank (tileable, 2x wide) with an alpha lookup so a light can
  // dim when a cloud passes in front of it.
  function makeClouds(seed, rgb, n) {
    const w = W * 2, h = 360;
    const [c, g] = mk(w, h);
    const r = rng(seed);
    for (let i = 0; i < (n || 26); i++) {
      const x = r() * w, y = 20 + r() * 260, rx = 90 + r() * 200, ry = 18 + r() * 40;
      for (const dx of [0, -w, w]) for (let k = 0; k < 5; k++) {
        const px = x + dx + (r() - 0.5) * rx, py = y + (r() - 0.5) * ry;
        const gr = g.createRadialGradient(px, py, 0, px, py, rx * 0.6);
        gr.addColorStop(0, `rgba(${rgb},0.22)`); gr.addColorStop(1, `rgba(${rgb},0)`);
        g.fillStyle = gr; g.beginPath(); g.ellipse(px, py, rx * 0.6, ry, 0, 0, Math.PI * 2); g.fill();
      }
    }
    const data = g.getImageData(0, 0, w, h).data;
    return { c, w, h, alphaAt(x, y) {
      x = ((Math.round(x) % w) + w) % w;
      y = Math.max(0, Math.min(h - 1, Math.round(y)));
      return data[(y * w + x) * 4 + 3] / 255;
    } };
  }
  function cloudOffset(cl, t, speed) { return (t * speed) % cl.w; }
  function drawClouds(g, cl, t, speed, y, alpha) {
    const o = cloudOffset(cl, t, speed);
    g.globalAlpha = alpha; g.drawImage(cl.c, -o, y); g.drawImage(cl.c, cl.w - o, y); g.globalAlpha = 1;
  }
  // Draws `fn` into a scratch canvas and keeps only what falls inside a mask
  // image (e.g. the sky between the arches), then puts it on the scene.
  const [maskC, maskG] = mk(W, H);
  function masked(g, mask, fn) {
    maskG.globalCompositeOperation = 'source-over'; maskG.clearRect(0, 0, W, H);
    fn(maskG);
    if (mask) { maskG.globalCompositeOperation = 'destination-in'; maskG.drawImage(mask, 0, 0, W, H); maskG.globalCompositeOperation = 'source-over'; }
    g.drawImage(maskC, 0, 0);
  }
  // Birds crossing the sky (flapping V silhouettes), deterministic in time.
  function birds(g, t, opts) {
    const { y0, y1, n, period, color, size, x0, x1 } = Object.assign({ y0: 40, y1: 200, n: 3, period: 26, color: 'rgba(30,30,40,0.7)', size: 7, x0: -60, x1: W + 60 }, opts);
    const cycle = Math.floor(t / period), p = (t % period) / period;
    const r = rng(cycle * 97 + 13);
    const dir = r() < 0.5 ? 1 : -1, base = y0 + r() * (y1 - y0);
    if (r() < 0.35) return; // empty sky some of the time
    g.save(); g.strokeStyle = color; g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const lag = i * 0.03 + r() * 0.02;
      const q = p - lag; if (q < 0 || q > 1) continue;
      const x = dir > 0 ? x0 + (x1 - x0) * q : x1 - (x1 - x0) * q;
      const y = base + i * 9 * (r() - 0.3) + Math.sin(t * 1.3 + i) * 6;
      const s = size * (0.8 + r() * 0.4), flap = Math.sin(t * 11 + i * 2);
      g.lineWidth = Math.max(1.2, s * 0.22);
      g.beginPath();
      g.moveTo(x - s, y - flap * s * 0.6);
      g.quadraticCurveTo(x - s * 0.4, y - s * 0.2, x, y);
      g.quadraticCurveTo(x + s * 0.4, y - s * 0.2, x + s, y - flap * s * 0.6);
      g.stroke();
    }
    g.restore();
  }
  // Rising steam or smoke wisps from a point.
  function wisps(g, t, x, y, opts) {
    const { n, rise, spread, rgb, a, size, speed } = Object.assign({ n: 6, rise: 70, spread: 10, rgb: '255,255,255', a: 0.14, size: 9, speed: 0.35 }, opts);
    g.save(); g.globalCompositeOperation = opts && opts.dark ? 'source-over' : 'lighter';
    for (let i = 0; i < n; i++) {
      const p = ((t * speed + i / n) % 1);
      const px = x + Math.sin(t * 1.7 + i * 2.1 + p * 5) * spread * p, py = y - p * rise;
      const rad = size * (0.5 + p * 1.6);
      const gr = g.createRadialGradient(px, py, 0, px, py, rad);
      const al = a * Math.sin(p * Math.PI);
      gr.addColorStop(0, `rgba(${rgb},${al.toFixed(3)})`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(px, py, rad, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }
  // Embers/sparks drifting up from a torch.
  function embers(g, t, x, y, n) {
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const sp = 0.4 + (i * 0.37) % 0.5, p = (t * sp + i * 0.61) % 1;
      const px = x + Math.sin(t * 3 + i * 7) * 8 * p + (i % 3 - 1) * 4, py = y - p * 90;
      g.fillStyle = `rgba(255,${150 + (i * 40) % 90},60,${(1 - p) * 0.8})`;
      g.beginPath(); g.arc(px, py, 1.3, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }
  // Drips falling into water, each leaving spreading ripple rings.
  function drips(g, t, spots, rgb) {
    g.save();
    spots.forEach(([x, y, top, per], i) => {
      const p = ((t + i * 1.7) % per) / per; // fall takes the first 12% of the period
      if (p < 0.12) {
        const q = p / 0.12, dy = top + (y - top) * q * q;
        g.fillStyle = `rgba(${rgb},0.55)`; g.beginPath(); g.ellipse(x, dy, 1.2, 2.6, 0, 0, Math.PI * 2); g.fill();
      } else {
        const q = (p - 0.12) / 0.5;
        if (q < 1) for (let k = 0; k < 3; k++) {
          const r = (q - k * 0.12) * 46; if (r <= 0) continue;
          g.strokeStyle = `rgba(${rgb},${(0.35 * (1 - q)).toFixed(3)})`; g.lineWidth = 1.2;
          g.beginPath(); g.ellipse(x, y, r, r * 0.22, 0, 0, Math.PI * 2); g.stroke();
        }
      }
    });
    g.restore();
  }
  // Dry leaves skittering across a floor now and then.
  function leaves(g, t, y0, y1, period) {
    const cycle = Math.floor(t / period), p = (t % period) / period;
    const r = rng(cycle * 31 + 7);
    if (r() < 0.4) return;
    const n = 2 + Math.floor(r() * 3), base = y0 + r() * (y1 - y0);
    g.save();
    for (let i = 0; i < n; i++) {
      const q = p * (1.1 + r() * 0.3) - i * 0.05; if (q < 0 || q > 1) continue;
      const x = -30 + (W + 60) * q, y = base + i * 14 - Math.abs(Math.sin(q * 30 + i)) * 10;
      g.save(); g.translate(x, y); g.rotate(t * 6 + i); g.fillStyle = ['#6a4a22', '#8a6a2a', '#5a3a1a'][i % 3];
      g.beginPath(); g.ellipse(0, 0, 5, 2.4, 0, 0, Math.PI * 2); g.fill();
      g.restore(); // (not setTransform: that threw away the parallax zoom the caller set)
    }
    g.restore();
  }
  // Redraws a region of the painting with each row shifted sideways (cloth in
  // the wind), more toward the free bottom edge.
  // up: the free edge is the top (a plant, a cypress, a flame), not the bottom (cloth hanging from a line)
  function sway(g, im, rect, t, amp, phase, up) {
    if (!im) return;
    const [x, y, w, h] = rect, k = im.width / W;
    for (let r = 0; r < h; r += 2) {
      const f = up ? 1 - r / h : r / h, dx = Math.sin(t * 1.6 + phase + f * 1.2) * amp * f * f;
      g.drawImage(im, x * k, (y + r) * k, w * k, 2 * k, x + dx, y + r, w, 2);
    }
  }
  // Slow rise and fall of a sleeping animal: scales a region upward from its base.
  function breathe(g, im, rect, t, amp, period) {
    if (!im) return;
    const [x, y, w, h] = rect, k = im.width / W;
    const s = 1 + amp * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 / period));
    g.drawImage(im, x * k, y * k, w * k, h * k, x - w * (s - 1) * 0.15, y + h - h * s, w * (1 + (s - 1) * 0.3), h * s);
  }

  // ---------------------------------------------------------------- small moving details (all drawn over the painting)
  // Rows of a region of the painting shifted by a travelling wave: a reflection on water, heat over a lamp.
  function ripple(g, im, rect, t, amp, k) {
    if (!im) return;
    const [x, y, w, h] = rect, s = im.width / W;
    for (let r = 0; r < h; r += 2) {
      const dx = Math.sin(t * 2.1 + (y + r) * k) * amp * (0.4 + 0.6 * r / h);
      g.drawImage(im, x * s, (y + r) * s, w * s, 2 * s, x + dx, y + r, w, 2);
    }
  }
  // Rows shifted with both ends held: a dust sheet or a tied curtain breathing in a draught.
  function billow(g, im, rect, t, amp, period) {
    if (!im) return;
    const [x, y, w, h] = rect, s = im.width / W;
    for (let r = 0; r < h; r += 2) {
      const f = r / h, dx = Math.sin(t * 2 * Math.PI / period + f * 1.5) * amp * Math.sin(Math.PI * f);
      g.drawImage(im, x * s, (y + r) * s, w * s, 2 * s, x + dx, y + r, w, 2);
    }
  }
  // A small live flame standing on its wick at (x, y), h tall: it breathes and leans.
  function flame(g, t, x, y, h, seed, rgb) {
    const s = seed || 0, c = rgb || '255,180,90';
    const hh = h * (0.85 + 0.09 * Math.sin(13 * t + s) + 0.06 * Math.sin(31 * t + 2 * s));
    const lean = (0.12 * Math.sin(2.3 * t + s) + 0.05 * Math.sin(9 * t + 3 * s)) * h, w = h * 0.28;
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(x, y - hh * 0.3, 0, x, y - hh * 0.3, hh * 0.8);
    gr.addColorStop(0, 'rgba(255,248,222,0.85)'); gr.addColorStop(0.45, `rgba(${c},0.5)`); gr.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(x, y);
    g.bezierCurveTo(x - w, y - hh * 0.25, x - w * 0.5 + lean * 0.6, y - hh * 0.75, x + lean, y - hh);
    g.bezierCurveTo(x + w * 0.5 + lean * 0.6, y - hh * 0.75, x + w, y - hh * 0.25, x, y);
    g.fill(); g.restore();
  }
  // Beads of condensation or rain running down a pane now and then, each leaving a faint trail.
  function trickles(g, t, rect, n, rgb, a) {
    const [x, y, w, h] = rect;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const per = 7 + (i * 3.7) % 9, cyc = Math.floor((t + i * 2.3) / per), p = ((t + i * 2.3) % per) / per, r = rng(cyc * 131 + i * 17);
      const bx = x + r() * w, by = y + r() * h * 0.5, len = h * (0.25 + r() * 0.5);
      const q = p < 0.55 ? 0 : Math.min(1, Math.pow((p - 0.55) / 0.35, 1.6)), fade = p > 0.9 ? 1 - (p - 0.9) / 0.1 : 1;
      const cy = by + len * q, cx = bx + Math.sin(cy * 0.3) * 1.5;
      if (q > 0) { g.strokeStyle = `rgba(${rgb},${(a * 0.35 * fade).toFixed(3)})`; g.lineWidth = 1; g.beginPath(); g.moveTo(bx, by); g.lineTo(cx, cy); g.stroke(); }
      g.fillStyle = `rgba(${rgb},${(a * fade).toFixed(3)})`; g.beginPath(); g.ellipse(cx, cy, 1.4, 2, 0, 0, 7); g.fill();
    }
    g.restore();
  }
  // Rain falling past a window or an opening: short slanted streaks.
  function rain(g, t, rect, n, rgb, a) {
    const [x, y, w, h] = rect, r = rng(41);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = `rgba(${rgb},${a})`; g.lineWidth = 1;
    g.beginPath();
    for (let i = 0; i < n; i++) {
      const sx = r(), sp = 0.8 + r() * 0.4, py = y + ((r() * h + t * 420 * sp) % (h + 20)) - 10, px = x + ((sx * w - (py - y) * 0.18) % w + w) % w;
      g.moveTo(px, py); g.lineTo(px - 1.6, py + 9);
    }
    g.stroke(); g.restore();
  }
  // A moth (or, darker, a fly) on a jittery orbit round a light.
  function moth(g, t, cx, cy, rx, ry, seed, col) {
    const s = seed || 0, x = cx + Math.sin(2.2 * t + s) * rx + Math.sin(5.3 * t + s) * rx * 0.25, y = cy + Math.sin(3.74 * t + 1 + s) * ry + Math.sin(7.1 * t) * ry * 0.3;
    const wing = 0.6 + 1.4 * Math.abs(Math.sin(38 * t));
    g.save(); g.fillStyle = col || 'rgba(225,215,190,0.75)';
    g.beginPath(); g.ellipse(x - 1.2, y, 1.6, wing, 0.3, 0, 7); g.ellipse(x + 1.2, y, 1.6, wing, -0.3, 0, 7); g.fill(); g.restore();
  }
  // Lit windows far off, one now and then going dark for a while.
  function twinkle(g, t, pts, rgb) {
    pts.forEach(([x, y, r0], i) => {
      const cyc = Math.floor((t + i * 5.1) / 23), off = rng(cyc * 59 + i * 7)() < 0.15;
      if (!off) glow(g, x, y, (r0 || 3) * 2.2, rgb, 0.3 * (0.9 + 0.1 * Math.sin(t * 0.7 + i)));
    });
  }
  // Leaf shadows drifting on a sunlit floor.
  function dapple(g, t, rect, n, a) {
    const [x, y, w, h] = rect, r = rng(23);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = `rgba(20,25,15,${a})`;
    for (let i = 0; i < n; i++) {
      const rad = 8 + r() * 14, px = x + r() * w + Math.sin(t * 0.6 + i * 1.7) * 6, py = y + r() * h + Math.sin(t * 0.45 + i) * 3;
      g.beginPath(); g.ellipse(px, py, rad, rad * 0.45, 0, 0, 7); g.fill();
    }
    g.restore();
  }
  // Someone walking past behind frosted glass now and then: a soft head and body crossing.
  function passer(g, t, rect, period, seed) {
    const [x, y, w, h] = rect, cyc = Math.floor(t / period), p = (t % period) / period, r = rng(cyc * 71 + (seed || 0));
    if (r() > 0.6) return;
    const start = r() * 0.6, dur = 0.12 + r() * 0.08, q = (p - start) / dur; if (q < 0 || q > 1) return;
    const dir = r() < 0.5, px = dir ? x - 30 + (w + 60) * q : x + w + 30 - (w + 60) * q;
    const blob = (cx, cy, rad) => { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad); gr.addColorStop(0, 'rgba(40,38,36,0.26)'); gr.addColorStop(1, 'rgba(40,38,36,0)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill(); };
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); blob(px, y + h * 0.28, h * 0.14); blob(px, y + h * 0.62, h * 0.3); g.restore();
  }
  // A band of passing headlights sweeping across blinds now and then.
  function sweep(g, t, rect, period, rgb, a) {
    const [x, y, w, h] = rect, p = (t % period) / period; if (p > 0.08) return;
    const bx = x - 100 + (w + 200) * (p / 0.08), gr = g.createLinearGradient(bx - 50, 0, bx + 50, 0);
    gr.addColorStop(0, `rgba(${rgb},0)`); gr.addColorStop(0.5, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(bx - 50, y, 100, h); g.restore();
  }
  // A feather spiralling down now and then.
  function feather(g, t, x, y, period, fall) {
    const cyc = Math.floor(t / period), p = (t % period) / period, r = rng(cyc * 13 + 5); if (r() < 0.5) return;
    const px = x + Math.sin(p * 9) * 18 + r() * 20 - 10, py = y + fall * p;
    g.save(); g.translate(px, py); g.rotate(Math.sin(p * 9) * 0.9); g.fillStyle = `rgba(235,232,225,${(0.8 * Math.min(1, (1 - p) * 4)).toFixed(3)})`;
    g.beginPath(); g.ellipse(0, 0, 4, 1.4, 0, 0, 7); g.fill(); g.restore();
  }
  // A small electric fan running: translucent blades turning inside its cage.
  function fan(g, t, x, y, rx, ry) {
    g.save(); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.clip();
    g.fillStyle = 'rgba(60,65,60,0.06)'; g.fill();
    g.translate(x, y); g.scale(rx / ry, 1); g.fillStyle = 'rgba(60,65,60,0.12)';
    for (let i = 0; i < 3; i++) { const a = t * 8 * Math.PI * 2 + i * Math.PI * 2 / 3; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, ry, a, a + 0.7); g.closePath(); g.fill(); }
    g.restore();
  }

  function vignette(g, a) {
    const gr = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }

  // ---------------------------------------------------------------- icons
  // Painted 96x96 inventory icons: warm ink outlines, light from the top left,
  // a highlight on every hard surface and a little texture on soft ones.
  const INK = '#1d140e';
  function lg(g, x0, y0, x1, y1, ...stops) {
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
    return gr;
  }
  function rg(g, x, y, r0, r1, ...stops) {
    const gr = g.createRadialGradient(x, y, r0, x, y, r1);
    stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
    return gr;
  }
  function poly(g, pts) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); }
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function fillInk(g, fill, lw) { g.fillStyle = fill; g.fill('evenodd'); g.strokeStyle = INK; g.lineWidth = lw || 2; g.lineJoin = 'round'; g.stroke(); }
  function line(g, a, b, c, d) { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); }
  function shine(g, pts, w, a) {
    g.save();
    g.shadowColor = 'transparent';
    g.strokeStyle = `rgba(255,255,255,${a || 0.55})`;
    g.lineWidth = w || 2;
    g.lineCap = 'round';
    g.beginPath();
    pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
    g.stroke();
    g.restore();
  }
  function speckle(g, seed, n, x, y, w, h, col, s) {
    const r = rng(seed);
    g.save();
    g.shadowColor = 'transparent';
    g.fillStyle = col;
    for (let i = 0; i < n; i++) g.fillRect(x + r() * w, y + r() * h, s || 1, s || 1);
    g.restore();
  }
  function noShadow(g, fn) { g.save(); g.shadowColor = 'transparent'; fn(); g.restore(); }
  // a key: ring bow, shaft and a bit, in iron or brass
  function keyShape(g, c, ring, len, ornate) {
    const [hi, mid, lo] = c;
    g.beginPath(); g.arc(0, 0, ring, 0, 7); g.arc(0, 0, ring * 0.48, 0, 7, true);
    if (ornate) for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4;
      g.moveTo(Math.cos(a) * ring * 1.3 + 3, Math.sin(a) * ring * 1.3);
      g.arc(Math.cos(a) * ring * 1.3, Math.sin(a) * ring * 1.3, 3, 0, 7);
    }
    fillInk(g, lg(g, -ring, -ring, ring, ring, hi, mid, lo));
    poly(g, [[ring - 2, -3.5], [ring + len, -3.5], [ring + len, 3.5], [ring - 2, 3.5]]); fillInk(g, lg(g, 0, -4, 0, 4, hi, mid, lo));
    poly(g, [[ring + len - 16, 3], [ring + len - 16, 13], [ring + len - 11, 13], [ring + len - 11, 8], [ring + len - 6, 8], [ring + len - 6, 15], [ring + len, 15], [ring + len, 3]]);
    fillInk(g, lg(g, 0, 3, 0, 15, mid, lo));
    shine(g, [[ring + 2, -1.8], [ring + len - 3, -1.8]], 1.4, 0.5); shine(g, [[-ring * 0.7, -ring * 0.45], [-ring * 0.2, -ring * 0.85]], 2, 0.5);
  }
  function clapper(g, blood) {
    g.translate(48, 46); g.rotate(0.42); g.scale(0.92, 0.92);
    const bronze = ['#f4d48a', '#b8863a', '#6a4618', '#3a2408'];
    // loop on top, shaft, then the heavy ball
    g.beginPath(); g.ellipse(0, -36, 7, 6, 0, 0, 7); g.ellipse(0, -36, 3, 2.6, 0, 0, 7); fillInk(g, lg(g, -7, -42, 7, -30, ...bronze));
    poly(g, [[-4.5, -31], [4.5, -31], [6.5, 10], [-6.5, 10]]); fillInk(g, lg(g, -6, 0, 6, 0, bronze[1], bronze[0], bronze[2], bronze[3]));
    g.beginPath(); g.ellipse(0, 24, 16, 18, 0, 0, 7); fillInk(g, rg(g, -6, 16, 1, 22, bronze[0], bronze[1], bronze[2], bronze[3]));
    g.beginPath(); g.ellipse(0, 8.5, 7, 3, 0, 0, 7); fillInk(g, lg(g, -7, 0, 7, 0, bronze[1], bronze[0], bronze[2]), 1.5);
    noShadow(g, () => {
      g.fillStyle = 'rgba(90,170,140,0.45)';
      for (const [x, y, r] of [[5, 28, 3.5], [-6, 30, 2.5], [2, -12, 1.8], [-2, -24, 1.5]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    });
    shine(g, [[-6, 14], [-8, 22], [-5, 30]], 2.5, 0.6); shine(g, [[-2, -28], [-2.5, 4]], 1.4, 0.55);
    if (blood) noShadow(g, () => {
      g.fillStyle = 'rgba(150,10,14,0.9)';
      g.beginPath();
      g.moveTo(-9, 16);
      g.bezierCurveTo(-2, 10, 10, 14, 11, 22);
      g.bezierCurveTo(8, 26, 4, 24, 2, 30);
      g.bezierCurveTo(0, 36, -3, 34, -3, 28);
      g.bezierCurveTo(-6, 24, -12, 22, -9, 16);
      g.fill();
      g.beginPath(); g.ellipse(-1, 40, 2.4, 3.4, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,200,200,0.5)'; g.beginPath(); g.ellipse(-3, 17, 3, 1.4, -0.4, 0, 7); g.fill();
    });
  }
  function liqueurGlass(g, x, fill) {
    // a small faceted tumbler; `fill` paints the liquid band
    poly(g, [[x - 14, 28], [x + 14, 28], [x + 10, 76], [x - 10, 76]]);
    g.fillStyle = 'rgba(215,232,240,0.28)'; g.fill();
    if (fill) fill(x);
    poly(g, [[x - 14, 28], [x + 14, 28], [x + 10, 76], [x - 10, 76]]); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
    g.beginPath(); g.ellipse(x, 28, 14, 3.5, 0, 0, 7); g.strokeStyle = 'rgba(30,20,14,0.85)'; g.lineWidth = 1.5; g.stroke();
    noShadow(g, () => {
      g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 1; for (const k of [-0.45, 0, 0.45]) line(g, x + k * 26, 30, x + k * 19, 74);
      g.beginPath(); g.ellipse(x, 76, 10, 2.5, 0, 0, 7); g.fillStyle = 'rgba(255,255,255,0.25)'; g.fill();
    });
    shine(g, [[x - 10, 33], [x - 7.5, 70]], 2.5, 0.6);
  }
  const ICONS = {
    // the wet azulejo from Zé's bunk: blue sea-monster on white, a little crazed
    bunktile(g) {
      g.translate(48, 48); g.rotate(-0.1); g.translate(-48, -48);
      rr(g, 18, 18, 60, 60, 3); fillInk(g, lg(g, 18, 18, 78, 78, '#ffffff', '#eef2f6', '#c9d3de'));
      noShadow(g, () => {
        g.strokeStyle = '#1f4fa8'; g.lineWidth = 2.2; g.lineCap = 'round';
        rr(g, 23, 23, 50, 50, 2); g.stroke();
        g.beginPath(); g.moveTo(30, 54); g.bezierCurveTo(34, 40, 44, 52, 48, 42); g.bezierCurveTo(52, 32, 62, 38, 64, 30); g.stroke();
        g.beginPath(); g.arc(64, 30, 3, 0, 7); g.fillStyle = '#1f4fa8'; g.fill();
        for (const y of [60, 66]) { g.beginPath(); for (let x = 28; x <= 68; x += 2) g.lineTo(x, y + Math.sin(x / 3.4 + y) * 2); g.stroke(); }
        g.strokeStyle = 'rgba(70,90,120,0.35)'; g.lineWidth = 0.8; line(g, 40, 20, 46, 40); line(g, 46, 40, 58, 46);
        g.fillStyle = 'rgba(120,170,230,0.25)'; g.beginPath(); g.ellipse(58, 70, 12, 4, 0, 0, 7); g.fill(); // still wet
      });
      shine(g, [[22, 30], [22, 52]], 2, 0.6);
    },
    notebook(g) {
      g.translate(48, 48); g.rotate(-0.12); g.translate(-48, -48);
      rr(g, 25, 14, 50, 70, 5); fillInk(g, '#e9dfc3');                     // page block peeking out
      noShadow(g, () => { g.strokeStyle = 'rgba(120,100,70,0.5)'; g.lineWidth = 0.8; for (let x = 70; x < 75; x += 1.6) line(g, x, 17, x, 81); });
      rr(g, 22, 12, 50, 70, 5); fillInk(g, lg(g, 22, 12, 72, 82, '#4f72a8', '#2c4a7c', '#16264a'));
      speckle(g, 7, 160, 24, 14, 46, 66, 'rgba(255,255,255,0.08)', 1.2);
      noShadow(g, () => { g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 1; rr(g, 26, 16, 42, 62, 3); g.stroke(); });
      g.fillStyle = '#141414'; g.fillRect(60, 11, 5, 72); g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(60, 11, 5, 72);
      shine(g, [[27, 20], [27, 60]], 2, 0.35);
      // pencil
      g.translate(48, 60); g.rotate(-0.65);
      poly(g, [[-30, -3.5], [16, -3.5], [16, 3.5], [-30, 3.5]]); fillInk(g, lg(g, 0, -4, 0, 4, '#ffe27a', '#e8b52a', '#a87410'), 1.5);
      poly(g, [[16, -3.5], [26, 0], [16, 3.5]]); fillInk(g, '#e8c89a', 1.5);
      poly(g, [[22.5, -1.2], [26, 0], [22.5, 1.2]]); g.fillStyle = '#2a2a2a'; g.fill();
      rr(g, -36, -3.5, 7, 7, 1); fillInk(g, lg(g, 0, -4, 0, 4, '#e0e0e0', '#9a9a9a', '#5a5a5a'), 1.2);
      rr(g, -42, -3.5, 7, 7, 2.5); fillInk(g, '#e88a8a', 1.2);
    },
    sketch(g) {
      g.translate(48, 48); g.rotate(0.06); g.translate(-48, -48);
      g.beginPath();
      g.moveTo(16, 18);
      for (let x = 16; x <= 80; x += 4) g.lineTo(x, 15 + (x % 8 ? 2 : -1));
      g.lineTo(80, 82);
      g.quadraticCurveTo(70, 78, 60, 83);
      g.lineTo(16, 82);
      g.closePath();
      fillInk(g, lg(g, 16, 14, 80, 84, '#fbf6e8', '#eee4cb', '#d8cba8'));
      speckle(g, 3, 90, 18, 18, 60, 62, 'rgba(120,100,60,0.18)', 1);
      noShadow(g, () => {
        g.strokeStyle = '#4a4a50'; g.lineWidth = 2; g.lineCap = 'round';
        g.beginPath();
        g.moveTo(37, 32);
        g.quadraticCurveTo(37, 22, 48, 22);
        g.quadraticCurveTo(59, 22, 59, 32);
        g.lineTo(63, 51);
        g.lineTo(33, 51);
        g.closePath();
        g.stroke();
        g.lineWidth = 1; for (let y = 28; y < 50; y += 3) line(g, 53 + (y - 28) * 0.18, y, 58 + (y - 28) * 0.22, y + 2); // pencil shading
        g.beginPath(); g.arc(48, 55, 3, 0, 7); g.stroke(); line(g, 48, 18, 48, 22);
        g.strokeStyle = '#2f55a8'; g.lineWidth = 2.4;
        for (const y of [62, 69, 76]) { g.beginPath(); for (let x = 22; x <= 74; x += 2) g.lineTo(x, y + Math.sin(x / 3.6 + y) * 2.6); g.stroke(); }
      });
    },
    coins(g) {
      const coin = (x, y, rx, ry) => {
        g.beginPath(); g.ellipse(x, y + 4, rx, ry, 0, 0, 7); fillInk(g, lg(g, x - rx, 0, x + rx, 0, '#7a5414', '#c99a3a', '#6a4410'), 1.5);
        noShadow(g, () => {
          g.strokeStyle = 'rgba(60,36,6,0.55)';
          g.lineWidth = 0.8;
          for (let k = -rx + 2; k < rx; k += 2.4) line(g, x + k, y + ry * Math.sqrt(1 - (k / rx) ** 2) - 0.5, x + k, y + 4 + ry * Math.sqrt(1 - (k / rx) ** 2) - 0.5);
        });
        g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); fillInk(g, lg(g, x - rx, y - ry, x + rx, y + ry, '#fff1b8', '#e0b24a', '#9a6a1c'), 1.5);
        g.beginPath(); g.ellipse(x, y, rx * 0.74, ry * 0.7, 0, 0, 7); g.strokeStyle = 'rgba(110,70,16,0.7)'; g.lineWidth = 1.2; g.stroke();
      };
      coin(36, 64, 19, 9); coin(36, 58, 19, 9); coin(36, 52, 19, 9);
      coin(62, 60, 17, 8);
      // the top coin, face up: a cifrão
      coin(52, 38, 22, 12);
      noShadow(g, () => {
        g.fillStyle = '#7a5010';
        g.font = 'bold 15px Georgia, serif';
        g.textAlign = 'center';
        g.fillText('1$', 52, 43);
        g.fillStyle = 'rgba(255,240,190,0.7)';
        g.fillText('1$', 51, 42);
      });
      shine(g, [[34, 33], [44, 29]], 2.2, 0.75);
    },
    key(g) {
      g.translate(30, 34); g.rotate(0.62);
      keyShape(g, ['#a8a49c', '#5e5a54', '#2a2826'], 13, 44);
      noShadow(g, () => {
        g.fillStyle = 'rgba(140,70,30,0.55)';
        for (const [x, y, r] of [[-8, 6, 2.5], [30, 1, 1.8], [46, 10, 2]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
      });
      // sugar crystals: grandfather kept it in the sugar tin
      noShadow(g, () => {
        const r = rng(5);
        for (let i = 0; i < 16; i++) {
          const x = 14 + r() * 40, y = -6 + r() * 12;
          g.fillStyle = `rgba(255,255,255,${0.6 + r() * 0.4})`;
          g.fillRect(x, y, 1.6 + r() * 1.4, 1.6 + r() * 1.4);
        }
      });
    },
    ledger(g) {
      g.translate(48, 48); g.rotate(-0.08); g.translate(-48, -48);
      // page block (thickness at bottom and right)
      poly(g, [[24, 16], [80, 16], [80, 84], [24, 84]]); fillInk(g, '#e6d8b4');
      noShadow(g, () => {
        g.strokeStyle = 'rgba(110,90,60,0.55)';
        g.lineWidth = 0.8;
        for (let x = 74; x < 80; x += 1.5) line(g, x, 18, x, 82);
        for (let y = 78; y < 84; y += 1.5) line(g, 26, y, 78, y);
      });
      rr(g, 16, 10, 58, 70, 3); fillInk(g, lg(g, 16, 10, 74, 80, '#9a4a26', '#6a2a14', '#3a120a'));
      speckle(g, 11, 220, 18, 12, 54, 66, 'rgba(0,0,0,0.18)', 1.3);
      speckle(g, 12, 80, 18, 12, 54, 66, 'rgba(255,220,180,0.12)', 1.3);
      // spine with raised bands
      rr(g, 12, 9, 12, 72, 3); fillInk(g, lg(g, 12, 0, 24, 0, '#3a120a', '#7a361a', '#2a0c06'));
      for (const y of [22, 40, 58]) { rr(g, 11, y, 14, 5, 2); fillInk(g, lg(g, 0, y, 0, y + 5, '#9a4a26', '#4a1a0c'), 1.2); }
      noShadow(g, () => { g.strokeStyle = '#d4aa50'; g.lineWidth = 1.6; g.strokeRect(30, 20, 36, 50); g.lineWidth = 0.8; g.strokeRect(33, 23, 30, 44);
        g.fillStyle = '#d4aa50';
        g.beginPath();
        g.moveTo(48, 36);
        g.quadraticCurveTo(48, 31, 52, 31);
        g.quadraticCurveTo(56, 31, 56, 36);
        g.lineTo(58, 46);
        g.lineTo(46, 46);
        g.closePath();
        g.fill(); });
      // brass corners
      for (const [x, y, sx, sy] of [[74, 10, -1, 1], [74, 80, -1, -1]]) { poly(g, [[x, y], [x + 11 * sx, y], [x, y + 11 * sy]]); fillInk(g, lg(g, x, y, x + 10 * sx, y + 10 * sy, '#f4d48a', '#a8782a'), 1.2); }
      shine(g, [[28, 14], [70, 14]], 1.5, 0.3);
    },
    magnifier(g) {
      g.translate(48, 48); g.rotate(0.78);
      rr(g, -6, 24, 12, 38, 5); fillInk(g, lg(g, -6, 0, 6, 0, '#a86a34', '#6a3a16', '#3a1c08'));
      for (const y of [34, 50]) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-6, y, 12, 2); }
      rr(g, -4.5, 18, 9, 9, 2); fillInk(g, lg(g, -5, 0, 5, 0, '#f4d48a', '#b8863a', '#6a4618'), 1.5);
      shine(g, [[-3, 28], [-3, 58]], 1.6, 0.45);
      g.rotate(-0.78);
      const [cx, cy] = [-14, -14];
      g.beginPath();
      g.arc(cx, cy, 25, 0, 7);
      g.arc(cx, cy, 19.5, 0, 7, true);
      fillInk(g, lg(g, cx - 25, cy - 25, cx + 25, cy + 25, '#fff0b0', '#d4a43a', '#7a5014'));
      g.beginPath();
      g.arc(cx, cy, 19.5, 0, 7);
      g.fillStyle = rg(g, cx - 6, cy - 7, 2, 22, 'rgba(255,255,255,0.75)', 'rgba(190,220,236,0.45)', 'rgba(110,150,180,0.5)');
      g.fill();
      noShadow(g, () => { g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, 14, Math.PI * 1.05, Math.PI * 1.45); g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(cx + 8, cy + 8, 2, 0, 7); g.fill(); });
    },
    ginja(g) {
      for (const x of [30, 64]) liqueurGlass(g, x, x => {
        poly(g, [[x - 12.3, 40], [x + 12.3, 40], [x + 9.6, 74], [x - 9.6, 74]]); g.fillStyle = lg(g, 0, 40, 0, 74, '#e0405a', '#a01028', '#4a0410'); g.fill();
        g.beginPath(); g.ellipse(x, 40, 12.3, 3, 0, 0, 7); g.fillStyle = '#ff7088'; g.fill();
        g.beginPath(); g.arc(x + 3, 58, 4.5, 0, 7); g.fillStyle = rg(g, x + 1.5, 56.5, 0.5, 5, '#ff8a9a', '#7a0818'); g.fill();
      });
    },
    matches(g) {
      g.translate(48, 50); g.rotate(-0.14); g.translate(-48, -50);
      // the drawer, slid open, full of red heads
      rr(g, 52, 34, 34, 34, 2); fillInk(g, lg(g, 52, 34, 86, 68, '#e8dcc0', '#c8b890'));
      noShadow(g, () => {
        for (let i = 0; i < 7; i++) {
          g.fillStyle = '#d8b880';
          g.fillRect(56 + i * 4, 38, 2.4, 26);
          g.fillStyle = '#b8201a';
          g.beginPath();
          g.ellipse(57.2 + i * 4, 66, 2, 2.6, 0, 0, 7);
          g.fill();
        }
      });
      // the sleeve, blue lid with a sailing ship
      rr(g, 12, 30, 52, 40, 3); fillInk(g, lg(g, 12, 30, 64, 70, '#3a64b0', '#22427e', '#142a54'));
      poly(g, [[12, 64], [64, 64], [64, 70], [12, 70]]); g.fillStyle = '#6a4a2a'; g.fill(); speckle(g, 4, 60, 13, 64, 50, 6, 'rgba(0,0,0,0.5)', 1);
      noShadow(g, () => {
        g.strokeStyle = '#f3e6c4'; g.lineWidth = 1.4; rr(g, 16, 34, 44, 27, 2); g.stroke();
        g.fillStyle = '#f3e6c4';
        g.beginPath(); g.moveTo(24, 52); g.lineTo(52, 52); g.lineTo(48, 57); g.lineTo(28, 57); g.closePath(); g.fill();      // hull
        g.fillRect(37.4, 37, 1.2, 15);
        g.beginPath(); g.moveTo(36.5, 38); g.lineTo(36.5, 50); g.lineTo(27, 50); g.closePath(); g.fill();                     // sails
        g.beginPath(); g.moveTo(39.5, 39); g.lineTo(39.5, 50); g.lineTo(48, 50); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(243,230,196,0.8)';
        g.lineWidth = 1;
        g.beginPath();
        for (let x = 20; x <= 56; x += 2) g.lineTo(x, 58.5 + Math.sin(x / 2) * 0.8);
        g.stroke();
      });
      shine(g, [[15, 33], [60, 33]], 1.5, 0.35);
    },
    glass(g) {
      liqueurGlass(g, 48, x => { g.beginPath(); g.ellipse(x, 73, 9, 2.4, 0, 0, 7); g.fillStyle = 'rgba(130,10,30,0.75)'; g.fill();
        g.fillStyle = 'rgba(150,20,40,0.45)'; g.fillRect(x + 6, 30, 2, 10); });
    },
    holywater(g) {
      noShadow(g, () => { g.fillStyle = rg(g, 48, 50, 4, 40, 'rgba(200,230,255,0.45)', 'rgba(200,230,255,0)'); g.fillRect(0, 0, 96, 96); });
      liqueurGlass(g, 48, x => {
        poly(g, [[x - 12.3, 40], [x + 12.3, 40], [x + 9.6, 74], [x - 9.6, 74]]);
        g.fillStyle = lg(g, 0, 40, 0, 74, 'rgba(190,228,255,0.85)', 'rgba(90,150,220,0.85)');
        g.fill();
        g.beginPath(); g.ellipse(x, 40, 12.3, 3, 0, 0, 7); g.fillStyle = 'rgba(230,245,255,0.95)'; g.fill();
      });
      noShadow(g, () => {
        g.fillStyle = '#fff';
        for (const [x, y, s] of [[40, 52, 1.6], [55, 60, 1.2], [48, 66, 1], [61, 22, 2], [34, 18, 1.5]]) {
          g.beginPath();
          g.moveTo(x, y - s * 3);
          g.lineTo(x + s, y);
          g.lineTo(x, y + s * 3);
          g.lineTo(x - s, y);
          g.closePath();
          g.fill();
        }
      });
    },
    coffee(g) {
      // saucer
      g.beginPath(); g.ellipse(48, 74, 34, 9, 0, 0, 7); fillInk(g, lg(g, 14, 66, 82, 82, '#ffffff', '#d8d2c4', '#a8a090'));
      g.beginPath(); g.ellipse(48, 73, 22, 5, 0, 0, 7); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fill();
      // handle, cup, coffee
      g.beginPath();
      g.ellipse(70, 52, 9, 8, 0, -1.4, 1.4);
      g.strokeStyle = INK;
      g.lineWidth = 7;
      g.stroke();
      g.strokeStyle = '#e8e2d4';
      g.lineWidth = 4;
      g.stroke();
      g.beginPath();
      g.moveTo(26, 38);
      g.lineTo(70, 38);
      g.bezierCurveTo(70, 62, 62, 74, 48, 74);
      g.bezierCurveTo(34, 74, 26, 62, 26, 38);
      fillInk(g, lg(g, 26, 0, 70, 0, '#ffffff', '#f2ede2', '#b8b0a0'));
      g.beginPath(); g.ellipse(48, 38, 22, 6, 0, 0, 7); fillInk(g, '#f6f2ea', 1.5);
      g.beginPath(); g.ellipse(48, 39, 19, 4.5, 0, 0, 7); g.fillStyle = rg(g, 44, 38, 1, 19, '#a8703a', '#5a3014', '#2a1206'); g.fill();
      noShadow(g, () => { g.strokeStyle = 'rgba(200,150,90,0.6)'; g.lineWidth = 1; g.beginPath(); g.ellipse(46, 38.6, 9, 2, 0, 0, 7); g.stroke(); });
      noShadow(g, () => {
        g.strokeStyle = 'rgba(255,255,255,0.5)';
        g.lineWidth = 2.5;
        g.lineCap = 'round';
        for (const x of [40, 49, 57]) { g.beginPath(); g.moveTo(x, 31); g.bezierCurveTo(x - 6, 24, x + 6, 18, x - 1, 8); g.stroke(); }
      });
      shine(g, [[31, 44], [33, 60]], 3, 0.8);
    },
    file55(g) {
      g.translate(48, 48); g.rotate(0.05); g.translate(-48, -48);
      // back of the folder with its tab
      poly(g, [[14, 18], [36, 18], [40, 12], [62, 12], [64, 18], [82, 18], [82, 84], [14, 84]]); fillInk(g, lg(g, 14, 12, 82, 84, '#dcc28a', '#b8985a'));
      rr(g, 20, 14, 56, 64, 1); fillInk(g, '#f4eedc', 1.2);                                    // papers
      noShadow(g, () => { g.fillStyle = 'rgba(40,40,40,0.65)'; for (let y = 20; y < 40; y += 4) g.fillRect(25, y, 26 + ((y * 7) % 18), 1.4); });
      poly(g, [[12, 30], [84, 30], [82, 86], [14, 86]]); fillInk(g, lg(g, 12, 30, 84, 86, '#ecd49a', '#c8a464', '#9a7a3e'));   // front flap
      speckle(g, 21, 90, 14, 32, 68, 52, 'rgba(110,80,30,0.25)', 1.2);
      rr(g, 24, 40, 40, 12, 1); fillInk(g, '#f8f4e8', 1.2);
      noShadow(g, () => { g.fillStyle = '#222'; g.font = 'bold 9px "Courier New", monospace'; g.textAlign = 'center'; g.fillText('55/114', 44, 49); g.textAlign = 'left';
        g.save();
        g.translate(50, 70);
        g.rotate(-0.18);
        g.strokeStyle = 'rgba(180,20,20,0.85)';
        g.lineWidth = 2;
        g.strokeRect(-24, -8, 48, 15);
        g.fillStyle = 'rgba(180,20,20,0.85)';
        g.font = 'bold 8px sans-serif';
        g.textAlign = 'center';
        g.fillText('ARQUIVADO', 0, 2.5);
        g.restore(); });
      // paper clip
      noShadow(g, () => {
        g.strokeStyle = '#9aa0a8';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(70, 34);
        g.lineTo(70, 16);
        g.arc(74, 16, 4, Math.PI, 0);
        g.lineTo(78, 36);
        g.arc(75, 36, 3, 0, Math.PI);
        g.lineTo(72, 22);
        g.stroke();
      });
    },
    fkey(g) {
      // a dead man's shop key with its paper luggage tag
      noShadow(g, () => {
        g.strokeStyle = '#8a7a5a';
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(26, 36);
        g.bezierCurveTo(30, 48, 44, 50, 50, 58);
        g.stroke();
      });
      g.save(); g.translate(56, 66); g.rotate(-0.35);
      poly(g, [[-6, -12], [24, -12], [24, 12], [-6, 12], [-14, 0]]); fillInk(g, lg(g, -14, -12, 24, 12, '#f4e8c8', '#d8c498'), 1.5);
      g.beginPath(); g.arc(-7, 0, 2.4, 0, 7); g.fillStyle = INK; g.fill();
      noShadow(g, () => { g.fillStyle = '#2a2a6a'; g.font = 'italic bold 8px Georgia, serif'; g.fillText('Ferreira', -3, 3); });
      g.restore();
      g.translate(26, 30); g.rotate(0.15);
      keyShape(g, ['#a8a49c', '#5e5a54', '#2a2826'], 12, 46);
    },
    tidecard(g) {
      g.translate(48, 48); g.rotate(-0.06); g.translate(-48, -48);
      rr(g, 14, 16, 68, 64, 3); fillInk(g, lg(g, 14, 16, 82, 80, '#fbf5e4', '#eadfc2'));
      poly(g, [[14, 16], [82, 16], [82, 30], [14, 30]]); g.fillStyle = '#2f55a8'; g.fill();
      noShadow(g, () => {
        g.strokeStyle = '#f4eedc'; g.lineWidth = 1.6; g.beginPath(); for (let x = 18; x <= 78; x += 2) g.lineTo(x, 23 + Math.sin(x / 3.2) * 2.4); g.stroke();
        g.strokeStyle = 'rgba(60,40,20,0.3)';
        g.lineWidth = 0.8;
        for (let y = 36; y < 78; y += 6) line(g, 17, y, 79, y);
        line(g, 36, 31, 36, 78);
        line(g, 58, 31, 58, 78);
        g.fillStyle = '#2a2a4a'; for (let y = 34.5; y < 76; y += 6) for (const x of [19, 39, 61]) g.fillRect(x, y, 12 + ((x + y) % 5), 1.6);
        g.strokeStyle = 'rgba(190,20,20,0.85)'; g.lineWidth = 1.8; g.beginPath(); g.ellipse(48, 57, 12, 5, -0.08, 0, 7); g.stroke();
      });
    },
    // the Brotherhood's charter: a rolled parchment with a sea-green wax seal
    brotherhood_charter(g) {
      g.translate(48, 48); g.rotate(-0.5); g.translate(-48, -48);
      rr(g, 20, 34, 58, 30, 4); fillInk(g, lg(g, 20, 34, 78, 64, '#f3e6c4', '#dcc79a', '#b89c68'));
      for (const x of [20, 78]) { g.beginPath(); g.ellipse(x, 49, 5, 15, 0, 0, 7); fillInk(g, lg(g, x - 5, 34, x + 5, 64, '#e8d6ac', '#b09060')); }
      noShadow(g, () => { g.strokeStyle = 'rgba(90,60,30,0.35)'; g.lineWidth = 1; for (const y of [41, 47, 53]) line(g, 30, y, 66, y); });
      g.beginPath(); g.arc(50, 60, 9, 0, 7); fillInk(g, lg(g, 41, 51, 59, 69, '#5aa08c', '#24604e'));
      noShadow(g, () => {
        g.strokeStyle = 'rgba(220,255,240,0.6)';
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(46, 61);
        g.quadraticCurveTo(50, 53, 54, 61);
        g.stroke();
        line(g, 44, 64, 56, 64);
      });
    },
    // Dr. Teles's card: cream board, the Sé's seal, a pencilled 'quinta'
    vasco_card(g) {
      g.translate(48, 48); g.rotate(-0.12); g.translate(-48, -48);
      rr(g, 14, 28, 68, 40, 3); fillInk(g, lg(g, 14, 28, 82, 68, '#fbf6e6', '#e8dcc0'));
      noShadow(g, () => {
        g.strokeStyle = '#7a1d24'; g.lineWidth = 1.6; g.beginPath(); g.arc(28, 42, 6, 0, 7); g.stroke(); line(g, 28, 36, 28, 48);
        g.fillStyle = '#3a3a4a'; g.fillRect(40, 38, 32, 2.2); g.fillRect(40, 44, 24, 1.6); g.fillRect(22, 54, 44, 1.4);
        g.strokeStyle = 'rgba(60,60,70,0.7)';
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(52, 62);
        g.quadraticCurveTo(58, 57, 64, 61);
        g.quadraticCurveTo(70, 64, 76, 59);
        g.stroke();
      });
    },
    // a curved shard of old bell bronze, green with age, one edge bright where it broke
    sanches_fragment(g) {
      g.beginPath();
      g.moveTo(22, 64);
      g.quadraticCurveTo(30, 30, 62, 24);
      g.lineTo(74, 34);
      g.lineTo(66, 44);
      g.quadraticCurveTo(44, 50, 40, 72);
      g.closePath();
      fillInk(g, lg(g, 22, 24, 74, 72, '#9fb69a', '#5f7d62', '#3e5644'));
      noShadow(g, () => {
        g.strokeStyle = 'rgba(232,190,110,0.9)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(62, 24); g.lineTo(74, 34); g.lineTo(66, 44); g.stroke();
        g.fillStyle = 'rgba(30,50,40,0.5)'; g.font = 'bold 13px serif'; g.fillText('S', 41, 52);
      });
    },
    // the Diário de Notícias, folded: masthead, columns, a little tide table
    newspaper(g) {
      g.translate(48, 48); g.rotate(-0.08); g.translate(-48, -48);
      rr(g, 16, 22, 64, 54, 2); fillInk(g, lg(g, 16, 22, 80, 76, '#f1ecdf', '#d8cfbb'));
      noShadow(g, () => {
        g.fillStyle = '#2a2a2a'; g.fillRect(22, 28, 52, 6);
        g.fillStyle = 'rgba(40,40,40,0.55)'; for (let y = 40; y < 70; y += 4) { g.fillRect(22, y, 24, 1.6); }
        g.strokeStyle = 'rgba(40,40,40,0.6)'; g.lineWidth = 1; g.strokeRect(52, 40, 22, 26); for (let y = 46; y < 66; y += 5) line(g, 52, y, 74, y);
      });
    },
    // Duarte's lyrics sheet: a folded page of handwriting, a little treble clef in the corner
    lyrics_sheet(g) {
      g.translate(48, 48); g.rotate(0.1); g.translate(-48, -48);
      rr(g, 22, 16, 52, 66, 2); fillInk(g, lg(g, 22, 16, 74, 82, '#fbf3df', '#eadbb8'));
      noShadow(g, () => {
        g.strokeStyle = 'rgba(60,50,90,0.7)'; g.lineWidth = 1.3;
        for (let y = 30; y <= 72; y += 7) { g.beginPath(); g.moveTo(29, y); g.quadraticCurveTo(44, y - 2, 58 + (y % 3) * 3, y); g.stroke(); }
        g.fillStyle = 'rgba(60,50,90,0.85)'; g.font = 'bold 16px serif'; g.fillText('\u266A', 58, 30);
        g.strokeStyle = 'rgba(150,120,80,0.5)'; line(g, 22, 49, 74, 49);
      });
    },
    // Dr. Teles's reserve key, still on its lanyard
    reserve_key(g) {
      noShadow(g, () => {
        g.strokeStyle = '#7a1d24';
        g.lineWidth = 3.5;
        g.beginPath();
        g.moveTo(14, 14);
        g.quadraticCurveTo(30, 60, 44, 44);
        g.moveTo(82, 12);
        g.quadraticCurveTo(66, 58, 50, 44);
        g.stroke();
      });
      g.translate(42, 46); g.rotate(1.2);
      keyShape(g, ['#f4e2a0', '#b88a2e', '#5e4210'], 9, 34, true);
    },
    vkey(g) {
      g.translate(28, 34); g.rotate(0.62);
      keyShape(g, ['#fff0b0', '#d4a43a', '#7a5014'], 10, 38, true);
      // a scrap of red silk ribbon through the bow
      noShadow(g, () => {
        g.fillStyle = '#b01a2a';
        g.beginPath();
        g.moveTo(-6, 4);
        g.quadraticCurveTo(-18, 14, -14, 26);
        g.lineTo(-9, 24);
        g.quadraticCurveTo(-12, 14, -2, 6);
        g.closePath();
        g.fill();
      });
    },
    tongue(g) { clapper(g, false); },
    tongue_wet(g) { clapper(g, true); },
    knife(g) {
      g.translate(48, 50); g.rotate(-0.72);
      // blade with a bright edge and a fuller groove
      g.beginPath(); g.moveTo(-2, -5); g.lineTo(34, -5); g.quadraticCurveTo(42, -4, 44, 0); g.quadraticCurveTo(34, 6, -2, 5); g.closePath();
      fillInk(g, lg(g, 0, -5, 0, 6, '#ffffff', '#c8d0d8', '#8a96a2', '#e8eef4'));
      noShadow(g, () => {
        g.strokeStyle = 'rgba(80,90,100,0.6)';
        g.lineWidth = 1;
        line(g, 2, -1, 30, -1.5);
        g.strokeStyle = 'rgba(255,255,255,0.9)';
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(2, 4.2);
        g.quadraticCurveTo(30, 4, 42, 0.5);
        g.stroke();
      });
      rr(g, -6, -7, 6, 14, 1.5); fillInk(g, lg(g, 0, -7, 0, 7, '#e0e0e0', '#8a8a8a', '#4a4a4a'), 1.5);   // bolster
      rr(g, -40, -6, 35, 12, 5); fillInk(g, lg(g, 0, -6, 0, 6, '#a8683a', '#6a3a18', '#3a1c08'));        // handle
      noShadow(g, () => { g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 0.8; for (let x = -36; x < -8; x += 3) line(g, x, -4, x + 2, 4);
        for (const x of [-30, -16]) { g.beginPath(); g.arc(x, 0, 2, 0, 7); g.fillStyle = '#d8d8d8'; g.fill(); g.strokeStyle = '#3a3a3a'; g.stroke(); } });
      shine(g, [[-36, -3.5], [-10, -3.5]], 1.5, 0.4);
    },
    sardine(g) {
      g.translate(48, 50); g.rotate(-0.12); g.translate(-48, -50);
      // an opened newspaper parcel
      poly(g, [[8, 52], [30, 36], [88, 44], [70, 74], [14, 72]]); fillInk(g, lg(g, 8, 36, 88, 74, '#e8e4d8', '#c8c2b0', '#a8a290'));
      noShadow(g, () => { g.fillStyle = 'rgba(40,40,40,0.5)'; for (let y = 46; y < 72; y += 3.2) for (let x = 16 + (y % 6); x < 80; x += 9) if (Math.abs(x - 46) + Math.abs(y - 56) > 18 || y > 64) g.fillRect(x, y, 6, 1.2);
        g.fillStyle = 'rgba(40,40,40,0.75)'; g.font = 'bold 7px Georgia, serif'; g.fillText('DIÁRIO', 54, 70); });
      poly(g, [[8, 52], [26, 58], [14, 72]]); fillInk(g, '#d8d2c0', 1.5);
      // the sardine
      g.beginPath();
      g.moveTo(18, 48);
      g.quadraticCurveTo(46, 30, 70, 42);
      g.lineTo(84, 32);
      g.lineTo(80, 46);
      g.lineTo(84, 58);
      g.lineTo(70, 48);
      g.quadraticCurveTo(46, 60, 18, 48);
      g.closePath();
      fillInk(g, lg(g, 0, 34, 0, 56, '#3a4a68', '#6a86a8', '#c8d8e8', '#f4f8fc'), 1.8);
      noShadow(g, () => { g.fillStyle = 'rgba(30,40,70,0.55)'; for (let x = 30; x < 66; x += 6) {
        g.beginPath();
        g.arc(x, 42 + (x - 46) * 0.02, 1.4, 0, 7);
        g.fill();
      }
        g.strokeStyle = 'rgba(40,40,60,0.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(30, 41); g.quadraticCurveTo(28, 47, 31, 51); g.stroke();
        g.fillStyle = '#f4f4f4'; g.beginPath(); g.arc(24, 45, 2.8, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(24, 45, 1.5, 0, 7); g.fill(); });
      shine(g, [[34, 40], [62, 38]], 2, 0.7);
    },
    lantern(g) {
      noShadow(g, () => { g.fillStyle = rg(g, 48, 54, 4, 40, 'rgba(255,200,110,0.55)', 'rgba(255,170,60,0)'); g.fillRect(0, 0, 96, 96); });
      g.beginPath(); g.arc(48, 18, 11, Math.PI, 0); g.strokeStyle = INK; g.lineWidth = 4.5; g.stroke(); g.strokeStyle = '#8a7a5a'; g.lineWidth = 2; g.stroke();
      // cap
      poly(g, [[36, 30], [60, 30], [55, 21], [41, 21]]); fillInk(g, lg(g, 36, 0, 60, 0, '#8a6a2a', '#f4d48a', '#6a4a14'));
      // glass globe with the flame
      g.beginPath(); g.moveTo(37, 32); g.bezierCurveTo(28, 44, 28, 62, 37, 72); g.lineTo(59, 72); g.bezierCurveTo(68, 62, 68, 44, 59, 32); g.closePath();
      g.fillStyle = rg(g, 48, 54, 2, 22, '#fff6c8', '#ffc050', 'rgba(220,130,40,0.55)'); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
      noShadow(g, () => { g.fillStyle = '#fffbe8'; g.beginPath(); g.moveTo(48, 44); g.bezierCurveTo(53, 52, 52, 60, 48, 61); g.bezierCurveTo(44, 60, 43, 52, 48, 44); g.fill();
        g.strokeStyle = 'rgba(40,30,20,0.85)'; g.lineWidth = 1.6; for (const x of [40, 48, 56]) line(g, x, 32, x + (x - 48) * 0.2, 72); });
      shine(g, [[36, 40], [34, 60]], 2.5, 0.7);
      // fount
      g.beginPath();
      g.moveTo(32, 72);
      g.lineTo(64, 72);
      g.lineTo(66, 82);
      g.lineTo(30, 82);
      g.closePath();
      fillInk(g, lg(g, 30, 0, 66, 0, '#8a6a2a', '#f4d48a', '#c8963a', '#5a3a10'));
      shine(g, [[36, 75], [36, 80]], 2, 0.6);
    },
  };
  // Painted (Canva) inventory icons in art/icons/<id>.webp, 192px with transparency. They are
  // preloaded; an icon asked for before its painting arrives shows the canvas drawing above
  // until the painting loads, then the inventory redraws. A missing file keeps the drawing.
  const PAINTED = window.PAINTED_ICONS || []; // (the story lists the ids that have a painting in art/icons)
  const iconCache = {}, iconImg = {};
  // an item with no painting and no drawing yet: a luggage tag with its short name (window.ICON_LABELS[id])
  function tagIcon(g, id) {
    const label = ((window.ICON_LABELS || {})[id] || id.replace(/_/g, ' ')).toUpperCase();
    poly(g, [[14, 30], [30, 14], [86, 14], [86, 82], [30, 82], [14, 66]]);
    fillInk(g, lg(g, 0, 14, 0, 82, '#f3e6c4', '#d9c18e'));
    g.fillStyle = INK; g.beginPath(); g.arc(26, 48, 4, 0, Math.PI * 2); g.fill();
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const words = label.split(' '), lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : words;
    lines.forEach((l, i) => { g.font = 'bold ' + (l.length > 8 ? 9 : 12) + 'px sans-serif'; g.fillText(l, 56, 48 + (i - (lines.length - 1) / 2) * 14); });
  }
  function paintIcon(c, id) {
    const g = c.getContext('2d'), im = iconImg[id];
    g.clearRect(0, 0, 96, 96);
    g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 6; g.shadowOffsetY = 3;
    if (im && im.complete && im.naturalWidth) { g.imageSmoothingQuality = 'high'; g.drawImage(im, 4, 2, 88, 88); }
    else (ICONS[id] || (g => tagIcon(g, id)))(g);
    g.restore();
  }
  for (const id of PAINTED) {
    const im = new Image(); iconImg[id] = im;
    im.onload = () => { if (iconCache[id]) { paintIcon(iconCache[id], id); if (window.Game && Game.renderInv) Game.renderInv(); } };
    im.onerror = () => { delete iconImg[id]; };
    im.src = 'art/icons/' + id + '.webp';
  }
  function icon(id) {
    if (!iconCache[id]) { const [c] = mk(96, 96); paintIcon(c, id); iconCache[id] = c; }
    return iconCache[id];
  }

  window.FX = { W, H, mk, rng, makeFog, drawFog, glow, flicker, shaft, motes, water, vignette, icon, makeClouds, cloudOffset, drawClouds, masked, birds, wisps, embers, drips, leaves, sway, breathe,
    ripple, billow, flame, trickles, rain, moth, twinkle, dapple, passer, sweep, feather, fan };
})();
