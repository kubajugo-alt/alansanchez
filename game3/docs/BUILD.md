# Building Game III: how the story is split (2026-11-04)

The user: "build the entire game (using a new netlify project of course), using the combined engine Game I and II uses.
Do not voice it yet ... the dialogues should be kept as captions. We will not be animating the sprites yet either - for
now, in order to make the characters walk, use Alan and Vasco from Game II and Ines from Game I. The cut scenes should
be kept as placeholder screens with descriptions of what they will be."

## Layout

- `game3/` is the web root. Engine forked from Game II (`js/engine/*`, `engine.js`, `fx.js`, `audio.js`, ...; save keys
  `forgotten-rhythm-*`). Art built by `scripts/import_assets.py` (rerun after any design change).
- Shared (do not edit from a part): `js/lines.js` (speakers, shared lines), `js/story/core.js` (API in its header),
  `js/story/systems.js` (API in its header), `js/story/rooms.js` (every room; how variants and hub pins work in its
  header), `js/story/main.js`, `index.html`.
- Each part owns two files: `js/story/<part>.js` and `js/lines/<part>.js` (`Object.assign(window.LINES, {...})`).

| Part file | Days (F().ch) | Owns the rooms' permanent things | Line-id day tags |
|---|---|---|---|
| `prologue` | 0 prologue 1586, 1 Lisbon | p1586_*, shop, flat, rua, vasco_office_lisbon | `_1586_`, `_lis_` |
| `wedthu` | 2 Wed, 3 Thu | hostal_* , cathedral_nave, tower_stair, bell_chamber, calle_las_damas, cathedral_cloister, cathedral_archive, parque_colon, san_anton, tata_alley, blue_house, el_conde | `_wed_`, `_thu_` |
| `frisat` | 4 Fri, 5 Sat | city_wall, market_hall, candle_aisle, yolande_back_room, blue_door_bar, dario_roof, palace_courtyard, palace_dining | `_fri_`, `_sat_` |
| `sun` | 6 Sun | gallera, bishop_study | `_sun_` |
| `mon` | 7 Mon | police_cell, batista_office, police_steps, drying_shed | `_mon_` |
| `tue` | 8 Tue + finale, 9 epilogue | foundry_yard, foundry_office, shore_steps, playa_negras, shore_water | `_tue_`, `_fin_`, `_epi_` |

A part may add day-specific people and things to any room (S.spot / S.person with a `when`), and may move a shared
room's door rects to fit the painting (find the hotspot by name in `S.ROOMS[id].hotspots` and change its rect).

## Contracts between parts

- `S.START[n]` starts part n: `await S.day(n)`, places the player, plays the opening. The last scene of part n ends
  with `await S.next(n + 1)`. Part 9's end calls `await S.theEnd()`.
- `S.SOLVE[n]`: the test harness's playthrough of part n, from the moment START[n] hands over control to the moment
  START[n + 1] has run (so F().ch === n + 1 after it). Built from `S.act(target, verb, item, choices)`, `S.go(room,
  entry)`, `S.tryDeduce(a, b)`, `S.expect(what, f => ...)`; minigames answer themselves in FAST mode.
- `S.PREVIEW['start' + n]`: `{ flags, items, as, room, pos, run: () => S.START[n]() }`: a cold start of part n with
  what earlier parts would have left (items given, flags set). `node scripts/tests/run.mjs <url> n n` uses it.
- Characters' ids (`S.CHARS`): alan, ines, vasco, catalina, anton, juana, tome, wolofboy, biafara, millbrothers,
  fishseller, bishop, moncho, yolande, tobias, lilo, fello, batista, mireya, nando, lalo, yunior, ulises, peralta,
  ledesma, secretary, faustino, ramon, sisters, dario, eddy. Anyone else is a voice (a speaker in `js/lines.js`) with
  no figure: on the phone, off-screen, or in a cutscene card.
