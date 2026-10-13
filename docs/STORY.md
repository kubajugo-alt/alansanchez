# The Drowned Bell: story bible and outline

This is the reference for anyone, human or Claude, who extends the story. Sections 1–6 describe the game **as it is built**: every beat below exists in `js/story.js` and `js/lines.js`. Section 7 lists loose threads already planted in the dialogue. Section 8 sketches possible expansions; those are proposals, not canon.

---

## 1. Premise

**Lisbon, 1995.** For nine days a fog has sat on the city, and for nine days people have drowned in their beds. They die in locked rooms, half a mile uphill from the river, with cold Atlantic seawater (salt and sand) in their lungs. A small blue tile is left on each pillow: a bronze bell beneath curling waves.

**Alan Sanchez** is a lazy, witty bookseller in the Alfama. He finds his grandfather's name on the killer's list, and a ledger in a locked drawer that nobody can read. He is the last of the **Sineiros**, the bell-founder family whose blood keeps an ancient bell asleep beneath the city. On the tenth day of fog in 1755, that bell brought the earthquake and the wave. Today is the ninth day.

**Logline:** a man who never leaves his shop has one day to stop the sea walking into Lisbon a second time.

## 2. Tone and style

- **Genre:** Gabriel Knight / Broken Sword. Grounded noir with a supernatural core, played straight but leavened with dry humour.
- **Humour comes from Alan.** He deflects with jokes, and the world takes itself seriously around him. The narrator is wry, elegant and a little melancholy.
- **Atmosphere:** fog, tram bells, fado, salt, old stone, clocks that disagree. Each location has its own light: grey daylight, a fluorescent office, lamp-lit tavern, a ruin under a lavender sky, moonlight, torchlight over black water.
- **Saudade.** Every character has lost something to the past. The story is about inheritance: what our grandparents leave us, and what we owe them.
- **Lines are short and voiceable.** Most are one or two sentences. Portuguese words are used sparingly and are always clear from context (menino, ginjinha, azulejo, escudos).

## 3. Lore

| Element | What we know (canon) |
|---|---|
| **1755** | All Saints' Day earthquake, fire and tsunami. Lisbon "died three times in one morning". In the story it was preceded by a nine-day fog. |
| **Irmandade do Sino Afogado** (Brotherhood of the Drowned Bell) | Eighteenth-century fanatics who rang a bell beneath the city on the morning of the earthquake, "and the river answered". Their seal is a bell beneath waves, now left on the victims' pillows. |
| **The Drowned Bell** | A great bronze bell hanging on a rusted chain over a flooded cistern beneath the Carmo. It is carved with the same waves as the tiles, and tongueless. |
| **The Sineiros / founders** | Bell-founder families who cast Lisbon's bells for 300 years. They cut the tongue (clapper) from the Drowned Bell and "bound it with their blood": **while one founder's blood lives, the bell sleeps.** They wrote in a cipher whose key is carved into the weeping stone at the Carmo. |
| **The rite** | Should the tongue be found, the last founder must **ring the bell backward** to silence it forever. The sound "un-rings", pulled backward out of the air. |
| **The Lacerda family** | Has hunted the founder families for two centuries. Lacerda says "the water is mine, it answers to me", so the family can command the sea in some way. The murders are drownings by seawater. |
| **Founder families** | The list names **Ferreira** (a clockmaker), **Bastos** (a retired teacher), **Coutinho** (a fishwife) and **Sanches** (old spelling). The first three are dead. Joaquim Sanches died earlier: Lacerda gave him "a single drop of seawater" for his heart. |
| **The cipher** | Caesar shift of **7**. The key comes from Amália's fado ("turn the letters seven times"). Plaintext: `THE BROTHERHOOD RANG THE DROWNED BELL`. |

## 4. Cast

| Character | Role | Voice (ElevenLabs) | Wants | Secret or wound | Arc so far |
|---|---|---|---|---|---|
| **Alan Sanchez** | Bookseller, reluctant hero, last Sineiro | Roger, laid-back | To be left alone | Never knew what his grandfather was. Has "a phone number he is afraid to call". | Goes from asleep at eleven to ringing the bell for his grandfather. |
| **Inês Carvalho** | Historian, Alan's assistant and conscience | Sarah, mature and confident | To finish her thesis on 1755; to make Alan try | Joaquim confided in her more than in Alan, but never about bells | Identifies the Brotherhood, is kidnapped as leverage, and warns Alan even while tied up |
| **Insp. Rui Mendonça** | Polícia Judiciária, tired of the weird | Callum, husky | To close the case without believing in it | His grandmother says "the river is breathing", and he is starting to agree | Gives Alan the list and the tile, then tells him to stay away from water |
| **Dona Amália** | Fado singer at the Taberna da Saudade | Mora, gritty and enigmatic | Not to sing *that* song | Loved Joaquim. He married "a sensible woman". | Sings "O Sino Afogado" for the first time to a non-stranger, and gives Alan the key |
| **Father Tomás** | Keeper of the roofless Carmo | Nathaniel, calm and British | To keep the grate locked and the dead asleep | Knows today is the ninth day, and that the 1755 fog lasted nine days | Guides Alan to the stone and prays at midnight |
| **Vicente Lacerda** | Antiquarian in the Chiado, the villain | Blackwood, posh villain | The tongue, the founders' blood in the water, the city returned to the sea | Murdered Joaquim. Heir to the hunters. | Patient, courteous, lethal. Drowned by the water he claimed to own. |
| **Pessoa** | The cat (nine kilos, no ambition) | (none) | Sleep | Has ruined a first edition | Comic relief, available for expansion |
| **Narrator** | The voice of the city | Eleanor, gracious | (none) | (none) | Frames chapters, looks and deaths |

