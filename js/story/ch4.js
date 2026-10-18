// Chapter IV — The Founders' Blood: shop (genealogy), Cais do Sodré, the Maria Fé.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;
  let chimeN = 0; const clock = t => { F().harbour = t; G.setClock(t); sfx('harbour_chime', 0.45, [1, 0.97, 1.03, 0.95][chimeN++ % 4]); };

  S.ch4Start = async function () {
    const ines = G.npc('ines'); if (ines) ines.pose = null;
    await say('ines_genealogy');
    await G.closeup(S.genealogyPages());
    await joke('alan_genealogy');
    await posed('read', () => say('alan_read_coutinho'));
    F().genealogy_read = true;
    if (F().saw_jc_clock) { await say('alan_jc_click', 'ines_time'); if (F().met_celeste) await say('alan_celeste_sweaters'); }
    else await say('alan_jc_unknown');
    await say('ines_kettle', 'alan_ledger_with_ines');
    await say('alan_thanks_ines', 'ines_worried');
    await say('ines_later'); // she's found something about Lacerda's father: it comes back in the cistern
    G.setClock('17:15');
    G.autosave(); // a reload after this point must still find the quay open
  };

  // ================================================================ CAIS DO SODRÉ
  ROOMS.cais = {
    name: 'Cais do Sodré', bg: 'cais', music: () => F().ze_saved ? { id: 'quay_cais_do_sodre', vol: 'low' } : 'quay_cais_do_sodre', // after 18:25, low ambience: 'harbour', floor: 'cobble',
    fog: 0.34, fogRGB: '200,205,210',
    // clear of the crate stack, and of the fishwife's stool, the big bollard and the menders' crates: round the front of them
    walk: [[150, 462], [500, 456], [522, 466], [522, 598], [548, 606], [548, 713], [960, 713], [960, 652], [1119, 720], [0, 720], [0, 604], [150, 596]], // (down to the frame's edge, so the strip in front of the menders is wide enough to walk)
    scale: [460, 222, 716, 420],
    light: { ambient: 'rgb(170,175,185)', base: 0.78 },
    lights: [
      { x: 373, y: 203, rgb: '255,190,110', kind: 'gas', seed: 3, glow: 90, ga: 0.35, power: 0.45, reach: 700, floor: [373, 470], height: 380 },
      { x: 474, y: 299, rgb: '255,190,110', kind: 'gas', seed: 7, glow: 60, ga: 0.3, power: 0.3, reach: 500, floor: [474, 470], height: 260 },
      { x: 273, y: 122, rgb: '255,235,190', glow: 50, ga: 0.18, power: 0.12, reach: 500, shadow: false },
    ],
    entries: { default: [140, 640, 'e'], map: [140, 640, 'e'], boat: [1000, 702, 'w'] },
    anim(g, t) {
      FX.water(g, t, 700, 560, 580, 160, '200,210,220');
      for (let i = 0; i < 4; i++) FX.wisps(g, t + i * 2.2, 760 + i * 130, 600, { n: 3, rise: 40, spread: 70, rgb: '215,220,228', a: 0.05, size: 60, speed: 0.05 });
      FX.birds(g, t, { y0: 80, y1: 200, n: 3, period: 15, color: 'rgba(230,232,235,0.8)', size: 11 });
    },
    // street furniture on the promenade, each hiding whoever walks behind it
    occluders: [
      { y: 497, polys: [[[96, 240], [211, 240], [213, 497], [96, 497]]] },                                   // telephone box
      { y: 550, polys: [[[266, 220], [292, 220], [292, 420], [312, 480], [312, 552], [248, 552], [248, 480], [266, 420]]] }, // harbour clock post
      { y: 468, polys: [[[373, 225], [386, 225], [386, 400], [394, 440], [394, 468], [362, 468], [362, 440], [372, 400]]] },            // gas lamp
      { y: 469, polys: [[[316, 424], [366, 424], [366, 470], [316, 470]]] },                                 // crate
      { y: 468, polys: [[[459, 395], [491, 395], [493, 468], [457, 468]]] },                                 // small bollard
      { y: 522, polys: [[[528, 436], [560, 436], [562, 522], [522, 522], [522, 470]]] },                       // gull bollard
      { y: 628, polys: [[[680, 446], [745, 446], [745, 500], [752, 505], [748, 540], [752, 600], [758, 625], [740, 632], [668, 632], [662, 622], [668, 595], [672, 540], [665, 505], [680, 498]]] }, // big bollard
    ],
    animFg(g, t) { if (F().ch === 4 && F().harbour) { /* clock overlay is HTML */ } },
    npcs: [
      { id: 'celeste', x: 360, y: 556, dir: 'e', set: 'basket', name: 'Dona Celeste', look: 'narr_look_celeste', talk: () => S.talkCelesteQuay(),
        items: { tidecard: () => say('celeste_hint_ze'), any: 'alan_fail_06' } },
    ],
    ambient: [
      { id: 'npc_mender1', name: 'Fisherman mending nets', frames: ['npc_mender1', 'npc_mender1_b'], talkFrames: ['npc_mender1_talk', 'npc_mender1'], talk: () => F().ze_saved ? say('mender1_after') : S.chat('chat_mender1', ['mender1_talk_1'], ['mender1_talk_2'])(), x: 650, y: 712, h: 290, look: 'alan_npc_menders' },
      { id: 'npc_mender2', name: 'Fisherman mending nets', frames: ['npc_mender2', 'npc_mender2_b'], idleHold: [5, 11], variantHold: [2, 4], talkFrames: ['npc_mender2_talk', 'npc_mender2'], talk: () => F().ze_saved ? say('mender2_after') : S.chat('chat_mender2', ['mender2_talk_1', 'alan_mender2_1'], ['mender2_talk_2'])(), x: 835, y: 714, h: 292, look: 'alan_npc_menders' },
      { id: 'npc_fish', name: 'Fishwife', frames: ['npc_fish', 'npc_fish_b'], talkFrames: ['npc_fish_b', 'npc_fish'], talk: () => S.fishTalk(), x: 485, y: 592, h: 282, at: [540, 648], face: 'w', look: 'alan_npc_fish' }, // at the right end of her stall: the walkway drops away beyond it
    ],
    hotspots: [
      { name: 'Harbour clock', rect: [224, 30, 96, 525], look: 'narr_look_harbourclock' },
      { name: 'Telephone box', rect: [96, 245, 117, 256], at: [230, 520], face: 'w', look: 'narr_look_phonebox', use: () => S.quayPhone(), items: { vasco_card: () => S.quayPhone() } },
      { name: 'Crates', rect: [0, 395, 160, 213], look: 'narr_look_crates' },
      { name: 'Gulls', rect: [500, 400, 260, 130], look: 'alan_npc_gulls' },
      { name: 'Fishing boats', rect: [565, 300, 680, 320], at: [1000, 702], face: 'e', look: 'narr_look_boats', exit: 'boat', entry: 'cais', locked: () => F().ze_saved },
      { name: 'Way out', rect: [0, 660, 60, 56], at: [30, 690], exit: 'map', entry: 'cais', locked: () => F().ch === 4 && !F().ch4_done, lockedLine: () => F().ze_saved ? 'alan_ring_first' : 'celeste_hint_boat' },
    ],
    async enter(entry) {
      if (F().ch >= 4) await S.ensureTideCard();
      if (!F().cais_entered) { F().cais_entered = true; clock('17:40'); await joke('alan_enter_cais'); await say('celeste_quay_hello'); }
      else if (F().ze_saved && !F().celeste_after) { F().celeste_after = true; await say('celeste_after_hello', 'alan_after_celeste', 'celeste_after_laugh', 'celeste_hint_phone'); }
    },
  };
  // Rosa sells loud and gossips louder; the old mender is the one who stops her.
  // Her dig about Alan's Thursdays only comes once the whole quay has heard Zé's boat (ze_romance, set in the cabin)
  S.fishTalk = async function () {
    if (!F().ze_romance) {
      if (F().chat_fish) return say('fish_talk_3');
      F().chat_fish = true;
      return say('fish_talk_1', 'alan_fish_1', 'fish_talk_2');
    }
    if (F().fish_remark) return say('fish_after', 'alan_after_fish');
    await say('fish_after', 'alan_after_fish');
    F().fish_remark = true;
    const p = G.player;
    await say('fish_remark');
    await G.wait(window.FAST ? 20 : 600);
    await say('mender1_shush', 'fish_huff');
    await G.wait(window.FAST ? 20 : 900);
    const m = G.npc('npc_mender1'); if (m) p.dir = m.x > p.x ? 'e' : 'w';
    await say('alan_mender1_thanks', 'mender1_nothing');
  };
  S.talkCelesteQuay = async function () {
    // after the Maria Fé: the whole quay saw that boat rock, and Celeste is enjoying it
    if (F().ze_saved) {
      if (!F().celeste_after) { F().celeste_after = true; await say('celeste_after_hello', 'alan_after_celeste', 'celeste_after_laugh'); }
      return G.dialog([
        { line: 'alan_ask_ze_ok', once: true, run: () => say('celeste_after_ze', 'alan_after_ze') },
        { label: 'What now?', run: () => say(S.quayHint()) },
        { label: 'Goodbye.', bye: true, run: () => say('celeste_quay_bye') },
      ]);
    }
    await G.dialog([
      { line: 'alan_ask_ze', once: true, run: () => say('celeste_ze', 'gag_celeste_quay', 'gag_alan_celeste_quay') },
      { line: 'alan_ask_boat', once: true, run: () => say('celeste_boat') },
      { line: 'alan_ask_wake', when: () => F().knocked, run: async () => { await say('celeste_wake'); F().wake_rule = true; } },
      { label: 'What now?', run: () => say(S.quayHint()) },
      { label: 'Goodbye.', bye: true, run: () => say('celeste_quay_bye') },
    ]);
  };
  S.quayHint = () => !F().knocked ? 'celeste_hint_boat' : !F().ze_awake ? (F().knot_tried ? 'celeste_hint_knot' : 'celeste_hint_wake') : !F().ze_believes ? 'celeste_hint_ze' : !F().ze_saved ? 'celeste_hint_tile' : 'celeste_hint_phone';
  S.quayPhone = async function () {
    if (!F().ze_saved) return say('alan_phone_cais_early');
    if (F().rang_shop) return say('alan_fail_04');
    F().rang_shop = true;
    await posed('phone', async () => { sfx('payphone_coins'); sfx('phone_dial_long'); await G.wait(window.FAST ? 20 : 2600); sfx('ringout', 0.35); await G.wait(window.FAST ? 20 : 4500); await say('alan_ringout'); });
    await S.ch4End();
  };

  // ================================================================ THE MARIA FÉ (deck)
  const PULL_AT = [167, 620]; // Alan's feet when hauling the mooring line: his fists sit on the painted rope
  ROOMS.boat = {
    name: 'The Maria Fé', bg: 'boat', music: 'ze_boat_deck', // the race to 18:25 ambience: 'boat', floor: 'wood',
    layers: [{ img: 'boat_noline', x: 0, y: 0, full: true, when: () => F().line_free || F().ze_awake }],
    occluders: [
      { y: 628, polys: [[[1070, 470], [1120, 455], [1165, 470], [1178, 530], [1172, 600], [1160, 618], [1100, 628], [1040, 640], [1012, 636], [1030, 610], [1062, 560]]] }, // orange float in its net
      { y: 644, polys: [[[1170, 480], [1280, 478], [1280, 644], [1180, 644], [1175, 600]]] },                          // basket
      { y: 694, polys: [[[1206, 580], [1280, 560], [1280, 700], [1220, 694]]] },                                       // green float
    ],
    fog: 0.3, fogRGB: '200,205,210',
    walk: [[150, 614], [1060, 606], [1230, 716], [60, 716]], // in front of the hatch, clear of the baskets
    scale: [578, 400, 716, 470],
    light: { ambient: 'rgb(165,170,180)', base: 0.78 },
    lights: [
      { x: 1184, y: 267, rgb: '255,190,110', kind: 'flame', seed: 2, glow: 80, ga: 0.35, power: 0.5, reach: 700, floor: [1150, 600], height: 300 },
      { x: 600, y: 80, rgb: '210,215,222', power: 0.22, reach: 1200, rim: 0.3, shadow: 0.35, floor: [600, 500], height: 900 },
    ],
    entries: { default: [240, 650, 'e'], cais: [240, 650, 'e'], cabin: [560, 620, 's'] },
    // the whole deck rocks gently at its mooring
    sway: t => Math.sin(t * 0.7) * 0.004,
    anim(g, t) {
      FX.water(g, t, 0, 300, 300, 200, '200,210,220');
      S.drawRope(g, t);
      FX.birds(g, t + 5, { y0: 40, y1: 160, n: 2, period: 17, color: 'rgba(225,228,232,0.7)', size: 10 });
      for (let i = 0; i < 3; i++) FX.wisps(g, t + i * 3, 60 + i * 110, 420, { n: 3, rise: 40, spread: 60, rgb: '215,220,228', a: 0.05, size: 55, speed: 0.05 });
    },
    npcs: [
      { id: 'ze', x: 900, y: 618, dir: 'w', name: 'Zé Coutinho', when: () => F().ze_awake && !F().ze_in_cabin, look: 'narr_look_ze', talk: () => S.talkZe(),
        items: { tidecard: () => S.zeCard(), file55: () => say('ze_file'), any: 'alan_fail_ze_item' } },
    ],
    hotspots: [
      { name: 'Hatch', rect: [437, 341, 256, 235], at: [560, 625], face: 'n',
        look: () => say(F().ze_awake ? 'narr_look_cabin' : 'narr_look_hatch'),
        use: async () => {
          if (F().ze_awake) { if (!F().ze_believes) return say('ze_ten'); return G.goRoom('cabin', 'boat'); }
          sfx('knock'); await G.wait(window.FAST ? 20 : 600); sfx('snore'); F().knocked = true; await say('alan_knock');
        },
        get talk() { return F().ze_awake ? null : async () => { F().knocked = true; await say('alan_shout'); sfx('snore'); }; } },
      { name: 'Porthole', rect: [747, 416, 85, 75], at: [790, 620], face: 'n', look: async () => { if (F().ze_awake) return say('narr_look_porthole_empty'); await S.showPorthole(); await say('narr_look_porthole'); } }, // once Zé is up, the bunk is empty
      { name: 'Mooring line', rect: [0, 341, 280, 200], at: PULL_AT, face: 'w', look: 'narr_look_line',
        use: () => S.mooring(), take: () => S.mooring() },
      { name: "Ship's bell", rect: [855, 238, 40, 46], get at() { return F().ze_awake && !F().ze_in_cabin ? [795, 612] : [900, 610]; }, face: 'n', look: 'narr_look_shipbell', use: async () => { sfx('ship_bell', 0.8); await say('alan_ring_shipbell'); } }, // beside Zé when he stands under it, not inside him
      { name: 'Back to the quay', rect: [0, 540, 130, 176], at: [110, 690], exit: 'cais', entry: 'boat' },
    ],
    async enter() {
      if (F().ch >= 4) await S.ensureTideCard();
      if (!F().crossed) {
        F().crossed = true;
        const p = G.player; p.pose = 'wobble'; sfx('boat_creak');
        await joke('alan_sea_legs'); p.pose = null;
        clock('18:05');
      }
    },
  };
  // the mooring line: from the next boat (off the left edge) to the bollard; once
  // freed it slips off the coil and sags into the river
  let ropeT0 = 0;
  S.drawRope = function (g, t) {
    if (!(F().line_free || F().ze_awake)) return;
    const k = ropeT0 ? Math.min(1, (performance.now() - ropeT0) / 1400) : 1, e = 1 - Math.pow(1 - k, 3);
    const sway = Math.sin(t * 0.9) * 4;
    const A = [-6, 341], B = [206 - 70 * e, 479 + 52 * e + sway * e], C = [100 - 10 * e, 412 + 150 * e + sway];
    g.save(); g.lineCap = 'round';
    const path = () => { g.beginPath(); g.moveTo(A[0], A[1]); g.quadraticCurveTo(C[0], C[1], B[0], B[1]); };
    g.strokeStyle = '#4a3b26'; g.lineWidth = 10; path(); g.stroke();
    g.strokeStyle = '#8a7350'; g.lineWidth = 7; path(); g.stroke();
    g.strokeStyle = 'rgba(40,30,18,0.8)'; g.lineWidth = 7; g.setLineDash([3, 6]); g.lineDashOffset = -k * 30; path(); g.stroke(); g.setLineDash([]);
    // where it lies in the water, the river closes over it
    g.beginPath(); g.rect(0, 494, 280, 70); g.clip();
    g.strokeStyle = 'rgba(58,64,70,0.72)'; g.lineWidth = 12; path(); g.stroke();
    g.restore();
  };
  S.mooring = async function () {
    if (F().ze_awake) return say('alan_fail_04');
    if (!F().wake_rule && !F().knocked) return say('narr_look_line');
    const p = G.player;
    // the line is the painted one: he stands where both fists close on it, and hauls
    p.x = PULL_AT[0]; p.y = PULL_AT[1]; p.dir = 'w';
    p.pose = F().knot_tried ? 'untie' : 'pull'; // the successful haul has its own frame once approved (poses.untie)
    if (!F().knot_tried) {
      F().knot_tried = true; await G.wait(window.FAST ? 20 : 900); p.pose = null;
      await say('alan_knot_fail'); await say('celeste_knot'); return;
    }
    await G.wait(window.FAST ? 20 : 900); p.pose = null;
    F().line_free = true; ropeT0 = performance.now(); sfx('mooring');
    await G.wait(window.FAST ? 20 : 1500); sfx('boat_creak', 0.8);
    await joke('alan_untied');
    await G.wait(window.FAST ? 20 : 400); sfx('hatch_slam');
    F().ze_awake = true; G.refreshNpcs();
    // he bursts out of the hatch itself, then goes to stand under his bell
    const ze = G.npc('ze'); ze.x = 640; ze.y = 612; ze.dir = 'w'; ze.pose = 'burst'; p.dir = 'e';
    await say('ze_ten'); ze.pose = null;
    await say('ze_who', 'alan_tide_sense');
    ze.walkTo(900, 618).then(() => { ze.dir = 'w'; });
  };
  S.talkZe = async function () {
    await G.dialog([
      { line: 'alan_danger', once: true, run: () => say('ze_fromyou') },
      { line: 'alan_show_card', silent: true, when: () => G.has('tidecard') && !F().ze_believes, run: () => S.zeCard(), bye: true },
      { line: 'alan_ask_ze_tile', when: () => F().ze_believes, run: async () => { await say('ze_tile', 'ze_cabin'); } },
      { label: 'Show me the cabin.', when: () => F().ze_believes, bye: true, run: () => S.toCabin() },
      { label: 'Goodbye.', bye: true },
    ]);
  };
  S.zeCard = async function () {
    if (F().ze_believes) return say('ze_cabin');
    await say('alan_show_card');
    F().ze_believes = true;
    await S.readTideCard();
    await say('ze_card', 'ze_turning', 'alan_ask_ze_tile', 'ze_tile', 'ze_cabin');
    clock('18:20');
    await S.toCabin();
  };
  S.toCabin = async function () {
    const ze = G.npc('ze');
    if (ze) { await ze.walkTo(560, 600); ze.visible = false; sfx('hatch_slam'); }
    await G.player.walkTo(560, 625);
    await G.goRoom('cabin', 'boat', { sound: null });
  };

  // ================================================================ THE CABIN
  ROOMS.cabin = {
    name: 'The cabin', bg: 'cabin',
    layers: [{ img: 'cabin_notile', x: 0, y: 0, full: true, when: () => F().ze_saved || F().tile_held }],
    animFg(g, t) { S.drawStrike(g, t); },
    music: () => F().ze_saved ? null : { id: 'ze_boat_deck', lowpass: 900 }, ambience: 'boat', floor: 'wood', // the deck's music through the boards; Zé's scene has none
    occluders: [
      { y: 548, polys: [[[760, 387], [814, 387], [814, 548], [760, 548]]] },                                            // sea chest
      { y: 718, base: [[810, 583], [1000, 718]], polys: [[[810, 425], [840, 415], [1280, 300], [1280, 720], [1000, 720], [837, 585], [810, 585]]] }, // bunk
    ],
    walk: [[384, 522], [750, 522], [754, 600], [830, 600], [830, 716], [384, 716]], // not into the bedside chest or behind the bunk's head
    scale: [500, 330, 716, 420],
    light: { ambient: 'rgb(170,150,130)', base: 0.66, flickerShade: 0.25 },
    lights: [
      { x: 213, y: 224, rgb: '255,185,100', kind: 'flame', seed: 4, glow: 110, ga: 0.3, power: 0.6, reach: 800, floor: [213, 520], height: 300 },
      { x: 528, y: 80, rgb: '210,215,222', power: 0.25, reach: 700, rim: 0.5, floor: [528, 500], height: 400 }, // hatch light
    ],
    entries: { default: [520, 620, 'e'], boat: [520, 620, 'e'] },
    anim(g, t) {
      if (!F().ze_saved) {
        // the puddle spreads uphill, and the tile glows faintly
        const k = Math.min(1, 0.4 + (t % 30) / 50);
        g.save(); g.globalAlpha = 0.35; g.fillStyle = '#0b1220'; g.beginPath(); g.ellipse(1135, 515, 90 * k, 26 * k, -0.1, 0, 7); g.fill(); g.restore();
        FX.glow(g, 1141, 505, 40, '120,180,255', 0.18 + 0.06 * Math.sin(t * 2));
      }
    },
    npcs: [
      { id: 'ze', x: 740, y: 640, dir: 'w', name: 'Zé Coutinho', look: 'narr_look_ze', talk: () => F().ze_saved ? say('ze_river', 'ze_river_2') : say('ze_justdo'),
        items: { any: 'alan_fail_ze_item' } },
    ],
    hotspots: [
      { name: 'Photograph', rect: [1067, 160, 64, 117], look: 'narr_look_maria' },
      { name: 'Tile on the bunk', rect: [1100, 480, 90, 50], at: [800, 650], face: 'e', when: () => !F().ze_saved && !F().tile_held, look: 'narr_look_bunktile',
        take: async () => { F().tile_held = true; give('bunktile'); await say('alan_take_tile'); } },
      { name: 'Hammer', rect: [130, 330, 120, 50], at: [420, 620], face: 'w', look: 'narr_look_hammer',
        take: () => S.hammerTile(), use: () => S.hammerTile(), items: { bunktile: () => S.hammerTile() } },
      { name: 'Bunk', rect: [832, 340, 448, 380], look: () => say(F().ze_saved ? 'narr_look_cabin' : F().tile_held ? 'alan_tile_pocket' : 'narr_look_bunktile'),
        items: { tongue: () => F().tile_held ? say('alan_tile_pocket') : S.breakTile(), bunktile: () => say('alan_fail_04') } },
      { name: 'Ladder', rect: [437, 85, 182, 416], at: [528, 560], face: 'n', exit: 'boat', entry: 'cabin' },
    ],
    self: { items: { tongue: () => S.breakTile() } },
    async enter() {
      if (!F().ze_in_cabin) { F().ze_in_cabin = true; }
    },
  };
  // the tile set down on the boards in front of Alan, and what happens when he hits it
  let strike = null;
  const T = ms => G.wait(window.FAST ? 20 : ms);
  const tileSpot = () => { const p = G.player; return [p.x + (p.dir === 'w' ? -70 : 70), p.y - 4]; };
  S.drawStrike = function (g, t) {
    if (!strike) return;
    const [x, y] = strike.at, k = (performance.now() - strike.t0) / 1000;
    g.save();
    if (!strike.broken) {
      const hop = strike.hop ? Math.max(0, Math.sin(Math.min(1, (performance.now() - strike.hop) / 260) * Math.PI)) * 10 : 0;
      g.translate(x, y - hop); g.scale(1, 0.42);
      g.fillStyle = '#eef2f6'; g.strokeStyle = '#1d140e'; g.lineWidth = 2; g.fillRect(-22, -22, 44, 44); g.strokeRect(-22, -22, 44, 44);
      g.strokeStyle = '#1f4fa8'; g.lineWidth = 3; g.strokeRect(-17, -17, 34, 34);
      g.beginPath(); g.moveTo(-12, 8); g.bezierCurveTo(-6, -8, 4, 6, 12, -10); g.stroke();
      g.globalAlpha = 0.35; g.fillStyle = '#7ab0ff'; g.beginPath(); g.ellipse(0, 0, 40, 40, 0, 0, 7); g.fill(); // it glows faintly
    } else {
      // shards skitter out, and the sea it held runs away between the boards
      for (let i = 0; i < 14; i++) {
        const a = i * 2.39, d = Math.min(1, k * 1.6) * (30 + (i * 17) % 60);
        g.fillStyle = i % 3 ? '#eef2f6' : '#1f4fa8';
        g.save(); g.translate(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.35); g.rotate(a + k * 3); g.fillRect(-5, -3, 10, 6); g.restore();
      }
      if (k < 1.5) { g.globalAlpha = 0.5 * (1 - k / 1.5); g.fillStyle = '#9cc4ff'; g.beginPath(); g.ellipse(x, y, 30 + k * 90, 8 + k * 20, 0, 0, 7); g.fill(); }
    }
    g.restore();
  };
  // the hammer bounces off it: the sea won't break for iron
  S.hammerTile = async function () {
    if (F().ze_saved) return say('alan_fail_use');
    if (!F().tile_held) return say(F().ze_in_cabin ? 'narr_look_hammer' : 'alan_fail_use');
    if (F().hammer_tried) return say('alan_hammer');
    const p = G.player;
    await G.busy(async () => {
      p.pose = 'reach'; sfx('hammer_lift', 0.5); await T(500); p.pose = null;
      strike = { at: tileSpot(), t0: performance.now() };
      for (let i = 0; i < 2; i++) {
        p.pose = 'ring'; await T(260);
        sfx('hammer_bounce'); strike.hop = performance.now(); await T(180);
        p.pose = null; await T(320);
      }
      await say('alan_hammer');
      p.pose = 'reach'; await T(400); strike = null; p.pose = null; // back in the pocket
    });
    F().hammer_tried = true;
  };
  S.breakTile = async function () {
    if (F().ze_saved) return say('alan_fail_04');
    if (!F().tile_held) return say('narr_look_bunktile');
    await joke('alan_ask_tongue'); await say('ze_justdo');
    const p = G.player;
    p.pose = 'reach'; await T(450); p.pose = null;
    strike = { at: tileSpot(), t0: performance.now() };
    p.pose = 'ring'; await T(500);
    sfx('tile_shatter'); Sound.cue('bell_motif'); strike.broken = true; strike.t0 = performance.now();
    G.takeItem('bunktile'); F().tile_held = false; F().ze_saved = true;
    await T(700); p.pose = null;
    await G.showStill('cais', async () => { clock('18:25'); sfx('water_drain'); await G.say('narr_turn', { offscreen: true }); }, { hold: 2500, zoom: [1.0, 1.06] });
    G.refreshNpcs();
    Sound.cue(null, { xf: 3 }); // then only the boat: water and timber
    await say('alan_turned', 'ze_knew', 'alan_two_sentences');
    await S.romance();
    if (S.flingBeat) await S.flingBeat(3);
    const ze = G.npc('ze'); ze.pose = 'give';
    await say('ze_knife'); give('knife'); ze.pose = null;
    await say('alan_pessoa_mention');
    ze.pose = 'toss'; await say('ze_sardine'); give('sardine'); ze.pose = null;
    strike = null;
    await say('alan_sardine', 'ze_river', 'ze_river_2', 'alan_river_2');
  };
  // Zé and Alan: one quick, fierce moment in the lantern light, then back to the night's business
  S.romance = async function () {
    if (F().ze_romance) return;
    F().ze_romance = true;
    const ze = G.npc('ze'), p = G.player;
    const T = ms => G.wait(window.FAST ? 20 : ms);
    await G.busy(async () => {
      if (ze) { ze.pose = null; await p.walkTo(ze.x + 120, ze.y); p.dir = 'w'; ze.dir = 'e'; }
      await say('ze_rom_1');
      // the sweater comes off over his head
      if (ze) { ze.pose = 'ze_strip1'; await T(800); ze.pose = 'ze_dress'; await T(800); ze.pose = 'ze_strip3'; sfx('sheet_slap', 0.25); await T(900); ze.pose = 'ze_shirtless'; }
      // he's already half in love with someone else: he says so, Zé leaves him the door, and Alan chooses
      await G.wait(window.FAST ? 20 : 700);
      await say('ze_rom_admire');
      await say('alan_rom_hesitate');
      if (ze) { const zx = ze.x; for (let i = 0; i < 5 && !window.FAST; i++) { ze.x -= 6; await T(60); } ze.x = window.FAST ? zx - 30 : ze.x; }
      await say('ze_rom_hold_2');
      await T(1400);
      await G.say('narr_rom_choice', { offscreen: true });
      if (ze) { await p.walkTo(ze.x + 95, ze.y); p.dir = 'w'; } // Alan closes the gap himself
      await say('ze_rom_take'); // and from there Zé is in charge
      await say('alan_rom_1', 'ze_rom_2');
      const home = p.x;
      if (!S.discreet()) { // Discreet: straight from the build-up to the afterwards
      // the two of them as one painted pair: Zé on the left, Alan on the right (Alan steps into it, Zé stays put)
      if (!ze || !await S.pairIn(ze, 'pair_unbutton')) { p.dir = 'e'; p.pose = 'pair_unbutton'; }
      sfx('sheet_slap', 0.2); sfx('v_ze_sigh', 0.5);
      await T(2200);
      await S.pairStep('pair_kiss'); sfx('v_alan_mmm', 0.5); await T(1200); sfx('v_ze_moan', 0.45); await T(1300);
      await S.pairStep('pair_brow'); sfx('v_alan_sigh', 0.45); await T(1600);
      await G.showStill('still_ze_kiss', () => G.say('narr_rom_1', { offscreen: true }), { zoom: [1.02, 1.16], pan: [[0.5, 0.45], [0.5, 0.4]], keep: true });
      // a quick tumble onto the bunk, the same night
      await G.fade(true); await T(600);
      await G.showStill('still_ze_bunk', async () => {
        await G.fade(false); sfx('v_alan_groan', 0.45); await T(700); sfx('v_ze_moan', 0.4); await T(900);
        await G.say('narr_rom_2', { offscreen: true });
      }, { zoom: [1.0, 1.1], pan: [[0.55, 0.55], [0.6, 0.5]], keep: true });
      await G.fade(true); G.endStill();
      } else { if (ze) ze.visible = false; await G.fade(true); await T(900); }
      // apart again, putting themselves back together (Alan's washhouse frames, played backwards)
      p.x = home; p.dir = 'w'; p.pose = 'jacket'; p.pairWho = p.pairNpc = p.pairKey = null; // nothing on but the jacket held in front
      if (ze) { ze.visible = true; ze.pose = 'ze_shirtless'; }
      await T(500); await G.fade(false);
      await say('alan_rom_2');
      if (ze) ze.pose = 'ze_dress';
      // dressing again, the same frames as after the bath and upstairs: trunks, jeans, tee, jacket
      const D = k => window.SPRITES['alan_dress' + k] ? 'alan_dress' + k : null;
      p.pose = 'undress4'; await T(700);                                   // trunks back on
      if (D(1)) { p.pose = D(1); await T(700); }                           // jeans in hand
      if (D(2)) { p.pose = D(2); await T(800); }                           // hopping into them
      p.pose = D(3) || 'undress2'; await T(800);                           // the tee coming down
      p.pose = D(4) || 'undress1'; if (ze) ze.pose = 'ze_suspenders'; await T(800); // jacket back on
      p.pose = 'button';
      await say('ze_rom_3');
      if (ze) ze.pose = null; p.pose = null;
      await say('alan_rom_3', 'gag_ze', 'gag_alan_ze');
      await T(600); await say('alan_rom_guilt'); // the trowel man deserves the truth
    });
  };
  S.ch4End = async function () {
    if (F().ch4_done) return;
    F().ch4_done = true;
    G.setClock(null);
    Sound.cue({ id: 'main_theme', vol: 'low' }, { sticky: true });
    await G.showStill('shop_night', () => G.say('narr_ch4_end', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.45, 0.55], [0.4, 0.55]] });
    await S.chapter(5, 'narr_ch5_card');
    await G.goRoom('shop', 'map', { pos: [880, 600, 'w'] });
  };
})();
