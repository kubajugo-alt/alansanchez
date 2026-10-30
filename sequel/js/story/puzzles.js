// The Shortest Night — knowledge as inventory (the user, 2026-10-30: "there is too little multi-stage puzzles... we need
// things that would be more challenging for him to solve"; the design is docs/puzzles/DESIGN.md).
// Alan collects words (S.WORDS: a name, a phrase, a date), each earned by something the story has already set (a flag),
// so old saves know them too. He uses them on notebook pages with blanks (S.PAGES): click a blank to cycle through the
// words of its kind he knows; when every blank is filled the page checks itself, and either it's solved (a flag) or he
// knows some of it is wrong. The pages sit at the front of his notebook (N) while they're open; S.openPage opens one.
// Loaded after the days' files: it adds to their scenes rather than replacing them.
(function () {
  const S = window.S, { G, F, say } = S;
  const ch = () => F().ch || 1;

  // ---------------------------------------------------------------- the words
  // id: [kind, how it reads on the page, earned when]
  const W = (kind, text, when) => ({ kind, text, when });
  S.WORDS = {
    // 1483, both tellings (Abreu Galindo, Carmen, the inquiry)
    harimaguadas: W('history', 'the harimaguadas', f => f.galindo_read || f.lore_carmen),
    called: W('history', 'they called it', f => f.lore_carmen),
    magec: W('history', 'Magec, the sun', f => f.galindo_read || f.lore_carmen),
    cueva: W('history', 'la cueva aguanta el mar', f => f.lore_carmen),
    brujas: W('history', 'las brujas del 83', f => f.inquiry_read),
    baptist: W('history', 'the Baptist', f => f.inquiry_read),
    equinox: W('history', 'the equinox', f => f.inquiry_read),
    storm: W('history', 'a storm', f => f.pino_list),
    // who, and how, and why (the case)
    montesdeoca: W('who', 'Montesdeoca', f => f.reception_done),
    baute: W('who', 'Baute', f => f.met_baute),
    yeray: W('who', 'Yeray', f => f.sketchbook_read),
    van: W('means', 'his van', f => f.herring_van),
    carry: W('means', 'Yeray carries them', f => f.sketchbook_read),
    artenara_hotel: W('why', 'a hotel at Artenara', f => f.chano_theory),
    meloneras: W('why', 'the resort at Meloneras', f => f.paper_day != null),
    tasarte: W('why', 'Tasarte', f => f.receipt_read),
    projects: W('why', 'his projects', f => f.saw_map),
    targets: W('why', 'targets', f => f.tasarte_told),
    // places
    office: W('where', "Baute's office", f => f.gd_thu),
    archive: W('where', 'the archive', f => f.carmen_wed),
    isleta: W('where', 'La Isleta', f => f.saw_helmet),
    canteras: W('where', 'Las Canteras', f => f.burnt),
    // the founders' Portuguese (Alan's own language; it's the 1751 hand he can't read)
    fechadura: W('pt', 'fechadura', f => f.called_thu),
    calado: W('pt', 'calado', f => f.called_thu),
    devolvida: W('pt', 'devolvida', f => f.pino_list),
    viragem: W('pt', 'viragem', f => f.cave_explained),
    porta: W('pt', 'porta', f => f.cave_explained),
    fundicao: W('pt', 'fundição', f => f.saw_mark),
    // Doña Pino's list
    pino: W('name', 'Pino Medina', f => f.pino_list),
    antonio: W('name', 'Antonio Cabrera', f => f.pino_list),
    pepe: W('name', 'José Santana', f => f.pino_list),
    // the hours
    t1904: W('time', '19:04', f => f.tide_read),
    t0700: W('time', '07:00', f => f.knows_guagua),
    t1300: W('time', '13:00', f => f.vnote_read),
    // island words (used on Don Lolo, and the parrots)
    chacho: W('island', 'chacho', f => f.chacho),
    panza: W('island', 'panza de burro', f => f.burnt),
    guagua: W('island', 'guagua', f => f.knows_guagua),
    guiri: W('island', 'guiri', f => f.mercedes_met),
  };
  S.knows = id => { const w = S.WORDS[id]; try { return !!(w && w.when(F())); } catch (e) { return false; } };
  // a toast for each word newly earned (after every finished action: G.autosave is called then)
  S.syncWords = function () {
    const f = F(); if (!f || f.ch == null) return;
    const seen = f.words_seen || (f.words_seen = []);
    for (const id of Object.keys(S.WORDS)) if (!seen.includes(id) && S.knows(id)) {
      seen.push(id);
      if (G.toast && !window.FAST) G.toast(`Noted: “${S.WORDS[id].text}”`);
    }
  };
  const autosave = G.autosave;
  G.autosave = function () { try { S.syncWords(); } catch (e) { /* (never stop a save) */ } return autosave.apply(this, arguments); };

  // ---------------------------------------------------------------- the pages
  // rows: html with {a}, {b}... for the blanks; blanks: { a: [kind, answer] }; done: the flag set when it's right
  S.PAGES = [
    { id: 'tellings', title: '1483, told twice', done: 'tellings',
      open: f => f.ch === 3 && f.lore_carmen && f.inquiry_read,
      intro: 'The Castilians wrote it down. Carmen told it the other way. Same spring, same sea.',
      rows: ['<i>"Women in white singing on the cliffs."</i><br>They were {a}.',
        '<i>"The sea rose black against the wind."</i><br>Not weather: {b}.',
        '<i>"A miracle of the Baptist,"</i> on Saint John\'s morning.<br>It was {c}, at the turn of the year.',
        '<i>"It did not come again."</i><br>Because {d}.'],
      blanks: { a: ['history', 'harimaguadas'], b: ['history', 'called'], c: ['history', 'magec'], d: ['history', 'cueva'] } },
    { id: 'case_thu', title: 'Who is taking the discs?', done: 'case_thu',
      open: f => f.ch === 3 && f.gd_thu,
      intro: 'Everything I know. Put it in order. (Don\'t ask Vasco.)',
      rows: ['{a} is taking the discs out of Cave 6.', 'They leave the museum in {b}.', 'He wants {c}, and needs the cave to be worthless.',
        'The proof will be in {d}.'],
      blanks: { a: ['who', 'montesdeoca'], b: ['means', 'van'], c: ['why', 'artenara_hotel'], d: ['where', 'office'] },
      // after Friday's fight, Vasco's answers through the middle of it
      struck: f => f.ch >= 4 && f.fight_done },
    { id: 'case_sat', title: 'Who is taking the discs? (again)', done: 'case_sat',
      open: f => f.ch === 5 && f.sketchbook_read,
      intro: 'Same question. This time with what I didn\'t hear on Friday.',
      rows: ['{a} is taking the discs.', 'They never go in a van: {b}, down to the vault under the caves.',
        'In 1966 Montesdeoca\'s bulldozers cleared {c}, where Baute\'s grandmother\'s people were buried.',
        'The six hotels circled on Baute\'s map aren\'t Montesdeoca\'s plans. They\'re {d}.'],
      blanks: { a: ['who', 'baute'], b: ['means', 'carry'], c: ['why', 'tasarte'], d: ['why', 'targets'] } },
    { id: 'letter', title: 'The founders\' letter, 1751', done: 'letter_read', cls: 'doc-letter',
      open: f => f.ch === 5 && f.footprint_seen,
      intro: 'Portuguese, my own language, in a hand that\'s been dead two hundred and forty years. Four words gone where the ink went.',
      rows: ['<span class="old">"…o Mar fere primeiro a quem entende a <b>f·ch·d·ra</b>…"</span><br>{a}',
        '<span class="old">"…vem buscar toda alma que lhe foi <b>dev·lv·da</b>…"</span><br>{b}',
        '<span class="old">"…e só se fecha numa <b>v·r·g·m</b>, de dentro da sua água…"</span><br>{c}',
        '<span class="old">"…à <b>p·rt·</b>, enquanto o sol nasce."</span><br>{d}',
        '<span class="old" style="opacity:0.4">"A última … pôs as pedras … e quando … desceo com ella …"</span><br><i>(The last paragraph is gone. Inês has the professor.)</i>'],
      blanks: { a: ['pt', 'fechadura'], b: ['pt', 'devolvida'], c: ['pt', 'viragem'], d: ['pt', 'porta'] } },
    { id: 'next', title: 'Who\'s next', done: 'next_known',
      open: f => f.ch === 5 && f.radio_lie,
      intro: 'It comes for the ones it had and lost: the Virgen del Pino, one a month since Christmas. Juan de Quintana, five hundred years ago. Who\'s left, and where, and when?',
      rows: ['Next on Doña Pino\'s list, still within its reach: {a}.', 'It comes up from below, where the city is lowest: {b}.',
        'It comes with the tide. High water tonight: {c}.'],
      blanks: { a: ['name', 'pino'], b: ['where', 'isleta'], c: ['time', 't1904'] } },
  ];
  S.page = id => S.PAGES.find(p => p.id === id);
  const fills = id => { const f = F(), pg = f.pg || (f.pg = {}); return pg[id] || (pg[id] = {}); };
  const optionsFor = kind => Object.keys(S.WORDS).filter(k => S.WORDS[k].kind === kind && S.knows(k));
  // check: every blank filled? then right (solved) or how many are wrong
  S.checkPage = function (p) {
    const f = F(), v = fills(p.id), keys = Object.keys(p.blanks);
    if (f[p.done] || keys.some(k => !v[k])) return null;
    const wrong = keys.filter(k => v[k] !== p.blanks[k][1]).length;
    if (!wrong) { f[p.done] = true; S._solved = p.id; }
    else S._wrong = { id: p.id, n: wrong };
    return wrong;
  };
  // tests (and the story) can fill a page directly: S.fillPage('tellings', { a: 'harimaguadas', ... })
  S.fillPage = function (id, answers) { const p = S.page(id); Object.assign(fills(id), answers); S.checkPage(p); return !!F()[p.done]; };
  const blankHtml = (p, k) => {
    const v = fills(p.id)[k], done = F()[p.done];
    const txt = v ? S.WORDS[v].text : '…………';
    return done ? `<b class="pz-done">${txt}</b>` : `<button class="pz-blank${v ? '' : ' empty'}" data-b="${k}">${txt}</button>`;
  };
  const pageOf = p => ({
    img: 'close:paper_aged', cls: 'doc-hand pz ' + (p.cls || ''),
    get html() {
      const f = F(), struck = p.struck && p.struck(f);
      const rows = p.rows.map(r => `<p class="${struck ? 'pz-struck' : ''}">${r.replace(/\{([a-z])\}/g, (m, k) => blankHtml(p, k))}</p>`).join('');
      const v = fills(p.id), keys = Object.keys(p.blanks), full = keys.every(k => v[k]);
      const wrong = full && !f[p.done] ? keys.filter(k => v[k] !== p.blanks[k][1]).length : 0;
      const status = f[p.done] ? (struck ? '<p class="pz-status">Vasco: "You could have just asked me."</p>' : '<p class="pz-status ok">✓</p>')
        : wrong ? `<p class="pz-status no">${wrong === 1 ? 'One of these is wrong.' : wrong === keys.length ? 'None of this fits.' : 'Some of these are wrong.'}</p>`
        : '<p class="pz-status">(Click a gap to try the words I know.)</p>';
      return `<h3>${p.title}</h3><p class="pz-intro">${p.intro}</p>${rows}${status}`;
    },
    mount(el, redraw) {
      el.querySelectorAll('.pz-blank').forEach(b => b.onclick = e => {
        e.stopPropagation();
        const k = b.dataset.b, opts = optionsFor(p.blanks[k][0]), v = fills(p.id);
        if (!opts.length) { if (G.toast) G.toast('I don\'t know anything that goes there yet'); return; }
        const i = opts.indexOf(v[k]); v[k] = opts[(i + 1) % opts.length];
        Sound.sfx('page', 0.3);
        S.checkPage(p); redraw();
      });
    },
  });
  // after the notebook closes: what Alan says about a page he's just solved (or got wrong)
  S.afterPages = async function () {
    const solved = S._solved, wrong = S._wrong; S._solved = S._wrong = null;
    if (solved && S.ON_SOLVE[solved]) await S.ON_SOLVE[solved]();
    else if (wrong && !solved) await say(wrong.n === 1 ? 'alan_pz_one_wrong' : 'alan_pz_wrong');
  };
  S.ON_SOLVE = {};   // (filled in below and by the days' scenes)
  S.openPages = () => S.PAGES.filter(p => p.open(F()) || F()[p.done] && p.struck && p.struck(F()) && F().ch === 4);
  // one page, opened by the story ("He sits down with the letter")
  S.openPage = async function (id) { await G.closeup([pageOf(S.page(id))]); await S.afterPages(); };

  // ---------------------------------------------------------------- the notebook: the open pages first, then the notes
  const readNotebook = S.readNotebook;
  S.readNotebook = async function () {
    const open = S.openPages().filter(p => !F()[p.done] || (p.struck && p.struck(F())));
    if (!open.length) return readNotebook();
    // the notes (as core.js lays them out) after the pages
    const f = F(), notes = S.NOTES.filter(n => n[0](f)).map(n => `<p>${n[1]}</p>`), pages = open.map(pageOf);
    for (let i = 0; i < notes.length; i += 5) pages.push({ img: 'close:paper_aged', cls: 'doc-hand', html: `<h3>${i ? '&nbsp;' : 'Gran Canaria, June 1996'}</h3>` + notes.slice(i, i + 5).join('') });
    const todo = f.as_vasco ? '' : S.TODO();
    if (todo) pages.push({ img: 'close:paper_aged', cls: 'doc-hand', html: `<h3>What Inês would say</h3><p><i>${todo}</i></p>` });
    await G.closeup(pages);
    await S.afterPages();
  };

  // ---------------------------------------------------------------- the pages' look
  const css = document.createElement('style');
  css.textContent = `
    #closeup .page.pz { font-size: clamp(9px, 1.35vw, 17px); }
    #closeup .page.pz p { margin: 0.55em 0; }
    #closeup .page.pz .pz-intro { font-style: italic; opacity: 0.8; }
    #closeup .page.pz button.pz-blank { font: inherit; font-weight: 700; color: #6a1f0c; background: rgba(255,250,235,0.55); border: none;
      border-bottom: 2px solid #6a1f0c; border-radius: 2px; padding: 0 0.35em; cursor: pointer; }
    #closeup .page.pz button.pz-blank.empty { color: rgba(106,31,12,0.55); }
    #closeup .page.pz button.pz-blank:hover { background: rgba(255,236,190,0.9); }
    #closeup .page.pz .pz-done { color: #1e4a1a; }
    #closeup .page.pz .pz-struck { text-decoration: line-through; text-decoration-color: rgba(120,20,10,0.8); opacity: 0.75; }
    #closeup .page.pz .pz-status { text-align: center; margin-top: 1em; opacity: 0.85; }
    #closeup .page.pz .pz-status.ok { color: #1e4a1a; font-size: 1.6em; }
    #closeup .page.pz .pz-status.no { color: #7a1408; font-weight: 700; }
    #closeup .page.pz .old { font-family: 'IM Fell English', serif; opacity: 0.75; }`;
  document.head.appendChild(css);
})();

