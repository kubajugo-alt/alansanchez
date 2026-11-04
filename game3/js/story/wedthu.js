// The Forgotten Rhythm — Wednesday 4 September (part 2, Alan) and Thursday 5 September (part 3, Alan and Inês).
// docs/BIBLE.md, Act I: W1 Ramón's taxi · W2 check-in · W3 the bishop and St Michael · W4 the bell · W5 the swap · W6 the
// tide chase; TH1 breakfast and the chart · TH2 decorative · TH3 two chairs · TH4 Inês and the 1586 note · TH5 the
// streets · TH6 the dominoes · TH7 the nod and the bench · TH8 the cloister fight · TH9 Tata's alley.
// Owns the permanent contents of the hostal, the cathedral (nave, stair, bell-chamber, cloister, archive), Calle Las
// Damas, Parque Colón, San Antón, Tata's alley, the blue house and El Conde.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const ch = () => F().ch || 0;
  const T = S.T;
  const R = id => ROOMS[id];
  const find = (rid, name) => (R(rid).hotspots || []).find(h => h.name === name);
  const setRect = (rid, name, rect, at) => { const h = find(rid, name); if (h) { h.rect = rect; if (at) h.at = at; } };
  const chain = (rid, key, fn) => { const r = R(rid), prev = r[key]; r[key] = function (g, t) { if (prev) prev.call(this, g, t); fn.call(this, g, t); }; };
  const refresh = () => G.refreshNpcs();
  const look = (...ids) => () => say(...ids);
  const close = img => G.closeup([{ img: 'close:' + img, html: '' }]);
  const N = (rid, n) => S.person(rid, n);
  const H = (rid, h) => S.spot(rid, h);
  const night = () => !!F().night;

  // a cutscene card held while fn runs (S.cut only plays lines; here dialogue choices happen on the card too)
  const cardEl = document.getElementById('cutcard');
  async function scene(title, desc, fn) {
    const E = window.Engine;
    E.cutscene++; document.getElementById('game').classList.add('cine');
    try {
      cardEl.querySelector('.t').textContent = title; cardEl.querySelector('.d').textContent = desc; cardEl.classList.add('on');
      await T(500); await fn();
    } finally { cardEl.classList.remove('on'); document.getElementById('game').classList.remove('cine'); E.cutscene--; }
  }

  // ---------------------------------------------------------------- items
  S.item('shoes', { name: 'My shoes (in my hand)', look: 'alan_look_shoes_item' });
  S.item('coin_1586', { name: 'A coin from 1586', look: async () => { await close('coin_1586'); await say('alan_look_coin'); } });
  S.item('archive_copies', { name: 'Copies from the archive', look: async () => G.closeup([{ img: 'close:paper_aged', cls: 'doc-hand', html:
    '<h3>Fábrica, 1586</h3><p>January. <i>Al campanero, por la cura de su brazo.</i></p><p>In the margin, pencil, under raking light:</p><p><i>[…?] ni se venda, ni se rompa, ni se funda, porque no es nuestra.</i></p><p><i>a la boca del río, donde mira la marca</i></p>' }]) });

  // ---------------------------------------------------------------- notebook entries and the deduction started here
  S.NOTE('offerings_noted', 'Wed. Under St Michael in the Primada: a glass of rum, a cigar, a red candle, old coins. The bishop: "Tobías. Again."');
  S.NOTE('frieze_sketch', 'Wed. The bell\'s frieze: twelve waves, seven ships. One ship right above the founders\' mark, its bow off-true. (Sketched.)');
  S.NOTE('mark_seen', 'Wed. Our mark on the bell\'s sea side, a crack beside it. She is cold, wet, salt. Tobías: "She sweats, señor."');
  S.NOTE('patch_wed', 'Wed. From the tower: a dark patch on the sea, two miles out, moving against the swell. Vasco saw it too.');
  S.NOTE('band_wed', 'Wed night. In the power cut, the sea ran up Calle Las Damas in a wet band, straight to the tower foot. Then it dried.');
  S.NOTE('coin_found', 'Wed night. In the last puddle at the tower foot: a silver coin, 1586, green with salt.');
  S.NOTE('tata_dead_known', 'Thu. Doña Tata (Altagracia Bran), the blue house in San Antón, drowned in her bed on 20 April, far from the sea. Salt and sand in her mouth. Every hurricane season she "went down to the sea, to pay". (Fello.)');
  S.NOTE('fellowife_monday', 'Thu. Fello\'s wife cleans offices in New York. She rings the colmado every Monday at six, "like a church".');
  S.NOTE('worn_phrase', 'Thu. Tobías: "Never sold. Never broken. Never melted. Because she isn\'t ours." Four hundred years of de la Cruz on the ropes.');
  S.NOTE('tobias_dries', 'Thu. Every night Tobías goes up and dries the bell. And feeds St Michael, for Tata, since April.');
  S.NOTE('note_1586', '1586 fabric accounts: the bell-ringer paid "for the curing of his arm". In the margin, pencil: "[…?] ni se venda, ni se rompa, ni se funda, porque no es nuestra." Never melted: the danger is the furnace?', 'ines');
  S.NOTE('mark_looks', 'A second, fainter line: "a la boca del río, donde mira la marca": at the river mouth, where the mark looks.', 'ines');
  S.NOTE('photo_turned', 'Thu night. Tata\'s photograph, turned face up: a small old woman laughing, holding a tray of dulce de coco in greaseproof squares.');
  S.NOTE('fight_done', 'Thu. The cloister. Inês found the phrase in a box, I found it in a man. "You\'re his assistant." Vasco loves us both.');
  S.NOTE('bearing_idea', 'Deduction: take a bearing from the bell\'s sea arch: line the ship\'s bow up with the mark, and read Vasco\'s compass.');
  S.DEDUCE('frieze_sketch', 'mark_looks', 'bearing_idea', { line: 'alan_ded_bearing' });

  // ---------------------------------------------------------------- the hub pins
  S.open('hostal', f => f.ch >= 2 && f.ch <= 8);
  S.open('cathedral', f => f.ch === 2 && f.checked_in && !f.tower_done);
  S.open('cathedral', f => f.ch === 3 && f.streets_open);
  S.open('parque', f => f.ch === 3 && f.streets_open);
  S.open('conde', f => f.ch === 3 && f.streets_open);
  S.open('santon', f => f.ch === 3 && f.streets_open);
  S.open('wall', f => f.ch === 3 && f.bench_due && !f.bench_done);
  S.pinNext(f => {
    if (f.ch === 2) return f.checked_in && !f.tower_done ? 'cathedral' : null;
    if (f.ch === 3) return !f.streets_open ? null : !f.dominoes_won ? 'santon' : f.bench_due && !f.bench_done ? 'wall' : !f.fight_done ? 'cathedral' : null;
    return null;
  });

  // ================================================================ the hostal: the permanent things
  // the painting: the door to room 4 under the gallery on the right, room 9 up on the gallery, the stairs to the roof on the
  // left, the kitchen through the arch at the left edge, the parrot's cage by the right wall
  setRect('hostal_courtyard', 'Room 4', [910, 315, 110, 165], [960, 650]);
  setRect('hostal_courtyard', 'Room 9', [700, 25, 110, 150], [760, 650]);
  setRect('hostal_courtyard', 'Up to the roof', [230, 190, 280, 250], [380, 650]);
  setRect('hostal_courtyard', 'The kitchen', [0, 170, 110, 330], [70, 660]);
  {
    const r = R('hostal_courtyard');
    r.entries.kitchen = [140, 660, 'e'];
    r.entries.room9 = [760, 660, 'w'];
    r.entries.room4 = [960, 660, 'w'];
  }
  H('hostal_courtyard', { name: 'The fountain', rect: [440, 420, 330, 200], at: [600, 680], look: () => say(ch() >= 3 ? 'alan_thu_look_fountain' : 'alan_wed_look_fountain') });
  H('hostal_courtyard', { name: 'The mango branch', rect: [0, 0, 330, 220], at: [300, 660], look: () => say(night() ? 'alan_look_mango_night' : 'alan_wed_look_mango') });
  H('hostal_courtyard', { name: 'The parrot', rect: [1170, 270, 100, 290], at: [1100, 660],
    look: () => say(night() ? 'alan_look_parrot_night' : 'alan_wed_look_parrot'), talk: () => say('alan_wed_talk_parrot', 'parrot_wed_talk') });
  H('hostal_courtyard', { name: 'The washing', rect: [950, 210, 320, 100], look: 'alan_wed_look_washing' });
  H('hostal_courtyard', { name: 'The bench', rect: [180, 380, 160, 110], look: 'alan_wed_look_bench' });
  H('hostal_courtyard', { name: 'The gallery', rect: [560, 160, 500, 80], look: 'alan_wed_look_balcony' });
  N('hostal_courtyard', { id: 'mireya', ch: 'mireya', x: 760, y: 655, dir: 'w', name: 'Señora Mireya', when: () => ch() === 2 && !F().checked_in,
    look: 'alan_look_mireya', talk: () => say('alan_wed_talk_mireya', 'mireya_wed_talk') });
  N('hostal_courtyard', { id: 'vasco', ch: 'vasco', x: 980, y: 662, dir: 'w', name: 'Vasco', when: () => ch() === 2 && !F().checked_in, look: 'vasco_wed_look' });
  N('hostal_courtyard', { id: 'ines', ch: 'ines', x: 1080, y: 668, dir: 'w', name: 'Inês', when: () => ch() === 2 && !F().checked_in && S.who() !== 'ines', look: 'ines_wed_look' });

  // room 4 and room 9
  H('hostal_room4', { name: 'The bed', rect: [560, 280, 520, 300], look: () => say(F().swap_done ? 'alan_wed_shoes_hand' : 'alan_wed_look_room4') });
  H('hostal_room4', { name: 'The balcony doors', rect: [260, 80, 240, 400], at: [400, 650], look: 'alan_wed_look_balcony4',
    use: () => F().ch === 2 && F().swap_done && !F().tide_done ? S.tideChase() : say('alan_wed_look_balcony4') });
  H('hostal_room9', { name: 'Your shoes', rect: [320, 560, 150, 90], at: [420, 660], when: () => night() && !S.has('shoes') && !F().swap_done,
    look: 'alan_wed_look_shoes', take: () => { S.give('shoes'); return say('alan_wed_take_shoes'); }, use: () => { S.give('shoes'); return say('alan_wed_take_shoes'); } });
  H('hostal_room9', { name: 'The bed', rect: [200, 240, 300, 260], look: 'alan_wed_look_bed9' });
  H('hostal_room9', { name: 'The window', rect: [530, 80, 250, 240], look: 'alan_wed_look_window9' });
  H('hostal_room9', { name: 'The washstand', rect: [840, 300, 160, 220], look: 'alan_wed_look_wash9' });
  H('hostal_room9', { name: 'The mirror', rect: [840, 80, 120, 180], look: 'alan_wed_look_mirror9' });
  H('hostal_room9', { name: 'The chair', rect: [980, 360, 200, 280], look: 'alan_wed_look_chair9' });

  // the kitchen: the chart and the radio are there every morning
  H('hostal_kitchen', { name: 'The hurricane chart', rect: [660, 70, 280, 150], at: [800, 660],
    look: () => say('alan_look_chart'), use: async () => { const d = ch(); if (S.BULLETIN[d] && !(F().chart_pins || {})[d]) { if (window.LINES['radio_' + d]) await G.say('radio_' + d); await S.chart(); } else await say('alan_chart_done'); } });
  H('hostal_kitchen', { name: 'The radio', rect: [800, 320, 200, 100], look: () => say(window.LINES['radio_' + ch()] ? 'radio_' + ch() : 'alan_look_radio') });
  H('hostal_kitchen', { name: 'The breakfast table', rect: [120, 400, 620, 300], look: 'alan_look_table' });
  H('hostal_kitchen', { name: 'The stove', rect: [280, 220, 180, 180], look: 'alan_look_stove' });
  H('hostal_kitchen', { name: 'The window', rect: [0, 40, 220, 200], look: 'alan_look_window_k' });
  N('hostal_kitchen', { id: 'mireya', ch: 'mireya', x: 520, y: 655, dir: 'e', name: 'Señora Mireya', when: () => ch() >= 2 && ch() <= 6 && !night(),
    look: 'alan_look_mireya', talk: () => say('alan_talk_mireya_kitchen', 'mireya_kitchen_talk') });

  // the roof: the patch, closer each night
  const PATCH = { 2: [1120, 228, 26, 4, 0.5], 3: [1080, 230, 40, 5, 0.6], 4: [1040, 234, 70, 7, 0.7], 5: [1000, 238, 110, 9, 0.8], 6: [960, 240, 150, 11, 0.85], 7: [900, 242, 220, 13, 0.9], 8: [760, 244, 420, 18, 0.95] };
  chain('hostal_roof', 'animBack', function (g, t) { const p = PATCH[ch()]; if (p) S.drawPatch(g, t, p[0], p[1], p[2], p[3], p[4]); });
  // and from the bell-chamber's sea arch
  const APATCH = { 2: [1060, 312, 22, 4, 0.6], 3: [1050, 314, 32, 5, 0.65], 4: [1040, 318, 50, 7, 0.75], 5: [1035, 322, 70, 9, 0.8], 6: [1030, 326, 90, 11, 0.85], 7: [1030, 330, 110, 13, 0.9], 8: [1040, 334, 130, 16, 0.95] };
  chain('bell_chamber', 'animBack', function (g, t) {
    const p = APATCH[ch()]; if (!p) return;
    g.save(); g.beginPath(); g.rect(920, 100, 240, 340); g.clip(); S.drawPatch(g, t, p[0], p[1], p[2], p[3], p[4]); g.restore();
  });

  // ================================================================ the cathedral
  setRect('cathedral_nave', 'The tower door', [1040, 160, 180, 320], [1120, 660]);
  setRect('cathedral_nave', 'To the cloister', [0, 200, 110, 380], [70, 660]);
  H('cathedral_nave', { name: 'St Michael', rect: [800, 140, 140, 280], at: [870, 660], look: 'alan_wed_look_stmichael' });
  H('cathedral_nave', { name: 'St Michael\'s offerings', rect: [780, 420, 220, 120], at: [880, 660],
    look: async () => {
      if (F().offerings_noted) return say('alan_look_offerings_2');
      await close('stmichael_offerings'); await say('alan_wed_look_offerings');
      if (G.npc('bishop')) await say('bishop_wed_again');
      F().offerings_noted = true; await say('alan_wed_note_offerings');
    } });
  H('cathedral_nave', { name: 'The high altar', rect: [280, 200, 140, 160], look: 'alan_wed_look_altar' });
  H('cathedral_nave', { name: 'The pews', rect: [0, 420, 580, 120], look: 'alan_wed_look_pews' });
  H('cathedral_nave', { name: 'The coral walls', rect: [470, 40, 300, 300], look: 'alan_wed_look_coral' });
  {
    const d = find('cathedral_nave', 'The tower door');
    d.look = 'alan_look_tower_door';
    d.locked = () => ch() === 2 && !F().welcomed; d.lockedLine = 'alan_wed_tower_wait';
  }
  N('cathedral_nave', { id: 'bishop', ch: 'bishop', x: 560, y: 650, dir: 'e', name: 'The bishop', when: () => ch() === 2 && !F().tower_up,
    look: 'alan_wed_look_bishop', talk: () => say('alan_wed_talk_bishop', 'bishop_wed_talk') });
  N('cathedral_nave', { id: 'vasco', ch: 'vasco', x: 720, y: 662, dir: 'w', name: 'Vasco', when: () => ch() === 2 && !F().tower_up, look: 'vasco_wed_look', talk: () => say('vasco_wed_talk') });
  N('cathedral_nave', { id: 'ines', ch: 'ines', x: 400, y: 668, dir: 'e', name: 'Inês', when: () => ch() === 2 && !F().tower_up, look: 'ines_wed_look' });
  S.onEnter('cathedral_nave', async () => {
    if (ch() !== 2 || F().welcomed) return;
    await say('narr_wed_cathedral', 'bishop_wed_hello', 'vasco_wed_intro', 'bishop_wed_rome', 'vasco_wed_rome', 'bishop_wed_kowalski', 'vasco_wed_kowalski',
      'bishop_wed_cardinal', 'vasco_wed_bell', 'bishop_wed_bell', 'bishop_wed_leave');
    F().welcomed = true;
  });

  // the tower stair
  setRect('tower_stair', 'Up the steps', [330, 140, 320, 380], [520, 660]);
  setRect('tower_stair', 'Back to the nave', [20, 80, 150, 420], [110, 660]);
  { const r = R('tower_stair'); r.entries.bells = [520, 660, 'w']; r.entries.nave = [200, 660, 'e']; }
  H('tower_stair', { name: 'The steps', rect: [660, 300, 120, 160], look: 'alan_wed_look_stair' });
  H('tower_stair', { name: 'The puddle', rect: [680, 560, 180, 60], at: [760, 670], look: 'alan_wed_look_puddle' });
  H('tower_stair', { name: 'The bell rope', rect: [700, 80, 50, 400], look: 'alan_wed_look_rope' });
  H('tower_stair', { name: 'The candle niche', rect: [1000, 200, 90, 120], look: 'alan_wed_look_niche' });
  H('tower_stair', { name: 'The slit window', rect: [830, 80, 80, 140], look: 'alan_wed_look_slit' });
  S.onEnter('tower_stair', async () => {
    if (ch() === 2 && F().welcomed && !F().tower_up) { F().tower_up = true; await say('narr_wed_stair', 'ines_wed_count', 'vasco_wed_counted', 'ines_wed_counted'); }
  });

  // the bell-chamber
  setRect('bell_chamber', 'Down the stair', [180, 100, 140, 400], [250, 660]);
  { const r = R('bell_chamber'); r.entries.stair = [300, 660, 'e']; }
  const bellLooked = () => F().frieze_sketch && F().mark_seen && F().crack_seen && F().bell_touched && F().patch_wed;
  async function towerCheck() { if (ch() === 2 && !F().tower_done && bellLooked()) await towerDone(); }
  H('bell_chamber', { name: 'The bell', rect: [480, 160, 320, 280], at: [640, 670],
    look: async () => {
      if (F().frieze_sketch) return say('alan_wed_look_bell_2');
      await say('alan_wed_look_bell'); await close('bell_frieze'); await say('alan_wed_frieze', 'alan_wed_sketch');
      F().frieze_sketch = true; S.sfx('pencil_scribble', 0.5); await towerCheck();
    },
    use: async () => {
      if (F().bell_touched) return say('alan_wed_touch_2');
      await say('alan_wed_touch'); S.pulse(1); F().bell_touched = true;
      await say('narr_wed_heart');
      if (G.npc('tobias')) await say('tobias_wed_sweats', 'narr_wed_tobias_looks');
      await towerCheck();
    } });
  H('bell_chamber', { name: 'The bell\'s sea side', rect: [700, 250, 110, 170], at: [820, 670],
    look: async () => { if (F().mark_seen) return say('alan_wed_look_seaside'); await say('alan_wed_look_seaside'); if (G.npc('vasco')) await say('vasco_wed_mark'); F().mark_seen = true; await towerCheck(); } });
  H('bell_chamber', { name: 'The crack', rect: [520, 360, 90, 80], at: [580, 670],
    look: async () => { await say('alan_wed_look_crack'); F().crack_seen = true; await towerCheck(); } });
  H('bell_chamber', { name: 'The sea arch', rect: [920, 100, 240, 340], at: [1040, 660],
    look: async () => {
      if (F().patch_wed || ch() !== 2) return say(ch() >= 3 ? 'alan_look_seaarch_2' : 'alan_wed_look_seaarch');
      await say('alan_wed_look_seaarch'); if (G.npc('vasco')) await say('alan_wed_patch_ask', 'vasco_wed_yes');
      F().patch_wed = true; await towerCheck();
    } });
  H('bell_chamber', { name: 'The city arch', rect: [20, 100, 140, 340], look: 'alan_wed_look_cityarch' });
  H('bell_chamber', { name: 'The beam', rect: [400, 40, 480, 110], look: 'alan_wed_look_beam' });
  N('bell_chamber', { id: 'tobias', ch: 'tobias', x: 1000, y: 652, dir: 'w', name: 'Tobías', when: () => ch() === 2 && !F().tower_done,
    look: 'alan_wed_look_tobias', talk: S.chat('tobias_wed_talked', ['alan_wed_talk_tobias', 'tobias_wed_talk'], 'tobias_wed_talk_2') });
  N('bell_chamber', { id: 'vasco', ch: 'vasco', x: 860, y: 668, dir: 'w', name: 'Vasco', when: () => (ch() === 2 && !F().tower_done) || (ch() === 3 && F().th2_on),
    look: 'vasco_wed_look', talk: () => say('vasco_wed_talk') });
  N('bell_chamber', { id: 'ines', ch: 'ines', x: 420, y: 672, dir: 'e', name: 'Inês', when: () => (ch() === 2 && !F().tower_done) || (ch() === 3 && F().th2_on),
    look: 'ines_wed_look', talk: () => say('ines_wed_talk') });
  S.onEnter('bell_chamber', async () => { if (ch() === 2 && !F().bells_seen) { F().bells_seen = true; await say('narr_wed_bells', 'tobias_wed_hello'); } });

  // the cloister and the archive
  setRect('cathedral_cloister', 'The archive', [70, 260, 130, 220], [140, 660]);
  H('cathedral_cloister', { name: 'The well', rect: [760, 320, 110, 150], at: [820, 670], look: 'alan_thu_look_well' });
  H('cathedral_cloister', { name: 'The arches', rect: [300, 80, 600, 220], look: 'alan_thu_look_cloister' });
  {
    const d = find('cathedral_cloister', 'The archive');
    d.look = 'alan_look_cloister_door';
    d.locked = () => S.who() !== 'ines'; d.lockedLine = () => ch() === 3 ? 'ulises_thu_no' : 'alan_fail_04';
  }
  H('cathedral_archive', { name: 'The mislabelled boxes', rect: [440, 400, 200, 110], at: [540, 670], when: () => S.who() === 'ines',
    look: 'ines_thu_look_boxes', use: () => S.pickBox() });
  H('cathedral_archive', { name: 'The watermark album', rect: [640, 430, 160, 90], at: [700, 670], when: () => S.who() === 'ines',
    look: async () => { await say('ines_thu_look_album', 'ines_thu_album_read'); F().album_read = true; }, use: async () => { await say('ines_thu_album_read'); F().album_read = true; } });
  H('cathedral_archive', { name: 'Padre Ulises\'s torch', rect: [560, 360, 80, 70], at: [600, 670], when: () => S.who() === 'ines',
    look: 'ines_thu_look_torch', use: () => S.rakingLight(), take: () => S.rakingLight() });
  H('cathedral_archive', { name: 'The card index', rect: [960, 280, 140, 200], look: () => say(S.who() === 'ines' ? 'ines_thu_look_cards' : 'alan_fail_look') });
  H('cathedral_archive', { name: 'The shelves', rect: [20, 40, 400, 520], look: () => say(S.who() === 'ines' ? 'ines_thu_look_shelves' : 'alan_fail_look') });
  H('cathedral_archive', { name: 'The window', rect: [870, 80, 80, 240], look: () => say(S.who() === 'ines' ? 'ines_thu_look_window_a' : 'alan_fail_look') });
  N('cathedral_archive', { id: 'ulises', ch: 'ulises', x: 860, y: 655, dir: 'w', name: 'Padre Ulises', when: () => ch() === 3 && !F().note_1586,
    look: 'ines_thu_look_ulises', talk: S.chat('ulises_talked', ['ines_thu_talk_ulises', 'ulises_thu_talk'], 'ulises_thu_talk_2') });
  N('cathedral_archive', { id: 'vasco', ch: 'vasco', x: 320, y: 662, dir: 'e', name: 'Vasco', when: () => ch() === 3 && S.who() === 'ines' && !F().note_1586,
    look: 'ines_thu_look_vasco', talk: () => say('ines_thu_talk_vasco', 'vasco_thu_talk_archive') });

  // ================================================================ the old city
  setRect('parque_colon', 'The cathedral', [700, 280, 200, 200], [800, 660]);
  H('parque_colon', { name: 'The ballplayers', rect: [140, 470, 220, 100], at: [300, 670], when: () => ch() >= 3 && ch() <= 7,
    look: async () => { const n = F().ball_n || 0; F().ball_n = n + 1; await say(n < 4 ? 'alan_thu_ball_' + (n + 1) : 'alan_thu_look_ballplayers'); } });
  H('parque_colon', { name: 'Columbus', rect: [480, 60, 140, 380], look: 'alan_look_statue' });
  H('parque_colon', { name: 'The cathedral\'s side', rect: [900, 0, 380, 300], look: 'alan_look_park_cathedral' });
  H('parque_colon', { name: 'The fountain', rect: [900, 440, 120, 80], look: 'alan_look_park_fountain' });
  H('parque_colon', { name: 'The café', rect: [220, 380, 200, 80], look: 'alan_look_cafe' });
  H('parque_colon', { name: 'The pigeons', rect: [560, 600, 400, 60], look: 'alan_look_pigeons' });

  H('el_conde', { name: 'Calle El Conde', rect: [500, 200, 300, 300], look: 'alan_look_conde_street' });
  H('el_conde', { name: 'The Puerta del Conde', rect: [640, 230, 120, 170], look: 'alan_look_conde_gate' });
  H('el_conde', { name: 'The sweet tray', rect: [20, 460, 200, 100], look: 'alan_look_sweets' });
  H('el_conde', { name: 'The fruit cart', rect: [910, 410, 120, 100], look: 'alan_look_cart' });
  H('el_conde', { name: 'The lamp post', rect: [1110, 40, 80, 560], look: 'alan_look_lamp' });
  N('el_conde', { id: 'yunior', ch: 'yunior', x: 820, y: 660, dir: 'w', name: 'Yunior', when: () => ch() === 3, look: 'alan_thu_look_yunior', talk: () => S.talkYunior() });

  // Calle Las Damas: the band, the tower foot
  H('calle_las_damas', { name: 'The wet band', rect: [520, 330, 260, 390], at: [640, 680], when: () => !!F().chase_on, look: 'alan_wed_look_band' });
  H('calle_las_damas', { name: 'The tower', rect: [640, 140, 100, 200], look: 'alan_wed_look_bell_tower' });
  H('calle_las_damas', { name: 'The doors', rect: [0, 380, 160, 200], look: 'alan_wed_look_doors_night' });
  chain('calle_las_damas', 'animBack', function (g, t) {
    if (!F().chase_on) return;
    const k = Math.max(0.15, 1 - (F().chase_step || 0) * 0.17);
    S.drawWetBand(g, t, [[640, 720], [655, 600], [672, 480], [684, 390], [690, 330]], 120 * k + 10, 0.42);
  });

  // San Antón
  H('san_anton', { name: 'The colmado', rect: [300, 180, 280, 300], look: 'alan_thu_look_shop' });
  H('san_anton', { name: 'The domino table', rect: [320, 480, 280, 140], at: [460, 670], look: 'alan_thu_look_table' });
  H('san_anton', { name: 'The mural', rect: [60, 180, 160, 200], look: 'alan_thu_look_mural' });
  H('san_anton', { name: 'The street', rect: [700, 250, 400, 220], look: 'alan_thu_look_street' });
  H('san_anton', { name: 'The church tower', rect: [740, 80, 90, 180], look: 'alan_thu_look_tower_far' });
  N('san_anton', { id: 'fello', ch: 'fello', x: 640, y: 655, dir: 'w', name: 'Fello', when: () => ch() === 3 && !night(), look: 'alan_thu_look_fello', talk: () => S.talkFello() });
  N('san_anton', { id: 'nando', ch: 'nando', x: 300, y: 662, dir: 'e', name: 'Nando', when: () => ch() === 3 && !night(), look: 'alan_thu_look_nando', talk: () => say('alan_thu_talk_nando', 'nando_thu_talk') });
  N('san_anton', { id: 'tobias', ch: 'tobias', x: 900, y: 660, dir: 'w', name: 'Tobías', when: () => ch() === 3 && F().dominoes_won && !F().bench_due && !F().tobias_away,
    look: 'alan_thu_look_tobias_bag', talk: () => S.talkTobiasBag() });

  // Tata's alley, the blue house
  setRect('tata_alley', 'The blue house', [540, 160, 220, 260], [650, 650]);
  H('tata_alley', { name: 'The blue house\'s shutter', rect: [620, 270, 120, 110], at: [690, 650], when: () => ch() === 3,
    look: async () => { await say(F().shutter_seen ? 'alan_thu_shutter_2' : 'alan_thu_shutter'); F().shutter_seen = true; } });
  H('tata_alley', { name: 'A window with a candle', rect: [20, 120, 160, 260], look: 'alan_thu_look_window_alley' });
  H('tata_alley', { name: 'A doorstep', rect: [900, 520, 140, 100], look: 'alan_thu_look_steps' });
  {
    const d = find('tata_alley', 'The blue house');
    d.look = 'alan_thu_look_bluehouse';
    d.locked = () => ch() === 3 && !F().shutter_seen; d.lockedLine = 'alan_thu_door_first';
  }
  N('tata_alley', { id: 'moncho', ch: 'moncho', x: 980, y: 650, dir: 'w', name: 'The young man on the step', when: () => ch() === 3 && night() && !F().photo_turned,
    look: 'alan_thu_look_moncho', talk: () => S.talkMoncho() });
  S.onEnter('tata_alley', async () => { if (ch() === 3 && night() && !F().alley_seen) { F().alley_seen = true; await say('narr_thu_alley'); } });
  H('blue_house', { name: 'The altar', rect: [480, 340, 260, 180], look: 'alan_thu_look_altar' });
  H('blue_house', { name: 'The white drawing', rect: [320, 520, 400, 100], at: [520, 680], look: 'alan_thu_look_sign' });
  H('blue_house', { name: 'Her bed', rect: [860, 300, 420, 340], at: [900, 670], look: 'alan_thu_look_bed' });
  H('blue_house', { name: 'Her chair', rect: [120, 360, 180, 240], look: 'alan_thu_look_chair' });
  H('blue_house', { name: 'The back window', rect: [760, 80, 200, 220], look: 'alan_thu_look_bh_window' });
  H('blue_house', { name: 'The shelf of jars', rect: [1100, 80, 140, 180], look: 'alan_thu_look_shelf' });
  H('blue_house', { name: 'The photograph', rect: [20, 180, 140, 100], at: [140, 670],
    look: async () => { if (F().photo_turned) { await close('tata_photo'); return say('alan_thu_look_photo_up'); } await close('photo_face_down'); await say('alan_thu_look_photo'); },
    use: () => S.turnPhoto(), take: () => S.turnPhoto() });
  S.onEnter('blue_house', async () => { if (ch() === 3 && !F().inside_seen) { F().inside_seen = true; await say('narr_thu_inside'); } });

  // ================================================================ WEDNESDAY
  S.START[2] = async function () {
    const f = F();
    S.becomeInes();   // W1: Inês's first Santo Domingo beat
    await G.goRoom('hostal_courtyard', null, { instant: true, noEnter: true, pos: [600, 680, 'e'] });
    await G.fade(true);
    await S.day(2);
    await scene('Las Américas airport', 'Arrivals in the heat: forty taxi drivers converge on Inês. One large elderly man stands by an old Caprice, not shouting.', async () => {
      await say('narr_wed_airport_1', 'narr_wed_airport_2', 'driver_wed_1', 'driver_wed_2', 'ines_wed_taxi_pick');
      for (;;) {
        const v = await S.choose('Forty drivers', 'Pick one.', [
          { label: 'The loudest one, waving keys', value: 'shout' }, { label: 'The one offering his cousin\'s car', value: 'cousin' },
          { label: 'The large elderly man by the Caprice, not shouting', value: 'ramon', correct: true }]);
        if (v === 'ramon') break;
        await say(v === 'shout' ? 'ines_wed_pick_shout' : 'ines_wed_pick_cousin', 'driver_wed_3');
      }
      await say('ines_wed_pick_ramon', 'ramon_wed_hello');
      for (const [n, l] of [[1, 'ines_wed_fend_1'], [2, 'ines_wed_fend_2'], [3, 'ines_wed_fend_3']]) {
        await S.choose('The other thirty-nine', 'One line each.', [{ label: window.LINES[l][1], value: n, correct: true }]);
        await say(l);
      }
    });
    S.becomeAlan();
    await scene('Ramón\'s Caprice', 'The coast road into the city: the sea on the right, election posters on every lamp post, El Faro a Colón across the river.', async () => {
      await say('narr_wed_bags', 'vasco_wed_sete', 'alan_wed_oito', 'ines_wed_here', 'narr_wed_ride_1', 'ramon_wed_what', 'vasco_wed_bells',
        'ramon_wed_wives', 'alan_wed_wives', 'ramon_wed_wives_2', 'narr_wed_posters', 'ramon_wed_politics', 'narr_wed_faro', 'ramon_wed_who', 'ines_wed_amigo');
      await G.dialog([
        { line: 'alan_wed_swallow_1', bye: true }, { line: 'alan_wed_swallow_2', bye: true }, { line: 'alan_wed_swallow_3', label: '(Say nothing. Look at the sea.)', silent: true, bye: true }]);
      await say('ramon_wed_amigo', 'vasco_wed_cough');
    });
    await G.goRoom('hostal_courtyard', null, { instant: true, noEnter: true, pos: [420, 670, 'e'] });
    G.refreshNpcs();
    await G.fade(false);
    // W2 check-in
    await say('narr_wed_hostal', 'parrot_wed_welcome', 'mireya_wed_hello', 'mireya_wed_rooms', 'mireya_wed_rules', 'mireya_wed_rules_2', 'parrot_wed_rules',
      'mireya_wed_parrot', 'vasco_wed_fine', 'ines_wed_deal_1', 'alan_wed_deal_1', 'ines_wed_deal_2', 'alan_wed_deal_2', 'ines_wed_deal_3');
    f.checked_in = true; G.refreshNpcs();
    G.autosave();
  };

  async function towerDone() {
    const f = F();
    f.tower_done = true;
    await G.fade(true);
    await say('narr_wed_down');
    // W5: 00:15, room nine
    f.night = true; f.bg_hostal_courtyard = 'hostal_courtyard__night';
    await G.goRoom('hostal_room9', null, { instant: true, pos: [700, 660, 'w'] });
    G.setClock('00:15');
    await G.fade(false);
    await say('narr_wed_night');
    G.autosave();
  }

  // W5 the swap: the courtyard's door to room four, at night, until the swap is done
  {
    const door4 = find('hostal_courtyard', 'Room 4');
    const prevWhen = door4.when;
    door4.when = () => !(ch() === 2 && night() && !F().swap_done) && (!prevWhen || prevWhen());
    H('hostal_courtyard', { name: 'Room 4 (Vasco)', rect: [910, 315, 110, 165], at: [960, 650], when: () => ch() === 2 && night() && !F().swap_done,
      look: 'alan_wed_look_room4', use: () => S.swap() });
    const door9 = find('hostal_courtyard', 'Room 9');
    door9.look = 'alan_wed_look_room9';
    door9.locked = () => ch() === 2 && !night(); door9.lockedLine = 'alan_wed_look_room9';
    find('hostal_courtyard', 'Room 4').look = 'alan_wed_look_room4';
    find('hostal_courtyard', 'Up to the roof').look = 'alan_wed_look_stairs';
    const room9out = find('hostal_room9', 'The courtyard');
    room9out.locked = () => ch() === 2 && night() && !F().swap_done && !S.has('shoes'); room9out.lockedLine = 'alan_wed_shoes_first';
  }
  S.swap = async function () {
    const f = F();
    await say('narr_wed_swap_start');
    const steps = [
      { title: 'The parrot turns its head towards the stairs', options: [
        { label: 'Along the wall, under the mango branch', value: 'branch' }, { label: 'Behind the fountain, on his blind side', value: 'ok', correct: true }, { label: 'Straight across the middle', value: 'open' }] },
      { title: 'He turns back towards the fountain', options: [
        { label: 'Freeze in the shadow of the gallery stairs', value: 'ok', correct: true }, { label: 'Make a run for the door', value: 'run' }, { label: 'Put the shoes down for a second', value: 'drop' }] },
      { title: 'The door of room four. The latch is old', options: [
        { label: 'Knock, softly', value: 'knock' }, { label: 'Lift the latch, slowly, all the way', value: 'ok', correct: true }, { label: 'Push the door with one shoulder', value: 'push' }] },
    ];
    for (const st of steps) {
      const v = await S.timedChoice({ title: st.title, text: 'Quick, quiet.', options: st.options, seconds: 6 });
      if (v !== 'ok') {
        await say('narr_wed_swap_fail', 'parrot_wed_alarm', 'narr_wed_mireya_light');
        await say(f.swap_fails ? 'mireya_wed_rescue_2' : 'ines_wed_rescue');
        if (!f.swap_fails) await say('mireya_wed_rescue');
        f.swap_fails = (f.swap_fails || 0) + 1;
        await G.goRoom('hostal_room9', 'courtyard', { pos: [700, 660, 'w'] });
        await say('alan_wed_retry');
        return;
      }
    }
    await say('narr_wed_swap_ok');
    f.swap_done = true;
    await G.goRoom('hostal_room4', null, { pos: [1000, 660, 'w'] });
    await S.cut('Room four', 'The ceiling fan barely moving the heat. Vasco reading in bed in nothing but his glasses; Alan arriving with his shoes in his hand and a wet mango leaf stuck to his shoulder. A kiss, the fan, and the dark.',
      'narr_wed_room4', 'vasco_wed_leaf', 'alan_wed_leaf', 'vasco_wed_standards', 'alan_wed_shoes_hand', 'vasco_wed_romantic', 'alan_wed_ask', 'vasco_wed_not_yet', 'narr_wed_fan');
    S.take('shoes');
    G.setClock(null);
    await say('narr_wed_powercut');
    G.autosave();
  };
  N('hostal_room4', { id: 'vasco', ch: 'vasco', x: 820, y: 640, dir: 'e', name: 'Vasco', when: () => ch() === 2 && F().swap_done && !F().tide_done,
    look: 'vasco_wed_look', talk: () => say('vasco_wed_balcony') });

  // W6 the tide chase
  S.tideChase = async function () {
    const f = F();
    await say('alan_wed_balcony', 'vasco_wed_balcony', 'alan_wed_go_down');
    f.chase_on = true; f.chase_step = 0;
    await G.goRoom('calle_las_damas', null, { pos: [640, 690, 'n'] });
    await say('narr_wed_street', 'alan_wed_look_band', 'alan_wed_chase_start');
    G.autosave();
    const steps = [
      ['The band narrows. Which stones are still wet?', ['The dark stones in the middle', 'The pale ones by the gutter', 'The doorstep on the left']],
      ['It bends towards the little square.', ['Cut across the square, along the dark patches', 'Stay on the street', 'Wait for it']],
      ['It breaks into puddles, shrinking from the edges.', ['Hop from puddle to puddle, the biggest first', 'Run straight up the middle', 'Go round by the wall']],
      ['The tower foot. One last shine.', ['The puddle in the corner by the tower', 'The step of the church door', 'The drain']],
    ];
    let ok = true;
    for (let i = 0; i < steps.length; i++) {
      const [q, opts] = steps[i];
      const v = await S.timedChoice({ title: q, text: 'Wet stones only, before it dries.', options: opts.map((l, k) => ({ label: l, value: k, correct: k === 0 })), seconds: 7 });
      f.chase_step = i + 1;
      if (v !== 0) { ok = false; break; }
    }
    f.chase_on = false;
    if (ok) {
      await say('narr_wed_tower_foot', 'alan_wed_coin');
      S.give('coin_1586'); f.coin_found = true;
      await say('narr_wed_cold');
    } else {
      await say('alan_wed_chase_wrong', 'narr_wed_chase_lost', 'alan_wed_chase_lost');
      f.coin_lost = true;
    }
    f.band_wed = true;
    await say('narr_wed_lights', 'alan_wed_lights');
    f.tide_done = true; f.wed_done = true;
    await G.fade(true);
    f.night = false; f.bg_hostal_courtyard = null;
    await S.next(3);
  };

  // ---------------------------------------------------------------- Wednesday's hints
  S.HINT(f => f.ch === 2 && f.checked_in && !f.welcomed, 'parrot_wed_h1', 'mireya_wed_h1');
  S.HINT(f => f.ch === 2 && f.welcomed && !f.offerings_noted, 'parrot_wed_h2', 'mireya_wed_h2');
  S.HINT(f => f.ch === 2 && f.welcomed && !f.tower_up, 'parrot_wed_h3', 'mireya_wed_h3');
  S.HINT(f => f.ch === 2 && f.tower_up && !f.tower_done, 'parrot_wed_h4', 'mireya_wed_h4');
  S.HINT(f => f.ch === 2 && f.night && !f.swap_done, 'parrot_wed_h5', 'mireya_wed_h5');
  S.HINT(f => f.ch === 2 && f.swap_done && !f.chase_on && !f.tide_done, 'parrot_wed_h6', 'mireya_wed_h6');
  S.HINT(f => f.ch === 2 && f.chase_on, 'parrot_wed_h7', 'mireya_wed_h7');

  // ================================================================ THURSDAY
  N('hostal_kitchen', { id: 'vasco', ch: 'vasco', x: 760, y: 662, dir: 'w', name: 'Vasco', when: () => ch() === 3 && !F().th1_done, look: 'vasco_wed_look' });
  N('hostal_kitchen', { id: 'ines', ch: 'ines', x: 960, y: 668, dir: 'w', name: 'Inês', when: () => ch() === 3 && !F().th1_done, look: 'ines_wed_look' });
  S.START[3] = async function () {
    const f = F();
    S.becomeAlan();
    await G.goRoom('hostal_kitchen', null, { instant: true, noEnter: true, pos: [300, 670, 'e'] });
    await S.day(3);
    await G.fade(false);
    // TH1 the breakfast inspection: one thing to fix
    await say('narr_thu_breakfast', 'alan_thu_shirt');
    const v = await S.choose('Before Señora Mireya looks up', 'One thing. Quickly.', [
      { label: 'Rebutton the shirt', value: 'alan_thu_fix_buttons', correct: true }, { label: 'Tuck it in', value: 'alan_thu_fix_tuck' }, { label: 'Roll up the sleeves', value: 'alan_thu_fix_sleeves' }]);
    await say(v, 'mireya_thu_caught', 'mireya_thu_eat', 'vasco_thu_shirt', 'ines_thu_shirt');
    // the first pin
    await say('radio_thu_bulletin', 'mireya_thu_chart');
    await S.chart();
    f.th1_done = true; G.refreshNpcs();
    // TH2 the tower, decorative
    await G.fade(true);
    f.th2_on = true;
    await G.goRoom('bell_chamber', null, { instant: true, noEnter: true, pos: [640, 690, 'e'] });
    await G.fade(false);
    await say('narr_thu_tower', 'vasco_thu_tape', 'ines_thu_light', 'vasco_thu_casting', 'ines_thu_casting', 'vasco_thu_holds', 'alan_thu_decorative', 'narr_thu_decorative');
    f.th2_on = false;
    // TH3 two chairs
    await G.fade(true);
    f.th3_on = true;
    await G.goRoom('cathedral_cloister', null, { instant: true, noEnter: true, pos: [420, 670, 'w'] });
    G.refreshNpcs();
    await G.fade(false);
    await say('narr_thu_archive', 'ulises_thu_dos', 'vasco_thu_dos', 'ulises_thu_chairs', 'alan_thu_chair', 'ulises_thu_no', 'alan_thu_streets');
    f.th3_on = false;
    // TH4: switch to Inês
    await S.switchTo('ines', 'cathedral_archive', 'cloister');
    await say('ulises_thu_boxes');
    G.autosave();
  };
  N('cathedral_cloister', { id: 'ulises', ch: 'ulises', x: 200, y: 660, dir: 'e', name: 'Padre Ulises', when: () => ch() === 3 && F().th3_on, look: 'ines_thu_look_ulises' });
  N('cathedral_cloister', { id: 'vasco', ch: 'vasco', x: 520, y: 666, dir: 'w', name: 'Vasco', when: () => ch() === 3 && (F().th3_on || F().fight_on), look: 'vasco_wed_look' });
  N('cathedral_cloister', { id: 'ines', ch: 'ines', x: 640, y: 670, dir: 'w', name: 'Inês', when: () => ch() === 3 && (F().th3_on || F().fight_on) && S.who() !== 'ines', look: 'ines_wed_look' });

  // TH4 the boxes and the raking light
  S.pickBox = async function () {
    const f = F();
    if (f.box_found) return say('ines_thu_box_right');
    if (!f.album_read) return say('ines_thu_no_album');
    for (;;) {
      const v = await S.choose('Three boxes, one label', 'Hold a sheet from each to the window. Which watermark is the 1580s?', [
        { label: 'A hand holding a flower', value: 'hand' }, { label: 'A pilgrim with a staff', value: 'pilgrim', correct: true }, { label: 'A snake on a cross', value: 'snake' }]);
      if (v === 'pilgrim') break;
      await say('ines_thu_box_wrong');
    }
    f.box_found = true;
    await say('ines_thu_box_right', 'ines_thu_find_entry', 'ines_thu_margin');
  };
  S.rakingLight = async function () {
    const f = F();
    if (f.note_1586) return say('ines_thu_look_torch');
    if (!f.box_found) return say('ines_thu_look_torch');
    for (;;) {
      const v = await S.choose('Padre Ulises\'s torch', 'The blank margin beside the 1586 payment.', [
        { label: 'Hold it straight above the page', value: 'top' }, { label: 'Hold it low, across the page', value: 'low', correct: true }]);
      if (v === 'low') break;
      await say('ines_thu_torch_top');
    }
    await say('ines_thu_torch_low', 'ines_thu_read_hand');
    for (;;) {
      const v = await S.choose('The pencil indentations', 'A later hand, the long s. How does it read?', [
        { label: '…ni se venda, ni se rompa, ni se funda, porque no es nuestra', value: 'ok', correct: true },
        { label: '…ni fe venda, ni fe rompa, ni fe funda, porque no es nueftra', value: 'f' }]);
      if (v === 'ok') break;
      await say('ines_thu_wrong_reading');
    }
    await say('ines_thu_reading', 'ines_thu_gutter');
    f.note_1586 = true; S.give('archive_copies');
    await S.choose('The torch', 'Turn it further, almost flat to the page?', [{ label: 'Turn it further', value: 1, correct: true }]);
    await say('ines_thu_torch_more', 'ines_thu_second', 'ines_thu_melting');
    f.mark_looks = true;
    G.setClock('17:20');
    await say('ulises_thu_coffee', 'ines_thu_coffee');
    G.setClock(null);
    G.refreshNpcs();
    // TH5: back to Alan on the streets
    f.streets_open = true;
    await S.switchTo('alan', 'parque_colon', 'default', [500, 670, 'e']);
    await say('narr_thu_streets');
    G.autosave();
  };

  // TH5 Yunior
  S.talkYunior = async function () {
    const f = F();
    if (f.yunior_met) return say('yunior_thu_again');
    f.yunior_met = true;
    await say('yunior_thu_hello', 'alan_thu_yunior_how', 'yunior_thu_how', 'yunior_thu_alone');
    await G.dialog([
      { line: 'alan_thu_yunior_flirt', once: true, run: () => say('yunior_thu_flirt') },
      { line: 'alan_thu_yunior_ask', once: true, run: () => say('yunior_thu_santon') },
      { line: 'alan_thu_yunior_no', bye: true, run: () => say('yunior_thu_no') },
    ]);
  };

  // TH6 Fello and the dominoes
  S.onEnter('san_anton', async () => { if (ch() === 3 && !night() && !F().santon_seen) { F().santon_seen = true; await say('narr_thu_santon'); } });
  S.talkFello = async function () {
    const f = F();
    if (!f.fello_met) {
      f.fello_met = true;
      await say('fello_thu_hello');
      await G.dialog([
        { line: 'alan_thu_fello_beer', bye: true, run: () => say('fello_thu_beer') },
        { line: 'alan_thu_fello_bell_early', bye: true, run: async () => { f.fello_shut = true; await say('narr_thu_table_shuts', 'fello_thu_shut'); } },
      ]);
      await say('domino_thu_strange', 'nando_thu_shush', 'player2_thu_siesta', 'fello_thu_fourth', 'alan_thu_sit', 'fello_thu_rules');
      await S.dominoes();
      return;
    }
    if (!f.dominoes_won) { await say('fello_thu_rules'); return S.dominoes(); }
    if (f.tobias_away && !f.tobias_back) {   // one more domino exchange, and Tobías comes back
      f.tobias_back = true; f.tobias_away = false;
      await say('domino_thu_strange', 'narr_thu_tobias_back'); G.refreshNpcs(); return;
    }
    await G.dialog([
      { line: 'alan_thu_ask_bell', once: true, when: () => !f.tata_dead_known, run: async () => {
        await say('fello_thu_bell', 'alan_thu_april', 'fello_thu_tata_1', 'fello_thu_tata_2', 'fello_thu_tata_3'); f.tata_dead_known = true;
        await say('alan_thu_tata_who', 'fello_thu_tata_family');
      } },
      { line: 'alan_thu_fello_shore', once: true, when: () => f.tata_dead_known, run: () => say('fello_thu_shore_no') },
      { line: 'alan_thu_fello_bye', bye: true, run: async () => {
        await say('fello_thu_bye');
        if (f.tata_dead_known && !f.tobias_seen) { f.tobias_seen = true; G.refreshNpcs(); await say('narr_thu_tobias_bag', 'narr_thu_tobias_sees'); }
      } },
    ]);
  };
  // the endgame (game3/art/designs/placeholders/dominoes_th6.json): ends 3 and 5; Fello holds only 3|5; Nando holds no 3 or 5
  // and passed on them before; only the double five keeps both ends for Fello's capicúa
  S.dominoes = async function () {
    const f = F();
    for (;;) {
      const v = await S.choose('Fello\'s capicúa', `<img src="art/closeups/dominoes_th6.png" style="max-width:62vw;max-height:42vh;display:block;margin:0 auto .6em"><span style="font-size:.9em">The open ends are 3 and 5. Fello has one tile left. Nando, who plays next, passed on threes and fives last round. Which of yours do you lay?</span>`, [
        { label: 'The double five (5|5)', value: '55', correct: true }, { label: 'The five-six (5|6)', value: '56' }, { label: 'The two-three (2|3)', value: '23' }]);
      if (v === '55') break;
      await say('fello_thu_wrong', 'nando_thu_again');
    }
    await say('narr_thu_capicua', 'fello_thu_capicua', 'domino_thu_impressed', 'nando_thu_grunt', 'narr_thu_overheard', 'domino_thu_monday', 'fello_thu_monday');
    f.dominoes_won = true; f.fellowife_monday = true; f.fello_shut = false;
    G.autosave();
  };

  // TH7 Tobías's paper bag: the nod
  S.talkTobiasBag = async function () {
    const f = F();
    await G.dialog([
      { line: 'alan_thu_tobias_ask', bye: true, run: async () => { await say('tobias_thu_leaves', 'alan_thu_tobias_gone'); f.tobias_away = true; G.refreshNpcs(); } },
      { line: 'alan_thu_tobias_joke', bye: true, run: async () => { await say('tobias_thu_leaves', 'alan_thu_tobias_gone'); f.tobias_away = true; G.refreshNpcs(); } },
      { line: 'alan_thu_tobias_nod', label: '(Say nothing. Nod, once.)', silent: true, bye: true, when: () => !!f.offerings_noted, run: async () => {
        await say('tobias_thu_come'); f.bench_due = true; G.refreshNpcs();
        await G.goRoom('city_wall', null, { pos: [520, 670, 'e'] });
      } },
    ]);
  };
  // the river bench (on the wall over the Ozama)
  H('city_wall', { name: 'The bench', rect: [480, 520, 320, 120], at: [520, 670], when: () => ch() === 3, look: 'alan_thu_look_bench' });
  H('city_wall', { name: 'The river', rect: [700, 200, 580, 300], when: () => ch() === 3, look: 'alan_thu_look_river' });
  N('city_wall', { id: 'tobias', ch: 'tobias', x: 720, y: 650, dir: 'w', name: 'Tobías', when: () => ch() === 3 && F().bench_due && !F().bench_done, look: 'alan_wed_look_tobias', talk: () => S.bench() });
  S.onEnter('city_wall', async () => { if (ch() === 3 && F().bench_due && !F().bench_done) await S.bench(); });
  S.bench = async function () {
    const f = F();
    if (f.bench_done || f.bench_running) return;
    f.bench_running = true;
    if (f.coin_lost && !S.has('coin_1586')) { await say('tobias_thu_coin_found'); S.give('coin_1586'); f.coin_found = true; f.coin_lost = false; }
    await say('narr_thu_05', 'tobias_thu_01', 'alan_thu_09', 'tobias_thu_02', 'tobias_thu_03', 'alan_thu_10', 'tobias_thu_04', 'alan_thu_11', 'tobias_thu_05');
    f.worn_phrase = true;
    await G.dialog([
      { line: 'alan_thu_ask_michael', once: true, run: () => say('tobias_thu_michael') },
      { line: 'alan_thu_ask_canons', once: true, run: () => say('tobias_thu_canons') },
      { line: 'alan_thu_ask_cloth', once: true, run: async () => { await say('tobias_thu_cloth'); f.tobias_dries = true; } },
      { line: 'alan_thu_ask_coin', once: true, when: () => S.has('coin_1586'), run: async () => { await say('tobias_thu_coin'); f.coin_memory = true; } },
      { line: 'alan_thu_12', bye: true, run: () => say('tobias_thu_06') },
    ]);
    if (!f.tobias_dries) { await say('alan_thu_ask_cloth', 'tobias_thu_cloth'); f.tobias_dries = true; }
    await say('alan_thu_ask_grandson', 'tobias_thu_07', 'narr_thu_tobias_goes');
    f.bench_done = true; f.bench_running = false; G.refreshNpcs();
    await say('alan_thu_bench_after');
    G.autosave();
  };

  // TH8 the cloister fight
  S.onEnter('cathedral_cloister', async () => { if (ch() === 3 && F().bench_done && !F().fight_done && S.who() === 'alan') await S.fight(); });
  S.fight = async function () {
    const f = F();
    G.setClock('15:30');
    await say('narr_thu_cloister_wait');
    f.fight_on = true; G.refreshNpcs(); G.setClock('16:30');
    await say('narr_thu_they_come', 'ines_thu_found', 'alan_thu_finish', 'narr_thu_silence', 'ines_thu_how', 'alan_thu_how', 'vasco_thu_two', 'ines_thu_box', 'alan_thu_man');
    let tone = 0;
    await G.dialog([{ line: 'alan_thu_tone_hurt', bye: true, run: () => { tone += 0; } }, { line: 'alan_thu_tone_sharp', bye: true, run: () => { tone += 1; } }]);
    await say('ines_thu_assistant');
    await G.dialog([{ line: 'alan_thu_tone2_hurt', bye: true }, { line: 'alan_thu_tone2_sharp', bye: true, run: () => { tone += 1; } }]);
    f.fight_tone = tone === 0 ? 'hurt' : tone === 2 ? 'sharp' : 'mixed';
    await say('ines_thu_witch', 'vasco_thu_both', 'ines_thu_leaves');
    f.fight_on = false; G.refreshNpcs();
    await say('vasco_thu_after', 'alan_thu_after');
    f.fight_done = true; G.setClock(null);
    // TH9: night, the power gone, San Antón by candlelight
    await G.fade(true);
    await S.cut('San Antón by candlelight', 'A power cut over the whole barrio: every doorway lit by candles like a little chapel. Alan walks up the hill alone.', 'narr_thu_night');
    f.night = true;
    await G.goRoom('tata_alley', 'colmado', { instant: true });
    await G.fade(false);
    G.autosave();
  };

  // TH9 Moncho, the photograph
  S.talkMoncho = async function () {
    const f = F();
    if (!f.moncho_met) { f.moncho_met = true; await say('moncho_thu_what'); }
    await G.dialog([
      { line: 'alan_thu_moncho_1', once: true, run: () => say('moncho_thu_told') },
      { line: 'alan_thu_moncho_2', bye: true, run: () => say('moncho_thu_bell') },
    ]);
  };
  S.turnPhoto = async function () {
    const f = F();
    if (f.photo_turned) return say('alan_thu_look_photo_up');
    await close('photo_face_down');
    await say('alan_thu_turn_photo');
    await close('tata_photo');
    await say('narr_thu_photo', 'alan_thu_photo_after');
    f.photo_turned = true;
    await G.goRoom('tata_alley', 'house');
    await say('narr_thu_bolt');
    await G.fade(true);
    f.bg_hostal_courtyard = 'hostal_courtyard__night';
    await G.goRoom('hostal_courtyard', 'street', { instant: true, noEnter: true });
    G.setClock('00:20');
    await G.fade(false);
    await say('narr_thu_midnight', 'mireya_thu_nightdress', 'alan_thu_sorry', 'mireya_thu_sorry');
    G.setClock(null);
    f.thu_done = true;
    await G.fade(true);
    f.night = false; f.bg_hostal_courtyard = null;
    await S.next(4);
  };
  N('hostal_courtyard', { id: 'mireya_night', ch: 'mireya', x: 300, y: 660, dir: 'e', name: 'Señora Mireya', speaker: 'mireya', when: () => ch() === 3 && F().photo_turned && !F().thu_done, look: 'alan_look_mireya' });

  // ---------------------------------------------------------------- Thursday's hints
  S.HINT(f => f.ch === 3 && S.who() === 'ines' && !f.box_found, 'parrot_thu_h1', 'mireya_thu_h1');
  S.HINT(f => f.ch === 3 && S.who() === 'ines' && f.box_found && !f.note_1586, 'parrot_thu_h2', 'mireya_thu_h2');
  S.HINT(f => f.ch === 3 && f.streets_open && !f.fello_met, 'parrot_thu_h3', 'mireya_thu_h3');
  S.HINT(f => f.ch === 3 && f.fello_met && !f.dominoes_won, 'parrot_thu_h3', 'mireya_thu_h3b');
  S.HINT(f => f.ch === 3 && f.dominoes_won && !f.tata_dead_known, 'parrot_thu_h6', 'mireya_thu_h3b');
  S.HINT(f => f.ch === 3 && f.tata_dead_known && !f.bench_due, 'parrot_thu_h4', 'mireya_thu_h4');
  S.HINT(f => f.ch === 3 && f.bench_due && !f.bench_done, 'parrot_thu_h4', 'mireya_thu_h4');
  S.HINT(f => f.ch === 3 && f.bench_done && !f.fight_done, 'parrot_thu_h5', 'mireya_thu_h5');
  S.HINT(f => f.ch === 3 && f.fight_done && !f.photo_turned, 'parrot_thu_h6', 'mireya_thu_h6');

  // ================================================================ previews and the test walk
  S.PREVIEW.start2 = { flags: { ch: 1, lis_done: true }, items: ['crest_paper', 'welcome_fax', 'index_cards'], room: 'hostal_courtyard', pos: [600, 680, 'e'], run: () => S.START[2]() };
  S.PREVIEW.start3 = { flags: { ch: 2, wed_done: true, checked_in: true, welcomed: true, tower_done: true, offerings_noted: true, frieze_sketch: true, mark_seen: true,
    crack_seen: true, bell_touched: true, patch_wed: true, swap_done: true, tide_done: true, band_wed: true, coin_found: true, pulse: 1 },
    items: ['crest_paper', 'welcome_fax', 'index_cards', 'coin_1586'], room: 'hostal_kitchen', pos: [300, 670, 'e'], run: () => S.START[3]() };

  // (a cold ?scene=startN start leaves a moment of quiet before START runs: wait for the part to be under way)
  const waitFor = c => new Promise(res => { const iv = setInterval(() => { if (c(F())) { clearInterval(iv); res(); } }, 30); });
  S.SOLVE[2] = async function () {
    await waitFor(f => f.checked_in); await S.quiet();
    await S.go('cathedral_nave');
    await S.act('St Michael\'s offerings', 'look');
    S.expect('the offerings noted', f => f.offerings_noted);
    await S.act('The tower door');
    await S.act('Up the steps');
    await S.act('The bell', 'look');
    await S.act('The bell', 'use');
    await S.act('The bell\'s sea side', 'look');
    await S.act('The crack', 'look');
    await S.act('The sea arch', 'look');
    S.expect('the night in room nine', f => f.night && G.room.id === 'hostal_room9');
    await S.act('Your shoes', 'take');
    await S.act('The courtyard');
    S.failNext = true;   // the parrot wakes once: the comic failure, then the retry
    await S.act('Room 4 (Vasco)', 'use');
    S.expect('back in room nine after the parrot', f => f.swap_fails === 1);
    await S.act('The courtyard');
    await S.act('Room 4 (Vasco)', 'use');
    S.expect('the swap done', f => f.swap_done);
    await S.act('The balcony doors', 'use');
    await S.quiet();
    S.expect('Thursday started', f => f.ch === 3 && f.coin_found);
  };
  S.SOLVE[3] = async function () {
    await waitFor(f => f.ch === 3 && S.who() === 'ines' && G.room && G.room.id === 'cathedral_archive'); await S.quiet();
    S.expect('Inês in the archive', () => S.who() === 'ines' && G.room.id === 'cathedral_archive');
    await S.act('The watermark album', 'look');
    await S.act('The mislabelled boxes', 'use');
    await S.act('Padre Ulises\'s torch', 'use');
    S.expect('the note and the second line', f => f.note_1586 && f.mark_looks && S.who() === 'alan');
    await S.act('The ballplayers', 'look');
    await S.tryDeduce('frieze_sketch', 'mark_looks');
    S.expect('the bearing idea', f => f.bearing_idea);
    await S.go('el_conde');
    await S.act('yunior', 'talk', null, ['San Antón', 'Married']);
    await S.go('san_anton');
    await S.act('fello', 'talk', null, ['Presidente']);
    S.expect('the dominoes won', f => f.dominoes_won);
    await S.act('fello', 'talk', null, ['cathedral bell', 'Thank you']);
    S.expect('Tata known, Tobías in the shop', f => f.tata_dead_known && f.tobias_seen);
    await S.act('tobias', 'talk', null, ['Nod, once']);
    S.expect('the bench done', f => f.bench_done && f.worn_phrase);
    await S.go('cathedral_nave');
    await S.act('To the cloister');
    S.expect('the fight done', f => f.fight_done && G.room.id === 'tata_alley');
    await S.act('The blue house\'s shutter', 'look');
    await S.act('moncho', 'talk');
    await S.act('The blue house');
    await S.act('The photograph', 'use');
    await S.quiet();
    S.expect('Friday started', f => f.ch === 4 && f.photo_turned && f.thu_done);
  };
})();
