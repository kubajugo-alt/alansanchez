// The Shortest Night — boot: the art the engine preloads, the placeholder rooms' hotspot boxes, the ?scene= previews,
// the content setting, a new game (the prologue, then Tuesday at Gando), init.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const E = window.Engine;

  // ---------------------------------------------------------------- art the engine preloads
  window.FIRST_ROOM = 'gando';
  window.STILLS = ['still_elena_bar', 'still_nap', 'still_barranco', 'still_title', 'still_arrival', 'still_mist', 'still_love_1', 'still_pepe', 'still_caught',
    'still_fight', 'still_rafa_night', 'still_rafa_drawing', 'still_isleta_flood', 'still_vault_dark', 'still_cloud_climb', 'still_bad_ending',
    'still_chain', 'still_sunrise', 'still_road_down', 'still_fireworks', 'still_love_2'];
  window.CLOSEUPS = ['paper_aged'];

  // ---------------------------------------------------------------- every room
  const PH = new Set(((window.PLACEHOLDER_ART || {}).bg) || []);
  S.applyLayout(ROOMS); // where things are in the painted rooms (layout.js)
  for (const [id, r] of Object.entries(ROOMS)) {
    // a hotspot without a spot to stand at is met on the floor below it
    for (const h of r.hotspots || []) if (!h.at && h.rect && r.player !== false) h.at = [Math.max(60, Math.min(1220, h.rect[0] + h.rect[2] / 2)), 650];
    // a placeholder painting: draw the hotspots as labelled boxes behind the figures
    if (PH.has(r.bg) || PH.has(id)) {
      r.placeholder = true;
      const back = r.animBack;
      r.animBack = function (g, t) { if (back) back.call(this, g, t); S.placeholderBoxes(g, this); };
    }
    // the stand-in figures' names, wherever they appear
    const fg = r.animFg;
    r.animFg = function (g, t) { if (fg) fg.call(this, g, t); S.placeholderNames(g); S.seaTick(); };
  }
  for (const c of Object.values(S.CHARS)) if (c.frames && c.frames.walk) S.walkTiming(c.frames);

  // a save made while playing Vasco comes back as Vasco
  const load = E.loadSave;
  E.loadSave = async function (...a) { const r = await load.apply(this, a); if (r) S.restorePlayer(); return r; };

  // ---------------------------------------------------------------- ?scene= previews
  const PREVIEW = {
    prologue: { flags: { ch: 0 }, room: 'gando', pos: [200, 660, 'e'], run: () => S.prologue() },
    tue: { flags: { ch: 1 }, room: 'gando', pos: [200, 660, 'e'], run: async () => {} },
    lobby: { flags: { ch: 1, met_vasco: true, jacket_needed: true }, room: 'hotel_lobby', pos: [300, 660, 'e'], run: async () => { S.give('note5000', true); } },
    reception: { flags: { ch: 1, met_vasco: true, blazer_got: true, blazer_on: true, called_tue: true }, room: 'museum_hall', pos: [200, 660, 'e'], run: async () => { S.give('blazer', true); S.give('note5000', true); } },
    mist: { flags: { ch: 1, met_vasco: true, blazer_got: true, called_tue: true, reception_done: true, met_baute: true, met_carmen: true, narr_canteras: true }, room: 'canteras', pos: [640, 660, 'e'], run: async () => { F().coins = 3; S.give('coins', true); await S.walkTue(); } },
    wed: { flags: { ch: 2, tue_done: true }, room: 'hotel_room', pos: [720, 640, 'e'], run: async () => { F().coins = 3; S.give('coins', true); } },
    belfry: { flags: { ch: 2, clock_key: true, fermin_met: true }, room: 'belfry', pos: [400, 660, 'e'], run: async () => {} },
    thu: { flags: { ch: 3, wed_done: true }, room: 'hotel_room', pos: [720, 640, 'e'], run: async () => { F().coins = 3; S.give('coins', true); S.give('letter', true); S.give('galindo', true); } },
    dinner: { flags: { ch: 3, lore_carmen: true, inquiry_read: true, called_thu: true, sent_to_colon: true, suitcase_done: true }, room: 'museum_hall', pos: [200, 660, 'e'], run: async () => {} },
    fri: { flags: { ch: 4, caught: true }, room: 'hotel_room', pos: [720, 640, 'e'], run: () => S.fight() },
    bar: { flags: { ch: 4, fight_done: true, cave_explained: true }, room: 'rafa_bar', pos: [1100, 660, 'w'], run: async () => {} },
    sat: { flags: { ch: 5, rafa_night: true }, room: 'rafa_studio', pos: [300, 660, 'e'], run: async () => {} },
    flood: { flags: { ch: 5, rafa_truth: true, called_sat: true, fax_read: true }, room: 'map', pos: [640, 660, 'e'], run: () => G.goRoom('isleta', 'map') },
    vasco: { flags: { ch: 5, isleta_flood: true }, room: 'hotel_room', pos: [720, 640, 'e'], run: () => G.busy(() => S.startVasco()) },
    // Saturday in Cave 6 (Vasco, 09:00); the chamber under it at noon, signs and scenes read
    cave: { flags: { ch: 5, isleta_flood: true }, room: 'cave6', pos: [200, 640, 'e'], run: async () => { S.becomeVasco(); ['elena_charts', 'chalk', 'vnotebook', 'ltrowel', 'torch'].forEach(k => S.give(k, true)); } },
    cave_low: { flags: { ch: 5, isleta_flood: true, v_cave_intro: true, v_chalked: true, v_scenes: true, v_noon: true }, room: 'cave6_low', pos: [520, 640, 'e'], run: async () => { S.becomeVasco(); ['elena_charts', 'chalk', 'vnotebook', 'ltrowel', 'torch'].forEach(k => S.give(k, true)); G.setClock('14:04'); } },
    // Monday: in the water at 13:30, two discs set, the telling heard (the aiming: use a disc on its socket)
    aim: { flags: { ch: 7, in_water: true, mclock: 765, placed: ['wax_gibbous', 'last_quarter'], disc6_given: true, telling_heard: true, telling_known: true, surges: 0 }, room: 'cave6_low', pos: [520, 640, 'e'],
      run: async () => { ['wax_crescent', 'wan_gibbous', 'first_quarter', 'wan_crescent'].forEach(s => S.give('disc_' + s, true)); S.water.cave6_low = 0.22; G.setClock('12:45'); } },
    // Monday: the sun disc, under Carmen's mirror (six set)
    aim_sun: { flags: { ch: 7, in_water: true, mclock: 843, placed: ['wax_gibbous', 'last_quarter', 'wax_crescent', 'wan_gibbous', 'first_quarter', 'wan_crescent'], disc6_given: true, telling_heard: true, telling_known: true, cloud_over: true, mirror_on: true, surges: 0 },
      room: 'cave6_low', pos: [640, 650, 'e'], run: async () => { S.water.cave6_low = 0.42; G.setClock('14:03'); } },
    vault: { flags: { ch: 5, isleta_flood: true, v_understood: true, v_fuse_seen: true, v_refused: true }, room: 'vault_cell', pos: [560, 670, 'e'], run: async () => { S.becomeVasco(); ['ltrowel', 'torch'].forEach(k => S.give(k, true)); S.torch = 1; } },
    sun: { flags: { ch: 6, v_done: true }, room: 'hotel_room', pos: [720, 640, 'e'], run: () => S.theChoice() },
    carmen: { flags: { ch: 6, chose_carmen: true, cave_explained: true }, room: 'map', pos: [640, 660, 'e'], run: () => G.goRoom('carmen_flat', 'map') },
    mapthu: { flags: { ch: 3, wed_done: true, sent_to_colon: true }, room: 'map', pos: [640, 660, 'e'], run: async () => {} },
    mapfri: { flags: { ch: 4, caught: true, fight_done: true, cave_explained: true }, room: 'map', pos: [640, 660, 'e'], run: async () => {} },
    map: { flags: { ch: 2, tue_done: true }, room: 'map', pos: [640, 660, 'e'], run: async () => {} },
    elenacar: { flags: { ch: 0 }, room: 'elena_car', pos: [640, 660, 'e'], run: async () => {} },
    landrover: { flags: { ch: 6, chose_carmen: true, knows_vault: true }, room: 'landrover', pos: [640, 660, 'e'], run: async () => {} },
    rescue: { flags: { ch: 6, chose_carmen: true, knows_vault: true, driving: true, radiator_filled: true }, room: 'camp', pos: [300, 660, 'e'], run: async () => {} },
    rescue_vault: { flags: { ch: 6, chose_carmen: true, knows_vault: true, su_camp: true }, room: 'vault', pos: [1060, 650, 'w'], run: async () => {} },
    finale: { flags: { ch: 6, vasco_free: true, v_marked: true }, room: 'vault', pos: [400, 660, 'e'], run: () => S.takeDiscs() },
    monday: { flags: { ch: 6, vasco_free: true, v_marked: true, su_rock: true }, room: 'camp', pos: [520, 660, 'e'], run: async () => { S.giveDiscs(); await S.startMon(); } },
    confession: { flags: { ch: 7, lock_closed: true, placed: ['wax_gibbous', 'last_quarter', 'wax_crescent', 'wan_gibbous', 'first_quarter', 'wan_crescent'], sun_flat: true, disc_turned: true, disc6_given: true, cloud_over: true, mirror_on: true }, room: 'cave6', pos: [560, 660, 'e'], run: async () => {} },
  };
  async function preview(k) {
    const P = PREVIEW[k];
    S.give('notebook', true); Object.assign(F(), P.flags);
    await G.goRoom(P.room, null, { noEnter: true, instant: true, pos: P.pos });
    await G.wait(600);
    await P.run();
  }
  S.PREVIEW = PREVIEW;

  // ---------------------------------------------------------------- the content setting (as Game I)
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
        <p>This is a story about a relationship, and it has two love scenes and one night that matters. <b>Full</b> shows their paintings. <b>Discreet</b> fades to black instead; nothing else changes.</p>
        <p style="font-size:.85em;opacity:.75">You can change this at any time from the menu.</p>
        <p><button data-v="full" style="margin:6px 10px;padding:8px 22px">Full</button><button data-v="discreet" style="margin:6px 10px;padding:8px 22px">Discreet</button></p></div>`;
      box.querySelectorAll('button').forEach(b => b.onclick = e => {
        e.stopPropagation(); S.setContent(b.dataset.v);
        const o = document.querySelector('#opt-content'); if (o) o.textContent = contentLabel();
        box.remove(); resolve();
      });
      (document.querySelector('#game') || document.body).appendChild(box);
    });
  }

  // ---------------------------------------------------------------- a new game
  S.PLAY_PROLOGUE = false;
  async function newGame() {
    const scene = new URLSearchParams(location.search).get('scene');
    if (!S.content() && !window.FAST && !scene) await askContent();
    if (PREVIEW[scene]) return preview(scene);
    S.give('notebook', true); S.give('note5000', true);
    if (S.PLAY_PROLOGUE) await S.prologue(); // (off for now, the user 2026-10-29: "remove the intro... start with Alan at the airport")
    await G.busy(async () => {
      F().ch = 1;
      await G.goRoom('gando', null, { instant: true, noEnter: true, noSave: true, pos: [200, 660, 'e'] });
      G.endStill();
      await S.day(1);
      await G.fade(false);
      await say('narr_tue_1', 'alan_t_land');   // (the Iberia desk is Alan's to tell now: HANDOFF 111)
    });
    G.autosave();
  }
  window.Story = { newGame };
  document.getElementById('btn-new').onclick = () => G.begin(true);
  document.getElementById('btn-continue').onclick = () => G.begin(false);

  G.init(S.CHARS, S.ITEMS, ROOMS, window.SPRITES);
})();
