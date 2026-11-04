// The Forgotten Rhythm — alive pass, group 5: the 1586 rooms, Lisbon (Game I's own paintings, their Game I details
// ported) and Vasco's office. Small movements drawn over the paintings, deterministic in t (alive.js chains them).
(function () {
  const S = window.S, ALIVE = S.ALIVE, FG = S.ALIVE_FG;
  const clip = (g, shapes) => { g.beginPath(); for (const s of shapes) { if (typeof s[0] === 'number') g.rect(s[0], s[1], s[2], s[3]); else { s.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); } } g.clip(); };
  const BANKS = {};
  const drift = (g, t, key, shapes, o) => {
    const cl = BANKS[key] || (BANKS[key] = FX.makeClouds(o.seed || 11, o.rgb || '238,236,228', o.n || 18));
    g.save(); clip(g, shapes); FX.drawClouds(g, cl, t, o.speed || 4, o.y || 0, o.a || 0.3); g.restore();
  };
  // fog drifting past a window pane (Game I's S.windowFog)
  const windowFog = (g, t, rect, rgb, a) => {
    g.save(); g.beginPath(); g.rect(...rect); g.clip();
    for (let i = 0; i < 6; i++) {
      const x = rect[0] + ((t * (6 + i * 2) + i * 140) % (rect[2] + 300)) - 150, y = rect[1] + rect[3] * (0.25 + 0.13 * i);
      const gr = g.createRadialGradient(x, y, 0, x, y, 120);
      gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(x - 120, y - 120, 240, 240);
    }
    g.restore();
  };
  // a fire on a roof: a few flames licking up out of a painted blaze, and its glow breathing
  const blaze = (g, t, x, y, w, h, seed) => {
    FX.ripple(g, G().bgImage(), [x, y - h * 0.6, w, h * 1.6], t * 2.2, 1.4, 0.3);   // heat shimmer over the painted flames
    FX.glow(g, x + w / 2, y + h * 0.5, w * 0.9, '255,120,40', 0.18 * FX.flicker(t, seed));
  };
  const G = () => window.Game;

  // ================================================================ 1586: the river mouth (three visits; visit 1: the birds are gone)
  const SKY = [[[340, 0], [1280, 0], [1280, 285], [1180, 290], [820, 262], [670, 230], [600, 90], [340, 60]]];
  ALIVE.p1586_river_mouth = (g, t, bg, im) => {
    drift(g, t, 'river', SKY, { speed: 3, a: 0.22, seed: 7 });
    // visits 1 and 2 are the sign: the sky empty of birds (and on visit 2 the dead fish lie in their lines, quite still)
    if (!/__visit/.test(bg)) { g.save(); clip(g, SKY); FX.birds(g, t, { y0: 60, y1: 200, n: 3, period: 23, color: 'rgba(70,64,56,0.5)', size: 7, x0: 640, x1: 1280 }); g.restore(); }
    FX.sway(g, im, [0, 0, 380, 150], t * 0.5, 1.6, 0.3, true);                      // the palm fronds
    if (bg === 'p1586_river_mouth__visit1_birds') {
      FX.ripple(g, im, [690, 330, 590, 130], t * 0.6, 0.8, 0.09); FX.water(g, t * 0.5, 720, 340, 540, 110, '255,246,220');
      FX.sway(g, im, [262, 200, 160, 70], t * 0.6, 0.6, 1.2, true);                 // the hut's thatch
    } else if (bg === 'p1586_river_mouth__visit2_fish') {
      // the water only beyond the fish on the shore
      FX.ripple(g, im, [700, 320, 580, 60], t * 0.6, 0.7, 0.09); FX.ripple(g, im, [1010, 380, 270, 80], t * 0.6, 0.7, 0.09);
      FX.water(g, t * 0.5, 720, 325, 540, 55, '255,246,220');
      FX.sway(g, im, [178, 214, 200, 60], t * 0.6, 0.6, 1.2, true);                 // the hut's thatch
    } else {
      FX.ripple(g, im, [700, 330, 580, 120], t * 0.6, 0.8, 0.09);                   // the river, slow
      FX.water(g, t * 0.5, 720, 340, 540, 110, '255,246,220');
      FX.sway(g, im, [190, 165, 140, 70], t * 0.6, 0.6, 1.2, true);                 // the thatch's fringe
      FX.billow(g, im, [728, 385, 172, 50], t, 0.6, 7);                             // the net between its poles
    }
  };
  // ================================================================ 1586: the huts by the cane
  ALIVE.p1586_huts = (g, t, bg, im) => {
    drift(g, t, 'huts', [[[520, 0], [1280, 0], [1280, 60], [1080, 120], [900, 200], [700, 230], [520, 100]]], { speed: 3, a: 0.2, seed: 9, rgb: '255,232,200' });
    FX.flame(g, t, 384, 400, 18, 3, '255,160,70'); FX.flame(g, t + 0.4, 392, 401, 13, 5, '255,170,80');   // the cooking fire under the pot
    FX.glow(g, 386, 392, 60, '255,150,70', 0.13 * FX.flicker(t, 3));
    FX.wisps(g, t, 384, 362, { n: 10, rise: 110, spread: 14, rgb: '200,195,190', a: 0.08, size: 12, speed: 0.1 }); // its smoke
    FX.sway(g, im, [960, 95, 150, 110], t * 0.5, 0.8, 0.6, true);                   // the tree behind the huts
    FX.billow(g, im, [1146, 262, 62, 110], t, 0.9, 8);                              // the cloth hung at the hut
  };
  // ================================================================ 1586: the square, burning (Drake's month)
  ALIVE.p1586_square = (g, t, bg, im) => {
    // the smoke rolling over the sky (dark), the roofs burning
    g.save(); clip(g, [[0, 0, 1280, 260]]);
    FX.wisps(g, t, 600, 260, { n: 7, rise: 250, spread: 120, rgb: '40,30,26', a: 0.18, size: 70, speed: 0.04, dark: true });
    FX.wisps(g, t + 9, 1000, 160, { n: 6, rise: 170, spread: 90, rgb: '45,34,28', a: 0.16, size: 60, speed: 0.05, dark: true });
    g.restore();
    blaze(g, t, 940, 95, 100, 50, 1); blaze(g, t, 408, 192, 50, 34, 4); blaze(g, t, 700, 222, 50, 28, 7); blaze(g, t, 466, 316, 40, 30, 9);
    FX.glow(g, 330, 405, 26, '255,120,40', 0.2 * FX.flicker(t, 11)); FX.glow(g, 275, 300, 20, '255,130,50', 0.2 * FX.flicker(t, 13)); // fire through the arcade's openings
    FX.embers(g, t, 990, 125, 10); FX.embers(g, t + 3, 432, 215, 6); FX.embers(g, t + 6, 488, 330, 4);
    FX.sway(g, im, [0, 0, 420, 300], t * 0.5, 1.0, 0.2, true);                       // the tree in the hot wind
  };
  // ================================================================ 1586: the bell-chamber (the new bell, Drake's fleet)
  ALIVE.p1586_bell_chamber = (g, t, bg, im) => {
    drift(g, t, 'bell1586', [[930, 100, 200, 220]], { speed: 3, a: 0.2, seed: 5, rgb: '255,236,200' });
    FX.ripple(g, im, [925, 372, 210, 85], t, 0.5, 0.12);                          // the sea under the fleet
    FX.water(g, t * 0.6, 930, 375, 200, 80, '255,240,200');
    g.save(); clip(g, [[20, 60, 120, 370]]); FX.wisps(g, t, 50, 300, { n: 5, rise: 170, spread: 30, rgb: '60,50,44', a: 0.14, size: 30, speed: 0.06, dark: true }); g.restore(); // the town's smoke
    FX.glow(g, 80, 330, 40, '255,120,40', 0.12 * FX.flicker(t, 2));                // the fires in the town below
    FX.sway(g, im, [620, 450, 70, 150], t * 0.7, 1.2, 0, false);                   // the bell rope hanging
    FX.motes(g, t, 760, 120, 380, 360, 18, '255,225,170');                         // dust in the evening light
  };
  // ================================================================ 1586: the shore in the storm (torches; the rain in front)
  ALIVE.p1586_shore_storm = (g, t, bg, im) => {
    // the surf heaving round the flat rock (the rock itself holds still)
    for (const r of [[0, 340, 470, 44], [0, 384, 128, 82], [0, 466, 450, 90]]) FX.ripple(g, im, r, t * 1.4, 2.2, 0.06);
    FX.water(g, t * 1.3, 0, 470, 430, 80, '230,236,240'); FX.water(g, t * 1.3, 0, 345, 400, 35, '230,236,240');
    for (const [x, y, s] of [[721, 337, 2], [971, 340, 4]]) {
      FX.flame(g, t, x, y + 12, 22, s, '255,170,70');
      FX.glow(g, x, y, 70, '255,160,70', 0.16 * FX.flicker(t, s));
      FX.ripple(g, im, [x - 30, y + 110, 60, 160], t, 0.8, 0.2);                    // the torch's light on the wet sand
    }
  };
  FG.p1586_shore_storm = (g, t) => {
    FX.rain(g, t, [0, 0, 1280, 720], 140, '200,210,220', 0.22);
    if (((t % 23) < 0.12) || ((t % 37) > 36.85)) { g.fillStyle = 'rgba(210,220,235,0.12)'; g.fillRect(0, 0, 1280, 720); } // far lightning, now and then
  };

  // ================================================================ Lisbon: the shop (Game I's details)
  ALIVE.shop = (g, t, bg, im) => {
    const day = (window.S.F().ch || 0) !== 9;                // (the epilogue's night call: the shop at night)
    windowFog(g, t, [430, 32, 410, 282], day ? '235,238,240' : '120,130,165', day ? 0.16 : 0.12);
    if (day) {
      g.save(); clip(g, [[430, 32, 410, 282]]);
      FX.birds(g, t + 4, { y0: 70, y1: 200, n: 2, period: 19, color: 'rgba(90,92,98,0.5)', size: 7, x0: 400, x1: 870 });
      g.restore();
      FX.wisps(g, t + 1, 618, 390, { n: 4, rise: 34, spread: 5, a: 0.07, size: 4, speed: 0.22 });   // the coffee mug on the desk
      FX.trickles(g, t, [432, 222, 404, 88], 5, '235,240,245', 0.3);                                 // condensation on the lower panes
      FX.passer(g, t, [1068, 140, 124, 176], 37);                                                     // someone behind the door's glass
      FX.shaft(g, [[420, 30], [850, 30], [860, 716], [380, 716]], '210,220,230', 0.05);
      FX.motes(g, t, 420, 60, 430, 520, 40, '255,240,210');
    } else FX.moth(g, t, 172, 334, 34, 10, 2);                                                        // night: a moth round the green lamp
  };
  // ================================================================ Lisbon: the flat (Game I's bedroom)
  ALIVE.flat = (g, t) => {
    windowFog(g, t, [492, 55, 194, 257], '190,196,210', 0.14);
    FX.trickles(g, t, [493, 57, 193, 255], 6, '200,205,220', 0.3);
    FX.twinkle(g, t, [[514, 270], [530, 272], [557, 262], [569, 289], [616, 280], [642, 262], [641, 217], [674, 204]], '255,210,140');
    FX.motes(g, t, 690, 170, 200, 260, 14, '255,215,160'); FX.moth(g, t, 782, 262, 34, 16, 5);     // dust in the lamp light, a moth
  };
  // ================================================================ Lisbon: the street (Game I's Alfama: laundry, birds, chimney smoke, geraniums, mist)
  ALIVE.rua = (g, t, bg, im) => {
    [[598, 188, 34, 62, 0], [632, 192, 38, 82, 1.3], [672, 195, 52, 70, 2.1], [726, 190, 72, 66, 0.7], [806, 168, 54, 76, 2.8], [866, 152, 54, 74, 1.9], [926, 120, 46, 86, 3.4]]
      .forEach(([x, y, w, h, ph]) => FX.sway(g, im, [x, y, w, h], t, 0.9, ph));
    g.save(); clip(g, [[470, 0, 470, 150]]); FX.birds(g, t, { y0: 30, y1: 120, n: 2, period: 21, color: 'rgba(70,72,78,0.55)', size: 9, x0: 440, x1: 980 }); g.restore();
    FX.leaves(g, t, 600, 700, 17);
    FX.wisps(g, t, 557, 42, { n: 6, rise: 55, spread: 14, rgb: '125,127,132', a: 0.1, size: 7, speed: 0.12, dark: true });
    FX.sway(g, im, [334, 164, 78, 26], t, 0.7, 0.5, true);
    FX.wisps(g, t, 725, 320, { n: 4, rise: -150, spread: 50, rgb: '228,230,232', a: 0.05, size: 46, speed: 0.04 });
  };
  // ================================================================ Lisbon: Vasco's office at the Patriarchate
  ALIVE.vasco_office_lisbon = (g, t, bg, im) => {
    const panes = [[42, 58, 66, 152], [136, 58, 60, 152], [42, 214, 66, 145], [136, 214, 60, 145], [292, 90, 42, 120], [354, 90, 42, 120], [292, 216, 42, 116], [354, 216, 42, 116]];
    drift(g, t, 'vasco', panes, { speed: 2.5, a: 0.18, seed: 21, rgb: '230,232,234' });
    g.save(); clip(g, panes); FX.birds(g, t + 7, { y0: 80, y1: 190, n: 2, period: 27, color: 'rgba(70,72,78,0.5)', size: 5, x0: 30, x1: 410 }); g.restore();
    FX.shaft(g, [[40, 60], [400, 90], [700, 716], [60, 716]], '215,220,228', 0.035);
    FX.motes(g, t, 120, 200, 560, 420, 22, '235,232,222');
    FX.glow(g, 845, 318, 10, '120,255,140', Math.floor(t * 1.2) % 2 ? 0.35 : 0.12);  // the fax machine's ready light
  };
})();
