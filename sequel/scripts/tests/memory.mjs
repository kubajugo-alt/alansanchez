// The memory budget (ported from Game I's scripts/tests/memory.mjs): with ?mem=<MB> (a phone's budget is 300 MB in
// Game II, js/engine.js MEM), go through every room (and the first five again, to fetch what was let go), and print the
// decoded MB held after each against the budget. PASS/FAIL: every room complete on entry (nothing it lists missing),
// held never above the budget, and no page errors.
//   node scripts/tests/memory.mjs [baseUrl] [budgetMB]   (serve sequel/ first: npx -y http-server sequel -p 8101 -c-1 -s)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8101/';
const budget = +(process.argv[3] || 300);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.addInitScript(() => { window.FAST = true; });
await page.goto(base + '?mem=' + budget, { waitUntil: 'load' }); await page.waitForSelector('#title.ready', { timeout: 300000 });
await page.evaluate(() => Game.begin(true));
await page.waitForFunction(() => Game.room && !Game.isBusy, null, { timeout: 300000, polling: 300 });
await page.waitForTimeout(8000);
console.log('after the opening', JSON.stringify(await page.evaluate(() => Game.loading())));
const r = await page.evaluate(async () => {
  const out = []; let missing = 0, maxHeld = 0, budget = 0;
  for (const id of Game.rooms().concat(Game.rooms().slice(0, 5))) {
    await Engine.goRoom(id, null, { noEnter: true, noSave: true });
    await new Promise(r => setTimeout(r, 400));
    const miss = Engine.roomAssets(id).filter(k => Engine.srcOf(k) && !Engine.IMG[k]);
    const L = Game.loading(); missing += miss.length; maxHeld = Math.max(maxHeld, L.held); budget = L.budget;
    out.push(id + ' held ' + L.held + 'MB/' + L.budget + ' imgs ' + L.images + (miss.length ? ' MISSING ' + miss.length + ' ' + miss.slice(0, 3).join(',') : ''));
  }
  return { out, missing, maxHeld, budget };
});
console.log(r.out.join('\n'));
const ok = (n, c, x) => console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : ''));
ok('every room complete on entry at ' + budget + ' MB', r.missing === 0, r.missing + ' missing');
ok('held stays within the budget', r.maxHeld <= r.budget, 'max ' + r.maxHeld + ' MB of ' + r.budget);
ok('no page errors', !errs.length, errs.join(' | '));
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 3000))]); process.exit(r.missing || r.maxHeld > r.budget || errs.length ? 1 : 0);
