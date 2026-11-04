// Touch (ported from Game I's scripts/tests/touch_press.mjs): in the hotel lobby (?scene=lobby), a long-press on a hotspot
// with a plain look line examines it, and the click a browser sends on lifting the finger doesn't skip that line; a
// second click then does skip it (the swallow is one click only); and a slower, two-second press doesn't skip it either. Alan is put at the hotspot first so the line starts
// at once (the lobby is wide: walking there would outlast the press).
//   node scripts/tests/touch_press.mjs [baseUrl]   (serve sequel/ first: npx -y http-server sequel -p 8101 -c-1 -s)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8101/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, hasTouch: true, isMobile: false });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto(base + '?scene=lobby', { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 120000 });
await page.evaluate(() => { Game.begin(true); });
await page.waitForFunction(() => Game.room && !Game.isBusy && !Engine.cutscene, null, { timeout: 300000, polling: 500 });
// a hotspot with a plain look line, its centre in page coordinates
const pt = await page.evaluate(() => {
  const h = Game.room.hotspots.find(h => (!h.when || h.when()) && typeof h.look === 'string' && !h.exit);
  const r = document.querySelector('canvas').getBoundingClientRect();
  const [x, y] = [h.rect[0] + h.rect[2] / 2, h.rect[1] + h.rect[3] / 2];
  if (h.at) { Game.player.x = h.at[0]; Game.player.y = h.at[1]; }   // (stood at it already, so the line starts at once)
  return { name: typeof h.name === 'function' ? h.name() : h.name, look: h.look, x: r.left + x / 1280 * r.width, y: r.top + y / 720 * r.height };
});
await page.evaluate(() => { window.__clicks = 0; document.addEventListener('click', () => window.__clicks++, true); });
const cdp = await ctx.newCDPSession(page);
const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
// a press held `hold` ms (at least; longer while the line can't be skipped yet: Engine.skipFn is set only once
// Sound.playVoice resolves, and before that any click is ignored, which would make the check pass for nothing), then lifted
async function press(hold) {
  await page.evaluate(() => { window.__clicks = 0; });
  await touch('touchStart', [{ x: pt.x, y: pt.y }]);
  await page.waitForTimeout(hold);
  const ready = await page.evaluate(async h => { const t0 = performance.now(); for (let i = 0; i < 80 && !(Engine.speaking && Engine.skipFn); i++) await new Promise(r => setTimeout(r, 50)); return { skippable: !!Engine.skipFn, held: h + Math.round(performance.now() - t0) }; }, hold);
  await touch('touchEnd', []);
  await page.waitForTimeout(250);
  // the click a browser sends on lifting the finger: Chromium sends one itself after a CDP touch; if it didn't, send it
  if (!(await page.evaluate(() => window.__clicks))) await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(400);
  return Object.assign(ready, await page.evaluate(() => ({ speaking: Engine.speaking && Engine.speaking.id, busy: Engine.busy, clicks: window.__clicks })));
}
await page.evaluate(() => { window.__ev = []; let last = null; setInterval(() => { const s = Engine.speaking && Engine.speaking.id; if (s !== last) { window.__ev.push(["spk", s, Math.round(performance.now())]); last = s; } }, 10); for (const t of ["click","touchstart","touchend"]) document.addEventListener(t, e => window.__ev.push([t, !!Engine.skipFn, Math.round(performance.now())]), true); });
const quiet = () => page.waitForFunction(() => !Game.isBusy && !Engine.speaking, null, { timeout: 60000, polling: 100 });
let bad = 0;
const r = await press(900);                  // past the 550 ms press: the look line starts
const p1 = r.skippable && !!r.speaking && !errs.length; if (!p1) bad++;
console.log((p1 ? 'PASS' : 'FAIL') + ' long-press look line survives the lift', JSON.stringify(pt), JSON.stringify(r), errs.join('|'));
// a second click now does skip it (the swallow is one click only)
await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(300);
const r2 = await page.evaluate(() => ({ speaking: Engine.speaking && Engine.speaking.id, speech: document.querySelector('#speech') && document.querySelector('#speech').style.display }));
const p2 = r2.speaking !== r.speaking; if (!p2) bad++;
console.log((p2 ? 'PASS' : 'FAIL') + ' a second click skips it', JSON.stringify(r2));
// a slower press: the finger held two seconds (the line long under way) still mustn't skip it on the lift
await quiet();
const r3 = await press(2000);
const p3 = r3.skippable && !!r3.speaking; if (!p3) bad++;
console.log((p3 ? 'PASS' : 'FAIL') + ' a 2 s press: the look line survives the lift', JSON.stringify(r3));
console.log(JSON.stringify(await page.evaluate(() => window.__ev)));
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(bad ? 1 : 0);
