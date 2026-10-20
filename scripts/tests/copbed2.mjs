import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { localStorage.setItem('drowned-bell-content', 'full'); } catch (e) {} });
const t0 = Date.now();
await p.goto('http://localhost:8098/?scene=copbed'); await p.waitForSelector('#title.ready');
await p.evaluate(() => { Game.begin(true); return 0; });
let ok = false;
for (let i = 0; i < 60 && !ok; i++) {
  ok = await p.evaluate(() => { const a = Game.npc('npc_phone'); return Game.room && Game.room.id === 'bedroom' && a && a.visible && a.ch === 'cop_bed'; }).catch(() => false);
  await p.waitForTimeout(250);
}
await p.waitForTimeout(2500); await p.screenshot({ path: 'copbed2.png' });
console.log('in bed', ok, 'after', (Date.now() - t0) / 1000, 's', errs.slice(0, 4));
await b.close();
