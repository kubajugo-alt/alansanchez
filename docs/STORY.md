# The Drowned Bell — Story Bible v2 (Expanded)

Oct 13, 2026 · @Kuba

## What changed from v1

v2 grows the game from three chapters and nine rooms to five chapters and fourteen rooms, with four new characters. The core is untouched: Lisbon 1995, the ninth day of fog, the tile murders, Amália's song, the cipher key of 7, the stolen clapper, Inês as hostage, the ledger distraction and the backward ringing. Everything below replaces v1 sections 1–8 as canon; v1 section 9 (how to add content) still applies and is summarised at the end.

The main changes:

- **Lore holes closed.** The blood rule, the purpose of the tongue, why Lacerda spared Alan, why the ledger distracts him and why the 1955 fog ended are now explained and planted early (see Lore).

- **Every v1 seed is paid off.** The 1955 drawer, Ferreira's clocks, the music box, Rui's grandmother, Tomás's "Yes. I know.", "fools twice over", the phone number, the sea-monster tile and Pessoa all now lead somewhere.

- **Two new chapters.** Chapter II (The Unexplained Drawer) is an investigation chapter with two parallel threads. Chapter IV (The Founders' Blood) is a race against the 18:25 turning of the tide to save Zé Coutinho.

- **A real finale puzzle.** The cistern now asks the player to combine five things learned across the game, with a soft-fail water meter instead of a single instant death.

- **One canonical ending**, plus small epilogue variations driven by optional scenes. No branching that changes the plot.

**v2.1:** Alan is now 37 (timeline re-dated), jokes constantly with double meanings (see Alan's humour and the line tables at the end of each chapter), the rooms have ambient NPCs, and a full production spec covers art, UI, audio, cutscenes, systems and hints.

## Premise

Lisbon, 1995. For nine days a fog has sat on the city, and people have drowned in their beds: in locked rooms, half a mile uphill from the river, their lungs full of cold Atlantic seawater. A small blue tile lies on each pillow, showing a bronze bell beneath curling waves.

Alan Sanchez is a lazy, witty bookseller in the Alfama. His grandfather Joaquim died ten days ago of what the doctor called a weak heart. The fog came the next morning. Now Alan finds the family name on the killer's list and a ledger in a locked drawer that nobody can read.

He is the last of the Sineiros, the bell-founder line whose blood keeps an ancient bell asleep beneath the city. In 1755 that bell was rung on the tenth morning of a nine-day fog, and Lisbon died three times: earthquake, fire and wave. In 1955 the fog came back, and a 43-year-old Joaquim stopped it, but only halfway: he took the tongue and ran instead of silencing the bell. He hid it for forty years and never told anyone. Today is the ninth day again.

**Logline:** a man who never leaves his shop has one day to finish what his grandfather started, before the sea walks into Lisbon a second time.

**The day at a glance:** the game runs from 11:00 on the ninth day to dawn on the tenth. The river "turns" (slack water) four times a day, and the murders happen at the turnings. The two that matter are 18:25 (Zé Coutinho's death, if Alan is late) and 00:35 (high water, when the cistern opens and Lacerda performs the rite).

## Tone and style

The register is Gabriel Knight and Broken Sword: grounded noir with a supernatural core, played straight but leavened with dry humour.

- **Humour comes from Alan.** He deflects with jokes while the world takes itself seriously around him. Each chapter should give him at least one moment where he stops joking.

- **The narrator** is wry, elegant and a little melancholy. She frames chapters, describes looks and narrates deaths.

- **Atmosphere:** fog, tram bells, fado, salt, old stone, clocks that disagree. Each room has its own light (see Locations).

- **Saudade.** Every character has lost something to the past. The theme is inheritance: what our grandparents leave us and what we owe them.

- **Lines are short and voiceable,** one or two sentences. Portuguese is sparing and always clear from context (menino, avó, madrinha, ginjinha, azulejo, escudos, sineiro).

- **The supernatural is never explained by anyone who sounds certain.** Celeste, Tomás and Amália speak in folk terms; the ledger speaks in old formal terms; Alan translates both into jokes.

**Speech rules (all characters):**

| Character | Rule                                                                                  |
|-----------|---------------------------------------------------------------------------------------|
| Alan      | Jokes constantly, preferably with a double meaning; then means it (see Alan's humour) |
| Inês      | Sassy, precise and teasing; corrects his history (and Portugal's, when it forgets Brazil paid for it) |
| Rui       | Weary and literal; never says "supernatural"                                          |
| Amália    | Grande dame; calls Alan "menino"                                                      |
| Tomás     | Parables, short sentences                                                             |
| Lacerda   | Velvet menace; repeats "patient"; raises his voice only at the end                    |
| Celeste   | Blunt, earthy; talks about the river as if it were a neighbour                        |
| Zé        | Gruff, few words, swears at the sea rather than at people                             |
| Abílio    | Shouts (bell-deaf); answers the question he thinks he heard                           |

### Alan's humour

Alan is 37, single, lives above the shop he inherited in all but paperwork, and has turned avoiding things into an art form. His humour is how he avoids things. He should crack a joke in almost every exchange, and the best ones carry two meanings at once.

**Rules for writing Alan:**

1.  **One joke per beat, minimum.** Every scene, every look at an important object and every failed use gets an Alan line with a joke in it. Generic failure lines ("I can't do that") are banned.

2.  **Prefer the double meaning.** The game's vocabulary is built for it: tongue, ringing (a bell / a phone), turning (the tide / over in bed / a page), founder (bell-founder / to founder, sink), keeping books, the last of the line, blood (family / literal), patience, sinking feelings, being in deep water. Reuse these motifs so the jokes rhyme across the game.

3.  **Innuendo is allowed, never crude.** Cheeky, Carry On by way of Lisbon: the joke works on the clean reading too. No slurs, nothing at a victim's expense.

4.  **The joke lands, then he means it.** In the big emotional beats (Joaquim's handwriting, Joaquim's 1955 page, Tomás's confession, calling his mother) Alan starts to joke and stops, or doesn't joke at all. The silence is the punchline. Mark these lines with \[pause\] in lines.js.

5.  **Running gags:** his age and his naps; Pessoa as his spiritual twin; never returning calls (pays off with "ringing back" a bell and calling his mother); Camões nobody buys; Rui's coffee.

6.  **Other characters react.** Inês rolls her eyes and scores his jokes out of ten; Rui ignores them; Amália laughs at the dirty ones; Lacerda finds them "charming"; Abílio mishears them into better ones.

**The two-meaning motifs and where they pay off:**

| Motif         | Double meaning                             | Set up                                   | Paid off                                              |
|---------------|--------------------------------------------|------------------------------------------|-------------------------------------------------------|
| Ringing back  | Returning a call / ringing a bell backward | The phone number he's afraid to call (I) | The rite (V); calling his mother (epilogue)           |
| The tongue    | Bell clapper / the other kind              | The glass case (III)                     | Breaking the tile (IV), the finale (V)                |
| Turning       | Tide / turning over in bed / a new leaf    | The tide clock (II)                      | Zé saved at the turn (IV); Alan's new leaf (epilogue) |
| Founder       | Bell-founder / to founder                  | Inês and Amália (I)                      | Lacerda in the water (V)                              |
| Keeping books | Bookkeeping / bookselling                  | The ledger (I)                           | The ledger goes down with Lacerda (V)                 |

## Lore

The supernatural runs on five rules. Every puzzle and every line of exposition must agree with them.

### The five rules

1.  **The founders cast the bell, then bound it.** In 1754 the Brotherhood of the Drowned Bell paid the four founder families to cast a great bell for a cistern under the Carmo. A Sanches hand rang it on the tenth morning of the 1755 fog, believing it was a blessing. After the wave, the founders cut out its tongue (the clapper) and bound the bell with their blood. That is why Amália calls them "fools twice over": once for casting it, once for ringing it.

2.  **While any founder line lives, the bell sleeps.** It cannot wake itself. It can only be woken by a founder's hand, with its own tongue, wet with that founder's blood, at a turning of the tide between the ninth night of a fog and the tenth dawn. Rung forward, it wakes and calls the sea. Rung backward, it is silenced forever.

3.  **The tongue calls the fog.** When the tongue comes within reach of the cistern, the bell breathes and the fog rises for nine days. If nobody rings it by the tenth dawn, the fog lifts and the window closes for a generation.

4.  **The water answers to the Lacerdas.** The Brotherhood's priests were Lacerdas, and their oath gives them command of the bell's water. The tiles are made of clay from the cistern floor, "a mouthful of the sea kept in clay". A tile left beside a sleeper drowns them at the next turning of the tide. Ordinary tools cannot break one; bronze from the bell can. When the bell is silenced, the oath breaks and the water takes its debt.

5.  **The cipher is a Caesar shift of 7.** The key is carved on the weeping stone at the Carmo and hidden in Amália's fado ("turn the letters seven times"). Joaquim learned the key from his father and wrote it into that song for her in 1934, a love song with a family secret inside.

### Why Lacerda does what he does

Only a founder can ring the bell, forward or backward. Any founder who knows the rite can silence it, so Lacerda must kill every founder who might, and keep alive one who doesn't know how.

- **He killed Joaquim first** because Joaquim had hidden the tongue since 1955 and knew the rite. A single drop of seawater on the heart; the doctor saw a weak heart. Lacerda took the tongue and Joaquim's music box. The fog rose the next morning.

- **He drowned Ferreira, Bastos and Maria Coutinho** at three turnings of the tide, one founder per tile.

- **He left Alan for last** because Alan knew nothing. "You were the only founder who never asked a question. I am grateful."

- **He planned Zé Coutinho for the 18:25 turning today.** Zé is Maria's son, unregistered, and Lacerda found him anyway. Joaquim had found him first and written him into the ledger.

- **He needs "your blood"** because the bell only takes its tongue from a founder's bleeding hand.

- **He cannot resist the ledger** because it is the founders' genealogy, two centuries of every line he hunted and every one he missed, in Joaquim's hand. He is a collector before he is a killer.

### Timeline

| Year    | Event                                                                                                                                                                                                                                                                                                                                                                    |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1754    | The Brotherhood commissions the bell from the Ferreira, Bastos, Coutinho and Sanches foundries. The Lacerda kiln makes the first tiles.                                                                                                                                                                                                                                  |
| 1755    | Nine-day fog. On 1 November, the tenth morning, a Sanches founder rings the bell. Earthquake, fire and tsunami. The founders cut the tongue and bind the bell.                                                                                                                                                                                                           |
| 1756    | A cipher stone is set in the Carmo. Its salt crust gives it the name "weeping stone".                                                                                                                                                                                                                                                                                    |
| 1926    | Joaquim (14) and Abílio (12) ring the Sé bells together as boys.                                                                                                                                                                                                                                                                                                         |
| 1934    | Joaquim (22) and Amália (20): two years of songs. He writes "O Sino Afogado" for her, with the key inside it.                                                                                                                                                                                                                                                            |
| 1936    | Joaquim marries "a sensible woman", Alan's grandmother Graça. Their son, Alan's father, is born in 1937.                                                                                                                                                                                                                                                                 |
| 1955    | The tongue resurfaces in an estate sale. Afonso Lacerda raises the fog. Joaquim (43) and altar boy Tomás (11) go down into the cistern. Afonso drowns in his own water in the struggle. Joaquim has the tongue and the bell in front of him, and runs. Vicente, Afonso's son (12), watches. The fog lifts on the tenth dawn. Police file the drownings as "unexplained". |
| 1956 on | Tomás swears to keep the Carmo grate locked and becomes its priest. Joaquim hides the tongue and never speaks of it.                                                                                                                                                                                                                                                     |
| 1958    | Alan is born. His father dies when Alan is nine; his mother moves to Porto. Joaquim raises him above the shop.                                                                                                                                                                                                                                                           |
| 1995    | Vicente Lacerda (52) kills Joaquim (83) and takes the tongue. Nine days of fog. Alan is 37. Today is the ninth day.                                                                                                                                                                                                                                                      |

## Cast

Eleven speaking roles: seven returning, four new. New characters need ElevenLabs voices and painted frames (idle, talk, walk at minimum); suggested voices are placeholders to audition.

### Returning

| Character            | Role                               | Voice                       | Wants                                                                    | Secret or wound                                                                                    | Arc in v2                                                                                                                                  |
|----------------------|------------------------------------|-----------------------------|--------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Alan Sanchez (37)    | Bookseller, last Sineiro           | Roger, laid-back            | To be left alone                                                         | Raised by Joaquim above the shop. Has his mother's number in Porto and hasn't called in two years. | From asleep at eleven to doing what his grandfather ran from. Calls his mother at dawn.                                                    |
| Inês Carvalho        | Historian, assistant, best friend, conscience. A Black Brazilian woman from Salvador who moved to Lisbon for her doctorate and stayed: sassy, confident, curvy, very smart. Wears a black blazer over a faded grunge band tee, high-waisted jeans, heels, gold hoops and bangles | Taciana, vibrant Brazilian | To finish her thesis on 1755; to make Alan try                           | Joaquim confided in her more than in Alan, but never about bells                                   | Hint-giver at the shop in Ch. I–IV. Kidnapped in Ch. V; warns Alan while tied, then holds the lantern for the rite.                        |
| Insp. Rui Mendonça   | Polícia Judiciária                 | Callum, husky               | To close the case without believing in it                                | His avó says "the river is breathing" and he's starting to agree                                   | Gives the list (I), opens the 1955 drawer and lends the Ferreira key (II), waits outside the Carmo (V). Closes the drawer in the epilogue. |
| Dona Amália (81)     | Fado singer, Taberna da Saudade    | Mora, gritty and enigmatic  | Not to sing that song                                                    | Loved Joaquim; he married someone sensible                                                         | Sings the song (I), identifies the music box from her photo (III, optional), gives a blessing on the last night (V, optional).             |
| Father Tomás (51)    | Keeper of the roofless Carmo       | Nathaniel, calm and British | To keep the grate locked                                                 | The altar boy in the cistern in 1955. He has waited forty years for the next Sineiro.              | Guides Alan to the stone (III); at midnight tells him the truth about 1955 and gives him the lantern (V).                                  |
| Vicente Lacerda (52) | Antiquarian in the Chiado, villain | Blackwood, posh villain     | The bell rung forward; the founders gone; the city given back to the sea | Watched his father drown in 1955. Killed Joaquim.                                                  | Courteous host (III), voice on the machine (V), drowned by his own water (V).                                                              |
| Pessoa               | The cat, nine kilos, no ambition   | (none)                      | Warmth                                                                   | Has ruined a first edition                                                                         | Blocks the desk (I) and sleeps on the warm answering machine (V) until bribed with Zé's sardine.                                           |
| Narrator             | The voice of the city              | Eleanor, gracious           | (none)                                                                   | (none)                                                                                             | Chapter cards, looks, the 1755 and 1955 flashback narration                                                                                |

### New

| Character                  | Role                                                           | Voice (to audition)                | Wants                                               | Secret or wound                                                                          | Arc                                                                                                                        |
|----------------------------|----------------------------------------------------------------|------------------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Dona Celeste Mendonça (70) | Rui's avó; washerwoman at the Alfama lavadouro; Zé's godmother | Older, earthy, warm female         | For Rui to eat properly; for the river to calm down | Saw Joaquim and the boy come up from the Carmo at dawn in 1955 and never told the police | Lore source (II): the river breathes, the tiles are "the sea in clay", bronze breaks them. Leads Alan to Zé's boat (IV).   |
| Zé Coutinho (34)           | Fisherman at Cais do Sodré; son of victim Maria Coutinho       | Gruff, low male                    | To be left alone with his grief                     | Didn't know he was a founder. A tile appeared in his bunk this morning.                  | Saved at the 18:25 turning (IV). Gives Alan his knife and a sardine. Pulls Lacerda's jacket from the Tagus (post-credits). |
| Sr. Abílio (81)            | Last hand bell-ringer at the Sé cathedral                      | Loud, cracked old male             | Someone to talk to who isn't a bell                 | Rang with Joaquim as boys; deaf from sixty years of bells                                | Reads notes Alan writes in his notebook; shows him the four founder bells and the order they were cast (III).              |
| Sr. Ferreira (posthumous)  | Clockmaker, first victim                                       | (none; his notes are read by Alan) | (none)                                              | Made locks for all four founder families and for Lacerda's glass case                    | His sealed workshop is a room in Ch. II. His tide clock reveals the pattern.                                               |

## Locations

Fourteen rooms, nine of them existing. New rooms need a 1280×720 painting, walk polygon, depth scale, lights and hotspots.

| Room id             | Place                            | Mood and light                                                                  | Who's there                              | Chapters                |
|---------------------|----------------------------------|---------------------------------------------------------------------------------|------------------------------------------|-------------------------|
| shop                | Livraria Sanchez, Alfama         | Grey fog light, banker's lamp. Ch. V: cold, door open, lamp only.               | Inês (I–IV), Pessoa                      | I–V                     |
| street              | Alfama street, tram stop         | Fog, gas lamps lit at noon, laundry lines, sea-monster azulejo                  | (no one)                                 | I–V                     |
| map                 | Map of Lisbon (travel)           | Locations unlock as learned                                                     | (none)                                   | I–V                     |
| police              | Polícia Judiciária office        | Flickering tube, evidence desk, coffee machine, the drawer that won't close     | Rui                                      | I–II                    |
| tavern              | Taberna da Saudade               | Lanterns, candle, azulejo walls, guitarra                                       | Amália                                   | I, III (opt.), V (opt.) |
| **lavadouro** (new) | Public washhouse, Alfama         | Steam over stone basins, wet sheets, fog leaking in through arches              | Celeste                                  | II                      |
| **ferreira** (new)  | Relojoaria Ferreira, Baixa       | Sealed, police tape, shutters down; one oil lamp. Every clock stopped at 03:12. | (no one)                                 | II                      |
| convent             | Convento do Carmo by day         | Roofless Gothic nave, lavender sky, holy-water stoup, the weeping stone         | Tomás (sweeping)                         | III                     |
| **se_tower** (new)  | Bell chamber of the Sé cathedral | Dusty shafts of light through louvres, four great bells, ropes                  | Abílio                                   | III                     |
| antiques            | Antiguidades Lacerda, Chiado     | Clocks keeping different centuries, glass case, music box                       | Lacerda                                  | III                     |
| **cais** (new)      | Cais do Sodré quay               | Fog over moored fishing boats, gulls, crates, a harbour clock                   | Celeste (laundry for the boats)          | IV                      |
| **boat** (new)      | Deck and cabin of the *Maria Fé* | Wet planks, hatch, a narrow bunk, one porthole of grey light                    | Zé                                       | IV                      |
| convent_night       | Carmo at midnight                | Moonlight, open grate glowing green                                             | Tomás (with a lantern)                   | V                       |
| cistern             | Flooded cistern under the Carmo  | Torches, black-green water, the Drowned Bell, a rising waterline                | Lacerda (robed), Inês (tied to a pillar) | V                       |

**Map unlocks:** police after the answering machine; tavern after Inês names Amália; lavadouro and ferreira after the drawer is opened; convent after Ch. II; se_tower and antiques after decoding; cais after the genealogy page. Rooms whose story is finished stay visitable with closing lines.

## Structure

Five chapters over one day, each ending on a turn in what Alan knows. The in-game clock is narrative, not real-time: it advances at chapter cards and is shown on the harbour clock, Ferreira's tide clock and Lacerda's clocks.

| Ch. | Title                  | Clock       | Question the player answers                                | Rooms                                       | New this chapter                                                |
|-----|------------------------|-------------|------------------------------------------------------------|---------------------------------------------|-----------------------------------------------------------------|
| I   | The Fog                | 11:00–13:30 | What is killing people, and why is our name on the list?   | shop, street, police, tavern                | Pessoa desk gag, dripping hang-up, brass weight, matches, glass |
| II  | The Unexplained Drawer | 13:30–15:30 | Has this happened before, and when do they die?            | police, lavadouro, ferreira, shop           | All new chapter: 1955 file, Celeste, tide clock, vitrine key    |
| III | The Weeping Stone      | 15:30–17:15 | What is the bell, who is ringing it, and how do I stop it? | convent, se_tower, antiques, tavern (opt.)  | Holy-water stone, Abílio, founder order, the J.C. clock         |
| IV  | The Founders' Blood    | 17:15–18:25 | Who is the next to die, and can I get there first?         | shop, cais, boat                            | All new chapter: Zé, the tile broken with the tongue            |
| V   | The Drowned Bell       | 19:00–dawn  | Can I do what my grandfather couldn't?                     | shop, tavern (opt.), convent_night, cistern | Pessoa on the machine, Tomás's confession, the five-step rite   |

**Structural rules:**

- Each chapter has at least one stretch where two threads can be done in either order (Ch. II: Celeste and Ferreira; Ch. III: Sé and antiques after decoding; Ch. V: tavern optional).

- Inês stays at the shop through Ch. IV and acts as the hint system: talking to her summarises the current goal in character.

- Every item is used at least once; most are used twice. See the item list.

- The only hard fail state is the finale water meter, which restarts the cistern scene.

## Chapter I: The Fog

11:00–13:30. Alan learns that people are drowning in locked rooms, that his grandfather wrote the killer's list, and that a song holds a key. Rooms: shop, street, police, tavern.

### I.1 Intro

The narrator opens on the city: nine days of fog, three drowned, the trams ringing for no one. Inês wakes Alan, asleep across the counter at eleven. She points at the blinking answering machine.

- **narr_intro**: "For nine days the fog had sat on Lisbon like a cat on a warm book. Nobody could move it, and nobody quite liked to try."

- **ines_wake**: "It's eleven, Alan. Even the cat has done more today."

### I.2 The shop

**The machine** holds two messages. Message 1 is Rui: "another one, your kind of weird". Message 2 is eight seconds of dripping water and a click. It is Lacerda checking that Alan is home; the player learns this in Ch. V.

- **alan_hangup**: "Wrong number. Or a very sad plumber."

**Puzzle I-A: the desk and the cat.** Goal: get the ledger.

1.  Take the key from the sugar tin.

2.  Grandfather's desk is locked, and Pessoa is asleep on it under the banker's lamp. Take, talk or push all fail ("Nine kilos of no.").

3.  Use the banker's lamp (switch off). The desk cools; Pessoa relocates to the radiator.

4.  Use the key on the desk. Take the ledger.

Logic: cats follow heat; the player has seen the lamp lit over the sleeping cat. Inês hint: "He only sleeps there because it's warm. Like you."

**Free pickups:** three coins from the register; the magnifier from the window shelf; the brass weight (two kilos) from the bookbinding press ("Every adventurer should carry something pointless."). Alan starts with his notebook.

- **alan_look_ledger**: "Letters like a drunk's alphabet. And at the end, Grandfather's hand."

- **alan_look_notebook**: "Shopping lists, a sonnet I never finished, and a phone number I'm afraid to call. Ringing people back was never my strong suit."

The door to the street opens once the machine has been played.

### I.3 The street

Tram stop, gas lamps lit at noon, laundry hanging dead still. The sea-monster azulejo has "a strangely knowing expression". With the magnifier: in its claw, very small, is a bell. This is optional, but it is the player's first sight of the seal outside the police station, and Inês comments on it later.

### I.4 The Polícia Judiciária

Rui is behind a desk under a flickering tube. Dialogue topics:

- **The drownings:** locked rooms, beds dry, lungs full of seawater with salt and sand. Three in nine days.

- **The victims:** Ferreira, clockmaker, Baixa; Bastos, retired teacher, Graça; Maria Coutinho, fishwife, Madragoa. All died in bed (Bastos during his siesta), "each within the same hour as the tide report, which means nothing".

- **The tile:** in an evidence bag on the desk. Alan can't take it. Use the notebook on the bag to sketch it.

- **The list:** found in Maria Coutinho's apron. Four old names: Ferreira, Bastos, Coutinho, Sanches. Alan recognises the handwriting as Joaquim's, who died before all of them. This is the chapter's first real chill.

- **Strange cases:** Rui mentions "the only drawer in this building that won't close" and shuts the topic: "Not today." The coffee machine is visible on the wall (used in Ch. II).

- **alan_list_hand**: "That's my grandfather's writing. He's been dead ten days. He wrote this before any of them died."

- **rui_water**: "Stay away from water, Sanchez." **alan_water**: "Inspector, I've been avoiding water for thirty-seven years. Ask my bathtub."

### I.5 The shop again

Inês sees the sketch and identifies the seal: the Irmandade do Sino Afogado, eighteenth-century fanatics who "rang a bell beneath the city and the river answered". She knows of a lost fado, "O Sino Afogado", and that Joaquim used to drink at the Taberna da Saudade, where Dona Amália sings. Tavern unlocks.

### I.6 The Taberna da Saudade

Amália knew Joaquim. Dialogue topics: Joaquim, the fog, the song (refused), the photograph.

- **The photograph** on the wall shows Amália and Joaquim in 1934. Behind them on a shelf is a music box inlaid with mother-of-pearl, with a silver ship on painted waves. Looking at it sets the flag needed to recognise the box in Ch. III.

- **Matches:** a box beside the candle. Amália: "Take them. I have given up smoking eleven times."

**Puzzle I-B: the song.** Goal: hear "O Sino Afogado".

1.  Ask for the song. Amália: "Not sober, menino. And never alone."

2.  Use two coins on the bar: two ginjinhas. One coin remains.

3.  Give her one ginjinha. They toast to Joaquim.

4.  Cutscene: she sings.

Logic: she gives both conditions in one line; "alone" means someone must drink with her. After the song, the empty glass can be picked up ("For luck. And because I haven't stolen anything yet today.").

**The song (key lines):**

> Where the Carmo prays without a roof, / the stone weeps salt for what we did. / Turn the letters seven times, / son of the founders, and ring it back.

Amália then tells him what he is: the last of the Sineiros. She adds the hook for Ch. II: "The last time the fog stayed this long, your grandfather came home with white in his hair. Ask the police about nineteen fifty-five."

- **amalia_menino**: "He sang it better. He wrote it, after all."

### I.7 Alan's lines for this chapter

Add these to lines.js alongside the lines above. Inês's score lines (ines_score_1 to ines_score_10, "Four out of ten. The cat laughed.") can follow any joke marked ★, chosen at random.

| Line id             | Trigger                       | Line                                                                                                                                                    |
|---------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| alan_wake ★         | Reply to ines_wake            | "I'm thirty-seven, Inês. At my age you don't wake up. You resurface."                                                                                   |
| alan_look_register  | Look at register              | "Three coins. My entire liquid assets. Liquid being the word, in this weather."                                                                         |
| alan_take_coins     | Take coins                    | "Petty cash. Petty, but loyal."                                                                                                                         |
| alan_sugar_tin      | Take key                      | "Grandfather kept his key in the sugar. Sweet man. Suspicious, but sweet."                                                                              |
| alan_look_pessoa    | Look at Pessoa                | "Named after a poet with seventy personalities. This one has one, and it's asleep."                                                                     |
| alan_lamp_off ★     | Lamp switched off, cat leaves | "No warmth, no company. He's like every relationship I've had."                                                                                         |
| alan_take_ledger ★  | Take ledger                   | "Grandfather kept the books. I just sell them. Neither of us ever balanced."                                                                            |
| alan_take_weight    | Take brass weight             | "Every adventurer should carry a dead weight. Inês carries me."                                                                                         |
| alan_take_magnifier | Take magnifier                | "For the small print. In this family, it's all small print."                                                                                            |
| alan_look_monster   | Look at sea-monster tile      | "It has a knowing look. It's seen me before eleven, which almost nobody has."                                                                           |
| alan_mag_monster ★  | Magnifier on tile             | "It's holding a bell. Everyone in this city is ringing something except me."                                                                            |
| alan_rui_hello      | First talk to Rui             | "You look like a man who hasn't slept, Inspector. We should swap. I've got plenty."                                                                     |
| alan_rui_locked     | Drownings topic               | "Locked rooms, dry beds, wet lungs. Even my love life makes more sense."                                                                                |
| alan_sketch ★       | Notebook on evidence bag      | "I can't take the evidence, but I can take a likeness. Story of my romantic life."                                                                      |
| alan_founders ★     | Inês names the founders       | "Bell-founders. So that's the family business. And I've been foundering in a bookshop."                                                                 |
| alan_ginjinhas      | Coins on bar                  | "Two ginjinhas. One for courage, one for the courage to drink the first."                                                                               |
| alan_matches        | Take matches                  | "Eleven times? Practice makes perfect."                                                                                                                 |
| alan_ringer ★       | Amália names him a Sineiro    | "A ringer. I've been called many things, Dona Amália, but never a ringer." **amalia_called**: "Nobody calls you anything, menino. That's your trouble." |

Do not add a joke to alan_list_hand; play it with \[pause\].

### Chapter I card

**narr_ch1_end**: "Alan had a ledger he couldn't read, a song he couldn't forget, and a grandfather who had known everything. It was a quarter past one. The river was due to turn at twenty-five past six, but nobody had told him that yet."

## Chapter II: The Unexplained Drawer

13:30–15:30. Alan learns that this happened in 1955, that his grandfather was there, and that the victims die when the river turns. Rooms: police, lavadouro, ferreira, shop. After the drawer, the lavadouro and Ferreira threads can be played in either order.

**narr_ch2_card**: "There is a drawer in every city that will not close. In Lisbon it was on the second floor of the Judiciária, and it had been open for forty years."

### II.1 The drawer

Asking Rui about 1955 unlocks the drawer topic. He points to a filing cabinet whose bottom drawer has stood an inch open since before he was born: "Crowbars, carpenters, once a priest."

**Puzzle II-A: the drawer.** Goal: open it.

1.  Use the magnifier on the drawer seam. A white crust: sea salt. **alan_salted**: "It isn't swollen. It's salted shut."

2.  Use the last coin on the coffee machine. Take the coffee.

3.  Use the coffee on the seam. The salt melts; the drawer slides open.

Logic: Rui has already said "salt and sand"; hot liquid dissolves salt; the coffee machine is the only liquid in the office. **rui_coffee**: "That was my coffee." **alan_coffee**: "It died for a good cause."

**The 1955 file** (item, a photocopy; "the original stays, the drawer will want it back"). Case 55/114, nine-day fog, November 1955:

- Two drownings. A dockworker in his bed in Alfama. An antiquarian, A. Lacerda, found in the flooded cistern under the Carmo.

- A blue tile in the dockworker's room, same seal.

- Witnesses: J. Sanches, bookseller, 43, "found the second body"; a minor, an altar boy, unnamed; a washerwoman who refused to sign.

- Closed: "unexplained".

**alan_lacerda_name**: "Lacerda. There's an antiques shop in the Chiado with that name. Lisbon is full of Lacerdas. I'm not accusing a man of murder over a surname." (The antiques shop stays locked on the map until Ch. III.)

Rui reads the file over Alan's shoulder and gives three things:

- **The times of death**, "the coroner was very precise": Ferreira 03:12, Bastos 15:38, Coutinho 04:01.

- **His avó:** "My grandmother found a body in fifty-five. She never told me where. She washes at the lavadouro. Don't tell her I sent you."

- **The Ferreira key:** "His shop is sealed. Forensics found nothing but clocks. If you find something, you found it by accident."

The map unlocks lavadouro and ferreira. Both are required; the chapter closes (II.4) once both are done, in either order.

### II.2 The lavadouro (either order)

Steam, stone basins, wet sheets. Celeste won't stop working: "Talk while you twist." Use Alan on the sheet she's wringing (he holds one end, badly) to open the conversation. Topics:

- **The river:** it breathes four times a day, in and out. "You don't sleep at a turning in a fog. Everybody's grandmother knows that. Nobody's grandson listens."

- **The tiles** (show the sketch): "That's not a tile. That's a mouthful of the sea, kept in clay. Nothing breaks it but what the bell remembers." Alan: "Which is?" "Bronze, menino. What else does a bell remember?"

- **1955** (show the file): she was the washerwoman who refused to sign. At dawn on the tenth day she saw Joaquim and a small boy come up out of the Carmo grate, carrying something heavy in sailcloth. "He looked like a man who had left the oven on."

- **Maria Coutinho:** her friend. "I washed her boy's sweaters since he was born. He's on the river. Nobody told him to stay away from water either." (Seed for Ch. IV; Alan doesn't follow it up yet.)

- **Rui:** "Is he eating?" Alan: "Mostly coffee. Less than he used to."

Flags: lore_turnings, lore_bronze, knows_1955_boy.

### II.3 Relojoaria Ferreira (either order)

Police tape, shutters down. Use the Ferreira key on the door. Inside it's black.

**Puzzle II-B: light.** Use the matches on the oil lamp on the workbench. Every clock in the shop is stopped at 03:12. **alan_clocks**: "They didn't run down. They stopped. Together."

**Puzzle II-C: the tide clock.** Goal: learn when they die.

1.  Read the repair book on the bench. Ferreira's last entries: a tide clock "for myself, because the river is keeping time and I want to see it", and an old note: "All my founder locks share one key-square. Old habit. Old families."

2.  The brass tide clock on the bench is unwound, and its winding key is missing. Use Joaquim's desk key on it (Ferreira made the Sanches desk lock). It ticks, and its tide dial swings.

3.  Look at the tide clock with the times from Rui. All three deaths sit exactly on a turning. Today's remaining turnings: 18:25 and 00:35.

4.  Take the tide card pinned under the clock: Ferreira's handwritten table of the turnings for the whole fog.

Logic: the repair note tells the player the desk key will fit; the times came from Rui; the dial gives the match. **alan_turnings**: "They don't die at night. They die when the river turns. Celeste was right. Celeste is always right, apparently." (The last sentence plays only if the lavadouro was done first.)

**Free pickup:** the key board by the door has a hook tagged "Antig. L., vitrine (dup.)". Take the vitrine key. **alan_spare**: "Ferreira kept spares of everyone's locks. A clockmaker's revenge."

### II.4 The shop

Inês pulls it together: the deaths follow the tide, Joaquim was there in 1955, and the song points to the Carmo. She adds a piece of her thesis: the 1755 fog also lasted nine days, and the wave came on the tenth morning. The convent unlocks.

- **ines_tenth**: "Nine days of fog, Alan. Then the tenth morning. I've written forty pages about that morning."

- **alan_tenth**: "Write a forty-first. Make it boring."

### II.5 Alan's lines for this chapter

| Line id              | Trigger                      | Line                                                                                                  |
|----------------------|------------------------------|-------------------------------------------------------------------------------------------------------|
| alan_look_drawer ★   | Look at the drawer           | "Forty years and it still won't close. I own trousers like that."                                     |
| alan_coin_machine    | Coin in coffee machine       | "My last coin, on the inspector's coffee. Most generous thing I've done since 1987."                  |
| alan_read_file       | Read the 1955 file           | "J. Sanches, bookseller. He found a body. \[pause\] He never even told me when he found his glasses." |
| alan_enter_lavadouro | Enter the lavadouro          | "Finally, somewhere in Lisbon wetter than the fog."                                                   |
| alan_wring ★         | Use Alan on the sheet        | "Last thing I twisted was the truth, and it came out cleaner than this."                              |
| alan_breathes ★      | River topic                  | "The river breathes four times a day? I barely manage twice before lunch."                            |
| alan_dingdong ★      | "What does a bell remember?" | "Its first ding-dong, presumably." **celeste_cheeky**: "Cheeky. Bronze, menino."                      |
| alan_enter_ferreira  | Enter the workshop           | "Every clock stopped at the same minute. The only man in Lisbon who died on time."                    |
| alan_lamp_lit        | Matches on oil lamp          | "Let there be light. Or a modest glow, like my career."                                               |
| alan_clock_wound ★   | Key on tide clock            | "It's turning. First thing in this city that's turned on for me in years."                            |
| alan_tide_card       | Take tide card               | "A tide table from a clockmaker. The only man in Lisbon who knew exactly when to come in."            |

### Chapter II card

**narr_ch2_end**: "He knew when they died. He knew his grandfather had been there before. What he did not know was what Joaquim had carried up out of the dark, or why he had never put it down."

## Chapter III: The Weeping Stone

15:30–17:15. Alan decodes the ledger, learns the rite and the founders' order, meets the killer, and steals the tongue. Rooms: convent, se_tower, antiques, tavern (optional), shop. After decoding, the Sé and the antiques shop can be played in either order.

**narr_ch3_card**: "The Carmo had lost its roof in 1755 and never asked for it back. Some buildings, like some men, prefer to see the sky they are afraid of."

### III.1 The Carmo by day

Tomás is sweeping the nave. Dialogue topics:

- **The Carmo:** "God took the roof and left the prayers."

- **The founders:** they cast Lisbon's bells for three hundred years. "Fools twice over, your family. They made the bell, and then they rang it." This is the first time the player hears that a Sanches rang it in 1755.

- **The weeping stone:** "Under the salt. It weeps every fog."

- **The ninth day:** **alan_ninth**: "Today is the ninth day." **tomas_iknow**: "Yes. I know."

- **Joaquim / 1955** (if the file is shown): he goes still. "Not here. Not in daylight. Ask me at midnight." This plants the Ch. V confession.

**Puzzle III-A: the weeping stone.** Goal: read it.

1.  Look at the stone: a thick crust of salt. Scraping fails ("Like scraping a glacier with a library card.").

2.  Use the glass on the holy-water stoup. Tomás, if watching: "Blessed water on a cursed stone. Once."

3.  Use the glass of water on the stone. The salt runs off, revealing a ring of carved letters around a bell. The outer ring turns, worn smooth by hands.

4.  Use the magnifier on the stone to read the ring.

5.  Use the ledger on the stone. The cipher wheel UI opens. Turning it 7 times decodes; any other count produces nonsense and an Alan line.

Logic: Celeste taught that fresh water melts salt (II); the only fresh water in the nave is the stoup; the glass is the only container the player owns. If the lavadouro was skipped, Inês's hint covers it: "Salt comes off with water. Even you know that." The key 7 is in the song.

**The decoded pages** (cutscene: Alan reads, the narrator finishes his sentences):

1.  Header: THE BROTHERHOOD RANG THE DROWNED BELL.

2.  **The rite:** "Should the tongue be found, let the last of the bell-hand ring it backward, as the founders rang the city, last to first, at a turning of the tide, with his own blood on the bronze."

3.  **Joaquim's page, 1955:** "Afonso Lacerda drowned in his own water. I had the tongue in my hand and the bell before me, and I ran. His boy watched. The Lacerdas are patient. God forgive me, so am I."

The back pages of the ledger are stuck together with salt; Alan doesn't notice yet. Antiques unlocks: **alan_surname**: "His boy. Vicente Lacerda would be about fifty now. Lisbon is full of Lacerdas. Only one of them sells antiques."

Tomás, after decoding: "Last to first. The founders cast their bells in an order. Abílio at the Sé knows it better than God does." The Sé tower unlocks.

### III.2 The Sé bell tower (either order)

A long climb; dusty light through the louvres; four great bells. Abílio has rung them for sixty years and is almost deaf.

**Puzzle III-B: talking to Abílio.** Spoken dialogue gets the answer to the question he thinks he heard ("Joaquim? No, the joints are fine, thank you."). Use the notebook on Abílio: Alan writes questions, Abílio shouts answers. New topics:

- **Joaquim:** "The Sanches boy rang the tenor with me in twenty-six. We were boys. He had hands for it. Then he went to sell books, the idiot."

- **1955:** "That November we didn't ring. Joaquim asked me not to. Only time in my life I obeyed anybody."

- **Ringing backward:** "A bell rung backward sounds like a breath drawn in. You'll know it when you hear it. Pray you don't."

**Puzzle III-C: the founder bells.** Abílio: "Read them yourself; my eyes are worse than my ears." Use the magnifier on each of the four bells to read its foundry mark and year: Ferreira 1611, Bastos 1648, Coutinho 1702, Sanches 1739. Alan writes them in the notebook automatically. Once all four are read, he says the order: **alan_order**: "Last to first. Sanches, Coutinho, Bastos, Ferreira. Me first. Of course me first."

Flag: founder_order.

### III.3 Antiguidades Lacerda (either order)

Clocks everywhere, all keeping different times. Lacerda in a cream linen suit, all charm. Dialogue topics:

- **The clocks:** "I collect time. Other people's."

- **The glass case:** a bronze bell's tongue on velvet. "Eighteenth century. Not for sale. Some things are only for keeping." He adds: "I would notice a single hair moved on that velvet, Senhor Sanchez."

- **Joaquim:** "I knew of him. A careful man. Careful men usually live a long time."

- **The fog:** "I find it restful. Patient weather."

**Looks that matter:**

- **The four clocks on the shelf,** each with a brass tag: "F. 03:12", "B. 15:38", "C. 04:01", and "J.C. 18:25". The first three have stopped; the fourth is running. Alan looks at them automatically when Lacerda says "other people's", so the clue can't be missed. **alan_jc**: "Three of these have stopped. The fourth is waiting. J.C. Not Joaquim; he was a Sanches." Flag: saw_jc_clock.

- **The music box** (needs the photo flag from I.6): "I've seen this. On a shelf behind my grandfather, in 1934." Lacerda, too quickly: "A trinket."

**Puzzle III-D: the theft.** Goal: take the tongue without being seen.

1.  Ask about the music box. Lacerda: "Its key is in the back. Touch nothing." He exits. The player has three actions before he returns.

2.  Use the vitrine key on the glass case.

3.  Use the brass weight on the tongue. Alan swaps them; the dent in the velvet stays.

4.  Lacerda returns, winds the box, and it plays the melody of "O Sino Afogado". He watches Alan's face. **lacerda_pale**: "You look pale, Senhor Sanchez. Another day."

Logic: Lacerda himself said he'd notice the velvet; the weight is the only object of the right heft. Taking the tongue without the swap, or running out of actions, triggers **lacerda_putback** ("Put it back. Patience is not infinite.") and resets the theft.

### III.4 The Taberna (optional)

If Alan describes the music box to Amália: "That box was mine. I gave it to Joaquim the day he married. It played our song." **alan_proof**: "Then the man who has it was in Grandfather's flat after he died. Or before." Flag: amalia_box (used in Ch. V and the epilogue).

### III.5 The shop

Alan puts the tongue on the counter. Inês: "You stole a church bell's tongue from a murderer. Before tea." He shows her the ledger; she notices the back pages are stuck with salt and puts the kettle on to steam them apart. **ines_steam**: "Archivist's trick. Go and wash your face; you look like a man who's seen a clock."

### III.6 Alan's lines for this chapter

| Line id             | Trigger                                   | Line                                                                                  |
|---------------------|-------------------------------------------|---------------------------------------------------------------------------------------|
| alan_enter_carmo    | Enter the convent                         | "No roof. Father Tomás must love an open plan."                                       |
| alan_twice ★        | "Fools twice over"                        | "Twice? We were always overachievers."                                                |
| alan_holy_glass ★   | Glass on stoup                            | "Holy water in a ginjinha glass. Sunday morning and Saturday night in one."           |
| alan_wheel_wrong    | Wheel at any count but 7                  | "That isn't Portuguese. That isn't even Polish."                                      |
| alan_page3          | Joaquim's 1955 page                       | "He ran. He always said I got my legs from him. \[pause\]" (no joke after)            |
| alan_climb ★        | Enter the Sé tower                        | "If God wanted me in a bell tower, He'd have put in a lift."                          |
| abilio_borders      | First spoken question                     | Alan: "I'm looking for the founders' order!" Abílio: "BORDERS? SPAIN'S THAT WAY."     |
| alan_write_abilio ★ | Notebook on Abílio                        | "Finally, a man who reads what I mean instead of hearing what I say."                 |
| alan_bell_ferreira  | Magnifier, first bell                     | "Ferreira, 1611. Older than my overdraft. Only just."                                 |
| alan_bell_sanches ★ | Magnifier, Sanches bell                   | "Sanches, 1739. The family's last hit."                                               |
| alan_collect ★      | Lacerda: "I collect time."                | "So do I. Mostly as library fines." Lacerda: "Charming."                              |
| alan_look_case ★    | Look at the glass case                    | "A tongue behind glass, untouchable. I've been on dates like that."                   |
| alan_swap           | Weight on tongue                          | "Two kilos of brass for one bronze tongue. Fair trade. Ish."                          |
| alan_slip ★         | Leaving the shop with it                  | "I've just slipped an antiques dealer the tongue, and he didn't feel a thing."        |
| alan_vandal         | Inês: "You stole a church bell's tongue…" | "Cistern bell. Don't make me sound like a vandal. I'm a thief; there's a difference." |

### Chapter III card

**narr_ch3_end**: "At a quarter past five, in a shop in the Chiado, a man looked at a brass weight sitting on velvet and smiled. He could wait. He had always been able to wait."

## Chapter IV: The Founders' Blood

17:15–18:25. Alan discovers there is one more founder, that Lacerda already knows, and that he has an hour. Rooms: shop, cais, boat. The harbour clock advances at each major step (17:40, 18:05, 18:20, 18:25); it is a dramatic clock, not a real-time fail.

**narr_ch4_card**: "Every family keeps a page it doesn't read. The Sanches family had kept theirs for two hundred years, stuck shut with salt."

### IV.1 The shop

Inês has steamed the back pages apart. They are the founders' genealogy: four lines traced from 1755, most ending in the nineteenth century, a few kept alive in Joaquim's hand. The Coutinho entry is the last thing he wrote:

> Maria Coutinho, fishwife, Madragoa. Her son José, no father registered, fisherman, the *Maria Fé*, Cais do Sodré. I have told Maria. I have not told the boy. J.S., 1994.

With saw_jc_clock set: **alan_jc_click**: "J.C. José Coutinho. Lacerda has a clock for him, and it says twenty-five past six." **ines_time**: "It's ten past five, Alan." If Alan saw Celeste in II.2, he adds: "Maria's boy. Celeste washes his sweaters."

Inês stays to telephone Rui (no answer) and keep reading. **ines_kettle**: "Go. I'll keep the kettle on." The cais unlocks.

### IV.2 Cais do Sodré

Fog on the water; fishing boats moored three deep; gulls; the harbour clock reads 17:40. Celeste is on the quay with a basket of the fishermen's sweaters. She is Zé's madrinha.

- **Zé:** "He fishes nights and sleeps days. He bolts the hatch. Nobody wakes Zé before dark. Not even me, not since his mother."

- **The boat:** the *Maria Fé*, outboard of two others. Alan crosses the first two boats by their decks (no puzzle; a short walk with a comic wobble).

- **How to wake him** (topic unlocks after the knock fails): "Storms don't wake him. Shouting doesn't. Only the boat moving wrong; he feels it in his teeth."

### IV.3 The *Maria Fé*: waking Zé

The clock reads 18:05.

**Puzzle IV-A: wake Zé.**

1.  Knock on the hatch: snoring. Shout: snoring. Look through the porthole: fog on the glass, a shape in a bunk, something blue on the blanket.

2.  Ask Celeste how to wake him (from the deck; she shouts up).

3.  Use the mooring line. It's a bowline swollen tight with wet; Alan fails the first time ("I know two knots and they're both 'tangled'."). Celeste: "Pull the tail back through the loop, menino. You want it undone, not your opinion of it."

4.  Use the mooring line again. The stern swings and knocks the next hull. The hatch slams open.

Logic: Celeste gives the rule (the boat moving wrong); the only way the player can move the boat is the line; the knot fails once to make the hint feel earned.

### IV.4 Convincing Zé

Zé is furious, unshaven, in mourning. "You've got ten seconds and then you're in the river."

**Puzzle IV-B: make him listen.** Talking alone fails: "You're in danger." "From you?" The player must show evidence:

1.  Show the tide card. Zé finds his mother's time, 04:01, sitting on a turning. **ze_turning**: "She always said don't sleep at the turn. I thought it was a fishwife thing."

2.  That unlocks the topic **the tile**: "There was a blue thing in my bunk when I came in this morning. I thought it was from her things."

Showing the 1955 file or the list also works as a second argument but is not required.

### IV.5 The cabin: breaking the tile

The clock reads 18:20. The cabin is narrow; a photo of Maria is nailed above the bunk. The blanket around the tile is soaked, and the puddle is spreading uphill.

**Puzzle IV-C: break the tile.**

1.  Take the tile. It is heavy and colder than it should be.

2.  Use Zé's hammer (on the bench) on it: it bounces. **alan_hammer**: "Like hitting the sea."

3.  Use the tongue on the tile. It shatters. One low note rolls out over the river, and the fog shivers.

Logic: Celeste's line in II.2 ("nothing breaks it but what the bell remembers: bronze"); the tongue is the only bronze the player owns; the hammer failing confirms that ordinary tools won't work.

The harbour clock strikes 18:25. The puddle runs back down through the boards. **narr_turn**: "At twenty-five past six the river turned, and for the first time in nine days, nobody drowned."

### IV.6 Zé

A quiet scene. Zé learns his mother knew; Alan tells him about the founders in two sentences and a joke. Zé gives two things:

- **His knife:** "If somebody's going to ring a bell for my mother, take this. You look like a man who'll have to cut something tonight."

- **A sardine,** after Alan mentions Pessoa: "For the cat. Not for you."

**ze_river**: "If you need the river, I'm on it." (Pays off post-credits.)

Alan uses the quay telephone to call the shop. It rings out. **alan_ringout**: "She always answers. She answers when it's for me and I'm standing next to it."

### IV.7 Alan's lines for this chapter

| Line id           | Trigger               | Line                                                                                          |
|-------------------|-----------------------|-----------------------------------------------------------------------------------------------|
| alan_genealogy ★  | Inês shows the pages  | "My whole family on one page. Shorter than I hoped, longer than they deserved."               |
| alan_enter_cais   | Enter the quay        | "Cais do Sodré. Where Lisbon comes to make bad decisions after midnight. It's barely six."    |
| alan_sea_legs ★   | Crossing the boats    | "I have the sea legs of a library chair."                                                     |
| alan_knock        | Knock on the hatch    | "Zé! It's your life calling!" (snore) "He's screening."                                       |
| alan_untied ★     | Mooring line, success | "Look at that. I untied something without a lawyer."                                          |
| alan_tide_sense   | Zé: "Who are you?"    | "A bookseller with a terrible sense of timing and an excellent sense of tide."                |
| alan_take_tile    | Take the tile         | "Cold, wet and heavier than it should be. Like my last relationship."                         |
| alan_ask_tongue ★ | Before tongue on tile | "Celeste said bronze. So, Zé. How do you feel about tongues?" Zé: "Just do it."               |
| alan_turned       | After 18:25           | "Twenty-five past six. \[pause\] Your mother would have wanted you awake for this." (no joke) |
| alan_sardine      | Take the sardine      | "Pessoa will finally respect me."                                                             |

### Chapter IV card

**narr_ch4_end**: "The note from the tongue crossed the river and climbed the Chiado and found the man it was meant for. He put down his coffee. He went to fetch his coat. In a bookshop in the Alfama, a kettle boiled dry."

## Chapter V: The Drowned Bell

19:00 to dawn. Inês is taken; Alan goes down into the cistern and does what his grandfather couldn't. Rooms: shop, tavern (optional), convent_night, cistern.

**narr_ch5_card**: "Night came early, as it does in fog, and found the Alfama door standing open, which it had never done in a hundred years."

### V.1 The shop

The door is open. The room is cold, and a line of salt runs across the floor like a tide mark. The kettle has boiled dry. Inês is gone. Pessoa is on top of the answering machine, which is blinking.

**Puzzle V-A: the cat, again.**

1.  Pessoa won't move. The lamp trick fails: the machine is warm by itself. **alan_lamp_again**: "He's learned. One of us has."

2.  Use the sardine on Pessoa. He jumps down, and he was lying on the ledger. Inês hid it under the cat before Lacerda came in. **alan_pessoa**: "Nine kilos of loyalty. Who knew."

3.  Play the machine.

Logic: the player has the sardine from Zé and has already seen that the cat must be bribed off things; the lamp failing first is a joke that also points to the new answer.

**Message 3, Lacerda:** "Senhor Sanchez. Your assistant is reading to me; she has a lovely voice for dates. Bring the tongue. Bring your blood. Come alone. The river turns at twenty-five to one." The machine then replays message 2, the dripping hang-up. **alan_hangup_reveal**: "He rang this morning to see if I was home. He's been patient all day."

**The telephone (optional, recommended):** call Rui. **rui_gate**: "Midnight at the Carmo. I'll be outside the gate. If I go in, it's a police matter, and then it's in a drawer forever." With amalia_box: **rui_murder**: "Then it's murder. Unexplained, but murder." Flag: rui_called.

### V.2 The Taberna (optional)

Amália is alone, singing to an empty room. She doesn't stop when he comes in. Afterwards: **amalia_alone**: "Joaquim ran because he was alone down there. You are not alone, menino. You have a woman tied to a pillar, which is more than he ever had." Flag: amalia_night.

### V.3 The Carmo at midnight

Moonlight in the roofless nave. The grate stands open, and green light comes up from below. Tomás is waiting with a lantern.

**Tomás's confession** (the payoff for "Yes. I know."):

- **tomas_boy**: "I was eleven. I held his lantern. The water came up to my knees, and he had the tongue in one hand and the bell in front of him."

- **tomas_ran**: "He didn't run from the bell, Alan. He picked me up and ran. He was ashamed of it for forty years, and he was wrong to be."

- **tomas_count**: "I have counted every fog since. I knew which day this was before you did."

He gives Alan the lantern: **tomas_lantern**: "Hold it higher than he did." With rui_called, Rui is at the gate, smoking: **rui_nothing**: "I didn't see you go in."

### V.4 The cistern

Stone steps end on a ledge above black-green water. The Drowned Bell hangs on a rusted chain over the water, reachable along a narrow stone walkway; it is carved with four waves. Inês is tied to a pillar on the ledge. Lacerda, in an old brotherhood robe, stands where the steps go down into the water. A painted waterline on the pillars is the on-screen meter: six marks.

**The confrontation** (cutscene, then player control):

- **lacerda_joaquim**: "A single drop of seawater, on the heart. He said your name. I thought that was touching."

- **lacerda_spared**: "You were the only founder who never asked a question. I am grateful."

- **lacerda_ze**: "You broke my tile. Clumsy. No matter. The bell needs only one hand, and you brought it."

- **lacerda_demand**: "Cut your hand, wet the bronze, and ring. She walks out of here. Patient, Senhor Sanchez. I have been patient for forty years."

- **ines_warn**: "Alan, the water comes up every time he speaks to it. Don't do what he says."

**The rule in this room:** while Lacerda is watching, he commands the water. Striking the bell or freeing Inês while he watches makes him act:

- Striking the bell while watched: the water takes Alan. Game over; the scene restarts at the top of the steps with inventory intact.

- Cutting Inês's ropes while watched: **lacerda_patient** ("Patient.") and the waterline rises one mark.

**Puzzle V-B: the rite.** Five steps, each drawing on a different chapter.

1.  **Distract him (ledger, Ch. I).** Give the ledger to Lacerda: **alan_offer**: "Every line you missed. Two hundred years. In my grandfather's hand." He can't read it. **alan_seven**: "Turn the letters seven times." Lacerda kneels on the drowned step with his torch, reading, his back to the bell. He is a collector before he is a killer.

2.  **Free Inês (knife, Ch. IV).** Use the knife on the ropes. **ines_free**: "You took your time." **alan_cat**: "I had a cat to bribe."

3.  **Light the bell (lantern, Ch. V).** Give the lantern to Inês. She holds it up; the four foundry marks appear in the carved waves. Without the light, looking at the bell gives "Too dark, and I need both hands."

4.  **Blood on the bronze (rite, Ch. III).** Use the knife on Alan. **ines_no**: "Alan—" **alan_papercut**: "Paper cut. I've had worse from Camões." The tongue is now wet; the cursor changes.

5.  **Ring it backward (order, Ch. III).** Use the tongue on the four marks: Sanches, Coutinho, Bastos, Ferreira.

**The water meter during step 5.** The first correct strike makes a sound like a breath drawn in, and Lacerda turns. **lacerda_no** is the only time he raises his voice. From then on:

| Event                                                                    | Waterline                                                     |
|--------------------------------------------------------------------------|---------------------------------------------------------------|
| Each correct strike (Lacerda fights the water up)                        | +1                                                            |
| A wrong strike (the bell rings forward; the city's bells answer faintly) | +2                                                            |
| Six marks reached                                                        | The water takes Alan; restart from step 5 with steps 1–4 kept |

Four correct strikes cost four marks, so the player can make exactly one mistake. Lacerda's lines escalate on each strike; Inês calls out the next mark if the player hesitates for 20 seconds (hint, not an answer: "Last to first, Alan. Who came last?").

**The silence.** On the fourth strike the bell un-rings: the sound is pulled backward out of the air, the fog is drawn down the steps, and the water stops obeying. It rises around Lacerda alone, to his knees, his chest, his mouth. **lacerda_mine**: "The water is mine. It answers to me." **alan_answers**: "It answered. It's been waiting longer than you." He goes under with the ledger in his hands. **alan_ledger**: "Some books should go with their readers."

The water goes still and clear. The bell hangs silent, tongueless again; the tongue is left lying on the ledge.

### V.5 Up into the tenth morning

Alan and Inês climb the steps into a sky without fog. Tomás is on his knees in the nave and doesn't get up. If rui_called, Rui is at the gate with two coffees: **rui_coffee_back**: "I owed you one. Actually you owed me one. I've stopped keeping track."

### V.6 Alan's lines for this chapter

Chapter V is darker, so the jokes get shorter and braver: he jokes because he is frightened, and the player should feel that.

| Line id           | Trigger                   | Line                                                                                                          |
|-------------------|---------------------------|---------------------------------------------------------------------------------------------------------------|
| alan_ines_gone    | Entering the empty shop   | "Inês? \[pause\]" (no joke)                                                                                   |
| alan_queue ★      | After "Bring your blood"  | "He wants my blood. He'll have to queue behind my landlord."                                                  |
| alan_alone        | After "Come alone"        | "Come alone. Finally, something I'm qualified for."                                                           |
| alan_obituary     | Calling Rui               | "If I'm not out by dawn, Rui, the obituary says 'witty'. Not 'lazy'. 'Witty'."                                |
| alan_thanks       | After Tomás's confession  | "\[pause\] Thank you, Father." (no joke)                                                                      |
| alan_descend ★    | Going down the steps      | "'Stay away from water,' he said. Midnight, a flooded church basement, a dead man's bell. Rui will be livid." |
| alan_glacier ★    | Lacerda's first "Patient" | "Vicente, I've met glaciers with more urgency."                                                               |
| alan_ringback     | First correct strike      | "I never rang anyone back in my life, Grandfather. Let's start with you."                                     |
| alan_wrong_strike | Wrong strike              | "Wrong number." (callback to alan_hangup)                                                                     |
| alan_dawn ★       | Climbing out              | "The tenth morning. First one I've seen before eleven in years."                                              |

The epilogue phone call has no joke at all.

## Endings

There is one ending. Optional scenes add short epilogue vignettes; none of them changes what happened.

### Epilogue (always)

A sequence of stills with narration, the morning of the tenth day:

1.  **The city.** Fog gone; trams running; nobody drowned. **narr_epilogue**: "Nobody drowned. Nobody noticed. Which, Alan decided, was exactly how it should be."

2.  **The Judiciária.** Rui files case 95/203 as "unexplained" on top of 55/114, and pushes the drawer. For the first time in forty years, it closes. **rui_click**: "Huh."

3.  **The shop.** The bronze tongue sits on the bookbinding press, holding down the Camões nobody bought, where the brass weight used to be. Inês is at her desk writing page forty-one.

4.  **The telephone.** Alan opens his notebook to the number he was afraid to call. **narr_call**: "His mother answered on the second ring. He said, 'Mãe, it's me,' and then, for once, he didn't make a joke."

### Optional vignettes

Played between stills 3 and 4 if their flags are set:

| Flag                               | Vignette                                                                                                                           |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| amalia_box                         | Rui returns the music box to Amália "from the estate of an unknown person". She winds it and doesn't sing along.                   |
| amalia_night                       | That evening the Taberna is full. Amália sings "O Sino Afogado" for the second time in her life, and Alan buys the ginjinhas.      |
| ze_saved (always set)              | Celeste on the quay, handing Zé a clean sweater.                                                                                   |
| founder_order with no wrong strike | Abílio rings the Sé bells for the first time in years, "for no reason", and the whole Alfama hears a city that is very much awake. |

### Post-credits

Dawn on the Tagus. Zé hauls in his net and finds a cream linen jacket tangled in it, heavy with water and empty. He looks at it for a long time and throws it back. **ze_back**: "Not mine to keep."

Cut to Antiguidades Lacerda, shuttered. On the shelf, the clock tagged "J.C. 18:25" has stopped at 18:25. Beside it, a fifth clock nobody has seen before starts to tick. Its tag is face-down.

This hook seeds the sequel (the Brotherhood was never only the Lacerdas) without contradicting the ending: the bell beneath Lisbon is silenced forever.

## Items

Eighteen items. Every item has at least one required use; seven have two or more. Items are removed from inventory after their last use.

| Item             | Found (ch., room)                   | Used on (ch., room)                                                                                    | Removed after    |
|------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------|------------------|
| Notebook         | Start                               | Evidence bag, sketch (I, police); Abílio (III, se_tower); holds the founder order and the phone number | Never            |
| Coins ×3         | Register (I, shop)                  | Bar, 2 ginjinhas (I, tavern); coffee machine (II, police)                                              | Last coin spent  |
| Desk key         | Sugar tin (I, shop)                 | Grandfather's desk (I, shop); tide clock (II, ferreira)                                                | Tide clock       |
| Ledger           | Desk (I, shop)                      | Weeping stone (III, convent); Inês (III, shop, auto); Lacerda (V, cistern)                             | Given to Lacerda |
| Magnifier        | Window shelf (I, shop)              | Sea-monster tile (I, opt.); drawer seam (II, police); weeping stone (III); four bells (III, se_tower)  | Never            |
| Brass weight     | Bookbinding press (I, shop)         | Glass case swap (III, antiques)                                                                        | Swap             |
| Ginjinha ×2      | Bar (I, tavern)                     | Amália, one each (I, tavern)                                                                           | The toast        |
| Matches          | Beside the candle (I, tavern)       | Oil lamp (II, ferreira)                                                                                | Oil lamp         |
| Glass            | After the song (I, tavern)          | Holy-water stoup, then weeping stone (III, convent)                                                    | Weeping stone    |
| Coffee           | Machine (II, police)                | Drawer seam (II, police)                                                                               | Drawer           |
| 1955 file        | Drawer (II, police)                 | Celeste (II, lavadouro); Tomás (III, opt.); Zé (IV, opt.)                                              | Never            |
| Ferreira key     | Rui (II, police)                    | Workshop door (II, ferreira)                                                                           | Door             |
| Tide card        | Under the tide clock (II, ferreira) | Zé (IV, boat)                                                                                          | Never            |
| Vitrine key      | Key board (II, ferreira)            | Glass case (III, antiques)                                                                             | Glass case       |
| Tongue (clapper) | Glass case (III, antiques)          | Zé's tile (IV, boat); four marks on the bell (V, cistern)                                              | End of game      |
| Knife            | Zé (IV, boat)                       | Inês's ropes; Alan's hand (V, cistern)                                                                 | End of game      |
| Sardine          | Zé (IV, boat)                       | Pessoa (V, shop)                                                                                       | Pessoa           |
| Lantern          | Tomás (V, convent_night)            | Inês (V, cistern)                                                                                      | Given to Inês    |

**Red herrings by design:** Zé's hammer (fails on the tile, to confirm that only bronze works) and the banker's lamp in Ch. V (fails on Pessoa, to point to the sardine). Both give a specific line, never a generic "I can't do that".

## Flags and gates

Story state stays as plain flags on F(). The table lists every flag in the order it is normally set, what sets it and what it opens. Chapter transitions are gates: a chapter ends only when all of its required flags are set.

| Flag               | Set by                                                 | Gates or changes                                        |
|--------------------|--------------------------------------------------------|---------------------------------------------------------|
| heard_machine      | Playing the machine (I.2)                              | Shop door; police on map                                |
| got_ledger         | Opening the desk (I.2)                                 | Weeping stone use (III)                                 |
| sketched_tile      | Notebook on evidence bag (I.4)                         | Inês's seal scene (I.5)                                 |
| saw_list           | List topic with Rui (I.4)                              | Inês's seal scene (I.5)                                 |
| knows_brotherhood  | Inês scene (I.5)                                       | Tavern on map                                           |
| saw_photo          | Looking at the tavern photograph (I.6)                 | Music box recognition (III.3); Amália box scene (III.4) |
| heard_song         | Toast with Amália (I.6)                                | **End of Ch. I**; 1955 topic with Rui                   |
| drawer_open        | Coffee on the seam (II.1)                              | Lavadouro and ferreira on map; times of death           |
| met_celeste        | Lavadouro conversation (II.2)                          | lore_turnings, lore_bronze, knows_1955_boy              |
| tide_known         | Tide clock running (II.3)                              | alan_turnings line; tide card pickup                    |
| ch2_done           | met_celeste + tide_known                               | **End of Ch. II**; convent on map                       |
| decoded            | Cipher wheel at 7 (III.1)                              | Antiques and se_tower on map; the rite; Lacerda's name  |
| founder_order      | All four bells read (III.2)                            | Finale step 5                                           |
| saw_jc_clock       | Clocks topic with Lacerda (III.3, plays automatically) | alan_jc_click (IV.1)                                    |
| amalia_box         | Music box topic with Amália (III.4, optional)          | rui_murder (V.1); epilogue vignette                     |
| has_tongue         | Successful swap (III.3)                                | **End of Ch. III** (with founder_order)                 |
| genealogy_read     | Inês's steamed pages (IV.1)                            | Cais on map                                             |
| ze_awake           | Mooring line, second try (IV.3)                        | Zé conversation                                         |
| ze_believes        | Tide card shown to Zé (IV.4)                           | Tile topic; cabin access                                |
| ze_saved           | Tongue on tile (IV.5)                                  | Knife and sardine; **End of Ch. IV**                    |
| ledger_found       | Sardine on Pessoa (V.1)                                | Message 3; convent_night on map                         |
| rui_called         | Phone call to Rui (V.1, optional)                      | Rui at the gate (V.3, V.5)                              |
| amalia_night       | Night visit (V.2, optional)                            | Epilogue vignette                                       |
| lacerda_distracted | Ledger given (V.4 step 1)                              | Safe to free Inês and strike the bell                   |
| ines_free          | Knife on ropes (step 2)                                | Lantern can be given                                    |
| bell_lit           | Lantern to Inês (step 3)                               | Marks visible                                           |
| blood_on_tongue    | Knife on Alan (step 4)                                 | Strikes count                                           |
| strikes, waterline | Bell strikes (step 5)                                  | Success at 4 correct; restart at waterline 6            |
| no_wrong_strike    | Finishing with zero wrong strikes                      | Abílio vignette                                         |

## Ambient NPCs

Background characters make Lisbon feel inhabited. They are animated but not interactive beyond a look line: clicking one plays Alan's look line; talk or use plays the shared line **alan_npc_busy** ("They're busy. Somebody in this city has to be."). Sixteen NPCs and four animated props. The tavern is deliberately busy in Ch. I and III and empty in Ch. V (Amália alone).

### Implementation notes for Claude Code

- **Data:** add an ambient array per room in js/story.js: {id, sprite, x, y, scale, loop, fps, look, chapters, path?, cutscene?}. Coordinates below are in the 1280×720 background space; scale follows the room's depth scale at that y unless given.

- **Sprites:** same Canva style prompt as the main cast, white background, matted with scripts/matte.py. Each NPC needs only the frames listed (most need one 4–6 frame idle loop). No walk set unless a path is given.

- **Animation:** loops at 6–8 fps with a random start frame so neighbours don't sync. "Occasional" actions fire on a random 8–20 s timer.

- **Collision:** NPCs stand outside the walk polygon or are cut out of it as obstacles. Pathing NPCs walk only in the background band and never cross Alan's path.

- **Depth:** sort by y with Alan; NPCs behind furniture use the room's existing occlusion masks.

- **Cutscenes:** each NPC has a cutscene behaviour (freeze, turn to the speaker, or hide). Default is freeze on the current frame.

- **Chapter state:** the chapters field lists where they appear. Night variants of rooms have no NPCs unless stated, which makes Ch. V feel empty on purpose.

### Cast by room

| Room               | NPC id                             | Who and where                                                        | Loop and occasional action                                          | Frames                      | Chapters         | Look line (Alan)                                                                   |
|--------------------|------------------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------|-----------------------------|------------------|------------------------------------------------------------------------------------|
| street             | npc_laundry_woman                  | Woman on a first-floor balcony, upper left (x 180, y 210)            | Pegs laundry; occasionally shakes out a sheet and frowns at the fog | idle 6, shake 6             | I–IV             | "Drying laundry in nine days of fog. That's not optimism, that's faith."           |
| street             | npc_bench_man                      | Old man on the bench by the tram stop (x 980, y 560)                 | Dozes; nods forward, jerks awake, dozes again                       | idle 4, jerk 4              | I–IV             | "My future, ladies and gentlemen. Rehearsing."                                     |
| street             | prop_tram_28                       | Yellow tram crossing the background, right to left                   | Passes every 45–70 s with bell SFX; headlight only in Ch. V         | 2-frame wheel cycle, slides | I–V              | "Tram 28. Never on time, always on rails. We have that half in common."            |
| police             | npc_officer_typing                 | Officer at a back desk (x 300, y 380)                                | Types; occasionally sips, grimaces at the coffee                    | idle 6, sip 4               | I–II             | "He's on page four hundred of a report nobody will read. My kind of author."       |
| police             | npc_officer_phone                  | Officer by the window with a coiled-cord phone (x 1040, y 420)       | Paces two steps each way, mouthing; occasionally rolls his eyes     | idle 6, path 2 steps        | I–II             | "Either his mother or his lawyer. Same face for both."                             |
| tavern             | npc_lino_barman                    | Senhor Lino behind the bar (x 820, y 430)                            | Polishes glasses; animates pouring when coins are used on the bar   | idle 6, pour 6              | I, III, epilogue | "Lino. Pours like a priest, charges like a bishop."                                |
| tavern             | npc_cards_a, npc_cards_b           | Two old men playing sueca at the front table (x 300, y 560)          | Studies cards; occasionally slaps a card down and both shout        | idle 4 each, slap 4         | I, III, epilogue | "Sueca. They've been playing the same game since Salazar. One of them is winning." |
| tavern             | npc_guitarrista                    | Young guitarist on a stool by the wall guitarra (x 1100, y 470)      | Tunes; during the song cutscene he plays (play loop 8)              | idle 4, play 8              | I, III, epilogue | "He tunes for an hour and plays for three minutes. I respect the ratio."           |
| tavern             | npc_couple                         | Couple whispering at a corner table (x 560, y 400)                   | Lean in, lean apart; occasionally the woman laughs                  | idle 6, laugh 4             | I, epilogue      | "Either in love or planning a murder. In this city, why not both."                 |
| lavadouro          | npc_washer_1, npc_washer_2         | Two washerwomen at the far basins (x 260, y 440 and x 460, y 450)    | Scrub; occasionally slap a sheet on the stone (splash SFX)          | idle 6, slap 6              | II               | "They know everything in the Alfama by Thursday. They knew about me by Tuesday."   |
| convent            | npc_nun                            | A nun lighting candles in a side chapel (x 1000, y 400)              | Lights a candle, kneels, rises                                      | idle 6, kneel 4             | III              | "Praying under no roof. Direct line, no switchboard."                              |
| convent / se_tower | prop_pigeons                       | 3–5 pigeons on ledges and louvres                                    | Peck, shuffle; take off if Alan walks under them                    | idle 4, fly 6               | III              | "Lisbon's real congregation."                                                      |
| antiques           | prop_pendulums                     | Pendulums of the grandfather clock and two wall clocks               | Swing at slightly different speeds; tick SFX out of sync            | 8-frame swing               | III              | (no look; covered by the clocks topic)                                             |
| cais               | npc_net_mender_1, npc_net_mender_2 | Two fishermen mending nets on crates (x 220, y 540 and x 360, y 560) | Needle in, pull, knot; occasionally one lights a cigarette          | idle 6, light 6             | IV               | "Knots. These men are why I'll never be a sailor."                                 |
| cais               | npc_dockworker                     | Dockworker carrying a crate along the back of the quay               | Walks a background path left to right and back, every 30–40 s       | walk 8                      | IV               | "He's carried more today than I have in my life. Including grudges."               |
| cais               | npc_fish_seller                    | Fishwife at a crate of sardines (x 1060, y 520)                      | Calls out (muffled VO bark, no subtitle); weighs fish               | idle 6, call 4              | IV               | "Sardines. If Pessoa saw this, he'd finally get up."                               |
| cais               | prop_gulls                         | Gulls circling and landing on bollards                               | Circle path; occasionally land and squawk                           | fly 6, land 4               | IV               | "Flying rats with a sea view."                                                     |

### Crowds in stills

The epilogue tavern ("full house") and the city still use painted crowds in the background layer, plus the animated tavern NPCs above in front of them. No extra sprites are needed for crowds.

## Production spec

Everything Claude Code needs to build v2, by discipline. Anything existing must be checked against the current build; anything marked "verify" may already exist.

### Backgrounds (1280×720)

| Room          | Status                 | Must show (hotspots in bold)                                                                                                                                                        | Exits         | Variants                                                                                        |
|---------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-------------------------------------------------------------------------------------------------|
| shop          | Existing; verify props | **register, sugar tin, Grandfather's desk, banker's lamp, bookbinding press with weight, window shelf with magnifier, answering machine, telephone, radiator**, counter, big window | street        | Ch. V night: door open, salt tide line on floor, kettle on its side, lamp only, cold blue grade |
| street        | Existing               | **sea-monster azulejo**, tram stop, bench, balcony with laundry                                                                                                                     | shop, map     | Ch. V night: gas lamps only, empty                                                              |
| police        | Existing; verify props | **evidence desk, coffee machine, filing cabinet with open drawer**, flickering tube                                                                                                 | map           | none                                                                                            |
| tavern        | Existing; verify props | **photograph on wall, candle and matchbox, bar**, guitarra on wall, card table, corner table                                                                                        | map           | Ch. V: chairs up, one lantern lit; epilogue: full house (painted crowd layer)                   |
| lavadouro     | New                    | Arched stone washhouse, steaming basins, wet sheets on lines, **Celeste's basin and sheet**, fog leaking through arches                                                             | map           | none                                                                                            |
| ferreira      | New                    | Narrow Baixa workshop: wall of clocks, **workbench, oil lamp, repair book, tide clock, key board by the door**, shuttered window, police tape on the door                           | map           | Dark state (only lamp silhouette visible) and lit state (warm radial light layer)               |
| convent       | Existing; verify props | Roofless nave, **holy-water stoup, weeping stone**, side chapel                                                                                                                     | map           | Stone: crusted state and washed state with the letter ring                                      |
| se_tower      | New                    | Bell chamber: **four bells with foundry marks** at different heights, ropes, louvred openings with light shafts, Abílio's stool, stair head                                         | map           | none                                                                                            |
| antiques      | Existing; verify props | **glass case, four tagged clocks on a shelf, music box**, grandfather clock, back-room curtain                                                                                      | map           | Case: tongue state and weight state                                                             |
| cais          | New                    | Fog-bound quay: three fishing boats moored abreast, **the Maria Fé** outermost, crates, bollards, harbour clock on a post, telephone box                                            | map, boat     | none                                                                                            |
| boat          | New                    | Deck (**hatch, porthole, mooring line, bell**) and cabin (**bunk with tile, hammer on bench, photo of Maria**) as two rooms or one room with two camera states                      | cais          | Tile wet state and gone state                                                                   |
| convent_night | Existing               | Open grate with green glow                                                                                                                                                          | map, cistern  | none                                                                                            |
| cistern       | Existing; verify props | **The bell with four carved waves**, walkway, **pillar with Inês, drowned step**, painted waterline marks 1–6 on pillars                                                            | convent_night | Bell dark and bell lit (marks visible); water level states 0–6 as overlay layers                |
| map           | Existing               | Four new pins: lavadouro, ferreira, se_tower, cais (the boat is reached from the cais)                                                                                              | —             | Locked pins greyed, unlocked lit                                                                |

### Close-ups and UI

| Screen          | Content                                                                                                                                                                                                                                                                                                       | Interaction                                                                          |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Cipher wheel    | Two concentric stone rings, A–Z; outer ring rotates in 26 steps with a click; step counter hidden                                                                                                                                                                                                             | Click to turn; at 7 the ledger text resolves letter by letter into the decoded pages |
| Ledger          | Cipher pages (gibberish in Joaquim's hand); decoded pages 1–3; genealogy page (from Ch. IV)                                                                                                                                                                                                                   | Page flip                                                                            |
| 1955 file       | Typed police report, case 55/114, stamp "INEXPLICADO", photo of a tile                                                                                                                                                                                                                                        | Read only                                                                            |
| The list        | Four names in Joaquim's handwriting on folded paper                                                                                                                                                                                                                                                           | Read only                                                                            |
| Tide card       | Ferreira's handwritten table: days 1–10 of the fog, four turnings a day. Fixed values: day 2 03:12; day 5 15:38; day 8 04:01; day 9 18:25; day 10 00:35. Fill the rest at roughly 6 h 12 min intervals, drifting about 50 min later each day; Ferreira's margin note: "The river keeps strange hours in fog." | Read only; after IV.4, the three death times are circled in Alan's pen               |
| Tide clock      | Brass face with an hour dial and a tide dial ("turning" marked)                                                                                                                                                                                                                                               | Plays once when wound                                                                |
| Photograph      | Amália and Joaquim, 1934; music box clearly visible on the shelf                                                                                                                                                                                                                                              | Read only                                                                            |
| Notebook        | Pages: tile sketch; founder order (written as bells are read); the phone number                                                                                                                                                                                                                               | Opens from inventory                                                                 |
| Harbour clock   | Small overlay top right in Ch. IV, showing 17:40 / 18:05 / 18:20 / 18:25                                                                                                                                                                                                                                      | Advances on story beats                                                              |
| Water meter     | The six painted marks on the cistern pillars light up as the water rises                                                                                                                                                                                                                                      | Driven by waterline                                                                  |
| Inventory icons | 18 icons, one per item in the Items table, plus wet-tongue state                                                                                                                                                                                                                                              | —                                                                                    |

### Character sprites

Existing characters need new states; new characters need full sets.

| Character     | New frames needed                                                                                                                                                                  | Notes                                                                                                        |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Alan          | asleep on counter, pick up low/high, use/reach, write in notebook, drink toast, wring sheet, wobble (boat), untie knot, phone, climb steps, cut palm, strike bell (overhead swing) | Verify he reads as 37: stubble, a touch of grey at the temples (an echo of Joaquim's "white at his temples") |
| Inês          | steaming pages (still), tied to pillar (idle, struggle, talk), rub wrists, hold lantern high (idle, talk)                                                                          | —                                                                                                            |
| Rui           | smoking at gate (night palette), holding two coffees (epilogue still)                                                                                                              | —                                                                                                            |
| Amália        | singing (cutscene loop), toast                                                                                                                                                     | —                                                                                                            |
| Tomás         | kneeling in prayer                                                                                                                                                                 | Lantern and sweeping exist                                                                                   |
| Lacerda       | walk to back room, wind music box, kneel reading ledger, sink (6-frame cutscene)                                                                                                   | Suit and robe exist                                                                                          |
| Pessoa        | asleep on desk, asleep on radiator, asleep on machine, jump down, eat sardine                                                                                                      | —                                                                                                            |
| Celeste (new) | idle, talk, wring sheet, walk, stand with basket, shout up                                                                                                                         | 70, stout, black widow's dress, apron, sleeves rolled, headscarf, red forearms                               |
| Zé (new)      | idle, talk, walk, burst from hatch, hammer swing, sit grieving, toss sardine                                                                                                       | 34, broad, stubble, navy wool sweater, yellow oilskin trousers, rubber boots, black mourning armband         |
| Abílio (new)  | idle, shouting talk, read notebook, point up at bells                                                                                                                              | 81, thin and stooped, grey work coat, flat cap, huge hands, a hearing aid that whistles                      |

### Audio

- **Music:** main theme on guitarra; per-room beds: shop (solo guitarra, clock ticks), street (fog ambience, distant tram bells), police (tube buzz, typewriters), tavern (live guitarra from npc_guitarrista), lavadouro (water, slapping sheets), ferreira (ticking only, then silence when it stops), convent (wind, birds), se_tower (bell hum, wind in louvres), antiques (out-of-sync ticking), cais (gulls, rigging, water), boat (hull creak), cistern (drips, low drone). Ch. IV adds a ticking pulse that speeds up at each harbour-clock step. Ch. V uses no music until the silence.

- **The song "O Sino Afogado":** a sung track of 60–90 s for Amália, guitarra accompaniment. Lyrics below; only the key verse is subtitled in full.

> Nine days the fog lay on the river, / nine nights the bronze lay in the deep. / The founders cut its tongue for silence, / and bound it with the blood they keep.
>
> Where the Carmo prays without a roof, / the stone weeps salt for what we did. / Turn the letters seven times, / son of the founders, and ring it back.
>
> And if you fear, as founders feared, love, / the sea will wait; the sea is long. / Come back, come back, my bell-boy, / and ring it backward with this song.

- **SFX:** tram bell; answering-machine beeps; dripping water (hang-up); coffee machine; drawer scrape; salt fizz; cipher clicks; splash; tide-clock winding; clock chime; bell forward (deep bong, city bells answering faintly); bell backward (a reversed swell, like a breath drawn in); tile shatter plus one low note; mooring creak and hull knock; hatch slam; harbour clock chime; phone dial and ring-out; knife; water rising; fog lifting.

- **Voices:** all lines through scripts/generate-voices.mjs. New speakers celeste, ze, abilio need voice IDs before generation. npc_fish_seller's call is a non-subtitled bark.

### Cutscenes

| Id          | Where         | Content                                                                                                               |
|-------------|---------------|-----------------------------------------------------------------------------------------------------------------------|
| cs_intro    | shop          | Narrator over a slow pan of foggy Lisbon, ends on Alan asleep                                                         |
| cs_song     | tavern        | Amália sings; NPCs freeze and turn to her; guitarist plays                                                            |
| cs_decode   | convent       | Three ledger pages resolve; narrator finishes Alan's sentences                                                        |
| cs_musicbox | antiques      | Lacerda returns, winds the box, it plays the song melody, he watches Alan                                             |
| cs_tile     | boat          | Tongue strikes tile; cut to the river, the fog shivering; cut to Lacerda putting down his coffee                      |
| cs_1955     | convent_night | Tomás's confession over three sepia stills: the 1955 cistern, Joaquim with the boy, Joaquim carrying him up the steps |
| cs_confront | cistern       | Lacerda's monologue, then control returns                                                                             |
| cs_silence  | cistern       | The un-ringing: fog drawn down, water rising round Lacerda, still water                                               |
| cs_dawn     | convent       | Climb into a clear sky; Tomás praying; Rui with coffees (if called)                                                   |
| cs_epilogue | stills        | Four stills, optional vignettes, post-credits (two stills)                                                            |

### Systems

- **Saves:** autosave at every chapter card and on entering the cistern.

- **Fail state:** only the cistern (see V.4). Restart keeps inventory and completed rite steps as specified.

- **Map:** instant travel; pins unlock as in Locations.

- **Failed uses:** every item × hotspot pair without a scripted result needs a line in Alan's voice following the humour rules. Write a specific line for each required item on each hotspot in its own room; fall back to a pool of ten generic jokes elsewhere (alan_fail_01 to alan_fail_10, e.g. "I could, but then I'd have to explain it to Inês.").

- **Topic menus:** every topic named in a scene is one menu entry. It closes after use unless the scene says it repeats; Inês's "What now?" always stays.

### Hints (Inês's "What now?" and in-scene fallbacks)

| Current gate           | Hint line                                                                                                         |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| Machine not played     | "The light's blinking, Alan. That's the machine's way of saying 'Alan'."                                          |
| Desk blocked by Pessoa | "He only sleeps there because the lamp's warm. Like you."                                                         |
| Tile not sketched      | "If they won't let you take it, draw it. You used to draw on everything."                                         |
| Song not sung          | "She said not sober and not alone. You can solve one of those with money."                                        |
| Drawer stuck           | "Salt is just stubborn water. Make it wet again."                                                                 |
| Ch. II threads open    | "You've got a key to a dead man's shop and a policeman's grandmother. Pick one."                                  |
| Ferreira dark          | "You took matches from Amália. Even you can't have smoked them."                                                  |
| Stone crusted          | "Salt comes off with water. Even you know that."                                                                  |
| Wheel wrong            | "Sing it to yourself. How many times did she say?"                                                                |
| Founder order unknown  | "Tomás said the Sé. Go and talk to a deaf man about bells."                                                       |
| Theft unsolved         | "He'll notice the velvet. You need something that weighs what it weighs."                                         |
| Ch. IV, any step       | Celeste on the quay gives the hint for the current step instead of Inês                                           |
| Ch. V shop             | Alan to himself: "Bribes. He responds to bribes. Like a Lisbon official."                                         |
| Cistern                | Inês (step-specific, after 20 s idle), e.g. "Get his eyes off you first." / "Last to first, Alan. Who came last?" |

### Asset totals

5 new backgrounds plus 9 variant states; 11 close-up or UI screens; 3 new characters and about 40 new frame sets for existing ones; 16 ambient NPCs and 4 props; 10 cutscenes; 1 sung track; about 300 new voiced lines plus the failed-use pool.

## Continuity and implementation

### Continuity checklist

- Today is the ninth day. The rite happens at the 00:35 turning; the fog lifts at the tenth dawn.

- Today's turnings: 18:25 (Zé) and 00:35 (the rite). Deaths: Ferreira 03:12, Bastos 15:38, Maria Coutinho 04:01, each on a turning.

- The key is 7. The plaintext header is THE BROTHERHOOD RANG THE DROWNED BELL; the rite and Joaquim's page are separate decoded pages.

- Old spelling is Sanches, modern is Sanchez. Foundry marks on bells use the old spelling.

- Founder order, first to last: Ferreira 1611, Bastos 1648, Coutinho 1702, Sanches 1739. The rite is last to first.

- Ages in 1995: Alan 37, Lacerda 52, Tomás 51, Amália 81, Celeste 70, Abílio 81, Zé 34. Joaquim died at 83.

- Only bronze from the bell breaks a tile. Only a founder's blooded hand rings the bell, either way.

- Lacerda commands the water only while he is watching and only while the bell is unsilenced.

- Joaquim ran in 1955 to save Tomás, not from cowardice. Nobody but Tomás knows this until V.3.

- The finale requires the ledger distraction before the bell.

- Nobody in the city must ever learn what happened. Rui knows, files it as unexplained and says nothing.

### Retcons from v1 (check existing code)

| v1                                              | v2                                                                      | Where to change               |
|-------------------------------------------------|-------------------------------------------------------------------------|-------------------------------|
| Amália sends Alan straight to Tomás             | Amália sends him to the police about 1955; convent unlocks after Ch. II | amalia\_\* lines, map unlocks |
| Decoding names Lacerda and ends the stone scene | Decoding gives three pages; genealogy pages stay stuck until Ch. IV     | Cipher result, ledger item    |
| Theft by distraction only                       | Theft needs the vitrine key and the brass weight swap                   | Antiques hotspots             |
| Inês gone at the start of Ch. III               | Inês gone at the start of Ch. V                                         | Chapter flags, shop state     |
| Finale: ledger, then use clapper                | Five-step rite with a water meter                                       | Cistern room                  |
| Alan's grandmother unnamed                      | Graça                                                                   | New lines only                |

### Production delta

- **New backgrounds (5):** lavadouro, ferreira, se_tower, cais, boat (deck and cabin can share one painting with two camera states, or be two rooms).

- **New characters (3 painted):** Celeste, Zé, Abílio. Each needs idle, talk and walk; Abílio also needs a shouting talk set. Ferreira has no sprite.

- **New voices (3):** audition for Celeste, Zé and Abílio.

- **New UI:** the water meter on the cistern pillars; the harbour clock overlay for Ch. IV.

- **Line count estimate:** v1 plus roughly 300 new lines, about half of them looks and failed-use responses. Full asset lists are in Production spec and Ambient NPCs.

### Adding content

The v1 conventions are unchanged: lines in js/lines.js as id: \[speaker, text\]; IDs as speaker_topic; new speakers celeste, ze and abilio; ElevenLabs tags in square brackets, stripped from subtitles; voices generated with node scripts/generate-voices.mjs; rooms, hotspots, dialogue and puzzles in js/story.js; flags on F(); G.dialog(\[...\]) for topic menus; say(...ids) for sequences; character frames from Canva matted with scripts/matte.py; backgrounds 1280×720 in art/bg/ with walk polygon, depth scale, lights and hotspots.

---

## Production decisions (v2 build)

Where the bible was silent or contradicted itself, the build made these choices. They are canon for the game as shipped.

1. **Why Lacerda planned Zé's death.** Joaquim's note says "I have told Maria". Lacerda read that as the son being told too, so Zé was a risk: a founder who might know the rite. He says so in the cistern (`lacerda_ze`).
2. **The 1955 dockworker** was Zé's grandfather, Maria's father. Zé recognises the case if shown the file (`ze_file`). This ties 1955 to the Coutinho line without changing the ending.
3. **Pessoa and the desk.** Grandfather's desk is a slant-top bureau whose lock sits on the writing flap, and Pessoa sleeps on the flap under the lamp, right over the keyhole. The cat is now an animated sprite rather than part of the painting.
4. **The magnifier** lies on the window shelf, as in the bible. The shop painting was redone without the sleeping cat on the sill, and with the bookbinding press, radiator and telephone added.
5. **The ledger in Chapter IV–V.** Inês keeps the ledger at the shop to go on reading the genealogy. That is why it is in the shop, hidden under Pessoa, at the start of Chapter V.
6. **The 1955 file is a photocopy.** "The original stays; the drawer will want it back."
7. **The Ferreira door.** The workshop key is used automatically when Alan arrives (map pin) and the room opens dark from the inside; the dark state hides every hotspot except the oil lamp.
8. **Failed uses.** Every required item has specific lines for the plausible hotspots in its own room; everything else falls back to the shared pool of ten (`alan_fail_01`…`alan_fail_10`) plus character-specific refusals.
9. **Ambient NPCs whose bible positions land on bare wall or open floor** (police officers, the bench man, the sueca players, the couple, the guitarist, the net menders and the fish seller) are painted together with their own furniture (desk, bench, table, stool, crates), so they sit correctly in the light without repainting the rooms.
10. **Amália's song.** The three verses are sung by Amália's voice (ElevenLabs v4, singing direction) over the game's procedural guitarra, since no music model is available. Only the key verse is subtitled in full.
11. **Alan's look.** The existing painted Alan (stubble, leather jacket) is kept for consistency across all of his frames.
12. **Room states.** Night and empty variants (shop Ch. V, tavern Ch. V) are separate paintings; small state changes (taken objects, the washed stone, the open drawer, the weight in the case, the tile on the bunk) are layers cut from clean plates; the rising water and the lit foundry marks in the cistern are drawn by the engine so they can animate.
13. **Laundry in the street** barely moves ("hanging dead still"), with only the faintest sway so the street never looks frozen.
14. **The theft counter.** While Lacerda is in the back room, each interaction with a hotspot counts as an action (walking doesn't). After three actions he returns. If the swap is incomplete he says `lacerda_putback`, everything resets, and the player can ask about the box again.
