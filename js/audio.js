// Procedural soundtrack (Web Audio) + ElevenLabs voice-over playback.
(function () {
  let ctx = null, master = null, musicBus = null, sfxBus = null, reverb = null;
  let musicOn = true, voiceOn = true;
  let currentTrack = null, trackTimer = null, nextTime = 0, step = 0;
  let manifest = null;
  let voiceEl = null;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.32;
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.6; sfxBus.connect(master);
    // synthetic hall reverb
    reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    reverb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.45;
    musicBus.connect(master); musicBus.connect(reverb); reverb.connect(wet); wet.connect(master);
  }

  // Karplus-Strong plucked string — the guitarra portuguesa.
  const pluckCache = {};
  function pluckBuffer(freq) {
    const k = Math.round(freq);
    if (pluckCache[k]) return pluckCache[k];
    const sr = ctx.sampleRate, n = Math.floor(sr * 2.2), period = Math.round(sr / freq);
    const buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    const ring = new Float32Array(period);
    for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    for (let i = 0; i < n; i++) {
      const nxt = (idx + 1) % period;
      const v = (ring[idx] + ring[nxt]) * 0.5 * 0.996;
      d[i] = ring[idx]; ring[idx] = v; idx = nxt;
    }
    return (pluckCache[k] = buf);
  }
  function pluck(freq, t, vol) {
    const src = ctx.createBufferSource(); src.buffer = pluckBuffer(freq);
    const g = ctx.createGain(); g.gain.value = vol;
    src.connect(g); g.connect(musicBus); src.start(t);
  }
  function tone(freq, t, dur, vol, type, bus, attack) {
    const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.02));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus || musicBus); o.start(t); o.stop(t + dur + 0.05);
  }
  // Inharmonic church/bronze bell.
  function bell(freq, t, vol, bus) {
    for (const [m, v, d] of [[0.5, 0.5, 6], [1, 1, 5], [1.19, 0.5, 3.5], [1.5, 0.35, 3], [2, 0.3, 2.5], [2.74, 0.2, 1.6]]) {
      tone(freq * m, t, d, vol * v, 'sine', bus);
    }
  }
  function pad(freqs, t, dur, vol) {
    for (const f of freqs) for (const det of [-4, 4]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); lp.connect(g); g.connect(musicBus); o.start(t); o.stop(t + dur + 0.1);
    }
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);

  // Each track: tempo (sec per step) + a step function that schedules notes.
  const TRACKS = {
    fado: { spb: 0.26, fn(s, t) {
      // Am | Dm | E7 | Am  arpeggiated, with a sad melody on top every 2 bars
      const chords = [[45, 57, 60, 64], [50, 57, 62, 65], [40, 56, 59, 62], [45, 57, 60, 64]];
      const bar = Math.floor(s / 8) % 4, beat = s % 8;
      const ch = chords[bar];
      const pat = [0, 2, 1, 3, 2, 1, 3, 2];
      pluck(N(ch[pat[beat]]), t, beat === 0 ? 0.5 : 0.3);
      if (beat === 0) pluck(N(ch[0] - 12 + 12), t, 0.35);
      const mel = [[76, 74, 72, 71], [77, 76, 74, 72], [71, 72, 74, 68], [69, 71, 72, 69]][bar];
      if (beat % 2 === 0 && Math.floor(s / 32) % 2 === 1) pluck(N(mel[beat / 2]), t + 0.01, 0.32);
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
      o.connect(lp); lp.connect(g); g.connect(musicBus); o.start(t); o.stop(t + 3.1);
    }
  }

  function playMusic(name) {
    if (!ctx) return;
    if (currentTrack === name) return;
    currentTrack = name;
    clearInterval(trackTimer);
    if (!name || !musicOn) return;
    step = 0; nextTime = ctx.currentTime + 0.1;
    const tr = TRACKS[name];
    trackTimer = setInterval(() => {
      while (nextTime < ctx.currentTime + 0.25) {
        try { tr.fn(step, nextTime); } catch (e) { /* never let music kill the game */ }
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
  let sfxFiles = new Set(); const sfxBufs = {};
  async function loadSfx() {
    try { const r = await fetch('audio/sfx/manifest.json', { cache: 'no-cache' }); sfxFiles = new Set(await r.json()); } catch (e) { sfxFiles = new Set(); }
  }
  function playFile(name, vol, rate) {
    const go = buf => {
      const s = ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate || 1;
      const g = ctx.createGain(); g.gain.value = vol == null ? 1 : vol;
      s.connect(g); g.connect(sfxBus); s.start(); return s;
    };
    if (sfxBufs[name]) { if (sfxBufs[name] instanceof AudioBuffer) go(sfxBufs[name]); return; }
    sfxBufs[name] = fetch('audio/sfx/' + name + '.mp3').then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => { sfxBufs[name] = buf; go(buf); }).catch(() => { sfxBufs[name] = null; });
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
    tower: { recordedOnly: true, setup() { bed('bandpass', 500, 0.6, 0.04, 0.12); }, tick(t) { if (Math.random() < 0.01) coo(t); } },
    boat: { recordedOnly: true, setup() { bed('lowpass', 300, 0.6, 0.03, 0.08); }, tick() {} },
  };
  // recorded ambience loops (ElevenLabs), mixed under the procedural details
  const LOOPS = { shop: ['amb_city', 0.12], street: ['amb_city', 0.5], office: ['amb_office', 0.4], tavern: ['amb_tavern', 0.35], clocks: ['amb_clocks', 0.45],
    cistern: ['amb_cistern', 0.6], washhouse: ['amb_washhouse', 0.5], harbour: ['amb_harbour', 0.55], tower: ['amb_tower', 0.5], boat: ['boat_creak', 0.5] };
  function loopFile(name, vol) {
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(sfxBus); ambNodes.push(g);
    const start = buf => { if (!ambNodes.includes(g)) return; const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.connect(g); s.start(); ambNodes.push(s); g.gain.setTargetAtTime(vol, ctx.currentTime, 1.0); };
    if (sfxBufs[name] instanceof AudioBuffer) start(sfxBufs[name]);
    else fetch('audio/sfx/' + name + '.mp3').then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => { sfxBufs[name] = buf; start(buf); }).catch(() => {});
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
      manifest = new Set(await r.json());
    } catch (e) { manifest = new Set(); }
  }
  function hasVoice(id) { return voiceOn && manifest && manifest.has(id); }

  // Plays a voice line. Resolves with the clip duration (seconds) once it has
  // started, or null when the line has no recording (caller falls back to a
  // reading-speed timer).
  function playVoice(id) {
    stopVoice();
    if (!hasVoice(id)) return Promise.resolve(null);
    return new Promise(resolve => {
      const el = new Audio('audio/voice/' + id + '.mp3');
      voiceEl = el;
      if (ctx) try {
        if (!analyser) { analyser = ctx.createAnalyser(); analyser.fftSize = 1024; levelBuf = new Float32Array(analyser.fftSize); analyser.connect(ctx.destination); }
        ctx.createMediaElementSource(el).connect(analyser);
      } catch (e) { /* plays directly */ }
      let done = false;
      const fin = v => { if (!done) { done = true; resolve(v); } };
      el.addEventListener('loadedmetadata', () => fin(el.duration));
      el.addEventListener('error', () => fin(null));
      if (musicBus) musicBus.gain.setTargetAtTime(0.14, ctx.currentTime, 0.2);
      el.addEventListener('ended', () => { if (musicBus && voiceEl === el) musicBus.gain.setTargetAtTime(0.32, ctx.currentTime, 0.4); });
      el.play().catch(() => fin(null));
      setTimeout(() => fin(null), 4000);
    });
  }
  function voicePlaying() { return voiceEl && !voiceEl.paused && !voiceEl.ended; }
  function stopVoice() {
    if (voiceEl) { voiceEl.pause(); voiceEl = null; }
    if (musicBus) musicBus.gain.setTargetAtTime(0.32, ctx.currentTime, 0.3);
  }

  function setMusic(on) { musicOn = on; const t = currentTrack; currentTrack = null; if (on) playMusic(t); else { clearInterval(trackTimer); currentTrack = t; } }
  function setVoice(on) { voiceOn = on; if (!on) stopVoice(); }

  window.Sound = {
    init, playMusic, sfx, loadSfx, step: footstep, ambience, voiceLevel, playVoice, stopVoice, voicePlaying, loadManifest, hasVoice, setMusic, setVoice,
    get musicOn() { return musicOn; }, get voiceOn() { return voiceOn; },
  };
})();
