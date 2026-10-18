// The animation review screen (?review in the address; loaded only then, never in normal play).
// Pick a character, play any state or any transition between two states (slow motion, frame by
// frame), walk them across a room, play their voice lines, approve or reject new Gemini frames
// (side by side with the originals they were made from), and jump to the scenes with combined sprites.
(() => {
  const G = window.Game, S = window.S, $ = s => document.querySelector(s);
  const arr = v => v == null ? [] : Array.isArray(v) ? v : [v];
  const SPEAKER = { tomas_night: 'tomas', lacerda_robe: 'lacerda', cop_visit: 'phone', cop_bed: 'phone', guitar_visit: 'guitar', guitar_floor: 'guitar' };
  const STAGE_ROOMS = ['street', 'shop', 'cais', 'lavadouro', 'se_cloister', 'police', 'tavern'];
  const LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  // scenes with combined sprites (Alan with someone else), as preview links
  const P_ = (pre, ks) => ks.map(k => pre + k);
  const COMBINED = [
    { scene: 'copguard', label: 'Police station: flirting with Teixeira', frames: ['pair_cop_chest', 'pair_cop_arm'], first: true },
    { scene: 'copreturn', label: 'Police station: the Inspector walks in on them', frames: ['pair_cop_chest'] },
    { scene: 'guitar', label: 'Tavern: the guitar lesson with Duarte', frames: ['pair_guitar_lesson'] },
    { scene: 'celeste', label: 'Washhouse: wringing the sheet with Celeste', frames: ['pair_wring_1', 'pair_wring_2', 'pair_wring_3'] },
    { scene: 'visitcop', label: 'Bedroom visit: Teixeira', frames: P_('pair_cop_', ['neck', 'shelf', 'jacket', 'tshirt', 'buttons', 'shelf2', 'belt', 'belt2', 'trousers', 'cuffs']) },
    { scene: 'visitguitar', label: 'Bedroom visit: Duarte', frames: P_('pair_guitar_', ['j0', 'jackets', 'j1', 'j2', 'u1', 'u2', 'shirtfly', 's1', 's2', 'undress2', 'd1', 'd2', 'hop', 'h1', 'h2', 'lasso', 'l1', 'l2', 'underwear', 'p1']) },
    { scene: 'romance', label: 'Ch. IV cabin: Zé', frames: ['pair_unbutton', 'pair_kiss', 'pair_brow'] },
    { scene: 'sepit', label: 'Sé pit: the catch, the shirt buttons', frames: ['pair_vasco_catch', 'pair_vasco_lanyard'] },
    { scene: 'sepitgame', label: 'Sé pit: the five exchanges, the card', frames: ['pair_vasco_lanyard', 'pair_vasco_card'] },
    { scene: 'sech3', label: 'Sé cloister, Ch. III: the fragment', frames: ['pair_vasco_fragment'] },
    { scene: 'vascostore', label: 'Sé store room: the dust', frames: ['pair_vasco_clapper'] },
    { scene: 'thursday', label: 'Thursday: coffee with Vasco, the ladder', frames: ['pair_vasco_coffee', 'pair_vasco_ladder'] },
    { scene: 'vascolove', label: 'Sé store room: the love scene', frames: ['pair_vasco_kiss', 'pair_vasco_shirtless'] },
    { scene: null, label: 'Painted, not placed in any scene yet', frames: ['pair_vasco_kneel', 'pair_vasco_thumb'] },
  ];
  // full-screen paintings of Alan with someone (they fade in and out over the scene; no feet to line up)
  const COMBINED_STILLS = [
    { scene: 'visitcop', label: 'Bedroom visit: Teixeira', stills: ['still_cop_shelf', 'still_cop_bed', 'still_cop_cuffed', 'still_cop_smoke'] },
    { scene: 'visitguitar', label: 'Bedroom visit: Duarte', stills: ['still_guitar_bed'] },
    { scene: 'romance', label: 'Ch. IV cabin: Zé', stills: ['still_ze_kiss', 'still_ze_bunk'] },
    { scene: 'sepitgame', label: 'Sé pit: Vasco', stills: ['still_se_pit', 'still_se_kiss'] },
  ];

  let ch = 'alan', actor = null, loopTok = 0, paused = false;
  const dec = () => { try { return JSON.parse(localStorage.getItem('review-approvals') || '{}'); } catch (e) { return {}; } };
  const setDec = d => { try { localStorage.setItem('review-approvals', JSON.stringify(d)); } catch (e) { /* private mode */ } };
  const wait = ms => new Promise(r => setTimeout(r, ms / (window.TIME_SCALE || 1)));

  // ---------------------------------------------------------------- the panel
  const css = `#rv{position:absolute;top:0;right:0;width:380px;height:100%;background:rgba(14,16,20,.94);color:#e6e0d4;font:13px/1.35 'Alegreya Sans',sans-serif;z-index:90;display:flex;flex-direction:column;border-left:1px solid #5a4a2a}
  #rv h3{margin:6px 0 4px;font:600 14px Cinzel,serif;color:#d8b46a;letter-spacing:.04em}
  #rv .bar{padding:8px 10px;border-bottom:1px solid #333;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
  #rv .tabs{display:flex;border-bottom:1px solid #333}#rv .tabs button{flex:1;padding:6px 2px;background:none;border:0;color:#aaa;cursor:pointer;font:inherit}
  #rv .tabs button.on{color:#f0d79a;border-bottom:2px solid #d8b46a}
  #rv .body{flex:1;overflow:auto;padding:8px 10px}
  #rv button.b{background:#2b2a26;color:#eee;border:1px solid #5a4a2a;border-radius:4px;padding:3px 7px;cursor:pointer;font:inherit;margin:2px}
  #rv button.b:hover{background:#3d3a32}#rv button.ok{border-color:#5c8a4a}#rv button.no{border-color:#8a4a4a}
  #rv select,#rv input{font:inherit;background:#222;color:#eee;border:1px solid #555;border-radius:3px}
  #rv .grid{display:flex;flex-wrap:wrap;gap:2px}
  #rv .cand{border:1px solid #333;border-radius:5px;padding:6px;margin-bottom:8px}
  #rv .cand.approved{border-color:#5c8a4a}#rv .cand.rejected{border-color:#8a4a4a;opacity:.7}
  #rv .imgs{display:flex;gap:4px;align-items:flex-end;background:#2a2e36;padding:4px;border-radius:4px}
  #rv .imgs figure{margin:0;text-align:center;font-size:11px;color:#aaa}#rv .imgs img{height:150px;display:block}
  #rv.hid{transform:translateX(100%)}#rv{transition:transform .2s}#rv-show{position:absolute;top:8px;right:8px;z-index:91;display:none}
  #rv .new img{outline:2px solid #4a7ab0}#rv .muted{color:#999;font-size:12px}#rv .state{font-weight:600;color:#f0d79a}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const P = document.createElement('div'); P.id = 'rv';
  P.innerHTML = `<div class="bar"><b style="font-family:Cinzel;color:#d8b46a">Animation review</b>
      <select id="rv-ch"></select>
      <label class="muted">speed <input id="rv-speed" type="range" min="0.25" max="1" step="0.05" value="1" style="width:80px"> <span id="rv-sv">1×</span></label>
      <button class="b" id="rv-pause">⏸ pause</button><button class="b" id="rv-step">⏭ step</button><button class="b" id="rv-hide" title="hide the panel (the scene behind it)">⇥ hide</button>
      <span class="muted" id="rv-now"></span></div>
    <div class="tabs"><button data-t="states" class="on">States</button><button data-t="walk">Walk</button><button data-t="voice">Voice</button><button data-t="cands">New frames</button><button data-t="combined">Combined</button></div>
    <div class="body" id="rv-body"></div>`;
  let tab = 'states';

  // ---------------------------------------------------------------- staging
  function F() { return S.CHARS[ch].frames; }
  async function stage(roomId) {
    loopTok++;
    const p = G.player;
    const id = roomId || STAGE_ROOMS[0];
    if (!G.room || G.room.id !== id) await G.goRoom(id, null, { noEnter: true, instant: true, noSave: true, pos: [560, 690, 'e'] });
    G.npcs.forEach(a => { a.visible = false; });
    if (ch === 'alan') { p.visible = true; actor = p; }
    else {
      p.visible = false;
      const room = G.room; room.npcs = (room.npcs || []).filter(n => n.id !== 'rv_actor');
      const sp = SPEAKER[ch] || ch;
      room.npcs.push({ id: 'rv_actor', ch, x: 560, y: 690, dir: 'e', name: ch });
      G.refreshNpcs();
      G.npcs.forEach(a => { a.visible = a.id === 'rv_actor'; });
      actor = G.npc('rv_actor'); actor.speakerId = sp;
    }
    reset();
  }
  function reset() {
    const a = actor; if (!a) return;
    if (a.stop) a.stop();
    a.pose = null; a.set = null; a.talking = false; a.dir = 'e'; a.x = 560; a.y = 690;
  }
  // every state a character has: idle, talk, walks, front/back, poses, sets
  function states() {
    const f = F(), out = [['idle', 'idle'], ['talk', 'talk'], ['walk', 'walk (side)']];
    if (f.front) out.push(['front', 'front']); if (f.frontWalk) out.push(['walk_s', 'walk toward us']);
    if (f.back) out.push(['back', 'back']); if (f.backWalk) out.push(['walk_n', 'walk away']);
    for (const k of Object.keys(f.sets || {})) out.push(['set:' + k, 'set: ' + k]);
    const seen = new Set();
    for (const [k, v] of Object.entries(f.poses || {})) if (window.SPRITES[v] && !/^pair_/.test(v)) { out.push(['pose:' + k, k]); seen.add(v); }
    if (ch === 'alan') for (const k of Object.keys(window.SPRITES).sort()) if (/^alan_/.test(k) && !seen.has(k) && !/_ib_/.test(k)) out.push(['pose:' + k, k.replace(/^alan_/, '')]);
    return out;
  }
  async function apply(s, tok) {
    const a = actor; if (!a) return;
    a.talking = false;
    if (!s.startsWith('walk') && a.walking) a.stop();
    if (s === 'idle') { a.pose = null; a.set = null; a.dir = a.dir === 'w' ? 'w' : 'e'; }
    else if (s === 'talk') { a.pose = null; a.talking = true; }
    else if (s === 'front') { a.pose = null; a.dir = 's'; }
    else if (s === 'back') { a.pose = null; a.dir = 'n'; }
    else if (s.startsWith('set:')) { a.pose = null; a.set = s.slice(4); }
    else if (s.startsWith('pose:')) { a.set = null; a.pose = s.slice(5); }
    else if (s === 'walk') { a.pose = null; walkLoop(tok, [[260, 690], [900, 690]]); }
    else if (s === 'walk_s') { a.pose = null; walkLoop(tok, [[560, 640], [560, 712]]); }
    else if (s === 'walk_n') { a.pose = null; walkLoop(tok, [[560, 712], [560, 640]]); }
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
    const B = $('#rv-body');
    if (tab === 'states') {
      const S0 = states(), opts = S0.map(([k, l]) => `<option value="${k}">${l}</option>`).join('');
      B.innerHTML = `<h3>Play a state</h3><div class="grid">${S0.map(([k, l]) => `<button class="b" data-s="${k}">${l}</button>`).join('')}</div>
        <h3>Transition</h3><div>from <select id="rv-a">${opts}</select></div><div>to <select id="rv-b">${opts}</select></div>
        <button class="b" id="rv-go">▶ play the transition (loops)</button><button class="b" id="rv-stop">■ stop</button>
        <p class="muted">Pose changes pass through approved in-between frames; frames with smoothing data morph, near-identical frames cross-fade over 100 ms.</p>`;
      B.querySelectorAll('[data-s]').forEach(b => { b.onclick = () => playState(b.dataset.s); });
      $('#rv-b').selectedIndex = Math.min(S0.length - 1, 3);
      $('#rv-go').onclick = () => playTransition($('#rv-a').value, $('#rv-b').value);
      $('#rv-stop').onclick = () => { loopTok++; reset(); now(''); };
    } else if (tab === 'walk') {
      B.innerHTML = `<h3>Walk across a room</h3><select id="rv-room">${G.rooms().sort().map(r => `<option${G.room && G.room.id === r ? ' selected' : ''}>${r}</option>`).join('')}</select>
        <button class="b" id="rv-walk">▶ walk across and back</button>
        <p class="muted">Watch the planted foot: it should stay put on the floor while the body passes over it. Slow it down with the speed slider, or pause and step.</p>
        <div id="rv-scale" class="muted"></div>`;
      $('#rv-walk').onclick = async () => {
        const r = $('#rv-room').value; await stage(r);
        const def = G.roomDef(r), e = (def.entries && (def.entries.default || Object.values(def.entries)[0])) || [560, 690];
        const y = e[1], tok = ++loopTok; actor.x = 140; actor.y = y;
        $('#rv-scale').textContent = `drawn height here: ${Math.round(actor.height())} px`;
        walkLoop(tok, [[1140, y], [140, y]]);
      };
    } else if (tab === 'voice') {
      const sp = SPEAKER[ch] || ch, L = Object.entries(window.LINES).filter(([, v]) => v[0] === sp);
      B.innerHTML = `<h3>Voice lines (${L.length})</h3><p class="muted">Lip-sync and blinking arrive in phase 4; for now the talk frames play with the line.</p>
        <input id="rv-q" placeholder="filter" style="width:100%"><div id="rv-lines"></div>`;
      const list = () => {
        const q = $('#rv-q').value.toLowerCase();
        $('#rv-lines').innerHTML = L.filter(([k, v]) => !q || k.includes(q) || v[1].toLowerCase().includes(q)).slice(0, 200)
          .map(([k, v]) => `<div><button class="b" data-l="${k}">▶</button> <span class="muted">${k}</span> ${v[1].replace(/\[[^\]]*\]/g, '').slice(0, 90)}</div>`).join('');
        $('#rv-lines').querySelectorAll('[data-l]').forEach(b => { b.onclick = async () => { loopTok++; reset(); if (actor !== G.player) actor.id = sp; await G.say(b.dataset.l); if (actor !== G.player) actor.id = 'rv_actor'; }; });
      };
      $('#rv-q').oninput = list; list();
    } else if (tab === 'cands') {
      const C = (S.REVIEW && S.REVIEW.candidates) || [], saved = (S.REVIEW && S.REVIEW.saved) || {}, d = Object.assign({}, saved, dec());
      const count = k => C.filter(c => (d[c.id] && d[c.id].decision) === k).length;
      B.innerHTML = `<h3>New frames: ${C.length}</h3>
        <p class="muted">${count('approved')} approved, ${count('rejected')} rejected, ${C.length - count('approved') - count('rejected')} waiting. Only approved frames are used in the game.</p>
        <button class="b" id="rv-save">💾 Save decisions</button> <span class="muted" id="rv-saved"></span>
        <div id="rv-cands"></div>`;
      $('#rv-cands').innerHTML = C.map(c => {
        const s = d[c.id] && d[c.id].decision, imgs = c.originals.map(o => `<figure><img src="${o}"><figcaption>${o.split('/').pop().replace('.webp', '')}</figcaption></figure>`).join('');
        return `<div class="cand ${s || ''}" data-id="${c.id}"><div class="state">${c.id}</div><div class="muted">${c.what}</div>
          <div class="imgs">${imgs}<figure class="new"><img src="${c.src}"><figcaption>new</figcaption></figure></div>
          <button class="b ok" data-a="approved">✔ Approve</button><button class="b no" data-a="rejected">✘ Reject</button>
          ${c.kind !== 'wiring' ? '<button class="b" data-a="try">▶ try it</button>' : ''} <span class="muted">${s || 'waiting'}</span></div>`;
      }).join('');
      $('#rv-cands').querySelectorAll('.cand').forEach(el => {
        const c = C.find(x => x.id === el.dataset.id);
        el.querySelectorAll('[data-a]').forEach(b => {
          b.onclick = async () => {
            if (b.dataset.a === 'try') return tryCandidate(c);
            const m = dec(); m[c.id] = { decision: b.dataset.a, at: new Date().toISOString() }; setDec(m); render();
          };
        });
      });
      $('#rv-save').onclick = save;
    } else if (tab === 'combined') {
      const mode = localStorage.getItem('pair-transition') || 'xfade';
      B.innerHTML = `<h3>Scenes with combined sprites</h3><p class="muted">Opens the scene itself, so you see the entry into and the exit from each combined sprite as it plays.</p>
        <p class="muted">All ${COMBINED.reduce((n, c) => n + c.frames.length, 0)} combined sprites, by the scene that plays them. ▶ opens the scene; a sprite's name shows it here on its own (rigid, on Alan's feet).</p>
        ${COMBINED.map(c => `<div style="margin:6px 0">${c.scene ? `<button class="b" data-sc="${c.scene}">▶ ${c.label}</button>` : `<b>${c.label}</b>`}
          <div>${c.frames.map(k => `<button class="b" data-pv="${k}" style="font-size:11px">${k.replace('pair_', '')}</button>`).join('')}</div></div>`).join('')}
        <h3>Combined paintings (stills)</h3>
        ${COMBINED_STILLS.map(c => `<div style="margin:6px 0"><button class="b" data-sc="${c.scene}">▶ ${c.label}</button>
          <div>${c.stills.map(k => `<button class="b" data-st="${k}" style="font-size:11px">${k.replace('still_', '')}</button>`).join('')}</div></div>`).join('')}
        <h3>Transition in/out of a combined sprite, and from one to the next</h3>
        <label><input type="radio" name="pt" value="xfade"${mode === 'xfade' ? ' checked' : ''}> cross-fade (0.25 s)</label><br>
        <label><input type="radio" name="pt" value="gemini"${mode === 'gemini' ? ' checked' : ''}> Gemini in-between frames (every scene, once approved under New frames)</label>
        <p class="muted">The choice is kept in this browser and used by the scenes above.</p>
        <h3>Transition test: the police station</h3>
        <p class="muted">Alan steps up to Teixeira, into the chest frame and out, then the arm frame. Use the speed slider and ⏭ step.</p>
        <button class="b" data-pt="xfade">▶ cross-fade</button><button class="b" data-pt="gemini">▶ Gemini in-betweens</button><button class="b" data-pt="both">▶ both, one after the other</button>
        <div class="muted" id="rv-ptnote"></div>`;
      B.querySelectorAll('[data-pt]').forEach(b => { b.onclick = () => pairTest(b.dataset.pt); });
      B.querySelectorAll('[data-st]').forEach(b => { b.onclick = () => { $('#rv-now').textContent = b.dataset.st; G.showStill(b.dataset.st, () => wait(5000), { zoom: [1.0, 1.08] }); }; });
      B.querySelectorAll('[data-pv]').forEach(b => { b.onclick = async () => { if (ch !== 'alan') { ch = 'alan'; $('#rv-ch').value = 'alan'; } await stage(G.room && G.room.id); G.player.dir = 'e'; G.player.pose = b.dataset.pv; $('#rv-now').textContent = b.dataset.pv; }; });
      B.querySelectorAll('[data-sc]').forEach(b => { b.onclick = () => { location.href = location.pathname + '?scene=' + b.dataset.sc + '&review'; }; });
      B.querySelectorAll('[name=pt]').forEach(r => { r.onchange = () => localStorage.setItem('pair-transition', r.value); });
    }
  }
  // the first combined-sprite scene, staged on its own: into and out of the two cop pairs with either transition
  async function pairTest(which) {
    const tok = ++loopTok, modes = which === 'both' ? ['xfade', 'gemini'] : [which];
    if (ch !== 'alan') { ch = 'alan'; $('#rv-ch').value = 'alan'; }
    Object.assign(G.flags, { ch: 1, teixeira_scene: false, rui_out: true, teixeira_wall: false }); // Teixeira on the phone, the Inspector out
    if (G.room && G.room.id === 'police') G.refreshNpcs(true);
    await stage('police'); loopTok = tok;
    const cop = G.npc('npc_phone'), p = G.player, note = $('#rv-ptnote');
    if (!cop) { if (note) note.textContent = 'Teixeira is not in the station in this state.'; return; }
    let keep = null; try { keep = localStorage.getItem('pair-transition'); } catch (e) { /* private mode */ }
    try {
      for (const mode of modes) {
        if (mode === 'gemini') { // preview the painted in-betweens even before they're approved (this session only)
          for (const c of ((S.REVIEW && S.REVIEW.candidates) || []).filter(c => c.kind === 'pair-inbetween')) {
            await G.addSprite(c.id, Object.assign({ src: c.src }, c.meta)); S.applyCandidate(c, () => true);
          }
        }
        const ib = (S.CHARS.alan.frames.pairIb || {}).pair_cop_chest;
        if (note) note.textContent = mode === 'gemini' && !(ib && (ib.in || []).length) ? 'Gemini: no in-between painted yet, so this plays the cross-fade.' : (mode === 'gemini' ? 'Gemini in-betweens (preview: approve or reject them under New frames)' : 'cross-fade, 0.25 s');
        try { localStorage.setItem('pair-transition', mode); } catch (e) { /* private mode */ }
        cop.visible = true; cop.alpha = 1; cop.pose = null; S.copFace && S.copFace();
        p.pose = null; p.x = cop.x + 260; p.y = cop.y + 10; p.dir = 'w';
        await wait(500); if (tok !== loopTok) return;
        for (const k of ['pair_cop_chest', 'pair_cop_arm']) {
          await S.pairIn(cop, k); await wait(1400); if (tok !== loopTok) return;
          await S.pairOut(cop, { dir: 'w' }); await wait(700); if (tok !== loopTok) return;
        }
      }
    } finally { try { if (keep == null) localStorage.removeItem('pair-transition'); else localStorage.setItem('pair-transition', keep); } catch (e) { /* private mode */ } }
  }
  // preview a candidate in motion before deciding (this session only)
  async function tryCandidate(c) {
    if (c.meta) await G.addSprite(c.id, Object.assign({ src: c.src }, c.meta));
    const d = Object.assign({}, (S.REVIEW && S.REVIEW.saved) || {}, dec()), ok = id => id === c.id || !!(d[id] && d[id].decision === 'approved');
    S.applyCandidate(c, ok);
    if (ch !== c.char) { ch = c.char; $('#rv-ch').value = ch; await stage(); }
    const W = c.wire || {};
    if (W.walkStart || W.walkStop) return playState('walk');
    if (W.set) return playState('set:' + Object.keys(W.set)[0]).then(() => apply('walk', loopTok));
    const k = W.inbetween && Object.keys(W.inbetween)[0];
    if (k) { const [a, b] = k.split('>'); playTransition(a === 'alan_side' ? 'idle' : 'pose:' + a, 'pose:' + b); }
    const pk = W.pairIb && Object.keys(W.pairIb).find(k => k.includes('>'));
    if (pk) { const [a, b] = pk.split('>'); return tryPairStep(a, b); }
  }
  // a step between two pair paintings, played twice through its in-between (as the scenes play it in 'gemini' mode)
  async function tryPairStep(a, b) {
    const tok = ++loopTok, p = G.player;
    await stage(G.room && G.room.id); loopTok = tok;
    let keep = null; try { keep = localStorage.getItem('pair-transition'); localStorage.setItem('pair-transition', 'gemini'); } catch (e) { /* private mode */ }
    try {
      $('#rv-now').textContent = a.replace('pair_', '') + ' → ' + b.replace('pair_', '');
      for (let i = 0; i < 2; i++) {
        p.dir = 'e'; p.pose = a; await wait(1400); if (tok !== loopTok) return;
        await S.pairStep(b); await wait(1400); if (tok !== loopTok) return;
      }
    } finally { try { if (keep == null) localStorage.removeItem('pair-transition'); else localStorage.setItem('pair-transition', keep); } catch (e) { /* private mode */ } }
  }
  async function save() {
    const d = Object.assign({}, (S.REVIEW && S.REVIEW.saved) || {}, dec()), body = JSON.stringify(d, null, 1);
    if (LOCAL) {
      try { const r = await fetch('/api/approvals', { method: 'POST', headers: { 'content-type': 'application/json' }, body }); if (r.ok) { $('#rv-saved').textContent = 'saved to art/review/approvals.json'; return; } } catch (e) { /* no review server */ }
    }
    // the live site can't write to the project: download the file (and copy it) to send to Claude
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'application/json' })); a.download = 'approvals.json'; a.click();
    try { await navigator.clipboard.writeText(body); } catch (e) { /* no clipboard */ }
    $('#rv-saved').textContent = 'downloaded approvals.json (also copied): send it to Claude to commit';
  }

  // ---------------------------------------------------------------- start
  async function start() {
    G.sandbox();
    $('#game').appendChild(P);
    const chars = Object.keys(G.chars()).filter(k => arr(G.chars()[k].frames.idle).some(f => window.SPRITES[f]));
    $('#rv-ch').innerHTML = chars.map(k => `<option${k === ch ? ' selected' : ''}>${k}</option>`).join('');
    $('#rv-ch').onchange = async e => { ch = e.target.value; await stage(G.room && G.room.id); render(); };
    $('#rv-speed').oninput = e => { window.TIME_SCALE = +e.target.value; $('#rv-sv').textContent = (+e.target.value).toFixed(2).replace(/0$/, '') + '×'; };
    $('#rv-pause').onclick = () => { paused = !paused; window.STEP_DT = paused ? 1 / 30 : 0; window.HOLD = paused; window.ADVANCE = 0; $('#rv-pause').textContent = paused ? '▶ play' : '⏸ pause'; };
    $('#rv-step').onclick = () => { if (!paused) $('#rv-pause').click(); window.ADVANCE = 1; };
    const show = document.createElement('button'); show.id = 'rv-show'; show.className = 'b'; show.textContent = '⇤ review panel';
    show.style.cssText += ';background:#2b2a26;color:#eee;border:1px solid #d8b46a;border-radius:4px;padding:4px 10px;cursor:pointer';
    $('#game').appendChild(show);
    $('#rv-hide').onclick = () => { P.classList.add('hid'); show.style.display = 'block'; };
    show.onclick = () => { P.classList.remove('hid'); show.style.display = 'none'; };
    P.querySelectorAll('.tabs button').forEach(b => { b.onclick = () => { tab = b.dataset.t; render(); }; });
    await stage(); render();
  }
  // a combined-sprite scene opened from here keeps only a small "back to review" button
  if (new URLSearchParams(location.search).get('scene')) {
    const b = document.createElement('button'); b.textContent = '◀ back to the review screen';
    b.style.cssText = 'position:absolute;top:8px;left:8px;z-index:95;padding:4px 10px;background:#2b2a26;color:#eee;border:1px solid #d8b46a;border-radius:4px;cursor:pointer';
    b.onclick = () => { location.href = location.pathname + '?review'; };
    const go = () => $('#game').appendChild(b); if ($('#game')) go(); else addEventListener('load', go);
    return;
  }
  const ready = () => $('#title.ready') ? start() : setTimeout(ready, 200);
  ready();
})();
