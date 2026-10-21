# Sound design (effects and ambience)

The music is described in `docs/MUSIC.md` and is not touched here. This page covers everything else the player hears:
room beds, the details that come and go, footsteps, room acoustics and the effects of actions.

The sound pass described below was approved on 2026-10-21 and is the game's sound. `?sound=old` in the address plays
the sound before it. The cleanup still to do (folding the flag away) is under "Putting it in the game" at the end.

## How a room sounds

Every room is built from five layers. All of them are set in `js/audio.js`, and the room picks them by name.

1. **The bed** (`LOOPS`). One or more recorded loops, about 18–20 dB under the dialogue: the city through a window,
   the harbour, a cistern's air. It ducks under speech with the music.
2. **The details** (`EXTRAS`). Short recordings, each on its own random clock (every *n* to *m* seconds, a random
   level and stereo place). A gull, a tram, a page turned, a drip, a dog across the rooftops. These keep a bed from
   sounding like a loop.
3. **Footsteps.** One step as each heel lands, panned to where the walker is. The sound depends on the room's `floor`:
   wood, stone, cobble, tile, wet or deck. Other people's steps are quieter, and quieter still at the back of the room.
4. **Acoustics** (`ACOUSTICS`). A reverb per room (decay, wet level, brightness, pre-delay) on the voices and effects:
   dry in the cabin, long in the cistern.
5. **Actions.** The story's `sfx(...)` calls: doors (each building its own: the shop's bell, the police station's heavy
   door, the boat's hatch), things taken (a key jingles, paper rustles, brass is heavy), and the story's own moments
   (the bell, the rite, the telephone, the tide clock).

## What the review found

- **Three rooms had no ambience and no footsteps.** In the Cistern, Cais do Sodré and the Maria Fé's deck, the
  `ambience` and `floor` settings sat after a `//` comment on the same line, so the code never read them. The quay
  and the deck played music over silence, and the cistern had no drips or air.
- **The cabin used the deck's bed.** It had its own (creaking timbers, the hull) defined but never used.
- **Some effects started late.** Silence at the start of the recording delayed `sheet_slap` (0.23 s), `lamp_click`
  (0.34 s), `drawer_open` (0.22 s), `cat_land` (0.33 s), `ferry_horn` (0.44 s), the vocal sighs and chuckles
  (0.1–0.17 s) and others: 33 clips in all. A sheet slapped or a lamp switched on was heard after the gesture.
- **One recording was silent.** `dial_click_3` (−70 LUFS) was one of three takes, so one dial click in three was missing.
- **Some details were scheduled but never recorded:** the cistern's drips and settling stones, the night dog, the
  police office's paper shuffling. They were skipped every time.
- **Footsteps were synthesised** (filtered noise bursts). They read as clicks, not as boots on wood or stone.
- **Alan's room used the shop's bed**, and the tavern at night (Chapter V, Amália alone) had no bed at all.

## The sound pass (`?sound=new`)

- **Fixes:**
  - The three rooms read their ambience and floor again.
  - The cabin gets its own bed.
  - The late clips start where their sound starts. They play from an offset (`LEAD` in `js/audio.js`), so the
    recordings themselves are unchanged.
  - The silent dial-click take is never picked, and four new dial clicks join the set.
- **Recorded footsteps:** four takes for each floor (wood, stone, cobble, tile, wet, deck), with a random take and a
  slight random pitch at each step, so no two steps match. The boat and the cabin use the deck: hollow planks.
- **New beds:**
  - Alan's attic: room tone with the street muffled by the window.
  - The tavern at night: the shop-at-night air, quiet.
  - The Cistern: water lapping against the drowned steps, under the old bed. It turns to the calm cistern once the
    rite is won.
  - The bell tower: the bell's low hum, never quite silent.
- **New details:**
  - Street: a canary on a balcony; neighbours talking at a window (by night, rarely).
  - Carmo, day and night: wind through the roofless arches.
  - Night: a dog across the rooftops.
  - Cistern: echoing drips and settling stone.
  - Police: paper shuffled on a desk.
  - The quay: Cais do Sodré's trams behind it.
  - Alan's room: floorboards, the house settling, a distant tram and church bells, pigeons on the sill.
