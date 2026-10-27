// The Shortest Night — where things are in each painted room: the walkable floor, how big a figure is at each depth
// (scale: [y near the back, height there, y at the front, height there]), where people stand, each hotspot's box, and
// the furniture that hides whoever stands behind it. The story files say what things do; this file says where they
// are in the painting, so a repainted room only needs its entry here redone. Rooms not listed keep the defaults
// from S.room() (the placeholder layout).
(function () {
  const S = window.S;
  S.LAYOUT = {
    canteras: {
      walk: [[0, 640], [275, 630], [430, 590], [1040, 575], [1280, 600], [1280, 716], [0, 716]], scale: [590, 255, 716, 300],
      entries: { default: [640, 660, 'e'], map: [640, 660, 'e'], hotel_lobby: [1180, 650, 'w'] },
      spots: { 'The sea': [420, 365, 600, 100], 'Promenade steps': [520, 485, 380, 75], 'Bonfires': [600, 405, 300, 80], 'Phone box': [292, 288, 130, 310],
        'Kiosk': [0, 165, 265, 460], 'Hotel Cristina': [1100, 120, 180, 470], 'To the city': [0, 600, 50, 116] },
      npcs: { chano: [150, 660], surfer: [960, 640] },
    },
    gando: {
      walk: [[0, 560], [300, 570], [880, 540], [1100, 520], [1280, 515], [1280, 716], [0, 716]], scale: [520, 250, 716, 340],
      entries: { default: [200, 640, 'e'], map: [200, 640, 'e'] },
      spots: { 'Baggage belt': [300, 430, 580, 130], 'Arrivals board': [550, 80, 390, 200], 'Taxi rank': [1145, 250, 115, 260], 'Back to the city': [1145, 250, 115, 260] },
      npcs: { vasco: [930, 600], clerk: [990, 540] },
    },
    hotel_lobby: {
      walk: [[0, 560], [345, 592], [940, 592], [1000, 528], [1080, 528], [1060, 716], [0, 716]], scale: [560, 370, 716, 450],
      entries: { default: [150, 640, 'e'], map: [150, 640, 'e'], canteras: [150, 640, 'e'], gando: [150, 640, 'e'], hotel_room: [1030, 560, 'w'] },
      spots: { 'Lost and found box': [440, 270, 120, 80], 'Fax machine': [695, 305, 95, 50], 'House phone': [845, 320, 65, 35], 'Lifts': [1005, 100, 195, 420],
        'Out to Las Canteras': [0, 60, 230, 450] },
      npcs: { nieves: [640, 555], gail: [190, 640], derek: [280, 655] },
      at: { nieves: [700, 620] },
      occluders: [{ y: 585, polys: [[[345, 345], [940, 345], [940, 582], [345, 582]]] }],
    },
    hotel_room: {
      walk: [[600, 560], [1150, 560], [1280, 600], [1280, 716], [380, 716], [560, 640]], scale: [560, 380, 716, 450],
      entries: { default: [900, 640, 'w'], hotel_lobby: [1120, 640, 'w'] },
      spots: { 'Balcony window': [810, 100, 220, 440], 'Bed': [30, 340, 570, 280], 'Note on the pillow': [60, 400, 80, 40], 'Vasco\'s field bag': [665, 470, 95, 75],
        'Packed bag': [665, 470, 95, 75], 'Door': [1155, 120, 125, 460] },
      npcs: { vasco: [760, 620] },
    },
    museum_hall: {
      walk: [[0, 580], [170, 562], [600, 522], [1280, 532], [1280, 716], [0, 716]], scale: [520, 260, 716, 360],
      entries: { default: [140, 650, 'e'], map: [140, 650, 'e'], archive: [920, 560, 'w'], baute_office: [520, 560, 's'] },
      spots: { 'Display cases': [170, 250, 220, 310], 'Corridor to the offices': [440, 300, 150, 210], 'Archive stairs': [840, 260, 160, 255],
        'Door to the steps': [1050, 230, 205, 300], 'Montesdeoca\'s van': [1050, 230, 205, 300], 'Out to Vegueta': [0, 120, 130, 440], 'Dinner table': [640, 290, 185, 230] },
      npcs: { baute: [560, 600], vasco: [780, 590], carmen: [1150, 545], montesdeoca: [320, 640], guard: [515, 545], gail: [940, 620], derek: [1030, 630] },
    },
    archive: {
      walk: [[90, 700], [380, 622], [860, 618], [960, 572], [1150, 572], [1160, 716], [90, 716]], scale: [580, 410, 716, 480],
      entries: { default: [1040, 600, 'w'], museum_hall: [1040, 600, 'w'] },
      spots: { 'Conservation list': [530, 215, 90, 115], 'Ashtray': [700, 412, 40, 20], 'Photographs of Cave 6': [635, 220, 150, 130], 'Stacks': [0, 40, 460, 560],
        'Stairs up to the hall': [960, 210, 200, 350] },
      npcs: { carmen: [900, 640] },
    },
    santa_ana: {
      walk: [[270, 600], [500, 505], [830, 505], [1000, 560], [1280, 600], [1280, 716], [270, 716]], scale: [510, 150, 716, 380],
      entries: { default: [400, 690, 'e'], map: [400, 690, 'e'], belfry: [580, 520, 's'] },
      spots: { 'Cathedral clock': [555, 185, 45, 45], 'Bronze dogs': [40, 295, 380, 400], 'Timple players': [960, 410, 200, 180], 'Cathedral door': [540, 385, 75, 115],
        'To the city': [1230, 600, 50, 116] },
      npcs: { fermin: [690, 560] },
      at: { 'Cathedral clock': [580, 520], 'Cathedral door': [580, 515] },
    },
    belfry: {
      walk: [[200, 600], [1240, 600], [1280, 716], [190, 716]], scale: [590, 320, 716, 390],
      entries: { default: [280, 660, 'e'], santa_ana: [280, 660, 'e'] },
      spots: { 'Clock winding drum': [130, 190, 290, 200], 'The north bell': [515, 150, 250, 260], 'Bell window': [915, 40, 270, 500], 'Stairs down': [0, 90, 195, 550] },
      npcs: { fermin: [900, 640] },
    },
    colon: {
      walk: [[0, 600], [1280, 600], [1280, 716], [0, 716]], scale: [590, 330, 716, 400],
      entries: { default: [200, 660, 'e'], map: [200, 660, 'e'] },
      spots: { 'Parrot': [320, 215, 70, 100], 'Shelves': [465, 150, 470, 420], 'Balcony': [20, 120, 200, 400], 'To the city': [0, 600, 50, 116] },
      npcs: { mercedes: [640, 650] },
    },
    isleta: {
      walk: [[0, 500], [290, 470], [780, 495], [800, 585], [900, 650], [1280, 700], [1280, 716], [0, 716]], scale: [480, 160, 716, 330],
      entries: { default: [200, 640, 'e'], map: [200, 640, 'e'] },
      spots: { 'Nets': [820, 360, 460, 220], 'Fishing boats': [380, 300, 520, 100], 'The things in the nets': [910, 560, 240, 110], 'To the city': [60, 240, 100, 210] },
      npcs: { pino: [620, 570], lolo: [760, 600] },
      at: { 'The things in the nets': [880, 660], 'Nets': [800, 600] },
    },
    rafa_bar: {
      walk: [[0, 622], [720, 588], [1040, 560], [1280, 545], [1280, 716], [0, 716]], scale: [560, 380, 716, 450],
      entries: { default: [1120, 640, 'w'], map: [1120, 640, 'w'] },
      spots: { 'Bottles': [0, 80, 410, 230], 'Domino table': [710, 360, 300, 190], 'Door': [1080, 100, 140, 420] },
      npcs: { rafa: [460, 575], yeray: [110, 660] },
      at: { rafa: [560, 640] },
      occluders: [{ y: 595, polys: [[[0, 340], [715, 340], [715, 585], [0, 605]]] }],
    },
    rafa_studio: {
      walk: [[350, 592], [1220, 560], [1280, 716], [0, 716], [0, 600]], scale: [550, 350, 716, 430],
      entries: { default: [520, 650, 'e'], map: [1120, 600, 'w'] },
      spots: { 'The drawing on the easel': [875, 190, 170, 200], 'Sketchbook': [470, 490, 170, 30], 'Bed': [0, 400, 355, 185], 'Window': [650, 100, 265, 250],
        'Door': [1110, 90, 170, 490] },
      npcs: { rafa: [980, 630] },
    },
    carmen_flat: {
      walk: [[240, 600], [540, 562], [840, 508], [1045, 522], [1280, 545], [1280, 716], [0, 716], [0, 612]], scale: [540, 410, 716, 470],
      entries: { default: [1120, 620, 'w'], map: [1120, 620, 'w'] },
      spots: { 'Answering machine': [330, 378, 70, 34], 'Elena\'s box': [0, 505, 125, 80], 'Fridge': [750, 175, 120, 295], 'Window': [925, 100, 125, 180],
        'Shelves': [270, 50, 500, 190], 'Door': [1140, 50, 140, 490] },
      npcs: { carmen: [700, 610] },
      at: { 'Elena\'s box': [240, 640], 'Answering machine': [420, 620] },
    },
  };

  // put a room's layout into its definition (called by main.js before the game starts)
  S.applyLayout = function (ROOMS) {
    const nameOf = h => { try { return typeof h.name === 'function' ? h.name() : h.name; } catch (e) { return null; } };
    for (const [id, L] of Object.entries(S.LAYOUT)) {
      const r = ROOMS[id]; if (!r) continue;
      if (L.walk) r.walk = L.walk;
      if (L.scale) r.scale = L.scale;
      if (L.entries) r.entries = Object.assign({}, r.entries, L.entries);
      if (L.occluders) r.occluders = L.occluders;
      for (const h of r.hotspots || []) {
        const n = nameOf(h);
        if (L.spots && L.spots[n]) { h.rect = L.spots[n]; delete h.at; }
        if (L.at && L.at[n]) h.at = L.at[n];
      }
      for (const n of (r.npcs || []).concat(r.ambient || [])) {
        const p = L.npcs && L.npcs[n.id]; if (p) { n.x = p[0]; n.y = p[1]; delete n.h; }
        if (L.at && L.at[n.id]) n.at = L.at[n.id];
      }
      r.painted = true;
    }
  };
})();
