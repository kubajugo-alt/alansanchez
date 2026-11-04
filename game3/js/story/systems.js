// The Forgotten Rhythm — the systems the bible adds to the engine (docs/BIBLE.md, "Core mechanics"). API:
//
//   await S.cut(title, description, ...lineIds)   a cutscene, for now a described placeholder card; the lines play over it
//   await S.drown(text)            the Sea takes Alan: the short drowning, then "Try again" (the caller rewinds: loop and retry)
//   await S.choose(title, text, options)          a menu over the scene; options [{ label, value }]; returns the value
//   await S.timedChoice({ title, text, options, seconds })   the same against a clock (relaxed timing doubles it); null on time out.
//                                  Mark the right option { correct: true }: in fast test runs it is picked by itself.
//   await S.rhythm({ title, text, bars, alone })   tap three beats and a rest, the skip on the third; true if kept
//   await S.chart()                Mireya's hurricane chart: place today's pin from the radio bulletin (S.BULLETIN[ch])
//   S.relaxed()                    the global relaxed-timing setting (the menu)
//   S.failNext                     tests: set true and the next minigame fails once (to walk a death and a rewind)
(function () {
  const S = window.S, { G, F, say } = S, E = window.Engine;
  const $ = s => document.querySelector(s);
  const game = $('#game');

  // ---------------------------------------------------------------- relaxed timing (one global setting)
  const RELAX_KEY = 'forgotten-rhythm-relaxed';
  S.relaxed = () => { try { return localStorage.getItem(RELAX_KEY) === '1'; } catch (e) { return !!S._relaxed; } };
  {
    const b = $('#opt-relaxed');
    const label = () => { if (b) b.textContent = 'Relaxed timing: ' + (S.relaxed() ? 'on' : 'off'); };
    if (b) b.onclick = e => { e.stopPropagation(); const v = !S.relaxed(); try { localStorage.setItem(RELAX_KEY, v ? '1' : '0'); } catch (er) { S._relaxed = v; } label(); G.toast('Relaxed timing ' + (v ? 'on: every timed window is doubled, and the rhythm can play itself' : 'off')); };
    label();
  }
  const failing = () => { if (S.failNext) { S.failNext = false; return true; } return false; };

  // ---------------------------------------------------------------- cutscene placeholder cards
  const card = $('#cutcard');
  S.cut = async function (title, desc, ...lines) {
    E.busy++; E.cutscene++; game.classList.add('cine');
    try {
      card.querySelector('.t').textContent = title;
      card.querySelector('.d').textContent = desc || '';
      card.classList.add('on');
      await G.wait(window.FAST ? 10 : 600);
      for (const id of lines.flat()) await G.say(id, { offscreen: true });
      if (!lines.length) await G.wait(window.FAST ? 10 : Math.max(3500, (desc || '').length * 45));
    } finally {
      card.classList.remove('on'); game.classList.remove('cine'); E.busy--; E.cutscene--;
    }
  };

  // ---------------------------------------------------------------- the mini overlay (menus, timers, the rhythm)
  const mini = document.createElement('div'); mini.id = 'mini'; mini.innerHTML = '<div class="box"></div>';
  game.appendChild(mini);
  const box = mini.querySelector('.box');
  const open = html => { box.innerHTML = html; mini.classList.add('on'); E.busy++; };
  const shut = () => { mini.classList.remove('on'); box.innerHTML = ''; E.busy--; };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  S.choose = function (title, text, options) {
    return new Promise(res => {
      open(`<h3>${esc(title || '')}</h3>${text ? `<p>${text}</p>` : ''}<div class="opts"></div>`);
      const o = box.querySelector('.opts');
      options.forEach(op => { const b = document.createElement('button'); b.textContent = op.label; b.onclick = e => { e.stopPropagation(); S.sfx('click'); shut(); res(op.value); }; o.appendChild(b); });
      if (window.FAST) setTimeout(() => { const c = options.find(x => x.correct) || options[0]; shut(); res(c.value); }, 20);
    });
  };
  S.timedChoice = function ({ title, text, options, seconds }) {
    const secs = (seconds || 8) * (S.relaxed() ? 2 : 1);
    return new Promise(res => {
      open(`<h3>${esc(title || '')}</h3>${text ? `<p>${text}</p>` : ''}<div class="opts"></div><div class="timer"><i></i></div>`);
      const o = box.querySelector('.opts'), bar = box.querySelector('.timer i');
      let done = false; const t0 = performance.now();
      const finish = v => { if (done) return; done = true; clearInterval(iv); shut(); res(v); };
      options.forEach(op => { const b = document.createElement('button'); b.textContent = op.label; b.onclick = e => { e.stopPropagation(); S.sfx('click'); finish(op.value); }; o.appendChild(b); });
      const iv = setInterval(() => { const k = 1 - (performance.now() - t0) / (secs * 1000); bar.style.width = Math.max(0, k * 100) + '%'; if (k <= 0) finish(null); }, 50);
      if (window.FAST) setTimeout(() => { if (failing()) return finish(null); const c = options.find(x => x.correct) || options[0]; finish(c.value); }, 20);
    });
  };

  // ---------------------------------------------------------------- the rhythm: three beats and a rest, the skip on the third
  // One bar is 2.0 s: beats at 0, 0.5 and 1.15 (the skip: the third comes late), then the rest. A tap within the window
  // (0.22 s, doubled when relaxed) counts. The player keeps it if three quarters of the beats are hit.
  S.BEATS = [0, 0.5, 1.15];
  S.rhythm = function (o) {
    o = o || {};
    const bars = o.bars || 4, BAR = 2.0, win = 0.22 * (S.relaxed() ? 2 : 1);
    return new Promise(res => {
      open(`<h3>${esc(o.title || 'Three beats and a rest')}</h3><p>${o.text || 'Tap on the beats (click, or press Space): one, two… three, and rest. The third comes a little late.'}</p>
        <div class="beats"><b></b><b></b><b></b><b class="rest"></b></div><button class="tap">Tap</button>
        ${S.relaxed() ? '<p><button class="auto">Let it play itself</button></p>' : ''}<p class="count" style="opacity:.7"></p>`);
      const dots = [...box.querySelectorAll('.beats b')], count = box.querySelector('.count');
      const beatsAt = []; for (let b = 0; b < bars; b++) S.BEATS.forEach(x => beatsAt.push(1.2 + b * BAR + x));
      const hit = new Array(beatsAt.length).fill(false);
      let done = false; const t0 = performance.now() / 1000;
      const tap = () => {
        const now = performance.now() / 1000 - t0;
        const i = beatsAt.findIndex((x, k) => !hit[k] && Math.abs(now - x) < win);
        S.sfx(o.sound || 'knock', 0.6);
        if (i >= 0) { hit[i] = true; const d = dots[i % 3]; d.classList.add('hit'); setTimeout(() => d.classList.remove('hit'), 160); }
      };
      const finish = ok => { if (done) return; done = true; clearInterval(iv); document.removeEventListener('keydown', key, true); shut(); res(ok); };
      const key = e => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); tap(); } };
      document.addEventListener('keydown', key, true);
      box.querySelector('.tap').onclick = e => { e.stopPropagation(); tap(); };
      const auto = box.querySelector('.auto'); if (auto) auto.onclick = e => { e.stopPropagation(); finish(true); };
      const iv = setInterval(() => {
        const now = performance.now() / 1000 - t0;
        // light the beat that is due, so the player sees the pattern (unless playing alone: then only the first bar is shown)
        dots.forEach((d, k) => d.classList.remove('lit'));
        const showUntil = o.alone ? 1.2 + BAR : 1e9;
        beatsAt.forEach((x, k) => { if (now >= x - 0.05 && now < x + 0.15 && now < showUntil) dots[k % 3].classList.add('lit'); });
        const bar = Math.max(0, Math.min(bars, Math.floor((now - 1.2) / BAR) + 1));
        count.textContent = now < 1.2 ? 'Ready…' : `Bar ${bar} of ${bars}`;
        if (now > 1.2 + bars * BAR + 0.3) { const n = hit.filter(Boolean).length; finish(n >= Math.ceil(beatsAt.length * 0.75)); }
      }, 30);
      if (window.FAST) setTimeout(() => finish(!failing()), 20);
    });
  };

  // ---------------------------------------------------------------- deaths and the rewind
  S.drown = async function (text) {
    E.busy++; E.cutscene++;
    try {
      S.sfx('water_rise', 0.6);
      await S.cut('The water rises', text || 'Alan\'s face. The water at his lips. A beat of black.', 'narr_drown_1', 'narr_drown_2');
      const m = $('#death'); m.querySelector('.msg').textContent = text || 'The Sea keeps what it takes. Try again: a moment earlier.';
      m.classList.remove('hidden');
      await new Promise(res => { const b = $('#btn-retry'); b.onclick = e => { e.stopPropagation(); m.classList.add('hidden'); res(); }; if (window.FAST) setTimeout(() => { m.classList.add('hidden'); res(); }, 20); });
      await G.say('narr_rewind', { offscreen: true });
    } finally { E.busy--; E.cutscene--; }
  };

  // ---------------------------------------------------------------- the hurricane chart (Mireya's kitchen)
  // The chart is game3/art/designs/placeholders/hurricane_chart.png (scripts/hurricane_chart.py): Web Mercator, zoom 6, tiles
  // from x 16 / y 26, cropped to 86–56 °W, 9.5–31 °N, drawn 1600 px wide. lonlat -> chart px is the same sum here.
  const merc = (lon, lat) => { const n = 64 * 256; return [(lon + 180) / 360 * n - 16 * 256, (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * n - 26 * 256]; };
  const [CX0, CY0] = merc(-86, 31), [CX1] = merc(-56, 9.5), CS = 1600 / (CX1 - CX0);
  S.chartPx = (lon, lat) => { const [x, y] = merc(lon, lat); return [(x - CX0) * CS, (y - CY0) * CS]; };
  // Hortense, 1996, as the radio reads it each morning (from Thursday; on Wednesday she is off the chart, far to the east)
  S.BULLETIN = { 3: [15.2, 57.5, 'Tropical Storm Hortense, fifteen point two north, fifty-seven point five west.'],
    4: [15.8, 60.0, 'Hortense, fifteen point eight north, sixty west. East of the Leeward Islands.'],
    5: [16.1, 62.0, 'Hurricane Hortense, category one. Sixteen point one north, sixty-two west.'],
    6: [16.6, 64.0, 'Hortense, category two. Sixteen point six north, sixty-four west. She has turned.'],
    7: [17.6, 66.0, 'Hortense, seventeen point six north, sixty-six west. Puerto Rico tonight.'],
    8: [18.5, 68.4, 'Hortense, eighteen point five north, sixty-eight point four west. Landfall in the east.'] };
  S.chart = function () {
    const f = F(), d = f.ch, b = S.BULLETIN[d];
    f.chart_pins = f.chart_pins || {};
    if (!b || f.chart_pins[d]) return Promise.resolve(true);
    const [tx, ty] = S.chartPx(-b[1], b[0]);
    return new Promise(res => {
      open(`<h3>The hurricane chart</h3><p style="font-style:italic">"${b[2]}"</p><p style="font-size:.85em;opacity:.8">Click where today's pin goes.</p>
        <div class="chartwrap" style="position:relative;display:inline-block;max-width:78vw"><img src="art/closeups/hurricane_chart.png" style="max-width:78vw;max-height:56vh;display:block;cursor:crosshair"></div>`);
      const wrap = box.querySelector('.chartwrap'), img = wrap.querySelector('img');
      const pin = (x, y, c) => { const p = document.createElement('i'); const k = img.clientWidth / 1600; p.style.cssText = `position:absolute;left:${x * k - 6}px;top:${y * k - 6}px;width:12px;height:12px;border-radius:50%;background:${c};border:2px solid #200`; wrap.appendChild(p); };
      const drawOld = () => Object.keys(f.chart_pins).forEach(k => { const q = S.BULLETIN[k]; if (q) { const [x, y] = S.chartPx(-q[1], q[0]); pin(x, y, '#a02818'); } });
      img.onload = drawOld; if (img.complete) drawOld();
      img.onclick = async e => {
        e.stopPropagation();
        const r = img.getBoundingClientRect(), k = 1600 / r.width, x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
        const ok = Math.hypot(x - tx, y - ty) < 45;
        f.chart_pins[d] = true; shut();
        await say(ok ? 'mireya_chart_ok' : 'mireya_chart_tut');
        res(ok);
      };
      if (window.FAST) setTimeout(() => { f.chart_pins[d] = true; shut(); res(true); }, 20);
    });
  };
  Object.assign(window.LINES, {
    mireya_chart_ok: ['mireya', '[looks over her glasses at the pin] Bien. You can read. Sit, eat.'],
    mireya_chart_tut: ['mireya', '[tuts, and moves the pin with one finger] There. Hortense doesn\'t go where you want, señor. Nobody does.'],
  });
})();
// ---------------------------------------------------------------- more shared pieces: the parts' hand-off, the water, the patch, the end
(function () {
  const S = window.S, { G, F } = S;
  // the last scene of a part starts the next: await S.next(n) (n's S.START plays its day card and opening)
  S.next = async n => { if (!S.START[n]) { console.warn('part ' + n + ' is not written yet'); F().ch = n; return; } await S.START[n](); };
  // water where none should be: a rising level (0..1 of the screen's height), drawn over the figures in a room's animFg
  S.water = {};
  S.drawWater = function (g, t, level, rgb) {
    if (!(level > 0)) return;
    const top = 720 - level * 720;
    g.save();
    const gr = g.createLinearGradient(0, top, 0, 720);
    gr.addColorStop(0, `rgba(${rgb || '24,44,52'},0.78)`); gr.addColorStop(1, 'rgba(6,14,18,0.95)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, 720);
    for (let x = 0; x <= 1280; x += 16) g.lineTo(x, top + Math.sin(x * 0.02 + t * 1.6) * 4 + Math.sin(x * 0.007 - t * 0.9) * 5);
    g.lineTo(1280, 720); g.closePath(); g.fill(); g.restore();
  };
  S.waterTo = async function (room, to, ms) {
    const from = S.water[room] || 0, n = window.FAST ? 2 : Math.max(2, Math.round(ms / 50));
    for (let i = 1; i <= n; i++) { S.water[room] = from + (to - from) * i / n; await G.wait(window.FAST ? 5 : 50); }
  };
  // a wet band on the ground (the street that ran with the sea): a dark sheen along a list of points
  S.drawWetBand = function (g, t, pts, w, a) {
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = `rgba(20,30,36,${a || 0.35})`; g.lineWidth = w || 40;
    g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    g.strokeStyle = `rgba(200,220,230,${0.08 + 0.05 * Math.sin(t * 2)})`; g.lineWidth = (w || 40) * 0.25; g.stroke(); g.restore();
  };
  // the dark patch beyond the reef: a soft shape blacker than the sea, that moves against the swell (k: 0..1 strength)
  S.drawPatch = function (g, t, x, y, rx, ry, k) {
    if (!(k > 0)) return;
    g.save();
    for (let i = 0; i < 5; i++) {
      const dx = Math.sin(t * 0.13 + i * 1.7) * rx * 0.25 - t * 0.6 % 6, dy = Math.cos(t * 0.11 + i) * ry * 0.2;
      const r = rx * (0.6 + i * 0.12), gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
      gr.addColorStop(0, `rgba(4,8,12,${0.5 * k})`); gr.addColorStop(1, 'rgba(4,8,12,0)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(x + dx, y + dy, r, r * ry / rx, 0, 0, 7); g.fill();
    }
    g.restore();
  };
  // the end: the credits card (index.html #ending); "Play again" restarts
  S.theEnd = async function () {
    G.showModal('ending', true);
    const b = document.getElementById('btn-again'); if (b) b.onclick = () => { G.clearSaves && G.clearSaves(); location.reload(); };
  };
})();
