// node scripts/tests/unit.mjs [game folder]      (no browser, no server: a few seconds)
// The engine's logic run in node against a stand-in page: floor routing, the image loader's queue, saves and their
// migration, walking, how long one painting takes to give way to the next, the dialogue menu and close-ups.
// The browser tests (smoke, play, figcache, faces, captions...) check what is drawn; these check what is decided.
// [game folder]: '.' (Game I, the default) or 'sequel': the engine files are the same, this only says where to read them.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import vm from 'vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..', process.argv[2] || '.');
let failed = 0, passed = 0;
const ok = (name, cond, detail) => { if (cond) passed++; else failed++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (cond || detail === undefined ? '' : '  ' + JSON.stringify(detail))); };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-6);
const tick = ms => new Promise(r => setTimeout(r, ms || 0));

// ---------------------------------------------------------------- a stand-in page
const ctx2d = new Proxy(function () {}, {
  get: (t, k) => k === 'getImageData' ? (() => ({ data: new Uint8ClampedArray(4) })) : /Gradient$/.test(String(k)) ? (() => ({ addColorStop() {} })) : (() => ({})),
  set: () => true,
});
function el(tag) {
  const e = {
    tagName: tag || 'div', children: [], width: 0, height: 0, textContent: '', disabled: false, value: '', title: '', offsetParent: {}, _html: '',
    style: new Proxy({}, { get: (t, k) => k === 'setProperty' ? (() => {}) : (t[k] || ''), set: (t, k, v) => { t[k] = v; return true; } }),
    classList: { s: new Set(), add(...a) { a.forEach(x => this.s.add(x)); }, remove(...a) { a.forEach(x => this.s.delete(x)); }, contains(c) { return this.s.has(c); },
      toggle(c, on) { if (on === undefined) on = !this.s.has(c); if (on) this.s.add(c); else this.s.delete(c); return on; } },
    getContext: () => ctx2d, toDataURL: () => '', appendChild(c) { this.children.push(c); return c; }, insertBefore(c) { this.children.push(c); return c; },
    insertAdjacentElement() {}, remove() {}, replaceChildren() {}, addEventListener() {}, removeEventListener() {}, setAttribute() {}, focus() {},
    querySelector(sel) { return (this._q || (this._q = {}))[sel] || (this._q[sel] = el()); },
    querySelectorAll(sel) { return this.children.filter(c => c.tagName === sel); },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 720, right: 1280, bottom: 720 }),
    click() { if (this.onclick) this.onclick({ stopPropagation() {}, preventDefault() {}, target: this }); },
  };
  Object.defineProperty(e, 'innerHTML', { get() { return this._html; }, set(v) { this._html = v; this.children = []; } });
  return e;
}
const byId = {};
const find = sel => byId[sel] || (byId[sel] = el());
const store = new Map(); let storageOff = false;
const requests = []; const failing = new Set(); // image files asked for, in order; files that fail to load
class FakeImage {
  set src(v) { this._src = v; requests.push(v); setTimeout(() => { if (failing.has(v)) { if (this.onerror) this.onerror(); } else { this.naturalWidth = this.width = this.naturalHeight = this.height = /big/.test(v) ? 2000 : 500; /* (1 MB decoded, or 16) */ this.complete = true; if (this.onload) this.onload(); } }, 1); }
  get src() { return this._src; }
}
const anyFn = (special = {}) => new Proxy(special, { get: (t, k) => k in t ? t[k] : (() => undefined) });
const g = globalThis;
g.window = g;
g.document = { getElementById: id => find('#' + id), querySelector: find, querySelectorAll: () => [], createElement: el, createTextNode: text => ({ text }), body: el(), documentElement: el(), addEventListener() {}, readyState: 'complete', hidden: false };
g.location = { search: process.env.SEARCH || '?mem=40', protocol: 'http:', href: 'http://unit/' }; // (?mem=40: a 40 MB image budget, so letting go can be tested)
g.localStorage = { getItem: k => { if (storageOff) throw new Error('off'); return store.has(k) ? store.get(k) : null; }, setItem: (k, v) => { if (storageOff) throw new Error('off'); store.set(k, String(v)); }, removeItem: k => { store.delete(k); } };
g.matchMedia = () => ({ matches: false });
g.requestAnimationFrame = () => 0;
g.addEventListener = () => {};
g.Image = FakeImage;
Object.defineProperty(g, 'navigator', { value: { userAgent: 'node', platform: 'node', maxTouchPoints: 0 }, configurable: true });
const sounds = [];
g.Sound = anyFn({ sfx: n => { sounds.push(n); }, voiceLevel: () => 0, playVoice: async () => null, voicePlaying: () => false, musicOn: true, voiceOn: true });
g.FX = anyFn({ icon: () => el('canvas'), mk: () => [el('canvas'), ctx2d], makeFog: () => ({}) });
g.LINES = { hello: ['alan', 'Hello.'], bye: ['alan', 'Goodbye.'] };
g.SPEAKERS = { alan: ['Alan', '#fff'] };
g.GAME_KEY = 'unit'; g.SAVE_SLOT = 't'; g.SAVE_VERSION = 2; g.FIRST_ROOM = 'hall';
g.SAVE_MIGRATE = { 0: st => { st.flags.from0 = true; }, 1: st => { st.flags.from1 = true; } };
g.FAST = true; // (no eased waits: saves, rooms and lines answer at once)

