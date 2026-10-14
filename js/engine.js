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
  const COLORS = { alan: '#ffe2a0', ines: '#ffab9a', rui: '#a8d4ff', amalia: '#e2b0ff', tomas: '#cfeab8', lacerda: '#ff7d6a', celeste: '#ffd0a0', ze: '#9fd8ff', abilio: '#f0e68c', lino: '#f2c79a', phone: '#b9c9ff', guitar: '#d8c0a0', cards: '#d9c8a8', fish: '#ffb8b8', mender1: '#c8d8c0', mender2: '#b8d0b0', nun: '#e0e0f0', narr: '#eee6d6' };
  const NAMES = { alan: 'Alan', ines: 'Inês', rui: 'Rui', amalia: 'Amália', tomas: 'Father Tomás', lacerda: 'Lacerda', celeste: 'Celeste', ze: 'Zé', abilio: 'Abílio', lino: 'Lino', phone: 'Officer Teixeira', guitar: 'Duarte', cards: 'Card player', fish: 'Fishwife', mender1: 'Old fisherman', mender2: 'Fisherman', nun: 'Sister', narr: '' };

  const ROOMS = {}, ITEMS = {}, CHARS = {};
  const IMG = {}; // loaded images by key
  let state = freshState();
  let room = null, fogA = null, fogB = null;
  let player = null, npcs = [];
  let selItem = null;
  let busy = 0, mouse = { x: -1, y: -1 }, hoverTarget = null, cutscene = 0;
  let skipFn = null, dialogResolve = null;
  let time = 0, last = performance.now();

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
    for (const i of Object.keys(ITEMS).concat(window.EXTRA_ICONS || [])) jobs.push(['icon:' + i, 'art/icons/' + i + '.webp']);
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
  const XFADE = 0.2, GROUND_K = 2.2;

  class Actor {
    constructor(id, ch, x, y, dir) {
      Object.assign(this, { id, ch, x, y, dir: dir || 'e', walking: false, talking: false, visible: true, phase: 0, h: null });
      this.target = null; this.resolve = null;
      this.talkT = 0; this.talkIdx = 0; this.quietT = 0;
      this.idleT = 2 + Math.random() * 5; this.idleIdx = 0;
      this.pose = null; this.loop = null; this.set = null; this.engaged = 0; this.resumeT = 0;
      this.cur = null; this.prev = null; this.fadeT = 0; this.lastFlip = false;
      this.breath = Math.random() * 10; this.sink = 0; this.turnT = 0; this.stepIdx = -1;
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
        this.target = { x, y }; this.resolve = res; this.walking = true;
      });
    }
    cycle() {
      const F = this.F;
      if (this.dir === 'n' && F.backWalk) return F.backWalk;
      if (this.dir === 's' && F.frontWalk) return F.frontWalk;
      return F.walk || arr(F.idle);
    }
    update(dt) {
      const F = this.F;
      if (this.fadeT > 0) this.fadeT = Math.max(0, this.fadeT - dt);
      if (this.resumeT > 0) this.resumeT -= dt;
      this.breath += dt;
      if (this.target) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y;
        const gd = Math.hypot(dx, dy * GROUND_K); // distance on the ground plane
        const hh = this.height();
        const step = hh * 0.62 * dt * (this.c.speed || 1);
        if (!(F.frontWalk && F.backWalk) || Math.abs(dx) > Math.abs(dy * GROUND_K) * 0.75) this.dir = dx > 0 ? 'e' : 'w';
        else this.dir = dy > 0 ? 's' : 'n';
        const moved = Math.min(gd, step);
        if (gd > 0) { this.x += dx / gd * moved; this.y += dy / gd * moved; }
        if (gd <= step) { this.x = this.target.x; this.y = this.target.y; }
        // the cycle advances by ground covered, so planted feet never slide
        const cyc = this.cycle();
        this.phase += moved / (hh * (cyc.length >= 8 ? 0.085 : 0.17));
        const idx = Math.floor(this.phase) % cyc.length;
        if (idx !== this.stepIdx) {
          this.stepIdx = idx;
          const contact = cyc.length >= 8 ? idx % 4 === 0 : idx % 2 === 0;
          if (contact && this.visible) Sound.step((room && room.floor) || 'stone', this === player ? 1 : 0.6);
        }
        if (gd <= step) this.stop();
      }
      if (this.talking) {
        this.talkT -= dt;
        const lvl = speaking && speaking.actor === this ? Sound.voiceLevel() : 0.5;
        this.lvl = (this.lvl || 0) + (lvl - (this.lvl || 0)) * Math.min(1, dt * 12);
        this.quietT = lvl < 0.06 ? this.quietT + dt : 0;
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
        if (this.idleIdx === 0 && nIdle > 1) { this.idleIdx = 1 + Math.floor(Math.random() * (nIdle - 1)); this.idleT = vh[0] + Math.random() * (vh[1] - vh[0]); }
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
      if (this !== player && player && player.visible && !this.walking && !this.pose && !this.loopActive() && !(this.def && (this.def.fixedDir || this.def.ambient)) && (this.dir === 'e' || this.dir === 'w')) {
        const want = player.x > this.x ? 'e' : 'w';
        if (want !== this.dir && Math.abs(player.x - this.x) > 40) { this.turnT += dt; if (this.turnT > 0.6) { this.dir = want; this.turnT = 0; } }
        else this.turnT = 0;
      }
    }
    loopActive() { const F = this.F; return !!(this.loop && F.loops && F.loops[this.loop] && !this.engaged && this.resumeT <= 0 && !this.talking); }
    stop() { this.target = null; this.walking = false; this.phase = 0; this.stepIdx = -1; const r = this.resolve; this.resolve = null; if (r) r(); }
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
      const id = arr(F.idle); return id[this.idleIdx % id.length];
    }
    bbox() {
      const h = this.height(), w = h * 0.36;
      return { x: this.x - w / 2, y: this.y - h, w, h };
    }
    // sprite placement relative to the feet, in scene px
    place(key, flipped) {
      const sp = SPRITES[key], im = IMG['spr:' + key];
      if (!sp || !im) return null;
      const s = this.height() / sp.h;
      const ax = flipped ? sp.w - sp.ax : sp.ax;
      return { sp, im, flipped, x: -ax * s, y: -sp.fy * s, w: sp.w * s, h: sp.hh * s };
    }
    draw() {
      if (!this.visible) return;
      const key = this.frameKey();
      const sp = SPRITES[key];
      if (!sp) return;
      // background extras keep the pose they were painted in (unless they walk)
      const flipped = this.def && this.def.ambient && !this.walking && !this.def.flip ? false
        : this.dir === 'w' ? !sp.facesLeft : (this.dir === 'e' ? !!sp.facesLeft : this.lastFlip);
      const turned = flipped !== this.lastFlip;
      this.lastFlip = flipped;
      if (key !== this.cur) {
        const inCycle = this.walking && this.cycle().includes(key) && this.cycle().includes(this.cur);
        this.prev = this.cur && !inCycle && !turned ? this.cur : null;
        this.prevFlip = flipped;
        this.fadeT = this.prev ? XFADE : 0;
        this.cur = key;
      }
      if (turned) { this.prev = null; this.fadeT = 0; }
      const A = this.place(key, flipped);
      if (!A) return;
      const B = this.prev && this.fadeT > 0 ? this.place(this.prev, this.prevFlip) : null;
      const h = this.height();
      // union of both frames, in feet-relative coordinates
      const U = { x: Math.min(A.x, B ? B.x : A.x), y: Math.min(A.y, B ? B.y : A.y) };
      U.r = Math.max(A.x + A.w, B ? B.x + B.w : -1e9); U.b = Math.max(A.y + A.h, B ? B.y + B.h : -1e9);
      const bw = Math.ceil(U.r - U.x) + 1, bh = Math.ceil(U.b - U.y) + 1;
      const comp = composeFrames(A, B, B ? this.fadeT / XFADE : 0, U, bw, bh);
      const sinkPx = this.sink * h;
      const lights = lightsOn(this.x, this.y - h * 0.55, h, this);
      if (!sinkPx) groundShadows(this, comp, U, bw, bh, h, lights);
      const lit = lightSprite(comp, bw, bh, U, h, lights);
      // breathing: the chest rises and widens a touch above the hips; feet stay put
      const talkAmp = this.lvl || 0;
      const b = this.walking ? 0 : 0.0065 * Math.sin(this.breath * Math.PI * 2 / 3.9) + 0.0045 + talkAmp * 0.006;
      const sx = 1 + b * 0.45, sy = 1 + b;
      const feetBy = -U.y, hipBy = Math.max(1, Math.round(feetBy - h * 0.47));
      const X0 = this.x + U.x, Y0 = this.y + U.y + sinkPx;
      g.save();
      if (sinkPx) { g.beginPath(); g.rect(0, 0, W, this.y); g.clip(); }
      // lower body: untouched
      g.drawImage(lit, 0, hipBy, bw, bh - hipBy, X0, Y0 + hipBy, bw, bh - hipBy);
      // upper body: scaled about the hip line and the body axis
      const hipY = Y0 + hipBy;
      g.drawImage(lit, 0, 0, bw, hipBy + 1, this.x + U.x * sx, hipY - hipBy * sy, bw * sx, (hipBy + 1) * sy);
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
  function composeFrames(A, B, kB, U, w, h) {
    fit(compBuf, cg, w, h);
    if (B && kB > 0) {
      // the new frame is always fully opaque; the old one fades out over it, so the
      // figure never turns see-through (no pale flash between poses)
      const e = kB * kB * (3 - 2 * kB); // smoothstep, 1 -> 0 as the fade ends
      blit(cg, A, U, 1);
      blit(cg, B, U, e);
    } else blit(cg, A, U, 1);
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
    if (INDOOR[from] || INDOOR[to]) return 'door';
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
    if (!room.noSave && !opts.noSave) autosave();
    updateHover();
  }
  function refreshNpcs(reset) {
    const keep = reset ? new Map() : new Map(npcs.map(a => [a.id, a]));
    // extras whose sprites are not painted yet are simply absent
    const amb = (room.ambient || []).filter(a => IMG['spr:' + a.frames[0]]).map(a => {
      if (!CHARS[a.id]) CHARS[a.id] = { scale: a.scale || 1, idleHold: a.idleHold || [8, 20], variantHold: a.variantHold || [1.6, 3.2], frames: { idle: a.frames, walk: a.walk, talk: a.talkFrames } };
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
    street: ['#e2b072', 0.12], police: ['#93a8a0', 0.16],
    tavern: ['#d08040', 0.18], tavern_night: ['#c66a30', 0.12, '#080402'],
    lavadouro: ['#8fb0b8', 0.15], ferreira: ['#c8a060', 0.15],
    convent: ['#dcc290', 0.12], se_tower: ['#c49060', 0.13], antiques: ['#b07840', 0.17],
    cais: ['#9ab0c0', 0.13], boat: ['#a0b4c0', 0.13], cabin: ['#b07a40', 0.17, '#070402'],
    convent_night: ['#30508a', 0.18, '#03070d'], cistern: ['#3c6a68', 0.16, '#020505'],
  };
  function grade(bg) {
    const c = GRADES[bg]; if (!c) return;
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
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    if (room) {
      player.update(dt); npcs.forEach(a => a.update(dt));
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
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- speech
  let speaking = null;
  function actorFor(who) {
    if (who === 'alan') return player.visible ? player : null;
    return npcs.find(a => (a.id === who || a.id === 'npc_' + who) && a.visible) || null;
  }
  // Speakers face each other: an NPC turns to Alan when it speaks, and Alan turns
  // to whoever he is talking with (the last NPC who spoke, else the nearest one).
  let lastPartner = null;
  const canTurn = a => a && a.visible && !a.walking && !a.pose && (a.dir === 'e' || a.dir === 'w') && !(a.def && (a.def.fixedDir || a.def.ambient));
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
    speechEl.style.display = 'none'; narrEl.style.display = 'none';
    if (speaking && speaking.actor) speaking.actor.talking = false;
    speaking = null;
  }
  const strip = t => t.replace(/\[[^\]]*\]\s*/g, '');

  const cutsceneHold = () => room && room.holdFacing && room.holdFacing();
  async function say(id, opts) {
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
  async function says(...ids) { for (const id of ids) await say(id); }
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
      if (pick.line && !pick.silent) await say(pick.line);
      if (pick.run) await pick.run();
      if (pick.bye) return;
    }
  }

  // ---------------------------------------------------------------- inventory
  function has(id) { return state.inv.includes(id); }
  function giveItem(id, silent) {
    if (has(id)) return;
    state.inv.push(id); renderInv();
    if (!silent) { Sound.sfx('pickup'); flashInv(); }
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
    return IMG['icon:' + key] || FX.icon(key);
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
    const people = npcs.filter(a => a.visible && a.def).sort((a, b) => b.y - a.y);
    for (const a of people) { const b = a.bbox(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return { kind: 'npc', actor: a, def: a.def }; }
    const hs = room.hotspots || [];
    for (let i = hs.length - 1; i >= 0; i--) {
      const h = hs[i];
      if (h.when && !h.when()) continue;
      if (hitShape(h, x, y)) return { kind: 'hot', def: h };
    }
    return null;
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
      const gap = actor.height() * 0.42;
      at = [actor.x + (actor.x > player.x ? -gap : gap), actor.y + 6];
    }
    if (!at) return;
    const [x, y] = clampToPoly(at[0], at[1], room.walk);
    await player.walkTo(x, y);
    if (def.face) player.dir = def.face;
    else if (actor) { player.dir = actor.x > player.x ? 'e' : 'w'; actor.dir = actor.def.fixedDir ? actor.dir : (player.x > actor.x ? 'e' : 'w'); }
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
      if (def.ambient && verb !== 'look' && !(verb === 'talk' && def.talk)) { if (item) { selItem = null; renderInv(); } await say('alan_npc_busy'); return; }
      if (t.kind === 'self') {
        const h = def.items[item] || def.items.any;
        selItem = null; renderInv(); invBar.classList.remove('show');
        await runHandler(h || failLine(t, 'item'), t); return;
      }
      if (verb === 'look') {
        if (player.visible && def.at && !t.actor) player.dir = def.at[0] > player.x ? 'e' : 'w';
        await runHandler(def.look || failLine(t, 'look'), t); return;
      }
      if (verb === 'exit') {
        if (def.locked && def.locked()) { await say((typeof def.lockedLine === 'function' ? def.lockedLine() : def.lockedLine) || 'alan_fail_04'); return; }
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
    const s = still; s.t += dt;
    s.alpha += (s.target - s.alpha) * Math.min(1, dt * 3.2);
    const im = IMG['still:' + s.name] || IMG['close:' + s.name] || IMG['bg:' + s.name];
    const p = Math.min(1, s.t / s.dur), e = p * p * (3 - 2 * p);
    const z = s.zoom[0] + (s.zoom[1] - s.zoom[0]) * e;
    const cx = s.pan[0][0] + (s.pan[1][0] - s.pan[0][0]) * e, cy = s.pan[0][1] + (s.pan[1][1] - s.pan[0][1]) * e;
    g.save(); g.globalAlpha = Math.max(0, Math.min(1, s.alpha));
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    if (im) { const w = W * z, h = H * z; g.drawImage(im, W / 2 - w * cx, H / 2 - h * cy, w, h); }
    if (s.sepia) { g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(255,225,180,0.25)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
    FX.vignette(g, s.vignette != null ? s.vignette : 0.55);
    if (s.grain) for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,240,210,${Math.random() * 0.08})`; g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1); }
    g.restore();
    if (s.target === 0 && s.alpha < 0.02) still = null;
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
      const close = () => { closeEl.classList.add('hidden'); prev.onclick = next.onclick = closeEl.onclick = null; busy--; resolve(); };
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
  function autosave() { if (/[?&]scene=/.test(location.search)) return; try { localStorage.setItem(SAVE_KEY, snapshot()); } catch (e) { /* storage unavailable */ } }
  function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
  async function loadSave(json) {
    let data = json;
    if (!data) { try { data = localStorage.getItem(SAVE_KEY); } catch (e) { data = null; } }
    if (!data) return false;
    state = Object.assign(freshState(), JSON.parse(data));
    // saves from before the sketch became an item: hand it over so Inês and Celeste can take it
    if (state.flags.sketched_tile && !state.inv.includes('sketch')) state.inv.push('sketch');
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
  async function begin(fresh) {
    Sound.init();
    showModal('title', false);
    if (fresh || !(await loadSave())) { state = freshState(); renderInv(); await window.Story.newGame(); }
  }

  window.Game = {
    init, begin, goRoom, say, says, wait, dialog, reach, showStill, endStill, closeup, setClock, renderInv,
    set cutscene(v) { cutscene = Math.max(0, cutscene + (v ? 1 : -1)); }, card, fade, checkpoint, loadSave, autosave, showModal, refreshNpcs, renderLabels,
    giveItem, takeItem, has, toast,
    get state() { return state; }, get flags() { return state.flags; },
    get player() { return player; }, get room() { return room; }, get npcs() { return npcs; },
    bgImage: () => room && IMG['bg:' + curBg()],
    image: key => IMG[key],
    mask: () => room && room.skyMask && IMG['mask:' + room.skyMask],
    get isBusy() { return busy > 0 || !!dialogResolve || (player && player.walking); },
    npc: id => npcs.find(a => a.id === id),
    // test hook: act on a hotspot (by name) or an actor (by id), optionally with an item
    async act(target, verb, item) {
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
    busy: async fn => { busy++; try { return await fn(); } finally { busy--; updateHover(); } },
  };
})();
