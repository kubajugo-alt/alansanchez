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

  window.FX = { W, H, mk, rng, makeFog, drawFog, glow, flicker, shaft, motes, water, vignette, icon };
})();
