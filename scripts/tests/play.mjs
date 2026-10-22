// Full playthrough: starts a NEW game and plays it to the ending purely as a player would, then prints {"won":true}.
//
// usage: node scripts/tests/play.mjs [baseUrl]        (default http://localhost:8098/)
//   serve the repo root first: npx -y http-server -p 8098 -c-1 -s .
//   STEP_TIMEOUT=<ms> (default 90000) per step; VERBOSE=1 prints every step as it passes.
//
// Every step is one player action: Game.act(target, verb?, item?) on a hotspot (by name) or a character (by id),
// an exit hotspot to walk through a door / take the tram / pick a pin on the map, two inventory items combined by
// clicking their slots, or a mini-puzzle solved through its own DOM. Dialogue menus are answered by clicking the
// #dialog button whose visible text contains the given words. No story flag is ever set and no story function is
// called: flags are only READ, to check that each step did what it should (`expect`) and to report a failure.
// Exit code 1 and a report (step, room, Inês's hint, flags, inventory) if any step fails.
//
// Not quite a click on the screen, and why:
//  - window.FAST is on (as in smoke.mjs), so waits are short. FAST closes every close-up after 60 ms, which no
//    real click can beat: the drawer lock in Ferreira's workshop is therefore solved by dispatching the same click
//    events a player makes (wheel halves, then the knob) on its canvas the instant it opens (see `lock` below).
//  - FAST also makes the Sé key toss land at once (js/story/se.js tossGame), so its timing bar is never shown.
//  - Item-on-item uses the inventory slots' own click handlers (slot.click()), as the player clicks them.
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/';
const STEP_TIMEOUT = +process.env.STEP_TIMEOUT || 90000;
const VERBOSE = !!process.env.VERBOSE;

// ---------------------------------------------------------------- step builders
// act: Game.act(target, verb, item); `answers`: dialog buttons to click, in order (substring of their text)
const act = (name, target, verb, item, o = {}) => ({ name, kind: 'act', args: [target, verb || null, item || null], ...o });
const look = (name, target, o) => act(name, target, 'look', null, o);
const use = (name, target, item, o) => act(name, target, item ? null : 'use', item, o);
const take = (name, target, o) => act(name, target, 'take', null, o);
const talk = (name, target, answers, o = {}) => act(name, target, 'talk', null, { answers, ...o });
const go = (name, exitHotspot, room, o = {}) => act(name, exitHotspot, 'exit', null, { expect: `room === '${room}'`, ...o });
const combine = (name, a, b, o = {}) => ({ name, kind: 'combine', args: [a, b], ...o });

// walking between places: through the doors and the map, as the player does
const SHOP_TO_MAP = [go('shop: out to the street', 'Door to the street', 'street'), go('street: the tram stop', 'Tram 28 stop', 'map')];
const toMapFromStreet = [go('street: the tram stop', 'Tram 28 stop', 'map')];
const mapTo = (pin, room) => go(`map: ${pin}`, pin, room);
const MAP_TO_SHOP = [mapTo('Alfama · Livraria Sanches', 'street'), go('street: into the bookshop', 'Livraria Sanches', 'shop')];

