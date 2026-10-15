// After Alan has flirted with them, Officer Teixeira and Duarte the guitarist each
// come calling at the shop. Inês is behind the counter, so they say it sideways;
// Alan, scarlet, invents a reason to take them upstairs to his room.
(function () {
  const { G, F, say, ROOMS, sfx } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  S.CHARS.cop_visit = { scale: 1.0, frames: { idle: ['cop_visit'], talk: ['cop_visit_talk', 'cop_visit'], walk: ['cop_visit'] } };
  // after the paintings: the officer cuffed on the bed, Duarte on the floor with his guitar (small looping idles)
  S.CHARS.cop_bed = { scale: 1.0, idleHold: [1.6, 2.6], variantHold: [0.9, 1.6], frames: { idle: ['cop_side1', 'cop_side2', 'cop_side3', 'cop_side4'], talk: ['cop_side2', 'cop_side1'] } };
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
      { id: 'npc_phone', ch: 'cop_bed', x: 1074, y: 772, h: 480, dir: 'w', fixedDir: true, name: 'Officer Teixeira', when: () => visitor === 'cop_bed' },
      { id: 'npc_guitar', ch: 'guitar_floor', x: 975, y: 706, h: 360, dir: 'w', fixedDir: true, name: 'Duarte', when: () => visitor === 'guitar_floor' },
    ]),
    hotspots: [],
  };

  // the officer's own handcuffs: from his wrist to a ring locked round the footboard post
  const CUFF_AT = { cop_side1: [70, 67], cop_side2: [70, 67], cop_side3: [62, 65], cop_side4: [70, 70] }; // wrist band, sprite px
  const POST = { x: 1062, y: 412, half: 7 };
  ROOMS.bedroom.animFg = function (g) {
    const a = visitor === 'cop_bed' && G.npc('npc_phone');
    if (!a || !a.visible) return;
    const key = a.cur || a.frameKey(), A = a.place(key, a.lastFlip), pt = CUFF_AT[key];
    if (!A || !pt) return;
    const s = A.w / A.sp.w;
    const wx = a.x + A.x + (A.flipped ? A.sp.w - pt[0] : pt[0]) * s, wy = a.y + A.y + pt[1] * s;
    const rx = 10, ry = 4, ex = POST.x + rx - 1, ey = POST.y + 1;
    g.save(); g.lineCap = 'round';
    // chain: three small links, sagging slightly
    for (let i = 0; i < 3; i++) {
      const t = (i + 0.5) / 3, x = wx + (ex - wx) * t, y = wy + (ey - wy) * t + Math.sin(t * Math.PI) * 2;
      g.save(); g.translate(x, y); g.rotate(Math.atan2(ey - wy, ex - wx) + (i % 2 ? Math.PI / 2 : 0));
      g.beginPath(); g.ellipse(0, 0, 3.4, 1.9, 0, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(45,42,38,0.85)'; g.lineWidth = 2.2; g.stroke();
      g.strokeStyle = 'rgb(100,94,84)'; g.lineWidth = 1.2; g.stroke(); g.restore();
    }
    const ring = (from, to) => {
      g.beginPath(); g.ellipse(POST.x, POST.y, rx, ry, 0, from, to);
      g.strokeStyle = 'rgba(40,37,33,0.85)'; g.lineWidth = 4.4; g.stroke();
      g.strokeStyle = 'rgb(96,90,80)'; g.lineWidth = 2.8; g.stroke();
      g.save(); g.translate(0, -0.8); g.strokeStyle = 'rgba(200,185,160,0.35)'; g.lineWidth = 0.8; g.stroke(); g.restore();
    };
    // back of the ring only where it shows either side of the post, then the front over it
    g.save(); g.beginPath(); g.rect(0, 0, POST.x - POST.half, 720); g.rect(POST.x + POST.half, 0, 1280, 720); g.clip();
    ring(Math.PI, Math.PI * 2); g.restore();
    ring(0, Math.PI);
    g.restore();
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
  // his clothes back on (black briefs -> jeans -> t-shirt -> jacket) and goes down
  async function afterwards(state, theirLine, alanLine) {
    const p = G.player, ready = ['cop_bed', 'guitar_floor'].includes(state) && window.SPRITES[state === 'cop_bed' ? 'cop_side1' : 'guitar_floor1'];
    visitor = ready ? state : (state === 'cop_bed' ? 'cop' : 'guitar');
    G.refreshNpcs(true);
    const dress = k => { p.pose = window.SPRITES['alan_dress' + k] ? 'alan_dress' + k : null; };
    p.x = 640; p.y = 650; p.dir = 'e'; dress(1);
    await T(500); await G.fade(false); await T(900); // let the painting finish fading first
    await say(theirLine);
    dress(2); for (let i = 0; i < 4; i++) { p.x -= 5; await T(160); }
    dress(3); await T(800);
    await say(alanLine);
    dress(4); await T(1000); p.pose = null;
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
      p.dir = 'e'; // Duarte on the left, Alan on the right
      const run = async (frames, ms) => { for (const f of frames) await pair('pair_guitar_' + f, ms); };
      sfx('sheet_slap', 0.25); await run(['j0', 'jackets', 'j1', 'j2', 'undress'], 1000);
      await run(['u1', 'u2'], 900);
      sfx('sheet_slap', 0.25); await run(['shirtfly', 's1', 's2', 'undress2'], 1000);
      await say('guitar_room_4', 'alan_room_guitar_3');
      await run(['d1', 'd2'], 900);
      sfx('sheet_slap', 0.3); await run(['hop', 'h1', 'h2', 'lasso'], 1000);
      await run(['l1', 'l2'], 800);
      await run(['underwear', 'p1', 'p2'], 1100);
      await say('guitar_room_2');
      await G.showStill('still_guitar_bed', () => G.say('narr_room_guitar', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.55, 0.5], [0.5, 0.45]], keep: true });
      await G.fade(true); G.endStill();
      await afterwards('guitar_floor', 'guitar_room_3', 'alan_room_guitar_2');
    });
  };

  S.setVisitor = v => { visitor = v; G.refreshNpcs(true); }; // for testing

  // a visit happens the next time Alan walks in from the street with Inês minding the shop
  const prevEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (prevEnter) await prevEnter.call(this, entry);
    if (entry !== 'street' || F().ch >= 5 || !G.npc('ines') || !G.image('bg:bedroom')) return;
    if (F().flirted_cop && !F().visit_cop) return S.visitCop();
    if (F().flirted_guitar && !F().visit_guitar) return S.visitGuitar();
  };
})();
