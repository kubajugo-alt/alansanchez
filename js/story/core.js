// The Drowned Bell v2 — shared story state: cast, items, chapters, map, hints.
// Each chapter file (ch1.js … ch5.js) adds its rooms to S.ROOMS.
(function () {
  const G = window.Game;
  const F = () => G.flags;
  // Alan's deflections in the running gag play in his flustered pose
  const FLUSTER = /^(gag_alan_|alan_lino_1$)/;
  const say = async (...ids) => {
    if (window.Sound && Sound.preloadVoice) ids.forEach(id => Sound.preloadVoice(id)); // decode the whole exchange up front
    for (const id of ids) {
      const p = G.player, fl = FLUSTER.test(id) && p && p.visible && !p.pose;
      if (fl) p.pose = 'fluster';
      // a line can carry its speaker's pose (S.LINE_POSE[id] = [npc id, pose]) while it plays
      const lp = S.LINE_POSE[id], a = lp && G.npc(lp[0]), lpP = a && (a.set ? ((a.c.frames.sets || {})[a.set] || {}).poses : a.c.frames.poses), ap = a && a.visible && !a.pose && lpP && lpP[lp[1]]; // in a set, only the set's own poses
      if (ap) a.pose = lp[1];
      // listeners react to what's said (S.onLine and each of S.listeners return a function that ends the reaction)
      const lr = ap ? null : S.react(id);
      try { await G.says(id); } finally { if (fl) p.pose = null; if (ap && a.pose === lp[1]) a.pose = null; if (lr) lr(); }
    }
  };
  const S = window.S = { G, F, say, ROOMS: {}, LINE_POSE: {} };
  // who Alan is talking to on a line, when it isn't the last to speak to him and he doesn't call them by name
  // (speech.js addressee): an npc id, or false to keep the way he's facing (he can't look at her)
  S.LINE_TO = { alan_key_deny_3: false };
  G.lineTo = id => S.LINE_TO[id];
  G.sayChoice = id => say(id); // dialogue choices get the same staging as scripted lines
  // everyone present can react to a line: S.onLine (Inês's) plus any hooks pushed onto S.listeners
  S.listeners = [];
  S.react = function (id) {
    const ends = [];
    for (const f of [S.onLine].concat(S.listeners)) {
      if (typeof f !== 'function') continue;
      try { const e = f(id); if (typeof e === 'function') ends.push(e); } catch (e) { /* a broken reaction never stops a line */ }
    }
    return ends.length ? () => ends.forEach(e => { try { e(); } catch (x) { /* ignore */ } }) : null;
  };
  // Content setting: 'full' or 'discreet' (skips the steamy build-ups and their paintings); kept per browser
  const CONTENT_KEY = 'drowned-bell-content';
  S.content = () => { try { return localStorage.getItem(CONTENT_KEY); } catch (e) { return null; } };
  S.setContent = v => { try { localStorage.setItem(CONTENT_KEY, v); } catch (e) { /* private mode: lasts this session */ } S._content = v; };
  S.discreet = () => (S.content() || S._content) === 'discreet';

  // ---------------------------------------------------------------- combined sprites (Alan with someone)
  // A pair painting is anchored on Alan's feet (ax, fy, like his solo frames, at his standing height h);
  // px, pfy mark the partner's feet (scripts/pair_anchors.py). Going in, Alan steps to the one spot where
  // the painted partner lands on the partner's own feet, so neither of them moves; coming out, the partner
  // is stood where the painting had them. The hand-over is a 250 ms cross-fade, or (review screen choice,
  // 'pair-transition' = 'gemini') the painted in-between frames once they're approved.
  S.pairMode = () => { try { return localStorage.getItem('pair-transition') || 'xfade'; } catch (e) { return 'xfade'; } };
  const pairScale = (k, y) => { const p = G.player, m = window.SPRITES[k], y0 = p.y; p.y = y; const s = p.height() / m.h; p.y = y0; return s; };
  // where Alan stands for pair k with the partner standing at (x, y)
  S.pairSpot = (k, x, y) => {
    const m = window.SPRITES[k]; let s = pairScale(k, y), ay = y - (m.pfy - m.fy) * s;
    s = pairScale(k, ay); ay = y - (m.pfy - m.fy) * s; // (the scale follows his depth)
    return { x: x - (m.px - m.ax) * s, y: ay };
  };
  // where pair k (drawn now, Alan at p.x, p.y) has the partner standing
  S.pairPartnerAt = k => { const p = G.player, m = window.SPRITES[k], s = p.height() / m.h; return { x: p.x + (m.px - m.ax) * s, y: p.y + (m.pfy - m.fy) * s }; };
  const IB_HOLD = 110;
  async function pairSteps(seq) { const p = G.player; for (const f of seq) { p.crossFade(0.1); p.pose = f; await G.wait(window.FAST ? 0 : IB_HOLD); } }
  // from the pair painting Alan is in now to pair k (at x, if the painting needs him elsewhere): in 'gemini' mode the
  // approved in-between for that change plays first (either way round: it's the moment half way), else one dissolves into the next
  S.pairStep = async function (k, x) {
    const p = G.player, from = p.pose, IB = S.pairMode() === 'gemini' && (S.CHARS.alan.frames.pairIb || {});
    const ib = IB && (IB[from + '>' + k] || IB[k + '>' + from]), seq = (ib && ib.step) || [];
    if (seq.length) { if (x != null) p.x = (p.x + x) / 2; await pairSteps(seq); p.crossFade(0.1); }
    p.pose = k; if (x != null) p.x = x;
  };
  // into pair k with npc: { walk: false } skips the walk (he's already there, or the scene has just cut in)
  S.pairIn = async function (npc, k, opts) {
    opts = opts || {};
    const p = G.player, m = window.SPRITES[k];
    if (!npc || !m) return false;
    const at = S.pairSpot(k, npc.x, npc.y);
    if (opts.walk !== false && Math.hypot(p.x - at.x, p.y - at.y) > 3) await p.walkTo(at.x, at.y);
    p.x = at.x; p.y = at.y; p.pairWho = npc.id; p.pairNpc = npc; p.pairKey = k;
    const ib = S.pairMode() === 'gemini' && (S.CHARS.alan.frames.pairIb || {})[k];
    const seq = (ib && ib.in) || [];
    p.dir = 'e'; p.crossFade(seq.length ? 0.12 : 0.25);
    const gone = npc.fade(0, seq.length ? 0.12 : 0.25);
    if (seq.length) { p.pose = seq[0]; await gone; await pairSteps(seq.slice(1).concat([k])); } else { p.pose = k; await gone; }
    npc.visible = false; npc.alpha = 1;
    return true;
  };
  // out of the pair: Alan keeps his place (and takes pose / faces dir), the partner steps out of the painting
  S.pairOut = async function (npc, opts) {
    opts = opts || {};
    const p = G.player, k = (p.cur && window.SPRITES[p.cur] && window.SPRITES[p.cur].rigid) ? p.cur : p.pairKey || p.pose, m = window.SPRITES[k];
    npc = npc || p.pairNpc; p.pairWho = null; p.pairNpc = null; p.pairKey = null;
    if (!m || !m.rigid) { if (npc) npc.visible = true; p.pose = opts.pose || null; if (opts.dir) p.dir = opts.dir; return; }
    const ib = S.pairMode() === 'gemini' && (S.CHARS.alan.frames.pairIb || {})[k];
    const seq = (ib && ib.out) || [];
    if (seq.length) await pairSteps(seq);
    if (npc) { const at = S.pairPartnerAt(k); npc.x = at.x; npc.y = at.y; npc.alpha = 0; npc.visible = true; }
    p.crossFade(seq.length ? 0.12 : 0.25); p.pose = opts.pose || null;
    if (opts.dir) p.dir = opts.dir; else if (npc && Math.abs(npc.x - p.x) > 20) p.dir = npc.x > p.x ? 'e' : 'w'; // facing the partner, where the painting left them
    if (npc) await npc.fade(1, seq.length ? 0.12 : 0.25);
  };

  // ---------------------------------------------------------------- cast
  // The walks: where the foot carrying the weight is in each walk frame (from the anchor, in his heights;
  // scripts/walk_plant.py). [lead, trail]: lead is that foot from this frame on; a contact frame (heel just down)
  // also gives trail, the foot that carried him up to it. Each frame of the walk lasts exactly as far as that foot
  // travels to the next frame (walkLen), so it stays on its spot of floor: equal steps per frame made it slide
  // and jerk (he looked like he was skipping).
  S.WALK_PLANT = {
    alan_walkA: [0.170, -0.163], alan_walkB: [0.177, -0.159], alan_walk_contact2: [0.170, -0.163],
    alan_walkDown: [0.139], alan_walk_down2: [0.138],
    alan_pass: [-0.009], alan_walk_pass1: [0.022], alan_walk_pass_new: [-0.009],
    alan_walkUp: [-0.136], alan_walk_up1: [-0.101],
    alan_walk_pass1L: [0.061], alan_walk_up1L: [-0.105], alan_walk_pass2L: [-0.002], alan_walk_up2L: [0.004],
    alan_walk_pre1L: [0.102], alan_walk_pre2L: [0.106], alan_walk_contact_farL: [0.176, -0.170], // the low-swing walk
    alan_walk6_p1: [0.190, -0.161], alan_walk6_p3: [0.115], alan_walk6_p5: [0.016], alan_walk6_p7: [-0.081], // the one-sheet set
    alan_walk6_p9: [0.196, -0.176], alan_walk6_p11: [0.112], alan_walk6_p13: [0.024], alan_walk6_p15: [-0.081],
    // the cycles the user built in the review page's cycle editor (scripts/walk_apply_cycle.py)
    alan_walk7_s1: [0.190, -0.161], alan_walk7_s2: [0.115], alan_walk7_s3: [0.016], alan_walk7_s4: [0.174, -0.191], alan_walk7_s5: [0.003],
    ines_walk7_s1: [0.220, -0.167], ines_walk7_s2: [0.140], ines_walk7_s3: [0.044], ines_walk7_s4: [-0.070], ines_walk7_s5: [0.215, -0.160], ines_walk7_s6: [0.036],
    // ines: the one-sheet set (scripts/walk_sheet_cast.py)
    ines_walk6_p1: [0.220, -0.167], ines_walk6_p3: [0.140], ines_walk6_p5: [0.044], ines_walk6_p7: [-0.061],
    ines_walk6_p9: [0.219, -0.155], ines_walk6_p11: [0.131], ines_walk6_p13: [0.044], ines_walk6_p15: [-0.066],
    // vasco: the one-sheet set (scripts/walk_sheet_cast.py)
    vasco_walk6_p1: [0.190, -0.148], vasco_walk6_p3: [0.112], vasco_walk6_p5: [0.028], vasco_walk6_p7: [-0.061],
    vasco_walk6_p9: [0.207, -0.153], vasco_walk6_p11: [0.112], vasco_walk6_p13: [0.030], vasco_walk6_p15: [-0.065],
    // lacerda: the one-sheet set (scripts/walk_sheet_cast.py), widened x1.2 below the chin (scripts/walk_widen.py)
    lacerda_walk6_p1: [0.209, -0.211], lacerda_walk6_p3: [0.109], lacerda_walk6_p5: [0.002], lacerda_walk6_p7: [-0.106],
    lacerda_walk6_p9: [0.207, -0.211], lacerda_walk6_p11: [0.103], lacerda_walk6_p13: [0.002], lacerda_walk6_p15: [-0.109],
    // celeste: the one-sheet set (scripts/walk_sheet_cast.py)
    celeste_walk6_p1: [0.191, -0.171], celeste_walk6_p3: [0.098], celeste_walk6_p5: [0.014], celeste_walk6_p7: [-0.079],
    celeste_walk6_p9: [0.190, -0.171], celeste_walk6_p11: [0.091], celeste_walk6_p13: [0.015], celeste_walk6_p15: [-0.079],
    // ze: the one-sheet set (scripts/walk_sheet_cast.py)
    ze_walk6_p1: [0.163, -0.181], ze_walk6_p3: [0.083], ze_walk6_p5: [0.012], ze_walk6_p7: [-0.094],
    ze_walk6_p9: [0.177, -0.177], ze_walk6_p11: [0.084], ze_walk6_p13: [0.013], ze_walk6_p15: [-0.094],
    // cop_visit: the one-sheet set (scripts/walk_sheet_cast.py)
    cop_walk6_p1: [0.257, -0.098], cop_walk6_p3: [0.165], cop_walk6_p5: [0.079], cop_walk6_p7: [-0.018],
    cop_walk6_p9: [0.263, -0.108], cop_walk6_p11: [0.166], cop_walk6_p13: [0.081], cop_walk6_p15: [-0.017],
    // guitar_visit: the one-sheet set (scripts/walk_sheet_cast.py)
    guitar_walk6_p1: [0.258, -0.097], guitar_walk6_p3: [0.157], guitar_walk6_p5: [0.079], guitar_walk6_p7: [-0.014],
    guitar_walk6_p9: [0.256, -0.103], guitar_walk6_p11: [0.162], guitar_walk6_p13: [0.077], guitar_walk6_p15: [-0.018],
  };
  // the walk plan's step A (?walk=a and the walk lab): steady movement, even timing, a hard cut, the bob once per step
  S.WALK_A = { lock: 0, blend: 'cut', timing: 'even', bob: 'step' };
  // the same engine fix on the cycles in the game now (?walk=fix): steady movement, each painting held as long as its own
  // planted foot travels (those cycles' steps are uneven), cut half way through, the bob once per step
  S.WALK_FIX = { lock: 0, blend: 'cut', timing: 'foot', bob: 'step' };
  S.walkTiming = F => {
    const W = F.walk, P = S.WALK_PLANT;
    if (!W || !W.every(f => P[f])) { delete F.walkLen; delete F.walkSteps; return; }
    // the stride is the standing foot's travel over the whole cycle, shared evenly between the frames: timing each
    // frame by its own foot travel made contacts flash and passing frames hold, which read as skipping
    const len = W.map((f, i) => { const n = W[(i + 1) % W.length]; return Math.max(0.01, P[f][0] - (P[n].length > 1 ? P[n][1] : P[n][0])); });
    const even = len.reduce((a, b) => a + b, 0) / W.length;
    // with the planted foot locked (actor.js, window.WALK), each frame lasts as far as its own foot travels, so the next
    // frame's foot lands exactly where this one's stood; 'even' shares the stride out equally
    F.walkLen = ((window.WALK && window.WALK.timing) || 'foot') === 'foot' ? len : W.map(() => even);
    F.walkSteps = W.map((f, i) => (P[f].length > 1 ? i : -1)).filter(i => i >= 0); // a footstep as each heel lands
  };
  // Painted frames (js/sprites.js). Sprites face right unless flagged
  // facesLeft; the engine mirrors them. `scale` is relative body height.
  S.CHARS = {
    alan: { scale: 1, frames: {
      idle: ['alan_side', 'alan_idle2'], talk: ['alan_talk', 'alan_talk2'],
      // contact, down, passing, up on each foot: the original cycle, on its hand-tuned anchors (even steps)
      walk: ['alan_walkA', 'alan_walkDown', 'alan_pass', 'alan_walkUp', 'alan_walkB', 'alan_walkDown', 'alan_pass', 'alan_walkUp'],
      front: 'alan_front', frontWalk: ['alan_front_walk1', 'alan_front', 'alan_front_walk2', 'alan_front'],
      back: 'alan_back', backWalk: ['alan_back_walk1', 'alan_back', 'alan_back_walk2', 'alan_back'],
      poses: { pair_unbutton: 'pair_unbutton', pair_kiss: 'pair_kiss', pair_brow: 'pair_brow', button: 'alan_button', undress1: 'alan_undress1', undress2: 'alan_undress2', undress3: 'alan_undress3', undress4: 'alan_undress4', jacket: 'alan_jacket', jump: 'alan_jump', undress1b: 'alan_undress1b', uboot: 'alan_undress_boot', ubelt: 'alan_undress_belt', fling: 'alan_fling', jwink: 'alan_jacket_wink', jgrin: 'alan_jacket_grin', hands: 'alan_hands', climb: 'alan_climb', undress2a: 'alan_undress2a', undress2b: 'alan_undress2b', unbutton: 'alan_undress_unbutton', ujeans: 'alan_undress_jeans', tdown: 'alan_trunks_down', tstep: 'alan_trunks_step', jcrouch: 'alan_jump_crouch', jrise: 'alan_jump_rise', jfall: 'alan_jump_fall', wsurface: 'alan_wash_surface', wash4: 'alan_wash4', wash5: 'alan_wash5', wash6: 'alan_wash6', tron: 'alan_trunks_on', drip: 'alan_drip', snap: 'alan_trunks_snap', dboot: 'alan_dress_boot', dfinal: 'alan_dress_final', swim: 'alan_swim', swim2: 'alan_swim2', swimwave: 'alan_swim_wave', wash1: 'alan_wash1', wash2: 'alan_wash2', wash3: 'alan_wash3', flirt: 'alan_flirt', wink: 'alan_wink', swoon: 'alan_swoon', fluster: 'alan_fluster', reach: 'alan_reach', read: 'alan_read', ring: 'alan_ring', pickup: 'alan_pickup', write: 'alan_write',
        drink: 'alan_drink', wring: 'alan_wring', wobble: 'alan_wobble', untie: 'alan_pull', pull: 'alan_pull', phone: 'alan_phone', cut: 'alan_cutpalm' },
      sets: { lantern: { idle: 'alan_lantern', talk: ['alan_lantern'], walk: ['alan_lwalk1', 'alan_lantern', 'alan_lwalk2', 'alan_lantern'] } } } },
    ines: { scale: 0.93, frames: {
      idle: ['ines', 'ines_idle2'], talk: ['ines_talk', 'ines_talk2'], walk: ['ines_walk1', 'ines_walk2'],
      poses: { free: 'ines_free', steam: 'ines_steam', wrists: 'ines_wrists' },
      sets: {
        tied: { idle: ['ines_tied', 'ines_tied_struggle'], talk: ['ines_tied_shout', 'ines_tied_struggle'] },
        lantern: { idle: 'ines_lantern', talk: ['ines_lantern_talk', 'ines_lantern'], walk: ['ines_lwalk1', 'ines_lwalk2'] },
      } } },
    rui: { scale: 0.96, frames: { idle: ['rui', 'rui_idle2', 'rui_idle3'], talk: ['rui_talk', 'rui_talk2'], walk: S.RUI_WALK || ['rui'], // never his coffee and eye-rubbing frames as steps
      front: 'rui_front', // (no cup in the frames below: at the gate he has no coffee)
      sets: { gate: { idle: ['rui_smoke', 'rui_idle4'], talk: ['rui_talk3', 'rui_smoke', 'rui_talk4'] }, coffee: { idle: 'rui_coffees', talk: 'rui_coffees' } } } },
    amalia: { scale: 0.9, frames: {
      idle: ['amalia', 'amalia_idle2'], talk: ['amalia_talk', 'amalia_idle2'], poses: { toast: 'amalia_toast' },
      sets: { sing: { idle: 'amalia_sing1', talk: ['amalia_sing1', 'amalia_sing2', 'amalia_sing1', 'amalia_idle2'] } } } },
    tomas: { scale: 0.95, frames: {
      idle: 'tomas', talk: 'tomas_talk', poses: { kneel: 'tomas_kneel' },
      loops: { sweep: { frames: ['tomas_sweepL', 'tomas_sweep', 'tomas_sweepR', 'tomas_sweep'], fps: 1.7 } } } },
    tomas_night: { scale: 0.95, frames: { idle: 'tomas_night', talk: 'tomas_night_talk', poses: { kneel: 'tomas_kneel' },
      sets: { pray: { idle: 'tomas_kneel', talk: ['tomas_kneel'] } } } }, // after he gives Alan his lantern
    lacerda: { scale: 1.0, frames: {
      idle: ['lacerda', 'lacerda_idle2', 'lacerda_idle3'], talk: ['lacerda_talk', 'lacerda_talk3', 'lacerda_talk4'], front: 'lacerda_front',
      poses: { wind: 'lacerda_wind', warn: 'lacerda_talk2' }, // talks in the stance he stands in; the squarer finger-wag is a pose of its own
      walk: ['lacerda_walk1', 'lacerda_pass1', 'lacerda_walk2', 'lacerda_pass2'] }, frameStep: 0.17 }, // stride, passing, stride, passing: half a step per frame
    lacerda_robe: { scale: 1.02, frames: {
      idle: ['robe_idle', 'robe_idle2'], talk: ['robe_talk', 'robe_talk2', 'lacerda_robe', 'robe_talk3'],
      poses: { lunge: 'robe_lunge', terror: 'robe_terror', read: 'robe_read', kneel: 'robe_kneel', realise: 'robe_realise' },
      sets: { read: { idle: 'robe_kneel', talk: ['robe_kneel'] } } } },
    celeste: { scale: 0.86, frames: {
      idle: ['celeste', 'celeste_idle2'], talk: ['celeste_talk', 'celeste_talk2'], walk: ['celeste_walkA', 'celeste', 'celeste_walkB', 'celeste'],
      poses: { shout: 'celeste_shout' },
      sets: { wring: { idle: ['celeste_wring1', 'celeste_wring2'], talk: ['celeste_wring1', 'celeste_wring2'] },
        basket: { idle: 'celeste_basket', talk: ['celeste_talk', 'celeste_basket'] } } } },
    ze: { scale: 1.02, frames: {
      idle: 'ze', talk: ['ze_talk', 'ze_talk2'], walk: ['ze_walkA', 'ze', 'ze_walkB', 'ze'],
      poses: { burst: 'ze_burst', hammer: 'ze_hammer', toss: 'ze_toss', give: 'ze_give' },
      sets: { sit: { idle: 'ze_sit', talk: ['ze_sit', 'ze_talk'] } } } },
    abilio: { scale: 0.9, frames: {
      idle: ['abilio', 'abilio_idle2'], talk: ['abilio_shout1', 'abilio_shout2'], poses: { read: 'abilio_read', point: 'abilio_point' } } },
    pessoa: { scale: 1, speed: 1.7, frames: {
      idle: ['pessoa_sleep', 'pessoa_sleep2'], walk: ['pessoa_walk1', 'pessoa_walk2'],
      poses: { sit: 'pessoa_sit', jump: 'pessoa_jump', eat: 'pessoa_eat' } }, idleHold: [2.2, 3.4], variantHold: [1.8, 2.6] },
  };

  // ---------------------------------------------------------------- items
  S.ITEMS = {
    notebook: { name: 'Notebook', read: () => S.readNotebook(), look: async () => { await S.readNotebook(); await S.posed('write', () => say(F().vasco_thursday ? 'alan_two_numbers' : 'alan_look_notebook')); } },
    sketch: { name: 'Sketch of the tile', look: 'alan_look_sketch' },
    bunktile: { name: 'Blue tile', look: 'narr_look_bunktile', with: { tongue: () => S.breakTile(), sanches_fragment: () => say('alan_fragment_tile') } },
    coins: { name: () => F().coins === 1 ? 'One escudo coin' : `${F().coins || 0} escudo coins`, look: 'alan_look_coins' },
    key: { name: 'Small iron key', look: 'alan_look_key' },
    ledger: { name: () => F().genealogy_read ? "Grandfather's ledger (genealogy)" : F().decoded ? "Grandfather's ledger (decoded)" : "Grandfather's ledger",
      look: () => S.readLedger() },
    magnifier: { name: 'Magnifying glass', look: 'alan_look_magnifier' },
    ginja: { name: () => F().ginja === 2 ? 'Two ginjinhas' : 'A ginjinha', look: () => say(F().ginja === 2 ? 'alan_look_ginja' : 'alan_look_ginja_one') },
    matches: { name: 'Matches', look: 'alan_look_matches' },
    glass: { name: () => F().glassHoly ? 'Glass of holy water' : 'Empty ginjinha glass', icon: () => F().glassHoly ? 'holywater' : 'glass',
      look: () => say(F().glassHoly ? 'alan_look_holywater' : 'alan_look_glass') },
    coffee: { name: "Rui's coffee", look: 'alan_look_coffeecup' },
    file55: { name: 'Case file 55/114', look: () => S.readFile55() },
    fkey: { name: "Key to Ferreira's shop", look: 'alan_look_fkey' },
    tidecard: { name: "Ferreira's tide card", look: () => S.readTideCard() },
    vkey: { name: 'Vitrine key', look: 'alan_look_vkey' },
    tongue: { name: () => F().blood ? 'Bell tongue (blooded)' : 'Bell tongue', icon: () => F().blood ? 'tongue_wet' : 'tongue',
      look: () => say(F().blood ? 'alan_look_tongue_wet' : 'alan_look_tongue') },
    knife: { name: "Zé's knife", look: 'alan_look_knife', with: { tongue: () => G.room && G.room.id === 'cistern' ? S.cutPalm() : say('alan_blood_later') } },
    sardine: { name: 'Sardine', look: 'alan_look_sardine' },
    lantern: { name: "Tomás's lantern", look: 'alan_look_lantern' },
  };

  // ---------------------------------------------------------------- helpers
  S.posed = async function (pose, fn) {
    const p = G.player; p.pose = p.visible ? pose : null;
    try { await fn(); } finally { p.pose = null; }
  };
  // small talk with background characters: one exchange, then a short repeat line
  S.chat = (flag, first, again) => () => F()[flag] ? say(...again) : (F()[flag] = true, say(...first));
  // Alan carries Tomás's lantern in hand from the hand-over until Inês takes it
  S.carry = () => {
    const p = G.player, want = G.has('lantern') && window.SPRITES.alan_lantern ? 'lantern' : null;
    if (p && p.set !== want && (!p.set || p.set === 'lantern')) p.set = want;
  };
  S.once = (flag, fn) => async (...a) => { if (F()[flag]) return; F()[flag] = true; await fn(...a); };
  // ★ jokes: Inês scores them when she's in the room
  let lastScore = 0;
  S.joke = async function (id) {
    await say(id);
    const ines = G.npc('ines');
    if (ines && ines.visible && !ines.set && Math.random() < 0.5) {
      let n; do { n = 1 + Math.floor(Math.random() * 10); } while (n === lastScore);
      lastScore = n; await say('ines_score_' + n);
    }
  };
  S.give = (id, n) => { if (n != null) F()[id] = n; G.giveItem(id); };
  S.spendCoin = (n) => { F().coins = (F().coins || 0) - n; if (F().coins <= 0) G.takeItem('coins'); else G.renderInv(); };
  S.sfx = (...a) => Sound.sfx(...a);

  // chapter cards: title, narrator line, the clock, an autosave
  const CH = {
    1: ['CHAPTER I', 'The Fog', '11:00'], 2: ['CHAPTER II', 'The Unexplained Drawer', '13:30'], 3: ['CHAPTER III', 'The Weeping Stone', '15:30'],
    4: ['CHAPTER IV', "The Founders' Blood", '17:15'], 5: ['CHAPTER V', 'The Drowned Bell', '19:00'],
  };
  S.chapter = async function (n, line) {
    // the paintings that close the chapter before (js/story/transitions.js); the last one stays up under the card
    const kept = n > 1 && S.transition ? await S.transition(n - 1) : false;
    if (kept) G.wait(window.FAST ? 20 : 1100).then(() => G.endStill()); // gone while the card is fully up
    F().ch = n; F().clock = CH[n][2]; if (G.room) G.refreshNpcs(); // the cast changes with the chapter, even mid-room
    Sound.sfx('chapter_toll', 0.35); // a bell somewhere under the city, every chapter
    Sound.cue({ id: 'bell_motif', dur: 12, fade: 3 }, { sticky: true }); // the Bell motif's first 12 s, fading, then the room's music
    await G.card(CH[n][0], `${CH[n][1]}  ·  ${CH[n][2]}`, 3000);
    if (line) await G.say(line, { offscreen: true });
    G.autosave();
  };

  // ---------------------------------------------------------------- map
  // Pins light up as places are learned; finished places stay visitable.
  S.PINS = [
    { id: 'street', x: 1060, y: 330, text: 'Alfama · Livraria Sanches', open: () => true },
    { id: 'police', x: 560, y: 205, text: 'Polícia Judiciária', open: () => F().heard_machine && (F().ch || 1) <= 2 },
    { id: 'lavadouro', x: 1150, y: 415, text: 'Lavadouro do Alfama', open: () => F().drawer_open && (F().ch || 1) <= 4 },
    { id: 'ferreira', x: 600, y: 390, text: 'Relojoaria Ferreira · Baixa', open: () => F().drawer_open && (G.has('fkey') || F().ferreira_open) && (F().ch || 1) <= 3 && !S.ferreiraDone(),
      // shown but locked until Teixeira brings the key round
      waiting: () => F().drawer_open && !G.has('fkey') && !F().ferreira_open && (F().ch || 1) <= 3, waitText: 'Waiting for the key' },
    { id: 'convent', x: 262, y: 318, text: () => F().ch >= 5 ? 'Convento do Carmo · midnight' : 'Convento do Carmo', open: () => (F().ch2_done && F().ch <= 3) || (F().ledger_found && (F().rui_called || !F().ines_plan)) },
    { id: 'se_museum', x: 828, y: 352, text: 'Sé de Lisboa · museum', open: () => !!F().ines_plan || (F().ch === 3 && !!F().knows_twin) },
    { id: 'se_tower', x: 870, y: 300, text: 'Sé de Lisboa · bell tower', open: () => F().decoded && F().ch <= 4,
      go: () => F().ch === 3 && F().vasco_thursday && !F().vasco_cameo ? 'se_cloister' : 'se_tower' }, // Vasco is in the cloister on the way up
    { id: 'antiques', x: 410, y: 440, text: 'Antiguidades Lacerda · Chiado', open: () => F().decoded && !F().has_tongue && (F().chose_chiado || !F().decoded_v6) },
    { id: 'cais', x: 250, y: 585, text: 'Cais do Sodré', open: () => (F().genealogy_read || F().ch3_done) && F().ch === 4 },
  ];

  // the map's "new" marker in Chapter III follows Inês's hints: Lacerda's case first, then Abílio at the Sé
  S.pinNext = () => {
    const f = F();
    if (f.ch !== 3 || !f.chose_chiado || f.has_tongue) return null;
    if (!f.tongue_sketched) return 'antiques';
    if (!f.knows_twin) return 'se_tower';
    return null;
  };

  // the workshop is finished once the tide clock is wound with the key, the repair register read, the
  // tide card in Alan's pocket and the spare key off the board: then it leaves the map for good
  S.ferreiraDone = () => { const f = F(); return !!(f.tide_wound && f.read_repair && f.tide_known && (f.tidecardTaken || G.has('tidecard')) && f.vkeyTaken); };

  // ---------------------------------------------------------------- hints (Inês, "What now?")
  S.hint = function () {
    const f = F(), has = G.has;
    if (!f.heard_machine) return 'ines_hint_machine';
    if (!f.got_ledger) return !f.tinTaken ? 'ines_hint_key' : (f.lampOff ? 'ines_hint_desk2' : 'ines_hint_desk');
    if (!f.saw_list && !f.sketched_tile) return 'ines_hint_police';
    if (!f.sketched_tile && f.rui_out && !f.teixeira_wall) return 'ines_hint_guard'; // Teixeira guards the bag: charm him first
    if (!f.sketched_tile) return 'ines_hint_sketch';
    if (!f.knows_brotherhood) return 'ines_hint_show';
    if (f.ines_plan && !f.reserve_raided) {
      if (f.heist_done) return 'ines_hint_register';
      if (!f.se_visited) return 'ines_hint_se';
      if (!(f.se_exhibits >= 2) || !f.se_plan_on) return 'ines_hint_exhibits';
      if (!(f.dig_questions >= 3)) return 'ines_hint_dig';
      if (!f.lanyard_taken) return f.in_pit ? 'ines_hint_shirt' : 'ines_hint_lanyard';
      if (!f.key_tossed) return 'ines_hint_toss_2';
      return 'ines_hint_pit';
    }
    if (!f.heard_song) return f.askedSong ? 'ines_hint_song' : 'ines_hint_amalia';
    if (!f.drawer_open) return !f.askedDrawer ? 'ines_hint_1955' : (f.salt_seen ? 'ines_hint_drawer' : 'ines_hint_look');
    if (f.ch === 2 && f.drawer_open && !has('fkey') && !f.ferreira_open && !f.visit_cop) return 'ines_hint_teixeira_2'; // Rui will find a way to get the key to him
    if (!f.met_celeste || !f.tide_known) {
      if (f.visited_ferreira && !f.ferreira_lit) return has('matches') ? 'ines_hint_matches' : 'ines_hint_dark';
      if (!f.met_celeste) return f.visited_ferreira ? 'ines_hint_celeste' : 'ines_hint_threads';
      return f.ferreira_lit ? 'ines_hint_tide' : 'ines_hint_ferreira';
    }
    if (!f.knows_1955_boy) return 'ines_hint_file';
    if (f.ch === 2 && f.lock_tried && !f.drawer_unlocked) return 'ines_hint_clocks'; // the clockmaker's lock
    if (f.ch === 2 && !f.turnings_deduced) { // B9: Ferreira's -> Rui -> his Diário -> the notebook
      if (!has('newspaper') && !f.ferreira_told) return 'ines_hint_paper_2';
      if (!has('newspaper')) return 'ines_hint_paper_3';
      if (!f.lore_turnings) return 'ines_hint_river';
      return 'ines_hint_paper_4';
    }
    if (f.ch === 2 && f.heist_done && !f.knows_withdrawn && f.turnings_deduced) return 'ines_hint_rui_theft'; // B7: Rui's news about the Sé
    if (!f.decoded && f.ch2_done && S.needBells && S.needBells()) return f.charter_shown ? 'ines_hint_bells2' : 'ines_hint_bells';
    if (!f.decoded) return f.stone_washed ? (f.stone_read ? 'ines_hint_wheel' : 'ines_hint_mag') : (f.ch2_done ? (f.saw_stone ? 'ines_hint_stone' : 'ines_hint_convent') : 'ines_hint_convent');
    if (!f.founder_order) return 'ines_hint_order';
    if (!f.has_tongue) { // Lacerda's case -> Abílio reads the sketch -> Vasco lends the twin -> the swap
      if (!f.tongue_sketched) return 'ines_hint_see_case';
      if (!f.knows_twin) return 'ines_hint_sketch_abilio';
      if (!has('twin')) return 'ines_hint_ask_vasco';
      return has('vkey') ? 'ines_hint_swap' : 'ines_hint_case';
    }
    return 'ines_hint_ch3_done';
  };
  // The banker's lamp switched off: the painting has it lit, so dim the green
  // shade, put out the bright opal underside, and let the bulb die with a flicker.
  S.lampOut = function (g) {
    const k = S.lampOffAt ? (performance.now() - S.lampOffAt) / 1000 : 9;
    if (k < 0.45 && Math.sin(k * 60) > 0) return FX.glow(g, 180, 318, 70, '255,215,140', 0.25 * (1 - k / 0.45));
    g.save();
    g.beginPath();
    g.moveTo(126, 316);
    g.lineTo(132, 300);
    g.lineTo(148, 291);
    g.lineTo(212, 290);
    g.lineTo(226, 297);
    g.lineTo(234, 318);
    g.lineTo(230, 324);
    g.lineTo(128, 325);
    g.closePath();
    g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgb(120,128,118)'; g.fill();
    g.globalCompositeOperation = 'source-over';
    const u = g.createLinearGradient(0, 319, 0, 326); u.addColorStop(0, 'rgba(46,40,28,0.95)'); u.addColorStop(1, 'rgba(30,24,16,0.9)');
    g.fillStyle = u; g.beginPath(); g.moveTo(129, 320); g.lineTo(229, 318); g.lineTo(231, 323); g.quadraticCurveTo(180, 327, 129, 325); g.closePath(); g.fill();
    g.restore();
  };

  // ---------------------------------------------------------------- idle cigarette
  // Twenty seconds without input and Alan lights up (the engine runs it: Game.idleSmoke).
  // Never in a church (the Sé, the Carmo), and never mid-scene, posed or undressed.
  S.CHURCH = new Set(['se_museum', 'se_cloister', 'se_tower', 'se_store', 'convent', 'convent_night']);
  G.idleSmoke = {
    frames: { light: 'alan_smoke_light', inhale: 'alan_smoke_inhale', exhale: 'alan_smoke_exhale', hold: 'alan_smoke_hold' },
    // where the smoke comes from on each frame (sprite px): his mouth, the cigarette's lit tip
    points: {
      alan_smoke_light: { mouth: [127, 108], tip: [154, 117] },
      alan_smoke_inhale: { mouth: [130, 87], tip: [153, 88] },
      alan_smoke_exhale: { mouth: [139, 79], tip: [182, 252] },
      alan_smoke_hold: { mouth: [142, 85], tip: [170, 307] },
    },
    allowed: room => !(S.CHURCH.has(room.id) || room.church || /^se_/.test(room.id)),
  };
})();
