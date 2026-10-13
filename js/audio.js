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
    splash() {
      const t = ctx.currentTime, n = ctx.sampleRate * 1.2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
      const s = ctx.createBufferSource(); s.buffer = buf; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      s.connect(lp); lp.connect(sfxBus); s.start(t);
    },
  };
  function sfx(name) { if (ctx && SFX[name]) try { SFX[name](); } catch (e) { /* ignore */ } }

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
    init, playMusic, sfx, playVoice, stopVoice, voicePlaying, loadManifest, hasVoice, setMusic, setVoice,
    get musicOn() { return musicOn; }, get voiceOn() { return voiceOn; },
  };
})();