for (const f of ['engine/base.js', 'engine/actor.js', 'engine/geometry.js', 'engine/rooms.js', 'engine/speech.js', 'engine/inventory.js', 'engine/stills.js', 'engine/saves.js', 'engine.js'])
  vm.runInThisContext(readFileSync(path.join(root, 'js', f), 'utf8'), { filename: f });
const E = g.Engine, Game = g.Game;
E.noteInput = () => {}; E.updateHover = () => {}; E.runHandler = async () => {}; E.frame = () => {};
const toasts = []; const realToast = E.toast; find('#toast');
const toastEl = find('#toast'); Object.defineProperty(toastEl, 'textContent', { set(v) { toasts.push(v); }, get() { return toasts[toasts.length - 1] || ''; } });

// ---------------------------------------------------------------- floors and routes
{
  const { GROUND_K } = E;
  const inPoly = (x, y, p) => { let ins = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins; } return ins; };
  const square = [[100, 500], [1100, 500], [1100, 700], [100, 700]];
  // a floor with a table standing in from the top edge: a walk from one side of it to the other goes under it
  const notch = [[100, 500], [500, 500], [500, 640], [700, 640], [700, 500], [1100, 500], [1100, 700], [100, 700]];
  const inside = (pts, p) => pts.every(q => inPoly(q[0], q[1], p));
  const legsInside = (a, pts, p) => { let q = a; for (const b of pts) { for (let i = 1; i < 20; i++) { const t = i / 20; if (!inPoly(q[0] + (b[0] - q[0]) * t, q[1] + (b[1] - q[1]) * t, p)) return false; } q = b; } return true; };
  const len = (a, pts) => { let q = a, s = 0; for (const b of pts) { s += Math.hypot(b[0] - q[0], (b[1] - q[1]) * GROUND_K); q = b; } return s; };
  let r = E.route([200, 600], [900, 650], square);
  ok('route: a clear floor is walked straight', r.length === 1 && r[0][0] === 900 && r[0][1] === 650, r);
  const a = [300, 520], b = [900, 520];
  r = E.route(a, b, notch);
  ok('route: round the table, not through it', r.length >= 3 && legsInside(a, r, notch) && r[r.length - 1][0] === 900, r);
  ok('route: by the short way', len(a, r) < len(a, [[490, 690], [710, 690], b]) + 1 && len(a, r) > Math.hypot(600, 0), [len(a, r)]);
  r = E.route(a, [900, 300], notch);
  ok('route: an end off the floor is walked straight (someone behind a counter)', r.length === 1, r);
  const c = E.clampToPoly(600, 560, notch);
  ok('clamp: a click on the table lands on the floor beside it', inPoly(c[0], c[1], notch) && Math.hypot(c[0] - 600, c[1] - 560) < 120, c);
  // every room's own floor: a click anywhere off it lands on it (2026-11-11: beside a cut-out it landed 3 px inside the furniture)
  let offs = 0, tried = 0; for (let x = 60; x < 1160; x += 37) for (let y = 460; y < 740; y += 23) { if (inPoly(x, y, notch)) continue; tried++; const q = E.clampToPoly(x, y, notch); if (!inPoly(q[0], q[1], notch)) offs++; }
  ok('clamp: from anywhere off the floor, onto it', tried > 100 && offs === 0, { tried, offs });
  const inC = E.clampToPoly(300, 600, notch); ok('clamp: a click on the floor stays where it is', inC[0] === 300 && inC[1] === 600, inC);
  g.FAST = false; // (rounded corners are skipped under FAST)
  const rc = E.roundCorners(a, E.route(a, b, notch), notch, 300);
  g.FAST = true;
  ok('corners: rounded, and every point still on the floor', rc.length > 3 && inside(rc, notch) && legsInside(a, rc, notch), [rc.length]);
  ok('hit: rectangle and polygon', E.hitShape({ rect: [10, 10, 20, 20] }, 15, 15) && !E.hitShape({ rect: [10, 10, 20, 20] }, 31, 15) && E.hitShape({ poly: square }, 600, 600) && !E.hitShape({ poly: notch }, 600, 560));
  ok('area: rectangle and polygon', E.hotArea({ rect: [0, 0, 30, 20] }) === 600 && E.hotArea({ poly: square }) === 200000);
}

