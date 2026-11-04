# Dialogue review: Thursday

Overall: sense 4/5, naturalism 4/5. Thursday is the best-written day so far. Carmen's archive scene is up to the bible's own example, the inquiry reads like a real document, and the comedy (Gail and Derek, Nieves and the suitcase, Derek's fall) lands without stepping on the dread. Most of the problems are continuity: a few lines say things the characters cannot know yet or that contradict the lore (the triangle count, Juan de Quintana's death date, Elena's exact night, Vasco's time home). There are also two places where the line order breaks the logic, and two clues in Baute's office (the framed contract, the 1966 photograph) that Alan passes without a word.

## S.startThu
Sense 3/5 · Naturalism 5/5. A good opener with an elegant guilt beat, but the times are wrong against Wednesday night.
- `alan_th_wake` (Alan) **should**: "He came in at midnight and left at six. Between those, he slept like a man with a clear conscience. I lay there with mine." → "He came in after ten and left at six. In between, he slept like a man with a clear conscience. I lay there with mine." Wednesday's narrator says "after ten" (`narr_w_night_1`), and Alan was awake to take his boots off.

## S.chanoNewsThu
Sense 3/5 · Naturalism 4/5. Chano's voice is right ("my cousin's wife's sister", "hombre"), but his last line gives away Doña Pino's reveal before her scene and says it unclearly.
- `chano_th_pepe_6` (Chano) **must**: "Doña Pino. Sí. She was on the same boat as Pepe, in seventy-one. The Virgen del Pino. [pause] Seven came up out of el mar the next morning. Since Christmas they've been going, one a month. Now two." → "Doña Pino. Sí. She was on the same boat as Pepe, in seventy-one. The Virgen del Pino. [pause] Go and ask her, chacho. Gently. She keeps the names." "Now two" reads as "now two have died". Chano also hands over the pattern (one a month) that belongs to Pino's missal and Saturday's paper, and Pino repeats "seven pulled out in the morning" one scene later. The new line keeps the hook that sends Alan to her.
- `chano_th_pepe_1` (Chano) **could**: "Pepe Santana. A month ago now, and La Isleta still talks about nothing else. Drowned. In his bed. Seventy-two years old, sixty years at sea, never so much as a cold." → "Pepe Santana. A month ago now, and La Isleta still talks about nothing else. Seventy-two years old, sixty years at sea, never so much as a cold." The very next line ("And he drowns in his own bed with the window shut") is the punchline, so this one says it first and flattens it.

## S.pinoMissal
Sense 3/5 · Naturalism 4/5. Strong folk voice, and the debt rule is set up clearly (rule 10). But the close-up shows her own name with "junio" and nobody says so, and Alan's "Yes" now comes after his own answer.
- `alan_th_pino_cistern` / `alan_th_debts` (Alan) **should**: play `alan_th_debts` ("Yes. [pause] I think I do.") before `alan_th_pino_cistern`, not after. This is a code-order fix in `thu.js` S.pinoMissal and needs no recording. "Yes" answers "You know something about this", so after the cistern speech it lands as a non-sequitur. The older fallback in `wed.js` already plays it straight after her line.
- `alan_th_pino_1` (Alan) **should**: "Doña Pino..." → "Doña Pino. [pause] Your name's next." The page has just shown "Pino Medina, junio", and the obvious reaction (rule 2) is never spoken. Her "You know what the old women said..." answers it well.
- `pino_th_pepe_3` (Doña Pino) **could**: "Not his heart. Not his age. Not drink. [pause] Pepe is el mar." → "Not his heart. Not his age. Not drink. [pause] Pepe was el mar." The present tense reads as "Pepe is the sea" (he has become it), not "the sea did it".

