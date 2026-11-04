// Game II's "already done" replies and the phone box's hints (ported from Game I's scripts/tests/story_hints.mjs, which
// checked Game I's rotating S.done replies, the shop phone after Rui and the Chapter V notebook hints). Game II has no
// S.done: each place answers a second try with its own line, so the real sites are checked: the fax sent twice
// (nieves_fax_done), the clock wound twice (alan_drum_again), a second rubbing (alan_rub_again), the dinner table's knife
// twice (alan_table_again), Vasco's mark scratched twice (vasco_mark_done). The hints are Inês's, from the phone box on
// Las Canteras (S.phoneBox, S.hint in js/story/core.js, the puzzles' steps added in js/story/puzzles.js), not Inês in
// person: S.hint step by step through every day (each an Inês line that exists); the phone box's refusals (no coins,
// only the 5,000 note, Sunday "no time"); a call that's due plays first and takes a coin; "What now?" speaks the hint;
// the notebook's last page is "What Inês would say" (the hint's text) for Alan, and isn't there while playing Vasco.
//   node scripts/tests/story_hints.mjs [baseUrl]   (serve sequel/ first: npx -y http-server sequel -p 8101 -c-1 -s)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8101/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
page.on('console', m => { if (/missing line/.test(m.text())) errs.push(m.text()); });
await page.addInitScript(() => {
  window.FAST = true;
  // dialogue: pick the queued choices in order (by a piece of their text), then the last button (goodbye)
  window.__choices = [];
  setInterval(() => {
    const d = document.querySelector('#dialog.open'); if (!d) return;
    const bs = [...d.querySelectorAll('button')]; if (!bs.length) return;
    let b = null;
    if (window.__choices.length) { b = bs.find(x => x.textContent.includes(window.__choices[0])); if (b) window.__choices.shift(); }
    (b || bs[bs.length - 1]).click();
  }, 60);
});
await page.goto(base, { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 120000 });
await page.evaluate(() => Game.begin(true));
await page.waitForFunction(() => Game.room && !Game.isBusy, null, { timeout: 300000, polling: 500 });
let bad = 0;
const ok = (n, c, x) => { if (!c) bad++; console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); };

// ---- the "already done" replies, at their real sites
const done = await page.evaluate(async () => {
  const heard = []; const pv = Sound.playVoice; Sound.playVoice = (id, ...a) => { heard.push(id); return pv(id, ...a); }; window.__heard = heard;
  const f = Game.flags, out = {}, last = () => heard.splice(0).pop();
  const quiet = async () => { for (let i = 0; i < 300 && Game.isBusy; i++) await new Promise(r => setTimeout(r, 50)); };
  await Game.goRoom('hotel_lobby', null, { noEnter: true, instant: true });
  f.ch = 2; S.give('inscription', true);
  await S.fax('inscription'); heard.splice(0); await S.fax('inscription'); out.fax = last();
  await Game.goRoom('belfry', null, { noEnter: true, instant: true });
  f.clock_wound = true; await S.windClock(); out.drum = last();
  await S.rubBell(); out.rub = last();
  f.ch = 3; S.give('knife', true);
  const table = Game.roomDef('museum_hall').hotspots.find(h => h.name === 'Dinner table'); await table.take(); out.table = last();
  f.ch = 5; S.becomeVasco(); f.v_marked = true; await S.scratchMark(); out.mark = last(); S.becomeAlan();
  await quiet();
  return out;
});
ok('the fax sent twice', done.fax === 'nieves_fax_done', JSON.stringify(done));
ok('the clock wound twice', done.drum === 'alan_drum_again', done.drum);
ok('a second rubbing', done.rub === 'alan_rub_again', done.rub);
ok('the knife taken twice', done.table === 'alan_table_again', done.table);
ok('Vasco\'s mark twice', done.mark === 'vasco_mark_done', done.mark);

// ---- S.hint, day by day (each step adds to the flags before it; the order the story plays them in)
const DAYS = {
  1: [[{}, 'ines_hint_beach'], [{ burnt: true }, 'ines_hint_burn'], [{ aloe_sent: true }, 'ines_hint_aloe'], [{ aloe_done: true }, 'ines_hint_gail'],
    [{ gail_hint: true }, 'ines_hint_nieves'], [{ blazer_got: true }, 'ines_hint_dress'], [{ blazer_on: true }, 'ines_hint_call_first'],
    [{ called_tue: true }, 'ines_hint_reception'], [{ reception_done: true }, 'ines_hint_hotel']],
  2: [[{}, 'ines_hint_isleta'], [{ saw_helmet: true }, 'ines_hint_cathedral'], [{ clock_wound: true }, 'ines_hint_bell'], [{ fermin_letter: true }, 'ines_hint_fax'],
    [{ faxed_inscription: true }, 'ines_hint_fax'], [{ faxed_letter: true }, 'ines_hint_museum'], [{ saw_disc_list: true }, 'ines_hint_wed_done']],
  3: [[{}, 'ines_hint_carmen_lore'], [{ lore_carmen: true }, 'ines_hint_carmen_lore'], [{ sent_to_colon: true }, 'ines_hint_colon'], [{ inquiry_read: true }, 'ines_hint_tellings'],
    [{ tellings: true }, 'ines_hint_folio'], [{ folio12: true, called_thu: true }, 'ines_hint_suitcase'], [{ gd_thu: true }, 'ines_hint_case'],
    [{ case_thu: true, suitcase_done: true }, 'ines_hint_guard'], [{ derek_sent: true }, 'ines_hint_desk'], [{ caught: true }, 'ines_hint_thu_done']],
  4: [[{}, 'ines_hint_carmen_fri'], [{ cave_explained: true }, 'ines_hint_fri_night']],
  5: [[{}, 'ines_hint_fax_sat'], [{ footprint_seen: true }, 'ines_hint_letter'], [{ letter_read: true, called_sat: true }, 'ines_hint_case2'],
    [{ case_sat: true, fax_read: true }, 'ines_hint_radio'], [{ radio_lolo_got: true }, 'ines_hint_tower'], [{ radio_lie: true }, 'ines_hint_next'],
    [{ next_known: true }, 'ines_hint_isleta_sat'], [{ isleta_flood: true }, 'ines_hint_vasco']],
  6: [[{}, 'ines_hint_general']],
};
const hints = await page.evaluate(DAYS => {
  const out = {};
  for (const [d, steps] of Object.entries(DAYS)) {
    const f = Game.flags; for (const k of Object.keys(f)) if (k !== 'coins') delete f[k];
    f.ch = +d; out[d] = [];
    for (const [add, want] of steps) { Object.assign(f, add); const h = S.hint(); out[d].push([h, want, !!(window.LINES[h] && window.LINES[h][0] === 'ines')]); }
  }
  return out;
}, DAYS);
for (const [d, rows] of Object.entries(hints)) {
  const wrong = rows.map((r, i) => r[0] !== r[1] || !r[2] ? `step ${i}: got ${r[0]}${r[2] ? '' : ' (not an Inês line)'}, wanted ${r[1]}` : null).filter(Boolean);
  ok(`day ${d}: the hints follow the story (${rows.length} steps)`, !wrong.length, wrong.join('; ') || rows.map(r => r[0]).join(' > '));
}