// ---------------------------------------------------------------- how long a change of painting takes
{
  const F = E.FADES, t = E.fadeTime, base = { run: false, similar: false, forced: false, inRun: false, flat: false, stepX: false, turned: false, edge: false, plain: false, via: false, walking: false, runStep: 1 / 24, xfNext: 0 };
  const T = (c, want, name) => ok('change: ' + name, near(t(Object.assign({}, base, c)), want), [t(Object.assign({}, base, c)), want]);
  T({}, F.MORPH_T, 'a pose with morph data bends over');
  T({ plain: true }, F.XFADE, 'any other change dissolves');
  T({ plain: true, walking: true }, F.WALK_XF, 'quicker while walking');
  T({ plain: true, via: true }, F.XFADE_SHORT, 'quicker through the front view of a turn');
  T({ similar: true }, F.XFADE_SHORT, 'two near-identical paintings');
  T({ similar: true, edge: true }, F.WALK_XF, 'into or out of a walk');
  T({ similar: true, turned: true }, F.TURN_XF, 'a turn with no front view');
  T({ similar: true, stepX: true }, F.WALK_DISSOLVE, 'a walk step set to dissolve');
  T({ similar: true, flat: true }, F.XFADE, 'morph data but no mesh warp');
  T({ similar: true, forced: true, xfNext: 0.25, flat: true, edge: true }, 0.25, 'a dissolve the story asked for wins');
  T({ run: true, similar: true }, 1 / 24, 'a run: one frame into it');
  T({ run: true, similar: true, inRun: true }, 1 / 48, 'a run: half a frame inside it');
  T({ run: true, similar: true, forced: true, xfNext: 0.3 }, 0.3, 'a run the story dissolves');
  E.SPRITES = { r: {}, l: { facesLeft: true }, x_front: {} };
  ok('facing: right never bends into left, front goes with either', E.sameFacing('r', false, 'r', false) && !E.sameFacing('r', false, 'l', false) && E.sameFacing('r', false, 'l', true) && E.sameFacing('x_front', false, 'l', false));
}

// ---------------------------------------------------------------- a small game for the rest
const frames = n => Array.from({ length: n }, (_, i) => 'alan_w' + i);
const CHARS = { alan: { frames: { idle: ['alan_side'], talk: ['alan_talk'], walk: frames(8) } }, ines: { frames: { idle: ['ines_side', 'ines_idle2'], talk: ['ines_talk'], poses: { wave: 'ines_wave' } } },
  bo: { frames: { idle: ['bo_side'] } } };
const SPR = {}; for (const k of ['alan_side', 'alan_talk', ...frames(8), 'ines_side', 'ines_idle2', 'ines_talk', 'ines_wave', 'bo_side']) SPR[k] = { w: 200, h: 400, hh: 400, ax: 100, fy: 400, top: 0 };
const floor = [[100, 500], [500, 500], [500, 640], [700, 640], [700, 500], [1100, 500], [1100, 700], [100, 700]];
let left = 0, entered = 0;
const ROOMS = {
  hall: { bg: 'hall', bgs: ['hall_night'], walk: floor, scale: [500, 300, 700, 300], npcs: [{ id: 'ines', x: 900, y: 600, dir: 'w', name: 'Inês' }], layers: [{ img: 'hall_lamp', x: 0, y: 0 }], leave() { left++; }, enter() { entered++; } },
  yard: { bg: 'yard', walk: floor, npcs: [{ id: 'bo', x: 400, y: 600, name: 'Bo', when: () => !!Game.flags.bo_here }] },
  attic: { bg: 'attic', noSave: true }, cellar: { bg: 'cellar' }, roof: { bg: 'roof' },
};
const ITEMS = { notebook: { name: 'Notebook' }, key: { name: 'Key' } };
g.STILLS = ['still_one'];

