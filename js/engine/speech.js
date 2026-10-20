// Speech and dialogue: captions over the speaker (or in the narration box), one voice at a time,
// speakers facing each other, sung lyrics with timed captions, the dialogue menu.
(function () {
  const E = window.Engine;
  const { W, H, wrap, speechEl, narrEl, dialogEl, wait } = E;

  const COLORS = { alan: '#ffe2a0', ines: '#ffab9a', rui: '#a8d4ff', amalia: '#e2b0ff', tomas: '#cfeab8', lacerda: '#ff7d6a', celeste: '#ffd0a0', ze: '#9fd8ff', abilio: '#f0e68c', lino: '#f2c79a', phone: '#b9c9ff', guitar: '#d8c0a0', cards: '#d9c8a8', fish: '#ffb8b8', mender1: '#c8d8c0', mender2: '#b8d0b0', nun: '#e0e0f0', washer1: '#f0c8b0', washer2: '#d8c0e0', laundry: '#e8d0b8', bench: '#d8c8a8', narr: '#eee6d6' };
  const NAMES = { alan: 'Alan', ines: 'Inês', rui: 'Rui', amalia: 'Amália', tomas: 'Father Tomás', lacerda: 'Lacerda', celeste: 'Celeste', ze: 'Zé', abilio: 'Abílio', lino: 'Lino', phone: 'Officer Teixeira', guitar: 'Duarte', cards: 'Card player', fish: 'Fishwife', mender1: 'Old fisherman', mender2: 'Fisherman', nun: 'Sister', washer1: 'Washerwoman', washer2: 'Graça', laundry: 'Woman with the washing', bench: 'Senhor Armando', vasco: 'Dr. Teles', narr: '' };

  // ---------------------------------------------------------------- speech
  function actorFor(who) {
    if (who === 'alan') return E.player.visible ? E.player : null;
    return E.npcs.find(a => (a.id === who || a.id === 'npc_' + who) && a.visible)
      // someone painted into Alan's pair frame speaks from the pair (Game.pairSpeaker: pose -> speaker id)
      || (E.player.visible && E.player.pose && ((E.player.pairWho && (E.player.pairWho === who || E.player.pairWho === 'npc_' + who))
        || (window.Game.pairSpeaker && window.Game.pairSpeaker(E.player.pose) === who)) ? E.player : null);
  }
  // Only the people who move around the rooms with Alan turn to follow him (Alan, Inês, Vasco, or a
  // def with turns: true). Everyone else keeps the facing their room gives them: no flipping back and
  // forth; Alan comes to the side they already face (see approach).
  const TURNERS = new Set(['ines', 'vasco']);
  const turnsFreely = a => a === E.player || TURNERS.has(a.id) || !!(a.def && a.def.turns);
  const canTurn = a => a && a.visible && !a.walking && !a.pose && (a.dir === 'e' || a.dir === 'w') && !(a.def && (a.def.fixedDir || a.def.ambient)) && turnsFreely(a);
  // Speakers face each other: an NPC turns to Alan when it speaks, and Alan turns
  // to whoever he is talking with (the last NPC who spoke, else the nearest one).
  // the names Alan calls people by, for addressee(): a name standing alone ("Inês. Catch.", "Thank you, Father.")
  const CALLED = { ines: ['Inês'], vasco: ['Vasco', 'Dr. Teles'], rui: ['Rui'], ze: ['Zé'], celeste: ['Celeste'], amalia: ['Amália'], lacerda: ['Lacerda', 'Senhor Lacerda'],
    guitar: ['Duarte'], phone: ['Teixeira'], abilio: ['Abílio'], lino: ['Lino'], tomas: ['Father', 'Father Tomás'] };
  const visibleNpc = who => E.npcs.find(a => (a.id === who || a.id === 'npc_' + who) && a.visible);
  function addressee(id) {
    if (!id) return null;
    const to = window.Game.lineTo && window.Game.lineTo(id);
    if (to === false) return 'keep';
    if (to) return visibleNpc(to) || null;
    const L = LINES[id], text = L ? strip(L[1]) : '';
    for (const [who, names] of Object.entries(CALLED))
      for (const n of names) if (new RegExp('(^|[,.!?…]\\s*)' + n + '(?=[,.!?…])').test(text)) { const a = visibleNpc(who); if (a) return a; }
    return null;
  }
  function faceEachOther(actor, id) {
    if (!E.player.visible) return;
    if (actor && actor !== E.player) {
      E.lastPartner = actor;
      if (canTurn(actor) && Math.abs(E.player.x - actor.x) > 30) actor.dir = E.player.x > actor.x ? 'e' : 'w';
      if (canTurn(E.player) || (E.player.visible && !E.player.walking && !E.player.pose && (E.player.dir === 'n' || E.player.dir === 's'))) E.player.dir = actor.x > E.player.x ? 'e' : 'w';
    } else if (actor === E.player) {
      // whoever he's addressing: the script's say-so (Game.lineTo), or someone on screen he calls by name; else the last to speak to him
      let other = addressee(id);
      if (other === 'keep') return;
      if (other) E.lastPartner = other;
      else other = E.lastPartner && E.lastPartner.visible && E.npcs.includes(E.lastPartner) ? E.lastPartner : null;
      if (!other) other = E.npcs.filter(a => a.visible && !(a.def && a.def.ambient)).sort((a, b) => Math.abs(a.x - E.player.x) - Math.abs(b.x - E.player.x))[0];
      if (other && Math.abs(other.x - E.player.x) > 30 && Math.abs(other.x - E.player.x) < 900 && !E.player.walking && !E.player.pose) E.player.dir = other.x > E.player.x ? 'e' : 'w';
      if (other && canTurn(other)) other.dir = E.player.x > other.x ? 'e' : 'w';
    }
  }
  // Nudges an overlay placed in % back inside the game frame, measuring the box it
  // actually renders (so long or multi-line captions never run off an edge).
  function keepInside(el, m) {
    m = m === undefined ? 10 : m;
    const r = el.getBoundingClientRect(), gr = wrap.getBoundingClientRect();
    if (!r.width || !gr.width) return;
    const px = gr.width / W;   // scene px -> screen px
    let dx = 0, dy = 0;
    if (r.width > gr.width - 2 * m * px) dx = gr.left + gr.width / 2 - (r.left + r.width / 2);
    else if (r.left < gr.left + m * px) dx = gr.left + m * px - r.left;
    else if (r.right > gr.right - m * px) dx = gr.right - m * px - r.right;
    if (r.top < gr.top + m * px) dy = gr.top + m * px - r.top;
    else if (r.bottom > gr.bottom - m * px) dy = gr.bottom - m * px - r.bottom;
    if (dx) el.style.left = `calc(${el.style.left} + ${dx / gr.width * 100}%)`;
    if (dy) el.style.top = `calc(${el.style.top} + ${dy / gr.height * 100}%)`;
  }
  function positionSpeech() {
    if (!E.speaking || !E.speaking.actor) return;
    const a = E.speaking.actor, b = a.bbox();
    let [sx, sy] = [b.x + b.w / 2, b.y - 10];
    if (window.Parallax && Parallax.active && E.room && E.room.depth) [sx, sy] = Parallax.at(sx, sy, a.x, a.y); // (where the parallax put them)
    speechEl.style.left = (sx / W * 100) + '%'; speechEl.style.top = (sy / H * 100) + '%';
    keepInside(speechEl, 14);
  }
  function clearSpeech() {
    if (E.speaking && E.speaking.actor) E.phraseEndT = E.time; // the line is over: listeners may nod
    speechEl.style.display = 'none'; narrEl.style.display = 'none';
    if (E.speaking && E.speaking.actor) E.speaking.actor.talking = false;
    E.speaking = null;
  }
  const strip = t => t.replace(/\[[^\]]*\]\s*/g, '');

  const cutsceneHold = () => E.room && E.room.holdFacing && E.room.holdFacing();
  // One voice at a time: if two scripts ever try to speak at once, the second
  // waits its turn, so the caption on screen is always the line being heard.
  let speechChain = Promise.resolve();
  function say(id, opts) {
    if (Sound.preloadVoice) Sound.preloadVoice(id); // decoding starts now, so the line is ready when its turn comes
    const run = speechChain.then(() => sayNow(id, opts));
    speechChain = run.catch(() => {});
    return run;
  }
  async function sayNow(id, opts) {
    opts = opts || {};
    const L = LINES[id];
    if (!L) { console.warn('missing line', id); return; }
    const [who, raw] = L;
    const text = strip(raw);
    E.busy++;
    clearSpeech();
    const actor = (opts.offscreen || E.still) ? null : actorFor(who);
    E.speaking = { id, actor };
    if (actor) {
      actor.talking = true; actor.talkPose = true; actor.talkT = 0.6; actor.talkWho = who;
      const pd = E.player.dir;
      if (!cutsceneHold()) faceEachOther(actor, id);
      // Alan turning to the speaker (now, or just before): the line waits for the turn, so nobody is spoken to over his shoulder
      // (or set but not drawn yet: the frame on screen still looks the other way)
      const p = E.player, unshown = (p.dir === 'e' || p.dir === 'w') && !p.pairKey && p.lastLooksLeft != null && p.lastLooksLeft !== (p.dir === 'w');
      if (!window.FAST && p.visible && (p.dir !== pd || p.viaT != null || unshown)) await wait(220);
      speechEl.textContent = text; speechEl.style.color = COLORS[who] || '#fff';
      speechEl.style.display = 'block'; positionSpeech();
    } else {
      narrEl.querySelector('.who').textContent = who === 'narr' ? '' : (opts.label || NAMES[who] || '');
      const t = narrEl.querySelector('.txt');
      t.textContent = text;
      t.style.fontStyle = who === 'narr' ? 'italic' : 'normal';
      t.style.color = COLORS[who];
      narrEl.style.display = 'block';
    }
    const dur = await Sound.playVoice(id, !actor);
    const ms = window.FAST ? 20 : dur ? dur * 1000 + 250 : Math.max(2500, 800 + text.length * 70); // no recording: about 14 characters a second, the narrator's own pace
    await new Promise(res => {
      let finished = false, t = setTimeout(check, ms);
      // a slow-loading voice can outlast the estimate: hold the line until it has finished
      function check() { if (finished) return; if (!window.FAST && Sound.voicePlaying && Sound.voicePlaying()) t = setTimeout(check, 120); else done(); }
      function done() { if (finished) return; finished = true; clearTimeout(t); if (E.skipFn === done) E.skipFn = null; res(); }
      setTimeout(() => { if (!finished) E.skipFn = done; }, 180);
    });
    Sound.stopVoice();
    clearSpeech();
    E.busy--;
    await wait(110);
  }
  // a recorded song with timed captions: cues [[seconds, text], ...]; a click ends it early
  async function lyrics(song, cues, who) {
    E.busy++;
    const t = narrEl.querySelector('.txt');
    narrEl.querySelector('.who').textContent = NAMES[who] || '';
    t.style.fontStyle = 'italic'; t.style.color = COLORS[who] || '#fff';
    let shown = -1, over = false;
    const tick = setInterval(() => {
      const now = song.el.currentTime; let k = -1;
      cues.forEach(([at], i) => { if (now >= at) k = i; });
      if (k !== shown) {
        shown = k;
        if (k >= 0 && cues[k][1]) { t.textContent = cues[k][1]; narrEl.style.display = 'block'; } else narrEl.style.display = 'none';
      }
    }, 120);
    const skip = () => { if (!over) song.stop(900); };
    E.skipFn = skip;
    if (window.FAST) song.stop(10);
    await song.ended; over = true;
    clearInterval(tick); if (E.skipFn === skip) E.skipFn = null;
    narrEl.style.display = 'none'; t.style.fontStyle = 'normal';
    E.busy--;
  }
  async function says(...ids) { if (Sound.preloadVoice) ids.forEach(id => Sound.preloadVoice(id)); for (const id of ids) await say(id); }

  // ---------------------------------------------------------------- dialogue
  async function dialog(topics) {
    const used = new Set();
    for (;;) {
      const avail = topics.filter(t => (!t.when || t.when()) && !(t.once && used.has(t)));
      const pick = await new Promise(res => {
        E.dialogResolve = res;
        dialogEl.innerHTML = '';
        avail.forEach((t, i) => {
          const b = document.createElement('button');
          b.innerHTML = `<span class="n">${i + 1}</span>`;
          b.appendChild(document.createTextNode(t.label || strip(LINES[t.line][1])));
          b.onclick = e => { e.stopPropagation(); Sound.sfx('click'); res(t); };
          dialogEl.appendChild(b);
        });
        dialogEl.classList.add('open');
      });
      E.dialogResolve = null;
      dialogEl.classList.remove('open');
      used.add(pick);
      // the story layer can stage a chosen line like any other (speaker poses, listeners' faces)
      if (pick.line && !pick.silent) await (window.Game.sayChoice ? window.Game.sayChoice(pick.line) : say(pick.line));
      if (pick.run) await pick.run();
      if (pick.bye) return;
    }
  }

  Object.assign(E, { turnsFreely, canTurn, keepInside, positionSpeech, clearSpeech, say, lyrics, says, dialog });
})();