// ---------------------------------------------------------------- the walkthrough
const STEPS = [
  // ============================================================ CHAPTER I: The Fog
  { name: 'new game: the opening plays to the shop', kind: 'begin', expect: "room === 'shop' && f.ch === 1" },
  // Puzzle I-A: the machine, the sugar tin, the lamp (the cat moves off the desk), the drawer
  use('shop: play the answering machine', 'Answering machine', null, { expect: 'f.heard_machine' }),
  take('shop: the key in the sugar tin', 'Sugar tin', { expect: "has('key')" }),
  use("shop: switch off the banker's lamp", "Banker's lamp", null, { expect: 'f.lampOff' }),
  use("shop: the key on grandfather's desk", "Grandfather's desk", 'key', { expect: 'f.shop_drawer' }),
  take('shop: take the ledger', 'Ledger', { expect: "has('ledger')" }),
  take('shop: take the magnifying glass', 'Magnifying glass', { expect: "has('magnifier')" }),
  take('shop: coins from the register', 'Cash register', { expect: "has('coins') && f.coins === 3" }),
  go('shop: out to the street', 'Door to the street', 'street'),
  use('street: magnifier on the sea-monster tile (optional)', 'Sea-monster tile', 'magnifier', { expect: 'f.mag_monster' }),
  ...toMapFromStreet,
  mapTo('Polícia Judiciária', 'police'),
  // the drownings, then the list: Rui goes down to the coroner
  talk('police: Rui, the drownings and the list', 'rui', ['drownings', 'anything else'], { expect: 'f.saw_list && f.rui_out' }),
  // Puzzle I-C: Teixeira, three steps, then he turns to the wall
  talk('police: charm Teixeira', 'npc_phone', ['shoulders', 'oak bookcase', 'bicep'], { expect: 'f.teixeira_wall' }),
  use('police: notebook on the evidence bag', 'Evidence bag', 'notebook', { expect: "f.sketched_tile && has('sketch') && f.flirted_cop" }),
  go('police: out', 'Door', 'map'),
  ...MAP_TO_SHOP,
  use('shop: show Inês the sketch', 'ines', 'sketch', { expect: 'f.knows_brotherhood && f.ines_plan' }),
  ...SHOP_TO_MAP,
  // Puzzle I-D: the Sé
  mapTo('Sé de Lisboa · museum', 'se_museum'),
  look('museum: the panorama', 'Panorama of Lisbon, 1700'),
  look('museum: the alminhas panel', 'Alminhas panel', { expect: 'f.se_exhibits >= 2 && f.se_plan_on' }),
  go('museum: into the cloister', 'Cloister', 'se_cloister'),
  look('cloister: the casting pit', 'Casting pit', { expect: 'f.saw_pit' }),
  look('cloister: the founder marks', 'Founder marks', { expect: 'f.saw_marks' }),
  look('cloister: the mould fragments', 'Mould fragments', { expect: 'f.saw_frags' }),
  talk('cloister: ask Vasco about the dig (he takes Alan into the pit)', 'vasco', ['pit, exactly', 'marks on the bricks', 'clay pieces'], { expect: 'f.in_pit' }),
  talk("cloister: fix Vasco's shirt (the key)", 'vasco', ['buttoned your shirt wrong'], { expect: "f.lanyard_taken && has('reserve_key')" }),
  // the inscription and the toss; then keep him talking: the warm reply each time
  talk('cloister: the inscription, the toss, keep him talking', 'vasco',
    ['little mark down there', 'Ask the cat', 'Who drops a coin', 'Why do you do this', 'It suits you'],
    { expect: "f.heist_done && f.vasco_thursday && has('brotherhood_charter') && has('vasco_card')" }),
  go('museum: out', 'Way out', 'map'),
  ...MAP_TO_SHOP.slice(0, 1),
  go('street: into the bookshop (Inês reads the register)', 'Livraria Sanches', 'shop', { expect: "room === 'shop' && f.reserve_raided" }),
  // Puzzle I-B: the song
  go('shop: out to the street', 'Door to the street', 'street'),
  go('street: into the Taberna', 'Taberna da Saudade', 'tavern'),
  take('tavern: the matches', 'Box of matches', { expect: "has('matches')" }),
  talk('tavern: Amália, Joaquim and the song', 'amalia', ['knew my grandfather', 'Sino Afogado', 'Goodbye'], { expect: 'f.saw_photo && f.askedSong' }),
  use('tavern: two coins to Lino', 'npc_lino', 'coins', { expect: "has('ginja') && f.coins === 1" }),
  talk('tavern: charm Duarte', 'npc_guitar', ['beautiful instrument', 'give lessons', 'Watch his hands'], { expect: 'f.duarte_flirt' }),
  use('tavern: a ginjinha for Amália (the song, end of Chapter I)', 'amalia', 'ginja', { expect: "f.heard_song && has('glass') && f.ch === 2" }),

  // ============================================================ CHAPTER II: The Unexplained Drawer
  go('tavern: out', 'Door', 'street'),
  ...toMapFromStreet,
  mapTo('Polícia Judiciária', 'police'),
  talk('police: ask Rui about 1955', 'rui', ['fifty-five', 'Goodbye'], { expect: 'f.askedDrawer' }),
  // Puzzle II-A: salt, coffee, the drawer
  use('police: magnifier on the drawer seam', 'Bottom drawer', 'magnifier', { expect: 'f.salt_seen' }),
  use('police: last coin in the coffee machine', 'Coffee machine', 'coins', { expect: "has('coffee')" }),
  use('police: coffee on the drawer (the 1955 file)', 'Bottom drawer', 'coffee', { expect: "f.drawer_open && has('file55') && f.deaths_known" }),
  go('police: out', 'Door', 'map'),
  // II.2 the lavadouro
  mapTo('Lavadouro do Alfama', 'lavadouro'),
  use("lavadouro: help Celeste wring the sheet; the river, the tile, 1955", "Celeste's sheet", null,
    { answers: ['river', 'this tile', 'refused to sign', 'Goodbye'], expect: 'f.met_celeste && f.lore_turnings && f.lore_bronze && f.knows_1955_boy' }),
  go('lavadouro: out', 'Way out', 'map'),
  // II.1a Teixeira's visit brings the Ferreira key (declined: the short way)
  ...MAP_TO_SHOP.slice(0, 1),
  go("street: into the bookshop (Teixeira's visit)", 'Livraria Sanches', 'shop', { answers: ['Just the key'], expect: "room === 'shop' && f.visit_cop && has('fkey')" }),
  ...SHOP_TO_MAP,
  // II.3 Relojoaria Ferreira
  mapTo('Relojoaria Ferreira · Baixa', 'ferreira'),
  use('ferreira: matches on the oil lamp', 'Oil lamp', 'matches', { expect: 'f.ferreira_lit' }),
  look('ferreira: read the repair book', 'Repair book', { expect: 'f.read_repair' }),
  use("ferreira: desk key on the tide clock", 'Tide clock', 'key', { expect: 'f.tide_wound && f.tide_known' }),
  { name: "ferreira: the drawer lock, 0312", kind: 'lock', target: 'Desk drawer', code: '0312', expect: "f.drawer_unlocked && has('tidecard')" },
  take('ferreira: the vitrine key off the board', 'Key board', { expect: "has('vkey')" }),
  go('ferreira: out', 'Door', 'map'),
  // II.3a the Diário
  mapTo('Polícia Judiciária', 'police'),
  talk("police: tell Rui about Ferreira's clocks (his Diário)", 'rui', ["been to Ferreira's", 'Goodbye'], { expect: "has('newspaper') && f.knows_withdrawn" }),
  combine('the Diário on the notebook (the turnings)', 'newspaper', 'notebook', { expect: 'f.turnings_deduced && f.ch2_ready' }),
  go('police: out', 'Door', 'map'),
  ...MAP_TO_SHOP.slice(0, 1),
  go('street: into the bookshop (Inês pulls it together, Chapter III)', 'Livraria Sanches', 'shop', { expect: 'f.ch2_done && f.ch === 3' }),

  // ============================================================ CHAPTER III: The Weeping Stone
  ...SHOP_TO_MAP,
  mapTo('Convento do Carmo', 'convent'),
  talk('convent: Tomás, the bells (the charter)', 'tomas', ['about bells', 'Goodbye'], { expect: 'f.heard_bells && f.charter_shown' }),
  // Puzzle III-A
  use('convent: glass in the holy-water stoup', 'Holy-water stoup', 'glass', { expect: 'f.glassHoly' }),
  use('convent: holy water on the weeping stone', 'Weeping stone', 'glass', { expect: 'f.stone_washed' }),
  use('convent: magnifier on the stone', 'Weeping stone', 'magnifier', { expect: 'f.stone_read' }),
  { name: 'convent: ledger on the stone, the cipher wheel turned 7', kind: 'cipher', target: 'Weeping stone', item: 'ledger', turns: 7, expect: 'f.decoded && f.chose_chiado' },
  go('convent: out', 'Way out', 'map'),
  // III.3 the antiques shop: see the case, the clocks, the box
  mapTo('Antiguidades Lacerda · Chiado', 'antiques'),
  look('antiques: the display case (Alan sketches the tongue)', 'Display case', { expect: 'f.tongue_sketched' }),
  look('antiques: the tagged clocks', 'Tagged clocks', { expect: 'f.saw_jc_clock' }),
  look('antiques: the photograph', 'Photograph', { expect: 'f.saw_afonso' }),
  look('antiques: the music box', 'Music box', { expect: 'f.saw_box' }),
  go('antiques: out', 'Leave the shop', 'map'),
  // III.2 the Sé: Vasco on the way up, Abílio, the four bells
  mapTo('Sé de Lisboa · bell tower', 'se_cloister', { expect: "room === 'se_cloister' && f.vasco_cameo && has('sanches_fragment')" }),
  use('cloister: up the stair to the bell tower', 'Stair to the bell tower', null, { expect: "room === 'se_tower'" }),
  use('tower: write to Abílio (Joaquim, the blood, the sketch)', 'abilio', 'notebook',
    { answers: ['Joaquim Sanches', "Founders' blood", 'This tongue', 'Goodbye'], expect: 'f.heard_blood && f.knows_twin' }),
  use('tower: magnifier on the great bell', 'Great bell', 'magnifier', { expect: 'f.bell_ferreira' }),
  use('tower: magnifier on the second bell', 'Second bell', 'magnifier', { expect: 'f.bell_bastos' }),
  use('tower: magnifier on the third bell', 'Third bell', 'magnifier', { expect: 'f.bell_coutinho' }),
  use('tower: magnifier on the small bell (the order)', 'Small bell', 'magnifier', { expect: 'f.bell_sanches && f.founder_order' }),
  go('tower: down', 'Stairs down', 'map'),
  // III.3 step 3: Vasco lends the twin
  mapTo('Sé de Lisboa · museum', 'se_museum'),
  go('museum: into the cloister', 'Cloister', 'se_cloister'),
  talk('cloister: ask Vasco for the clapper', 'vasco', ["come to ask you for something"], { expect: "has('twin') && f.twin_lent && room === 'se_museum'" }),
  go('museum: out', 'Way out', 'map'),
  // III.3 step 4: the swap
  mapTo('Antiguidades Lacerda · Chiado', 'antiques'),
  talk('antiques: ask Lacerda about the music box (he goes for its key)', 'lacerda', ['music box'], { expect: 'f.lac_away' }),
  use('antiques: vitrine key on the case', 'Display case', 'vkey', { expect: 'f.case_open' }),
  use('antiques: the twin for the tongue (Lacerda comes back)', 'Display case', 'twin', { expect: "has('tongue') && f.twin_swapped && room === 'map'" }),
  // III.5 the shop: the chapter ends; Duarte's visit (declined)
  ...MAP_TO_SHOP.slice(0, 1),
  go("street: into the bookshop (end of Chapter III, Duarte's visit)", 'Livraria Sanches', 'shop',
    { answers: ['Another time'], expect: "f.ch3_done && f.ch === 4 && f.genealogy_read && room === 'shop'" }),

  // ============================================================ CHAPTER IV: The Founders' Blood
  ...SHOP_TO_MAP,
  mapTo('Cais do Sodré', 'cais'),
  go('cais: across the boats to the Maria Fé', 'Fishing boats', 'boat'),
  use('boat: knock on the hatch', 'Hatch', null, { expect: 'f.knocked' }),
  use('boat: the mooring line (the knot holds)', 'Mooring line', null, { expect: 'f.knot_tried' }),
  use('boat: the mooring line again (Zé bursts out)', 'Mooring line', null, { expect: 'f.ze_awake' }),
  talk('boat: show Zé the tide card (to the cabin)', 'ze', ['tide table'], { expect: "f.ze_believes && room === 'cabin'" }),
  take('cabin: take the tile', 'Tile on the bunk', { expect: "has('bunktile')" }),
  use('cabin: the hammer on the tile (it bounces)', 'Hammer', null, { expect: 'f.hammer_tried' }),
  combine('cabin: the tongue on the tile (18:25)', 'tongue', 'bunktile', { expect: "f.ze_saved && has('knife') && has('sardine')" }),
  go('cabin: up the ladder', 'Ladder', 'boat'),
  go('boat: back to the quay', 'Back to the quay', 'cais'),
  use('cais: ring the shop from the telephone box (Chapter V)', 'Telephone box', null, { expect: "f.ch4_done && f.ch === 5 && room === 'shop'" }),

  // ============================================================ CHAPTER V: The Drowned Bell
  use('shop: the sardine for Pessoa (the ledger)', 'pessoa', 'sardine', { expect: "f.ledger_found && has('ledger')" }),
  use("shop: play the machine (Lacerda's message)", 'Answering machine', null, { expect: 'f.heard_msg3' }),
  use('shop: ring Rui', 'Telephone', null, { expect: 'f.rui_called' }),
  use("shop: ring Vasco (his card on the phone)", 'Telephone', 'vasco_card', { expect: 'f.vasco_called' }),
  go('shop: out to the street', 'Door to the street', 'street'),
  go('street: the Taberna at night (optional)', 'Taberna da Saudade', 'tavern', { expect: "room === 'tavern' && f.amalia_night" }),
  go('tavern: out', 'Door', 'street'),
  ...toMapFromStreet,
  mapTo('Convento do Carmo · midnight', 'convent_night'),
  talk("convent: Tomás's confession (the lantern)", 'tomas', [], { expect: "f.confessed && has('lantern')" }),
  use('convent: down the open grate', 'Open grate', null, { expect: "room === 'cistern' && f.finaleIntro" }),
  // Puzzle V-B: the rite
  use('cistern: give Lacerda the ledger', 'lacerda', 'ledger', { expect: 'f.lacerda_distracted' }),
  use("cistern: the knife on Inês's ropes", 'ines', 'knife', { expect: 'f.ines_free' }),
  use('cistern: the lantern to Inês', 'ines', 'lantern', { expect: 'f.bell_lit' }),
  use('cistern: the knife on Alan (blood on the tongue)', 'self', 'knife', { expect: 'f.blood' }),
  use('cistern: strike Sanches', 'Sanches mark', 'tongue', { expect: "(f.struck || []).length === 1 && f.water === 1" }),
  use('cistern: strike Coutinho', 'Coutinho mark', 'tongue', { expect: "(f.struck || []).length === 2" }),
  use('cistern: strike Bastos', 'Bastos mark', 'tongue', { expect: "(f.struck || []).length === 3" }),
  use('cistern: strike Ferreira (the bell un-rings; dawn; the epilogue)', 'Ferreira mark', 'tongue',
    { timeout: 240000, expect: "f.won && f.dawn && ending" }),
];

