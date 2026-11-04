// Light and shadow on the figures, as Game I lights its rooms (HANDOFF 158; the user, 2026-11-04: "start with the seven
// lamp-lit rooms"). FOR REVIEW: only with ?light=2 in the address (or localStorage '<GAME_KEY>-light' = '2'); without
// it nothing here runs and the rooms are as they were.
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
  const S = window.S, ROOMS = S.ROOMS;
  let on = /[?&]light=2\b/.test(location.search);
  try { on = on || localStorage.getItem(window.GAME_KEY + '-light') === '2'; } catch (e) { /* no storage */ }
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
  };

  const val = v => typeof v === 'function' ? v() : v;
  for (const [id, P] of Object.entries(PLAN)) {
    const R = ROOMS[id]; if (!R) { console.warn('lighting: no room ' + id); continue; }
    const own = R.lights, merge = ls => (ls || []).map((l, i) => P.lamps && P.lamps[i] ? Object.assign({}, l, P.lamps[i]) : l).concat(P.add || []);
    if (typeof own === 'function') R.lights = () => merge(own()); else R.lights = merge(own);
    if (P.light) { const L = R.light; R.light = typeof L === 'function' ? () => Object.assign({}, L(), P.light) : Object.assign({}, val(L), P.light); }
  }
})();
