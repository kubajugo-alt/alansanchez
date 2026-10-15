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
  ROOMS.shop.npcs = (ROOMS.shop.npcs || []).concat(visitorDefs(866, 684, 'w')); // on the rug, clear of the counter

  // ---------------------------------------------------------------- Alan's room, upstairs
  ROOMS.bedroom = {
    name: "Alan's room", bg: 'bedroom',
    // afterwards: the bed wrecked and the visitor's clothes all over the floor
    bgs: ['bedroom_after_cop', 'bedroom_after_guitar'],
    bgFn: () => visitor === 'cop_bed' ? 'bedroom_after_cop' : visitor === 'guitar_floor' ? 'bedroom_after_guitar' : 'bedroom', noSave: true, music: null, ambience: 'shop', floor: 'wood',
    walk: [[330, 500], [860, 500], [1010, 716], [120, 716]], // between the bookshelf and the bed
    scale: [490, 400, 716, 500],
    light: { ambient: 'rgb(205,180,150)', base: 0.8, rim: 'rgba(255,210,160,0.25)', rimSide: 1 },
    lights: [{ x: 780, y: 268, rgb: '255,200,130', kind: 'gas', seed: 5, glow: 90, ga: 0.3, power: 0.55, reach: 800, floor: [780, 480], height: 260 }],
    entries: { default: [700, 640, 'w'] },
    npcs: visitorDefs(440, 640, 'e').concat([
      { id: 'npc_phone', ch: 'cop_bed', x: 1080, y: 786, h: 540, dir: 'w', fixedDir: true, name: 'Officer Teixeira', when: () => visitor === 'cop_bed' },
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
    // chain: small links, sagging slightly
    const n = Math.max(3, Math.round(Math.hypot(ex - wx, ey - wy) / 5));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = wx + (ex - wx) * t, y = wy + (ey - wy) * t + Math.sin(t * Math.PI) * 2;
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

  const SHELF = 150; // the front of the bookshelf, where the officer's back meets it
  // where the officer's torso starts in each frame (sprite px at chest height); the cuffs frame sets the mark
  const TORSO = { shelf: 65, jacket: 35, neck: 28, tshirt: 73, buttons: 108, shelf2: 61, belt: 22, belt2: 40, trousers: 29, cuffs: 66 };
  // the two of them as one painted pair, anchored on the couple's middle (as with Zé)
  async function pair(pose, ms, wall, torso) {
    if (!window.SPRITES[pose]) return; // a frame that was never painted is simply skipped
    const p = G.player; p.pose = pose;
    if (wall != null) { // the left figure's back against the wall, lined up on his torso rather than a raised arm
      const A = p.place(pose, false);
      if (A) p.x = wall - A.x + (torso == null ? 0 : (TORSO.cuffs - torso) * A.w / A.sp.w);
    }
    await T(ms);
  }
  async function upstairs(who, at) {
    await G.fade(true);
    await G.goRoom('bedroom', null, { instant: true, noEnter: true, noSave: true, pos: at });
    const v = G.npc(who === 'cop' ? 'npc_phone' : 'npc_guitar'); if (v) v.dir = 'e';
    G.player.dir = 'w';
    await G.fade(false);
    return v;
  }
  async function downstairs(back) {
    await G.fade(true);
    visitor = null; G.player.pose = null;
    await G.goRoom('shop', null, { instant: true, noEnter: true, pos: [760, 612, 'w'] });
    await G.fade(false);
    // Ines has opinions about the afternoon
    if (back && G.npc('ines')) { await say(back[0]); G.player.pose = 'fluster'; await say(back[1]); G.player.pose = null; }
    G.autosave();
  }
  // after the painting: the visitor stays where the painting left him; Alan pulls
  // his clothes back on (black briefs -> jeans -> t-shirt -> jacket) and goes down
  async function afterwards(state, theirLine, alanLine, tail, coda) {
    const p = G.player, ready = ['cop_bed', 'guitar_floor'].includes(state) && window.SPRITES[state === 'cop_bed' ? 'cop_side1' : 'guitar_floor1'];
    visitor = ready ? state : (state === 'cop_bed' ? 'cop' : 'guitar');
    G.refreshNpcs(true);
    if (state === 'guitar_floor') Sound.playMusic('fado'); // Duarte plays while Alan dresses
    const dress = k => { p.pose = window.SPRITES['alan_dress' + k] ? 'alan_dress' + k : null; };
    p.x = 640; p.y = 650; p.dir = 'e'; dress(1);
    await T(500); await G.fade(false); await T(900); // let the painting finish fading first
    await say(theirLine);
    dress(2); for (let i = 0; i < 4; i++) { p.x -= 5; await T(160); }
    dress(3); await T(800);
    await say(alanLine);
    dress(4); await T(700);
    if (tail) await say(...tail);
    await T(300); p.pose = null;
    p.dir = 'w'; await p.walkTo(150, 690); // out past the bookshelf, down the stairs
    sfx('stairs', 0.6);
    if (coda) { await T(500); await say(coda); } // whoever is left behind gets the last word
    await downstairs(state === 'cop_bed' ? ['ines_back_cop', 'alan_back_cop'] : ['ines_back_guitar', 'alan_back_guitar']);
  }
  // a line at a time, Alan's pose changing with it (null: his own talking animation)
  async function beats(...list) {
    const p = G.player;
    for (const [pose, line] of list) { p.pose = pose; await say(line); }
    p.pose = null;
  }
  async function arrive(who) {
    await G.player.walkTo(716, 618); // in from the street, out of the doorway
    sfx('door'); await T(400);
    visitor = who; G.refreshNpcs();
    G.player.dir = 'e';
  }

  S.visitCop = async function () {
    F().visit_cop = true;
    const p = G.player;
    await G.busy(async () => {
      await arrive('cop');
      // in front of Ines: a polite yard apart, both scarlet
      await beats(['fluster', 'phone_visit_1'], ['alan_idle2', 'ines_visit_cop'], ['fluster', 'phone_visit_2'], [null, 'alan_visit_cop'], ['fluster', 'ines_visit_after']);
      const v = await upstairs('cop', [660, 645, 'w']);
      await say('phone_room_1', 'alan_room_cop_1');
      // Alan takes the lead: against the bookshelf, the shirt, the neck
      // the officer backed against the room's own bookshelf, Alan very much in charge
      const home = p.x; if (v) { p.x = 410; v.visible = false; }
      const shelf = (k, ms) => pair('pair_cop_' + k, ms, SHELF, TORSO[k]);
      p.dir = 'e'; sfx('sheet_slap', 0.2); await shelf('shelf', 600); // his wrists pinned to the shelf
      await say('alan_room_cop_5', 'phone_room_5');
      await shelf('jacket', 1500);
      await shelf('neck', 900);
      await say('phone_room_2', 'alan_room_cop_2');
      sfx('sheet_slap', 0.2); await shelf('tshirt', 700);
      await say('phone_room_6', 'alan_room_cop_6');
      await shelf('buttons', 900);
      await say('alan_room_cop_4', 'phone_room_4');
      // the bookshelf, close up: his shirt open, the books going over
      sfx('sheet_slap', 0.25);
      await G.showStill('still_cop_shelf', () => G.say('narr_room_cop', { offscreen: true }), { zoom: [1.02, 1.14], pan: [[0.5, 0.45], [0.45, 0.4]], keep: true });
      await G.fade(true); G.endStill(); await shelf('shelf2', 0); await T(300); await G.fade(false);
      await T(1200);
      await shelf('belt', 600);
      await say('alan_room_cop_7', 'phone_room_7');
      await shelf('belt2', 500); // his trousers, halfway
      await say('alan_room_cop_8', 'phone_room_8');
      sfx('sheet_slap', 0.25); await shelf('trousers', 600);
      await say('phone_room_9', 'alan_room_cop_9');
      // his own handcuffs
      sfx('sheet_slap', 0.25); await shelf('cuffs', 600);
      await say('alan_cuff_1', 'phone_cuff_1', 'alan_cuff_2'); sfx('lamp_click', 0.8);
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
      await afterwards('cop_bed', 'phone_room_3', 'alan_room_cop_3', ['phone_after_1', 'alan_after_1'], 'phone_after_2');
    });
  };

  S.visitGuitar = async function () {
    F().visit_guitar = true;
    const p = G.player;
    await G.busy(async () => {
      await arrive('guitar');
      // Alan scarlet; Duarte perfectly at ease
      await beats(['swoon', 'guitar_visit_1'], ['fluster', 'ines_visit_guitar'], ['swoon', 'guitar_visit_2'], [null, 'alan_visit_guitar'], ['fluster', 'ines_visit_after']);
      const v = await upstairs('guitar', [660, 645, 'w']);
      await say('guitar_room_1', 'alan_room_guitar_1');
      // the same energy from both sides: shirts off together, and a race for the bed
      const home = p.x; if (v) { p.x = (v.x + p.x) / 2; v.visible = false; }
      p.dir = 'e'; // Duarte on the left, Alan on the right
      const run = async (frames, ms) => { for (const f of frames) await pair('pair_guitar_' + f, ms); };
      await pair('pair_guitar_j0', 500);
      await say('guitar_room_5', 'alan_room_guitar_4');
      sfx('sheet_slap', 0.25); await run(['jackets', 'j1', 'j2', 'undress', 'u1', 'u2'], 950);
      sfx('sheet_slap', 0.25); await pair('pair_guitar_shirtfly', 500);
      await say('alan_room_guitar_5');
      await run(['s1', 's2', 'undress2'], 900);
      await say('guitar_room_4', 'alan_room_guitar_3');
      await pair('pair_guitar_d1', 900); await pair('pair_guitar_d2', 500);
      await say('guitar_room_8', 'alan_room_guitar_8');
      sfx('sheet_slap', 0.3); await run(['hop', 'h1', 'h2'], 950);
      await pair('pair_guitar_lasso', 400);
      await say('guitar_room_6', 'alan_room_guitar_6', 'guitar_room_2');
      await pair('pair_guitar_l1', 300);
      await say('alan_room_guitar_7');
      await pair('pair_guitar_l2', 700);
      await pair('pair_guitar_underwear', 400);
      await say('guitar_room_7');
      await pair('pair_guitar_p1', 1000); await pair('pair_guitar_p2', 500);
      await say('guitar_room_9');
      await G.showStill('still_guitar_bed', () => G.say('narr_room_guitar', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.55, 0.5], [0.5, 0.45]], keep: true });
      await G.fade(true); G.endStill();
      await afterwards('guitar_floor', 'guitar_room_3', 'alan_room_guitar_2', null, 'guitar_after_1');
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
