// Plays The Forgotten Rhythm from the prologue to the credits through each part's S.SOLVE (js/story/main.js), with
// window.FAST on and dialogue choices picked by queue (S.choices) or the last button. Prints how far it got and every
// page error.   usage: node game3/scripts/tests/run.mjs [baseUrl] [from] [to]   (serve game3/ first)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8097/';
const from = +(process.argv[3] || 0), to = +(process.argv[4] || 9);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('console', m => { const t = m.text(); if ((m.type() === 'error' && !/Failed to load resource/.test(t)) || /missing line/.test(t)) errs.push('console: ' + t); });
page.on('response', r => { if (r.status() >= 400 && !/audio\/|_depth\.png|favicon/.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
await page.addInitScript(() => {
  window.FAST = true; window.__choices = []; window.__picked = [];
  setInterval(() => {
    const d = document.querySelector('#dialog.open'); if (!d) return;
    const bs = [...d.querySelectorAll('button')]; if (!bs.length) return;
    let b = null;
    if (window.__choices.length) { b = bs.find(x => x.textContent.includes(window.__choices[0])); if (b) window.__choices.shift(); }
    if (!b) b = bs[bs.length - 1];
    window.__picked.push(b.textContent); b.click();
  }, 40);
});
await page.goto(base + '?scene=start8', { waitUntil: 'load' }); await page.waitForFunction(() => window.S && S.PREVIEW.start8); await page.evaluate(() => Object.assign(S.PREVIEW.start8.flags, { batista_committed: false, tobias_saved: false, bearing_taken: false, bill_paid: false, veve_accuracy: 1, cards_collected: 3 }));
await page.waitForSelector('#title.ready', { timeout: 90000 });
const state = () => page.evaluate(() => ({ room: Game.room && Game.room.id, ch: Game.flags.ch, as: Game.player.speaker || 'alan', inv: Game.state.inv.join(','), picked: window.__picked.slice(-4) }));
let result = 'unfinished';
try {
  page.evaluate(() => Game.begin(true));
  await page.waitForFunction(() => Game.room && !Engine.busy && !Engine.cutscene, null, { timeout: 60000, polling: 100 });
  for (let c = from; c <= to; c++) {
    const t0 = Date.now();
    try { await page.evaluate(c => TEST.run(c, c), c); }
    catch (e) { throw new Error(`part ${c}: ${e.message.split('\n')[0]} in ${JSON.stringify(await state())}`); }
    const st = await state();
    console.log(`part ${c} done in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ch ${st.ch}, ${st.room}, as ${st.as}`);
  }
  const end = await page.evaluate(() => !document.querySelector('#ending').classList.contains('hidden'));
  result = to < 9 ? `parts ${from}-${to} played` : end ? 'played to the credits' : 'finished, but the credits are not showing';
} catch (e) { result = 'FAILED: ' + e.message; }
console.log(result);
if (errs.length) { console.log(errs.length + ' errors:'); [...new Set(errs)].slice(0, 40).forEach(e => console.log('  ' + e)); }
await browser.close();
process.exit(/FAILED|not showing/.test(result) || errs.length ? 1 : 0);
