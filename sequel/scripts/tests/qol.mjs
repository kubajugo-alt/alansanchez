// Saves and quality of life (ported from Game I's scripts/tests/qol.mjs): 1. Continue restores the save (room, items,
// flags, where Alan stands) and a save made while playing Vasco comes back as Vasco (S.restorePlayer); saves carry a
// version; Save to file downloads the game (shortest-night-*.json) and Load from file reads it back from the title
// screen; 2. double-click hurries a walk (along Las Canteras) and goes straight through an exit (the hotel lobby's door
// out to Las Canteras); 3. H shows the hotspots; 4. an NPC's walk across the lobby (Nieves) is routed on the floor
// (printed, as in Game I).
// Dropped from Game I: "Continue in the shop plays a due chapter end". Game II has no room resume hooks and no chapter
// end that can be saved as due: Wednesday ends on entering room 404 (wed.js), which happens before any save there.
//   node scripts/tests/qol.mjs [baseUrl]   (serve sequel/ first: npx -y http-server sequel -p 8101 -c-1 -s; OUT=<dir> for files)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const base = process.argv[2] || 'http://localhost:8101/';
const OUT = process.env.OUT || '/tmp';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
let bad = 0;
const ok = (n, c, x) => { if (!c) bad++; console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); };
const open = async (init, fast = true) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, acceptDownloads: true });
  const page = await ctx.newPage(); page.errs = []; page.on('pageerror', e => page.errs.push(e.message));
  if (fast) await page.addInitScript(() => { window.FAST = true; });
  if (init) await page.addInitScript(init);
  await page.goto(base, { waitUntil: 'load' }); await page.waitForSelector('#title.ready', { timeout: 120000 });
  return page;
};
const KEY = 'shortest-night-save-v1';
// 1. Continue; as Vasco; the version, and the file round trip
{
  const save = { v: 1, room: 'hotel_lobby', inv: ['notebook', 'coins', 'letter'], flags: { ch: 2, tue_done: true, coins: 2, saw_helmet: true, fermin_letter: true }, px: 700, py: 660, dir: 'w', savedAt: Date.now() };
  const page = await open(null, true);
  await page.evaluate(([k, s]) => localStorage.setItem(k, s), [KEY, JSON.stringify(save)]);
  const r = await page.evaluate(async () => { await Game.begin(false); return { room: Game.room && Game.room.id, inv: Game.state.inv.join(','), ch: Game.flags.ch, x: Math.round(Game.player.x), dir: Game.player.dir, as: Game.player.speaker || 'alan' }; });
  ok('Continue restores the room, items, day and place', r.room === 'hotel_lobby' && r.inv === 'notebook,coins,letter' && r.ch === 2 && r.x === 700 && r.dir === 'w' && r.as === 'alan' && !page.errs.length, JSON.stringify(r) + page.errs.join('|'));
  const v = await page.evaluate(async k => { for (let i = 0; i < 300 && (Game.isBusy || Engine.cutscene); i++) await new Promise(r => setTimeout(r, 100)); Game.autosave(); return JSON.parse(localStorage.getItem(k)).v; }, KEY);
  ok('saves carry a version', v === 1, 'v=' + v);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.evaluate(() => document.getElementById('opt-export').click())]);
  const file = OUT + '/save_test_sn.json'; await dl.saveAs(file);
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  ok('Save to file downloads the game', j.room && j.flags && j.v === 1 && /^shortest-night-.*\.json$/.test(dl.suggestedFilename()), dl.suggestedFilename() + ' room=' + j.room + ' ch=' + j.flags.ch);
  await page.close();
  const p2 = await open(null, true);
  await p2.setInputFiles('input[type=file]', file);
  const r2 = await p2.evaluate(async () => { for (let i = 0; i < 100 && !Game.room; i++) await new Promise(r => setTimeout(r, 100)); return { room: Game.room && Game.room.id, ch: Game.state && Game.state.flags.ch, title: document.getElementById('title').classList.contains('hidden') }; });
  ok('Load from file (from the title screen)', r2.room === j.room && r2.ch === j.flags.ch && r2.title, JSON.stringify(r2) + p2.errs.join('|'));
  await p2.close();
  // a save from Vasco's chapter comes back as Vasco
  const vs = { v: 1, room: 'camp', inv: ['vnotebook', 'torch'], flags: { ch: 5, isleta_flood: true, as_vasco: true }, px: 400, py: 660, dir: 'e', savedAt: Date.now() };
  const p3 = await open(null, true);
  await p3.evaluate(([k, s]) => localStorage.setItem(k, s), [KEY, JSON.stringify(vs)]);
  const r3 = await p3.evaluate(async () => { await Game.begin(false); return { room: Game.room && Game.room.id, as: Game.player.speaker || 'alan', ch: Game.player.ch }; });
  ok('a save as Vasco comes back as Vasco', r3.room === 'camp' && r3.as === 'vasco' && r3.ch === 'vasco' && !p3.errs.length, JSON.stringify(r3) + p3.errs.join('|'));
  await p3.close();
}
// 2. double-click: hurry, and straight through an exit; 3. hotspots; 4. an NPC across the lobby
{
  const page = await open(null, true);
  await page.evaluate(async () => { await Game.begin(true); });
  await page.waitForFunction(() => Game.room && !Game.isBusy && !Engine.cutscene, null, { timeout: 300000, polling: 300 });
  await page.evaluate(() => { Object.assign(Game.flags, { met_vasco: true, narr_canteras: true }); window.FAST = false; return Game.goRoom('canteras', null, { noEnter: true, instant: true }); });
  const pace = await page.evaluate(async () => {
    const P = Game.player; P.x = 300; P.y = 680; const t0 = performance.now(); await P.walkTo(900, 680); const plain = performance.now() - t0;
    P.x = 300; const t1 = performance.now(); const p = P.walkTo(900, 680); await new Promise(r => setTimeout(r, 150));
    document.querySelector('canvas').dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); await p; return [Math.round(plain), Math.round(performance.now() - t1)];
  });
  ok('double-click hurries a walk', pace[1] < pace[0] * 0.75, 'plain ' + pace[0] + ' ms, hurried ' + pace[1] + ' ms');
  const exit = await page.evaluate(async () => {
    await Game.goRoom('hotel_lobby', null, { noEnter: true, instant: true });
    const P = Game.player; P.x = 1000; P.y = 660;
    const door = Game.roomDef('hotel_lobby').hotspots.find(h => h.exit === 'canteras');
    let t0 = performance.now(); await Game.act(door.name); const plain = Math.round(performance.now() - t0); const room1 = Game.room.id;
    await Game.goRoom('hotel_lobby', null, { noEnter: true, instant: true }); P.x = 1000; P.y = 660;
    t0 = performance.now(); const act = Game.act(door.name); await new Promise(r => setTimeout(r, 250));
    document.querySelector('canvas').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await act; return { room1, room: Game.room.id, plain, ms: Math.round(performance.now() - t0) };
  });
  ok('double-click goes straight through an exit', exit.room1 === 'canteras' && exit.room === 'canteras' && exit.ms < exit.plain * 0.6, JSON.stringify(exit));
  const marks = await page.evaluate(async () => { await Game.goRoom('hotel_lobby', null, { noEnter: true, instant: true }); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' })); await new Promise(r => setTimeout(r, 300)); const m = document.getElementById('marks'); return { on: m.classList.contains('on'), n: m.children.length, names: [...m.querySelectorAll('span')].map(s => s.textContent).slice(0, 6) }; });
  ok('H shows the hotspots', marks.on && marks.n > 3, JSON.stringify(marks));
  await page.screenshot({ path: OUT + '/marks_sn.png' });
  const npc = await page.evaluate(async () => {
    const N = Game.npc('nieves'); if (!N) return 'no nieves';
    N.x = 300; N.y = 650; const p = N.walkTo(1000, 650); const route = [N.target && [Math.round(N.target.x), Math.round(N.target.y)]].concat((N.path || []).map(q => [Math.round(q[0]), Math.round(q[1])])); await p; return { route, end: [Math.round(N.x), Math.round(N.y)] };
  });
  ok('an NPC walk is routed on the floor (printed only)', true, JSON.stringify(npc));
  ok('no page errors', !page.errs.length, page.errs.join(' | '));
}
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 4000))]); process.exit(bad ? 1 : 0);
