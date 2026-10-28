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

  // ---------------------------------------------------------------- small moving details over the paintings (as Game I's
  // entry 21: nothing in art/bg changes, everything is drawn over it in a room's animBack, deterministic in t)
  const im = () => G.bgImage();
  const clipTo = (g, shapes) => {
    g.beginPath();
    for (const s of shapes) {
      if (typeof s[0] === 'number') g.rect(s[0], s[1], s[2], s[3]);
      else { s.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); }
    }
    g.clip();
  };
  // the panza de burro drifting: a soft cloud bank slid slowly across the painted sky, kept inside `shapes`
  const BANKS = {};
  function drift(g, t, key, shapes, o) {
    const cl = BANKS[key] || (BANKS[key] = FX.makeClouds(o.seed || 11, o.rgb || '238,238,234', o.n || 22));
    g.save(); clipTo(g, shapes); FX.drawClouds(g, cl, t, o.speed || 5, o.y || 0, o.a || 0.4); g.restore();
  }
  // the sea's edge: a thin line of foam washing up the sand and back, along a painted shoreline (lists of points)
  function foam(g, t, lines, o) {
    const per = (o && o.per) || 7, reach = (o && o.reach) || 6, a = (o && o.a) || 0.35;
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    lines.forEach((pts, j) => {
      for (let k = 0; k < 2; k++) {
        const p = ((t / per + j * 0.37 + k * 0.5) % 1), dy = reach * Math.sin(p * Math.PI), al = a * Math.sin(p * Math.PI);
        g.strokeStyle = `rgba(240,240,232,${al.toFixed(3)})`; g.lineWidth = (o && o.w) || 1.6;
        g.beginPath(); pts.forEach(([x, y], i) => { const yy = y + dy + Math.sin(x * 0.05 + t * 0.8) * 0.8; i ? g.lineTo(x, yy) : g.moveTo(x, yy); }); g.stroke();
      }
    });
    g.restore();
  }
  // a ceiling fan turning: soft translucent blades sweeping round under the painted ones (ry/rx: its perspective)
  function ceilFan(g, t, x, y, rx, ry, rps, a) {
    g.save(); g.translate(x, y); g.scale(1, ry / rx); g.fillStyle = `rgba(30,22,16,${a || 0.12})`;
    for (let i = 0; i < 5; i++) {
      const b = t * rps * Math.PI * 2 + i * Math.PI * 2 / 5;
      g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, rx, b, b + 0.32); g.closePath(); g.fill();
    }
    g.restore();
  }
  // a lamp's light breathing: a glow that flickers (a flame) or barely moves (a bulb)
  const lamp = (g, t, x, y, r, rgb, a, seed, live) => FX.glow(g, x, y, r, rgb, a * (live ? FX.flicker(t, seed) : 0.94 + 0.06 * Math.sin(t * 0.9 + seed)));

  // ================================================================ GANDO
  ROOMS.gando = S.room({
    music: 'gando',
    name: 'Gando airport', bg: 'gando', floor: 'tile', ambience: 'museum', door: 'door',
    animBack(g, t) {
      // the sky over the apron through the glass (between the mullions, above the Iberia tail), a gull or two
      const panes = [[[108, 22], [252, 62], [252, 285], [108, 285]], [[266, 66], [380, 96], [380, 218], [266, 218]], [[393, 100], [440, 112], [440, 270], [393, 270]]];
      drift(g, t, 'gando', panes, { speed: 4, a: 0.35, seed: 3 });
      g.save(); clipTo(g, panes); FX.birds(g, t, { y0: 120, y1: 200, n: 2, period: 21, color: 'rgba(60,60,64,0.6)', size: 4, x0: 90, x1: 460 }); g.restore();
      // the empty belt going round ("The belt goes round. My suitcase doesn't."): its slats sliding by
      g.save(); clipTo(g, [[[322, 476], [348, 463], [420, 457], [858, 446], [874, 449], [856, 465], [800, 473], [345, 488]]]);
      g.strokeStyle = 'rgba(255,236,200,0.05)'; g.lineWidth = 1.5;
      for (let x = 300 - (t * 22) % 26; x < 900; x += 26) { g.beginPath(); g.moveTo(x, 444); g.lineTo(x - 5, 490); g.stroke(); }
      for (let k = 0; k < 2; k++) {
        const bx = 300 + ((t * 22 + k * 300) % 600), gr = g.createLinearGradient(bx - 40, 0, bx + 40, 0);
        gr.addColorStop(0, 'rgba(255,232,190,0)'); gr.addColorStop(0.5, 'rgba(255,232,190,0.07)'); gr.addColorStop(1, 'rgba(255,232,190,0)');
        g.fillStyle = gr; g.fillRect(bx - 40, 440, 80, 52);
      }
      g.restore();
      // the strip light hums; the palm by the taxi door stirs in the street air
      lamp(g, t, 390, 46, 130, '255,240,200', 0.07, 1, false);
      FX.sway(g, im(), [1212, 282, 50, 70], t * 0.7, 0.8, 0, true);
    },
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
    music: 'hotel_lobby',
    name: 'Hotel Cristina', bg: 'hotel_lobby', floor: 'tile', ambience: 'museum', door: 'door',
    animBack(g, t) {
      // through the street windows: the palm fronds stir, the promenade lamp and the sea at night
      FX.sway(g, im(), [100, 82, 110, 66], t * 0.6, 1, 0.4, true); FX.sway(g, im(), [0, 62, 74, 64], t * 0.6, 1, 1.3, true);
      FX.ripple(g, im(), [0, 322, 74, 26], t * 0.6, 0.6, 0.25);
      lamp(g, t, 39, 232, 26, '255,226,160', 0.25, 2, false);
      // the wall lantern's flame and the desk lamp
      lamp(g, t, 398, 162, 46, '255,190,110', 0.22, 3, true);
      lamp(g, t, 812, 245, 70, '255,214,150', 0.08, 4, false);
    },
    entries: { default: [140, 660, 'e'], map: [140, 660, 'e'], canteras: [140, 660, 'e'], hotel_room: [1120, 660, 'w'], gando: [140, 660, 'e'], hotel_restaurant: [1150, 680, 'w'] },
    npcs: [
      { id: 'nieves', ch: 'nieves', x: 640, y: 610, h: 360, dir: 'e', name: 'Nieves', at: [700, 660], look: () => say(F().ch === 5 && F().lobby_return_seen ? 'alan_look_nieves_sat' : 'alan_look_nieves'),
        talk: () => S.talkNieves(),
        items: { inscription: () => S.fax('inscription'), letter: () => S.fax('letter'), any: 'alan_fail_nieves_item' } },
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
      { name: 'To the restaurant', rect: [1230, 420, 50, 296], at: [1210, 680], exit: 'hotel_restaurant', entry: 'hotel_lobby' },
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
    music: 'hotel_room',
    name: 'Room 404', bg: 'hotel_room', floor: 'wood', ambience: 'night', door: 'door',
    animBack(g, t) {
      // through the open balcony door: the lid of cloud drifting, the bay moving, the surf on the far beach
      drift(g, t, 'room404', [[860, 112, 140, 165]], { speed: 3, a: 0.4, seed: 7 });
      FX.ripple(g, im(), [860, 318, 140, 40], t * 0.5, 0.8, 0.3);
      foam(g, t, [[[862, 330], [900, 326], [940, 323], [1000, 322]]], { per: 9, reach: 2, a: 0.25, w: 1 });
      // the air off the sea: the curtains breathe, the fan turns slowly
      FX.billow(g, im(), [722, 70, 66, 455], t, 1.6, 8); FX.billow(g, im(), [1035, 52, 92, 490], t + 2, 1.8, 9);
      ceilFan(g, t, 497, 78, 125, 16, 0.6, 0.1);
      lamp(g, t, 14, 345, 60, '255,214,150', 0.07, 5, false);
    },
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
    music: 'canteras',
    name: 'Las Canteras', bg: 'canteras', floor: 'stone', ambience: () => 'harbour',
    animBack(g, t) {
      // the panza de burro drifting over the bay, gulls, the sea moving and the foam on the shore
      drift(g, t, 'canteras', [[300, 0, 620, 345], [0, 0, 300, 160], [[920, 0], [1060, 0], [1000, 60], [920, 140]]], { speed: 4, a: 0.35, seed: 13, rgb: '232,226,214' });
      FX.birds(g, t, { y0: 70, y1: 260, n: 3, period: 24, color: 'rgba(58,56,54,0.55)', size: 5, x0: 300, x1: 920 });
      FX.ripple(g, im(), [425, 372, 555, 44], t * 0.6, 0.8, 0.2); FX.ripple(g, im(), [425, 416, 190, 48], t * 0.6, 0.8, 0.2);
      foam(g, t, [[[422, 466], [500, 463], [606, 459]], [[740, 455], [818, 450]], [[905, 446], [950, 440], [990, 428]]], { per: 8, reach: 4, a: 0.3 });
      // the palms by the hotel and the newspapers pegged on the kiosk
      FX.sway(g, im(), [920, 40, 250, 240], t * 0.5, 1.1, 0, true); FX.sway(g, im(), [1060, 0, 220, 140], t * 0.5, 1, 1.7, true);
      FX.sway(g, im(), [35, 334, 222, 62], t * 0.8, 0.7, 0.5);
    },
    entries: { default: [640, 660, 'e'], map: [640, 660, 'e'], hotel_lobby: [1150, 660, 'w'], beach: [820, 665, 'n'] },
    npcs: [
      { id: 'vasco', x: 820, y: 650, dir: 'w', name: 'Vasco', when: () => ch() === 1 && F().reception_done && !F().walk_done, look: 'alan_look_vasco_reception', talk: () => say('vasco_t_walk_alan') },
      { id: 'chano', ch: 'chano', x: 160, y: 650, dir: 'e', name: 'Chano', at: [260, 660], look: 'alan_look_chano', talk: () => S.talkChano(),
        items: { note5000: () => S.buyPaper(), coins: () => say('chano_coins'), any: 'chano_any' } },
    ],
    hotspots: [
      { name: 'Down to the beach', rect: [700, 560, 250, 50], at: [820, 665], exit: 'beach', entry: 'canteras' },
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
    music: 'museum_hall',
    name: 'El Museo Canario', bg: 'museum_hall', floor: 'tile', ambience: 'museum', door: 'door',
    animBack(g, t) {
      // the hanging lanterns' flames
      [[226, 190, 1], [455, 300, 2], [557, 310, 3], [1030, 285, 4], [953, 392, 5]].forEach(([x, y, s]) => lamp(g, t, x, y, 44, '255,186,100', 0.2, s, true));
      // the courtyard through the open door: its plants stir; cigarette smoke drifting in from the steps (Carmen's)
      FX.sway(g, im(), [1102, 330, 40, 140], t * 0.6, 0.8, 0, true); FX.sway(g, im(), [1150, 395, 40, 70], t * 0.6, 0.7, 1, true);
      if (ch() === 1 && !F().reception_done) { g.save(); clipTo(g, [[1095, 260, 125, 260]]); FX.wisps(g, t, 1190, 420, { n: 5, rise: 120, spread: 30, rgb: '220,220,215', a: 0.06, size: 14, speed: 0.12 }); g.restore(); }
    },
    entries: { default: [140, 660, 'e'], map: [140, 660, 'e'], archive: [960, 660, 'w'], baute_office: [640, 660, 's'], museum_courtyard: [1120, 660, 'w'] },
    npcs: [
      { id: 'baute', ch: 'baute', x: 520, y: 650, dir: 'e', name: 'Dr. Rayco Baute', when: () => (ch() === 1 && !F().reception_done) || (ch() === 3 && S.dinnerDue() && !F().caught),
        look: 'alan_look_baute', talk: () => ch() === 1 ? S.talkBauteTue() : say('baute_th_busy'), items: { any: 'alan_fail_baute_item' } },
      { id: 'vasco', x: 800, y: 650, dir: 'w', name: 'Vasco', when: () => (ch() === 1 && !F().reception_done) || (ch() === 3 && S.dinnerDue() && !F().caught),
        look: () => say(ch() === 1 ? 'alan_look_vasco_reception' : 'alan_look_vasco_dinner'), talk: () => say(ch() === 1 ? 'vasco_t_reception' : 'vasco_th_dinner') },
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
      { name: 'Door to the steps', rect: [1100, 200, 140, 360], at: [1150, 650], when: () => ch() === 1, look: 'alan_look_steps_door', exit: 'museum_courtyard', entry: 'museum_hall' },
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
  // ================================================================ LAS CANTERAS: the sand (the surfers' place)
  ROOMS.beach = S.room({
    music: 'beach',
    name: 'Las Canteras · the beach', bg: 'beach', floor: 'sand', ambience: () => 'harbour',
    animBack(g, t) {
      // the panza de burro sliding in off the sea, gulls over the surf
      drift(g, t, 'beach', [[[0, 0], [1280, 0], [1280, 300], [900, 292], [700, 285], [620, 272], [600, 256], [500, 246], [430, 238], [400, 208], [350, 193], [280, 183], [250, 168], [200, 138], [150, 116], [70, 110], [58, 40], [0, 28]]], { speed: 5, a: 0.4, seed: 17 });
      FX.birds(g, t, { y0: 80, y1: 250, n: 3, period: 22, color: 'rgba(52,54,56,0.55)', size: 5, x0: 500, x1: 1300 });
      // the sea between the boards rolling, the swash running up the sand and back
      FX.ripple(g, im(), [382, 348, 520, 120], t * 0.6, 1.2, 0.18); FX.ripple(g, im(), [1112, 348, 168, 138], t * 0.6, 1.2, 0.18);
      foam(g, t, [[[370, 393], [455, 405], [540, 418], [615, 428], [690, 437], [765, 445], [840, 452], [902, 458]], [[1112, 478], [1200, 483], [1280, 488]]], { per: 9, reach: 6, a: 0.22, w: 2.4 });
      // the beach umbrella's skirt and the palms along the promenade
      FX.sway(g, im(), [62, 334, 240, 84], t * 0.9, 0.8, 0);
      FX.sway(g, im(), [168, 160, 80, 95], t * 0.5, 0.9, 1.4, true); FX.sway(g, im(), [330, 225, 60, 70], t * 0.5, 0.8, 2.2, true);
    },
    entries: { default: [200, 665, 'e'], canteras: [200, 665, 'e'] },
    ambient: [
      { id: 'surfer', frames: ['surfer_ph_idle'], talkFrames: ['surfer_ph_talk'], x: 900, y: 655, dir: 'w', name: 'Surfers', look: () => S.lookSurfers(), talk: () => S.talkSurfers(), when: () => ch() <= 6 && !F().canteras_night },
    ],
    hotspots: [
      { name: 'Surfboards', rect: [900, 340, 220, 210], at: [960, 660], look: 'alan_look_surfboards' },
      { name: 'The sea', rect: [520, 310, 760, 110], at: [700, 640], look: () => S.lookSea() },
      { name: 'The sky', rect: [300, 0, 980, 200], at: [640, 660], look: 'alan_look_beach_sky' },
      { name: 'Towels', rect: [160, 470, 360, 70], at: [340, 660], look: 'alan_look_towels' },
      { name: 'Up to the promenade', rect: [0, 250, 110, 320], at: [70, 660], exit: 'canteras', entry: 'beach' },
    ],
    async enter() { if (!F().narr_beach) { F().narr_beach = true; await say('narr_beach_1'); } },
    animFg(g, t) { S.drawMist(g, t, S.mistNow()); },
  });

  // ================================================================ HOTEL CRISTINA: the restaurant (Gail and Derek)
  ROOMS.hotel_restaurant = S.room({
    music: 'hotel_restaurant',
    name: 'Hotel Cristina · the restaurant', bg: 'hotel_restaurant', floor: 'tile', ambience: 'museum', door: 'door',
    animBack(g, t) {
      // through the arched windows: the cloud drifting, the surf rolling in
      drift(g, t, 'restaurant', [[0, 122, 158, 110], [298, 158, 102, 60], [496, 160, 30, 45]], { speed: 4, a: 0.38, seed: 19 });
      FX.ripple(g, im(), [0, 256, 156, 70], t * 0.6, 1, 0.22);
      foam(g, t, [[[0, 262], [60, 262], [155, 268]]], { per: 9, reach: 3, a: 0.3, w: 1.2 });
      // the fans turning, steam off the chafing dishes, the sconces and the lamp
      ceilFan(g, t, 588, 80, 100, 14, 0.9, 0.1); ceilFan(g, t, 797, 120, 70, 10, 0.8, 0.09);
      [[720, 268], [812, 264], [885, 264], [962, 268]].forEach(([x, y], i) => FX.wisps(g, t + i * 1.3, x, y, { n: 4, rise: 40, spread: 6, a: 0.08, size: 7, speed: 0.25 }));
      [[258, 185, 1], [740, 188, 2], [955, 186, 3]].forEach(([x, y, s]) => lamp(g, t, x, y, 34, '255,214,150', 0.12, s, false));
      lamp(g, t, 1170, 222, 50, '255,214,150', 0.08, 4, false);
    },
    entries: { default: [1100, 670, 'w'], hotel_lobby: [1100, 670, 'w'] },
    npcs: [
      { id: 'gail', ch: 'gail', x: 560, y: 655, dir: 'e', name: 'Gail', when: () => [1, 2, 3, 6].includes(ch()), look: 'alan_look_gail', talk: () => S.talkGail() },
      { id: 'derek', ch: 'derek', x: 680, y: 662, dir: 'w', name: 'Derek', when: () => [1, 2, 6].includes(ch()), look: 'alan_look_derek', talk: () => S.talkDerek() },
    ],
    hotspots: [
      { name: 'Buffet', rect: [620, 300, 480, 90], at: [820, 640], look: 'alan_look_buffet' },
      { name: 'Windows', rect: [0, 0, 480, 320], at: [300, 650], look: 'alan_look_restaurant_windows' },
      { name: 'Dessert trolley', rect: [1020, 320, 155, 225], at: [1040, 660], look: 'alan_look_dessert_trolley' },
      { name: 'Back to the lobby', rect: [1230, 120, 50, 450], at: [1210, 670], exit: 'hotel_lobby', entry: 'hotel_restaurant' },
    ],
    async enter() { if (!F().narr_restaurant) { F().narr_restaurant = true; await say('narr_restaurant_1'); } },
  });

  // ================================================================ EL MUSEO CANARIO: the courtyard (where Alan finds Carmen)
  ROOMS.museum_courtyard = S.room({
    music: 'museum_courtyard',
    name: 'El Museo Canario · the courtyard', bg: 'museum_courtyard', floor: 'stone', ambience: 'street', door: 'door',
    animBack(g, t) {
      // the grey sky over the roof, a bird crossing
      const sky = [[[270, 0], [1110, 0], [1110, 50], [960, 56], [700, 63], [480, 78], [380, 83], [330, 68], [270, 40]]];
      drift(g, t, 'courtyard', sky, { speed: 3, a: 0.35, seed: 23 });
      g.save(); clipTo(g, sky); FX.birds(g, t, { y0: 15, y1: 50, n: 1, period: 19, color: 'rgba(40,40,44,0.6)', size: 5, x0: 260, x1: 1120 }); g.restore();
      // the dragon tree's crown and the bamboo by the fountain stir; the wall lanterns (the fountain stays dry)
      FX.sway(g, im(), [945, 135, 300, 155], t * 0.4, 0.7, 0, true); FX.sway(g, im(), [295, 160, 140, 300], t * 0.5, 1.1, 1.2, true);
      [[1250, 305, 1], [1028, 346, 2], [749, 364, 3]].forEach(([x, y, s]) => lamp(g, t, x, y, 30, '255,196,120', 0.16, s, true));
    },
    entries: { default: [160, 665, 'e'], museum_hall: [160, 665, 'e'] },
    npcs: [
      { id: 'carmen', ch: 'carmen', x: 840, y: 640, dir: 'w', name: 'Dr. Carmen Trujillo', when: () => ch() === 1 && !F().reception_done,
        look: 'alan_look_carmen_steps', talk: () => S.talkCarmenTue() },
    ],
    hotspots: [
      { name: 'Dragon tree', rect: [940, 130, 300, 400], at: [1050, 660], look: 'alan_look_dragon_tree' },
      { name: 'Fountain', rect: [395, 385, 170, 180], at: [480, 640], look: 'alan_look_courtyard_fountain' },
      { name: 'Archive boxes', rect: [140, 450, 120, 115], at: [220, 650], look: 'alan_look_courtyard_boxes' },
      { name: 'Back to the party', rect: [10, 280, 100, 285], at: [70, 660], exit: 'museum_hall', entry: 'museum_courtyard' },
    ],
    async enter() { if (!F().narr_courtyard && ch() === 1) { F().narr_courtyard = true; await say('narr_courtyard_1'); } },
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
