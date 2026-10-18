// Input: what is under the cursor, hover names and cursor shapes, mouse / touch / keys, and the
// smart action on a target (walk up, reach, run its handler, fail lines).
(function () {
  const E = window.Engine;
  const { W, H, canvas, $, wrap, hoverEl, invBar, dialogEl, wait } = E;

  // ---------------------------------------------------------------- input
  let mouse = { x: -1, y: -1 }, hoverTarget = null;
  invBar.addEventListener('mouseenter', () => { E.invHover = true; invBar.classList.add('show'); });
  invBar.addEventListener('mouseleave', () => { E.invHover = false; if (!E.selItem) invBar.classList.remove('show'); });
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
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
  }
  canvas.addEventListener('mousemove', e => {
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
  canvas.addEventListener('click', e => {
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
  // long-press = examine on touch devices
  let pressT = null;
  canvas.addEventListener('touchstart', e => {
    const tch = e.touches[0]; const p = sceneCoords(tch);
    pressT = setTimeout(() => { pressT = null; const t = targetAt(p.x, p.y); if (t && !E.busy) interact(t, 'look'); }, 550);
  }, { passive: true });
  canvas.addEventListener('touchend', () => { if (pressT) clearTimeout(pressT); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === '.' || e.key === ' ') { if (E.skipFn) { E.skipFn(); e.preventDefault(); } return; }
    if (e.key === 'i' || e.key === 'I') invBar.classList.toggle('show');
    if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !e.altKey && $('#title').classList.contains('hidden')) E.readItem('notebook'); // (not on the title screen)
    const n = parseInt(e.key, 10);
    if (E.dialogResolve && n >= 1) { const btn = dialogEl.querySelectorAll('button')[n - 1]; if (btn) btn.click(); }
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
    if (actor && actor.visible) {
      const gap = (actor.height() + E.player.height()) * 0.21;
      if (y >= actor.y - 12 && Math.abs(x - actor.x) < gap) {
        const holds = !E.turnsFreely(actor) && (actor.dir === 'e' || actor.dir === 'w');
        const near = holds ? (actor.dir === 'e' ? 1 : -1) : (E.player.x < actor.x ? -1 : 1), opts = [near, -near].map(sd => E.clampToPoly(actor.x + sd * gap, y, E.room.walk));
        const best = opts.find(([cx]) => Math.abs(cx - actor.x) >= gap * 0.85) || opts.sort((a, b) => Math.abs(b[0] - actor.x) - Math.abs(a[0] - actor.x))[0];
        [x, y] = best;
      }
    }
    await E.player.walkTo(x, y);
    if (def.face) E.player.dir = def.face;
    else if (actor) {
      E.player.dir = actor.x > E.player.x ? 'e' : 'w';
      if (E.canTurn(actor) || (E.turnsFreely(actor) && !actor.def.fixedDir)) actor.dir = E.player.x > actor.x ? 'e' : 'w';
    }
  }
  // A failed use always gets an Alan line: the target's own, then a
  // character-specific refusal, then the shared pool (no immediate repeats).
  let lastFail = null;
  function failLine(t, verb) {
    if (t.def.fail) return t.def.fail;
    if (verb === 'item' && t.actor && FAIL_BY_CHAR[t.actor.id]) return FAIL_BY_CHAR[t.actor.id];
    if (verb === 'look') return 'alan_fail_look';
    if (verb === 'talk') return 'alan_fail_talk';
    if (verb === 'take' && Math.random() < 0.5) return 'alan_fail_take';
    let id; do { id = 'alan_fail_' + String(1 + Math.floor(Math.random() * 10)).padStart(2, '0'); } while (id === lastFail);
    return (lastFail = id);
  }
  const FAIL_BY_CHAR = { lacerda: 'alan_fail_lacerda_item', ze: 'alan_fail_ze_item', abilio: 'alan_fail_abilio_item', ines: 'alan_fail_ines_item', rui: 'alan_fail_rui_item' };
  async function interact(t, verb) {
    const def = t.def, item = verb === 'item' ? E.selItem : null;
    E.busy++;
    hideHover(); canvas.className = '';
    try {
      if (t.actor && t.actor !== E.player) { // Alan's lines go to whoever he is dealing with, and he turns to them
        E.lastPartner = t.actor;
        if (verb !== 'look' && verb !== 'exit' && E.canTurn(E.player) && Math.abs(t.actor.x - E.player.x) > 30) E.player.dir = t.actor.x > E.player.x ? 'e' : 'w';
      }
      if (def.ambient && verb !== 'look' && !(verb === 'talk' && def.talk) && !(item && def.items && def.items[item])) {
        if (item) { E.selItem = null; E.renderInv(); }
        await E.say('alan_npc_busy');
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
        await approach(def, t.actor);
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
