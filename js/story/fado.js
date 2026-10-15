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

  // the song's shape, in seconds of the recording: verses, the two choruses, the mournful lines
  const CHORUS = [[50, 80], [125, 160]], MOURN = [[66, 80], [138, 160]], PEAK = [[101, 125]];
  const within = (t, spans) => spans.some(([a, b]) => t >= a && t < b);

  S.fadoPerformance = async function (am, songOrNull) {
    const gui = G.npc('npc_guitar'), lino = G.npc('npc_lino'), cards = G.npc('npc_cards'), p = G.player;
    const home = lino && { x: lino.x, y: lino.y, h: lino.h, pose: lino.pose, dir: lino.dir };
    // 1. Lino fetches the big guitar from the wall
    if (lino && has('lino_reach') && has('lino_bass1')) {
      lino.visible = false; await T(250);
      lino.x = 772; lino.y = 692; lino.h = 400; lino.pose = 'lino_reach'; lino.visible = true; await T(900);
      F().bass_off = true; sfx('pickup', 0.5); await T(800);
      lino.visible = false; await T(250);
      lino.pose = 'lino_bass1'; lino.x = 1178; lino.y = 646; lino.h = 392; lino.dir = 'w'; lino.visible = true; await T(400);
    }
    if (p && has('alan_enchanted1')) { p.dir = 'e'; p.pose = 'enchanted1'; }
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
      if (lino && F().bass_off) { const k = pick(['lino_bass1', 'lino_bass2'], beat >> 1); if (k) lino.pose = k; }
      // the card players, turned round in their chairs; in the choruses one closes his eyes, the other's hand to his heart
      if (cards) { const k = (chorus || mourn || peak) ? pick(['cards_listen_b'], 0) : pick(['cards_listen'], 0); if (k) cards.pose = k; }
      // Alan: rapt, hand to his chest; by the last chorus, the tear
      if (p && has('alan_enchanted1')) { p.dir = 'e'; p.pose = t >= 138 && has('alan_enchanted2') ? 'enchanted2' : 'enchanted1'; }
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
      lino.visible = false; await T(250);
      lino.x = 772; lino.y = 692; lino.h = 400; lino.pose = 'lino_reach'; lino.visible = true; await T(800);
      F().bass_off = false; sfx('pickup', 0.4); await T(500);
      lino.visible = false; await T(250);
      Object.assign(lino, home); lino.pose = null; lino.visible = true;
    }
  };
})();
