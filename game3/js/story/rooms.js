// The Forgotten Rhythm — every room, defined once: painting (and its variants), name, entries, the doors between rooms
// and the way to the hub map. The days add their people and things with S.spot / S.person / S.onEnter (core.js).
//
// A room's painting can change with the story: set F().bg_<room id> = '<variant>' (a file in art/bg, listed in the room's
// bgs) and clear it (delete or null) to go back. Variants (game3/art/designs/rooms/variants): hostal_courtyard__night,
// hostal_courtyard__dawn, hostal_kitchen__night_powercut, bell_chamber__sun_sunset, parque_colon__wet_morning, parque_colon__wind,
// tata_alley__day, blue_house_inside__wet, san_anton_colmado__shut, p1586_river_mouth__visit1_birds, p1586_river_mouth__visit2_fish.
//
// Hub pins: S.open(pinId, fn) adds a condition under which a pin shows (any true condition opens it); S.pinNext(fn) can
// return the pin id the story wants next (it glows). Pins: hostal, cathedral, parque, palace, conde, wall, damas, santon,
// shore, bar, market, gallera, police, foundry.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const ALL = new Set(window.G3_ROOMS || []);
  const V = (id, ...vs) => ({ bgs: vs.filter(v => ALL.has(v)), bgFn: () => F()['bg_' + id] || id });
  const edgeL = (name, exit, entry) => ({ name, rect: [0, 230, 80, 420], at: [60, 660], exit, entry, kind: 'exit' });
  const edgeR = (name, exit, entry) => ({ name, rect: [1200, 230, 80, 420], at: [1220, 660], exit, entry, kind: 'exit' });
  const door = (name, rect, exit, entry, at) => ({ name, rect, at: at || [rect[0] + rect[2] / 2, 660], exit, entry, kind: 'exit' });
  const R = (id, def) => { ROOMS[id] = S.room(Object.assign({ bg: id }, def)); return ROOMS[id]; };
  const E2 = (l, r) => ({ default: [640, 660, 'e'], hub: [640, 660, 'e'], left: [140, 660, 'e'], right: [1140, 660, 'w'], ...(l || {}), ...(r || {}) });

  // ================================================================ 1586 (the prologue)
  R('p1586_river_mouth', Object.assign({ name: 'The river mouth, 1586', floor: 'sand', ambience: 'harbour', noParrot: true, entries: E2() },
    V('p1586_river_mouth', 'p1586_river_mouth__visit1_birds', 'p1586_river_mouth__visit2_fish'),
    { hotspots: [edgeR('To the huts', 'p1586_huts', 'left')] }));
  R('p1586_huts', { name: 'The huts by the cane', floor: 'sand', noParrot: true, entries: E2(),
    hotspots: [edgeL('To the river', 'p1586_river_mouth', 'right'), edgeR('To the square', 'p1586_square', 'left')] });
  R('p1586_square', { name: 'The square, 1586', noParrot: true, entries: E2(),
    hotspots: [edgeL('To the huts', 'p1586_huts', 'right'), door('The tower door', [560, 260, 160, 260], 'p1586_bell_chamber', 'default')] });
  R('p1586_bell_chamber', { name: 'The bell-chamber, 1586', floor: 'wood', ambience: 'tower', noParrot: true, entries: E2(),
    hotspots: [door('Down the stair', [60, 300, 160, 300], 'p1586_square', 'default', [140, 660])] });
  R('p1586_shore_storm', { name: 'The shore, 29 September 1586', floor: 'sand', ambience: 'harbour', noParrot: true, entries: E2() });

  // ================================================================ Lisbon (Game I's shop, flat and street; Vasco's office)
  R('shop', { name: 'Sanches & Filho, Lisbon', floor: 'wood', ambience: 'shop_night', noParrot: true, entries: E2({ rua: [1100, 660, 'w'], flat: [200, 660, 'e'] }),
    hotspots: [door('The street door', [1110, 220, 150, 360], 'rua', 'shop', [1150, 660]), door('Up to the flat', [20, 220, 130, 380], 'flat', 'shop', [100, 660])] });
  R('flat', { name: 'The flat above the shop', floor: 'wood', ambience: 'bedroom', noParrot: true, entries: E2({ shop: [1050, 660, 'w'] }),
    hotspots: [door('Down to the shop', [1120, 220, 140, 380], 'shop', 'flat', [1150, 660])] });
  R('rua', { name: 'Rua de São Miguel, Lisbon', floor: 'stone', ambience: 'city', noParrot: true, entries: E2({ shop: [420, 660, 'e'] }),
    hotspots: [door('The shop', [300, 230, 200, 330], 'shop', 'rua', [400, 660])] });
  R('vasco_office_lisbon', { name: 'Vasco\'s office, the Patriarchate', floor: 'wood', ambience: 'office', noParrot: true, entries: E2() });

  // ================================================================ the hostal (Calle Las Damas)
  R('hostal_courtyard', Object.assign({ name: 'Hostal Las Damas', floor: 'stone', ambience: 'city',
    entries: E2({ room4: [880, 650, 'w'], room9: [420, 650, 'e'], kitchen: [1100, 660, 'w'], roof: [300, 640, 'e'], street: [140, 660, 'e'] }) },
    V('hostal_courtyard', 'hostal_courtyard__night', 'hostal_courtyard__dawn'),
    { hotspots: [
      door('Room 4', [820, 300, 110, 220], 'hostal_room4', 'courtyard', [870, 650]),
      door('Room 9', [380, 270, 110, 240], 'hostal_room9', 'courtyard', [430, 650]),
      door('The kitchen', [1120, 260, 150, 320], 'hostal_kitchen', 'courtyard', [1150, 660]),
      door('Up to the roof', [130, 160, 140, 300], 'hostal_roof', 'courtyard', [220, 650]),
      S.toMap([0, 520, 90, 190], [60, 680]) ] }));
  R('hostal_room4', { name: 'Room 4', floor: 'tile', ambience: 'bedroom', entries: E2({ courtyard: [1100, 660, 'w'] }),
    hotspots: [edgeR('The courtyard', 'hostal_courtyard', 'room4')] });
  R('hostal_room9', { name: 'Room 9', floor: 'tile', ambience: 'bedroom', entries: E2({ courtyard: [1100, 660, 'w'] }),
    hotspots: [edgeR('The courtyard', 'hostal_courtyard', 'room9')] });
  R('hostal_kitchen', Object.assign({ name: 'Señora Mireya\'s kitchen', floor: 'tile', ambience: 'city', entries: E2({ courtyard: [1100, 660, 'w'] }) },
    V('hostal_kitchen', 'hostal_kitchen__night_powercut'), { hotspots: [edgeR('The courtyard', 'hostal_courtyard', 'kitchen')] }));
  R('hostal_roof', { name: 'The roof', floor: 'stone', ambience: 'night_city', entries: E2({ courtyard: [200, 660, 'e'] }),
    hotspots: [edgeL('Down to the courtyard', 'hostal_courtyard', 'roof')] });
  R('calle_las_damas', { bg: 'calle_las_damas_night', name: 'Calle Las Damas', floor: 'cobble', ambience: 'street_night', entries: E2({ hostal: [1100, 660, 'w'] }),
    hotspots: [edgeR('The hostal', 'hostal_courtyard', 'street'), S.toMap([0, 520, 90, 190], [60, 680])] });

  // ================================================================ the cathedral
  R('cathedral_nave', { name: 'The Primada: the nave', floor: 'stone', ambience: 'convent', entries: E2({ stair: [1060, 660, 'w'], cloister: [160, 660, 'e'] }),
    hotspots: [door('The tower door', [1080, 250, 130, 300], 'tower_stair', 'nave', [1120, 660]),
      door('To the cloister', [20, 250, 120, 330], 'cathedral_cloister', 'nave', [90, 660]), S.toMap([560, 610, 160, 100], [640, 690])] });
  R('tower_stair', { name: 'The tower stair', floor: 'stone', ambience: 'tower', entries: E2({ nave: [220, 660, 'e'], bells: [1000, 640, 'w'] }),
    hotspots: [door('Back to the nave', [40, 330, 200, 330], 'cathedral_nave', 'stair', [180, 660]), door('Up the steps', [900, 60, 300, 420], 'bell_chamber', 'stair', [1040, 640])] });
  R('bell_chamber', Object.assign({ name: 'The bell-chamber', floor: 'wood', ambience: 'tower', entries: E2({ stair: [220, 660, 'e'] }) },
    V('bell_chamber', 'bell_chamber__sun_sunset'), { hotspots: [door('Down the stair', [60, 300, 160, 300], 'tower_stair', 'bells', [160, 660])] }));
  R('cathedral_cloister', { name: 'The cloister', floor: 'stone', ambience: 'convent', entries: E2({ nave: [1100, 660, 'w'], archive: [220, 660, 'e'] }),
    hotspots: [edgeR('To the nave', 'cathedral_nave', 'cloister'), door('The archive', [40, 260, 160, 300], 'cathedral_archive', 'cloister', [140, 660])] });
  R('cathedral_archive', { name: 'The cathedral archive', floor: 'wood', ambience: 'office', entries: E2({ cloister: [1100, 660, 'w'] }),
    hotspots: [edgeR('To the cloister', 'cathedral_cloister', 'archive')] });

  // ================================================================ the old city
  R('parque_colon', Object.assign({ name: 'Parque Colón', floor: 'cobble', ambience: 'city', entries: E2({ nave: [1000, 660, 'w'] }) },
    V('parque_colon', 'parque_colon__wet_morning', 'parque_colon__wind'),
    { hotspots: [door('The cathedral', [860, 240, 220, 300], 'cathedral_nave', 'default', [960, 660]), S.toMap([0, 520, 90, 190], [60, 680])] }));
  R('el_conde', { name: 'Calle El Conde', floor: 'cobble', ambience: 'city', entries: E2(), hotspots: [S.toMap([0, 520, 90, 190], [60, 680])] });
  R('city_wall', { name: 'The city wall over the Ozama', floor: 'stone', ambience: 'harbour', entries: E2(), hotspots: [S.toMap([0, 520, 90, 190], [60, 680])] });
  R('palace_courtyard', { name: 'The Archbishop\'s palace', floor: 'stone', ambience: 'convent', entries: E2({ study: [900, 660, 'w'], dining: [300, 660, 'e'] }),
    hotspots: [door('The bishop\'s study', [900, 240, 160, 320], 'bishop_study', 'courtyard', [980, 660]),
      door('The dining room', [200, 240, 160, 320], 'palace_dining', 'courtyard', [280, 660]), S.toMap([560, 620, 160, 90], [640, 690])] });
  R('bishop_study', { name: 'The bishop\'s study', floor: 'wood', ambience: 'office', entries: E2({ courtyard: [1100, 660, 'w'] }),
    hotspots: [edgeR('The courtyard', 'palace_courtyard', 'study')] });
  R('palace_dining', { name: 'The palace dining room', floor: 'wood', ambience: 'museum', entries: E2({ courtyard: [1100, 660, 'w'] }),
    hotspots: [edgeR('The courtyard', 'palace_courtyard', 'dining')] });

  // ================================================================ San Antón
  R('san_anton', Object.assign({ bg: 'san_anton_colmado', name: 'San Antón: the colmado', floor: 'cobble', ambience: 'city', entries: E2({ alley: [1100, 660, 'w'] }) },
    { bgs: ALL.has('san_anton_colmado__shut') ? ['san_anton_colmado__shut'] : [], bgFn: () => F().bg_san_anton || 'san_anton_colmado' },
    { hotspots: [edgeR('Tata\'s alley', 'tata_alley', 'colmado'), S.toMap([0, 520, 90, 190], [60, 680])] }));
  R('tata_alley', { bg: 'tata_alley_night', name: 'Tata\'s alley', floor: 'cobble', ambience: 'night_city', entries: E2({ colmado: [160, 660, 'e'], house: [640, 650, 's'] }),
    bgs: ALL.has('tata_alley__day') ? ['tata_alley__day'] : [], bgFn: () => F().bg_tata_alley || 'tata_alley_night',
    hotspots: [edgeL('Back to the colmado', 'san_anton', 'alley'), door('The blue house', [560, 280, 160, 260], 'blue_house', 'alley', [640, 650])] });
  R('blue_house', { bg: 'blue_house_inside', name: 'The blue house', floor: 'tile', ambience: 'bedroom', entries: E2({ alley: [1100, 660, 'w'] }),
    bgs: ALL.has('blue_house_inside__wet') ? ['blue_house_inside__wet'] : [], bgFn: () => F().bg_blue_house || 'blue_house_inside',
    hotspots: [edgeR('Out to the alley', 'tata_alley', 'house')] });

  // ================================================================ the market (Mercado Modelo)
  R('market_hall', { name: 'Mercado Modelo', floor: 'tile', ambience: 'city', entries: E2({ aisle: [1100, 660, 'w'] }),
    hotspots: [edgeR('The candle aisle', 'candle_aisle', 'hall'), S.toMap([0, 520, 90, 190], [60, 680])] });
  R('candle_aisle', { name: 'The candle aisle', floor: 'tile', ambience: 'city', entries: E2({ hall: [160, 660, 'e'], back: [1060, 660, 'w'], shed: [900, 660, 'w'] }),
    hotspots: [edgeL('The main hall', 'market_hall', 'aisle'), door('Behind Yolande\'s curtain', [1060, 250, 160, 330], 'yolande_back_room', 'aisle', [1120, 660])] });
  R('yolande_back_room', { name: 'Yolande\'s back room', floor: 'tile', ambience: 'bedroom', entries: E2({ aisle: [160, 660, 'e'] }),
    hotspots: [edgeL('Back to the aisle', 'candle_aisle', 'back')] });
  R('drying_shed', { name: 'The tanner\'s drying shed', floor: 'sand', ambience: 'city', entries: E2({ aisle: [200, 660, 'e'] }),
    hotspots: [edgeL('Back through the curtain', 'candle_aisle', 'shed')] });

  // ================================================================ the bar, Darío's roof, the gallera
  R('blue_door_bar', { name: 'The blue-door bar', floor: 'wood', ambience: 'tavern', entries: E2(), hotspots: [S.toMap([0, 520, 90, 190], [60, 680])] });
  R('dario_roof', { name: 'A roof in Ciudad Nueva', floor: 'stone', ambience: 'night_city', entries: E2() });
  R('gallera', { name: 'The gallera, Villa Consuelo', floor: 'sand', ambience: 'tavern', entries: E2(), hotspots: [S.toMap([0, 520, 90, 190], [60, 680])] });

  // ================================================================ the police station
  R('police_cell', { name: 'The cells', floor: 'stone', ambience: 'cistern', entries: E2() });
  R('batista_office', { name: 'Sargento Batista\'s office', floor: 'tile', ambience: 'office', entries: E2() });
  R('police_steps', { bg: 'police_steps_dawn', name: 'The police station steps', floor: 'stone', ambience: 'city', entries: E2(), hotspots: [S.toMap([0, 520, 90, 190], [60, 680])] });

  // ================================================================ the foundry (Villa Duarte)
  R('foundry_yard', { name: 'The foundry, Villa Duarte', floor: 'sand', ambience: 'city', entries: E2({ office: [1000, 660, 'w'] }),
    hotspots: [door('The office', [1000, 240, 180, 320], 'foundry_office', 'yard', [1080, 660]), S.toMap([0, 520, 90, 190], [60, 680])] });
  R('foundry_office', { name: 'Don Faustino\'s office', floor: 'wood', ambience: 'office', entries: E2({ yard: [1100, 660, 'w'] }),
    hotspots: [edgeR('The yard', 'foundry_yard', 'office')] });

  // ================================================================ the shore
  R('shore_steps', { name: 'The old steps below the wall', floor: 'stone', ambience: 'harbour', entries: E2({ beach: [1100, 660, 'w'] }),
    hotspots: [edgeR('Down to the beach', 'playa_negras', 'steps'), S.toMap([0, 520, 90, 190], [60, 680])] });
  R('playa_negras', { bg: 'playa_negras_night', name: 'Playa de las Negras', floor: 'sand', ambience: 'harbour', entries: E2({ steps: [160, 660, 'e'], water: [1100, 660, 'w'] }),
    hotspots: [edgeL('Up the steps', 'shore_steps', 'beach'), edgeR('To the water\'s edge', 'shore_water', 'beach')] });
  R('shore_water', { bg: 'shore_water_edge', name: 'The water\'s edge', floor: 'sand', ambience: 'harbour', entries: E2({ beach: [160, 660, 'e'] }),
    hotspots: [edgeL('Back up the beach', 'playa_negras', 'water')] });

  // ================================================================ the hub map: the Zona Colonial (drawn from OpenStreetMap)
  S.OPENS = {}; S.open = (id, fn) => { (S.OPENS[id] = S.OPENS[id] || []).push(fn); };
  S.NEXTS = []; S.pinNext = fn => S.NEXTS.push(fn);
  const isOpen = id => (S.OPENS[id] || []).some(fn => { try { return fn(F()); } catch (e) { return false; } });
  const nextPin = () => { for (const fn of S.NEXTS) { try { const r = fn(F()); if (r) return r; } catch (e) { /* ignore */ } } return null; };
  const PIN = (id, x, y, text, go, entry) => ({ id, x, y, text, go, entry: entry || 'hub', open: () => isOpen(id) });
  S.PINS = [
    PIN('hostal', 760, 254, 'Hostal Las Damas', 'hostal_courtyard', 'street'),
    PIN('damas', 778, 300, 'Calle Las Damas', 'calle_las_damas', 'default'),
    PIN('cathedral', 672, 345, 'The Primada (the cathedral)', 'cathedral_nave'),
    PIN('parque', 662, 296, 'Parque Colón', 'parque_colon'),
    PIN('palace', 716, 372, 'The Archbishop\'s palace', 'palace_courtyard'),
    PIN('conde', 420, 285, 'Calle El Conde', 'el_conde'),
    PIN('wall', 823, 350, 'The wall over the Ozama', 'city_wall'),
    PIN('shore', 781, 506, 'The old steps to the shore', 'shore_steps'),
    PIN('santon', 697, 40, 'San Antón ↑', 'san_anton'),
    PIN('bar', 206, 550, 'Ciudad Nueva: the blue-door bar', 'blue_door_bar'),
    PIN('market', 80, 60, 'By guagua: the Mercado Modelo', 'market_hall'),
    PIN('gallera', 80, 140, 'By guagua: Villa Consuelo, the gallera', 'gallera'),
    PIN('police', 80, 220, 'The police station', 'police_steps'),
    PIN('foundry', 1188, 106, 'Over the bridge: the foundry, Villa Duarte', 'foundry_yard'),
  ];
  ROOMS.hub = {
    name: 'The Zona Colonial', bg: 'hub_map', player: false, noSave: true, parallax: false, vignette: 0.25,
    anim(g, t) {
      FX.water(g, t * 0.6, 840, 40, 380, 560, '210,236,240');
      const nx = nextPin();
      for (const m of S.PINS) {
        if (!m.open()) continue;
        const p = 0.5 + 0.5 * Math.sin(t * 3 + m.x);
        FX.glow(g, m.x, m.y, 40 + p * 14, '255,120,60', 0.45);
        if (nx === m.id) { FX.glow(g, m.x, m.y, 60 + p * 20, '255,170,80', 0.5); g.save(); g.strokeStyle = `rgba(255,210,122,${0.45 + 0.4 * p})`; g.lineWidth = 2.5; g.beginPath(); g.arc(m.x, m.y, 18 + p * 5, 0, 7); g.stroke(); g.restore(); }
        g.fillStyle = '#7a1408'; g.strokeStyle = '#2a0a04'; g.lineWidth = 3; g.beginPath(); g.arc(m.x, m.y, 11, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(m.x, m.y, 4.5, 0, 7); g.fill();
      }
      g.font = "700 26px 'Cinzel', serif"; g.fillStyle = 'rgba(40,24,10,0.85)'; g.textAlign = 'right'; g.fillText(S.dayName(), 1240, 690); g.textAlign = 'left';
    },
    hotspots: S.PINS.map(m => ({ name: m.text, rect: [m.x - 30, m.y - 50, 60, 80], when: m.open, exit: m.go, entry: m.entry, noBox: true })),
    labels: S.PINS.map(m => ({ x: m.x, y: m.y - 14, text: m.text, when: m.open })),
  };
})();