// ---------------------------------------------------------------- the runner
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text()) && VERBOSE) console.log('  console error:', m.text()); });
await page.addInitScript(() => { window.FAST = true; });
const t0 = Date.now();
await page.goto(base, { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 120000 });

// what the page looks like right now (read only)
const snapshot = () => page.evaluate(() => {
  const vis = sel => { const e = document.querySelector(sel); return !!e && !e.classList.contains('hidden'); };
  const dlg = document.querySelector('#dialog.open');
  return {
    busy: !!(window.Game && Game.isBusy), room: Game.room ? Game.room.id : null,
    dialog: dlg ? [...dlg.querySelectorAll('button')].map(b => b.textContent.replace(/^\d+/, '').trim()) : null,
    closeup: vis('#closeup'), cipher: vis('#cipher'), death: vis('#death'), ending: vis('#ending'),
    done: window.__step ? window.__step.done : true, err: window.__step ? window.__step.err : null,
  };
});
// the state a step's `expect` is checked against: f = flags, has(item), room, ending
const check = expr => page.evaluate(expr => {
  const f = Game.flags, has = id => Game.has(id), room = Game.room && Game.room.id;
  const ending = !document.querySelector('#ending').classList.contains('hidden');
  try { return !!(new Function('f', 'has', 'room', 'ending', 'return (' + expr + ')'))(f, has, room, ending); } catch (e) { return 'error: ' + e.message; }
}, expr);

