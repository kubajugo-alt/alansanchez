// The Forgotten Rhythm — alive pass, group 3: San Antón (the colmado, Tata's alley, the blue house), the market (the hall,
// the candle aisle, Yolande's back room, the drying shed), the blue-door bar, Darío's roof, the gallera. Only what is painted
// there moves, a little (coordinates read off each painting at 1280x720; js/story/alive.js chains these after the story's own).
(function () {
  const S = window.S;
  const lamp = (g, t, x, y, r, rgb, a, seed, live) => FX.glow(g, x, y, r, rgb, a * (live ? FX.flicker(t, seed) : 0.94 + 0.06 * Math.sin(t * 0.9 + seed)));
  const candle = (g, t, x, y, h, seed, a) => { lamp(g, t, x, y - h * 0.5, h * 3.2, '255,190,110', a == null ? 0.16 : a, seed, true); FX.flame(g, t, x, y, h, seed); };
  const clip = (g, shapes, fn) => {
    g.save(); g.beginPath();
    for (const s of shapes) { if (typeof s[0] === 'number') g.rect(s[0], s[1], s[2], s[3]); else { s.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); } }
    g.clip(); fn(); g.restore();
  };
  const BANKS = {};
  const drift = (g, t, key, shapes, o) => {
    const cl = BANKS[key] || (BANKS[key] = FX.makeClouds(o.seed || 11, o.rgb || '238,236,228', o.n || 18));
    clip(g, shapes, () => FX.drawClouds(g, cl, t, o.speed || 4, o.y || 0, o.a || 0.35));
  };
  // a ceiling fan's blades turning: soft translucent sectors in perspective (rx, ry), as Game II's hotel rooms
  const ceilFan = (g, t, x, y, rx, ry, rps, a) => {
    g.save(); g.translate(x, y); g.scale(1, ry / rx); g.fillStyle = `rgba(30,22,16,${a || 0.12})`;
    for (let i = 0; i < 5; i++) { const b = t * rps * Math.PI * 2 + i * Math.PI * 2 / 5; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, rx, b, b + 0.3); g.closePath(); g.fill(); }
    g.restore();
  };
  const stars = (g, t, pts) => pts.forEach(([x, y], i) => { const a = 0.25 + 0.25 * Math.sin(t * (0.9 + (i % 5) * 0.37) + i * 2.1); FX.glow(g, x, y, 3, '220,230,255', Math.max(0, a)); });

  // ================================================================ San Antón: the colmado (and Monday's, shut)
  const COLMADO_SKY = [[[690, 0], [1280, 0], [1280, 60], [1185, 88], [1070, 140], [930, 195], [830, 232], [760, 240], [690, 205]]];
  S.ALIVE.san_anton = (g, t, bg, im) => {
    const shut = bg === 'san_anton_colmado__shut';
    // clouds drifting behind the wires and the church tower; a few birds over the street
    drift(g, t, 'colmado', COLMADO_SKY, { speed: 3, a: shut ? 0.28 : 0.22, seed: 7, rgb: shut ? '200,200,196' : '246,244,236' });
    clip(g, COLMADO_SKY, () => FX.birds(g, t, { y0: 40, y1: 150, n: 3, period: 24, x0: 680, x1: 1300, size: 5, color: 'rgba(40,36,34,0.6)' }));
    // the palms over the far houses stir
    FX.sway(g, im, [880, 100, 120, 100], t * 0.7, 1.4, 0.3, true);
    FX.sway(g, im, [1000, 88, 125, 88], t * 0.7, 1.2, 1.7, true);
    // the heat off the far end of the street
    if (!shut) FX.ripple(g, im, [700, 372, 560, 46], t * 0.8, 0.5, 0.06);
  };

  // ================================================================ Tata's alley: night (candles in two windows) and Monday by day
  S.ALIVE.tata_alley = (g, t, bg, im) => {
    if (bg === 'tata_alley__day') {
      clip(g, [[[345, 0], [745, 0], [745, 25], [700, 70], [600, 60], [530, 70], [480, 28]]], () => { FX.birds(g, t, { y0: 8, y1: 40, n: 2, period: 21, x0: 340, x1: 750, size: 4 }); });
      FX.sway(g, im, [528, 62, 200, 76], t * 0.6, 1.2, 0.4, true);          // the palms behind the blue house
      FX.billow(g, im, [790, 196, 172, 110], t, 1.6, 4.2);                 // the washing on its line
      FX.sway(g, im, [190, 455, 90, 80], t * 0.5, 0.8, 0.6, true);           // the potted ferns in the draught
      FX.sway(g, im, [1150, 520, 110, 90], t * 0.5, 0.8, 2.2, true);
      return;
    }
    stars(g, t, [[372, 14], [410, 40], [470, 22], [560, 30], [612, 10], [700, 26], [730, 48], [450, 58]]);
    candle(g, t, 100, 386, 13, 1, 0.22);                                    // the candle in the left window
    candle(g, t, 1203, 330, 12, 4, 0.2);                                    // and the right
    FX.moth(g, t, 104, 360, 16, 10, 2);
    FX.billow(g, im, [805, 196, 160, 114], t, 1.0, 5.5);                    // the washing, barely
    lamp(g, t, 625, 300, 30, '150,170,220', 0.06, 3, false);                // the blue house's lamp, a cold sheen
  };

  // ================================================================ the blue house (and Monday's, wet wall to wall)
  S.ALIVE.blue_house = (g, t, bg, im) => {
    const wet = bg === 'blue_house_inside__wet';
    candle(g, t, 529, 328, 9, 2, 0.14); candle(g, t, 667, 328, 8, 5, 0.12); // the two candles on Tata's altar
    FX.sway(g, im, [806, 96, 132, 200], t * 0.5, 0.9, 0.8, true);           // the guava tree outside the window
    FX.motes(g, t, 790, 110, 180, 260, 10, '230,236,210');                    // dust in the window's light
    if (wet) {
      FX.water(g, t * 0.7, 300, 520, 960, 190, '160,180,200');               // the sheet of sea water on the tiles
      FX.ripple(g, im, [790, 575, 185, 140], t * 0.8, 1.2, 0.09);            // the window's reflection in it
      FX.drips(g, t, [[482, 520, 372, 4.6], [736, 515, 374, 5.3], [1052, 690, 610, 6.1]], '190,205,215');   // the table and the bedspread, dripping
    }
  };

  // ================================================================ the market hall
  S.ALIVE.market_hall = (g, t, bg, im) => {
    lamp(g, t, 265, 148, 60, '255,214,150', 0.08, 1, false); lamp(g, t, 600, 146, 60, '255,214,150', 0.08, 2, false);   // the hanging lamps
    FX.shaft(g, [[425, 165], [470, 165], [620, 430], [520, 430]], '255,236,200', 0.05);   // the light through the high windows
    FX.shaft(g, [[680, 165], [720, 165], [860, 420], [770, 420]], '255,236,200', 0.04);
    FX.motes(g, t, 380, 170, 520, 260, 18, '255,240,210');
    FX.billow(g, im, [1020, 190, 258, 112], t, 1.8, 5);                       // the hammocks swinging on their hooks
    FX.sway(g, im, [320, 250, 230, 80], t * 0.5, 0.6, 1.1, false);           // the strings of goods over the fruit stall
  };

  // ================================================================ the candle aisle: rows of saints' candles
  const AISLE = [[18, 172, 12], [72, 176, 11], [114, 178, 11], [170, 180, 10], [22, 356, 11], [72, 352, 11], [112, 352, 10], [150, 358, 10],
    [1116, 136, 11], [1168, 112, 12], [1216, 104, 11], [1110, 290, 10], [1128, 446, 10], [1160, 444, 11]];
  S.ALIVE.candle_aisle = (g, t, bg, im) => {
    AISLE.forEach(([x, y, h], i) => candle(g, t, x, y, h, i * 1.3, 0.12));
    for (let i = 0; i < 9; i++) lamp(g, t, 505 + i * 19, 338, 14, '255,190,110', 0.07, i, true);   // the little ones on the back shelf
    FX.billow(g, im, [855, 40, 110, 160], t, 1.4, 6);                         // the sequinned flags
    FX.billow(g, im, [700, 185, 102, 255], t, 0.9, 7.5);                      // the curtain to the back room
    FX.sway(g, im, [400, 0, 160, 290], t * 0.4, 0.7, 0.5, false);             // the dried herbs hanging from the beams
  };

  // ================================================================ Yolande's back room: the altar's candles, the lantern
  const ALTAR = [[536, 236, 11], [576, 212, 12], [566, 270, 9], [582, 290, 9], [825, 290, 9], [889, 232, 12], [913, 268, 9], [942, 268, 9], [1165, 82, 10], [1082, 490, 11]];
  S.ALIVE.yolande_back_room = (g, t, bg, im) => {
    ALTAR.forEach(([x, y, h], i) => candle(g, t, x, y, h, i * 1.7, 0.16));
    lamp(g, t, 362, 122, 46, '255,190,110', 0.18, 6, true);                    // the wall lantern
    FX.billow(g, im, [0, 0, 128, 640], t, 0.8, 8);                             // the curtain to the aisle
    FX.billow(g, im, [560, 30, 390, 180], t, 0.5, 9);                           // the hangings behind the altar
    FX.wisps(g, t, 576, 196, { n: 5, rise: 60, spread: 8, rgb: '230,220,200', a: 0.06, size: 6, speed: 0.2 });   // candle smoke
  };

  // ================================================================ the tanner's drying shed
  S.ALIVE.drying_shed = (g, t, bg, im) => {
    // the sun through the gaps in the roof, dust turning in it
    FX.shaft(g, [[505, 10], [580, 10], [700, 470], [590, 470]], '255,226,170', 0.07, 0.15);
    FX.shaft(g, [[960, 20], [1020, 20], [1060, 330], [990, 330]], '255,226,170', 0.05, 0.15);
    FX.motes(g, t, 470, 40, 300, 420, 22, '255,236,200');
    // the skins stirring on their frames in the fan's breath
    [[395, 236, 140, 208, 7], [550, 246, 62, 178, 6.3], [630, 240, 116, 180, 7.7], [765, 190, 100, 220, 6.8], [880, 150, 155, 240, 8.2]]
      .forEach(([x, y, w, h, p], i) => FX.billow(g, im, [x, y, w, h], t + i * 1.3, 0.9, p));
    FX.billow(g, im, [1090, 140, 100, 350], t, 0.5, 9);                          // the leather apron on its nail
    FX.fan(g, t, 296, 290, 26, 26);                                             // the little fan on the wall
  };

  // ================================================================ the blue-door bar
  const BULBS = [[10, 44, '255,90,90'], [86, 76, '255,210,120'], [160, 95, '120,200,255'], [212, 70, '255,90,120'], [286, 76, '255,220,140'], [336, 90, '255,190,110'],
    [440, 115, '255,210,140'], [578, 130, '255,200,140'], [622, 128, '255,170,120'], [660, 120, '255,210,140']];
  S.ALIVE.blue_door_bar = (g, t, bg, im) => {
    BULBS.forEach(([x, y, rgb], i) => lamp(g, t, x, y, 16, rgb, 0.22 + 0.06 * Math.sin(t * 0.8 + i * 1.9), i, false));
    ceilFan(g, t, 715, 84, 72, 12, 0.9, 0.14);                                   // the ceiling fan
    candle(g, t, 742, 296, 8, 3, 0.14);                                          // the candle on the back table
    [[117, 246], [230, 263], [462, 246]].forEach(([x, y], i) => lamp(g, t, x, y, 34, '255,210,150', 0.1, i + 5, false));   // the lamps on the bar
    for (let i = 0; i < 8; i++) lamp(g, t, 1108, 76 + i * 39, 14, '255,120,190', 0.12 + 0.08 * Math.sin(t * 2.2 - i * 0.6), i, false);   // the stage bulbs chasing
    FX.billow(g, im, [1130, 40, 150, 370], t, 0.7, 7);                          // the sequin curtain
    FX.wisps(g, t, 742, 290, { n: 5, rise: 80, spread: 14, rgb: '210,190,200', a: 0.05, size: 8, speed: 0.15 });   // smoke over the table
  };

  // ================================================================ Darío's roof, Ciudad Nueva, at night
  S.ALIVE.dario_roof = (g, t, bg, im) => {
    stars(g, t, [[60, 20], [140, 60], [230, 30], [320, 18], [420, 52], [520, 25], [610, 45], [700, 15], [760, 60], [960, 30], [1040, 58], [1120, 22], [1200, 48], [1250, 14]]);
    drift(g, t, 'dario', [[160, 60, 1120, 170]], { speed: 2.5, a: 0.18, seed: 21, rgb: '40,50,70' });
    FX.glow(g, 855, 150, 40, '200,220,255', 0.08 + 0.04 * Math.sin(t * 0.7));        // El Faro's cross, breathing on the cloud
    FX.twinkle(g, t, [[490, 305, 3], [500, 300, 2], [440, 260, 2], [722, 245, 2], [1130, 238, 2], [620, 290, 2], [900, 285, 2]], '255,220,150');   // the city's lit windows
    [[258, 352], [322, 360], [498, 370], [647, 364], [812, 372], [910, 360]].forEach(([x, y], i) => lamp(g, t, x, y, 22, '255,214,140', 0.2, i, false));   // the string of bulbs
    lamp(g, t, 73, 212, 40, '255,210,140', 0.18, 7, false);                          // the lamp by the ladder
    FX.moth(g, t, 76, 200, 18, 12, 3);
    FX.sway(g, im, [80, 260, 160, 160], t * 0.4, 0.7, 0.5, true);                     // the plants at the parapet
    FX.sway(g, im, [850, 350, 110, 90], t * 0.4, 0.6, 1.9, true);
  };

  // ================================================================ the gallera, Villa Consuelo, at dusk
  const GALLERA_SKY = [[[560, 0], [1280, 0], [1280, 100], [1200, 160], [1060, 200], [960, 190], [940, 170], [930, 130], [740, 70], [560, 60]]];
  S.ALIVE.gallera = (g, t, bg, im) => {
    drift(g, t, 'gallera', GALLERA_SKY, { speed: 3, a: 0.25, seed: 33, rgb: '250,220,190' });
    clip(g, GALLERA_SKY, () => FX.birds(g, t, { y0: 20, y1: 120, n: 3, period: 23, x0: 560, x1: 1300, size: 5, color: 'rgba(60,40,30,0.6)' }));
    FX.sway(g, im, [1050, 80, 160, 120], t * 0.6, 1.4, 0.7, true);                     // the palm by the bus stop
    FX.sway(g, im, [140, 0, 420, 190], t * 0.45, 0.9, 1.3, false);                     // the mango tree's leaves
    [[922, 120], [985, 128], [1035, 132], [1068, 130], [1105, 128], [1192, 124], [1255, 118]].forEach(([x, y], i) => lamp(g, t, x, y, 14, '255,226,170', 0.18, i, false));   // the bulbs on their wire
  };
})();
