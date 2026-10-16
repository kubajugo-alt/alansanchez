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
    F.walk = ['ines_walk1', 'ines_pass1', 'ines_walk2', 'ines_pass2']; C.frameStep = 0.085;
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
  LP(['ines_tenth', 'ines_reserve', 'ines_liked', 'ines_pull', 'ines_fate', 'ines_hint_wheel', 'ines_hint_lastfirst'], 'think');
  LP(['ines_hello_2'], 'shelve');
  LP(['ines_gossip_1', 'ines_gossip_2', 'ines_gossip_4', 'ines_gossip_5', 'ines_back_cop'], 'write');
  LP(['ines_go', 'ines_hint_ch3_done', 'ines_hint_police', 'ines_bye', 'ines_kettle'], 'point');
})();
