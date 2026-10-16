// Procedural soundtrack (Web Audio) + ElevenLabs voice-over playback.
(function () {
  let ctx = null, master = null, musicBus = null, sfxBus = null, ambBus = null, reverb = null;
  let musicOn = true, voiceOn = true;
  let currentTrack = null, trackTimer = null, nextTime = 0, step = 0;
  let manifest = null, voiceVer = {};
  let voiceEl = null;

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
    if (ctx) { if (ctx.state !== 'running') ctx.resume().catch(() => {}); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.32;
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.6; sfxBus.connect(master);
    ambBus = ctx.createGain(); ambBus.gain.value = 1; ambBus.connect(sfxBus); // ambience loops, ducked under speech
    // synthetic hall reverb
    reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    reverb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.45;
    musicBus.connect(master); musicBus.connect(reverb); reverb.connect(wet); wet.connect(master);
  }

  // The guitarra portuguesa: Karplus-Strong strings, a plucked-position comb
  // in the excitation, paired courses (unison above, octave below) and a small
  // resonant body. Each track plays into its own bus so tracks crossfade.
  const pluckCache = {};
  function pluckBuffer(freq, bright) {
    const k = Math.round(freq) + (bright ? 'b' : '');
    if (pluckCache[k]) return pluckCache[k];
    const sr = ctx.sampleRate, n = Math.floor(sr * (freq < 200 ? 3 : 2.2)), period = Math.round(sr / freq);
    const buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    const ring = new Float32Array(period), pos = Math.max(1, Math.round(period * 0.13));
    let lp = 0;
    for (let i = 0; i < period; i++) { const r = Math.random() * 2 - 1; lp += (r - lp) * (bright ? 0.75 : 0.45); ring[i] = lp; }
    for (let i = period - 1; i >= pos; i--) ring[i] -= ring[i - pos] * 0.9; // plucked near the bridge
    const damp = freq < 200 ? 0.9985 : 0.9965;
    let idx = 0;
    for (let i = 0; i < n; i++) {
      const nxt = (idx + 1) % period;
      const v = (ring[idx] * 0.55 + ring[nxt] * 0.45) * damp;
      d[i] = ring[idx]; ring[idx] = v; idx = nxt;
    }
    let peak = 0; for (let i = 0; i < Math.min(n, sr * 0.1); i++) peak = Math.max(peak, Math.abs(d[i]));
    if (peak) for (let i = 0; i < n; i++) d[i] /= peak;
    return (pluckCache[k] = buf);
  }
  let out = null, playing = null; // the scheduling track's input; the playing track's fader
  function bus() { return out || musicBus; }
  function trackBus() {
    const gain = ctx.createGain(); gain.gain.value = 0.0001; gain.connect(musicBus);
    // a small wooden body: warm low resonance and a bright, nasal top
    const low = ctx.createBiquadFilter(); low.type = 'peaking'; low.frequency.value = 230; low.Q.value = 1.2; low.gain.value = 4;
    const top = ctx.createBiquadFilter(); top.type = 'peaking'; top.frequency.value = 2600; top.Q.value = 1.4; top.gain.value = 3;
    const air = ctx.createBiquadFilter(); air.type = 'highshelf'; air.frequency.value = 6000; air.gain.value = -6;
    low.connect(top); top.connect(air); air.connect(gain);
    return { gain, input: low };
  }
  function panned(node, pan) {
    if (!pan || !ctx.createStereoPanner) { node.connect(bus()); return; }
    const p = ctx.createStereoPanner(); p.pan.value = pan; node.connect(p); p.connect(bus());
  }
  function pluck(freq, t, vol, pan) {
    t += (Math.random() - 0.5) * 0.014; vol *= 0.85 + Math.random() * 0.3; // a human hand
    const bright = vol > 0.3;
    const courses = freq < 200 ? [[1, 1, 0], [2, 0.35, 0.006]] : [[1, 1, 0], [1.0028, 0.7, 0.004]];
    for (const [m, v, dt] of courses) {
      const src = ctx.createBufferSource(); src.buffer = pluckBuffer(freq * m, bright);
      const g = ctx.createGain(); g.gain.value = vol * v * 1.4;
      src.connect(g); panned(g, (pan || 0) + (m === 1 ? -0.08 : 0.08)); src.start(t + dt);
    }
  }
  function trill(f1, f2, t, vol, pan) { pluck(f1, t, vol, pan); pluck(f2, t + 0.07, vol * 0.7, pan); pluck(f1, t + 0.14, vol * 0.8, pan); }
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

  // Each track: tempo (sec per step) + a step function that schedules notes.
  const TRACKS = {
    fado: { spb: 0.26, fn(s, t) {
      // Am | Dm | E7 | Am  arpeggiated; the melody varies phrase to phrase
      // and the guitarra ornaments its long notes with a trill
      const chords = [[45, 57, 60, 64], [50, 57, 62, 65], [40, 56, 59, 62], [45, 57, 60, 64]];
      const bar = Math.floor(s / 8) % 4, beat = s % 8, ch = chords[bar];
      const pat = [0, 2, 1, 3, 2, 1, 3, 2];
      pluck(N(ch[pat[beat]]), t, beat === 0 ? 0.42 : 0.24, 0.15);
      if (beat === 0 || beat === 4) pluck(N(ch[0] - (beat ? 5 : 0)), t, 0.38, -0.1);
      const PH = [
        [[76, 74, 72, 71], [77, 76, 74, 72], [71, 72, 74, 68], [69, 71, 72, 69]],
        [[72, 71, 69, 72], [74, 72, 77, 76], [74, 71, 68, 71], [69, 0, 64, 69]],
        [[81, 79, 77, 76], [77, 74, 76, 77], [76, 74, 71, 68], [69, 72, 71, 69]],
      ];
      const ph = PH[Math.floor(s / 64) % PH.length], mel = ph[bar];
      if (beat % 2 === 0 && Math.floor(s / 32) % 2 === 1) {
        const n = mel[beat / 2]; if (!n) return;
        if (beat === 6 && bar === 3) trill(N(n), N(n + 2), t + 0.01, 0.3, -0.2);
        else pluck(N(n), t + 0.01, beat === 0 ? 0.36 : 0.28, -0.2);
      }
    } },
    fog: { spb: 0.5, fn(s, t) {
      if (s % 16 === 0) pad([N(45), N(52), N(57)], t, 8.5, 0.035);
      if (s % 16 === 8) pad([N(44), N(52), N(56)], t, 8.5, 0.03);
      if (s % 24 === 4) bell(N(57), t, 0.05);
      if (s % 40 === 20) foghorn(t);
      if (s % 6 === 3 && Math.random() < 0.5) pluck(N([69, 72, 76, 74, 71][Math.floor(Math.random() * 5)]), t, 0.12);
    } },
    office: { spb: 0.4, fn(s, t) {
      const bass = [40, 40, 43, 38][Math.floor(s / 8) % 4];
      if (s % 2 === 0) tone(N(bass), t, 0.35, 0.12, 'triangle');
      if (s % 8 === 4) tone(N(bass + 15), t, 1.2, 0.04, 'sine');
      if (s % 16 === 0) pad([N(52), N(55), N(59)], t, 6, 0.02);
    } },
    church: { spb: 0.6, fn(s, t) {
      const ch = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]][Math.floor(s / 8) % 4];
      if (s % 8 === 0) pad(ch.map(N), t, 5.2, 0.03);
      if (s % 16 === 0) bell(N(45), t, 0.07);
      if (s % 4 === 2) tone(N(ch[s % 3] + 12), t, 2.5, 0.025, 'sine');
    } },
    antiques: { spb: 0.25, fn(s, t) {
      // music-box waltz, slightly out of tune
      const mel = [76, 79, 83, 81, 79, 76, 74, 76, 72, 76, 79, 77, 76, 74, 71, 74];
      if (s % 2 === 0) tone(N(mel[(s / 2) % 16]) * 1.004, t, 0.9, 0.05, 'triangle');
      if (s % 6 === 0) tone(N([45, 52, 48][Math.floor(s / 6) % 3]), t, 1.2, 0.05, 'sine');
      if (s % 4 === 0) tone(3000, t, 0.03, 0.01, 'square'); // ticking
    } },
    tension: { spb: 0.3, fn(s, t) {
      if (s % 4 === 0) tone(N(33), t, 0.6, 0.18, 'triangle');
      if (s % 4 === 2) tone(N(34), t, 0.3, 0.1, 'triangle');
      if (s % 32 === 0) pad([N(45), N(48), N(51)], t, 9, 0.035);
      if (s % 24 === 12) bell(N(40), t, 0.06);
    } },
    dawn: { spb: 0.3, fn(s, t) {
      const ch = [[57, 61, 64], [62, 66, 69], [64, 68, 71], [57, 61, 64]][Math.floor(s / 8) % 4];
      pluck(N(ch[[0, 1, 2, 1][s % 4]]), t, 0.3);
      if (s % 8 === 0) pad(ch.map(n => N(n - 12)), t, 2.6, 0.02);
      if (s % 16 === 0) bell(N(69), t, 0.03);
    } },
    // "O Sino Afogado", played alone on Duarte's guitarra: slow, rubato-ish, a tolling
    // low A under each phrase like the drowned bell, ornamented long notes
    sino: { spb: 0.34, fn(s, t) {
      const chords = [[45, 57, 60, 64], [41, 57, 60, 65], [40, 56, 59, 64], [45, 57, 60, 64],
        [38, 57, 62, 65], [45, 57, 60, 64], [40, 56, 59, 62], [45, 57, 60, 69]];
      const bar = Math.floor(s / 8) % 8, beat = s % 8, ch = chords[bar];
      if (beat % 2 === 0) pluck(N(ch[[1, 2, 3, 2][beat / 2]]), t, 0.16, 0.2);
      if (beat === 0) { pluck(N(ch[0]), t, 0.34, -0.15); if (bar % 4 === 0) bell(N(33), t, 0.05); }
      const MEL = [[72, 0, 71, 69, 71, 0, 72, 74], [77, 0, 76, 74, 72, 0, 0, 0], [71, 0, 72, 74, 76, 0, 74, 72],
        [69, 0, 0, 0, 64, 0, 69, 72], [74, 0, 72, 74, 77, 0, 76, 74], [76, 0, 72, 0, 69, 0, 72, 76],
        [74, 0, 71, 68, 71, 0, 74, 71], [69, 0, 0, 0, 0, 0, 0, 0]];
      const n = MEL[bar][beat]; if (!n) return;
      const long = MEL[bar][beat + 1] === 0;
      if (long && beat === 0 && (bar === 1 || bar === 3)) trill(N(n), N(n + 2), t + 0.02, 0.32, -0.25);
      else pluck(N(n), t + 0.02, long ? 0.4 : 0.3, -0.25);
    } },
    title: { spb: 0.5, fn(s, t) {
      if (s % 16 === 0) bell(N(45), t, 0.08);
      if (s % 16 === 8) bell(N(43), t, 0.05);
      if (s % 8 === 0) pad([N(45), N(48), N(52)], t, 4.5, 0.03);
      if (s >= 16 && s % 2 === 0) pluck(N([69, 72, 76, 72, 71, 72, 74, 71][(s / 2) % 8]), t, 0.18);
    } },
  };

  function foghorn(t) {
    for (const f of [73, 73.6, 146]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.6); g.gain.linearRampToValueAtTime(0.0001, t + 3);
      o.connect(lp); lp.connect(g); g.connect(bus()); o.start(t); o.stop(t + 3.1);
    }
  }

  function playMusic(name) {
    if (!ctx) return;
    if (typeof name === 'function') name = name();
    if (name && !TRACKS[name]) name = null; // an unknown track is silence, never an error
    if (currentTrack === name) return;
    currentTrack = name;
    clearInterval(trackTimer);
    if (playing) { const old = playing, now = ctx.currentTime; old.gain.gain.cancelScheduledValues(now); old.gain.gain.setValueAtTime(old.gain.gain.value, now); old.gain.gain.linearRampToValueAtTime(0.0001, now + 1.6); setTimeout(() => old.gain.disconnect(), 9000); playing = null; }
    if (!name || !musicOn) return;
    step = 0; nextTime = ctx.currentTime + 0.1;
    const tb = trackBus(); tb.gain.gain.setValueAtTime(0.0001, ctx.currentTime); tb.gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    playing = { gain: tb.gain }; const input = tb.input;
    const tr = TRACKS[name];
    trackTimer = setInterval(() => {
      while (nextTime < ctx.currentTime + 0.25) {
        const was = out; out = input;
        try { tr.fn(step, nextTime); } catch (e) { /* never let music kill the game */ }
        out = was;
        step++; nextTime += tr.spb;
      }
    }, 60);
  }

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
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 3.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
        o.connect(g); g.connect(sfxBus); g.connect(reverb); o.start(t); o.stop(t + 4.3);
      }
    },
    page() { burst(ctx.currentTime, 0.12, 'highpass', 2500, 0.7, 0.03); },
    // the Sé striking the quarter overhead: four notes, distant and wet
    quarter() { const t = ctx.currentTime; [N(76), N(72), N(74), N(67)].forEach((f, i) => { bell(f, t + i * 0.7, 0.05, sfxBus); bell(f, t + i * 0.7, 0.03, reverb); }); },
    // the Sé's hour bell, one stroke
    hour() { const t = ctx.currentTime; bell(N(45), t, 0.12, sfxBus); bell(N(45), t, 0.06, reverb); },
    // a trowel dropped on brick: a bright clank and a skitter
    trowel() { const t = ctx.currentTime; for (const [d, f, v] of [[0, 2300, 0.07], [0.09, 1700, 0.04], [0.21, 2600, 0.025]]) { tone(f, t + d, 0.25, v, 'triangle', sfxBus); tone(f * 1.53, t + d, 0.18, v * 0.6, 'sine', sfxBus); } burst(t, 0.08, 'highpass', 3000, 0.8, 0.04); },
    splash() {
      const t = ctx.currentTime, n = ctx.sampleRate * 1.2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
      const s = ctx.createBufferSource(); s.buffer = buf; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      s.connect(lp); lp.connect(sfxBus); s.start(t);
    },
  };
  // Recorded effects (ElevenLabs sound generation) live in audio/sfx/*.mp3 and
  // are listed in audio/sfx/manifest.json; anything missing falls back to the
  // procedural versions above.
  let sfxFiles = new Set(), sfxVer = {}; const sfxBufs = {};
  const sfxUrl = name => 'audio/sfx/' + name + '.mp3' + (sfxVer[name] ? '?v=' + sfxVer[name] : '');
  async function loadSfx() {
    try { const r = await fetch('audio/sfx/manifest.json', { cache: 'no-cache' }); const j = await r.json(); sfxVer = Array.isArray(j) ? {} : j; sfxFiles = new Set(Array.isArray(j) ? j : Object.keys(j)); } catch (e) { sfxFiles = new Set(); }
  }
  function playFile(name, vol, rate) {
    const go = buf => {
      const s = ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate || 1;
      const g = ctx.createGain(); g.gain.value = vol == null ? 1 : vol;
      s.connect(g); g.connect(sfxBus); s.start(); return s;
    };
    if (sfxBufs[name]) { if (sfxBufs[name] instanceof AudioBuffer) go(sfxBufs[name]); return; }
    sfxBufs[name] = fetch(sfxUrl(name)).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => { sfxBufs[name] = buf; go(buf); }).catch(() => { sfxBufs[name] = null; });
  }
  function sfx(name, vol, rate) {
    if (!ctx) return;
    if (sfxFiles.has(name)) { playFile(name, vol, rate); return; }
    if (SFX[name]) try { SFX[name](); } catch (e) { /* ignore */ }
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
  };
  function footstep(surface, vol) { if (!ctx || !STEPS[surface]) return; try { STEPS[surface](ctx.currentTime, (vol || 1) * (0.85 + Math.random() * 0.3)); } catch (e) { /* ignore */ } }

  // ---------------------------------------------------------------- ambience
  // A quiet bed of room sound under the music: wind, gulls, clocks, drips.
  let ambName = null, ambTimer = null, ambNodes = [];
  function bed(type, freq, q, vol, lfo) {
    const s = ctx.createBufferSource(); s.buffer = noise(); s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(vol, ctx.currentTime, 1.2);
    s.connect(f); f.connect(g); g.connect(sfxBus); s.start();
    if (lfo) { const o = ctx.createOscillator(); o.frequency.value = lfo; const og = ctx.createGain(); og.gain.value = vol * 0.6; o.connect(og); og.connect(g.gain); o.start(); ambNodes.push(o); }
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
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(0.018 * v, st + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.27);
      const w = ctx.createGain(); w.gain.value = 0.6;
      o.connect(g); g.connect(sfxBus); g.connect(w); w.connect(reverb); o.start(st); o.stop(st + 0.3);
    }
  }
  function coo(t) {
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator(); o.type = 'sine'; const st = t + i * 0.45;
      o.frequency.setValueAtTime(330, st); o.frequency.linearRampToValueAtTime(260, st + 0.35);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(0.02, st + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.4);
      o.connect(g); g.connect(sfxBus); o.start(st); o.stop(st + 0.45);
    }
  }
  function drip(t, v) {
    const o = ctx.createOscillator(); o.type = 'sine'; const f0 = 900 + Math.random() * 900;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.9, t + 0.06);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05 * v, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    const w = ctx.createGain(); w.gain.value = 1.4;
    o.connect(g); g.connect(sfxBus); g.connect(w); w.connect(reverb); o.start(t); o.stop(t + 0.15);
  }
  const AMB = {
    shop: { setup() { bed('lowpass', 500, 0.5, 0.012, 0.07); }, tick(t) { if (Math.random() < 0.012) gull(t, 0.4); if (Math.random() < 0.01) burst(t, 0.3, 'bandpass', 180, 4, 0.03); } },
    street: { setup() { bed('bandpass', 600, 0.4, 0.03, 0.09); }, tick(t) { if (Math.random() < 0.03) gull(t, 1); if (Math.random() < 0.004) SFX.tram(); } },
    office: { setup() { hum(100, 0.006); bed('highpass', 4000, 0.5, 0.003); }, tick(t) { if (Math.random() < 0.015) for (let i = 0; i < 6 + Math.random() * 10; i++) burst(t + i * (0.09 + Math.random() * 0.08), 0.03, 'bandpass', 2600, 3, 0.012); } },
    tavern: { setup() { bed('lowpass', 300, 0.5, 0.01, 0.05); }, tick(t) { if (Math.random() < 0.008) tone(2400 + Math.random() * 800, t, 0.5, 0.008, 'sine', sfxBus); if (Math.random() < 0.01) burst(t, 0.4, 'bandpass', 150, 6, 0.03); } },
    convent: { setup() { bed('bandpass', 420, 0.6, 0.04, 0.11); }, tick(t) { if (Math.random() < 0.012) coo(t); if (Math.random() < 0.01) gull(t, 0.3); } },
    night: { setup() { bed('bandpass', 300, 0.6, 0.05, 0.08); }, tick(t) { if (Math.random() < 0.2) for (let i = 0; i < 3; i++) tone(4300 + Math.random() * 200, t + i * 0.05, 0.03, 0.004, 'sine', sfxBus); } },
    clocks: { setup() {}, tick(t, s) { if (s % 5 === 0) burst(t, 0.02, 'bandpass', 3200, 4, 0.03); if (s % 5 === 2) burst(t, 0.02, 'bandpass', 2600, 4, 0.025); if (s % 7 === 3) burst(t, 0.02, 'bandpass', 4100, 4, 0.015); } },
    cistern: { setup() { hum(55, 0.004); bed('lowpass', 200, 0.7, 0.02, 0.05); }, tick(t) { if (Math.random() < 0.06) drip(t, 0.6 + Math.random() * 0.6); } },
    washhouse: { recordedOnly: true, setup() { bed('bandpass', 1800, 0.4, 0.02, 0.2); }, tick(t) { if (Math.random() < 0.02) burst(t, 0.25, 'lowpass', 600, 0.8, 0.05, 0.3); } },
    harbour: { recordedOnly: true, setup() { bed('lowpass', 400, 0.5, 0.03, 0.07); }, tick(t) { if (Math.random() < 0.03) gull(t, 0.8); } },
    // the Sé cloister: stone and pigeons, an organ practising somewhere inside, the quarters overhead
    cloister: { setup() { bed('bandpass', 420, 0.6, 0.035, 0.1); }, tick(t, s) {
      if (Math.random() < 0.01) coo(t);
      if (s % 90 === 20) { const root = [N(43), N(48), N(45), N(41)][Math.floor(s / 90) % 4]; pad([root, root * 1.5, root * 2], t, 9, 0.006); }
      if (s % 450 === 300) SFX.quarter();
    } },
    tower: { recordedOnly: true, setup() { bed('bandpass', 500, 0.6, 0.04, 0.12); }, tick(t) { if (Math.random() < 0.01) coo(t); } },
    boat: { recordedOnly: true, setup() { bed('lowpass', 300, 0.6, 0.03, 0.08); }, tick() {} },
  };
  // recorded ambience loops (ElevenLabs), mixed under the procedural details
  // recorded ambience loops: volumes set so every room sits about 18-20 dB under the dialogue
  const LOOPS = { shop: ['amb_city', 0.16], street: ['amb_city', 0.5], office: ['amb_office', 0.4], tavern: ['amb_tavern', 0.28], clocks: ['amb_clocks', 0.4],
    cistern: ['amb_cistern', 0.4], washhouse: ['amb_washhouse', 0.2], harbour: ['amb_harbour', 0.55], tower: ['amb_tower', 0.25], boat: ['boat_creak', 0.5] };
  function loopFile(name, vol) {
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(ambBus); ambNodes.push(g);
    const start = buf => { if (!ambNodes.includes(g)) return; const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.connect(g); s.start(); ambNodes.push(s); g.gain.setTargetAtTime(vol, ctx.currentTime, 1.0); };
    if (sfxBufs[name] instanceof AudioBuffer) start(sfxBufs[name]);
    else fetch(sfxUrl(name)).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => { sfxBufs[name] = buf; start(buf); }).catch(() => {});
  }
  function ambience(name) {
    if (!ctx || name === ambName) return;
    ambName = name; clearInterval(ambTimer);
    const old = ambNodes; ambNodes = [];
    for (const n of old) { try { if (n.gain) n.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); else n.stop(ctx.currentTime + 1.5); } catch (e) { /* ignore */ } }
    const lp = LOOPS[name];
    if (lp && sfxFiles.has(lp[0])) loopFile(lp[0], lp[1]);
    const A = AMB[name]; if (!A) return;
    if (lp && sfxFiles.has(lp[0]) && A.recordedOnly) { /* the loop says it all */ } else
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
  const wake = () => { if (!ctx) return; holdSession(); if (ctx.state !== 'running') ctx.resume().catch(() => {}); };
  ['pointerdown', 'touchend', 'keydown'].forEach(e => window.addEventListener(e, wake, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
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
    if (!analyser) { analyser = ctx.createAnalyser(); analyser.fftSize = 1024; levelBuf = new Float32Array(analyser.fftSize); analyser.connect(ctx.destination); }
  }
  async function playVoice(id, dry) {
    stopVoice();
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
        voiceSrc = src; voiceEnd = ctx.currentTime + buf.duration;
        src.onended = () => { if (voiceSrc === src) { voiceSrc = null; duck(false); } };
        duck(true, /_sing/.test(id)); // a sung line keeps its guitar under it
        src.start();
        return buf.duration;
      } catch (e) { /* decode failed or too slow: play it the old way */ }
    }
    return new Promise(resolve => {
      const el = new Audio(voiceUrl(id));
      voiceEl = el;
      let done = false;
      const fin = v => { if (!done) { done = true; resolve(v); } };
      el.addEventListener('loadedmetadata', () => fin(el.duration));
      el.addEventListener('error', () => fin(null));
      duck(true, /_sing/.test(id));
      el.addEventListener('ended', () => { if (voiceEl === el) duck(false); });
      el.play().catch(() => fin(null));
      setTimeout(() => fin(null), 4000);
    });
  }
  // music and ambience step back while someone speaks
  function duck(on, song) {
    if (!ctx) return;
    if (musicBus) musicBus.gain.setTargetAtTime(on ? (song ? 0.24 : 0.1) : 0.32, ctx.currentTime, on ? 0.15 : 0.4);
    if (ambBus) ambBus.gain.setTargetAtTime(on ? 0.4 : 1, ctx.currentTime, on ? 0.15 : 0.5);
  }
  function voicePlaying() {
    if (voiceSrc) return ctx.currentTime < voiceEnd;
    return voiceEl && !voiceEl.paused && !voiceEl.ended;
  }
  function stopVoice() {
    if (voiceSrc) { try { voiceSrc.onended = null; voiceSrc.stop(); } catch (e) { /* already stopped */ } voiceSrc = null; }
    if (voiceEl) { voiceEl.pause(); voiceEl = null; }
    duck(false);
  }

  // a recorded song (Amália's fado): plays over everything, the synth music stopped under it
  // loudness of the song now playing, 0..~1 (smoothed), for performers to move with
  let songAn = null, songBuf = null, songLvl = 0, songT = 0;
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
    playMusic(null);
    const el = new Audio(url); el.preload = 'auto';
    let src = null;
    try { if (ctx) { src = ctx.createMediaElementSource(el); const g = ctx.createGain(); g.gain.value = vol == null ? 0.9 : vol; src.connect(g); g.connect(ctx.destination); songAn = ctx.createAnalyser(); songAn.fftSize = 1024; g.connect(songAn); } } catch (e) { src = null; }
    if (!src) el.volume = Math.min(1, vol == null ? 0.9 : vol);
    if (!musicOn) el.muted = true;
    if (ambBus) ambBus.gain.setTargetAtTime(0.25, ctx.currentTime, 0.3);
    const ended = new Promise(res => { el.addEventListener('ended', res); el.addEventListener('error', res); });
    el.play().catch(() => {});
    const restore = () => { if (ambBus) ambBus.gain.setTargetAtTime(1, ctx.currentTime, 0.6); };
    ended.then(() => { restore(); songAn = null; songLvl = 0; });
    return { el, ended, stop(fadeMs) {
      const steps = 12, ms = fadeMs || 1200; let i = 0, v0 = el.volume;
      const iv = setInterval(() => { i++; el.volume = Math.max(0, v0 * (1 - i / steps)); if (i >= steps) { clearInterval(iv); el.pause(); el.dispatchEvent(new Event('ended')); } }, ms / steps);
    } };
  }
  function setMusic(on) { musicOn = on; const t = currentTrack; currentTrack = null; if (on) playMusic(t); else { clearInterval(trackTimer); currentTrack = t; } }
  function setVoice(on) { voiceOn = on; if (!on) stopVoice(); }

  window.Sound = {
    init, playMusic, playSong, songLevel, sfx, loadSfx, step: footstep, ambience, setRoom, voiceLevel, playVoice, preloadVoice, stopVoice, voicePlaying, loadManifest, hasVoice, setMusic, setVoice,
    get musicOn() { return musicOn; }, get voiceOn() { return voiceOn; },
  };
})();
