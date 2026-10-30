// The Shortest Night — Wednesday 19 June: the island. Doña Pino's helmet from 1478 on La Isleta; Santa Ana, Don
// Fermín, the cathedral clock wound by founder's hands, the 1751 bell with the Sanches mark and the founders' sealed
// letter; the fax to Inês; Carmen's brush-off in the archive, the conservation list (disc 2), Abreu Galindo. That night
// Pepe Santana drowns in his bed.
// Rooms first seen today: La Isleta (Thursday's list, Saturday's flood), Santa Ana and the bell chamber, the museum
// archive (Carmen's, almost daily).
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;

  // ---------------------------------------------------------------- small moving details (drawn over the paintings, as Game I's)
  // The sky of a painting, found once: a flood from the seed points through pale, unsaturated pixels that change
  // smoothly (a roof, a tower or a gull stops it). Returned as a soft white mask for FX.masked.
  const skies = {};
  const skyMask = function (key, seeds, ymax, tol) {
    if (skies[key]) return skies[key];
    const im = G.bgImage(); if (!im || !im.width) return null;
    const W = 1280, H = 720, c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H), p = d.data, m = new Uint8Array(W * H), q = new Int32Array(W * H);
    const ok = i => { const mx = Math.max(p[i * 4], p[i * 4 + 1], p[i * 4 + 2]), mn = Math.min(p[i * 4], p[i * 4 + 1], p[i * 4 + 2]); return mx > 70 && (mx - mn) / (mx + 1) < 0.2; };
    const near = (i, j) => Math.abs(p[i * 4] - p[j * 4]) + Math.abs(p[i * 4 + 1] - p[j * 4 + 1]) + Math.abs(p[i * 4 + 2] - p[j * 4 + 2]) < (tol || 14);
    let h = 0, n = 0;
    for (const [sx, sy] of seeds) { const i = sy * W + sx; if (!m[i] && ok(i)) { m[i] = 1; q[n++] = i; } }
    while (h < n) {
      const i = q[h++], y = (i / W) | 0, xx = i - y * W;
      const nb = [xx > 0 ? i - 1 : -1, xx < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < ymax - 1 ? i + W : -1];
      for (const j of nb) if (j >= 0 && !m[j] && ok(j) && near(i, j)) { m[j] = 1; q[n++] = j; }
    }
    for (let i = 0; i < W * H; i++) { p[i * 4] = p[i * 4 + 1] = p[i * 4 + 2] = 255; p[i * 4 + 3] = m[i] ? 255 : 0; }
    x.putImageData(d, 0, 0);
    const s = document.createElement('canvas'); s.width = W; s.height = H;
    const sg = s.getContext('2d'); sg.filter = 'blur(1.5px)'; sg.drawImage(c, 0, 0); // no hard outline round the roofs
    return (skies[key] = s);
  };
  const TOP = Array.from({ length: 64 }, (_, i) => [i * 20 + 5, 2]);
  // the panza de burro moving: a dark bank under a paler one, drifting at two speeds, only where the sky is painted
  let clDark = null, clPale = null;
  const panza = function (g, t, mask, a, y) {
    if (!mask) return;
    clDark = clDark || FX.makeClouds(83, '92,94,100', 20); clPale = clPale || FX.makeClouds(61, '216,216,220', 22);
    FX.masked(g, mask, m => { FX.drawClouds(m, clDark, t, 3, (y || 0) - 30, a); FX.drawClouds(m, clPale, t, 6, (y || 0) + 20, a * 0.8); });
  };
  // a few slow glints on water inside a rect (FX.water is too busy for a small patch)
  const glints = function (g, t, rect, n, rgb, a) {
    const [x, y, w, h] = rect;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const s = Math.sin(i * 91.7) * 43758.5, f = s - Math.floor(s), f2 = (s * 7.3) - Math.floor(s * 7.3);
      const al = a * Math.max(0, Math.sin(t * (0.6 + f) + i * 2.4));
      if (al < 0.01) continue;
      const bx = x + f * w + Math.sin(t * 0.4 + i) * 4, by = y + f2 * h, len = 4 + f2 * 14;
      g.strokeStyle = `rgba(${rgb},${al.toFixed(3)})`; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + len, by); g.stroke();
    }
    g.restore();
  };

  // every morning starts in the hotel room
  S.morning = async function (n, line) {
    await G.fade(true);
    await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
    await S.day(n);
    await G.fade(false);
    if (line) await say(line);
  };
  S.startWed = async function () {
    await S.morning(2, 'alan_w_wake');
  };

  // ================================================================ LA ISLETA
  ROOMS.isleta = S.room({
    music: 'isleta',
    name: 'La Isleta', bg: 'isleta', floor: 'stone', ambience: 'harbour',
    entries: { default: [200, 660, 'e'], map: [200, 660, 'e'] },
    npcs: [
      { id: 'pino', ch: 'pino', x: 760, y: 650, dir: 'w', name: 'Doña Pino', when: () => ch() >= 2 && ch() <= 5, look: 'alan_look_pino', talk: () => S.talkPino() },
      { id: 'lolo', ch: 'lolo', x: 960, y: 670, dir: 'w', name: 'Don Lolo', when: () => ch() >= 2 && ch() <= 5, look: 'alan_look_lolo', talk: () => S.talkLolo() },
    ],
    hotspots: [
      { name: 'Nets', rect: [690, 520, 340, 50], at: [860, 640], look: () => say(ch() === 2 ? 'alan_look_nets_wed' : 'alan_look_nets') },
      { name: 'Fishing boats', rect: [120, 440, 960, 90], at: [600, 620], look: 'alan_look_boats' },
      { name: 'The things in the nets', rect: [580, 520, 100, 50], at: [640, 640], when: () => ch() >= 2 && ch() <= 4, look: () => say('alan_look_finds_' + Math.min(4, ch())) },
      S.toMap([20, 250, 110, 320], [70, 650]),
    ],
    async enter() { if (ch() === 5 && !F().isleta_flood) return S.floodScene(); },
    lights: [{ x: 95, y: 180, rgb: '255,214,150', kind: 'gas', seed: 2, glow: 34, ga: 0.22 }], // the lit lamp on the left quay
    animBack(g, t) {
      const im = G.bgImage();
      panza(g, t, skyMask('isleta', TOP, 300), 0.5);
      FX.sway(g, im, [288, 215, 60, 46], t * 0.8, 1.1, 0, true); // the palm over the far quay
      // the harbour: the boats' reflections wavering (the hulls themselves stay put), a few glints
      if (!S.sea(g, 'isleta')) {   // (the Higgsfield loop, js/story/sea.js; the canvas ripple until it can play)
        FX.ripple(g, im, [375, 388, 430, 34], t, 1.1, 0.22); FX.ripple(g, im, [285, 422, 530, 44], t * 0.9, 1.3, 0.2);
        glints(g, t, [290, 392, 510, 72], 14, '200,205,210', 0.16);
      }
      FX.birds(g, t, { y0: 60, y1: 180, n: 2, period: 19, color: 'rgba(238,238,234,0.8)', size: 8 }); // gulls
    },
    animFg(g, t) { S.drawMist(g, t, ch() >= 4 && ch() <= 5 ? 0.3 : 0); },
  });
  S.talkPino = async function () {
    const f = F();
    if (ch() === 2) {
      if (!f.saw_helmet) { f.saw_helmet = true; await say('pino_w_1', 'alan_w_pino_1', 'pino_w_2', 'alan_w_pino_2', 'pino_w_3'); return S.checkWed(); }
      return say('pino_w_again');
    }
    if (ch() === 3) {
      await G.dialog([
        { line: 'alan_ask_pino_pepe', once: true, when: () => f.pepe_known || f.paper_day === 3, run: async () => { await say('pino_th_pepe_1', 'pino_th_pepe_2'); await S.readPinoList(); await say('pino_th_debts', 'alan_th_debts'); } },
        { line: 'alan_ask_pino_sea', once: true, run: () => say('pino_th_sea') },
        { line: 'alan_bye_pino', bye: true, run: () => say('pino_bye') },
      ]);
      return;
    }
    if (ch() === 5) return say('pino_s_name');
    return say('pino_f_1');
  };
  S.talkLolo = () => ch() === 5 ? say('lolo_s_2') : ch() === 4 ? say('lolo_f_1', 'alan_f_lolo', 'lolo_f_2') : say(F().lolo_met ? 'lolo_again' : (F().lolo_met = true, 'lolo_w_1'));

  // ================================================================ SANTA ANA
  ROOMS.santa_ana = S.room({
    music: 'santa_ana',
    name: 'Plaza de Santa Ana', bg: 'santa_ana', floor: 'stone', ambience: 'street',
    entries: { default: [200, 660, 'e'], map: [200, 660, 'e'], santa_ana_inside: [640, 650, 's'] },
    hotspots: [
      { name: 'Cathedral clock', rect: [560, 110, 160, 120], at: [640, 640], look: () => say(F().clock_wound ? 'alan_look_clock_going' : 'alan_look_clock_stopped') },
      { name: 'Bronze dogs', rect: [170, 460, 110, 90], at: [230, 640], look: 'alan_look_dogs' },
      { name: 'Timple players', rect: [1040, 440, 200, 120], at: [1060, 650], look: () => say(ch() >= 4 ? 'alan_look_timple_mist' : 'alan_look_timple') },
      { name: 'Cathedral door', rect: [580, 380, 120, 180], at: [640, 640], look: 'alan_look_cathedral_door', exit: 'santa_ana_inside', entry: 'santa_ana' },
      S.toMap([20, 250, 110, 320], [70, 650]),
    ],
    // the cloud moving behind the towers, the two palms' crowns stirring, pigeons now and then. The painted
    // clocks are left alone (stopped until Alan winds the cathedral's; their hands are painted).
    animBack(g, t) {
      const im = G.bgImage();
      panza(g, t, skyMask('santa_ana', TOP, 360), 0.5);
      FX.sway(g, im, [880, 0, 370, 110], t * 0.7, 1.3, 0, true); FX.sway(g, im, [860, 130, 180, 120], t * 0.7, 1.1, 1.3, true);
      FX.sway(g, im, [0, 0, 240, 150], t * 0.7, 1.2, 2.1, true);
      FX.birds(g, t, { y0: 40, y1: 170, n: 3, period: 23, color: 'rgba(44,44,50,0.6)', size: 6 });
    },
  });
  // ================================================================ SANTA ANA: inside (Don Fermín; the stair to the bells)
  ROOMS.santa_ana_inside = S.room({
    music: 'santa_ana_inside',
    name: 'Santa Ana · the nave', bg: 'santa_ana_inside', floor: 'stone', ambience: 'tower', door: 'door',
    entries: { default: [120, 665, 'e'], santa_ana: [120, 665, 'e'], belfry: [1060, 660, 'w'] },
    npcs: [
      { id: 'fermin', ch: 'fermin', x: 760, y: 645, dir: 'w', name: 'Don Fermín', when: () => ch() >= 2 && ch() <= 4, look: 'alan_look_fermin', talk: () => S.talkFermin() },
    ],
    hotspots: [
      { name: 'Columns', rect: [565, 0, 80, 520], at: [620, 650], look: 'alan_look_columns' },
      { name: 'Altarpiece', rect: [275, 235, 120, 180], at: [360, 640], look: 'alan_look_altarpiece' },
      { name: 'Door to the tower', rect: [1000, 190, 255, 355], at: [1060, 660], look: 'alan_look_tower_door', exit: 'belfry', entry: 'santa_ana_inside',
        locked: () => !F().clock_key, lockedLine: 'alan_cathedral_locked' },
      { name: 'Out to the plaza', rect: [0, 250, 60, 350], at: [60, 665], exit: 'santa_ana', entry: 'santa_ana_inside' },
    ],
    async enter() { if (!F().narr_santa_ana_in) { F().narr_santa_ana_in = true; await say('narr_santa_ana_in_1'); } },
    // the altar candles alive (the left chapel's and the side altar's), a little light down from the high window, dust in it
    lights: [
      { x: 340, y: 330, rgb: '255,190,110', kind: 'candle', seed: 4, glow: 110, ga: 0.07 },
      { x: 80, y: 368, rgb: '255,190,110', kind: 'candle', seed: 1, glow: 60, ga: 0.12 },
      { x: 750, y: 376, rgb: '255,190,110', kind: 'candle', seed: 3, glow: 60, ga: 0.12 },
    ],
    animBack(g, t) {
      [[51, 362, 8], [37, 366, 6], [110, 374, 6], [120, 381, 6], [724, 379, 7], [731, 381, 7], [765, 377, 7], [771, 378, 7], [776, 383, 6]]
        .forEach(([x, y, h], i) => FX.flame(g, t, x, y, h, i * 1.9, '255,175,90'));
      FX.shaft(g, [[66, 60], [96, 52], [360, 470], [250, 500]], '255,226,180', 0.05, 0.25);
      FX.motes(g, t, 120, 160, 200, 300, 14, '255,226,180');
    },
  });
  S.talkFermin = async function () {
    const f = F();
    if (!f.fermin_met) { f.fermin_met = true; await say('fermin_w_1', 'alan_w_fermin_1', 'fermin_w_2'); }
    await G.dialog([
      { line: 'alan_ask_fermin_clock', once: true, when: () => !f.clock_wound, run: () => say('fermin_clock_1', 'fermin_clock_2') },
      { line: 'alan_offer_wind', when: () => !f.clock_key && !f.clock_wound, run: () => S.pickKey(), bye: true },
      { line: 'alan_ask_fermin_bells', once: true, run: () => say('fermin_bells') },
      { line: 'alan_ask_fermin_founders', once: true, when: () => f.fermin_letter, run: () => say('fermin_founders') },
      { line: 'alan_bye_fermin', bye: true, run: () => say('fermin_bye') },
    ]);
  };
  // the ring of keys: the clock's is the one with a bell on its bow ("everything here has a bell on it")
  S.pickKey = async function () {
    const f = F();
    await say('fermin_ring');
    await G.dialog([
      { label: 'The big iron one, like a church door', run: () => say('fermin_key_wrong_1'), bye: true },
      { label: 'The little brass one with a bell on its bow', run: async () => { f.clock_key = true; S.sfx('keys_ring', 0.6); await say('fermin_key_right'); }, bye: true },
      { label: 'The one on its own, on a red ribbon', run: () => say('fermin_key_wrong_2'), bye: true },
    ]);
  };

  // ================================================================ SANTA ANA: the bell chamber
  ROOMS.belfry = S.room({
    music: 'belfry',
    name: 'Santa Ana · the bell chamber', bg: 'belfry', floor: 'wood', ambience: 'tower',
    entries: { default: [400, 660, 'e'], santa_ana_inside: [400, 660, 'e'] },
    npcs: [
      { id: 'fermin', ch: 'fermin', x: 940, y: 650, dir: 'w', name: 'Don Fermín', look: 'alan_look_fermin', talk: () => S.talkFerminBelfry() },
    ],
    hotspots: [
      { name: 'Clock winding drum', rect: [100, 220, 180, 180], at: [200, 640], look: () => say(F().clock_wound ? 'alan_look_drum_wound' : 'alan_look_drum'),
        use: () => S.windClock() },
      { name: 'The north bell', rect: [490, 120, 300, 300], at: [640, 640], look: () => S.lookBell(),
        items: { notebook: () => S.rubBell(), any: 'alan_bell_item' }, use: () => say('alan_use_bell') },
      { name: 'Bell window', rect: [1000, 180, 160, 220], at: [1040, 640], look: 'alan_look_bell_window' },
      { name: 'Stairs down', rect: [20, 250, 110, 320], at: [70, 650], exit: 'santa_ana_inside', entry: 'belfry' },
    ],
    // only the window lives: the cloud over the city, the palm, the sea, a gull; dust in the light, and the ropes
    // stirring in the draught. The bell hangs still (nobody rings it) and the clock's drum turns only when wound.
    animBack(g, t) {
      const im = G.bgImage();
      panza(g, t, skyMask('belfry', [[1048, 250], [1043, 105], [1000, 300], [1100, 300]], 336), 0.55, 120);
      FX.sway(g, im, [1040, 356, 48, 36], t * 0.8, 0.8, 0, true);
      glints(g, t, [978, 338, 144, 22], 8, '210,215,220', 0.14);
      g.save(); g.beginPath(); g.rect(974, 150, 150, 186); g.clip();
      FX.birds(g, t, { y0: 190, y1: 300, n: 1, period: 17, color: 'rgba(235,235,232,0.75)', size: 3.5, x0: 960, x1: 1140 });
      g.restore();
      FX.sway(g, im, [606, 445, 50, 160], t * 0.45, 1.2, 0); // the clapper's rope, free at the floor
      FX.billow(g, im, [372, 70, 22, 390], t, 0.8, 7); // the rope down from the ceiling, held at both ends
      FX.motes(g, t, 860, 200, 280, 330, 16, '240,230,210');
    },
  });
  S.windClock = async function () {
    const f = F();
    if (f.clock_wound) return say('alan_drum_again');
    await S.posed('pull', async () => { for (let i = 0; i < 3; i++) { S.sfx('clock_wind', 0.6); await T(700); } });
    f.clock_wound = true;
    S.sfx('clock_chime', 0.5);
    await say('fermin_founder_hands', 'alan_w_hands', 'fermin_bell_show');
  };
  S.lookBell = async function () {
    const f = F();
    if (!f.clock_wound) return say('alan_look_bell_dark');
    f.saw_mark = true;
    await say('alan_look_bell_mark');
  };
  S.rubBell = async function () {
    const f = F();
    if (!f.clock_wound) return say('alan_look_bell_dark');
    if (G.has('inscription') || f.faxed_inscription) return say('alan_rub_again');
    await S.posed('write', async () => { S.sfx('pencil_scribble', 0.6); await T(1400); });
    S.give('inscription'); f.saw_mark = true;
    await say('alan_rub_bell');
  };
  S.talkFerminBelfry = async function () {
    const f = F();
    if (!f.clock_wound) return say('fermin_belfry_wind');
    if (!f.saw_mark) return say('fermin_belfry_look');
    if (!f.fermin_letter) {
      await say('fermin_name', 'alan_w_name', 'fermin_letter_1', 'fermin_letter_2');
      f.fermin_letter = true; S.give('letter');
      await say('alan_w_letter');
      return S.checkWed();
    }
    return say('fermin_belfry_again');
  };

  // ================================================================ EL MUSEO CANARIO: the archive
  ROOMS.archive = S.room({
    music: 'archive',
    name: 'El Museo Canario · the archive', bg: 'archive', floor: 'wood', ambience: 'office',
    entries: { default: [200, 660, 'e'], museum_hall: [200, 660, 'e'] },
    npcs: [
      { id: 'carmen', ch: 'carmen', x: 700, y: 640, dir: 'w', name: 'Dr. Carmen Trujillo', when: () => ch() >= 2 && ch() <= 4, look: 'alan_look_carmen', talk: () => S.talkCarmen(),
        items: { inscription: () => say('carmen_inscription'), letter: () => say('carmen_letter'), any: 'alan_fail_carmen_item' } },
    ],
    hotspots: [
      { name: 'Conservation list', rect: [880, 300, 120, 160], at: [930, 640], look: async () => { await S.readDiscList(); await S.checkWed(); } },
      { name: 'Ashtray', rect: [560, 470, 70, 40], at: [600, 650], look: () => say('alan_look_ashtray_' + Math.min(4, Math.max(2, ch()))) },
      { name: 'Photographs of Cave 6', rect: [300, 300, 200, 140], at: [400, 640], when: () => ch() >= 3, look: () => say(F().cave_explained ? 'alan_look_cave_photos_2' : 'alan_look_cave_photos') },
      { name: 'Stacks', rect: [40, 80, 220, 460], at: [200, 640], look: 'alan_look_stacks' },
      { name: 'Stairs up to the hall', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'museum_hall', entry: 'archive' },
    ],
    // the hanging lantern and the stair lamp burning, daylight from the little window with dust in it, a moth
    lights: [
      { x: 617, y: 148, rgb: '255,200,120', kind: 'flame', seed: 2, glow: 70, ga: 0.16 },
      { x: 1190, y: 172, rgb: '255,200,120', kind: 'flame', seed: 5, glow: 46, ga: 0.14 },
      { x: 455, y: 360, rgb: '150,255,150', kind: 'gas', seed: 1, glow: 34, ga: 0.1 },
    ],
    animBack(g, t) {
      FX.shaft(g, [[812, 168], [925, 168], [1010, 560], [770, 560]], '235,235,220', 0.045);
      FX.motes(g, t, 790, 180, 200, 360, 12, '235,230,210');
      FX.moth(g, t, 618, 150, 34, 22, 1);
    },
  });
  S.talkCarmen = async function () {
    const f = F();
    if (ch() === 2) {
      if (!f.carmen_wed) {
        f.carmen_wed = true; S.sfx('match', 0.5);
        await say('carmen_w_1', 'alan_w_carmen_1', 'carmen_w_2', 'alan_w_carmen_2', 'carmen_w_3');
        S.give('galindo'); await say('carmen_w_galindo');
        return S.checkWed();
      }
      return say('carmen_w_again');
    }
    if (ch() === 3) return S.carmenLore();
    if (ch() === 4) return S.carmenCave();
  };

  // ---------------------------------------------------------------- the end of Wednesday
  S.wedDone = () => { const f = F(); return f.saw_helmet && f.fermin_letter && f.faxed_inscription && f.faxed_letter && f.saw_disc_list && f.carmen_wed; };
  S.checkWed = async function () {
    const f = F();
    if (ch() !== 2 || f.wed_done || !S.wedDone()) return;
    f.wed_done = true;
    await G.busy(async () => {
      await say('alan_w_done');
      await S.paint('still_pepe', async () => { S.sfx('water_drain', 0.4); await say('narr_pepe_1', 'narr_pepe_2'); }, { zoom: [1.0, 1.1] });
      G.endStill();
      await S.startThu();
    });
  };
})();
