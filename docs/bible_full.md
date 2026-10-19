# The Drowned Bell: story bible (complete, Oct 19 2026)

This file joins the game's three reference documents, as of the current build:

1. **Story Bible v2** (docs/STORY.md): premise, tone, lore, cast, locations, the five chapters as built, endings, items, flags and the production decisions. Its "Production decisions" section records choices that are canon for the game as shipped.
2. **Character backstories and psychological profiles** (docs/CHARACTERS.md). The author's decisions at its top override the rest of it.
3. **Lore of the Sea** (docs/LORE.md). Canon for the first game and the sequel; where it differs from the Origins in the Story Bible, it wins. Items marked **(proposal)** are not in the game.

The full script (every line, by chapter and location) is a separate file: script_full.md.

The game is set in Lisbon, Tuesday 31 October 1995 (fog day 1 is Monday 23 October; the game ends at dawn on Wednesday 1 November).

# The Drowned Bell — Story Bible v2 (Expanded)

Oct 18, 2026 · @Kuba · updated Oct 19

## What changed from v1

v2 grows the game from three chapters and nine rooms to five chapters and fourteen rooms, with four new characters. The core is untouched: Lisbon 1995, the ninth day of fog, the tile murders, Amália's song, the cipher key of 7, the stolen clapper, Inês as hostage, the ledger distraction and the backward ringing. Everything below replaces v1 sections 1–8 as canon; v1 section 9 (how to add content) still applies and is summarised at the end.

The main changes:

- **Lore holes closed.** The blood rule, the purpose of the tongue, why Lacerda spared Alan, why the ledger distracts him and why the 1955 fog ended are now explained and planted early (see Lore).

- **Every v1 seed is paid off.** The 1955 drawer, Ferreira's clocks, the music box, Rui's mother, Tomás's "Yes. I know.", "fools twice over", the phone number, the sea-monster tile and Pessoa all now lead somewhere.

