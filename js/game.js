// What makes this game The Drowned Bell for the engine (js/engine/*, js/engine.js, fx.js, audio.js), which is the
// same file for file in both games (Game II's copy is in sequel/): a fix made in one is copied to the other as it is,
// and anything that belongs to one game is set here, or by the story where the engine asks for it when it needs it
// (window.SPEAKERS, CALLED in js/lines.js; PAINTED_ICONS, FAIL_BY_CHAR in js/story/core.js; BG2X in js/story/main.js).
// Loaded first, before the engine.
window.GAME_KEY = 'drowned-bell';        // the start of every localStorage key: saves, settings, tips, volumes
window.SAVE_SLOT = 'v3';                 // the save's key: drowned-bell-save-v3 (and -manual)
window.SAVE_VERSION = 1;                 // the shape of a save; bump it and add a step to SAVE_MIGRATE when it changes
window.SAVE_MIGRATE = {
  0: st => { // before versions (22 Oct 2026): the sketch became an item (Inês and Celeste take it)
    if (st.flags.sketched_tile && !st.inv.includes('sketch')) st.inv.push('sketch');
  },
};
window.FIRST_ROOM = 'shop';              // where a new game opens
window.FOOTSTEPS = true;
window.TURNERS = ['ines', 'vasco'];      // who turns to follow Alan as people speak (engine/speech.js)
// names the procedural score used, kept so an old call never falls silent
window.MUSIC_LEGACY = { fado: 'tavern_day', fog: 'alfama_day', office: 'police_station', church: 'carmo_day', antiques: 'antiques_shop', tension: 'quay_cais_do_sodre', dawn: 'main_theme', sino: 'tavern_night', title: 'main_theme' };
// first-time tips of this game's own (engine/tips.js; T(mouse text, touch text)); 'ines' is the one when stuck
window.GAME_TIPS = {
  ines: () => 'Stuck? Talk to Inês and ask her what now.',
  ch5: T => T('With Inês gone, think it through in your notebook (✎, or N).', 'With Inês gone, think it through in your notebook (✎).'),
};
// when the stuck tip may show: not from Chapter V, when Inês is gone
window.STUCK_TIP_WHEN = f => (f.ch || 1) < 5;
