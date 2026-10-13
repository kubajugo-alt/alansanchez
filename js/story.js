// The Drowned Bell — rooms, cast, items and puzzles (1280x720 painted scenes).
(function () {
  const G = window.Game;
  const F = () => G.flags;
  const say = (...ids) => G.says(...ids);

  // ---------------------------------------------------------------- cast
  // Painted sprite frames (see js/sprites.js); sprites face right and are
  // mirrored for left. `scale` is relative body height.
  const CHARS = {
    alan: { scale: 1, frames: {
      idle: ['alan_side', 'alan_idle2'], talk: ['alan_talk', 'alan_talk2'],
      walk: ['alan_walkA', 'alan_walkDown', 'alan_pass', 'alan_walkUp', 'alan_walkB', 'alan_walkDown', 'alan_pass', 'alan_walkUp'],
      front: 'alan_front', frontWalk: ['alan_front_walk1', 'alan_front', 'alan_front_walk2', 'alan_front'],
      back: 'alan_back', backWalk: ['alan_back_walk1', 'alan_back', 'alan_back_walk2', 'alan_back'],
      poses: { reach: 'alan_reach', read: 'alan_read', ring: 'alan_ring' } } },
    ines: { scale: 0.93, frames: {
      idle: ['ines', 'ines_idle2'], talk: ['ines_talk', 'ines_talk2'], walk: ['ines_walkA', 'ines', 'ines_walkB', 'ines'],
      poses: { free: 'ines_free' },
      sets: { tied: { idle: ['ines_tied', 'ines_tied_struggle'], talk: ['ines_tied_shout', 'ines_tied_struggle'] } } } },
    rui: { scale: 0.96, frames: { idle: ['rui', 'rui_idle2', 'rui_idle3'], talk: ['rui_talk', 'rui_talk2'] } },
    amalia: { scale: 0.9, frames: {
      idle: ['amalia', 'amalia_idle2'], talk: ['amalia_talk', 'amalia_idle2'],
      sets: { sing: { talk: ['amalia_sing1', 'amalia_sing2', 'amalia_sing1', 'amalia_idle2'] } } } },
    tomas: { scale: 0.95, frames: {
      idle: 'tomas', talk: 'tomas_talk',
      loops: { sweep: { frames: ['tomas_sweepL', 'tomas_sweep', 'tomas_sweepR', 'tomas_sweep'], fps: 1.7 } } } },
    tomas_night: { scale: 0.95, frames: { idle: 'tomas_night', talk: 'tomas_night_talk' } },
    lacerda: { scale: 1.0, frames: {
      idle: ['lacerda', 'lacerda_idle2'], talk: ['lacerda_talk', 'lacerda_talk2'],
      walk: ['lacerda_walkA', 'lacerda', 'lacerda_walkB', 'lacerda'] } },
    lacerda_robe: { scale: 1.02, frames: {
      idle: 'robe_idle', talk: ['robe_talk', 'lacerda_robe'],
      poses: { lunge: 'robe_lunge', terror: 'robe_terror', read: 'robe_read' },
      sets: { read: { idle: 'robe_read', talk: ['robe_read', 'robe_talk'] } } } },
  };

  // ---------------------------------------------------------------- items
  const ITEMS = {
    notebook: { name: 'Notebook', look: 'narr_look_notebook' },
    sketch: { name: 'Tile sketch', look: 'narr_look_sketch' },
    coins: { name: 'Escudos', look: 'narr_look_coins' },
    key: { name: 'Small iron key', look: 'narr_look_key' },
    ledger: { name: () => F().decoded ? "Grandfather's ledger (decoded)" : "Grandfather's ledger", look: () => posed('read', () => F().decoded ? say('alan_look_ledger_decoded') : say('narr_look_ledger')) },
    magnifier: { name: 'Magnifying glass', look: 'narr_look_magnifier' },
    ginja: { name: 'Ginjinha', look: 'narr_look_ginja' },
    clapper: { name: 'Bell clapper', look: 'narr_look_clapper' },
  };

  const ROOMS = {};
  // Holds a pose on Alan for the length of an action.
  async function posed(pose, fn) {
    const p = G.player; p.pose = p.visible ? pose : null;
    try { await fn(); } finally { p.pose = null; }
  }
  // Fog drifting past a window, clipped to the panes.
  function windowFog(g, t, rect, rgb, a) {
    g.save(); g.beginPath(); g.rect(...rect); g.clip();
    for (let i = 0; i < 6; i++) {
      const x = rect[0] + ((t * (6 + i * 2) + i * 140) % (rect[2] + 300)) - 150, y = rect[1] + rect[3] * (0.25 + 0.13 * i);
      const gr = g.createRadialGradient(x, y, 0, x, y, 120);
      gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(x - 160, y - 80, 320, 160);
    }
    g.restore();
  }

  // ================================================================ BOOKSHOP
  ROOMS.shop = {
    name: 'Livraria Sanchez', bg: 'shop',
    music: () => F().act3 ? 'tension' : 'fog',
    walk: [[340, 548], [790, 548], [1000, 716], [200, 716]],
    scale: [548, 370, 716, 480],
    floor: 'wood', ambience: 'shop',
    light: { ambient: 'rgb(214,192,165)', base: 0.86, rim: 'rgba(210,225,240,0.22)', rimSide: -1 },
    lights: [
      { x: 630, y: 170, rgb: '215,225,235', power: 0.32, reach: 1200, rim: 0.5, shadow: 0.55, floor: [630, 470], height: 900 }, // the big window
      { x: 175, y: 302, rgb: '255,215,140', kind: 'gas', seed: 1, glow: 90, ga: 0.16, power: 0.3, reach: 650, floor: [175, 600], height: 420 }, // banker's lamp
    ],
    entries: { default: [380, 600, 'w'], street: [880, 600, 'w'] },
    layers: [{ img: 'shop_nomag', x: 174, y: 404, when: () => F().magTaken }],
    animBack(g, t) {
      windowFog(g, t, [428, 32, 410, 282], '235,238,240', 0.16);
      FX.breathe(g, G.bgImage(), [426, 266, 156, 62], t, 0.035, 3.6); // Pessoa, asleep
    },
    anim(g, t) {
      FX.shaft(g, [[420, 30], [850, 30], [860, 716], [380, 716]], '210,220,230', 0.05);
      FX.motes(g, t, 420, 60, 430, 520, 40, '255,240,210');
      if (!F().heardMsg || (F().act3 && !F().heardLacerda)) if (Math.floor(t * 2) % 2 === 0) FX.glow(g, 1062, 381, 14, '255,40,20', 0.9);
    },
    npcs: [
      { id: 'ines', x: 600, y: 585, dir: 'w', name: 'Inês', when: () => !F().act3, look: 'narr_look_ines', talk: talkInes,
        items: {
          sketch: async () => { await say('alan_show_sketch', 'ines_sketch_1', 'ines_sketch_2', 'ines_sketch_3'); F().knowsBrotherhood = true; },
          ledger: () => F().decoded ? say('ines_ledger_decoded') : say('ines_ledger'),
          any: 'alan_def_item',
        } },
    ],
    hotspots: [
      { name: 'Bookshelves', rect: [0, 0, 290, 330], look: 'narr_look_shelves' },
      { name: "Grandfather's desk", rect: [40, 330, 300, 270], at: [380, 600], face: 'w', look: 'narr_look_desk',
        use: () => F().drawerOpen ? say('alan_drawer_empty') : say('alan_drawer_locked'),
        items: { key: async () => { G.takeItem('key'); F().drawerOpen = true; G.giveItem('ledger'); await say('alan_unlock'); } } },
      { name: 'Magnifying glass', rect: [188, 415, 110, 40], at: [380, 600], face: 'w', when: () => !F().magTaken, look: 'narr_look_magnifier',
        take: async () => { F().magTaken = true; G.giveItem('magnifier'); await say('alan_take_magnifier'); } },
      { name: 'Window', rect: [410, 20, 440, 245], look: 'narr_look_window' },
      { name: 'Pessoa the cat', rect: [425, 262, 160, 66], at: [520, 566], face: 'n', look: 'narr_look_cat', talk: 'alan_talk_cat', take: 'alan_take_cat' },
      { name: 'Kettle', rect: [470, 330, 95, 85], look: 'narr_look_kettle' },
      { name: 'Sugar tin', rect: [670, 352, 56, 62], at: [690, 562], face: 'n', look: 'narr_look_tin',
        take: async () => { if (F().tinTaken) return say('alan_def_take'); F().tinTaken = true; G.giveItem('key'); await say('alan_take_tin'); } },
      { name: 'Cash register', rect: [850, 212, 180, 170], at: [820, 566], face: 'e', look: 'narr_look_register', take: takeCoins },
      { name: 'Answering machine', rect: [955, 362, 125, 42], at: [820, 566], face: 'e', look: 'narr_look_machine', use: playMachine },
      { name: 'Newspaper', rect: [1035, 398, 222, 62], at: [880, 610], face: 'e', look: () => say('narr_look_news', 'alan_news'), take: () => say('narr_look_news', 'alan_news') },
      { name: 'Door to the street', rect: [1030, 15, 200, 320], at: [900, 590], exit: 'street', entry: 'shop' },
    ],
    async enter() {
      if (F().clapperTaken && !F().act3) {
        F().act3 = true;
        G.refreshNpcs();
        await G.card('CHAPTER III', 'The Drowned Bell');
        await say('narr_act3_1');
      }
    },
  };
  async function takeCoins() {
    if (F().coinsTaken) return say('alan_register_empty');
    F().coinsTaken = true; G.giveItem('coins'); await say('alan_take_coins');
  }
  async function playMachine() {
    if (F().act3 && !F().heardLacerda) {
      Sound.sfx('beep');
      await G.say('lacerda_msg', { offscreen: true, label: 'Answering machine' });
      F().heardLacerda = true;
      await say('alan_act3');
      return;
    }
    if (!F().heardMsg) {
      Sound.sfx('beep');
      await G.say('rui_msg_1', { offscreen: true, label: 'Answering machine' });
      F().heardMsg = true;
      await say('alan_after_msg');
      return;
    }
    await say('alan_machine_again');
  }
  async function talkInes() {
    await say('ines_hello');
    await G.dialog([
      { line: 'alan_ask_ines_work', once: true, run: () => say('ines_work') },
      { line: 'alan_ask_ines_grandpa', once: true, run: () => say('ines_grandpa') },
      { line: 'alan_show_sketch', silent: true, when: () => G.has('sketch') && !F().knowsBrotherhood, run: async () => { await say('alan_show_sketch', 'ines_sketch_1', 'ines_sketch_2', 'ines_sketch_3'); F().knowsBrotherhood = true; } },
      { label: 'Show her the ledger.', when: () => G.has('ledger'), once: true, run: () => F().decoded ? say('ines_ledger_decoded') : say('ines_ledger') },
      { label: 'Goodbye.', bye: true, run: () => say('ines_bye') },
    ]);
  }

  // ================================================================ STREET
  ROOMS.street = {
    name: 'Alfama', bg: 'street',
    music: () => F().act3 ? 'tension' : 'fog',
    fog: 0.32, fogRGB: '214,218,216',
    walk: [[0, 578], [1280, 600], [1280, 716], [0, 716]],
    scale: [578, 196, 716, 250],
    floor: 'cobble', ambience: 'street',
    light: { ambient: 'rgb(214,214,214)', base: 0.9 },
    lights: [
      { x: 522, y: 190, rgb: '255,220,150', kind: 'gas', seed: 2, glow: 70, ga: 0.35, power: 0.45, reach: 650, floor: [500, 560], height: 380 },
      { x: 1136, y: 318, rgb: '255,200,120', kind: 'flame', seed: 5, glow: 60, ga: 0.35, power: 0.5, reach: 600, floor: [1136, 590], height: 300 },
      { x: 240, y: 430, rgb: '255,210,140', glow: 70, ga: 0.12, power: 0.15, reach: 400, shadow: false }, // shop window
      { x: 720, y: 60, rgb: '225,228,232', power: 0.2, reach: 1400, rim: 0.3, shadow: 0.3, floor: [720, 420], height: 1200 }, // fog-bright sky
    ],
    entries: { default: [545, 640, 's'], shop: [370, 600, 's'], tavern: [1075, 628, 's'], map: [545, 640, 's'] },
    animBack(g, t) {
      const im = G.bgImage();
      [[598, 188, 34, 62, 0], [632, 192, 38, 82, 1.3], [672, 195, 52, 70, 2.1], [726, 190, 72, 66, 0.7], [806, 168, 54, 76, 2.8], [866, 152, 54, 74, 1.9], [926, 120, 46, 86, 3.4]]
        .forEach(([x, y, w, h, ph]) => FX.sway(g, im, [x, y, w, h], t, 2.2, ph)); // laundry in the wind
      g.save(); g.beginPath(); g.rect(470, 0, 470, 150); g.clip();
      FX.birds(g, t, { y0: 30, y1: 120, n: 2, period: 21, color: 'rgba(70,72,78,0.55)', size: 9, x0: 440, x1: 980 }); // gulls in the fog
      g.restore();
    },
    hotspots: [
      { name: 'Old azulejos', rect: [0, 0, 440, 240], look: 'narr_look_azulejo' },
      { name: 'Bookshop window', rect: [30, 320, 250, 230], look: 'narr_look_shelves' },
      { name: 'Street lamp', rect: [455, 140, 95, 410], look: 'narr_look_lamp' },
      { name: 'The Alfama', rect: [600, 90, 300, 440], look: 'narr_look_street' },
      { name: 'Tavern lantern', rect: [1110, 230, 120, 120], look: 'narr_look_tavern_door' },
      { name: 'Livraria Sanchez', rect: [322, 335, 95, 205], at: [368, 595], exit: 'shop', entry: 'street' },
      { name: 'Taberna da Saudade', rect: [1035, 280, 90, 270], at: [1078, 612], exit: 'tavern', entry: 'street', when: () => !F().act3 },
      { name: 'Tram 28 stop', rect: [515, 255, 55, 280], at: [548, 612], exit: 'map', entry: 'street', look: 'narr_look_tram' },
    ],
  };

  // ================================================================ MAP
  const MAP_MARKERS = [
    { id: 'street', x: 990, y: 300, text: 'Alfama · Livraria Sanchez' },
    { id: 'police', x: 560, y: 205, text: 'Polícia Judiciária', when: () => F().heardMsg && !F().clapperTaken },
    { id: 'convent', x: 262, y: 318, text: () => F().act3 ? 'Convento do Carmo · midnight' : 'Convento do Carmo', when: () => (F().songHeard && !F().clapperTaken) || F().heardLacerda },
    { id: 'antiques', x: 410, y: 440, text: 'Antiguidades Lacerda', when: () => F().decoded && !F().clapperTaken },
  ];
  ROOMS.map = {
    name: 'Lisbon', bg: 'map', player: false, vignette: 0.3,
    music: () => F().act3 ? 'tension' : 'fog',
    anim(g, t) {
      for (const m of MAP_MARKERS) {
        if (m.when && !m.when()) continue;
        const p = 0.5 + 0.5 * Math.sin(t * 3 + m.x);
        FX.glow(g, m.x, m.y, 40 + p * 14, '255,120,60', 0.45);
        g.fillStyle = '#7a1408'; g.strokeStyle = '#2a0a04'; g.lineWidth = 3;
        g.beginPath(); g.arc(m.x, m.y, 11, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(m.x, m.y, 4.5, 0, 7); g.fill();
      }
    },
    hotspots: MAP_MARKERS.map(m => ({ name: m.text, rect: [m.x - 30, m.y - 60, 60, 80], when: m.when, exit: m.id, entry: 'map', look: () => G.goRoom(m.id, 'map') })),
    labels: MAP_MARKERS.map(m => ({ x: m.x, y: m.y - 14, text: m.text, when: m.when })),
  };

  // ================================================================ POLICE
  ROOMS.police = {
    name: 'Polícia Judiciária', bg: 'police', music: 'office',
    walk: [[60, 620], [1220, 620], [1280, 716], [0, 716]],
    scale: [606, 440, 716, 490],
    floor: 'tile', ambience: 'office',
    light: { ambient: 'rgb(206,220,196)', base: 0.8, flickerShade: 0.22 },
    lights: [
      { x: 720, y: 18, rgb: '235,248,225', kind: 'tube', seed: 3, glow: 260, ga: 0.09, power: 0.45, reach: 1100, rim: 0.45, floor: [720, 470], height: 900 },
      { x: 915, y: 265, rgb: '205,220,238', power: 0.28, reach: 800, rim: 0.6, shadow: 0.45, floor: [915, 500], height: 600 }, // window
    ],
    entries: { default: [160, 655, 'e'], map: [160, 655, 'e'] },
    animBack(g, t) { windowFog(g, t, [780, 202, 276, 126], '230,232,236', 0.22); },
    anim(g, t) { FX.wisps(g, t, 751, 362, { n: 5, rise: 55, spread: 9, a: 0.12, size: 7, speed: 0.3 }); }, // coffee steam
    npcs: [
      { id: 'rui', x: 990, y: 606, dir: 'w', name: 'Inspector Mendonça', look: 'narr_look_rui', talk: talkRui,
        items: { any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'Corkboard', rect: [275, 95, 355, 230], look: 'narr_look_board' },
      { name: 'Filing cabinet', rect: [1040, 180, 165, 410], look: 'narr_look_cabinet' },
      { name: 'Coffee', rect: [720, 350, 62, 54], look: 'narr_look_coffee' },
      { name: 'Evidence bag', rect: [610, 336, 80, 66], at: [700, 640], face: 'n', look: 'narr_look_evidence',
        take: () => F().ruiMurders ? say('alan_sketch_hint') : say('rui_hands_off'),
        items: { notebook: async () => {
          if (!F().ruiMurders) return say('rui_hands_off');
          if (G.has('sketch')) return say('alan_have_sketch');
          G.giveItem('sketch'); await say('alan_sketch');
        } } },
      { name: 'Door', rect: [70, 40, 120, 510], at: [150, 645], exit: 'map', entry: 'police' },
    ],
  };
  async function talkRui() {
    if (!F().metRui) { F().metRui = true; await say('rui_hello', 'alan_rui_hello'); }
    await G.dialog([
      { line: 'alan_ask_murders', run: async () => { await say('rui_murders_1', 'rui_murders_2'); F().ruiMurders = true; } },
      { line: 'alan_ask_victims', when: () => F().ruiMurders, run: async () => { await say('rui_victims_1', 'rui_victims_2', 'alan_victims', 'rui_victims_3'); F().knowsList = true; } },
      { line: 'alan_ask_fog', once: true, run: () => say('rui_fog') },
      { label: 'Goodbye.', bye: true, run: () => say('rui_bye') },
    ]);
  }

  // ================================================================ TAVERN
  ROOMS.tavern = {
    name: 'Taberna da Saudade', bg: 'tavern', music: 'fado',
    // people walk in front of the table and chair, never behind them
    walk: [[0, 614], [1280, 614], [1280, 716], [0, 716]],
    scale: [568, 385, 716, 450],
    floor: 'wood', ambience: 'tavern',
    light: { ambient: 'rgb(200,142,98)', base: 0.72, flickerShade: 0.3 },
    lights: [
      { x: 453, y: 180, rgb: '255,180,90', kind: 'flame', seed: 1, glow: 120, ga: 0.28, power: 0.6, reach: 800, floor: [453, 560], height: 420 },
      { x: 985, y: 152, rgb: '255,180,90', kind: 'flame', seed: 3, glow: 120, ga: 0.28, power: 0.6, reach: 800, floor: [985, 590], height: 460 },
      { x: 790, y: 380, rgb: '255,190,100', kind: 'candle', seed: 7, glow: 60, ga: 0.35, power: 0.35, reach: 420, floor: [790, 600], height: 220 },
    ],
    entries: { default: [140, 650, 'e'], street: [140, 650, 'e'] },
    anim(g, t) {
      FX.wisps(g, t, 790, 366, { n: 4, rise: 60, spread: 6, rgb: '200,190,180', a: 0.08, size: 4, speed: 0.25 }); // candle smoke
      FX.motes(g, t, 360, 120, 700, 300, 26, '255,210,150');
    },
    npcs: [
      { id: 'amalia', x: 1000, y: 610, dir: 'w', name: 'Dona Amália', look: 'narr_look_amalia', talk: talkAmalia,
        items: { ginja: giveGinja, any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'Door', rect: [20, 100, 215, 450], at: [140, 640], exit: 'street', entry: 'tavern' },
      { name: 'Fado poster', rect: [265, 130, 135, 210], look: 'narr_look_tavern' },
      { name: 'Old photograph', rect: [548, 178, 103, 100], at: [600, 625], face: 'n', look: async () => { await say('narr_look_photo', 'alan_photo'); F().sawPhoto = true; } },
      { name: 'Guitarra portuguesa', rect: [722, 135, 80, 210], look: 'narr_look_guitar' },
      { name: 'Bottles of ginjinha', rect: [960, 100, 320, 260], at: [1150, 660], face: 'n', look: 'narr_look_bottles',
        take: () => G.has('coins') ? buyGinja() : say('alan_take_bottle'), items: { coins: buyGinja } },
      { name: 'Bar', rect: [880, 362, 400, 220], at: [1150, 660], face: 'n', look: 'narr_look_bottles', items: { coins: buyGinja } },
    ],
  };
  async function buyGinja() {
    if (G.has('ginja') || F().songHeard) return say('alan_have_ginja');
    if (!G.has('coins')) return say('alan_take_bottle');
    G.takeItem('coins'); G.giveItem('ginja'); await say('alan_buy');
  }
  async function giveGinja() {
    if (!F().askedSong) { await say('alan_def_item'); return; }
    G.takeItem('ginja');
    await say('alan_give_ginja', 'amalia_ginja');
    Sound.playMusic(null);
    const am = G.npc('amalia');
    if (am) am.set = 'sing';
    await say('amalia_sing_1', 'amalia_sing_2');
    if (am) am.set = null;
    Sound.playMusic('fado');
    await say('amalia_after_song');
    F().songHeard = true;
    await G.card('CHAPTER II', 'The Weeping Stone');
  }
  async function talkAmalia() {
    await say('amalia_hello');
    await G.dialog([
      { line: 'alan_ask_amalia_who', once: true, run: () => say('amalia_who') },
      { line: 'alan_ask_amalia_song', when: () => F().knowsBrotherhood && !F().songHeard, run: async () => { await say('amalia_song_no'); F().askedSong = true; } },
      { label: 'Offer her a ginjinha.', when: () => G.has('ginja') && F().askedSong && !F().songHeard, bye: true, run: giveGinja },
      { label: 'Could you sing it again?', when: () => F().songHeard, once: true, run: () => say('amalia_sung') },
      { label: 'Goodbye.', bye: true, run: () => say('amalia_bye') },
    ]);
  }

  // ================================================================ CONVENT
  const CONVENT_WALK = [[230, 560], [1050, 560], [1280, 640], [1280, 716], [0, 716], [0, 640]];
  ROOMS.convent = {
    name: 'Convento do Carmo', bg: 'convent', music: 'church',
    fog: 0.22, fogRGB: '220,214,226',
    walk: CONVENT_WALK, scale: [560, 230, 716, 360],
    floor: 'stone', ambience: 'convent', skyMask: 'convent_sky',
    light: { ambient: 'rgb(218,212,224)', base: 0.9, rim: 'rgba(255,240,220,0.18)', rimSide: 1 },
    lights: [{ x: 780, y: 120, rgb: '255,242,225', power: 0.3, reach: 1400, rim: 0.4, shadow: 0.45, floor: [780, 470], height: 900 }],
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'] },
    animBack(g, t) {
      FX.masked(g, G.mask(), m => {
        FX.drawClouds(m, dayClouds, t, 9, -20, 0.9);
        FX.birds(m, t, { y0: 40, y1: 220, n: 4, period: 17, color: 'rgba(60,55,70,0.75)', size: 8 });
      });
    },
    anim(g, t) {
      FX.shaft(g, [[740, 100], [830, 100], [900, 560], [680, 560]], '255,245,230', 0.06);
      FX.leaves(g, t, 600, 690, 23);
    },
    npcs: [
      { id: 'tomas', x: 640, y: 590, dir: 'w', loop: 'sweep', name: 'Father Tomás', look: 'narr_look_tomas', talk: talkTomas,
        items: { ledger: showLedgerTomas, any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'Ruined arches', rect: [320, 0, 330, 500], look: 'narr_look_arches' },
      { name: 'Great window', rect: [700, 80, 170, 400], look: 'narr_look_convent' },
      { name: 'Weeping stone', rect: [40, 125, 190, 345], at: [255, 620], face: 'w', look: 'narr_look_stone',
        use: () => F().stoneRead ? openCipher() : say('alan_stone_nomag'),
        items: {
          magnifier: async () => { await say('alan_stone_mag'); F().stoneRead = true; },
          ledger: async () => { if (!F().stoneRead) return say('alan_stone_nomag'); if (F().decoded) return say('alan_look_ledger_decoded'); await openCipher(); },
        } },
      { name: 'Iron grate', rect: [790, 590, 420, 110], at: [760, 650], face: 'e', look: 'narr_look_grate', use: 'alan_grate' },
      { name: 'Way out', rect: [0, 590, 60, 126], at: [30, 672], exit: 'map', entry: 'convent' },
    ],
    async enter() { if (F().act3) return G.goRoom('convent_night', 'map', { instant: true }); },
  };
  async function talkTomas() {
    await say('tomas_hello');
    await G.dialog([
      { line: 'alan_ask_crypt', once: true, run: () => say('tomas_crypt') },
      { line: 'alan_show_ledger', silent: true, when: () => G.has('ledger') && !F().tomasLedger, run: showLedgerTomas, bye: true },
      { line: 'alan_ask_tomas_fog', once: true, run: () => say('tomas_fog', 'alan_fog_count', 'tomas_fog_2') },
      { label: 'Goodbye.', bye: true, run: () => say('tomas_bye') },
    ]);
  }
  async function showLedgerTomas() { await say('alan_show_ledger', 'tomas_ledger_1', 'tomas_ledger_2'); F().tomasLedger = true; }

  const dayClouds = FX.makeClouds(11, '255,250,255', 24);
  const nightClouds = FX.makeClouds(23, '40,48,80', 30);
  const MOON = [800, 168];
  // the moon dims as the drawn clouds pass in front of it
  const moonLevel = t => 1 - 0.75 * nightClouds.alphaAt(MOON[0] + FX.cloudOffset(nightClouds, t, 7), MOON[1] + 20);

  // --- the cipher wheel puzzle: shift 7, from Amália's fado
  const PLAIN = 'THE BROTHERHOOD RANG THE DROWNED BELL';
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shiftStr = (s, k) => s.replace(/[A-Z]/g, c => ABC[(ABC.indexOf(c) + k + 26) % 26]);
  const CIPHER = shiftStr(PLAIN, 7);
  function openCipher() {
    if (!G.has('ledger')) return say('alan_stone_mag');
    if (F().decoded) return say('alan_look_ledger_decoded');
    return new Promise(resolve => {
      const m = document.getElementById('cipher');
      let k = 0;
      const upd = () => {
        m.querySelector('.outer').textContent = ABC;
        m.querySelector('.inner').textContent = shiftStr(ABC, k);
        m.querySelector('.ct').textContent = CIPHER;
        m.querySelector('.pt').textContent = shiftStr(CIPHER, -k);
        m.querySelector('.shift').textContent = k;
      };
      upd();
      m.querySelector('.left').onclick = () => { k = (k + 25) % 26; Sound.sfx('click'); upd(); };
      m.querySelector('.right').onclick = () => { k = (k + 1) % 26; Sound.sfx('click'); upd(); };
      const close = async ok => {
        G.showModal('cipher', false);
        if (ok === null) return resolve();
        if (!ok) { await say('alan_cipher_wrong'); return resolve(); }
        F().decoded = true;
        Sound.sfx('pickup');
        await posed('read', () => say('alan_decode_1', 'alan_decode_2'));
        await say('alan_decode_3');
        resolve();
      };
      m.querySelector('.done').onclick = () => close(k === 7);
      m.querySelector('.cancel').onclick = () => close(null);
      G.showModal('cipher', true);
    });
  }

  ROOMS.convent_night = {
    name: 'Convento do Carmo — midnight', bg: 'convent_night', music: 'tension',
    fog: 0.3, fogRGB: '120,135,180',
    walk: CONVENT_WALK, scale: [560, 230, 716, 360],
    floor: 'stone', ambience: 'night', skyMask: 'convent_night_sky',
    light: { ambient: 'rgb(120,135,185)', base: 0.72 },
    lights: [
      { x: MOON[0], y: MOON[1], rgb: '200,215,255', level: moonLevel, glow: 90, ga: 0.2, power: 0.35, reach: 1500, rim: 0.6, shadow: 0.5, floor: [800, 470], height: 900 },
      { x: 990, y: 640, rgb: '90,255,160', kind: 'pulse', seed: 0, glow: 175, ga: 0.22, power: 0.4, reach: 650, rim: 0.7, floor: [990, 640], height: 200 },
      { actor: 'tomas', off: [0.3, -0.43], rgb: '255,190,110', kind: 'flame', seed: 9, glow: 75, ga: 0.38, power: 0.55, reach: 520, rim: 0.7, height: 160 }, // his lantern
    ],
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'] },
    animBack(g, t) { FX.masked(g, G.mask(), m => FX.drawClouds(m, nightClouds, t, 7, 0, 1)); },
    anim(g, t) { for (let i = 0; i < 3; i++) FX.wisps(g, t + i * 1.3, 900 + i * 90, 640, { n: 5, rise: 120, spread: 30, rgb: '120,255,180', a: 0.06, size: 26, speed: 0.12 }); }, // mist from the cistern
    npcs: [{ id: 'tomas', ch: 'tomas_night', x: 430, y: 600, dir: 'e', name: 'Father Tomás', look: 'narr_look_tomas', talk: () => say('tomas_night') }],
    hotspots: [
      { name: 'Weeping stone', rect: [40, 125, 190, 345], look: 'narr_look_stone' },
      { name: 'Ruined arches', rect: [320, 0, 330, 500], look: 'narr_look_arches' },
      { name: 'Open grate', rect: [790, 585, 420, 120], at: [760, 645], exit: 'cistern', entry: 'convent', look: 'narr_look_grate' },
      { name: 'Way out', rect: [0, 590, 60, 126], at: [30, 672], exit: 'map', entry: 'convent' },
    ],
    async enter() { if (!F().tomasNight) { F().tomasNight = true; await say('tomas_night'); } },
  };

  // ================================================================ ANTIQUES
  ROOMS.antiques = {
    name: 'Antiguidades Lacerda', bg: 'antiques', music: 'antiques',
    walk: [[0, 650], [460, 555], [1280, 555], [1280, 716], [0, 716]],
    scale: [555, 330, 716, 410],
    floor: 'wood', ambience: 'clocks',
    light: { ambient: 'rgb(205,172,128)', base: 0.8, rim: 'rgba(255,200,120,0.18)', rimSide: -1 },
    lights: [
      { x: 730, y: 150, rgb: '255,210,140', glow: 120, ga: 0.12, power: 0.38, reach: 900, floor: [730, 530], height: 600 },
      { x: 765, y: 375, rgb: '120,255,180', kind: 'pulse', seed: 1, glow: 50, ga: 0.08, power: 0.08, reach: 300, shadow: false, when: () => !F().clapperTaken },
    ],
    // the counter, traced along its painted edges, and the brass box standing on it
    occluders: [{ y: 640, polys: [
      [[0, 362], [70, 356], [436, 356], [447, 366], [443, 382], [437, 384], [437, 545], [428, 551], [0, 636]],
      [[150, 334], [250, 334], [252, 368], [148, 368]],
    ] }],
    layers: [
      { img: 'antiques_clock', x: 539, y: 218 },
      { img: 'antiques_weights', x: 543, y: 228 },
      { img: 'antiques_pendulum', x: 544, y: 224, pivot: [571, 228], swing: t => 2.4 * Math.sin(t * Math.PI) },
      { img: 'antiques_case', x: 686, y: 291, when: () => F().clapperTaken },
    ],
    entries: { default: [640, 690, 'n'], map: [640, 690, 'n'] },
    anim(g, t) { FX.motes(g, t, 560, 80, 380, 420, 24, '255,220,170'); },
    npcs: [
      { id: 'lacerda', x: 250, y: 545, h: 385, dir: 'e', at: [540, 615], name: 'Senhor Lacerda', look: 'narr_look_lacerda', talk: talkLacerda,
        items: { ledger: () => say('lacerda_brother'), any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'Clocks', rect: [0, 0, 480, 320], look: 'narr_look_clocks' },
      { name: 'Grandfather clock', rect: [500, 10, 140, 510], look: 'narr_look_clocks' },
      { name: "Ship's bell", rect: [680, 70, 140, 200], look: 'narr_look_antiques' },
      { name: 'Curios', rect: [880, 20, 240, 280], look: 'narr_look_antiques' },
      { name: 'Music box', rect: [928, 318, 130, 125], at: [990, 600], face: 'n', look: async () => { await say('narr_look_musicbox'); F().sawBox = true; } },
      { name: 'Display case', rect: [655, 285, 215, 240], at: [760, 605], face: 'n', look: () => F().clapperTaken ? say('narr_look_antiques') : say('narr_look_case'), take: takeClapper },
      { name: 'Leave the shop', rect: [0, 690, 1280, 30], at: [640, 712], exit: 'map', entry: 'antiques' },
    ],
  };
  async function takeClapper() {
    if (F().clapperTaken) return say('alan_def_take');
    const lac = G.npc('lacerda');
    if (lac && lac.visible) return say('lacerda_hands');
    F().clapperTaken = true;
    G.giveItem('clapper');
    await say('alan_take_clapper');
    lac.visible = true; lac.h = null; lac.x = 1190; lac.y = 575;
    await lac.walkTo(980, 600);
    lac.dir = 'w';
    await say('lacerda_back');
    await G.player.walkTo(640, 712);
    await G.goRoom('map', 'antiques');
  }
  async function talkLacerda() {
    await say('lacerda_hello');
    await G.dialog([
      { line: 'alan_lac_biz', once: true, run: () => say('lacerda_biz') },
      { line: 'alan_lac_clapper', once: true, run: () => say('lacerda_clapper') },
      { line: 'alan_lac_brother', once: true, when: () => F().decoded, run: () => say('lacerda_brother') },
      { line: 'alan_lac_box', when: () => F().sawBox, bye: true, run: async () => {
        await say('lacerda_box');
        const lac = G.npc('lacerda');
        lac.h = null;
        await lac.walkTo(470, 565); await lac.walkTo(1190, 565);
        lac.visible = false;
      } },
      { label: 'Goodbye.', bye: true, run: () => say('lacerda_bye') },
    ]);
  }

  // ================================================================ CISTERN
  ROOMS.cistern = {
    name: 'The Cistern', bg: 'cistern', noSave: true,
    music: () => F().won ? 'dawn' : 'tension',
    fog: 0.16, fogRGB: '90,140,120',
    walk: [[0, 562], [960, 562], [1280, 640], [1280, 716], [0, 716]],
    scale: [562, 300, 716, 375],
    floor: 'wet', ambience: 'cistern',
    light: { ambient: 'rgb(150,165,135)', base: 0.62, flickerShade: 0.32 },
    lights: [
      { x: 102, y: 205, rgb: '255,150,60', kind: 'torch', seed: 2, glow: 150, ga: 0.35, power: 0.75, reach: 1150, rim: 0.7, floor: [100, 560], height: 420 },
      { x: 1215, y: 250, rgb: '255,150,60', kind: 'torch', seed: 4, glow: 120, ga: 0.3, power: 0.6, reach: 950, rim: 0.7, floor: [1215, 560], height: 380 },
      { x: 650, y: 470, rgb: '110,255,170', kind: 'pulse', seed: 2, power: 0.22, reach: 700, rim: 0.5, shadow: false },
    ],
    layers: [
      { img: 'cistern_plate', x: 518, y: 0 },
      { img: 'cistern_bell', x: 527, y: 0, pivot: [655, 0], swing: t => F().ringing ? 2.6 * Math.sin(t * 2.3) : 0.45 * Math.sin(t * 0.6) },
    ],
    entries: { default: [130, 640, 'e'], convent: [130, 640, 'e'] },
    anim(g, t) {
      FX.water(g, t, 160, 400, 850, 140, '120,255,170');
      FX.drips(g, t, [[330, 470, 120, 4.3], [940, 505, 150, 5.7], [470, 440, 140, 6.9]], '170,255,210');
      FX.embers(g, t, 104, 175, 7); FX.embers(g, t + 3, 1216, 225, 6);
      if (F().sinkAt) FX.drips(g, t, [[F().sinkAt[0], F().sinkAt[1], F().sinkAt[1] - 1, 1.2]], '170,255,210');
      if (F().ringing) {
        for (let i = 0; i < 3; i++) {
          const r = ((t * 220) + i * 160) % 480;
          g.strokeStyle = `rgba(150,255,210,${0.5 * (1 - r / 480)})`; g.lineWidth = 3;
          g.beginPath(); g.ellipse(655, 300, r, r * 0.45, 0, 0, Math.PI * 2); g.stroke();
        }
      }
      if (F().won) { g.fillStyle = 'rgba(255,200,140,0.08)'; g.fillRect(0, 0, 1280, 720); }
    },
    npcs: [
      { id: 'lacerda', ch: 'lacerda_robe', x: 800, y: 598, dir: 'w', fixedDir: true, set: () => F().distracted ? 'read' : null, name: 'Lacerda', when: () => !F().won,
        look: 'narr_look_lacerda', talk: () => say('alan_fin_talk', 'lacerda_fin_talk'), take: () => die(),
        items: {
          ledger: async () => { G.takeItem('ledger'); await say('alan_give_ledger'); G.npc('lacerda').set = 'read'; await say('lacerda_ledger'); F().distracted = true; },
          clapper: () => die(), any: 'alan_def_item',
        } },
      { id: 'ines', x: 1085, y: 628, dir: 'w', fixedDir: true, set: 'tied', name: 'Inês',
        look: 'narr_look_ines', talk: () => say('ines_fin_1'), take: () => die(), items: { any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'The Drowned Bell', rect: [530, 90, 250, 310], at: [650, 615], face: 'n', look: 'narr_look_bell',
        use: () => say('alan_bell_need'),
        items: { clapper: async () => { if (!F().distracted) return die(); await ringBell(); } } },
      { name: 'Black water', rect: [160, 395, 850, 150], look: 'narr_look_cistern' },
    ],
    async enter() {
      if (F().finaleIntro) return;
      F().finaleIntro = true;
      await G.player.walkTo(330, 640);
      G.player.dir = 'e';
      await say('lacerda_fin_1', 'alan_fin_1', 'lacerda_fin_2', 'ines_fin_1', 'lacerda_fin_3');
      G.checkpoint();
    },
  };
  async function die() {
    await G.busy(async () => {
      const lac = G.npc('lacerda');
      if (lac) { lac.set = null; lac.pose = 'lunge'; }
      await say('lacerda_death');
      Sound.sfx('splash');
      await G.fade(true);
      document.querySelector('#death .msg').textContent = LINES.narr_death[1];
      G.showModal('death', true);
      Sound.playVoice('narr_death');
    });
  }
  document.getElementById('btn-retry').onclick = async () => {
    Sound.stopVoice();
    G.showModal('death', false);
    const cp = G.flags._checkpoint;
    await G.loadSave(cp);
    G.flags._checkpoint = cp;
    await G.fade(false);
  };
  async function ringBell() {
    G.takeItem('clapper');
    const p = G.player, lac = G.npc('lacerda'), ines = G.npc('ines');
    p.pose = 'ring';
    await say('alan_ring');
    F().ringing = true;
    Sound.playMusic(null);
    Sound.sfx('unring');
    await say('narr_ring');
    p.pose = null;
    lac.set = null; lac.pose = 'terror';
    await say('lacerda_scream');
    // he staggers back to the water's edge, and the water takes him
    await lac.walkTo(835, 550);
    Sound.sfx('splash');
    F().sinkAt = [lac.x, lac.y];
    for (let k = 0; k <= 1; k += window.FAST ? 0.5 : 0.025) { lac.sink = k; await G.wait(40); }
    lac.visible = false;
    await say('narr_end_1');
    F().ringing = false; F().sinkAt = null; F().won = true;
    Sound.playMusic('dawn');
    // Inês shrugs off the loosened ropes and comes to him
    ines.pose = 'free';
    await G.wait(window.FAST ? 40 : 1300);
    ines.pose = null; ines.set = null; ines.def.fixedDir = false;
    await ines.walkTo(p.x + 130, p.y + 4);
    ines.dir = 'w'; p.dir = 'e';
    await say('ines_end', 'alan_end');
    await G.fade(true);
    await G.card('', 'The tenth morning', 2400);
    G.showModal('ending', true);
    await G.fade(false);
    await say('narr_end_2');
    try { localStorage.removeItem('drowned-bell-save-v2'); } catch (e) { /* ignore */ }
  }
  document.getElementById('btn-again').onclick = () => location.reload();

  // ================================================================ start
  async function newGame() {
    await G.card('CHAPTER I', 'The Fog');
    G.giveItem('notebook', true);
    await G.goRoom('shop', null, { noEnter: true, pos: [380, 600, 'w'] });
    await G.busy(async () => {
      await G.wait(500);
      await say('narr_intro_1', 'narr_intro_2', 'alan_intro_1');
      G.player.dir = 'e';
      await say('ines_intro_1', 'alan_intro_2', 'ines_intro_2');
    });
    G.autosave();
  }

  window.Story = { newGame };
  document.getElementById('btn-new').onclick = () => G.begin(true);
  document.getElementById('btn-continue').onclick = () => G.begin(false);
  G.init(CHARS, ITEMS, ROOMS, window.SPRITES);
})();
