// A Ludo run seen in the game: its candidates approved in this browser only (never in approvals.json), Alan put in
// pose A, then B, at a slowed clock; photographs a strip of the change and lists every frame shown (real speed too).
//   OUT=<dir> SCENE=intro node scripts/tests/ludo_shot.mjs <ludo name prefix> '[["alan_side","alan_reach"], ...]'
// A pose of 'alan_side' means none (his standing frame). Serve the repo on :8098 first.
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const OUT = (process.env.OUT || '/tmp') + '/';
const prefix = process.argv[2], pairs = JSON.parse(process.argv[3] || '[]');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
const C = await (await fetch('http://localhost:8098/art/review/candidates.json')).json(), A = {};
for (const c of C.candidates) if (c.id.startsWith('alan_lu_' + prefix)) A[c.id] = { decision: 'approved' };
console.log('previewing', Object.keys(A).length, 'frames');
await page.addInitScript(a => { localStorage.setItem('review-approvals', a); localStorage.setItem('drowned-bell-tips', '{"off":true}'); }, JSON.stringify(A));
await page.goto('http://localhost:8098/?scene=' + (process.env.SCENE || 'bench'), { waitUntil: 'load' });
await page.waitForSelector('#title.ready');
await page.evaluate(() => { Game.begin(true); });
await page.waitForFunction(() => Game.room && Game.player && Game.player.visible, null, { timeout: 120000, polling: 300 });
await page.waitForTimeout(6000);
// an empty room, nothing scripted: the street (or ROOM), Alan in the middle of the floor
await page.evaluate(r => { Engine.skipFn && Engine.skipFn(); if (Engine.still) Game.endStill && Game.endStill(); return Game.goRoom(r, null, { instant: true, noEnter: true, pos: [640, 660, 'e'] }); }, process.env.ROOM || 'street').catch(e => console.log('goRoom', e.message));
await page.waitForTimeout(3000);
await page.evaluate(() => { for (const n of Game.npcs || []) n.visible = false; Engine.busy = false; });
await page.addStyleTag({ content: '#dialog,#narration,#speech,#tip{display:none !important}' });
await page.evaluate(() => { const p = Engine.player; p.walking = false; p.talking = false; p.dir = 'e'; window.__seq = []; let last = null;
  const tick = () => { if (p.cur !== last) { last = p.cur; window.__seq.push([Math.round((Engine.time - (window.__t0 || 0)) * 1000), p.cur]); } requestAnimationFrame(tick); }; tick(); });
const set = k => page.evaluate(k => { const p = Engine.player; p.talking = false; p.pose = k === 'alan_side' ? null : k; }, k);
// fixed 1/60 s steps (render.js HOLD / ADVANCE / STEP_DT): a photograph every STEP frames, and every frame shown, by game time
const STEP = +(process.env.STEP || 2);
for (const [a, b] of pairs) {
  await page.evaluate(() => { window.HOLD = false; window.STEP_DT = 0; }); await set(a); await page.waitForTimeout(1200);
  await set(b); await page.waitForTimeout(2500); await set(a); await page.waitForTimeout(2500); // once through first: the run's frames fetched
  const box = await page.evaluate(() => { const p = Engine.player, r = document.querySelector('canvas').getBoundingClientRect(), h = p.height();
    return { x: r.left + (p.x - h * 0.45) / 1280 * r.width, y: r.top + (p.y - h * 1.05) / 720 * r.height, width: h * 0.9 / 1280 * r.width, height: h * 1.1 / 720 * r.height }; });
  await page.evaluate(() => { window.STEP_DT = 1 / 60; window.HOLD = true; window.ADVANCE = 0; window.__seq = []; window.__t0 = Engine.time; });
  await set(b);
  const N = +(process.env.FRAMES || 48);
  for (let f = 0; f < N; f += STEP) {
    await page.evaluate(n => { window.ADVANCE = n; }, STEP);
    await page.waitForFunction(() => !(window.ADVANCE > 0), null, { polling: 10 });
    await page.screenshot({ path: `${OUT}${a}__${b}_${String(f / STEP).padStart(2, '0')}.png`, clip: box });
  }
  console.log(a, '->', b, JSON.stringify(await page.evaluate(() => window.__seq.map(([t, k], i, s) => [String(k).replace('alan_lu_', 'lu:'), i ? t - s[i - 1][0] : 0]))));
  await page.evaluate(() => { window.HOLD = false; window.STEP_DT = 0; });
}
console.log('errors:', errs.join(' | ') || 'none');
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(0);
