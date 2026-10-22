// Robustness (2026-10-22, docs/animation_handoff.md entry 50): a save with an unknown item, a save that throws, busy
// released after a throwing leave hook / bad room / throwing line, toasts, the voices setting, the Ch. II hint and end,
// the Ch. III hint order, GL context loss.  node scripts/tests/robustness.mjs [baseUrl] [section,section]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const results = [];
const ok = (name, cond, extra) => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); };
async function page0(fast = true, init, q = '') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.errs = [];
  page.on('pageerror', e => page.errs.push(e.message));
  if (fast) await page.addInitScript(() => { window.FAST = true; });
  if (init) await page.addInitScript(init);
  const t0 = Date.now();
  await page.goto(base + q, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 180000 });
  console.log('  title ready in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  return page;
}
const settle = page => (console.log('  settling...'), 0) || page.evaluate(async () => { for (let i = 0; i < 200; i++) { await new Promise(r => setTimeout(r, 100)); if (!Game.isBusy && !Engine.cutscene) return true; } return false; });

const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
let SEC = 0;
// 1. a save with an item this build doesn't know: Continue loads it
if (!ONLY || ONLY.includes(++SEC)){
  const page = await page0(true, () => localStorage.setItem('drowned-bell-save-v3', JSON.stringify({ room: 'shop', inv: ['notebook', 'no_such_item', 'weight'], flags: { ch: 1 }, px: 600, py: 640, dir: 'e', savedAt: Date.now() })));
  const r = await page.evaluate(async () => { await Game.begin(false); return { room: Game.room && Game.room.id, inv: Game.state.inv, busy: Engine.busy }; });
  ok('save with unknown item loads', r.room === 'shop' && !r.inv.includes('no_such_item') && !r.inv.includes('weight') && r.busy === 0 && !page.errs.length, JSON.stringify(r) + page.errs.join('|'));
  await page.close();
}
// 2. a save that throws while loading: a new game starts
if (!ONLY || ONLY.includes(++SEC)){
  const page = await page0(true, () => localStorage.setItem('drowned-bell-save-v3', JSON.stringify({ room: 'shop', inv: [], flags: { ch: 1 }, savedAt: Date.now() })));
  const r = await page.evaluate(async () => {
    const orig = Engine.goRoom; let n = 0;
    Engine.goRoom = function (...a) { if (n++ === 0) throw new Error('boom'); return orig.apply(this, a); };
    const p = Game.begin(false); for (let i = 0; i < 300 && !Game.room; i++) await new Promise(r => setTimeout(r, 200));
    return { started: !!Game.room, toast: document.querySelector('#toast').textContent, fade: document.querySelector('#fade').classList.contains('on') };
  });
  ok('throwing load falls back to a new game', r.started && /couldn't be opened/.test(r.toast), JSON.stringify(r));
  await page.close();
}
// 3-5. busy counters after exceptions; toasts; voice setting
if (!ONLY || ONLY.includes(++SEC)){
  const page = await page0(true);
  await page.evaluate(() => Game.begin(true)); await settle(page);
  const r = await page.evaluate(async () => {
    const out = {};
    await Game.goRoom('shop');
    const b0 = Engine.busy;
    const room = Game.room; const lv = room.leave; room.leave = () => { throw new Error('leave boom'); };
    try { await Game.goRoom('street'); } catch (e) { out.goErr = e.message; }
    room.leave = lv;
    out.goBusy = Engine.busy - b0; out.goRoom = Game.room.id; out.fade = document.querySelector('#fade').classList.contains('on');
    try { await Game.goRoom('nowhere'); } catch (e) { out.badRoom = e.message; }
    out.badBusy = Engine.busy - b0;
    const pv = Sound.playVoice; Sound.playVoice = () => { throw new Error('voice boom'); };
    try { await Game.say('alan_tenth'); } catch (e) { out.sayErr = e.message; }
    Sound.playVoice = pv;
    out.sayBusy = Engine.busy - b0;
    Game.toast('first'); await new Promise(r => setTimeout(r, 1000)); Game.toast('second');
    await new Promise(r => setTimeout(r, 900)); out.toastOn = document.querySelector('#toast').classList.contains('on');
    Sound.setVoice(false); out.voiceKey = localStorage.getItem('drowned-bell-music-volume-voice-off'); Sound.setVoice(true);
    return out;
  });
  ok('throwing leave hook still enters the room', r.goBusy === 0 && r.goRoom === 'street' && !r.fade && !r.goErr, JSON.stringify(r));
  ok('bad room id leaves busy at rest', r.badBusy === 0 && /no room/.test(r.badRoom || ''), JSON.stringify(r));
  ok('throwing line releases busy', r.sayBusy === 0 && r.sayErr === 'voice boom', JSON.stringify(r));
  ok('second toast keeps its own time', r.toastOn, JSON.stringify(r));
  ok('voices off is saved', r.voiceKey === '1', JSON.stringify(r));
  await page.close();
}
// voices off survives a reload
if (!ONLY || ONLY.includes(++SEC)){
  const page = await page0(true, () => localStorage.setItem('drowned-bell-music-volume-voice-off', '1'));
  ok('voices off restored', await page.evaluate(() => Sound.voiceOn === false));
  await page.close();
}
// 6. Ch. II: everything done but the drawer -> the clocks hint; the shop ends the chapter without ch2_ready
if (!ONLY || ONLY.includes(++SEC)){
  const page = await page0(true);
  await page.evaluate(() => Game.begin(true)); await settle(page);
  const r = await page.evaluate(async () => {
    const f = Game.flags;
    Object.assign(f, { heard_machine: true, got_ledger: true, saw_list: true, sketched_tile: true, knows_brotherhood: true, ch: 2, heard_song: true, drawer_open: true, ferreira_open: true, visited_ferreira: true, ferreira_lit: true, met_celeste: true, tide_known: true, knows_1955_boy: true, turnings_deduced: true, lore_turnings: true });
    const h1 = S.hint();
    f.tidecardTaken = true; Game.giveItem('tidecard');
    const h2 = S.hint();
    await Game.goRoom('street');
    await Game.goRoom('shop');
    for (let i = 0; i < 100 && !f.ch2_done; i++) await new Promise(r => setTimeout(r, 100));
    return { h1, h2, done: !!f.ch2_done };
  });
  ok('Ch II missing tide card -> clocks hint', r.h1 === 'ines_hint_clocks', JSON.stringify(r));
  ok('Ch II ends on entering the shop without ch2_ready', r.done, JSON.stringify(r));
  // Ch. III: Chiado chosen -> the tongue thread first
  const h3 = await page.evaluate(() => { const f = Game.flags; Object.assign(f, { ch: 3, decoded: true, chose_chiado: true, founder_order: false, has_tongue: false }); const a = S.hint(); f.chose_chiado = false; const b = S.hint(); return [a, b]; });
  ok('Ch III hint follows the Chiado', h3[0] === 'ines_hint_see_case' && h3[1] === 'ines_hint_order', JSON.stringify(h3));
  await page.close();
}
// 7. GL context loss: frames go on, no errors, and GL comes back
if (!ONLY || ONLY.includes(++SEC)){
  const page = await page0(false, () => {
    window.__gl = [];
    const gc = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (t, o) { const c = gc.call(this, t, o); if (c && /webgl/.test(t) && !window.__gl.includes(c)) window.__gl.push(c); return c; };
  }, '?scene=quayfish');
  await page.evaluate(() => { Game.begin(true); });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(async () => {
    const n0 = window.__gl.length;
    const live = window.__gl.filter(g => !g.isContextLost());
    for (const g of live) { const x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }
    await new Promise(r => setTimeout(r, 1500));
    return { n0, lost: live.length, n1: window.__gl.length, pactive: Parallax.active, wok: Warp.ok };
  });
  ok('GL context loss: fresh contexts built, no errors', r.lost > 0 && r.n1 > r.n0 && !page.errs.length, JSON.stringify(r) + page.errs.join('|'));
  await page.close();
}

await browser.close();

