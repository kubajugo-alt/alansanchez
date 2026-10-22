// Morph coverage: plays scenes (REAL=1 at real speed) recording every frame change to $FLOUT (jsonl);
// then node scripts/tests/morph_report.cjs <file.jsonl ...> sorts them (morphed / dissolved for want of data / by design).
//   REAL=1 FLOUT=/tmp/fl.jsonl node scripts/tests/morph_coverage.mjs http://localhost:8098/ intro celeste ...
// usage: node smoke.mjs <baseUrl> [scene ...]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
import { createRequire as cr2 } from 'module'; const nreq = cr2(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8097/';
let scenes = process.argv.slice(3);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
async function run(scene, fast = true) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errs.push('console: ' + m.text()); });
  page.on('requestfailed', r => { if (!/\.mp3/.test(r.url()) && !/ERR_ABORTED/.test(r.failure()?.errorText || '')) errs.push('requestfailed: ' + r.url() + ' ' + (r.failure()?.errorText || '')); });
  page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  if (fast) await page.addInitScript(() => { window.FAST = true; });
  await page.addInitScript(() => { window.__FL = []; const hook = () => { if (!window.Game || !Game.player) return setTimeout(hook, 200); const P = Object.getPrototypeOf(Game.player); if (P.__hooked) return; P.__hooked = 1; setTimeout(() => { for (const x of [Game.player].concat(Game.npcs || [])) if (x && Object.prototype.hasOwnProperty.call(x, 'cur')) { const v = x.cur; delete x.cur; x.__cur = v; } }, 0); Object.defineProperty(P, 'cur', { configurable: true, get() { return this.__cur; }, set(v) { if (v && v !== this.__cur && this.__cur) window.__FL.push([this.ch || this.id, this.__cur, v, this.prevFlip === this.curFlip ? 1 : 0, this.walking ? 1 : 0, this.talking ? 1 : 0, this.pose ? 1 : 0]); this.__cur = v; } }); }; hook(); });
  if (process.env.GEMINI) {
    const C = await (await fetch(base + 'art/review/candidates.json')).json(), A = {};
    for (const c of C.candidates) A[c.id] = { decision: 'approved' };
    await page.addInitScript(a => { localStorage.setItem('pair-transition', 'gemini'); localStorage.setItem('review-approvals', a); }, JSON.stringify(A));
  }
  await page.goto(base + (scene ? '?scene=' + scene : ''), { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 120000 });
  let result = 'ok';
  try {
    const done = page.evaluate(() => Game.begin(true).then(() => (async () => { let quiet = 0; for (let i = 0; i < 900 && quiet < 15; i++) { await new Promise(r => setTimeout(r, 200)); quiet = (Game.isBusy || document.querySelector('#dialog.open')) ? 0 : quiet + 1; } return quiet >= 15 ? 'done' : 'busy'; })()));
    const clicker = setInterval(() => page.evaluate(() => {
      const bs = [...document.querySelectorAll('#dialog.open button, .open > button')];
      if (!bs.length) return;
      window.__clicks = (window.__clicks || 0) + 1;
      (window.__clicks > 30 ? bs[Math.floor(Math.random() * bs.length)] : bs[0]).click();
    }).catch(() => {}), 150);
    result = await Promise.race([done, new Promise(r => setTimeout(() => r('timeout'), 200000))]);
    clearInterval(clicker);
    await page.waitForTimeout(500);
  } catch (e) { errs.push('eval: ' + e.message.split('\n')[0]); result = 'threw'; }
  try { const fl = await page.evaluate(() => window.__FL); nreq('fs').appendFileSync(process.env.FLOUT, fl.map(r => JSON.stringify([scene || 'newgame'].concat(r))).join('\n') + '\n'); } catch (e) {}
  await page.close();
  return { scene: scene || 'newgame', result, errs };
}
if (!scenes.length) {
  const page = await browser.newPage();
  await page.goto(base); await page.waitForSelector('#title.ready', { timeout: 120000 });
  await page.close();
  const src = (await (await fetch(base + 'js/story/main.js')).text());
  const m = src.match(/const PREVIEW = \{([\s\S]*?)\n  \};/)[1];
  scenes = [...m.matchAll(/^\s{4}(\w+): \{/gm)].map(x => x[1]).concat(['tr1', 'tr2', 'tr3', 'tr4', 'tr5', '']);
}
let bad = 0;
for (const s of scenes) {
  const r = await run(s, !process.env.REAL);
  if (r.result !== 'done' || r.errs.length) bad++;
  console.log((r.result === 'done' && !r.errs.length ? 'PASS' : 'FAIL'), r.scene, r.result, r.errs.slice(0, 5).join(' | '));
}
console.log(bad ? bad + ' failing' : 'all passed');
await browser.close();
process.exit(bad ? 1 : 0);