- Item ids (icons exist): index_cards, crest_paper, patrimonio_sacro, welcome_fax, coin_1586, dulce_de_coco, rum,
  linen_jacket, compass, archive_copies, wax_seal, tata_notebook, napkin, lalo_note, goatskin, guava_pegs,
  stmichael_candles, tijean_boat, car_keys, chalk, shoes, lilo_address, dossier, custody_letter, drum. Others get a
  luggage-tag label (`window.ICON_LABELS`). Declare an item where it is first given: `S.item(id, { name, look })`.
  Counts (the rum): keep the count in a flag (`F().rum`) and name the item from it.
- The bible's flags register names are used as written: cards_collected, bill_paid, offerings_noted, coin_found,
  fight_tone, batista_trust, prediction_made, tobias_saved, bearing_taken, veve_accuracy, seal_taken, defence_style,
  dario_night, photo_seen, hidden_item, batista_committed, letter_complete, card_left, eddy_charmed. Other flags a later
  part reads: `wed_done thu_done fri_done sat_done sun_done mon_done` (each part's last), `frieze_sketch` (Wed, the
  frieze in the notebook, ML1), `mark_looks` (where the mark looks, ML1), `worn_phrase`, `note_1586`, `pins_marked`,
  `overlay_made`, `rule5`, `tobias_dries` (F: Tobías dries the bell every night), `lullaby_half`, `notebook_got`
  (Tata's notebook, Sat), `carbon_found` (ML2), `napkin` (Sun), `lilo_in`, `fello_in`, `nando_in`, `lalo_in`,
  `sisters_in`, `mireya_in`, `tobias_in`, `dario_in`, `yolande_in`, `moncho_in` (recruits), `carmela_found` (ML4),
  `keys_got` (the bishop's car keys), `drum_made` (ML6).
- The napkin: `S.NAPKIN.bell.push([flag, text])`, `S.NAPKIN.salves.push([flag, name])`, `S.NAPKIN.kreyol.push(...)`.
- Notebook entries `S.NOTE(flag, text, who)`; deductions `S.DEDUCE(a, b, result, { run })` as the bible's list.
- Hints: `S.HINT(f => f.ch === n && !f.x, 'parrot_<tag>_nn', 'mireya_<tag>_hint_nn')` in story order (first true
  wins). Write the parrot's line as something it overheard; the direct hint as Mireya calling from the kitchen.
- Cutscenes: `await S.cut('Title', 'What the painting/animation will show, in a sentence or two.', ...lineIds)`.
- Love scenes fade to black (bible). The Sea never speaks. Real clerics never appear. Ritual is practice, not power.

## Writing

Read the bible's sections for your days in full (docs/BIBLE.md: core mechanics 102–185, multi-level puzzles 186–277,
the mystery 278–357, characters and voice sheet 383–500, your day sections, the dialogue rules 985–1130). Rule 6
(languages) and the "four more rules" decide how lines sound. Key scenes 15–30 lines, minor 5–10, every examine line in
character. English everywhere; one Spanish/Kreyòl/Portuguese word in about a third of a local's sentences.

## Notes from the parts (2026-11-04)

- prologue: the safe dial, keypad and ledger are menus; Pessoa a hotspot; the travel agent a voice at the red door;
  Ngozi and Isabel bring one more each to make eleven.
- wedthu: the airport and taxi are cutscene cards with choices; the swap and the tide chase are timed menus; the
  river bench is a Thursday-only bench added to `city_wall`.
- frisat: Batista's dinner in the night courtyard (no restaurant painted); the bachata a follow/lead choice; the
  vèvè memory uses the placeholder parts.
- sun: the breakfast and the decoding are menus; Lilo stands on his sprite; the arch sighting is one compass use;
  the fax (U6) and the wall (U4) follow the bible's order.
- mon: the SHORE column gets a "seized" row after the raid instead of greying; Moncho hands the boat back after M5 so
  it can be hidden; Batista's evidence laid out by menu.
- tue: the 19-person crew reduced to the five jobs' key people; the bluff, the foundry service and the gate are
  cutscene cards; the Belgian is a hotspot; the night shop is the day painting darkened in code.
- Hotspot names must be unique within a room (`G.act` and the test walk-throughs find the first by name).
- A flag that makes a person appear or disappear needs `G.refreshNpcs()`.