// ---- the phone box
const box = await page.evaluate(async () => {
  const f = Game.flags, heard = window.__heard, out = {};
  const quiet = async () => { for (let i = 0; i < 400 && (Game.isBusy || document.querySelector('#dialog.open')); i++) await new Promise(r => setTimeout(r, 50)); };
  for (const k of Object.keys(f)) delete f[k];
  await Game.goRoom('canteras', null, { noEnter: true, instant: true });
  Object.assign(f, { ch: 2 });
  for (const k of ['coins', 'note5000']) if (Game.has(k)) Game.takeItem(k);
  heard.splice(0); await S.phoneBox(); out.nocoins = heard.splice(0);
  S.give('note5000', true); await S.phoneBox(); out.note = heard.splice(0); Game.takeItem('note5000');
  // Thursday: the call that's due plays first (and takes a coin); then "What now?" speaks the hint
  Object.assign(f, { ch: 3, coins: 3 }); S.give('coins', true);
  window.__choices = [window.LINES.alan_ask_ines_now[1].replace(/\[[^\]]*\]\s*/g, '').slice(0, 12)];
  await Game.busy(() => S.phoneBox()); await quiet();
  out.thu = heard.splice(0); out.thuFlag = !!f.called_thu; out.coins = f.coins; out.thuHint = S.hint();
  // again: no call due now, Inês's hello, then the hint
  window.__choices = [window.LINES.alan_ask_ines_now[1].replace(/\[[^\]]*\]\s*/g, '').slice(0, 12)];
  await Game.busy(() => S.phoneBox()); await quiet();
  out.again = heard.splice(0); out.coins2 = f.coins;
  f.ch = 6; await S.phoneBox(); out.sun = heard.splice(0);
  return out;
});
ok('no coins: the phone box refuses', box.nocoins.join() === 'alan_phone_nocoins', JSON.stringify(box.nocoins));
ok('only the 5,000 note: the phone box refuses', box.note.join() === 'alan_phone_note', JSON.stringify(box.note));
ok('Thursday\'s call plays when due and takes a coin', box.thuFlag && box.thu[0] === 'ines_hello' && box.thu[1] === 'ines_call_thu_1' && box.coins === 2, box.coins + ' coins; ' + box.thu.slice(0, 4).join(',') + '...');
ok('"What now?" after the call speaks the hint', box.thu.includes('alan_ask_ines_now') && box.thu.includes(box.thuHint) && box.thu[box.thu.length - 1] === 'ines_bye', box.thuHint + ' in ' + box.thu.slice(-5).join(','));
ok('no call due: Inês\'s hello, then the hint', box.again[0] === 'ines_hello' && box.again.includes(box.thuHint) && box.coins2 === 1, box.again.join(',') + '; coins ' + box.coins2);
ok('Sunday: no time to call', box.sun.join() === 'alan_phone_no_time', JSON.stringify(box.sun));

// ---- the notebook: "What Inês would say" for Alan, not for Vasco
const nb = await page.evaluate(async () => {
  const f = Game.flags, out = {};
  const cu = Game.closeup; let pages = null; Game.closeup = async p => { pages = p; };
  for (const k of Object.keys(f)) delete f[k];
  Object.assign(f, { ch: 2, saw_helmet: true });
  const want = window.LINES[S.hint()][1].replace(/\[[^\]]*\]\s*/g, '');
  await S.readNotebook(); const lastA = pages[pages.length - 1].html;
  out.alan = /What Inês would say/.test(lastA) && lastA.includes(want.slice(0, 30)); out.alanHint = S.hint();
  Object.assign(f, { ch: 5, isleta_flood: true }); S.becomeVasco();
  await S.readNotebook(); out.vasco = !pages.some(p => /What Inês would say/.test(p.html)); S.becomeAlan();
  Game.closeup = cu;
  return out;
});
ok('the notebook ends on "What Inês would say" (the hint)', nb.alan, JSON.stringify(nb));
ok('as Vasco the notebook has no Inês page', nb.vasco, JSON.stringify(nb));
ok('no page errors', !errs.length, errs.join(' | '));
await Promise.race([browser.close(), new Promise(r => setTimeout(r, 5000))]); process.exit(bad ? 1 : 0);
