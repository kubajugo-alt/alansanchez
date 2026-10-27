// The Shortest Night — Sunday 23 June: the choice. The airport (a short bad ending, then back to the choice) or
// Carmen's door. Carmen's flat: Elena's message still on the answering machine, Elena's notebook, the Guardia
// photograph; working out where Vasco is. The Land Rover up through the black mist and the panza de burro (the boiling
// radiator; water in the footwell), out above the cloud into the stars. The vault: Yeray levering the last anchor,
// the grille torn free, Vasco out, the discs.
// Rooms first seen today: Carmen's flat, the Land Rover.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;

  S.startSun = async function () {
    await S.morning(6, 'alan_su_wake');
    await S.theChoice();
  };

  // ---------------------------------------------------------------- the choice
  S.theChoice = async function () {
    const f = F();
    if (f.chose_carmen) return;
    await G.busy(async () => {
      await say('alan_su_choice');
      await G.dialog([
        { line: 'alan_choose_airport', run: () => S.toAirport(), bye: true },
        { line: 'alan_choose_carmen', run: async () => {
          f.chose_carmen = true;
          await say('alan_su_carmen');
          await G.goRoom('carmen_flat', 'map');
        }, bye: true },
      ]);
    });
  };
  S.toAirport = async function () {
    F().tried_airport = (F().tried_airport || 0) + 1;
    await G.goRoom('gando', 'map', { pos: [200, 660, 'e'] });
    await say('alan_su_airport');
  };
  S.backToChoice = async function () {
    await G.goRoom('hotel_room', 'hotel_lobby', { noEnter: true });
    await S.theChoice();
  };
  // the bad ending: the plane home, and the stain spreading under the cloud over Las Palmas
  S.badEnding = async function () {
    await G.busy(async () => {
      await say('clerk_1', 'alan_su_clerk', 'clerk_2');
      await S.paint('still_bad_ending', async () => { await say('narr_bad_1', 'narr_bad_2', 'narr_bad_3'); await T(1200); }, { zoom: [1.0, 1.1] });
      G.endStill();
      await G.card('That isn\'t how it ends.', 'Back to Sunday morning', 3000);
      await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
      await G.fade(false);
    });
    await S.theChoice();
  };

  // ================================================================ CARMEN'S FLAT
  ROOMS.carmen_flat = S.room({
    name: 'Carmen\'s flat, Triana', bg: 'carmen_flat', floor: 'tile', ambience: 'night', door: 'door',
    entries: { default: [1100, 660, 'w'], map: [1100, 660, 'w'] },
    npcs: [
      { id: 'carmen', ch: 'carmen', x: 640, y: 650, dir: 'e', name: 'Carmen', look: 'alan_look_carmen_flat', talk: () => S.talkCarmenSun(),
        items: { drawing: () => say('carmen_su_drawing'), any: 'alan_fail_carmen_item' } },
    ],
    hotspots: [
      { name: 'Answering machine', rect: [420, 420, 120, 50], at: [480, 650], look: () => say(F().elena_heard ? 'alan_look_machine_2' : 'alan_look_machine'), use: () => S.playElena() },
      { name: 'Elena\'s box', rect: [60, 300, 180, 120], at: [200, 650], when: () => F().elena_heard, look: 'alan_look_elena_box',
        use: () => S.elenaBox(), take: () => S.elenaBox() },
      { name: 'Fridge', rect: [880, 300, 100, 240], at: [920, 650], look: 'alan_look_fridge', use: () => S.takeWater(), take: () => S.takeWater() },
      { name: 'Window', rect: [860, 120, 260, 160], at: [980, 640], noBox: true, look: 'alan_look_carmen_window' },
      { name: 'Shelves', rect: [40, 80, 220, 200], at: [200, 640], noBox: true, look: 'alan_look_carmen_shelves' },
      { name: 'Door', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'map', entry: 'carmen_flat', locked: () => true, lockedLine: () => F().knows_vault ? 'alan_su_go' : 'alan_su_not_leaving' },
    ],
    async enter() { if (!F().carmen_sun) { F().carmen_sun = true; await say('carmen_su_door', 'alan_su_idiot', 'carmen_su_idiot'); } },
  });
  S.playElena = async function () {
    const f = F();
    if (!f.elena_heard) {
      await say('alan_su_machine', 'carmen_su_dont', 'alan_su_please');
      S.sfx('relay_click', 0.6); await T(600); S.sfx('beep', 0.5);
      await say('elena_msg_01', 'elena_msg_02', 'elena_msg_03');
      f.elena_heard = true;
      await say('carmen_su_after', 'alan_su_after', 'carmen_su_box');
      return;
    }
    return say('carmen_su_again');
  };
  S.elenaBox = async function () {
    const f = F();
    if (G.has('elena_notebook')) return say('alan_box_again');
    S.give('elena_notebook'); S.give('gc_photo');
    await say('alan_su_box');
    await S.readElena(); await S.readGcPhoto();
    await say(f.cave_explained ? 'alan_su_triangle' : 'alan_su_triangle_2');
  };
  S.takeWater = async function () {
    if (G.has('water') || F().radiator_filled) return say('alan_fridge_again');
    S.give('water'); await say('alan_take_water');
  };
  S.talkCarmenSun = async function () {
    const f = F();
    if (!f.elena_heard) return say('carmen_su_wait');
    await G.dialog([
      { line: 'alan_su_where', when: () => !f.knows_vault, run: () => S.whereIsVasco() },
      { line: 'alan_ask_carmen_elena_su', once: true, run: () => say('carmen_su_elena') },
      { line: 'alan_ask_carmen_radiator', once: true, run: () => say('carmen_su_radiator') },
      { line: 'alan_bye_carmen_su', bye: true, run: () => say(f.knows_vault ? 'carmen_su_keys' : 'carmen_su_think') },
    ]);
  };
  // the deduction: Nieves has no message, the dig radio is dead, the sketchbook says where the discs go at night;
  // and the letter says the Sea strikes first at whoever understands the lock
  S.whereIsVasco = async function () {
    const f = F();
    if (!f.elena_read) return say('alan_su_where_early');
    await say('alan_su_think_1', 'alan_su_think_2');
    await G.dialog([
      { line: 'alan_su_vasco_camp', run: () => say('carmen_su_camp_no'), bye: true },
      { line: 'alan_su_vasco_lisbon', run: () => say('carmen_su_lisbon_no'), bye: true },
      { line: 'alan_su_vasco_vault', run: async () => {
        f.knows_vault = true;
        await say('carmen_su_vault', 'alan_su_sea_too', 'carmen_su_go');
        if (!G.has('water')) await say('carmen_su_water');
      }, bye: true },
    ]);
    if (f.knows_vault && G.has('water')) await S.drive();
  };
  // the fridge after the deduction: then off
  const takeWater = S.takeWater;
  S.takeWater = async function () { await takeWater(); if (F().knows_vault && G.has('water')) await S.drive(); };

  // ================================================================ THE LAND ROVER
  let boiling = 0;
  ROOMS.landrover = S.room({
    name: 'The road up', bg: 'landrover', player: false, noSave: true, parallax: false, ambience: 'night',
    light: { ambient: 'rgb(140,150,180)', base: 0.8 },
    npcs: [],
    hotspots: [
      { name: 'Carmen', rect: [140, 380, 300, 180], look: 'alan_look_carmen_driving', talk: () => say(boiling ? 'carmen_lr_boil_talk' : 'carmen_lr_talk') },
      { name: 'Temperature gauge', rect: [560, 540, 160, 60], look: () => say(boiling ? 'alan_lr_gauge_red' : 'alan_lr_gauge') },
      { name: 'The bonnet', rect: [300, 300, 680, 160], when: () => boiling === 1, look: 'alan_lr_steam', use: () => say('alan_lr_steam'),
        items: { water: () => S.fillRadiator() } },
      { name: 'The footwell', rect: [760, 600, 240, 100], when: () => F().footwell, look: 'alan_lr_footwell' },
    ],
    animBack(g, t) {
      S.drawMist(g, t, 1);
      if (boiling === 1) FX.wisps(g, t, 640, 380, { n: 8, rise: 120, spread: 160, rgb: '235,235,235', a: 0.25, size: 26, speed: 0.6 });
    },
    animFg(g, t) { S.drawWater(g, t, S.water.landrover, '24,44,50'); },
  });
  S.drive = async function () {
    const f = F();
    if (f.driving) return;
    f.driving = true;
    await G.busy(async () => {
      await say('carmen_su_lets_go');
      await G.fade(true);
      await G.goRoom('landrover', null, { instant: true, noEnter: true, noSave: true });
      await G.fade(false);
      await say('narr_lr_1', 'carmen_lr_1', 'alan_lr_1', 'carmen_lr_2');
      await T(1500);
      boiling = 1; S.sfx('kettle_steam', 0.5);
      await say('carmen_lr_boil', 'carmen_lr_water');
    });
  };
  S.fillRadiator = async function () {
    const f = F();
    G.takeItem('water'); f.radiator_filled = true; boiling = 2;
    S.sfx('pour', 0.6); await T(1200);
    await say('alan_lr_fill', 'carmen_lr_go');
    // the Sea's water in the footwell: it has come for him; Carmen drives through it
    f.footwell = true; S.sfx('water_seep', 0.5);
    await S.waterTo('landrover', 0.12, 2500);
    await say('alan_lr_feet', 'carmen_lr_through');
    await S.waterTo('landrover', 0.2, 1500);
    S.water.landrover = 0;
    await S.paint('still_cloud_climb', async () => { await say('narr_lr_stars', 'carmen_lr_bonfires', 'alan_lr_bonfires'); }, { zoom: [1.0, 1.12], pan: [[0.5, 0.6], [0.5, 0.4]] });
    G.endStill();
    await G.goRoom('camp', 'landrover', { instant: true, noSave: true, pos: [300, 660, 'e'] });
    G.setClock('22:40');
    await G.fade(false);
    await say('carmen_su_here', 'alan_su_vault_where');
  };

  // ---------------------------------------------------------------- the vault, Sunday night
  ROOMS.vault.enter = async function () {
    if (F().ch !== 6 || F().vault_seen) return;
    F().vault_seen = true;
    S.water.vault = 0.42;
    await say('narr_vault_su', 'yeray_su_1', 'vasco_su_1', 'alan_su_vasco_1');
  };
  S.talkYerayVault = () => F().vasco_free ? say('yeray_su_after') : say('yeray_su_pull');
  S.tearGrille = async function () {
    const f = F();
    if (f.vasco_free) return say('alan_look_grille_off');
    await G.busy(async () => {
      await say('alan_su_pull');
      await S.posed('pull', async () => { S.sfx('chain_creak', 0.6); await T(900); S.sfx('stone_clack', 0.7); await T(500); });
      await say('yeray_su_2');
      await S.posed('pull', async () => { S.sfx('brass_heavy', 0.7); await T(900); });
      f.vasco_free = true;
      { const v = G.npc('vasco'); if (v) { v.x = 780; v.y = 670; v.dir = 'w'; } }
      await say('narr_grille');
      await S.waterTo('vault', 0, 3000);
      await say('vasco_su_out_1', 'alan_su_out_1', 'vasco_su_out_2', 'alan_su_out_2', 'vasco_su_out_3');
      await say('alan_su_mark');
      f.v_marked = true;
    });
  };
  S.takeDiscs = async function () {
    const f = F();
    if (F().as_vasco) return say('vasco_look_crates');
    if (!f.vasco_free) return say('alan_crates_first');
    if (G.has('discs') || f.ch === 7) return say('alan_crates_empty');
    S.give('discs'); f.discs_left = 5;
    await say('alan_su_discs', 'vasco_su_discs');
    await say('vasco_su_dawn', 'carmen_su_dawn');
    await S.startMon();
  };
})();
