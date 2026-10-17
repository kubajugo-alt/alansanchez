// Point-and-click engine: painted backgrounds, painted sprite actors, smart
// cursor (left = act, right = examine), inventory bar, dialogue, cutscenes, saves.
(function () {
  const W = 1280, H = 720;
  const canvas = document.getElementById('scene');
  const g = canvas.getContext('2d');
  const $ = s => document.querySelector(s);
  const wrap = $('#game'), speechEl = $('#speech'), narrEl = $('#narration'), hoverEl = $('#hover');
  const invEl = $('#inventory'), invBar = $('#invbar'), dialogEl = $('#dialog'), labelsEl = $('#labels');

  const SAVE_KEY = 'drowned-bell-save-v3';
  const COLORS = { alan: '#ffe2a0', ines: '#ffab9a', rui: '#a8d4ff', amalia: '#e2b0ff', tomas: '#cfeab8', lacerda: '#ff7d6a', celeste: '#ffd0a0', ze: '#9fd8ff', abilio: '#f0e68c', lino: '#f2c79a', phone: '#b9c9ff', guitar: '#d8c0a0', cards: '#d9c8a8', fish: '#ffb8b8', mender1: '#c8d8c0', mender2: '#b8d0b0', nun: '#e0e0f0', washer1: '#f0c8b0', washer2: '#d8c0e0', laundry: '#e8d0b8', bench: '#d8c8a8', narr: '#eee6d6' };
  const NAMES = { alan: 'Alan', ines: 'Inês', rui: 'Rui', amalia: 'Amália', tomas: 'Father Tomás', lacerda: 'Lacerda', celeste: 'Celeste', ze: 'Zé', abilio: 'Abílio', lino: 'Lino', phone: 'Officer Teixeira', guitar: 'Duarte', cards: 'Card player', fish: 'Fishwife', mender1: 'Old fisherman', mender2: 'Fisherman', nun: 'Sister', washer1: 'Washerwoman', washer2: 'Graça', laundry: 'Woman with the washing', bench: 'Senhor Armando', vasco: 'Dr. Teles', narr: '' };

  const ROOMS = {}, ITEMS = {}, CHARS = {};
  const IMG = {}; // loaded images by key
  let state = freshState();
  let room = null, fogA = null, fogB = null;
  let player = null, npcs = [];
  let selItem = null;
  let busy = 0, mouse = { x: -1, y: -1 }, hoverTarget = null, cutscene = 0;
  let skipFn = null, dialogResolve = null;
  let time = 0, last = performance.now(), last0 = performance.now(), slowT = 0;

  function freshState() { return { room: 'shop', inv: [], flags: {}, px: 300, py: 600, dir: 'w' }; }

  // ---------------------------------------------------------------- assets
  function loadImage(key, src) {
    if (IMG[key]) return Promise.resolve(IMG[key]);
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { IMG[key] = im; res(im); };
      im.onerror = () => { console.warn('missing', src); res(null); };
      im.src = src;
    });
  }
  async function preload(onProgress) {
    const jobs = [];
    for (const id in ROOMS) for (const b of [ROOMS[id].bg].concat(ROOMS[id].bgs || [])) if (b) jobs.push(['bg:' + b, 'art/bg/' + b + '.jpg']);
    for (const s of (window.STILLS || [])) jobs.push(['still:' + s, 'art/stills/' + s + '.jpg']);
    for (const c of (window.CLOSEUPS || [])) jobs.push(['close:' + c, 'art/closeups/' + c + '.jpg']);
    for (const k in SPRITES) jobs.push(['spr:' + k, 'art/sprites/' + k + '.webp']);
    for (const id in ROOMS) for (const l of (ROOMS[id].layers || [])) jobs.push(['lay:' + l.img, 'art/layers/' + l.img + '.webp']);
    for (const id in ROOMS) if (ROOMS[id].skyMask) jobs.push(['mask:' + ROOMS[id].skyMask, 'art/layers/' + ROOMS[id].skyMask + '.webp']);
    let done = 0;
    await Promise.all(jobs.map(([k, s]) => loadImage(k, s).then(() => onProgress && onProgress(++done / jobs.length))));
  }

  // ---------------------------------------------------------------- actors
  // A character's frames (CHARS[ch].frames):
  //   idle: [rest, variant...]  talk: [gesture...]  walk: [8-frame profile cycle]
  //   front / back: standing frames seen from the front / back, frontWalk / backWalk: their cycles
  //   poses: { name: frame }  loops: { name: { frames, fps } }  sets: { name: { idle?, talk? } }
  // Feet are pinned to (x, y). Breathing only stretches the upper body, the walk
  // cycle advances by the distance actually covered, and every pose change is
  // cross-dissolved.
  const arr = v => v == null ? [] : Array.isArray(v) ? v : [v];
  const XFADE = 0.2, MORPH_T = 0.34, GROUND_K = 2.2;
  // Movement feel (all tunable; 0 switches a feature off). Lengths are in walker heights.
  const WALK_EASE_IN = 0.24;    // s from a standstill to full pace (the first steps are shorter and slower)
  const WALK_START_PACE = 0.3;  // pace of the very first step, as a fraction of full pace
  const WALK_EASE_OUT = 0.2;    // ground over which a walker slows into the last step
  const WALK_END_PACE = 0.45;   // pace of the last step
  const CORNER_R = 0.32;        // radius of a rounded corner on a routed path (arcs instead of pivots)
  const LEAN_START = 0.03;      // the body tips into a walk as it starts (head displacement / height)
  const LEAN_WALK = 0.009;      // forward lean kept while walking
  const LEAN_SETTLE = 0.6;      // the backward rock as a walker plants and stops (spring kick)
  const LEAN_TURN = 0.18;       // a standing figure shifts its weight toward the side it turns to
  const LISTEN_TILT = 0.045;    // listeners incline their heads toward whoever is speaking (radians)
  const LISTEN_NOD = 0.075;     // a listener's small nod as a phrase ends (radians)
  const LISTEN_NOD_P = 0.45;    // chance that a given listener nods at a given phrase end
  const LISTEN_RANGE = 900;     // only people within this many px of the speaker listen
  const IDLE_RATE_JITTER = 0.22; // each figure breathes and sways at its own tempo (+/- this fraction)
  const CALM_RATE = 2.2;        // how quickly breath and sway return after a walk (1/s)
  let phraseEndT = -1;          // when the current speaker last came to the end of a phrase

  class Actor {
    constructor(id, ch, x, y, dir) {
      Object.assign(this, { id, ch, x, y, dir: dir || 'e', walking: false, talking: false, visible: true, phase: 0, h: null });
      this.target = null; this.resolve = null;
      this.talkT = 0; this.talkIdx = 0; this.quietT = 0;
      this.idleT = 2 + Math.random() * 5; this.idleIdx = 0;
      this.pose = null; this.loop = null; this.set = null; this.engaged = 0; this.resumeT = 0;
      this.cur = null; this.prev = null; this.fadeT = 0; this.lastFlip = false;
      this.breath = Math.random() * 10; this.sink = 0; this.turnT = 0; this.stepIdx = -1;
      this.rate = 1 + (Math.random() * 2 - 1) * IDLE_RATE_JITTER; // no two figures breathe in step
      this.leanX = 0; this.leanV = 0; this.calm = 1; this.walkT = 0; this.pace = 1; this.listen = 0; this.heardT = phraseEndT; this.nodAt = -9;
      this.perf = 0; this.swayPh = Math.random() * 60; this.tiltPh = Math.random() * 60; this.beatPh = Math.random() * 60;
    }
    get c() { return CHARS[this.ch]; }
    get F() {
      const f = this.c.frames, s = this.set && f.sets && f.sets[this.set];
      return s ? Object.assign({}, f, s) : f;
    }
    walkTo(x, y) {
      return new Promise(res => {
        if (this.resolve) this.resolve();
        if (Math.hypot(x - this.x, y - this.y) < 2) { res(); return; }
        // Alan goes round the furniture cut out of the floor, not through it
        const [first, ...rest] = this === player && room && room.walk ? roundCorners([this.x, this.y], route([this.x, this.y], [x, y], room.walk), room.walk, this.height()) : [[x, y]];
        if (!this.walking) this.walkT = 0; // a fresh start eases in; a change of mind mid-stride keeps the pace
        this.target = { x: first[0], y: first[1] }; this.path = rest; this.resolve = res; this.walking = true;
      });
    }
    cycle() {
      const F = this.F;
      if (this.dir === 'n' && F.backWalk) return F.backWalk;
      if (this.dir === 's' && F.frontWalk) return F.frontWalk;
      return F.walk || arr(F.idle).filter(x => !Array.isArray(x));
    }
    update(dt) {
      const F = this.F;
      if (this.fadeT > 0) this.fadeT = Math.max(0, this.fadeT - dt);
      if (this.resumeT > 0) this.resumeT -= dt;
      this.breath += dt * this.rate;
      // performers move with the music. The song's loudness is smoothed per figure and only changes
      // how fast each phase advances, never the phase itself: read straight into
      // sin(time * f(level)), every flicker of the level jumped the phase by time * df, and the
      // whole room shook (the Taberna fado and every scene after it)
      const pt = Math.min(1.5, (this.perform || 0) * (1 + 0.6 * (this.perform && window.Sound && Sound.songLevel ? Sound.songLevel() : 0)));
      this.perf += (pt - this.perf) * Math.min(1, dt * 1.5);
      if (this.perf < 1e-4 && !this.perform) this.perf = 0;
      this.swayPh += dt * this.rate * Math.PI * 2 * (0.13 + this.perf * 0.2);
      this.tiltPh += dt * this.rate * Math.PI * 2 * (0.09 + this.perf * 0.22);
      this.beatPh += dt * this.rate * Math.PI * 2 * 1.05;
      this.calm += ((this.walking ? 0 : 1) - this.calm) * Math.min(1, dt * CALM_RATE);
      const easy = !window.FAST;
      if (this.target) {
        const hh = this.height();
        // pace: the first steps are shorter and slower, and the walker slows into the last one
        this.walkT += dt;
        let rem = Math.hypot(this.target.x - this.x, (this.target.y - this.y) * GROUND_K), q0 = [this.target.x, this.target.y];
        for (const q of (this.path || [])) { rem += Math.hypot(q[0] - q0[0], (q[1] - q0[1]) * GROUND_K); q0 = q; }
        const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
        const pIn = easy && WALK_EASE_IN > 0 ? WALK_START_PACE + (1 - WALK_START_PACE) * sm(this.walkT / WALK_EASE_IN) : 1;
        const pOut = easy && WALK_EASE_OUT > 0 ? WALK_END_PACE + (1 - WALK_END_PACE) * sm(rem / (hh * WALK_EASE_OUT)) : 1;
        this.pace = Math.min(pIn, pOut);
        let budget = hh * 0.62 * dt * (this.c.speed || 1) * this.pace, moved = 0, arrived = false;
        // the step carries on round a path point instead of stalling on it (arcs are many short legs)
        for (let guard = 0; guard < 24 && budget > 1e-6; guard++) {
          const dx = this.target.x - this.x, dy = this.target.y - this.y;
          const gd = Math.hypot(dx, dy * GROUND_K); // distance on the ground plane
          if (gd > 0.5) {
            if (!(F.frontWalk && F.backWalk) || Math.abs(dx) > Math.abs(dy * GROUND_K) * 0.75) this.dir = dx > 0 ? 'e' : 'w';
            else this.dir = dy > 0 ? 's' : 'n';
          }
          if (gd <= budget) {
            this.x = this.target.x; this.y = this.target.y; budget -= gd; moved += gd;
            if (this.path && this.path.length) { const [nx, ny] = this.path.shift(); this.target = { x: nx, y: ny }; } else { arrived = true; break; }
          } else { this.x += dx / gd * budget; this.y += dy / gd * budget; moved += budget; budget = 0; }
        }
        // the cycle advances by ground covered, so planted feet never slide
        const cyc = this.cycle();
        this.phase += moved / (hh * (this.c.frameStep || (cyc.length >= 8 ? 0.085 : 0.17))); // frameStep: ground per frame (a 4-frame stride + passing cycle uses half)
        const idx = Math.floor(this.phase) % cyc.length;
        if (idx !== this.stepIdx) {
          this.stepIdx = idx;
          const contact = cyc.length >= 8 ? idx % 4 === 0 : idx % 2 === 0;
          if (contact && this.visible && this.x > -40 && this.x < 1320) Sound.step((room && room.floor) || 'stone', this === player ? 1 : 0.35 + 0.4 * Math.max(0, Math.min(1, (this.y - 520) / 200)), this.x);
        }
        if (arrived) this.stop();
      }
      // lean: a damped spring. The body tips into the first steps, keeps a little lean while
      // walking, rocks back a touch as it plants and stops, and shifts its weight as it turns.
      if (easy) {
        const sgn = this.dir === 'e' ? 1 : this.dir === 'w' ? -1 : 0;
        const want = this.walking ? sgn * (LEAN_WALK + (LEAN_START - LEAN_WALK) * Math.max(0, 1 - this.walkT / Math.max(0.05, WALK_EASE_IN * 1.4))) : 0;
        this.leanV += ((want - this.leanX) * 160 - this.leanV * 16) * Math.min(dt, 0.05);
        this.leanX += this.leanV * Math.min(dt, 0.05);
        if (Math.abs(this.leanX) > 0.05) this.leanX = Math.sign(this.leanX) * 0.05;
      } else { this.leanX = 0; this.leanV = 0; }
      // listening: the head inclines toward whoever is speaking; now and then a nod as a phrase ends
      const spk = speaking && speaking.actor;
      let lt = 0;
      if (spk && spk !== this && spk.visible && this.visible && !this.talking && !this.walking && Math.abs(spk.x - this.x) < LISTEN_RANGE) lt = spk.x > this.x ? 1 : spk.x < this.x ? -1 : 0;
      this.listen += (lt - this.listen) * Math.min(1, dt * 3.5);
      if (phraseEndT > this.heardT) { this.heardT = phraseEndT; if (lt && Math.random() < LISTEN_NOD_P) this.nodAt = time + 0.12 + Math.random() * 0.35; }
      if (this.talking) {
        this.talkT -= dt;
        const lvl = speaking && speaking.actor === this ? Sound.voiceLevel() : 0.5;
        this.lvl = (this.lvl || 0) + (lvl - (this.lvl || 0)) * Math.min(1, dt * 12);
        this.quietT = lvl < 0.06 ? this.quietT + dt : 0;
        if (speaking && speaking.actor === this) { if (lvl >= 0.06) this.voiced = true; else if (this.voiced && this.quietT > 0.28) { this.voiced = false; phraseEndT = time; } }
        const n = arr(F.talk).length;
        if (this.quietT > 0.45 && this.talkIdx >= 0 && this.talkT < 0.5) { this.talkIdx = -1; this.talkT = 0.3; }
        else if (this.talkT <= 0) {
          if (this.talkIdx >= 0 && Math.random() < 0.3) { this.talkIdx = -1; this.talkT = 0.35 + Math.random() * 0.4; }
          else { this.talkIdx = n > 1 ? (Math.max(0, this.talkIdx) + 1 + Math.floor(Math.random() * (n - 1))) % n : 0; this.talkT = 0.8 + Math.random() * 1.0; }
        }
      } else { this.talkIdx = 0; this.talkT = 0; this.quietT = 0; this.lvl = 0; }
      const nIdle = arr(F.idle).length;
      if (!(cutscene && this.def && this.def.ambient)) this.idleT -= dt; // ambient extras freeze during cutscenes
      if (this.idleT <= 0) {
        const vh = this.c.variantHold || [2, 4.5], ih = this.c.idleHold || [4, 10];
        if (this.idleIdx === 0 && nIdle > 1) { this.idleIdx = 1 + Math.floor(Math.random() * (nIdle - 1)); this.idleT = vh[0] + Math.random() * (vh[1] - vh[0]); const v = arr(F.idle)[this.idleIdx]; if (Array.isArray(v)) this.idleT *= Math.max(1, v.length * 0.6); this.idleDur = this.idleT; }
        else { this.idleIdx = 0; this.idleT = ih[0] + Math.random() * (ih[1] - ih[0]); }
      }
      // background extras that walk a beat (dockworkers, etc.)
      if (this.def && this.def.patrol && !this.walking && !cutscene) {
        this.patrolT = (this.patrolT || 0) - dt;
        if (this.patrolT <= 0) {
          const P = this.def.patrol; this.patrolI = ((this.patrolI || 0) + 1) % P.points.length;
          const [px, py] = P.points[this.patrolI]; this.walkTo(px, py);
          this.patrolT = P.pause[0] + Math.random() * (P.pause[1] - P.pause[0]);
        }
      }
      // NPCs turn toward Alan (after a human beat), unless busy or posed
      if (this !== player && player && player.visible && !this.walking && !this.pose && !this.loopActive() && !(this.def && (this.def.fixedDir || this.def.ambient)) && (this.dir === 'e' || this.dir === 'w') && turnsFreely(this)) {
        const want = player.x > this.x ? 'e' : 'w';
        if (want !== this.dir && Math.abs(player.x - this.x) > 40) { this.turnT += dt; if (this.turnT > 0.6) { this.dir = want; this.turnT = 0; } }
        else this.turnT = 0;
      }
    }
    loopActive() { const F = this.F; return !!(this.loop && F.loops && F.loops[this.loop] && !this.engaged && this.resumeT <= 0 && !this.talking); }
    stop() {
      if (this.walking && !window.FAST) this.leanV -= (this.dir === 'e' ? 1 : this.dir === 'w' ? -1 : 0) * LEAN_SETTLE; // planted: the body rocks back a touch
      this.target = null; this.path = null; this.walking = false; this.phase = 0; this.stepIdx = -1; this.walkT = 0; const r = this.resolve; this.resolve = null; if (r) r();
    }
    height() { return (this.h || scaleAt(this.y)) * (this.c.scale || 1); }
    // frames not painted yet fall back to the character's idle (then talk) frame
    frameKey() {
      const k = this.rawKey(), ok = f => f && SPRITES[f] && IMG['spr:' + f];
      if (ok(k)) return k;
      const F = this.F;
      return arr(F.idle).concat(arr(F.talk)).find(ok) || k;
    }
    rawKey() {
      const F = this.F;
      if (this.pose) return (F.poses && F.poses[this.pose]) || this.pose;
      if (this.walking) { const c = this.cycle(); return c[Math.floor(this.phase) % c.length]; }
      if (this.dir === 'n' && F.back) return arr(F.back)[0];
      if (this.dir === 's' && F.front) return arr(F.front)[0];
      if (this.talking) { const t = arr(F.talk); return t.length && this.talkIdx >= 0 ? t[this.talkIdx % t.length] : arr(F.idle)[0]; }
      if (this.loopActive()) { const L = F.loops[this.loop]; return L.frames[Math.floor(time * L.fps) % L.frames.length]; }
      const id = arr(F.idle), v = id[this.idleIdx % id.length];
      // an idle variant can be a little action, [frame, frame, ...], played through over its hold
      return Array.isArray(v) ? v[Math.min(v.length - 1, Math.floor((1 - Math.max(0, this.idleT) / (this.idleDur || 1)) * v.length))] : v;
    }
    bbox() {
      const h = this.height(), w = h * 0.36;
      return { x: this.x - w / 2, y: this.y - h, w, h };
    }
    // is the scene point on a painted (non-transparent) pixel of the current frame?
    opaqueAt(x, y) {
      const key = this.cur || this.frameKey(), A = this.place(key, this.lastFlip);
      if (!A) return true;
      let u = (x - this.x - A.x) / A.w, v = (y - this.y - A.y) / A.h;
      if (u < 0 || u > 1 || v < 0 || v > 1) return false;
      if (A.flipped) u = 1 - u;
      return alphaAt(A.im, u, v) > 40;
    }
    // sprite placement relative to the feet, in scene px
    place(key, flipped) {
      const sp = SPRITES[key], im = IMG['spr:' + key];
      if (!sp || !im) return null;
      const s = this.height() / sp.h;
      const ax = flipped ? sp.w - sp.ax : sp.ax;
      return { key, sp, im, flipped, s, x: -ax * s, y: -sp.fy * s, w: sp.w * s, h: sp.hh * s };
    }
    // The living part of the figure, as a displacement of the painted frame (buffer px, feet at fx,fy):
    // breath in the chest, a slow sway from the feet (from the seat when sitting), the head tilting
    // on the neck, nods with the voice, a bob in the step; performers move with the music.
    motion(h, fx, fy, sp, b, key) {
      const t = (window.ANIM_T != null ? window.ANIM_T : time) * this.rate + (this.seed || (this.seed = Math.random() * 100));
      const c = this.c.anim || {}, d = (this.def && this.def.anim) || {};
      const k = (n, def) => (d[n] != null ? d[n] : c[n] != null ? c[n] : def);
      const s = h / sp.h, F = Math.max(1, (sp.fy - sp.top) * s);
      const wide = sp.w / Math.max(1, sp.fy - sp.top) > 0.78 || k('rig', '') === 'flat'; // groups, pairs, lying figures
      const perf = this.perf || 0;
      const TAU = Math.PI * 2;
      // phases advance in update(); ANIM_T (test clips) renders from a fixed clock instead
      const fixedT = window.ANIM_T != null;
      const phSway = fixedT ? t * TAU * (0.13 + perf * 0.2) : this.swayPh, phTilt = fixedT ? t * TAU * (0.09 + perf * 0.22) : this.tiltPh, phBeat = fixedT ? t * TAU * 1.05 : this.beatPh;
      // talking never bends the painting: mouths and gestures are frame swaps (talk frames), so the
      // voice level drives no tilt, bob or breath here (a guitar or a pair stays rigid while they speak)
      // sway: a bend whose root is the feet (or the seat); amplitude as a fraction of height
      const sway = this.calm * k('sway', 1) * (0.0045 + perf * 0.013) * (Math.sin(phSway) + 0.35 * Math.sin(t * TAU * 0.071 + 1.3));
      // seated / kneeling frames sway from the seat or the knees (char-wide via SEATED, per frame via c.seatedFrames)
      const root = k('seated', SEATED.has(this.ch) || !!(key && this.c.seatedFrames && this.c.seatedFrames.test(key))) ? 0.42 : 0.1;
      // head: a slow tilt, a nod with each phrase spoken, more when performing
      // listening: which way the painting faces (side views only), the incline toward the speaker
      // (stronger when the speaker is in front of them), and the nod's envelope
      const fs = (sp.facesLeft ? -1 : 1) * (this.lastFlip ? -1 : 1), side = !(this.F.front && arr(this.F.front).includes(key)) && !(this.F.back && arr(this.F.back).includes(key));
      const ahead = this.listen * fs > 0 ? 1 : 0.45;
      const nu = (time - this.nodAt) / 0.5, nod = nu > 0 && nu < 1 ? Math.pow(Math.sin(nu * Math.PI), 2) : 0;
      const hear = wide ? 0 : (side ? this.listen * ahead * LISTEN_TILT + fs * nod * LISTEN_NOD : 0);
      const tilt = wide ? 0 : k('nod', 1) * (0.02 + perf * 0.055) * Math.sin(phTilt + 2.1) + (this.walking ? 0.012 * Math.sin(this.phase * Math.PI) : 0) + hear;
      const bob = wide ? 0 : (perf * 0.006 * (0.5 + 0.5 * Math.sin(phBeat)) + nod * 0.008) * F;
      // walking: the body rises over the passing foot and settles on the stride
      const step = this.walking ? -0.007 * F * Math.pow(Math.sin(this.phase * Math.PI), 2) : 0;
      const neck = 0.855, ca = Math.cos(tilt), sa = Math.sin(tilt);
      const sm = (a, z, v) => { const q = Math.max(0, Math.min(1, (v - a) / (z - a))); return q * q * (3 - 2 * q); };
      const px0 = fx, py0 = fy - neck * F;
      // lean (into a walk, back on stopping, into a turn) bends from the feet like the sway
      const lean = wide ? this.leanX * 0.4 : this.leanX;
      const swayAt = v => { const q = sm(root, 1, v); return (sway + lean) * h * q * q; };
      const pxN = px0 + swayAt(neck);
      // turning round: the figure narrows through the turn and opens out facing the new way
      const tp = this.turnT0 != null ? (time - this.turnT0) / 0.22 : 1;
      const turnS = tp < 1 ? 0.3 + 0.7 * sm(0, 1, tp) : 1;
      return (x, y) => {
        const v = (fy - y) / F;
        let nx = x, ny = y;
        // breath: the chest widens and lifts above the hips
        const wb = sm(0.4, 0.58, v);
        nx = fx + (x - fx) * (1 + b * 0.45 * wb); ny = y - (v - 0.4) * F * b * wb;
        // sway, step bob
        nx += swayAt(v); ny += step * sm(0.05, 0.45, v);
        // the head turns on the neck (and dips with a nod)
        const wh = sm(neck - 0.06, neck + 0.02, v);
        if (wh > 0 && tilt) {
          const rx = nx - pxN, ry = ny - py0, a = wh;
          nx = pxN + rx * (1 - a + a * ca) - ry * a * sa; ny = py0 + rx * a * sa + ry * (1 - a + a * ca);
        }
        ny += bob * wh;
        if (turnS < 1) nx = fx + (nx - fx) * turnS;
        return [nx, ny];
      };
    }
    draw() {
      if (!this.visible) return;
      let key = this.frameKey();
      let sp = SPRITES[key];
      if (!sp) return;
      // background extras keep the pose they were painted in (unless they walk)
      const ambientHold = this.def && this.def.ambient && !this.walking && !this.def.flip;
      let flipped = ambientHold ? false
        : this.dir === 'w' ? !sp.facesLeft : (this.dir === 'e' ? !!sp.facesLeft : this.lastFlip);
      // Turning round between east and west: a figure with a painted front view swings through it
      // (side, front, other side), like an old adventure game; others dissolve from one facing to
      // the other instead of narrowing into a flat card.
      const F = this.F, fk = F.front && arr(F.front)[0], frontOK = fk && SPRITES[fk] && IMG['spr:' + fk];
      // a real turn is a change of facing, not two paintings that happen to face different ways
      const ew = this.dir === 'e' || this.dir === 'w', faceTurn = ew && this.lastEW && this.dir !== this.lastEW && !ambientHold;
      if (faceTurn && !this.walking && !window.FAST) this.leanV += (this.dir === 'e' ? 1 : -1) * LEAN_TURN; // weight onto the new side
      if (ew) this.lastEW = this.dir;
      if (this.viaT == null && faceTurn && this.cur && !window.FAST && frontOK && key !== fk && this.cur !== fk && !this.pose) this.viaT = time;
      let via = false;
      if (this.viaT != null) {
        if (time - this.viaT < TURN_VIA && frontOK) { via = true; key = fk; sp = SPRITES[fk]; flipped = !!sp.facesLeft; }
        else { this.viaT = null; this.lastFlip = flipped; this.viaOut = true; } // out of the front view: no second turn
      }
      this.lastFlip = flipped;
      if (key !== this.cur) {
        const inCycle = this.walking && this.cycle().includes(key) && this.cycle().includes(this.cur);
        this.prev = this.cur && !inCycle ? this.cur : null;
        this.prevFlip = this.curFlip != null ? this.curFlip : flipped; // the outgoing frame keeps the facing it was drawn with
        // a mouth or gesture change while speaking is a clean frame swap, never a mesh morph
        const tf = this.talking && !this.walking && !this.pose ? arr(F.talk).concat(arr(F.idle).flat()) : null;
        const talkSwap = !!(tf && tf.includes(key) && tf.includes(this.prev));
        const M = window.MORPHS, morph = this.prev && !talkSwap && this.prevFlip === flipped && M && M[key + '>' + this.prev] && M[this.prev + '>' + key];
        // only a pair with morph data moves between poses; anything else is a clean cut, so two
        // paintings are never on screen at once
        if (!morph) this.prev = null;
        this.fadeDur = MORPH_T; this.viaOut = false;
        this.fadeT = this.prev ? this.fadeDur : 0;
        this.cur = key;
      }
      this.curFlip = flipped;
      const A = this.place(key, flipped);
      if (!A) return;
      let B = this.prev && this.fadeT > 0 ? this.place(this.prev, this.prevFlip) : null;
      // walking: each step frame flows into the next with the ground covered (when the pair has a morph)
      let walkF = 0;
      if (!B && this.walking && window.MORPHS && window.WARP !== false && !window.FAST) {
        const c = this.cycle(), i = Math.floor(this.phase) % c.length, nk = c[(i + 1) % c.length];
        if (nk !== key && MORPHS[key + '>' + nk] && MORPHS[nk + '>' + key]) {
          const N = this.place(nk, flipped);
          if (N) { B = N; walkF = this.phase - Math.floor(this.phase); }
        }
      }
      const h = this.height();
      // union of both frames, in feet-relative coordinates
      const U = { x: Math.min(A.x, B ? B.x : A.x), y: Math.min(A.y, B ? B.y : A.y) };
      U.r = Math.max(A.x + A.w, B ? B.x + B.w : -1e9); U.b = Math.max(A.y + A.h, B ? B.y + B.h : -1e9);
      const bw = Math.ceil(U.r - U.x) + 1, bh = Math.ceil(U.b - U.y) + 1;
      const comp = walkF ? composeFrames(A, B, 1 - walkF, U, bw, bh, true) : composeFrames(A, B, B ? this.fadeT / (this.fadeDur || XFADE) : 0, U, bw, bh);
      const sinkPx = this.sink * h;
      const unlit = !!(room && room.unlit && room.unlit.test(key));
      const lights = unlit ? [] : lightsOn(this.x, this.y - h * 0.55, h, this);
      if (!sinkPx && !unlit) groundShadows(this, comp, U, bw, bh, h, lights);
      const shaded = !unlit && !window.FAST && window.Warp && window.WARP !== false && window.LIT3D !== false && Warp.ok;
      const lit = shaded || unlit ? comp : lightSprite(comp, bw, bh, U, h, lights);
      const LP = shaded ? lightParams(U, h, lights) : null;
      // breathing: the chest rises and widens a touch above the hips; feet stay put
      const b = this.calm * (0.0065 * Math.sin(this.breath * Math.PI * 2 / 3.9) + 0.0045);
      const sx = 1 + b * 0.45, sy = 1 + b;
      const feetBy = -U.y, hipBy = Math.max(1, Math.round(feetBy - h * 0.47));
      const X0 = this.x + U.x, Y0 = this.y + U.y + sinkPx;
      g.save();
      if (sinkPx) { g.beginPath(); g.rect(0, 0, W, this.y); g.clip(); }
      // the painting is drawn through a mesh that bends with the figure: breath, sway, head, steps
      const warped = !window.FAST && window.Warp && Warp.draw(g, lit, bw, bh, X0, Y0, this.motion(h, -U.x, feetBy, SPRITES[key], b, key), h * 0.1, LP);
      if (!warped) {
        if (shaded) { const L2 = lightSprite(comp, bw, bh, U, h, lights); g.drawImage(L2, 0, 0, bw, bh, X0, Y0, bw, bh); g.restore(); return; }
        // lower body: untouched
        g.drawImage(lit, 0, hipBy, bw, bh - hipBy, X0, Y0 + hipBy, bw, bh - hipBy);
        // upper body: scaled about the hip line and the body axis
        const hipY = Y0 + hipBy;
        g.drawImage(lit, 0, 0, bw, hipBy + 1, this.x + U.x * sx, hipY - hipBy * sy, bw * sx, (hipBy + 1) * sy);
      }
      g.restore();
    }
  }

  // Cross-dissolves two frames (both anchored at the feet) into one buffer.
  const compBuf = document.createElement('canvas'), cg = compBuf.getContext('2d');
  const litBuf = document.createElement('canvas'), lg = litBuf.getContext('2d');
  const silBuf = document.createElement('canvas'), sg = silBuf.getContext('2d');
  function fit(c, ctx, w, h) {
    if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, c.width, c.height);
  }
  function blit(ctx, P, U, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.imageSmoothingQuality = 'high';
    const x = P.x - U.x, y = P.y - U.y;
    if (P.flipped) { ctx.translate(x + P.w, y); ctx.scale(-1, 1); ctx.drawImage(P.im, 0, 0, P.w, P.h); }
    else ctx.drawImage(P.im, x, y, P.w, P.h);
    ctx.restore();
  }
  // A pose change with a known correspondence (js/morphs.js) slides each painting along it:
  // the new frame starts in the old one's shape and settles into its own while the old one
  // flows towards the new and fades out on top.
  const MCOLS = 10, MROWS = 26;
  // painted sitting down: they sway from the seat, not the feet
  // the front-view swing: how long a turning figure shows its front view between the two sides
  const TURN_VIA = 0.15;
  const SEATED = new Set(['npc_bench', 'npc_cards', 'npc_couple', 'npc_fish', 'npc_guard', 'npc_guitar', 'npc_mender1', 'npc_mender2', 'npc_washer1']);
  function morphBlit(ctx, P, U, F, amt, alpha) {
    const ox = P.x - U.x, oy = P.y - U.y, sw = P.sp.w, sh = P.sp.hh, s = P.s, fl = P.flipped;
    ctx.save(); ctx.globalAlpha = alpha;
    const ok = Warp.draw(ctx, P.im, sw, sh, ox, oy, (x, y) => {
      const i = Math.round(x / sw * MCOLS), j = Math.round(y / sh * MROWS), q = (j * (MCOLS + 1) + i) * 2;
      const dx = F[q] * amt, dy = F[q + 1] * amt;
      return [fl ? (sw - x - dx) * s : (x + dx) * s, (y + dy) * s];
    }, Math.max(P.w, P.h) * 0.25);
    ctx.restore();
    return ok;
  }
  // linear: B is the frame coming next in a walk (kB = 1 - progress); otherwise B is the frame
  // being left behind in a pose change (kB runs 1 -> 0, eased)
  // the shapes slide over the whole change, the pictures swap only in its middle
  const band = (a, z, v) => { const q = Math.max(0, Math.min(1, (v - a) / (z - a))); return q * q * (3 - 2 * q); };
  function composeFrames(A, B, kB, U, w, h, linear) {
    fit(compBuf, cg, w, h);
    const M = window.MORPHS, fAB = B && M && M[A.key + '>' + B.key], fBA = B && M && M[B.key + '>' + A.key];
    if (B && kB > 0 && fAB && fBA && window.Warp && window.WARP !== false && !window.FAST) {
      const e = linear ? kB : kB * kB * (3 - 2 * kB); // weight of A's own shape is 1 - e
      // Both paintings bend toward a shared in-between shape, but only one is ever on screen:
      // the outgoing one up to the middle, then the incoming one. Never two at once (no extra hands).
      if (linear) {
        const f = 1 - e; // the step in progress: A bends towards the next frame, then hands over
        if (f < 0.5 ? morphBlit(cg, A, U, fAB, f, 1) : morphBlit(cg, B, U, fBA, 1 - f, 1)) return compBuf;
      } else if (e >= 0.5 ? morphBlit(cg, B, U, fBA, 1 - e, 1) : morphBlit(cg, A, U, fAB, e, 1)) return compBuf; // e: 1 -> 0, the old frame first
      fit(compBuf, cg, w, h);
    }
    if (linear) { blit(cg, A, U, 1); return compBuf; }
    // no morph for this pair: a clean cut, never two paintings overlaid
    blit(cg, A, U, 1);
    return compBuf;
  }

  // ---------------------------------------------------------------- lights
  // room.lights: [{ x, y, rgb, kind, seed, glow, ga, power, reach, rim, shadow, floor:[x,y], height, actor, off:[dx,dy] }]
  // `kind` sets how it flickers. The same value drives the painted glow, the
  // light falling on characters and the strength of the shadows they cast.
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const FLICK = {
    steady: () => 1,
    flame: (t, s) => 0.8 + 0.1 * Math.sin(t * 9.7 + s) + 0.06 * Math.sin(t * 23.3 + s * 2) + 0.04 * Math.sin(t * 41 + s * 5) + 0.05 * (hash(Math.floor(t * 12) + s) - 0.5),
    torch: (t, s) => 0.74 + 0.12 * Math.sin(t * 7.3 + s) + 0.08 * Math.sin(t * 17.9 + s * 2) + 0.06 * Math.sin(t * 31 + s * 4) + 0.1 * (hash(Math.floor(t * 14) + s) - 0.5),
    candle: (t, s) => 0.86 + 0.07 * Math.sin(t * 13 + s) + 0.05 * Math.sin(t * 29 + s) + 0.04 * (hash(Math.floor(t * 18) + s) - 0.5),
    gas: (t, s) => 0.93 + 0.04 * Math.sin(t * 3.1 + s) + 0.03 * Math.sin(t * 17 + s * 3),
    tube: (t, s) => {
      const c = t % 11.3;
      if (c < 0.7) return hash(Math.floor(t * 22) + s) < 0.5 ? 0.35 : 0.95; // stutter
      return hash(Math.floor(t * 6) + s) < 0.012 ? 0.55 : 1 - 0.015 * Math.sin(t * 120);
    },
    pulse: (t, s) => 0.78 + 0.22 * Math.sin(t * 2 + s),
  };
  let roomLights = [];
  function updateLights(t) {
    const ls = typeof room.lights === 'function' ? room.lights() : (room.lights || []);
    roomLights = ls.filter(l => !l.when || l.when()).map(l => {
      let x = l.x, y = l.y;
      if (l.actor) {
        const a = l.actor === 'alan' ? player : npcs.find(n => n.id === l.actor);
        if (!a || !a.visible) return null;
        const h = a.height(), side = a.lastFlip ? -1 : 1;
        // a carried light can follow the prop frame by frame (offs: { frame: [dx, dy] });
        // in a frame where the prop isn't held (null, or missing with no default) it goes out
        const key = a.frameKey(), off = l.offs && key in l.offs ? l.offs[key] : l.off;
        if (!off) return null;
        x = a.x + off[0] * h * side; y = a.y + off[1] * h;
        return Object.assign({}, l, { x, y, floor: [x, a.y], owner: a, f: Math.max(0, (FLICK[l.kind || 'steady'] || FLICK.steady)(t, l.seed || 0)) * (l.dim ? l.dim() : 1) });
      }
      const f = l.level ? l.level(t) : (FLICK[l.kind || 'steady'] || FLICK.steady)(t, l.seed || 0);
      return Object.assign({}, l, { x, y, f: Math.max(0, f) });
    }).filter(Boolean);
  }
  function drawGlows() {
    for (const l of roomLights) if (l.glow) FX.glow(g, l.x, l.y, l.glow * (0.9 + 0.1 * l.f), l.rgb, (l.ga || 0.3) * l.f);
  }
  // Light reaching a point on a character (their chest).
  function lightsOn(x, y, h, who) {
    const out = [];
    for (const l of roomLights) {
      if (!l.power) continue;
      const d = Math.hypot(l.x - x, (l.y - y) * 1.3);
      const fall = Math.max(0, 1 - d / (l.reach || 900));
      // a lantern held at arm's length warms its carrier, it doesn't flood them
      const I = l.power * l.f * Math.pow(fall, 1.4) * (who && l.owner === who ? 0.45 : 1);
      if (I > 0.01) out.push({ l, I, dx: l.x - x, dy: l.y - y, d });
    }
    return out;
  }
  function groundShadows(a, comp, U, bw, bh, h, lights) {
    const L = roomLight();
    const ao = L.ao != null ? L.ao : 1;
    // contact shadow / ambient occlusion right under the feet
    const wide = a.walking ? 1.25 : 1;
    g.save();
    g.translate(a.x, a.y - h * 0.02); g.scale(1, 0.2); // spans from the far foot (painted higher) to the near one
    let gr = g.createRadialGradient(0, 0, 0, 0, 0, h * 0.15 * wide);
    gr.addColorStop(0, `rgba(0,0,0,${0.7 * ao})`); gr.addColorStop(0.5, `rgba(0,0,0,${0.38 * ao})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, h * 0.15 * wide, 0, Math.PI * 2); g.fill();
    gr = g.createRadialGradient(0, 0, 0, 0, 0, h * 0.065 * wide);
    gr.addColorStop(0, `rgba(0,0,0,${0.7 * ao})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, h * 0.065 * wide, 0, Math.PI * 2); g.fill();
    g.restore();
    // cast shadows, one per light, stretched away from it across the floor
    const casters = lights.filter(o => o.l.shadow !== false && o.I > 0.03 && o.l.owner !== a);
    if (!casters.length) return;
    fit(silBuf, sg, bw, bh);
    sg.drawImage(comp, 0, 0, bw, bh, 0, 0, bw, bh);
    sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#000'; sg.fillRect(0, 0, bw, bh);
    // a cast shadow is darkest where it meets the feet and thins out toward the
    // head's end, so a figure lit from behind stays planted instead of floating
    sg.globalCompositeOperation = 'destination-in';
    const fade = sg.createLinearGradient(0, -U.y, 0, 0); fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(0.35, 'rgba(0,0,0,0.75)'); fade.addColorStop(1, 'rgba(0,0,0,0.28)');
    sg.fillStyle = fade; sg.fillRect(0, 0, bw, bh);
    sg.globalCompositeOperation = 'source-over';
    for (const o of casters) {
      const fp = o.l.floor || [o.l.x, a.y - 40];
      let vx = a.x - fp[0], vy = (a.y - fp[1]);
      const dist = Math.hypot(vx, vy) || 1;
      vx /= dist; vy /= dist;
      // a light nearly overhead casts a short shadow under the feet, not a long one in front of them
      const len = h * Math.max(0.3, Math.min(1.5, 0.3 + dist / (o.l.height || 650))) * Math.min(1, 0.25 + dist / 260);
      const ex = vx * len, ey = vy * len * 0.42;
      // strength follows the light (and its flicker), but stays readable
      const alpha = Math.min(0.62, 0.1 + o.I * 2.4) * (typeof o.l.shadow === 'number' ? o.l.shadow : 1) * Math.min(1, o.l.f);
      g.save();
      g.globalAlpha = alpha;
      g.filter = `blur(${Math.max(1.5, h * 0.008 + len * 0.006).toFixed(1)}px)`;
      g.transform(1, 0, -ex / h, -ey / h, a.x, a.y - h * 0.012); // tucked under the soles so it meets the shoes
      g.drawImage(silBuf, 0, 0, bw, bh, U.x, U.y, bw, bh);
      g.restore();
    }
  }
  // The same lighting as lightSprite, as parameters for the GPU pass (js/warp.js), which shades the
  // figure as a rounded form: lit side, shaded side, rims, room colour, fog.
  const rgbaCache = {};
  function rgba(str, defA) {
    if (!str) return null;
    if (rgbaCache[str]) return rgbaCache[str];
    const m = str.match(/[\d.]+/g).map(Number);
    return (rgbaCache[str] = [m[0] / 255, m[1] / 255, m[2] / 255, m.length > 3 ? m[3] : defA]);
  }
  function lightParams(U, figH, lights) {
    const L = roomLight();
    const base = Math.max(0.3, Math.min(1, L.base != null ? L.base : 1));
    const amb = (rgba(L.ambient, 1) || [1, 1, 1, 1]).slice(0, 3).map(v => v * base);
    const cx = -U.x, cy = -U.y - figH * 0.55;
    const out = [];
    for (const o of lights) {
      const lc = rgba('rgb(' + o.l.rgb + ')', 1);
      // the light's colour, tempered by the room's, adding what used to be a flat lift in level
      const an = amb.map(v => v / Math.max(0.05, base)), luma = c => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
      let tint = [0, 1, 2].map(i => (lc[i] * 0.6 + an[i] * 0.4));
      const k = luma(an) / Math.max(0.05, luma(tint)); tint = tint.map(v => v * k); // keep the old brightness, take the light's hue
      out.push({ x: cx + o.dx, y: cy + o.dy, rgb: tint, I: o.I * (o.l.fill != null ? o.l.fill : 0.35) / 0.65, rim: Math.min(0.55, o.I * (o.l.rim != null ? o.l.rim : 0.8)) });
    }
    out.sort((a, b) => b.I - a.I);
    // same average brightness as the flat lighting had; only the modelling changes
    const fills = lights.reduce((t, o) => t + o.I * (o.l.fill != null ? o.l.fill : 0.35), 0);
    const flat = Math.max(0.3, Math.min(1, base + fills));
    const est = base * 0.97 + out.slice(0, 4).reduce((t, l) => t + l.I * 0.65 * 0.85, 0);
    const gain = Math.min(1.6, flat / Math.max(0.05, est));
    for (let i = 0; i < 3; i++) amb[i] *= gain;
    for (const l of out) l.I *= gain;
    const key = rgba(L.rim, 0.3), fog = rgba(L.fog, 0.2);
    return { amb, fog, key, keySide: L.rimSide || 1, feet: -U.y, fig: figH, lights: out };
  }
  // Room colour, then a rim of each light on the side facing it.
  function lightSprite(comp, w, h, U, figH, lights) {
    fit(litBuf, lg, w, h);
    lg.drawImage(comp, 0, 0, w, h, 0, 0, w, h);
    const L = roomLight();
    const level = Math.max(0.3, Math.min(1, (L.base != null ? L.base : 1) + lights.reduce((s, o) => s + o.I * (o.l.fill != null ? o.l.fill : 0.35), 0)));
    if (L.ambient || level < 1) {
      const m = (L.ambient || 'rgb(255,255,255)').match(/\d+/g).map(Number);
      lg.globalCompositeOperation = 'multiply';
      lg.fillStyle = `rgb(${m.map(v => Math.round(v * level)).join(',')})`; lg.fillRect(0, 0, w, h);
      lg.globalCompositeOperation = 'destination-in';
      lg.drawImage(comp, 0, 0, w, h, 0, 0, w, h);
    }
    lg.globalCompositeOperation = 'source-atop';
    if (L.rim) { // soft, steady key light (daylight through a window, etc.)
      const side = L.rimSide || 1;
      const gr = lg.createLinearGradient(side > 0 ? w : 0, 0, side > 0 ? w * 0.45 : w * 0.55, 0);
      gr.addColorStop(0, L.rim); gr.addColorStop(1, 'rgba(0,0,0,0)');
      lg.fillStyle = gr; lg.fillRect(0, 0, w, h);
    }
    const cx = -U.x, cy = -U.y - figH * 0.55; // chest, in buffer coords
    for (const o of lights) {
      const a = Math.min(0.55, o.I * (o.l.rim != null ? o.l.rim : 0.8));
      if (a < 0.02) continue;
      const n = Math.hypot(o.dx, o.dy) || 1, ux = o.dx / n, uy = o.dy / n;
      const r = figH * 0.3;
      const gr = lg.createLinearGradient(cx + ux * r, cy + uy * figH * 0.5, cx - ux * r * 0.2, cy - uy * figH * 0.1);
      gr.addColorStop(0, `rgba(${o.l.rgb},${a.toFixed(3)})`); gr.addColorStop(1, `rgba(${o.l.rgb},0)`);
      lg.fillStyle = gr; lg.fillRect(0, 0, w, h);
    }
    if (L.fog) { lg.fillStyle = L.fog; lg.fillRect(0, 0, w, h); }
    lg.globalCompositeOperation = 'source-over';
    return litBuf;
  }

  function roomLight() { const L = room && room.light; return (typeof L === 'function' ? L() : L) || {}; }
  function scaleAt(y) {
    const sc = (room && room.scale) || [540, 300, 716, 360];
    const t = Math.max(0, Math.min(1, (y - sc[0]) / (sc[2] - sc[0])));
    return sc[1] + (sc[3] - sc[1]) * t;
  }

  // ---------------------------------------------------------------- geometry
  function inPoly(x, y, p) {
    let ins = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i], [xj, yj] = p[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
    }
    return ins;
  }
  function clampToPoly(x, y, p) {
    if (inPoly(x, y, p)) return [x, y];
    let best = null, bd = Infinity;
    for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length];
      const vx = bx - ax, vy = by - ay, l = vx * vx + vy * vy;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / l));
      const cx = ax + vx * t, cy = ay + vy * t, d = Math.hypot(x - cx, y - cy);
      if (d < bd) { bd = d; best = [cx, cy]; }
    }
    const mx = p.reduce((a, q) => a + q[0], 0) / p.length, my = p.reduce((a, q) => a + q[1], 0) / p.length;
    const dx = mx - best[0], dy = my - best[1], dl = Math.hypot(dx, dy) || 1;
    return [best[0] + dx / dl * 3, best[1] + dy / dl * 3];
  }
  // A walk across a cut-out (a notch round a basin, a stool, a pit) follows the
  // shortest way round its corners; a straight line that stays on the floor is kept.
  function segInside(a, b, p) {
    const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
    for (let i = 1; i < n; i++) { const t = i / n; if (!inPoly(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, p)) return false; }
    return true;
  }
  function edgeDist(x, y, p) {
    let d = Infinity;
    for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length], vx = bx - ax, vy = by - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1)));
      d = Math.min(d, Math.hypot(x - ax - vx * t, y - ay - vy * t));
    }
    return d;
  }
  function route(a, b, p) {
    if (!inPoly(a[0], a[1], p) || !inPoly(b[0], b[1], p) || segInside(a, b, p)) return [b];
    const nodes = [a, b];
    for (const [vx, vy] of p) { // each corner, nudged just inside the floor
      let best = null, bd = -1;
      for (let k = 0; k < 16; k++) {
        const an = k * Math.PI / 8, q = [vx + Math.cos(an) * 4, vy + Math.sin(an) * 4];
        if (!inPoly(q[0], q[1], p)) continue;
        const d = edgeDist(q[0], q[1], p); if (d > bd) { bd = d; best = q; }
      }
      if (best) nodes.push(best);
    }
    const cost = (u, v) => Math.hypot(u[0] - v[0], (u[1] - v[1]) * GROUND_K);
    const dist = nodes.map(() => Infinity), prev = nodes.map(() => -1), done = nodes.map(() => false);
    dist[0] = 0;
    for (;;) {
      let u = -1;
      for (let i = 0; i < nodes.length; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0 || u === 1) break;
      done[u] = true;
      for (let v = 0; v < nodes.length; v++) {
        if (done[v]) continue;
        const d = dist[u] + cost(nodes[u], nodes[v]);
        if (d < dist[v] && segInside(nodes[u], nodes[v], p)) { dist[v] = d; prev[v] = u; }
      }
    }
    if (prev[1] < 0) return [b];
    const out = [];
    for (let i = 1; i > 0; i = prev[i]) out.unshift(nodes[i]);
    return out;
  }
  // A routed path's corners become arcs: each corner is replaced by a cubic curve that leaves the
  // incoming leg and joins the outgoing one tangentially, swinging wide through the routed corner
  // point itself (so it keeps clear of the furniture the corner goes round). Kept only where the
  // whole curve stays on the floor; otherwise the corner stays sharp.
  function roundCorners(a, pts, p, hh) {
    if (!(CORNER_R > 0) || pts.length < 2 || window.FAST) return pts;
    const all = [a].concat(pts), out = [];
    let last = a;
    for (let i = 1; i < all.length - 1; i++) {
      const A = all[i - 1], P = all[i], B = all[i + 1];
      const la = Math.hypot(P[0] - A[0], P[1] - A[1]), lb = Math.hypot(B[0] - P[0], B[1] - P[1]);
      let done = false;
      for (const f of [1, 0.5]) {
        const r = Math.min(CORNER_R * hh * f, la * 0.45, lb * 0.45);
        if (!(r > 6) || !la || !lb) break;
        const u = [(P[0] - A[0]) / la, (P[1] - A[1]) / la], w = [(B[0] - P[0]) / lb, (B[1] - P[1]) / lb];
        const P0 = [P[0] - u[0] * r, P[1] - u[1] * r], P2 = [P[0] + w[0] * r, P[1] + w[1] * r];
        const C1 = [P[0] + u[0] * r / 3, P[1] + u[1] * r / 3], C2 = [P[0] - w[0] * r / 3, P[1] - w[1] * r / 3];
        const N = 8, arc = [];
        for (let k = 0; k <= N; k++) {
          const t = k / N, m = 1 - t;
          arc.push([m * m * m * P0[0] + 3 * m * m * t * C1[0] + 3 * m * t * t * C2[0] + t * t * t * P2[0], m * m * m * P0[1] + 3 * m * m * t * C1[1] + 3 * m * t * t * C2[1] + t * t * t * P2[1]]);
        }
        let ok = arc.every(q => inPoly(q[0], q[1], p)) && segInside(last, arc[0], p);
        for (let k = 1; ok && k < arc.length; k++) ok = segInside(arc[k - 1], arc[k], p);
        if (ok) { out.push(...arc); last = arc[arc.length - 1]; done = true; break; }
      }
      if (!done) { out.push(P); last = P; }
    }
    out.push(all[all.length - 1]);
    return out;
  }
  function hitShape(h, x, y) {
    if (h.poly) return inPoly(x, y, h.poly);
    const [rx, ry, rw, rh] = h.rect;
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  }

  // ---------------------------------------------------------------- rooms
  // What you hear between rooms: a door only where there is one, the stairs up
  // the tower, the map's paper when unfolding it out of doors.
  const INDOOR = { shop: 1, police: 1, tavern: 1, ferreira: 1, antiques: 1, cabin: 1 };
  function passSound(from, to) {
    const pair = from + '>' + to;
    if (/cistern|convent_night>convent|convent>convent_night/.test(pair)) return null;
    if (from === 'se_tower' || to === 'se_tower') return 'stairs';
    // each building has its own door: the shop's bell, the station's heavy door, the boat's hatch
    const DOORS = { shop: 'shop_bell', police: 'door_police', tavern: 'door_tavern', antiques: 'shop_bell_small', cabin: 'hatch_ladder', ferreira: 'door' };
    if ((from === 'boat' && to === 'cabin') || (from === 'cabin' && to === 'boat')) return 'hatch_ladder';
    if (INDOOR[from] || INDOOR[to]) return DOORS[INDOOR[to] ? to : from] || 'door';
    return from === 'map' || to === 'map' ? 'page' : null;
  }
  async function goRoom(id, entry, opts) {
    opts = opts || {};
    busy++;
    if (room && !opts.instant) { const s = opts.sound !== undefined ? opts.sound : passSound(room.id, id); if (s) Sound.sfx(s); await fade(true); }
    if (room && room.leave) room.leave();
    room = ROOMS[id];
    state.room = id;
    if (room.fog) {
      fogA = FX.makeFog(id.length * 31 + 1, room.fogRGB || '214,218,214', 1);
      fogB = FX.makeFog(id.length * 17 + 7, room.fogRGB || '200,206,206', 0.8);
    }
    const e = (entry && room.entries && room.entries[entry]) || (room.entries && room.entries.default) || [640, 640, 'e'];
    if (opts.pos) { player.x = opts.pos[0]; player.y = opts.pos[1]; player.dir = opts.pos[2] || 'e'; }
    else { player.x = e[0]; player.y = e[1]; player.dir = e[2] || 'e'; }
    player.stop();
    player.visible = room.player !== false;
    refreshNpcs(true);
    renderLabels();
    Sound.playMusic(typeof room.music === 'function' ? room.music() : room.music);
    Sound.ambience((typeof room.ambience === 'function' ? room.ambience() : room.ambience) || null);
    Sound.setRoom(room.acoustic || room.id);
    clearSpeech();
    if (!opts.instant) await fade(false);
    busy--;
    if (!opts.noEnter && room.enter) { busy++; try { await room.enter(entry); } finally { busy--; } }
    if (!busy && !room.noSave && !opts.noSave) autosave();
    updateHover();
  }
  function refreshNpcs(reset) {
    const keep = reset ? new Map() : new Map(npcs.map(a => [a.id, a]));
    // extras whose sprites are not painted yet are simply absent
    const amb = (room.ambient || []).filter(a => IMG['spr:' + a.frames[0]]).map(a => {
      if (!CHARS[a.id]) CHARS[a.id] = { scale: a.scale || 1, idleHold: a.idleHold || [8, 20], variantHold: a.variantHold || [1.6, 3.2], frames: { idle: a.frames, walk: a.walk, talk: a.talkFrames, poses: a.poses, sets: a.sets } };
      return Object.assign({ ambient: true, fixedDir: true, ch: a.id }, a);
    });
    npcs = (room.npcs || []).concat(amb).filter(n => !n.when || n.when()).map(n => {
      if (keep.has(n.id)) return keep.get(n.id);
      const a = new Actor(n.id, n.ch || n.id, n.x, n.y, n.dir);
      a.def = n; a.h = n.h || null; a.overlay = n.overlay || null; a.loop = n.loop || null; a.set = (typeof n.set === 'function' ? n.set() : n.set) || null;
      if (n.init) n.init(a);
      return a;
    });
  }
  function renderLabels() {
    labelsEl.innerHTML = '';
    for (const l of (room.labels || [])) {
      if (l.when && !l.when()) continue;
      const d = document.createElement('div');
      d.className = 'lbl'; d.textContent = typeof l.text === 'function' ? l.text() : l.text;
      d.style.left = (l.x / W * 100) + '%'; d.style.top = (l.y / H * 100) + '%';
      labelsEl.appendChild(d); keepInside(d, 6);
    }
  }
  function fade(on) { $('#fade').classList.toggle('on', on); return wait(480); }

  // ---------------------------------------------------------------- render
  function drawBg(name) { const im = IMG['bg:' + name]; if (im) g.drawImage(im, 0, 0, W, H); else { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); } }
  // Re-paints the part of the background (and its layers) that stands in front
  // of an actor. Outlines follow the painted furniture, not a box around it.
  // Per-room colour grade over the finished frame, so painted backgrounds and
  // sprites share one palette: a soft-light wash, plus lifted night blacks.
  const GRADES = {
    shop: ['#c98a4a', 0.16], shop_night: ['#3a5a8c', 0.16, '#05080e'],
    street: ['#e2b072', 0.12], street_night: ['#3a5a8c', 0.14, '#05070c'], police: ['#93a8a0', 0.16],
    tavern: ['#d08040', 0.18], tavern_night: ['#c66a30', 0.12, '#080402'],
    lavadouro: ['#8fb0b8', 0.15], ferreira: ['#c8a060', 0.15],
    convent: ['#dcc290', 0.12], se_tower: ['#c49060', 0.13], antiques: ['#b07840', 0.17],
    cais: ['#9ab0c0', 0.13], boat: ['#a0b4c0', 0.13], cabin: ['#b07a40', 0.17, '#070402'],
    convent_night: ['#30508a', 0.18, '#03070d'], cistern: ['#3c6a68', 0.16, '#020505'],
  };
  function grade(bg) {
    // a variant painting of a room (the tavern with its guitar taken down, a drawer pulled open...)
    // keeps the room's grade: without it the warm wash dropped out and the room looked unlit
    const c = GRADES[bg] || (room && GRADES[room.bg]); if (!c) return;
    g.save(); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = c[1] * 2.2;
    g.fillStyle = c[0]; g.fillRect(0, 0, W, H);
    if (c[2]) { g.globalCompositeOperation = 'screen'; g.globalAlpha = 1; g.fillStyle = c[2]; g.fillRect(0, 0, W, H); }
    g.restore();
  }
  function curBg() { const b = typeof room.bgFn === 'function' ? room.bgFn() : room.bg; return IMG['bg:' + b] ? b : room.bg; }
  function drawOccluder(o) {
    const im = IMG['bg:' + curBg()]; if (!im) return;
    g.save(); g.beginPath();
    for (const p of (o.polys || [o.poly])) { p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }
    g.clip();
    g.drawImage(im, 0, 0, W, H);
    drawLayers(true);
    drawGlows(); // keep lamp halos continuous across the repainted patch
    if (o.draw) o.draw(g, time); // props that sit on the occluding furniture
    g.restore();
  }
  // Depth of an occluder. Furniture painted at an angle gives a `base` line (its
  // front edge on the floor) instead of a single y: whoever stands behind that
  // line at their own x is covered, whoever stands in front is not.
  function occluderY(o) {
    if (!o.base) return o.y;
    const [[x0, y0], [x1, y1]] = o.base;
    const at = x => y0 + (y1 - y0) * Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
    let behind = -Infinity;
    for (const a of npcs.concat(player)) if (a.visible && a.y < at(a.x)) behind = Math.max(behind, a.y);
    return behind === -Infinity ? -1e6 : behind + 0.01;
  }
  // Painted layers cut from clean plates: static fills for things that were
  // taken, and moving parts (pendulums, bells) that swing about a pivot.
  function drawLayers(staticOnly) {
    for (const l of (room.layers || [])) {
      if (l.when && !l.when()) continue;
      const im = IMG['lay:' + l.img]; if (!im) continue;
      const w = l.w || im.width * (l.k || 1), h = l.h || im.height * (l.k || 1);
      const ang = l.swing ? l.swing(time) : 0;
      if (!ang) { g.drawImage(im, l.x, l.y, w, h); continue; }
      if (staticOnly) continue;
      g.save(); g.translate(l.pivot[0], l.pivot[1]); g.rotate(ang * Math.PI / 180);
      g.drawImage(im, l.x - l.pivot[0], l.y - l.pivot[1], w, h); g.restore();
    }
  }
  // ---------------------------------------------------------------- idle: a cigarette
  // After a while with no input Alan lights a cigarette and smokes (light, then inhale / exhale /
  // hold, round again). Any input puts it away: the pose clears before the input is handled, and
  // the frames morph back to his stance. The story supplies the frames, where each one has his
  // mouth and the cigarette's tip (sprite px), and where it's allowed (Game.idleSmoke).
  const SMOKE_AFTER = 20;
  let lastInput = performance.now(), smk = null, smokeSaved = null;
  const puffs = [];
  function noteInput() { lastInput = performance.now(); if (smk) stopSmoke(); }
  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach(ev => document.addEventListener(ev, noteInput, { capture: true, passive: true }));
  function smokeOK() {
    const C = window.Game && Game.idleSmoke;
    if (!C || !room || !player || window.FAST) return false;
    if (!Object.values(C.frames).every(f => SPRITES[f] && IMG['spr:' + f])) return false; // not until every frame is painted
    if (busy || cutscene || dialogResolve || still || selItem || speaking) return false;
    if (!player.visible || player.walking || player.ch !== 'alan' || player.set || room.player === false) return false;
    if (player.pose && !(smk && player.pose === smk.pose)) return false; // a special pose (or undressed) is never interrupted
    if ($('#menu').classList.contains('open')) return false;
    return !C.allowed || C.allowed(room);
  }
  function stopSmoke() {
    if (!smk) return;
    if (player.pose === smk.pose) player.pose = null; // morphs back to his stance
    smk = null; // (the overlay stays until the last of the smoke has drifted away)
  }
  function smokeAnchor(key, pt) {
    const A = player.place(key, player.lastFlip); if (!A || !pt) return null;
    return [player.x + A.x + (A.flipped ? A.sp.w - pt[0] : pt[0]) * A.s, player.y + A.y + pt[1] * A.s, A.s];
  }
  function puff(x, y, s, vx, vy, n, size, a) {
    for (let i = 0; i < n; i++) puffs.push({ x, y, vx: vx * (0.7 + Math.random() * 0.6) + (Math.random() - 0.5) * 6 * s * 3, vy: vy * (0.7 + Math.random() * 0.6), r: size * (0.6 + Math.random() * 0.6), a, life: 0, max: 2.2 + Math.random() * 1.6, seed: Math.random() * 10 });
  }
  function drawSmoke(gc, a, t) {
    const C = Game.idleSmoke, key = smk && player.cur;
    const P = smk && C && C.points && C.points[key];
    if (smk && P) {
      const tip = smokeAnchor(key, P.tip), k = smk.step;
      if (tip) {
        const [x, y, s] = tip;
        // the match flares while he lights up, then the ember breathes with the drag
        if (k === 'light' && smk.t > 0.35 && smk.t < smk.dur - 0.3) {
          const f = 0.75 + 0.25 * Math.sin(t * 31) * Math.sin(t * 17);
          const gr = gc.createRadialGradient(x, y, 0, x, y, 26 * s * 3.3);
          gr.addColorStop(0, `rgba(255,230,160,${0.85 * f})`); gr.addColorStop(0.25, `rgba(255,170,70,${0.35 * f})`); gr.addColorStop(1, 'rgba(255,140,40,0)');
          gc.fillStyle = gr; gc.beginPath(); gc.arc(x, y, 26 * s * 3.3, 0, 7); gc.fill();
        } else if (k !== 'light' || smk.t >= smk.dur - 0.3) {
          const e = k === 'inhale' ? 0.55 + 0.45 * Math.min(1, smk.t / 0.6) : 0.35 + 0.08 * Math.sin(t * 5);
          const gr = gc.createRadialGradient(x, y, 0, x, y, 7 * s * 3.3);
          gr.addColorStop(0, `rgba(255,190,110,${e})`); gr.addColorStop(0.4, `rgba(255,90,30,${e * 0.45})`); gr.addColorStop(1, 'rgba(255,60,20,0)');
          gc.fillStyle = gr; gc.beginPath(); gc.arc(x, y, 7 * s * 3.3, 0, 7); gc.fill();
        }
      }
    }
    // the smoke itself: soft grey wisps that rise, spread and fade
    gc.save();
    for (const p of puffs) {
      const u = p.life / p.max, al = p.a * Math.sin(Math.min(1, u * 4) * Math.PI / 2) * (1 - u);
      if (al <= 0.003) continue;
      const r = p.r * (1 + u * 2.6);
      const gr = gc.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      gr.addColorStop(0, `rgba(222,224,228,${al})`); gr.addColorStop(1, 'rgba(222,224,228,0)');
      gc.fillStyle = gr; gc.beginPath(); gc.arc(p.x, p.y, r, 0, 7); gc.fill();
    }
    gc.restore();
    if (smokeSaved) smokeSaved(gc, a, t);
  }
  let smokeRoom = null;
  function idleSmokeTick(dt) {
    if (room !== smokeRoom) { smokeRoom = room; puffs.length = 0; } // smoke doesn't follow him through a door
    for (const p of puffs) { p.life += dt; p.x += (p.vx + Math.sin(time * 1.3 + p.seed) * 4) * dt; p.y += p.vy * dt; p.vx *= 1 - dt * 0.5; p.vy *= 1 - dt * 0.25; }
    for (let i = puffs.length - 1; i >= 0; i--) if (puffs[i].life > puffs[i].max) puffs.splice(i, 1);
    if (!smk && !puffs.length && player.overlay === drawSmoke) { player.overlay = smokeSaved; smokeSaved = null; }
    const ok = smokeOK();
    if (!ok) { if (smk) stopSmoke(); lastInput = Math.max(lastInput, performance.now() - 1000 * SMOKE_AFTER * 0.5); return; } // after a scene, a fresh wait
    const C = Game.idleSmoke, F = C.frames;
    if (!smk) {
      if ((performance.now() - lastInput) / 1000 < SMOKE_AFTER) return;
      if (player.dir === 'n' || player.dir === 's') player.dir = player.lastEW || 'e'; // the frames are side views
      smk = { i: -1, t: 0, dur: 0, step: null, pose: null };
      if (player.overlay !== drawSmoke) { smokeSaved = player.overlay; player.overlay = drawSmoke; }
    }
    smk.t += dt;
    if (smk.t >= smk.dur) {
      // light once, then round and round: drag, breathe out, hold it a while
      const SEQ = [['light', 2.4], ['inhale', 1.4], ['exhale', 1.8], ['hold', 4 + Math.random() * 3]];
      smk.i = smk.i < 0 ? 0 : smk.i + 1 >= SEQ.length ? 1 : smk.i + 1;
      const [step, dur] = SEQ[smk.i];
      smk.step = step; smk.t = 0; smk.dur = dur; smk.pose = F[step]; player.pose = smk.pose;
      if (step === 'light' && window.Sound) Sound.sfx('match', 0.35);
    }
    // smoke: a breath of it out of his mouth on the exhale, a thin thread off the tip otherwise
    const key = player.cur, P = C.points && C.points[key];
    if (!P) return;
    const dirX = player.lastFlip ? -1 : 1;
    if (smk.step === 'exhale' && smk.t > 0.15 && smk.t < 1.3) {
      const m = smokeAnchor(key, P.mouth);
      if (m && Math.random() < dt * 22) puff(m[0], m[1], m[2], dirX * 34 * m[2] * 3.3, -6 * m[2] * 3.3, 1, 5 * m[2] * 3.3, 0.22);
    }
    if (smk.step !== 'light' || smk.t > smk.dur - 0.3) {
      const tp = smokeAnchor(key, P.tip);
      if (tp && Math.random() < dt * 5) puff(tp[0], tp[1] - 2, tp[2], dirX * 2, -22 * tp[2] * 3.3, 1, 2.2 * tp[2] * 3.3, 0.16);
    }
  }
  let frameErr = 0;
  function frame(now) {
    requestAnimationFrame(frame); // queued first: a throwing hook skips one frame, never the loop
    if (window.HOLD) { if (!(window.ADVANCE > 0)) { last = now; return; } window.ADVANCE--; } // test recordings: step frame by frame
    const dt = window.STEP_DT || Math.min(0.05, (now - last) / 1000); last = now; time += dt; // STEP_DT: fixed steps for test recordings
    // a device that can't keep up with the mesh warp falls back to flat frames
    if (window.WARP == null && !window.FAST) { // (WARP = true forces it on, false off)
      slowT = (now - last0 > 45) ? slowT + 1 : Math.max(0, slowT - 2); last0 = now;
      if (slowT > 120) { window.WARP = false; slowT = 0; console.info('Warp off: frames too slow on this device'); }
    }
    try { drawFrame(dt); } catch (e) { if (frameErr++ < 5) console.error('frame', e); }
  }
  function drawFrame(dt) {
    if (room) {
      player.update(dt); npcs.forEach(a => a.update(dt));
      idleSmokeTick(dt);
      updateLights(time);
      drawBg(curBg());
      if (room.animBack) room.animBack(g, time);
      drawLayers(false);
      if (room.anim) room.anim(g, time);
      drawGlows();
      // depth-sorted actors + occluders cut from the painting
      const items = [];
      for (const a of npcs) if (a.visible) items.push({ y: a.y, fn: () => { a.draw(); if (a.overlay) a.overlay(g, a, time); } });
      if (player.visible) items.push({ y: player.y, fn: () => { player.draw(); if (player.overlay) player.overlay(g, player, time); } });
      for (const o of (room.occluders || [])) if (!o.when || o.when()) items.push({ y: occluderY(o), fn: () => drawOccluder(o) });
      items.sort((a, b) => a.y - b.y).forEach(i => i.fn());
      if (room.animFg) room.animFg(g, time);
      if (room.fog) {
        const f = typeof room.fog === 'function' ? room.fog() : room.fog;
        if (f) { FX.drawFog(g, fogA, time, f, 12, 0); FX.drawFog(g, fogB, time, f * 0.7, 22, 40); }
      }
      // the whole room breathes with its flames (characters included)
      const L = roomLight();
      if (L.flickerShade) {
        const fl = roomLights.filter(l => l.kind && l.kind !== 'steady');
        const avg = fl.length ? fl.reduce((s, l) => s + l.f, 0) / fl.length : 1;
        g.fillStyle = `rgba(0,0,0,${Math.max(0, L.flickerShade * (1 - avg)).toFixed(3)})`; g.fillRect(0, 0, W, H);
      }
      if (room.grade) { g.fillStyle = room.grade; g.fillRect(0, 0, W, H); }
      grade(curBg());
      FX.vignette(g, room.vignette != null ? room.vignette : 0.45);
      positionSpeech();
    }
    if (still) drawStill(dt);
  }

  // ---------------------------------------------------------------- speech
  let speaking = null;
  function actorFor(who) {
    if (who === 'alan') return player.visible ? player : null;
    return npcs.find(a => (a.id === who || a.id === 'npc_' + who) && a.visible)
      // someone painted into Alan's pair frame speaks from the pair (Game.pairSpeaker: pose -> speaker id)
      || (player.visible && player.pose && window.Game.pairSpeaker && window.Game.pairSpeaker(player.pose) === who ? player : null);
  }
  // Speakers face each other: an NPC turns to Alan when it speaks, and Alan turns
  // to whoever he is talking with (the last NPC who spoke, else the nearest one).
  let lastPartner = null;
  // Only the people who move around the rooms with Alan turn to follow him (Alan, Inês, Vasco, or a
  // def with turns: true). Everyone else keeps the facing their room gives them: no flipping back and
  // forth; Alan comes to the side they already face (see approach).
  const TURNERS = new Set(['ines', 'vasco']);
  const turnsFreely = a => a === player || TURNERS.has(a.id) || !!(a.def && a.def.turns);
  const canTurn = a => a && a.visible && !a.walking && !a.pose && (a.dir === 'e' || a.dir === 'w') && !(a.def && (a.def.fixedDir || a.def.ambient)) && turnsFreely(a);
  function faceEachOther(actor) {
    if (!player.visible) return;
    if (actor && actor !== player) {
      lastPartner = actor;
      if (canTurn(actor) && Math.abs(player.x - actor.x) > 30) actor.dir = player.x > actor.x ? 'e' : 'w';
      if (canTurn(player) || (player.visible && !player.walking && !player.pose && (player.dir === 'n' || player.dir === 's'))) player.dir = actor.x > player.x ? 'e' : 'w';
    } else if (actor === player) {
      let other = lastPartner && lastPartner.visible && npcs.includes(lastPartner) ? lastPartner : null;
      if (!other) other = npcs.filter(a => a.visible && !(a.def && a.def.ambient)).sort((a, b) => Math.abs(a.x - player.x) - Math.abs(b.x - player.x))[0];
      if (other && Math.abs(other.x - player.x) > 30 && Math.abs(other.x - player.x) < 900 && !player.walking && !player.pose) player.dir = other.x > player.x ? 'e' : 'w';
      if (other && canTurn(other)) other.dir = player.x > other.x ? 'e' : 'w';
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
    if (!speaking || !speaking.actor) return;
    const b = speaking.actor.bbox();
    speechEl.style.left = ((b.x + b.w / 2) / W * 100) + '%'; speechEl.style.top = ((b.y - 10) / H * 100) + '%';
    keepInside(speechEl, 14);
  }
  function clearSpeech() {
    if (speaking && speaking.actor) phraseEndT = time; // the line is over: listeners may nod
    speechEl.style.display = 'none'; narrEl.style.display = 'none';
    if (speaking && speaking.actor) speaking.actor.talking = false;
    speaking = null;
  }
  const strip = t => t.replace(/\[[^\]]*\]\s*/g, '');

  const cutsceneHold = () => room && room.holdFacing && room.holdFacing();
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
    busy++;
    clearSpeech();
    const actor = (opts.offscreen || still) ? null : actorFor(who);
    speaking = { id, actor };
    if (actor) {
      actor.talking = true; actor.talkPose = true; actor.talkT = 0.6;
      if (!cutsceneHold()) faceEachOther(actor);
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
    const ms = window.FAST ? 20 : dur ? dur * 1000 + 250 : Math.max(1800, text.length * 58);
    await new Promise(res => {
      let finished = false, t = setTimeout(check, ms);
      // a slow-loading voice can outlast the estimate: hold the line until it has finished
      function check() { if (finished) return; if (!window.FAST && Sound.voicePlaying && Sound.voicePlaying()) t = setTimeout(check, 120); else done(); }
      function done() { if (finished) return; finished = true; clearTimeout(t); if (skipFn === done) skipFn = null; res(); }
      setTimeout(() => { if (!finished) skipFn = done; }, 180);
    });
    Sound.stopVoice();
    clearSpeech();
    busy--;
    await wait(110);
  }
  // a recorded song with timed captions: cues [[seconds, text], ...]; a click ends it early
  async function lyrics(song, cues, who) {
    busy++;
    const t = narrEl.querySelector('.txt');
    narrEl.querySelector('.who').textContent = NAMES[who] || '';
    t.style.fontStyle = 'italic'; t.style.color = COLORS[who] || '#fff';
    let shown = -1, over = false;
    const tick = setInterval(() => {
      const now = song.el.currentTime; let k = -1;
      cues.forEach(([at], i) => { if (now >= at) k = i; });
      if (k !== shown) { shown = k; if (k >= 0 && cues[k][1]) { t.textContent = cues[k][1]; narrEl.style.display = 'block'; } else narrEl.style.display = 'none'; }
    }, 120);
    const skip = () => { if (!over) song.stop(900); };
    skipFn = skip;
    if (window.FAST) song.stop(10);
    await song.ended; over = true;
    clearInterval(tick); if (skipFn === skip) skipFn = null;
    narrEl.style.display = 'none'; t.style.fontStyle = 'normal';
    busy--;
  }
  async function says(...ids) { if (Sound.preloadVoice) ids.forEach(id => Sound.preloadVoice(id)); for (const id of ids) await say(id); }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ---------------------------------------------------------------- dialogue
  async function dialog(topics) {
    const used = new Set();
    for (;;) {
      const avail = topics.filter(t => (!t.when || t.when()) && !(t.once && used.has(t)));
      const pick = await new Promise(res => {
        dialogResolve = res;
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
      dialogResolve = null;
      dialogEl.classList.remove('open');
      used.add(pick);
      // the story layer can stage a chosen line like any other (speaker poses, listeners' faces)
      if (pick.line && !pick.silent) await (window.Game.sayChoice ? window.Game.sayChoice(pick.line) : say(pick.line));
      if (pick.run) await pick.run();
      if (pick.bye) return;
    }
  }

  // ---------------------------------------------------------------- inventory
  function has(id) { return state.inv.includes(id); }
  const ITEM_SFX = { key: 'key_pickup', fkey: 'key_pickup', vkey: 'keys_ring', reserve_key: 'key_jingle', ledger: 'book_take', coins: 'cash_register',
    newspaper: 'paper_take', file55: 'paper_take', tidecard: 'paper_take', lyrics_sheet: 'paper_take', sketch: 'paper_take', brotherhood_charter: 'paper_take', vasco_card: 'paper_take',
    tongue: 'brass_heavy', twin: 'brass_heavy', matches: 'matchbox', glass: 'glass_set', lantern: 'lantern', knife: 'knife_take', sardine: 'sardine_catch', sanches_fragment: 'stone_clack', magnifier: 'pickup' };
  function giveItem(id, silent) {
    if (has(id)) return;
    state.inv.push(id); renderInv();
    // each thing taken sounds like itself: a key jingles, paper rustles, brass is heavy
    if (!silent) { Sound.sfx(ITEM_SFX[id] || 'pickup', 0.8); flashInv(); }
  }
  function takeItem(id) { state.inv = state.inv.filter(i => i !== id); if (selItem === id) selItem = null; renderInv(); }
  function flashInv() { invBar.classList.add('show', 'flash'); setTimeout(() => invBar.classList.remove('flash'), 900); setTimeout(() => { if (!invHover && !selItem) invBar.classList.remove('show'); }, 1800); }
  function itemName(id) { const it = ITEMS[id]; return typeof it.name === 'function' ? it.name() : it.name; }
  function renderInv() {
    invEl.innerHTML = '';
    state.inv.forEach(id => {
      const slot = document.createElement('div');
      slot.className = 'slot' + (selItem === id ? ' selected' : '');
      const c = document.createElement('canvas'); c.width = 96; c.height = 96;
      c.getContext('2d').drawImage(iconFor(id), 0, 0, 96, 96);
      slot.appendChild(c);
      slot.title = itemName(id);
      slot.onclick = e => { e.stopPropagation(); clickItem(id); };
      slot.oncontextmenu = e => { e.preventDefault(); e.stopPropagation(); if (!busy) lookItem(id); };
      slot.onmouseenter = () => { if (!busy) showHoverText(selItem && selItem !== id ? `Use ${itemName(selItem)} with ${itemName(id)}` : itemName(id), slot); };
      slot.onmouseleave = () => hideHover();
      invEl.appendChild(slot);
    });
    updateCursor();
  }
  async function lookItem(id) {
    busy++; try { await runHandler(ITEMS[id].look); } finally { busy--; }
  }
  function clickItem(id) {
    if (busy) return;
    Sound.sfx('click');
    if (selItem && selItem !== id) {
      const a = ITEMS[selItem], b = ITEMS[id];
      const h = (a.with && a.with[id]) || (b.with && b.with[selItem]);
      selItem = null; renderInv();
      busy++; runHandler(h || 'alan_def_item').finally(() => { busy--; });
      return;
    }
    selItem = selItem === id ? null : id;
    renderInv();
  }
  function iconFor(id) {
    const it = ITEMS[id], key = typeof it.icon === 'function' ? it.icon() : (it.icon || id);
    return FX.icon(key);
  }
  function updateCursor() {
    wrap.classList.toggle('holding', !!selItem);
    if (selItem) {
      const [c, cg] = FX.mk(64, 64);
      cg.drawImage(iconFor(selItem), 0, 0, 64, 64);
      canvas.style.cursor = `url(${c.toDataURL()}) 8 8, pointer`;
    } else canvas.style.cursor = '';
  }

  // ---------------------------------------------------------------- input
  let invHover = false;
  invBar.addEventListener('mouseenter', () => { invHover = true; invBar.classList.add('show'); });
  invBar.addEventListener('mouseleave', () => { invHover = false; if (!selItem) invBar.classList.remove('show'); });
  $('#bag').addEventListener('click', e => { e.stopPropagation(); invBar.classList.toggle('show'); });

  function targetAt(x, y) {
    if (!room) return null;
    if (selItem && player.visible) { const b = player.bbox(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return { kind: 'self', def: { name: 'Alan', items: (room.self && room.self.items) || {} } }; }
    // the smallest hotspot under the cursor wins, so a box of matches on the bar
    // or a tile on the bunk is never swallowed by the bigger thing around it;
    // small props also win over the empty corners of a person's bounding box
    let best = null, bestA = Infinity;
    for (const h of room.hotspots || []) {
      if (h.when && !h.when()) continue;
      if (!hitShape(h, x, y)) continue;
      const ar = hotArea(h); if (ar <= bestA) { best = h; bestA = ar; }
    }
    const people = npcs.filter(a => a.visible && a.def).sort((a, b) => b.y - a.y);
    const inBox = a => { const b = a.bbox(); return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; };
    // a click on someone's painted body is always that person
    for (const a of people) if (inBox(a) && a.opaqueAt(x, y)) return { kind: 'npc', actor: a, def: a.def };
    if (best && bestA < 5000) return { kind: 'hot', def: best };
    for (const a of people) if (inBox(a)) return { kind: 'npc', actor: a, def: a.def };
    return best ? { kind: 'hot', def: best } : null;
  }
  const alphaCache = new Map();
  function alphaAt(im, u, v) {
    let c = alphaCache.get(im);
    if (!c) {
      const w = Math.min(im.naturalWidth || im.width, 400), h = Math.round(w * (im.naturalHeight || im.height) / (im.naturalWidth || im.width));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, w, h);
      c = { w, h, d: cx.getImageData(0, 0, w, h).data }; alphaCache.set(im, c);
    }
    const px = Math.min(c.w - 1, Math.floor(u * c.w)), py = Math.min(c.h - 1, Math.floor(v * c.h));
    return c.d[(py * c.w + px) * 4 + 3];
  }
  function hotArea(h) {
    if (h.rect) return h.rect[2] * h.rect[3];
    let a = 0; const p = h.poly; for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]);
    return Math.abs(a / 2);
  }
  function nameOf(t) { const n = t.def.name; return typeof n === 'function' ? n() : n; }
  // What a left click does on a target (Broken Sword-style smart action).
  function defaultVerb(def) {
    if (def.ambient) return def.talk ? 'talk' : 'look';
    if (def.exit) return 'exit';
    if (def.talk) return 'talk';
    if (def.use) return 'use';
    if (def.take) return 'take';
    return 'look';
  }
  const CURSOR_CLASS = { exit: 'c-exit', talk: 'c-talk', use: 'c-use', take: 'c-use', look: 'c-look' };
  function updateHover() {
    if (busy || !room || mouse.x < 0) { hideHover(); canvas.className = ''; return; }
    hoverTarget = targetAt(mouse.x, mouse.y);
    if (!hoverTarget) { canvas.className = ''; hideHover(); return; }
    canvas.className = selItem ? '' : CURSOR_CLASS[defaultVerb(hoverTarget.def)];
    const name = nameOf(hoverTarget);
    showHoverText(selItem ? `Use ${itemName(selItem)} on ${name}` : name);
  }
  function showHoverText(txt, el) {
    hoverEl.textContent = txt; hoverEl.style.display = txt ? 'block' : 'none';
    if (el) { const r = el.getBoundingClientRect(), gr = wrap.getBoundingClientRect(); hoverEl.style.left = ((r.left + r.width / 2 - gr.left) / gr.width * 100) + '%'; hoverEl.style.top = ((r.top - gr.top) / gr.height * 100 - 4) + '%'; }
    else { hoverEl.style.left = (mouse.x / W * 100) + '%'; hoverEl.style.top = (mouse.y / H * 100 - 5) + '%'; }
    if (txt) keepInside(hoverEl, 8);
  }
  function hideHover() { hoverEl.style.display = 'none'; }
  function sceneCoords(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
  }
  canvas.addEventListener('mousemove', e => {
    mouse = sceneCoords(e); updateHover();
    if (mouse.y > H - 60 && !busy) invBar.classList.add('show');
    else if (!invHover && !selItem && mouse.y < H - 140) invBar.classList.remove('show');
  });
  canvas.addEventListener('mouseleave', () => { mouse = { x: -1, y: -1 }; hideHover(); });
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (skipFn) { skipFn(); return; }
    if (busy) return;
    if (selItem) { selItem = null; renderInv(); updateHover(); return; }
    const p = sceneCoords(e), t = targetAt(p.x, p.y);
    if (t) interact(t, 'look');
  });
  canvas.addEventListener('click', e => {
    if (skipFn) { skipFn(); return; }
    if (busy || !room) return;
    const p = sceneCoords(e);
    const t = targetAt(p.x, p.y);
    if (!t) {
      if (room.walk && player.visible) { const [x, y] = clampToPoly(p.x, p.y, room.walk); player.walkTo(x, y); }
      if (selItem) { selItem = null; renderInv(); }
      return;
    }
    interact(t, selItem ? 'item' : defaultVerb(t.def));
  });
  // long-press = examine on touch devices
  let pressT = null;
  canvas.addEventListener('touchstart', e => {
    const tch = e.touches[0]; const p = sceneCoords(tch);
    pressT = setTimeout(() => { pressT = null; const t = targetAt(p.x, p.y); if (t && !busy) interact(t, 'look'); }, 550);
  }, { passive: true });
  canvas.addEventListener('touchend', () => { if (pressT) clearTimeout(pressT); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === '.' || e.key === ' ') { if (skipFn) { skipFn(); e.preventDefault(); } return; }
    if (e.key === 'i' || e.key === 'I') invBar.classList.toggle('show');
    const n = parseInt(e.key, 10);
    if (dialogResolve && n >= 1) { const btn = dialogEl.querySelectorAll('button')[n - 1]; if (btn) btn.click(); }
  });

  async function runHandler(h, ctx) {
    if (!h) return;
    if (typeof h === 'string') return say(LINES[h] ? h : failLine(ctx || { def: {} }, 'use'));
    if (Array.isArray(h)) { for (const x of h) await runHandler(x, ctx); return; }
    if (typeof h === 'function') return h(ctx);
  }
  async function approach(def, actor) {
    if (!player.visible || !room.walk) return;
    let at = def.at;
    if (!at && actor) {
      // someone who keeps their facing is met on the side they face; anyone else on Alan's side
      const gap = actor.height() * 0.42, holds = !turnsFreely(actor) && (actor.dir === 'e' || actor.dir === 'w');
      const side = holds ? (actor.dir === 'e' ? 1 : -1) : (actor.x > player.x ? -1 : 1);
      at = [actor.x + side * gap, actor.y + 6];
    }
    if (!at) return;
    let [x, y] = clampToPoly(at[0], at[1], room.walk);
    // talking to someone: stand beside them, never in front covering them. If the spot would put
    // Alan over the figure (closer than the two half-widths, at or in front of their depth), step
    // out to whichever side of them is free on the floor, nearer side first.
    if (actor && actor.visible) {
      const gap = (actor.height() + player.height()) * 0.21;
      if (y >= actor.y - 12 && Math.abs(x - actor.x) < gap) {
        const holds = !turnsFreely(actor) && (actor.dir === 'e' || actor.dir === 'w');
        const near = holds ? (actor.dir === 'e' ? 1 : -1) : (player.x < actor.x ? -1 : 1), opts = [near, -near].map(sd => clampToPoly(actor.x + sd * gap, y, room.walk));
        const best = opts.find(([cx]) => Math.abs(cx - actor.x) >= gap * 0.85) || opts.sort((a, b) => Math.abs(b[0] - actor.x) - Math.abs(a[0] - actor.x))[0];
        [x, y] = best;
      }
    }
    await player.walkTo(x, y);
    if (def.face) player.dir = def.face;
    else if (actor) { player.dir = actor.x > player.x ? 'e' : 'w'; if (canTurn(actor) || (turnsFreely(actor) && !actor.def.fixedDir)) actor.dir = player.x > actor.x ? 'e' : 'w'; }
  }
  // A failed use always gets an Alan line: the target's own, then a
  // character-specific refusal, then the shared pool (no immediate repeats).
  let lastFail = null;
  function failLine(t, verb) {
    if (t.def.fail) return t.def.fail;
    if (verb === 'item' && t.actor && FAIL_BY_CHAR[t.actor.id]) return FAIL_BY_CHAR[t.actor.id];
    if (verb === 'look') return 'alan_fail_look';
    if (verb === 'talk') return 'alan_fail_talk';
    if (verb === 'take' && Math.random() < 0.5) return 'alan_fail_take';
    let id; do { id = 'alan_fail_' + String(1 + Math.floor(Math.random() * 10)).padStart(2, '0'); } while (id === lastFail);
    return (lastFail = id);
  }
  const FAIL_BY_CHAR = { lacerda: 'alan_fail_lacerda_item', ze: 'alan_fail_ze_item', abilio: 'alan_fail_abilio_item', ines: 'alan_fail_ines_item', rui: 'alan_fail_rui_item' };
  async function interact(t, verb) {
    const def = t.def, item = verb === 'item' ? selItem : null;
    busy++;
    hideHover(); canvas.className = '';
    try {
      if (t.actor && t.actor !== player) { // Alan's lines go to whoever he is dealing with, and he turns to them
        lastPartner = t.actor;
        if (verb !== 'look' && verb !== 'exit' && canTurn(player) && Math.abs(t.actor.x - player.x) > 30) player.dir = t.actor.x > player.x ? 'e' : 'w';
      }
      if (def.ambient && verb !== 'look' && !(verb === 'talk' && def.talk) && !(item && def.items && def.items[item])) { if (item) { selItem = null; renderInv(); } await say('alan_npc_busy'); return; }
      if (t.kind === 'self') {
        const h = def.items[item] || def.items.any;
        selItem = null; renderInv(); invBar.classList.remove('show');
        await runHandler(h || failLine(t, 'item'), t); return;
      }
      if (verb === 'look') {
        if (player.visible && def.at && !t.actor) player.dir = def.at[0] > player.x ? 'e' : 'w';
        if (t.actor && t.actor !== player && canTurn(player) && Math.abs(t.actor.x - player.x) > 30) player.dir = t.actor.x > player.x ? 'e' : 'w';
        await runHandler(def.look || failLine(t, 'look'), t); return;
      }
      if (verb === 'exit') {
        if (def.locked && def.locked()) { if (def.exit) Sound.sfx('door_rattle', 0.6); await say((typeof def.lockedLine === 'function' ? def.lockedLine() : def.lockedLine) || 'alan_fail_04'); return; }
        await approach(def, t.actor);
        await goRoom(typeof def.exit === 'function' ? def.exit() : def.exit, def.entry || room.id); return;
      }
      if (t.actor) t.actor.engaged++;
      await approach(def, t.actor);
      if ((verb === 'take' || verb === 'use' || item) && player.visible && def.reach !== false) await reach(t);
      if (item) {
        const h = def.items && (def.items[item] || def.items.any);
        selItem = null; renderInv(); invBar.classList.remove('show');
        await runHandler(h || failLine(t, 'item'), t);
      } else await runHandler(def[verb] || failLine(t, verb), t);
    } finally {
      if (t.actor) { t.actor.engaged = Math.max(0, t.actor.engaged - 1); t.actor.resumeT = 1.4; }
      busy--;
      if (room && room.onAction && verb !== 'exit') { busy++; try { await room.onAction(t, verb); } finally { busy--; } }
      updateHover();
    }
  }
  // Alan reaches toward what he takes, uses or hands over.
  async function reach(t) {
    const cx = t.actor ? t.actor.x : t.def.rect ? t.def.rect[0] + t.def.rect[2] / 2 : player.x;
    if (Math.abs(cx - player.x) > 8) player.dir = cx > player.x ? 'e' : 'w';
    else if (player.dir === 'n' || player.dir === 's') player.dir = player.lastFlip ? 'w' : 'e';
    player.pose = 'reach';
    await wait(window.FAST ? 30 : 520);
    player.pose = null;
  }

  // ---------------------------------------------------------------- stills
  // Full-screen painted stills for cutscenes, with a slow Ken Burns move.
  let still = null;
  function drawStill(dt) {
    const s = still;
    // a cross-fade (stillTo with cross): the previous painting keeps moving underneath until the new one covers it
    if (s.prev) { paintStill(s.prev, dt, 1, false); if (s.alpha > 0.985) s.prev = null; }
    paintStill(s, dt, s.alpha, !s.prev);
    if (s.target === 0 && s.alpha < 0.02) still = null;
  }
  function paintStill(s, dt, alpha, black) {
    s.t += dt;
    s.alpha += (s.target - s.alpha) * Math.min(1, dt * (s.rate || 3.2));
    if (s !== still) alpha = 1; // the outgoing painting stays opaque under the incoming one
    const im = IMG['still:' + s.name] || IMG['close:' + s.name] || IMG['bg:' + s.name];
    const p = Math.min(1, s.t / s.dur), e = p * p * (3 - 2 * p);
    const z = s.zoom[0] + (s.zoom[1] - s.zoom[0]) * e;
    // the pan centre is clamped so the painting always covers the screen (no black edge at low zoom)
    const m = z >= 1 ? 0.5 / z : 0.5, clampP = v => Math.max(m, Math.min(1 - m, v));
    const cx = clampP(s.pan[0][0] + (s.pan[1][0] - s.pan[0][0]) * e), cy = clampP(s.pan[0][1] + (s.pan[1][1] - s.pan[0][1]) * e);
    g.save(); g.globalAlpha = Math.max(0, Math.min(1, alpha));
    if (black) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); }
    if (im) { const w = W * z, h = H * z; g.drawImage(im, W / 2 - w * cx, H / 2 - h * cy, w, h); }
    if (s.sepia) { g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(255,225,180,0.25)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
    FX.vignette(g, s.vignette != null ? s.vignette : 0.55);
    if (s.grain) for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,240,210,${Math.random() * 0.08})`; g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1); }
    g.restore();
  }
  // Shows a still while fn() runs (lines, waits), then fades back to the room.
  async function showStill(name, fn, opts) {
    opts = opts || {};
    busy++; cutscene++;
    still = { name, t: 0, alpha: still ? still.alpha : 0, target: 1, dur: opts.dur || 14, zoom: opts.zoom || [1.04, 1.12], pan: opts.pan || [[0.5, 0.5], [0.5, 0.5]], sepia: opts.sepia, grain: opts.grain, vignette: opts.vignette };
    clearSpeech();
    await wait(window.FAST ? 20 : 700);
    try { if (fn) await fn(); else await wait(window.FAST ? 20 : (opts.hold || 3000)); }
    finally {
      if (!opts.keep) { still.target = 0; await wait(window.FAST ? 20 : 700); }
      busy--; cutscene--;
    }
  }
  function endStill() { if (still) still.target = 0; }
  // Puts up a painting at once and returns (no wait, the speech box is left alone): with opts.cross it
  // dissolves over the painting already showing instead of rising from black. Used by the chapter
  // transitions and the fado slideshow (js/story/transitions.js); endStill() fades the last one out.
  function stillTo(name, opts) {
    opts = opts || {};
    const prev = still && still.target > 0 && still.alpha > 0.05 ? still : null;
    if (prev) prev.prev = null;
    still = { name, t: 0, alpha: prev && !opts.cross ? prev.alpha : 0, target: 1, rate: opts.rate, prev: opts.cross ? prev : null,
      dur: opts.dur || 14, zoom: opts.zoom || [1.04, 1.12], pan: opts.pan || [[0.5, 0.5], [0.5, 0.5]], sepia: opts.sepia, grain: opts.grain, vignette: opts.vignette };
    if (window.FAST) { still.alpha = 1; still.prev = null; }
  }
  const stillShowing = () => !!still;

  // ---------------------------------------------------------------- close-ups
  // Documents and objects seen up close: painted image plus HTML text, paged.
  const closeEl = $('#closeup');
  function closeup(pages, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      let i = 0; busy++;
      const page = closeEl.querySelector('.page'), prev = closeEl.querySelector('.prev'), next = closeEl.querySelector('.next');
      const show = () => {
        const p = pages[i];
        page.className = 'page ' + (p.cls || '');
        page.style.backgroundImage = p.img ? `url(${(IMG[p.img] || {}).src || ''})` : 'none';
        page.innerHTML = p.html || '';
        if (p.canvas) { const c = document.createElement('canvas'); c.width = p.canvas.w; c.height = p.canvas.h; c.className = 'draw'; page.appendChild(c); p.canvas.draw(c); }
        prev.style.visibility = i > 0 ? 'visible' : 'hidden';
        next.style.visibility = i < pages.length - 1 ? 'visible' : 'hidden';
        Sound.sfx('page');
      };
      let closed = false;
      const close = () => { if (closed) return; closed = true; closeEl.classList.add('hidden'); prev.onclick = next.onclick = closeEl.onclick = null; busy--; resolve(); };
      prev.onclick = ev => { ev.stopPropagation(); if (i > 0) { i--; show(); } };
      next.onclick = ev => { ev.stopPropagation(); if (i < pages.length - 1) { i++; show(); } };
      closeEl.onclick = ev => { if (ev.target === closeEl || ev.target.classList.contains('x')) close(); };
      closeEl.classList.remove('hidden'); show();
      if (window.FAST) setTimeout(close, 60);
      else if (opts.auto) setTimeout(close, opts.auto);
    });
  }

  // ---------------------------------------------------------------- clock overlay
  function setClock(text) {
    const c = $('#clock');
    if (!text) { c.classList.remove('on'); return; }
    if (c.textContent !== text) { c.textContent = text; c.classList.remove('tick'); void c.offsetWidth; c.classList.add('tick'); }
    c.classList.add('on');
  }

  // ---------------------------------------------------------------- saves
  function snapshot() { return JSON.stringify(Object.assign({}, state, { px: player.x, py: player.y, dir: player.dir })); }
  function autosave() { if (/[?&]scene=/.test(location.search) || (state && state.flags.dawn)) return; // past dawn the save is wiped, not rewritten
    try { localStorage.setItem(SAVE_KEY, snapshot()); } catch (e) { /* storage unavailable */ } }
  function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
  async function loadSave(json) {
    let data = json;
    if (!data) { try { data = localStorage.getItem(SAVE_KEY); } catch (e) { data = null; } }
    if (!data) return false;
    let parsed;
    try { parsed = JSON.parse(data); } catch (e) { parsed = null; }
    if (!parsed || !parsed.flags || !ROOMS[parsed.room]) return false; // corrupt or from a retired build: start fresh
    state = Object.assign(freshState(), parsed);
    // saves from before the sketch became an item: hand it over so Inês and Celeste can take it
    if (state.flags.sketched_tile && !state.inv.includes('sketch')) state.inv.push('sketch');
    state.inv = state.inv.filter(id => id !== 'weight'); // the brass weight was taken out of the game
    selItem = null; renderInv();
    room = null;
    await goRoom(state.room, null, { pos: [state.px, state.py, state.dir], noEnter: true });
    return true;
  }
  function checkpoint() { state.flags._checkpoint = null; state.flags._checkpoint = snapshot(); }

  // ---------------------------------------------------------------- cards & menu
  async function card(t1, t2, ms) {
    const c = $('#card');
    c.querySelector('.t1').textContent = t1; c.querySelector('.t2').textContent = t2;
    c.classList.add('on'); await wait(window.FAST ? 50 : (ms || 2800)); c.classList.remove('on');
  }
  function showModal(id, on) { $('#' + id).classList.toggle('hidden', !on); }
  function syncOptions() {
    $('#opt-music').classList.toggle('off', !Sound.musicOn);
    $('#opt-voice').classList.toggle('off', !Sound.voiceOn);
  }
  $('#menu-btn').onclick = e => { e.stopPropagation(); $('#menu').classList.toggle('open'); };
  $('#opt-music').onclick = e => { e.stopPropagation(); Sound.setMusic(!Sound.musicOn); syncOptions(); };
  $('#opt-voice').onclick = e => { e.stopPropagation(); Sound.setVoice(!Sound.voiceOn); syncOptions(); };
  $('#opt-save').onclick = e => { e.stopPropagation(); if (busy) return; autosave(); toast('Game saved'); };
  $('#opt-load').onclick = async e => { e.stopPropagation(); if (busy) return; toast((await loadSave()) ? 'Game loaded' : 'No saved game'); };
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1500); }

  // ---------------------------------------------------------------- boot
  let SPRITES = {};
  async function init(chars, items, rooms, sprites) {
    Object.assign(CHARS, chars); Object.assign(ITEMS, items); Object.assign(ROOMS, rooms); SPRITES = sprites;
    for (const id in ROOMS) ROOMS[id].id = id;
    player = new Actor('alan', 'alan', 300, 600, 'w');
    renderInv(); syncOptions();
    $('#btn-continue').disabled = !hasSave();
    Sound.loadManifest(); Sound.loadSfx();
    const bar = $('#loadbar');
    await preload(p => { bar.style.width = Math.round(p * 100) + '%'; });
    $('#title').classList.add('ready');
    requestAnimationFrame(frame);
  }
  let started = false;
  async function begin(fresh) {
    if (started) return; // a double-click on New game would run the intro twice, voices over each other
    started = true;
    Sound.init();
    showModal('title', false);
    if (fresh || !(await loadSave())) { state = freshState(); renderInv(); await window.Story.newGame(); }
  }

  window.Game = {
    init, begin, goRoom, say, says, lyrics, wait, dialog, reach, showStill, endStill, stillTo, stillShowing, skipLine: () => { if (skipFn) skipFn(); }, closeup, setClock, renderInv,
    set cutscene(v) { cutscene = Math.max(0, cutscene + (v ? 1 : -1)); }, card, fade, checkpoint, loadSave, autosave, showModal, refreshNpcs, renderLabels,
    giveItem, takeItem, has, toast,
    get state() { return state; }, get flags() { return state.flags; },
    get player() { return player; }, get room() { return room; }, get npcs() { return npcs; },
    bgImage: () => room && IMG['bg:' + curBg()],
    image: key => IMG[key],
    mask: () => room && room.skyMask && IMG['mask:' + room.skyMask],
    idleSmoke: null, noteInput, get smoking() { return !!smk; }, get smokeStep() { return smk && smk.step; },
    get isBusy() { return busy > 0 || !!dialogResolve || (player && player.walking); },
    npc: id => npcs.find(a => a.id === id),
    // test hook: act on a hotspot (by name) or an actor (by id), optionally with an item
    async act(target, verb, item) {
      noteInput(); // a scripted action counts as input (puts the cigarette away)
      let t = null;
      const a = npcs.find(n => n.id === target && n.visible);
      if (a) t = { kind: 'npc', actor: a, def: a.def };
      else if (target === 'self') t = { kind: 'self', def: { name: 'Alan', items: (room.self && room.self.items) || {} } };
      else {
        const h = (room.hotspots || []).find(h => (!h.when || h.when()) && (typeof h.name === 'function' ? h.name() : h.name) === target);
        if (h) t = { kind: 'hot', def: h };
      }
      if (!t) throw new Error('no target ' + target + ' in ' + room.id);
      if (item) { if (!has(item)) throw new Error('no item ' + item); selItem = item; }
      await interact(t, item ? 'item' : (verb || defaultVerb(t.def)));
    },
    busy: async fn => { busy++; try { return await fn(); } finally { busy--; updateHover(); if (!busy && room && !room.noSave) autosave(); } },
  };
})();
