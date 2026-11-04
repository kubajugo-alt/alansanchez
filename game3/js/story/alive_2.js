// The Forgotten Rhythm — alive pass, group 2: the cathedral (nave, tower stair, bell-chamber, cloister, archive), the old
// city (Parque Colón and its wet and windy days, El Conde, the wall over the Ozama) and the Archbishop's palace (courtyard,
// study, dining room). Small movements over the paintings, drawn each frame and deterministic in t (alive.js chains them).
// Only what is painted moves; the bell never does (at most the rope stirs).
(function () {
  const S = window.S, A = S.ALIVE;
  const clip = (g, shapes) => {
    g.beginPath();
    for (const s of shapes) {
      if (typeof s[0] === 'number') g.rect(s[0], s[1], s[2], s[3]);
      else { s.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); }
    }
    g.clip();
  };
  const BANKS = {};
  const clouds = (g, t, key, shapes, o) => {
    const cl = BANKS[key] || (BANKS[key] = FX.makeClouds(o.seed || 11, o.rgb || '238,236,230', o.n || 22));
    g.save(); clip(g, shapes); FX.drawClouds(g, cl, t, o.speed || 4, o.y || 0, o.a || 0.35); g.restore();
  };
  const lamp = (g, t, x, y, r, rgb, a, seed, live) => FX.glow(g, x, y, r, rgb, a * (live ? FX.flicker(t, seed) : 0.94 + 0.06 * Math.sin(t * 0.9 + seed)));
  const candle = (g, t, x, y, h, seed) => { FX.flame(g, t, x, y, h, seed); FX.glow(g, x, y - h * 0.5, h * 3.2, '255,190,110', 0.16 * FX.flicker(t, seed)); };
  // an arch: its sides and its rounded head, as a clip path
  const arch = (x0, x1, yTop, yBot) => { const cx = (x0 + x1) / 2, r = (x1 - x0) / 2, pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + Math.PI * i / 16; pts.push([cx + r * Math.cos(a), yTop + r + r * Math.sin(a)]); } pts.push([x1, yBot], [x0, yBot]); return pts; };

  // ================================================================ the nave: the light through the high windows, St Michael's candle
  A.cathedral_nave = (g, t) => {
    // the slanted shaft from the left windows down across the pews, and its dust
    FX.shaft(g, [[60, 40], [200, 150], [520, 620], [300, 640]], '255,226,170', 0.07, 0.15);
    FX.motes(g, t, 120, 160, 300, 420, 22, '255,228,180');
    // St Michael's red candle on the altar, and the chapel lamps flickering in the dark
    candle(g, t, 917, 388, 11, 1.3);
    lamp(g, t, 334, 330, 70, '255,196,120', 0.08, 2.1, true);
    lamp(g, t, 50, 365, 40, '255,190,110', 0.1, 3.4, true);
    lamp(g, t, 550, 330, 34, '255,190,110', 0.08, 4.2, true);
  };

  // ================================================================ the tower stair: the slit of sea, its blade of light, the rope, the niche candle
  A.tower_stair = (g, t, bg, im) => {
    FX.ripple(g, im, [884, 232, 15, 34], t * 0.7, 0.8, 0.3);                   // the sea through the slit
    FX.shaft(g, [[860, 80], [898, 95], [940, 640], [800, 640]], '255,236,200', 0.04, 0.2);
    FX.motes(g, t, 800, 110, 120, 420, 10, '255,236,200');
    FX.sway(g, im, [712, 0, 22, 500], t * 0.5, 1.6, 0, false);               // the bell rope stirring at its free end
    candle(g, t, 1072, 318, 9, 0.7);
  };

  // ================================================================ the bell-chamber: the sky and the sea through both arches (sunset: red); she hangs still
  const BELL_R = arch(922, 1136, 95, 330), BELL_L = arch(20, 132, 45, 300);
  A.bell_chamber = (g, t, bg, im) => {
    const sun = bg === 'bell_chamber__sun_sunset';
    clouds(g, t, sun ? 'bell_sun' : 'bell', [BELL_R, BELL_L], { speed: 3, a: sun ? 0.22 : 0.3, rgb: sun ? '255,120,70' : '250,238,220', seed: 7 });
    FX.water(g, t * 0.7, 926, 330, 205, 120, sun ? '255,140,90' : '255,236,200');      // the sea glittering under the sun
    g.save(); clip(g, [BELL_R]); FX.birds(g, t, { y0: 150, y1: 270, n: 2, period: 23, size: 4, x0: 900, x1: 1160, color: sun ? 'rgba(40,10,10,0.6)' : 'rgba(50,40,40,0.55)' }); g.restore();
    FX.motes(g, t, 820, 300, 330, 260, 12, sun ? '255,150,110' : '255,230,190');
    FX.sway(g, im, [904, 440, 26, 60], t * 0.5, 0.6, 1, false);              // the coiled rope's loose end
  };

  // ================================================================ the cloister: the palms, the sky over the roof, swallows
  const CLOISTER_SKY = [[[200, 0], [1050, 0], [1080, 125], [840, 140], [840, 175], [710, 180], [640, 190], [560, 165], [400, 95], [200, 5]]];
  A.cathedral_cloister = (g, t, bg, im) => {
    clouds(g, t, 'cloister', CLOISTER_SKY, { speed: 3.5, a: 0.3, seed: 3 });
    FX.sway(g, im, [418, 18, 196, 170], t * 0.8, 2.2, 0, true);               // the tall palm's crown
    FX.sway(g, im, [626, 196, 116, 104], t * 0.8, 1.4, 1.1, true);
    FX.sway(g, im, [566, 300, 80, 70], t * 0.8, 1.0, 2.0, true);
    FX.sway(g, im, [916, 300, 110, 100], t * 0.8, 1.0, 2.7, true);           // the ferns by the graves
    g.save(); clip(g, CLOISTER_SKY); FX.birds(g, t, { y0: 20, y1: 120, n: 3, period: 21, size: 5, x0: 180, x1: 1100 }); g.restore();
  };

  // ================================================================ the archive: the window's light and its dust, the green lamp
  A.cathedral_archive = (g, t) => {
    FX.shaft(g, [[895, 110], [945, 110], [800, 690], [620, 690]], '235,238,240', 0.05, 0.1);
    FX.motes(g, t, 720, 150, 230, 480, 20, '235,236,230');
    lamp(g, t, 594, 400, 60, '220,240,200', 0.07, 1, false);
  };

  // ================================================================ Parque Colón: the trees, the sky, the fountain; wet in the morning; the wind on Tuesday
  const PARQUE_SKY = [[[410, 0], [930, 0], [930, 60], [880, 120], [860, 140], [760, 220], [700, 225], [600, 255], [510, 245], [460, 210], [420, 150]]];
  const BITS = 14;
  A.parque_colon = (g, t, bg, im) => {
    const wind = bg === 'parque_colon__wind', wet = bg === 'parque_colon__wet_morning';
    const k = wind ? 4.5 : 1, sp = wind ? 2.4 : 0.7;
    clouds(g, t, wind ? 'parque_w' : wet ? 'parque_g' : 'parque', PARQUE_SKY, { speed: wind ? 22 : 3, a: wind ? 0.45 : 0.3, rgb: wind ? '70,74,82' : wet ? '150,152,156' : '240,238,232', seed: 5 });
    FX.sway(g, im, [0, 0, 425, 420], t * sp, 1.6 * k, 0, true);                // the big tree on the left
    FX.sway(g, im, [920, 0, 360, 260], t * sp, 1.4 * k, 1.3, true);            // the tree over the cathedral front
    FX.sway(g, im, [800, 200, 150, 220], t * sp, 1.2 * k, 2.2, true);
    FX.sway(g, im, [412, 330, 84, 100], t * sp, 1.0 * k, 0.8, true);
    FX.sway(g, im, [436, 200, 64, 66], t * sp, 1.4 * k, 1.7, true);            // the palm behind
    FX.ripple(g, im, [984, 395, 22, 95], t, 0.5, 0.4);                       // the fountain running
    if (!wind) { g.save(); clip(g, PARQUE_SKY); FX.birds(g, t, { y0: 30, y1: 160, n: 3, period: 24, size: 5, x0: 380, x1: 960, color: 'rgba(50,50,56,0.6)' }); g.restore(); }
    if (wet) {
      FX.ripple(g, im, [596, 636, 170, 56], t * 0.6, 0.7, 0.5);              // the puddle
      g.save(); clip(g, [[[0, 520], [780, 470], [930, 720], [0, 720]]]); FX.water(g, t * 0.5, 0, 500, 930, 220, '200,210,220'); g.restore();   // the band, still glistening
    }
    if (wind) {
      FX.leaves(g, t, 520, 690, 5); FX.leaves(g, t + 2.3, 560, 700, 7);
      // rubbish and torn leaves blowing across the square, high and low
      g.save();
      for (let i = 0; i < BITS; i++) {
        const per = 3 + (i % 5) * 0.7, p = ((t + i * 0.83) % per) / per, x = -40 + 1360 * p, y = 120 + ((i * 97) % 520) + Math.sin(t * 5 + i) * 18;
        g.save(); g.translate(x, y); g.rotate(t * (4 + i % 3) + i); g.fillStyle = i % 3 ? 'rgba(52,58,40,0.7)' : 'rgba(210,205,190,0.55)';
        g.fillRect(-4, -2, 8, 4); g.restore();
      }
      g.restore();
      FX.rain(g, t, [0, 0, 1280, 720], 90, '200,206,214', 0.12);
    }
  };

  // ================================================================ El Conde: awnings, clouds over the gate, the tree beyond the arch, swallows
  const CONDE_SKY = [[[420, 0], [940, 0], [940, 80], [850, 110], [820, 210], [770, 230], [640, 250], [600, 200], [540, 90], [480, 30]]];
  A.el_conde = (g, t, bg, im) => {
    clouds(g, t, 'conde', CONDE_SKY, { speed: 3, a: 0.32, seed: 9 });
    FX.billow(g, im, [0, 196, 215, 112], t, 1.6, 5.5);                         // the navy awning
    FX.billow(g, im, [356, 284, 100, 72], t, 1.2, 6.1);
    FX.billow(g, im, [920, 268, 140, 84], t, 1.3, 5.2);                        // the red awning
    FX.billow(g, im, [1024, 226, 206, 124], t, 1.5, 5.9);                      // the green one
    FX.sway(g, im, [706, 208, 104, 72], t * 0.8, 1.2, 0.9, true);              // the tree beyond the gate
    FX.sway(g, im, [180, 350, 110, 130], t * 0.7, 0.9, 1.7, true);             // the palm in its pot
    g.save(); clip(g, CONDE_SKY); FX.birds(g, t, { y0: 30, y1: 180, n: 3, period: 22, size: 4, x0: 400, x1: 960 }); g.restore();
  };

  // ================================================================ the wall over the Ozama: the sunset sky, the river glittering, the boats riding
  const WALL_RIVER = [[[0, 252], [1280, 250], [1280, 300], [1172, 300], [1168, 390], [866, 386], [866, 300], [680, 296], [598, 312], [590, 400], [482, 396], [440, 300], [0, 300]]];
  A.city_wall = (g, t, bg, im) => {
    clouds(g, t, 'wall', [[0, 0, 1280, 200]], { speed: 2.5, a: 0.25, rgb: '255,180,130', seed: 13 });
    lamp(g, t, 36, 206, 70, '255,200,120', 0.12, 1, false);                    // the sun on the horizon
    g.save(); clip(g, WALL_RIVER); FX.water(g, t * 0.5, 0, 252, 1280, 140, '255,200,150'); g.restore();
    FX.ripple(g, im, [928, 296, 110, 34], t * 0.6, 0.6, 0.15);                 // the moored boat riding
    FX.ripple(g, im, [348, 258, 48, 14], t * 0.6, 0.5, 0.3);
    FX.birds(g, t, { y0: 60, y1: 180, n: 4, period: 27, size: 5, x0: -40, x1: 1320, color: 'rgba(40,24,20,0.6)' });
  };

  // ================================================================ the palace courtyard: the palm, the fountain, the shrubs, the palm's shadow
  A.palace_courtyard = (g, t, bg, im) => {
    FX.sway(g, im, [960, 56, 300, 210], t * 0.7, 2.0, 0, true);                // the palm's crown
    FX.ripple(g, im, [868, 300, 64, 170], t, 0.5, 0.5);                        // the fountain's tiers running
    FX.sway(g, im, [628, 405, 70, 70], t * 0.6, 0.6, 1.2, true);
    FX.sway(g, im, [960, 410, 90, 80], t * 0.6, 0.6, 2.3, true);
    FX.dapple(g, t, [1010, 470, 250, 120], 7, 0.07);                           // the palm's shadow on the stones
  };

  // ================================================================ the bishop's study: light through the shutters, dust in it, the fern
  A.bishop_study = (g, t, bg, im) => {
    FX.shaft(g, [[1108, 60], [1192, 60], [1050, 680], [820, 680]], '255,232,190', 0.04, 0.12);
    FX.motes(g, t, 880, 120, 320, 470, 14, '255,230,190');
    FX.sway(g, im, [1032, 330, 116, 120], t * 0.5, 0.6, 0, true);
  };

  // ================================================================ the dining room: fifteen candles, three wall lanterns
  const CANDLES = [[383, 309], [394, 307], [406, 296], [418, 307], [430, 309], [656, 311], [669, 307], [683, 291], [696, 307], [708, 311],
    [936, 313], [950, 307], [964, 288], [978, 307], [992, 313]];
  A.palace_dining = (g, t) => {
    CANDLES.forEach(([x, y], i) => FX.flame(g, t, x, y, 9, i * 1.7));
    [[406, 330], [683, 335], [964, 335]].forEach(([x, y], i) => FX.glow(g, x, y, 130, '255,196,120', 0.08 * FX.flicker(t, i * 3)));
    [[222, 236], [873, 240], [1266, 226]].forEach(([x, y], i) => lamp(g, t, x, y, 46, '255,196,120', 0.18, i + 4, true));
  };
})();
