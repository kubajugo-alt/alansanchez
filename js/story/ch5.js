// Chapter V — The Drowned Bell: Carmo at midnight, the cistern rite, dawn, epilogue.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;
  // a still, or a fallback painting while a still is missing
  S.still = (name, fallback, fn, opts) => G.showStill(G.hasArt('still:' + name) ? name : fallback, fn, opts);

  // ================================================================ CARMO AT MIDNIGHT
  ROOMS.convent_night = {
    name: 'Convento do Carmo — midnight', bg: 'convent_night', music: 'carmo_night', ambience: 'night', floor: 'stone', skyMask: 'convent_night_sky',
    fog: 0.3, fogRGB: '120,135,180',
    walk: [[0, 640], [230, 560], [1000, 560], [1000, 594], [790, 594], [778, 716], [0, 716]], // around the open grate, and not behind the grating leaning on the wall
    scale: [560, 230, 716, 360],
    light: { ambient: 'rgb(120,135,185)', base: 0.72 },
    lights: [
      { x: 800, y: 168, rgb: '200,215,255', level: t => S.moonLevel(t), glow: 90, ga: 0.2, power: 0.35, reach: 1500, rim: 0.6, shadow: 0.5, floor: [800, 470], height: 900 },
      { x: 990, y: 640, rgb: '90,255,160', kind: 'pulse', seed: 0, glow: 175, ga: 0.22, power: 0.4, reach: 650, rim: 0.7, floor: [990, 640], height: 200 },
      { actor: 'tomas', off: [0.25, -0.73], offs: { tomas_night_talk: [-0.21, -0.36] }, rgb: '255,190,110', kind: 'flame', seed: 9, glow: 75, ga: 0.38, power: 0.55, reach: 520, rim: 0.7, height: 160, when: () => !F().confessed }, // out once he has given it to Alan
      { actor: 'alan', off: [0.152, -0.44], offs: { alan_lantern: [0.152, -0.44], alan_lwalk1: [0.15, -0.391], alan_lwalk2: [0.181, -0.42] }, rgb: '255,190,110', kind: 'flame', seed: 11, glow: 70, ga: 0.35, power: 0.5, reach: 500, rim: 0.7, height: 160, when: () => F().has_lantern },
      { x: 1158, y: 440, rgb: '255,140,80', kind: 'candle', seed: 5, glow: 55, ga: 0.25, power: 0.15, reach: 300, shadow: false },
    ],
    entries: { default: [70, 670, 'e'], map: [70, 670, 'e'], cistern: [740, 650, 'w'] }, // up from the cistern: beside the open grate, not in it
    animBack(g, t) {
      FX.masked(g, G.mask(), m => { FX.drawClouds(m, S.nightClouds, t, 7, 0, 1); FX.birds(m, t + 11, { y0: 50, y1: 230, n: 2, period: 13, color: 'rgba(8,10,22,0.85)', size: 6 }); }); // and bats
      [[1135, 434], [1145, 433], [1155, 433], [1170, 433]].forEach(([x, y], i) => FX.flame(g, t, x, y, 6, i * 1.7, '255,160,80')); // the votive candles
      g.save(); g.beginPath(); g.ellipse(277, 448, 40, 6, 0, 0, 7); g.clip(); FX.water(g, t * 0.4, 237, 442, 80, 12, '170,190,240'); g.restore(); // moonlight on the font
    },
    anim(g, t) {
      S.carry();
      FX.motes(g, t, 800, 590, 400, 110, 14, '130,255,180'); // green sparks off the grate
      for (let i = 0; i < 3; i++) FX.wisps(g, t + i * 1.3, 900 + i * 90, 640, { n: 5, rise: 120, spread: 30, rgb: '120,255,180', a: 0.06, size: 26, speed: 0.12 });
    },
    npcs: [
      { id: 'tomas', ch: 'tomas_night', x: 430, y: 600, dir: 'e', set: () => F().confessed ? 'pray' : null, name: 'Father Tomás', look: 'narr_look_tomas_night', talk: () => S.tomasConfession(), when: () => !F().won,
        items: { any: 'alan_fail_07' } },
      { id: 'rui', x: 120, y: 600, dir: 'e', set: 'gate', name: 'Rui', when: () => F().rui_called && !F().won, look: 'narr_look_rui', talk: () => F().gag_rui ? say('rui_nothing', 'alan_rui_gate') : (F().gag_rui = true, say(F().teixeira_scene ? 'gag_rui_b' : 'gag_rui', 'gag_alan_rui')) },
    ],
    hotspots: [
      { name: 'Weeping stone', rect: [40, 125, 190, 345], look: 'narr_stone_washed' },
      { name: 'Ruined arches', rect: [320, 0, 330, 500], look: 'narr_look_arches' },
      { name: 'Open grate', rect: [790, 585, 420, 120], at: [760, 645], face: 'e', look: 'narr_look_grate',
        use: async () => {
          if (!F().has_lantern) return say('alan_need_lantern');
          if (F().vasco_thursday && !F().descent_thought) { F().descent_thought = true; await G.say('narr_descent', { offscreen: true }); }
          await joke('alan_descend'); sfx('stairs'); await G.goRoom('cistern', 'convent');
        } },
      { name: 'Way out', rect: [0, 590, 60, 126], at: [30, 672], exit: 'map', entry: 'convent' },
    ],
    async enter() {
      G.setClock('00:10');
      if (!F().night_entered) { F().night_entered = true; await say('narr_look_convent_night'); await say('tomas_night_hello'); }
    },
  };
  S.moonLevel = t => 1 - 0.75 * S.nightClouds.alphaAt(800 + FX.cloudOffset(S.nightClouds, t, 7), 188);
  S.tomasConfession = async function () {
    if (F().confessed) return say(G.has('lantern') || F().bell_lit ? 'tomas_pray' : 'tomas_lantern');
    await say('alan_ask_midnight');
    G.cutscene = true;
    try {
      // the three paintings dissolve one into the next; only the last fades back to the room
      await S.still('still_1955_a', 'cistern', () => say('tomas_boy'), { sepia: true, grain: true, zoom: [1.02, 1.12], keep: true });
      await S.still('still_1955_b', 'cistern', () => say('tomas_ran'), { sepia: true, grain: true, zoom: [1.06, 1.0], keep: true, cross: true });
      await S.still('still_1955_c', 'convent_night', () => say('tomas_count', 'tomas_1955_water'), { sepia: true, grain: true, zoom: [1.0, 1.1], cross: true });
    } finally { G.cutscene = false; }
    await say('alan_thanks', 'tomas_lantern', 'gag_tomas', 'gag_alan_tomas');
    F().confessed = true; F().has_lantern = true; give('lantern'); sfx('lantern');
    { const tm = G.npc('tomas'); if (tm) tm.set = 'pray'; } // the lantern is Alan's now; Tomás kneels to pray
    if (F().rui_called) await say('rui_nothing');
  };

  // ================================================================ THE CISTERN
  // Lacerda is the Brotherhood: he knows the rite and the order, and needs only a founder's hand on
  // the bronze. He watches everything, and lets Alan free Inês and light the bell (he wants it rung).
  // Steps: 1 knife on Inês's ropes, 2 lantern to Inês (the marks appear), 3 knife on Alan's palm,
  // 4 the tongue on the marks, last to first. The first strike shows him what Alan is doing, and the
  // water won't obey him against the hand on the bell (Bastos's rule), so he comes along the walkway
  // for the hand: each correct strike lets him gain a stage, dawdling or a wrong strike too, and if he
  // reaches the platform before the fourth note, the water has Alan. Six marks of water, as before.
  const ORDER = ['sanches', 'coutinho', 'bastos', 'ferreira'];
  const MARKS = { ferreira: [585, 232], coutinho: [692, 226], sanches: [604, 316], bastos: [706, 322] };
  const PLATFORM = [690, 420], CAUSEWAY_END = [600, 428]; // on the platform's front band; the walkway's top, where it meets it
  ROOMS.cistern = {
    name: 'The Cistern', bg: 'cistern', noSave: true, music: () => F().won ? null : F().bell_lit ? 'bell_motif' : 'cistern_deep', // the rite: the bell's motif ambience: 'cistern', floor: 'wet',
    fog: () => F().won ? 0 : 0.16, fogRGB: '90,140,120',
    sway: t => S.quakeAt(t), // the room shakes when Lacerda surges
    // the walkway between its two curbs, out to the front of the bell's platform (the rim hangs too low to stand under), and off the pillar's plinth
    walk: [[0, 560], [196, 560], [200, 540], [568, 428], [600, 421], [712, 419], [714, 423], [640, 425], [612, 432], [370, 540], [372, 560], [960, 560], [960, 604], [1228, 604], [1280, 640], [1280, 716], [0, 716]],
    scale: [420, 192, 716, 378],
    light: () => F().won ? { ambient: 'rgb(200,190,170)', base: 0.8 } : { ambient: 'rgb(150,165,135)', base: 0.6, flickerShade: 0.32 },
    lights: [
      { x: 102, y: 205, rgb: '255,150,60', kind: 'torch', seed: 2, glow: 150, ga: 0.35, power: 0.75, reach: 1150, rim: 0.7, floor: [100, 560], height: 420 },
      { x: 1215, y: 250, rgb: '255,150,60', kind: 'torch', seed: 4, glow: 120, ga: 0.3, power: 0.6, reach: 950, rim: 0.7, floor: [1215, 560], height: 380 },
      { x: 650, y: 470, rgb: '110,255,170', kind: 'pulse', seed: 2, power: 0.22, reach: 700, rim: 0.5, shadow: false },
      { actor: 'ines', off: [0, -0.85], offs: { ines_lantern: [-0.01, -0.88], ines_lantern_talk: [-0.01, -0.84], ines_lwalk1: [0.15, -0.75], ines_lwalk2: [0.15, -0.75], ines_block: [0.14, -1.04], ines_float: [0.12, -0.53] }, rgb: '255,195,120', kind: 'flame', seed: 8, glow: 90, ga: 0.4, power: 0.6, reach: 700, rim: 0.8, height: 120, when: () => F().bell_lit && !F().won },
      { actor: 'alan', off: [0.152, -0.44], offs: { alan_lantern: [0.152, -0.44], alan_lwalk1: [0.15, -0.391], alan_lwalk2: [0.181, -0.42] }, rgb: '255,190,110', kind: 'flame', seed: 11, glow: 60, ga: 0.3, power: 0.4, reach: 450, rim: 0.6, height: 160, when: () => F().has_lantern && !F().bell_lit },
    ],
    entries: { default: [140, 640, 'e'], convent: [140, 640, 'e'] },
    layers: [
      { img: 'cistern_plate', x: 0, y: 0, full: true },
      { img: 'cistern_bell', x: 0, y: 0, full: true, pivot: [652, 0], swing: t => (F().ringing ? 2.4 * Math.sin(t * 2.3) : 0.4 * Math.sin(t * 0.6)) + S.bellShudder(t) },
    ],
    animBack(g, t) {
      const im = G.bgImage();
      FX.sway(g, im, [84, 130, 34, 100], t * 3.2, 1.6, 0, true); FX.sway(g, im, [1199, 192, 37, 72], t * 3.4, 1.4, 1.1, true); // the torch flames licking
      FX.ripple(g, im, [192, 410, 48, 96], t, 1.6, 0.4); FX.ripple(g, im, [1198, 395, 46, 95], t + 1, 1.6, 0.4); // their reflections
    },
    anim(g, t) {
      S.carry();
      FX.wisps(g, t, 100, 128, { n: 5, rise: 100, spread: 14, rgb: '25,20,14', a: 0.12, size: 12, speed: 0.15, dark: true }); FX.wisps(g, t + 2, 1215, 188, { n: 5, rise: 90, spread: 14, rgb: '25,20,14', a: 0.12, size: 12, speed: 0.15, dark: true }); // torch soot
      FX.water(g, t, 160, 400, 850, 140, '120,255,170');
      FX.drips(g, t, [[330, 470, 120, 4.3], [940, 505, 150, 5.7], [470, 440, 140, 6.9]], '170,255,210');
      FX.embers(g, t, 104, 175, 7); FX.embers(g, t + 3, 1216, 225, 6);
      if (F().sinkAt) FX.drips(g, t, [[F().sinkAt[0], F().sinkAt[1], F().sinkAt[1] - 1, 1.2]], '170,255,210');
      S.drawMarks(g, t);
      S.drawBellHit(g, t);
      if (F().ringing) for (let i = 0; i < 3; i++) {
        const r = ((t * 220) + i * 160) % 480;
        g.strokeStyle = `rgba(150,255,210,${0.5 * (1 - r / 480)})`; g.lineWidth = 3;
        g.beginPath(); g.ellipse(652, 260, r, r * 0.45, 0, 0, Math.PI * 2); g.stroke();
      }
      S.idleHint(t); S.raceTick(t); S.floatTick(t);
    },
    animFg(g, t) { S.drawFlood(g, t); S.drawVortex(g, t); S.drawLiving(g, t); S.drawSplashes(g, t); if (F().won) { g.fillStyle = 'rgba(255,200,140,0.08)'; g.fillRect(0, 0, 1280, 720); } },
    npcs: [
      { id: 'lacerda', ch: 'lacerda_robe', x: 845, y: 572, dir: 'w', fixedDir: true, name: 'Lacerda', when: () => !F().won,
        look: 'narr_look_lacerda_robe', talk: () => say('lacerda_patient'), // ("You killed him." was said once, on the way in)
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
        use: () => say(!F().bell_lit ? 'alan_too_dark' : !F().blood ? 'alan_need_blood' : 'ines_hint_lastfirst'),
        items: { tongue: () => S.strike(null), any: 'alan_fail_09' } },
      ...Object.keys(MARKS).map(id => ({ name: () => `${id[0].toUpperCase() + id.slice(1)} mark`, rect: [MARKS[id][0] - 26, MARKS[id][1] - 22, 52, 44], reach: false,
        when: () => F().bell_lit, look: 'narr_bell_lit', items: { tongue: () => S.strike(id), any: 'alan_fail_09' } })),
      { name: 'Black water', rect: [160, 395, 850, 150], look: 'narr_look_cistern' },
    ],
    self: { items: { knife: () => S.cutPalm(), any: 'alan_fail_06' } },
    async enter() {
      // the finale's own frames, loaded now rather than when first needed (the surge, the throw, afloat, the grab)
      G.ensure(['robe_walk1', 'robe_pass1', 'robe_command', 'robe_grab', 'robe_surge', 'robe_terror', 'ines_block', 'ines_float'].map(k => 'spr:' + k));
      if (F().finaleIntro) return;
      F().finaleIntro = true; F().water = 0; F().strikes = 0;
      Sound.cue('lacerda_theme'); // Lacerda, with Inês tied up behind him
      await G.player.walkTo(330, 640); G.player.dir = 'e';
      await say('lacerda_joaquim', 'alan_fin_angry', 'lacerda_spared_2', 'lacerda_ze', 'lacerda_demand', 'lacerda_font', 'lacerda_interrupted', 'lacerda_father');
      if (F().saw_afonso) await say('alan_father_photo'); // the boy in the photograph behind his counter
      await say('alan_father');
      S.lore && S.lore('father');
      await say('ines_warn', 'lacerda_quiet');
      Sound.cue(null);
      G.checkpoint();
    },
  };
  // each strike: the bell shudders on its chain, rings spread over the black water
  // and the bronze flares, green for a note rung backward, amber for a wrong one
  let hit = null;
  S.bellHit = kind => { hit = { kind, t0: null }; };
  const hitAge = t => { if (!hit) return Infinity; if (hit.t0 === null) hit.t0 = t; return t - hit.t0; };
  S.bellShudder = t => { const a = hitAge(t); return a < 4 ? 1.8 * Math.exp(-a * 1.3) * Math.sin(a * 9) : 0; };
  S.drawBellHit = function (g, t) {
    const a = hitAge(t); if (a > 5) return;
    const rgb = hit.kind === 'wrong' ? '255,150,80' : '150,255,210';
    FX.glow(g, 652, 250, 240, rgb, 0.3 * Math.exp(-a * 1.6));
    g.save();
    // ripples stay on the water: the band of pool minus the stone walkway
    g.beginPath(); g.rect(0, 372, 1280, 176);
    g.moveTo(150, 548); g.lineTo(598, 404); g.lineTo(762, 408); g.lineTo(472, 548); g.closePath();
    g.clip('evenodd');
    for (let i = 0; i < 4; i++) {
      const k = a - i * 0.45; if (k < 0) continue;
      const r = 95 + k * 170, fade = Math.max(0, 1 - r / 760);
      g.strokeStyle = `rgba(${rgb},${0.55 * fade})`; g.lineWidth = 2.5 * fade + 0.5;
      g.beginPath(); g.ellipse(652, 414, r, r * 0.16, 0, 0, Math.PI * 2); g.stroke();
    }
    g.restore();
  };
  S.drawMarks = function (g, t) {
    // six painted marks on the pillar; the ones under water glow
    // chiselled tide marks wrapping round the pillar, numbered in Roman; the
    // ones under water glow
    const NUM = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    g.font = "700 13px 'Cinzel', serif"; g.textAlign = 'center';
    for (let k = 1; k <= 6; k++) {
      const y = 568 - k * 46, on = (F().water || 0) >= k;
      const arc = (dy, col, w) => {
        g.strokeStyle = col;
        g.lineWidth = w;
        g.beginPath();
        g.moveTo(1034, y + dy);
        g.quadraticCurveTo(1080, y + 10 + dy, 1140, y + 2 + dy);
        g.stroke();
      };
      if (on) { arc(0, `rgba(140,255,200,${0.7 + 0.2 * Math.sin(t * 6 + k)})`, 3); FX.glow(g, 1071, y + 4, 46, '120,255,180', 0.12); }
      else { arc(1.6, 'rgba(255,236,200,0.32)', 2.2); arc(0, 'rgba(18,12,6,0.75)', 2.6); }   // groove: dark cut, lit lower lip
      if (!on) { g.fillStyle = 'rgba(255,236,200,0.3)'; g.fillText(NUM[k - 1], 1023.8, y + 5.2); }
      g.fillStyle = on ? 'rgba(200,255,225,0.95)' : 'rgba(18,12,6,0.8)'; g.fillText(NUM[k - 1], 1023, y + 4);
    }
    g.textAlign = 'left';
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
      g.fillStyle = 'rgba(220,255,235,0.7)';
      g.beginPath();
      g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.25 - Math.abs(Math.sin(t * 6 + i)) * 10, 2.5, 0, 7);
      g.fill();
    }
    g.restore();
  };
  // ---------------------------------------------------------------- the living water
  // Water that moves like something alive. Its shapes (an arm with a grasping hand, a crest, a ring of
  // rising tongues) come from the silhouettes in art/layers/water_*.webp; only their outline is used. What
  // fills them is drawn here, like the pool itself: the cistern seen through it, bent; dark green deep down,
  // lighter where it's thin; light running up it; a glow; spray and drops. S.living(kind, opts) starts one
  // movement and resolves when it's done (a 'follow' one runs until L.stop is set):
  //   'stir'   he calls it after the first note: arms rise toward the bell, hesitate, and slump back
  //   'surge'  he rides it along the walkway: a swell under his feet that follows him (opts.actor)
  //   'throw'  "Gladly.": a crest rises under Inês and flings her into the pool
  //   'ankles' "Take him!": small arms climb out on both sides of the walkway to Alan's feet, shiver, stop
  //   'drag'   arms come out of the pool for Lacerda and pull him off the walkway (opts.actor)
  //   'whirl'  the ring and a whirlpool where he went in, turning, until it has all of him
  const WIMG = {}; ['water_arm', 'water_crest', 'water_vortex'].forEach(n => { const i = new Image(); i.src = 'art/layers/' + n + '.webp'; WIMG[n] = i; });
  const living = [];
  const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);
  S.living = function (kind, o = {}) {
    const now = performance.now() / 1000, slow = window.FAST ? 0.05 : 1;
    const L = { kind, t0: now, dur: (o.dur || ({ stir: 4.2, surge: 1, throw: 2.2, ankles: 4.6, drag: 2.4, whirl: 6 })[kind]) * slow, x: o.x || 650, y: o.y || 430, actor: o.actor, follow: kind === 'surge', drops: [] };
    if (kind === 'stir') L.parts = [
      { img: 'water_arm', bx: 560, by: 472, s: 0.62, flip: false, rot: 0.18, lag: 0.05 },
      { img: 'water_arm', bx: 760, by: 468, s: 0.7, flip: true, rot: -0.2, lag: 0 },
      { img: 'water_arm', bx: 660, by: 486, s: 0.5, flip: false, rot: 0.05, lag: 0.12 }];
    else if (kind === 'surge') L.parts = [{ img: 'water_crest', bx: 0, by: 0, s: 0.42, flip: false, lag: 0, crest: true, ride: true }];
    else if (kind === 'throw') L.parts = [
      { img: 'water_crest', bx: L.x - 30, by: L.y + 40, s: 0.62, flip: false, lag: 0, crest: true },
      { img: 'water_arm', bx: L.x + 70, by: L.y + 44, s: 0.45, flip: true, rot: -0.35, lag: 0.1 }];
    else if (kind === 'ankles') L.parts = [
      { img: 'water_arm', bx: L.x - 70, by: L.y + 52, s: 0.3, flip: false, rot: 0.55, lag: 0 },
      { img: 'water_arm', bx: L.x + 60, by: L.y + 48, s: 0.32, flip: true, rot: -0.5, lag: 0.08 },
      { img: 'water_arm', bx: L.x - 150, by: L.y + 92, s: 0.28, flip: false, rot: 0.7, lag: 0.16 }];
    else if (kind === 'drag') L.parts = [
      { img: 'water_arm', bx: L.x - 40, by: L.y + 40, s: 0.6, flip: true, rot: -0.75, lag: 0 },
      { img: 'water_arm', bx: L.x + 50, by: L.y + 36, s: 0.55, flip: true, rot: -0.55, lag: 0.08 },
      { img: 'water_arm', bx: L.x + 10, by: L.y + 46, s: 0.5, flip: false, rot: -0.3, lag: 0.15 }];
    else L.parts = [
      { img: 'water_vortex', bx: L.x, by: L.y + 26, s: 0.7, lag: 0, ring: true },
      { img: 'water_arm', bx: L.x - 60, by: L.y + 20, s: 0.42, flip: false, rot: 0.5, lag: 0.15 },
      { img: 'water_arm', bx: L.x + 60, by: L.y + 20, s: 0.42, flip: true, rot: -0.5, lag: 0.22 }];
    living.push(L);
    L.done = new Promise(res => { L.resolve = res; if (!L.follow) setTimeout(res, L.dur * 1000); });
    return L.follow ? L : L.done;
  };
  // the silhouette of one piece, grown to k of its height out of the surface at (bx, by), swaying in strips
  const maskPart = (c, t, P, k, sway) => {
    const im = WIMG[P.img]; if (!im || !im.complete || !im.naturalWidth || k <= 0.01) return false;
    const w = im.naturalWidth * P.s, h = im.naturalHeight * P.s, rise = h * k;
    c.save();
    c.beginPath(); c.rect(0, 0, 1280, P.by + 2); c.clip(); // nothing below the surface it climbs out of
    c.translate(P.bx, P.by); c.rotate((P.rot || 0) * k + Math.sin(t * 1.3 + P.bx) * 0.04 * sway);
    if (P.flip) c.scale(-1, 1);
    const strips = 18, sh = im.naturalHeight / strips;
    for (let i = 0; i < strips; i++) {
      const v = i / strips, y = -rise + v * h, up = 1 - v;
      const dx = (Math.sin(t * 2.6 + v * 5 + P.bx * 0.01) * 10 + Math.sin(t * 4.1 + v * 11) * 3) * up * sway * P.s * 2;
      c.drawImage(im, 0, i * sh, im.naturalWidth, sh + 1, -w / 2 + dx, y, w, h / strips + 1);
    }
    c.restore();
    return true;
  };
  // fill the silhouettes on the offscreen canvas with water, then lay it (and its glow) on the room
  let off = null, oc = null, edge = null, ec = null;
  const pourWater = (g, t, box) => {
    const [x0, y0, x1, y1] = box.map(Math.round), w = x1 - x0, h = y1 - y0; if (w < 4 || h < 4) return;
    oc.save(); oc.beginPath(); oc.rect(x0, y0, w, h); oc.clip();
    oc.globalCompositeOperation = 'source-in';
    const gr = oc.createLinearGradient(0, y1, 0, y0);
    gr.addColorStop(0, 'rgba(4,30,24,0.94)'); gr.addColorStop(0.5, 'rgba(14,78,58,0.8)'); gr.addColorStop(1, 'rgba(60,165,128,0.7)');
    oc.fillStyle = gr; oc.fillRect(x0, y0, w, h);
    oc.globalCompositeOperation = 'source-atop';
    // the cistern behind, seen through moving water: the painting, bent sideways in bands
    const bg = G.bgImage();
    if (bg) { oc.globalAlpha = 0.4; for (let y = y0; y < y1; y += 6) { const dx = Math.sin(y * 0.045 + t * 3.1) * 7 + Math.sin(y * 0.11 - t * 1.7) * 3; oc.drawImage(bg, x0 - 10, y, w + 20, 6, x0 - 10 + dx, y, w + 20, 6); } oc.globalAlpha = 1; }
    // light running up it: wavy streaks climbing, and ripple bands across (only on the water itself)
    oc.globalCompositeOperation = 'source-atop';
    const r = FX.rng(31);
    for (let i = 0; i < 90; i++) {
      const sx = x0 + r() * w, len = 18 + r() * 50, ph = r() * 10, sp = 60 + r() * 90;
      const sy = y1 - ((t * sp + r() * h * 3) % (h + len));
      oc.strokeStyle = `rgba(170,255,215,${0.12 + 0.12 * Math.sin(t * 3 + ph)})`; oc.lineWidth = 1.2 + r() * 1.5;
      oc.beginPath(); oc.moveTo(sx + Math.sin(sy * 0.05 + ph) * 6, sy); oc.quadraticCurveTo(sx + Math.sin(t * 2 + ph) * 10, sy - len / 2, sx + Math.sin((sy - len) * 0.05 + ph) * 6, sy - len); oc.stroke();
    }
    for (let i = 0; i < 40; i++) {
      const by = y0 + r() * h, bx = x0 + r() * w, len = 10 + r() * 34;
      oc.strokeStyle = `rgba(200,255,230,${Math.max(0, 0.1 + 0.12 * Math.sin(t * (1.5 + r() * 2) + i))})`; oc.lineWidth = 1.4;
      oc.beginPath(); oc.moveTo(bx + Math.sin(t + i) * 8, by); oc.lineTo(bx + len + Math.sin(t + i) * 8, by + Math.sin(t * 2 + i) * 2); oc.stroke();
    }
    oc.restore();
    // its edges: a dark side (the body of it) and a lit side (the torchlight catching its skin)
    const rim = (dx, dy, col, op) => {
      ec.save(); ec.clearRect(x0, y0, w, h); ec.globalCompositeOperation = 'source-over'; ec.drawImage(off, x0, y0, w, h, x0, y0, w, h);
      ec.globalCompositeOperation = 'destination-out'; ec.drawImage(off, x0, y0, w, h, x0 + dx, y0 + dy, w, h);
      ec.globalCompositeOperation = 'source-in'; ec.fillStyle = col; ec.fillRect(x0, y0, w, h); ec.restore();
      g.save(); g.globalCompositeOperation = op; g.drawImage(edge, x0, y0, w, h, x0, y0, w, h); g.restore();
    };
    g.save(); g.globalAlpha = 0.95; g.drawImage(off, x0, y0, w, h, x0, y0, w, h); g.restore();
    rim(-4, -5, 'rgba(0,18,12,0.7)', 'source-over');
    rim(3, 4, 'rgba(200,255,230,0.85)', 'lighter');
    if (!window.FAST) { g.save(); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(8px)'; g.globalAlpha = 0.16; g.drawImage(off, x0, y0, w, h, x0, y0, w, h); g.restore(); }
  };
  S.drawLiving = function (g, t) {
    if (!living.length) return;
    if (!off) { off = document.createElement('canvas'); off.width = 1280; off.height = 720; oc = off.getContext('2d'); edge = document.createElement('canvas'); edge.width = 1280; edge.height = 720; ec = edge.getContext('2d'); }
    const now = performance.now() / 1000;
    for (let li = living.length - 1; li >= 0; li--) {
      const L = living[li], u = (now - L.t0) / L.dur;
      if (L.follow ? (L.stop && now - L.stop > 0.6) : u > 1.1) { living.splice(li, 1); if (L.resolve) L.resolve(); continue; }
      oc.clearRect(0, 0, 1280, 720);
      const box = [1280, 720, 0, 0]; let any = false;
      for (const P of L.parts) {
        const v = Math.max(0, Math.min(1, (u - P.lag) / (1 - P.lag)));
        let k, sway = 1;
        if (P.ride) { const A = L.actor; P.bx = A.x - (A.dir === 'w' ? -30 : 30); P.by = A.y + 6; P.flip = A.dir === 'w'; k = Math.min(1, (now - L.t0) / 0.4) * (L.stop ? Math.max(0, 1 - (now - L.stop) / 0.6) : 1); sway = 1.6; }
        else if (L.kind === 'stir') k = ease(v / 0.4) * (1 - ease((v - 0.62) / 0.38)) * (v > 0.4 && v < 0.62 ? 0.95 + 0.05 * Math.sin(v * 60) : 1); // up, a hesitation, and down
        else if (L.kind === 'ankles') { k = ease(v / 0.45) * (1 - ease((v - 0.8) / 0.2)); sway = v > 0.45 && v < 0.8 ? 1.8 : 1; } // it shivers at his feet
        else if (L.kind === 'throw') { k = ease(v / 0.3) * (1 - ease((v - 0.5) / 0.5)); sway = 1.4; }
        else if (L.kind === 'drag') { k = ease(v / 0.3) * (1 - ease((v - 0.6) / 0.4)); sway = 1.5; if (L.actor && v > 0.3) { P.rot = Math.atan2(L.actor.x - P.bx, -(P.by - L.actor.y)) * 0.6; } }
        else { k = ease(v / 0.25) * (1 - ease((v - 0.8) / 0.2)); sway = 1.3; if (P.ring) P.rot = Math.sin(t * 2) * 0.05; }
        if (!maskPart(oc, t, P, k, sway)) continue;
        any = true;
        const im = WIMG[P.img], hw = im.naturalWidth * P.s * 0.8, hh = im.naturalHeight * P.s * k + 40;
        box[0] = Math.min(box[0], P.bx - hw - 30); box[2] = Math.max(box[2], P.bx + hw + 30); box[1] = Math.min(box[1], P.by - hh - 30); box[3] = Math.max(box[3], P.by + 10);
        if (k > 0.05) {
          FX.glow(g, P.bx, P.by, 50 * P.s + 20, '120,255,190', 0.16 * k);
          for (let s2 = 0; s2 < 5; s2++) { g.fillStyle = 'rgba(210,255,235,0.6)'; g.beginPath(); g.arc(P.bx + Math.sin(t * 7 + s2 * 2 + P.bx) * 26 * P.s, P.by - Math.abs(Math.sin(t * 9 + s2 * 1.7)) * 18 * k, 1.8, 0, 7); g.fill(); }
          if (Math.random() < 0.3 * k) L.drops.push({ x: P.bx + (Math.random() - 0.5) * 60 * P.s, y: P.by - Math.random() * 200 * P.s * k, vy: -30 * Math.random(), t: now, floor: P.by });
        }
      }
      if (any) pourWater(g, t, [Math.max(0, box[0]), Math.max(0, box[1]), Math.min(1280, box[2]), Math.min(720, box[3])]);
      // the whirlpool on the surface where he went in
      if (L.kind === 'whirl') {
        const k = ease(u / 0.2) * (1 - ease((u - 0.85) / 0.15)), x = L.x, y = L.y + 18;
        g.save(); g.globalAlpha = k;
        const gr = g.createRadialGradient(x, y, 2, x, y, 120); gr.addColorStop(0, 'rgba(2,14,10,0.95)'); gr.addColorStop(0.5, 'rgba(10,50,38,0.6)'); gr.addColorStop(1, 'rgba(20,80,60,0)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 130, 30, 0, 0, 7); g.fill();
        for (let arm = 0; arm < 5; arm++) {
          g.strokeStyle = 'rgba(170,255,215,0.5)'; g.lineWidth = 2; g.beginPath();
          for (let q = 0; q <= 40; q++) { const f = q / 40, ang = arm * 1.2566 + f * 5 + t * 3.2, rr = 8 + f * 120; const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr * 0.23; q ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.stroke();
        }
        g.restore();
      }
      for (let i = L.drops.length - 1; i >= 0; i--) {
        const d = L.drops[i], a = now - d.t, y = d.y + d.vy * a + 380 * a * a;
        if (y > d.floor || a > 2) { L.drops.splice(i, 1); continue; }
        g.fillStyle = 'rgba(190,255,225,0.75)'; g.beginPath(); g.ellipse(d.x, y, 1.6, 3, 0, 0, 7); g.fill();
      }
    }
  };
  // a splash where something hits the water: a ring and a burst of drops
  const splashes = [];
  S.splashAt = (x, y, big) => { splashes.push({ x, y, t0: performance.now() / 1000, big: big ? 1.6 : 1 }); sfx(big ? 'splash_3' : 'splash', big ? 0.9 : 0.6); };
  S.drawSplashes = function (g, t) {
    const now = performance.now() / 1000;
    // Inês afloat: the water round her waist, rings spreading from her
    if (F().ines_afloat && !F().won) { const i = G.npc('ines'); if (i) {
      g.fillStyle = 'rgba(10,46,36,0.55)'; g.beginPath(); g.ellipse(i.x, i.y, 42, 8, 0, 0, 7); g.fill();
      for (let r = 0; r < 3; r++) { const k = ((t * 0.6 + r / 3) % 1); g.strokeStyle = `rgba(180,255,220,${0.45 * (1 - k)})`; g.lineWidth = 1.6; g.beginPath(); g.ellipse(i.x, i.y, 30 + k * 90, (30 + k * 90) * 0.2, 0, 0, 7); g.stroke(); }
    } }
    for (let i = splashes.length - 1; i >= 0; i--) {
      const S2 = splashes[i], a = now - S2.t0; if (a > 2.2) { splashes.splice(i, 1); continue; }
      for (let r = 0; r < 3; r++) { const k = a - r * 0.25; if (k < 0) continue; const R = (20 + k * 160) * S2.big; g.strokeStyle = `rgba(190,255,225,${0.6 * Math.max(0, 1 - k / 1.6)})`; g.lineWidth = 2; g.beginPath(); g.ellipse(S2.x, S2.y, R, R * 0.22, 0, 0, 7); g.stroke(); }
      const r2 = FX.rng(Math.floor(S2.t0 * 10));
      for (let d = 0; d < 26 * S2.big; d++) { const vx = (r2() - 0.5) * 260 * S2.big, vy = -(160 + r2() * 260) * S2.big; const x = S2.x + vx * a, y = S2.y + vy * a + 520 * a * a; if (y > S2.y + 4) continue; g.fillStyle = 'rgba(200,255,230,0.75)'; g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); }
    }
  };
  // the room shakes a little when he surges (the cistern room's sway, which the renderer applies)
  let quake = 0;
  S.quake = (sec) => { quake = performance.now() / 1000 + sec; };
  S.quakeAt = t => { const left = quake - performance.now() / 1000; return left > 0 && !window.CALM ? Math.sin(t * 47) * 0.0035 * Math.min(1, left) : 0; };
  S.drawFlood = function (g, t) {
    const w = F().water || 0; if (!w || F().won) return;
    const top = 540, front = 548 + (w / 6) * 175;
    const edge = x => front + Math.sin(t * 1.3 + x * 0.013) * 4 + Math.sin(t * 2.1 + x * 0.041) * 2.2 + Math.sin(x * 0.11 + 1.7) * 0.6;
    const shore = () => { for (let x = 1280; x >= 0; x -= 8) g.lineTo(x, edge(x)); };
    g.save();
    // the body of black-green water, shallower (lighter) toward its edge
    g.beginPath(); g.moveTo(0, top); g.lineTo(1280, top); shore(); g.closePath();
    const gr = g.createLinearGradient(0, top, 0, front + 6);
    gr.addColorStop(0, 'rgba(8,30,24,0)');
    gr.addColorStop(Math.min(0.5, 24 / (front + 6 - top)), 'rgba(8,30,24,0.84)');
    gr.addColorStop(0.7, 'rgba(18,58,44,0.64)');
    gr.addColorStop(1, 'rgba(40,96,74,0.36)');
    g.fillStyle = gr; g.fill(); g.clip();
    // torchlight and lantern glints: broken streaks drifting on the surface
    const r = FX.rng(9);
    for (let i = 0; i < 80; i++) {
      const y = top + 4 + r() * (front - top), x = (r() * 1400 + t * (6 + r() * 10)) % 1400 - 60, len = 10 + r() * 40, warm = r() < 0.35;
      const a = 0.05 + 0.12 * (0.5 + 0.5 * Math.sin(t * 2 + i));
      g.fillStyle = warm ? `rgba(255,190,110,${a})` : `rgba(170,255,215,${a * 0.8})`; g.fillRect(x, y, len, 1.3);
    }
    g.restore();
    g.save(); g.lineCap = 'round';
    // wet stone just beyond the edge
    const wet = g.createLinearGradient(0, front, 0, front + 20); wet.addColorStop(0, 'rgba(0,0,0,0.28)'); wet.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = wet; g.beginPath(); g.moveTo(0, front + 22); g.lineTo(1280, front + 22); shore(); g.closePath(); g.fill();
    // the lapping foam line, broken up
    for (const [off, a, lw] of [[0, 0.34, 2], [3, 0.12, 4]]) {
      g.strokeStyle = `rgba(190,255,225,${a})`; g.lineWidth = lw; g.beginPath();
      for (let x = 0; x <= 1280; x += 6) {
        const y = edge(x) - off;
        if (Math.sin(x * 0.071 + t * 1.5) + Math.sin(x * 0.023 + 2.1) * 0.9 + Math.sin(x * 0.17) * 0.4 > -0.5) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.stroke();
    }
    g.restore();
  };
  // Inês calls out the next step if the player hesitates for 20 seconds (10 once the water has
  // reached the top twice: the restarts count, the water's rules don't change)
  let lastAct = 0, hinted = 0;
  S.idleHint = function (t) {
    if (G.isBusy || F().won || !F().finaleIntro || S.dead) { lastAct = t; return; }
    const wait = (F().cistern_floods || 0) >= 2 ? 10 : 20;
    if (t - lastAct > wait && t - hinted > wait) { hinted = t; lastAct = t; G.busy(() => say(S.cisternHint())); }
  };
  S.cisternHint = () => !F().ines_free ? 'ines_hint_free' : !F().bell_lit ? 'ines_hint_light' : !F().blood ? 'ines_hint_blood' : 'ines_hint_lastfirst';
  const raise = async (n) => {
    F().water = Math.min(6, (F().water || 0) + n); sfx('water_rise', 0.55 + F().water * 0.06, 1.05 - F().water * 0.04);
    if (F().water >= 6) { await G.wait(window.FAST ? 20 : 600); await S.cisternDeath(true); return true; }
    return false;
  };
  // the ledger: Lacerda has no use for it (he wrote the rite Joaquim was hiding from)
  S.giveLedger = async function () {
    G.takeItem('ledger');
    await say('lacerda_toss');
    sfx('splash', 0.5);
  };
  S.cutRopes = async function () {
    if (F().ines_free) return S.done();
    const ines = G.npc('ines');
    // he doesn't mind: he believes the water is his
    if (!F().lamp_ok) { F().lamp_ok = true; await say('alan_ask_lamp', 'lacerda_lamp_ok'); }
    G.player.pose = 'reach'; sfx('rope_cut');
    await G.wait(window.FAST ? 20 : 700); G.player.pose = null;
    F().ines_free = true; ines.set = null; ines.pose = 'wrists'; ines.def.fixedDir = false;
    await say('ines_free', 'alan_cat');
    await say('ines_whisper'); // Bastos's rule: the sea obeys the hand on the bell
    ines.pose = null;
  };
  // Inês takes the lamp out along the walkway, close to the bell
  const LAMP_SPOT = [462, 482]; // mid-walkway (its curbs are at x 377 and 510 here)
  S.giveLantern = async function () {
    if (!F().ines_free) return say('ines_hint_free');
    if (F().bell_lit) return S.done();
    G.takeItem('lantern'); F().has_lantern = false;
    const ines = G.npc('ines'); ines.set = 'lantern'; ines.def.fixedDir = false;
    await say('ines_lantern');
    await G.busy(async () => {
      if (ines.y > 570) await ines.walkTo(330, 600);
      await ines.walkTo(272, 556); await ines.walkTo(LAMP_SPOT[0], LAMP_SPOT[1]);
      ines.dir = 'e';
    });
    F().bell_lit = true; Sound.refreshMusic();
    await say('narr_bell_lit');
  };
  S.cutPalm = async function () {
    if (F().blood) return S.done();
    if (!G.has('tongue')) return say('alan_fail_06');
    G.player.pose = 'cut'; sfx('knife');
    await say('ines_no', 'alan_papercut'); // (no score: she's terrified)
    G.player.pose = null; F().blood = true; G.renderInv();
  };
  S.toPlatform = async function () {
    const p = G.player;
    if (p.y < 470) return;
    await p.walkTo(272, 556); await p.walkTo(CAUSEWAY_END[0], CAUSEWAY_END[1]); await p.walkTo(PLATFORM[0], PLATFORM[1]);
    p.dir = 'w';
  };
  // the race: where Lacerda stands on his way to the hand on the bell (0 his step by the water;
  // 1 the foot of the walkway; 2 at Inês and her lantern; 3 up the walkway; 4 at the platform: too late)
  const STAGES = [null, [272, 556], [420, 500], [548, 446], CAUSEWAY_END];
  const RACE_GAP = 25; // seconds he gives Alan between notes before he gains a stage on his own
  let raceAt = 0;
  // he doesn't walk: he rides a swell of the water along the walkway, robe flying, and the room shakes
  S.surgeTo = async function (lac, x, y) {
    lac.def.fixedDir = false; lac.dir = x < lac.x ? 'w' : 'e';
    lac.pose = window.SPRITES.robe_surge ? 'surge' : 'command';
    const L = S.living('surge', { actor: lac }); S.quake(1.4); sfx('water_rise', 0.9, 0.8);
    const x0 = lac.x, y0 = lac.y, dur = window.FAST ? 40 : Math.max(900, Math.hypot(x - x0, y - y0) * 3);
    const t0 = performance.now();
    await new Promise(res => { const step = () => { const k = Math.min(1, (performance.now() - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; lac.x = x0 + (x - x0) * e; lac.y = y0 + (y - y0) * e; if (k < 1) requestAnimationFrame(step); else res(); }; step(); });
    L.stop = performance.now() / 1000; lac.pose = 'command';
    await G.wait(window.FAST ? 20 : 500); lac.pose = null;
  };
  S.lacAdvance = async function (to) {
    const lac = G.npc('lacerda'); if (!lac || S.dead) return;
    F().lac_stage = Math.max(F().lac_stage || 0, to);
    const [x, y] = STAGES[F().lac_stage];
    await S.surgeTo(lac, x, y);
    if (F().lac_stage >= 4 && F().strikes < 4) return S.cisternDeath(true); // he has the hand
  };
  // "Gladly.": the water flings Inês off the walkway into the pool, where she stays afloat with the lantern up
  const FLOAT_AT = [300, 452]; // the water behind the walkway, upper left
  S.throwInes = async function () {
    const ines = G.npc('ines'); if (!ines) return;
    await G.ensure(['spr:ines_block', 'spr:ines_float']);
    ines.def.fixedDir = false; ines.pose = 'block';
    const x0 = ines.x, y0 = ines.y, [x1, y1] = FLOAT_AT, dur = window.FAST ? 40 : 1100, t0 = performance.now();
    sfx('water_rise', 0.9);
    await new Promise(res => { const step = () => { const k = Math.min(1, (performance.now() - t0) / dur); ines.x = x0 + (x1 - x0) * k; ines.y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 150; if (k < 1) requestAnimationFrame(step); else res(); }; step(); });
    S.splashAt(x1, y1, true);
    F().ines_afloat = true; ines.pose = window.SPRITES.ines_float ? 'float' : null; ines.dir = 'e';
  };
  S.floatTick = function (t) { const ines = G.npc('ines'); if (ines && F().ines_afloat && !F().won) { ines.x = FLOAT_AT[0]; ines.y = FLOAT_AT[1] + Math.sin(t * 1.6) * 2.5; } };
  S.raceTick = function (t) {
    if (!F().race || F().won || S.dead || G.isBusy) { raceAt = t; return; }
    if (t - raceAt > (window.FAST ? 6 : RACE_GAP)) { raceAt = t; G.busy(() => S.lacAdvance((F().lac_stage || 0) + 1)); }
  };
  S.strike = async function (id) {
    if (!F().bell_lit) return say('alan_too_dark');
    if (!F().blood) return say('alan_need_blood');
    if (!id) return say('narr_bell_lit');
    await S.toPlatform();
    const p = G.player; p.pose = 'ring';
    await G.wait(window.FAST ? 20 : 450);
    const struck = F().struck || (F().struck = []);
    const want = ORDER[struck.length];
    const PITCH = { sanches: 1.18, coutinho: 1.06, bastos: 0.94, ferreira: 0.84 };
    // every strike is a plain bell note; only after the fourth is the sound drawn back in (S.silence)
    sfx('bell_forward', 1, PITCH[id] || 1);
    if (id !== want) {
      S.bellHit('wrong'); p.pose = null; F().struck_wrong = true;
      await say('narr_wrong_strike', 'alan_wrong_strike', 'lacerda_lovely'); // the founders' order: what he wants
      return raise(2);
    }
    struck.push(id); F().strikes = (F().strikes || 0) + 1;
    S.bellHit('back'); p.pose = null;
    if (struck.length === 4) { F().race = false; await say('alan_ringback'); return S.silence(); }
    if (await raise(1)) return;
    const lac = G.npc('lacerda');
    if (struck.length === 1) {
      // Sanches first: he knows the order, and he knows what this is
      await say('alan_strike_1', 'lacerda_ferreira');
      if (lac) { lac.pose = 'command'; } sfx('water_rise', 0.8); // he calls the water; it rises, hesitates, and sinks back
      await S.living('stir');
      await say('lacerda_listening');
      if (lac) lac.pose = null;
      F().race = true; // (raceTick restarts its clock while anything is playing)
      await S.lacAdvance(1);
    } else if (struck.length === 2) {
      await S.lacAdvance(2);
      const ines = G.npc('ines');
      if (ines) { ines.dir = 'w'; ines.pose = 'block'; } // the lantern high, her arm across the walkway
      await say('ines_block');
      if (lac) lac.pose = 'command';
      const thrown = S.living('throw', { x: ines ? ines.x : 420, y: ines ? ines.y : 500 }); // a wave rises under her
      await say('lacerda_gladly');
      await S.throwInes(); // into the pool: she keeps the lantern up, and the marks stay lit
      await thrown;
      if (lac) lac.pose = null;
    } else if (struck.length === 3) {
      await S.lacAdvance(3);
      if (lac) lac.pose = 'command';
      sfx('water_rise', 0.9);
      await Promise.all([say('lacerda_take'), S.living('ankles', { x: PLATFORM[0], y: PLATFORM[1] })]); // to Alan's ankles, and it stops
      if (lac) lac.pose = null;
    }
  };
  S.cisternDeath = async function (step5) {
    S.dead = true;
    F()._flooded = !!step5;
    await G.busy(async () => {
      const lac = G.npc('lacerda');
      if (lac) { lac.set = null; lac.pose = 'lunge'; }
      Sound.cue('bell_motif'); // game over
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
    S.dead = false;
    Sound.stopVoice();
    G.showModal('death', false);
    const keep = F()._deathStep5 ? { ines_free: true, bell_lit: true, blood: true } : null;
    const floods = (F().cistern_floods || 0) + (F()._flooded ? 1 : 0); // restarts from water level 6 (survives the reload)
    const cp = G.flags._checkpoint;
    await G.loadSave(cp);
    G.flags._checkpoint = cp;
    G.flags.cistern_floods = floods;
    if (keep) {
      Object.assign(G.flags, keep, { lamp_ok: true });
      G.takeItem('ledger');
      G.takeItem('lantern');
      G.refreshNpcs(true);
      G.player.x = PLATFORM[0] - 300;
      G.player.y = 600;
      const ines = G.npc('ines');
      if (ines) { ines.x = LAMP_SPOT[0]; ines.y = LAMP_SPOT[1]; ines.dir = 'e'; ines.def.fixedDir = false; }
    }
    F().water = 0; F().strikes = 0; F().struck = []; F().race = false; F().lac_stage = 0; F().ines_afloat = false;
    await G.fade(false);
  };
  document.getElementById('btn-retry').onclick = () => S.retryCistern();

  S.silence = async function () {
    G.cutscene = true;
    const lac = G.npc('lacerda'), ines = G.npc('ines'), p = G.player;
    // he has reached the platform; the fourth note's ring is drawn back into the bronze
    if (Math.hypot(lac.x - CAUSEWAY_END[0], lac.y - CAUSEWAY_END[1]) > 8) await S.surgeTo(lac, CAUSEWAY_END[0], CAUSEWAY_END[1]);
    lac.dir = 'e';
    F().ringing = true; await G.wait(window.FAST ? 20 : 700);
    sfx('bell_drawn_in'); S.bellHit('back'); setTimeout(() => sfx('fog_lift'), window.FAST ? 10 : 8600);
    await say('narr_ring');
    lac.pose = 'grab'; // he has Alan's arm
    await say('lacerda_come'); // the water doesn't answer him any more
    lac.pose = 'realise';
    await G.say('narr_renounce', { offscreen: true });
    // the water comes out of the pool for him, pulls him off the walkway, and the pool closes and turns over him
    const POOL = [820, 482];
    const drag = S.living('drag', { x: POOL[0], y: POOL[1], actor: lac });
    sfx('water_rise');
    await say('alan_let_go'); // he doesn't
    lac.pose = 'terror'; lac.def.fixedDir = false;
    { const x0 = lac.x, y0 = lac.y, dur = window.FAST ? 40 : 1300, t0 = performance.now();
      await new Promise(res => { const step = () => { const k = Math.min(1, (performance.now() - t0) / dur), e = k * k; lac.x = x0 + (POOL[0] - x0) * e; lac.y = y0 + (POOL[1] - y0) * e - Math.sin(k * Math.PI) * 60; if (k < 1) requestAnimationFrame(step); else res(); }; step(); }); }
    S.splashAt(POOL[0], POOL[1], true); S.quake(0.8);
    lac.sink = 0.4; // in to the chest
    const x1 = lac.x, y1 = lac.y;
    vortex = { x: x1, y: y1 + 2, t0: performance.now() };
    const take = S.living('whirl', { x: x1, y: y1 });
    const sinking = (async () => {
      await G.wait(window.FAST ? 20 : 1200);
      for (let k = 0.4; k <= 1.0001; k += window.FAST ? 0.3 : 0.0035) { lac.sink = k; lac.x = x1 + Math.sin(k * 14) * 6 * (1 - k); await G.wait(16); } // turned round once, twice, and under
      lac.visible = false; sfx('splash', 0.5); vortex.end = performance.now();
    })();
    await say('narr_end_1');
    await sinking; await take; await drag;
    F().sinkAt = [x1, y1];
    await G.wait(window.FAST ? 20 : 900);
    // the water lets go of everything else
    F().ringing = false; F().sinkAt = null;
    for (let w = F().water || 0; w > 0; w -= window.FAST ? 6 : 0.05) { F().water = Math.max(0, w); await G.wait(16); }
    F().water = 0;
    Sound.ambience(null); Sound.cue('silence', { sticky: true, xf: 1.2 });
    setTimeout(() => Sound.cue({ id: 'main_theme', fadeIn: 6 }, { sticky: true }), window.FAST ? 30 : 6200); // five seconds of nothing, then the theme
    await say('narr_silence');
    F().won = true;
    await say('narr_still');
    ines.set = null; ines.def.fixedDir = false;
    if (F().ines_afloat) { F().ines_afloat = false; S.splashAt(ines.x, ines.y); ines.pose = null; ines.x = 250; ines.y = 560; } // she hauls herself out at the foot of the steps
    if (p.y < 470) await p.walkTo(CAUSEWAY_END[0], CAUSEWAY_END[1]);
    await p.walkTo(272, 556); await p.walkTo(420, 640);
    if (ines.y < 560) await ines.walkTo(300, 566);
    await ines.walkTo(p.x + 140, p.y + 4); ines.dir = 'w'; p.dir = 'e';
    await say('ines_end', 'alan_end', 'gag_ines_2', 'gag_alan_ines_2');
    G.cutscene = false;
    await S.dawn();
  };

  // ================================================================ DAWN & EPILOGUE
  S.dawn = async function () {
    if (S.transition) await S.transition(5, { toBlack: true }); // end of chapter V: the paintings (js/story/transitions.js)
    await G.fade(true);
    F().dawn = true;
    await G.goRoom('convent', 'map', { instant: true, noEnter: true, noSave: true, pos: [880, 650, 'w'] });
    Sound.cue('main_theme', { sticky: true }); // (already up since the silence: it carries on)
    const tm = G.npc('tomas'); if (tm) { tm.loop = null; tm.pose = 'kneel'; tm.x = 560; tm.y = 600; }
    await G.fade(false);
    await joke('alan_dawn');
    await S.epilogue();
  };
  S.epilogue = async function () {
    G.cutscene = true;
    // each painting dips to black and opens on the next: never a glimpse of the room behind
    const shot = (name, fallback, fn, opts) => (async () => {
      await G.fade(true);
      await S.still(name, fallback, async () => { await G.fade(false); await fn(); }, Object.assign({}, opts, { keep: true }));
    })();
    await shot('still_city_morning', 'street', async () => { await say('narr_epilogue'); await say('narr_epi_city_2'); }, { zoom: [1.0, 1.12], pan: [[0.5, 0.55], [0.5, 0.45]] });
    await shot('still_drawer', 'police', async () => { await say('narr_epi_drawer'); sfx('drawer_scrape'); await say('rui_click'); }, { zoom: [1.08, 1.0] });
    await shot('still_shop_after', 'shop', () => say('narr_epi_shop2') /* the brass weight is gone from the game */, { zoom: [1.0, 1.1], captionTop: true });
    if (F().amalia_box && F().rui_called) await shot('still_amalia_box', 'tavern', () => say('narr_vig_box'), { zoom: [1.04, 1.12] });
    if (F().amalia_night) {
      Sound.cue('tavern_day', { sticky: true });
      await shot('still_tavern_full', 'tavern', () => say('narr_vig_night'), { zoom: [1.0, 1.1] });
      Sound.cue('main_theme', { sticky: true });
    } // the taberna full again: its busy tune
    await shot('still_quay_sweater', 'cais', () => say('narr_vig_ze'), { zoom: [1.0, 1.1] });
    Sound.cue('silence', { sticky: true, xf: 3 }); // the post-credits pictures: silence, then the clock
    // (Zé and Lacerda's jacket in his net: cut, at the author's request)
    if (F().founder_order && !(F().struck_wrong)) await shot('still_abilio_ring', 'se_tower', async () => { sfx('bell_forward', 0.6); await say('narr_vig_abilio'); }, { zoom: [1.0, 1.12] });
    await shot('still_shelf', 'antiques', async () => {
      sfx('clock_chime', 0.6);
      await say('narr_post');
      sfx('tideclock_tick', 0.5);
      await G.wait(window.FAST ? 20 : 2500);
    }, { zoom: [1.0, 1.15] });
    // the last picture: Alan rings his mother. Then the end.
    Sound.cue('main_theme', { sticky: true });
    await shot('still_phone', 'shop', async () => {
      sfx('phone_dial_long', 0.6);
      await G.wait(window.FAST ? 20 : 2000);
      sfx('phone_ring_distant', 0.5);
      await G.wait(window.FAST ? 20 : 2500);
      await say('narr_call');
      await G.wait(window.FAST ? 20 : 1500);
    }, { zoom: [1.0, 1.08] });
    if (S.thursday) await S.thursday(); // Thursday morning, the cloister
    Sound.cue('main_theme', { sticky: true }); // the credits
    await G.fade(true);
    G.showModal('ending', true);
    await G.fade(false);
    G.cutscene = false;
    try { localStorage.removeItem('drowned-bell-save-v3'); localStorage.removeItem('drowned-bell-save-v3-manual'); } catch (e) { /* ignore */ }
  };
  document.getElementById('btn-again').onclick = () => location.reload();
})();
