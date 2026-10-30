// The Shortest Night — Friday 21 June: the solstice. Rewritten from the novel's Chapters Four and Five (2026-10-30):
// the fight at five in the morning (the van, the mist told at last, "sunburn", the coffee by the bed, Lorenzo, "go
// home"); the sea wall all day, and Chano with two beers ("I went to Telde"); Carmen's coffee and how the cave works
// ("go home before Sunday"); back on the wall at dusk, the mist comes up the steps and Alan walks inland into Vegueta;
// the bar with no name: Rafa, the rum, the napkin; three tries to leave (eleven, midnight and the telephone, two
// o'clock); Yeray talking at the end of the bar to a man too busy to hear; "Is there someone?" "No." The studio and
// Santa Ana's bells at three; and, across the city, Agustín Ramos.
// Room first seen today: Rafa's bar.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;

  S.startFri = async function () {
    await S.morning(4);
    await S.fight();
  };

  // ---------------------------------------------------------------- the fight
  // Five in the morning; neither of them slept. The player picks how Alan answers "sunburn"; it changes the tone, not
  // what happens.
  S.fight = async function () {
    const f = F();
    if (f.fight_done) return;
    await G.busy(async () => {
      await say('narr_f_1', 'narr_f_2');
      await say('vasco_f_1', 'vasco_f_1b', 'alan_f_1', 'vasco_f_sunrise', 'alan_f_told', 'narr_f_3');
      await say('alan_f_ask', 'vasco_f_2', 'vasco_f_2b', 'vasco_f_2c');
      // Montesdeoca's van: the red herring, answered
      await say('alan_f_monte', 'narr_f_4', 'vasco_f_chano', 'alan_f_chano', 'vasco_f_lottery', 'narr_f_5', 'vasco_f_van', 'vasco_f_van_2');
      // the mist, told at last
      await say('narr_f_6', 'alan_f_else', 'vasco_f_course', 'alan_f_mist', 'narr_f_7', 'narr_f_8', 'narr_f_9');
      await say('vasco_f_tuesday', 'alan_f_vasco', 'vasco_f_tuesday_2', 'narr_f_10', 'vasco_f_sunburn');
      await G.dialog([
        { line: 'alan_f_choice_c', run: () => say('vasco_f_3c', 'alan_f_spoil', 'alan_f_spoil_2', 'vasco_f_eighty'), bye: true },
        { line: 'alan_f_choice_a', run: () => say('vasco_f_3a'), bye: true },
        { line: 'alan_f_choice_b', run: () => say('vasco_f_3b'), bye: true },
      ]);
      await say('narr_f_11');
      // the coffee by the bed
      await say('narr_f_12', 'vasco_f_4', 'vasco_f_coffee', 'vasco_f_coffee_2', 'alan_f_4', 'vasco_f_true', 'narr_f_13',
        'vasco_f_true_2', 'vasco_f_true_3', 'vasco_f_true_4', 'alan_f_5', 'vasco_f_know');
      // Lorenzo
      await say('narr_f_14', 'narr_f_15', 'vasco_f_tell', 'vasco_f_lorenzo_1', 'vasco_f_lorenzo_1b', 'narr_f_smile', 'vasco_f_lorenzo_2', 'vasco_f_lorenzo_2b',
        'narr_f_16', 'vasco_f_lorenzo_flat', 'vasco_f_lorenzo_4', 'narr_f_17', 'vasco_f_lorenzo_5', 'vasco_f_lorenzo_6', 'vasco_f_lorenzo_7');
      await say('narr_f_fan', 'vasco_f_lorenzo_3', 'narr_f_18', 'vasco_f_lorenzo_8');
      await say('narr_f_19'); S.sfx('cloth_shirt', 0.5);
      await say('narr_f_20');
      // at the door
      await S.paint('still_fight', async () => {
        await say('narr_f_21', 'vasco_f_leave', 'vasco_f_leave_2', 'alan_f_you', 'vasco_f_needed');
        S.sfx('door', 0.6); await say('narr_fight');
      }, { zoom: [1.0, 1.06] });
      G.endStill();
      f.fight_done = true; G.refreshNpcs();
      await G.fade(false);
      await say('narr_f_22', 'narr_f_23', 'narr_f_24', 'alan_f_alone');
    });
  };

  // ---------------------------------------------------------------- the sea wall: all day, and Chano with two beers
  // (on the first visit to Las Canteras after the fight; tue.js's own arrival is kept, not replaced)
  const canterasEnter = ROOMS.canteras.enter;
  ROOMS.canteras.enter = async function (entry) {
    const f = F();
    if (f.ch === 4 && f.fight_done && !f.wall_fri) { f.wall_fri = true; return S.seaWall(); }
    if (canterasEnter) return canterasEnter.call(this, entry);
  };
  S.seaWall = async function () {
    await G.fade(true);
    const p = G.player; p.x = 380; p.y = 660; p.dir = 'w';
    await G.fade(false);
    await say('narr_f_wall_1', 'narr_f_wall_2', 'narr_f_wall_3');
    S.sfx('water_lap', 0.3);
    await say('narr_f_wall_4', 'narr_f_wall_5', 'narr_f_wall_6', 'narr_f_wall_7', 'narr_f_wall_8');
    S.sfx('glass_set', 0.4);
    await say('narr_f_chano_1', 'chano_f_1', 'alan_f_chano_1', 'chano_f_2', 'alan_f_chano_2', 'narr_f_chano_2',
      'chano_f_3', 'alan_f_chano_3', 'chano_f_4', 'narr_f_chano_3', 'chano_f_5', 'narr_f_chano_4');
    await say('alan_f_wall_end');
  };

  // ---------------------------------------------------------------- Carmen, Friday afternoon: how the cave works
  // (wed.js S.talkCarmen: her toll of Coronas first, then this)
  S.carmenCave = async function () {
    const f = F();
    if (!f.fight_done) return say('carmen_f_early');
    if (f.dusk_fri) return say('carmen_f_bye');
    if (!f.cave_explained) {
      await say('narr_f_arch_1', 'narr_f_arch_2');
      S.sfx('coffee_cups', 0.5);
      await say('carmen_f_1', 'alan_f_carmen_1', 'carmen_f_coffee', 'alan_f_carmen_1b', 'carmen_f_island', 'alan_f_carmen_2');
      S.sfx('paper_shuffle', 0.5);
      await say('narr_f_arch_3', 'carmen_f_beam', 'carmen_f_beam_2', 'narr_f_arch_4', 'carmen_f_triangles', 'alan_f_carmen_and',
        'carmen_f_discs', 'carmen_f_sentence', 'alan_f_carmen_friend', 'carmen_f_dead', 'narr_f_arch_5');
      await say('carmen_f_san_juan', 'carmen_f_san_juan_2');
      S.sfx('drawer_open', 0.4);
      await say('narr_f_arch_6', 'carmen_f_san_juan_3', 'alan_f_carmen_why', 'carmen_f_friend', 'alan_f_carmen_3', 'narr_f_arch_7', 'carmen_f_go_home');
      f.cave_explained = true;
    }
    // the depth, for those who ask; then the afternoon goes, and the dusk comes
    await G.dialog([
      { line: 'alan_ask_carmen_friend', once: true, run: () => say('carmen_f_friend_2') },
      { line: 'alan_ask_carmen_sunday', once: true, run: () => say('carmen_f_sunday') },
      { line: 'alan_ask_carmen_dinner', once: true, run: () => say('carmen_f_dinner', 'carmen_f_dinner_2') },
      { line: 'alan_bye_carmen', bye: true, run: () => say('carmen_f_bye') },
    ]);
    await S.duskFri();
  };

  // ---------------------------------------------------------------- dusk: the mist up the steps, and the walk inland
  // Back on the sea wall late in the afternoon (the car he doesn't hire); at nine the mist comes in thicker than on
  // Tuesday, up over the sand and the first steps; he walks away from the sea, through Triana, into Vegueta.
  const canterasMist = S.mistNow;   // (tue.js; heavier while Friday's dusk plays)
  S.mistNow = () => (F().ch === 4 && F().dusk_mist && !F().rafa_bar_in) ? 0.85 : canterasMist();
  S.duskFri = async function () {
    const f = F();
    if (f.dusk_fri) return;
    f.dusk_fri = true;
    await G.busy(async () => {
      await G.fade(true);
      await G.goRoom('canteras', null, { instant: true, noEnter: true, noSave: true, pos: [960, 640, 'n'] });
      await G.fade(false);
      await say('narr_f_dusk_1', 'alan_f_dusk_1', 'alan_f_dusk_2', 'narr_f_dusk_2', 'narr_f_dusk_3');
      S.sfx('crash_wave', 0.35); f.dusk_mist = true;
      await say('narr_f_dusk_4', 'narr_f_dusk_5');
      S.sfx('dog_distant', 0.4);
      await say('narr_f_dusk_6', 'narr_f_dusk_7', 'narr_f_dusk_8');
      S.sfx('water_lap', 0.35);
      await say('narr_f_dusk_9');
      await G.player.walkTo(1080, 690);
      await G.fade(true);
      S.sfx('step_cobble', 0.4);
      await say('narr_f_walk_1', 'narr_f_walk_2');
      S.sfx('step_cobble', 0.4);
      await say('narr_f_walk_3', 'narr_f_walk_4');
      f.rafa_bar_in = true;
      await G.goRoom('rafa_bar', 'map');
    });
  };

  // ================================================================ RAFA'S BAR
  ROOMS.rafa_bar = S.room({
    music: 'rafa_bar',
    name: 'A bar in Vegueta', bg: 'rafa_bar', floor: 'tile', ambience: 'tavern', door: 'door_tavern',
    light: { ambient: 'rgb(200,160,120)', base: 0.8 },
    entries: { default: [1120, 660, 'w'], map: [1120, 660, 'w'] },
    npcs: [
      { id: 'rafa', ch: 'rafa', x: 520, y: 610, h: 370, dir: 'e', name: 'Rafa', at: [640, 660], look: () => say(F().rafa_talked ? 'alan_look_rafa_2' : 'alan_look_rafa'), talk: () => S.talkRafa(),
        items: { napkin: () => say('rafa_napkin_back'), any: 'alan_fail_rafa_item' } },
      { id: 'yeray', ch: 'yeray', x: 160, y: 615, h: 370, dir: 'e', name: 'A boy at the end of the bar', when: () => !F().yeray_left, look: 'alan_look_yeray_bar', talk: () => S.talkYerayBar() },
    ],
    hotspots: [
      { name: 'Bottles', rect: [60, 230, 800, 70], at: [500, 650], look: 'alan_look_bottles' },
      { name: 'The faces on the walls', rect: [440, 85, 560, 210], at: [760, 650], look: 'alan_look_portraits' },
      { name: 'Domino table', rect: [880, 470, 160, 80], at: [940, 650], look: 'alan_look_domino' },
      { name: 'Door', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'map', entry: 'rafa_bar', locked: () => true, lockedLine: () => S.tryLeave() },
    ],
    async enter() {
      if (!F().bar_intro) { F().bar_intro = true; F().rafa_bar_in = true; await say('narr_bar', 'narr_bar_2', 'narr_bar_3', 'narr_bar_4', 'alan_bar_in'); }
    },
    // the two lanterns burning, a moth at one, the street lamp outside, and the smoke of the evening under the beams
    lights: [
      { x: 403, y: 138, rgb: '255,200,120', kind: 'flame', seed: 1, glow: 70, ga: 0.15 },
      { x: 901, y: 178, rgb: '255,200,120', kind: 'flame', seed: 6, glow: 60, ga: 0.15 },
      { x: 1242, y: 258, rgb: '255,215,150', kind: 'gas', seed: 2, glow: 26, ga: 0.2 },
    ],
    animBack(g, t) {
      if (!smoke) {
        smoke = FX.makeFog(19, '228,218,204', 0.6);
        fade = document.createElement('canvas'); fade.width = 1280; fade.height = 720;
        const fg = fade.getContext('2d'), gr = fg.createLinearGradient(0, 40, 0, 360);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); fg.fillStyle = gr; fg.fillRect(0, 0, 1280, 360);
      }
      FX.masked(g, fade, m => FX.drawFog(m, smoke, t, 0.24, 7, -220));
      FX.moth(g, t, 902, 182, 26, 18, 5);
    },
  });
  let smoke = null, fade = null; // the bar's smoke bank and the mask that keeps it up under the ceiling

  // the door: before Rafa, "two drinks"; after, three tries to leave (eleven; midnight and the telephone; two o'clock
  // and the question). Each try is a scene, started here and played once the door's first line is said (one voice at
  // a time: the engine queues it). The third needs Rafa to have drawn him.
  const LEAVE = ['narr_leave_1', 'narr_leave_2', 'narr_leave_3'];
  S.tryLeave = function () {
    const f = F();
    if (!f.rafa_talked) return 'alan_stay_0';
    if (f.rafa_night) return 'alan_stay_3';
    const n = f.stay_n || 0;
    if (n >= 2 && !G.has('napkin')) return 'alan_stay_napkin';
    f.stay_n = n + 1;
    const scene = [S.leaveEleven, S.leaveMidnight, S.rafaQuestion][Math.min(n, 2)];
    G.busy(async () => { await T(0); await scene(); });
    return LEAVE[Math.min(n, 2)];
  };
  // eleven: "Nobody leaves after three"; and nobody is waiting for him
  S.leaveEleven = async function () {
    S.sfx('coins_clink', 0.4);
    await say('alan_leave_1', 'rafa_leave_1', 'rafa_leave_1b', 'alan_leave_1b', 'rafa_leave_1c', 'narr_leave_1b');
    await say('alan_stay_1');
    S.sfx('pour', 0.5);
  };
  // midnight: the telephone, the museum's night guard, the camp's radio switched off; "Is it an emergency?"
  // Then Yeray goes, and Alan doesn't ask.
  S.leaveMidnight = async function () {
    await say('alan_leave_2', 'narr_leave_2b');
    S.sfx('payphone_coins', 0.6); await T(500); S.sfx('phone_dial', 0.5); await T(1200);
    await say('alan_leave_2b', 'narr_leave_2c');
    await T(1200);
    await say('guard_f_1', 'guard_f_2', 'narr_leave_2d', 'alan_leave_2c');
    S.sfx('phone_hangup', 0.6);
    await say('alan_stay_2', 'narr_leave_2e');
    S.sfx('pour', 0.5);
    if (!F().yeray_left) await S.yerayLeaves();
  };
  S.yerayLeaves = async function () {
    const f = F();
    await say('narr_yeray_go_1', 'narr_yeray_go_2');
    S.sfx('door_tavern', 0.5); f.yeray_left = true; G.refreshNpcs();
    await say('rafa_yeray_1', 'rafa_yeray_2', 'narr_yeray_go_3', 'alan_yeray_3');
    S.sfx('pencil_scribble', 0.4);
    await say('narr_yeray_go_4');
  };
  S.talkRafa = async function () {
    const f = F();
    if (!f.rafa_talked) {
      f.rafa_talked = true;
      await say('narr_rafa_1', 'narr_rafa_2', 'rafa_1', 'alan_rafa_1', 'rafa_2', 'rafa_2b');
      S.sfx('pour', 0.5);
      await S.posed('drink', () => say('narr_rafa_3'));
      await say('alan_rafa_rum', 'narr_rafa_4', 'rafa_3', 'alan_rafa_2', 'rafa_4', 'alan_rafa_3', 'rafa_5');
      return;
    }
    await G.dialog([
      { line: 'alan_ask_rafa_paint', once: true, run: () => say('rafa_paint', 'rafa_paint_2', 'alan_rafa_paint', 'rafa_paint_3', 'alan_rafa_flatter') },
      { line: 'alan_ask_rafa_island', once: true, run: () => say('rafa_island', 'narr_rafa_light', 'rafa_island_2', 'alan_rafa_island', 'rafa_island_3', 'alan_rafa_island_2', 'yeray_bar_3') },
      { line: 'alan_ask_rafa_draw', once: true, when: () => !G.has('napkin'), run: async () => {
        await say('rafa_draw_1', 'narr_rafa_draw'); S.sfx('pencil_scribble', 0.5);
        await say('yeray_bar_1', 'rafa_draw_2'); await T(1200);
        S.give('napkin'); await say('narr_napkin', 'narr_napkin_2', 'alan_rafa_napkin', 'rafa_draw_3', 'yeray_bar_2', 'narr_rafa_touch');
      } },
      { line: 'alan_ask_rafa_another', run: async () => { S.sfx('pour', 0.5); await S.posed('drink', () => say('rafa_another')); f.rums = (f.rums || 1) + 1; } },
      { line: 'alan_bye_rafa', bye: true, run: () => say('rafa_bye') },
    ]);
  };
  // the boy at the end of the bar tells the truth to a man too busy to hear it
  S.talkYerayBar = async function () {
    const f = F();
    if (f.yeray_talked) return say('alan_yeray_1', 'yeray_bar_4');
    f.yeray_talked = true;
    await say('alan_yeray_1', 'yeray_bar_4', 'narr_yeray_talk', 'yeray_bar_5', 'yeray_bar_6', 'alan_yeray_2', 'narr_yeray_talk_2');
  };
  // two o'clock: the chairs on the tables, "Me too", the studio upstairs, and the question. Both answers are "No."
  S.rafaQuestion = async function () {
    const f = F();
    if (f.rafa_night) return;
    if (!f.yeray_left) await S.yerayLeaves();
    S.sfx('chair_scrape', 0.5);
    await say('alan_leave_3', 'narr_q_1', 'alan_stay_3', 'rafa_closing', 'narr_q_2', 'rafa_upstairs', 'narr_q_3', 'rafa_someone',
      'narr_q_4', 'narr_q_5', 'narr_q_6', 'narr_q_7', 'narr_q_8');
    await G.dialog([
      { line: 'alan_someone_no', run: async () => { f.lie = 'no'; await say('narr_q_9', 'alan_someone_no2'); }, bye: true },
      { line: 'alan_someone_no2', label: '…No.', run: () => { f.lie = 'no2'; }, bye: true },
    ]);
    f.rafa_night = true;
    await say('narr_q_10', 'narr_q_11');
    S.sfx('stairs', 0.5);
    // the studio under the roof; Santa Ana strikes three
    const night = async () => {
      await say('narr_rafa_night', 'narr_rafa_night_2', 'narr_rafa_night_3', 'narr_rafa_night_4', 'narr_rafa_night_5');
      S.sfx('church_bells_distant', 0.4);
      await say('narr_rafa_night_6'); S.sfx('bell_hum_soft', 0.3);
      await say('narr_rafa_night_7', 'narr_rafa_night_8');
    };
    if (!S.discreet()) await S.paint('still_rafa_night', night, { zoom: [1.0, 1.1] });
    else { await G.fade(true); await night(); }
    G.endStill();
    await S.agustin();
    await S.startSat();
  };

  // ---------------------------------------------------------------- Agustín Ramos (a cutscene, on black)
  // The lifeguard pulled out of a rip in 1958, asleep in his armchair in Guanarteme at three in the morning.
  S.agustin = async function () {
    await G.fade(true);
    await T(600);
    await say('narr_agustin_1', 'narr_agustin_2', 'narr_agustin_3', 'narr_agustin_4');
    S.sfx('salt_fizz', 0.35); await T(600);
    await say('narr_agustin_5');
    S.sfx('water_rise', 0.4);
    await say('narr_agustin_6', 'narr_agustin_7');
    await T(1200);
  };
})();
