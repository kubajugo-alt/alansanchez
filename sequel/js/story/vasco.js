// The Shortest Night — Saturday 22 June, Vasco's chapter (played as Vasco, about half an hour; the camp and Cave 6
// rewritten from the novel's Chapter Seven, 2026-10-30; Cave 6 redesigned the same day, docs/puzzles/CAVE6.md). The camp
// at 07:00 (Yeray's "Portuguese guy"; Elena's charts); Cave 6 from 09:00: the signs over the triangles brought up with
// chalk, the scenes round them read by torch (the grandmothers' telling: he knows it exists, not the words), noon at
// 14:04 (Canary summer time) and the one column on the great triangle; down the rope ladder to the chamber of sockets:
// the floor is the wall in a mirror, the sun disc moved one socket along (the columns cross), Elena's "Puerta" (the sun
// disc tipped 4° 36′ S at 14:05: send the sun back), swallowed; the radio without its fuse; Baute's refusal; the vault:
// the mark on the wall (the seven signs in floor order, and an A), the anchors dug out with Lorenzo's trowel, the water
// rising, the prayer.
// The mountain's rooms live here with every day's use of them: the camp (Sunday night, Monday), Cave 6 and the chamber
// under it (Monday's finale: mon.js), the vault (Sunday's rescue: sun.js).
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const ch = () => F().ch || 1;
  const asV = () => !!F().as_vasco;

  S.startVasco = async function () {
    await G.fade(true);
    S.becomeVasco();
    S.give('ltrowel', true); S.give('torch', true);
    await G.goRoom('camp', null, { instant: true, noEnter: true, noSave: true, pos: [300, 660, 'e'] });
    S.sfx('chapter_toll', 0.3);
    await G.card('RISCO CAÍDO', 'The same morning · 07:00', 3200);
    G.tip('vasco');
    await G.fade(false);
    // above the cloud, trying very hard not to think about Alan (the novel's opening of Chapter Seven)
    await say('narr_v_camp_1', 'narr_v_camp_2', 'narr_v_camp_3', 'narr_v_camp_4', 'vasco_v_wake', 'vasco_v_wake_2', 'narr_v_camp_5');
  };

  // ================================================================ THE CAMP
  ROOMS.camp = S.room({
    music: 'camp',
    name: 'Risco Caído · the camp', bg: 'camp', floor: 'stone', ambience: () => ch() === 6 ? 'night' : 'tower',
    light: { ambient: 'rgb(255,246,226)', base: 1 },
    entries: { default: [300, 660, 'e'], cave6: [1100, 660, 'w'], vault: [700, 660, 'w'], landrover: [200, 660, 'e'] },
    npcs: [
      { id: 'yeray', ch: 'yeray', x: 820, y: 650, dir: 'w', name: 'Yeray', when: () => asV() && !F().v_yeray_gone, look: 'vasco_look_yeray', talk: () => S.yerayCoffee() },
      { id: 'baute', ch: 'baute_dig', x: 1000, y: 650, dir: 'w', name: 'Rayco Baute', when: () => asV() && F().v_baute_here, look: 'vasco_look_baute', talk: () => S.refusal() },
      { id: 'carmen', ch: 'carmen_field', x: 260, y: 660, dir: 'e', name: 'Carmen', when: () => ch() === 6, look: 'alan_look_carmen_camp', talk: () => say('carmen_su_camp') },
    ],
    hotspots: [
      { name: 'The sea of cloud', rect: [0, 360, 1280, 180], at: [640, 600], noBox: true, look: () => say(asV() ? 'vasco_look_cloud' : ch() === 6 ? 'alan_look_cloud_night' : 'alan_look_cloud_mon') },
      { name: 'Camp radio', rect: [430, 460, 90, 70], at: [470, 650], look: () => S.lookRadio(), use: () => S.lookRadio(),
        items: { fuse: () => S.fuseIn(), foil: () => S.foilRadio() } },
      { name: 'Stove', rect: [165, 345, 110, 60], at: [250, 640], when: () => asV(), look: 'vasco_look_stove',
        take: () => S.takeFoil(), use: () => S.takeFoil() },
      { name: 'Finds table', rect: [580, 450, 220, 80], at: [690, 650], look: () => say(asV() ? (G.has('elena_charts') ? 'vasco_finds_again' : 'vasco_look_finds') : 'alan_look_finds_camp'),
        use: () => S.takeCharts(), take: () => S.takeCharts() },
      { name: 'Path to Cave 6', rect: [1160, 250, 110, 320], at: [1200, 650], exit: 'cave6', entry: 'camp', when: () => asV() || ch() === 7,
        locked: () => asV() && !G.has('elena_charts'), lockedLine: 'vasco_need_charts' },
      { name: 'Steps down to the granary', rect: [640, 520, 140, 50], at: [700, 650], exit: 'vault', entry: 'camp', when: () => ch() === 6 },
    ],
    // the painting is a morning: Sunday night darkens it, Monday's sunrise warms it
    animBack(g, t) {
      const im = G.bgImage(), night = ch() === 6;
      // the sea of cloud drifting below the camp (left of the cliff, behind the tents and the awning)
      g.save(); g.beginPath(); g.moveTo(0, 104); g.lineTo(795, 104); g.lineTo(795, 330); g.lineTo(380, 330); g.lineTo(380, 220);
      g.lineTo(330, 220); g.lineTo(330, 172); g.lineTo(0, 150); g.closePath(); g.clip();
      for (let i = 0; i < 7; i++) {
        const x = ((i * 190 + t * (5 + i % 3)) % 1100) - 160, y = 130 + (i * 53) % 190, r = 90 + (i % 3) * 40;
        const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.13)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r * 1.6, r * 0.5, 0, 0, 7); g.fill();
      }
      g.restore();
      FX.billow(g, im, [336, 176, 290, 42], t, 1.3, 4.2); // the awning in the wind
      FX.sway(g, im, [770, 300, 70, 46], t, 1.2, 0.2, true); // the broom by the generator
      FX.sway(g, im, [1050, 400, 120, 70], t, 1.4, 1.7, true); // the grass on the path
      if (!night) FX.birds(g, t, { y0: 120, y1: 230, x0: -40, x1: 780, n: 2, period: 30, color: 'rgba(40,36,34,0.6)', size: 6 }); // ravens over the cloud
      // the painting is a morning: Sunday night darkens it, Monday's sunrise warms it
      if (ch() !== 6 && ch() !== 7) return;
      g.save(); g.globalCompositeOperation = 'multiply';
      g.fillStyle = night ? 'rgb(52,62,110)' : 'rgb(255,214,170)'; g.fillRect(0, 0, 1280, 720); g.restore();
      if (night) {
        FX.twinkle(g, t, [[60, 30, 1], [140, 62, 1], [235, 22, 1], [318, 70, 1], [402, 38, 1], [486, 80, 1], [560, 18, 1], [640, 55, 1], [712, 30, 1], [770, 74, 1]], '230,236,255');
        FX.glow(g, 158, 278, 48, '255,190,110', 0.75 * FX.flicker(t, 4)); // the storm lantern on the tent pole, lit
      }
    },
  });
  // Yeray at the stove: the terrible coffee, the Portuguese guy at Rafa's bar ("Sad, though"), and the discs that aren't
  // going to Las Palmas. Then he walks off towards the tents before Vasco can ask.
  S.yerayCoffee = async function () {
    const f = F();
    if (f.v_yeray) return say('yeray_v_05');
    f.v_yeray = true;
    await G.busy(async () => {
      S.sfx('coffee_cups', 0.5);
      await say('yeray_v_01', 'vasco_v_01');
      await S.posed('coffee', () => say('narr_v_yeray_1', 'yeray_v_02', 'vasco_v_yeray_1', 'yeray_v_02b', 'narr_v_yeray_2', 'yeray_v_02c', 'yeray_v_02d',
        'narr_v_yeray_3', 'vasco_v_02', 'narr_v_yeray_4', 'yeray_v_03', 'vasco_v_yeray_2', 'yeray_v_03b', 'vasco_v_03', 'narr_v_yeray_5', 'yeray_v_04',
        'vasco_v_yeray_3', 'narr_v_yeray_6', 'yeray_v_04b'));
      const y = G.npc('yeray');
      if (y) { y.dir = 'w'; await say('yeray_v_05'); await Promise.race([y.walkTo(-80, y.y), T(window.FAST ? 50 : 4000)]); }
      f.v_yeray_gone = true; G.refreshNpcs();
      await say('narr_v_yeray_7', 'vasco_v_yeray_4');
    });
  };
  // the expedition files: Elena Suárez's charts of the sockets, and on the last one the sun disc in pencil, and a word
  S.takeCharts = async function () {
    if (!asV()) return say('alan_look_finds_camp');
    if (G.has('elena_charts')) return say('vasco_finds_again');
    await G.busy(async () => {
      S.sfx('paper_shuffle', 0.5);
      await say('narr_v_charts_1', 'vasco_take_1');
      await S.posed('find', () => say('vasco_take_2', 'vasco_take_3'));
      await say('narr_v_charts_4');
      S.give('elena_charts'); S.give('chalk', true); S.give('vnotebook', true);
      await say('vasco_take_charts');
    });
  };
  S.lookRadio = async function () {
    const f = F();
    if (ch() === 7) return f.fuse_in ? say('alan_radio_mon') : say('alan_radio_dead');
    if (!asV()) return say('alan_radio_dead');
    // the morning: he could call the museum, and the museum the hotel. And say what?
    if (!f.v_understood) {
      if (f.v_radio_looked) return say('vasco_look_radio_again');
      f.v_radio_looked = true;
      return say('vasco_look_radio_1', 'vasco_look_radio_2', 'vasco_look_radio', 'narr_v_radio');
    }
    // after the cave: dead, and the fuse gone. Then a shadow across the radio: Rayco, with a thermos and two mugs
    if (!f.v_fuse_seen) {
      f.v_fuse_seen = true;
      await G.busy(async () => {
        S.sfx('relay_click', 0.5); await T(500); S.sfx('relay_click', 0.5);
        await say('narr_v_fuse_1');
        await S.posed('kneel', async () => { S.sfx('case_open', 0.5); await say('narr_v_fuse_2', 'vasco_radio_fuse', 'narr_v_fuse_3'); });
        await S.posed('worried', () => say('narr_v_fuse_4', 'narr_v_fuse_5', 'vasco_v_see'));
      });
      return;
    }
    return say('vasco_radio_fuse_2');
  };
  // (2026-10-30) the foil from Yeray's packet as a fuse: a few seconds on the air, the message Don Lolo heard (puzzles.js);
  // then the foil burns through, and Rayco's shadow falls across the radio
  S.foilRadio = async function () {
    const f = F();
    if (!f.v_fuse_seen || f.v_baute_here) return say('vasco_look_foil');
    G.takeItem('foil');
    await G.busy(async () => {
      await S.posed('kneel', async () => { S.sfx('case_open', 0.4); await say('vasco_r_foil_1'); });
      S.sfx('relay_click', 0.5);
      await say('narr_v_r_1', 'vasco_r_send');
      S.sfx('match', 0.5);
      await say('narr_v_r_2', 'vasco_r_after');
      f.v_sent = true; f.v_baute_here = true; G.refreshNpcs();
      const b = G.npc('baute'); if (b) b.dir = 'w';
      await say('narr_v_shadow', 'baute_v_01');
      G.player.dir = 'e';
      await say('narr_v_baute_1', 'narr_v_baute_2', 'baute_v_heard', 'baute_v_01b');
    });
  };

  // ================================================================ CAVE 6 (redesigned 2026-10-30, docs/puzzles/CAVE6.md)
  // Two rooms. The cave (cave6): one small opening in the roof, a hole in the floor straight under it with a rope ladder,
  // seven triangles on the back wall (three small, the great one, three small), a sign over each: the moon in six
  // phases round the sun. The chamber under it (cave6_low): seven sockets in a row in the floor, a sign cut by each.
  // At noon a column of sunlight comes down the shaft onto all seven sockets, and each disc throws a column back up
  // through the hole onto its own triangle. The columns cross in the hole, so the floor is the wall in a mirror.
  const WALL = ['wax_crescent', 'first_quarter', 'wax_gibbous', 'sun', 'wan_gibbous', 'last_quarter', 'wan_crescent'];
  const FLOOR = WALL.slice().reverse();   // socket i holds FLOOR[i] and lights triangle 6 - i
  // the grandmothers' telling: the order the women set them in, one a moon from the winter turning (Baute took them out
  // in the same order, at the same moons, December to May); the sun last, at noon on the long day
  const TURN = ['wax_gibbous', 'last_quarter', 'wax_crescent', 'wan_gibbous', 'first_quarter', 'wan_crescent', 'sun'];
  const NAME = { wax_crescent: 'waxing crescent', first_quarter: 'first quarter', wax_gibbous: 'waxing gibbous', sun: 'the sun',
    wan_gibbous: 'waning gibbous', last_quarter: 'last quarter', wan_crescent: 'waning crescent' };
  // the cave, as painted: each triangle [left, right, point], the hole in the floor, the opening in the roof
  const TRI_UP = [[[288, 268], [348, 268], [317, 335]], [[368, 272], [430, 272], [399, 337]], [[449, 274], [510, 274], [479, 339]],
    [[535, 215], [760, 215], [642, 415]], [[787, 274], [853, 274], [817, 340]], [[873, 272], [939, 272], [903, 338]], [[957, 268], [1020, 268], [990, 335]]];
  const HOLE = [640, 548, 205, 48], ROOF = [640, 55];
  // the chamber, as painted: the sockets, the triangles seen up through the hole, the hole (ellipse), the shaft's mouth
  const SOCK = [[387, 572], [475, 572], [558, 572], [641, 572], [725, 572], [810, 572], [897, 572]];
  const DISC_AT = [339, 427, 510, 593, 677, 762, 849].map(x => [x, 546, 97, 59]);   // (the disc sprites, from discs.json)
  const TRI_LOW = [[[444, 95], [476, 95], [460, 133]], [[489, 98], [521, 98], [505, 135]], [[533, 101], [565, 101], [549, 136]],
    [[582, 76], [695, 76], [637, 177]], [[714, 101], [746, 101], [730, 136]], [[759, 98], [791, 98], [775, 135]], [[804, 95], [836, 95], [820, 133]]];
  const OPEN = [640, 97, 255, 82], RIM = 170, SHAFT = [640, 34];
  const cen = t => [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3], wid = t => t[1][0] - t[0][0];
  const CEN_LOW = TRI_LOW.map(cen), CEN_UP = TRI_UP.map(cen);
  S.CAVE = { WALL, FLOOR, TURN, NAME, SOCK, CEN_LOW, TRI_LOW };
  S.socketOf = sign => FLOOR.indexOf(sign);
  // a point on the wall (seen through the hole) at a position s along the row of triangles (0..6, beyond the ends too)
  S.wallAt = function (s) {
    if (s <= 0) return [CEN_LOW[0][0] + s * 40, CEN_LOW[0][1] - s * 2];
    if (s >= 6) return [CEN_LOW[6][0] + (s - 6) * 40, CEN_LOW[6][1] + (s - 6) * 2];
    const k = Math.floor(s), f = s - k, a = CEN_LOW[k], b = CEN_LOW[k + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  };
  // which triangle a column at s lands on (-1: bare rock between them)
  S.wallHit = s => { const k = Math.round(s); return k >= 0 && k <= 6 && Math.abs(s - k) < (k === 3 ? 0.36 : 0.26) ? k : -1; };
  const discImg = [0, 1, 2, 3, 4, 5, 6].map(i => { const im = new Image(); im.src = 'art/layers/cave6_disc_' + i + '.webp'; return im; });

  // ---------------------------------------------------------------- what the light is doing now (both rooms)
  // Saturday: noon once Vasco has waited for it; only the sun disc in (the test moves it one socket along).
  // Monday: noon from twelve by the clock (F().mclock, minutes); the sun disc tipped by Baute, its column going up the
  // shaft at a slant until Alan lays it flat; a cloud takes the light, Carmen's mirror gives it back.
  S.lightOn = () => {
    const f = F();
    if (asV()) return !!f.v_noon;
    if (ch() !== 7) return false;
    if (f.lock_closed || S.closing) return true;
    if ((f.mclock || 0) < 720) return false;
    return !f.cloud_over || !!f.mirror_on;
  };
  // [socket, triangle] for every column standing now (triangle 'shaft': straight back up, Baute's tip)
  S.columns = function () {
    const f = F(), out = [];
    if (asV() || ch() < 7) { if (f.v_noon || asV()) out.push(S.vTest ? [4, 2] : [3, 3]); return out; }
    for (const s of f.placed || []) { const i = S.socketOf(s); out.push([i, 6 - i]); }
    if (f.lock_closed || S.closing || f.sun_flat) out.push([3, 3]);
    else out.push([3, 'shaft']);
    return out;
  };
  // the spot of Baute's column climbing the wall of the shaft: 0 at twelve, 1 at 14:05 (the sky)
  S.shaftK = () => Math.max(0, Math.min(1, ((F().mclock || 720) - 720) / 125));

  const column = (g, p0, w0, p1, w1, a, t) => {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const gr = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
    gr.addColorStop(0, `rgba(255,228,160,${a})`); gr.addColorStop(1, `rgba(255,228,160,${a * 0.8})`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(p0[0] + nx * w0 / 2, p0[1] + ny * w0 / 2); g.lineTo(p1[0] + nx * w1 / 2, p1[1] + ny * w1 / 2);
    g.lineTo(p1[0] - nx * w1 / 2, p1[1] - ny * w1 / 2); g.lineTo(p0[0] - nx * w0 / 2, p0[1] - ny * w0 / 2); g.closePath(); g.fill();
    // dust turning in it
    g.fillStyle = `rgba(255,240,200,${a * 0.9})`;
    for (let j = 0; j < 16; j++) { const k = (j * 0.137 + t * 0.03 * (1 + j % 3)) % 1, o = Math.sin(j * 12.9 + t * 0.4) * 0.4, w = w0 + (w1 - w0) * k; g.fillRect(p0[0] + dx * k + nx * w * o, p0[1] + dy * k + ny * w * o, 1.5, 1.5); }
  };
  const patch = (g, c, w, a) => {
    g.save(); g.translate(c[0], c[1]); g.scale(1, 0.75);
    const r = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.6);
    r.addColorStop(0, `rgba(255,232,170,${a})`); r.addColorStop(0.7, `rgba(255,228,160,${a * 0.6})`); r.addColorStop(1, 'rgba(255,228,160,0)');
    g.fillStyle = r; g.beginPath(); g.arc(0, 0, w * 0.6, 0, 7); g.fill(); g.restore();
  };
  const triFill = (g, tr, a) => { g.fillStyle = `rgba(255,226,150,${a})`; g.beginPath(); g.moveTo(...tr[0]); g.lineTo(...tr[1]); g.lineTo(...tr[2]); g.closePath(); g.fill(); };
  // a woman of light (outline only: robe, raised arms with a branch, swaying); the closing's fallback when its video
  // (js/story/dance.js) cannot play
  S.harimaguada = function (g, x, y, k, t, j, a) {
    const sw = Math.sin(t * 2.2 + j) * 0.12, arm = Math.sin(t * 3 + j * 1.7);
    g.save(); g.translate(x, y); g.scale(k, k); g.rotate(sw * 0.3);
    g.strokeStyle = `rgba(255,238,190,${a})`; g.fillStyle = `rgba(255,228,160,${a * 0.18})`; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.shadowColor = `rgba(255,220,150,${a})`; g.shadowBlur = 14;
    g.beginPath(); g.moveTo(-8, -118); g.quadraticCurveTo(-22 + sw * 30, -60, -30 + sw * 40, 0); g.quadraticCurveTo(0, 8, 30 + sw * 40, 0); g.quadraticCurveTo(22 + sw * 30, -60, 8, -118); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(0, -130, 7, 9, 0, 0, 7); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-7, -112); g.quadraticCurveTo(-26, -128 - arm * 10, -20, -160 - arm * 12); g.moveTo(7, -112); g.quadraticCurveTo(26, -128 + arm * 10, 20, -160 + arm * 12); g.stroke();
    g.beginPath(); const bx = -20, by = -160 - arm * 12; for (let f = 0; f < 5; f++) { g.moveTo(bx, by); g.lineTo(bx - 14 + f * 7, by - 16 + Math.abs(f - 2) * 4); } g.stroke();
    g.restore();
  };

  // ---------------------------------------------------------------- the chamber: the light, the discs, the closing
  const clipAboveRim = g => { g.beginPath(); g.rect(0, RIM, 1280, 720); g.ellipse(OPEN[0], OPEN[1], OPEN[2], OPEN[3], 0, 0, 7); g.clip(); };
  const clipOpen = g => { g.beginPath(); g.ellipse(OPEN[0], OPEN[1], OPEN[2], OPEN[3], 0, 0, 7); g.clip(); };
  S.drawLowLight = function (g, t) {
    const f = F(), on = S.lightOn(), A = S.AIM;
    g.save(); g.globalCompositeOperation = 'screen';
    if (on) {
      // the noon column down the shaft and through the hole, onto the whole row
      g.save(); clipAboveRim(g); column(g, [SHAFT[0], SHAFT[1]], 36, [642, 575], 600, 0.16, t); g.restore();
      g.save(); g.translate(639, 567); g.scale(1, 0.09); const r = g.createRadialGradient(0, 0, 0, 0, 0, 300);
      r.addColorStop(0, 'rgba(255,228,160,.4)'); r.addColorStop(1, 'rgba(255,228,160,0)'); g.fillStyle = r; g.beginPath(); g.arc(0, 0, 300, 0, 7); g.fill(); g.restore();
      for (const [i, k] of S.columns()) {
        if (A && A.socket === i) continue;
        const p0 = [SOCK[i][0], SOCK[i][1] - 6];
        if (k === 'shaft') {   // Baute's tip: up the shaft at a slant, a spot of gold climbing its wall towards the sky
          const q = S.shaftK(), p1 = [SHAFT[0] + 40 - 36 * q, SHAFT[1] + 50 - 46 * q];
          g.save(); clipAboveRim(g); column(g, p0, 30, p1, 16, 0.24, t); g.restore();
          g.save(); clipOpen(g); patch(g, p1, 26, 0.55); g.restore();
          continue;
        }
        const c = CEN_LOW[k], w = wid(TRI_LOW[k]) * 0.8;
        g.save(); clipAboveRim(g); column(g, p0, 40, c, w, 0.3, t); g.restore();
        g.save(); clipOpen(g); patch(g, c, w, 0.5); g.restore();
      }
      if (A) {   // the disc being aimed: its column sweeps across the wall as it tips
        const p = S.wallAt(A.s), k = S.wallHit(A.s), w = k >= 0 ? wid(TRI_LOW[k]) * 0.8 : 22;
        g.save(); clipAboveRim(g); column(g, [SOCK[A.socket][0], SOCK[A.socket][1] - 6], 40, p, w, 0.24, t); g.restore();
        g.save(); clipOpen(g); patch(g, p, w, 0.4); g.restore();
      }
    }
    g.restore();
    // the discs in their sockets
    const full = new Set(S.columns().map(c => c[0])); if (A) full.add(A.socket);
    if (asV() && S.vTest) { full.delete(3); full.add(4); }
    for (const i of full) { const im = discImg[i]; if (im.complete && im.naturalWidth) g.drawImage(im, ...DISC_AT[i]); }
    if (A) {   // the socket being worked: a faint ring
      g.save(); g.strokeStyle = 'rgba(255,216,138,0.7)'; g.lineWidth = 2; g.beginPath(); g.ellipse(SOCK[A.socket][0], SOCK[A.socket][1], 30, 11, 0, 0, 7); g.stroke(); g.restore();
    }
    // the closing: the triangles flare while the women of light dance in a ring round the noon column, then only the
    // columns (the women and the flash in and out: js/story/dance.js S.drawDance, from this room's animFg)
    if (S.closing) {
      const env = S.closingEnv(performance.now() / 1000 - S.closing);
      if (env > 0) {
        g.save(); g.globalCompositeOperation = 'screen';
        g.save(); clipOpen(g); g.filter = 'blur(3px)'; TRI_LOW.forEach(tr => triFill(g, tr, 0.55 * env)); g.filter = 'none'; g.restore();
        g.restore();
      }
    }
  };
  // ---------------------------------------------------------------- the cave: the same light, seen from above
  S.drawUpLight = function (g, t) {
    const f = F();
    // Monday: the Sea's water standing in the hole until the lock shuts
    if (ch() === 7 && !f.lock_closed) {
      // (low in the hole, below the rim: dark, a slow glint moving on it)
      g.save(); g.beginPath(); g.ellipse(HOLE[0] + 6, HOLE[1] + 24, HOLE[2] - 34, HOLE[3] - 26, 0, 0, 7); g.clip();
      g.fillStyle = 'rgba(12,26,32,0.62)'; g.fillRect(HOLE[0] - HOLE[2], HOLE[1] - HOLE[3], HOLE[2] * 2, HOLE[3] * 2 + 40);
      const gx = HOLE[0] + Math.sin(t * 0.4) * 90, gl = g.createRadialGradient(gx, HOLE[1] + 24, 0, gx, HOLE[1] + 24, 70);
      gl.addColorStop(0, 'rgba(150,190,200,0.16)'); gl.addColorStop(1, 'rgba(150,190,200,0)'); g.fillStyle = gl; g.fillRect(gx - 140, HOLE[1] - 10, 280, 70);
      g.restore();
    }
    if (!S.lightOn()) return;
    g.save(); g.globalCompositeOperation = 'screen';
    // the noon column down from the roof into the hole
    column(g, [ROOF[0], ROOF[1] + 6], 34, [HOLE[0], HOLE[1] + 10], 150, 0.2, t);
    for (const [i, k] of S.columns()) {
      const x0 = HOLE[0] - 44 + i * 14, p0 = [x0, HOLE[1] + 6];
      if (k === 'shaft') { column(g, p0, 20, [ROOF[0] + 6, ROOF[1] + 10], 14, 0.2, t); continue; }
      const c = CEN_UP[k], w = wid(TRI_UP[k]) * 0.75;
      column(g, p0, 24, c, w, 0.24, t);
      patch(g, c, w, 0.45);
    }
    if (f.lock_closed) TRI_UP.forEach(tr => triFill(g, tr, 0.12 + 0.04 * Math.sin(t * 1.3)));
    g.restore();
  };

  // ---------------------------------------------------------------- the cave (upper)
  ROOMS.cave6 = S.room({
    music: 'cave6',
    name: 'Cave 6', bg: 'cave6', floor: 'stone', ambience: 'cistern', parallax: false,
    light: { ambient: 'rgb(226,206,176)', base: 0.9 },
    entries: { default: [200, 640, 'e'], camp: [200, 640, 'e'], cave6_low: [470, 650, 'e'] },
    npcs: [
      { id: 'vasco', x: 780, y: 650, dir: 'w', name: 'Vasco', when: () => ch() === 7, look: 'alan_look_vasco_cave', talk: () => S.talkVascoCave() },
      { id: 'carmen', ch: 'carmen_field', x: 190, y: 640, dir: 'e', name: 'Carmen', when: () => ch() === 7 && (!F().cloud_over || F().lock_closed), look: 'alan_look_carmen_mirror', talk: () => S.talkCarmenCave() },
      { id: 'yeray', ch: 'yeray', x: 330, y: 690, dir: 'e', name: 'Yeray', when: () => ch() === 7, look: 'alan_look_yeray_cave', talk: () => S.talkYerayCave() },
      { id: 'baute', ch: 'baute_dig', x: 1060, y: 620, dir: 'w', name: 'Rayco Baute', when: () => ch() === 7, look: 'alan_look_baute_cave', talk: () => S.talkBauteCave() },
    ],
    hotspots: [
      { name: 'The great triangle', rect: [535, 210, 225, 210], at: [640, 660], look: () => say(asV() ? 'vasco_look_great' : 'alan_look_great'),
        items: { chalk: () => S.chalkSigns(), torch: () => S.readScenes() } },
      { name: 'Engraved triangles', rect: [270, 180, 770, 180], at: [640, 660], noBox: true, look: () => say(asV() ? 'vasco_look_triangles' : 'alan_look_triangles'),
        use: () => asV() ? S.chalkSigns() : say('alan_look_triangles'), items: { chalk: () => S.chalkSigns(), torch: () => S.readScenes() } },
      { name: 'The opening in the roof', rect: [585, 22, 110, 62], at: [640, 660], look: () => say(asV() ? 'vasco_look_opening' : 'alan_look_cave_photos') },
      { name: 'Rope ladder down', rect: [425, 495, 430, 110], at: [500, 650],
        look: () => say(asV() ? 'vasco_look_hole' : 'alan_look_hole'),
        exit: 'cave6_low', entry: 'cave6', locked: () => asV() && !F().v_noon, lockedLine: 'vasco_ladder_dark',
        when: () => asV() },
      { name: 'Rope ladder down', rect: [425, 495, 430, 110], at: [500, 650], when: () => ch() === 7,
        look: 'alan_look_hole', use: () => S.stepIn() },
      { name: 'White crust', rect: [1130, 430, 150, 100], at: [1100, 650], when: () => asV(), look: 'vasco_look_salt' },
      { name: 'Sit and wait for noon', rect: [60, 455, 170, 60], at: [190, 630], when: () => asV() && !F().v_noon, look: 'vasco_look_rock', use: () => S.waitNoon() },
      { name: 'Path to the camp', rect: [35, 150, 185, 300], at: [140, 630], exit: 'camp', entry: 'cave6', when: () => asV() || (ch() === 7 && F().lock_closed) },
    ],
    animBack(g, t) {
      // the cloud below the arch rolling, dust in the sun through the arch
      FX.ripple(g, G.bgImage(), [40, 330, 160, 140], t * 0.3, 1.4, 0.04);
      g.save(); g.beginPath(); g.moveTo(60, 170); g.lineTo(215, 170); g.lineTo(560, 640); g.lineTo(60, 640); g.closePath(); g.clip();
      FX.motes(g, t, 60, 170, 500, 470, 18, '255,232,180'); g.restore();
      S.drawUpLight(g, t);
    },
    // Vasco's first time in today: he walks in under the triangles (the room shows the arch, the dome, the opening and
    // the hole; he says what can't be seen from the door: the signs, and the scenes too fine to see without a torch)
    async enter() {
      if (asV() && !F().v_cave_intro) {
        F().v_cave_intro = true; G.setClock('09:00');
        await G.busy(async () => {
          await G.player.walkTo(640, 660);
          await say('narr_v_cave_5', 'vasco_cave_in');
        });
      }
    },
  });

  // ---------------------------------------------------------------- the chamber under it (lower)
  ROOMS.cave6_low = S.room({
    music: 'cave6',
    name: 'Cave 6 · the chamber under it', bg: 'cave6_low', floor: 'stone', ambience: 'cistern', parallax: false,
    light: { ambient: 'rgb(214,192,160)', base: 0.85 },
    entries: { default: [520, 640, 'e'], cave6: [520, 640, 'e'] },
    hotspots: [
      // the seven sockets, by the sign cut in front of each (floor order: the wall in a mirror)
      ...FLOOR.map((sign, i) => ({
        name: 'Socket · ' + NAME[sign], rect: [SOCK[i][0] - 38, 548, 76, 46], at: [SOCK[i][0], 655],
        look: () => S.lookSocket(i), use: () => S.useSocket(i),
        items: Object.assign({ elena_charts: () => S.understand(i) }, ...TURN.filter(s => s !== 'sun').map(s => ({ ['disc_' + s]: () => S.placeDisc(i, s) }))),
      })),
      { name: 'Signs in the floor', rect: [340, 598, 600, 30], at: [640, 660], look: () => say(asV() ? (F().v_floor ? 'vasco_floor_2' : (F().v_floor = true, 'vasco_floor_1')) : 'alan_look_floor_signs') },
      { name: 'The door', rect: [560, 632, 160, 50], at: [640, 690], look: () => say(asV() ? 'vasco_look_low_door' : F().in_water ? 'alan_look_door_in' : 'alan_look_door') },
      { name: 'Painted walls', rect: [0, 190, 1280, 320], noBox: true, at: [640, 650], look: () => say(asV() ? 'vasco_look_low_walls' : 'alan_look_low_walls') },
      { name: 'The hole above', rect: [400, 20, 480, 150], at: [640, 650], when: () => asV(), look: 'vasco_look_low_opening' },
      { name: 'Vasco, at the rim', rect: [400, 20, 480, 150], at: [640, 650], when: () => ch() === 7, look: 'alan_look_vasco_cave', talk: () => S.talkVascoBelow() },
      { name: 'Rope ladder up', rect: [430, 140, 90, 400], at: [500, 640], exit: 'cave6', entry: 'cave6_low', when: () => asV() },
      { name: 'Rope ladder', rect: [430, 140, 90, 400], at: [500, 640], when: () => ch() === 7, look: 'alan_m_in_already', use: 'alan_m_in_already' },
    ],
    animBack(g, t) { S.drawLowLight(g, t); },
    animFg(g) { S.drawDance(g); },   // (the closing's women of light, after Alan and the water: js/story/dance.js)
    // (the Sea's water in the chamber: js/story/water.js, clearer there, so the sockets and the discs stay readable)
    async enter() {
      if (asV() && !F().v_low_intro) { F().v_low_intro = true; S.sfx('ladder_creak', 0.4); await say('vasco_low_in'); }
    },
  });

  S.lookSocket = function (i) {
    const f = F(), sign = FLOOR[i];
    if (asV()) {
      if (sign === 'sun') return say('vasco_look_disc');
      if (!f.v_sockets_seen) { f.v_sockets_seen = true; return say('vasco_look_sockets_1', 'vasco_look_sockets_2', 'vasco_look_sockets'); }
      return say('vasco_look_sockets');
    }
    if (sign === 'sun') return say(f.lock_closed ? 'alan_look_seventh_set' : 'alan_look_seventh');
    return say((f.placed || []).includes(sign) ? 'alan_socket_set' : 'alan_socket_empty');
  };
  S.useSocket = function (i) {
    if (asV()) return FLOOR[i] === 'sun' ? S.sunTest() : say('vasco_look_sockets');
    return FLOOR[i] === 'sun' ? S.turnSeventh() : S.lookSocket(i);
  };

  // ---------------------------------------------------------------- Saturday: reading the cave
  // the chalk in the worn cuts over the triangles: the seven signs, as they stand on the wall
  S.chalkSigns = async function () {
    const f = F();
    if (!asV()) return say('alan_look_triangles');
    if (!G.has('chalk')) return say('vasco_need_chalk');
    if (f.v_chalked) return say('vasco_chalk_again');
    await G.busy(async () => {
      // he chalks the signs along the wall, left to right, and writes them down as they come up
      await G.player.walkTo(340, 650);
      await S.posed('hand', async () => { S.sfx('pencil_scribble', 0.5); await T(window.FAST ? 10 : 900); });
      await say('vasco_chalk_1');
      await G.player.walkTo(940, 650);
      await S.posed('hand', async () => { S.sfx('pencil_scribble', 0.4); await T(window.FAST ? 10 : 700); });
      await say('vasco_chalk_2', 'vasco_chalk_3');
      f.v_chalked = true;
    });
  };
  // the scenes round the triangles, by the torch raked across the wall: he knows them, and hasn't the words
  S.readScenes = async function () {
    const f = F();
    if (!asV()) return say('alan_look_triangles');
    if (!f.v_chalked) return say('vasco_scenes_early');
    if (f.v_scenes) return say('vasco_scenes_again');
    await G.busy(async () => {
      await S.posed('hand', () => T(window.FAST ? 10 : 900));   // (the torch held flat to the wall)
      await say('vasco_scenes_1', 'vasco_scenes_2', 'vasco_scenes_3');
      S.sfx('pencil_scribble', 0.4);
      await T(window.FAST ? 10 : 800);
      f.v_scenes = true;
    });
  };
  // the rock by the mouth: the morning goes by, and at four minutes past two (Canary summer time) the sun looks down
  S.waitNoon = async function () {
    const f = F();
    if (f.v_noon) return say('vasco_noon_again');
    await G.busy(async () => {
      await say('vasco_noon_wait');
      S.sfx('wind_arches', 0.25);
      for (const c of ['10:00', '11:00', '12:00', '13:00', '14:04']) { G.setClock(c); await T(window.FAST ? 10 : 500); }
      f.v_noon = true;
      S.sfx('fog_lift', 0.3);
      // the column comes down the shaft and one comes back up onto the great triangle: he gets up to look
      await T(window.FAST ? 10 : 1200);
      await G.player.walkTo(560, 650);
      await say('vasco_noon_1');
    });
  };
  // the test: the sun disc lifted into the next socket; its column jumps across to a small triangle on the far side
  S.vTest = false;
  S.sunTest = async function () {
    const f = F();
    if (f.v_test) return say('vasco_test_again');
    await G.busy(async () => {
      // he lifts the sun disc into the next socket: its column jumps across the wall; the water stirs; he puts it back
      await S.posed('kneel', async () => { S.sfx('stone_notch', 0.6); await T(window.FAST ? 10 : 900); });
      S.vTest = true; S.sfx('stone_clack', 0.4);
      await T(window.FAST ? 10 : 1200);
      await say('vasco_test_1');
      S.sfx('water_lap', 0.4);
      await T(window.FAST ? 10 : 600);
      await say('vasco_test_2');
      await S.posed('kneel', async () => { S.sfx('stone_notch_2', 0.6); await T(500); });
      S.vTest = false;
      await T(window.FAST ? 10 : 600);
      f.v_test = true;
    });
  };
  // Elena's last sheet against the floor: how to send the sun back (the angle, the hour), and, turned round, how to shut
  // it. He swallows the corner with the numbers; what the cave is for; Alan; and out to the radio
  S.understand = async function (i) {
    const f = F();
    if (!asV()) return;
    if (FLOOR[i] !== 'sun' || !(f.v_chalked && f.v_scenes && f.v_test)) return say('vasco_puerta_early');
    if (f.v_understood) return say('vasco_finds_again');
    await G.busy(async () => {
      // her last sheet spread on the floor by the sun disc; he works her numbers through, and laughs
      await S.posed('kneel', async () => { S.sfx('paper_shuffle', 0.5); await T(window.FAST ? 10 : 700); S.sfx('pencil_scribble', 0.4); await T(window.FAST ? 10 : 1000); });
      await say('vasco_v_04');
      S.sfx('v_vasco_laugh', 0.5);
      await S.posed('laugh', () => T(window.FAST ? 10 : 1400));
      await say('vasco_puerta_1', 'vasco_shut');
      // where the door is: the middle of the floor, under the hole, where the water stirred
      await G.player.walkTo(640, 690);
      await say('vasco_v_door', 'narr_v_angle_5');
      f.v_understood = true;
      await say('vasco_v_arrows', 'vasco_v_read', 'vasco_v_read_2', 'vasco_v_05', 'vasco_v_06');
      await T(window.FAST ? 10 : 800);
      await S.posed('worried', () => say('vasco_v_alan', 'narr_v_alan_2', 'narr_v_alan_3', 'vasco_v_alan_2', 'vasco_v_radio'));
      G.setClock(null);
      // out, up the rope ladder, fast
      await G.player.walkTo(500, 640);
      S.sfx('ladder_creak', 0.5);
      await G.goRoom('camp', 'cave6', { noSave: true });
    });
  };

  // ---------------------------------------------------------------- the refusal (choices change tone, not outcome)
  // (the novel's Chapter Eight, rewritten 2026-10-30 with Sunday: the coffee with something in it; the thesis; Tasarte
  // and the boy at the bottom of the hill; the number; Elena's disc; "It's very inconvenient")
  S.refusal = async function () {
    const f = F();
    if (f.v_refused) return;
    await G.busy(async () => {
      await say('baute_v_coffee', 'narr_v8_rock_1');
      S.sfx('thermos_cup', 0.5);
      await say('narr_v8_rock_2');
      await say('baute_v_02', 'baute_v8_02b', 'baute_v8_02c', 'baute_v_03');
      await G.dialog([{ line: 'vasco_v_07a', bye: true }, { line: 'vasco_v_07b', bye: true }]);
      await say('narr_v8_rock_3');
      await say('baute_v_04', 'baute_v8_04b', 'baute_v8_04c', 'narr_v8_pendant', 'baute_v8_04d', 'baute_v8_04e', 'baute_v8_04f', 'baute_v8_04g');
      await say('baute_v_05', 'narr_v8_tears', 'baute_v_06', 'baute_v8_06b', 'narr_v8_think', 'vasco_v_08', 'baute_v_07');
      await say('narr_v8_edge');
      await G.dialog([{ line: 'vasco_v_09a', bye: true }, { line: 'vasco_v_09b', bye: true }]);
      await say('narr_v8_old', 'baute_v_08', 'baute_v8_08b', 'vasco_v8_killed', 'baute_v_09', 'baute_v8_09b', 'baute_v8_09c');
      await say('vasco_v_10', 'baute_v_10', 'vasco_v_11', 'narr_v8_hawk', 'baute_v_11');
      f.v_refused = true;
      await S.toVault();
    });
  };
  // down the road to Artenara on foot (the keys are gone); the road tilts; Yeray's "I'm sorry"; the grille
  S.toVault = async function () {
    const f = F();
    await say('vasco_v_walk', 'baute_v_see', 'narr_v8_keys');
    await G.player.walkTo(-60, 680);
    await G.fade(true);
    await say('narr_v_drug', 'narr_v8_drug_2', 'yeray_v8_sorry', 'baute_v8_sleep', 'narr_v8_drug_3');
    f.v_baute_here = false; f.v_yeray_gone = true;
    await G.goRoom('vault_cell', null, { instant: true, noEnter: true, noSave: true, pos: [560, 670, 'e'] });
    S.torch = 1;
    await T(800);
    await G.fade(false);
    await say('narr_v8_wake', 'baute_v8_granary', 'baute_v_12', 'vasco_v_12');
    S.sfx('corridor_steps', 0.4);
    await say('narr_v_silence', 'narr_v8_torch');
    G.autosave();
  };

  // ================================================================ THE VAULT
  S.torch = 1;
  ROOMS.vault = S.room({
    music: 'vault',
    name: 'The granary vault', bg: 'vault', floor: 'stone', ambience: 'cistern', parallax: false,
    bgs: ['vault_open'], bgFn: () => F().vasco_free ? 'vault_open' : 'vault',   // (the grille torn out and down: a second painting)
    light: { ambient: 'rgb(150,140,130)', base: 0.6 },
    entries: { default: [620, 660, 'e'], camp: [1100, 660, 'w'] },
    npcs: [
      // (2026-10-30, the user: "when the water is rising, Alan and Yeray are in the room with Vasco, but aren't affected...
      // the grille doesn't block the exit"): Vasco is behind the bars, in the alcove the painting shows, until he's out
      { id: 'vasco', x: 600, y: 512, h: 270, dir: 'e', name: 'Vasco', when: () => ch() === 6 && !F().vasco_free, look: 'alan_look_vasco_vault', talk: () => S.talkVascoVault() },
      { id: 'vasco', x: 780, y: 670, dir: 'w', name: 'Vasco', when: () => ch() === 6 && !!F().vasco_free, look: 'alan_look_vasco_vault_2', talk: () => S.talkVascoVault() },
      { id: 'yeray', ch: 'yeray', x: 960, y: 660, dir: 'w', name: 'Yeray', when: () => ch() === 6, look: 'alan_look_yeray_vault', talk: () => S.talkYerayVault() },
      // Sunday night: Carmen came down the cleft behind Alan (sun.js)
      { id: 'carmen', ch: 'carmen_field', x: 1110, y: 660, dir: 'w', name: 'Carmen', when: () => ch() === 6 && F().su_camp, look: 'alan_look_carmen_vault', talk: () => S.talkCarmenVault() },
    ],
    hotspots: [
      // (Saturday: the first look counts them, and thinks)
      { name: 'Crates', rect: [110, 430, 200, 120], at: [240, 650],
        look: () => !asV() ? say('alan_look_crates') : F().v_crates_seen ? say('vasco_look_crates') : (F().v_crates_seen = true, say('vasco_look_crates', 'vasco_look_crates_2', 'vasco_look_crates_3')),
        take: () => S.takeDiscs(), use: () => S.takeDiscs() },
      { name: 'Walls', rect: [140, 120, 220, 260], at: [260, 650], noBox: true,
        look: () => !asV() ? say('alan_look_walls') : F().v_walls_seen ? say('vasco_look_walls_2') : (F().v_walls_seen = true, say('vasco_look_walls', 'vasco_look_serpent', 'narr_v8_coils')) },
      { name: 'The grille', rect: [380, 120, 520, 440], at: [640, 650], noBox: true, look: () => say(asV() ? 'vasco_look_grille' : F().vasco_free ? 'alan_look_grille_off' : 'alan_look_grille'),
        use: () => asV() ? say('vasco_look_grille') : S.tearGrille() },
      { name: 'Left anchor', rect: [400, 540, 80, 40], at: [460, 660], when: () => asV(), look: () => say(F().v_left >= 3 ? 'vasco_anchor_out' : 'vasco_look_anchor'),
        use: () => S.dig('left'), items: { ltrowel: () => S.dig('left') } },
      { name: 'Right anchor', rect: [800, 540, 80, 40], at: [820, 660], when: () => asV(), look: () => say(F().v_right >= 2 ? 'vasco_anchor_cm' : 'vasco_look_anchor'),
        use: () => S.dig('right'), items: { ltrowel: () => S.dig('right') } },
      { name: 'The wall by the grille', rect: [900, 300, 120, 160], at: [880, 650], look: () => say(F().v_marked ? (asV() ? 'vasco_look_mark' : 'alan_look_mark') : 'vasco_look_wallbit'),
        use: () => asV() ? S.scratchMark() : say('alan_look_mark'), items: { ltrowel: () => S.scratchMark() } },
      { name: 'Steps up', rect: [1160, 250, 110, 320], at: [1200, 650], when: () => !asV(), exit: 'camp', entry: 'vault', locked: () => !F().vasco_free || !G.has('disc_wax_gibbous'), lockedLine: () => !F().vasco_free ? 'alan_vault_not_without' : 'alan_vault_discs' },
    ],
    // small moving details over the painting: the storm lantern, the torch by the grille, the light down the steps
    animBack(g, t) {
      FX.glow(g, 283, 292, 110, '255,170,80', 0.16 * FX.flicker(t, 1));
      FX.flame(g, t, 283, 300, 14, 1, '255,190,100');
      FX.glow(g, 733, 228, 120, '255,150,60', 0.2 * FX.flicker(t, 5));
      FX.flame(g, t, 733, 244, 26, 5, '255,160,70');
      FX.embers(g, t, 733, 218, 4);
      FX.motes(g, t, 1105, 95, 100, 220, 10, '230,230,220');
      FX.drips(g, t, [[968, 600, 60, 5.3], [214, 618, 90, 7.9]], '200,190,170');
    },
    // the Sea's water only behind the bars, at his face, never through them (js/story/water.js: the cell's floor, clipped to
    // the bars); then the bars again over Vasco and the water (cut from the painting itself: so he's in the cell, not in
    // front of it)
    animFg(g, t) {
      if (!F().vasco_free) S.vaultBars(g);
      if (asV() && S.torch < 1) {
        // the dark, and what the torch still shows
        const p = G.player, r = 40 + 260 * S.torch;
        g.save(); const gr = g.createRadialGradient(p.x, p.y - 200, r * 0.3, p.x, p.y - 200, r + 200);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${0.97})`);
        g.fillStyle = gr; g.fillRect(0, 0, 1280, 720); g.restore();
      }
    },
  });
  // the bars of the grille on the Sunday painting (measured on the 1280 painting), drawn back over whoever's behind them
  const BARS = [375, 406, 440, 474, 510, 547, 585, 623, 664, 704, 744, 782, 818];
  S.vaultBars = function (g) {
    const im = G.bgImage(); if (!im || !im.width) return;
    const k = im.width / 1280, cut = (x, y, w, h) => g.drawImage(im, x * k, y * k, w * k, h * k, x, y, w, h);
    for (const x of BARS) cut(x - 7, 62, 14, 462);
    cut(362, 176, 484, 16); cut(362, 500, 484, 26);   // (the crossbar, the bottom rail)
  };

  // ================================================================ THE CELL (Saturday: the vault from inside)
  // (the user, 2026-10-30: "for the inside ones, we need to paint a new room, in which Vasco sees the other room from a
  // different perspective, from behind the bars"; "narrower... you'd see the crates only"): the alcove behind Sunday's
  // grille; through the bars the crates, the lantern's light from the right, the stairs' grey daylight from the left
  ROOMS.vault_cell = S.room({
    music: 'vault',
    name: 'The granary vault · behind the grille', bg: 'vault_cell', floor: 'stone', ambience: 'cistern', parallax: false,
    light: { ambient: 'rgb(150,140,130)', base: 0.6 },
    walk: [[150, 612], [1130, 612], [1280, 716], [0, 716]], scale: [612, 330, 716, 420],
    entries: { default: [560, 670, 'e'] },
    hotspots: [
      { name: 'The grille', rect: [190, 85, 865, 450], at: [620, 640], noBox: true, look: 'vasco_look_grille', use: 'vasco_look_grille' },
      { name: 'Crates', rect: [880, 250, 170, 230], at: [900, 640],
        look: () => F().v_crates_seen ? say('vasco_look_crates') : (F().v_crates_seen = true, say('vasco_look_crates', 'vasco_look_crates_2', 'vasco_look_crates_3')),
        take: 'vasco_crates_reach', use: 'vasco_crates_reach' },
      { name: 'Walls', rect: [0, 100, 185, 440], at: [230, 660], noBox: true,
        look: () => F().v_walls_seen ? say('vasco_look_walls_2') : (F().v_walls_seen = true, say('vasco_look_walls', 'vasco_look_serpent', 'narr_v8_coils')) },
      { name: 'Left anchor', rect: [195, 540, 60, 60], at: [270, 650], look: () => say(F().v_left >= 3 ? 'vasco_anchor_out' : 'vasco_look_anchor'),
        use: () => S.dig('left'), items: { ltrowel: () => S.dig('left') } },
      { name: 'Right anchor', rect: [995, 540, 60, 60], at: [1000, 650], look: () => say(F().v_right >= 2 ? 'vasco_anchor_cm' : 'vasco_look_anchor'),
        use: () => S.dig('right'), items: { ltrowel: () => S.dig('right') } },
      { name: 'The wall by the grille', rect: [1060, 120, 140, 380], at: [1060, 650], look: () => say(F().v_marked ? 'vasco_look_mark' : 'vasco_look_wallbit'),
        use: () => S.scratchMark(), items: { ltrowel: () => S.scratchMark() } },
    ],
    // the lantern beyond the corner, the grey daylight from the stairs; the water in the cell (the whole floor is the
    // cell: at the grille it stands like a wall and never passes); the torch failing
    animBack(g, t) {
      FX.glow(g, 1050, 260, 220, '255,170,80', 0.12 * FX.flicker(t, 1));
      FX.motes(g, t, 220, 120, 260, 300, 8, '220,224,230');
    },
    animFg(g, t) {   // (the water: js/story/water.js, drawn before this; it stands at the grille like a wall)
      if (S.torch < 1) {
        const p = G.player, r = 40 + 260 * S.torch;
        g.save(); const gr = g.createRadialGradient(p.x, p.y - 200, r * 0.3, p.x, p.y - 200, r + 200);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.97)');
        g.fillStyle = gr; g.fillRect(0, 0, 1280, 720); g.restore();
      }
    },
  });
  S.scratchMark = async function () {
    const f = F();
    if (!asV()) return say('alan_look_mark');
    if (f.v_marked) return say('vasco_mark_done');
    if ((f.v_left || 0) < 3) return say('vasco_mark_early');
    await G.busy(async () => {
      // Lorenzo's trowel: "For the day you find something worth keeping"; the closing angle, for whoever comes; the A
      await say('vasco_trowel_1', 'vasco_trowel_2');
      await S.posed('kneel', async () => { S.sfx('trowel_scrape', 0.5); await T(1200); });
      await say('vasco_mark_1_scratch');
      S.sfx('trowel_scrape_2', 0.4); await T(800);
      f.v_marked = true;
      await say('vasco_mark_a', 'narr_v8_a');
      // his knees go wet: salt water, a thousand metres up, and rising; and for the first time since Friday he isn't angry
      S.sfx('water_seep', 0.5);
      await S.waterTo('vault', 0.12, 2500);
      await say('vasco_wet_1', 'narr_v8_wet', 'vasco_wet_2', 'vasco_wet_3', 'vasco_wet_4');
    });
  };
  S.dig = async function (side) {
    const f = F(), k = 'v_' + side;
    if (!G.has('ltrowel')) return say('vasco_dig_hands');
    if (side === 'left' && (f.v_left || 0) >= 3) return say('vasco_anchor_out');
    if (side === 'right' && !f.v_marked) return say((f.v_left || 0) >= 3 ? 'vasco_right_first_mark' : 'vasco_right_first');
    if (side === 'right' && (f.v_right || 0) >= 2) return say('vasco_anchor_cm');
    S.torch = Math.max(0.15, S.torch - 0.2);
    await S.posed('trowel', async () => { S.sfx('trowel_scrape', 0.5); await T(900); S.sfx('trowel_scrape_2', 0.5); await T(700); });
    f[k] = (f[k] || 0) + 1;
    if (side === 'left') return say(['', 'vasco_dig_1', 'vasco_dig_2', 'vasco_dig_left_out'][f.v_left]);
    if (f.v_right === 1) { await S.waterTo('vault', 0.3, 2500); return say('vasco_dig_right_1'); }
    // the blade snaps with a centimetre left; the water at his chest; the torch going (0.36: chest high, js/story/water.js;
    // Sunday evening it's at his chest still, 0.4, and only then at his mouth, 0.46)
    S.sfx('stone_clack', 0.6);
    await say('vasco_snap');
    await S.waterTo('vault', 0.36, 2500);
    await S.vaultEnd();
  };
  S.vaultEnd = async function () {
    await G.busy(async () => {
      S.torch = 0.12;
      // the prayer, the first since January; Alan; "send the idiot", smiling in the dark
      await say('narr_v8_pray', 'vasco_v_13', 'narr_v8_rusty', 'vasco_v_14', 'narr_v8_thighs');
      await say('narr_prayer_1', 'narr_prayer_2', 'narr_prayer_3');
      S.torch = 0; await T(1200);
      await say('vasco_v_15', 'narr_v8_smile');
      await T(1200);
      await G.fade(true);
      S.water.vault = 0;
      F().v_done = true;
      S.becomeAlan();
      await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [720, 640, 'e'] });
      await G.fade(false);
      await say('narr_cut_alan', 'alan_s_night');
      await S.startSun();
    });
  };
})();
