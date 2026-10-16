// Chapter I, the Sé: the museum ("Lisboa e o Mar, 1700–1755"), the cloister dig and
// the treasury reserve. Inês has seen the tile's seal on a sealed case in the reserve;
// the curator, Dr. Vasco Teles, wears its key round his neck. Alan keeps him busy in
// the Sanches casting pit while Inês borrows the Brotherhood's charter and register.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  S.CHARS.vasco = { scale: 1.0, frames: {
    idle: ['vasco', 'vasco_idle2', 'vasco_idle3'], talk: ['vasco_talk', 'vasco_talk2', 'vasco_talk3'], walk: ['vasco_walk1', 'vasco_pass1', 'vasco_walk2', 'vasco_pass2'],
    poses: { kneel: 'vasco_kneel', climb: 'vasco_climb', trowel: 'vasco_trowel', coffee: 'vasco_coffee',
      fluster: 'vasco_fluster', laugh: 'vasco_laugh', sheepish: 'vasco_idle3', find: 'vasco_find', give: 'vasco_give',
      kneeltalk: 'vasco_kneel_talk', sit: 'vasco_sit' }, front: 'vasco_front', back: 'vasco_back' } };
  S.CHARS.vasco.seatedFrames = /^vasco_(kneel|kneel_talk|sit)$/; // these sway from the knees / the seat
  if (window.SPRITES.vasco_pass1) S.CHARS.vasco.frameStep = 0.085; else S.CHARS.vasco.frames.walk = ['vasco_walk1', 'vasco_walk2'];
  // his full range: every frame below is optional, only painted ones are used (as in ines.js)
  {
    const has = k => !!window.SPRITES[k], VF = S.CHARS.vasco.frames, VP = VF.poses;
    const more = (key, list) => { for (const k of list) if (has(k) && !VF[key].includes(k)) VF[key].push(k); };
    more('idle', ['vasco_idle4']); more('talk', ['vasco_talk4']);
    const walk4 = (a, b, c, d) => [a, b, c, d].every(has) ? [a, b, c, d] : null;
    const fw = walk4('vasco_front_walk1', 'vasco_front', 'vasco_front_walk2', 'vasco_front'), bw = walk4('vasco_back_walk1', 'vasco_back', 'vasco_back_walk2', 'vasco_back');
    if (fw && bw) { VF.frontWalk = fw; VF.backWalk = bw; }
    for (const k of ['delight', 'tender', 'deflate', 'worried', 'scandalised', 'amused', 'stern', 'hopeful']) if (has('vasco_' + k)) VP[k] = 'vasco_' + k;
    // Thursday: the trowel stays in his hand while he talks
    if (has('vasco_trowel_talk')) VF.sets = { trowel: { idle: ['vasco_trowel'], talk: ['vasco_trowel_talk', 'vasco_trowel'] } };
  }
  // his tells: the collar when he's flattered, the hand over the mouth when he's nervous
  const VPOSE = { fluster: ['vasco_lanyard', 'vasco_much_1', 'vasco_much_2', 'vasco_much_4', 'vasco_flustered', 'vasco_kiss'],
    laugh: ['vasco_much_3', 'vasco_much_5', 'vasco_stall'],
    sheepish: ['vasco_hello', 'vasco_little_2', 'vasco_cameo', 'vasco_thursday_then'],
    find: ['vasco_busy', 'vasco_coins', 'vasco_fragment', 'vasco_tag'], give: ['vasco_card', 'vasco_store_loan'],
    // the painted moods, where they exist (they override the stand-ins above)
    delight: ['vasco_pit', 'vasco_bottom', 'vasco_layers', 'vasco_marks'],
    tender: ['vasco_quiet', 'vasco_sleep', 'vasco_dirt', 'vasco_collar'],
    deflate: ['vasco_little_1', 'vasco_little_3', 'vasco_little_4', 'vasco_little_5'],
    worried: ['vasco_fall'],
    scandalised: ['vasco_much_3'],
    amused: ['vasco_rope', 'vasco_closed', 'vasco_loan'],
    hopeful: ['vasco_cameo', 'vasco_thursday_then', 'vasco_thursday_truth', 'vasco_thu_down', 'vasco_after_2'] };
  // the twin and the reserve (Chapter III), and Thursday's debt
  Object.assign(VPOSE, { deflate: VPOSE.deflate.concat(['vasco_hook', 'vasco_thu_pause', 'vasco_not_here']),
    tender: VPOSE.tender.concat(['vasco_forgive', 'vasco_thu_catalogue', 'vasco_love_1', 'vasco_love_2']),
    worried: VPOSE.worried.concat(['vasco_what']), laugh: VPOSE.laugh.concat(['vasco_love_tie', 'vasco_after_1']) });
  for (const [pose, ids] of Object.entries(VPOSE)) if (S.CHARS.vasco.frames.poses[pose]) ids.forEach(id => { S.LINE_POSE[id] = ['vasco', pose]; });
  // his face answers Alan's lines while he's in the scene (the mood each one gets; others, now and then, a smile)
  const VREACT = { alan_vasco_hello: 'amused', alan_relation: 'laugh', alan_romantic: 'tender', alan_vasco_flirt: 'fluster', alan_bottom: 'scandalised',
    alan_close: 'fluster', alan_lanyard: 'fluster', alan_collar: 'hopeful', alan_standards: 'stern', alan_monument: 'laugh', alan_thursday: 'delight',
    alan_fine: 'worried', alan_cameo: 'delight', alan_romans: 'tender', alan_wait: 'hopeful', alan_documents: 'amused', alan_pit_ladder: 'fluster',
    alan_ask_pit: 'delight', alan_ask_marks: 'delight', alan_ask_frags: 'delight', alan_layers: 'laugh', alan_kneel: 'amused', alan_dirt: 'tender',
    alan_coins: 'fluster', alan_quiet: 'tender', alan_toss_ines: 'worried',
    alan_ask_vasco_twin: 'worried', alan_vasco_sorry: 'deflate', alan_vasco_clapper: 'worried', alan_owe_one: 'tender', gag_alan_withhold: 'stern',
    alan_thu_truth: 'worried', alan_thu_return: 'delight', alan_thu_owe: 'hopeful', alan_love_1: 'tender' };
  const vreact = function (id) {
    if (!/^(alan_|gag_alan_)/.test(id)) return null;
    const a = G.npc('vasco'), P = S.CHARS.vasco.frames.poses;
    if (!a || !a.visible || a.set || a.walking || a.pose || a.talking || !G.player || !G.player.visible) return null;
    let k = VREACT[id] || (/_much$/.test(id) ? 'scandalised' : /_little$/.test(id) ? 'deflate' : null);
    if (!k && Math.random() < 0.4) k = ['amused', 'tender', 'amused', 'delight'][Math.floor(Math.random() * 4)];
    if (!k || !P[k]) return null;
    a.pose = k;
    return () => { if (a.pose === k) a.pose = null; };
  };
  (S.listeners || (S.listeners = [])).push(vreact);
  S.CHARS.alan.frames.poses.coffees = 'alan_coffees'; // Thursday morning: two coffees
  // Alan and Vasco painted together (Alan left, Vasco right): played as Alan's pose with Vasco hidden,
  // anchored on the middle of the couple
  ['catch', 'lanyard', 'thumb', 'kneel', 'kiss', 'card', 'fragment', 'coffee', 'ladder', 'clapper', 'shelf', 'tie'].forEach(k => { S.CHARS.alan.frames.poses['pair_vasco_' + k] = 'pair_vasco_' + k; });
  S.vpair = function (k) {
    const key = 'pair_vasco_' + k, p = G.player, v = G.npc('vasco');
    if (!window.SPRITES[key] || !v || !v.visible) return null;
    const keep = { px: p.x, py: p.y, pd: p.dir, vp: v.pose };
    const left = Math.min(p.x, v.x), right = Math.max(p.x, v.x);
    p.x = (left + right) / 2; p.y = Math.max(p.y, v.y); p.dir = 'e'; p.pose = key; v.visible = false;
    return () => { p.pose = null; p.x = keep.px; p.y = keep.py; p.dir = keep.pd; v.visible = true; v.pose = keep.vp; };
  };
  S.withPair = async function (k, fn) { const undo = S.vpair(k); try { await fn(); } finally { if (undo) undo(); } };
  // the two of them sitting on the ladder / kneeling in the pit sway from the seat, not the feet
  if (!S.CHARS.alan.seatedFrames) S.CHARS.alan.seatedFrames = /^pair_vasco_(ladder|kneel)$/;
  S.CHARS.alan.frames.poses.pair_vasco_shirtless = 'pair_vasco_shirtless'; // the two of them, shirts off (not yet placed in a scene)
  if (window.SPRITES.ines_plaque) S.CHARS.ines.frames.poses.plaque = 'ines_plaque';

  // Inês is at the Sé from the plan until she has the register; the shop is empty meanwhile
  const inesAtSe = () => F().ines_plan && !F().heist_done && F().ch === 1;
  S.inesAtSe = inesAtSe;
  // Vasco keeps digging all of Chapter I; in Chapter III he's back in the cloister once, hoping
  // (and, once Abílio has told Alan about the twin, he's there to be asked for it)
  const vascoHere = () => F().ch <= 1 || (F().ch === 3 && (F().vasco_thursday || F().knows_twin)) || F().thursday;

  // Alan's notebook: lore entries collect as they're learned (the page itself is in docs.js)
  S.lore = function (key) {
    const L = F().lore || (F().lore = []);
    if (L.includes(key)) return;
    L.push(key); G.toast('Notebook updated'); sfx('page');
  };
  S.loreOrder = () => { if (F().founder_order && F().heard_bells) S.lore('order'); };

  // ---------------------------------------------------------------- the exhibits
  // two the plan needs (the panorama and the alminhas), four for the curious
  const EXHIBITS = {
    panorama: { need: true, lines: ['ines_panorama', 'alan_panorama'] },
    gold: { lines: ['ines_gold', 'alan_gold'] },     // optional since the exposition cap
    exvoto: { lines: ['ines_exvoto', 'alan_exvoto'] },
    alminhas: { need: true, lines: ['ines_nograve', 'ines_saudade', 'alan_saudade'] },
    htm: { lines: ['ines_htm', 'alan_htm'] },
    engraving: { lines: ['ines_1755', 'alan_1755'] },
  };
  S.exhibit = async function (id) {
    const ex = EXHIBITS[id], seen = F().se_seen || (F().se_seen = {});
    const ines = G.npc('ines');
    // without Inês to explain, Alan only has his half of it
    const lines = ines && ines.visible ? ex.lines : ex.lines.filter(l => l.startsWith('alan_'));
    // Alan goes up to the exhibit, and she comes over to it too rather than lecturing him from across the room
    const spot = (G.room.hotspots || []).find(h => h.at && /S\.exhibit\('(\w+)'\)/.exec(String(h.look)) && RegExp.$1 === id), p = G.player;
    if (spot && p.visible && !window.FAST && Math.hypot(spot.at[0] - p.x, spot.at[1] - p.y) > 90) { await p.walkTo(spot.at[0], spot.at[1]); p.dir = spot.face || p.dir; }
    if (ines && ines.visible && !ines.pose && !window.FAST && Math.abs(ines.x - p.x) > 260) { const sd = ines.x < p.x ? -1 : 1; await ines.walkTo(p.x + sd * 150, Math.max(620, Math.min(700, p.y + 4))); }
    if (ines && ines.visible) { ines.dir = ines.x < G.player.x ? 'e' : 'w'; if (window.SPRITES.ines_plaque) ines.pose = 'plaque'; }
    try { await say(...lines); } finally { if (ines) ines.pose = null; }
    if (ex.need && !seen[id]) { seen[id] = true; F().se_exhibits = Object.keys(EXHIBITS).filter(k => EXHIBITS[k].need && seen[k]).length; }
  };

  S.talkInesSe = async function () {
    const NEED = Object.values(EXHIBITS).filter(e => e.need).length;
    if (!F().ines_se_talked && !(F().se_exhibits >= NEED)) { F().ines_se_talked = true; return say('ines_look_first'); }
    if (F().se_exhibits >= NEED && !F().se_plan_on) {
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
    name: 'Sé de Lisboa · museum', bg: 'se_museum', music: 'church', ambience: 'museum', acoustic: 'convent', floor: 'stone',
    // in front of the guard's chair and off the foot of the left stanchion
    walk: [[0, 680], [66, 676], [70, 648], [440, 608], [800, 610], [1000, 603], [1015, 616], [1160, 616], [1175, 602], [1280, 610], [1280, 716], [0, 716]],
    occluders: [{ y: 670, polys: [[[24, 500], [46, 500], [48, 516], [41, 524], [41, 648], [62, 660], [63, 672], [4, 672], [6, 660], [29, 648], [29, 524], [22, 516]]] }], // the left stanchion, knob to foot
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
      { id: 'npc_tourists', name: 'Tourists', frames: ['npc_tourists', 'npc_tourists_b'], x: 200, y: 662, h: 315, look: 'alan_npc_tourists', idleHold: [5, 9], variantHold: [3, 5] },
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
  // Standing IN the pit: feet on the line of its near rim (y = PIT_RIM), sized for the pit floor,
  // and sunk so the rim cuts them at the hips (the engine clips a sunk figure at its feet line).
  // Whoever is placed inside the opening is staged that way, whoever steps out is restored.
  const PIT_RIM = 606, PIT_X = [622, 952], PIT_H = 262, PIT_SINK = 0.42, PIT_LADDER = 812;
  const PIT_WALK = [[626, 604], [948, 604], [948, 607.5], [626, 607.5]];
  const FLOOR_WALK = [[0, 600], [220, 568], [540, 560], [556, 624], [1064, 618], [1150, 604], [1280, 612], [1280, 716], [0, 716]];
  const inPit = a => a.x >= PIT_X[0] && a.x <= PIT_X[1] && a.y > 560 && a.y < 609;
  const pitStage = a => {
    if (!a) return;
    // kneeling or sitting, they'd vanish behind the rim: the camera cheats them up a little so heads and shoulders show
    if (inPit(a)) { a._pit = true; a.sink = /kneel|ladder/.test(String(a.pose || '')) ? PIT_SINK - 0.12 : PIT_SINK; a.h = PIT_H; }
    else if (a._pit) { a._pit = false; a.sink = 0; a.h = null; }
  };
  S.PIT_RIM = PIT_RIM;
  ROOMS.se_cloister = {
    name: 'Sé de Lisboa · cloister', bg: 'se_cloister', bgs: ['se_cloister_morning'], bgFn: () => F().thursday ? 'se_cloister_morning' : 'se_cloister', music: null, ambience: 'cloister', acoustic: 'convent', floor: 'stone',
    // round the open pit, never into it; once Alan is down in it, along its floor
    get walk() { return F().in_pit ? PIT_WALK : FLOOR_WALK; },
    scale: [565, 250, 716, 345],
    light: { ambient: 'rgb(222,220,214)', base: 0.9, rim: 'rgba(255,245,225,0.18)', rimSide: -1 },
    lights: [
      { x: 660, y: 250, rgb: '238,240,244', power: 0.34, reach: 1400, rim: 0.5, shadow: 0.5, floor: [660, 520], height: 700 }, // daylight from the garth
    ],
    entries: { default: [1190, 650, 'w'], se_museum: [1190, 650, 'w'], se_tower: [140, 640, 'e'] },
    anim(g, t) { pitStage(G.player); pitStage(G.npc('vasco')); FX.leaves(g, t, 600, 690, 11); },
    leave() { for (const a of [G.player, G.npc('vasco')]) if (a && a._pit) { a._pit = false; a.sink = 0; a.h = null; } },
    async enter() { if (F().ch === 3 && F().vasco_thursday && !F().vasco_cameo) await S.cloisterCh3(); },
    npcs: [
      { id: 'vasco', x: 1110, y: 640, dir: 'w', name: 'Dr. Vasco Teles', when: vascoHere, look: 'narr_look_vasco', talk: () => S.talkVasco(),
        items: { any: 'alan_fail_04' },
        init: a => { if (F().in_pit || (F().ch === 3 && F().vasco_thursday && !F().vasco_cameo)) { a.x = 870; a.y = PIT_RIM; } } },
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
        look: 'narr_look_stair', use: async () => {
          if (!(F().ch >= 3 && F().decoded)) return say('alan_stair_chained');
          if (F().vasco_thursday && !F().stair_beat) { F().stair_beat = true; G.player.dir = 'w'; await say('alan_stair'); }
          await G.goRoom('se_tower', 'map');
        } },
      { name: 'Museum', rect: [1130, 200, 130, 330], at: [1200, 630], exit: 'se_museum', entry: 'se_cloister' },
    ],
  };

  // ---------------------------------------------------------------- Vasco
  S.talkVasco = async function () {
    // Chapter III: Alan comes to ask for the twin, honestly this time
    if (F().ch === 3 && F().knows_twin && !F().twin_lent) {
      if (F().vasco_thursday && !F().vasco_cameo) await S.cloisterCh3();
      return G.dialog([
        { line: 'alan_ask_vasco_twin', bye: true, run: () => S.vascoTwin() },
        { label: 'Goodbye.', bye: true },
      ]);
    }
    if (F().heist_done) {
      if (F().ch === 3 && F().vasco_thursday && !F().vasco_cameo) return S.cloisterCh3();
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
    // Vasco goes down the ladder first and waits at the bottom
    if (v) {
      await v.walkTo(PIT_LADDER, 626); v.x = PIT_LADDER; v.y = PIT_RIM;
      if (window.SPRITES.vasco_climb) { v.pose = 'climb'; sfx('ladder_creak', 0.4); await T(500); v.pose = null; }
      await v.walkTo(870, PIT_RIM); v.dir = 'w';
    }
    // Alan at the head of the ladder: he slips, and lands in the pit in Vasco's arms
    await p.walkTo(PIT_LADDER - 30, 628); p.dir = 'e';
    p.pose = 'wobble'; sfx('ladder_creak', 0.5); await T(500); p.pose = null;
    F().in_pit = true; p.x = 760; p.y = PIT_RIM; p.dir = 'e';
    await S.withPair('catch', () => say('vasco_close'));
    await joke('alan_close');
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
    await S.withPair('lanyard', () => say('vasco_lanyard')); await joke('alan_lanyard');
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
    G.player.pose = 'reach'; sfx('key_jingle'); await T(400); G.player.pose = null;
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
    const v = G.npc('vasco'), p = G.player;
    // the two of them down in the pit, at arm's length
    F().in_pit = true;
    await Promise.all([p.walkTo(750, PIT_RIM), v ? v.walkTo(866, PIT_RIM) : null]);
    p.dir = 'e'; if (v) v.dir = 'w';
    let i = F().pit_exchanges || 0, wrong = 0, rescued = false;
    while (i < EX.length) {
      const [prompt, right, much, muchR, little, littleR] = EX[i];
      if (v && i === 1 && window.SPRITES.vasco_kneel) v.pose = 'kneel';
      const pairK = { 1: 'kneel', 2: 'thumb' }[i];
      if (pairK && S.vpair) await S.withPair(pairK, () => say(prompt)); else await say(prompt);
      if (i === 0) { sfx('v_vasco_laugh', 0.5); }
      const opts = [{ line: right, ok: true }, { line: much, react: muchR }, { line: little, react: littleR }];
      let pick = null;
      await G.dialog(ORDER[i].map(k => ({ line: opts[k].line, bye: true, run: () => { pick = opts[k]; } })));
      if (v) v.pose = null;
      if (pick.ok) { i++; wrong = 0; F().pit_exchanges = i; continue; }
      await say(pick.react);
      if (++wrong < 2) continue;
      if (!rescued) {
        rescued = true; wrong = 0;
        if (v) { await v.walkTo(PIT_LADDER + 8, PIT_RIM); v.dir = 'w'; if (window.SPRITES.vasco_climb) v.pose = 'climb'; }
        await say('vasco_ladder'); await joke('alan_collar');
        if (v) { v.pose = null; await v.walkTo(866, PIT_RIM); v.dir = 'w'; }
        await say('vasco_collar'); continue;
      }
      // he's out of the pit; Inês stalls him from the arcade and they start again
      await say('ines_stall', 'vasco_stall');
      i = 0; wrong = 0; rescued = false; F().pit_exchanges = 0;
    }
    await S.pitKiss();
  };

  S.pitKiss = async function () {
    G.cutscene = true;
    try {
      if (S.discreet()) { // Discreet: the joke stays, the paintings don't
        await G.fade(true); await say('vasco_kiss'); sfx('quarter'); await say('alan_monument'); await G.fade(false);
      } else {
        await S.withPair('kiss', () => T(1600));
        await S.still('still_se_kiss', 'se_cloister', async () => {
          sfx('trowel'); await T(300);
          await say('vasco_kiss'); sfx('quarter'); await say('alan_monument');
          sfx('v_vasco_laugh', 0.5);
        }, { zoom: [1.02, 1.12] });
        await S.still('still_se_pit', 'se_cloister', () => G.say('narr_pit', { offscreen: true }), { zoom: [1.0, 1.1], pan: [[0.5, 0.55], [0.5, 0.45]] });
      }
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
    await say('ines_innocent', 'vasco_flustered');
    await S.withPair('card', () => say('vasco_card'));
    give('vasco_card');
    await joke('alan_thursday');
    F().vasco_thursday = true;
    await say('ines_handover');
    give('brotherhood_charter');
    await S.readJoaquimCard();
    await say('alan_donated', 'alan_told_museum');
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
  S.ITEMS.vasco_card = { name: "Dr. Teles's card", look: 'alan_two_numbers' };
  S.ITEMS.sanches_fragment = { name: 'Fragment of Sanches bronze', look: 'alan_look_fragment' };
  // the drowned bell's twin tongue, on loan from the Sé reserve: it looks exactly like the real one
  S.ITEMS.twin = { name: 'Bell tongue (the twin)', icon: 'tongue', look: 'alan_look_twin' };

  // ================================================================ VASCO'S ARC
  // Chapter III, on the way to the tower: Vasco climbs out of the pit with something for Alan
  S.cloisterCh3 = async function () {
    if (F().vasco_cameo) return;
    F().vasco_cameo = true;
    await G.busy(async () => {
      const p = G.player, v = G.npc('vasco');
      if (v) {
        if (v._pit || inPit(v)) { await v.walkTo(PIT_LADDER, PIT_RIM); if (window.SPRITES.vasco_climb) { v.pose = 'climb'; sfx('ladder_creak', 0.4); await T(700); v.pose = null; } v.x = PIT_LADDER; v.y = 626; }
        await v.walkTo(p.x + (p.x < 900 ? 150 : -150), p.y); v.dir = v.x > p.x ? 'w' : 'e'; p.dir = v.x > p.x ? 'e' : 'w';
      }
      await S.withPair('fragment', () => say('vasco_fragment'));
      give('sanches_fragment');
      await say('vasco_sleep', 'alan_fine', 'vasco_thursday_then', 'alan_cameo');
    });
  };
  // after each fling: a moment alone, and the narrator, who isn't fooled
  S.flingBeat = async function (n, stayDark) {
    // narr_fun_1 belongs to Teixeira's scene, narr_fun_2 to Duarte's, narr_fun_3 to Zé
    await G.fade(true);
    await T(900);
    await G.say('narr_fun_' + n, { offscreen: true });
    await T(600);
    if (!stayDark) await G.fade(false);
  };
  // Thursday morning, after the call to his mother: the cloister, two coffees, the Romans
  S.thursday = async function () {
    if (!F().vasco_thursday) return;
    F().thursday = true;
    await G.fade(true); G.endStill();
    await G.goRoom('se_cloister', 'map', { instant: true, noEnter: true, noSave: true, pos: [260, 650, 'e'] });
    const p = G.player, v = G.npc('vasco');
    // Vasco is down in the pit with his trowel (it stays in his hand while he talks, when that frame is painted)
    const trowel = c => { if (!v) return; if (S.CHARS.vasco.frames.sets && S.CHARS.vasco.frames.sets.trowel) { v.pose = null; v.set = c ? 'trowel' : null; } else v.pose = c && window.SPRITES.vasco_trowel ? 'trowel' : null; };
    if (v) { v.x = 880; v.y = PIT_RIM; v.dir = 'w'; trowel(true); }
    p.pose = window.SPRITES.alan_coffees ? 'coffees' : null;
    await G.fade(false);
    // Alan comes to the rim and looks down at him
    await p.walkTo(700, 628); p.dir = 'e'; p.pose = window.SPRITES.alan_coffees ? 'coffees' : null;
    await say('alan_romans', 'vasco_closed', 'alan_wait', 'alan_documents', 'vasco_loan');
    p.pose = null; trowel(false);
    // he comes up the ladder for his coffee
    if (v) {
      await v.walkTo(PIT_LADDER, PIT_RIM); v.dir = 'w';
      if (window.SPRITES.vasco_climb) { v.pose = 'climb'; sfx('ladder_creak', 0.4); await T(700); v.pose = null; }
      v.x = 800; v.y = 630; v.dir = 'w';
    }
    await S.withPair('coffee', () => T(1400));
    if (v && window.SPRITES.vasco_coffee) v.pose = 'coffee';
    // and the two of them sit down in the hole, on the ladder, out of the wind
    await G.fade(true);
    p.x = 760; p.y = PIT_RIM; p.dir = 'e';
    if (v) { v.x = 860; v.y = PIT_RIM; v.dir = 'w'; }
    const sat = S.vpair('ladder');
    await G.fade(false); await T(800);
    // the Sé strikes nine
    for (let i = 0; i < 9; i++) setTimeout(() => sfx('hour'), window.FAST ? 0 : 400 + i * 1500);
    await G.say('narr_thursday', { offscreen: true });
    await T(window.FAST ? 20 : 2500);
    // the debt: the truth about the twin, and the tongue that rang, only bronze now
    if (F().twin_lent) await say('alan_thu_truth', 'vasco_thu_pause', 'alan_thu_return', 'vasco_thu_catalogue', 'alan_thu_owe', 'vasco_thu_down');
    else await T(window.FAST ? 20 : 2500);
    if (sat) sat();
    if (F().twin_lent) await S.vascoLove();
  };

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
      await say('ines_liked', 'alan_key');
      if (ines) ines.engaged--;
    });
  };
  const shopEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (F().heist_done && !F().reserve_raided && G.npc('ines')) return S.readRegister();
    if (shopEnter) return shopEnter.call(this, entry);
  };

  // ================================================================ THE RESERVE (the Sé museum's store room)
  // Only ever visited with Vasco: in Chapter III for the twin, and on Thursday.
  const STORE_STAIR = [250, 612], STORE_SHELF = [560, 592];
  const inStore = () => !!F().store_scene;
  ROOMS.se_store = {
    name: 'Sé de Lisboa · reserve', bg: 'se_store', music: null, ambience: 'museum', acoustic: 'convent', floor: 'stone', noSave: true,
    // the flagstones, clear of the stairs (left) and the big crate (right)
    walk: [[0, 600], [290, 578], [305, 548], [1060, 548], [1070, 642], [1280, 646], [1280, 716], [0, 716]],
    scale: [548, 250, 716, 372],
    light: { ambient: 'rgb(200,190,170)', base: 0.8, rim: 'rgba(255,220,160,0.2)', rimSide: 1 },
    lights: [
      { x: 652, y: 128, rgb: '255,214,150', kind: 'steady', glow: 70, ga: 0.22, power: 0.36, reach: 900, shadow: 0.5, floor: [652, 590], height: 470 }, // the work lamp
      { x: 780, y: 150, rgb: '225,232,240', power: 0.14, reach: 700, shadow: false }, // fog-light from the high window
    ],
    entries: { default: STORE_STAIR.concat('e'), se_museum: STORE_STAIR.concat('e') },
    anim(g, t) { FX.motes(g, t, 300, 100, 700, 420, 30, '245,230,200'); },
    npcs: [{ id: 'vasco', x: 260, y: 640, dir: 'e', name: 'Dr. Vasco Teles', when: inStore, look: 'narr_look_vasco', talk: () => say('vasco_busy'), items: { any: 'alan_fail_04' } }],
    hotspots: [
      { name: 'Shelves', rect: [280, 150, 700, 370], look: 'narr_look_store' },
      { name: 'Stairs up', rect: [40, 120, 240, 460], at: [200, 610], exit: 'se_museum', entry: 'se_store' },
    ],
  };
  ROOMS.se_museum.entries.se_store = [1000, 640, 'w'];

  // Chapter III: honest for once. The apology, the clapper, and very nearly a kiss
  S.vascoTwin = async function () {
    const p = G.player;
    await G.busy(async () => {
      if (F().heist_done) await say('alan_vasco_sorry', 'vasco_hook', 'vasco_forgive');
      else await say('vasco_what');
      await say('alan_vasco_clapper', 'vasco_come_down');
      // he leads the way back through the museum and down into the reserve
      const v0 = G.npc('vasco');
      if (v0 && !window.FAST) { v0.walkTo(1210, 640); await T(500); await p.walkTo(1120, 650); }
      await G.fade(true);
      F().store_scene = true;
      await G.goRoom('se_store', null, { instant: true, noEnter: true, noSave: true, pos: [STORE_STAIR[0] - 60, STORE_STAIR[1] + 20, 'e'] });
      const v = G.npc('vasco'); if (v) { v.x = STORE_STAIR[0] + 40; v.y = STORE_STAIR[1]; v.dir = 'e'; }
      sfx('key_jingle', 0.5); sfx('door', 0.4);
      await G.fade(false);
      if (v) { await v.walkTo(STORE_SHELF[0] + 90, STORE_SHELF[1] - 10); v.dir = 'n'; }
      await p.walkTo(STORE_SHELF[0] - 40, STORE_SHELF[1] + 10); p.dir = 'e';
      if (v) { v.dir = 'n'; await T(700); }
      await say('vasco_tag');
      if (v) { v.dir = 'w'; await v.walkTo(p.x + 130, p.y - 2); v.dir = 'w'; }
      sfx('brass_heavy', 0.4);
      await say('vasco_store_loan', 'alan_owe_one');
      give('twin'); F().twin_lent = true;
      // he doesn't let go of it
      await S.withPair('clapper', async () => { await say('vasco_dust', 'alan_dust'); await T(1400); });
      await say('vasco_not_here', 'gag_alan_withhold', 'vasco_thursday_truth');
      F().vasco_thursday = true; // (saves where the heist never happened: this is their Thursday too)
      // back up the stairs; Vasco stays with his crates
      await G.fade(true);
      F().store_scene = false;
      await G.goRoom('se_museum', 'se_store', { instant: true, noEnter: true });
      await G.fade(false);
      await say('alan_twin_guilt');
    });
    G.autosave();
  };

  // Thursday, after the coffee and the truth: downstairs, and this time nobody stops
  // (the game's last romance: the epilogue's ending card follows it)
  S.vascoLove = async function () {
    const p = G.player;
    F().vasco_love = true;
    await G.fade(true); G.endStill && G.endStill();
    F().store_scene = true;
    await G.goRoom('se_store', null, { instant: true, noEnter: true, noSave: true, pos: [STORE_STAIR[0] - 60, STORE_STAIR[1] + 20, 'e'] });
    const v = G.npc('vasco'); if (v) { v.x = STORE_STAIR[0] + 40; v.y = STORE_STAIR[1]; v.dir = 'e'; v.pose = null; v.set = null; }
    await G.fade(false);
    if (v) { await v.walkTo(STORE_SHELF[0] + 60, STORE_SHELF[1] - 10); v.dir = 'w'; }
    await p.walkTo(STORE_SHELF[0] - 60, STORE_SHELF[1]); p.dir = 'e';
    await say('vasco_love_1', 'alan_love_1', 'vasco_love_2');
    // against the shelving, the tie pulled loose
    sfx('v_alan_mmm', 0.5);
    await S.withPair(window.SPRITES.pair_vasco_shelf ? 'shelf' : 'kiss', async () => { await T(1800); await say('alan_love_tie'); });
    await S.withPair(window.SPRITES.pair_vasco_tie ? 'tie' : 'kiss', () => say('vasco_love_tie'));
    if (S.discreet()) { // Discreet: from the kiss straight to the afterwards, in the dark
      await G.fade(true);
      await G.say('narr_store', { offscreen: true });
      await say('vasco_after_2', 'alan_after_every');
    } else {
      sfx('v_vasco_laugh', 0.45);
      await S.withPair('shirtless', async () => { await T(1600); await say('vasco_love_romans', 'alan_love_romans'); });
      await G.fade(true);
      await T(900);
      await G.say('narr_store', { offscreen: true });
      // later: on a crate, shirts open, laughing, the clapper between them
      await S.still('still_store_after', 'se_store', async () => {
        await G.fade(false);
        sfx('v_alan_chuckle', 0.45); await T(700);
        await say('vasco_after_1', 'alan_after_v', 'vasco_after_2', 'alan_after_every');
      }, { zoom: [1.0, 1.1], pan: [[0.5, 0.5], [0.5, 0.45]], keep: true });
    }
    F().store_scene = false;
    await S.flingBeat(4, true); // the narrator, who isn't fooled, and isn't joking either
    G.endStill();
  };

  window.EXTRA_STILLS = ['still_se_kiss', 'still_se_pit', 'still_se_reserve'];
})();
