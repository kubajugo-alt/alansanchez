// After Alan has flirted with them, Officer Teixeira and Duarte the guitarist each
// come calling at the shop. Inês is behind the counter, so they say it sideways;
// Alan, scarlet, invents a reason to take them upstairs to his room.
(function () {
  const { G, F, say, ROOMS, sfx } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  // side-on strides for walking in (until painted, the standing frame glides)
  const strides = k => window.SPRITES[k + '_walk1'] ? [k + '_walk1', k + '_walk2'] : [k + '_visit'];
  S.CHARS.cop_visit = { scale: 1.0, speed: 0.8, frames: { idle: ['cop_visit'], talk: ['cop_visit_talk', 'cop_visit'], walk: strides('cop') } };
  // after the paintings: the officer cuffed on the bed, Duarte on the floor with his guitar (small looping idles)
  S.CHARS.cop_bed = { scale: 1.0, idleHold: [1.6, 2.6], variantHold: [0.9, 1.6], frames: { idle: ['cop_side1', 'cop_side2', 'cop_side3', 'cop_side4'], talk: ['cop_side2', 'cop_side1'] } };
  S.CHARS.guitar_floor = { scale: 1.0, idleHold: [1.2, 2], variantHold: [0.8, 1.4], frames: { idle: ['guitar_floor1', 'guitar_floor3', 'guitar_floor2', 'guitar_floor4'], talk: ['guitar_floor2', 'guitar_floor4'] } };
  S.CHARS.guitar_visit = { scale: 1.0, speed: 0.75, frames: { idle: ['guitar_visit'], talk: ['guitar_visit_talk', 'guitar_visit'], walk: strides('guitar') } };

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
  const TORSO = { shelf: 65, jacket: 61, neck: 28, tshirt: 73, buttons: 108, shelf2: 61, belt: 22, belt2: 57, trousers: 29, cuffs: 66 };
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
  // after the painting: the visitor stays where the painting left him while Alan pulls
  // his clothes back on (black briefs -> jeans -> t-shirt -> jacket) and goes down.
  // beats: [dressing stage, ...lines], played in order; coda: the last word, alone in the room
  async function afterwards(state, beats, coda) {
    const p = G.player, ready = ['cop_bed', 'guitar_floor'].includes(state) && window.SPRITES[state === 'cop_bed' ? 'cop_side1' : 'guitar_floor1'];
    visitor = ready ? state : (state === 'cop_bed' ? 'cop' : 'guitar');
    G.refreshNpcs(true);
    if (state === 'guitar_floor') Sound.playMusic('fado'); // Duarte plays while Alan dresses
    const dress = k => { p.pose = window.SPRITES['alan_dress' + k] ? 'alan_dress' + k : null; };
    p.x = 640; p.y = 650; p.dir = 'e'; dress(1);
    await T(500); await G.fade(false); await T(900); // let the painting finish fading first
    for (const [stage, ...lines] of beats) {
      if (typeof stage === 'function') { await stage(); continue; }
      dress(stage); if (stage === 2) for (let i = 0; i < 4; i++) { p.x -= 5; await T(140); } else await T(500);
      if (lines.length) await say(...lines);
    }
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
    // in from the door side, a few steps across the front of the counter to the rug
    const v = G.npc(who === 'cop' ? 'npc_phone' : 'npc_guitar');
    if (v && !window.FAST) { const [x, y] = [v.x, v.y]; v.x = 1370; v.y = 700; await v.walkTo(x, y); v.dir = 'w'; }
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
      // a breath, a gasp, a groan as each frame lands (sound only, no caption)
      const VOX = { neck: 'v_cop_moan', shelf: 'v_cop_gasp', jacket: 'v_alan_mmm', tshirt: 'v_cop_whimper', buttons: 'v_alan_groan',
        shelf2: 'v_cop_moan', belt: 'v_cop_gasp', belt2: 'v_alan_mmm', trousers: 'v_cop_whimper', cuffs_a: 'v_alan_chuckle', cuffs_b: 'v_cop_gasp' };
      const shelf = (k, ms) => { if (VOX[k] && window.SPRITES['pair_cop_' + k]) { sfx(VOX[k], 0.55); ms = Math.max(ms, 1300); } return pair('pair_cop_' + k, ms, SHELF, TORSO[k]); };
      p.dir = 'e'; sfx('sheet_slap', 0.2); await shelf('neck', 900); // straight into his neck, backed against the shelf
      await say('phone_room_2', 'alan_room_cop_2');
      await shelf('shelf', 600); // then his wrists, pinned above his head
      await say('alan_room_cop_5', 'phone_room_5');
      await shelf('jacket', 2200); // wrists still pinned, the jacket shrugged off
      sfx('sheet_slap', 0.2); await shelf('tshirt', 900);
      await say('phone_room_6', 'alan_room_cop_6');
      await shelf('buttons', 1200);
      await say('alan_room_cop_4', 'phone_room_4');
      // the bookshelf, close up: his shirt open, the books going over
      sfx('sheet_slap', 0.25); sfx('v_cop_moan', 0.5);
      await G.showStill('still_cop_shelf', () => G.say('narr_room_cop', { offscreen: true }), { zoom: [1.02, 1.14], pan: [[0.5, 0.45], [0.45, 0.4]], keep: true });
      await G.fade(true); G.endStill(); await shelf('shelf2', 0); await T(300); await G.fade(false);
      await T(2200); // back in the room: the shirt open, his hand on the officer's chest
      await shelf('belt', 1000);
      await say('alan_room_cop_7', 'phone_room_7');
      await shelf('belt2', 900); // his trousers, halfway
      await say('alan_room_cop_8', 'phone_room_8');
      sfx('sheet_slap', 0.25); await shelf('trousers', 900);
      await say('phone_room_9', 'alan_room_cop_9');
      // his own handcuffs
      sfx('sheet_slap', 0.25); await shelf('cuffs', 600);
      await say('alan_cuff_1');
      await shelf('cuffs_a', 300); // twirling them on a finger; the officer backs off
      await say('phone_cuff_1');
      await shelf('cuffs_b', 300); // dangling them in front of his face
      await say('alan_cuff_2'); sfx('lamp_click', 0.8);
      // later: one wrist on the bedframe, the hat, the jacket, and no key
      if (G.image('still:still_cop_cuffed')) {
        await G.fade(true);
        await G.showStill('still_cop_cuffed', async () => {
          await G.fade(false);
          sfx('v_cop_whimper', 0.5); await T(900);
          await G.say('narr_cuff', { offscreen: true }); // over the painting, only the narrator
          sfx('v_alan_chuckle', 0.45); await T(1200);
        }, { zoom: [1.0, 1.1], pan: [[0.45, 0.5], [0.55, 0.5]], keep: true });
      }
      await G.fade(true); G.endStill();
      await afterwards('cop_bed', [
        [1, 'phone_key_1', 'alan_key_1'],           // the key turns up in his hat
        [2, 'phone_key_2'],
        [() => { sfx('v_alan_chuckle', 0.5); return T(700); }],
        [3, 'alan_key_2', 'phone_key_3', 'alan_key_3'], // ...and goes in Alan's pocket
        [() => say('ines_cuff', 'alan_cuff_5')],      // the station is asking after its officer
        [4, 'alan_after_1'],                          // "Ten minutes. Don't go anywhere, Officer."
      ], 'phone_after_2');
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
      const VOX = { jackets: 'v_duarte_hum', j2: 'v_alan_mmm', u1: 'v_duarte_laugh', s2: 'v_alan_chuckle', d1: 'v_duarte_hum', d2: 'v_duarte_groan',
        h1: 'v_duarte_laugh', underwear: 'v_alan_groan', p1: 'v_duarte_groan', };
      const g = async (k, ...lines) => {
        const vox = VOX[k] && window.SPRITES['pair_guitar_' + k]; if (vox) sfx(VOX[k], 0.55);
        await pair('pair_guitar_' + k, vox ? 1200 : 450); if (lines.length) await say(...lines);
      };
      await g('j0', 'guitar_room_5', 'alan_room_guitar_4');               // lapels: "Shall we tune up?"
      sfx('sheet_slap', 0.25);
      await g('jackets', 'guitar_room_10', 'alan_room_guitar_9');         // peeling the leather off
      await g('j1', 'alan_room_guitar_10');                               // the suit jacket next
      await g('j2', 'guitar_room_11', 'alan_room_guitar_11');             // his hand on Alan's stomach
      await g('u1', 'alan_room_guitar_12');                               // Duarte's shirt coming off
      await g('u2', 'guitar_room_12', 'alan_room_guitar_13');             // the last sleeve
      sfx('sheet_slap', 0.25); await g('shirtfly', 'alan_room_guitar_5'); // "Encore!"
      await g('s1', 'guitar_room_4');                                     // "First belt off wins"
      await g('s2', 'alan_room_guitar_14');                               // the whip
      await g('undress2', 'alan_room_guitar_3');                          // "Best of three. Trousers."
      await g('d1', 'guitar_room_13', 'alan_room_guitar_15');             // buttons, slowly / not slowly
      await g('d2', 'guitar_room_8', 'alan_room_guitar_8');               // the double bass
      sfx('sheet_slap', 0.3);
      await g('hop', 'guitar_room_14', 'alan_room_guitar_16');            // never fallen over...
      await g('h1', 'guitar_room_15');                                    // ...on purpose
      await g('h2');
      await g('lasso', 'guitar_room_6', 'alan_room_guitar_6', 'guitar_room_2');
      await g('l1', 'alan_room_guitar_7');                                // "Hop on. Express service."
      await g('l2');
      await g('underwear', 'guitar_room_7');                              // "Giddy up, bookseller!"
      await g('p1', 'alan_room_guitar_17', 'guitar_room_16');             // hold on to something
      await say('guitar_room_9');
      sfx('v_alan_sigh', 0.5);
      await G.showStill('still_guitar_bed', () => G.say('narr_room_guitar', { offscreen: true }), { zoom: [1.0, 1.12], pan: [[0.55, 0.5], [0.5, 0.45]], keep: true });
      await G.fade(true); G.endStill();
      await afterwards('guitar_floor', [
        [1, 'guitar_room_3'], [2], [3, 'alan_room_guitar_2'], [4],
      ], 'guitar_after_1');
    });
  };

  S.setVisitor = v => { visitor = v; G.refreshNpcs(true); }; // for testing

  // the rolling gag: everyone who saw Alan with the officer or Duarte has something to say about it,
  // and Alan denies everything. One remark per conversation, each said once, in order.
  const GOSSIP = {
    ines: [['ines_gossip_1', 'alan_deny_ines_1', 'visit_cop'], ['ines_gossip_2', 'alan_deny_ines_2', 'visit_guitar'], ['ines_gossip_3', 'alan_deny_ines_3']],
    celeste: [['celeste_gossip_1', 'alan_deny_celeste_1'], ['celeste_gossip_2', 'alan_deny_celeste_2', 'visit_guitar']],
    amalia: [['amalia_gossip_1', 'alan_deny_amalia_1', 'visit_guitar'], ['amalia_gossip_2', 'alan_deny_amalia_2']],
    rui: [['rui_gossip_1', 'alan_deny_rui_1', 'visit_cop'], ['rui_gossip_2', 'alan_deny_rui_2', 'visit_cop']],
  };
  S.gossip = async function (who) {
    if (!F().visit_cop && !F().visit_guitar) return;
    const said = F().gossip || (F().gossip = {});
    const next = (GOSSIP[who] || []).find(([line, , needs]) => !said[line] && (!needs || F()[needs]));
    if (!next) return;
    said[next[0]] = true;
    await say(next[0]);
    G.player.pose = 'fluster'; await say(next[1]); G.player.pose = null;
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
