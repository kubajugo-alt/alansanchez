# Alan Sanchez: The Drowned Bell

A 1990s-style pixel-art point-and-click mystery in the spirit of *Gabriel Knight: Sins of the Fathers*, fully voiced with ElevenLabs.

> **Lisbon, 1995.** For nine days the fog has not lifted from the river, and for nine days people have been drowning in their own beds, in locked rooms, half a mile from the water. Alan Sanchez, a lazy bookseller in the Alfama, finds his own family name on the killer's list, and a ledger in his late grandfather's drawer that nobody can read.

## Play

Open `index.html` through any static web server:

```bash
npx serve .        # or: python3 -m http.server
```

**Controls**
- **Left-click** a spot to walk there, or a thing to use the current verb on it.
- **Right-click** or keys **1–5** to cycle verbs: Walk, Look, Take, Use, Talk.
- **Use / Give:** pick *Use*, click an inventory item, then click the person or thing to use it on.
- **Click, Space or Esc** to skip a line of dialogue.
- The game autosaves on every room change. *Save* and *Load* are in the bottom-right panel.

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

## How it's built

There are no images and no build step. It is plain HTML, CSS and JavaScript:

| File | What it does |
|---|---|
| `js/art.js` | Draws every background and character sprite in code at 320×150 (VGA-style dithering), then scales it up with nearest-neighbour. Also draws the animated fog layers. |
| `js/audio.js` | Procedural soundtrack using Web Audio: a Karplus-Strong *guitarra portuguesa* for fado, inharmonic bronze bells, foghorns and pads. Also plays the voice lines. |
| `js/engine.js` | The adventure engine: rooms, walk boxes, depth scaling, verbs, inventory, dialogue trees, cutscenes and saves. |
| `js/story.js` | The game itself: the cast, the items, eight rooms and every puzzle. |
| `js/lines.js` | Every spoken line, used for both the subtitles and the voice generation. |
| `audio/voice/*.mp3` | ElevenLabs voice-over, one file per line ID. `manifest.json` lists the lines that have a recording. Any line without one falls back to subtitles only. |

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