- **Two new chapters.** Chapter II (The Unexplained Drawer) is an investigation chapter with two parallel threads. Chapter IV (The Founders' Blood) is a race against the 18:25 turning of the tide to save Zé Coutinho.

- **A real finale puzzle.** The cistern now asks the player to combine five things learned across the game, with a soft-fail water meter instead of a single instant death.

- **One canonical ending**, plus small epilogue variations driven by optional scenes. No branching that changes the plot.

**v2.1:** Alan is now 37 (timeline re-dated), jokes constantly with double meanings (see Alan's humour and the line tables at the end of each chapter), the rooms have ambient NPCs, and a full production spec covers art, UI, audio, cutscenes, systems and hints.

## What changed since Oct 18

- **The reserve's afterwards (epilogue).** It now plays in the room as a painted pair, the two of them sitting against the reserve's shelves (the crate is gone everywhere), with two new lines (vasco_after_3, alan_after_know), and the narrator closes it over the scene. The clapper in every picture is the finale's: long and heavy.

## What changed since Oct 17

This pass records the game as it is built; no story was invented. The walkthrough had fallen behind the code in several places, so every chapter was checked against it.

- **Rui's Diário (II.3a, new).** Rui offers his paper when Alan tells him about Ferreira's tide clock, and Alan reaches past him and takes it there and then (the desk hotspot sat behind Rui). Old saves can ask for it. The turnings are now worked out from the Diário and the notebook; the tide clock only agrees.

- **Teixeira (I.4, II.1a, new).** Rui leaves for the coroner after the list; Teixeira guards the bag and is flirted round to the wall before Alan can sketch. In Ch. II he brings the Ferreira key to the shop the next time Alan walks in from the street once the drawer is open, with the choice to take him upstairs (and Inês and the handcuff key an hour later).

- **Duarte (I.6, III.5).** The song needs Duarte to play ("never without Duarte"). His visit now comes at the end of Chapter III, while Inês steams the ledger, with Amália's message about the music box, the choice to take him upstairs, his song, and the lyrics; if accepted, he is charming Inês when Ch. IV opens.

- **The Sé heist (I.5, I.5a, I.5b, new).** Inês's plan, the museum, Vasco, the pit, the key, the throw, the four exchanges, the charter, Vasco's card and the register that sends Alan to the tavern.

- **Chapter III.** Tomás and the charter (the bell's sea baptism) before the stone; the midpoint choice; Vasco's fragment on the way to the tower; Abílio's founders' blood before the order; Lacerda's first meeting and his family topic; vasco_hook_3 in place of vasco_hook_2.

- **Chapter II.** Ferreira's desk drawer (lock 0312) holds the tide card; the bath and the laundry remark recorded; Celeste's Maria and cream-suit beat; Rui's news about the withdrawn complaint.

- **Chapters IV and V.** Zé's romance, Rosa's dig and the quay after the boat; the required calls to Rui and Vasco; the cistern lines as played (the ledger's last page, Lacerda's father, he doesn't fight the water); a clean rite now costs three marks; no Rui with coffees at dawn.

- **Endings.** The epilogue order as built (post-credits pictures before the phone call); the vignette texts; Thursday without the twin.

- **The date.** The date is fixed as Tuesday 31 October 1995: fog day 1 is Monday 23 October, Maria drowns at 04:01 on Monday 30 (day 8), and the game ends at dawn on Wednesday 1 November, All Saints' Day, the anniversary of 1755. The Diário's tide rows read Seg 23 to Ter 31.

- **Tables.** Cast (Vasco, Teixeira, Duarte added), Locations (nineteen rooms), Structure, map unlocks, Items (twenty-six, the magnifier on the desk, the brass weight gone), Flags, Alan's line tables (retired ids replaced: alan_wake, alan_wheel_wrong, alan_glacier; lacerda_mine, alan_answers, alan_ledger and rui_coffee_back no longer play), Production decisions 4, 12 and 14 corrected, 15 to 18 added. Humour rule 7: Lacerda's threat about Vasco is cut from the build.

## Premise

Lisbon, 1995. For nine days a fog has sat on the city, and people have drowned in their beds: in locked rooms, half a mile uphill from the river, their lungs full of cold Atlantic seawater. A small blue tile lies on each pillow, showing a bronze bell beneath curling waves.

Alan Sanches is a lazy, witty bookseller in the Alfama. His grandfather Joaquim died ten days ago of what the doctor called a weak heart. The fog came the next morning. Now Alan finds the family name on the killer's list and a ledger in a locked drawer that nobody can read.

He is the last of the Sineiros, the bell-founder line whose blood keeps an ancient bell asleep beneath the city. In 1755 that bell was rung on the tenth morning of a nine-day fog, and Lisbon died three times: earthquake, fire and wave. In 1955 the fog came back, and a 43-year-old Joaquim stopped it, but only halfway: he took the tongue and ran instead of silencing the bell. He hid it for forty years and never told anyone. Today is the ninth day again.

**Logline:** a man who never leaves his shop has one day to finish what his grandfather started, before the sea walks into Lisbon a second time.

**The day at a glance:** the game runs from 11:00 on the ninth day, Tuesday 31 October 1995, to dawn on the tenth, Wednesday 1 November, All Saints' Day. The river "turns" (slack water) four times a day, and the murders happen at the turnings. The two that matter are 18:25 (Zé Coutinho's death, if Alan is late) and 00:35 (high water, when the cistern opens and Lacerda performs the rite).

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

7.  **Lisbon, 1995, isn't always kind.** A few people let him know what they think of a bachelor bookseller: the woman under the washing after his bath (II), Senhor Armando on the bench, who means it kindly (I–IV), and Rosa the fishwife on the quay until the old mender tells her to stop (IV). (Lacerda's threat to tell the Patriarchate about Vasco was cut from the build: he and Alan meet for the first time in III.) These are low-key and never slurs. Alan never answers back and never jokes. He looks away and goes quiet, and the narrator says once what it costs him.

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

2.  **While any founder line lives, the bell sleeps.** It cannot wake itself. It can only be woken by a founder's hand, with its own tongue (the one that was blessed and rung in 1755, not its twin; see rule 5), wet with that founder's blood, at a turning of the tide between the ninth night of a fog and the tenth dawn. Rung forward, it wakes and calls the sea. Rung backward, it is silenced forever.

3.  **The tongue calls the fog.** When the tongue comes within reach of the cistern, the bell breathes and the fog rises for nine days. If nobody rings it by the tenth dawn, the fog lifts and the window closes for a generation.

4.  **The water answers to the Lacerdas.** The Brotherhood's priests were Lacerdas, and their oath gives them command of the bell's water. The tiles are made of clay from the cistern floor, "a mouthful of the sea kept in clay". A tile left beside a sleeper drowns them at the next turning of the tide. Ordinary tools cannot break one; bronze from the bell can. When the bell is silenced, the oath breaks and the water takes its debt.

5.  **The founders poured twice.** Every founder casts a spare tongue from the same pour, in case the first one cracks. The drowned bell's twin has the same weight and the same marks, but it was never blessed and never rung, so it is ordinary bronze: "Only the bell knows the difference" (Abílio). The Sanches family kept the twin. In 1956 Joaquim asked Abílio where to hide bronze in plain sight ("A cathedral! Nobody looks at bronze twice in a cathedral") and deposited it in the Sé reserve, catalogued as "Clapper. Bronze. Provenance unknown. Deposited 1956", in the same year he gave the museum the Brotherhood's charter and register.

6.  **The cipher is a Caesar shift of 7.** The key is carved on the weeping stone at the Carmo and hidden in Amália's fado ("turn the letters seven times"). Joaquim learned the key from his father and wrote it into that song for her in 1934, a love song with a family secret inside.

### Why Lacerda does what he does

Only a founder can ring the bell, forward or backward. Any founder who knows the rite can silence it, so Lacerda must kill every founder who might, and keep alive one who doesn't know how.

- **He killed Joaquim first** because Joaquim had hidden the tongue since 1955 and knew the rite. A single drop of seawater on the heart; the doctor saw a weak heart. Lacerda took the tongue and Joaquim's music box. The fog rose the next morning.

- **He drowned Ferreira, Bastos and Maria Coutinho** at three turnings of the tide, one founder per tile.

- **He left Alan for last** because Alan knew nothing. "The last Sineiro, and you never once came asking about bells. So I left you alone. I was grateful."

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
| 1956 on | Tomás swears to keep the Carmo grate locked and becomes its priest. Joaquim hides the tongue and never speaks of it. He deposits the Brotherhood's papers and the tongue's unconsecrated twin in the Sé reserve, on Abílio's advice.                                                                                                                                                                                                                                                     |
| 1958    | Alan is born. His father dies when Alan is nine; his mother goes home to St. Augustine, Florida. Joaquim raises him above the shop.                                                                                                                                                                                                                                                           |
| 1995    | Vicente Lacerda (52) kills Joaquim (83) and takes the tongue. Nine days of fog, from Monday 23 October. Alan is 37. Today is the ninth day, Tuesday 31 October; the tenth dawn is All Saints' Day.                                                                                                                                                                                                                                                      |

## Cast

Eleven speaking roles in the v2 plan: seven returning, four new. The build adds three more the story now depends on (Vasco, Teixeira, Duarte; see Added in the build) and a handful of voiced bystanders (Senhor Lino, Senhor Armando, Rosa, the net menders, the washerwomen). New characters need ElevenLabs voices and painted frames (idle, talk, walk at minimum); suggested voices are placeholders to audition.

### Returning

| Character            | Role                               | Voice                       | Wants                                                                    | Secret or wound                                                                                    | Arc in v2                                                                                                                                  |
|----------------------|------------------------------------|-----------------------------|--------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Alan Sanches (37)    | Bookseller, last Sineiro           | Roger, laid-back            | To be left alone                                                         | Raised by Joaquim above the shop. Has his mother's number in St. Augustine, Florida and hasn't called in two years. | From asleep at eleven to doing what his grandfather ran from. Calls his mother at dawn.                                                    |
| Inês Carvalho        | Historian, assistant, best friend, conscience. A Black Brazilian woman from Salvador who moved to Lisbon for her doctorate and stayed: sassy, confident, curvy, very smart. Wears a black blazer over a faded grunge band tee, high-waisted jeans, heels, gold hoops and bangles | Taciana, vibrant Brazilian | To finish her thesis on 1755; to make Alan try                           | Joaquim confided in her more than in Alan, but never about bells                                   | Hint-giver at the shop in Ch. I–IV; plans the Sé heist and takes the papers from the reserve (I); steams the genealogy apart (III). Kidnapped in Ch. V; warns Alan while tied, then holds the lantern for the rite. |
| Insp. Rui Mendonça   | Polícia Judiciária                 | Callum, husky               | To close the case without believing in it                                | His mother says "the river is breathing" and he's starting to agree                                   | Gives the list (I), opens the 1955 drawer, sends the Ferreira key with Teixeira and hands over his Diário (II), waits outside the Carmo (V). Closes the drawer in the epilogue. |
| Dona Amália (81)     | Fado singer, Taberna da Saudade    | Mora, gritty and enigmatic  | Not to sing that song                                                    | Loved Joaquim; he married someone sensible                                                         | Sings the song, once Duarte will play (I); the music box is hers (III, by Duarte's message or in person); gives a blessing on the last night (V, optional). |
| Father Tomás (51)    | Keeper of the roofless Carmo       | Nathaniel, calm and British | To keep the grate locked                                                 | The altar boy in the cistern in 1955. He has waited forty years for the next Sineiro.              | Explains the bell's sea baptism, guides Alan to the stone and offers him the way out (III); at midnight tells him the truth about 1955 and gives him the lantern (V). |
| Vicente Lacerda (52) | Antiquarian in the Chiado, villain | Blackwood, posh villain     | The bell rung forward; the founders gone; the city given back to the sea | Watched his father drown in 1955. Killed Joaquim.                                                  | Courteous host (III), voice on the machine (V), drowned by his own water (V).                                                              |
| Pessoa               | The cat, nine kilos, no ambition   | (none)                      | Warmth                                                                   | Has ruined a first edition                                                                         | Blocks the desk (I) and sleeps on the warm answering machine (V) until bribed with Zé's sardine.                                           |
| Narrator             | The voice of the city              | Eleanor, gracious           | (none)                                                                   | (none)                                                                                             | Chapter cards, looks, the 1755 and 1955 flashback narration                                                                                |

### New

| Character                  | Role                                                           | Voice (to audition)                | Wants                                               | Secret or wound                                                                          | Arc                                                                                                                        |
|----------------------------|----------------------------------------------------------------|------------------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Dona Celeste Mendonça (70) | Rui's mother; washerwoman at the Alfama lavadouro; Zé's godmother | Older, earthy, warm female         | For Rui to eat properly; for the river to calm down | Saw Joaquim and the boy come up from the Carmo at dawn in 1955 and never told the police | Lore source (II): the river breathes, the tiles are "the sea in clay", bronze breaks them. Leads Alan to Zé's boat (IV).   |
| Zé Coutinho (34)           | Fisherman at Cais do Sodré; son of victim Maria Coutinho       | Gruff, low male                    | To be left alone with his grief                     | Didn't know he was a founder. A tile appeared in his bunk this morning.                  | Saved at the 18:25 turning (IV); a fierce moment in the cabin, with Zé in charge. Gives Alan his knife and a sardine. Pulls a cream linen jacket from the Tagus (post-credits). |
| Sr. Abílio (81)            | Last hand bell-ringer at the Sé cathedral                      | Loud, cracked old male             | Someone to talk to who isn't a bell                 | Rang with Joaquim as boys; deaf from sixty years of bells                                | Reads notes Alan writes in his notebook; explains the founders' blood, shows him the four founder bells and the order they were cast, and reads the sketch of the tongue (III). |
| Sr. Ferreira (posthumous)  | Clockmaker, first victim                                       | (none; his notes are read by Alan) | (none)                                              | Made locks for all four founder families and for Lacerda's glass case                    | His sealed workshop is a room in Ch. II. His tide clock and his tide card reveal the pattern.                              |

### Added in the build

| Character                  | Role                                                           | Voice                              | Wants                                               | Secret or wound                                                                          | Arc                                                                                                                        |
|----------------------------|----------------------------------------------------------------|------------------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Dr. Vasco Teles            | Curator of the Sé treasury, digging the Sanches casting pit in the cloister | Jarnathan, warm            | Someone who cares about his work                    | Saw Inês in the glass of a find tray during the heist and said nothing; withdrew his own complaint | Robbed by charm (I); lends Alan the twin and nearly kisses him (III); a phone call before the cistern (V); Thursday, the truth and the reserve (epilogue). |
| Officer Teixeira           | Constable at the Judiciária, on the phone to his mother        | Erby, nerdy                        | Permission                                          | Has never done anything his mother wouldn't approve of                                    | Guards the evidence bag and is flirted round to the wall (I); brings the Ferreira key to the shop (II), and Alan may take him upstairs. |
| Duarte                     | Amália's guitarist at the Taberna da Saudade                   | (his own lines, "guitar")          | Someone who listens                                 | Never waits for anyone                                                                    | Won't play for the song until Alan listens (I); brings Amália's message to the shop, and Alan may take him upstairs; his song "Meu Lindo Guarda-Livros" (III). |

## Locations

Fourteen rooms in the v2 plan, nine of them existing; the build has nineteen (the Sé museum, cloister and reserve, Alan's room upstairs, and the *Maria Fé*'s cabin as a room of its own). New rooms need a 1280×720 painting, walk polygon, depth scale, lights and hotspots.

| Room id             | Place                            | Mood and light                                                                  | Who's there                              | Chapters                |
|---------------------|----------------------------------|---------------------------------------------------------------------------------|------------------------------------------|-------------------------|
| shop                | Livraria Sanches, Alfama         | Grey fog light, banker's lamp. Ch. V: cold, door open, lamp only.               | Inês (I–IV), Pessoa                      | I–V                     |
| street              | Alfama street, tram stop         | Fog, gas lamps lit at noon, laundry lines, sea-monster azulejo                  | (no one)                                 | I–V                     |
| map                 | Map of Lisbon (travel)           | Locations unlock as learned                                                     | (none)                                   | I–V                     |
| bedroom             | Alan's room, above the shop      | Lamp-lit, a bookshelf, an iron bed                                              | (Alan; Teixeira or Duarte, if invited)   | I (waking), II, III     |
| police              | Polícia Judiciária office        | Flickering tube, evidence desk, coffee machine, the drawer that won't close     | Rui, Teixeira (I–II)                     | I–II                    |
| tavern              | Taberna da Saudade               | Lanterns, candle, azulejo walls, guitarra                                       | Amália, Lino, Duarte, the sueca players  | I, III (opt.), V (opt.) |
| se_museum           | Sé museum, "Lisboa e o Mar, 1700–1755" | Stone gallery, six exhibits, the iron door of the treasury reserve        | Inês (I), a guard                        | I, III                  |
| se_cloister         | Sé cloister and the casting pit  | Arcades, an open dig, the chained stair to the tower; Thursday morning light    | Vasco, a volunteer                       | I, III, epilogue        |
| se_store            | The Sé treasury reserve          | Shelves, crates, a work lamp                                                    | Vasco                                    | III, epilogue           |
| **lavadouro** (new) | Public washhouse, Alfama         | Steam over stone basins, wet sheets, fog leaking in through arches              | Celeste                                  | II                      |
| **ferreira** (new)  | Relojoaria Ferreira, Baixa       | Sealed, police tape, shutters down; one oil lamp. Every clock stopped at 03:12. | (no one)                                 | II                      |
| convent             | Convento do Carmo by day         | Roofless Gothic nave, lavender sky, holy-water stoup, the weeping stone         | Tomás (sweeping)                         | III                     |
| **se_tower** (new)  | Bell chamber of the Sé cathedral | Dusty shafts of light through louvres, four great bells, ropes                  | Abílio                                   | III (reached through the cloister) |
| antiques            | Antiguidades Lacerda, Chiado     | Clocks keeping different centuries, glass case, music box                       | Lacerda                                  | III                     |
| **cais** (new)      | Cais do Sodré quay               | Fog over moored fishing boats, gulls, crates, a harbour clock                   | Celeste (laundry for the boats)          | IV                      |
| **boat** (new)      | Deck of the *Maria Fé*           | Wet planks, hatch, mooring line, one porthole of grey light                     | Zé                                       | IV                      |
| cabin               | Cabin of the *Maria Fé*          | A narrow bunk, a photo of Maria, the tile in a spreading puddle                 | Zé                                       | IV                      |
| convent_night       | Carmo at midnight                | Moonlight, open grate glowing green                                             | Tomás (with a lantern)                   | V                       |
| cistern             | Flooded cistern under the Carmo  | Torches, black-green water, the Drowned Bell, a rising waterline                | Lacerda (robed), Inês (tied to a pillar) | V                       |

**Map unlocks:** police after the answering machine (until Ch. II ends); the Sé museum after Inês's plan; the tavern door on the street after the register is read; lavadouro after the drawer is opened; ferreira once Teixeira has brought the key (shown as "Waiting for the key" until then); convent after Ch. II; se_tower and antiques after decoding and the choice to go to the Chiado; cais after the genealogy page; the Carmo at midnight after the ledger is found and Rui called. Rooms whose story is finished stay visitable with closing lines.

## Structure

Five chapters over one day, each ending on a turn in what Alan knows. The in-game clock is narrative, not real-time: it advances at chapter cards and is shown on the harbour clock, Ferreira's tide clock and Lacerda's clocks.

| Ch. | Title                  | Clock       | Question the player answers                                | Rooms                                       | New this chapter                                                |
|-----|------------------------|-------------|------------------------------------------------------------|---------------------------------------------|-----------------------------------------------------------------|
| I   | The Fog                | 11:00–13:30 | What is killing people, and why is our name on the list?   | shop, street, police, se_museum, se_cloister, tavern | Pessoa desk gag, dripping hang-up, Teixeira, the Sé heist, Duarte, matches, glass |
| II  | The Unexplained Drawer | 13:30–15:30 | Has this happened before, and when do they die?            | police, shop (bedroom), lavadouro, ferreira | All new chapter: 1955 file, Teixeira's visit, Celeste, tide clock, Rui's Diário, vitrine key |
| III | The Weeping Stone      | 15:30–17:15 | What is the bell, who is ringing it, and how do I stop it? | convent, se_cloister, se_tower, antiques, se_store, tavern (opt.), shop (bedroom) | The bell's baptism, holy-water stone, the midpoint choice, Abílio, founder order, the J.C. clock, the twin, Duarte's visit |
| IV  | The Founders' Blood    | 17:15–18:25 | Who is the next to die, and can I get there first?         | shop, cais, boat, cabin                     | All new chapter: Zé, the tile broken with the tongue            |
| V   | The Drowned Bell       | 19:00–dawn  | Can I do what my grandfather couldn't?                     | shop, tavern (opt.), convent_night, cistern | Pessoa on the machine, the calls to Rui and Vasco, Tomás's confession, the five-step rite |

**Structural rules:**

- Each chapter has at least one stretch where two threads can be done in either order (Ch. II: Celeste and Ferreira; Ch. III: Sé and antiques after decoding; Ch. V: tavern optional).

- Inês stays at the shop through Ch. IV (except while she is at the Sé in Ch. I) and acts as the hint system: talking to her summarises the current goal in character.

- Every item is used at least once; most are used twice. See the item list.

- The only fail states are in the cistern: the water meter, and laying a hand on Lacerda. Both restart the cistern scene.

## Chapter I: The Fog

11:00–13:30. Alan learns that people are drowning in locked rooms, that his grandfather wrote the killer's list, that the Brotherhood's papers are locked in the Sé, and that a song holds a key. Rooms: shop (and Alan's room upstairs), street, police, Sé museum and cloister, tavern.

### I.1 Intro

The opening is a sequence of paintings with narration: the fog over Lisbon (**narr_intro_1**); the legend of the drowned bell, as the old women tell it (**narr_intro_legend**); Maria Coutinho's last night in Madragoa, the tile on her pillow at one minute to four, the list in her apron, the water (**narr_maria_1** to **narr_maria_6**, **narr_cold_open**); then the city waking to it: the newspaper (**narr_intro_2**, **narr_intro_tiles**), a patient man in the Chiado winding a clock and writing down the next name (**narr_intro_clock**), the shop sign in the Alfama (**narr_intro_alfama_2**). Chapter card. Then the empty shop: Inês calls up the stairs, Alan wakes in his room above it, yawns and comes down. She tells him there's been another one, a fishwife in Madragoa, and points him at the blinking answering machine.

- **narr_intro_1**: "For nine days the fog had sat on Lisbon like a cat on a warm book. Nobody could move it, and nobody quite liked to try."

- **ines_wake_up**: "Alan! It's eleven o'clock! Even the cat has done more today!" **alan_wake_up** (called down the stairs): "I'm thirty-seven, Inês! At my age you don't wake up. You resurface!"

- **ines_intro_3**: "And there's been another one. A fishwife in Madragoa. Door locked, windows shut. Drowned in her own bed." **alan_intro_4**: "Must have been a very small wave."

### I.2 The shop

**The machine** holds two messages. Message 1 is Rui, a warning to a friend (**rui_msg_2**): "A name came up in a case this morning. Yours. It's probably nothing... Call me back, Alan." Message 2 is eight seconds of dripping water and a click. It is Lacerda checking that Alan is home; the player learns this in Ch. V.

- **alan_hangup**: "Wrong number. Or a very sad plumber."

**Puzzle I-A: the desk and the cat.** Goal: get the ledger.

1.  Take the key from the sugar tin.

2.  Grandfather's desk is locked, and Pessoa is asleep on it under the banker's lamp, right over the keyhole. Take, talk or push all fail ("Nine kilos of no.").

3.  Use the banker's lamp (switch off). The desk cools; Pessoa relocates to the radiator.

4.  Use the key on the desk: the drawer opens on the ledger (**alan_unlock**) and stays open until Alan takes it.

Logic: cats follow heat; the player has seen the lamp lit over the sleeping cat. Inês hint: "He only sleeps there because it's warm. Like you."

**Free pickups:** three coins from the register; the magnifier from grandfather's desk, beside the sleeping cat. (The brass weight on the bookbinding press was removed from the game.) Alan starts with his notebook.

- **alan_look_ledger**: "Letters like a drunk's alphabet. And at the end, Grandfather's hand."

- **alan_look_notebook**: "Shopping lists, a sonnet I never finished, and a phone number I'm afraid to call. Ringing people back was never my strong suit."

The door to the street opens once the machine has been played (**alan_door_first**).

### I.3 The street

Tram stop, gas lamps lit at noon, laundry hanging dead still. The sea-monster azulejo has "a strangely knowing expression". With the magnifier: in its claw, very small, is a bell. This is optional, but it is the player's first sight of the seal outside the police station, and Inês comments on it later (**ines_monster**).

Senhor Armando dozes on the bench (I–IV). Talk to him once and he means well (**bench_advice_1**, **bench_advice_2**: a wife, his Lurdes's nieces); Alan turns away (**alan_bench_2**). The Taberna da Saudade is on this street; its door stays shut until Alan has a reason (**alan_tavern_shut**). The tram stop is the way to the map.

### I.4 The Polícia Judiciária

Rui is behind a desk under a flickering tube; Officer Teixeira stands at the other end of it, on the desk phone to his mother. Dialogue topics:

- **The drownings:** locked rooms, beds dry, lungs full of seawater with salt and sand. Three in nine days.

- **The victims:** Ferreira, clockmaker, Baixa; Bastos, retired teacher, Graça; Maria Coutinho, fishwife, Madragoa. All died in bed (Bastos during his siesta), "each one within the same hour as the tide report. Which means nothing."

- **The tile:** in an evidence bag on the desk. Alan can't take it ("hands off" until the drownings have been discussed).

- **The list:** found in Maria Coutinho's apron (**rui_list_1b**). Four old names: Ferreira, Bastos, Coutinho, Sanches, and under them "if anything happens to me". Alan recognises the handwriting as Joaquim's, who died before all of them. This is the chapter's first real chill. Then Rui leaves for the coroner: **rui_leave**, **rui_watch** ("Teixeira. Watch him. He touches nothing.").

- **Strange cases:** Rui mentions "a drawer upstairs that won't close" and shuts the topic: "Not today, Alan." The coffee machine is visible on the wall (used in Ch. II).

- **The fog:** a temperature inversion, or the river breathing (**rui_fog**); his mother's message (**rui_mother_2**).

- **alan_list_hand**: "That's my grandfather's writing. He's been dead ten days. He wrote this before any of them died."

- **rui_water**: "Then do me a favour. Stay away from water, Sanches." **alan_water**: "Inspector, I've been avoiding water for thirty-seven years. Ask my bathtub."

**Puzzle I-C: Teixeira.** Goal: sketch the tile while Rui is out. Teixeira guards the bag, politely and firmly: "No drawing the evidence either. Nothing leaves this desk, not even a picture." (**teixeira_nodraw**)

1.  Flirt, three steps, each one making his mother on the phone harder to answer: the shoulders (**alan_flirt_cop_1**), a hand on his chest, "Solid. Like a good oak bookcase" (**alan_flirt_cop_2**), a squeeze of the arm on the bicep line (**alan_flirt_cop_3**, **alan_flirt_cop_4**: "Then tell her you're in very good hands."). The touches are painted pairs.

2.  Teixeira, scarlet, turns to the wall: "F-fine. Do your sketch. Just… let me f-finish with my mother first." (**teixeira_fine**)

3.  Use the notebook on the evidence bag.

4.  Alan goes back to thank his distraction (**alan_cop_thanks**), close, and Rui walks in on the two of them. They spring apart. **rui_back_1**: "...Well. I leave for five minutes." **teixeira_back**: "The witness was just... giving his statement, sir." **alan_back**: "A very full statement. He took it down beautifully." Rui, serious, a friend's warning: **rui_back_3** ("Whatever this is, don't be a hero. Lock your door tonight.").

Flags: sketched_tile, flirted_cop.

### I.5 The shop again

Inês sees the sketch and identifies the seal: the Irmandade do Sino Afogado, eighteenth-century fanatics who "rang a bell beneath the city on the morning of the earthquake... and the river answered". With the list seen, she names the four founder families (**ines_sketch_founders**, **alan_founders**); with the sea-monster tile seen, **ines_monster**.

Then the new lead: she has seen that seal before, on a sealed case in the Sé's treasury reserve, and the curator wears the key round his neck (**ines_reserve**). He won't show it to her; he might show it to Alan (**ines_plan**). **alan_why** / **ines_why_2**: "the guard says the curator notices handsome men. Smile at him. Doors open." Alan plays innocent (**alan_deny_why_2**). **ines_coward**: "You're not lazy, Alan. You're the hardest-working coward I know." **alan_coward**: "Thank you. I've put years into it." Flags: knows_brotherhood, ines_plan. The Sé museum unlocks; Inês goes ahead, and the shop stays empty until she has the papers.

### I.5a The Sé: the museum and the pit

**Puzzle I-D: the reserve key.** Goal: get the curator's key to Inês and keep him busy while she's inside.

- **The museum** ("Lisboa e o Mar, 1700–1755"). Inês lays out the plan (**ines_plan_se_1** to **ines_plan_se_3**): the iron door behind the desk is the reserve; the curator is out in the cloister digging a bell pit; he'll talk all day to someone who knows why this city was afraid of the sea. Two exhibits are required (the panorama of Lisbon in 1700 and the alminhas panel) and four are optional (the gold of the fleets, the sailors' ex-votos, the *História Trágico-Marítima*, the engraving of 1 November 1755); each is a short Inês and Alan exchange. Then **ines_go**: "Go and be interested in it. Genuinely. He'll smell flattery."

- **The cloister.** Dr. Vasco Teles, curator of the treasury, in the Sanches casting pit (**vasco_hello**: "Please don't step on the Moors."). Look at the pit, the founder marks and the mould fragments, then ask him about each; on the third question he insists Alan see the bottom (**vasco_bottom**). Alan slips on the ladder and lands in Vasco's arms (**vasco_close**: "Careful. It's eighteenth-century.").

- **The shirt.** Vasco has buttoned his shirt one hole off since six this morning (**vasco_shirt_1**). Alan does it up for him; **narr_shirt**: "Somewhere between the third button and the fourth, the reserve key slipped off its clip and into Alan's pocket... Nobody ever watches the hands."

- **The throw.** Ask about the inscription: Vasco kneels with his nose to a founder's mark low on the pit wall. **alan_toss_ines**: "Inês. Catch." A timing bar: throw while his head is down. Too early or too late and he looks up (**vasco_lookup**); try again. **narr_catch**: she catches it one-handed and is gone along the arcade. **narr_glimpse**: Vasco sees her reflection in the glass lid of a find tray, watches it out of the frame, and says nothing at all.

- **Keeping him talking** (**alan_stall_rule**: "Keep him on his work, make him laugh. Don't crowd him, and don't look bored"). Four exchanges (the layers, the coins, why he digs, the quiet), three replies each: warm moves on, pushy cools him, bored reminds him of the reserve. Two misses in a row and he's on the ladder (**vasco_ladder**) until Alan calls him back with a real question (**alan_rescue**, **vasco_rescue**).

- **The reserve** (a painting, **narr_reserve**): "a charter, a register of the drowned, and a card in a careful hand she knew." The card reads "Deposited 1956 by J. Sanches. Sealed. Not to be exhibited."

- **The key goes back.** Vasco shows Alan the Roman floor on his knees (**vasco_roman**); Inês drops the key into Alan's hand (**narr_key_back**); Alan clips it back on, with the same hands (**alan_collar_2**, **vasco_collar_2**, **alan_collar_3**). **narr_key_clip_2**: "It had been gone twenty-two minutes, and Alan was quite sure nobody had noticed." **ines_innocent**: "Find anything interesting down there, Doctor?" Vasco presses his card on Alan: the Roman layer is open on Thursdays, private viewing (**vasco_card**). **alan_thursday**: "I'm very interested in Romans." **vasco_liar**: "You're a terrible liar, Senhor Sanches. Don't change." Flags: heist_done, vasco_thursday.

- In the museum Inês hands over the charter and Joaquim's card (**ines_handover**). **alan_donated**: "He gave away the evidence and kept the secret. That's a very Sanches kind of tidying." She takes the register home (**ines_home**).

### I.5b The shop: the register

Inês reads the register as soon as Alan walks in. **ines_liked_2**: "You liked him." **alan_key**: "I liked his key." The Brotherhood were widows and shipowners paying for Masses for men with no graves, "until someone offered them more than Masses" (**ines_irmandade**). The last page is in Joaquim's hand: "'O Sino Afogado. Sung at the Taberna da Saudade.'" (**ines_register_fado**, **ines_sketch_3**). Flag: reserve_raided. The tavern door opens.

### I.6 The Taberna da Saudade

Amália knew Joaquim. Dialogue topics: Joaquim (the photograph opens with it), the fog, the song, and later the music box.

- **The photograph** on the wall shows Amália and Joaquim in 1934. Behind them on a shelf is a music box inlaid with mother-of-pearl, with a silver ship on painted waves. Seeing it sets the flag needed to recognise the box in Ch. III.

- **Matches:** a box on the bar. Amália: "Take them. I have given up smoking eleven times."

**Puzzle I-B: the song.** Goal: hear "O Sino Afogado".

1.  Ask for the song. **amalia_conditions**: "Not sober, menino. Never alone. And never without Duarte."

2.  Use two coins on the bar: Senhor Lino pours two ginjinhas (**lino_sell**: "Your grandfather never paid in his life, so you're settling a very old tab."). One coin remains.

3.  Duarte, her guitarist, plays "for people who listen, not for people who drink" (**duarte_listen**). Flirt, three steps: the twelve strings (**alan_flirt_guitar_1**), private lessons (**alan_flirt_guitar_2**: "Tuesdays. Bring a bottle, and a bigger tip."), then "Watch his hands": the lesson, his hand over Alan's on the neck of the guitar (a painted pair). **duarte_agree**: "Fine. I'll play. For you." Amália, amused: "Joaquim looked at me the way you look at my guitarist, menino. At least he picked a singer." (**gag_amalia**)

4.  Give Amália a ginjinha. They toast to Joaquim.

5.  Cutscene: she sings, in Portuguese, with English captions and a slideshow of paintings; Lino, Duarte and the card players play along.

Logic: she gives all three conditions in one line; "alone" means someone must drink with her, "Duarte" means the guitarist must want to play. After the song Alan picks up her empty glass from the floor ("For luck. And because I haven't stolen anything yet today.").

**The song (key lines, as captioned):**

> Where the Carmo prays without a roof, the stone weeps cold salt; / turn the letters seven times, son of the bronze and the river.

Amália then tells him what the bell was ("a bell christened by the wrong priest. A bell for the drowned, menino. Not for drowning.", **amalia_baptised**) and what he is: the last of the Sineiros (**amalia_after_song**). She adds the hook for Ch. II: "The last time the fog stayed this long, your grandfather came home with white in his hair. Ask the police about nineteen fifty-five."

- **amalia_menino**: "He sang it better. He wrote it, after all."

### I.7 Alan's lines for this chapter

Add these to lines.js alongside the lines above. Inês's score lines (ines_score_1 to ines_score_10, "Four out of ten. The cat laughed.") can follow any joke marked ★, chosen at random, when she's in the room.

| Line id             | Trigger                       | Line                                                                                                                                                    |
|---------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| alan_wake_up        | Reply to ines_wake_up         | "I'm thirty-seven, Inês! At my age you don't wake up. You resurface!" (called down the stairs; replaces alan_wake)                                      |
| alan_look_register  | Look at register              | "Three coins. My entire liquid assets. Liquid being the word, in this weather."                                                                         |
| alan_take_coins     | Take coins                    | "Petty cash. Petty, but loyal."                                                                                                                         |
| alan_sugar_tin      | Take key                      | "Grandfather kept his key in the sugar. Sweet man. Suspicious, but sweet."                                                                              |
| alan_look_pessoa    | Look at Pessoa                | "Named after a poet with seventy personalities. This one has one, and it's asleep."                                                                     |
| alan_lamp_off ★     | Lamp switched off, cat leaves | "No warmth, no company. He's like every relationship I've had."                                                                                         |
| alan_take_ledger ★  | Take ledger                   | "Grandfather kept the books. I just sell them. Neither of us ever balanced."                                                                            |
| alan_take_magnifier | Take magnifier                | "For the small print. In this family, it's all small print."                                                                                            |
| alan_look_monster   | Look at sea-monster tile      | "It has a knowing look. It's seen me before eleven, which almost nobody has."                                                                           |
| alan_mag_monster ★  | Magnifier on tile             | "It's holding a bell. Everyone in this city is ringing something except me."                                                                           |
| alan_rui_hello      | First talk to Rui             | "You look like a man who hasn't slept, Inspector. We should swap. I've got plenty."                                                                     |
| alan_rui_locked     | Drownings topic               | "Locked rooms, dry beds, wet lungs. Even my love life makes more sense."                                                                                |
| alan_flirt_cop_1    | First flirt with Teixeira     | "Officer. Do they issue those shoulders with the uniform, or did you bring your own?"                                                                    |
| alan_sketch ★       | Notebook on evidence bag      | "I can't take the evidence, but I can take a likeness. Story of my romantic life."                                                                      |
| alan_founders ★     | Inês names the founders       | "Bell-founders. So that's the family business. And I've been foundering in a bookshop."                                                                 |
| alan_vasco_hello    | Meeting Vasco                 | "Alan Sanches. Bookseller. I promise to step only on the eighteenth century."                                                                           |
| alan_thursday ★     | Vasco's card                  | "I'm very interested in Romans."                                                                                                                        |
| alan_ginjinhas      | Coins on bar                  | "Two ginjinhas. One for courage, one for the courage to drink the first."                                                                               |
| alan_flirt_guitar_1 | First flirt with Duarte       | "That's a beautiful instrument. Twelve strings, and you know exactly where every one of them is."                                                       |
| alan_matches        | Take matches                  | "Eleven times? Practice makes perfect."                                                                                                                 |
| alan_ringer ★       | Amália names him a Sineiro    | "A ringer. I've been called many things, Dona Amália, but never a ringer." **amalia_called**: "Nobody calls you anything, menino. That's your trouble." |

Do not add a joke to alan_list_hand; play it with \[pause\].

### Chapter I card

**narr_ch1_end**: "Alan had a ledger he couldn't read, a song he couldn't forget, and a grandfather who had known everything. It was a quarter past one. The river was due to turn at twenty-five past six, but nobody had told him that yet."

## Chapter II: The Unexplained Drawer

13:30–15:30. Alan learns that this happened in 1955, that his grandfather was there, and that the victims die when the river turns. Rooms: police, shop (Teixeira's visit), lavadouro, ferreira. After the drawer, the lavadouro and Ferreira threads can be played in either order; the chapter closes in the shop once Celeste has been met and shown the file, the tide clock has run, the turnings have been worked out from Rui's Diário and the tide card is in Alan's pocket.

**narr_ch2_card**: "There is a drawer in every city that will not close. In Lisbon it was on the second floor of the Judiciária, and it had been open for forty years."

### II.1 The drawer

Asking Rui about 1955 unlocks the drawer topic (**rui_1955**: "if it's in this building, it's in that drawer."). He points to a filing cabinet whose bottom drawer has stood an inch open since before he joined the force: "Crowbars, carpenters, once a priest. Nothing."

**Puzzle II-A: the drawer.** Goal: open it.

1.  Use the magnifier on the drawer seam. A white crust: sea salt. **alan_salted**: "It isn't swollen. It's salted shut."

2.  Use the last coin on the coffee machine. Take the coffee.

3.  Use the coffee on the seam. The salt melts; the drawer slides open.

Logic: Rui has already said "salt and sand"; hot liquid dissolves salt; the coffee machine is the only liquid in the office. **rui_coffee**: "That was my coffee." **alan_coffee**: "It died for a good cause."

**The 1955 file** (item, a photocopy; "the original stays, the drawer will want it back"). Case 55/114, nine-day fog, November 1955, typed in Portuguese and stamped INEXPLICADO:

- Two drownings. A dockworker in his bed in Alfama. An antiquarian, A. Lacerda, found in the flooded cistern under the Carmo.

- A blue tile in the dockworker's room, same seal.

- Witnesses: J. Sanches, bookseller, 43, "found the second body"; a minor, an altar boy, unnamed; a washerwoman who refused to sign.

- Closed: "unexplained".

**alan_lacerda_name_2**: "A. Lacerda, antiquarian. Found dead in the cistern under the Carmo, the same week. Another name on a list nobody finished reading." (No suspect is named over a surname; the antiques shop stays locked on the map until Ch. III.)

Rui reads the file over Alan's shoulder and gives three things:

- **The times of death**, "the coroner was very precise": Ferreira 03:12, Bastos 15:38, Coutinho 04:01.

- **His mother:** "My mother found a body in fifty-five. She never told me where. She still washes at the lavadouro. Don't tell her I sent you."

- **The Ferreira key**, later: "I'll try to find a way to get you the key." (**rui_key_2**) The way turns out to be Teixeira (II.1a). Until then the workshop shows on the map as "Waiting for the key". (Saves from before the Teixeira flirt get the key from Rui at once, with **rui_key**.)

The map unlocks the lavadouro. Both threads are required.

### II.1a Teixeira's visit

The next time Alan walks into the shop from the street with the drawer open, Officer Teixeira comes in "on patrol. In the fog." (**phone_visit_1**). Inês: "Passing. Through a door with a bell on it." He hands over the Ferreira key first (**teixeira_key_first**: "The Inspector needed someone to bring you this. I... volunteered."), then remembers a book: "On bookcases. Oak ones. Very... solid ones." (**phone_visit_2b**)

The choice: **"Show him the oak monographs."** or **"Just the key, Officer."**

- **Declined:** **teixeira_doorkey** ("Right. The key. Of course. Just the key."), **alan_raincheck** ("Rain check, Officer. I've got a grandfather to avenge."), and he goes.

- **Accepted:** **alan_visit_cop** ("It's upstairs, in my room, with the other... reference works."), **ines_visit_after** ("Discuss things. Of course. I'll mind the shop. Again."). Upstairs in Alan's room, Alan takes the lead: Teixeira backed against the bookshelf, his jacket, his shirt, his belt, then his own handcuffs, in painted pairs and two paintings (**narr_room_cop**; the later one, the two of them in bed and Alan smoking, under **narr_cuff**: "Officer Teixeira found himself handcuffed to the furniture, and began to wonder, quite reasonably, where the key had gone."). Afterwards, dressing: the cuff key turns up in his hat; Teixeira, quietly, "...Keep the key." (**teixeira_keep**); Inês calls up that the station wants its officer (**ines_cuff**); **alan_after_1**: "Ten minutes. Don't go anywhere, Officer." Left alone, to the empty room: "...Regulation." (**phone_after_2**). **narr_fun_1**: "It was fun. It was always fun." Downstairs, Inês: he has been "assisting with a monograph" (**ines_back_cop**).

  An hour later (a painting: Alan out for cigarettes, **narr_key_later**) Alan comes back to find Inês holding the handcuff key: he left it by the till with everything else in his pockets, and she went up and let the officer go (**ines_key_1**, **ines_key_2**). She doesn't judge him (**ines_key_3**: "Who you take upstairs is your business, and I like you exactly as you are.") but she worries (**ines_key_4**: "You deserve someone who stays for breakfast."). He can't look at her: "...It was a prank on a friend, Inês." (**alan_key_deny_3**). Teixeira slips out, mortified (**teixeira_bye**); **alan_teixeira_sorry**: "Sorry, Teixeira. I'm a lot before lunch. Mind the third step." From then on Teixeira is no longer at the station.

In Discreet mode the stairs go dark and the scene picks up at the afterwards. Either way Alan leaves with the key, and the workshop opens on the map.

### II.2 The lavadouro (either order)

Steam, stone basins, wet sheets, two washerwomen at the far basins and a woman pegging washing under the sheets. Celeste won't stop working: "Talk while you twist." Use Alan on the sheet she's wringing (he holds one end, badly; the two of them are one painting) to open the conversation. She knows him at once: "Joaquim's boy. I'd know that chin in a fog." First she talks about Maria Coutinho, her friend, and her boy Zé on the river, and about a gentleman who came asking after the boy the week before Maria died: "Cream linen suit, in this weather. Lovely manners. He said he could wait." **alan_suit**: "Who wears linen in a fog?" **celeste_suit2**: "A man who doesn't expect to get wet." Then the topics:

- **The river:** it breathes four times a day, in and out. "You don't sleep at a turning in a fog. Everybody's grandmother knows that. Nobody's grandson listens." And: "salt is only the sea that forgot to leave. A little fresh water reminds it." (**celeste_salt**)

- **The Lacerdas** (once Inês has the plan): "never let a Lacerda stand godfather to your boat" (**celeste_godfather**); "A tile is a little piece of the font. A door the size of your hand." (**celeste_font**)

- **The tiles** (show the sketch): "That's not a tile. That's a mouthful of the sea, kept in clay. Nothing breaks it but what the bell remembers." Alan: "Its first ding-dong, presumably." "Cheeky. Bronze, menino."

- **1955** (show the file): she was the washerwoman who refused to sign. At dawn on the tenth day she saw Joaquim and a small boy come up out of the Carmo grate, carrying something heavy in sailcloth. "He looked like a man who had left the oven on."

- **Rui:** "Is he eating?" Alan: "Mostly coffee. Less than he used to."

Flags: met_celeste, lore_turnings, lore_bronze, knows_1955_boy.

**The bath (optional).** Once Celeste knows him, and until Ch. IV, Alan can use the big rinsing tank: "Nine days in this fog. I smell like a wet dog that's been reading poetry." (**alan_bath_1**) He strips to his trunks while every woman in the washhouse stares, takes them off behind his jacket and flings them over his shoulder. Celeste shrieks (**celeste_bath_1**: "Ó menino! Put that away! This is a washhouse, not a bathhouse!"); he winks, leaps over the rim and washes waist-deep (**narr_bath**: "Dona Celeste would tell this story at every funeral in the Alfama for the next thirty years. It improved every time."), climbs out, and dresses again behind the jacket. **celeste_bath_2**: "His grandfather did exactly the same thing in nineteen sixty. Same tank." Then the woman under the washing says it loud enough to carry (**laundry_remark**: "Wasted on the girls, though, isn't it?"); Alan looks right at her and says nothing; Celeste shuts her down (**celeste_laundry_enough**: "In this courtyard we wash linen, not other people's business."). **alan_laundry_thanks**: "Thank you, Celeste." The two washerwomen tease him about it afterwards. (Full content only: at her shriek the jacket slips and his hands do the job.)

### II.3 Relojoaria Ferreira (either order)

Police tape, shutters down. Teixeira's key is used on arrival: **alan_ferreira_sealed** ("Rui gave me the key, which makes this a perfectly legal accident."). Inside it's black (**narr_ferreira_dark**: "A clockmaker's shop should not be quiet.").

**Puzzle II-B: light.** Use the matches on the oil lamp on the workbench. Every clock in the shop is stopped at 03:12. **alan_clocks**: "They didn't run down. They stopped. Together."

**Puzzle II-C: the tide clock.**

1.  Read the repair book on the bench. Ferreira's last entries: a tide clock "for myself, because the river is keeping time and I want to see it"; "Lacerda, vitrine lock, spare cut. (He asked twice.)"; and a 1961 note: "All my founder locks share one key-square. Ferreira, Bastos, Coutinho, Sanches. Old habit. Old families." **alan_repair_hint**: the desk key should fit anything he made for us.

2.  The brass tide clock on the bench is unwound, and its winding key is missing. Use Joaquim's desk key on it (Ferreira made the Sanches desk lock). It ticks, and its tide dial swings.

3.  If Alan hasn't yet worked out the turnings: **alan_clock_puzzled** ("Why would a clockmaker care what the river's doing?"); if he has: **alan_clock_agrees** ("Ferreira worked it out too. He just ran out of time."). Either way, **alan_tide_today**: today's turnings are 18:25 and 00:35.

**Puzzle II-E: the clockmaker's lock.** Ferreira's desk drawer has a four-dial lock. Every clock in the shop gives the combination: 0312. **alan_0312**: "The minute he died. The clocks have been telling everyone for days. Nobody asked them." Inside is the tide card, Ferreira's handwritten table of the turnings for the whole fog; Alan pockets it there and then (**alan_tide_card**).

**Free pickup:** the key board by the door has a hook tagged "Antig. L., vitrine (dup.)". Take the vitrine key. **alan_spare**: "Ferreira kept spares of everyone's locks. A clockmaker's revenge."

The workshop leaves the map once the clock has run, the book has been read, and the card and the spare key are taken.

### II.3a Rui's Diário

**Puzzle II-D: the turnings.** Goal: see that the deaths fall on the tide.

1.  Back at the Judiciária, tell Rui about the tide clock (**alan_tell_ferreira**). **rui_paper**: "The tide tables are in the Diário every morning. Mine's on the desk. Take it; I've read the football." The paper lies on the desk behind him, and Alan reaches past him and takes it there and then (**alan_paper**: "Weather, football, and the tides. In that order of importance, apparently."). Before Rui has offered it, Alan won't lift it (**alan_paper_wait**). A save from before the hand-over was moved can ask for it with "Your Diário, Inspector?".

2.  Use the Diário on the notebook. With Rui's times of death and Celeste's river, Alan circles the three deaths on the paper's tide table: every one on a turning. **alan_deduce**: "They don't die at night. They die when the river turns." **alan_turnings_celeste**: "Celeste was right. Celeste is always right, apparently." Flag: turnings_deduced. (Without the times he needs Rui; without the river he needs Celeste.)

While Alan is at the station after the heist, he can also ask about the Sé (**alan_ask_theft**). **rui_withdrawn_2**: the curator came in and withdrew the complaint himself, "'On loan to a scholar,' he says. I didn't ask which scholar." **alan_covered**: "...He covered for me." Flag: knows_withdrawn (used in III.3).

### II.4 The shop

Inês pulls it together: the deaths follow the tide, Joaquim was in that cistern in 1955, and a church that prays without a roof can only be the Carmo (**ines_pull**). She adds a piece of her thesis: the 1755 fog also lasted nine days, and the wave came on the tenth morning. The convent unlocks.

- **ines_tenth**: "Nine days of fog, Alan. Then the tenth morning. I've written forty pages about that morning."

- **alan_tenth**: "Write a forty-first. Make it boring."

### II.5 Alan's lines for this chapter

| Line id              | Trigger                      | Line                                                                                                  |
|----------------------|------------------------------|-------------------------------------------------------------------------------------------------------|
| alan_look_drawer ★   | Look at the drawer           | "Forty years and it still won't close. I own trousers like that."                                     |
| alan_coin_machine    | Coin in coffee machine       | "My last coin, on the inspector's coffee. Most generous thing I've done since 1987."                  |
| alan_read_file       | Read the 1955 file           | "J. Sanches, bookseller. He found a body. \[pause\] He never even told me when he found his glasses." |
| alan_raincheck       | Teixeira's visit, declined   | "Rain check, Officer. I've got a grandfather to avenge."                                              |
| alan_enter_lavadouro | Enter the lavadouro          | "Finally, somewhere in Lisbon wetter than the fog."                                                   |
| alan_wring ★         | Use Alan on the sheet        | "Last thing I twisted was the truth, and it came out cleaner than this."                              |
| alan_breathes ★      | River topic                  | "The river breathes four times a day? I barely manage twice before lunch."                            |
| alan_dingdong ★      | "What does a bell remember?" | "Its first ding-dong, presumably." **celeste_cheeky**: "Cheeky. Bronze, menino."                      |
| alan_enter_ferreira  | Enter the workshop           | "Every clock stopped at the same minute. The only man in Lisbon who died on time."                    |
| alan_lamp_lit        | Matches on oil lamp          | "Let there be light. Or a modest glow, like my career."                                               |
| alan_clock_wound ★   | Key on tide clock            | "It's turning. First thing in this city that's turned on for me in years."                            |
| alan_tide_card       | Take tide card               | "A tide table from a clockmaker. The only man in Lisbon who knew exactly when to come in."            |
| alan_deduce          | Diário on the notebook       | "They don't die at night. They die when the river turns."                                             |

### Chapter II card

**narr_ch2_end**: "He knew when they died. He knew his grandfather had been there before. What he did not know was what Joaquim had carried up out of the dark, or why he had never put it down."

## Chapter III: The Weeping Stone

15:30–17:15. Alan learns what the bell is, decodes the ledger, chooses not to run, learns the founders' order, meets the killer, borrows the tongue's twin from Vasco, and swaps it for the real one. Rooms: convent, se_cloister and se_tower, antiques, se_store (with Vasco), tavern (optional), shop. After decoding, the Sé and the antiques shop can be played in either order. The Sé tower is reached through the cloister.

**narr_ch3_card**: "The Carmo had lost its roof in 1755 and never asked for it back. Some buildings, like some men, prefer to see the sky they are afraid of."

### III.1 The Carmo by day

Tomás is sweeping the nave; a nun lights candles in the side chapel. Dialogue topics:

- **The Carmo:** "God took the roof and left the prayers."

- **The founders:** they cast Lisbon's bells for three hundred years. "Fools twice over, your family. They made the bell, and then they rang it." This is the first time the player hears that a Sanches rang it in 1755. **alan_twice**: "Twice? We were always overachievers."

- **The weeping stone:** "Under the salt. It weeps every fog."

- **The ninth day:** **alan_ninth**: "Today is the ninth day." **tomas_iknow**: "Yes. I know."

- **Joaquim / 1955** (with the file): "Not here. Not in daylight. Ask me at midnight." (**tomas_notyet**) This plants the Ch. V confession.

- **Bells** (with the Brotherhood's charter from the Sé). Alan shows him the charter. **tomas_charter**: "Where did you get this?" **alan_charter**: "A curator gave it to me. Indirectly." Then: "Bells are baptised, Alan. Holy water, a name, godparents. Then they're rung to drive storms away." (**tomas_baptism**) "Your bell was baptised in the sea. It doesn't drive the storm away. It invites it in." (**tomas_reverse**) "The Lacerda priest held it over the font and made the promise in its name... That's why the water answers to them." (**tomas_godparents**) Optional follow-up, **tomas_novena**: nine days of fog is a novena; in 1755 it ended on All Saints' Day, and they rang it to call their dead home. Flag: heard_bells. Until Alan has heard this, the stone waits (**alan_stone_wait**: "Father Tomás knows more about bells than he's telling.").

**Puzzle III-A: the weeping stone.** Goal: read it.

1.  Look at the stone: a thick crust of salt. Scraping fails ("Like scraping a glacier with a library card.").

2.  Use the glass on the holy-water stoup. Tomás, if near: "Blessed water on a cursed stone. Once."

3.  Use the glass of water on the stone. The salt runs off, revealing a ring of carved letters around a bell. The outer ring turns, worn smooth by hands.

4.  Use the magnifier on the stone to read the ring.

5.  Use the ledger on the stone. The cipher wheel UI opens. Turning it 7 times decodes; any other count produces nonsense and an Alan line (**alan_cipher_wrong**: "That isn't Portuguese. That isn't even Polish.").

Logic: Celeste taught that fresh water melts salt (II); the only fresh water in the nave is the stoup; the glass is the only container the player owns. If the lavadouro was skipped, Inês's hint covers it: "Salt comes off with water. Even you know that." The key 7 is in the song.

**The decoded pages** (cutscene: Alan reads, the narrator finishes his sentences, **narr_decode_1**):

1.  Header: THE BROTHERHOOD RANG THE DROWNED BELL. A painting of 1755 (**narr_1755**: "a Sanches hand rang a bell beneath the Carmo, believing it a blessing. The earth answered first. Then the fire. Then the sea.").

2.  **The rite:** "Should the tongue be found, let the last of the bell-hand ring it backward, against the order the founders rang the city: last to first, at a turning of the tide, with his own blood on the bronze."

3.  **Joaquim's page, 1955:** "Afonso Lacerda drowned in his own water. I had the tongue in my hand and the bell before me, and I ran. His boy watched. The Lacerdas are patient. God forgive me, so am I."

Tomás, from the baptism: "At a baptism you renounce. Ring it backward and the bell renounces the sea." (**tomas_renounce**) The back pages of the ledger are stuck together with salt; Alan doesn't notice yet. **alan_surname**: "His boy. He'd be about fifty now. Lisbon is full of Lacerdas. Only one of them sells antiques."

Tomás: "Last to first. The founders cast their bells in an order. Abílio at the Sé knows it better than God does." Then **the midpoint choice**, the way out his grandfather took. **tomas_go_home**: "Give it to the police, Alan. Go home. Your grandfather would have wanted you safe." **alan_choice**: "My grandfather ran. \[pause\] I'm going to the Chiado." The Sé tower and the antiques shop unlock.

### III.2 The Sé bell tower (either order)

The way up is through the cloister. The first time, if Alan has Vasco's Thursday, Vasco climbs out of the pit with something for him: a fragment of Sanches bronze that came up that morning (**vasco_fragment**). **vasco_sleep**: "You look like a man who hasn't slept. Is everything all right?" **alan_fine**: "Never better. I'm on a tour of Lisbon's bell towers. It's a phase." **vasco_thursday_then**: "Thursday, then?" **alan_cameo**: "Thursday." The chained stair is open now; at its foot Alan stops for a long breath (**alan_stair**).

A long climb; dusty light through the louvres; four great bells. Abílio has rung them for sixty years and is almost deaf. **abilio_hello**: "VISITORS! NOBODY CLIMBS UP HERE BUT PIGEONS AND THE TAX MAN!"

**Puzzle III-B: talking to Abílio.** Spoken dialogue gets the answer to the question he thinks he heard ("BORDERS? SPAIN'S THAT WAY."). Use the notebook on Abílio: Alan writes questions, holds them out, and Abílio shouts answers. Topics:

- **The founders' blood:** "EVERY BELL UP HERE HAS A DROP OF ITS FOUNDER IN THE BRONZE. SO IT KNOWS ITS FATHER." / "YOURS HAS FOUR FAMILIES IN IT. ONLY THEIR HANDS CAN MAKE IT TALK." / "LAST TO FIRST. YOU UNPICK A KNOT FROM THE LAST LOOP, NOT THE FIRST." Flag: heard_blood. Follow-up, **the tongue**: "THEY CUT OUT ITS TONGUE AND BLED ON THE STUMP. While their hearts beat, it waits for them."

- **Joaquim:** "THE SANCHES BOY! HE RANG THE TENOR WITH ME IN TWENTY-SIX. WE WERE BOYS. HE HAD HANDS FOR IT. THEN HE WENT TO SELL BOOKS, THE IDIOT."

- **1955:** "THAT NOVEMBER WE DIDN'T RING. JOAQUIM ASKED ME NOT TO. ONLY TIME IN MY LIFE I OBEYED ANYBODY."

- **Ringing backward:** "A BELL RUNG BACKWARD SOUNDS LIKE A BREATH DRAWN IN. YOU'LL KNOW IT WHEN YOU HEAR IT. PRAY YOU DON'T."

- **The order:** "READ THEM YOURSELF, BOY. MY EYES ARE WORSE THAN MY EARS. EVERY BELL HAS ITS FOUNDRY MARK."

**Puzzle III-C: the founder bells.** Use the magnifier on each of the four bells to read its foundry mark and year: Ferreira 1611, Bastos 1648, Coutinho 1702, Sanches 1739. Alan writes them in the notebook automatically. Once all four are read and Abílio has explained the founders' blood (before that: **alan_order_wait**), he says the order: **alan_order**: "Last to first. Sanches, Coutinho, Bastos, Ferreira. \[pause\] Me first. Of course me first."

Flag: founder_order.

### III.3 Antiguidades Lacerda (either order)

Clocks everywhere, all keeping different times. Lacerda in a cream linen suit, all charm. The first sight of him: **alan_suit_recognise**: "Cream linen. In a fog." **lacerda_weather**: "I never get wet, Senhor Sanches. It's a family gift." They have never met; he knows Alan only as Joaquim's grandson, the last Sineiro (**lacerda_hello_2**). Dialogue topics:

- **The clocks:** "I collect time. Other people's."

- **The glass case:** a bronze bell's tongue on velvet: the drowned bell's real tongue, taken from Joaquim's flat ten days ago. "A bell's tongue. Eighteenth century. Not for sale. Some things are only for keeping." He adds: "I would notice a single hair moved on that velvet, Senhor Sanches."

- **Joaquim:** "I knew of him. A careful man. Careful men usually live a long time."

- **The fog:** "I find it restful. Patient weather."

- **His family:** "My family stood godfather to something very old. Godparents are patient. We answer for the child." / "Some people are still waiting for a ship, Senhor Sanches. Two hundred years is not so long, for a widow."

**Looks that matter:**

- **The four clocks on the shelf,** each with a brass tag: "F. 03:12", "B. 15:38", "C. 04:01", and "J.C. 18:25". The first three have stopped; the fourth is running. Alan looks at them automatically when Lacerda says "other people's", so the clue can't be missed. **alan_jc**: "Three of these have stopped. The fourth is waiting. J.C. Not Joaquim; he was a Sanches." Flag: saw_jc_clock.

- **The music box** (needs the photo flag from I.6). Asking Lacerda about it: **alan_recognise**: "I've seen this before. In Amália's photograph, on the wall of the Taberna. Behind my grandfather." Lacerda, too quickly: "A trinket."

**Puzzle III-D: the sketch, the twin and the swap.** Goal: take the tongue without Lacerda noticing. It runs across three places and starts only once Alan has seen the case.

1.  **Antiques: the sketch.** Looking at the case (or using the magnifier or the notebook on it) makes Alan draw it, since he can't touch it. **alan_sketch_tongue**: "A ring at the top, a bob like a drum, a long shank. If I can't touch it, I can draw it. Somebody at the Sé knows every bell's tongue in Lisbon." The drawing goes into the notebook. Flag: tongue_sketched.

2.  **The Sé tower: Abílio reads the sketch.** A new written question, **alan_w_sketch**. Abílio identifies four foundries' work: the drowned bell's tongue (**abilio_sketch**). He explains the twin: "Founders always pour twice... The twin was never blessed and never rung. ONLY THE BELL KNOWS THE DIFFERENCE!" (**abilio_twin**). Then he says where it went: Joaquim brought it up the tower stairs in 1956 and asked where to hide bronze in plain sight. It's in the Sé reserve. "ASK THE CURATOR. HE KEEPS THE KEYS." (all of Abílio's lines are shouted at the same volume) (**abilio_twin_where**). Alan: "Same weight. Same marks. Lacerda would never feel the difference. Only the bell would." (**alan_twin_plan**) Flag: knows_twin.

3.  **The cloister: Vasco.** A new dialogue option, **alan_ask_vasco_twin**: "I've come to ask you for something, and I'm going to do it honestly. It'll be a first."
    - If Alan tricked Vasco over the reserve in Chapter I, he apologises (**alan_vasco_sorry_2**: he took the key while fixing Vasco's shirt; Inês took the papers). Vasco, wry, not surprised at all (**vasco_hook_3**: "...So that's why you were so interested in my buttons."), then: "It was a very good distraction. What do you need?" (**vasco_forgive**) Without the heist, Vasco says **vasco_what** instead.
    - Alan asks for the 1956 clapper without saying why (**alan_vasco_clapper**). Vasco unlocks the reserve and takes him down to the new room, **se_store** (**vasco_come_down**: "Nobody's asked for that box in forty years."). He finds the clapper by its tag, written in Joaquim's hand: "'Clapper. Bronze. Provenance unknown. Deposited nineteen fifty-six.'" (**vasco_tag**). If Rui has told Alan that Vasco withdrew his complaint (flag knows_withdrawn, Chapter II), Alan asks him straight: "Rui told me. You withdrew the complaint." / "Rui talks too much." / "Why?" / \[pause\] "I wanted to see what you'd do with a second chance. Most people waste them." / \[pause\] "I'm trying not to." (alan_vcall_2, vasco_vcall_2, alan_vcall_3, vasco_vcall_3, alan_vcall_4). Then Vasco hands it over: "It's on loan. To a scholar. You'll bring it back. And you'll owe me." Alan, for once without a joke: "I owe you one."
    - The near-kiss over the bronze (pair frame pair_vasco_clapper): "You've got dust on your face." / "Occupational hazard." Vasco steps back: "Not here. Not like this. Not while you're still keeping something from me." Alan, flustered, then honest (**alan_withhold_2**): "I'm not lying to you. I just can't tell you yet. I will. I promise." Vasco: "Thursday, then. Bring the coffee. And the truth." (Without the heist, this is their Thursday too.)
    - Alan doesn't tell Vasco what the twin is for. Back upstairs, alone, **alan_twin_guilt**: "He lent me the only honest thing in that cathedral, and I'm going to leave it with a murderer. I'll make it up to him. Somehow." Flags: twin_lent, vasco_thursday.

4.  **Antiques: the swap.** This is the old theft structure, with the twin in place of the brass weight.
    - Ask about the music box. Alan recognises it (above). Lacerda: "Its key is in the back. One moment. Touch nothing." He exits, and Alan has three actions before he returns.
    - Use the vitrine key (Ferreira's spare) on the case, then the twin on the tongue. **alan_swap_twin**: "One bronze tongue for its twin. Same weight, same marks, same dent in the velvet. Only one of them has ever rung."
    - Lacerda returns, winds the box, and it plays "O Sino Afogado". **lacerda_pale**: "You look pale, Senhor Sanches. Another day, perhaps." He doesn't notice the swap. **alan_slip** as Alan leaves.

Logic: Lacerda himself said he'd notice the velvet, so only something identical will do. Taking the tongue without a swap triggers **lacerda_putback** ("Put it back. Patience is not infinite.") and resets the theft; running out of actions without touching it ends with **lacerda_another** ("A pretty tune. Another time, Senhor Sanches."). The case shows the same tongue before and after the swap, since the two are twins.

Inês's hints follow the same order: look at Lacerda's case, show the sketch to Abílio, ask Vasco, then the swap with the music box as the distraction.

### III.4 The Taberna (optional)

If Alan has seen the music box and the photograph, he can ask Amália about it: "That box was mine. I gave it to Joaquim the day he married. It played our song." **alan_proof**: "Then the man who has it was in Grandfather's flat after he died. Or before." Flag: amalia_box (used in Ch. V and the epilogue). Duarte brings the same message in III.5 in any case, so the flag is always set by Ch. IV.

### III.5 The shop

The chapter closes in the shop once Alan has the tongue and the order. Inês: "You borrowed a museum piece from a man who fancies you, and left it with a murderer. Before tea." Alan, flustered: "He doesn't fancy me. He fancies bronze. I just happened to be standing near some." Inês: "And what did you promise him?" Alan: "Thursday. Coffee. The truth. \[pause\] It's archaeological." She takes the ledger: the back pages are stuck together with salt, and she puts the kettle on to steam them apart. **ines_steam**: "Archivist's trick. I'll steam them apart. Go and wash your face; you look like a man who's seen a clock." **ines_twenty**: "Twenty minutes. Don't touch anything."

**Duarte's visit** (if Alan flirted with him in I.6). While Inês steams the pages, Duarte strolls in: "I was told the best stock in Lisbon is kept in the back." Inês: "Upstairs, actually. He keeps everything upstairs." Business first: Amália sent him; the box with the silver ship was hers, and she gave it to Joaquim the day he married (**duarte_message**; flag amalia_box, always). The choice: **"Show him the piano."** or **"Another time, Duarte."**

- **Declined:** he plays her song on his stool instead (**narr_melody**: "Alan had heard that song all his life without listening to it. He listened now."), shrugs ("Tuesdays, then. The offer stands."), and leaves the words written out on the stool, "For when you're ready to listen properly." (a pick-up: Duarte's lyrics).

- **Accepted:** **alan_visit_guitar** ("He's tuning the... piano. Upstairs. It's very out of tune."); Inês: "People are drowning, Alan." **alan_schedule**: "Not until twenty-five past six. The river keeps a timetable. I checked." Upstairs, the same energy from both sides: jackets, shirts, a race for the belts and the bed, in painted pairs, and a painting (**narr_room_guitar**: "Downstairs, Inês turned the radio up and sold three dictionaries out of spite."). Afterwards, on the floor of Alan's room, Duarte plays him the song he wrote about him, "Meu Lindo Guarda-Livros" ("My Handsome Bookkeeper"), in full, with captions. He gives Alan the lyrics, written out "In English too, for the foreigner in you." **alan_lyrics**: "\[pause\] Nobody's ever written anything out for me." **duarte_lyrics2**: "Then you've been sleeping with the wrong musicians." He calls after Alan for coffee "And a rhyme for 'bookseller'!" (**guitar_after_1**); **narr_fun_2**: "It was fun. He told himself so on the stairs." Inês: "So the piano's in tune now? Strange. We don't own a piano." In Discreet mode the stairs go dark and the scene picks up at the afterwards.

Then the chapter card's Lacerda beat (below). When Alan comes back in with two coffees at the start of Ch. IV, an accepted Duarte is downstairs charming Inês (**guitar_ines_1**: "Menina, I'd write you a fado, but you'd correct my grammar."); a flicker of jealousy; Duarte, who never stays for a scene he didn't start, takes a cup and strolls out ("Friday, menina... And you... Tuesday. Maybe."), and Inês takes the other one.

### III.6 Alan's lines for this chapter

| Line id             | Trigger                                   | Line                                                                                  |
|---------------------|-------------------------------------------|---------------------------------------------------------------------------------------|
| alan_enter_carmo    | Enter the convent                         | "No roof. Father Tomás must love an open plan."                                       |
| alan_twice ★        | "Fools twice over"                        | "Twice? We were always overachievers."                                                |
| alan_charter ★      | Charter shown to Tomás                    | "A curator gave it to me. Indirectly."                                                |
| alan_holy_glass ★   | Glass on stoup                            | "Holy water in a ginjinha glass. Sunday morning and Saturday night in one."           |
| alan_cipher_wrong   | Wheel at any count but 7                  | "That isn't Portuguese. That isn't even Polish." (was alan_wheel_wrong)               |
| alan_page3          | Joaquim's 1955 page                       | "He ran. He always said I got my legs from him. \[pause\]" (no joke after)            |
| alan_choice         | Tomás: "Go home."                         | "My grandfather ran. \[pause\] I'm going to the Chiado." (no joke)                    |
| alan_climb ★        | Enter the Sé tower                        | "If God wanted me in a bell tower, He'd have put in a lift."                          |
| abilio_borders      | First spoken question                     | Alan: "I'm looking for the founders' order!" Abílio: "BORDERS? SPAIN'S THAT WAY."     |
| alan_write_abilio ★ | Notebook on Abílio                        | "Finally, a man who reads what I mean instead of hearing what I say."                 |
| alan_bell_ferreira  | Magnifier, first bell                     | "Ferreira, 1611. Older than my overdraft. Only just."                                 |
| alan_bell_sanches ★ | Magnifier, Sanches bell                   | "Sanches, 1739. The family's last hit."                                               |
| alan_collect ★      | Lacerda: "I collect time."                | "So do I. Mostly as library fines." Lacerda: "Charming."                              |
| alan_look_case ★    | Look at the glass case                    | "A tongue behind glass, untouchable. I've been on dates like that."                   |
| alan_swap_twin      | Twin on tongue                            | "One bronze tongue for its twin. Same weight, same marks, same dent in the velvet. Only one of them has ever rung." |
| alan_slip ★         | Leaving the shop with it                  | "I've just slipped an antiques dealer the tongue, and he didn't feel a thing."        |
| gag_alan_vandal2    | Inês: "You borrowed a museum piece…"      | "He doesn't fancy me. He fancies bronze. I just happened to be standing near some."   |
| alan_schedule       | Inês: "People are drowning, Alan."        | "Not until twenty-five past six. The river keeps a timetable. I checked."             |

### Chapter III card

**narr_ch3_lacerda2**: "At a quarter past five, in a shop in the Chiado, a man looked at a bronze tongue lying on velvet and smiled. It was the wrong tongue. He could wait. He had always been able to wait."

## Chapter IV: The Founders' Blood

17:15–18:25. Alan discovers there is one more founder, that Lacerda already knows, and that he has an hour. Rooms: shop, cais, boat (deck and cabin). The harbour clock advances at each major step (17:40, 18:05, 18:20, 18:25); it is a dramatic clock, not a real-time fail.

**narr_ch4_card**: "Every family keeps a page it doesn't read. The Sanches family had kept theirs for two hundred years, stuck shut with salt."

### IV.1 The shop

If Duarte stayed, Alan comes back in with two coffees and finds him charming Inês (III.5). Inês has steamed the back pages apart. They are the founders' genealogy: four lines traced from 1755, most ending in the nineteenth century, a few kept alive in Joaquim's hand (**ines_genealogy**). The Coutinho entry is the last thing he wrote:

> Maria Coutinho, fishwife, Madragoa. Her son José, no father registered, fisherman, the *Maria Fé*, Cais do Sodré. I have told Maria. I have not told the boy. J.S., 1994.

With saw_jc_clock set: **alan_jc_click**: "J.C. José Coutinho. Lacerda has a clock for him, and it says twenty-five past six." **ines_time**: "It's twenty past five, Alan." If Alan met Celeste in II.2, he adds: "Maria's boy. Celeste washes his sweaters. Zé." Without the clock: **alan_jc_unknown** ("The next turning is twenty-five past six.").

Inês stays to telephone Rui (no answer) and keep reading. **ines_kettle**: "Go. I'll keep ringing Rui, and I'll keep the kettle on." **alan_ledger_with_ines**: "Keep reading. If anybody asks, you never saw this book, and I've never read one." Alan, for once: "Inês. Thank you. For all of it." **ines_worried**: "Now I'm worried." **ines_later**: "There's something here about Lacerda's father. Later." (It pays off in the cistern.) The cais unlocks.

### IV.2 Cais do Sodré

Fog on the water; fishing boats moored three deep; gulls; two old men mending nets; Rosa selling sardines; the harbour clock reads 17:40. Celeste is on the quay with a basket of the fishermen's sweaters (**celeste_quay_hello**: "Menino! Twice in one day. People will talk."). She is Zé's madrinha.

- **Zé:** "He fishes nights and sleeps days, and he bolts the hatch. Nobody wakes Zé before dark. Not even me. Not since his mother."

- **The boat:** the *Maria Fé*, "Outboard, past the Esperança and the Rosa. Mind the gaps; the river likes a joke." Alan crosses the first two boats by their decks (no puzzle; a short walk with a comic wobble, and the clock reads 18:05).

- **How to wake him** (topic unlocks after the knock fails): "Storms don't wake him. Shouting doesn't. Only the boat moving wrong. He feels it in his teeth."

Celeste also answers "What now?" on the quay for the whole chapter. The way off the quay stays shut until the chapter is done.

### IV.3 The *Maria Fé*: waking Zé

The clock reads 18:05.

**Puzzle IV-A: wake Zé.**

1.  Knock on the hatch: snoring (**alan_knock**: "Zé! It's your life calling! He's screening."). Shout: snoring. Look through the porthole: fog on the glass, a shape in a bunk, something blue on the blanket.

2.  Ask Celeste how to wake him (back on the quay). The hint is optional: once he has knocked, Alan can try the line.

3.  Use the mooring line. It's a bowline swollen tight with wet; Alan fails the first time ("I know two knots, and they're both called 'tangled'."). Celeste shouts from the quay: "Pull the tail back through the loop, menino! You want it undone, not your opinion of it!"

4.  Use the mooring line again. The line slips into the river, the stern swings and knocks the next hull. The hatch slams open, and Zé bursts out of it.

Logic: Celeste gives the rule (the boat moving wrong); the only way the player can move the boat is the line; the knot fails once to make the hint feel earned.

### IV.4 Convincing Zé

Zé is furious, unshaven, in mourning. "You've got ten seconds, and then you're in the river." / "Who the hell are you?" **alan_tide_sense**: "A bookseller with a terrible sense of timing and an excellent sense of tide."

**Puzzle IV-B: make him listen.** Talking alone fails: "You're in danger." "From you?" The player must show evidence:

1.  Show the tide card. Zé finds his mother's time: "Four oh one. Right on the turn." **ze_turning**: "She always said don't sleep at the turn. I thought it was a fishwife thing."

2.  That unlocks the tile: "There was a blue thing in my bunk when I came in this morning. I thought it was from her things." / "Down there. Hurry up, before I change my mind." The clock reads 18:20, and he takes Alan down to the cabin.

Showing the 1955 file is optional: the drowned dockworker was his grandfather (**ze_file**).

### IV.5 The cabin: breaking the tile

The cabin is narrow; a photo of Maria is nailed above the bunk. The blanket around the tile is soaked, and the puddle is spreading uphill.

**Puzzle IV-C: break the tile.**

1.  Take the tile. It is heavy and colder than it should be.

2.  Use Zé's hammer (on the bench) on it: it bounces. **alan_hammer**: "It bounced. Like hitting the sea."

3.  Use the tongue on the tile. **alan_ask_tongue**: "Bronze breaks what iron won't. So, Zé. How do you feel about tongues?" Zé: "Just do it." It shatters. One low note rolls out over the river, and the fog shivers.

Logic: Celeste's line in II.2 ("nothing breaks it but what the bell remembers: bronze"); the tongue is the only bronze the player owns; the hammer failing confirms that ordinary tools won't work.

The harbour clock strikes 18:25. The puddle runs back down through the boards. **narr_turn**: "At twenty-five past six the river turned, and for the first time in nine days, nobody drowned."

### IV.6 Zé

A quiet scene. **alan_turned**: "Twenty-five past six. \[pause\] Your mother would have wanted you awake for this." Zé learns his mother knew (**ze_knew**: "She just told me to keep my boots on in a fog."); Alan tells him about the founders in two sentences and a joke (**alan_two_sentences**).

**The romance.** **ze_rom_1**: "That thing took my mother. And a bookseller breaks it with a bell's tongue. Come here." The sweater comes off. **ze_rom_admire**: "I don't get men like you down here, bookseller. The river sends me sardines." Alan hesitates: "Zé... there's someone. Sort of. A man with a trowel, who doesn't know I lie to him." (**alan_rom_hesitate**) Zé steps back and leaves him the door: "Then go home to him. \[beat\] You're still standing here." (**ze_rom_hold_2**) **narr_rom_choice**: "...Then Alan Sanches, who had never once in his life made the first move, made it." From there Zé is in charge (**ze_rom_take**, **ze_rom_2**: "Stop talking, Sanches."): painted pairs, a painting (**narr_rom_1**), a quick tumble onto the bunk (**narr_rom_2**). Then dressing again, Zé back in his braces: "Button your shirt, bookseller. You've still got a bell to ring." / "Yes, Captain." **gag_ze**: "Celeste will ask why you were down here so long." / "Tide tables. Very dense. So many columns." And, to himself: "Thursday. I'll tell him Thursday." (**alan_rom_guilt**). **narr_fun_3**: "It was good. For the first time in his life, good wasn't the same as enough." In Discreet mode the scene goes from the build-up straight to the afterwards.

Zé gives two things:

- **His knife:** "If somebody's going to ring a bell for my mother, take this. You look like a man who'll have to cut something tonight."

- **A sardine,** after Alan mentions Pessoa: "For the cat. Not for you."

**ze_river**: "If you need the river, I'm on it." (Pays off post-credits.) **ze_river_2**: "And if you need me on you again... you know where I moor." **alan_river_2**: "Noted. Strictly for... maritime emergencies."

Back on the quay, the whole quay heard the *Maria Fé*. Celeste, knowing: "The Maria Fé was rocking harder than the river, and the river is flat as a plate." Zé is whistling for the first time since his mother died (**celeste_after_ze**). Rosa makes her dig now (**fish_remark**: "And still no wife, bookseller! My cousin sees you up the Bairro Alto, Thursdays."); the old mender stops her (**mender1_shush**: "Chega, Rosa. Sell your fish. A man's business is his own."), and Alan, quietly: "Obrigado." Celeste: the telephone box has been ringing for him, Inês, twice, frightened (**celeste_hint_phone**).

Alan uses the quay telephone to call the shop. It rings out. **alan_ringout**: "She always answers. She answers when it's for me and I'm standing right next to it." (He won't leave the quay before he has rung: **alan_ring_first**.)

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
| alan_ask_tongue ★ | Before tongue on tile | "Bronze breaks what iron won't. So, Zé. How do you feel about tongues?" Zé: "Just do it."     |
| alan_turned       | After 18:25           | "Twenty-five past six. \[pause\] Your mother would have wanted you awake for this." (no joke) |
| alan_rom_hesitate | Zé: "Look at you."    | "Zé... there's someone. Sort of. A man with a trowel, who doesn't know I lie to him." (no joke) |
| alan_sardine      | Take the sardine      | "Pessoa will finally respect me."                                                             |

### Chapter IV card

**narr_ch4_end**: "The note from the tongue crossed the river and climbed the Chiado and found the man it was meant for. He put down his coffee. He went to fetch his coat. In a bookshop in the Alfama, a kettle boiled dry."

## Chapter V: The Drowned Bell

19:00 to dawn. Inês is taken; Alan goes down into the cistern and does what his grandfather couldn't. Rooms: shop, street (night), tavern (optional), convent_night, cistern.

**narr_ch5_card**: "Night came early, as it does in fog, and found the door of the Livraria Sanches standing open, which it had not done in a hundred years."

### V.1 The shop

The door is open. The room is cold, and a line of salt runs across the floor like a tide mark. The kettle has boiled dry. Inês is gone (**alan_ines_gone**: "Inês? \[pause\]"). Pessoa is on top of the answering machine, which is blinking.

**Puzzle V-A: the cat, again.**

1.  Pessoa won't move ("He's dug in. Nine kilos of no, now with added loyalty."). The lamp trick fails: the machine is warm by itself. **alan_lamp_machine**: "He's learned. The machine is warm by itself. One of us has learned something today." A second try at him gives the hint: "Bribes. He responds to bribes. Like a Lisbon official."

2.  Use the sardine on Pessoa. He jumps down to eat it, and he was lying on the ledger. Inês hid it under the cat before Lacerda came in. **alan_pessoa**: "He was lying on the ledger. She hid it under the cat before he came. Nine kilos of loyalty. Who knew."

3.  Play the machine.

Logic: the player has the sardine from Zé and has already seen that the cat must be bribed off things; the lamp failing first is a joke that also points to the new answer.

**Message 3, Lacerda:** "Senhor Sanches. Your assistant has been reciting dates to me. She mentions a book. Bring it. Bring the tongue, and your blood. Come alone, under the Carmo. The river turns at twenty-five to one." Then, appended: "And bring your grandfather's ledger. The young lady insists." **alan_insists**: "She's still fighting." The machine then replays message 2, the dripping hang-up. **alan_hangup_reveal**: "He rang this morning to see if I was home. He's been patient all day."

**The telephone (required).** The shop door stays shut until Alan has the ledger (**alan_door_ledger**) and has rung Rui (**alan_call_rui_first**: "If I'm going down a hole at midnight, someone should know which hole."). **alan_call_rui**: "Rui. It's Alan. Lacerda has Inês. The Carmo, twenty-five to one." **rui_gate**: "Midnight at the Carmo. I'll be outside the gate. If I go in, it's a police matter, and then it's in a drawer forever." With amalia_box: **alan_box_tell**, **rui_murder**: "Then it's murder. Unexplained, but murder." **alan_obituary**: "If I'm not out by dawn, Rui, the obituary says 'witty'. Not 'lazy'. 'Witty'." Flag: rui_called.

**The other call** (with Vasco's card and the Thursday date). Before he goes, Alan rings Dr. Teles (**alan_call_vasco_first**: "Not yet. There's one more call I owe."). He may not come back, and he wants to hear Vasco's voice; he doesn't say so. "I'm going out tonight. There's something I have to finish." / "You sound like a man saying goodbye." / "Just talk to me for a minute. About anything. The Romans." / "The floor's still down there. Two thousand years, and it hasn't moved. It will be there on Thursday." / "Thursday." / "Then come back for it." He calls him Alan for the first time (**vasco_vcall_5**: "Be careful, Alan."), and hangs up first; Alan stays on the line a moment. Flag: vasco_called.

### V.2 The Taberna (optional)

The chairs are up on the tables; one lantern burns. Amália is alone, singing to an empty room (**narr_tavern_night**, **amalia_night_sing**: "Come back, come back, my bell-boy, and ring it backward with this song."). She doesn't stop when he comes in. Afterwards: **amalia_alone**: "Joaquim ran because he was alone down there. You are not alone, menino. Somebody is waiting for you, which is more than he ever had." **alan_amalia_thanks**: "That's the nicest thing anyone's said to me all week. Which tells you about my week." Flag: amalia_night.

### V.3 The Carmo at midnight

Moonlight in the roofless nave. The grate stands open, and green light comes up from below. Tomás is waiting with a lantern (**tomas_night_hello**: "I have been waiting for you longer than you have been alive."). Rui is at the gate, smoking.

**Tomás's confession** (the payoff for "Yes. I know."), over three sepia paintings: the 1955 cistern, Joaquim with the boy, Joaquim carrying him up the steps.

- **tomas_boy**: "I was eleven. I held his lantern. The water came up to my knees, and he had the tongue in one hand and the bell in front of him."

- **tomas_ran**: "He didn't run from the bell, Alan. He picked me up and ran. He was ashamed of it for forty years, and he was wrong to be."

- **tomas_count**: "I have counted every fog since. I knew which day this was before you did."

- **tomas_1955_water**: "Afonso Lacerda spoke to the water the way you'd speak to a dog. It came when he called."

**alan_thanks**: "\[pause\] Thank you, Father." He gives Alan the lantern: **tomas_lantern**: "Take the lantern. Hold it higher than he did." Then: "go and find whoever you were thinking of on those steps. God is less particular than His Church." (**gag_tomas**) He kneels to pray. Rui: **rui_nothing**: "I didn't see you go in." (Talk to him and he passes on a question from Teixeira first: **gag_rui**.)

At the grate, with the Thursday date: **narr_descent**: "He thought of a man standing in a pit full of his family's bronze, and found he wanted very much to come back up." Without the lantern Alan won't go down (**alan_need_lantern**).

### V.4 The cistern

Stone steps end on a ledge above black-green water. The Drowned Bell hangs on a rusted chain over the water, reachable along a narrow stone walkway out to its platform; it is carved with four waves. Inês is tied to a pillar on the ledge. Lacerda, in an old brotherhood robe, stands where the steps go down into the water. Six chiselled tide marks on the pillar, numbered I to VI, are the on-screen meter.

**The confrontation** (cutscene, then player control):

- **lacerda_joaquim**: "A single drop of seawater, on the heart. He said your name. I thought that was touching." **alan_fin_angry**: "You killed him."

- **lacerda_spared_2**: "The last Sineiro, and you never once came asking about bells. So I left you alone. I was grateful."

- **lacerda_ze**: "You broke my tile. Clumsy. No matter. Maria knew, so I assumed the son did. One cannot be too careful."

- **lacerda_demand**: "Joaquim's book first. Then cut your hand, wet the bronze, and ring, and she walks out of here. Patient, Senhor Sanches. I have been patient for forty years."

- **lacerda_font**, **lacerda_interrupted**: the water has answered to his name since his ancestor held the bell over the font; the founders cut its tongue in the middle of a sentence, and the sea is still waiting to finish it.

- **lacerda_father**: "The sea has my father, Senhor Sanches. I watched it take him. The bell can ask for him back." **alan_father**: "\[pause\] Mine's gone too, Vicente. That's exactly why I'm not ringing it your way."

- **ines_warn**: "Alan, the water rises every time that bell rings! Don't ring it his way!" **lacerda_quiet**: "Quiet, my dear."

**The rule in this room:** while Lacerda is watching, he commands the water.

- Laying a hand on him (taking him, the tongue or the knife on him): **lacerda_death** ("I said I am patient. I never said I was slow."), the water takes Alan, and **narr_death**. Game over; the scene restarts at the top of the steps with inventory intact.

- Cutting Inês's ropes while watched: Alan won't (**alan_cut_watched**: "Not while he's watching. The water listens to him.").

- Striking the bell before he has the ledger: **lacerda_ledger_first** ("The ledger first, Senhor Sanches. I should like to read along.").

- Talking to him while watched: **lacerda_patient** ("Patient.").

**Puzzle V-B: the rite.** Five steps, each drawing on a different chapter.

1.  **Distract him (ledger, Ch. I).** Inês: "Give him the ledger, Alan. The last page. He's waited forty years for it." (**ines_page**) On it, in Joaquim's hand: "Afonso Lacerda's last words, as the water rose, were for his son: 'Vicente, let it go.' J. S." Give the ledger to Lacerda: **alan_offer**: "You want the founders? Here. Every line you missed. Two hundred years. In my grandfather's hand." **lacerda_cant**: "Cipher. Of course. Joaquim, you careful old man." **alan_seven**: "The rite's in cipher. The founders' names aren't. Start at the back." Lacerda kneels on the drowned step with his torch, reading, his back to the bell (**lacerda_ledger**, **lacerda_read_1**). He is a collector before he is a killer.

2.  **Free Inês (knife, Ch. IV).** **alan_ask_lamp**: "I can't strike what I can't see, and I need both hands. Let her hold the lantern." **lacerda_lamp_ok**, not looking up: "By all means. Cut her loose. The water answers to me, Senhor Sanches. Where would she go?" Use the knife on the ropes. **ines_free**: "You took your time." **alan_cat**: "I had a cat to bribe."

3.  **Light the bell (lantern, Ch. V).** Give the lantern to Inês. She takes it out along the walkway and holds it up (**ines_lantern**: "I've got it. Go on, Alan. Ring."); the four foundry marks appear in the carved waves (**narr_bell_lit**). Without the light, using the bell gives "Too dark, and I need both hands."

4.  **Blood on the bronze (rite, Ch. III).** Use the knife on Alan (or on the tongue). **ines_no**: "Alan..." **alan_papercut**: "Paper cut. I've had worse from Camões." The tongue is now wet; its icon and name change ("Bell tongue (blooded)").

5.  **Ring it backward (order, Ch. III).** Use the tongue on the four marks: Sanches, Coutinho, Bastos, Ferreira. Alan walks out to the bell's platform to strike.

**The water meter during step 5.** The first correct strike makes a sound like a breath drawn in (**alan_strike_1**: "Last to first, Grandfather."). Lacerda assumes the founding order and hears what he wants to hear: "Good. I can feel it in the stone." / "Yes... yes. The river is listening." / "One more, Senhor Sanches. One more, and it is mine."

| Event                                                                    | Waterline                                                       |
|--------------------------------------------------------------------------|-----------------------------------------------------------------|
| Each of the first three correct strikes                                  | +1                                                              |
| A wrong strike (the bell rings forward; the city's bells answer faintly) | +2 (**alan_wrong_strike**: "Wrong number." **lacerda_lovely**: "Lovely. Again.") |
| Six marks reached                                                        | The water takes Alan; restart from step 5 with steps 1–4 kept   |

A clean rite costs three marks, so the player can make exactly one mistake. Inês calls out the next step if the player hesitates for 20 seconds (hint, not an answer: "Last to first, Alan. Who came last?").

**The silence.** **alan_ringback**: "I never rang anyone back in my life, Grandfather. Let's start with you." On the fourth strike the bell un-rings (**narr_ring**): the sound is pulled backward out of the air. **lacerda_realise**: "That was... backward. You rang it backward. All of it!" He doesn't fight it. He goes back to the ledger. **narr_renounce**: "The bell renounced the sea. And the sea, like any creditor, went looking for the man who had signed for the debt." The water rises around Lacerda alone, to his knees, his chest, his mouth, and he goes under with the ledger in his hands (**narr_end_1**). **narr_reading**: "He didn't fight the water. He was still reading." The fog is drawn down the steps like a breath, and the water stops obeying (**narr_silence**); five seconds of nothing, then the theme.

**narr_still**: "The water goes still, and clear. The bell hangs silent, tongueless again. The tongue lies on the ledge, cold at last. Alan pockets it anyway. Old habit." **ines_end**: "Alan... the fog. Can you feel it? It's lifting." **alan_end**: "Come on. Let's go and see what the city looks like." On the way up she asks why he smells of tar and a fisherman's sweater (**gag_ines_2**).

### V.5 Up into the tenth morning

The end-of-chapter paintings, then Alan and Inês in the nave under a sky without fog. Tomás is on his knees and doesn't get up. **alan_dawn**: "The tenth morning. The first one I've seen before eleven in years." The epilogue follows.

### V.6 Alan's lines for this chapter

Chapter V is darker, so the jokes get shorter and braver: he jokes because he is frightened, and the player should feel that.

| Line id           | Trigger                   | Line                                                                                                          |
|-------------------|---------------------------|---------------------------------------------------------------------------------------------------------------|
| alan_ines_gone    | Entering the empty shop   | "Inês? \[pause\]" (no joke)                                                                                   |
| alan_queue ★      | After "Bring your blood"  | "He wants my blood. He'll have to queue behind my landlord."                                                  |
| alan_alone        | After "Come alone"        | "Come alone. Finally, something I'm qualified for."                                                           |
| alan_obituary     | Calling Rui               | "If I'm not out by dawn, Rui, the obituary says 'witty'. Not 'lazy'. 'Witty'."                                |
| alan_fcall_4      | Calling Vasco             | "Just talk to me for a minute. About anything. The Romans." (no joke)                                         |
| alan_thanks       | After Tomás's confession  | "\[pause\] Thank you, Father." (no joke)                                                                      |
| alan_descend ★    | Going down the steps      | "'Stay away from water,' he said. Midnight, a flooded church basement, a dead man's bell. Rui will be livid." |
| alan_father       | Lacerda's father          | "\[pause\] Mine's gone too, Vicente. That's exactly why I'm not ringing it your way." (no joke; replaces alan_glacier) |
| alan_ringback     | Fourth strike             | "I never rang anyone back in my life, Grandfather. Let's start with you."                                     |
| alan_wrong_strike | Wrong strike              | "Wrong number." (callback to alan_hangup)                                                                     |
| alan_dawn ★       | Climbing out              | "The tenth morning. The first one I've seen before eleven in years."                                          |

The epilogue phone call has no joke at all.

## Endings

There is one ending. Optional scenes add short epilogue vignettes; none of them changes what happened.

### Epilogue (always)

A sequence of paintings with narration, the morning of the tenth day, each dipping to black and opening on the next:

1.  **The city.** Fog gone; trams running; nobody drowned. **narr_epilogue**: "...Nobody drowned. Nobody noticed. Which, Alan decided, was exactly how it should be."

2.  **The Judiciária.** Rui files case 95/203 as "unexplained" on top of 55/114, and pushes the drawer. For the first time in forty years, it closes. **rui_click**: "Huh."

3.  **The shop.** The bronze tongue sits on the bookbinding press, holding down the Camões nobody bought. "It was only visiting. It had an appointment at the Sé, on Thursday." Inês is writing page forty-one (**narr_epi_shop2**).

4.  **The telephone** (after the vignettes and the post-credits pictures, below). Alan opens his notebook to the number he was afraid to call. **narr_call**: "His mother answered on the second ring. He said, 'Mãe, it's me,' and then, for once, he didn't make a joke."

### Optional vignettes

Played after still 3 if their flags are set. The order in the build: the city, the Judiciária, the shop, the box, the full Taberna, the quay, Zé's net (post-credits), Abílio's bells, the fifth clock (post-credits), the phone call, Thursday.

| Flag                               | Vignette                                                                                                                           |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| amalia_box (with rui_called)       | Rui returns the music box to Amália "from the estate of an unknown person". She winds it and doesn't sing along.                   |
| amalia_night                       | That evening the Taberna is full, and for the first time in her life Amália sings "O Sino Afogado" to a full room. Alan buys the ginjinhas. |
| ze_saved (always set)              | Celeste on the quay, handing Zé a clean sweater, and asking, very innocently, whether the bookseller would be needing his boat rocked again. Zé goes the colour of a boiled prawn, and does not say no. |
| founder_order with no wrong strike | At noon Abílio rings the Sé bells "for no reason at all", and the whole Alfama hears a city that is very much awake.                |

### Thursday (if Alan made the Thursday date with Vasco)

After the phone call, the last scene of the game: Thursday morning in the cloister, two coffees. "I came for the Romans." / "They're closed till ten." / "Then I'll wait." / "I owe you some documents." / "They're on loan." The two of them sit on the pit ladder while the Sé strikes nine (**narr_thursday**: "Alan Sanches, who had never waited for anything in his life, sat down in the hole where his family used to make bells, and waited."). If Vasco lent Alan the twin (twin_lent), Alan pays the debt with the truth, no jokes: **alan_thu_truth** (the key off the lanyard, the papers, the bell, the man in the Chiado; Vasco's clapper is in Lacerda's glass case). Vasco: "...You put a museum piece in a murderer's shop." Alan gives him the real tongue instead: "The one that rang. It's only bronze now." Vasco: "Clapper. Bronze. Provenance... known. I've never been able to write that before." Alan: "I still owe you one." Vasco: "Then come downstairs. The reserve is quiet before ten." Without the twin, the waiting is the ending.

**The last romance (S.vascoLove, the reserve, se_store).** The shelves where they nearly kissed in Chapter III: "This is where I nearly kissed you. You were keeping something from me." / "I'm not keeping anything now." / "I know. You haven't made a single joke since the coffee. I've been counting." The painted pair kissing; Alan pulls Vasco's tie loose ("I've wanted to do that since the pit." / "It's a museum tie. It's catalogued."); the shirtless pair ("The Romans can wait." / "They've waited sixteen hundred years. They're professionals."). Then, as in every romance in the game, a painting and a fade: **still_store_kiss** with **narr_store** ("Upstairs, the Sé struck ten... Nobody came down to the reserve. Nobody ever does."), and the afterwards, played in the room rather than as a still (the painted pair **pair_vasco_after**: the two of them on the reserve floor, sitting against the shelves, shirts open, laughing, the clapper between them; no crate): "I'm going to have to catalogue this." / "Provenance known." / "And him. Back on his shelf by Monday. Nobody will ever know he left." (Vasco nudging the clapper with his boot) / "I'll know." / "Thursday?" / "Every Thursday." (vasco_after_1, alan_after_v, vasco_after_3, alan_after_know, vasco_after_2, alan_after_every). The narrator closes it over the scene (**narr_fun_4**): "It wasn't fun... for once in his life he didn't go looking for one." Then the fade. Discreet mode goes from the kiss straight to the afterwards, in the dark. Nothing is explicit. The ending card follows.

### Post-credits

These two pictures play in silence before the phone call, among the vignettes (see the order above).

Dawn on the Tagus. Zé hauls in his net and finds a cream linen jacket tangled in it, heavy with water and empty. He looks at it for a long time. **ze_back**: "\[pause\] Not mine to keep. Tell Alan he left it on my bunk. He can come and fetch it himself."

Cut to Antiguidades Lacerda, shuttered. On the shelf, the clock tagged "J.C. 18:25" has stopped at 18:25. Beside it, a clock nobody has wound starts to tick (**narr_post**). Its tag is face-down.

This hook seeds the sequel (the Brotherhood was never only the Lacerdas) without contradicting the ending: the bell beneath Lisbon is silenced forever.

## Items

Twenty-six items in the build (the brass weight is gone). Every item from the v2 plan has at least one required use; the keepsakes (the fragment, Duarte's lyrics) have none. Items are removed from inventory after their last use.

| Item             | Found (ch., room)                   | Used on (ch., room)                                                                                    | Removed after    |
|------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------|------------------|
| Notebook         | Start                               | Evidence bag, sketch (I, police); Abílio (III, se_tower); the Diário (II); holds the founder order, the lore notes and the phone numbers | Never |
| Sketch of the tile | Notebook on the evidence bag (I, police) | Inês (I, shop); Celeste (II, lavadouro)                                                           | Never            |
| Coins ×3         | Register (I, shop)                  | Bar, 2 ginjinhas (I, tavern); coffee machine (II, police)                                              | Last coin spent  |
| Desk key         | Sugar tin (I, shop)                 | Grandfather's desk (I, shop); tide clock (II, ferreira)                                                | Tide clock       |
| Ledger           | Desk (I, shop)                      | Weeping stone (III, convent); Inês (III, shop, auto); Lacerda (V, cistern)                             | Given to Inês (III), back from under Pessoa (V), given to Lacerda |
| Magnifier        | Grandfather's desk (I, shop)        | Sea-monster tile (I, opt.); drawer seam (II, police); weeping stone (III); four bells (III, se_tower)  | Never            |
| Brass weight     | (removed from the game)             | (the twin replaced it in the swap)                                                                     | —                |
| Reserve key      | Vasco's lanyard (I, se_cloister)    | Thrown to Inês (I, se_cloister)                                                                        | The throw        |
| Charter of the Brotherhood | Inês (I, se_museum)       | Tomás (III, convent)                                                                                   | Never            |
| Dr. Teles's card | Vasco (I, se_cloister)              | Shop telephone (V, shop)                                                                               | Never            |
| Ginjinha ×2      | Bar (I, tavern)                     | Amália, one each (I, tavern)                                                                           | The toast        |
| Matches          | On the bar (I, tavern)              | Oil lamp (II, ferreira)                                                                                | Oil lamp         |
| Glass            | After the song (I, tavern)          | Holy-water stoup, then weeping stone (III, convent)                                                    | Weeping stone    |
| Coffee           | Machine (II, police)                | Drawer seam (II, police)                                                                               | Drawer           |
| 1955 file        | Drawer (II, police)                 | Celeste (II, lavadouro); Tomás (III, opt.); Zé (IV, opt.)                                              | Never            |
| Ferreira key     | Teixeira (II, shop)                 | Workshop door (II, ferreira, automatic)                                                                | Door             |
| Diário de Notícias | Rui's desk, once he offers it (II, police) | Notebook (II, the deduction)                                                                | Never            |
| Tide card        | Ferreira's desk drawer, lock 0312 (II, ferreira) | Zé (IV, boat)                                                                             | Never            |
| Vitrine key      | Key board (II, ferreira)            | Glass case (III, antiques)                                                                             | Never            |
| Fragment of Sanches bronze | Vasco (III, se_cloister)  | (a keepsake)                                                                                           | Never            |
| Bell tongue (the twin) | Vasco (III, se_store)         | Glass case swap (III, antiques)                                                                        | Swap             |
| Duarte's lyrics  | Duarte (III, shop: upstairs, or left on his stool) | (read only)                                                                             | Never            |
| Tongue (clapper) | Glass case (III, antiques)          | Zé's tile (IV, boat); four marks on the bell (V, cistern)                                              | End of game      |
| Blue tile        | Zé's bunk (IV, cabin)               | Hammer (fails), tongue (IV, cabin)                                                                     | Shattered        |
| Knife            | Zé (IV, cabin)                      | Inês's ropes; Alan's hand (V, cistern)                                                                 | End of game      |
| Sardine          | Zé (IV, cabin)                      | Pessoa (V, shop)                                                                                       | Pessoa           |
| Lantern          | Tomás (V, convent_night)            | Inês (V, cistern)                                                                                      | Given to Inês    |

**Red herrings by design:** Zé's hammer (fails on the tile, to confirm that only bronze works) and the banker's lamp in Ch. V (fails on Pessoa, to point to the sardine). Both give a specific line, never a generic "I can't do that".

## Flags and gates

Story state stays as plain flags on F(). The table lists the story flags in the order they are normally set, what sets them and what they open. Chapter transitions are gates: a chapter ends only when all of its required flags are set.

| Flag               | Set by                                                 | Gates or changes                                        |
|--------------------|--------------------------------------------------------|---------------------------------------------------------|
| heard_machine      | Playing the machine (I.2)                              | Shop door; police on map                                |
| got_ledger         | Taking the ledger from the open drawer (I.2)           | Weeping stone use (III); the tide clock (II)            |
| saw_list           | List topic with Rui (I.4)                              | Rui leaves; Inês names the founders (I.5)               |
| rui_out            | Rui leaves for the coroner (I.4)                       | Teixeira guards the bag                                 |
| teixeira_wall      | Third flirt with Teixeira (I.4)                        | The sketch can be made                                  |
| sketched_tile      | Notebook on evidence bag (I.4)                         | Inês's seal scene (I.5); Rui walks back in              |
| flirted_cop        | Rui catches Alan and Teixeira (I.4)                    | Teixeira's visit (II.1a)                                |
| knows_brotherhood, ines_plan | Inês scene (I.5)                             | Sé museum on map; Inês goes to the Sé                   |
| se_exhibits, se_plan_on | The two required exhibits (I.5a)                  | Questions for Vasco                                     |
| dig_questions      | Three questions about the pit (I.5a)                   | Into the pit                                            |
| lanyard_taken      | Fixing Vasco's shirt (I.5a)                            | The inscription and the throw                           |
| key_tossed         | A clean throw (I.5a)                                   | Inês in the reserve; the four exchanges                 |
| heist_done, vasco_thursday | The key back on its clip, the card (I.5a)      | The charter; Thursday (epilogue); Vasco's cameo (III); the Ch. V call |
| reserve_raided     | Inês reads the register (I.5b)                         | Tavern door                                             |
| saw_photo          | The photograph, or the Joaquim topic (I.6)             | Song topic; music box recognition (III.3)               |
| askedSong          | Asking Amália for the song (I.6)                       | Duarte will flirt                                       |
| duarte_flirt, flirted_guitar | The guitar lesson (I.6)                      | The song; Duarte's visit (III.5)                        |
| heard_song         | Toast with Amália (I.6)                                | **End of Ch. I**                                        |
| askedDrawer        | 1955 topic with Rui (II.1)                             | Coffee machine                                          |
| salt_seen          | Magnifier on the seam (II.1)                           | Coffee on the seam                                      |
| drawer_open        | Coffee on the seam (II.1)                              | Lavadouro on map; Teixeira's visit; the file            |
| deaths_known       | Rui reads the file (II.1)                              | The deduction (II.3a)                                   |
| visit_cop          | Teixeira's visit (II.1a)                               | Ferreira key in hand; workshop on map                   |
| teixeira_scene     | Accepting at Teixeira's visit (II.1a)                  | Teixeira gone from the station; gossip                  |
| met_celeste        | Wringing the sheet (II.2)                              | Topics; the bath                                        |
| lore_turnings, lore_bronze, knows_1955_boy | Celeste's topics (II.2)        | The deduction; Ch. II gate                              |
| bathed             | The bath (II.2, optional)                              | The washerwomen's teasing; laundry remark               |
| ferreira_lit       | Matches on the oil lamp (II.3)                         | Workshop hotspots; telling Rui (II.3a)                  |
| tide_wound, tide_known | Desk key on the tide clock (II.3)                  | Ch. II gate                                             |
| drawer_unlocked    | 0312 on Ferreira's desk lock (II.3)                    | Tide card                                               |
| ferreira_told      | Telling Rui about the tide clock (II.3a)               | The Diário                                              |
| paper_taken        | Taking the Diário (II.3a)                              | The deduction                                           |
| turnings_deduced   | Diário on the notebook (II.3a)                         | Ch. II gate                                             |
| knows_withdrawn    | Asking Rui about the Sé (II.3a)                        | The straight question to Vasco (III.3)                  |
| ch2_ready, ch2_done | met_celeste + tide_known + knows_1955_boy + turnings_deduced + tide card | **End of Ch. II** (in the shop); convent on map |
| charter_shown, heard_bells | Charter to Tomás, the bells topic (III.1)      | The stone; the order (III.2)                            |
| decoded            | Cipher wheel at 7 (III.1)                              | The rite; the midpoint                                  |
| chose_chiado       | "I'm going to the Chiado." (III.1)                     | Antiques and se_tower on map                            |
| vasco_cameo        | Vasco's fragment in the cloister (III.2)               | The stair to the tower                                  |
| heard_blood        | Abílio on the founders' blood (III.2)                  | The order                                               |
| founder_order      | All four bells read, after heard_blood (III.2)         | Finale step 5; Abílio vignette                          |
| saw_jc_clock       | Clocks topic with Lacerda (III.3, plays automatically) | alan_jc_click (IV.1)                                    |
| tongue_sketched    | Looking at the case (III.3)                            | Abílio reads the sketch                                 |
| knows_twin         | Abílio on the twin (III.3)                             | Asking Vasco                                            |
| twin_lent          | Vasco in the reserve (III.3)                           | The swap; Thursday's debt                               |
| amalia_box         | Amália's box topic (III.4) or Duarte's message (III.5) | rui_murder (V.1); epilogue vignette                     |
| has_tongue, twin_swapped | Successful swap (III.3)                          | **End of Ch. III** (with founder_order)                 |
| ch3_done, steaming | Back at the shop (III.5)                               | Duarte's visit                                          |
| visit_guitar, duarte_scene | Duarte's visit; accepting it (III.5)           | Duarte gone from the tavern; Duarte and Inês (IV.1)     |
| genealogy_read     | Inês's steamed pages (IV.1)                            | Cais on map                                             |
| knocked, wake_rule | Knocking; Celeste's rule (IV.2–3)                      | The mooring line                                        |
| ze_awake           | Mooring line, second try (IV.3)                        | Zé conversation                                         |
| ze_believes        | Tide card shown to Zé (IV.4)                           | The cabin                                               |
| ze_saved           | Tongue on tile (IV.5)                                  | Zé's romance, knife and sardine                         |
| ze_romance         | The cabin (IV.6)                                       | Rosa's dig on the quay                                  |
| ch4_done           | The quay telephone (IV.6)                              | **End of Ch. IV**                                       |
| ledger_found       | Sardine on Pessoa (V.1)                                | Message 3                                               |
| heard_msg3         | Message 3 (V.1)                                        | The telephone                                           |
| rui_called         | Phone call to Rui (V.1)                                | Shop door; convent_night on map; Rui at the gate (V.3); box vignette |
| vasco_called       | Phone call to Vasco (V.1, with the card)               | Shop door                                               |
| amalia_night       | Night visit (V.2, optional)                            | Epilogue vignette                                       |
| confessed, has_lantern | Tomás's confession (V.3)                           | The grate                                               |
| lacerda_distracted | Ledger given (V.4 step 1)                              | Safe to free Inês and strike the bell                   |
| ines_free          | Knife on ropes (step 2)                                | Lantern can be given                                    |
| bell_lit           | Lantern to Inês (step 3)                               | Marks visible                                           |
| blood              | Knife on Alan (step 4)                                 | Strikes count                                           |
| struck, strikes, water | Bell strikes (step 5)                              | Success on the fourth correct strike; restart at water 6 |
| struck_wrong       | Any wrong strike                                       | No Abílio vignette                                      |
| won, dawn          | The silence; up into the morning (V.4–5)               | Epilogue                                                |
| thursday, vasco_love | Thursday; the reserve (epilogue)                     | Ending card                                             |

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
| shop          | Existing; verify props | **register, sugar tin, Grandfather's desk, banker's lamp, bookbinding press, magnifier on the desk, answering machine, telephone, radiator**, counter, big window | street        | Ch. V night: door open, salt tide line on floor, kettle on its side, lamp only, cold blue grade |
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
| cs_dawn     | convent       | Climb into a clear sky; Tomás praying (Rui and his coffees are not in the build)                                      |
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
| Ch. II threads open    | "You've got a key to a dead man's shop and a policeman's mother. Pick one."                                  |
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

- Today is the ninth day, Tuesday 31 October 1995 (fog day 1 was Monday 23). The rite happens at the 00:35 turning, just into Wednesday 1 November; the fog lifts at the tenth dawn, All Saints' Day.

- Today's turnings: 18:25 (Zé) and 00:35 (the rite). Deaths: Ferreira 03:12 (day 2, Tue 24), Bastos 15:38 (day 5, Fri 27), Maria Coutinho 04:01 (day 8, Mon 30), each on a turning.

- The key is 7. The plaintext header is THE BROTHERHOOD RANG THE DROWNED BELL; the rite and Joaquim's page are separate decoded pages.

- The family name is spelled the Portuguese way, Sanches, everywhere: the shop sign, the foundry marks on the bells, the case files.

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
| Theft by distraction only                       | Theft needs the vitrine key and the twin swap                           | Antiques hotspots             |
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
4. **The magnifier** lies on Grandfather's desk, beside the sleeping cat (it was on the window shelf; the desk has its own painted state without it). The shop painting was redone without the sleeping cat on the sill, and with the bookbinding press, radiator and telephone added.
5. **The ledger in Chapter IV–V.** Inês keeps the ledger at the shop to go on reading the genealogy. That is why it is in the shop, hidden under Pessoa, at the start of Chapter V.
6. **The 1955 file is a photocopy.** "The original stays; the drawer will want it back."
7. **The Ferreira door.** The workshop key is used automatically when Alan arrives (map pin) and the room opens dark from the inside; the dark state hides every hotspot except the oil lamp.
8. **Failed uses.** Every required item has specific lines for the plausible hotspots in its own room; everything else falls back to the shared pool of ten (`alan_fail_01`…`alan_fail_10`) plus character-specific refusals.
9. **Ambient NPCs whose bible positions land on bare wall or open floor** (police officers, the bench man, the sueca players, the couple, the guitarist, the net menders and the fish seller) are painted together with their own furniture (desk, bench, table, stool, crates), so they sit correctly in the light without repainting the rooms.
10. **Amália's song.** The three verses are sung by Amália's voice (ElevenLabs v4, singing direction) over the game's procedural guitarra, since no music model is available. Only the key verse is subtitled in full.
11. **Alan's look.** The existing painted Alan (stubble, leather jacket) is kept for consistency across all of his frames.
12. **Room states.** Night and empty variants (shop Ch. V, tavern Ch. V) are separate paintings; small state changes (taken objects, the washed stone, the open drawer, the bare velvet in the case, the tile on the bunk) are layers cut from clean plates; the rising water and the lit foundry marks in the cistern are drawn by the engine so they can animate.
13. **Laundry in the street** barely moves ("hanging dead still"), with only the faintest sway so the street never looks frozen.
14. **The theft counter.** While Lacerda is in the back room, each interaction with a hotspot counts as an action (walking doesn't). After three actions he returns (at once, once the swap is made). If Alan has lifted the tongue without swapping it he says `lacerda_putback`; if he hasn't touched it, `lacerda_another`. Either way everything resets, and the player can ask about the box again.
15. **Content: Full or Discreet.** Asked once, before the first new game, and changeable from the menu at any time. Discreet goes from each romantic build-up straight to its afterwards and hides those paintings; every joke and every clue stays.
16. **The gossip.** Everyone who saw Alan with Teixeira or Duarte (Inês, Celeste, Amália, Rui), and later the Sé's bell-ringer and the Carmo's priest about the curator, makes one remark per conversation, in order, each once; Alan denies everything, flustered.
17. **Rui's Diário** lies on the papers on Rui's desk, behind where he stands. Alan takes it the moment Rui offers it, reaching past him; a save from before that change can ask for it ("Your Diário, Inspector?").
18. **Alan's idle cigarette.** Twenty seconds without input and he lights up; never in a church (the Sé, the Carmo) and never mid-scene.


---

> **Reference for writing dialogue and story (supplied by the author, Oct 2026).** Use it when building future dialogue and scenes. It is not a to-do list: do not apply its "canon corrections" section or its **(new)** proposals unless the author asks. Where it disagrees with the current build, the build wins unless the author decides otherwise.

> **Author's decisions (Oct 2026), these override the rest of this document:**
> - **Inês** stays as in the game: a Black Brazilian woman from Salvador, black blazer over a band tee, high-waisted jeans, heels, gold hoops. Ignore the Barreiro/glasses/Doc Martens version below.
> - **Celeste is Rui's mother** (not his grandmother).
> - **Alan's mother, Eleanor, lives in St. Augustine, Florida** (not Porto); this is explored in the sequel.
> - **Rui's line:** the game version stays. "Stop feeling up my constable" is retired; when Rui walks back in, Alan and Teixeira spring apart and Rui comments, mildly surprised.

# The Drowned Bell — Character Backstories & Psychological Profiles

Oct 16, 2026 · @Kuba

Every character in The Drowned Bell is built on one idea: grief that
won't let go. Alan, Vicente, Amália, Tomás and Inês are each holding on
to someone the sea or time took, and each profile shows how they hold on
and what letting go would cost.

**How to read each profile.** Vitals, then backstory, then psychology in
five parts: wound (what happened), defence (how they protect it), fear,
desire, and contradiction (what makes them more than a type). It ends
with how the psychology shows in play and, where relevant, in the
sequel.

**Canon status.** Everything here agrees with the Story Bible v2.7.
Details marked **(new)** are invented in this document to fill gaps;
they are proposals until you confirm them. Where the bible and the
current build disagree, the build wins.

**The timeline that holds it together.** Joaquim and Amália born 1914.
Joaquim marries 1935. Pedro born 1936. Celeste born 1925. Vicente born
1943, Tomás 1944: both boys are in the cistern in 1955. Alan born 1958.
Pedro dies 1967. Inês born 1962. Vasco born 1957. Joaquim dies ten days
before the game.

## Alan Sanches

|        |                                                                                                                |
|--------|----------------------------------------------------------------------------------------------------------------|
| Born   | 1958, Lisbon; 37 in 1995                                                                                       |
| Work   | Owner of Livraria Sanches, Alfama, since Joaquim stepped back; the last Sineiro                                |
| Family | Father Pedro (d. 1967); mother Eleanor Solana, American, from St. Augustine; raised by his grandfather Joaquim |
| Look   | Leather jacket, a cream suit for occasions, a cigarette when idle                                              |
| Voice  | Laid-back, quick, warm; ElevenLabs Roger                                                                       |

**Backstory.** Alan's first name is his mother's doing: "Alan" is
Eleanor's American choice, and it marked him as foreign in every Alfama
classroom. His father Pedro died in 1967, when
Alan was nine. Within months Eleanor left Lisbon and left him with
Joaquim, above the shop. She sent cards, then fewer. He has her number
and hasn't called in two years.

Joaquim raised him kindly and from a distance. He taught Alan books,
coffee and silence, and never once mentioned bells. Alan grew up in a
house where the important things were never said, and learned that this
was what love looked like. He drifted through a literature degree, came
back to the shop because it asked nothing of him, and has been charming,
clever and asleep at eleven ever since.

He has known he is gay since adolescence. In private he is confident and
in charge; in public he denies everything with a joke. Everyone in the
Alfama knows. Nobody has heard him say it.

**Psychology.**

- **Wound:** abandonment at nine, twice in one year: his father by
  death, his mother by choice. The lesson he drew: people leave, so
  don't need them.

- **Defence:** avoidance, dressed up as laziness and charm. He works
  very hard at anything that lets him avoid what matters. Jokes are the
  front door: he opens it to everyone so nobody notices the house behind
  it is locked.

- **Fear:** that wanting someone makes him the one left behind again.
  And, as the last Sineiro, that his line ends with him and that this is
  somehow deserved.

- **Desire:** to be chosen and stayed for. He can't admit it, so he
  arranges to be the one who leaves first.

- **Contradiction:** the man who avoids everything is extraordinarily
  brave once he commits. He runs a heist, races the tide and rings a
  drowned bell. Effort was never his problem; meaning was.

**Humour as a symptom.** His jokes always carry a double meaning
(ringing back, the tongue, turning, founder, keeping books). They stop
at the \[pause\] beats, and those silences are where the real Alan is. A
rule for writers: his jokes target himself, never the men he's with.

**How he smokes (new).** He smokes when he is waiting, which is to say
avoiding. The idle animation is characterisation: left alone with
nothing to do, Alan reaches for something to do with his hands. In the
epilogue, waiting for Vasco, he doesn't light one.

**In play.** Arc: avoidance to commitment, across four strands: duty
(the bell), grief (Joaquim), family (two numbers he's afraid to call)
and love (Vasco). The flings escalate in meaning: Teixeira is control,
Duarte is play, Zé is surrender, and each is good and not enough. The
turning point is the midpoint choice: "My grandfather ran. I'm going to
the Chiado." He ends calling his mother at dawn and waiting on a ladder.

**In the sequel.** The Crossing takes him toward his mother's family,
the Solanas. Her coldness was protection, and in Game 3 he hears it from
her.

## Inês Carvalho

|        |                                                                                                               |
|--------|---------------------------------------------------------------------------------------------------------------|
| Born   | 1962, Barreiro, on the industrial south bank; 33 in 1995                                                      |
| Work   | Shop assistant since 1989; doctoral candidate, Faculdade de Letras                                            |
| Thesis | *The Widows of 1755*, six years in progress                                                                   |
| Look   | Round glasses, pencils in her hair, men's cardigans over band T-shirts, Doc Martens, a satchel of photocopies |
| Voice  | Precise, quick, teasing; the Barreiro accent returns when she's angry; ElevenLabs Sarah                       |

**Backstory.** Her father worked at the CUF chemical works, her mother
cleaned offices across the river. She was the first in her family at
university and has never quite believed she's allowed to be there. In
1989, broke, she answered a handwritten card in the shop window. Joaquim
hired her in five minutes and spent six years treating her as the
granddaughter who listened. He told her about Amália, about books, never
about bells. She loved him.

Ten days before the game, she found his body. The floor was wet and the
room smelled of the sea. She told herself it was rain, and she has told
no one since.

**Psychology.**

- **Wound:** class. She learned early that people like her are tolerated
  in rooms like the university, not welcomed, so she made herself
  indispensable instead of visible.

- **Defence:** competence and management. She organises everyone's life
  so she never has to finish her own. The shop and Alan are where she
  hides from the thesis and from the question of what her life is for.

- **Fear:** that finishing the thesis will prove she was never good
  enough. And now, guilt: if she had spoken about the wet floor, the
  others might be alive.

- **Desire:** to be taken seriously on her own terms, and to be needed
  by someone who also gives back.

- **Contradiction:** she calls Alan a coward because she recognises the
  type. She is as avoidant as he is; she just hides it inside
  usefulness.

**Why she studies widows.** It isn't an accident of topic. Her thesis is
about women who were left behind and kept the record, which is what she
does for Joaquim, and what she'll do for Alan. Her own long relationship
with a naval officer ended when he chose the sea. "I'm married to the
eighteenth century. It doesn't call either."

**With Alan.** Platonic soulmates. She has known he's gay since 1989 and
waited for him to say it, partly from respect and partly because, while
he doesn't, nothing has to change. She protects him from everyone except
herself. When she's angry, she uses his full name, z and all.

**In play.** Conscience and hint-giver; guide and thief at the Sé; the
secret of Joaquim's death in Chapter II, the first time she cries in
front of Alan; hostage; and the one who wins the finale. She beats
Vicente with what she's best at: reading documents, and reading people.
She understands he isn't a fanatic but a grieving son, and she gives him
the ledger page.

**In the sequel.** She stays in Lisbon, minding the shop and Pessoa, and
works the case by phone and fax. Her arc mirrors Alan's: she has to stop
hiding in his life and finish her own.

## Dr. Vasco Teles

|           |                                                                                           |
|-----------|-------------------------------------------------------------------------------------------|
| Born      | 1957, Braga; 38 in 1995                                                                   |
| Work      | Curator of the Sé treasury and director of the cloister dig, employed by the Patriarchate |
| Education | Seminary from 12 to 20; history at Coimbra; nine years in Rome, doctorate on bell baptism |
| Family    | Notary father, a mother at Mass every morning, four older sisters; only Teresa knows      |
| Voice     | Warm, quick, breathless when excited about the past                                       |

**Backstory.** The only son after four daughters, Vasco was promised to
the Church before he could object. He entered the seminary at twelve and
left at twenty, a year before ordination, saying it was for archaeology.
The truth, told only to God and Teresa, is that he couldn't take a vow
of celibacy to hide something he'd never been allowed to name.

In Rome, digging in the catacombs and at Ravenna, he loved a man for the
first time: Lorenzo, a restorer. When the Patriarchate offered him the
Sé in 1990, he came home and left Lorenzo behind. He has never forgiven
himself, and never told his mother.

**Psychology.**

- **Wound:** he chose safety over love once and has lived with the cost
  every day since.

- **Defence:** work and faith, both sincere, both useful as walls.
  Stratigraphy lets him love things that stay still and can't leave.

- **Fear:** exposure. Being outed would end his career with the
  Patriarchate and break his mother's heart. Unlike Alan, he has a great
  deal to lose.

- **Desire:** a second chance, and the courage not to waste it this
  time.

- **Contradiction:** the cautious, devout man is the one who acts. He
  saw through the heist in a minute, let it happen because he wanted the
  kiss, and covered for a thief at real risk to himself. Alan talks;
  Vasco does.

**His faith (new).** It isn't a costume or a conflict to be solved. He
believes, and he believes God made him as he is; it's the institution he
fears, not God. That gives him a calm Alan has never had.

**Why the second chance matters.** "Most people waste them" in the phone
call is about Lorenzo, not Alan. He is offering Alan what he didn't take
himself. The player shouldn't be told this in this game; it should land
when the sequel reveals Lorenzo to Alan.

**With Alan.** Opposites on the surface: north and south, devout and
irreverent, a man who digs up the past and one who runs from it.
Underneath, each has loved one thing he couldn't bring home. Alan makes
Vasco laugh at himself; Vasco makes Alan stop talking, listen and wait.

**In play.** The heist (Ch. I), the fragment gift (Ch. III), the phone
call (Ch. V), Thursday. His secret about the reliquary glass is planted
with a glance and "You're a terrible liar, Senhor Sanches. Don't
change."

**In the sequel.** The one, and it's rocky. He wants to be seen, to walk
in daylight and meet his family; every step costs him more than it costs
Alan. His arc runs from private peace to public courage.

## Vicente Lacerda

|        |                                                                                         |
|--------|-----------------------------------------------------------------------------------------|
| Born   | 1943, Lisbon; 52 in 1995                                                                |
| Work   | Antiquarian in the Chiado; head of the Lacerda family, the bell's godparents since 1754 |
| Family | Father Afonso (drowned 1955); no wife, no children **(new)**                            |
| Voice  | Posh, courteous, unhurried; ElevenLabs Blackwood                                        |

**Backstory.** The Lacerdas stood godparents when the Brotherhood
baptised the bell in seawater in 1754. They survived the 1755 wave and
decided the sea hadn't failed them, it had been interrupted. For two
centuries the family taught its sons that the drowned are waiting at the
door.

In 1955, Afonso Lacerda tried to finish the ringing in the cistern under
the Carmo. Vicente was twelve and there. Joaquim, the Sineiro, had the
bell's tongue in his hand, and ran, carrying the altar boy Tomás. The
water came up, and Vicente watched his father drown. Afonso's last words
were for his son: "Vicente, let it go." Joaquim heard them and wrote
them down. Vicente never knew.

He grew up in a house of relics and became a dealer in them. The 1988
Chiado fire took his shop and most of his stock **(new)**; he rebuilt it
exactly as it was. Ten days before the game he drowned Joaquim, and the
founders have been dying since.

**Psychology.**

- **Wound:** he watched his father die at twelve, and the man who could
  have stopped it ran away.

- **Defence:** ideology. Grief that couldn't be borne became a mission
  that could be organised. The family's theology gave him a way to never
  say goodbye.

- **Fear:** that it was all for nothing, and Afonso is simply dead.

- **Desire:** his father back. Everything else, the city included, is a
  price.

- **Contradiction:** a murderer who is courteous, cultured and sincerely
  kind to his guests. He believes he is rescuing the drowned, the city's
  drowned included.

**Frozen at twelve.** Vicente never grew past the cistern. He rebuilt
his burned shop as it was; he keeps his father's things in a glass case;
he has no family of his own because his family is behind him, not ahead.
He is the dark mirror of Alan: two men shaped by a lost father and
Joaquim's flight, one who learns to let go and one who won't.

**Why he dies reading.** He spent forty years asking the sea for his
father, and the answer was in a bookshop ledger the whole time. When he
reads "let it go", he finally hears his father, and he doesn't fight the
water. It's the only peace he gets, and it's tragic, not triumphant.

**Writing rules.** Never sneer, never rant. He is polite even when
threatening. He doesn't know Alan personally and has never met Vasco; he
knows Alan only as the last Sineiro.

## Joaquim Sanches (posthumous)

|            |                                                                          |
|------------|--------------------------------------------------------------------------|
| Born       | 1914, Alfama; drowned ten days before the game, aged 81                  |
| Work       | Bookseller, founder of Livraria Sanches; the Sineiro before Alan         |
| Family     | Wife Rosa **(new)**, d. 1979; son Pedro (d. 1967); grandson Alan         |
| Present as | His ledger, his cipher, his 1955 page, the fado, other people's memories |

**Backstory.** As a boy Joaquim rang the Sé bells beside Abílio and fell
in love with Amália, a girl who sang in the street. His family knew what
he was and what the bell was. At twenty-one he gave Amália up and
married Rosa, "the sensible thing". Amália gave him a music box with a
silver ship on his wedding day.

In 1955 he went down to the cistern under the Carmo with the bell's
tongue in his hand. He was meant to stop the Lacerdas. Instead he saw an
altar boy, Tomás, in the rising water, and ran with the child. Afonso
Lacerda drowned. Joaquim wrote down Afonso's last words in his ledger
and never spoke of that night again. A year later he deposited the
Brotherhood's papers with the Sé, and told a museum what he never told
his family.

When Pedro died and Eleanor left, he raised Alan without a word about
bells, hoping silence would protect him. In his last weeks he could see
it starting again. He wrote warnings, a list of founders and a cipher,
and was drowned before he could finish.

**Psychology.**

- **Wound:** 1955. He saved a child and lost his nerve in the same
  moment, and could never decide which one defined him.

- **Defence:** silence and record-keeping. He wrote everything down and
  said nothing aloud. A bookseller who kept books in both senses.

- **Fear:** that the bell would take Alan the way it had taken
  everything else.

- **Desire:** that it would end with him.

- **Contradiction:** a coward by his own account and a hero by Tomás's.
  Both are true, and the game is about Alan learning to hold both.

**Why he matters.** Joaquim is Alan's mirror. He hid the bell and he hid
his heart, and Alan hides the same two. The game lets the player see the
mirror and then watch Alan refuse it. His love for Amália lives in the
fado: the refrain of "O Sino Afogado" is his love song to her.

## Dona Amália

|        |                                                                |
|--------|----------------------------------------------------------------|
| Born   | 1914, Alfama; 81 in 1995                                       |
| Work   | Fado singer, Taberna da Saudade, sixty years on the same stage |
| Family | Never married **(new)**                                        |
| Voice  | Gritty, enigmatic, unhurried; ElevenLabs Mora                  |

**Backstory.** Amália sang in the streets as a girl and in the taverns
by fifteen. She loved Joaquim from the bell-tower days and believed he
would choose her. He married Rosa instead, and she gave him a music box
with a silver ship to prove she wasn't bitter. She was. She never
married; she says it's because the stage was enough **(new)**. She
stayed in the Alfama, sang his song every night for decades, then
stopped singing it altogether.

**Psychology.**

- **Wound:** being the unsensible choice. She was loved, and not chosen.

- **Defence:** performance. Fado lets her feel everything in public and
  nothing in private. Her rules ("Not sober, menino. Never alone. And
  never without Duarte.") are walls dressed as tradition.

- **Fear:** that singing the song will bring the drowned back, or bring
  Joaquim back as grief she can't put down.

- **Desire:** that someone in that family, finally, chooses love over
  safety.

- **Contradiction:** the most romantic woman in Lisbon is ruthlessly
  unsentimental in conversation.

**What she sees in Alan.** "He chose the sensible thing, menino. You
have his face when you lie." She recognises Joaquim's evasions in his
grandson within minutes, and it frightens her more than the fog. Her
optional blessing on the last night is her giving Alan permission she
never gave herself.

**In play.** Sings the song (I), identifies the music box (III,
optional; otherwise via Duarte), blesses Alan (V, optional). The wall
photograph of her and Joaquim in the taberna is her life in one frame.

## Inspector Rui Mendonça

|        |                                                                             |
|--------|-----------------------------------------------------------------------------|
| Born   | 1948, Alfama; 47 in 1995 **(new)**                                          |
| Work   | Inspector, Polícia Judiciária                                               |
| Family | Mother, Dona Celeste; father a docker, killed on the quay in 1970 **(new)** |
| Voice  | Husky, dry, tired; ElevenLabs Callum                                        |

**Backstory.** Rui grew up at the lavadouro, Celeste's only son, among
washerwomen who read the river like a newspaper. In 1970 his father was
crushed in an accident on the quay (new); the police filed it in an
afternoon and nobody asked a question. He joined the police the next
year to be the man who asks the questions: evidence, files, procedure.
Twenty-five years on he is a good inspector and a tired one.

He has known Alan since Alan was a boy **(new)**: the foreign-named kid
from the bookshop. He knows everything about Alan's private life and has
never once made it Alan's problem.

**Psychology.**

- **Wound:** a father's death filed and forgotten. He decided that what
  can be explained can be controlled, and that every death deserves a
  proper file.

- **Defence:** procedure and dry humour. Anything that doesn't fit a
  report goes in the drawer of unexplained cases, and the drawer gets
  closed.

- **Fear:** that his avó is right and the river is breathing. If the
  world isn't rational, his whole self is built on sand.

- **Desire:** to close the case without having to believe in it.

- **Contradiction:** the most sceptical man in the game is the one who
  waits outside the Carmo at midnight and keeps the gate. He believes
  more than he admits.

**With Alan.** Old acquaintances, close to friends. He teases about
Teixeira ("Stop feeling up my constable"), but he's protective: he keeps
the police out of the cistern because "if I go in, it's a police matter,
and then it's in a drawer forever".

**In play.** Gives the list (I), opens the 1955 drawer and arranges the
Ferreira key (II), tells Alan that Vasco withdrew the complaint (V),
waits outside the Carmo (V), and closes the drawer in the epilogue. That
closing gesture is his arc: he files what he saw under unexplained, and
lets it stay unexplained.

## Teixeira, Duarte and Zé

The three flings each show Alan a different way of being with a man:
control, play and surrender. Each is a whole person who comes out of the
day better off.

### Officer Teixeira

**Vitals (new):** b. 1970, Viseu; 25. Constable, PJ, under Rui. Lives in
a rented room and phones his mother daily.

**Backstory (new).** A farmer's son from the interior who joined the
police because it was respectable and far from home. He moved to Lisbon
two years ago and is still frightened of it. He has never done anything
his mother wouldn't approve of, at least not out loud.

**Psychology.** Wound: a lifetime of being good. Defence: rules and
regulation ("They're… regulation"). Fear: being found out by Mãe, and by
the station. Desire: permission. Contradiction: the shyest man in the
game is the one who unhooks his own handcuffs and holds them out. Alan
doesn't seduce him so much as give him permission.

**In play.** The police-station flirt (I), the Ferreira key (II), then
the shop. He leaves glowing and walking funny. Writing rule: the stammer
is affection, never mockery.

### Duarte

**Vitals (new):** b. 1964, Mouraria; 31. Guitarist on the twelve-string
Portuguese guitar, Amália's accompanist at the Taberna da Saudade.

**Backstory (new).** He learned from his uncle, who accompanied Amália
before him, and inherited the chair at twenty. He has played for her
every night since. He lives alone above a barber's and owns his guitar,
a good coat and nothing else he can't carry.

**Psychology.** Wound: none he'd admit; he grew up watching his uncle
play for a woman who loved someone else, and decided never to wait for
anyone. Defence: lightness. He keeps everything casual on purpose, where
Alan keeps it casual from fear. Desire: someone who listens. He plays
only for listeners, not drinkers. Contradiction: the most carefree man
in the game is the most attentive one; he notices everything, especially
hands.

**Scene direction.** Poetic and nonchalant: unhurried, never slow. He
talks in music, teases in the same breath he means things, and is
completely at ease in front of Inês. His scene should flow like a set:
quick exchanges, a beat of quiet when he plays, then on.

**In play.** The tavern flirt and the song (I); Amália's message and the
shop (III); the handwritten lyrics sheet. Tuesdays and Fridays. Never
Thursdays.

### Zé Coutinho

**Vitals:** b. 1950, Madragoa; 45. Fisherman at Cais do Sodré; son of
Maria Coutinho, the cold-open victim; Celeste's godson.

**Backstory.** His father was lost at sea when he was a boy **(new)**,
and his mother raised him on fish sold from a basket. He took the boat
at sixteen. He has had men before, discreetly, never anyone from the
quay **(new)**. Before dawn yesterday (Monday 30 October) his mother
drowned in a locked room, and a blue tile appeared in his bunk. He didn't know he was a founder.

**Psychology.** Wound: the sea took his father and now his mother.
Defence: silence, work and control; on the boat, he decides. Fear: grief
he can't steer. Desire: to be left alone, and underneath it, not to be.
Contradiction: on the worst day of his life, saved by Alan at the 18:25
turning, he chooses to feel alive.

**With Alan.** Zé takes charge and Alan lets him: "Stop talking." It's
the best night of the three, and it teaches Alan that pleasure isn't
what he's missing. Write it as warm toward Zé; the ache it leaves is
about Vasco, not about him.

**In play.** Saved (IV), gives Alan his knife and a sardine, pulls
Lacerda's jacket from the Tagus (post-credits). In the sequel: the
bucket gag, and "Breathe, Sanches".

## Celeste, Tomás and Abílio

The three keepers of what the city remembers. Each holds part of 1955
and has carried it alone.

### Dona Celeste Mendonça

**Vitals:** b. 1925, Alfama; 70. Washerwoman at the Alfama lavadouro.
Rui's mother, Zé's godmother. Widow of a docker killed on the quay in
1970 **(new)**.

**Backstory.** Celeste has washed the neighbourhood's linen for
fifty-five years and knows everyone's secrets by their sheets. At dawn
in 1955, hanging washing early, she saw Joaquim come up from the Carmo
soaked to the chest, carrying a boy. She never told the police. She
raised Rui at the stone tanks and buried her husband when Rui was
twenty-two.

**Psychology.** Wound: the river gave her husband his living, and the
quay took him. Defence: work and folk wisdom; she explains the river so
she doesn't have to fear it ("the river is breathing"). Fear: losing Rui
to his job, and Zé to the water. Desire: for Rui to eat properly and for
the river to calm down. Contradiction: deeply traditional, and the first
to defend Alan. Her code isn't about who people love but about decency,
and she runs her courtyard by it.

**In play.** Lore source (II): the river breathes, the tiles are "the
sea in clay", bronze breaks them. Shuts down the gossip about Alan.
Leads him to Zé's boat (IV).

### Father Tomás

**Vitals:** b. 1944, Lisbon; 51. Priest and keeper of the roofless
Carmo. Calm, precise, faintly British in manner from seminary years in
England **(new)**.

**Backstory.** In 1955 Tomás was eleven, an altar boy who followed the
adults down into the cistern because nobody told him not to. The water
rose. Joaquim dropped what he was holding and carried him out. Tomás
grew up believing he was the reason Afonso Lacerda drowned and the bell
went unfinished. He became a priest to deserve the life he was given,
asked for the Carmo, and has kept the grate locked for forty years,
waiting for the next Sineiro.

**Psychology.** Wound: survivor's guilt; his life was bought with
another man's death and Joaquim's shame. Defence: duty and calm; ritual
fills the silence. Fear: that the bell will wake on his watch and he'll
fail as Joaquim did. Desire: to tell someone the truth and be forgiven.
Contradiction: a man of God who has kept a pagan grief locked under his
church, and prayed for its keeper's son.

**Tomás and Vicente (new).** They were boys in the same water, a year
apart. One was carried out; one was left watching. Tomás knows exactly
who Vicente is and has prayed for him every year since. That gives his
confession its weight: he isn't only defending Joaquim, he's grieving
for Vicente too.

**For the flashback rewrite.** Tell it from the child's eye: the cold,
the noise, a man's hand, being lifted, and a face in the water behind
them. Hold Joaquim's choice as one clear image: he sees the boy and
drops the tongue. Then Tomás, now: "He didn't run from the bell, Alan.
He ran with me."

**In play.** Guides Alan to the stone (III), the midpoint choice ("Go
home"), the midnight truth about 1955 and the lantern (V).

### Sr. Abílio

**Vitals:** b. 1914, Alfama; 81. The last hand bell-ringer at the Sé.
Deaf from sixty years of bells.

**Backstory.** He rang beside Joaquim as a boy; Joaquim left the tower
to marry, Abílio never left. His wife died years ago **(new)** and the
bells are what he has left. He knows the founders' order of casting
better than God does.

**Psychology.** Wound: loneliness, and a friendship that went quiet when
Joaquim stopped climbing the stairs. Defence: noise; he shouts
everything because he can't hear, and because silence frightens him.
Desire: someone to talk to who isn't a bell. Contradiction: deaf, and
the only person who still listens to the bells properly.

**In play.** Reads Alan's notebook because he can't hear him, shows him
the four founder bells and their order (III). Writing rule: he shouts
every line, including the ones that matter.

## The dead and the absent

They never appear in the present, but every living character is shaped
around one of them.

### Afonso Lacerda (1910–1955)

Vicente's father and the last Lacerda to believe the bell could bring
the drowned home before Vicente. A charming, devout and obsessive man
who raised his son on the family's sea-theology **(new)**. In the
cistern, as the water rose, something broke through the obsession: his
last words weren't a prayer to the sea but a release for his son.
"Vicente, let it go." He is the proof that the Lacerdas could have
stopped, and the reason the finale works.

### Pedro Sanches (1936–1967)

Alan's father, Joaquim's only son. Warm, restless, the one Sanches who
wanted to leave Lisbon; he met Eleanor when she came to Lisbon as a
young woman. He served in the navy during the colonial wars and was lost
at sea off Guinea in 1967, when Alan was nine. No body came home. The
sea took the Sineiro's son without any bell at all, and Joaquim read it
as a judgement **(new)**. His silence about it is part of what Alan
inherited.

### Eleanor Solana

Alan's mother, an American from St. Augustine, Florida. Her grandmother
sent her to Lisbon in 1957 to marry into a founder line and bear "a
child of both bloods". She fell in love with Pedro anyway. When he died,
she understood what the Solanas wanted from her son, and she left Alan
with Joaquim to keep him out of their reach, knowing he would hate her
for it. Her coldness was protection.

She went back to St. Augustine, where she lives in 1995, and in the
sequel she is married to Ambrose Pell. Alan has her number and hasn't
called in two years. The dawn phone call is the start of a
reconciliation; in Game 3 he hears the truth from her. **Fix in the
bible:** the cast table says her number is "in Porto"; it should be St.
Augustine.

### Rosa Sanches (1915–1979) (new)

Joaquim's wife, "the sensible thing": a kind, practical shopkeeper's
daughter who knew she was loved second and made a good life anyway. She
kept the shop's accounts, and the music box on the shelf. Alan remembers
her vaguely and warmly. She gives Amália's jealousy someone real to be
jealous of.

### Maria Coutinho (1931–1995)

Zé's mother, a fishwife in Madragoa, and the cold-open victim. Joaquim's
warning list was in her apron when she died. She knew what the tile
meant the moment she saw it, which means the founder families once
talked about the bell, and she never told her son **(new)**. That
silence is what Zé has to live with: she protected him from a danger
that came for him anyway.

### Sr. Ferreira (posthumous)

The clockmaker and first victim, who made the locks for all four founder
families and for Lacerda's glass case. A meticulous, lonely man who
trusted machines more than people **(new)**. His tide clock reveals the
pattern of the turnings: the last thing he built tells Alan when the
next person will die.

## Minor figures

Small roles, one clear trait each, so they read instantly and never
compete with the main cast.

| Character                         | Who they are                                           | One trait                                  | What they're for                                                                                                         |
|-----------------------------------|--------------------------------------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Pessoa                            | The shop cat, nine kilos, no ambition                  | Warmth that must be bribed                 | Blocks the desk (I), sleeps on the warm answering machine (V) until bribed with Zé's sardine; has ruined a first edition |
| The narrator                      | The voice of the city; ElevenLabs Eleanor              | Gracious, a little amused, never cruel     | Chapter cards, looks, the 1755 and 1955 flashbacks, the paintings and the silent beats                                   |
| The taberna owner **(new)**       | Joaquim's old drinking companion; keeps Amália's stage | Proprietorial about the guitar on the wall | Takes the guitar from its hook for the fado; pours the ginjinha                                                          |
| The woman drying sheets **(new)** | A lavadouro regular, Celeste's rival of forty years    | Gossip as a hobby                          | Voices the neighbourhood's prejudice so Celeste can shut it down                                                         |
| The laundry women **(new)**       | Celeste's crew at the tanks                            | Unshockable until Alan undresses           | Comic chorus; their shocked faces are the gag                                                                            |
| The man on the quay **(new)**     | A fisherman from Zé's crew                             | Says the cruel thing out loud              | His comment lands after the Zé scene, so it hurts Zé as much as Alan                                                     |

**Pessoa's psychology, for fun.** Wound: none. Defence: weight. Desire:
the warmest object in the room. Contradiction: named after Portugal's
great poet of many selves, he has exactly one, and it's asleep.

## Relationship web

Everyone around Alan is hiding a piece of 1955 or of Joaquim, and each
piece Alan uncovers moves him from avoidance to commitment.

| Character | What they want from Alan                     | What they hide from him                     | What they give him                                        |
|-----------|----------------------------------------------|---------------------------------------------|-----------------------------------------------------------|
| Inês      | That he finally tries; that he says it       | She found Joaquim's body                    | Research, the heist, the ledger page that wins the finale |
| Vasco     | A second chance used well                    | He saw through the heist and let it happen  | The key, the fragment, the withdrawn complaint, Thursday  |
| Vicente   | His founder hands on the bell                | That he killed Joaquim                      | Nothing; Alan gives him the only thing he needed          |
| Joaquim   | That it ends with him                        | The bell, 1955, Amália, the 1956 deposit    | The ledger, the cipher, the song                          |
| Amália    | That he chooses love, unlike his grandfather | How much she still loves Joaquim            | The song, the music box, a blessing                       |
| Rui       | To close the case without believing          | That he's starting to believe               | The list, the drawer, the key, the gate                   |
| Tomás     | That someone keeps the grate locked          | That Joaquim ran to save him                | The truth about 1955, the lantern                         |
| Celeste   | That he looks after Zé and Rui               | She saw Joaquim and the boy at dawn in 1955 | Lore, protection, the way to Zé's boat                    |
| Abílio    | Company                                      | Nothing; he shouts everything               | The founders' order                                       |
| Teixeira  | Permission                                   | That he's never done this before            | The Ferreira key                                          |
| Duarte    | Someone who listens                          | That he never waits for anyone              | The song, Amália's message, the lyrics sheet              |
| Zé        | To be left alone, and not to be              | That he's had men before                    | His knife, a sardine, Lacerda's jacket                    |

**Settled:** Pedro was lost at sea in the colonial wars; Eleanor's
version is protective, and she lives in St. Augustine in 1995; Alan is
his legal name, chosen by his mother. **Still open:** which **(new)**
details above you want to keep.

## Claude Code: canon corrections

Paste this into Claude Code to bring the game in line with the settled
answers above.

Canon corrections. Update dialogue, subtitles and the story bible, then
list every changed line id so I can regenerate audio:  
1. Celeste is Rui's mother, not his grandmother: replace "avó" /
"grandmother" with "mãe" / "mother" wherever it refers to Celeste.  
2. Alan's legal name is Alan. Remove every "Álvaro" line; where Inês
used it in anger, she says "Alan Sanches" instead.  
3. Alan's mother lives in St. Augustine, Florida, not Porto. Fix any
reference to her number or home being in Porto.  
4. Alan's father Pedro was lost at sea in the colonial wars in 1967. Fix
any line that contradicts this.


---

> **Reference for writing lore, dialogue and scenes (supplied by the author, Oct 2026).** Draw on it for future work. It is not a to-do list: don't retrofit existing scenes or apply its **(proposal)** items unless the author asks. Author's decisions recorded in docs/CHARACTERS.md (Celeste is Rui's mother; Eleanor lives in St. Augustine; Inês as in the game) still apply.

# The Drowned Bell — Lore of the Sea

Oct 16, 2026 · @Kuba

The power behind the bell is the Sea: an ancient, indifferent power
older than Lisbon, the Church and the founders. The drowned are how it
shows itself, the bell is how it is called, and grief is what opens the
door. This document is canon for the first game and the sequel; it
supersedes the Origins section of the story bible where they differ.

## The Sea

**What it is.** The Sea was here before the first ship and before the
first prayer. It doesn't love, hate, punish or reward. It takes, and
what it takes becomes part of it. Every sailor lost on the gold fleets
and the India run, every fisherman who didn't come back to the Ribeira,
is in it now. It is vast, patient and very old, and it notices people
the way a tide notices sand.

**What it isn't.** It isn't the Devil, a god of the Brotherhood, or a
monster with a body. It isn't evil. It has no plan for Lisbon and no
interest in the living, except that the living, sooner or later, come to
it.

**How it behaves.**

- **It answers when called.** It doesn't come uninvited. Everything in
  the game starts because someone called it.

- **It keeps bargains to the letter.** It does exactly what it was
  asked, never what was meant. That is the horror: it is perfectly
  obedient and perfectly indifferent.

- **It always takes its share.** A bargain with the Sea has a price, and
  the price is collected from whoever made the promise.

- **It comes as water.** It has no other form in the world of the
  living. Wherever it arrives, things drown.

**The old names.** The Brotherhood didn't call it "the Sea" in private.
Their charter calls it by an older name the founders refused to write
down in full **(the name is never given)**. Sailors called its anger
Adamastor, after the giant of storms in Camões. Before the Romans, the
coast where Lisbon stands was called Ophiussa, the land of serpents; the
oldest stone at the bottom of Vasco's dig carries a coiled mark that the
founders copied onto the bell.

## The drowned

**The Sea's congregation.** Everyone the Sea has taken is still in it:
not at peace, not damned, just held. They are unburied, unmourned by any
bell, and they remember home. They can't leave by themselves. They are
the part of the Sea that still has faces.

**What they want.** To come home. That's all. They aren't vengeful and
they don't envy the living. A drowned sailor wants his own door, his own
bed, his mother's kitchen.

**Why they drown the living.** They can only come home as what holds
them: water. When the Sea answers a call, it comes wearing the drowned
like a face, and a house full of returning sea is a house that drowns.
In 1755 the whole congregation came at once, and the lower city went
under. Nobody meant it. That is the tragedy at the centre of the lore:
the dead aren't evil, they're lonely, and love that won't let go is what
lets them in.

**What the living see.** Never a ghost. A wet footprint by the bed. A
smell of the sea in a locked room. A voice in the fog that sounds like
someone you lost. Water rising through floorboards with nowhere to come
from.

**Lacerda's theory.** Vicente believes 1755 went wrong only because the
founders cut the bell's tongue mid-ringing, so the dead were stopped
halfway between sea and home and arrived as water. Finish the ringing,
he thinks, and they'll arrive whole: his father walking up out of the
cistern. The game never proves him wrong outright. 1955 is the evidence
against him: Afonso tried, and the water came again.

## The bell and its baptism

**The real tradition.** Church bells really were "baptised": washed with
holy water, anointed, given a saint's name and godparents, and rung to
drive away storms and to call souls home. The tolling bell for the dead
guided the departed to rest. A bell was a voice the other world could
hear.

**What the Brotherhood did.** In 1754 the Brotherhood of the Drowned
Bell, widows and mothers of drowned sailors, paid the four founder
families to cast a great bell for a cistern under the Carmo. Then they
baptised it with seawater instead of holy water. A bell washed in holy
water belongs to God. A bell washed in the sea belongs to the Sea. They
made the only bell in Lisbon the drowned could hear, and the only bell
the Sea would answer.

**The promise.** As godparents, the Lacerdas spoke for the bell: "When
it rings, the Sea shall come, and bring our drowned home." The widows
meant their sons. The Sea heard an invitation.

**Why the Sea listened.** A bell alone is only bronze. What made this
one heard was grief. For months before the casting, hundreds of widows
and mothers met in the cistern and poured their mourning into the work:
they wept into the seawater that would baptise the bell, they gave rings
and keepsakes of the drowned to the melt, and they prayed one wish over
and over: bring them home. No single grief could reach something as vast
and indifferent as the Sea. Hundreds together, all aimed at one bell,
could. Their combined sorrow was so strong that the Sea, which notices
nothing, noticed, and turned toward Lisbon to listen. The bell is a
vessel of that grief, and it's why it still has power two centuries
later: the widows are long dead, but what they poured into it never left
the bronze.

**Its name.** Every baptised bell has a name. This one was given the
Sea's old name, the one written in the charter only as initials. The
founders refused to say it aloud, and so does the game.

**The founder blood.** At the casting, the master founders bled into the
melt, an old custom "so the bell would know its father". It's why only
founder hands can ring it: the bell answers its own blood.

**The tongue and the binding.** After the wave in 1755, the founders
understood what they'd made. They cut out the bell's tongue, its
clapper, and bound the bell with their blood. A silenced bell can't
call. From then on, ringing it needed both things together: the tongue,
and a founder's hands.

## The chain of power

Power runs down a chain, and every link is a real relationship from the
baptism rite. Break any link and the chain fails.

1.  **The Sea** is the power itself. It answers the bell because the
    bell belongs to it.

2.  **The drowned** are the form it comes in. When the Sea answers, it
    comes wearing them.

3.  **The bell** is the call. Baptised in seawater and named with the
    Sea's name, it is the Sea's own voice in Lisbon.

4.  **The godparents (the Lacerdas)** speak for the bell. They made its
    promise, so the bell obeys their voice, and through it they can
    point the water. They can't ring it.

5.  **The founders** made the bell with their blood. Only their hands
    can ring it, and only their hands can un-ring it.

**The short version** (what testers should be able to say): "The bell
calls the Sea, the Sea comes as the drowned, the Lacerdas are its
godparents so it obeys them, and only the founders can ring it."

**Why Lacerda needs Alan.** He can direct the water but not ring the
bell. He needs a founder's hands on the rope, and Alan is the last
Sineiro.

## The Lacerdas

**Godparents, not priests.** At a baptism, godparents answer for the
child: they make its promises and are responsible for them. The Lacerdas
answered for the bell. That gives them a voice the bell obeys and,
through the bell, a hold on the water. It also makes them liable for the
bell's debt.

**What they believe.** The family survived 1755 and decided the Sea
hadn't failed them, it had been interrupted. For two centuries they
taught their sons that the drowned are waiting at the door and that the
Lacerdas alone can let them in. They think of themselves as the bell's
priests.

**What they are.** Servants who believe they're masters. The Sea doesn't
serve the Lacerdas; it tolerates them because they keep the bell's
promise alive. They can point the water the way a man can point a dog,
but the dog was never his. Every generation pays: Afonso drowned in
1955, and Vicente drowns in 1995.

**Their powers, exactly:**

- Send the water to a person who holds a piece of the font (a tile).

- Call the fog, by beginning a novena at the cistern.

- Hear the bell's will, and believe it's their own.

**What they can't do:** ring the bell, stop the Sea once it comes, or
choose who it takes when it collects.

## The founders

**Who they are.** Four families who cast Lisbon's bells for three
hundred years, each with its mark in the clay. The Sanches mark is an S
under a bell. In 1754 they took the Brotherhood's money like any other
commission. They were bell-makers, not believers.

**Fools twice over.** A Sanches hand rang the bell on the tenth morning
of the 1755 fog, believing it was a blessing for the drowned. The wave
came on All Saints' Day. Amália's verdict: "They made the bell, and then
they rang it."

**What their blood does.**

- **It rings the bell.** The bell knows its father. Only founder hands
  can ring it forward, to call the Sea.

- **It can un-ring it.** Only founder hands can ring it backward, which
  renounces its baptism.

- **It binds it.** Founder blood bound the bell after 1755. While the
  tongue is out and the binding holds, it sleeps.

**Why they're hunted.** Founders are the only people who can stop the
bell. Every founder line the Lacerdas end makes the bell harder to undo,
and the last founder becomes the only hands left to ring it. In 1995 the
drownings are clearing the founder lines, and Alan and Zé are among the
heirs.

**What they inherit.** Not powers, just a responsibility nobody told
them about. Zé didn't know he was a founder until a tile appeared in his
bunk. Alan didn't know until his grandfather was dead.

## The instruments

Every strange thing in the game is one of these, and each obeys a rule a
player can learn.

| Instrument       | What it is                                                                     | How it works                                                                                                                 | Weakness                                              |
|------------------|--------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| The cistern      | The vault under the Carmo where the bell hangs over seawater; the bell's font  | The baptismal water never drained. It's the Sea's door into Lisbon                                                           | Only reachable through Tomás's grate                  |
| The blue tiles   | Cistern clay kneaded with the baptismal seawater: "a little piece of the font" | The water goes where the font is. A tile on a pillow is a summons; that night, at a turning, the room floods                 | Bronze breaks them. Founder bronze breaks them clean  |
| The fog          | A novena: nine days of fog, like nine days of prayer                           | Begun by a godparent at the cistern. It marks the Sea's attention on the city. On the tenth day the bell can ring            | Lifts when the novena is broken or the bell renounced |
| The turnings     | The moments the Tagus tide changes direction                                   | The river is the sea at Lisbon, so the Sea can only enter at the turn. That's why deaths come at fixed hours (04:01, 18:25…) | Predictable. Ferreira's tide clock gives the schedule |
| The locked rooms | Every victim drowns behind a locked door with seawater in their lungs          | The water doesn't come through doors. It comes up from below, through the stone                                              | None; get the tile out of the room first              |

**Why the turnings matter for play.** They give the game its clock.
People only drown at the turn, so between turnings there is time to
breathe, investigate and live. That is also where the love scenes sit:
"Not until twenty-five past six. The river keeps a timetable."

## History

The lore sits inside real Lisbon history. The last column marks what is
real and what the game invents, so nobody mistakes one for the other.

| When                  | What happened                                                                                                                                  | Real or fiction                       |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| Before Rome           | The coast is called Ophiussa, the land of serpents, in classical sources. A coiled mark is cut into the oldest stone under the Sé              | Name real; the mark is fiction        |
| Legend                | Ulysses founds the city as Olisipo: a sailors' city from its first day                                                                         | Real legend                           |
| 1500s–1700s           | The India run and the Brazil gold fleets lose ship after ship. Thousands drown with no grave and no bell                                       | Real                                  |
| 1730s                 | The Sanches family casts bells in a pit beside the Sé                                                                                          | Pit is fiction                        |
| 1735–36               | *História Trágico-Marítima* collects the shipwreck narratives; the widows read it as a roll of their dead                                      | Book real; the widows' use is fiction |
| 1754                  | The Brotherhood of the Drowned Bell commissions the bell, baptises it in seawater, names it with the Sea's name; the Lacerdas stand godparents | Fiction (bell baptism itself is real) |
| Oct 1755              | Nine days of fog over Lisbon: the novena                                                                                                       | Fiction                               |
| 1 Nov 1755            | All Saints'. A Sanches rings the bell. The earthquake, fire and tsunami destroy the lower city                                                 | Disaster real; the cause is fiction   |
| After 1755            | The founders cut out the tongue and bind the bell with their blood. The Lacerdas decide the ringing was interrupted                            | Fiction                               |
| 1955                  | Afonso Lacerda tries to finish the ringing. Joaquim runs with Tomás. Afonso drowns; Vicente, 12, watches. Celeste sees Joaquim come up at dawn | Fiction                               |
| 1956                  | Joaquim deposits the Brotherhood's papers with the Sé                                                                                          | Fiction                               |
| 1967                  | Pedro Sanches is lost at sea in the colonial wars                                                                                              | War real; Pedro fiction               |
| 1988                  | The Chiado fire; Lacerda rebuilds his shop exactly as it was                                                                                   | Fire real; the shop is fiction        |
| 1995, ten days before | Vicente drowns Joaquim and begins the novena. The fog comes on Monday 23 October (fog day 1)                                                   | Fiction                               |
| Mon 30 Oct 1995       | Fog day 8. Maria Coutinho drowns at the 04:01 turning, before dawn                                                                             | Fiction                               |
| Tue 31 Oct 1995       | Fog day 9, the eve of All Saints'. The game begins at 11:00; the rite is at the 00:35 turning, just after midnight                             | Fiction                               |
| Wed 1 Nov 1995        | All Saints' Day, the 240th anniversary of the earthquake: the tenth dawn, and the fog lifts                                                    | Fiction                               |
| Thu 2 Nov 1995        | Alan waits for Vasco in the casting pit                                                                                                        | Fiction                               |

## How it ends

**Ringing backward is a renunciation.** In the real baptism rite, the
godparents renounce evil on the child's behalf. Ringing the bell
backward, the peal in reverse order, with the tongue in a founder's
hands, makes the bell renounce its own baptism. It stops belonging to
the Sea. The fado hides the instruction: "toca-o ao contrário", ring it
backward.

**The broken contract.** A renounced bell breaks the promise the
Lacerdas made in 1754. The Sea always takes its share, and it collects
from whoever signed. That's why Vicente drowns and nobody else does. It
isn't punishment or justice; it's the Sea closing an account.

**What Vicente gets.** Before the water rises, Alan gives him the last
page of Joaquim's ledger: "Vicente, let it go." He reads his father's
words as the Sea comes for him and doesn't fight it. The chain of power
ends where it began, with grief, and this time grief lets go.

**What the Sea does.** It withdraws. In the lantern light the cistern
floor is briefly not a floor: something enormous moves away beneath it.
Nobody comments. By dawn the fog lifts, the tide keeps its ordinary
hours, and the blue tiles are just clay.

**What's left.** The bell is bronze again, a bell with no name. The
drowned are still in the Sea; nothing in the game frees them, because
nothing can. The Sea isn't defeated. It was never fought. It was only
uninvited.

**What it costs Alan.** Nothing magical. He keeps his hands, his life
and the knowledge that he could ring it again. The real price is the one
his grandfather wouldn't pay: he has to stay.

## Where players learn it

The lore arrives in small pieces, one character at a time, each speaking
from their own life. No one character explains the whole chain. Lines
marked (opt.) are optional topics.

| Ch. | Who                   | Where             | What they reveal                   | Key line                                                                             |
|-----|-----------------------|-------------------|------------------------------------|--------------------------------------------------------------------------------------|
| I   | Vasco                 | Sé dig            | Bells call the dead; founder blood | "A tolled bell calls the dead home. Families paid the ringers for it."               |
| I   | Amália                | Taberna           | The founders rang it               | "Fools twice over, your family. They made the bell, and then they rang it."          |
| II  | Celeste               | Lavadouro         | The drowned; the tiles             | "The river's full of men nobody buried, menino. They listen for bells."              |
| II  | Ferreira's tide clock | Workshop          | The turnings                       | (the clock face, no line)                                                            |
| III | Abílio                | Sé tower          | Founders' blood and order          | "Your blood's in that bronze, boy! It knows you!"                                    |
| III | Vasco (opt.)          | Cloister          | The oldest mark                    | "This is older than the Romans. Serpents. Nobody knows who cut it."                  |
| III | Lacerda               | Antiques shop     | His theory                         | "My family has waited two hundred years for someone to finish a sentence."           |
| III | Tomás                 | Carmo             | The chain; renunciation            | "The godparents answer for the bell. The bell answers for the drowned."              |
| V   | Tomás                 | Carmo at midnight | Why the dead drown the living      | "They don't hate us, Alan. They're coming home. They just can't come any other way." |
| V   | (none)                | Cistern           | The Sea itself                     | The floor that isn't a floor                                                         |

**The test.** After the credits a tester should be able to answer "What
was the bell, and why did the water obey Lacerda?" in one breath. If
they can't, cut lore elsewhere before adding more here.

## Rules for writers and artists

The Sea works because it's never seen. These rules keep it frightening
and keep the human story in front.

**Never show it.**

- No creature, tentacles, eyes or face. The Sea has no body in the world
  of the living.

- Show it only through effects: fog that won't lift, tides at the wrong
  hours, salt on dry stone, wet footprints, a smell of the sea in a
  locked room, a voice in the fog.

- One glimpse in the whole game: the cistern floor that isn't a floor,
  for a second, in lantern light.

**Never explain it.**

- Characters explain the chain (bell, godparents, founders), never what
  the Sea is.

- Its name is never spoken or written in full.

- Nobody in the game understands it. Lacerda thinks he does, and that's
  his mistake.

**Never make it evil.**

- It doesn't threaten, gloat or want. No line gives it a voice.

- The drowned are lonely, not vengeful. Any voice in the fog asks to
  come home, never for revenge.

- The villain is a grieving man, not the Sea.

**Keep grief in front.** The Sea is the backdrop; Vicente's grief is the
plot. Players should fear the water and cry over the ledger page. When
in doubt, cut a horror beat before cutting a human one.

**Keep it consistent.** Every supernatural event must fit the chain and
the instruments. If something can't be explained by bell, godparents,
founders, tiles, fog or turnings, it doesn't happen.

## Sequel hooks

The same Sea lies on both sides of the Atlantic, and the Lisbon bell was
the last of four. Items marked **(proposal)** are new in this document.

**The sister bells.** The same founder families cast three earlier bells
along the old sea road to the Americas, each baptised in seawater with a
local godparent family:

| Cast | City                       | Godparents                          |
|------|----------------------------|-------------------------------------|
| 1751 | Las Palmas de Gran Canaria | The Quintanas                       |
| 1752 | Santo Domingo              | The Peraltas                        |
| 1753 | St. Augustine, Florida     | The Solanas, Alan's mother's family |
| 1754 | Lisbon                     | The Lacerdas                        |

**Why four (proposal).** One bell calls the drowned of one harbour.
Four, rung in order along the route, call the whole Atlantic: every soul
lost on the crossing. Lisbon was meant to ring last. The founders' order
of casting, which Abílio knows, is also the order of ringing.

**What Pell wants (proposal).** Ambrose Pell is a salvor, and he doesn't
want the dead back. He wants what drowned with them: the gold of the
fleets. Where Vicente asked the Sea for his father, Pell wants to ask it
for its treasure. Grief made the first game's villain; greed makes the
sequel's, and the Sea keeps bargains with both to the letter.

**A child of both bloods.** Eleanor's grandmother sent her to Lisbon in
1957 to marry into a founder line. A child of a godparent family and a
founder family could do what no Lacerda or Sanches can alone: both
command the bell and ring it. That child is Alan. **(proposal: this is
why the Solanas want him, and why Eleanor kept him away.)**

**The oldest layer.** The serpent mark under the Sé appears again under
each sister bell's church. Whoever cut it came before the founders,
before the Brotherhood, and before the Romans. The series never says
who.
