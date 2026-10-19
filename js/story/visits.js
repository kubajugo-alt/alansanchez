// After Alan has flirted with them, Officer Teixeira and Duarte the guitarist each
// come calling at the shop. Inês is behind the counter, so they say it sideways;
// Alan, scarlet, invents a reason to take them upstairs to his room.
(function () {
  const { G, F, say, ROOMS, sfx, give } = window.S;
  const T = ms => G.wait(window.FAST ? 20 : ms);

  // side-on strides for walking in (until painted, the standing frame glides)
  const strides = k => window.SPRITES[k + '_walk1'] ? [k + '_walk1', k + '_walk2'] : [k + '_visit'];
  S.CHARS.cop_visit = { scale: 1.0, speed: 0.8, frames: { idle: ['cop_visit'], talk: ['cop_visit_talk', 'cop_visit'], walk: strides('cop') } };
  // after the paintings: the officer cuffed on the bed, Duarte on the floor with his guitar (small looping idles)
  S.CHARS.cop_bed = { scale: 1.0, idleHold: [1.6, 2.6], variantHold: [0.9, 1.6], frames: { idle: ['cop_side1', 'cop_side2', 'cop_side3', 'cop_side4'], talk: ['cop_side2', 'cop_side1'] } };
  // the bed pose (approved; ?copbed=old for the old one on the floor): Teixeira up on the bed against the pillows, legs along the mattress,
  // the jacket bunched between his legs, his wrist cuffed up by his head to the headboard (Canva; three small idle moves
  // by Gemini: a glance at the cuff, a tug on the chain, a hand on the jacket). The room painting is the usual one.
  const COP_BED_NEW = !/[?&]copbed=old\b/.test(location.search);
  if (COP_BED_NEW) {
    S.CHARS.cop_bed = { scale: 1.0, idleHold: [1.4, 2.4], variantHold: [0.8, 1.4], anim: { sway: 0.3, nod: 0.6, rig: 'flat' },
      frames: { idle: ['cop_bed1', 'cop_bed2', 'cop_bed1', 'cop_bed3', 'cop_bed1', 'cop_bed4'], talk: ['cop_bed1', 'cop_bed2'] } };
  }
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
    bgFn: () => visitor === 'cop_bed' ? 'bedroom_after_cop' : visitor === 'guitar_floor' ? 'bedroom_after_guitar' : 'bedroom', noSave: true, music: { id: 'alan_theme', vol: 'quiet' }, ambience: 'shop', floor: 'wood',
    walk: [[330, 500], [860, 500], [1010, 716], [120, 716]], // between the bookshelf and the bed
    // Alan and his visitor are shown as painted here: no room light, rims or cast shadows over them
    get unlit() { return visitor ? /^(pair_|cop_|guitar_|alan)/ : /^pair_guitar_/; },
    scale: [490, 400, 716, 500],
    light: { ambient: 'rgb(205,180,150)', base: 0.8, rim: 'rgba(255,210,160,0.25)', rimSide: 1 },
    lights: [{ x: 780, y: 268, rgb: '255,200,130', kind: 'gas', seed: 5, glow: 90, ga: 0.3, power: 0.55, reach: 800, floor: [780, 480], height: 260 }],
    entries: { default: [700, 640, 'w'] },
    npcs: visitorDefs(440, 640, 'e').concat([
      COP_BED_NEW ? { id: 'npc_phone', ch: 'cop_bed', x: 950, y: 400, h: 193.2, dir: 'e', fixedDir: true, name: 'Officer Teixeira', when: () => visitor === 'cop_bed' }
        : { id: 'npc_phone', ch: 'cop_bed', x: 1080, y: 786, h: 540, dir: 'w', fixedDir: true, name: 'Officer Teixeira', when: () => visitor === 'cop_bed' },
      { id: 'npc_guitar', ch: 'guitar_floor', x: 975, y: 706, h: 360, dir: 'w', fixedDir: true, name: 'Duarte', when: () => visitor === 'guitar_floor' },
    ]),
    hotspots: [],
    // the bed pose's contact shadow on the bedding (not with ?copbed=old)
    layers: [{ img: 'cop_bed_shadow', x: 834, y: 227, when: () => COP_BED_NEW && visitor === 'cop_bed' }],
  };

  // the officer's own handcuffs: from his wrist to a ring locked round the footboard post
  const CUFF_AT = { cop_side1: [70, 67], cop_side2: [70, 67], cop_side3: [62, 65], cop_side4: [70, 70], // wrist band, sprite px
    cop_bed1: [68, 98], cop_bed2: [68, 98], cop_bed3: [68, 96], cop_bed4: [68, 98] };
  const POST = COP_BED_NEW ? { x: 872, y: 246, half: 7 } : { x: 1062, y: 412, half: 7 }; // (the new pose: the headboard's top rail, behind his head)
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
  // the two of them as one painted pair, standing on Alan's feet (as with Zé). The first painting takes
  // over from the two figures: both step to where it has them, then it dissolves in (S.pairIn)
  let pairV = null;
  async function pair(pose, ms, wall, torso) {
    if (!window.SPRITES[pose]) return; // a frame that was never painted is simply skipped
    const p = G.player;
    let x = p.x;
    if (wall != null) { // the left figure's back against the wall, lined up on his torso rather than a raised arm
      const A = p.place(pose, false);
      if (A) x = wall - A.x + (torso == null ? 0 : (TORSO.cuffs - torso) * A.w / A.sp.w);
    }
    if (pairV && pairV.visible) {
      const v = pairV; pairV = null;
      if (wall != null) { // he backs up to the shelf as Alan crosses to him
        const x0 = p.x; p.x = x; const o = S.pairPartnerAt(pose); p.x = x0;
        await Promise.all([v.walkTo(o.x, o.y), p.walkTo(x, p.y)]); v.x = o.x; v.y = o.y;
      }
      await S.pairIn(v, pose);
    } else await S.pairStep(pose, x);
    await T(ms);
  }
  async function upstairs(who, at, vx) {
    await G.fade(true);
    await G.goRoom('bedroom', null, { instant: true, noEnter: true, noSave: true, pos: at });
    const v = G.npc(who === 'cop' ? 'npc_phone' : 'npc_guitar'); if (v) { v.dir = 'e'; if (vx != null) v.x = vx; }
    G.player.dir = 'w';
    await G.fade(false);
    return v;
  }
  // the Discreet path: straight up the stairs in the dark, so the afterwards picks up from there
  async function upstairsDark(who) {
    await G.fade(true);
    await G.goRoom('bedroom', null, { instant: true, noEnter: true, noSave: true, pos: [660, 645, 'w'] });
    return G.npc(who === 'cop' ? 'npc_phone' : 'npc_guitar');
  }
  // the threshold choice: [label, value] pairs
  async function choose(opts) {
    let pick = null;
    await G.dialog(opts.map(([label, v]) => ({ label, bye: true, run: () => { pick = v; } })));
    return pick;
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
  async function afterwards(state, beats, coda, after) {
    const p = G.player, ready = ['cop_bed', 'guitar_floor'].includes(state) && window.SPRITES[state === 'cop_bed' ? 'cop_side1' : 'guitar_floor1'];
    visitor = ready ? state : (state === 'cop_bed' ? 'cop' : 'guitar');
    G.refreshNpcs(true);
    const dress = k => { p.pose = window.SPRITES['alan_dress' + k] ? 'alan_dress' + k : null; };
    p.x = 640; p.y = 650; p.dir = 'e'; dress(1); p.pairWho = p.pairNpc = p.pairKey = null; pairV = null;
    await T(500); await G.fade(false); await T(900); // let the painting finish fading first
    if (state === 'guitar_floor' && S.duarteSong) await S.duarteSong(); // he plays Alan his song, all of it
    for (const [stage, ...lines] of beats) {
      if (typeof stage === 'function') { await stage(); continue; }
      dress(stage); if (stage === 2) for (let i = 0; i < 4; i++) { p.x -= 5; await T(140); } else await T(500);
      if (lines.length) await say(...lines);
    }
    await T(300); p.pose = null;
    p.dir = 'w'; await p.walkTo(-90, 700); // out past the bookshelf and out of the room...
    p.visible = false; sfx('stairs', 0.6);  // ...then down the stairs
    if (coda) { await T(500); await say(coda); } // whoever is left behind gets the last word
    if (S.flingBeat) await S.flingBeat(state === 'cop_bed' ? 1 : 2, true); // alone on the stairs
    await downstairs(state === 'cop_bed' ? ['ines_back_cop', 'alan_back_cop'] : ['ines_back_guitar', 'alan_back_guitar']);
    if (after) await after();
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

  // in bed afterwards, cuffed to the headboard, while Alan dresses (also the ?scene=copbed preview)
  const copAfter = () => afterwards('cop_bed', [
    [1, 'phone_key_1', 'alan_key_1'],           // the key turns up in his hat
    [2, 'teixeira_shift'],                       // (phone_key_2/3, alan_key_2/3 no longer play)
    [() => { sfx('v_alan_chuckle', 0.5); return T(700); }],
    [3, 'alan_persuasive', 'teixeira_keep'],     // ...and the key stays in Alan's pocket
    [() => say('ines_cuff', 'alan_cuff_5')],      // the station is asking after its officer
    [4, 'alan_after_1'],                          // "Ten minutes. Don't go anywhere, Officer."
  ], 'phone_after_2', async () => { if (S.inesKey) await S.inesKey(); await S.teixeiraKey(); });
  S.copAfter = () => G.busy(copAfter);

  S.visitCop = async function () {
    F().visit_cop = true;
    const p = G.player;
    Sound.cue('alan_theme', { sticky: true }); // Teixeira's visit, upstairs and down
    await G.busy(async () => {
      await arrive('cop');
      // in front of Ines: a polite yard apart, both scarlet
      // the key first (Rui's 'way' turns out to be him), then the bookcases
      await beats(['fluster', 'phone_visit_1'], ['alan_idle2', 'ines_visit_cop'], [null, 'teixeira_key_first']);
      if (!G.has('fkey')) give('fkey');
      await beats(['fluster', 'phone_visit_2b']);
      if (await choose([['Show him the oak monographs.', 'yes'], ['Just the key, Officer.', 'no']]) !== 'yes') {
        // the key at the door, and a rain check
        await say('teixeira_doorkey'); p.pose = 'wink'; await say('alan_raincheck'); p.pose = null;
        if (!G.has('fkey')) give('fkey'); // (he handed it over as he came in)
        const tv = G.npc('npc_phone'); if (tv && !window.FAST) await tv.walkTo(1370, 700);
        sfx('door'); visitor = null; G.refreshNpcs(); G.autosave();
        return;
      }
      F().teixeira_scene = true;
      await beats([null, 'alan_visit_cop'], ['fluster', 'ines_visit_after']);
      const disc = S.discreet(); // Discreet: straight from the arrival to the afterwards
      const v = disc ? await upstairsDark('cop') : await upstairs('cop', [660, 645, 'w'], 236); // he backs up to the bookshelf: where the paintings have him
      if (!disc) { await say('phone_room_1', 'alan_room_cop_1');
      // Alan takes the lead: against the bookshelf, the shirt, the neck
      // the officer backed against the room's own bookshelf, Alan very much in charge
      pairV = v; // Alan crosses to him; nobody jumps (pair, above)
      // a breath, a gasp, a groan as each frame lands (sound only, no caption)
      const VOX = { neck: 'v_cop_moan', shelf: 'v_cop_gasp', jacket: 'v_alan_mmm', tshirt: 'v_cop_whimper', buttons: 'v_alan_groan',
        shelf2: 'v_cop_moan', belt: 'v_cop_gasp', belt2: 'v_alan_mmm', trousers: 'v_cop_whimper', cuffs_a: 'v_alan_chuckle', cuffs_b: 'v_cop_gasp' };
      const shelf = (k, ms) => {
        if (VOX[k] && window.SPRITES['pair_cop_' + k]) { sfx(VOX[k], 0.55); ms = Math.max(ms, 1300); }
        return pair('pair_cop_' + k, ms, SHELF, TORSO[k]);
      };
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
      await say('alan_cuff_2'); sfx('handcuff_click', 0.8);
      // later: the two of them in bed, Alan smoking, the officer dozing on his shoulder; cap and cuffs on the bedpost
      if (G.image('still:still_cop_bed')) {
        await G.fade(true);
        await G.showStill('still_cop_bed', async () => {
          await G.fade(false);
          sfx('v_cop_whimper', 0.5); await T(900);
          await G.say('narr_cuff', { offscreen: true }); // over the painting, only the narrator
          sfx('v_alan_chuckle', 0.45); await T(1200);
        }, { zoom: [1.0, 1.1], pan: [[0.45, 0.5], [0.55, 0.5]], keep: true });
      }
      }
      await G.fade(true); G.endStill();
      await copAfter();
    });
    Sound.cue(null);
  };

  S.visitGuitar = async function () {
    F().visit_guitar = true;
    await G.busy(async () => {
      await arrive('guitar');
      await beats(['swoon', 'guitar_visit_1'], ['fluster', 'ines_visit_guitar'], ['swoon', 'guitar_visit_2']);
      // always: Amália's message (the box was hers)
      await say('duarte_business', 'duarte_message'); F().amalia_box = true;
      if (await choose([['Show him the piano.', 'yes'], ['Another time, Duarte.', 'no']]) !== 'yes') {
      // declined: he plays her song on his stool, shrugs, and leaves the words behind
      const gv = G.npc('npc_guitar');
      // the opening bars of Amália's fado, the guitarra alone (the synth tune if the recording is missing)
      // his melody on the stool, under the empty-tavern tune (his own song is only ever for Alan's room)
      Sound.cue('tavern_night', { sticky: true });
      const play = ['npc_guitar', 'npc_guitar_b'].filter(k => window.SPRITES[k]);
      let pi = 0; const iv = gv && play.length ? setInterval(() => { gv.pose = play[pi++ % play.length]; }, window.FAST ? 20 : 900) : null;
      try { await T(window.FAST ? 20 : 6000); await G.say('narr_melody', { offscreen: true }); await T(window.FAST ? 20 : 3000); }
      finally { if (iv) clearInterval(iv); if (gv) gv.pose = null; }
      Sound.cue(null);
      await say('duarte_shrug', 'duarte_lyrics_stool');
      if (gv) F().lyrics_at = [Math.round(gv.x), Math.round(gv.y)]; F().lyrics_on_stool = true;
      if (gv && !window.FAST) await gv.walkTo(1370, 700);
      sfx('door'); visitor = null; G.refreshNpcs(); G.autosave();
      return;
      }
      F().duarte_scene = true;
      Sound.cue('alan_theme', { sticky: true }); // upstairs: Alan's theme, until Duarte picks up the guitar
      // Alan scarlet; Duarte perfectly at ease
      await beats([null, 'alan_visit_guitar'], ['fluster', 'ines_visit_after']);
      await say('ines_drowning'); await say('alan_schedule'); // the river keeps a timetable
      const disc = S.discreet(); // Discreet: straight from the arrival to the afterwards
      const v = disc ? await upstairsDark('guitar') : await upstairs('guitar', [660, 645, 'w']);
      if (!disc) { await say('guitar_room_1', 'alan_room_guitar_1');
      // the same energy from both sides: shirts off together, and a race for the bed
      pairV = v; // Duarte on the left, Alan on the right: Alan steps into the painting, Duarte stays put
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
      }
      await G.fade(true); G.endStill();
      await afterwards('guitar_floor', [
        [1, 'guitar_room_3'], [2], [3, 'alan_room_guitar_2'], [4],
        // at the door: the song, written out (a keepsake)
        [async () => { await say('duarte_lyrics', 'alan_lyrics', 'duarte_lyrics2'); if (!G.has('lyrics_sheet')) { give('lyrics_sheet'); sfx('page'); } }],
      ], 'guitar_after_1');
    });
    Sound.cue(null);
  };

  // back with the coffee Duarte asked for, Alan finds him downstairs being charming to Inês.
  // A flicker of jealousy; Duarte, who never stays for a scene he didn't start, strolls out.
  S.duarteInes = async function () {
    if (!F().duarte_scene || F().duarte_ines) return;
    F().duarte_ines = true;
    await G.busy(async () => {
    const p = G.player, ines = G.npc('ines');
    visitor = 'guitar'; G.refreshNpcs(true);
    const d = G.npc('npc_guitar');
    if (d) { d.x = 760; d.y = 600; d.dir = 'w'; }
    if (ines) { ines.pose = null; ines.dir = 'e'; }
    p.x = 1080; p.y = 700; p.dir = 'w'; p.pose = window.SPRITES.alan_coffees ? 'coffees' : null; // just in from the street door
    await G.fade(false);
    const face = (k, f) => async () => { if (ines && ines.c.frames.poses && ines.c.frames.poses[k]) ines.pose = k; await f(); if (ines) ines.pose = null; };
    await say('guitar_ines_1');
    await face('amused', () => say('ines_duarte_1'))();
    await say('guitar_ines_2');
    await face('teasing', () => say('ines_duarte_2'))();
    sfx('door', 0.3); // he has been standing in the doorway long enough
    const cups = p.pose; p.pose = null; await p.walkTo(930, 680); p.dir = 'w'; p.pose = cups;
    await say('alan_duarte_ines_1');
    await say('guitar_ines_3');
    if (d && !window.FAST) { await d.walkTo(1370, 700); }
    sfx('door'); visitor = null; G.refreshNpcs();
    await G.wait(window.FAST ? 20 : 900);
    await face('amused', () => say('ines_duarte_3'))();
    p.pose = null;
    await say('alan_duarte_ines_2');
    await face('fond', () => say('ines_duarte_4'))();
    await say('alan_duarte_ines_3');
    await face('laugh', () => say('ines_duarte_5'))();
    });
  };

  // an hour later: Alan left the handcuff key on the counter with everything else in his pockets.
  // Inês found it, went upstairs and let the officer go, and now she has a word with him.
  // She doesn't judge; he insists it was a prank on a friend.
  S.inesKey = async function () {
    F().ines_key = true;
    const p = G.player, ines = G.npc('ines');
    await G.fade(true);
    // the hour he took over his cigarettes, painted: fog, azulejos, a match cupped in his hands
    if (G.image('still:still_cigarettes')) {
      await G.showStill('still_cigarettes', async () => { await G.fade(false); await G.say('narr_key_later', { offscreen: true }); },
        { zoom: [1.02, 1.1], pan: [[0.45, 0.5], [0.6, 0.42]], keep: true });
      await G.fade(true); G.endStill();
    } else await G.say('narr_key_later', { offscreen: true });
    p.x = 760; p.y = 612; p.dir = 'w'; p.pose = null;
    await G.fade(false);
    const face = (k, f) => async () => {
      const P = ines && ines.c.frames.poses;
      if (P && !P[k] && window.SPRITES['ines_' + k]) P[k] = 'ines_' + k;
      if (P && P[k]) ines.pose = k; await f(); if (ines) ines.pose = null;
    };
    const fluster = async k => { p.pose = 'fluster'; await say(k); p.pose = null; };
    await G.busy(async () => {
      if (ines) ines.dir = 'e';
      await face('deadpan', () => say('ines_key_1'))();
      await fluster('alan_key_deny_1');
      await face('eyeroll', () => say('ines_key_2'))();
      await fluster('alan_key_deny_2');
      await face('sympathetic', () => say('ines_key_3'))();
      await face('worried', () => say('ines_key_4'))();
      await T(700);
      p.dir = 'e'; await say('alan_key_deny_3'); // he can't look at her
      await face('write', () => say('ines_key_5'))();
      sfx('stairs', 0.5); await T(600);
    });
    G.autosave();
  };

  // ---------------------------------------------------------------- "Meu Lindo Guarda-Livros"
  // The accept path only: afterwards, on the floor of Alan's room, Duarte plays him the song he
  // wrote about him. Diegetic: the score stops, nothing ducks it, it plays in full, and he plays
  // along to it (his frames step with the recording's loudness, the warp sways him with it).
  // Captions in English, a line at a time, timed from the recording (docs/MUSIC.md).
  const SONG_CHORUS = [
    "Oh, my handsome bookkeeper, close the shop up slowly,",
    "for I've brought my passion with no receipt to sign.",
    "If the artist tunes his guitar, there's a terrible to-do:",
    "he wants to touch his fingers; I want his heart.",
  ];
  S.GUARDA_LIVROS_LYRICS = [
    [12.2, "The accountant of Rua do Sol"],
    [16.5, "has ledger eyes that never get it wrong;"],
    [21.0, "he balances my spending, checks my accounts,"],
    [25.2, "and I end up owing him a kiss, interest-free."],
    [29.0, ''],
    [29.8, SONG_CHORUS[0]], [34.4, SONG_CHORUS[1]], [38.7, SONG_CHORUS[2]], [42.8, SONG_CHORUS[3]],
    [48.5, ''],
    [50.4, "The musician, poor thing, has ink on his hand,"],
    [54.8, "and swears he's painting a portrait of his love;"],
    [59.1, "but when he smiles, he loses his way,"],
    [63.2, "and out comes a sonnet that doesn't add up."],
    [67.2, ''],
    [67.9, SONG_CHORUS[0]], [72.8, SONG_CHORUS[1]], [77.0, SONG_CHORUS[2]], [81.2, SONG_CHORUS[3]],
    [86.2, ''],
    [87.2, "One asks him for a portrait, another asks for the key;"],
    [91.5, "the handsome boy works out who pays the best."],
    [95.6, "I say: “My darling, don't be so serious:"],
    [100.0, "some accounts close better in private, my love.”"],
    [105.8, ''],
    [111.8, "Oh, my handsome bookkeeper, leave the account open,"],
    [117.1, "for I've a few sums I'd rather settle myself."],
    [121.2, "If the artist knocks at the door, let him wait in the hall:"],
    [125.2, "today the book is mine… and I've come to collect love."],
    [129.3, ''],
    [129.9, "Close the shop, my dear, but don't close your smile;"],
    [138.0, "there's a balance between us that's paid with good sense…"],
    [146.6, "or with no sense at all."],
    [150.0, ''],
  ];
  S.duarteSong = async function () {
    const d = G.npc('npc_guitar');
    Sound.cue(null); // the love scene's music gives way; after the song, the room's own, quietly
    const song = Sound.playSong(Sound.trackUrl('meu_lindo_guarda_livros'), 1.5); // up front, where the voices sit
    G.card('My Handsome Bookkeeper', '“Meu Lindo Guarda-Livros”  ·  Duarte', 4200); // (not awaited: the guitar has started)
    // his playing: the floor frames advance with the music, faster as it swells, held in the quiet bars
    const frames = ['guitar_floor1', 'guitar_floor3', 'guitar_floor2', 'guitar_floor4'].filter(k => window.SPRITES[k]);
    let ph = 0, fi = 0;
    if (d) d.perform = 1;
    const iv = d && frames.length ? setInterval(() => {
      const lv = Sound.songLevel();
      ph += 0.04 + lv * 0.5;
      if (ph >= 1) { ph = 0; fi = (fi + 1) % frames.length; d.pose = frames[fi]; }
    }, window.FAST ? 20 : 120) : null;
    try { await G.lyrics(song, S.GUARDA_LIVROS_LYRICS, 'guitar'); }
    finally { if (iv) clearInterval(iv); if (d) { d.perform = 0; d.pose = null; } }
    await T(900);
  };

  S.ITEMS.lyrics_sheet = { name: "Duarte's lyrics", look: () => S.readLyrics() };
  S.teixeiraKey = async function () {
    await G.fade(true);
    visitor = 'cop'; G.refreshNpcs();
    const v = G.npc('npc_phone'); if (v) { v.x = 300; v.y = 640; v.dir = 'e'; }
    G.player.dir = 'w';
    await G.fade(false);
    await say('teixeira_bye'); if (!G.has('fkey')) give('fkey'); // he gave Alan the Ferreira key when he arrived: now he just slips out
    G.player.dir = 'w'; await say('alan_teixeira_sorry'); // (B8)
    if (v && !window.FAST) await v.walkTo(1370, 700);
    sfx('door'); visitor = null; G.refreshNpcs(); G.autosave();
  };
  S.setVisitor = v => { visitor = v; G.refreshNpcs(true); }; // for testing

  // A14: the officer's own frames in the shop are shown as painted (no grey rim from the window light);
  // in a pair frame the speech bubble goes over the pair, not into the narrator's box
  if (!ROOMS.shop.unlit) ROOMS.shop.unlit = /^cop_/;
  G.pairSpeaker = k => /^pair_cop_/.test(k) ? 'phone' : /^pair_guitar_/.test(k) ? 'guitar' : null;

  // the rolling gag: everyone who saw Alan with the officer or Duarte has something to say about it,
  // and Alan denies everything. One remark per conversation, each said once, in order.
  const GOSSIP = {
    ines: [['ines_gossip_1', 'alan_deny_ines_1', 'teixeira_scene'], ['ines_gossip_2', 'alan_deny_ines_2', 'duarte_scene'], ['ines_gossip_3', 'alan_deny_ines_3', 'duarte_ines'], // the stairs-rent remark waits for Duarte's visit to the shop
      ['ines_gossip_4', 'alan_deny_ines_4', 'vasco_thursday']],
    celeste: [['celeste_gossip_1', 'alan_deny_celeste_1']], // her Duarte remark is retired: she's gone from the lavadouro by then
    amalia: [['amalia_gossip_1', 'alan_deny_amalia_1', 'duarte_scene'], ['amalia_gossip_2', 'alan_deny_amalia_2']],
    rui: [['rui_gossip_1b', 'alan_deny_rui_1', 'teixeira_scene'], ['rui_gossip_2', 'alan_deny_rui_2', 'teixeira_scene']],
    // Chapter III: the Sé's bell-ringer has noticed the curator (Tomás's "coming to Mass" is retired: they met this morning)
    abilio: [['abilio_gossip_1b', 'alan_deny_abilio_1', 'vasco_thursday']],
  };
  S.gossip = async function (who) {
    const said = F().gossip || (F().gossip = {});
    const next = (GOSSIP[who] || []).find(([line, , needs]) => !said[line] && (needs ? F()[needs] : F().teixeira_scene || F().duarte_scene));
    if (!next) return;
    said[next[0]] = true;
    await say(next[0]);
    G.player.pose = 'fluster'; await say(next[1]); G.player.pose = null;
  };

  // declined, Duarte leaves the song written out where his stool stood: a pick-up
  const sheetHere = () => F().lyrics_on_stool && !G.has('lyrics_sheet') && !F().lyrics_taken;
  ROOMS.shop.hotspots.push({ name: "Duarte's lyrics", get rect() { const [x, y] = F().lyrics_at || [640, 640]; return [x - 40, y - 30, 80, 40]; },
    get at() { const [x, y] = F().lyrics_at || [640, 640]; return [x + 70, Math.min(y + 10, 650)]; }, when: sheetHere,
    look: () => say('duarte_lyrics_stool'),
    take: async () => { F().lyrics_taken = true; give('lyrics_sheet'); sfx('page'); await S.readLyrics(); } });
  const prevAnim = ROOMS.shop.anim;
  ROOMS.shop.anim = function (g, t) {
    if (prevAnim) prevAnim.call(this, g, t);
    if (!sheetHere()) return;
    const [x, y] = F().lyrics_at || [640, 640];
    g.save(); g.translate(x, y - 8); g.rotate(-0.08);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(-22, -6, 46, 16);
    g.fillStyle = '#efe6cf'; g.fillRect(-24, -10, 46, 16);
    g.strokeStyle = 'rgba(60,50,90,0.6)'; g.lineWidth = 1;
    for (let i = -6; i <= 2; i += 4) { g.beginPath(); g.moveTo(-20, i); g.lineTo(14, i); g.stroke(); }
    g.restore();
  };

  // a visit happens the next time Alan walks in from the street with Inês minding the shop
  const prevEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (prevEnter) await prevEnter.call(this, entry);
    if (entry !== 'street' || F().ch >= 5 || !G.npc('ines') || !G.image('bg:bedroom')) return;
    // Teixeira brings the Ferreira key round in Chapter II, once the drawer is open;
    // Duarte comes at the end of Chapter III, while Inês steams the ledger (S.ch3End)
    if (F().ch === 2 && F().drawer_open && F().flirted_cop && !F().visit_cop) return S.visitCop();
  };
})();
