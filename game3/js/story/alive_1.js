// Alive pass, group 1: the hostal (courtyard by day, dawn and night; rooms 4 and 9; the kitchen, and in the power cut;
// the roof) and Calle Las Damas at night. Small movements over the paintings, as Game II's (sequel/js/story/tue.js):
// nothing in art/bg changes; everything is drawn over it each frame, deterministic in t.
(function () {
  const S = window.S;
  const clip = (g, shapes) => {
    g.beginPath();
    for (const s of shapes) {
      if (typeof s[0] === 'number') g.rect(s[0], s[1], s[2], s[3]);
      else { s.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); }
    }
    g.clip();
  };
  const BANKS = {};
  function drift(g, t, key, shapes, o) {
    const cl = BANKS[key] || (BANKS[key] = FX.makeClouds(o.seed || 11, o.rgb || '238,238,234', o.n || 22));
    g.save(); clip(g, shapes); FX.drawClouds(g, cl, t, o.speed || 4, o.y || 0, o.a || 0.3); g.restore();
  }
  const lamp = (g, t, x, y, r, rgb, a, seed, live) => FX.glow(g, x, y, r, rgb, a * (live ? FX.flicker(t, seed) : 0.94 + 0.06 * Math.sin(t * 0.9 + seed)));
  // a ceiling fan: soft blades sweeping round under the painted ones (ry/rx: its perspective)
  function ceilFan(g, t, x, y, rx, ry, rps, a) {
    g.save(); g.translate(x, y); g.scale(1, ry / rx); g.fillStyle = `rgba(30,22,16,${a || 0.1})`;
    for (let i = 0; i < 4; i++) { const b = t * rps * Math.PI * 2 + i * Math.PI / 2; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, rx, b, b + 0.28); g.closePath(); g.fill(); }
    g.restore();
  }
  // steam rising off a pot: a few soft wisps that drift up and fade
  function steam(g, t, x, y, n, a) {
    g.save();
    for (let i = 0; i < n; i++) {
      const p = ((t * 0.18 + i / n) % 1), px = x + Math.sin(t * 0.7 + i * 2.1) * 10 + (i - n / 2) * 8, py = y - p * 70, r = 10 + p * 22;
      const gr = g.createRadialGradient(px, py, 0, px, py, r); gr.addColorStop(0, `rgba(240,236,228,${(a * Math.sin(p * Math.PI)).toFixed(3)})`); gr.addColorStop(1, 'rgba(240,236,228,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, 7); g.fill();
    }
    g.restore();
  }

  // ================================================================ the courtyard (day, dawn, night)
  S.ALIVE.hostal_courtyard = (g, t, bg, im) => {
    const night = /night/.test(bg), dawn = /dawn/.test(bg);
    // the tree's canopy over the stair, the bougainvillea on the gallery, the ferns
    FX.sway(g, im, [70, 0, 440, 300], t * 0.55, 1.1, 0, false);
    FX.sway(g, im, [1060, 20, 220, 140], t * 0.6, 0.9, 1.7, false);
    FX.sway(g, im, [1035, 430, 110, 70], t * 0.7, 0.7, 2.4, true);
    // the washing on the line, breathing in the draught off the street
    FX.billow(g, im, [958, 218, 322, 104], t, 1.4, 5.5);
    // the fountain: its jets running and the basin moving
    FX.ripple(g, im, [572, 448, 92, 100], t * 1.4, 0.7, 0.35);
    FX.water(g, t, 500, 540, 240, 16, night ? '170,190,230' : '255,244,220');
    // the parrot, asleep or not, breathing
    FX.breathe(g, im, [1180, 388, 62, 92], t, 0.012, 3.6);
    if (night) {
      // the lit door downstairs, and a moth at it
      lamp(g, t, 965, 420, 90, '255,180,100', 0.14, 2, true);
      FX.moth(g, t, 965, 360, 26, 18, 1.3);
    } else if (!dawn) {
      // leaf shadows moving on the sunlit cobbles
      FX.dapple(g, t, [0, 560, 620, 160], 16, 0.05);
    }
  };

  // ================================================================ room 4 (night, the lamp on)
  S.ALIVE.hostal_room4 = (g, t, bg, im) => {
    ceilFan(g, t, 637, 48, 130, 22, 1.1, 0.09);
    lamp(g, t, 1200, 318, 110, '255,214,150', 0.12, 4, false);
    FX.moth(g, t, 1205, 300, 30, 20, 0.7);
    // through the balcony doors: the trees in the night air
    FX.sway(g, im, [270, 250, 150, 110], t * 0.5, 0.9, 0.8, true);
    // the towel over the chair, stirred by the fan
    FX.billow(g, im, [178, 362, 70, 130], t, 0.7, 4.2);
  };

  // ================================================================ room 9 (day, the shutters open)
  S.ALIVE.hostal_room9 = (g, t, bg, im) => {
    // sun through the window grille onto the tiles, with dust in it
    FX.shaft(g, [[590, 90], [720, 90], [800, 640], [540, 640]], '255,236,200', 0.05, 0.2);
    FX.motes(g, t, 560, 120, 220, 460, 24, '255,240,210');
    // the courtyard beyond the grille, and the towel on its hook
    FX.ripple(g, im, [588, 96, 130, 220], t * 0.4, 0.4, 0.05);
    FX.billow(g, im, [1012, 150, 58, 235], t, 0.8, 6.5);
  };

  // ================================================================ the kitchen (by day; in the 04:30 power cut)
  S.ALIVE.hostal_kitchen = (g, t, bg, im) => {
    if (/powercut/.test(bg)) {
      // two candles and the oil lamp: the only light
      FX.flame(g, t, 366, 152, 9, 1); lamp(g, t, 366, 146, 70, '255,180,90', 0.18, 1, true);
      FX.flame(g, t, 923, 346, 9, 2); lamp(g, t, 923, 340, 80, '255,180,90', 0.18, 2, true);
      lamp(g, t, 646, 410, 120, '255,170,80', 0.16, 3, true);
      FX.billow(g, im, [1100, 80, 150, 420], t, 0.6, 7);
      return;
    }
    // the garden through the window, the bead curtain in the doorway, steam off the pot
    FX.ripple(g, im, [4, 96, 150, 196], t * 0.5, 0.5, 0.06);
    FX.billow(g, im, [1100, 80, 150, 420], t, 1.3, 6);
    steam(g, t, 500, 392, 4, 0.12);
    FX.shaft(g, [[0, 90], [160, 90], [520, 620], [200, 640]], '255,236,200', 0.04, 0.25);
    FX.motes(g, t, 60, 150, 360, 360, 18, '255,240,210');
    FX.sway(g, im, [112, 246, 70, 52], t * 0.6, 0.6, 1.1, true);
  };

  // ================================================================ the roof at night
  S.ALIVE.hostal_roof = (g, t, bg, im) => {
    drift(g, t, 'roof', [[0, 0, 1280, 200]], { speed: 3, a: 0.16, rgb: '150,165,200', seed: 7 });
    // the moon's road on the sea
    FX.ripple(g, im, [610, 222, 170, 26], t * 0.7, 1.2, 0.5);
    FX.water(g, t, 620, 224, 150, 20, '200,215,240');
    // the washing in the wind up here, and the city's few lit windows
    FX.billow(g, im, [286, 290, 244, 196], t, 2.0, 4.5);
    FX.twinkle(g, t, [[762, 358, 4], [433, 214, 2], [447, 214, 2], [890, 352, 2], [1110, 258, 2], [640, 330, 2]], '255,200,120');
    lamp(g, t, 699, 95, 40, '220,230,255', 0.06, 5, false);
  };

  // ================================================================ Calle Las Damas at night
  S.ALIVE.calle_las_damas = (g, t, bg, im) => {
    drift(g, t, 'damas', [[[330, 0], [900, 0], [830, 240], [600, 300], [520, 230]]], { speed: 3, a: 0.18, rgb: '140,155,190', seed: 13 });
    lamp(g, t, 518, 118, 46, '220,230,255', 0.05, 6, false);
    // the candle in the window on the right, the wall lanterns, the street tree
    FX.flame(g, t, 1169, 412, 10, 3); lamp(g, t, 1169, 405, 60, '255,180,90', 0.2, 3, true);
    lamp(g, t, 228, 282, 50, '255,190,110', 0.08, 7, true);
    lamp(g, t, 1046, 272, 50, '255,190,110', 0.08, 8, true);
    FX.sway(g, im, [505, 222, 98, 170], t * 0.5, 0.8, 0.4, true);
    FX.moth(g, t, 1046, 260, 22, 16, 2.2);
  };
})();