**Speech rules:**
- Alan undercuts tension with a joke, then means it.
- Inês is precise and teasing.
- Rui is weary and literal.
- Amália is a grande dame who calls Alan "menino".
- Tomás speaks in parables and short sentences.
- Lacerda is velvet-gloved menace, never raises his voice until the end, and repeats "patient".

## 5. Locations

| Room id | Place | Mood and light | Who's there |
|---|---|---|---|
| `shop` | Livraria Sanchez, Alfama | Grey fog light through a big window; banker's lamp | Inês (Ch. I–II), Pessoa |
| `street` | Alfama street with the tram stop | Fog, gas lamps burning at noon, laundry lines | (no one) |
| `map` | Map of Lisbon (travel) | (none) | (none) |
| `police` | Polícia Judiciária office | Flickering fluorescent tube, evidence on the desk | Rui |
| `tavern` | Taberna da Saudade | Lanterns and a candle, azulejo walls, guitarra on the wall | Amália |
| `convent` | Convento do Carmo by day | Roofless Gothic nave, lavender sky | Tomás (sweeping) |
| `convent_night` | Carmo at midnight | Moonlight, open grate glowing green | Tomás (with a lantern) |
| `antiques` | Antiguidades Lacerda, Chiado | Clocks, a grandfather clock, the clapper in a glass case | Lacerda |
| `cistern` | Flooded cistern under the Carmo | Torches, black-green water, the Drowned Bell | Lacerda (robed), Inês (tied to a pillar) |

## 6. Chapter outline (as built)

### Chapter I: The Fog
1. **Intro.** The narrator sets the scene. Inês wakes Alan, who is asleep at eleven, and points him to the blinking answering machine.
2. **Machine.** Rui's message: "another one, your kind of weird".
3. **Shop puzzle chain:**
   - Take the coins from the register.
   - Take the key from the sugar tin.
   - Use the key on Grandfather's desk to get the **ledger** (in cipher).
   - Take the **magnifier**.
4. **Police.** Rui explains the locked-room drownings and the tiles. The victim list ends with **Sanches**. Rui: "Stay away from water." Alan sketches the tile (notebook on the evidence bag).
5. **Back at the shop.** Inês recognises the seal (the Brotherhood of the Drowned Bell) and the lost fado "O Sino Afogado". Amália might know it.
6. **Tavern.** Amália knew Joaquim; the old photograph shows them together. She won't sing sober or alone, so Alan buys two ginjinhas. She sings: *"Where the Carmo prays without a roof… turn the letters seven times, son of the founders…"* She names Alan the last Sineiro and sends him to Father Tomás.

### Chapter II: The Weeping Stone
7. **Carmo.** Tomás confirms the family history; the cipher key is under the salt. He mentions the fog of 1755 lasted nine days. Alan: "Today is the ninth day." Tomás: "Yes. I know."
8. **Cipher.** Magnifier on the stone reveals a cipher wheel. Use the ledger on the stone and turn the wheel 7 times. The decoded text explains the rite and names **Lacerda**.
9. **Antiques.** Lacerda is all charm and veiled threats; the clapper is "not for sale". Alan asks about the music box, Lacerda steps into the back room, and Alan steals the **clapper**. Lacerda returns: "you look pale… another day."

### Chapter III: The Drowned Bell
10. **The shop is open and cold. Inês is gone.** Lacerda's message on the machine: "Bring the tongue. Bring your blood. Come alone."
11. **Carmo at midnight.** The grate is open. Tomás heard a woman cry out and will pray.
12. **Cistern finale.**
    - Lacerda confesses to killing Joaquim. Inês is tied to a pillar.
    - Using the clapper while Lacerda watches means death.
    - Instead, give him the **ledger**; he is consumed by it. Then ring the bell backward.
    - The water rises around Lacerda alone and takes him.
    - The fog lifts. Inês and Alan walk up into the tenth morning.
