// The Shortest Night — Monday 24 June: San Juan, Las Palmas's 518th birthday. The finale in Cave 6 at sunrise: two
// halves, two people. Vasco knows where the light must fall and calls each disc from the floor; Alan stands in the
// Sea's water at the door and places them, in the order called (a wrong one makes the water surge; three and it takes
// him). A cloud crosses the sun: Carmen's mirror. Baute sees the stain over Las Palmas and gives up the sixth disc. The
// seventh is turned back to 23° 26′. The water drags Alan down through the door, and the chain of hands holds.
// Then the confession (the player chooses when, and how), Yeray's fuse and the Guardia, the road down, the last line.
(function () {
  const S = window.S, { G, F, say, ROOMS, T } = S;
  // the order Vasco calls the sockets in (I..VI = 0..5); the sixth disc, Baute's, goes last
  S.ORDER = [3, 0, 4, 1, 5, 2];
  const CALL = ['vasco_call_1', 'vasco_call_2', 'vasco_call_3', 'vasco_call_4', 'vasco_call_5', 'vasco_call_6'];

  S.startMon = async function () {
    await G.busy(async () => {
      await G.fade(true);
      await G.goRoom('cave6', null, { instant: true, noEnter: true, noSave: true, pos: [560, 660, 'e'] });
      G.setClock('05:52');
      await S.day(7);
      S.water.cave6 = 0.1;
      await G.fade(false);
      await say('narr_cave_mon', 'baute_m_1', 'vasco_m_1', 'baute_m_2', 'alan_m_1', 'vasco_m_halves', 'vasco_m_who');
      G.checkpoint();
    });
  };

  S.talkVascoCave = async function () {
    const f = F();
    if (f.lock_closed) return S.confessionTalk();
    if (!f.in_water) return say('vasco_m_door');
    if (f.cloud_over && !f.mirror_on) return say('vasco_m_light');
    const i = (f.placed || []).length;
    if (i >= 6) return say('vasco_m_seventh');
    if (i === 5 && !G.has('disc6')) return say('vasco_m_six');
    return say(CALL[i]); // he says it again
  };
  S.talkCarmenCave = async function () {
    const f = F();
    if (f.lock_closed) return f.fuse_in ? say('carmen_m_guardia_done') : say('carmen_m_fuse');
    if (f.cloud_over && !f.mirror_on) {
      f.mirror_on = true; S.sfx('glass_set', 0.5);
      await say('alan_m_carmen_light', 'carmen_m_mirror');
      return say(CALL[(f.placed || []).length]);
    }
    return say(f.mirror_on ? 'carmen_m_holding' : 'carmen_m_1');
  };
  S.talkYerayCave = async function () {
    const f = F();
    if (f.lock_closed && !f.fuse_given) { f.fuse_given = true; S.give('fuse'); return say('yeray_m_fuse', 'alan_m_fuse'); }
    return say(f.lock_closed ? 'yeray_m_after' : 'yeray_m_1');
  };
  S.talkBauteCave = async function () {
    const f = F();
    if (f.lock_closed) return say(f.fuse_in ? 'baute_m_turn_in' : 'baute_m_after');
    return say(f.disc6_given ? 'baute_m_given' : 'baute_m_hold');
  };

  // ---------------------------------------------------------------- into the water
  S.stepIn = async function () {
    const f = F();
    if (f.lock_closed) return say('alan_look_door');
    if (f.in_water) return say('alan_m_in_already');
    if (!G.has('discs')) return say('alan_m_no_discs');
    await G.busy(async () => {
      await say('alan_m_coming', 'vasco_m_no', 'alan_m_anyway');
      f.in_water = true;
      const p = G.player; await p.walkTo(640, 690);
      S.sfx('step_wet', 0.7);
      await S.waterTo('cave6', 0.22, 2000);
      await say('narr_m_quiet', 'vasco_m_ready');
      await say(CALL[0]);
      G.checkpoint();
    });
  };
  S.lookSocket = i => say((F().placed || []).includes(i) ? 'alan_socket_set' : 'alan_socket_empty');
  S.placeDisc = async function (i) {
    const f = F(), placed = f.placed || (f.placed = []), n = placed.length;
    if (f.cloud_over && !f.mirror_on) return say('vasco_m_light');
    if (placed.includes(i)) return say('alan_socket_set');
    if (n === 5 && !G.has('disc6')) return say('vasco_m_six');
    if (i !== S.ORDER[n]) return S.surge();
    await S.posed('climb', async () => { S.sfx('stone_notch', 0.6); await T(700); });
    placed.push(i);
    if (n < 5) { f.discs_left = 5 - placed.length; if (!f.discs_left) G.takeItem('discs'); else G.renderInv(); }
    else G.takeItem('disc6');
    await say(['vasco_m_good_1', 'vasco_m_good_2', 'vasco_m_good_3', 'vasco_m_good_4', 'vasco_m_good_5', 'vasco_m_good_6'][n]);
    if (placed.length === 2 && !f.cloud_over) { // a cloud crosses the sun
      f.cloud_over = true; S.sfx('fog_lift', 0.4);
      return say('narr_m_cloud', 'vasco_m_light');
    }
    if (placed.length === 5) return S.bauteGives();
    if (placed.length === 6) return say('vasco_m_seventh');
    return say(CALL[placed.length]);
  };
  // a wrong placement: the water surges; three and it takes him
  S.surge = async function () {
    const f = F();
    f.surges = (f.surges || 0) + 1;
    S.sfx('water_rise_2', 0.7);
    await S.waterTo('cave6', (S.water.cave6 || 0.2) + 0.1, 900);
    if (f.surges >= 3) return S.drowned();
    await say(f.surges === 1 ? 'vasco_m_wrong_1' : 'vasco_m_wrong_2');
    await say(CALL[(f.placed || []).length]);
  };
  S.drowned = async function () {
    await say('narr_m_drown');
    document.querySelector('#death .msg').textContent = window.LINES.narr_death[1];
    G.showModal('death', true);
  };
  document.getElementById('btn-retry').onclick = async e => {
    e.stopPropagation(); G.showModal('death', false);
    const cp = F()._checkpoint; S.water.cave6 = 0.22;
    if (cp) await G.loadSave(cp);
    const f = F(); f.surges = 0;
    if (f.in_water) { G.toast('Again. Listen to him.'); await say(CALL[(f.placed || []).length] || 'vasco_m_seventh'); }
  };
  S.bauteGives = async function () {
    const f = F();
    await G.busy(async () => {
      await say('vasco_m_six', 'baute_m_stain_1', 'baute_m_stain_2', 'baute_m_stain_3');
      f.disc6_given = true; S.give('disc6');
      await say('baute_m_listen', 'vasco_m_thank');
      await say(CALL[5]);
    });
  };
  // the seventh disc, turned back from Baute's reckoning to the closing angle
  S.turnSeventh = async function () {
    const f = F();
    if (f.lock_closed) return say('alan_look_seventh_set');
    if ((f.placed || []).length < 6) return say('vasco_m_seventh_wait');
    await say('vasco_m_seventh_how');
    await G.dialog([
      { label: '21° 14′ (Baute\'s mark)', run: () => S.surge(), bye: true },
      { label: '23° 26′', run: () => S.closeLock(), bye: true },
      { label: '24° 06′', run: () => S.surge(), bye: true },
    ]);
  };
  S.closeLock = async function () {
    const f = F();
    f.disc_turned = true;
    await G.busy(async () => {
      S.sfx('stone_wheel', 0.7); await T(900);
      await say('narr_m_beam', 'vasco_m_true');
      S.sfx('water_drain', 0.8);
      await S.paint('still_chain', async () => {
        await say('narr_m_drag', 'vasco_m_hold', 'narr_m_chain', 'vasco_m_twice');
      }, { zoom: [1.0, 1.1] });
      await S.paint('still_sunrise', async () => { S.sfx('dawn_birds', 0.4); await say('narr_m_breath', 'narr_m_sunrise'); }, { zoom: [1.0, 1.08], pan: [[0.5, 0.6], [0.5, 0.45]] });
      G.endStill();
      f.lock_closed = true; f.in_water = false; S.water.cave6 = 0;
      G.setClock(null);
      const p = G.player; p.x = 560; p.y = 660;
      await G.fade(false);
      await say('carmen_m_after', 'yeray_m_after_1', 'alan_m_after');
      G.checkpoint();
    });
  };

  // ---------------------------------------------------------------- the confession: when, and how
  S.confessionTalk = async function () {
    const f = F();
    if (f.confessed) return say(f.trowel_given ? 'vasco_m_after_trowel' : 'vasco_m_after');
    await G.dialog([
      { line: 'alan_m_ask_hurt', once: true, run: () => say('vasco_m_hurt') },
      { line: 'alan_m_ask_monte', once: true, run: () => say('vasco_m_monte') },
      { line: 'alan_m_confess', run: () => S.confess(), bye: true },
      { line: 'alan_m_later', bye: true, run: () => say('vasco_m_later') },
    ]);
  };
  S.confess = async function () {
    const f = F();
    await say('alan_m_confess_1');
    await G.dialog([
      { line: 'alan_m_plain', run: async () => { f.confession = 'plain'; await say('alan_m_plain_2', 'vasco_m_plain_1', 'vasco_m_first'); }, bye: true },
      { line: 'alan_m_excuses', run: async () => { f.confession = 'excuses'; await say('alan_m_excuses_2', 'narr_m_silence', 'vasco_m_excuses_1', 'vasco_m_first'); }, bye: true },
      { line: 'alan_m_blame', run: async () => { f.confession = 'blame'; await say('alan_m_blame_2', 'vasco_m_blame_1', 'vasco_m_first'); }, bye: true },
    ]);
    f.confessed = true;
    await say('vasco_m_yeray', 'alan_m_yeray');
    await say('vasco_m_trowel_1', 'vasco_m_trowel_2');
    f.trowel_given = true; S.give('trowel');
    await say('alan_m_trowel');
    await S.checkEnd();
  };
  // the radio, fuse restored: the Guardia Civil
  S.fuseIn = async function () {
    const f = F();
    if (f.ch !== 7 || !f.lock_closed) return say('alan_radio_dead');
    if (f.fuse_in) return say('alan_radio_mon');
    G.takeItem('fuse'); f.fuse_in = true;
    S.sfx('relay_click', 0.6); await T(500);
    await say('alan_m_fuse_in', 'carmen_m_radio', 'carmen_m_guardia');
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
      await say('baute_m_turn_in', 'carmen_m_ride', 'carmen_m_keys');
      await S.paint('still_road_down', async () => {
        await say('narr_end_road', 'vasco_end_hand');
        await say(f.confession === 'excuses' ? 'narr_end_excuses' : 'narr_end_plain');
        await say('vasco_end_last');
      }, { zoom: [1.0, 1.1] });
      await S.paint('still_fireworks', async () => { await say('narr_end_fireworks'); }, { zoom: [1.0, 1.08] });
      if (!S.discreet()) await S.paint('still_love_2', async () => { await say(f.confession === 'excuses' ? 'narr_love_2_quiet' : 'narr_love_2_warm'); await T(1200); }, { zoom: [1.0, 1.08] });
      G.endStill();
      f.dawn = true; // (no more saves past the end)
      G.clearSaves();
      G.showModal('ending', true);
    });
  };
  document.getElementById('btn-again').onclick = e => { e.stopPropagation(); location.reload(); };
})();
