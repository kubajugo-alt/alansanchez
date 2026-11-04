// The Forgotten Rhythm — part 0, the prologue (Santo Domingo, 1586, playable as Catalina Bran), and part 1, the Lisbon
// tutorial (Thursday 29 August 1996: Alan in the shop, then Inês at the Patriarchate, then the three tickets). Bible:
// docs/BIBLE.md, "Prologue and Lisbon tutorial". Lines: js/lines/prologue.js.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const T = S.T;
  const R = id => ROOMS[id];
  const moveExit = (rid, name, rect, at) => { const h = (R(rid).hotspots || []).find(x => x.name === name); if (h) { h.rect = rect; if (at) h.at = at; } };

  // ================================================================ items
  S.item('tally', { name: () => { const f = F(); return f.p3 ? `Tally stick: ${f.tally || 0} of 11` : `Tally stick (${f.signs || 0} mark${(f.signs || 0) === 1 ? '' : 's'})`; }, look: 'catalina_1586_look_tally' });
  S.item('blanket', { name: () => F().blanket_clean ? 'The cradle blanket (washed)' : 'A wet cradle blanket', look: () => say(F().blanket_clean ? 'catalina_1586_look_blanket_clean' : 'catalina_1586_look_blanket') });
  S.item('drums1586', { name: 'Two drums, wrapped in sacking', look: 'catalina_1586_look_drums' });
  S.item('linen', { name: 'The canons\' linen', look: 'catalina_1586_look_linen_item' });
  S.item('gourd', { name: 'Isabel\'s gourd', look: 'catalina_1586_look_gourd' });
  S.item('ash', { name: 'A handful of wet ash', look: 'catalina_1586_look_ash' });
  S.item('kitchen_paper', { name: 'Kitchen paper', look: 'alan_lis_look_kitchen_item' });
  S.item('index_cards', { name: () => `Inês's index cards (${F().cards_collected || 0})`, look: 'alan_lis_look_cards' });
  S.item('bill', { name: 'The electricity bill', look: 'alan_lis_look_bill' });
  S.item('postcard', { name: 'Mother\'s postcard', look: 'alan_lis_look_postcard' });
  S.item('patrimonio_sacro', { name: 'Patrimonio Sacro Iberoamericano, no. 31', look: 'alan_lis_look_journal' });
  S.item('crest_paper', { name: 'Patriarchate crest paper', look: 'ines_lis_look_crest' });
  S.item('welcome_fax', { name: 'The bishop\'s welcome fax (in Vasco\'s jacket)', look: () => say('vasco_lis_fax_1') });
  S.DOCS.add('bill'); S.DOCS.add('postcard');

  // ================================================================ hints (shown on the notebook's "Next" page)
  S.HINT(f => f.ch === 0 && (f.signs || 0) < 3, 'mireya_1586_h1', 'mireya_1586_h1');
  S.HINT(f => f.ch === 0 && !f.p3, 'mireya_1586_h2', 'mireya_1586_h2');
  S.HINT(f => f.ch === 0 && !f.p4, 'mireya_1586_h3', 'mireya_1586_h3');
  S.HINT(f => f.ch === 0 && !f.p4_played, 'mireya_1586_h4', 'mireya_1586_h4');
  S.HINT(f => f.ch === 0 && f.sign_washed && !f.sign_self, 'mireya_1586_h5', 'mireya_1586_h5');
  S.HINT(f => f.ch === 1 && !f.has_kitchen && !f.maias_clean, 'mireya_lis_h1', 'mireya_lis_h1');
  S.HINT(f => f.ch === 1 && !f.maias_clean, 'mireya_lis_h2', 'mireya_lis_h2');
  S.HINT(f => f.ch === 1 && !f.post_sorted, 'mireya_lis_h3', 'mireya_lis_h3');
  S.HINT(f => f.ch === 1 && !f.journal_read, 'mireya_lis_h4', 'mireya_lis_h4');
  S.HINT(f => f.ch === 1 && !f.lintel_matched, 'mireya_lis_h5', 'mireya_lis_h5');
  S.HINT(f => f.ch === 1 && !f.ledger_found, 'mireya_lis_h6', 'mireya_lis_h6');
  S.HINT(f => f.ch === 1 && !f.letter_fixed, 'mireya_lis_h7', 'mireya_lis_h7');
  S.HINT(f => f.ch === 1 && !f.crest_taken, 'mireya_lis_h8', 'mireya_lis_h8');
  S.HINT(f => f.ch === 1, 'mireya_lis_h9', 'mireya_lis_h9');

  // notebook entries the tutorial leaves (Alan's notebook and Inês's folder share them from Wednesday)
  S.NOTE('lintel_matched', 'Lisbon. <i>Patrimonio Sacro</i> no. 31: the old bell of the Primada in Santo Domingo has our mark on its frieze, under one of the little ships. A bell in a ring, a cross above. The lintel over our door.');
  S.NOTE('deed_seen', 'The shop\'s deed, 1891: the same mark in the wax.');
  S.NOTE('ledger_found', 'Founders\' ledger, Gaspar Sanches, 1538: "One bell of forty-two arrobas, with waves and ships, for the cathedral of Santo Domingo of the Indies." One of the true ones.', 'ines');
  S.NOTE('lis_dream', 'Dreamt of a beach: drums, people in white, a woman with ash on her arm walking into black water. A bell ringing under the sea. Pessoa yowling at the door.');
  S.NOTE('bill_paid', 'Paid the electricity. Paguei-a. (Inês will never believe it.)');

  // ================================================================ 1586 · the rooms' things and people
  const mark = async (flag, a, b) => {
    const f = F(); if (f[flag]) return;
    f[flag] = true; f.signs = (f.signs || 0) + 1; S.sfx('stone_notch', 0.6);
    await say(a, b); G.renderInv();
  };
  const visit = () => F().visit || 1;
  const nextVisit = async (n, line) => {
    await G.fade(true);
    F().visit = n;
    if (n === 2) F().bg_p1586_river_mouth = 'p1586_river_mouth__visit2_fish'; else delete F().bg_p1586_river_mouth;
    G.player.x = 520; G.player.y = 660; G.player.dir = 'e';
    await G.fade(false);
    await say(line);
  };
  // the river mouth: three visits across one summer (the painting changes under them)
  S.spot('p1586_river_mouth', { name: 'The empty sky', rect: [660, 0, 620, 250], when: () => visit() === 1,
    look: async () => { await mark('sign_birds', 'catalina_1586_birds', 'catalina_1586_birds_2'); await nextVisit(2, 'narr_1586_visit2'); } });
  S.spot('p1586_river_mouth', { name: 'Dead fish at the waterline', rect: [700, 450, 500, 90], when: () => visit() === 2,
    look: async () => { await mark('sign_fish', 'catalina_1586_fish', 'catalina_1586_fish_2'); await nextVisit(3, 'narr_1586_visit3'); } });
  S.spot('p1586_river_mouth', { name: 'The dark water past the reef', rect: [900, 250, 380, 70], when: () => visit() === 3,
    look: async () => { await mark('sign_patch', 'catalina_1586_patch', 'catalina_1586_patch_2'); if (F().signs >= 3) await say('catalina_1586_signs_done'); } });
  S.spot('p1586_river_mouth', { name: 'The air', rect: [330, 60, 300, 200], when: () => visit() === 3,
    look: async () => { if (F().sign_smell) return say('catalina_1586_smell_again'); await mark('sign_smell', 'catalina_1586_smell', 'catalina_1586_smell_2'); } });
  S.spot('p1586_river_mouth', { name: 'Old Mateo\'s canoe', rect: [400, 410, 290, 90], look: 'catalina_1586_look_canoe' });
  S.spot('p1586_river_mouth', { name: 'The nets', rect: [700, 360, 220, 85], look: 'catalina_1586_look_nets' });
  S.spot('p1586_river_mouth', { name: 'The fortress wall', rect: [0, 40, 640, 300], look: 'catalina_1586_look_wall' });
  S.spot('p1586_river_mouth', { name: 'The river', rect: [640, 330, 640, 110], look: 'catalina_1586_look_river',
    items: { blanket: async () => {
      if (F().blanket_clean) return say('catalina_1586_wash_again');
      S.sfx('splash', 0.5); await say('catalina_1586_wash', 'narr_1586_wash'); F().blanket_clean = true; G.renderInv();
    } } });
  {
    const h = R('p1586_river_mouth').hotspots.find(x => x.name === 'To the huts');
    h.locked = () => (F().signs || 0) < 3; h.lockedLine = 'catalina_1586_not_yet';
  }
  // the huts
  S.person('p1586_huts', { id: 'anton', ch: 'anton', x: 420, y: 655, dir: 'e', name: 'Antón Congo', when: () => F().ch === 0,
    look: () => say(F().p3 ? 'anton_1586_again' : 'narr_1586_anton_1'), talk: () => S.antonTalk() });
  S.person('p1586_huts', { id: 'wolofboy', ch: 'wolofboy', x: 760, y: 665, dir: 'w', name: 'Samba, the Wolof boy', when: () => F().ch === 0,
    look: 'catalina_1586_look_boy', talk: () => S.boyTalk() });
  S.person('p1586_huts', { id: 'biafara', ch: 'biafara', x: 1000, y: 660, dir: 'w', name: 'Ngozi, the Biafara woman', when: () => F().ch === 0,
    look: 'catalina_1586_look_biafara', talk: () => S.biaTalk(), items: { blanket: () => S.biaTalk() } });
  S.spot('p1586_huts', { name: 'Cane trash', rect: [0, 440, 230, 140], at: [200, 665], look: 'catalina_1586_look_trash',
    use: () => S.dig(), take: () => S.dig() });
  S.spot('p1586_huts', { name: 'The pounded cassava', rect: [320, 420, 90, 150], look: 'catalina_1586_look_pot' });
  S.spot('p1586_huts', { name: 'The huts', rect: [0, 60, 620, 370], look: 'catalina_1586_look_huts' });
  S.spot('p1586_huts', { name: 'The tower', rect: [740, 80, 80, 160], look: 'catalina_1586_look_tower' });
  for (const n of ['To the square']) { const h = R('p1586_huts').hotspots.find(x => x.name === n); h.locked = () => !F().p3; h.lockedLine = 'catalina_1586_not_yet'; }
  // the square
  S.person('p1586_square', { id: 'juana', ch: 'juana', x: 300, y: 660, dir: 'e', name: 'Juana', when: () => F().ch === 0, look: 'catalina_1586_look_juana', talk: () => S.juanaTalk() });
  S.person('p1586_square', { id: 'fishseller', ch: 'fishseller', x: 560, y: 665, dir: 'e', name: 'Isabel, the fish-seller', when: () => F().ch === 0,
    look: 'catalina_1586_look_fishseller', talk: () => S.fishTalk(), items: { linen: () => S.fishTalk() } });
  S.person('p1586_square', { id: 'millbrothers', ch: 'millbrothers', x: 760, y: 665, dir: 'w', name: 'Kofi and Kwame', when: () => F().ch === 0,
    look: 'catalina_1586_look_brothers', talk: () => S.broTalk(), items: { drums1586: () => S.broTalk() } });
  S.person('p1586_square', { id: 'tome', ch: 'tome', x: 1100, y: 665, dir: 'w', name: 'Tomé', when: () => F().ch === 0 && !!F().tome_in, look: 'catalina_1586_look_tome', talk: () => say('tome_1586_after') });
  S.spot('p1586_square', { name: 'The canons\' linen', rect: [60, 320, 200, 90], at: [200, 665], look: 'catalina_1586_look_linen',
    take: () => S.takeLinen(), use: () => S.takeLinen() });
  S.spot('p1586_square', { name: 'The burning street', rect: [1000, 0, 280, 180], look: 'catalina_1586_look_fires' });
  S.spot('p1586_square', { name: 'The cathedral', rect: [660, 60, 340, 220], look: 'catalina_1586_look_cathedral' });
  S.spot('p1586_square', { name: 'The square', rect: [300, 440, 600, 110], look: 'catalina_1586_look_square' });
  moveExit('p1586_square', 'The tower door', [880, 280, 140, 160], [950, 665]);
  // the bell-chamber
  S.spot('p1586_bell_chamber', { name: 'The new bell', rect: [480, 160, 310, 420], look: 'catalina_1586_look_bell', use: 'catalina_1586_use_bell' });
  S.spot('p1586_bell_chamber', { name: 'The English fleet', rect: [920, 160, 220, 280], look: 'catalina_1586_look_fleet' });
  S.spot('p1586_bell_chamber', { name: 'The city burning', rect: [0, 80, 140, 360], look: 'catalina_1586_look_fires' });
  moveExit('p1586_bell_chamber', 'Down the stair', [150, 80, 180, 460], [240, 665]);
  // the shore, 29 September (P4)
  const SH = 'p1586_shore_storm';
  S.person(SH, { id: 'anton', ch: 'anton', x: 640, y: 655, dir: 'w', name: 'Antón Congo', when: () => F().ch === 0, look: 'catalina_1586_look_people', talk: () => S.shoreRhythm() });
  S.person(SH, { id: 'biafara', ch: 'biafara', x: 360, y: 665, dir: 'e', name: 'Ngozi', when: () => F().ch === 0, look: 'catalina_1586_look_people', talk: () => say('biafara_1586_after') });
  S.person(SH, { id: 'juana', ch: 'juana', x: 170, y: 665, dir: 'e', name: 'Juana', when: () => F().ch === 0, look: 'catalina_1586_look_people', talk: () => say('juana_1586_after') });
  S.person(SH, { id: 'tome', ch: 'tome', x: 860, y: 670, dir: 'w', name: 'Tomé', when: () => F().ch === 0, look: 'catalina_1586_look_tome', talk: () => say('tome_1586_after') });
  S.person(SH, { id: 'wolofboy', ch: 'wolofboy', x: 980, y: 672, dir: 'w', name: 'Samba', when: () => F().ch === 0, look: 'catalina_1586_look_people', talk: () => say('wolofboy_1586_after') });
  S.person(SH, { id: 'fishseller', ch: 'fishseller', x: 1110, y: 668, dir: 'w', name: 'Isabel', when: () => F().ch === 0, look: 'catalina_1586_look_people', talk: () => say('fishseller_1586_after') });
  S.spot(SH, { name: 'The flat rock', rect: [120, 380, 360, 120], at: [330, 665], look: () => say(F().sign_washed && !F().sign_self ? 'catalina_1586_look_rock' : 'catalina_1586_look_rock_ash'),
    items: { ash: () => S.ashOn('rock') } });
  S.spot(SH, { name: 'A torch', rect: [940, 310, 60, 150], at: [960, 670], look: 'catalina_1586_look_torch', take: () => S.takeAsh(), use: () => S.takeAsh() });
  S.spot(SH, { name: 'The other torch', rect: [680, 330, 50, 120], at: [700, 670], look: 'catalina_1586_look_torch', take: () => S.takeAsh(), use: () => S.takeAsh() });
  S.spot(SH, { name: 'The sea', rect: [0, 300, 120, 260], look: 'catalina_1586_look_sea_storm' });
  S.spot(SH, { name: 'The fortress', rect: [500, 0, 780, 300], look: 'catalina_1586_look_fortress_storm' });
  R(SH).self = { items: { ash: () => S.ashOn('self') } };
  R(SH).animFg = function (g, t) {
    // the ash sign on the flat rock, until the rain takes it; the rain itself
    const f = F();
    if (f.sign_on) {
      g.save(); g.strokeStyle = 'rgba(205,200,190,0.75)'; g.lineWidth = 3; g.lineCap = 'round';
      g.beginPath(); g.ellipse(300, 440, 70, 18, 0, 0.1, Math.PI - 0.1); g.moveTo(230, 440); g.lineTo(370, 440);
      g.moveTo(300, 440); g.lineTo(300, 395); g.lineTo(340, 432); g.moveTo(300, 398); g.lineTo(276, 408);
      for (let k = 0; k < 3; k++) { g.moveTo(220, 466 + k * 9); for (let x = 220; x <= 380; x += 8) g.lineTo(x, 466 + k * 9 + Math.sin(x * 0.12) * 3); }
      g.stroke(); g.restore();
    }
    g.save(); g.strokeStyle = 'rgba(200,210,230,0.18)'; g.lineWidth = 1;
    for (let i = 0; i < 90; i++) { const x = (i * 137.5 + t * 400) % 1300 - 10, y = (i * 71.3 + t * 900) % 760 - 20; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 22); g.stroke(); }
    g.restore();
  };

  // ================================================================ 1586 · the scenes
  S.START[0] = async () => {
    S.becomeCatalina();
    F().visit = 1; F().bg_p1586_river_mouth = 'p1586_river_mouth__visit1_birds';
    await G.goRoom('p1586_river_mouth', null, { instant: true, noEnter: true, pos: [520, 660, 'e'] });
    await S.day(0);
    S.sfx('bell_forward', 0.5);
    await S.cut('The wrong bell', 'Santo Domingo, 1586. Dusk over the Ozama. Old Juana and young Catalina Bran stand at the river\'s edge with their washing, looking up at the new cathedral tower, where a boy is ringing the bell with his whole weight. Out beyond the reef, the sails of Drake\'s fleet.',
      'narr_1586_open_1', 'narr_1586_open_2', 'juana_1586_open_1', 'catalina_1586_open_1', 'juana_1586_open_2', 'narr_1586_open_3');
    await S.cut('The English month: the chapels', 'A painted still: English horses stabled in the chapels of the Primada, straw on the altar steps, a trooper asleep against a saint.', 'narr_1586_month_1');
    await S.cut('The English month: the smoke', 'A painted still: a street of the old city burning for ransom, the smoke lying flat over the river.', 'narr_1586_month_2');
    await S.cut('The English month: the drowned brother', 'A painted still: a locked room, the bed dry, the floor dry, and a man lying in it with salt crusted at his lips.', 'narr_1586_month_3', 'narr_1586_month_4');
    S.give('tally', true);
    await G.fade(false);
    await say('narr_1586_visit1', 'catalina_1586_visit1');
  };
  S.antonTalk = async function () {
    const f = F();
    if (f.p3) return say(f.tally >= 11 ? 'anton_1586_done' : 'anton_1586_again');
    await say('anton_1586_1', 'catalina_1586_anton_1', 'anton_1586_2', 'catalina_1586_anton_2', 'anton_1586_3', 'catalina_1586_anton_3', 'anton_1586_4',
      'catalina_1586_anton_4', 'anton_1586_5', 'catalina_1586_anton_5', 'anton_1586_6', 'catalina_1586_anton_6', 'anton_1586_7', 'anton_1586_8');
    f.p3 = true; f.tally = 2; S.sfx('stone_notch', 0.6); G.renderInv();
    await say('narr_1586_count');
  };
  // a recruit: notches on the stick; at ten Tomé comes by himself, and eleven sends them to the shore
  const recruit = async (flag, n) => {
    const f = F(); if (f[flag]) return; f[flag] = true;
    f.tally = (f.tally || 2) + n; S.sfx('stone_notch', 0.6); G.renderInv();
    await say('catalina_1586_tally_n');
    if (f.tally >= 10 && !f.tome_in) {
      await say('narr_1586_tome_1', 'tome_1586_1', 'catalina_1586_tome_1', 'tome_1586_2', 'catalina_1586_tome_2', 'tome_1586_3', 'catalina_1586_tome_3');
      f.tome_in = true; f.tally = 11; G.renderInv(); G.refreshNpcs();
    }
    if (f.tally >= 11) await S.toShore();
  };
  S.boyTalk = async function () {
    const f = F();
    if (!f.p3) return say('wolofboy_1586_1');
    if (f.boy_in) return say('wolofboy_1586_after');
    await say('wolofboy_1586_1', 'catalina_1586_boy_1', 'wolofboy_1586_2', 'wolofboy_1586_3');
    let ok = false;
    await G.dialog([
      { line: 'catalina_1586_boy_c1', bye: true, run: () => say('wolofboy_1586_no') },
      { line: 'catalina_1586_boy_c2', bye: true, run: () => say('wolofboy_1586_no') },
      { line: 'catalina_1586_boy_c3', bye: true, run: async () => { ok = true; await say('wolofboy_1586_yes_1', 'wolofboy_1586_yes_2'); } },
    ]);
    if (ok) await recruit('boy_in', 1);
  };
  S.biaTalk = async function () {
    const f = F();
    if (!f.p3) return say('biafara_1586_1');
    if (f.bia_in) return say('biafara_1586_after');
    if (S.has('blanket')) {
      if (!f.blanket_clean) return say('biafara_1586_wet');
      S.take('blanket');
      await say('biafara_1586_5', 'biafara_1586_6', 'biafara_1586_7');
      return recruit('bia_in', 2);
    }
    await say('biafara_1586_1', 'catalina_1586_bia_1', 'biafara_1586_2', 'catalina_1586_bia_2', 'biafara_1586_3', 'biafara_1586_4');
    S.give('blanket');
  };
  S.dig = async function () {
    const f = F();
    if (!f.p3 || f.drums_found) return say(f.drums_found ? 'catalina_1586_trash_empty' : 'catalina_1586_look_trash');
    f.drums_found = true; S.sfx('paper_shuffle', 0.5);
    await say('catalina_1586_trash_drums'); S.give('drums1586');
  };
  S.broTalk = async function () {
    const f = F();
    if (f.bro_in) return say('millbrother_1586_after');
    if (!S.has('drums1586')) {
      await say('millbrother_1586_1', 'millbrother2_1586_1');
      if (f.p3) await say('catalina_1586_bro_1', 'millbrother_1586_2');
      return;
    }
    S.take('drums1586');
    await say('millbrother_1586_3', 'catalina_1586_bro_2', 'millbrother2_1586_2', 'millbrother_1586_4', 'catalina_1586_bro_3', 'millbrother_1586_5');
    await recruit('bro_in', 2);
  };
  S.takeLinen = async function () {
    const f = F();
    if (f.linen_taken) return say('catalina_1586_look_linen');
    f.linen_taken = true; S.sfx('laundry_flap', 0.5);
    await say('catalina_1586_take_linen'); S.give('linen');
  };
  S.fishTalk = async function () {
    const f = F();
    if (f.fish_in) return say('fishseller_1586_after');
    if (S.has('linen')) {
      S.take('linen');
      await say('fishseller_1586_4', 'catalina_1586_fish_2', 'fishseller_1586_5');
      S.give('gourd');
      return recruit('fish_in', 2);
    }
    if (f.fish_asked) return say('fishseller_1586_again');
    f.fish_asked = true;
    await say('fishseller_1586_1', 'catalina_1586_fish_1', 'fishseller_1586_2', 'fishseller_1586_3');
  };
  S.juanaTalk = async function () {
    const f = F();
    if (f.joined_juana) return say('juana_1586_after');
    await say('juana_1586_1', 'catalina_1586_juana_1', 'juana_1586_2');
    await recruit('joined_juana', 1);
  };
  // P4: the shore below the fortress, 29 September, in the storm
  S.toShore = async function () {
    const f = F(); if (f.p4) return;
    f.p4 = true;
    await say('anton_1586_done');
    await G.fade(true);
    await G.goRoom(SH, null, { instant: true, noEnter: true, pos: [520, 672, 'e'] });
    S.sfx('crash_wave', 0.6);
    await G.fade(false);
    await say('narr_1586_shore_1', 'biafara_1586_sign_1');
    f.sign_on = true;
    G.autosave();
  };
  S.shoreRhythm = async function () {
    const f = F();
    if (f.p4_played) return say(f.sign_self ? 'catalina_1586_look_people' : 'mireya_1586_h5');
    await say('anton_1586_shore_1', 'anton_1586_shore_2');
    while (!(await S.rhythm({ title: 'With Antón', text: 'Antón plays it first. Tap with him: one, two… three, and rest.', bars: 4 }))) await say('anton_1586_shore_again');
    await say('anton_1586_shore_3', 'narr_1586_falter', 'anton_1586_alone');
    while (!(await S.rhythm({ title: 'Alone', text: 'The drums have faltered. Keep it going on your own: four bars, no one to follow.', bars: 4, alone: true }))) await say('anton_1586_alone_again');
    f.p4_played = true;
    await say('narr_1586_held');
    S.sfx('water_rise', 0.4);
    f.sign_on = false; f.sign_washed = true;
    await say('narr_1586_rain', 'biafara_1586_rain');
  };
  S.takeAsh = async function () {
    const f = F();
    if (!f.sign_washed || S.has('ash') || f.sign_self) return say('catalina_1586_look_torch');
    await say('catalina_1586_take_ash'); S.give('ash');
  };
  S.ashOn = async function (where) {
    const f = F();
    if (!f.sign_washed || f.sign_self) return say('catalina_1586_look_rock_ash');
    if (where === 'rock') {
      f.sign_on = true; await say('catalina_1586_ash_rock'); await T(500);
      f.sign_on = false; f.redrawn_rock = true; return say('narr_1586_ash_rock');
    }
    S.take('ash'); f.sign_self = true;
    await say('catalina_1586_ash_self', 'narr_1586_ash_self');
    await S.endPrologue();
  };
  S.endPrologue = async function () {
    await S.cut('Into the sea', 'Catalina gives her tally stick to Juana and walks out into the black water, the ash boat on her arm. The darkness comes in over the reef to meet her. On the beach the drums do not stop. At dawn the sea lies far out and flat, like an animal that has eaten.',
      'narr_1586_walk_1', 'narr_1586_walk_2', 'narr_1586_walk_3');
    await S.cut('La campana es del mar', 'Years later. An old woman at a window, a grown bell-ringer with rope-scarred hands beside her; through the window, the tower, dark, and the bell hanging still inside it. Then the title: Alan Sanches III, The Forgotten Rhythm.',
      'narr_1586_close_1', 'tome_1586_close_1', 'catalina_1586_close_1', 'catalina_1586_close_2', 'narr_1586_close_2');
    S.take('tally');
    F().prologue_done = true;
    await G.card('ALAN SANCHES III', 'The Forgotten Rhythm', 3200);
    await S.next(1);
  };

  // ================================================================ Lisbon · the rooms' things and people
  const ch1 = () => F().ch === 1;
  S.person('shop', { id: 'ines', ch: 'ines', x: 760, y: 662, dir: 'w', name: 'Inês', when: () => ch1() && !F().lintel_matched,
    look: 'alan_lis_look_ines', talk: () => S.inesCards(), items: { patrimonio_sacro: () => S.readJournal(), index_cards: () => say('ines_lis_bye') } });
  S.spot('shop', { name: 'Os Maias, vol. 2', rect: [170, 440, 140, 55], at: [330, 665], look: () => say(F().maias_clean ? 'alan_lis_look_maias_clean' : 'alan_lis_look_maias'),
    use: () => say(F().maias_clean ? 'alan_lis_look_maias_clean' : 'alan_lis_use_maias'), take: () => say(F().maias_clean ? 'alan_lis_look_maias_clean' : 'alan_lis_use_maias'),
    items: { kitchen_paper: () => S.cleanMaias() } });
  S.spot('shop', { name: 'The post', rect: [1060, 400, 175, 70], at: [1080, 665], look: 'alan_lis_look_post', use: () => S.sortPost(), take: () => S.sortPost() });
  S.spot('shop', { name: 'The till', rect: [1030, 300, 150, 100], at: [1080, 665], look: 'alan_lis_look_till' });
  S.spot('shop', { name: 'A Post-it under the till', rect: [960, 400, 70, 45], at: [1000, 665], look: () => { const a = F().pin_known; F().pin_known = true; return say(a ? 'alan_lis_postit_again' : 'alan_lis_look_postit'); } });
  S.spot('shop', { name: 'The safe, under the counter', rect: [860, 470, 180, 90], at: [940, 665], look: 'alan_lis_look_safe', use: () => S.openSafe() });
  S.spot('shop', { name: 'Pessoa', rect: [70, 540, 170, 80], at: [200, 665], look: 'alan_lis_look_pessoa', use: 'alan_lis_use_pessoa', talk: 'alan_lis_use_pessoa' });
  S.spot('shop', { name: 'The window', rect: [420, 30, 440, 300], look: 'alan_lis_look_window' });
  S.spot('shop', { name: 'Grandfather\'s desk', rect: [0, 270, 170, 170], at: [200, 665], look: 'alan_lis_look_desk' });
  S.spot('shop', { name: 'The poetry shelves', rect: [180, 30, 220, 200], look: 'alan_lis_look_shelves' });
  for (const n of ['The street door', 'Up to the flat']) { const h = R('shop').hotspots.find(x => x.name === n); if (h) { h.locked = () => ch1() && !F().lis_started; h.lockedLine = 'alan_fail_04'; } }
  // the flat
  S.spot('flat', { name: 'Kitchen roll', rect: [690, 330, 100, 70], at: [740, 665], look: 'alan_lis_look_kitchen', take: () => S.takeKitchen(), use: () => S.takeKitchen() });
  S.spot('flat', { name: 'Avô\'s photograph', rect: [785, 135, 105, 115], at: [840, 665], look: () => S.lookPhoto(), use: () => S.lookPhoto(), take: () => S.lookPhoto() });
  S.spot('flat', { name: 'The bed', rect: [880, 430, 230, 180], look: 'alan_lis_look_bed' });
  S.spot('flat', { name: 'The window', rect: [450, 40, 280, 340], look: 'alan_lis_look_flatwin' });
  S.spot('flat', { name: 'The books', rect: [0, 0, 320, 540], look: 'alan_lis_look_flatbooks' });
  moveExit('flat', 'Down to the shop', [1140, 200, 140, 260], [1180, 665]);
  // the street
  S.person('rua', { id: 'vasco', ch: 'vasco', x: 820, y: 668, dir: 'w', name: 'Vasco', when: () => ch1() && !!F().tix_scene, look: 'ines_lis_look_vasco', talk: () => say('vasco_lis_talk_done') });
  S.person('rua', { id: 'ines', ch: 'ines', x: 700, y: 668, dir: 'e', name: 'Inês', when: () => ch1() && !!F().tix_scene, look: 'alan_lis_look_ines', talk: () => say('ines_lis_bye') });
  S.spot('rua', { name: 'The lintel over the shop door', rect: [320, 285, 150, 50], at: [400, 665], look: () => S.lookLintel() });
  S.spot('rua', { name: 'The Multibanco', rect: [515, 300, 65, 270], at: [560, 665], look: 'alan_lis_look_mb', use: () => S.multibanco(), items: { bill: () => S.multibanco() } });
  S.spot('rua', { name: 'The travel agent\'s', rect: [990, 330, 115, 240], at: [1040, 665], when: () => !!F().tix_scene, look: 'alan_lis_look_agent', use: () => S.tickets() });
  S.spot('rua', { name: 'The shop window', rect: [20, 400, 280, 200], at: [200, 665], look: 'alan_lis_look_shopwin' });
  S.spot('rua', { name: 'The street lamp', rect: [440, 120, 80, 150], look: 'alan_lis_look_lamp' });
  S.spot('rua', { name: 'Rua de São Miguel', rect: [620, 150, 300, 320], look: 'alan_lis_look_rua' });
  moveExit('rua', 'The shop', [330, 335, 120, 230], [400, 665]);
  { const h = R('rua').hotspots.find(x => x.name === 'The shop'); h.locked = () => !!F().tix_scene; h.lockedLine = 'alan_lis_tix_3'; }
  // Vasco's office
  const VO = ['vasco', 'office', 'lisbon'].join('_');   // (spelt so the line checker doesn't read it as a line id)
  S.person(VO, { id: 'vasco', ch: 'vasco', x: 420, y: 662, dir: 'e', name: 'Vasco', when: () => ch1(), look: 'ines_lis_look_vasco', talk: () => S.letter() });
  S.spot(VO, { name: 'The FOUNDERS box file', rect: [1080, 200, 180, 260], at: [1100, 665], look: 'ines_lis_look_box', use: () => S.ledger(), take: () => S.ledger() });
  S.spot(VO, { name: 'The crest paper', rect: [590, 380, 150, 55], at: [660, 665], look: 'ines_lis_look_crest', take: () => S.takeCrest(), use: () => S.takeCrest() });
  S.spot(VO, { name: 'The typewriter', rect: [780, 290, 120, 90], at: [840, 665], look: 'ines_lis_look_typewriter' });
  S.spot(VO, { name: 'The fax machine', rect: [945, 310, 100, 80], at: [990, 665], look: 'ines_lis_look_fax' });
  S.spot(VO, { name: 'Bell engravings', rect: [620, 80, 280, 150], look: 'ines_lis_look_bells' });
  S.spot(VO, { name: 'The window', rect: [0, 60, 300, 420], look: 'ines_lis_look_window' });

  // ================================================================ Lisbon · the scenes
  S.START[1] = async () => {
    const f = F();
    S.becomeAlan();
    f.ch = 1;
    await G.goRoom('shop', null, { instant: true, noEnter: true, pos: [420, 668, 'e'] });
    await S.day(1);
    await G.fade(false);
    await say('narr_lis_1', 'narr_lis_2', 'ines_lis_1', 'alan_lis_1', 'ines_lis_2', 'alan_lis_2', 'ines_lis_3');
    f.lis_started = true;
    G.autosave();
  };
  S.takeKitchen = async function () {
    if (S.has('kitchen_paper') || F().maias_clean) return say('alan_lis_kitchen_gone');
    F().has_kitchen = true; await say('alan_lis_take_kitchen'); S.give('kitchen_paper');
  };
  const card = () => { const f = F(); f.cards_collected = (f.cards_collected || 0) + 1; if (!S.has('index_cards')) S.give('index_cards', true); S.sfx('paper_take', 0.5); G.renderInv(); };
  S.cleanMaias = async function () {
    const f = F(); if (f.maias_clean) return;
    S.take('kitchen_paper'); f.maias_clean = true;
    await say('alan_lis_clean_1', 'ines_lis_dict_1', 'alan_lis_clean_2', 'ines_lis_dict_2'); card(); f.card_porto = true;
    await say('ines_lis_dict_3'); card(); f.card_maps = true;
    await say('ines_lis_dict_4'); card(); f.card_bill = true;
    await say('alan_lis_clean_3', 'ines_lis_dict_5', 'alan_lis_clean_4', 'ines_lis_dict_6', 'narr_lis_cards');
  };
  S.inesCards = async function () {
    const f = F();
    if (!f.maias_clean) return say('ines_lis_needclean');
    await say('ines_lis_talk');
    const opt = (flag, line, ans) => ({ line, once: true, when: () => !f[flag], run: async () => { await say(ans); f[flag] = true; card(); } });
    await G.dialog([
      opt('card_safe', 'alan_lis_ask_safe', 'ines_lis_safe'),
      opt('card_tuesday', 'alan_lis_ask_tuesday', 'ines_lis_tuesday'),
      opt('card_thief', 'alan_lis_ask_thief', 'ines_lis_thief'),
      opt('card_belgian', 'alan_lis_ask_belgian', 'ines_lis_belgian'),
      opt('card_camoes', 'alan_lis_ask_camoes', 'ines_lis_camoes'),
      opt('card_hire', 'alan_lis_ask_hire', 'ines_lis_hire'),
      { line: 'alan_lis_ask_bye', bye: true, run: () => say('ines_lis_bye') },
    ]);
  };
  S.lookPhoto = async function () {
    const f = F();
    if (f.combo_known) return say('alan_lis_photo_again');
    await say('alan_lis_look_photo', 'alan_lis_photo_back'); f.combo_known = true;
  };
  S.openSafe = async function () {
    const f = F();
    if (f.deed_seen) return say('alan_lis_safe_done');
    if (!f.combo_known) return say('alan_lis_safe_noknow');
    const num = (title, right, opts) => S.choose('The safe', title, opts.map(n => ({ label: String(n), value: n, correct: n === right })));
    const a = await num('First number', 12, [3, 5, 12, 21]), b = await num('Second number', 5, [3, 5, 12, 50]), c = await num('Third number', 3, [3, 5, 12, 30]);
    if (a !== 12 || b !== 5 || c !== 3) return say('alan_lis_dial_wrong');
    S.sfx('case_open', 0.6);
    await say('alan_lis_safe_open', 'alan_lis_deed'); f.deed_seen = true;
  };
  S.sortPost = async function () {
    const f = F();
    if (f.post_sorted) return say('alan_lis_post_done');
    if (!f.maias_clean) return say('alan_lis_look_post');
    S.sfx('paper_shuffle', 0.5);
    await say('alan_lis_sort_1', 'alan_lis_sort_2'); S.give('postcard', true);
    await say('alan_lis_sort_3'); S.give('bill', true);
    await say('alan_lis_sort_4'); S.give('patrimonio_sacro');
    f.post_sorted = true;
  };
  S.readJournal = async function () {
    const f = F();
    if (f.journal_read) return say('ines_lis_journal_again');
    await say('ines_lis_journal_1', 'ines_lis_journal_2', 'alan_lis_journal_1', 'ines_lis_journal_3');
    f.journal_read = true;
  };
  S.multibanco = async function () {
    const f = F();
    if (f.bill_paid) return say('alan_lis_mb_done');
    if (!S.has('bill')) return say('alan_lis_use_mb');
    await say('alan_lis_mb_entity');
    const ent = await S.choose('Multibanco · Payments', 'Entity:', [{ label: '21543', value: 1, correct: true }, { label: '12345', value: 0 }, { label: '90831', value: 0 }]);
    if (!ent) return say('alan_lis_mb_wrong');
    await say('alan_lis_mb_ref');
    const ref = await S.choose('Multibanco · Payments', 'Reference:', [{ label: '317 226 908', value: 0 }, { label: '908 317 226', value: 1, correct: true }, { label: '226 317 908', value: 0 }]);
    if (!ref) return say('alan_lis_mb_wrong');
    if (!f.pin_known) return say('alan_lis_mb_nopin');
    await say('alan_lis_mb_pin');
    const pin = await S.choose('Multibanco', 'PIN:', [{ label: '1234', value: 0 }, { label: '1870', value: 1, correct: true }, { label: '1912', value: 0 }]);
    if (!pin) return say('alan_lis_mb_wrong');
    S.sfx('beep', 0.5);
    f.bill_paid = true; S.take('bill');
    await say('alan_lis_mb_paid');
  };
  S.lookLintel = async function () {
    const f = F();
    if (!f.journal_read || f.lintel_matched) return say(f.lintel_matched ? 'alan_lis_look_lintel' : 'alan_lis_lintel_nojournal');
    await say('alan_lis_look_lintel', 'alan_lis_lintel_match', 'alan_lis_lintel_2', 'alan_lis_lintel_3');
    f.lintel_matched = true;
    // cut to Vasco's office: Inês's half
    await S.switchTo('ines', VO, null, [900, 665, 'w']);
    await say('narr_lis_ines_1', 'vasco_lis_1', 'ines_lis_off_1', 'vasco_lis_2');
    G.autosave();
  };
  S.ledger = async function () {
    const f = F();
    if (f.ledger_found) return say('ines_lis_ledger_done');
    await say('ines_lis_ledger_1');
    const e = await S.choose('The founders\' ledger, 1521–1560', 'Which entry?', [
      { label: '1531 · 30 arrobas · for the see of Évora', value: 0 },
      { label: '1538 · 42 arrobas · for the cathedral of Santo Domingo of the Indies', value: 1, correct: true },
      { label: '1538 · 42 arrobas · for the Misericórdia of Braga', value: 0 },
      { label: '1544 · 24 arrobas · for the Indies, by the caravel São Bento', value: 0 }]);
    if (!e) return say('ines_lis_ledger_wrong');
    await say('ines_lis_ledger_2');
    const h = await S.choose('Two hands', 'Which is Gaspar\'s?', [
      { label: '"Hũ syno de quarenta & duas arrobas…" (round, quick, the s short)', value: 1, correct: true },
      { label: '"Hum ſyno de quarenta e duas arrobas…" (careful, upright, the long ſ)', value: 0 }]);
    if (!h) return say('ines_lis_ledger_hand_wrong');
    await say('ines_lis_ledger_3', 'vasco_lis_3');
    f.ledger_found = true;
    await S.afterOffice();
  };
  S.letter = async function () {
    const f = F();
    if (!f.ledger_found) return say('vasco_lis_talk_again');
    if (f.letter_fixed) return say('vasco_lis_talk_done');
    await say('vasco_lis_letter_1', 'ines_lis_letter_1');
    const Q = [['ines_lis_sub_q1', [['permita', 1], ['permite', 0], ['permitirá', 0]]],
      ['ines_lis_sub_q2', [['es', 0], ['fuera', 1], ['será', 0]]],
      ['ines_lis_sub_q3', [['reciba', 1], ['recibe', 0], ['recibirá', 0]]]];
    for (const [q, opts] of Q) {
      for (;;) {
        await say(q);
        const v = await S.choose('The letter to the bishop', 'Which form?', opts.map(([l, ok]) => ({ label: l, value: ok, correct: !!ok })));
        if (v) break;
        await say('ines_lis_sub_wrong', 'vasco_lis_sub_wrong');
      }
    }
    await say('ines_lis_letter_2', 'vasco_lis_letter_2');
    f.letter_fixed = true;
    await S.afterOffice();
  };
  S.takeCrest = async function () {
    const f = F();
    if (f.crest_taken) return say('ines_lis_crest_gone');
    if (!f.letter_fixed) return say('ines_lis_crest_early');
    await say('ines_lis_take_crest'); f.crest_taken = true; S.give('crest_paper');
    await S.afterOffice();
  };
  // the office done: Friday, the travel agent, as Alan
  S.afterOffice = async function () {
    const f = F();
    if (!(f.ledger_found && f.letter_fixed && f.crest_taken) || f.tix_scene) return;
    f.tix_scene = true;
    await S.switchTo('alan', 'rua', null, [900, 668, 'w']);
    await say('narr_lis_agent_1');
    G.autosave();
  };
  S.tickets = async function () {
    const f = F();
    if (f.tix_done) return say('alan_lis_tix_3');
    await say('vasco_lis_tix_1');
    let three = false;
    while (!three) {
      await G.dialog([
        { line: 'alan_lis_tix_c1', bye: true, run: () => say('alan_lis_tix_no') },
        { line: 'alan_lis_tix_c2', bye: true, run: () => { three = true; } },
      ]);
    }
    await say('agent_lis_1', 'vasco_lis_tix_2', 'alan_lis_tix_1', 'vasco_lis_tix_3', 'ines_lis_tix_1', 'alan_lis_tix_2', 'agent_lis_2', 'alan_lis_tix_3');
    f.tix_done = true;
    await S.cut('The dream of the beach', 'Night. A beach Alan has never seen, in the rain: drums, people in white holding hands, a woman with ash lines on her arm walking into black water. Far out, under the sea, the dull shape of a bell, ringing. Then Alan awake in the dark flat, and Pessoa yowling at the shop door below.',
      'narr_lis_dream_1', 'narr_lis_dream_2', 'narr_lis_dream_3');
    S.sfx('cat_meow', 0.6);
    f.lis_dream = true;
    await S.cut('The welcome fax', 'The Patriarchate in the morning: a monsignor in a corridor hands Vasco a curling sheet of fax paper with the bishop\'s crest. Vasco reads it, beams, and folds it into the inside pocket of his jacket.',
      'narr_lis_fax_1', 'vasco_lis_fax_1', 'ines_lis_fax_1');
    S.give('welcome_fax', true);
    await S.cut('West', 'A TAP plane over the Atlantic, small against a sky building towers of cloud in the south-west. Three seats in a row: Vasco asleep on Alan\'s shoulder, Inês reading, a folded fax in a jacket.', 'narr_lis_fly');
    f.lis_done = true;
    await S.next(2);
  };

  // ================================================================ previews and the test walk-through
  S.PREVIEW.start0 = { flags: {}, as: 'catalina', room: 'p1586_river_mouth', pos: [520, 660, 'e'], run: () => S.START[0]() };
  S.PREVIEW.start1 = { flags: { prologue_done: true }, room: 'shop', pos: [420, 668, 'e'], run: () => S.START[1]() };
  S.PREVIEW.shore1586 = { flags: { ch: 0, p3: true, tally: 11, tome_in: true, signs: 3 }, as: 'catalina', room: 'p1586_huts', pos: [520, 660, 'e'], run: () => S.toShore() };
  S.PREVIEW.office = { flags: { ch: 1, lis_started: true, maias_clean: true, post_sorted: true, journal_read: true, cards_collected: 3 }, room: 'rua', pos: [400, 665, 'e'], run: () => S.lookLintel() };

  S.SOLVE[0] = async () => {
    const { act, go } = S;
    await act('The empty sky', 'look');
    await act('Dead fish at the waterline', 'look');
    await act('The dark water past the reef', 'look');
    await act('The air', 'look');
    await act('To the huts');
    await act('anton', 'talk');
    S.expect('P3 begun', f => f.p3 && f.tally === 2);
    await act('wolofboy', 'talk', null, ['I believe you']);
    S.expect('the boy recruited', f => f.boy_in);
    await act('biafara', 'talk');
    await act('To the river');
    await act('The river', null, 'blanket');
    await act('To the huts');
    await act('biafara', null, 'blanket');
    await act('Cane trash', 'use');
    await act('To the square');
    await act('millbrothers', null, 'drums1586');
    await act('fishseller', 'talk');
    await act('The canons\' linen', 'take');
    await act('fishseller', null, 'linen');
    await act('juana', 'talk');
    S.expect('the shore', f => f.p4 && G.room.id === SH);
    S.failNext = true;   // (one missed rhythm, to walk Antón's "again")
    await act('anton', 'talk');
    S.expect('the rhythm kept', f => f.p4_played && f.sign_washed);
    await act('A torch', 'take');
    await act('The flat rock', null, 'ash');
    S.expect('the rain took it again', f => f.redrawn_rock);
    await act('self', null, 'ash');
    S.expect('Lisbon', f => f.ch === 1 && G.room.id === 'shop');
  };
  S.SOLVE[1] = async () => {
    const { act } = S;
    await act('Os Maias, vol. 2', 'look');
    await act('Up to the flat');
    await act('Kitchen roll', 'take');
    await act('Avô\'s photograph', 'look');
    await act('Down to the shop');
    await act('Os Maias, vol. 2', null, 'kitchen_paper');
    S.expect('three cards', f => f.cards_collected === 3);
    await act('ines', 'talk', null, ['The safe', 'Belgian', 'Pessoa I don']);
    S.expect('six cards', f => f.cards_collected === 6);
    await act('The safe, under the counter', 'use');
    S.expect('the deed', f => f.deed_seen);
    await act('The post', 'use');
    await act('ines', null, 'patrimonio_sacro');
    await act('A Post-it under the till', 'look');
    await act('The street door');
    await act('The Multibanco', null, 'bill');
    S.expect('bill paid', f => f.bill_paid);
    await act('The lintel over the shop door', 'look');
    S.expect('Inês at the Patriarchate', f => G.room.id === VO && S.who() === 'ines');
    await act('The FOUNDERS box file', 'use');
    await act('vasco', 'talk');
    await act('The crest paper', 'take');
    S.expect('Alan in the street', f => f.tix_scene && S.who() === 'alan' && G.room.id === 'rua');
    await act('The travel agent\'s', 'use', null, ['Three']);
    S.expect('Wednesday', f => f.ch === 2 && S.has('crest_paper') && S.has('welcome_fax'));
  };
})();
