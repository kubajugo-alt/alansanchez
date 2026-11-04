// Robustness (ported from Game I's scripts/tests/robustness.mjs): 1. a save with an item this build doesn't know loads
// without it; 2. a save that throws while loading falls back to a new game (with the toast); 3. busy is released after a
// throwing leave hook, a bad room id and a throwing line; a second toast keeps its own time; voices off is saved
// (shortest-night-* keys); 4. voices off survives a reload; 5. Wednesday: the phone box's hint follows what is left
// (everything but the faxes -> the fax hint; then the museum; then "done"), everything done makes the day ready and
// room 404 ends Wednesday into Thursday; Thursday's hint follows the puzzles (the two tellings, then folio 12);
// 6. WebGL context loss: frames go on, no errors, and fresh contexts are built.
// (Game I's retired 'weight' item, its Ch. II tide-card/clocks hint and its Ch. III Chiado hint are Game I's story: they
// are replaced by Game II's Wednesday and Thursday above.)
//   node scripts/tests/robustness.mjs [baseUrl] [section,section]   (serve sequel/ first: npx -y http-server sequel -p 8101 -c-1 -s)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8101/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
let bad = 0;
const ok = (name, cond, extra) => { if (!cond) bad++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); };
async function page0(fast = true, init, q = '') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.errs = [];
  page.on('pageerror', e => page.errs.push(e.message));
  if (fast) await page.addInitScript(() => { window.FAST = true; });
  await page.addInitScript(() => { try { localStorage.setItem('shortest-night-content', 'full'); } catch (e) {} });
  if (init) await page.addInitScript(init);
  const t0 = Date.now();
  await page.goto(base + q, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 180000 });
  console.log('  title ready in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  return page;
}
const settle = page => (console.log('  settling...'), 0) || page.evaluate(async () => { for (let i = 0; i < 300; i++) { await new Promise(r => setTimeout(r, 100)); if (!Game.isBusy && !Engine.cutscene) return true; } return false; });

