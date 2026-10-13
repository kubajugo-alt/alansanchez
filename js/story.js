// The Drowned Bell — rooms, characters, items and puzzles.
(function () {
  const G = window.Game;
  const F = () => G.flags;
  const say = (...ids) => G.says(...ids);
  const { rect, px, glow, disc, line } = Art;

  // ---------------------------------------------------------------- cast
  const CHARS = {
    alan: { id: 'alan', skin: '#c8956a', hair: '#2a1a12', hairStyle: 'wavy', top: '#6a4022', shirt: '#e8e4d8', legs: '#34486a', shoes: '#2a1a10', belt: '#1a1008', stubble: '#8a6448' },
    ines: { id: 'ines', skin: '#d8a882', hair: '#1a1010', hairStyle: 'bob', top: '#9a2a2a', shirt: '#f0e8d8', legs: '#2a2a3a', shoes: '#1a1010' },
    rui: { id: 'rui', skin: '#c89a78', hair: '#8a8a8a', hairStyle: 'bald', top: '#5a5e62', shirt: '#e0e0d8', tie: '#6a1a1a', legs: '#4a4e52', shoes: '#1a1a1a', mustache: '#5a5a5a', belt: '#1a1a1a' },
    amalia: { id: 'amalia', skin: '#d0a888', hair: '#b8b4b0', hairStyle: 'bun', top: '#1a1418', shawl: '#2a1a2a', robe: true, shoes: '#0a0a0a' },
    tomas: { id: 'tomas', skin: '#d8b090', hair: '#e8e8e0', hairStyle: 'short', top: '#16161a', robe: true, shoes: '#0a0a0a', collar: true },
    lacerda: { id: 'lacerda', skin: '#e0b898', hair: '#d0d0d8', hairStyle: 'slick', top: '#d8d0b8', shirt: '#6a1a2a', legs: '#c8c0a8', shoes: '#5a3a1a', belt: '#5a3a1a' },
    lacerda_robe: { id: 'lacerda_robe', skin: '#e0b898', hair: '#d0d0d8', hairStyle: 'slick', top: '#1a0c10', robe: true, shoes: '#0a0a0a', shawl: '#5a1020' },
  };

  // ---------------------------------------------------------------- items
  const ITEMS = {
    notebook: { name: 'notebook', look: 'narr_look_notebook' },
    sketch: { name: 'tile sketch', look: 'narr_look_sketch' },
    coins: { name: 'escudos', look: 'narr_look_coins' },
    key: { name: 'small key', look: 'narr_look_key' },
    ledger: { name: () => F().decoded ? "grandfather's ledger (decoded)" : "grandfather's ledger", look: () => F().decoded ? say('alan_look_ledger_decoded') : say('narr_look_ledger') },
    magnifier: { name: 'magnifying glass', look: 'narr_look_magnifier' },
    ginja: { name: 'ginjinha', look: 'narr_look_ginja' },
    clapper: { name: 'bell clapper', look: 'narr_look_clapper' },
  };

  // ---------------------------------------------------------------- helpers
  const BLINK = (g, t, x, y) => { if (Math.floor(t * 2) % 2 === 0) { rect(g, x, y, 2, 1, '#ff3020'); glow(g, x + 1, y, 3, '#ff3020', 0.5); } };
  function flicker(g, t, x, y, r, col) { const f = 0.25 + 0.08 * Math.sin(t * 13) + 0.05 * Math.sin(t * 31); glow(g, x, y, r, col, f); }

  // Cat sleeping on the windowsill (breathing).
  function drawCat(g, t) {
    const b = Math.sin(t * 2) > 0 ? 1 : 0;
    rect(g, 146, 61 - b, 16, 5 + b, '#c87a30'); rect(g, 146, 61 - b, 16, 1, '#e09a50');
    rect(g, 158, 59, 6, 6, '#c87a30'); px(g, 158, 58, '#c87a30'); px(g, 163, 58, '#c87a30');
    rect(g, 160, 62, 1, 1, '#3a2010'); rect(g, 162, 62, 1, 1, '#3a2010');
    rect(g, 141, 64, 6, 2, '#c87a30');
    for (let i = 0; i < 3; i++) rect(g, 149 + i * 4, 62 - b, 1, 3, '#a05a20');
  }

  // ---------------------------------------------------------------- rooms
  const ROOMS = {};

  ROOMS.shop = {
    name: 'Livraria Sanchez',
    draw: Art.BG.shop,
    music: () => F().act3 ? 'tension' : 'fog',
    fog: 0.12, fogColor: 'rgba(200,190,170,A)',
    walk: [[10, 106], [310, 106], [318, 148], [2, 148]],
    scale: [106, 0.86, 148, 1],
    entries: { default: [50, 112, 'n'], street: [288, 114, 'w'] },
    anim(g, t) {
      if (!F().heardMsg || (F().act3 && !F().heardLacerda)) BLINK(g, t, 205, 70);
      drawCat(g, t);
      if (!F().drawerOpen) { /* drawer closed */ } else { rect(g, 12, 95, 36, 7, '#2a180e'); rect(g, 10, 101, 40, 3, '#5a3820'); }
      if (!F().tinTaken) { /* drawn in bg */ }
      if (G.has('magnifier') || F().magTaken) { rect(g, 64, 78, 14, 4, '#5a3820'); }
      if (F().act3) { rect(g, 128, 77, 4, 3, '#5a3820'); rect(g, 126, 80, 6, 1, '#d8d0b8'); } // knocked mug
    },
    npcs: [
      { id: 'ines', x: 214, y: 114, dir: 'w', name: 'Inês', when: () => !F().act3,
        look: 'narr_look_ines',
        talk: talkInes,
        items: {
          sketch: async () => { await say('alan_show_sketch', 'ines_sketch_1', 'ines_sketch_2', 'ines_sketch_3'); F().knowsBrotherhood = true; },
          ledger: () => F().decoded ? say('ines_ledger_decoded') : say('ines_ledger'),
          any: 'alan_def_item',
        } },
    ],
    hotspots: [
      { name: 'bookshelves', rect: [4, 10, 94, 66], look: 'narr_look_shelves' },
      { name: "grandfather's desk", rect: [6, 82, 92, 22], at: [45, 110], face: 'n', look: 'narr_look_desk',
        use: async () => { if (F().drawerOpen) await say('alan_drawer_empty'); else await say('alan_drawer_locked'); },
        take: async () => { if (F().drawerOpen) await say('alan_drawer_empty'); else await say('alan_drawer_locked'); },
        items: { key: async () => { G.takeItem('key'); F().drawerOpen = true; G.giveItem('ledger'); await say('alan_unlock'); } } },
      { name: 'magnifying glass', rect: [62, 75, 16, 8], at: [70, 110], face: 'n', when: () => !F().magTaken, look: 'narr_look_magnifier',
        take: async () => { F().magTaken = true; G.giveItem('magnifier'); await say('alan_take_magnifier'); } },
      { name: 'window', rect: [110, 16, 64, 50], look: 'narr_look_window' },
      { name: 'Pessoa the cat', rect: [140, 56, 26, 12], at: [154, 110], face: 'n', look: 'narr_look_cat', talk: 'alan_talk_cat', take: 'alan_take_cat' },
      { name: 'kettle', rect: [112, 70, 24, 10], look: 'narr_look_kettle' },
      { name: 'sugar tin', rect: [158, 70, 12, 10], at: [164, 110], face: 'n', look: 'narr_look_tin',
        take: async () => { if (F().tinTaken) return say('alan_def_take'); F().tinTaken = true; G.giveItem('key'); await say('alan_take_tin'); },
        use: async () => { if (F().tinTaken) return say('alan_def_use'); F().tinTaken = true; G.giveItem('key'); await say('alan_take_tin'); } },
      { name: 'cash register', rect: [234, 54, 26, 20], at: [246, 110], face: 'n', look: 'narr_look_register',
        take: takeCoins, use: takeCoins },
      { name: 'answering machine', rect: [192, 66, 18, 9], at: [200, 110], face: 'n', look: 'narr_look_machine',
        use: playMachine, take: 'alan_def_take' },
      { name: 'newspaper', rect: [211, 68, 18, 7], at: [220, 110], face: 'n', look: async () => { await say('narr_look_news', 'alan_news'); } ,
        take: async () => { await say('narr_look_news', 'alan_news'); } },
      { name: 'door to the street', rect: [270, 22, 38, 84], at: [288, 112], exit: 'street', entry: 'shop' },
    ],
    async enter(from) {
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

  ROOMS.street = {
    name: 'Alfama',
    draw: Art.BG.street,
    music: () => F().act3 ? 'tension' : 'fog',
    fog: 0.55,
    walk: [[0, 120], [320, 120], [320, 148], [0, 148]],
    scale: [120, 0.88, 148, 1],
    entries: { default: [170, 134, 's'], shop: [70, 126, 's'], tavern: [263, 126, 's'], map: [172, 136, 's'] },
    anim(g, t) {
      glow(g, 101, 38, 14, '#ffe8a0', 0.25 + 0.03 * Math.sin(t * 3));
      // laundry sway
      const s = Math.round(Math.sin(t * 1.3));
      rect(g, 140, 31 + s, 8, 1, '#c8c8c0');
    },
    hotspots: [
      { name: 'old azulejos', rect: [0, 62, 12, 56], look: 'narr_look_azulejo' },
      { name: 'the Alfama', rect: [118, 30, 92, 80], look: 'narr_look_street' },
      { name: 'street lamp', rect: [94, 32, 12, 86], look: 'narr_look_lamp' },
      { name: 'Livraria Sanchez', rect: [56, 68, 28, 50], at: [70, 124], exit: 'shop', entry: 'street', look: 'narr_look_shelves' },
      { name: 'Taberna da Saudade', rect: [246, 60, 34, 58], at: [263, 124], exit: 'tavern', entry: 'street', look: 'narr_look_tavern_door', when: () => !F().act3 },
      { name: 'Tram 28 stop', rect: [158, 42, 22, 76], at: [172, 128], look: 'narr_look_tram',
        use: tram, take: tram, talk: tram, walkUse: true },
      { name: 'old azulejos', rect: [214, 72, 30, 46], look: 'narr_look_azulejo' },
    ],
  };
  async function tram() { Sound.sfx('tram'); await G.goRoom('map', 'street'); }
  // walking to the tram stop also boards it
  ROOMS.street.hotspots.find(h => h.name === 'Tram 28 stop').exit = 'map';

  ROOMS.map = {
    name: 'Map of Lisbon', player: false, noSave: false,
    draw: Art.BG.map, music: () => F().act3 ? 'tension' : 'fog',
    anim(g, t) {
      for (const m of MAP_MARKERS) {
        if (m.when && !m.when()) continue;
        const p = Math.floor(t * 3) % 2;
        disc(g, m.x, m.y, 4 + p, '#8a1a1a'); disc(g, m.x, m.y, 2, '#e8c060');
      }
    },
    hotspots: [],
    labels: [],
  };
  const MAP_MARKERS = [
    { id: 'street', x: 236, y: 64, text: 'Alfama — Livraria Sanchez', entry: 'map' },
    { id: 'police', x: 150, y: 28, text: 'Polícia Judiciária', entry: 'map', when: () => F().heardMsg && !F().clapperTaken },
    { id: 'convent', x: 112, y: 58, text: () => F().act3 ? 'Convento do Carmo (midnight)' : 'Convento do Carmo', entry: 'map', when: () => (F().songHeard && !F().clapperTaken) || F().heardLacerda },
    { id: 'antiques', x: 90, y: 82, text: 'Antiguidades Lacerda', entry: 'map', when: () => F().decoded && !F().clapperTaken },
  ];
  for (const m of MAP_MARKERS) {
    ROOMS.map.hotspots.push({
      name: () => typeof m.text === 'function' ? m.text() : m.text, rect: [m.x - 10, m.y - 10, 20, 20], when: m.when,
      exit: m.id, entry: 'map', look: null,
    });
    ROOMS.map.labels.push({ x: m.x, y: m.y - 7, get text() { return typeof m.text === 'function' ? m.text() : m.text; }, when: m.when });
  }
  ROOMS.map.hotspots.forEach(h => { h.look = async () => { await G.goRoom(h.exit, 'map'); }; });
  ROOMS.map.enter = async () => G.renderLabels();

  ROOMS.police = {
    name: 'Polícia Judiciária',
    draw: Art.BG.police,
    fgDraw: g => {
      rect(g, 110, 86, 120, 6, '#6a4a2a'); rect(g, 114, 92, 112, 22, '#4a3420'); rect(g, 120, 96, 30, 14, '#3e2a18'); rect(g, 190, 96, 30, 14, '#3e2a18');
      rect(g, 118, 78, 22, 8, '#2a2a2a'); rect(g, 120, 76, 18, 3, '#3a3a3a');
      rect(g, 146, 81, 18, 5, '#e8e4d8');
      rect(g, 170, 80, 10, 6, '#c8c8f0'); rect(g, 171, 81, 8, 4, '#d0d8f8'); rect(g, 173, 82, 4, 2, '#3050a0');
      rect(g, 196, 79, 5, 7, '#e0e0e0'); rect(g, 197, 80, 3, 1, '#3a2010'); rect(g, 201, 81, 2, 3, '#e0e0e0');
      rect(g, 208, 80, 14, 6, '#1a1a1a'); rect(g, 210, 78, 10, 2, '#2a2a2a');
    },
    music: 'office', fog: 0,
    walk: [[16, 116], [300, 116], [318, 148], [2, 148]],
    scale: [116, 0.9, 148, 1],
    entries: { default: [30, 132, 'e'], map: [30, 132, 'e'] },
    anim(g, t) {
      // steam from coffee + flickering tube
      if (Math.floor(t * 4) % 3 === 0) px(g, 198, 76 - (Math.floor(t * 8) % 4), '#e8e8e8');
      if (Math.random() < 0.01) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 0, 320, 150); }
    },
    npcs: [
      { id: 'rui', x: 160, y: 96, dir: 's', scale: 0.92, name: 'Inspector Mendonça', look: 'narr_look_rui', talk: talkRui,
        items: { sketch: 'alan_def_item', ledger: 'alan_def_item', any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'corkboard', rect: [16, 18, 84, 54], look: 'narr_look_board' },
      { name: 'filing cabinet', rect: [282, 44, 30, 64], look: 'narr_look_cabinet' },
      { name: 'coffee', rect: [194, 76, 10, 10], look: 'narr_look_coffee' },
      { name: 'evidence bag', rect: [167, 77, 16, 10], at: [178, 122], face: 'n', look: 'narr_look_evidence',
        take: () => F().ruiMurders ? say('alan_sketch_hint') : say('rui_hands_off'),
        items: { notebook: async () => {
          if (!F().ruiMurders) return say('rui_hands_off');
          if (G.has('sketch')) return say('alan_have_sketch');
          G.giveItem('sketch'); await say('alan_sketch');
        } } },
      { name: 'door', rect: [0, 26, 12, 82], at: [16, 130], exit: 'map', entry: 'police' },
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

  ROOMS.tavern = {
    name: 'Taberna da Saudade',
    draw: Art.BG.tavern,
    fgDraw: g => { rect(g, 140, 104, 50, 4, '#5a3418'); rect(g, 162, 108, 6, 22, '#3a2010'); rect(g, 154, 128, 22, 3, '#3a2010'); rect(g, 140, 102, 50, 2, '#c8b8a0'); rect(g, 170, 96, 2, 6, '#e8e0c8'); rect(g, 150, 98, 3, 4, '#8a1a1a'); },
    music: 'fado', fog: 0.08, fogColor: 'rgba(160,140,120,A)',
    walk: [[10, 112], [310, 112], [318, 148], [0, 148]],
    scale: [112, 0.9, 148, 1],
    entries: { default: [20, 128, 'e'], street: [20, 128, 'e'] },
    anim(g, t) {
      flicker(g, t, 171, 96, 12, '#ffb050');
      px(g, 170, 94 + (Math.sin(t * 20) > 0 ? 0 : 1), '#ffe080');
      flicker(g, t, 80, 34, 30, '#ff9a40'); flicker(g, t + 1, 200, 34, 30, '#ff9a40');
      if (F().songHeard) { rect(g, 174, 99, 3, 3, '#8a1a1a'); }
    },
    npcs: [
      { id: 'amalia', x: 168, y: 106, dir: 's', scale: 0.94, name: 'Dona Amália', look: 'narr_look_amalia', talk: talkAmalia,
        items: { ginja: giveGinja, any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'door', rect: [2, 30, 22, 80], at: [16, 126], exit: 'street', entry: 'tavern' },
      { name: 'fado poster', rect: [30, 24, 26, 36], look: 'narr_look_tavern' },
      { name: 'old photograph', rect: [90, 30, 22, 18], at: [100, 116], face: 'n', look: async () => { await say('narr_look_photo', 'alan_photo'); F().sawPhoto = true; } },
      { name: 'guitarra portuguesa', rect: [140, 16, 20, 46], look: 'narr_look_guitar' },
      { name: 'bottles of ginjinha', rect: [216, 20, 104, 50], at: [262, 116], face: 'n', look: 'narr_look_bottles',
        take: () => G.has('coins') ? buyGinja() : say('alan_take_bottle'),
        items: { coins: buyGinja } },
      { name: 'bar', rect: [210, 70, 110, 38], at: [262, 116], face: 'n', look: 'narr_look_bottles', items: { coins: buyGinja } },
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
    await say('amalia_sing_1', 'amalia_sing_2');
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
      { label: 'Offer her a ginjinha.', when: () => G.has('ginja') && F().askedSong && !F().songHeard, silent: true, bye: true, run: giveGinja },
      { label: 'Could you sing it again?', when: () => F().songHeard, once: true, run: () => say('amalia_sung') },
      { label: 'Goodbye.', bye: true, run: () => say('amalia_bye') },
    ]);
  }

  ROOMS.convent = {
    name: 'Convento do Carmo',
    draw: g => Art.BG.convent(g, false),
    music: 'church', fog: 0.45,
    walk: [[20, 116], [300, 116], [318, 148], [2, 148]],
    scale: [116, 0.86, 148, 1],
    entries: { default: [24, 134, 'e'], map: [24, 134, 'e'] },
    anim(g, t) {
      // crows? no — drifting salt drips on the weeping stone
      const d = Math.floor(t * 6) % 22;
      px(g, 29, 68 + d, '#ffffff'); px(g, 41, 70 + (d + 9) % 20, '#ffffff');
    },
    npcs: [
      { id: 'tomas', x: 196, y: 122, dir: 'w', name: 'Father Tomás', look: 'narr_look_tomas', talk: talkTomas,
        items: { ledger: showLedgerTomas, any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'arches', rect: [0, 8, 110, 100], look: ['narr_look_convent'] },
      { name: 'arches', rect: [210, 8, 110, 100], look: 'narr_look_arches' },
      { name: 'great window', rect: [110, 30, 100, 82], look: 'narr_look_convent' },
      { name: 'weeping stone', rect: [20, 60, 30, 34], at: [36, 120], face: 'n', look: 'narr_look_stone',
        use: () => F().stoneRead ? openCipher() : say('alan_stone_nomag'),
        items: {
          magnifier: async () => { await say('alan_stone_mag'); F().stoneRead = true; },
          ledger: async () => { if (!F().stoneRead) return say('alan_stone_nomag'); if (F().decoded) return say('alan_look_ledger_decoded'); await openCipher(); },
        } },
      { name: 'iron grate', rect: [230, 124, 54, 18], at: [256, 122], face: 's', look: 'narr_look_grate', use: 'alan_grate', take: 'alan_grate' },
      { name: 'way out', rect: [0, 104, 14, 46], at: [8, 132], exit: 'map', entry: 'convent' },
    ],
    async enter() {
      if (F().act3) return G.goRoom('convent_night', 'map', { instant: true });
    },
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
        await say('alan_decode_1', 'alan_decode_2', 'alan_decode_3');
        G.setVerb('walk');
        resolve();
      };
      m.querySelector('.done').onclick = () => close(k === 7);
      m.querySelector('.cancel').onclick = () => close(null);
      G.showModal('cipher', true);
    });
  }

  ROOMS.convent_night = {
    name: 'Convento do Carmo — midnight',
    draw: g => Art.BG.convent(g, true),
    music: 'tension', fog: 0.5, fogColor: 'rgba(120,130,160,A)',
    walk: [[20, 116], [300, 116], [318, 148], [2, 148]],
    scale: [116, 0.86, 148, 1],
    entries: { default: [24, 134, 'e'], map: [24, 134, 'e'] },
    anim(g, t) {
      // the grate stands open; stairs vanish into green-black
      rect(g, 232, 126, 50, 14, '#020604'); for (let i = 0; i < 4; i++) rect(g, 236 + i * 2, 128 + i * 3, 42 - i * 4, 1, '#1a2a24');
      glow(g, 257, 133, 16, '#3a8a6a', 0.2 + 0.08 * Math.sin(t * 2));
      line(g, 232, 126, 226, 116, '#5a5048'); line(g, 282, 126, 288, 116, '#5a5048');
    },
    npcs: [
      { id: 'tomas', x: 100, y: 124, dir: 'e', name: 'Father Tomás', look: 'narr_look_tomas', talk: () => say('tomas_night') },
    ],
    hotspots: [
      { name: 'weeping stone', rect: [20, 60, 30, 34], look: 'narr_look_stone' },
      { name: 'arches', rect: [0, 8, 110, 100], look: 'narr_look_arches' },
      { name: 'open grate', rect: [230, 124, 54, 18], at: [257, 122], exit: 'cistern', entry: 'convent', look: 'narr_look_grate' },
      { name: 'way out', rect: [0, 104, 14, 46], at: [8, 132], exit: 'map', entry: 'convent' },
    ],
    async enter() {
      if (!F().tomasNight) { F().tomasNight = true; await say('tomas_night'); }
    },
  };

  ROOMS.antiques = {
    name: 'Antiguidades Lacerda',
    draw: Art.BG.antiques,
    fgDraw: g => { rect(g, 40, 82, 80, 26, '#4a2a14'); rect(g, 38, 80, 84, 3, '#6a4020'); rect(g, 46, 74, 16, 6, '#c8a040'); rect(g, 50, 72, 8, 2, '#8a6a20'); for (let i = 0; i < 3; i++) rect(g, 46 + i * 26, 88, 22, 16, '#3a2010'); },
    music: 'antiques', fog: 0,
    walk: [[10, 112], [310, 112], [318, 148], [2, 148]],
    scale: [112, 0.9, 148, 1],
    entries: { default: [160, 140, 'n'], map: [160, 140, 'n'] },
    anim(g, t) {
      // pendulum
      const a = Math.sin(t * 3.1) * 3;
      rect(g, 124, 44, 8, 40, '#2a1408'); line(g, 128, 50, 128 + a, 72, '#b89040'); disc(g, Math.round(128 + a), 75, 3, '#c8a040');
      if (F().clapperTaken) { rect(g, 144, 66, 62, 12, '#5a1420'); rect(g, 196, 69, 8, 5, '#e8e0c8'); }
      else { rect(g, 160, 70, 22, 3, '#5a5020'); disc(g, 184, 71, 3, '#6a5a28'); px(g, 183, 70, '#8a8a50'); rect(g, 158, 69, 4, 5, '#4a4018'); }
    },
    npcs: [
      { id: 'lacerda', x: 82, y: 98, dir: 's', scale: 0.92, name: 'Senhor Lacerda', look: 'narr_look_lacerda', talk: talkLacerda,
        items: { clapper: 'alan_def_item', ledger: async () => say('lacerda_brother'), any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'clocks', rect: [8, 4, 106, 66], look: 'narr_look_clocks' },
      { name: 'grandfather clock', rect: [118, 16, 20, 90], look: 'narr_look_clocks' },
      { name: "ship's bell", rect: [146, 18, 24, 26], look: 'narr_look_antiques' },
      { name: 'music box', rect: [220, 30, 22, 16], at: [231, 118], face: 'n', look: async () => { await say('narr_look_musicbox'); F().sawBox = true; } },
      { name: 'display case', rect: [140, 62, 70, 18], at: [176, 116], face: 'n', look: () => F().clapperTaken ? say('narr_look_antiques') : say('narr_look_case'),
        take: takeClapper, use: takeClapper },
      { name: 'way out', rect: [0, 138, 320, 12], at: [160, 146], exit: 'map', entry: 'antiques' },
    ],
  };
  async function takeClapper() {
    if (F().clapperTaken) return say('alan_def_take');
    const lac = G.npc('lacerda');
    if (lac && lac.visible) return say('lacerda_hands');
    F().clapperTaken = true;
    G.giveItem('clapper');
    await say('alan_take_clapper');
    // Lacerda returns from the back room
    lac.visible = true; lac.x = 296; lac.y = 112;
    await lac.walkTo(250, 118);
    lac.dir = 'w';
    await say('lacerda_back');
    await G.player.walkTo(160, 146);
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
        await lac.walkTo(120, 112); await lac.walkTo(296, 112);
        lac.visible = false;
      } },
      { label: 'Goodbye.', bye: true, run: () => say('lacerda_bye') },
    ]);
  }

  ROOMS.cistern = {
    name: 'The Cistern',
    draw: Art.BG.cistern,
    music: () => F().won ? 'dawn' : 'tension', fog: 0.25, fogColor: 'rgba(90,140,130,A)',
    walk: [[10, 116], [246, 116], [252, 148], [4, 148]],
    scale: [116, 0.9, 148, 1],
    entries: { default: [24, 132, 'e'], convent: [24, 132, 'e'] },
    noSave: true,
    anim(g, t) {
      // water ripples
      for (let i = 0; i < 18; i++) {
        const x = (i * 37 + Math.floor(t * 10 * (1 + (i % 3)))) % 320, y = 88 + (i * 7) % 20;
        rect(g, x, y, 4 + (i % 3), 1, '#1a4a50');
      }
      const tf = 0.3 + 0.06 * Math.sin(t * 11);
      glow(g, 41, 50, 6, '#ffd060', tf); glow(g, 301, 50, 6, '#ffd060', tf);
      if (F().ringing) {
        const r = (t * 40) % 80;
        for (let a = 0; a < 6.28; a += 0.08) px(g, 160 + Math.cos(a) * r, 64 + Math.sin(a) * r * 0.5, '#9ad8c8');
      }
      if (F().won) { g.fillStyle = 'rgba(255,200,140,0.10)'; g.fillRect(0, 0, 320, 150); }
    },
    npcs: [
      { id: 'lacerda', spec: 'lacerda_robe', x: 200, y: 122, dir: 'w', name: 'Lacerda', when: () => !F().won,
        look: 'narr_look_lacerda',
        talk: async () => { await say('alan_fin_talk', 'lacerda_fin_talk'); },
        take: () => die(),
        items: {
          ledger: async () => { G.takeItem('ledger'); await say('alan_give_ledger', 'lacerda_ledger'); F().distracted = true; G.npc('lacerda').dir = 's'; },
          clapper: () => die(),
          any: 'alan_def_item',
        } },
      { id: 'ines', x: 271, y: 116, dir: 'w', name: 'Inês',
        overlay: (g, a) => { if (!F().won) { rect(g, a.x - 7, a.y - 28, 14, 1, '#b8a070'); rect(g, a.x - 7, a.y - 20, 14, 1, '#b8a070'); } },
        look: 'narr_look_ines', talk: () => say('ines_fin_1'), take: () => die(), items: { any: 'alan_def_item' } },
    ],
    hotspots: [
      { name: 'the Drowned Bell', rect: [126, 24, 68, 60], at: [150, 120], face: 'n', look: 'narr_look_bell',
        use: () => say('alan_bell_need'),
        items: { clapper: async () => { if (!F().distracted) return die(); await ringBell(); } } },
      { name: 'black water', rect: [0, 84, 320, 26], look: 'narr_look_cistern' },
    ],
    async enter() {
      if (F().finaleIntro) return;
      F().finaleIntro = true;
      await G.player.walkTo(70, 128);
      await say('lacerda_fin_1', 'alan_fin_1', 'lacerda_fin_2', 'ines_fin_1', 'lacerda_fin_3');
      G.checkpoint();
    },
  };
  async function die() {
    await G.busy(async () => {
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
    await say('alan_ring');
    F().ringing = true;
    Sound.playMusic(null);
    Sound.sfx('unring');
    await say('narr_ring');
    const lac = G.npc('lacerda');
    lac.dir = 'e';
    await say('lacerda_scream');
    Sound.sfx('splash');
    await lac.walkTo(206, 112);
    lac.visible = false;
    await say('narr_end_1');
    F().ringing = false; F().won = true;
    Sound.playMusic('dawn');
    const ines = G.npc('ines');
    await ines.walkTo(G.player.x + 18, G.player.y + 2);
    ines.dir = 'w'; G.player.dir = 'e';
    await say('ines_end', 'alan_end');
    await G.fade(true);
    await G.card('', 'The tenth morning', 2200);
    G.showModal('ending', true);
    await G.fade(false);
    await say('narr_end_2');
    try { localStorage.removeItem('drowned-bell-save-v1'); } catch (e) { /* ignore */ }
  }
  document.getElementById('btn-again').onclick = () => location.reload();

  // ---------------------------------------------------------------- new game
  async function newGame() {
    await G.card('CHAPTER I', 'The Fog');
    G.giveItem('notebook', true);
    await G.goRoom('shop', null, { noEnter: true, pos: [45, 110, 'n'] });
    await G.busy(async () => {
      await G.wait(600);
      await say('narr_intro_1', 'narr_intro_2', 'alan_intro_1');
      G.player.dir = 'e';
      await say('ines_intro_1', 'alan_intro_2', 'ines_intro_2');
    });
    G.autosave();
  }
  window.Story = { newGame };
  G.init(CHARS, ITEMS, ROOMS);
  document.getElementById('btn-new').onclick = () => G.begin(true);
  document.getElementById('btn-continue').onclick = () => G.begin(false);
})();
