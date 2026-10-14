// Chapter V — The Drowned Bell: Carmo at midnight, the cistern rite, dawn, epilogue.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;
  // a still, or a fallback painting while a still is missing
  S.still = (name, fallback, fn, opts) => G.showStill(G.image('still:' + name) ? name : fallback, fn, opts);

  // ================================================================ CARMO AT MIDNIGHT
  ROOMS.convent_night = {
    name: 'Convento do Carmo — midnight', bg: 'convent_night', music: null, ambience: 'night', floor: 'stone', skyMask: 'convent_night_sky',
    fog: 0.3, fogRGB: '120,135,180',
    walk: [[0, 640], [230, 560], [1050, 560], [1280, 640], [1280, 716], [1030, 716], [1000, 594], [790, 594], [778, 716], [0, 716]], // around the open grate
    scale: [560, 230, 716, 360],
    light: { ambient: 'rgb(120,135,185)', base: 0.72 },
    lights: [
      { x: 800, y: 168, rgb: '200,215,255', level: t => S.moonLevel(t), glow: 90, ga: 0.2, power: 0.35, reach: 1500, rim: 0.6, shadow: 0.5, floor: [800, 470], height: 900 },
      { x: 990, y: 640, rgb: '90,255,160', kind: 'pulse', seed: 0, glow: 175, ga: 0.22, power: 0.4, reach: 650, rim: 0.7, floor: [990, 640], height: 200 },
      { actor: 'tomas', off: [0.3, -0.43], rgb: '255,190,110', kind: 'flame', seed: 9, glow: 75, ga: 0.38, power: 0.55, reach: 520, rim: 0.7, height: 160, when: () => !F().has_lantern },
      { actor: 'lacerda', off: [0.3, -0.62], rgb: '255,160,80', kind: 'torch', seed: 5, glow: 70, ga: 0.35, power: 0.45, reach: 520, rim: 0.6, height: 150,
        when: () => F().lacerda_distracted && !F().won, dim: () => { const l = G.npc('lacerda'); return l ? Math.max(0, 1 - l.sink * 1.6) : 0; } },
      { actor: 'alan', off: [0.28, -0.45], rgb: '255,190,110', kind: 'flame', seed: 11, glow: 70, ga: 0.35, power: 0.5, reach: 500, rim: 0.7, height: 160, when: () => F().has_lantern },
      { x: 1158, y: 470, rgb: '255,140,80', kind: 'candle', seed: 5, glow: 55, ga: 0.25, power: 0.15, reach: 300, shadow: false },
    ],
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'], cistern: [880, 650, 'w'] },
    animBack(g, t) { FX.masked(g, G.mask(), m => FX.drawClouds(m, S.nightClouds, t, 7, 0, 1)); },
    anim(g, t) { for (let i = 0; i < 3; i++) FX.wisps(g, t + i * 1.3, 900 + i * 90, 640, { n: 5, rise: 120, spread: 30, rgb: '120,255,180', a: 0.06, size: 26, speed: 0.12 }); },
    npcs: [
      { id: 'tomas', ch: 'tomas_night', x: 430, y: 600, dir: 'e', name: 'Father Tomás', look: 'narr_look_tomas_night', talk: () => S.tomasConfession(), when: () => !F().won,
        items: { any: 'alan_fail_07' } },
      { id: 'rui', x: 120, y: 600, dir: 'e', set: 'gate', name: 'Rui', when: () => F().rui_called && !F().won, look: 'narr_look_rui', talk: () => say('rui_nothing', 'alan_rui_gate') },
    ],
    hotspots: [
      { name: 'Weeping stone', rect: [40, 125, 190, 345], look: 'narr_look_stone' },
      { name: 'Ruined arches', rect: [320, 0, 330, 500], look: 'narr_look_arches' },
      { name: 'Open grate', rect: [790, 585, 420, 120], at: [760, 645], face: 'e', look: 'narr_look_grate',
        use: async () => {
          if (!F().has_lantern) return say(F().confessed ? 'alan_need_lantern' : 'tomas_night_hello');
          await joke('alan_descend'); sfx('stairs'); await G.goRoom('cistern', 'convent');
        } },
      { name: 'Way out', rect: [0, 590, 60, 126], at: [30, 672], exit: 'map', entry: 'convent' },
    ],
    async enter() { if (!F().night_entered) { F().night_entered = true; await say('narr_look_convent_night'); await say('tomas_night_hello'); } },
  };
  S.moonLevel = t => 1 - 0.75 * S.nightClouds.alphaAt(800 + FX.cloudOffset(S.nightClouds, t, 7), 188);
  S.tomasConfession = async function () {
    if (F().confessed) return say('tomas_lantern');
    await say('alan_ask_midnight');
    G.cutscene = true;
    await S.still('still_1955_a', 'cistern', () => say('tomas_boy'), { sepia: true, grain: true, zoom: [1.02, 1.12] });
    await S.still('still_1955_b', 'cistern', () => say('tomas_ran'), { sepia: true, grain: true, zoom: [1.06, 1.0] });
    await S.still('still_1955_c', 'convent_night', () => say('tomas_count'), { sepia: true, grain: true, zoom: [1.0, 1.1] });
    G.cutscene = false;
    await say('alan_thanks', 'tomas_lantern');
    F().confessed = true; F().has_lantern = true; give('lantern'); sfx('lantern');
    if (F().rui_called) await say('rui_nothing');
  };

  // ================================================================ THE CISTERN
  // Steps of the rite: 1 ledger to Lacerda (he kneels, reading), 2 knife on
  // Inês's ropes, 3 lantern to Inês (the marks appear), 4 knife on Alan's
  // palm, 5 the tongue on the marks, last to first. Six marks of water.
  const ORDER = ['sanches', 'coutinho', 'bastos', 'ferreira'];
  const MARKS = { ferreira: [585, 232], coutinho: [692, 226], sanches: [604, 316], bastos: [706, 322] };
  const PLATFORM = [690, 432];
  const watched = () => !F().lacerda_distracted || F().strikes > 0;
  ROOMS.cistern = {
    name: 'The Cistern', bg: 'cistern', noSave: true, music: null, ambience: 'cistern', floor: 'wet',
    fog: () => F().won ? 0 : 0.16, fogRGB: '90,140,120',
    walk: [[0, 560], [214, 560], [598, 420], [762, 420], [704, 446], [332, 560], [1000, 560], [1280, 640], [1280, 716], [0, 716]],
    scale: [420, 192, 716, 378],
    light: () => F().won ? { ambient: 'rgb(200,190,170)', base: 0.8 } : { ambient: 'rgb(150,165,135)', base: 0.6, flickerShade: 0.32 },
    lights: [
      { x: 102, y: 205, rgb: '255,150,60', kind: 'torch', seed: 2, glow: 150, ga: 0.35, power: 0.75, reach: 1150, rim: 0.7, floor: [100, 560], height: 420 },
      { x: 1215, y: 250, rgb: '255,150,60', kind: 'torch', seed: 4, glow: 120, ga: 0.3, power: 0.6, reach: 950, rim: 0.7, floor: [1215, 560], height: 380 },
      { x: 650, y: 470, rgb: '110,255,170', kind: 'pulse', seed: 2, power: 0.22, reach: 700, rim: 0.5, shadow: false },
      { actor: 'ines', off: [0.05, -1.05], rgb: '255,195,120', kind: 'flame', seed: 8, glow: 90, ga: 0.4, power: 0.6, reach: 700, rim: 0.8, height: 120, when: () => F().bell_lit && !F().won },
      { actor: 'lacerda', off: [0.3, -0.62], rgb: '255,160,80', kind: 'torch', seed: 5, glow: 70, ga: 0.35, power: 0.45, reach: 520, rim: 0.6, height: 150,
        when: () => F().lacerda_distracted && !F().won, dim: () => { const l = G.npc('lacerda'); return l ? Math.max(0, 1 - l.sink * 1.6) : 0; } },
      { actor: 'alan', off: [0.28, -0.45], rgb: '255,190,110', kind: 'flame', seed: 11, glow: 60, ga: 0.3, power: 0.4, reach: 450, rim: 0.6, height: 160, when: () => F().has_lantern && !F().bell_lit },
    ],
    entries: { default: [140, 640, 'e'], convent: [140, 640, 'e'] },
    layers: [
      { img: 'cistern_plate', x: 0, y: 0, full: true },
      { img: 'cistern_bell', x: 0, y: 0, full: true, pivot: [652, 0], swing: t => F().ringing ? 2.4 * Math.sin(t * 2.3) : 0.4 * Math.sin(t * 0.6) },
    ],
    anim(g, t) {
      FX.water(g, t, 160, 400, 850, 140, '120,255,170');
      FX.drips(g, t, [[330, 470, 120, 4.3], [940, 505, 150, 5.7], [470, 440, 140, 6.9]], '170,255,210');
      FX.embers(g, t, 104, 175, 7); FX.embers(g, t + 3, 1216, 225, 6);
      if (F().sinkAt) FX.drips(g, t, [[F().sinkAt[0], F().sinkAt[1], F().sinkAt[1] - 1, 1.2]], '170,255,210');
      S.drawMarks(g, t);
      if (F().ringing) for (let i = 0; i < 3; i++) {
        const r = ((t * 220) + i * 160) % 480;
        g.strokeStyle = `rgba(150,255,210,${0.5 * (1 - r / 480)})`; g.lineWidth = 3;
        g.beginPath(); g.ellipse(652, 260, r, r * 0.45, 0, 0, Math.PI * 2); g.stroke();
      }
      S.idleHint(t); S.readingTick(t);
    },
    animFg(g, t) { S.drawFlood(g, t); S.drawVortex(g, t); if (F().won) { g.fillStyle = 'rgba(255,200,140,0.08)'; g.fillRect(0, 0, 1280, 720); } },
    npcs: [
      { id: 'lacerda', ch: 'lacerda_robe', x: 845, y: 572, dir: 'w', fixedDir: true, set: () => F().lacerda_distracted ? 'read' : null, name: 'Lacerda', when: () => !F().won,
        look: 'narr_look_lacerda_robe', talk: async () => { await say('alan_fin_angry'); await say(watched() ? 'lacerda_patient' : 'lacerda_ledger'); },
        take: () => S.cisternDeath(),
        items: { ledger: () => S.giveLedger(), tongue: () => S.cisternDeath(), knife: () => S.cisternDeath(), any: 'alan_fail_lacerda_item' } },
      { id: 'ines', x: 1078, y: 640, dir: 'w', fixedDir: true, set: () => F().bell_lit ? 'lantern' : F().ines_free ? null : 'tied', name: 'Inês',
        look: () => say(F().ines_free ? 'narr_look_ines' : 'narr_look_ines_tied'), talk: () => say(S.cisternHint()),
        items: { knife: () => S.cutRopes(), lantern: () => S.giveLantern(), any: 'alan_fail_ines_item' } },
    ],
    hotspots: [
      { name: 'Waterline marks', rect: [990, 280, 160, 300], look: 'narr_look_marks' },
      { name: 'Walkway', rect: [210, 410, 560, 150], look: 'narr_look_walkway' },
      { name: 'The Drowned Bell', rect: [533, 60, 236, 330], reach: false, look: () => say(F().bell_lit ? 'narr_bell_lit' : 'narr_look_bell'),
        use: () => say(F().bell_lit ? 'alan_need_blood' : 'alan_too_dark'),
        items: { tongue: () => S.strike(null), any: 'alan_fail_09' } },
      ...Object.keys(MARKS).map(id => ({ name: () => `${id[0].toUpperCase() + id.slice(1)} mark`, rect: [MARKS[id][0] - 26, MARKS[id][1] - 22, 52, 44], reach: false,
        when: () => F().bell_lit, look: 'narr_bell_lit', items: { tongue: () => S.strike(id), any: 'alan_fail_09' } })),
      { name: 'Black water', rect: [160, 395, 850, 150], look: 'narr_look_cistern' },
    ],
    self: { items: { knife: () => S.cutPalm(), any: 'alan_fail_06' } },
    async enter() {
      if (F().finaleIntro) return;
      F().finaleIntro = true; F().water = 0; F().strikes = 0;
      await G.player.walkTo(330, 640); G.player.dir = 'e';
      await say('lacerda_joaquim', 'alan_fin_angry', 'lacerda_spared', 'lacerda_ze', 'lacerda_demand', 'ines_warn', 'lacerda_quiet');
      G.checkpoint();
    },
  };
  S.drawMarks = function (g, t) {
    // six painted marks on the pillar; the ones under water glow
    for (let k = 1; k <= 6; k++) {
      const y = 568 - k * 46, on = (F().water || 0) >= k;
      g.strokeStyle = on ? `rgba(140,255,200,${0.75 + 0.2 * Math.sin(t * 6 + k)})` : 'rgba(230,225,210,0.35)';
      g.lineWidth = on ? 4 : 3; g.beginPath(); g.moveTo(1010, y); g.lineTo(1132, y + 3); g.stroke();
      if (on) FX.glow(g, 1070, y, 50, '120,255,180', 0.12);
    }
    if (!F().bell_lit || F().won) return;
    // the four foundry marks in the carved waves, catching the lantern light
    for (const id of Object.keys(MARKS)) {
      const [x, y] = MARKS[id], done = (F().struck || []).includes(id);
      FX.glow(g, x, y, 34, done ? '140,255,200' : '255,210,130', 0.32 + 0.1 * Math.sin(t * 3 + x));
      g.font = "700 12px 'Cinzel', serif"; g.textAlign = 'center';
      g.fillStyle = done ? 'rgba(200,255,225,0.95)' : 'rgba(255,235,190,0.92)'; g.fillText(id.toUpperCase(), x, y + 4);
    }
    g.textAlign = 'left';
  };
  // the black water closing over Lacerda: a churning pool at his feet, foam, bubbles
  let vortex = null;
  S.drawVortex = function (g, t) {
    if (!vortex) return;
    const now = performance.now(), k = Math.min(1, (now - vortex.t0) / 900), fade = vortex.end ? Math.max(0, 1 - (now - vortex.end) / 2500) : 1;
    if (fade <= 0) { vortex = null; return; }
    const { x, y } = vortex, rx = 90 * k + 30, ry = 22 * k + 8;
    g.save(); g.globalAlpha = fade;
    const gr = g.createRadialGradient(x, y, 4, x, y, rx);
    gr.addColorStop(0, 'rgba(8,30,22,0.95)'); gr.addColorStop(0.7, 'rgba(18,60,44,0.85)'); gr.addColorStop(1, 'rgba(30,90,64,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) {
      const ph = (t * 1.8 + i / 3) % 1;
      g.strokeStyle = `rgba(170,255,215,${0.5 * (1 - ph)})`; g.lineWidth = 2.5;
      g.beginPath(); g.ellipse(x, y, rx * (0.4 + ph * 0.9), ry * (0.4 + ph * 0.9), 0, t * 2 + i, t * 2 + i + 4.5); g.stroke();
    }
    for (let i = 0; i < 14; i++) {
      const a = t * 3 + i * 0.45, r = rx * (0.5 + 0.45 * Math.sin(t * 2.3 + i));
      g.fillStyle = 'rgba(220,255,235,0.7)'; g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.25 - Math.abs(Math.sin(t * 6 + i)) * 10, 2.5, 0, 7); g.fill();
    }
    g.restore();
  };
  S.drawFlood = function (g, t) {
    const w = F().water || 0; if (!w || F().won) return;
    const top = 548, front = 548 + (w / 6) * 175;
    const gr = g.createLinearGradient(0, top, 0, front);
    gr.addColorStop(0, 'rgba(20,60,45,0.75)'); gr.addColorStop(1, 'rgba(25,80,60,0.55)');
    g.save(); g.fillStyle = gr; g.beginPath(); g.moveTo(0, top);
    for (let x = 0; x <= 1280; x += 40) g.lineTo(x, top - 2 + Math.sin(t * 2 + x * 0.02) * 2);
    for (let x = 1280; x >= 0; x -= 40) g.lineTo(x, front + Math.sin(t * 1.6 + x * 0.015) * 4);
    g.closePath(); g.fill();
    g.strokeStyle = 'rgba(160,255,210,0.35)'; g.lineWidth = 2; g.beginPath();
    for (let x = 0; x <= 1280; x += 20) g.lineTo(x, front + Math.sin(t * 1.6 + x * 0.015) * 4); g.stroke();
    g.restore();
  };
  // Inês calls out the next step if the player hesitates for 20 seconds
  let lastAct = 0, hinted = 0;
  S.idleHint = function (t) {
    if (G.isBusy || F().won || !F().finaleIntro) { lastAct = t; return; }
    if (t - lastAct > 20 && t - hinted > 20) { hinted = t; lastAct = t; G.busy(() => say(S.cisternHint())); }
  };
  S.cisternHint = () => !F().lacerda_distracted ? 'ines_hint_eyes' : !F().ines_free ? 'ines_hint_ropes' : !F().bell_lit ? 'ines_hint_light' : !F().blood ? 'ines_hint_blood' : 'ines_hint_lastfirst';
  const raise = async (n) => {
    F().water = Math.min(6, (F().water || 0) + n); sfx('water_rise', 0.7);
    if (F().water >= 6) { await G.wait(window.FAST ? 20 : 600); await S.cisternDeath(true); return true; }
    return false;
  };
  S.giveLedger = async function () {
    if (F().lacerda_distracted) return say('alan_fail_04');
    G.takeItem('ledger');
    await say('alan_offer', 'lacerda_cant', 'alan_seven');
    const lac = G.npc('lacerda'); lac.set = 'read'; F().lacerda_distracted = true;
    sfx('page');
    await say('lacerda_ledger');
    sfx('page', 0.7);
    await say('lacerda_read_1');
  };
  // while he reads, the pages keep turning
  let nextPage = 0;
  S.readingTick = function (t) {
    if (!F().lacerda_distracted || F().strikes > 0 || F().won || G.isBusy) return;
    if (t > nextPage) { nextPage = t + 5 + Math.random() * 5; Sound.sfx('page', 0.5); if (!F().read2 && t > 12) { F().read2 = true; G.busy(() => say('lacerda_read_2')); } }
  };
  S.cutRopes = async function () {
    if (F().ines_free) return say('alan_fail_04');
    if (watched()) {
      if (!F().glacier) { F().glacier = true; await say('lacerda_patient'); await joke('alan_glacier'); } else await say('lacerda_patient');
      await raise(1); return;
    }
    const ines = G.npc('ines'); G.player.pose = 'reach'; sfx('rope_cut');
    await G.wait(window.FAST ? 20 : 700); G.player.pose = null;
    F().ines_free = true; ines.set = null; ines.pose = 'wrists';
    await say('ines_free', 'alan_cat');
    ines.pose = null;
  };
  S.giveLantern = async function () {
    if (!F().ines_free) return say('alan_cut_watched');
    if (F().bell_lit) return say('alan_fail_04');
    G.takeItem('lantern'); F().has_lantern = false;
    const ines = G.npc('ines'); ines.set = 'lantern'; F().bell_lit = true;
    await say('ines_lantern'); await say('narr_bell_lit');
  };
  S.cutPalm = async function () {
    if (F().blood) return say('alan_fail_04');
    if (!G.has('tongue')) return say('alan_fail_06');
    G.player.pose = 'cut'; sfx('knife');
    await say('ines_no'); await joke('alan_papercut');
    G.player.pose = null; F().blood = true; G.renderInv();
  };
  S.toPlatform = async function () {
    const p = G.player;
    if (p.y < 470) return;
    await p.walkTo(272, 556); await p.walkTo(PLATFORM[0], PLATFORM[1]);
    p.dir = 'w';
  };
  S.strike = async function (id) {
    if (!F().lacerda_distracted) return S.cisternDeath();
    if (!F().bell_lit) return say('alan_too_dark');
    if (!F().blood) return say('alan_need_blood');
    if (!id) return say('narr_bell_lit');
    await S.toPlatform();
    const p = G.player; p.pose = 'ring';
    await G.wait(window.FAST ? 20 : 450);
    const struck = F().struck || (F().struck = []);
    const want = ORDER[struck.length];
    if (id !== want) {
      sfx('bell_forward'); p.pose = null; F().struck_wrong = true;
      await say('narr_wrong_strike', 'alan_wrong_strike');
      if (F().strikes === 0) { F().strikes = 1; const lac = G.npc('lacerda'); lac.set = null; lac.pose = 'terror'; await say('lacerda_no'); lac.pose = null; }
      return raise(2);
    }
    struck.push(id); F().strikes = (F().strikes || 0) + 1;
    sfx('bell_backward'); p.pose = null;
    const lac = G.npc('lacerda');
    if (struck.length === 1) { await say('alan_ringback'); lac.set = null; lac.pose = 'terror'; await say('lacerda_no'); lac.pose = null; }
    else if (struck.length === 2) await say('lacerda_strike_2');
    else if (struck.length === 3) await say('lacerda_strike_3');
    if (struck.length === 4) return S.silence();
    await raise(1);
  };
  S.cisternDeath = async function (step5) {
    await G.busy(async () => {
      const lac = G.npc('lacerda');
      if (lac) { lac.set = null; lac.pose = 'lunge'; }
      await say('lacerda_death');
      sfx('splash');
      await G.fade(true);
      document.querySelector('#death .msg').textContent = LINES.narr_death[1];
      F()._deathStep5 = !!step5 && F().blood;
      G.showModal('death', true);
      Sound.playVoice('narr_death');
    });
  };
  S.retryCistern = async function () {
    Sound.stopVoice();
    G.showModal('death', false);
    const keep = F()._deathStep5 ? { lacerda_distracted: true, ines_free: true, bell_lit: true, blood: true } : null;
    const cp = G.flags._checkpoint;
    await G.loadSave(cp);
    G.flags._checkpoint = cp;
    if (keep) { Object.assign(G.flags, keep); G.takeItem('ledger'); G.takeItem('lantern'); G.refreshNpcs(true); G.player.x = PLATFORM[0] - 300; G.player.y = 600; }
    F().water = 0; F().strikes = 0; F().struck = [];
    await G.fade(false);
  };
  document.getElementById('btn-retry').onclick = () => S.retryCistern();

  S.silence = async function () {
    G.cutscene = true;
    const lac = G.npc('lacerda'), ines = G.npc('ines'), p = G.player;
    F().ringing = true; sfx('bell_backward'); sfx('fog_lift');
    await say('narr_ring');
    lac.set = null; lac.pose = 'terror';
    await say('lacerda_mine');
    await say('alan_answers');
    // the water answers: it opens under him and starts to pull
    sfx('water_rise'); vortex = { x: lac.x, y: lac.y + 2, t0: performance.now() };
    await G.wait(window.FAST ? 20 : 700);
    lac.pose = 'lunge';
    const x0 = lac.x, y0 = lac.y, x1 = lac.x + 40, y1 = lac.y - 16;
    for (let k = 0; k <= 1.0001; k += window.FAST ? 0.5 : 0.03) {
      const e = k * k; lac.x = x0 + (x1 - x0) * e; lac.y = y0 + (y1 - y0) * e; vortex.x = lac.x; vortex.y = lac.y + 2; lac.sink = 0.12 * e;
      await G.wait(16);
    }
    await say('lacerda_drag');
    await say('alan_no_hand');
    // under: to his knees, his chest, his mouth (the narrator speaks over it)
    sfx('splash');
    const sinking = (async () => {
      for (let k = 0.12; k <= 1.0001; k += window.FAST ? 0.4 : 0.006) {
        lac.sink = k; if (k > 0.45 && lac.pose !== 'terror') lac.pose = 'terror';
        lac.x = x1 + Math.sin(k * 40) * 3 * (1 - k);
        await G.wait(16);
      }
      lac.visible = false; sfx('splash', 0.6); vortex.end = performance.now();
    })();
    await say('narr_end_1');
    await sinking;
    F().sinkAt = [x1, y1];
    await G.wait(window.FAST ? 20 : 900);
    await say('alan_ledger');
    // the water lets go of everything else
    F().ringing = false; F().sinkAt = null;
    for (let w = F().water || 0; w > 0; w -= window.FAST ? 6 : 0.05) { F().water = Math.max(0, w); await G.wait(16); }
    F().water = 0;
    await say('narr_silence');
    F().won = true;
    await say('narr_still');
    ines.set = null; ines.def.fixedDir = false;
    await p.walkTo(272, 556); await p.walkTo(420, 640);
    await ines.walkTo(p.x + 140, p.y + 4); ines.dir = 'w'; p.dir = 'e';
    await say('ines_end', 'alan_end');
    G.cutscene = false;
    await S.dawn();
  };

  // ================================================================ DAWN & EPILOGUE
  S.dawn = async function () {
    await G.fade(true);
    F().dawn = true;
    await G.goRoom('convent', 'map', { instant: true, noEnter: true, noSave: true, pos: [880, 650, 'w'] });
    Sound.playMusic('dawn');
    const tm = G.npc('tomas'); if (tm) { tm.loop = null; tm.pose = 'kneel'; tm.x = 560; tm.y = 600; }
    await G.fade(false);
    await joke('alan_dawn');
    if (F().rui_called) { await say('rui_coffee_back'); }
    await S.epilogue();
  };
  S.epilogue = async function () {
    G.cutscene = true;
    await S.still('still_city_morning', 'street', () => say('narr_epilogue'), { zoom: [1.0, 1.12], pan: [[0.5, 0.55], [0.5, 0.45]] });
    await S.still('still_drawer', 'police', async () => { await say('narr_epi_drawer'); sfx('drawer_scrape'); await say('rui_click'); }, { zoom: [1.08, 1.0] });
    await S.still('still_shop_after', 'shop', () => say('narr_epi_shop'), { zoom: [1.0, 1.1] });
    if (F().amalia_box) await S.still('still_amalia_box', 'tavern', () => say('narr_vig_box'), { zoom: [1.04, 1.12] });
    if (F().amalia_night) await S.still('still_tavern_full', 'tavern', () => say('narr_vig_night'), { zoom: [1.0, 1.1] });
    await S.still('still_quay_sweater', 'cais', async () => { await say('narr_vig_ze'); if (F().ze_romance) await say('narr_vig_ze_2'); }, { zoom: [1.0, 1.1] });
    if (F().founder_order && !(F().struck_wrong)) await S.still('still_abilio_ring', 'se_tower', async () => { sfx('bell_forward', 0.6); await say('narr_vig_abilio'); }, { zoom: [1.0, 1.12] });
    await S.still('still_phone', 'shop', () => say('narr_call'), { zoom: [1.0, 1.08], keep: true });
    // credits, then the post-credits stills
    G.showModal('ending', true);
    await G.wait(window.FAST ? 50 : 9000);
    G.showModal('ending', false);
    await S.still('still_jacket', 'boat', () => say('ze_back'), { zoom: [1.0, 1.1] });
    await S.still('still_shelf', 'antiques', async () => { sfx('clock_chime', 0.6); await say('narr_post'); await G.wait(window.FAST ? 20 : 1500); }, { zoom: [1.0, 1.15], keep: true });
    G.showModal('ending', true);
    G.cutscene = false;
    try { localStorage.removeItem('drowned-bell-save-v3'); } catch (e) { /* ignore */ }
  };
  document.getElementById('btn-again').onclick = () => location.reload();
})();
