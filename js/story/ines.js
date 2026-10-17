// The Drowned Bell — Inês's full range: idle and talk variations, reactions tied to her lines,
// a four-step walk and front/back views. Every frame is optional: only painted ones are used.
(function () {
  const S = window.S, has = k => !!window.SPRITES[k];
  const C = S.CHARS.ines, F = C.frames;
  const only = list => list.filter(has);
  const set = (obj, key, list, min = 1) => { const l = only(list); if (l.length >= min) obj[key] = l; };

  set(F, 'idle', ['ines', 'ines_idle2', 'ines_idle3', 'ines_idle4']);
  set(F, 'talk', ['ines_talk', 'ines_talk2', 'ines_talk3', 'ines_talk4']);
  if (['ines_walk1', 'ines_pass1', 'ines_walk2', 'ines_pass2'].every(has)) {
    F.walk = ['ines_walk1', 'ines_pass1', 'ines_walk2', 'ines_pass2']; C.frameStep = 0.17; // half a step per frame: her painted stride (~0.34 of her height a step, like Alan's) so the planted foot doesn't skate
  }
  if (has('ines_front')) F.front = ['ines_front'];
  if (has('ines_back')) F.back = ['ines_back'];
  const walk4 = (a, b, c, d, alt) => [a, b, c, d].every(has) ? [a, b, c, d] : alt.every(has) ? alt : null;
  const fw = walk4('ines_front_walk1', 'ines_front_pass1', 'ines_front_walk2', 'ines_front_pass2', ['ines_front_walk1', 'ines_front', 'ines_front_walk2', 'ines_front']);
  const bw = walk4('ines_back_walk1', 'ines_back_pass1', 'ines_back_walk2', 'ines_back_pass2', ['ines_back_walk1', 'ines_back', 'ines_back_walk2', 'ines_back']);
  if (fw) F.frontWalk = fw;
  if (bw) F.backWalk = bw;
  const L = F.sets && F.sets.lantern;
  if (L && ['ines_lwalk1', 'ines_lpass1', 'ines_lwalk2', 'ines_lpass2'].every(has)) L.walk = ['ines_lwalk1', 'ines_lpass1', 'ines_lwalk2', 'ines_lpass2'];

  // reactions, available as poses and played with the lines that call for them
  const P = F.poses = F.poses || {};
  for (const k of ['laugh', 'eyeroll', 'worried', 'surprised', 'think', 'shelve', 'write', 'point', 'plaque']) if (has('ines_' + k)) P[k] = 'ines_' + k;
  const LP = (ids, pose) => { if (P[pose]) for (const id of ids) S.LINE_POSE[id] = ['ines', pose]; };
  LP(['ines_score_1', 'ines_score_2', 'ines_score_3', 'ines_score_4', 'ines_score_5', 'ines_score_6', 'ines_score_7', 'ines_score_9', 'ines_score_10',
    'ines_shop', 'ines_back_guitar', 'ines_visit_after', 'ines_why', 'ines_gossip_3'], 'eyeroll');
  LP(['ines_score_8', 'ines_coward'], 'laugh');
  LP(['ines_worried', 'ines_drowning', 'ines_warn'], 'worried');
  LP(['ines_vandal', 'ines_genealogy', 'ines_end', 'ines_sketch_founders'], 'surprised');
  LP(['ines_tenth', 'ines_reserve', 'ines_liked', 'ines_liked_2', 'ines_pull', 'ines_fate', 'ines_hint_wheel', 'ines_hint_lastfirst'], 'think');
  LP(['ines_hello_2'], 'shelve');
  LP(['ines_gossip_1', 'ines_gossip_2', 'ines_gossip_4', 'ines_gossip_5', 'ines_back_cop'], 'write');
  LP(['ines_go', 'ines_hint_ch3_done', 'ines_hint_police', 'ines_bye', 'ines_kettle'], 'point');
})();

