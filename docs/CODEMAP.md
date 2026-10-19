# Code map

Plain HTML, CSS and JavaScript: no build step, no modules. `index.html` loads every script with a `<script>` tag, in the order below, and the files share globals on `window`. Each file is an IIFE that reads what it needs from those globals and adds its own.

## Load order and what each file owns

| # | File | Owns |
|---|---|---|
| 1 | `js/lines.js` | `window.LINES`: every voiced line, `id: [speaker, text]`. Data: line ids map to `audio/voice/<id>.mp3`, so never rename an id. |
| 2 | `js/sprites.js` | `window.SPRITES`: frame metadata (size, feet and head anchors, pair anchors). **Generated.** |
| 3 | `js/morphs.js` | `window.MORPHS`: mesh correspondences for smooth pose changes. **Generated.** |
| 4 | `js/similar.js` | `window.SIMILAR`: near-identical frame pairs (short cross-fade). **Generated.** |
| 5 | `js/fx.js` | `window.FX`: fog, glows, light shafts, birds, water, vignette, clouds, painted inventory icons. |
| 6 | `js/audio.js` | `window.Sound`: recorded music (crossfades, ducking), effects, ambience loops, footsteps, room acoustics, voice playback and level. |
| 7 | `js/warp.js` | `window.Warp`: the WebGL mesh warp and GPU lighting for painted figures. |
| 7b | `js/parallax.js` | `window.Parallax`: depth parallax in every room (`art/bg/<bg>_depth.png` from `scripts/depth_map.py`; a room opts out with `parallax: false`, as the map does; `?noparallax` turns it off; it switches off with the mesh warp on a slow device). render.js draws the painting with its animated back and layers into one canvas, slides it by depth, and moves figures and occluders by the depth at their feet. |
| 8 | `js/engine/base.js` | `window.Engine` (`E`): the canvas and DOM elements, the tables (`ROOMS`, `ITEMS`, `CHARS`, `IMG`), helpers (`fit`, `wait`, `freshState`), `GROUND_K`, and **all shared engine state** (`E.room`, `E.player`, `E.busy`, ...). |
| 9 | `js/engine/actor.js` | `class Actor`: walking, idle and talk frames, in-betweens, breath and sway, listening, turning, frame mixing (`composeFrames`, `sameFacing`), drawing a figure. |
| 10 | `js/engine/lights.js` | Room lights and flicker, glows, light on characters (`lightSprite`, `lightParams`), cast and contact shadows. |
| 11 | `js/engine/geometry.js` | Walk polygons, routing round cut-outs, rounded corners, hotspot and sprite-pixel hit tests. |
| 12 | `js/engine/rooms.js` | Depth scaling (`scaleAt`), `goRoom` (door sounds, fades, music, ambience, autosave), NPCs and extras per room, room labels. |
| 13 | `js/engine/render.js` | One frame (background, layers, depth-sorted actors and occluders, fog, grade) and the animation loop. |
| 14 | `js/engine/smoke.js` | Alan's idle cigarette. |
| 15 | `js/engine/speech.js` | `say` / `says` (one voice at a time, captions), speakers facing each other, sung lyrics, the dialogue menu. |
| 16 | `js/engine/inventory.js` | Items, the inventory bar, item-on-item use, the item cursor, reading the notebook. |
| 17 | `js/engine/input.js` | Hover and cursor shapes, mouse / touch / keys, the smart action (`interact`: walk up, reach, run the handler, fail lines). |
| 18 | `js/engine/stills.js` | Full-screen stills (Ken Burns, cross-fades), close-ups, the clock overlay. |
| 19 | `js/engine/saves.js` | Autosave and the menu's save, load, chapter cards, the ☰ menu, toasts. |
| 20 | `js/engine.js` | Asset preloading, `init` / `begin` / `sandbox`, and the public API `window.Game`. |
| 21 | `js/story/core.js` | `window.S`: the story layer. Its `say` (line poses, reactions), combined sprites (`S.pairIn` / `S.pairOut`), the cast (`S.CHARS`), items (`S.ITEMS`), helpers, the map, Inês's hints. |
| 22 | `js/story/ines.js` | Inês's frames, reactions to lines, and her jobs around the shop. |
| 23 | `js/story/docs.js` | Readable documents as close-ups: ledger, 1955 file, list, tide card, repair book, notebook, lyrics, newspaper, Ferreira's drawer lock, tide clock. |
| 24 | `js/story/ch1.js` | Chapter I rooms: shop, street (tram), map, police (Teixeira's phone cord), tavern. |
| 25 | `js/story/ch2.js` | Chapter II: the Lavadouro (and the bath), Relojoaria Ferreira. |
| 26 | `js/story/ch3.js` | Chapter III: the convent by day (cipher wheel), Sé bell tower, Antiguidades Lacerda. |
| 27 | `js/story/ch4.js` | Chapter IV: Cais do Sodré, the Maria Fé (deck and cabin). |
| 28 | `js/story/ch5.js` | Chapter V: Carmo at midnight, the cistern rite, dawn and epilogue. |
| 29 | `js/story/visits.js` | Teixeira's and Duarte's visits to the shop, and Alan's room upstairs. |
| 30 | `js/story/se.js` | The Sé: museum, cloister and casting pit (the toss), Vasco's arc, the reserve. |
| 31 | `js/story/vasco.js` | Vasco at work in the pit: his jobs (trowel, brush, sieve, a sherd, his notebook, a coin), alternating painted frames, stopping when anything happens. |
| 32 | `js/story/coldopen.js` | The cold open (Maria Coutinho's last minute). |
| 33 | `js/story/fado.js` | "O Sino Afogado" staged in the Taberna. |
| 34 | `js/story/transitions.js` | Chapter transitions and the fado slideshow. |
| 35 | `js/story/main.js` | Shared painted effects, shop chapter hooks, `?scene=` previews, the content setting, the opening and `window.Story.newGame`, approved review frames, `Game.init`. |
| - | `js/review.js` | The `?review` animation review screen. Not in `index.html`: `main.js` loads it only when `?review` is in the address. |
| - | `css/style.css` | All styling (frame, captions, inventory, menus, modals, close-ups). |

## Globals

| Global | Defined in | Notes |
|---|---|---|
| `window.Engine` (`E`) | `js/engine/base.js` | Engine internals: shared state, tables, and every engine file's functions (`E.goRoom`, `E.say`, ...). Engine files only. |
| `window.Game` (`G` in story files) | `js/engine.js` | The public engine API the story uses: `goRoom`, `say`, `dialog`, `showStill`, `closeup`, `giveItem`, `flags`, `player`, `npc(id)`, `act(...)` (test hook), ... |
| `window.S` | `js/story/core.js` | Story state and helpers; chapter files add rooms to `S.ROOMS` and functions to `S`. |
| `window.Story` | `js/story/main.js` | `newGame`. |
| `window.LINES`, `SPRITES`, `MORPHS`, `SIMILAR` | `js/lines.js`, generated files | Data. |
| `window.FX`, `Sound`, `Warp` | `js/fx.js`, `js/audio.js`, `js/warp.js` | Services. |
| `window.STILLS`, `CLOSEUPS`, `EXTRA_STILLS` | `js/story/main.js`, `se.js`, `transitions.js` | Paintings the engine preloads. |
| `window.MOUTHS` | (not set yet) | Phase 4 mouth overlays for combined sprites. |
| `window.FAST`, `WARP`, `LIT3D`, `ANIM_T`, `HOLD`, `ADVANCE`, `STEP_DT`, `TIME_SCALE` | set by tests and the review screen | Switches: `FAST` skips waits and easing (tests); `WARP` / `LIT3D` force the mesh warp and GPU lighting on or off; the rest step or slow the clock. |

Engine state lives on `E` so the engine files can share it: `E.state` (what a save holds: room, inventory, flags), `E.room`, `E.player`, `E.npcs`, `E.selItem`, `E.busy`, `E.cutscene`, `E.skipFn`, `E.dialogResolve`, `E.time`, `E.SPRITES`, `E.speaking`, `E.still` and a few more, all set up in `js/engine/base.js`. A file's private state stays a `let` inside its IIFE.

## Conventions

- Sections inside a file start with `// ---------------------------------------------------------------- name`. The chapter files mark each room with `// ================================================================ ROOM`.
- Each file starts with a comment saying what lives there.
- Adding an engine function another engine file needs: define it in its file and add it to that file's closing `Object.assign(E, { ... })`. Call it from elsewhere as `E.name(...)`. Anything the story needs goes on `window.Game` in `js/engine.js`.
- A new script needs a `<script>` tag in `index.html` in the right place; then run `node scripts/build-manifest.mjs`, which stamps every script and the stylesheet with `?v=<content hash>`.

## Generated files (do not edit by hand)

| File | Regenerate with |
|---|---|
| `js/sprites.js` | `scripts/matte.py` (cut-outs and anchors); `scripts/align_alan.py --apply` (Alan's solo anchors); `scripts/pair_anchors.py --apply` (pair anchors); `scripts/promote.py` (approved review frames made game sprites) |
| `js/morphs.js` | `python3 scripts/morphs.py framesets.json` |
| `js/similar.js` | `python3 scripts/similar.py [THRESHOLD]` |
| `audio/voice/manifest.json`, `audio/sfx/manifest.json`, the `?v=` hashes in `index.html` | `node scripts/build-manifest.mjs` (also the Netlify build command) |
| `art/review/candidates.json`, `art/review/candidates/*.webp` | `python3 scripts/review_candidates.py` |
| `art/layers/*.webp` | `scripts/layers.py` |
| `audio/voice/*.mp3` | `node scripts/generate-voices.mjs` (ElevenLabs, paid: only when asked) |

## Testing

Serve the repository root (`npx -y http-server -p 8098 -c-1 -s .`), then:

- `node --check` on every changed `.js` file.
- **Scene previews:** `?scene=<name>` jumps straight to a scene (the list is `PREVIEW` in `js/story/main.js`; also `tr1` to `tr5` for the chapter transitions). `?review` opens the review screen.
- **Smoke test** (Playwright, `executablePath: '/opt/pw-browsers/chromium'`, Playwright loaded with `createRequire('/opt/node22/lib/node_modules/')`): `node smoke.mjs http://localhost:8098/` opens every preview scene with `window.FAST` on, answers the dialogs and reports page errors. With `GEMINI=1` it approves every review candidate and uses the Gemini pair transitions: `GEMINI=1 node smoke.mjs http://localhost:8098/ celeste romance visitcop visitguitar cop copreturn guitar sepitgame vascostore vascolove`. Aborted music loads (`ERR_ABORTED` on `audio/music/...`) are known and harmless.
- **Pose probe:** `node probe.mjs <scene>` prints every pose Alan takes in a scene; compare it before and after a change that should not alter animation.
- **Full playthrough:** `node play.mjs http://localhost:8098/` plays a new game to the ending through real hotspots and dialogs, and prints `{"won":true, "errors":[], ...}` when it gets there.

The three test scripts are kept outside the repository (in the session's scratchpad, `tests/`).
