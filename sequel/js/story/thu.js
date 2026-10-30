// The Shortest Night — Thursday 20 June: the break-in. Rewritten from the novel's Chapter Three (2026-10-30), in its
// order: Chano's news (Pepe Santana); Doña Pino's missal; Carmen on the harimaguadas, the conquest and the legend of
// 1483; Inês and the foundry ledger (the call, core.js); Casa de Colón and the 1484 inquiry (Mercedes Quintana); the tide,
// and Gail and Derek at their table; the plan and the suitcase; the dinner (Vasco's talk, Derek's fall), Baute's office,
// caught in front of everyone, Vasco among them; the silent night.
// The scenes whose rooms live elsewhere are written here and called from there: S.chanoNewsThu (the kiosk, tue.js),
// S.pinoMissal (La Isleta: wed.js S.talkPino already calls it), S.gdThu (the restaurant, tue.js), S.suitcaseThu (the lobby, tue.js).
// Rooms first seen today: Casa de Colón, Baute's office.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;

  S.startThu = async function () {
    await S.morning(3, 'alan_th_wake');
  };
  // the afternoon: back to the hotel for a jacket (the suitcase), then the dinner. A save made at the dinner before the
  // suitcase existed (dinner_intro) still counts as dressed.
  // (and, since 2026-10-30, the two tellings of 1483, folio 12 and the case built in the notebook: js/story/puzzles.js)
  const ready = f => f.lore_carmen && f.inquiry_read && f.called_thu && f.tellings && f.folio12 && f.case_thu;
  S.suitcaseDue = () => { const f = F(); return ch() === 3 && ready(f) && !f.suitcase_done && !f.dinner_intro; };
  S.dinnerDue = () => { const f = F(); return ch() === 3 && (f.dinner_intro || ready(f)) && !!(f.suitcase_done || f.dinner_intro); };

  // ---------------------------------------------------------------- the kiosk: Chano's news (called from tue.js S.talkChano)
  S.chanoNewsThu = async function () {
    const f = F();
    if (f.chano_pepe) return;
    f.chano_pepe = true; f.pepe_known = true;
    await say('narr_th_chano_1', 'chano_th_pepe_1', 'chano_th_pepe_2', 'narr_th_chano_2', 'chano_th_pepe_3', 'chano_th_pepe_4',
      'narr_th_chano_3', 'alan_th_chano_1', 'chano_th_pepe_5', 'alan_th_chano_2', 'chano_th_pepe_6');
  };

  // ---------------------------------------------------------------- La Isleta: Doña Pino's missal (called from wed.js S.talkPino)
  S.pinoMissal = async function () {
    await say('narr_th_pino_1', 'pino_th_pepe_1', 'pino_th_pepe_1b', 'pino_th_pepe_2');
    await S.readPinoList();
    await say('narr_th_pino_2', 'pino_th_pepe_3', 'alan_th_pino_1', 'pino_th_debts', 'pino_th_debts_2', 'narr_th_pino_3', 'pino_th_know',
      'narr_th_pino_4', 'narr_th_pino_5', 'alan_th_debts');
  };

  // ---------------------------------------------------------------- Carmen, Thursday morning: the history
  // (the toll comes first: wed.js S.talkCarmen -> S.carmenToll, then here)
  S.carmenLore = async function () {
    const f = F();
    if (!f.lore_carmen) {
      await say('narr_th_arch_1', 'carmen_th_1', 'alan_th_carmen_1', 'carmen_th_rude', 'narr_th_arch_2',
        'alan_th_carmen_2', 'narr_th_arch_3', 'carmen_th_harimaguadas', 'carmen_th_harimaguadas_2', 'carmen_th_harimaguadas_3',
        'alan_th_carmen_3', 'carmen_th_conquest', 'narr_th_arch_4', 'carmen_th_conquest_2', 'carmen_th_ansite', 'carmen_th_ansite_2', 'carmen_th_ansite_3',
        'alan_th_carmen_4', 'narr_th_arch_5', 'carmen_th_who', 'alan_th_carmen_5', 'narr_th_arch_6',
        'carmen_th_legend', 'carmen_th_legend_2', 'carmen_th_legend_3', 'carmen_th_legend_4',
        'alan_th_risco', 'carmen_th_risco', 'carmen_th_grandmothers', 'alan_th_believe', 'carmen_th_believe',
        'alan_th_documents', 'carmen_th_colon', 'narr_th_arch_7', 'carmen_th_colon_2');
      f.lore_carmen = true; f.sent_to_colon = true;
    }
    await G.dialog([
      { line: 'alan_ask_carmen_monte', once: true, run: () => { f.herring_carmen = true; return say('carmen_th_monte', 'carmen_th_monte_2', 'carmen_th_monte_3'); } },
      { line: 'alan_ask_carmen_galindo', once: true, run: () => say('carmen_th_galindo') },
      { line: 'alan_ask_carmen_magec', once: true, run: () => say('carmen_th_magec') },
      { line: 'alan_ask_carmen_baute', once: true, run: () => say('carmen_th_baute') },
      { line: 'alan_ask_carmen_elena', once: true, when: () => f.saw_disc_list, run: () => say('carmen_th_elena') },
      // Pepe: she says nothing; her eyes go to the conservation list; then she sends him away, quietly
      { line: 'alan_ask_carmen_pepe', when: () => f.pepe_known && !f.carmen_pepe, bye: true, run: async () => {
        f.carmen_pepe = true;
        await say('narr_th_arch_8', 'narr_th_arch_9', 'carmen_th_pepe', 'narr_th_arch_10');
      } },
      { line: 'alan_bye_carmen', bye: true, run: () => say('carmen_bye') },
    ]);
  };

  // ================================================================ CASA DE COLÓN: the square outside (2026-10-29: the
  // building from outside before Alan goes in; the map's pin lands here, the Gothic portal goes in)
  ROOMS.colon_out = S.room({
    music: 'santa_ana',
    name: 'Casa de Colón', bg: 'colon_out', floor: 'stone', ambience: 'street',
    entries: { default: [200, 660, 'e'], map: [200, 660, 'e'], colon: [715, 590, 's'] },
    hotspots: [
      { name: 'Casa de Colón', rect: [668, 385, 94, 160], at: [715, 570], exit: 'colon', entry: 'map' },
      S.toMap([0, 380, 60, 300], [50, 650]),
    ],
    async enter() {
      if (!F().narr_colon_out) { F().narr_colon_out = true; await say('narr_th_colon_1', 'narr_th_colon_2'); }
    },
  });
  // ================================================================ CASA DE COLÓN: the library
  ROOMS.colon = S.room({
    music: 'colon',
    name: 'Casa de Colón', bg: 'colon', floor: 'wood', ambience: 'museum',
    entries: { default: [200, 660, 'e'], map: [200, 660, 'e'] },
    npcs: [
      { id: 'mercedes', ch: 'mercedes', x: 760, y: 645, dir: 'w', name: 'Mercedes Quintana', look: 'alan_look_mercedes', talk: () => S.talkMercedes() },
    ],
    hotspots: [
      { name: 'Parrot', rect: [315, 210, 80, 140], at: [360, 650], look: 'alan_look_parrot', use: 'parrot_squawk' },
      { name: 'Shelves', rect: [340, 80, 520, 300], at: [600, 640], look: 'alan_look_colon_shelves' },
      { name: 'Balcony', rect: [860, 120, 260, 280], at: [980, 640], look: 'alan_look_colon_balcony' },
      { name: 'To the city', rect: [20, 250, 110, 320], at: [70, 650], exit: 'colon_out', entry: 'colon', look: 'alan_look_tomap', kind: 'exit' },
    ],
    async enter() {
      if (!F().narr_colon) { F().narr_colon = true; await say('narr_th_colon_3', 'narr_th_colon_4', 'parrot_th_rude'); }
    },
    // the parrot breathing on its perch, the palm in the courtyard stirring, the gallery lantern and the reading lamp, a moth
    lights: [
      { x: 116, y: 185, rgb: '255,205,130', kind: 'flame', seed: 3, glow: 50, ga: 0.18 },
      { x: 1043, y: 390, rgb: '255,225,150', kind: 'gas', seed: 1, glow: 50, ga: 0.12 },
    ],
    animBack(g, t) {
      const im = G.bgImage();
      FX.sway(g, im, [28, 150, 66, 190], t * 0.7, 1.1, 0, true); FX.sway(g, im, [178, 185, 34, 110], t * 0.7, 0.9, 1.1, true);
      FX.breathe(g, im, [320, 215, 70, 82], t, 0.012, 3.4);
      FX.moth(g, t, 116, 190, 28, 18, 2);
    },
  });
  // the inquiry is the core of the visit (it opens the dinner), Juan de Quintana with it (pulled out of the sea, drowned
  // in his bed: the rule Pepe's death follows); the witches of '83 and the parrots are for those who ask
  S.readInquiryAloud = async function () {
    const f = F();
    await say('narr_th_merc_3', 'mercedes_inquiry', 'mercedes_inquiry_2', 'narr_th_merc_4',
      'mercedes_read_1', 'mercedes_read_2', 'mercedes_read_3', 'mercedes_read_4', 'narr_th_merc_5', 'mercedes_read_5', 'mercedes_read_6');
    S.sfx('page', 0.4);
    await S.readInquiry();
    await say('mercedes_san_juan', 'mercedes_san_juan_2', 'narr_th_merc_6', 'alan_th_inquiry', 'mercedes_juan',
      'narr_th_merc_juan', 'mercedes_juan_2', 'mercedes_juan_3', 'narr_th_merc_7', 'mercedes_women', 'alan_th_nadie', 'narr_th_merc_8', 'mercedes_why', 'narr_th_merc_9', 'alan_th_again',
      'narr_th_merc_10', 'mercedes_low', 'narr_th_merc_11', 'parrot_th_laugh');
    f.inquiry_read = true;
  };
  S.talkMercedes = async function () {
    const f = F();
    if (!f.mercedes_met) {
      f.mercedes_met = true;
      await say('narr_th_merc_1', 'narr_th_merc_2', 'alan_th_mercedes_1', 'mercedes_1', 'alan_th_mercedes_2', 'mercedes_2', 'narr_th_merc_2b',
        'mercedes_3', 'alan_th_mercedes_3', 'alan_th_mercedes_4');
      return S.readInquiryAloud();
    }
    await G.dialog([
      { line: 'alan_ask_inquiry', when: () => !f.inquiry_read, run: () => S.readInquiryAloud() },
      { line: 'alan_ask_folio', when: () => f.tellings && !f.folio12, run: () => S.folio12() },
      { line: 'alan_ask_mercedes_witches', once: true, when: () => f.inquiry_read, run: () => say('mercedes_women_2', 'mercedes_women_3') },
      { line: 'alan_ask_mercedes_parrots', once: true, run: () => say('mercedes_parrots', 'parrot_squawk') },
      { line: 'alan_bye_mercedes', bye: true, run: () => say('mercedes_bye') },
    ]);
  };

  // ---------------------------------------------------------------- the restaurant: the tide, Gail and Derek
  // (called from tue.js S.talkGail / S.talkDerek on Thursday; they sit at their table, as every day)
  S.gdThu = async function () {
    const f = F();
    if (f.gd_thu) return say(S.dinnerDue() ? 'gail_th_again' : 'derek_th_again');
    f.gd_thu = true;
    await say('narr_th_gd_1', 'gail_th_1', 'derek_th_tide_1', 'gail_th_tide', 'derek_th_tide_2', 'derek_th_tide_3', 'alan_th_tide',
      'narr_th_gd_2', 'derek_th_tide_4', 'alan_th_gd_dinner', 'gail_th_invite', 'gail_th_invite_2', 'derek_th_doctor', 'alan_th_gd_clever',
      'gail_th_looks', 'derek_th_looks', 'alan_th_shy_gail_th');
  };

  // ---------------------------------------------------------------- the lobby: the plan, the suitcase, the jacket again
  // (called from tue.js hotel_lobby enter() when S.suitcaseDue())
  S.suitcaseThu = async function () {
    const f = F();
    if (f.suitcase_done) return;
    await G.busy(async () => {
      await say('narr_th_plan_1', 'narr_th_plan_4', 'narr_th_plan_5');   // (the plan itself is the player's now: the case page, puzzles.js)
      await say('narr_th_case_1', 'nieves_th_case_1', 'nieves_th_case_2');
      S.sfx('case_open', 0.5); await T(600);
      await say('alan_th_case_1', 'alan_th_case_2', 'nieves_th_case_3', 'narr_th_case_eyebrow', 'nieves_th_case_4');
      await G.fade(true); S.sfx('cloth_jacket', 0.5); await T(700);
      f.suitcase_done = true; f.blazer_on = true;   // (Alan's frames follow the flag: js/story/core.js)
      await G.fade(false);
      await say('narr_th_case_3', 'narr_th_case_4');
    });
  };

  // ---------------------------------------------------------------- the dinner
  const tueEnter = ROOMS.museum_hall.enter;   // (Tuesday's arrival and toast, tue.js: kept, not replaced)
  ROOMS.museum_hall.enter = async function (entry) {
    if (tueEnter) await tueEnter.call(this, entry);
    if (S.dinnerDue() && !F().dinner_intro) {
      F().dinner_intro = true; if (F().blazer_got) F().blazer_on = true; // the blazer again for the dinner
      await say('narr_dinner', 'narr_th_dinner_2', 'vasco_th_hello_1', 'alan_th_hello_1', 'vasco_th_hello_2', 'narr_th_dinner_collar',
        'vasco_th_hello_3', 'alan_th_hello_2', 'vasco_th_hello_4', 'vasco_th_hello_5', 'narr_th_dinner_3', 'narr_th_dinner_4', 'alan_th_dinner_1');
      S.sfx('glass_clink', 0.4);
      await say('baute_th_toast', 'narr_th_talk_1', 'vasco_th_speech_1', 'vasco_th_speech_2', 'vasco_th_speech_3', 'vasco_th_speech_4',
        'narr_th_talk_2', 'narr_th_talk_3', 'narr_th_talk_4', 'alan_th_watch');
    }
  };
  // Derek wants a better angle for the camcorder; he gets one, and walks into the guard's chair on the way
  S.talkDerekDinner = async function () {
    const f = F();
    if (f.derek_sent) return say('derek_th_busy');
    await say('derek_th_1');
    await G.dialog([
      { line: 'alan_derek_rope', run: async () => {
        await say('derek_th_go', 'gail_th_go', 'narr_th_fall_1');
        S.sfx('chair_scrape', 0.7);
        f.derek_sent = true;
        await say('guard_th_wake', 'narr_th_fall_2', 'narr_th_fall_3');
        G.refreshNpcs();
        await say('alan_th_clear');
      }, bye: true },
      { line: 'alan_derek_vasco', run: () => say('derek_th_vasco') },
      { line: 'alan_bye_derek', bye: true, run: () => say('derek_th_bye') },
    ]);
  };

  // ================================================================ BAUTE'S OFFICE
  ROOMS.baute_office = S.room({
    music: 'baute_office',
    name: 'Dr. Baute\'s office', bg: 'baute_office', floor: 'wood', ambience: 'office', door: 'door',
    entries: { default: [200, 660, 'e'], museum_hall: [200, 660, 'e'] },
    hotspots: [
      { name: 'Desk drawer', rect: [520, 440, 220, 80], at: [620, 650], look: () => say(F().desk_open ? 'alan_look_desk_open' : 'alan_look_desk'),
        use: () => F().desk_open ? S.searchDesk() : say('alan_desk_locked'),
        items: { knife: async () => { if (F().desk_open) return S.searchDesk(); S.sfx('drawer_rattle', 0.6); await T(700); F().desk_open = true; G.takeItem('knife'); await say('alan_desk_knife'); await S.searchDesk(); } } },
      { name: 'Sponsor contracts', rect: [860, 440, 120, 60], at: [900, 650], look: 'alan_look_contracts', use: 'alan_look_contracts' },
      { name: 'Window', rect: [860, 120, 260, 280], at: [980, 640], look: 'alan_look_baute_window' },
      { name: 'Shelves', rect: [40, 80, 220, 460], at: [200, 640], look: 'alan_look_baute_shelves' },
      { name: 'Back to the dinner', rect: [20, 250, 110, 320], at: [70, 650], exit: 'museum_hall', entry: 'baute_office', locked: () => F().saw_map, lockedLine: 'alan_th_too_late' },
    ],
    async enter() {
      if (!F().narr_baute_office) { F().narr_baute_office = true; await say('narr_th_office_1', 'narr_th_office_2', 'narr_th_office_3'); }
    },
    // night: the desk lamp, the lamp in the corridor, a moth at the shade, the sea moving faintly beyond the window
    lights: [
      { x: 757, y: 332, rgb: '255,215,140', kind: 'steady', glow: 80, ga: 0.1 },
      { x: 36, y: 264, rgb: '255,200,120', kind: 'flame', seed: 4, glow: 40, ga: 0.16 },
    ],
    animBack(g, t) {
      for (const r of [[1160, 332, 82, 34], [1112, 336, 38, 30]]) {
        g.save(); g.beginPath(); g.rect(...r); g.clip(); g.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 6; i++) {
          const a = 0.1 * Math.max(0, Math.sin(t * (0.5 + i * 0.13) + i * 2.1)), x = r[0] + ((i * 37) % r[2]) + Math.sin(t * 0.3 + i) * 3, y = r[1] + ((i * 13) % r[3]);
          g.strokeStyle = `rgba(150,170,210,${a.toFixed(3)})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8 + i % 3 * 4, y); g.stroke();
        }
        g.restore();
      }
      FX.moth(g, t, 760, 335, 30, 20, 3);
    },
  });
  // the drawer: the Montesdeoca file (twelve pages of nothing), then the photograph and the map, then the light comes on
  S.searchDesk = async function () {
    if (F().caught) return;
    S.sfx('paper_shuffle', 0.5);
    await say('narr_th_file_1', 'narr_th_file_2', 'alan_th_file', 'narr_th_file_3', 'narr_th_photo_1', 'narr_th_photo_2');
    await S.readBauteDesk();
    await say('alan_th_desk_1', 'alan_th_desk_2', 'narr_th_click');
    await S.caught();
  };
  S.caught = async function () {
    const f = F();
    if (f.caught) return;
    f.caught = true;
    await G.busy(async () => {
      S.sfx('lamp_click', 0.6);
      await S.paint('still_caught', async () => {
        await say('narr_th_caught_1', 'narr_th_caught_2', 'narr_th_caught_3', 'narr_th_caught_4', 'narr_th_caught_5', 'narr_th_caught_6',
          'baute_caught_1', 'narr_th_caught_7', 'baute_caught_2', 'baute_caught_3', 'baute_caught_4', 'montesdeoca_caught', 'narr_th_caught_8',
          'narr_caught_vasco', 'narr_th_caught_9', 'narr_th_caught_10');
      }, { zoom: [1.0, 1.08] });
      G.endStill();
      // the mango, the end of the talk, Carmen at the door: told over black
      await G.fade(true);
      await say('narr_th_mango_1', 'narr_th_mango_2', 'narr_th_mango_3', 'narr_th_mango_4', 'narr_th_mango_5');
      await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
      f.blazer_on = false;
      await say('narr_thu_night', 'narr_th_night_2', 'narr_th_night_3');
      await G.fade(false);
      await say('narr_th_night_4', 'alan_th_night_1', 'vasco_th_night_1', 'alan_th_night_2', 'vasco_th_night_2', 'vasco_th_night_3', 'narr_th_night_5');
      S.sfx('water_lap', 0.25);
      await say('narr_th_night_6', 'narr_th_night_7');
      await S.startFri();
    });
  };
})();
