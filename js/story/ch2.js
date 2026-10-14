// Chapter II — The Unexplained Drawer: lavadouro, Relojoaria Ferreira.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;

  // ================================================================ LAVADOURO
  ROOMS.lavadouro = {
    name: 'Lavadouro do Alfama', bg: 'lavadouro', music: 'fog', ambience: 'washhouse', floor: 'wet',
    fog: 0.18, fogRGB: '225,228,228',
    walk: [[0, 508], [868, 505], [868, 690], [1280, 700], [1280, 716], [0, 716]],
    scale: [505, 218, 716, 440],
    light: { ambient: 'rgb(205,210,210)', base: 0.86, rim: 'rgba(220,228,235,0.2)', rimSide: 1 },
    lights: [
      { x: 725, y: 78, rgb: '255,215,150', kind: 'gas', seed: 4, glow: 80, ga: 0.22, power: 0.35, reach: 700, floor: [725, 520], height: 600 },
      { x: 700, y: 240, rgb: '220,226,232', power: 0.3, reach: 1100, rim: 0.5, shadow: 0.5, floor: [700, 480], height: 800 }, // fog light through the arches
    ],
    entries: { default: [120, 640, 'e'], map: [120, 640, 'e'] },
    anim(g, t) {
      for (const [x, w] of [[220, 160], [420, 170], [640, 170], [860, 150]]) FX.wisps(g, t + x, x + w / 2, 395, { n: 4, rise: 110, spread: 40, a: 0.07, size: 30, speed: 0.12 }); // steam off the basins
      FX.wisps(g, t, 1040, 470, { n: 4, rise: 90, spread: 30, a: 0.06, size: 26, speed: 0.1 });
      FX.drips(g, t, [[1222, 470, 412, 2.6]], '220,235,240');
    },
    animBack(g, t) {
      const im = G.bgImage();
      [[20, 10, 95, 260, 0], [125, 30, 70, 240, 1.4], [205, 50, 60, 200, 2.3], [395, 60, 50, 170, 0.8]].forEach(([x, y, w, h, ph]) => FX.sway(g, im, [x, y, w, h], t, 1.2, ph));
    },
    // the back basins stand in front of the washerwomen
    occluders: [{ y: 482, polys: [[[160, 386], [1068, 386], [1068, 484], [160, 484]]] }],
    npcs: [
      { id: 'celeste', x: 600, y: 610, dir: 'e', set: () => F().met_celeste ? 'wring' : 'wring', name: 'Dona Celeste', look: 'narr_look_celeste', talk: () => S.talkCeleste(),
        items: { notebook: () => S.celesteTile(), file55: () => S.celeste1955(), any: 'alan_fail_06' } },
    ],
    ambient: [
      { id: 'npc_washer1', name: 'Washerwoman', frames: ['npc_washer1', 'npc_washer1_b'], x: 300, y: 474, h: 205, look: 'alan_npc_washers', idleHold: [6, 14] },
      { id: 'npc_washer2', name: 'Washerwoman', frames: ['npc_washer2', 'npc_washer2_b'], x: 500, y: 476, h: 196, look: 'alan_npc_washers', idleHold: [7, 16] },
    ],
    hotspots: [
      { name: 'Wash basins', rect: [160, 372, 908, 112], look: 'narr_look_basins' },
      { name: 'Wet sheets', rect: [0, 0, 520, 300], look: 'narr_look_sheets' },
      { name: 'Arches', rect: [416, 128, 588, 240], look: 'narr_look_lav_arches' },
      { name: "Celeste's sheet", rect: [843, 448, 437, 230], at: [780, 640], face: 'e', look: 'narr_look_sheets', use: () => S.wringSheet(), take: () => S.wringSheet() },
      { name: 'Way out', rect: [0, 560, 60, 156], at: [30, 660], exit: 'map', entry: 'lavadouro' },
    ],
    async enter() { if (!F().lav_entered) { F().lav_entered = true; await say('alan_enter_lavadouro'); } },
  };
  S.wringSheet = async function () {
    if (F().met_celeste) return say('alan_fail_04');
    const c = G.npc('celeste'), p = G.player;
    await p.walkTo(c.x + 170, c.y); p.dir = 'w'; c.dir = 'e';
    p.pose = 'wring'; c.set = 'wring';
    sfx('wring');
    await joke('alan_wring');
    p.pose = null; F().met_celeste = true; c.set = null;
    await say('celeste_hello');
    await S.talkCeleste(true);
  };
  S.talkCeleste = async function (first) {
    if (G.room.id === 'cais') return S.talkCelesteQuay();
    if (!F().met_celeste) return say('celeste_twist');
    if (!first) await say('celeste_hello');
    await G.dialog([
      { line: 'alan_ask_river', once: true, run: async () => { await say('celeste_river'); await joke('alan_breathes'); await say('celeste_salt'); F().lore_turnings = true; } },
      { line: 'alan_show_tile', when: () => F().sketched_tile && !F().lore_bronze, run: () => S.celesteTile() },
      { line: 'alan_show_file', when: () => G.has('file55') && !F().knows_1955_boy, run: () => S.celeste1955() },
      { line: 'alan_ask_maria', once: true, run: () => say('celeste_maria') },
      { line: 'alan_ask_rui', once: true, run: () => say('celeste_rui', 'alan_rui_eating') },
      { label: 'Goodbye.', bye: true, run: async () => { await say('celeste_bye'); S.checkCh2(); } },
    ]);
  };
  S.celesteTile = async function () {
    await say('alan_show_tile', 'celeste_tile_1');
    await joke('alan_dingdong'); await say('celeste_cheeky');
    F().lore_bronze = true;
  };
  S.celeste1955 = async function () {
    await say('alan_show_file', 'celeste_1955_1', 'celeste_1955_2');
    F().knows_1955_boy = true;
  };

  // ================================================================ RELOJOARIA FERREIRA
  const lit = () => F().ferreira_lit;
  ROOMS.ferreira = {
    name: 'Relojoaria Ferreira', bg: 'ferreira', music: null, ambience: () => lit() && !F().tide_known ? null : null, floor: 'wood',
    walk: [[0, 615], [1280, 615], [1280, 716], [0, 716]],
    scale: [615, 335, 716, 382],
    light: () => lit() ? { ambient: 'rgb(210,170,120)', base: 0.6, flickerShade: 0.25 } : { ambient: 'rgb(70,70,85)', base: 0.35 },
    lights: () => lit() ? [
      { x: 523, y: 372, rgb: '255,190,110', kind: 'flame', seed: 6, glow: 160, ga: 0.32, power: 0.8, reach: 900, rim: 0.7, floor: [523, 620], height: 260 },
      { x: 1140, y: 330, rgb: '190,200,215', power: 0.18, reach: 600, floor: [1140, 600], height: 500 },
    ] : [
      { x: 1140, y: 330, rgb: '190,200,215', power: 0.3, reach: 700, rim: 0.7, floor: [1140, 600], height: 500 },
    ],
    entries: { default: [1080, 650, 'w'], map: [1080, 650, 'w'] },
    // unlit, the workshop is black but for the grey light at the door
    animFg(g, t) {
      if (lit()) { FX.motes(g, t, 300, 250, 500, 300, 20, '255,210,150'); return; }
      g.save(); g.fillStyle = 'rgba(4,4,8,0.9)'; g.fillRect(0, 0, 1280, 720);
      g.globalCompositeOperation = 'destination-out';
      const gr = g.createRadialGradient(1140, 360, 20, 1140, 360, 420); gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 1280, 720);
      const g2 = g.createRadialGradient(523, 380, 4, 523, 380, 90); g2.addColorStop(0, 'rgba(0,0,0,0.5)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = g2; g.fillRect(0, 0, 1280, 720);
      g.restore();
    },
    hotspots: [
      { name: 'Oil lamp', rect: [500, 330, 50, 80], at: [560, 640], face: 'n', look: () => say(lit() ? 'narr_look_workbench' : 'narr_look_oillamp'),
        use: () => say(lit() ? 'alan_fail_04' : 'alan_dark'),
        items: { matches: async () => {
          if (lit()) return say('alan_fail_04');
          sfx('match'); F().ferreira_lit = true; G.takeItem('matches');
          await G.wait(window.FAST ? 20 : 500);
          await say('alan_lamp_lit'); await say('alan_enter_ferreira'); await say('alan_clocks');
        }, any: 'alan_dark' } },
      { name: 'Wall of clocks', rect: [100, 0, 900, 330], when: lit, look: 'narr_look_clockwall' },
      { name: 'Workbench', rect: [330, 420, 620, 190], when: lit, look: 'narr_look_workbench' },
      { name: 'Repair book', rect: [640, 430, 118, 30], at: [690, 640], face: 'n', when: lit, look: async () => { await S.readRepair(); await say('alan_repair'); F().read_repair = true; await say('alan_repair_hint'); } },
      { name: 'Tide clock', rect: [757, 330, 118, 118], at: [810, 640], face: 'n', when: lit,
        look: async () => {
          if (!F().tide_wound) return say('narr_look_tideclock');
          await S.showTideClock(true);
          if (!F().deaths_known) return say('alan_need_times');
          if (!F().tide_known) { F().tide_known = true; await say('alan_turnings'); if (F().met_celeste) await say('alan_turnings_celeste'); await S.ensureTideCard(); }
          else await say('alan_tide_today');
        },
        items: { key: async () => {
          if (F().tide_wound) return say('alan_fail_04');
          G.takeItem('key'); F().tide_wound = true; sfx('clock_wind');
          await joke('alan_clock_wound');
          await S.showTideClock(true);
          await say('narr_tideclock_runs');
          if (F().deaths_known) { F().tide_known = true; await say('alan_turnings'); if (F().met_celeste) await say('alan_turnings_celeste'); await S.ensureTideCard(); }
        }, any: 'alan_fail_02' } },
      { name: 'Tide card', rect: [772, 448, 80, 22], at: [810, 640], face: 'n', when: () => lit() && F().tide_wound && !G.has('tidecard') && !F().tidecardTaken,
        look: 'alan_look_tidecard', take: async () => { F().tidecardTaken = true; give('tidecard'); sfx('page'); await say('alan_tide_card'); await S.readTideCard(); await say('alan_tide_today'); } },
      { name: 'Key board', rect: [917, 160, 118, 256], at: [970, 640], face: 'n', when: lit, look: 'narr_look_keyboard',
        take: async () => { if (F().vkeyTaken) return say('alan_fail_take'); F().vkeyTaken = true; give('vkey'); sfx('pickup'); await say('alan_spare'); } },
      { name: 'Shutters', rect: [0, 60, 100, 370], when: lit, look: 'narr_look_shutters' },
      { name: 'Door', rect: [1067, 160, 150, 420], at: [1100, 650], exit: 'map', entry: 'ferreira', look: 'narr_look_tape' },
    ],
    async enter() {
      F().visited_ferreira = true;
      if (!F().ferreira_open) {
        F().ferreira_open = true; G.takeItem('fkey'); sfx('door');
        await say('alan_ferreira_sealed'); await say('narr_ferreira_dark');
      }
    },
    leave() { S.checkCh2(); },
  };

  // the chapter closes in the shop once both threads are done
  // the tide card is essential later (Zé): once the turnings are understood Alan pockets it,
  // and saves that got past the workshop without it get it back from his jacket
  S.ensureTideCard = async function (quiet) {
    if (G.has('tidecard') || F().tidecardTaken || F().ze_believes) return;
    F().tidecardTaken = true; give('tidecard'); sfx('page');
    if (!quiet) await say('alan_tide_card');
  };
  S.checkCh2 = function () { if (F().met_celeste && F().tide_known) F().ch2_ready = true; };
  S.ch2End = async function () {
    if (F().ch2_done) return;
    F().ch2_done = true;
    await say('ines_pull', 'ines_tenth'); await joke('alan_tenth');
    await G.say('narr_ch2_end', { offscreen: true });
    await S.chapter(3, 'narr_ch3_card');
  };
})();
