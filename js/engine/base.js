// Engine base: the canvas and the DOM the engine draws into, the game's tables (rooms, items,
// characters, images), a few shared helpers, and the state every engine file reads and writes.
// All of it hangs on window.Engine (E). Loaded first of js/engine/*.js; js/engine.js (boot and
// window.Game) comes last. Each engine file adds its own functions to E for the others to call.
(function () {
  const W = 1280, H = 720;
  const canvas = document.getElementById('scene');
  const g = canvas.getContext('2d');
  const $ = s => document.querySelector(s);
  const wrap = $('#game'), speechEl = $('#speech'), narrEl = $('#narration'), hoverEl = $('#hover');
  const invEl = $('#inventory'), invBar = $('#invbar'), dialogEl = $('#dialog'), labelsEl = $('#labels');

  const ROOMS = {}, ITEMS = {}, CHARS = {};
  const IMG = {}; // loaded images by key
  const GROUND_K = 2.2; // distances on the floor count vertical px this many times (depth)

  function freshState() { return { room: 'shop', inv: [], flags: {}, px: 300, py: 600, dir: 'w' }; }
  // clears a scratch canvas, growing it to at least w x h
  function fit(c, ctx, w, h) {
    if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, c.width, c.height);
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  const E = window.Engine = {
    W, H, canvas, g, $, wrap, speechEl, narrEl, hoverEl, invEl, invBar, dialogEl, labelsEl,
    ROOMS, ITEMS, CHARS, IMG, GROUND_K, freshState, fit, wait,
  };

  // ---------------------------------------------------------------- shared state
  E.state = freshState(); // what a save holds: room, inventory, flags (see saves.js)
  E.room = null; E.fogA = null; E.fogB = null;
  E.player = null; E.npcs = [];
  E.selItem = null;       // the inventory item on the cursor
  E.busy = 0; E.cutscene = 0;
  E.skipFn = null; E.dialogResolve = null;
  E.time = 0;             // scene clock (s), advanced by the frame loop
  E.SPRITES = {};         // frame metadata (js/sprites.js), handed over by init
  E.phraseEndT = -1;      // when the current speaker last came to the end of a phrase
  E.roomLights = [];      // this frame's lights, flicker applied (lights.js)
  E.speaking = null;      // { id, actor } of the line being spoken
  E.lastPartner = null;   // whoever Alan is talking with (speech.js: faceEachOther)
  E.invHover = false;     // the pointer is over the inventory bar
  E.still = null;         // the full-screen painting up now (stills.js)
})();