## S.carmenLore
Sense 4/5 · Naturalism 5/5. This is the bar for the week: it breathes, it is sideways and smoky, and every reveal gets its follow-up. Two optional answers are out of order or contradict themselves, and one of Alan's choices claims knowledge he doesn't have.
- `alan_ask_carmen_elena` (Alan) **must**: "The list says disc one came out in December. The night before Dr. Suárez died." → "The list says disc one came out in December. [pause] Dr. Suárez died in December." Alan has only heard "she died in December" (Baute, Tuesday), so he can't know the night. It also spells out Baute's secret (the first disc, then Elena the next night), which the bible keeps for Saturday.
- `carmen_th_monte_2` (Carmen) **should**: play it first, before `carmen_th_monte`. This is a code-order fix and needs no recording. "Don't get me started on Ignacio Montesdeoca" comes after she has already started.
- `carmen_th_magec` (Carmen) **should**: "El sol. Above everything. The sea answered to nothing, the old people said, except the sun. It doesn't answer to the sun either. It just goes quiet when the sun's watching." → "El sol. Above everything. The old people said el mar answered to nothing except the sun. [pause] Not that it obeyed. It just went quiet when the sun was watching." As written she contradicts the sentence before and then states the sea's behaviour as fact, which the "I believe in documents" archivist wouldn't do. The past tense keeps it as the old people's belief.
- `alan_ask_carmen_pepe` (Alan) **should**: "A fisherman drowned in his bed last month, in La Isleta. Doña Pino has a list." Gate this choice on `f.pino_list`, not `f.pepe_known`. This is a code fix and needs no recording. The choice opens as soon as Chano has spoken, so Alan can mention a list he hasn't seen yet.

## room colon_out
Sense 5/5 · Naturalism 4/5. One clean arrival line. Nothing to flag.

## room colon
Sense 5/5 · Naturalism 5/5. The examine lines are funny without being near the sea, which rule 7 allows, and the parrot calling the prettiest man on the island "feo" is a good inversion. Nothing to flag.

## S.readInquiryAloud
Sense 3/5 · Naturalism 4/5. The testimony is excellent, a real legal voice with dread underneath. The timeline of Juan's death doesn't hold together, though. A related mismatch is not in a line: the close-up page for fol. 11 (`docs.js`) says the sea went back "at noon on the day of Saint John", while `mercedes_read_6` and the bible say "at the rising of the sun". The page should be fixed, not the recording.
- `mercedes_juan_3` (Mercedes Quintana) **must**: "He drowned in his own bed eleven days later. With the window shut. The family has always said it was drink." → "He drowned in his own bed eleven days after he swore to this. With the window shut. The family has always said it was drink." Coming after "pulled him out of the water at Gáldar", "later" reads as eleven days after the rescue in 1483, which is impossible for a man who testifies in 1484 about the whole three months. The fol. 13 page says "after giving this testimony". Note for the story owner: a 1484 drowning sits after "the sea went back, and has not risen since", so either the line makes that oddness deliberate or the date moves.
- `mercedes_juan_2` (Mercedes Quintana) **could**: "...A heathen, saving a Castilian, in the middle of a war. He wrote that down too." → "...A heathen, saving a Castilian, in the middle of a war. He swore to that too." This is a sworn statement taken down by a notary, so "he wrote" is unclear (Juan, or the notary who appears two lines later?).

## S.talkMercedes
Sense 4/5 · Naturalism 5/5. Dry and exact, the parrot gets the last word, and the Holy Office answer is a fine payoff to "did anyone ask the women".
- `alan_th_mercedes_1` (Alan) **could**: "Carmen Trujillo sent me." → "Alan Sanches. Carmen Trujillo sent me." Mercedes calls him "Señor Sanches" and "a Portuguese bookseller" without ever being told his name.

## S.gdThu
Sense 5/5 · Naturalism 5/5. Good bickering, "they've put the sea on it" is right for the tourism theme, and "No. It isn't." is the right weight for the sea after Tuesday. Nothing to flag.

## S.suitcaseThu
Sense 5/5 · Naturalism 5/5. Nieves is perfect ("Something inside it has been crying"), and the plan "the way you have a fever" carries the avoidance theme. Nothing to flag.

## room museum_hall (arrival)
Sense 3/5 · Naturalism 5/5. The hello is tender and specific (the collar, the cough), and the talk has Vasco's lecturer voice. One factual line contradicts the cave as the game builds it.
- `vasco_th_speech_1` (Vasco) **must**: "...and carved its walls with triangles. Dozens of them, all pointing down." → "...and carved its walls with triangles. Seven of them, all pointing down." The game's cave has seven triangles for seven discs (Carmen's photograph on Friday, the lock), and the cave's own expert can't get the number wrong in his big speech.

## S.talkDerekDinner
Sense 4/5 · Naturalism 5/5. Lovely physical comedy ("apologising to everybody's legs"), and "Forgive me, Derek" lands the guilt.
- `derek_th_vasco` (Derek) **could**: "The professor? I've got twenty minutes of him already..." → "The professor? I've got ten minutes of him already..." Alan's whole window is Vasco's twenty minutes, so "twenty already" means the talk is over before the break-in starts.

