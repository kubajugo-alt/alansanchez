// After Alan has flirted with them, Officer Teixeira and Duarte the guitarist each
// come calling at the shop. Inês is behind the counter, so they say it sideways;
// Alan, scarlet, invents a reason to take them upstairs to his room.
(function () {
  const { G, F, say, ROOMS, sfx } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  S.CHARS.cop_visit = { scale: 1.0, frames: { idle: ['cop_visit'], talk: ['cop_visit_talk', 'cop_visit'], walk: ['cop_visit'] } };
  S.CHARS.guitar_visit = { scale: 1.0, frames: { idle: ['guitar_visit'], talk: ['guitar_visit_talk', 'guitar_visit'], walk: ['guitar_visit'] } };

  // who is calling today (only while a visit is playing)
  let visitor = null;
  const visitorDefs = (x, y, dir) => [
    { id: 'npc_phone', ch: 'cop_visit', x, y, dir, name: 'Officer Teixeira', when: () => visitor === 'cop', look: 'alan_npc_phone' },
    { id: 'npc_guitar', ch: 'guitar_visit', x, y, dir, name: 'Duarte', when: () => visitor === 'guitar', look: 'alan_npc_guitar' },
  ];
  ROOMS.shop.npcs = (ROOMS.shop.npcs || []).concat(visitorDefs(960, 606, 'w'));

  // ---------------------------------------------------------------- Alan's room, upstairs
  ROOMS.bedroom = {
    name: "Alan's room", bg: 'bedroom', noSave: true, music: null, ambience: 'shop', floor: 'wood',
    walk: [[330, 500], [860, 500], [1010, 716], [120, 716]], // between the bookshelf and the bed
    scale: [490, 400, 716, 500],
    light: { ambient: 'rgb(205,180,150)', base: 0.8, rim: 'rgba(255,210,160,0.25)', rimSide: 1 },
    lights: [{ x: 780, y: 268, rgb: '255,200,130', kind: 'gas', seed: 5, glow: 90, ga: 0.3, power: 0.55, reach: 800, floor: [780, 480], height: 260 }],
    entries: { default: [700, 640, 'w'] },
    npcs: visitorDefs(440, 640, 'e'),
    hotspots: [],
  };

  // the two of them as one painted pair, anchored on the couple's middle (as with Zé)
  async function pair(pose, ms) {
    const p = G.player; p.pose = pose; await T(ms);
  }
  async function upstairs(who, at) {
    await G.fade(true);
    await G.goRoom('bedroom', null, { instant: true, noEnter: true, noSave: true, pos: at });
    const v = G.npc(who === 'cop' ? 'npc_phone' : 'npc_guitar'); if (v) v.dir = 'e';
    G.player.dir = 'w';
    await G.fade(false);
    return v;
  }
  async function downstairs() {
    await G.fade(true);
    visitor = null; G.player.pose = null;
    await G.goRoom('shop', null, { instant: true, noEnter: true, pos: [760, 612, 'w'] });
    await G.fade(false);
    G.autosave();
  }
  async function arrive(who) {
    await G.player.walkTo(760, 612); // in from the street, out of the doorway
    sfx('door'); await T(400);
    visitor = who; G.refreshNpcs();
    G.player.dir = 'e';
  }

  S.visitCop = async function () {
    F().visit_cop = true;
    const p = G.player;
    await G.busy(async () => {
      await arrive('cop');
      await say('phone_visit_1', 'ines_visit_cop', 'phone_visit_2');
      p.pose = 'fluster'; await say('alan_visit_cop'); p.pose = null;
      await say('ines_visit_after');
      const v = await upstairs('cop', [660, 645, 'w']);
      await say('phone_room_1', 'alan_room_cop_1');
      // Alan takes the lead: against the bookshelf, the shirt, the neck
      const home = p.x; if (v) { p.x = 450; v.visible = false; } // the painted shelf in the frame lines up with the room's own
      p.dir = 'w'; sfx('sheet_slap', 0.2); await pair('pair_cop_shelf', 2400);
      await say('phone_room_2', 'alan_room_cop_2');
      await pair('pair_cop_neck', 2600);
      await G.showStill('still_cop_shelf', () => G.say('narr_room_cop', { offscreen: true }), { zoom: [1.02, 1.14], pan: [[0.5, 0.45], [0.45, 0.4]], keep: true });
      await G.fade(true); G.endStill();
      p.pose = null; p.x = home; if (v) v.visible = true;
      await T(400); await G.fade(false);
      await say('phone_room_3', 'alan_room_cop_3');
      await downstairs();
    });
  };

  S.visitGuitar = async function () {
    F().visit_guitar = true;
    const p = G.player;
    await G.busy(async () => {
      await arrive('guitar');
      await say('guitar_visit_1', 'ines_visit_guitar', 'guitar_visit_2');
      p.pose = 'fluster'; await say('alan_visit_guitar'); p.pose = null;
      await say('ines_visit_after');
      const v = await upstairs('guitar', [660, 645, 'w']);
      await say('guitar_room_1', 'alan_room_guitar_1');
      // the same energy from both sides: shirts off together, and a race for the bed
      const home = p.x; if (v) { p.x = (v.x + p.x) / 2; v.visible = false; }
      p.dir = 'w'; sfx('sheet_slap', 0.25); await pair('pair_guitar_undress', 2600);
      await say('guitar_room_2');
      await G.showStill('still_guitar_bed', () => G.say('narr_room_guitar', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.55, 0.5], [0.5, 0.45]], keep: true });
      await G.fade(true); G.endStill();
      p.pose = null; p.x = home; if (v) v.visible = true;
      await T(400); await G.fade(false);
      await say('guitar_room_3', 'alan_room_guitar_2');
      await downstairs();
    });
  };

  // a visit happens the next time Alan walks in from the street with Inês minding the shop
  const prevEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (prevEnter) await prevEnter.call(this, entry);
    if (entry !== 'street' || F().ch >= 5 || !G.npc('ines') || !G.image('bg:bedroom')) return;
    if (F().flirted_cop && !F().visit_cop) return S.visitCop();
    if (F().flirted_guitar && !F().visit_guitar) return S.visitGuitar();
  };
})();
