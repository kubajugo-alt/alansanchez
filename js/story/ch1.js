// Chapter I — The Fog: shop, street, map, police, tavern (also used later).
(function () {
  const { G, F, say, ROOMS, posed, joke, give, spendCoin, sfx } = window.S;

  // Bystanders react to what's said near them: S.REACT[line id] = [[npc id, pose], ...]. A listener
  // already holding a pose (or speaking) is left alone; the reaction ends with the line.
  window.S.REACT = window.S.REACT || {};
  window.S.listeners.push(id => {
    const list = window.S.REACT[id]; if (!list) return null;
    const done = [];
    for (const [who, pose] of list) {
      const a = G.npc(who); if (!a || !a.visible || a.pose || a.talking) continue;
      a.pose = pose; done.push([a, pose]);
    }
    return done.length ? () => done.forEach(([a, pose]) => { if (a.pose === pose) a.pose = null; }) : null;
  });

  // ================================================================ BOOKSHOP
  const PESSOA_AT = { desk: [250, 452, 'w'], radiator: [765, 362, 'w'], machine: [1015, 372, 'w'], floor: [700, 600, 'e'] };
  const MAG_RECT = [278, 414, 62, 32]; // the brass magnifying glass on the desk, right of where Pessoa sleeps
  const pessoaSpot = () => F().ch >= 5 && !F().ledger_found ? 'machine' : F().lampOff ? 'radiator' : 'desk';
  ROOMS.shop = {
    name: 'Livraria Sanchez', bg: 'shop', bgs: ['shop_night', 'shop_nomag', 'shop_drawer', 'shop_drawer_nomag'],
    // day variants: grandfather's drawer pulled open on the ledger (only while Alan takes it), and the
    // desk without the magnifying glass once he has it
    bgFn: () => F().ch >= 5 ? 'shop_night' : 'shop' + (S.shopDrawerOpen ? '_drawer' : '') + (F().magTaken ? '_nomag' : ''),
    music: () => F().ch >= 5 ? null : F().ch >= 4 ? 'tension' : 'fog',
    ambience: () => F().ch >= 5 ? 'shop_night' : 'shop', floor: 'wood',
    walk: [[345, 535], [792, 535], [1004, 716], [215, 716]],
    scale: [535, 362, 716, 482],
    light: () => F().ch >= 5 ? { ambient: 'rgb(120,140,180)', base: 0.62 } : { ambient: 'rgb(214,192,165)', base: 0.86, rim: 'rgba(210,225,240,0.22)', rimSide: -1 },
    lights: () => F().ch >= 5 ? [
      { x: 178, y: 305, rgb: '200,255,190', glow: 110, ga: 0.22, power: 0.5, reach: 700, floor: [178, 600], height: 420, when: () => !F().lampOff2 },
      { x: 1130, y: 200, rgb: '150,175,230', power: 0.3, reach: 1000, rim: 0.35, floor: [1100, 560], height: 700 }, // open door, night
    ] : [
      { x: 630, y: 170, rgb: '215,225,235', power: 0.32, reach: 1200, rim: 0.5, shadow: 0.55, floor: [630, 470], height: 900 },
      { x: 178, y: 305, rgb: '255,215,140', kind: 'gas', seed: 1, glow: 90, ga: 0.16, power: 0.3, reach: 650, floor: [178, 600], height: 420, when: () => !F().lampOff },
    ],
    entries: { default: [400, 600, 'w'], street: [880, 600, 'w'], map: [880, 600, 'w'] },
    layers: [],
    animBack(g, t) {
      if (F().ch < 5) S.windowFog(g, t, [430, 32, 410, 282], '235,238,240', 0.16);
      if (F().ch < 5) { g.save(); g.beginPath(); g.rect(430, 32, 410, 282); g.clip(); FX.birds(g, t + 4, { y0: 70, y1: 200, n: 2, period: 19, color: 'rgba(90,92,98,0.5)', size: 7, x0: 400, x1: 870 }); g.restore(); }
      // the brass weight on the press, until it's taken
      if (!F().weightTaken) S.drawWeight(g, 345, 318, 0.9);
    },
    anim(g, t) {
      if (F().ch < 5 && F().lampOff) S.lampOut(g);
      if (F().ch < 5) { FX.shaft(g, [[420, 30], [850, 30], [860, 716], [380, 716]], '210,220,230', 0.05); FX.motes(g, t, 420, 60, 430, 520, 40, '255,240,210'); }
      if (!F().heard_machine || (F().ch >= 5 && !F().heard_msg3)) if (Math.floor(t * 2) % 2 === 0) FX.glow(g, 1062, 384, 14, '255,40,20', 0.9);
      if (F().ch === 3 && F().steaming) FX.wisps(g, t, 520, 345, { n: 6, rise: 80, spread: 10, a: 0.14, size: 10 });
    },
    npcs: [
      { id: 'ines', x: 610, y: 590, dir: 'w', name: 'Inês', when: () => F().ch < 5 && !(F().ch === 4 && F().ze_saved) && !(S.inesAtSe && S.inesAtSe() && F().se_visited), look: 'narr_look_ines', talk: () => S.talkInes(),
        items: { sketch: () => S.inesSketch(), notebook: () => S.inesSketch(), ledger: () => S.inesLedger(), tongue: () => say(F().twin_swapped ? 'ines_vandal2' : 'ines_vandal'), twin: () => say('ines_hint_swap'), any: 'alan_fail_ines_item' } },
      { id: 'pessoa', h: 46, x: 0, y: 0, dir: 'w', fixedDir: true, name: 'Pessoa', when: () => !(F().ch >= 5 && F().pessoa_fed), init: a => { const p = PESSOA_AT[pessoaSpot()]; a.x = p[0]; a.y = p[1]; a.dir = p[2]; },
        look: () => say(pessoaSpot() === 'machine' ? 'alan_look_pessoa_machine' : pessoaSpot() === 'radiator' ? 'alan_look_pessoa_radiator' : 'alan_look_pessoa'),
        talk: () => (sfx('cat_purr', 0.5), say(pessoaSpot() === 'desk' ? 'alan_talk_pessoa' : pessoaSpot() === 'radiator' ? 'alan_look_pessoa_radiator' : 'alan_take_pessoa_machine')), take: () => pessoaSpot() === 'machine' ? (F().pessoa_tried ? say('alan_hint_bribe') : (F().pessoa_tried = true, say('alan_take_pessoa_machine'))) : say('alan_take_pessoa'), use: 'alan_push_pessoa',
        items: { sardine: () => S.feedPessoa(), any: 'alan_fail_09' } },
    ],
    hotspots: [
      { name: 'Bookshelves', rect: [0, 0, 290, 300], look: () => say('alan_shelf_' + ((F().shelf_n = ((F().shelf_n || 0) % 20) + 1))) },
      { name: "Grandfather's desk", rect: [40, 330, 300, 280], at: [380, 600], face: 'w', look: () => say(F().got_ledger ? 'narr_look_desk_open' : 'narr_look_desk'),
        use: () => F().got_ledger ? say('alan_drawer_empty') : pessoaSpot() === 'desk' ? say('alan_desk_cat') : G.has('key') ? say('alan_desk_usekey') : say('alan_drawer_locked'),
        items: { key: async () => {
          if (F().got_ledger) return say('alan_drawer_empty');
          if (pessoaSpot() === 'desk') return say('alan_desk_cat');
          sfx('drawer_open'); S.shopDrawerOpen = true;
          try {
            await say('alan_unlock');
            const p = G.player; p.pose = 'reach'; await G.wait(window.FAST ? 20 : 700);
            F().got_ledger = true; give('ledger'); p.pose = null;
            await G.wait(window.FAST ? 20 : 300);
          } finally { S.shopDrawerOpen = false; }
          sfx('drawer_scrape', 0.5); await joke('alan_take_ledger');
        }, any: 'alan_fail_02' } },
      { name: "Banker's lamp", rect: [118, 286, 118, 70], at: [380, 600], face: 'w', look: () => say(F().lampOff && F().ch < 5 ? 'narr_look_lamp_off' : 'narr_look_lamp_banker'),
        use: async () => {
          if (F().ch >= 5) { sfx('lamp_switch'); return say('alan_lamp_machine'); }
          if (F().lampOff) return say('alan_lamp_again');
          sfx('lamp_switch'); F().lampOff = true; S.lampOffAt = performance.now(); await S.pessoaToRadiator(); await joke('alan_lamp_off');
        } },
      { name: 'Window', rect: [412, 22, 445, 288], look: 'narr_look_window' },
      { name: 'Magnifying glass', rect: MAG_RECT, at: [380, 600], face: 'w', when: () => !F().magTaken && F().ch < 5, look: 'narr_look_magnifier_desk',
        take: async () => { const p = G.player; p.pose = 'reach'; await G.wait(window.FAST ? 20 : 500); F().magTaken = true; give('magnifier'); p.pose = null; await say('alan_take_magnifier'); } },
      { name: 'Brass weight', rect: [326, 290, 40, 34], at: [395, 565], face: 'w', when: () => !F().weightTaken, look: 'narr_look_press',
        take: async () => { F().weightTaken = true; give('weight'); await joke('alan_take_weight'); } },
      { name: 'Kettle', rect: [470, 330, 95, 85], look: () => say(F().ch >= 5 ? 'narr_look_kettle_dry' : 'narr_look_kettle') },
      { name: 'Sugar tin', rect: [672, 355, 54, 60], at: [690, 562], face: 'n', look: 'narr_look_tin',
        take: async () => { if (F().tinTaken) return say('alan_fail_take'); F().tinTaken = true; give('key'); await say('alan_sugar_tin'); } },
      { name: 'Radiator', rect: [736, 352, 58, 150], at: [760, 560], face: 'n', look: 'narr_look_radiator' },
      { name: 'Cash register', rect: [850, 212, 180, 170], at: [820, 566], face: 'e', look: () => say(F().coinsTaken ? 'alan_register_empty' : 'alan_look_register'),
        take: async () => { if (F().coinsTaken) return say('alan_register_empty'); F().coinsTaken = true; give('coins', 3); sfx('coin'); await say('alan_take_coins'); } },
      { name: 'Answering machine', rect: [955, 366, 120, 40], at: [830, 570], face: 'e', look: () => say(F().heard_machine ? 'narr_look_machine_heard' : 'narr_look_machine'), use: () => S.playMachine() },
      { name: 'Telephone', rect: [1062, 340, 66, 58], at: [830, 570], face: 'e', look: 'narr_look_phone', use: () => S.usePhone(), items: { vasco_card: () => S.callVasco() } },
      { name: 'Newspaper', rect: [1035, 400, 222, 62], at: [880, 610], face: 'e', look: () => say('narr_look_news', 'alan_news') },
      { name: 'Salt on the floor', rect: [500, 578, 520, 18], when: () => F().ch >= 5, look: 'narr_look_salt_line' },
      { name: 'Door to the street', rect: [1025, 10, 205, 390], at: [900, 590], exit: 'street', entry: 'shop', locked: () => !F().heard_machine || (F().ch >= 5 && !F().ledger_found) || (F().ch >= 5 && F().ines_plan && !F().rui_called) || S.vascoCallDue(), lockedLine: () => F().ch >= 5 ? (!F().ledger_found ? 'alan_door_ledger' : F().rui_called ? 'alan_call_vasco_first' : 'alan_call_rui_first') : 'alan_door_first' },
    ],
    async enter() { if (F().ch >= 5 && !F().ines_gone_seen) { F().ines_gone_seen = true; await say('alan_ines_gone'); } },
  };

  // Senhor Armando means well: the kind of advice that tells Alan what the street says behind his back
  // he sits up for the conversation (the 'awake' set) and dozes off again afterwards
  S.LINE_POSE.bench_wake = ['npc_bench', 'wake']; S.LINE_POSE.bench_advice_1 = ['npc_bench', 'confide'];
  S.LINE_POSE.bench_advice_2 = ['npc_bench', 'wistful']; S.LINE_POSE.bench_again = ['npc_bench', 'drowsy'];
  S.benchTalk = async function () {
    const b = G.npc('npc_bench');
    if (b) b.set = 'awake';
    try { await benchTalk(b); } finally { if (b) b.set = null; }
  };
  async function benchTalk(b) {
    if (F().bench_advice) return say('bench_again');
    F().bench_advice = true;
    const p = G.player;
    await say('bench_wake', 'bench_advice_1');
    await G.wait(window.FAST ? 20 : 900);
    await say('alan_bench_1');
    await say('bench_advice_2');
    await G.wait(window.FAST ? 20 : 700);
    if (b) p.dir = b.x < p.x ? 'e' : 'w';    // he turns away before he says it
    await G.wait(window.FAST ? 20 : 600);
    await say('alan_bench_2');
  }
  S.pessoaToRadiator = async function () {
    const p = G.npc('pessoa'); if (!p) return;
    p.pose = 'jump'; sfx('cat_land'); await G.wait(window.FAST ? 20 : 350); p.pose = null;
    p.h = 40; p.x = 350; p.y = 560; // down beside the desk, not inside it
    await p.walkTo(735, 545);
    p.pose = 'jump'; await G.wait(window.FAST ? 20 : 300); p.pose = null;
    const r = PESSOA_AT.radiator; p.x = r[0]; p.y = r[1]; p.h = 46; p.dir = 'w';
  };
  S.feedPessoa = async function () {
    if (F().ch < 5) return say('alan_fail_09');
    const p = G.npc('pessoa'); G.takeItem('sardine');
    p.pose = 'jump'; sfx('cat_chirp'); await G.wait(window.FAST ? 20 : 400);
    p.x = 900; p.y = 640; p.h = 58; p.pose = 'eat'; sfx('cat_eat'); // on the floor in front of the counter
    F().ledger_found = true; give('ledger');
    await say('alan_pessoa');
    F().pessoa_fed = true;
  };
  S.playMachine = async function () {
    if (F().ch >= 5) {
      if (!F().ledger_found) return say('alan_lamp_machine');
      if (F().heard_msg3) return say('alan_machine_again');
      sfx('beep');
      await G.say('lacerda_msg3', { offscreen: true, label: 'Answering machine' });
      await G.say('lacerda_msg3_ledger', { offscreen: true, label: 'Answering machine' }); // appended: the young lady insists
      F().heard_msg3 = true;
      await say('alan_insists'); // Inês, still fighting
      await joke('alan_queue'); await say('alan_alone');
      await say('narr_msg2_again'); sfx('drip_hangup'); await G.wait(window.FAST ? 20 : 1500);
      await say('alan_hangup_reveal');
      return;
    }
    if (F().heard_machine) return say('alan_machine_again');
    sfx('beep');
    await G.say('rui_msg_1', { offscreen: true, label: 'Answering machine' });
    sfx('beep');
    await say('narr_msg_2'); sfx('drip_hangup'); await G.wait(window.FAST ? 20 : 2500);
    await say('alan_hangup');
    F().heard_machine = true;
    await say('alan_after_msg');
  };
  S.usePhone = async function () {
    if (F().ch >= 5) {
      if (F().rui_called) return say('alan_fail_04');
      if (!F().heard_msg3) return say('alan_phone_ch5_early');
      await posed('phone', async () => {
        sfx('phone_pickup'); sfx('phone_dial_long'); await G.wait(window.FAST ? 20 : 2600);
        await say('alan_call_rui', 'rui_gate');
        if (F().amalia_box) await say('alan_box_tell', 'rui_murder');
        await say('alan_obituary');
        if (F().vasco_thursday && !F().knows_withdrawn) { F().knows_withdrawn = true; await say('rui_withdrawn', 'alan_knew'); } // (saves that never heard it in Chapter II)
      });
      F().rui_called = true; return;
    }
    return say(F().ch >= 2 ? 'alan_phone_later' : 'alan_phone_ch1');
  };

  // Chapter V, after the call to Rui: Dr. Teles's card on the shop phone. Alan may not come back
  // from the cistern, and he wants to hear Vasco's voice; he doesn't say so. Vasco hangs up first.
  // ([pause] in the script is a held silent beat: a wait, not a line.)
  S.vascoCallDue = () => F().ch >= 5 && !!F().rui_called && !!F().vasco_thursday && G.has('vasco_card') && !F().vasco_called;
  S.callVasco = async function () {
    if (F().ch < 5) return say('alan_two_numbers');
    if (F().vasco_called) return say('alan_fail_04');
    if (!F().rui_called) return say('alan_call_rui_first');
    F().vasco_called = true;
    const hold = ms => G.wait(window.FAST ? 20 : ms);
    await posed('phone', async () => {
      sfx('phone_pickup'); sfx('phone_dial_long'); await hold(2600);
      await say('alan_fcall_1');
      await hold(1100);
      await say('vasco_fcall_1', 'alan_fcall_2');
      await hold(900);
      await say('vasco_fcall_2', 'alan_fcall_3', 'vasco_fcall_3');
      await hold(1100);
      await say('alan_fcall_4');
      await hold(1200);
      await say('vasco_fcall_4', 'alan_fcall_5', 'vasco_fcall_5', 'alan_vcall_5');
      await hold(1300);
      await say('vasco_vcall_5');
      // he hangs up first; Alan stays on the line a moment
      const tone = sfx('dial_tone', 0.5);
      await hold(2600);
      if (tone && tone.stop) try { tone.stop(0.15); } catch (e) { /* ignore */ }
      sfx('phone_hangup', 0.6); await hold(500);
    });
  };
  // Chapter II, the first time Alan is back at the station after the heist: Rui tells him the curator
  // withdrew the complaint. (Face to face, Alan brings it up with Vasco in the museum store room.)
  S.ruiReveal = async function () {
    if (F().knows_withdrawn || F().ch < 2 || F().ch >= 5 || !(F().vasco_thursday || F().heist_done)) return;
    const rui = G.npc('rui'); if (!rui || !rui.visible) return;
    F().knows_withdrawn = true;
    G.player.dir = rui.x < G.player.x ? 'w' : 'e';
    await say('rui_withdrawn', 'alan_knew');
  };

  // ---------- Inês
  const INES_HI = ['ines_hello_2', 'ines_hello_3', 'ines_hello_4'];
  S.talkInes = async function () {
    await say(F().ines_greeted ? INES_HI[(F().ines_greeted++) % INES_HI.length] : (F().ines_greeted = 1, 'ines_hello'));
    await S.gossip('ines');
    await G.dialog([
      { line: 'alan_ask_ines_now', run: () => say(S.hint()) },
      { line: 'alan_ask_ines_drowned', once: true, run: () => say('ines_drowned') },
      { line: 'alan_ask_ines_fog', once: true, run: () => say('ines_fog') },
      { line: 'alan_ask_ines_shop', once: true, run: () => say('ines_shop') },
      { line: 'alan_ask_ines_work', once: true, run: () => say('ines_work') },
      // bells only once the sketch has put them on the table
      { line: 'alan_ask_ines_grandpa', once: true, when: () => F().knows_brotherhood, run: () => say('ines_grandpa') },
      { line: 'alan_ask_ines_fate', once: true, when: () => F().deaths_known && F().ines_plan, run: () => say('ines_fate') },
      { label: 'Goodbye.', bye: true, run: () => say(S.inesAtSe && S.inesAtSe() ? 'ines_bye_se' : 'ines_bye') },
    ]);
  };
  S.LINE_POSE.alan_show_sketch = ['ines', 'think'];
  S.LINE_POSE.ines_sketch_founders = ['ines', 'teasing']; // finger raised: the lesson, not a gasp
  S.LINE_POSE.ines_bye_se = ['ines', 'point'];
  S.inesSketch = async function () {
    if (!F().sketched_tile) return say('alan_fail_ines_item');
    if (F().knows_brotherhood) return say(S.hint());
    await say('alan_show_sketch', 'ines_sketch_1', 'ines_sketch_2');
    if (F().saw_list) { await say('ines_sketch_founders'); await joke('alan_founders'); }
    if (F().mag_monster) await say('ines_monster');
    await say('ines_reserve', 'ines_plan', 'alan_why', 'ines_why_2');
    await S.posed('fluster', () => say('alan_deny_why_2'));
    await say('ines_coward', 'alan_coward');
    F().knows_brotherhood = true; F().ines_plan = true; // ines_sketch_3 (the fado lead) now plays when she reads the register
    G.refreshNpcs();
  };
  S.inesLedger = async function () {
    if (F().ch === 3 && F().has_tongue && F().founder_order) return S.ch3End();
    return say(F().decoded ? 'alan_look_ledger_decoded' : 'alan_fail_ines_item');
  };

  // ================================================================ STREET
  // once Alan is back from the docks (the quay, Zé's boat) it is night in the Alfama
  S.streetNight = () => !!(F().ch4_done || F().ch >= 5);
  ROOMS.street = {
    name: 'Alfama', bg: 'street', bgs: ['street_night'],
    bgFn: () => S.streetNight() ? 'street_night' : 'street',
    music: () => F().ch >= 5 ? null : F().ch >= 4 ? 'tension' : 'fog', ambience: () => S.streetNight() ? 'street_night' : 'street', floor: 'cobble',
    fog: () => S.streetNight() ? 0.22 : 0.32, get fogRGB() { return S.streetNight() ? '70,80,105' : '214,218,216'; },
    walk: [[0, 578], [870, 593], [880, 612], [1010, 612], [1020, 595], [1280, 600], [1280, 716], [0, 716]], // in front of the bench, not among its legs
    scale: [578, 196, 716, 250],
    light: () => S.streetNight() ? { ambient: 'rgb(105,115,150)', base: 0.55 } : { ambient: 'rgb(214,214,214)', base: 0.9 },
    lights: () => S.streetNight() ? [
      { x: 522, y: 190, rgb: '255,200,130', kind: 'gas', seed: 2, glow: 90, ga: 0.45, power: 0.75, reach: 700, rim: 0.6, floor: [500, 560], height: 380 },
      { x: 1136, y: 318, rgb: '255,190,110', kind: 'flame', seed: 5, glow: 75, ga: 0.45, power: 0.75, reach: 620, rim: 0.6, floor: [1136, 590], height: 300 },
      { x: 130, y: 430, rgb: '255,200,130', glow: 60, ga: 0.15, power: 0.3, reach: 420, shadow: false },
      { x: 720, y: 60, rgb: '140,160,210', power: 0.15, reach: 1400, rim: 0.25, shadow: 0.2, floor: [720, 420], height: 1200 },
    ] : [
      { x: 522, y: 190, rgb: '255,220,150', kind: 'gas', seed: 2, glow: 70, ga: 0.35, power: 0.45, reach: 650, floor: [500, 560], height: 380 },
      { x: 1136, y: 318, rgb: '255,200,120', kind: 'flame', seed: 5, glow: 60, ga: 0.35, power: 0.5, reach: 600, floor: [1136, 590], height: 300 },
      { x: 240, y: 430, rgb: '255,210,140', glow: 70, ga: 0.12, power: 0.15, reach: 400, shadow: false },
      { x: 720, y: 60, rgb: '225,228,232', power: 0.2, reach: 1400, rim: 0.3, shadow: 0.3, floor: [720, 420], height: 1200 },
    ],
    entries: { default: [545, 640, 's'], shop: [370, 600, 's'], tavern: [1075, 628, 's'], map: [545, 640, 's'] },
    animBack(g, t) {
      const im = G.bgImage();
      [[598, 188, 34, 62, 0], [632, 192, 38, 82, 1.3], [672, 195, 52, 70, 2.1], [726, 190, 72, 66, 0.7], [806, 168, 54, 76, 2.8], [866, 152, 54, 74, 1.9], [926, 120, 46, 86, 3.4]]
        .forEach(([x, y, w, h, ph]) => FX.sway(g, im, [x, y, w, h], t, 0.9, ph)); // laundry, barely stirring
      g.save(); g.beginPath(); g.rect(470, 0, 470, 150); g.clip();
      FX.birds(g, t, { y0: 30, y1: 120, n: 2, period: 21, color: 'rgba(70,72,78,0.55)', size: 9, x0: 440, x1: 980 });
      g.restore();
      FX.leaves(g, t, 600, 700, 17);
    },
    animFg(g, t) { S.drawTram(g, t); },
    ambient: [
      { id: 'npc_bench', name: 'Old man on the bench', frames: ['npc_bench', 'npc_bench_doze2', 'npc_bench_doze2', 'npc_bench_b'], idleHold: [9, 18], variantHold: [2.2, 4], x: 940, y: 592, h: 150, look: 'alan_npc_bench', talkFrames: ['npc_bench_talk1', 'npc_bench_talk2', 'npc_bench_talk3'], talk: () => S.benchTalk(), when: () => F().ch <= 4, // dozes (head lolling one way, then the other), now and then wakes with a start
        sets: { awake: { idle: ['npc_bench_awake', 'npc_bench_greet'], talk: ['npc_bench_talk1', 'npc_bench_talk2', 'npc_bench_talk3'], poses: { wake: 'npc_bench_b', confide: 'npc_bench_confide', wistful: 'npc_bench_wistful', drowsy: 'npc_bench_drowsy' } } } },
    ],
    occluders: [{ y: 206, poly: [[60, 150], [215, 150], [215, 215], [60, 215]] }], // balcony railing in front of the laundry woman
    hotspots: [
      { name: 'Old azulejos', rect: [0, 0, 440, 140], look: 'narr_look_azulejo' },
      { name: 'Sea-monster tile', rect: [300, 230, 120, 90], at: [360, 600], face: 'n', look: () => say('narr_look_azulejo', 'alan_look_monster'),
        items: { magnifier: async () => { F().mag_monster = true; await joke('alan_mag_monster'); } } },
      { name: 'Bookshop window', rect: [30, 320, 250, 230], look: 'narr_look_shelves' },
      { name: 'Street lamp', rect: [455, 140, 95, 410], look: 'narr_look_lamp' },
      { name: 'The Alfama', rect: [600, 90, 300, 440], look: 'narr_look_street' },
      { name: 'Tram', rect: [0, 560, 1280, 160], when: () => S.tramVisible(), look: 'alan_npc_tram' },
      { name: 'Livraria Sanchez', rect: [322, 335, 95, 205], at: [368, 595], exit: 'shop', entry: 'street' },
      { name: 'Taberna da Saudade', rect: [1035, 280, 90, 270], at: [1078, 612], exit: 'tavern', entry: 'street', look: 'narr_look_tavern_door', locked: () => !F().heard_song && !(F().reserve_raided || (F().knows_brotherhood && !F().ines_plan)), lockedLine: 'alan_tavern_shut' },
      { name: 'Tram 28 stop', rect: [515, 255, 55, 280], at: [548, 612], exit: 'map', entry: 'street', look: 'narr_look_tram' },
    ],
  };
  // the tram passes along the foreground rails now and then, bell ringing
  let tramNext = 20, tramX = null;
  S.tramVisible = () => tramX != null;
  S.tramNow = () => { tramNext = 0; }; // test hook: the next car comes now
  // the overhead contact wire over the front rails: hung from span wires every few metres, sagging a
  // little between them; the passing car's trolley pole presses it up where its wheel runs
  const WIRE_Y = 47, WIRE_SAG = 6, WIRE_SPAN = 520, WIRE_X0 = -120;
  const POLE_TIP = [1315, 10]; // the trolley wheel's top, in prop_tram sprite px
  S.drawWire = function (g, tip) {
    const base = x => { const u = ((x - WIRE_X0) % WIRE_SPAN + WIRE_SPAN) % WIRE_SPAN / WIRE_SPAN; return WIRE_Y + WIRE_SAG * 4 * u * (1 - u); };
    const lift = tip ? tip[1] - base(tip[0]) : 0;
    const y = x => { let v = base(x); if (tip) { const d = (x - tip[0]) / 260; v += lift * Math.exp(-d * d * 3); } return v; };
    const night = S.streetNight && S.streetNight();
    g.save(); g.lineCap = 'round';
    // span wires: from the hanger up and out of frame, toward the façades on either side
    g.strokeStyle = night ? 'rgba(12,14,20,0.75)' : 'rgba(42,44,48,0.6)'; g.lineWidth = 1.2;
    for (let hx = WIRE_X0; hx < 1400; hx += WIRE_SPAN) { g.beginPath(); g.moveTo(hx - 70, -2); g.lineTo(hx, WIRE_Y); g.lineTo(hx + 70, -2); g.stroke(); }
    g.strokeStyle = night ? 'rgba(8,9,14,0.9)' : 'rgba(30,31,35,0.85)'; g.lineWidth = 2.2;
    g.beginPath(); for (let x = -10; x <= 1290; x += 10) { if (x === -10) g.moveTo(x, y(x)); else g.lineTo(x, y(x)); } g.stroke();
    // a faint highlight along the top of the copper
    g.strokeStyle = night ? 'rgba(120,130,150,0.18)' : 'rgba(210,205,190,0.25)'; g.lineWidth = 0.8;
    g.beginPath(); for (let x = -10; x <= 1290; x += 10) { if (x === -10) g.moveTo(x, y(x) - 1); else g.lineTo(x, y(x) - 1); } g.stroke();
    g.restore();
  };
  S.drawTram = function (g, t) {
    const im = G.image('spr:prop_tram') || G.image('lay:prop_tram');
    // full size: a Remodelado car is about 1.8 people tall at the body, and runs on the front rails
    const h = 670, w = im ? im.width * h / im.height : 0, gy = 714, k = im ? h / im.height : 1;
    if (!window.FAST && tramX == null && t > tramNext && !G.isBusy) { tramX = 1500; Sound.sfx('tram', 0.85, 0.95 + Math.random() * 0.1); }
    if (window.FAST || tramX == null || !im) { S.drawWire(g, null); return; }
    tramX -= 520 / 60;
    g.save(); g.fillStyle = 'rgba(0,0,0,0.4)'; g.beginPath(); g.ellipse(tramX + w / 2, gy - 4, w * 0.48, 16, 0, 0, 7); g.fill(); g.restore();
    g.drawImage(im, tramX, gy - h, w, h);
    // the wire goes over the pole's wheel, which runs pressed up against it
    S.drawWire(g, [tramX + POLE_TIP[0] * k, gy - h + POLE_TIP[1] * k]);
    if (tramX < -w) { tramX = null; tramNext = t + 45 + Math.random() * 25; }
  };

  // ================================================================ MAP
  ROOMS.map = {
    name: 'Lisbon', bg: 'map', player: false, vignette: 0.3, noSave: true,
    music: () => F().ch >= 5 ? null : F().ch >= 4 ? 'tension' : 'fog',
    anim(g, t) {
      for (const m of S.PINS) {
        const open = m.open(), seen = F()['seen_' + m.id] || (m.waiting && m.waiting());
        if (!open && !seen) continue;
        const p = 0.5 + 0.5 * Math.sin(t * 3 + m.x);
        if (open) FX.glow(g, m.x, m.y, 40 + p * 14, '255,120,60', 0.45);
        g.fillStyle = open ? '#7a1408' : '#4a4038'; g.strokeStyle = '#2a0a04'; g.lineWidth = 3;
        g.beginPath(); g.arc(m.x, m.y, 11, 0, 7); g.fill(); g.stroke();
        g.fillStyle = open ? '#ffd27a' : '#8a8070'; g.beginPath(); g.arc(m.x, m.y, 4.5, 0, 7); g.fill();
      }
      if (F().clock) { g.font = "700 26px 'Cinzel', serif"; g.fillStyle = 'rgba(40,24,10,0.85)'; g.textAlign = 'right'; g.fillText(F().clock, 1240, 690); g.textAlign = 'left'; }
    },
    hotspots: S.PINS.filter(m => m.waiting).map(m => ({ name: m.text + ' (' + m.waitText + ')', rect: [m.x - 30, m.y - 60, 60, 80], when: m.waiting,
      look: () => G.toast(m.waitText), use: () => G.toast(m.waitText) })).concat(S.PINS.map(m => ({ name: m.text, rect: [m.x - 30, m.y - 60, 60, 80], when: m.open,
      exit: m.go || (m.id === 'convent' ? (() => F().ch >= 5 ? 'convent_night' : 'convent') : m.id), entry: 'map', look: () => G.goRoom(m.go ? m.go() : m.id === 'convent' && F().ch >= 5 ? 'convent_night' : m.id, 'map') }))),
    labels: S.PINS.map(m => ({ x: m.x, y: m.y - 14, text: m.text, when: m.open })).concat(S.PINS.filter(m => m.waiting).map(m => ({ x: m.x, y: m.y - 14, text: m.text + ' · ' + m.waitText, when: m.waiting }))),
    enter() { for (const m of S.PINS) if (m.open()) F()['seen_' + m.id] = true; },
  };

  // ================================================================ POLICE
  // Rui behind the desk by his chair; his way out runs behind the desk to its left end, then
  // round that end to the door (the last step is taken in front of the desk, clear of it).
  // Teixeira stands at the other end, in front, on the desk phone.
  S.RUI_DESK = [540, 562];
  S.RUI_EXIT = [[285, 562], [228, 604], [150, 650]]; // (he crosses the desk's front line already clear of its end)
  S.COP_AT = [950, 672];
  ROOMS.police = {
    name: 'Polícia Judiciária', bg: 'police', music: 'office', ambience: 'office', floor: 'tile',
    walk: [[60, 620], [1220, 620], [1280, 716], [0, 716]],
    scale: [606, 440, 716, 490],
    light: { ambient: 'rgb(206,220,196)', base: 0.8, flickerShade: 0.22 },
    lights: [
      { x: 720, y: 18, rgb: '235,248,225', kind: 'tube', seed: 3, glow: 260, ga: 0.09, power: 0.45, reach: 1100, rim: 0.45, floor: [720, 470], height: 900 },
      { x: 915, y: 265, rgb: '205,220,238', power: 0.28, reach: 800, rim: 0.6, shadow: 0.45, floor: [915, 500], height: 600 },
    ],
    entries: { default: [160, 655, 'e'], map: [160, 655, 'e'] },
    async enter() { S.copFace(); await S.ruiReveal(); },
    layers: [{ img: 'police_drawer', x: 0, y: 0, when: () => F().drawer_open, full: true }, { img: 'police_cradle', x: 0, y: 0, full: true, when: () => S.copOnDuty() }], // the desk phone with its receiver lifted: Teixeira has it
    // Rui and the officer stand behind the desk: the desk and what's on it are traced
    occluders: [{ y: 600, polys: [
      [[320, 397], [945, 397], [945, 426], [930, 428], [930, 606], [336, 606], [336, 428], [320, 426]],
      [[362, 338], [487, 338], [492, 406], [360, 406]], [[370, 318], [448, 318], [448, 340], [370, 340]],
      [[491, 365], [580, 365], [582, 403], [489, 403]], [[610, 343], [684, 343], [686, 403], [608, 403]],
      [[724, 356], [780, 356], [780, 406], [724, 406]], [[806, 372], [811, 357], [834, 350], [871, 350], [890, 357], [894, 371], [886, 381], [891, 408], [776, 408], [776, 391], [812, 386], [818, 381]], // the desk phone, traced
    ], draw: g => S.copCordDesk(g) }], // the receiver's cord, where it lies across the desk
    animBack(g, t) { S.windowFog(g, t, [780, 202, 276, 126], '230,232,236', 0.22); if (S.copOnDuty()) { S.copFace(); S.copCordDesk(g); } },
    // the cord to the receiver when Alan has Teixeira in a pair frame (Teixeira himself draws it otherwise)
    animFg(g) { const cop = G.npc('npc_phone'), p = G.player; if (S.copOnDuty() && cop && !cop.visible && p.visible && S.CORD_AT[p.pose]) S.copCord(g, p); },
    anim(g, t) {
      FX.wisps(g, t, 751, 362, { n: 5, rise: 55, spread: 9, a: 0.12, size: 7, speed: 0.3 });
      FX.shaft(g, [[790, 205], [1050, 205], [1000, 716], [640, 716]], '225,232,236', 0.035);
      FX.motes(g, t, 700, 220, 340, 420, 22, '235,238,240');
    },
    npcs: [
      { id: 'rui', x: S.RUI_DESK[0], y: S.RUI_DESK[1], h: 365, dir: 'e', at: [500, 645], name: 'Inspector Mendonça', look: 'narr_look_rui', talk: () => S.talkRui(), when: () => !F().rui_out,
        items: { coffee: () => say('rui_coffee'), file55: () => say('rui_times'), any: 'alan_fail_rui_item' } },
    ],
    ambient: [
      { id: 'npc_phone', name: 'Officer Teixeira', frames: ['npc_phone', 'npc_phone_b'], x: S.COP_AT[0], y: S.COP_AT[1], dir: 'w', at: [S.COP_AT[0] + 105, S.COP_AT[1]], face: 'w', look: 'alan_npc_phone', talk: () => S.flirtCop(), when: () => S.copOnDuty(), variantHold: [3, 6], overlay: (g, a) => S.copCord(g, a), items: { any: 'alan_fail_rui_item' } }, // front right, at the end of the desk, on the desk phone (the Inspector keeps to the other end)
    ],
    hotspots: [
      { name: 'Corkboard', rect: [275, 95, 355, 230], look: 'narr_look_board' },
      { name: 'Filing cabinet', rect: [1105, 180, 95, 285], look: 'narr_look_cabinet' },
      { name: () => F().drawer_open ? 'Open drawer' : 'Bottom drawer', rect: [1108, 465, 90, 115], at: [1150, 650], face: 'n',
        look: () => F().ch >= 2 ? joke('alan_look_drawer') : say('narr_look_cabinet'),
        use: () => F().drawer_open ? S.takeFile() : say(F().ch < 2 ? 'alan_drawer_ch1' : F().salt_seen ? 'alan_drawer_pull' : 'alan_drawer_stuck'),
        items: {
          magnifier: async () => { if (F().ch < 2) return say('alan_drawer_ch1'); F().salt_seen = true; await say('alan_salted'); },
          coffee: async () => {
            if (!F().salt_seen) return say('alan_drawer_stuck');
            G.takeItem('coffee'); sfx('salt_fizz'); await G.wait(window.FAST ? 20 : 900);
            await say('rui_coffee', 'alan_coffee');
            sfx('drawer_scrape'); F().drawer_open = true; await say('narr_drawer_open');
            await S.takeFile();
          },
          any: 'alan_fail_05',
        } },
      { name: 'Coffee machine', rect: [1032, 245, 80, 300], at: [1080, 642], face: 'n', look: 'narr_look_machine_coffee',
        use: () => say(F().ch >= 2 ? 'alan_machine_coin' : 'alan_coffee_ch1'),
        items: { coins: async () => {
          if (F().ch < 2 || !(F().askedDrawer || F().salt_seen)) return say('alan_coffee_ch1');
          if (G.has('coffee') || F().drawer_open) return say('alan_fail_04');
          spendCoin(1); sfx('coffee_machine'); await G.wait(window.FAST ? 20 : 1800); give('coffee'); await say('alan_coin_machine');
        }, any: 'alan_fail_02' } },
      { name: 'Evidence bag', rect: [610, 340, 76, 64], at: [650, 640], face: 'n', look: 'narr_look_evidence',
        take: () => say(!F().ruiMurders ? 'rui_hands_off' : F().sketched_tile ? 'alan_have_sketch' : 'alan_bag_draw'),
        items: { notebook: async () => {
          if (!F().ruiMurders) return say('rui_hands_off');
          if (F().sketched_tile) return say('alan_have_sketch');
          // Teixeira guards the bag while the Inspector is out, until he's looking at the wall
          if (F().ch === 1 && !F().teixeira_flirt) {
            if (!F().rui_out) return say('rui_hands_off');
            if (!F().teixeira_wall) return say((F().teixeira_step || 0) >= 1 ? 'teixeira_nodraw_2' : 'teixeira_nodraw'); // polite, firm: not even a picture
          }
          await posed('write', async () => { await G.wait(window.FAST ? 20 : 900); await joke('alan_sketch'); });
          F().sketched_tile = true; give('sketch');
          if (F().rui_out) await S.ruiReturns();
        }, any: 'alan_fail_rui_item' } },
      { name: "Rui's coffee", rect: [724, 356, 56, 50], look: 'narr_look_coffee' },
      // today's Diário de Notícias on the front desk: weather, football, and the tides
      { name: 'Newspaper', rect: [491, 365, 90, 38], at: [540, 645], face: 'n', when: () => !F().paper_taken, look: 'alan_paper',
        take: async () => { F().paper_taken = true; give('newspaper'); sfx('page'); await say('alan_paper'); } },
      { name: 'Door', rect: [70, 40, 120, 510], at: [150, 645], exit: 'map', entry: 'police' },
    ],
  };
  S.takeFile = async function () {
    if (G.has('file55')) return say('alan_look_file');
    give('file55'); sfx('page');
    await S.readFile55();
    await posed('read', () => say('alan_read_file'));
    await say('alan_lacerda_name');
    // the key to Ferreira's comes round later with Teixeira (rui_key no longer plays);
    // saves from before the flirt became a puzzle get it straight away, as before
    if (F().flirted_cop) await say('rui_times', 'rui_avo', 'rui_key_2'); // he'll find a way (it turns out to be Teixeira, unannounced)
    else { await say('rui_times', 'rui_avo', 'rui_key'); give('fkey'); await say('alan_accident'); }
    F().deaths_known = true; S.lore && S.lore('file1955');
  };
  S.talkRui = async function () {
    if (!F().metRui) { F().metRui = true; await say('rui_hello'); await joke('alan_rui_hello'); }
    await S.ruiReveal();
    await S.gossip('rui');
    await G.dialog([
      { line: 'alan_ask_murders', run: async () => { await say('rui_murders_1', 'rui_murders_2'); if (!F().ruiMurders) await joke('alan_rui_locked'); F().ruiMurders = true; } },
      { line: 'alan_ask_victims', when: () => F().ruiMurders, once: true, run: () => say('rui_victims_1', 'rui_victims_2') },
      { line: 'alan_ask_list', when: () => F().ruiMurders && !F().saw_list, run: async () => {
        await say('rui_list_1'); await S.readList(); await say('alan_list_hand', 'rui_water'); await joke('alan_water'); F().saw_list = true;
        if (F().ch === 1 && !F().teixeira_flirt) await S.ruiLeaves();
      }, get bye() { return !!F().rui_out; } },
      { line: 'alan_ask_strange', when: () => F().ch === 1, once: true, run: () => say('rui_drawer_1', 'rui_drawer_2') },
      { line: 'alan_ask_1955', when: () => F().ch >= 2 && !F().askedDrawer, run: async () => { await say('rui_1955', 'rui_drawer_crowbars'); F().askedDrawer = true; } },
      { line: 'alan_ask_fog', once: true, run: () => say('rui_fog') },
      { label: 'Goodbye.', bye: true, run: () => say('rui_bye') },
    ]);
  };

  // ================================================================ TAVERN
  ROOMS.tavern = {
    name: 'Taberna da Saudade', bg: 'tavern', bgs: ['tavern_night'],
    bgFn: () => F().ch >= 5 ? 'tavern_night' : 'tavern',
    music: () => F().ch >= 5 ? null : 'fado', ambience: () => F().ch >= 5 ? null : 'tavern', floor: 'wood',
    walk: [[0, 614], [1280, 614], [1280, 716], [0, 716]],
    scale: [568, 385, 716, 450],
    light: () => F().ch >= 5 ? { ambient: 'rgb(110,105,140)', base: 0.5, flickerShade: 0.25 } : { ambient: 'rgb(200,142,98)', base: 0.72, flickerShade: 0.3 },
    lights: () => F().ch >= 5 ? [
      { x: 922, y: 140, rgb: '255,180,90', kind: 'flame', seed: 3, glow: 120, ga: 0.3, power: 0.65, reach: 800, floor: [922, 590], height: 460 },
    ] : [
      { x: 453, y: 180, rgb: '255,180,90', kind: 'flame', seed: 1, glow: 120, ga: 0.28, power: 0.6, reach: 800, floor: [453, 560], height: 420 },
      { x: 985, y: 152, rgb: '255,180,90', kind: 'flame', seed: 3, glow: 120, ga: 0.28, power: 0.6, reach: 800, floor: [985, 590], height: 460 },
      { x: 770, y: 448, rgb: '255,190,100', kind: 'candle', seed: 7, glow: 50, ga: 0.3, power: 0.16, rim: 0, reach: 320, floor: [770, 610], height: 160, shadow: false, when: () => false }, // the couple's candle (couple retired)
    ],
    entries: { default: [140, 650, 'e'], street: [140, 650, 'e'] },
    anim(g, t) {
      if (F().ch < 5) FX.wisps(g, t + 2, 420, 400, { n: 5, rise: 90, spread: 14, rgb: '215,205,190', a: 0.05, size: 10, speed: 0.12 }); // pipe smoke over the cards
      if (F().ch < 5) { FX.motes(g, t, 360, 120, 700, 300, 26, '255,210,150'); }
    },
    npcs: [
      { id: 'amalia', x: 1000, y: 618, dir: 'w', name: 'Dona Amália', look: 'narr_look_amalia', talk: () => S.talkAmalia(),
        items: { ginja: () => S.giveGinja(), any: 'alan_fail_08' } },
    ],
    ambient: [
      { id: 'npc_lino', name: 'Senhor Lino', frames: ['npc_lino', 'npc_lino_b'], talkFrames: ['npc_lino_talk', 'npc_lino_b'], talk: () => S.talkLino(), items: { coins: () => S.buyGinja() }, x: 1160, y: 520, h: 360, dir: 'w', look: 'alan_npc_lino', when: () => F().ch < 5, idleHold: [2.5, 5], variantHold: [1.6, 3] },
      { id: 'npc_cards', name: 'Sueca players', anim: { seated: true }, frames: ['npc_cards', 'npc_cards_b'], talkFrames: ['npc_cards_b', 'npc_cards'], talk: S.chat('chat_cards', ['cards_talk_1', 'alan_cards_1'], ['cards_talk_2']), x: 355, y: 610, h: 292, look: 'alan_npc_cards', when: () => F().ch < 5, variantHold: [0.9, 1.5] },
      { id: 'npc_guitar', name: 'Duarte', anim: { seated: true }, frames: ['npc_guitar', 'npc_guitar_b'], talkFrames: ['npc_guitar_talk1', 'npc_guitar_talk2', 'npc_guitar_talk3'], x: 676, y: 606, h: 326, at: [812, 648], face: 'w', look: 'alan_npc_guitar', talk: () => S.flirtGuitar(), when: () => F().ch < 5 && !F().duarte_scene }, // gone for good once he has visited Alan
      { id: 'npc_couple', name: 'A couple', frames: ['npc_couple', 'npc_couple_b'], x: 770, y: 610, h: 285, look: 'alan_npc_couple', when: () => false }, // retired: Alan and Duarte need the room
    ],
    occluders: [{ y: 600, polys: [[[880, 365], [1280, 365], [1280, 590], [880, 590]]], draw: g => { if (!F().matchesTaken) S.drawMatches(g, 912, 380); if (S.glassOnBar()) S.drawGlass(g, 1086, 392); } }], // the bar, in front of Lino (Amália's glass sits on it)
    hotspots: [
      { name: 'Door', rect: [20, 100, 215, 450], at: [140, 640], exit: 'street', entry: 'tavern' },
      { name: 'Fado poster', rect: [265, 130, 135, 210], look: 'narr_look_tavern' },
      { name: 'Old photograph', rect: [548, 178, 103, 100], at: [600, 625], face: 'n', look: async () => { await say('narr_look_photo'); await S.showPhoto(); await say('alan_photo'); F().saw_photo = true; } },
      { name: 'Guitarra portuguesa', rect: [722, 135, 80, 210], look: 'narr_look_guitar' },
      { name: 'Box of matches', rect: [892, 362, 44, 30], at: [905, 650], face: 'n', when: () => F().ch < 5 && !F().matchesTaken, look: 'narr_look_candle',
        take: async () => { if (F().matchesTaken) return say('alan_fail_take'); F().matchesTaken = true; give('matches'); await say('amalia_matches'); await say('alan_matches'); } },
      { name: 'Bottles of ginjinha', rect: [960, 100, 320, 260], at: [1150, 660], face: 'n', look: 'narr_look_bottles',
        take: () => say(F().ch < 5 ? 'alan_take_bottle' : 'alan_fail_take'), items: { coins: () => S.buyGinja() } },
      { name: 'Bar', rect: [880, 362, 400, 220], at: [1150, 660], face: 'n', look: 'narr_look_bottles', items: { coins: () => S.buyGinja(), any: 'alan_fail_03' } },
      { name: 'Empty glass', rect: [1066, 362, 42, 36], at: [1080, 660], face: 'n', when: () => S.glassOnBar(), look: 'alan_look_glass',
        take: async () => { give('glass'); await say('alan_take_glass'); } },
    ],
    async enter() {
      if (F().ch >= 5 && !F().amalia_night) {
        F().amalia_night = true;
        await say('narr_tavern_night');
        const am = G.npc('amalia'); if (am) am.set = 'sing';
        await say('amalia_night_sing');
        if (am) am.set = null;
        await say('amalia_alone', 'alan_amalia_thanks');
      }
    },
  };
  S.buyGinja = async function () {
    if (F().ch >= 5) return say('alan_fail_take');
    if (G.has('ginja') || F().heard_song) return say('alan_have_ginja');
    if ((F().coins || 0) < 2) return say('alan_take_bottle');
    const lino = G.npc('npc_lino');
    if (lino) await say('lino_sell');
    spendCoin(2); sfx('coin');
    if (lino) { lino.idleIdx = 1; sfx('pour'); await G.wait(window.FAST ? 20 : 1100); await say('lino_poured'); lino.idleIdx = 0; if (!F().gag_lino && !F().visit_guitar) { F().gag_lino = true; await say('gag_lino', 'gag_alan_lino'); } }
    else sfx('pour');
    give('ginja', 2);
    await joke('alan_ginjinhas');
  };
  // "O Sino Afogado": Amália's fado, sung in Portuguese; the captions translate it
  S.SINO_SONG = Sound.playSong ? 'audio/music/o_sino_afogado.mp3' : null;
  S.SINO_LYRICS = [
    [19.5, "Nine days the fog lies over the river, over the quay;"],
    [27.2, "nine nights the bronze sleeps where no one hears it any more."],
    [35.8, "The founders, out of fear, cut out its tongue one day,"],
    [42.8, "and bound it with the blood that ran in their veins."],
    [50.0, "Oh, my bell-founder love, don't speak to me of your bell;"],
    [66.5, "for I know the sea is long, and your blood is your fate."],
    [79.5, "Where the Carmo prays without a roof, the stone weeps cold salt;"],
    [101.5, "turn the letters seven times, son of the bronze and the river."],
    [108.5, "If fear holds you, love, as it held those who made it,"],
    [115.5, "the sea waits, the sea is long: ring it backward, once and for all."],
    [125.5, "Oh, my bell-founder love, don't speak to me of your bell;"],
    [138.5, "for I know the sea is long, and your blood is your fate."],
    [159, ''],
  ];
  S.giveGinja = async function () {
    if (!F().askedSong) return say('alan_fail_08');
    if (!F().duarte_flirt) return say('amalia_conditions'); // sober, not alone, and never without Duarte
    const am = G.npc('amalia');
    await say('alan_give_ginja');
    F().ginja = 1; G.renderInv();
    sfx('glass_clink');
    am.pose = 'toast'; G.player.pose = 'drink';
    await say('amalia_toast', 'alan_toast');
    am.pose = null; G.player.pose = null; G.takeItem('ginja');
    // the song: the room freezes, the guitarist plays, Amália sings
    G.cutscene = true;
    try {
      const gui = G.npc('npc_guitar'); if (gui) gui.idleIdx = 1;
      if (!S.SINO_SONG) Sound.playMusic('fado');
      am.set = 'sing';
      // the whole room plays its part (js/story/fado.js): Lino's bass, Duarte, the card players, Alan;
      // the recorded fado with English captions, the old spoken verses as the fallback
      await S.fadoPerformance(am, S.SINO_SONG ? Sound.playSong(S.SINO_SONG) : null);
      Sound.playMusic(G.room.music);
    } finally { am.set = null; G.cutscene = false; }
    await say('amalia_menino', 'amalia_baptised', 'amalia_after_song', 'amalia_face', 'alan_face_pause');
    await joke('alan_ringer'); await say('amalia_called');
    await say('amalia_1955');
    F().heard_song = true;
    if (!G.has('glass') && !F().glassUsed) { G.player.pose = 'pickup'; await G.wait(window.FAST ? 20 : 500); G.player.pose = null; give('glass'); await say('alan_take_glass'); }
    await S.ch1End();
  };
  S.talkAmalia = async function () {
    if (F().ch >= 5) return say('amalia_alone');
    await say('amalia_hello');
    await S.gossip('amalia');
    await G.dialog([
      { line: 'alan_ask_amalia_who', once: true, run: async () => { await say('amalia_who'); const sh = S.showPhoto(); await say('amalia_photo'); await sh; F().saw_photo = true; } }, // the photograph opens on its own: it's the key to the box
      { line: 'alan_ask_amalia_fog', once: true, run: () => say('amalia_fog') },
      { line: 'alan_ask_amalia_photo', once: true, when: () => false, run: () => say('amalia_photo') }, // folded into the Joaquim topic
      { line: 'alan_ask_amalia_song', when: () => F().knows_brotherhood && F().saw_photo && !F().heard_song, run: async () => { await say('amalia_conditions'); F().askedSong = true; } },
      { label: 'Offer her a ginjinha.', when: () => G.has('ginja') && F().askedSong && !F().heard_song, get bye() { return !!F().duarte_flirt; }, run: () => S.giveGinja() },
      { line: 'alan_ask_amalia_box', once: true, when: () => F().saw_box && F().saw_photo && !F().amalia_box, run: async () => { await say('amalia_box_mine', 'alan_proof'); F().amalia_box = true; } },
      { label: 'Could you sing it again?', when: () => F().heard_song, once: true, run: () => say('amalia_sung') },
      { label: 'Goodbye.', bye: true, run: () => say('amalia_bye') },
    ]);
  };
  // Puzzle I-C: Rui leaves Teixeira to guard the evidence; Alan has to turn his head
  // (the officer faces the desk while he guards it, the wall once Alan has worked on him)
  S.copFace = function () {
    const cop = G.npc('npc_phone'); if (!cop) return;
    const wall = !!F().teixeira_wall && !F().teixeira_flirt; // scarlet, he turns his back on the room
    cop.def.flip = wall; cop.dir = 'w';
  };
  S.ruiLeaves = async function () {
    await say('rui_watch');
    const rui = G.npc('rui');
    if (rui) { for (const [x, y] of S.RUI_EXIT) await rui.walkTo(x, y); sfx('door'); rui.visible = false; } // behind the desk and round its end, not through it
    F().rui_out = true; S.copFace();
  };
  // Alan has his sketch and goes back to thank his distraction; the Inspector walks in on the two
  // of them. They spring apart; Rui is mildly surprised (he was out: he didn't see the flirting)
  S.ruiReturns = async function () {
    let rui = G.npc('rui'); const cop = G.npc('npc_phone'), p = G.player, T = ms => G.wait(window.FAST ? 20 : ms);
    let paired = false;
    if (cop) {
      await p.walkTo(cop.x + 105, cop.y); p.dir = 'w';
      F().teixeira_wall = false; S.copFace(); // he turns back to Alan
      if (window.SPRITES.pair_cop_chest) { cop.visible = false; p.x = cop.x + 52; p.dir = 'e'; p.pose = 'pair_cop_chest'; paired = true; }
    }
    await say('alan_cop_thanks');
    F().rui_out = false;
    if (!rui) { G.refreshNpcs(); rui = G.npc('rui'); } // (Alan left the room and came back: the Inspector wasn't there)
    if (rui) { rui.x = S.RUI_EXIT[S.RUI_EXIT.length - 1][0]; rui.y = S.RUI_EXIT[S.RUI_EXIT.length - 1][1]; rui.dir = 'e'; rui.visible = true; }
    sfx('door'); await T(250);
    // caught: both step smartly apart
    if (cop) {
      if (paired) { cop.visible = true; p.x = cop.x + 105; p.pose = null; }
      cop.pose = 'npc_phone_blush';
      await Promise.all([p.walkTo(cop.x + 205, cop.y + 8), cop.walkTo(cop.x - 18, cop.y)]); // Alan one way, Teixeira (a half-step, the receiver to his ear) the other
      p.dir = 'w'; p.pose = 'fluster';
    }
    if (rui) {
      const back = S.RUI_EXIT.slice(0, -1).reverse().concat([S.RUI_DESK]);
      await rui.walkTo(back[0][0], back[0][1]); // a few steps in, and he stops: what's this?
      rui.dir = 'e';
    }
    await say('rui_back_1');
    await say('teixeira_back');
    await say('alan_back');
    if (cop) cop.pose = null; p.pose = null;
    if (rui) { const back = S.RUI_EXIT.slice(0, -2).reverse().concat([S.RUI_DESK]); for (const [x, y] of back) await rui.walkTo(x, y); rui.dir = 'e'; }
    await say('rui_back_2'); // ('rui_constable' no longer plays: he was out of the room)
    F().teixeira_flirt = true; F().flirted_cop = true; S.copFace();
  };
  S.flirtCop = async function () {
    const cop = G.npc('npc_phone'), p = G.player, T = ms => G.wait(window.FAST ? 20 : ms);
    const copPose = k => { if (cop) cop.pose = k; };
    // before the Inspector leaves, and after the sketch: just a blush
    if (!F().rui_out || F().teixeira_wall) { copPose('npc_phone_blush'); await say('phone_flirt_1'); copPose(null); return; }
    const pairUp = k => { if (!cop || !window.SPRITES[k]) return false; cop.visible = false; p.x = cop.x + 52; p.dir = 'e'; p.pose = k; return true; };
    const unpair = () => { if (cop) cop.visible = true; if (cop) p.x = cop.x + 105; p.pose = null; };
    const close = async () => { if (cop && Math.abs(p.x - (cop.x + 105)) > 8) { await p.walkTo(cop.x + 105, cop.y); } p.dir = 'w'; };
    const step = () => F().teixeira_step || 0;
    await G.dialog([
      { line: 'alan_flirt_cop_1', when: () => step() === 0, run: async () => {
        p.pose = 'wink'; await T(200); p.pose = null; copPose('npc_phone_blush'); await say('teixeira_mae1'); copPose(null); F().teixeira_step = 1;
      } },
      { line: 'alan_flirt_cop_2', silent: true, when: () => step() === 1, run: async () => {
        await close(); if (!pairUp('pair_cop_chest')) { p.pose = 'flirt'; copPose('npc_phone_blush'); }
        await say('alan_flirt_cop_2'); // the hand goes to his chest as Alan says it
        await T(500); unpair(); copPose(null); F().teixeira_step = 2;
      } },
      { line: 'alan_flirt_cop_3', silent: true, when: () => step() === 2, bye: true, run: async () => {
        await close(); if (!pairUp('pair_cop_arm')) { p.pose = 'flirt'; copPose('npc_phone_proud'); }
        await say('alan_flirt_cop_3'); // ...and to his arm on the bicep line
        await say('phone_flirt_3'); await say('alan_flirt_cop_4');
        unpair(); copPose('npc_phone_blush');
        if (cop) { await p.walkTo(cop.x + 190, cop.y); p.dir = 'w'; }
        p.pose = 'swoon'; await T(600); p.pose = null; copPose(null);
        F().teixeira_step = 3; F().teixeira_wall = true; S.copFace(); // he turns to the wall, scarlet
      } },
      { label: 'Goodbye.', bye: true, run: () => {} },
    ]);
  };
  // Lino notices where Alan's eyes go
  S.talkLino = async function () {
    if (F().lino_teased) return say('lino_talk_2');
    F().lino_teased = true;
    if (F().duarte_scene) await say('lino_talk_1b', 'alan_lino_1b', 'lino_talk_3b'); // Duarte's stool is empty now
    else await say('lino_talk_1', 'alan_lino_1', 'lino_talk_3');
  };
  // Officer Teixeira mans the station phone in the early chapters, until he has visited Alan
  S.copOnDuty = () => F().ch <= 2 && !F().teixeira_scene; // declined, he's back on the station phone
  // Puzzle I (song): Duarte plays only for people who listen; Alan listens very closely
  S.flirtGuitar = async function () {
    const gt = G.npc('npc_guitar'), p = G.player;
    const gPose = k => { if (gt) gt.pose = k; };
    if (F().duarte_flirt) { gPose('npc_guitar_wink'); await say('guitar_flirt_1'); gPose(null); return; }
    if (!F().askedSong) { gPose('npc_guitar_lean'); await say('duarte_listen'); gPose(null); return; }
    const talking = window.SPRITES.npc_guitar_talk1 ? null : 'npc_guitar_lean';
    const step = () => F().duarte_step || 0;
    await G.dialog([
      { line: 'alan_flirt_guitar_1', when: () => step() === 0, run: async () => {
        gPose('npc_guitar_flourish'); await G.wait(window.FAST ? 20 : 300); gPose(talking); await say('guitar_flirt_1'); gPose(null); F().duarte_step = 1;
      } },
      { line: 'alan_flirt_guitar_2', when: () => step() === 1, run: async () => {
        gPose('npc_guitar_wink'); await say('guitar_flirt_2'); gPose(null); F().duarte_step = 2;
      } },
      { label: 'Watch his hands.', when: () => step() === 2, bye: true, run: async () => {
        gPose(talking); await say('guitar_flirt_3');
        p.pose = 'fluster'; gPose('npc_guitar_lean'); await say('alan_flirt_guitar_3'); p.pose = null;
        // the lesson: his hand over Alan's on the neck of the guitar
        if (gt && window.SPRITES.pair_guitar_lesson) {
          await p.walkTo(gt.x + 110, gt.y + 30);
          const py = p.y; gt.visible = false; p.x = gt.x + 30; p.y = gt.y + 16; p.dir = 'e'; p.pose = 'pair_guitar_lesson';
          await say('guitar_flirt_4', 'alan_flirt_guitar_4');
          p.pose = null; p.y = py; gt.visible = true; p.x = gt.x + 110; p.dir = 'w';
        } else await say('guitar_flirt_4', 'alan_flirt_guitar_4');
        gPose('npc_guitar_serenade'); await say('duarte_agree'); gPose(null);
        F().duarte_step = 3; F().duarte_flirt = true; F().flirted_guitar = true;
        if (G.npc('amalia')) await say('gag_amalia', 'gag_alan_amalia');
      } },
      { label: 'Goodbye.', bye: true, run: () => {} },
    ]);
  };
  // The receiver's coiled cord. The desk phone (layer police_cradle) has its receiver off; the cord
  // leaves the base, lies across the front of the desk and rises to the receiver in Teixeira's hand
  // (or in the pair frame when Alan is with him). CORD_AT: where the cord meets the receiver in
  // each frame, as fractions of the painting (unmirrored).
  S.CORD_AT = { npc_phone: [0.3088, 0.1887], npc_phone_b: [0.5327, 0.2045], npc_phone_blush: [0.3351, 0.2503], npc_phone_proud: [0.6652, 0.5268],
    pair_cop_chest: [0.2225, 0.3719], pair_cop_arm: [0.2154, 0.1873] };
  S.CORD_DESK = [[800, 381], [806, 396], [818, 409], [872, 412], [916, 411]]; // from the base to the desk's front corner
  S.coilPath = function (g, pts, amp) {
    // a coiled cord: little loops along the path, a dark line and a faint highlight
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    const n = Math.max(8, Math.round(L / 1.2)), out = [];
    for (let k = 0; k <= n; k++) {
      let d = k / n * L, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
      const u = seg[i] ? d / seg[i] : 0, [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      const tx = (x1 - x0) / (seg[i] || 1), ty = (y1 - y0) / (seg[i] || 1), a = k / n * L / 3.1 * Math.PI;
      out.push([x0 + (x1 - x0) * u - ty * Math.cos(a) * amp + tx * Math.sin(a) * amp * 0.5, y0 + (y1 - y0) * u + tx * Math.cos(a) * amp + ty * Math.sin(a) * amp * 0.5]);
    }
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = 'rgba(8,9,11,0.95)'; g.lineWidth = 1.9; g.beginPath(); out.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    g.strokeStyle = 'rgba(120,128,134,0.35)'; g.lineWidth = 0.7; g.beginPath(); out.forEach(([x, y], i) => i ? g.lineTo(x + 0.4, y - 0.5) : g.moveTo(x + 0.4, y - 0.5)); g.stroke();
  };
  S.copCordDesk = function (g) { if (!S.copOnDuty()) return; g.save(); S.coilPath(g, S.CORD_DESK, 2.1); g.restore(); };
  // where the receiver is: Teixeira's hand, or his hand in the pair frame
  S.cordEnd = function (a) {
    const key = a.cur || a.frameKey(), at = S.CORD_AT[key]; if (!at) return null;
    const A = a.place(key, a.lastFlip); if (!A) return null;
    const u = A.flipped ? 1 - at[0] : at[0];
    return [a.x + A.x + u * A.w, a.y + A.y + at[1] * A.h];
  };
  S.copCord = function (g, a) {
    const end = S.cordEnd(a); if (!end) return;
    const [x0, y0] = S.CORD_DESK[S.CORD_DESK.length - 1], [x1, y1] = end;
    // a little slack: the cord sags below the straight line from the desk to the hand
    const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * 26]); }
    g.save(); S.coilPath(g, pts, 2.3); g.restore();
  };
  // (the old wall telephone's cord, no longer used: Teixeira is on the desk phone)
  S.wallPhone = function (g, x, y) {
    // the telephone itself is painted (layer police_phone); only its cord is drawn,
    // coiling down from the base to the handset in Teixeira's hand
    g.save(); g.translate(x, y);
    // coiled cord: loops along a sagging curve down behind the officer
    g.strokeStyle = '#2a2620'; g.lineWidth = 1.6; g.beginPath();
    const [x0, y0, x1, y1] = [0, 52, 44, 190];
    for (let i = 0; i <= 120; i++) {
      const u = i / 120, px = x0 + (x1 - x0) * u - Math.sin(u * Math.PI) * 10, py = y0 + (y1 - y0) * u;
      const a = u * 24 * Math.PI;
      g.lineTo(px + Math.cos(a) * 3.2, py + Math.sin(a) * 1.4);
    }
    g.stroke();
    g.restore();
  };
  // a matchbox with a sailing ship on the lid, at the near end of the bar
  S.drawMatches = function (g, x, y) {
    g.save(); g.translate(x, y);
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.beginPath(); g.ellipse(1, 2.5, 15, 3.2, 0, 0, 7); g.fill();
    // side with the striking strip, then the blue lid with its little sailing ship
    g.fillStyle = '#d8c8a0'; g.fillRect(-12, -5, 24, 6);
    g.fillStyle = '#6a4a2a'; g.fillRect(-12, -3.5, 24, 3);
    const lid = g.createLinearGradient(-12, -10, 12, -5); lid.addColorStop(0, '#3e68b4'); lid.addColorStop(1, '#1c3462');
    g.fillStyle = lid; g.beginPath(); g.moveTo(-12, -5); g.lineTo(-10, -10); g.lineTo(14, -10); g.lineTo(12, -5); g.closePath(); g.fill();
    g.fillStyle = '#f3e6c4'; g.beginPath(); g.moveTo(-3, -6.2); g.lineTo(5, -6.2); g.lineTo(4, -5.4); g.lineTo(-2, -5.4); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(0.6, -9.4); g.lineTo(0.6, -6.4); g.lineTo(-2.4, -6.4); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(1.4, -9); g.lineTo(1.4, -6.4); g.lineTo(3.8, -6.4); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(40,25,15,0.85)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-12, 1); g.lineTo(-12, -5); g.lineTo(-10, -10); g.lineTo(14, -10); g.lineTo(14, -4); g.lineTo(12, 1); g.closePath(); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.moveTo(-9.5, -9.4); g.lineTo(13, -9.4); g.stroke();
    g.restore();
  };
  S.glassOnBar = () => F().heard_song && !G.has('glass') && !F().glassUsed;
  // a small ginjinha glass left on the bar, with a red dreg and a highlight
  S.drawGlass = function (g, x, y) {
    g.save(); g.translate(x, y);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(0, 1, 9, 2.5, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(220,230,235,0.28)'; g.strokeStyle = 'rgba(255,245,230,0.75)'; g.lineWidth = 1.1;
    g.beginPath(); g.moveTo(-7, -22); g.lineTo(-5, 0); g.lineTo(5, 0); g.lineTo(7, -22); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(150,20,30,0.85)'; g.beginPath(); g.moveTo(-5.4, -5); g.lineTo(-5, 0); g.lineTo(5, 0); g.lineTo(5.4, -5); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.moveTo(-4, -19); g.lineTo(-3, -4); g.stroke();
    g.restore();
  };
  S.ch1End = async function () {
    await G.say('narr_ch1_end', { offscreen: true });
    await S.chapter(2, 'narr_ch2_card');
  };
})();
