// The memory budget: held MB through every room at a small budget, every room complete on entry.
//   node scripts/tests/memory.mjs [budgetMB]   (mem2-style pacing: edit the room list and pause)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.addInitScript(() => { window.FAST = true; });
await page.goto('http://localhost:8098/?mem=' + (process.argv[2] || 150), { waitUntil: 'load' }); await page.waitForSelector('#title.ready');
await page.evaluate(() => Game.begin(true));
await page.waitForFunction(() => Game.room && !Game.isBusy, null, { timeout: 300000, polling: 300 });
await page.waitForTimeout(8000);
console.log('after the opening', JSON.stringify(await page.evaluate(() => Game.loading())));
const r = await page.evaluate(async () => {
  const out = [];
  for (const id of Game.rooms().concat(Game.rooms().slice(0, 5))) {
    await Engine.goRoom(id, null, { noEnter: true, noSave: true });
    await new Promise(r => setTimeout(r, 400));
    const missing = Engine.roomAssets(id).filter(k => Engine.srcOf(k) && !Engine.IMG[k]);
    const L = Game.loading(); out.push(id + ' held ' + L.held + 'MB/' + L.budget + ' imgs ' + L.images + (missing.length ? ' MISSING ' + missing.length : ''));
  }
  return out;
});
console.log(r.join('\n')); console.log('errors:', errs.join(' | ') || 'none');
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 3000))]); process.exit(0);
