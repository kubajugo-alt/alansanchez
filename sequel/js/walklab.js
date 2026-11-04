// The walk lab (?scene=walklab), Game II's copy of Game I's js/walklab.js: a test bench for walk cycles. Not in
// index.html: main.js loads it only for that preview. A figure walks across a room at the game's own speed (left,
// right, up and down the room) with one of its cycles: the Ludo walks the game plays now (Alan's vest and blazer: side,
// towards us, away), Ludo runs installed but not wired in (Vasco's), Game I's borrowed cycles (alan_w24, vasco_walk6),
// in slow motion or frame by frame. Under the feet a trail of dots marks where each planted foot touches the floor: on
// a good walk they stay put; a streak is a slide. The panel measures every frame of the cycle from the art itself:
//   size   the head's width against the cycle's median frame (a frame drawn bigger or smaller makes him pulse)
//   rise   the figure's height against the cycle's median frame (the bob)
//   feet   how many feet touch the ground
//   slip   at each change of painting, how far the next painting's boot lands from where the planted foot stood,
//          from the art and the ground the engine moves per frame: a Ludo run's step (LUDO[run].step, walkStep in
//          core.js; the planted foot taken as the boot that lands best), or, for Game I's cycles, the plant data
//          (S.WALK_PLANT) and the step lengths from it (walkLen). The same cycle always gives the same numbers.
// The figure walks as a copy of the character (CHARS.wl, the player switched to it): nothing here changes the game.
(function () {
  const S = window.S, { G } = S, E = window.Engine;
  const $ = s => document.querySelector(s);
  const arr = v => v == null ? [] : Array.isArray(v) ? v : [v];
  const LU = window.LUDO || {};
  const wo = () => Object.assign({ lock: 0, blend: 'cut', bob: 'step' }, window.WALK || {}); // (actor.js WALK_DEFAULT)
  const Q = new URLSearchParams(location.search); // &who=<figure id> &cycle=<n> &lroom=<room> &go=0 &nofeet
  const LIMITS = { size: 0.04, slide: 6 }; // head width within 4% of the cycle's median; a planted foot drifts under 6 px a step
  const ROOMS = ['hotel_lobby', 'canteras', 'mercado', 'santa_ana', 'isleta', 'museum_hall', 'beach', 'archive', 'camp', 'hotel_room'];

  // ---------------------------------------------------------------- figures and their cycles
  // every character in every outfit (S.CHARS[ch].outfits: Alan's vest, blazer and underwear, Vasco by day and dressed
  // for the parties), the Game I frames they were made from (c.game1), and Ludo walk runs nobody plays yet
  const ludoRun = frames => Object.keys(LU).find(k => LU[k].frames && LU[k].frames[0] === frames[0] && LU[k].frames.length === frames.length);
  const cyc = (name, kind, frames, step) => ({ name, kind, frames, step: step || (ludoRun(frames) && LU[ludoRun(frames)].step) || null });
  let FIGS = null;
  function figures() {
    if (FIGS) return FIGS;
    FIGS = [];
    const usedRuns = new Set();
    for (const [ch, c] of Object.entries(S.CHARS)) {
      const outfits = c.outfits || [c.frames];
      outfits.forEach(F => {
        const stand = arr(F.idle)[0] || ch, cycles = [];
        if (arr(F.walk).length > 1) cycles.push(cyc('side (in the game)', 'side', F.walk, F.walkStep));
        if (arr(F.frontWalk).length > 1) cycles.push(cyc('towards us (in the game)', 'front', F.frontWalk, F.frontStep));
        if (arr(F.backWalk).length > 1) cycles.push(cyc('away (in the game)', 'back', F.backWalk, F.backStep));
        cycles.forEach(x => { const r = ludoRun(x.frames); if (r) usedRuns.add(r); });
        FIGS.push({ id: outfits.length > 1 ? stand.replace(/_side_k$|_front$/, '') : ch, ch, c, F, cycles,
          label: ch + (outfits.length > 1 ? ' · ' + stand.replace(/_side_k$/, '') : '') + (cycles.length ? '' : ' (glides)') });
      });
      const g1 = c.game1;
      if (g1 && arr(g1.walk).length > 1) {
        const cycles = [cyc("side (Game I's cycle)", 'side', g1.walk)];
        if (arr(g1.frontWalk).length > 1) cycles.push(cyc("towards us (Game I's)", 'front', g1.frontWalk));
        if (arr(g1.backWalk).length > 1) cycles.push(cyc("away (Game I's)", 'back', g1.backWalk));
        FIGS.push({ id: ch + '_game1', ch, c, F: g1, cycles, label: ch + " · Game I's frames (not in the game)" });
      }
    }
    // Ludo walk runs not wired in (window.LUDO: <who>_walk_side / _front / _back), one figure per painted outfit
    const owners = {};
    for (const k of Object.keys(LU)) { const m = k.match(/^(.+)_walk_(side|front|back)$/); if (m && !usedRuns.has(k)) (owners[m[1]] = owners[m[1]] || {})[m[2]] = k; }
    for (const [who, runs] of Object.entries(owners)) {
      const side = runs.side && LU[runs.side], ch = Object.keys(S.CHARS).find(c => who === c || who.startsWith(c)) || who;
      const first = (side || LU[runs.front] || LU[runs.back]).frames[0];
      const F = { idle: [first], talk: [first], walk: side ? side.frames : [first], walkStep: side && side.step, poses: {} };
      const cycles = [];
      if (runs.side) cycles.push(cyc('side (Ludo, not in the game)', 'side', LU[runs.side].frames, LU[runs.side].step));
      if (runs.front) { F.frontWalk = LU[runs.front].frames; F.frontStep = LU[runs.front].step; F.front = F.frontWalk[0]; cycles.push(cyc('towards us (Ludo, not in the game)', 'front', F.frontWalk, F.frontStep)); }
      if (runs.back) { F.backWalk = LU[runs.back].frames; F.backStep = LU[runs.back].step; F.back = F.backWalk[0]; cycles.push(cyc('away (Ludo, not in the game)', 'back', F.backWalk, F.backStep)); }
      FIGS.push({ id: who + '_ludo', ch, c: S.CHARS[ch] || { scale: 1 }, F, cycles, label: who + ' · Ludo walk (not in the game)' });
    }
    return FIGS;
  }
  const fig = () => figures().find(f => f.id === st.who) || figures()[0];

  // ---------------------------------------------------------------- measuring a frame from the art
  const MEAS = {};
  function measure(key) {
    if (MEAS[key]) return MEAS[key];
    const sp = window.SPRITES[key], im = E.IMG['spr:' + key];
    if (!sp || !im || !im.naturalWidth) return null;
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const A = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height, a = (i, j) => A[(j * W + i) * 4 + 3] > 128;
    let top = 0; for (; top < H; top++) { let any = false; for (let i = 0; i < W; i++) if (a(i, top)) { any = true; break; } if (any) break; }
    const fy = Math.min(H - 1, Math.round(sp.fy)), fig = Math.max(1, fy - top);
    // head width: the median opaque span of the rows in the top 9% of the figure (arms never reach up there in a walk)
    const ws = [];
    for (let j = top; j < top + Math.max(4, fig * 0.09); j++) { let l = -1, r = -1; for (let i = 0; i < W; i++) if (a(i, j)) { if (l < 0) l = i; r = i; } if (l >= 0) ws.push(r - l); }
    ws.sort((p, q) => p - q);
    // feet on the floor: opaque columns in the bottom 5% above the feet line, in runs; each foot's position is the
    // centre of its boot (the opaque pixels of that run over the bottom 10% of the figure)
    const band = Math.max(3, fig * 0.05), cols = [];
    for (let i = 0; i < W; i++) { let on = false; for (let j = Math.round(fy - band); j <= fy; j++) if (j >= 0 && a(i, j)) { on = true; break; } cols.push(on); }
    const feet = []; let s0 = -1;
    cols.concat([false]).forEach((on, i) => { if (on && s0 < 0) s0 = i; if (!on && s0 >= 0) { if (i - s0 > 3) feet.push([s0, i - 1]); s0 = -1; } });
    const boot = Math.max(6, fig * 0.10);
    const centre = ([l, r]) => {
      let L = l, R = r, n = 0, sx = 0; const on = i => { for (let j = Math.round(fy - boot); j <= fy; j++) if (j >= 0 && a(i, j)) return true; return false; };
      while (L > 0 && on(L - 1)) L--; while (R < W - 1 && on(R + 1)) R++;
      for (let i = L; i <= R; i++) for (let j = Math.round(fy - boot); j <= fy; j++) if (j >= 0 && a(i, j)) { n++; sx += i; }
      return n ? sx / n : (l + r) / 2;
    };
    return (MEAS[key] = { head: (ws[ws.length >> 1] || 0) / sp.h, rise: fig / sp.h, feet, feetC: feet.map(centre), sp });
  }

  // slip after each frame of a side cycle, in px at the size he's drawn now: frame i is drawn with its anchor at 0, the
  // next one step on (walkLen[i] from the plant data, else the run's even step, in his heights). With plant data the
  // planted foot is frame i's floor contact nearest its plant point; without, the pair of boots that lines up best.
  // null: a cycle seen from the front or back, or no step known.
  function slips(cy, F) {
    const frames = cy ? cy.frames : [], P = S.WALK_PLANT || {}, p = G.player;
    if (!cy || cy.kind !== 'side' || !frames.length) return { method: null, v: frames.map(() => null) };
    const plant = st.timing === 'foot' && F.walkLen && F.walkLen.length === frames.length && frames.every(k => P[k]);
    const step = i => plant ? F.walkLen[i] : cy.step;
    if (!plant && !cy.step) return { method: null, v: frames.map(() => null) };
    const px = p && p.height ? p.height() : 300;
    const contacts = k => { const m = measure(k); return m ? m.feetC.map(c => (c - m.sp.ax) / m.sp.h) : null; };
    return { method: plant ? 'plant data (S.WALK_PLANT)' : `even step, ${cy.step.toFixed(4)} of his height a frame`, v: frames.map((k, i) => {
      const n = frames[(i + 1) % frames.length], ci = contacts(k), cn = contacts(n); if (!ci || !cn || !ci.length || !cn.length) return null;
      const from = plant ? [ci.reduce((b, c) => Math.abs(c - P[k][0]) < Math.abs(b - P[k][0]) ? c : b)] : ci;
      return Math.min(...from.flatMap(c0 => cn.map(c => Math.abs(step(i) + c - c0)))) * px;
    }) };
  }

  // ---------------------------------------------------------------- the panel
  const st = { who: Q.get('who') || 'alanv', cycle: +(Q.get('cycle') || 0), room: Q.get('lroom') || 'hotel_lobby', loop: true, feet: !Q.has('nofeet'), timing: 'foot' };
  const box = document.createElement('div');
  box.id = 'walklab';
  box.style.cssText = 'position:absolute;left:1%;top:1.5%;z-index:70;background:rgba(14,10,6,.9);border:1px solid rgba(224,184,102,.5);color:#eadcc0;font:12px/1.35 system-ui,sans-serif;padding:8px 10px;max-width:46%;max-height:94%;overflow:auto;pointer-events:auto';
  (document.querySelector('#game') || document.body).appendChild(box);
  const overlay = document.createElement('canvas'); overlay.width = 1280; overlay.height = 720;
  overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:65';
  (document.querySelector('#game') || document.body).appendChild(overlay);
  const og = overlay.getContext('2d');
  const short = k => k.replace(/^.*?_(walk_(?:side|front|back)_|w24_|walk6_)/, '');

  function render() {
    const f = fig(), cy = f.cycles[st.cycle] || f.cycles[0] || null;
    if (cy && !f.cycles[st.cycle]) st.cycle = 0;
    const frames = cy ? cy.frames : [];
    const ms = frames.map(measure).filter(Boolean), med = v => { const a = ms.map(v).sort((p, q) => p - q); return a[a.length >> 1]; };
    const m0 = ms.length ? { head: med(m => m.head), rise: med(m => m.rise) } : null;
    const W = E.CHARS.wl ? E.CHARS.wl.frames : f.F, sl = slips(cy, W), slip = sl.v, ok = slip.filter(v => v != null);
    const slipLine = !ok.length ? (cy && cy.kind !== 'side' ? 'Slip is measured on side cycles (a walk towards or away from us plants its feet in depth).' : '') : (() => {
      const avg = ok.reduce((a, b) => a + b, 0) / ok.length, mx = Math.max(...ok), worst = frames[slip.indexOf(mx)];
      return `Planted foot at each change of painting (${sl.method}): average <b>${avg.toFixed(1)} px</b>, worst <b${mx > LIMITS.slide ? ' style="color:#ff9a8a"' : ''}>${mx.toFixed(1)} px</b> (after ${short(worst)}).`;
    })();
    const sizeBad = frames.filter(k => { const m = measure(k); return m && m0 && Math.abs(m.head / m0.head - 1) > LIMITS.size; }).length;
    const rows = frames.map((k, fi) => {
      const m = measure(k); if (!m || !m0) return `<tr><td>${short(k)}</td><td colspan=4>(not loaded)</td></tr>`;
      const size = m.head / m0.head - 1, rise = m.rise / m0.rise - 1, bad = Math.abs(size) > LIMITS.size, sv = slip[fi];
      return `<tr${bad ? ' style="color:#ff9a8a"' : ''}><td>${short(k)}</td><td>${(size * 100).toFixed(1)}%</td><td>${(rise * 100).toFixed(1)}%</td><td>${m.feet.length}</td><td${sv > LIMITS.slide ? ' style="color:#ff9a8a"' : ''}>${sv == null ? '' : sv.toFixed(1)}</td></tr>`;
    }).join('');
    const rooms = ROOMS.filter(r => (E.ROOMS || {})[r]);
    const run = cy && ludoRun(cy.frames);
    box.innerHTML = `<b style="color:#e0b866">Walk lab</b> <span style="opacity:.7">(nothing here changes the game)</span><br>
      <label>Who <select id="wl-ch">${figures().map(x => `<option value="${x.id}"${x.id === f.id ? ' selected' : ''}>${x.label}</option>`).join('')}</select></label><br>
      <label>Cycle <select id="wl-cy">${f.cycles.map((x, i) => `<option value="${i}"${i === st.cycle ? ' selected' : ''}>${x.name}</option>`).join('')}</select></label>
      <label>Room <select id="wl-room">${rooms.map(r => `<option${r === st.room ? ' selected' : ''}>${r}</option>`).join('')}</select></label><br>
      <button data-w="right">Walk →</button> <button data-w="left">← Walk</button> <button data-w="up">Up the room</button> <button data-w="down">Down</button>
      <label><input type="checkbox" id="wl-loop"${st.loop ? ' checked' : ''}> back and forth</label><br>
      Speed <button data-s="1">1×</button> <button data-s="0.5">½×</button> <button data-s="0.25">¼×</button> <button data-s="0">❚❚</button> <button id="wl-step">frame ▸</button>
      <label><input type="checkbox" id="wl-feet"${st.feet ? ' checked' : ''}> feet on the floor</label><br>
      Planted foot <select id="wl-lock">${[['1', 'locked'], ['0.5', 'half'], ['0', 'gliding (game)']].map(([v, n]) => `<option value="${v}"${+v === wo().lock ? ' selected' : ''}>${n}</option>`).join('')}</select>
      Between frames <select id="wl-blend">${['cut', 'dissolve', 'morph'].map(v => `<option${v === wo().blend ? ' selected' : ''}>${v}</option>`).join('')}</select>
      Bob <select id="wl-bob">${[['frame', 'per painting'], ['step', 'per step']].map(([v, n]) => `<option value="${v}"${v === wo().bob ? ' selected' : ''}>${n}</option>`).join('')}</select>
      Timing <select id="wl-time">${[['foot', 'by the foot (plant data)'], ['even', 'even']].map(([v, n]) => `<option value="${v}"${v === st.timing ? ' selected' : ''}>${n}</option>`).join('')}</select>
      <div style="margin-top:3px;opacity:.8">${cy ? `${run ? `Ludo run <b>${run}</b>, ${LU[run].fps} fps painted, ${LU[run].steps || '?'} steps a loop; ` : ''}ground a frame: ${W.walkLen && cy.kind === 'side' && st.timing === 'foot' ? 'from the plant data' : cy.step ? cy.step.toFixed(4) + ' of his height' : 'the engine default (0.085 or 0.17)'}; drawn ${Math.round(G.player.height ? G.player.height() : 0)} px tall here.` : ''}</div>
      <div id="wl-slip" style="margin-top:4px;color:#cfe8b0">${slipLine}</div>
      <div id="wl-live" style="margin-top:2px;opacity:.75"></div>
      <table style="margin-top:4px;border-collapse:collapse;font-size:11px" cellpadding="1"><tr style="color:#e0b866"><td>frame</td><td>size</td><td>rise</td><td>feet</td><td>slip px</td></tr>${rows}</table>
      <div style="margin-top:3px">${frames.length ? `${frames.length} frames. Size ${sizeBad ? `<b style="color:#ff9a8a">${sizeBad} frame(s) more than ${LIMITS.size * 100}% off</b>` : 'consistent'}.` : '<b style="color:#ff9a8a">no walk cycle: this character glides on its standing sprite</b>'}</div>`;
    $('#wl-ch').onchange = e => { st.who = e.target.value; st.cycle = 0; apply(); render(); };
    $('#wl-cy').onchange = e => { st.cycle = +e.target.value; apply(); render(); };
    $('#wl-room').onchange = e => { st.room = e.target.value; go(); };
    $('#wl-loop').onchange = e => { st.loop = e.target.checked; };
    $('#wl-feet').onchange = e => { st.feet = e.target.checked; };
    const setW = (k, v) => { window.WALK = Object.assign({}, wo(), { [k]: v }); slides.length = 0; trail.length = 0; };
    $('#wl-lock').onchange = e => setW('lock', +e.target.value);
    $('#wl-blend').onchange = e => setW('blend', e.target.value);
    $('#wl-bob').onchange = e => setW('bob', e.target.value);
    $('#wl-time').onchange = e => { st.timing = e.target.value; apply(); render(); };
    box.querySelectorAll('[data-w]').forEach(b => b.onclick = () => walk(b.dataset.w));
    box.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { const v = +b.dataset.s; window.HOLD = v === 0; window.ADVANCE = 0; window.TIME_SCALE = v || 1; });
    $('#wl-step').onclick = () => { window.HOLD = true; window.ADVANCE = (window.ADVANCE || 0) + 1; };
  }
  // the chosen figure and cycle go on a copy of the character (CHARS.wl), and the player becomes it
  function apply() {
    const f = fig(), cy = f.cycles[st.cycle], p = G.player;
    const F = Object.assign({}, f.F, { poses: {} });
    delete F.walkLen; delete F.walkSteps; delete F.frontWalkLen; delete F.backWalkLen;
    if (cy && cy.kind === 'side') { F.walk = cy.frames.slice(); F.walkStep = cy.step || undefined; if (st.timing === 'foot') S.walkTiming(F); }
    if (cy && cy.kind === 'front') { F.frontWalk = cy.frames.slice(); F.frontStep = cy.step || undefined; F.front = F.front || cy.frames[0]; }
    if (cy && cy.kind === 'back') { F.backWalk = cy.frames.slice(); F.backStep = cy.step || undefined; F.back = F.back || cy.frames[0]; }
    E.CHARS.wl = { scale: f.c.scale || 1, frames: F };
    p.ch = 'wl'; p.pose = null; p.set = null; p.cur = null;
    trail.length = 0; slides.length = 0;
  }
  async function go() {
    const R = E.ROOMS || {};
    const W = (R[st.room] && R[st.room].walk) || [[0, 640], [1280, 640], [1280, 716], [0, 716]];
    const ys = W.map(q => q[1]); st.y0 = Math.min(...ys) + 8; st.y1 = Math.max(...ys) - 8;
    await G.goRoom(st.room, null, { instant: true, noEnter: true, noSave: true, pos: [200, Math.round((st.y0 + st.y1) / 2 + 20), 'e'] });
    if (window.Parallax && Parallax.set) Parallax.set(false); // measured in scene pixels: no parallax shift
    (E.npcs || []).forEach(n => { n.visible = false; }); // the room to himself
    apply(); render();
  }
  let walking = 0;
  async function walk(dir) {
    const p = G.player, my = ++walking, ym = (st.y0 + st.y1) / 2 + 20;
    const leg = d => d === 'right' ? [1080, p.y] : d === 'left' ? [200, p.y] : d === 'up' ? [p.x, st.y0] : [p.x, st.y1];
    let d = dir;
    if ((d === 'right' || d === 'left') && Math.abs(p.y - ym) > 40) await p.walkTo(p.x, ym);
    do {
      if (my !== walking) return;
      trail.length = 0;
      await p.walkTo(...leg(d));
      await G.wait(500);
      d = { right: 'left', left: 'right', up: 'down', down: 'up' }[d];
    } while (st.loop && my === walking);
  }

  // ---------------------------------------------------------------- feet on the floor, live
  // each drawn frame: where the frame's floor contacts land in the scene; a contact that stays from one frame to the
  // next is a planted foot, and how far it moved is its slide
  const trail = [], slides = []; let last = null, stepMax = 0, lastKey = null;
  function feetNow() {
    const p = G.player, key = p.cur; if (!key || !window.SPRITES[key]) return [];
    const m = measure(key), A = p.place(key, p.lastFlip); if (!m || !A) return [];
    const px = p.x - (p.lockDX || 0); // where the figure is drawn (actor.js drawAt)
    return m.feet.map(([x0, x1]) => { const c = (x0 + x1) / 2, sx = A.flipped ? A.sp.w - c : c; return px + A.x + sx * A.s; });
  }
  function tick() {
    requestAnimationFrame(tick);
    og.clearRect(0, 0, 1280, 720);
    const p = G.player; if (!p) return;
    const xs = p.walking ? feetNow() : [];
    if (p.walking && last) {
      for (const x of xs) { const near = last.reduce((b, y) => Math.abs(y - x) < Math.abs(b - x) ? y : b, Infinity); const d = Math.abs(near - x); if (d < 30) stepMax = Math.max(stepMax, d); }
      if (p.cur !== lastKey) { if (lastKey) { slides.push(stepMax); if (slides.length > 24) slides.shift(); } stepMax = 0; lastKey = p.cur; }
    }
    last = xs;
    for (const x of xs) trail.push([x, p.y, performance.now()]);
    while (trail.length > 400) trail.shift();
    if (st.feet) {
      for (const [x, y] of trail) { og.fillStyle = `rgba(255,${xs.includes(x) ? 80 : 200},60,0.75)`; og.fillRect(x - 1.5, y - 1.5, 3, 3); }
      og.strokeStyle = 'rgba(255,255,255,0.35)'; og.beginPath(); og.moveTo(0, p.y + 0.5); og.lineTo(1280, p.y + 0.5); og.stroke();
    }
    const live = $('#wl-live');
    if (live && slides.length) {
      const avg = slides.reduce((a, b) => a + b, 0) / slides.length, mx = Math.max(...slides);
      live.innerHTML = `Live (depends on timing): drift per frame average ${avg.toFixed(1)} px, worst ${mx.toFixed(1)} px · frame ${p.cur ? short(p.cur) : ''}`;
    } else if (live) live.textContent = p.cur ? 'frame ' + short(p.cur) : '';
  }
  S.walkLab = async function () {
    S.walkLabWalk = walk; S.walkLabBox = box; S.walkLabOverlay = overlay;
    if (!figures().some(f => f.id === st.who)) st.who = figures()[0].id;
    await go();
    requestAnimationFrame(tick);
    render();
    if (window.FAST || Q.get('go') === '0') return; // (a smoke test only opens it; a recording drives it itself)
    walk('right');
  };
})();
