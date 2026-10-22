// Photographs Lacerda's pose changes at a slowed clock with the mesh warp on, for checking a morph by eye.
//   OUT=<dir> node scripts/tests/morph_shot.mjs '[["lacerda","lacerda_idle3"]]'
// Lacerda in his shop: force a pose change and photograph it at slow clock, with the mesh warp on
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const OUT = (process.env.OUT || '/tmp') + '/';
const pairs = JSON.parse(process.argv[2] || '[["lacerda","lacerda_idle3"]]');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.addInitScript(() => { window.WARP = true; });
await page.goto('http://localhost:8098/?scene=lacthreat', { waitUntil: 'load' });
await page.waitForSelector('#title.ready');
await page.evaluate(() => { Game.begin(true); });
await page.waitForFunction(() => Game.room && Game.room.id === 'antiques' && Game.npc('lacerda'), null, { timeout: 120000, polling: 300 });
await page.waitForTimeout(3000);
await page.addStyleTag({ content: '#dialog,#narration,#speech{display:none !important}' });
await page.waitForFunction(() => !Engine.speaking, null, { timeout: 60000, polling: 200 }).catch(() => {});
const info = await page.evaluate(() => ({ warp: Warp.ok, room: Game.room.id }));
console.log(JSON.stringify(info), await page.evaluate(() => { const l = Game.npc('lacerda'); return [l.x, l.y, l.h, typeof l.height === 'function' ? l.height() : 'nofn']; }));
for (const [a, b] of pairs) {
  await page.evaluate(([a]) => { window.TIME_SCALE = 1; const l = Game.npc('lacerda'); l.talking = false; l.talkPose = false; l.pose = a; }, [a, b]);
  await page.waitForTimeout(1500);
  const box = await page.evaluate(() => { const l = Game.npc('lacerda'); const r = document.querySelector('canvas').getBoundingClientRect(); const h = (typeof l.height === 'function' && l.height()) || 420; return { x: r.left + (l.x - 190) / 1280 * r.width, y: r.top + Math.max(0, l.y - 470) / 720 * r.height, w: 380 / 1280 * r.width, h: 470 / 720 * r.height }; });
  console.error('box', JSON.stringify(box));
  await page.evaluate(([a, b]) => { window.TIME_SCALE = 0.08; Game.npc('lacerda').pose = b; }, [a, b]);
  for (let i = 0; i <= 6; i++) { await page.screenshot({ path: `${OUT}${a}__${b}_${i}.png`, clip: { x: box.x, y: box.y, width: box.w, height: box.h } }); await page.waitForTimeout(700); }
  const st = await page.evaluate(() => { const l = Game.npc('lacerda'); return { cur: l.cur, prev: l.prev, fadeDur: l.fadeDur, sim: l.fadeSim }; });
  console.log(a, '->', b, JSON.stringify(st));
}
await page.evaluate(() => { window.TIME_SCALE = 1; });
console.log('errors:', errs.join(' | ') || 'none');
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(0);
