// In-game screenshots (HANDOFF entry 116): Vasco on the bed, the inventory with every item, every picture close-up page by page.
// usage: node items_shot.mjs <baseUrl> <outDir>   (writes <outDir>/in_game_*.jpg)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [base, dir] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
await page.addInitScript(() => { try { localStorage.setItem('shortest-night-content', 'full'); } catch (e) {} });
await page.goto(base + '?scene=tue', { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 60000 });
await page.evaluate(() => Game.begin(true));
await page.waitForTimeout(5000);
const shot = async n => { await page.screenshot({ path: `${dir}/in_game_${n}.jpg`, type: 'jpeg', quality: 85 }); console.log('shot', n); };
// 1. the first night: Vasco on the bed
await page.evaluate(async () => { Object.assign(Game.flags, { ch: 1, called_tue2: true, mist_seen: true, walk_done: true }); await Game.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true }); Game.player.x = 760; Game.player.y = 650; Game.player.dir = 'w'; });
await page.waitForTimeout(4000);
await shot('bed');
const who = await page.evaluate(() => Engine.npcs.map(a => a.id + '@' + Math.round(a.x) + ',' + Math.round(a.y) + (a.visible ? '' : ' hidden')).join(' '));
console.log('npcs:', who);
// the bed's speaker: a Vasco line spoken from it
await page.evaluate(() => { window.S.say('vasco_t_night_5'); });
await page.waitForTimeout(1500);
await shot('bed_speaks');
await page.waitForTimeout(4000);
// 2. every item in his pockets
await page.evaluate(() => { Game.flags.coins = 3; for (const id of Object.keys(Engine.ITEMS)) if (!Game.state.inv.includes(id)) Game.state.inv.push(id); Game.renderInv(); });
const n = await page.evaluate(() => Game.state.inv.length);
console.log('items', n);
await page.evaluate(() => { const b = document.querySelector('#inv') || document.querySelector('#invBar'); document.querySelector('#invbar').classList.add('show'); });
await page.mouse.move(640, 715); await page.waitForTimeout(2500);
await shot('inventory');
// the same in two halves, at the size a real pocketful is drawn
const all = await page.evaluate(() => Game.state.inv.slice());
for (const [k, part] of [['inventory_a', all.slice(0, 19)], ['inventory_b', all.slice(19)]]) {
  await page.evaluate(p => { Game.state.inv = p; Game.renderInv(); document.querySelector('#invbar').classList.add('show'); }, part);
  await page.mouse.move(640, 700); await page.mouse.move(640, 715); await page.waitForTimeout(1500);
  await shot(k);
}
// scroll the bar if it pages
const pages = await page.evaluate(() => { const r = document.querySelectorAll('#inventory canvas'); return r.length; });
console.log('icons drawn', pages);
// 3. the close-ups
const cu = [
  ['gc_photo', 'S.readGcPhoto()'], ['gc_photo_late', '(Game.flags.cave_explained = true, S.readGcPhoto())'],
  ['baute', 'S.readBauteDesk()'], ['rubbing', 'S.readInscription()'], ['letter', '(Game.flags.fax_read = false, S.readLetter())'],
  ['elena', 'S.readElena()'], ['charts', 'S.readCharts()'], ['sketchbook', 'S.readSketchbook()'],
  ['postcard', '(Game.flags.postcard_written = false, S.writeCard())'], ['postcard_look', 'S.writeCard()'],
  ['carmen_photo', "Engine.ROOMS.carmen_flat.hotspots.find(h => h.name === 'Shelves').look()"],
];
for (const [name, call] of cu) {
  await page.evaluate(c => { window.__p = eval(c); }, call);
  await page.waitForTimeout(1500);
  let i = 1;
  await shot('cu_' + name + '_' + i);
  while (await page.evaluate(() => document.querySelector('#closeup .next').style.visibility === 'visible' && !document.querySelector('#closeup').classList.contains('hidden'))) {
    await page.click('#closeup .next'); await page.waitForTimeout(900); i++; await shot('cu_' + name + '_' + i);
  }
  if (await page.evaluate(() => !document.querySelector('#closeup').classList.contains('hidden'))) await page.click('#closeup .x');
  await page.evaluate(() => Promise.race([window.__p, new Promise(r => setTimeout(r, 25000))]));
  await page.waitForTimeout(500);
}
console.log(errs.join('\n') || 'no errors');
await browser.close();
