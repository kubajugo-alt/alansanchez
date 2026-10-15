// Chapter I, the Sé: the museum ("Lisboa e o Mar, 1700–1755"), the cloister dig and
// the treasury reserve. Inês has seen the tile's seal on a sealed case in the reserve;
// the curator, Dr. Vasco Teles, wears its key round his neck. Alan keeps him busy in
// the Sanches casting pit while Inês borrows the Brotherhood's charter and register.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  S.CHARS.vasco = { scale: 1.0, frames: {
    idle: ['vasco', 'vasco_idle2'], talk: ['vasco_talk', 'vasco_talk2'], walk: ['vasco_walk1', 'vasco_walk2'],
    poses: { kneel: 'vasco_kneel', climb: 'vasco_climb' } } };
  if (window.SPRITES.ines_plaque) S.CHARS.ines.frames.poses.plaque = 'ines_plaque';

  // Inês is at the Sé from the plan until she has the register; the shop is empty meanwhile
  const inesAtSe = () => F().ines_plan && !F().heist_done && F().ch === 1;
  S.inesAtSe = inesAtSe;
  // Vasco keeps digging all of Chapter I; in Chapter III he's back in the cloister once, hoping
  const vascoHere = () => F().ch <= 1 || (F().ch === 3 && F().vasco_thursday && !F().vasco_cameo);

  // Alan's notebook: lore entries collect as they're learned (the page itself is in docs.js)
  S.lore = function (key) {
    const L = F().lore || (F().lore = []);
    if (L.includes(key)) return;
    L.push(key); G.toast('Notebook updated'); sfx('page');
  };
  S.loreOrder = () => { if (F().founder_order && F().heard_bells) S.lore('order'); };

  // ---------------------------------------------------------------- the exhibits
  // four the plan needs (●), two for the curious
  const EXHIBITS = {
    panorama: { need: true, lines: ['ines_panorama', 'alan_panorama'] },
    gold: { need: true, lines: ['ines_gold', 'alan_gold'] },
    exvoto: { need: true, lines: ['ines_exvoto', 'alan_exvoto'] },
    alminhas: { need: true, lines: ['ines_nograve', 'ines_saudade', 'alan_saudade'] },
    htm: { lines: ['ines_htm', 'alan_htm'] },
    engraving: { lines: ['ines_1755', 'alan_1755'] },
  };
  S.exhibit = async function (id) {
    const ex = EXHIBITS[id], seen = F().se_seen || (F().se_seen = {});
    const ines = G.npc('ines');
    // without Inês to explain, Alan only has his half of it
    const lines = ines && ines.visible ? ex.lines : ex.lines.filter(l => l.startsWith('alan_'));
    if (ines && ines.visible) { ines.dir = ines.x < G.player.x ? 'e' : 'w'; if (window.SPRITES.ines_plaque) ines.pose = 'plaque'; }
    try { await say(...lines); } finally { if (ines) ines.pose = null; }
    if (ex.need && !seen[id]) { seen[id] = true; F().se_exhibits = Object.keys(EXHIBITS).filter(k => EXHIBITS[k].need && seen[k]).length; }
  };

  S.talkInesSe = async function () {
    if (F().se_exhibits >= 4 && !F().se_plan_on) {
      F().se_plan_on = true;
      await say('ines_go'); await joke('alan_go');
      return;
    }
    await G.dialog([
      { line: 'alan_ask_ines_se_now', run: () => say(S.hint()) },
      { line: 'alan_ask_ines_vasco', once: true, run: () => say('ines_vasco') },
      { label: 'Goodbye.', bye: true, run: () => say('ines_bye') },
    ]);
  };

  // ================================================================ THE MUSEUM
  ROOMS.se_museum = {
    name: 'Sé de Lisboa · museum', bg: 'se_museum', music: 'church', ambience: 'convent', acoustic: 'convent', floor: 'stone',
    walk: [[50, 650], [440, 608], [800, 610], [1050, 598], [1150, 600], [1280, 610], [1280, 716], [0, 716], [0, 660]],
    scale: [600, 300, 716, 365],
    light: { ambient: 'rgb(214,208,200)', base: 0.86, rim: 'rgba(255,236,205,0.16)', rimSide: 1 },
    lights: [
      { x: 600, y: 200, rgb: '236,238,242', power: 0.26, reach: 1100, rim: 0.4, shadow: 0.45, floor: [600, 560], height: 800 },
      { x: 1210, y: 300, rgb: '255,246,225', power: 0.3, reach: 900, rim: 0.6, shadow: 0.4, floor: [1150, 600], height: 500 }, // daylight from the cloister
      { x: 840, y: 410, rgb: '255,214,150', kind: 'steady', glow: 60, ga: 0.2, power: 0.14, reach: 380, shadow: false }, // the desk lamp
    ],
    entries: { default: [90, 680, 'e'], map: [90, 680, 'e'], se_cloister: [1180, 650, 'w'] },
    anim(g, t) { FX.motes(g, t, 300, 140, 700, 400, 26, '240,234,222'); },
    npcs: [
      { id: 'ines', x: 520, y: 640, dir: 'e', name: 'Inês', when: () => inesAtSe() && !F().se_plan_on, look: 'narr_look_ines', talk: () => S.talkInesSe(),
        items: { any: 'alan_fail_ines_item' } },
    ],
    ambient: [
      { id: 'npc_guard', name: 'Museum guard', frames: ['npc_guard', 'npc_guard_b'], x: 1090, y: 605, h: 230, look: 'alan_npc_guard', idleHold: [6, 12], variantHold: [3, 6] },
      { id: 'npc_tourists', name: 'Tourists', frames: ['npc_tourists', 'npc_tourists_b'], x: 230, y: 700, h: 360, look: 'alan_npc_tourists', idleHold: [5, 9], variantHold: [3, 5] },
    ],
    hotspots: [
      { name: 'Panorama of Lisbon, 1700', rect: [0, 118, 332, 254], at: [220, 650], face: 'n', look: () => S.exhibit('panorama') },
      { name: 'Gold of the fleets', rect: [15, 395, 385, 150], at: [260, 650], face: 'n', look: () => S.exhibit('gold') },
      { name: "Sailors' ex-votos", rect: [376, 108, 178, 254], at: [470, 640], face: 'n', look: () => S.exhibit('exvoto') },
      { name: 'Alminhas panel', rect: [666, 128, 94, 256], at: [710, 630], face: 'n', look: () => S.exhibit('alminhas') },
      { name: 'História Trágico-Marítima', rect: [546, 364, 142, 84], at: [610, 630], face: 'n', look: () => S.exhibit('htm') },
      { name: 'Engraving: 1 November 1755', rect: [766, 204, 134, 172], at: [830, 630], face: 'n', look: () => S.exhibit('engraving') },
      { name: "Curator's desk", rect: [716, 440, 344, 150], at: [880, 630], face: 'n', look: 'narr_look_vasco_desk', use: 'alan_fail_04' },
      { name: 'Treasury reserve', rect: [944, 140, 96, 300], at: [1000, 620], face: 'n', look: 'narr_look_reserve', use: 'alan_reserve_locked',
        items: { reserve_key: 'alan_lanyard_far', any: 'alan_reserve_locked' } },
      { name: 'Cloister', rect: [1150, 90, 130, 500], at: [1200, 640], exit: 'se_cloister', entry: 'se_museum' },
      { name: 'Way out', rect: [0, 620, 50, 96], at: [30, 690], exit: 'map', entry: 'se_museum' },
    ],
    async enter() {
      if (inesAtSe() && !F().se_visited) { F().se_visited = true; await say('ines_se_hello'); }
    },
  };

  // ================================================================ THE CLOISTER AND THE PIT
  const PIT = [800, 632]; // the pit's near edge, by the ladder
  ROOMS.se_cloister = {
    name: 'Sé de Lisboa · cloister', bg: 'se_cloister', music: null, ambience: 'cloister', acoustic: 'convent', floor: 'stone',
    // round the open pit, never into it
    walk: [[0, 600], [220, 568], [540, 560], [556, 624], [1064, 618], [1150, 604], [1280, 612], [1280, 716], [0, 716]],
    scale: [565, 250, 716, 345],
    light: { ambient: 'rgb(222,220,214)', base: 0.9, rim: 'rgba(255,245,225,0.18)', rimSide: -1 },
    lights: [
      { x: 660, y: 250, rgb: '238,240,244', power: 0.34, reach: 1400, rim: 0.5, shadow: 0.5, floor: [660, 520], height: 700 }, // daylight from the garth
    ],
    entries: { default: [1190, 650, 'w'], se_museum: [1190, 650, 'w'], se_tower: [140, 640, 'e'] },
    anim(g, t) { FX.leaves(g, t, 600, 690, 11); },
    npcs: [
      { id: 'vasco', x: 1110, y: 640, dir: 'w', name: 'Dr. Vasco Teles', when: vascoHere, look: 'narr_look_vasco', talk: () => S.talkVasco(),
        items: { any: 'alan_fail_04' } },
      { id: 'ines', x: 430, y: 600, dir: 'e', name: 'Inês', when: () => inesAtSe() && F().se_plan_on && !F().key_tossed, look: 'narr_look_ines', talk: () => say(S.hint()),
        items: { reserve_key: () => S.tossKey(), any: 'alan_fail_ines_item' } },
    ],
    ambient: [
      { id: 'npc_volunteer', name: 'Dig volunteer', frames: ['npc_volunteer', 'npc_volunteer_b'], x: 700, y: 462, h: 120, look: 'alan_npc_volunteer', idleHold: [1.2, 2], variantHold: [1, 1.8] },
    ],
    hotspots: [
      { name: 'Casting pit', rect: [550, 505, 512, 108], at: PIT, face: 'n',
        look: () => { F().saw_pit = true; return say('narr_look_pit'); },
        use: () => F().in_pit ? say('alan_fail_04') : say('alan_pit_ladder') },
      { name: 'Founder marks', rect: [612, 516, 150, 70], at: [690, 628], face: 'n', look: () => { F().saw_marks = true; return say('narr_look_pitmarks'); } },
      { name: 'Mould fragments', rect: [812, 384, 140, 72], at: [880, 626], face: 'n', look: () => { F().saw_frags = true; return say('narr_look_frags'); } },
      { name: () => F().ch >= 3 && F().decoded ? 'Stair to the bell tower' : 'Chained stair', rect: [25, 150, 190, 420], at: [130, 610], face: 'n',
        look: 'narr_look_stair', use: () => F().ch >= 3 && F().decoded ? G.goRoom('se_tower', 'map') : say('alan_stair_chained') },
      { name: 'Museum', rect: [1130, 200, 130, 330], at: [1200, 630], exit: 'se_museum', entry: 'se_cloister' },
    ],
  };

  // ---------------------------------------------------------------- Vasco
  S.talkVasco = async function () {
    if (F().heist_done) {
      if (F().ch === 3 && F().vasco_thursday && !F().vasco_cameo) { F().vasco_cameo = true; return say('vasco_cameo', 'alan_cameo'); }
      return say('vasco_busy');
    }
    if (!F().met_vasco) { F().met_vasco = true; await say('vasco_hello', 'alan_vasco_hello'); }
    if (F().in_pit) return S.pitTalk();
    const asked = F().dig_asked || (F().dig_asked = {});
    // each question asked counts; the third ends the conversation (he has to show Alan the bottom)
    const ask = (id, flag, lines) => ({ line: id, once: true, when: () => F().se_plan_on && F()[flag] && !asked[id], run: async () => {
      await say(...lines); asked[id] = true; F().dig_questions = Object.keys(asked).length;
    }, get bye() { return F().dig_questions >= 3; } });
    await G.dialog([
      ask('alan_ask_pit', 'saw_pit', ['vasco_pit']),
      ask('alan_ask_marks', 'saw_marks', ['vasco_marks', 'alan_relation']),
      ask('alan_ask_frags', 'saw_frags', ['vasco_blood', 'alan_romantic']),
      { line: 'alan_vasco_flirt', run: () => say('vasco_rope') },
      { label: 'Goodbye.', bye: true },
    ]);
    if (F().dig_questions >= 3 && !F().in_pit) await S.intoPit();
  };

  // down the ladder: Alan slips, Vasco catches him
  S.intoPit = async function () {
    if (F().in_pit) return;
    const p = G.player, v = G.npc('vasco');
    await say('vasco_bottom'); await joke('alan_bottom');
    if (v) { await v.walkTo(PIT[0] + 60, PIT[1]); v.dir = 'w'; }
    await p.walkTo(PIT[0], PIT[1]); p.dir = 'e';
    p.pose = 'wobble'; sfx('stairs', 0.5); await T(500);
    await say('vasco_close'); p.pose = null; await joke('alan_close');
    F().in_pit = true;
  };

  // in the pit: the lanyard, then (once Inês has the key) the long conversation
  S.pitTalk = async function () {
    if (F().key_tossed) return S.pitGame();
    await G.dialog([
      { label: 'Reach for the lanyard.', when: () => !F().lanyard_taken, bye: true, run: () => S.takeLanyard() },
      { line: 'alan_vasco_flirt', run: () => say('vasco_rope') },
      { label: 'Goodbye.', bye: true },
    ]);
  };
  S.takeLanyard = async function () {
    if (F().lanyard_taken) return;
    if (!F().in_pit) return say('alan_lanyard_far');
    G.player.pose = 'reach'; await T(500); G.player.pose = null;
    await say('vasco_lanyard'); await joke('alan_lanyard');
    F().lanyard_taken = true; give('reserve_key');
  };

  // ---------------------------------------------------------------- the toss
  // a marker sweeps the bar; let go while Vasco's eyes are on Alan (the gold band)
  function tossGame() {
    return new Promise(resolve => {
      let m = document.getElementById('toss');
      if (!m) {
        m = document.createElement('div'); m.id = 'toss'; m.className = 'modal hidden';
        m.style.background = 'rgba(5,4,3,.55)'; m.style.justifyContent = 'flex-end'; m.style.paddingBottom = '9%';
        m.innerHTML = `<p class="hint" style="font-style:italic">Toss the key to Inês while Vasco is looking at you.</p>
          <div class="bar" style="position:relative;width:60%;height:28px;border:1px solid #8a7a60;background:#191920;border-radius:4px;margin:.6em 0">
            <div class="zone" style="position:absolute;top:0;bottom:0;background:rgba(224,184,102,.55)"></div>
            <div class="mark" style="position:absolute;top:-6px;bottom:-6px;width:6px;margin-left:-3px;background:#fff0c8;border-radius:3px"></div></div>
          <div class="controls"><button class="go">Toss!</button></div>`;
        (document.getElementById('cipher').parentNode).appendChild(m);
      }
      const zone = m.querySelector('.zone'), mark = m.querySelector('.mark');
      const z0 = 0.2 + Math.random() * 0.5, zw = 0.16;
      zone.style.left = (z0 * 100) + '%'; zone.style.width = (zw * 100) + '%';
      let x = 0, dir = 1, last = performance.now(), live = true;
      const step = now => {
        if (!live) return;
        x += dir * (now - last) / 1300; last = now;
        if (x > 1) { x = 1; dir = -1; } if (x < 0) { x = 0; dir = 1; }
        mark.style.left = (x * 100) + '%';
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      m.querySelector('.go').onclick = e => { e.stopPropagation(); live = false; G.showModal('toss', false); resolve(x >= z0 && x <= z0 + zw); };
      G.showModal('toss', true);
      if (window.FAST) { live = false; G.showModal('toss', false); resolve(true); }
    });
  }
  S.tossKey = async function () {
    if (!G.has('reserve_key') || F().key_tossed) return say('alan_fail_04');
    if (!F().in_pit) return say('alan_lanyard_far');
    await say('alan_toss_ines');
    const ok = await tossGame();
    G.player.pose = 'reach'; sfx('pickup'); await T(400); G.player.pose = null;
    if (!ok) { sfx('trowel'); await say('vasco_fall'); await joke('alan_standards'); return; }
    G.takeItem('reserve_key'); F().key_tossed = true;
    G.refreshNpcs(); // Inês slips off to the reserve
    await S.pitGame();
  };

  // ---------------------------------------------------------------- keeping him busy
  // five exchanges, three replies each: right (interest and a flirt), too much (he blushes
  // and wants out), too little (he remembers the reserve). Two wrong in a row and he heads
  // for the ladder; one rescue allowed, then Inês has to stall him and they start again.
  const EX = [
    ['vasco_layers', 'alan_layers', 'alan_layers_much', 'vasco_much_1', 'alan_layers_little', 'vasco_little_1'],
    ['vasco_kneel', 'alan_kneel', 'alan_kneel_much', 'vasco_much_2', 'alan_kneel_little', 'vasco_little_2'],
    ['vasco_dirt', 'alan_dirt', 'alan_dirt_much', 'vasco_much_3', 'alan_dirt_little', 'vasco_little_3'],
    ['vasco_coins', 'alan_coins', 'alan_coins_much', 'vasco_much_4', 'alan_coins_little', 'vasco_little_4'],
    ['vasco_quiet', 'alan_quiet', 'alan_quiet_much', 'vasco_much_5', 'alan_quiet_little', 'vasco_little_5'],
  ];
  const ORDER = [[1, 0, 2], [0, 2, 1], [2, 1, 0], [1, 2, 0], [0, 1, 2]]; // where the right answer sits, per exchange
  S.pitGame = async function () {
    const v = G.npc('vasco');
    let i = F().pit_exchanges || 0, wrong = 0, rescued = false;
    while (i < EX.length) {
      const [prompt, right, much, muchR, little, littleR] = EX[i];
      if (v && i === 1 && window.SPRITES.vasco_kneel) v.pose = 'kneel';
      await say(prompt);
      if (i === 0) { sfx('v_vasco_laugh', 0.5); }
      const opts = [{ line: right, ok: true }, { line: much, react: muchR }, { line: little, react: littleR }];
      let pick = null;
      await G.dialog(ORDER[i].map(k => ({ line: opts[k].line, bye: true, run: () => { pick = opts[k]; } })));
      if (v) v.pose = null;
      if (pick.ok) { i++; wrong = 0; F().pit_exchanges = i; continue; }
      await say(pick.react);
      if (++wrong < 2) continue;
      if (!rescued) { rescued = true; wrong = 0; if (v && window.SPRITES.vasco_climb) v.pose = 'climb'; await say('vasco_ladder'); await joke('alan_collar'); if (v) v.pose = null; await say('vasco_collar'); continue; }
      // he's out of the pit; Inês stalls him from the arcade and they start again
      await say('ines_stall', 'vasco_stall');
      i = 0; wrong = 0; rescued = false; F().pit_exchanges = 0;
    }
    await S.pitKiss();
  };

  S.pitKiss = async function () {
    G.cutscene = true;
    try {
      await S.still('still_se_kiss', 'se_cloister', async () => {
        sfx('trowel'); await T(300);
        await say('vasco_kiss'); sfx('quarter'); await say('alan_monument');
        sfx('v_vasco_laugh', 0.5);
      }, { zoom: [1.02, 1.12] });
      await S.still('still_se_pit', 'se_cloister', () => G.say('narr_pit', { offscreen: true }), { zoom: [1.0, 1.1], pan: [[0.5, 0.55], [0.5, 0.45]] });
      // meanwhile, in the reserve
      await S.still('still_se_reserve', 'se_museum', async () => {
        await G.say('narr_reserve', { offscreen: true });
        await S.readJoaquimCard();
        await G.say('narr_lanyard', { offscreen: true });
      }, { zoom: [1.04, 1.1] });
    } finally { G.cutscene = false; }
    F().in_pit = false; F().heist_done = true; F().pit_exchanges = 5;
    // back up the ladder; Inês has come back round by the arcade
    const p = G.player, v = G.npc('vasco');
    p.x = PIT[0] - 30; p.y = PIT[1] + 10; p.dir = 'e';
    if (v) { v.x = PIT[0] + 80; v.y = PIT[1] + 12; v.dir = 'w'; }
    F().ines_back = true; G.refreshNpcs();
    await say('ines_innocent', 'vasco_flustered', 'vasco_card');
    await joke('alan_thursday');
    F().vasco_thursday = true;
    await say('ines_handover');
    give('brotherhood_charter');
    await S.readJoaquimCard();
    await say('alan_donated');
    S.lore('joaquim_card');
    await say('ines_home');
    F().ines_back = false; G.refreshNpcs();
  };

  // Inês walks back into the cloister for the last exchange only
  ROOMS.se_cloister.npcs.push({ id: 'ines', x: 600, y: 650, dir: 'e', name: 'Inês', when: () => F().ines_back, look: 'narr_look_ines', talk: () => say('ines_home') });

  // ---------------------------------------------------------------- documents
  const PAPER = 'close:paper_aged';
  S.readJoaquimCard = () => G.closeup([{ img: PAPER, cls: 'doc-hand', html: `<p style="margin-top:3em">Deposited 1956 by J. Sanches.</p><p>Sealed.</p><p>Not to be exhibited.</p>` }]);
  S.readCharter = async function () {
    await G.closeup([{ img: PAPER, cls: 'doc-typed', html: `<p style="font-family:'IM Fell English',serif;text-align:center">RULE OF THE BROTHERHOOD OF THE DROWNED BELL<br>Lisbon, 1754</p>
      <p>I. The Sea has taken our husbands, our sons and our ships, and what is taken must be returned.</p>
      <p>II. We have caused a bell to be made, and have baptised it not in the font of the Church but in the font of the Sea, and named it for the Sea.</p>
      <p>III. The House of Lacerda stood as its godparents, and spoke the promise in its name: that when it rings, the Sea shall come, and bring our drowned home.</p>
      <p>IV. The founders have given their blood to the bronze, that the bell may know its fathers.</p>
      <p>V. Nine days the Sea shall pray. On the tenth, it shall be answered.</p>
      <p>VI. Let no brother sleep at the turning of the tide.</p>` }]);
    await say('alan_charter_read');
  };
  S.ITEMS.brotherhood_charter = { name: 'Charter of the Brotherhood', look: () => S.readCharter() };
  S.ITEMS.reserve_key = { name: "Dr. Teles's reserve key", look: 'alan_lanyard_far' };

  // ---------------------------------------------------------------- the register, back at the shop
  // Inês reads it as soon as Alan walks in; its last page sends him to the tavern
  S.readRegister = async function () {
    if (!F().heist_done || F().reserve_raided) return;
    const ines = G.npc('ines');
    await G.busy(async () => {
      if (ines) { ines.engaged++; }
      sfx('page');
      await say('ines_irmandade'); S.lore('irmandade');
      await say('ines_register_fado', 'ines_sketch_3');
      F().reserve_raided = true;
      if (ines) ines.engaged--;
    });
  };
  const shopEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (F().heist_done && !F().reserve_raided && G.npc('ines')) return S.readRegister();
    if (shopEnter) return shopEnter.call(this, entry);
  };

  window.EXTRA_STILLS = ['still_se_kiss', 'still_se_pit', 'still_se_reserve'];
})();
