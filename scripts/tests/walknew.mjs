import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { window.ANIM_T = 1; });
await p.goto('http://localhost:8098/?scene=rigtest&walk=new'); await p.waitForSelector('#title.ready', { state: 'attached' });
await p.evaluate(() => { if (!document.querySelector('#title.hidden')) Game.begin(true); });
await p.waitForTimeout(4000);
const seq = [];
for (let i = 0; i < 90; i++) {
  const c = await p.evaluate(() => Engine.player && Engine.player.cur).catch(() => null);
  if (!seq.length || seq[seq.length - 1] !== c) { seq.push(c); if (seq.length <= 10) await p.screenshot({ path: `walk_${seq.length}.png`, clip: { x: 0, y: 200, width: 1280, height: 520 } }); }
  await p.waitForTimeout(60);
}
console.log(seq.join(' > '), errs.slice(0, 3));
await b.close();
