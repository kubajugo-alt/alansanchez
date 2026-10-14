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

It takes about two to three hours to finish. There are five chapters across fourteen locations, a cipher, a tide clock, a theft against the clock and a rite in a flooding cistern, and you can die (in the Sierra tradition). Inês and Celeste give hints if you ask them "What now?".

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
| Dona Celeste | Washerwoman of the Lavadouro, who hears everything | Blue – Commander with Grit |
| Zé Coutinho | Fisherman, the last of the Coutinho line, and drinking | Gravel Midnight |
| Senhor Abílio | Deaf bell-ringer of the Sé | GERALD |

Voice IDs are in [`scripts/cast.json`](scripts/cast.json).

The full story bible (v2: lore, characters, five chapters, items, flags, production spec and build decisions) is in [`docs/STORY.md`](docs/STORY.md).

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
| `js/story/*.js` | The game: `core.js` (cast, items, helpers), `docs.js` (ledger, police file, tide card and other readable documents), `ch1.js`–`ch5.js` (rooms, hotspots and puzzles per chapter), `main.js` (intro and new game) |
| `js/lines.js` | Every spoken line, used for both the subtitles and the voice generation |
| `audio/voice/*.mp3` | ElevenLabs voice-over, one file per line (about 590 lines) |
| `audio/sfx/*.mp3` | ElevenLabs sound effects and recorded ambience loops (harbour, washhouse, tavern, clocks, cistern, bell tower, boat) |
| `art/stills/`, `art/closeups/` | Painted cutscene stills and close-up inserts |

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
- **Extras:** each location has painted background characters (card players, washerwomen, a dockworker on patrol, net menders) who idle, gesture and can be examined.
- **Sound:** footsteps per floor type (wood, cobbles, tile, stone, wet stone), a recorded ambience loop for every location, and ElevenLabs effects for the story beats (bells forward and backward, the tide clock, the tile breaking, the cistern filling).

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

**Chapter I: The Ninth Night**
1. **Bookshop:** play the answering machine. Take the coins from the register and the key from the sugar tin, switch on the lamp and use the key on the desk to get the ledger. Take the magnifier and the brass weight from the bookbinding press.
2. **Street:** use the magnifier on the sea-monster tile. **Polícia Judiciária:** ask Rui about the drownings and what he found, then use the notebook on the evidence bag.
3. **Bookshop:** give the sketch to Inês.
4. **Taberna:** look at the photograph, take the matches. Ask Amália what Inês said, buy a ginjinha at the bar and give it to her. Take the empty glass.

**Chapter II: Low Water**
5. **Polícia Judiciária:** ask Rui about 1955. Use the magnifier on the bottom drawer, put coins in the coffee machine and use the coffee on the drawer to get the 1955 file and the Ferreira key.
6. **Lavadouro:** help Celeste wring the sheet, then ask her about the breathing river, the tile, the boy who refused to sign and Maria Coutinho.
7. **Ferreira's workshop:** light the oil lamp with the matches, read the repair book, wind the tide clock with the desk key, take the tide card and the key from the key board.

**Chapter III: The Founders**
8. **Convento do Carmo:** ask Tomás about the bell-founders and the ninth day. Fill the glass at the stoup, wash the weeping stone with it, use the magnifier and then the ledger on it, and decode the page.
9. **Sé tower:** Abílio is deaf. Write in the notebook to ask him about Joaquim, 1955, the backward ringing and the order. Use the magnifier on each bell's founder mark.
10. **Antiguidades Lacerda:** ask about the clocks and the glass case, look at the music box and ask about it. While he is away you have three actions: open the case with the vitrine key and swap the brass weight for the bell's tongue.

**Chapter IV: Coutinho**
11. **Cais do Sodré:** ask Celeste about Zé and which boat. Knock on the hatch, then pull the mooring line twice. Show Zé the tide card.
12. **Cabin:** take the tile from the bunk (the hammer won't do it), then use the bell's tongue on the bunk to break it in time.
13. Use the telephone box on the quay.

**Chapter V: The Drowned Bell**
14. **Bookshop at night:** feed Pessoa the sardine, play the machine, then phone Rui.
15. **Carmo at midnight:** hear Tomás's confession (he gives you his lantern) and go down through the open grate.
16. **Cistern:** give the ledger to Lacerda, cut Inês free, hand her the lantern, cut your own palm, then strike the tongue on the water marks in reverse founding order: **Sanches, Coutinho, Bastos, Ferreira**.

</details>
