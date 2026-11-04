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
6. **Alan without the blazer** (2026-11-04, the user: "drop the blazer from Alan - he is in a short sleeve shirt").
   `art/designs/alan_g3_front_d2.png` (media MAHZ7A77h90): D's print shirt, cargo trousers and sandals, no blazer. It
   is now Alan's front on `g3_front_approved.png`. Note for the story: the bible's linen jacket (Yunior's price, S10)
   is no longer on him; it can be carried, or come out of his luggage that day.
7. **Alan approved: all three fronts settled** (2026-11-04). The user: "change the shirt to a creme shirt, unbottoned
   more to show more chest", "not that much, one button more", "too buttoned up no", then "perfect, alan approved too".
   Alan: `art/designs/alan_g3_front_e.png` (media MAHZ7LHNFl8): plain cream short-sleeved shirt, untucked, open to
   mid-chest, khaki cargo trousers, brown sandals. **The approved fronts:** `alan_g3_front_e.png`,
   `vasco_g3_front_g2.png`, `ines_g3_front_v2.png` (sheet `g3_front_approved.png`). Everything else in
   `art/designs/` is a rejected candidate kept for the record (note: `vasco_g3_front_e.png` is Vasco's linen-suit
   option, unrelated to Alan's E). Next, when asked: side and back views from these fronts, then cut-outs.
8. **The three fronts redone clean and locked** (2026-11-04). The user: "multiple redos on them, made them very grainy.
   We need clean sprites with the same level of texture and style like the previous games", then "Ok, lock these 3
   sprites". Each chained Canva edit adds grain, so each figure was redone in **one** edit from its clean original
   sprite with the approved outfit written out in full. Locked: `art/designs/alan_g3_front.png` (MAHZ7I8imU8),
   `vasco_g3_front.png` (MAHZ7CJy5AU), `ines_g3_front.png` (MAHZ7GGzC20); grain numbers in `art/canva/log.md` (Alan 5.0
   -> 2.9, Inês 4.0 -> 2.8; Game II's Alan is 1.7). **Rule from now on: never edit an edit.** Every new picture of a
   character is made in one step from its locked front (or, for a new character, generated fresh with the locked Alan
   as the style reference only).
9. **The principal cast, fronts (for review)** (2026-11-04, the user: "Ok, lock these 3 sprites. Using the same style,
   generate the other characters"). The bishop, Moncho, Yolande, Tobías, Papá Lilo (seated with his drum), Fello,
   Batista, Mireya: one fresh Canva generation each, the locked Alan as the style reference only, the look from the
   bible's character designs. Sheet `art/designs/g3_cast_sheet_v1.png`, ids in `art/canva/log.md`. Supporting cast
   next (Nando, Lalo, Yunior, Padre Ulises, Peralta, Ledesma, the Nuncio's secretary, Don Faustino, Ramón, the perm
   sisters, Darío, Eddy).
10. **The supporting cast, fronts (for review)** (2026-11-04). Nando, Lalo, Yunior, Padre Ulises, Peralta, Ledesma,
    the Nuncio's secretary, Don Faustino, Ramón, the perm sisters (one picture, to be split), Darío, Eddy: same method.
    Sheet `art/designs/g3_cast_sheet_v2.png`. Every speaking part in the bible's voice sheet now has a front design.
11. **Every cast front approved; one cast sheet** (2026-11-04, the user: "all approved - put all characters in one
    sheet"). The approved front of every speaking character is `art/designs/<id>_g3_front.png` (23 files: alan, vasco,
    ines, bishop, moncho, yolande, tobias, lilo, fello, batista, mireya, nando, lalo, yunior, ulises, peralta, ledesma,
    secretary, faustino, ramon, sisters, dario, eddy). All of them on `art/designs/g3_cast_sheet.png`. Every other image
    in `art/designs/` is a rejected candidate kept for the record. Next, when asked: side and back views (one edit each
    from the approved front), then the cut-outs and heights once the engine is forked.
12. **Side views for all, back views for the three (in progress)** (2026-11-04). See the log for the ids. Alan's side
    from his own front lost his face (the user: "Alan's side view doesn't look like Alan - compare to previous games"),
    so the three playable sides are edits of their previous games' side sprites with the new clothes, all at Alan's
    angle (body to the right, face three-quarters; the user: "we need the same angle as alan's side view, for vasco and
    Ines"). 11 downloaded; 15 made in Canva and waiting to be exported, then one sheet for review.
13. **Rooms, first wave (for review)** (2026-11-04, the user: "ok, we have got the cast, now draw the rooms", then "go
    straight to the rooms"). Nine rooms: the hostal (courtyard, room 4 at night, room 9, kitchen, roof at night), the
    cathedral nave with the St Michael chapel, the bell-chamber, Calle Las Damas at night, Parque Colón. One fresh Canva
    painting each, Game II's rooms as the style reference only; `art/designs/rooms/`, sheet
    `art/designs/g3_rooms_sheet_v1.jpg`. Not upscaled, not laid out, not in any game (rooms become fixed only once
    approved). The other 6 sides and 15 side views still to export (entry 12).
14. **Rooms, second wave (for review)** (2026-11-04, the user: "carry on with the next batch of rooms"). Nine more:
    the cathedral cloister and archive, the San Antón colmado square, Tata's alley at night, inside the blue house,
    Calle El Conde, the archbishop's palace courtyard, the Mercado Modelo hall and the candle aisle. Same method; sheet
    `art/designs/g3_rooms_sheet_v2.jpg`. 18 of the bible's 37 screens now painted (candidates).
15. **Rooms, third wave (for review)** (2026-11-04, the user: "carry on with the next batch of rooms"). The bishop's
    study, the palace dining room, the blue-door bar, Darío's roof, outside the Villa Consuelo gallera (the fight stays
    off screen, as the bible says), the police cell, Batista's office, the police steps at dawn and Yolande's back room.
    Sheet `art/designs/g3_rooms_sheet_v3.jpg`. 27 screens painted (candidates). Left: the foundry (2), the Playa de las
    Negras (3), the city wall, Vasco's office in Lisbon, plus the prologue's 1586 paint-overs.
16. **Rooms, fourth wave (for review)** (2026-11-04, the user: "don't repaint the study and carry on with the next
    batch"). The study stays as painted. Seven more: the foundry yard and office, the steps down to the shore, the Playa
    de las Negras at night, the water's edge, the city wall over the river, Vasco's office in Lisbon. Sheet
    `art/designs/g3_rooms_sheet_v4.jpg`. All the bible's present-day screens now have a candidate painting (34 here plus
    Game I's shop, flat and street to copy). Left: the prologue's 1586 versions (paint-overs or a period style, the
    bible's open question), close-up stills (the frieze, the boat, the photo), and the user's verdicts.
17. **Prologue paint-overs and the last side views (for review)** (2026-11-04). The user: "paint-overs for the
    prologue", then "Export them" (the 15 side views left in Canva). Five 1586 paint-overs of today's rooms (the river
    mouth by day, the huts, the square burning, the bell-chamber with Drake's fleet, the shore in the storm); sheet
    `art/designs/g3_prologue_sheet.jpg`. All 23 side views and the 3 back views are on `art/designs/g3_side_sheet.png`;
    nine sides came back on pale blue-grey instead of green (see the Canva log) and need keying before cutting.
    The user asked how to stop the Canva permission prompts: the cloud session's mode dropdown (Auto, where offered)
    or allow rules in a committed `.claude/settings.json`.
18. **Canva tools allowed without prompts** (2026-11-04, the user: "yes, add the canva allow rules"). New
    `.claude/settings.json` at the repository root: `permissions.allow` lists the Canva tools this work uses
    (generate-image and its job check, create-upload-url, get-assets, read-design, edit-design, export-design,
    get-export-formats). Upload POSTs to Canva's URL are curl calls and may still ask. Nothing else changed; Game I's
    and Game II's code and exports are unaffected (the file is not served by either game).
19. **Close-ups (for review)** (2026-11-04, the user: "Do the close ups"). Nine stills in `art/designs/stills/`, each a
    fresh generation with a Game II still as the style reference only: the bell's frieze with the founders' mark, Ti-Jean's
    boat, the face-down photograph, Tata with the dulce de coco, the El Conde tray, Tata's exercise book, the 1586 coin,
    the St Michael offerings, the bishop's grandmother. Sheet `art/designs/g3_closeups_sheet_v1.jpg`; media ids in the
    Canva log. Checked by eye on the sheet. Things to check: the frieze's ship above the mark is not clearly off-true and the
    mark sits under the band, not under one ship; the notebook does not read as water-swollen; Tata's sweets are not
    clearly in greaseproof squares. Left out on purpose: the vèvè (consultant), the hurricane chart (real geography), the
    domino layout (code), all readable text (HTML overlays as in Game II's `docs.js`). Open: the founders' mark would
    also need to be on the Lisbon shop's lintel; Game I's painting cannot change, so Game III would need its own copy.
20. **Tower stair, drying shed, hub map (for review)** (2026-11-04, the user: "paint the tower stair, drying shed and
    hub map"). The two screens the bible lists that had no painting: `art/designs/rooms/tower_stair.png` (the studded
    door ajar to the nave, the bell rope, a slit window on the sea, the candle niche) and `drying_shed.png` (goatskins
    on frames, the bench, the rolled drum skin, through the candle aisle's back curtain; made with the candle aisle as
    the reference). The hub map follows Game II's rule (entry 6 there: a Canva map invents its coastline), so it is
    drawn from real geography: `game3/scripts/map_from_osm.py` (forked from Game II's) reads OpenStreetMap's standard
    tiles, zoom 17, x 40086–40095, y 58687–58693 (70 tiles fetched once, stitched into `art/src/zona_osm_z17.png`),
    crops Parque Independencia to the Ozama's east bank and Calle Restauración to the sea, keeps only what each pixel
    is and repaints it on paper, north up, compass rose in the river mouth. New in the fork: OSM's labels, halos, icons
    and boundary dashes are marked unknown and filled from the nearest known pixel, so no printed text survives;
    fountains are not sea. Output `art/designs/rooms/hub_map.jpg` (1280x720). Pins and their labels belong to the
    engine, as in Game II (`S.PINS`). The ending's credits must say "Map of the Zona Colonial drawn from OpenStreetMap
    data © OpenStreetMap contributors (ODbL)". Checked by eye on `art/designs/g3_rooms_sheet_v5.jpg`; the stair's puddle
    is faint.
21. **Prologue cast and room variants (for review)** (2026-11-04, the user: "do the prologue cast and room variants
    that are needed. We will not be doing stills yet"). **Cast**: fronts of Catalina Bran, Antón Congo, Juana, Tomé,
    the Wolof boy, the Biafara woman, the two mill brothers (one image) and the fish-seller, same method as the main
    cast; sheet `art/designs/g3_prologue_cast_sheet.jpg`. The bible gives no looks for them, so these are my reading:
    Catalina in indigo with a shell at her neck; Antón with a hand drum; Tomé a boy of about thirteen with a coil of
    bell rope (mixed African and Spanish, since Tobías descends from "the bell's blood"); everyone barefoot in period
    cotton, no chains, no wounds. Grown Tomé (the close) belongs to the stills and is not drawn. Sides, backs and
    Catalina's walk wait for approval. **Variants**: worked out from the scene list against what the rooms already
    show (room 4, the roof, the alley, Calle Las Damas, the cell are already night; the foundry is already wet under a
    white sky; the shore screens are already storm). Eleven kept in `art/designs/rooms/variants/`, named
    `<room>__<state>`: the courtyard at midnight (W5, TH9) and dawn (S14), the kitchen in the 04:30 power cut (TU1),
    the bell-chamber at Sunday's red sunset (U7), Parque Colón with the wet band stopping dead at the steps (F1) and
    in the rising wind (TU3–TU4), Tata's alley by day (Monday), the blue house wet wall to wall (M5), the colmado shut
    (Monday), and the 1586 river mouth for P1's first two visits (birds gone; dead fish in lines; the existing
    paint-over is visit 3). Each is one edit from its clean room; sheet `art/designs/g3_variants_sheet_v1.jpg`, source
    beside variant. **The dark patch** did not take in Canva (roof and Wednesday tower came back unchanged; dropped).
    Proposal: draw it in the engine as one soft dark shape over the sea, placed and scaled per day, which also lets it
    creep as the bible wants. The water ladder (band, fish, drain, pouring bell, tide) stays animated in the engine
    too, as the bible says ("animated, never static"). If the user rejects a room, its variants go with it. Checked by
    eye on both sheets; notes: the colmado shut lost its sign board and shifted slightly; the wind variant's trees
    barely bend.
22. **Placeholders for the three held-back pieces** (2026-11-04, the user: "Draw the things that should wait - we
    will use them as placeholders"). All drawn in code, in `art/designs/placeholders/`, each marked PLACEHOLDER;
    sheet `art/designs/g3_placeholders_sheet.jpg`.
    - **Hurricane chart** `hurricane_chart.png` (1600x1232) by `scripts/hurricane_chart.py` from OpenStreetMap tiles
      (zoom 6, x 16–22, y 26–30, stitched once into `art/src/carib_osm_z6.png`), 86°–56°W, 9.5°–31°N, Mercator, as
      the source is. Land and sea only (labels and boundaries filled from their neighbours), newsprint grey land,
      black coast, a 5° grid labelled at the edges, a dot for Santo Domingo, a generic title (no real masthead).
      The script's `lonlat_to_px()` is what the engine needs to place each day's pin. Credit OSM in the ending.
    - **Dominoes, TH6** `dominoes_th6.png` (1680x944) and `dominoes_th6.json` by `scripts/domino_layout.py`. A worked,
      checked position: twelve on the table, ends 3 and 5; Fello holds only 3|5 (the capicúa); Nando, who plays
      between Alan and Fello, holds no 3 or 5 and has passed on them before; Alan holds 5|5, 5|6, 2|3, and only 5|5
      keeps both ends for Fello. The script asserts every tile once and Nando's hand. "Don Cuco" is a placeholder name
      for Nando's partner (the bible leaves him unnamed).
    - **Vèvè** `veve/`: a plain boat sign in exactly the bible's S6 parts (hull, mast, sail, flag, three wave lines,
      crosses, stars), one transparent PNG per part plus `veve_whole.png` and a labelled preview, by
      `scripts/veve_placeholder.py`. Deliberately not Agwe's vèvè: the real sign waits for the consultant read.
23. **Inventory items (for review)** (2026-11-04, the user: "draw all the inventory items"). 26 icons in
    `art/designs/items/` (256x256, transparent), sheet `art/designs/g3_items_sheet.jpg`: the bible's 21 key items
    (the index cards, crest paper, *Patrimonio Sacro*, the welcome fax, Alan's notebook, the 1586 coin, the dulce de
    coco, the rum, the linen jacket, compass and protractor, the archive copies, the purple seal, Tata's notebook,
    the napkin, Lalo's note, goatskin, guava pegs, St Michael candles, Ti-Jean's boat, the bishop's car keys, the
    chalk) plus five the scenes hand over that the table leaves out: the carried shoes (W5), Lilo's address (S11),
    the dossier (U-day), the custody letter (TU1) and Fello's drum (ML6). Style from Game II's icons (one sheet
    uploaded as reference); one fresh generation each; the crest on the paper, the keys and the letter is the same
    generic mitre and keys, so the ML5 seal pressing reads. Not drawn: the vèvè sketch (a notebook page; the engine
    can show the placeholder parts), documents that are only text (tide fact, Carmela's message), the drums the raid
    takes (Lilo's is the same drum). Note: the coin's verdigris keyed to blue-grey. Game II's engine shows these via
    `window.PAINTED_ICONS` (CODEMAP, fx.js).
24. **The whole game built, captions only** (2026-11-04, the user: "build the entire game (using a new netlify project of
    course), using the combined engine Game I and II uses. Do not voice it yet ... the dialogues should be kept as
    captions. We will not be animating the sprites yet either - for now, in order to make the characters walk, use Alan
    and Vasco from Game II and Ines from Game I. The cut scenes should be kept as placeholders screens with decriptions").
    - **Engine**: forked from Game II (`sequel/js/engine/*`, `engine.js`, `fx.js`, `audio.js`, `warp.js`, `parallax.js`,
      `css/style.css`) into `game3/`; save, volume and tip keys `forgotten-rhythm-*`. Nothing loads from Game I's or II's
      folders. How the story is split, the contracts between parts and the API: `docs/BUILD.md`; the API itself is in the
      headers of `js/story/core.js`, `systems.js` and `rooms.js`.
    - **Art**: `scripts/import_assets.py` copies the walkers (Game II's Alan in his vest with his Ludo walk cycles and
      Vasco `vascor`; Game I's Inês with her two-step walk; their face kits) and cuts the 31 Game III fronts to sprites
      (`<id>_g3`, static, gliding); rooms, variants, the hub map, close-ups, the vèvè parts and icons into `art/`;
      Game II's sound effects. No music yet (`audio/music/tracks.json` is empty); no voices (`audio/voice/manifest.json`
      empty): every line is a caption read at the engine's pace. Parallax off (no depth maps).
    - **Systems** (`systems.js`): described cutscene cards (`S.cut`), drowning and rewind (`S.drown`), timed choices,
      the rhythm tap (three beats and a rest, the skip on the third; relaxed timing doubles every window and offers
      auto-play, in the menu), the hurricane chart pins (Hortense's 1996 positions), water, wet bands, the dark patch.
      `core.js`: the cast, Alan/Inês/Catalina switching with separate object pockets and shared documents, the notebook and
      folder with deductions, the napkin, the parrot's hint ladder (Tobías's keys from Monday), the heartbeat icon.
    - **Story**: written in six parts (`js/story/<part>.js`, `js/lines/<part>.js`): prologue (1586 and Lisbon), wedthu,
      frisat, sun, mon, tue (Tuesday, the finale, dawn and the epilogue); 2,227 caption lines. Each part's report of
      what it simplified against the bible is summarised in BUILD.md's notes below the table (menus instead of custom
      widgets for dials, keypads and the domino hand; the breakfast inspections and the rehang crew as choices; docs
      shared at once instead of after a reunion; the vèvè a placeholder boat in the bible's parts).
    - **Fixes found while testing the whole**: the colmado sold one bottle of rum and Sunday's gallera found none (the
      bible's six now, for dollars); a cutscene card after a fade to black was hidden under the black (the card, the
      captions, the choices and the minigames now stack above the fade); a `?scene=` preview left the game idle for
      400 ms before its start (now busy throughout); the validator read flags and person ids as line ids.
    - **Checked**: `node scripts/tests/validate.mjs` no problems; `node scripts/tests/run.mjs <url> 0 9` plays the
      prologue to the credits through every part's walk-through (FAST); screenshots at real speed of the prologue card,
      the airport card and room 4.
    - **Netlify**: new project **alan-sanchez-forgotten-rhythm** (id `4d7bce25-3a74-4950-b5f4-a08eec7d93d4`, team
      kuba-jugo). First deployed 2026-11-04 from `git archive HEAD:game3` (44 MB; `game3/.gitattributes` leaves out
      scripts, docs, designs), deploy `6aeb5cb87218cea85f092276`: https://alan-sanchez-forgotten-rhythm.netlify.app.
      Live: page, code, art 200; `/.env`, `/scripts/`, `/docs/`, `/art/designs/` 404; `run.mjs` parts 8–9 on the live
      site played to the credits. Deploy only when asked: export, smoke-test the export on its own port, Netlify MCP
      `deploy-site` with the id above, run its command from the export folder, check as above.
    - Also found by the whole run: Wednesday's `tower_done` shadowed Sunday's rescue (Sunday now `sun_tower_done`);
      a scan for flags set by more than one part finds only the two meant to be shared (`sisters_in`, `tobias_dries`).
