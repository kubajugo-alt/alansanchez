// The Drowned Bell — "O Sino Afogado" in the Taberna: the whole room plays its part.
// Lino takes the big guitar off the wall and joins Duarte on the bass line, the card players
// turn in their chairs, Amália gives it everything, and Alan forgets to breathe.
// Every frame is optional: anything not painted falls back to what the scene had before.
(function () {
  const S = window.S, { G, F, ROOMS, sfx } = S;
  const T = ms => G.wait(window.FAST ? 20 : ms);
  const has = k => !!window.SPRITES[k];
  const pick = (list, i) => { const ok = list.filter(has); return ok.length ? ok[i % ok.length] : null; };

  // the guitar comes off the wall for the song (and goes back after)
  const prevBg = ROOMS.tavern.bgFn;
  ROOMS.tavern.bgs = (ROOMS.tavern.bgs || []).concat(['tavern_noguitar']);
  ROOMS.tavern.bgFn = () => F().ch < 5 && F().bass_off && G.image('bg:tavern_noguitar') ? 'tavern_noguitar' : prevBg();

  S.CHARS.alan.frames.poses.enchanted1 = 'alan_enchanted1';
  S.CHARS.alan.frames.poses.enchanted2 = 'alan_enchanted2';
  ['rapt1', 'rapt2', 'rapt3'].forEach(k => { S.CHARS.alan.frames.poses[k] = 'alan_' + k; });

  // Lino on his feet: a walk cycle empty-handed and one carrying the bass (used only once painted)
  const LINO_WALK = ['lino_walk1', 'lino_pass1', 'lino_walk2', 'lino_pass2'];
  const LINO_CARRY = ['lino_carry1', 'lino_carrypass1', 'lino_carry2', 'lino_carrypass2'];
  const canWalk = () => LINO_WALK.every(has) && LINO_CARRY.every(has);
  const BAR_GATE = [1120, 650], HOOK = [772, 692], PLAY = [1178, 646];
  // walks Lino somewhere (ground-scaled, a touch shorter than Alan); falls back to a cut
  async function linoGo(lino, [x, y], carry) {
    const C = lino.c;
    if (!canWalk() || window.FAST) { lino.dir = x < lino.x ? 'w' : 'e'; lino.x = x; lino.y = y; return; }
    Object.assign(C.frames, { walk: LINO_WALK, sets: Object.assign(C.frames.sets || {}, { carry: { walk: LINO_CARRY, idle: ['lino_carry1'] } }) });
    C.frameStep = 0.085; const sc = C.scale; C.scale = 0.94;
    lino.pose = null; lino.set = carry ? 'carry' : null; lino.h = null;
    try { await lino.walkTo(x, y); } finally { C.scale = sc; }
  }

  // the song's shape, in seconds of the recording: verses, the two choruses, the mournful lines
  const CHORUS = [[50, 80], [125, 160]], MOURN = [[66, 80], [138, 160]], PEAK = [[101, 125]];
  const within = (t, spans) => spans.some(([a, b]) => t >= a && t < b);

  S.fadoPerformance = async function (am, songOrNull) {
    const gui = G.npc('npc_guitar'), lino = G.npc('npc_lino'), cards = G.npc('npc_cards'), p = G.player;
    const home = lino && { x: lino.x, y: lino.y, h: lino.h, pose: lino.pose, dir: lino.dir };
    // 1. Lino comes round the bar, lifts the big guitar off its hook and carries it to Amália's side
    const reach = async () => {
      if (has('lino_reach2')) { lino.pose = 'lino_reach2'; await T(700); }
      lino.pose = 'lino_reach'; await T(700);
    };
    if (lino && has('lino_reach') && has('lino_bass1')) {
      lino.visible = false; await T(250);
      if (canWalk()) {
        lino.x = BAR_GATE[0]; lino.y = BAR_GATE[1]; lino.dir = 'w'; lino.pose = null; lino.visible = true;
        await linoGo(lino, HOOK);
        lino.h = 400; await reach();
        F().bass_off = true; sfx('pickup', 0.5); await T(500);
        await linoGo(lino, PLAY, true);
        lino.set = null; lino.dir = 'w';
      } else {
        lino.x = 772; lino.y = 692; lino.h = 400; lino.visible = true; await reach();
        F().bass_off = true; sfx('pickup', 0.5); await T(800);
        lino.visible = false; await T(250);
        lino.x = PLAY[0]; lino.y = PLAY[1]; lino.dir = 'w'; lino.visible = true;
      }
      lino.pose = 'lino_bass1'; lino.h = 392; await T(400);
    }
    if (p && (has('alan_rapt1') || has('alan_enchanted1'))) { if (am) p.dir = am.x >= p.x ? 'e' : 'w'; p.pose = has('alan_rapt1') ? 'rapt1' : 'enchanted1'; }
    // 2. the song: everyone moves with the recording
    const song = songOrNull;
    const now = () => song && song.el ? song.el.currentTime : (performance.now() - t0) / 1000;
    const t0 = performance.now();
    let beat = 0;
    const tick = setInterval(() => {
      const t = now(); beat++;
      const chorus = within(t, CHORUS), mourn = within(t, MOURN), peak = within(t, PEAK);
      // poses hold for a few beats and cross-fade, so every change reads as a gesture, not a flicker
      // Amália, to the room: the sway in the verses, arms open in the choruses, the shawl clutched on the sad lines
      if (am) {
        am.dir = 'w';
        const k = mourn ? pick(['amalia_sing5', 'amalia_sing4'], beat >> 3)
          : chorus || peak ? pick(['amalia_sing3', 'amalia_sing4', 'amalia_sing3', 'amalia_sing1'], beat >> 2)
          : pick(['amalia_sing1', 'amalia_sing4', 'amalia_sing1', 'amalia_sing2'], beat >> 2);
        if (k) am.pose = k;
      }
      // Duarte: bent to the strings in the verses, head back and a hand raised to her in the choruses
      if (gui) {
        const k = chorus || peak ? pick(['duarte_play3', 'duarte_play2', 'duarte_play2', 'duarte_play1'], beat >> 2)
          : pick(['duarte_play1', 'duarte_play3'], beat >> 3);
        if (k) gui.pose = k;
      }
      // Lino on the bass, eyes shut, rocking on the beat
      if (lino && F().bass_off && !lino.walking) {
        const k = chorus || peak ? pick(['lino_bass3', 'lino_bass1', 'lino_bass2', 'lino_bass1'], beat >> 1)
          : mourn ? pick(['lino_bass4', 'lino_bass2'], beat >> 2)
          : pick(['lino_bass1', 'lino_bass2'], beat >> 1);
        if (k) lino.pose = k;
      }
      // the card players, turned round in their chairs; in the choruses one closes his eyes, the other's hand to his heart
      if (cards) { const k = (chorus || mourn || peak) ? pick(['cards_listen_b'], 0) : pick(['cards_listen'], 0); if (k) cards.pose = k; }
      // Alan: rapt, hand to his chest; by the last chorus, the tear
      if (p) {
        if (am) p.dir = am.x >= p.x ? 'e' : 'w';
        // turned to her when painted that way: rapt in the verses, hand to the heart in the choruses, the tear at the end
        const k = t >= 138 ? (has('alan_rapt3') ? 'rapt3' : has('alan_enchanted2') && 'enchanted2')
          : chorus || peak ? (has('alan_rapt2') ? 'rapt2' : has('alan_enchanted1') && 'enchanted1')
          : (has('alan_rapt1') ? 'rapt1' : has('alan_enchanted1') && 'enchanted1');
        if (k) p.pose = k;
      }
    }, window.FAST ? 20 : 820);
    try {
      if (song) await G.lyrics(song, S.SINO_LYRICS, 'amalia');
      else await S.say('amalia_sing_1', 'amalia_sing_2', 'amalia_sing_3');
    } finally {
      clearInterval(tick);
      if (am) am.pose = null; if (gui) gui.pose = null; if (cards) cards.pose = null;
      if (p) p.pose = null;
    }
    // 3. a breath of silence, then the guitar goes back on its hook
    if (lino && F().bass_off) {
      await T(900);
      if (canWalk()) {
        await linoGo(lino, HOOK, true);
        lino.h = 400; lino.set = null; await reach();
        F().bass_off = false; sfx('pickup', 0.4); await T(500);
        await linoGo(lino, BAR_GATE);
        lino.visible = false; await T(250);
      } else {
        lino.visible = false; await T(250);
        lino.x = 772; lino.y = 692; lino.h = 400; lino.visible = true; await reach();
        F().bass_off = false; sfx('pickup', 0.4); await T(500);
        lino.visible = false; await T(250);
      }
      Object.assign(lino, home); lino.pose = null; lino.set = null; lino.visible = true;
    }
  };
})();