const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
let SEC = 0;
// 1. a save with an item this build doesn't know: Continue loads it, without the item
if (!ONLY || ONLY.includes(++SEC)) {
  const page = await page0(true, () => localStorage.setItem('shortest-night-save-v1', JSON.stringify({ v: 1, room: 'hotel_lobby', inv: ['notebook', 'no_such_item', 'coins'], flags: { ch: 2, coins: 2 }, px: 600, py: 660, dir: 'e', savedAt: Date.now() })));
  const r = await page.evaluate(async () => { await Game.begin(false); return { room: Game.room && Game.room.id, inv: Game.state.inv, busy: Engine.busy }; });
  ok('save with unknown item loads', r.room === 'hotel_lobby' && !r.inv.includes('no_such_item') && r.inv.includes('coins') && r.busy === 0 && !page.errs.length, JSON.stringify(r) + page.errs.join('|'));
  await page.close();
}
// 2. a save that throws while loading: a new game starts
if (!ONLY || ONLY.includes(++SEC)) {
  const page = await page0(true, () => localStorage.setItem('shortest-night-save-v1', JSON.stringify({ v: 1, room: 'hotel_lobby', inv: [], flags: { ch: 1 }, savedAt: Date.now() })));
  const r = await page.evaluate(async () => {
    const orig = Engine.goRoom; let n = 0;
    Engine.goRoom = function (...a) { if (n++ === 0) throw new Error('boom'); return orig.apply(this, a); };
    const p = Game.begin(false); for (let i = 0; i < 300 && !Game.room; i++) await new Promise(r => setTimeout(r, 200));
    return { started: !!Game.room, room: Game.room && Game.room.id, toast: document.querySelector('#toast').textContent, fade: document.querySelector('#fade').classList.contains('on') };
  });
  ok('throwing load falls back to a new game', r.started && /couldn't be opened/.test(r.toast), JSON.stringify(r));
  await page.close();
}
// 3. busy counters after exceptions; toasts; the voices setting
if (!ONLY || ONLY.includes(++SEC)) {
  const page = await page0(true);
  await page.evaluate(() => Game.begin(true)); await settle(page);
  const r = await page.evaluate(async () => {
    const out = {};
    await Game.goRoom('hotel_lobby');
    const b0 = Engine.busy;
    const room = Game.room; const lv = room.leave; room.leave = () => { throw new Error('leave boom'); };
    try { await Game.goRoom('canteras'); } catch (e) { out.goErr = e.message; }
    room.leave = lv;
    out.goBusy = Engine.busy - b0; out.goRoom = Game.room.id; out.fade = document.querySelector('#fade').classList.contains('on');
    try { await Game.goRoom('nowhere'); } catch (e) { out.badRoom = e.message; }
    out.badBusy = Engine.busy - b0;
    const pv = Sound.playVoice; Sound.playVoice = () => { throw new Error('voice boom'); };
    try { await Game.say('alan_fail_05'); } catch (e) { out.sayErr = e.message; }
    Sound.playVoice = pv;
    out.sayBusy = Engine.busy - b0;
    Game.toast('first'); await new Promise(r => setTimeout(r, 1000)); Game.toast('second');
    await new Promise(r => setTimeout(r, 900)); out.toastOn = document.querySelector('#toast').classList.contains('on');
    Sound.setVoice(false); out.voiceKey = localStorage.getItem('shortest-night-music-volume-voice-off'); Sound.setVoice(true);
    return out;
  });
  ok('throwing leave hook still enters the room', r.goBusy === 0 && r.goRoom === 'canteras' && !r.fade && !r.goErr, JSON.stringify(r));
  ok('bad room id leaves busy at rest', r.badBusy === 0 && /no room/.test(r.badRoom || ''), JSON.stringify(r));
  ok('throwing line releases busy', r.sayBusy === 0 && r.sayErr === 'voice boom', JSON.stringify(r));
  ok('second toast keeps its own time', r.toastOn, JSON.stringify(r));
  ok('voices off is saved', r.voiceKey === '1', JSON.stringify(r));
  ok('no page errors (section 3)', !page.errs.length, page.errs.join('|'));
  await page.close();
}
// 4. voices off survives a reload
if (!ONLY || ONLY.includes(++SEC)) {
  const page = await page0(true, () => localStorage.setItem('shortest-night-music-volume-voice-off', '1'));
  ok('voices off restored', await page.evaluate(() => Sound.voiceOn === false));
  await page.close();
}
// 5. Wednesday: the phone box's hint follows what's left; everything done -> room 404 ends the day. Thursday's puzzles.
if (!ONLY || ONLY.includes(++SEC)) {
  const page = await page0(true);
  await page.evaluate(() => Game.begin(true)); await settle(page);
  const r = await page.evaluate(async () => {
    const f = Game.flags;
    Object.assign(f, { ch: 2, tue_done: true, saw_helmet: true, clock_wound: true, fermin_letter: true, carmen_wed: true, saw_disc_list: true });
    const h1 = S.hint();
    f.faxed_inscription = true; const h1b = S.hint();
    f.faxed_letter = true; f.saw_disc_list = false; const h2 = S.hint();
    f.saw_disc_list = true; const h3 = S.hint();
    await S.checkWed();
    const ready = !!f.wed_ready;
    await Game.goRoom('hotel_lobby', null, { noEnter: true, instant: true });
    const go = Game.goRoom('hotel_room', 'hotel_lobby');
    for (let i = 0; i < 300 && f.ch !== 3; i++) await new Promise(r => setTimeout(r, 100));
    await go;
    return { h1, h1b, h2, h3, ready, done: !!f.wed_done, ch: f.ch };
  });
  ok('Wed missing faxes -> fax hint', r.h1 === 'ines_hint_fax' && r.h1b === 'ines_hint_fax', JSON.stringify(r));
  ok('Wed faxes sent, no list -> museum hint; all -> done', r.h2 === 'ines_hint_museum' && r.h3 === 'ines_hint_wed_done', JSON.stringify(r));
  ok('Wed everything done -> ready; room 404 ends it into Thursday', r.ready && r.done && r.ch === 3, JSON.stringify(r));
  await settle(page);
  const h = await page.evaluate(() => {
    const f = Game.flags; Object.assign(f, { ch: 3, lore_carmen: true, inquiry_read: true, tellings: false, folio12: false, called_thu: true, suitcase_done: false, dinner_intro: false });
    const a = S.hint(); f.tellings = true; const b = S.hint(); f.folio12 = true; const c = S.hint(); return [a, b, c];
  });
  ok('Thu hint follows the puzzles (tellings, folio, suitcase)', h[0] === 'ines_hint_tellings' && h[1] === 'ines_hint_folio' && h[2] === 'ines_hint_suitcase', JSON.stringify(h));
  ok('no page errors (section 5)', !page.errs.length, page.errs.join('|'));
  await page.close();
}
// 6. GL context loss: frames go on, no errors, and GL comes back
if (!ONLY || ONLY.includes(++SEC)) {
  const page = await page0(false, () => {
    window.__gl = [];
    const gc = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (t, o) { const c = gc.call(this, t, o); if (c && /webgl/.test(t) && !window.__gl.includes(c)) window.__gl.push(c); return c; };
  }, '?scene=lobby');
  await page.evaluate(() => { Game.begin(true); });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(async () => {
    const n0 = window.__gl.length;
    const live = window.__gl.filter(g => !g.isContextLost());
    for (const g of live) { const x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }
    await new Promise(r => setTimeout(r, 1500));
    return { n0, lost: live.length, n1: window.__gl.length, pactive: window.Parallax && Parallax.active, wok: window.Warp && Warp.ok, warp: window.WARP };
  });
  ok('GL context loss: fresh contexts built, no errors', r.lost > 0 && r.n1 > r.n0 && !page.errs.length, JSON.stringify(r) + page.errs.join('|'));
  await page.close();
}

await browser.close();
console.log(bad ? bad + ' failing' : 'all passed');
process.exit(bad ? 1 : 0);
