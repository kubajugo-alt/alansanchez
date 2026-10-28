// The Shortest Night — Thursday 20 June: the break-in. Pepe Santana in the paper; Carmen on the Harimaguadas, the
// conquest and the legend of 1483; Casa de Colón and the 1484 inquiry (Mercedes Quintana); Inês and the foundry ledger.
// The fundraising dinner: Derek's camcorder moves the guard, a dinner knife opens Baute's desk, and Alan finds the 1966
// photograph and the circled map, and is caught in front of everyone, Vasco among them.
// Rooms first seen today: Casa de Colón, Baute's office.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;

  S.startThu = async function () {
    await S.morning(3, 'alan_th_wake');
  };
  S.dinnerDue = () => { const f = F(); return ch() === 3 && f.lore_carmen && f.inquiry_read && f.called_thu; };

  // ---------------------------------------------------------------- Carmen, Thursday morning: the history
  S.carmenLore = async function () {
    const f = F();
    if (!f.lore_carmen) {
      S.sfx('match', 0.5);
      await say('carmen_th_1', 'alan_th_carmen_1', 'carmen_th_harimaguadas', 'carmen_th_conquest', 'carmen_th_ansite', 'alan_th_carmen_2', 'carmen_th_legend', 'carmen_th_grandmothers');
      f.lore_carmen = true;
    }
    await G.dialog([
      { line: 'alan_ask_carmen_castilians', once: true, when: () => !f.sent_to_colon, run: async () => { await say('carmen_th_colon'); f.sent_to_colon = true; } },
      { line: 'alan_ask_carmen_magec', once: true, run: () => say('carmen_th_magec') },
      { line: 'alan_ask_carmen_baute', once: true, run: () => say('carmen_th_baute') },
      { line: 'alan_ask_carmen_monte', once: true, run: () => { f.herring_carmen = true; return say('carmen_th_monte'); } },
      { line: 'alan_ask_carmen_elena', once: true, when: () => f.saw_disc_list, run: () => say('carmen_th_elena') },
      { line: 'alan_bye_carmen', bye: true, run: () => say('carmen_bye') },
    ]);
  };

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
      S.toMap([20, 250, 110, 320], [70, 650]),
    ],
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
  S.talkMercedes = async function () {
    const f = F();
    if (!f.mercedes_met) { f.mercedes_met = true; await say('mercedes_1', 'alan_th_mercedes_1', 'mercedes_2'); }
    await G.dialog([
      { line: 'alan_ask_inquiry', when: () => !f.inquiry_read, run: async () => { await say('mercedes_inquiry'); await S.readInquiry(); await say('alan_th_inquiry', 'mercedes_women', 'mercedes_low'); } },
      { line: 'alan_ask_mercedes_juan', once: true, when: () => f.inquiry_read, run: () => say('mercedes_juan') },
      { line: 'alan_ask_mercedes_san_juan', once: true, when: () => f.inquiry_read, run: () => say('mercedes_san_juan') },
      { line: 'alan_bye_mercedes', bye: true, run: () => say('mercedes_bye') },
    ]);
  };

  // ---------------------------------------------------------------- the dinner
  ROOMS.museum_hall.enter = async function () {
    if (S.dinnerDue() && !F().dinner_intro) {
      F().dinner_intro = true; if (F().blazer_got) F().blazer_on = true; // the blazer again for the dinner
      await say('narr_dinner', 'vasco_th_speech_1', 'vasco_th_speech_2', 'baute_th_toast', 'alan_th_dinner_1');
    }
  };
  // Derek wants something exclusive for the camcorder; the guard wakes up for that
  S.talkDerekDinner = async function () {
    const f = F();
    if (f.derek_sent) return say('derek_th_busy');
    await say('derek_th_1');
    await G.dialog([
      { line: 'alan_derek_rope', run: async () => {
        await say('derek_th_go', 'gail_th_go');
        f.derek_sent = true;
        await say('guard_th_wake');
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
  S.searchDesk = async function () {
    if (F().caught) return;
    await S.readBauteDesk();
    await say('alan_th_desk_1', 'alan_th_desk_2');
    await S.caught();
  };
  S.caught = async function () {
    const f = F();
    if (f.caught) return;
    f.caught = true;
    await G.busy(async () => {
      S.sfx('door', 0.6);
      await S.paint('still_caught', async () => {
        await say('baute_caught_1', 'alan_caught_1', 'baute_caught_2', 'montesdeoca_caught', 'baute_caught_3', 'narr_caught_vasco');
      }, { zoom: [1.0, 1.08] });
      G.endStill();
      await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
      await G.fade(false);
      await say('narr_thu_night', 'alan_thu_night');
      await S.startFri();
    });
  };
})();
