# The Forgotten Rhythm: handoff

## Start here (2026-11-04)

Game III, *Alan Sanches III: The Forgotten Rhythm*: Santo Domingo, 4–11 September 1996, with Hurricane Hortense
coming in. **Nothing is built yet.** This folder holds only the story and this handoff. Read, in this order:

- this section, then the session log below;
- `docs/BIBLE.md`: the user's game bible (3 Nov 2026), converted from their Word file without changes. It is the
  source for the story, the cast, the puzzles, the flags and the rules. Where it differs from anything else, it wins;
- Game II's `sequel/docs/PIPELINES.md` (how we work: rooms, sprites, Ludo, faces, the sea loops, voices, deploy, every
  external service) and `sequel/docs/CODEMAP.md` (the engine this game will most likely fork). Game I's
  `docs/animation_handoff.md` "Start here" for the standing rules.

### Rules (Games I and II; they hold here)
- The room paintings never change once approved. Anything that moves is drawn over them. A different look is a new
  file beside the original.
- Nothing goes into the game without the user's approval (art, animation, voices, music). Make candidates, show them,
  wait for the word.
- Deploy only when asked, from a clean `git archive` export, to this game's own Netlify project (not created yet).
- Keys live in the root `.env` (git-ignored) and are never printed or committed. **This container has no `.env`**, so
  ElevenLabs, Ludo and Gemini must be given again before any API work. Higgsfield, Canva and ElevenLabs are reachable
  through their MCP connectors.