async function report(step, i, why) {
  const info = await page.evaluate(names => {
    const f = Game.flags || {}, h = window.S && S.hint ? S.hint() : null, h5 = window.S && S.ch5Hint ? S.ch5Hint() : null;
    const txt = id => id && window.LINES && LINES[id] ? LINES[id][1] : '';
    const rel = {}; for (const n of names) rel[n] = f[n];
    return { room: Game.room && Game.room.id, hint: h && h + ': ' + txt(h), ch5Hint: h5 && h5 + ': ' + txt(h5), inv: Game.state.inv, relevant: rel,
      flags: Object.fromEntries(Object.entries(f).filter(([k, v]) => !k.startsWith('_') && v !== false && v !== 0 && typeof v !== 'object')) };
  }, [...new Set(((step.expect || '') + ' ch').match(/\bf\.(\w+)/g)?.map(s => s.slice(2)) || []).add('ch')]).catch(e => ({ evalError: e.message }));
  console.log(`FAIL at step ${i + 1}/${STEPS.length}: "${step.name}"\n  why: ${why}`);
  console.log('  room:', info.room, '\n  hint (S.hint):', info.hint, info.ch5Hint ? '\n  Chapter V hint (S.ch5Hint): ' + info.ch5Hint : '');
  console.log('  step flags:', JSON.stringify(info.relevant), '\n  inventory:', JSON.stringify(info.inv));
  console.log('  all set flags:', JSON.stringify(info.flags));
  if (pageErrors.length) console.log('  page errors:', pageErrors.join(' | '));
  console.log(JSON.stringify({ won: false, step: i + 1, name: step.name }));
  await browser.close();
  process.exit(1);
}

