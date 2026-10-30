// The Shortest Night — Monday 24 June: San Juan, Las Palmas's 518th birthday. Chapters Eleven and Twelve of the novel.
// The lock: Baute on his camp stool, the seventh disc at his guess; Alan's answer (Vicente Lacerda: "It's just the sea").
// Two halves, two people: Vasco calls each disc from the floor; Alan stands in the Sea's water on the ladder over the
// door and sets them, in the order called (II, IV, III, VI, V; a wrong one makes the water surge; three and it takes
// him). Ten minutes: Baute sees the stain over Las Palmas, Carmen names her street, and he gives up the sixth (socket I).
// The seventh: Vasco's instructions; a cloud crosses the sun; Carmen rips the Land Rover's wing mirror off; Alan turns
// the disc by the light as Vasco calls it (left, down, down). The water drags Alan down; the chain of hands holds.
// The confession (the player chooses when, and how), the trowel, Yeray's fuse and the Guardia, Carmen and Rayco on the
// rock, the road down, Nieves, Chano and San Borondón, the fireworks, the last night, the coffee.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  // the order Vasco calls the sockets in (I..VI = 0..5), as the novel's: II, IV, III, VI, V; the sixth disc, Baute's, goes in I
  S.ORDER = [1, 3, 2, 5, 4, 0];
  const CALL = ['vasco_call_1', 'vasco_call_2', 'vasco_call_3', 'vasco_call_4', 'vasco_call_5', 'vasco_call_6'];
  // the seventh, turned by the light: what Vasco calls, and the turn that answers it
  const TURN = [['vasco_m_left', 'left'], ['vasco_m_down', 'down'], ['vasco_m_down_2', 'down']];
  const placedN = () => (F().placed || []).length;
  // what Vasco would say now, to put Alan back on the thread (after a surge, after a retry)
  S.callNow = function () {
    const f = F(), n = placedN();
    if (n < 6) return n === 5 && !G.has('disc6') ? 'vasco_m_six' : CALL[n];
    if (f.cloud_over && !f.mirror_on) return 'vasco_m_light';
    if (f.mirror_on) return TURN[Math.min(2, f.turn || 0)][0];
    return 'vasco_m_seventh_2';
  };

  // ---------------------------------------------------------------- dawn: Baute on his stool, and Alan's answer
  S.startMon = async function () {
    await G.busy(async () => {
      await G.fade(true);
      await G.goRoom('cave6', null, { instant: true, noEnter: true, noSave: true, pos: [560, 660, 'e'] });
      G.setClock('06:52');
      await S.day(7);
      S.water.cave6 = 0.1;
      await G.fade(false);
      await say('narr_cave_mon', 'narr_mon_baute');
      await say('baute_m_1', 'baute_m_1b', 'baute_m_1c');
      await say('narr_mon_look', 'vasco_m_1', 'baute_m_close', 'vasco_m_1b', 'vasco_m_1c');
      await say('narr_mon_smile', 'baute_m_2', 'baute_m_2b');
      await say('alan_m_1', 'narr_mon_alan', 'alan_m_1b', 'alan_m_1c', 'alan_m_1d', 'alan_m_1e');
      S.sfx('water_rise_2', 0.7);
      await S.waterTo('cave6', 0.16, 1200);
      await say('narr_mon_surge', 'vasco_m_twenty');
      await say('carmen_m_five', 'narr_mon_tighter');
      await say('vasco_m_halves', 'vasco_m_who');
      G.checkpoint();
    });
  };

  S.talkVascoCave = async function () {
    const f = F();
    if (f.lock_closed) return S.confessionTalk();
    if (!f.in_water) return say('vasco_m_door');
    return say(S.callNow()); // he says it again
  };
  S.talkCarmenCave = async function () {
    const f = F();
    if (f.lock_closed) return f.fuse_in ? say('carmen_m_guardia_done') : say('carmen_m_fuse');
    if (f.cloud_over && !f.mirror_on) return S.wingMirror();
    return say(f.mirror_on ? 'carmen_m_holding' : 'carmen_m_1');
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

  // ---------------------------------------------------------------- into the water, up the ladder
  S.stepIn = async function () {
    const f = F();
    if (f.lock_closed) return say('alan_look_door');
    if (f.in_water) return say('alan_m_in_already');
    if (!G.has('discs')) return say('alan_m_no_discs');
    await G.busy(async () => {
      await say('alan_m_coming', 'vasco_m_no', 'alan_m_anyway');
      f.in_water = true;
      const p = G.player; await p.walkTo(680, 600);
      S.sfx('step_wet', 0.7);
      await S.waterTo('cave6', 0.22, 2000);
      await say('narr_m_quiet', 'narr_m_quiet_2', 'alan_m_knows');
      await say('vasco_m_ready', CALL[0]);
      G.checkpoint();
    });
  };
  S.lookSocket = i => say((F().placed || []).includes(i) ? 'alan_socket_set' : 'alan_socket_empty');
  S.placeDisc = async function (i) {
    const f = F(), placed = f.placed || (f.placed = []), n = placed.length;
    if (placed.includes(i)) return say('alan_socket_set');
    if (n === 5 && !G.has('disc6')) return say('vasco_m_six');
    if (i !== S.ORDER[n]) return S.surge();
    await S.posed('climb', async () => { S.sfx('stone_notch', 0.6); await T(700); });
    placed.push(i);
    if (n < 5) { f.discs_left = 5 - placed.length; if (!f.discs_left) G.takeItem('discs'); else G.renderInv(); }
    else G.takeItem('disc6');
    await say(['vasco_m_good_1', 'vasco_m_good_2', 'vasco_m_good_3', 'vasco_m_good_4', 'vasco_m_good_5', 'vasco_m_good_6'][n]);
    if (n === 0) await say('narr_m_smudge');
    if (placed.length === 5) return S.bauteGives();
    if (placed.length === 6) return S.sixSet();
    return say(CALL[placed.length]);
  };
  // a wrong placement (or a wrong turn of the seventh): the water surges; three and it takes him
  S.surge = async function () {
    const f = F();
    f.surges = (f.surges || 0) + 1;
    const was = S.water.cave6 || 0.22;
    S.sfx('water_rise_2', 0.7);
    await S.waterTo('cave6', was + 0.1, 900);
    if (f.surges >= 3) return S.drowned();
    if (f.surges === 1) {
      await say('narr_m_surge_1', 'vasco_m_wrong_1');
      await S.waterTo('cave6', was + 0.03, 1400);
      await say('narr_m_dog');
    } else await say('vasco_m_wrong_2');
    await say(S.callNow());
  };
  S.drowned = async function () {
    await say('narr_m_drown');
    document.querySelector('#death .msg').textContent = window.LINES.narr_death[1];
    G.showModal('death', true);
  };
  document.getElementById('btn-retry').onclick = async e => {
    e.stopPropagation(); G.showModal('death', false);
    const cp = F()._checkpoint;
    if (cp) await G.loadSave(cp);
    const f = F(); f.surges = 0;
    S.water.cave6 = f.cloud_over ? 0.5 : 0.22;
    if (f.in_water) { G.toast('Again. Listen to him.'); await say(S.callNow()); }
  };

  // ---------------------------------------------------------------- ten minutes: the stain over the city, the sixth disc
  S.bauteGives = async function () {
    const f = F();
    await G.busy(async () => {
      await say('narr_m_ten', 'narr_m_baute_up');
      S.sfx('fog_lift', 0.4);
      await say('narr_m_stain', 'narr_m_south');
      await say('narr_m_carmen_wades', 'carmen_m_street', 'carmen_m_street_2', 'carmen_m_street_3');
      await say('narr_m_baute_silent', 'carmen_m_concrete');
      await say('narr_m_goes_out', 'baute_m_stain_3');
      S.sfx('step_wet_2', 0.6);
      await say('narr_m_wades', 'baute_m_listen');
      f.disc6_given = true; S.give('disc6');
      await say(CALL[5]);
    });
  };
  // six set: two minutes, and how to turn the seventh
  S.sixSet = async function () {
    await G.busy(async () => {
      S.sfx('dawn_birds', 0.25);
      await say('narr_m_wire', 'vasco_m_seventh', 'vasco_m_seventh_2', 'vasco_m_seventh_3');
      await say('alan_m_yes', 'vasco_m_dead_centre', 'alan_m_understand');
      G.checkpoint();
    });
  };

  // ---------------------------------------------------------------- the seventh: the cloud, the mirror, the turn
  S.turnSeventh = async function () {
    const f = F();
    if (f.lock_closed) return say('alan_look_seventh_set');
    if (!f.in_water || placedN() < 6) return say('vasco_m_seventh_wait');
    if (!f.cloud_over) return S.cloudCrosses();
    if (!f.mirror_on) return say('alan_m_dark', 'vasco_m_light');
    return S.turnByLight();
  };
  S.cloudCrosses = async function () {
    const f = F();
    await G.busy(async () => {
      await S.posed('climb', async () => { await say('narr_m_seventh_hand'); });
      S.sfx('water_rise', 0.5);
      await S.waterTo('cave6', 0.4, 1600);
      await say('narr_m_chest');
      f.cloud_over = true; S.sfx('fog_lift', 0.5);
      await say('narr_m_cloud', 'vasco_m_nonono');
      S.sfx('water_rise_3', 0.8);
      await S.waterTo('cave6', 0.5, 1000);
      await say('narr_m_roar', 'vasco_m_light');
      G.checkpoint();
    });
  };
  // Alan shouts for Carmen: she's already gone, to the Land Rover, and back with its wing mirror
  S.wingMirror = async function () {
    const f = F();
    await G.busy(async () => {
      await say('alan_m_carmen_light', 'narr_m_carmen_gone');
      await T(500);
      S.sfx('tile_shatter', 0.6); S.sfx('shutter_bang', 0.4);
      await say('narr_m_glass', 'narr_m_wing', 'carmen_m_mirror');
      f.mirror_on = true; f.turn = 0; S.sfx('glass_set', 0.5);
      await say('narr_m_fuse_run', 'narr_m_too_far', TURN[0][0]);
      G.checkpoint();
    });
  };
  S.turnByLight = async function () {
    const f = F();
    while ((f.turn || 0) < TURN.length) {
      let pick = null;
      await G.dialog([
        { label: 'Turn it left', run: () => { pick = 'left'; }, bye: true },
        { label: 'Turn it right', run: () => { pick = 'right'; }, bye: true },
        { label: 'Tilt it down', run: () => { pick = 'down'; }, bye: true },
        { label: 'Tilt it up', run: () => { pick = 'up'; }, bye: true },
      ]);
      const step = f.turn || 0;
      if (pick !== TURN[step][1]) {
        await S.surge();
        if ((f.surges || 0) >= 3) return;
        continue;
      }
      S.sfx('stone_notch_2', 0.5); await T(500);
      f.turn = step + 1;
      if (step === 0) await say('narr_m_slide', TURN[1][0]);
      else if (step === 1) { await S.waterTo('cave6', 0.55, 900); await say('narr_m_mouth', TURN[2][0]); }
      else await say('narr_m_centre');
    }
    return S.closeLock();
  };
  S.closeLock = async function () {
    const f = F();
    f.disc_turned = true;
    await G.busy(async () => {
      S.sfx('stone_wheel', 0.7); await T(600);
      await say('narr_m_sun', 'narr_m_beam', 'vasco_m_true');
      await say('narr_m_dead_centre', 'narr_m_tilt', 'narr_m_lit', 'narr_m_breath');
      S.sfx('water_drain', 0.8);
      await S.paint('still_chain', async () => {
        await say('narr_m_drag', 'narr_m_drag_2', 'alan_m_so_this', 'narr_m_stops');
        await say('narr_m_hand', 'vasco_m_hold', 'narr_m_chain');
        await say('narr_m_dry', 'narr_m_chain_2', 'narr_m_nobody');
        await say('vasco_m_stopped', 'vasco_m_twice', 'vasco_m_twice_2');
      }, { zoom: [1.0, 1.1] });
      await S.paint('still_sunrise', async () => {
        S.sfx('dawn_birds', 0.4);
        await say('narr_m_torn', 'narr_m_glimpse', 'narr_m_nobody_said');
        await say('narr_m_sunrise', 'narr_m_waking', 'narr_m_reading', 'narr_m_wrist');
      }, { zoom: [1.0, 1.08], pan: [[0.5, 0.6], [0.5, 0.45]] });
      G.endStill();
      f.lock_closed = true; f.in_water = false; S.water.cave6 = 0;
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
