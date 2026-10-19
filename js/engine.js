// Point-and-click engine: painted backgrounds, painted sprite actors, smart
// cursor (left = act, right = examine), inventory bar, dialogue, cutscenes, saves.
// This file is the boot and the public API (window.Game); the engine itself is js/engine/*.js,
// which share their state on window.Engine (see js/engine/base.js and docs/CODEMAP.md).
(function () {
  const E = window.Engine;
  const { $, ROOMS, ITEMS, CHARS, IMG, wait, freshState } = E;

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
    for (const id in ROOMS) for (const b of [ROOMS[id].bg].concat(ROOMS[id].bgs || [])) if (b) jobs.push(['bg:' + b, 'art/bg/' + b + '.jpg']);
    for (const s of (window.STILLS || [])) jobs.push(['still:' + s, 'art/stills/' + s + '.jpg']);
    for (const c of (window.CLOSEUPS || [])) jobs.push(['close:' + c, 'art/closeups/' + c + '.jpg']);
    for (const k in E.SPRITES) jobs.push(['spr:' + k, E.SPRITES[k].src || 'art/sprites/' + k + '.webp']); // src: an approved review frame
    for (const id in ROOMS) for (const l of (ROOMS[id].layers || [])) jobs.push(['lay:' + l.img, 'art/layers/' + l.img + '.webp']);
    for (const id in ROOMS) if (ROOMS[id].depth && window.Parallax && Parallax.on) jobs.push(['depth:' + ROOMS[id].depth, 'art/bg/' + ROOMS[id].depth + '.png']); // (only when parallax is on)
    for (const id in ROOMS) if (ROOMS[id].skyMask) jobs.push(['mask:' + ROOMS[id].skyMask, 'art/layers/' + ROOMS[id].skyMask + '.webp']);
    let done = 0;
    await Promise.all(jobs.map(([k, s]) => loadImage(k, s).then(() => onProgress && onProgress(++done / jobs.length))));
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
    if (fresh || !(await E.loadSave())) { E.state = freshState(); E.renderInv(); await window.Story.newGame(); }
  }

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
