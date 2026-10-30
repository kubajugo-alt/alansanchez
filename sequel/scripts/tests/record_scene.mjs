// Record a scene from the running game as video, with a log of when each line starts (for scripts/record_mix.py).
// 2026-10-30, the Tuesday reception. Adapt the flags/room and the act() list below to the scene you want.
//   node sequel/scripts/tests/record_scene.mjs <outDir>     (serve the game first; the URL is below)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const dir = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } } });
const p = await ctx.newPage(); const T0 = Date.now(); const log = []; await p.exposeFunction('logLine', id => log.push([(Date.now() - T0) / 1000, id]));
await p.addInitScript(() => { try { localStorage.setItem('shortest-night-content', 'full'); } catch (e) {} });
await p.goto('http://localhost:8097/'); await p.waitForSelector('#title.ready', { timeout: 60000 });
await p.evaluate(() => Game.begin(true)); await p.waitForTimeout(2500); await p.evaluate(() => { const s = Game.says; Game.says = (id, ...r) => { window.logLine(id); return s.call(Game, id, ...r); }; });
console.log('start', ((Date.now() - T0) / 1000).toFixed(1));
await p.evaluate(async () => { Object.assign(Game.flags, { ch: 1, met_vasco: true, blazer_got: true, blazer_on: true, called_tue: true, burnt: true, aloe_done: true }); S.give('blazer', true);
  document.querySelectorAll('.tip,.toast').forEach(e => e.remove()); await Game.goRoom('museum_hall', 'map'); });
const act = (t, v) => p.evaluate(([t, v]) => Game.act(t, v), [t, v]).catch(e => console.log('err', e.message));
await act('vasco', 'talk'); await act('x_museum_guest_linen', 'talk'); await act('baute', 'talk'); await act('montesdeoca', 'talk');
await act('vasco', 'talk'); await act('vasco', 'talk');
await act('Door to the steps', 'exit'); await act('carmen', 'talk'); await act('Back to the party', 'exit');
await p.waitForTimeout(2000);
console.log('end', ((Date.now() - T0) / 1000).toFixed(1));
require('fs').writeFileSync(dir + '/lines.json', JSON.stringify({ log, start: T0 })); await ctx.close(); await b.close();
