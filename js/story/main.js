// The Drowned Bell v2 — boot: shared effects, chapter hooks, new game, init.
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
      g.fillStyle = gr; g.fillRect(x - 160, y - 80, 320, 160);
    }
    g.restore();
  };
  // a squat polished brass bookbinder's weight
  S.drawWeight = function (g, x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(0, 2, 15, 4, 0, 0, 7); g.fill();
    const gr = g.createLinearGradient(-14, 0, 14, 0); gr.addColorStop(0, '#6a4a14'); gr.addColorStop(0.35, '#f2d27a'); gr.addColorStop(0.6, '#b8862e'); gr.addColorStop(1, '#4a3008');
    g.fillStyle = gr; g.strokeStyle = '#2a1a06'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-14, 0); g.lineTo(-14, -14); g.ellipse(0, -14, 14, 4, 0, Math.PI, 0); g.lineTo(14, 0); g.ellipse(0, 0, 14, 4, 0, 0, Math.PI); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(0, -14, 14, 4, 0, 0, 7); g.fillStyle = '#e8c468'; g.fill(); g.stroke();
    g.beginPath(); g.arc(0, -20, 5, 0, 7); g.fillStyle = gr; g.fill(); g.stroke();
    g.restore();
  };
  // covers a taken object with nearby painting (the window shelf, etc.)
  S.patchBg = function (g, dst, src) {
    const im = G.bgImage(); if (!im) return;
    const k = im.width / 1280;
    g.drawImage(im, src[0] * k, src[1] * k, dst[2] * k, dst[3] * k, dst[0], dst[1], dst[2], dst[3]);
  };

  // ---------------------------------------------------------------- chapter hooks in the shop
  const shopEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (F().ch === 2 && F().ch2_ready && !F().ch2_done) return S.ch2End();
    if (F().ch === 3 && F().has_tongue && F().founder_order && !F().ch3_done) return S.ch3End();
    if (shopEnter) return shopEnter.call(this, entry);
  };

  // ---------------------------------------------------------------- art the engine preloads
  window.STILLS = ['still_intro', 'still_bell_legend', 'still_madragoa', 'still_maria_sleep', 'still_maria_tile', 'still_maria_list', 'still_maria_water', 'still_maria_dawn',
    'still_newspaper', 'still_tideclock_hand', 'still_alfama_sign', 'still_1755', 'still_1955_a', 'still_1955_b', 'still_1955_c', 'still_city_morning', 'still_drawer', 'still_shop_after',
    'still_phone', 'still_amalia_box', 'still_tavern_full', 'still_quay_sweater', 'still_abilio_ring', 'still_jacket', 'still_shelf', 'still_ze_kiss', 'still_ze_bunk', 'still_cop_shelf', 'still_guitar_bed', 'still_cop_smoke'].concat(window.EXTRA_STILLS || []);
  window.CLOSEUPS = ['paper_aged', 'close_photo1934', 'close_porthole', 'close_tideclock', 'close_bronze', 'close_clocks'];

  // ---------------------------------------------------------------- new game
  // preview links: ?scene=bath | cop | guitar | celeste | visitcop | visitguitar | romance | finale jumps straight to that scene (no autosave)
  const PREVIEW = {
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
    coldopen: { flags: { ch: 1 }, room: 'shop', pos: [815, 616, 'e'], run: async () => { await G.busy(async () => { if (!(await S.mariaPaintings())) await S.coldOpen(); }); G.endStill(); await G.fade(false); } },
    // the whole opening, from the fog over Lisbon to Inês waking Alan
    intro: { flags: { ch: 1, clock: '11:00' }, room: 'shop', pos: [815, 616, 'e'], run: () => opening() },
    romance: { flags: { ch: 4, ze_awake: true, ze_believes: true, ze_in_cabin: true, ze_saved: true }, room: 'cabin', pos: [560, 640, 'e'], run: () => S.romance() },
    // the ending: hand Lacerda the ledger, then the last strike (the puzzle in between is skipped)
    finale: { flags: { ch: 5, tomas_confessed: true }, room: 'cistern', pos: [520, 640, 'e'], run: async () => {
      G.giveItem('ledger', true); G.giveItem('tongue', true);
      await S.giveLedger(); await G.wait(window.FAST ? 20 : 1500);
      G.giveItem('lantern', true); G.giveItem('knife', true);
      await S.cutRopes(); await S.giveLantern();
      Object.assign(F(), { blood: true, struck: ['sanches', 'coutinho', 'bastos'], strikes: 3, water: 2 });
      await G.wait(window.FAST ? 20 : 700);
      await S.strike('ferreira');
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
    // the visits: walk into the shop from the street with Inês minding it
    visitcop: { flags: { ch: 2, heard_machine: true, flirted_cop: true }, room: 'street', pos: [640, 660, 'e'], run: () => G.goRoom('shop', 'street') },
    visitguitar: { flags: { ch: 2, heard_machine: true, flirted_guitar: true, visit_cop: true }, room: 'street', pos: [640, 660, 'e'], run: () => G.goRoom('shop', 'street') },
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
  async function preview(k) {
    const P = PREVIEW[k];
    G.giveItem('notebook', true); Object.assign(F(), P.flags);
    await G.goRoom(P.room, null, { noEnter: true, instant: true, pos: P.pos });
    await G.wait(800);
    await P.run();
  }
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
      box.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); S.setContent(b.dataset.v); const o = document.querySelector('#opt-content'); if (o) o.textContent = contentLabel(); box.remove(); resolve(); });
      (document.querySelector('#game') || document.body).appendChild(box);
    });
  }
  // The opening: the fog over Lisbon, Maria Coutinho's last night in paintings (the old staged
  // room only if the paintings are missing), the city waking to it, the chapter card, the shop.
  S.CHARS.alan.frames.poses.yawn = 'alan_yawn'; S.CHARS.alan.frames.poses.stretch = 'alan_stretch'; // waking up
  const SHOP_IN = [235, 712, 'e']; // the foot of the stairs, front left of the shop
  async function opening() {
    await G.busy(async () => {
      await G.fade(true);
      if (window.Sound) Sound.ambience('street_night');
      await S.paint('still_intro', () => say('narr_intro_1'), { zoom: [1.0, 1.16], pan: [[0.4, 0.55], [0.6, 0.5]] });
      if (S.introLegend) await S.introLegend(); // the drowned bell, as the old women tell it
      const painted = S.mariaPaintings && await S.mariaPaintings();
      if (!painted && S.coldOpen) await S.coldOpen(); // fallback: Madragoa, 04:01, staged in a room
      if (S.introCity && G.image('still:still_newspaper')) await S.introCity();
      else await S.paint('still_intro', async () => { await say('narr_intro_2'); await say('narr_intro_tiles'); }, { zoom: [1.08, 1.16], pan: [[0.55, 0.5], [0.6, 0.5]] });
      await G.fade(true);
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
      await say('narr_intro_3', 'ines_wake_up');
      if (G.image('bg:bedroom')) {
        await G.fade(true);
        await G.goRoom('bedroom', null, { instant: true, noEnter: true, noSave: true, pos: [800, 640, 'w'] }); // up beside the bed
        pose('yawn');
        await G.fade(false);
        await say('alan_wake_up');
        pose(null);
        await p.walkTo(150, 712);   // off down the stairs
        await G.fade(true);
        await G.goRoom('shop', null, { instant: true, noEnter: true, pos: SHOP_IN });
        await G.fade(false);
      } else { p.visible = true; await say('alan_wake_up'); }
      await p.walkTo(470, 640);
      if (ines) ines.dir = 'w';
      p.dir = 'e'; pose('yawn'); await T(900);
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
  G.init(S.CHARS, S.ITEMS, ROOMS, window.SPRITES);
})();