// ---------------------------------------------------------------- the loader
{
  await Game.init(CHARS, ITEMS, ROOMS, SPR);
  await tick(60);
  const at = f => requests.findIndex(r => r.includes(f)), L = Game.loading();
  ok('loader: every image registered once', L.total === Object.keys(SPR).length + 6 /* paintings */ + 1 /* still */ + 1 /* layer */, L);
  ok('loader: the first room and Alan before anything else', at('bg/hall.jpg') === 0 && at('sprites/alan_side') < at('bg/yard') && at('sprites/alan_w3') < at('bg/yard') && at('sprites/ines_side') < at('bg/yard'), requests.slice(0, 16));
  ok('loader: then everything its people can do, then the stills, then the other rooms', at('sprites/ines_wave') < at('stills/still_one') && at('stills/still_one') < at('bg/yard') && at('bg/yard') < at('bg/roof'), requests);
  ok('loader: nothing asked for twice', new Set(requests).size === requests.length, [requests.length]);
  ok('loader: the title waits for nothing, and the stream ends with everything in', find('#title').classList.contains('ready') && Game.loading().done === L.total);
  // a file that fails is tried once more, then left
  const n0 = requests.length; failing.add('art/sprites/ghost.webp');
  const r1 = await Game.addSprite('ghost', { w: 10, h: 10, hh: 10, ax: 5, fy: 10 }); const r2 = await E.want('spr:ghost', true); const r3 = await E.want('spr:ghost', true);
  ok('loader: a missing file is tried twice, never a third time', r1 === null && r2 === null && r3 === null && requests.length - n0 === 2, requests.slice(n0));
  // the memory budget (?mem=40): a painting is 1 MB here, the three big ones 16 each; the room Alan is in is never let go
  await Game.goRoom('hall', null, { instant: true });
  for (const k of ['big1', 'big2', 'big3']) await Game.addSprite(k, { w: 2000, h: 2000, hh: 2000, ax: 1000, fy: 2000 });
  const held0 = Game.loading().held;
  await tick(5); const realNow = performance.now; const t0 = realNow.call(performance);
  performance.now = () => t0 + 20000; // (twenty seconds on: nothing has been drawn since)
  const dropped = E.evict(['hall']); performance.now = realNow;
  const keep = E.roomAssets('hall');
  ok('memory: over the budget, the unused are let go, down to three quarters of it', held0 > 40 && dropped > 0 && Game.loading().held <= 30, { held0, dropped, held: Game.loading().held });
  ok('memory: never what the room Alan is in needs', keep.every(k => Game.image(k)), keep.filter(k => !Game.image(k)));
  const back = await E.want('bg:roof', true);
  ok('memory: what was let go comes back when wanted', !!back && !!Game.image('bg:roof'));
}

// ---------------------------------------------------------------- rooms
{
  left = entered = 0;
  await Game.goRoom('yard', null, { instant: true });
  ok('rooms: the room left is told, Alan stands at the way in, the room is saved', left === 1 && Game.room.id === 'yard' && Game.state.room === 'yard' && JSON.parse(store.get('unit-save-t')).room === 'yard');
  ok('rooms: only who is there now is there', Game.npcs.length === 0);
  Game.flags.bo_here = true; Game.refreshNpcs();
  const bo = Game.npc('bo'); Game.refreshNpcs();
  ok('rooms: someone arriving is added, and stays the same figure', !!bo && Game.npc('bo') === bo);
  let threw = null; try { await Game.goRoom('nowhere', null, { instant: true }); } catch (e) { threw = String(e.message); }
  ok('rooms: a room that does not exist is refused and nothing is left locked', threw === 'no room nowhere' && Game.room.id === 'yard' && !Game.isBusy, [threw, E.busy]);
  ROOMS.cellar.leave = () => { throw new Error('boom'); };
  await Game.goRoom('cellar', null, { instant: true }); const errLog = console.error; console.error = () => {}; await Game.goRoom('hall', null, { instant: true }); console.error = errLog;
  ok('rooms: a leave hook that throws does not stop the way out', Game.room.id === 'hall' && E.busy === 0);
  const before = store.get('unit-save-t'); await Game.goRoom('attic', null, { instant: true });
  ok('rooms: a room marked noSave is not saved', store.get('unit-save-t') === before && JSON.parse(before).room === 'hall');
  await Game.goRoom('hall', null, { instant: true });
}