13. **Epilogue.** "Nobody drowned. Nobody noticed. Which, Alan decided, was exactly how it should be."

## 7. Seeds already planted (unused threads)

These lines exist in the game but lead nowhere yet. They are good anchors for new content because players have already heard them.

- **"A phone number he is afraid to call"** (notebook look). Whose? Possibly family (a mother or father never mentioned), or an ex.
- **Ferreira was a clockmaker, and Lacerda's shop is full of clocks** "keeping the time of different centuries". Trophies from his victims?
- **The music box** inlaid with mother-of-pearl, with a silver ship on painted waves. Lacerda calls it "a trinket" a little too quickly.
- **The sea-monster azulejo** in the street, with "a strangely knowing expression".
- **The "unexplained" drawer** at the Judiciária, the only one that won't close.
- **Rui's grandmother**: "the river is breathing". She is a possible source of folk lore.
- **Father Tomás already knew it was the ninth day.** How long has he been waiting, and for whom?
- **Amália and Joaquim**: two years of songs, then he married "a sensible woman". Alan's grandmother is never named.
- **Bell-founders "twice over".** Amália calls them fools twice over, which hints at an earlier betrayal or a second family secret.
- **The bell itself remains** in the cistern after the ending, silenced but not destroyed. Lacerda's body was taken by the water, not found.
- **Inês's thesis on 1755** can carry exposition for any new historical layer.
- **Pessoa the cat**, named after the poet with many heteronyms. He is a natural candidate for a comic or uncanny role.

## 8. Expansion sketch (proposals, not canon)

Ordered from smallest change to largest. Keep the three-chapter spine and the ending.

### A. Deepen what exists (no new rooms)
- **More dialogue topics:**
  - Alan ↔ Inês about her thesis and about Joaquim's last days.
  - Rui about each victim.
  - Amália about the photograph.
  - Tomás about the Carmo before 1755.
- **Optional puzzle at the Judiciária:** open the "unexplained" drawer to find a 1955 case file. Another nine-day fog was stopped by Joaquim as a young man, which explains Amália's song and his secret.
- **Pessoa gag chain:** the cat sleeps on something Alan needs and must be bribed off it (sardines from the tavern).

### B. A fourth location in Chapter II: the Ferreira clock workshop
- The sealed shop of the murdered clockmaker. Rui gives Alan the key once he believes him.
- **Puzzle:** clocks stopped at the minute of each death reveal the pattern of the drownings, all at high tide.
- **Payoff:** proves the murders follow the tide and foreshadows the finale. It also links Lacerda's clocks to the victims.

### C. A new middle chapter: "The Founders' Blood"
- **Between the cipher and the theft:** the ledger lists the other founder families' descendants. Alan has to warn the last living Coutinho child (a fisherman at Cais do Sodré) before high tide.
- **New characters:**
  - Zé Coutinho, a gruff fisherman whose mother was the third victim.
  - Rui's grandmother, an old washerwoman who reads the river.
- **Stakes:** if Alan fails, Zé drowns and the finale gets harder (one fewer founder alive). That is a branching consequence.

### D. Endings
- **Keep the canonical ending.**
- **Add a bittersweet variant** if the player is slow: Tomás descends and sacrifices himself in the cistern. He was a founder too, a hidden fifth name, which pays off "Yes. I know."
- **Post-credits hook:** a fisherman pulls a cream linen jacket from the Tagus, and somewhere a clock starts ticking again.

### E. Sequel seeds
- Other Drowned Bells in other port cities (Porto, Cádiz, Venice) and other founder lines abroad.
- The Brotherhood was never only the Lacerdas.

---

## 9. How to add story content

- **Lines** live in `js/lines.js` as `id: [speaker, text]`.
  - IDs follow `speaker_topic` (e.g. `amalia_photo`). Speakers are `alan`, `ines`, `rui`, `amalia`, `tomas`, `lacerda` and `narr`.
  - Square-bracket tags such as `[whispering]` are ElevenLabs performance directions. They are stripped from subtitles.
  - Voice new lines with `node scripts/generate-voices.mjs <ids>` (see README).
- **Rooms, hotspots, dialogue trees and puzzles** live in `js/story.js`.
  - Story state is plain flags on `F()` (e.g. `F().decoded`).
  - `G.dialog([...])` builds topic menus; `say(...ids)` plays lines in sequence.
- **New characters** need painted frames (Canva, same style prompt, white background), matted with `scripts/matte.py`. Each character needs at least idle, talk and walk frames.
- **New backgrounds** are 1280×720 paintings in `art/bg/`, with a walk polygon, a depth scale, lights and hotspots defined per room.
- **Continuity checklist:**
  - Today is the **ninth** day.
  - The key is **7**.
  - Old spelling is **Sanches**, modern is **Sanchez**.
  - The finale requires the ledger distraction before the bell.
  - Nobody in the city must ever learn what happened.
