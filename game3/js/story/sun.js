// The Forgotten Rhythm — Sunday 8 September, "The Debt" (docs/BIBLE.md, Sunday 8: U1–U7). Part 6.
// 07:00 the breakfast inspection (S.choose: three fixes, Mireya catches the fourth); the chart pin; U1 Tata's notebook with
// Inês (pages 1, 2, 5, 7, 8 and the 1979 names; Tata's spelling decoded); U2 the napkin and Señora Mireya (the salves page
// left on her table); U3 the bishop's study (the photograph: photo_seen; Alan blurts Hortense and Tata; unwelcome); U4 the
// wall (the friendship scene; the napkin torn: SHORE to Alan, BELL to Inês); U5 the gallera (two bottles, the first measure
// for Tata, Lilo reads 1934 and the 1979 margin (ML4 layer 1), the drum test and its Sea grip (a death and a rewind),
// rules 7 and 8, the rhythm unlocked, lilo_in); U6 Inês: the Paris dossier through the fax; U7 sunset: Tobías in the tower
// (ML3: the prediction, the rum, a death and a rewind; the fallback without it), the sighting at the arch (ML1 layer 3,
// bearing_taken); the night at the hostal. Ends with S.next(7).
//
// Flags set here: sun_breakfast, notebook_read, names_1979, rule4_seen, rule7, napkin, mireya_in, photo_seen, study_done,
// unwelcome, wall_done, napkin_torn, sun_ride, poured_tata, lilo_drank, wilfredo_known, caballo, rule8, rhythm_on, lilo_in,
// dossier_sent (+ item dossier), tobias_up, tobias_saved, tower_done, bearing_taken, their_shore, prediction_made, sun_done.
// Tata's notebook pages that later parts open: page_1967 (Lalo, Mon), fello_margin (Fello, Mon), recipe_read (Moncho,
// Mon), hidden_page (the stuck page, Tue).
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const T = S.T;
  const sun = () => F().ch === 6;
  const f = () => F();
  const rum = () => F().rum || 0;
  const rumTake = n => { const v = Math.max(0, rum() - n); F().rum = v; if (!v && G.has('rum')) G.takeItem('rum'); else G.renderInv(); };
  const rumAdd = n => { F().rum = rum() + n; if (!G.has('rum')) S.give('rum'); else G.renderInv(); };
  // a person shown only when no other part already has the same figure standing there (two Mireyas in one kitchen)
  const solo = (rid, chId, myId) => {
    const r = ROOMS[rid];
    return !(r.npcs || []).some(n => n.id !== myId && (n.ch || n.id) === chId && (() => { try { return !n.when || n.when(); } catch (e) { return false; } })());
  };
  const P = (rid, n) => { const when = n.when; n.when = () => when() && solo(rid, n.ch, n.id); return S.person(rid, n); };

  // ---------------------------------------------------------------- items
  // (earlier days' things this day's preview carries: named here only if their own part hasn't)
  for (const [id, name] of [['lilo_address', 'Papá Lilo\'s address'], ['crest_paper', 'Patriarchate crest paper'], ['welcome_fax', 'The bishop\'s welcome fax'],
    ['archive_copies', 'Copies from the archive'], ['index_cards', 'Inês\'s index cards'], ['wax_seal', 'The purple wax seal'], ['tata_notebook', 'Tata\'s notebook']])
    if (!S.ITEMS[id]) S.item(id, { name, look: 'alan_fail_04' });
  S.item('rum', { name: () => rum() === 1 ? 'A bottle of Barceló Imperial' : `Barceló Imperial (${rum()} bottles)`, look: () => say(sun() ? 'alan_sun_u7_rum' : 'alan_fail_04') });
  S.item('napkin', { name: () => F().napkin_torn ? (S.who() === 'ines' ? 'The napkin (BELL)' : 'The napkin (SHORE)') : 'The napkin', read: () => S.readNapkin(), look: () => S.readNapkin() });
  S.item('dossier', { name: 'The Paris dossier (six pages)', look: 'ines_sun_u6_02' });
  S.item('compass', Object.assign({ name: 'Vasco\'s compass and protractor' }, S.ITEMS.compass && S.ITEMS.compass.look ? {} : { look: 'alan_sun_compass' }));
  const prevTataLook = S.ITEMS.tata_notebook && S.ITEMS.tata_notebook.look;
  S.item('tata_notebook', { name: 'Tata\'s notebook', look: () => (F().ch >= 6 && F().notebook_read) ? S.readTata() : prevTataLook ? (typeof prevTataLook === 'function' ? prevTataLook() : say(prevTataLook)) : S.readTata() });

  // ---------------------------------------------------------------- Tata's notebook: the pages (written text stays Spanish, with English under it)
  const PAPER = 'close:paper_aged';
  const pg = (h, body) => ({ img: PAPER, cls: 'doc-hand', html: `<h3>${h}</h3>${body}` });
  const en = s => `<p style="font-size:.8em;opacity:.75"><i>${s}</i></p>`;
  const stuck = what => `<p style="opacity:.55"><i>[${what}]</i></p>`;
  S.readTata = function () {
    const x = F();
    return G.closeup([
      pg('Inside cover', `<p style="opacity:.45">Catalina Bran</p>${en('A faint line, older than the rest, in another hand.')}`
        + (x.wilfredo_known ? `<p>1934. Lilo me pidió. Le dije que no. El mar primero.</p>${en('1934. Lilo asked me. I said no. The sea first.')}` : stuck('Inside the back cover: a pencil note dated 1934, stuck with salt')) ),
      pg('1936', `<p>Primer año. Éramos treinta y uno.</p>${en('First year. We were thirty-one.')}`),
      pg('1940 · 1945', `<p>1940: veintiséis. 1945: diecinueve. Los guardias vinieron otra vez.</p>${en('1940: twenty-six. 1945: nineteen. The guards came again.')}`),
      pg('1967', x.page_1967 ? `<p>Lalo no vino. Su papá. Pobre muchacho.</p>${en('Lalo didn\'t come. His father. Poor boy.')}` : stuck('Water-stuck. Someone who was there in 1967 might read it')),
      pg('1979', `<p>Los guardias pasaron casa por casa. Fuimos siete: Tata, Lilo el biejo, Fello el chikito, Nando, Chago, Doña Lú, Pupo. No alcanzó. David. Fue mi culpa.</p>${en('The guards went house to house. We were seven. It didn\'t reach. David. It was my fault.')}`
        + (x.wilfredo_known ? `<p style="color:#5a3a1a">[margin] Wilfredo dio los nombres.</p>${en('Wilfredo gave the names.')}` : stuck('A margin note, silver with age, too faint to read'))
        + (x.fello_margin ? `<p style="color:#5a3a1a">[beside Fello] lloró toda la noche</p>${en('he cried all night')}` : '')),
      pg('1995', `<p>Cuatro. Yolan, Lilo el biejo, Tovías, yo.</p>${en('Four. Yolande, old Lilo, Tobías, me.')}`),
      pg('A recipe', x.recipe_read ? `<p>Dulce de coco. <u><u>Moncho</u></u>. Coco, azúcar, canela, un poco de leche. Que no se queme.</p>${en('Coconut sweet. Moncho. Don\'t let it burn.')}` : stuck('A recipe, a name underlined twice. The rest is a smear of guava jam and pencil')),
      pg('The salves', `<p>Este primero. Este cuando entra. Este para traerla de vuelta.</p>${en('This one first. This one when it comes in. This one to bring her back.')}<p style="font-size:.85em">(six salves, in Tata's hand, with her notes)</p>`),
      pg('19 April 1996', `<p>Que nadie toque la campana… El mar sólo monta a los de la sangre de Catalina. O a los de la sangre de la campana. Que Moncho—</p>${en('Nobody touch the bell… The sea rides only those of Catalina\'s blood. Or of the bell\'s blood. That Moncho—')}`
        + (x.hidden_page ? '' : stuck('The facing page is stuck fast to the cover'))),
    ]);
  };

  // ---------------------------------------------------------------- notebook entries and deductions
  const hasNote = fl => S.NOTES.some(n => n[0] === fl);
  const note = (fl, text, who) => { if (!hasNote(fl)) S.NOTE(fl, text, who); };
  note('pins_marked', 'Fri. Batista\'s five drownings, marked on the tourist map.');
  note('overlay_made', 'Fri. Every drowning within a street of a wet band. Every band ends at the tower.');
  note('rule5', 'Fri. The Sea strikes first at whoever understands the lock.');
  note('tobias_dries', 'Fri. Tobías dries the bell every night.');
  note('names_1979', 'Sun. Tata\'s 1979 page: seven on the shore. Tata, Lilo, Little Fello, Nando, Chago, Doña Luz, Pupo. "It didn\'t reach."');
  note('rule4_seen', 'Sun. Tata, 19 April: the sea rides only those of Catalina\'s blood, or of the bell\'s blood. (The bell\'s blood. Me.)');
  note('wilfredo_known', 'Sun. Lilo read the margin: "Wilfredo gave the names." Nando\'s nephew. Carmela\'s family went to New York.');
  note('rule8', 'Sun. Lilo: somebody of Tata\'s blood has to sing it home. Moncho. And not seven: as many as we can find.');
  note('caballo', 'Sun. "You\'re the horse, blanquito." The drum went cold and salt under my hand.');
  note('prediction_made', 'Sun. Tobías next.');
  note('their_shore', 'Sun. They were all on her shore: every one who drowned is on one of Tata\'s lists.');
  note('bearing_taken', 'Sun. From the sea-side arch, the bow over the mark: 112°.');
  note('dossier_sent', 'Sun. Paris has the dossier: six pages, the inscription first.', 'ines');
  if (!S.DEDUCTIONS.some(d => d.result === 'prediction_made')) S.DEDUCE('overlay_made', 'tobias_dries', 'prediction_made', { line: 'alan_sun_ded_pred' });
  S.DEDUCE('pins_marked', 'names_1979', 'their_shore', { line: 'alan_sun_ded_shore', run: async () => { F().prediction_made = true; } });

  // ---------------------------------------------------------------- the napkin (U2): its columns, and Sunday's candidates
  S.NAPKIN.bell.push(['napkin', 'Paris: the dossier'], ['dossier_sent', '— sent (Sun)'], ['napkin', 'Peralta'], ['napkin', 'Rome'], ['napkin', 'The foundry'], ['napkin', 'The tower']);
  const CAND = [['cand_lilo', 'lilo_in', 'salves', 'Papá Lilo (?)'], ['cand_fello', 'fello_in', 'salves', 'Little Fello (?)'], ['cand_nando', 'nando_in', 'salves', 'Nando (?)'],
    ['cand_tobias', 'tobias_in', 'salves', 'Tobías (?)'], ['cand_mireya', 'mireya_in', 'salves', 'Señora Mireya (?)'], ['cand_moncho', 'moncho_in', 'salves', 'Moncho: must sing (?)'],
    ['cand_yolande', 'yolande_in', 'kreyol', 'Manman Yolande (?)']];
  CAND.forEach(c => S.NAPKIN[c[2]].push([c[0], c[3]]));
  S.NAPKIN.salves.push(['mireya_in', 'Señora Mireya'], ['lilo_in', 'Papá Lilo (the drum)']);
  const napBase = S.napkinPage;
  S.napkinPage = () => { const x = F(); for (const c of CAND) if (x[c[1]]) x[c[0]] = false; return napBase(); };

  // ---------------------------------------------------------------- the hub
  S.open('hostal', x => x.ch === 6);
  S.open('palace', x => x.ch === 6 && x.mireya_in && !x.study_done);
  S.open('gallera', x => x.ch === 6 && x.wall_done && !x.lilo_in);
  S.open('santon', x => x.ch === 6 && x.tobias_up && !x.tower_done && (x.rum || 0) < 1);
  S.open('cathedral', x => x.ch === 6 && x.tobias_up && !x.tower_done);
  S.pinNext(x => {
    if (x.ch !== 6) return null;
    if (!x.mireya_in) return 'hostal';
    if (!x.study_done) return 'palace';
    if (!x.lilo_in) return 'gallera';
    if (x.tobias_up && !x.tower_done) return x.prediction_made && (x.rum || 0) < 1 ? 'santon' : 'cathedral';
    return 'hostal';
  });

  // ---------------------------------------------------------------- hints (the parrot; from Monday Tobías's keys)
  S.HINT(x => x.ch === 6 && !x.notebook_read, 'parrot_sun_h_bk', 'mireya_sun_h_bk');
  S.HINT(x => x.ch === 6 && !x.mireya_in, 'parrot_sun_h_mireya', 'mireya_sun_h_mireya');
  S.HINT(x => x.ch === 6 && !x.study_done && !x.sun_in_study, 'parrot_sun_h_mass', 'mireya_sun_h_mass');
  S.HINT(x => x.ch === 6 && !x.study_done, 'parrot_sun_h_study', 'mireya_sun_h_study');
  S.HINT(x => x.ch === 6 && !x.lilo_drank, 'parrot_sun_h_gallera', 'mireya_sun_h_gallera');
  S.HINT(x => x.ch === 6 && !x.wilfredo_known, 'parrot_sun_h_lilo', 'mireya_sun_h_lilo');
  S.HINT(x => x.ch === 6 && !x.lilo_in, 'parrot_sun_h_drum', 'mireya_sun_h_drum');
  S.HINT(x => x.ch === 6 && !x.dossier_sent, 'parrot_sun_h_fax', 'mireya_sun_h_fax');
  S.HINT(x => x.ch === 6 && x.tobias_up && !x.prediction_made && !x.tower_done, 'parrot_sun_h_pred', 'mireya_sun_h_pred');
  S.HINT(x => x.ch === 6 && x.tobias_up && !x.tower_done, 'parrot_sun_h_tower', 'mireya_sun_h_tower');
  S.HINT(x => x.ch === 6 && x.tobias_saved && !x.bearing_taken && !x.sun_done, 'parrot_sun_h_sight', 'mireya_sun_h_sight');

  // ================================================================ START: 07:00, the breakfast inspection
  async function breakfast() {
    const x = F();
    const list = [
      { k: 'hair', label: 'Towel your wet hair', fix: ['alan_sun_bk_hair'], caught: 'mireya_sun_bk_hair' },
      { k: 'shirt', label: 'Give Vasco back his shirt', fix: ['alan_sun_bk_shirt', 'vasco_sun_bk_shirt'], caught: 'mireya_sun_bk_shirt' },
      { k: 'key', label: 'Hang the room 4 key back on its hook', fix: ['alan_sun_bk_key'], caught: 'mireya_sun_bk_key' },
      { k: 'bed', label: 'Send Inês up to sleep in room 9', fix: ['ines_sun_bk_bed'], caught: 'mireya_sun_bk_bed' },
    ];
    if (x.dario_night) list.push({ k: 'bite', label: 'Hide the love bite (turn up your collar)', fix: ['alan_sun_bk_bite', 'vasco_sun_bk_bite'], caught: 'mireya_sun_bk_bite' });
    let left = list.slice();
    for (let i = 0; i < 3; i++) {
      const k = await S.choose('07:00 · Before Mireya looks up', `Three things to fix: ${3 - i} left.`, left.map((o, j) => ({ label: o.label, value: o.k, correct: j === 0 })));
      const it = left.find(o => o.k === k); left = left.filter(o => o !== it);
      await say(...it.fix);
    }
    await say(left[left.length - 1].caught, 'narr_sun_bk_mangu', 'mireya_sun_bk_end');
    x.sun_breakfast = true;
  }
  S.START[6] = async function () {
    const x = F();
    S.becomeAlan();
    for (const k of ['bg_hostal_courtyard', 'bg_hostal_kitchen', 'bg_bell_chamber']) delete x[k];
    await G.goRoom('hostal_kitchen', null, { instant: true, noEnter: true, pos: [520, 680, 'e'] });
    await S.day(6);
    await G.fade(false);
    S.pulse(Math.max(x.pulse || 0, 3));
    await say('narr_sun_bk_01', 'alan_sun_bk_02');
    await breakfast();
    if (!G.has('compass')) { await say('vasco_sun_compass', 'alan_sun_compass'); S.give('compass'); }
    await say('radio_sun_01');
    G.autosave();
  };

  // ================================================================ the kitchen: Inês and the notebook (U1), the napkin (U2)
  P('hostal_kitchen', { id: 'mireya_k6', ch: 'mireya', speaker: 'mireya', x: 320, y: 640, dir: 'e', name: 'Señora Mireya',
    when: () => sun() && !F().sun_night && (!F().study_done || (F().wall_done && !F().dossier_sent)),
    look: () => say('mireya_sun_bk_end'), talk: () => say(F().napkin && !F().mireya_in ? 'mireya_sun_h_mireya' : 'mireya_sun_bk_end') });
  P('hostal_kitchen', { id: 'ines_k6', ch: 'ines', speaker: 'ines', x: 720, y: 665, dir: 'w', name: 'Inês',
    when: () => sun() && !F().study_done && S.who() === 'alan', look: 'alan_sun_look_ines_bk', talk: () => S.u1() });
  P('hostal_kitchen', { id: 'vasco_k6', ch: 'vasco', speaker: 'vasco', x: 960, y: 662, dir: 'w', name: 'Vasco',
    when: () => sun() && !F().notebook_read, look: () => say('vasco_sun_bk_shirt'), talk: () => say('vasco_sun_bk_shirt') });
  S.spot('hostal_kitchen', { name: 'The kitchen table', rect: [150, 430, 560, 160], at: [440, 670], when: sun,
    look: () => say(F().mireya_in ? 'alan_sun_look_table_2' : 'alan_sun_look_table'),
    items: { tata_notebook: () => S.u2leave(), any: 'alan_fail_02' } });
  if (!ROOMS.hostal_kitchen.hotspots.some(h => typeof h.name === 'string' && /chart/i.test(h.name)))
    S.spot('hostal_kitchen', { name: 'The hurricane chart', rect: [650, 70, 280, 160], at: [790, 660], when: sun, look: () => S.chart(), use: () => S.chart() });
  S.u1 = async function () {
    const x = F();
    if (x.notebook_read) return say(x.mireya_in ? 'ines_sun_u2_tick' : 'ines_sun_u2_hint');
    await say('narr_sun_u1_01', 'ines_sun_u1_02', 'ines_sun_u1_03', 'ines_sun_u1_04', 'alan_sun_u1_05', 'ines_sun_u1_06');
    await S.readTata();
    await say('ines_sun_u1_dec');
    const decode = async (q, ok, opts, flag) => {
      for (;;) {
        await say(q);
        const v = await S.choose('Tata\'s spelling', 'Say it out loud, the way she would.', opts);
        if (v === true) { await say(ok); x[flag] = true; return; }
        await say('ines_sun_u1_wrong');
      }
    };
    await decode('ines_sun_u1_yolan', 'alan_sun_u1_yolan_ok', [{ label: 'Manman Yolande, at the market', value: true, correct: true }, { label: 'Yolanda, the hairdresser\'s niece', value: false }, { label: 'A misspelt Yolo', value: false }], 'cand_yolande');
    await decode('ines_sun_u1_lilo', 'alan_sun_u1_lilo_ok', [{ label: 'Papá Lilo, the old drummer (viejo)', value: true, correct: true }, { label: 'Lalo, at the bar', value: false }, { label: 'A street called Lilo Bierjo', value: false }], 'cand_lilo');
    await decode('ines_sun_u1_fello', 'alan_sun_u1_fello_ok', [{ label: 'Little Fello: Fello of the colmado (chiquito)', value: true, correct: true }, { label: 'A fellow called Chikito', value: false }, { label: 'Fello\'s father', value: false }], 'cand_fello');
    await decode('ines_sun_u1_tobias', 'alan_sun_u1_tobias_ok', [{ label: 'Tobías, the sacristan', value: true, correct: true }, { label: 'Tobías the tailor', value: false }, { label: 'Tovar, the canon', value: false }], 'cand_tobias');
    x.cand_nando = true;
    await say('ines_sun_u1_07', 'ines_sun_u1_08', 'alan_sun_u1_09', 'ines_sun_u1_10', 'alan_sun_u1_11', 'ines_sun_u1_12');
    Object.assign(x, { notebook_read: true, names_1979: true, rule4_seen: true, rule7: true, cand_moncho: true });
    // U2: the napkin
    await say('narr_sun_u2_01', 'ines_sun_u2_02', 'ines_sun_u2_03', 'alan_sun_u2_04', 'ines_sun_u2_05');
    x.napkin = true; if (!G.has('napkin')) S.give('napkin');
    await say('mireya_sun_u2_06', 'ines_sun_u2_07');
    x.cand_mireya = true;
    await say('ines_sun_u2_hint');
  };
  S.u2leave = async function () {
    const x = F();
    if (!x.napkin) return say('alan_sun_look_table');
    if (x.mireya_in) return say('alan_sun_look_table_2');
    await say('alan_sun_u2_leave', 'narr_sun_u2_leave', 'mireya_sun_u2_yes', 'ines_sun_u2_tick');
    x.mireya_in = true;
  };

  // ================================================================ U3: the bishop's study
  P('bishop_study', { id: 'bishop_sun', ch: 'bishop', speaker: 'bishop', x: 780, y: 650, dir: 'w', name: 'Monseñor Liriano',
    when: () => sun() && !F().study_done, look: 'alan_sun_u3_look_bishop', talk: () => S.u3() });
  P('bishop_study', { id: 'vasco_st6', ch: 'vasco', speaker: 'vasco', x: 560, y: 664, dir: 'e', name: 'Vasco', when: () => sun() && !F().study_done,
    look: () => say('vasco_sun_u3_03'), talk: () => say('vasco_sun_u3_quiet') });
  P('bishop_study', { id: 'ines_st6', ch: 'ines', speaker: 'ines', x: 440, y: 668, dir: 'e', name: 'Inês', when: () => sun() && !F().study_done,
    look: 'alan_sun_look_ines_bk', talk: () => say('ines_sun_u2_05') });
  P('bishop_study', { id: 'moncho_st6', ch: 'moncho', speaker: 'moncho', x: 1150, y: 650, dir: 'w', name: 'Moncho', when: () => sun() && !F().study_done,
    look: 'alan_sun_u3_look_moncho', talk: () => say('moncho_sun_u3_10') });
  S.spot('bishop_study', { name: 'A portrait', rect: [310, 50, 140, 200], at: [380, 660], when: sun, look: 'alan_sun_u3_look_portrait' });
  S.spot('bishop_study', { name: 'A small photograph', rect: [528, 165, 64, 90], at: [560, 660], when: sun,
    look: async () => { F().photo_seen = true; await G.closeup([{ img: 'close:grandmother_photo', html: '' }]); await say('alan_sun_u3_look_photo', 'narr_sun_u3_photo'); } });
  S.spot('bishop_study', { name: 'The bishop\'s desk', rect: [250, 300, 460, 170], at: [480, 660], when: sun, look: 'alan_sun_u3_look_desk' });
  S.spot('bishop_study', { name: 'Shelves of canon law', rect: [20, 40, 220, 400], at: [160, 660], when: sun, look: 'alan_sun_u3_look_books' });
  S.spot('bishop_study', { name: 'The shutters', rect: [840, 30, 200, 330], at: [940, 660], when: sun, look: 'alan_sun_u3_look_window' });
  S.onEnter('bishop_study', async () => { if (sun() && !F().sun_in_study) { F().sun_in_study = true; await say('narr_sun_u3_01', 'bishop_sun_u3_02'); } });
  S.u3 = async function () {
    const x = F();
    await say('vasco_sun_u3_03', 'vasco_sun_u3_04', 'bishop_sun_u3_05', 'bishop_sun_u3_06', 'bishop_sun_u3_07');
    let quiet = false;
    await G.dialog([
      { label: '[Say nothing. Be decorative.]', silent: true, once: true, when: () => !quiet, run: async () => { quiet = true; await say('vasco_sun_u3_quiet', 'bishop_sun_u3_quiet'); } },
      { line: 'alan_sun_u3_opt_drown', run: () => blurt(), bye: true },
      { line: 'alan_sun_u3_opt_tata', run: () => blurt(), bye: true },
    ]);
  };
  async function blurt() {
    const x = F();
    await say('narr_sun_u3_blurt', 'alan_sun_u3_b1', 'alan_sun_u3_b2', 'narr_sun_u3_flat', 'bishop_sun_u3_09', 'moncho_sun_u3_10', 'bishop_sun_u3_11', 'bishop_sun_u3_12', 'moncho_sun_u3_13');
    x.study_done = true; x.unwelcome = true;
    await G.goRoom('city_wall', null, { pos: [480, 668, 'e'], noEnter: true });
    await u4();
  }

  // ================================================================ U4: the city wall
  P('city_wall', { id: 'ines_w6', ch: 'ines', speaker: 'ines', x: 760, y: 664, dir: 'w', name: 'Inês', when: () => sun() && F().study_done && !F().wall_done,
    look: 'alan_sun_look_ines_bk', talk: () => say('ines_sun_u4_02') });
  async function u4() {
    const x = F();
    G.refreshNpcs();
    await say('narr_sun_u4_01', 'ines_sun_u4_02', 'ines_sun_u4_03', 'ines_sun_u4_04');
    const lines = ['alan_sun_u4_opt_one', 'alan_sun_u4_opt_jealous', 'alan_sun_u4_opt_notice'], answers = ['ines_sun_u4_r1', 'ines_sun_u4_r2', 'ines_sun_u4_r3'];
    const said = new Set();
    for (let i = 0; i < 3; i++) {
      await G.dialog(lines.filter(l => !said.has(l)).map(l => ({ line: l, bye: true, run: async () => { said.add(l); await say(answers[i]); } })));
    }
    if (x.photo_seen) await say('alan_sun_u4_photo', 'ines_sun_u4_photo');
    await say('alan_sun_u4_06', 'ines_sun_u4_07', 'ines_sun_u4_08', 'alan_sun_u4_09');
    x.napkin_torn = true; x.wall_done = true; if (!G.has('napkin')) S.give('napkin'); G.renderInv();
    await say('narr_sun_u4_10');
    G.refreshNpcs();
  }

  // ================================================================ U5: the gallera
  P('gallera', { id: 'lilo_sun', ch: 'lilo', speaker: 'lilo', x: 210, y: 642, dir: 'e', name: 'Papá Lilo', when: sun,
    look: 'alan_sun_u5_look_lilo', talk: () => S.u5talk(),
    items: { rum: () => S.u5rum(), tata_notebook: () => S.u5read(), any: 'alan_fail_07' } });
  S.spot('gallera', { name: 'The cockpit', rect: [620, 280, 90, 170], at: [660, 660], when: sun, look: 'alan_sun_u5_look_pit', use: 'alan_sun_u5_look_pit' });
  S.spot('gallera', { name: 'The red earth', rect: [300, 600, 520, 110], at: [520, 680], when: sun, look: 'alan_sun_u5_look_ground',
    items: { rum: () => S.u5pour() } });
  S.spot('gallera', { name: 'The mango tree', rect: [0, 0, 240, 440], at: [150, 670], when: sun, look: 'alan_sun_u5_look_tree' });
  S.spot('gallera', { name: 'A dog\'s bowl', rect: [64, 500, 56, 44], at: [140, 670], when: sun, look: 'alan_sun_u5_look_bowl' });
  S.onEnter('gallera', async () => {
    const x = F();
    if (!sun() || x.sun_ride) return;
    x.sun_ride = true;
    await S.cut('The guagua to Villa Consuelo', 'A crowded bus in the afternoon heat. Alan by the window, his head against the glass; the city going past; a retired fighting rooster called Balaguer asleep on his knee.',
      'narr_sun_u5_ride', 'passenger_sun_u5_ride', 'narr_sun_u5_ride2');
    await say('narr_sun_u5_01');
  });
  S.u5talk = async function () {
    const x = F();
    if (x.lilo_in) return say('lilo_sun_u5_again');
    if (!x.lilo_met) { x.lilo_met = true; await say('lilo_sun_u5_02', 'alan_sun_u5_03', 'lilo_sun_u5_04'); }
    if (!x.lilo_drank) return say(rum() < 2 ? 'lilo_sun_u5_norum' : x.poured_tata ? 'lilo_sun_u5_pour' : 'lilo_sun_u5_bottle');
    if (!x.wilfredo_known) return say('lilo_sun_u5_notebook_ask');
    await drumTest();
  };
  S.u5pour = async function () {
    const x = F();
    if (x.poured_tata) return say('alan_sun_u5_pour_again');
    if (rum() < 2) return say('lilo_sun_u5_norum');
    await say('alan_sun_u5_pour', 'narr_sun_u5_pour', 'lilo_sun_u5_pour');
    x.poured_tata = true;
  };
  S.u5rum = async function () {
    const x = F();
    if (x.lilo_drank) return say('alan_sun_u5_pour_again');
    if (rum() < 2) return say('lilo_sun_u5_norum');
    if (!x.poured_tata) { await say('lilo_sun_u5_bottle', 'alan_sun_u5_bottle_hint'); return; }
    rumTake(2);
    x.lilo_drank = true;
    await say('narr_sun_u5_drink', 'lilo_sun_u5_05', 'alan_sun_u5_06', 'lilo_sun_u5_07', 'lilo_sun_u5_notebook_ask');
  };
  S.u5read = async function () {
    const x = F();
    if (!x.lilo_drank) return say(rum() < 2 ? 'lilo_sun_u5_norum' : 'lilo_sun_u5_bottle');
    if (x.wilfredo_known) return say('lilo_sun_u5_again');
    await say('narr_sun_u5_read', 'lilo_sun_u5_1934', 'lilo_sun_u5_1979', 'lilo_sun_u5_1979b', 'lilo_sun_u5_1979c', 'lilo_sun_u5_carmela');
    x.wilfredo_known = true;
    await drumTest();
  };
  async function drumTest() {
    const x = F();
    // the Sea grip on the drum: keep the hand on after "Quieto… ya, ya" and the Sea takes him (then a rewind)
    if (!x.caballo) {
      G.autosave();
      S.pulse(4);
      for (;;) {
        await say('lilo_sun_u5_hand', 'narr_sun_u5_grip', 'lilo_sun_u5_quieto');
        const v = await S.timedChoice({ title: 'Quieto… ya, ya', text: 'The skin is cold under your hand. Wet. Salt.', seconds: 5,
          options: [{ label: 'Keep your hand on the drum. Listen.', value: false }, { label: 'Take your hand away. Now.', value: true, correct: true }] });
        if (v) break;
        await say('alan_sun_u5_drown');
        await S.drown('The skin went cold, then wet, then salt, and Alan kept his hand on it.');
      }
      await say('narr_sun_u5_grip_ok', 'lilo_sun_u5_caballo', 'lilo_sun_u5_rule8', 'alan_sun_u5_rule8', 'lilo_sun_u5_rule7');
      Object.assign(x, { caballo: true, rule8: true, rule7: true, cand_moncho: true, alan_title: 'el caballo' });
    }
    await say('alan_sun_u5_teach', 'lilo_sun_u5_teach2', 'lilo_sun_u5_try');
    for (;;) {
      const ok = await S.rhythm({ title: 'The one that calls', text: 'On Lilo\'s drum: tap three beats and a rest. The third comes late, like a skipped heartbeat.', bars: 3 });
      if (ok) break;
      await say('lilo_sun_u5_tryagain');
    }
    await say('lilo_sun_u5_ok', 'lilo_sun_u5_in', 'alan_sun_u5_in');
    x.rhythm_on = true; x.lilo_in = true;
    // U6: the other half of the napkin
    await S.switchTo('ines', 'hostal_kitchen', 'courtyard');
    await say('narr_sun_u6_01');
  }

  // ================================================================ U6: Inês, the Paris dossier (the fax)
  S.spot('hostal_kitchen', { name: 'Fax (to Paris)', rect: [790, 300, 130, 90], at: [850, 662], when: () => sun() && S.who() === 'ines' && !F().dossier_sent,
    look: 'ines_sun_u6_look_fax', use: () => S.u6() });
  S.u6 = async function () {
    const x = F();
    await say('ines_sun_u6_02');
    for (;;) {
      await say('ines_sun_u6_order');
      const v = await S.choose('Page one', 'What does Paris read first?', [
        { label: 'Peralta\'s 1990 inscription reference', value: true, correct: true }, { label: 'The 1586 note', value: false },
        { label: 'The 1930 letter and its carbon', value: false }, { label: 'The bell-chamber photographs', value: false }]);
      if (v) { await say('ines_sun_u6_order_ok'); break; }
      await say('ines_sun_u6_order_no');
    }
    S.sfx('beep', 0.4);
    await say('narr_sun_u6_jam', 'ines_sun_u6_jam');
    for (;;) {
      const v = await S.choose('Page three has jammed', '', [{ label: 'Pull it out', value: false }, { label: 'Fold the corner back and re-feed it slowly', value: true, correct: true }]);
      if (v) { await say('ines_sun_u6_jam_ok'); break; }
      await say('ines_sun_u6_jam_no');
    }
    await say('parrot_sun_u6_scream', 'narr_sun_u6_parrot');
    S.sfx('office_phone', 0.5);
    await say('narr_sun_u6_ring', 'agent_sun_u6_gulb', 'ines_sun_u6_gulb_q');
    const S3 = [['ines_sun_u6_g1', true], ['ines_sun_u6_g2', true], ['ines_sun_u6_g3', true], ['ines_sun_u6_gx1', false], ['ines_sun_u6_gx2', false]];
    for (;;) {
      let used = [], ok = true;
      for (let i = 0; i < 3 && ok; i++) {
        const opts = S3.filter(s => !used.includes(s[0])).map(s => ({ label: window.LINES[s[0]][1], value: s[0], correct: s[1] }));
        const id = await S.choose('Three polite sentences', `${3 - i} to go. Not four.`, opts);
        used.push(id); await say(id);
        if (!S3.find(s => s[0] === id)[1]) ok = false;
      }
      if (ok) { await say('ines_sun_u6_gulb_ok'); break; }
      await say('ines_sun_u6_gulb_no');
    }
    await say('mireya_sun_u6_phone', 'ines_sun_u6_static');
    for (;;) {
      await say('narr_sun_u6_static');
      const v = await S.timedChoice({ title: 'Page six', text: 'The static has dropped. Mireya\'s sister rings at half past.', seconds: 4,
        options: [{ label: 'Send page six. Now.', value: true, correct: true }, { label: 'Wait for a cleaner gap', value: false }] });
      if (v) break;
      await say('ines_sun_u6_static_no');
    }
    S.sfx('beep', 0.5);
    await say('ines_sun_u6_sent', 'ines_sun_u6_end', 'ines_sun_u6_napkin');
    x.dossier_sent = true; S.give('dossier');
    await S.switchTo('alan', 'hostal_courtyard', 'kitchen');
  };

  // ================================================================ U7: sunset, the tower
  S.onEnter('hostal_courtyard', async () => {
    const x = F();
    if (!sun()) return;
    if (x.dossier_sent && !x.tobias_up && S.who() === 'alan') {
      x.tobias_up = true;
      await say('narr_sun_u7_01', 'mireya_sun_u7_02');
      if (x.prediction_made) { await say('alan_sun_u7_knows', 'alan_sun_u7_rum'); if (rum() < 1) await say('alan_sun_u7_norum'); }
      else await say('alan_sun_u7_dunno');
      return;
    }
    if (x.tower_done && !x.sun_done) await night();
  });
  P('hostal_courtyard', { id: 'mireya_c6', ch: 'mireya', speaker: 'mireya', x: 1110, y: 655, dir: 'w', name: 'Señora Mireya', when: () => sun() && (x => x.tobias_up && !x.tower_done)(F()),
    look: () => say('mireya_sun_u7_02'), talk: () => say(F().prediction_made ? 'mireya_sun_h_tower' : 'mireya_sun_h_pred') });
  // Fello sells the bottle (the colmado, Sunday evening)
  P('san_anton', { id: 'fello_sun', ch: 'fello', speaker: 'fello', x: 420, y: 650, dir: 'e', name: 'Fello', when: () => sun() && F().tobias_up && !F().tower_done,
    look: 'alan_sun_look_fello', talk: async () => { if (rum() >= 1) return say('fello_sun_buy'); await say('fello_sun_buy'); rumAdd(1); } });
  // the tower door: on the latch for Alan this evening (and he won't climb without a bottle once he knows why)
  {
    const td = (ROOMS.cathedral_nave.hotspots || []).find(h => h.name === 'The tower door');
    if (td) {
      const pl = td.locked, pll = td.lockedLine;
      const mine = () => sun() && F().tobias_up && !F().tower_done && F().prediction_made && rum() < 1;
      td.locked = () => mine() || (!!pl && pl());
      td.lockedLine = () => mine() ? 'alan_sun_tower_notyet' : (typeof pll === 'function' ? pll() : pll);
    }
  }
  S.onEnter('cathedral_nave', async () => { const x = F(); if (sun() && x.tobias_up && !x.tower_done && !x.sun_nave) { x.sun_nave = true; await say('alan_sun_tower_unwelcome'); } });
  S.onEnter('tower_stair', async () => {
    const x = F();
    if (!sun() || !x.tobias_up || x.tower_done || x.prediction_made) return;
    // the fallback (bible ML3): without the prediction Tobías gets out alone, shaken; he won't hold the tower door on Tuesday
    x.tower_done = true; x.tobias_saved = false;
    await say('narr_sun_u7_fallback', 'tobias_sun_u7_fallback');
  });
  P('bell_chamber', { id: 'tobias_b6', ch: 'tobias', speaker: 'tobias', x: 640, y: 650, dir: 'e', name: 'Tobías', when: () => sun() && F().tobias_up && !F().sun_down && (F().tobias_saved || !F().tower_done),
    look: 'alan_sun_u7_look_tobias', talk: () => say('tobias_sun_u7_09') });
  S.spot('bell_chamber', { name: 'The bell', rect: [470, 90, 330, 370], at: [560, 670], when: () => sun() && F().tobias_up,
    look: () => say(F().tobias_saved ? 'alan_sun_u7_look_bell2' : 'alan_sun_u7_look_bell') });
  S.spot('bell_chamber', { name: 'The sea-side arch', rect: [930, 60, 220, 420], at: [1010, 668], when: () => sun() && F().tobias_up,
    look: 'alan_sun_u7_look_arch', use: () => S.sight(false), items: { compass: () => S.sight(true) } });
  S.spot('bell_chamber', { name: 'The ladder', rect: [130, 50, 180, 450], at: [220, 668], when: () => sun() && F().tobias_up, look: 'alan_sun_u7_look_ladder' });
  // the water from her mouth (drawn over the room while Tobías is under her)
  {
    const R = ROOMS.bell_chamber, fg = R.animFg;
    R.animFg = function (g, t) {
      if (fg) fg.call(this, g, t);
      const lvl = S.water.bell_chamber || 0;
      if (!(sun() && lvl > 0)) return;
      g.save(); g.globalAlpha = Math.min(1, lvl * 4);
      const gr = g.createLinearGradient(0, 430, 0, 640); gr.addColorStop(0, 'rgba(40,70,80,0.75)'); gr.addColorStop(1, 'rgba(40,70,80,0.35)');
      g.fillStyle = gr; const w = 46 + Math.sin(t * 7) * 4; g.fillRect(640 - w / 2, 430, w, 210); g.restore();
      S.drawWater(g, t, lvl);
    };
  }
  S.onEnter('bell_chamber', async () => {
    const x = F();
    if (!sun() || !x.tobias_up || x.tower_done) return;
    x.bg_bell_chamber = 'bell_chamber__sun_sunset';
    S.pulse(5);
    G.autosave();
    for (;;) {
      S.water.bell_chamber = 0.1;
      await say('narr_sun_u7_03', 'narr_sun_u7_04', 'tobias_sun_u7_05');
      const v = await S.timedChoice({ title: 'The water is at his chin', text: 'Under the bell, Tobías on his knees, the sea pouring out of her mouth.', seconds: 6,
        options: [{ label: 'Pull Tobías out by the arms', value: 'pull' }, { label: 'Throw the rum into her mouth', value: 'rum', correct: true }, { label: 'Shout for help down the stair', value: 'shout' }] });
      if (v === 'rum' && rum() >= 1) break;
      await say('alan_sun_u7_wrong');
      await S.waterTo('bell_chamber', 0.6, 1200);
      await S.drown('Tobías crawled out from under her. Alan didn\'t.');
      S.water.bell_chamber = 0;
    }
    rumTake(1);
    await say('alan_sun_u7_throw');
    S.sfx('bell_hum', 0.6);
    await S.waterTo('bell_chamber', 0, 900);
    await say('narr_sun_u7_06', 'tobias_sun_u7_07', 'alan_sun_u7_08', 'tobias_sun_u7_09', 'alan_sun_u7_10');
    x.tobias_saved = true; x.tower_done = true;
    S.pulse(4);
    G.refreshNpcs();
  });
  S.sight = async function (withCompass) {
    const x = F();
    if (x.bearing_taken) return say('alan_sun_u7_look_arch');
    if (!withCompass) return say(G.has('compass') ? 'alan_sun_u7_look_arch' : 'alan_sun_u7_arch_nocompass');
    if (!(x.frieze_sketch && x.mark_looks)) return say('alan_sun_u7_arch_noknow');
    await say('narr_sun_u7_sight', 'alan_sun_u7_sight');
    if (x.tobias_saved) await say('tobias_sun_u7_sight');
    x.bearing_taken = true; x.bearing = 112;
    // down together, to the night at the hostal
    if (x.tower_done) {
      x.sun_down = true;
      await say('narr_sun_u7_down');
      await G.goRoom('hostal_courtyard', 'street');
    }
  };

  // ================================================================ the night at the hostal
  P('hostal_courtyard', { id: 'tobias_n6', ch: 'tobias', speaker: 'tobias', x: 800, y: 655, dir: 'w', name: 'Tobías', when: () => sun() && F().sun_night && F().tobias_saved,
    look: 'alan_sun_u7_look_tobias', talk: () => say('tobias_sun_n_02') });
  P('hostal_courtyard', { id: 'vasco_n6', ch: 'vasco', speaker: 'vasco', x: 960, y: 662, dir: 'w', name: 'Vasco', when: () => sun() && F().sun_night,
    look: () => say('vasco_sun_n_07'), talk: () => say('vasco_sun_n_09') });
  async function night() {
    const x = F();
    x.sun_night = true; x.sun_down = true;
    x.bg_hostal_courtyard = 'hostal_courtyard__night';
    G.refreshNpcs();
    if (x.tobias_saved) await say('narr_sun_n_01', 'tobias_sun_n_02', 'tobias_sun_n_03');
    else await say('narr_sun_n_fallback', 'tobias_sun_n_03');
    await say('vasco_sun_n_04', 'radio_sun_n_05', 'mireya_sun_n_06', 'vasco_sun_n_07', 'alan_sun_n_08', 'vasco_sun_n_09', 'narr_sun_n_10');
    x.sun_done = true;
    G.autosave();
    await G.fade(true);
    delete x.bg_hostal_courtyard; delete x.bg_bell_chamber;
    x.sun_night = false;
    await S.next(7);
  }

  // ================================================================ previews and the test walk
  S.PREVIEW.start6 = {
    flags: { ch: 5, rum: 4, offerings_noted: true, coin_found: true, frieze_sketch: true, mark_looks: true, worn_phrase: true, note_1586: true, pins_marked: true,
      overlay_made: true, rule5: true, tobias_dries: true, lullaby_half: true, notebook_got: true, carbon_found: true, sisters_in: true, veve_accuracy: 3,
      seal_taken: true, batista_trust: 2, wed_done: true, thu_done: true, fri_done: true, sat_done: true, pockets: { ines: ['wax_seal'] } },
    items: ['tata_notebook', 'rum', 'lilo_address', 'crest_paper', 'welcome_fax', 'archive_copies', 'index_cards'],
    room: 'hostal_kitchen', pos: [520, 680, 'e'], run: () => S.START[6](),
  };
  S.SOLVE[6] = async function () {
    // (the harness can call this before the preview's START has begun: wait for Sunday)
    for (let i = 0; i < 400 && F().ch !== 6; i++) await G.wait(25);
    await S.quiet();
    await S.act('ines_k6', 'talk');                         // U1 + U2
    S.expect('the napkin', x => x.napkin && x.notebook_read);
    await S.act('The kitchen table', null, 'tata_notebook'); // Mireya joins
    S.expect('Mireya in', x => x.mireya_in);
    await S.chart();
    await S.go('palace_courtyard', 'hub');
    await S.act('The bishop\'s study');
    await S.act('A small photograph', 'look');
    await S.act('bishop_sun', 'talk');                      // U3, then U4 on the wall
    S.expect('the wall', x => x.wall_done && x.napkin_torn);
    await S.go('gallera', 'hub');
    await S.act('lilo_sun', 'talk');
    await S.act('The red earth', null, 'rum');
    await S.act('lilo_sun', null, 'rum');
    await S.act('lilo_sun', null, 'tata_notebook');        // the pages, the drum, the rhythm: Lilo in; then Inês
    S.expect('Lilo in, playing Inês', x => x.lilo_in && S.who() === 'ines');
    await S.act('Fax (to Paris)', 'use');                   // U6; then Alan at sunset
    S.expect('Tobías up the tower', x => x.dossier_sent && x.tobias_up && S.who() === 'alan');
    if (!F().prediction_made) { const d = S.DEDUCTIONS.find(d => d.result === 'prediction_made'); if (d) await S.tryDeduce(d.a, d.b); }
    S.expect('the prediction', x => x.prediction_made);
    await S.go('cathedral_nave', 'hub');
    await S.act('The tower door');
    await S.act('Up the steps');                            // the rescue
    S.expect('Tobías saved', x => x.tobias_saved);
    await S.act('The sea-side arch', null, 'compass');      // the sighting; down; the night; Monday
    await S.quiet();
    S.expect('Monday', x => x.ch === 7 && x.bearing_taken && x.sun_done);
  };
})();
