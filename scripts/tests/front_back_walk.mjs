// Walks towards and away from the camera (entry 55): Alan straight down and up in six rooms, Inês in the shop.
//   node scripts/tests/front_back_walk.mjs
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('http://localhost:8098/?scene=intro', { waitUntil: 'load' });
await page.waitForSelector('#title.ready');
await page.evaluate(() => { window.FAST = true; Game.begin(true); });
await page.waitForFunction(() => Game.room && !Game.isBusy && !Engine.cutscene, null, { timeout: 300000, polling: 500 });
await page.evaluate(() => { window.FAST = false; });
const r = await page.evaluate(async () => {
  const out = [];
  const inside = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const watch = async (a, x, y) => { const seen = new Set(), dirs = new Set(); const p = a.walkTo(x, y); const t0 = performance.now(); while (a.walking && performance.now() - t0 < 8000) { seen.add(a.cur); dirs.add(a.dir); await new Promise(r => setTimeout(r, 40)); } await p; return { dirs: [...dirs].join(''), frames: [...seen].filter(Boolean).filter(k => /front|back/.test(k)).join(',') }; };
  for (const id of ['shop', 'street', 'police', 'tavern', 'antiques', 'lavadouro']) {
    await Game.goRoom(id, null, { noEnter: true, noSave: true, instant: true });
    const R = Game.roomDef(id), ys = R.walk.map(p => p[1]), y0 = Math.min(...ys) + 8, y1 = Math.max(...ys) - 8;
    // a column inside the walkable floor at both ends
    let x = null; for (let xx = 200; xx < 1100; xx += 20) if (inside(xx, y0, R.walk) && inside(xx, y1, R.walk) && inside(xx, (y0 + y1) / 2, R.walk)) { x = xx; break; }
    if (x == null) { out.push([id, 'no vertical column']); continue; }
    const P = Game.player; P.x = x; P.y = y0; P.stop && P.stop();
    const down = await watch(P, x, y1), up = await watch(P, x, y0);
    out.push([id, 'x' + x, 'down: ' + down.dirs + ' ' + down.frames, '| up: ' + up.dirs + ' ' + up.frames]);
  }
  // Inês in the shop
  await Game.goRoom('shop', null, { noEnter: true, noSave: true, instant: true });
  const I = Game.npc('ines');
  if (I) { I.x = 700; I.y = 560; const d = await watch(I, 700, 700); out.push(['ines (shop)', 'down: ' + d.dirs + ' ' + d.frames]); } else out.push(['ines', 'not in the shop']);
  return out;
});
for (const x of r) console.log(x.join('  '));
console.log('errors:', errs.join(' | ') || 'none');
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 3000))]); process.exit(0);
