// The Shortest Night — Saturday 22 June, Alan's half: the morning after. Rafa's drawing of him asleep; the sketchbook
// (Yeray's words: the discs go down to the lower vault at night, only Rayco has the key); the truth over coffee;
// Inês ("Tell him. Today."); Nieves's eyebrow, the fax with the decoded letter, the dig that doesn't answer; La Isleta
// flooding at evening, Doña Pino saved by Don Lolo, Alan's name at the bottom of her list. Then Vasco's chapter.
// Room first seen today: Rafa's studio.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;

  S.startSat = async function () {
    await G.fade(true);
    await G.goRoom('rafa_studio', null, { instant: true, noEnter: true, noSave: true, pos: [300, 660, 'e'] });
    await S.day(5);
    await G.fade(false);
    await say('alan_s_wake_1', 'alan_s_wake_2');
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
      { name: 'Sketchbook', rect: [520, 500, 120, 50], at: [580, 650], look: () => S.readSketchbook(), use: () => S.readSketchbook() },
      { name: 'Bed', rect: [140, 420, 500, 150], at: [400, 650], look: 'alan_look_rafa_bed' },
      { name: 'Window', rect: [860, 120, 260, 90], at: [980, 640], look: 'alan_look_studio_window' },
      { name: 'Door', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'map', entry: 'rafa_studio', locked: () => !F().rafa_truth, lockedLine: 'alan_studio_stay' },
    ],
  });
  S.rafaMorning = async function () {
    const f = F();
    if (f.rafa_truth) return say('rafa_s_again');
    S.sfx('coffee_cups', 0.5);
    await say('rafa_s_1', 'alan_s_rafa_1', 'rafa_s_2');
    await G.dialog([
      { line: 'alan_s_truth', run: async () => {
        await say('alan_s_truth_2', 'rafa_s_truth_1', 'rafa_s_truth_2', 'alan_s_truth_3', 'rafa_s_drawing');
        S.give('drawing'); f.rafa_truth = true;
        await say('alan_s_thanks', 'rafa_s_bye');
      }, bye: true },
      { line: 'alan_s_coffee', run: () => say('rafa_s_coffee') },
    ]);
  };

  // ---------------------------------------------------------------- the hotel: Nieves, the fax, the radio
  S.lobbySat = async function () {
    F().lobby_return_seen = true;
    await say('nieves_sat_eyebrow', 'alan_sat_nieves');
  };
  S.faxArrives = async function () {
    if (G.has('fax')) return;
    await say('nieves_fax_in');
    S.give('fax');
    await S.readFax();
    await say('alan_s_after_fax');
  };

  // ---------------------------------------------------------------- La Isleta floods
  S.floodScene = async function () {
    const f = F();
    f.isleta_flood = true;
    await G.busy(async () => {
      await S.paint('still_isleta_flood', async () => { S.sfx('water_rise', 0.5); await say('narr_flood_1', 'lolo_s_1', 'pino_s_1', 'lolo_s_2'); }, { zoom: [1.0, 1.1] });
      G.endStill(); await G.fade(false);
      await say('pino_s_list', 'alan_s_list');
      f.alan_on_list = true;
      await S.readPinoList();
      await say('alan_s_name', 'pino_s_name');
      await say('alan_s_vasco');
      await S.startVasco();
    });
  };
})();