// Inês at work: in the shop she moves between jobs (shelving, dusting, carrying, coffee, the ledger),
// stops when anything happens, and her face answers what Alan says.
(function () {
  const S = window.S, { G, F } = S, has = k => !!window.SPRITES[k];
  const C = S.CHARS.ines, P = C.frames.poses;
  const JOBS = [
    { k: 'shelve', at: [345, 550], dir: 'w' },
    { k: 'dust', at: [445, 632], dir: 'w' },  // the grandfather desk, and only the desk
    { k: 'kettle', at: [545, 552], dir: 'e' },
    { k: 'ledger', at: [760, 565], dir: 'e' },
    { k: 'read', at: [950, 650], dir: 'e' },  // the newspaper on the counter: a finger down the columns
  ].filter(j => has('ines_act_' + j.k + '_a'));
  for (const j of JOBS) { P['act_' + j.k + '_a'] = 'ines_act_' + j.k + '_a'; P['act_' + j.k + '_b'] = has('ines_act_' + j.k + '_b') ? 'ines_act_' + j.k + '_b' : 'ines_act_' + j.k + '_a'; }
  for (const k of ['amused', 'deadpan', 'fond', 'annoyed', 'scandalised', 'impressed', 'sympathetic', 'teasing']) if (has('ines_' + k)) P[k] = 'ines_' + k;

  const ines = () => { const a = G.npc('ines'); return a && a.visible && G.room === S.ROOMS.shop ? a : null; };
  const quiet = () => !G.isBusy && !G.cutscene && !document.querySelector('#dialog.open');
  let job = null, phase = 'rest', until = 0, lastJob = null, swapAt = 0, frame = 0;
  const end = a => { if (a && a.pose && String(a.pose).startsWith('act_')) a.pose = null; job = null; phase = 'rest'; bookDown = false; putUntil = 0; until = performance.now() + 3000 + Math.random() * 3000; };
  // the kettle job: she puts her book down on the sideboard first, makes the coffee with the kettle
  // that stands there (the painted one disappears while it's in her hand), and takes the book back
  let bookDown = false, putUntil = 0;
  const PUT = has('ines_act_kettle_put');
  if (PUT) P.act_kettle_put = 'ines_act_kettle_put';
  const img = n => { const i = new Image(); i.src = 'art/layers/' + n + '.webp'; return i; };
  const KETTLE = img('shop_kettle'), BOOK = img('shop_book');
  S.kettleHeld = () => { const a = G.npc('ines'); return !!(a && a.visible && G.room === S.ROOMS.shop && /^(act_kettle_[ab]|steam)$/.test(a.pose || '')); };
  S.shopSideboard = function (g) {
    if (F().ch >= 5) return;
    const held = S.kettleHeld();
    if (!held && KETTLE.complete && KETTLE.naturalWidth) g.drawImage(KETTLE, 486, 410 - KETTLE.naturalHeight / 2, KETTLE.naturalWidth / 2, KETTLE.naturalHeight / 2);
    if (bookDown && performance.now() >= putUntil && BOOK.complete && BOOK.naturalWidth) g.drawImage(BOOK, 668, 410 - BOOK.naturalHeight / 2, BOOK.naturalWidth / 2, BOOK.naturalHeight / 2);
  };
  setInterval(() => {
    if (window.FAST || !JOBS.length) return;
    const a = ines(); if (!a) { job = null; return; }
    if (a.set || (a.pose && !String(a.pose).startsWith('act_'))) return;   // a scene has her
    if (!quiet() || a.talking || a.engaged) { if (a.walking) a.stop(); if (job) end(a); return; }  // something's happening: drop it, look up
    const now = performance.now();
    if (phase === 'rest' && now > until) {
      const pool = JOBS.filter(j => j !== lastJob); job = pool[Math.floor(Math.random() * pool.length)]; lastJob = job;
      phase = 'walk'; a.pose = null; a.walkTo(job.at[0], job.at[1]).then(() => {
        if (job && phase === 'walk') { phase = 'work'; a.dir = job.dir; until = performance.now() + 7000 + Math.random() * 7000; swapAt = 0; }
      });
    } else if (phase === 'work') {
      if (job.k === 'kettle' && PUT && !bookDown) { a.pose = 'act_kettle_put'; bookDown = true; putUntil = now + 1300; swapAt = putUntil; return; }  // the book goes down first
      if (putUntil === Infinity ? now <= until : now < putUntil) return;  // holding the put-down / pick-up frame
      if (now > until) {
        if (job.k === 'kettle' && PUT && a.pose !== 'act_kettle_put') { a.pose = 'act_kettle_put'; putUntil = Infinity; until = now + 1150; return; }  // and back into her hand
        end(a); return;
      }
      if (now > swapAt) { frame ^= 1; a.pose = 'act_' + job.k + (frame ? '_b' : '_a'); swapAt = now + 1100 + Math.random() * 900; }
    }
  }, 200);

  // her face answers Alan: jokes get a look, tender lines a softer one, flirting a smirk
  const LINES = window.LINES || {};
  const pickR = l => l.filter(k => P[k])[Math.floor(Math.random() * l.filter(k => P[k]).length)];
  S.onLine = function (id) {
    if (!/^(alan_|gag_alan_)/.test(id)) return null;
    const a = G.npc('ines'); if (!a || !a.visible || a.set || a.walking || (a.pose && !String(a.pose).startsWith('act_'))) return null;
    const t = String((LINES[id] || [])[1] || ''), low = t.toLowerCase();
    let k = null;
    if (/\[pause\]|\[quiet|\[softly|grandfather|avô|mother|sorry/.test(low)) k = pickR(['fond', 'sympathetic']);
    else if (/flirt|wink|handsome|gorgeous|date|kiss/.test(id + ' ' + low)) k = pickR(['teasing', 'scandalised', 'amused']);
    else if (/!\s*$|\bwhat\?|no way|stole|steal|murder/.test(low)) k = pickR(['scandalised', 'impressed', 'annoyed']);
    else if (Math.random() < 0.45) k = pickR(['amused', 'deadpan', 'teasing', 'amused', 'impressed']);
    if (!k) return null;
    const prev = a.pose; a.pose = k;
    if (a.dir !== (G.player && G.player.x > a.x ? 'e' : 'w') && G.player) a.dir = G.player.x > a.x ? 'e' : 'w';
    return () => { if (a.pose === k) a.pose = String(prev || '').startsWith('act_') ? null : prev; };
  };
})();
