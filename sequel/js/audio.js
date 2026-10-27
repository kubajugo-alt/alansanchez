// Recorded soundtrack (streamed, crossfaded, ducked under speech), effects and ambience (Web Audio) + ElevenLabs voice-over playback.
(function () {
  let ctx = null, master = null, musicBus = null, sfxBus = null, ambBus = null, reverb = null;
  let musicOn = true, voiceOn = true;
  let manifest = null, voiceVer = {};
  let voiceEl = null, voiceAt = 0, voiceCur = null;
  let muted = false; // mute(): silent for this page only, nothing saved (the review screen's second game)

  // iPhone: Web Audio obeys the ring/silent switch and can be suspended when the page
  // seems idle. Asking for a 'playback' audio session (like a video) and keeping a
  // silent <audio> loop running holds the session open, so sound plays continuously.
  let keepAlive = null;
  function silentLoop() {
    const n = 8000, b = new Uint8Array(44 + n), v = new DataView(b.buffer);
    const w = (o, t) => [...t].forEach((c, i) => b[o + i] = c.charCodeAt(0));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
    b.fill(128, 44);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }
  function holdSession() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* older Safari */ }
    try {
      if (!keepAlive) { keepAlive = new Audio(silentLoop()); keepAlive.loop = true; keepAlive.setAttribute('playsinline', ''); keepAlive.volume = 0.01; }
      if (keepAlive.paused) keepAlive.play().catch(() => {});
    } catch (e) { /* no media element support */ }
  }
  function init() {
    holdSession();
    if (ctx) { if (ctx.state !== 'running' && !muted) ctx.resume().catch(() => {}); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    // music: tracks -> duck (speech) -> bus (level x the player's volume) -> master
    musicBus = ctx.createGain(); musicBus.gain.value = MUSIC_LEVEL * userGain();
    musicDuck = ctx.createGain(); musicDuck.gain.value = 1; musicDuck.connect(musicBus);
    musicAn = ctx.createAnalyser(); musicAn.fftSize = 2048; musicBus.connect(musicAn);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.6 * sfxVol; sfxBus.connect(master); // (effects and ambience)
    if (sfxFiles.size) setTimeout(preloadSfx, 500);
    ambBus = ctx.createGain(); ambBus.gain.value = 1; ambBus.connect(sfxBus); // ambience loops, ducked under speech
    // synthetic hall reverb
    reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    reverb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.45;
    musicBus.connect(master); reverb.connect(wet); wet.connect(master);
    unlockPool();
    apply(0.8); // anything asked for before the first tap starts now
  }

  // effects and the cloister's organ fallback play on the effects bus
  function bus() { return sfxBus; }
  function panned(node, pan) {
    if (!pan || !ctx.createStereoPanner) { node.connect(bus()); return; }
    const p = ctx.createStereoPanner(); p.pan.value = pan; node.connect(p); p.connect(bus());
  }
  function tone(freq, t, dur, vol, type, b, attack) {
    const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.02));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(b || bus()); o.start(t); o.stop(t + dur + 0.05);
  }
  // Inharmonic church/bronze bell.
  function bell(freq, t, vol, b) {
    for (const [m, v, d] of [[0.5, 0.5, 6], [1, 1, 5], [1.19, 0.5, 3.5], [1.5, 0.35, 3], [2, 0.3, 2.5], [2.74, 0.2, 1.6]]) {
      tone(freq * m, t, d, vol * v, 'sine', b);
    }
  }
  // Strings-and-reed pad: detuned saws spread left and right, a filter that
  // slowly breathes open and shut.
  function pad(freqs, t, dur, vol) {
    for (const f of freqs) for (const det of [-6, 6]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det + (Math.random() - 0.5) * 3;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.7;
      lp.frequency.setValueAtTime(380, t); lp.frequency.linearRampToValueAtTime(900, t + dur * 0.45); lp.frequency.linearRampToValueAtTime(420, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); lp.connect(g); panned(g, det < 0 ? -0.35 : 0.35); o.start(t); o.stop(t + dur + 0.1);
    }
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);

  // ---------------------------------------------------------------- music: the recorded score
  // Every track is a file in audio/music: <id>.opus.m4a (Opus in MP4) and <id>.aac.m4a (AAC-LC),
  // both loudness-normalised to the same integrated level (docs/MUSIC.md). Opus where the browser
  // plays it in MP4, AAC otherwise. Tracks stream through <audio> elements wired into Web Audio
  // (decoded PCM would be ~75 MB a track), so nothing loads until it is needed.
  // A spec is a track id or { id, vol: number|'low'|'quiet', lowpass: Hz, start: s, dur: s, fade: s,
  // fadeIn: s, loop: bool }. Rooms set their music (engine: playMusic on entry); story scenes lay a
  // cue over it (cue(spec, { sticky })). A non-sticky cue ends at the next room change.
  const ROOM_XF = 1.5, LOOP_XF = 3, MUSIC_LEVEL = 0.5; // files at -23 LUFS: the bed sits ~10 dB under the voices
  const VOL = { full: 1, low: 0.5, quiet: 0.35 };
  const DUCK = { voice: 0.5, dry: 0.316, sung: 0.71 }; // -6 dB under lines, -10 dB under the narrator/machine/phone
  // names the procedural score used, kept so an old call never falls silent
  const LEGACY = { fado: 'tavern_day', fog: 'alfama_day', office: 'police_station', church: 'carmo_day', antiques: 'antiques_shop', tension: 'quay_cais_do_sodre', dawn: 'main_theme', sino: 'tavern_night', title: 'main_theme' };
  const VOL_KEY = 'shortest-night-music-volume';
  let musicVol = 1;
  try { const v = parseFloat(localStorage.getItem(VOL_KEY)); if (v >= 0 && v <= 1) musicVol = v; } catch (e) { /* storage unavailable */ }
  try { if (localStorage.getItem(VOL_KEY + '-off') === '1') musicOn = false; } catch (e) { /* storage unavailable */ }
  try { if (localStorage.getItem(VOL_KEY + '-voice-off') === '1') voiceOn = false; } catch (e) { /* storage unavailable */ }
  // the voices' and the effects' own levels (the menu's sliders), kept per browser like the music's
  const level = k => { try { const v = parseFloat(localStorage.getItem(VOL_KEY + k)); return v >= 0 && v <= 1 ? v : 1; } catch (e) { return 1; } };
  let voiceVol = level('-voice-level'), sfxVol = level('-sfx-level'), voiceOut = null;
  let musicDuck = null, meta = {}, fmt = null;
  function format() {
    if (fmt) return fmt;
    let opus = false;
    try { const a = document.createElement('audio'); opus = !!(a.canPlayType && a.canPlayType('audio/mp4; codecs="opus"')); } catch (e) { /* no media */ }
    return (fmt = opus ? 'opus' : 'aac');
  }
  function trackUrl(id) { const m = meta[id]; return 'audio/music/' + id + '.' + format() + '.m4a' + (m && m.v ? '?v=' + m.v : ''); }
  function loadMeta() {
    return fetch('audio/music/tracks.json', { cache: 'no-cache' }).then(r => r.json()).then(j => { meta = j || {}; }).catch(() => { meta = {}; });
  }
  loadMeta();
  const userGain = () => musicVol * musicVol; // the slider is perceptual-ish: 50% is -12 dB
  function norm(spec) {
    if (typeof spec === 'function') { try { spec = spec(); } catch (e) { spec = null; } }
    if (!spec || spec === 'silence') return null;
    if (typeof spec === 'string') spec = { id: spec };
    if (!spec.id || spec.id === 'silence') return null;
    const id = LEGACY[spec.id] || spec.id;
    const vol = typeof spec.vol === 'number' ? spec.vol : VOL[spec.vol] || 1;
    return Object.assign({}, spec, { id, vol });
  }
  // a pool of media elements: unlocked by a play() inside the first tap (iOS lets them play later)
  const pool = [];
  let silentUrl = null;
  function makeEl() {
    const el = new Audio(); el.preload = 'auto'; el.setAttribute('playsinline', '');
    const gain = ctx.createGain(); gain.gain.value = 0;
    let src = null; try { src = ctx.createMediaElementSource(el); src.connect(gain); } catch (e) { src = null; }
    const p = { el, src, gain, busy: false }; pool.push(p); return p;
  }
  function unlockPool() {
    if (pool.length) return;
    silentUrl = silentUrl || silentLoop();
    for (let i = 0; i < 6; i++) {
      const p = makeEl();
      try { p.el.src = silentUrl; const r = p.el.play(); if (r) r.then(() => p.el.pause()).catch(() => {}); } catch (e) { /* ignore */ }
    }
  }
  function acquire() { const p = pool.find(x => !x.busy) || makeEl(); p.busy = true; return p; }
  function release(p) {
    if (!p || !p.busy) return;
    p.busy = false; p.el.onended = p.el.onplaying = null;
    try { p.el.pause(); } catch (e) { /* ignore */ }
    try { p.gain.disconnect(); } catch (e) { /* ignore */ }
    p.gain.gain.cancelScheduledValues(0); p.gain.gain.value = 0;
    try { p.el.removeAttribute('src'); p.el.load(); } catch (e) { /* ignore */ }
  }
  // equal-power ramps: a fade in follows sin, a fade out cos, from wherever the gain is now
  function ramp(param, to, secs, at) {
    const t = at || ctx.currentTime, from = param.value, n = 64, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = i / (n - 1); c[i] = to > from ? from + (to - from) * Math.sin(x * Math.PI / 2) : to + (from - to) * Math.cos(x * Math.PI / 2); }
    param.cancelScheduledValues(t); param.setValueAtTime(from, t);
    try { param.setValueCurveAtTime(c, t, Math.max(0.02, secs)); } catch (e) { param.linearRampToValueAtTime(to, t + secs); }
  }
  // one track: its fader (room crossfades), a low-pass (the cabin), and one or two voices (loop crossfades)
  function Track(spec) {
    this.spec = spec; this.id = spec.id; this.voices = []; this.dead = false; this.t0 = performance.now();
    this.fader = ctx.createGain(); this.fader.gain.value = 0;
    this.lp = ctx.createBiquadFilter(); this.lp.type = 'lowpass'; this.lp.Q.value = 0.5; this.lp.frequency.value = spec.lowpass || 20000;
    this.lp.connect(this.fader); this.fader.connect(musicDuck);
  }
  Track.prototype.bounds = function (el) {
    const m = meta[this.id] || {}, d = (el && isFinite(el.duration) && el.duration) || m.dur || 0;
    return { inp: m.inp || 0, loop: m.loop || m.inp || 0, out: Math.min(d || Infinity, m.out || d || Infinity) }; // loop: where a repeat comes back in (past a quiet intro)
  };
  Track.prototype.voice = function (offset, fadeIn, armOnly) {
    const p = acquire(), v = { p, started: false, ending: false, next: null };
    p.gain.gain.cancelScheduledValues(0); p.gain.gain.value = 0; p.gain.connect(this.lp);
    p.el.src = trackUrl(this.id) + (offset > 0.05 ? '#t=' + offset.toFixed(2) : '');
    p.el.muted = false; p.el.volume = 1;
    p.el.onplaying = () => { if (v.started || this.dead) return; v.started = true; ramp(p.gain.gain, 1, fadeIn); };
    p.el.onended = () => { this.drop(v); if (!this.dead && this.voices.length === 0) this.ended(); };
    v.go = () => { v.goAt = performance.now(); const r = p.el.play(); if (r && r.catch) r.catch(() => {}); };
    if (armOnly) { v.armed = true; try { p.el.load(); } catch (e) { /* ignore */ } } else v.go();
    this.voices.push(v); return v;
  };
  Track.prototype.drop = function (v) { const i = this.voices.indexOf(v); if (i >= 0) this.voices.splice(i, 1); release(v.p); };
  Track.prototype.fadeVoice = function (v, secs) {
    if (v.ending) return;
    v.ending = true;
    ramp(v.p.gain.gain, 0, secs);
    setTimeout(() => this.drop(v), secs * 1000 + 150);
  };
  Track.prototype.start = function (fadeIn) {
    const s = this.spec, b = this.bounds();
    this.fader.gain.value = s.vol;
    this.voice(s.start != null ? s.start : b.inp, fadeIn); // the voice ramps up once it is really playing
  };
  Track.prototype.stop = function (secs) {
    if (this.dead) return; this.dead = true;
    ramp(this.fader.gain, 0, secs);
    setTimeout(() => { for (const v of this.voices.slice()) this.drop(v); try { this.fader.disconnect(); } catch (e) { /* ignore */ } }, secs * 1000 + 200);
  };
  Track.prototype.retune = function (spec) { // same track, new level or filter: glide, never restart
    this.spec = spec; const t = ctx.currentTime;
    this.fader.gain.cancelScheduledValues(t); this.fader.gain.setTargetAtTime(spec.vol, t, 0.5);
    this.lp.frequency.cancelScheduledValues(t); this.lp.frequency.setTargetAtTime(spec.lowpass || 20000, t, 0.4);
  };
  // the end of the file (a track that doesn't loop): its cue is over
  Track.prototype.ended = function () { if (this === active) { if (this.isCue) endCue(this.spec.fade || 2); else { active = null; } } };
  // runs a few times a second: loop crossfades, timed cues
  Track.prototype.tick = function () {
    if (this.dead) return;
    const v = this.voices.filter(x => !x.ending && !x.armed).pop(); if (!v || !v.started) return;
    const el = v.p.el, t = el.currentTime, s = this.spec, b = this.bounds(el);
    if (s.dur) { // a timed excerpt: fade out at its end
      const end = (s.start != null ? s.start : b.inp) + s.dur, fade = s.fade || 2;
      if (t >= end - fade && this === active) { if (this.isCue) endCue(fade); else { stopActive(fade); } }
      return;
    }
    if (s.loop === false || !isFinite(b.out)) return;
    // loop: a second copy starts LOOP_XF before the end and the two cross over (no seam, no cut)
    // the next copy is loaded and waiting, cued to its start, well before it is needed
    if (!v.next && t >= b.out - LOOP_XF - 12) v.next = this.voice(b.loop, LOOP_XF, true);
    if (v.next && v.next.armed && t >= b.out - LOOP_XF - 0.15) {
      const nv = v.next; nv.armed = false; nv.go();
      const go = () => this.fadeVoice(v, Math.max(0.3, Math.min(LOOP_XF, b.out - el.currentTime - 0.05)));
      const chk = setInterval(() => { if (nv.started || this.dead || el.currentTime >= b.out - LOOP_XF) { clearInterval(chk); go(); } }, 40);
      this.loops = (this.loops || 0) + 1; logMusic('loop', this.id, { at: +t.toFixed(2) });
      nv.p.el.addEventListener('playing', () => logMusic('loop-in', this.id, { lag: Math.round(performance.now() - nv.goAt) }), { once: true });
    }
  };
  let active = null, roomSpec = null, cue = null, cueSticky = false, songs = 0, musicTimer = null;
  const musicLog = [];
  function logMusic(what, id, extra) {
    const e = Object.assign({ t: Math.round(performance.now()), what, id: id || null }, extra || {});
    musicLog.push(e); if (musicLog.length > 400) musicLog.shift();
    if (window.MUSIC_DEBUG) console.log('[music]', what, id || '-', extra ? JSON.stringify(extra) : '');
  }
  function desired() { if (!musicOn || songs > 0) return null; return norm(cue ? cue.spec : roomSpec); }
  function stopActive(secs) { if (active) { active.stop(secs); logMusic('stop', active.id); active = null; } }
  // bring what is sounding in line with what should be
  function apply(xf) {
    if (!ctx || !musicDuck) return;
    const want = desired(), secs = xf != null ? xf : want && want.fadeIn != null ? want.fadeIn : ROOM_XF;
    if (!want) { stopActive(xf != null ? xf : ROOM_XF); return; }
    if (active && !active.dead && active.id === want.id && !want.restart) { // the same track: keep playing, never restart
      const s = active.spec;
      if (s.vol !== want.vol || (s.lowpass || 0) !== (want.lowpass || 0)) { active.retune(want); logMusic('retune', want.id, { vol: want.vol, lowpass: want.lowpass || 0 }); }
      else active.spec = want;
      active.isCue = !!cue;
      return;
    }
    stopActive(secs);
    const tr = new Track(want); tr.isCue = !!cue; active = tr; tr.start(secs);
    logMusic('play', want.id, { vol: want.vol, lowpass: want.lowpass || 0, cue: !!cue });
    if (!musicTimer) musicTimer = setInterval(() => { try { if (active) active.tick(); } catch (e) { /* music never stops the game */ } }, 150);
  }
  // the room's music, read afresh (a function of the story's flags: they may have moved since the room was entered)
  function roomNow() { if (window.Game && Game.room && Game.room.music !== undefined) roomSpec = Game.room.music; }
  function endCue(fade) { if (!cue) return; logMusic('cue-end', cue.spec && cue.spec.id); cue = null; cueSticky = false; roomNow(); apply(fade); }
  // the room's own music (engine, on entry): a scene's cue that isn't sticky ends here
  function playMusic(spec) {
    roomSpec = spec === undefined ? null : spec;
    if (cue && !cueSticky) { logMusic('cue-end', cue.spec && cue.spec.id); cue = null; }
    if (!ctx) return;
    apply();
  }
  // re-reads the room's music (its spec may be a function of the story's flags), cue untouched
  function refreshMusic() { roomNow(); if (ctx) apply(); }
  // a story cue over the room: cue(spec, { sticky, xf }); cue(null) hands back to the room; cue('silence') holds silence
  function setCue(spec, opts) {
    opts = opts || {};
    if (spec == null) { if (cue) { logMusic('cue-end', cue.spec && cue.spec.id); cue = null; cueSticky = false; } roomNow(); }
    else { cue = { spec }; cueSticky = !!opts.sticky; logMusic('cue', typeof spec === 'string' ? spec : spec.id, { sticky: cueSticky }); }
    if (ctx) apply(opts.xf);
  }
  // what a save needs: the scene's cue (rooms re-derive theirs); timed excerpts aren't worth restoring
  function musicState() {
    const s = cue && cue.spec;
    if (!s || typeof s === 'function' || (typeof s === 'object' && s.dur)) return { v: 1, cue: null };
    return { v: 1, cue: typeof s === 'string' ? s : Object.assign({}, s) };
  }
  function restoreMusic(st) {
    if (!st || typeof st !== 'object' || st.v !== 1 || !st.cue) return;
    if (typeof st.cue !== 'string' && !(st.cue && st.cue.id)) return;
    setCue(st.cue); // not sticky: the next room the player walks into plays its own music
  }
  // the paintings between chapters (js/story/transitions.js): the main theme, low; the chapter
  // card's Bell motif takes over straight after (S.chapter), and after Chapter V the theme carries on into the dawn
  let transCue = null;
  function transitionMusic(on, n) {
    if (on) { transCue = { id: 'main_theme', vol: 'low' }; setCue(transCue, { sticky: true }); return; }
    if (n >= 5) { setCue('main_theme', { sticky: true }); transCue = null; return; }
    const mine = transCue; transCue = null;
    setTimeout(() => { if (cue && cue.spec === mine) setCue(null); }, 1000); // (only if nothing followed it)
  }
  function setVoiceVolume(v) {
    voiceVol = Math.max(0, Math.min(1, +v || 0));
    try { localStorage.setItem(VOL_KEY + '-voice-level', String(voiceVol)); } catch (e) { /* storage unavailable */ }
    if (voiceOut) voiceOut.gain.setTargetAtTime(voiceVol, ctx.currentTime, 0.05);
    if (voiceEl) voiceEl.volume = voiceVol;
  }
  function setSfxVolume(v) {
    sfxVol = Math.max(0, Math.min(1, +v || 0));
    try { localStorage.setItem(VOL_KEY + '-sfx-level', String(sfxVol)); } catch (e) { /* storage unavailable */ }
    if (sfxBus) sfxBus.gain.setTargetAtTime(0.6 * sfxVol, ctx.currentTime, 0.05);
  }
  function setMusicVolume(v) {
    musicVol = Math.max(0, Math.min(1, +v || 0));
    try { localStorage.setItem(VOL_KEY, String(musicVol)); } catch (e) { /* storage unavailable */ }
    if (musicBus) musicBus.gain.setTargetAtTime(MUSIC_LEVEL * userGain(), ctx.currentTime, 0.08);
    for (const s of liveSongs) s.level();
  }
  // the title screen: the main theme from the first tap (the context can't start before one)
  function titleTap() {
    const t = document.getElementById('title');
    if (!t || t.classList.contains('hidden')) return;
    init();
    if (!roomSpec && !cue) playMusic('main_theme');
  }
  // Settings: a volume slider under the Music and the Voices on/off buttons, and one for the effects (kept per browser)
  function volumeSlider() {
    const add = (afterId, id, label, value, set) => {
      const btn = document.getElementById(afterId);
      if (!btn || document.getElementById(id)) return null;
      const box = document.createElement('label'); box.id = id; box.title = label;
      box.style.cssText = "display:flex;align-items:center;gap:.5em;padding:.3em 1em;font:700 .8em 'Cinzel',serif;color:var(--gold);background:rgba(28,18,10,.92);border:1px solid rgba(224,184,102,.6)";
      box.innerHTML = '<span></span><input type="range" min="0" max="100" step="1" style="width:7em;accent-color:#c8a060">';
      box.querySelector('span').textContent = label;
      const r = box.querySelector('input'); r.value = Math.round(value * 100); r.setAttribute('aria-label', label);
      const stop = e => e.stopPropagation();
      ['click', 'pointerdown', 'mousedown', 'touchstart'].forEach(ev => box.addEventListener(ev, stop));
      r.addEventListener('input', () => set(r.value / 100));
      btn.insertAdjacentElement('afterend', box);
      return box;
    };
    add('opt-music', 'opt-music-vol', 'Music volume', musicVol, setMusicVolume);
    add('opt-voice', 'opt-voice-vol', 'Voice volume', voiceVol, setVoiceVolume);
    add('opt-voice-vol', 'opt-sfx-vol', 'Effects volume', sfxVol, setSfxVolume);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', volumeSlider); else volumeSlider();
  window.addEventListener('pointerdown', titleTap, { passive: true });
  window.addEventListener('keydown', titleTap, { passive: true });

  const SFX = {
    click() { tone(1200, ctx.currentTime, 0.05, 0.05, 'square', sfxBus); },
    pickup() { const t = ctx.currentTime; tone(660, t, 0.12, 0.1, 'square', sfxBus); tone(990, t + 0.08, 0.18, 0.1, 'square', sfxBus); },
    door() { const t = ctx.currentTime; tone(110, t, 0.3, 0.2, 'triangle', sfxBus); tone(80, t + 0.12, 0.3, 0.2, 'triangle', sfxBus); },
    beep() { tone(880, ctx.currentTime, 0.4, 0.08, 'sine', sfxBus); },
    tram() { const t = ctx.currentTime; bell(1046, t, 0.08, sfxBus); bell(1046, t + 0.25, 0.08, sfxBus); },
    bigbell() { const t = ctx.currentTime; for (let i = 0; i < 4; i++) bell(N(33 - i), t + i * 0.9, 0.25 - i * 0.04, sfxBus); },
    unring() {
      const t = ctx.currentTime;
      for (const f of [55, 82.4, 110, 138.6]) {
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 2, t); o.frequency.exponentialRampToValueAtTime(f, t + 4);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.2, t + 3.5);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
        o.connect(g); g.connect(sfxBus); g.connect(reverb); o.start(t); o.stop(t + 4.3);
      }
    },
    page() { burst(ctx.currentTime, 0.12, 'highpass', 2500, 0.7, 0.03); },
    // the Sé striking the quarter overhead: four notes, distant and wet
    quarter() {
      const t = ctx.currentTime;
      [N(76), N(72), N(74), N(67)].forEach((f, i) => { bell(f, t + i * 0.7, 0.05, sfxBus); bell(f, t + i * 0.7, 0.03, reverb); });
    },
    // the Sé's hour bell, one stroke
    hour() { const t = ctx.currentTime; bell(N(45), t, 0.12, sfxBus); bell(N(45), t, 0.06, reverb); },
    // a trowel dropped on brick: a bright clank and a skitter
    trowel() {
      const t = ctx.currentTime;
      for (const [d, f, v] of [[0, 2300, 0.07], [0.09, 1700, 0.04], [0.21, 2600, 0.025]]) { tone(f, t + d, 0.25, v, 'triangle', sfxBus); tone(f * 1.53, t + d, 0.18, v * 0.6, 'sine', sfxBus); }
      burst(t, 0.08, 'highpass', 3000, 0.8, 0.04);
    },
    splash() {
      const t = ctx.currentTime, n = ctx.sampleRate * 1.2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
      const s = ctx.createBufferSource(); s.buffer = buf; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      s.connect(lp); lp.connect(sfxBus); s.start(t);
    },
  };
  // the sound pass (docs/SOUND.md), approved 2026-10-21: recorded footsteps, clips started where their sound starts, a
  // broken take left out, and the rooms' new beds and details (LOOPS / EXTRAS below). ?sound=old for the sound before it.
  const SOUND_NEW = true; // (the sound pass, approved 2026-10-21; its ?sound=old switch is gone)
  // where each clip's sound actually begins (s): the silence before it is skipped, so it lands on its action
  const LEAD = SOUND_NEW ? { beep: 0.08, broom_sweep: 0.183, cat_land: 0.334, chain_creak: 0.25, coffee_machine: 0.076, coin: 0.058, crash_wave: 0.111,
    drawer_open: 0.223, drip_hangup: 0.062, ferry_horn: 0.435, fog_lift: 0.285, hearing_aid: 0.394, knife: 0.125, knock: 0.061, lamp_click: 0.341,
    salt_fizz: 0.133, sheet_slap: 0.23, snore: 0.051, swifts: 0.361, tideclock_tick: 0.154, v_alan_chuckle: 0.1, v_alan_groan: 0.098, v_alan_mmm: 0.135,
    v_alan_sigh: 0.158, v_cop_gasp: 0.056, v_cop_moan: 0.08, v_duarte_groan: 0.084, v_duarte_hum: 0.104, v_duarte_laugh: 0.088, v_ze_moan: 0.104,
    v_ze_sigh: 0.169, water_rise_3: 0.218, yawn: 0.248 } : {};
  const BROKEN = SOUND_NEW ? new Set(['dial_click_3']) : new Set(); // a silent take: never picked
  const NEW_ONLY = /^(step_|dog_distant|paper_shuffle|drip_echo|stone_settle|canary|voices_window|wind_arches|amb_bedroom|bell_hum_soft|water_lap)|^dial_click_[4-7]$/;
  // Recorded effects (ElevenLabs sound generation) live in audio/sfx/*.mp3 and
  // are listed in audio/sfx/manifest.json; anything missing falls back to the
  // procedural versions above.
  let sfxFiles = new Set(), sfxVer = {}; const sfxBufs = {};
  const sfxUrl = name => 'audio/sfx/' + name + '.mp3' + (sfxVer[name] ? '?v=' + sfxVer[name] : '');
  async function loadSfx() {
    try {
      const r = await fetch('audio/sfx/manifest.json', { cache: 'no-cache' });
      const j = await r.json();
      sfxVer = Array.isArray(j) ? {} : j;
      sfxFiles = new Set(Array.isArray(j) ? j : Object.keys(j));
      // the sound pass's recordings stay out of the game until it is approved (some fill names the game already asks for)
      if (!SOUND_NEW) for (const n of [...sfxFiles]) if (NEW_ONLY.test(n)) sfxFiles.delete(n);
    } catch (e) { sfxFiles = new Set(); }
    if (ctx) preloadSfx();
  }
  // A sound that isn't recorded yet plays its nearest relative meanwhile (then the procedural one).
  const FALLBACK = {
    glass_set: 'glass_clink', guitar_lift: 'pickup', guitar_hang: 'pickup', bed_creak: 'boat_creak', bed_creak_wake: 'boat_creak',
    shop_bell: 'door', door_police: 'door', door_tavern: 'door', door_sealed: 'door', hatch_ladder: 'door', shop_bell_small: 'door',
    ship_bell: 'harbour_chime', kettle_boil: 'pour', phone_pickup: 'pickup', phone_hangup: 'drip_hangup', phone_dial_long: 'phone_dial',
    handcuff_click: 'click', dial_click: 'click', drawer_rattle: 'drawer_scrape', stone_notch: 'stone_wheel', hammer_lift: 'pickup',
    key_jingle: 'pickup', key_pickup: 'pickup', paper_take: 'page', book_take: 'page', brass_heavy: 'pickup', matchbox: 'pickup', knife_take: 'knife',
    sardine_catch: 'pickup', keys_ring: 'pickup', stone_clack: 'pickup', cash_register: 'coin', ladder_creak: 'stairs',
    cloth_jacket: 'sheet_slap', cloth_shirt: 'sheet_slap', cloth_sweater: 'sheet_slap', jeans_off: 'sheet_slap', belt_buckle: 'click', belt_snap: 'click',
    books_fall: 'page', applause_tavern: null, bell_great_backward: 'bell_backward', bell_hum: null, pencil: 'pencil_scribble', pencil_scribble: 'page', cat_purr: null, door_rattle: 'drawer_scrape',
    lamp_switch: 'lamp_click', clock_tick_shop: null, laundry_flap: 'sheet_slap', shop_bell_distant: null, tram_distant: null, house_creak: null, dog_distant: null, foghorn: null,
    phone_ring_office: null, paper_shuffle: 'page', card_slap: null, chair_scrape: null, murmur_laugh: null, water_pour_basin: 'pour', cuckoo: null, halyard_ping: null, water_slap: null,
    hull_creak: 'boat_creak', wind_arches: null, broom_sweep: null, footsteps_distant: null, cough_distant: null, wind_gust: null, bell_hum_soft: null, drip_echo: null, stone_settle: null, owl: null,
    payphone_coins: 'coin', phone_ring_distant: 'ringout', chapter_toll: null,
  };
  // musical, voiced or timed clips keep their exact pitch
  const NOJITTER = /^(bell_|harbour_chime|music_box|v_|ringout|beep|clock_chime|chapter_toll|ship_bell|applause)/;
  const lastTake = {}, pending = {};
  function load(name) {
    if (sfxBufs[name] instanceof AudioBuffer) return Promise.resolve(sfxBufs[name]);
    if (pending[name]) return pending[name];
    return (pending[name] = fetch(sfxUrl(name)).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b))
      .then(buf => { sfxBufs[name] = buf; delete pending[name]; return buf; }).catch(() => { delete pending[name]; return null; }));
  }
  // plays a recorded clip; returns a handle that can stop it (fading) even before it has loaded
  function playFile(name, vol, rate, pan) {
    const h = { src: null, gain: null, stopped: false, stop(fade) {
      this.stopped = true;
      if (this.gain) {
        this.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, (fade || 0.3) / 3);
        try { this.src.stop(ctx.currentTime + (fade || 0.3) + 0.1); } catch (e) { /* ignore */ }
      }
    } };
    load(name).then(buf => {
      if (!buf || h.stopped) return;
      const s = ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate || 1;
      const g = ctx.createGain(); g.gain.value = vol == null ? 1 : vol;
      let out = g;
      if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); g.connect(p); out = p; }
      s.connect(g); out.connect(sfxBus); s.start(0, Math.min(LEAD[name] || 0, buf.duration * 0.5)); h.src = s; h.gain = g;
    });
    return h;
  }
  // takes: name, name_2, name_3... picked at random, never the same twice running
  function take(name) {
    const all = [name]; for (let i = 2; sfxFiles.has(name + '_' + i); i++) all.push(name + '_' + i);
    if (BROKEN.size) { const ok = all.filter(n => !BROKEN.has(n)); if (ok.length) all.splice(0, all.length, ...ok); }
    if (all.length === 1) return name;
    let k; do { k = all[Math.floor(Math.random() * all.length)]; } while (k === lastTake[name] && all.length > 1);
    return (lastTake[name] = k);
  }
  // sfx(name, vol, rate, pan): recorded if we have it (with a little natural variation), else its fallback, else synthesised
  function sfx(name, vol, rate, pan) {
    if (!ctx || !name) return null;
    let n = name;
    for (let i = 0; i < 3 && !sfxFiles.has(n) && !SFX[n] && FALLBACK[n] !== undefined; i++) n = FALLBACK[n];
    if (!n) return null;
    if (sfxFiles.has(n)) {
      const jit = !NOJITTER.test(name);
      if (rate == null && jit) rate = 1 + (Math.random() * 2 - 1) * 0.04;
      const v = (vol == null ? 1 : vol) * (jit ? 0.9 + Math.random() * 0.2 : 1);
      return playFile(take(n), v, rate, pan);
    }
    if (SFX[n]) try { SFX[n](); } catch (e) { /* ignore */ }
    return null;
  }
  // a sound placed in the scene: panned by its x (0..1280), softer at the edges
  function sfxAt(name, x, vol, rate) { const p = Math.max(-1, Math.min(1, ((x == null ? 640 : x) - 640) / 640)) * 0.7; return sfx(name, (vol == null ? 1 : vol) * (1 - Math.abs(p) * 0.25), rate, p); }
  // short clips decoded in the background once audio is up, so first plays are on time
  // one-shots decode up front; the long beds stream in when their room opens
  function preloadSfx() {
    let i = 0;
    const beds = new Set(Object.values(LOOPS).flatMap(l => Array.isArray(l[0]) ? l.map(x => x[0]) : [l[0]]));
    const names = [...sfxFiles].filter(n => !/^amb_/.test(n) && !beds.has(n));
    const next = () => { if (i >= names.length) return; load(names[i++]).then(() => setTimeout(next, 30)); };
    next();
  }

  // ---------------------------------------------------------------- footsteps
  let noiseBuf = null;
  function noise() {
    if (noiseBuf) return noiseBuf;
    const n = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function burst(t, dur, type, freq, q, vol, wet, bus) {
    const s = ctx.createBufferSource(); s.buffer = noise();
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || sfxBus); if (wet) { const w = ctx.createGain(); w.gain.value = wet; g.connect(w); w.connect(reverb); }
    s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
  }
  const STEPS = {
    wood(t, v) { burst(t, 0.09, 'bandpass', 260 + Math.random() * 60, 1.2, 0.22 * v); burst(t, 0.03, 'bandpass', 1900, 2, 0.05 * v); },
    stone(t, v) { burst(t, 0.06, 'bandpass', 900 + Math.random() * 200, 1.5, 0.12 * v, 0.25); burst(t, 0.025, 'highpass', 3000, 1, 0.04 * v); },
    cobble(t, v) { burst(t, 0.05, 'bandpass', 1100 + Math.random() * 300, 1.6, 0.11 * v); burst(t + 0.018, 0.03, 'bandpass', 1500, 2, 0.05 * v); },
    tile(t, v) { burst(t, 0.045, 'bandpass', 2200 + Math.random() * 300, 2.2, 0.08 * v); burst(t, 0.07, 'lowpass', 300, 1, 0.08 * v); },
    wet(t, v) { burst(t, 0.07, 'bandpass', 700 + Math.random() * 200, 1.4, 0.12 * v, 0.6); burst(t + 0.01, 0.12, 'highpass', 2500, 0.7, 0.03 * v, 0.4); },
    carpet(t, v) { burst(t, 0.08, 'lowpass', 380, 0.8, 0.12 * v); },
    // a boat deck: hollow planks with a little boom under them
    deck(t, v) {
      burst(t, 0.12, 'bandpass', 180 + Math.random() * 40, 1.6, 0.22 * v);
      burst(t + 0.01, 0.2, 'lowpass', 120, 2, 0.08 * v);
      burst(t, 0.03, 'bandpass', 1500, 2, 0.04 * v);
    },
  };
  const STEP_VOL = 0.32; // the recorded steps sit under the dialogue and the room
  // footsteps sit where the walker is: panned by x, the bus swapped for a panner node
  let stepPan = null;
  function footstep(surface, vol, x) {
    if (!ctx) return;
    // recorded steps: step_<surface>, its takes picked at random, a touch of pitch so no two match
    const rec = SOUND_NEW && 'step_' + surface;
    if (rec && sfxFiles.has(rec)) {
      const v = (vol || 1) * STEP_VOL * (0.8 + Math.random() * 0.3), p = x == null ? 0 : Math.max(-1, Math.min(1, (x - 640) / 640)) * 0.6;
      playFile(take(rec), v, 1 + (Math.random() * 2 - 1) * 0.06, p); return;
    }
    if (!STEPS[surface]) return;
    if (x != null && ctx.createStereoPanner) {
      if (!stepPan) { stepPan = ctx.createStereoPanner(); stepPan.connect(sfxBus); }
      stepPan.pan.value = Math.max(-1, Math.min(1, (x - 640) / 640)) * 0.6;
    }
    const bus = sfxBus; if (x != null && stepPan) sfxBus = stepPan;
    try { STEPS[surface](ctx.currentTime, (vol || 1) * (0.85 + Math.random() * 0.3)); } catch (e) { /* ignore */ } finally { sfxBus = bus; }
  }

  // ---------------------------------------------------------------- ambience
  // A quiet bed of room sound under the music: wind, gulls, clocks, drips.
  let ambName = null, ambTimer = null, ambNodes = [];
  function bed(type, freq, q, vol, lfo) {
    const s = ctx.createBufferSource(); s.buffer = noise(); s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(vol, ctx.currentTime, 1.2);
    s.connect(f); f.connect(g); g.connect(sfxBus); s.start();
    if (lfo) {
      const o = ctx.createOscillator();
      o.frequency.value = lfo;
      const og = ctx.createGain();
      og.gain.value = vol * 0.6;
      o.connect(og);
      og.connect(g.gain);
      o.start();
      ambNodes.push(o);
    }
    ambNodes.push(s, g);
  }
  function hum(freq, vol) {
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(vol, ctx.currentTime, 1);
    o.connect(f); f.connect(g); g.connect(sfxBus); o.start(); ambNodes.push(o, g);
  }
  function gull(t, v) {
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
      const o = ctx.createOscillator(); o.type = 'triangle';
      const st = t + i * 0.32, f0 = 1500 + Math.random() * 300;
      o.frequency.setValueAtTime(f0, st); o.frequency.exponentialRampToValueAtTime(f0 * 0.62, st + 0.24);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.018 * v, st + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.27);
      const w = ctx.createGain(); w.gain.value = 0.6;
      o.connect(g); g.connect(sfxBus); g.connect(w); w.connect(reverb); o.start(st); o.stop(st + 0.3);
    }
  }
  function coo(t) {
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator(); o.type = 'sine'; const st = t + i * 0.45;
      o.frequency.setValueAtTime(330, st); o.frequency.linearRampToValueAtTime(260, st + 0.35);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.02, st + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.4);
      o.connect(g); g.connect(sfxBus); o.start(st); o.stop(st + 0.45);
    }
  }
  function drip(t, v) {
    const o = ctx.createOscillator(); o.type = 'sine'; const f0 = 900 + Math.random() * 900;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.9, t + 0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05 * v, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    const w = ctx.createGain(); w.gain.value = 1.4;
    o.connect(g); g.connect(sfxBus); g.connect(w); w.connect(reverb); o.start(t); o.stop(t + 0.15);
  }
  const AMB = {
    shop: { setup() { bed('lowpass', 500, 0.5, 0.012, 0.07); }, tick(t) {
      if (Math.random() < 0.012) gull(t, 0.4);
      if (Math.random() < 0.01) burst(t, 0.3, 'bandpass', 180, 4, 0.03);
    } },
    street: { setup() { bed('bandpass', 600, 0.4, 0.03, 0.09); }, tick(t) { if (Math.random() < 0.006) gull(t, 1); } },
    street_night: { recordedOnly: true, setup() { bed('bandpass', 380, 0.5, 0.025, 0.06); }, tick(t) { if (Math.random() < 0.02) drip(t, 0.25); } },
    shop_night: { recordedOnly: true, setup() { bed('lowpass', 300, 0.5, 0.01, 0.05); }, tick(t) { if (Math.random() < 0.004) burst(t, 0.3, 'bandpass', 160, 4, 0.025); } },
    museum: { recordedOnly: true, setup() { bed('lowpass', 250, 0.5, 0.008, 0.04); }, tick() {} },
    ferreira: { setup() {}, tick(t, s) { if (s % 5 === 0) burst(t, 0.02, 'bandpass', 2900, 4, 0.025); } },
    cistern_calm: { setup() { bed('lowpass', 200, 0.7, 0.012, 0.04); }, tick(t) { if (Math.random() < 0.03) drip(t, 0.5); } },
    cabin: { recordedOnly: true, setup() { bed('lowpass', 250, 0.6, 0.025, 0.06); }, tick() {} },
    office: { setup() { hum(100, 0.006); bed('highpass', 4000, 0.5, 0.003); }, tick(t) {
      if (Math.random() < 0.015) for (let i = 0; i < 6 + Math.random() * 10; i++) burst(t + i * (0.09 + Math.random() * 0.08), 0.03, 'bandpass', 2600, 3, 0.012);
    } },
    tavern: { setup() { bed('lowpass', 300, 0.5, 0.01, 0.05); }, tick(t) {
      if (Math.random() < 0.008) tone(2400 + Math.random() * 800, t, 0.5, 0.008, 'sine', sfxBus);
      if (Math.random() < 0.01) burst(t, 0.4, 'bandpass', 150, 6, 0.03);
    } },
    convent: { recordedOnly: true, setup() { bed('bandpass', 420, 0.6, 0.04, 0.11); }, tick(t) {
      if (Math.random() < 0.012) coo(t);
      if (Math.random() < 0.01) gull(t, 0.3);
    } },
    night: { recordedOnly: true, setup() { bed('bandpass', 300, 0.6, 0.05, 0.08); }, tick(t) {
      if (Math.random() < 0.2) for (let i = 0; i < 3; i++) tone(4300 + Math.random() * 200, t + i * 0.05, 0.03, 0.004, 'sine', sfxBus);
    } },
    clocks: { setup() {}, tick(t, s) {
      if (s % 5 === 0) burst(t, 0.02, 'bandpass', 3200, 4, 0.03);
      if (s % 5 === 2) burst(t, 0.02, 'bandpass', 2600, 4, 0.025);
      if (s % 7 === 3) burst(t, 0.02, 'bandpass', 4100, 4, 0.015);
    } },
    cistern: { setup() { hum(55, 0.004); bed('lowpass', 200, 0.7, 0.02, 0.05); }, tick(t) { if (Math.random() < 0.06) drip(t, 0.6 + Math.random() * 0.6); } },
    washhouse: { recordedOnly: true, setup() { bed('bandpass', 1800, 0.4, 0.02, 0.2); }, tick(t) { if (Math.random() < 0.02) burst(t, 0.25, 'lowpass', 600, 0.8, 0.05, 0.3); } },
    harbour: { recordedOnly: true, setup() { bed('lowpass', 400, 0.5, 0.03, 0.07); }, tick(t) { if (Math.random() < 0.03) gull(t, 0.8); } },
    // the Sé cloister: stone and pigeons, an organ practising somewhere inside, the quarters overhead
    cloister: { recordedOnly: true, setup() { bed('bandpass', 420, 0.6, 0.035, 0.1); }, tick(t, s) {
      if (Math.random() < 0.01) coo(t);
      if (s % 90 === 20 && !sfxFiles.has('organ_distant')) { const root = [N(43), N(48), N(45), N(41)][Math.floor(s / 90) % 4]; pad([root, root * 1.5, root * 2], t, 9, 0.006); }
      if (s % 450 === 300) SFX.quarter();
    } },
    tower: { recordedOnly: true, setup() { bed('bandpass', 500, 0.6, 0.04, 0.12); }, tick(t) { if (Math.random() < 0.01) coo(t); } },
    boat: { recordedOnly: true, setup() { bed('lowpass', 300, 0.6, 0.03, 0.08); }, tick() {} },
  };
  // recorded ambience loops (ElevenLabs), mixed under the procedural details
  // recorded ambience loops: volumes set so every room sits about 18-20 dB under the dialogue
  const LOOPS = { shop: ['amb_city', 0.16], street: ['amb_city', 0.5], tavern: ['amb_tavern', 0.28], clocks: [['amb_clocks', 0.4], ['grandfather_tick', 0.18]],
    office: [['amb_office', 0.4], ['fluorescent_buzz', 0.08]], cistern: [['amb_cistern', 0.4], ['torch_fire', 0.12]],
    washhouse: [['amb_washhouse', 0.2], ['tap_running', 0.12]], harbour: [['amb_harbour', 0.55], ['halyards', 0.25]], tower: ['amb_tower', 0.25],
    boat: [['boat_creak', 0.35], ['amb_harbour', 0.35], ['halyards', 0.2]], cabin: [['boat_creak', 0.3], ['hull_lap', 0.45]],
    museum: ['amb_museum', 0.35], shop_night: ['amb_shop_night', 0.35], street_night: ['amb_street_night', 0.4], ferreira: ['amb_ferreira', 0.3], cistern_calm: ['amb_cistern_calm', 0.4],
    convent: ['amb_convent', 0.4], cloister: ['amb_convent', 0.3], night: ['amb_night_city', 0.35] };
  function loopFile(name, vol) {
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(ambBus); ambNodes.push(g);
    // loop points trimmed past the mp3 padding, so the seam doesn't click or dip
    const start = buf => {
      if (!ambNodes.includes(g)) return;
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.loop = true;
      s.loopStart = Math.min(0.06, buf.duration * 0.01);
      s.loopEnd = Math.max(s.loopStart + 1, buf.duration - 0.06);
      s.connect(g);
      s.start(0, s.loopStart + Math.random() * (s.loopEnd - s.loopStart) * 0.5);
      ambNodes.push(s);
      g.gain.setTargetAtTime(vol, ctx.currentTime, 1.0);
    };
    if (sfxBufs[name] instanceof AudioBuffer) start(sfxBufs[name]);
    else fetch(sfxUrl(name)).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => { sfxBufs[name] = buf; start(buf); }).catch(() => {});
  }
  // occasional details per room, each on its own random clock: [name, every [min,max] s, vol [a,b], pan [a,b], rate [a,b]]
  const EXTRAS = {
    street: [['tram_distant', [40, 90], [0.15, 0.25], [-0.8, 0.8]], ['pigeons', [25, 55], [0.25, 0.4], [-0.6, 0.6]], ['pigeon_wings', [40, 90], [0.15, 0.25], [-0.7, 0.7]], ['gulls', [35, 80], [0.12, 0.22], [-0.9, 0.9]],
      ['laundry_flap', [20, 45], [0.15, 0.25], [-0.5, 0.5]], ['shutter_bang', [70, 150], [0.12, 0.2], [-0.8, 0.8]], ['church_bells_distant', [150, 300], [0.08, 0.14], [-0.6, 0.6]]],
    street_night: [['foghorn', [40, 90], [0.15, 0.25], [-0.4, 0.4]], ['dog_distant', [60, 140], [0.1, 0.18], [-0.9, 0.9]]],
    shop: [['page', [18, 40], [0.15, 0.3], [-0.3, 0.3]], ['tram_distant', [90, 180], [0.1, 0.18], [0.3, 0.8]], ['gulls', [70, 150], [0.06, 0.1], [0, 0.6]], ['radiator_clank', [80, 180], [0.1, 0.16], [-0.6, -0.2]]],
    shop_night: [['foghorn', [45, 100], [0.1, 0.16], [0.2, 0.6]], ['building_creak', [30, 70], [0.15, 0.25], [-0.6, 0.6]]],
    office: [['typewriter', [20, 50], [0.18, 0.3], [-0.7, 0.2]], ['office_phone', [60, 140], [0.12, 0.2], [0.3, 0.9]], ['coffee_machine', [90, 200], [0.12, 0.2], [0.5, 0.8]], ['paper_shuffle', [25, 60], [0.15, 0.25], [-0.5, 0.5]],
      ['filing_cabinet', [40, 90], [0.12, 0.2], [-0.8, 0.8]], ['corridor_steps', [35, 80], [0.1, 0.18], [-0.9, 0.9]]],
    tavern: [['glass_clink', [12, 30], [0.3, 0.5], [-0.8, 0.8]], ['glass_set', [20, 45], [0.2, 0.3], [0.4, 0.9]], ['card_slap', [10, 25], [0.25, 0.4], [-0.6, -0.3]], ['chair_scrape', [40, 90], [0.15, 0.25], [-0.8, 0.8]],
      ['tavern_laugh', [30, 70], [0.15, 0.25], [-0.6, 0.6]], ['coins_clink', [35, 80], [0.15, 0.22], [-0.5, 0.5]]],
    washhouse: [['sheet_slap', [6, 14], [0.2, 0.35], [-0.7, 0.3]], ['washing_scrub', [10, 25], [0.15, 0.25], [-0.6, 0.6]], ['wring', [15, 35], [0.2, 0.3], [-0.5, 0.5]], ['pail_set', [30, 70], [0.15, 0.25], [-0.6, 0.6]], ['pigeons', [40, 90], [0.15, 0.25], [-0.5, 0.5]]],
    clocks: [['clock_chime', [50, 110], [0.15, 0.25], [-0.7, 0.7]], ['cuckoo_clock', [120, 240], [0.12, 0.2], [-0.8, 0.8]], ['floor_creak', [40, 90], [0.1, 0.16], [-0.6, 0.6]]],
    ferreira: [['spring_ping', [40, 90], [0.1, 0.16], [-0.6, 0.6]]],
    harbour: [['gulls', [12, 30], [0.25, 0.45], [-0.9, 0.9]], ['quay_slap', [6, 14], [0.2, 0.35], [-0.6, 0.6]], ['net_rope_creak', [15, 35], [0.15, 0.25], [-0.2, 0.5]], ['ferry_horn', [60, 120], [0.12, 0.2], [0.3, 0.8]], ['foghorn', [90, 180], [0.12, 0.2], [0.3, 0.8]], ['mooring', [30, 70], [0.2, 0.3], [-0.6, 0.6]]],
    boat: [['quay_slap', [5, 12], [0.25, 0.4], [-0.7, 0.7]], ['gulls', [20, 45], [0.2, 0.35], [-0.9, 0.9]], ['ferry_horn', [70, 140], [0.1, 0.18], [0.3, 0.8]]],
    cabin: [['cabin_drip', [6, 14], [0.15, 0.25], [-0.5, 0.5]], ['timber_creak', [10, 25], [0.2, 0.3], [-0.6, 0.6]]],
    convent: [['pigeons', [20, 45], [0.2, 0.35], [-0.6, 0.6]], ['pigeon_wings', [30, 70], [0.15, 0.25], [-0.7, 0.7]], ['swifts', [40, 90], [0.12, 0.2], [-0.8, 0.8]], ['church_bells_distant', [120, 240], [0.08, 0.14], [-0.6, 0.6]]],
    cloister: [['organ_distant', [60, 120], [0.12, 0.2], [-0.3, 0.3]], ['trowel_scrape', [20, 50], [0.1, 0.18], [0, 0.4]], ['pigeon_wings', [40, 90], [0.12, 0.2], [-0.7, 0.7]]],
    museum: [['corridor_steps', [25, 60], [0.08, 0.14], [-0.8, 0.8]], ['organ_distant', [80, 160], [0.06, 0.1], [-0.3, 0.3]]],
    tower: [['tower_wind', [20, 40], [0.15, 0.25], [-0.8, 0.8]], ['pigeons', [25, 55], [0.2, 0.3], [-0.6, 0.6]], ['pigeon_wings', [30, 70], [0.15, 0.25], [-0.7, 0.7]], ['rope_creak', [30, 70], [0.1, 0.16], [-0.3, 0.3]]],
    cistern: [['drip_echo', [3, 9], [0.15, 0.35], [-0.9, 0.9]], ['stone_settle', [40, 100], [0.1, 0.18], [-0.7, 0.7]]],
    cistern_calm: [['drip_echo', [5, 12], [0.12, 0.25], [-0.9, 0.9]]],
    night: [['owl', [60, 140], [0.08, 0.14], [-0.9, 0.9]], ['candle_flutter', [30, 70], [0.08, 0.14], [0.4, 0.8]], ['foghorn', [60, 140], [0.08, 0.14], [-0.5, 0.5]]],
  };
  // the sound pass: the rooms that had no bed of their own get one, and each room a few more details of its own world
  if (SOUND_NEW) {
    Object.assign(LOOPS, {
      bedroom: [['amb_bedroom', 0.3]],                                            // Alan's attic: the street muffled by the window
      cistern: [['amb_cistern', 0.4], ['torch_fire', 0.12], ['water_lap', 0.22]], // water against the drowned steps
      tower: [['amb_tower', 0.25], ['bell_hum_soft', 0.1]],                        // the bell, never quite silent
      tavern_night: [['amb_shop_night', 0.18]],                                   // chairs up, one lantern: the night outside the door
    });
    Object.assign(EXTRAS, {
      bedroom: [['floor_creak', [25, 60], [0.12, 0.2], [-0.6, 0.6]], ['building_creak', [40, 90], [0.1, 0.16], [-0.5, 0.5]], ['tram_distant', [80, 160], [0.06, 0.1], [0.3, 0.8]],
        ['pigeons', [45, 100], [0.08, 0.14], [0.4, 0.9]], ['church_bells_distant', [180, 320], [0.05, 0.09], [-0.6, 0.6]]],
      tavern_night: [['candle_flutter', [20, 45], [0.08, 0.14], [0.3, 0.7]], ['building_creak', [35, 80], [0.1, 0.16], [-0.6, 0.6]], ['dog_distant', [90, 180], [0.05, 0.09], [-0.9, 0.9]]],
      office: EXTRAS.office.concat([['paper_shuffle', [25, 60], [0.15, 0.25], [-0.5, 0.5]]]),
    });
    EXTRAS.street = EXTRAS.street.concat([['canary', [50, 110], [0.1, 0.18], [-0.8, 0.8]], ['voices_window', [45, 100], [0.1, 0.16], [-0.8, 0.8]]]);
    EXTRAS.street_night = EXTRAS.street_night.concat([['voices_window', [90, 180], [0.05, 0.08], [-0.8, 0.8]]]);
    EXTRAS.convent = EXTRAS.convent.concat([['wind_arches', [18, 40], [0.15, 0.25], [-0.8, 0.8]]]);
    EXTRAS.night = EXTRAS.night.concat([['wind_arches', [30, 70], [0.08, 0.14], [-0.8, 0.8]], ['dog_distant', [70, 150], [0.05, 0.09], [-0.9, 0.9]]]);
    EXTRAS.cistern = EXTRAS.cistern.concat([['drip_echo', [7, 16], [0.08, 0.16], [-0.9, 0.9], [0.85, 1.1]]]);
    EXTRAS.harbour = EXTRAS.harbour.concat([['tram_distant', [70, 150], [0.06, 0.1], [-0.8, -0.3]]]); // the station's trams behind the quay
  }
  let extraTimers = [];
  const rnd = (r, d) => (r ? r[0] + Math.random() * (r[1] - r[0]) : d);
  function scheduleExtra(amb, e, first) {
    const [nm, every, vol, pan, rate] = e;
    const wait = rnd(every, 30) * (first ? 0.3 + Math.random() * 0.7 : 1);
    const t = setTimeout(() => {
      if (ambName !== amb) return;
      if (sfxFiles.has(nm) || (FALLBACK[nm] && sfxFiles.has(FALLBACK[nm]))) sfx(nm, rnd(vol, 0.3), rate ? rnd(rate) : undefined, rnd(pan, 0));
      scheduleExtra(amb, e, false);
    }, wait * 1000);
    extraTimers.push(t);
  }
  function ambience(name) {
    if (!ctx || name === ambName) return;
    ambName = name; clearInterval(ambTimer);
    const old = ambNodes; ambNodes = [];
    for (const n of old) {
      try { if (n.gain) n.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); else n.stop(ctx.currentTime + 1.5); } catch (e) { /* ignore */ }
    }
    // one or more recorded beds (a room can layer, e.g. a deck: harbour and creaking timbers)
    const lps = (LOOPS[name] ? (Array.isArray(LOOPS[name][0]) ? LOOPS[name] : [LOOPS[name]]) : []).filter(l => sfxFiles.has(l[0]));
    for (const l of lps) loopFile(l[0], l[1]);
    for (const t of extraTimers) clearTimeout(t); extraTimers = [];
    for (const e of (EXTRAS[name] || [])) scheduleExtra(name, e, true);
    const A = AMB[name]; if (!A) return;
    const lp = lps[0];
    if (lp && A.recordedOnly) { /* the loop says it all */ } else
    try { A.setup(); } catch (e) { /* ignore */ }
    let s = 0;
    ambTimer = setInterval(() => { try { A.tick(ctx.currentTime + 0.05, s++); } catch (e) { /* ignore */ } }, 200);
  }

  // ---------------------------------------------------------------- room acoustics
  // Voices and effects in a room get that room's reverb: [decay s, wet, brightness 0-1, predelay s]
  const ACOUSTICS = {
    shop: [0.55, 0.10, 0.45, 0.008], street: [0.45, 0.05, 0.6, 0.02], police: [0.5, 0.09, 0.55, 0.01],
    tavern: [0.75, 0.12, 0.4, 0.01], lavadouro: [1.5, 0.2, 0.55, 0.02], ferreira: [0.55, 0.09, 0.45, 0.008],
    convent: [1.1, 0.13, 0.6, 0.03], convent_night: [1.1, 0.13, 0.6, 0.03], se_tower: [1.7, 0.2, 0.6, 0.02],
    antiques: [0.6, 0.09, 0.4, 0.008], cais: [0.35, 0.04, 0.6, 0.03], boat: [0.3, 0.04, 0.6, 0.02],
    cabin: [0.32, 0.08, 0.35, 0.004], cistern: [3.4, 0.3, 0.38, 0.045],
  };
  if (SOUND_NEW) Object.assign(ACOUSTICS, { bedroom: [0.4, 0.07, 0.45, 0.006], cold_open: [0.4, 0.05, 0.6, 0.02] }); // a small attic; a night street
  const irCache = {};
  let roomVerb = null, roomWet = null, sfxSend = null;
  function impulse([decay, , bright, pre]) {
    const key = decay + ':' + bright + ':' + pre;
    if (irCache[key]) return irCache[key];
    const sr = ctx.sampleRate, n = Math.floor(sr * (decay + pre + 0.1)), buf = ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch); let lp = 0;
      for (let i = Math.floor(pre * sr); i < n; i++) {
        const t = i / sr - pre, k = 0.08 + 0.9 * bright * Math.exp(-t * 3 / decay); // highs die first
        lp += k * ((Math.random() * 2 - 1) - lp);
        d[i] = lp * Math.exp(-t * 6.9 / decay);
      }
    }
    return (irCache[key] = buf);
  }
  function setRoom(id) {
    if (!ctx) return;
    if (!roomVerb) {
      roomVerb = ctx.createConvolver(); roomWet = ctx.createGain(); roomWet.gain.value = 0;
      roomVerb.connect(roomWet); roomWet.connect(ctx.destination);
      sfxSend = ctx.createGain(); sfxSend.gain.value = 0.7; sfxBus.connect(sfxSend); sfxSend.connect(roomVerb);
    }
    const A = ACOUSTICS[id];
    roomWet.gain.setTargetAtTime(A ? A[1] : 0, ctx.currentTime, 0.05);
    if (A) roomVerb.buffer = impulse(A);
  }

  // ---------------------------------------------------------------- voice level
  let analyser = null, levelBuf = null;
  function voiceLevel() {
    if (!analyser || !voicePlaying()) return 0;
    analyser.getFloatTimeDomainData(levelBuf);
    let s = 0; for (let i = 0; i < levelBuf.length; i++) s += levelBuf[i] * levelBuf[i];
    return Math.min(1, Math.sqrt(s / levelBuf.length) * 6);
  }

  async function loadManifest() {
    try {
      const r = await fetch('audio/voice/manifest.json', { cache: 'no-cache' });
      const j = await r.json(); voiceVer = Array.isArray(j) ? {} : j;
      manifest = new Set(Array.isArray(j) ? j : Object.keys(j));
    } catch (e) { manifest = new Set(); }
  }
  // any tap, or coming back to the tab, wakes a context the phone has put to sleep
  const wake = () => { if (!ctx || muted) return; holdSession(); if (ctx.state !== 'running') ctx.resume().catch(() => {}); };
  ['pointerdown', 'touchend', 'keydown'].forEach(e => window.addEventListener(e, wake, { passive: true }));
  // a hidden tab goes quiet: the context sleeps until the player comes back (voicePlaying reads its clock, so the line
  // being spoken holds where it is instead of running on unheard)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return wake();
    if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  });
  function hasVoice(id) { return voiceOn && manifest && manifest.has(id); }

  // Plays a voice line. Resolves with the clip duration (seconds) once it has
  // started, or null when the line has no recording (caller falls back to a
  // reading-speed timer). Voices are decoded and played as Web Audio buffers:
  // once a tap has started the context, iOS never blocks them the way it can
  // block a fresh <audio> element; the element is only a fallback.
  const voiceBuf = new Map(); // id -> Promise<AudioBuffer>, least recently used first
  const VOICE_CACHE = 48; // decoded PCM is ~10x the mp3: keep a scene's worth, not the whole game
  function voiceUrl(id) { return 'audio/voice/' + id + '.mp3' + (voiceVer[id] ? '?v=' + voiceVer[id] : ''); }
  function loadVoice(id) {
    let p = voiceBuf.get(id);
    if (p) voiceBuf.delete(id);
    else p = fetch(voiceUrl(id)).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(b => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej)))
      .catch(e => { voiceBuf.delete(id); throw e; });
    voiceBuf.set(id, p);
    while (voiceBuf.size > VOICE_CACHE) voiceBuf.delete(voiceBuf.keys().next().value);
    return p;
  }
  function preloadVoice(id) { if (ctx && hasVoice(id)) loadVoice(id).catch(() => {}); }
  let voiceSrc = null, voiceEnd = 0;
  function ensureAnalyser() {
    if (!analyser) {
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      levelBuf = new Float32Array(analyser.fftSize);
      // the voice level after the analyser, so the lip-sync reads the recording, not the slider
      voiceOut = ctx.createGain(); voiceOut.gain.value = voiceVol;
      analyser.connect(voiceOut); voiceOut.connect(ctx.destination);
    }
  }
  async function playVoice(id, dry) {
    stopVoice();
    if (muted) return null;
    if (!hasVoice(id)) return null;
    if (ctx) {
      if (ctx.state !== 'running') { try { await ctx.resume(); } catch (e) { /* falls back below */ } }
      if (ctx.state === 'running') try {
        const buf = await Promise.race([loadVoice(id), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 6000))]);
        stopVoice();
        ensureAnalyser();
        const src = ctx.createBufferSource(); src.buffer = buf; src.connect(analyser);
        // characters speak into the room; the narrator, the answering machine and voices over stills don't
        if (roomVerb && !dry) src.connect(roomVerb);
        voiceSrc = src; voiceEnd = ctx.currentTime + buf.duration; voiceAt = ctx.currentTime; voiceCur = id;
        src.onended = () => { if (voiceSrc === src) { voiceSrc = null; duck(false); } };
        duck(true, /_sing/.test(id), dry); // a sung line keeps its guitar under it; dry voices go deeper
        src.start();
        return buf.duration;
      } catch (e) { /* decode failed or too slow: play it the old way */ }
    }
    return new Promise(resolve => {
      const el = new Audio(voiceUrl(id)); el.volume = voiceVol;
      voiceEl = el; voiceCur = id;
      let done = false;
      const fin = v => { if (!done) { done = true; resolve(v); } };
      el.addEventListener('loadedmetadata', () => fin(el.duration));
      el.addEventListener('error', () => fin(null));
      duck(true, /_sing/.test(id), dry);
      el.addEventListener('ended', () => { if (voiceEl === el) duck(false); });
      el.play().catch(() => fin(null));
      setTimeout(() => fin(null), 4000);
    });
  }
  // music and ambience step back while someone speaks: about 6 dB under a line, 10 dB under the
  // narrator over a painting, the answering machine and the phone (dry voices), and back up smoothly
  function duck(on, song, dry) {
    if (!ctx) return;
    const t = ctx.currentTime;
    if (musicDuck) { musicDuck.gain.cancelScheduledValues(t); musicDuck.gain.setTargetAtTime(on ? (song ? DUCK.sung : dry ? DUCK.dry : DUCK.voice) : 1, t, on ? 0.12 : 0.45); }
    if (ambBus) ambBus.gain.setTargetAtTime(on ? 0.4 : 1, t, on ? 0.15 : 0.5);
  }
  function voicePlaying() {
    if (voiceSrc) return ctx.currentTime < voiceEnd;
    return voiceEl && !voiceEl.paused && !voiceEl.ended;
  }
  // where the voice is now, as heard (s, for lip-sync): the audio clock moves in blocks, so the
  // real clock fills in between them, and what is scheduled reaches the speakers a little later
  let clkLast = -1, clkAt = 0;
  function voiceTime() {
    let t;
    if (voiceSrc) t = ctx.currentTime - voiceAt - (ctx.outputLatency || ctx.baseLatency || 0);
    else if (voiceEl && !voiceEl.paused) t = voiceEl.currentTime;
    else return null;
    const p = performance.now();
    if (t !== clkLast) { clkLast = t; clkAt = p; return t; }
    return t + Math.min(0.1, (p - clkAt) / 1000);
  }
  function voiceId() { return voicePlaying() ? voiceCur : null; }
  function stopVoice() {
    voiceCur = null;
    if (voiceSrc) { try { voiceSrc.onended = null; voiceSrc.stop(); } catch (e) { /* already stopped */ } voiceSrc = null; }
    if (voiceEl) { voiceEl.pause(); voiceEl = null; }
    duck(false);
  }

  // a recorded song performed in the scene (Amália's fado, Duarte's song): the score stops under it,
  // it is never ducked, and it follows the music volume. songLevel() is its loudness, 0..~1
  // (smoothed), for the performers to move with.
  let songAn = null, songBuf = null, songLvl = 0, songT = 0;
  const liveSongs = new Set();
  function songLevel() {
    if (!songAn) return 0;
    const now = performance.now(); if (now - songT < 30) return songLvl; songT = now;
    if (!songBuf) songBuf = new Float32Array(songAn.fftSize);
    songAn.getFloatTimeDomainData(songBuf);
    let e = 0; for (let i = 0; i < songBuf.length; i++) e += songBuf[i] * songBuf[i];
    const v = Math.min(1, Math.sqrt(e / songBuf.length) * 5);
    songLvl += (v - songLvl) * 0.25;
    return songLvl;
  }
  function playSong(url, vol) {
    const base = vol == null ? 0.9 : vol;
    let p = null, g = null, el;
    if (ctx) {
      p = acquire();
      el = p.el;
      if (p.src) {
        g = ctx.createGain();
        p.gain.gain.cancelScheduledValues(0);
        p.gain.gain.value = 1;
        p.gain.connect(g);
        g.connect(ctx.destination);
        songAn = ctx.createAnalyser();
        songAn.fftSize = 1024;
        g.connect(songAn);
      }
    }
    else el = new Audio();
    const target = () => (musicOn ? base * userGain() : 0);
    const song = { el, level() { if (g) g.gain.setTargetAtTime(target(), ctx.currentTime, 0.05); else el.volume = Math.min(1, target()); } };
    if (g) g.gain.value = target(); else el.volume = Math.min(1, target());
    el.muted = false; el.src = url;
    liveSongs.add(song); songs++; logMusic('song', url.replace(/^.*\//, '').replace(/\..*$/, ''));
    apply(1.2); // the score fades out under it
    if (ambBus) ambBus.gain.setTargetAtTime(0.25, ctx.currentTime, 0.3);
    let done = false;
    const ended = new Promise(res => {
      el.addEventListener('ended', res, { once: true });
      el.addEventListener('error', res, { once: true });
      song._end = res;
    });
    const r = el.play(); if (r && r.catch) r.catch(() => {});
    ended.then(() => {
      if (done) return; done = true;
      liveSongs.delete(song); songs = Math.max(0, songs - 1); songAn = null; songLvl = 0;
      if (ambBus) ambBus.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
      if (p) release(p); else el.pause();
      if (g) setTimeout(() => { try { g.disconnect(); } catch (e) { /* ignore */ } }, 100);
      logMusic('song-end', null); apply();
    });
    song.ended = ended;
    song.stop = fadeMs => {
      const ms = fadeMs || 1200;
      if (g) ramp(g.gain, 0, ms / 1000); else {
        const v0 = el.volume;
        let i = 0;
        const iv = setInterval(() => { el.volume = Math.max(0, v0 * (1 - ++i / 12)); if (i >= 12) clearInterval(iv); }, ms / 12);
      }
      setTimeout(() => { try { el.pause(); } catch (e) { /* ignore */ } song._end(); }, ms + 30);
    };
    return song;
  }
  function setMusic(on) {
    musicOn = !!on;
    try { localStorage.setItem(VOL_KEY + '-off', musicOn ? '0' : '1'); } catch (e) { /* storage unavailable */ }
    for (const s of liveSongs) s.level();
    apply();
  }
  // levels for tests and tuning: RMS in dBFS of the music bus and of the voice now playing
  let musicAn = null, meterBuf = null;
  function rmsDb(an) {
    if (!an) return -120;
    if (!meterBuf || meterBuf.length !== an.fftSize) meterBuf = new Float32Array(an.fftSize);
    an.getFloatTimeDomainData(meterBuf);
    let e = 0;
    for (let i = 0; i < meterBuf.length; i++) e += meterBuf[i] * meterBuf[i];
    return 10 * Math.log10(e / meterBuf.length + 1e-12);
  }
  function meter() { return { music: rmsDb(musicAn), voice: voicePlaying() ? rmsDb(analyser) : -120, duck: musicDuck ? musicDuck.gain.value : 1, song: songAn ? rmsDb(songAn) : -120 }; }
  function setVoice(on) {
    voiceOn = on; if (!on) stopVoice();
    try { localStorage.setItem(VOL_KEY + '-voice-off', on ? '0' : '1'); } catch (e) { /* storage unavailable */ }
  }
  function mute() { muted = true; stopVoice(); if (ctx) ctx.suspend().catch(() => {}); }

  window.Sound = {
    init, playMusic, playSong, songLevel, sfx, sfxAt, loadSfx, step: footstep, ambience, setRoom, voiceLevel, voiceTime, voiceId, playVoice, preloadVoice, stopVoice, voicePlaying, loadManifest, hasVoice, setMusic, setVoice, mute,
    cue: setCue, refreshMusic, transitionMusic, musicState, restoreMusic, setMusicVolume, setVoiceVolume, setSfxVolume, trackUrl, meter, musicLog,
    get musicOn() { return musicOn; }, get voiceOn() { return voiceOn; }, get musicVolume() { return musicVol; },
    _wave: () => {
      if (!musicAn) return null;
      const d = new Float32Array(musicAn.fftSize);
      musicAn.getFloatTimeDomainData(d);
      return Array.from(d);
    }, // (diagnostics)
    _voices: () => active ? active.voices.map(v => ({ t: +v.p.el.currentTime.toFixed(2), g: +v.p.gain.gain.value.toFixed(3), armed: !!v.armed, started: v.started, ending: v.ending, rs: v.p.el.readyState })) : [], // (diagnostics)
    get nowPlaying() { return active && !active.dead ? active.id : null; }, get musicCue() { return cue ? cue.spec : null; },
  };
})();
