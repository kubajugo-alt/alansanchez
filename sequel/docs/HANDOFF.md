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
- No music (Game I's tracks are Lisbon's); `audio/music/tracks.json` is empty.

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
- The voice ids for the sequel go in their own cast file under `sequel/scripts/`, never in Game I's.

### Open, in the order I'd suggest
1. **The user's read of the story and lines** before anything is painted or voiced (nothing goes in without approval).
2. **Room paintings** (20) and **stills** (20): the placeholders' cards are the brief. Then depth maps and `parallax: true`.
3. **Cast**: Canva designs (the bible's art prompts), then Ludo animation sets, as Game I's rule from 23 Oct.
4. **Voices** (ElevenLabs, paid: only when asked, to the casting rule below), then lip-sync (Game I's `scripts/lipsync.py`, adapted).
5. **Music**: a Gran Canaria score (timple, the Sea's stillness, Vasco's theme carried over).
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
