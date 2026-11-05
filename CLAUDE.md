# Alan Sanches: The Drowned Bell

Finding your way round the code (what each file owns, load order, globals, generated files, tests): `docs/CODEMAP.md`.

Before any work: read "Start here" at the top of `docs/animation_handoff.md`. It records what is in the game, what is open, the user's standing rules and the tools; the numbered session log under it has the detail of every change. Keep that log going: one entry per change, with what changed, where and how it was checked.

In short: the room paintings (`art/bg/`) never change; nothing goes into the game without the user's approval; deploy only when asked, from a clean `git archive` export; the Gemini key in `.env` is never printed or committed; check the story (`docs/STORY.md`, `js/lines.js`) before animating anything that could carry meaning (Ferreira's clocks stopped at 03:12).

## Game II: The Shortest Night (`sequel/`)

The sequel lives in `sequel/`, its own web root with its own copy of the shared engine (see below); it never loads anything from Game I's folders, and Game I's export (`git archive HEAD`) leaves it out. Before working on it read "Start here" in `sequel/docs/HANDOFF.md` (and keep its log); the story is `sequel/docs/BIBLE.md`, the code `sequel/docs/CODEMAP.md`, how we work (art, sea, movement, sound, voices, deploy) and the external services `sequel/docs/PIPELINES.md`. It deploys to its own Netlify project (`alan-sanchez-shortest-night`), only when asked. The same rules hold for both games.

## The shared engine, and one line of work

Both games run the same engine files, byte for byte (`js/engine/*`, `js/engine.js`, `fx.js`, `audio.js`, `warp.js`, `parallax.js`, `offline.js`, `sw.js`, `css/style.css`, and `scripts/tests/offline.mjs`; the list is in `scripts/sync-engine.mjs`). Fix them in one game, then `node scripts/sync-engine.mjs --from game1` (or `game2`); both validators fail while the copies differ. What belongs to one game goes in its `js/game.js` or its story, never into those files. Start every session's branch from `master` and merge back before deploying: a game deployed from a branch that lacks another session's work puts an older game live (Game II's HANDOFF 156).
