// What makes this game The Shortest Night for the engine (js/engine/*, js/engine.js, fx.js, audio.js), which is the
// same file for file in both games (Game I's copy is at the repository root): a fix made in one is copied to the
// other as it is, and anything that belongs to one game is set here, or by the story where the engine asks for it
// when it needs it (window.SPEAKERS, CALLED in js/lines.js; PAINTED_ICONS, ICON_LABELS, FAIL_BY_CHAR in
// js/story/core.js; FIRST_ROOM, BG1X in js/story/main.js). Loaded first, before the engine.
window.GAME_KEY = 'shortest-night';      // the start of every localStorage key: saves, settings, tips, volumes
window.SAVE_SLOT = 'v1';                 // the save's key: shortest-night-save-v1 (and -manual)
window.SAVE_VERSION = 1;                 // the shape of a save; bump it and add a step to SAVE_MIGRATE when it changes
window.SAVE_MIGRATE = {};
window.FOOTSTEPS = false;                // the user, 2026-10-29: "definitely the stepping sounds from walking" out
window.TURNERS = ['vasco', 'carmen', 'yeray']; // who turns to follow Alan as people speak (engine/speech.js)
// Game I's track names, kept so a forked call never falls silent: its main theme is this game's title theme
window.MUSIC_LEGACY = { main_theme: 'title', title: 'title' };
// first-time tips of this game's own (engine/tips.js; T(mouse text, touch text)); 'ines' is the one when stuck
window.GAME_TIPS = {
  ines: () => 'Stuck? Call Inês from the phone box on Las Canteras: she always knows what to try next.',
  vasco: () => 'You are Vasco now: slower, and he reads his way through. Look at everything.',
};
