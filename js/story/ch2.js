// Chapter II — The Unexplained Drawer: lavadouro, Relojoaria Ferreira.
(function () {
  const { G, F, say, ROOMS, posed, joke, give, sfx } = window.S;

  // ================================================================ LAVADOURO
  ROOMS.lavadouro = {
    name: 'Lavadouro do Alfama', bg: 'lavadouro', music: 'lavadouro', ambience: 'washhouse', floor: 'wet',
    fog: 0.18, fogRGB: '225,228,228',
    walk: [[0, 508], [836, 505], [836, 692], [1280, 702], [1280, 716], [0, 716]], // stops at the stone basin
    scale: [505, 218, 716, 440],
    light: { ambient: 'rgb(205,210,210)', base: 0.86, rim: 'rgba(220,228,235,0.2)', rimSide: 1 },
    lights: [
      { x: 725, y: 78, rgb: '255,215,150', kind: 'gas', seed: 4, glow: 80, ga: 0.22, power: 0.35, reach: 700, floor: [725, 520], height: 600 },
      { x: 700, y: 240, rgb: '220,226,232', power: 0.3, reach: 1100, rim: 0.5, shadow: 0.5, floor: [700, 480], height: 800 }, // fog light through the arches
    ],
    entries: { default: [120, 640, 'e'], map: [120, 640, 'e'] },
    anim(g, t) {
      S.drawWring(g, t); // behind the two of them: their hands hold it
      for (const [x, w] of [[220, 160], [420, 170], [640, 170], [860, 150]]) FX.wisps(g, t + x, x + w / 2, 395, { n: 4, rise: 110, spread: 40, a: 0.07, size: 30, speed: 0.12 }); // steam off the basins
      FX.wisps(g, t, 1040, 470, { n: 4, rise: 90, spread: 30, a: 0.06, size: 26, speed: 0.1 });
      FX.drips(g, t, [[1222, 470, 412, 2.6]], '220,235,240');
    },
    animFg(g, t) { S.drawSplash(g, t); },
    animBack(g, t) {
      const im = G.bgImage();
      [[20, 10, 95, 260, 0], [125, 30, 70, 240, 1.4], [205, 50, 60, 200, 2.3], [395, 60, 50, 170, 0.8]].forEach(([x, y, w, h, ph]) => FX.sway(g, im, [x, y, w, h], t, 1.2, ph));
      g.save(); g.beginPath(); g.rect(460, 120, 540, 230); g.clip();
      FX.birds(g, t + 3, { y0: 150, y1: 260, n: 3, period: 16, color: 'rgba(80,82,88,0.55)', size: 8, x0: 440, x1: 1020 });
      g.restore();
    },
    // the back basins stand in front of the washerwomen
    occluders: [{ y: 500, polys: [[[160, 383], [300, 375], [1068, 375], [1068, 484], [160, 484]]] }, // from the far edge of the water: they stand behind the basins, hands in
      { y: 680, when: () => !swimmer, polys: [[[839, 453], [1011, 446], [1160, 452], [1280, 470], [1280, 680], [874, 680], [860, 650], [842, 600]]] }], // the big tank and its towel (the basket is gone: Alan washes in that corner)
    npcs: [
      { id: 'celeste', x: 600, y: 610, dir: 'e', set: 'wring', when: () => F().ch < 4, name: 'Dona Celeste', look: 'narr_look_celeste', talk: () => S.talkCeleste(),
        items: { sketch: () => S.celesteTile(), notebook: () => S.celesteTile(), file55: () => S.celeste1955(), any: 'alan_fail_06' } },
    ],
    ambient: [
      { id: 'npc_washer1', name: 'Washerwoman', x: 300, y: 484, h: 205, look: 'alan_npc_washers', idleHold: [5, 11], variantHold: [2.4, 4.5], talk: () => S.washersBath(),
        // scrubbing; now and then a rest, a wring, or the big overhead wring (lifted up and brought down again)
        frames: ['npc_washer1', 'npc_washer1_scrub2', 'npc_washer1_wring', 'npc_washer1_rest', ['npc_washer1_wring', 'npc_washer1_lift', 'npc_washer1_b', 'npc_washer1_lift', 'npc_washer1_wring']],
        talkFrames: ['npc_washer1_giggle', 'npc_washer1_laugh', 'npc_washer1_gossip'], poses: { howl: 'npc_washer1_howl', peek: 'npc_washer1_peek' } },
      { id: 'npc_laundry', name: 'Woman with the washing', x: 175, y: 560, h: 236, look: 'alan_npc_laundry', talk: () => S.laundryTalk(), idleHold: [5, 10], variantHold: [2.5, 4.5], // under the hanging sheets
        frames: ['npc_laundry', 'npc_laundry_peg', 'npc_laundry_shake', 'npc_laundry_glance', ['npc_laundry_shake', 'npc_laundry_peg', 'npc_laundry']],
        talkFrames: ['npc_laundry_talk1', 'npc_laundry_talk2', 'npc_laundry_talk3'], poses: { sniff: 'npc_laundry_sniff', mutter: 'npc_laundry_mutter', smirk: 'npc_laundry_smirk' } },
      { id: 'npc_washer2', name: 'Graça', x: 500, y: 476, h: 196, look: 'alan_npc_washers', idleHold: [6, 12], variantHold: [2.4, 4.5], talk: () => S.washersBath(),
        frames: ['npc_washer2', 'npc_washer2_scrub2', 'npc_washer2_slap', 'npc_washer2_b', 'npc_washer2_wring', 'npc_washer2_hips'],
        talkFrames: ['npc_washer2_cackle', 'npc_washer2_beckon', 'npc_washer2_giggle'], poses: { wheeze: 'npc_washer2_wheeze', wink: 'npc_washer2_wink' } },
    ],
    hotspots: [
      { name: 'Wash basins', rect: [160, 372, 908, 112], look: 'narr_look_basins' },
      { name: 'Wet sheets', rect: [0, 0, 520, 300], look: 'narr_look_sheets' },
      { name: 'Arches', rect: [416, 128, 588, 240], look: 'narr_look_lav_arches' },
      { name: "Celeste's sheet", rect: [843, 448, 437, 230], at: [780, 640], face: 'e', look: 'narr_look_sheets', use: () => S.wringSheet(), take: () => S.wringSheet() },
      // easter egg: once Celeste knows him, the rinsing tank is fair game
      { name: 'Rinsing tank', rect: [880, 438, 400, 52], at: [800, 640], face: 'e', when: () => F().met_celeste && F().ch < 4, look: 'narr_look_basins', use: () => S.bathEgg() },
      { name: 'Way out', rect: [0, 560, 60, 156], at: [30, 660], exit: 'map', entry: 'lavadouro' },
    ],
    async enter() { if (!F().lav_entered) { F().lav_entered = true; await say('alan_enter_lavadouro'); } },
  };
  // ---------------------------------------------------------------- easter egg: Alan takes a bath
  let splash = null, shorts = null, swimmer = null;
  const WASH = { x: 1075, y: 503, h: 380 }; // in the tank, right of the towel: the waterline and his full standing height
  // his black trunks, flung over his shoulder: an arc, a spin, a heap on the stones
  S.drawShorts = function (g) {
    if (!shorts) return;
    const k = Math.min(1, (performance.now() - shorts.t0) / 700);
    const x = shorts.x0 + (shorts.x1 - shorts.x0) * k, y = shorts.y0 + (shorts.y1 - shorts.y0) * k - Math.sin(k * Math.PI) * 140;
    g.save(); g.translate(x, y); g.rotate(k < 1 ? k * 9 : 0.3); g.scale(1, k < 1 ? 1 : 0.55);
    g.fillStyle = '#1d1b1c'; g.fillRect(-14, -10, 28, 20);
    g.fillStyle = '#34312f'; g.fillRect(-14, -10, 28, 4); // waistband
    g.strokeStyle = 'rgba(120,110,100,0.5)'; g.lineWidth = 1; g.strokeRect(-14, -10, 28, 20);
    g.restore();
  };
  // ripples where he swims, drawn over the cut of the swimming frames
  S.drawSwimWater = function (g, t) {
    if (!swimmer) return;
    const p = G.player, x = p.x, y = swimmer.y;
    g.save();
    g.fillStyle = 'rgba(70,82,78,0.35)'; g.beginPath(); g.ellipse(x, y + 2, 85, 7, 0, 0, 7); g.fill();
    for (let r = 0; r < 3; r++) {
      const k = ((t * 0.7 + r / 3) % 1);
      g.strokeStyle = `rgba(200,212,210,${0.28 * (1 - k)})`; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(x, y + 1, 60 + 90 * k, 6 + 9 * k, 0, 0, 7); g.stroke();
    }
    g.restore();
  };
  S.drawSplash = function (g, t) {
    S.drawShorts(g); S.drawSwimWater(g, t);
    if (!splash) return;
    const k = (performance.now() - splash.t0) / 1400;
    if (k > 1) { splash = null; return; }
    g.save();
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI, sp = 0.6 + (i * 37 % 10) / 14, r = 160 * sp * k;
      const x = splash.x + Math.cos(a) * r, y = splash.y - Math.sin(a) * r * 1.4 + 260 * k * k;
      g.fillStyle = `rgba(220,235,240,${0.8 * (1 - k)})`; g.beginPath(); g.arc(x, y, 5 + 4 * (1 - k), 0, 7); g.fill();
    }
    g.strokeStyle = `rgba(230,240,245,${0.7 * (1 - k)})`; g.lineWidth = 3;
    for (let r = 0; r < 3; r++) {
      g.beginPath();
      g.ellipse(splash.x, splash.y + 6, 40 + 200 * k * (1 + r * 0.4), 10 + 30 * k * (1 + r * 0.4), 0, 0, 7);
      g.stroke();
    }
    g.restore();
  };
  // after the bath, the two at the back basins have seen everything
  // the washhouse gossip: each line in its own face, and the other woman laughing along
  Object.assign(S.LINE_POSE, { washer1_bath_2: ['npc_washer1', 'howl'], washer2_bath_2: ['npc_washer2', 'wheeze'] });
  Object.assign(S.REACT, {
    washer1_bath_1: [['npc_washer2', 'npc_washer2_cackle']],
    washer2_bath_1: [['npc_washer1', 'npc_washer1_laugh']],
    alan_washers_1: [['npc_washer1', 'npc_washer1_peek'], ['npc_washer2', 'npc_washer2_wink']],
    alan_washers_2: [['npc_washer1', 'npc_washer1_giggle'], ['npc_washer2', 'npc_washer2_giggle']],
    washer2_bath_3: [['npc_washer1', 'npc_washer1_giggle']],
  });
  S.washersBath = async function () {
    if (!F().bathed) return say('alan_npc_busy');
    if (F().washers_teased) return say('washer2_bath_3');
    F().washers_teased = true;
    const p = G.player;
    await say('washer1_bath_1', 'washer2_bath_1');
    p.pose = 'wink'; await say('alan_washers_1'); p.pose = null;
    await say('washer1_bath_2', 'washer2_bath_2');
    p.pose = 'fluster'; await say('alan_washers_2'); p.pose = null;
  };
  S.bathEgg = async function () {
    const p = G.player, c = G.npc('celeste'), T = ms => G.wait(window.FAST ? 20 : ms);
    if (F().bathed) return say('alan_bath_3');
    await G.busy(async () => {
      await say('alan_bath_1');
      p.dir = 'e';
      // a pose only if its painting exists (each one dissolves into the next)
      const has = k => !!window.SPRITES[S.CHARS.alan.frames.poses[k] || k];
      const pose = async (k, ms) => { if (!has(k)) return false; p.pose = k; if (ms) await T(ms); return true; };
      const hop = async (dx, n, ms) => { for (let i = 0; i < n; i++) { p.x += dx; await T(ms); } };
      // the women at the basins see what he's up to: a shocked face each, from the first button
      const SHOCK = [['npc_washer1', 'npc_washer1_shock'], ['npc_washer2', 'npc_washer2_shock'], ['npc_laundry', 'npc_laundry_shock'], ['celeste', 'celeste_shock']];
      const shocked = on => {
        for (const [id, k] of SHOCK) {
          const w = G.npc(id);
          if (w && w.visible && window.SPRITES[k]) { if (on && id === 'celeste') w.set = null; w.pose = on ? k : null; }
        }
      };
      // jacket, tee, boots, belt, jeans, down to the trunks
      sfx('sheet_slap', 0.25); await pose('undress1', 850);               // the jacket slides off the shoulders
      shocked(true);
      if (!(await pose('undress1b', 750))) await pose('alan_dress4', 750); // ...and over one shoulder
      await pose('undress2a', 650);                                       // the tee comes up
      p.pose = 'undress2'; sfx('sheet_slap', 0.3); await T(950);          // tee over the head
      if (await pose('undress2b', 0)) { sfx('sheet_slap', 0.2); await T(750); } // ...and off, swung aside
      if (await pose('ubelt', 0)) { sfx('sheet_slap', 0.2); await T(850); } // the belt, with a flourish
      if (await pose('uboot', 0)) await hop(4, 4, 170);                   // hopping out of the boots
      await pose('unbutton', 700);                                        // the top button
      await pose('ujeans', 750);                                          // jeans down to the knees
      p.pose = 'undress3'; await hop(6, 4, 160);                          // stepping out of the jeans
      p.pose = 'undress4'; await T(1100);                                 // trunks: a flex and a wink
      // the jacket comes round to the front and the trunks come off behind it
      if (await pose('tdown', 0)) { await T(750); await pose('tstep', 650); }
      // the jacket comes round to the front and the trunks go over his shoulder
      if (!(await pose('fling', 0))) p.pose = 'jacket';
      await T(250);
      shorts = { x0: p.x - 10, y0: p.y - 190, x1: p.x - 150, y1: p.y - 4, t0: performance.now() }; sfx('sheet_slap', 0.2);
      await T(700);
      p.pose = 'jacket'; await T(500);                                    // a glance back over his shoulder
      if (c) { c.dir = c.x < p.x ? 'e' : 'w'; c.set = null; c.pose = 'shout'; }
      // Full content only: at her shriek the jacket slips and his hands do the job
      const cheeky = !S.discreet();
      if (cheeky && has('hands')) { p.pose = 'hands'; sfx('sheet_slap', 0.15); }
      await say('celeste_bath_1');
      if (c) c.pose = has('celeste_shock') ? 'celeste_shock' : null;
      await pose('jgrin', 700);                                           // jacket snatched back up, re-adjusted
      if (!(await pose('jwink', 0))) p.pose = 'jacket';
      await say('alan_bath_2');                                           // with a wink
      // the leap: a hop up and over the rim of the tank, into the corner where the basket used to stand
      const x0 = p.x, y0 = p.y, x1 = WASH.x, y1 = WASH.y;
      p.h = p.height();
      if (await pose('jcrouch', 0)) await T(380);                         // knees bent, arms back
      const arc = k => k < 0.3 && has('jrise') ? 'jrise' : k < 0.66 || !has('jfall') ? 'jump' : 'jfall';
      for (let k = 0; k <= 1.0001; k += window.FAST ? 0.5 : 0.035) {
        p.pose = arc(k);                                                  // up, tucked at the top, feet first down
        p.x = x0 + (x1 - x0) * k; p.y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 170;
        await G.wait(16);
      }
      sfx('splash'); p.visible = false; splash = { x: x1, y: y1, t0: performance.now() };
      await T(700);
      // standing in the tank, the water at his waist: washing, not swimming
      const washing = ['wash1', 'wash4', 'wash2', 'wash5', 'wash3', 'wash6'].filter(has);
      swimmer = { y: y1 }; p.x = x1; p.y = y1; p.visible = true; p.sink = 0.0001; // no floor shadow on the water
      if (!washing.length) p.pose = 'swim'; else { p.h = WASH.h; p.pose = has('wsurface') ? 'wsurface' : washing[0]; }
      if (has('wsurface')) await T(900);                                  // up for air, hair pushed back
      let on = true;
      (async () => {
        let i = 0;
        while (on) {
          if (washing.length) { p.pose = washing[i % washing.length]; if (i % washing.length === 2) sfx('splash', 0.12); await T(900); }
          else { p.pose = i % 2 ? 'swim2' : 'swim'; await T(520); }
          i++;
        }
      })();
      await say('narr_bath');
      on = false; await T(60);
      if (washing.length) p.pose = washing[0];                            // a last scoop over the shoulders
      else p.pose = 'swimwave';
      sfx('splash', 0.3);
      await T(1400);
      if (washing.length && await pose('climb', 0)) { sfx('splash', 0.2); await T(1100); } // a knee up on the rim
      await G.fade(true);
      shocked(false); if (c) c.pose = null;
      swimmer = null; shorts = null; p.sink = 0; p.h = null; p.x = 800; p.y = 650; p.dir = 'w';
      // out of the tank and back into his clothes: trunks, jeans, boots, tee, jacket
      p.pose = has('drip') ? 'drip' : 'jacket';                           // out, dripping, jacket in front
      await G.fade(false);
      await say('celeste_bath_2');
      await pose('tron', 850);                                            // into the trunks behind the jacket
      if (!(await pose('snap', 750))) { p.pose = 'undress4'; await T(750); } // trunks back on: the waistband snaps
      const dress = async (k, ms) => { if (window.SPRITES['alan_dress' + k]) { p.pose = 'alan_dress' + k; await T(ms); } };
      await dress(1, 700);                                                // jeans in hand
      if (window.SPRITES.alan_dress2) { p.pose = 'alan_dress2'; await hop(-5, 4, 140); } // hopping into them
      await pose('dboot', 750);                                           // boots
      await dress(3, 800);                                                // tee over the head
      await dress(4, 800);                                                // the jacket goes on
      await pose('dfinal', 0);                                            // collar up
      await joke('alan_bath_3');
      p.pose = null;
      F().bathed = true;
      // not everyone at the basins is laughing with him
      await T(1400);
      await S.laundryRemark();
    });
  };
  // the woman under the sheets says it loud enough to carry; Alan holds his ground, and Celeste shuts her down
  S.laundryRemark = async function () {
    const p = G.player, w = G.npc('npc_laundry'), c = G.npc('celeste');
    if (F().laundry_remark || !w || !w.visible) return;
    F().laundry_remark = true;
    await say('laundry_remark');
    await G.wait(window.FAST ? 20 : 700);
    p.dir = w.x < p.x ? 'w' : 'e';            // he doesn't turn his back: he looks right at her
    if (c && c.visible) {
      // Celeste rounds on her, loud enough for the whole washhouse
      c.dir = w.x < c.x ? 'w' : 'e'; c.set = null; c.pose = 'shout';
      await say('celeste_laundry_enough');
      c.pose = null; c.dir = p.x > c.x ? 'e' : 'w';
      await G.wait(window.FAST ? 20 : 600);
      p.dir = c.x < p.x ? 'w' : 'e';
      p.pose = 'fluster'; await G.wait(window.FAST ? 20 : 700); p.pose = null; // caught out, and grateful
      await say('alan_laundry_thanks');
    }
  };
  // the woman under the sheets: a sniff for the remark, muttering over the pegs the second time
  Object.assign(S.LINE_POSE, { laundry_remark: ['npc_laundry', 'sniff'], laundry_remark_2: ['npc_laundry', 'mutter'] });
  Object.assign(S.REACT, { washer1_bath_1: (S.REACT.washer1_bath_1 || []).concat([['npc_laundry', 'npc_laundry_glance']]), alan_washers_2: (S.REACT.alan_washers_2 || []).concat([['npc_laundry', 'npc_laundry_smirk']]) });
  S.laundryTalk = async function () {
    if (!F().bathed) return say('alan_npc_laundry');
    if (!F().laundry_remark) return S.laundryRemark();
    await say('laundry_remark_2');
  };
  // one sheet between the two of them, twisting tighter, water running out of it
  let wringing = null;
  S.drawWring = function (g, t) {
    if (!wringing) return;
    const c = G.npc('celeste'), p = G.player; if (!c || !p) return;
    const ax = c.x - 20, ay = c.y - 184, bx = p.x - 40, by = p.y - 186;
    const k = Math.min(1, (performance.now() - wringing) / 2500), len = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax);
    g.save(); g.translate(ax, ay); g.rotate(ang);
    const th = 19 - 6 * k, sag = 6; // tighter as it twists
    const cyl = g.createLinearGradient(0, -th / 2, 0, th / 2);
    cyl.addColorStop(0, '#b9b5aa');
    cyl.addColorStop(0.35, '#f6f3ea');
    cyl.addColorStop(0.7, '#d9d4c8');
    cyl.addColorStop(1, '#8f8a80');
    g.fillStyle = cyl; g.strokeStyle = 'rgba(60,55,50,0.45)'; g.lineWidth = 1;
    g.beginPath();
    g.moveTo(-4, -th / 2);
    g.quadraticCurveTo(len / 2, -th / 2 + sag, len + 4, -th / 2);
    g.quadraticCurveTo(len + 10, 0, len + 4, th / 2);
    g.quadraticCurveTo(len / 2, th / 2 + sag, -4, th / 2);
    g.quadraticCurveTo(-10, 0, -4, -th / 2);
    g.closePath();
    g.fill();
    g.stroke();
    // the twist: diagonal folds that run along the sheet as it turns
    g.save(); g.clip();
    const pitch = 15 - 6 * k, off = (t * 40) % pitch;
    for (let x = -pitch + off; x < len + pitch; x += pitch) {
      g.strokeStyle = 'rgba(110,104,95,0.45)';
      g.lineWidth = 2.4;
      g.beginPath();
      g.moveTo(x, -th);
      g.quadraticCurveTo(x + th * 0.3, 0, x + th * 0.8, th);
      g.stroke();
      g.strokeStyle = 'rgba(255,255,255,0.55)';
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(x + 3, -th);
      g.quadraticCurveTo(x + 3 + th * 0.3, 0, x + 3 + th * 0.8, th);
      g.stroke();
    }
    g.restore();
    // drips
    g.fillStyle = 'rgba(200,220,235,0.85)';
    for (let i = 0; i < 6; i++) {
      const u = ((i * 0.37 + t * 0.9 + i * 0.13) % 1);
      const x = len * (0.15 + 0.12 * i);
      g.beginPath();
      g.ellipse(x, th / 2 + u * 120, 1.6, 3, 0, 0, 7);
      g.globalAlpha = 1 - u;
      g.fill();
    }
    g.restore();
  };
  S.wringSheet = async function () {
    if (F().met_celeste) return say('alan_fail_04');
    const c = G.npc('celeste'), p = G.player;
    const W = ['pair_wring_1', 'pair_wring_2', 'pair_wring_3', 'pair_wring_2'];
    if (W.every(k => window.SPRITES[k])) {
      // Celeste backs off a step to stretch the sheet out (keeping the two of them clear of the big tank), Alan takes the other end
      const cx = c.x - 100, at = S.pairSpot(W[0], cx, c.y);
      await Promise.all([c.walkTo(cx, c.y), p.walkTo(at.x, at.y)]); p.dir = 'w'; c.dir = 'e';
      // the two of them as one painting, Celeste on the left: the sheet twists tighter and back, one frame dissolving into the next.
      // The painting stands on Alan's feet, with Celeste's painted feet where she stood
      const t0 = performance.now();
      await S.pairIn(c, W[0], { walk: false });
      let on = true;
      const twist = (async () => {
        for (let i = 1; on; i++) {
          await G.wait(window.FAST ? 20 : 750);
          if (on) { await S.pairStep(W[i % W.length]); if (i % W.length === 2) sfx('wring', 0.5); }
        }
      })();
      sfx('wring');
      await joke('alan_wring');
      if (!window.FAST) await G.wait(Math.max(0, 3200 - (performance.now() - t0))); // at least one full turn of the sheet
      on = false; await twist;
      p.pose = W[0]; await G.wait(window.FAST ? 20 : 500);
      c.set = null; await S.pairOut(c, { dir: 'w' });
    } else {
      await p.walkTo(c.x + 170, c.y); p.dir = 'w'; c.dir = 'e';
      p.pose = 'wring'; c.set = 'wring'; wringing = performance.now();
      sfx('wring');
      await joke('alan_wring');
      wringing = null; p.pose = null; c.set = null;
    }
    await say('celeste_hello');
    // Maria Coutinho first, and the gentleman in the cream suit; then she's met
    await S.celesteMaria();
    F().met_celeste = true;
    await S.talkCeleste(true);
  };
  S.talkCeleste = async function (first) {
    if (G.room.id === 'cais') return S.talkCelesteQuay();
    if (!F().met_celeste) return say('celeste_twist');
    if (!first) { await say('celeste_hello'); await S.gossip('celeste'); }
    await G.dialog([
      { line: 'alan_ask_river', once: true, run: async () => {
        await say('celeste_river');
        await joke('alan_breathes');
        await say('celeste_salt');
        F().lore_turnings = true;
        if (F().lore_bronze) S.lore && S.lore('celeste');
      } },
      { line: 'alan_ask_celeste_lacerda', once: true, when: () => F().ines_plan, run: () => say('celeste_godfather', 'celeste_font') },
      { line: 'alan_show_tile', silent: true, when: () => F().sketched_tile && !F().lore_bronze, run: () => S.celesteTile() },
      { line: 'alan_show_file', silent: true, when: () => G.has('file55') && !F().knows_1955_boy, run: () => S.celeste1955() },
      { line: 'alan_ask_maria', once: true, when: () => !F().asked_maria, run: () => S.celesteMaria(true) },
      { line: 'alan_ask_rui', once: true, run: () => say('celeste_rui', 'alan_rui_eating', 'gag_celeste', 'gag_alan_celeste') },
      { label: 'Goodbye.', bye: true, run: async () => { await say('celeste_bye'); S.checkCh2(); } },
    ]);
  };
  S.celesteMaria = async function (asked) {
    if (!asked) await say('alan_ask_maria');
    await say('celeste_maria', 'celeste_suit', 'alan_suit', 'celeste_suit2');
    F().asked_maria = true; S.lore && S.lore('suit');
  };
  S.celesteTile = async function () {
    if (!F().met_celeste) return say('celeste_twist');
    if (F().lore_bronze) return say('celeste_tile_again');
    await say('alan_show_tile', 'celeste_tile_1');
    await joke('alan_dingdong'); await say('celeste_cheeky');
    F().lore_bronze = true; if (F().lore_turnings) S.lore && S.lore('celeste');
  };
  S.celeste1955 = async function () {
    if (!F().met_celeste) return say('celeste_twist');
    if (F().knows_1955_boy) return say('celeste_file_again');
    await say('alan_show_file', 'celeste_1955_1', 'celeste_1955_2');
    F().knows_1955_boy = true;
  };

  // ================================================================ RELOJOARIA FERREIRA
  const lit = () => F().ferreira_lit;
  ROOMS.ferreira = {
    name: 'Relojoaria Ferreira', bg: 'ferreira', bgs: ['ferreira_drawer', 'ferreira_drawer_empty'],
    // the desk drawer (painted): shut; pulled open with the tide card in it; then empty
    bgFn: () => !lit() || !F().drawer_unlocked ? 'ferreira' : (G.has('tidecard') || F().tidecardTaken) ? 'ferreira_drawer_empty' : 'ferreira_drawer',
    music: () => ({ id: 'ferreira_workshop', vol: lit() ? 1 : 'low' }), ambience: () => F().tide_wound ? 'ferreira' : null, floor: 'wood', // in the dark, quieter
    walk: [[0, 615], [1280, 615], [1280, 716], [0, 716]],
    scale: [615, 335, 716, 382],
    light: () => lit() ? { ambient: 'rgb(180,140,95)', base: 0.48, flickerShade: 0.25 } : { ambient: 'rgb(70,70,85)', base: 0.35 },
    lights: () => lit() ? [
      { x: 523, y: 372, rgb: '255,190,110', kind: 'flame', seed: 6, glow: 160, ga: 0.32, power: 0.8, reach: 900, rim: 0.7, floor: [523, 620], height: 260 },
      { x: 1140, y: 330, rgb: '190,200,215', power: 0.18, reach: 600, floor: [1140, 600], height: 500 },
    ] : [
      { x: 1140, y: 330, rgb: '190,200,215', power: 0.3, reach: 700, rim: 0.7, floor: [1140, 600], height: 500 },
    ],
    entries: { default: [1080, 650, 'w'], map: [1080, 650, 'w'] },
    // lit, it is still a dim shop: one oil lamp, the rest falling away into shadow
    animBack(g, t) {
      if (!lit()) return;
      const f = 1 + 0.03 * Math.sin(t * 7.3) * Math.sin(t * 3.1);
      g.save();
      const gr = g.createRadialGradient(523, 400, 60 * f, 560, 420, 760);
      gr.addColorStop(0, 'rgba(8,5,2,0)'); gr.addColorStop(0.35, 'rgba(8,5,2,0.28)'); gr.addColorStop(1, 'rgba(6,4,2,0.62)');
      g.fillStyle = gr; g.fillRect(0, 0, 1280, 720);
      g.restore();
    },
    // unlit, the workshop is black but for the grey light at the door
    animFg(g, t) {
      if (lit()) { FX.motes(g, t, 300, 250, 500, 300, 20, '255,210,150'); return; }
      g.save(); g.fillStyle = 'rgba(4,4,8,0.9)'; g.fillRect(0, 0, 1280, 720);
      g.globalCompositeOperation = 'destination-out';
      const gr = g.createRadialGradient(1140, 360, 20, 1140, 360, 420); gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 1280, 720);
      const g2 = g.createRadialGradient(523, 380, 4, 523, 380, 90); g2.addColorStop(0, 'rgba(0,0,0,0.5)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = g2; g.fillRect(0, 0, 1280, 720);
      g.restore();
    },
    hotspots: [
      { name: 'Oil lamp', rect: [500, 330, 50, 80], at: [560, 640], face: 'n', look: () => say(lit() ? 'narr_look_workbench' : 'narr_look_oillamp'),
        use: () => say(lit() ? 'alan_fail_04' : 'alan_dark'),
        items: { matches: async () => {
          if (lit()) return say('alan_fail_04');
          sfx('match'); F().ferreira_lit = true; Sound.refreshMusic(); G.takeItem('matches');
          await G.wait(window.FAST ? 20 : 500);
          await say('alan_lamp_lit'); await say('alan_enter_ferreira'); await say('alan_clocks');
        }, any: 'alan_dark' } },
      { name: 'Wall of clocks', rect: [100, 0, 900, 330], when: lit, look: 'narr_look_clockwall' },
      { name: 'Workbench', rect: [330, 420, 620, 190], when: lit, look: 'narr_look_workbench' },
      { name: 'Repair book', rect: [640, 430, 118, 30], at: [690, 640], face: 'n', when: lit, look: async () => {
        await S.readRepair();
        await say('alan_repair');
        F().read_repair = true;
        await say('alan_repair_hint');
      } },
      { name: 'Tide clock', rect: [757, 330, 118, 118], at: [810, 640], face: 'n', when: lit,
        look: async () => {
          if (!F().tide_wound) return say('narr_look_tideclock');
          await S.showTideClock(true);
          if (!F().tide_known) { F().tide_known = true; await say(F().turnings_deduced ? 'alan_clock_agrees' : 'alan_clock_puzzled'); }
          await say('alan_tide_today');
        },
        items: { key: async () => {
          if (F().tide_wound) return say('alan_fail_04');
          if (!F().got_ledger) return say('alan_key_desk_first');
          G.takeItem('key'); F().tide_wound = true; sfx('clock_wind'); Sound.ambience('ferreira');
          await joke('alan_clock_wound');
          await S.showTideClock(true);
          await say('narr_tideclock_runs');
          // (alan_turnings no longer plays here: Alan works it out from the newspaper instead)
          F().tide_known = true; await say(F().turnings_deduced ? 'alan_clock_agrees' : 'alan_clock_puzzled');
          await say('alan_tide_today'); // 18:25 and 00:35
        }, any: 'alan_fail_02' } },
      { name: 'Desk drawer', rect: [560, 470, 160, 30], at: [800, 640], face: 'w', // beside the drawer, not in front of it when: () => lit() && !F().drawer_unlocked,
        look: 'alan_drawer_lock', use: () => S.ferreiraDrawer(), take: () => S.ferreiraDrawer() },
      { name: 'Tide card', rect: [628, 486, 66, 32], at: [800, 640], face: 'w', when: () => lit() && F().drawer_unlocked && !G.has('tidecard') && !F().tidecardTaken,
        look: 'alan_look_tidecard', take: async () => {
          F().tidecardTaken = true;
          give('tidecard');
          sfx('page');
          await say('alan_tide_card');
          await S.readTideCard();
          await say('alan_tide_today');
        } },
      { name: 'Key board', rect: [917, 160, 118, 256], at: [970, 640], face: 'n', when: lit, look: 'narr_look_keyboard',
        take: async () => { if (F().vkeyTaken) return say('alan_fail_take'); F().vkeyTaken = true; give('vkey'); await say('alan_spare'); } },
      { name: 'Shutters', rect: [0, 60, 100, 370], when: lit, look: 'narr_look_shutters' },
      { name: 'Door', rect: [1067, 160, 150, 420], at: [1100, 650], exit: 'map', entry: 'ferreira', look: 'narr_look_tape' },
    ],
    async enter() {
      F().visited_ferreira = true;
      if (!F().ferreira_open) {
        F().ferreira_open = true; G.takeItem('fkey'); sfx('door_sealed');
        await say('alan_ferreira_sealed'); await say('narr_ferreira_dark');
      }
    },
    leave() { S.checkCh2(); },
  };

  // the chapter closes in the shop once both threads are done
  // the tide card is essential later (Zé): once the turnings are understood Alan pockets it,
  // and saves that got past the workshop without it get it back from his jacket
  S.ensureTideCard = async function (quiet) {
    if (G.has('tidecard') || F().tidecardTaken || F().ze_believes) return;
    F().tidecardTaken = true; give('tidecard'); sfx('page');
    if (!quiet) await say('alan_tide_card');
  };
  S.checkCh2 = function () {
    const f = F();
    if (f.met_celeste && f.tide_known && f.knows_1955_boy && f.turnings_deduced && (G.has('tidecard') || f.tidecardTaken)) f.ch2_ready = true;
    // the last piece found in the shop itself: the chapter ends here, not on the next way in
    if (f.ch2_ready && f.ch === 2 && !f.ch2_done && G.room && G.room.id === 'shop') return S.ch2End();
  };
  // Puzzle II-E: Ferreira's drawer has a clockmaker's lock; every clock in the shop says 03:12
  S.ferreiraDrawer = async function () {
    if (F().drawer_unlocked) return;
    if (!F().lock_tried) { F().lock_tried = true; await say('alan_drawer_lock'); }
    const open = await S.drawerLock();
    if (!open) return;
    await say('alan_0312');
    // the drawer slides out on the tide table, and Alan pockets it there and then
    if (!G.has('tidecard') && !F().tidecardTaken) {
      await G.wait(window.FAST ? 20 : 700);
      G.player.pose = 'reach'; await G.wait(window.FAST ? 20 : 450);
      F().tidecardTaken = true; give('tidecard'); sfx('page'); G.player.pose = null;
      await say('alan_tide_card'); await S.readTideCard(); await say('alan_tide_today');
    }
  };
  // Puzzle II-D: the newspaper's tide table against Rui's times of death
  S.deduce = async function () {
    if (F().turnings_deduced) return say('alan_tide_today');
    if (!F().deaths_known) return say('alan_deduce_times');
    if (!F().lore_turnings) return say('alan_deduce_why');
    await S.deductionPage();
    await S.posed('write', () => say('alan_deduce'));
    F().turnings_deduced = true;
    await say('alan_turnings_celeste'); // "Celeste was right."
    if (!(F().lore || []).includes('celeste')) S.lore && S.lore('turnings');
    await S.checkCh2();
  };
  S.ITEMS.newspaper = { name: 'Diário de Notícias', look: async () => { await S.readPaper(); await say('alan_paper'); }, with: { notebook: () => S.deduce() } };
  S.ITEMS.notebook.with = Object.assign(S.ITEMS.notebook.with || {}, { newspaper: () => S.deduce() });
  S.ch2End = async function () {
    if (F().ch2_done) return;
    F().ch2_done = true;
    await say('ines_pull', 'ines_tenth'); await joke('alan_tenth');
    await G.say('narr_ch2_end', { offscreen: true });
    await S.chapter(3, 'narr_ch3_card');
  };
})();
