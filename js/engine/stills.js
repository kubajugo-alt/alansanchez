// Full-screen painted stills (slow Ken Burns move, cross-fades), close-ups of documents and
// objects, and the clock overlay.
(function () {
  const E = window.Engine;
  const { W, H, g, $, IMG, wait } = E;

  // ---------------------------------------------------------------- stills
  // Full-screen painted stills for cutscenes, with a slow Ken Burns move.
  function drawStill(dt) {
    const s = E.still;
    // a cross-fade (stillTo with cross): the previous painting keeps moving underneath until the new one covers it
    if (s.prev) { paintStill(s.prev, dt, 1, false); if (s.alpha > 0.985) s.prev = null; }
    paintStill(s, dt, s.alpha, !s.prev);
    if (s.target === 0 && s.alpha < 0.02) E.still = null;
  }
  function paintStill(s, dt, alpha, black) {
    // the fades and the pan run on the wall clock (up to a quarter second a frame), so a slow device still
    // dissolves on cue with the music; fixed-step test recordings keep their steps
    const nowMs = performance.now();
    if (!window.STEP_DT && s.lastMs) dt = Math.min(0.25, (nowMs - s.lastMs) / 1000);
    s.lastMs = nowMs;
    s.t += dt;
    s.alpha += (s.target - s.alpha) * Math.min(1, dt * (s.rate || 3.2));
    if (s !== E.still) alpha = 1; // the outgoing painting stays opaque under the incoming one
    const im = IMG['still:' + s.name] || IMG['close:' + s.name] || IMG['bg:' + s.name];
    const p = Math.min(1, s.t / s.dur), e = p * p * (3 - 2 * p);
    const z = s.zoom[0] + (s.zoom[1] - s.zoom[0]) * e;
    // the pan centre is clamped so the painting always covers the screen (no black edge at low zoom)
    const m = z >= 1 ? 0.5 / z : 0.5, clampP = v => Math.max(m, Math.min(1 - m, v));
    const cx = clampP(s.pan[0][0] + (s.pan[1][0] - s.pan[0][0]) * e), cy = clampP(s.pan[0][1] + (s.pan[1][1] - s.pan[0][1]) * e);
    g.save(); g.globalAlpha = Math.max(0, Math.min(1, alpha));
    if (black) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); }
    if (im) { const w = W * z, h = H * z; g.drawImage(im, W / 2 - w * cx, H / 2 - h * cy, w, h); }
    if (s.sepia) { g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(255,225,180,0.25)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
    FX.vignette(g, s.vignette != null ? s.vignette : 0.55);
    if (s.grain) for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,240,210,${Math.random() * 0.08})`; g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1); }
    g.restore();
  }
  // Shows a still while fn() runs (lines, waits), then fades back to the room.
  async function showStill(name, fn, opts) {
    opts = opts || {};
    E.busy++; E.cutscene++;
    E.still = { name, t: 0, alpha: E.still ? E.still.alpha : 0, target: 1, dur: opts.dur || 14, zoom: opts.zoom || [1.04, 1.12], pan: opts.pan || [[0.5, 0.5], [0.5, 0.5]], sepia: opts.sepia, grain: opts.grain, vignette: opts.vignette };
    E.clearSpeech();
    await wait(window.FAST ? 20 : 700);
    try { if (fn) await fn(); else await wait(window.FAST ? 20 : (opts.hold || 3000)); }
    finally {
      if (!opts.keep) { E.still.target = 0; await wait(window.FAST ? 20 : 700); }
      E.busy--; E.cutscene--;
    }
  }
  function endStill() { if (E.still) E.still.target = 0; }
  // Puts up a painting at once and returns (no wait, the speech box is left alone): with opts.cross it
  // dissolves over the painting already showing instead of rising from black. Used by the chapter
  // transitions and the fado slideshow (js/story/transitions.js); endStill() fades the last one out.
  function stillTo(name, opts) {
    opts = opts || {};
    const prev = E.still && E.still.target > 0 && E.still.alpha > 0.05 ? E.still : null;
    if (prev) prev.prev = null;
    E.still = { name, t: 0, alpha: prev && !opts.cross ? prev.alpha : 0, target: 1, rate: opts.rate, prev: opts.cross ? prev : null,
      dur: opts.dur || 14, zoom: opts.zoom || [1.04, 1.12], pan: opts.pan || [[0.5, 0.5], [0.5, 0.5]], sepia: opts.sepia, grain: opts.grain, vignette: opts.vignette };
    if (window.FAST) { E.still.alpha = 1; E.still.prev = null; }
  }
  const stillShowing = () => E.still ? E.still.name : null; // the painting up now (or fading out)

  // ---------------------------------------------------------------- close-ups
  // Documents and objects seen up close: painted image plus HTML text, paged.
  const closeEl = $('#closeup');
  function closeup(pages, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      let i = 0; E.busy++;
      const page = closeEl.querySelector('.page'), prev = closeEl.querySelector('.prev'), next = closeEl.querySelector('.next');
      const show = () => {
        const p = pages[i];
        page.className = 'page ' + (p.cls || '');
        page.style.backgroundImage = p.img ? `url(${(IMG[p.img] || {}).src || ''})` : 'none';
        page.innerHTML = p.html || '';
        if (p.canvas) { const c = document.createElement('canvas'); c.width = p.canvas.w; c.height = p.canvas.h; c.className = 'draw'; page.appendChild(c); p.canvas.draw(c); }
        prev.style.visibility = i > 0 ? 'visible' : 'hidden';
        next.style.visibility = i < pages.length - 1 ? 'visible' : 'hidden';
        Sound.sfx('page');
      };
      let closed = false;
      const close = () => { if (closed) return; closed = true; closeEl.classList.add('hidden'); prev.onclick = next.onclick = closeEl.onclick = null; E.busy--; resolve(); };
      prev.onclick = ev => { ev.stopPropagation(); if (i > 0) { i--; show(); } };
      next.onclick = ev => { ev.stopPropagation(); if (i < pages.length - 1) { i++; show(); } };
      closeEl.onclick = ev => { if (ev.target === closeEl || ev.target.classList.contains('x')) close(); };
      closeEl.classList.remove('hidden'); show();
      if (window.FAST) setTimeout(close, 60);
      else if (opts.auto) setTimeout(close, opts.auto);
    });
  }

  // ---------------------------------------------------------------- clock overlay
  function setClock(text) {
    const c = $('#clock');
    if (E.state) E.state.clockText = text || null; // the overlay is part of the save (Cais do Sodré countdown, the Carmo at midnight)
    if (!text) { c.classList.remove('on'); return; }
    if (c.textContent !== text) { c.textContent = text; c.classList.remove('tick'); void c.offsetWidth; c.classList.add('tick'); }
    c.classList.add('on');
  }

  Object.assign(E, { drawStill, showStill, endStill, stillTo, stillShowing, closeup, setClock });
})();
