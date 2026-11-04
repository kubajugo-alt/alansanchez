// The Forgotten Rhythm — Friday 6 September (Alan: the watchman, the sweet, Moncho, the wall, Batista's dinner, the roof)
// and Saturday 7 September (split: Alan's rum, Yolande, the drain, the vèvè; Inês's 1930 trail and the bishop's dinner;
// Moncho's notebook; Alan's Yunior, Lalo, the perm sisters, the bachata, Darío; dawn at the fountain).
// docs/BIBLE.md 644–705. Lines: js/lines/frisat.js. This part owns the permanent things in city_wall, market_hall,
// candle_aisle, yolande_back_room, blue_door_bar, dario_roof, palace_courtyard and palace_dining; everything it puts in
// other rooms is gated to its own days (ch 4 and 5), and its people have their own ids (fs_*) so they never clash.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const T = S.T;
  const fri = () => F().ch === 4, sat = () => F().ch === 5;
  const asAlan = () => S.who() === 'alan', asInes = () => S.who() === 'ines';
  const look = id => () => say(id);
  const findSpot = (rid, name) => (ROOMS[rid].hotspots || []).find(h => h.name === name);
  // a figure that speaks as one of the cast, with an id of its own (speech.js matches def.speaker)
  // a thing another part owns in the room: on these days it does what this part says; on other days what it did before
  const run = (v, a) => typeof v === 'string' ? say(v) : v(...a);
  const augment = (rid, name, mine, def) => {
    const h = findSpot(rid, name);
    if (!h) return S.spot(rid, Object.assign({ name, when: mine }, def));
    for (const verb of ['look', 'use', 'take', 'talk']) {
      if (!def[verb]) continue;
      const old = h[verb];
      h[verb] = (...a) => mine() ? run(def[verb], a) : old ? run(old, a) : say('alan_fail_look');
    }
    if (h.when) { const w = h.when; h.when = () => mine() || w(); }
    return h;
  };
  const who = (id, ch, x, y, dir, name, when, more) => Object.assign({ id, ch, speaker: ch, x, y, dir, name, when }, more || {});

  // ---------------------------------------------------------------- items
  S.DOCS.add('letter1930'); S.DOCS.add('carbon'); S.DOCS.add('veve_sketch');
  S.item('dollars', { name: 'Forty US dollars', look: 'alan_sat_look_dollars' });
  S.item('linen_jacket', { name: 'Linen jacket', look: 'alan_sat_look_jacket' });
  S.item('rum', { name: () => (F().rum || 0) > 1 ? `Barceló Imperial (${F().rum} bottles)` : 'A bottle of Barceló Imperial', look: 'alan_sat_look_rum' });
  S.item('dulce_de_coco', { name: 'A dulce de coco in greaseproof paper', look: 'alan_fri_look_sweet' });
  S.item('sweet', { name: 'A sweet from El Conde (the wrong one?)', look: 'alan_fri_look_tray' });
  S.item('veve_sketch', { name: () => `Sketch of Agwe's boat (${Math.round((F().veve_accuracy || 0) * 100)}% right)`, icon: 'chalk', look: 'alan_sat_look_sketch' });
  S.item('letter1930', { name: 'The Guardia letter, 1930 (copy)', icon: 'archive_copies', look: 'ines_sat_letter_read' });
  S.item('carbon', { name: 'The Archbishop\'s carbon, 28 August 1930 (copy)', icon: 'archive_copies', look: 'ines_sat_carbon_read' });
  S.item('wax_seal', { name: 'A purple wax seal on a place card', look: 'ines_sat_look_card' });
  S.item('tata_notebook', { name: 'Tata\'s blue exercise book', look: 'alan_sat_look_notebook_tata' });
  S.item('lilo_address', { name: 'Papá Lilo\'s address', look: 'alan_sat_look_address' });

  // ---------------------------------------------------------------- notebook entries and the overlay
  S.NOTE('tobias_dries', 'Fri. Tobías goes up the tower every night to dry the bell. "Like you dry a child." (Mireya)');
  S.NOTE('bands_two', 'Fri. Two wet bands now: Calle Las Damas on Wednesday night, Parque Colón this morning. Both end in a dead straight line at the cathedral.');
  S.NOTE('watch_done', 'Fri. The watchman, Don Eusebio, drowned standing in a dry park. Salt puddle, a live fish by his boot. Batista: "And you\'re not surprised."');
  S.NOTE('ledesma_seen', 'Fri. A heavy man in a grey suit, hands in his pockets, at the watchman. A retired colonel. Batista spat out his toothpick.');
  S.NOTE('moncho_known', 'Fri. The bishop\'s driver is Moncho, Tata\'s grandson. He has her eyes.');
  S.NOTE('lullaby_half', 'Fri. Moncho\'s lullaby: "La campana es del mar, el mar no es de nadie… duérmete, niño, que el mar te sabe el nombre." The rest is in Tata\'s blue exercise book. He says he\'ll burn it.');
  S.NOTE('rule5', 'Fri. The Sea strikes first at whoever understands the lock. (Batista wrote it down.)');
  S.NOTE('pins_marked', 'Fri. Batista\'s five: Tata (San Antón, April), Chago (the river mouth, June), Doña Luz (the cathedral door, July), Pupo (Las Damas, August), the watchman (Parque Colón, today). Dry places, wet people.');
  S.NOTE('overlay_made', 'Fri. The overlay: every death within a street of a wet band; every band ends at the foot of the tower. Not five accidents. A map with a centre.');
  S.NOTE('patch_reef', 'Fri. The dark patch is at the reef.');
  S.NOTE('drain_done', 'Sat. The drain at the market. The sea came up for me. Rum turns it back, for a moment. Fear feeds it.');
  S.NOTE('yol_story', 'Sat. Yolande was Tata\'s other half: Tata the drums and the Spanish salves, Yolande the Kreyòl songs and Agwe\'s boat. It needs both halves. Only Tata knew the rock: "She led. We followed the light."');
  S.NOTE('veve_done', 'Sat. Agwe\'s boat, from memory, in pencil. The shape on Tata\'s floor.');
  S.NOTE('date_1930', 'Sat. The San Zenón hurricane: 3 September 1930 (a radio plaque in the archive\'s folder).', 'ines');
  S.NOTE('letter1930', 'Sat. The Guardia Nacional, 6 Sept 1930: "eleven persons detained, drums confiscated", in answer to "your request of the 28th ultimo". In pencil: "Gracias a Dios."', 'ines');
  S.NOTE('carbon_found', 'Sat. The carbon: the Archbishop\'s secretary, 28 August 1930, asking the Guardia "to disperse the superstitious gathering on the shore". The Church asked.', 'ines');
  S.NOTE('unesco_line', 'Sat. Peralta: the Zona was inscribed by UNESCO in 1990; "significant alterations to be notified". To Paris.', 'ines');
  S.NOTE('seal_taken', 'Sat. The palace\'s purple seal, on my place card. Kept.', 'ines');
  S.NOTE('lalo_met', 'Sat. Lalo played for Tata as a boy. Papá Lilo, the last of the old drummers, at the gallera in Villa Consuelo. "Take him two bottles."');
  S.NOTE('sisters_in', 'Sat. The perm sisters will come to the shore and sing. "Nobody asked."');
  S.NOTE('notebook_got', 'Sat. Moncho didn\'t burn it. Tata\'s blue exercise book: sixty years of the shore.');
  S.DEDUCE('pins_marked', 'bands_two', 'overlay_made', { when: () => fri(), run: async () => { await say('alan_fri_620', 'ines_fri_621', 'alan_fri_622'); F().ines_roof = true; G.refreshNpcs(); } });
  S.NAPKIN.bell.push(['carbon_found', 'The 1930 carbon: the Church asked'], ['unesco_line', 'Paris: the UNESCO dossier (Peralta)']);
  S.NAPKIN.salves.push(['sisters_in', 'The perm sisters (Doña Ercilia, Doña Mercedes)']);

  // ---------------------------------------------------------------- hints, in story order
  S.HINT(f => f.ch === 4 && !f.chart_fri, 'parrot_fri_01', 'mireya_fri_hint_01');
  S.HINT(f => f.ch === 4 && !f.watch_done, 'parrot_fri_02', 'mireya_fri_hint_02');
  S.HINT(f => f.ch === 4 && !f.moncho_sweet, 'parrot_fri_03', 'mireya_fri_hint_03');
  S.HINT(f => f.ch === 4 && !f.moncho_fri, 'parrot_fri_04', 'mireya_fri_hint_04');
  S.HINT(f => f.ch === 4 && !f.wall_fri, 'parrot_fri_05', 'mireya_fri_hint_05');
  S.HINT(f => f.ch === 4 && !f.overlay_made, 'parrot_fri_06', 'mireya_fri_hint_06');
  S.HINT(f => f.ch === 4 && !f.fri_done, 'parrot_fri_06', 'mireya_fri_hint_07');
  S.HINT(f => f.ch === 5 && !f.rum_sat, 'parrot_sat_01', 'mireya_sat_hint_01');
  S.HINT(f => f.ch === 5 && !f.yol_met, 'parrot_sat_02', 'mireya_sat_hint_02');
  S.HINT(f => f.ch === 5 && !f.yol_story, 'parrot_sat_04', 'mireya_sat_hint_04');
  S.HINT(f => f.ch === 5 && f.as === 'ines' && !f.letter1930, 'parrot_sat_05', 'ines_sat_hint_05');
  S.HINT(f => f.ch === 5 && f.as === 'ines' && !f.carbon_found, 'parrot_sat_05', 'ines_sat_hint_06');
  S.HINT(f => f.ch === 5 && f.as === 'ines' && !f.seal_taken, 'parrot_sat_07', 'ines_sat_hint_07');
  S.HINT(f => f.ch === 5 && !f.jacket_given, 'parrot_sat_08', 'mireya_sat_hint_08');
  S.HINT(f => f.ch === 5 && !f.sisters_in, 'parrot_sat_09', 'mireya_sat_hint_09');
  S.HINT(f => f.ch === 5 && !f.sat_done, 'parrot_sat_09', 'mireya_sat_hint_10');

  // ---------------------------------------------------------------- the hub on these days
  S.open('hostal', f => f.ch === 4 || f.ch === 5);
  S.open('parque', f => f.ch === 4 && !f.moncho_fri);
  S.open('conde', f => (f.ch === 4 && f.watch_done && !f.moncho_fri) || (f.ch === 5 && f.notebook_got && f.as !== 'ines'));
  S.open('palace', f => (f.ch === 4 && f.watch_done && !f.moncho_fri) || (f.ch === 5 && f.as === 'ines' && f.carbon_found && !f.dinner_done));
  S.open('wall', f => f.ch === 4 && f.tap_fri && !f.wall_fri);
  S.open('santon', f => f.ch === 5 && f.as !== 'ines' && !f.rum_sat);
  S.open('market', f => f.ch === 5 && f.as !== 'ines' && f.rum_sat && !f.veve_done);
  S.open('cathedral', f => f.ch === 5 && f.as === 'ines' && !f.carbon_found);
  S.open('bar', f => f.ch === 5 && f.jacket_given && !f.sat_done);
  S.pinNext(f => {
    if (f.ch === 4) return !f.watch_done ? 'parque' : !f.moncho_sweet ? 'conde' : !f.moncho_fri ? 'palace' : !f.tap_fri ? 'hostal' : !f.wall_fri ? 'wall' : 'hostal';
    if (f.ch === 5) {
      if (f.as === 'ines') return !f.carbon_found ? 'cathedral' : 'palace';
      return !f.rum_sat ? 'santon' : !f.veve_done ? 'market' : !f.jacket_given ? 'conde' : 'bar';
    }
    return null;
  });
  // Friday: today's pin on Mireya's chart before the city (the chain mapLock keeps any other part's lock)
  { const prev = S.mapLock; S.mapLock = () => (fri() && !F().chart_fri ? 'alan_fri_need_chart' : null) || (prev ? prev() : null); }

  // ================================================================ FRIDAY
  S.START[4] = async function () {
    const f = F();
    f.bg_hostal_courtyard = null; f.bg_parque_colon = null;
    if (S.who() !== 'alan') S.becomeAlan();
    await G.goRoom('hostal_room4', 'courtyard', { instant: true, noEnter: true, pos: [500, 660, 'e'] });
    await S.day(4);
    S.pulse(2);
    await G.fade(false);
    await say('narr_fri_001', 'alan_fri_002', 'vasco_fri_003');
  };
  S.person('hostal_room4', who('fs_vasco_r4', 'vasco', 900, 650, 'w', 'Vasco', () => fri() && !F().fri_breakfast,
    { look: 'vasco_fri_003', talk: 'vasco_fri_003' }));
  // the kitchen: breakfast, the radio, the chart
  S.person('hostal_kitchen', who('fs_mireya', 'mireya', 860, 660, 'w', 'Señora Mireya', () => (fri() || sat()) && asAlan(),
    { look: 'mireya_fri_look', talk: () => say(sat() ? 'mireya_sat_103' : 'mireya_fri_talk') }));
  S.onEnter('hostal_kitchen', S.once('fri_breakfast', async () => {
    if (!fri()) { F().fri_breakfast = false; return; }
    await say('narr_fri_004', 'radio_fri_005', 'mireya_fri_006', 'alan_fri_007', 'mireya_fri_008', 'mireya_fri_009');
  }));
  augment('hostal_kitchen', 'The hurricane chart', () => fri() || sat(), { rect: [665, 70, 270, 230], at: [800, 650],
    look: () => say(F().chart_pins && F().chart_pins[F().ch] ? 'alan_fri_chart_done' : 'alan_fri_look_chart'),
    use: async () => {
      const f = F();
      if (f.chart_pins && f.chart_pins[f.ch]) return say('alan_fri_chart_done');
      await say(fri() ? 'radio_4' : 'radio_5');
      await S.chart();
      if (fri()) { f.chart_fri = true; f.tobias_dries = true; f.bg_parque_colon = 'parque_colon__wet_morning'; await say('mireya_fri_010', 'alan_fri_011', 'mireya_fri_012'); }
      else f.chart_sat = true;
    } });

  // ---------------------------------------------------------------- F1: Parque Colón, the watchman
  const OBS = [['obs_trousers', 'alan_fri_obs_trousers', 'batista_fri_obs_trousers'], ['obs_puddle', 'alan_fri_obs_puddle', 'batista_fri_obs_puddle'],
    ['obs_band', 'alan_fri_obs_band', 'batista_fri_obs_band'], ['obs_fish', 'alan_fri_obs_fish', 'batista_fri_obs_fish']];
  const parqueOn = () => fri() && !F().moncho_fri;
  S.onEnter('parque_colon', async () => {
    const f = F();
    if (!fri() || f.watch_seen) return;
    f.watch_seen = true;
    await say('narr_fri_101', 'alan_fri_102', 'batista_fri_103', 'alan_fri_104', 'batista_fri_105', 'batista_fri_106');
  });
  S.person('parque_colon', who('fs_batista', 'batista', 760, 650, 'w', 'Sargento Batista', () => parqueOn() && !F().watch_done,
    { look: 'batista_fri_105', talk: () => say(F().watch_seen ? 'batista_fri_106' : 'batista_fri_105') }));
  S.person('parque_colon', who('fs_ledesma', 'ledesma', 1120, 640, 'w', 'A heavy man in a grey suit', () => parqueOn() && F().watch_obs >= 4 && !F().watch_done,
    { look: 'narr_fri_110', talk: 'batista_fri_113' }));
  const observe = (key, aline, bline) => async () => {
    const f = F();
    if (f.watch_done) return say('alan_fri_park_done');
    await say(aline);
    if (f[key]) return;
    f[key] = true; f.batista_trust = (f.batista_trust || 0) + 1; f.watch_obs = (f.watch_obs || 0) + 1;
    await say(bline);
    if (key === 'obs_band') f.bands_two = true;
    if (f.watch_obs >= 4) await S.watchEnd();
  };
  S.spot('parque_colon', { name: 'The watchman', rect: [880, 560, 240, 80], at: [860, 660], when: () => parqueOn() && !F().watch_done, look: 'alan_fri_look_watchman',
    use: 'alan_fri_look_watchman', talk: 'alan_fri_look_watchman' });
  S.spot('parque_colon', { name: 'His trousers', rect: [940, 600, 90, 40], at: [880, 660], when: () => parqueOn() && !F().watch_done, look: observe(...OBS[0]) });
  S.spot('parque_colon', { name: 'The puddle', rect: [580, 630, 230, 70], at: [700, 680], when: () => parqueOn() && !F().watch_done, look: observe(...OBS[1]) });
  S.spot('parque_colon', { name: 'The wet band', rect: [480, 470, 300, 150], at: [620, 650], when: () => parqueOn() && !F().watch_done, look: observe(...OBS[2]) });
  S.spot('parque_colon', { name: 'Something by his boot', rect: [1030, 610, 60, 40], at: [990, 670], when: () => parqueOn() && !F().watch_done, look: observe(...OBS[3]) });
  S.spot('parque_colon', { name: 'A bench', rect: [250, 450, 110, 70], at: [330, 650], when: () => parqueOn(), look: async () => { await say('alan_fri_obs_bench'); if (!F().watch_done) await say('batista_fri_obs_wrong'); } });
  S.watchEnd = async function () {
    const f = F();
    await say('batista_fri_107', 'alan_fri_108', 'batista_fri_109');
    G.refreshNpcs();
    await say('narr_fri_110', 'narr_fri_111', 'alan_fri_112', 'batista_fri_113');
    f.ledesma_seen = true;
    await S.cut('The bishop kneels', 'The bishop walks out of the cathedral in his good shoes, straight into the salt puddle, and kneels by the blanket. The crowd goes quiet. Across the roof of the black car, the driver is looking at the dead man.',
      'narr_fri_114', 'bishop_fri_115', 'alan_fri_116', 'narr_fri_117', 'alan_fri_118');
    f.moncho_known = true; f.watch_done = true; f.bands_two = true;
    G.refreshNpcs();
    await say('alan_fri_note_band');
  };

  // ---------------------------------------------------------------- F2: El Conde, the coconut sweet
  const SWEETS = [['Guava paste, in a block', 'guava'], ['Dulce de coco, each square in greaseproof paper', 'coco'], ['Dulce de leche, a brown fudge', 'leche'],
    ['Sesame brittle, in a twist of newspaper', 'sesame'], ['Tamarind balls, rolled in sugar', 'tamarind']];
  S.onEnter('el_conde', async () => { if (fri() && !F().conde_fri) { F().conde_fri = true; await say('narr_fri_201', 'alan_fri_202'); } });
  augment('el_conde', 'The sweet tray', () => fri() && F().watch_done && !F().moncho_fri, { rect: [20, 440, 200, 170], at: [220, 660],
    look: async () => { await G.closeup([{ img: 'close:elconde_tray', html: '' }, { img: 'close:tata_photo', html: '' }]); await say('alan_fri_look_photo_memory'); },
    use: async () => {
      const f = F();
      if (S.has('dulce_de_coco')) return say('alan_fri_look_sweet');
      await say('alan_fri_203', 'seller_fri_204');
      const pick = await S.choose('The sweet tray', 'Five kinds. Which one was on Tata\'s tray in the photograph?', SWEETS.map(([label, value]) => ({ label, value, correct: value === 'coco' })));
      S.sfx('coin', 0.5);
      if (pick === 'coco') { await say('seller_fri_206', 'alan_fri_207'); if (S.has('sweet')) S.take('sweet'); S.give('dulce_de_coco'); }
      else { await say('seller_fri_205'); if (!S.has('sweet')) S.give('sweet'); }
    } });

  // ---------------------------------------------------------------- F3: the palace courtyard, Moncho
  const palaceFri = () => fri() && F().watch_done && !F().moncho_fri;
  S.onEnter('palace_courtyard', async () => { if (palaceFri() && !F().palace_fri) { F().palace_fri = true; await say('narr_fri_301', 'alan_fri_302'); } });
  S.person('palace_courtyard', who('fs_moncho', 'moncho', 640, 640, 'w', 'Moncho', () => palaceFri(), {
    look: 'alan_fri_look_moncho',
    talk: async () => {
      const f = F();
      if (!f.bishop_lunch) return say('alan_fri_302');
      if (!f.moncho_sweet) return say('moncho_fri_305', 'moncho_fri_no_sweet');
      return S.monchoTalk();
    },
    items: {
      dulce_de_coco: async () => {
        const f = F();
        if (!f.bishop_lunch) return say('alan_fri_302');
        await say('moncho_fri_305', 'alan_fri_306', 'narr_fri_307');
        S.take('dulce_de_coco'); f.moncho_sweet = true;
        await say('moncho_fri_308', 'alan_fri_309', 'moncho_fri_310', 'alan_fri_311', 'moncho_fri_312', 'moncho_fri_313', 'moncho_fri_314', 'alan_fri_315');
        await S.monchoTalk();
      },
      sweet: async () => {
        if (!F().bishop_lunch) return say('alan_fri_302');
        S.take('sweet'); await say('moncho_fri_no_sweet', 'alan_fri_wrong_sweet');
      },
    } }));
  S.monchoTalk = async function () {
    await say('moncho_fri_316');
    let done = false;
    await G.dialog([
      { line: 'alan_fri_opt_book', run: () => say('moncho_fri_317'), bye: true },
      { line: 'alan_fri_opt_police', run: () => say('moncho_fri_318'), bye: true },
      { line: 'alan_fri_opt_truth', silent: true, run: async () => { done = true; await say('alan_fri_319', 'alan_fri_320'); }, bye: true },
    ]);
    if (!done) return;
    const f = F();
    await say('narr_fri_321', 'moncho_fri_322', 'narr_fri_323', 'alan_fri_324', 'moncho_fri_325', 'alan_fri_326', 'bishop_fri_327', 'narr_fri_328');
    f.lullaby_half = true; f.moncho_fri = true;
    G.refreshNpcs();
    // F4: on the way back, at the colmado
    await S.cut('Fello turns down a beer', 'San Antón, the colmado, late afternoon. The radio on the counter. Fello holds out a beer so cold it smokes; Alan shakes his head, and the big man\'s newspaper fan stops dead.',
      'radio_fri_401', 'fello_fri_402', 'fello_fri_403', 'alan_fri_404', 'fello_fri_405');
    await say('alan_fri_501');
  };
  S.spot('palace_courtyard', { name: 'The gallery doors', rect: [690, 280, 110, 140], at: [740, 650], when: () => palaceFri(), look: 'alan_fri_look_gallery' });
  S.spot('palace_courtyard', { name: 'Stone bench', rect: [20, 410, 180, 90], at: [180, 650], when: () => palaceFri(), look: 'alan_fri_look_bench',
    use: async () => { const f = F(); if (f.bishop_lunch) return say('alan_fri_look_bench'); await say('alan_fri_303'); await T(800); await say('narr_fri_304'); f.bishop_lunch = true; } });
  S.spot('palace_courtyard', { name: 'The bishop\'s car', rect: [220, 390, 380, 150], at: [420, 650], look: 'alan_fri_look_car' });
  S.spot('palace_courtyard', { name: 'Fountain', rect: [800, 300, 180, 170], at: [900, 650], look: 'alan_fri_look_fountain_palace' });

  // ---------------------------------------------------------------- F5: the fountain's tap; the wall
  S.spot('hostal_courtyard', { name: 'The fountain\'s tap', rect: [560, 380, 120, 120], at: [520, 660], when: () => fri() && F().moncho_fri && !F().tap_fri,
    look: 'alan_fri_look_tap',
    use: async () => { await say('narr_fri_502', 'mireya_fri_503', 'parrot_fri_504', 'mireya_fri_505', 'alan_fri_506'); F().tap_fri = true; } });
  S.person('city_wall', who('fs_vasco_w', 'vasco', 760, 650, 'w', 'Vasco', () => fri() && F().tap_fri && !F().dinner_fri,
    { look: 'vasco_fri_wall_talk', talk: () => say('vasco_fri_wall_talk') }));
  S.onEnter('city_wall', async () => {
    const f = F();
    if (!fri() || !f.tap_fri || f.wall_fri) return;
    await say('narr_fri_507', 'vasco_fri_508', 'alan_fri_509', 'alan_fri_510', 'narr_fri_511', 'vasco_fri_512', 'alan_fri_513', 'vasco_fri_514', 'vasco_fri_515', 'narr_fri_516', 'alan_fri_517', 'vasco_fri_518');
    f.wall_fri = true;
    await S.batistaDinner();
  });
  S.spot('city_wall', { name: 'El Faro a Colón', rect: [850, 90, 70, 120], at: [880, 650], look: 'alan_fri_look_lighthouse' });
  S.spot('city_wall', { name: 'The Ozama', rect: [0, 250, 1280, 60], at: [640, 650], look: 'alan_fri_look_river' });
  S.spot('city_wall', { name: 'The cannon', rect: [460, 330, 120, 160], at: [520, 650], look: 'alan_fri_look_cannon' });

  // ---------------------------------------------------------------- F6: Batista at dinner (the hostal courtyard by night)
  const dinnerOn = () => fri() && F().dinner_fri && !F().fri_done;
  S.person('hostal_courtyard', who('fs_batista_d', 'batista', 820, 650, 'w', 'Sargento Batista', () => dinnerOn() && !F().pins_marked, { look: 'batista_fri_609', talk: 'batista_fri_616' }));
  S.person('hostal_courtyard', who('fs_ines_d', 'ines', 1020, 660, 'w', 'Inês', () => dinnerOn() && !F().ines_roof,
    { look: 'ines_fri_619', talk: () => say(F().overlay_made ? 'ines_fri_621' : 'ines_fri_619') }));
  S.person('hostal_courtyard', who('fs_vasco_d', 'vasco', 380, 660, 'e', 'Vasco', () => dinnerOn(), { look: 'vasco_fri_614', talk: 'vasco_fri_614' }));
  S.batistaDinner = async function () {
    const f = F();
    await G.fade(true);
    f.dinner_fri = true; f.bg_hostal_courtyard = 'hostal_courtyard__night';
    await G.goRoom('hostal_courtyard', 'street', { instant: true, noEnter: true, pos: [600, 670, 'e'] });
    await G.fade(false);
    await say('narr_fri_601', 'batista_fri_602', 'batista_fri_603', 'alan_fri_604', 'batista_fri_605', 'batista_fri_606', 'batista_fri_607', 'ines_fri_608', 'batista_fri_609',
      'alan_fri_610', 'batista_fri_611', 'alan_fri_612', 'narr_fri_613', 'vasco_fri_614', 'alan_fri_615', 'batista_fri_616');
    f.rule5 = true;
    await say('alan_fri_617', 'alan_fri_618');
    f.pins_marked = true; f.pins_count = 5;
    G.refreshNpcs();
    await say('ines_fri_619');
    await say('alan_fri_need_overlay');
  };

  // ---------------------------------------------------------------- F7: the roof, and the dark patch at the reef
  {
    const roof = ROOMS.hostal_roof, fg = roof.animFg;
    roof.animFg = function (g, t) { if (fg) fg.call(this, g, t); if (fri() && F().ines_roof) S.drawPatch(g, t, 860, 226, 120, 10, 0.95); };
  }
  S.person('hostal_roof', who('fs_ines_roof', 'ines', 820, 650, 'w', 'Inês', () => fri() && F().ines_roof, { look: 'ines_fri_roof_talk', talk: 'ines_fri_roof_talk' }));
  S.spot('hostal_roof', { name: 'The dark patch', rect: [740, 205, 240, 40], at: [800, 650], when: () => fri() && F().ines_roof, look: 'alan_fri_look_patch' });
  S.onEnter('hostal_roof', async () => {
    const f = F();
    if (!fri() || !f.ines_roof || f.fri_done) return;
    await say('narr_fri_701', 'alan_fri_702', 'ines_fri_703', 'narr_fri_704', 'alan_fri_705', 'ines_fri_706', 'ines_fri_707', 'narr_fri_708', 'alan_fri_709', 'ines_fri_710');
    f.patch_reef = true; f.fri_done = true;
    await G.fade(true);
    await S.next(5);
  });
  // during the dinner the night courtyard keeps its lock on the street until the overlay is made
  { const prev = S.mapLock; S.mapLock = () => (dinnerOn() && !F().overlay_made ? 'alan_fri_need_overlay' : null) || (prev ? prev() : null); }

  // ================================================================ SATURDAY
  S.START[5] = async function () {
    const f = F();
    f.bg_parque_colon = null; f.bg_hostal_courtyard = null;
    if (S.who() !== 'alan') S.becomeAlan();
    if (!S.has('linen_jacket')) S.give('linen_jacket', true);
    if (!S.has('dollars')) S.give('dollars', true);
    await G.goRoom('hostal_kitchen', 'courtyard', { instant: true, noEnter: true, pos: [600, 670, 'e'] });
    await S.day(5);
    S.pulse(3);
    G.refreshNpcs();
    await G.fade(false);
    await say('narr_sat_101', 'radio_sat_102', 'mireya_sat_103', 'narr_sat_104', 'ines_sat_105', 'alan_sat_106', 'ines_sat_107', 'vasco_sat_108', 'ines_sat_109', 'alan_sat_110', 'vasco_sat_111');
    f.sat_breakfast = true;
    G.refreshNpcs();
  };
  S.person('hostal_kitchen', who('fs_ines_k', 'ines', 1040, 670, 'w', 'Inês', () => sat() && !F().sat_breakfast, { look: 'ines_sat_105', talk: 'ines_sat_105' }));
  S.person('hostal_kitchen', who('fs_vasco_k', 'vasco', 380, 670, 'e', 'Vasco', () => sat() && !F().sat_breakfast, { look: 'vasco_sat_111', talk: 'vasco_sat_111' }));
  S.spot('hostal_kitchen', { name: 'The mangú', rect: [420, 380, 160, 70], at: [500, 660], when: () => sat(), look: 'alan_sat_look_mangu' });

  // ---------------------------------------------------------------- S2: the rum, at Fello's
  S.person('san_anton', who('fs_fello', 'fello', 760, 640, 'w', 'Fello', () => sat() && asAlan() && !F().rum_sat, {
    look: 'alan_sat_look_shelf',
    talk: async () => { const f = F(); if (!f.rum_sent) { f.rum_sent = true; return say('fello_sat_201'); } return say(f.rum_asked ? 'fello_sat_204' : 'fello_sat_201'); },
    items: { dollars: () => S.buyRum(), any: 'fello_sat_202' } }));
  S.spot('san_anton', { name: 'Fello\'s shelf', rect: [300, 200, 120, 160], at: [380, 640], when: () => sat() && !F().rum_sat,
    look: 'alan_sat_look_shelf', use: async () => { await say('alan_sat_cheap_rum', 'fello_sat_202'); F().rum_sent = true; } , take: async () => { await say('alan_sat_cheap_rum', 'fello_sat_202'); F().rum_sent = true; } });
  S.spot('san_anton', { name: 'Behind the counter', rect: [440, 210, 120, 170], at: [520, 640], when: () => sat() && !F().rum_sat,
    look: 'alan_sat_look_counter',
    use: async () => { const f = F(); if (!f.rum_sent) return say('alan_sat_look_counter'); await say('alan_sat_203', 'fello_sat_204', 'alan_sat_205'); f.rum_asked = true; },
    items: { dollars: () => S.buyRum() } });
  S.buyRum = async function () {
    const f = F();
    if (!f.rum_asked) { f.rum_sent = true; f.rum_asked = true; await say('fello_sat_201', 'alan_sat_203', 'fello_sat_204'); }
    S.take('dollars'); S.sfx('cash_register', 0.5);
    await say('fello_sat_206', 'fello_sat_207');
    f.rum = (f.rum || 0) + 1; S.give('rum');
    f.rum_sat = true;
    G.refreshNpcs();
  };

  // ---------------------------------------------------------------- S3: the market, the candle aisle, Yolande
  S.onEnter('market_hall', async () => { if (sat() && !F().market_seen) { F().market_seen = true; await say('narr_sat_301'); } });
  S.spot('market_hall', { name: 'Drain grating', rect: [470, 590, 160, 40], at: [550, 670], look: 'alan_sat_look_grating_hall' });
  S.spot('market_hall', { name: 'The fruit stall', rect: [300, 230, 300, 230], at: [450, 650], look: 'alan_sat_look_hall' });
  S.spot('market_hall', { name: 'Paintings for tourists', rect: [900, 320, 360, 220], at: [1000, 650], look: 'alan_sat_look_flags' });
  {
    const aisle = ROOMS.candle_aisle;
    const cur = aisle.hotspots.find(h => h.name === 'Behind Yolande\'s curtain');
    if (cur) { cur.rect = [690, 190, 110, 250]; cur.at = [745, 650]; cur.locked = () => sat() && !F().drain_done; cur.lockedLine = () => 'yolande_sat_talk_again'; }
    const fg = aisle.animFg;
    aisle.animFg = function (g, t) { if (fg) fg.call(this, g, t); S.drawWater(g, t, S.water.candle_aisle || 0); };
  }
  S.spot('candle_aisle', { name: 'Saint candles', rect: [0, 100, 200, 360], at: [200, 650], look: 'alan_sat_look_candles' });
  S.spot('candle_aisle', { name: 'Amarra Hombre', rect: [1100, 240, 180, 300], at: [1080, 650], look: 'alan_sat_look_bottles' });
  S.spot('candle_aisle', { name: 'Sequinned flags', rect: [860, 60, 120, 140], at: [900, 650], look: 'alan_sat_look_flags' });
  S.spot('candle_aisle', { name: 'Yolande\'s sign', rect: [580, 100, 140, 70], at: [650, 650], look: 'alan_sat_look_sign' });
  S.spot('candle_aisle', { name: 'Drain grating', rect: [580, 650, 160, 40], at: [660, 680], look: () => say(sat() ? 'alan_sat_look_grating' : 'alan_sat_look_grating_hall') });
  S.person('candle_aisle', who('fs_yolande', 'yolande', 920, 660, 'w', 'Manman Yolande', () => sat() && asAlan() && !F().drain_done, {
    look: 'alan_sat_look_yolande', talk: () => S.meetYolande(), items: { rum: () => S.meetYolande() } }));
  S.meetYolande = async function () {
    const f = F();
    if (!f.yol_met) await say('yolande_sat_302');
    if (!f.rum_on_counter) {
      if (!S.has('rum')) return say('alan_sat_need_rum');
      await say('alan_sat_303', 'yolande_sat_304');
      f.rum = Math.max(0, (f.rum || 1) - 1); if (!f.rum) S.take('rum'); else G.renderInv();
      f.rum_on_counter = true;
    } else await say('yolande_sat_304');
    f.yol_met = true;
    let truth = false;
    await G.dialog([
      { line: 'alan_sat_opt_tourist', run: () => say('yolande_sat_305'), bye: true },
      { line: 'alan_sat_opt_writer', run: () => say('yolande_sat_306'), bye: true },
      { line: 'alan_sat_opt_truth', run: () => { truth = true; }, bye: true },
    ]);
    if (!truth) return;
    await say('narr_sat_307', 'yolande_sat_308', 'yolande_sat_309');
    await S.drain();
  };

  // ---------------------------------------------------------------- S4: the drain (a Sea grip)
  S.drain = async function () {
    const f = F();
    G.autosave();
    const GRIP = [
      { label: 'Pull at your own legs', value: 'struggle', a: 'alan_sat_grip_struggle', b: 'narr_sat_grip_struggle' },
      { label: 'Hold your breath', value: 'breath', a: 'alan_sat_grip_breath', b: 'narr_sat_grip_breath' },
      { label: 'Shout for Vasco', value: 'vasco', a: 'alan_sat_grip_vasco', b: 'narr_sat_grip_vasco' },
      { label: 'The Barceló on the counter, by Yolande\'s hand: "Yolande! The rum!"', value: 'rum', correct: true },
    ];
    for (;;) {
      S.water.candle_aisle = 0; S.pulse(5);
      await say('narr_sat_401', 'alan_sat_402');
      await S.waterTo('candle_aisle', 0.12, 1200);
      await say('narr_sat_403', 'yolande_sat_404');
      let missed = 0, ok = false;
      while (missed < 3) {
        const pick = await S.timedChoice({ title: 'The water is rising', text: 'Alan can\'t move. The cursor finds only what somebody else could do.', options: GRIP, seconds: 9 });
        if (pick === 'rum') { ok = true; break; }
        const o = GRIP.find(x => x.value === pick);
        if (o) await say(o.a, o.b); else await say('alan_timeout');
        missed++;
        await S.waterTo('candle_aisle', 0.12 + missed * 0.16, 700);
      }
      if (ok) break;
      await S.drown('The sea came up through the drain of the candle aisle, and Alan was too frightened to see what was near Yolande\'s hand.');
    }
    await say('alan_sat_405', 'narr_sat_406');
    await S.waterTo('candle_aisle', 0, 900);
    S.water.candle_aisle = 0; S.pulse(3);
    await say('narr_sat_407', 'yolande_sat_408', 'alan_sat_409', 'yolande_sat_410', 'yolande_sat_411');
    f.drain_done = true; f.rule10 = true; f.rule11 = true;
    G.refreshNpcs();
    await G.goRoom('yolande_back_room', 'aisle');
  };

  // ---------------------------------------------------------------- S5, S6: the back room; the vèvè
  S.person('yolande_back_room', who('fs_yolande_b', 'yolande', 760, 660, 'w', 'Manman Yolande', () => sat() && F().drain_done && asAlan(), {
    look: 'alan_sat_look_yolande',
    talk: async () => {
      if (!F().veve_done) return say('yolande_sat_602');
      await G.dialog([
        { label: 'Can I try the drawing again?', run: () => S.veve() },
        { line: 'alan_sat_609', once: true, run: () => say('yolande_sat_610') },
        { label: 'Goodbye, Manman.', bye: true, run: () => say('yolande_sat_talk_again') },
      ]);
    } }));
  S.spot('yolande_back_room', { name: 'The little boat', rect: [590, 240, 170, 60], at: [680, 660], look: 'alan_sat_look_boat' });
  S.spot('yolande_back_room', { name: 'The altar', rect: [440, 300, 600, 120], at: [700, 660], look: 'alan_sat_look_altar' });
  S.onEnter('yolande_back_room', async () => {
    const f = F();
    if (!sat() || !f.drain_done || f.yol_story) return;
    await say('narr_sat_501', 'yolande_sat_502', 'alan_sat_503', 'yolande_sat_504', 'yolande_sat_505', 'alan_sat_506', 'yolande_sat_507', 'alan_sat_508', 'yolande_sat_509',
      'yolande_sat_510', 'alan_sat_511', 'yolande_sat_512');
    f.yol_story = true; f.rule6 = true; f.followed_light = true; f.ledesma_list = true;
    await say('narr_sat_601', 'yolande_sat_602', 'narr_sat_603', 'yolande_sat_604');
    await S.veve();
    await say('alan_sat_605', 'yolande_sat_606', 'alan_sat_609', 'yolande_sat_610');
    f.veve_done = true;
    await say('narr_sat_611');
    await S.switchTo('ines', 'cathedral_archive', 'cloister');
  });
  // The vèvè memory puzzle. PLACEHOLDER: these are the plain boat-sign parts drawn by scripts/veve_placeholder.py, not
  // Agwe's vèvè; the real sign awaits the Dominican and Haitian consultant read the bible requires.
  const VEVE = [['hull', 'The hull: a crescent boat', ['A fish', 'A coiled snake']], ['mast', 'The mast, straight up from the middle', ['A cross on a hill', 'A tree']],
    ['sail', 'The sail: a triangle to the right of the mast', ['A square flag', 'A star']], ['flag', 'The little flag at the top of the mast, pointing left', ['A bird', 'Nothing']],
    ['waves', 'Three wave lines under the hull', ['One wave', 'A ladder']], ['crosses', 'Two crosses, either side of the mast', ['Two hearts', 'Two eyes']],
    ['stars', 'Four stars round the edge', ['Two moons', 'A circle of dots']]];
  S.veve = async function () {
    const f = F();
    const secs = (S.relaxed() ? 16 : 8) * 1000;
    await G.closeup([{ html: '<div style="background:#2e221a;padding:2%;text-align:center"><img src="art/closeups/veve_whole.png" style="max-height:62vh;max-width:70vw"><p style="color:#f0d79a;font-family:Cinzel,serif">Look hard. Eight seconds.</p><p style="color:#a99;font-size:.7em">(Placeholder sign: the real vèvè waits for the consultant read.)</p></div>' }], { auto: secs });
    let right = 0;
    for (let i = 0; i < VEVE.length; i++) {
      const [k, good, bad] = VEVE[i];
      const opts = [{ label: good, value: k, correct: true }].concat(bad.map((b, j) => ({ label: b, value: 'x' + j })));
      for (let n = opts.length - 1; n > 0; n--) { const m = Math.floor(Math.random() * (n + 1)); [opts[n], opts[m]] = [opts[m], opts[n]]; }
      const pick = await S.choose(`Agwe's boat, from memory (${i + 1} of ${VEVE.length})`, `<img src="art/closeups/veve_part_${i ? VEVE[i - 1][0] : 'hull'}.png" style="height:12vh;background:#2e221a;${i ? '' : 'opacity:0'}"><br>What came next in her drawing?`, opts);
      if (pick === k) right++;
    }
    const acc = right / VEVE.length;
    f.veve_accuracy = Math.max(f.veve_accuracy || 0, acc);
    if (!S.has('veve_sketch')) S.give('veve_sketch'); else G.renderInv();
    await say(acc >= 0.85 ? 'yolande_sat_608' : 'yolande_sat_607');
  };

  // ---------------------------------------------------------------- S7: Inês, the 1930 trail (the cathedral archive)
  const arch = () => sat() && asInes();
  S.person('cathedral_archive', who('fs_ulises', 'ulises', 1000, 650, 'w', 'Padre Ulises', () => arch(), { look: 'ines_sat_look_ulises', talk: 'ulises_sat_talk' }));
  S.onEnter('cathedral_archive', async () => { const f = F(); if (arch() && !f.arch_sat) { f.arch_sat = true; await say('narr_sat_701', 'ulises_sat_702', 'ines_sat_703', 'ulises_sat_704'); } });
  S.spot('cathedral_archive', { name: 'Chapter acts, 1930', rect: [270, 60, 300, 360], at: [420, 650], when: arch, look: 'ines_sat_look_acts',
    use: async () => { await say('ines_sat_acts_read'); F().acts_1930 = true; } });
  S.spot('cathedral_archive', { name: 'The 1930 folder', rect: [620, 455, 150, 35], at: [700, 650], when: arch, look: 'ines_sat_look_folder',
    use: async () => { await say('ines_sat_folder_read'); F().date_1930 = true; } });
  S.spot('cathedral_archive', { name: 'A card on the desk', rect: [780, 450, 80, 30], at: [820, 650], when: arch,
    look: async () => { await say('ines_sat_look_colombina'); F().index_quirk = true; } });
  S.spot('cathedral_archive', { name: 'Correspondence card index', rect: [950, 290, 160, 200], at: [1030, 650], when: arch, look: 'ines_sat_look_index',
    use: async () => {
      const f = F();
      if (f.letter1930) return say('ines_sat_letter_read');
      if (!f.index_quirk) return say('ines_sat_index_g');
      const pick = await S.choose('The card index', 'Where would a man who files by the last word put "Guardia Nacional"?',
        [{ label: 'G', value: 'g' }, { label: 'N', value: 'n', correct: true }, { label: 'S (Santo Domingo)', value: 's' }, { label: 'P (Policía)', value: 'p' }]);
      if (pick !== 'n') return say(pick === 'g' ? 'ines_sat_index_g' : 'ines_sat_index_wrong');
      await say('ines_sat_index_n', 'ines_sat_letter_read');
      f.letter1930 = true; S.give('letter1930');
    } });
  S.spot('cathedral_archive', { name: 'Outgoing copybooks', rect: [20, 80, 230, 340], at: [180, 650], when: arch, look: 'ines_sat_look_copybooks',
    use: async () => {
      const f = F();
      if (f.carbon_found) return say('ines_sat_carbon_read');
      if (!f.letter1930 || !f.date_1930) return say('ines_sat_copybooks_early');
      await say('ines_sat_carbon_read', 'ines_sat_705', 'ulises_sat_706');
      f.carbon_found = true; S.give('carbon');
      await say('ines_sat_trail_done');
    } });
  S.spot('cathedral_archive', { name: 'The reading table', rect: [460, 490, 420, 60], at: [640, 660], when: arch, look: 'ines_sat_look_chairs' });

  // ---------------------------------------------------------------- S8: Inês, the bishop's dinner (the palace dining room)
  const dinner = () => sat() && asInes() && F().carbon_found && !F().dinner_left;
  S.person('palace_dining', who('fs_bishop_d', 'bishop', 230, 650, 'e', 'The bishop', () => dinner(), { look: 'ines_sat_look_bishop', talk: 'bishop_sat_826' }));
  S.person('palace_dining', who('fs_secretary_d', 'secretary', 500, 655, 'e', 'The Nuncio\'s secretary', () => dinner(), { look: 'ines_sat_look_secretary', talk: 'secretary_sat_804' }));
  S.person('palace_dining', who('fs_peralta_d', 'peralta', 780, 655, 'w', 'Licenciado Peralta', () => dinner(), { look: 'ines_sat_look_peralta', talk: 'peralta_sat_820' }));
  S.person('palace_dining', who('fs_vasco_d2', 'vasco', 1050, 660, 'w', 'Vasco', () => dinner(), { look: 'ines_sat_look_vasco_d', talk: 'vasco_sat_dinner_talk' }));
  S.spot('palace_dining', { name: 'Your place card', rect: [440, 410, 110, 30], at: [500, 660], when: () => dinner() && F().dinner_done && !F().seal_taken,
    look: async () => { F().card_looked = true; await say('ines_sat_look_card'); },
    take: async () => { const f = F(); if (!f.card_looked) return say('ines_sat_take_card_first'); await say('ines_sat_take_card'); f.seal_taken = true; S.give('wax_seal'); },
    use: async () => { const f = F(); if (!f.card_looked) return say('ines_sat_take_card_first'); await say('ines_sat_take_card'); f.seal_taken = true; S.give('wax_seal'); } });
  S.spot('palace_dining', { name: 'Candelabra', rect: [360, 280, 120, 80], at: [420, 660], when: () => sat(), look: 'ines_sat_look_candles_d' });
  S.spot('palace_dining', { name: 'Saints in gold frames', rect: [60, 80, 130, 190], at: [200, 660], when: () => sat(), look: 'ines_sat_look_paintings' });
  {
    const out = ROOMS.palace_dining.hotspots.find(h => h.exit === 'palace_courtyard');
    if (out) { out.locked = () => dinner() && !F().seal_taken; out.lockedLine = () => 'ines_sat_leave_early'; }
  }
  S.onEnter('palace_dining', async () => { if (dinner() && !F().dinner_done) await S.bishopDinner(); });
  S.bishopDinner = async function () {
    const f = F();
    await say('narr_sat_801', 'bishop_sat_802', 'canon_sat_803');
    let ok = 0;
    const q1 = await S.choose('Señora Teles', '"And how did you meet our Doctor Teles, señora?" (Vasco wrote "a gift from the Church in Lisbon"; the bishop\'s fax said "your assistant".)',
      [{ label: 'At work. I\'m his assistant: his assistant first, and then his wife.', value: 'work', correct: true }, { label: 'Through the Church. He was a gift from the Church in Lisbon. To me.', value: 'church' }, { label: 'At a party. In Paris. There was a lot of champagne.', value: 'party' }]);
    await say(q1 === 'work' ? 'ines_sat_a1_work' : q1 === 'church' ? 'ines_sat_a1_church' : 'ines_sat_a1_party');
    if (q1 === 'work') { ok++; await say('secretary_sat_804'); } else await say('secretary_sat_805');
    await say('canon_sat_806');
    const q2 = await S.choose('Señora Teles', '"And children, señora? God willing?"',
      [{ label: 'Three. All boys. All in the seminary.', value: 'three' }, { label: 'Not yet. We work too much. The bells always come first.', value: 'notyet', correct: true }, { label: 'None. We don\'t— I mean, we can\'t. I mean, no.', value: 'none' }]);
    await say(q2 === 'three' ? 'ines_sat_a2_three' : q2 === 'notyet' ? 'ines_sat_a2_notyet' : 'ines_sat_a2_none');
    if (q2 === 'notyet') { ok++; await say('secretary_sat_807'); } else await say(q2 === 'three' ? 'canon_sat_808' : 'vasco_sat_810');
    await say('canon_sat_809');
    const q3 = await S.choose('Señora Teles', '"And does Doctor Teles snore?"',
      [{ label: 'Like a bell-founder\'s bellows. I take notes. For the archive.', value: 'snores', correct: true }, { label: 'I wouldn\'t know. We have separate rooms.', value: 'dunno' }, { label: 'Never. He sleeps like an angel. With his hands folded.', value: 'angel' }]);
    await say(q3 === 'snores' ? 'ines_sat_a3_snores' : q3 === 'dunno' ? 'ines_sat_a3_dunno' : 'ines_sat_a3_angel', 'vasco_sat_810');
    if (q3 === 'snores') ok++;
    f.teles_ok = ok;
    if (ok === 3) await say('secretary_sat_811', 'ines_sat_813'); else await say('secretary_sat_812', 'ines_sat_814');
    // Peralta, under the soup (a course later if she slipped)
    await say('narr_sat_815', 'peralta_sat_816');
    for (;;) {
      const p = await S.choose('Under the soup', '', [{ label: 'The soup is very good.', value: 'soup' }, { label: 'Who gives permission to take a bell out of a World Heritage cathedral?', value: 'perm', correct: true }]);
      if (p === 'perm') break;
      await say('ines_sat_opt_soup', 'peralta_sat_817');
    }
    await say('ines_sat_opt_permissions', 'peralta_sat_818', 'ines_sat_819', 'peralta_sat_820');
    f.unesco_line = true;
    await S.cut('The grandmother speech', 'The bishop at the head of his table, candlelight on the ring. He speaks of his grandmother in Gualey, the candles under her bed, her fear; the canons look at their plates. Inês watches his hands.',
      'narr_sat_821', 'bishop_sat_822', 'bishop_sat_823', 'ines_sat_824');
    await say('bishop_sat_825');
    const d = await S.choose('Your friend. Señor Sanches.', 'Inês always defends Alan. How?', [
      { label: 'Dry: "Curiosity is a professional deformity. Like gout, for canons."', value: 'dry', correct: true },
      { label: 'Fierce: "The bravest man at this table, Excellency."', value: 'fierce' },
      { label: 'Funny: "His days are a disaster. That\'s what I\'m for."', value: 'funny' }]);
    await say('ines_sat_def_' + d, 'bishop_sat_826');
    f.defence_style = d; f.dinner_done = true;
  };
  S.onEnter('palace_courtyard', async () => {
    const f = F();
    if (!sat() || !asInes() || !f.seal_taken || f.dinner_left) return;
    f.dinner_left = true;
    await say('ines_sat_827', 'vasco_sat_828');
    await G.fade(true);
    await S.cut('Moncho at the fountain', 'Nearly midnight, the hostal courtyard. Moncho sits on the edge of the fountain with a swollen blue exercise book on his knees and a box of matches beside him, unused. Inês in her dinner dress. He moves over; she sits; they read.',
      'narr_sat_901', 'moncho_sat_902', 'moncho_sat_903', 'ines_sat_904', 'narr_sat_905');
    f.notebook_got = true;
    S.give('tata_notebook', true);
    await S.switchTo('alan', 'el_conde', 'default', [300, 660, 'e']);
  });

  // ---------------------------------------------------------------- S10: Yunior on El Conde
  const condeSat = () => sat() && asAlan() && F().notebook_got && !F().jacket_given;
  S.onEnter('el_conde', async () => { if (condeSat() && !F().conde_sat) { F().conde_sat = true; await say('narr_sat_1001'); } });
  S.person('el_conde', who('fs_yunior', 'yunior', 760, 640, 'w', 'Yunior', () => condeSat(), {
    look: 'alan_sat_look_yunior',
    talk: async () => { await say('yunior_sat_1002', 'alan_sat_1003', 'yunior_sat_1004', 'yunior_sat_1005'); F().yunior_asked = true; },
    items: { linen_jacket: async () => {
      const f = F();
      if (!f.yunior_asked) await say('yunior_sat_1002', 'alan_sat_1003', 'yunior_sat_1004', 'yunior_sat_1005');
      await say('alan_sat_1006', 'yunior_sat_1007');
      S.take('linen_jacket'); f.jacket_given = true; f.yunior_has_jacket = true;
      G.refreshNpcs();
    }, any: 'yunior_sat_no_jacket' } }));

  // ---------------------------------------------------------------- S11–S13: the blue-door bar
  const bar = () => sat() && asAlan() && F().jacket_given && !F().bar_done;
  S.onEnter('blue_door_bar', async () => { if (bar() && !F().bar_seen) { F().bar_seen = true; await say('narr_sat_1101'); } });
  S.person('blue_door_bar', who('fs_lalo', 'lalo', 520, 600, 'e', 'Lalo', () => bar(), {
    look: 'alan_sat_look_lalo',
    talk: async () => {
      const f = F();
      if (f.lalo_met) return say('lalo_sat_talk_again');
      await say('lalo_sat_1102', 'alan_sat_1103', 'lalo_sat_1104', 'alan_sat_1105', 'narr_sat_1106', 'lalo_sat_1107', 'lalo_sat_1108', 'alan_sat_1109', 'lalo_sat_1110', 'lalo_sat_1111');
      f.lalo_met = true; S.give('lilo_address');
      if (f.sisters_in) await S.vascoArrives();
    } }));
  S.person('blue_door_bar', who('fs_sisters', 'sisters', 820, 590, 'w', 'The perm sisters', () => bar(), {
    look: 'alan_sat_look_sisters',
    talk: async () => {
      const f = F();
      if (f.sisters_in) return say('sisters_sat_1119');
      if (!f.lalo_met) return say('alan_sat_look_sisters');
      await say('ercilia_sat_1112', 'alan_sat_1113', 'ercilia_sat_1114', 'sisters_sat_1115', 'alan_sat_1116', 'ercilia_sat_1117', 'lalo_sat_1118', 'sisters_sat_1119');
      f.sisters_in = true;
      await S.vascoArrives();
    } }));
  S.spot('blue_door_bar', { name: 'Hairdresser\'s chair', rect: [870, 290, 90, 110], at: [900, 620], look: 'alan_sat_look_chair' });
  S.spot('blue_door_bar', { name: 'The drum on the stage', rect: [1140, 310, 80, 130], at: [1080, 620], look: 'alan_sat_look_drum' });
  S.spot('blue_door_bar', { name: 'The mirror', rect: [870, 140, 110, 120], at: [920, 620], look: 'alan_sat_look_mirror' });
  S.person('blue_door_bar', who('fs_vasco_bar', 'vasco', 640, 640, 'w', 'Vasco', () => bar() && F().vasco_bar, { look: 'alan_sat_look_dance', talk: 'vasco_sat_1215' }));
  S.person('blue_door_bar', who('fs_dario', 'dario', 1000, 610, 'w', 'Darío', () => bar() && F().vasco_bar, { look: 'alan_sat_look_dario', talk: 'dario_sat_1301' }));
  S.vascoArrives = async function () {
    const f = F();
    f.vasco_bar = true; G.refreshNpcs();
    await say('vasco_sat_1201', 'alan_sat_1202', 'vasco_sat_1203', 'narr_sat_1204', 'alan_sat_1205', 'vasco_sat_1206');
    for (;;) {
      const d = await S.choose('The bachata', 'Vasco has your hand. Sway the hips; follow the hand.', [{ label: 'Try to lead', value: 'lead' }, { label: 'Follow the sway', value: 'follow', correct: true }]);
      if (d === 'follow') break;
      await say('vasco_sat_dance_lead');
    }
    await say('narr_sat_1207', 'alan_sat_1208', 'vasco_sat_1209', 'narr_sat_1210', 'alan_sat_1211', 'vasco_sat_1212', 'vasco_sat_1213', 'vasco_sat_1213_' + (f.defence_style || 'dry'), 'alan_sat_1214', 'vasco_sat_1215');
    // S13: Darío (optional)
    await say('dario_sat_1301', 'vasco_sat_1302');
    const go = await S.choose('Darío', 'A roof, a cassette, and nowhere to be.', [{ label: 'Go up to the roof with Darío and Vasco', value: 'yes' }, { label: 'Thank him, and walk home along the wall with Vasco', value: 'no', correct: true }]);
    f.bar_done = true;
    if (go === 'yes') {
      f.dario_night = true;
      await G.fade(true);
      await G.goRoom('dario_roof', null, { instant: true, noEnter: true, pos: [700, 660, 'w'] });
      await G.fade(false);
      await say('narr_sat_1303', 'vasco_sat_1304');
      await G.fade(true);
      await say('narr_sat_1305');
      await G.fade(false);
      await say('narr_sat_1306', 'dario_sat_1307');
    }
    await G.fade(true);
    await say('narr_sat_1308', 'alan_sat_1309', 'vasco_sat_1310');
    await S.dawnFountain();
  };
  S.person('dario_roof', who('fs_dario_r', 'dario', 900, 640, 'w', 'Darío', () => sat() && F().dario_night, { look: 'alan_sat_look_dario', talk: 'dario_sat_1307' }));
  S.person('dario_roof', who('fs_vasco_r', 'vasco', 420, 650, 'e', 'Vasco', () => sat() && F().dario_night, { look: 'vasco_sat_1304', talk: 'vasco_sat_1304' }));
  S.spot('dario_roof', { name: 'The cassette player', rect: [120, 520, 90, 60], at: [200, 650], look: 'alan_sat_look_cassette' });
  S.spot('dario_roof', { name: 'The mattress', rect: [80, 430, 470, 130], at: [400, 650], look: 'alan_sat_look_mattress' });
  S.spot('dario_roof', { name: 'El Faro\'s cross', rect: [820, 100, 60, 90], at: [840, 650], look: 'alan_fri_look_lighthouse' });

  // ---------------------------------------------------------------- S14: dawn at the fountain
  S.person('hostal_courtyard', who('fs_ines_dawn', 'ines', 820, 660, 'w', 'Inês', () => sat() && F().bar_done && !F().sat_done, { look: 'alan_sat_look_notebook_tata', talk: 'ines_sat_1403' }));
  S.person('hostal_courtyard', who('fs_vasco_dawn', 'vasco', 420, 660, 'e', 'Vasco', () => sat() && F().bar_done && !F().sat_done, { look: 'vasco_sat_1405', talk: 'vasco_sat_1405' }));
  S.dawnFountain = async function () {
    const f = F();
    f.bg_hostal_courtyard = 'hostal_courtyard__dawn';
    await G.goRoom('hostal_courtyard', 'street', { instant: true, noEnter: true, pos: [600, 670, 'e'] });
    await G.fade(false);
    await say('narr_sat_1401', 'ines_sat_1402', 'ines_sat_1403', 'parrot_sat_1404', 'vasco_sat_1405');
    f.sat_done = true;
    await T(600);
    await G.fade(true);
    f.bg_hostal_courtyard = null;
    await S.next(6);
  };

  // ================================================================ previews (cold starts) and the test walkthroughs
  const before = { ch: 3, wed_done: true, thu_done: true, offerings_noted: true, coin_found: true, frieze_sketch: true, mark_looks: true, worn_phrase: true,
    note_1586: true, photo_turned: true, cards_collected: 5 };
  S.PREVIEW.start4 = { flags: Object.assign({}, before), items: ['coin_1586', 'linen_jacket', 'dollars', 'crest_paper', 'welcome_fax'], room: 'hostal_room4', pos: [500, 660, 'e'], run: () => S.START[4]() };
  S.PREVIEW.start5 = { flags: Object.assign({}, before, { ch: 4, fri_done: true, watch_done: true, lullaby_half: true, pins_marked: true, bands_two: true, overlay_made: true, rule5: true, tobias_dries: true, batista_trust: 4, chart_pins: { 3: true, 4: true } }),
    items: ['coin_1586', 'linen_jacket', 'dollars', 'crest_paper', 'welcome_fax'], room: 'hostal_kitchen', pos: [500, 660, 'e'], run: () => S.START[5]() };
  S.PREVIEW.fri_park = { flags: Object.assign({}, before, { ch: 4, fri_breakfast: true, chart_fri: true, bg_parque_colon: 'parque_colon__wet_morning' }), items: ['linen_jacket'], room: 'parque_colon', enter: true, pos: [300, 660, 'e'] };
  S.PREVIEW.sat_aisle = { flags: Object.assign({}, before, { ch: 5, sat_breakfast: true, rum_sat: true, rum: 1, market_seen: true }), items: ['rum', 'linen_jacket'], room: 'candle_aisle', pos: [300, 660, 'e'] };
  S.PREVIEW.sat_dinner = { flags: Object.assign({}, before, { ch: 5, veve_done: true, carbon_found: true, letter1930: true, date_1930: true }), as: 'ines', items: ['letter1930', 'carbon'], room: 'palace_dining', enter: true, pos: [640, 660, 'e'] };
  S.PREVIEW.sat_bar = { flags: Object.assign({}, before, { ch: 5, notebook_got: true, jacket_given: true, defence_style: 'funny' }), room: 'blue_door_bar', enter: true, pos: [300, 640, 'e'] };

  S.SOLVE[4] = async function () {
    const { act, go, expect } = S;
    await go('hostal_courtyard', 'room4');
    await go('hostal_kitchen', 'courtyard');
    await act('The hurricane chart', 'use');
    expect('the chart pin', f => f.chart_fri && f.tobias_dries);
    await go('parque_colon');
    await act('A bench', 'look');
    for (const n of ['His trousers', 'The puddle', 'The wet band', 'Something by his boot']) await act(n, 'look');
    expect('the watchman read', f => f.watch_done && f.batista_trust >= 4 && f.bands_two);
    await go('el_conde');
    await act('The sweet tray', 'use');
    expect('the dulce', () => S.has('dulce_de_coco'));
    await go('palace_courtyard');
    await act('Stone bench', 'use');
    await act('fs_moncho', null, 'dulce_de_coco', ['grandfather']);
    expect('the lullaby', f => f.lullaby_half && f.moncho_fri);
    await go('hostal_courtyard', 'street');
    await act('The fountain\'s tap', 'use');
    await go('city_wall');
    expect('the dinner', f => f.pins_marked && f.rule5);
    await S.tryDeduce('pins_marked', 'bands_two');
    expect('the overlay', f => f.overlay_made && f.ines_roof);
    await S.quiet();
    await act('Up to the roof');
    await S.quiet();
    expect('Saturday', f => f.ch === 5 && f.fri_done);
  };
  S.SOLVE[5] = async function () {
    const { act, go, expect } = S;
    await act('The hurricane chart', 'use');
    await go('san_anton');
    await act('fs_fello', 'talk');
    await act('Behind the counter', 'use');
    await act('fs_fello', null, 'dollars');
    expect('the rum', f => f.rum_sat && S.has('rum'));
    await go('market_hall');
    await go('candle_aisle', 'hall');
    S.failNext = true;   // (the drain: the first cue missed, then the rum)
    await act('fs_yolande', 'talk', null, ['bell']);
    await S.quiet();
    expect('Inês in the archive', f => f.drain_done && f.yol_story && f.veve_done && S.who() === 'ines' && G.room.id === 'cathedral_archive');
    await act('Chapter acts, 1930', 'use');
    await act('The 1930 folder', 'use');
    await act('Correspondence card index', 'use');
    await act('A card on the desk', 'look');
    await act('Correspondence card index', 'use');
    await act('Outgoing copybooks', 'use');
    expect('the carbon', f => f.carbon_found && f.letter1930);
    await go('palace_dining');
    expect('the dinner', f => f.dinner_done && f.unesco_line && f.defence_style);
    await act('Your place card', 'look');
    await act('Your place card', 'take');
    await act('The courtyard');
    await S.quiet();
    expect('Alan on El Conde', f => f.notebook_got && S.who() === 'alan' && G.room.id === 'el_conde');
    await act('fs_yunior', null, 'linen_jacket');
    await go('blue_door_bar');
    await act('fs_lalo', 'talk');
    await act('fs_sisters', 'talk');
    await S.quiet();
    expect('Sunday', f => f.ch === 6 && f.sat_done && f.sisters_in);
  };
})();
