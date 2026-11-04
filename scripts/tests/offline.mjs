// Play offline, end to end (handoff entry 91; the same test works for Game II: sequel/scripts/tests/offline.mjs):
// the title has the Play offline button and the menu its entry; the whole pack downloads into the browser
// (Offline.download, progress to the end); then with the network cut the page reloads from the copy, the title
// shows, and preview scenes open with every request answered (no failed requests, no page errors). Remove empties it.
//   node scripts/tests/offline.mjs [baseUrl] [scene ...]      (serve the game first; default http://localhost:8098/)
// Prints PASS/FAIL lines; exits 1 on a failure.
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/';
const scenes = process.argv.slice(3).length ? process.argv.slice(3) : ['intro', 'shopjobs'];
let fails = 0;
const ok = (c, m, x) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + m + (x ? ' ' + JSON.stringify(x) : '')); };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
const errs = [], failed = [];
page.on('pageerror', e => errs.push(e.message));
page.on('requestfailed', r => { if (!/fonts\.g/.test(r.url())) failed.push(r.url() + ' ' + (r.failure() || {}).errorText); });

await page.goto(base, { waitUntil: 'load' });
await page.waitForTimeout(2500);
ok(await page.evaluate(() => !!document.querySelector('#btn-offline') && !!document.querySelector('#opt-offline')), 'the title and the menu have Play offline');

// the download, as the panel's button starts it
const t0 = Date.now();
await page.evaluate(() => { Offline.open(); Offline.download(); });
let st;
for (;;) {
  await page.waitForTimeout(3000);
  st = await page.evaluate(() => Offline.state());
  if (st.state && st.state.version && !st.job) break;
  if (Date.now() - t0 > 40 * 60e3) break;
}
ok(!!(st.state && st.state.version), `the copy downloaded in ${Math.round((Date.now() - t0) / 1000)} s`, st.state);
await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 }).catch(() => {});
await page.reload({ waitUntil: 'load' });   // (the worker controls the page from here)
await page.waitForTimeout(1500);

// no network: the title, then scenes, all from the copy
await ctx.setOffline(true);
errs.length = 0; failed.length = 0;
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(4000);
ok(await page.evaluate(() => !!document.querySelector('#title') && !!window.Game), 'offline: the title loads from the copy', { errors: errs, failed: failed.slice(0, 5) });
for (const s of scenes) {
  errs.length = 0; failed.length = 0;
  await page.goto(base + '?scene=' + s, { waitUntil: 'load' });
  await page.waitForTimeout(9000);
  const room = await page.evaluate(() => window.Engine && Engine.room && Engine.room.id);
  ok(!!room && !errs.length && !failed.length, `offline: ?scene=${s} opens (${room})`, { errors: errs.slice(0, 3), failed: failed.slice(0, 5) });
}

// Remove: back online, the copy and the worker gone
await ctx.setOffline(false);
await page.goto(base, { waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.evaluate(() => Offline.remove());
await page.waitForTimeout(2000);
const left = await page.evaluate(async () => ({ caches: (await caches.keys()).filter(k => /offline/.test(k)), workers: (await navigator.serviceWorker.getRegistrations()).length, state: Offline.state().state }));
ok(!left.caches.length && !left.workers && !left.state, 'Remove empties the copy and the worker', left);

await browser.close();
console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
