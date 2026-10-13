// The Drowned Bell — rooms, cast, items and puzzles (1280x720 painted scenes).
(function () {
  const G = window.Game;
  const F = () => G.flags;
  const say = (...ids) => G.says(...ids);

  // ---------------------------------------------------------------- cast
  // Painted sprite frames (see js/sprites.js); sprites face right and are
  // mirrored for left. `scale` is relative body height.
  const CHARS = {
    alan: { frames: { idle: 'alan_side', talk: 'alan_talk', walk: ['alan_walkA', 'alan_pass', 'alan_walkB', 'alan_pass'], front: 'alan_front', back: 'alan_back' }, scale: 1 },
    ines: { frames: { idle: 'ines', talk: 'ines_talk' }, scale: 0.93 },
    rui: { frames: { idle: 'rui', talk: 'rui_talk' }, scale: 0.96 },
    amalia: { frames: { idle: 'amalia', talk: 'amalia_talk' }, scale: 0.9 },
    tomas: { frames: { idle: 'tomas', talk: 'tomas_talk' }, scale: 0.95 },
    lacerda: { frames: { idle: 'lacerda', talk: 'lacerda_talk' }, scale: 1.0 },
    lacerda_robe: { frames: { idle: 'lacerda_robe', talk: 'lacerda_robe' }, scale: 1.02 },
  };

  // ---------------------------------------------------------------- items
  const ITEMS = {
    notebook: { name: 'Notebook', look: 'narr_look_notebook' },
    sketch: { name: 'Tile sketch', look: 'narr_look_sketch' },
    coins: { name: 'Escudos', look: 'narr_look_coins' },
    key: { name: 'Small iron key', look: 'narr_look_key' },
    ledger: { name: () => F().decoded ? "Grandfather's ledger (decoded)" : "Grandfather's ledger", look: () => F().decoded ? say('alan_look_ledger_decoded') : say('narr_look_ledger') },
    magnifier: { name: 'Magnifying glass', look: 'narr_look_magnifier' },
    ginja: { name: 'Ginjinha', look: 'narr_look_ginja' },
    clapper: { name: 'Bell clapper', look: 'narr_look_clapper' },
  };

  const ROOMS = {};

  // ================================================================ BOOKSHOP
  ROOMS.shop = {
    name: 'Livraria Sanchez', bg: 'shop',
    music: () => F().act3 ? 'tension' : 'fog',
    walk: [[340, 548], [790, 548], [1000, 716], [200, 716]],
    scale: [548, 370, 716, 480],
    light: { ambient: 'rgb(214,190,160)', rim: 'rgba(210,225,240,0.32)', rimSide: -1 },
    entries: { default: [380, 600, 'w'], street: [880, 600, 'w'] },
    patches: [{ when: () => F().magTaken, src: [118, 440, 80, 26], dst: [196, 424, 96, 30] }],
    anim(g, t) {
      FX.shaft(g, [[420, 30], [850, 30], [860, 716], [380, 716]], '210,220,230', 0.05);
      FX.motes(g, t, 420, 60, 430, 520, 40, '255,240,210');
      if (!F().heardMsg || (F().act3 && !F().heardLacerda)) if (Math.floor(t * 2) % 2 === 0) FX.glow(g, 1062, 381, 14, '255,40,20', 0.9);
      FX.glow(g, 175, 300, 90 * FX.flicker(t, 1), '255,220,140', 0.16); // banker's lamp
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
    light: { ambient: 'rgb(214,214,214)', rim: 'rgba(255,210,150,0.18)', rimSide: 1 },
    entries: { default: [545, 640, 's'], shop: [370, 600, 's'], tavern: [1075, 628, 's'], map: [545, 640, 's'] },
    anim(g, t) {
      FX.glow(g, 522, 188, 70 * FX.flicker(t, 2), '255,225,150', 0.35);
      FX.glow(g, 1138, 318, 60 * FX.flicker(t, 5), '255,200,120', 0.35);
      FX.glow(g, 240, 430, 70, '255,210,140', 0.12); // shop window
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
    scale: [620, 390, 716, 430],
    light: { ambient: 'rgb(206,220,196)', rim: 'rgba(220,235,255,0.25)', rimSide: 1 },
    occluders: [{ poly: [[318, 393], [948, 393], [948, 608], [318, 608]], y: 608 }],
    entries: { default: [160, 655, 'e'], map: [160, 655, 'e'] },
    anim(g, t) {
      FX.glow(g, 720, 20, 260, '230,245,220', 0.08 + (Math.random() < 0.01 ? -0.06 : 0));
      if (Math.floor(t * 3) % 4 === 0) FX.glow(g, 752, 340 - (t * 20) % 30, 12, '255,255,255', 0.12); // coffee steam
    },
    npcs: [
      { id: 'rui', x: 505, y: 600, h: 390, dir: 'e', name: 'Inspector Mendonça', look: 'narr_look_rui', talk: talkRui,
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
    walk: [[0, 568], [1280, 588], [1280, 716], [0, 716]],
    scale: [568, 385, 716, 450],
    light: { ambient: 'rgb(200,140,95)', rim: 'rgba(255,175,90,0.4)', rimSide: 1 },
    occluders: [
      { poly: [[676, 420], [898, 420], [898, 612], [676, 612]], y: 612 },
      { poly: [[578, 352], [692, 352], [692, 598], [578, 598]], y: 598 },
    ],
    entries: { default: [140, 650, 'e'], street: [140, 650, 'e'] },
    anim(g, t) {
      FX.glow(g, 453, 175, 120 * FX.flicker(t, 1), '255,180,90', 0.28);
      FX.glow(g, 985, 150, 120 * FX.flicker(t, 3), '255,180,90', 0.28);
      FX.glow(g, 790, 382, 60 * FX.flicker(t, 7), '255,190,100', 0.35);
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
    light: { ambient: 'rgb(218,212,224)', rim: 'rgba(255,240,220,0.25)', rimSide: 1 },
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'] },
    anim(g, t) { FX.shaft(g, [[740, 100], [830, 100], [900, 560], [680, 560]], '255,245,230', 0.06); },
    npcs: [
      { id: 'tomas', x: 640, y: 590, dir: 'w', name: 'Father Tomás', look: 'narr_look_tomas', talk: talkTomas,
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
    light: { ambient: 'rgb(120,135,185)', rim: 'rgba(120,255,170,0.35)', rimSide: 1 },
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'] },
    anim(g, t) {
      FX.glow(g, 800, 168, 90, '210,225,255', 0.18);
      FX.glow(g, 990, 650, 170 + Math.sin(t * 2) * 15, '90,255,160', 0.22);
    },
    npcs: [{ id: 'tomas', x: 430, y: 600, dir: 'e', name: 'Father Tomás', look: 'narr_look_tomas', talk: () => say('tomas_night') }],
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
    light: { ambient: 'rgb(205,170,125)', rim: 'rgba(255,200,120,0.3)', rimSide: -1 },
    occluders: [{ poly: [[0, 348], [446, 348], [446, 642], [0, 642]], y: 642 }],
    patches: [{ when: () => F().clapperTaken, src: [668, 296, 192, 36], dst: [668, 330, 192, 82] }],
    entries: { default: [640, 690, 'n'], map: [640, 690, 'n'] },
    anim(g, t) {
      FX.glow(g, 730, 170, 120, '255,210,140', 0.12);
      if (!F().clapperTaken) FX.glow(g, 765, 375, 50 + Math.sin(t * 1.4) * 8, '120,255,180', 0.08);
    },
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
    light: { ambient: 'rgb(150,165,135)', rim: 'rgba(255,150,60,0.4)', rimSide: -1 },
    entries: { default: [130, 640, 'e'], convent: [130, 640, 'e'] },
    anim(g, t) {
      FX.water(g, t, 160, 400, 850, 140, '120,255,170');
      FX.glow(g, 100, 200, 150 * FX.flicker(t, 2), '255,150,60', 0.35);
      FX.glow(g, 1215, 255, 120 * FX.flicker(t, 4), '255,150,60', 0.3);
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
      { id: 'lacerda', ch: 'lacerda_robe', x: 800, y: 598, dir: 'w', fixedDir: true, name: 'Lacerda', when: () => !F().won,
        look: 'narr_look_lacerda', talk: () => say('alan_fin_talk', 'lacerda_fin_talk'), take: () => die(),
        items: {
          ledger: async () => { G.takeItem('ledger'); await say('alan_give_ledger', 'lacerda_ledger'); F().distracted = true; },
          clapper: () => die(), any: 'alan_def_item',
        } },
      { id: 'ines', x: 1085, y: 628, dir: 'w', fixedDir: true, name: 'Inês',
        overlay: (g, a) => {
          if (F().won) return;
          const b = a.bbox();
          g.strokeStyle = '#8a6a3a'; g.lineWidth = 5;
          for (const k of [0.38, 0.5, 0.62]) { g.beginPath(); g.moveTo(b.x - 10, b.y + b.h * k); g.quadraticCurveTo(a.x, b.y + b.h * k + 10, b.x + b.w + 10, b.y + b.h * k - 4); g.stroke(); }
        },
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
    await lac.walkTo(820, 545);
    lac.visible = false;
    await say('narr_end_1');
    F().ringing = false; F().won = true;
    Sound.playMusic('dawn');
    const ines = G.npc('ines');
    await ines.walkTo(G.player.x + 130, G.player.y + 4);
    ines.dir = 'w'; G.player.dir = 'e';
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
