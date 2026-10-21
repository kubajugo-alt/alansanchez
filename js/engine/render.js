// One frame: background, layers, glows, depth-sorted actors and occluders, fog, colour grade,
// and the animation loop that drives it (frame / drawFrame).
(function () {
  const E = window.Engine;
  const { W, H, g, IMG } = E;

  // ---------------------------------------------------------------- render
  function drawBg(name) { const im = IMG['bg:' + name]; if (im) g.drawImage(im, 0, 0, W, H); else { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); } }
  // Re-paints the part of the background (and its layers) that stands in front
  // of an actor. Outlines follow the painted furniture, not a box around it.
  // Per-room colour grade over the finished frame, so painted backgrounds and
  // sprites share one palette: a soft-light wash, plus lifted night blacks.
  const GRADES = {
    shop: ['#c98a4a', 0.16], shop_night: ['#3a5a8c', 0.16, '#05080e'],
    street: ['#e2b072', 0.12], street_night: ['#3a5a8c', 0.14, '#05070c'], police: ['#93a8a0', 0.16],
    tavern: ['#d08040', 0.18], tavern_night: ['#c66a30', 0.12, '#080402'],
    lavadouro: ['#8fb0b8', 0.15], ferreira: ['#c8a060', 0.15],
    convent: ['#dcc290', 0.12], se_tower: ['#c49060', 0.13], antiques: ['#b07840', 0.17],
    cais: ['#9ab0c0', 0.13], boat: ['#a0b4c0', 0.13], cabin: ['#b07a40', 0.17, '#070402'],
    convent_night: ['#30508a', 0.18, '#03070d'], cistern: ['#3c6a68', 0.16, '#020505'],
  };
  function grade(bg) {
    // a variant painting of a room (the tavern with its guitar taken down, a drawer pulled open...)
    // keeps the room's grade: without it the warm wash dropped out and the room looked unlit
    const c = GRADES[bg] || (E.room && GRADES[E.room.bg]); if (!c) return;
    g.save(); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = c[1] * 2.2;
    g.fillStyle = c[0]; g.fillRect(0, 0, W, H);
    if (c[2]) { g.globalCompositeOperation = 'screen'; g.globalAlpha = 1; g.fillStyle = c[2]; g.fillRect(0, 0, W, H); }
    g.restore();
  }
  function curBg() { const b = typeof E.room.bgFn === 'function' ? E.room.bgFn() : E.room.bg; return IMG['bg:' + b] ? b : E.room.bg; }
  // parallax (js/parallax.js): on in a room with a depth map when the address asks for it
  const PX = () => window.Parallax && Parallax.active && E.room && E.room.depth;
  // An occluder's outline as a mask, cached: solid inside, its edge thinned over a couple of pixels so the painted
  // furniture blends into whoever stands behind it instead of cutting them with a vector-sharp line
  const OCC_SOFT = 2.2; // px of feathered edge
  const occPath = (x, P, ox, oy) => { x.beginPath(); for (const p of P) { p.forEach(([px, py], i) => (i ? x.lineTo(px - ox, py - oy) : x.moveTo(px - ox, py - oy))); x.closePath(); } };
  function occMask(o) {
    if (o._fm) return o._fm;
    const P = o.polys || [o.poly], xs = P.flat().map(p => p[0]), ys = P.flat().map(p => p[1]), pad = 4;
    const bx = Math.max(0, Math.floor(Math.min(...xs)) - pad), by = Math.max(0, Math.floor(Math.min(...ys)) - pad);
    const bw = Math.max(1, Math.min(W, Math.ceil(Math.max(...xs)) + pad) - bx), bh = Math.max(1, Math.min(H, Math.ceil(Math.max(...ys)) + pad) - by);
    const c = document.createElement('canvas'); c.width = bw; c.height = bh; const x = c.getContext('2d');
    occPath(x, P, bx, by); x.fillStyle = '#fff'; x.fill();
    x.globalCompositeOperation = 'destination-out'; x.lineJoin = 'round'; x.strokeStyle = '#000';
    for (const [w, a] of [[OCC_SOFT * 2, 0.28], [OCC_SOFT, 0.32]]) { x.globalAlpha = a; x.lineWidth = w; occPath(x, P, bx, by); x.stroke(); }
    return (o._fm = { bx, by, bw, bh, c });
  }
  let occBuf = null;
  function drawOccluder(o) {
    const im = IMG['bg:' + curBg()]; if (!im) return;
    const P = o.polys || [o.poly], m = occMask(o);
    if (!occBuf) occBuf = document.createElement('canvas');
    if (occBuf.width < m.bw || occBuf.height < m.bh) { occBuf.width = Math.max(occBuf.width, m.bw); occBuf.height = Math.max(occBuf.height, m.bh); }
    const t = occBuf.getContext('2d');
    t.save(); t.clearRect(0, 0, m.bw, m.bh); t.translate(-m.bx, -m.by);
    t.drawImage(im, 0, 0, W, H); drawLayers(true, t);
    if (o.draw) o.draw(t, E.time); // props that sit on the occluding furniture
    t.restore();
    t.save(); t.globalCompositeOperation = 'destination-in'; t.drawImage(m.c, 0, 0); t.restore();
    const T0 = g.getTransform();
    g.save();
    // (the furniture moves as the floor at its front edge moves)
    if (PX()) { const xs = P.flat().map(p => p[0]); Parallax.apply(g, o.base ? (o.base[0][0] + o.base[1][0]) / 2 : (Math.min(...xs) + Math.max(...xs)) / 2, o.base ? (o.base[0][1] + o.base[1][1]) / 2 : o.y); }
    g.drawImage(occBuf, 0, 0, m.bw, m.bh, m.bx, m.by, m.bw, m.bh);
    // keep lamp halos continuous across the repainted patch (each glow at its own lamp's depth, so outside this transform)
    occPath(g, P, 0, 0); g.clip(); g.setTransform(T0); E.drawGlows();
    g.restore();
  }
  // where an occluder's top edge crosses the line x (the highest of its outlines there), or null
  function occTopAt(o, x) {
    let top = null;
    for (const p of (o.polys || [o.poly])) for (let i = 0; i < p.length; i++) {
      const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length];
      if (x0 === x1 || x < Math.min(x0, x1) || x > Math.max(x0, x1)) continue;
      const y = y0 + (y1 - y0) * (x - x0) / (x1 - x0); if (top == null || y < top) top = y;
    }
    return top;
  }
  // whoever stands behind a piece of furniture whose top edge crosses their body gets that edge (Actor.draw shades them
  // a little towards it: the counter, desk or basin throws its shade on them, so they read as standing behind it)
  function markOccluded(actors) {
    for (const a of actors) a.occEdge = null;
    for (const o of (E.room.occluders || [])) {
      if (o.when && !o.when()) continue;
      for (const a of actors) {
        const behind = o.base ? a.y < o.base[0][1] + (o.base[1][1] - o.base[0][1]) * Math.max(0, Math.min(1, (a.x - o.base[0][0]) / (o.base[1][0] - o.base[0][0]))) : a.y < o.y;
        if (!behind) continue;
        const e = occTopAt(o, a.x), h = a.height();
        if (e == null || e <= a.y - h * 0.95 || e >= a.y - 2) continue;
        if (a.occEdge == null || e < a.occEdge) a.occEdge = e;
      }
    }
  }
  // Depth of an occluder. Furniture painted at an angle gives a `base` line (its
  // front edge on the floor) instead of a single y: whoever stands behind that
  // line at their own x is covered, whoever stands in front is not.
  function occluderY(o) {
    if (!o.base) return o.y;
    const [[x0, y0], [x1, y1]] = o.base;
    const at = x => y0 + (y1 - y0) * Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
    let behind = -Infinity;
    for (const a of E.npcs.concat(E.player)) if (a.visible && a.y < at(a.x)) behind = Math.max(behind, a.y);
    return behind === -Infinity ? -1e6 : behind + 0.01;
  }
  // Painted layers cut from clean plates: static fills for things that were
  // taken, and moving parts (pendulums, bells) that swing about a pivot.
  function drawLayers(staticOnly, ctx) {
    const g = ctx || E.g;
    for (const l of (E.room.layers || [])) {
      if (l.when && !l.when()) continue;
      const im = IMG['lay:' + l.img]; if (!im) continue;
      const w = l.w || im.width * (l.k || 1), h = l.h || im.height * (l.k || 1);
      const ang = l.swing ? l.swing(E.time) : 0;
      if (!ang) { g.drawImage(im, l.x, l.y, w, h); continue; }
      if (staticOnly) continue;
      g.save(); g.translate(l.pivot[0], l.pivot[1]); g.rotate(ang * Math.PI / 180);
      g.drawImage(im, l.x - l.pivot[0], l.y - l.pivot[1], w, h); g.restore();
    }
  }
  let last = performance.now(), last0 = performance.now(), slowT = 0, bgc = null, bgKey = '';
  let frameErr = 0;
  // ?fps: a small readout for checking speed on a real device (frames a second over the last second, the slowest
  // frame in it, and whether the effects are on); nothing else changes
  const fpsEl = new URLSearchParams(location.search).has('fps') ? document.createElement('div') : null, fpsT = []; let fpsShown = 0;
  if (fpsEl) { fpsEl.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:9999;font:12px/1.3 monospace;color:#cfe8b0;background:rgba(0,0,0,.65);padding:3px 6px;pointer-events:none'; document.body.appendChild(fpsEl); }
  function frame(now) {
    requestAnimationFrame(frame); // queued first: a throwing hook skips one frame, never the loop
    if (fpsEl) {
      fpsT.push(now); while (fpsT[0] < now - 1000) fpsT.shift();
      if (now - fpsShown > 500) { fpsShown = now; let w = 0; for (let i = 1; i < fpsT.length; i++) w = Math.max(w, fpsT[i] - fpsT[i - 1]);
        fpsEl.textContent = `${fpsT.length} fps · slowest ${w.toFixed(0)} ms · effects ${window.WARP === false ? 'off' : 'on'}${window.Parallax && Parallax.active ? ' + parallax' : ''}`; }
    }
    if (window.HOLD) { if (!(window.ADVANCE > 0)) { last = now; return; } window.ADVANCE--; } // test recordings: step frame by frame
    // STEP_DT: fixed steps for test recordings; TIME_SCALE: the review screen's slow motion
    const dt = (window.STEP_DT || Math.min(0.05, (now - last) / 1000)) * (window.TIME_SCALE || 1);
    last = now;
    E.time += dt;
    // a device that can't keep up with the mesh warp falls back to flat frames: about four seconds' worth of
    // slow frames (over 45 ms), counted in time, not frames, so a very slow device gives up quickly; a single
    // hitch (a room loading, a tab coming back) counts for at most a tenth of a second
    if (window.WARP == null && !window.FAST && !document.hidden) { // (WARP = true forces it on, false off)
      const ft = Math.min(0.1, (now - last0) / 1000); last0 = now;
      slowT = ft > 0.045 ? slowT + ft : Math.max(0, slowT - 2 * ft);
      if (slowT > 4) {
        window.WARP = false; slowT = 0; if (window.Parallax) Parallax.off();
        console.info('Warp and parallax off: frames too slow on this device');
        if (E.toast) E.toast('Effects lowered for this device (☰ to change)');
        if (E.syncOptions) E.syncOptions();
      }
    } else last0 = now;
    try { drawFrame(dt); } catch (e) { if (frameErr++ < 5) console.error('frame', e); }
  }
  let cine = null;
  function drawFrame(dt) {
    const c = !!E.still; if (c !== cine) { cine = c; E.wrap.classList.toggle('cine', c); } // the buttons step aside for a painting
    if (E.room) {
      E.player.update(dt); E.npcs.forEach(a => a.update(dt));
      E.idleSmokeTick(dt);
      E.updateLights(E.time);
      // a room afloat (the boat, the cabin) rocks a little: painting and figures tilt together about a point low in the
      // frame, scaled up a touch so no corner ever shows; fog, grade and vignette stay level
      const rock = E.room.sway ? E.room.sway(E.time) : 0;
      if (rock && !window.FAST) { g.save(); g.translate(W / 2, H * 0.85); g.rotate(rock); g.scale(1.014, 1.014); g.translate(-W / 2, -H * 0.85); }
      // parallax: the painting with what moves in it (its animated back, its layers) drawn together, then slid by depth
      const dm = window.Parallax && Parallax.on && E.room.depth && IMG['depth:' + E.room.depth];
      let pc = null;
      if (dm) {
        Parallax.update(dt, E.time, E.player.visible ? E.player.x : null);
        if (!bgc) { bgc = document.createElement('canvas'); bgc.width = W; bgc.height = H; }
        // redrawn (and sent to the GPU) only when something in it moves or changes: a still room costs nothing
        const ls = (E.room.layers || []).filter(l => !l.when || l.when());
        const key = E.room.id + '|' + curBg() + '|' + ls.map(l => l.img).join(','), live = !!E.room.animBack || ls.some(l => l.swing) || key !== bgKey;
        if (live) {
          const x = bgc.getContext('2d'), im = IMG['bg:' + curBg()];
          if (im) x.drawImage(im, 0, 0, W, H); else { x.fillStyle = '#000'; x.fillRect(0, 0, W, H); }
          if (E.room.animBack) E.room.animBack(x, E.time);
          drawLayers(false, x); bgKey = key;
        }
        pc = Parallax.draw(bgc, dm, live);
      }
      if (pc) g.drawImage(pc, 0, 0, W, H);
      else { drawBg(curBg()); if (E.room.animBack) E.room.animBack(g, E.time); drawLayers(false); }
      // what's painted over the room at no particular depth (motes, mist, glows) takes the zoom only
      const flat = fn => { if (!PX()) return fn(); g.save(); Parallax.apply(g); try { fn(); } finally { g.restore(); } };
      if (E.room.anim) flat(() => E.room.anim(g, E.time));
      E.drawGlows(); // (each glow at its own lamp's depth)
      // depth-sorted actors + occluders cut from the painting (each moves as the floor under its feet)
      const planted = (a, fn) => { if (!PX()) return fn(); g.save(); Parallax.apply(g, a.x, a.y); try { fn(); } finally { g.restore(); } };
      const items = [];
      markOccluded(E.npcs.filter(a => a.visible).concat(E.player.visible ? [E.player] : []));
      for (const a of E.npcs) if (a.visible) items.push({ y: a.y, fn: () => planted(a, () => { a.draw(); if (a.overlay) a.overlay(g, a, E.time); }) });
      if (E.player.visible) items.push({ y: E.player.y, fn: () => planted(E.player, () => { E.player.draw(); if (E.player.overlay) E.player.overlay(g, E.player, E.time); }) });
      for (const o of (E.room.occluders || [])) if (!o.when || o.when()) items.push({ y: occluderY(o), fn: () => drawOccluder(o) });
      items.sort((a, b) => a.y - b.y).forEach(i => i.fn());
      if (E.room.animFg) flat(() => E.room.animFg(g, E.time));
      if (rock && !window.FAST) g.restore();
      if (E.room.fog) {
        const f = typeof E.room.fog === 'function' ? E.room.fog() : E.room.fog;
        if (f) { FX.drawFog(g, E.fogA, E.time, f, 12, 0); FX.drawFog(g, E.fogB, E.time, f * 0.7, 22, 40); }
      }
      // the whole room breathes with its flames (characters included)
      const L = E.roomLight();
      if (L.flickerShade) {
        const fl = E.roomLights.filter(l => l.kind && l.kind !== 'steady');
        const avg = fl.length ? fl.reduce((s, l) => s + l.f, 0) / fl.length : 1;
        g.fillStyle = `rgba(0,0,0,${Math.max(0, L.flickerShade * (1 - avg)).toFixed(3)})`; g.fillRect(0, 0, W, H);
      }
      if (E.room.grade) { g.fillStyle = E.room.grade; g.fillRect(0, 0, W, H); }
      grade(curBg());
      FX.vignette(g, E.room.vignette != null ? E.room.vignette : 0.45);
      E.positionSpeech();
    }
    if (E.still) E.drawStill(dt);
  }

  Object.assign(E, { curBg, frame });
})();