- Check the story (`docs/BIBLE.md`, and the novel once it's here) before animating or writing anything that could
  carry meaning. The Sea is never funny and never speaks. Ritual is practice, not power (bible, "Cultural and
  sensitivity rules").
- Voices: ElevenLabs library voices only. No designed or cloned voices, no other service. If credits run out, stop and
  tell the user. Alan, Vasco, Inês and the narrator keep their Game I voices (ids in `sequel/docs/HANDOFF.md`, "Voice
  casting"). Accented English comes from `language_code` on the request (Game II's lesson, its entry 64 onwards).
- Every change gets an entry in the log below: what, where, how it was checked.
- Games I and II stay as they are. Game III never loads anything from `../` or `../sequel/`. Anything borrowed is
  copied in by a script, the way `sequel/scripts/import_game1.py` does it.
- The root `.gitattributes` keeps `game3/` out of Game I's `git archive HEAD` export (added in entry 1).

### What the bible asks for, in numbers
Prologue (1586, as Catalina), Lisbon tutorial, three acts over seven days, a four-phase finale and an epilogue. About
9–10 hours. 15 locations / 37 screens, 23 principal speaking parts plus about ten barks, 51 puzzles (six multi-level:
ML1–ML6), 18 flags (the register under "Production"), save points before each set-piece. Scope tiers Must / Should /
Could; cutting Could saves about eight puzzles and the hostal kitchen.

### What carries over, and what is new (checked against the code on 2026-11-04)
**Reusable from Game II's engine** (`sequel/js/engine/*`, `story/core.js` patterns): rooms, walking, hotspots,
dialogue, inventory, stills and readable close-up documents (`docs.js`), Alan's notebook with pages to fill
(`S.NOTES`, `S.PAGES` in `puzzles.js`), switching the playable character (`S.becomeVasco` / `S.becomeAlan`; the speaker
follows the player), a visible scene clock (`S.talkClock`), the death screen (`mon.js`, once), the content setting
(Discreet fades the love scenes), the sea loops, extras who talk, the phone-box hint system (the parrot's analogue),
saves, the placement tool, `validate.mjs`, `play.mjs`, recording with sound.

**Not in either engine; the bible needs them** (bible, "Core mechanics"):
1. Two playable halves with **one shared document inventory and two object inventories**; a document becomes usable
   by the other after the next reunion scene. Game II's switch swaps the figure, not the inventory.
2. **Deductions**: drag one notebook or folder entry onto another; a true pair writes a new entry. Game II's pages
   have blanks filled with earned words, which is close but not the same.
3. **The napkin** quest log: two columns, SHORE split into *Salves* and *Kreyòl*. The finale checks names, not a count.
4. **The heartbeat** meter (three beats and a rest, the skip on the third) and **Sea grip** mode (the screen narrows,
   the cursor offers only what other people can do).
5. **Rhythm tap** input, and one global **relaxed timing** setting that doubles every timed window and lets the
   rhythm auto-play.
6. **Timed set-pieces**: tide chase (90 s, wet stones), vèvè memory (8 s, then rebuild from parts), the raid (8 s),
   the fax, the foundry clock (11 min), winch pulls between gusts.
7. **Death and rewind** at three places (the drain, the gallera drum, the bell-chamber), each to the moment before,
   not to a save; autosaves before every set-piece.
8. Mini-games: parrot stealth, dominoes endgame (fixed position, play into Fello's *capicúa*), the hurricane chart
   pins, the breakfast inspection (three actions), the crew-to-jobs assignment, Multibanco keypad, watermark matching.
9. The **parrot** hint icon on every screen (three clicks give a direct hint), becoming Tobías's keys in Act III.

**Art from Game I** the bible marks as reused: the shop (`art/bg/shop.jpg` and variants), Alan's room above it
(`bedroom.jpg`) and the street (`street.jpg`, for the lintel and the Multibanco). **Game I has no "Vasco's office,
Patriarchate"**: that room has to be painted. Alan's and Vasco's sprites and face kits come from Games I–II; Inês
needs new travelling clothes, and as a playable figure she needs walks (Game II's rule was static sprites for everyone
but Alan).

### Questions for the user (asked 2026-11-04; answers go in the log)
1. **The novel.** The bible says to put its Markdown export at `docs/novel/the-forgotten-rhythm.md` and lift the best
   lines from it. It isn't in the repo yet.
2. **Where and how**: this folder (`game3/`) as the web root, the engine forked from Game II's (`sequel/`, newer than
   Game I's), and a new Netlify project (suggested name `alan-sanchez-forgotten-rhythm`) created only when asked?
3. **The Sea's question in phase 4** ("*why should I?*") against "The Sea never speaks" (bible, production rule 4) and
   Game II's "no line gives it a voice". Wordless (a feeling, the narrator, a title card), or an exception?
4. **Voices**: the bible's "native-speaker casting" against the ElevenLabs-library-only rule. Proposed: library voices
   with `language_code: es` for the Dominican cast, a French or Kreyòl-leaning voice with the matching code for
   Yolande and the Haitian shore (if the library has none, say so before choosing), Italian for the Nuncio's
   secretary; Carmela and Fello's wife through `phone_fx.sh`. Inês is in person now, so no phone filter except on
   calls.
5. **Who walks**: Alan and Inês (both playable) for sure; the rest static, as in Game II?
6. **Prologue art**: paint-overs of the Playa and cathedral (the bible's plan), or a separate period style (the
   bible's open question)?
7. **Keys**: a new `.env` with the ElevenLabs, Ludo and Gemini keys. Gemini had about $4 left of Game II's $23
   budget.

### Proposed order once the answers are in
1. Fork the engine into `game3/` (as Game II's entry 1), with its own save keys, `FIRST_ROOM`, cast file and
   `.gitattributes`; import Alan, Vasco and Inês, the Lisbon rooms and the sound effects with an `import_*` script.
2. Build the new systems (the list above) against placeholder rooms (`placeholders.py`), so the whole game can be
   played through early with `play.mjs`, the way Game II was.
3. Write the script day by day in the bible's order (chapter-to-scene map), lifting from the novel, checked against
   the flags register; voice line ids `name_day_nn`.
4. Art: rooms (37 screens), cast designs from the bible's prompts, stills, then movement, sea loops, extras. Each set
   on a review page for the user's word.
5. Voices once the script is locked; music; then the Dominican and Haitian consultant read the bible asks for, before
   lock.

## Session log

1. **Game III prepared** (2026-11-04, the user: "Prepare yourself for building Game 3", with the bible as a Word
   file). Read the bible in full, Game I's and Game II's handoffs, Game II's code map and pipelines, and checked the
   engine for what Game III can reuse. Added `game3/docs/BIBLE.md` (pandoc, gfm, text unchanged) and this handoff;
   `CLAUDE.md` points here; the root `.gitattributes` leaves `game3/` out of Game I's export. No code, art or voices.
   Checked: the bible's dates fall on the weekdays it gives (Thu 29 Aug, Wed 4 and Tue 10 Sept 1996); the puzzle
   counts by day add up to 51; `git archive HEAD | tar -t` has no `game3/` files.
2. **New clothes for Alan, Vasco and Inês, front only (Canva, for review)** (2026-11-04, the user: "use canva to draw
   character sprites (front only for now). Alan, Vasco and Ines need new clothes. Make sure to keep the style consistent
   - Alan is the benchmark. Also, for anything you do - make sure it doesn't affect game I and II"). Canva
   `generate-image` on green with Alan's Game II front sprite as the style reference; full size via the scratch design
   (record and media ids in `art/canva/log.md`). Alan: off-white linen jacket (the jacket Yunior takes in S10) over his
   black vest, stone trousers. Inês: the bible's travelling clothes. Vasco's first try took Alan's face (the user:
   "vasco's face doesn't look like him"); v2 is an edit of his own sprite only, which keeps his face. Lesson, as in
   Game II's entry 2: for anyone but Alan, edit the character's own figure and don't add Alan as a reference. Sheet:
   `art/designs/g3_front_sheet_v1.png`. Nothing cut or installed (there's no game yet). Games I and II untouched (the
   references are copies in the scratchpad; `git status` shows changes only under `game3/`).
3. **Second and third rounds of the front designs (for review)** (2026-11-04). The user: Vasco "a researcher visting a
   bishop - probably in a blazer, but suitable for dominican republic"; Alan "blazer is important, but ... an overall
   new style"; then "More earthy colours for vasco - replicate the style he wore in first game. ALan is horrible - he
   doesn't wear such formal clothes", and "drop ines' glasses". Round 2 (two smart blazers each) was rejected before
   export. Round 3: Alan C and D (casual, crumpled blazers over a T-shirt or a print shirt), Vasco v3 (Game II's Vasco,
   his face, in Game I's brown blazer / blue shirt / loose tie / khakis), Inês v2 without glasses. Every one is an edit
   of the character's own current sprite. Sheet `art/designs/g3_front_sheet_v2.png`, ids in `art/canva/log.md`.
   Style notes for later rounds: Alan is casual, never formal; Vasco's palette is earthy, as in Game I; Inês wears no
   glasses.
4. **Approved: Inês v2 and Alan D** (2026-11-04, the user: "Ines - Approved, Alan in shirt - approved"). Their front
   designs are `art/designs/ines_g3_front_v2.png` (media MAHZ7Of0bC8) and `art/designs/alan_g3_front_d.png` (media
   MAHZ7JsTbQ4): the base for their other views and sprites. Vasco v3 not taken (the user: "use Vasco from second game,
   give him new clothes. SOmething formal suitable for a researcher, but more suitable for tropical climate"): new
   options from his Game II sprite, earthy colours.
   New options: E, a tobacco linen suit with a rust knit tie; F, a formal ecru guayabera (Dominican formal wear) with
   brown trousers. Sheet `art/designs/g3_front_sheet_v3.png`.
5. **Vasco approved: the three fronts are settled** (2026-11-04). The user: "do Vasco from the second game, but
   different colour pallette, still earthy", then "olive options is great, just give him sandals", then "vasco
   approved". E and F (suit, guayabera) not taken. Vasco is his Game II sprite with the same clothes recoloured (olive-sage
   shirt, chocolate trousers) and dark brown sandals: `art/designs/vasco_g3_front_g2.png` (media MAHZ7KqBrsQ). The
   approved fronts: `alan_g3_front_d.png`, `vasco_g3_front_g2.png`, `ines_g3_front_v2.png`; together on
   `art/designs/g3_front_approved.png`. Next for them, when asked: side and back views from these, then the cut-outs
   (`figure_cut.py`'s method) once the engine is forked.
