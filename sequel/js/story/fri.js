// The Shortest Night — Friday 21 June: the solstice. The fight in the hotel room (Lorenzo; Vasco leaves for the
// mountain); Carmen's coffee and how the cave works ("go home before Sunday"); the night at Rafa's bar. The night is
// forced: the player can try to leave three times and Alan finds a reason to stay each time; Yeray talks at the end of
// the bar and Alan doesn't listen; "Is there someone?" has two answers and both are lies.
// Room first seen today: Rafa's bar.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;

  S.startFri = async function () {
    await S.morning(4);
    await S.fight();
  };

  // ---------------------------------------------------------------- the fight
  // The player picks Alan's replies; they change the tone, not what happens.
  S.fight = async function () {
    const f = F();
    if (f.fight_done) return;
    await G.busy(async () => {
      const v = G.npc('vasco');
      await say('vasco_f_1', 'alan_f_1', 'vasco_f_2');
      await G.dialog([
        { line: 'alan_f_choice_a', run: () => say('vasco_f_3a'), bye: true },
        { line: 'alan_f_choice_b', run: () => say('vasco_f_3b'), bye: true },
        { line: 'alan_f_choice_c', run: () => say('vasco_f_3c'), bye: true },
      ]);
      await say('vasco_f_4', 'alan_f_4', 'vasco_f_lorenzo_1', 'vasco_f_lorenzo_2', 'vasco_f_lorenzo_3', 'alan_f_5', 'vasco_f_leave');
      await S.paint('still_fight', async () => { S.sfx('door', 0.6); await say('narr_fight'); }, { zoom: [1.0, 1.06] });
      G.endStill();
      f.fight_done = true; G.refreshNpcs();
      await G.fade(false);
      await say('alan_f_alone');
    });
  };

  // ---------------------------------------------------------------- Carmen, Friday afternoon: how the cave works
  S.carmenCave = async function () {
    const f = F();
    if (!f.fight_done) return say('carmen_f_early');
    if (!f.cave_explained) {
      S.sfx('coffee_cups', 0.5);
      await say('carmen_f_1', 'alan_f_carmen_1', 'carmen_f_coffee', 'carmen_f_beam', 'carmen_f_triangles', 'carmen_f_discs', 'alan_f_carmen_2', 'carmen_f_san_juan', 'carmen_f_friend', 'alan_f_carmen_3', 'carmen_f_go_home');
      f.cave_explained = true;
      return;
    }
    await G.dialog([
      { line: 'alan_ask_carmen_friend', once: true, run: () => say('carmen_f_friend_2') },
      { line: 'alan_ask_carmen_sunday', once: true, run: () => say('carmen_f_sunday') },
      { line: 'alan_bye_carmen', bye: true, run: () => say('carmen_f_bye') },
    ]);
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
      { id: 'yeray', ch: 'yeray', x: 160, y: 615, h: 370, dir: 'e', name: 'A boy at the end of the bar', look: 'alan_look_yeray_bar', talk: () => S.talkYerayBar() },
    ],
    hotspots: [
      { name: 'Bottles', rect: [60, 230, 800, 70], at: [500, 650], look: 'alan_look_bottles' },
      { name: 'Domino table', rect: [880, 470, 160, 80], at: [940, 650], look: 'alan_look_domino' },
      { name: 'Door', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'map', entry: 'rafa_bar', locked: () => true, lockedLine: () => S.tryLeave() },
    ],
    async enter() {
      if (!F().bar_intro) { F().bar_intro = true; await say('narr_bar', 'alan_bar_in'); }
    },
  });
  // the door: before Rafa, "one drink"; after, three reasons to stay, and then the question
  const STAY = ['alan_stay_1', 'alan_stay_2', 'alan_stay_3'];
  S.tryLeave = function () {
    const f = F();
    if (!f.rafa_talked) return 'alan_stay_0';
    const n = f.stay_n || 0; f.stay_n = n + 1;
    if (n >= 2 && G.has('napkin')) setTimeout(() => { G.busy(() => S.rafaQuestion()); }, window.FAST ? 30 : 400);
    return STAY[Math.min(n, 2)];
  };
  S.talkRafa = async function () {
    const f = F();
    if (!f.rafa_talked) {
      f.rafa_talked = true;
      await say('rafa_1', 'alan_rafa_1', 'rafa_2');
      await S.posed('drink', () => say('alan_rafa_rum'));
      await say('rafa_3', 'alan_rafa_2', 'rafa_4');
      return;
    }
    await G.dialog([
      { line: 'alan_ask_rafa_paint', once: true, run: () => say('rafa_paint', 'alan_rafa_paint') },
      { line: 'alan_ask_rafa_draw', once: true, when: () => !G.has('napkin'), run: async () => {
        await say('rafa_draw_1', 'yeray_bar_1', 'rafa_draw_2'); S.sfx('pencil_scribble', 0.5); await T(1200);
        S.give('napkin'); await say('rafa_draw_3', 'alan_rafa_napkin', 'yeray_bar_2', 'alan_rafa_napkin_2');
      } },
      { line: 'alan_ask_rafa_island', once: true, run: () => say('rafa_island', 'yeray_bar_3', 'alan_rafa_island') },
      { line: 'alan_ask_rafa_another', run: async () => { await S.posed('drink', () => say('rafa_another')); f.rums = (f.rums || 1) + 1; } },
      { line: 'alan_bye_rafa', bye: true, run: () => say('rafa_bye') },
    ]);
  };
  // the boy at the end of the bar tells the truth to a man too busy to hear it
  S.talkYerayBar = async function () {
    await say('alan_yeray_1', 'yeray_bar_4', 'yeray_bar_5');
    await say('alan_yeray_2'); // (he's already looking back at Rafa)
  };
  S.rafaQuestion = async function () {
    const f = F();
    if (f.rafa_night) return;
    await say('rafa_closing', 'rafa_someone');
    await G.dialog([
      { line: 'alan_someone_no', run: () => { f.lie = 'no'; }, bye: true },
      { line: 'alan_someone_no2', run: () => { f.lie = 'no2'; }, bye: true },
    ]);
    f.rafa_night = true;
    await say('rafa_after_lie');
    if (!S.discreet()) await S.paint('still_rafa_night', () => say('narr_rafa_night'), { zoom: [1.0, 1.1] });
    else { await G.fade(true); await say('narr_rafa_night'); }
    G.endStill();
    await S.startSat();
  };
})();
