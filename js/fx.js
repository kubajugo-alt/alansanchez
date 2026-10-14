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
  function shaft(g, pts, rgb, a) {
    const gr = g.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1]);
    gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
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
    return { c, w, h, alphaAt(x, y) { x = ((Math.round(x) % w) + w) % w; y = Math.max(0, Math.min(h - 1, Math.round(y))); return data[(y * w + x) * 4 + 3] / 255; } };
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
      g.beginPath(); g.moveTo(x - s, y - flap * s * 0.6); g.quadraticCurveTo(x - s * 0.4, y - s * 0.2, x, y); g.quadraticCurveTo(x + s * 0.4, y - s * 0.2, x + s, y - flap * s * 0.6); g.stroke();
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
      g.translate(x, y); g.rotate(t * 6 + i); g.fillStyle = ['#6a4a22', '#8a6a2a', '#5a3a1a'][i % 3];
      g.beginPath(); g.ellipse(0, 0, 5, 2.4, 0, 0, Math.PI * 2); g.fill();
      g.setTransform(1, 0, 0, 1, 0, 0);
    }
    g.restore();
  }
  // Redraws a region of the painting with each row shifted sideways (cloth in
  // the wind), more toward the free bottom edge.
  function sway(g, im, rect, t, amp, phase) {
    if (!im) return;
    const [x, y, w, h] = rect, k = im.width / W;
    for (let r = 0; r < h; r += 2) {
      const f = r / h, dx = Math.sin(t * 1.6 + phase + f * 1.2) * amp * f * f;
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

  function vignette(g, a) {
    const gr = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }

  // ---------------------------------------------------------------- icons
  // Painted 96x96 inventory icons.
  const ICONS = {
    notebook(g) {
      g.rotate(-0.12);
      round(g, 22, 14, 52, 68, 4, '#2e4a78'); round(g, 26, 17, 46, 62, 2, '#f1ead6');
      g.strokeStyle = '#9fb0c8'; g.lineWidth = 1.5; for (let y = 28; y < 76; y += 7) { line(g, 30, y, 68, y); }
      g.strokeStyle = '#a03030'; line(g, 34, 18, 34, 78);
      g.fillStyle = '#c8c8c8'; for (let y = 20; y < 78; y += 8) { g.beginPath(); g.arc(24, y, 2.4, 0, 7); g.fill(); }
      g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(40, 40); g.quadraticCurveTo(50, 34, 60, 42); g.stroke();
    },
    sketch(g) {
      g.rotate(0.06);
      round(g, 16, 14, 64, 68, 2, '#f3eedf');
      g.strokeStyle = '#3a3a3a'; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(38, 30); g.quadraticCurveTo(38, 22, 48, 22); g.quadraticCurveTo(58, 22, 58, 30); g.lineTo(62, 52); g.lineTo(34, 52); g.closePath(); g.stroke();
      g.beginPath(); g.arc(48, 56, 3, 0, 7); g.stroke();
      g.strokeStyle = '#2f55a8'; g.lineWidth = 2.5; g.beginPath();
      for (let x = 20; x <= 76; x += 2) g.lineTo(x, 66 + Math.sin(x / 4) * 4); g.stroke();
    },
    coins(g) {
      for (const [x, y, c] of [[38, 54, '#b88a2a'], [56, 50, '#d4a63a'], [46, 40, '#e0b84a']]) {
        g.fillStyle = shadeHex(c, 0.6); g.beginPath(); g.ellipse(x, y + 3, 16, 10, 0, 0, 7); g.fill();
        const gr = g.createLinearGradient(x - 16, y - 10, x + 16, y + 10); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.4, c); gr.addColorStop(1, shadeHex(c, 0.6));
        g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 16, 10, 0, 0, 7); g.fill(); g.strokeStyle = '#5a3a10'; g.lineWidth = 1.5; g.stroke();
        g.strokeStyle = shadeHex(c, 0.7); g.beginPath(); g.ellipse(x, y, 10, 6, 0, 0, 7); g.stroke();
      }
    },
    key(g) {
      g.rotate(-0.6); g.translate(-20, 20);
      g.strokeStyle = '#1e1a16'; g.lineWidth = 3;
      metal(g, () => { g.beginPath(); g.arc(30, 48, 13, 0, 7); g.arc(30, 48, 6, 0, 7, true); }, '#8a8070');
      metal(g, () => { g.beginPath(); g.rect(42, 44, 38, 8); g.rect(66, 52, 5, 9); g.rect(74, 52, 5, 12); }, '#8a8070');
    },
    ledger(g) {
      g.rotate(-0.08);
      round(g, 18, 12, 60, 74, 4, '#4a1e12');
      const gr = g.createLinearGradient(18, 0, 78, 0); gr.addColorStop(0, '#7a3a1e'); gr.addColorStop(1, '#4a1e10');
      round(g, 22, 14, 54, 70, 3, gr);
      g.fillStyle = '#efe4c4'; g.fillRect(72, 18, 5, 62);
      g.strokeStyle = '#c8a040'; g.lineWidth = 2; g.strokeRect(30, 24, 38, 50);
      g.fillStyle = '#c8a040'; g.beginPath(); g.moveTo(49, 38); g.lineTo(56, 52); g.lineTo(42, 52); g.closePath(); g.fill();
    },
    magnifier(g) {
      g.strokeStyle = '#3a2210'; g.lineWidth = 11; g.lineCap = 'round'; line(g, 56, 56, 82, 82);
      g.strokeStyle = '#7a4a24'; g.lineWidth = 7; line(g, 57, 57, 81, 81);
      const lens = g.createRadialGradient(36, 34, 2, 40, 40, 24); lens.addColorStop(0, 'rgba(255,255,255,0.9)'); lens.addColorStop(0.3, 'rgba(190,220,235,0.6)'); lens.addColorStop(1, 'rgba(120,160,190,0.5)');
      g.fillStyle = lens; g.beginPath(); g.arc(40, 40, 22, 0, 7); g.fill();
      g.strokeStyle = '#c89a3a'; g.lineWidth = 6; g.stroke(); g.strokeStyle = '#5a3a10'; g.lineWidth = 1.5; g.beginPath(); g.arc(40, 40, 25, 0, 7); g.stroke();
    },
    ginja(g) {
      for (const x of [30, 62]) {
        g.fillStyle = 'rgba(210,230,240,0.35)'; g.strokeStyle = '#2a2a2a'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x - 13, 26); g.lineTo(x + 13, 26); g.lineTo(x + 9, 74); g.lineTo(x - 9, 74); g.closePath(); g.fill(); g.stroke();
        const gr = g.createLinearGradient(x - 10, 40, x + 10, 74); gr.addColorStop(0, '#d0304a'); gr.addColorStop(1, '#5a0814');
        g.fillStyle = gr; g.beginPath(); g.moveTo(x - 11.5, 40); g.lineTo(x + 11.5, 40); g.lineTo(x + 8.6, 72); g.lineTo(x - 8.6, 72); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x - 9, 30, 3, 36);
        g.fillStyle = '#5a0814'; g.beginPath(); g.arc(x + 4, 50, 3.5, 0, 7); g.fill();
      }
    },
    weight(g) {
      g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(48, 72, 26, 7, 0, 0, 7); g.fill();
      metal(g, () => { g.beginPath(); g.moveTo(24, 70); g.lineTo(24, 44); g.ellipse(48, 44, 24, 7, 0, Math.PI, 0); g.lineTo(72, 70); g.ellipse(48, 70, 24, 7, 0, 0, Math.PI); }, '#c8963a');
      metal(g, () => { g.beginPath(); g.ellipse(48, 44, 24, 7, 0, 0, 7); }, '#e8c468');
      metal(g, () => { g.beginPath(); g.arc(48, 33, 8, 0, 7); }, '#c8963a');
    },
    matches(g) {
      g.rotate(-0.15); round(g, 18, 30, 60, 40, 3, '#e8dcc0');
      g.fillStyle = '#2f55a8'; g.fillRect(22, 34, 52, 32);
      g.strokeStyle = '#f3eedf'; g.lineWidth = 2; g.beginPath(); g.moveTo(34, 58); g.lineTo(48, 40); g.lineTo(62, 58); g.closePath(); g.stroke(); line(g, 48, 40, 48, 60);
      g.fillStyle = '#8a5a2a'; g.fillRect(70, 22, 4, 26); g.fillStyle = '#c0301c'; g.beginPath(); g.ellipse(72, 22, 4, 5, 0, 0, 7); g.fill();
    },
    glass(g) {
      g.fillStyle = 'rgba(210,230,240,0.35)'; g.strokeStyle = '#2a2a2a'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(34, 24); g.lineTo(62, 24); g.lineTo(57, 76); g.lineTo(39, 76); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(38, 30, 3, 40);
      g.fillStyle = 'rgba(120,20,30,0.5)'; g.beginPath(); g.ellipse(48, 74, 8, 2, 0, 0, 7); g.fill();
    },
    holywater(g) {
      ICONS.glass(g);
      const gr = g.createLinearGradient(0, 40, 0, 76); gr.addColorStop(0, 'rgba(170,215,255,0.8)'); gr.addColorStop(1, 'rgba(90,150,220,0.8)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(36, 40); g.lineTo(60, 40); g.lineTo(57, 74); g.lineTo(39, 74); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(44, 46, 2, 0, 7); g.arc(52, 58, 1.5, 0, 7); g.fill();
    },
    coffee(g) {
      g.strokeStyle = '#2a2a2a'; g.lineWidth = 2;
      g.fillStyle = '#efe6d2'; g.beginPath(); g.moveTo(30, 32); g.lineTo(66, 32); g.lineTo(60, 78); g.lineTo(36, 78); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#4a2a14'; g.beginPath(); g.ellipse(48, 34, 17, 4, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 2.5; for (const x of [40, 50, 58]) { g.beginPath(); g.moveTo(x, 28); g.bezierCurveTo(x - 5, 20, x + 5, 14, x, 6); g.stroke(); }
    },
    file55(g) {
      g.rotate(0.05); round(g, 18, 14, 60, 72, 2, '#c8b07a');
      round(g, 24, 10, 52, 70, 2, '#f1e8d0');
      g.fillStyle = '#2a2a2a'; for (let y = 22; y < 70; y += 6) g.fillRect(30, y, 34 - (y % 12), 2);
      g.strokeStyle = 'rgba(170,20,20,0.85)'; g.lineWidth = 2.5; g.strokeRect(34, 52, 34, 14);
    },
    fkey(g) { ICONS.key(g); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#e8d070'; g.fillRect(56, 22, 22, 10); g.fillStyle = '#1a1a1a'; g.fillRect(56, 26, 22, 2); },
    vkey(g) {
      g.rotate(0.5); g.translate(10, -24);
      metal(g, () => { g.beginPath(); g.arc(30, 48, 11, 0, 7); g.arc(30, 48, 5, 0, 7, true); }, '#d4b060');
      metal(g, () => { g.beginPath(); g.rect(40, 45, 34, 6); g.rect(64, 51, 4, 7); g.rect(70, 51, 4, 10); }, '#d4b060');
    },
    tidecard(g) {
      g.rotate(-0.06); round(g, 16, 18, 64, 62, 2, '#f1e8d0');
      g.strokeStyle = 'rgba(60,40,20,0.35)'; g.lineWidth = 1; for (let y = 30; y < 78; y += 6) line(g, 20, y, 76, y);
      g.fillStyle = '#2a2a4a'; for (let y = 32; y < 76; y += 6) for (let x = 24; x < 72; x += 13) g.fillRect(x, y - 3, 8, 2);
      g.strokeStyle = '#2f55a8'; g.lineWidth = 2; g.beginPath(); for (let x = 20; x <= 76; x += 2) g.lineTo(x, 24 + Math.sin(x / 4) * 2); g.stroke();
    },
    tongue(g) { ICONS.clapper(g); },
    tongue_wet(g) {
      ICONS.clapper(g); g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = 'rgba(170,15,15,0.85)'; g.beginPath(); g.ellipse(58, 62, 6, 9, 0.5, 0, 7); g.fill(); g.beginPath(); g.arc(50, 74, 3, 0, 7); g.fill();
    },
    knife(g) {
      g.rotate(-0.7); g.translate(-28, 18);
      metal(g, () => { g.beginPath(); g.moveTo(40, 44); g.lineTo(84, 40); g.quadraticCurveTo(80, 50, 40, 52); g.closePath(); }, '#b8c0c8');
      round(g, 10, 42, 32, 12, 4, '#5a3a1a');
    },
    sardine(g) {
      g.rotate(-0.1); round(g, 12, 46, 72, 30, 2, '#ddd6c4');
      g.fillStyle = '#7a7a7a'; for (let x = 18; x < 80; x += 10) g.fillRect(x, 54, 6, 2);
      const gr = g.createLinearGradient(0, 30, 0, 52); gr.addColorStop(0, '#5a6a80'); gr.addColorStop(1, '#e8eef4');
      g.fillStyle = gr; g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(16, 42); g.quadraticCurveTo(46, 26, 72, 40); g.lineTo(84, 32); g.lineTo(82, 50); g.lineTo(72, 44); g.quadraticCurveTo(46, 56, 16, 42); g.fill(); g.stroke();
      g.fillStyle = '#111'; g.beginPath(); g.arc(24, 40, 2, 0, 7); g.fill();
    },
    lantern(g) {
      g.strokeStyle = '#1a1a1a'; g.lineWidth = 3; g.beginPath(); g.arc(48, 22, 12, Math.PI, 0); g.stroke();
      metal(g, () => { g.beginPath(); g.rect(32, 24, 32, 8); g.rect(30, 72, 36, 8); }, '#6a6a6a');
      const gr = g.createRadialGradient(48, 52, 2, 48, 52, 22); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.4, '#ffb040'); gr.addColorStop(1, 'rgba(200,120,40,0.5)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(34, 32); g.lineTo(62, 32); g.lineTo(64, 72); g.lineTo(32, 72); g.closePath(); g.fill(); g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.stroke();
      line(g, 48, 32, 48, 72);
    },
    clapper(g) {
      g.rotate(0.55); g.translate(16, -24);
      metal(g, () => { g.beginPath(); g.rect(40, 10, 10, 50); }, '#6a6a3a');
      metal(g, () => { g.beginPath(); g.ellipse(45, 70, 15, 18, 0, 0, 7); }, '#5a6a3a');
      metal(g, () => { g.beginPath(); g.ellipse(45, 12, 11, 6, 0, 0, 7); }, '#6a5a2a');
      g.fillStyle = 'rgba(80,160,120,0.45)'; g.beginPath(); g.arc(40, 74, 5, 0, 7); g.arc(50, 64, 3, 0, 7); g.arc(43, 30, 2.5, 0, 7); g.fill();
    },
  };
  function line(g, a, b, c, d) { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); }
  function round(g, x, y, w, h, r, fill) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    g.fillStyle = fill; g.fill(); g.strokeStyle = '#1a120d'; g.lineWidth = 2; g.stroke();
  }
  function metal(g, shape, c) {
    shape();
    const gr = g.createLinearGradient(0, 0, 96, 96); gr.addColorStop(0, shadeHex(c, 1.6)); gr.addColorStop(0.45, c); gr.addColorStop(1, shadeHex(c, 0.45));
    g.fillStyle = gr; g.fill('evenodd'); g.strokeStyle = '#1a120d'; g.lineWidth = 2; g.stroke();
  }
  function shadeHex(c, k) {
    const n = parseInt(c.slice(1), 16);
    const f = v => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0');
    return '#' + f((n >> 16) & 255) + f((n >> 8) & 255) + f(n & 255);
  }
  const iconCache = {};
  function icon(id) {
    if (!iconCache[id]) {
      const [c, g] = mk(96, 96);
      g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 6; g.shadowOffsetY = 3;
      (ICONS[id] || (() => {}))(g);
      g.restore();
      iconCache[id] = c;
    }
    return iconCache[id];
  }

  window.FX = { W, H, mk, rng, makeFog, drawFog, glow, flicker, shaft, motes, water, vignette, icon, makeClouds, cloudOffset, drawClouds, masked, birds, wisps, embers, drips, leaves, sway, breathe };
})();
