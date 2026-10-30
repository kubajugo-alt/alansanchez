// Screenshots of rooms in the running game, at a chapter, with page errors listed (the placed extras and cast).
// usage: node rooms_shot.mjs <baseUrl> <outDir> room:chapter [room:chapter ...]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [base, dir, ...rooms] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
await page.addInitScript(() => { try { localStorage.setItem('shortest-night-content', 'full'); } catch (e) {} window.FAST = true; });
await page.goto(base, { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 60000 });
await page.evaluate(() => Game.begin(true));
await page.waitForTimeout(3000);
for (const rc of rooms) {
  const [room, ch] = rc.split(':');
  await page.evaluate(async ([room, ch]) => { Game.flags.ch = +ch; await Game.goRoom(room, null, { instant: true, noEnter: true, noSave: true }); }, [room, ch]);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${dir}/${room}.png` });
}
console.log(errs.join('\n') || 'no errors');
await browser.close();
