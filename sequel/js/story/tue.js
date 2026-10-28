// The Shortest Night — Tuesday 18 June: arrival, adapted from the novel's Chapter One (docs/novel). Gando without
// luggage and Vasco radiant; the drive under the panza de burro; the hotel and the dress code (Nieves's lost and found);
// Chano's change and the first call to Inês; the reception at El Museo Canario (Baute and the skulls, Carmen on the
// steps); the walk on the promenade and the black mist; the midnight call; the first night.
// The rooms first seen today live here with everything that happens in them on later days: Gando (Sunday's bad
// ending), the hotel lobby and room, Las Canteras (the kiosk, the phone box, the tide and the bonfires), the museum hall
// (Thursday's dinner).
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;

  // ================================================================ GANDO
  ROOMS.gando = S.room({
    name: 'Gando airport', bg: 'gando', floor: 'tile', ambience: 'museum', door: 'door',
    entries: { default: [200, 660, 'e'] },
    npcs: [
      { id: 'vasco', x: 900, y: 650, dir: 'w', name: 'Vasco', when: () => ch() === 1 && !F().met_vasco,
        look: 'alan_look_vasco_gando', talk: () => S.meetVasco() },
      { id: 'clerk', ch: 'clerk', x: 1000, y: 640, dir: 'w', name: 'Check-in clerk', when: () => ch() === 6,
        look: 'alan_look_clerk', talk: () => S.badEnding() },
    ],
    hotspots: [
      { name: 'Baggage belt', rect: [140, 440, 620, 100], at: [450, 620], look: () => say(ch() === 6 ? 'alan_look_belt_sun' : 'alan_look_belt'),
        use: () => say(ch() === 6 ? 'alan_look_belt_sun' : F().belt_waited ? 'alan_use_belt_2' : (F().belt_waited = true, 'alan_use_belt')) },
      { name: 'Arrivals board', rect: [880, 120, 260, 120], at: [1000, 610], look: () => say(ch() === 6 ? 'alan_look_board_sun' : 'alan_look_board') },
      { name: 'Taxi rank', rect: [1160, 250, 110, 320], at: [1200, 650], exit: () => 'hotel_lobby', entry: 'gando',
        locked: () => ch() === 1 && !F().met_vasco, lockedLine: 'alan_taxi_wait', when: () => ch() === 1 },
      { name: 'Back to the city', rect: [10, 250, 110, 320], at: [80, 650], when: () => ch() === 6, use: () => S.backToChoice(), look: 'alan_look_back' },
    ],
  });
  S.meetVasco = async function () {
    if (F().met_vasco) return;
    await say('narr_t_vasco_1', 'vasco_t_hello', 'narr_t_kiss', 'alan_t_hello', 'vasco_t_luggage', 'vasco_t_sunburn', 'alan_t_luggage',
      'vasco_t_sorry', 'vasco_t_cave', 'vasco_t_light', 'alan_t_cave', 'vasco_t_rayco', 'alan_t_rayco', 'vasco_t_rayco_2', 'alan_t_proud');
    F().met_vasco = true;
    await say('vasco_t_go');
    await G.fade(true);
    // the drive north, under the edge of the cloud (heard over black)
    await say('narr_t_drive_1', 'alan_t_rain', 'vasco_t_panza_1', 'vasco_t_panza_2', 'vasco_t_panza_3', 'alan_t_thursday', 'narr_t_drive_2');
    await G.goRoom('hotel_lobby', 'gando', { instant: true, noEnter: true });
    await G.fade(false);
    await S.lobbyArrival();
  };

  // ================================================================ HOTEL: the lobby
  ROOMS.hotel_lobby = S.room({
    name: 'Hotel Cristina', bg: 'hotel_lobby', floor: 'tile', ambience: 'museum', door: 'door',
    entries: { default: [140, 660, 'e'], map: [140, 660, 'e'], canteras: [140, 660, 'e'], hotel_room: [1120, 660, 'w'], gando: [140, 660, 'e'] },
    npcs: [
      { id: 'nieves', ch: 'nieves', x: 640, y: 610, h: 360, dir: 'e', name: 'Nieves', at: [700, 660], look: () => say(F().ch === 5 && F().lobby_return_seen ? 'alan_look_nieves_sat' : 'alan_look_nieves'),
        talk: () => S.talkNieves(),
        items: { inscription: () => S.fax('inscription'), letter: () => S.fax('letter'), any: 'alan_fail_nieves_item' } },
      { id: 'gail', ch: 'gail', x: 250, y: 665, dir: 'e', name: 'Gail', when: () => [1, 2, 3, 6].includes(ch()), look: 'alan_look_gail', talk: () => S.talkGail() },
      { id: 'derek', ch: 'derek', x: 340, y: 668, dir: 'e', name: 'Derek', when: () => [1, 2, 6].includes(ch()), look: 'alan_look_derek', talk: () => S.talkDerek() },
    ],
    hotspots: [
      { name: 'Lost and found box', rect: [430, 440, 120, 80], at: [520, 640], look: () => { F().saw_blazer = true; return say(G.has('blazer') || F().blazer_got ? 'alan_look_lostfound_2' : 'alan_look_lostfound'); },
        use: () => { F().saw_blazer = true; return say('alan_use_lostfound'); }, take: () => { F().saw_blazer = true; return say('alan_use_lostfound'); } },
      { name: 'Fax machine', rect: [760, 440, 90, 70], at: [760, 650], look: 'alan_look_fax_machine', use: () => say('alan_use_fax_machine'),
        items: { inscription: () => S.fax('inscription'), letter: () => S.fax('letter') } },
      { name: 'House phone', rect: [880, 450, 60, 60], at: [900, 650], look: 'alan_look_house_phone', use: () => S.housePhone() },
      { name: 'Lifts', rect: [1120, 250, 140, 320], at: [1150, 650], exit: 'hotel_room', entry: 'hotel_lobby', door: null, look: 'alan_look_lifts',
        locked: () => ch() === 1 && ((!F().reception_done && !G.has('blazer')) || (F().mist_seen && !F().called_tue2)),
        lockedLine: () => F().mist_seen ? 'alan_lift_call' : 'alan_lift_tue' },
      { name: 'Out to Las Canteras', rect: [20, 250, 110, 320], at: [70, 650], exit: 'canteras', entry: 'hotel_lobby', lockedLine: () => S.mapLock && S.mapLock(), locked: () => !!(S.mapLock && S.mapLock()) },
    ],
    async enter(entry) {
      if (ch() === 5 && entry === 'map' && !F().lobby_return_seen) return S.lobbySat();
    },
  });
  S.lobbyArrival = async function () {
    F().narr_hotel_lobby = true; F().nieves_met = true;
    await say('narr_t_hotel_1', 'narr_t_hotel_2', 'nieves_t_hello', 'alan_t_nieves_1', 'nieves_t_1', 'narr_t_eyebrow', 'vasco_t_lobby_1');
    S.sfx('case_open', 0.4);
    await say('nieves_t_box', 'nieves_lostfound', 'vasco_t_lobby_3');
    F().jacket_needed = true;
  };
  S.talkNieves = async function () {
    const f = F();
    await G.dialog([
      { line: 'alan_ask_lostfound', once: true, when: () => ch() === 1 && !G.has('blazer') && !f.blazer_got, run: () => say('nieves_lostfound') },
      { line: 'alan_claim_blazer', when: () => ch() === 1 && (f.saw_blazer || f.gail_hint) && !f.blazer_got, run: () => S.claimBlazer() },
      { line: 'alan_ask_message', when: () => ch() >= 2, run: () => say(ch() === 5 || ch() === 6 ? 'nieves_no_message_sat' : ch() === 4 ? 'nieves_message_fri' : 'nieves_message_day') },
      { line: 'alan_ask_fax', when: () => ch() === 2 && (G.has('inscription') || G.has('letter')) && !(f.faxed_inscription && f.faxed_letter), run: () => say('nieves_fax_how') },
      { line: 'alan_ask_fax_in', when: () => ch() === 5 && f.called_sat && !G.has('fax'), run: () => S.faxArrives() },
      { line: 'alan_ask_nieves_island', once: true, run: () => say('nieves_island') },
      { line: 'alan_bye_nieves', bye: true, run: () => say('nieves_bye') },
    ]);
  };
  S.claimBlazer = async function () {
    const f = F();
    await say('nieves_pocket');
    await G.dialog([
      { line: 'alan_pocket_cigar', when: () => f.gail_hint, run: async () => {
        await say('nieves_blazer_ok');
        f.blazer_got = true; f.blazer_on = true; S.give('blazer');
        S.sfx('cloth_jacket', 0.5);
        await say('narr_t_sleeves', 'nieves_t_elegant', 'alan_blazer_on');
      }, bye: true },
      { line: 'alan_pocket_dignity', run: () => say('nieves_pocket_dignity'), bye: true },
      { line: 'alan_pocket_nothing', run: () => say('nieves_pocket_nothing'), bye: true },
    ]);
  };
  S.talkGail = async function () {
    const f = F();
    if (ch() === 1) { if (!f.gail_hint) { f.gail_hint = true; return say('gail_t_1', 'derek_t_1', 'gail_t_2', 'alan_t_gail'); } return say('gail_t_again'); }
    if (ch() === 2) return say(f.gail_wed ? 'gail_w_again' : (f.gail_wed = true, 'gail_w_1'));
    if (ch() === 3) return say('gail_th_1');
    if (ch() === 6) return say('gail_su_1', 'derek_su_1');
  };
  S.talkDerek = async function () {
    if (ch() === 1) return say('derek_t_2', 'alan_t_derek');
    if (ch() === 2) return say('derek_w_1');
    if (ch() === 6) return say('derek_su_2');
  };
  // the fax machine behind the desk: Nieves sends things to Lisbon (the number's on Alan's card)
  S.fax = async function (what) {
    const f = F();
    if (f['faxed_' + what]) return say('nieves_fax_done');
    f['faxed_' + what] = true;
    await say(what === 'inscription' ? 'alan_fax_inscription' : 'alan_fax_letter');
    S.sfx('typewriter', 0.3); await T(1200);
    await say(f.faxed_inscription && f.faxed_letter ? 'nieves_fax_both' : 'nieves_fax_one');
    if (what === 'letter') G.toast('The letter itself stays in Alan\'s pocket');
    if (S.checkWed) await S.checkWed();
  };
  S.housePhone = async function () {
    if (ch() === 5 || ch() === 6) { S.sfx('phone_dial', 0.5); await T(1500); F().radio_tried = true; return say('alan_dig_no_answer'); }
    return say('alan_use_house_phone');
  };

  // ================================================================ HOTEL: the room
  ROOMS.hotel_room = S.room({
    name: 'Room 404', bg: 'hotel_room', floor: 'wood', ambience: 'night', door: 'door',
    entries: { default: [900, 660, 'w'], hotel_lobby: [1100, 660, 'w'] },
    npcs: [
      { id: 'vasco', x: 520, y: 650, dir: 'e', name: 'Vasco', when: () => (ch() === 1 && F().called_tue2) || (ch() === 4 && !F().fight_done),
        look: 'alan_look_vasco_room', talk: () => ch() === 1 ? S.endTue() : S.fight() },
    ],
    hotspots: [
      { name: 'Balcony window', rect: [860, 120, 260, 280], at: [980, 620], look: () => say(['', 'alan_look_window_1', 'alan_look_window_2', 'alan_look_window_3', 'alan_look_window_4', 'alan_look_window_5', 'alan_look_window_6', 'alan_look_window_7'][ch()]) },
      { name: 'Bed', rect: [140, 420, 500, 150], at: [420, 640], look: () => say(ch() === 5 ? 'alan_look_bed_sat' : 'alan_look_bed'), use: () => say(ch() === 5 ? 'alan_look_bed_sat' : 'alan_use_bed') },
      { name: 'Note on the pillow', rect: [200, 400, 70, 40], at: [300, 640], when: () => ch() === 2, look: 'alan_look_vnote', take: 'alan_look_vnote' },
      { name: 'Vasco\'s field bag', rect: [700, 480, 90, 80], at: [700, 650], when: () => ch() <= 3, look: 'alan_look_fieldbag' },
      { name: 'Packed bag', rect: [700, 480, 120, 80], at: [700, 650], when: () => ch() === 6, look: 'alan_look_packed', use: () => S.theChoice() },
      { name: 'Door', rect: [1120, 200, 140, 370], at: [1140, 650], exit: 'hotel_lobby', entry: 'hotel_room',
        locked: () => (ch() === 6 && !F().chose_carmen) || (ch() === 4 && !F().fight_done), lockedLine: () => ch() === 4 ? 'alan_door_fight' : 'alan_door_choice' },
    ],
    async enter() {
      if (ch() === 1 && F().called_tue2 && !F().tue_done) return S.endTue();
      if (ch() === 6 && !F().chose_carmen) return S.theChoice();
    },
  });

  // ================================================================ LAS CANTERAS
  // The visible clocks: the tide one step higher on the promenade every day; the San Juan bonfires taller every day.
  ROOMS.canteras = S.room({
    name: 'Las Canteras', bg: 'canteras', floor: 'stone', ambience: () => 'harbour',
    entries: { default: [640, 660, 'e'], map: [640, 660, 'e'], hotel_lobby: [1150, 660, 'w'] },
    npcs: [
      { id: 'vasco', x: 820, y: 650, dir: 'w', name: 'Vasco', when: () => ch() === 1 && F().reception_done && !F().walk_done, look: 'alan_look_vasco_reception', talk: () => say('vasco_t_walk_alan') },
      { id: 'chano', ch: 'chano', x: 160, y: 650, dir: 'e', name: 'Chano', at: [260, 660], look: 'alan_look_chano', talk: () => S.talkChano(),
        items: { note5000: () => S.buyPaper(), coins: () => say('chano_coins'), any: 'chano_any' } },
    ],
    ambient: [
      { id: 'surfer', frames: ['surfer_ph_idle'], talkFrames: ['surfer_ph_talk'], x: 1000, y: 650, dir: 'w', name: 'Surfers', look: () => S.lookSurfers(), talk: () => S.talkSurfers(), when: () => ch() <= 6 && !F().canteras_night },
    ],
    hotspots: [
      { name: 'The sea', rect: [440, 330, 520, 120], at: [700, 620], look: () => S.lookSea() },
      { name: 'Promenade steps', rect: [880, 500, 220, 60], at: [960, 640], look: () => say('alan_look_steps_' + Math.min(6, Math.max(1, S.tideStep()))) },
      { name: 'Bonfires', rect: [470, 470, 260, 80], at: [600, 640], when: () => ch() >= 2, look: () => say('alan_look_bonfire_' + Math.min(6, ch())) },
      { name: 'Phone box', rect: [300, 300, 80, 260], at: [340, 640], look: 'alan_look_phonebox', use: () => S.phoneBox(),
        items: { coins: () => S.phoneBox(), any: 'alan_fail_phone_item' } },
      { name: 'Kiosk', rect: [60, 260, 200, 200], at: [260, 660], look: 'alan_look_kiosk', use: () => S.talkChano(), noBox: false },
      { name: 'Hotel Cristina', rect: [1160, 240, 110, 330], at: [1200, 650], exit: 'hotel_lobby', entry: 'canteras' },
      S.toMap([1000, 560, 160, 40], [1080, 690]),
    ],
    async enter() {
      if (ch() === 1 && F().reception_done && !F().mist_seen) { F().narr_canteras = true; return S.walkTue(); }
      if (!F().narr_canteras) { F().narr_canteras = true; await say('narr_t_canteras_1', 'narr_t_canteras_2'); }
    },
    animFg(g, t) { S.drawMist(g, t, S.mistNow()); },
  });
  S.mistNow = () => (ch() === 1 && F().mist_seen) ? 0.8 : ch() >= 4 && ch() <= 6 ? 0.35 : 0;
  S.lookSea = () => say(['', F().mist_seen ? 'alan_look_sea_mist' : 'alan_look_sea_1', 'alan_look_sea_2', 'alan_look_sea_3', 'alan_look_sea_4', 'alan_look_sea_5', 'alan_look_sea_6', 'alan_look_sea_7'][ch()]);
  // Alan and the surfers: young, cool and beautiful, and they make him feel thirty-eight. One look a day, four in all;
  // after Rafa, none at all.
  const SURF = ['alan_surf_1', 'alan_surf_2', 'alan_surf_3', 'alan_surf_4'];
  S.lookSurfers = async function () {
    const f = F();
    if (ch() >= 5) return say('narr_surf_after'); // (no joke: the absence of a joke is the joke failing)
    if (f.surf_day === ch()) return say('alan_surf_again');
    f.surf_day = ch(); const k = f.surf_n || 0; f.surf_n = k + 1;
    return say(SURF[Math.min(k, SURF.length - 1)]);
  };
  S.talkSurfers = () => say(['', 'surfer_bark_1', 'surfer_bark_2', 'surfer_bark_3', 'surfer_bark_4', 'surfer_bark_5', 'surfer_bark_6'][Math.min(6, ch())]);
  // Chano: change for the phone, a paper a day, gossip and the weather
  // Tuesday: change for Lisbon, a paper for the good rate, and a secret for free
  S.buyPaper = async function () {
    const f = F();
    if (G.has('note5000')) {
      f.chano_met = true;
      await say('alan_t_chano_1', 'chano_t_lisbon', 'alan_t_chano_2', 'chano_t_doctor', 'alan_t_chano_3', 'chano_hello', 'alan_buy_paper');
      S.sfx('coins_clink', 0.6);
      G.takeItem('note5000'); f.coins = (f.coins || 0) + 6; S.give('coins'); f.paper_day = ch(); S.give('newspaper');
      await say('chano_change', 'chano_t_secret', 'alan_t_chano_why', 'chano_t_knees');
      return;
    }
    return S.talkChano();
  };
  S.talkChano = async function () {
    const f = F();
    if (G.has('note5000')) return S.buyPaper();
    if (!f.chano_met) { f.chano_met = true; await say('chano_hello'); }
    await G.dialog([
      { line: 'alan_ask_change', when: () => G.has('note5000'), run: () => S.buyPaper(), bye: true },
      { line: 'alan_ask_change_again', when: () => !G.has('note5000') && !G.has('coins'), run: async () => {
        await say('chano_change_again_' + Math.min(6, ch())); f.coins = (f.coins || 0) + 4; S.give('coins');
      }, bye: true },
      { line: 'alan_ask_paper', when: () => !G.has('note5000') && f.paper_day !== ch(), run: async () => { await say('chano_paper'); f.paper_day = ch(); G.takeItem('newspaper'); S.give('newspaper', true); G.toast('Today\'s La Provincia'); } },
      { line: 'alan_ask_gossip', when: () => f.gossip_day !== ch(), run: async () => { f.gossip_day = ch(); await say('chano_gossip_' + Math.min(6, ch())); if (ch() === 2) f.herring_chano = true; } },
      { line: 'alan_ask_weather', once: true, run: () => say('chano_weather_' + Math.min(6, ch())) },
      { line: 'alan_bye_chano', bye: true, run: () => say('chano_bye') },
    ]);
  };
  // after nine: the walk on the promenade, the bonfire for San Juan, and the black mist, against the wind, under the
  // grey panza de burro. Only Alan knows the smell, and he doesn't say.
  S.walkTue = async function () {
    const f = F();
    await G.busy(async () => {
      await say('narr_t_walk_1', 'alan_t_walk_1', 'narr_t_walk_2', 'vasco_t_sanjuan_1', 'vasco_t_sanjuan_2', 'alan_t_walk_2', 'vasco_t_walk_alan',
        'alan_t_walk_3', 'vasco_t_sanjuan_3', 'alan_t_walk_4', 'narr_t_walk_3');
      f.mist_seen = true;
      await S.paint('still_mist', async () => {
        S.sfx('crash_wave', 0.4); await T(800);
        await say('narr_mist_1', 'narr_mist_2', 'narr_mist_3');
        S.sfx('water_lap', 0.3);
        await say('alan_mist_2', 'narr_mist_4', 'vasco_t_mist_1', 'narr_mist_5', 'alan_mist_3', 'narr_mist_6');
      }, { zoom: [1.0, 1.12], pan: [[0.5, 0.55], [0.5, 0.6]] });
      G.endStill(); await G.fade(false);
      await say('vasco_t_walk_up');
      f.walk_done = true; G.refreshNpcs();
    });
  };

  // ================================================================ EL MUSEO CANARIO: the hall
  ROOMS.museum_hall = S.room({
    name: 'El Museo Canario', bg: 'museum_hall', floor: 'tile', ambience: 'museum', door: 'door',
    entries: { default: [140, 660, 'e'], map: [140, 660, 'e'], archive: [960, 660, 'w'], baute_office: [640, 660, 's'] },
    npcs: [
      { id: 'baute', ch: 'baute', x: 520, y: 650, dir: 'e', name: 'Dr. Rayco Baute', when: () => (ch() === 1 && !F().reception_done) || (ch() === 3 && S.dinnerDue() && !F().caught),
        look: 'alan_look_baute', talk: () => ch() === 1 ? S.talkBauteTue() : say('baute_th_busy'), items: { any: 'alan_fail_baute_item' } },
      { id: 'vasco', x: 800, y: 650, dir: 'w', name: 'Vasco', when: () => (ch() === 1 && !F().reception_done) || (ch() === 3 && S.dinnerDue() && !F().caught),
        look: () => say(ch() === 1 ? 'alan_look_vasco_reception' : 'alan_look_vasco_dinner'), talk: () => say(ch() === 1 ? 'vasco_t_reception' : 'vasco_th_dinner') },
      { id: 'carmen', ch: 'carmen', x: 1150, y: 640, dir: 'w', name: 'Dr. Carmen Trujillo', when: () => ch() === 1 && !F().reception_done,
        look: 'alan_look_carmen_steps', talk: () => S.talkCarmenTue() },
      { id: 'montesdeoca', ch: 'montesdeoca', x: 300, y: 662, dir: 'e', name: 'Ignacio Montesdeoca', when: () => (ch() === 1 && !F().reception_done) || ch() === 2 || (ch() === 3 && S.dinnerDue() && !F().caught),
        look: () => say(ch() === 2 ? 'alan_look_montesdeoca_wed' : 'alan_look_montesdeoca'), talk: () => S.talkMontesdeoca() },
      { id: 'guard', ch: 'guard', x: 660, y: 600, h: 380, dir: 'e', name: 'Museum guard', when: () => ch() === 3 && S.dinnerDue() && !F().derek_sent,
        look: 'alan_look_guard', talk: () => say('guard_th_1') },
      { id: 'gail', ch: 'gail', x: 940, y: 668, dir: 'w', name: 'Gail', when: () => ch() === 3 && S.dinnerDue() && !F().caught, look: 'alan_look_gail', talk: () => say('gail_th_dinner') },
      { id: 'derek', ch: 'derek', x: 1020, y: 670, dir: 'w', name: 'Derek', when: () => ch() === 3 && S.dinnerDue() && !F().caught, look: 'alan_look_derek_cam', talk: () => S.talkDerekDinner() },
    ],
    hotspots: [
      { name: 'Display cases', rect: [180, 380, 540, 160], at: [440, 640], look: () => say(ch() === 2 ? 'alan_look_cases_wed' : 'alan_look_cases') },
      { name: 'Montesdeoca\'s van', rect: [1100, 200, 140, 200], at: [1150, 650], when: () => ch() === 2, look: () => { F().herring_van = true; return say('alan_look_van'); } },
      { name: 'Door to the steps', rect: [1100, 200, 140, 360], at: [1150, 650], when: () => ch() === 1, look: 'alan_look_steps_door' },
      { name: 'Corridor to the offices', rect: [580, 300, 160, 260], at: [660, 640], when: () => ch() === 3 && S.dinnerDue(),
        look: () => say(F().derek_sent ? 'alan_look_corridor_free' : 'alan_look_corridor'), exit: 'baute_office', entry: 'museum_hall',
        locked: () => !F().derek_sent, lockedLine: 'guard_th_stop' },
      { name: 'Dinner table', rect: [860, 440, 260, 100], at: [960, 640], when: () => ch() === 3 && S.dinnerDue(), look: 'alan_look_table',
        take: async () => { if (G.has('knife') || F().desk_open) return say('alan_table_again'); S.give('knife'); await say('alan_take_knife'); } },
      { name: 'Archive stairs', rect: [960, 300, 120, 260], at: [980, 650], when: () => ch() >= 2 && ch() <= 4 && !(ch() === 3 && S.dinnerDue()), exit: 'archive', entry: 'museum_hall' },
      { name: 'Out to Vegueta', rect: [20, 250, 110, 320], at: [70, 650], exit: () => S.leaveMuseum(), entry: 'museum_hall',
        locked: () => (ch() === 1 && !(F().met_baute && F().met_carmen)) || (ch() === 3 && S.dinnerDue() && !F().caught), lockedLine: () => ch() === 1 ? 'alan_reception_stay' : 'alan_dinner_stay' },
    ],
    async enter() {
      if (!F().narr_museum_hall && ch() === 1) { F().narr_museum_hall = true; await say('narr_t_museum_1', 'narr_t_museum_2'); }
    },
  });
  // leaving the reception: dusk on Las Canteras (the mist); otherwise the map
  S.leaveMuseum = () => {
    if (ch() === 1 && F().met_baute && F().met_carmen && !F().reception_done) { F().reception_done = true; return 'canteras'; }
    return 'map';
  };
  S.talkBauteTue = async function () {
    const f = F();
    if (!f.met_baute) {
      f.met_baute = true;
      await say('baute_t_skulls', 'narr_t_baute_1', 'baute_t_1', 'alan_t_baute_1', 'baute_t_2', 'baute_t_2b', 'alan_t_baute_2', 'narr_t_baute_2',
        'baute_t_gran_1', 'baute_t_gran_2', 'narr_t_pendant', 'baute_t_3', 'narr_t_baute_3');
      return;
    }
    await G.dialog([
      { line: 'alan_ask_baute_cave', once: true, run: () => say('baute_t_cave', 'baute_t_cave_2') },
      { line: 'alan_ask_baute_vasco', once: true, run: () => say('baute_t_vasco') },
      { line: 'alan_ask_baute_discs', once: true, run: () => say('baute_t_discs') },
      { line: 'alan_bye_baute', bye: true, run: () => say('baute_t_bye') },
    ]);
  };
  S.talkCarmenTue = async function () {
    const f = F();
    if (!f.met_carmen) {
      f.met_carmen = true;
      // her lighter: three tries (one try, later in the week, when she's at peace)
      for (let i = 0; i < 3; i++) { S.sfx('match', 0.45); await T(450); }
      await say('narr_t_carmen_1', 'alan_t_carmen_1', 'narr_t_carmen_2', 'carmen_t_1', 'alan_t_carmen_2', 'narr_t_carmen_3', 'carmen_t_2', 'alan_t_carmen_3',
        'carmen_t_3', 'alan_t_carmen_4', 'carmen_t_4', 'alan_t_carmen_5', 'carmen_t_5', 'narr_t_carmen_4');
      for (let i = 0; i < 3; i++) { S.sfx('match', 0.45); await T(400); }
      await say('carmen_t_6', 'alan_t_carmen_6', 'narr_t_carmen_5', 'carmen_t_7', 'alan_t_carmen_7');
      return;
    }
    return say('carmen_t_again');
  };
  S.talkMontesdeoca = async function () {
    const f = F();
    if (ch() === 1) { if (f.blazer_on && !f.monte_blazer) { f.monte_blazer = true; return say('montesdeoca_t_1', 'alan_t_monte_1', 'montesdeoca_t_2'); } return say('montesdeoca_t_again'); }
    if (ch() === 2) { f.herring_monte = true; return say('montesdeoca_w_1', 'alan_w_monte_1', 'montesdeoca_w_2'); }
    return say('montesdeoca_th_1');
  };

  // ---------------------------------------------------------------- the night
  S.endTue = async function () {
    const f = F();
    if (f.tue_done) return;
    f.tue_done = true;
    await G.busy(async () => {
      await say('narr_t_room_1', 'vasco_t_night_1', 'alan_t_night_1', 'vasco_t_night_2', 'alan_t_night_2', 'vasco_t_night_3', 'alan_t_night_3',
        'vasco_t_night_4', 'narr_t_laugh', 'vasco_t_night_5');
      if (!S.discreet()) await S.paint('still_love_1', async () => { await say('narr_love_1', 'narr_love_1b'); await T(1200); }, { zoom: [1.0, 1.1] });
      else { await G.fade(true); await say('narr_love_1_discreet'); }
      await say('narr_t_end_1', 'narr_t_end_2', 'narr_t_end_3');
      G.endStill();
      await S.startWed();
    });
  };
})();