- **Acoustics:** Alan's attic (small, a little live) and the cold open's night street get their own reverb.

All new recordings are ElevenLabs sound generations (`eleven_text_to_sound_v2`, flow "Drowned Bell sound design").
They are cut and levelled by `scripts/sound_new_prep.py`:
- Each footstep is cut to one step and peak-matched.
- Each detail is trimmed and set to one loudness.
- Each loop keeps the steadiest of its four takes, kept whole.

## Room by room (with the sound pass)

| Room | Bed | Details | Floor | Acoustics |
|---|---|---|---|---|
| Shop (day) | the city, low | a page turned, a tram, gulls, the radiator | wood | small, warm |
| Shop (Chapter V) | the shop at night | foghorn, the building creaking | wood | small, warm |
| Street (day) | the city | tram, pigeons, gulls, laundry, a shutter, church bells, **a canary, neighbours at a window** | cobble | open |
| Street (night) | the street at night | foghorn, **a dog**, **voices, rarely** | cobble | open |
| Alan's room | **the attic, the street through the window** | **floorboards, the house settling, a tram, pigeons, church bells** | wood | **small attic** |
| Polícia Judiciária | the office, the tube light | typewriter, telephone, coffee machine, filing cabinet, corridor steps, **paper shuffled** | tile | hard room |
| Taberna (day) | the tavern | glasses, cards, chairs, laughter, coins | wood | warm |
| Taberna (Chapter V) | **the night air, quiet** | **the lantern's flame, the building creaking, a dog** | wood | warm |
| Lavadouro | the washhouse, a tap running | sheets slapped, scrubbing, wringing, a pail, pigeons | wet | stone, live |
| Ferreira's workshop | silence while the clocks stand at 03:12; once the tide clock is wound, its ticking | a spring's ping | wood | small |
| Convento do Carmo | the ruin by day | pigeons, swifts, church bells, **wind through the arches** | stone | open stone |
| Carmo at midnight | the night city | owl, a candle, foghorn, **wind through the arches, a dog** | stone | open stone |
| Sé: museum, reserve | the museum | footsteps down a corridor, the organ far off | stone | church |
| Sé: cloister | the convent | the organ, a trowel, pigeons | stone | church |
| Sé: bell tower | the tower's wind, **the bell's hum** | wind, pigeons, the bell rope | wood | tall, live |
| Antiguidades Lacerda | the clocks, a grandfather clock | chimes, a cuckoo, a floorboard | wood | small, dead |
| Cais do Sodré | **the harbour, rigging** (was silent) | gulls, water against the quay, ropes, ferry horn, foghorn, mooring, **trams** | cobble (was none) | open |
| The Maria Fé (deck) | **the timbers, the harbour, rigging** (was silent) | water against the hull, gulls, ferry horn | **deck** (was none) | open |
| The cabin | **the timbers and the hull** (was the deck's) | drips, timbers | **deck** | tight |
| The Cistern | **the cistern's air, a torch, water on the steps** (was silent) | **echoing drips, settling stone** | wet (was none) | vast |
| The Cistern, after | the calm cistern | slow drips | wet | vast |

## Situations

These moments keep their own effects (unchanged by the pass, except that late clips now land on time):
- The bell, forward and backward, and its great swell.
- The rite in the cistern: water rising, the fog lifting, the tile shattering.
- The telephone: dialling, the ring-out, the answering machine's beep.
- Doors: each building its own.
- The tide clock's winding (Ferreira's other clocks stay stopped at 03:12).
- The kisses and undressing scenes: cloth, belts, the bed.

## Putting it in the game (on approval)

1. In `js/audio.js`, set `SOUND_NEW` to `true`, or remove the flag and keep its branches.
2. Move the room fixes from `?sound=new` in `js/story/main.js` into the rooms themselves:
   - the cistern, cais and boat lines: put the comment after the settings;
   - the cabin's `ambience: 'cabin'` and the deck floors;
   - the bedroom's and the tavern's beds.
3. Delete the `NEW_ONLY` gate.
4. Run `node scripts/build-manifest.mjs`.
