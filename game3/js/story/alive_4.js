// Alive pass, group 4: the police station, the foundry, the shore and the hub map. Small movements drawn over the
// paintings each frame, deterministic in t (alive.js chains them after the rooms' own drawing). Coordinates are the
// paintings' own, 1280x720.
(function () {
  const S = window.S;
  const clip = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip(); };
  const lamp = (g, t, x, y, r, rgb, a, seed, live) => FX.glow(g, x, y, r, rgb, a * (live ? FX.flicker(t, seed) : 0.94 + 0.06 * Math.sin(t * 0.9 + seed)));
  // a thin line of foam washing up a shoreline and back (lists of points)
  function foam(g, t, lines, o) {
    const per = o.per || 7, reach = o.reach || 6, a = o.a || 0.35;
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    lines.forEach((pts, j) => {
      for (let k = 0; k < 2; k++) {
        const p = ((t / per + j * 0.37 + k * 0.5) % 1), dy = reach * Math.sin(p * Math.PI), al = a * Math.sin(p * Math.PI);
        g.strokeStyle = `rgba(235,238,236,${al.toFixed(3)})`; g.lineWidth = o.w || 1.6;
        g.beginPath(); pts.forEach(([x, y], i) => { const yy = y + dy + Math.sin(x * 0.05 + t * 0.8) * 0.8; i ? g.lineTo(x + (o.dx || 0) * Math.sin(p * Math.PI), yy) : g.moveTo(x, yy); }); g.stroke();
      }
    });
    g.restore();
  }
  // a ceiling fan turning: soft translucent blades under the painted ones
  function ceilFan(g, t, x, y, rx, ry, rps, a) {
    g.save(); g.translate(x, y); g.scale(1, ry / rx); g.fillStyle = `rgba(20,16,12,${a || 0.12})`;
    for (let i = 0; i < 5; i++) { const b = t * rps * Math.PI * 2 + i * Math.PI * 2 / 5; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, rx, b, b + 0.3); g.closePath(); g.fill(); }
    g.restore();
  }
  // lightning now and then: a brief double flash over the sky (and a faint wash over everything)
  function lightning(g, t, sky, period, seed) {
    const cyc = Math.floor(t / period), p = t - cyc * period, r = FX.rng(cyc * 31 + seed);
    if (r() < 0.35) return;
    const at = 1 + r() * (period - 3), d = p - at; if (d < 0 || d > 0.6) return;
    const k = d < 0.08 ? 1 : d < 0.16 ? 0.2 : d < 0.26 ? 0.75 : Math.max(0, 1 - (d - 0.26) / 0.34) * 0.5;
    g.save(); g.globalCompositeOperation = 'lighter';
    g.save(); clip(g, sky); g.fillStyle = `rgba(190,205,235,${(0.28 * k).toFixed(3)})`; g.fillRect(0, 0, 1280, 720); g.restore();
    g.fillStyle = `rgba(170,185,215,${(0.06 * k).toFixed(3)})`; g.fillRect(0, 0, 1280, 720);
    g.restore();
  }
  // rain over the whole frame: two layers of slanted streaks
  function storm(g, t, n, a) { FX.rain(g, t, [0, 0, 1280, 720], n, '200,210,225', a); FX.rain(g, t * 0.7 + 3, [0, 0, 1280, 720], Math.round(n * 0.6), '170,180,200', a * 0.6); }
  const CL = {};
  const clouds = (key, seed, rgb, n) => CL[key] || (CL[key] = FX.makeClouds(seed, rgb, n));

  // ================================================================ the cells: the bulb hums and stutters, the pipe sweats
  S.ALIVE.police_cell = (g, t) => {
    // the bare bulb: a steady glow that now and then stutters (a bad contact)
    const cyc = Math.floor(t / 9), p = t - cyc * 9, r = FX.rng(cyc * 7 + 3), stut = r() < 0.6 && p > 4 && p < 4.35 ? (Math.sin(p * 90) > 0 ? 0.35 : 1) : 1;
    FX.glow(g, 643, 34, 70, '255,225,160', 0.22 * stut * (0.96 + 0.04 * Math.sin(t * 50)));
    FX.glow(g, 643, 200, 420, '255,220,150', 0.035 * stut);
    if (stut < 1) { g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 0, 1280, 720); }
    // the pipe sweats: drops gathering under the elbow and falling to the floor, rings on the wet patch by the drain
    FX.drips(g, t, [[858, 560, 372, 5.5], [905, 545, 372, 8.3]], '200,200,185');
    // a moth round the bulb
    FX.moth(g, t, 643, 46, 26, 14, 2, 'rgba(230,220,190,0.7)');
  };

  // ================================================================ Batista's office: the fan, the tube light, the harbour through the shutters
  S.ALIVE.batista_office = (g, t, bg, im) => {
    ceilFan(g, t, 660, 44, 150, 22, 0.9, 0.1);
    // the strip light: a faint hum in its brightness, one flicker now and then
    const cyc = Math.floor(t / 13), p = t - cyc * 13, fl = FX.rng(cyc * 11)() < 0.5 && p > 6 && p < 6.12 ? 0.4 : 1;
    FX.glow(g, 656, 126, 160, '230,240,235', 0.1 * fl * (0.97 + 0.03 * Math.sin(t * 60)));
    // through the window: the city lights over the water winking, the sea moving
    FX.twinkle(g, t, [[905, 268, 1.5], [925, 266, 1.5], [948, 270, 1.4], [972, 267, 1.6], [995, 269, 1.4], [1018, 266, 1.5], [1040, 268, 1.5], [1062, 270, 1.4]], '255,220,160');
    FX.ripple(g, im, [896, 278, 182, 58], t * 0.5, 1.2, 0.3);
    // the shutters breathing a little in the draught
    FX.billow(g, im, [818, 116, 74, 226], t, 0.8, 7);
    // steam off the coffee cup
    FX.wisps(g, t, 585, 360, { n: 4, rise: 40, spread: 6, a: 0.08, size: 6 });
  };

  // ================================================================ the station steps at dawn: the flag, the palms, the porch lamp, the puddles
  S.ALIVE.police_steps = (g, t, bg, im) => {
    FX.sway(g, im, [786, 96, 60, 96], t * 1.2, 4, 0.5, false);             // the flag stirring (held at the pole)
    FX.sway(g, im, [176, 180, 120, 120], t * 0.6, 3, 0.2, true);            // the palm, left
    FX.sway(g, im, [940, 170, 145, 120], t * 0.6, 3, 1.4, true);            // the palm, right
    lamp(g, t, 629, 265, 40, '255,200,120', 0.25, 5, false);                // the porch light over the door
    FX.glow(g, 637, 320, 70, '255,190,110', 0.05 * (0.95 + 0.05 * Math.sin(t * 1.3)));
    // the dawn sky: slow cloud drifting behind the building
    g.save(); clip(g, [[0, 0], [1280, 0], [1280, 140], [1000, 150], [940, 60], [320, 120], [300, 290], [0, 120]]);
    FX.drawClouds(g, clouds('steps', 5, '150,160,190', 18), t, 4, -40, 0.4); g.restore();
    // the puddles shiver
    FX.ripple(g, im, [1000, 625, 270, 80], t, 1, 0.5); FX.ripple(g, im, [220, 670, 120, 40], t * 1.1, 0.8, 0.6); FX.ripple(g, im, [780, 560, 130, 40], t * 0.9, 0.8, 0.4);
    // the police pickup's light bar turning, very faint (a car left with its lights on)
    const s = 0.5 + 0.5 * Math.sin(t * 5);
    FX.glow(g, 1052, 359, 18, '80,120,255', 0.25 * s); FX.glow(g, 1082, 359, 18, '255,60,60', 0.25 * (1 - s));
  };

  // ================================================================ the foundry yard: the furnace, the wind, the water across the yard
  S.ALIVE.foundry_yard = (g, t, bg, im) => {
    // the furnace mouth glowing, embers lifting, heat shimmer over the flue and smoke off the chimney
    lamp(g, t, 534, 395, 70, '255,140,60', 0.3, 1, true);
    FX.embers(g, t, 534, 420, 7);
    FX.ripple(g, im, [488, 0, 90, 30], t * 1.6, 1.4, 0.5);
    FX.wisps(g, t, 528, 26, { n: 8, rise: 120, spread: 16, rgb: '90,90,95', a: 0.12, size: 18, speed: 0.22, dark: true });
    // the palm bending in the wind, the clouds racing
    FX.sway(g, im, [20, 26, 220, 200], t * 1.1, 6, 0.3, true);
    g.save(); clip(g, [[0, 0], [1280, 0], [1280, 20], [1010, 70], [640, 140], [575, 40], [480, 30], [420, 230], [240, 230], [0, 200]]);
    FX.drawClouds(g, clouds('foundry', 9, '190,190,195', 22), t, 14, -30, 0.35); g.restore();
    // the chains on the gantry swinging a hair, the bell's crate running with water
    FX.sway(g, im, [682, 180, 24, 230], t * 0.8, 1.2, 0.7, false);
    FX.sway(g, im, [850, 150, 22, 120], t * 0.8, 1.0, 1.9, false);
    FX.trickles(g, t, [945, 420, 280, 150], 7, '210,220,225', 0.5);
    // rain on the flooded yard: rings spreading
    FX.drips(g, t, [[200, 610, 0, 3.1], [430, 650, 0, 2.7], [760, 600, 0, 3.5], [880, 690, 0, 2.9], [1100, 640, 0, 3.3], [300, 540, 0, 4.1], [620, 700, 0, 3.7]].map(d => [d[0], d[1], d[1] - 1, d[3]]), '200,205,210');
    FX.ripple(g, im, [0, 580, 1280, 140], t * 0.5, 0.5, 0.08);
  };
  S.ALIVE_FG.foundry_yard = (g, t) => storm(g, t, 120, 0.12);

  // ================================================================ Don Faustino's office: the clock, the fan, the furnace through the window
  S.ALIVE.foundry_office = (g, t, bg, im) => {
    // the wall clock's second hand ticking (a thin red hand over the painted face)
    const s = Math.floor(t) % 60, a = s / 60 * Math.PI * 2 - Math.PI / 2;
    g.save(); g.strokeStyle = 'rgba(150,30,20,0.85)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(88, 136); g.lineTo(88 + Math.cos(a) * 36, 136 + Math.sin(a) * 36); g.stroke();
    g.fillStyle = 'rgba(40,30,20,0.9)'; g.beginPath(); g.arc(88, 136, 2.2, 0, 7); g.fill(); g.restore();
    // the electric fan turning
    FX.fan(g, t, 651, 263, 34, 40);
    // the desk lamp's pool of light, the furnace's glow flickering in the window
    lamp(g, t, 352, 300, 80, '255,215,150', 0.12, 2, false);
    lamp(g, t, 960, 262, 40, '255,150,60', 0.35, 4, true);
    // rain running down the window, dust in the lamplight
    FX.trickles(g, t, [740, 92, 280, 225], 8, '200,210,220', 0.45);
    FX.motes(g, t, 290, 280, 140, 90, 10, '255,230,190');
    // the apron on its peg, stirred by the fan
    FX.billow(g, im, [1080, 150, 90, 250], t, 0.7, 5);
  };

  // ================================================================ the old steps below the wall: the sea, the palm, the clouds (before the night: the first rain)
  S.ALIVE.shore_steps = (g, t, bg, im) => {
    g.save(); clip(g, [[670, 0], [1280, 0], [1280, 285], [1180, 290], [670, 260]]);
    FX.drawClouds(g, clouds('shore_steps', 3, '70,72,80', 24), t, 7, -40, 0.5); g.restore();
    FX.sway(g, im, [0, 0, 380, 190], t * 0.9, 5, 0.4, true);                 // the palm over the wall
    FX.ripple(g, im, [650, 330, 630, 150], t * 0.7, 1.2, 0.15);              // the sea
    FX.water(g, t, 700, 340, 560, 140, '170,180,190');
    foam(g, t, [[[620, 378], [640, 404], [700, 432], [800, 466], [880, 494], [920, 512]], [[700, 420], [820, 450], [960, 470], [1040, 470]]], { per: 6, reach: 6, a: 0.22, w: 1.5, dx: -5 });
    FX.sway(g, im, [700, 500, 200, 50], t * 0.8, 1.5, 0.6, true);            // the weeds on the steps
    FX.rain(g, t, [0, 0, 1280, 720], 60, '190,200,215', 0.08);
  };
  S.ALIVE_FG.shore_steps = (g, t) => { if ((S.F().ch || 0) >= 8) storm(g, t, 140, 0.14); };

  // ================================================================ Playa de las Negras at night, the storm: surf on the rock, the lamps, lightning
  S.ALIVE.playa_negras = (g, t, bg, im) => {
    lightning(g, t, [[0, 0], [1280, 0], [1280, 0], [520, 70], [510, 300], [0, 330]], 14, 3);
    for (const r of [[0, 335, 520, 50], [0, 385, 128, 82], [0, 467, 520, 100]]) FX.ripple(g, im, r, t * 1.1, 2, 0.15);   // the sea heaving (round the flat rock)
    // the surf breaking over the flat rock and washing in
    foam(g, t, [[[60, 468], [110, 460], [140, 452]], [[10, 512], [90, 500], [190, 488], [290, 478], [380, 470]], [[0, 548], [100, 540], [220, 526], [330, 512]]], { per: 5, reach: 8, a: 0.22, w: 1.6, dx: 10 });
    { const p = (t % 5) / 5, k = Math.max(0, Math.sin(p * Math.PI * 2)); FX.glow(g, 110, 410, 90, '220,230,240', 0.12 * k); }   // spray off the rock
    FX.water(g, t, 0, 350, 500, 200, '200,210,220');
    // the lamps on the wall and over the stair in the wind
    lamp(g, t, 945, 26, 34, '255,200,120', 0.4, 1, true); lamp(g, t, 765, 88, 30, '255,200,120', 0.35, 2, true); lamp(g, t, 985, 222, 26, '255,190,110', 0.35, 3, true);
    // their light shaking on the wet sand
    FX.ripple(g, im, [850, 420, 230, 180], t * 1.3, 1, 0.2);
    FX.sway(g, im, [790, 36, 80, 70], t * 1.4, 4, 0.2, true);                // the palm on the rampart, thrashing
    FX.twinkle(g, t, [[90, 333], [130, 334], [180, 332], [240, 330], [290, 328], [330, 322], [380, 318]], '255,210,150');
  };
  S.ALIVE_FG.playa_negras = (g, t) => storm(g, t, 170, 0.16);

  // ================================================================ the water's edge: the breakers, the tide in the shallows, the rain
  S.ALIVE.shore_water = (g, t, bg, im) => {
    lightning(g, t, [[440, 0], [1280, 0], [1280, 345], [600, 345], [450, 330]], 16, 9);
    // the breakers rolling in along the reef line
    foam(g, t, [[[600, 385], [700, 405], [820, 425], [960, 440], [1100, 450], [1270, 455]], [[700, 372], [850, 375], [1000, 385], [1160, 395], [1280, 398]], [[880, 360], [1040, 362], [1200, 368]]], { per: 4.5, reach: 7, a: 0.28, w: 1.8, dx: -8 });
    FX.ripple(g, im, [580, 350, 700, 120], t * 1.2, 2, 0.12);
    // the shallows over the paving: the water sliding, the light on it
    for (const r of [[0, 440, 1280, 138], [0, 578, 440, 142], [812, 578, 468, 142], [440, 668, 372, 52]]) FX.ripple(g, im, r, t * 0.8, 1.6, 0.1);   // (round the rock)
    FX.water(g, t, 0, 450, 1280, 260, '190,180,160');
  };
  S.ALIVE_FG.shore_water = (g, t) => storm(g, t, 170, 0.16);

  // ================================================================ the hub map: a cloud's shadow over the city, the Ozama glinting
  S.ALIVE.hub = (g, t) => {
    // the river: glints moving down to the sea
    g.save(); clip(g, [[805, 0], [975, 0], [930, 120], [980, 330], [1140, 420], [1210, 520], [1190, 720], [880, 720], [830, 560], [870, 380], [830, 160]]);
    FX.water(g, t * 0.7, 800, 0, 420, 720, '235,245,250'); g.restore();
    // two cloud shadows drifting slowly west to east across the old city
    for (const [sp, off, yy, r] of [[11, 0, 260, 300], [8, 900, 470, 240]]) {
      const x = ((t * sp + off) % 1900) - 320, y = yy + Math.sin(t * 0.05 + off) * 50;
      g.save(); g.translate(x, y); g.rotate(0.2); g.scale(1, 0.6);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, 'rgba(30,30,40,0.10)'); gr.addColorStop(1, 'rgba(30,30,40,0)');
      g.fillStyle = gr; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore();
    }
    // a gull or two over the harbour mouth
    FX.birds(g, t, { y0: 520, y1: 640, n: 2, period: 24, color: 'rgba(250,250,250,0.7)', size: 5, x0: 700, x1: 1280 });
  };
})();
