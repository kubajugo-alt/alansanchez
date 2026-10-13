// Point-and-click engine: painted backgrounds, painted sprite actors, smart
// cursor (left = act, right = examine), inventory bar, dialogue, cutscenes, saves.
(function () {
  const W = 1280, H = 720;
  const canvas = document.getElementById('scene');
  const g = canvas.getContext('2d');
  const $ = s => document.querySelector(s);
  const wrap = $('#game'), speechEl = $('#speech'), narrEl = $('#narration'), hoverEl = $('#hover');
  const invEl = $('#inventory'), invBar = $('#invbar'), dialogEl = $('#dialog'), labelsEl = $('#labels');

  const SAVE_KEY = 'drowned-bell-save-v2';
  const COLORS = { alan: '#ffe2a0', ines: '#ffab9a', rui: '#a8d4ff', amalia: '#e2b0ff', tomas: '#cfeab8', lacerda: '#ff7d6a', narr: '#eee6d6' };
  const NAMES = { alan: 'Alan', ines: 'Inês', rui: 'Rui', amalia: 'Amália', tomas: 'Father Tomás', lacerda: 'Lacerda', narr: '' };

  const ROOMS = {}, ITEMS = {}, CHARS = {};
  const IMG = {}; // loaded images by key
  let state = freshState();
  let room = null, fogA = null, fogB = null;
  let player = null, npcs = [];
  let selItem = null;
  let busy = 0, mouse = { x: -1, y: -1 }, hoverTarget = null;
  let skipFn = null, dialogResolve = null;
  let time = 0, last = performance.now();

  function freshState() { return { room: 'shop', inv: [], flags: {}, px: 300, py: 600, dir: 'w' }; }

  // ---------------------------------------------------------------- assets
  function loadImage(key, src) {
    if (IMG[key]) return Promise.resolve(IMG[key]);
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { IMG[key] = im; res(im); };
      im.onerror = () => { console.warn('missing', src); res(null); };
      im.src = src;
    });
  }
  async function preload(onProgress) {
    const jobs = [];
    for (const id in ROOMS) if (ROOMS[id].bg) jobs.push(['bg:' + ROOMS[id].bg, 'art/bg/' + ROOMS[id].bg + '.jpg']);
    for (const k in SPRITES) jobs.push(['spr:' + k, 'art/sprites/' + k + '.webp']);
    let done = 0;
    await Promise.all(jobs.map(([k, s]) => loadImage(k, s).then(() => onProgress && onProgress(++done / jobs.length))));
  }

  // ---------------------------------------------------------------- actors
  class Actor {
    constructor(id, ch, x, y, dir) {
      Object.assign(this, { id, ch, x, y, dir: dir || 'e', walking: false, talking: false, visible: true, phase: 0, h: null });
      this.target = null; this.resolve = null; this.talkT = 0; this.talkPose = true;
    }
    get c() { return CHARS[this.ch]; }
    walkTo(x, y) {
      return new Promise(res => {
        if (this.resolve) this.resolve();
        if (Math.hypot(x - this.x, y - this.y) < 2) { res(); return; }
        this.target = { x, y }; this.resolve = res; this.walking = true;
      });
    }
    update(dt) {
      if (this.target) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y, d = Math.hypot(dx, dy);
        const hh = this.height();
        const sp = hh * 0.5 * dt * (this.c.speed || 1);
        if (Math.abs(dx) > Math.abs(dy) * 0.9 || !this.c.frames.front) this.dir = dx > 0 ? 'e' : 'w';
        else this.dir = dy > 0 ? 's' : 'n';
        if (d <= sp) { this.x = this.target.x; this.y = this.target.y; this.stop(); }
        else { this.x += dx / d * sp; this.y += dy / d * sp; }
        this.phase += dt * 5.2 * (this.c.speed || 1);
      }
      if (this.talking) {
        this.talkT -= dt;
        if (this.talkT < 0) { this.talkPose = !this.talkPose; this.talkT = this.talkPose ? 0.7 + Math.random() * 1.1 : 0.18 + Math.random() * 0.25; }
      } else { this.talkPose = true; this.talkT = 0; }
    }
    stop() { this.target = null; this.walking = false; this.phase = 0; const r = this.resolve; this.resolve = null; if (r) r(); }
    height() { return (this.h || scaleAt(this.y)) * (this.c.scale || 1); }
    frameKey() {
      const f = this.c.frames;
      if (this.walking) {
        if (this.dir === 'n' && f.back) return f.back;
        if (this.dir === 's' && f.front) return f.front;
        if (f.walk) return f.walk[Math.floor(this.phase) % f.walk.length];
        return f.idle;
      }
      if (this.talking && this.talkPose && f.talk) return f.talk;
      if (this.dir === 'n' && f.back) return f.back;
      if (this.dir === 's' && f.front) return f.front;
      return f.idle;
    }
    bbox() {
      const h = this.height(), w = h * 0.36;
      return { x: this.x - w / 2, y: this.y - h, w, h };
    }
    draw() {
      if (!this.visible) return;
      const key = this.frameKey();
      const sp = SPRITES[key], im = IMG['spr:' + key];
      if (!sp || !im) return;
      let h = this.height();
      let bob = 0;
      if (this.walking) {
        bob = Math.abs(Math.sin(this.phase * Math.PI / 2)) * h * 0.012;
        if ((this.dir === 'n' || this.dir === 's') && this.c.frames.front) bob = Math.abs(Math.sin(this.phase * 1.6)) * h * 0.02;
      } else bob = Math.sin(time * 1.7 + this.x) * h * 0.003; // breathing
      const s = h / sp.h; // sprite px -> scene px
      const dw = sp.w * s, dh = sp.hh * s;
      const flipped = this.dir === 'w' ? !sp.facesLeft : (this.dir === 'e' ? !!sp.facesLeft : !!this.lastFlip);
      if (this.dir === 'e' || this.dir === 'w') this.lastFlip = flipped;
      const ax = (flipped ? sp.w - sp.ax : sp.ax) * s;
      const dx = this.x - ax, dy = this.y - sp.fy * s - bob;
      // contact shadow
      g.save(); g.fillStyle = 'rgba(0,0,0,0.38)'; g.beginPath(); g.ellipse(this.x, this.y, h * 0.12, h * 0.022, 0, 0, Math.PI * 2); g.fill(); g.restore();
      const bw = Math.ceil(dw), bh = Math.ceil(dh);
      const lit = litSprite(im, sp, flipped, bw, bh);
      g.drawImage(lit, 0, 0, bw, bh, dx, dy, bw, bh);
    }
  }

  // Applies the room's lighting to a sprite: multiply by the room's ambient
  // colour, then add a soft rim light from the room's key light side.
  const litBuf = document.createElement('canvas'), lg = litBuf.getContext('2d');
  function litSprite(im, sp, flipped, w, h) {
    w = Math.max(1, w); h = Math.max(1, h);
    if (litBuf.width < w || litBuf.height < h) { litBuf.width = Math.max(litBuf.width, w); litBuf.height = Math.max(litBuf.height, h); }
    lg.setTransform(1, 0, 0, 1, 0, 0);
    lg.clearRect(0, 0, litBuf.width, litBuf.height);
    lg.save();
    if (flipped) { lg.translate(w, 0); lg.scale(-1, 1); }
    lg.imageSmoothingQuality = 'high';
    lg.drawImage(im, 0, 0, w, h);
    lg.restore();
    const L = (room && room.light) || {};
    if (L.ambient) {
      lg.globalCompositeOperation = 'multiply';
      lg.fillStyle = L.ambient; lg.fillRect(0, 0, w, h);
      lg.globalCompositeOperation = 'destination-in';
      lg.save(); if (flipped) { lg.translate(w, 0); lg.scale(-1, 1); } lg.drawImage(im, 0, 0, w, h); lg.restore();
    }
    if (L.rim) {
      lg.globalCompositeOperation = 'source-atop';
      const side = L.rimSide || 1; // +1 light from the right, -1 from the left
      const gr = lg.createLinearGradient(side > 0 ? w : 0, 0, side > 0 ? w * 0.45 : w * 0.55, 0);
      gr.addColorStop(0, L.rim); gr.addColorStop(1, 'rgba(0,0,0,0)');
      lg.fillStyle = gr; lg.fillRect(0, 0, w, h);
    }
    if (L.fog) { // atmospheric fade toward the fog colour
      lg.globalCompositeOperation = 'source-atop';
      lg.fillStyle = L.fog; lg.fillRect(0, 0, w, h);
    }
    lg.globalCompositeOperation = 'source-over';
    return litBuf;
  }

  function scaleAt(y) {
    const sc = (room && room.scale) || [540, 300, 716, 360];
    const t = Math.max(0, Math.min(1, (y - sc[0]) / (sc[2] - sc[0])));
    return sc[1] + (sc[3] - sc[1]) * t;
  }

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
    const mx = p.reduce((a, q) => a + q[0], 0) / p.length, my = p.reduce((a, q) => a + q[1], 0) / p.length;
    const dx = mx - best[0], dy = my - best[1], dl = Math.hypot(dx, dy) || 1;
    return [best[0] + dx / dl * 3, best[1] + dy / dl * 3];
  }
  function hitShape(h, x, y) {
    if (h.poly) return inPoly(x, y, h.poly);
    const [rx, ry, rw, rh] = h.rect;
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  }

  // ---------------------------------------------------------------- rooms
  async function goRoom(id, entry, opts) {
    opts = opts || {};
    busy++;
    if (room && !opts.instant) { Sound.sfx('door'); await fade(true); }
    if (room && room.leave) room.leave();
    room = ROOMS[id];
    state.room = id;
    if (room.fog) {
      fogA = FX.makeFog(id.length * 31 + 1, room.fogRGB || '214,218,214', 1);
      fogB = FX.makeFog(id.length * 17 + 7, room.fogRGB || '200,206,206', 0.8);
    }
    const e = (entry && room.entries && room.entries[entry]) || (room.entries && room.entries.default) || [640, 640, 'e'];
    if (opts.pos) { player.x = opts.pos[0]; player.y = opts.pos[1]; player.dir = opts.pos[2] || 'e'; }
    else { player.x = e[0]; player.y = e[1]; player.dir = e[2] || 'e'; }
    player.stop();
    player.visible = room.player !== false;
    refreshNpcs(true);
    renderLabels();
    Sound.playMusic(typeof room.music === 'function' ? room.music() : room.music);
    clearSpeech();
    if (!opts.instant) await fade(false);
    busy--;
    if (!opts.noEnter && room.enter) { busy++; try { await room.enter(entry); } finally { busy--; } }
    if (!room.noSave && !opts.noSave) autosave();
    updateHover();
  }
  function refreshNpcs(reset) {
    const keep = reset ? new Map() : new Map(npcs.map(a => [a.id, a]));
    npcs = (room.npcs || []).filter(n => !n.when || n.when()).map(n => {
      if (keep.has(n.id)) return keep.get(n.id);
      const a = new Actor(n.id, n.ch || n.id, n.x, n.y, n.dir);
      a.def = n; a.h = n.h || null; a.overlay = n.overlay || null;
      return a;
    });
  }
  function renderLabels() {
    labelsEl.innerHTML = '';
    for (const l of (room.labels || [])) {
      if (l.when && !l.when()) continue;
      const d = document.createElement('div');
      d.className = 'lbl'; d.textContent = typeof l.text === 'function' ? l.text() : l.text;
      d.style.left = (l.x / W * 100) + '%'; d.style.top = (l.y / H * 100) + '%';
      labelsEl.appendChild(d);
    }
  }
  function fade(on) { $('#fade').classList.toggle('on', on); return wait(480); }

  // ---------------------------------------------------------------- render
  function drawBg(name) { const im = IMG['bg:' + name]; if (im) g.drawImage(im, 0, 0, W, H); else { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); } }
  function drawOccluder(o) {
    const im = IMG['bg:' + room.bg]; if (!im) return;
    g.save(); g.beginPath();
    o.poly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath(); g.clip();
    g.drawImage(im, 0, 0, W, H);
    g.restore();
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    if (room) {
      player.update(dt); npcs.forEach(a => a.update(dt));
      drawBg(typeof room.bgFn === 'function' ? room.bgFn() : room.bg);
      for (const p of (room.patches || [])) if (!p.when || p.when()) {
        const im = IMG['bg:' + room.bg]; const k = im ? im.width / W : 1;
        if (im) g.drawImage(im, p.src[0] * k, p.src[1] * k, p.src[2] * k, p.src[3] * k, p.dst[0], p.dst[1], p.dst[2], p.dst[3]);
      }
      if (room.anim) room.anim(g, time);
      // depth-sorted actors + occluders cut from the painting
      const items = [];
      for (const a of npcs) if (a.visible) items.push({ y: a.y, fn: () => { a.draw(); if (a.overlay) a.overlay(g, a, time); } });
      if (player.visible) items.push({ y: player.y, fn: () => player.draw() });
      for (const o of (room.occluders || [])) if (!o.when || o.when()) items.push({ y: o.y, fn: () => drawOccluder(o) });
      items.sort((a, b) => a.y - b.y).forEach(i => i.fn());
      if (room.animFg) room.animFg(g, time);
      if (room.fog) {
        const f = typeof room.fog === 'function' ? room.fog() : room.fog;
        if (f) { FX.drawFog(g, fogA, time, f, 12, 0); FX.drawFog(g, fogB, time, f * 0.7, 22, 40); }
      }
      if (room.grade) { g.fillStyle = room.grade; g.fillRect(0, 0, W, H); }
      FX.vignette(g, room.vignette != null ? room.vignette : 0.45);
      positionSpeech();
    }
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- speech
  let speaking = null;
  function actorFor(who) {
    if (who === 'alan') return player.visible ? player : null;
    return npcs.find(a => a.id === who && a.visible) || null;
  }
  function positionSpeech() {
    if (!speaking || !speaking.actor) return;
    const b = speaking.actor.bbox();
    const x = Math.max(18, Math.min(82, (b.x + b.w / 2) / W * 100));
    const y = Math.max(14, (b.y - 10) / H * 100);
    speechEl.style.left = x + '%'; speechEl.style.top = y + '%';
  }
  function clearSpeech() {
    speechEl.style.display = 'none'; narrEl.style.display = 'none';
    if (speaking && speaking.actor) speaking.actor.talking = false;
    speaking = null;
  }
  const strip = t => t.replace(/\[[^\]]*\]\s*/g, '');

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
      actor.talking = true; actor.talkPose = true; actor.talkT = 0.6;
      if (actor === player && (player.dir === 'n' || player.dir === 's')) {
        const other = npcs.find(a => a.visible);
        player.dir = other ? (other.x > player.x ? 'e' : 'w') : 'e';
      }
      speechEl.textContent = text; speechEl.style.color = COLORS[who] || '#fff';
      speechEl.style.display = 'block'; positionSpeech();
    } else {
      narrEl.querySelector('.who').textContent = who === 'narr' ? '' : (opts.label || NAMES[who] || '');
      const t = narrEl.querySelector('.txt');
      t.textContent = text;
      t.style.fontStyle = who === 'narr' ? 'italic' : 'normal';
      t.style.color = COLORS[who];
      narrEl.style.display = 'block';
    }
    const dur = await Sound.playVoice(id);
    const ms = window.FAST ? 20 : dur ? dur * 1000 + 250 : Math.max(1800, text.length * 58);
    await new Promise(res => {
      let finished = false;
      const t = setTimeout(done, ms);
      function done() { if (finished) return; finished = true; clearTimeout(t); if (skipFn === done) skipFn = null; res(); }
      setTimeout(() => { if (!finished) skipFn = done; }, 180);
    });
    Sound.stopVoice();
    clearSpeech();
    busy--;
    await wait(110);
  }
  async function says(...ids) { for (const id of ids) await say(id); }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ---------------------------------------------------------------- dialogue
  async function dialog(topics) {
    const used = new Set();
    for (;;) {
      const avail = topics.filter(t => (!t.when || t.when()) && !(t.once && used.has(t)));
      const pick = await new Promise(res => {
        dialogResolve = res;
        dialogEl.innerHTML = '';
        avail.forEach((t, i) => {
          const b = document.createElement('button');
          b.innerHTML = `<span class="n">${i + 1}</span>`;
          b.appendChild(document.createTextNode(t.label || strip(LINES[t.line][1])));
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
    }
  }

  // ---------------------------------------------------------------- inventory
  function has(id) { return state.inv.includes(id); }
  function giveItem(id, silent) {
    if (has(id)) return;
    state.inv.push(id); renderInv();
    if (!silent) { Sound.sfx('pickup'); flashInv(); }
  }
  function takeItem(id) { state.inv = state.inv.filter(i => i !== id); if (selItem === id) selItem = null; renderInv(); }
  function flashInv() { invBar.classList.add('show', 'flash'); setTimeout(() => invBar.classList.remove('flash'), 900); setTimeout(() => { if (!invHover && !selItem) invBar.classList.remove('show'); }, 1800); }
  function itemName(id) { const it = ITEMS[id]; return typeof it.name === 'function' ? it.name() : it.name; }
  function renderInv() {
    invEl.innerHTML = '';
    state.inv.forEach(id => {
      const slot = document.createElement('div');
      slot.className = 'slot' + (selItem === id ? ' selected' : '');
      const c = document.createElement('canvas'); c.width = 96; c.height = 96;
      c.getContext('2d').drawImage(FX.icon(ITEMS[id].icon || id), 0, 0);
      slot.appendChild(c);
      slot.title = itemName(id);
      slot.onclick = e => { e.stopPropagation(); clickItem(id); };
      slot.oncontextmenu = e => { e.preventDefault(); e.stopPropagation(); if (!busy) lookItem(id); };
      slot.onmouseenter = () => { if (!busy) showHoverText(selItem && selItem !== id ? `Use ${itemName(selItem)} with ${itemName(id)}` : itemName(id), slot); };
      slot.onmouseleave = () => hideHover();
      invEl.appendChild(slot);
    });
    updateCursor();
  }
  async function lookItem(id) {
    busy++; try { await runHandler(ITEMS[id].look); } finally { busy--; }
  }
  function clickItem(id) {
    if (busy) return;
    Sound.sfx('click');
    if (selItem && selItem !== id) {
      const a = ITEMS[selItem], b = ITEMS[id];
      const h = (a.with && a.with[id]) || (b.with && b.with[selItem]);
      selItem = null; renderInv();
      busy++; runHandler(h || 'alan_def_item').finally(() => { busy--; });
      return;
    }
    selItem = selItem === id ? null : id;
    renderInv();
  }
  function updateCursor() {
    wrap.classList.toggle('holding', !!selItem);
    if (selItem) {
      const [c, cg] = FX.mk(64, 64);
      cg.drawImage(FX.icon(ITEMS[selItem].icon || selItem), 0, 0, 64, 64);
      canvas.style.cursor = `url(${c.toDataURL()}) 8 8, pointer`;
    } else canvas.style.cursor = '';
  }

  // ---------------------------------------------------------------- input
  let invHover = false;
  invBar.addEventListener('mouseenter', () => { invHover = true; invBar.classList.add('show'); });
  invBar.addEventListener('mouseleave', () => { invHover = false; if (!selItem) invBar.classList.remove('show'); });
  $('#bag').addEventListener('click', e => { e.stopPropagation(); invBar.classList.toggle('show'); });

  function targetAt(x, y) {
    if (!room) return null;
    const people = npcs.filter(a => a.visible && a.def).sort((a, b) => b.y - a.y);
    for (const a of people) { const b = a.bbox(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return { kind: 'npc', actor: a, def: a.def }; }
    const hs = room.hotspots || [];
    for (let i = hs.length - 1; i >= 0; i--) {
      const h = hs[i];
      if (h.when && !h.when()) continue;
      if (hitShape(h, x, y)) return { kind: 'hot', def: h };
    }
    return null;
  }
  function nameOf(t) { const n = t.def.name; return typeof n === 'function' ? n() : n; }
  // What a left click does on a target (Broken Sword-style smart action).
  function defaultVerb(def) {
    if (def.exit) return 'exit';
    if (def.talk) return 'talk';
    if (def.use) return 'use';
    if (def.take) return 'take';
    return 'look';
  }
  const CURSOR_CLASS = { exit: 'c-exit', talk: 'c-talk', use: 'c-use', take: 'c-use', look: 'c-look' };
  function updateHover() {
    if (busy || !room || mouse.x < 0) { hideHover(); canvas.className = ''; return; }
    hoverTarget = targetAt(mouse.x, mouse.y);
    if (!hoverTarget) { canvas.className = ''; hideHover(); return; }
    canvas.className = selItem ? '' : CURSOR_CLASS[defaultVerb(hoverTarget.def)];
    const name = nameOf(hoverTarget);
    showHoverText(selItem ? `Use ${itemName(selItem)} on ${name}` : name);
  }
  function showHoverText(txt, el) {
    hoverEl.textContent = txt; hoverEl.style.display = txt ? 'block' : 'none';
    if (el) { const r = el.getBoundingClientRect(), gr = wrap.getBoundingClientRect(); hoverEl.style.left = ((r.left + r.width / 2 - gr.left) / gr.width * 100) + '%'; hoverEl.style.top = ((r.top - gr.top) / gr.height * 100 - 4) + '%'; }
    else { hoverEl.style.left = (mouse.x / W * 100) + '%'; hoverEl.style.top = (mouse.y / H * 100 - 5) + '%'; }
  }
  function hideHover() { hoverEl.style.display = 'none'; }
  function sceneCoords(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
  }
  canvas.addEventListener('mousemove', e => {
    mouse = sceneCoords(e); updateHover();
    if (mouse.y > H - 60 && !busy) invBar.classList.add('show');
    else if (!invHover && !selItem && mouse.y < H - 140) invBar.classList.remove('show');
  });
  canvas.addEventListener('mouseleave', () => { mouse = { x: -1, y: -1 }; hideHover(); });
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (skipFn) { skipFn(); return; }
    if (busy) return;
    if (selItem) { selItem = null; renderInv(); updateHover(); return; }
    const p = sceneCoords(e), t = targetAt(p.x, p.y);
    if (t) interact(t, 'look');
  });
  canvas.addEventListener('click', e => {
    if (skipFn) { skipFn(); return; }
    if (busy || !room) return;
    const p = sceneCoords(e);
    const t = targetAt(p.x, p.y);
    if (!t) {
      if (room.walk && player.visible) { const [x, y] = clampToPoly(p.x, p.y, room.walk); player.walkTo(x, y); }
      if (selItem) { selItem = null; renderInv(); }
      return;
    }
    interact(t, selItem ? 'item' : defaultVerb(t.def));
  });
  // long-press = examine on touch devices
  let pressT = null;
  canvas.addEventListener('touchstart', e => {
    const tch = e.touches[0]; const p = sceneCoords(tch);
    pressT = setTimeout(() => { pressT = null; const t = targetAt(p.x, p.y); if (t && !busy) interact(t, 'look'); }, 550);
  }, { passive: true });
  canvas.addEventListener('touchend', () => { if (pressT) clearTimeout(pressT); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === '.' || e.key === ' ') { if (skipFn) { skipFn(); e.preventDefault(); } return; }
    if (e.key === 'i' || e.key === 'I') invBar.classList.toggle('show');
    const n = parseInt(e.key, 10);
    if (dialogResolve && n >= 1) { const btn = dialogEl.querySelectorAll('button')[n - 1]; if (btn) btn.click(); }
  });

  async function runHandler(h, ctx) {
    if (!h) return;
    if (typeof h === 'string') return say(h);
    if (Array.isArray(h)) { for (const x of h) await runHandler(x, ctx); return; }
    if (typeof h === 'function') return h(ctx);
  }
  async function approach(def, actor) {
    if (!player.visible || !room.walk) return;
    let at = def.at;
    if (!at && actor) {
      const gap = actor.height() * 0.42;
      at = [actor.x + (actor.x > player.x ? -gap : gap), actor.y + 6];
    }
    if (!at) return;
    const [x, y] = clampToPoly(at[0], at[1], room.walk);
    await player.walkTo(x, y);
    if (def.face) player.dir = def.face;
    else if (actor) { player.dir = actor.x > player.x ? 'e' : 'w'; actor.dir = actor.def.fixedDir ? actor.dir : (player.x > actor.x ? 'e' : 'w'); }
  }
  async function interact(t, verb) {
    const def = t.def, item = verb === 'item' ? selItem : null;
    busy++;
    hideHover(); canvas.className = '';
    try {
      if (verb === 'look') {
        if (player.visible && def.at && !t.actor) player.dir = def.at[0] > player.x ? 'e' : 'w';
        await runHandler(def.look || 'alan_def_look', t); return;
      }
      if (verb === 'exit') { await approach(def, t.actor); await goRoom(def.exit, def.entry || room.id); return; }
      await approach(def, t.actor);
      if (item) {
        const h = (def.items && (def.items[item] || def.items.any)) || 'alan_def_item';
        selItem = null; renderInv(); invBar.classList.remove('show');
        await runHandler(h, t);
      } else await runHandler(def[verb] || 'alan_def_use', t);
    } finally { busy--; updateHover(); }
  }

  // ---------------------------------------------------------------- saves
  function snapshot() { return JSON.stringify(Object.assign({}, state, { px: player.x, py: player.y, dir: player.dir })); }
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

  // ---------------------------------------------------------------- cards & menu
  async function card(t1, t2, ms) {
    const c = $('#card');
    c.querySelector('.t1').textContent = t1; c.querySelector('.t2').textContent = t2;
    c.classList.add('on'); await wait(window.FAST ? 50 : (ms || 2800)); c.classList.remove('on');
  }
  function showModal(id, on) { $('#' + id).classList.toggle('hidden', !on); }
  function syncOptions() {
    $('#opt-music').classList.toggle('off', !Sound.musicOn);
    $('#opt-voice').classList.toggle('off', !Sound.voiceOn);
  }
  $('#menu-btn').onclick = e => { e.stopPropagation(); $('#menu').classList.toggle('open'); };
  $('#opt-music').onclick = e => { e.stopPropagation(); Sound.setMusic(!Sound.musicOn); syncOptions(); };
  $('#opt-voice').onclick = e => { e.stopPropagation(); Sound.setVoice(!Sound.voiceOn); syncOptions(); };
  $('#opt-save').onclick = e => { e.stopPropagation(); if (busy) return; autosave(); toast('Game saved'); };
  $('#opt-load').onclick = async e => { e.stopPropagation(); if (busy) return; toast((await loadSave()) ? 'Game loaded' : 'No saved game'); };
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1500); }

  // ---------------------------------------------------------------- boot
  let SPRITES = {};
  async function init(chars, items, rooms, sprites) {
    Object.assign(CHARS, chars); Object.assign(ITEMS, items); Object.assign(ROOMS, rooms); SPRITES = sprites;
    for (const id in ROOMS) ROOMS[id].id = id;
    player = new Actor('alan', 'alan', 300, 600, 'w');
    renderInv(); syncOptions();
    $('#btn-continue').disabled = !hasSave();
    Sound.loadManifest();
    const bar = $('#loadbar');
    await preload(p => { bar.style.width = Math.round(p * 100) + '%'; });
    $('#title').classList.add('ready');
    requestAnimationFrame(frame);
  }
  async function begin(fresh) {
    Sound.init();
    showModal('title', false);
    if (fresh || !(await loadSave())) { state = freshState(); renderInv(); await window.Story.newGame(); }
  }

  window.Game = {
    init, begin, goRoom, say, says, wait, dialog, card, fade, checkpoint, loadSave, autosave, showModal, refreshNpcs, renderLabels,
    giveItem, takeItem, has, toast,
    get state() { return state; }, get flags() { return state.flags; },
    get player() { return player; }, get room() { return room; },
    get isBusy() { return busy > 0 || !!dialogResolve || (player && player.walking); },
    npc: id => npcs.find(a => a.id === id),
    busy: async fn => { busy++; try { return await fn(); } finally { busy--; updateHover(); } },
  };
})();
