// Point-and-click engine: rooms, actors, verbs, inventory, dialogue, saves.
// Story content lives in story.js and drives everything through window.Game.
(function () {
  const { W, H } = Art;
  const canvas = document.getElementById('scene');
  const g = canvas.getContext('2d');
  g.imageSmoothingEnabled = false;
  const $ = s => document.querySelector(s);
  const sceneWrap = $('#scene-wrap'), speechEl = $('#speech'), narrEl = $('#narration'), hoverEl = $('#hover');
  const invEl = $('#inventory'), dialogEl = $('#dialog'), labelsEl = $('#labels');

  const SAVE_KEY = 'drowned-bell-save-v1';
  const COLORS = { alan: '#ffe6a8', ines: '#ff9a8a', rui: '#9ad0ff', amalia: '#d8a0ff', tomas: '#c8e8b0', lacerda: '#ff6a5a', narr: '#e8e0d0' };
  const NAMES = { alan: 'Alan', ines: 'Inês', rui: 'Rui', amalia: 'Amália', tomas: 'Father Tomás', lacerda: 'Lacerda', narr: '' };

  const ROOMS = {}, ITEMS = {}, CHARS = {};
  let state = freshState();
  let room = null, bg = null, fg = null, fogA = null, fogB = null;
  let player = null, npcs = [];
  let verb = 'walk', selItem = null;
  let busy = 0, hoverTarget = null, mouse = { x: -1, y: -1 };
  let skipFn = null, dialogResolve = null;
  let time = 0, last = performance.now();
  let started = false;

  function freshState() { return { room: 'shop', inv: [], flags: {}, px: 50, py: 112, dir: 's' }; }

  // ---------------------------------------------------------------- actors
  class Actor {
    constructor(id, spec, x, y, dir) {
      Object.assign(this, { id, spec, x, y, dir: dir || 's', frame: 0, ft: 0, walking: false, talking: false, visible: true, blink: false, scale: null });
      this.target = null; this.resolve = null; this.nextBlink = 2 + Math.random() * 3;
    }
    walkTo(x, y) {
      return new Promise(res => {
        if (this.resolve) this.resolve();
        if (Math.hypot(x - this.x, y - this.y) < 1.5) { res(); return; }
        this.target = { x, y }; this.resolve = res; this.walking = true;
      });
    }
    update(dt) {
      if (this.target) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y, d = Math.hypot(dx, dy);
        const sp = 50 * scaleAt(this.y) * dt;
        if (Math.abs(dx) > Math.abs(dy) * 1.1) this.dir = dx > 0 ? 'e' : 'w'; else this.dir = dy > 0 ? 's' : 'n';
        if (d <= sp) { this.x = this.target.x; this.y = this.target.y; this.stop(); }
        else { this.x += dx / d * sp; this.y += dy / d * sp; }
        this.ft += dt;
        if (this.ft > 0.13) { this.ft = 0; this.frame = (this.frame + 1) % 4; }
      }
      this.nextBlink -= dt;
      if (this.nextBlink < 0) { this.blink = !this.blink; this.nextBlink = this.blink ? 0.12 : 2 + Math.random() * 4; }
      if (this.talking) { this.mt = (this.mt || 0) + dt; if (this.mt > 0.11) { this.mt = 0; this.mouth = !this.mouth; } } else this.mouth = false;
    }
    stop() { this.target = null; this.walking = false; this.frame = 0; const r = this.resolve; this.resolve = null; if (r) r(); }
    get s() { return this.scale ? this.scale * SPRITE_SCALE : scaleAt(this.y); }
    bbox() { const s = this.s; return { x: this.x - 7 * s, y: this.y - 50 * s, w: 14 * s, h: 50 * s }; }
    draw() {
      if (!this.visible) return;
      const dir = this.dir === 'w' ? 'e' : this.dir;
      const spr = Art.drawSprite(CHARS[this.spec], dir, this.walking ? this.frame : 0, this.mouth, this.blink);
      const s = this.s, dw = Math.round(Art.SW * s), dh = Math.round(Art.SH * s);
      const dx = Math.round(this.x - 12 * s), dy = Math.round(this.y - 52 * s);
      g.save();
      if (this.dir === 'w') { g.translate(dx * 2 + dw, 0); g.scale(-1, 1); }
      g.drawImage(spr, dx, dy, dw, dh);
      g.restore();
      if (this.overlay) this.overlay(g, this);
    }
  }

  function scaleAt(y) {
    const sc = (room && room.scale) || [106, 0.85, 148, 1];
    const t = Math.max(0, Math.min(1, (y - sc[0]) / (sc[2] - sc[0])));
    return (sc[1] + (sc[3] - sc[1]) * t) * SPRITE_SCALE;
  }
  const SPRITE_SCALE = 1.3;

  // ---------------------------------------------------------------- geometry
  function inPoly(x, y, p) {
    let ins = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i], [xj, yj] = p[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
    }
    return ins;
  }
  function clampToPoly(x, y, p) {
    if (inPoly(x, y, p)) return [x, y];
    let best = null, bd = Infinity;
    for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length];
      const vx = bx - ax, vy = by - ay, l = vx * vx + vy * vy;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / l));
      const cx = ax + vx * t, cy = ay + vy * t, d = Math.hypot(x - cx, y - cy);
      if (d < bd) { bd = d; best = [cx, cy]; }
    }
    // nudge inside
    const mx = p.reduce((a, q) => a + q[0], 0) / p.length, my = p.reduce((a, q) => a + q[1], 0) / p.length;
    const dx = mx - best[0], dy = my - best[1], dl = Math.hypot(dx, dy) || 1;
    return [best[0] + dx / dl * 1.5, best[1] + dy / dl * 1.5];
  }

  // ---------------------------------------------------------------- rooms
  function buildLayer(fn) {
    if (!fn) return null;
    const [c, cg] = Art.mkCanvas(W, H);
    fn(cg);
    return c;
  }
  async function goRoom(id, entry, opts) {
    opts = opts || {};
    busy++;
    if (room && !opts.instant) { Sound.sfx('door'); await fade(true); }
    if (room && room.leave) room.leave();
    room = ROOMS[id];
    state.room = id;
    bg = buildLayer(room.draw);
    fg = buildLayer(room.fgDraw);
    if (room.fog) {
      fogA = Art.makeFog(room.id.length * 31 + 1, room.fogColor || 'rgba(214,218,214,A)');
      fogB = Art.makeFog(room.id.length * 17 + 7, room.fogColor || 'rgba(200,206,206,A)');
    }
    const e = (entry && room.entries && room.entries[entry]) || (room.entries && room.entries.default) || [160, 130, 's'];
    if (opts.pos) { player.x = opts.pos[0]; player.y = opts.pos[1]; player.dir = opts.pos[2] || 's'; }
    else { player.x = e[0]; player.y = e[1]; player.dir = e[2] || 's'; }
    player.stop();
    player.visible = room.player !== false;
    npcs = (room.npcs || []).filter(n => !n.when || n.when()).map(n => {
      const a = new Actor(n.id, n.spec || n.id, n.x, n.y, n.dir);
      a.def = n; a.scale = n.scale || null; a.overlay = n.overlay || null;
      return a;
    });
    renderLabels();
    Sound.playMusic(typeof room.music === 'function' ? room.music() : room.music);
    clearSpeech();
    if (!opts.instant) await fade(false);
    busy--;
    if (!opts.noEnter && room.enter) { busy++; try { await room.enter(entry); } finally { busy--; } }
    if (!room.noSave && !opts.noSave) autosave();
    updateHover();
  }
  function refreshNpcs() {
    const keep = new Map(npcs.map(a => [a.id, a]));
    npcs = (room.npcs || []).filter(n => !n.when || n.when()).map(n => keep.get(n.id) || Object.assign(new Actor(n.id, n.spec || n.id, n.x, n.y, n.dir), { def: n, scale: n.scale || null, overlay: n.overlay || null }));
  }
  function renderLabels() {
    labelsEl.innerHTML = '';
    for (const l of (room.labels || [])) {
      if (l.when && !l.when()) continue;
      const d = document.createElement('div');
      d.className = 'lbl'; d.textContent = l.text;
      d.style.left = (l.x / W * 100) + '%'; d.style.top = (l.y / H * 100) + '%';
      labelsEl.appendChild(d);
    }
  }
  function fade(on) {
    $('#fade').classList.toggle('on', on);
    return wait(470);
  }

  // ---------------------------------------------------------------- render loop
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    if (room) {
      player.update(dt); npcs.forEach(a => a.update(dt));
      g.drawImage(bg, 0, 0);
      if (room.anim) room.anim(g, time);
      const actors = npcs.filter(a => a.visible).concat(player.visible ? [player] : []);
      actors.sort((a, b) => a.y - b.y).forEach(a => a.draw());
      if (fg) g.drawImage(fg, 0, 0);
      if (room.animFg) room.animFg(g, time);
      if (room.fog) drawFog();
      if (room.tint) { g.fillStyle = room.tint; g.fillRect(0, 0, W, H); }
      positionSpeech();
    }
    requestAnimationFrame(frame);
  }
  function drawFog() {
    const f = typeof room.fog === 'function' ? room.fog() : room.fog;
    if (!f) return;
    const o1 = (time * 5) % (W * 2), o2 = (time * 9) % (W * 2);
    g.globalAlpha = f;
    g.drawImage(fogA, -o1, 0); g.drawImage(fogA, W * 2 - o1, 0);
    g.globalAlpha = f * 0.7;
    g.drawImage(fogB, -o2, 8); g.drawImage(fogB, W * 2 - o2, 8);
    g.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- speech
  let speaking = null;
  function actorFor(who) {
    if (who === 'alan') return player.visible ? player : null;
    return npcs.find(a => a.id === who && a.visible) || null;
  }
  function positionSpeech() {
    if (!speaking || !speaking.actor) return;
    const a = speaking.actor, b = a.bbox();
    let x = Math.max(20, Math.min(80, a.x / W * 100));
    const y = Math.max(16, (b.y - 3) / H * 100);
    speechEl.style.left = x + '%'; speechEl.style.top = y + '%';
  }
  function clearSpeech() {
    speechEl.style.display = 'none'; narrEl.style.display = 'none';
    if (speaking && speaking.actor) speaking.actor.talking = false;
    speaking = null;
  }
  const strip = t => t.replace(/\[[^\]]*\]\s*/g, '');

  // say(lineId) — shows subtitle + plays the ElevenLabs recording if present.
  async function say(id, opts) {
    opts = opts || {};
    const L = LINES[id];
    if (!L) { console.warn('missing line', id); return; }
    const [who, raw] = L;
    const text = strip(raw);
    busy++;
    clearSpeech();
    const actor = opts.offscreen ? null : actorFor(who);
    speaking = { id, actor };
    if (actor) {
      actor.talking = true;
      speechEl.textContent = text; speechEl.style.color = COLORS[who] || '#fff';
      speechEl.style.display = 'block'; positionSpeech();
    } else {
      narrEl.querySelector('.who').textContent = who === 'narr' ? '' : (opts.label || NAMES[who] || '') + ':';
      narrEl.querySelector('.txt').textContent = text;
      narrEl.querySelector('.txt').style.fontStyle = who === 'narr' ? 'italic' : 'normal';
      narrEl.querySelector('.txt').style.color = who === 'narr' ? '#e8e0d0' : COLORS[who];
      narrEl.style.display = 'block';
    }
    const dur = await Sound.playVoice(id);
    const ms = window.FAST ? 20 : dur ? dur * 1000 + 250 : Math.max(1600, text.length * 55);
    await new Promise(res => {
      let finished = false;
      const t = setTimeout(done, ms);
      function done() { if (finished) return; finished = true; clearTimeout(t); if (skipFn === done) skipFn = null; res(); }
      setTimeout(() => { if (!finished) skipFn = done; }, 180); // ignore the click that triggered the line
    });
    Sound.stopVoice();
    clearSpeech();
    busy--;
    await wait(120);
  }
  async function says(...ids) { for (const id of ids) await say(id); }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ---------------------------------------------------------------- dialogue menu
  // topics: [{ line: 'alan_xxx', when?, once?, run: async fn, bye? }]
  async function dialog(topics) {
    const used = new Set();
    for (;;) {
      const avail = topics.filter(t => (!t.when || t.when()) && !(t.once && used.has(t)));
      const pick = await new Promise(res => {
        dialogResolve = res;
        dialogEl.innerHTML = '';
        avail.forEach(t => {
          const b = document.createElement('button');
          b.textContent = t.label || strip(LINES[t.line][1]);
          b.onclick = e => { e.stopPropagation(); Sound.sfx('click'); res(t); };
          dialogEl.appendChild(b);
        });
        dialogEl.classList.add('open');
      });
      dialogResolve = null;
      dialogEl.classList.remove('open');
      used.add(pick);
      if (pick.line && !pick.silent) await say(pick.line);
      if (pick.run) await pick.run();
      if (pick.bye) return;
      if (pick.end && pick.end()) return;
    }
  }

  // ---------------------------------------------------------------- inventory
  function has(id) { return state.inv.includes(id); }
  function giveItem(id, silent) { if (!has(id)) { state.inv.push(id); if (!silent) Sound.sfx('pickup'); renderInv(); } }
  function takeItem(id) { state.inv = state.inv.filter(i => i !== id); if (selItem === id) selItem = null; renderInv(); }
  function renderInv() {
    invEl.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      const id = state.inv[i];
      if (id) {
        const it = ITEMS[id];
        const c = document.createElement('canvas'); c.width = 16; c.height = 16;
        c.getContext('2d').drawImage(Art.icon(it.icon || id), 0, 0);
        slot.appendChild(c);
        slot.title = itemName(id);
        if (selItem === id) slot.classList.add('selected');
        slot.onclick = e => { e.stopPropagation(); clickItem(id); };
        slot.onmouseenter = () => { hoverEl.textContent = statusFor(null, id); };
        slot.onmouseleave = () => updateHover();
        slot.oncontextmenu = e => { e.preventDefault(); e.stopPropagation(); if (!busy) lookItem(id); };
      }
      invEl.appendChild(slot);
    }
    updateCursor();
  }
  function itemName(id) { const it = ITEMS[id]; return typeof it.name === 'function' ? it.name() : it.name; }
  async function lookItem(id) {
    const it = ITEMS[id];
    busy++;
    try { await runHandler(typeof it.look === 'function' ? it.look : it.look, null); } finally { busy--; }
  }
  function clickItem(id) {
    if (busy) return;
    Sound.sfx('click');
    if (verb === 'look') { lookItem(id); return; }
    if (verb === 'use' && selItem && selItem !== id) {
      const a = ITEMS[selItem], b = ITEMS[id];
      const h = (a.with && a.with[id]) || (b.with && b.with[selItem]);
      busy++;
      runHandler(h || 'alan_def_item').finally(() => { busy--; });
      selItem = null; renderInv(); setVerb('walk');
      return;
    }
    selItem = selItem === id ? null : id;
    setVerb('use', true);
    renderInv();
  }
  function updateCursor() {
    if (selItem) {
      const [c, cg] = Art.mkCanvas(32, 32);
      cg.drawImage(Art.icon(ITEMS[selItem].icon || selItem), 0, 0, 32, 32);
      sceneWrap.style.cursor = `url(${c.toDataURL()}) 4 4, crosshair`;
    } else sceneWrap.style.cursor = 'crosshair';
  }

  // ---------------------------------------------------------------- verbs + input
  function setVerb(v, keepItem) {
    verb = v;
    if (!keepItem) { selItem = null; renderInv(); }
    document.querySelectorAll('#verbs button').forEach(b => b.classList.toggle('active', b.dataset.verb === v));
    updateHover();
  }
  const VERB_ORDER = ['walk', 'look', 'take', 'use', 'talk'];
  const VERB_LABEL = { walk: 'Walk to', look: 'Look at', take: 'Take', use: 'Use', talk: 'Talk to' };

  function targetAt(x, y) {
    if (!room) return null;
    const people = npcs.filter(a => a.visible && a.def).sort((a, b) => b.y - a.y);
    for (const a of people) { const b = a.bbox(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return { kind: 'npc', actor: a, def: a.def }; }
    const hs = room.hotspots || [];
    for (let i = hs.length - 1; i >= 0; i--) {
      const h = hs[i];
      if (h.when && !h.when()) continue;
      const [rx, ry, rw, rh] = h.rect;
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) return { kind: 'hot', def: h };
    }
    return null;
  }
  function nameOf(t) { const n = t.def.name; return typeof n === 'function' ? n() : n; }
  function statusFor(t, invId) {
    if (invId) {
      if (selItem && selItem !== invId && verb === 'use') return `Use ${itemName(selItem)} with ${itemName(invId)}`;
      return `${verb === 'look' ? 'Look at' : 'Use'} ${itemName(invId)}`;
    }
    if (verb === 'use' && selItem) return `Use ${itemName(selItem)} with ${t ? nameOf(t) : '…'}`;
    if (!t) return verb === 'walk' ? '' : VERB_LABEL[verb];
    if (t.def.exit && verb === 'walk') return nameOf(t);
    return `${VERB_LABEL[verb]} ${nameOf(t)}`;
  }
  function updateHover() {
    if (busy || !room) { hoverEl.textContent = ''; return; }
    hoverTarget = mouse.x >= 0 ? targetAt(mouse.x, mouse.y) : null;
    hoverEl.textContent = statusFor(hoverTarget);
  }
  function sceneCoords(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
  }

  sceneWrap.addEventListener('mousemove', e => { const p = sceneCoords(e); mouse = p; updateHover(); });
  sceneWrap.addEventListener('mouseleave', () => { mouse = { x: -1, y: -1 }; hoverEl.textContent = ''; });
  sceneWrap.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (skipFn) { skipFn(); return; }
    if (busy) return;
    if (selItem) { selItem = null; renderInv(); }
    setVerb(VERB_ORDER[(VERB_ORDER.indexOf(verb) + 1) % VERB_ORDER.length]);
  });
  sceneWrap.addEventListener('click', e => {
    if (skipFn) { skipFn(); return; }
    if (busy || !room) return;
    const p = sceneCoords(e);
    const t = targetAt(p.x, p.y);
    if (!t) {
      if (room.walk && player.visible) { const [x, y] = clampToPoly(p.x, p.y, room.walk); player.walkTo(x, y); }
      if (selItem) { selItem = null; renderInv(); setVerb('walk'); }
      return;
    }
    interact(t);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === '.' || e.key === ' ') { if (skipFn) { skipFn(); e.preventDefault(); } return; }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 5 && !busy) setVerb(VERB_ORDER[n - 1]);
    if (dialogResolve && n >= 1) { const btn = dialogEl.querySelectorAll('button')[n - 1]; if (btn) btn.click(); }
  });
  document.querySelectorAll('#verbs button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); if (!busy) { Sound.sfx('click'); setVerb(b.dataset.verb); } }));

  // Resolve and run a handler: string line id, array of ids, or async fn.
  async function runHandler(h, ctx) {
    if (!h) return;
    if (typeof h === 'string') return say(h);
    if (Array.isArray(h)) { for (const x of h) await runHandler(x, ctx); return; }
    if (typeof h === 'function') return h(ctx);
  }
  async function approach(def, actor) {
    if (!player.visible || !room.walk) return;
    let at = def.at;
    if (!at && actor) at = [actor.x + (actor.x > player.x ? -22 : 22), Math.max(actor.y + 4, room.walk[0][1] + 2)];
    if (!at) return;
    const [x, y] = clampToPoly(at[0], at[1], room.walk);
    await player.walkTo(x, y);
    if (def.face) player.dir = def.face;
    else if (actor) player.dir = actor.x > player.x ? 'e' : 'w';
  }
  async function interact(t) {
    const def = t.def, item = verb === 'use' ? selItem : null, v = verb;
    busy++;
    hoverEl.textContent = '';
    try {
      if (v === 'walk') {
        if (def.exit) { await approach(def, t.actor); await goRoom(def.exit, def.entry || room.id); }
        else await approach(def, t.actor);
        return;
      }
      if (v === 'look') {
        await runHandler(def.look || 'alan_def_look', t);
        return;
      }
      if (def.exit && !item) { await approach(def, t.actor); await goRoom(def.exit, def.entry || room.id); return; }
      await approach(def, t.actor);
      if (item) {
        const h = (def.items && (def.items[item] || def.items.any)) || 'alan_def_item';
        selItem = null; renderInv(); setVerb('walk');
        await runHandler(h, t);
      } else if (v === 'take') await runHandler(def.take || 'alan_def_take', t);
      else if (v === 'use') await runHandler(def.use || 'alan_def_use', t);
      else if (v === 'talk') await runHandler(def.talk || 'alan_def_talk', t);
    } finally {
      busy--;
      if (!busy) { if (verb !== 'walk' && verb !== 'use') setVerb('walk'); updateHover(); }
    }
  }

  // ---------------------------------------------------------------- saves
  function snapshot() {
    return JSON.stringify(Object.assign({}, state, { px: player.x, py: player.y, dir: player.dir }));
  }
  function autosave() { try { localStorage.setItem(SAVE_KEY, snapshot()); } catch (e) { /* storage unavailable */ } }
  function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
  async function loadSave(json) {
    let data = json;
    if (!data) { try { data = localStorage.getItem(SAVE_KEY); } catch (e) { data = null; } }
    if (!data) return false;
    state = Object.assign(freshState(), JSON.parse(data));
    selItem = null; renderInv();
    room = null;
    await goRoom(state.room, null, { pos: [state.px, state.py, state.dir], noEnter: true });
    return true;
  }
  function checkpoint() { state.flags._checkpoint = null; state.flags._checkpoint = snapshot(); }

  // ---------------------------------------------------------------- cards & modals
  async function card(t1, t2, ms) {
    const c = $('#card');
    c.querySelector('.t1').textContent = t1; c.querySelector('.t2').textContent = t2;
    c.classList.add('on');
    await wait(ms || 2600);
    c.classList.remove('on');
  }
  function showModal(id, on) { $('#' + id).classList.toggle('hidden', !on); }

  // ---------------------------------------------------------------- options
  function syncOptions() {
    $('#opt-music').classList.toggle('off', !Sound.musicOn);
    $('#opt-voice').classList.toggle('off', !Sound.voiceOn);
  }
  $('#opt-music').onclick = e => { e.stopPropagation(); Sound.setMusic(!Sound.musicOn); syncOptions(); };
  $('#opt-voice').onclick = e => { e.stopPropagation(); Sound.setVoice(!Sound.voiceOn); syncOptions(); };
  $('#opt-save').onclick = e => { e.stopPropagation(); if (busy) return; autosave(); flash('Game saved.'); };
  $('#opt-load').onclick = async e => { e.stopPropagation(); if (busy) return; if (await loadSave()) flash('Game loaded.'); else flash('No saved game.'); };
  function flash(msg) { hoverEl.textContent = msg; setTimeout(updateHover, 1400); }

  // ---------------------------------------------------------------- boot
  function init(chars, items, rooms) {
    Object.assign(CHARS, chars); Object.assign(ITEMS, items); Object.assign(ROOMS, rooms);
    for (const id in ROOMS) ROOMS[id].id = id;
    player = new Actor('alan', 'alan', 50, 112, 's');
    renderInv(); setVerb('walk'); syncOptions();
    // Title art
    const tc = document.getElementById('title-canvas').getContext('2d');
    Art.BG.title(tc);
    const fog = Art.makeFog(3, 'rgba(180,190,200,A)');
    let tt = 0;
    (function titleLoop() {
      if (started) return;
      tt += 0.016;
      tc.clearRect(0, 0, W, H); Art.BG.title(tc);
      tc.globalAlpha = 0.5; tc.drawImage(fog, -(tt * 8 % (W * 2)), 0); tc.drawImage(fog, W * 2 - (tt * 8 % (W * 2)), 0); tc.globalAlpha = 1;
      setTimeout(() => requestAnimationFrame(titleLoop), 60);
    })();
    $('#btn-continue').disabled = !hasSave();
    Sound.loadManifest();
    requestAnimationFrame(frame);
  }
  async function begin(fresh) {
    Sound.init();
    started = true;
    showModal('title', false);
    if (fresh || !(await loadSave())) {
      state = freshState(); renderInv();
      await window.Story.newGame();
    }
  }

  window.Game = {
    init, begin, goRoom, say, says, wait, dialog, card, fade, checkpoint, loadSave, autosave, showModal, refreshNpcs, renderLabels,
    giveItem, takeItem, has, setVerb,
    get state() { return state; }, get isBusy() { return busy > 0 || !!dialogResolve || (player && player.walking); }, get flags() { return state.flags; },
    get player() { return player; }, get room() { return room; },
    npc: id => npcs.find(a => a.id === id),
    busy: async fn => { busy++; try { return await fn(); } finally { busy--; updateHover(); } },
    Actor,
  };
})();
