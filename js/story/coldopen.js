// The Drowned Bell — cold open: Madragoa, 04:01. Maria Coutinho's last minute, before the title.
// Non-interactive: she wakes, finds the tile on her pillow, grips the list in her apron, and the
// river comes up through the floorboards.
(function () {
  const S = window.S, { G, F, say, ROOMS, sfx } = S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  S.CHARS.maria = { scale: 1.0, frames: { idle: ['maria_grip'], talk: ['maria_grip'],
    poses: { sleep: 'maria_sleep', wake: 'maria_wake', grip: 'maria_grip' } } };

  let water = 0, tileOn = true, t0 = 0; // water: 0..1 of the room's height
  const PILLOW = [818, 368]; // where the tile lies

  ROOMS.cold_open = {
    name: 'Madragoa', bg: 'cold_open', noSave: true, music: null, ambience: 'night', floor: 'wood', player: false,
    walk: [[300, 600], [1000, 600], [1100, 716], [200, 716]],
    scale: [560, 360, 716, 420],
    light: { ambient: 'rgb(120,140,175)', base: 0.75, rim: 'rgba(255,190,120,0.2)', rimSide: 1 },
    lights: [{ x: 948, y: 318, rgb: '255,190,120', kind: 'gas', seed: 7, glow: 110, ga: 0.35, power: 0.5, reach: 700, floor: [948, 470], height: 240 }],
    entries: { default: [640, 680, 'w'] },
    npcs: [{ id: 'maria', ch: 'maria', x: 520, y: 650, h: 390, // her standing spot on the boards (the scene poses her in bed first)
       dir: 'w', fixedDir: true, name: 'Maria Coutinho', look: () => {} }],
    hotspots: [],
    anim(g, t) {
      // the fog presses on the glass
      if (S.windowFog) S.windowFog(g, t, [180, 70, 140, 230], '200,210,225', 0.28);
      // the tile on her pillow: blue and white, catching the lamp
      if (tileOn) {
        const [x, y] = PILLOW;
        g.save(); g.translate(x, y); g.rotate(-0.12);
        g.fillStyle = '#e9e4d6'; g.fillRect(-12, -9, 24, 18);
        g.strokeStyle = '#2b4f9a'; g.lineWidth = 2; g.strokeRect(-10, -7, 20, 14);
        g.fillStyle = '#2b4f9a'; g.beginPath(); g.arc(0, 0, 4, 0, Math.PI * 2); g.fill();
        g.restore();
      }
    },
    animFg(g, t) {
      if (water <= 0) return;
      // the river, up through the boards: dark green-black, a moving skin of light on top
      const top = 720 - water * 720;
      g.save();
      const gr = g.createLinearGradient(0, top, 0, 720);
      gr.addColorStop(0, 'rgba(40,70,72,0.78)'); gr.addColorStop(1, 'rgba(8,20,24,0.95)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(0, 720);
      for (let x = 0; x <= 1280; x += 16) g.lineTo(x, top + Math.sin(x * 0.02 + t * 1.6) * 4 + Math.sin(x * 0.007 - t * 0.9) * 5);
      g.lineTo(1280, 720); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(190,215,210,0.35)'; g.lineWidth = 2; g.beginPath();
      for (let x = 0; x <= 1280; x += 16) { const y = top + Math.sin(x * 0.02 + t * 1.6) * 4 + Math.sin(x * 0.007 - t * 0.9) * 5; x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      g.restore();
    },
  };

  // plays before the title card; returns when the screen is black again
  S.coldOpen = function () { return G.busy(coldOpen); };
  async function coldOpen() {
    if (!G.image('bg:cold_open')) return;
    water = 0; tileOn = true;
    await G.fade(true);
    await G.goRoom('cold_open', null, { instant: true, noEnter: true, noSave: true });
    const m = G.npc('maria'), set = (pose, x, y) => { if (m) { m.pose = pose; m.x = x; m.y = y; } };
    set('sleep', 705, 455);
    G.cutscene = true;
    try {
      await G.fade(false);
      sfx('bed_creak', 0.4); await T(2200);
      // she wakes: the tile is on her pillow
      sfx('bed_creak_wake', 0.6); await T(600);
      tileOn = false; set('wake', 600, 545); await T(2200);
      // the list in her apron, gripped to her chest
      set('grip', 520, 650); await T(1200);
      // under the boards, the river turns
      sfx('water_rise', 0.6);
      const rise = (async () => { const n = window.FAST ? 2 : 160; for (let i = 0; i <= n; i++) { water = 0.6 * i / n; await G.wait(window.FAST ? 5 : 60); } })();
      await G.say('narr_cold_open', { offscreen: true });
      await rise;
      sfx('splash', 0.4); await T(800);
      // fade on the tile, floating
      tileOn = true; await T(900);
      await G.fade(true);
    } finally { G.cutscene = false; water = 0; if (m) m.pose = null; }
  }
})();
