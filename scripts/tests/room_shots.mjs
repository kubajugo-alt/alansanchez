// Screenshots of rooms at 1280x720 with the HUD hidden (flags set per room so chapter-gated details show):
//   OUT=<folder> node scripts/tests/room_shots.mjs [room ...]     (server on :8098; default: all 20 rooms)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const OUT = (process.env.OUT || 'room_shots') + '/'; (await import('fs')).mkdirSync(OUT, { recursive: true });
const rooms = process.argv.slice(2).length ? process.argv.slice(2) : ['shop','street','map','police','tavern','lavadouro','ferreira','convent','se_tower','antiques','cais','boat','cabin','convent_night','cistern','cold_open','se_museum','se_cloister','se_store','bedroom'];
const FLAGS = { ferreira: { ferreira_lit: true, ch: 2 }, convent_night: { ch: 5 }, cistern: { ch: 5 }, cais: { ch: 4 }, boat: { ch: 4 }, cabin: { ch: 4 }, convent: { ch: 3 }, se_tower: { ch: 3 }, antiques: { ch: 3 }, lavadouro: { ch: 2 } };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
for (const id of rooms) {
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('drowned-bell-effects','full'); } catch (e) {} });
  await p.goto('http://localhost:8098/');
  await p.waitForSelector('#title.ready', { timeout: 90000 });
  p.evaluate(() => Game.begin(true)).catch(() => {});
  await p.waitForTimeout(2500);
  const full = p.locator('button', { hasText: /^Full$/ }); if (await full.count()) { await full.first().click().catch(() => {}); }
  await p.waitForTimeout(3000);
  await p.evaluate(f => { Object.assign(Game.flags, f || {}); try { Game.skipLine(); } catch (e) {} try { Game.endStill && Game.endStill(); } catch (e) {} }, FLAGS[id] || null);
  p.evaluate(id => Game.goRoom(id, undefined, { instant: true, noEnter: true }), id).catch(e => errs.push(String(e)));
  await p.waitForTimeout(3500);
  await p.evaluate(() => { try { Game.endStill && Game.endStill(); } catch (e) {} document.querySelectorAll('.modal, #toast').forEach(e => e.style.display='none'); for (const s of ['#speech', '#narration', '#invbar', '#nb-btn', '#menu-btn', '#hover', '#labels', '#toast', '#clock', '#bag']) document.querySelectorAll(s).forEach(e => e.style.visibility = 'hidden'); });
  await p.waitForTimeout(500);
  const cv = await p.$('canvas');
  await (cv || p).screenshot({ path: OUT + id + '.png' });
  const room = await p.evaluate(() => Game.room && Game.room.id);
  console.log(id, '->', room, errs.slice(0, 3).join(' | '));
  await p.close();
}
await b.close();
