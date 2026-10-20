// Chapter III — The Weeping Stone: convent (day), Sé bell tower, antiques.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;

  // ================================================================ CONVENT (day)
  const CONVENT_WALK = [[230, 560], [1050, 560], [1280, 640], [1280, 716], [0, 716], [0, 640]];
  S.CONVENT_WALK = CONVENT_WALK;
  ROOMS.convent = {
    name: 'Convento do Carmo', bg: 'convent', music: () => F().dawn ? 'main_theme' : 'carmo_day', ambience: 'convent', floor: 'stone', skyMask: 'convent_sky',
    fog: 0.22, fogRGB: '220,214,226',
    walk: CONVENT_WALK, scale: [560, 230, 716, 360],
    light: { ambient: 'rgb(218,212,224)', base: 0.9, rim: 'rgba(255,240,220,0.18)', rimSide: 1 },
    lights: [
      { x: 780, y: 120, rgb: '255,242,225', power: 0.3, reach: 1400, rim: 0.4, shadow: 0.45, floor: [780, 470], height: 900 },
      { x: 1158, y: 470, rgb: '255,150,90', kind: 'candle', seed: 3, glow: 60, ga: 0.25, power: 0.18, reach: 360, shadow: false },
    ],
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'] },
    layers: [{ img: 'convent_stone', x: 0, y: 0, full: true, when: () => F().stone_washed }],
    animBack(g, t) {
      FX.masked(g, G.mask(), m => {
        FX.drawClouds(m, S.dayClouds, t, 9, -20, 0.9);
        FX.birds(m, t, { y0: 40, y1: 220, n: 4, period: 17, color: 'rgba(60,55,70,0.75)', size: 8 });
      });
    },
    anim(g, t) { FX.shaft(g, [[740, 100], [830, 100], [900, 560], [680, 560]], '255,245,230', 0.06); FX.leaves(g, t, 600, 690, 23); },
    npcs: [
      { id: 'tomas', x: 640, y: 590, dir: 'w', loop: 'sweep', name: 'Father Tomás', look: 'narr_look_tomas', talk: () => S.talkTomas(),
        items: { file55: () => say('alan_ask_tomas_1955', 'tomas_notyet'), ledger: () => say('tomas_stone'), brotherhood_charter: () => S.tomasCharter(), any: 'alan_fail_07' } },
    ],
    ambient: [
      { id: 'npc_nun', name: 'A nun', frames: ['npc_nun', 'npc_nun_b'], talkFrames: ['npc_nun_talk', 'npc_nun'], talk: S.chat('chat_nun', ['nun_talk_1', 'alan_nun_1'], ['nun_talk_2']), x: 1112, y: 548, h: 214, dir: 'w', look: 'alan_npc_nun', idleHold: [7, 14], variantHold: [4, 7] },
    ],
    hotspots: [
      { name: 'Ruined arches', rect: [320, 0, 330, 500], look: 'narr_look_arches' },
      { name: 'Great window', rect: [700, 80, 170, 400], look: 'narr_look_convent' },
      { name: 'Side chapel', rect: [1118, 298, 80, 225], look: 'narr_look_chapel' },
      { name: 'Holy-water stoup', rect: [222, 436, 112, 110], at: [330, 600], face: 'w', look: 'narr_look_stoup', use: 'alan_stoup_hand',
        items: { glass: async () => {
          if (F().glassHoly) return say('alan_fail_04');
          F().glassHoly = true; G.renderInv(); sfx('pour', 0.6);
          await joke('alan_holy_glass');
          const tm = G.npc('tomas'); if (tm && Math.abs(tm.x - G.player.x) < 600) await say('tomas_once');
        }, any: 'alan_fail_05' } },
      { name: 'Weeping stone', rect: [40, 125, 175, 355], at: [255, 620], face: 'w',
        look: () => { F().saw_stone = true; return say(F().stone_washed ? 'narr_stone_washed' : 'narr_look_stone'); },
        use: () => F().stone_washed ? (F().stone_read ? S.openCipher() : say('alan_stone_nomag')) : say('alan_scrape'),
        items: {
          glass: async () => {
            if (!F().glassHoly) return say('alan_stone_crusted');
            if (S.needBells()) return say('alan_stone_wait');
            if (F().stone_washed) return say('alan_fail_04');
            G.takeItem('glass'); F().glassUsed = true; F().glassHoly = false;
            sfx('salt_fizz'); await G.wait(window.FAST ? 20 : 1200);
            F().stone_washed = true; await say('narr_stone_washed');
          },
          magnifier: async () => { if (!F().stone_washed) return say('alan_stone_crusted'); F().stone_read = true; await say('alan_stone_mag'); },
          ledger: async () => {
            if (!F().stone_washed) return say('alan_stone_crusted');
            if (!F().stone_read) return say('alan_stone_nomag');
            if (F().decoded) return say('alan_look_ledger_decoded');
            await S.openCipher();
          },
          any: 'alan_fail_03',
        } },
      { name: 'Iron grate', rect: [790, 588, 450, 108], at: [760, 650], face: 'e', look: 'narr_look_grate', use: async () => {
        await say('alan_grate');
        if (G.npc('tomas')) await say('tomas_grate');
      } },
      { name: 'Way out', rect: [0, 590, 60, 126], at: [30, 672], exit: 'map', entry: 'convent' },
    ],
    async enter() {
      if (F().ch >= 5) return G.goRoom('convent_night', 'map', { instant: true });
      if (!F().carmo_entered) { F().carmo_entered = true; await joke('alan_enter_carmo'); }
    },
  };
  // the Sé's charter opens Tomás up about bells; the stone waits until Alan has heard him
  // (saves from before the Sé chapter never had the charter, so they keep the old rule)
  S.needBells = () => F().ines_plan && !F().heard_bells;
  S.tomasCharter = async function () {
    if (F().charter_shown) return say('alan_fail_04');
    F().charter_shown = true;
    await say('tomas_charter'); await joke('alan_charter');
  };
  S.tomasBells = async function () {
    await say('tomas_baptism', 'tomas_reverse'); S.lore && S.lore('reverse');
    await say('tomas_godparents'); S.lore && S.lore('godparents');
    // tomas_novena is an optional follow-up now; tomas_renounce plays when the rite is decoded
    F().heard_bells = true; S.loreOrder && S.loreOrder();
  };
  S.talkTomas = async function () {
    await say('tomas_hello');
    if (S.gossip) await S.gossip('tomas');
    await G.dialog([
      // with the charter in his pocket Alan can just ask; the charter comes out first
      { line: 'alan_ask_tomas_bells', once: true, when: () => (F().charter_shown || G.has('brotherhood_charter')) && !F().heard_bells,
        run: async () => { if (!F().charter_shown) await S.tomasCharter(); await S.tomasBells(); } },
      { label: 'And the nine days?', once: true, when: () => F().heard_bells, run: async () => { await say('tomas_novena'); await joke('alan_novena'); } },
      { line: 'alan_ask_carmo', once: true, run: () => say('tomas_carmo') },
      { line: 'alan_ask_founders', once: true, run: async () => { await say('tomas_founders'); await joke('alan_twice'); } },
      { line: 'alan_ask_stone', once: true, run: () => say('tomas_stone') },
      { line: 'alan_ninth', once: true, run: () => say('tomas_iknow') },
      { line: 'alan_ask_tomas_1955', once: true, when: () => G.has('file55') || F().knows_1955_boy, run: () => say('tomas_notyet') },
      { label: 'Goodbye.', bye: true, run: () => say('tomas_bye') },
    ]);
  };

  // ---------------------------------------------------------------- the cipher wheel
  // shift 7, from Amália's fado
  S.openCipher = function () {
    const { ABC, shift, PLAIN } = S.cipher;
    const CIPHER = shift(PLAIN, 7);
    if (!G.has('ledger')) return say('alan_stone_mag');
    if (F().decoded) return say('alan_look_ledger_decoded');
    return new Promise(resolve => {
      const m = document.getElementById('cipher');
      let k = 0;
      const upd = () => {
        m.querySelector('.outer').textContent = ABC;
        m.querySelector('.inner').textContent = shift(ABC, k);
        m.querySelector('.ct').textContent = CIPHER;
        m.querySelector('.pt').textContent = shift(CIPHER, -k);
        m.querySelector('.shift').textContent = '';
      };
      upd();
      m.querySelector('.left').onclick = () => { k = (k + 25) % 26; sfx('stone_notch', 0.7, 0.9 + Math.random() * 0.2); upd(); };
      m.querySelector('.right').onclick = () => { k = (k + 1) % 26; sfx('stone_notch', 0.7, 0.9 + Math.random() * 0.2); upd(); };
      const close = async ok => {
        G.showModal('cipher', false);
        if (ok === null) return resolve();
        if (!ok) { await say('alan_cipher_wrong'); return resolve(); }
        F().decoded = true; F().decoded_v6 = true;
        await S.decodeScene();
        resolve();
      };
      m.querySelector('.done').onclick = () => close(k === 7);
      m.querySelector('.cancel').onclick = () => close(null);
      G.showModal('cipher', true);
    });
  };
  S.decodeScene = async function () {
    Sound.cue('bell_motif'); // the cipher gives, 1755 comes back: the bell's motif
    sfx('page');
    await G.say('narr_decode_1', { offscreen: true });
    await posed('read', () => say('alan_decode_1'));
    await G.showStill('still_1755', () => say('narr_1755'), { sepia: true, grain: true, zoom: [1.02, 1.14], pan: [[0.45, 0.5], [0.55, 0.48]] });
    await posed('read', async () => {
      await say('alan_rite_1');
      await G.say('narr_rite_2', { offscreen: true });
      await say('alan_page3_read');
      await G.say('narr_page3', { offscreen: true });
    });
    await say('tomas_renounce'); // moved here from the Bells topic: "At a baptism you renounce"
    await say('alan_page3', 'alan_surname');
    const tm = G.npc('tomas'); if (tm) { tm.engaged++; await say('tomas_order'); tm.engaged--; }
    else await say('tomas_order');
    // the midpoint: Tomás offers him the way out his grandfather took
    if (tm) tm.engaged++;
    await say('tomas_go_home', 'alan_choice');
    if (tm) tm.engaged--;
    F().chose_chiado = true;
    Sound.cue(null);
  };

  // ================================================================ SÉ BELL TOWER
  const BELLS = [
    { id: 'ferreira', name: 'Great bell', rect: [277, 30, 256, 290], at: [235, 650], face: 'e', text: 'FERREIRA · MDCXI', line: 'alan_bell_ferreira' },
    { id: 'bastos', name: 'Second bell', rect: [533, 90, 192, 260], at: [752, 645], face: 'w', text: 'BASTOS · MDCXLVIII', line: 'alan_bell_bastos' },
    { id: 'coutinho', name: 'Third bell', rect: [778, 150, 130, 215], at: [946, 635], face: 'w', text: 'COUTINHO · MDCCII', line: 'alan_bell_coutinho' },
    { id: 'sanches', name: 'Small bell', rect: [981, 190, 108, 155], at: [940, 635], face: 'e', text: 'SANCHES · MDCCXXXIX', line: 'alan_bell_sanches', joke: true },
  ];
  ROOMS.se_tower = {
    name: 'Sé de Lisboa · bell tower', bg: 'se_tower', music: 'se_bell_tower', ambience: 'tower', floor: 'wood',
    // Abílio's stool with his cap and thermos (legs traced one by one, floor shows between them)
    occluders: [{ y: 672, polys: [
      [[1104, 505], [1150, 490], [1158, 463], [1190, 463], [1192, 540], [1230, 548], [1228, 566], [1098, 566], [1096, 548], [1104, 540]],
      [[1098, 566], [1113, 566], [1113, 676], [1086, 676]], [[1160, 566], [1180, 566], [1183, 676], [1164, 676]],
      [[1212, 566], [1228, 566], [1241, 665], [1222, 668]], [[1105, 618], [1215, 618], [1215, 631], [1105, 631]],
    ] }],
    // in front of the two big bells (their ropes reach the floor at y 612 and 599), and not into Abílio's stool
    walk: [[164, 616], [775, 616], [795, 592], [1280, 592], [1280, 634], [1078, 634], [1078, 682], [1280, 682], [1280, 716], [0, 716], [0, 650]],
    scale: [592, 330, 716, 402],
    light: { ambient: 'rgb(200,195,185)', base: 0.78, rim: 'rgba(235,230,215,0.2)', rimSide: 1 },
    lights: [
      { x: 590, y: 260, rgb: '230,232,235', power: 0.28, reach: 1100, rim: 0.5, shadow: 0.5, floor: [590, 560], height: 700 },
      { x: 1080, y: 300, rgb: '230,232,235', power: 0.2, reach: 800, rim: 0.4, floor: [1080, 580], height: 700, shadow: false }, // window glow: no hard shadow
    ],
    entries: { default: [150, 670, 'e'], map: [150, 670, 'e'] },
    layers: [
      { img: 'bell1', x: 0, y: 0, swing: t => 0.25 * Math.sin(t * 0.5), pivot: [405, 20], cut: true },
    ].filter(() => false),
    anim(g, t) {
      for (const [x0, y0, w] of [[290, 280, 240], [565, 280, 160], [790, 290, 110]]) FX.shaft(g, [[x0 + w * 0.3, 80], [x0 + w * 0.55, 80], [x0 + w * 0.6 + 120, 600], [x0 + w * 0.2 + 120, 600]], '230,232,236', 0.05);
      FX.motes(g, t, 250, 100, 900, 480, 40, '240,235,220');
      FX.birds(g, t + 7, { y0: 60, y1: 110, n: 1, period: 13, color: 'rgba(80,80,85,0.8)', size: 9, x0: 300, x1: 1100 });
    },
    npcs: [
      { id: 'abilio', x: 1060, y: 640, dir: 'w', name: 'Senhor Abílio', look: 'narr_look_abilio', talk: () => S.talkAbilio(),
        items: { notebook: () => S.writeAbilio(), any: 'alan_fail_abilio_item' } },
    ],
    hotspots: [
      { name: 'Bell ropes', rect: [380, 300, 330, 300], look: 'narr_look_ropes', use: 'alan_rope' },
      { name: 'Louvres', rect: [560, 160, 600, 240], look: 'narr_look_louvres' },
      // the bells last, so they win over the louvres and ropes behind them
      ...BELLS.map(b => ({ name: b.name, rect: b.rect, at: b.at, face: 'n', look: 'narr_look_bell_tower', use: 'alan_rope',
        items: { magnifier: async () => {
          await S.showBellMark(b.text);
          F()['bell_' + b.id] = true;
          await posed('write', () => b.joke ? joke(b.line) : say(b.line));
          if (BELLS.every(x => F()['bell_' + x.id]) && !F().founder_order) await S.orderKnown();
        }, any: 'alan_fail_09' } })),
      { name: 'Stairs down', rect: [0, 160, 260, 460], at: [80, 680], exit: 'map', entry: 'se_tower' },
    ],
    async enter() {
      if (!F().se_entered) { F().se_entered = true; await joke('alan_climb'); sfx('pigeons'); await say('abilio_hello'); }
    },
  };
  // the order is known once all four bells are read and Abílio has explained the founders' blood
  // (saves from before the Sé chapter keep the old rule: the bells alone)
  S.orderKnown = async function () {
    if (F().founder_order) return;
    if (F().ines_plan && !F().heard_blood) return say('alan_order_wait');
    F().founder_order = true; await say('alan_order'); S.loreOrder && S.loreOrder();
  };
  let mishear = 0;
  S.talkAbilio = async function () {
    if (F().abilio_writing) return S.writeAbilio();
    const lines = [['alan_abilio_founders', 'abilio_borders'], ['alan_abilio_joaquim', 'abilio_joints'], ['alan_abilio_bells', 'abilio_smells']];
    const [a, b] = lines[mishear++ % lines.length];
    sfx('hearing_aid', 0.5); await say(a, b);
  };
  S.writeAbilio = async function () {
    const ab = G.npc('abilio'), p = G.player;
    if (!F().abilio_writing) { F().abilio_writing = true; await joke('alan_write_abilio'); }
    if (S.gossip) await S.gossip('abilio');
    // Alan writes each question (the notebook out the whole time), holds it out, and Abílio reads it
    const read = async ms => { p.pose = 'reach'; ab.pose = 'read'; await G.wait(window.FAST ? 20 : ms); ab.pose = null; p.pose = 'write'; };
    p.pose = 'write';
    try { await G.dialog([
      // 'YOURS HAS FOUR FAMILIES' needs him to know Alan is a Sanches: the Joaquim note comes first
      { line: 'alan_w_blood', once: true, when: () => !F().heard_blood && F().abilio_joaquim, run: async () => {
        await read(700);
        await say('abilio_blood', 'abilio_drowned'); S.lore && S.lore('blood');
        await say('abilio_order'); // abilio_tongue is an optional follow-up now
        F().heard_blood = true;
        if (BELLS.every(x => F()['bell_' + x.id])) await S.orderKnown();
      } },
      { label: 'Write: "And the tongue?"', once: true, when: () => F().heard_blood, run: async () => { await read(700); await say('abilio_tongue'); } },
      // the sketch from Lacerda's case: the drowned bell's tongue, and its twin in the Sé reserve
      { line: 'alan_w_sketch', once: true, when: () => F().tongue_sketched && !F().knows_twin, run: () => S.abilioSketch(read) },
      { line: 'alan_w_joaquim', once: true, run: async () => { await read(700); await say('abilio_joaquim', 'gag_abilio_1', 'gag_alan_abilio', 'gag_abilio_2'); F().abilio_joaquim = true; } },
      { line: 'alan_w_1955', once: true, run: async () => { await read(700); await say('abilio_1955'); } },
      { line: 'alan_w_backward', once: true, run: async () => { await read(700); await say('abilio_backward_2'); } },
      { line: 'alan_w_order', run: async () => { await read(600); ab.pose = 'point'; await say('abilio_eyes'); ab.pose = null; } },
      { label: 'Goodbye.', bye: true, run: async () => { p.pose = null; await say('abilio_bye'); } },
    ]); } finally { p.pose = null; }
  };

  S.abilioSketch = async function (read) {
    const ab = G.npc('abilio');
    await read(900);
    await say('abilio_sketch');
    if (ab) ab.pose = 'point';
    await say('abilio_twin'); if (ab) ab.pose = null;
    await say('abilio_twin_where');
    F().knows_twin = true; S.lore && S.lore('twin');
    G.player.pose = 'write'; await say('alan_twin_plan');
  };

  // ================================================================ ANTIGUIDADES LACERDA
  ROOMS.antiques = {
    name: 'Antiguidades Lacerda', bg: 'antiques', music: 'antiques_shop', ambience: 'clocks', floor: 'wood',
    walk: [[0, 650], [460, 555], [1280, 555], [1280, 716], [0, 716]],
    scale: [555, 330, 716, 410],
    light: { ambient: 'rgb(205,172,128)', base: 0.8, rim: 'rgba(255,200,120,0.18)', rimSide: -1 },
    lights: [
      { x: 730, y: 150, rgb: '255,210,140', glow: 120, ga: 0.12, power: 0.38, reach: 900, floor: [730, 530], height: 600 },
      { x: 765, y: 375, rgb: '120,255,180', kind: 'pulse', seed: 1, glow: 50, ga: 0.08, power: 0.08, reach: 300, shadow: false, when: () => !F().has_tongue },
    ],
    occluders: [{ y: 640, base: [[0, 632], [437, 548]], polys: [ // the counter is painted at an angle: its foot runs from (0,632) to (437,548)
      [[0, 362], [70, 356], [436, 356], [447, 366], [443, 382], [437, 384], [437, 545], [428, 551], [0, 636]],
      [[150, 334], [250, 334], [252, 368], [148, 368]],
    ] }],
    layers: [
      { img: 'antiques_clock', x: 539, y: 218 },
      { img: 'antiques_weights', x: 543, y: 228 },
      { img: 'antiques_pendulum', x: 544, y: 224, pivot: [571, 228], swing: t => 2.4 * Math.sin(t * Math.PI) },
      { img: 'antiques_case_tongue', x: 0, y: 0, full: true, when: () => !F().grabbed }, // the tongue on the velvet (after the swap, its identical twin)
      { img: 'antiques_case', x: 686, y: 291, when: () => F().grabbed }, // lifted without a swap: bare velvet, until he notices
      { img: 'antiques_photo', x: 372, y: 322 }, // Afonso and the boy, in a frame on the counter (every state)
    ],
    entries: { default: [640, 690, 'n'], map: [640, 690, 'n'] },
    anim(g, t) { FX.motes(g, t, 560, 80, 380, 420, 24, '255,220,170'); },
    npcs: [
      { id: 'lacerda', x: 250, y: 545, h: 348, dir: 'e', at: [540, 615], name: 'Senhor Lacerda', look: 'narr_look_lacerda', talk: () => S.talkLacerda(),
        items: { ledger: () => say('lacerda_charming'), tongue: () => say('lacerda_putback'), twin: () => say('lacerda_hands'), any: 'alan_fail_lacerda_item' } },
    ],
    hotspots: [
      { name: 'Clocks', rect: [0, 0, 480, 230], look: 'narr_look_clocks' },
      { name: 'Tagged clocks', rect: [150, 230, 330, 110], at: [520, 600], face: 'w', look: async () => {
        await say('narr_look_tagged');
        await S.showClocks();
        F().saw_jc_clock = true;
        await say('alan_jc');
      } },
      { name: 'Photograph', rect: [366, 316, 46, 54], at: [520, 600], face: 'w', look: async () => {
        await say('narr_look_afonso', 'alan_look_afonso');
        F().saw_afonso = true;
      } },
      { name: 'Grandfather clock', rect: [500, 10, 140, 510], look: 'narr_look_clocks' },
      { name: "Ship's bell", rect: [680, 70, 140, 200], look: 'narr_look_antiques' },
      { name: 'Curios', rect: [880, 20, 240, 280], look: 'narr_look_antiques' },
      { name: 'Music box', rect: [928, 318, 130, 125], at: [990, 600], face: 'n',
        look: async () => { await say('narr_look_musicbox'); F().saw_box = true; } }, // the recognition plays when Alan asks Lacerda about it
      { name: 'Display case', rect: [655, 285, 215, 240], at: [760, 605], face: 'n',
        look: () => { F().case_known = true; return F().has_tongue ? say('narr_look_case_twin') : (F().saw_case ? (F().tongue_sketched ? joke('alan_look_case') : S.sketchTongue()) : (F().saw_case = true, say('narr_look_case').then(() => S.sketchTongue()))); },
        use: () => S.lacerdaHere() ? say('lacerda_hands') : say(F().case_open ? 'alan_noswap' : 'alan_case_locked'),
        take: () => S.lacerdaHere() ? say('lacerda_hands') : F().case_open ? S.grabTongue() : say('alan_case_locked'),
        items: {
          vkey: async () => {
            if (S.lacerdaHere()) return say('lacerda_hands');
            if (F().case_open) return say('alan_fail_04');
            F().case_open = true;
            sfx('case_open');
            await say('alan_case_open');
          },
          magnifier: () => F().tongue_sketched ? joke('alan_look_case') : S.sketchTongue(),
          notebook: () => F().tongue_sketched ? joke('alan_look_case') : S.sketchTongue(),
          // the twin from the Sé reserve: same pour, same marks, same weight
          twin: async () => {
            if (S.lacerdaHere()) return say('lacerda_hands');
            if (!F().case_open) return say('alan_case_locked');
            G.takeItem('twin'); give('tongue'); F().has_tongue = true; F().swapped = true; F().twin_swapped = true;
            sfx('brass_heavy', 0.5);
            await say('alan_swap_twin');
          },
          any: 'alan_fail_lacerda_item',
        } },
      { name: 'Leave the shop', rect: [0, 690, 1280, 30], at: [640, 712], exit: 'map', entry: 'antiques' },
    ],
    // three actions while Lacerda is in the back room
    async onAction(t, verb) {
      if (!F().lac_away || verb === 'look' || verb === 'talk') return;
      F().lac_actions = (F().lac_actions || 0) + 1;
      if (F().lac_actions >= 3 || F().swapped) await S.lacerdaReturns();
    },
    leave() {
      if (F().has_tongue && !F().slipped) { F().slipped = true; }
      if (F().lac_away && !F().swapped) {
        F().lac_away = false;
        F().lac_actions = 0;
        F().case_open = false;
        if (F().grabbed) { G.takeItem('tongue'); F().grabbed = false; F().has_tongue = false; }
      }
    },
    async enter() {
      if (F().has_tongue && !F().slip_said) { /* returning later */ }
      // the first sight of him: the cream suit Celeste described
      if (!F().lac_suit_seen && S.lacerdaHere()) { F().lac_suit_seen = true; await say('alan_suit_recognise', 'lacerda_weather'); }
    },
  };
  S.lacerdaHere = () => { const l = G.npc('lacerda'); return l && l.visible; };
  // Alan can't touch it, so he draws it: the notebook page Abílio will read
  S.sketchTongue = async function () {
    if (F().tongue_sketched) return joke('alan_look_case');
    const p = G.player; p.dir = 'n';
    await S.posed('write', () => say('alan_sketch_tongue'));
    F().tongue_sketched = true; sfx('page'); S.lore && S.lore('case');
  };
  S.grabTongue = async function () {
    // taking it without a swap: he'll notice the velvet
    G.npc('lacerda'); F().grabbed = true; give('tongue');
    await say('alan_noswap');
  };
  S.talkLacerda = async function () {
    // they have never met: he knows of Alan only as the last Sineiro (said once; later talks open without it)
    if (!F().lac_greeted) { F().lac_greeted = true; await say('lacerda_hello_2'); }
    await G.dialog([
      { line: 'alan_lac_clocks', once: true, run: async () => {
        await say('lacerda_clocks');
        await joke('alan_collect');
        await say('lacerda_charming');
        await S.showClocks();
        F().saw_jc_clock = true;
        await say('alan_jc');
      } },
      { line: 'alan_lac_case', once: true, run: async () => { await say('lacerda_case', 'lacerda_velvet'); F().case_known = true; } },
      { line: 'alan_lac_joaquim', once: true, run: () => say('lacerda_joaquim_day') },
      { line: 'alan_lac_fog', once: true, run: () => say('lacerda_fog') },
      { line: 'alan_lac_family', once: true, run: () => say('lacerda_godfather', 'lacerda_waiting') },
      { line: 'alan_lac_box', when: () => F().saw_box && !F().has_tongue, bye: true, run: () => S.lacerdaLeaves() },
      { label: 'Goodbye.', bye: true, run: () => say('lacerda_bye') },
    ]);
  };
  S.lacerdaLeaves = async function () {
    // Alan knows the box: it's on the shelf behind his grandfather in Amália's photograph
    if (!F().box_recognised) { F().box_recognised = true; await say('alan_recognise'); await say('lacerda_trinket'); }
    await say('lacerda_box');
    const lac = G.npc('lacerda'); lac.h = null;
    await lac.walkTo(470, 565); await lac.walkTo(1190, 565);
    lac.visible = false; F().lac_away = true; F().lac_actions = 0;
  };
  S.lacerdaReturns = async function () {
    const lac = G.npc('lacerda');
    F().lac_away = false;
    lac.visible = true; lac.x = 1190; lac.y = 575; lac.h = null;
    await lac.walkTo(990, 600); lac.dir = 'w';
    if (F().grabbed && !F().swapped) {
      await say('lacerda_putback');
      G.takeItem('tongue'); F().grabbed = false; F().has_tongue = false; F().case_open = false;
      await lac.walkTo(470, 565); await lac.walkTo(250, 545); lac.h = 348; lac.dir = 'e'; // back behind the counter, the size he stands there at
      return;
    }
    await say('lacerda_back_box');
    lac.pose = 'wind'; S.musicBox = sfx('music_box');
    await G.wait(window.FAST ? 20 : 4500);
    lac.pose = null;
    if (F().swapped) {
      F().case_open = false;
      await say('lacerda_pale');
      await G.player.walkTo(640, 712);
      await joke('alan_slip');
      if (S.musicBox) { S.musicBox.stop(1.5); S.musicBox = null; }
      await G.goRoom('map', 'antiques');
    } else {
      F().case_open = false;
      await say('lacerda_another');
      await lac.walkTo(470, 565); await lac.walkTo(250, 545); lac.h = 348; lac.dir = 'e'; // back behind the counter, the size he stands there at
    }
  };

  // the chapter closes in the shop: the tongue on the counter, the salt pages
  S.ch3End = async function () {
    if (F().ch3_done) return;
    F().ch3_done = true;
    if (F().twin_swapped) await say('ines_vandal2', 'gag_alan_vandal2', 'ines_promise', 'gag_alan_promise');
    else { await say('ines_vandal'); await joke('alan_vandal'); }
    await say('ines_salt_pages');
    G.takeItem('ledger'); F().ledger_with_ines = true;
    const ines = G.npc('ines');
    if (ines) { ines.pose = 'steam'; F().steaming = true; sfx('kettle_boil', 0.5); }
    await say('ines_steam');
    // twenty minutes with the kettle: Duarte drops by with Amália's message, plays her song,
    // and takes Alan upstairs (saves from before the flirt was a puzzle just get the message)
    await say('ines_twenty'); F().pages_steaming = true;
    await G.wait(window.FAST ? 20 : 3000);
    if (F().flirted_guitar && !F().visit_guitar && G.image('bg:bedroom')) await S.visitGuitar();
    else F().amalia_box = true;
    // a quarter past five, in the Chiado…
    await G.fade(true);
    await G.goRoom('antiques', null, { instant: true, noEnter: true, noSave: true });
    G.player.visible = false;
    const lac = G.npc('lacerda'); lac.visible = true; lac.h = null; lac.x = 520; lac.y = 600; lac.dir = 'e';
    await G.fade(false);
    await lac.walkTo(700, 600); lac.dir = 'e';
    await G.say('narr_ch3_lacerda2', { offscreen: true }); // the chapter only ends after the swap (the old brass-weight line is retired)
    await G.fade(true);
    F().steaming = false;
    await S.chapter(4, 'narr_ch4_card');
    await G.goRoom('shop', null, { instant: true, noEnter: true, pos: [560, 610, 'e'] });
    G.player.visible = true;
    // back from the café: if Duarte stayed upstairs, he's downstairs now, charming Inês
    if (F().duarte_scene && !F().duarte_ines && S.duarteInes) await S.duarteInes();
    else await G.fade(false);
    await S.ch4Start();
  };
})();
