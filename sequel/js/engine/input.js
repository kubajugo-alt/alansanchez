// Input: what is under the cursor, hover names and cursor shapes, mouse / touch / keys, and the
// smart action on a target (walk up, reach, run its handler, fail lines).
(function () {
  const E = window.Engine;
  const { W, H, canvas, $, wrap, hoverEl, invBar, dialogEl, wait } = E;

  // ---------------------------------------------------------------- input
  let mouse = { x: -1, y: -1 }, hoverTarget = null;
  // only the box of items takes the mouse: the faded band around it lets clicks through to the scene (an exit along the
  // bottom edge, like the antiques shop's door, stays clickable with the bar open)
  E.invEl.addEventListener('mouseenter', () => { E.invHover = true; invBar.classList.add('show'); });
  E.invEl.addEventListener('mouseleave', () => { E.invHover = false; if (!E.selItem) invBar.classList.remove('show'); });
  $('#bag').addEventListener('click', e => { e.stopPropagation(); invBar.classList.toggle('show'); });
  $('#nb-btn').addEventListener('click', e => { e.stopPropagation(); E.readItem('notebook'); });

  function targetAt(x, y) {
    if (!E.room) return null;
    if (E.selItem && E.player.visible) {
      const b = E.player.bbox();
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return { kind: 'self', def: { name: 'Alan', items: (E.room.self && E.room.self.items) || {} } };
    }
    // the smallest hotspot under the cursor wins, so a box of matches on the bar
    // or a tile on the bunk is never swallowed by the bigger thing around it;
    // small props also win over the empty corners of a person's bounding box
    let best = null, bestA = Infinity;
    for (const h of E.room.hotspots || []) {
      if (h.when && !h.when()) continue;
      if (!E.hitShape(h, x, y)) continue;
      const ar = E.hotArea(h); if (ar <= bestA) { best = h; bestA = ar; }
    }
    const people = E.npcs.filter(a => a.visible && a.def).sort((a, b) => b.y - a.y);
    const inBox = a => { const b = a.bbox(); return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; };
    // a click on someone's painted body is always that person
    for (const a of people) if (inBox(a) && a.opaqueAt(x, y)) return { kind: 'npc', actor: a, def: a.def };
    if (best && bestA < 5000) return { kind: 'hot', def: best };
    for (const a of people) if (inBox(a)) return { kind: 'npc', actor: a, def: a.def };
    return best ? { kind: 'hot', def: best } : null;
  }
  function nameOf(t) { const n = t.def.name; return typeof n === 'function' ? n() : n; }
  // What a left click does on a target (Broken Sword-style smart action).
  function defaultVerb(def) {
    if (def.ambient) return def.talk ? 'talk' : 'look';
    if (def.exit) return 'exit';
    if (def.talk) return 'talk';
    if (def.use) return 'use';
    if (def.take) return 'take';
    return 'look';
  }
  const CURSOR_CLASS = { exit: 'c-exit', talk: 'c-talk', use: 'c-use', take: 'c-use', look: 'c-look' };
  function updateHover() {
    if (E.busy || !E.room || mouse.x < 0) { hideHover(); canvas.className = ''; return; }
    hoverTarget = targetAt(mouse.x, mouse.y);
    if (!hoverTarget) { canvas.className = ''; hideHover(); return; }
    canvas.className = E.selItem ? '' : CURSOR_CLASS[defaultVerb(hoverTarget.def)];
    const name = nameOf(hoverTarget);
    showHoverText(E.selItem ? `Use ${E.itemName(E.selItem)} on ${name}` : name);
  }
  function showHoverText(txt, el) {
    hoverEl.textContent = txt; hoverEl.style.display = txt ? 'block' : 'none';
    if (el) {
      const r = el.getBoundingClientRect(), gr = wrap.getBoundingClientRect();
      hoverEl.style.left = ((r.left + r.width / 2 - gr.left) / gr.width * 100) + '%';
      hoverEl.style.top = ((r.top - gr.top) / gr.height * 100 - 4) + '%';
    }
    else { hoverEl.style.left = (mouse.x / W * 100) + '%'; hoverEl.style.top = (mouse.y / H * 100 - 5) + '%'; }
    if (txt) E.keepInside(hoverEl, 8);
  }
  function hideHover() { hoverEl.style.display = 'none'; }
  function sceneCoords(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
    if (window.Parallax && Parallax.active && E.room && E.room.depth) { const [ux, uy] = Parallax.unzoom(x, y); return { x: ux, y: uy }; } // (the parallax zoom)
    return { x, y };
  }
  canvas.addEventListener('mousemove', e => {
    kbAt = -1; // (the mouse takes over from the keyboard)
    mouse = sceneCoords(e); updateHover();
    if (mouse.y > H - 60 && !E.busy) invBar.classList.add('show');
    else if (!E.invHover && !E.selItem && mouse.y < H - 140) invBar.classList.remove('show');
  });
  canvas.addEventListener('mouseleave', () => { mouse = { x: -1, y: -1 }; hideHover(); });
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (E.skipFn) { E.skipFn(); return; }
    if (E.busy) return;
    if (E.selItem) { E.selItem = null; E.renderInv(); updateHover(); return; }
    const p = sceneCoords(e), t = targetAt(p.x, p.y);
    if (t) interact(t, 'look');
  });
  let pressFired = 0; // when a long-press examined something: the click the browser sends on lifting the finger is swallowed
  canvas.addEventListener('click', e => {
    if (pressFired && performance.now() - pressFired < 1500) { pressFired = 0; return; } // (else it would skip the line just begun)
    pressFired = 0;
    if (E.skipFn) { E.skipFn(); return; }
    if (E.busy || !E.room) return;
    const p = sceneCoords(e);
    const t = targetAt(p.x, p.y);
    if (!t) {
      if (E.room.walk && E.player.visible) { const [x, y] = E.clampToPoly(p.x, p.y, E.room.walk); E.player.walkTo(x, y); }
      if (E.selItem) { E.selItem = null; E.renderInv(); }
      return;
    }
    interact(t, E.selItem ? 'item' : defaultVerb(t.def));
  });
  // ---------------------------------------------------------------- show what can be clicked (H, the ◎ button)
  const marksEl = $('#marks'); let marksT = null;
  function showHotspots() {
    if (!E.room || E.cutscene || E.still || !marksEl) return;
    const P = window.Parallax && Parallax.active && E.room.depth ? Parallax : null;
    const put = (x, y, fx, fy) => P ? P.at(x, y, fx, fy) : [x, y];
    const marks = [];
    for (const h of (E.room.hotspots || [])) {
      if (h.when && !h.when()) continue;
      let x, y;
      if (h.rect) { x = h.rect[0] + h.rect[2] / 2; y = h.rect[1] + h.rect[3] / 2; }
      else if (h.poly) { x = h.poly.reduce((s, p) => s + p[0], 0) / h.poly.length; y = h.poly.reduce((s, p) => s + p[1], 0) / h.poly.length; }
      else continue;
      marks.push({ x, y, fx: h.at ? h.at[0] : x, fy: h.at ? h.at[1] : y, name: typeof h.name === 'function' ? h.name() : h.name, exit: !!h.exit });
    }
    for (const a of E.npcs) if (a.visible && a.def && a.def.name) marks.push({ x: a.x, y: a.y - a.height() * 0.55, fx: a.x, fy: a.y, name: typeof a.def.name === 'function' ? a.def.name() : a.def.name });
    marksEl.innerHTML = '';
    for (const m of marks) {
      const [sx, sy] = put(m.x, m.y, m.fx, m.fy), d = document.createElement('div');
      d.className = 'mk' + (m.exit ? ' exit' : ''); d.style.left = (sx / W * 100) + '%'; d.style.top = (sy / H * 100) + '%';
      d.innerHTML = '<i></i><span></span>'; d.querySelector('span').textContent = m.name || '';
      marksEl.appendChild(d);
    }
    marksEl.classList.add('on'); clearTimeout(marksT);
    marksT = setTimeout(() => marksEl.classList.remove('on'), 2600);
  }
  $('#hot-btn').addEventListener('click', e => { e.stopPropagation(); showHotspots(); });

  // ---------------------------------------------------------------- playing by keyboard
  // Tab / Shift+Tab step through what can be clicked in the room, left to right (its name shows as on hover); Enter
  // does what a click would (with the selected item, if any), L looks at it
  let kbAt = -1, kbList = [];
  function clickables() {
    const out = [];
    for (const h of (E.room.hotspots || [])) {
      if (h.when && !h.when()) continue;
      const c = h.rect ? [h.rect[0] + h.rect[2] / 2, h.rect[1] + h.rect[3] / 2] : h.poly ? [h.poly.reduce((s, p) => s + p[0], 0) / h.poly.length, h.poly.reduce((s, p) => s + p[1], 0) / h.poly.length] : null;
      if (c) out.push({ t: { kind: 'hot', def: h }, x: c[0], y: c[1] });
    }
    for (const a of E.npcs) if (a.visible && a.def && a.def.name) out.push({ t: { kind: 'npc', actor: a, def: a.def }, x: a.x, y: a.y - a.height() * 0.55 });
    return out.sort((p, q) => p.x - q.x);
  }
  function kbStep(dir) {
    kbList = clickables(); if (!kbList.length) return;
    kbAt = kbAt < 0 ? (dir > 0 ? 0 : kbList.length - 1) : (kbAt + dir + kbList.length) % kbList.length;
    const k = kbList[kbAt]; mouse = { x: k.x, y: k.y }; hoverTarget = k.t;
    const name = nameOf(k.t);
    showHoverText(E.selItem ? `Use ${E.itemName(E.selItem)} on ${name}` : name);
  }
  // double-click: on the way to an exit, go straight through; any other walk, hurry (twice the pace to the end of it)
  canvas.addEventListener('dblclick', () => {
    const p = E.player; if (!p || !p.walking || E.cutscene) return;
    if (E.exitWalk) p.stop(); else p.hurry = true;
  });
  // long-press = examine on touch devices
  // (a finger that moves more than about 10 px is a drag, not a press)
  let pressT = null, pressAt = null;
  canvas.addEventListener('touchstart', e => {
    const tch = e.touches[0]; const p = sceneCoords(tch); pressAt = [tch.clientX, tch.clientY];
    pressT = setTimeout(() => { pressT = null; const t = targetAt(p.x, p.y); if (t && !E.busy) { pressFired = performance.now(); interact(t, 'look'); } }, 550);
  }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    const tch = e.touches[0]; if (!pressT || !tch || !pressAt) return;
    if (Math.hypot(tch.clientX - pressAt[0], tch.clientY - pressAt[1]) > 10) { clearTimeout(pressT); pressT = null; }
  }, { passive: true });
  canvas.addEventListener('touchend', () => { if (pressT) clearTimeout(pressT); pressT = null; });
  document.addEventListener('keydown', e => {
    // a close-up: Escape closes it, the arrows turn its pages
    const cu = $('#closeup');
    if (cu && !cu.classList.contains('hidden')) {
      const b = e.key === 'Escape' ? '.x' : e.key === 'ArrowLeft' ? '.prev' : e.key === 'ArrowRight' ? '.next' : null;
      if (b) { const el = cu.querySelector(b); if (el && el.offsetParent !== null) el.click(); e.preventDefault(); return; }
    }
    // dialogue choices: up and down move between them (Enter picks; 1-9 as before)
    if (E.dialogResolve && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const bs = [...dialogEl.querySelectorAll('button')], i = bs.indexOf(document.activeElement);
      const n = bs[(i < 0 ? (e.key === 'ArrowDown' ? 0 : bs.length - 1) : i + (e.key === 'ArrowDown' ? 1 : -1) + bs.length) % bs.length];
      if (n) { n.focus(); e.preventDefault(); } return;
    }
    const inGame = E.room && !E.busy && !E.dialogResolve && !E.cutscene && $('#title').classList.contains('hidden') && !document.querySelector('.modal:not(.hidden)') && !$('#menu').classList.contains('open');
    if (e.key === 'Tab' && inGame) { kbStep(e.shiftKey ? -1 : 1); e.preventDefault(); return; }
    if ((e.key === 'Enter' || e.key === 'l' || e.key === 'L') && inGame && kbAt >= 0 && kbList[kbAt]) {
      const t = kbList[kbAt].t; kbAt = -1; hideHover(); e.preventDefault();
      interact(t, e.key === 'Enter' ? (E.selItem ? 'item' : defaultVerb(t.def)) : 'look'); return;
    }
    if (e.key === 'Escape' || e.key === '.' || e.key === ' ') { if (E.skipFn) { E.skipFn(); e.preventDefault(); } return; }
    if ((e.key === 'i' || e.key === 'I') && !E.still) invBar.classList.toggle('show');
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey && $('#title').classList.contains('hidden')) showHotspots();
    if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !e.altKey && $('#title').classList.contains('hidden')) E.readItem('notebook'); // (not on the title screen)
    const n = parseInt(e.key, 10);
    if (E.dialogResolve && n >= 1) { const btn = dialogEl.querySelectorAll('button')[n - 1]; if (btn) btn.click(); }
    else if (n >= 1 && invBar.classList.contains('show')) { const slot = E.invEl.querySelectorAll('.slot')[n - 1]; if (slot) slot.click(); } // (the inventory open: 1-9 pick an item)
  });

  async function runHandler(h, ctx) {
    if (!h) return;
    if (typeof h === 'string') return E.say(LINES[h] ? h : failLine(ctx || { def: {} }, 'use'));
    if (Array.isArray(h)) { for (const x of h) await runHandler(x, ctx); return; }
    if (typeof h === 'function') return h(ctx);
  }
  async function approach(def, actor) {
    if (!E.player.visible || !E.room.walk) return;
    let at = def.at;
    if (!at && actor) {
      // someone who keeps their facing is met on the side they face; anyone else on Alan's side
      const gap = actor.height() * 0.42, holds = !E.turnsFreely(actor) && (actor.dir === 'e' || actor.dir === 'w');
      const side = holds ? (actor.dir === 'e' ? 1 : -1) : (actor.x > E.player.x ? -1 : 1);
      at = [actor.x + side * gap, actor.y + 6];
    }
    if (!at) return;
    let [x, y] = E.clampToPoly(at[0], at[1], E.room.walk);
    // talking to someone: stand beside them, never in front covering them. If the spot would put
    // Alan over the figure (closer than the two half-widths, at or in front of their depth), step
    // out to whichever side of them is free on the floor, nearer side first.
    // (a spot the room names, def.at, is where the scene wants him: kept as it is)
    if (actor && actor.visible && !def.at) {
      const gap = (actor.height() + E.player.height()) * 0.21;
      if (y >= actor.y - 12 && Math.abs(x - actor.x) < gap) {
        const holds = !E.turnsFreely(actor) && (actor.dir === 'e' || actor.dir === 'w');
        const near = holds ? (actor.dir === 'e' ? 1 : -1) : (E.player.x < actor.x ? -1 : 1), opts = [near, -near].map(sd => E.clampToPoly(actor.x + sd * gap, y, E.room.walk));
        const best = opts.find(([cx]) => Math.abs(cx - actor.x) >= gap * 0.85) || opts.sort((a, b) => Math.abs(b[0] - actor.x) - Math.abs(a[0] - actor.x))[0];
        [x, y] = best;
      }
    }
    // the way he'll end up facing, so a short step into place is taken already facing it
    const end = def.face || (actor && Math.abs(actor.x - x) > 12 ? (actor.x > x ? 'e' : 'w') : null);
    await E.player.walkTo(x, y, end);
    if (def.face) E.player.dir = def.face;
    else if (actor) {
      if (Math.abs(actor.x - E.player.x) > 12 || E.player.dir === 'n' || E.player.dir === 's') E.player.dir = actor.x > E.player.x ? 'e' : 'w'; // (right on top of them: keep the way he came)
      if (E.canTurn(actor) || (E.turnsFreely(actor) && !actor.def.fixedDir)) actor.dir = E.player.x > actor.x ? 'e' : 'w';
    }
  }
  // A failed use always gets an Alan line: the target's own, then a
  // character-specific refusal, then the shared pool (no immediate repeats).
  let lastFail = null;
  function failLine(t, verb) {
    if (t.def.fail) return t.def.fail;
    if (verb === 'item' && t.actor && FAIL_BY_CHAR[t.actor.id]) return FAIL_BY_CHAR[t.actor.id];
    const who = E.player.speaker || 'alan'; // (Vasco has his own, in his chapter)
    if (verb === 'look') return who + '_fail_look';
    if (verb === 'talk') return who + '_fail_talk';
    if (verb === 'take' && Math.random() < 0.5) return who + '_fail_take';
    let id; do { id = who + '_fail_' + String(1 + Math.floor(Math.random() * 10)).padStart(2, '0'); } while (id === lastFail);
    return (lastFail = id);
  }
  const FAIL_BY_CHAR = window.FAIL_BY_CHAR || {}; // npc id -> the line for an item they won't take (the story's)
  async function interact(t, verb) {
    const def = t.def, item = verb === 'item' ? E.selItem : null;
    E.busy++;
    hideHover(); canvas.className = '';
    try {
      if (t.actor && t.actor !== E.player) { // Alan's lines go to whoever he is dealing with, and he turns to them
        E.lastPartner = t.actor;
        // (only when he won't walk to them: a walk sets his facing at the end, and turning first to then walk away is a flick)
        if (verb !== 'look' && verb !== 'exit' && !(E.player.visible && E.room.walk && (t.def.at || t.actor)) && E.canTurn(E.player) && Math.abs(t.actor.x - E.player.x) > 30) E.player.dir = t.actor.x > E.player.x ? 'e' : 'w';
      }
      if (def.ambient && verb !== 'look' && !(verb === 'talk' && def.talk) && !(item && def.items && def.items[item])) {
        if (item) { E.selItem = null; E.renderInv(); }
        await E.say((E.player.speaker || 'alan') + '_npc_busy');
        return;
      }
      if (t.kind === 'self') {
        const h = def.items[item] || def.items.any;
        E.selItem = null; E.renderInv(); invBar.classList.remove('show');
        await runHandler(h || failLine(t, 'item'), t); return;
      }
      if (verb === 'look') {
        if (E.player.visible && def.at && !t.actor) E.player.dir = def.at[0] > E.player.x ? 'e' : 'w';
        if (t.actor && t.actor !== E.player && E.canTurn(E.player) && Math.abs(t.actor.x - E.player.x) > 30) E.player.dir = t.actor.x > E.player.x ? 'e' : 'w';
        await runHandler(def.look || failLine(t, 'look'), t); return;
      }
      if (verb === 'exit') {
        if (def.locked && def.locked()) {
          if (def.exit) Sound.sfx('door_rattle', 0.6);
          await E.say((typeof def.lockedLine === 'function' ? def.lockedLine() : def.lockedLine) || 'alan_fail_04');
          return;
        }
        E.exitWalk = true; // (a double-click now goes straight through)
        try { await approach(def, t.actor); } finally { E.exitWalk = false; }
        await E.goRoom(typeof def.exit === 'function' ? def.exit() : def.exit, def.entry || E.room.id); return;
      }
      if (t.actor) t.actor.engaged++;
      await approach(def, t.actor);
      if ((verb === 'take' || verb === 'use' || item) && E.player.visible && def.reach !== false) await reach(t);
      if (item) {
        const h = def.items && (def.items[item] || def.items.any);
        E.selItem = null; E.renderInv(); invBar.classList.remove('show');
        await runHandler(h || failLine(t, 'item'), t);
      } else await runHandler(def[verb] || failLine(t, verb), t);
    } finally {
      if (t.actor) { t.actor.engaged = Math.max(0, t.actor.engaged - 1); t.actor.resumeT = 1.4; }
      E.busy--;
      if (E.room && E.room.onAction && verb !== 'exit') { E.busy++; try { await E.room.onAction(t, verb); } finally { E.busy--; } }
      updateHover();
      // every finished action is autosaved: a walk through a door (goRoom's own autosave is skipped while
      // the click is still running), an item taken, a puzzle solved, a conversation over
      if (!E.busy && !E.dialogResolve && !E.cutscene && E.room && !E.room.noSave) E.autosave();
    }
  }
  // Alan reaches toward what he takes, uses or hands over.
  async function reach(t) {
    const cx = t.actor ? t.actor.x : t.def.rect ? t.def.rect[0] + t.def.rect[2] / 2 : E.player.x;
    if (Math.abs(cx - E.player.x) > 8) E.player.dir = cx > E.player.x ? 'e' : 'w';
    else if (E.player.dir === 'n' || E.player.dir === 's') E.player.dir = E.player.lastFlip ? 'w' : 'e';
    E.player.pose = 'reach';
    await wait(window.FAST ? 30 : 520);
    E.player.pose = null;
  }

  Object.assign(E, { defaultVerb, updateHover, showHoverText, hideHover, runHandler, interact, reach });
})();
