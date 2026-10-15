// After Alan has flirted with them, Officer Teixeira and Duarte the guitarist each
// come calling at the shop. Inês is behind the counter, so they say it sideways;
// Alan, scarlet, invents a reason to take them upstairs to his room.
(function () {
  const { G, F, say, ROOMS, sfx } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  S.CHARS.cop_visit = { scale: 1.0, frames: { idle: ['cop_visit'], talk: ['cop_visit_talk', 'cop_visit'], walk: ['cop_visit'] } };
  // after the paintings: the officer cuffed on the bed, Duarte on the floor with his guitar (small looping idles)
  S.CHARS.cop_bed = { scale: 1.0, idleHold: [1.6, 2.6], variantHold: [0.9, 1.6], frames: { idle: ['cop_bed1', 'cop_bed2', 'cop_bed3', 'cop_bed4'], talk: ['cop_bed1', 'cop_bed3'] } };
  S.CHARS.guitar_floor = { scale: 1.0, idleHold: [1.2, 2], variantHold: [0.8, 1.4], frames: { idle: ['guitar_floor1', 'guitar_floor3', 'guitar_floor2', 'guitar_floor4'], talk: ['guitar_floor2', 'guitar_floor4'] } };
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
    npcs: visitorDefs(440, 640, 'e').concat([
      { id: 'npc_phone', ch: 'cop_bed', x: 965, y: 628, h: 470, dir: 'w', fixedDir: true, name: 'Officer Teixeira', when: () => visitor === 'cop_bed' },
      { id: 'npc_guitar', ch: 'guitar_floor', x: 1070, y: 704, h: 300, dir: 'w', fixedDir: true, name: 'Duarte', when: () => visitor === 'guitar_floor' },
    ]),
    hotspots: [],
  };

  // the two of them as one painted pair, anchored on the couple's middle (as with Zé)
  async function pair(pose, ms) {
    if (!window.SPRITES[pose]) return; // a frame that was never painted is simply skipped
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
  // after the painting: the visitor stays where the painting left him; Alan pulls
  // his clothes back on (his washhouse frames, played backwards) and goes down
  async function afterwards(state, theirLine, alanLine) {
    const p = G.player, ready = ['cop_bed', 'guitar_floor'].includes(state) && window.SPRITES[state === 'cop_bed' ? 'cop_bed1' : 'guitar_floor1'];
    visitor = ready ? state : (state === 'cop_bed' ? 'cop' : 'guitar');
    G.refreshNpcs(true);
    p.x = 640; p.y = 650; p.dir = 'e'; p.pose = 'undress4';
    await T(500); await G.fade(false); await T(900); // let the painting finish fading first
    await say(theirLine);
    p.pose = 'undress3'; for (let i = 0; i < 4; i++) { p.x -= 5; await T(160); }
    p.pose = 'undress2'; await T(800);
    await say(alanLine);
    p.pose = 'undress1'; await T(700);
    p.pose = 'button'; await T(800); p.pose = null;
    p.dir = 'w'; await p.walkTo(150, 690); // out past the bookshelf, down the stairs
    sfx('stairs', 0.6);
    await downstairs();
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
      // the officer backed against the room's own bookshelf, Alan very much in charge
      const home = p.x; if (v) { p.x = 410; v.visible = false; }
      p.dir = 'e'; sfx('sheet_slap', 0.2); await pair('pair_cop_shelf', 2200);
      await pair('pair_cop_jacket', 1600);
      await say('phone_room_2', 'alan_room_cop_2');
      await pair('pair_cop_neck', 1800);
      sfx('sheet_slap', 0.2); await pair('pair_cop_tshirt', 1600);
      await pair('pair_cop_buttons', 1800);
      await say('alan_room_cop_4', 'phone_room_4');
      sfx('sheet_slap', 0.2); await pair('pair_cop_shelf2', 1800);
      await pair('pair_cop_belt', 1700);
      sfx('sheet_slap', 0.25); await pair('pair_cop_trousers', 1800);
      // his own handcuffs
      sfx('sheet_slap', 0.25); p.x = 560; await pair('pair_cop_cuffs', 600);
      await say('alan_cuff_1', 'phone_cuff_1', 'alan_cuff_2'); sfx('lamp_click', 0.8);
      await G.showStill('still_cop_shelf', () => G.say('narr_room_cop', { offscreen: true }), { zoom: [1.02, 1.14], pan: [[0.5, 0.45], [0.45, 0.4]], keep: true });
      // later: one wrist on the bedframe, the hat, the jacket, and no key
      if (G.image('still:still_cop_cuffed')) {
        await G.fade(true);
        await G.showStill('still_cop_cuffed', async () => {
          await G.fade(false);
          await G.say('narr_cuff', { offscreen: true });
          await say('phone_cuff_2', 'alan_cuff_3', 'phone_cuff_3', 'alan_cuff_4', 'phone_cuff_4');
          await say('ines_cuff', 'alan_cuff_5');
          await T(600); await say('phone_cuff_5', 'alan_cuff_6');
          sfx('lamp_click', 0.6);
        }, { zoom: [1.0, 1.1], pan: [[0.45, 0.5], [0.55, 0.5]], keep: true });
      }
      await G.fade(true); G.endStill();
      await afterwards('cop_bed', 'phone_room_3', 'alan_room_cop_3');
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
      p.dir = 'e'; sfx('sheet_slap', 0.25); await pair('pair_guitar_jackets', 1800); // Duarte on the left, Alan on the right
      await pair('pair_guitar_undress', 1800);
      sfx('sheet_slap', 0.25); await pair('pair_guitar_shirtfly', 1600);
      await pair('pair_guitar_undress2', 1600);
      await say('guitar_room_4', 'alan_room_guitar_3');
      sfx('sheet_slap', 0.3); await pair('pair_guitar_hop', 1700);
      await pair('pair_guitar_lasso', 1700);
      await pair('pair_guitar_underwear', 2200);
      await say('guitar_room_2');
      await G.showStill('still_guitar_bed', () => G.say('narr_room_guitar', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.55, 0.5], [0.5, 0.45]], keep: true });
      await G.fade(true); G.endStill();
      await afterwards('guitar_floor', 'guitar_room_3', 'alan_room_guitar_2');
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
