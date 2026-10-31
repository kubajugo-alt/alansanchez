// The Shortest Night — Monday 24 June: San Juan, Las Palmas's 518th birthday. Chapters Eleven and Twelve of the novel,
// with Cave 6 as redesigned on 2026-10-30 (docs/puzzles/CAVE6.md).
// Dawn in the cave: Baute on his camp stool; he tipped the sun disc by eye at four in the morning and waits for twelve,
// "the top of the day" to him; Alan's answer (Vicente Lacerda: "It's just the sea"). At twelve the column comes down
// the shaft and the sun disc sends it back up at a slant: a spot of gold that climbs the shaft's wall towards the sky,
// and at 14:05, true noon, the door opens. Two halves, two people: Vasco at the rim reads the wall (Alan can't see it
// from below); Alan in the chamber, in the Sea's water, has the five discs from the vault and where they go (the signs
// in the floor, Vasco's vault mark), not when. Baute breaks (the stain over Las Palmas, Carmen's street), says his
// grandmother's telling verse by verse (Vasco echoes it in English) and gives up the crescent he kept. Each verse to its
// scene on a notebook page; each disc into its socket in the telling's order, and aimed (tipped left and right with the
// mouse or the arrow keys, the column sweeping across the wall in real time; a click or Enter sets it). Three ways to
// be wrong, each a surge (another disc's triangle; out of its turn; a wrong socket can't reach its own): three and the
// Sea takes him. Then the sun disc, laid flat: a cloud; Carmen's wing mirror from the top of the rock. The seventh set:
// the triangles flare, the women of light dance round the noon column; the door shuts and takes Alan; the chain of hands.
// The confession (the player chooses when, and how), the trowel, Yeray's fuse and the Guardia, Carmen and Rayco on the
// rock, the road down, Nieves, Chano and San Borondón, the fireworks, the last night, the coffee.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  const { WALL, FLOOR, TURN, NAME } = S.CAVE;
  const placedN = () => (F().placed || []).length;
  // the discs, each its own thing in his pockets (the five from the vault, the crescent from Baute)
  const DISC_ICON = { wax_gibbous: 'Gibbous +', last_quarter: 'Last qtr', wax_crescent: 'Crescent +', wan_gibbous: 'Gibbous −', first_quarter: 'First qtr', wan_crescent: 'Crescent −' };
  for (const s of TURN) if (s !== 'sun') {
    S.ITEMS['disc_' + s] = { name: 'Obsidian disc: the ' + NAME[s], look: s === 'wan_crescent' ? 'alan_look_disc6' : 'alan_look_discs' };
    window.ICON_LABELS['disc_' + s] = DISC_ICON[s];
  }
  S.giveDiscs = () => { for (const s of TURN.slice(0, 5)) S.give('disc_' + s, true); };
  // the clock: minutes since midnight, kept in the save (twelve to 14:05 is the race)
  const clock = m => { F().mclock = m; G.setClock(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')); };
  // each disc set moves the clock on; the sixth leaves two minutes; the sun at 14:05
  const SET_AT = [745, 765, 785, 805, 820, 843];
  // the water in the chamber: a hand higher with each disc and each surge
  const waterBase = () => { const f = F(); return f.cloud_over ? 0.42 : 0.17 + 0.025 * placedN(); };
  // what Vasco would say now, to put Alan back on the thread (after a surge, after a retry)
  S.callNow = function () {
    const f = F(), n = placedN();
    if (n < 6) return f.disc6_given ? 'vasco_m_page' : 'vasco_m_ready';
    if (f.cloud_over && !f.mirror_on) return 'vasco_m_light';
    if (f.mirror_on) return 'vasco_m_seventh_2';
    return 'vasco_m_seventh';
  };

  // ---------------------------------------------------------------- dawn: Baute on his stool, and Alan's answer; noon
  S.startMon = async function () {
    await G.busy(async () => {
      await G.fade(true);
      await G.goRoom('cave6', null, { instant: true, noEnter: true, noSave: true, pos: [470, 660, 'e'] });
      clock(412);
      await S.day(7);
      S.water.cave6 = 0; S.water.cave6_low = 0.1;
      await G.fade(false);
      await say('narr_mon_baute');
      await say('baute_m_1', 'baute_m_1b', 'baute_m_1c');
      // Vasco goes to the rim and looks down at the sun disc, tipped in its socket
      const v = G.npc('vasco');
      if (v) { await Promise.race([v.walkTo(700, 640), T(window.FAST ? 50 : 4000)]); v.dir = 'w'; }
      await T(window.FAST ? 10 : 1000);
      await say('vasco_m_1', 'baute_m_close', 'vasco_m_1b', 'vasco_m_1c');
      await say('narr_mon_smile', 'baute_m_2', 'baute_m_2b');
      await say('alan_m_1', 'narr_mon_alan', 'alan_m_1b', 'alan_m_1c', 'alan_m_1d', 'alan_m_1e');
      // the water comes up in the hole (heard from up here; Yeray at the edge sees it), and the morning goes over them
      S.sfx('water_rise_2', 0.7);
      await S.waterTo('cave6_low', 0.16, 1200);
      await say('yeray_m_rung', 'narr_mon_wait');
      for (const m of [480, 570, 660, 718]) { clock(m); await T(window.FAST ? 10 : 600); }
      // twelve: the column comes down the shaft, and the tipped sun sends it back up at a slant (drawn: S.columns)
      clock(720); S.sfx('fog_lift', 0.3);
      await T(window.FAST ? 10 : 1500);
      await say('vasco_m_twenty', 'vasco_m_climb');
      await say('carmen_m_five', 'narr_mon_tighter');
      await say('vasco_m_halves', 'vasco_m_who');
      G.checkpoint();
    });
  };

  S.talkVascoCave = async function () {
    const f = F();
    if (f.lock_closed) return S.confessionTalk();
    return say('vasco_m_door');
  };
  S.talkCarmenCave = async function () {
    const f = F();
    if (f.lock_closed) return f.fuse_in ? say('carmen_m_guardia_done') : say('carmen_m_fuse');
    return say('carmen_m_1');
  };
  S.talkYerayCave = async function () {
    const f = F();
    if (f.lock_closed && !f.fuse_given) {
      f.fuse_given = true;
      await say('narr_m_fuse_twist', 'yeray_m_fuse');
      S.give('fuse');
      return say('alan_m_fuse');
    }
    return say(f.lock_closed ? 'yeray_m_after' : 'yeray_m_1');
  };
  S.talkBauteCave = async function () {
    const f = F();
    if (f.lock_closed) return say(f.fuse_in ? 'baute_m_turn_in' : 'baute_m_after');
    return say(f.disc6_given ? 'baute_m_given' : 'baute_m_hold');
  };

  // ---------------------------------------------------------------- down the rope ladder, into the water
  S.stepIn = async function () {
    const f = F();
    if (f.lock_closed) return say('alan_look_hole');
    if (f.in_water) return G.goRoom('cave6_low', 'cave6');
    if (G.has('discs')) { G.takeItem('discs'); S.giveDiscs(); }   // (a save from before the redesign: the bag of five)
    if (!TURN.slice(0, 5).some(s => G.has('disc_' + s))) return say('alan_m_no_discs');
    await G.busy(async () => {
      await say('alan_m_coming', 'vasco_m_no', 'alan_m_anyway');
      f.in_water = true;
      await G.fade(true);
      await G.goRoom('cave6_low', 'cave6', { instant: true, noEnter: true, noSave: true });
      S.water.cave6_low = 0.12;
      await G.fade(false);
      S.sfx('ladder_creak', 0.5); S.sfx('step_wet', 0.7);
      await S.waterTo('cave6_low', waterBase(), 2000);
      await say('narr_m_quiet_2', 'alan_m_knows');
      await say('vasco_m_ready');
      G.checkpoint();
    });
  };
  // Vasco at the rim, above: he reads the scene round any triangle; he can't say which comes first; when the cloud has
  // taken the light, Alan shouts for Carmen instead
  S.talkVascoBelow = async function () {
    const f = F();
    if (f.cloud_over && !f.mirror_on) return S.wingMirror();
    let first = false;
    // (the user, 2026-10-30: "Vasco nudges"): once Baute has said the telling, "Which one goes first?" (then "...next?")
    // has Vasco read the scene round the next disc's triangle in the telling's order, never naming its sign
    const next = TURN[placedN()];
    const nudge = f.telling_heard && next
      ? { line: placedN() ? 'alan_m_ask_next' : 'alan_m_ask_first', bye: true, run: () => { f.nudged = next; return say('vasco_nudge_' + next); } }
      : { label: 'Which one goes first?', bye: true, run: () => { first = true; } };
    await G.dialog([
      ...WALL.map(s => ({ label: 'Read me the one with the ' + NAME[s].replace(/^the /, '') + '.', run: () => say('vasco_scene_' + s) })),
      nudge,
      { label: 'Nothing. Keep watching.', bye: true },
    ]);
    if (!first) return;
    if (!f.disc6_given) { await say('vasco_m_stuck'); return S.bauteGives(); }
    if (f.telling_known) return say('alan_pz_telling_done');
    await say('vasco_m_page'); return S.openPage('telling');
  };

  // ---------------------------------------------------------------- aiming a disc (the user: "watching the beam move in
  // real time"): the disc rocks on its rounded base; the mouse (left and right) or the arrow keys tip it, and its column
  // sweeps across the wall above, seen up through the hole; a click or Enter sets it where it is; Escape (or a right
  // click) takes it out again. A socket's disc reaches only the triangles round the one its socket faces (6 - i).
  // Resolves to the triangle hit (0..6), -1 for bare rock, or null when he took it out.
  S.AIM = null;
  S.autoAim = null;   // (tests: fn(socket, sign) -> the triangle to set it on)
  S.aim = function (socket, sign) {
    const m = 6 - socket, lo = Math.max(-0.6, m - 1.6), hi = Math.min(6.6, m + 1.6);
    const A = S.AIM = { socket, sign, s: Math.min(hi, Math.max(lo, m + (Math.random() < 0.5 ? -1 : 1) * 0.9)), lo, hi };
    return new Promise(done => {
      const canvas = document.getElementById('scene');
      const end = v => { canvas.removeEventListener('mousemove', move, true); canvas.removeEventListener('click', click, true); canvas.removeEventListener('contextmenu', ctx, true); document.removeEventListener('keydown', key, true); S.AIM = null; done(v); };
      const commit = () => { const k = S.wallHit(A.s); S.sfx('stone_notch_2', 0.4); end(k); };
      const move = e => { const r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 1280; A.s = lo + (hi - lo) * Math.max(0, Math.min(1, (x - 240) / 800)); };
      const click = e => { e.stopImmediatePropagation(); e.preventDefault(); commit(); };
      const ctx = e => { e.stopImmediatePropagation(); e.preventDefault(); end(null); };
      const key = e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { A.s = Math.max(lo, Math.min(hi, A.s + (e.key === 'ArrowLeft' ? -0.04 : 0.04))); }
        else if (e.key === 'Enter' || e.key === ' ') commit();
        else if (e.key === 'Escape') end(null);
        else return;
        e.stopImmediatePropagation(); e.preventDefault();
      };
      canvas.addEventListener('mousemove', move, true); canvas.addEventListener('click', click, true); canvas.addEventListener('contextmenu', ctx, true);
      document.addEventListener('keydown', key, true);
      if (!F().aim_tip) { F().aim_tip = true; if (G.toast && !window.FAST) G.toast('Tip it: the mouse left and right, or ← →. Click or Enter to set it. Esc takes it out.'); }
      if (S.autoAim) { const k = S.autoAim(socket, sign); A.s = k; setTimeout(commit, window.FAST ? 30 : 900); }
    });
  };

  // a disc into a socket, then aimed: right (its own triangle, in its turn), bare rock (aim again), or a surge
  S.placeDisc = async function (i, sign) {
    const f = F(), placed = f.placed || (f.placed = []), sockSign = FLOOR[i];
    if (!f.in_water) return;
    if (sockSign === 'sun') return say('alan_look_seventh');
    if (placed.includes(sockSign)) return say('alan_socket_set');
    G.takeItem('disc_' + sign);
    await S.posed('pickup', async () => { S.sfx('stone_notch', 0.6); await T(window.FAST ? 10 : 500); });
    let k;
    for (;;) {
      k = await S.aim(i, sign);
      if (k !== -1) break;
      await say('vasco_m_rock');
    }
    if (k === null) { S.give('disc_' + sign, true); return; }   // (taken out again: no harm done)
    const want = 6 - WALL.indexOf(sign);   // (the socket this disc belongs in)
    if (WALL[k] !== sign) { S.give('disc_' + sign, true); return S.surge('vasco_hit_' + WALL[k]); }
    if (i !== want) { S.give('disc_' + sign, true); return S.surge('vasco_m_wrong_1'); }
    if (TURN[placed.length] !== sign) { S.give('disc_' + sign, true); return S.surge('vasco_m_turn'); }
    placed.push(sign);
    clock(SET_AT[placed.length - 1]);
    S.sfx('glass_set', 0.4);
    await say(['vasco_m_good_1', 'vasco_m_good_2', 'vasco_m_good_3', 'vasco_m_good_4', 'vasco_m_good_5', 'vasco_m_good_6'][placed.length - 1], 'vasco_scene_' + sign);
    await S.waterTo('cave6_low', waterBase(), 900);
    if (placed.length === 5 && !f.disc6_given) return S.bauteGives();
    if (placed.length === 6) return S.sixSet();
    if (placed.length >= 2) G.checkpoint();
  };
  // a wrong disc (or the sun set wrong): the water surges; three and it takes him
  S.surge = async function (why) {
    const f = F();
    f.surges = (f.surges || 0) + 1;
    const was = S.water.cave6_low || waterBase();
    S.sfx('water_rise_2', 0.7);
    if (why) await say(why);
    await S.waterTo('cave6_low', was + 0.06 * f.surges, 900);
    if (f.surges >= 3) return S.drowned();
    if (f.surges === 1) {
      S.sfx('rope_creak', 0.5);   // (the rope ladder swinging)
      await say('carmen_m_surge', 'vasco_m_wrong_1');
      await S.waterTo('cave6_low', was + 0.04, 1400);
      await say('narr_m_dog');
      if (!f.disc6_given) { await say('vasco_m_stuck'); return S.bauteGives(); }
    } else await say('vasco_m_wrong_2');
    await say(S.callNow());
  };
  S.drowned = async function () {
    // the water rises over him, and goes quiet
    S.sfx('water_rise_3', 0.8);
    await S.waterTo('cave6_low', 0.6, 1600);   // (over his head: js/story/water.js S.waterH)
    await T(window.FAST ? 10 : 800);
    document.querySelector('#death .msg').textContent = window.LINES.narr_death[1];
    G.showModal('death', true);
  };
  document.getElementById('btn-retry').onclick = async e => {
    e.stopPropagation(); G.showModal('death', false);
    const cp = F()._checkpoint;
    if (cp) await G.loadSave(cp);
    const f = F(); f.surges = 0;
    S.water.cave6_low = waterBase();
    if (f.in_water) { G.toast('Again. Listen to him.'); await say(S.callNow()); }
  };

  // ---------------------------------------------------------------- Baute's last help: the stain over the city, the
  // telling (his grandmother's, verse by verse; Vasco says each one down into the hole in English), the crescent
  S.bauteGives = async function () {
    const f = F();
    if (f.disc6_given) return;
    await G.busy(async () => {
      clock(Math.max(f.mclock || 0, 800));
      // (the clock and the spot of gold climbing the shaft show the time; Baute is up at the rim, out of Alan's sight)
      await say('vasco_m_rayco_up');
      S.sfx('fog_lift', 0.4);
      await say('narr_m_stain', 'narr_m_south');
      await say('carmen_m_street', 'carmen_m_street_2', 'carmen_m_street_3');
      await say('narr_m_baute_silent', 'carmen_m_concrete');
      await say('narr_m_goes_out', 'baute_m_stain_3');
      await say('baute_m_grandmother');
      for (let n = 1; n <= 7; n++) await say('baute_m_verse_' + n, 'vasco_m_verse_' + n);
      // he holds the crescent down into the hole; Alan reaches up and takes it
      await say('baute_m_listen');
      await S.posed('pickup', async () => { S.sfx('step_wet_2', 0.6); await T(window.FAST ? 10 : 700); });
      await say('baute_m_crescent');
      f.disc6_given = true; f.telling_heard = true; S.give('disc_wan_crescent');
      await say('vasco_m_page');
      G.checkpoint();
    });
    if (!f.telling_known) await S.openPage('telling');
  };
  // six moons set: two minutes; the sun, flat, in the middle
  S.sixSet = async function () {
    await G.busy(async () => {
      await say('vasco_m_seventh', 'vasco_m_seventh_3');
      await say('alan_m_yes', 'vasco_m_dead_centre', 'alan_m_understand');
      G.checkpoint();
    });
  };

  // ---------------------------------------------------------------- the seventh: the cloud, the mirror, the sun laid flat
  S.turnSeventh = async function () {
    const f = F();
    if (f.lock_closed) return say('alan_look_seventh_set');
    if (!f.in_water || placedN() < 6) return say('vasco_m_seventh_wait');
    if (!f.cloud_over) return S.cloudCrosses();
    if (!f.mirror_on) return say('alan_m_dark', 'vasco_m_light');
    return S.layFlat();
  };
  S.cloudCrosses = async function () {
    const f = F();
    await G.busy(async () => {
      await S.posed('pickup', async () => { await say('alan_m_cold'); });
      S.sfx('water_rise', 0.5);
      await S.waterTo('cave6_low', 0.34, 1600);
      await say('narr_m_chest');
      // a cloud over the sun: every column goes out (drawn: S.columns)
      f.cloud_over = true; S.sfx('fog_lift', 0.5);
      await T(window.FAST ? 10 : 900);
      await say('vasco_m_cloud', 'vasco_m_nonono');
      S.sfx('water_rise_3', 0.8);
      await S.waterTo('cave6_low', 0.42, 1000);
      await say('narr_m_roar', 'vasco_m_light');
      G.checkpoint();
    });
  };
  // Alan shouts up for Carmen: she's already gone, to the Land Rover, and up onto the rock with its wing mirror
  S.wingMirror = async function () {
    const f = F();
    await G.busy(async () => {
      await say('alan_m_carmen_light', 'yeray_m_gone');
      await T(window.FAST ? 10 : 900);
      // the wing mirror torn off the Land Rover (heard), and Carmen up on the rock over the shaft
      S.sfx('tile_shatter', 0.6); S.sfx('shutter_bang', 0.4);
      await T(window.FAST ? 10 : 700);
      await say('yeray_m_mirror', 'carmen_m_mirror');
      f.mirror_on = true; S.sfx('glass_set', 0.5);
      await T(window.FAST ? 10 : 1000);
      await say('vasco_m_mirror_lit', 'vasco_m_seventh_2');
      G.checkpoint();
    });
  };
  // the sun disc, tipped by Baute, laid flat and aimed like the others: onto the great triangle, in the middle
  S.layFlat = async function () {
    const f = F();
    if (!f.mirror_held) { f.mirror_held = true; await say('carmen_m_holding'); }
    let k;
    for (;;) {
      k = await S.aim(3, 'sun');
      if (k !== -1) break;
      await say('vasco_m_rock');
    }
    if (k === null) return;
    if (k !== 3) return S.surge('vasco_hit_' + WALL[k]);
    await say('narr_m_mouth');
    return S.closeLock();
  };
  S.closeLock = async function () {
    const f = F();
    f.sun_flat = true; f.disc_turned = true; clock(845);
    await G.busy(async () => {
      // the cloud slides off; the real light comes down onto all seven, and seven columns go back up, the sun's on the
      // great triangle, dead centre (all drawn: S.columns)
      S.sfx('stone_wheel', 0.7); await T(600);
      S.sfx('fog_lift', 0.5);
      await say('carmen_m_sun');
      await T(window.FAST ? 10 : 1200);
      await say('vasco_m_true');
      await T(window.FAST ? 10 : 1200);
      // the triangles flare; the women of light, in a ring round the noon column (about ten seconds, no words); then only
      // the columns
      S.closing = performance.now() / 1000; S.sfx('bell_hum', 0.35);
      await T(window.FAST ? 20 : 11800);   // (in, held, and faded out: vasco.js S.drawLowLight's envelope, 11.5 s)
      S.closing = null;
      await T(window.FAST ? 10 : 800);
      await say('narr_m_breath');
      S.sfx('water_drain', 0.8);
      await S.paint('still_chain', async () => {
        await say('narr_m_drag', 'narr_m_drag_2', 'alan_m_so_this', 'narr_m_stops');
        await say('narr_m_hand', 'vasco_m_hold', 'narr_m_chain');
        await say('narr_m_dry', 'narr_m_chain_2', 'narr_m_nobody');
        await say('vasco_m_stopped', 'vasco_m_twice', 'vasco_m_twice_2');
      }, { zoom: [1.0, 1.1] });
      f.lock_closed = true; f.in_water = false; S.water.cave6_low = 0; S.water.cave6 = 0;
      await G.goRoom('cave6', null, { instant: true, noEnter: true, noSave: true, pos: [560, 660, 'e'] });
      await S.paint('still_sunrise', async () => {
        S.sfx('dawn_birds', 0.4);
        await say('narr_m_torn', 'narr_m_glimpse', 'narr_m_nobody_said');
        await say('narr_m_sunrise', 'narr_m_waking', 'narr_m_reading', 'narr_m_wrist');
      }, { zoom: [1.0, 1.08], pan: [[0.5, 0.6], [0.5, 0.45]] });
      G.endStill();
      G.setClock(null);
      const p = G.player; p.x = 560; p.y = 660;
      await G.fade(false);
      // they come out to the cave mouth, into the sun
      await say('narr_m_out', 'alan_m_after');
      S.sfx('match', 0.5);
      await say('narr_m_one_try', 'carmen_m_after', 'yeray_m_after_1');
      await say('narr_m_baute_hat', 'narr_m_old_thing', 'alan_m_today');
      G.checkpoint();
    });
  };

  // ---------------------------------------------------------------- the confession: when, and how
  S.confessionTalk = async function () {
    const f = F();
    if (f.confessed) return say(f.trowel_given ? 'vasco_m_after_trowel' : 'vasco_m_after');
    await G.dialog([
      { line: 'alan_m_ask_hurt', once: true, run: () => say('vasco_m_hurt', 'vasco_m_hurt_2') },
      { line: 'alan_m_ask_monte', once: true, run: () => say('vasco_m_monte') },
      { line: 'alan_m_confess', run: () => S.confess(), bye: true },
      { line: 'alan_m_later', bye: true, run: () => say('vasco_m_later', 'narr_m_later') },
    ]);
  };
  // what Vasco knew, whichever way it's told
  const KNEW = ['vasco_m_plain_1', 'vasco_m_knew_2', 'vasco_m_knew_3', 'vasco_m_knew_4', 'vasco_m_knew_5'];
  S.confess = async function () {
    const f = F();
    await say('narr_m_turned', 'alan_m_confess_1', 'alan_m_confess_1b', 'alan_m_confess_1c');
    await G.dialog([
      { line: 'alan_m_plain', run: async () => {
        f.confession = 'plain';
        await say('alan_m_plain_2', 'alan_m_plain_3', 'narr_m_all', 'narr_m_hawk', ...KNEW, 'vasco_m_didnt_wait', 'alan_m_no', 'narr_m_watch', 'vasco_m_first');
      }, bye: true },
      { line: 'alan_m_excuses', run: async () => {
        f.confession = 'excuses';
        await say('alan_m_excuses_2', 'narr_m_silence', 'vasco_m_excuses_1', ...KNEW, 'narr_m_watch', 'vasco_m_first');
      }, bye: true },
      { line: 'alan_m_blame', run: async () => {
        f.confession = 'blame';
        await say('alan_m_blame_2', 'vasco_m_blame_1', ...KNEW, 'vasco_m_didnt_wait', 'alan_m_no', 'narr_m_watch', 'vasco_m_first');
      }, bye: true },
    ]);
    f.confessed = true;
    await say('narr_m_stay');
    // Lorenzo's trowel
    await say('narr_m_pocket', 'vasco_m_trowel_1', 'vasco_m_trowel_1b', 'vasco_m_trowel_1c', 'vasco_m_trowel_2');
    f.trowel_given = true; S.give('trowel');
    await say('alan_m_trowel', 'narr_m_warm');
    await S.checkEnd();
  };
  // the radio, fuse restored: the Guardia Civil
  S.fuseIn = async function () {
    const f = F();
    if (f.ch !== 7 || !f.lock_closed) return say('alan_radio_dead');
    if (f.fuse_in) return say('alan_radio_mon');
    G.takeItem('fuse'); f.fuse_in = true;
    S.sfx('relay_click', 0.6); await T(500);
    await say('alan_m_fuse_in', 'narr_m_radio', 'carmen_m_radio', 'narr_m_cousin', 'carmen_m_guardia');
    await S.checkEnd();
  };
  S.checkEnd = async function () {
    const f = F();
    if (!(f.confessed && f.fuse_in) || f.won) return;
    f.won = true;
    await S.ending();
  };

  // ---------------------------------------------------------------- the ending
  S.ending = async function () {
    const f = F();
    await G.busy(async () => {
      // Carmen and Rayco on the rock at the cave mouth; the keys; the Guardia at nine
      if (G.room && G.room.id !== 'cave6') await G.goRoom('cave6', 'camp', { noEnter: true, noSave: true });
      await say('narr_end_rock', 'carmen_m_tell_rayco', 'baute_m_wait', 'carmen_m_ride', 'baute_m_elena', 'carmen_m_notnow');
      await say('carmen_m_visit', 'carmen_m_right', 'carmen_m_me', 'narr_end_smoke');
      S.sfx('keys_ring', 0.5);
      await say('narr_end_keys', 'carmen_m_keys', 'carmen_m_keys_2');
      await say('narr_end_guardia', 'narr_end_handshake', 'baute_m_director', 'narr_end_away');
      // the road down, through the cloud
      await S.paint('still_road_down', async () => {
        await say('narr_end_road', 'narr_end_cloud', 'vasco_end_hand');
        await say(f.confession === 'excuses' ? 'narr_end_excuses' : 'narr_end_plain');
        await say('narr_end_promise', 'alan_end_ask', 'narr_end_window', 'vasco_end_last', 'narr_end_gearstick');
      }, { zoom: [1.0, 1.1] });
      // the city's birthday; Nieves
      await G.goRoom('hotel_lobby', null, { instant: true, noEnter: true, noSave: true, pos: [480, 640, 'e'] });
      G.endStill();
      await G.fade(false);
      await say('narr_end_city', 'narr_end_nieves', 'narr_end_eyebrow', 'nieves_end_1', 'nieves_end_2');
      // Chano at dusk, and San Borondón
      await G.fade(true);
      await G.goRoom('canteras', null, { instant: true, noEnter: true, noSave: true, pos: [320, 640, 'w'] });
      await G.fade(false);
      await say('narr_end_chano', 'chano_end_1', 'alan_end_found', 'chano_end_2', 'alan_end_mountain', 'narr_end_chano_nod');
      await say('chano_end_3', 'chano_end_4', 'chano_end_5', 'alan_end_strange');
      // the fireworks from the balcony; the last night
      await S.paint('still_fireworks', async () => { await say('narr_end_fireworks', 'narr_end_fireworks_2'); }, { zoom: [1.0, 1.08] });
      if (!S.discreet()) await S.paint('still_love_2', async () => { await say(f.confession === 'excuses' ? 'narr_love_2_quiet' : 'narr_love_2_warm'); await T(1200); }, { zoom: [1.0, 1.08] });
      // the morning: the coffee by the bed
      await G.goRoom('hotel_room', null, { instant: true, noEnter: true, noSave: true, pos: [900, 640, 'w'] });
      G.player.visible = false;
      G.endStill();
      await G.fade(false);
      await say('narr_love_2_after', 'narr_end_morning', 'narr_end_lift');
      S.sfx('coffee_cups', 0.4);
      await say('narr_end_coffee', 'narr_end_drank');
      await T(1200);
      f.dawn = true; // (no more saves past the end)
      G.clearSaves();
      G.showModal('ending', true);
    });
  };
  document.getElementById('btn-again').onclick = e => { e.stopPropagation(); location.reload(); };
})();
