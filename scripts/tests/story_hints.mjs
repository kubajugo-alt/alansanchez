// The 'already done' replies take turns, Chapter V gives the short one; the Chapter V notebook hints per step
// (entry 53).  node scripts/tests/story_hints.mjs
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.addInitScript(() => { window.FAST = true; });
await page.goto('http://localhost:8098/', { waitUntil: 'load' });
await page.waitForSelector('#title.ready');
await page.evaluate(() => Game.begin(true));
await page.waitForFunction(() => Game.room && !Game.isBusy, null, { timeout: 300000, polling: 500 });
const r = await page.evaluate(async () => {
  const heard = []; const pv = Sound.playVoice; Sound.playVoice = (id, ...a) => { heard.push(id); return pv(id, ...a); };
  const f = Game.flags, out = {};
  // the done lines take turns; in Ch. V the short one
  f.ch = 2; for (let i = 0; i < 4; i++) await S.done();
  f.ch = 5; await S.done();
  out.done = heard.splice(0);
  // a real "already done" site: the shop phone after ringing Rui (Ch. V)
  f.rui_called = true; await S.usePhone(); out.phone = heard.splice(0);
  // the Ch. V hints, step by step
  const steps = [];
  for (const k of [{}, { ledger_found: true }, { heard_msg3: true }, { rui_called: true, vasco_thursday: true }, { vasco_called: true }, { night_entered: true }, { confessed: true }, { finaleIntro: true }]) {
    Object.assign(f, { ch: 5, ledger_found: false, heard_msg3: false, rui_called: false, vasco_called: false, night_entered: false, confessed: false, finaleIntro: false }, ...steps, k); steps.push(k);
    if (k.vasco_thursday && !Game.has('vasco_card')) Game.giveItem('vasco_card', true);
    out[Object.keys(k)[0] || 'start'] = S.ch5Hint();
  }
  // reading the notebook in Ch. V speaks the hint; before Ch. V it doesn't
  Object.assign(f, { finaleIntro: false, confessed: false });
  const read = async () => { const p = Engine.readItem('notebook'); await new Promise(r => setTimeout(r, 300)); document.querySelector('#closeup .x') && document.querySelector('#closeup .x').click(); await p; };
  await read(); out.read5 = heard.splice(0);
  f.ch = 3; await read(); out.read3 = heard.splice(0);
  return out;
});
console.log(JSON.stringify(r, null, 1)); console.log('errors:', errs.join(' | ') || 'none');
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(0);