// ================================================================ the puzzles in the days (DESIGN.md, day by day)
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;
  const PAPER = 'close:paper_aged';
  const page = (html, cls) => ({ img: PAPER, cls: cls || 'doc-hand', html });
  const chain = (obj, key, after) => { const was = obj[key]; obj[key] = async function () { const r = was ? await was.apply(this, arguments) : undefined; await after.apply(this, arguments); return r; }; };

  // ---------------------------------------------------------------- new things in his pockets
  Object.assign(window.ICON_LABELS, { receipt: 'Receipt', radio_lolo: 'Radio', vnote: "Vasco's note", foil: 'Foil' });
  Object.assign(S.ITEMS, {
    receipt: { name: 'A receipt from San Nicolás', look: () => S.readReceipt() },
    radio_lolo: { name: 'Don Lolo\'s hand radio', look: 'alan_look_radio_lolo' },
    vnote: { name: 'Vasco\'s note', look: () => S.readVnote() },
    foil: { name: 'Foil from a cigarette packet', look: 'vasco_look_foil' },
  });

  // ---------------------------------------------------------------- Alan's notes for what's new
  S.NOTES.push(
    [f => f.folio12, 'Thu. Folio 12, struck from the inquiry: Pedro, a Canario fisherman of Gáldar. The women called it and it would not be aimed; they shut it with Magec at the cave. Nobody asked the women, and the one man who answered for them was taken out.'],
    [f => f.receipt_read, 'Sat. In the lining of the blazer: a mass for the dead of Tasarte, 1966, paid every year. I. M.'],
    [f => f.tasarte_told, 'Sat. Chano: Tasarte, 1966. Montesdeoca\'s bulldozers, Baute\'s grandmother\'s people in the skip. Six hotels circled: targets.'],
    [f => f.vnote_read, 'Sat. Vasco\'s note from Tuesday: the camp listens on Canal 9, on the hour.'],
    [f => f.radio_lolo_got, 'Sat. Don Lolo heard a Portuguese on the mountain\'s channel this morning: "Tell Alan... the van... the discs... under—"'],
    [f => f.radio_lie, 'Sat. From Santa Ana\'s tower, on Lolo\'s radio: Baute says Vasco took the guagua down after the cave. The guagua goes at seven in the morning. He\'s lying.'],
    [f => f.next_known, 'Sat. Doña Pino is next. La Isleta, on the high tide: 19:04.'],
  );
  { const n = S.NOTES.find(x => /Doña Pino\\'s list|Doña Pino's list/.test(x[1])); if (n) n[1] += ' (Antonio\'s in Caracas. Manuel lives up the hill in Tamaraceite.)'; }

  // ---------------------------------------------------------------- Inês, "What now?", for the new steps
  const hint = S.hint;
  S.hint = function () {
    const f = F();
    if (f.ch === 3) {
      if (f.lore_carmen && f.inquiry_read && !f.tellings) return 'ines_hint_tellings';
      if (f.tellings && !f.folio12) return 'ines_hint_folio';
      if (f.gd_thu && !f.case_thu) return 'ines_hint_case';
    }
    if (f.ch === 5) {
      if (f.footprint_seen && !f.letter_read) return 'ines_hint_letter';
      if (f.called_sat && !f.case_sat) return 'ines_hint_case2';
      if (f.case_sat && !f.radio_lolo_got) return 'ines_hint_radio';
      if (f.radio_lolo_got && !f.radio_lie) return 'ines_hint_tower';
      if (f.radio_lie && !f.next_known) return 'ines_hint_next';
    }
    return hint();
  };

  // ================================================================ THURSDAY
  // Abreu Galindo, read, counts (the words in it)
  chain(S, 'readGalindo', () => { F().galindo_read = true; });
  // the two tellings: open the page once he has both (Carmen's and the inquiry), wherever he gets the second
  const tellingsDue = async () => {
    const f = F();
    if (ch() !== 3 || !f.lore_carmen || !f.inquiry_read || f.pz_tellings_shown) return;
    f.pz_tellings_shown = true;
    await say('alan_pz_tellings_open'); await S.openPage('tellings');
  };
  chain(S, 'carmenLore', tellingsDue); chain(S, 'readInquiryAloud', tellingsDue);
  S.ON_SOLVE.tellings = () => say('alan_pz_tellings_done_1', 'alan_pz_tellings_done_2');
  // folio 12 (Mercedes, thu.js S.talkMercedes)
  S.folio12 = async function () {
    const f = F();
    await say('mercedes_folio_1', 'narr_th_folio_1');
    S.sfx('paper_shuffle', 0.4);
    await S.readFolio12();
    await say('mercedes_folio_2', 'mercedes_folio_3', 'mercedes_folio_4', 'mercedes_folio_5', 'alan_th_folio');
    f.folio12 = true;
  };
  S.readFolio12 = () => G.closeup([page(`<h3>Pesquisa · 1484 · fol. 12</h3><p>Pedro, Canario, fisherman of Gáldar, baptised, sworn: that he pulled the master Juan de Quintana from the sea on the fourth night.</p><p>That the women in white did not call the sea upon the Castilians alone, but called it, and it would not be aimed, and on the third night it took his own village.</p><p>That they shut it out with Magec, at the cave of the light above Artenara, on the morning of the turn. And that the sea will want back the ones he took from it.</p><p style="font-size:0.85em;opacity:0.75">(Struck through, the whole folio, in another ink. In the margin of fol. 13: <i>Nadie preguntó a las mujeres.</i>)</p>`)]);
  // the case: Gail's news gives the last piece (the contract upstairs); then he builds it
  const gdThu = S.gdThu;
  S.gdThu = async function () {
    const first = !F().gd_thu;
    await gdThu.apply(this, arguments);
    if (!first) return;
    await say('gail_th_contract');
    if (!F().case_thu) { await say('alan_pz_case_open'); await S.openPage('case_thu'); }
  };
  S.ON_SOLVE.case_thu = () => say('alan_pz_case_done');
  // the break-in against the clock: Vasco's twenty minutes, a few minutes an action (a look costs one); then the questions
  // (ten more), then a professor's lecture (as long as it lasts): pressure, never a dead end
  S.talkClock = () => { const m = F().talk_min; G.setClock(m == null ? null : `Vasco's talk · ${Math.max(0, m)} min`); };
  S.tickTalk = async function (verb) {
    const f = F();
    if (!(S.dinnerOn && S.dinnerOn()) || f.desk_open || f.talk_min == null) return;
    f.talk_min -= verb === 'look' ? 1 : 3;
    if (f.talk_min <= 0) {
      if (!f.talk_q) { f.talk_q = true; f.talk_min = 10; S.talkClock(); return say('narr_th_timer_1'); }
      f.talk_min = null; S.talkClock(); return say('narr_th_timer_2');
    }
    S.talkClock();
  };
  chain(ROOMS.museum_hall, 'enter', async () => {
    const f = F();
    if (S.dinnerOn && S.dinnerOn() && f.dinner_intro && f.talk_min === undefined && !f.desk_open) { f.talk_min = 20; S.talkClock(); await say('alan_th_timer'); }
  });
  for (const r of ['museum_hall', 'baute_office']) {
    const was = ROOMS[r].onAction;
    ROOMS[r].onAction = async function (t, verb) { if (was) await was.apply(this, arguments); await S.tickTalk(verb); };
  }
  const searchDesk = S.searchDesk;
  S.searchDesk = async function () { F().talk_min = null; G.setClock(null); return searchDesk.apply(this, arguments); };

  // ================================================================ SATURDAY
  S.ON_SOLVE.letter = async () => { await say('alan_pz_letter_done_1', 'alan_pz_letter_done_2'); if (F().footprint_seen && !F().called_sat) await say('alan_s_call_due'); };
  // the blazer's lining (it has been in his bag since Tuesday): the receipt
  const blazerLook = S.ITEMS.blazer.look;
  S.ITEMS.blazer.look = async () => {
    const f = F();
    if (ch() !== 5 || !f.sketchbook_read || f.receipt_read) return blazerLook();
    await say('alan_look_blazer_sat', 'narr_s_receipt');
    S.give('receipt'); f.receipt_read = true;
    await say('alan_s_receipt');
  };
  S.readReceipt = async () => {
    await G.closeup([page(`<h3>Parroquia de San Nicolás de Tolentino</h3><p>Recibí de D. I. M. la cantidad de 2.000 ptas.</p><p><i>Misa por los difuntos de Tasarte, 1966.</i></p><p style="text-align:right">Pagado · mayo de 1996</p><p style="font-size:0.85em;opacity:0.75">(Folded inside it, the same receipt for 1995, 1994, 1993… back to 1967, soft as cloth.)</p>`)]);
    await say('alan_look_receipt');
  };
  // Chano on Saturday: the guagua, and Tasarte (called from tue.js S.talkChano's dialogue)
  S.chanoTasarte = async function () {
    const f = F();
    await say('chano_s_tasarte_1', 'chano_s_tasarte_2', 'chano_s_tasarte_3', 'chano_s_tasarte_4', 'alan_s_tasarte');
    f.tasarte_told = true;
    if (!f.case_sat) { await say('alan_pz_case2_open'); await S.openPage('case_sat'); }
  };
  S.ON_SOLVE.case_sat = () => say('alan_pz_case2_done');
  // room 404: the chest of drawers, and under Vasco's books his note from Tuesday
  ROOMS.hotel_room.hotspots.push({ name: 'Chest of drawers', rect: [470, 350, 230, 175], at: [600, 640],
    look: () => ch() === 5 && F().footprint_seen ? S.readVnote(true) : say('alan_look_chest'), take: () => ch() === 5 && F().footprint_seen ? S.readVnote(true) : say('alan_look_chest') });
  S.readVnote = async function (found) {
    const f = F();
    await G.closeup([page(`<p style="font-family:'Homemade Apple',cursive;font-size:1.3em;line-height:2">If you need me: the museum radios the camp. Canal 9, on the hour.<br>V.</p>`)]);
    if (found && !f.vnote_read) { f.vnote_read = true; S.give('vnote'); await say('alan_look_vnote_sat', 'alan_s_need_radio'); }
    else await say('alan_look_vnote_radio');
  };
  // La Isleta: Don Lolo, who doesn't talk to tourists (island words: chacho, panza de burro, guagua, guiri; two will do)
  const ISLAND = [['chacho', 'alan_lolo_chacho', 'lolo_s_chacho'], ['panza', 'alan_lolo_panza', 'lolo_s_panza'], ['guagua', 'alan_lolo_guagua', 'lolo_s_guagua'], ['guiri', 'alan_lolo_guiri', 'lolo_s_guiri']];
  S.loloRadio = async function () {
    const f = F();
    if (f.isleta_flood || f.radio_lolo_got || !f.vnote_read) return say('lolo_mmh');
    const warm = f.lolo_warm || (f.lolo_warm = []);
    for (;;) {
      let pick = null;
      await G.dialog([
        { line: 'alan_lolo_plain', bye: true, run: () => { pick = 'plain'; } },
        ...ISLAND.map(([w, line]) => ({ line, bye: true, when: () => S.knows(w) && !warm.includes(w), run: () => { pick = w; } })),
        { line: 'alan_bye_lolo', bye: true, run: () => { pick = 'bye'; } },
      ]);
      if (pick === 'bye') return;
      if (pick === 'plain') { await say('lolo_mmh'); f.lolo_plain = (f.lolo_plain || 0) + 1; if (f.lolo_plain === 2) await say('alan_s_lolo_think'); continue; }
      warm.push(pick); await say(ISLAND.find(x => x[0] === pick)[2]);
      if (warm.length >= 2) break;
    }
    await say('lolo_s_talk_1', 'alan_lolo_why', 'lolo_s_talk_2', 'lolo_s_talk_3', 'lolo_s_talk_4', 'alan_s_lolo_vasco', 'lolo_s_talk_5');
    S.give('radio_lolo'); f.radio_lolo_got = true;
  };
  // Santa Ana on Saturday: Don Fermín lets him up; the bell window; the hour; Baute
  { const fe = ROOMS.santa_ana_inside.npcs.find(n => n.id === 'fermin'); if (fe) fe.when = () => ch() >= 2 && ch() <= 5; }
  const talkFermin = S.talkFermin, talkFerminBelfry = S.talkFerminBelfry;
  S.talkFermin = function () { return ch() === 5 ? say('fermin_s_up') : talkFermin.apply(this, arguments); };
  S.talkFerminBelfry = function () { return ch() === 5 ? say('fermin_s_up') : talkFerminBelfry.apply(this, arguments); };
  { const w = ROOMS.belfry.hotspots.find(h => h.name === 'Bell window'); if (w) w.items = Object.assign(w.items || {}, { radio_lolo: () => S.radioCall() }); }
  ROOMS.belfry.hotspots.push({ name: 'Sit and wait for the hour', rect: [820, 470, 180, 70], at: [900, 650], when: () => ch() === 5 && F().radio_wait && !F().radio_lie,
    look: 'alan_look_wait_hour', use: () => S.waitHour() });
  S.waitHour = async function () {
    const f = F();
    await G.busy(async () => { await G.fade(true); await T(600); await G.fade(false); S.sfx('clock_chime', 0.5); await T(500); S.sfx('bell_hum', 0.6); await say('narr_s_wait_bell'); });
    f.hour_struck = true;
    await S.radioCall();
  };
  S.radioCall = async function () {
    const f = F();
    if (ch() !== 5 || f.radio_lie) return say('alan_look_radio_lolo');
    if (!f.hour_struck) { S.sfx('relay_click', 0.5); f.radio_wait = true; return say('alan_s_radio_static'); }
    f.hour_struck = false;   // (one call an hour)
    S.sfx('relay_click', 0.5);
    if (!f.baute_radio) { f.baute_radio = true; await say('alan_s_radio_1', 'narr_s_radio_1', 'baute_r_1', 'alan_s_radio_2', 'baute_r_2'); }
    else await say('alan_s_radio_1', 'baute_r_again');
    let caught = false;
    await G.dialog([
      { line: 'alan_r_catch', when: () => S.knows('guagua'), bye: true, run: async () => { caught = true; await say('narr_r_silence', 'baute_r_lift', 'narr_r_click', 'alan_s_radio_lie'); } },
      { line: 'alan_r_when', once: true, run: () => say('baute_r_when') },
      { line: 'alan_r_put_on', once: true, run: () => say('baute_r_put') },
      { line: 'alan_r_thanks', once: true, run: () => say('baute_r_thanks') },
      { line: 'alan_r_bye', bye: true, run: () => say('alan_s_radio_think') },
    ]);
    if (!caught) return;
    f.radio_lie = true;
    await S.tried();   // (sat.js: the museum shut, every car booked, the bus gone)
    await say('alan_pz_next_open'); await S.openPage('next');
  };
  // Las Canteras: the tide table taped inside the phone box
  ROOMS.canteras.hotspots.push({ name: 'Tide table', rect: [340, 345, 35, 105], at: [400, 650], look: () => S.readTides() });
  S.readTides = async function () {
    const f = F(), d = ch(), rows = { 1: ['05:52', '18:13'], 2: ['06:33', '18:55'], 3: ['07:12', '19:34'], 4: ['07:49', '20:10'], 5: ['06:41', '19:04'], 6: ['07:20', '19:41'], 7: ['07:58', '20:18'] };
    const day = ['', 'Martes 18', 'Miércoles 19', 'Jueves 20', 'Viernes 21', 'Sábado 22', 'Domingo 23', 'Lunes 24'];
    await G.closeup([page(`<h3>Tabla de mareas · Las Canteras · junio 1996</h3>${[1, 2, 3, 4, 5, 6, 7].map(i => `<p${i === d ? ' style="font-weight:700"' : ''}>${day[i]} · pleamar ${rows[i][0]} · ${rows[i][1]}</p>`).join('')}<p style="font-size:0.85em;opacity:0.75">(Someone has written under it in biro: <i>¿y el mar lo sabe?</i>)</p>`, 'doc-ledger')]);
    if (d === 5) f.tide_read = true;
    await say('alan_look_tides');
  };
  S.ON_SOLVE.next = () => say('alan_pz_next_done');
  // the warning, then the flood (sat.js S.floodScene): Lolo stays awake because Alan told him
  S.warnLolo = async function () {
    await G.busy(async () => {
      await say('narr_s_warn_1', 'alan_s_warn', 'lolo_s_warn', 'lolo_s_warn_2');
      G.takeItem('radio_lolo');
    });
    await S.floodScene();
  };

  // ================================================================ VASCO'S CHAPTER: the foil from Yeray's packet
  S.takeFoil = async function () {
    if (!F().as_vasco) return;
    if (G.has('foil') || F().v_sent) return say('vasco_look_stove');
    S.give('foil'); await say('vasco_take_foil');
  };
})();
