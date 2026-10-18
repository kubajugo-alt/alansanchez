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
  function drawOccluder(o) {
    const im = IMG['bg:' + curBg()]; if (!im) return;
    g.save(); g.beginPath();
    for (const p of (o.polys || [o.poly])) { p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }
    g.clip();
    g.drawImage(im, 0, 0, W, H);
    drawLayers(true);
    E.drawGlows(); // keep lamp halos continuous across the repainted patch
    if (o.draw) o.draw(g, E.time); // props that sit on the occluding furniture
    g.restore();
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
  function drawLayers(staticOnly) {
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
  let last = performance.now(), last0 = performance.now(), slowT = 0;
  let frameErr = 0;
  function frame(now) {
    requestAnimationFrame(frame); // queued first: a throwing hook skips one frame, never the loop
    if (window.HOLD) { if (!(window.ADVANCE > 0)) { last = now; return; } window.ADVANCE--; } // test recordings: step frame by frame
    // STEP_DT: fixed steps for test recordings; TIME_SCALE: the review screen's slow motion
    const dt = (window.STEP_DT || Math.min(0.05, (now - last) / 1000)) * (window.TIME_SCALE || 1);
    last = now;
    E.time += dt;
    // a device that can't keep up with the mesh warp falls back to flat frames
    if (window.WARP == null && !window.FAST) { // (WARP = true forces it on, false off)
      slowT = (now - last0 > 45) ? slowT + 1 : Math.max(0, slowT - 2); last0 = now;
      if (slowT > 120) { window.WARP = false; slowT = 0; console.info('Warp off: frames too slow on this device'); }
    }
    try { drawFrame(dt); } catch (e) { if (frameErr++ < 5) console.error('frame', e); }
  }
  function drawFrame(dt) {
    if (E.room) {
      E.player.update(dt); E.npcs.forEach(a => a.update(dt));
      E.idleSmokeTick(dt);
      E.updateLights(E.time);
      drawBg(curBg());
      if (E.room.animBack) E.room.animBack(g, E.time);
      drawLayers(false);
      if (E.room.anim) E.room.anim(g, E.time);
      E.drawGlows();
      // depth-sorted actors + occluders cut from the painting
      const items = [];
      for (const a of E.npcs) if (a.visible) items.push({ y: a.y, fn: () => { a.draw(); if (a.overlay) a.overlay(g, a, E.time); } });
      if (E.player.visible) items.push({ y: E.player.y, fn: () => { E.player.draw(); if (E.player.overlay) E.player.overlay(g, E.player, E.time); } });
      for (const o of (E.room.occluders || [])) if (!o.when || o.when()) items.push({ y: occluderY(o), fn: () => drawOccluder(o) });
      items.sort((a, b) => a.y - b.y).forEach(i => i.fn());
      if (E.room.animFg) E.room.animFg(g, E.time);
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
