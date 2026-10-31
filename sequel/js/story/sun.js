// The Shortest Night — Sunday 23 June: the choice (the novel's Chapters Nine and Ten, in order). Packing at five
// without deciding to; Vasco's watch; the note; the taxi to Gando. The Iberia desk: "Window or aisle?" (window: the
// short bad ending, then back to the desk) or "I've left something behind". Chano at the kiosk ("the airport face";
// Carmen's address). Carmen's door on its chain ("I'm an idiot"); Elena, eleven years; the message on the machine;
// Elena's notebook and the Guardia photograph; the cistern told; the calls (Nieves, the museum, the lab: disc six out
// this morning); working out where Vasco is. The Land Rover up through the panza: the boiling radiator, the black, the
// water in the footwell on Alan's side only, Carmen driving through it; out above the cloud into the stars, the bonfires
// glowing under it. The vault at dusk, cut away to: Vasco talks Yeray round. The camp in the dark; the rescue at the
// grille; the discs; the seven signs and the A; the talk on the rock ("Not now"); the path to Cave 6. Then Monday (mon.js).
// Rooms first seen today: Carmen's flat, the Land Rover. The vault and the camp live in vasco.js; the Sunday parts of
// them are here (the vault's Sunday entry, the rescue, the discs; Vasco and Yeray at the camp after it).
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;
  const W = ms => T(window.FAST ? 10 : ms);   // a held beat (short when the playthrough test runs)
  const walk = (a, x, y, ms) => a ? Promise.race([a.walkTo(x, y), W(ms || 3000)]) : null;

  S.startSun = async function () {
    await S.morning(6, 'alan_su_wake');
    await S.theChoice();
  };

  // ---------------------------------------------------------------- five in the morning: packing without deciding to
  S.theChoice = async function () {
    const f = F();
    if (f.chose_carmen) return;
    if (f.su_taxi) return S.toAirport();
    await G.busy(async () => {
      // (2026-10-31, less narrator: he packs, takes Vasco's watch, writes the note; the taxi is the one line left)
      await S.posed('pickup', async () => { S.sfx('cloth_shirt', 0.4); await W(900); S.sfx('cloth_shirt_2', 0.4); await W(700); });
      await say('alan_su_pack');
      await S.posed('reach', async () => { S.sfx('key_pickup', 0.3); await W(700); });
      await say('alan_su_watch');
      f.su_watch = true;
      await S.posed('write', async () => { S.sfx('pencil_scribble', 0.4); await W(1000); S.sfx('paper_take', 0.4); await W(500); });
      await say('alan_su_note', 'narr_su_taxi', 'alan_su_gando');
      f.su_taxi = true;
      await S.toAirport();
    });
  };
  S.toAirport = async function () {
    const f = F();
    f.tried_airport = (f.tried_airport || 0) + 1;
    await G.fade(true);
    await G.goRoom('gando', 'map', { instant: true, noEnter: true, pos: [200, 660, 'e'] });
    await G.fade(false);
    if (!f.su_gando) { f.su_gando = true; await say('alan_su_airport'); }
  };
  // Gando's way out, before the desk
  S.backToChoice = async function () {
    if (F().chose_carmen) return;
    return say('alan_su_queue_back');
  };

  // ---------------------------------------------------------------- the Iberia desk (the clerk who lost his suitcase on Tuesday)
  S.badEnding = async function () {
    const f = F();
    if (f.chose_carmen) return say('alan_look_clerk');
    await G.busy(async () => {
      if (!f.su_queue) {
        f.su_queue = true;
        // (his grandfather, the habit, what staying means: in his own voice, in the queue)
        await say('alan_su_queue_1', 'alan_su_queue_2', 'alan_su_hands');
        await W(800);
        await say('alan_su_queue_3', 'alan_su_queue_4');
        await say('clerk_su_next', 'alan_su_yes', 'clerk_su_tan', 'alan_su_tan');
        await say('clerk_1');
        await W(900);
        await say('alan_su_desk');
      } else await say('clerk_su_again');
    });
    await S.deskChoice();
  };
  S.deskChoice = () => G.dialog([
    { line: 'alan_su_clerk', run: () => S.flyHome(), bye: true },
    { line: 'alan_su_aisle', run: () => S.flyHome(), bye: true },
    { line: 'alan_su_behind', run: () => S.leaveAirport(), bye: true },
  ]);
  // the bad ending: the plane home, and the stain spreading under the cloud over Las Palmas; then back to the desk
  S.flyHome = async function () {
    await G.busy(async () => {
      await say('clerk_2');
      // (the still shows the plane, the island under its lid and the stain over the city: one line)
      await S.paint('still_bad_ending', async () => { await W(2500); await say('narr_bad_3'); await T(1200); }, { zoom: [1.0, 1.1] });
      G.endStill();
      await G.card('That isn\'t how it ends.', 'Back to the desk', 3000);
      await G.goRoom('gando', null, { instant: true, noEnter: true, noSave: true, pos: [860, 650, 'e'] });
      await G.fade(false);
      await say('clerk_su_again');
    });
    await S.deskChoice();
  };
  // "I've left something behind": out through the crowd; the bus has gone; Chano
  S.leaveAirport = async function () {
    const f = F();
    await G.busy(async () => {
      // he takes his ticket back out of her hand and walks back through the crowd; she shrugs after him
      await S.posed('reach', async () => { S.sfx('paper_take', 0.4); await W(600); });
      await G.player.walkTo(120, 660);
      await say('clerk_su_june');
      await G.fade(true);
      await G.goRoom('canteras', null, { instant: true, noEnter: true, pos: [340, 665, 'w'] });
      await G.fade(false);
      await say('narr_su_back', 'alan_su_chano_think');
      await say('chano_su_1', 'alan_su_chano_1', 'chano_su_2', 'alan_su_chano_2', 'chano_su_3', 'chano_su_4');
      S.sfx('coins_clink', 0.4); await W(700);   // (a box of rockets to a small boy)
      await say('chano_su_5', 'alan_su_chano_3', 'chano_su_6', 'chano_su_6b', 'chano_su_7', 'alan_su_chano_4', 'chano_su_8');
      f.chose_carmen = true;   // (Carmen's flat is on the map now: js/story/core.js)
      await say('alan_su_perdomo');
    });
  };

  // ================================================================ CARMEN'S FLAT
  ROOMS.carmen_flat = S.room({
    music: 'carmen_flat',
    name: 'Carmen\'s flat, Triana', bg: 'carmen_flat', floor: 'tile', ambience: 'night', door: 'door',
    entries: { default: [1100, 660, 'w'], map: [1100, 660, 'w'] },
    npcs: [
      { id: 'carmen', ch: 'carmen', x: 640, y: 650, dir: 'e', name: 'Carmen', init: a => { if (!F().carmen_sun) a.x = 1000; },   // (at the door, the first time)
        look: () => say(F().elena_heard ? 'alan_look_carmen_flat_2' : 'alan_look_carmen_flat'), talk: () => S.talkCarmenSun(),
        items: { drawing: () => say('carmen_su_drawing'), any: 'alan_fail_carmen_item' } },
    ],
    hotspots: [
      { name: 'Answering machine', rect: [320, 375, 90, 60], at: [380, 650], look: () => say(F().elena_heard ? 'alan_look_machine_2' : 'alan_look_machine'), use: () => S.playElena() },
      { name: 'Elena\'s box', rect: [60, 300, 180, 120], at: [200, 650], when: () => F().elena_heard, look: 'alan_look_elena_box',
        use: () => S.elenaBox(), take: () => S.elenaBox() },
      { name: 'Fridge', rect: [880, 300, 100, 240], at: [920, 650], look: 'alan_look_fridge', use: () => S.takeWater(), take: () => S.takeWater() },
      { name: 'Window', rect: [860, 120, 260, 160], at: [980, 640], noBox: true, look: 'alan_look_carmen_window' },
      { name: 'Shelves', rect: [40, 80, 220, 200], at: [200, 640], noBox: true,
        look: async () => { await G.closeup([S.closePhoto('carmen_photo')]); await say('alan_look_carmen_shelves'); } },   // (the two women on the mountain: the close-up, entry 116)
      { name: 'Door', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'map', entry: 'carmen_flat', locked: () => true, lockedLine: () => F().knows_vault ? 'alan_su_go' : 'alan_su_not_leaving' },
    ],
    // the door on its chain: "No." / "I'm an idiot."
    async enter() {
      const f = F();
      if (f.carmen_sun) return;
      f.carmen_sun = true;
      // (2026-10-31, less narrator): she answers the door herself, on its chain; it shuts; the chain comes off; she
      // goes back in and he follows. The flat, the ashtrays and the blinking machine are the painting's.
      const c = G.npc('carmen');
      S.sfx('knock', 0.6); await W(900); S.sfx('knock', 0.7); await W(700);
      S.sfx('door', 0.4); await W(500);
      await say('carmen_su_door', 'alan_su_idiot');
      await W(900);
      await say('alan_su_idiot_2', 'alan_su_idiot_3', 'alan_su_idiot_4', 'alan_su_idiot_5');
      await say('carmen_su_baute', 'alan_su_baute');
      await W(1200);
      await say('alan_su_friend');
      if (c) await walk(c, 880, 655, 1500);
      S.sfx('door_2', 0.5); await W(600);
      await say('alan_su_thats_that');
      await W(800);
      S.sfx('key_jingle', 0.4); await W(600); S.sfx('door', 0.4);
      await say('carmen_su_idiot');
      if (c) { await walk(c, 640, 650, 3000); c.dir = 'e'; }
    },
    // small moving details over the painting: the hanging lamp, the view from the kitchen window, the machine's light
    animBack(g, t) {
      const im = G.bgImage();
      FX.glow(g, 450, 80, 70, '255,196,120', 0.16 * FX.flicker(t * 0.5, 2)); // the lantern over the photograph
      FX.sway(g, im, [535, 88, 40, 58], t * 0.5, 0.6, 1.1); // the ivy trailing off the top shelf
      FX.ripple(g, im, [940, 205, 100, 12], t * 0.6, 0.5, 0.4); // the sea beyond the roofs, under the cloud
      FX.twinkle(g, t, [[956, 232, 1.5], [978, 246, 1.5], [1012, 228, 1.5], [1030, 252, 1.5], [995, 262, 1.5]], '255,220,150');
      // the message light: Elena's message waiting, blinking until it's played (then it goes out)
      if (!F().elena_heard && Math.floor(t * 1.6) % 2 === 0) FX.glow(g, 378, 397, 9, '255,40,30', 0.75);
    },
  });
  // Elena: who she was, the call she missed; "Play it."; the message; Carmen again, in her field clothes; the box
  S.playElena = async function () {
    const f = F();
    if (f.elena_heard) return say('carmen_su_again');
    await G.busy(async () => {
      if (!f.su_elena_told) {
        f.su_elena_told = true;
        await say('carmen_su_elena_1', 'carmen_su_elena_2', 'carmen_su_elena_3');
        await W(700);
        await say('carmen_su_elena_4', 'alan_su_know');
        await say('carmen_su_elena_5', 'carmen_su_elena_6', 'carmen_su_elena_7');
      }
      await say('alan_su_machine', 'carmen_su_dont', 'alan_su_please');
      await W(1500);   // (she looks at him a long time; then presses the button)
      S.sfx('relay_click', 0.6); await W(600); S.sfx('beep', 0.5);
      await say('elena_msg_01');
      await W(900);
      await say('elena_msg_02', 'elena_msg_03');
      S.sfx('relay_click', 0.4);
      f.elena_heard = true;   // (the red light stops blinking, and goes out: animBack)
      await W(1800);
      // he goes to her and puts his hand on her shoulder, and they stay like that a long time
      const c = G.npc('carmen');
      if (c) { await walk(G.player, c.x + 110, 655, 4000); G.player.dir = 'w'; }
      await S.posed('reach', () => W(3500));
      await say('carmen_su_dress');
      await G.fade(true); S.sfx('cloth_shirt', 0.4); await T(900); await G.fade(false);
      await say('carmen_su_box', 'carmen_su_box_2');
    });
  };
  S.elenaBox = async function () {
    const f = F();
    if (G.has('elena_notebook')) return say('alan_box_again');
    S.give('elena_notebook'); S.give('gc_photo');
    await say('alan_su_box');
    await S.readElena(); await S.readGcPhoto();
    await say(f.cave_explained ? 'alan_su_triangle' : 'alan_su_triangle_2');
    // the sentence she didn't finish; the cistern, told; the lighter, four tries
    await G.busy(async () => {
      await say('alan_su_finish', 'carmen_su_how', 'alan_su_told');
      // her lighter: four tries this time; half the cigarette in silence
      for (let i = 0; i < 4; i++) { S.sfx('match', 0.45); await T(420); }
      await W(1800);
      await say('carmen_su_anyway', 'alan_su_apparently', 'carmen_su_airport', 'alan_su_apparently_2');
      await W(1000);
      await say('carmen_su_idiot_2');
    });
  };
  S.takeWater = async function () {
    if (G.has('water') || F().radiator_filled) return say('alan_fridge_again');
    S.give('water'); await say('alan_take_water');
  };
  S.talkCarmenSun = async function () {
    const f = F();
    if (!f.elena_heard) return S.playElena();
    await G.dialog([
      { line: 'alan_su_where', when: () => !f.knows_vault, run: () => S.whereIsVasco(), bye: true },
      { line: 'alan_ask_carmen_elena_su', once: true, run: () => say('carmen_su_elena') },
      { line: 'alan_ask_carmen_radiator', once: true, run: () => say('carmen_su_radiator') },
      { line: 'alan_bye_carmen_su', bye: true, run: () => say(f.knows_vault ? 'carmen_su_keys' : 'carmen_su_think') },
    ]);
  };
  // the deduction: the calls first (Nieves has only his own note; the dig radio's dead; the lab has never had a disc,
  // and disc six came out this morning), then thinking it through in order; the letter says the Sea strikes first at
  // whoever understands the lock
  S.whereIsVasco = async function () {
    const f = F();
    if (!f.elena_read) return say('alan_su_where_early');
    if (!f.su_calls) {
      f.su_calls = true;
      await G.busy(async () => {
        await say('alan_su_phone');
        // the hotel: he puts the phone down on Nieves's question without answering it
        await S.posed('phone', async () => {
          S.sfx('phone_dial', 0.5); await W(1200);
          await say('nieves_su_1', 'nieves_su_2', 'alan_su_burn', 'nieves_su_burn', 'alan_su_nothing', 'nieves_su_3', 'nieves_su_4');
          await W(1200); S.sfx('phone_hangup', 0.5); await W(400);
        });
        // Carmen's calls: the museum (the dig radio), then the conservation lab
        S.sfx('phone_dial', 0.5); await W(1000);
        await say('carmen_su_museum');
        S.sfx('phone_hangup', 0.4); await W(300); S.sfx('phone_dial', 0.5); await W(1000);
        await say('carmen_su_lab_1', 'carmen_su_lab_2', 'alan_su_six');
        await W(1500);   // (he sits down with Elena's notebook and makes himself think, in order)
        if (f.radio_lie) await say('alan_su_lolo');   // (2026-10-30: Lolo's radio and Baute's lie, puzzles.js)
      });
    }
    await say('alan_su_think_1', 'alan_su_think_2', 'alan_su_think_3');
    await G.dialog([
      { line: 'alan_su_vasco_camp', run: () => say('carmen_su_camp_no'), bye: true },
      { line: 'alan_su_vasco_lisbon', run: () => say('carmen_su_lisbon_no'), bye: true },
      { line: 'alan_su_vasco_vault', run: async () => {
        f.knows_vault = true;
        await say('alan_su_vault_1', 'alan_su_vault_2', 'carmen_su_vault', 'alan_su_sea_too');
        S.sfx('key_jingle', 0.5);   // (she's already picking up her keys)
        await say('carmen_su_go');
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
    music: 'landrover',
    name: 'The road up', bg: 'landrover', player: false, noSave: true, parallax: false, ambience: 'night',
    light: { ambient: 'rgb(140,150,180)', base: 0.8 },
    npcs: [],
    hotspots: [
      { name: 'Carmen', rect: [140, 380, 300, 180], look: 'alan_look_carmen_driving', talk: () => say(boiling === 1 ? 'carmen_lr_boil_talk' : 'carmen_lr_talk') },
      { name: 'Temperature gauge', rect: [560, 540, 160, 60], look: () => say(boiling ? 'alan_lr_gauge_red' : 'alan_lr_gauge') },
      { name: 'The bonnet', rect: [300, 300, 680, 160], when: () => boiling === 1, look: 'alan_lr_steam', use: () => say('alan_lr_steam'),
        items: { water: () => S.fillRadiator() } },
      { name: 'The footwell', rect: [760, 600, 240, 100], when: () => F().footwell, look: 'alan_lr_footwell' },
    ],
    animBack(g, t) {
      const im = G.bgImage(), bump = Math.sin(t * 7.3) * 0.6 + Math.sin(t * 2.9) * 0.9; // the road under the wheels
      // the road going by through the windscreen: a Higgsfield loop masked onto the glass, as the sea (the user,
      // 2026-10-30); until it can play, the cloud rolling slowly below the wall
      if (!S.sea(g, 'landrover')) FX.ripple(g, im, [950, 202, 290, 78], t * 0.35, 1.2, 0.05);
      // the stars over the sea of cloud
      FX.twinkle(g, t, [[540, 112, 1], [598, 168, 1], [812, 104, 1], [868, 150, 1], [930, 118, 1], [1004, 172, 1], [1080, 98, 1], [1150, 140, 1], [1222, 116, 1], [760, 182, 1]], '230,236,255');
      FX.sway(g, im, [668, 150, 62, 166], t * 1.4, 2.2 + bump, 0.3); // the rosary off the mirror, swinging with the road
      FX.glow(g, 680, 330, 260, '255,226,170', 0.05 + 0.025 * (1 + Math.sin(t * 5.1) * Math.sin(t * 1.7))); // the headlights, jolting
      // the dashboard's lamps (no cigarette: the user took it out of the painting, 2026-10-30)
      FX.glow(g, 627, 462, 10, '120,255,120', 0.35); FX.glow(g, 559, 505, 10, '120,255,120', 0.35); FX.glow(g, 730, 519, 9, '255,160,60', 0.4);
      S.drawMist(g, t, 1);
      if (boiling === 1) FX.wisps(g, t, 640, 380, { n: 8, rise: 120, spread: 160, rgb: '235,235,235', a: 0.25, size: 26, speed: 0.6 });
    },
    // (the Sea's water in the footwell, on Alan's side only: js/story/water.js)
  });
  // out of Las Palmas at five, against the crowds going down to the beaches; up into the cloud; the radiator
  S.drive = async function () {
    const f = F();
    if (f.driving) return;
    f.driving = true;
    await G.busy(async () => {
      await say('carmen_su_lets_go');
      await G.fade(true);
      await G.goRoom('landrover', null, { instant: true, noEnter: true, noSave: true });
      await G.fade(false);
      // (2026-10-31, less narrator: the gauge, the steam and the cloud are drawn; Carmen and Alan say the rest)
      await say('narr_lr_1', 'carmen_lr_1');
      await W(1200);
      await say('alan_lr_1', 'carmen_lr_2');
      await T(1500);
      boiling = 1; S.sfx('kettle_steam', 0.5); S.sfx('kettle_boil', 0.3);
      await say('carmen_lr_boil');
      await W(1200);   // (the lay-by; the bonnet up, and a minute's swearing at it)
      await say('carmen_lr_water');
    });
  };
  S.fillRadiator = async function () {
    const f = F();
    G.takeItem('water'); f.radiator_filled = true; boiling = 2;
    await G.busy(async () => {
      S.sfx('pour', 0.6); await T(600); S.sfx('kettle_steam', 0.5); await T(800);
      await say('alan_lr_fill', 'carmen_lr_go', 'carmen_lr_go_2');
      // darker: the smell, the radio's waves; the Sea's water in the footwell, on his side only; Carmen drives through it
      await W(1500);
      await say('alan_lr_smell', 'carmen_lr_smell');
      S.sfx('water_lap', 0.25);   // (the waves under the radio's static, as Elena heard them on this road)
      await W(800);
      await say('carmen_lr_radio');
      f.footwell = true; S.sfx('water_seep', 0.5);
      await S.waterTo('landrover', 0.12, 2500);
      await say('alan_lr_feet', 'alan_lr_me');
      S.sfx('water_rise', 0.5);
      await S.waterTo('landrover', 0.22, 1500);
      await say('alan_lr_door', 'carmen_lr_through', 'alan_lr_carmen', 'carmen_lr_rag');
      S.water.landrover = 0;
      // (the still: out of the cloud, the stars, the sea of cloud glowing orange along the coast)
      await S.paint('still_cloud_climb', async () => {
        await say('narr_lr_stars', 'carmen_lr_bonfires', 'alan_lr_bonfires');
        await W(1200);
        await say('carmen_lr_twenty');
      }, { zoom: [1.0, 1.12], pan: [[0.5, 0.6], [0.5, 0.4]] });
      G.endStill();
      await S.vaultCutaway();
      await G.goRoom('camp', 'landrover', { instant: true, noEnter: true, noSave: true, pos: [300, 660, 'e'] });
      G.setClock('22:40');
      f.su_camp = true;   // (Carmen comes down to the grille with him: js/story/vasco.js)
      await G.fade(false);
      // the camp in the dark; iron ringing on stone below the cliff, and Yeray's voice
      await say('alan_camp_su');
      await W(900);
      S.sfx('stone_clack', 0.6); await T(600); S.sfx('stone_clack', 0.5); await T(400);
      await G.say('yeray_su_1', { offscreen: true });
      await say('carmen_su_here');
    });
  };

  // ---------------------------------------------------------------- the vault at dusk (cut away to): Vasco and Yeray
  S.vaultCutaway = async function () {
    await G.goRoom('vault', null, { instant: true, noEnter: true, noSave: true, pos: [1240, 700, 'w'] });
    G.player.visible = false;
    S.water.vault = 0.4;
    await G.fade(false);
    // (2026-10-31, less narrator: the water standing round him behind the bars is drawn; Yeray comes down the steps with
    // the bread and water Rayco sends, sees it, and drops the bottle)
    await say('narr_vy_1');
    await W(1500);
    S.sfx('corridor_steps', 0.4); await W(1400);
    S.sfx('tile_shatter', 0.5); await W(700);
    await say('yeray_vy_1', 'vasco_vy_1', 'vasco_vy_2', 'vasco_vy_3', 'yeray_vy_2', 'vasco_vy_4', 'vasco_vy_5', 'vasco_vy_6');
    await W(1500);   // (Yeray says nothing; his face working)
    await say('vasco_vy_7', 'vasco_vy_8', 'vasco_vy_9');
    S.sfx('water_rise', 0.4);
    await S.waterTo('vault', 0.46, 1500);   // (over his mouth)
    await W(1200);
    // Yeray runs for the pick
    S.sfx('corridor_steps', 0.5);
    await walk(G.npc('yeray'), 1240, 690, 2500);
    await G.fade(true);
    G.player.visible = true;
  };

  // ---------------------------------------------------------------- the vault, Sunday night: the rescue
  ROOMS.vault.enter = async function () {
    const f = F();
    if (f.ch !== 6 || f.vault_seen) return;
    f.vault_seen = true;
    S.water.vault = 0.46;
    // (the cleft, Yeray at the grille with the pick, the water standing behind the bars at Vasco's face: all shown)
    S.sfx('stone_clack', 0.5); await W(500);
    await say('yeray_su_come', 'alan_vault_su');
  };
  S.talkYerayVault = () => F().vasco_free ? say('yeray_su_after') : say('yeray_su_pull');
  S.talkVascoVault = () => F().vasco_free ? say('vasco_su_vault') : say('alan_su_vasco_talk');
  // (2026-10-30) the first heave, Alan and Yeray: it moves, and holds; it needs Carmen's weight on the pick handle too
  S.talkCarmenVault = () => { const f = F(); if (f.vasco_free) return say(G.has('disc_wax_gibbous') ? 'carmen_vault_up' : 'carmen_vault_after'); if (f.grille_heaved) f.carmen_on = true; return say('carmen_vault_pull'); };
  S.tearGrille = async function () {
    const f = F();
    if (f.vasco_free) return say('alan_look_grille_off');
    if (!f.grille_heaved) {
      await G.busy(async () => {
        await say('alan_su_pull');
        await S.posed('pull', async () => { S.sfx('chain_creak', 0.6); await T(900); S.sfx('stone_clack', 0.7); await T(500); });
        f.grille_heaved = true;
        await say('yeray_su_2', 'alan_su_more_hands');
      });
      return;
    }
    if (!f.carmen_on) return say('alan_su_more_hands');
    await G.busy(async () => {
      // Carmen's weight on the pick handle with Yeray; the crack in the stone; the grille tears out and Alan pulls Vasco
      // out under it (the open painting, Vasco on the stone); the water stands a moment, and sinks into the floor
      const c = G.npc('carmen'); await walk(c, 1030, 660, 2000);
      await S.posed('pull', async () => { S.sfx('brass_heavy', 0.7); await W(900); S.sfx('stone_clack', 0.8); await W(500); });
      f.vasco_free = true; G.refreshNpcs(true);   // (out: the vasco_free figure, in front of the open alcove; a fresh cast, so he's swapped)
      const c2 = G.npc('carmen'); if (c2) c2.x = 1030;
      await W(1500);
      S.sfx('water_drain', 0.5);
      await S.waterTo('vault', 0, 3000);
      await say('narr_grille_5', 'narr_grille_6');
      await say('vasco_su_out_1', 'alan_su_out_1');
      await W(700);
      await say('vasco_su_out_2');
      await S.posed('reach', () => W(2500));   // (his forehead against Vasco's; Yeray crying on the stone, Carmen's hand on him)
    });
  };
  // the granary, dry; five crates; Carmen's field jacket; the mark on the wall; then up to the rock
  S.takeDiscs = async function () {
    const f = F();
    if (F().as_vasco) return say('vasco_look_crates');
    if (!f.vasco_free) return say('alan_crates_first');
    if (G.has('disc_wax_gibbous') || f.ch === 7) return say('alan_crates_empty');
    await G.busy(async () => {
      // the five crates, a disc in straw in each; Carmen wraps them in her field jacket
      await S.posed('pickup', async () => { S.sfx('cloth_jacket', 0.4); await W(900); });
      S.giveDiscs();
      await say('alan_su_discs', 'vasco_su_discs');
      await say('alan_su_mark');
      await W(1500);
      f.v_marked = true;
    });
    await S.onTheRock();
  };

  // ---------------------------------------------------------------- the talk on the rock (the camp, after midnight)
  ROOMS.camp.npcs.push(
    { id: 'vasco', x: 600, y: 660, dir: 'w', name: 'Vasco', when: () => F().ch === 6 && F().su_rock, look: 'alan_look_vasco_rock', talk: () => say('vasco_rock_again') },
    { id: 'yeray', ch: 'yeray', x: 960, y: 640, dir: 'w', name: 'Yeray', when: () => F().ch === 6 && F().su_rock, look: 'alan_look_yeray_rock', talk: () => say('yeray_rock_1', 'vasco_rock_yeray') },
  );
  S.onTheRock = async function () {
    const f = F();
    await G.busy(async () => {
      await G.fade(true);
      f.su_rock = true;
      await G.goRoom('camp', null, { instant: true, noEnter: true, noSave: true, pos: [520, 660, 'e'] });
      await G.fade(false);
      S.sfx('coffee_cups', 0.4);
      await say('narr_rock_1');
      await say('vasco_rock_1', 'alan_rock_1', 'vasco_rock_2', 'vasco_rock_3', 'vasco_rock_4', 'alan_rock_2', 'vasco_rock_5', 'vasco_rock_6');
      await say('alan_rock_3', 'vasco_rock_7', 'carmen_rock_1', 'vasco_rock_8', 'vasco_rock_9');
      await W(1000);   // (he looks at Alan)
      await say('alan_rock_4');
      await W(2200);   // (nobody says anything: Vasco understands it, and puts it away behind his eyes)
      await say('carmen_rock_2', 'vasco_su_dawn');
      if (f.su_watch) {
        await S.posed('reach', async () => { await W(700); await say('vasco_rock_watch'); });   // (the watch, held out)
        await say('alan_rock_5', 'alan_rock_6');
        await W(1200);   // (he puts it on, slowly, with cold fingers)
        await say('vasco_rock_10', 'alan_rock_7');
      }
      // Vasco's head on his shoulder; and now the thing Alan has to say
      const v = G.npc('vasco'); await walk(v, 565, 660, 1500); if (v) v.dir = 'w';
      await W(1200);
      await say('alan_rock_friday', 'vasco_rock_11');
      await W(1200);
      await say('vasco_rock_12', 'vasco_rock_13');
      await S.posed('reach', () => W(1800));   // (he holds on)
      f.su_not_now = true;
    });
    await G.dialog([
      { line: 'alan_rock_ask_why', once: true, run: async () => {
        await say('vasco_rock_tasarte_1', 'vasco_rock_tasarte_2', 'vasco_rock_tasarte_3');
        S.sfx('match', 0.45); await W(900);   // (Carmen's lighter: one try, this time)
        await say('carmen_rock_3', 'carmen_rock_4', 'vasco_rock_14', 'alan_rock_8', 'alan_rock_9', 'alan_rock_10');
        await W(2000);
      } },
      { line: 'alan_rock_ask_trowel', once: true, run: () => say('vasco_rock_trowel', 'alan_rock_trowel') },
      { line: 'alan_rock_go', bye: true, run: () => S.pathToCave() },
    ]);
  };
  // "It's four o'clock." The path along the cliff in the dark; the breathing in the cave mouth; in. (Monday: mon.js)
  S.pathToCave = async function () {
    await G.busy(async () => {
      await say('yeray_rock_time', 'vasco_rock_go');
      await say('narr_path_1');
      await G.fade(true);
      // (over the black: the cave mouth breathing, like surf a long way down)
      S.sfx('water_lap', 0.4); await W(2500);
    });
    await S.startMon();
  };
})();
