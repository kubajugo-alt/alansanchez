// Light and shadow on the figures, as Game I lights its rooms (HANDOFF 158; the user, 2026-11-04: "start with the seven
// lamp-lit rooms"; all 29 rooms with figures since entry 159). On for everyone since entry 160; ?light=0 in the address
// turns it off (the rooms as they were: their lamps a glow only).
//
// The shared engine (js/engine/lights.js) already does it all; Game II's rooms only gave their lamps a painted glow. Here
// each lamp also gets what Game I's have: power and reach (how much it lights a figure near it, and how far), rim (the
// bright edge on the side facing it), shadow (the strength of the figure's cast shadow), floor (the point of the floor
// under it: the shadow falls away from there) and height (how high it hangs above that point: a high light casts a
// short shadow). Daylight through a window is a steady light of the same kind; a room's own key light is light.rim
// (+ rimSide), and light.flickerShade lets a flame-lit room breathe with its flames. The engine keeps a figure's
// overall brightness as before (its lightParams): the lamps model the figure, they don't brighten the room.
// Every position is read off the painting at 1280x720 (scratchpad geo_<room>.jpg sheets: lamps ringed, floor outlined).
(function () {
  const S = window.S, ROOMS = S.ROOMS;   // (S.F(): the flags, for the lights that depend on the story)
  // on for everyone since 2026-11-04 (HANDOFF 160, the user: "switch it on for everyone"); ?light=0 turns it off, to compare
  let on = !/[?&]light=0\b/.test(location.search);
  window.LIGHT2 = on;
  if (!on) return;

  const WARM = '255,200,120', CANDLE = '255,190,110', DAY = '215,225,240';
  // per room: `lamps` adds to the room's own lamps in order (null: leave that one a glow only), `add` are new lights
  // (daylight, mostly: no glow of their own, the painting already shows the window), `light` adds to the room's light
  const PLAN = {
    // Rafa's bar, at night: two hanging lanterns, the street lamp outside the door
    rafa_bar: {
      lamps: [
        { power: 0.5, reach: 1200, rim: 0.7, shadow: 0.7, floor: [403, 585], height: 440 },   // over the bar's front
        { power: 0.5, reach: 1200, rim: 0.7, shadow: 0.7, floor: [901, 560], height: 380 },   // over the floor by the tiles
        { power: 0.15, reach: 600, rim: 0.5, shadow: false, floor: [1240, 520], height: 260 }, // the street lamp, through the door
      ],
      light: { flickerShade: 0.18 },
    },
    // the museum's corridor of skulls: four wall lanterns, two each side
    museum_corridor: {
      lamps: [
        { power: 0.4, reach: 1100, rim: 0.65, shadow: 0.65, floor: [360, 600], height: 470 },
        { power: 0.4, reach: 1100, rim: 0.65, shadow: 0.65, floor: [930, 600], height: 470 },
        { power: 0.3, reach: 800, rim: 0.55, shadow: 0.55, floor: [482, 520], height: 270 },
        { power: 0.3, reach: 800, rim: 0.55, shadow: 0.55, floor: [796, 505], height: 255 },
      ],
      light: { flickerShade: 0.14 },
    },
    // the archive: the pendant over the desk, the lantern by the stairs, the green desk lamp (its shade is green, its
    // light on the desk: a glow only), and the day coming down through the high window (the room's light shaft)
    archive: {
      lamps: [
        { power: 0.45, reach: 1150, rim: 0.65, shadow: 0.7, floor: [617, 610], height: 460 },
        { power: 0.32, reach: 900, rim: 0.6, shadow: 0.6, floor: [1172, 600], height: 430 },
        null,
      ],
      add: [{ x: 866, y: 132, rgb: DAY, kind: 'steady', power: 0.25, reach: 1300, rim: 0.45, shadow: 0.45, floor: [888, 570], height: 440 }],
    },
    // the Casa de Colón, by day: the window on the right, the open balcony door on the left, the desk lamp, and the
    // lantern out on the balcony (lit, but in daylight it adds little)
    colon: {
      lamps: [
        { power: 0.1, reach: 600, rim: 0.4, shadow: false, floor: [118, 520], height: 330 },
        { power: 0.25, reach: 750, rim: 0.55, shadow: 0.45, floor: [1043, 590], height: 200 },
      ],
      add: [
        { x: 1185, y: 300, rgb: DAY, kind: 'steady', power: 0.35, reach: 1400, rim: 0.5, shadow: 0.6, floor: [1150, 570], height: 420 },
        { x: 110, y: 330, rgb: DAY, kind: 'steady', power: 0.25, reach: 1100, rim: 0.4, shadow: 0.45, floor: [120, 560], height: 380 },
      ],
      light: { rim: 'rgba(220,230,245,0.18)', rimSide: 1 },
    },
    // Baute's office, at night: the desk lamp is the room's light; the small lamp by the door
    baute_office: {
      lamps: [
        { power: 0.55, reach: 1100, rim: 0.75, shadow: 0.7, floor: [757, 610], height: 300 },
        { power: 0.28, reach: 750, rim: 0.55, shadow: 0.55, floor: [40, 585], height: 320 },
      ],
    },
    // Santa Ana inside, by day: the stained glass high on the left; the candles at the altars far back light little
    // this far forward, but they cast a faint shadow towards us
    santa_ana_inside: {
      lamps: [
        { power: 0.15, reach: 1000, rim: 0.4, shadow: 0.4, floor: [340, 440], height: 120 },
        { power: 0.12, reach: 900, rim: 0.4, shadow: 0.35, floor: [80, 430], height: 70 },
        { power: 0.12, reach: 900, rim: 0.4, shadow: 0.35, floor: [750, 440], height: 70 },
      ],
      add: [{ x: 120, y: 110, rgb: '225,225,245', kind: 'steady', power: 0.32, reach: 1500, rim: 0.5, shadow: 0.5, floor: [170, 560], height: 620 }],
      light: { rim: 'rgba(210,215,240,0.16)', rimSide: -1 },
    },
    // La Isleta, under cloud: the lit lamp on the left quay is all; overcast light casts no shadows of its own
    isleta: {
      lamps: [{ power: 0.12, reach: 650, rim: 0.5, shadow: 0.25, floor: [96, 455], height: 280 }],
    },


    // ---------------------------------------------------------------- the other 22 rooms (the user, 2026-11-04: "do the
    // other 23 rooms too"; the map has no figures). Overcast outdoors (the panza de burro): a soft sky light from above,
    // faint shadows straight under; sunlit: a sun with its shadows the way the painting's fall; indoors: windows by day,
    // lamps by night.
    // Gando airport: the wall of glass on the left, the ceiling's strip light
    gando: {
      add: [
        { x: 230, y: 250, rgb: DAY, kind: 'steady', power: 0.32, reach: 1500, rim: 0.5, shadow: 0.45, floor: [300, 540], height: 500 },
        { x: 830, y: 40, rgb: '240,245,240', kind: 'steady', power: 0.2, reach: 1300, rim: 0.35, shadow: 0.25, floor: [830, 600], height: 900 },
      ],
      light: { rim: 'rgba(225,232,245,0.16)', rimSide: -1 },
    },
    // the hotel lobby: by day the street windows on the left (and the lamps, lit); at night the wall lamp and the desk lamp
    hotel_lobby: {
      add: [
        { x: 120, y: 260, rgb: DAY, kind: 'steady', power: 0.3, reach: 1400, rim: 0.5, shadow: 0.45, floor: [160, 600], height: 450, when: () => !S.lobbyNight() },
        { x: 398, y: 150, rgb: WARM, kind: 'gas', seed: 3, power: 0.32, reach: 900, rim: 0.6, shadow: 0.55, floor: [400, 560], height: 420, when: () => S.lobbyNight() },
        { x: 810, y: 240, rgb: '255,210,140', kind: 'steady', power: 0.28, reach: 800, rim: 0.55, shadow: 0.45, floor: [810, 560], height: 300, when: () => S.lobbyNight() },
        { x: 810, y: 240, rgb: '255,210,140', kind: 'steady', power: 0.12, reach: 600, rim: 0.4, shadow: false, when: () => !S.lobbyNight() },
      ],
    },
    // room 404: the open balcony door on the right, the bedside lamp
    hotel_room: {
      add: [
        { x: 900, y: 320, rgb: DAY, kind: 'steady', power: 0.35, reach: 1400, rim: 0.55, shadow: 0.5, floor: [900, 630], height: 450 },
        { x: 20, y: 350, rgb: '255,205,140', kind: 'steady', power: 0.12, reach: 600, rim: 0.4, shadow: false },
      ],
      light: { rim: 'rgba(225,232,245,0.14)', rimSide: 1 },
    },
    // Las Canteras, the museum's street, the courtyard, the Santa Ana square, the Colón square: under cloud
    canteras: { add: [{ x: 640, y: -400, rgb: '235,235,235', kind: 'steady', power: 0.28, reach: 2400, rim: 0.3, shadow: 0.3, floor: [640, 620], height: 2000 }] },
    museum_out: { add: [{ x: 640, y: -400, rgb: '235,235,235', kind: 'steady', power: 0.28, reach: 2400, rim: 0.3, shadow: 0.3, floor: [640, 620], height: 2000 }] },
    museum_courtyard: { add: [{ x: 640, y: -400, rgb: '235,235,235', kind: 'steady', power: 0.28, reach: 2400, rim: 0.3, shadow: 0.3, floor: [640, 660], height: 2000 }] },
    santa_ana: { add: [{ x: 640, y: -400, rgb: '235,235,235', kind: 'steady', power: 0.28, reach: 2400, rim: 0.3, shadow: 0.3, floor: [700, 650], height: 2000 }] },
    colon_out: { add: [{ x: 640, y: -400, rgb: '235,235,235', kind: 'steady', power: 0.28, reach: 2400, rim: 0.3, shadow: 0.3, floor: [640, 620], height: 2000 }] },
    // the beach: under cloud; once the sun is out, the sun behind on the right (the surfboards' shadows fall left, towards us)
    beach: {
      add: [
        { x: 640, y: -400, rgb: '235,235,235', kind: 'steady', power: 0.28, reach: 2400, rim: 0.3, shadow: 0.3, floor: [640, 660], height: 2000, when: () => !S.F().sun_out },
        { x: 1500, y: -300, rgb: '255,244,220', kind: 'steady', power: 0.4, reach: 2600, rim: 0.65, shadow: 0.6, floor: [1250, 470], height: 1400, when: () => !!S.F().sun_out },
      ],
      light: () => (S.F().sun_out ? { rim: 'rgba(255,240,215,0.22)', rimSide: 1 } : {}),
    },
    // the museum hall at the party: the hanging lanterns either side
    museum_hall: {
      add: [
        { x: 220, y: 190, rgb: WARM, kind: 'flame', seed: 2, power: 0.36, reach: 1300, rim: 0.6, shadow: 0.5, floor: [230, 600], height: 410 },
        { x: 1040, y: 270, rgb: WARM, kind: 'flame', seed: 6, power: 0.36, reach: 1300, rim: 0.6, shadow: 0.5, floor: [1040, 600], height: 330 },
      ],
    },
    // the market: the day through the glass roof, straight down
    mercado: { add: [{ x: 640, y: -200, rgb: '240,240,232', kind: 'steady', power: 0.26, reach: 2000, rim: 0.4, shadow: 0.3, floor: [640, 600], height: 1300 }] },
    // the hotel restaurant: the arched windows on the left
    hotel_restaurant: {
      add: [{ x: 220, y: 200, rgb: DAY, kind: 'steady', power: 0.35, reach: 1500, rim: 0.5, shadow: 0.45, floor: [250, 580], height: 420 }],
      light: { rim: 'rgba(225,232,245,0.16)', rimSide: -1 },
    },
    // the belfry: the day through the arch on the right, low, so the shadows run long into the room
    belfry: {
      add: [{ x: 1040, y: 340, rgb: '245,238,222', kind: 'steady', power: 0.42, reach: 1400, rim: 0.6, shadow: 0.6, floor: [990, 580], height: 300 }],
      light: { rim: 'rgba(245,238,222,0.18)', rimSide: 1 },
    },
    // Rafa's studio: the window; the lantern by the door
    rafa_studio: {
      add: [
        { x: 780, y: 220, rgb: DAY, kind: 'steady', power: 0.35, reach: 1300, rim: 0.55, shadow: 0.5, floor: [770, 610], height: 390 },
        { x: 1170, y: 180, rgb: WARM, kind: 'gas', seed: 4, power: 0.12, reach: 600, rim: 0.4, shadow: false },
      ],
      light: { rim: 'rgba(225,232,245,0.14)', rimSide: 1 },
    },
    // the camp above the cloud: full sun, high on the left
    camp: {
      add: [{ x: 200, y: -300, rgb: '255,244,222', kind: 'steady', power: 0.4, reach: 2600, rim: 0.6, shadow: 0.6, floor: [320, 560], height: 1500 }],
      light: { rim: 'rgba(255,240,215,0.2)', rimSide: -1 },
    },
    // Cave 6: the shaft of day through the hole in the dome, the opening on the left; the chamber under it, its hole
    cave6: {
      add: [
        { x: 640, y: 50, rgb: '255,244,222', kind: 'steady', power: 0.35, reach: 1300, rim: 0.55, shadow: 0.5, floor: [640, 560], height: 600 },
        { x: 120, y: 320, rgb: DAY, kind: 'steady', power: 0.22, reach: 1100, rim: 0.45, shadow: 0.35, floor: [150, 560], height: 300 },
      ],
    },
    cave6_low: { add: [{ x: 640, y: 30, rgb: '255,244,222', kind: 'steady', power: 0.35, reach: 1300, rim: 0.55, shadow: 0.5, floor: [640, 600], height: 700 }] },
    // the vault: the lantern on the left, the torch behind the bars, the day down the stairs; the cell, the light outside it
    vault: {
      add: [
        { x: 280, y: 280, rgb: WARM, kind: 'flame', seed: 5, power: 0.32, reach: 900, rim: 0.6, shadow: 0.5, floor: [290, 600], height: 330 },
        { x: 730, y: 240, rgb: WARM, kind: 'torch', seed: 8, power: 0.15, reach: 700, rim: 0.45, shadow: 0.3, floor: [730, 560], height: 320 },
        { x: 1160, y: 100, rgb: DAY, kind: 'steady', power: 0.18, reach: 1000, rim: 0.4, shadow: 0.3, floor: [1130, 600], height: 500 },
      ],
      light: { flickerShade: 0.12 },
    },
    vault_cell: { add: [{ x: 920, y: 300, rgb: WARM, kind: 'flame', seed: 3, power: 0.3, reach: 900, rim: 0.6, shadow: 0.45, floor: [900, 600], height: 300 }] },
    // Carmen's flat, at night: the hanging lamp, the table lamp by the sofa
    carmen_flat: {
      add: [
        { x: 450, y: 70, rgb: WARM, kind: 'gas', seed: 2, power: 0.32, reach: 1000, rim: 0.6, shadow: 0.5, floor: [450, 600], height: 530 },
        { x: 370, y: 330, rgb: '255,210,140', kind: 'steady', power: 0.25, reach: 700, rim: 0.55, shadow: 0.4, floor: [370, 560], height: 230 },
      ],
    },
    // the two cars at night: the moon through the windscreen; no shadows in a car
    elena_car: { add: [{ x: 930, y: 90, rgb: '200,215,245', kind: 'steady', power: 0.2, reach: 1400, rim: 0.5, shadow: false }] },
    landrover: { add: [{ x: 900, y: 150, rgb: '200,215,245', kind: 'steady', power: 0.18, reach: 1400, rim: 0.5, shadow: false }] },
  };

  const val = v => typeof v === 'function' ? v() : v;
  for (const [id, P] of Object.entries(PLAN)) {
    const R = ROOMS[id]; if (!R) { console.warn('lighting: no room ' + id); continue; }
    const own = R.lights, merge = ls => (ls || []).map((l, i) => P.lamps && P.lamps[i] ? Object.assign({}, l, P.lamps[i]) : l).concat(P.add || []);
    if (typeof own === 'function') R.lights = () => merge(own()); else R.lights = merge(own);
    if (P.light) { const L = R.light, add = () => val(P.light); R.light = typeof L === 'function' || typeof P.light === 'function' ? () => Object.assign({}, val(L), add()) : Object.assign({}, val(L), P.light); }
  }
})();