// ---------------------------------------------------------------- saves
{
  const save = o => JSON.stringify(Object.assign({ room: 'yard', inv: [], flags: {}, px: 400, py: 650, dir: 'w', savedAt: 1 }, o));
  let r = await E.loadSave(save({ inv: ['notebook', 'brass_weight', 'key'], v: 2 }));
  ok('save: opens in its room, where Alan stood', r === true && Game.room.id === 'yard' && Game.player.x === 400 && Game.player.dir === 'w');
  ok('save: an item this build does not know is dropped', Game.state.inv.join() === 'notebook,key', Game.state.inv);
  ok('save: a current save is not migrated', !Game.flags.from0 && !Game.flags.from1 && Game.state.v === 2);
  await E.loadSave(save({ v: 1 })); ok('save: one version behind takes one step', !Game.flags.from0 && Game.flags.from1 === true && Game.state.v === 2, Game.flags);
  await E.loadSave(save({})); ok('save: a save from before versions takes every step', Game.flags.from0 === true && Game.flags.from1 === true, Game.flags);
  ok('save: a room that is gone, a save with no flags, and rubbish are refused', (await E.loadSave(save({ room: 'gone' }))) === false && (await E.loadSave('{"room":"yard"}')) === false && (await E.loadSave('{nope')) === false && Game.room.id === 'yard');
  await E.loadSave(save({ inv: 'x' })); ok('save: a broken inventory becomes an empty one', Array.isArray(Game.state.inv) && Game.state.inv.length === 0);
  store.set('unit-save-t', save({ room: 'hall', savedAt: 100 })); store.set('unit-save-t-manual', save({ room: 'yard', savedAt: 200 }));
  ok('save: Continue takes the newer of the two', JSON.parse(E.newestSave()).room === 'yard');
  store.set('unit-save-t', save({ room: 'hall', savedAt: 300 })); ok('save: ...whichever it is', JSON.parse(E.newestSave()).room === 'hall' && E.hasSave());
  Game.clearSaves(); ok('save: cleared', !E.hasSave() && E.newestSave() === null);
  Game.flags.dawn = false; ok('save: autosave writes the state, with its version and the time', E.autosave() === true && JSON.parse(store.get('unit-save-t')).v === 2 && JSON.parse(store.get('unit-save-t')).savedAt > 1e12);
  Game.checkpoint(); const cp = JSON.parse(Game.flags._checkpoint); ok('save: a checkpoint holds the state without an older checkpoint inside it', cp.room === Game.state.room && cp.flags._checkpoint === null);
  // storage off: said once, never silently
  storageOff = true; g.FAST = false; toasts.length = 0;
  const a1 = E.autosave(), a2 = E.autosave(); await tick(20); g.FAST = true; storageOff = false;
  ok('save: a browser that will not keep the game says so, once', a1 === false && a2 === false && toasts.length === 1 && /Save to file/.test(toasts[0]), toasts);
  ok('save: loading with storage off does not throw', await (async () => { storageOff = true; try { return (await E.loadSave()) === false; } catch (e) { return false; } finally { storageOff = false; } })());
}

