# Code map

Plain HTML, CSS and JavaScript: no build step, no modules. `index.html` loads every script with a `<script>` tag, in the order below, and the files share globals on `window`. Each file is an IIFE that reads what it needs from those globals and adds its own.

## Load order and what each file owns

| # | File | Owns |
|---|---|---|
| 1 | `js/lines.js` | `window.LINES`: every voiced line, `id: [speaker, text]`. Data: line ids map to `audio/voice/<id>.mp3`, so never rename an id. |
| 2 | `js/sprites.js` | `window.SPRITES`: frame metadata (size, feet and head anchors, pair anchors). **Generated.** |
| 3 | `js/morphs.js` | `window.MORPHS`: mesh correspondences for smooth pose changes. **Generated.** Loaded `async` (3.5 MB): every use checks it's there, and until it is, pose changes cross-fade. |
| 4 | `js/similar.js` | `window.SIMILAR`: near-identical frame pairs (short cross-fade). **Generated.** |
| 5 | `js/fx.js` | `window.FX`: fog, glows, light shafts, birds, water, vignette, clouds, painted inventory icons, and the small moving details rooms draw over their paintings (`wisps`, `drips`, `sway` (with `up` for plants and flames), `breathe`, `ripple`, `billow`, `flame`, `trickles`, `rain`, `moth`, `twinkle`, `dapple`, `passer`, `sweep`, `feather`, `fan`; all deterministic in `t`). |
| 6 | `js/audio.js` | `window.Sound`: recorded music (crossfades, ducking), effects, ambience loops, footsteps, room acoustics, voice playback and level. |
| 7 | `js/warp.js` | `window.Warp`: the WebGL mesh warp and GPU lighting for painted figures. |
| 7b | `js/parallax.js` | `window.Parallax`: depth parallax in every room (`art/bg/<bg>_depth.png` from `scripts/depth_map.py`; a room opts out with `parallax: false`, as the map does; `?noparallax` turns it off; it switches off with the mesh warp on a slow device). render.js draws the painting with its animated back and layers into one canvas, slides it by depth, and moves figures and occluders by the depth at their feet. |
| 8 | `js/engine/base.js` | `window.Engine` (`E`): the canvas and DOM elements, the tables (`ROOMS`, `ITEMS`, `CHARS`, `IMG`), helpers (`fit`, `wait`, `freshState`), `GROUND_K`, and **all shared engine state** (`E.room`, `E.player`, `E.busy`, ...). |
| 9 | `js/engine/actor.js` | `class Actor`: walking, idle and talk frames, in-betweens, breath and sway, listening, turning, frame mixing (`composeFrames`, `sameFacing`), drawing a figure. |
| 10 | `js/engine/lights.js` | Room lights and flicker, glows, light on characters (`lightSprite`, `lightParams`), cast and contact shadows. |
| 11 | `js/engine/geometry.js` | Walk polygons, routing round cut-outs, rounded corners, hotspot and sprite-pixel hit tests. |
| 12 | `js/engine/rooms.js` | Depth scaling (`scaleAt`), `goRoom` (door sounds, fades, music, ambience, autosave), NPCs and extras per room, room labels. |
| 13 | `js/engine/render.js` | One frame (background, layers, depth-sorted actors and occluders, fog, grade) and the animation loop. Room `layers` can `swing` (degrees about `pivot`), `bob` (px) and carry an `over(g, t)` drawn with them (a lantern's flame); `?fps` shows a frame-rate readout. Room hooks: `animBack` (into the painting, slides with parallax: anything pinned to a painted object), `anim` (over it), `animFg` (over the figures). |
| 13a | `js/lipsync.js` | `window.LIPSYNC`: Rhubarb mouth cues per voiced line, `{speaker: {line: [duration, [[t, shape], ...]]}}`. **Generated** (`scripts/lipsync.py`). |
| 13b | `js/faces.js` | `window.FACES`: per frame, the face box, mouth shapes and eyelid patches (`art/faces/`), with `ok: true` once approved; a partner's face in a pair painting is the set `<frame>__<speaker id>`. **Generated** (`scripts/face_transfer.py`, `scripts/face_kit.py build`). |
| 13c | `js/engine/faces.js` | Lip-sync and blinking: lays the mouth (from the cues, on the audio clock) and the eyelids into the painting before it is lit and warped. |
| 13d | `js/engine/rig.js` | Alan's experimental side-view rig (`?rig=1`; off by default). |
| 14 | `js/engine/smoke.js` | Alan's idle cigarette. |
| 15 | `js/engine/speech.js` | `say` / `says` (one voice at a time, captions), speakers facing each other, sung lyrics, the dialogue menu. |
| 16 | `js/engine/inventory.js` | Items, the inventory bar, item-on-item use, the item cursor, reading the notebook. |
| 17 | `js/engine/input.js` | Hover and cursor shapes, mouse / touch / keys, the smart action (`interact`: walk up, reach, run the handler, fail lines). |
| 18 | `js/engine/stills.js` | Full-screen stills (Ken Burns, cross-fades), close-ups, the clock overlay. |
| 19 | `js/engine/saves.js` | Autosave and the menu's save, load, chapter cards, the ☰ menu, toasts. |
| 19b | `js/engine/tips.js` | First-time tips: one line in the corner the first time each thing would help, once each (`localStorage['drowned-bell-tips']`), never over a scene or a line; the menu's Tips button turns them off. Wraps `E.giveItem`, `E.say`, `E.dialog`, `E.card` to notice the moments; `Game.tip(id)` from the story (Chapter V's notebook). Off under `window.FAST`. |
| 20 | `js/engine.js` | Image streaming, `init` / `begin` / `sandbox`, and the public API `window.Game`. Every image is registered at start and loaded through one priority queue: the title waits for none of it; `goRoom` waits (on black) for the room's art and the stand/walk/talk frames of whoever is there (`E.roomReady`), `showStill` for its painting (`E.ensure`); the rest streams behind, paused while anything is waited on. A frame drawn before it lands asks for it next (`E.want`). `G.hasArt(key)` says whether art is part of the game (`G.image(key)` is null until it lands). `?preload=all` (and `?review`, the walk lab) load everything before the title, as before. `Game.loading()` reports progress and the time spent waiting. |
| 21 | `js/story/core.js` | `window.S`: the story layer. Its `say` (line poses, reactions), combined sprites (`S.pairIn` / `S.pairOut`), the cast (`S.CHARS`), items (`S.ITEMS`), helpers, the map, Inês's hints. |
| 22 | `js/story/ines.js` | Inês's frames, reactions to lines, and her jobs around the shop. |
| 23 | `js/story/docs.js` | Readable documents as close-ups: ledger, 1955 file, list, tide card, repair book, notebook, lyrics, newspaper, Ferreira's drawer lock, tide clock. |
| 24 | `js/story/ch1.js` | Chapter I rooms: shop, street (tram), map, police (Teixeira's phone cord), tavern. |
| 25 | `js/story/ch2.js` | Chapter II: the Lavadouro (and the bath), Relojoaria Ferreira. |
| 26 | `js/story/ch3.js` | Chapter III: the convent by day (cipher wheel), Sé bell tower, Antiguidades Lacerda. |
| 26b | `js/story/bastos.js` | Chapter II, Graça: Prof. Bastos's flat (`docs/bastos_level.md`; its spare key, `bkey`, hangs on Ferreira's key board in ch2.js). The collection close-up (`#bshelf`: eight objects, eight books by spine motif), the recorder close-up (`#brec`: the threading riddle, the lecture tapes, the last reel), the notebook's "The Sea" page (`S.sea`, `S.seaPages`), Inês's hints there (`S.bastosHint`), the unlock in the shop (wraps `ROOMS.shop.enter`), `S.bastosOpen` (the Chapter II end waits for `bastos_done`). Previews: `?scene=bastos`, `?scene=bastosunlock`. |
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
| - | `js/walklab.js` | The walk lab (`?scene=walklab`): a character walking a room with its current or candidate cycle, slow motion, feet on the floor, per-frame size and the planted foot's slip at each change of painting. Not in `index.html`: `main.js` loads it for that preview. |
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
| `window.LIPSYNC`, `FACES` | `js/lipsync.js`, `js/faces.js` | Generated data for lip-sync and blinking (see 13a-13c). |
| `window.FAST`, `WARP`, `LIT3D`, `ANIM_T`, `HOLD`, `ADVANCE`, `STEP_DT`, `TIME_SCALE` | set by tests and the review screen | Switches: `FAST` skips waits and easing (tests); `WARP` / `LIT3D` force the mesh warp and GPU lighting on or off (`WARP` null: automatic; a device with about four seconds of slow frames drops to false, and the ☰ menu's Effects button sets Full or Light, kept in `localStorage['drowned-bell-effects']`); the rest step or slow the clock. |

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
| `audio/sfx/step_*`, the sound pass's details and loops (`docs/SOUND.md`) | `python3 scripts/sound_new_prep.py <generations dir>` |
| `js/lipsync.js`, `lipsync/<speaker>/<id>.json` | `RHUBARB=<binary> python3 scripts/lipsync.py --speaker <id>` (redoes only lines whose mp3 changed; Rhubarb 1.13.0) |
| `js/faces.js`, `art/faces/` | `scripts/face_kit.py` (per character, `FACE_CHAR=<alan|vasco|ines|cop>`) |
| `art/review/candidates.json`, `art/review/candidates/*.webp` | `python3 scripts/review_candidates.py` |
| `art/layers/*.webp` | `scripts/layers.py` (from clean plates); `scripts/swing_cut.py` (moving parts: `<name>.webp` from the painting, `<name>_under.webp` inpainted behind it) |
| `art/review/candidates/*_walk6_*`, `*_walk7_*` and their entries in `art/review/candidates.json` | `scripts/walk_sheet.py` (Alan's set), `scripts/walk_sheet_cast.py fit <char>` (the cast), `scripts/walk_apply_cycle.py` (a cycle built in the walk editor). Each prints the plant data, which goes into `S.WALK_PLANT` in `js/story/core.js` by hand. |
| `audio/voice/*.mp3` | `node scripts/generate-voices.mjs` (ElevenLabs, paid: only when asked) |

## Testing

Serve the repository root (`npx -y http-server -p 8098 -c-1 -s .`), then:

- `node --check` on every changed `.js` file, and `node scripts/validate.mjs` (line ids, audio, lip-sync freshness, flags, frame sizes). It counts flags read as `F().x`, `G.flags.x` and through `const f = F()`; generated files (`lipsync.js`, `faces.js`) don't count as using a line.
- **Scene previews:** `?scene=<name>` jumps straight to a scene (the list is `PREVIEW` in `js/story/main.js`; also `tr1` to `tr5` for the chapter transitions). `?scene=walklab` is the walk lab; `?review` opens the review screen.
- **Smoke test** (Playwright, `executablePath: '/opt/pw-browsers/chromium'`, Playwright loaded with `createRequire('/opt/node22/lib/node_modules/')`): `node scripts/tests/smoke.mjs http://localhost:8098/ [scene ...]` opens every preview scene with `window.FAST` on, answers the dialogs and reports page errors. All 38 scenes take over 15 minutes: run them in two parts. `GEMINI=1` approves every review candidate for the run.
- **Checks added 22 Oct** (serve on :8098 first; each prints PASS/FAIL lines): `robustness.mjs` (saves, busy after errors, GL loss, hints), `loading.mjs` (time to title on a throttled link; every room complete on entry), `touch_press.mjs`, `story_hints.mjs` (the "already done" replies, the Chapter V notebook hints), `qol.mjs` (Continue's chapter end, save version and file, double-click, hotspot marks), `a11y.mjs` (settings, keyboard), `memory.mjs` (the phone budget, `?mem=`), `front_back_walk.mjs`, `morph_coverage.mjs` + `morph_report.cjs` (which frame changes morph), `morph_shot.mjs` (a morph photographed at a slowed clock).
- **Other scripts in `scripts/tests/`:** `walk_cast.mjs` (walk lab readings per character), `walks_wired.mjs` (which cycle each character plays), `room_shots.mjs` (room screenshots, `OUT=<folder>`), `perf.mjs` and `profile.mjs` (speed; without a GPU the numbers are only comparative), `walknew.mjs`, `copbed2.mjs`.
- **Full playthrough:** `node scripts/tests/play.mjs http://localhost:8098/` plays a new game to the ending as a player would (about 20 minutes) and prints `{"won":true}`; Bastos's two close-ups are clicked through their own buttons. (`probe.mjs`, poses per scene, was lost with an earlier session.)
