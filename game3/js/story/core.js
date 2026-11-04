// The Forgotten Rhythm — shared story state. Read this header before writing a day's file: it is the API.
//
//   S.G (window.Game), S.F() (the flags), S.say(...ids), S.T(ms), S.sfx(name, vol), S.once(flag, fn), S.chat(flag, first, again),
//   S.give(id, silent), S.take(id), S.has(id), S.room(def), S.ROOMS
//   S.spot(roomId, hotspot)   add a hotspot to a room (rooms are defined once in rooms.js; the days add to them)
//   S.person(roomId, npc)     add a person (npc def: { id, ch, x, y, dir, name, when, look, talk, items, at })
//   S.onEnter(roomId, fn)     run fn(entry) each time the room is entered (after the room's own enter); fns run in order
//   S.day(n, line)            a day card, then autosave. ch: 0 prologue 1586 · 1 Lisbon (Thu 29 Aug) · 2 Wed 4 · 3 Thu 5 · 4 Fri 6 ·
//                             5 Sat 7 · 6 Sun 8 · 7 Mon 9 · 8 Tue 10 (and the finale that night) · 9 the epilogue
//   S.becomeInes(), S.becomeAlan(), S.becomeCatalina()   switch the playable figure (separate object pockets; documents are shared)
//   S.DOCS                    item ids that are documents (both halves carry them)
//   S.NOTE(flag, text, who)   add an entry to Alan's notebook ('Things I know') or Inês's folder (who: 'ines'), shown when F()[flag]
//   S.DEDUCE(a, b, result)    two entry flags that, put together on the notebook page, set result flag (and its NOTE)
//   S.NAPKIN                  { bell: [[flag, text]], salves: [[flag, name]], kreyol: [[flag, name]] } (shown from F().napkin)
//   S.HINT(when, parrotLine, directLine)   the parrot's hint ladder (first true wins; three clicks give directLine)
//   S.pulse(level)            the heartbeat icon: 0 hidden, 1..5 louder and faster
//   S.PINS                    the hub map's pins (rooms.js), each { id, x, y, text, open: () => bool, go }
// The systems (cutscene cards, deaths and rewinds, timed choices, the rhythm, the chart) are in systems.js.
(function () {
  const G = window.Game;
  const F = () => G.flags;
  const say = async (...ids) => { for (const id of ids) await G.says(id); };
  const S = window.S = { G, F, say, ROOMS: {}, LINE_POSE: {}, START: {}, PREVIEW: {}, SOLVE: {}, ALIVE: {}, ALIVE_FG: {} };
  G.sayChoice = id => say(id);
  S.T = ms => G.wait(window.FAST ? 20 : ms);
  S.sfx = (...a) => { try { Sound.sfx(...a); } catch (e) { /* no sound */ } };
  S.once = (flag, fn) => async (...a) => { if (F()[flag]) return; F()[flag] = true; await fn(...a); };
  S.chat = (flag, first, again) => () => F()[flag] ? say(...[].concat(again)) : (F()[flag] = true, say(...[].concat(first)));
  S.give = (id, silent) => G.giveItem(id, silent);
  S.take = id => G.takeItem(id);
  S.has = id => G.has(id);
  S.who = () => (G.player && G.player.speaker) || 'alan';   // who the player is: 'alan', 'ines' or 'catalina'
  S.pick = (alan, ines) => S.who() === 'ines' ? ines : alan;

  // ---------------------------------------------------------------- the cast
  // The walkers (the user, 2026-11-04): Game II's Alan in his vest, with his Ludo walk cycles; Game II's Vasco; Game I's
  // Inês with her two-step walk. Everyone else stands on their approved Game III front (art/designs/<id>_g3_front.png,
  // cut by scripts/import_assets.py) and glides: no animation yet.
  const LU = window.LUDO || {};
  const lu = n => (LU[n] ? LU[n].frames : null);
  const alan = { idle: ['alanv_side_k'], talk: ['alanv_side_k'], front: 'alanv_front_k', back: 'alanv_back_k', walk: ['alanv_side_k'], poses: {} };
  if (LU.alanv_walk_side) Object.assign(alan, {
    walk: lu('alanv_walk_side'), walkStep: LU.alanv_walk_side.step,
    frontWalk: lu('alanv_walk_front'), frontStep: (LU.alanv_walk_front || {}).step,
    backWalk: lu('alanv_walk_back'), backStep: (LU.alanv_walk_back || {}).step });
  const st = (k, scale) => ({ scale: scale || 1, frames: { idle: [k], talk: [k], walk: [k] } });
  const g3 = (id, scale) => st(id + '_g3', scale);
  S.CHARS = {
    alan: { scale: 1, frames: alan },
    vasco: { scale: 1, frames: { idle: ['vascor_side_k'], talk: ['vascor_side_k'], walk: ['vascor_side_k'], front: 'vascor_front_k', back: 'vascos_back_k', poses: {} } },
    ines: { scale: 0.93, frames: { idle: ['ines', 'ines_idle2'], talk: ['ines_talk', 'ines_talk2'], walk: ['ines_walk1', 'ines_walk2'],
      front: 'ines_front', back: 'ines_back', frontWalk: ['ines_front_walk1', 'ines_front', 'ines_front_walk2', 'ines_front'],
      backWalk: ['ines_back_walk1', 'ines_back', 'ines_back_walk2', 'ines_back'], poses: {} } },
    // 1586
    catalina: g3('catalina', 0.92), anton: g3('anton', 1.0), juana: g3('juana', 0.8), tome: g3('tome', 0.82), wolofboy: g3('wolofboy', 0.66),
    biafara: g3('biafara', 0.92), millbrothers: st('millbrothers_g3', 1.0), fishseller: g3('fishseller', 0.9),
    // 1996
    bishop: g3('bishop', 1.03), moncho: g3('moncho', 0.98), yolande: g3('yolande', 0.9), tobias: g3('tobias', 0.84), lilo: g3('lilo', 0.7),
    fello: g3('fello', 1.02), batista: g3('batista', 0.98), mireya: g3('mireya', 0.86), nando: g3('nando', 0.95), lalo: g3('lalo', 0.94),
    yunior: g3('yunior', 0.94), ulises: g3('ulises', 0.95), peralta: g3('peralta', 0.93), ledesma: g3('ledesma', 1.0), secretary: g3('secretary', 0.9),
    faustino: g3('faustino', 0.96), ramon: g3('ramon', 1.04), sisters: st('sisters_g3', 0.88), dario: g3('dario', 0.96), eddy: g3('eddy', 0.97),
  };
  window.FAIL_BY_CHAR = {};

  // ---------------------------------------------------------------- the player's figure, and the two pockets
  // Alan and Inês keep their own objects; documents (S.DOCS) go with both. Catalina has her own, in 1586.
  S.DOCS = new Set(['index_cards', 'crest_paper', 'patrimonio_sacro', 'welcome_fax', 'archive_copies', 'napkin', 'tata_notebook', 'dossier', 'custody_letter', 'lilo_address', 'lalo_note', 'notebook', 'folder']);
  function become(id) {
    const p = G.player, f = F(), cur = S.who();
    if (cur === id) return;
    f.pockets = f.pockets || {};
    const inv = G.state.inv.slice();
    f.pockets[cur] = inv.filter(k => !S.DOCS.has(k));
    const docs = inv.filter(k => S.DOCS.has(k));
    const mine = (f.pockets[id] || []).filter(k => !S.DOCS.has(k));
    G.state.inv = (id === 'catalina' || cur === 'catalina') ? mine : mine.concat(docs);
    // the notebook is Alan's, the folder Inês's: each shows the shared entries in their own hand
    G.state.inv = G.state.inv.filter(k => k !== 'notebook' && k !== 'folder');
    if (id === 'alan') G.state.inv.unshift('notebook'); if (id === 'ines') G.state.inv.unshift('folder');
    G.renderInv();
    p.ch = id; p.speaker = id === 'alan' ? null : id; p.pose = null; f.as = id;
  }
  S.becomeInes = () => become('ines');
  S.becomeAlan = () => become('alan');
  S.becomeCatalina = () => become('catalina');
  S.restorePlayer = () => { const a = F().as; if (a && a !== 'alan') { G.player.ch = a; G.player.speaker = a; } };
  // the page-turn with the napkin between the halves (bible: "Control switches at fixed points")
  S.switchTo = async function (id, room, entry, pos) {
    await G.fade(true);
    await G.card(id === 'ines' ? 'INÊS' : 'ALAN', id === 'ines' ? 'The other half of the napkin' : 'The streets', 2200);
    if (id === 'ines') S.becomeInes(); else S.becomeAlan();
    if (room) await G.goRoom(room, entry || null, { instant: true, noEnter: false, pos });
    await G.fade(false);
  };

  // ---------------------------------------------------------------- items
  window.PAINTED_ICONS = ['index_cards', 'crest_paper', 'patrimonio_sacro', 'welcome_fax', 'coin_1586', 'dulce_de_coco', 'rum', 'linen_jacket',
    'compass', 'archive_copies', 'wax_seal', 'tata_notebook', 'napkin', 'lalo_note', 'goatskin', 'guava_pegs', 'stmichael_candles', 'tijean_boat',
    'car_keys', 'chalk', 'alan_notebook', 'shoes', 'lilo_address', 'dossier', 'custody_letter', 'drum'];
  window.ICON_LABELS = { folder: 'Inês\'s folder', kitchen_paper: 'Kitchen paper', maias: 'Os Maias, vol. 2', bill: 'Electricity bill', postcard: 'Postcard',
    tally: 'Tally stick', blanket: 'Cradle blanket', linen: 'Canons\' linen', gourd: 'Gourd', drums1586: 'Drums', veve_sketch: 'Vèvè sketch', towel: 'Towel',
    key4: 'Room 4 key', concealer: 'Concealer', scarf: 'Pink scarf', cigar: 'Cigar', dollars: 'Dollars', tide_fact: 'Tide note', carbon: '1930 carbon',
    letter1930: '1930 letter', note1586: '1586 note', pin_map: 'Pin map', ash: 'Ash' };
  S.ITEMS = {
    notebook: { name: 'Alan\'s notebook', icon: 'alan_notebook', read: () => S.readNotebook(), look: () => S.readNotebook() },
    folder: { name: 'Inês\'s document folder', icon: 'archive_copies', read: () => S.readNotebook(), look: () => S.readNotebook() },
    napkin: { name: 'The napkin', read: () => S.readNapkin(), look: () => S.readNapkin() },
  };
  // a day's file adds its items: S.item(id, def) (def.name, def.look; icon defaults to the id)
  S.item = (id, def) => { S.ITEMS[id] = Object.assign(S.ITEMS[id] || {}, def); if (window.Engine && window.Engine.ITEMS) window.Engine.ITEMS[id] = S.ITEMS[id]; };

  // ---------------------------------------------------------------- days
  S.DAYS = [
    ['PROLOGUE', 'Santo Domingo, 1586'],
    ['LISBON', 'Thursday 29 August 1996'],
    ['WEDNESDAY', '4 September 1996 · The Primada'], ['THURSDAY', '5 September · San Antón'], ['FRIDAY', '6 September · The Drowned'],
    ['SATURDAY', '7 September · The Other Half'], ['SUNDAY', '8 September · The Horse'], ['MONDAY', '9 September · The Crate'],
    ['TUESDAY', '10 September · The Rock'], ['EPILOGUE', 'Lisbon and Santo Domingo, 1996–1997'],
  ];
  S.dayName = () => ['1586', 'Thursday 29 August', 'Wednesday 4 September', 'Thursday 5 September', 'Friday 6 September', 'Saturday 7 September',
    'Sunday 8 September', 'Monday 9 September', 'Tuesday 10 September', '1997'][F().ch || 0];
  S.day = async function (n, line) {
    F().ch = n; if (G.room) G.refreshNpcs();
    S.sfx('chapter_toll', 0.3);
    await G.card(S.DAYS[n][0], S.DAYS[n][1], 3200);
    if (line) await G.say(line, { offscreen: true });
    G.autosave();
  };

  // ---------------------------------------------------------------- rooms: defined once, added to by the days
  S.room = (def) => Object.assign({ parallax: false, walk: [[0, 560], [1280, 560], [1280, 716], [0, 716]], scale: [560, 360, 716, 450], floor: 'stone',
    light: { ambient: 'rgb(235,228,215)', base: 0.95 }, entries: { default: [640, 660, 'e'] }, hotspots: [], npcs: [] }, def);
  S.spot = (rid, h) => { const r = S.ROOMS[rid]; if (!r) throw new Error('no room ' + rid); (r.hotspots = r.hotspots || []).push(h); return h; };
  S.person = (rid, n) => { const r = S.ROOMS[rid]; if (!r) throw new Error('no room ' + rid); (r.npcs = r.npcs || []).push(n); return n; };
  S.ENTER = {};
  S.onEnter = (rid, fn) => { (S.ENTER[rid] = S.ENTER[rid] || []).push(fn); };
  // the way out to the hub map, as a hotspot
  S.toMap = (rect, at) => ({ name: 'To the city', rect, at, exit: 'hub', kind: 'exit', look: () => say(S.who() === 'ines' ? 'ines_look_tomap' : 'alan_look_tomap'),
    locked: () => !!S.mapLock && !!S.mapLock(), lockedLine: () => S.mapLock && S.mapLock() });

  // ---------------------------------------------------------------- the notebook (Alan) and the folder (Inês): entries and deductions
  // S.NOTES: [flag, text, who]; an entry is shown once its flag is set. Clicking two entries tests them against S.DEDUCTIONS.
  S.NOTES = []; S.DEDUCTIONS = [];
  S.NOTE = (flag, text, who) => S.NOTES.push([flag, text, who || 'alan']);
  S.DEDUCE = (a, b, result, opts) => S.DEDUCTIONS.push(Object.assign({ a, b, result }, opts || {}));
  const PAPER = 'close:paper_aged';
  S.readNotebook = async function () {
    const f = F(), mine = S.who() === 'ines' ? 'ines' : 'alan';
    const shown = S.NOTES.filter(n => f[n[0]]);
    const ded = new Set(S.DEDUCTIONS.map(d => d.result));
    const head = mine === 'ines' ? 'Inês\'s folder' : 'Things I know';
    const pick = [];
    const page = {
      img: PAPER, cls: 'doc-hand',
      html: `<h3>${head}</h3><p style="font-size:.8em;opacity:.75">Click two entries to see if they connect.</p><div class="nb-list"></div>`,
      mount(el, redraw) {
        const list = el.querySelector('.nb-list'); list.innerHTML = '';
        if (!shown.length) list.innerHTML = '<p><i>Nothing yet. Santo Domingo, September 1996.</i></p>';
        shown.forEach(n => {
          const b = document.createElement('span'); b.className = 'nb-entry' + (ded.has(n[0]) ? ' ded' : '');
          b.innerHTML = (n[2] === 'ines' ? '✎ ' : '') + n[1];
          b.onclick = async e => {
            e.stopPropagation();
            if (pick.includes(n[0])) { pick.splice(pick.indexOf(n[0]), 1); b.classList.remove('sel'); return; }
            pick.push(n[0]); b.classList.add('sel');
            if (pick.length === 2) {
              const [x, y] = pick, d = S.DEDUCTIONS.find(d => (d.a === x && d.b === y) || (d.a === y && d.b === x));
              pick.length = 0;
              if (d && !f[d.result] && (!d.when || d.when())) {
                S.closeCloseup(); await S.tryDeduce(x, y);
              } else if (d && f[d.result]) { list.querySelectorAll('.sel').forEach(s => s.classList.remove('sel')); }
              else { list.querySelectorAll('.sel').forEach(s => s.classList.remove('sel')); S.closeCloseup(); await S.tryDeduce(x, y); }
            }
          };
          list.appendChild(b);
        });
      },
    };
    const todo = S.hintText();
    const pages = [page];
    if (todo) pages.push({ img: PAPER, cls: 'doc-hand', html: `<h3>Next</h3><p><i>${todo}</i></p>` });
    if (f.napkin) pages.push(S.napkinPage());
    await G.closeup(pages);
  };
  S.closeCloseup = () => { const c = document.getElementById('closeup'); if (c && !c.classList.contains('hidden')) c.querySelector('.x').click(); };
  // tests a pair (also the test harness's way in): a true pair sets its result flag and runs its scene
  S.tryDeduce = async function (x, y) {
    const f = F(), mine = S.who() === 'ines' ? 'ines' : 'alan';
    const d = S.DEDUCTIONS.find(d => (d.a === x && d.b === y) || (d.a === y && d.b === x));
    if (!d || !f[x] || !f[y] || (d.when && !d.when())) { await say(mine + '_ded_no'); return false; }
    if (f[d.result]) return true;
    f[d.result] = true; S.sfx('pencil_scribble', 0.6);
    await say(d.line || (mine + '_ded_yes'));
    if (d.run) await d.run();
    return true;
  };
  // the napkin: BELL | SHORE (Salves | Kreyòl)
  S.NAPKIN = { bell: [], salves: [], kreyol: [] };
  S.napkinPage = () => {
    const f = F(), col = a => a.filter(x => f[x[0]]).map(x => `<div>${x[1]}</div>`).join('') || '<div style="opacity:.5">…</div>';
    return { img: PAPER, cls: 'doc-hand', html: `<h3>The napkin</h3><div style="display:flex;gap:6%;text-align:left">
      <div style="flex:1"><b>1. BELL</b>${col(S.NAPKIN.bell)}</div><div style="border-left:2px dashed #8a6a3a"></div>
      <div style="flex:1.4"><b>2. SHORE</b><div style="display:flex;gap:6%"><div style="flex:1"><i>Salves</i>${col(S.NAPKIN.salves)}</div><div style="flex:1"><i>Kreyòl</i>${col(S.NAPKIN.kreyol)}</div></div></div></div>` };
  };
  S.readNapkin = () => G.closeup([S.napkinPage()]);

  // ---------------------------------------------------------------- the parrot: the hint ladder
  S.HINTS = [];
  S.HINT = (when, parrotLine, directLine) => S.HINTS.push({ when, parrotLine, directLine });
  S.hintNow = () => { const f = F(); return S.HINTS.find(h => { try { return h.when(f); } catch (e) { return false; } }); };
  S.hintText = () => { const h = S.hintNow(), L = h && window.LINES[h.directLine]; return L ? L[1].replace(/\[[^\]]*\]\s*/g, '') : ''; };
  let clicks = 0, lastHint = null;
  S.parrot = async function () {
    if (window.Engine.busy || window.Engine.cutscene) return;
    const f = F(), h = S.hintNow();
    if (h !== lastHint) { clicks = 0; lastHint = h; }
    clicks++;
    await G.busy(async () => {
      if (f.ch >= 7 && !f.parrot_back) { await say(h ? h.directLine : 'mireya_hint_none'); return; }   // (Monday on: Tobías's keys, the hint straight)
      if (!h) return say('parrot_squawk_' + (1 + (clicks % 3)), 'mireya_hint_none');
      if (clicks >= 3) { clicks = 0; return say(h.directLine); }
      return say(h.parrotLine || ('parrot_squawk_' + (1 + (clicks % 3))));
    });
  };
  {
    const b = document.getElementById('parrot-btn');
    if (b) b.addEventListener('click', e => { e.stopPropagation(); S.parrot(); });
    setInterval(() => {
      if (!b) return;
      const f = (G.flags || {}), on = f.ch >= 2 && f.ch <= 8 && !!(G.room && !G.room.noParrot);
      b.classList.toggle('on', on);
      b.textContent = f.ch >= 7 && !f.parrot_back ? '🗝' : '🦜';
      b.title = f.ch >= 7 && !f.parrot_back ? 'Tobías\'s keys (hints)' : 'The parrot (hints)';
    }, 400);
  }

  // ---------------------------------------------------------------- the heartbeat: three beats and a rest, the skip in the third
  S.pulse = lvl => { F().pulse = Math.max(0, Math.min(5, lvl)); };
  {
    const el = document.getElementById('pulse'), heart = el && el.querySelector('i');
    // beats at 0, 0.32, 0.78 (the skip: late), then a rest; a beat cycle of 1.6 s at level 1, 1.0 s at level 5
    const BEATS = [0, 0.2, 0.49];
    const tick = () => {
      requestAnimationFrame(tick);
      if (!el) return;
      const f = G.flags || {}, lvl = f.pulse || 0, on = lvl > 0 && S.who() === 'alan' && f.ch >= 2;
      el.classList.toggle('on', on);
      if (!on) return;
      const per = 1.75 - lvl * 0.15, t = (performance.now() / 1000) % per / per;
      let k = 0; for (const b of BEATS) { const d = t - b; if (d >= 0 && d < 0.09) k = Math.max(k, 1 - d / 0.09); }
      heart.style.transform = `scale(${0.8 + k * (0.25 + lvl * 0.04)})`;
      heart.style.opacity = 0.55 + k * 0.45;
    };
    tick();
  }
})();
