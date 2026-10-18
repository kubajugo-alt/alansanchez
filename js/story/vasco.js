// The Drowned Bell — Vasco at work: down in the pit he moves between jobs (trowel, brush, sieve, a sherd held to the
// light, his notebook, bagging a coin), and stops when anything happens. Like Inês's in the shop (ines.js); every
// job is optional, only painted ones are used. He is in the pit for all of Chapter I (se.js: the npc's init).
(function () {
  const S = window.S, { G, F } = S, has = k => !!window.SPRITES[k];
  const C = S.CHARS.vasco, P = C.frames.poses;
  // the pit's floor line is y = S.PIT_RIM; its opening runs from about x 622 to 952 (se.js)
  const JOBS = [
    { k: 'trowel', x: 900, dir: 'w' },
    { k: 'brush', x: 690, dir: 'e' },
    { k: 'sieve', x: 780, dir: 'w' },
    { k: 'sherd', x: 860, dir: 'w' },
    { k: 'notes', x: 730, dir: 'e' },
    { k: 'bag', x: 820, dir: 'e' },
  ].filter(j => has('vasco_act_' + j.k + '_a'));
  for (const j of JOBS) { P['act_' + j.k + '_a'] = 'vasco_act_' + j.k + '_a'; P['act_' + j.k + '_b'] = has('vasco_act_' + j.k + '_b') ? 'vasco_act_' + j.k + '_b' : 'vasco_act_' + j.k + '_a'; }

  const vasco = () => { const a = G.npc('vasco'); return a && a.visible && G.room === S.ROOMS.se_cloister && a._pit ? a : null; };
  const quiet = () => !G.isBusy && !G.cutscene && !document.querySelector('#dialog.open') && !F().in_pit; // (Alan down there: a scene)
  let job = null, phase = 'rest', until = 0, lastJob = null, swapAt = 0, frame = 0;
  const end = a => {
    if (a && a.pose && String(a.pose).startsWith('act_')) a.pose = null;
    job = null; phase = 'rest'; until = performance.now() + 2500 + Math.random() * 3000;
  };
  setInterval(() => {
    if (window.FAST || !JOBS.length) return;
    const a = vasco(); if (!a) { job = null; return; }
    if (a.set || (a.pose && !String(a.pose).startsWith('act_'))) return;   // a scene has him
    if (!quiet() || a.talking || a.engaged) { if (a.walking && job) a.stop(); if (job) end(a); return; }  // something's happening: he looks up
    const now = performance.now();
    if (phase === 'rest' && now > until) {
      const pool = JOBS.filter(j => j !== lastJob); job = pool[Math.floor(Math.random() * pool.length)]; lastJob = job;
      phase = 'walk'; a.pose = null;
      a.walkTo(job.x, S.PIT_RIM).then(() => {
        if (job && phase === 'walk') { phase = 'work'; a.dir = job.dir; until = performance.now() + 7000 + Math.random() * 7000; swapAt = 0; }
      });
    } else if (phase === 'work') {
      if (now > until) { end(a); return; }
      if (now > swapAt) { frame ^= 1; a.pose = 'act_' + job.k + (frame ? '_b' : '_a'); swapAt = now + 1100 + Math.random() * 900; }
    }
  }, 200);
})();
