# Alan Sanchez: The Drowned Bell

A hand-painted point-and-click mystery in the spirit of *Gabriel Knight* and *Broken Sword*, fully voiced with ElevenLabs.

> **Lisbon, 1995.** For nine days the fog has not lifted from the river, and for nine days people have been drowning in their own beds, in locked rooms, half a mile from the water. Alan Sanchez, a lazy bookseller in the Alfama, finds his own family name on the killer's list, and a ledger in his late grandfather's drawer that nobody can read.

## Play

Open `index.html` through any static web server:

```bash
npx serve .        # or: python3 -m http.server
```

**Controls** (Broken Sword-style)
- **Left-click** to walk. On a person, object or exit, left-click does the natural thing: talk, take, use or go there.
- **Right-click** (or long-press on touch) to examine.
- **Inventory:** move to the bottom edge, or press **I** or the ✦ button. Click an item, then click a person or thing to use or give it. Right-click an item to examine it.
- **Click, Space or Esc** to skip a line. The ☰ button has music, voices, save and load.

It takes about 30–45 minutes to finish, has three chapters and a cipher puzzle, and you can die (in the Sierra tradition).

## The cast

| Character | Who they are | ElevenLabs voice |
|---|---|---|
| Narrator | The voice of the city | Eleanor – Gracious and Authoritative |
| **Alan Sanchez** | Bookseller, reluctant hero, last of the *Sineiros* | Roger – Laid-Back, Casual |
| Inês Carvalho | Historian, Alan's assistant and conscience | Sarah – Mature, Confident |
| Insp. Rui Mendonça | Polícia Judiciária, tired of the weird | Callum – Husky |
| Dona Amália | Fado singer who once loved Alan's grandfather | Mora – Gritty and Enigmatic |
| Father Tomás | Keeper of the roofless Carmo convent | Nathaniel – British, Calm |
| Vicente Lacerda | Antiquarian. Patient. Very patient. | Blackwood – Posh British Villain |

Voice IDs are in [`scripts/cast.json`](scripts/cast.json).

The full story bible (lore, characters, chapter outline, unused threads and expansion ideas) is in [`docs/STORY.md`](docs/STORY.md).

## How it's built

The game is plain HTML, CSS and JavaScript with no build step.

| Path | What it does |
|---|---|
| `art/bg/*.jpg` | Hand-painted backgrounds (1280×720), generated with Canva's image AI in one shared style |
| `art/sprites/*.webp` | Painted character frames (Canva), cut out with `scripts/matte.py`, which also writes `js/sprites.js` (sizes and foot/head anchors) |
| `art/layers/*.webp` | Animation layers and sky masks cut from the backgrounds by `scripts/layers.py` |
| `js/engine.js` | Adventure engine: per-room depth scaling and walk areas, occluders cut from the paintings (so characters walk behind desks and counters), lighting that tints the sprites to each room, a smart cursor, inventory, dialogue, cutscenes and saves |
| `js/fx.js` | Atmosphere (drifting fog, flickering lamps and torches, light shafts, dust, water shimmer) and painted inventory icons |
| `js/audio.js` | Procedural soundtrack using Web Audio (fado guitar, bells, foghorns) and voice playback |
| `js/story.js` | The game: cast, items, rooms, hotspots and puzzles |
| `js/lines.js` | Every spoken line, used for both the subtitles and the voice generation |
| `audio/voice/*.mp3` | ElevenLabs voice-over, one file per line |

### Animation, light and sound

- **Characters:**
  - About 57 painted frames: idle variants, several talk gestures, an 8-frame profile walk, front and back walk cycles, and action poses (reaching, reading, swinging the clapper, Lacerda's lunge and terror, Inês tied and breaking free, Tomás sweeping and carrying a lantern, Amália singing).
  - Pose changes cross-dissolve.
  - Feet stay pinned to the floor. Breathing only lifts and widens the upper body.
  - The walk cycle advances by the distance actually covered, so feet don't slide.
  - Talk gestures follow the loudness of the voice-over.
  - NPCs turn to face Alan.
- **Light:**
  - Each room defines light sources (lamps, candles, torches, a stuttering fluorescent tube, the moon behind moving clouds, Tomás's lantern).
  - The same flicker value drives the painted glow, the colour and rim light on each character, and the strength of the shadows they cast across the floor, plus a contact shadow under the feet.
- **Scenery:**
  - Layers cut from clean plates (`scripts/layers.py`) let objects be taken without leaving holes, and let the clock pendulum and the Drowned Bell swing.
  - Also animated: fog past the windows, laundry in the wind, gulls and birds behind the convent arches (sky masks), a breathing cat, steam, candle smoke, drips and ripples, torch embers, skittering leaves.
- **Sound:** footsteps per floor type (wood, cobbles, tile, stone, wet stone) and a quiet ambience bed for every room.

### Regenerating voices

Each line in `js/lines.js` is `[speaker, text]`. Tags in brackets such as `[whispering]` are performance directions for the voice model and are stripped from the subtitles. To voice new or changed lines:

```bash
ELEVENLABS_API_KEY=... node scripts/generate-voices.mjs            # only lines with no audio yet
ELEVENLABS_API_KEY=... node scripts/generate-voices.mjs alan_ring  # specific lines
ELEVENLABS_API_KEY=... node scripts/generate-voices.mjs --force    # everything
```

## Deploy

`netlify.toml` publishes the repository root. Its build command only rebuilds the voice manifest. Connect this GitHub repo to a Netlify site and every push to the production branch will deploy.

## Walkthrough (spoilers)

<details>
<summary>Click to reveal</summary>

1. **Bookshop:** use the answering machine. Take the coins from the register, the key from the sugar tin and the magnifying glass from the desk. Use the key on the desk to get the ledger.
2. **Tram stop → Polícia Judiciária:** ask Rui about the murders and the victims. Use the notebook on the evidence bag.
3. **Bookshop:** give the sketch to Inês.
4. **Taberna:** ask Amália about the fado. Use the coins on the bottles, then give her the ginjinha.
5. **Convento do Carmo:** show the ledger to Tomás. Use the magnifier on the weeping stone, then the ledger on the stone. Turn the wheel **7** times.
6. **Antiguidades Lacerda:** look at the music box, ask Lacerda about it, then take the clapper while he's out of the room.
7. **Bookshop:** listen to the machine. **Carmo at midnight:** go down through the open grate.
8. **Cistern:** give the ledger to Lacerda, then use the clapper on the bell.

</details>
