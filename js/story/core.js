// The Drowned Bell v2 — shared story state: cast, items, chapters, map, hints.
// Each chapter file (ch1.js … ch5.js) adds its rooms to S.ROOMS.
(function () {
  const G = window.Game;
  const F = () => G.flags;
  const say = (...ids) => G.says(...ids);
  const S = window.S = { G, F, say, ROOMS: {} };

  // ---------------------------------------------------------------- cast
  // Painted frames (js/sprites.js). Sprites face right unless flagged
  // facesLeft; the engine mirrors them. `scale` is relative body height.
  S.CHARS = {
    alan: { scale: 1, frames: {
      idle: ['alan_side', 'alan_idle2'], talk: ['alan_talk', 'alan_talk2'],
      walk: ['alan_walkA', 'alan_walkDown', 'alan_pass', 'alan_walkUp', 'alan_walkB', 'alan_walkDown', 'alan_pass', 'alan_walkUp'],
      front: 'alan_front', frontWalk: ['alan_front_walk1', 'alan_front', 'alan_front_walk2', 'alan_front'],
      back: 'alan_back', backWalk: ['alan_back_walk1', 'alan_back', 'alan_back_walk2', 'alan_back'],
      poses: { undress1: 'alan_undress1', undress2: 'alan_undress2', undress3: 'alan_undress3', undress4: 'alan_undress4', jacket: 'alan_jacket', jump: 'alan_jump', swim: 'alan_swim', swim2: 'alan_swim2', swimwave: 'alan_swim_wave', flirt: 'alan_flirt', wink: 'alan_wink', swoon: 'alan_swoon', reach: 'alan_reach', read: 'alan_read', ring: 'alan_ring', asleep: 'alan_asleep', pickup: 'alan_pickup', write: 'alan_write',
        drink: 'alan_drink', wring: 'alan_wring', wobble: 'alan_wobble', untie: 'alan_untie', phone: 'alan_phone', cut: 'alan_cutpalm' } } },
    ines: { scale: 0.93, frames: {
      idle: ['ines', 'ines_idle2'], talk: ['ines_talk', 'ines_talk2'], walk: ['ines_walkA', 'ines', 'ines_walkB', 'ines'],
      poses: { free: 'ines_free', steam: 'ines_steam', wrists: 'ines_wrists' },
      sets: {
        tied: { idle: ['ines_tied', 'ines_tied_struggle'], talk: ['ines_tied_shout', 'ines_tied_struggle'] },
        lantern: { idle: 'ines_lantern', talk: ['ines_lantern_talk', 'ines_lantern'] },
      } } },
    rui: { scale: 0.96, frames: { idle: ['rui', 'rui_idle2', 'rui_idle3'], talk: ['rui_talk', 'rui_talk2'],
      sets: { gate: { idle: 'rui_smoke', talk: ['rui_smoke', 'rui_talk'] }, coffee: { idle: 'rui_coffees', talk: 'rui_coffees' } } } },
    amalia: { scale: 0.9, frames: {
      idle: ['amalia', 'amalia_idle2'], talk: ['amalia_talk', 'amalia_idle2'], poses: { toast: 'amalia_toast' },
      sets: { sing: { idle: 'amalia_sing1', talk: ['amalia_sing1', 'amalia_sing2', 'amalia_sing1', 'amalia_idle2'] } } } },
    tomas: { scale: 0.95, frames: {
      idle: 'tomas', talk: 'tomas_talk', poses: { kneel: 'tomas_kneel' },
      loops: { sweep: { frames: ['tomas_sweepL', 'tomas_sweep', 'tomas_sweepR', 'tomas_sweep'], fps: 1.7 } } } },
    tomas_night: { scale: 0.95, frames: { idle: 'tomas_night', talk: 'tomas_night_talk', poses: { kneel: 'tomas_kneel' } } },
    lacerda: { scale: 1.0, frames: {
      idle: ['lacerda', 'lacerda_idle2'], talk: ['lacerda_talk', 'lacerda_talk2'], poses: { wind: 'lacerda_wind' },
      walk: ['lacerda_walkA', 'lacerda', 'lacerda_walkB', 'lacerda'] } },
    lacerda_robe: { scale: 1.02, frames: {
      idle: 'robe_idle', talk: ['robe_talk', 'lacerda_robe'],
      poses: { lunge: 'robe_lunge', terror: 'robe_terror', read: 'robe_read', kneel: 'robe_kneel' },
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
  const posedLook = (pose, id) => () => S.posed(pose, () => say(id));
  S.ITEMS = {
    notebook: { name: 'Notebook', look: posedLook('write', 'alan_look_notebook') },
    coins: { name: () => F().coins === 1 ? 'One escudo coin' : `${F().coins || 0} escudo coins`, look: 'alan_look_coins' },
    key: { name: 'Small iron key', look: 'alan_look_key' },
    ledger: { name: () => F().genealogy_read ? "Grandfather's ledger (genealogy)" : F().decoded ? "Grandfather's ledger (decoded)" : "Grandfather's ledger",
      look: () => S.readLedger() },
    magnifier: { name: 'Magnifying glass', look: 'alan_look_magnifier' },
    weight: { name: 'Brass weight', look: 'alan_look_weight' },
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
    knife: { name: "Zé's knife", look: 'alan_look_knife' },
    sardine: { name: 'Sardine', look: 'alan_look_sardine' },
    lantern: { name: "Tomás's lantern", look: 'alan_look_lantern' },
  };

  // ---------------------------------------------------------------- helpers
  S.posed = async function (pose, fn) {
    const p = G.player; p.pose = p.visible ? pose : null;
    try { await fn(); } finally { p.pose = null; }
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
  S.sfx = (n, v) => Sound.sfx(n, v);

  // chapter cards: title, narrator line, the clock, an autosave
  const CH = {
    1: ['CHAPTER I', 'The Fog', '11:00'], 2: ['CHAPTER II', 'The Unexplained Drawer', '13:30'], 3: ['CHAPTER III', 'The Weeping Stone', '15:30'],
    4: ['CHAPTER IV', "The Founders' Blood", '17:15'], 5: ['CHAPTER V', 'The Drowned Bell', '19:00'],
  };
  S.chapter = async function (n, line) {
    F().ch = n; F().clock = CH[n][2];
    await G.card(CH[n][0], `${CH[n][1]}  ·  ${CH[n][2]}`, 3000);
    if (line) await G.say(line, { offscreen: true });
    G.autosave();
  };

  // ---------------------------------------------------------------- map
  // Pins light up as places are learned; finished places stay visitable.
  S.PINS = [
    { id: 'street', x: 1060, y: 330, text: 'Alfama · Livraria Sanchez', open: () => true },
    { id: 'police', x: 560, y: 205, text: 'Polícia Judiciária', open: () => F().heard_machine && (F().ch || 1) <= 2 },
    { id: 'lavadouro', x: 1150, y: 415, text: 'Lavadouro do Alfama', open: () => F().drawer_open && (F().ch || 1) <= 4 },
    { id: 'ferreira', x: 600, y: 390, text: 'Relojoaria Ferreira · Baixa', open: () => F().drawer_open && (F().ch || 1) <= 3 },
    { id: 'convent', x: 262, y: 318, text: () => F().ch >= 5 ? 'Convento do Carmo · midnight' : 'Convento do Carmo', open: () => (F().ch2_done && F().ch <= 3) || F().ledger_found },
    { id: 'se_tower', x: 870, y: 300, text: 'Sé de Lisboa · bell tower', open: () => F().decoded && F().ch <= 4 },
    { id: 'antiques', x: 410, y: 440, text: 'Antiguidades Lacerda · Chiado', open: () => F().decoded && !F().has_tongue },
    { id: 'cais', x: 250, y: 585, text: 'Cais do Sodré', open: () => F().genealogy_read && F().ch === 4 },
  ];

  // ---------------------------------------------------------------- hints (Inês, "What now?")
  S.hint = function () {
    const f = F(), has = G.has;
    if (!f.heard_machine) return 'ines_hint_machine';
    if (!f.got_ledger) return f.tinTaken ? 'ines_hint_desk' : 'ines_hint_key';
    if (!f.saw_list) return 'ines_hint_police';
    if (!f.sketched_tile) return 'ines_hint_sketch';
    if (!f.knows_brotherhood) return 'ines_hint_show';
    if (!f.heard_song) return f.askedSong ? 'ines_hint_song' : 'ines_hint_amalia';
    if (!f.drawer_open) return f.askedDrawer ? 'ines_hint_drawer' : 'ines_hint_1955';
    if (!f.met_celeste || !f.tide_known) return f.ferreira_lit || !f.visited_ferreira ? (f.ferreira_lit ? 'ines_hint_tide' : (f.visited_ferreira ? 'ines_hint_dark' : 'ines_hint_threads')) : 'ines_hint_threads';
    if (!f.decoded) return f.stone_washed ? 'ines_hint_wheel' : (f.ch2_done ? (f.saw_stone ? 'ines_hint_stone' : 'ines_hint_convent') : 'ines_hint_convent');
    if (!f.founder_order) return 'ines_hint_order';
    if (!f.has_tongue) return has('vkey') && f.case_known ? 'ines_hint_theft' : 'ines_hint_case';
    return 'ines_hint_ch3_done';
  };
})();
window.EXTRA_ICONS=['holywater','tongue_wet'];
