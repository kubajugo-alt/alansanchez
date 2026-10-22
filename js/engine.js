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
  let active = 0, total = 0, done = 0, onProg = null;
  const CONC = 8, TIMEOUT = 25000;
  function fetchImage(key, src) {
    return new Promise(res => {
      const im = new Image();
      // a stalled request must not hold the queue forever: give up waiting (the image still lands in IMG if it comes)
      const t = setTimeout(() => { console.warn('slow', src); res(null); }, TIMEOUT);
      im.onload = () => { clearTimeout(t); IMG[key] = im; res(im); };
      im.onerror = () => { clearTimeout(t); console.warn('missing', src); res(null); };
      im.src = src;
    });
  }
  function pump() {
    while (active < CONC && queue.length) {
      const key = queue.shift(), job = pending.get(key);
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
      if (front) queue.unshift(key); else queue.push(key);
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
    keys.slice().reverse().forEach(k => want(k, true));
    const note = $('#loadnote'), t = setTimeout(() => note && note.classList.add('on'), 400);
    try { await Promise.all(keys.map(k => pending.get(k).promise)); } finally { clearTimeout(t); if (note) note.classList.remove('on'); }
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
  const roomFrames = id => {
    const r = ROOMS[id], keys = new Set(framesOf('alan'));
    for (const n of (r && r.npcs) || []) for (const k of framesOf(n.ch || n.id)) keys.add(k);
    for (const a of (r && r.ambient) || []) for (const k of [].concat(a.frames || [], a.walk || [], a.talkFrames || [], Object.values(a.poses || {}))) if (E.SPRITES[k]) keys.add('' + k);
    return [...keys].map(k => 'spr:' + k);
  };
  const roomAssets = id => roomArt(id).concat(roomFrames(id));
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
    return 'shop';
  }
  function order() {
    const seq = [];
    seq.push(...roomAssets(firstRoom()), ...roomAssets('shop'), ...framesOf('ines').map(k => 'spr:' + k));
    for (const s of (window.STILLS || [])) seq.push(...stillKeys(s));
    for (const id in ROOMS) seq.push(...roomAssets(id));
    seq.push(...Object.keys(SRC));
    return seq;
  }
  async function preload(onProgress) {
    register();
    onProg = onProgress;
    for (const k of order()) want(k);
    const all = /[?&]preload=all\b|[?&]review\b|[?&]scene=walklab\b/.test(location.search);
    // the title waits for the room a game opens in and the people in it; everything else follows
    await ensure(all ? Object.keys(SRC) : roomAssets(firstRoom()));
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

  Object.assign(E, { ensure, want, roomAssets, stillKeys, srcOf: k => SRC[k] });

  window.Game = {
    init, begin, sandbox, goRoom: E.goRoom,
    say: E.say, says: E.says, lyrics: E.lyrics, wait, dialog: E.dialog, reach: E.reach,
    showStill: E.showStill, endStill: E.endStill, stillTo: E.stillTo, stillShowing: E.stillShowing,
    skipLine: () => { if (E.skipFn) E.skipFn(); }, closeup: E.closeup, setClock: E.setClock, renderInv: E.renderInv,
    set cutscene(v) { E.cutscene = Math.max(0, E.cutscene + (v ? 1 : -1)); }, card: E.card, fade: E.fade,
    checkpoint: E.checkpoint, loadSave: E.loadSave, autosave: E.autosave, clearSaves: E.clearSaves,
    showModal: E.showModal, refreshNpcs: E.refreshNpcs, renderLabels: E.renderLabels,
    giveItem: E.giveItem, takeItem: E.takeItem, has: E.has, toast: E.toast, readItem: E.readItem,
    get state() { return E.state; }, get flags() { return E.state.flags; },
    get player() { return E.player; }, get room() { return E.room; }, get npcs() { return E.npcs; },
    bgImage: () => E.room && IMG['bg:' + E.curBg()],
    image: key => IMG[key],
    mask: () => E.room && E.room.skyMask && IMG['mask:' + E.room.skyMask],
    idleSmoke: null, noteInput: E.noteInput, get smoking() { return E.smoking(); }, get smokeStep() { return E.smokeStep(); },
    get isBusy() { return E.busy > 0 || !!E.dialogResolve || (E.player && E.player.walking); },
    npc: id => E.npcs.find(a => a.id === id),
    rooms: () => Object.keys(ROOMS), roomDef: id => ROOMS[id], chars: () => CHARS, Actor: (...a) => new E.Actor(...a),
    // add (or replace) a painted frame at run time (the review screen previews a frame before it's approved)
    addSprite(k, meta) { E.SPRITES[k] = meta; delete IMG['spr:' + k]; return loadImage('spr:' + k, meta.src || 'art/sprites/' + k + '.webp'); },
    ensure: keys => ensure(keys), ensureStill: name => ensure(stillKeys(name)), loading: () => ({ done, total, queued: queue.length }),
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
