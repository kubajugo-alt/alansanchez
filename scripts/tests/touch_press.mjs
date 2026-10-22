// Touch (entry 50): a long-press examines and the click on lifting the finger doesn't skip the line.
//   node scripts/tests/touch_press.mjs
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, hasTouch: true, isMobile: false });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('http://localhost:8098/?scene=quayfish', { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 120000 });
await page.evaluate(() => { Game.begin(true); });
await page.waitForFunction(() => Game.room && !Game.isBusy && !Engine.cutscene, null, { timeout: 300000, polling: 500 });
// a hotspot with a plain look line, its centre in page coordinates
const pt = await page.evaluate(() => {
  const h = Game.room.hotspots.find(h => (!h.when || h.when()) && typeof h.look === 'string' && !h.exit);
  const r = document.querySelector('canvas').getBoundingClientRect();
  const [x, y] = [h.rect[0] + h.rect[2] / 2, h.rect[1] + h.rect[3] / 2];
  return { name: h.name, x: r.left + x / 1280 * r.width, y: r.top + y / 720 * r.height };
});
const cdp = await ctx.newCDPSession(page);
const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
await touch('touchStart', [{ x: pt.x, y: pt.y }]);
await page.waitForTimeout(900);              // past the 550 ms press: the look line starts
await touch('touchEnd', []);
await page.mouse.click(pt.x, pt.y);          // the click a browser sends on lifting the finger
await page.waitForTimeout(400);
const r = await page.evaluate(() => ({ speaking: Engine.speaking && Engine.speaking.id, busy: Engine.busy }));
console.log((r.speaking ? 'PASS' : 'FAIL') + ' long-press look line survives the lift', JSON.stringify(pt), JSON.stringify(r), errs.join('|'));
// a second click now does skip it (the swallow is one click only)
await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(300);
const r2 = await page.evaluate(() => ({ text: document.querySelector('#speech') && document.querySelector('#speech').style.display, narr: document.querySelector('#narr') && document.querySelector('#narr').style.display }));
console.log('after a second click:', JSON.stringify(r2));
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(0);
