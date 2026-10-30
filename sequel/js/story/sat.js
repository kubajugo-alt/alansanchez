// The Shortest Night — Saturday 22 June, Alan's half: the morning after, in the novel's order (Chapter Six, rewritten
// from it 2026-10-30). Santa Ana's bells; Rafa's drawing of him asleep; the two rules, broken; the sketchbook (Yeray's
// words: the discs go down to the vault under the caves, only Baute has the key); the truth over Rafa's coffee and the
// drawing given; the walk back through a city getting ready for its fiesta; Nieves and the empty pigeonhole; the wet
// footprint by Vasco's side of the bed; Inês ("Tell him. Today.") and the letter read down the line; Chano's news
// (Agustín); the fax; he tries (museum, cars, bus) and decides on the seven o'clock bus; La Isleta floods at seven,
// Doña Pino saved by Don Lolo, Alan's name at the bottom of her list; the night, the phone that doesn't ring. Then
// Vasco's chapter (vasco.js). Room first seen today: Rafa's studio.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;

  // ---------------------------------------------------------------- the morning: the bells, the drawing, the rules
  S.startSat = async function () {
    await G.fade(true);
    await G.goRoom('rafa_studio', null, { instant: true, noEnter: true, noSave: true, pos: [300, 660, 'e'] });
    await S.day(5);
    S.sfx('church_bells_distant', 0.5);
    await G.fade(false);
    await say('narr_s_wake_1', 'narr_s_wake_2', 'alan_s_wake_1', 'narr_s_wake_rafa', 'alan_s_wake_2', 'narr_s_wake_drawing');
    await G.showStill('still_rafa_drawing', () => say('narr_s_drawing_1', 'narr_s_drawing_2'), { zoom: [1.02, 1.08] });
    G.endStill();
    F().saw_drawing = true;
    S.sfx('cloth_shirt', 0.4);
    await say('narr_s_dress', 'narr_s_go', 'narr_s_didnt');
    // the window: he makes himself think it, in words, all the way to the end
    await say('narr_s_window', 'alan_s_window_1', 'alan_s_window_2', 'alan_s_window_3');
    G.autosave();
  };

  // ================================================================ RAFA'S STUDIO
  ROOMS.rafa_studio = S.room({
    music: 'rafa_studio',
    name: 'Rafa\'s studio', bg: 'rafa_studio', floor: 'wood', ambience: 'street', door: 'door',
    entries: { default: [300, 660, 'e'], map: [1100, 660, 'w'] },
    npcs: [
      { id: 'rafa', ch: 'rafa', x: 1000, y: 650, dir: 'w', name: 'Rafa', look: 'alan_look_rafa_morning', talk: () => S.rafaMorning(),
        items: { napkin: () => say('rafa_napkin_keep'), any: 'alan_fail_rafa_item' } },
    ],
    hotspots: [
      { name: 'The drawing on the easel', rect: [760, 220, 220, 250], at: [860, 650], look: async () => { F().saw_drawing = true; await S.lookDrawing(); } },
      { name: 'Sketchbook', rect: [520, 500, 120, 50], at: [580, 650], look: () => S.readSketchbookSat(), use: () => S.readSketchbookSat() },
      { name: 'Bed', rect: [140, 420, 500, 150], at: [400, 650], look: 'alan_look_rafa_bed' },
      { name: 'Window', rect: [860, 120, 260, 90], at: [980, 640], look: 'alan_look_studio_window' },
      { name: 'Door', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'map', entry: 'rafa_studio', locked: () => !F().rafa_truth, lockedLine: 'alan_studio_stay' },
    ],
    // small moving details over the painting: the morning sun through the window, the coffee, the palm outside
    animBack(g, t) {
      const im = G.bgImage();
      FX.sway(g, im, [792, 158, 48, 62], t * 0.7, 1.1, 0.4, true); // the palm beyond the window
      // dust turning in the light that falls from the window to the floor by the bed
      g.save(); g.beginPath(); g.moveTo(665, 115); g.lineTo(900, 110); g.lineTo(700, 520); g.lineTo(300, 540); g.closePath(); g.clip();
      FX.motes(g, t, 300, 110, 600, 430, 26, '255,236,196'); g.restore();
      FX.wisps(g, t, 600, 440, { n: 5, rise: 46, spread: 7, rgb: '255,250,240', a: 0.16, size: 7, speed: 0.22 }); // the moka pot's spout
      FX.wisps(g, t + 1.3, 576, 461, { n: 4, rise: 36, spread: 5, rgb: '255,250,240', a: 0.12, size: 5, speed: 0.2 }); // Rafa's cup
      FX.wisps(g, t + 2.6, 666, 467, { n: 4, rise: 36, spread: 5, rgb: '255,250,240', a: 0.12, size: 5, speed: 0.2 }); // Alan's cup
      FX.glow(g, 1180, 184, 34, '255,226,160', 0.12 + 0.02 * Math.sin(t * 0.8)); // the stair lamp, an electric bulb: steady
    },
  });
  // the sketchbook on the table, a napkin from the bar in it like a bookmark: Yeray, and what he said (the close-up and
  // Alan's first three lines are docs.js S.readSketchbook); then what it means, the first time
  S.readSketchbookSat = async function () {
    const first = !F().sketchbook_read;
    await S.readSketchbook();
    if (first) await say('narr_s_sketch_1', 'alan_s_sketch_1', 'alan_s_sketch_2', 'alan_s_sketch_3', 'alan_s_sketch_4');
  };
  // coffee, Yeray, and the truth: "I know." "You know?"; the drawing given; then out, and back to the hotel
  S.rafaMorning = async function () {
    const f = F();
    if (f.rafa_truth) return say('rafa_s_again');
    if (!f.rafa_coffee) {
      f.rafa_coffee = true;
      S.sfx('coffee_cups', 0.5);
      await say('rafa_s_1', 'narr_s_coffee');
      if (!f.sketchbook_read) { await say('narr_s_napkin'); await S.readSketchbookSat(); }
      await say('narr_s_rafa_sees', 'rafa_s_yeray_1', 'rafa_s_yeray_2', 'alan_s_rafa_1');
    }
    await G.dialog([
      { line: 'alan_s_truth', run: () => S.rafaTruth(), bye: true },
      { line: 'alan_s_ask_yeray', once: true, run: () => say('rafa_s_yeray_more', 'rafa_s_yeray_more_2') },
      { line: 'alan_s_ask_drawing', once: true, run: () => say('rafa_s_drawn', 'rafa_s_drawn_2', 'alan_s_drawn') },
      { line: 'alan_s_coffee', once: true, run: () => say('rafa_s_coffee') },
      { line: 'alan_s_later', bye: true, run: () => say('rafa_s_later') },
    ]);
    if (f.rafa_truth) await S.leaveStudio();
  };
  S.rafaTruth = async function () {
    const f = F();
    await say('narr_s_truth_1', 'alan_s_truth_2', 'alan_s_truth_4', 'alan_s_truth_3', 'narr_s_truth_2', 'rafa_s_truth_1', 'alan_s_truth_5',
      'rafa_s_truth_2', 'narr_s_truth_3', 'rafa_s_truth_3', 'rafa_s_truth_4', 'rafa_s_truth_5', 'narr_s_truth_4', 'narr_s_truth_5', 'rafa_s_drawing',
      'alan_s_cant', 'rafa_s_drawing_2');
    S.give('drawing'); f.rafa_truth = true;
    await say('rafa_s_drawing_3', 'alan_s_thanks', 'rafa_s_bye');
  };

  // ---------------------------------------------------------------- the walk back; Nieves; the footprint
  S.leaveStudio = async function () {
    const f = F();
    await G.busy(async () => {
      const p = G.player; await p.walkTo(1200, 650);
      S.sfx('door', 0.5); await G.fade(true);
      S.sfx('church_bells_distant', 0.25);
      await say('narr_s_walk_1', 'narr_s_walk_2', 'narr_s_walk_3', 'narr_s_walk_4', 'narr_s_walk_5');
      f.lobby_return_seen = true;   // (the lobby's own enter() would start the scene: tue.js)
      await G.goRoom('hotel_lobby', 'map', { instant: true, noEnter: true, noSave: true });
      await G.fade(false);
      await S.lobbySat();
    });
  };
  // Nieves: the eyebrow that doesn't move, the empty pigeonhole, the coffee
  S.lobbySat = async function () {
    F().lobby_return_seen = true;
    await G.busy(async () => {
      await say('narr_s_nieves_1', 'narr_s_nieves_2', 'alan_sat_nieves', 'nieves_sat_eyebrow', 'alan_s_msg_2', 'narr_s_pigeon', 'nieves_s_msg', 'nieves_s_coffee');
      await S.footprint();
    });
  };
  // room 404, exactly as Vasco left it; and on the tiles by his side of the bed, one wet footprint (Pedro's trace: never
  // explained)
  S.footprint = async function () {
    const f = F();
    await G.goRoom('hotel_room', 'hotel_lobby', { noEnter: true, noSave: true });
    await say('narr_s_room_1', 'narr_s_room_2', 'narr_s_room_3', 'narr_s_room_3b', 'alan_s_print_1', 'narr_s_room_4', 'narr_s_room_5');
    await S.posed('pickup', async () => { S.sfx('water_seep', 0.3); await say('narr_s_room_6'); });
    S.sfx('knock', 0.5); await T(500);
    await say('narr_s_room_7');
    f.footprint_seen = true;
    // (2026-10-30) the letter first, in his own hand's language: then the call (puzzles.js)
    if (!f.letter_read) { await say('alan_s_letter_first'); await S.openPage('letter'); }
    if (f.letter_read) await say('alan_s_call_due');
    G.autosave();
  };

  // ---------------------------------------------------------------- the call (core.js S.CALLS, called_sat): Inês
  // The novel's call at eleven, with the last of his change: the confession, "Tell him. Today.", the letter read down
  // the line, the pips, "Promise me you'll come h—". It ends on the dead line, with no "What now?".
  S.callSatScene = async function () {
    // (2026-10-30: Alan has read the rules himself, puzzles.js; Inês reads him only the paragraph he couldn't: the cost)
    await say('ines_call_sat_1', 'ines_call_sat_1b', 'alan_call_sat_0', 'ines_call_sat_1c', 'narr_call_sat_1', 'alan_call_sat_1', 'alan_call_sat_1b',
      'narr_call_sat_2', 'ines_call_sat_2', 'alan_call_sat_2', 'ines_call_sat_2b', 'ines_call_sat_2c', 'alan_call_sat_2b', 'narr_call_sat_3',
      'ines_call_sat_3', 'alan_call_sat_3', 'ines_call_sat_4', 'ines_call_sat_5', 'ines_call_sat_6', 'ines_call_sat_7', 'alan_call_sat_4',
      'alan_call_sat_read', 'ines_call_sat_you', 'alan_call_sat_rules', 'ines_call_sat_last', 'narr_call_sat_5', 'ines_call_sat_11', 'ines_call_sat_12',
      'ines_call_sat_16', 'alan_call_sat_5', 'ines_call_sat_17', 'alan_call_sat_6');
    S.sfx('beep', 0.5); await T(400);
    await say('narr_call_sat_7', 'ines_call_sat_18');
    S.sfx('dial_tone', 0.4); await T(600);
    await say('narr_call_sat_8');
  };
  // after the call (core.js S.phoneBox calls S.afterCall when he hangs up): Chano has a newspaper for him, and a face
  S.afterCall = async () => { const f = F(); if (f.ch === 5 && f.called_sat && !f.chano_sat) await S.chanoSat(); };
  S.chanoSat = async function () {
    const f = F();
    if (f.chano_sat) return;
    f.chano_sat = true; f.gossip_day = 5; f.agustin_known = true;
    await G.busy(async () => {
      await say('narr_s_chano_1', 'chano_s_1', 'narr_s_chano_2');
      f.paper_day = 5; G.takeItem('newspaper'); S.give('newspaper', true); G.toast('Today\'s La Provincia');
      await say('chano_s_2', 'chano_s_3', 'narr_s_chano_cross', 'chano_s_4', 'alan_s_chano_1', 'narr_s_chano_stare', 'chano_s_5', 'chano_s_6',
        'narr_s_chano_3', 'alan_s_chano_2');
    });
  };

  // ---------------------------------------------------------------- the fax (Nieves, tue.js), and he tries
  S.faxArrives = async function () {
    const f = F();
    if (G.has('fax')) return;
    await say('nieves_fax_in');
    S.give('fax');
    await S.readFax();
    await say('alan_s_vasco', 'alan_s_after_fax');
  };
  // Later, he would need to know that he had tried: the museum shut, the dig's radio dead, no car on the island, the bus
  // gone. Tomorrow, the seven o'clock bus. Then, at seven in the evening, people running towards La Isleta.
  S.tried = async function () {
    const f = F();
    await G.busy(async () => {
      await G.fade(true);
      // (2026-10-30: he has radioed the camp himself, puzzles.js, so the guard's radio is gone from it; and the flood isn't
      // news shouted past the hotel any more: he works out where and when it will come)
      await say('narr_s_tried_1', 'narr_s_tried_2', 'narr_s_tried_4', 'narr_s_tried_5', 'alan_s_tried', 'narr_s_tried_6', 'narr_s_tried_7');
      f.tried = true;
      await G.fade(false);
    });
  };

  // ---------------------------------------------------------------- La Isleta floods
  // Not from the harbour: up through the drains, at seven, with the black mist over the water. Doña Pino in her bed,
  // pulled up by Don Lolo ("By your collar." "By my hair!"); later, the missal, and Alan's name under hers.
  S.floodScene = async function () {
    const f = F();
    f.isleta_flood = true;
    await G.busy(async () => {
      await S.paint('still_isleta_flood', async () => {
        S.sfx('water_rise', 0.5);
        await say('narr_flood_1', 'narr_flood_2', 'narr_flood_3', 'narr_flood_4', 'narr_flood_5', 'narr_flood_door', 'narr_flood_bed',
          'pino_s_1', 'pino_s_1b', 'pino_s_2', 'pino_s_3', 'lolo_s_1', 'pino_s_4', 'lolo_s_2', 'narr_flood_lolo', 'lolo_s_watched', 'lolo_s_3');
      }, { zoom: [1.0, 1.1] });
      G.endStill(); await G.fade(false);
      S.sfx('water_drain', 0.4);
      await say('narr_flood_later', 'narr_flood_later_2', 'narr_flood_missal', 'pino_s_list', 'pino_s_list_2', 'alan_s_list', 'pino_s_know',
        'alan_s_coming', 'narr_flood_still', 'narr_flood_told', 'narr_flood_pen');
      S.sfx('pencil_scribble', 0.4); await T(800);
      await say('narr_flood_name');
      f.alan_on_list = true;
      await S.readPinoList();
      await say('pino_s_name', 'pino_s_name_2');
      await S.alanNight();
      await S.startVasco();
    });
  };
  // the night: on his side of the bed, facing Vasco's; the drawing on the pillow; the phone that doesn't ring; the bus
  // at seven or the plane at eleven fifteen
  S.alanNight = async function () {
    await G.fade(true);
    await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
    await G.fade(false);
    S.sfx('water_lap', 0.3);
    await say('narr_s_night_1', 'narr_s_night_2', 'narr_s_night_3', 'narr_s_night_4', 'narr_s_night_5', 'narr_s_night_6');
  };
})();
