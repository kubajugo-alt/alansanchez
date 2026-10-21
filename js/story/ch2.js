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
      // light moving on the water: the long row of basins (a thin strip below their rims) and the big tank
      g.save(); g.globalAlpha = 0.55; FX.water(g, t, 180, 381, 880, 10, '190,205,210'); g.restore();
      g.save(); g.globalAlpha = 0.8; g.beginPath(); g.rect(880, 474, 350, 38); g.clip(); FX.water(g, t * 0.8, 880, 476, 350, 34, '200,214,220'); g.restore();
      FX.drips(g, t, [[1128, 690, 532, 1.4]], '210,225,230'); // the tank's overflow into its puddle
      g.save(); g.globalAlpha = 0.3; g.beginPath(); g.rect(660, 520, 150, 110); g.clip(); FX.water(g, t * 0.6, 660, 520, 150, 110, '255,215,150'); g.restore(); // the lamp on the wet floor
    },
    animFg(g, t) { S.drawSplash(g, t); },
    // the pendant lamp sways on its cord (scripts/swing_cut.py)
    layers: [{ img: 'lav_lamp_under', x: 683, y: 58 }, { img: 'lav_lamp', x: 691, y: 66, pivot: [730, 66], swing: t => 1.2 * Math.sin(t * 0.7) }],
    animBack(g, t) {
      const im = G.bgImage();
      [[20, 10, 95, 260, 0], [125, 30, 70, 240, 1.4], [205, 50, 60, 200, 2.3], [395, 60, 50, 170, 0.8], [280, 55, 36, 195, 1.9], [320, 95, 52, 125, 0.4], [462, 128, 54, 108, 2.9]].forEach(([x, y, w, h, ph]) => FX.sway(g, im, [x, y, w, h], t, 1.2, ph));
      for (const r of [[508, 170, 72, 190], [640, 165, 138, 195], [832, 160, 156, 200]]) FX.rain(g, t, r, 18, '215,222,228', 0.18); // rain beyond the arches
      g.save(); g.beginPath(); g.rect(460, 120, 540, 230); g.clip();
      FX.birds(g, t + 3, { y0: 150, y1: 260, n: 3, period: 16, color: 'rgba(80,82,88,0.55)', size: 8, x0: 440, x1: 1020 });
      g.restore();
    },
    // the back basins stand in front of the washerwomen
    occluders: [{ y: 500, polys: [[[160, 383], [300, 375], [1068, 375], [1068, 484], [160, 484]]] }, // from the far edge of the water: they stand behind the basins, hands in
      { y: 680, when: () => !swimmer && !onTank, polys: [[[839, 453], [1011, 446], [1160, 452], [1280, 470], [1280, 680], [874, 680], [860, 650], [842, 600]]] }], // the big tank and its towel (the basket is gone: Alan washes in that corner)
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
      { id: 'npc_washer2', name: 'Odete', x: 500, y: 476, h: 196, look: 'alan_npc_washers', idleHold: [6, 12], variantHold: [2.4, 4.5], talk: () => S.washersBath(),
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
  let splash = null, shorts = null, swimmer = null, onTank = false; // onTank: sitting on its rim, drawn over it
  const WASH = { x: 1075, y: 503, h: 380 }; // in the tank, right of the towel: the waterline and his full standing height
  // his black trunks, flung over his shoulder: an arc, a spin, a heap on the stones
  S.drawShorts = function (g) {
    if (!shorts) return;
    if (shorts.img) return drawBoxers(g);
    const k = Math.min(1, (performance.now() - shorts.t0) / 700);
    const x = shorts.x0 + (shorts.x1 - shorts.x0) * k, y = shorts.y0 + (shorts.y1 - shorts.y0) * k - Math.sin(k * Math.PI) * 140;
    g.save(); g.translate(x, y); g.rotate(k < 1 ? k * 9 : 0.3); g.scale(1, k < 1 ? 1 : 0.55);
    g.fillStyle = '#1d1b1c'; g.fillRect(-14, -10, 28, 20);
    g.fillStyle = '#34312f'; g.fillRect(-14, -10, 28, 4); // waistband
    g.strokeStyle = 'rgba(120,110,100,0.5)'; g.lineWidth = 1; g.strokeRect(-14, -10, 28, 20);
    g.restore();
  };
  // the new scene (?bath=new): the boxers Canva painted over his throw, cut out (alan_bn_boxers), thrown for real from
  // where they were painted: up a little past his hand, then down over the front of the tank, spinning, to land flat
  // on the stones where he'll climb out (the user: "naturally fly to the front of the tank"); there till he picks them up
  let boxersImg = null;
  S.throwBoxers = function (p, to) {
    const m = window.SPRITES.alan_bn_boxers; if (!m) return;
    if (!boxersImg) { boxersImg = new Image(); boxersImg.src = m.src; }
    const k = p.height() / m.h, D = to.y - (p.y + m.dy * k), R = 50; // R: how far they rise above where they leave his hand
    const v = -2 * R - Math.sqrt(4 * R * R + 4 * R * D);            // a thrown body: y = y0 + v u + a u^2, u from 0 to 1
    shorts = { img: boxersImg, m, k, x0: p.x + m.dx * k, y0: p.y + m.dy * k, x1: to.x, y1: to.y, v, a: D - v, ms: 1150, t0: performance.now() };
  };
  function drawBoxers(g) {
    const b = shorts, u = Math.min(1, (performance.now() - b.t0) / (window.FAST ? 1 : b.ms));
    if (!b.img.complete || !b.img.naturalWidth) return;
    const x = b.x0 + (b.x1 - b.x0) * u, y = b.y0 + b.v * u + b.a * u * u, w = b.m.w * b.k, h = b.m.hh * b.k;
    g.save();
    if (u >= 1) { g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.ellipse(x, y + 4, w * 0.5, h * 0.16, 0, 0, 7); g.fill(); }
    g.translate(x, y); g.rotate(u < 1 ? u * Math.PI * 3 : 0.12); if (u >= 1) g.scale(1, 0.5); // flat on the stones once down
    g.drawImage(b.img, -w / 2, -h / 2, w, h);
    g.restore();
  }
  // ripples where he swims, drawn over the cut of the swimming frames
  // where his arms reach past the water to the rim (the push out), the ripples pass behind them: drawn on their own
  // canvas, the painting's arms (all but its middle fifth, his body) cut out of them, then laid over the room
  let armImg = null, rippleCv = null;
  function armsOut(g, p, draw) {
    const m = window.SPRITES[p.pose];
    if (!m || p.pose !== 'alan_bn_rim') return draw(g);
    if (!armImg || armImg.key !== p.pose) { armImg = new Image(); armImg.src = m.src; armImg.key = p.pose; }
    if (!armImg.complete || !armImg.naturalWidth) return draw(g);
    rippleCv = rippleCv || document.createElement('canvas'); rippleCv.width = g.canvas.width; rippleCv.height = g.canvas.height;
    const c = rippleCv.getContext('2d'), k = p.height() / m.h, X = p.x - m.ax * k, Y = p.y - m.fy * k, W = m.w, mid = [W * 0.4, W * 0.6];
    c.setTransform(g.getTransform()); draw(c);
    c.globalCompositeOperation = 'destination-out';
    c.drawImage(armImg, 0, 0, mid[0], m.hh, X, Y, mid[0] * k, m.hh * k);                                 // his right arm
    c.drawImage(armImg, mid[1], 0, W - mid[1], m.hh, X + mid[1] * k, Y, (W - mid[1]) * k, m.hh * k);     // his left
    c.globalCompositeOperation = 'source-over';
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(rippleCv, 0, 0); g.restore();
  }
  S.drawSwimWater = function (g, t) {
    if (!swimmer) return;
    armsOut(g, G.player, g => S.drawRipples(g, t));
  };
  S.drawRipples = function (g, t) {
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
  // a splash (the user: "realistic water splashes"): a crown of droplets thrown up and out from the waterline, each on
  // its own thrown path, drawn as a short streak along its flight with a soft dark edge (painted, not dotted); for a
  // big one (the cannonball, s 1) a column of white water that rises and falls back, and spray; droplets that come
  // down on the water make their own little rings; foam rings spread over the surface, flat as the water lies.
  // S.splashAt(x, y, s): s from 0.25 (a hand slapping the water) to 1 (a man landing in it). Seeded: the same each time.
  const SPLASH_G = 1100; // px/s², a droplet's fall at this scale
  S.splashAt = function (x, y, s) {
    let seed = Math.round(x * 7 + y * 13 + s * 1000);
    const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const n = Math.round(30 + 90 * s), drops = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (rnd() - 0.5) * Math.PI * (0.55 + 0.35 * rnd()); // mostly up, fanning out
      const v = (180 + 520 * s) * (0.35 + 0.75 * rnd()) * (1 - 0.35 * Math.abs(Math.cos(a)));
      const x0 = x + (rnd() - 0.5) * 50 * (0.4 + s), y0 = y + (rnd() - 0.5) * 6;
      const vx = Math.cos(a) * v, vy = Math.sin(a) * v * 1.1, yl = y + (rnd() - 0.4) * 14; // lands a little nearer or further
      const tl = (-vy + Math.sqrt(vy * vy + 2 * SPLASH_G * Math.max(0, yl - y0))) / SPLASH_G;
      const big = rnd() < 0.15; // mostly fine drops, a few heavy ones
      drops.push({ x0, y0, vx, vy, tl, r: (big ? 2.2 + 1.8 * rnd() : 0.7 + 1.3 * rnd()) * (0.6 + 0.5 * s), d: rnd() * 0.06 });
    }
    splash = { x, y, s, t0: performance.now(), drops };
  };
  S.drawSplash = function (g, t) {
    S.drawShorts(g); S.drawSwimWater(g, t);
    if (!splash) return;
    if (!splash.drops) { const o = splash; S.splashAt(o.x, o.y, 0.8); splash.t0 = o.t0; } // the old scene's splashes
    const sp = splash, T0 = (performance.now() - sp.t0) / 1000, s = sp.s, life = 0.9 + 0.9 * s;
    if (T0 > life + 0.6) { splash = null; return; }
    g.save(); g.lineCap = 'round';
    // the surface: churned white where it went in, then foam rings spreading flat
    const k = Math.min(1, T0 / life);
    if (T0 < 0.5 * life) { const f = 1 - T0 / (0.5 * life); g.fillStyle = `rgba(235,242,244,${0.35 * f * (0.5 + s)})`; g.beginPath(); g.ellipse(sp.x, sp.y + 2, 30 + 60 * s * k, (30 + 60 * s * k) * 0.16, 0, 0, 7); g.fill(); }
    for (let r = 0; r < 3; r++) {
      const kr = Math.max(0, k - r * 0.12); if (!kr) continue;
      const rx = (24 + 170 * s) * Math.sqrt(kr) * (1 + r * 0.25);
      g.strokeStyle = `rgba(225,236,238,${0.55 * (1 - kr) * (0.4 + 0.6 * s)})`; g.lineWidth = 2.2 - r * 0.5;
      g.beginPath(); g.ellipse(sp.x, sp.y + 2, rx, rx * 0.13, 0, 0, 7); g.stroke();
    }
    // the crown (a big splash): two sheets of water thrown up either side of where he went in, curling outwards,
    // thin and see-through, falling back; then the column, rising out of the middle and collapsing into itself
    if (s > 0.6 && T0 < 0.6) {
      const u = T0 / 0.6, up = Math.sin(Math.PI * Math.min(1, u * 1.1)), a = 0.75 * (1 - u);
      for (const side of [-1, 1]) {
        const bx = sp.x + side * 16 * s, h = 95 * s * up, out = 55 * s * (0.4 + u);
        const gr = g.createLinearGradient(0, sp.y, 0, sp.y - h); gr.addColorStop(0, `rgba(240,246,247,${a})`); gr.addColorStop(1, `rgba(240,246,247,${a * 0.25})`);
        g.fillStyle = gr; g.beginPath(); g.moveTo(bx, sp.y + 3);
        g.bezierCurveTo(bx + side * 6, sp.y - h * 0.6, bx + side * out * 0.6, sp.y - h, bx + side * out, sp.y - h * 0.85); // the outer face
        g.bezierCurveTo(bx + side * out * 0.75, sp.y - h * 0.55, bx + side * out * 0.95, sp.y - h * 0.2, bx + side * (out + 12), sp.y + 3);
        g.closePath(); g.fill();
        g.strokeStyle = `rgba(80,100,105,${a * 0.5})`; g.lineWidth = 1; g.stroke();
      }
    }
    if (s > 0.6 && T0 > 0.12 && T0 < 0.9) {
      const u = (T0 - 0.12) / 0.78, h = 160 * s * Math.sin(Math.PI * Math.min(1, u * 1.1)), w = 20 * s;
      for (let i = 0; i < 12; i++) {
        const f = i / 11, cy = sp.y - h * f, cx = sp.x + Math.sin(i * 2.3 + u * 3) * 5 * f, rr = w * (1 - 0.5 * f) * (0.8 + 0.5 * u);
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rr);
        gr.addColorStop(0, `rgba(246,250,250,${0.9 * (1 - u * 0.85)})`); gr.addColorStop(0.6, `rgba(232,242,244,${0.5 * (1 - u)})`); gr.addColorStop(1, 'rgba(225,238,240,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.fill();
      }
    }
    // spray: a soft mist over it, thinning out
    if (T0 < 0.9) { const u = T0 / 0.9, rr = (30 + 110 * u) * (0.4 + 0.6 * s), cy = sp.y - 40 * s * (1 - u * 0.5);
      const gr = g.createRadialGradient(sp.x, cy, 0, sp.x, cy, rr); gr.addColorStop(0, `rgba(230,238,240,${0.22 * (1 - u) * (0.3 + s)})`); gr.addColorStop(1, 'rgba(230,238,240,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(sp.x, cy, rr, 0, 7); g.fill(); }
    // the droplets: in flight, a streak along their path; down on the water, a little ring where each landed
    for (const d of sp.drops) {
      const tt = T0 - d.d; if (tt <= 0) continue;
      if (tt < d.tl) {
        const x1 = d.x0 + d.vx * tt, y1 = d.y0 + d.vy * tt + 0.5 * SPLASH_G * tt * tt, vy = d.vy + SPLASH_G * tt;
        const v = Math.hypot(d.vx, vy), st = 1 + Math.min(1.8, v / 500), ang = Math.atan2(vy, d.vx); // a drop, drawn out a little by its speed
        const a = Math.min(1, 1.6 * (1 - tt / (d.tl + 0.2)));
        g.save(); g.translate(x1, y1); g.rotate(ang);
        g.fillStyle = `rgba(236,244,246,${0.8 * a})`; g.strokeStyle = `rgba(70,90,96,${0.3 * a})`; g.lineWidth = 0.8;
        g.beginPath(); g.ellipse(0, 0, d.r * st, d.r, 0, 0, 7); g.fill(); if (d.r > 1.6) g.stroke();
        if (d.r > 1.6) { g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.beginPath(); g.arc(d.r * 0.3, -d.r * 0.3, d.r * 0.35, 0, 7); g.fill(); } // its glint
        g.restore();
      } else if (tt < d.tl + 0.45) {
        const u = (tt - d.tl) / 0.45, lx = d.x0 + d.vx * d.tl, ly = d.y0 + d.vy * d.tl + 0.5 * SPLASH_G * d.tl * d.tl, rx = 3 + 14 * u * (0.5 + d.r / 4);
        g.strokeStyle = `rgba(220,232,235,${0.45 * (1 - u)})`; g.lineWidth = 1; g.beginPath(); g.ellipse(lx, ly, rx, rx * 0.2, 0, 0, 7); g.stroke();
      }
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
    if (S.BATH_NEW) return S.bathNew(); // the repainted scene (?bath=new, for review)
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
      const washing = ['wash1', 'wash4', 'wash2', 'wash3', 'wash6'].filter(has); // (wash5 and the swim frames: taken out by the user, 2026-10-21)
      swimmer = { y: y1 }; p.x = x1; p.y = y1; p.visible = true; p.sink = 0.0001; // no floor shadow on the water
      p.h = WASH.h; p.pose = has('wsurface') ? 'wsurface' : washing[0];
      if (has('wsurface')) await T(900);                                  // up for air, hair pushed back
      let on = true;
      (async () => {
        let i = 0;
        while (on) {
          p.pose = washing[i % washing.length]; if (i % washing.length === 2) sfx('splash', 0.12); await T(900);
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
      S.bathTowelTaken = true; // the towel is off the tank's corner from here
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
  // The bath repainted (2026-10-21, ?bath=new, for review): eleven Canva paintings, his build and skin from the Teixeira
  // scene (art/review/alan/bath_new, scripts/bath_new_fit.py). He strips to his underwear in front of the tank, goes
  // round behind it (drawn waist-up at the waterline, the wall hiding the rest) and flings the underwear out over the
  // wall: the washerwomen see everything, the painting doesn't. Out again by the corner where Celeste's towel hangs,
  // he takes it and dresses under it, the undressing frames played backwards.
  S.bathNew = async function () {
    const p = G.player, c = G.npc('celeste'), T = ms => G.wait(window.FAST ? 20 : ms);
    if (F().bathed) return say('alan_bath_3');
    S.bathTowelTaken = false; // Celeste's towel still on the tank's corner
    // behind the tank: on the floor past its far rim, the wall hiding him from the waist down (the user's board, step 9)
    // at his full size, as in the water (the user: "not scaled down"). With the taller tank (?bath=new): its far rim at
    // y 401-417, the water's surface from there to the near rim's inner edge at 449; in the water his waterline is
    // just short of that edge, in the middle of the surface (the tank's outline is off while he swims, as before)
    // (the user: near the tank's western end, its far rim plainly hiding him; his torso is 32 px right of the anchor;
    // the frame's cut 40 px below the far rim, so the rim hides him from the navel down: he stands behind it)
    // h: the waist-up frames are fitted to his head size standing (scripts/bath_new_fit.py), so they are drawn at his
    // standing height in this room (360 at the tank's front): the same size of torso as when we see him whole
    // (the user: "the walking behind the tank alignment is still not right": he is where his walk ended, feet at y 555
    // just behind the back wall, so his size there, 271, and his waist 0.5 of that above his feet)
    const BEHIND = S.BATH_TALL ? { x: 900, y: 420, h: 271 } : { x: 1120, y: 472, h: 360 };
    const TANK = S.BATH_TALL ? { x: 1070, y: 442, h: 360 } : WASH;
    const RIM = { x: 1000, y: 461, water: 432 };  // the push out: palms on the near rim's top, fingers over its edge, his waist in the water behind
    // up the tank's left side to the depth of its back wall (on the floor at y 563), then along behind it to BEHIND
    const WALK = [[{ x: 800, y: 560 }, 900], [{ x: BEHIND.x, y: 555 }, 700]];
    const BOXERS = { x: 795, y: 668 };
    const CORNER = { x: 805, y: 684 };
    const SEAT = { x: 910, y: 615, h: 360 };      // sitting on the front rim: the painting's seat (row 400, 100 px right of its anchor) on the rim's top, y 452              // on the tank's front-left corner (its outline stops at y 680) // where they land: just in front of where he climbs out (x 770, y 650)
    await G.busy(async () => {
      await say('alan_bath_1');
      p.dir = 'e';
      // every painting dissolves into the next (the user: "a smooth crossfade between the frames"); off at the end
      p.crossFadeAll(0.16);
      // flip: the painting mirrored for this step (the user's board: "flip so he faces right/left")
      const show = async (k, ms, flip) => { p.dir = flip ? 'w' : 'e'; p.pose = k; if (ms) await T(ms); };
      const hop = async (dx, n, ms) => { for (let i = 0; i < n; i++) { p.x += dx; await T(ms); } };
      const SHOCK = [['npc_washer1', 'npc_washer1_shock'], ['npc_washer2', 'npc_washer2_shock'], ['npc_laundry', 'npc_laundry_shock'], ['celeste', 'celeste_shock']];
      const shocked = on => {
        for (const [id, k] of SHOCK) {
          const w = G.npc(id);
          if (w && w.visible && window.SPRITES[k]) { if (on && id === 'celeste') w.set = null; w.pose = on ? k : null; }
        }
      };
      // the order and holds of the user's board (art/review board/bath, 2026-10-21), with an in-between painting
      // (alan_bn_x_*, IB ms) after each of its steps (the user: "double the number of frames ... more fluid")
      const IB = 420;
      sfx('sheet_slap', 0.25); await show('alan_bn_jacket_shrug', 800);  // the jacket off the shoulders
      await show('alan_bn_x_jacket_arm', IB);                            // one arm out
      await show('alan_bn_jacket_off', 800);                             // ...and in his hand
      await show('alan_bn_x_jacket_drop', IB);                           // dropped, a hand to his tee
      shocked(true);
      await show('alan_bn_tee_lift', 800, true);                        // the tee lifted, his stomach showing
      await show('alan_bn_x_tee_up', IB);                                // up to his armpits
      sfx('sheet_slap', 0.3); await show('alan_bn_tee', 800);            // over his head
      await show('alan_bn_x_tee_toss', IB);                              // tossed aside, a hand to the belt
      await show('alan_bn_belt', 800);                                   // the belt
      await show('alan_bn_x_unbutton', IB);                              // the jeans unbuttoned
      await show('alan_bn_jeans_half', 600);                             // jeans halfway down
      await show('alan_bn_x_jeans_knees', IB);                           // at his knees, a foot coming out
      p.dir = 'w'; p.pose = 'alan_bn_jeans_off'; await hop(5, 4, 175); // hopping out of them
      await show('alan_bn_x_kick', IB);                                  // kicked away
      await show('alan_bn_pants', 900);                                  // in his underwear, a grin back
      await show('alan_bn_x_turn', IB);                                  // turning to go
      // off round the back of the tank, on the floor all the way (smaller as he goes, by the room's depth): up its left
      // side to the depth of its back wall, then along behind it, the tank hiding him from the waist down as he goes
      await show('alan_bn_walk', 0);
      const wk0 = performance.now(); // his two strides, a painting each, every 280 ms as he goes
      for (const [to, ms] of WALK) {
        const x0 = p.x, y0 = p.y, t0 = performance.now(), d = window.FAST ? 20 : ms;
        for (let u = 0; u < 1;) {
          u = Math.min(1, (performance.now() - t0) / d);
          p.x = x0 + (to.x - x0) * u; p.y = y0 + (to.y - y0) * u - Math.abs(Math.sin(u * Math.PI * 3)) * 2; // a step bob
          p.pose = Math.floor((performance.now() - wk0) / 280) % 2 ? 'alan_bn_x_walk2' : 'alan_bn_walk';
          await G.wait(16);
        }
      }
      // where the walk ended: the waist-up paintings at his size there, their cut just under the far rim
      p.dir = 'e'; p.x = BEHIND.x; p.y = BEHIND.y; p.h = BEHIND.h; p.sink = 0.0001; p.pose = 'alan_bn_reach'; // reaching down to them
      await T(900);
      p.pose = 'alan_bn_x_raise'; await T(IB);                           // straightening up, the boxers at his shoulder
      p.pose = 'alan_bn_fling';
      await T(300);
      S.throwBoxers(p, BOXERS); sfx('sheet_slap', 0.2);
      await T(700);
      if (c) { c.dir = c.x < p.x ? 'e' : 'w'; c.set = null; c.pose = 'shout'; }
      await say('celeste_bath_1');
      if (c) c.pose = window.SPRITES.celeste_shock ? 'celeste_shock' : null;
      await say('alan_bath_2');
      p.pose = 'alan_bn_x_crouch'; await T(IB);                          // gathering himself to jump
      // over the rim and in: a cannonball from behind the tank (its far wall hides his feet as he leaves), up and over,
      // down onto the water; there he goes under: his feet held at the waterline and the painting sunk below it (the
      // user: "actually fall into water"), the splash as he hits
      p.pose = 'alan_bn_cannonball'; p.h = BEHIND.h;
      const J = { x0: BEHIND.x, y0: 400, x1: TANK.x, y1: TANK.y, up: 230, ms: window.FAST ? 40 : 650 }, j0 = performance.now();
      for (let u = 0; u < 1;) {
        u = Math.min(1, (performance.now() - j0) / J.ms);
        p.x = J.x0 + (J.x1 - J.x0) * u; p.y = J.y0 + (J.y1 - J.y0) * u * u - J.up * 4 * u * (1 - u);
        p.h = BEHIND.h + (TANK.h - BEHIND.h) * u; // nearer as he comes over: from his size behind the tank to his size in it
        if (u > 0.5) onTank = true; // coming down over the water: the tank no longer hides him
        await G.wait(16);
      }
      sfx('splash'); S.splashAt(TANK.x, TANK.y, 1); swimmer = { y: TANK.y }; onTank = false; // in: the ring round him
      const s0 = performance.now(), sms = window.FAST ? 20 : 260;
      for (let u = 0; u < 1;) { u = Math.min(1, (performance.now() - s0) / sms); p.sink = 0.6 * u * u; await G.wait(16); }
      p.visible = false; p.sink = 0.0001; // (no floor shadow on the water)
      await T(650);
      swimmer = { y: TANK.y }; p.x = TANK.x; p.y = TANK.y; p.h = TANK.h; p.visible = true; p.dir = 'e'; p.pose = 'alan_bn_x_surface'; // up, blowing water
      await T(700);
      let on = true;
      (async () => {
        let i = 0;
        const SWIM = [['alan_bn_hair', 1000, true], ['alan_bn_x_hands_down', IB], ['alan_bn_relax', 1100], ['alan_bn_x_scoop', IB, true],
          ['alan_bn_splash', 1000, true], ['alan_bn_x_wipe', IB]]; // the board's order and mirrors, an in-between after each
        while (on) {
          const [k, ms, flip] = SWIM[i % SWIM.length]; p.dir = flip ? 'w' : 'e'; p.pose = k;
          if (k === 'alan_bn_splash') { sfx('splash', 0.12); S.splashAt(p.x + 25, TANK.y, 0.3); } // water thrown up at his face
          await T(ms); i++;
        }
      })();
      await say('narr_bath');
      on = false; await T(60);
      // hands on the near rim, pushing himself up to get out (his body in the water 40 px above them)
      p.dir = 'e'; p.x = RIM.x; p.y = RIM.y; swimmer = { y: RIM.water }; p.pose = 'alan_bn_rim'; sfx('splash', 0.3); S.splashAt(RIM.x, RIM.water, 0.35);
      await T(800);
      p.pose = 'alan_bn_x_haul'; await T(IB + 200);                      // up on locked arms
      await G.fade(true);
      shocked(false); if (c) c.pose = null;
      // up onto the tank's front edge, Celeste's towel snatched off the corner beside him and over his lap (the user's
      // board: sitting on the edge, then out over the rim, then down): his seat on the rim's top, legs over the front
      S.bathTowelTaken = true; // the towel is off the tank's corner from here
      swimmer = null; p.sink = 0; onTank = true; p.h = SEAT.h; p.x = SEAT.x; p.y = SEAT.y; p.dir = 'e'; p.pose = 'alan_bn_sit'; // (painted facing left)
      await G.fade(false);
      await T(900);
      // out over the rim by the corner, then down off it (drawn just in front of the tank)
      onTank = false; p.h = null; p.x = 790; p.y = 660; await show('alan_bn_x_swing', IB); // legs round, off the edge
      p.x = 770; p.y = 650; await show('alan_bn_climb', 800); // (his boxers at his feet)
      p.x = CORNER.x - 10; p.y = CORNER.y - 8; await show('alan_bn_x_climb_down', IB); // (painted facing left)
      p.x = CORNER.x - 15; p.y = CORNER.y; await show('alan_bn_stepdown', 700);  // (painted facing left)
      p.x = 770; p.y = 650;
      await show('alan_bn_x_tuck', IB, true);                           // down, the towel tucked in
      await show('alan_bn_towel', 0, true);
      await say('celeste_bath_2');
      shorts = null; // the painted ones in his hand now
      await show('alan_bn_x_pick_up', IB, true);                        // his boxers picked up off the floor
      await show('alan_bn_pants_on', 900, true);                        // stepping into the boxers
      await show('alan_bn_x_shorts_knees', IB, true);                   // up to his knees under the towel
      await show('alan_bn_pants_up', 900, true);                        // ...pulled up under the towel
      await show('alan_bn_x_jeans_ready', IB, true);                    // the towel dropped, the jeans held open
      p.dir = 'e'; p.pose = 'alan_bn_jeans_off'; await hop(-4, 3, 200); // back into the jeans
      await show('alan_bn_x_jeans_knees', IB, true);                    // (played backwards: pulled up)
      await show('alan_bn_zip', 600, true);                              // the fly
      await show('alan_bn_x_unbutton', IB, true);                       // (played backwards: buttoned)
      await show('alan_bn_belt', 600, true);                             // the belt buckled
      await show('alan_bn_x_tee_toss', IB, true);                       // (played backwards: the tee picked up)
      await show('alan_bn_tee', 800, true);                              // the tee back on
      await show('alan_bn_x_tee_up', IB, true);                         // (played backwards: pulled down)
      await show('alan_bn_jacket_off', 700, true);                       // the jacket picked up
      await show('alan_bn_x_jacket_arm', IB, true);                     // (played backwards: an arm in)
      await show('alan_bn_dressed', 0, true);                           // collar up
      await joke('alan_bath_3');
      p.crossFadeAll(0); p.pose = null;
      F().bathed = true;
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
    // what it costs him, in 1995 (no joke, no score)
    await say('alan_laundry_quiet');
    await G.say('narr_laundry', { offscreen: true });
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
      // "Rui says..." only if Rui told him about the fog; otherwise an unvoiced question
      { get line() { return F().rui_fog_heard ? 'alan_ask_river' : null; }, get label() { return F().rui_fog_heard ? null : 'Tell me about the river.'; }, once: true, run: async () => {
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
      { line: 'alan_ask_celeste_mother', once: true, when: () => !F().mother_planted, run: async () => {
        await say('celeste_mother_1', 'alan_mother_1', 'celeste_mother_2'); // no joke, no score
        F().mother_planted = true;
      } },
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
  // (no second hands here: every clock in the shop stopped at 03:12, the minute he died; only the tide clock runs)
  // thin second hands, each ticking on its own beat (no two clocks in a clockmaker's shop agree)
  S.clockSeconds = function (g, t, clocks) {
    g.save(); g.lineCap = 'round';
    clocks.forEach(([x, y, r], i) => {
      const s = t + i * 0.37 + i * i * 0.11, k = Math.floor(s) + Math.min(1, (s % 1) * 9); // a quick step, then still
      const a = (k + i * 7) / 60 * Math.PI * 2;
      g.strokeStyle = 'rgba(28,18,10,0.8)'; g.lineWidth = Math.max(1, r * 0.035);
      g.beginPath(); g.moveTo(x - Math.sin(a) * r * 0.16, y + Math.cos(a) * r * 0.16); g.lineTo(x + Math.sin(a) * r * 0.74, y - Math.cos(a) * r * 0.74); g.stroke();
      g.fillStyle = 'rgba(28,18,10,0.85)'; g.beginPath(); g.arc(x, y, Math.max(1.2, r * 0.05), 0, 7); g.fill();
    });
    g.restore();
  };
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
      FX.trickles(g, t, [1099, 196, 91, 256], 6, '170,190,210', 0.35); // rain on the door glass
      if (!lit()) return;
      FX.ripple(g, G.bgImage(), [511, 318, 28, 28], t * 2, 0.6, 0.5); // heat over the lamp chimney
      const f = 1 + 0.03 * Math.sin(t * 7.3) * Math.sin(t * 3.1);
      g.save();
      const gr = g.createRadialGradient(523, 400, 60 * f, 560, 420, 760);
      gr.addColorStop(0, 'rgba(8,5,2,0)'); gr.addColorStop(0.35, 'rgba(8,5,2,0.28)'); gr.addColorStop(1, 'rgba(6,4,2,0.62)');
      g.fillStyle = gr; g.fillRect(0, 0, 1280, 720);
      g.restore();
      FX.flame(g, t, 525, 394, 15, 6, '255,190,110'); // the oil lamp
      FX.sweep(g, t, [0, 30, 100, 390], 47, '230,225,200', 0.16); // a car's headlights across the blinds now and then
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
      { name: 'Desk drawer', rect: [560, 470, 160, 30], at: [800, 640], face: 'w', // beside the drawer, not in front of it
        when: () => lit() && !F().drawer_unlocked,
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
