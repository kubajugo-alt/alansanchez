// Actors: painted sprite characters (class Actor). Walking (eased, routed, feet never slide), idle and
// talk frames, in-betweens, breath / sway / listening, turning round, and how two frames mix
// (morph, cross-fade or cut: composeFrames).
(function () {
  const E = window.Engine;
  const { W, g, CHARS, IMG, GROUND_K, fit } = E;

  // ---------------------------------------------------------------- actors
  // A character's frames (CHARS[ch].frames):
  //   idle: [rest, variant...]  talk: [gesture...]  walk: [8-frame profile cycle]
  //   front / back: standing frames seen from the front / back, frontWalk / backWalk: their cycles
  //   poses: { name: frame }  loops: { name: { frames, fps } }  sets: { name: { idle?, talk? } }
  // Feet are pinned to (x, y). Breathing only stretches the upper body, the walk
  // cycle advances by the distance actually covered, and every pose change is
  // cross-dissolved.
  const arr = v => v == null ? [] : Array.isArray(v) ? v : [v];
  const XFADE = 0.2, MORPH_T = 0.34;
  const IB_STEP = 0.11;         // how long each in-between frame of a pose change is held (s)
  const WALK_EDGE = 0.13;       // the start step and the stop step of a walk are held this long (s)
  const PAIR_FADE = 0.25;       // into and out of a combined sprite (Alan with someone): a 250 ms cross-fade
  const PAIR_STEP = 0.16;       // one pair painting to the next (an unbutton, a kiss): a quick dissolve
  const canMorph = () => !!(window.Warp && window.WARP !== false && !window.FAST && Warp.ok); // the mesh warp is running
  const XFADE_SHORT = 0.1;
  // Walking (the walk lab, ?scene=walklab, compares the settings; window.WALK overrides them):
  //   lock    how much of the planted foot's slide is taken out: while a walk frame is up the figure is drawn where it
  //           stood when that frame began (1: the foot stays put, then the next frame steps on; 0: it glides)
  //   blend   between walk frames: 'cut', 'dissolve' (a very short cross-fade) or 'morph' (the mesh bends one into the next)
  //   timing  'foot': each frame lasts as far as its planted foot travels in the art (S.WALK_PLANT); 'even': all alike
  //   bob     the body's rise and fall and the head's tilt: 'frame' once per painting (as before), 'step' once per step
  //           (lowest just after the heel lands, highest just after passing, whatever the number of paintings)
  // steady movement (no lock), approved for everyone by the user on 2026-10-21; the lock made walkers stop and start
  const WALK_DEFAULT = { lock: 0, blend: 'cut', timing: 'foot', bob: 'step' };
  const walkOpt = a => Object.assign({}, WALK_DEFAULT, (a && a.c && a.c.walkOpt) || {}, window.WALK || {}); // a character's own (CHARS[ch].walkOpt), then the lab's
  const WALK_DISSOLVE = 0.07;
  const OCC_BAND = 0.2;         // behind furniture: how far up the figure its shade reaches (of his height)
  const OCC_DARK = 0.6;         // ...and how dark it is right at the edge
  const WALK_XF = 0.14;         // standing into a stride and a stride into standing: a short eased cross-fade
  const TURN_XF = 0.18;         // a turn with no front view: the two facings dissolve      // near-identical frames (talk, idle variants, a cigarette drag): a 100 ms eased cross-fade
  // Movement feel (all tunable; 0 switches a feature off). Lengths are in walker heights.
  const WALK_EASE_IN = 0.24;    // s from a standstill to full pace (the first steps are shorter and slower)
  const WALK_START_PACE = 0.3;  // pace of the very first step, as a fraction of full pace
  const WALK_EASE_OUT = 0.2;    // ground over which a walker slows into the last step
  const WALK_END_PACE = 0.45;   // pace of the last step
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
      this.leanX = 0; this.leanV = 0; this.calm = 1; this.walkT = 0; this.pace = 1; this.listen = 0; this.heardT = E.phraseEndT; this.nodAt = -9;
      this.alpha = 1; this.alphaTo = null; this.xfNext = 0; // fade(): the whole figure; crossFade(): the next frame change
      this.perf = 0; this.swayPh = Math.random() * 60; this.tiltPh = Math.random() * 60; this.beatPh = Math.random() * 60;
    }
    get c() { return CHARS[this.ch]; }
    get F() {
      const f = this.c.frames, s = this.set && f.sets && f.sets[this.set];
      return s ? Object.assign({}, f, s) : f;
    }
    // Which way he faces along the leg he's starting (this.target, then this.path): a short leg (a small correction
    // round a corner or into place) doesn't turn him, it takes the facing of the next real leg, else keeps his own;
    // the front and back walks are for a long walk mostly up or down the room, never for a shuffle
    facingFor(hh, F) {
      const legs = [[this.x, this.y, this.target.x, this.target.y]];
      let q = [this.target.x, this.target.y];
      for (const p of (this.path || [])) { legs.push([q[0], q[1], p[0], p[1]]); q = p; }
      const SHORT = hh * 0.33, ew = this.dir === 'e' || this.dir === 'w' ? this.dir : null;
      // a step or two into place with a facing to end on (approach): take it already facing that way, no turn and back
      if (this.endFace && legs.reduce((s, [x0, y0, x1, y1]) => s + Math.hypot(x1 - x0, (y1 - y0) * GROUND_K), 0) < hh * 0.5) return this.endFace;
      for (const [x0, y0, x1, y1] of legs) {
        const dx = x1 - x0, dy = (y1 - y0) * GROUND_K, len = Math.hypot(dx, dy);
        if (len < SHORT) continue;
        const hEnd = E.scaleAt ? hh * Math.min(1, E.scaleAt(y1) / Math.max(1e-6, E.scaleAt(y0))) : hh; // (smaller further away)
        // towards or away from the camera: a leg more up and down than across, long enough for one step (a painted step is
        // about 0.34 of his height; at 0.8, two steps, the rooms are too shallow and the front/back walks never played)
        if (F.frontWalk && F.backWalk && Math.abs(dx) <= Math.abs(dy) * 0.75 && len > Math.min(hh, hEnd) * 0.4) return dy > 0 ? 's' : 'n';
        if (Math.abs(dx) < hh * 0.06) return ew || (dx > 0 ? 'e' : 'w'); // straight up or down a little: no turn
        return dx > 0 ? 'e' : 'w';
      }
      // nothing but short legs: keep his side facing, unless he's going somewhere clearly to the other side
      const tx = (this.path && this.path.length ? this.path[this.path.length - 1][0] : this.target.x) - this.x;
      return ew && Math.abs(tx) < hh * 0.2 ? ew : tx > 0 ? 'e' : 'w';
    }
    walkTo(x, y, endFace) {
      this.endFace = endFace || null;
      return new Promise(res => {
        if (this.resolve) this.resolve();
        if (Math.hypot(x - this.x, y - this.y) < 2) { res(); return; }
        // everyone goes round the furniture cut out of the floor, not through it (route() keeps a straight line when either
        // end is off Alan's floor, as for someone behind a counter, or when the straight line stays on it)
        const [first, ...rest] = !(this.def && this.def.ambient) && E.room && E.room.walk ? E.roundCorners([this.x, this.y], E.route([this.x, this.y], [x, y], E.room.walk), E.room.walk, this.height()) : [[x, y]];
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
    // ground covered by each frame of the current cycle (in heights), measured from where the planted
    // foot sits in each painting; null = the even default (frameStep)
    cycleLens(cyc) {
      const F = this.F, L = this.dir === 'n' && F.backWalk ? F.backWalkLen : this.dir === 's' && F.frontWalk ? F.frontWalkLen : F.walkLen;
      return L && L.length === cyc.length ? L : null;
    }
    // how far through the current step the walker is (0 as a heel lands, 1 as the other one does), by ground covered
    stepU() {
      const cyc = this.cycle(), n = cyc.length; if (!n) return 0;
      const lens = this.cycleLens(cyc) || cyc.map(() => 1), side = !this.dir || this.dir === 'e' || this.dir === 'w';
      let at = side && this.F.walkSteps && this.F.walkSteps.length && this.cycleLens(cyc) ? this.F.walkSteps : null;
      if (!at) at = n >= 8 ? [0, n / 2] : n >= 2 ? [0, Math.floor(n / 2)] : [0]; // contact, then the same on the other foot
      const cum = [0]; for (let i = 0; i < n; i++) cum.push(cum[i] + lens[i]);
      const p = ((this.phase % n) + n) % n, i = Math.floor(p), d = cum[i] + (p - i) * lens[i], T = cum[n];
      const cs = at.map(k => cum[k]);
      for (let j = 0; j < cs.length; j++) {
        const a = cs[j], b = j + 1 < cs.length ? cs[j + 1] : cs[0] + T, dd = d < a ? d + T : d;
        if (dd >= a && dd < b) return (dd - a) / (b - a);
      }
      return 0;
    }
    // the whole figure fades in or out (a partner melting into a combined sprite and back out of it)
    fade(to, dur) {
      if (window.FAST || !(dur > 0)) { this.alpha = to; this.alphaTo = null; return Promise.resolve(); }
      if (this.alphaTo && this.alphaTo.done) this.alphaTo.done();
      return new Promise(done => { this.alphaTo = { from: this.alpha, to, t: 0, dur, done }; });
    }
    // the next frame change dissolves over dur seconds instead of cutting (into and out of a combined sprite)
    crossFade(dur) { this.xfNext = window.FAST ? 0 : (dur || PAIR_FADE); }
    // every frame change dissolves over dur seconds until switched off (0): a scene played as a run of paintings
    crossFadeAll(dur) { this.xfAll = dur || 0; }
    update(dt) {
      const F = this.F;
      if (this.fadeT > 0) this.fadeT = Math.max(0, this.fadeT - dt);
      if (!this.visible || this.alpha <= 0.005) this.cur = null; // off screen: it comes back in its new frame, no dissolve from the old one
      if (this.alphaTo) {
        const A = this.alphaTo, u = Math.min(1, (A.t += dt) / A.dur);
        this.alpha = A.from + (A.to - A.from) * u * u * (3 - 2 * u);
        if (u >= 1) { this.alphaTo = null; A.done(); }
      }
      if (this.ibSeq && (this.ibT += dt) >= (this.ibStep || IB_STEP)) { const st = this.ibStep || IB_STEP; this.ibI += Math.floor(this.ibT / st); this.ibT %= st; } // a slow frame skips ahead
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
        // hurry (a double-click): twice the pace for the rest of this walk; the cycle follows the ground covered, so the legs keep up
        let budget = hh * 0.62 * dt * (this.c.speed || 1) * this.pace * (this.hurry ? 2 : 1), moved = 0, arrived = false;
        // the step carries on round a path point instead of stalling on it (arcs are many short legs)
        for (let guard = 0; guard < 24 && budget > 1e-6; guard++) {
          const dx = this.target.x - this.x, dy = this.target.y - this.y;
          const gd = Math.hypot(dx, dy * GROUND_K); // distance on the ground plane
          if (gd > 0.5) {
            if (this.legFor !== this.target) { this.legFor = this.target; this.legDir = this.facingFor(hh, F); } // once per leg
            if (this.legDir) this.dir = this.legDir;
          }
          if (gd <= budget) {
            this.x = this.target.x; this.y = this.target.y; budget -= gd; moved += gd;
            if (this.path && this.path.length) { const [nx, ny] = this.path.shift(); this.target = { x: nx, y: ny }; } else { arrived = true; break; }
          } else { this.x += dx / gd * budget; this.y += dy / gd * budget; moved += budget; budget = 0; }
        }
        // the cycle advances by ground covered, so planted feet never slide
        const cyc = this.cycle(), lens = this.cycleLens(cyc);
        if (lens) { // each frame lasts exactly as far as its planted foot travels: no sliding
          let m = moved / hh;
          for (let g = 0; g < 64 && m > 1e-9; g++) {
            const i0 = Math.floor(this.phase), len = lens[((i0 % lens.length) + lens.length) % lens.length], rest = (i0 + 1 - this.phase) * len;
            if (m < rest) { this.phase += m / len; m = 0; } else { this.phase = i0 + 1; m -= rest; }
          }
        } else this.phase += moved / (hh * (this.c.frameStep || (cyc.length >= 8 ? 0.085 : 0.17))); // frameStep: ground per frame (a 4-frame stride + passing cycle uses half)
        if (this.rigS && this.cur && this.cur.startsWith('rig:')) {
          const u0 = this.rigS.u; this.rigS.u += moved / (hh * E.rigStride(this.ch));
          if (Math.floor(u0 * 2) !== Math.floor(this.rigS.u * 2) && this.visible) Sound.step((E.room && E.room.floor) || 'stone', this === E.player ? 1 : 0.5, this.x);
        }
        // the planted foot stays put: remember where this walk frame began (drawn there, see drawAt)
        const fi = Math.floor(this.phase);
        if (fi !== this.lockI || this.lockX == null) { this.lockI = fi; this.lockX = this.x; this.lockY = this.y; }
        const idx = Math.floor(this.phase) % cyc.length;
        if (idx !== this.stepIdx && !(this.cur && this.cur.startsWith('rig:'))) {
          this.stepIdx = idx;
          const steps = !this.dir || this.dir === 'e' || this.dir === 'w' ? this.F.walkSteps : null;
          const contact = steps && lens ? steps.includes(idx) : cyc.length >= 8 ? idx % 4 === 0 : idx % 2 === 0;
          if (contact && this.visible && this.x > -40 && this.x < 1320) Sound.step((E.room && E.room.floor) || 'stone', this === E.player ? 1 : 0.35 + 0.4 * Math.max(0, Math.min(1, (this.y - 520) / 200)), this.x);
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
      const spk = E.speaking && E.speaking.actor;
      let lt = 0;
      if (spk && spk !== this && spk.visible && this.visible && !this.talking && !this.walking && Math.abs(spk.x - this.x) < LISTEN_RANGE) lt = spk.x > this.x ? 1 : spk.x < this.x ? -1 : 0;
      this.listen += (lt - this.listen) * Math.min(1, dt * 3.5);
      if (E.phraseEndT > this.heardT) { this.heardT = E.phraseEndT; if (lt && Math.random() < LISTEN_NOD_P) this.nodAt = E.time + 0.12 + Math.random() * 0.35; }
      if (this.talking) {
        this.talkT -= dt;
        const lvl = E.speaking && E.speaking.actor === this ? Sound.voiceLevel() : 0.5;
        this.lvl = (this.lvl || 0) + (lvl - (this.lvl || 0)) * Math.min(1, dt * 12);
        this.quietT = lvl < 0.06 ? this.quietT + dt : 0;
        if (E.speaking && E.speaking.actor === this) {
          if (lvl >= 0.06) this.voiced = true; else if (this.voiced && this.quietT > 0.28) { this.voiced = false; E.phraseEndT = E.time; }
        }
        const n = arr(F.talk).length;
        if (this.quietT > 0.45 && this.talkIdx >= 0 && this.talkT < 0.5) { this.talkIdx = -1; this.talkT = 0.3; }
        else if (this.talkT <= 0) {
          if (this.talkIdx >= 0 && Math.random() < 0.3) { this.talkIdx = -1; this.talkT = 0.35 + Math.random() * 0.4; }
          else { this.talkIdx = n > 1 ? (Math.max(0, this.talkIdx) + 1 + Math.floor(Math.random() * (n - 1))) % n : 0; this.talkT = 0.8 + Math.random() * 1.0; }
        }
      } else { this.talkIdx = 0; this.talkT = 0; this.quietT = 0; this.lvl = 0; }
      const nIdle = arr(F.idle).length;
      if (!(E.cutscene && this.def && this.def.ambient)) this.idleT -= dt; // ambient extras freeze during cutscenes
      if (this.idleT <= 0) {
        const vh = this.c.variantHold || [2, 4.5], ih = this.c.idleHold || [4, 10];
        if (this.idleIdx === 0 && nIdle > 1) {
          this.idleIdx = 1 + Math.floor(Math.random() * (nIdle - 1));
          this.idleT = vh[0] + Math.random() * (vh[1] - vh[0]);
          const v = arr(F.idle)[this.idleIdx];
          if (Array.isArray(v)) this.idleT *= Math.max(1, v.length * 0.6);
          this.idleDur = this.idleT;
        }
        else { this.idleIdx = 0; this.idleT = ih[0] + Math.random() * (ih[1] - ih[0]); }
      }
      // background extras that walk a beat (dockworkers, etc.)
      if (this.def && this.def.patrol && !this.walking && !E.cutscene) {
        this.patrolT = (this.patrolT || 0) - dt;
        if (this.patrolT <= 0) {
          const P = this.def.patrol; this.patrolI = ((this.patrolI || 0) + 1) % P.points.length;
          const [px, py] = P.points[this.patrolI]; this.walkTo(px, py);
          this.patrolT = P.pause[0] + Math.random() * (P.pause[1] - P.pause[0]);
        }
      }
      // NPCs turn toward Alan (after a human beat), unless busy or posed
      if (this !== E.player && E.player && E.player.visible && !this.walking && !this.pose && !this.loopActive() && !(this.def && (this.def.fixedDir || this.def.ambient)) && (this.dir === 'e' || this.dir === 'w') && E.turnsFreely(this)) {
        const want = E.player.x > this.x ? 'e' : 'w';
        if (want !== this.dir && Math.abs(E.player.x - this.x) > 40) { this.turnT += dt; if (this.turnT > 0.6) { this.dir = want; this.turnT = 0; } }
        else this.turnT = 0;
      }
    }
    loopActive() { const F = this.F; return !!(this.loop && F.loops && F.loops[this.loop] && !this.engaged && this.resumeT <= 0 && !this.talking); }
    stop() {
      if (this.walking && !window.FAST) this.leanV -= (this.dir === 'e' ? 1 : this.dir === 'w' ? -1 : 0) * LEAN_SETTLE; // planted: the body rocks back a touch
      if (this.walking) this.stopAt = E.time;
      this.target = null;
      this.path = null;
      this.walking = false;
      this.phase = 0;
      this.stepIdx = -1;
      this.walkT = 0;
      this.hurry = false;
      const r = this.resolve;
      this.resolve = null;
      if (r) r();
    }
    height() { return (this.h || E.scaleAt(this.y)) * (this.c.scale || 1); }
    // frames not painted yet fall back to the character's idle (then talk) frame
    frameKey() {
      const k = this.rawKey(), ok = f => f && E.SPRITES[f] && IMG['spr:' + f];
      if (k && !ok(k) && E.SPRITES[k] && E.want) E.want('spr:' + k, true); // a pose still on its way: fetch it next
      const F = this.F, key = ok(k) ? k : arr(F.idle).concat(arr(F.talk)).find(ok) || k;
      return window.FAST ? key : this.between(key, ok);
    }
    // In-betweens (frames.inbetween: { 'from>to': [frame, ...] }, played backwards for 'to>from'): a big
    // pose change passes through them, IB_STEP each; a walk opens with frames.walkStart (one frame or a run) and ends on
    // frames.walkStop (side views only). Each hand-over is still morphed or cross-faded as usual.
    between(key, ok) {
      if (key.startsWith('rig:')) { this.settled = key; return key; } // the rig makes its own way in and out of a walk
      const F = this.F, side = this.dir === 'e' || this.dir === 'w';
      const ws = arr(F.walkStart).filter(ok); // a walk can open on a short run of frames (weight shift, first step)
      if (side && !this.pose && this.walking && ws.length && this.walkT < WALK_EDGE * ws.length) return ws[Math.floor(this.walkT / WALK_EDGE)];
      if (side && !this.pose && !this.walking && this.stopAt != null && E.time - this.stopAt < WALK_EDGE && ok(F.walkStop)) return F.walkStop;
      const IB = F.inbetween;
      if (!IB) { this.settled = key; return key; }
      if (this.ibSeq && this.ibTarget !== key) this.ibSeq = null; // changed its mind: go straight there
      if (!this.ibSeq && this.settled && key !== this.settled) {
        const fwd = IB[this.settled + '>' + key], rev = IB[key + '>' + this.settled];
        const all = fwd || (rev ? rev.slice().reverse() : []), seq = all.filter(ok);
        // a run with frames still on their way: fetch them now and change plainly this once (half a run would jump)
        if (seq.length < all.length) { if (E.want) all.forEach(f => { if (!ok(f) && E.SPRITES[f]) E.want('spr:' + f, true); }); seq.length = 0; }
        // a run drawn as one motion (frames.ibFps, the Ludo runs) plays at its own frame rate
        const fps = F.ibFps && (F.ibFps[this.settled + '>' + key] || F.ibFps[key + '>' + this.settled]);
        if (seq.length) { this.ibSeq = seq; this.ibI = 0; this.ibT = 0; this.ibTarget = key; this.ibStep = fps ? 1 / fps : IB_STEP; }
      }
      if (this.ibSeq && this.ibI < this.ibSeq.length) return this.ibSeq[this.ibI];
      this.ibSeq = null; this.settled = key;
      return key;
    }
    rawKey() {
      const F = this.F;
      if (E.rigOn && E.rigOn(this.ch) && !this.pose && !this.set && !this.loopActive() && (this.dir === 'e' || this.dir === 'w')) return 'rig:' + this.ch;
      if (this.pose) return (F.poses && F.poses[this.pose]) || this.pose;
      if (this.walking) {
        const c = this.cycle(), i = Math.floor(this.phase) % c.length, a = c[i], b = c[(i + 1) % c.length], M = window.MORPHS;
        // a step with no morph shows its next painting from half way (the planted foot slips half as far, either side of
        // the cut) unless the foot is locked: then each painting holds for its whole step and the foot doesn't slip at all
        const morphs = walkOpt(this).blend === 'morph' && M && M[a + '>' + b] && M[b + '>' + a] && canMorph();
        return !morphs && !(walkOpt(this).lock > 0 && !window.FAST) && this.phase - Math.floor(this.phase) >= 0.5 ? b : a;
      }
      if (this.dir === 'n' && F.back) return arr(F.back)[0];
      if (this.dir === 's' && F.front) return arr(F.front)[0];
      if (this.talking) { const t = arr(F.talk); return t.length && this.talkIdx >= 0 ? t[this.talkIdx % t.length] : arr(F.idle)[0]; }
      if (this.loopActive()) { const L = F.loops[this.loop]; return L.frames[Math.floor(E.time * L.fps) % L.frames.length]; }
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
      return E.alphaAt(A.im, u, v) > 40;
    }
    // sprite placement relative to the feet, in scene px
    place(key, flipped) {
      const sp = E.SPRITES[key], im = IMG['spr:' + key];
      if (sp && !im && E.want) E.want('spr:' + key, true); // a frame still on its way: fetch it next
      else if (im && E.touchImg) E.touchImg('spr:' + key); // (in use: kept in memory)
      if (!sp || !im) return null;
      const s = this.height() / sp.h;
      const ax = flipped ? sp.w - sp.ax : sp.ax;
      return { key, sp, im, flipped, s, x: -ax * s, y: -sp.fy * s, w: sp.w * s, h: sp.hh * s };
    }
    // The living part of the figure, as a displacement of the painted frame (buffer px, feet at fx,fy):
    // breath in the chest, a slow sway from the feet (from the seat when sitting), the head tilting
    // on the neck, nods with the voice, a bob in the step; performers move with the music.
    motion(h, fx, fy, sp, b, key) {
      const t = (window.ANIM_T != null ? window.ANIM_T : E.time) * this.rate + (this.seed || (this.seed = Math.random() * 100));
      const c = this.c.anim || {}, d = (this.def && this.def.anim) || {};
      const k = (n, def) => (d[n] != null ? d[n] : c[n] != null ? c[n] : def);
      // a waist-up painting (sp.waist) is placed on the whole figure: its feet below the cut, the body still from the cut down
      const s = h / sp.h, cut = waistDrop(sp) * s;
      fy += cut;
      const F = Math.max(1, (sp.fy - sp.top) * s + cut), vCut = cut / F;
      // groups, pairs, lying figures (anim.wide: false for one figure painted with what he sits on: the bench's old man)
      const wide = k('wide', sp.w / Math.max(1, sp.fy - sp.top + waistDrop(sp)) > 0.78) || k('rig', '') === 'flat';
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
      const root = Math.max(vCut, k('seated', SEATED.has(this.ch) || !!(key && this.c.seatedFrames && this.c.seatedFrames.test(key))) ? 0.42 : 0.1);
      // head: a slow tilt, a nod with each phrase spoken, more when performing
      // listening: which way the painting faces (side views only), the incline toward the speaker
      // (stronger when the speaker is in front of them), and the nod's envelope
      const fs = (sp.facesLeft ? -1 : 1) * (this.lastFlip ? -1 : 1), side = !(this.F.front && arr(this.F.front).includes(key)) && !(this.F.back && arr(this.F.back).includes(key));
      const ahead = this.listen * fs > 0 ? 1 : 0.45;
      const nu = (E.time - this.nodAt) / 0.5, nod = nu > 0 && nu < 1 ? Math.pow(Math.sin(nu * Math.PI), 2) : 0;
      const hear = wide ? 0 : (side ? this.listen * ahead * LISTEN_TILT + fs * nod * LISTEN_NOD : 0);
      const rigged = key && key.startsWith('rig:');
      const byStep = this.walking && walkOpt(this).bob === 'step', stepU = byStep ? this.stepU() : 0;
      const tilt = wide ? 0 : k('nod', 1) * (0.02 + perf * 0.055) * Math.sin(phTilt + 2.1) + (this.walking && !rigged ? (byStep ? 0.006 * Math.sin(2 * Math.PI * stepU) : 0.012 * Math.sin(this.phase * Math.PI)) : 0) + hear;
      const bob = wide ? 0 : (perf * 0.006 * (0.5 + 0.5 * Math.sin(phBeat)) + nod * 0.008) * F;
      // walking: the body rises over the passing foot and settles on the stride
      const step = this.walking && !rigged ? -0.007 * F * (byStep ? 0.5 - 0.5 * Math.cos(2 * Math.PI * (stepU - 0.25)) : Math.pow(Math.sin(this.phase * Math.PI), 2)) : 0;
      const neck = 0.855, ca = Math.cos(tilt), sa = Math.sin(tilt);
      const sm = (a, z, v) => { const q = Math.max(0, Math.min(1, (v - a) / (z - a))); return q * q * (3 - 2 * q); };
      const px0 = fx, py0 = fy - neck * F;
      // lean (into a walk, back on stopping, into a turn) bends from the feet like the sway
      const lean = wide ? this.leanX * 0.4 : this.leanX;
      const swayAt = v => { const q = sm(root, 1, v); return (sway + lean) * h * q * q; };
      const pxN = px0 + swayAt(neck);
      // turning round: the figure narrows through the turn and opens out facing the new way
      const tp = this.turnT0 != null ? (E.time - this.turnT0) / 0.22 : 1;
      const turnS = tp < 1 ? 0.3 + 0.7 * sm(0, 1, tp) : 1;
      return (x, y) => {
        const v = (fy - y) / F;
        let nx = x, ny = y;
        // breath: the chest widens and lifts above the hips
        const hip = Math.max(0.4, vCut), wb = sm(hip, hip + 0.18, v);
        nx = fx + (x - fx) * (1 + b * 0.45 * wb); ny = y - (v - hip) * F * b * wb;
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
    // where the figure is drawn: its own position, less what the planted foot would have slid since the walk frame began
    drawAt(dt) {
      const L = window.FAST ? 0 : walkOpt(this).lock;
      if (this.walking && L > 0 && this.lockX != null && !(this.cur && this.cur.startsWith('rig:'))) {
        this.lockDX = L * (this.x - this.lockX); this.lockDY = L * (this.y - this.lockY);
      } else { const k = Math.exp(-(dt || 0.016) * 18); this.lockDX = (this.lockDX || 0) * k; this.lockDY = (this.lockDY || 0) * k; if (!this.walking) this.lockX = null; }
      return [this.x - (this.lockDX || 0), this.y - (this.lockDY || 0)];
    }
    draw() {
      if (!this.visible || this.alpha <= 0.005) return;
      const x = this.x, y = this.y, now = performance.now(), [dx, dy] = this.drawAt(this.drawMs ? (now - this.drawMs) / 1000 : 0.016);
      this.drawMs = now; this.x = dx; this.y = dy;
      try {
        if (this.alpha >= 1) return this.drawBody();
        g.save(); g.globalAlpha = this.alpha;
        try { this.drawBody(); } finally { g.restore(); }
      } finally { this.x = x; this.y = y; }
    }
    drawBody() {
      let key = this.frameKey();
      if (key.startsWith('rig:')) E.rigDraw(this);
      let sp = E.SPRITES[key];
      if (!sp) return;
      // background extras keep the pose they were painted in (unless they walk)
      const ambientHold = this.def && this.def.ambient && !this.walking && !this.def.flip;
      let flipped = ambientHold ? false
        : this.dir === 'w' ? !sp.facesLeft : (this.dir === 'e' ? !!sp.facesLeft : this.lastFlip);
      // Turning round between east and west: a figure with a painted front view swings through it
      // (side, front, other side), like an old adventure game; others dissolve from one facing to
      // the other instead of narrowing into a flat card.
      const F = this.F, fk = F.front && arr(F.front)[0], frontOK = fk && E.SPRITES[fk] && IMG['spr:' + fk];
      // a real turn is a change of facing, not two paintings that happen to face different ways
      // ...and judged by which way he faces on screen: in a painting of two, his own figure's facing (he stands right of
      // his partner looking left, but left of Vasco and of Duarte in two of theirs, looking right), so stepping in and out
      // of a pair that keeps him facing his partner is no turn at all
      const ew = this.dir === 'e' || this.dir === 'w';
      const paintedLeft = /^pair_/.test(key) ? !/^pair_(ib_)?(vasco_|guitar_p1|guitar_underwear)/.test(key) : !!sp.facesLeft;
      const looksLeft = flipped ? !paintedLeft : paintedLeft;
      const faceTurn = ew && this.lastLooksLeft != null && looksLeft !== this.lastLooksLeft && !ambientHold;
      if (faceTurn && !this.walking && !window.FAST) this.leanV += (looksLeft ? -1 : 1) * LEAN_TURN; // weight onto the new side
      if (ew) { this.lastLooksLeft = looksLeft; this.lastEW = this.dir; } // (lastEW: his last side facing, for smoke.js)
      if (this.viaT == null && faceTurn && this.cur && !window.FAST && frontOK && key !== fk && this.cur !== fk && !this.pose) this.viaT = E.time;
      if (this.viaT != null) {
        if (E.time - this.viaT < TURN_VIA && frontOK) { key = fk; sp = E.SPRITES[fk]; flipped = !!sp.facesLeft; }
        else { this.viaT = null; this.lastFlip = flipped; this.viaOut = true; } // out of the front view: no second turn
      }
      this.lastFlip = flipped;
      // a turn with no painted front view: the old facing dissolves into the new one (a mirror flip, softened)
      const turned = faceTurn && !frontOK && !this.walking && !window.FAST && this.curFlip != null && this.curFlip !== flipped;
      if (turned && key === this.cur) { this.prev = key; this.prevFlip = this.curFlip; this.fadeDur = this.fadeT = TURN_XF; this.fadeSim = true; this.fadeHand = false; }
      if (key !== this.cur) {
        // a walk frame to the next (in any of its cycles: side, front, back) is a step, blended as WALK says
        const inCycle = this.walking && this.cycle().includes(key) && [F.walk, F.frontWalk, F.backWalk].some(c => arr(c).includes(this.cur));
        const stepX = inCycle && walkOpt(this).blend === 'dissolve' && !window.FAST; // a walk frame to the next: a very short cross-fade
        // a change in the middle of a dissolve leaves behind whichever painting is still more on screen (no pop)
        // a run drawn as one motion (its own frame rate, faster than IB_STEP): each frame hands over to the next one
        const run = this.ibStep < IB_STEP && !!(this.ibSeq || this.ibWas);
        const mid = !run && this.prev && this.fadeT > 0 && this.fadeT / (this.fadeDur || XFADE) > 0.5;
        if (!mid) this.prevFlip = this.curFlip != null ? this.curFlip : flipped; // the outgoing frame keeps the facing it was drawn with
        this.prev = this.cur && (!inCycle || stepX) ? (mid ? this.prev : this.cur) : null;
        // a mouth or gesture change while speaking is a clean frame swap, never a mesh morph
        const tf = this.talking && !this.walking && !this.pose ? arr(F.talk).concat(arr(F.idle).flat()) : null;
        const talkSwap = !!(tf && tf.includes(key) && tf.includes(this.prev));
        // (a set that mixes paintings facing each way shows one of them mirrored: that pair has its own data, 'a>b~')
        const mir = this.prevFlip !== flipped ? '~' : '';
        const M = window.MORPHS, morphable = this.prev && !talkSwap && sameFacing(key, flipped, this.prev, this.prevFlip) && M && M[key + '>' + this.prev + mir] && M[this.prev + '>' + key + mir];
        // without the mesh warp (a slow device, Effects: Light) a pose with morph data dissolves instead of cutting
        const morph = morphable && canMorph();
        // a pair with morph data moves between poses; two near-identical paintings (a mouth, a hand,
        // a drag on the cigarette) get a quick eased cross-fade; anything else dissolves (plain, below)
        const SIM = window.SIMILAR, ibHand = this.ibSeq || this.ibWas; this.ibWas = !!this.ibSeq; // in-between frames hand over with a quick cross-fade too
        // into or out of a combined sprite, or from one pair painting to the next: a plain dissolve (pairs never morph)
        const pairs = this.prev && E.SPRITES[key] && E.SPRITES[this.prev] && E.SPRITES[key].rigid && E.SPRITES[this.prev].rigid;
        if (pairs && !(this.xfNext > 0)) this.xfNext = PAIR_STEP;
        if (this.xfAll > 0 && !(this.xfNext > 0) && !window.FAST) this.xfNext = this.xfAll; // a scene that dissolves every change (crossFadeAll)
        const forced = this.xfNext > 0 && this.prev;
        const flat = !!(morphable && !morph);
        // into a walk and out of one: the standing frame and the stride ease over each other instead of cutting
        const cyc = this.cycle(), edge = !!(this.prev && !morph && !talkSwap && this.prevFlip === flipped &&
          ((this.walking && !cyc.includes(this.prev) && this.walkT < 0.3) || (!this.walking && cyc.includes(this.prev))));
        const similar = forced || flat || edge || stepX || (turned && this.prev) || (!morph && this.prev && this.prevFlip === flipped && (ibHand || (SIM && (SIM[key + '|' + this.prev] || SIM[this.prev + '|' + key]))));
        // anything else (a talk gesture, a pose or a reaction with no morph data, a turn through the front view, another
        // facing, a review frame): the standard dissolve, the new painting up, then the old one gone. Only walk steps cut.
        const plain = !!(this.prev && !morph && !similar);
        const via = this.viaT != null || this.viaOut; // side, front, side: each hand-over quick enough for the swing
        // inside such a run, frame to frame: a fade of half a frame; into it and out of it, one frame
        const inRun = run && this.ibSeq && this.ibSeq.includes(key) && this.ibSeq.includes(this.prev);
        this.fadeDur = run && similar && !forced ? this.ibStep * (inRun ? 0.5 : 1) : forced ? this.xfNext : flat ? XFADE : stepX ? WALK_DISSOLVE : turned ? TURN_XF : edge ? WALK_XF : similar ? XFADE_SHORT
          : plain ? (via ? XFADE_SHORT : this.walking ? WALK_XF : XFADE) : MORPH_T;
        this.xfNext = 0;
        this.fadeSim = !!similar;
        this.fadeHand = !!(forced || plain);
        this.viaOut = false;
        this.fadeT = this.prev ? this.fadeDur : 0;
        this.cur = key;
      }
      this.curFlip = flipped;
      const A = this.place(key, flipped);
      if (!A) return;
      let B = this.prev && this.fadeT > 0 ? this.place(this.prev, this.prevFlip) : null;
      // walking: each step frame flows into the next with the ground covered (when the pair has a morph)
      let walkF = 0;
      if (!B && this.walking && walkOpt(this).blend === 'morph' && window.MORPHS && window.WARP !== false && !window.FAST) {
        const c = this.cycle(), i = Math.floor(this.phase) % c.length, nk = c[(i + 1) % c.length];
        if (nk !== key && MORPHS[key + '>' + nk] && MORPHS[nk + '>' + key] && sameFacing(key, flipped, nk, flipped)) {
          const N = this.place(nk, flipped);
          if (N) { B = N; walkF = this.phase - Math.floor(this.phase); }
        }
      }
      // the mouth and eyelids (js/engine/faces.js) go into the painting before it is lit and bent
      if (E.faceImage) { A.im = E.faceImage(this, A.key, A.im); if (B) B.im = E.faceImage(this, B.key, B.im); }
      const h = this.height();
      // union of both frames, in feet-relative coordinates
      const U = { x: Math.min(A.x, B ? B.x : A.x), y: Math.min(A.y, B ? B.y : A.y) };
      U.r = Math.max(A.x + A.w, B ? B.x + B.w : -1e9); U.b = Math.max(A.y + A.h, B ? B.y + B.h : -1e9);
      const bw = Math.ceil(U.r - U.x) + 1, bh = Math.ceil(U.b - U.y) + 1;
      const comp = walkF ? composeFrames(A, B, 1 - walkF, U, bw, bh, true) : composeFrames(A, B, B ? this.fadeT / (this.fadeDur || XFADE) : 0, U, bw, bh, false, this.fadeSim, !!(E.SPRITES[key].rigid || (B && B.sp.rigid)), this.fadeHand);
      // standing behind furniture (render.js markOccluded): the figure darkens softly towards the furniture's top edge
      if (this.occEdge != null && !window.FAST && comp.getContext) {
        const yE = this.occEdge - (this.y + U.y), band = h * OCC_BAND;
        if (yE > 0 && yE - band < bh) {
          const c2 = comp.getContext('2d'); c2.save(); c2.globalCompositeOperation = 'source-atop';
          const gr = c2.createLinearGradient(0, yE - band, 0, yE + 1);
          gr.addColorStop(0, 'rgba(12,8,5,0)'); gr.addColorStop(0.65, `rgba(12,8,5,${OCC_DARK * 0.45})`); gr.addColorStop(1, `rgba(12,8,5,${OCC_DARK})`);
          c2.fillStyle = gr; c2.fillRect(0, yE - band, bw, band + 2); c2.restore();
        }
      }
      const sinkPx = this.sink * h;
      const unlit = !!(E.room && E.room.unlit && E.room.unlit.test(key));
      const lights = unlit ? [] : E.lightsOn(this.x, this.y - h * 0.55, h, this);
      if (!sinkPx && !unlit) E.groundShadows(this, comp, U, bw, bh, h, lights);
      const shaded = !unlit && !window.FAST && window.Warp && window.WARP !== false && window.LIT3D !== false && Warp.ok;
      const lit = shaded || unlit ? comp : E.lightSprite(comp, bw, bh, U, h, lights);
      const LP = shaded ? E.lightParams(U, h, lights) : null;
      // a combined sprite (two people in one painting) is never bent or stretched: no breath, sway or tilt
      const rigid = !!(E.SPRITES[key].rigid || (B && B.sp.rigid));
      // breathing: the chest rises and widens a touch above the hips; feet stay put
      const b = rigid ? 0 : this.calm * (0.0065 * Math.sin(this.breath * Math.PI * 2 / 3.9) + 0.0045);
      const sx = 1 + b * 0.45, sy = 1 + b;
      const feetBy = -U.y, hipBy = Math.max(1, Math.round(Math.min(feetBy, feetBy + waistDrop(sp) * h / sp.h - h * 0.47))); // (a waist-up painting: from its cut)
      const X0 = this.x + U.x, Y0 = this.y + U.y + sinkPx;
      g.save();
      if (sinkPx) { g.beginPath(); g.rect(0, 0, W, this.y); g.clip(); }
      if (this.rot) { const cy = this.y - h * 0.5; g.translate(this.x, cy); g.rotate(this.rot); g.translate(-this.x, -cy); } // a figure in the air (Inês thrown)
      // the painting is drawn through a mesh that bends with the figure: breath, sway, head, steps
      const still = (x, y) => [x, y]; // a combined sprite goes through the light pass unbent
      const warped = !window.FAST && window.Warp && (!rigid || LP) && Warp.draw(g, lit, bw, bh, X0, Y0, rigid ? still : this.motion(h, -U.x, feetBy, E.SPRITES[key], b, key), rigid ? 0 : h * 0.1, LP);
      if (!warped) {
        if (shaded) { const L2 = E.lightSprite(comp, bw, bh, U, h, lights); g.drawImage(L2, 0, 0, bw, bh, X0, Y0, bw, bh); g.restore(); return; }
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
  // the front-view swing: how long a turning figure shows its front view between the two sides
  const TURN_VIA = 0.15;
  // painted sitting down: they sway from the seat, not the feet
  const SEATED = new Set(['npc_bench', 'npc_cards', 'npc_couple', 'npc_fish', 'npc_guard', 'npc_guitar', 'npc_mender1', 'npc_mender2', 'npc_washer1']);
  // painted waist-up (sp.waist: the bath's frames at the waterline and behind the tank), drawn at his standing size (sp.h,
  // from the top of his head) and cut at fy: how far the rest of him goes on below the cut, in painting px
  const waistDrop = sp => sp.waist ? Math.max(0, sp.h - (sp.fy - sp.top)) : 0;
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
  // which way a frame faces on screen: 1 right, -1 left, 0 front/back views (painted facing x mirror)
  function facing(key, flipped) {
    const sp = E.SPRITES[key]; if (!sp) return 0;
    if (/_(front|back)(_|\d|$)/.test(key)) return 0;
    return (!!sp.facesLeft !== !!flipped) ? -1 : 1;
  }
  // a frame facing right never morphs into one facing left (any character): that bends one painting
  // into its mirror image. Front and back views can morph with either side.
  const sameFacing = (a, af, b, bf) => { const x = facing(a, af), y = facing(b, bf); return !x || !y || x === y; };
  // linear: B is the frame coming next in a walk (kB = 1 - progress); otherwise B is the frame
  // being left behind in a pose change (kB runs 1 -> 0, eased)
  // the shapes slide over the whole change, the pictures swap only in its middle
  function composeFrames(A, B, kB, U, w, h, linear, similar, rigid, hand) {
    fit(compBuf, cg, w, h);
    // two paintings drawn with opposite flips (one painted facing left, shown mirrored) use the data measured against
    // the mirror image ('a>b~', scripts/morphs.py); same flips, the plain pair
    const mir = B && !!A.flipped !== !!B.flipped ? '~' : '';
    const M = window.MORPHS, fAB = B && M && M[A.key + '>' + B.key + mir], fBA = B && M && M[B.key + '>' + A.key + mir];
    if (B && kB > 0 && hand) { // into / out of a combined sprite: the new painting comes up, then the old one goes
      const e = kB * kB * (3 - 2 * kB);
      blit(cg, B, U, Math.min(1, 2 * e)); blit(cg, A, U, Math.min(1, 2 * (1 - e))); return compBuf;
    }
    if (B && kB > 0 && fAB && fBA && !rigid && sameFacing(A.key, A.flipped, B.key, B.flipped) && window.Warp && window.WARP !== false && !window.FAST) {
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
    if (B && kB > 0 && similar) { // near-identical frames: the new one eases in over the old
      const e = kB * kB * (3 - 2 * kB);
      blit(cg, B, U, 1); blit(cg, A, U, 1 - e); return compBuf;
    }
    // a morph the warp couldn't draw: the same dissolve as any other change (the new painting up, then the old one gone)
    if (B && kB > 0) { const e = kB * kB * (3 - 2 * kB); blit(cg, B, U, Math.min(1, 2 * e)); blit(cg, A, U, Math.min(1, 2 * (1 - e))); return compBuf; }
    blit(cg, A, U, 1);
    return compBuf;
  }

  Object.assign(E, { Actor });
})();
