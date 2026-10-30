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
  // lines heard in the dark (no one on screen to speak them): the caption box, with the speaker's name
  const off = async (...ids) => { for (const id of ids) await G.say(id, { offscreen: true }); };
  // Wednesday opens the novel's way (Chapter Two): Vasco leaving at dawn, in the grey light, and the thing Alan doesn't say
  S.startWed = async function () {
    await G.fade(true);
    await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
    await S.day(2);
    await off('narr_w_dawn_1');
    S.sfx('floor_creak', 0.4);
    await off('narr_w_dawn_2', 'narr_w_dawn_3', 'vasco_w_dawn_1', 'alan_w_dawn_1', 'vasco_w_dawn_2', 'alan_w_dawn_1', 'vasco_w_dawn_3', 'narr_w_dawn_4', 'alan_w_dawn_3', 'narr_w_dawn_5');
    S.sfx('door', 0.4);
    await off('narr_w_dawn_6');
    await G.fade(false);
    await say('narr_w_dawn_7', 'alan_w_wake');
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
    async enter() {
      if (ch() === 5 && !F().isleta_flood) return S.floodScene();
      if (ch() === 2 && !F().narr_isleta) { F().narr_isleta = true; await say('narr_w_isleta_1', 'narr_w_isleta_2', 'narr_w_isleta_3'); }
    },
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
      // the novel's quay: the net giving up the conquest, "the sea's emptying its pockets", the sea's memory; and, across
      // the harbour, a salvage boat nobody notices (Pell's one trace, the bible's series layer)
      if (!f.saw_helmet) {
        await say('narr_w_pino_1', 'narr_w_pino_2', 'alan_w_pino_1', 'narr_w_pino_3', 'pino_w_2', 'pino_w_2b');
        S.sfx('splash', 0.25);
        await say('narr_w_pino_4', 'pino_w_2c', 'alan_w_pino_2', 'narr_w_pino_5', 'pino_w_3', 'pino_w_1', 'lolo_w_talk', 'pino_w_tourists',
          'alan_w_pino_3', 'narr_w_pino_6', 'pino_w_worse', 'pino_w_pretty', 'alan_w_pino_shy', 'narr_w_pino_7', 'pino_w_memory_1', 'pino_w_memory_2',
          'narr_w_pino_8', 'pino_w_restless', 'alan_w_pino_4');
        S.sfx('ship_bell', 0.15);
        await say('narr_w_pell_1', 'narr_w_pell_2');
        f.saw_helmet = true;
        await S.checkWed();
      }
      await G.dialog([
        { line: 'alan_ask_pino_sword', once: true, run: () => say('pino_w_sword') },
        { line: 'alan_ask_pino_lolo', once: true, run: () => { f.lolo_met = true; return say('pino_w_lolo', 'lolo_w_1'); } },
        { line: 'alan_bye_pino', bye: true, run: () => say('pino_w_again') },
      ]);
      return;
    }
    if (ch() === 3) {
      await G.dialog([
        { line: 'alan_ask_pino_pepe', once: true, when: () => f.pepe_known || f.paper_day === 3, run: async () => {
          if (S.pinoMissal) return S.pinoMissal();   // (Thursday's scene, thu.js; the old short one if it isn't there)
          await say('pino_th_pepe_1', 'pino_th_pepe_2'); await S.readPinoList(); await say('pino_th_debts', 'alan_th_debts'); } },
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
    // first time: the decision made on the walk ("the kind of decision that felt brave at the time") and the plaza; with
    // the founders' letter, back down from the tower: he opens it on the fountain's edge, between two of the dogs
    async enter() {
      const f = F();
      if (ch() === 2 && !f.narr_santa_ana) { f.narr_santa_ana = true; await say('narr_w_decide_1', 'narr_w_decide_2', 'narr_w_decide_3', 'narr_w_decide_4', 'narr_w_plaza_1', 'narr_w_plaza_2'); }
      if (ch() === 2 && f.fermin_letter && !f.letter_opened) {
        f.letter_opened = true;
        S.sfx('paper_shuffle', 0.4);
        await say('narr_w_open_1', 'narr_w_open_2', 'alan_w_open_1', 'narr_w_open_3', 'alan_w_letter');
      }
    },
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
    async enter() {
      if (F().narr_santa_ana_in) return;
      F().narr_santa_ana_in = true;
      await say('narr_santa_ana_in_1');
      if (!F().clock_wound) { S.sfx('clock_wind', 0.25); await say('narr_w_nave_2', 'narr_w_nave_3'); }
    },
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
    // the novel's first meeting: the clock stuck since Sunday, the gallbladder, Fuerteventura, the broken accordion
    if (!f.fermin_met) { f.fermin_met = true; await say('alan_w_fermin_1', 'narr_w_fermin_2', 'fermin_w_1', 'fermin_w_2', 'fermin_w_3'); }
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
    // "I know bells." (he hears himself say it); then the ring of forty keys, held out
    if (!f.fermin_offer) { f.fermin_offer = true; await say('fermin_w_clocks', 'alan_w_bells', 'narr_w_fermin_3', 'narr_w_fermin_4'); S.sfx('keys_ring', 0.4); }
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
    // first time: a hundred and twelve steps, Don Fermín dying on every landing; the room, the clock and the bells
    async enter() {
      if (F().narr_belfry) return;
      F().narr_belfry = true;
      await say('narr_w_belfry_1', 'fermin_w_landing', 'narr_w_belfry_2', 'narr_w_belfry_3');
    },
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
    // the novel: twenty minutes, a slipped tooth in the escapement, the skin of his left hand; then "Founder's hands" and the
    // name, and the old man very still
    await say('narr_w_clock_1', 'narr_w_clock_2');
    f.clock_wound = true;
    S.sfx('grandfather_tick', 0.4); await T(600);
    S.sfx('clock_chime', 0.5);
    await say('alan_w_clock', 'narr_w_clock_3', 'fermin_founder_hands', 'alan_w_hands', 'fermin_name', 'fermin_w_yourname', 'alan_w_name', 'narr_w_still', 'fermin_bell_show');
  };
  S.lookBell = async function () {
    const f = F();
    if (!f.clock_wound) return say('alan_look_bell_dark');
    if (f.saw_mark) return say('alan_look_bell_mark_2');
    f.saw_mark = true;
    await say('narr_w_bell_1', 'alan_look_bell_mark', 'narr_w_bell_2');
    S.sfx('bell_hum_soft', 0.4);
    await say('narr_w_bell_3');
  };
  S.rubBell = async function () {
    const f = F();
    if (!f.clock_wound) return say('alan_look_bell_dark');
    if (G.has('inscription') || f.faxed_inscription) return say('alan_rub_again');
    if (!f.saw_mark) await S.lookBell();   // (the mark found first, the novel's moment, even if he goes straight for the pencil)
    await S.posed('write', async () => { S.sfx('pencil_scribble', 0.6); await T(1400); });
    S.give('inscription'); f.saw_mark = true;
    await say('alan_rub_bell');
  };
  S.talkFerminBelfry = async function () {
    const f = F();
    if (!f.clock_wound) return say('fermin_belfry_wind');
    if (!f.saw_mark) return say('fermin_belfry_look');
    if (!f.fermin_letter) {
      // the founders from Lisbon who "came to look at the mountain, not the sea"; the chest; the oilcloth packet under black wax
      await say('fermin_founders_1', 'fermin_founders_2', 'fermin_founders_3', 'fermin_founders_4', 'alan_w_founders_q');
      S.sfx('drawer_open', 0.4);
      await say('narr_w_chest', 'narr_w_chest_2', 'fermin_letter_1', 'fermin_letter_2');
      f.fermin_letter = true; S.give('letter');
      await say('narr_w_letter_take', 'alan_w_fermin_thanks', 'fermin_belfry_again');
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
        items: { inscription: () => say('carmen_inscription'), letter: () => say('carmen_letter'), cigarettes: () => S.talkCarmen(), any: 'alan_fail_carmen_item' } },
    ],
    hotspots: [
      { name: 'Conservation list', rect: [880, 300, 120, 160], at: [930, 640], look: async () => { await S.readDiscList(); await S.checkWed(); } },
      { name: 'Ashtray', rect: [560, 470, 70, 40], at: [600, 650], look: () => say('alan_look_ashtray_' + Math.min(4, Math.max(2, ch()))) },
      { name: 'Photographs of Cave 6', rect: [300, 300, 200, 140], at: [400, 640], when: () => ch() >= 3, look: () => say(F().cave_explained ? 'alan_look_cave_photos_2' : 'alan_look_cave_photos') },
      { name: 'Stacks', rect: [40, 80, 220, 460], at: [200, 640], look: 'alan_look_stacks' },
      { name: 'Stairs up to the hall', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'museum_hall', entry: 'archive' },
    ],
    // first time: the basement, PROHIBIDO FUMAR, and Carmen smoking under it
    async enter() {
      if (F().narr_archive || ch() < 2 || ch() > 4) return;
      F().narr_archive = true;
      await say('narr_w_arch_1', 'narr_w_arch_2');
    },
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
  // the toll (the user, 2026-10-30): no talk in the archive without a packet of cigarettes from Chano's kiosk, once a day
  S.carmenToll = async function () {
    const f = F();
    if (f.carmen_cigs_day === ch()) return true;
    if (!G.has('cigarettes')) {
      if (f.carmen_cigs_asked === ch()) await say('carmen_cigs_none_2');
      else { f.carmen_cigs_asked = ch(); await say('carmen_cigs_none', 'alan_cigs_none'); }
      return false;
    }
    G.takeItem('cigarettes'); f.carmen_cigs_day = ch(); S.sfx('match', 0.5);
    await say('alan_cigs_give', 'carmen_cigs_thanks_' + ch());
    return true;
  };
  S.talkCarmen = async function () {
    const f = F();
    if (!await S.carmenToll()) return;
    if (ch() === 2) {
      if (!f.carmen_wed) return S.carmenWed();
      return say('carmen_w_again');
    }
    if (ch() === 3) return S.carmenLore();
    if (ch() === 4) return S.carmenCave();
  };
  // Wednesday in the archive, the novel's scene: "No." / "I haven't asked anything." / "You were going to."; the discs;
  // the mist and the helmet (her pen stops); June, the panza, every June a theory; her back turned, the photograph face
  // down; Abreu Galindo held out behind her. Then, when he has gone, Carmen alone: the photograph righted, the message
  // she has never erased, the lighter's three tries. Alan comes back to the hall.
  S.carmenWed = async function () {
    const f = F();
    await G.busy(async () => {
      await say('narr_w_carmen_1', 'carmen_w_1', 'alan_w_carmen_0', 'carmen_w_no2', 'alan_w_carmen_discs', 'carmen_w_cons', 'alan_w_carmen_cons', 'carmen_w_cons2',
        'narr_w_carmen_2', 'alan_w_carmen_name', 'narr_w_carmen_3', 'alan_w_carmen_1', 'alan_w_carmen_2', 'narr_w_carmen_4');
      if (f.saw_helmet) await say('alan_w_carmen_helmet');
      await say('alan_w_carmen_cave', 'narr_w_carmen_5', 'carmen_w_2', 'carmen_w_june2');
      S.sfx('glass_set', 0.3);
      await say('narr_w_carmen_6', 'carmen_w_3');
      S.sfx('filing_cabinet', 0.35);
      await say('narr_w_carmen_7', 'narr_w_carmen_8', 'alan_w_carmen_thanks', 'carmen_w_senor');
      S.sfx('book_take', 0.5);
      await say('narr_w_carmen_9');
      f.carmen_wed = true; S.give('galindo');
      await say('carmen_w_galindo', 'carmen_w_galindo2');
      // Carmen alone (the cutaway: Alan has gone up the stairs)
      await G.fade(true);
      await G.goRoom('museum_hall', 'archive', { instant: true, noEnter: true, noSave: true });
      await off('narr_w_carmen_10', 'narr_w_carmen_11', 'narr_w_carmen_12');
      for (let i = 0; i < 3; i++) { S.sfx('match', 0.45); await T(450); }
      await off('narr_w_carmen_13');
      await G.fade(false);
      await S.checkWed();
    });
  };

  // ---------------------------------------------------------------- the museum on Wednesday: the van and the list
  // (the hall is tue.js's; its enter is chained here, not replaced, and thu.js chains this one in turn)
  const hallEnter = ROOMS.museum_hall.enter;
  ROOMS.museum_hall.enter = async function (entry) {
    if (hallEnter) await hallEnter.call(this, entry);
    const f = F();
    if (ch() !== 2 || f.narr_museum_wed) return;
    f.narr_museum_wed = true;
    S.sfx('chair_scrape', 0.3);
    await say('narr_w_van_1', 'narr_w_van_2', 'narr_w_van_3', 'alan_w_crate_1', 'alan_w_crate_2', 'narr_w_van_4', 'narr_w_van_5', 'alan_w_crate_3', 'narr_w_van_6');
    f.saw_disc_list = true; f.herring_van = true;
    await S.checkWed();
  };

  // ---------------------------------------------------------------- Chano's theory (after the archive)
  // The novel: "Chano was waiting for him at the kiosk with a newspaper and a theory." Montesdeoca's hotel in Artenara,
  // the neat explanation a frightened man would like to be true. On the way into Las Canteras, or at the kiosk.
  S.chanoTheory = async function () {
    const f = F();
    f.chano_theory = true; f.herring_chano = true;
    await say('narr_w_chano_1', 'chano_w_th_1', 'alan_w_chano_1', 'chano_w_th_2', 'chano_w_th_3', 'chano_w_th_4');
    S.sfx('coins_clink', 0.3);
    await say('narr_w_chano_2', 'narr_w_chano_3', 'narr_w_chano_4');
  };
  const theoryDue = () => ch() === 2 && F().carmen_wed && !F().chano_theory;
  const canterasEnter = ROOMS.canteras.enter;
  ROOMS.canteras.enter = async function (entry) {
    if (canterasEnter) await canterasEnter.call(this, entry);
    if (theoryDue()) await S.chanoTheory();
  };
  const talkChano = S.talkChano;
  S.talkChano = async function () {
    if (theoryDue() && !G.has('note5000')) await S.chanoTheory();
    return talkChano.apply(this, arguments);
  };

  // ---------------------------------------------------------------- the end of Wednesday
  // Everything found: Alan decides (again) to tell Vasco tonight, and goes back to the hotel. Room 404 closes the day: Vasco
  // home after ten, asleep before Alan can say it ("the kind of decision that felt kind at the time"); then Pepe Santana.
  S.wedDone = () => { const f = F(); return f.saw_helmet && f.fermin_letter && f.faxed_inscription && f.faxed_letter && f.saw_disc_list && f.carmen_wed; };
  S.checkWed = async function () {
    const f = F();
    if (ch() !== 2 || f.wed_ready || !S.wedDone()) return;
    f.wed_ready = true;
    await say('alan_w_done', 'alan_w_done_2');
  };
  const roomEnter = ROOMS.hotel_room.enter;
  ROOMS.hotel_room.enter = async function (entry) {
    if (ch() === 2 && F().wed_ready && !F().wed_done) return S.endWed();
    if (roomEnter) return roomEnter.call(this, entry);
  };
  S.endWed = async function () {
    const f = F();
    if (f.wed_done) return;
    f.wed_done = true;
    await G.busy(async () => {
      await G.fade(true);
      await off('narr_w_night_1', 'narr_w_night_2');
      S.sfx('bed_springs', 0.4);
      await off('vasco_w_night_1', 'narr_w_night_3', 'vasco_w_night_2', 'vasco_w_night_3', 'vasco_w_night_4', 'narr_w_night_4', 'alan_w_night_1', 'narr_w_night_5', 'narr_w_night_6', 'narr_w_night_7');
      S.sfx('lamp_click', 0.4);
      await off('narr_w_night_8', 'narr_w_night_9');
      // Pepe Santana (the novel's cutaway, ending on his last words)
      await S.paint('still_pepe', async () => {
        await say('narr_pepe_1', 'narr_pepe_3', 'narr_pepe_4', 'narr_pepe_5');
        S.sfx('water_lap', 0.3);
        await say('narr_pepe_6', 'narr_pepe_7');
        S.sfx('water_rise', 0.35);
        await say('narr_pepe_8', 'narr_pepe_8b', 'narr_pepe_9');
        S.sfx('water_drain', 0.4); await T(900);
        await say('narr_pepe_2');
      }, { zoom: [1.0, 1.1] });
      G.endStill();
      await S.startThu();
    });
  };
})();
