// Accessibility: text size, motion, the volume sliders, keyboard play (Tab, L), Escape in a close-up.
//   node scripts/tests/a11y.mjs
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const ok = (n, c, x) => console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : ''));
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.addInitScript(() => { window.FAST = true; });
await page.goto('http://localhost:8098/', { waitUntil: 'load' }); await page.waitForSelector('#title.ready');
await page.evaluate(() => Game.begin(true));
await page.waitForFunction(() => Game.room && !Game.isBusy && !Engine.cutscene, null, { timeout: 300000, polling: 300 });
const s = await page.evaluate(() => {
  const ids = ['opt-text', 'opt-motion', 'opt-music-vol', 'opt-voice-vol', 'opt-sfx-vol', 'opt-export', 'opt-import'].map(i => !!document.getElementById(i));
  const t0 = document.getElementById('opt-text').textContent; document.getElementById('opt-text').click();
  const cap = getComputedStyle(document.documentElement).getPropertyValue('--cap').trim(), t1 = document.getElementById('opt-text').textContent;
  const m0 = window.CALM; document.getElementById('opt-motion').click(); const m1 = window.CALM;
  const vr = document.querySelector('#opt-voice-vol input'); vr.value = 40; vr.dispatchEvent(new Event('input'));
  return { ids, t0, t1, cap, m0, m1, vkey: localStorage.getItem('drowned-bell-music-volume-voice-level'), mkey: localStorage.getItem('drowned-bell-motion') };
});
ok('settings: text size, motion, three sliders, file buttons', s.ids.every(Boolean) && s.t0 === 'Text: Medium' && s.t1 === 'Text: Large' && s.cap === '1.25' && s.m0 !== s.m1 && s.vkey === '0.4', JSON.stringify(s));
await page.evaluate(() => { document.getElementById('opt-text').click(); document.getElementById('opt-text').click(); document.getElementById('opt-text').click(); document.getElementById('opt-motion').click(); });
// keyboard: Tab through the shop, then Enter / L
await page.evaluate(() => Game.goRoom('shop', null, { noEnter: true, instant: true }));
await page.mouse.move(5, 5);
const names = [];
for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); names.push(await page.evaluate(() => document.getElementById('hover').style.display !== 'none' ? document.getElementById('hover').textContent : '')); }
ok('Tab steps through the room', names.filter(Boolean).length === 4 && new Set(names).size === 4, JSON.stringify(names));
const said = await page.evaluate(async () => { const heard = []; const pv = Sound.playVoice; Sound.playVoice = (id, ...a) => { heard.push(id); return pv(id, ...a); }; window.__heard = heard; return true; });
await page.keyboard.press('l');
await page.waitForTimeout(1500);
const h = await page.evaluate(() => window.__heard.slice());
ok('L looks at the focused thing', h.length > 0, JSON.stringify(h));
// a close-up: Escape closes it
const cu = await page.evaluate(async () => { window.FAST = false; for (let i = 0; i < 100 && Game.isBusy; i++) await new Promise(r => setTimeout(r, 100)); const p = Engine.readItem('notebook'); await new Promise(r => setTimeout(r, 300)); const open = !document.getElementById('closeup').classList.contains('hidden'); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await new Promise(r => setTimeout(r, 300)); return { open, closed: document.getElementById('closeup').classList.contains('hidden'), toast: document.getElementById('toast').textContent, inv: Game.state.inv, busy: Engine.busy, cut: Engine.cutscene, dlg: !!Engine.dialogResolve }; });
ok('Escape closes a close-up', cu.open && cu.closed, JSON.stringify(cu));
console.log('errors:', errs.join(' | ') || 'none');
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 3000))]); process.exit(0);
