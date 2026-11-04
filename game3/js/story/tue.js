// The Forgotten Rhythm — part 8, Tuesday 10 September (docs/BIBLE.md, "Tuesday 10 — The Keys"): TU1 the custody letter in
// Mireya's kitchen at 04:30 (ML5) and the bluff; TU2 Inês at the foundry (the hidden page: rule 3 completed; the pressure
// scene against Don Faustino's clock); TU3 the reunion in Parque Colón; TU4 the rehang; TU5 the gate; TU6 the bearing on the
// 1890 map (ML1 layer 4). Then the finale on the Playa de las Negras (four phases, none can be lost) and the dawn. Part 9:
// the epilogue (E1 the card at the gate, E1b the last night, E2 the Belgian, E3 1997, E4 the phone call), then the credits.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const T = S.T;
  const ch8 = () => F().ch === 8, ch9 = () => F().ch === 9;
  const def = (id, d) => { if (!S.ITEMS[id]) S.item(id, d); };
  const findSpot = (rid, name) => (ROOMS[rid].hotspots || []).find(h => h.name === name);
  const lockWhile = (rid, name, cond, line) => {
    const h = findSpot(rid, name); if (!h) return;
    const was = h.locked, wasLine = h.lockedLine;
    h.locked = () => cond(F()) || (was ? was() : false);
    h.lockedLine = () => cond(F()) ? line : (typeof wasLine === 'function' ? wasLine() : wasLine);
  };
  const prevLock = S.mapLock;
  S.mapLock = () => {
    const f = F();
    if (f.ch === 8 && !f.tue_shore) return 'alan_tue_drums_first';
    return prevLock ? prevLock() : null;
  };

  // ---------------------------------------------------------------- items
  def('crest_paper', { name: 'Patriarchate crest paper' });
  def('welcome_fax', { name: 'The bishop\'s welcome fax' });
  def('wax_seal', { name: 'The purple wax seal' });
  def('car_keys', { name: 'The bishop\'s car keys' });
  def('tata_notebook', { name: 'Tata\'s notebook' });
  def('compass', { name: 'Vasco\'s compass and protractor' });
  S.item('pane', { name: 'A pane of glass', look: 'alan_tue_look_pane' });
  S.item('custody_letter', { name: () => F().letter_complete ? 'The custody letter' : 'The custody letter (unfinished)', look: 'alan_tue_letter' });
  S.item('chalk', { name: 'White chalk', look: 'yolande_fin_02' });
  window.ICON_LABELS.pane = 'Glass pane';

  // ---------------------------------------------------------------- notes
  S.NOTE('letter_complete', 'Tue, 04:30. A letter from the bishop: his paper (Lisbon\'s), his signature (traced), his seal (his car\'s). Tobías carried it.');
  S.NOTE('hidden_page', 'Tue. Tata\'s last page, lifted by the crate water: "While the bell is in the tower, the debt can be paid little by little. If anyone takes her out…" Out of the tower is enough. She has to go back up today.', 'ines');
  S.NOTE('rehung', 'Tue, 15:45. She is back on her beam. She rang once on her own. The tide went out.');
  S.NOTE('bearing_plotted', 'Tue. 112° from the tower, across the 1890 shoreline: the Playa de las Negras, under the Malecón. There are steps.', 'ines');
  S.NAPKIN.bell.push(['letter_complete', 'Yolande out ✓'], ['hidden_page', 'Foundry ✓ (out is enough!)'], ['rehung', 'THE TOWER ✓']);

  // ---------------------------------------------------------------- hints
  S.HINT(f => f.ch === 8 && !f.letter_ready, 'parrot_tue_01', 'mireya_tue_hint_01');
  S.HINT(f => f.ch === 8 && !f.tu1_done, 'parrot_tue_02', 'mireya_tue_hint_02');
  S.HINT(f => f.ch === 8 && !f.hidden_page, 'parrot_tue_03', 'mireya_tue_hint_03');
  S.HINT(f => f.ch === 8 && !f.tu2_done, 'parrot_tue_04', 'mireya_tue_hint_04');
  S.HINT(f => f.ch === 8 && f.tu3_intro && !f.drums_back && f.rehung, 'parrot_tue_05', 'mireya_tue_hint_05');
  S.HINT(f => f.ch === 8 && !f.rehung, 'parrot_tue_06', 'mireya_tue_hint_06');
  S.HINT(f => f.ch === 8 && !f.drums_back, 'parrot_tue_05', 'mireya_tue_hint_05');
  S.HINT(f => f.ch === 8 && !f.bearing_plotted, 'parrot_tue_07', 'mireya_tue_hint_07');
  S.HINT(f => f.ch === 8 && f.fin === 1, 'parrot_fin_01', 'mireya_fin_hint_01');
  S.HINT(f => f.ch === 8 && f.fin === 2, 'parrot_fin_02', 'mireya_fin_hint_02');
  S.HINT(f => f.ch === 8 && f.fin === 3, 'parrot_fin_03', 'mireya_fin_hint_03');
  S.HINT(f => f.ch === 8 && f.fin >= 4, 'parrot_fin_04', 'mireya_fin_hint_04');
  S.HINT(f => f.ch === 8, 'parrot_tue_06', 'mireya_tue_hint_none');
  S.HINT(f => f.ch === 9 && !f.epi_gate, 'parrot_epi_01', 'mireya_epi_hint_01');
  S.HINT(f => f.ch === 9 && !f.epi_belgian, 'parrot_epi_01', 'mireya_epi_hint_02');
  S.HINT(f => f.ch === 9, 'parrot_epi_01', 'mireya_epi_hint_03');

  // the hub on Tuesday: the parts are walked by the story; the pins stay open for wandering in between
  S.open('parque', f => f.ch === 8 && f.tu2_done);
  S.open('hostal', f => f.ch === 8 && f.tu2_done);
  S.pinNext(f => f.ch === 8 && f.tu2_done && !f.rehung ? 'parque' : null);

  // ================================================================ TU1 — the custody letter (Mireya's kitchen, 04:30)
  const K = 'hostal_kitchen';
  const kitchenNight = () => ch8() && !F().tu1_done;
  lockWhile(K, 'The courtyard', f => f.ch === 8 && !f.tu1_done, 'alan_tue_unfinished');
  S.person(K, { id: 'vasco', ch: 'vasco', x: 860, y: 660, dir: 'w', name: 'Vasco', when: kitchenNight, look: 'alan_tue_look_vasco', talk: () => S.tueWords() });
  S.person(K, { id: 'ines', ch: 'ines', x: 300, y: 670, dir: 'e', name: 'Inês', when: kitchenNight, look: 'alan_tue_look_ines', talk: () => say('ines_tue_01', 'alan_tue_02', 'ines_tue_02') });
  S.person(K, { id: 'tobias', ch: 'tobias', x: 1040, y: 665, dir: 'w', name: 'Tobías', when: () => kitchenNight() && F().letter_ready, look: 'alan_tue_look_tobias', talk: () => S.tueTobias() });
  const letterParts = f => [f.l_paper, f.l_sig, f.l_seal, f.l_words].filter(Boolean).length;
  const table = S.spot(K, { name: 'Kitchen table', rect: [420, 400, 520, 150], at: [640, 660], when: kitchenNight, look: 'alan_tue_look_table',
    use: () => say(letterParts(F()) ? 'alan_tue_look_table' : 'alan_tue_need_paper'),
    items: {
      crest_paper: async () => { const f = F(); if (f.l_paper) return say('alan_tue_paper'); f.l_paper = true; S.take('crest_paper'); S.sfx('paper_take', 0.6); await say('alan_tue_paper', 'vasco_tue_03', 'vasco_tue_04'); },
      welcome_fax: async () => {
        const f = F();
        if (!f.l_paper) return say('alan_tue_need_paper');
        if (!f.l_glow) return say('alan_tue_need_glow');
        f.l_sig = true; S.sfx('pencil_scribble', 0.6); await say('alan_tue_sig', 'ines_tue_03', 'alan_tue_04'); S.tueReady();
      },
      car_keys: async () => {
        const f = F();
        if (!f.l_wax) return say('alan_tue_need_wax');
        f.l_seal = true; await say('alan_tue_seal', 'vasco_tue_05', 'alan_tue_05'); S.tueReady();
      },
      wax_seal: () => say('alan_tue_need_wax'),
    } });
  S.spot(K, { name: 'St Michael candle', rect: [590, 380, 90, 90], at: [620, 660], when: kitchenNight, look: 'alan_tue_look_candle',
    items: {
      pane: async () => { F().l_glow = true; S.take('pane'); S.sfx('glass_set', 0.5); await say('alan_tue_glow'); },
      wax_seal: async () => { F().l_wax = true; S.take('wax_seal'); S.sfx('candle_flutter', 0.5); await say('alan_tue_wax', 'ines_tue_04'); },
      welcome_fax: () => table.items.welcome_fax(),
    } });
  S.spot(K, { name: 'Glass pane in the door', rect: [1110, 200, 80, 220], at: [1100, 660], when: () => kitchenNight() && !F().pane_taken && !S.has('pane'),
    look: 'alan_tue_look_pane', take: () => S.tuePane(), use: () => S.tuePane() });
  S.tuePane = async () => { F().pane_taken = true; S.give('pane'); await say('alan_tue_take_pane'); };
  S.tueReady = () => {};
  // Vasco's wording: three formal phrases (a callback to the Lisbon subjunctives)
  const WORDS = [
    [['By order of His Excellency the Auxiliary Bishop of Santo Domingo,', true], ['Hello, the bishop says that', false], ['To whom it may concern, probably,', false]],
    [['the bearer is to be released into the custody of the Church, pending enquiry,', true], ['please could you let her go if it is no trouble,', false], ['she is a good woman and we would like her back,', false]],
    [['given at Santo Domingo, under our hand and seal, this tenth day of September.', true], ['thanks a lot, see you at Mass.', false], ['signed, the bishop (really).', false]],
  ];
  S.tueWords = async function () {
    const f = F();
    if (f.l_words) return say('vasco_tue_words_done');
    if (!(f.l_paper && f.l_sig && f.l_seal)) return say('vasco_tue_need_first');
    await say('vasco_tue_words_0');
    for (const opts of WORDS) {
      for (;;) {
        const v = await S.choose('The wording', 'Vasco dictates. Pick the phrase a bishop would use.', opts.map(([label, ok]) => ({ label, value: ok, correct: ok })));
        if (v) { await say('vasco_tue_words_ok'); break; }
        await say('vasco_tue_words_no');
      }
    }
    f.l_words = true; f.letter_complete = true; f.letter_ready = true;
    S.give('custody_letter');
    await say('vasco_tue_words_done', 'ines_tue_05');
    G.refreshNpcs();
    await say('narr_tue_03');
  };
  S.tueTobias = async function () {
    const f = F();
    await say('tobias_tue_01', 'alan_tue_06', 'tobias_tue_02');
    await G.dialog([
      { line: 'alan_tue_ask_order', run: () => say('tobias_tue_03') },
      { line: 'alan_tue_ask_tata', bye: true, run: async () => { await say('tobias_tue_04', 'tobias_tue_05'); await S.tueBluff(); } },
      { line: 'alan_tue_bye_tobias', bye: true },
    ]);
  };
  // Tobías is called once the letter has its paper, signature and seal (the wording can be skipped: an unfinished letter)
  const tobiasCall = S.spot(K, { name: 'Call Tobías in', rect: [1190, 430, 90, 200], at: [1100, 660],
    when: () => kitchenNight() && !f8().letter_ready && f8().l_paper && f8().l_sig && f8().l_seal,
    look: 'alan_tue_unfinished',
    use: async () => {
      const v = await S.choose('The letter', 'The wording isn\'t done. Vasco is waiting to dictate it.', [{ label: 'Let Vasco finish the wording first', value: false, correct: true }, { label: 'Send it as it is: there\'s no time', value: true }]);
      if (!v) return say('alan_tue_not_yet');
      await say('alan_tue_send_anyway');
      const f = F(); f.letter_ready = true; f.letter_complete = false; S.give('custody_letter'); G.refreshNpcs(); await say('narr_tue_03');
    } });
  function f8() { return F(); }
  // the bluff at the police station (a cutscene), then the keys to Moncho, then the foundry
  S.tueBluff = async function () {
    const f = F(), full = !!f.letter_complete;
    if (S.has('custody_letter')) S.take('custody_letter');
    const lines = ['narr_tue_04', full ? 'narr_tue_05_full' : 'narr_tue_05_part', 'narr_tue_06', 'batista_tue_01', 'batista_tue_02', 'moncho_tue_01', 'batista_tue_03'];
    if (!full) lines.push('narr_tue_07_late');
    lines.push('yolande_tue_01');
    f.drums_back = !!(f.batista_committed && full);
    if (f.drums_back) lines.push('batista_tue_04');
    lines.push('alan_tue_07', 'moncho_tue_02', 'narr_tue_08');
    await S.cut('The bluff', 'The Immigration desk at five in the morning: a sergeant counting a crest, a signature and a seal under a strip light. Yolande on the stairs. Batista in the doorway with his toothpick. Then the bishop\'s black car going up the hill in the dark, Moncho driving, two voices singing in the back.', ...lines);
    if (S.has('car_keys')) S.take('car_keys');
    f.keys_given = true; f.tu1_done = true; f.yolande_free = true;
    delete f.bg_hostal_kitchen;
    await S.tueForge();
  };

  // ================================================================ TU2 — Inês at the foundry
  const Y = 'foundry_yard', O = 'foundry_office';
  { const d = findSpot(Y, 'The office'); if (d) { d.rect = [1190, 170, 90, 330]; d.at = [1200, 660]; } }
  lockWhile(Y, 'To the city', f => f.ch === 8 && !f.tu2_done, 'ines_tue_need_page');
  const atForge = () => ch8() && F().tu1_done && !F().tu2_done;
  S.tueForge = async function () {
    await S.switchTo('ines', Y, 'default', [260, 670, 'e']);
  };
  S.person(Y, { id: 'faustino', ch: 'faustino', x: 700, y: 665, dir: 'w', name: 'Don Faustino', when: atForge, look: 'ines_tue_look_faustino', talk: () => S.tuePressure() });
  S.person(Y, { id: 'vasco', ch: 'vasco', x: 470, y: 670, dir: 'e', name: 'Vasco', when: atForge, look: 'ines_tue_look_crate', talk: () => say(F().hidden_page ? 'vasco_tue_12' : 'vasco_tue_11') });
  S.spot(Y, { name: 'The new bell', rect: [820, 250, 150, 170], at: [860, 660], when: () => ch8(), look: 'ines_tue_look_bell', use: () => say('ines_tue_look_bell') });
  S.spot(Y, { name: 'The crate', rect: [940, 410, 300, 160], at: [1000, 670], when: () => ch8(), look: 'ines_tue_look_crate', use: () => S.tuePage(), items: { tata_notebook: () => S.tuePage() } });
  S.spot(Y, { name: 'The furnace', rect: [420, 30, 220, 420], at: [520, 660], when: () => ch8(), look: 'ines_tue_look_furnace' });
  S.spot(Y, { name: 'The lorry', rect: [40, 300, 220, 150], at: [160, 660], when: () => ch8(), look: 'ines_tue_look_lorry' });
  S.spot(O, { name: 'The wall clock', rect: [90, 60, 140, 140], at: [200, 660], when: () => ch8(), look: 'ines_tue_look_clock' });
  S.spot(O, { name: 'The telephone', rect: [700, 300, 120, 80], at: [760, 660], when: () => ch8(), look: 'ines_tue_look_phone' });
  S.onEnter(Y, async () => {
    const f = F();
    if (!atForge() || f.tu2_intro) return;
    f.tu2_intro = true; S.pulse(3);
    await say('narr_tue_10', 'ines_tue_10', 'faustino_tue_01', 'ines_tue_11', 'faustino_tue_02');
    await S.cut('The bishop at the foundry', 'The bishop in choir dress, standing in the water of the yard as if it were a carpet. Crowbars on the lid of the crate. The telephone ringing in the office; the Nuncio\'s secretary at the door, damp and immaculate. Then the bishop walking out alone, across the water, toward the bridge.',
      'narr_tue_11', 'bishop_tue_01', 'vasco_tue_10', 'bishop_tue_02', 'narr_tue_12', 'secretary_tue_01', 'secretary_tue_02', 'bishop_tue_03', 'vasco_tue_11', 'narr_tue_13');
  });
  S.tuePage = async function () {
    const f = F();
    if (f.hidden_page) return say('ines_tue_page_2');
    S.sfx('water_seep', 0.6);
    await say('ines_tue_crate_soak', 'ines_tue_page_lift');
    await G.closeup([{ img: 'close:tata_notebook', cls: 'doc-hand', html: '<h3>The last page, lifted</h3><p><i>Mientras la campana esté en la torre, la deuda se puede pagar poco a poco. Si alguien la saca…</i></p><p style="font-size:.85em">(While the bell is in the tower, the debt can be paid little by little. If anyone takes her out…)</p>' }]);
    f.hidden_page = true;
    await say('ines_tue_page_read', 'ines_tue_page_2', 'vasco_tue_12');
  };
  // the pressure scene: eleven minutes on Don Faustino's clock, three arguments, each won with a fact from her documents
  const ARGS = [
    [['ines_tue_arg_1a', true], ['ines_tue_arg_1b', false], ['ines_tue_arg_1c', false], 'faustino_tue_ok_1'],
    [['ines_tue_arg_2a', true], ['ines_tue_arg_2b', false], ['ines_tue_arg_2c', false], 'faustino_tue_ok_2'],
    [['ines_tue_arg_3a', true], ['ines_tue_arg_3b', false], ['ines_tue_arg_3c', false], 'faustino_tue_ok_3'],
  ];
  const strip = id => window.LINES[id][1].replace(/\[[^\]]*\]\s*/g, '');
  S.tuePressure = async function () {
    const f = F();
    if (!f.hidden_page) return say('faustino_tue_03', 'ines_tue_need_page');
    await say('faustino_tue_03', 'ines_tue_12', 'faustino_tue_04');
    let mins = 11;
    G.setClock('11 minutes');
    for (const [a, b, c, ok] of ARGS) {
      for (;;) {
        const pick = await S.choose('Don Faustino', `The wall clock: ${mins} minutes. Which argument?`, [a, b, c].map(([id, good]) => ({ label: strip(id), value: id, correct: good })));
        await say(pick);
        const good = [a, b, c].find(x => x[0] === pick)[1];
        mins -= good ? 2 : 3;
        G.setClock(Math.max(0, mins) + ' minutes');
        if (mins <= 0) break;
        if (good) { await say(ok); break; }
        await say('faustino_tue_shrug');
      }
      if (mins <= 0) break;
    }
    G.setClock(null);
    if (mins <= 0) { f.foundry_late = true; await say('narr_tue_14_late', 'faustino_tue_05_late'); }
    f.tu2_done = true;
    await say('narr_tue_15');
    f.bg_parque_colon = 'parque_colon__wind';
    await S.switchTo('alan', 'parque_colon', 'default', [200, 670, 'e']);
  };

  // ================================================================ TU3–TU5 — Parque Colón in the wind: the reunion, the rehang, the gate
  const P = 'parque_colon';
  const inPark = () => ch8() && F().tu2_done && !F().tue_shore;
  lockWhile(P, 'The cathedral', f => f.ch === 8 && f.tu2_done && !f.rehung, 'alan_tue_look_winch');
  S.person(P, { id: 'moncho', ch: 'moncho', x: 300, y: 675, dir: 'e', name: 'Moncho', when: inPark, look: 'alan_fin_look_moncho', talk: () => say('moncho_tue_20', 'moncho_tue_02') });
  S.person(P, { id: 'vasco', ch: 'vasco', x: 860, y: 670, dir: 'w', name: 'Vasco', when: inPark, look: 'alan_tue_look_vasco', talk: () => say('vasco_tue_20') });
  S.person(P, { id: 'ines', ch: 'ines', x: 960, y: 675, dir: 'w', name: 'Inês', when: inPark, look: 'alan_tue_look_ines', talk: () => say('ines_tue_20') });
  S.person(P, { id: 'tobias', ch: 'tobias', x: 1100, y: 672, dir: 'w', name: 'Tobías', when: inPark, look: 'alan_tue_look_tobias', talk: () => say(F().rehung ? 'tobias_tue_20' : 'tobias_tue_22') });
  S.person(P, { id: 'fello', ch: 'fello', x: 170, y: 690, dir: 'e', name: 'Fello', when: inPark, look: 'alan_fin_look_fello', talk: () => say('fello_tue_20') });
  S.person(P, { id: 'mireya', ch: 'mireya', x: 1200, y: 690, dir: 'w', name: 'Señora Mireya', when: inPark, look: 'alan_fin_look_mireya', talk: () => say('mireya_tue_20') });
  S.spot(P, { name: 'The winch', rect: [360, 520, 170, 110], at: [420, 670], when: inPark, look: 'alan_tue_look_winch', use: () => S.tueRehang() });
  S.spot(P, { name: 'The beam in the west arch', rect: [800, 150, 160, 160], at: [860, 670], when: inPark, look: 'alan_tue_look_beam' });
  S.spot(P, { name: 'The crate on the lorry', rect: [640, 470, 190, 140], at: [700, 670], when: () => inPark() && !F().rehung, look: 'alan_tue_look_crate_p' });
  S.spot(P, { name: 'The palms', rect: [0, 40, 320, 360], at: [200, 670], when: inPark, look: 'alan_tue_look_palms' });
  S.spot(P, { name: 'Police pickup', rect: [1030, 470, 200, 130], at: [1080, 670], when: () => inPark() && !F().drums_back, look: 'alan_tue_look_pickup', use: () => S.tuePickup() });
  S.onEnter(P, async () => {
    const f = F();
    if (!inPark() || f.tu3_intro) return;
    f.tu3_intro = true; S.pulse(4);
    await say('narr_tue_20', 'alan_tue_20', 'vasco_tue_20', 'ines_tue_20', 'moncho_tue_20', 'ines_tue_21', 'moncho_tue_21', 'narr_tue_21', 'bishop_tue_20', 'tobias_tue_20');
    G.autosave();   // (a save point before the rehang)
  });
  S.tuePickup = async function () {
    const f = F();
    if (f.drums_back) return;
    await say('alan_tue_pickup_locked', 'tobias_tue_21');
    S.sfx('key_jingle', 0.6);
    await say('narr_tue_22');
    f.drums_back = true;
    if (f.tu5_done) await S.tueBearing();
  };
  // the crew: five jobs; a wrong placement shows trouble and the job is asked again
  S.tueRehang = async function () {
    const f = F();
    if (f.rehung) return say('alan_tue_look_winch');
    await say('tobias_tue_22');
    const gateOk = f.batista_committed ? ['Sargento Batista', 'Señora Mireya'] : ['Señora Mireya'];
    const door = f.tobias_saved ? 'Tobías, with his keys' : 'Lalo';
    const JOBS = [
      ['The winch', ['Moncho, the two boys and me', 'The perm sisters', 'Vasco'], ['Moncho, the two boys and me'], 'alan_tue_job_bad_winch', null],
      ['The guide ropes in the arch', ['The four foundry men', 'Fello', 'Lalo'], ['The four foundry men'], 'alan_tue_job_bad_ropes', null],
      ['The cloister gate', (f.batista_committed ? ['Sargento Batista'] : []).concat(['Señora Mireya', 'The perm sisters', 'Yunior']), gateOk, 'alan_tue_job_bad_gate', v => say(v === 'Sargento Batista' ? 'batista_tue_20' : 'mireya_tue_20')],
      ['The tower stair door', ['Tobías, with his keys', 'Lalo', 'Vasco'], [door], 'alan_tue_job_bad_door', v => say(v === 'Lalo' ? 'lalo_tue_20' : 'tobias_tue_23')],
      ['The tag line on the ground', ['Fello', 'Inês', 'Señora Mireya'], ['Fello'], 'alan_tue_job_bad_tag', () => say('fello_tue_20')],
    ];
    for (const [job, who, ok, bad, after] of JOBS) {
      for (;;) {
        const v = await S.choose(job, 'Nineteen people, five jobs, and the wind rising. Who goes here?', who.map(w => ({ label: w, value: w, correct: ok.includes(w) })));
        if (ok.includes(v)) { if (after) await after(v); break; }
        await say(bad);
      }
    }
    await say('narr_tue_lift_0');
    G.autosave();
    for (let i = 1; i <= 5; i++) {
      const windy = f.foundry_late && i === 5;
      if (windy) await say('narr_tue_late_window');
      for (;;) {
        const v = await S.timedChoice({ title: 'Pull ' + i + ' of 5', text: windy ? 'The palms lie flat. There is no calm left: pull with everything, together, on the count.' : 'The palms are lying flat in a gust… now they stand up. The rain eases for a breath.',
          options: windy ? [{ label: 'All together, on the count', value: true, correct: true }, { label: 'Wait for a calm that won\'t come', value: false }] : [{ label: 'Pull now', value: true, correct: true }, { label: 'Wait', value: false }], seconds: 6 });
        if (v) break;
        S.sfx('chain_creak', 0.6);
        await say(v === null ? 'alan_timeout' : 'alan_tue_pull_bad');
      }
      S.sfx('rope_creak', 0.7);
      await say('narr_tue_pull_' + i);
      if (i === 3) await say('sisters_tue_20', 'vasco_tue_21', 'ines_tue_22', 'vasco_tue_22');
    }
    S.sfx('bell_great_backward', 0.8);
    await say('narr_tue_23', 'batista_tue_21', 'narr_tue_24');
    f.rehung = true; S.pulse(3);
    await S.cut('The gate', 'The cloister gate in the rain. The bishop soaked to the knee in his choir dress. Moncho laying the car keys on the stone ledge, and beside them a photocopy with a pencilled margin. A kiss on the ring. The small bells ringing above them.',
      'narr_tue_30', 'bishop_tue_30', 'moncho_tue_30', 'bishop_tue_31', 'narr_tue_31', 'moncho_tue_31', 'narr_tue_32');
    f.tu5_done = true;
    if (f.drums_back) await S.tueBearing();
    else await say('alan_tue_drums_first');
  };

  // ================================================================ TU6 — the bearing on the 1890 map (Inês, at Mireya's table)
  S.spot(K, { name: 'The 1890 harbour map', rect: [460, 400, 440, 140], at: [640, 660], when: () => ch8() && F().tu5_done && !F().bearing_plotted,
    look: 'ines_tue_look_map', use: () => S.tuePlot(), items: { compass: () => S.tuePlot() } });
  S.person(K, { id: 'tobias2', ch: 'tobias', speaker: 'tobias', x: 1060, y: 665, dir: 'w', name: 'Tobías', when: () => ch8() && F().tu5_done && !F().bearing_plotted && !F().bearing_taken, look: 'alan_tue_look_tobias', talk: () => say('tobias_tue_40') });
  S.tueBearing = async function () {
    await S.switchTo('ines', K, 'default', [300, 670, 'e']);
    await say('narr_tue_40', 'ines_tue_40');
  };
  S.tuePlot = async function () {
    const f = F();
    if (f.bearing_plotted) return;
    if (!f.bearing_taken) await say('tobias_tue_40', 'tobias_tue_41');
    S.sfx('pencil_scribble', 0.6);
    await say('ines_tue_plot', 'ines_tue_plot_2');
    f.bearing_plotted = true; f.tue_shore = true;
    S.pulse(5);
    await S.cut('Down to the shore', 'Six o\'clock: the rain in a wall. Sixteen people on old stone steps below the fortress, drums wrapped in plastic. Haitian horns at the end of the Malecón, and Yolande coming down the shore with fifty-four people in white. Beyond the reef, the whole sea gone dark; behind it, the grey wall of the hurricane.',
      'narr_tue_41', 'narr_tue_42', 'narr_tue_43', 'yolande_tue_40', 'narr_tue_44', 'narr_tue_45', 'narr_tue_46');
    f.fin = 1;
    G.autosave();
    await G.goRoom('playa_negras', 'steps', { pos: [900, 670, 'w'] });
  };

  // ================================================================ the finale: the Playa de las Negras
  const B = 'playa_negras', ST = 'shore_steps';
  const fin = n => () => ch8() && F().fin === n;
  const onBeach = () => ch8() && F().fin >= 1 && F().fin <= 4;
  lockWhile(B, 'Up the steps', f => f.ch === 8 && f.fin >= 1, 'ines_fin_look_wall');
  lockWhile(B, 'To the water\'s edge', f => f.ch === 8 && f.fin >= 1, 'alan_fin_look_split');
  lockWhile(ST, 'To the city', f => f.ch === 8 && f.fin >= 1, 'ines_fin_look_wall');
  // the people on the beach (who's the player decides who stands as a figure)
  S.person(B, { id: 'alan2', ch: 'alan', x: 640, y: 668, dir: 'w', name: 'Alan', when: () => onBeach() && S.who() !== 'alan', look: 'ines_fin_look_alan', talk: () => say(F().fin1_rock ? 'alan_fin_01' : 'alan_fin_02'),
    items: { chalk: () => S.finVeve() } });
  S.person(B, { id: 'ines', ch: 'ines', x: 760, y: 672, dir: 'w', name: 'Inês', when: () => onBeach() && S.who() !== 'ines', look: 'alan_tue_look_ines', talk: () => say('ines_fin_03') });
  S.person(B, { id: 'vasco', ch: 'vasco', x: 880, y: 668, dir: 'w', name: 'Vasco', when: onBeach, look: 'alan_tue_look_vasco', talk: () => say(F().fin >= 2 ? 'vasco_fin_hint' : 'vasco_fin_03') });
  S.person(B, { id: 'yolande', ch: 'yolande', x: 380, y: 676, dir: 'e', name: 'Yolande', when: onBeach, look: 'alan_fin_look_drummers', talk: () => say(F().fin === 1 ? 'yolande_fin_02' : 'yolande_fin_50'), items: {} });
  S.person(B, { id: 'lilo', ch: 'lilo', x: 1010, y: 690, dir: 'w', name: 'Papá Lilo', when: onBeach, look: 'alan_fin_look_lilo', talk: () => S.finArrange('lilo') });
  S.person(B, { id: 'fello', ch: 'fello', x: 1130, y: 690, dir: 'w', name: 'Fello', when: onBeach, look: 'alan_fin_look_fello', talk: () => S.finArrange('fello') });
  S.person(B, { id: 'mireya', ch: 'mireya', x: 1230, y: 695, dir: 'w', name: 'Señora Mireya', when: onBeach, look: 'alan_fin_look_mireya', talk: () => S.finArrange('mireya') });
  S.person(B, { id: 'nando', ch: 'nando', x: 1240, y: 640, dir: 'w', name: 'Nando', when: () => onBeach() && !F().halves_met, look: 'alan_fin_look_nando', talk: () => S.finNando() });
  S.person(B, { id: 'moncho', ch: 'moncho', x: 530, y: 672, dir: 'w', name: 'Moncho', when: onBeach, look: 'alan_fin_look_moncho', talk: () => S.finMoncho() });
  S.spot(B, { name: 'The flat rock', rect: [130, 380, 350, 90], at: [320, 670], when: onBeach, look: () => say(S.who() === 'ines' ? 'ines_fin_look_rock' : 'alan_fin_look_split'),
    items: { chalk: async () => { F().fin1_rock = true; S.sfx('stone_notch', 0.5); await say('ines_fin_rock_drawn', 'yolande_fin_03', 'alan_fin_01', 'ines_fin_02'); } } });
  S.spot(B, { name: 'The Haitian drummers', rect: [20, 470, 200, 160], at: [200, 670], when: () => onBeach() && F().fin === 2, look: 'alan_fin_look_drummers', use: () => S.finArrange('drums'), talk: () => S.finArrange('drums') });
  S.spot(B, { name: 'The two halves', rect: [560, 560, 160, 60], at: [640, 670], when: () => onBeach() && F().fin === 2 && !F().halves_met, look: 'alan_fin_look_split' });
  S.onEnter(B, async () => {
    const f = F();
    if (!ch8()) return;
    if (f.fin === 1 && !f.fin1_intro) {
      f.fin1_intro = true;
      await say('narr_fin_01', 'yolande_fin_01', 'ines_fin_01', 'yolande_fin_02');
      S.give('chalk');
      G.autosave();
    } else if (f.fin === 3 && f.batista_done && !f.fin4_done) { f.fin = 4; await S.finPhase4(); }
  });
  // phase 1: Agwe's boat on Alan's chest, from his sketch (a good sketch: four parts; a poor one: all seven, two corrected)
  const PARTS = ['Hull', 'Mast', 'Sail', 'Flag', 'Three wave lines', 'Crosses', 'Stars'];
  S.finVeve = async function () {
    const f = F();
    if (!f.fin1_rock) return say('yolande_fin_02');
    if (f.fin1_done) return;
    const acc = f.veve_accuracy, good = acc == null || (acc <= 10 ? acc >= 2 : acc >= 60);
    const need = good ? ['Hull', 'Mast', 'Sail', 'Three wave lines'] : PARTS.slice();
    let fixes = good ? 0 : 2;
    await say('narr_fin_veve');
    for (let i = 0; i < need.length; i++) {
      const left = PARTS.filter(p => need.indexOf(p) >= i);
      const v = await S.choose('Agwe\'s boat', `<img src="art/closeups/veve_whole.png" style="max-height:26vh;background:#2e221a;border:1px solid #6a5434"><br>${good ? 'Alan\'s sketch is clear.' : 'Alan\'s sketch is rough.'} Part ${i + 1} of ${need.length}: which comes next?`,
        left.map(p => ({ label: p, value: p, correct: p === need[i] })));
      S.sfx('pencil_scribble', 0.5);
      if (v !== need[i]) { await say('yolande_fin_fix'); }
      else if (fixes > 0 && (i === 2 || i === 5)) { fixes--; await say('yolande_fin_fix_2'); }
    }
    f.fin1_done = true; S.take('chalk');
    await say('narr_fin_veve_done', 'ines_fin_03', 'alan_fin_02', 'narr_fin_02', 'vasco_fin_01', 'alan_fin_03', 'vasco_fin_02', 'narr_fin_03', 'vasco_fin_03');
    f.fin = 2;
    await S.switchTo('alan', B, 'default', [250, 672, 'e']);
    await say('narr_fin_10', 'narr_fin_11');
    G.autosave();
  };
  // phase 2: arrange the shore (Lilo, Fello under him, the Haitian drums, Mireya), then Nando and Carmela's message, then Moncho
  const ORDER = ['lilo', 'fello', 'drums', 'mireya'];
  S.finArrange = async function (who) {
    const f = F();
    if (f.fin !== 2 || S.who() !== 'alan') return say(who === 'lilo' ? 'lilo_fin_01' : who === 'fello' ? 'fello_fin_01' : who === 'mireya' ? 'mireya_fin_01' : 'alan_fin_look_drummers');
    f.shore = f.shore || [];
    if (f.shore.includes(who)) return say('alan_fin_need_halves');
    if (ORDER[f.shore.length] !== who) return say('alan_fin_need_order');
    f.shore.push(who);
    const L = { lilo: ['alan_fin_12', 'lilo_fin_01'], fello: ['alan_fin_13', 'fello_fin_01'], drums: ['alan_fin_14', 'narr_fin_12'], mireya: ['alan_fin_15', 'mireya_fin_01'] };
    S.sfx(who === 'mireya' ? 'voices_window' : 'knock', 0.5);
    await say(...L[who]);
  };
  S.finNando = async function () {
    const f = F();
    if (f.fin !== 2) return say('alan_fin_look_nando');
    if ((f.shore || []).length < 4) return say('alan_fin_need_order');
    if (f.halves_met) return;
    await say('alan_fin_16', 'alan_fin_17', 'narr_fin_13', 'nando_fin_01', 'narr_fin_14', 'narr_fin_15');
    f.halves_met = true; G.refreshNpcs();
  };
  S.finMoncho = async function () {
    const f = F();
    if (f.fin !== 2) return say('alan_fin_look_moncho');
    if (!f.halves_met) return say('alan_fin_need_halves');
    await say('alan_fin_18', 'narr_fin_rhythm');
    for (let tries = 0; ; tries++) {
      const ok = await S.rhythm({ title: 'Over the drawn boat', text: 'Tap the rhythm on your own chest: one, two… three, and rest. The third comes late.', bars: 4 });
      if (ok) break;
      await say('alan_rhythm_fail', 'lilo_fin_hint');
    }
    await say('alan_rhythm_ok', 'narr_fin_16', 'narr_fin_17');
    f.fin = 3;
    G.autosave();
    await S.finPhase3();
  };
  // phase 3: Batista on the steps
  S.person(ST, { id: 'batista', ch: 'batista', x: 820, y: 660, dir: 'w', name: 'Sargento Batista', when: () => ch8() && F().fin === 3, look: 'ines_fin_look_batista', talk: () => S.finMother() });
  S.person(ST, { id: 'tobias', ch: 'tobias', x: 360, y: 676, dir: 'e', name: 'Tobías', when: () => ch8() && F().fin === 3, look: 'alan_tue_look_tobias', talk: () => say('tobias_fin_01') });
  S.spot(ST, { name: 'The fortress wall', rect: [160, 120, 360, 260], at: [340, 670], when: () => ch8() && F().fin === 3,
    look: async () => { const f = F(); if (f.batista_done && !f.wall_seen) { f.wall_seen = true; await say('tobias_fin_01'); await S.cut('On the wall', 'For two seconds the camera finds a tall figure in a black cassock on the fortress wall, watching the beach in the rain. Nobody comments.', 'narr_fin_wall'); } else await say('ines_fin_look_wall'); } });
  const vans = ['narr_fin_20', 'ledesma_fin_01', 'batista_fin_01', 'batista_fin_02', 'narr_fin_21', 'narr_fin_22'];
  const vansDesc = 'Blue lights in the rain at the top of the old steps: the colonel\'s vans. Batista on the third step with his hand flat on Ledesma\'s chest. One young policeman taking off his helmet and walking down to the beach, then another, and another.';
  S.finPhase3 = async function () {
    const f = F();
    await S.switchTo('ines', ST, 'default', [500, 672, 'e']);
    if (f.batista_committed) { await S.cut('Batista on the steps', vansDesc, ...vans); f.batista_done = true; }
    else await say('narr_fin_20', 'ledesma_fin_01', 'ines_fin_20', 'batista_fin_03');
  };
  S.finMother = async function () {
    const f = F();
    if (f.batista_done) return say('ines_fin_look_batista');
    for (;;) {
      const v = await S.choose('His mother', 'Down on the beach, a hundred and twenty-three people in the rain. Which one is Batista\'s mother?',
        [{ label: strip('ines_fin_m_b'), value: 'b' }, { label: strip('ines_fin_m_a'), value: 'a', correct: true }, { label: strip('ines_fin_m_c'), value: 'c' }]);
      if (v === 'a') break;
      await say('batista_fin_wrong');
    }
    await say('ines_fin_m_a', 'batista_fin_04');
    await S.cut('Batista on the steps', vansDesc, 'batista_fin_01', 'batista_fin_02', 'narr_fin_21', 'narr_fin_22');
    f.batista_done = true; G.refreshNpcs();
  };
  // down the steps again: phase 4
  { const d = findSpot(ST, 'Down to the beach'); if (d) { const was = d.locked; d.locked = () => (ch8() && F().fin === 3 && !F().batista_done) || (was ? was() : false); d.lockedLine = 'ines_fin_look_batista'; } }
  S.onEnter(ST, async () => { /* (the steps are entered from the phase-3 switch) */ });
  // phase 4: inside the Sea, and the list
  const CARDS = ['porto', 'gulbenkian', 'bill', 'safe', 'tuesday', 'dogwoman', 'belgian', 'camoes', 'hire'];
  const CARD_LABEL = { porto: 'The Porto dealer', gulbenkian: 'The Gulbenkian maps', bill: 'The electricity bill', safe: 'The safe combination', tuesday: 'The lonely Tuesday man',
    dogwoman: 'The dog-woman thief', belgian: 'The Belgian ("his wife is fine")', camoes: 'Pessoa and the Camões', hire: '"Hire someone Pessoa tolerates"' };
  const cardsHeld = () => {
    const f = F(), c = f.cards;
    let have = Array.isArray(c) ? c.slice() : c && typeof c === 'object' ? Object.keys(c).filter(k => c[k]) : null;
    if (!have || !have.length) have = CARDS.slice(0, Math.max(3, Math.min(9, f.cards_collected || 3)));
    for (const r of ['porto', 'gulbenkian', 'bill']) if (!have.includes(r)) have.unshift(r);   // (the three required are unmissable)
    return CARDS.filter(k => have.includes(k));
  };
  S.finPhase4 = async function () {
    const f = F();
    f.fin4_done = true;
    G.autosave();
    // Alan, inside the Sea: the only action is to look back
    await S.cut('Inside the Sea', 'The screen goes to a sea-dark: cold, enormous, angry, four hundred and ten years old. Alan walking out over the reef with the darkness following him like a crowd. No voice. A feeling, like a door opening behind you in an empty house.', 'narr_fin_30', 'narr_fin_31', 'narr_fin_32');
    for (;;) {
      const v = await S.choose('Inside the Sea', 'It asks, without words: why should I? Alan has no answer.', [
        { label: strip('alan_fin_sea_b'), value: 'b' }, { label: strip('alan_fin_sea_c'), value: 'c' }, { label: strip('alan_fin_sea_a'), value: 'a', correct: true }]);
      if (v === 'a') break;
      await say(v === 'b' ? 'narr_fin_sea_b' : 'narr_fin_sea_c');
    }
    await S.cut('The shore, as it sees it', 'From far out in the dark: the beach as a smear of tiny warm lights in the rain, a hundred and twenty-three of them, joined at the hands. Then the dark beginning to pull back, like a tide, and taking Alan with it.', 'narr_fin_33', 'narr_fin_34', 'narr_fin_35');
    // Inês stands up: the cards, one per step
    await say('ines_fin_30', 'narr_fin_cards');
    const left = cardsHeld(); let n = 0;
    while (left.length) {
      const k = await S.choose('Shout a card', `${left.length} left. Each one is a step back toward the shore.`, left.map(c => ({ label: CARD_LABEL[c], value: c, correct: true })));
      left.splice(left.indexOf(k), 1); n++;
      await say('ines_fin_card_' + k);
      if (k === 'belgian') await say('narr_fin_sea_belgian');
      await say('narr_fin_step');
      if (n === 1) await say('narr_fin_vasco_drum');
      for (;;) { const ok = await S.rhythm({ title: 'Vasco\'s drum', text: 'Walk on the beat: one, two… three, and rest.', bars: 1 }); if (ok) break; await say('vasco_fin_hint'); }
    }
    f.cards_shouted = n;
    await S.cut('Bring him back', 'Moncho, in the surf, changing one word of the song; the whole beach taking it up. Inside the dark, Alan laughing. Then the dark opening, the way a hand opens.', 'narr_fin_36', 'narr_fin_37', 'narr_fin_38');
    await S.cut('The beach', 'A wave leaving Alan face down on the sand. Batista kneeling, counting compressions. Yolande pouring her second bottle. Inês at his head.',
      'narr_fin_39', 'narr_fin_40', 'yolande_fin_10', 'ines_fin_31', 'narr_fin_41', f.bill_paid ? 'alan_fin_paid' : 'alan_fin_unpaid', f.bill_paid ? 'narr_fin_paid' : 'narr_fin_unpaid');
    S.pulse(1);
    await S.cut('Dawn', 'Hortense bending north over the sea. The empty tower at a quarter past three, the bell swinging once with no one at the rope. Lilo smiling on his chair in the shallows. Alan on the bottom step under a police blanket, Inês asleep on his shoulder, Vasco beside them.',
      'narr_fin_50', 'narr_fin_51', 'yolande_fin_50', 'narr_fin_52', 'alan_fin_50', 'vasco_fin_50', 'alan_fin_51', 'vasco_fin_51', 'ines_fin_50');
    f.fin = 5; f.tue_done = true; S.pulse(0);
    await S.next(9);
  };

  // ================================================================ part 8: the start
  S.START[8] = async function () {
    const f = F();
    S.becomeAlan();
    f.bg_hostal_kitchen = 'hostal_kitchen__night_powercut';
    for (const k of ['crest_paper', 'welcome_fax', 'wax_seal', 'car_keys']) if (!S.has(k) && !f['had_' + k]) { S.give(k, true); f['had_' + k] = true; }
    await G.goRoom(K, 'default', { instant: true, noEnter: true, pos: [500, 672, 'e'] });
    await S.day(8);
    S.pulse(4);
    await G.fade(false);
    await say('narr_tue_01', 'narr_tue_02', 'vasco_tue_01', 'alan_tue_01', 'vasco_tue_02', 'ines_tue_01', 'alan_tue_02', 'ines_tue_02');
  };

  // ================================================================ part 9: the epilogue
  const PC = 'palace_courtyard';
  S.spot(PC, { name: 'The palace gate', rect: [520, 300, 240, 260], at: [640, 670], when: () => ch9() && !F().epi_gate, look: 'alan_epi_look_gate', use: () => S.epiGate() });
  S.epiGate = async function () {
    const f = F();
    const v = await S.choose('The card', strip('alan_epi_card_q'), [{ label: strip('alan_epi_card_leave'), value: true, correct: true }, { label: strip('alan_epi_card_keep'), value: false }]);
    f.card_left = !!v; f.epi_gate = true;
    await say(v ? 'narr_epi_card_left' : 'narr_epi_card_kept');
    await S.cut('Ramón\'s taxi', 'The old city from the back seat of a Caprice with a rosary swinging from the mirror. The tower going past; in the west arch, beside the bell, a tall figure. Then the street turns.', 'narr_epi_08', 'ramon_epi_01');
    // E1b — the last night (fade to black)
    await G.goRoom('hostal_room4', null, { instant: true, noEnter: true, pos: [600, 670, 'e'] });
    G.player.visible = false;
    await G.fade(true);
    await say('narr_epi_10', 'vasco_epi_01', 'alan_epi_01', 'narr_epi_11', 'mireya_epi_01');
    // E2 — Lisbon, 22 October: the Belgian
    G.player.visible = true;
    f.epi_lisbon = true;
    await G.goRoom('shop', null, { instant: true, noEnter: true, pos: [700, 672, 'e'] });
    await G.card('LISBON', '22 October 1996', 2600);
    await G.fade(false);
    await say('narr_epi_20', 'narr_epi_21', 'belgian_epi_01');
  };
  const SH = 'shop';
  lockWhile(SH, 'The street door', f => f.ch === 9, 'alan_epi_look_door');
  lockWhile(SH, 'Up to the flat', f => f.ch === 9, 'alan_epi_look_counter');
  S.person(SH, { id: 'ines', ch: 'ines', x: 230, y: 668, dir: 'e', name: 'Inês', when: () => ch9() && (F().epi_belgian || F().epi_phone), look: 'alan_tue_look_ines', talk: () => say('ines_epi_01') });
  S.person(SH, { id: 'vasco', ch: 'vasco', x: 120, y: 664, dir: 'e', name: 'Vasco', when: () => ch9() && F().epi_phone, look: 'alan_tue_look_vasco', talk: () => say('vasco_fin_51') });
  S.spot(SH, { name: 'The Belgian at the counter', rect: [960, 300, 260, 300], at: [940, 672], when: () => ch9() && F().epi_lisbon && !F().epi_belgian, look: 'narr_epi_21', talk: () => S.epiBelgian(), use: () => S.epiBelgian() });
  S.spot(SH, { name: 'The telephone', rect: [1140, 300, 120, 80], at: [1100, 672], when: () => ch9() && F().epi_phone && !F().epi_call, look: 'alan_epi_look_phone', use: () => S.epiCall() });
  S.epiBelgian = async function () {
    const f = F();
    for (;;) {
      const v = await S.choose('The Belgian', strip('narr_epi_opener'), [{ label: strip('alan_epi_op_b'), value: 'b' }, { label: strip('alan_epi_op_a'), value: 'a', correct: true }, { label: strip('alan_epi_op_c'), value: 'c' }]);
      await say(v === 'a' ? 'alan_epi_op_a' : v === 'b' ? 'alan_epi_op_b' : 'alan_epi_op_c');
      if (v === 'a') break;
      await say('belgian_epi_no');
    }
    f.epi_belgian = true; G.refreshNpcs();
    await say('belgian_epi_02', 'ines_epi_01', 'alan_epi_02', 'narr_epi_22');
    // E3 — Santo Domingo, 10 September 1997
    const lines = ['narr_epi_30', 'narr_epi_31', 'narr_epi_32', 'narr_epi_33', 'narr_epi_34', 'narr_epi_35'];
    if (f.card_left) lines.push('narr_epi_36');
    await S.cut('Santo Domingo, a year later', 'The river mouth at dusk, the birds lifting off it all at once. Two hundred and six people on the Playa de las Negras. Moncho at the water with a wooden boat round his neck, Fello on Lilo\'s chair. At dawn, red St Michael candles on the flat rock' + (f.card_left ? ': two of them.' : '.'), ...lines);
    // E4 — Lisbon, 12 September 1997, a quarter to two: the phone
    f.epi_phone = true;
    await G.card('LISBON', '12 September 1997 · 01:45', 2600);
    G.refreshNpcs();
    await say('narr_epi_40');
    S.sfx('phone_ring_distant', 0.8);
  };
  // the shop at night: the painting darkened, the counter lamp (E4)
  { const r = ROOMS[SH], fg = r.animFg;
    r.animFg = function (g, t) { if (fg) fg.call(this, g, t); if (ch9() && F().epi_phone) { g.save(); g.fillStyle = 'rgba(6,8,16,0.55)'; g.fillRect(0, 0, 1280, 720); FX.glow(g, 205, 345, 160, '255,200,120', 0.35); g.restore(); } }; }
  S.epiCall = async function () {
    const f = F();
    f.epi_call = true;
    S.sfx('phone_pickup', 0.6);
    await say('alan_epi_40', 'mother_epi_01', 'alan_epi_41', 'mother_epi_02', 'mother_epi_03', 'narr_epi_41', 'narr_epi_42', 'alan_epi_42');
    await G.fade(true);
    await G.card('ALAN SANCHES IV', 'St. Augustine', 3200);
    f.epi_done = true;
    await S.theEnd();
  };
  S.START[9] = async function () {
    const f = F();
    S.becomeAlan();
    await G.goRoom(PC, null, { instant: true, noEnter: true, pos: [300, 672, 'e'] });
    await S.day(9);
    await S.cut('Santo Domingo, 11–14 September', 'A montage, ninety seconds: the Listín Diario\'s front page; Alan scrubbing at a white chalk boat that won\'t come off; Batista handing over a new market card; the photograph in the blue house going back up, face out; a tray of dulce de coco.',
      'narr_epi_01', 'narr_epi_02', 'narr_epi_03', 'narr_epi_04', 'narr_epi_05', 'narr_epi_06');
    await G.fade(false);
    F().epi_started = true;
    await say('narr_epi_07');
  };

  // ================================================================ cold starts and the test harness's walk
  const CARRY = ['crest_paper', 'welcome_fax', 'wax_seal', 'car_keys', 'compass', 'tata_notebook', 'index_cards', 'napkin'];
  S.PREVIEW.start8 = { items: CARRY, flags: { ch: 7, napkin: true, cards_collected: 5, bill_paid: true, tobias_saved: true, bearing_taken: true, batista_committed: true,
    batista_trust: 3, keys_got: true, carmela_found: true, drum_made: true, veve_accuracy: 3, notebook_got: true, carbon_found: true, mon_done: true, seal_taken: true,
    lilo_in: true, fello_in: true, nando_in: true, lalo_in: true, sisters_in: true, mireya_in: true, tobias_in: true, yolande_in: true, moncho_in: true },
    room: K, pos: [500, 672, 'e'], run: () => S.START[8]() };
  S.PREVIEW.start9 = { items: [], flags: { ch: 8, tue_done: true, card_left: false }, room: PC, pos: [300, 672, 'e'], run: () => S.START[9]() };
  S.PREVIEW.finale = { items: CARRY, flags: Object.assign({}, S.PREVIEW.start8.flags, { ch: 8, tu1_done: true, tu2_done: true, tu3_intro: true, rehung: true, tu5_done: true, drums_back: true }),
    room: K, pos: [500, 672, 'e'], run: async () => { S.becomeInes(); await S.tuePlot(); } };

  // (a cold start's run() begins 400 ms after the room opens: wait for the part to have started)
  const until = async c => { for (let i = 0; i < 400 && !c(); i++) await G.wait(25); await S.quiet(); };
  S.SOLVE[8] = async function () {
    await until(() => F().ch === 8);
    const f = F();
    await S.act('Kitchen table', null, 'crest_paper');
    await S.act('Glass pane in the door', 'take');
    await S.act('St Michael candle', null, 'pane');
    await S.act('Kitchen table', null, 'welcome_fax');
    await S.act('St Michael candle', null, 'wax_seal');
    await S.act('Kitchen table', null, 'car_keys');
    await S.act('vasco', 'talk');
    S.expect('the letter', f => f.letter_complete);
    await S.act('tobias', 'talk', null, ['Tata said']);
    S.expect('Inês at the foundry', () => G.room.id === Y && S.who() === 'ines');
    await S.act('The crate', 'use');
    S.expect('the hidden page', f => f.hidden_page);
    await S.act('faustino', 'talk');
    S.expect('Alan in the square', () => G.room.id === P && S.who() === 'alan');
    if (!f.drums_back) await S.act('Police pickup', 'use');
    await S.act('The winch', 'use');
    S.expect('the bell back up', f => f.rehung);
    S.expect('Inês at the map', () => G.room.id === K && S.who() === 'ines');
    await S.act('The 1890 harbour map', 'use');
    S.expect('the beach', () => G.room.id === B && f.fin === 1);
    await S.act('The flat rock', null, 'chalk');
    await S.act('alan2', null, 'chalk');
    S.expect('phase 2', f => f.fin === 2 && S.who() === 'alan');
    await S.act('lilo', 'talk'); await S.act('fello', 'talk'); await S.act('The Haitian drummers', 'use'); await S.act('mireya', 'talk');
    await S.act('nando', 'talk');
    S.expect('the halves met', f => f.halves_met);
    await S.act('moncho', 'talk');
    S.expect('phase 3 on the steps', () => f.fin === 3 && G.room.id === ST);
    if (!f.batista_done) await S.act('batista', 'talk');
    await S.act('The fortress wall', 'look');
    await S.act('Down to the beach');
    S.expect('the epilogue', f => f.ch === 9);
  };
  S.SOLVE[9] = async function () {
    await until(() => F().ch === 9 && F().epi_started);
    await S.act('The palace gate', 'use');
    S.expect('Lisbon', () => G.room.id === SH);
    await S.act('The Belgian at the counter', 'talk');
    await S.act('The telephone', 'use');
    S.expect('the end', f => f.epi_done);
  };
})();
