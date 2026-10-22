// Chapter III — Graça: Professor Bastos's flat (docs/bastos_level.md). Inês comes along. The objects of his
// collection go back with their books (the shelf close-up); the case opens; his lecture tapes play on the recorder
// (the threading riddle); the last reel, hidden in Iemanjá's boat, is his last morning. Done: bastos_done, which the
// shop's Chapter III end waits for.
(function () {
  const { G, F, say, ROOMS, joke, sfx } = window.S;
  const $ = s => document.querySelector(s);
  const ART = 'art/closeups/bastos/';

  // ---------------------------------------------------------------- the collection
  // each object with the book whose spine carries its motif; Inês reads the book, Alan answers (★ lines are jokes)
  const OBJECTS = [
    { k: 'canaria', name: 'Tara idol and pintadera · Gran Canaria', book: 'seal', read: ['ines_myth_canaria_1', 'ines_myth_canaria_2', 'ines_myth_canaria_3'], reply: 'alan_myth_canaria', joke: true },
    { k: 'ys', name: 'Bronze bell · Brittany', book: 'bell', read: ['ines_myth_ys'], reply: 'alan_myth_ys' },
    { k: 'ran', name: 'Net float and gold ring · Norway', book: 'net', read: ['ines_myth_ran', 'ines_myth_ran_2'], reply: 'alan_myth_ran', joke: true },
    { k: 'jewels', name: 'Tide jewels · Japan', book: 'jewels', read: ['ines_myth_jewels'], reply: 'alan_myth_jewels' },
    { k: 'gilgamesh', name: 'Clay tablet · Mesopotamia', book: 'boat', read: ['ines_myth_gilgamesh'], reply: 'alan_myth_gilgamesh', joke: true },
    { k: 'matsya', name: 'Matsya · India', book: 'fish', read: ['ines_myth_matsya'], reply: 'alan_myth_matsya', joke: true },
    { k: 'deucalion', name: 'Bronze trident · Greece', book: 'trident', read: ['ines_myth_deucalion', 'ines_myth_deucalion_2'], reply: 'alan_myth_deucalion', joke: true },
    { k: 'iemanja', name: 'Offering boat · Bahia', book: 'rose', read: ['ines_myth_iemanja', 'ines_myth_iemanja_2'], reply: 'alan_myth_iemanja' },
  ];
  // the books on the shelf, left to right (not in the objects' order), each spine with Bastos's drawn label
  const BOOKS = [
    { k: 'fish', title: 'Matsya Purana', c: '#5a3a28' }, { k: 'bell', title: 'La Ville d’Ys', c: '#2f4250' },
    { k: 'rose', title: 'Iemanjá', c: '#6a6f86' }, { k: 'seal', title: 'Canarii', c: '#7a4a2a' },
    { k: 'trident', title: 'Deukalion', c: '#3c4a33' }, { k: 'net', title: 'Rán', c: '#4b2f3a' },
    { k: 'boat', title: 'Gilgameš', c: '#6b5530' }, { k: 'jewels', title: 'Kanju Manju', c: '#283a3a' },
  ];
  // the spine labels, drawn in ink (viewBox 0 0 40 40)
  const MOTIF = {
    seal: '<circle cx="20" cy="20" r="14"/><path d="M20 8 L23 17 L32 20 L23 23 L20 32 L17 23 L8 20 L17 17 Z"/>',
    bell: '<path d="M13 28 Q13 12 20 10 Q27 12 27 28 Z"/><path d="M10 28 H30"/><circle cx="20" cy="31" r="2"/>',
    net: '<path d="M8 10 L32 30 M16 8 L34 23 M6 18 L26 34 M32 10 L8 30 M24 8 L6 23 M34 18 L14 34"/>',
    jewels: '<path d="M13 12 a6 6 0 1 1 0 12 q-4 2 -6 6 q0 -6 6 -6"/><path d="M27 14 a6 6 0 1 0 0 12 q4 2 6 6 q0 -6 -6 -6"/>',
    boat: '<path d="M6 25 Q20 33 34 25 Z"/><path d="M20 25 V8 L29 20 H20"/>',
    fish: '<path d="M8 20 Q18 10 28 20 Q18 30 8 20 Z"/><path d="M28 20 L34 14 V26 Z"/><circle cx="13" cy="19" r="1.4"/>',
    trident: '<path d="M20 34 V10 M12 9 V17 Q20 22 28 17 V9 M20 6 L17 11 M20 6 L23 11"/>',
    rose: '<circle cx="20" cy="15" r="6"/><path d="M17 15 q3 -4 6 0 q-3 4 -6 0"/><path d="M20 21 V34 M20 27 q-6 -1 -8 -5 M20 29 q5 -1 7 -4"/>',
  };
  const icon = k => `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${MOTIF[k]}</svg>`;
  const placed = () => F().bastos_m || (F().bastos_m = []);
  const allPlaced = () => OBJECTS.every(o => placed().includes(o.k));

  // ---------------------------------------------------------------- the shelf close-up
  // objects above, the books below; pick one of each. Resolves {obj, book}, {look: k} (a placed object), or null.
  const shelf = document.createElement('div');
  shelf.id = 'bshelf'; shelf.className = 'modal hidden';
  shelf.innerHTML = '<h2>Bastos’s collection</h2><p class="hint">Each object with its book: the drawings on the spines.</p>' +
    '<div class="objs"></div><div class="books"></div><div class="controls"><button class="cancel">Step back</button></div>';
  $('#closeup').before(shelf);
  S.openShelf = function () {
    return new Promise(resolve => {
      let selObj = null, selBook = null;
      const objs = shelf.querySelector('.objs'), books = shelf.querySelector('.books');
      const draw = () => {
        objs.innerHTML = OBJECTS.map(o => placed().includes(o.k) ? '' :
          `<button class="obj${selObj === o.k ? ' sel' : ''}" data-k="${o.k}" title="${o.name}" aria-label="${o.name}"><img src="${ART + o.k}.jpg" alt=""></button>`).join('');
        books.innerHTML = BOOKS.map(b => {
          const o = OBJECTS.find(x => x.book === b.k), on = o && placed().includes(o.k);
          return `<div class="slot">${on ? `<button class="onshelf" data-k="${o.k}" title="${o.name}" aria-label="${o.name}"><img src="${ART + o.k}.jpg" alt=""></button>` : '<span class="gap"></span>'}` +
            `<button class="spine${selBook === b.k ? ' sel' : ''}" data-b="${b.k}" style="background-color:${b.c}" title="A book: ${b.title}" aria-label="A book: ${b.title}">${icon(b.k)}<span>${b.title}</span></button></div>`;
        }).join('');
      };
      const finish = r => { G.showModal('bshelf', false); shelf.onclick = null; resolve(r); };
      shelf.onclick = e => {
        const t = e.target.closest('button'); if (!t) return;
        e.stopPropagation();
        if (t.classList.contains('cancel')) return finish(null);
        if (t.classList.contains('onshelf')) return finish({ look: t.dataset.k });
        if (t.classList.contains('obj')) selObj = selObj === t.dataset.k ? null : t.dataset.k;
        if (t.classList.contains('spine')) selBook = selBook === t.dataset.b ? null : t.dataset.b;
        sfx(t.classList.contains('spine') ? 'book_take' : 'ui_click', 0.5);
        if (selObj && selBook) return finish({ obj: selObj, book: selBook });
        draw();
      };
      draw(); G.showModal('bshelf', true);
    });
  };
  let wrongN = 0;
  S.bastosShelves = async function () {
    if (!F().bastos_shelves) {
      F().bastos_shelves = true;
      await say('narr_look_bastos_shelves'); await joke('alan_bastos_mess');
      await say('ines_bastos_labels'); await joke('alan_bastos_order');
    }
    for (;;) {
      const r = await S.openShelf();
      if (!r) return;
      if (r.look) { await S.bastosLookPlaced(r.look); if (F().bastos_reel_found && !F().bastos_done) return; continue; }
      const o = OBJECTS.find(x => x.k === r.obj);
      if (o.book !== r.book) { await say('alan_match_wrong_' + (wrongN++ % 3 + 1)); continue; }
      placed().push(o.k); sfx('stone_clack', 0.4);
      await say(...o.read);
      await (o.joke ? joke(o.reply) : say(o.reply));
      if (allPlaced()) return S.bastosCaseOpens();
    }
  };
  // a placed object looked at again: the boat holds the last reel, once the empty box has been seen
  S.bastosLookPlaced = async function (k) {
    if (k === 'iemanja' && F().bastos_box_seen && !F().bastos_reel_found) {
      F().bastos_reel_found = true; sfx('paper_take', 0.6);
      await say('alan_tape_found');
      return;
    }
    const o = OBJECTS.find(x => x.k === k);
    await say(o.read[0]);
  };
  S.bastosCaseOpens = async function () {
    if (F().bastos_case_open) return;
    F().bastos_case_open = true;
    sfx('lamp_click', 0.7);
    await say('narr_bastos_case', 'ines_bastos_card'); await joke('alan_bastos_card');
    S.sea('debt');
  };

  // ---------------------------------------------------------------- the recorder close-up (the threading riddle)
  // the reel from the rack (or the last reel, from the boat) onto the left spindle, the tape through the head, onto
  // the take-up reel on the right, then Play. Positions are % of the painting (close_recorder, 1536x864).
  const SPOTS = {
    rack: [60, 4, 33, 42, 'The rack of reels'], left: [16, 24, 15, 24, 'Left spindle'], head: [26, 38, 17, 15, 'Tape head'],
    right: [35, 19, 15, 22, 'Right spindle'], play: [25, 58, 18, 9, 'Play'], box: [55, 55, 26, 40, 'The empty box'],
  };
  const rec = document.createElement('div');
  rec.id = 'brec'; rec.className = 'modal hidden';
  rec.innerHTML = '<div class="deck"><img src="art/closeups/close_recorder.jpg" alt="">' +
    '<svg class="tape" viewBox="0 0 100 56.25" preserveAspectRatio="none"><circle class="r1" cx="23.2" cy="20.4" r="7"/><circle class="r2" cx="42.6" cy="16.4" r="6.4"/>' +
    '<path class="t" d="M23.2 27.4 Q28 32 33 31 L38 31 Q44 28 42.6 22.8"/></svg>' +
    Object.entries(SPOTS).map(([k, [x, y, w, h, n]]) => `<button class="spot" data-s="${k}" title="${n}" aria-label="${n}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></button>`).join('') +
    '</div><p class="state"></p><div class="controls"><button class="cancel">Step back</button></div>';
  $('#closeup').before(rec);
  // what the player has done this time at the machine (not saved: stepping back takes the reel off again)
  S.openRecorder = function () {
    return new Promise(resolve => {
      let hand = null, onLeft = null, head = false, right = false, wrong = 0;
      const lastReel = () => F().bastos_reel_found && !F().bastos_done;
      const show = msg => {
        rec.querySelector('.r1').style.display = onLeft ? '' : 'none';
        rec.querySelector('.t').style.display = right ? '' : head ? '' : 'none';
        rec.querySelector('.t').classList.toggle('half', head && !right);
        rec.querySelector('.state').textContent = msg || (hand ? (hand === 'last' ? 'The last reel, in your hand.' : 'A reel in your hand: “Lição um”.') :
          onLeft && !head ? 'The reel is on. Now the tape.' : head && !right ? 'Under the head, round the roller…' : right ? 'Threaded.' : 'Nothing threaded.');
      };
      const finish = r => { G.showModal('brec', false); rec.onclick = null; resolve(r); };
      const nope = n => { wrong++; finish({ wrong: n }); };
      rec.onclick = e => {
        const t = e.target.closest('button'); if (!t) return;
        e.stopPropagation();
        if (t.classList.contains('cancel')) return finish(null);
        const s = t.dataset.s; sfx('relay_click', 0.5);
        if (s === 'box') return finish({ box: true });
        if (s === 'rack') {
          if (onLeft || hand) return show();
          if (lastReel()) { hand = 'last'; return show(); }
          if (F().bastos_lessons) return show('The lessons. Heard them. The 27th’s box is empty.');
          hand = 'lesson'; return show();
        }
        if (s === 'left') {
          if (!hand && lastReel() && !onLeft) hand = 'last'; // the last reel is already in his pocket
          if (!hand && !onLeft) return nope(1);
          if (hand) { onLeft = hand; hand = null; }
          return show();
        }
        if (s === 'head') { if (!onLeft) return nope(1); head = true; return show(); }
        if (s === 'right') { if (!onLeft) return nope(1); if (!head) return nope(2); right = true; return show(); }
        if (s === 'play') { if (!onLeft) return nope(F().bastos_threaded ? 1 : 3); if (!head || !right) return nope(3); return finish({ play: onLeft }); }
      };
      show(); G.showModal('brec', true);
    });
  };
  S.bastosRecorder = async function () {
    if (!F().bastos_case_open) return say(F().bastos_case_seen ? 'ines_bastos_case_locked' : (F().bastos_case_seen = true, 'narr_look_bastos_case'));
    if (!F().bastos_rec_seen) { F().bastos_rec_seen = true; await say('narr_look_recorder'); }
    if (F().bastos_done) return S.done();
    const r = await S.openRecorder();
    if (!r) return;
    if (r.wrong) return say('alan_thread_wrong_' + r.wrong);
    if (r.box) {
      F().bastos_box_seen = true;
      await say('narr_look_empty_box');
      if (F().bastos_lessons && !F().bastos_reel_found) await say('ines_hint_reel');
      return;
    }
    if (!F().bastos_threaded) { F().bastos_threaded = true; await joke('alan_threaded'); }
    if (r.play === 'last') return S.bastosLastTape();
    return S.bastosLessons();
  };
  // while a tape plays: the recorder with both reels on (close_recorder_reels), the reels turning. Each reel is
  // painted as an ellipse (seen from a little above): un-squashed to a circle, turned, squashed back; the
  // spindle in the middle stays put. Pixel positions in the painting (1536x864): centre, radii.
  const REELS = [[326, 302, 140, 98, 1.0], [652, 240, 132, 92, 1.25]]; // the full reel turns slower than the take-up
  const reels = (g, t, im) => {
    for (const [cx, cy, rx, ry, sp] of REELS) {
      const k = ry / rx, a = -t * 2.2 * sp;
      g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.clip();
      g.translate(cx, cy); g.scale(1, k); g.rotate(a); g.scale(1, 1 / k); g.translate(-cx, -cy);
      g.drawImage(im, 0, 0); g.restore();
      g.save(); g.beginPath(); g.ellipse(cx, cy - 6, 26, 30, 0, 0, 7); g.clip(); g.drawImage(im, 0, 0); g.restore(); // the spindle
    }
  };
  const onTape = (...ids) => G.showStill('close_recorder_reels', async () => {
    for (const id of ids) await G.say(id, { offscreen: true, label: 'Prof. Bastos, on tape' });
  }, { zoom: [1.0, 1.06], pan: [[0.32, 0.4], [0.3, 0.42]], over: reels });
  S.bastosLessons = async function () {
    await say('alan_tapes_play');
    sfx('relay_click', 0.7);
    await onTape('bastos_tape_1', 'bastos_tape_2', 'bastos_tape_3');
    S.sea('baptism');
    await onTape('bastos_tape_4', 'bastos_tape_5');
    S.sea('summons'); S.sea('renounce');
    F().bastos_lessons = true;
    await say('ines_tape_wave', 'alan_tapes_after', 'ines_tape_missing');
  };
  S.bastosLastTape = async function () {
    sfx('relay_click', 0.7);
    await onTape('bastos_last_1', 'bastos_last_2', 'bastos_last_3', 'bastos_last_4');
    await G.say('narr_tape_end', { offscreen: true });
    await say('alan_after_tape', 'ines_after_tape');
    F().bastos_done = true; S.sea('collector');
    await say('ines_bastos_leave', 'alan_bastos_leave');
  };

  // ---------------------------------------------------------------- the notebook: "The Sea"
  const SEA = [
    ['debt', 'Every people that lived by the sea kept a debt to it. Bells were how Europe paid the instalments. (Bastos)'],
    ['baptism', 'The Brotherhood baptised the bell in the sea to call back their drowned. The sea answered by coming itself: the three waves of 1 November 1755. Not the dead. It came to collect more.'],
    ['summons', 'A bell baptised in the sea is a summons, not a shield. The godparent’s family commands the water. Whoever rings it again, hoping for the dead, gets the same answer.'],
    ['renounce', 'A baptism is undone by renouncing. The bell itself must take it back.'],
    ['collector', 'A “collector” gave Bastos a tile the morning he died. He hid his last tape from him in Iemanjá’s boat. His last words: find the Sanches boy. The bell must say no.'],
  ];
  S.sea = function (key) {
    const L = F().sea || (F().sea = []);
    if (L.includes(key)) return;
    L.push(key); G.toast('Notebook updated'); sfx('page');
  };
  S.seaPages = () => (F().sea || []).length ? [{ img: 'close:paper_aged', cls: 'doc-hand', html: `<p style="font-family:'IM Fell English',serif;text-align:center">The Sea</p>` +
    SEA.filter(([k]) => F().sea.includes(k)).map(([, t]) => `<p style="font-size:0.85em">· ${t}</p>`).join('') }] : [];

  // ---------------------------------------------------------------- Inês, in the flat and in the shop
  S.bastosHint = function () {
    const f = F();
    if (!allPlaced()) return 'ines_hint_shelves';
    if (!f.bastos_lessons) return 'ines_hint_thread';
    if (!f.bastos_box_seen) return 'ines_tape_missing';
    if (!f.bastos_reel_found) return 'ines_hint_reel';
    if (!f.bastos_done) return 'ines_hint_play';
    return 'ines_after_tape';
  };
  // the second name on the list: Inês knows it, after the decode (the art must be in the game)
  S.bastosUnlockDue = () => F().ch === 3 && F().decoded && !F().bastos_known && G.hasArt('bg:bastos');
  S.bastosUnlock = async function () {
    F().bastos_known = true;
    await say('ines_bastos_1', 'alan_bastos_1', 'ines_bastos_2'); await joke('alan_bastos_2');
  };
  // the chapter can't close in the shop until his tape is heard (saves from before the flat: no art, no wait)
  S.bastosOpen = () => !G.hasArt('bg:bastos') || !!F().bastos_done;
  const shopEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    const r = shopEnter ? await shopEnter.call(this, entry) : undefined;
    if (S.bastosUnlockDue() && G.room === ROOMS.shop && G.npc('ines')) await S.bastosUnlock();
    return r;
  };

  // ================================================================ GRAÇA · PROF. BASTOS
  ROOMS.bastos = {
    name: 'Graça · Prof. Bastos', bg: 'bastos', music: 'se_exhibition', ambience: 'shop', floor: 'wood',
    fog: 0.08, fogRGB: '226,228,230',
    // the floor in front of the desk, the case and the armchair, round the side table and short of the sofa
    walk: [[60, 640], [160, 560], [300, 512], [570, 512], [575, 430], [890, 430], [935, 470], [955, 565], [1085, 575], [1175, 640], [1180, 716], [40, 716]],
    scale: [430, 250, 716, 430],
    light: { ambient: 'rgb(214,214,212)', base: 0.88, rim: 'rgba(235,240,245,0.2)', rimSide: 1 },
    lights: [
      { x: 478, y: 160, rgb: '232,236,242', power: 0.26, reach: 1100, rim: 0.4, shadow: 0.4, floor: [480, 520], height: 700 },
      { x: 975, y: 160, rgb: '232,236,242', power: 0.2, reach: 900, rim: 0.3, floor: [975, 520], height: 700, shadow: false },
    ],
    entries: { default: [640, 690, 'n'], map: [640, 690, 'n'] },
    animBack(g, t) {
      S.windowFog(g, t, [400, 45, 160, 232], '236,238,240', 0.16); // the fog moving past both windows
      S.windowFog(g, t + 40, [912, 45, 132, 232], '236,238,240', 0.16);
      FX.sway(g, G.bgImage(), [1060, 70, 130, 250], t * 0.4, 0.5, 0.6); // the tall plant by the window, in the draught
    },
    anim(g, t) { FX.motes(g, t, 380, 60, 700, 420, 22, '240,238,232'); },
    npcs: [
      { id: 'ines', x: 840, y: 600, dir: 'w', name: 'Inês', look: 'narr_look_ines', talk: () => say(S.bastosHint()),
        items: { any: 'alan_fail_ines_item' } },
    ],
    hotspots: [
      { name: 'Bookshelves', rect: [0, 0, 322, 540], at: [260, 560], face: 'w', look: () => S.bastosShelves(), use: () => S.bastosShelves() },
      { name: 'World map', rect: [598, 60, 258, 180], at: [720, 450], face: 'n',
        look: async () => { await say('narr_look_bastos_map'); await joke('alan_look_bastos_map'); } },
      { name: 'Window', rect: [395, 40, 172, 245], at: [480, 520], face: 'n', look: 'narr_look_bastos_window' },
      { name: 'Window', rect: [905, 40, 145, 245], at: [900, 450], face: 'n', look: 'narr_look_bastos_window' },
      { name: 'Display case', rect: [630, 262, 170, 150], at: [715, 445], face: 'n',
        look: () => F().bastos_case_open ? S.bastosRecorder() : say('narr_look_bastos_case'),
        use: () => S.bastosRecorder(), take: () => S.bastosRecorder() },
      { name: 'Leave the flat', rect: [0, 690, 1280, 30], at: [640, 712], exit: 'map', entry: 'bastos' },
    ],
    async enter() {
      if (!F().bastos_entered) {
        F().bastos_entered = true;
        await G.say('narr_bastos_arrive', { offscreen: true });
        await joke('alan_bastos_door');
        await say('ines_bastos_smell');
      }
    },
  };
})();
