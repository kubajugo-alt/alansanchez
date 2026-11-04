// The animation review screen (?review in the address; loaded only then, by main.js, never in normal play), Game II's
// copy of Game I's js/review.js. Pick anyone in the cast, in any outfit, stage them in a room and play any state or a
// transition between two (slow motion, frame by frame): standing, talking (with lip-sync and blinks), the views from
// the front and back, the walks, the poses, and every Ludo run installed for them that the game doesn't play yet (talk
// loops, pose runs, turns; window.LUDO). Walk them across a room; play their voice lines and see which have a recording
// and mouth cues. Game I's other tabs are left out: its "New frames" approves Gemini candidates
// (art/review/candidates.json, approvals.json, a local /api/approvals) and Game II has no such pipeline (its art is
// reviewed on artifact pages, scripts/review_page.py, art/review/); it has no combined sprites and no rig art.
// The figure is a copy of the character (CHARS.rv): nothing here changes the game.
(() => {
  const G = window.Game, S = window.S, E = window.Engine, $ = s => document.querySelector(s);
  const arr = v => v == null ? [] : Array.isArray(v) ? v : [v];
  const LU = window.LUDO || {}, SPK = window.SPEAKERS || {};
  const STAGE_ROOMS = ['hotel_lobby', 'canteras', 'mercado', 'santa_ana', 'isleta', 'museum_hall', 'beach', 'archive', 'camp', 'hotel_room'];
  const wait = ms => new Promise(r => setTimeout(r, ms / (window.TIME_SCALE || 1)));
  let fid = null, actor = null, loopTok = 0, paused = false;

  // ---------------------------------------------------------------- the cast, every outfit
  // a figure: a character's frames in one outfit (S.CHARS[ch].outfits), or the Game I frames it was made from (game1);
  // its Ludo runs are the ones named after its sprites (alanv_*, vasco_*, talk_carmen)
  let FIGS = null;
  function figures() {
    if (FIGS) return FIGS;
    FIGS = [];
    for (const [ch, c] of Object.entries(S.CHARS)) {
      const sp = SPK[ch] ? ch : SPK[ch.split('_')[0]] ? ch.split('_')[0] : ch; // carmen_field speaks as carmen
      const outfits = c.outfits || [c.frames];
      outfits.forEach(F => {
        const stand = arr(F.idle)[0] || ch, pre = stand.replace(/_(side_k|front_k|side|front|r|c|k|seated)$/, '').replace(/_front$/, '');
        FIGS.push({ id: outfits.length > 1 ? pre : ch, ch, sp, c, F, pre, label: ch + (outfits.length > 1 ? ' · ' + pre : '') });
      });
      if (c.game1) FIGS.push({ id: ch + '_game1', ch, sp, c, F: c.game1, pre: ch, game1: true, label: ch + " · Game I's frames (not in the game)" });
    }
    return FIGS;
  }
  const fig = () => figures().find(f => f.id === fid) || figures()[0];
  // the Ludo runs painted for a figure and not part of its frames: talk loops, pose runs, turns (walks: the walk lab)
  function runsOf(f) {
    if (f.game1) return [];
    const own = k => k.startsWith(f.pre + '_') || k === 'talk_' + f.sp;
    let ks = Object.keys(LU).filter(own);
    if (!ks.length) ks = Object.keys(LU).filter(k => k.startsWith(f.sp + '_'));
    const inUse = new Set([].concat(arr(f.F.talk), arr(f.F.walk), arr(f.F.frontWalk), arr(f.F.backWalk)));
    return ks.filter(k => !/_walk_(side|front|back)$/.test(k) && !LU[k].frames.every(x => inUse.has(x)));
  }

  // ---------------------------------------------------------------- the panel
  const css = `#rv{position:absolute;top:0;right:0;width:380px;height:100%;background:rgba(14,16,20,.94);color:#e6e0d4;font:13px/1.35 system-ui,sans-serif;z-index:90;display:flex;flex-direction:column;border-left:1px solid #5a4a2a}
  #rv h3{margin:6px 0 4px;font:600 14px serif;color:#d8b46a;letter-spacing:.04em}
  #rv .bar{padding:8px 10px;border-bottom:1px solid #333;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
  #rv .tabs{display:flex;border-bottom:1px solid #333}#rv .tabs button{flex:1;padding:6px 2px;background:none;border:0;color:#aaa;cursor:pointer;font:inherit}
  #rv .tabs button.on{color:#f0d79a;border-bottom:2px solid #d8b46a}
  #rv .body{flex:1;overflow:auto;padding:8px 10px}
  #rv button.b{background:#2b2a26;color:#eee;border:1px solid #5a4a2a;border-radius:4px;padding:3px 7px;cursor:pointer;font:inherit;margin:2px}
  #rv button.b:hover{background:#3d3a32}
  #rv select,#rv input{font:inherit;background:#222;color:#eee;border:1px solid #555;border-radius:3px;max-width:100%}
  #rv .grid{display:flex;flex-wrap:wrap;gap:2px}
  #rv.hid{transform:translateX(100%)}#rv{transition:transform .2s}#rv-show{position:absolute;top:8px;right:8px;z-index:91;display:none}
  #rv .muted{color:#999;font-size:12px}#rv .warn{color:#e8a070;font-size:11px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const P = document.createElement('div'); P.id = 'rv';
  P.innerHTML = `<div class="bar"><b style="color:#d8b46a">Animation review</b>
      <select id="rv-ch"></select>
      <label class="muted">speed <input id="rv-speed" type="range" min="0.25" max="1" step="0.05" value="1" style="width:80px"> <span id="rv-sv">1×</span></label>
      <button class="b" id="rv-pause">⏸ pause</button><button class="b" id="rv-step">⏭ step</button><button class="b" id="rv-hide" title="hide the panel (the scene behind it)">⇥ hide</button>
      <span class="muted" id="rv-now"></span></div>
    <div class="tabs"><button data-t="states" class="on">States</button><button data-t="walk">Walk</button><button data-t="voice">Voice</button></div>
    <div class="body" id="rv-body"></div>`;
  let tab = 'states';

  // ---------------------------------------------------------------- staging
  // the figure stands in as a copy of its character (CHARS.rv): Alan on the player's figure, anyone else as a person
  // in the room who speaks with the character's voice (def.speaker)
  function copy(extra) {
    const f = fig(), F = Object.assign({}, f.F, { poses: Object.assign({}, f.F.poses || {}) }, extra || {});
    E.CHARS.rv = { scale: f.c.scale || 1, frames: F };
    if (actor) { actor.pose = null; actor.set = null; actor.cur = null; }
    return F;
  }
  async function stage(roomId) {
    loopTok++;
    const p = G.player, f = fig(), id = roomId || (G.room && G.room.id) || STAGE_ROOMS.find(r => E.ROOMS[r]);
    if (!G.room || G.room.id !== id) await G.goRoom(id, null, { noEnter: true, instant: true, noSave: true, pos: [560, 690, 'e'] });
    if (window.Parallax && Parallax.set) Parallax.set(false);
    const room = G.room; room.npcs = (room.npcs || []).filter(n => n.id !== 'rv_actor');
    copy();
    if (f.sp === 'alan') { p.visible = true; p.ch = 'rv'; actor = p; G.refreshNpcs(); G.npcs.forEach(a => { a.visible = false; }); }
    else {
      p.visible = false;
      room.npcs.push({ id: 'rv_actor', ch: 'rv', x: 560, y: 690, dir: 'e', name: f.label, speaker: f.sp });
      G.refreshNpcs();
      G.npcs.forEach(a => { a.visible = a.id === 'rv_actor'; });
      actor = G.npc('rv_actor');
    }
    reset();
  }
  function reset() {
    const a = actor; if (!a) return;
    if (a.walking && a.stop) a.stop();
    a.pose = null; a.set = null; a.talking = false; a.dir = 'e'; a.x = 560; a.y = 690;
  }
  // every state a figure has: idle, talk, the views and walks, its poses, its Ludo runs not in the game
  function states() {
    const f = fig(), F = f.F, out = [['idle', 'idle'], ['talk', 'talk']];
    if (arr(F.walk).length > 1) out.push(['walk', 'walk (side)']);
    if (F.front) out.push(['front', 'front']); if (arr(F.frontWalk).length > 1) out.push(['walk_s', 'walk toward us']);
    if (F.back) out.push(['back', 'back']); if (arr(F.backWalk).length > 1) out.push(['walk_n', 'walk away']);
    for (const k of Object.keys(F.sets || {})) out.push(['set:' + k, 'set: ' + k]);
    for (const [k, v] of Object.entries(F.poses || {})) if (typeof v !== 'string' || window.SPRITES[v]) out.push(['pose:' + k, k]);
    for (const r of runsOf(f)) out.push([/talk/.test(r) ? 'talkrun:' + r : 'run:' + r, (/talk/.test(r) ? 'talk loop ' : 'run ') + r.replace(f.pre + '_', '') + ' (Ludo, not in the game)']);
    return out;
  }
  async function apply(s, tok) {
    const a = actor; if (!a) return;
    a.talking = false;
    if (!s.startsWith('walk') && a.walking) a.stop();
    copy(s.startsWith('talkrun:') ? { talk: LU[s.slice(8)].frames, talkFps: LU[s.slice(8)].fps } : null);
    if (s.startsWith('run:')) { const R = LU[s.slice(4)]; E.CHARS.rv.frames.poses[s] = { frames: R.frames, fps: R.fps, hold: /_turn_/.test(s) ? R.frames.length - 1 : Math.floor(R.frames.length / 2) }; }
    if (s === 'idle') { a.dir = a.dir === 'w' ? 'w' : 'e'; }
    else if (s === 'talk' || s.startsWith('talkrun:')) a.talking = true;
    else if (s === 'front') a.dir = 's';
    else if (s === 'back') a.dir = 'n';
    else if (s.startsWith('set:')) a.set = s.slice(4);
    else if (s.startsWith('pose:')) a.pose = s.slice(5);
    else if (s.startsWith('run:')) a.pose = s; // (its own name: a new run starts from its first frame)
    else if (s === 'walk') walkLoop(tok, [[260, 690], [900, 690]]);
    else if (s === 'walk_s') walkLoop(tok, [[560, 610], [560, 712]]);
    else if (s === 'walk_n') walkLoop(tok, [[560, 712], [560, 610]]);
  }
  async function walkLoop(tok, pts) {
    const a = actor;
    for (let i = 0; tok === loopTok; i++) { const [x, y] = pts[i % pts.length]; await a.walkTo(x, y); await wait(500); }
  }
  async function playState(s) {
    const tok = ++loopTok; reset(); await apply(s, tok); now(`state: ${s}`);
  }
  async function playTransition(a, b) {
    const tok = ++loopTok; reset();
    while (tok === loopTok) {
      await apply(a, tok); now(`from ${a}`); await wait(1300); if (tok !== loopTok) return;
      await apply(b, tok); now(`to ${b}`); await wait(1700); if (tok !== loopTok) return;
    }
  }
  const now = t => { $('#rv-now').textContent = t; };

  // ---------------------------------------------------------------- tabs
  function render() {
    P.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    const B = $('#rv-body'), f = fig();
    if (tab === 'states') {
      const S0 = states(), opts = S0.map(([k, l]) => `<option value="${k}">${l}</option>`).join('');
      B.innerHTML = `<h3>Play a state</h3><div class="grid">${S0.map(([k, l]) => `<button class="b" data-s="${k}">${l}</button>`).join('')}</div>
        <h3>Transition</h3><div>from <select id="rv-a">${opts}</select></div><div>to <select id="rv-b">${opts}</select></div>
        <button class="b" id="rv-go">▶ play the transition (loops)</button><button class="b" id="rv-stop">■ stop</button>
        <p class="muted">Standing frame ${arr(f.F.idle).join(', ')}; ${E.hasFace && arr(f.F.idle).some(E.hasFace) ? 'its face set gives lip-sync and blinks' : 'no face set (no lip-sync or blinks)'}. A Ludo run plays in to its middle frame and holds (a turn: to its last); pick another state to play it out.</p>`;
      B.querySelectorAll('[data-s]').forEach(b => { b.onclick = () => playState(b.dataset.s); });
      $('#rv-b').selectedIndex = Math.min(S0.length - 1, 1);
      $('#rv-go').onclick = () => playTransition($('#rv-a').value, $('#rv-b').value);
      $('#rv-stop').onclick = () => { loopTok++; reset(); now(''); };
    } else if (tab === 'walk') {
      B.innerHTML = `<h3>Walk across a room</h3><select id="rv-room">${STAGE_ROOMS.concat(G.rooms().filter(r => !STAGE_ROOMS.includes(r)).sort()).filter(r => E.ROOMS[r] && E.ROOMS[r].walk).map(r => `<option${G.room && G.room.id === r ? ' selected' : ''}>${r}</option>`).join('')}</select>
        <button class="b" id="rv-walk">▶ walk across and back</button>
        <p class="muted">Watch the planted foot: it should stay put on the floor while the body passes over it. Slow it down with the speed slider, or pause and step.
        ${arr(f.F.walk).length > 1 ? '' : '<br><b>This figure has no walk cycle: it glides on its standing sprite.</b>'}</p>
        <p class="muted">The walk lab measures every frame of a cycle (size, rise, feet, slip) and has the Ludo walks not in the game: <a href="?scene=walklab" style="color:#d8b46a">?scene=walklab</a>.</p>
        <div id="rv-scale" class="muted"></div>`;
      $('#rv-walk').onclick = async () => {
        const r = $('#rv-room').value; await stage(r);
        const def = G.roomDef(r), e = (def.entries && (def.entries.default || Object.values(def.entries)[0])) || [560, 690];
        const y = e[1], tok = ++loopTok; actor.x = 140; actor.y = y;
        $('#rv-scale').textContent = `drawn height here: ${Math.round(actor.height())} px`;
        walkLoop(tok, [[1140, y], [140, y]]);
      };
    } else if (tab === 'voice') {
      const sp = f.sp, L = Object.entries(window.LINES).filter(([, v]) => v[0] === sp), cues = (window.LIPSYNC || {})[sp] || {};
      const rec = id => !window.Sound || !Sound.hasVoice || Sound.hasVoice(id);
      const noRec = L.filter(([k]) => !rec(k)).length, noCue = L.filter(([k]) => !cues[k]).length;
      B.innerHTML = `<h3>Voice lines (${L.length})</h3><p class="muted">${noRec} without a recording (a caption only), ${noCue} without mouth cues${sp === 'narr' ? ' (the narrator has no figure)' : ''}. A line plays on the figure, with lip-sync where it has cues and a face set. (Whether cues match the current recording: node scripts/validate.mjs.)</p>
        <input id="rv-q" placeholder="filter" style="width:100%"><div id="rv-lines"></div>`;
      const list = () => {
        const q = $('#rv-q').value.toLowerCase();
        $('#rv-lines').innerHTML = L.filter(([k, v]) => !q || k.includes(q) || v[1].toLowerCase().includes(q)).slice(0, 200)
          .map(([k, v]) => `<div><button class="b" data-l="${k}">▶</button> <span class="muted">${k}</span>${rec(k) ? '' : ' <span class="warn">no recording</span>'}${cues[k] || !rec(k) ? '' : ' <span class="warn">no cues</span>'} ${v[1].replace(/\[[^\]]*\]/g, '').slice(0, 90)}</div>`).join('');
        $('#rv-lines').querySelectorAll('[data-l]').forEach(b => { b.onclick = async () => { loopTok++; reset(); await G.say(b.dataset.l); }; });
      };
      $('#rv-q').oninput = list; list();
    }
  }

  // ---------------------------------------------------------------- start
  async function start() {
    G.sandbox();
    $('#game').appendChild(P);
    const F0 = figures().filter(f => arr(f.F.idle).some(k => window.SPRITES[k]));
    fid = F0.length ? F0[0].id : null;
    $('#rv-ch').innerHTML = F0.map(f => `<option value="${f.id}"${f.id === fid ? ' selected' : ''}>${f.label}</option>`).join('');
    $('#rv-ch').onchange = async e => { fid = e.target.value; await stage(G.room && G.room.id); render(); };
    $('#rv-speed').oninput = e => { window.TIME_SCALE = +e.target.value; $('#rv-sv').textContent = (+e.target.value).toFixed(2).replace(/0$/, '') + '×'; };
    $('#rv-pause').onclick = () => {
      paused = !paused;
      window.STEP_DT = paused ? 1 / 30 : 0;
      window.HOLD = paused;
      window.ADVANCE = 0;
      $('#rv-pause').textContent = paused ? '▶ play' : '⏸ pause';
    };
    $('#rv-step').onclick = () => { if (!paused) $('#rv-pause').click(); window.ADVANCE = 1; };
    const show = document.createElement('button'); show.id = 'rv-show'; show.className = 'b'; show.textContent = '⇤ review panel';
    show.style.cssText += ';background:#2b2a26;color:#eee;border:1px solid #d8b46a;border-radius:4px;padding:4px 10px;cursor:pointer';
    $('#game').appendChild(show);
    $('#rv-hide').onclick = () => { P.classList.add('hid'); show.style.display = 'block'; };
    show.onclick = () => { P.classList.remove('hid'); show.style.display = 'none'; };
    P.querySelectorAll('.tabs button').forEach(b => { b.onclick = () => { tab = b.dataset.t; render(); }; });
    await stage(); render();
  }
  if (new URLSearchParams(location.search).get('scene')) return; // (a ?scene= preview runs the story instead)
  const ready = () => $('#title.ready') ? start() : setTimeout(ready, 200);
  ready();
})();
