// Smoke test (ported from Game I's scripts/tests/smoke.mjs): opens every ?scene= preview (PREVIEW in js/story/main.js)
// and a new game with window.FAST on, answers the dialogs (the first choice, then at random after 30 clicks), waits until
// the game is quiet, and reports page errors, console errors, failed requests and 4xx/5xx responses. A missing line id
// ("missing line" on the console) counts as an error. Voices (.mp3), depth maps and painted icons not made yet are not
// counted (as play.mjs). Game I's tr1-tr5 transitions and the GEMINI review approvals don't exist in Game II.
// usage: node smoke.mjs <baseUrl> [scene ...]     (serve sequel/ first: npx -y http-server sequel -p 8101 -c-1 -s)
//        with no scenes: every preview, then a new game (''). All of them take a while: pass a list to run them in parts.
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8101/';
let scenes = process.argv.slice(3);
const SKIP = /\.mp3|_depth\.png|art\/icons/;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
async function run(scene, fast = true) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errs.push('console: ' + m.text());
    else if (/missing line/.test(m.text())) errs.push('console: ' + m.text());
  });
  page.on('requestfailed', r => { if (!SKIP.test(r.url()) && !/ERR_ABORTED/.test(r.failure()?.errorText || '')) errs.push('requestfailed: ' + r.url() + ' ' + (r.failure()?.errorText || '')); });
  page.on('response', r => { if (r.status() >= 400 && !SKIP.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
  if (fast) await page.addInitScript(() => { window.FAST = true; });
  await page.goto(base + (scene ? '?scene=' + scene : ''), { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 120000 });
  let result = 'ok';
  try {
    // quiet for 3 s once the scene has returned: 'done'. A scene that hands the player control and waits for them (the
    // prologue's car waits to be played) never returns: quiet for 5 s with no cutscene while it waits counts as 'player'.
    const done = page.evaluate(() => (async () => {
      let fin = false, err = null; Game.begin(true).then(() => { fin = true; }, e => { err = e; fin = true; });
      let quiet = 0;
      for (let i = 0; i < 900; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (err) throw err;
        quiet = (Game.isBusy || document.querySelector('#dialog.open') || (!fin && Engine.cutscene)) ? 0 : quiet + 1;
        if (fin && quiet >= 15) return 'done';
        if (!fin && quiet >= 25 && Game.room) return 'player';
      }
      return 'busy';
    })());
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
  const where = await page.evaluate(() => Game.room ? Game.room.id + ' ch' + Game.flags.ch : '-').catch(() => '?');
  await page.close();
  return { scene: scene || 'newgame', result, where, errs };
}
if (!scenes.length) {
  const src = (await (await fetch(base + 'js/story/main.js')).text());
  const m = src.match(/const PREVIEW = \{([\s\S]*?)\n  \};/)[1];
  scenes = [...m.matchAll(/^\s{4}(\w+): \{/gm)].map(x => x[1]).concat(['']);
}
let bad = 0;
for (const s of scenes) {
  const r = await run(s);
  const pass = (r.result === 'done' || r.result === 'player') && !r.errs.length; if (!pass) bad++;
  console.log(pass ? 'PASS' : 'FAIL', r.scene, r.result, r.where, r.errs.slice(0, 5).join(' | '));
}
console.log(bad ? bad + ' failing' : 'all passed');
await browser.close();
process.exit(bad ? 1 : 0);
