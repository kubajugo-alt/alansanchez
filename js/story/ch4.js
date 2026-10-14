// Chapter IV — The Founders' Blood: shop (genealogy), Cais do Sodré, the Maria Fé.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;
  const clock = t => { F().harbour = t; G.setClock(t); sfx('harbour_chime', 0.5); };

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
    G.setClock('17:15');
  };

  // ================================================================ CAIS DO SODRÉ
  ROOMS.cais = {
    name: 'Cais do Sodré', bg: 'cais', music: 'tension', ambience: 'harbour', floor: 'cobble',
    fog: 0.34, fogRGB: '200,205,210',
    walk: [[150, 462], [500, 456], [1110, 716], [0, 716], [0, 604], [150, 596]], // clear of the crate stack
    scale: [460, 222, 716, 420],
    light: { ambient: 'rgb(170,175,185)', base: 0.78 },
    lights: [
      { x: 373, y: 203, rgb: '255,190,110', kind: 'gas', seed: 3, glow: 90, ga: 0.35, power: 0.45, reach: 700, floor: [373, 470], height: 380 },
      { x: 474, y: 299, rgb: '255,190,110', kind: 'gas', seed: 7, glow: 60, ga: 0.3, power: 0.3, reach: 500, floor: [474, 470], height: 260 },
      { x: 273, y: 122, rgb: '255,235,190', glow: 50, ga: 0.18, power: 0.12, reach: 500, shadow: false },
    ],
    entries: { default: [140, 640, 'e'], map: [140, 640, 'e'], boat: [880, 640, 'w'] },
    anim(g, t) {
      FX.water(g, t, 700, 560, 580, 160, '200,210,220');
      FX.birds(g, t, { y0: 80, y1: 200, n: 3, period: 15, color: 'rgba(230,232,235,0.8)', size: 11 });
    },
    animFg(g, t) { if (F().ch === 4 && F().harbour) { /* clock overlay is HTML */ } },
    npcs: [
      { id: 'celeste', x: 360, y: 556, dir: 'e', set: 'basket', name: 'Dona Celeste', look: 'narr_look_celeste', talk: () => S.talkCelesteQuay(),
        items: { tidecard: () => say('celeste_hint_ze'), any: 'alan_fail_06' } },
    ],
    ambient: [
      { id: 'npc_mender1', name: 'Fisherman mending nets', frames: ['npc_mender1', 'npc_mender1_b'], x: 600, y: 712, h: 270, look: 'alan_npc_menders' },
      { id: 'npc_mender2', name: 'Fisherman mending nets', frames: ['npc_mender2'], x: 800, y: 714, h: 280, look: 'alan_npc_menders' },
      { id: 'npc_fish', name: 'Fishwife', frames: ['npc_fish', 'npc_fish_b'], x: 520, y: 592, h: 215, look: 'alan_npc_fish' },
    ],
    hotspots: [
      { name: 'Harbour clock', rect: [224, 30, 96, 525], look: 'narr_look_harbourclock' },
      { name: 'Telephone box', rect: [96, 245, 117, 256], at: [230, 520], face: 'w', look: 'narr_look_phonebox', use: () => S.quayPhone() },
      { name: 'Crates', rect: [0, 395, 160, 213], look: 'narr_look_crates' },
      { name: 'Gulls', rect: [500, 400, 260, 130], look: 'alan_npc_gulls' },
      { name: 'Fishing boats', rect: [565, 300, 680, 320], at: [900, 650], face: 'e', look: 'narr_look_boats', exit: 'boat', entry: 'cais', locked: () => F().ze_saved },
      { name: 'Way out', rect: [0, 660, 60, 56], at: [30, 690], exit: 'map', entry: 'cais', locked: () => !F().ze_saved && F().ch === 4, lockedLine: 'celeste_hint_boat' },
    ],
    async enter(entry) {
      if (F().ch >= 4) await S.ensureTideCard();
      if (!F().cais_entered) { F().cais_entered = true; clock('17:40'); await joke('alan_enter_cais'); await say('celeste_quay_hello'); }
    },
  };
  S.talkCelesteQuay = async function () {
    await G.dialog([
      { line: 'alan_ask_ze', once: true, run: () => say('celeste_ze') },
      { line: 'alan_ask_boat', once: true, run: () => say('celeste_boat') },
      { line: 'alan_ask_wake', when: () => F().knocked, run: async () => { await say('celeste_wake'); F().wake_rule = true; } },
      { label: 'What now?', run: () => say(S.quayHint()) },
      { label: 'Goodbye.', bye: true, run: () => say('celeste_quay_bye') },
    ]);
  };
  S.quayHint = () => !F().knocked ? 'celeste_hint_boat' : !F().ze_awake ? (F().knot_tried ? 'celeste_hint_knot' : 'celeste_hint_wake') : !F().ze_believes ? 'celeste_hint_ze' : 'celeste_hint_tile';
  S.quayPhone = async function () {
    if (!F().ze_saved) return say('alan_phone_cais_early');
    if (F().rang_shop) return say('alan_fail_04');
    F().rang_shop = true;
    await posed('phone', async () => { sfx('phone_dial'); await G.wait(window.FAST ? 20 : 1600); sfx('ringout'); await G.wait(window.FAST ? 20 : 4500); await say('alan_ringout'); });
    await S.ch4End();
  };

  // ================================================================ THE MARIA FÉ (deck)
  ROOMS.boat = {
    name: 'The Maria Fé', bg: 'boat', music: 'tension', ambience: 'boat', floor: 'wood',
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
    anim(g, t) { FX.water(g, t, 0, 300, 300, 200, '200,210,220'); },
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
        talk: async () => { if (F().ze_awake) return S.talkZe(); F().knocked = true; await say('alan_shout'); sfx('snore'); } },
      { name: 'Porthole', rect: [747, 416, 85, 75], at: [790, 620], face: 'n', look: async () => { await S.showPorthole(); await say('narr_look_porthole'); } },
      { name: 'Mooring line', rect: [0, 341, 280, 200], at: [230, 620], face: 'w', look: 'narr_look_line',
        use: () => S.mooring(), take: () => S.mooring() },
      { name: "Ship's bell", rect: [855, 238, 40, 46], at: [900, 610], face: 'n', look: 'narr_look_shipbell', use: 'alan_ring_shipbell' },
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
  S.mooring = async function () {
    if (F().ze_awake) return say('alan_fail_04');
    if (!F().wake_rule && !F().knocked) return say('narr_look_line');
    const p = G.player;
    p.pose = 'untie';
    if (!F().knot_tried) {
      F().knot_tried = true; await G.wait(window.FAST ? 20 : 900); p.pose = null;
      await say('alan_knot_fail'); await say('celeste_knot'); return;
    }
    await G.wait(window.FAST ? 20 : 900); p.pose = null;
    sfx('mooring'); await joke('alan_untied');
    await G.wait(window.FAST ? 20 : 400); sfx('hatch_slam');
    F().ze_awake = true; G.refreshNpcs();
    const ze = G.npc('ze'); ze.pose = 'burst'; p.dir = 'e';
    await say('ze_ten'); ze.pose = null;
    await say('ze_who', 'alan_tide_sense');
  };
  S.talkZe = async function () {
    await G.dialog([
      { line: 'alan_danger', once: true, run: () => say('ze_fromyou') },
      { line: 'alan_show_card', when: () => G.has('tidecard') && !F().ze_believes, run: () => S.zeCard(), bye: true },
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
    await G.goRoom('cabin', 'boat');
  };

  // ================================================================ THE CABIN
  ROOMS.cabin = {
    name: 'The cabin', bg: 'cabin',
    layers: [{ img: 'cabin_notile', x: 0, y: 0, full: true, when: () => F().ze_saved || F().tile_held }],
    music: () => F().ze_saved ? null : 'tension', ambience: 'boat', floor: 'wood',
    walk: [[384, 522], [830, 522], [830, 716], [384, 716]],
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
      { id: 'ze', x: 740, y: 640, dir: 'e', name: 'Zé Coutinho', look: 'narr_look_ze', set: () => F().ze_saved ? 'sit' : null, talk: () => F().ze_saved ? say('ze_river') : say('ze_justdo'),
        items: { any: 'alan_fail_ze_item' } },
    ],
    hotspots: [
      { name: 'Photograph', rect: [1067, 160, 64, 117], look: 'narr_look_maria' },
      { name: 'Tile on the bunk', rect: [1100, 480, 90, 50], at: [800, 650], face: 'e', when: () => !F().ze_saved && !F().tile_held, look: 'narr_look_bunktile',
        take: async () => { F().tile_held = true; sfx('pickup'); await say('alan_take_tile'); } },
      { name: 'Hammer', rect: [130, 330, 120, 50], at: [420, 620], face: 'w', look: 'narr_look_hammer',
        take: async () => { if (!F().tile_held || F().ze_saved) return say('alan_fail_take'); G.player.pose = 'reach'; sfx('hammer_bounce'); await G.wait(window.FAST ? 20 : 500); G.player.pose = null; await say('alan_hammer'); F().hammer_tried = true; },
        use: async () => { if (!F().tile_held || F().ze_saved) return say('alan_fail_use'); sfx('hammer_bounce'); await say('alan_hammer'); F().hammer_tried = true; } },
      { name: 'Bunk', rect: [832, 340, 448, 380], look: () => say(F().ze_saved ? 'narr_look_cabin' : 'narr_look_bunktile'),
        items: { tongue: () => S.breakTile() } },
      { name: 'Ladder', rect: [437, 85, 182, 416], at: [528, 560], face: 'n', exit: 'boat', entry: 'cabin' },
    ],
    self: { items: { tongue: () => S.breakTile() } },
    async enter() {
      if (!F().ze_in_cabin) { F().ze_in_cabin = true; }
    },
  };
  S.breakTile = async function () {
    if (F().ze_saved) return say('alan_fail_04');
    await joke('alan_ask_tongue'); await say('ze_justdo');
    const p = G.player; p.pose = 'ring';
    await G.wait(window.FAST ? 20 : 500);
    sfx('tile_shatter'); F().tile_held = false; F().ze_saved = true;
    p.pose = null;
    await G.showStill('cais', async () => { clock('18:25'); sfx('water_drain'); await G.say('narr_turn', { offscreen: true }); }, { hold: 2500, zoom: [1.0, 1.06] });
    G.refreshNpcs();
    await say('alan_turned', 'ze_knew', 'alan_two_sentences');
    await S.romance();
    const ze = G.npc('ze'); ze.set = null; ze.pose = 'give';
    await say('ze_knife'); give('knife'); ze.pose = null;
    await say('alan_pessoa_mention');
    ze.pose = 'toss'; await say('ze_sardine'); give('sardine'); ze.pose = null;
    await say('alan_sardine', 'ze_river');
    ze.set = 'sit';
  };
  // Zé and Alan: one quick, fierce moment in the lantern light, then back to the night's business
  S.romance = async function () {
    if (F().ze_romance) return;
    F().ze_romance = true;
    const ze = G.npc('ze'), p = G.player;
    const T = ms => G.wait(window.FAST ? 20 : ms);
    await G.busy(async () => {
      if (ze) { ze.set = null; ze.pose = null; await p.walkTo(ze.x + 120, ze.y); p.dir = 'w'; ze.dir = 'e'; }
      await say('ze_rom_1');
      // the sweater comes off over his head
      if (ze) { ze.pose = 'ze_strip1'; await T(800); ze.pose = 'ze_dress'; await T(800); ze.pose = 'ze_strip3'; sfx('sheet_slap', 0.25); await T(900); ze.pose = 'ze_shirtless'; }
      await say('alan_rom_1', 'ze_rom_2');
      // the two of them as one painted pair: Zé on the left, Alan on the right
      const home = p.x, mid = ze ? (ze.x + p.x) / 2 : p.x; // pair frames are anchored on the couple's middle
      if (ze) ze.visible = false;
      p.x = mid; p.dir = 'e'; p.pose = 'pair_unbutton'; sfx('sheet_slap', 0.2);
      await T(2200);
      p.pose = 'pair_kiss'; await T(2000);
      p.pose = 'pair_brow'; await T(1400);
      await G.showStill('still_ze_kiss', () => G.say('narr_rom_1', { offscreen: true }), { zoom: [1.02, 1.16], pan: [[0.5, 0.45], [0.5, 0.4]], keep: true });
      // a quick tumble onto the bunk, the same night
      await G.fade(true); await T(600);
      await G.showStill('still_ze_bunk', async () => {
        await G.fade(false);
        await G.say('narr_rom_2', { offscreen: true });
      }, { zoom: [1.0, 1.1], pan: [[0.55, 0.55], [0.6, 0.5]], keep: true });
      await G.fade(true); G.endStill();
      // apart again, putting themselves back together (Alan's washhouse frames, played backwards)
      p.x = home; p.dir = 'w'; p.pose = 'jacket'; // nothing on but the jacket held in front
      if (ze) { ze.visible = true; ze.pose = 'ze_shirtless'; }
      await T(500); await G.fade(false);
      await say('alan_rom_2');
      if (ze) ze.pose = 'ze_dress';
      p.pose = 'undress2'; await T(900); // jeans on, shirt coming down
      p.pose = 'undress1'; if (ze) ze.pose = 'ze_suspenders'; await T(800);
      p.pose = 'button';
      await say('ze_rom_3');
      if (ze) ze.pose = null; p.pose = null;
      await say('alan_rom_3');
    });
  };
  S.ch4End = async function () {
    if (F().ch4_done) return;
    F().ch4_done = true;
    G.setClock(null);
    await G.showStill('shop_night', () => G.say('narr_ch4_end', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.45, 0.55], [0.4, 0.55]] });
    await S.chapter(5, 'narr_ch5_card');
    await G.goRoom('shop', 'map', { pos: [880, 600, 'w'] });
  };
})();
