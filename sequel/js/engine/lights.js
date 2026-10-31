// Room lights: how each kind flickers, the painted glows, the light falling on a character (a flat
// tint here, or parameters for the GPU pass in js/warp.js) and the shadows characters cast.
(function () {
  const E = window.Engine;
  const { g, fit } = E;

  // ---------------------------------------------------------------- lights
  // room.lights: [{ x, y, rgb, kind, seed, glow, ga, power, reach, rim, shadow, floor:[x,y], height, actor, off:[dx,dy] }]
  // `kind` sets how it flickers. The same value drives the painted glow, the
  // light falling on characters and the strength of the shadows they cast.
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const FLICK = {
    steady: () => 1,
    flame: (t, s) => 0.8 + 0.1 * Math.sin(t * 9.7 + s) + 0.06 * Math.sin(t * 23.3 + s * 2) + 0.04 * Math.sin(t * 41 + s * 5) + 0.05 * (hash(Math.floor(t * 12) + s) - 0.5),
    torch: (t, s) => 0.74 + 0.12 * Math.sin(t * 7.3 + s) + 0.08 * Math.sin(t * 17.9 + s * 2) + 0.06 * Math.sin(t * 31 + s * 4) + 0.1 * (hash(Math.floor(t * 14) + s) - 0.5),
    candle: (t, s) => 0.86 + 0.07 * Math.sin(t * 13 + s) + 0.05 * Math.sin(t * 29 + s) + 0.04 * (hash(Math.floor(t * 18) + s) - 0.5),
    gas: (t, s) => 0.93 + 0.04 * Math.sin(t * 3.1 + s) + 0.03 * Math.sin(t * 17 + s * 3),
    tube: (t, s) => {
      const c = t % 11.3;
      if (c < 0.7) return hash(Math.floor(t * 22) + s) < 0.5 ? 0.35 : 0.95; // stutter
      return hash(Math.floor(t * 6) + s) < 0.012 ? 0.55 : 1 - 0.015 * Math.sin(t * 120);
    },
    pulse: (t, s) => 0.78 + 0.22 * Math.sin(t * 2 + s),
  };
  function updateLights(t) {
    const ls = typeof E.room.lights === 'function' ? E.room.lights() : (E.room.lights || []);
    E.roomLights = ls.filter(l => !l.when || l.when()).map(l => {
      let x = l.x, y = l.y;
      if (l.actor) {
        const a = l.actor === 'alan' ? E.player : E.npcs.find(n => n.id === l.actor);
        if (!a || !a.visible) return null;
        const h = a.height(), side = a.lastFlip ? -1 : 1;
        // a carried light can follow the prop frame by frame (offs: { frame: [dx, dy] });
        // in a frame where the prop isn't held (null, or missing with no default) it goes out
        const key = a.frameKey(), off = l.offs && key in l.offs ? l.offs[key] : l.off;
        if (!off) return null;
        x = a.x + off[0] * h * side; y = a.y + off[1] * h;
        return Object.assign({}, l, { x, y, floor: [x, a.y], owner: a, f: Math.max(0, (FLICK[l.kind || 'steady'] || FLICK.steady)(t, l.seed || 0)) * (l.dim ? l.dim() : 1) });
      }
      const f = l.level ? l.level(t) : (FLICK[l.kind || 'steady'] || FLICK.steady)(t, l.seed || 0);
      return Object.assign({}, l, { x, y, f: Math.max(0, f) });
    }).filter(Boolean);
  }
  // each glow moves with the depth of its own lamp in the painting (a carried light with its bearer's feet)
  function drawGlows() {
    const P = window.Parallax && Parallax.active && E.room && E.room.depth;
    for (const l of E.roomLights) if (l.glow) {
      if (P) { g.save(); const [px, py] = l.owner ? l.floor : [l.x, l.y]; Parallax.apply(g, px, py); }
      FX.glow(g, l.x, l.y, l.glow * (0.9 + 0.1 * l.f), l.rgb, (l.ga || 0.3) * l.f);
      if (P) g.restore();
    }
  }
  // Light reaching a point on a character (their chest).
  function lightsOn(x, y, h, who) {
    const out = [];
    for (const l of E.roomLights) {
      if (!l.power) continue;
      const d = Math.hypot(l.x - x, (l.y - y) * 1.3);
      const fall = Math.max(0, 1 - d / (l.reach || 900));
      // a lantern held at arm's length warms its carrier, it doesn't flood them
      const I = l.power * l.f * Math.pow(fall, 1.4) * (who && l.owner === who ? 0.45 : 1);
      if (I > 0.01) out.push({ l, I, dx: l.x - x, dy: l.y - y, d });
    }
    return out;
  }
  const litBuf = document.createElement('canvas'), lg = litBuf.getContext('2d');
  const silBuf = document.createElement('canvas'), sg = silBuf.getContext('2d');
  // the silhouette at a quarter size: drawn back up smoothed it is the soft shadow (a canvas blur filter per light per
  // frame was one of the slowest things on a phone)
  const softBuf = document.createElement('canvas'), soft = softBuf.getContext('2d');
  function groundShadows(a, comp, U, bw, bh, h, lights, q) { // (q: comp is drawn at q buffer px per scene px)
    q = q || 1;
    const L = roomLight();
    const ao = L.ao != null ? L.ao : 1;
    // contact shadow / ambient occlusion right under the feet
    // (a figure of two, e.g. the kiss at Gando: def.shadow moves it to the middle of both and stretches it over them)
    const SH = (a.def && a.def.shadow) || null, wide = (a.walking ? 1.25 : 1) * (SH ? SH.wide : 1);
    g.save();
    g.translate(a.x + (SH ? SH.dx * h : 0), a.y - h * 0.02); g.scale(1, 0.2); // spans from the far foot (painted higher) to the near one
    let gr = g.createRadialGradient(0, 0, 0, 0, 0, h * 0.15 * wide);
    gr.addColorStop(0, `rgba(0,0,0,${0.7 * ao})`); gr.addColorStop(0.5, `rgba(0,0,0,${0.38 * ao})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, h * 0.15 * wide, 0, Math.PI * 2); g.fill();
    gr = g.createRadialGradient(0, 0, 0, 0, 0, h * 0.065 * wide);
    gr.addColorStop(0, `rgba(0,0,0,${0.7 * ao})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, h * 0.065 * wide, 0, Math.PI * 2); g.fill();
    g.restore();
    // cast shadows, one per light, stretched away from it across the floor
    const casters = lights.filter(o => o.l.shadow !== false && o.I > 0.03 && o.l.owner !== a);
    if (!casters.length) return;
    fit(silBuf, sg, bw, bh);
    sg.drawImage(comp, 0, 0, Math.round(bw * q), Math.round(bh * q), 0, 0, bw, bh);
    sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#000'; sg.fillRect(0, 0, bw, bh);
    // a cast shadow is darkest where it meets the feet and thins out toward the
    // head's end, so a figure lit from behind stays planted instead of floating
    sg.globalCompositeOperation = 'destination-in';
    const fade = sg.createLinearGradient(0, -U.y, 0, 0);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.35, 'rgba(0,0,0,0.75)');
    fade.addColorStop(1, 'rgba(0,0,0,0.28)');
    sg.fillStyle = fade; sg.fillRect(0, 0, bw, bh);
    sg.globalCompositeOperation = 'source-over';
    const sw = Math.max(1, Math.round(bw / 4)), sh = Math.max(1, Math.round(bh / 4));
    if (softBuf.width !== sw || softBuf.height !== sh) { softBuf.width = sw; softBuf.height = sh; } else soft.clearRect(0, 0, sw, sh);
    soft.imageSmoothingEnabled = true; soft.imageSmoothingQuality = 'medium'; soft.drawImage(silBuf, 0, 0, bw, bh, 0, 0, sw, sh);
    for (const o of casters) {
      const fp = o.l.floor || [o.l.x, a.y - 40];
      let vx = a.x - fp[0], vy = (a.y - fp[1]);
      const dist = Math.hypot(vx, vy) || 1;
      vx /= dist; vy /= dist;
      // a light nearly overhead casts a short shadow under the feet, not a long one in front of them
      const len = h * Math.max(0.3, Math.min(1.5, 0.3 + dist / (o.l.height || 650))) * Math.min(1, 0.25 + dist / 260);
      const ex = vx * len, ey = vy * len * 0.42;
      // strength follows the light (and its flicker), but stays readable
      if (a.alpha < 0.6) continue; // a figure fading in or out casts no shadow (two overlapping ones would double up)
      const alpha = Math.min(0.62, 0.1 + o.I * 2.4) * (typeof o.l.shadow === 'number' ? o.l.shadow : 1) * Math.min(1, o.l.f) * a.alpha;
      g.save();
      g.globalAlpha = alpha;
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'medium';
      g.transform(1, 0, -ex / h, -ey / h, a.x, a.y - h * 0.012); // tucked under the soles so it meets the shoes
      g.drawImage(softBuf, 0, 0, sw, sh, U.x, U.y, bw, bh);
      g.restore();
    }
  }
  // The same lighting as lightSprite, as parameters for the GPU pass (js/warp.js), which shades the
  // figure as a rounded form: lit side, shaded side, rims, room colour, fog.
  const rgbaCache = {};
  function rgba(str, defA) {
    if (!str) return null;
    if (rgbaCache[str]) return rgbaCache[str];
    const m = str.match(/[\d.]+/g).map(Number);
    return (rgbaCache[str] = [m[0] / 255, m[1] / 255, m[2] / 255, m.length > 3 ? m[3] : defA]);
  }
  function lightParams(U, figH, lights, q) { // (U, figH in the buffer's px: q of them per scene px)
    q = q || 1;
    const L = roomLight();
    const base = Math.max(0.3, Math.min(1, L.base != null ? L.base : 1));
    const amb = (rgba(L.ambient, 1) || [1, 1, 1, 1]).slice(0, 3).map(v => v * base);
    const cx = -U.x, cy = -U.y - figH * 0.55;
    const out = [];
    for (const o of lights) {
      const lc = rgba('rgb(' + o.l.rgb + ')', 1);
      // the light's colour, tempered by the room's, adding what used to be a flat lift in level
      const an = amb.map(v => v / Math.max(0.05, base)), luma = c => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
      let tint = [0, 1, 2].map(i => (lc[i] * 0.6 + an[i] * 0.4));
      const k = luma(an) / Math.max(0.05, luma(tint)); tint = tint.map(v => v * k); // keep the old brightness, take the light's hue
      out.push({ x: cx + o.dx * q, y: cy + o.dy * q, rgb: tint, I: o.I * (o.l.fill != null ? o.l.fill : 0.35) / 0.65, rim: Math.min(0.55, o.I * (o.l.rim != null ? o.l.rim : 0.8)) });
    }
    out.sort((a, b) => b.I - a.I);
    // same average brightness as the flat lighting had; only the modelling changes
    const fills = lights.reduce((t, o) => t + o.I * (o.l.fill != null ? o.l.fill : 0.35), 0);
    const flat = Math.max(0.3, Math.min(1, base + fills));
    const est = base * 0.97 + out.slice(0, 4).reduce((t, l) => t + l.I * 0.65 * 0.85, 0);
    const gain = Math.min(1.6, flat / Math.max(0.05, est));
    for (let i = 0; i < 3; i++) amb[i] *= gain;
    for (const l of out) l.I *= gain;
    const key = rgba(L.rim, 0.3), fog = rgba(L.fog, 0.2);
    return { amb, fog, key, keySide: L.rimSide || 1, feet: -U.y, fig: figH, lights: out };
  }
  // Room colour, then a rim of each light on the side facing it.
  function lightSprite(comp, w, h, U, figH, lights) {
    fit(litBuf, lg, w, h);
    lg.drawImage(comp, 0, 0, w, h, 0, 0, w, h);
    const L = roomLight();
    const level = Math.max(0.3, Math.min(1, (L.base != null ? L.base : 1) + lights.reduce((s, o) => s + o.I * (o.l.fill != null ? o.l.fill : 0.35), 0)));
    if (L.ambient || level < 1) {
      const m = (L.ambient || 'rgb(255,255,255)').match(/\d+/g).map(Number);
      lg.globalCompositeOperation = 'multiply';
      lg.fillStyle = `rgb(${m.map(v => Math.round(v * level)).join(',')})`; lg.fillRect(0, 0, w, h);
      lg.globalCompositeOperation = 'destination-in';
      lg.drawImage(comp, 0, 0, w, h, 0, 0, w, h);
    }
    lg.globalCompositeOperation = 'source-atop';
    if (L.rim) { // soft, steady key light (daylight through a window, etc.)
      const side = L.rimSide || 1;
      const gr = lg.createLinearGradient(side > 0 ? w : 0, 0, side > 0 ? w * 0.45 : w * 0.55, 0);
      gr.addColorStop(0, L.rim); gr.addColorStop(1, 'rgba(0,0,0,0)');
      lg.fillStyle = gr; lg.fillRect(0, 0, w, h);
    }
    const cx = -U.x, cy = -U.y - figH * 0.55; // chest, in buffer coords
    for (const o of lights) {
      const a = Math.min(0.55, o.I * (o.l.rim != null ? o.l.rim : 0.8));
      if (a < 0.02) continue;
      const n = Math.hypot(o.dx, o.dy) || 1, ux = o.dx / n, uy = o.dy / n;
      const r = figH * 0.3;
      const gr = lg.createLinearGradient(cx + ux * r, cy + uy * figH * 0.5, cx - ux * r * 0.2, cy - uy * figH * 0.1);
      gr.addColorStop(0, `rgba(${o.l.rgb},${a.toFixed(3)})`); gr.addColorStop(1, `rgba(${o.l.rgb},0)`);
      lg.fillStyle = gr; lg.fillRect(0, 0, w, h);
    }
    if (L.fog) { lg.fillStyle = L.fog; lg.fillRect(0, 0, w, h); }
    lg.globalCompositeOperation = 'source-over';
    return litBuf;
  }

  function roomLight() { const L = E.room && E.room.light; return (typeof L === 'function' ? L() : L) || {}; }

  Object.assign(E, { updateLights, drawGlows, lightsOn, groundShadows, lightParams, lightSprite, roomLight });
})();
