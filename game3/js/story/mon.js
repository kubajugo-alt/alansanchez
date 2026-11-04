// The Forgotten Rhythm — Monday 9 September, "The Crate" (part 7; docs/BIBLE.md 754–785, ML4–ML6). The lowering (M1),
// Batista's call (M2), Rome (M3), the SHORE drive (M4: Tobías, Yolande, Fello and his drum, Lalo, Eddy, Nando and New
// York, Darío), the blue house (M5), the alley gathering (M6), the raid (M7), through the wall (M8), Batista's office
// (M9), the steps (M10). Monday's clock moves only when beats finish: 14:00, 18:00 and 19:00 fire on their prerequisites.
// Owns police_cell, batista_office, police_steps and drying_shed; adds Monday's people and things elsewhere, gated on ch 7.
// (Flag and item names that begin with a speaker's id are written in backquotes: validate.mjs reads 'quoted' words that
// look like line ids.)
(function () {
  const S = window.S, { G, F, say } = S;
  const T = S.T;
  const mon = () => F().ch === 7;
  const L = id => (window.LINES[id] ? window.LINES[id][1].replace(/\[[^\]]*\]\s*/g, '') : id);
  const has = id => G.has(id);
  const clock = t => { F().mon_clock = t; G.setClock(t); };

  // ---------------------------------------------------------------- items (defined here if no earlier part has)
  const def = (id, d) => { if (!S.ITEMS[id]) S.item(id, d); };
  def('tata_notebook', { name: 'Tata\'s exercise book', look: 'alan_mon_411' });
  def('veve_sketch', { name: 'The vèvè sketch', look: 'alan_fail_look' });
  def('rum', { name: () => `Barceló (${F().rum || 0})`, look: 'alan_fail_look' });
  def('compass', { name: 'Vasco\'s compass and protractor', look: 'alan_fail_look' });
  def('dossier', { name: 'The dossier', look: 'alan_fail_look' });
  def('wax_seal', { name: 'The purple wax seal', look: 'alan_fail_look' });
  def('crest_paper', { name: 'Patriarchate crest paper', look: 'alan_fail_look' });
  def('welcome_fax', { name: 'The bishop\'s welcome fax', look: 'alan_fail_look' });
  S.item('tide_fact', { name: 'Seven hours of high water', look: 'alan_mon_428' });
  S.item('tijean_boat', { name: 'Ti-Jean\'s wooden boat', look: () => S.boatCloseup() });
  S.item(`lalo_note`, { name: 'Lalo\'s note for Eddy', look: 'alan_mon_423' });
  S.item('goatskin', { name: () => (F().skins || 0) > 1 ? 'Two goatskins' : 'A goatskin', look: 'alan_mon_422' });
  S.item('guava_pegs', { name: 'Three guava pegs', look: 'alan_mon_424' });
  S.item('stmichael_candles', { name: 'St Michael candles', look: 'alan_mon_425' });
  S.item('drum', { name: 'Fello\'s father\'s drum', look: 'alan_mon_426' });
  S.item('car_keys', { name: 'The bishop\'s car keys', look: 'alan_mon_427' });
  S.DOCS.add('tide_fact');
  S.boatCloseup = () => G.closeup([{ img: 'close:tijean_boat', html: '<div style="position:absolute;left:0;right:0;bottom:16%;text-align:center;font-family:\'Special Elite\',monospace;font-size:1.7em;color:#3a2410;text-shadow:0 0 6px #f0e4c8">TI-JEAN POU TATA. 1915.</div>' }]);

  // ---------------------------------------------------------------- the notebook, the napkin, deductions
  S.NOTE('tide_known', 'Mon. Batista: the tide came in at eleven and hasn\'t gone out. Seven hours of high water.');
  S.NOTE('mon_margin', 'Sun. 1979 margin: <i>Wilfredo dio los nombres</i>. Nando\'s nephew. Carmela, his sister, took the family to New York.');
  S.NOTE('mon_wifecall', 'Thu. Fello\'s wife cleans offices in New York. She rings the colmado every Monday at six.');
  S.NOTE('nando_refused', 'Mon. Nando: "That\'s a Haitian thing. Vudú." Shut the door.');
  S.NOTE('carmela_plan', 'Mon. <b>Find Carmela.</b> Ask Fello to ask his wife, when she rings at six.');
  S.NOTE('fello_shown', 'Mon. Fello was Little Fello on the 1979 shore. He\'ll come, with his father\'s drum, if the drum lives: a skin, three guava pegs, tuning.');
  S.NOTE('m5_done', 'Mon. Ti-Jean: Jean-Baptiste Lafortune, of Ouanaminthe, killed at Dajabón, 1937. Tata\'s father. Moncho is Haitian too. "On the stone it doesn\'t last."');
  S.NOTE('carmela_found', 'Mon. Carmela: Wilfredo died in 1990 asking for Tata. "Tell Nando he can stop being ashamed for both of us."');
  S.NOTE('m7_done', 'Mon. The raid. Ledesma: "All of them." The drums in an evidence box. Yolande\'s card torn: the border bus at six.');
  S.DEDUCE('mon_margin', 'mon_wifecall', 'carmela_plan', { when: () => !!F().nando_refused, line: 'alan_mon_141' });
  S.NAPKIN.salves.push([`fello_in`, 'Fello (his father\'s drum)'], [`lalo_in`, 'Lalo'], [`tobias_in`, 'Tobías'], [`moncho_in`, 'Moncho (who must sing)'],
    [`nando_in`, 'Nando (on the beach)'], [`dario_in`, 'Darío (trumpet)']);
  S.NAPKIN.kreyol.push([`yolande_in`, 'Manman Yolande']);
  S.NAPKIN.bell.push(['m1_done', 'Lowered into a crate. Tuesday, the furnace.'], ['m3_done', 'Rome: Vasco rang Lorenzo.']);
  S.NAPKIN.salves.push(['m7_done', '<span style="color:#a02818">— 22:00: all of it seized —</span>']);

  // ---------------------------------------------------------------- hints: Tobías's keys from Monday (the parrot is next door)
  const ready5 = f => f.moncho_msg && f.yolande_noon;
  const ready7 = f => f.tobias_in && f.m5_done && f.drum_made && f[`lalo_in`] && f.nando_msg;
  S.HINT(f => mon() && !f.moncho_msg, null, 'tobias_mon_h01');
  S.HINT(f => mon() && !f.yolande_noon && (f.rum || 0) < 2, null, 'tobias_mon_h05');
  S.HINT(f => mon() && !f.yolande_noon, null, 'tobias_mon_h01');
  S.HINT(f => mon() && ready5(f) && !f.m5_done, null, 'tobias_mon_h06');
  S.HINT(f => mon() && !f.fello_shown, null, 'tobias_mon_h02');
  S.HINT(f => mon() && !f[`lalo_in`], null, 'tobias_mon_h03');
  S.HINT(f => mon() && !f.drum_made && !has('goatskin'), null, f => 0 || 'tobias_mon_h04');
  S.HINT(f => mon() && !f.drum_made && !has('guava_pegs') && f.m5_done, null, 'tobias_mon_h07');
  S.HINT(f => mon() && !f.drum_made && has('goatskin') && has('guava_pegs'), null, 'tobias_mon_h08');
  S.HINT(f => mon() && !f.nando_refused, null, 'tobias_mon_h09');
  S.HINT(f => mon() && !f.carmela_plan, null, 'tobias_mon_h09');
  S.HINT(f => mon() && !f.fello_asks, null, 'tobias_mon_h10');
  S.HINT(f => mon() && !f.nando_msg, null, 'tobias_mon_h11');
  S.HINT(f => mon() && f.dario_night && !f[`dario_in`], null, 'tobias_mon_h14');
  S.HINT(f => mon() && !f.m6_done, null, 'tobias_mon_h12');
  S.HINT(f => mon() && f.m7_done && !f.m8_done, null, 'tobias_mon_h13');
  for (const h of S.HINTS) if (typeof h.directLine === 'function') h.directLine = 'tobias_mon_h04';
  S.HINTS.filter(h => h.directLine && /tobias_mon_h/.test(h.directLine)).forEach(h => { h.parrotLine = h.directLine; });

  // ---------------------------------------------------------------- the hub on Monday
  ['hostal', 'parque', 'santon', 'bar', 'market'].forEach(p => S.open(p, f => f.ch === 7 && !f.m6_on));
  S.pinNext(f => {
    if (f.ch !== 7 || f.m6_on) return null;
    if (!f.moncho_msg) return 'parque';
    if (!f.yolande_noon) return (f.rum || 0) >= 2 ? 'market' : 'bar';
    if (!f.fello_shown) return 'santon';
    if (!f[`lalo_in`] || (!has(`lalo_note`) && !has('goatskin') && !f.drum_made)) return 'bar';
    if (!has('goatskin') && !f.drum_made) return 'market';
    if (!f.m5_done || !f.drum_made || !f.nando_msg) return 'santon';
    return 'santon';
  });
  S.mapLock = (() => { const prev = S.mapLock; return () => (prev && prev()) || null; })();

  // ================================================================ START: breakfast, the lowering, Batista's call, Rome
  S.START[7] = async function () {
    const f = F();
    f.ch = 7; f.parrot_back = false; S.pulse(4);
    if (S.who() !== 'alan') S.becomeAlan();
    await G.goRoom('hostal_kitchen', null, { instant: true, noEnter: true, pos: [460, 670, 'e'] });
    G.player.visible = false;
    await S.day(7);
    // M1 the lowering (06:15)
    await S.cut('The lowering', '06:15, Parque Colón, grey and still. The bell swings out of the west arch on a rope and rings once, untouched; every dog howls; water pours from her mouth onto the bishop\'s shoes. Moncho by the black car, lips moving. She is lowered into a crate in the cloister.',
      'narr_mon_10', 'narr_mon_11', 'narr_mon_12', 'narr_mon_13', 'bishop_mon_10', 'narr_mon_14', 'narr_mon_15', 'narr_mon_16');
    f.m1_done = true;
    G.player.visible = true;
    await G.fade(false);
    clock('07:00');
    await say('narr_mon_01', 'mireya_mon_01', 'alan_mon_01', 'mireya_mon_02', 'narr_mon_02', 'mireya_mon_05', 'radio_mon_01');
    await S.chart();
    await say('mireya_mon_03', 'alan_mon_02', 'mireya_mon_04');
    f.parrot_gone = true;
    // M2 Batista's call
    await say('mireya_mon_20', 'batista_mon_20', 'alan_mon_20', 'batista_mon_21', 'alan_mon_21', 'batista_mon_22', 'batista_mon_23', 'alan_mon_22');
    f.tide_known = true; S.give('tide_fact');
    // the notebook remembers what the week has given (ML4's two entries)
    f.mon_margin = true; f.mon_wifecall = true;
    await G.goRoom('hostal_courtyard', 'kitchen', { noEnter: true });
    await S.rome();
  };
  // M3: Rome (the friendship-of-three beat; only "Ring him" moves on)
  S.rome = async function () {
    const f = F();
    clock('08:30');
    await say('narr_mon_30', 'ines_mon_30', 'vasco_mon_30', 'ines_mon_31', 'vasco_mon_31', 'ines_mon_32', 'vasco_mon_32', 'narr_mon_31', 'ines_mon_33');
    await G.dialog([
      { line: 'alan_mon_31', run: () => say('vasco_mon_33', 'ines_mon_34') },
      { line: 'alan_mon_32', run: () => say('vasco_mon_34', 'ines_mon_34') },
      { line: 'alan_mon_30', bye: true, run: () => say('vasco_mon_35', 'alan_mon_33', 'narr_mon_32', 'vasco_mon_36', 'alan_mon_34', 'ines_mon_35') },
    ]);
    f.m3_done = true;
    clock('09:00');
    G.refreshNpcs();
  };
  S.person('hostal_kitchen', { id: 'mireya', ch: 'mireya', x: 900, y: 660, dir: 'w', name: 'Señora Mireya', when: () => mon() && !F().m3_done,
    look: () => say('alan_mon_415'), talk: () => say('mireya_mon_02') });
  S.person('hostal_courtyard', { id: 'ines', ch: 'ines', x: 900, y: 660, dir: 'w', name: 'Inês', when: () => mon() && !F().m3_done, talk: () => say('ines_mon_35') });
  S.person('hostal_courtyard', { id: 'vasco', ch: 'vasco', x: 1040, y: 655, dir: 'w', name: 'Vasco', when: () => mon() && !F().m3_done, talk: () => say('vasco_mon_36') });

  // ================================================================ Tobías on the cathedral steps (Parque Colón)
  S.person('parque_colon', { id: 'tobias', ch: 'tobias', x: 900, y: 650, dir: 'w', name: 'Tobías', when: () => mon() && !F().m6_on,
    look: 'alan_mon_402',
    talk: async () => {
      const f = F();
      if (f.moncho_msg) return say('tobias_mon_54');
      await say('tobias_mon_50', 'alan_mon_50', 'tobias_mon_51', 'alan_mon_51', 'tobias_mon_52', 'alan_mon_52', 'tobias_mon_53');
      f.moncho_msg = true; f[`tobias_in`] = true;
    } });
  S.spot('parque_colon', { name: 'The beam in the west arch', rect: [730, 20, 160, 210], at: [800, 660], when: mon, look: () => say(F().moncho_msg ? 'tobias_mon_55' : 'alan_mon_400') });
  S.spot('parque_colon', { name: 'The puddle', rect: [500, 600, 220, 80], when: mon, look: 'alan_mon_401' });

  // ================================================================ Yolande at noon (two bottles)
  const giveRum = async () => {
    const f = F();
    if (f.yolande_noon) return say('yolande_mon_65');
    if ((f.rum || 0) < 2) return say('yolande_mon_62', 'alan_mon_61', 'yolande_mon_63');
    f.rum -= 2; if (f.rum <= 0) G.takeItem('rum'); else G.renderInv();
    await say('yolande_mon_64', 'yolande_mon_65');
    f.yolande_noon = true; f[`yolande_in`] = true; clock('12:00');
    await S.afterBeat();
  };
  S.person('candle_aisle', { id: 'yolande', ch: 'yolande', x: 980, y: 650, dir: 'w', name: 'Manman Yolande', when: () => mon() && !F().yolande_noon,
    look: 'alan_mon_403', talk: async () => { await say('yolande_mon_60', 'alan_mon_60', 'yolande_mon_61'); return giveRum(); }, items: { rum: giveRum } });
  // the curtain at the back of the aisle: the tanner's drying shed
  S.spot('candle_aisle', { name: 'The tanner\'s curtain', rect: [540, 140, 170, 240], at: [620, 650], exit: 'drying_shed', entry: 'aisle', kind: 'exit', look: 'alan_mon_420',
    when: () => mon() || F().ch >= 7 });

  // ================================================================ Eddy in the drying shed (ML6 layer 1: the skin)
  const R6 = S.ROOMS.drying_shed;
  R6.entries.aisle = [240, 660, 'e'];
  S.spot('drying_shed', { name: 'The goatskins on their frames', rect: [300, 90, 760, 270], at: [640, 650], look: 'alan_mon_405' });
  S.spot('drying_shed', { name: 'The work bench', rect: [950, 380, 330, 140], at: [1040, 660], look: 'alan_mon_406' });
  S.spot('drying_shed', { name: 'The tub of water', rect: [90, 380, 220, 130], at: [260, 660], look: 'alan_mon_407' });
  const skinUp = n => { const f = F(); f.skins = (f.skins || 0) + n; S.give('goatskin'); G.renderInv(); };
  async function charm() {
    const f = F();
    const rounds = [
      ['mon_eddy_q1', [['alan_mon_71', true], ['alan_mon_72'], ['alan_mon_73']], 'eddy_mon_78'],
      ['mon_eddy_q2', [['alan_mon_74', true], ['alan_mon_75'], ['alan_mon_76']], 'eddy_mon_79'],
      ['mon_eddy_q3', [['alan_mon_77', true], ['alan_mon_78'], ['alan_mon_79']], 'eddy_mon_80'],
    ];
    await say('narr_mon_71');
    for (const [q, opts, yes] of rounds) {
      const pick = await S.choose('Make Eddy laugh', L(q), opts.map(([id, ok]) => ({ label: L(id), value: id, correct: !!ok })));
      await say(pick);
      if (!opts.find(o => o[0] === pick)[1]) { await say('eddy_mon_81', 'eddy_mon_73'); return false; }
      await say(yes);
    }
    f.eddy_charmed = true;
    return true;
  }
  S.person('drying_shed', { id: 'eddy', ch: 'eddy', x: 760, y: 655, dir: 'w', name: 'Eddy', when: () => F().ch === 7,
    look: 'alan_mon_404',
    talk: async () => {
      const f = F();
      if (!f.eddy_met) { f.eddy_met = true; await say('narr_mon_70', 'eddy_mon_70', 'alan_mon_70', 'eddy_mon_71', 'eddy_mon_72'); }
      if (f.skin_split && !has('goatskin')) { await say('eddy_mon_76'); return skinUp(1); }
      if (f.eddy_charmed || f.drum_made) return say('eddy_mon_77');
      if (await charm()) { await say('eddy_mon_75'); skinUp(1); }
    },
    items: {
      [`lalo_note`]: async () => { const f = F(); G.takeItem(`lalo_note`); f.note_given = true; await say('eddy_mon_74'); skinUp(1); },
      any: 'eddy_mon_82',
    } });

  // ================================================================ Lalo at the bar (and the sisters; Darío if the Saturday night was taken)
  S.person('blue_door_bar', { id: 'lalo', ch: 'lalo', x: 420, y: 650, dir: 'e', name: 'Lalo', when: () => mon() && !F().m6_on,
    look: 'alan_mon_408',
    talk: async () => {
      const f = F();
      if (!f[`lalo_in`]) { await say('narr_mon_90', 'lalo_mon_90', 'alan_mon_90', 'lalo_mon_91', 'lalo_mon_92', 'lalo_mon_93', 'lalo_mon_94', 'ercilia_mon_90'); f[`lalo_in`] = true; f.sisters_in = true; }
      return G.dialog([
        { line: 'alan_mon_91', once: true, when: () => f.fello_shown && !f.note_written, run: async () => { await say('lalo_mon_95', 'lalo_mon_96', 'lalo_mon_97'); f.note_written = true; S.give(`lalo_note`); } },
        { line: 'alan_mon_92', when: () => !f.yolande_noon && (f.rum || 0) < 2, run: async () => { await say('lalo_mon_98'); f.rum = Math.max(2, f.rum || 0); S.give('rum'); G.renderInv(); } },
        { line: 'alan_mon_93', once: true, when: () => f.dario_night && f.dario_met && !f[`dario_in`], run: async () => { await say('lalo_mon_100', 'dario_mon_91'); f[`dario_in`] = true; } },
        { label: 'See you at seven.', bye: true, run: () => say('lalo_mon_99') },
      ]);
    } });
  S.person('blue_door_bar', { id: 'sisters', ch: 'sisters', x: 820, y: 610, dir: 'w', name: 'The perm sisters', when: () => mon() && !F().m6_on,
    look: 'alan_mon_409', talk: () => say('ercilia_mon_90') });
  S.person('blue_door_bar', { id: 'dario', ch: 'dario', x: 1150, y: 630, dir: 'w', name: 'Darío', when: () => mon() && !!F().dario_night && !F().m6_on,
    look: 'alan_mon_419', talk: async () => { const f = F(); if (f[`dario_in`]) return say('dario_mon_91'); f.dario_met = true; await say('dario_mon_90'); } });

  // ================================================================ San Antón: Fello behind the shut colmado; Nando's door; the six o'clock call
  S.onEnter('san_anton', async () => {
    const f = F();
    if (!mon()) return;
    if (f.fello_asks && !f.carmela_found && f.m5_done) await S.newYork();
  });
  // the colmado shut on Monday (a shared painting variant; set on entering San Antón, cleared after)
  const shut = () => { const f = F(); if (f.ch === 7) f.bg_san_anton = 'san_anton_colmado__shut'; else if (f.bg_san_anton === 'san_anton_colmado__shut') delete f.bg_san_anton; };
  S.onEnter('san_anton', async () => shut());
  S.onEnter('tata_alley', async () => { const f = F(); if (f.ch === 7 && !f.m6_on) f.bg_tata_alley = 'tata_alley__day'; else if (f.bg_tata_alley === 'tata_alley__day') delete f.bg_tata_alley; });
  S.spot('san_anton', { name: 'The shut colmado', rect: [290, 170, 280, 250], at: [430, 660], when: mon, look: 'alan_mon_412' });
  S.spot('san_anton', { name: 'His father\'s drum', rect: [600, 470, 70, 110], at: [640, 665], when: () => mon() && !F().drum_made, look: 'alan_mon_411' });
  const tune = async () => {
    const f = F();
    if (!has('goatskin') || !has('guava_pegs')) return say('fello_mon_127');
    if (!has('stmichael_candles')) { await say('fello_mon_119'); S.give('stmichael_candles'); }
    await say('narr_mon_112');
    let heats = 0;
    for (;;) {
      const v = await S.choose('Tuning the drum', L('mon_tune_q') + ` (heats so far: ${heats})`, [
        { label: 'Hold the candles under the skin', value: 'heat', correct: heats < 3 },
        { label: 'Tap it, and listen', value: 'tap', correct: heats >= 3 },
      ]);
      if (v === 'heat') {
        heats++;
        if (heats > 3) {
          await say('fello_mon_123');
          f.skins = Math.max(0, (f.skins || 1) - 1);
          if (f.skins <= 0) { G.takeItem('goatskin'); f.skin_split = true; return say('fello_mon_124'); }
          G.renderInv(); heats = 0; await say('narr_mon_112'); continue;
        }
        S.sfx('candle_flutter', 0.5);
      } else {
        S.sfx('knock', 0.7);
        if (heats < 2) await say('fello_mon_120');
        else if (heats === 2) await say('fello_mon_121');
        else break;
      }
    }
    await say('fello_mon_122', 'fello_mon_126');
    f.skins = Math.max(0, (f.skins || 1) - 1); if (f.skins <= 0) G.takeItem('goatskin'); else G.renderInv();
    G.takeItem('guava_pegs');
    f.drum_made = true; f[`fello_in`] = true; S.give('drum');
    await S.afterBeat();
  };
  S.person('san_anton', { id: 'fello', ch: 'fello', x: 760, y: 665, dir: 'w', name: 'Fello', when: () => mon() && !F().m6_on,
    look: 'alan_mon_410',
    talk: async () => {
      const f = F();
      if (!f.fello_seen) { f.fello_seen = true; await say('narr_mon_110', 'fello_mon_110', 'alan_mon_110', 'fello_mon_111', 'fello_mon_112'); }
      if (!f.fello_shown) return;
      return G.dialog([
        { line: 'alan_mon_142', once: true, when: () => f.carmela_plan && !f.fello_asks, run: async () => { await say('fello_mon_140'); f.fello_asks = true; await S.afterBeat(); } },
        { label: 'The drum.', when: () => !f.drum_made, run: () => (has('goatskin') && has('guava_pegs')) ? tune() : say('fello_mon_118') },
        { label: 'See you at seven.', bye: true, run: () => say(f.drum_made ? 'fello_mon_126' : 'fello_mon_117') },
      ]);
    },
    items: {
      tata_notebook: async () => {
        const f = F();
        if (f.fello_shown) return say('fello_mon_118');
        if (!f.fello_seen) { f.fello_seen = true; await say('narr_mon_110', 'fello_mon_110'); }
        await say('narr_mon_111', 'fello_mon_113', 'fello_mon_114', 'fello_mon_115', 'fello_mon_116', 'fello_mon_117', 'fello_mon_118');
        f.fello_shown = true;
      },
      goatskin: () => tune(), guava_pegs: () => tune(), stmichael_candles: () => tune(),
      any: 'fello_mon_111',
    } });
  S.spot('san_anton', { name: 'Nando\'s door', rect: [1040, 250, 120, 230], at: [1060, 665], when: mon, look: 'alan_mon_413',
    use: async () => {
      const f = F();
      if (f.nando_msg) return say('nando_mon_141');
      if (f.carmela_found) {
        await say('narr_mon_153', 'fello_mon_151', 'narr_mon_154', 'fello_mon_152');
        f.nando_msg = true; f[`nando_in`] = true;
        return S.afterBeat();
      }
      await say('narr_mon_140', 'nando_mon_140', 'alan_mon_140');
      f.nando_refused = true;
    } });
  // ML4: the six o'clock call (fires when the plan is made and the blue house is done: Monday's clock moves by beats)
  S.newYork = async function () {
    const f = F();
    clock('18:00');
    S.sfx('phone_ring_distant', 0.6);
    await say('narr_mon_150', 'fellowife_mon_150', 'narr_mon_151', 'carmela_mon_150', 'carmela_mon_151', 'narr_mon_152', 'fello_mon_150');
    f.carmela_found = true;
  };

  // ================================================================ M5: the blue house at two
  S.onEnter('blue_house', async () => {
    const f = F();
    if (!mon()) return;
    if (!f.m5_done && ready5(f)) {
      f.bg_blue_house = 'blue_house_inside__wet'; f.m5_on = true; G.refreshNpcs();
      clock('14:00');
      await say('narr_mon_170', 'moncho_mon_170', 'narr_mon_171', 'moncho_mon_171', 'yolande_mon_170', 'yolande_mon_171', 'yolande_mon_172', 'moncho_mon_172', 'alan_mon_170');
    }
  });
  S.person('blue_house', { id: 'moncho', ch: 'moncho', x: 700, y: 665, dir: 'e', name: 'Moncho', when: () => mon() && !!F().m5_on && !F().m5_done,
    look: 'alan_mon_414', talk: () => say('moncho_mon_172'),
    items: { tijean_boat: async () => {
      const f = F();
      await say('narr_mon_172', 'moncho_mon_173', 'narr_mon_173');
      G.takeItem('tijean_boat');
      delete f.bg_blue_house;
      await say('moncho_mon_174', 'yolande_mon_173', 'alan_mon_174', 'yolande_mon_174', 'moncho_mon_175');
      f.m5_done = true; f.m5_on = false; f[`moncho_in`] = true; f.chalk_eaten = true;
      f.boat_back = true; S.give('tijean_boat', true);   // (Moncho gives it back to keep for the shore)
      G.refreshNpcs();
      await S.afterBeat();
    }, any: 'moncho_mon_172' } });
  S.person('blue_house', { id: 'yolande', ch: 'yolande', x: 1080, y: 660, dir: 'w', name: 'Yolande', when: () => mon() && !!F().m5_on && !F().m5_done,
    talk: () => say('yolande_mon_172') });
  S.spot('blue_house', { name: 'Tata\'s altar', rect: [470, 300, 280, 160], at: [600, 660], when: () => mon() && !!F().m5_on,
    look: async () => { F().altar_seen = true; await say('alan_mon_171'); } });
  S.spot('blue_house', { name: 'The little wooden boat', rect: [640, 330, 70, 60], at: [640, 660], when: () => mon() && !!F().m5_on && !has('tijean_boat'),
    look: () => F().altar_seen ? say('alan_mon_173') : say('alan_mon_172'),
    take: async () => { if (!F().altar_seen) return say('alan_mon_172'); await say('alan_mon_173'); S.give('tijean_boat'); } });
  S.spot('blue_house', { name: 'The back window', rect: [760, 140, 190, 150], at: [860, 660], when: () => mon() && !!F().m5_done,
    look: 'alan_mon_175',
    use: async () => { const f = F(); if (f.pegs_cut) return say('alan_mon_177'); f.pegs_cut = true; await say('alan_mon_176'); S.give('guava_pegs'); },
    take: async () => { const f = F(); if (f.pegs_cut) return say('alan_mon_177'); f.pegs_cut = true; await say('alan_mon_176'); S.give('guava_pegs'); } });

  // ================================================================ when a beat finishes: is it seven o'clock yet?
  S.afterBeat = async function () {
    const f = F();
    if (ready7(f) && !f.m6_ready) { f.m6_ready = true; clock('19:00'); G.toast('Seven o\'clock. Tata\'s alley.', 2600); }
  };
  S.onEnter('tata_alley', async () => { const f = F(); if (mon() && ready7(f) && !f.m6_done) await S.gathering(); });

  // ================================================================ M6 the gathering, M7 the raid
  const crowd = [['lilo', 300, 650, 'Papá Lilo'], ['fello', 470, 670, 'Fello'], ['lalo', 620, 660, 'Lalo'], ['sisters', 760, 645, 'The perm sisters'],
    ['tobias', 900, 660, 'Tobías'], ['mireya', 1020, 655, 'Señora Mireya'], ['yolande', 1160, 650, 'Yolande']];
  crowd.forEach(([id, x, y, name]) => S.person('tata_alley', { id, ch: id, x, y, dir: x < 640 ? 'e' : 'w', name, when: () => mon() && !!F().m6_on,
    talk: () => say('lilo_mon_210') }));
  S.gathering = async function () {
    const f = F();
    f.m6_on = true; delete f.bg_tata_alley; G.refreshNpcs();
    await say('narr_mon_210', 'lilo_mon_210');
    for (;;) {
      const v = await S.choose('The alley', L('mon_sit_q'), [
        { label: L('alan_mon_211'), value: 'speech' }, { label: L('alan_mon_212'), value: 'knock' }, { label: L('alan_mon_210'), value: 'sit', correct: true }]);
      if (v === 'sit') break;
      await say(v === 'speech' ? 'lilo_mon_211' : 'lilo_mon_212');
    }
    await say('narr_mon_211', 'narr_mon_212', 'narr_mon_213', 'mireya_mon_210', 'narr_mon_214', 'yolande_mon_210', 'narr_mon_215', 'narr_mon_216');
    for (;;) { if (await S.rhythm({ title: 'The one that calls', text: 'Play with Lilo: one, two… three, and rest. The third comes a little late.' })) break; await say('alan_rhythm_fail'); }
    await say('alan_rhythm_ok', 'yolande_mon_211');
    f.m6_done = true; clock('22:00');
    G.autosave();
    await S.raid();
  };
  S.raid = async function () {
    const f = F();
    S.sfx('door_police', 0.7);
    await say('narr_mon_240');
    const opts = [{ label: L('mon_raid_1'), value: 'notebook', correct: true }];
    if (has('tijean_boat')) opts.push({ label: L('mon_raid_2'), value: 'boat' });
    if (has('veve_sketch')) opts.push({ label: L('mon_raid_3'), value: 'veve' });
    const hid = await S.timedChoice({ title: 'The raid', text: L('mon_raid_q'), options: opts, seconds: 8 });
    f.hidden_item = hid || 'none';
    if (!hid) await say('narr_mon_241');
    f.evidence = ['drum'];
    if (hid !== 'boat' && has('tijean_boat')) f.evidence.push('tijean_boat');
    if (hid !== 'veve' && has('veve_sketch')) f.evidence.push('veve_sketch');
    if (hid !== 'notebook' && has('tata_notebook')) { f.evidence.push('tata_notebook'); f.notebook_seized = true; }
    if (hid === 'boat') f.boat_hidden = true; if (hid === 'veve') f.veve_hidden = true;
    await S.cut('The raid', 'Headlights at both ends of the alley. Drums seized; a baton across Fello\'s arms; a young policeman prising Lilo\'s fingers off his drum. Alan face down on the cobbles, cuffed, his shirt torn down the back. Ledesma, hands in his pockets, tears Yolande\'s residency card in half.',
      'ledesma_mon_240', 'narr_mon_242', 'narr_mon_243', 'ledesma_mon_241', 'narr_mon_244', 'ledesma_mon_242', 'yolande_mon_240', 'narr_mon_245');
    for (const k of f.evidence) if (has(k)) G.takeItem(k);
    f.drums_seized = true; f.shore_seized = true; f.m7_done = true; f.m6_on = false;
    S.pulse(5);
    await G.goRoom('police_cell', null, { instant: true, noEnter: true, pos: [500, 670, 'e'] });
    await G.fade(false);
    clock('23:30');
    await say('narr_mon_270', 'alan_mon_270');
    G.autosave();
  };

  // ================================================================ M8 through the wall
  S.person('police_cell', { id: 'fello', ch: 'fello', x: 640, y: 665, dir: 'w', name: 'Fello', when: () => mon() && !F().m8_done,
    look: 'alan_mon_410', talk: async () => { const f = F(); if (f.fello_up) return say('fello_mon_271'); await say('fello_mon_270', 'alan_mon_275', 'fello_mon_271'); f.fello_up = true; } });
  S.person('police_cell', { id: 'lalo', ch: 'lalo', x: 860, y: 655, dir: 'w', name: 'Lalo', when: () => mon() && !F().m8_done,
    look: 'alan_mon_408', talk: async () => { const f = F(); if (f.lalo_up) return say('lalo_mon_270'); await say('alan_mon_276', 'lalo_mon_270'); f.lalo_up = true; } });
  S.spot('police_cell', { name: 'The water pipe', rect: [250, 70, 70, 500], at: [330, 670], look: 'alan_mon_271', use: () => S.wall() });
  S.spot('police_cell', { name: 'The hole', rect: [720, 470, 130, 60], at: [700, 670], look: 'alan_mon_272' });
  S.spot('police_cell', { name: 'The bulb', rect: [600, 0, 80, 70], look: 'alan_mon_273' });
  S.spot('police_cell', { name: 'The cell door', rect: [950, 60, 170, 470], at: [960, 670], look: 'alan_mon_274', use: 'alan_mon_274' });
  S.wall = async function () {
    const f = F();
    if (f.m8_done) return;
    await say('narr_mon_271');
    if (!f.pipe_tried) {
      if (!(await S.rhythm({ title: 'The pipe', text: 'Knock it on the pipe: three beats and a rest. The skip on the third.', sound: 'knock' }))) return say('alan_rhythm_fail');
      f.pipe_tried = true; await say('narr_mon_272');
    }
    if (!(await S.rhythm({ title: 'The pipe, again', text: 'Again. Get the skip right this time.', sound: 'knock' }))) return say('alan_rhythm_fail');
    await say('narr_mon_273', 'yolande_mon_270');
    // the call-and-response: four verses, the Spanish line back in Yolande's gap
    let verses = 0;
    const needed = 2 + (f.fello_up ? 1 : 0) + (f.lalo_up ? 1 : 0);   // (with the others on their feet, fewer verses to carry alone)
    while (verses < 4) {
      const v = await S.timedChoice({ title: `Verse ${verses + 1} of 4`, text: L('mon_sing_q'), seconds: 6,
        options: [{ label: L('mon_sing_wait'), value: 'wait' }, { label: L('mon_sing_now'), value: 'now', correct: true }, { label: L('mon_sing_over'), value: 'over' }] });
      if (v === 'now') { verses++; await say('alan_mon_277'); if (verses < 4) await say('yolande_mon_270'); }
      else await say('alan_mon_278');
      if (verses >= needed && verses < 4 && (f.fello_up || f.lalo_up)) { verses = 4; }
    }
    await say('narr_mon_274', 'narr_mon_275', 'batista_mon_270');
    f.m8_done = true;
    await S.office();
  };

  // ================================================================ M9 Batista's office
  S.person(`batista_office`, { id: 'batista', ch: 'batista', x: 900, y: 655, dir: 'w', name: 'Batista', when: () => mon(), look: 'alan_mon_416', talk: () => say('batista_mon_301') });
  S.spot(`batista_office`, { name: 'The shutter', rect: [1000, 80, 170, 240], at: [1000, 665], look: 'alan_mon_417' });
  S.office = async function () {
    const f = F();
    await G.goRoom(`batista_office`, null, { noEnter: true, pos: [400, 670, 'e'] });
    clock('01:00');
    await say('narr_mon_300', 'batista_mon_300', 'batista_mon_301');
    const laid = new Set();
    const pieces = [
      ['pins', 'mon_ev_pins', () => !!(f.pins_marked || f.overlay_made || f.prediction_made), ['alan_mon_300', 'batista_mon_302']],
      ['tide', 'mon_ev_tide', () => !!f.tide_known, ['alan_mon_301', 'batista_mon_303']],
      ['1930', 'mon_ev_1930', () => !!f.carbon_found, ['alan_mon_302', 'batista_mon_304']],
      ['1979', 'mon_ev_1979', () => !!(f.notebook_got || f.mon_margin), ['alan_mon_303', 'batista_mon_305']],
    ];
    for (;;) {
      const opts = pieces.filter(p => p[2]() && !laid.has(p[0])).map(p => ({ label: L(p[1]), value: p[0], correct: laid.size < 3 }));
      opts.push({ label: L('mon_ev_ledesma'), value: 'ledesma' });
      opts.push({ label: L('mon_ev_question'), value: 'ask', correct: laid.size >= 3 || !pieces.some(p => p[2]() && !laid.has(p[0])) });
      const v = await S.choose('Batista\'s desk', L('mon_ev_q') + ` (laid out: ${laid.size})`, opts);
      if (v === 'ledesma') { await say(f.ledesma_said ? 'alan_mon_305' : 'alan_mon_304'); if (!f.ledesma_said) await say('batista_mon_306'); f.ledesma_said = true; continue; }
      if (v === 'ask') break;
      const p = pieces.find(x => x[0] === v); laid.add(v); await say(...p[3]);
    }
    await say('alan_mon_306', 'narr_mon_301', 'narr_mon_302', 'batista_mon_307');
    f.evidence_laid = laid.size;
    if ((f.batista_trust || 0) >= 2 && laid.size >= 3) { f.batista_committed = true; await say('batista_mon_308', 'alan_mon_307', 'batista_mon_309'); }
    else { f.batista_committed = false; await say('batista_mon_310'); }
    f.m9_done = true;
    await S.steps();
  };

  // ================================================================ M10 the steps
  S.person('police_steps', { id: 'ines', ch: 'ines', x: 560, y: 665, dir: 'e', name: 'Inês', when: () => mon() && !!F().m9_done, talk: () => say('ines_mon_343') });
  S.person('police_steps', { id: 'vasco', ch: 'vasco', x: 720, y: 660, dir: 'w', name: 'Vasco', when: () => mon() && !!F().m9_done, talk: () => say('vasco_mon_342') });
  S.spot('police_steps', { name: 'The bus in the yard', rect: [0, 290, 270, 140], at: [220, 670], look: 'alan_mon_418' });
  S.steps = async function () {
    const f = F();
    await G.goRoom('police_steps', null, { noEnter: true, pos: [380, 670, 'e'] });
    clock('02:30');
    await say('narr_mon_340', 'ines_mon_340', 'vasco_mon_340', 'alan_mon_340', 'vasco_mon_341', 'alan_mon_341', 'ines_mon_341', 'ines_mon_342', 'narr_mon_341');
    S.give('car_keys'); f.keys_got = true;
    await say('vasco_mon_342', 'ines_mon_343', 'narr_mon_342');
    f.mon_done = true; f.drums_seized = true;
    G.setClock(null);
    await S.next(8);
  };

  // ================================================================ a cold start of Monday, and the test's walk through it
  S.PREVIEW.start7 = {
    flags: { ch: 6, napkin: true, rum: 2, lilo_in: true, sisters_in: true, mireya_in: true, tobias_saved: true, bearing_taken: true, prediction_made: true,
      batista_trust: 2, notebook_got: true, carbon_found: true, veve_accuracy: 3, seal_taken: true, pins_marked: true, overlay_made: true, sun_done: true },
    items: ['napkin', 'tata_notebook', 'veve_sketch', 'rum', 'compass', 'dossier', 'crest_paper', 'welcome_fax'],
    room: 'hostal_courtyard', pos: [400, 660, 'e'],
    run: async () => { F().pockets = { ines: ['wax_seal'] }; await S.START[7](); },
  };
  S.SOLVE[7] = async function () {
    const f = F();
    await S.go('parque_colon');
    await S.act('tobias', 'talk');
    S.expect('the message to Moncho', f => f.moncho_msg);
    await S.go('candle_aisle', 'hall');
    await S.act('yolande', null, 'rum');
    S.expect('Yolande at two', f => f.yolande_noon);
    await S.go('san_anton');
    await S.act('Nando\'s door', 'use');
    await S.act('fello', 'talk');
    await S.act('fello', null, 'tata_notebook');
    S.expect('Fello shown the margin', f => f.fello_shown);
    await S.go('blue_door_bar');
    await S.act('lalo', 'talk', null, ['Fello\'s coming']);
    S.expect('Lalo in, and the note', f => f[`lalo_in`] && G.has(`lalo_note`));
    await S.go('drying_shed', 'aisle');
    await S.act('eddy', null, `lalo_note`);
    await S.act('eddy', 'talk');
    S.expect('a goatskin and the spare', f => G.has('goatskin') && f.eddy_charmed);
    await S.go('blue_house', 'alley');
    await S.act('Tata\'s altar', 'look');
    await S.act('The little wooden boat', 'take');
    await S.act('moncho', null, 'tijean_boat');
    S.expect('the blue house', f => f.m5_done);
    await S.act('The back window', 'use');
    await S.tryDeduce('mon_margin', 'mon_wifecall');
    S.expect('find Carmela', f => f.carmela_plan);
    await S.go('san_anton');
    await S.act('fello', 'talk', null, ['Fello. When your wife']);
    await S.go('tata_alley', 'colmado');
    await S.go('san_anton', 'alley');
    S.expect('the New York call', f => f.carmela_found);
    await S.act('Nando\'s door', 'use');
    S.expect('the message read through the door', f => f.nando_msg);
    await S.act('fello', null, 'goatskin');
    S.expect('the drum', f => f.drum_made);
    await S.go('tata_alley', 'colmado');
    S.expect('the raid, the cell', f => f.m7_done && G.room.id === 'police_cell');
    await S.act('fello', 'talk');
    await S.act('lalo', 'talk');
    await S.act('The water pipe', 'use');
    await S.quiet();
    S.expect('Monday done', f => f.mon_done && f.ch === 8);
  };
})();
