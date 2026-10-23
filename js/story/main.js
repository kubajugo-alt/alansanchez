// The Drowned Bell v2 — boot: shared effects, chapter hooks, the ?scene= previews, the content
// setting, the opening and new game, approved review frames, init.
(function () {
  const { G, F, say, ROOMS, joke, posed } = window.S;

  // ---------------------------------------------------------------- shared painted effects
  S.dayClouds = FX.makeClouds(11, '255,250,255', 24);
  S.nightClouds = FX.makeClouds(23, '40,48,80', 30);
  S.windowFog = function (g, t, rect, rgb, a) {
    g.save(); g.beginPath(); g.rect(...rect); g.clip();
    for (let i = 0; i < 6; i++) {
      const x = rect[0] + ((t * (6 + i * 2) + i * 140) % (rect[2] + 300)) - 150, y = rect[1] + rect[3] * (0.25 + 0.13 * i);
      const gr = g.createRadialGradient(x, y, 0, x, y, 120);
      gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(x - 120, y - 120, 240, 240); // the whole puff (a 320x160 box cut it flat at +-80 px, in steps)
    }
    g.restore();
  };

  // ---------------------------------------------------------------- chapter hooks in the shop
  const shopEnter = ROOMS.shop.enter;
  // a chapter end due in the shop (checked afresh, not read from ch2_ready: some last clues, like the case file used on
  // Celeste, never set it); null when there is none
  const shopChapterEnd = () => {
    if (F().ch === 2 && !F().ch2_done) { const end = S.checkCh2(); if (end) return end; }
    if (F().ch === 3 && F().has_tongue && F().founder_order && !F().ch3_done) return S.ch3End();
    return null;
  };
  ROOMS.shop.enter = async function (entry) {
    const end = shopChapterEnd(); if (end) return end;
    if (shopEnter) return shopEnter.call(this, entry);
  };
  // Continue into the shop skips its way-in (the scene is already set), but a chapter end due there still plays
  ROOMS.shop.resume = () => shopChapterEnd();

  // ---------------------------------------------------------------- art the engine preloads
  window.STILLS = ['still_intro', 'still_madragoa', 'still_maria_sleep', 'still_maria_tile', 'still_maria_list', 'still_maria_water', 'still_maria_dawn',
    'still_newspaper', 'still_1755', 'still_1955_a', 'still_1955_b', 'still_1955_c', 'still_city_morning', 'still_drawer', 'still_shop_after',
    'still_phone', 'still_amalia_box', 'still_tavern_full', 'still_quay_sweater', 'still_abilio_ring', 'still_shelf', 'still_ze_kiss', 'still_ze_bunk', 'still_cop_shelf', 'still_guitar_bed', 'still_cop_bed', 'still_cigarettes'].concat(window.EXTRA_STILLS || []);
  window.CLOSEUPS = ['paper_aged', 'close_photo1934', 'close_porthole', 'close_tideclock', 'close_bronze', 'close_clocks', 'close_drawerlock', 'close_recorder', 'close_recorder_reels'];

  // ---------------------------------------------------------------- new game
  // preview links: ?scene=bath | cop | guitar | celeste | visitcop | copbed | visitguitar | romance | finale jumps straight to that scene (no autosave)
  const PREVIEW = {
    // the walk lab (js/walklab.js): walk cycles side by side, measured; nothing in it changes the game
    walklab: { flags: { ch: 2 }, room: 'street', pos: [200, 670, 'e'], run: () => S.walkLab && S.walkLab() },
    // the skeletal-rig trial (review screen, ?rig=0 / ?rig=1 side by side): he walks the room, stops, talks, stands
    rigtest: { flags: { ch: 1 }, room: 'police', pos: [300, 690, 'e'], run: async () => {
      const p = G.player;
      const q = new URLSearchParams(location.search);
      if (q.has('mute')) Sound.mute(); // the left of the pair stays quiet (nothing saved)
      const vasco = q.get('who') === 'vasco'; // Vasco's walk instead (review: walk cycles)
      if (vasco) p.ch = 'vasco';
      if (q.get('walk') === '6') { // the walk without the passing frame (review: walk cycles)
        S.CHARS.alan.frames.walk = ['alan_walkA', 'alan_walkDown', 'alan_walkUp', 'alan_walkB', 'alan_walkDown', 'alan_walkUp'];
        for (const c of Object.values(S.CHARS)) if (c.frames && c.frames.walk) S.walkTiming(c.frames); // step lengths from S.WALK_PLANT, where a cycle has them
      }
      for (let i = 0; i < (window.FAST ? 1 : 20); i++) { // once in the tests, on a loop for the eye
        await p.walkTo(980, 690); await G.wait(1800); if (!vasco) await say('alan_water'); await G.wait(3500);
        await p.walkTo(300, 690); await G.wait(2600);
      }
    } },
    bath: { flags: { ch: 2, met_celeste: true }, room: 'lavadouro', pos: [800, 640, 'e'], run: () => S.bathEgg() },
    cop: { flags: { ch: 1 }, room: 'police', pos: [420, 690, 'w'], run: () => S.flirtCop() },
    // the Judiciária with the Inspector out and Teixeira guarding the evidence (the flirt, then the sketch)
    copguard: { flags: { ch: 1, metRui: true, ruiMurders: true, saw_list: true, rui_out: true }, room: 'police', pos: [700, 660, 'e'], run: () => { G.giveItem('notebook', true); return S.flirtCop(); } },
    // ...the flirt done: Alan draws the tile and the Inspector walks back in on him and Teixeira
    copreturn: { flags: { ch: 1, metRui: true, ruiMurders: true, saw_list: true, rui_out: true, teixeira_step: 3, teixeira_wall: true }, room: 'police', pos: [650, 640, 'n'], run: async () => {
      await G.busy(async () => { F().sketched_tile = true; G.giveItem('sketch', true); await S.ruiReturns(); }); } },
    // Amália's fado (the recorded "O Sino Afogado", with captions)
    fado: { flags: { ch: 1, askedSong: true, duarte_flirt: true, flirted_guitar: true, saw_photo: true, knows_brotherhood: true }, room: 'tavern', pos: [860, 640, 'e'], run: () => { G.giveItem('ginja'); return S.giveGinja(); } },
    // Maria Coutinho's last night (the paintings; the staged room if they are missing)
    coldopen: { flags: { ch: 1 }, room: 'shop', pos: [815, 616, 'e'], run: async () => {
      await G.busy(async () => { if (!(await S.mariaPaintings())) await S.coldOpen(); });
      G.endStill();
      await G.fade(false);
    } },
    // the whole opening, from the fog over Lisbon to Inês waking Alan
    intro: { flags: { ch: 1, clock: '11:00' }, room: 'shop', pos: [815, 616, 'e'], run: () => opening() },
    romance: { flags: { ch: 4, ze_awake: true, ze_believes: true, ze_in_cabin: true, ze_saved: true }, room: 'cabin', pos: [560, 640, 'e'], run: () => S.romance() },
    // the ending: free Inês, light the bell, then the last strike with Lacerda already up the walkway (the race is skipped)
    finale: { flags: { ch: 5, tomas_confessed: true }, room: 'cistern', pos: [520, 640, 'e'], run: async () => {
      G.giveItem('tongue', true); G.giveItem('lantern', true); G.giveItem('knife', true);
      await S.cutRopes(); await S.giveLantern();
      Object.assign(F(), { blood: true, struck: ['sanches', 'coutinho', 'bastos'], strikes: 3, water: 3, lac_stage: 3 });
      const lac = G.npc('lacerda'); if (lac) { lac.x = 548; lac.y = 446; lac.def.fixedDir = false; lac.dir = 'e'; }
      await G.wait(window.FAST ? 20 : 700);
      await S.strike('ferreira');
    } },
    // the whole rite from the first note: the race along the walkway, the living water, the end
    finalerace: { flags: { ch: 5, tomas_confessed: true }, room: 'cistern', pos: [520, 640, 'e'], run: async () => {
      G.giveItem('tongue', true); G.giveItem('lantern', true); G.giveItem('knife', true); G.giveItem('ledger', true);
      await S.giveLedger();
      await S.cutRopes(); await S.giveLantern(); await S.cutPalm();
      for (const id of ['sanches', 'coutinho', 'bastos', 'ferreira']) { await G.wait(window.FAST ? 20 : 1200); await S.strike(id); }
    } },
    // the quay gossip (Rosa and the old mender) and Lacerda's threat about Vasco
    bench: { flags: { ch: 2, heard_machine: true }, room: 'street', pos: [860, 640, 'e'], run: () => S.benchTalk() },
    ineskey: { flags: { ch: 3, teixeira_scene: true, visit_cop: true }, room: 'shop', pos: [760, 612, 'w'], run: async () => { await S.inesKey(); await S.teixeiraKey(); } },
    duarteines: { flags: { ch: 4, duarte_scene: true, flirted_guitar: true, visit_guitar: true, ch3_done: true }, room: 'shop', pos: [1080, 700, 'w'], run: () => S.duarteInes() },
    quayfish: { flags: { ch: 4, harbour: true, cais_entered: true, celeste_after: true, ze_awake: true, ze_believes: true, ze_in_cabin: true, ze_saved: true, ze_romance: true }, room: 'cais', pos: [540, 650, 'w'], run: () => S.fishTalk() }, // Rosa's dig comes only after Zé's boat
    // the washhouse after the bath: the woman under the sheets, and Celeste shutting her down
    laundry: { flags: { ch: 2, met_celeste: true, bathed: true }, room: 'lavadouro', pos: [800, 650, 'w'], run: () => S.laundryRemark() },
    lacthreat: { flags: { ch: 3, vasco_thursday: true }, room: 'antiques', pos: [700, 650, 'e'], run: () => S.talkLacerda() },
    guitar: { flags: { ch: 1, heard_song: true }, room: 'tavern', pos: [812, 648, 'w'], run: () => S.flirtGuitar() },
    // the washhouse: Alan's first meeting with Celeste (the sheet, then her questions)
    celeste: { flags: { ch: 2, heard_machine: true }, room: 'lavadouro', pos: [760, 650, 'w'], run: async () => { await S.talkCeleste(); await S.wringSheet(); } },
    // the rooms after the visits: the officer gone from the station, Duarte gone from the tavern
    stationafter: { flags: { ch: 2, visit_cop: true, flirted_cop: true }, room: 'police', pos: [560, 680, 'w'], run: async () => {} },
    tavernafter: { flags: { ch: 2, visit_guitar: true, flirted_guitar: true }, room: 'tavern', pos: [720, 660, 'w'], run: async () => {} },
    // the visits: Teixeira's, walking into the shop from the street once the drawer is open (Inês minding the shop);
    // Duarte's, while Inês steams the ledger at the end of Chapter III (S.ch3End)
    copbed: { flags: { ch: 2, heard_machine: true, flirted_cop: true, drawer_open: true, visit_cop: true, teixeira_scene: true }, room: 'bedroom', pos: [640, 650, 'e'], run: () => S.copAfter() },
    visitcop: { flags: { ch: 2, heard_machine: true, flirted_cop: true, drawer_open: true }, room: 'street', pos: [640, 660, 'e'], run: () => G.goRoom('shop', 'street') },
    visitguitar: { flags: { ch: 3, heard_machine: true, flirted_guitar: true, visit_cop: true, ch3_done: true, steaming: true, pages_steaming: true }, room: 'shop', pos: [716, 618, 'w'], run: () => S.visitGuitar() },
    // the Sé: the museum with Inês, and the cloister with the dig questions done (Vasco about to show Alan the pit)
    semuseum: { flags: { ch: 1, heard_machine: true, knows_brotherhood: true, ines_plan: true }, room: 'map', pos: [640, 660, 'e'], run: () => G.goRoom('se_museum', 'map') },
    sepit: { flags: { ch: 1, heard_machine: true, knows_brotherhood: true, ines_plan: true, se_visited: true, se_exhibits: 4, se_plan_on: true, saw_pit: true, saw_marks: true, saw_frags: true, met_vasco: true },
      room: 'se_cloister', pos: [1000, 650, 'w'], run: () => S.talkVasco() },
    // in the pit with the key tossed: the five exchanges, the kiss, the reserve, Thursday's card
    sepitgame: { flags: { ch: 1, heard_machine: true, knows_brotherhood: true, ines_plan: true, se_visited: true, se_exhibits: 4, se_plan_on: true, saw_pit: true, saw_marks: true, saw_frags: true, met_vasco: true, dig_questions: 3, in_pit: true, lanyard_taken: true, key_tossed: true },
      room: 'se_cloister', pos: [770, 642, 'e'], run: () => { const v = G.npc('vasco'); if (v) { v.x = 880; v.y = 644; v.dir = 'w'; } return S.pitGame(); } },
    // Chapter III: on the way up the tower, Vasco climbs out of the pit with the fragment
    sech3: { flags: { ch: 3, heard_machine: true, knows_brotherhood: true, ines_plan: true, heist_done: true, reserve_raided: true, vasco_thursday: true, decoded: true, chose_chiado: true },
      room: 'map', pos: [640, 660, 'e'], run: () => G.goRoom('se_cloister', 'map') },
    // Thursday morning: the coffees, the Romans
    // Prof. Bastos's flat, Chapter II (js/story/bastos.js): straight in from the map, Inês along; bastosunlock: Alan brings
    // Ferreira's spare to the shop and Inês names him
    bastos: { flags: { ch: 2, heard_machine: true, drawer_open: true, bastos_known: true }, room: 'map', pos: [640, 660, 'e'], run: () => G.goRoom('bastos', 'map') },
    // the lecture tapes straight away (the collection back on its shelves, the case open)
    bastostapes: { flags: { ch: 2, heard_machine: true, drawer_open: true, bastos_known: true, bastos_entered: true, bastos_shelves: true, bastos_case_open: true, bastos_rec_seen: true,
      bastos_m: ['canaria', 'ys', 'ran', 'jewels', 'gilgamesh', 'matsya', 'deucalion', 'iemanja'] }, room: 'bastos', pos: [715, 450, 'n'], run: () => { S.bastosRecorder(); } }, // (not awaited: the close-up waits for the player)
    bastosunlock: { flags: { ch: 2, heard_machine: true, drawer_open: true, vkeyTaken: true, bkeyTaken: true }, room: 'street', pos: [640, 660, 'e'], run: () => { G.giveItem('bkey', true); return G.goRoom('shop', 'street'); } },
    thursday: { flags: { ch: 5, vasco_thursday: true, dawn: true }, room: 'se_cloister', pos: [260, 650, 'e'], run: () => S.thursday() },
    // Chapter III, the twin: Abílio reads the sketch of Lacerda's tongue; Vasco takes Alan down to the reserve (the near-kiss);
    // the swap at Lacerda's (ask about the music box, then the vitrine key and the twin on the case)
    abiliosketch: { flags: { ch: 3, decoded: true, chose_chiado: true, se_entered: true, abilio_writing: true, heard_blood: true, tongue_sketched: true }, room: 'se_tower', pos: [900, 640, 'e'], run: () => S.writeAbilio() },
    vascostore: { flags: { ch: 3, heard_machine: true, knows_brotherhood: true, ines_plan: true, heist_done: true, reserve_raided: true, vasco_thursday: true, vasco_cameo: true, decoded: true, chose_chiado: true, tongue_sketched: true, knows_twin: true },
      room: 'se_cloister', pos: [900, 650, 'e'], run: () => S.talkVasco() },
    twinswap: { flags: { ch: 3, decoded: true, chose_chiado: true, lac_suit_seen: true, saw_box: true, box_recognised: true, case_known: true, saw_case: true, tongue_sketched: true, knows_twin: true, twin_lent: true },
      room: 'antiques', pos: [700, 640, 'e'], run: () => { G.giveItem('twin', true); G.giveItem('vkey', true); return S.talkLacerda(); } },
    // the end of the game: Thursday's debt paid, and downstairs to the reserve (the last romance)
    vascolove: { flags: { ch: 5, vasco_thursday: true, twin_lent: true, heist_done: true, dawn: true, thursday: true }, room: 'se_cloister', pos: [700, 640, 'e'], run: () => S.vascoLove() },
  };
  // the chapter transitions (js/story/transitions.js): ?scene=tr1 … tr4 play the paintings and the next chapter card,
  // tr5 the end of chapter V (?scene=fado plays the song with its painting slideshow)
  [1, 2, 3, 4].forEach(n => { PREVIEW['tr' + n] = { flags: { ch: n }, room: 'shop', pos: [815, 616, 'e'], run: () => S.chapter(n + 1, 'narr_ch' + (n + 1) + '_card') }; });
  // the shop as it stands, nothing scripted: Inês goes about her jobs
  PREVIEW.shopjobs = { flags: { ch: 2, heard_machine: true }, room: 'shop', pos: [236, 712, 'e'], run: async () => {} };
  PREVIEW.tr5 = { flags: { ch: 5 }, room: 'shop', pos: [815, 616, 'e'], run: async () => { await S.transition(5, { toBlack: true }); await G.fade(false); } };
  async function preview(k) {
    const P = PREVIEW[k];
    G.giveItem('notebook', true); Object.assign(F(), P.flags);
    await G.goRoom(P.room, null, { noEnter: true, instant: true, pos: P.pos });
    await G.wait(800);
    await P.run();
  }
  // ---------------------------------------------------------------- content: Full or Discreet
  // Content: Full or Discreet. Asked once, on the first new game; changeable any time from the menu.
  const contentLabel = () => 'Content: ' + (S.discreet() ? 'Discreet' : 'Full');
  (function settingsButton() {
    const menu = document.querySelector('#menu'); if (!menu || document.querySelector('#opt-content')) return;
    const b = document.createElement('button'); b.id = 'opt-content'; b.textContent = contentLabel();
    b.onclick = e => { e.stopPropagation(); S.setContent(S.discreet() ? 'full' : 'discreet'); b.textContent = contentLabel(); G.toast(contentLabel()); };
    menu.insertBefore(b, document.querySelector('#opt-save'));
  })();
  function askContent() {
    return new Promise(resolve => {
      const box = document.createElement('div');
      box.id = 'content-choice';
      box.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.82);z-index:60;font-family:inherit';
      box.innerHTML = `<div style="max-width:560px;padding:28px 34px;border:1px solid #a88a52;background:#16120c;color:#eadcc0;text-align:center;line-height:1.5">
        <h2 style="margin:0 0 .5em;font-weight:normal;letter-spacing:.06em">Before we begin</h2>
        <p>Alan's love life is part of this story. <b>Full</b> plays the romantic scenes as written. <b>Discreet</b> skips from each build-up straight to its afterwards and hides those paintings; every joke and every clue stays.</p>
        <p style="font-size:.85em;opacity:.75">You can change this at any time from the menu.</p>
        <p><button data-v="full" style="margin:6px 10px;padding:8px 22px">Full</button><button data-v="discreet" style="margin:6px 10px;padding:8px 22px">Discreet</button></p></div>`;
      box.querySelectorAll('button').forEach(b => b.onclick = e => {
        e.stopPropagation();
        S.setContent(b.dataset.v);
        const o = document.querySelector('#opt-content');
        if (o) o.textContent = contentLabel();
        box.remove();
        resolve();
      });
      (document.querySelector('#game') || document.body).appendChild(box);
    });
  }
  // ---------------------------------------------------------------- the opening
  // The opening: the fog over Lisbon, Maria Coutinho's last night in paintings (the old staged
  // room only if the paintings are missing), the drownings in the paper, the sleeping bookseller,
  // the chapter card, the shop. No bell and no founder names before the card.
  S.CHARS.alan.frames.poses.yawn = 'alan_yawn'; S.CHARS.alan.frames.poses.stretch = 'alan_stretch'; // waking up
  const SHOP_IN = [235, 712, 'e']; // the foot of the stairs, front left of the shop
  async function opening() {
    await G.busy(async () => {
      await G.fade(true);
      if (window.Sound) Sound.ambience('street_night');
      Sound.cue({ id: 'main_theme', vol: 'low' }, { sticky: true }); // the paintings between chapters: the main theme, low
      await S.paint('still_intro', () => say('narr_intro_1'), { zoom: [1.0, 1.16], pan: [[0.4, 0.55], [0.6, 0.5]] });
      const painted = S.mariaPaintings && await S.mariaPaintings();
      if (!painted && S.coldOpen) await S.coldOpen(); // fallback: Madragoa, 04:01, staged in a room
      Sound.cue({ id: 'main_theme', vol: 'low' }, { sticky: true });
      if (S.introCity && G.hasArt('still:still_newspaper')) await S.introCity();
      else await S.paint('still_intro', async () => { await say('narr_intro_2'); await say('narr_intro_tiles'); }, { zoom: [1.08, 1.16], pan: [[0.55, 0.5], [0.6, 0.5]] });
      // the hook, over the fog again: the one man who should be awake
      await S.paint('still_intro', () => say('narr_intro_3'), { zoom: [1.1, 1.2], pan: [[0.6, 0.5], [0.66, 0.46]] });
      await G.fade(true);
      Sound.cue({ id: 'bell_motif', dur: 12, fade: 3 }, { sticky: true }); // as every chapter card
      await G.card('CHAPTER I', 'The Fog  ·  11:00', 3000);
    });
    // the shop without him: Inês calls up the stairs, Alan surfaces in his room and comes down yawning
    await G.goRoom('shop', null, { noEnter: true, instant: true, pos: SHOP_IN });
    G.player.visible = false;
    G.endStill();
    await G.fade(false);
    await G.busy(async () => {
      const p = G.player, T = ms => G.wait(window.FAST ? 20 : ms);
      const pose = k => { p.pose = S.CHARS.alan.frames.poses[k] && window.SPRITES[S.CHARS.alan.frames.poses[k]] ? k : null; };
      const ines = G.npc('ines'); if (ines) ines.dir = 'w';
      await T(900);
      await say('ines_wake_up');
      // a real yawn: the yawning frame and the sound together, then back to his own frames
      const yawn = async () => { pose('yawn'); S.sfx('yawn', 0.9); await T(1700); pose(null); };
      if (G.hasArt('bg:bedroom')) {
        await G.fade(true);
        await G.goRoom('bedroom', null, { instant: true, noEnter: true, noSave: true, pos: [800, 640, 'w'] }); // up beside the bed
        await G.fade(false);
        await T(400); await yawn();
        await say('alan_wake_up');               // talking frames, not the yawn
        await p.walkTo(-90, 705);                // out of the room to the stairs...
        S.sfx('stairs', 0.6); await T(900);      // ...and only then the stairs
        await G.fade(true);
        await G.goRoom('shop', null, { instant: true, noEnter: true, pos: [-90, 712, 'e'] }); // in from the stairs, off left
        await G.fade(false);
      } else { p.visible = true; await say('alan_wake_up'); }
      await p.walkTo(470, 640);
      // he yawns and stretches facing Inês, wherever her chores have taken her
      if (ines) { p.dir = ines.x > p.x ? 'e' : 'w'; ines.dir = ines.x > p.x ? 'w' : 'e'; }
      await yawn();
      await say('ines_wake_look');
      pose('stretch');
      await say('alan_wake_stretch');
      pose(null);
      await say('ines_intro_2', 'alan_intro_3', 'gag_ines_1', 'gag_alan_ines_1', 'ines_intro_3');
      await S.joke('alan_intro_4');
      await say('ines_intro_4');
    });
  }
  async function newGame() {
    const scene = new URLSearchParams(location.search).get('scene');
    if (!S.content() && !window.FAST && !scene) await askContent();
    if (PREVIEW[scene]) return preview(scene);
    G.giveItem('notebook', true);
    F().ch = 1; F().clock = '11:00';
    await opening();
    G.autosave();
  }

  window.Story = { newGame };
  document.getElementById('btn-new').onclick = () => G.begin(true);
  document.getElementById('btn-continue').onclick = () => G.begin(false);
  // ---------------------------------------------------------------- approved review frames
  // Gemini frames reach the game only once approved on the review screen (art/review/approvals.json;
  // a reviewer's own decisions, kept in their browser, preview here too)
  S.applyCandidate = (c, ok) => {
    if (c.meta) window.SPRITES[c.id] = Object.assign({ src: c.src }, c.meta);
    const F = S.CHARS[c.char].frames, W = c.wire || {};
    const live = k => !!window.SPRITES[k] && (!/_ib_/.test(k) || ok(k));
    if (W.walkStart != null && W.walkStart !== false) { // its place in the opening run (true: the first step); the run is kept in order
      const at = W.walkStart === true ? 1 : W.walkStart;
      F.walkStartRun = (F.walkStartRun || []).filter(r => r[1] !== c.id).concat([[at, c.id]]).sort((a, b) => a[0] - b[0]);
      F.walkStart = F.walkStartRun.map(r => r[1]);
    }
    if (W.walkSlot != null && c.walkAll) { // a slot of the 8-step walk (all or none: see loadApproved)
      F.walk = W.walkBase && F.walk.length !== W.walkBase.length ? W.walkBase.slice() : F.walk.slice();
      F.walk[W.walkSlot] = c.id;
    }
    if (W.walkStop) F.walkStop = c.id;
    if (W.inbetween) { F.inbetween = F.inbetween || {}; for (const [k, seq] of Object.entries(W.inbetween)) F.inbetween[k] = seq.filter(live); }
    if (W.poses) Object.assign(F.poses, W.poses);
    if (W.pairIb) {
      F.pairIb = F.pairIb || {};
      for (const [k, io] of Object.entries(W.pairIb)) {
        const d = F.pairIb[k] = F.pairIb[k] || {};
        for (const [w, seq] of Object.entries(io)) d[w] = seq.filter(live);
      }
    }
    if (W.set) {
      F.sets = F.sets || {};
      for (const [n, d] of Object.entries(W.set)) {
        const st = F.sets[n] = F.sets[n] || {};
        for (const [k, v] of Object.entries(d)) st[k] = Array.isArray(v) ? v.filter(live) : v;
      }
    }
  };
  async function loadApproved() {
    const get = async u => { try { const r = await fetch(u, { cache: 'no-cache' }); return r.ok ? await r.json() : null; } catch (e) { return null; } };
    const C = await get('art/review/candidates.json'), A = await get('art/review/approvals.json') || {};
    let mine = {}; try { mine = JSON.parse(localStorage.getItem('review-approvals') || '{}'); } catch (e) { /* private mode */ }
    const dec = Object.assign({}, A, mine);
    S.WALK_ORIGINAL = { alan: S.CHARS.alan.frames.walk.slice() }; // the first painted cycle, before any approved walk replaces it
    const walkNew = new URLSearchParams(location.search).get('walk') === 'new'; // the review screen's walk comparison: the new walk, approved or not
    const ok = id => !!(dec[id] && dec[id].decision === 'approved') || (walkNew && /^(alan|vasco)_walk_/.test(id));
    S.REVIEW = { candidates: (C && C.candidates) || [], decisions: dec, saved: A };
    // a character's new walk goes in whole or not at all: its frames mixed with the old ones lose the alternating legs
    const walkAll = ch => { const w = S.REVIEW.candidates.filter(c => c.char === ch && c.wire && c.wire.walkSlot != null); return w.length > 0 && w.every(c => ok(c.id)); };
    for (const c of S.REVIEW.candidates) if (ok(c.id)) S.applyCandidate(c.wire && c.wire.walkSlot != null ? Object.assign({ walkAll: walkAll(c.char) }, c) : c, ok);
    // ?walk=a: the walk plan's step A, for review (not the game's default): Alan back on his first 8-painting cycle,
    // moving at a steady speed (no foot lock), every painting held alike, cut between them, the bob once per step
    if (new URLSearchParams(location.search).get('walk') === 'a') { window.WALK = S.WALK_A; S.CHARS.alan.frames.walk = S.WALK_ORIGINAL.alan.slice(); }
    if (new URLSearchParams(location.search).get('walk') === 'fix') window.WALK = S.WALK_FIX; // the engine fix alone, today's frames
    for (const c of Object.values(S.CHARS)) if (c.frames && c.frames.walk) S.walkTiming(c.frames); // step lengths from S.WALK_PLANT, where a cycle has them
    // the repainted bath scene (ch2.js S.bathNew), approved 2026-10-21: its frames (alan_bn_*) are ordinary sprites since
    // 22 Oct (art/sprites, js/sprites.js); the first version and its ?bath=old switch are gone
    {
      S.BATH_NEW = true;
      // ...with the tank built taller (art/review/bg/lavadouro_tall_*.jpg: Canva's taller tank pasted into the painting,
      // the rest of the room as it was; Celeste's towel on its corner, smaller, gone once Alan has taken it):
      // the room's picture, and the tank's outline that hides whoever is behind it
      const R = S.ROOMS.lavadouro, occ = R && (R.occluders || []).find(o => o.y === 680);
      if (R && occ) {
        const T0 = '../review/bg/lavadouro_tall_smalltowel', T1 = '../review/bg/lavadouro_tall_notowel';
        R.bg = T0; R.bgs = (R.bgs || []).concat(T1); R.bgFn = () => S.bathTowelTaken ? T1 : T0; R.depth = 'lavadouro_depth';
        occ.polys = [[[842, 401], [1000, 401], [1250, 409], [1280, 419], [1280, 692], [876, 692], [862, 666], [843, 640]]];
        // its edge on the floor, for who is in front of it: the left wall's foot, from the back corner (843, 563) to the
        // front one (876, 692), then the front wall along y 692; whoever stands left of the wall is in front of it
        occ.base = [[843, 563], [876, 692]];
        // the back basins' outline stops where the taller tank begins (past x 842 it would cover Alan in the water)
        const bas = R.occluders.find(o => o.y === 500); if (bas) bas.polys = [[[160, 383], [300, 375], [842, 375], [842, 484], [160, 484]]];
        S.BATH_TALL = true;
      }
    }
    // Duarte's rewritten upstairs scene (visits.js S.visitGuitar), approved 2026-10-21: its frames are ordinary sprites since
    // 22 Oct; the ?duarte=old switch is gone
    {
      S.DUARTE_NEW = true;
      window.STILLS = (window.STILLS || []).concat(['../review/stills/still_duarte_bed_kiss', '../review/stills/still_duarte_bed_laugh']);
    }
    // the sound pass (docs/SOUND.md, js/audio.js), approved 2026-10-21 (its ?sound=old switch is gone). Three rooms lost their ambience and
    // floor to a comment that swallowed them (the cistern, the quay, the deck); the cabin gets its own bed (timbers and
    // the hull) in place of the deck's; the boat's planks sound like a deck; Alan's room and the tavern at night get theirs
    {
      const R = S.ROOMS, set = (id, o) => { if (R[id]) Object.assign(R[id], o); };
      set('cistern', { ambience: () => F().won ? 'cistern_calm' : 'cistern', floor: 'wet' });
      set('cais', { ambience: 'harbour', floor: 'cobble' });
      set('boat', { ambience: 'boat', floor: 'deck' });
      set('cabin', { ambience: 'cabin', floor: 'deck' });
      set('bedroom', { ambience: 'bedroom' });
      set('tavern', { ambience: () => F().ch >= 5 ? 'tavern_night' : 'tavern' });
    }
    // the walk lab measures the walk candidates too, approved or not: their sprites are registered (not wired in)
    if (new URLSearchParams(location.search).get('scene') === 'walklab')
      for (const c of S.REVIEW.candidates) if (c.meta && c.wire && c.wire.walkSlot != null && !window.SPRITES[c.id]) window.SPRITES[c.id] = Object.assign({ src: c.src }, c.meta);
  }
  // ---------------------------------------------------------------- start
  // the animation review screen: only with ?review in the address, never in normal play or the menus
  const review = new URLSearchParams(location.search).has('review');
  loadApproved().then(() => {
    if (review) { const sc = document.createElement('script'); sc.src = 'js/review.js?v=' + Date.now(); document.head.appendChild(sc); }
    if (new URLSearchParams(location.search).get('scene') === 'walklab') { const sc = document.createElement('script'); sc.src = 'js/walklab.js?v=' + Date.now(); document.head.appendChild(sc); }
    G.init(S.CHARS, S.ITEMS, ROOMS, window.SPRITES);
  });
})();
