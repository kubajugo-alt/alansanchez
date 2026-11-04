// Idle: after a while with no input Alan smokes a cigarette (frames supplied by the story).
(function () {
  const E = window.Engine;
  const { $, IMG } = E;

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
    if (!C || !E.room || !E.player || window.FAST) return false;
    if (!Object.values(C.frames).every(f => E.SPRITES[f] && IMG['spr:' + f])) return false; // not until every frame is painted
    if (E.busy || E.cutscene || E.dialogResolve || E.still || E.selItem || E.speaking) return false;
    if (!E.player.visible || E.player.walking || E.player.ch !== 'alan' || E.player.set || E.room.player === false) return false;
    if (E.player.pose && !(smk && E.player.pose === smk.pose)) return false; // a special pose (or undressed) is never interrupted
    if ($('#menu').classList.contains('open')) return false;
    return !C.allowed || C.allowed(E.room);
  }
  function stopSmoke() {
    if (!smk) return;
    if (E.player.pose === smk.pose) E.player.pose = null; // morphs back to his stance
    smk = null; // (the overlay stays until the last of the smoke has drifted away)
  }
  function smokeAnchor(key, pt) {
    const A = E.player.place(key, E.player.lastFlip); if (!A || !pt) return null;
    return [E.player.x + A.x + (A.flipped ? A.sp.w - pt[0] : pt[0]) * A.s, E.player.y + A.y + pt[1] * A.s, A.s];
  }
  function puff(x, y, s, vx, vy, n, size, a) {
    for (let i = 0; i < n; i++) puffs.push({ x, y, vx: vx * (0.7 + Math.random() * 0.6) + (Math.random() - 0.5) * 6 * s * 3, vy: vy * (0.7 + Math.random() * 0.6), r: size * (0.6 + Math.random() * 0.6), a, life: 0, max: 2.2 + Math.random() * 1.6, seed: Math.random() * 10 });
  }
  function drawSmoke(gc, a, t) {
    const C = Game.idleSmoke, key = smk && E.player.cur;
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
  const smoking = () => !!smk, smokeStep = () => smk && smk.step;
  let smokeRoom = null;
  function idleSmokeTick(dt) {
    if (E.room !== smokeRoom) { smokeRoom = E.room; puffs.length = 0; } // smoke doesn't follow him through a door
    for (const p of puffs) {
      p.life += dt;
      p.x += (p.vx + Math.sin(E.time * 1.3 + p.seed) * 4) * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - dt * 0.5;
      p.vy *= 1 - dt * 0.25;
    }
    for (let i = puffs.length - 1; i >= 0; i--) if (puffs[i].life > puffs[i].max) puffs.splice(i, 1);
    if (!smk && !puffs.length && E.player.overlay === drawSmoke) { E.player.overlay = smokeSaved; smokeSaved = null; }
    const ok = smokeOK();
    if (!ok) { if (smk) stopSmoke(); lastInput = Math.max(lastInput, performance.now() - 1000 * SMOKE_AFTER * 0.5); return; } // after a scene, a fresh wait
    const C = Game.idleSmoke, F = C.frames;
    if (!smk) {
      if ((performance.now() - lastInput) / 1000 < SMOKE_AFTER) return;
      if (E.player.dir === 'n' || E.player.dir === 's') E.player.dir = E.player.lastEW || 'e'; // the frames are side views
      smk = { i: -1, t: 0, dur: 0, step: null, pose: null };
      if (E.player.overlay !== drawSmoke) { smokeSaved = E.player.overlay; E.player.overlay = drawSmoke; }
    }
    smk.t += dt;
    if (smk.t >= smk.dur) {
      // light once, then round and round: drag, breathe out, hold it a while
      const SEQ = [['light', 2.4], ['inhale', 1.4], ['exhale', 1.8], ['hold', 4 + Math.random() * 3]];
      smk.i = smk.i < 0 ? 0 : smk.i + 1 >= SEQ.length ? 1 : smk.i + 1;
      const [step, dur] = SEQ[smk.i];
      smk.step = step; smk.t = 0; smk.dur = dur; smk.pose = F[step]; E.player.pose = smk.pose;
      if (step === 'light' && window.Sound) Sound.sfx('match', 0.35);
    }
    // smoke: a breath of it out of his mouth on the exhale, a thin thread off the tip otherwise
    const key = E.player.cur, P = C.points && C.points[key];
    if (!P) return;
    const dirX = E.player.lastFlip ? -1 : 1;
    if (smk.step === 'exhale' && smk.t > 0.15 && smk.t < 1.3) {
      const m = smokeAnchor(key, P.mouth);
      if (m && Math.random() < dt * 22) puff(m[0], m[1], m[2], dirX * 34 * m[2] * 3.3, -6 * m[2] * 3.3, 1, 5 * m[2] * 3.3, 0.22);
    }
    if (smk.step !== 'light' || smk.t > smk.dur - 0.3) {
      const tp = smokeAnchor(key, P.tip);
      if (tp && Math.random() < dt * 5) puff(tp[0], tp[1] - 2, tp[2], dirX * 2, -22 * tp[2] * 3.3, 1, 2.2 * tp[2] * 3.3, 0.16);
    }
  }

  Object.assign(E, { noteInput, idleSmokeTick, smoking, smokeStep });
})();
