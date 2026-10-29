// The Shortest Night — Saturday 22 June, Vasco's chapter (played as Vasco, about half an hour). The camp at 07:00
// (Yeray's "Portuguese guy"; Elena's sun charts); Cave 6 at 09:00, reading the light (mark the beam at three times, find
// it off its path, turn a disc to steer it, work out San Juan's sunrise, measure the last disc's angle: 23° 26′); the
// understanding; the radio without its fuse; Baute's refusal; the vault: the mark on the wall, the anchors dug out with
// Lorenzo's trowel, the water rising, the prayer.
// The mountain's rooms live here with every day's use of them: the camp (Sunday night, Monday's sunrise), Cave 6
// (Monday's finale: mon.js), the vault (Sunday's rescue: sun.js).
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
    await say('vasco_v_wake');
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
        items: { fuse: () => S.fuseIn() } },
      { name: 'Finds table', rect: [580, 450, 220, 80], at: [690, 650], look: () => say(asV() ? 'vasco_look_finds' : 'alan_look_finds_camp'),
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
  S.yerayCoffee = async function () {
    const f = F();
    if (f.v_yeray) return say('yeray_v_05');
    f.v_yeray = true;
    S.sfx('coffee_cups', 0.5);
    await say('yeray_v_01', 'vasco_v_01', 'yeray_v_02', 'vasco_v_02', 'yeray_v_03', 'vasco_v_03', 'yeray_v_04');
  };
  S.takeCharts = async function () {
    if (!asV()) return say('alan_look_finds_camp');
    if (G.has('elena_charts')) return say('vasco_finds_again');
    S.give('elena_charts'); S.give('chalk', true); S.give('clinometer', true); S.give('vnotebook', true);
    await say('vasco_take_charts');
  };
  S.lookRadio = async function () {
    const f = F();
    if (ch() === 7) return f.fuse_in ? say('alan_radio_mon') : say('alan_radio_dead');
    if (!asV()) return say('alan_radio_dead');
    if (!f.v_understood) return say('vasco_look_radio');
    if (!f.v_fuse_seen) {
      f.v_fuse_seen = true;
      await say('vasco_radio_fuse');
      f.v_baute_here = true; G.refreshNpcs();
      const b = G.npc('baute'); if (b) b.dir = 'w';
      await say('baute_v_01');
      return;
    }
    return say('vasco_radio_fuse_2');
  };

  // ================================================================ CAVE 6
  // The beam: where it falls on the wall at each half hour (Vasco's chapter), or steered by a disc onto a triangle
  const BEAM_AT = [[330, 360], [420, 330], [520, 300], [880, 360], [1010, 380]];
  // the seven sockets on the skylight's lip, as painted (I-VI, then the seventh); the beam's landing points
  S.SOCKETS = [[509, 85], [578, 95], [648, 102], [720, 102], [792, 97], [864, 87], [931, 68]];
  S.GREAT = [685, 330]; S.DOOR = [680, 562];
  // where the beam is drawn: it slides to a new place over BEAM_SLIDE s (eased), and sways a little and shimmers while
  // it rests, as sunlight through a channel does
  const BEAM_SLIDE = 2.6; let shown = null, from = null, target = null, slideT = 1, lastT = 0;
  const beamShown = t => {
    const to = S.beamPoint(), dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t;
    if (!shown) { shown = to.slice(); target = to.slice(); }
    if (to[0] !== target[0] || to[1] !== target[1]) { from = shown.slice(); target = to.slice(); slideT = 0; }
    if (slideT < 1) { slideT = Math.min(1, slideT + dt / BEAM_SLIDE); const e = slideT * slideT * (3 - 2 * slideT); shown = [from[0] + (target[0] - from[0]) * e, from[1] + (target[1] - from[1]) * e]; }
    return [shown[0] + 4 * Math.sin(t * 0.35), shown[1] + 2 * Math.sin(t * 0.27 + 1)];
  };
  S.beamPoint = () => {
    const f = F();
    if (ch() === 7) return f.lock_closed || f.disc_turned ? S.GREAT : S.DOOR;
    if (f.v_steer) return [492, 300];
    return BEAM_AT[Math.min(BEAM_AT.length - 1, f.v_time || 0)];
  };
  ROOMS.cave6 = S.room({
    music: 'cave6',
    name: 'Cave 6', bg: 'cave6', floor: 'stone', ambience: 'cistern', parallax: false,
    light: { ambient: 'rgb(220,190,150)', base: 0.85 },
    entries: { default: [240, 660, 'e'], camp: [240, 660, 'e'] },
    npcs: [
      { id: 'vasco', x: 420, y: 660, dir: 'e', name: 'Vasco', when: () => ch() === 7, look: 'alan_look_vasco_cave', talk: () => S.talkVascoCave() },
      { id: 'carmen', ch: 'carmen_field', x: 160, y: 650, dir: 'e', name: 'Carmen', when: () => ch() === 7, look: 'alan_look_carmen_mirror', talk: () => S.talkCarmenCave() },
      { id: 'yeray', ch: 'yeray', x: 300, y: 690, dir: 'e', name: 'Yeray', when: () => ch() === 7, look: 'alan_look_yeray_cave', talk: () => S.talkYerayCave() },
      { id: 'baute', ch: 'baute_dig', x: 1040, y: 650, dir: 'w', name: 'Rayco Baute', when: () => ch() === 7, look: 'alan_look_baute_cave', talk: () => S.talkBauteCave() },
    ],
    hotspots: [
      // Vasco's chapter
      { name: 'Engraved triangles', rect: [140, 190, 960, 180], at: [640, 640], noBox: true, look: () => say(asV() ? 'vasco_look_triangles' : 'alan_look_triangles') },
      { name: 'The beam', rect: [600, 60, 120, 120], at: [640, 640], when: () => asV(), look: 'vasco_look_beam', items: { chalk: () => S.markBeam() }, use: () => S.markBeam() },
      { name: 'Empty sockets', rect: [470, 14, 240, 46], at: [560, 640], when: () => asV(), look: 'vasco_look_sockets' },
      { name: 'A remaining disc', rect: [720, 14, 70, 46], at: [740, 640], when: () => asV(), look: 'vasco_look_disc',
        use: () => S.turnDisc(), items: { clinometer: () => S.measureDisc(), any: 'vasco_disc_item' } },
      { name: 'Your chalk marks', rect: [280, 250, 560, 120], at: [560, 640], when: () => asV() && (F().v_marks || []).length > 0,
        look: () => say((F().v_marks || []).length >= 3 ? 'vasco_look_marks_3' : 'vasco_look_marks'), items: { elena_charts: () => S.compareMarks() } },
      { name: 'The great triangle', rect: [560, 380, 160, 120], at: [640, 640], look: () => say(asV() ? 'vasco_look_great' : 'alan_look_great'),
        items: { elena_charts: () => S.sanJuan() } },
      { name: 'White crust', rect: [1060, 470, 140, 70], at: [1080, 650], when: () => asV(), look: 'vasco_look_salt' },
      { name: 'Sit and wait half an hour', rect: [60, 470, 180, 80], at: [160, 650], when: () => asV() && !F().v_steer, look: 'vasco_look_rock', use: () => S.waitHalfHour() },
      { name: 'Path to the camp', rect: [20, 250, 110, 320], at: [70, 650], exit: 'camp', entry: 'cave6', when: () => asV() || (ch() === 7 && F().lock_closed) },
      // Monday: the seven sockets, the seventh disc, the door in the floor (mon.js)
      ...[0, 1, 2, 3, 4, 5].map(i => ({ name: () => 'Socket ' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i] + ((F().placed || []).includes(i) ? ' (set)' : ''), rect: [S.SOCKETS[i][0] - 26, S.SOCKETS[i][1] - 26, 52, 52], at: [680, 600],
        when: () => ch() === 7 && F().in_water, look: () => S.lookSocket(i), items: { discs: () => S.placeDisc(i), disc6: () => S.placeDisc(i) } })),
      { name: 'The seventh disc', rect: [905, 42, 52, 52], at: [680, 600], when: () => ch() === 7, look: () => say(F().disc_turned ? 'alan_look_seventh_set' : 'alan_look_seventh'), use: () => S.turnSeventh() },
      { name: 'The door in the floor', rect: [520, 600, 240, 70], at: [640, 690], when: () => ch() === 7, look: () => say(F().in_water ? 'alan_look_door_in' : 'alan_look_door'), use: () => S.stepIn() },
    ],
    animBack(g, t) {
      const f = F();
      // the blade of sunlight from the channel to where it falls; a cloud over the sun takes it (Monday)
      // the cloud below the arch rolling, and a salt seep glistening down the far wall
      FX.ripple(g, G.bgImage(), [48, 340, 140, 160], t * 0.3, 1.4, 0.04);
      FX.trickles(g, t, [1010, 380, 240, 170], 3, '255,250,235', 0.25);
      if (ch() === 7 && f.cloud_over && !f.mirror_on) return;
      // dust turning in the sun that comes in through the arch
      g.save(); g.beginPath(); g.moveTo(60, 170); g.lineTo(210, 170); g.lineTo(560, 600); g.lineTo(60, 600); g.closePath(); g.clip();
      FX.motes(g, t, 60, 170, 500, 430, 22, '255,232,180'); g.restore();
      S.drawSockets(g);
      const [x, y] = beamShown(t), [sx, sy] = S.SOCKETS[6];
      g.save(); g.globalAlpha = 0.47 + 0.06 * Math.sin(t * 2.3) * Math.sin(t * 0.9); g.fillStyle = 'rgba(255,226,150,1)';
      g.beginPath(); g.moveTo(sx - 8, sy + 10); g.lineTo(sx + 8, sy + 10); g.lineTo(x + 18, y); g.lineTo(x - 18, y); g.closePath(); g.fill(); g.restore();
      FX.glow(g, x, y, 60, '255,220,140', 0.6);
      for (const [mx, my] of (asV() ? f.v_marks || [] : [])) { g.save(); g.strokeStyle = 'rgba(250,250,250,0.85)'; g.lineWidth = 3; g.beginPath(); g.arc(mx, my, 12, 0, 7); g.stroke(); g.restore(); }
    },
    animFg(g, t) { S.drawWater(g, t, S.water.cave6, '24,48,56'); },
  });
  // which sockets hold a disc: Saturday, the sixth and the seventh still do; Monday, the ones Alan has set, and the seventh
  S.socketFull = i => i === 6 || (ch() === 7 ? (F().placed || []).includes(i) : ch() <= 5 && i === 5);
  S.drawSockets = function (g) {
    S.SOCKETS.forEach(([x, y], i) => {
      g.save();
      if (S.socketFull(i)) {
        const gr = g.createRadialGradient(x - 6, y - 6, 2, x, y, 19);
        gr.addColorStop(0, 'rgba(140,150,160,0.95)'); gr.addColorStop(0.35, 'rgba(20,20,26,1)'); gr.addColorStop(1, 'rgba(6,6,8,1)');
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, 18, 0, 7); g.fill();
      } else {
        const gr = g.createRadialGradient(x, y + 4, 2, x, y, 20);
        gr.addColorStop(0, 'rgba(40,26,14,1)'); gr.addColorStop(0.75, 'rgba(70,46,24,1)'); gr.addColorStop(1, 'rgba(120,84,44,0.9)');
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, 19, 0, 7); g.fill();
      }
      g.restore();
    });
  };
  S.waitHalfHour = async function () {
    const f = F();
    f.v_time = Math.min(BEAM_AT.length - 1, (f.v_time || 0) + 1);
    // (the half hour as a time-lapse: the beam slides along the wall to its new place; the user, 2026-10-29: "i don't
    // think the beam moves")
    S.sfx('wind_arches', 0.25); await T(BEAM_SLIDE * 1000 + 300);
    G.setClock(['09:00', '09:30', '10:00', '10:30', '11:00'][f.v_time]);
    await say(f.v_time >= BEAM_AT.length - 1 ? 'vasco_wait_last' : 'vasco_wait');
  };
  S.markBeam = async function () {
    const f = F(), m = f.v_marks || (f.v_marks = []), p = S.beamPoint();
    if (!G.has('chalk')) return say('vasco_need_chalk');
    if (m.some(q => q[0] === p[0])) return say('vasco_marked_already');
    if (m.length >= 3) return say('vasco_marks_enough');
    await S.posed('reach', async () => { S.sfx('pencil_scribble', 0.5); await T(700); });
    m.push(p);
    await say(m.length === 1 ? 'vasco_mark_1' : m.length === 2 ? 'vasco_mark_2' : 'vasco_mark_3');
  };
  S.compareMarks = async function () {
    const f = F();
    if ((f.v_marks || []).length < 3) return say('vasco_compare_early');
    f.v_offpath = true;
    await say('vasco_offpath_1', 'vasco_offpath_2');
  };
  S.turnDisc = async function () {
    const f = F();
    if (!f.v_offpath) return say('vasco_disc_why');
    if (f.v_steer) return say('vasco_disc_again');
    S.sfx('stone_notch', 0.6); await T(600);
    f.v_steer = true;
    await say('vasco_steer_1', 'vasco_steer_2');
  };
  S.sanJuan = async function () {
    const f = F();
    if (!asV()) return say('alan_look_great');
    if (!f.v_steer) return say('vasco_sanjuan_early');
    if (f.v_center) return say('vasco_sanjuan_again');
    await S.posed('kneel', () => say('vasco_sanjuan_1'));
    f.v_center = true;
    await say('vasco_sanjuan_2');
  };
  S.measureDisc = async function () {
    const f = F();
    if (!f.v_center) return say('vasco_measure_early');
    if (f.v_understood) return say('vasco_measure_again');
    S.sfx('stone_notch_2', 0.5); await T(800);
    await say('vasco_v_04');
    f.v_understood = true;
    await say('vasco_v_05', 'vasco_v_06', 'vasco_v_radio');
    G.setClock(null);
  };

  // ---------------------------------------------------------------- the refusal (choices change tone, not outcome)
  S.refusal = async function () {
    const f = F();
    if (f.v_refused) return;
    await G.busy(async () => {
      await say('baute_v_coffee');
      await say('baute_v_02', 'baute_v_03');
      await G.dialog([{ line: 'vasco_v_07a', bye: true }, { line: 'vasco_v_07b', bye: true }]);
      await say('baute_v_04', 'baute_v_05', 'baute_v_06', 'vasco_v_08', 'baute_v_07');
      await G.dialog([{ line: 'vasco_v_09a', bye: true }, { line: 'vasco_v_09b', bye: true }]);
      await say('baute_v_08', 'baute_v_09', 'vasco_v_10', 'baute_v_10', 'vasco_v_11', 'baute_v_11');
      f.v_refused = true;
      await S.toVault();
    });
  };
  S.toVault = async function () {
    const f = F();
    await say('baute_v_see', 'vasco_v_walk');
    await G.player.walkTo(-60, 680);
    await G.fade(true);
    await say('narr_v_drug');
    f.v_baute_here = false; f.v_yeray_gone = true;
    await G.goRoom('vault', null, { instant: true, noEnter: true, noSave: true, pos: [620, 660, 'e'] });
    S.torch = 1;
    await G.fade(false);
    await say('baute_v_12', 'vasco_v_12');
    S.sfx('corridor_steps', 0.4);
    await say('narr_v_silence');
    G.autosave();
  };

  // ================================================================ THE VAULT
  S.torch = 1;
  ROOMS.vault = S.room({
    music: 'vault',
    name: 'The granary vault', bg: 'vault', floor: 'stone', ambience: 'cistern', parallax: false,
    light: { ambient: 'rgb(150,140,130)', base: 0.6 },
    entries: { default: [620, 660, 'e'], camp: [1100, 660, 'w'] },
    npcs: [
      { id: 'vasco', x: 640, y: 640, dir: 'e', name: 'Vasco', when: () => ch() === 6, look: 'alan_look_vasco_vault', talk: () => say('vasco_su_vault') },
      { id: 'yeray', ch: 'yeray', x: 960, y: 660, dir: 'w', name: 'Yeray', when: () => ch() === 6, look: 'alan_look_yeray_vault', talk: () => S.talkYerayVault() },
    ],
    hotspots: [
      { name: 'Crates', rect: [110, 430, 200, 120], at: [240, 650], look: () => say(asV() ? 'vasco_look_crates' : 'alan_look_crates'),
        take: () => S.takeDiscs(), use: () => S.takeDiscs() },
      { name: 'Walls', rect: [140, 120, 220, 260], at: [260, 650], noBox: true, look: () => say(asV() ? 'vasco_look_walls' : 'alan_look_walls') },
      { name: 'The grille', rect: [380, 120, 520, 440], at: [640, 650], noBox: true, look: () => say(asV() ? 'vasco_look_grille' : F().vasco_free ? 'alan_look_grille_off' : 'alan_look_grille'),
        use: () => asV() ? say('vasco_look_grille') : S.tearGrille() },
      { name: 'Left anchor', rect: [400, 540, 80, 40], at: [460, 660], when: () => asV(), look: () => say(F().v_left >= 3 ? 'vasco_anchor_out' : 'vasco_look_anchor'),
        use: () => S.dig('left'), items: { ltrowel: () => S.dig('left') } },
      { name: 'Right anchor', rect: [800, 540, 80, 40], at: [820, 660], when: () => asV(), look: () => say(F().v_right >= 2 ? 'vasco_anchor_cm' : 'vasco_look_anchor'),
        use: () => S.dig('right'), items: { ltrowel: () => S.dig('right') } },
      { name: 'The wall by the grille', rect: [900, 300, 120, 160], at: [880, 650], look: () => say(F().v_marked ? (asV() ? 'vasco_look_mark' : 'alan_look_mark') : 'vasco_look_wallbit'),
        use: () => asV() ? S.scratchMark() : say('alan_look_mark'), items: { ltrowel: () => S.scratchMark() } },
      { name: 'Steps up', rect: [1160, 250, 110, 320], at: [1200, 650], when: () => !asV(), exit: 'camp', entry: 'vault', locked: () => !F().vasco_free || !G.has('discs'), lockedLine: () => !F().vasco_free ? 'alan_vault_not_without' : 'alan_vault_discs' },
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
    animFg(g, t) {
      S.drawWater(g, t, S.water.vault, '20,40,46');
      if (asV() && S.torch < 1) {
        // the dark, and what the torch still shows
        const p = G.player, r = 40 + 260 * S.torch;
        g.save(); const gr = g.createRadialGradient(p.x, p.y - 200, r * 0.3, p.x, p.y - 200, r + 200);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${0.97})`);
        g.fillStyle = gr; g.fillRect(0, 0, 1280, 720); g.restore();
      }
    },
  });
  S.scratchMark = async function () {
    const f = F();
    if (!asV()) return say('alan_look_mark');
    if (f.v_marked) return say('vasco_mark_done');
    if ((f.v_left || 0) < 3) return say('vasco_mark_early');
    await S.posed('kneel', async () => { S.sfx('trowel_scrape', 0.5); await T(1200); });
    await say('vasco_mark_1_scratch');
    S.sfx('trowel_scrape_2', 0.4); await T(800);
    f.v_marked = true;
    await say('vasco_mark_a');
    // his knees go wet: salt water, a thousand metres up, and rising
    S.sfx('water_seep', 0.5);
    await S.waterTo('vault', 0.12, 2500);
    await say('vasco_wet_1', 'vasco_wet_2');
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
    // the blade snaps with a centimetre left; the water at his chest; the torch going
    S.sfx('stone_clack', 0.6);
    await say('vasco_snap');
    await S.waterTo('vault', 0.45, 2500);
    await S.vaultEnd();
  };
  S.vaultEnd = async function () {
    await G.busy(async () => {
      S.torch = 0.12;
      await say('vasco_v_13', 'vasco_v_14', 'vasco_v_15');
      S.torch = 0; await T(1600);
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
