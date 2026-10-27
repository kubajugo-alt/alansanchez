// Point-and-click engine: painted backgrounds, painted sprite actors, smart
// cursor (left = act, right = examine), inventory bar, dialogue, cutscenes, saves.
// This file is the boot and the public API (window.Game); the engine itself is js/engine/*.js,
// which share their state on window.Engine (see js/engine/base.js and docs/CODEMAP.md).
(function () {
  const E = window.Engine;
  const { $, ROOMS, ITEMS, CHARS, IMG, wait, freshState } = E;

  // ---------------------------------------------------------------- assets
  // Every image is registered at start (key -> file) and loaded through one queue, a few at a time, so what's needed
  // now can jump ahead: a room is entered only once its painting, layers, depth map and the frames of everyone who
  // can appear in it are in (goRoom waits on E.ensure while the screen is black), a still only once its painting is.
  // The rest streams in behind, in the order the story needs it. The title no longer waits for all of it
  // (about 75 MB): only for what the first minutes need. ?preload=all (and the review screen, the walk lab) load
  // everything first, as before.
  const SRC = {};                // key -> file
  const pending = new Map();     // key -> Promise (queued or loading)
  const queue = [];              // keys waiting, in order
  let active = 0, total = 0, done = 0, onProg = null, urgent = 0, waited = 0; // waited: ms spent waiting (Game.loading)
  // what's waited on gets the whole connection: the background stream only runs (four at a time) while nothing is
  const CONC = 8, CONC_BG = 4, TIMEOUT = 25000;
  // Memory: every image decoded is held at width x height x 4 bytes, about 930 MB for the whole game, which a phone's
  // browser won't keep (iOS closes the tab). On a phone or a small-memory device the loader keeps to a budget: images not
  // used for a while, far from the room Alan is in, are let go (and fetched again if they're wanted), and the background
  // stream waits while memory is past 60% of it. ?mem=<MB> sets the budget (tests).
  const MEM = (() => {
    const q = location.search.match(/[?&]mem=(\d+)/); if (q) return +q[1] * 1e6;
    let small = false;
    try { small = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || matchMedia('(pointer: coarse)').matches || (navigator.deviceMemory && navigator.deviceMemory <= 4); } catch (e) { /* old browser */ }
    return small ? 300e6 : 1200e6;
  })();
  let bytes = 0; const usedAt = new Map(); // decoded bytes held; key -> when it was last drawn or needed
  const sizeOf = im => (im.naturalWidth || im.width || 0) * (im.naturalHeight || im.height || 0) * 4;
  const touch = k => usedAt.set(k, performance.now());
  function fetchImage(key, src) {
    return new Promise(res => {
      const im = new Image();
      // a stalled request must not hold the queue forever: give up waiting (the image still lands in IMG if it comes)
      const t = setTimeout(() => { console.warn('slow', src); res(null); }, TIMEOUT);
      im.onload = () => { clearTimeout(t); if (!IMG[key]) bytes += sizeOf(im); IMG[key] = im; touch(key); res(im); };
      im.onerror = () => { clearTimeout(t); console.warn('missing', src); res(null); };
      im.src = src;
    });
  }
  function pump() {
    while (queue.length && active < (urgent ? CONC : CONC_BG)) {
      const key = queue[0], job = pending.get(key);
      if (job && !job.started && !job.front && (urgent || bytes > MEM * 0.6)) break; // (the urgent ones are at the front: the rest wait)
      queue.shift();
      if (!job || job.started) continue;
      job.started = true; active++;
      fetchImage(key, SRC[key]).then(im => {
        active--; done++; job.finished = true; job.resolve(im); if (onProg) onProg(Math.min(1, done / total));
        pump();
      });
    }
  }
  function want(key, front) {
    if (IMG[key]) return Promise.resolve(IMG[key]);
    if (!SRC[key]) return Promise.resolve(null);
    let job = pending.get(key);
    if (job && job.finished) { if (job.tries > 1) return job.promise; pending.delete(key); total++; job = { tries: job.tries + 1 }; } // failed or slow: once more
    if (!job || !job.promise) {
      const tries = (job && job.tries) || 1;
      let resolve; const p = new Promise(r => { resolve = r; });
      job = { promise: p, resolve, started: false, finished: false, tries }; pending.set(key, job);
    }
    if (!job.started) {
      const i = queue.indexOf(key); if (i >= 0) queue.splice(i, 1);
      if (front) { queue.unshift(key); job.front = true; } else queue.push(key);
      pump();
    }
    return job.promise;
  }
  function loadImage(key, src) {
    if (IMG[key]) return Promise.resolve(IMG[key]);
    // (a frame added at run time, or one whose file changed: a fresh request)
    const j = pending.get(key);
    if (SRC[key] !== src || (j && j.finished)) { SRC[key] = src; if (!j || !j.started || j.finished) { pending.delete(key); total++; } }
    else if (!j) total++;
    return want(key, true);
  }
  // waits for these images (put at the front of the queue); past 0.4 s a small "Loading" note shows
  async function ensure(keys) {
    keys = keys.filter(k => SRC[k] && !IMG[k]);
    if (!keys.length) return;
    urgent++; const t0 = performance.now();
    keys.slice().reverse().forEach(k => want(k, true));
    const note = $('#loadnote'), t = setTimeout(() => note && note.classList.add('on'), 400);
    try { await Promise.all(keys.map(k => pending.get(k).promise)); } finally { urgent--; waited += performance.now() - t0; clearTimeout(t); if (note) note.classList.remove('on'); pump(); }
  }
  // the frames a character can show (every name in its frames table that is a painted sprite)
  const framesOf = id => {
    const out = new Set(), c = CHARS[id], walk = v => { if (typeof v === 'string') { if (E.SPRITES[v]) out.add(v); } else if (v && typeof v === 'object') for (const x of Object.values(v)) walk(x); };
    if (c) walk(c.frames);
    return [...out];
  };
  const roomArt = id => {
    const r = ROOMS[id]; if (!r) return [];
    return [r.bg].concat(r.bgs || []).filter(Boolean).map(b => 'bg:' + b)
      .concat((r.layers || []).map(l => 'lay:' + l.img), r.depth ? ['depth:' + r.depth] : [], r.skyMask ? ['mask:' + r.skyMask] : []);
  };
  // the frames a figure needs to stand, walk and talk (its other poses follow at the front of the stream; until one
  // lands the figure shows its idle frame, as for a pose not painted yet)
  const coreOf = id => {
    const c = CHARS[id], out = new Set(), F = (c && c.frames) || {};
    for (const part of ['idle', 'talk', 'walk', 'front', 'back', 'walkStart', 'walkStop']) for (const k of [].concat(F[part] || [])) if (typeof k === 'string' && E.SPRITES[k]) out.add(k);
    return [...out];
  };
  // who is in the room now (the same test refreshNpcs makes), and its extras
  const roomPeople = (id, all) => {
    const r = ROOMS[id], ids = new Set(['alan']), extra = new Set();
    let cur = E.room; // a when() may ask about the room it's in: answer as if already there
    try {
      E.room = r;
      for (const n of (r && r.npcs) || []) { let on = true; if (!all && n.when) try { on = n.when(); } catch (e) { on = true; } if (on) ids.add(n.ch || n.id); }
    } finally { E.room = cur; }
    for (const a of (r && r.ambient) || []) for (const k of [].concat(a.frames || [], a.walk || [], a.talkFrames || [], Object.values(a.poses || {}))) if (E.SPRITES[k]) extra.add('' + k);
    return { ids: [...ids], extra: [...extra] };
  };
  // what entering a room waits for: its art, everyone there now able to stand, walk and talk, and its extras
  const roomAssets = id => {
    const p = roomPeople(id);
    return roomArt(id).concat(p.ids.flatMap(coreOf).concat(p.extra).map(k => 'spr:' + k));
  };
  // what follows straight after, ahead of the stream: every frame of everyone who can appear there
  const roomMore = id => { const p = roomPeople(id, true); return p.ids.flatMap(framesOf).map(k => 'spr:' + k); };
  const stillKeys = name => ['still:' + name, 'close:' + name, 'bg:' + name].filter(k => SRC[k]);
  function register() {
    const add = (k, s) => { if (!SRC[k]) { SRC[k] = s; total++; } };
    for (const id in ROOMS) for (const b of [ROOMS[id].bg].concat(ROOMS[id].bgs || [])) if (b) add('bg:' + b, 'art/bg/' + b + '.jpg');
    for (const s of (window.STILLS || [])) add('still:' + s, 'art/stills/' + s + '.jpg');
    for (const c of (window.CLOSEUPS || [])) add('close:' + c, 'art/closeups/' + c + '.jpg');
    for (const k in E.SPRITES) add('spr:' + k, E.SPRITES[k].src || 'art/sprites/' + k + '.webp'); // src: an approved review frame
    for (const id in ROOMS) for (const l of (ROOMS[id].layers || [])) add('lay:' + l.img, 'art/layers/' + l.img + '.webp');
    // parallax: every room's depth map (art/bg/<bg>_depth.png, scripts/depth_map.py), unless the room says parallax: false
    if (window.Parallax && Parallax.on) for (const id in ROOMS) { const r = ROOMS[id]; if (r.parallax === false) continue; r.depth = r.depth || r.bg + '_depth'; add('depth:' + r.depth, 'art/bg/' + r.depth + '.png'); }
    for (const id in ROOMS) if (ROOMS[id].skyMask) add('mask:' + ROOMS[id].skyMask, 'art/layers/' + ROOMS[id].skyMask + '.webp');
  }
  // the order things stream in: Alan, the room a save would open in, the shop and Inês, the stills in story order,
  // then room by room (their art and their people), and whatever is left
  // the room a game opens in: the newest save's, or the shop
  function firstRoom() {
    try { const j = JSON.parse(E.newestSave() || 'null'); if (j && ROOMS[j.room]) return j.room; } catch (e) { /* no storage */ }
    return window.FIRST_ROOM || 'hotel_room';
  }
  function order() {
    const seq = [];
    seq.push(...roomAssets(firstRoom()), ...roomMore(firstRoom()), ...roomAssets(window.FIRST_ROOM || 'hotel_room'), ...roomMore(window.FIRST_ROOM || 'hotel_room'));
    for (const s of (window.STILLS || [])) seq.push(...stillKeys(s));
    for (const id in ROOMS) seq.push(...roomAssets(id), ...roomMore(id));
    seq.push(...Object.keys(SRC));
    return seq;
  }
  async function preload(onProgress) {
    register();
    onProg = onProgress;
    for (const k of order()) want(k);
    const all = /[?&]preload=all\b|[?&]review\b|[?&]scene=walklab\b/.test(location.search);
    // the title waits for nothing but the page itself (New game opens on paintings and asks a question first; Continue
    // waits for its room while the screen is black); everything streams in behind it
    if (all) await ensure(Object.keys(SRC));
  }

  // ---------------------------------------------------------------- boot
  async function init(chars, items, rooms, sprites) {
    Object.assign(CHARS, chars); Object.assign(ITEMS, items); Object.assign(ROOMS, rooms); E.SPRITES = sprites;
    for (const id in ROOMS) ROOMS[id].id = id;
    E.player = new E.Actor('alan', 'alan', 300, 600, 'w');
    E.renderInv(); E.syncOptions();
    $('#btn-continue').disabled = !E.hasSave();
    Sound.loadManifest(); Sound.loadSfx();
    const bar = $('#loadbar');
    await preload(p => { bar.style.width = Math.round(p * 100) + '%'; });
    $('#title').classList.add('ready');
    requestAnimationFrame(E.frame);
  }
  let started = false;
  // the animation review screen (?review): a room to stage characters in, with no story running
  function sandbox() { started = true; Sound.init(); E.showModal('title', false); E.state = freshState(); E.renderInv(); }
  async function begin(fresh) {
    if (started) return; // a double-click on New game would run the intro twice, voices over each other
    started = true;
    Sound.init();
    E.showModal('title', false);
    let loaded = false;
    if (!fresh) {
      // a save this build can't open must never leave a black screen: say so and start a new game
      try { loaded = await E.loadSave(); } catch (e) { console.error('save could not be loaded', e); E.busy = 0; E.cutscene = 0; E.room = null; E.fade(false); E.toast("Your save couldn't be opened: starting a new game", 3500); }
    }
    if (!loaded) { E.state = freshState(); E.renderInv(); await window.Story.newGame(); }
  }

  // let go of what hasn't been used for a while, oldest first, until memory is back under three quarters of the budget;
  // never what the room Alan is in needs now (its art; whoever is there able to stand, walk and talk) or the painting on
  // screen; a pose let go comes back when it's wanted (the idle frame meanwhile, as for a pose on its way)
  function evict(keepIds) {
    if (bytes <= MEM) return 0;
    const keep = new Set([].concat(...keepIds.map(id => roomAssets(id))));
    if (E.still) for (const k of stillKeys(E.still.name)) keep.add(k);
    const now = performance.now(), old = Object.keys(IMG).filter(k => SRC[k] && !keep.has(k) && now - (usedAt.get(k) || 0) > 8000)
      .sort((a, b) => (usedAt.get(a) || 0) - (usedAt.get(b) || 0));
    let n = 0;
    for (const k of old) {
      if (bytes <= MEM * 0.75) break;
      bytes -= sizeOf(IMG[k]); delete IMG[k]; pending.delete(k); n++; // (want() fetches it again)
    }
    return n;
  }
  // entering a room: its own frames first, then everything its people can do; then, past the budget, let go of the rest
  async function roomReady(id) {
    if (bytes < MEM * 0.6) roomMore(id).forEach(k => want(k, true)); // (on a tight budget a pose is fetched when it's wanted)
    await ensure(roomAssets(id));
    for (const k of roomAssets(id)) touch(k);
    evict([id]);
  }
  // and every so often while Alan stays in a room (a long scene draws on many poses)
  setInterval(() => { if (E.room && E.room.id) evict([E.room.id]); }, 15000);
  Object.assign(E, { ensure, want, roomAssets, roomReady, stillKeys, srcOf: k => SRC[k], touchImg: touch, evict });

  window.Game = {
    init, begin, sandbox, goRoom: E.goRoom,
    say: E.say, says: E.says, lyrics: E.lyrics, wait, dialog: E.dialog, reach: E.reach,
    showStill: E.showStill, endStill: E.endStill, stillTo: E.stillTo, stillShowing: E.stillShowing,
    skipLine: () => { if (E.skipFn) E.skipFn(); }, closeup: E.closeup, setClock: E.setClock, renderInv: E.renderInv,
    set cutscene(v) { E.cutscene = Math.max(0, E.cutscene + (v ? 1 : -1)); }, card: E.card, fade: E.fade,
    checkpoint: E.checkpoint, loadSave: E.loadSave, autosave: E.autosave, clearSaves: E.clearSaves,
    showModal: E.showModal, refreshNpcs: E.refreshNpcs, renderLabels: E.renderLabels,
    tip: id => E.tip && E.tip(id), // a first-time tip (js/engine/tips.js), shown once
    giveItem: E.giveItem, takeItem: E.takeItem, has: E.has, toast: E.toast, readItem: E.readItem,
    get state() { return E.state; }, get flags() { return E.state.flags; },
    get player() { return E.player; }, get room() { return E.room; }, get npcs() { return E.npcs; },
    bgImage: () => E.room && IMG['bg:' + E.curBg()],
    image: key => IMG[key],
    // the art is part of the game (it may still be streaming in: image() is null until it lands, ensure() waits)
    hasArt: key => !!SRC[key],
    mask: () => E.room && E.room.skyMask && IMG['mask:' + E.room.skyMask],
    idleSmoke: null, noteInput: E.noteInput, get smoking() { return E.smoking(); }, get smokeStep() { return E.smokeStep(); },
    get isBusy() { return E.busy > 0 || !!E.dialogResolve || (E.player && E.player.walking); },
    npc: id => E.npcs.find(a => a.id === id),
    rooms: () => Object.keys(ROOMS), roomDef: id => ROOMS[id], chars: () => CHARS, Actor: (...a) => new E.Actor(...a),
    // add (or replace) a painted frame at run time (the review screen previews a frame before it's approved)
    addSprite(k, meta) { E.SPRITES[k] = meta; delete IMG['spr:' + k]; return loadImage('spr:' + k, meta.src || 'art/sprites/' + k + '.webp'); },
    ensure: keys => ensure(keys), ensureStill: name => ensure(stillKeys(name)), loading: () => ({ done, total, queued: queue.length, waited: Math.round(waited), held: Math.round(bytes / 1e6), budget: Math.round(MEM / 1e6), images: Object.keys(IMG).length }),
    // test hook: act on a hotspot (by name) or an actor (by id), optionally with an item
    async act(target, verb, item) {
      E.noteInput(); // a scripted action counts as input (puts the cigarette away)
      let t = null;
      const a = E.npcs.find(n => n.id === target && n.visible);
      if (a) t = { kind: 'npc', actor: a, def: a.def };
      else if (target === 'self') t = { kind: 'self', def: { name: 'Alan', items: (E.room.self && E.room.self.items) || {} } };
      else {
        const h = (E.room.hotspots || []).find(h => (!h.when || h.when()) && (typeof h.name === 'function' ? h.name() : h.name) === target);
        if (h) t = { kind: 'hot', def: h };
      }
      if (!t) throw new Error('no target ' + target + ' in ' + E.room.id);
      if (item) { if (!E.has(item)) throw new Error('no item ' + item); E.selItem = item; }
      await E.interact(t, item ? 'item' : (verb || E.defaultVerb(t.def)));
    },
    busy: async fn => { E.busy++; try { return await fn(); } finally { E.busy--; E.updateHover(); if (!E.busy && E.room && !E.room.noSave) E.autosave(); } },
  };
})();
