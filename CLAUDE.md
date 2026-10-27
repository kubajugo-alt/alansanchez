# Alan Sanches: The Drowned Bell

Finding your way round the code (what each file owns, load order, globals, generated files, tests): `docs/CODEMAP.md`.

Before any work: read "Start here" at the top of `docs/animation_handoff.md`. It records what is in the game, what is open, the user's standing rules and the tools; the numbered session log under it has the detail of every change. Keep that log going: one entry per change, with what changed, where and how it was checked.

In short: the room paintings (`art/bg/`) never change; nothing goes into the game without the user's approval; deploy only when asked, from a clean `git archive` export; the Gemini key in `.env` is never printed or committed; check the story (`docs/STORY.md`, `js/lines.js`) before animating anything that could carry meaning (Ferreira's clocks stopped at 03:12).

## Game II: The Shortest Night (`sequel/`)

The sequel lives in `sequel/`, its own web root with a forked copy of the engine; it never loads anything from Game I's folders, and Game I's export (`git archive HEAD`) leaves it out. Before working on it read "Start here" in `sequel/docs/HANDOFF.md` (and keep its log); the story is `sequel/docs/BIBLE.md`, the code `sequel/docs/CODEMAP.md`. It deploys to its own Netlify project (`alan-sanchez-shortest-night`), only when asked. The same rules hold for both games.