## room baute_office
Sense 4/5 · Naturalism 4/5. The window line is the right kind of sea line for Thursday. But Alan comes up for a contract Gail said was framed in this office, and he never looks for it.
- `alan_look_desk` (Alan) **should**: "A big desk under a green-shaded lamp. One drawer locked. If there's a Montesdeoca file, it's in there." → "A big desk under a green-shaded lamp. No contract in a frame, whatever Gail says. One drawer locked. If there's a Montesdeoca file, it's in there." This closes the setup from `gail_th_contract` ("framed in Dr. Baute's office") and makes Montesdeoca's "Frame it!" a joke at his own boast.

## S.searchDesk
Sense 3/5 · Naturalism 4/5. "The most boring document I have ever read, and I sell books" is a keeper. But the 1966 photograph, Baute's motive and a clue the player needs later, gets no reaction: Alan goes straight to "And the map". Also not in a line: Alan quotes "Twenty-fourth, mediodía" from the map, but the map's close-up caption (`docs.js` readBauteDesk) doesn't show that note. The caption should add it.
- `alan_th_desk_1` (Alan) **should**: "And the map. Maspalomas, Playa del Inglés, San Agustín. Six hotels circled in red, and four of them are Montesdeoca's." → "A bulldozer, a hill of caves, bones in a skip. 'Abuela's hill.' [pause] And the map. Six hotels on the south coast circled in red, and four of them are Montesdeoca's." Rule 2: the photograph needs at least one beat from Alan. The longer line pays for it by dropping the three place names, which the close-up already shows.
- `alan_th_desk_2` (Alan) **could**: "'Twenty-fourth, mediodía.' Noon. [pause] It's him..." → "'Twenty-fourth, mediodía.' Noon. [pause] It's Montesdeoca..." In Baute's office, over Baute's map, "him" can be heard as Baute, which spoils the red herring the scene is building.

## S.caught
Sense 4/5 · Naturalism 4/5. Baute's graciousness is worse than anger, as it should be. Montesdeoca is in voice ("Gratis! Frame it!"), and the night exchange with Vasco is the best four lines of the day. The silent ride home drops two motifs the rules name for this night.
- `narr_thu_night` (Narrator) **should**: "They took a taxi back to the hotel, and neither of them said anything in the taxi." → "A silent taxi. Nieves's eyebrow didn't move. The lift sneezed, and nobody laughed." Rule 8 puts Nieves's unmoving eyebrow on Thursday night, and the bible's version of the scene has the lift. This replaces the line rather than adding narrator, and it fixes "taxi ... taxi".

## Summary of flags

| severity | line id | speaker | problem (short) |
| --- | --- | --- | --- |
| must | `chano_th_pepe_6` | Chano | "Now two" unclear; gives away Pino's count early |
| must | `alan_ask_carmen_elena` | Alan | knows Elena's exact night; spoils Saturday's secret |
| must | `mercedes_juan_3` | Mercedes Quintana | "eleven days later" impossible against the 1484 testimony |
| must | `vasco_th_speech_1` | Vasco | "dozens" of triangles; the game's cave has seven |
| should | `alan_th_wake` | Alan | "midnight" contradicts Wednesday's "after ten" |
| should | `alan_th_debts` / `alan_th_pino_cistern` | Alan | "Yes" comes after his own answer (swap order) |
| should | `alan_th_pino_1` | Alan | nobody says Pino's name is next |
| should | `carmen_th_monte_2` | Carmen | "Don't get me started" after she started (swap order) |
| should | `carmen_th_magec` | Carmen | contradicts itself; sceptic states lore as fact |
| should | `alan_ask_carmen_pepe` | Alan | can cite Pino's list before seeing it (gating) |
| should | `alan_look_desk` | Alan | framed contract from Gail's setup never checked |
| should | `alan_th_desk_1` | Alan | 1966 photograph gets no reaction |
| should | `narr_thu_night` | Narrator | misses the eyebrow/lift motifs; "taxi" twice |
| could | `chano_th_pepe_1` | Chano | gives the punchline one line early |
| could | `pino_th_pepe_3` | Doña Pino | "Pepe is el mar" reads the wrong way |
| could | `mercedes_juan_2` | Mercedes Quintana | "He wrote that down" unclear |
| could | `alan_th_mercedes_1` | Alan | Mercedes uses a name nobody gave her |
| could | `derek_th_vasco` | Derek | "twenty minutes already" breaks the twenty-minute clock |
| could | `alan_th_desk_2` | Alan | "It's him" can be heard as Baute |
