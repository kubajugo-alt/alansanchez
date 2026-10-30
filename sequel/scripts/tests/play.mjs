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
  // ---- the prologue (only when the game plays it: off for now, S.PLAY_PROLOGUE)
  if (await page.evaluate(() => S.PLAY_PROLOGUE)) {
    await page.waitForFunction(() => Game.room && Game.room.id === 'elena_car', null, { timeout: 30000 });
    await act('The radio', 'use'); await act('Notebook on the passenger seat', 'look'); await act('The rear-view mirror', 'look');
    await act('The window crank', 'use'); await act('The air', 'look');
  }
  await page.waitForFunction(() => Game.room && Game.room.id === 'gando' && Game.flags.ch === 1, null, { timeout: 30000 });
  await expect('Tuesday at Gando', () => Game.room.id === 'gando');
  // ---- Tuesday
  await act('vasco', 'talk');
  // (2026-10-29: check-in at two; the beach, the surfer, the sun, the nap and the burn; Gail sends him to the market; the
  // aloe lady can't change a 5,000 note, Chano can; then Gail's blazer, Nieves, and the jeans in the room)
  await go('beach', 'canteras'); await act('surfer', 'talk');
  await expect('the sun out', () => Game.flags.sun_out);
  await act('Towels', 'use');
  await expect('the burn', () => Game.flags.burnt && !Game.flags.undressed);
  await go('hotel_lobby', 'canteras'); await act('To the restaurant', 'exit'); await act('seat_gail', 'talk');
  await go('mercado'); await act('candelaria', 'talk');
  await go('canteras'); await act('chano', 'talk');
  await expect('change and chacho', () => Game.flags.change_got && Game.flags.chacho && Game.has('coins'));
  await act('chano', 'talk', null, ['postcards']); await quiet(); await page.evaluate(() => Game.readItem('postcard')); await quiet(); await act('chano', null, 'postcard');
  await expect('the postcard posted', () => Game.flags.postcard_posted);
  await go('mercado'); await act('candelaria', 'talk');
  await expect('the aloe', () => Game.flags.aloe_done);
  await go('hotel_lobby', 'canteras'); await act('To the restaurant', 'exit'); await act('seat_gail', 'talk'); await act('Back to the lobby', 'exit');
  await act('nieves', 'talk', null, ['lost a blazer', 'A cigar band']);
  await expect('the blazer', () => Game.has('blazer'));
  await act('Lifts', 'exit'); await act('Vasco\'s field bag', 'use');
  await expect('dressed', () => Game.flags.blazer_on);
  await act('Door', 'exit');
  // (the novel's order: Chano's change and the first call to Inês before the reception)
  await go('canteras');
  await act('Phone box', 'use');
  await expect('the first call', () => Game.flags.called_tue);
  await go('museum_hall'); await act('vasco', 'talk'); await act('montesdeoca', 'talk'); await act('vasco', 'talk'); await act('vasco', 'talk');   // (busy; Montesdeoca; to Baute; the moment)
  await act('Door to the steps', 'exit'); await act('carmen', 'talk'); await act('Back to the party', 'exit');   // (the toast)
  await expect('the toast', () => Game.flags.toast_done); await act('Out to Vegueta', 'exit');
  await expect('the walk and the mist', () => Game.flags.mist_seen && Game.room.id === 'canteras');
  await act('Phone box', 'use');
  await expect('the midnight call', () => Game.flags.called_tue2);
  await act('Hotel Cristina', 'exit'); await act('Lifts', 'exit');
  await expect('Wednesday', () => Game.flags.ch === 2);
  // ---- Wednesday
  // (2026-10-30, the novel's Chapter Two: Vasco leaving at dawn; Pino's helmet; Santa Ana, the clock, the bell and the letter;
  // the fax; the van and Carmen's brush-off; Chano's theory; the day ends in room 404, Vasco asleep, then Pepe)
  await go('isleta'); await act('pino', 'talk');
  await go('santa_ana'); await act('Cathedral door', 'exit'); await act('fermin', 'talk', null, ['wind it', 'little brass']);
  await act('Door to the tower', 'exit'); await act('Clock winding drum', 'use'); await act('The north bell', 'look'); await act('The north bell', null, 'notebook');
  await act('fermin', 'talk');
  await expect('the letter', () => Game.has('letter') && Game.has('inscription'));
  await act('Stairs down', 'exit'); await act('Out to the plaza', 'exit');
  await expect('the letter opened', () => Game.flags.letter_opened);
  await go('hotel_lobby'); await act('nieves', null, 'inscription'); await act('nieves', null, 'letter');
  await go('canteras'); await act('Phone box', 'use'); await act('chano', 'talk', null, ['Coronas']);   // (Carmen's toll)
  await go('museum_hall');
  await expect('the van and the list', () => Game.flags.saw_disc_list);
  await act('Archive stairs', 'exit'); await act('carmen', 'talk');
  await expect('Carmen, and back in the hall', () => Game.flags.carmen_wed && Game.has('galindo') && Game.room.id === 'museum_hall' && Game.flags.wed_ready);
  await go('canteras');
  await expect('Chano\'s theory', () => Game.flags.chano_theory);
  await act('Hotel Cristina', 'exit'); await act('Lifts', 'exit');
  await expect('Thursday', () => Game.flags.ch === 3);
  // ---- Thursday
  await go('canteras'); await act('chano', 'talk', null, ['Today\'s paper', 'Coronas']);   // (Chano's news first: Pepe Santana)
  await go('museum_hall'); await act('Archive stairs', 'exit'); await act('carmen', 'talk');   // (the toll; the history; sent to Casa de Colón)
  await expect('Carmen\'s history', () => Game.flags.lore_carmen && Game.flags.sent_to_colon);
  await go('isleta'); await act('pino', 'talk', null, ['Pepe']);
  await go('colon'); await act('mercedes', 'talk');
  await expect('the inquiry', () => Game.flags.inquiry_read);
  await go('canteras'); await act('Phone box', 'use');
  await go('hotel_lobby', 'canteras');   // (the plan, the suitcase, the jacket again)
  await expect('the suitcase; the dinner is due', () => Game.flags.suitcase_done && Game.flags.blazer_on && S.dinnerDue());
  await act('To the restaurant', 'exit'); await act('seat_gail', 'talk'); await act('Back to the lobby', 'exit');   // (the tide; the invitation)
  await go('museum_hall'); await act('derek', 'talk', null, ['best angle']);
  await act('Dinner table', 'take'); await act('Corridor to the offices', 'exit'); await act('Desk drawer', null, 'knife');
  await expect('Friday, after the fight', () => Game.flags.ch === 4 && Game.flags.fight_done);
  // ---- Friday
  // (the fight plays on its own; the first visit to Las Canteras is the sea wall and Chano; after Carmen's talk the dusk,
  // the mist and the walk into Vegueta play on their own and end in the bar; each try at the door is a scene)
  await go('canteras'); await act('Phone box', 'use'); await act('chano', 'talk', null, ['Coronas']);
  await go('museum_hall'); await act('Archive stairs', 'exit'); await act('carmen', 'talk');
  await expect('how the cave works', () => Game.flags.cave_explained);
  await expect('the walk into Vegueta', () => Game.room.id === 'rafa_bar' && Game.flags.dusk_fri);
  await act('rafa', 'talk'); await act('rafa', 'talk', null, ['pencil']);
  await expect('the napkin', () => Game.has('napkin'));
  await act('Door', 'exit'); await act('Door', 'exit');
  await expect('Yeray gone, unheard', () => Game.flags.yeray_left);
  await act('Door', 'exit', null, ['No.']);   // (the first "No."; the second follows it)
  await page.waitForFunction(() => Game.flags.ch === 5, null, { timeout: 30000 });
  await expect('Saturday in the studio', () => Game.room.id === 'rafa_studio');
  // ---- Saturday (2026-10-30, the novel's Chapter Six: the sketchbook; the truth and the drawing, then back to the hotel
  // on its own: Nieves and the footprint in 404; the call to Inês and Chano's news; the fax and the day he tried)
  await act('Sketchbook', 'look'); await act('rafa', 'talk', null, ['When you asked']);
  await expect('the drawing', () => Game.has('drawing'));
  await expect('the footprint in 404', () => Game.flags.footprint_seen && Game.room.id === 'hotel_room');
  await go('canteras'); await act('Phone box', 'use');
  await expect('Chano\'s news', () => Game.flags.chano_sat);
  await go('hotel_lobby'); await act('House phone', 'use'); await act('nieves', 'talk', null, ['Has a fax']);
  await expect('the fax, and he tried', () => Game.flags.fax_read && Game.flags.tried);
  await go('isleta');
  await page.waitForFunction(() => Game.room && Game.room.id === 'camp' && Game.player.speaker === 'vasco', null, { timeout: 30000 });
  // ---- Vasco
  await expect('playing Vasco', () => Game.player.speaker === 'vasco');
  await act('yeray', 'talk'); await act('Finds table', 'take'); await act('Path to Cave 6', 'exit');
  await act('The beam', 'use'); await act('Sit and wait half an hour', 'use'); await act('The beam', 'use'); await act('Sit and wait half an hour', 'use'); await act('The beam', 'use');
  await act('Your chalk marks', null, 'elena_charts'); await act('A remaining disc', 'use');
  await act('The great triangle', null, 'elena_charts'); await act('A remaining disc', null, 'clinometer');
  await expect('the angle, and out to the camp', () => Game.flags.v_understood && Game.room.id === 'camp');
  await act('Camp radio', 'look'); await act('baute', 'talk');
  await expect('the vault', () => Game.room.id === 'vault');
  await act('Left anchor', 'use'); await act('Left anchor', 'use'); await act('Left anchor', 'use');
  await act('The wall by the grille', 'use'); await act('Right anchor', 'use');
  await act('Right anchor', 'use', null, ['airport']);
  // ---- Sunday: packing at five, the taxi to Gando; the Iberia desk: "Window" first (the bad ending, back to the desk),
  // then "I've left something behind"; Chano at the kiosk (Carmen's address opens her pin); Carmen's flat; the Land Rover
  await expect('Sunday, Alan again, at the airport', () => Game.flags.ch === 6 && !Game.player.speaker && Game.room.id === 'gando');
  await act('clerk', 'talk', null, ['Window', 'left something behind']);
  await expect('Chano, at the kiosk', () => Game.room.id === 'canteras' && Game.flags.chose_carmen);
  await go('carmen_flat');
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
  // the novel's order: II, IV, III, VI, V, then Baute's disc in I
  await act('Socket I', null, 'discs'); // (wrong on purpose: the water surges)
  await expect('a surge', () => Game.flags.surges === 1);
  await act('Socket II', null, 'discs'); await act('Socket IV', null, 'discs'); await act('Socket III', null, 'discs');
  await act('Socket VI', null, 'discs'); await act('Socket V', null, 'discs');
  await expect('the sixth disc', () => Game.has('disc6'));
  await act('Socket I', null, 'disc6');
  // the seventh: the cloud crosses the sun; Carmen and the Land Rover's wing mirror; turned by the light as Vasco calls it
  await act('The seventh disc', 'use');
  await expect('the cloud', () => Game.flags.cloud_over && !Game.flags.mirror_on);
  await act('carmen', 'talk');
  await expect('the mirror', () => Game.flags.mirror_on);
  await act('The seventh disc', 'use', null, ['left', 'down', 'down']);
  await expect('the lock closed', () => Game.flags.lock_closed);
  await act('yeray', 'talk'); await act('vasco', 'talk', null, ['I have to tell you', 'I broke both']);
  await act('Path to the camp', 'exit'); await act('Camp radio', null, 'fuse');
  await page.waitForSelector('#ending:not(.hidden)', { timeout: 60000 });
  result = 'won';
} catch (e) { result = 'stopped: ' + e.message; }
console.log(JSON.stringify({ result, steps: step, errors: errs.slice(0, 20) }, null, 1));
await browser.close();
process.exit(result === 'won' && !errs.length ? 0 : 1);
