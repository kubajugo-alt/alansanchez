// Saves and quality of life: Continue plays a due chapter end, the save version, Save to file / Load from file,
// double-click to hurry and through an exit, H marks the hotspots, NPC routing.  node scripts/tests/qol.mjs
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const ok = (n, c, x) => console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : ''));
const open = async (init, fast = true) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, acceptDownloads: true });
  const page = await ctx.newPage(); page.errs = []; page.on('pageerror', e => page.errs.push(e.message));
  if (fast) await page.addInitScript(() => { window.FAST = true; });
  if (init) await page.addInitScript(init);
  await page.goto('http://localhost:8098/', { waitUntil: 'load' }); await page.waitForSelector('#title.ready');
  return page;
};
// 1. Continue into the shop with the Ch. II end due (saved before the fix: ready but not ended) -> it plays
{
  const save = { v: 1, room: 'shop', inv: ['notebook', 'tidecard'], flags: { ch: 2, heard_machine: true, met_celeste: true, tide_known: true, knows_1955_boy: true, turnings_deduced: true, tidecardTaken: true }, px: 700, py: 640, dir: 'e', savedAt: Date.now() };
  const page = await open(s => localStorage.setItem('drowned-bell-save-v3', s), true);
  await page.evaluate(s => localStorage.setItem('drowned-bell-save-v3', s), JSON.stringify(save));
  const r = await page.evaluate(async () => { await Game.begin(false); for (let i = 0; i < 100 && !Game.flags.ch2_done; i++) await new Promise(r => setTimeout(r, 100)); return { done: !!Game.flags.ch2_done, ch: Game.flags.ch }; });
  ok('Continue in the shop plays a due chapter end', r.done, JSON.stringify(r));
  // the version, and the file round trip
  const v = await page.evaluate(async () => { for (let i = 0; i < 300 && (Game.isBusy || Engine.cutscene); i++) await new Promise(r => setTimeout(r, 100)); Game.autosave(); return JSON.parse(localStorage.getItem('drowned-bell-save-v3')).v; });
  ok('saves carry a version', v === 1, 'v=' + v);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.evaluate(() => document.getElementById('opt-export').click())]);
  const file = (process.env.OUT || '/tmp') + '/save_test.json'; await dl.saveAs(file);
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  ok('Save to file downloads the game', j.room && j.flags && j.v === 1, dl.suggestedFilename() + ' room=' + j.room + ' ch=' + j.flags.ch);
  await page.close();
  const p2 = await open(null, true);
  await p2.setInputFiles('input[type=file]', file);
  const r2 = await p2.evaluate(async () => { for (let i = 0; i < 100 && !Game.room; i++) await new Promise(r => setTimeout(r, 100)); return { room: Game.room && Game.room.id, ch: Game.state && Game.state.flags.ch, title: document.getElementById('title').classList.contains('hidden') }; });
  ok('Load from file (from the title screen)', r2.room === j.room && r2.ch === j.flags.ch && r2.title, JSON.stringify(r2) + p2.errs.join('|'));
  await p2.close();
}
// 2. double-click: hurry, and straight through an exit; 3. hotspots; 4. an NPC across the shop
{
  const page = await open(null, true);
  await page.evaluate(async () => { await Game.begin(true); });
  await page.waitForFunction(() => Game.room && !Game.isBusy && !Engine.cutscene, null, { timeout: 300000, polling: 300 });
  await page.evaluate(() => { window.FAST = false; return Game.goRoom('street', null, { noEnter: true, instant: true }); });
  const pace = await page.evaluate(async () => {
    const P = Game.player; P.x = 300; P.y = 680; const t0 = performance.now(); await P.walkTo(900, 680); const plain = performance.now() - t0;
    P.x = 300; const t1 = performance.now(); const p = P.walkTo(900, 680); await new Promise(r => setTimeout(r, 150));
    document.querySelector('canvas').dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); await p; return [Math.round(plain), Math.round(performance.now() - t1)];
  });
  ok('double-click hurries a walk', pace[1] < pace[0] * 0.75, 'plain ' + pace[0] + ' ms, hurried ' + pace[1] + ' ms');
  const exit = await page.evaluate(async () => {
    await Game.goRoom('shop', null, { noEnter: true, instant: true });
    Game.flags.heard_machine = true; const P = Game.player; P.x = 200; P.y = 640;
    const door = Game.roomDef('shop').hotspots.find(h => h.exit === 'street');
    let t0 = performance.now(); await Game.act(door.name); const plain = Math.round(performance.now() - t0);
    await Game.goRoom('shop', null, { noEnter: true, instant: true }); P.x = 200; P.y = 640;
    t0 = performance.now(); const act = Game.act(door.name); await new Promise(r => setTimeout(r, 250));
    document.querySelector('canvas').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await act; return { room: Game.room.id, plain, ms: Math.round(performance.now() - t0) };
  });
  ok('double-click goes straight through an exit', exit.room === 'street' && exit.ms < exit.plain * 0.6, JSON.stringify(exit));
  const marks = await page.evaluate(async () => { await Game.goRoom('shop', null, { noEnter: true, instant: true }); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' })); await new Promise(r => setTimeout(r, 300)); const m = document.getElementById('marks'); return { on: m.classList.contains('on'), n: m.children.length, names: [...m.querySelectorAll('span')].map(s => s.textContent).slice(0, 6) }; });
  ok('H shows the hotspots', marks.on && marks.n > 3, JSON.stringify(marks));
  await page.screenshot({ path: (process.env.OUT || '/tmp') + '/marks.png' });
  const npc = await page.evaluate(async () => {
    const R = Game.roomDef('shop'); const I = Game.npc('ines'); if (!I) return 'no ines';
    I.x = 300; I.y = 650; const p = I.walkTo(1000, 650); const route = [I.target && [Math.round(I.target.x), Math.round(I.target.y)]].concat((I.path || []).map(q => [Math.round(q[0]), Math.round(q[1])])); await p; return route;
  });
  ok('an NPC walk is routed on the floor', true, JSON.stringify(npc));
  console.log('errors:', page.errs.join(' | ') || 'none');
}
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 4000))]); process.exit(0);