// start a step's action in the page without waiting for it (it may stop in a dialog)
async function start(step) {
  await page.evaluate(step => {
    const s = window.__step = { done: false, err: null };
    const run = async () => {
      if (step.kind === 'begin') return Game.begin(true);
      if (step.kind === 'act') return Game.act(...step.args.map(a => a === null ? undefined : a));
      if (step.kind === 'combine') { // click the first item's slot, then the second's
        const slots = document.querySelectorAll('#inventory .slot'), inv = Game.state.inv;
        const a = slots[inv.indexOf(step.args[0])], b = slots[inv.indexOf(step.args[1])];
        if (!a || !b) throw new Error('not in the inventory: ' + step.args.filter(id => !inv.includes(id)).join(', '));
        a.click(); document.querySelectorAll('#inventory .slot')[inv.indexOf(step.args[1])].click();
        return;
      }
      if (step.kind === 'lock') {
        // the lock opens as a close-up with a canvas; FAST closes close-ups after 60 ms, so the player's clicks
        // (lower half of a wheel: +1; then the knob) are dispatched the moment the canvas is in the page
        const W = [315, 467, 625, 779], WY = 352, KNOB = [988, 356];
        const obs = new MutationObserver(() => {
          const c = document.querySelector('#closeup:not(.hidden) canvas.draw'); if (!c) return;
          obs.disconnect();
          const r = c.getBoundingClientRect(), at = (x, y) => ({ clientX: r.left + x * r.width / 1280, clientY: r.top + y * r.height / 720 });
          const click = (x, y) => c.dispatchEvent(new MouseEvent('click', { bubbles: true, ...at(x, y) }));
          const now = (Game.flags.lock_digits || [0, 0, 0, 0]).slice();
          step.code.split('').map(Number).forEach((d, i) => { for (let n = (d - now[i] + 10) % 10; n > 0; n--) click(W[i], WY + 50); });
          click(KNOB[0], KNOB[1]);
        });
        obs.observe(document.querySelector('#closeup'), { childList: true, subtree: true, attributes: true });
        return Game.act(step.target, 'use');
      }
      if (step.kind === 'cipher') { // the wheel is a modal: the test clicks its buttons from outside (below)
        return Game.act(step.target, undefined, step.item);
      }
    };
    run().then(() => { s.done = true; }, e => { s.done = true; s.err = String(e && e.message || e); });
  }, step);
}

