// The Forgotten Rhythm — what every room sounds like: its music and its ambience, by the day and the hour. All of it is
// synthesised by scripts/make_sound.py (no samples, no services): the score (audio/music: title, hostal, zona, cathedral,
// archive, salve, dread, yolande, bachata, gallera, p1586, lisbon, finale, ending) and the Santo Domingo beds
// (audio/sfx/sd_*: street, courtyard, night, church, tower, sea, storm, rain, market, bar, gallera, room, office, cell,
// foundry, 1586), with their details mixed in js/audio.js (EXTRAS). Lisbon keeps the Lisbon beds of the earlier games.
// Loaded after the parts, so it can read their flags; a part can still override a room's music with Sound.cue.
(function () {
  const S = window.S, { F, ROOMS } = S;
  const ch = () => F().ch || 0;
  const night = id => { const v = F()['bg_' + id] || ''; return /night|powercut/.test(v); };
  const near = () => (F().pulse || 0) >= 4;                 // the Sea close: the heartbeat loud
  const finale = () => ch() === 8 && !!(F().tu6_done || F().shore_night || F().fin_started || F().finale);
  const set = (ids, music, ambience) => { for (const id of [].concat(ids)) { const r = ROOMS[id]; if (!r) continue; if (music !== undefined) r.music = music; if (ambience !== undefined) r.ambience = ambience; } };

  // 1586
  set(['p1586_river_mouth', 'p1586_huts', 'p1586_square'], 'p1586', 'sd_1586');
  set('p1586_bell_chamber', 'p1586', 'sd_tower');
  set('p1586_shore_storm', 'finale', 'sd_storm');
  // Lisbon (the earlier games' Lisbon beds: trams, the shop at night, the flat); the epilogue's last call
  set('shop', () => ch() === 9 ? 'ending' : 'lisbon', () => ch() === 9 ? 'shop_night' : 'shop');
  set('flat', 'lisbon', 'bedroom');
  set('rua', 'lisbon', 'street');
  set('vasco_office_lisbon', 'archive', 'office');
  // the hostal
  set('hostal_courtyard', () => near() ? 'dread' : night('hostal_courtyard') ? 'salve' : 'hostal', () => night('hostal_courtyard') ? 'sd_night' : 'sd_courtyard');
  set(['hostal_room4', 'hostal_room9'], () => near() ? 'dread' : 'hostal', 'sd_room');
  set('hostal_kitchen', () => night('hostal_kitchen') ? 'dread' : 'hostal', () => night('hostal_kitchen') ? 'sd_night' : 'sd_room');
  set('hostal_roof', () => near() ? 'dread' : 'salve', 'sd_night');
  set('calle_las_damas', () => near() ? 'dread' : 'salve', 'sd_night');
  // the cathedral
  set(['cathedral_nave', 'cathedral_cloister'], () => near() ? 'dread' : 'cathedral', 'sd_church');
  set('tower_stair', () => near() ? 'dread' : 'cathedral', 'sd_tower');
  set('bell_chamber', () => near() || F().bg_bell_chamber ? 'dread' : 'cathedral', 'sd_tower');
  set('cathedral_archive', 'archive', 'sd_office');
  // the old city by day (Tuesday's square in the wind: the storm coming)
  set('parque_colon', () => ch() === 8 ? 'finale' : near() ? 'dread' : 'zona', () => F().bg_parque_colon === 'parque_colon__wind' ? 'sd_tower' : 'sd_street');
  set(['el_conde'], 'zona', 'sd_street');
  set('city_wall', () => near() ? 'dread' : 'zona', 'sd_sea');
  set('palace_courtyard', 'cathedral', 'sd_courtyard');
  set(['bishop_study', 'palace_dining'], 'archive', 'sd_office');
  // San Antón
  set('san_anton', () => near() ? 'dread' : 'zona', () => F().bg_san_anton ? 'sd_street' : 'sd_street');
  set('tata_alley', () => F().bg_tata_alley ? 'zona' : 'salve', () => F().bg_tata_alley ? 'sd_street' : 'sd_night');
  set('blue_house', () => F().bg_blue_house ? 'dread' : 'salve', 'sd_room');
  // the market and Yolande
  set(['market_hall', 'candle_aisle', 'drying_shed'], () => near() ? 'dread' : 'yolande', 'sd_market');
  set('yolande_back_room', 'yolande', 'sd_room');
  // the bar, Darío's roof, the gallera
  set('blue_door_bar', 'bachata', 'sd_bar');
  set('dario_roof', 'bachata', 'sd_night');
  set('gallera', 'gallera', 'sd_gallera');
  // the police station
  set(['police_cell'], 'dread', 'sd_cell');
  set(['batista_office'], 'dread', 'sd_office');
  set(['police_steps'], 'zona', 'sd_street');
  // the foundry: the clock, the furnace
  set(['foundry_yard', 'foundry_office'], 'dread', 'sd_foundry');
  // the shore: the finale at night in the storm; before that, the sea
  set(['shore_steps', 'playa_negras', 'shore_water'], () => ch() >= 8 ? 'finale' : 'dread', () => ch() >= 8 ? 'sd_storm' : 'sd_sea');
  // the hub map
  if (ROOMS.hub) { ROOMS.hub.music = () => ch() >= 8 ? 'dread' : ch() <= 1 ? 'lisbon' : 'zona'; ROOMS.hub.ambience = null; }
})();
