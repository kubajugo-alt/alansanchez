// The Shortest Night — the prologue: Gran Canaria, 21 December 1995, the winter solstice. Elena Suárez's message from
// the bar in Artenara (a painting), her drive down into the cloud (played: the car drives itself, the player looks
// around it), the water, and the morning in the barranco (a painting). About four minutes.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;

  let phase = 0, crankOpen = 0, triangle = 0; // phase: 0 the road, 1 the cloud, 2 the water
  ROOMS.elena_car = S.room({
    music: 'elena_car',
    name: 'Elena\'s Renault 4', bg: 'elena_car', player: false, noSave: true, parallax: false, ambience: 'night',
    light: { ambient: 'rgb(150,160,190)', base: 0.8 },
    hotspots: [
      { name: 'The radio', rect: [540, 590, 200, 70], look: () => say(phase ? 'elena_look_radio_2' : 'elena_look_radio'), use: () => say(phase ? 'elena_look_radio_2' : 'elena_use_radio'), after: 'radio' },
      { name: 'Notebook on the passenger seat', rect: [840, 600, 240, 90], look: 'elena_look_notebook', use: 'elena_look_notebook', after: 'notebook' },
      { name: 'The rear-view mirror', rect: [580, 70, 140, 60], look: () => say(phase ? 'elena_look_mirror_2' : 'elena_look_mirror'), after: 'mirror' },
      { name: 'The window crank', rect: [120, 560, 120, 110], look: () => say(phase ? 'elena_crank_stuck_look' : 'elena_look_crank'),
        use: async () => { if (phase) { const s = F().elena_seen; if (!s.includes('crank2')) s.push('crank2'); return say('elena_crank_stuck'); } crankOpen = 1; S.sfx('cloth_shirt', 0.4); await say('elena_use_crank'); }, after: 'crank' },
      { name: 'The air', rect: [300, 150, 680, 240], when: () => phase >= 1, look: 'elena_look_air', after: 'air', noBox: true },
    ],
    async onAction(t) {
      const a = t.def && t.def.after; if (!a) return;
      const seen = F().elena_seen || (F().elena_seen = []);
      if (!seen.includes(a)) seen.push(a);
      if (phase === 0 && ['radio', 'notebook', 'mirror', 'crank'].filter(k => seen.includes(k)).length >= 3) await S.intoCloud();
      else if (phase === 1 && seen.includes('air') && seen.includes('crank2')) await S.theWater();
    },
    animBack(g, t) {
      // the cloud outside: silver under the moon, then grey, then black
      const k = phase === 0 ? 0 : phase === 1 ? Math.min(1, (t - (S.cloudAt || t)) / 6) : 1;
      g.save(); g.globalAlpha = 0.25 + 0.6 * k; g.fillStyle = phase >= 1 ? `rgb(${Math.round(90 - 70 * k)},${Math.round(96 - 74 * k)},${Math.round(104 - 78 * k)})` : 'rgb(170,180,200)';
      g.beginPath(); g.moveTo(130, 70); g.lineTo(1150, 70); g.lineTo(1230, 515); g.lineTo(50, 515); g.closePath(); g.fill(); g.restore();
      if (phase === 0) FX.drawClouds && S.nightClouds && FX.drawClouds(g, S.nightClouds, t, 30, 360, 0.3);
      if (phase === 0) {
        // the stars and the moon over the sea of cloud, before she drives down into it
        FX.twinkle(g, t, [[180, 60, 1], [262, 118, 1], [348, 40, 1], [420, 96, 1], [488, 150, 1], [540, 70, 1], [790, 58, 1], [842, 132, 1], [1010, 44, 1], [1074, 110, 1], [1140, 64, 1], [1196, 150, 1]], '220,228,255');
        FX.glow(g, 936, 92, 70, '210,220,255', 0.08 + 0.02 * Math.sin(t * 0.4));
        FX.water(g, t * 0.5, 820, 196, 240, 16, '200,212,240'); // the moonlight on the cloud tops
      }
      FX.glow(g, 705, 544, 46, '255,170,80', 0.16 + 0.03 * Math.sin(t * 2.3)); // the radio's dial
      // headlights on nothing
      FX.glow(g, 640, 470, 220, '255,240,200', phase ? 0.08 : 0.16);
      if (crankOpen) FX.wisps(g, t, 160, 300, { n: 4, rise: 40, spread: 30, rgb: '220,230,240', a: 0.08, size: 10, speed: 0.4 });
      // the condensation, and the triangle her finger draws in it
      if (phase >= 1) { g.save(); g.fillStyle = 'rgba(200,210,220,0.10)'; g.fillRect(140, 80, 1000, 420); g.restore(); }
      if (triangle > 0) {
        g.save(); g.strokeStyle = `rgba(230,236,240,${0.7 * triangle})`; g.lineWidth = 6; g.lineJoin = 'round';
        g.beginPath(); g.moveTo(560, 200); g.lineTo(720, 200); g.lineTo(640, 340); g.closePath(); g.stroke(); g.restore();
      }
    },
    animFg(g, t) { S.drawWater(g, t, S.water.elena_car, '20,40,48'); },
  });
  S.nightClouds = FX.makeClouds ? FX.makeClouds(23, '120,130,160', 30) : null;

  S.intoCloud = async function () {
    if (phase) return;
    phase = 1; S.cloudAt = performance.now() / 1000;
    S.sfx('fog_lift', 0.5);
    await say('narr_pro_cloud');
  };
  S.theWater = async function () {
    if (phase >= 2) return;
    phase = 2; G.cutscene = true;
    try {
      S.sfx('water_seep', 0.5); await T(800);
      await say('elena_salt');
      S.sfx('water_rise', 0.6);
      await S.waterTo('elena_car', 0.32, 3500);
      await say('elena_doors');
      // she stops trying the doors, and draws on the glass
      for (let i = 0; i <= 20; i++) { triangle = i / 20; await G.wait(window.FAST ? 2 : 80); }
      S.sfx('water_rise_2', 0.6);
      await S.waterTo('elena_car', 0.7, 4500);
      await T(900);
      await G.fade(true);
    } finally { G.cutscene = false; }
  };

  // the whole prologue; returns on black, before the title card
  S.prologue = async function () {
    phase = 0; crankOpen = 0; triangle = 0; S.water.elena_car = 0; F().elena_seen = [];
    F().ch = 0;
    await G.busy(async () => {
      await G.fade(true);
      await G.card(S.DAYS[0][0], S.DAYS[0][1], 3200);
      Sound.ambience('tavern');
      await S.paint('still_elena_bar', async () => {
        S.sfx('payphone_coins', 0.6); await T(900);
        await say('carmen_machine', 'elena_msg_01', 'elena_msg_02', 'elena_msg_03');
        S.sfx('phone_hangup', 0.5); await T(400);
        await say('barman_stay', 'elena_stay');
      }, { zoom: [1.0, 1.12], pan: [[0.45, 0.55], [0.55, 0.5]] });
      Sound.ambience('night');
      await G.goRoom('elena_car', null, { instant: true, noEnter: true, noSave: true });
      G.endStill();
      await G.fade(false);
      await say('narr_pro_road');
    });
    // the player looks around the car until the cloud, and the water, take it
    await new Promise(res => { const iv = setInterval(() => { if (phase >= 2 && !G.isBusy) { clearInterval(iv); res(); } }, 200); S._proSkip = () => { phase = 2; }; });
    await G.busy(async () => {
      Sound.ambience(null);
      await S.paint('still_barranco', async () => {
        S.sfx('dawn_birds', 0.3); await T(700);
        await say('gc_01', 'gc_02', 'gc_03', 'narr_open_01', 'narr_open_02');
      }, { zoom: [1.0, 1.1], pan: [[0.5, 0.6], [0.5, 0.45]] });
      S.water.elena_car = 0;
      await S.paint('still_title', () => T(3500), { zoom: [1.0, 1.06] });
    });
  };

  // ---------------------------------------------------------------- the opening, as paintings (used by every day)
  S.paint = async function (name, fn, opts) {
    await G.fade(true);
    await G.showStill(name, async () => { await G.fade(false); if (fn) await fn(); }, Object.assign({ keep: true, dur: 16 }, opts));
    await G.fade(true);
  };
})();