// ---------------------------------------------------------------- walking
{
  await Game.goRoom('hall', null, { pos: [300, 520, 'e'] });
  const a = Game.player, steps = [];
  const inPoly = (x, y, p) => { let ins = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins; } return ins; };
  g.Sound.step = () => { steps.push(a.x); };
  let arrived = false, off = 0, back = 0, moved = 0, n = 0, px = a.x, py = a.y, maxStep = 0;
  a.walkTo(900, 520).then(() => { arrived = true; });
  const phase0 = a.phase; let phases = 0, lastPhase = phase0;
  for (; n < 2000 && a.walking; n++) {
    a.update(1 / 60);
    if (!inPoly(a.x, a.y, floor)) off++;
    const d = Math.hypot(a.x - px, (a.y - py) * E.GROUND_K); moved += d; maxStep = Math.max(maxStep, d); px = a.x; py = a.y;
    if (a.walking) { phases += a.phase - lastPhase; lastPhase = a.phase; }
  }
  await tick(1);
  const hh = a.height();
  ok('walk: arrives, exactly, and says so', arrived && a.x === 900 && a.y === 520 && !a.walking && a.phase === 0, [a.x, a.y, n]);
  ok('walk: never off the floor on the way round the table', off === 0, [off]);
  ok('walk: at a walking pace, never faster', maxStep <= hh * 0.62 / 60 + 1e-6 && n > moved / (hh * 0.62 / 60) - 1, { maxStep, full: hh * 0.62 / 60, n });
  ok('walk: the legs follow the ground covered (a frame every 0.085 of his height)', near(phases, moved / (hh * 0.085), 1.1), { phases, want: moved / (hh * 0.085) });
  ok('walk: a footfall every half cycle', Math.abs(steps.length - phases / 4) <= 2, { steps: steps.length, want: phases / 4 });
  // a change of mind: the first walk's promise is settled, the second is the one he finishes
  let first = false, second = false; a.walkTo(300, 680).then(() => { first = true; }); for (let i = 0; i < 20; i++) a.update(1 / 60);
  a.walkTo(1000, 680).then(() => { second = true; }); await tick(1);
  for (let i = 0; i < 2000 && a.walking; i++) a.update(1 / 60); await tick(1);
  ok('walk: a change of mind settles the first walk and finishes the second', first && second && a.x === 1000, [first, second, a.x]);
  a.hurry = false; a.walkTo(200, 680); a.update(1 / 60); a.hurry = true; const x0 = a.x; for (let i = 0; i < 30; i++) a.update(1 / 60); const fast = x0 - a.x;
  a.stop(); a.x = 1000; a.walkTo(200, 680); a.update(1 / 60); const x1 = a.x; for (let i = 0; i < 30; i++) a.update(1 / 60); const slow = x1 - a.x; a.stop();
  ok('walk: a double-click hurries him (about twice the ground)', fast > slow * 1.6 && fast < slow * 2.4 && a.hurry === false, { fast, slow });
  ok('walk: a short step into place takes the facing asked for', (() => { a.x = 500; a.y = 680; a.dir = 'e'; a.walkTo(520, 680, 'w'); a.update(1 / 60); const d = a.dir; a.stop(); return d === 'w'; })());
}

// ---------------------------------------------------------------- the dialogue menu and close-ups
{
  const dlg = find('#dialog'); const said = []; Game.sayChoice = async id => { said.push(id); };
  const warn = console.warn; const warned = []; console.warn = (...a) => { warned.push(a.join(' ')); };
  let ran = 0;
  const p = E.dialog([{ line: 'hello', once: true, run: async () => { ran++; } }, { line: 'not_recorded' }, { label: 'Leave it.', bye: true }]);
  await tick(1);
  ok('dialogue: a topic whose line is missing is left out, the rest are offered', dlg.children.length === 2 && warned.some(w => /not_recorded/.test(w)) && !!E.dialogResolve, [dlg.children.length, warned]);
  dlg.children[0].click(); await tick(5);
  ok('dialogue: a choice is spoken and run, and a once-only topic is not offered again', said.join() === 'hello' && ran === 1 && dlg.children.length === 1, [said, ran, dlg.children.length]);
  dlg.children[0].click(); await p;
  ok('dialogue: goodbye ends it and nothing is left waiting', E.dialogResolve === null && !dlg.classList.contains('open') && E.busy === 0);
  await E.dialog([{ line: 'not_recorded' }]);
  ok('dialogue: nothing to offer ends at once instead of waiting for ever', E.dialogResolve === null && warned.some(w => /nothing left/.test(w)));
  console.warn = warn;
  // close-ups
  g.FAST = false; const cu = find('#closeup'); const b0 = E.busy;
  const c1 = E.closeup([{ html: 'one' }]); const c2 = E.closeup([{ html: 'two' }, { html: 'three' }]);
  await c1; ok('close-up: a second one closes the first', E.busy === b0 + 1 && !cu.classList.contains('hidden'));
  cu.onclick({ target: cu }); await c2; g.FAST = true;
  ok('close-up: closing it gives the game back', E.busy === b0 && cu.classList.contains('hidden'));
}

// ---------------------------------------------------------------- items
{
  Game.state.inv = []; sounds.length = 0;
  Game.giveItem('key'); Game.giveItem('key'); Game.giveItem('notebook', true);
  ok('items: given once, with its sound unless silent', Game.state.inv.join() === 'key,notebook' && sounds.length === 1 && Game.has('key'), [Game.state.inv, sounds]);
  E.selItem = 'key'; Game.takeItem('key');
  ok('items: taken away, and off the cursor', !Game.has('key') && E.selItem === null);
}

void realToast;
console.log((failed ? failed + ' FAILED, ' : 'all ') + passed + ' passed');
process.exit(failed ? 1 : 0);