async function runStep(step, i) {
  const answers = (step.answers || []).slice();
  const deadline = Date.now() + (step.timeout || STEP_TIMEOUT);
  await start(step);
  let quiet = 0, closeupSeen = 0, cipherDone = false;
  while (Date.now() < deadline) {
    await page.waitForTimeout(100);
    if (pageErrors.length) return report(step, i, 'page error: ' + pageErrors.join(' | '));
    const s = await snapshot();
    if (s.err) return report(step, i, 'the action threw: ' + s.err);
    if (s.death) return report(step, i, 'Alan drowned (the death screen is up)');
    if (s.cipher && step.kind === 'cipher' && !cipherDone) {
      cipherDone = true;
      await page.evaluate(n => { const m = document.querySelector('#cipher'); for (let k = 0; k < n; k++) m.querySelector('.right').click(); m.querySelector('.done').click(); }, step.turns);
      quiet = 0; continue;
    }
    if (s.cipher) return report(step, i, 'the cipher wheel opened unexpectedly');
    if (s.dialog) {
      quiet = 0;
      const want = answers.shift();
      if (!want) return report(step, i, 'a dialog menu opened that the step has no answer for: [' + s.dialog.join(' | ') + ']');
      const k = s.dialog.findIndex(t => t.toLowerCase().includes(want.toLowerCase()));
      if (k < 0) return report(step, i, `no dialog option containing "${want}": [${s.dialog.join(' | ')}]`);
      await page.evaluate(k => document.querySelectorAll('#dialog.open button')[k].click(), k);
      continue;
    }
    // a close-up left open (FAST closes them itself): close it as the player does
    if (s.closeup) { if (++closeupSeen > 20) await page.evaluate(() => document.querySelector('#closeup .x').click()); quiet = 0; continue; }
    closeupSeen = 0;
    if (s.done && !s.busy) quiet++; else quiet = 0;
    if (quiet >= 5 || (s.ending && s.done)) break;
  }
  if (Date.now() >= deadline) return report(step, i, `timed out after ${(step.timeout || STEP_TIMEOUT) / 1000} s (busy or waiting)`);
  if (answers.length) return report(step, i, 'dialog option(s) never offered: ' + answers.join(', '));
  if (step.expect) {
    const ok = await check(step.expect);
    if (ok !== true) return report(step, i, `expected ${step.expect}` + (typeof ok === 'string' ? ' (' + ok + ')' : ' but it is false'));
  }
  if (VERBOSE) console.log(`ok ${String(i + 1).padStart(3)} ${step.name}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}

for (let i = 0; i < STEPS.length; i++) await runStep(STEPS[i], i);
console.error(`${STEPS.length} steps, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log(JSON.stringify({ won: true }));
await browser.close();
process.exit(0);
