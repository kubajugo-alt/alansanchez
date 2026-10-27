// Plays The Shortest Night from the prologue to the end credits, as a player would (through hotspots, people and
// dialogue choices, with window.FAST on), and prints where it got to. Also takes the airport's bad ending and one wrong
// disc in the finale on the way.
// usage: node play.mjs <baseUrl>     (serve sequel/ first: npx -y http-server -p 8099 -c-1 -s sequel)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8099/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); if (/missing line/.test(m.text())) errs.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && !/\.mp3|_depth\.png|art\/icons/.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
await page.addInitScript(() => {
  window.FAST = true;
  // dialogue: pick the queued choices in order (by a piece of their text), then the last button (goodbye)
  window.__choices = []; window.__picked = [];
  setInterval(() => {
    const d = document.querySelector('#dialog.open'); if (!d) return;
    const bs = [...d.querySelectorAll('button')]; if (!bs.length) return;
    let b = null;
    if (window.__choices.length) { b = bs.find(x => x.textContent.includes(window.__choices[0])); if (b) window.__choices.shift(); }
    if (!b) b = bs[bs.length - 1];
    window.__picked.push(b.textContent); b.click();
  }, 60);
});
await page.goto(base, { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 60000 });
const quiet = () => page.waitForFunction(() => !Game.isBusy && !document.querySelector('#dialog.open') && !(window.Engine && Engine.cutscene), null, { timeout: 60000, polling: 100 });
const state = () => page.evaluate(() => ({ room: Game.room && Game.room.id, ch: Game.flags.ch, inv: Game.state.inv.join(','), as: Game.player.speaker || 'alan' }));
let step = 0;
async function act(target, verb, item, choices) {
  step++;
  try {
    await quiet();
    await page.evaluate(([t, v, i, c]) => { window.__choices = c || []; return Game.act(t, v, i); }, [target, verb || null, item || null, choices || []]);
    await quiet();
  } catch (e) { throw new Error(`step ${step} ${target}/${verb || ''}/${item || ''}: ${e.message.split('\n')[0]} in ${JSON.stringify(await state())}`); }
}
const go = async (room, entry) => { await quiet(); await page.evaluate(([r, e]) => Game.goRoom(r, e), [room, entry || 'map']); await quiet(); };
const expect = async (what, fn) => { const ok = await page.evaluate(fn); if (!ok) throw new Error(`expected ${what} after step ${step}, in ${JSON.stringify(await state())}`); console.log('  ok  ' + what); };
let result = 'unfinished';
try {
  page.evaluate(() => Game.begin(true)); // (not awaited: the prologue waits for the player)
  await page.waitForFunction(() => Game.room && Game.room.id === 'elena_car', null, { timeout: 30000 });
  // ---- the prologue
  await act('The radio', 'use'); await act('Notebook on the passenger seat', 'look'); await act('The rear-view mirror', 'look');
  await act('The window crank', 'use'); await act('The air', 'look');
  await page.waitForFunction(() => Game.room && Game.room.id === 'gando' && Game.flags.ch === 1, null, { timeout: 30000 });
  await expect('Tuesday at Gando', () => Game.room.id === 'gando');
  // ---- Tuesday
  await act('vasco', 'talk');
  await act('Lost and found box', 'look'); await act('gail', 'talk');
  await act('nieves', 'talk', null, ['lost a blazer', 'A cigar band']);
  await expect('the blazer', () => Game.has('blazer'));
  await go('museum_hall'); await act('baute', 'talk'); await act('carmen', 'talk'); await act('Out to Vegueta', 'exit');
  await expect('the mist', () => Game.flags.mist_seen && Game.room.id === 'canteras');
  await act('chano', 'talk', null, ['five-thousand']);
  await expect('coins', () => Game.has('coins'));
  await act('Phone box', 'use');
  await expect('the first call', () => Game.flags.called_tue);
  await act('Hotel Cristina', 'exit'); await act('Lifts', 'exit');
  await expect('Wednesday', () => Game.flags.ch === 2);
  // ---- Wednesday
  await go('isleta'); await act('pino', 'talk');
  await go('santa_ana'); await act('fermin', 'talk', null, ['wind it', 'little brass']);
  await act('Cathedral door', 'exit'); await act('Clock winding drum', 'use'); await act('The north bell', 'look'); await act('The north bell', null, 'notebook');
  await act('fermin', 'talk');
  await expect('the letter', () => Game.has('letter') && Game.has('inscription'));
  await go('hotel_lobby'); await act('nieves', null, 'inscription'); await act('nieves', null, 'letter');
  await go('canteras'); await act('Phone box', 'use');
  await go('museum_hall'); await act('Montesdeoca\'s van', 'look'); await act('Archive stairs', 'exit'); await act('carmen', 'talk'); await act('Conservation list', 'look');
  await expect('Thursday', () => Game.flags.ch === 3);
  // ---- Thursday
  await go('canteras'); await act('chano', 'talk', null, ['Today\'s paper']);
  await go('museum_hall'); await act('Archive stairs', 'exit'); await act('carmen', 'talk', null, ['Castilians']);
  await go('isleta'); await act('pino', 'talk', null, ['Pepe']);
  await go('colon'); await act('mercedes', 'talk', null, ['May I read']);
  await go('canteras'); await act('Phone box', 'use');
  await expect('the dinner is due', () => S.dinnerDue());
  await go('museum_hall'); await act('derek', 'talk', null, ['best thing in the building']);
  await act('Dinner table', 'take'); await act('Corridor to the offices', 'exit'); await act('Desk drawer', null, 'knife');
  await expect('Friday, after the fight', () => Game.flags.ch === 4 && Game.flags.fight_done);
  // ---- Friday
  await go('canteras'); await act('Phone box', 'use');
  await go('museum_hall'); await act('Archive stairs', 'exit'); await act('carmen', 'talk');
  await expect('how the cave works', () => Game.flags.cave_explained);
  await go('rafa_bar'); await act('rafa', 'talk'); await act('rafa', 'talk', null, ['draw me']);
  await act('Door', 'exit'); await act('Door', 'exit');
  await page.evaluate(() => { window.__choices = ['No.']; }); await act('Door', 'exit');
  await page.waitForFunction(() => Game.flags.ch === 5, null, { timeout: 30000 });
  await expect('Saturday in the studio', () => Game.room.id === 'rafa_studio');
  // ---- Saturday
  await act('Sketchbook', 'look'); await act('rafa', 'talk', null, ['When you asked']);
  await expect('the drawing', () => Game.has('drawing'));
  await act('Door', 'exit'); await go('canteras'); await act('Phone box', 'use');
  await go('hotel_lobby'); await act('House phone', 'use'); await act('nieves', 'talk', null, ['Has a fax']);
  await expect('the fax', () => Game.flags.fax_read);
  await go('isleta');
  await page.waitForFunction(() => Game.room && Game.room.id === 'camp' && Game.player.speaker === 'vasco', null, { timeout: 30000 });
  // ---- Vasco
  await expect('playing Vasco', () => Game.player.speaker === 'vasco');
  await act('yeray', 'talk'); await act('Finds table', 'take'); await act('Path to Cave 6', 'exit');
  await act('The beam', 'use'); await act('Sit and wait half an hour', 'use'); await act('The beam', 'use'); await act('Sit and wait half an hour', 'use'); await act('The beam', 'use');
  await act('Your chalk marks', null, 'elena_charts'); await act('A remaining disc', 'use');
  await act('The great triangle', null, 'elena_charts'); await act('A remaining disc', null, 'clinometer');
  await expect('the angle', () => Game.flags.v_understood);
  await act('Path to the camp', 'exit'); await act('Camp radio', 'look'); await act('baute', 'talk');
  await expect('the vault', () => Game.room.id === 'vault');
  await act('Left anchor', 'use'); await act('Left anchor', 'use'); await act('Left anchor', 'use');
  await act('The wall by the grille', 'use'); await act('Right anchor', 'use');
  await act('Right anchor', 'use', null, ['airport']);
  // ---- Sunday: the airport first (the bad ending), then Carmen's
  await expect('Sunday, Alan again, at the airport', () => Game.flags.ch === 6 && !Game.player.speaker && Game.room.id === 'gando');
  await act('clerk', 'talk', null, ['Carmen']);
  await expect('Carmen\'s flat', () => Game.room.id === 'carmen_flat');
  await act('Answering machine', 'use'); await act('Elena\'s box', 'take'); await act('Fridge', 'take');
  await act('carmen', 'talk', null, ['Where\'s Vasco', 'lower vault']);
  await expect('the Land Rover', () => Game.room.id === 'landrover');
  await act('The bonnet', null, 'water');
  await expect('the camp at night', () => Game.room.id === 'camp');
  await act('Steps down to the granary', 'exit'); await act('The grille', 'use'); await act('Crates', 'take');
  // ---- Monday
  await expect('Monday in Cave 6', () => Game.flags.ch === 7 && Game.room.id === 'cave6');
  await act('The door in the floor', 'use');
  await act('Socket II', null, 'discs'); // (wrong on purpose: the water surges)
  await expect('a surge', () => Game.flags.surges === 1);
  await act('Socket IV', null, 'discs'); await act('Socket I', null, 'discs');
  await act('carmen', 'talk');
  await act('Socket V', null, 'discs'); await act('Socket II', null, 'discs'); await act('Socket VI', null, 'discs');
  await expect('the sixth disc', () => Game.has('disc6'));
  await act('Socket III', null, 'disc6');
  await act('The seventh disc', 'use', null, ['23° 26']);
  await expect('the lock closed', () => Game.flags.lock_closed);
  await act('yeray', 'talk'); await act('vasco', 'talk', null, ['I have to tell you', 'That\'s it']);
  await act('Path to the camp', 'exit'); await act('Camp radio', null, 'fuse');
  await page.waitForSelector('#ending:not(.hidden)', { timeout: 30000 });
  result = 'won';
} catch (e) { result = 'stopped: ' + e.message; }
console.log(JSON.stringify({ result, steps: step, errors: errs.slice(0, 20) }, null, 1));
await browser.close();
process.exit(result === 'won' && !errs.length ? 0 : 1);
