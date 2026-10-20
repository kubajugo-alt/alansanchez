// Smoke test: opens every ?scene= preview with FAST on, answers dialogs, reports page errors.
// usage: node smoke.mjs <baseUrl> [scene ...]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
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
  if (scene === 'listscenes') {}
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
  const r = await run(s);
  if (r.result !== 'done' || r.errs.length) bad++;
  console.log((r.result === 'done' && !r.errs.length ? 'PASS' : 'FAIL'), r.scene, r.result, r.errs.slice(0, 5).join(' | '));
}
console.log(bad ? bad + ' failing' : 'all passed');
await browser.close();
process.exit(bad ? 1 : 0);
