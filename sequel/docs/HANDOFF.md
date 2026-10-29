# The Shortest Night: handoff

## Start here (2026-10-27)

Game II, *Alan Sanches II: The Shortest Night* (Gran Canaria, 18–24 June 1996), built on the bible
(`docs/BIBLE.md`, copied from the Claude Doc https://claude.ai/artifact/9FEy2s3FNfz3bZy93rqhit; the doc is the
source). It lives in `sequel/`, its own web root, in the same repository as Game I. Code: `docs/CODEMAP.md`.

### Game I stays as it was
- Nothing outside `sequel/` changed except two lines: `.gitattributes` keeps `sequel/` out of Game I's `git archive
  HEAD` export, and `CLAUDE.md` points here. Game I's code, art, tests and deploy procedure are untouched.
- The engine is a **fork** (copied at `394bcdd0`): editing Game I never changes Game II and the reverse. A fix wanted in
  both is made in both, on purpose (`docs/CODEMAP.md` lists what the fork changed).
- Game II borrows Game I's Alan and Vasco frames and face kits by **copying** them (`scripts/import_game1.py`), and its
  sound effects (`audio/sfx/`, copied). Nothing is loaded from outside `sequel/`.
- Saves, settings and tips use their own `shortest-night-*` keys, so the two games never share a save on one browser.

### What is in the game
- **The whole story is playable**, prologue to credits, as the bible lays it out: the prologue (Elena's last drive,
  played), seven days as chapters (Tuesday arrival and the blazer, Wednesday's bell and letter, Thursday's Colón and the
  break-in, Friday's fight and Rafa's bar, Saturday's morning after and the flood, Vasco's playable chapter, Sunday's
  choice with the airport's bad ending, the Land Rover and the vault, Monday's finale, confession and ending).
- **1,019 lines**, written to the bible (the scenes it scripts word for word, the cold open and Vasco's chapter, are
  used as written). **No voices yet**: captions run at reading pace; recordings go in `audio/voice/<id>.mp3` and
  `node scripts/build-manifest.mjs` lists them.
- **The phone box** is the hint system: Inês, a coin a call, Chano at the kiosk for change; her story calls (Tue, Wed,
  Thu, Fri, Sat) come first, then "What now?". Alan's notebook (N) lists what he knows and what Inês would say.
- **Puzzles**: the lost-and-found blazer (Gail's hint, Nieves's question); the clock key and winding, the bell rubbing,
  the fax; Derek's camcorder and the guard, the dinner knife and the desk; the three tries to leave Rafa's bar; Vasco's
  light channel (marks at three times, the charts, turning a disc, San Juan's sunrise, the clinometer), the anchors and
  the mark; the deduction at Carmen's; the radiator; the grille; the finale's called order, the cloud and the mirror,
  the sixth disc, the seventh's angle (three wrong placements drown Alan: retry from the finale's checkpoint); the
  confession's three ways (they change the last scenes' tone).
- **Content setting** as Game I: Discreet fades the two love scenes and the Rafa night to black.

### Placeholders (the user: "don't bother with Ludo sprites yet")
- **Rooms**: 20 stand-in paintings; the game draws their hotspots as labelled boxes. **Stills**: 20 text cards that say
  what each painting must show (the art list). **New cast**: flat figures in the bible's palettes, names on their chests.
- **Alan and Vasco** wear Game I's frames (Alan's 24-painting walk, Vasco's approved walk, their approved face kits, so
  they blink). Their Gran Canaria looks (Alan without his luggage, Vasco in field clothes) come with the Ludo sets.
- Music: 25 Lyria 3 Pro tracks the user picked, one per room plus the title theme and the map (entry 27).

### Voice casting (the user's rule, 2026-10-27)
- **Alan, Vasco, Inês and the narrator keep their Game I voices** (Game I's `scripts/cast.json`): Alan
  `CwhRBWXzGAHq8TQ4Fs17`, Vasco `c6SfcYrb2t09NHXiT80T`, Inês `EXAVITQu4vr4xnSDxMaL`, the narrator (Eleanor)
  `2qQJWjw5XdG80GreshqG`.
- **Inês always sounds like she's on a phone**: every one of her lines is heard down the line from Lisbon, so her
  recordings get a telephone treatment after generation (narrow band about 300–3400 Hz, mono, light compression and a
  little line noise), applied in post so her original voice stays the source.
- **Carmen's answering machine** (the prologue's "Trujillo. Speak, or don't.") gets the same telephone treatment.
- **Everyone else: English with a Spanish accent, or else a general American voice** (changed 2026-10-28, the user:
  "none got a Spanish accent. Almost all sound British. If you can't do characters speaking with Spanish accent in
  English, just use general/American accent for all except Gail and Derek"). The first rule (native Spanish voices
  reading English) gave British-sounding reads; the recast prefers English-language voices that speak with a Spanish
  accent, and falls back to general American. Never British for anyone but Gail and Derek.
- **Gail and Derek are the exception**: working-class British English voices.
- **No designed voices** (2026-10-28, the user: "Don't design voices"): cast only from the ElevenLabs voice library.
- **The accent comes from the language setting** (2026-10-28, the user: "When I choose this voice myself, set up to
  Spanish, but I add english text to generate - this voice fully sounds like a clearly spanish person speaking
  english... When you do them - they sound like native english speakers"). The app's language choice is the API's
  `language_code`; every request so far sent English text with none, so the model read it as English. Spanish-accented
  characters need `"language_code": "es"` on every request (all five models accept it). Which model matches the app is
  the user's call from the samples.
- The voice ids for the sequel go in their own cast file under `sequel/scripts/`, never in Game I's.

### Open, in the order I'd suggest
1. **The user's read of the story and lines** before anything is painted or voiced (nothing goes in without approval).
2. **Room paintings** (20) and **stills** (20): the placeholders' cards are the brief. Then depth maps and `parallax: true`.
3. **Cast**: Canva designs (the bible's art prompts), then Ludo animation sets, as Game I's rule from 23 Oct.
4. **Voices** (ElevenLabs, paid: only when asked, to the casting rule below), then lip-sync (Game I's `scripts/lipsync.py`, adapted).
5. **Music**: done (entry 27); story cues on top of the rooms' tracks are still to place.
6. ~~First deploy~~ done 28 Oct 2026; redeploy when the user asks (the stills still to paint, then again).

### Netlify
- Project **alan-sanchez-shortest-night**, id `a5e71264-d9a4-439a-b1e5-60ec3f98812d`, team kuba-jugo, created
  27 Oct 2026, https://alan-sanchez-shortest-night.netlify.app. First deployed 28 Oct 2026 (log entry 14); deploy only when asked.
- **Deploy** (only when the user asks): `node sequel/scripts/build-manifest.mjs` and commit; `git archive HEAD:sequel |
  tar -x -C <empty dir>` (sequel/.gitattributes leaves out `scripts/`, `docs/` and the `.ph` markers); smoke-test that
  folder on its own port (`play.mjs`); Netlify MCP `deploy-site` with the id above; run the command it returns from the
  export folder; check the live page and that `/.env` is 404.
- Game I's procedure is unchanged (`git archive HEAD`, which now leaves `sequel/` out).

### Rules (Game I's, which hold here too)
The room paintings never change once approved; nothing goes into the game without the user's approval; deploy only
when asked, from a clean `git archive` export; the keys in `.env` are never printed or committed; check the story
(`docs/BIBLE.md`, `js/lines.js`) before animating anything that could carry meaning. The bible's own rules: never show
the Sea, one glimpse only, no line gives it a voice; the Sea is never funny.

## Session log

1. **Game II set up and written** (2026-10-27, the user: "Use the same repo to build the sequel - but make sure the first
   game stays intact and I can still edit it, prepare a new netlify project for it. Here is the bible... Don't bother
   with Ludo sprites yet"). `sequel/` with the forked engine; the story in nine files; 1,019 lines; placeholder art
   (`scripts/placeholders.py`); Alan and Vasco from Game I (`scripts/import_game1.py`); the Netlify project created.
   Checked: `node --check` on every file; `scripts/validate.mjs` 0 errors, 0 warnings; `scripts/tests/play.mjs` plays
   prologue to credits (98 steps, no page errors; the airport ending and a wrong disc on the way); Game I's `git archive HEAD` checked to leave `sequel/` out and Game I's validate run unchanged.
2. **Canva art replaces the placeholders** (2026-10-27, the user: "Don't do placeholders, do actual canva designs"). Rooms
   painted in Canva (`scripts/canva_in.py`, record in `art/canva/log.md` and `media.txt`) and laid out in
   `js/story/layout.js`; cast painted on green and cut with `scripts/figure_cut.py` (`--half` splits a pair painted side
   by side) into `art/sprites/*_c.webp` and `js/sprites_canva.js`. Done so far: Carmen, Rayco, Rafa, Yeray, Gail and Derek;
   still to paint: Pino+Lolo, Nieves+clerk, Chano+guard, Fermín+Mercedes, Montesdeoca+surfer, the vault, the Land Rover,
   Elena's car, the map, the title, and the 20 stills. The hotel is now Hotel Cristina (as painted), the room 404.
   **Rafa repainted** (the user: "Rafa looks almost like Alan, you need to change his face"): the style reference was
   Alan's own sprite, so the first Rafa took his face. The new one (media `MAHZPqKAeW4`) keeps the bible's clothes but has
   tight black ringlets, a round clean-shaven boyish face, a gold hoop and a gap-toothed grin; the prompt now says to copy
   the style only. Lesson for the remaining cast: describe each face against Alan's. Checked: validate 0 errors;
   `play.mjs` won, 98 steps, no page errors (its hotel exit renamed to Hotel Cristina).
3. **Voice casting rule recorded** (2026-10-27, the user: "use natively Spanish voices from eleven labs, but just make
   them speak English. Gail and Derek should speak working class British English. Only Alan, Vasco and Ines will retain
   their original voices, although we need to make sure that Ines' voice sounds like through a phone"). Written into
   "Start here" (Voice casting) with the three kept voice ids from Game I's `scripts/cast.json`. No voices made yet.
4. **Voice rule settled** (2026-10-27, the user: "Let's keep the same narrator. The rest of the suggestions is good").
   The narrator keeps Game I's Eleanor; Carmen's answering-machine line gets Inês's telephone treatment. Both written
   into "Voice casting".
5. **Voice auditions** (2026-10-27, the user: "When you're waiting for canva cooldowns, focus on voice overs"). No
   `ELEVENLABS_API_KEY` in this container, so the voices go through the ElevenLabs connector (`eleven_v4`, as Game I).
   A shortlist of native Spanish voices (Canarian or Peninsular where the library has one; Gail and Derek Cockney),
   one line per character, two takes each: 42 files in `audio/auditions/` (git-ignored, root `.gitignore`; review
   material, not game audio), published for the user to pick from at https://claude.ai/artifact/EKTEsDzh5aJYSrWhfm83Ht.
   About 4,200 credits. `scripts/phone_fx.sh` (ffmpeg: 300–3400 Hz band, 8 kHz resample, compression, soft clip, faint
   line hiss) makes Inês's telephone copy; the auditions page plays both. Next: the user's picks, then the cast file
   (`scripts/cast.json`, the sequel's own) and the full run. Also in this round: Canva cut-outs for Pino+Lolo,
   Nieves+check-in clerk, Chano+guard, Fermín+Mercedes (each checked: validate 0 errors, play.mjs won, 98 steps).
6. **The map redrawn from real geography** (2026-10-28, the user: "Please use an accurate map of Las Palmas, this
   looks very weird"). The Canva map invented its coastline, so `art/bg/map.jpg` is now painted by
   `scripts/map_from_osm.py` from OpenStreetMap's standard tiles (zoom 15, 28.092–28.186 N, 15.392–15.462 W, 70 tiles
   fetched once and stitched; only what each pixel is, sea, street, building, park, port, is kept and repainted on
   paper, with no labels). Turned a quarter left so the long city fits the wide screen (north points left; compass
   rose). Pins sit on the real places (`S.PINS`, core.js); the four Vegueta places are a few hundred metres apart, so
   their labels sit apart with leader lines (`S.PIN_LABEL`). Credit added to the ending: "Map of Las Palmas drawn from
   OpenStreetMap data © OpenStreetMap contributors (ODbL)". Previews `?scene=map`, `mapthu`, `mapfri` check the
   labels on the busiest days. Also: the vault, the Land Rover and Elena's car painted in Canva with layouts and
   previews (`?scene=vault`, `landrover`, `elenacar`); the audition page now has 2–3 voices per character, built
   into the page so it plays on an iPhone; `ELEVENLABS_API_KEY` is in the root `.env` (git-ignored; text-to-speech
   works, the key cannot read the account).
7. **Voices recast** (2026-10-28, quoted under "Voice casting"). The native-Spanish auditions are rejected; a new
   round (English voices with a Spanish accent where the library has them, else general American; Gail and Derek
   keep their British options) goes in `audio/auditions2/` and onto the same audition page.
8. **The cast picked; recording starts** (2026-10-28, the user's picks from the round-two page). `scripts/cast.json` is
   the sequel's cast: Ernesto (Rafa), Claudia (Nieves), Grandpa Storyteller Oxley (Fermín), Cesar (Yeray), Paola
   (Elena), Grandma Rachel (Pino), Carli (Mercedes), Jolly old Mike (Montesdeoca), W. Storytime Oxley (Lolo), Lizzie
   (Gail), Jim (Derek), Rodo (surfer), Hazel (clerk), Robert (barman), Angel (Guardia 2), Sean (parrot); Alan, Vasco,
   Inês and the narrator keep Game I's voices; Inês through the "1996 phone line" (`phone_fx.sh line`, the user's pick),
   and so are Elena's answering-machine message (`elena_msg_01`–`03`) and Carmen's machine (`carmen_machine`).
   Not cast yet (no pick): Carmen, Baute, Chano, the guard, Guardia 1: a third round with designed voices for Carmen
   and Baute (`audio/auditions3/`, git-ignored). `scripts/generate-voices.mjs` (Game I's, adapted: key from the root
   `.env`, three at a time with retries, phone lines kept as recorded in `audio/voice_src/`, export-ignored) voices
   every cast line; uncast speakers are skipped.
9. **Round three for the five uncast** (2026-10-28, the user: "The ones with no pick need a recast"): Carmen and Baute
   get three ElevenLabs-designed voices each (Canarian, English with a Spanish accent; not saved to the library until
   picked: carmen design1 `GhyBdqsIvAGNSpyNRTdC`, design2 `HU9N964ywaofdGh6HHgH`, design3 `HdVh6Zcztnh4Iguc42RY`;
   baute design1 `K5ecvsRKoGewJWrAyhjW`, design2 `A0wQA5zZT8tE7GxqbZXG`, design3 `j6XSdsqSikGnqQ1XhLA1`; save the
   picked one with the connector's `creative_save_designed_voice`), plus library voices for all five. Files in
   `audio/auditions3/` (git-ignored); the audition page now shows only these five.
10. **The cast complete but for the guard; the game voiced** (2026-10-28, the user's round-three picks: Vanessa for
    Carmen, David for Baute, Pablo for Chano, Luis for Guardia 1; no pick for the museum guard, a fourth round of three
    voices in `audio/auditions4/`). 1,012 of 1,019 lines voiced (`scripts/generate-voices.mjs`, 0 failures); the guard's
    3 lines wait for his voice. Checked: manifest lists every file; validate 0 errors; `play.mjs` won, 98 steps.
11. **An older guard** (2026-10-28, the user: "Get me an older voice for the museum guard"). Three designed voices
    (a Canarian man in his sixties, sleepy, English with a Spanish accent; reading all three of his lines; not saved:
    design1 `sWtx4rOEzgyVl6lvSuFb`, design2 `fDFK7lIS4rZz2KYpWMJk`, design3 `i0zhL3BngeO9qb25BIqc`) and two older
    American library voices (Grits Oxley `8vYCG1Q6bAbJWXdRuCIr`, Scott W `6Xb9dRSSm1t1OLWvzT1T`) in
    `audio/auditions5/` (git-ignored), on the audition page.
12. **No designed voices** (2026-10-28, the user: "Don't design voices"). The rule is in "Voice casting"; the guard's
    designed previews are dropped from the page and from `audio/auditions5/`; two more older library voices instead
    (Christopher `NdEhweaiOdufFIiyNPdk`, Grampa Werthers `MKlLqCItoCkvdhrxgtLv`). None of the designed voices was
    ever saved to the account.
13. **The guard cast; every line voiced** (2026-10-28, the user's pick: Grampa Werthers for the museum guard). All 1,019
    lines have a recording (`scripts/cast.json` complete). Checked: validate 0 errors; `play.mjs` won.
14. **First deploy** (2026-10-28, the user: "once the remaining lines are done - are you able to deploy the game and show
    it to me?"). Every line voiced, all rooms and cast painted; 15 stills still placeholder cards. Found on the way and
    fixed: the round-two auditions had been committed by mistake (untracked again, still ignored), and `git archive
    HEAD:sequel` kept `scripts/` and `docs/` (sequel/.gitattributes now names them as root paths: `/scripts`, `/docs`,
    `/audio/voice_src`). Export 138 MB; smoke-tested on its own port (`play.mjs` won, 98 steps); deployed with the
    Netlify MCP from the export folder (deploy 6ae14b17b7b1c6ea70482caf). Live: page, voices and art 200; `/.env`,
    `/scripts/`, `/docs/`, `/audio/voice_src/`, `/audio/auditions2/` 404; `play.mjs` on the live site won.
15. **Blazer bug fixed** (2026-10-28, the user: "the option about the blazer does not show after the conversation with
    Gail"). Nieves's "I seem to have lost a blazer" needed `saw_blazer`, set only by examining (right-click) the
    lost-and-found box; Gail's story did not count, nor did a left-click on the box. Now Gail's story or any click on
    the box offers it (`tue.js`). `play.mjs` now takes that route (Gail only, the box never examined): won, 97 steps.
    Saves keep working: the flag Gail sets (`gail_hint`) was already saved. Not deployed (the live site has the bug
    until the next deploy).
16. **Redeployed with the blazer fix** (2026-10-28, the user: "yes, redeploy"). Same procedure (clean export, smoke test
    won); deploy 6ae15cf0e0cb1431fa4c4192. Live: the fixed tue.js served; `/.env`, `/scripts/`, `/audio/voice_src/` 404;
    `play.mjs` on the live site claims the blazer from Gail's story alone and wins.
17. **Tuesday rewritten from the novel** (2026-10-28, the user: "The game's dialogue is flat and rushed compared with the
    novel. The novel is now the tone reference... rewrite the game's dialogue day by day... Do Tuesday first and stop so
    I can play it"). The novel is `docs/novel/the-shortest-night.md` and the new bible `docs/story-bible.md` (its
    "Dialogue and atmosphere" section: the ten rules, the voice sheet, the chapter-to-scene map). Tuesday now follows
    Chapter One in order: Gando (Vasco radiant, the kiss, "My trousers are not entirely here", Rayco, the drive under the
    panza de burro, "Thursday, perhaps"); the hotel (Nieves's eyebrow, the box of German jackets; the blazer puzzle kept,
    "Very elegant"); Chano's change and secret ("My knees can tell"); the first call (Pessoa and the Eça, the surfers,
    "Don't break anything", the money runs out); the reception (narrated arrival, the skulls, Baute's grandmother and
    the swimming pool; Carmen on the steps, the lighter's three tries, "I'm outside a party"); the walk, the bonfire for
    San Juan, the mist told in the novel's prose; the midnight call ("It's here. It's come for me."); the night (the
    Eça again, "Take off that terrible jacket", the sneezing lift; the day closes on "waiting for Sunday").
    Mechanics: action beats are narrator lines and sound effects, never brackets (captions strip brackets, but the
    voice model would read them as directions); narrator lines on first entry (`narr_hotel_lobby`, `narr_canteras`,
    `narr_museum_hall` flags); calls can open directly and end without "What now?" (`S.CALLS` 4th field); a second
    Tuesday call (`called_tue2`) gates the lift; the museum opens after the first call. 58 lines rewritten (same ids,
    re-recorded), 114 new, 5 removed (`alan_t_lobby_1/2`, `vasco_t_lobby_2`, `chano_note`, `alan_mist_1`). Checked:
    validate 0 errors; `play.mjs` (new Tuesday route) won, 98 steps; every line voiced with the cast.
18. **Every voice on one page, plus new studio-quality ones** (2026-10-28, the user: "give me the auditions page again
    with all of the voices proposed for each character in the past (also the ones rejected), plus propose a 3 new ones
    from the catalogue. Make sure the new ones are studio quality"). 63 new voices (3 per character), all from the
    library's high-quality / professional category, one take each, in `audio/auditions6/` (git-ignored by the one
    `/sequel/audio/auditions*/` rule). The page holds 200 voices: the current one first, the new three, then rounds
    1–5; the designed voices are left out (the user's "Don't design voices"). Few new voices with a Spanish accent were
    left in the library: Leoni (Carmen), Johi (Baute), Leo (Rafa), Lilith (Nieves; was an Elena option), Carlos
    (Guardia 1). Tuesday's redeploy is waiting on the user's go-ahead.
19. **Why the voices sounded British: the language setting** (2026-10-28). Jimena (`7k6n1AfTEk6nYLMpXMOM`) sampled
    for Carmen without it (her line twice, her steps scene), then with `language_code: "es"` on v4, v3, multilingual v2,
    flash v2.5 and turbo v2.5 (`audio/auditions7/`, git-ignored). Waiting on the user's ear: which model, then recast
    with the setting on.
20. **Re-audition with the Spanish setting** (2026-10-28, the user: "2,4 and 5 work well. 5 ... turbo v2.5 - sounds
    most natural"). Rule: Spanish-accented characters are voiced with `eleven_turbo_v2_5` and `language_code: "es"`;
    `[pause]` becomes "…" (Turbo doesn't read bracket tags). Every candidate from rounds 1–6 plus Jimena (184 voices;
    the barman candidate Max has been disabled by its owner) re-recorded that way into `audio/auditions8/`
    (git-ignored), and the audition page republished with them. Not re-auditioned: Inês, Gail, Derek, Alan, Vasco,
    the narrator. Next: the user re-picks, then cast.json and generate-voices.mjs get a per-voice model and language,
    and those characters' lines are re-recorded.
21. **Recast with native Spanish studio voices** (2026-10-28, the user: "re-cast using only spanish, studio quality
    voices. you can look for completely new ones"; "for gail, use an old ladies british voice"; "derek is fine the
    way he is"). Searched the catalogue (language es, category high_quality) and picked three per character (four for
    Carmen, keeping Jimena), Spain and Latin America both; one Turbo v2.5 + Spanish take each into
    `audio/auditions9/` (git-ignored). Gail: four older/mature British women (Beatrice, Jeanette, Maria (Manchester),
    IDA), v4, no language setting. Derek unchanged. The audition page was republished with these 62 takes. The
    voice ids are in the scratchpad (`rewrite/voices9.py`). Next: the user picks, then cast.json and the generator.
22. **The recast re-recorded on Eleven v3** (2026-10-28, the user: "try redoing it with V3"). Same 62 voices and lines,
    `eleven_v3` with `language_code: "es"` (Gail without a language setting), into `audio/auditions10/`
    (git-ignored); the audition page now plays these takes.
23. **Sixteen voices cast; four re-auditioned** (2026-10-28, the user's picks). In `scripts/cast.json`: Carmen
    Graciela, Baute Nico (History & Documentary), Rafa Dani, Chano Marco, Nieves Gloria, Yeray Enzo, Elena Sofía
    (Smooth), Pino Regina Martin, Mercedes Irma la Dulce, surfer Nico (Latino Fresco), guard Luis (62), clerk Lucía,
    barman Hugo López, GC1 Leónidas, GC2 Emanuel: each `model_id: eleven_v3`, `language_code: "es"`. Gail Beatrice
    (v3, no language). Derek unchanged. `generate-voices.mjs` now sends a voice's own `model_id`/`language_code`
    (falling back to the cast-wide model) and turns `[pause]` into "…" for Turbo/Flash. All 277 lines of those
    speakers re-recorded (`--force`). Still open, re-auditioned (`audio/auditions11/`): Fermín and Lolo ("someone
    older"), Montesdeoca ("funnier, fat, overly confident, obnoxious"), the parrot ("more like a parrot, maybe a
    cartoon character voice"; with v3 [squawks] tags and two pitched-up takes).
24. **Fermín and Lolo cast; Montesdeoca and the parrot re-auditioned again** (2026-10-28). Fermín Julio Alonso,
    Lolo Oslo (Grandpa Storyteller), both v3 + `es`; their 25 lines re-recorded. Montesdeoca ("need different ones,
    more expressive"): Ivan (loud, eccentric), Ricky Rocket, Javier, plus Gustavo and Odran again, with his line carrying
    v3 directions ([laughs heartily], [proudly], [smug]...). Parrot ("still not right"): three takes from the
    sound-effects endpoint (`/v1/sound-generation`, a generated parrot saying "Cristóbal"), and two cartoon voices,
    plain and pitched up. `audio/auditions12/` (git-ignored).
25. **Montesdeoca and the parrot cast; the cast is complete** (2026-10-28). Montesdeoca Ivan (loud, eccentric,
    dramatic), v3 + `es`, 7 lines re-recorded. Parrot Snorre on v3 + `es` with an effect: `cast.json` voices can now
    carry `fx` (an ffmpeg filter; the raw take goes to `audio/voice_src/`), here pitched up and thinned. Its line now
    reads "[squawks] ¡Cristóbal! [squawks] ¡Cristóbal!" (captions hide the brackets); the file is the exact take the
    user picked. Play test: won, 98 steps, no errors.
26. **New outfits and designs; Ludo started; four new rooms** (2026-10-28).
    - Designs (Canva, approved): Alan's everyday outfit (black vest, khaki cargo shorts, white sneakers) and his
      blazer outfit (the navy brass-button blazer over the vest, with jeans), Vasco in shirtsleeves (no blazer, tie or
      key), Baute in darker browns, Chano repainted in the cast's realistic style (the first repaint still read as a
      cartoon; the one kept used Baute as the style reference); back views for Alan (both outfits) and Vasco. Cut to
      keyframes `art/sprites/*_k.webp`. Chano's scale 0.85 (the user: 15% shorter than Alan).
    - Ludo: `scripts/ludo.py` (forked from Game I's: hydra, the improve pass, the 1.5x upscale, forge only on a
      moderation refusal; key `LUDO_API_KEY` in the root .env, never printed), runs in `scripts/ludo_runs.json` (47:
      talk loops for the cast; Alan x2 outfits and Vasco: side/front/back walks, turns, talks, actions). Results under
      `art/review/ludo/` (raw downloads git-ignored). Only Alan and Vasco ever walk in the story, so nobody else gets a
      walk. Not in the game yet: a review page comes first.
    - Rooms (Canva, approved): `beach` (Las Canteras' sand, the panza de burro; the surfers moved here from the
      promenade, reached by "Down to the beach"), `hotel_restaurant` (Gail and Derek moved here from the lobby; "To the
      restaurant" at the lobby's right edge), `museum_courtyard` (Carmen's first scene on Tuesday, through the hall's
      "Door to the steps"), `santa_ana_inside` (Don Fermín moved inside; the plaza's cathedral door now opens onto the
      nave, and the tower door there is the one that needs his key; the belfry's stairs come down to the nave). 16 new
      lines (looks and a first-visit narration per room, voiced); a synthesised sand footstep. Checked: validate 0
      errors; play.mjs won, 103 steps (route updated for the moves); each room screenshotted with its people in place.
27. **Room music** (2026-10-28). The user: "use gemini to generate instrumental soundtracks appropriate for each of
    the room, whilst keeping the game ambience" (budget: the 23 USD credit). `scripts/gen_music.py` (Lyria 3 Pro,
    `GEMINI_API_KEY` in the root .env, never printed; a ledger in `audio/music_src/ledger.json` stops at 20 USD) made
    two ~2-minute instrumental takes from a brief per room; 4.20 USD spent. The user picked one take per room on the
    review page (the picks are in `scripts/music_install.py`). That script levels each to -23 LUFS with one gain and
    encodes `audio/music/<id>.opus.m4a` and `.aac.m4a` with `tracks.json` (dur, inp, out, v), as Game I's
    (docs/MUSIC.md). Every room has `music: '<its id>'` (the map: `map`); its `ambience:` stays underneath. The title
    screen plays `title` (audio.js maps Game I's `main_theme` calls to it). Raw takes are git-ignored. Checked: every
    file -23.0 ±0.1 LUFS; play.mjs won, 103 steps, no errors.
28. **Small movement in every room** (2026-10-28). The user: "small environment movement (lights, clouds, birds,
    water waves etc) added, to the background, just like we did with the first game". As Game I's entry 21: drawn
    over the paintings in each room's `animBack` (no art/bg file changed), with the FX helpers plus a few local ones
    in tue.js (`drift`: the panza de burro clipped to the painted sky; `foam`; `ceilFan`; `lamp`). Per room: clouds
    and gulls wherever sky shows, waves and foam at the beach, Canteras, La Isleta and through the hotel windows,
    palms and plants stirring (kept tiny: "there's no wind"), live flames on the painted candles and lanterns,
    lamp glows, steam, dust in light shafts, moths, the parrot breathing, the baggage belt turning, stars at night.
    Story kept: Santa Ana's clock stays stopped until wound, no bell moves, the courtyard fountain stays dry, the
    answering machine blinks until Elena's message is heard, cigarette smoke at the hall door while Carmen is out.
    Also fixed: the Colón parrot and Carmen's answering-machine hotspots now sit on the painted objects. Checked:
    crops at each addition, the beach sky's seam (the cloud clip now follows the roofline); play.mjs won, 103 steps.
    Review page with a clip per room: https://claude.ai/artifact/V77iQSPoJmwNKkw6k78az7; not deployed. Known, older: a
    faint vertical step in the beach's top-left sky (present without any of this; not looked into).
29. **The Ludo animations in the game** (2026-10-28). The user approved the room movement ("all good") and the Ludo
    board, except three to redo: Alan's climb ("remove the ledge, so he can climb onto anything"), his pull ("his
    hands disappear out of the frame"), Vasco's second talk ("his face looks different").
    - `scripts/ludo_install.py` copies each run's fitted frames to `art/sprites/<run>_NN.webp` (1267 frames, one box
      per run so nothing slides) and writes `js/sprites_ludo.js` (sprite data and `window.LUDO`: frames, fps, and from
      `scripts/ludo_measure.py` a walk's ground per frame and an action's hold frame).
    - Engine (`js/engine/actor.js`, this fork only): `talkFps` plays the talk loop in order from the line's start; a
      pose can be a run (in to its hold frame, held while the story runs, the rest played out); `viewTurn` plays the
      side-to-front or side-to-back turn (reversed back, every other frame when walking off); `turnLR` plays the
      turn round (mirrored for the other way); `walkStep` / `frontStep` / `backStep` set the stride per cycle.
    - Story (`core.js`): Alan's frames follow `blazer_on` (vest set or blazer set); the blazer now comes off each new
      morning (`S.day`) and goes back on for Thursday's dinner. Vasco on his set; the cast talk on their loops and
      stand on the first frame (Baute and Chano in their new designs). Actions: phone, drink, write (Alan), reach,
      kneel, trowel (Vasco). Held out until the redos are approved (`S.LUDO_HOLD`, Game I poses): climb, pull,
      Vasco's talk b. Redos running (take 2 in `ludo_runs.json`, more room above for the pull).
    - Checked: validate 0 errors; play.mjs won, 103 steps; a stepped capture on the beach (walk, the turn round, the
      phone in, held and out) frame by frame.
30. **Redos approved; heads; lip-sync and blinking under way** (2026-10-28/29).
    - The three Ludo redos (take 2: the climb mimed with nothing drawn, the pull with room above, Vasco's talk b with
      his face kept) approved ("OK" x3) and on: Alan's `climb` and `pull` poses (the pull holds at the top of his reach,
      frame 12), Vasco talks through both loops. `S.LUDO_HOLD` is empty.
    - Heads (the user: Alan and Pino have the game's slightly large heads, Vasco, Baute and Yeray realistic; "Do head
      size 8%"): `scripts/head_scale.py` grows the head about the neck with a bulge that fades out across the neck (no
      seam, nothing below moves); `ludo_install.py` applies it to every frame of their runs (16 px of headroom added
      to each run's box). Measured first: face height against figure height, Vasco 1/10.3, Alan, Baute, Yeray 1/8.9,
      Pino 1/7. Checked on crops: standing, walking, back, kneeling, crouching.
    - Lip-sync: Rhubarb 1.13.0 (the user: "Do rhubarb, like the first game"; binary in the scratchpad, `RHUBARB=`) on
      all 1056 lines but the narrator's: `sequel/lipsync/<who>/<id>.json`, bundled in `js/lipsync.js` (loaded by
      index.html). `scripts/lipsync.py` is Game I's, forked.
    - Faces: `scripts/face_kit.py` (Game I's method): Gemini mouths A-F and shut eyes on each figure's standing frame
      (19 figures, 133 edits, $5.40; Gemini in all about $9.60 of the 23), carried onto every frame of their talk loops
      by lining the heads up (frames that don't line up get none). The engine plays only frames with a set while
      someone speaks. Build running; all sets `"ok": false` until the user approves them on a review page.
    - Checked: validate 0 errors; play.mjs won, 103 steps.
31. **Lip-sync and blinking, round two; deployed for a look** (2026-10-29). The user on round one: Alan (both outfits)
    OK; Vasco, Carmen, Rafa, Nieves, Yeray: the eyes (a ghost of the open eye under the blink, where the head moved in
    the loop), Carmen's mouth off, Baute and Chano "shaking". Fixed: `face_kit.py` fits the eyes and the mouth each on
    its own (the mouth by the nose and cheeks, which hold still while the painted lips move), and leaves out a part that
    fits less than 0.93; the engine plays, while someone speaks, the longest unbroken run of frames with mouths, there and
    back (`speakLoop` in actor.js), so no jumps. Vasco stands and talks on his second loop (the first has a squinting
    eye); his new set $0.29. Round two: https://claude.ai/artifact/3hp6okNd3vpbUkoAfwsffA. Alan's 52 sets are on
    (`"ok": true`); everyone else's show with `?faces=all` until approved. Deployed on the user's word ("deploy it, I
    need to see them in the game"); `/lipsync` (the per-line cue files) is left out of the export, the game uses
    `js/lipsync.js`. Deploy 6ae2adbd52f3f8cfbebd9595 (clean export, play.mjs won on it first); live: `/.env`, `/scripts/`,
    `/lipsync/` 404; the faces, cues, music and new engine served.
32. **Static sprites, Game I's mouths, no intro, repaints under way** (2026-10-29).
    - The user: "remove all the animations and definitely the stepping sounds from walking. Leave in only Alan's walk and
      leave the lip sync and blinking on all the characters. But the characters should only be using their original
      static sprites"; "remove the intro from the game for now. start with Alan at the airport". Done: core.js `still()`
      sets (the Canva statics, `*_side_k` / `_front_k` / `_back_k`, `<id>_c`, Baute `baute2_k`, Chano `chano2_k`; no
      poses, no turns, no talk loops; Alan's Ludo walk cycles only); audio.js `FOOTSTEPS = false`; main.js
      `S.PLAY_PROLOGUE = false` (play.mjs skips it then: won, 98 steps). Room movement stays (approved separately).
    - Mouths (the user: "we had a great solution for very natural blending of the mouth with the face... replicated.
      Alan's face is probably already done there"): Alan's static sprites take Game I's finished alan_side faces
      (`scripts/face_from_game1.py`, Game I's face_transfer: head lined up above the mouth, lips painted out, skin
      shift; states A-H with 40/70% in-betweens, half and shut eyes; fit 0.93). Everyone else: `scripts/face_jaw.py`,
      Game I's mouth_swaps generalised from landmarks: the figure's own jaw moves (swung about the hinge in profile,
      pulled down when turned to us), old lips painted out, only Gemini's lips and opening laid on (kept inside the face
      and above the jaw edge: no halo or grey fringe), in-betweens for C-F. Lolo blinks only (his cigarette). All on.
    - Repaints in Alan's style (Canva; candidates in art/designs, not in the game): Vasco v3, then v4 (linen field shirt,
      unbuttoned, sleeves high) and v5 (chest hair); Baute v3; Chano v3. The user: textures must match Alan's
      hand-painted look ("Rafa got the textures right"); Game I's alan_side and alan_front uploaded to Canva as the
      reference (media MAHZW4cgw1U). The museum guard still to do.

33. **Overnight cast repaint, first six compared with the approved cast** (2026-10-29). Canva repaints (two views,
    Alan's rendering; prompts and progress in `art/designs/repaint_queue.json` and `repaint_done.json`) for Chano,
    the guard, Nieves, the clerk, Pino and Lolo, exported through the scratch design (page 7) to
    `art/designs/<id>_v2.png` (Chano `chano_v4`). Compared in `art/review/cast_repaint/`: `lineup12.jpg` (front views,
    the approved six then the new six at Carmen's 92%), `heads12.jpg` (faces at one scale) and `lineup12_headfix.jpg`
    (the new heads brought down to the cast's proportion with `head_scale.grow`, k 0.73-0.90). Measured face height /
    figure height: approved 0.103-0.119, new 0.132-0.154 (guard), Nieves 0.117. Style: Nieves matches; the guard is
    still a caricature, the clerk leans cartoon, Lolo and Pino carry heavier wrinkle linework, Chano's skin is
    orange and glossy. The prompt for the rest gets a proportion line (`prompt_note`). Nothing in the game.
34. **Emotions on Alan's face, a test** (2026-10-29). The user: give the faces emotions the way they talk and blink,
    by changing only parts of the face, with Gemini; test on Alan. `scripts/face_emotions.py` (gen / build / clip):
    alanv_side_k's head cropped and enlarged 5x, Gemini (nano-banana 2.1) repaints only the brows, eyes and mouth for
    joy, fear, anger, sadness, concern, surprise ($0.24 for the six, ledger in the review folder); each is lined up on
    the hair, ear and neck (ECC fit 0.977-0.986), only the face in front of the ear kept, skin shifted to the sprite's.
    Two patches each, in the face set's box: `_emo_<e>` (the whole box: silent) and `_emo_<e>_up` (brows and eyes:
    laid over the lip-sync mouth while he talks, under the blink). Review: `art/review/emotions/alanv_side_k/sheet.jpg`
    (game size, quiet / talking / blink) and `talk_clip.mp4` (one line spoken in each, then quiet). Not in the game:
    the engine (js/engine/faces.js) would need an emotion layer and lines an emotion tag. Seen on the dark clip
    background: white leftovers in his hair gaps (an agent is cleaning those, review only) and a pale edge under the
    chin from the mouth patches.
35. **Alan's emotions: softer, two more, both views; front talking mouths** (2026-10-29). The user: "some emotions are a
    little bit too exaggerated" → a restrained set (`EMO_VAR=soft`, files `*_soft`), plus embarrassed and mischievous;
    "test on both side and front views" → `face_emotions.py` takes `EMO_FRAME` (VIEWS: crop, box, face zone, eye line);
    the front view's blink is Gemini's shut eyes cut to the lids only, so an emotion's brows stay through a blink. Skin
    is matched on the neck, not the cheek (a blush had tinted the whole face). "Make front talking mouths too" →
    `face_kit.py` gets `alanf` (alanv_front_k; find, gen $0.28, build) and `face_jaw.py alanf`: 14 mouths and shut eyes
    in `art/faces/alanv_front_k_*`, set in js/faces.js with **"ok": false** (not in the game). Two fixes on the way:
    face_kit's build dropped Alan's Game I-made side sets from js/faces.js (restored; it now keeps `from: game1`
    sets), and face_jaw wrote "ok": true on every set it makes (it now keeps the old approval, default false).
    Review: `art/review/emotions/both_views_soft.jpg`, each view's `sheet_soft.jpg` and `talk_clip_soft.mp4`.
    Emotion tests so far $0.96, front mouths $0.28.
36. **White leftovers out of Alan's hair, for review** (2026-10-29). The user: "remove the white leftovers of the
    background from Alan's hair gaps". `scripts/hair_clean.py`: in the top fifth of the figure, the hair is the dark,
    neutral areas that reach the top of the head (not the brows, tank top, blazer or shadowed skin); small groups of
    pale grey-white pixels (peak at least 170, at most 80 px, not bordering skin) within 5 px of the transparent
    outside become transparent (enclosed pockets only if near-white and ringed by hair: none found); then a two-pass
    fringe on what borders them or the outside (grey, lighter than the hair beside it): alpha down by the background's
    share, colour the neighbouring hair's. Covers what the game uses: alanv_/alanb_ side_k, front_k, back_k and the six
    walk runs (222 frames): 112 changed, 1143 px (stills: side 74 / 68, front 9 / 8, back 1 / 2). Cleaned copies and
    `report.json` in `art/review/hair_clean/`; sheets there: `sheet.jpg` (the stills) and `sheet_<run>.jpg` (each walk
    run; blazer front walk had nothing). Nothing in the game: `hair_clean.py install` copies them over `art/sprites/`
    once approved, and then the side sets' face patches need `scripts/face_from_game1.py` again (their box covers
    hair with the leftovers). Not touched: a dark teal (green-screen) tinge on some outer curl tips. Checked: no
    changed pixel is skin-coloured or below 14% of the figure's height; sheets looked over at 3x and 8x.
37. **Hair clean-up installed; Alan's face patches regenerated and defringed** (2026-10-29). The user: "install the hair
    clean-up and regenerate the face patches. Make sure there are no white lines/specks in his jaw when he speaks".
    `hair_clean.py install` (112 of Alan's frames). Face patches rebuilt from the cleaned sprites: `face_from_game1.py`
    (alanv/alanb side, boxes moved 1 px) and `face_kit.py find/build alanf` + `face_jaw.py alanf` (front; no new Gemini).
    New `scripts/face_defringe.py`, run by both generators after they write a set: in every mouth patch, (1) a pale or
    grey fringe along the outline takes the solid face's colour (removed where the painting itself is transparent),
    (2) see-through pixels inside the face (the front view's upper teeth) are made solid, (3) hair-thin strokes and
    faint grey wisps outside the painting's outline (old lip line at the nose, ticks and dots under the chin) are
    removed. Checked over a dark room colour at 5x: `art/review/hair_clean/talking_mouths_dark.jpg`. Approvals
    unchanged (side sets ok, front set still waiting). Emotion patches (review) re-cut from the cleaned sprites.
38. **Review page of every animation** (2026-10-29). The user: "do the page showing me all the animations".
    `scripts/review_anim.py` renders clips from the game's own files into `art/review/anim/`: Alan's six walk cycles,
    and every figure with a face set saying one line with lip-sync and blinks (close-up centred on the face YuNet
    finds); `scripts/review_page.py` writes `index.html` (plus the emotion clips and sheet). Published as a private
    artifact: https://claude.ai/artifact/VYCypKVRUqoSqdfXwm95HY. Same day: the guard's same-artist redo came in
    (MAHZZrcFTJM); the next cast check-in is a session cron at 16:03 UTC (send_later was unavailable).
39. **Alan-only review page with verdicts and notes** (2026-10-29). The user: "add a review functionality, with the
    ability to leave comments. Also, I meant only having Alan's animations there". Same artifact
    (https://claude.ai/artifact/VYCypKVRUqoSqdfXwm95HY), now 25 clips: his three talking/blinking views, six walks, and
    each soft emotion on each view cut from the emotion clips (`art/review/anim/emo_<view>_<emotion>.mp4`). Each clip
    has Approve / Needs changes and its own notes, stored in the page's db (capabilities db + user): collection
    `verdicts` (doc id = clip id: {item, status, by, at}) and `notes` ({item, text, by, at}). Read them back with
    ArtifactData list on those two collections. The other cast's clips stay in art/review/anim/ but are off the page.
40. **Alan's front face and emotions in the game** (2026-10-29). Review page verdicts (db `verdicts`): all three
    talking/blinking clips and all 16 emotion clips approved; the six walk cycles marked "needs changes" with no note
    (asked). The user: "Alan will not be changing emotions or talking/blinking whilst walking".
    - alanv_front_k's face set approved: "ok": true.
    - `face_emotions.py install`: the soft set's patches to `art/faces/<frame>_emo_<e>[_up].webp` (+ `_emo_lid` for the
      front), and `"emo": {box, set, lid}` on alanv_side_k and alanv_front_k in js/faces.js. face_from_game1 / face_kit /
      face_jaw keep "emo" when they rebuild a set.
    - `js/engine/faces.js`: an emotion layer. `Engine.LINE_EMO[lineId] = 'joy'` (etc.) shows that emotion while the
      line is spoken (brows and eyes over the lip-sync mouth) and for 2.5 s after (the emotion's whole quiet face), then
      the painting again; a walk drops it at once. A view with emotion lids (the front) blinks with those (the front's
      face-kit eyelids sat outside its mouth box). No line carries an emotion yet, so the game looks as before until
      the tags are approved. Checked live (anger and joy on alan_ask_baute_cave at Gando:
      `art/review/emotions/in_game_test.png`); play.mjs won in 98 steps, no errors (served from sequel/ with
      python3 -m http.server: npx http-server -s sequel served Game I's root here).
    - Not done: the blazer views (alanb_*) have no emotion set yet.
