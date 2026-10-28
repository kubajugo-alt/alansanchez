// The Shortest Night — shared story state: the cast, items, days, the map, the phone box (Inês), the notebook,
// hints, the water and the mist, and the boxes drawn over placeholder rooms. Each day's file (prologue.js, tue.js …
// mon.js, vasco.js) adds its rooms to S.ROOMS and its scenes to S.
(function () {
  const G = window.Game;
  const F = () => G.flags;
  const say = async (...ids) => { for (const id of ids) await G.says(id); };
  const S = window.S = { G, F, say, ROOMS: {}, LINE_POSE: {} };
  G.sayChoice = id => say(id);
  S.T = ms => G.wait(window.FAST ? 20 : ms);
  S.sfx = (...a) => Sound.sfx(...a);
  S.once = (flag, fn) => async (...a) => { if (F()[flag]) return; F()[flag] = true; await fn(...a); };
  // small talk with background characters: one exchange, then a short repeat line
  S.chat = (flag, first, again) => () => F()[flag] ? say(...[].concat(again)) : (F()[flag] = true, say(...[].concat(first)));
  S.posed = async function (pose, fn) { const p = G.player; p.pose = p.visible ? pose : null; try { await fn(); } finally { p.pose = null; } };
  S.give = (id, silent) => G.giveItem(id, silent);
  // a character's frames: their Canva design (art/sprites/<id>_c.webp, scripts/figure_cut.py) once it's made, else the
  // stand-in figure (scripts/placeholders.py). One painting for now: the Ludo animation sets come later.
  S.ph = (id, scale, more, alias) => {
    const SP = window.SPRITES || {}, c = SP[id + '_c'] ? id + '_c' : alias && SP[alias + '_c'] ? alias + '_c' : null;
    const f = c ? { idle: [c], talk: [c], walk: [c] }
      : { idle: [id + '_ph_idle'], talk: [id + '_ph_talk', id + '_ph_idle'], walk: [id + '_ph_walk1', id + '_ph_idle'] };
    return { scale: scale || 1, frames: Object.assign(f, more || {}) };
  };
  // content setting (as Game I): 'full' or 'discreet' skips the love scenes' paintings
  const CONTENT_KEY = 'shortest-night-content';
  S.content = () => { try { return localStorage.getItem(CONTENT_KEY); } catch (e) { return S._content || null; } };
  S.setContent = v => { try { localStorage.setItem(CONTENT_KEY, v); } catch (e) { /* private mode */ } S._content = v; };
  S.discreet = () => (S.content() || S._content) === 'discreet';

  // ---------------------------------------------------------------- cast
  // Alan and Vasco wear Game I's frames until their own Ludo sets are made (scripts/import_game1.py); everyone new is a
  // placeholder figure (scripts/placeholders.py) until Canva designs them and Ludo animates them.
  S.CHARS = {
    alan: { scale: 1, talkRest: [2.5, 5.5], talkGesture: [1.2, 2.2], frames: {
      idle: ['alan_side', 'alan_idle2'], talk: ['alan_talk', 'alan_talk2'],
      walk: Array.from({ length: 24 }, (_, i) => 'alan_w24_' + String(i).padStart(2, '0')),
      front: 'alan_front', frontWalk: ['alan_front_walk1', 'alan_front', 'alan_front_walk2', 'alan_front'],
      back: 'alan_back', backWalk: ['alan_back_walk1', 'alan_back', 'alan_back_walk2', 'alan_back'],
      poses: { reach: 'alan_reach', read: 'alan_read', pickup: 'alan_pickup', write: 'alan_write', phone: 'alan_phone', fluster: 'alan_fluster',
        flirt: 'alan_flirt', wink: 'alan_wink', drink: 'alan_drink', yawn: 'alan_yawn', stretch: 'alan_stretch', climb: 'alan_climb', pull: 'alan_pull', asleep: 'alan_asleep' } } },
    vasco: { scale: 1.0, frames: {
      idle: ['vasco', 'vasco_idle2', 'vasco_idle3'], talk: ['vasco_talk', 'vasco_talk2', 'vasco_talk3'],
      walk: ['vasco_walk6_p1', 'vasco_walk6_p3', 'vasco_walk6_p5', 'vasco_walk6_p7', 'vasco_walk6_p9', 'vasco_walk6_p11', 'vasco_walk6_p13', 'vasco_walk6_p15'],
      front: 'vasco_front', back: 'vasco_back',
      poses: { reach: 'vasco_crouch', kneel: 'vasco_kneel', kneeltalk: 'vasco_kneel_talk', look: 'vasco_kneel_look', trowel: 'vasco_trowel', coffee: 'vasco_coffee',
        sip: 'vasco_coffee_sip', worried: 'vasco_worried', stern: 'vasco_stern', tender: 'vasco_tender', laugh: 'vasco_laugh', find: 'vasco_find', give: 'vasco_give',
        sit: 'vasco_sit', hand: 'vasco_hand_out', deflate: 'vasco_deflate' } } },
    carmen: S.ph('carmen', 0.92), carmen_field: S.ph('carmen_field', 0.92, null, 'carmen'), baute: S.ph('baute', 1.04), baute_dig: S.ph('baute_dig', 1.04, null, 'baute'),
    rafa: S.ph('rafa', 1.0), yeray: S.ph('yeray', 0.98), nieves: S.ph('nieves', 0.9), chano: S.ph('chano', 0.85), pino: S.ph('pino', 0.82),
    lolo: S.ph('lolo', 0.86), fermin: S.ph('fermin', 0.8), mercedes: S.ph('mercedes', 0.82), montesdeoca: S.ph('montesdeoca', 0.98),
    gail: S.ph('gail', 0.88), derek: S.ph('derek', 0.94), guard: S.ph('guard', 0.95), elena: S.ph('elena', 0.92), clerk: S.ph('clerk', 0.9),
    surfer: S.ph('surfer', 0.98),
  };
  // the walks' step lengths: Game I's measurements for the borrowed cycles (js/story/core.js there, S.WALK_PLANT)
  S.WALK_PLANT = { vasco_walk6_p1: [0.190, -0.148], vasco_walk6_p3: [0.112], vasco_walk6_p5: [0.028], vasco_walk6_p7: [-0.061],
    vasco_walk6_p9: [0.207, -0.153], vasco_walk6_p11: [0.112], vasco_walk6_p13: [0.030], vasco_walk6_p15: [-0.065] };
  for (let i = 0; i < 24; i++) { const k = (i + 7) % 12; S.WALK_PLANT['alan_w24_' + String(i).padStart(2, '0')] = k ? [0.166 - k * 0.0276] : [0.166, -0.166]; }
  S.walkTiming = Fr => {
    const W = Fr.walk, P = S.WALK_PLANT;
    if (!W || !W.every(f => P[f])) return;
    Fr.walkLen = W.map((f, i) => { const n = W[(i + 1) % W.length]; return Math.max(0.01, P[f][0] - (P[n].length > 1 ? P[n][1] : P[n][0])); });
    Fr.walkSteps = W.map((f, i) => (P[f].length > 1 ? i : -1)).filter(i => i >= 0);
  };
  window.FAIL_BY_CHAR = { carmen: 'alan_fail_carmen_item', baute: 'alan_fail_baute_item', nieves: 'alan_fail_nieves_item', rafa: 'alan_fail_rafa_item' };

  // ---------------------------------------------------------------- playing as Vasco (Saturday)
  // The player's figure becomes Vasco's: his frames, his voice for fail lines, his own pockets. Alan's are kept aside.
  S.becomeVasco = function () {
    const p = G.player, f = F();
    if (p.speaker === 'vasco') return;
    f.alan_inv = G.state.inv.slice(); G.state.inv = []; G.renderInv();
    p.ch = 'vasco'; p.speaker = 'vasco'; p.pose = null; f.as_vasco = true;
  };
  S.becomeAlan = function () {
    const p = G.player, f = F();
    p.ch = 'alan'; p.speaker = null; p.pose = null; f.as_vasco = false;
    G.state.inv = (f.alan_inv || []).slice(); delete f.alan_inv; G.renderInv();
  };
  // a save made while playing Vasco comes back as Vasco
  S.restorePlayer = () => { if (F().as_vasco) { G.player.ch = 'vasco'; G.player.speaker = 'vasco'; } };

  // ---------------------------------------------------------------- items
  window.PAINTED_ICONS = ['notebook', 'coins', 'newspaper', 'key', 'sketch', 'coffee', 'ledger', 'file55', 'tidecard', 'knife'];
  window.ICON_LABELS = { note5000: '5,000 ptas', blazer: 'Blazer', inscription: 'Rubbing', letter: '1751 letter', galindo: 'Abreu Galindo', napkin: 'Napkin',
    drawing: 'Drawing', fax: 'Fax', elena_notebook: "Elena's notebook", gc_photo: 'Photo', water: 'Water', discs: 'Discs', disc6: 'Sixth disc', trowel: 'Trowel',
    elena_charts: 'Sun charts', chalk: 'Chalk', clinometer: 'Clino-meter', vnotebook: 'Notebook', torch: 'Torch', ltrowel: 'Trowel', fuse: 'Fuse' };
  S.ITEMS = {
    notebook: { name: "Alan's notebook", read: () => S.readNotebook(), look: () => S.readNotebook() },
    note5000: { name: 'A 5,000-peseta note', look: 'alan_look_note' },
    coins: { name: () => (F().coins || 0) === 1 ? 'One 100-peseta coin' : `${F().coins || 0} coins of 100 pesetas`, look: 'alan_look_coins' },
    newspaper: { name: () => 'La Provincia, ' + S.dayName(), icon: () => 'newspaper', look: () => S.readPaper() },
    blazer: { name: 'A navy blazer (not his)', look: () => say(F().blazer_on ? 'alan_look_blazer_on' : 'alan_look_blazer') },
    inscription: { name: 'Rubbing of the bell', icon: () => 'sketch', look: () => S.readInscription() },
    letter: { name: 'The founders\' letter, 1751', icon: () => 'ledger', look: () => S.readLetter() },
    galindo: { name: 'Abreu Galindo\'s history', look: () => S.readGalindo() },
    knife: { name: 'Dinner knife', look: 'alan_look_knife' },
    napkin: { name: 'A napkin with my face on it', look: 'alan_look_napkin' },
    drawing: { name: 'Rafa\'s drawing', look: () => S.lookDrawing() },
    fax: { name: 'Inês\'s fax', icon: () => 'file55', look: () => S.readFax() },
    elena_notebook: { name: 'Elena Suárez\'s notebook', look: () => S.readElena() },
    gc_photo: { name: 'Guardia Civil photograph', look: () => S.readGcPhoto() },
    water: { name: 'Two litres of water', look: 'alan_look_water' },
    discs: { name: () => `Obsidian discs (${F().discs_left == null ? 5 : F().discs_left})`, look: 'alan_look_discs' },
    disc6: { name: 'The sixth disc', look: 'alan_look_disc6' },
    trowel: { name: 'Lorenzo\'s trowel', look: 'alan_look_trowel' },
    fuse: { name: 'The radio fuse', look: 'alan_look_fuse' },
    // Vasco's pockets
    vnotebook: { name: 'Vasco\'s notebook', look: () => say(F().v_notebook_again ? 'vasco_look_notebook_2' : (F().v_notebook_again = true, 'vasco_look_notebook')) },
    elena_charts: { name: 'Elena Suárez\'s sun charts', look: () => S.readCharts() },
    chalk: { name: 'Chalk', look: 'vasco_look_chalk' },
    clinometer: { name: 'Clinometer', look: 'vasco_look_clinometer' },
    ltrowel: { name: 'Lorenzo\'s trowel', icon: () => 'trowel', look: 'vasco_look_trowel' },
    torch: { name: 'Pocket torch', look: 'vasco_look_torch' },
  };

  // ---------------------------------------------------------------- days
  // ch is the day: 0 the prologue (21 Dec 1995), 1 Tuesday 18 June ... 7 Monday 24 June 1996
  S.DAYS = [
    ['PROLOGUE', '21 December 1995 · The winter solstice'],
    ['TUESDAY', '18 June 1996 · Arrival'], ['WEDNESDAY', '19 June · The Island'], ['THURSDAY', '20 June · The Break-in'],
    ['FRIDAY', '21 June · The Solstice'], ['SATURDAY', '22 June · The Morning After'], ['SUNDAY', '23 June · The Choice'],
    ['MONDAY', '24 June · San Juan'],
  ];
  S.dayName = () => ['', 'Tuesday 18 June', 'Wednesday 19 June', 'Thursday 20 June', 'Friday 21 June', 'Saturday 22 June', 'Sunday 23 June', 'Monday 24 June'][F().ch || 1];
  S.day = async function (n, line) {
    F().ch = n; if (G.room) G.refreshNpcs();
    S.sfx('chapter_toll', 0.3);
    await G.card(S.DAYS[n][0], S.DAYS[n][1], 3200);
    if (line) await G.say(line, { offscreen: true });
    G.autosave();
  };
  // the visible clocks: the tide on the promenade steps, the discs crossed off, the bonfires (one more each day)
  S.tideStep = () => Math.max(0, Math.min(6, (F().ch || 1) - 1 + (F().ch >= 5 ? 1 : 0)));
  S.discsOut = () => ({ 0: 1, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 6 })[F().ch || 0];

  // ---------------------------------------------------------------- the map
  const PIN = (id, x, y, text, open, go) => ({ id, x, y, text, open, go });
  S.PINS = [
    PIN('canteras', 668, 492, 'Las Canteras · the beach, the kiosk, the phone box', () => F().ch >= 1 && F().ch <= 6),
    PIN('hotel_lobby', 706, 470, 'Hotel Cristina', () => F().ch >= 1 && F().ch <= 6),
    PIN('isleta', 418, 316, 'La Isleta · the fishermen\'s quay', () => (F().ch >= 2 && F().ch <= 4) || (F().ch === 5 && F().fax_read && !F().isleta_flood)),
    PIN('museum_hall', 1156, 238, () => F().ch === 1 ? 'El Museo Canario · the reception, 8 pm' : F().ch === 3 && S.dinnerDue() ? 'El Museo Canario · the fundraising dinner' : 'El Museo Canario · Vegueta',
      () => (F().ch === 1 && G.has('blazer') && F().called_tue && !F().reception_done) || F().ch === 2 || (F().ch === 3 && !F().caught) || (F().ch === 4 && !F().cave_explained)),
    PIN('santa_ana', 1166, 218, 'Plaza de Santa Ana · the cathedral', () => F().ch >= 2 && F().ch <= 4),
    PIN('colon', 1138, 225, 'Casa de Colón', () => F().ch === 3 && F().sent_to_colon && !F().inquiry_read),
    PIN('rafa_bar', 1145, 232, 'Vegueta · a bar on Calle Mendizábal', () => F().ch === 4 && F().cave_explained && !F().rafa_night),
    PIN('carmen_flat', 1079, 250, 'Triana · Carmen\'s flat', () => F().ch === 6 && F().chose_carmen),
  ];
  // where a pin's label sits, when not straight above it (the Vegueta places are a few hundred metres apart)
  S.PIN_LABEL = { canteras: [-70, 80], museum_hall: [-110, 95], santa_ana: [-20, -100], colon: [-250, -25], rafa_bar: [-60, 150] };
  S.pinLabelAt = m => { const o = S.PIN_LABEL[m.id]; return o ? [m.x + o[0], m.y + o[1]] : [m.x, m.y - 14]; };
  S.pinNext = () => {
    const f = F();
    if (f.ch === 1) return !G.has('blazer') && !f.reception_done ? 'hotel_lobby' : !f.called_tue ? 'canteras' : !f.reception_done ? 'museum_hall' : !f.called_tue2 ? 'canteras' : 'hotel_lobby';
    if (f.ch === 3 && S.dinnerDue()) return 'museum_hall';
    if (f.ch === 4) return !f.cave_explained ? 'museum_hall' : 'rafa_bar';
    if (f.ch === 5 && f.fax_read && !f.isleta_flood) return 'isleta';
    return null;
  };
  S.ROOMS.map = {
    name: 'Las Palmas', bg: 'map', music: 'map', parallax: false, player: false, noSave: true, vignette: 0.25,
    anim(g, t) {
      // the sea glinting round the city, and the shadow of a cloud (the panza de burro) drifting over it
      FX.water(g, t * 0.6, 520, 18, 740, 70, '210,236,240');
      FX.water(g, t * 0.6, 240, 612, 370, 90, '210,236,240');
      { const x = ((t * 9) % 2000) - 360, y = 330 + Math.sin(t * 0.05) * 60, gr = g.createRadialGradient(x, y, 0, x, y, 340);
        gr.addColorStop(0, 'rgba(40,50,60,0.10)'); gr.addColorStop(1, 'rgba(40,50,60,0)');
        g.save(); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 340, 220, 0, 0, 7); g.fill(); g.restore(); }
      for (const m of S.PINS) {
        if (!m.open()) continue;
        const p = 0.5 + 0.5 * Math.sin(t * 3 + m.x);
        FX.glow(g, m.x, m.y, 40 + p * 14, '255,120,60', 0.45);
        if (S.pinNext() === m.id) { FX.glow(g, m.x, m.y, 60 + p * 20, '255,170,80', 0.5); g.save(); g.strokeStyle = `rgba(255,210,122,${0.45 + 0.4 * p})`; g.lineWidth = 2.5; g.beginPath(); g.arc(m.x, m.y, 18 + p * 5, 0, 7); g.stroke(); g.restore(); }
        if (S.PIN_LABEL[m.id]) { const [lx, ly] = S.pinLabelAt(m); g.save(); g.strokeStyle = 'rgba(42,10,4,0.75)'; g.lineWidth = 2; g.beginPath(); g.moveTo(m.x, m.y); g.lineTo(lx, ly - 12); g.stroke(); g.restore(); }
        g.fillStyle = '#7a1408'; g.strokeStyle = '#2a0a04'; g.lineWidth = 3; g.beginPath(); g.arc(m.x, m.y, 11, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(m.x, m.y, 4.5, 0, 7); g.fill();
      }
      g.font = "700 26px 'Cinzel', serif"; g.fillStyle = 'rgba(40,24,10,0.85)'; g.textAlign = 'right'; g.fillText(S.dayName(), 1240, 690); g.textAlign = 'left';
    },
    hotspots: S.PINS.map(m => ({ name: () => typeof m.text === 'function' ? m.text() : m.text, rect: [m.x - 30, m.y - 60, 60, 80], when: m.open, exit: m.go || m.id, entry: 'map', noBox: true })),
    labels: S.PINS.map(m => ({ x: S.pinLabelAt(m)[0], y: S.pinLabelAt(m)[1], text: () => typeof m.text === 'function' ? m.text() : m.text, when: m.open })),
  };
  // the way out to the map from a street, as a hotspot
  S.toMap = (rect, at) => ({ name: 'To the city', rect, at, exit: 'map', look: 'alan_look_tomap', kind: 'exit', locked: () => !!S.mapLock && !!S.mapLock(), lockedLine: () => S.mapLock && S.mapLock() });

  // ---------------------------------------------------------------- the phone box: calls to Inês
  // Every call costs a 100-peseta coin; Chano at the kiosk always has change, with gossip. Inês is the hint system:
  // the day's news first (a call that's due), then "What now?".
  S.CALLS = [ // [flag, when, lines, how]: the calls the story needs, in order. how.direct: the call opens on its own
    // first line, not Inês's hello; how.hangup: it ends when the money or the line runs out, with no "What now?"
    ['called_tue', () => F().ch === 1 && F().blazer_got && !F().reception_done, () => S.callTue1(), { direct: true, hangup: true }],
    ['called_tue2', () => F().ch === 1 && F().mist_seen, () => S.callTue(), { direct: true, hangup: true }],
    ['called_wed', () => F().ch === 2 && F().fermin_letter, () => S.callWed()],
    ['called_thu', () => F().ch === 3, () => S.callThu()],
    ['called_fri', () => F().ch === 4 && F().fight_done, () => S.callFri()],
    ['called_sat', () => F().ch === 5 && F().rafa_truth, () => S.callSat()],
  ];
  // Tuesday, before the reception: Pessoa and the Eça, the surfers, "Don't break anything"; and the money runs out
  S.callTue1 = async () => {
    await say('ines_t_eca_1', 'alan_t_call_1', 'ines_t_eca_2', 'alan_t_call_2', 'ines_t_eca_3', 'alan_t_call_3', 'ines_t_eca_4', 'narr_t_surfers',
      'alan_t_call_4', 'ines_t_what', 'alan_t_call_5', 'ines_t_alan', 'alan_t_call_6', 'ines_t_jealous', 'alan_t_call_7', 'ines_t_party', 'alan_t_call_8', 'ines_t_dontknow');
    S.sfx('beep', 0.5); await S.T(400);
    await say('narr_t_money');
  };
  // Tuesday, midnight: "It's here. It's come for me." And the line goes dead.
  S.callTue = async () => {
    await say('alan_call_tue_1', 'ines_call_tue_1', 'alan_call_tue_2', 'ines_call_tue_2', 'alan_call_tue_3', 'alan_call_tue_3b', 'ines_call_tue_3b',
      'ines_call_tue_3', 'alan_call_tue_4', 'ines_call_tue_4', 'alan_call_tue_5', 'ines_call_tue_5', 'alan_call_tue_6', 'ines_call_tue_6', 'alan_call_tue_7');
    S.sfx('dial_tone', 0.4); await S.T(600);
  };
  S.callWed = () => say('alan_call_wed_1', 'ines_call_wed_1', 'alan_call_wed_2', 'ines_call_wed_2');
  S.callThu = () => say('ines_call_thu_1', 'alan_call_thu_1', 'ines_call_thu_2', 'alan_call_thu_2', 'ines_call_thu_3', 'alan_call_thu_3', 'ines_call_thu_4');
  S.callFri = () => say('ines_call_fri_1', 'alan_call_fri_1', 'ines_call_fri_2', 'alan_call_fri_2', 'ines_call_fri_3');
  S.callSat = () => say('ines_call_sat_1', 'alan_call_sat_1', 'ines_call_sat_2', 'alan_call_sat_2', 'ines_call_sat_3', 'alan_call_sat_3', 'ines_call_sat_4');
  S.callDue = () => S.CALLS.find(c => !F()[c[0]] && c[1]());
  const PESSOA = ['ines_pessoa_1', 'ines_pessoa_2', 'ines_pessoa_3', 'ines_pessoa_4', 'ines_pessoa_5'];
  S.phoneBox = async function () {
    const f = F();
    if (f.ch >= 6) return say('alan_phone_no_time');
    if (!G.has('coins')) return say(G.has('note5000') ? 'alan_phone_note' : 'alan_phone_nocoins');
    f.coins--; if (f.coins <= 0) G.takeItem('coins'); else G.renderInv();
    S.sfx('payphone_coins', 0.7); await S.T(500); S.sfx('phone_dial', 0.5); await S.T(1400);
    const due = S.callDue();
    await S.posed('phone', async () => {
      const how = (due && due[3]) || {};
      if (!how.direct) await say('ines_hello');
      if (due) { f[due[0]] = true; await due[2](); }
      if (how.hangup) return;
      await G.dialog([
        { line: 'alan_ask_ines_now', run: () => say(S.hint()) },
        { line: 'alan_ask_ines_pessoa', once: true, run: () => say(PESSOA[(f.pessoa_n = ((f.pessoa_n || 0) + 1)) % PESSOA.length]) },
        { line: 'alan_ask_ines_thesis', once: true, when: () => f.ch >= 2 && !f.asked_thesis, run: () => { f.asked_thesis = true; return say('ines_thesis'); } },
        { line: 'alan_bye_ines', bye: true, run: () => say('ines_bye') },
      ]);
    });
    S.sfx('phone_hangup', 0.6);
  };

  // ---------------------------------------------------------------- hints (Inês, "What now?")
  S.hint = function () {
    const f = F(), has = G.has;
    switch (f.ch) {
      case 1:
        if (!has('blazer') && !f.reception_done) return f.gail_hint ? 'ines_hint_nieves' : 'ines_hint_jacket';
        if (!f.called_tue) return 'ines_hint_call_first';
        if (!f.reception_done) return 'ines_hint_reception';
        return 'ines_hint_hotel';
      case 2:
        if (!f.saw_helmet) return 'ines_hint_isleta';
        if (!f.fermin_letter) return f.clock_wound ? 'ines_hint_bell' : 'ines_hint_cathedral';
        if (!f.faxed_inscription || !f.faxed_letter) return 'ines_hint_fax';
        if (!f.saw_disc_list) return 'ines_hint_museum';
        return 'ines_hint_wed_done';
      case 3:
        if (!f.lore_carmen) return 'ines_hint_carmen_lore';
        if (!f.inquiry_read) return f.sent_to_colon ? 'ines_hint_colon' : 'ines_hint_carmen_lore';
        if (!f.caught) return f.derek_sent ? 'ines_hint_desk' : 'ines_hint_guard';
        return 'ines_hint_thu_done';
      case 4:
        if (!f.cave_explained) return 'ines_hint_carmen_fri';
        return 'ines_hint_fri_night';
      case 5:
        if (!f.fax_read) return 'ines_hint_fax_sat';
        if (!f.isleta_flood) return 'ines_hint_isleta_sat';
        return 'ines_hint_vasco';
      default: return 'ines_hint_general';
    }
  };

  // ---------------------------------------------------------------- Alan's notebook: what he knows, and what's next
  const PAPER = 'close:paper_aged';
  S.NOTES = [
    // [when, text]: everything Alan has written down, in story order
    [f => f.mist_seen, 'Tue. A black mist on the sea at Las Canteras, coming in <i>against</i> the wind. It smells of the cistern. It\'s back. (Told Inês. Not Vasco. Tomorrow.)'],
    [f => f.saw_helmet, 'Wed. Doña Pino\'s nets brought up a helmet from 1478. The sea is emptying its pockets.'],
    [f => f.saw_disc_list, 'Wed. Museum conservation list: obsidian discs removed from Cave 6, one a day. Disc 2 today.'],
    [f => f.fermin_letter, 'Wed. Santa Ana has a bell with our mark on it. 1751. The founders were here. A sealed letter "for the next founder who comes". (Faxed to Inês: 18th-century Portuguese, faded.)'],
    [f => f.pepe_known, 'Thu. Pepe Santana, fisherman, drowned in his bed in La Isleta. Dry floor. Wet bed.'],
    [f => f.pino_list, 'Thu. Doña Pino\'s list: the four survivors of the <i>Virgen del Pino</i>, 1971. "The sea is taking back its debts."'],
    [f => f.lore_carmen, 'Thu. Carmen: the Harimaguadas called the sea on the Castilians in 1483 and shut it out again at the cave. The grandmothers in Artenara say the cave "holds the sea down".'],
    [f => f.inquiry_read, 'Thu. Casa de Colón, the 1484 inquiry: the sea rose black against the wind, came every night for three months, went back at sunrise on Saint John\'s day. "Nadie preguntó a las mujeres."'],
    [f => f.called_thu, 'Thu. Inês: the foundry ledger. 1751, "to study the lock". 1755, "We did what we learned in the Canaries." And the Sea knows my blood.'],
    [f => f.saw_map, 'Thu. Baute\'s desk: a photograph of a bulldozed burial ground, 1966, and a map of the south coast resorts, circled. Montesdeoca\'s resorts. (It\'s Montesdeoca?)'],
    [f => f.cave_explained, 'Fri. Carmen: the beam crosses the cave; the triangles are arrows; the discs are mirrors. San Juan is when the sun turns back. "Go home before Sunday."'],
    [f => f.sketchbook_read, 'Sat. Rafa\'s sketchbook: the boy at the bar was Yeray. "The discs go down to the lower vault at night. Only Rayco has the key." Not Montesdeoca. Baute.'],
    [f => f.fax_read, 'Sat. The letter, decoded: the Sea strikes first at whoever understands the lock. It comes for everyone taken back from it. Whoever closes the lock stands in the water, and goes down with it.'],
    [f => f.isleta_flood, 'Sat. La Isleta flooded. Doña Pino woke with water at her lips. I wrote my name at the bottom of her list.'],
    [f => f.elena_heard, 'Sun. Elena\'s message: "It\'s a door, Carmen. And someone\'s opening it."'],
    [f => f.knows_vault, 'Sun. Vasco read the cave right. Baute has put him where he puts the discs.'],
  ];
  S.TODO = () => {
    const f = F(), h = S.hint && S.hint();
    return h && window.LINES[h] ? window.LINES[h][1].replace(/\[[^\]]*\]\s*/g, '') : '';
  };
  S.readNotebook = async function () {
    const f = F(), notes = S.NOTES.filter(n => n[0](f)).map(n => `<p>${n[1]}</p>`);
    const pages = [];
    for (let i = 0; i < notes.length; i += 5) pages.push({ img: PAPER, cls: 'doc-hand', html: `<h3>${i ? '&nbsp;' : 'Gran Canaria, June 1996'}</h3>` + notes.slice(i, i + 5).join('') });
    if (!pages.length) pages.push({ img: PAPER, cls: 'doc-hand', html: '<h3>Gran Canaria, June 1996</h3><p>Holiday. Sun. Vasco. Do not think about the sea.</p>' });
    const todo = f.as_vasco ? '' : S.TODO();
    if (todo) pages.push({ img: PAPER, cls: 'doc-hand', html: `<h3>What Inês would say</h3><p><i>${todo}</i></p>` });
    await G.closeup(pages);
  };

  // ---------------------------------------------------------------- the Sea's water and the black mist
  // S.water[room] = 0..1 of the screen's height; S.mist[room] = 0..1 strength. Drawn over the figures (animFg).
  S.water = {}; S.mistOn = {};
  S.drawWater = function (g, t, level, rgb) {
    if (!(level > 0)) return;
    const top = 720 - level * 720;
    g.save();
    const gr = g.createLinearGradient(0, top, 0, 720);
    gr.addColorStop(0, `rgba(${rgb || '30,52,58'},0.78)`); gr.addColorStop(1, 'rgba(6,14,18,0.95)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, 720);
    for (let x = 0; x <= 1280; x += 16) g.lineTo(x, top + Math.sin(x * 0.02 + t * 1.6) * 4 + Math.sin(x * 0.007 - t * 0.9) * 5);
    g.lineTo(1280, 720); g.closePath(); g.fill();
    g.restore();
  };
  S.drawMist = function (g, t, k) {
    if (!(k > 0)) return;
    g.save();
    for (let i = 0; i < 9; i++) {
      // low, black, and moving against the wind: right to left
      const x = 1400 - ((t * (14 + i * 3) + i * 230) % 1700), y = 560 + (i % 3) * 50;
      const r = 260 + (i % 4) * 60, gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(12,16,20,${0.42 * k})`); gr.addColorStop(1, 'rgba(12,16,20,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.restore();
  };
  // rises (or falls) to a level over ms
  S.waterTo = async function (room, to, ms) {
    const from = S.water[room] || 0, n = window.FAST ? 2 : Math.max(2, Math.round(ms / 50));
    for (let i = 1; i <= n; i++) { S.water[room] = from + (to - from) * i / n; await G.wait(window.FAST ? 5 : 50); }
  };

  // ---------------------------------------------------------------- placeholder rooms: the hotspots, drawn
  // A room whose painting is still a placeholder (window.PLACEHOLDER_ART.bg, from scripts/placeholders.py) shows each
  // hotspot as a labelled box, so the game can be played and walked through before anything is painted.
  S.placeholderBoxes = function (g, room) {
    g.save();
    g.font = "600 15px 'Alegreya Sans', sans-serif"; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const h of room.hotspots || []) {
      if (h.noBox || (h.when && !h.when()) || !h.rect) continue;
      const [x, y, w, hh] = h.rect, exit = !!h.exit;
      g.fillStyle = exit ? 'rgba(40,60,90,0.35)' : 'rgba(255,236,190,0.16)';
      g.strokeStyle = exit ? 'rgba(160,200,255,0.75)' : 'rgba(255,230,170,0.6)'; g.lineWidth = 2; g.setLineDash(exit ? [8, 6] : []);
      g.beginPath(); g.rect(x, y, w, hh); g.fill(); g.stroke();
      const name = typeof h.name === 'function' ? h.name() : h.name;
      const tw = g.measureText(name).width + 12;
      g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(x + w / 2 - tw / 2, y + hh / 2 - 11, tw, 22);
      g.fillStyle = exit ? '#cfe2ff' : '#fff0cc'; g.fillText((exit ? '⇢ ' : '') + name, x + w / 2, y + hh / 2);
    }
    g.restore();
  };
  // a placeholder figure's name, over their head (the figures carry no writing: it would mirror)
  S.placeholderNames = function (g) {
    g.save(); g.font = "700 15px 'Alegreya Sans', sans-serif"; g.textAlign = 'center'; g.textBaseline = 'bottom';
    for (const a of G.npcs || []) {
      if (!a.visible || !a.cur || !/_ph_/.test(a.cur) || !a.def) continue;
      const name = typeof a.def.name === 'function' ? a.def.name() : a.def.name; if (!name) continue;
      const top = a.y - a.height() - 8, tw = g.measureText(name).width + 10;
      g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(a.x - tw / 2, top - 19, tw, 20);
      g.fillStyle = '#fff4dc'; g.fillText(name, a.x, top);
    }
    g.restore();
  };
  // every placeholder room: a walkable floor along the bottom, figures scaled to it, hotspots met on the floor below them
  S.FLOOR = [[0, 575], [1280, 575], [1280, 716], [0, 716]];
  // (no depth parallax until a room has its painting and a depth map: scripts/depth_map.py in Game I, then parallax: true)
  S.room = (def) => Object.assign({ walk: S.FLOOR, scale: [575, 400, 716, 470], floor: 'stone', parallax: false,
    light: { ambient: 'rgb(235,228,215)', base: 0.95 }, entries: { default: [640, 660, 'e'] } }, def);
})();
