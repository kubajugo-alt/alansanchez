// The walk lab (?scene=walklab): a test bench for walk cycles. Not in index.html: main.js loads it only for that
// preview. A character walks across a room at the game's own speed (left, right, up and down the room), with the
// cycle it uses now or a candidate cycle from the review screen, in slow motion or frame by frame. Under his feet a
// trail of dots marks where each planted foot touches the floor: on a good walk they stay put; a streak is a slide.
// The panel also measures every frame of the cycle from the art itself:
//   size   the head's width against the cycle's median frame (a frame drawn bigger or smaller makes him pulse)
//   rise   the figure's height against the cycle's median frame (the bob: low just after the heel lands, high passing)
//   floor  where the feet touch the ground
//   slip   at each change of painting, how far the next painting's boot lands from where the planted foot stood,
//          computed from the art, the plant data (S.WALK_PLANT) and the step lengths the engine uses (walkLen), so
//          the same cycle always gives the same numbers (the live readout under the buttons depends on timing)
// Nothing here changes the game.
(function () {
  const S = window.S, { G } = S, E = window.Engine;
  const $ = s => document.querySelector(s);
  const wo = () => Object.assign({ lock: 0, blend: 'cut', timing: 'foot', bob: 'step' }, window.WALK || {}); // (actor.js WALK_DEFAULT)
  const Q = new URLSearchParams(location.search); // for recordings: &set=a|game &cycle=first|game &who=<char> &lroom=<room> &go=0
  const LIMITS = { size: 0.04, slide: 6 }; // head width within 4% of the cycle's median; a planted foot drifts under 6 px a step

  // ---------------------------------------------------------------- cycles to compare
  // each character's cycle as the game has it now, plus every candidate cycle waiting on the review screen
  // (art/review/candidates.json, wire.walkSlot over the cycle's base); main.js registered those frames' sprites
  const ORIGINAL = {};
  function cyclesFor(ch) {
    const F = S.CHARS[ch] && S.CHARS[ch].frames; if (!F) return {};
    if (!ORIGINAL[ch]) ORIGINAL[ch] = (F.walk || []).slice();
    const out = {};
    if (ORIGINAL[ch].length) out['in the game now'] = ORIGINAL[ch];
    const first = S.WALK_ORIGINAL && S.WALK_ORIGINAL[ch];
    if (first && first.join() !== ORIGINAL[ch].join()) out['first painted cycle'] = first;
    const cands = ((S.REVIEW && S.REVIEW.candidates) || []).filter(c => c.char === ch && c.wire && c.wire.walkSlot != null);
    if (cands.length) {
      const base = (cands[0].wire.walkBase || ORIGINAL[ch]).slice();
      for (const c of cands) base[c.wire.walkSlot] = c.id;
      if (base.every(k => window.SPRITES[k])) out['candidate (review screen)'] = base;
    }
    if (F.frontWalk) out['towards the camera'] = F.frontWalk;
    if (F.backWalk) out['away from the camera'] = F.backWalk;
    return out;
  }
  const WALKERS = () => Object.keys(S.CHARS).filter(ch => !/^npc_|_bed$|_floor$/.test(ch) && S.CHARS[ch].frames && (S.CHARS[ch].frames.walk || S.CHARS[ch].frames.idle));

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
    // feet on the floor: opaque columns in the bottom 5% above the feet line, in runs (a boot or a heel up on its toes still counts);
    // each foot's position is the centre of its boot (the opaque pixels of that run over the bottom 10% of the figure),
    // the same point scripts/walk_plant.py measures for S.WALK_PLANT, so a heel strike and a flat foot compare alike
    const band = Math.max(3, fig * 0.05), cols = [];
    for (let i = 0; i < W; i++) { let on = false; for (let j = Math.round(fy - band); j <= fy; j++) if (j >= 0 && a(i, j)) { on = true; break; } cols.push(on); }
    const feet = []; let s0 = -1;
    cols.concat([false]).forEach((on, i) => { if (on && s0 < 0) s0 = i; if (!on && s0 >= 0) { if (i - s0 > 3) feet.push([s0, i - 1]); s0 = -1; } });
    const boot = Math.max(6, fig * 0.10);
    const centre = ([l, r]) => { // grow the run sideways over the boot band, then the mean x of its opaque pixels
      let L = l, R = r, n = 0, sx = 0; const on = i => { for (let j = Math.round(fy - boot); j <= fy; j++) if (j >= 0 && a(i, j)) return true; return false; };
      while (L > 0 && on(L - 1)) L--; while (R < W - 1 && on(R + 1)) R++;
      for (let i = L; i <= R; i++) for (let j = Math.round(fy - boot); j <= fy; j++) if (j >= 0 && a(i, j)) { n++; sx += i; }
      return n ? sx / n : (l + r) / 2;
    };
    const feetC = feet.map(centre);
    return (MEAS[key] = { head: (ws[ws.length >> 1] || 0) / sp.h, rise: fig / sp.h, feet, feetC, sp });
  }

  // slip after each frame of a cycle, in px at the size he's drawn now: frame i is drawn with its anchor at 0, the next
  // at walkLen[i] (the engine's step, in his heights); the planted foot is frame i's floor contact nearest its plant
  // point, and the slip is how far the nearest floor contact of the next frame lands from it. null: no plant data.
  function slips(frames) {
    const P = S.WALK_PLANT || {}, F = S.CHARS[st.ch].frames, p = G.player;
    if (!frames.length || !frames.every(k => P[k]) || !F.walkLen || F.walk.join() !== frames.join()) return frames.map(() => null);
    const px = p && p.height ? p.height() : 300;
    const contacts = k => { const m = measure(k); return m ? m.feetC.map(c => (c - m.sp.ax) / m.sp.h) : null; };
    return frames.map((k, i) => {
      const n = frames[(i + 1) % frames.length], ci = contacts(k), cn = contacts(n); if (!ci || !cn || !ci.length || !cn.length) return null;
      const planted = ci.reduce((b, c) => Math.abs(c - P[k][0]) < Math.abs(b - P[k][0]) ? c : b);
      return Math.min(...cn.map(c => Math.abs(F.walkLen[i] + c - planted))) * px;
    });
  }

  // ---------------------------------------------------------------- the panel
  let st = { ch: Q.get('who') || 'alan', cycle: { first: 'first painted cycle', game: 'in the game now' }[Q.get('cycle')] || null, room: Q.get('lroom') || 'street', loop: true, speed: 1, feet: !Q.has('nofeet') };
  if (Q.get('set') === 'a') window.WALK = Object.assign({}, S.WALK_A);
  if (Q.get('set') === 'fix') window.WALK = Object.assign({}, S.WALK_FIX);
  const box = document.createElement('div');
  box.id = 'walklab';
  box.style.cssText = 'position:absolute;left:1%;top:1.5%;z-index:70;background:rgba(14,10,6,.9);border:1px solid rgba(224,184,102,.5);color:#eadcc0;font:12px/1.35 system-ui,sans-serif;padding:8px 10px;max-width:46%;pointer-events:auto';
  (document.querySelector('#game') || document.body).appendChild(box);
  const overlay = document.createElement('canvas'); overlay.width = 1280; overlay.height = 720;
  overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:65';
  (document.querySelector('#game') || document.body).appendChild(overlay);
  const og = overlay.getContext('2d');

  function render() {
    const cyc = cyclesFor(st.ch), names = Object.keys(cyc);
    if (!st.cycle || !cyc[st.cycle]) st.cycle = names[0] || null;
    const frames = st.cycle ? cyc[st.cycle] : [];
    // sizes against the cycle's own median frame (the standing frame's hair is shaped differently)
    const ms = frames.map(measure).filter(Boolean), med = v => { const a = ms.map(v).sort((p, q) => p - q); return a[a.length >> 1]; };
    const m0 = ms.length ? { head: med(m => m.head), rise: med(m => m.rise) } : null;
    const slip = slips(frames), sl = slip.filter(v => v != null);
    const slipLine = !sl.length ? '' : (() => { const avg = sl.reduce((a, b) => a + b, 0) / sl.length, mx = Math.max(...sl), at = frames[slip.indexOf(mx)];
      return `Planted foot at each change of painting: average <b>${avg.toFixed(1)} px</b>, worst <b${mx > LIMITS.slide ? ' style="color:#ff9a8a"' : ''}>${mx.toFixed(1)} px</b> (after ${at.replace(st.ch + '_', '')}).`; })();
    const sizeBad = frames.filter(k => { const m = measure(k); return m && m0 && Math.abs(m.head / m0.head - 1) > LIMITS.size; }).length;
    const rows = frames.map((k, fi) => {
      const m = measure(k); if (!m || !m0) return `<tr><td>${k}</td><td colspan=3>(not loaded)</td></tr>`;
      const size = m.head / m0.head - 1, rise = m.rise / m0.rise - 1, bad = Math.abs(size) > LIMITS.size;
      const sv = slip[fi];
      return `<tr${bad ? ' style="color:#ff9a8a"' : ''}><td>${k.replace(st.ch + '_', '')}</td><td>${(size * 100).toFixed(1)}%</td><td>${(rise * 100).toFixed(1)}%</td><td>${m.feet.length}</td><td${sv > LIMITS.slide ? ' style="color:#ff9a8a"' : ''}>${sv == null ? '' : sv.toFixed(1)}</td></tr>`;
    }).join('');
    box.innerHTML = `<b style="color:#e0b866">Walk lab</b> <span style="opacity:.7">(nothing here changes the game)</span><br>
      <label>Who <select id="wl-ch">${WALKERS().map(c => `<option${c === st.ch ? ' selected' : ''}>${c}</option>`).join('')}</select></label>
      <label>Cycle <select id="wl-cy">${names.map(n => `<option${n === st.cycle ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <label>Room <select id="wl-room">${['street', 'police', 'tavern', 'cais', 'se_cloister', 'lavadouro'].map(r => `<option${r === st.room ? ' selected' : ''}>${r}</option>`).join('')}</select></label><br>
      <button data-w="right">Walk →</button> <button data-w="left">← Walk</button> <button data-w="up">Up the room</button> <button data-w="down">Down</button>
      <label><input type="checkbox" id="wl-loop"${st.loop ? ' checked' : ''}> back and forth</label><br>
      Speed <button data-s="1">1×</button> <button data-s="0.5">½×</button> <button data-s="0.25">¼×</button> <button data-s="0">❚❚</button> <button id="wl-step">frame ▸</button>
      <label><input type="checkbox" id="wl-feet"${st.feet ? ' checked' : ''}> feet on the floor</label><br>
      Planted foot <select id="wl-lock">${[['1', 'locked'], ['0.5', 'half'], ['0', 'gliding (old)']].map(([v, n]) => `<option value="${v}"${+v === wo().lock ? ' selected' : ''}>${n}</option>`).join('')}</select>
      Between frames <select id="wl-blend">${['cut', 'dissolve', 'morph'].map(v => `<option${v === wo().blend ? ' selected' : ''}>${v}</option>`).join('')}</select>
      Timing <select id="wl-time">${[['foot', 'by the foot'], ['even', 'even (old)']].map(([v, n]) => `<option value="${v}"${v === wo().timing ? ' selected' : ''}>${n}</option>`).join('')}</select>
      Bob <select id="wl-bob">${[['frame', 'per painting (old)'], ['step', 'per step']].map(([v, n]) => `<option value="${v}"${v === wo().bob ? ' selected' : ''}>${n}</option>`).join('')}</select>
      <button id="wl-fix">Engine fix</button> <button id="wl-a">Step A</button>
      <div id="wl-slip" style="margin-top:4px;color:#cfe8b0">${slipLine}</div>
      <div id="wl-live" style="margin-top:2px;opacity:.75"></div>
      <table style="margin-top:4px;border-collapse:collapse;font-size:11px" cellpadding="1"><tr style="color:#e0b866"><td>frame</td><td>size</td><td>rise</td><td>feet</td><td>slip px</td></tr>${rows}</table>
      <div style="margin-top:3px">${frames.length ? `${frames.length} frames. Size ${sizeBad ? `<b style="color:#ff9a8a">${sizeBad} frame(s) more than ${LIMITS.size * 100}% off</b>` : 'consistent'}.` : '<b style="color:#ff9a8a">no walk cycle: this character glides</b>'}
      Rise: lowest just after a heel lands, highest passing.</div>`;
    $('#wl-ch').onchange = e => { st.ch = e.target.value; st.cycle = null; apply(); render(); };
    $('#wl-cy').onchange = e => { st.cycle = e.target.value; apply(); render(); };
    $('#wl-room').onchange = e => { st.room = e.target.value; go(); };
    $('#wl-loop').onchange = e => { st.loop = e.target.checked; };
    $('#wl-feet').onchange = e => { st.feet = e.target.checked; };
    const setW = (k, v) => { window.WALK = Object.assign({}, wo(), { [k]: v }); S.walkTiming(S.CHARS[st.ch].frames); slides.length = 0; trail.length = 0; };
    $('#wl-lock').onchange = e => setW('lock', +e.target.value);
    $('#wl-blend').onchange = e => setW('blend', e.target.value);
    $('#wl-time').onchange = e => setW('timing', e.target.value);
    $('#wl-bob').onchange = e => setW('bob', e.target.value);
    $('#wl-fix').onclick = () => { window.WALK = Object.assign({}, S.WALK_FIX); apply(); render(); };
    $('#wl-a').onclick = () => { window.WALK = Object.assign({}, S.WALK_A); const c = cyclesFor(st.ch); if (c['first painted cycle']) st.cycle = 'first painted cycle'; apply(); render(); };
    box.querySelectorAll('[data-w]').forEach(b => b.onclick = () => walk(b.dataset.w));
    box.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { const v = +b.dataset.s; window.HOLD = v === 0; window.ADVANCE = 0; window.TIME_SCALE = v || 1; });
    $('#wl-step').onclick = () => { window.HOLD = true; window.ADVANCE = (window.ADVANCE || 0) + 1; };
  }
  // the chosen cycle goes on the player figure (switched to the chosen character)
  function apply() {
    const p = G.player, cyc = cyclesFor(st.ch);
    p.ch = st.ch; p.pose = null; p.set = null;
    const F = S.CHARS[st.ch].frames;
    if (st.cycle && cyc[st.cycle] && !/camera/.test(st.cycle)) { F.walk = cyc[st.cycle].slice(); S.walkTiming(F); }
    trail.length = 0;
  }
  async function go() {
    const R = window.Engine.ROOMS || {};
    const W = (R[st.room] && R[st.room].walk) || [[0, 640], [1280, 640], [1280, 716], [0, 716]];
    const ys = W.map(p => p[1]); st.y0 = Math.min(...ys) + 8; st.y1 = Math.max(...ys) - 8;
    await G.goRoom(st.room, null, { instant: true, noEnter: true, pos: [200, Math.round((st.y0 + st.y1) / 2 + 20), 'e'] });
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
  const trail = []; let last = null, slides = [], stepMax = 0;
  function feetNow() {
    const p = G.player, key = p.cur; if (!key) return [];
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
      if (p.cur !== tick.k) { if (tick.k) { slides.push(stepMax); if (slides.length > 24) slides.shift(); } stepMax = 0; tick.k = p.cur; }
    }
    last = xs;
    for (const x of xs) trail.push([x, p.y, performance.now()]);
    while (trail.length > 400) trail.shift();
    if (st.feet) {
      for (const [x, y, t] of trail) { og.fillStyle = `rgba(255,${xs.includes(x) ? 80 : 200},60,0.75)`; og.fillRect(x - 1.5, y - 1.5, 3, 3); }
      og.strokeStyle = 'rgba(255,255,255,0.35)'; og.beginPath(); og.moveTo(0, p.y + 0.5); og.lineTo(1280, p.y + 0.5); og.stroke();
    }
    const live = $('#wl-live');
    if (live && slides.length) {
      const avg = slides.reduce((a, b) => a + b, 0) / slides.length, mx = Math.max(...slides);
      live.innerHTML = `Live (depends on timing): drift per frame average ${avg.toFixed(1)} px, worst ${mx.toFixed(1)} px · frame ${p.cur ? p.cur.replace(st.ch + '_', '') : ''}`;
    } else if (live) live.textContent = p.cur ? 'frame ' + p.cur.replace(st.ch + '_', '') : '';
  }
  S.walkLab = async function () {
    S.walkLabWalk = walk; S.walkLabBox = box; S.walkLabOverlay = overlay;
    await go();
    requestAnimationFrame(tick);
    render();
    if (window.FAST || Q.get('go') === '0') return; // (the smoke test only opens it; a recording drives it itself)
    walk('right');
  };
})();
