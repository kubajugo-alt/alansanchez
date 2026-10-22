// Streaming images (entry 51): time to the title and MB before it on an emulated 20 Mbit/s link, and every room
// complete on entry.  node scripts/tests/loading.mjs [baseUrl] [all|timing|rooms]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/';
const mode = process.argv[3] || 'all';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
async function timing(query, throttle) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (throttle) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 20e6 / 8, uploadThroughput: 5e6 / 8 });
  let bytes = 0; cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; });
  const t0 = Date.now();
  await page.goto(base + query, { waitUntil: 'commit' });
  await page.waitForSelector('#title.ready', { timeout: 900000 });
  const t = (Date.now() - t0) / 1000, mb = bytes / 1e6;
  // then: a new game reaches the shop
  await page.evaluate(() => { window.FAST = true; Game.begin(true); });
  const t1 = Date.now();
  await page.waitForFunction(() => Game.room && Game.room.id, null, { timeout: 900000 });
  const first = (Date.now() - t1) / 1000;
  await page.close();
  return `${query || '(default)'}${throttle ? ' @20Mbit/s' : ''}: title after ${t.toFixed(1)} s, ${mb.toFixed(1)} MB; first room ${first.toFixed(1)} s later`;
}
async function rooms() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(() => { window.FAST = true; });
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 300000 });
  await page.evaluate(() => Game.begin(true));
  await page.waitForFunction(() => Game.room && !Game.isBusy, null, { timeout: 300000 });
  const r = await page.evaluate(async () => {
    const out = [];
    for (const id of Game.rooms()) {
      try { await Engine.goRoom(id, null, { noEnter: true, noSave: true }); } catch (e) { out.push(id + ': threw ' + e.message); continue; }
      const missing = Engine.roomAssets(id).filter(k => Engine.srcOf(k) && !Engine.IMG[k]);
      if (missing.length) out.push(id + ': missing ' + missing.slice(0, 4).join(','));
    }
    return { problems: out, rooms: Game.rooms().length, loading: Game.loading() };
  });
  await page.close();
  return `rooms: ${r.rooms} entered, problems: ${r.problems.length ? r.problems.join(' | ') : 'none'}; errors: ${errs.length ? errs.join(' | ') : 'none'}; queue ${JSON.stringify(r.loading)}`;
}
if (mode === 'all' || mode === 'timing') {
  console.log(await timing('', true));
  if (process.argv[4] !== 'nobase') console.log(await timing('?preload=all', true));
  console.log(await timing('', false));
}
if (mode === 'all' || mode === 'rooms') console.log(await rooms());
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(0);
