# Wednesday and Thursday: the lines to read (2026-10-31, the narrator cut back)

The user: "over all, with your re-works there is way too much narrator. We don't need that much description. Some things
should simply be done by the characters, other just said by the characters - we don't need to have it all described",
and "It is not only the finale with the narrator - it is basically the entire game, after you've redone it based on the
novel".

So Wednesday (`js/story/wed.js`) and Thursday (`js/story/thu.js`, Inês's Thursday call in `js/story/core.js` S.callThu,
folio 12 and the talk's clock in `js/story/puzzles.js`) were gone through line by line, the same way as Cave 6
(`docs/puzzles/CAVE6_LINES.md`): what the game shows (the rooms, the people standing in them, the two stills, the
close-ups of the missal, the inquiry and Baute's desk) or what a character can do (walk, a pose, a sound, a pause) is no
longer narrated; what the player needs is said by Alan, Doña Pino, Don Fermín, Carmen, Mercedes, Gail, Derek, the
museum guard; the narrator keeps the day's opener, the time jumps over black, Pell's boat (the bible: narrated, "Alan
didn't notice it. Nobody did."), the two "kind of decision that felt ... at the time" asides, Pepe Santana's two lines, the
jacket's joke and the sea under the sea at the end of Thursday.

**Counts** (every line the two days' scenes play; character lines include the few lines for other days in the same
files, which did not change):

| | before | after |
|---|---|---|
| narrator lines played | 186 | 12 |
| narrator words | 4469 | 190 |
| character lines played | 345 | 394 (the same 345, 48 new ones, and Elena's recorded message from the prologue) |
| character words | 4957 | 5682 |

174 narrator lines are no longer played (they stay in `js/lines.js`); 6 lines changed (5 narrator lines shortened, each
taking over what a cut neighbour said, and one Alan line corrected: Pepe drowned "last month", not "last night", as Chano,
Doña Pino and the still all say); 48 new lines, all characters. The longest narrator line left is 26 words. No
character line was cut, and no clue: the ones that lived in narration are now said (the blank June line on Carmen's
conservation list: Alan; the sponsorship file: Alan; the van and its "display cases from Don Ignacio": Alan and the guard;
folio 12 misfiled on purpose: Mercedes; Juan de Quintana and Pepe, both pulled out of the sea and drowned in bed: Alan to
Mercedes). Nothing is recorded: the new lines play as captions; the 6 changed lines' old recordings moved to
`audio/voice_stale/` and their ids are in `scripts/voice_redo.txt`. Ids never renamed.

Done in code now instead of narrated: Alan stretches and drinks the terrible coffee (poses), walks to the bronze dogs
and reads the letter, pulls at the clock and a fade for the twenty minutes, lays a hand on the bell (it hums), takes the
packet, walks to the van's crate and reads it, unlaces Vasco's boots, walks over to Vasco at the dinner, reads the file,
reaches for the map; Derek walks across the hall into the guard's chair; sounds for the dawn (a floorboard, a drawer, the
laugh, the door), the climb, the chest, the stubbed cigarette, the filing cabinet, the book, the three matches, the
lottery coins, the snore and the lamp, the cabinet and pages at Casa de Colón, pages down the phone line, the steps of
Vasco going down the stairs; pauses for the silences (Carmen going still, Fermín very still, Inês quiet).

Below, each scene in play order, as it now plays. *Italics* are what the game shows or the characters do (no line).
Status: **new**, **changed** (this pass) or unchanged.

### Wednesday: dawn, room 404

Alan in bed, hidden; Vasco heard, not seen.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_w_dawn_1` | narr | Vasco left at dawn. | unchanged |
| | | | *a floorboard, a drawer: a tall man trying to be quiet (floor_creak, drawer_scrape)* | |
| 2 | `vasco_w_dawn_1` | vasco | Coffee's by the bed. It's terrible. It's from the machine in the lobby. Nieves made me promise not to tell anyone it exists. | unchanged |
| 3 | `alan_w_dawn_1` | alan | Mm. | unchanged |
| 4 | `vasco_w_dawn_2` | vasco | I'll be back for dinner. Late. Go and see the island. | unchanged |
| 5 | `alan_w_dawn_1` | alan | Mm. | unchanged |
| 6 | `vasco_w_dawn_3` | vasco | Alan. [pause] Are you all right? Last night, on the promenade. You looked like you'd seen a ghost. | unchanged |
| 7 | `alan_w_dawn_say` | alan | Say it. I did see a ghost. The thing from the cistern. It's here, and I'm frightened. | **new** |
| 8 | `alan_w_dawn_3` | alan | Sunburn. [pause] I'm delicate. | unchanged |
| | | | *Vasco laughs softly (v_vasco_laugh); the door; a pause* | |
| | | | *Alan up: he stretches, and drinks the coffee (poses stretch, drink)* | |
| 9 | `alan_w_coffee` | alan | [pause] He was right. It's terrible. | **new** |
| 10 | `alan_w_wake` | alan | Up the mountain, into the sun. Down here it's grey, and I have a whole day and nothing to do with it but worry. | unchanged |

### Wednesday: La Isleta, Doña Pino

The quay, the nets and the finds are painted; no arrival narration.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_w_pino_0` | alan | A pot furred with weed. An iron ball grown over with coral. And a helmet, with a crab living in it. | **new** |
| 2 | `alan_w_pino_1` | alan | That's old. | unchanged |
| 3 | `pino_w_2` | pino | Fourteen seventy-eight. The year the Castilians came. My grandson took one like it to el museo last week, and they told him. | unchanged |
| 4 | `pino_w_2b` | pino | Five hundred years in el mar, and it comes up in my net in the same week. | unchanged |
| 5 | `pino_w_crab` | pino | Fuera, cangrejo. Go and find your own house. | **new** |
| | | | *the crab tipped back into the harbour (splash)* | |
| 6 | `pino_w_2c` | pino | Every day this week. Every day, something. Cannonballs. Crossbow bolts. Pots. A sword on Saturday, all in one piece. [pause] The sea's emptying its pockets. | unchanged |
| 7 | `alan_w_pino_2` | alan | Why? | unchanged |
| 8 | `pino_w_3` | pino | Because it's looking for something. When you lose something, you empty your pockets. | unchanged |
| 9 | `pino_w_1` | pino | Pino. Doña Pino, to you. That's Lolo. He doesn't talk. | unchanged |
| 10 | `lolo_w_talk` | lolo | I talk. | unchanged |
| 11 | `pino_w_tourists` | pino | He doesn't talk to tourists. | unchanged |
| 12 | `alan_w_pino_3` | alan | I'm not a tourist. I'm Portuguese. | unchanged |
| 13 | `pino_w_worse` | pino | That's worse. The Portuguese think they own el mar. | unchanged |
| 14 | `pino_w_pretty` | pino | Pretty, though. Lolo, mira. A pretty one. [pause] Pity about the trousers. | unchanged |
| 15 | `alan_w_pino_shy` | alan | Thank you. I think. [pause] The trousers have had a very difficult week. | unchanged |
| 16 | `pino_w_memory_1` | pino | You know what the old people said here, when I was a girl? They said the sea has a memory. | unchanged |
| 17 | `pino_w_memory_2` | pino | It never forgets anything it's taken. [pause] And it never forgets anything that was taken back from it. | unchanged |
| 18 | `pino_w_restless` | pino | It's been very quiet for a long time, the sea here. Five hundred years. Now it's restless. [pause] No me gusta. I don't like it. | unchanged |
| 19 | `alan_w_pino_4` | alan | No. [pause] Neither do I. | unchanged |
| | | | *a ship's bell across the harbour* | |
| 20 | `narr_w_pell_1` | narr | Across the harbour, a grey salvage boat: Atlantic Recovery, Pell Marine, Nassau. Two men on her deck, watching. Alan didn't notice it. Nobody did. | **changed** |
| | | | *then the questions, as before (the sword, Lolo)* | |

### Wednesday: Plaza de Santa Ana, first time

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_w_decide_1` | alan | I've made up my mind. I tell Vasco tonight. Properly. Sit him down, pour him a drink, and say it plainly. | **new** |
| 2 | `alan_w_decide_2` | alan | But first I find out what I can. So I sound less like a man who's frightened of the sea, and more like one who knows something. | **new** |
| 3 | `narr_w_decide_4` | narr | It was the kind of decision that felt brave at the time. | unchanged |
| 4 | `alan_w_plaza` | alan | Cathedrals are where bells are. And bells, in my experience, are where trouble is. | **new** |

### Wednesday: the nave, Don Fermín

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the clock above grinding and failing to strike (clock_wind), a pause* | |
| 1 | `alan_w_fermin_1` | alan | It's stuck. | unchanged |
| 2 | `fermin_w_1` | fermin | It has been stuck since Sunday. The man who winds it is in hospital with his gallbladder. | unchanged |
| 3 | `fermin_w_2` | fermin | The man who replaces the man who winds it is on holiday in Fuerteventura. The bishop says, Fermín, wind it yourself. | unchanged |
| 4 | `fermin_w_3` | fermin | Fermín is seventy-six years old and has a heart like a broken accordion. [pause] The bishop is not seventy-six. | unchanged |
| | | | *"Let me wind it."* | |
| 5 | `fermin_w_clocks` | fermin | You know clocks? | unchanged |
| 6 | `alan_w_bells` | alan | I know bells. My family made them. A long time ago. | unchanged |
| 7 | `alan_w_bells_2` | alan | [pause] Now why did I tell him that? | **new** |
| | | | *the ring of keys held out (keys)* | |
| 8 | `fermin_ring` | fermin | The clock key's on the ring. It has a bell on its bow, like everything here. Which one is it? | unchanged |

### Wednesday: the bell chamber

The chamber, the clock and the bells are painted.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the climb (stairs)* | |
| 1 | `fermin_w_steps` | fermin | Ciento doce. A hundred and twelve steps, señor, and I die on every landing. | **new** |
| 2 | `fermin_w_landing` | fermin | Not this one. [pause] The next one, señor. Tell the bishop. | unchanged |
| | | | *the drum: Alan pulls at it (pose pull, clock_wind x3)* | |
| 3 | `alan_w_clock_0` | alan | Something in the escapement's slipped a tooth. [pause] Come on. Come on, you old... | **new** |
| | | | *fade: twenty minutes; one more pull* | |
| | | | *it ticks (grandfather_tick), it chimes* | |
| 4 | `alan_w_clock` | alan | There. [pause] I'd like my skin back, but there. | unchanged |
| 5 | `fermin_founder_hands` | fermin | Founder's hands. | unchanged |
| 6 | `alan_w_hands` | alan | What? | unchanged |
| 7 | `fermin_name` | fermin | You have founder's hands. My grandfather said you could always tell. The men who make bells understand the things that hang. | unchanged |
| 8 | `fermin_w_yourname` | fermin | What did you say your name was? | unchanged |
| 9 | `alan_w_name` | alan | Sanches. Alan Sanches. | unchanged |
| | | | *a pause: the old man very still* | |
| 10 | `fermin_bell_show` | fermin | Come. Look at her waist. Where the shadow is. | unchanged |
| | | | *the north bell, looked at* | |
| 11 | `alan_look_bell_mark` | alan | The S between two bells. And round it, a ring of tiny letters. [pause] Sanches me fez. Lisboa. 1751. | unchanged |
| 12 | `alan_w_bell_lisbon` | alan | Sanches made me. [pause] I've seen this mark at the bottom of a flooded tower in Lisbon. On my grandfather's books. In my dreams. | **new** |
| | | | *his hand on the bronze (pose reach); it hums (bell_hum_soft)* | |
| | | | *Fermín, after the mark* | |
| 13 | `fermin_founders_1` | fermin | The founders came from Lisbon, señor. In seventeen fifty-one. On a ship, with their tools in the hold, to make a bell for Santa Ana. A gift, they said. | unchanged |
| 14 | `fermin_founders_2` | fermin | They cast her here, with their own hands. And then they went up into the mountains for a month. | unchanged |
| 15 | `fermin_founders_3` | fermin | My grandfather's grandfather was sacristan then. He wrote it down. He said it was the strangest thing. | unchanged |
| 16 | `fermin_founders_4` | fermin | Bell founders, from Lisbon. [pause] And they came to look at the mountain, not el mar. | unchanged |
| 17 | `alan_w_founders_q` | alan | What were they looking for? | unchanged |
| | | | *the chest opened (drawer_open), a pause* | |
| 18 | `alan_w_wax` | alan | Oilcloth, and black wax. [pause] And in the wax, the same mark. | **new** |
| 19 | `fermin_letter_1` | fermin | They left this. With my family. 'For the next founder who comes.' That's what it says on the outside. | unchanged |
| 20 | `fermin_letter_2` | fermin | Two hundred and forty-five years we've kept it. My father said, Fermín, nobody will ever come. [pause] My father was wrong about many things. | unchanged |
| | | | *Alan takes it (pose pickup, paper_take)* | |
| 21 | `alan_w_letter_take` | alan | It weighs nothing. [pause] It feels heavier than the bell. | **new** |
| 22 | `alan_w_fermin_thanks` | alan | I'll come back and tell you what it says. When I know. | unchanged |
| 23 | `fermin_belfry_again` | fermin | Do. Before I die on the stairs. [pause] And mind the third step on the way down, señor. | unchanged |

### Wednesday: the plaza, the letter opened

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *he walks to the bronze dogs and opens it (pose read, paper)* | |
| 1 | `alan_w_open_0` | alan | Four sheets, both sides, in a small brown hand. Portuguese. The Portuguese of two and a half centuries ago. | **new** |
| 2 | `alan_w_open_1` | alan | Aos que vierem depois de nós. [pause] To those who come after us. | unchanged |
| 3 | `alan_w_open_mar` | alan | And further down: Mar. The Sea. [pause] With a capital letter. | **new** |
| 4 | `alan_w_letter` | alan | One word in four I can read. Inês can read all of them. [pause] Inês needs a fax machine. | unchanged |

### Wednesday: the museum hall, the van

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *chair_scrape* | |
| 1 | `alan_w_van` | alan | A van at the side door. Montesdeoca Hoteles, in gold letters. They're loading crates into it. | **new** |
| | | | *he walks to the side door and reads the nearest crate's sheet (pose read)* | |
| 2 | `alan_w_crate_1` | alan | 'Conservation transfer. Risco Caído, Cave 6.' [pause] 'Obsidian disc, polished, two of seven. Removed for conservation. Twentieth of January.' | unchanged |
| 3 | `alan_w_crate_2` | alan | And under it, the others. One a month since December. Six lines, six signatures. [pause] And the crate's going down the hill today. | unchanged |
| 4 | `guard_w_van` | guard | Display cases, señor. Nuevas. A gift for el museo, from Don Ignacio. | **new** |
| 5 | `alan_w_crate_3` | alan | And the discs? | unchanged |
| 6 | `guard_w_carry` | guard | I just carry them, señor. | **new** |

### Wednesday: the archive, Carmen

After the toll (unchanged).

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_w_arch` | alan | 'Prohibido fumar.' [pause] And Carmen Trujillo, smoking under it. | **new** |
| 2 | `carmen_w_1` | carmen | No. | unchanged |
| 3 | `alan_w_carmen_0` | alan | I haven't asked anything. | unchanged |
| 4 | `carmen_w_no2` | carmen | You were going to. | unchanged |
| 5 | `alan_w_carmen_discs` | alan | The discs from the cave. The obsidian ones. There's a list upstairs. One a month, since December. Why? | unchanged |
| 6 | `carmen_w_cons` | carmen | Conservation. | unchanged |
| 7 | `alan_w_carmen_cons` | alan | Of what? They've been there five hundred years. | unchanged |
| 8 | `carmen_w_cons2` | carmen | That's why they need conserving. | unchanged |
| | | | *back to her file (page), a pause* | |
| 9 | `alan_w_carmen_name` | alan | Carmen. | unchanged |
| 10 | `carmen_w_desk` | carmen | Mi mesa, Señor Sanches. Not a chair. | **new** |
| 11 | `alan_w_carmen_1` | alan | Last night on the beach there was a mist. A black mist. It came in off the sea against the wind. | unchanged |
| 12 | `alan_w_carmen_2` | alan | It smelled of salt, and of something old. I've smelled it before, in Lisbon. And when I smelled it there, people died. | unchanged |
| | | | *a pause* | |
| 13 | `alan_w_carmen_pen` | alan | [pause] Your pen's stopped, Doctor. | **new** |
| 14 | `alan_w_carmen_helmet` | alan | And today I watched an old woman in La Isleta pull a conquistador's helmet out of her net. She says the sea's been giving things back all week. | unchanged |
| 15 | `alan_w_carmen_cave` | alan | And at the same time, somebody is taking the cave apart, one piece a month, and calling it conservation. | unchanged |
| 16 | `carmen_w_2` | carmen | It's June. It's the panza de burro. Every June the cloud comes down, and the tourists see shapes in it. | unchanged |
| 17 | `carmen_w_june2` | carmen | Every June the fishermen pull up junk, because the currents change. Every June someone comes into my archive with a theory. | unchanged |
| | | | *the cigarette stubbed out (glass_set)* | |
| 18 | `carmen_w_3` | carmen | Go to la playa, Señor Sanches. Swim. In the daytime. Go and buy your boyfriend a present. It's a beautiful island. Enjoy it. | unchanged |
| | | | *her back to him, a box pulled down (filing_cabinet)* | |
| 19 | `alan_w_carmen_photo` | alan | A photograph on the corner of her desk, face down. [pause] I don't touch it. | **new** |
| 20 | `alan_w_carmen_thanks` | alan | Thank you. | unchanged |
| 21 | `carmen_w_senor` | carmen | Señor Sanches. | unchanged |
| | | | *the book held out behind her (book_take)* | |
| 22 | `carmen_w_galindo` | carmen | Abreu Galindo, fifteen-nineties. If you want to understand this island, start with the people it belonged to. | unchanged |
| 23 | `carmen_w_galindo2` | carmen | Read the part about the harimaguadas. [pause] And bring it back. It's the archive's copy. If you get sand in it, I'll have you deported. | unchanged |
| | | | *Alan goes up the stairs (stairs); fade; Carmen alone in the archive* | |
| 24 | `carmen_w_alone` | carmen | Two idiots on a mountain, squinting at el sol. [pause] I still haven't erased your message, Elena. | **new** |
| | | | *Elena's message, in her head (off screen)* | |
| 25 | `elena_msg_02` | elena | And it isn't a calendar either. I've been reading it wrong for a year. [pause] It's a door, Carmen. And someone's opening it. | unchanged |
| | | | *the lighter: three tries (match x3)* | |
| | | | *back to the hall* | |

### Wednesday: Las Canteras, Chano's theory

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `chano_w_th_1` | chano | You've been to el museo. You saw Montesdeoca's van. | unchanged |
| 2 | `alan_w_chano_1` | alan | How do you... | unchanged |
| 3 | `chano_w_th_2` | chano | Everyone saw Montesdeoca's van. Montesdeoca's van is very big. | unchanged |
| 4 | `chano_w_th_3` | chano | You know what he wants? A hotel in Artenara. A big one. Guanche-themed. With a cave restaurant, and waiters in goatskins, hombre. | unchanged |
| 5 | `chano_w_th_4` | chano | And the only thing in his way is that dig. If the cave's important, he can't build. But if somebody proves the cave's not important... | unchanged |
| | | | *coins: a lottery ticket sold, a pause* | |
| 6 | `alan_w_chano_2` | alan | Montesdeoca, nodding along while Vasco explained the light, as if he understood every word. | **new** |
| 7 | `alan_w_chano_3` | alan | It makes sense. It's neat. [pause] It's exactly what a frightened man would like to be true. | **new** |

### Wednesday: room 404, night

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *fade: the evening goes by* | |
| 1 | `narr_w_night_1` | narr | Vasco didn't get back until after ten. | unchanged |
| | | | *the door; the bed springs* | |
| 2 | `vasco_w_night_1` | vasco | I love it. I love it so much. [pause] My back is broken. | unchanged |
| | | | *Alan unlaces the boots (pose pickup)* | |
| 3 | `alan_w_boots` | alan | Boots off, professor. [pause] Come here. | **new** |
| 4 | `vasco_w_night_2` | vasco | Six sockets empty now. They came out before I got here, one a month. Rayco's sent them all down to the city for conservation. I signed the papers for the lot my first week. | unchanged |
| 5 | `vasco_w_night_3` | vasco | He wants them stabilised before the public opening in the autumn. He's right, obsidian splits along the grain. | unchanged |
| 6 | `vasco_w_night_4` | vasco | But I hate it. I hate seeing the empty sockets. [pause] It's like a smile with teeth missing. | unchanged |
| 7 | `alan_w_night_1` | alan | Vasco. | unchanged |
| | | | *a snore; the lamp clicks off* | |
| 8 | `alan_w_night_2` | alan | Tomorrow, then. At the dinner. After his talk, when he's happy. | **new** |
| 9 | `narr_w_night_9` | narr | It was the kind of decision that felt kind at the time. | unchanged |

### Wednesday: Pepe Santana (still_pepe)

The still shows him in bed, shutters closed, door barred; the sea is heard.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_pepe_1` | narr | A month before, on the night of the new moon, in La Isleta, a fisherman called Pepe Santana went to bed with the window shut. | **changed** |
| | | | *a pause; water lapping; water rising* | |
| 2 | `narr_pepe_9` | narr | He only said, very quietly, into the dark: 'Ah. There you are.' | unchanged |
| | | | *the water drains* | |

### Thursday: the kiosk, Chano's news

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `chano_th_pepe_1` | chano | Pepe Santana. A month ago now, and La Isleta still talks about nothing else. Drowned. In his bed. Seventy-two years old, sixty years at sea, never so much as a cold. | unchanged |
| 2 | `chano_th_pepe_2` | chano | And he drowns in his own bed with the window shut. Ay, Dios. | unchanged |
| 3 | `chano_th_pepe_3` | chano | His son found him. The doctor said heart. Heart, hombre, with his lungs full of seawater. | unchanged |
| 4 | `chano_th_pepe_4` | chano | My cousin's wife's sister lives next door. She heard nothing. Not a sound. That's what frightens her. | unchanged |
| | | | *a pause* | |
| 5 | `alan_th_chano_1` | alan | Where in La Isleta? | unchanged |
| 6 | `chano_th_pepe_5` | chano | Calle Pescadores. By the harbour. Why? | unchanged |
| 7 | `alan_th_chano_2` | alan | There's an old woman on the quay there. Small, in black. She sorts the catch like she's judging it. | unchanged |
| 8 | `chano_th_pepe_6` | chano | Doña Pino. Sí. She was on the same boat as Pepe, in seventy-one. The Virgen del Pino. [pause] Seven came up out of el mar the next morning. Since Christmas they've been going, one a month. Now two. | unchanged |

### Thursday: the archive, Carmen's history

After the toll.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `carmen_th_1` | carmen | You read it. | unchanged |
| 2 | `alan_th_carmen_1` | alan | Most of it. Your friar is very rude about the Portuguese. | unchanged |
| 3 | `carmen_th_rude` | carmen | He was a Franciscan. He was rude about everyone. | unchanged |
| 4 | `carmen_th_sit` | carmen | Siéntate. [pause] Don't get used to it. | **new** |
| 5 | `alan_th_carmen_2` | alan | The harimaguadas. Tell me about them. Properly. Not the friar's version. | unchanged |
| 6 | `carmen_th_harimaguadas` | carmen | The island's own priestesses. Young women, unmarried, living apart, on the cliffs and in the mountains. They bathed in el mar at dawn, for the island's sake. | unchanged |
| 7 | `carmen_th_harimaguadas_2` | carmen | Rain, sun, the dead: that was theirs. The Spanish called them vestals, because it was the only word they had. | unchanged |
| 8 | `carmen_th_harimaguadas_3` | carmen | When the island fell, they vanish from every record. Not killed. Not baptised. Not married off. Just gone, between one page and the next. | unchanged |
| 9 | `alan_th_carmen_3` | alan | And when did it fall? | unchanged |
| 10 | `carmen_th_conquest` | carmen | It took five years. People think it was quick. It wasn't. | unchanged |
| 11 | `carmen_th_conquest_2` | carmen | June 1478. Juan Rejón lands at the mouth of the Guiniguada and builds a stockade, on Saint John's day. Mira: that's your old lady's helmet. | unchanged |
| 12 | `carmen_th_ansite` | carmen | Then five years of war in the mountains. April 1483, the last of our people are up at Ansite, in the south. | unchanged |
| 13 | `carmen_th_ansite_2` | carmen | Bentejuí, the last war chief, and the faycán of Telde, the high priest, walk to the edge of a cliff together and throw themselves off it rather than surrender. | unchanged |
| 14 | `carmen_th_ansite_3` | carmen | Atis Tirma, they shouted. For my land. The rest come down and are baptised. Fin. End of story. | unchanged |
| 15 | `alan_th_carmen_4` | alan | Is there a story about the priestesses and the sea? At the end? | unchanged |
| | | | *a pause: she goes very still* | |
| 16 | `carmen_th_who` | carmen | Who told you that? | unchanged |
| 17 | `alan_th_carmen_5` | alan | An old woman in La Isleta. Sort of. | unchanged |
| | | | *another cigarette (match), a pause* | |
| 18 | `carmen_th_legend` | carmen | There's a story. Rayco used to tell it. Dr. Baute. He taught me, twenty years ago, at the university. At the end of term, with the lights off. | unchanged |
| 19 | `carmen_th_legend_2` | carmen | In the last spring of the war, when the Castilian ships came round to the north coast, the harimaguadas went down to the shore at night and called el mar up against them. | unchanged |
| 20 | `carmen_th_legend_3` | carmen | And it came. And it didn't stop. It took the ships, and then the coast, and then our own villages. | unchanged |
| 21 | `carmen_th_legend_4` | carmen | And the women went up into the mountains, to a cave where the sun comes in through the roof, and shut it out again. With the light. | unchanged |
| 22 | `alan_th_risco` | alan | Risco Caído. | unchanged |
| 23 | `carmen_th_risco` | carmen | Where your boyfriend is spending his week, sí. [pause] It's a fairy tale. It's what you tell students when you want them to feel something about five hundred years ago. | unchanged |
| 24 | `carmen_th_grandmothers` | carmen | The old women in Artenara used to say la cueva aguanta el mar. The cave holds the sea down. My grandmother said it. Everybody's grandmother said it. | unchanged |
| 25 | `alan_th_believe` | alan | Do you believe it? | unchanged |
| 26 | `carmen_th_believe` | carmen | I'm an archivist. I believe in documents. | unchanged |
| 27 | `alan_th_documents` | alan | Then where are the documents? | unchanged |
| 28 | `carmen_th_colon` | carmen | Not here. We have bones and pots. The Castilians kept the paper. | unchanged |
| 29 | `carmen_th_colon_2` | carmen | Casa de Colón. Behind Santa Ana. Ask for Mercedes Quintana. [pause] She'll hate you. She hates everyone who isn't dead. | unchanged |
| | | | *the questions as before; and Pepe, once Alan knows:* | |
| 30 | `alan_ask_carmen_pepe` | alan | A fisherman drowned in his bed last month, in La Isleta. Doña Pino has a list. | **changed** |
| | | | *a pause* | |
| 31 | `alan_th_carmen_list` | alan | Her eyes go to the conservation list. December, January, down to May. [pause] And one line more, blank. June. | **new** |
| 32 | `carmen_th_pepe` | carmen | I have work. Go away, Señor Sanches. | unchanged |

### Thursday: La Isleta, Doña Pino's missal

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_ask_pino_pepe` | alan | Pepe Santana. The fisherman. Did you know him? | unchanged |
| 2 | `pino_th_pepe_1` | pino | The Virgen del Pino. Nineteen seventy-one. Eleven men and one woman, because the cook was sick and I went in his place, for the money. | unchanged |
| 3 | `pino_th_pepe_1b` | pino | A storm off Cape Bojador. She went down in four minutes. We were in el mar all night, and in the morning a fishing boat pulled seven of us out. | unchanged |
| 4 | `pino_th_pepe_2` | pino | I keep the names in my missal, mi niño. Look. | unchanged |
| | | | *the missal's page (close-up)* | |
| 5 | `pino_th_pepe_3` | pino | Not his heart. Not his age. Not drink. [pause] Pepe is el mar. | unchanged |
| 6 | `alan_th_pino_1` | alan | Doña Pino... | unchanged |
| 7 | `pino_th_debts` | pino | You know what the old women said, when I was a girl? El mar never forgets a debt. | unchanged |
| 8 | `pino_th_debts_2` | pino | It gives you back, sometimes, if it's in a good mood, or busy, or not hungry. But it writes you down. And one day it comes to collect. | unchanged |
| 9 | `pino_th_know` | pino | You know something about this. I saw it yesterday. You looked at my helmet like it was a letter addressed to you. | unchanged |
| 10 | `alan_th_pino_cistern` | alan | The cistern under Lisbon. Black water to my chest, and the thing in the dark that knew my blood. [pause] It let me go. Now it's here. | **new** |
| 11 | `alan_th_debts` | alan | Yes. [pause] I think I do. | unchanged |

### Thursday: Casa de Colón

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *outside, first time* | |
| 1 | `alan_th_colon_out` | alan | Casa de Colón. Columbus stayed here in 1492, they say, while they mended the Pinta's rudder. | **new** |
| | | | *inside, first time: the courtyards and the parrots are painted* | |
| 2 | `parrot_th_rude` | parrot | ¡Guiri! ¡Guiri feo! | unchanged |
| | | | *Mercedes, first talk* | |
| 3 | `alan_th_merc_look` | alan | That look over the glasses. Carmen does it too. [pause] They must teach it at the university. | **new** |
| 4 | `alan_th_mercedes_1` | alan | Carmen Trujillo sent me. | unchanged |
| 5 | `mercedes_1` | mercedes | Then you have my sympathy, señor, but not my time. | unchanged |
| 6 | `alan_th_mercedes_2` | alan | She said you'd hate me. | unchanged |
| 7 | `mercedes_2` | mercedes | She's usually right. | unchanged |
| 8 | `mercedes_3` | mercedes | What do you want? | unchanged |
| 9 | `alan_th_mercedes_3` | alan | Fourteen eighty-three. The end of the conquest. I've heard the Canario story: the priestesses calling up the sea. | unchanged |
| 10 | `alan_th_mercedes_4` | alan | I want to know what the Castilians saw. | unchanged |
| | | | *the cabinet (drawer_open), the bundle (paper)* | |
| 11 | `mercedes_inquiry` | mercedes | Información de testigos. Fourteen eighty-four. An inquiry, by order of the Catholic Monarchs, into the loss of three of the Crown's ships and the royal camp on the north coast, the year before. | unchanged |
| 12 | `mercedes_inquiry_2` | mercedes | Sworn statements. Sailors, soldiers, a priest. Nobody has asked to see it in eleven years. Most historians think it's an embarrassment. They prefer the battles. | unchanged |
| 13 | `mercedes_read_1` | mercedes | 'The third witness, Juan de Quintana, master of the caravel Santa Clara, being sworn, said: that on the eve of the equinox, with the ships at anchor off Gáldar and no wind, the sea rose.' | unchanged |
| 14 | `mercedes_read_2` | mercedes | 'That it rose black, black as pitch, and came against the wind, which was blowing off the land. That it took the ships at their anchors with all their people, and this witness was thrown into the water.' | unchanged |
| 15 | `mercedes_read_3` | mercedes | 'That it came over the shore into the royal camp, and drowned men in their tents who had not been near the water. That it went on into the villages of the heathen, and he heard their women screaming.' | unchanged |
| 16 | `mercedes_read_4` | mercedes | 'And that on the cliffs above Gáldar, by the light of the fires, this witness saw women in white, standing in a line, singing.' | unchanged |
| | | | *a page* | |
| 17 | `mercedes_read_5` | mercedes | 'Asked how long the sea continued, he said: that it came every night thereafter, for three months, into the low places, and into houses, and into the beds of men, and took them, and no priest could stop it.' | unchanged |
| 18 | `mercedes_read_6` | mercedes | 'And that on the morning of the blessed Saint John the Baptist, at the rising of the sun, the sea went back, and has not risen since.' | unchanged |
| | | | *a page; the inquiry (close-up)* | |
| 19 | `mercedes_san_juan` | mercedes | The bishop declared it a miracle of the Baptist. That is why, every year, on the night of San Juan, this whole city goes down to la playa and walks into the water at midnight. | unchanged |
| 20 | `mercedes_san_juan_2` | mercedes | To thank the saint for sending it back. Five hundred years. Nobody remembers. They just do it. | unchanged |
| 21 | `alan_th_inquiry` | alan | Juan de Quintana. | unchanged |
| 22 | `mercedes_juan` | mercedes | My ancestor. Sí. | unchanged |
| 23 | `mercedes_juan_2` | mercedes | He survived the Santa Clara. A Canario fisherman pulled him out of the water at Gáldar. A heathen, saving a Castilian, in the middle of a war. He wrote that down too. | unchanged |
| 24 | `mercedes_juan_3` | mercedes | He drowned in his own bed eleven days later. With the window shut. The family has always said it was drink. | unchanged |
| | | | *the last page, the margin (page)* | |
| 25 | `mercedes_women` | mercedes | The notary. He wrote this at the end, after all the witnesses. It isn't part of the record. I don't think he meant anyone to read it. | unchanged |
| 26 | `alan_th_nadie` | alan | 'Nadie preguntó a las mujeres.' [pause] Nobody asked the women. | unchanged |
| | | | *back in the cabinet, locked (drawer_open)* | |
| 27 | `mercedes_why` | mercedes | Now. Why does a Portuguese bookseller want to know how el mar took the Crown's ships five hundred years ago? | unchanged |
| 28 | `alan_th_merc_pepe` | alan | A fisherman in La Isleta. Pulled out of the sea twenty-five years ago. Last month he drowned in his bed, with the window shut. | **new** |
| 29 | `alan_th_again` | alan | Because it's doing it again. | unchanged |
| 30 | `mercedes_low` | mercedes | Then I would stay out of the low places, Señor Sanches. And I would be very careful on Saint John's night. | unchanged |
| 31 | `parrot_th_laugh` | parrot | ¡Ja! ¡Ja, ja, ja! | unchanged |
| | | | *later, folio 12 (puzzles.js), after "The folios jump"* | |
| 32 | `mercedes_folio_1` | mercedes | Nobody has asked me that in thirty years. [pause] Sit. Don't touch the parrot. | unchanged |
| | | | *into the back (drawer_open), a pause, paper* | |
| 33 | `mercedes_folio_1b` | mercedes | Mira. The Holy Office's copy, fifteen-oh-five. Folio twelve is in it, misfiled. The way a thing is misfiled on purpose. | **new** |
| | | | *folio 12 (close-up)* | |
| 34 | `mercedes_folio_2` | mercedes | Folio twelve. The statement of a Canario fisherman, baptised Pedro, of Gáldar. The man who pulled Juan de Quintana out of the sea. | unchanged |
| 35 | `mercedes_folio_3` | mercedes | He says the women did not call it on the Castilians. They called it, and it would not be aimed. It took his own village on the third night. | unchanged |
| 36 | `mercedes_folio_4` | mercedes | He says they shut it with Magec, at the cave of the light. And that the sea will want back the ones he took from it. [pause] He was right about Juan. | unchanged |
| 37 | `mercedes_folio_5` | mercedes | The notary struck it from the record. It contradicted the miracle. And then, I think, he was ashamed, and wrote in the margin. | unchanged |
| 38 | `alan_th_folio` | alan | 'Nadie preguntó a las mujeres.' [pause] And the one man who answered for them, they took out. | unchanged |

### Thursday: the phone box, Inês and the ledger (core.js S.callThu)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `ines_call_thu_1` | ines | I haven't finished the letter. It's two hundred and forty years old and someone wrote it with a chicken. [pause] But I've found something else. | unchanged |
| 2 | `alan_call_thu_1` | alan | Where? | unchanged |
| 3 | `ines_call_thu_2` | ines | Your grandfather's boxes. In the back room. The ones you never open. | unchanged |
| | | | *pages down the line (paper_shuffle), a pause* | |
| 4 | `ines_call_thu_3` | ines | There's a ledger. The foundry's accounts, seventeen-forty to seventeen-sixty. Bells cast, bells sold, bronze bought. | unchanged |
| 5 | `ines_th_call_4` | ines | And in seventeen fifty-one, a voyage. Passage for four, to the Canaries, with their tools and their bronze in the hold. And in the margin, in the same hand as your letter: para estudar a fechadura. | unchanged |
| 6 | `alan_call_thu_2` | alan | To study the lock. | unchanged |
| 7 | `ines_th_call_5` | ines | And in seventeen fifty-five, after the earthquake, after the wave, there's a page with no figures on it at all. Just a sentence. | unchanged |
| 8 | `ines_th_call_6` | ines | Fizemos o que aprendemos nas Canárias. O Mar está calado. [pause] We did what we learned in the Canaries. The Sea is silent. | unchanged |
| 9 | `alan_call_thu_3` | alan | They shut it. In Lisbon. With what they learned here. | unchanged |
| 10 | `ines_th_call_7` | ines | They shut it. Which means it can be shut. Which means it knows the people who shut it. | unchanged |
| 11 | `ines_th_call_8` | ines | Alan. Your blood. That's why it backed off you in the cistern. It knew you. | unchanged |
| 12 | `alan_th_call_4` | alan | And here? | unchanged |
| | | | *a long pause: Inês quiet* | |
| 13 | `ines_th_call_9` | ines | Here, I'd keep away from the water. | unchanged |
| 14 | `alan_th_call_5` | alan | I'm on an island, Inês. | unchanged |
| 15 | `ines_call_thu_4` | ines | Then tell Vasco. Tonight. Whatever you're planning, and I can hear that you're planning something, tell him first. | unchanged |

### Thursday: the restaurant, Gail and Derek

They sit at their table (painted).

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `gail_th_1` | gail | Derek. Stop filming the sea. It's just the sea. | unchanged |
| 2 | `derek_th_tide_1` | derek | It's coming up the steps, Gail. | unchanged |
| 3 | `gail_th_tide` | gail | It's the tide. | unchanged |
| 4 | `derek_th_tide_2` | derek | It's not supposed to be in. I checked. There's a table in the back of the guidebook. | unchanged |
| 5 | `derek_th_tide_3` | derek | Fly two thousand miles for a beach and they've put the sea on it. [pause] Is it, mate? Is this normal? | unchanged |
| 6 | `alan_th_tide` | alan | No. It isn't. | unchanged |
| | | | *a pause* | |
| 7 | `derek_th_tide_4` | derek | Well. Lucky we're at the dinner tonight, then. Out of the way. | unchanged |
| 8 | `alan_th_gd_dinner` | alan | The dinner? | unchanged |
| 9 | `gail_th_invite` | gail | At the museum. Mister Montesdeoca invited us. He owns this hotel. He's ever so nice. He came round all the tables at breakfast. | unchanged |
| 10 | `gail_th_invite_2` | gail | He said there's going to be a talk about the cave, and some old bones. | unchanged |
| 11 | `derek_th_doctor` | derek | There's a Portuguese doctor doing the talk. Supposed to be very clever. | unchanged |
| 12 | `alan_th_gd_clever` | alan | He is. | unchanged |
| 13 | `gail_th_looks` | gail | You'll be there? Oh, good. You'll scrub up lovely, a good-looking boy like you. Won't he, Derek? | unchanged |
| 14 | `derek_th_looks` | derek | Don't start, Gail. | unchanged |
| 15 | `alan_th_shy_gail_th` | alan | I'll... try to live up to the boy part. | unchanged |
| | | | *then (puzzles.js) Gail's contract and the case page, unchanged* | |

### Thursday: the lobby, the plan and the suitcase

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_th_plan_1` | alan | I have a plan. It isn't a very good plan. But I have it the way you have a fever. | **new** |
| 2 | `alan_th_plan_2` | alan | [pause] And I haven't once thought of just telling Vasco and asking for his help. I notice that. Like a stone in my shoe. | **new** |
| 3 | `nieves_th_case_1` | nieves | Your luggage, señor. It has been to Madrid. | unchanged |
| 4 | `nieves_th_case_2` | nieves | Something inside it has been crying. | unchanged |
| | | | *the case opened* | |
| 5 | `alan_th_case_1` | alan | The port. A bottle of port for Vasco, and it's gone all over my cream linen suit. | unchanged |
| 6 | `alan_th_case_2` | alan | My good suit. It looks like a crime scene. [pause] A very well-cut crime scene. | unchanged |
| 7 | `nieves_th_case_3` | nieves | Then the jacket, señor. | unchanged |
| | | | *a pause: the eyebrow* | |
| 8 | `nieves_th_case_4` | nieves | No one needs that jacket. [pause] Tonight, it seems, you do. | unchanged |
| | | | *fade: the blazer on* | |
| 9 | `alan_th_mirror` | alan | A stranger's blazer over Vasco's jeans. [pause] I look like a man who knows what he's doing. | **new** |
| 10 | `narr_th_case_4` | narr | This was a lie, and the jacket knew it. | unchanged |

### Thursday: the dinner

The hall laid for the dinner is painted (museum_hall_dinner).

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *Alan walks over to Vasco* | |
| 1 | `vasco_th_hello_1` | vasco | You look wonderful. [pause] Oh. You're wearing the terrible jacket. | unchanged |
| 2 | `alan_th_hello_1` | alan | My suit came back from Madrid swimming in port. | unchanged |
| 3 | `vasco_th_hello_2` | vasco | I've missed your suit. [pause] I've missed you in it. | unchanged |
| | | | *a pause: the collar straightened* | |
| 4 | `vasco_th_hello_3` | vasco | Don't let me talk too long. If I go over twenty minutes, cough. | unchanged |
| 5 | `alan_th_hello_2` | alan | I'll cough. | unchanged |
| 6 | `vasco_th_hello_4` | vasco | And Alan. Thank you for being here. I know it's been boring for you. I know I've been... gone. | unchanged |
| 7 | `vasco_th_hello_5` | vasco | Tonight's the last big thing. After tonight, I'll be better. I promise. | unchanged |
| 8 | `alan_th_dinner_0` | alan | I could still not do it. Sit at table seven, cough at twenty minutes, go home, and just tell him. | **new** |
| 9 | `alan_th_dinner_1` | alan | Break a leg. | unchanged |
| | | | *a glass (glass_clink)* | |
| 10 | `baute_th_toast` | baute | To the dead of this island, who are cleverer than all of us. And to the living, who pay for them. | unchanged |
| 11 | `vasco_th_speech_1` | vasco | The people of this island cut a chamber into a cliff, high in the mountains above the clouds, and carved its walls with triangles. Dozens of them, all pointing down. | unchanged |
| 12 | `vasco_th_speech_2` | vasco | And they cut one small opening through the roof, straight down from the top of the cliff, so that at noon, all summer, the sun comes down it in a single column, and every triangle on the wall lights at once. Like a sentence read out loud. | unchanged |
| 13 | `vasco_th_speech_3` | vasco | They built a calendar. That's what the textbooks will tell you. And it is a calendar. But I've spent my whole life in churches built to face the sunrise. | unchanged |
| 14 | `vasco_th_speech_4` | vasco | I know what it feels like to stand in a building that was made to receive something. This is a place where people waited for the sun to say something. | unchanged |
| 15 | `alan_th_talk_watch` | alan | Montesdeoca nods like a man who's paid for the sun as well. [pause] And Baute watches Vasco with something like grief. | **new** |
| 16 | `alan_th_watch` | alan | Nine forty. One guard between me and the back stairs. [pause] And one Englishman who wants a better angle. | unchanged |
| | | | *the clock starts (puzzles.js)* | |
| 17 | `alan_th_timer` | alan | Twenty minutes. If he goes over, I cough. If I go over, I'm caught. | unchanged |
| | | | *when the twenty minutes run out* | |
| 18 | `alan_th_timer_q` | alan | He's at the questions. Here that's a second talk, professors to each other. Ten more minutes, if they're slow. | **new** |
| | | | *when the ten more run out* | |
| 19 | `alan_th_timer_lecture` | alan | A professor in a cardigan, asking a question that's really a lecture. With footnotes. [pause] I have as long as it lasts. | **new** |
| | | | *Derek, "the best angle"* | |
| 20 | `derek_th_1` | derek | Can't see a thing from here, mate. Forty quid this camcorder, and all I've got is the back of a bishop's head. | unchanged |
| 21 | `alan_derek_rope` | alan | The best angle in the building is up the front, by that side door. Keep low and nobody will mind. | unchanged |
| 22 | `derek_th_go` | derek | Up the front. Right. Hold my wine, Gail. | unchanged |
| 23 | `gail_th_go` | gail | Derek. Derek! Sit down! | unchanged |
| | | | *Derek crouches across the room into the guard's chair (he walks; chair_scrape)* | |
| 24 | `guard_th_wake` | guard | ¡Oiga! ¡Señor! What are you... ¡Señor! | unchanged |
| 25 | `derek_th_fall` | derek | Sorry! Sorry, madam. Lovely shoes. Sorry! | **new** |
| 26 | `gail_th_fall` | gail | Oh, Derek. [pause] He's under table nine, love, apologising to everybody's legs. | **new** |
| 27 | `alan_th_clear` | alan | Corridor's clear. [pause] Forgive me, Derek. | unchanged |

### Thursday: Baute's office

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_th_office` | alan | Baute's office. [pause] Quick, Alan. And quiet. | **new** |
| | | | *the knife in the drawer (unchanged); the file read (pose read, paper)* | |
| 2 | `alan_th_file_0` | alan | Montesdeoca Hoteles. A sponsorship agreement, twelve pages. Money for the dig, the conservation, the display cases. His name on a plaque. | **new** |
| 3 | `alan_th_file` | alan | That's all. No clause about Artenara. No hotel. [pause] It's the most boring document I have ever read, and I sell books. | unchanged |
| 4 | `alan_th_file_2` | alan | Twelve pages of nothing. [pause] Then what's that, on the wall? | **new** |
| | | | *the photograph and the map (close-up)* | |
| 5 | `alan_th_desk_1` | alan | And the map. Maspalomas, Playa del Inglés, San Agustín. Six hotels circled in red, and four of them are Montesdeoca's. | unchanged |
| 6 | `alan_th_desk_2` | alan | 'Twenty-fourth, mediodía.' Noon. [pause] It's him. I don't know how it connects to a fisherman drowned in his bed. But it connects. It has to. | unchanged |
| | | | *he reaches for the map (pose reach); the light comes on (lamp_click)* | |

### Thursday: caught (still_caught)

The still shows Baute in the doorway, Montesdeoca laughing, Vasco behind with his notes, Alan at the desk.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *a pause* | |
| 1 | `alan_th_caught` | alan | Baute's desk, his file open, my hand on his map. [pause] I know exactly what I look like. | **new** |
| 2 | `baute_caught_1` | baute | Señor Sanches. You've found my office. I'm so sorry, I should have given you a tour. The rest of the museo is much more interesting. | unchanged |
| 3 | `baute_caught_2` | baute | Shall we go back down? I believe the dessert is mango. | unchanged |
| 4 | `baute_caught_3` | baute | A misunderstanding. Señor Sanches is a bookseller. Booksellers are curious about paper. It's a professional illness. | unchanged |
| 5 | `baute_caught_4` | baute | Please. Go back to your tables. Ignacio, I'm so sorry. You must think we're all mad. | unchanged |
| 6 | `montesdeoca_caught` | montesdeoca | Mad? Ha! He wants my contract, he can have it. Gratis! Frame it! [pause] And he's wearing my jacket. Ha! | unchanged |
| | | | *a pause* | |
| 7 | `alan_th_caught_vasco` | alan | Vasco. No expression at all, like a priest who's just heard something terrible in confession. [pause] And he turns, and goes. | **new** |
| | | | *steps going down (stairs)* | |

### Thursday: after, and the night

Over black, then room 404.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_th_mango_1` | narr | The dessert was mango. Alan ate it. Vasco finished his talk, well, and didn't look at table seven once. | **changed** |
| 2 | `narr_th_mango_4` | narr | At eleven, Carmen Trujillo at the back door. She hadn't been at the dinner. She looked at him over her sunglasses, and went. | **changed** |
| 3 | `narr_thu_night` | narr | They took a taxi back to the hotel, and neither of them said anything in the taxi. | unchanged |
| | | | *fade in: Vasco's lamp off (lamp_click)* | |
| 4 | `alan_th_night_1` | alan | Vasco. | unchanged |
| 5 | `vasco_th_night_1` | vasco | Not tonight. | unchanged |
| 6 | `alan_th_night_2` | alan | I can explain. | unchanged |
| 7 | `vasco_th_night_2` | vasco | I know you can. You can always explain. [pause] That's what frightens me. | unchanged |
| 8 | `vasco_th_night_3` | vasco | Not tonight, Alan. Please. I've got to be up at five. | unchanged |
| | | | *a pause; the sea through the balcony doors (water_lap)* | |
| 9 | `narr_th_night_6` | narr | And under it, so faint he might have imagined it, waves on a beach that was not this beach, a long way down in the dark. | **changed** |
| | | | *a pause; Friday* | |

## The cut lines, and what does their job now

These narrator lines are no longer played (they stay in lines.js; validate lists them as unused). Each, with what now does its job.

| id | was | now |
|---|---|---|
| `narr_w_dawn_2` | Alan half woke to the sound of him moving around the room in the grey light, trying to be quiet and failing, the way tall men always fail: a knee against the bedside table, a whispered curse in Portuguese, a boot dropped. | the sounds (floor_creak, drawer_scrape); Vasco's own lines |
| `narr_w_dawn_3` | Then a hand on his hair, and a kiss on the side of his head that smelled of toothpaste and sun cream. | cut (the kiss; his lines carry the tenderness) |
| `narr_w_dawn_4` | This was the moment. Alan lay with his eyes closed and the hand on his hair, and felt the words rising in him, ready. I did see a ghost. It's the thing from the cistern, and it's here, and I'm frightened. | alan_w_dawn_say (Alan, to himself) |
| `narr_w_dawn_5` | Vasco laughed softly, and the hand went away, and the door closed. | the laugh (v_vasco_laugh) and the door |
| `narr_w_dawn_6` | Alan lay in the grey light and listened to the Land Rover start in the street below, and pull away, and fade into the sound of the sea. | a pause after the door |
| `narr_w_dawn_7` | Then he drank the terrible coffee, which was terrible, and went to see the island. | Alan stretches and drinks (poses); alan_w_coffee |
| `narr_w_isleta_1` | La Isleta was a lump of old volcanic rock on the end of the city, joined to the rest of it by a thin neck of sand, with the port on one side and the open ocean on the other. | the painting |
| `narr_w_isleta_2` | Narrow streets of low square houses in faded blues and pinks and greens, washing on every roof, a dog asleep in every doorway; and at the bottom, a little harbour of wooden boats. Virgen del Carmen. Dos Hermanos. Esperanza. | the painting (the boats' names: alan_look_boats) |
| `narr_w_isleta_3` | The air smelled of diesel and fish and frying oil. On the quay, under the grey panza, an old woman was sorting a net, and beside her, on an upturned fish crate, a thin old man in a flat cap was mending the same net. | the painting; the smell dropped |
| `narr_w_pino_1` | She was pulling things out of the net and laying them on the quay. Not fish. A clay pot furred with weed. An iron ball grown a skin of orange coral. A short, thick bolt of iron. And a helmet. | alan_w_pino_0 |
| `narr_w_pino_2` | A soldier's helmet, the old kind, with a ridge over the top like a cockerel's crest, so corroded it had gone the colour of dried blood. Weed hung from it. A small crab was living in it. | alan_w_pino_0 (the crab), alan_look_nets_wed (the colour of dried blood) |
| `narr_w_pino_3` | The old woman looked up at him. Her eyes were very black and very sharp. | cut |
| `narr_w_pino_4` | She tipped the crab gently out of the helmet and back into the harbour. | pino_w_crab and the splash |
| `narr_w_pino_5` | The old man on the crate took the cigarette out of his mouth, looked at it, and put it back in. | cut (Lolo's cigarette; alan_look_lolo has it) |
| `narr_w_pino_6` | Doña Pino looked at him for a long moment: at his face, and at his trousers, which he had sewn up badly with the hotel sewing kit. | pino_w_worse, pino_w_pretty (the trousers) |
| `narr_w_pino_7` | But she was almost smiling. She held up the helmet and turned it in her hands, and looked into it as if it were a bowl of water she could read. | cut (her memory lines carry it) |
| `narr_w_pino_8` | She set the helmet down on the quay, very carefully, as if it might still have a head in it. | cut |
| `narr_w_pell_2` | Two men in orange overalls sat on her deck, smoking, watching the fishing boats. [pause] Alan didn't notice it. Nobody did. | folded into narr_w_pell_1 |
| `narr_w_decide_1` | Somewhere along the way, in the grey heat, with his shirt sticking to his back, Alan realised he had made up his mind. | alan_w_decide_1 |
| `narr_w_decide_2` | He would tell Vasco tonight. Properly. He would sit him down, and pour him a drink, and say it plainly. | alan_w_decide_1 |
| `narr_w_decide_3` | And before that he would find out what he could, so that when he said it, it would sound less like a man who was frightened of the sea, and more like a man who knew something. | alan_w_decide_2 |
| `narr_w_plaza_1` | He went to the cathedral, because cathedrals were where bells were, and bells, in Alan's experience, were where trouble was. | alan_w_plaza |
| `narr_w_plaza_2` | Santa Ana stood on its own square in Vegueta, a great grey stone front with two square towers, facing a long plaza of palms and cobbles and, for reasons nobody could ever explain to him, eight life-sized bronze dogs. | the painting; alan_look_dogs |
| `narr_w_open_1` | He opened it in the plaza, on the edge of a fountain between two of the bronze dogs, with his skinned hand stinging. | Alan walks to the dogs and reads (pose) |
| `narr_w_open_2` | Four sheets of thick paper, covered on both sides in a small, cramped, brown hand, faded at the folds almost to nothing. Portuguese, but the Portuguese of two and a half centuries ago. | alan_w_open_0 |
| `narr_w_open_3` | And further down, a word that made the back of his neck go cold despite the heat. Mar. The Sea. With a capital letter. | alan_w_open_mar |
| `narr_santa_ana_in_1` | Inside, Santa Ana was cool and dim and enormous. The columns went up like grey palm trees and opened into the vault, so that the whole nave felt like an oasis somebody had turned to stone. | the painting; alan_look_columns |
| `narr_w_nave_2` | A few old women were praying. A few tourists were reading their guidebooks in whispers. And somewhere above him, a clock was failing to strike. | the clock heard (clock_wind) and a pause |
| `narr_w_nave_3` | A very small, very old man in a long black coat was glaring up at the noise through glasses as thick as the bottoms of bottles, holding an iron ring the size of a dinner plate, hung with at least forty keys. | Fermín on screen; alan_look_fermin |
| `narr_w_fermin_2` | The old man turned the glasses on him. | cut |
| `narr_w_fermin_3` | Alan heard himself say it, and was surprised. | alan_w_bells_2 |
| `narr_w_fermin_4` | The old man looked at him for a long moment through the glasses. Then he held out the ring of keys. | the keys (sfx) and fermin_ring |
| `narr_w_belfry_1` | The bell chamber was at the top of a hundred and twelve stone steps, which Don Fermín climbed behind him one at a time, stopping on every landing to tell Alan that he would die on the next one. | the stairs (sfx), fermin_w_steps, fermin_w_landing |
| `narr_w_belfry_2` | It was a square stone room open to the sky through tall arches, with black beams overhead and pigeon feathers everywhere. Below lay the old town, and beyond it the grey sea, under the flat grey lid of the panza. | the painting; alan_look_bell_window |
| `narr_w_belfry_3` | In the middle of the room hung the clock, a great black box of wheels and ratchets on a cradle of iron and oak. And beyond it, in the largest of the arches, the bells. | the painting; alan_look_drum |
| `narr_w_clock_1` | It took him twenty minutes, a great deal of swearing, and most of the skin on his left hand. | the pull pose, the fade (twenty minutes), alan_w_clock (the skin) |
| `narr_w_clock_2` | Something in the escapement had slipped a tooth. When he eased it back, the whole black box shuddered, and sighed, and began to tick again, slowly, like a heart starting. | alan_w_clock_0, the tick (sfx) |
| `narr_w_clock_3` | Don Fermín, getting his breath back on a wooden chest in the corner, took off his glasses and polished them. | cut |
| `narr_w_still` | The old man was very still for a moment. Then he got up off the chest, slowly, and went to the largest of the bells, and beckoned. | a pause |
| `narr_w_bell_1` | It was a big bell, bigger than a man, dark bronze gone green at the lip. Round its shoulder ran a band of raised letters, and below that, almost hidden in the shadow of the waist, a small cast mark. | the painting; alan_look_bell_mark |
| `narr_w_bell_2` | Sanches made me. He had seen that mark on a bell in Lisbon, at the bottom of a flooded tower, eight months ago. On the frontispiece of his grandfather's books. In his dreams. | alan_w_bell_lisbon |
| `narr_w_bell_3` | He put his hand on the bronze. It was cold, and it hummed faintly under his palm, the way bells always do, as if remembering the last time they were struck. | the reach pose and the hum (sfx) |
| `narr_w_chest` | Don Fermín didn't answer at once. He lifted the lid of the chest and rummaged among old vestments and candle stubs and a broken crucifix, and came up with a flat packet of oilcloth, tied with a faded cord and sealed with black wax. | drawer_open; alan_w_wax |
| `narr_w_chest_2` | Pressed into the wax was the same mark. | alan_w_wax |
| `narr_w_letter_take` | Alan took it. It was light, and dry, and it felt heavier than the bell. | pickup pose; alan_w_letter_take |
| `narr_w_arch_1` | The archive was in the basement: a long low room under a vaulted ceiling, grey metal shelving from floor to ceiling, grey cardboard boxes, and the smell of dust and old paper and cigarette smoke. | the painting |
| `narr_w_arch_2` | There was a large sign on the wall that said PROHIBIDO FUMAR. Carmen was sitting under it, smoking, at a desk buried in files, with an ashtray that had not been emptied since the Franco era. | alan_w_arch |
| `narr_w_carmen_1` | She looked at him, and lowered the sunglasses from her head to the end of her nose. | cut |
| `narr_w_carmen_2` | She went back to her file. | page (sfx), a pause |
| `narr_w_carmen_3` | He sat down on the edge of her desk, which she clearly hated. | carmen_w_desk |
| `narr_w_carmen_4` | She didn't look up from the file. But her hand, holding the pen, had stopped moving. | a pause; alan_w_carmen_pen |
| `narr_w_carmen_5` | Carmen put the pen down. | cut |
| `narr_w_carmen_6` | She stubbed her cigarette out, too hard. | glass_set (sfx) |
| `narr_w_carmen_7` | She said it too fast. She was already turning her whole chair round to the shelves, so that by the time she finished she had her back to him, and was pulling down a box she didn't need. | filing_cabinet (sfx) |
| `narr_w_carmen_8` | On the corner of her desk, under the ashtray, a photograph in a cheap plastic frame lay face down. He didn't touch it. | alan_w_carmen_photo |
| `narr_w_carmen_9` | Without turning round, she took a thick old book off the shelf and held it out behind her at arm's length, the way you'd hand someone something you didn't want to be seen giving. | book_take (sfx); carmen_w_galindo |
| `narr_w_carmen_10` | When he had gone, Carmen Trujillo sat with her back to the door for a long time. Then she turned round and righted the photograph: two women on a mountain, squinting into the sun, one with a pencil through her hair. | carmen_w_alone |
| `narr_w_carmen_11` | At home, on the table by the door, there was an answering machine with a message on it that she had listened to only once, on the morning of the twenty-second of December, and had never been able to erase. | carmen_w_alone |
| `narr_w_carmen_12` | It's a door, Carmen. And someone's opening it. | elena_msg_02 (her own voice, from the prologue's message) |
| `narr_w_carmen_13` | She lit another cigarette. It took her three tries. | three matches (sfx) |
| `narr_w_van_1` | It was the middle of the afternoon when he got to the museum, and the place was full of crates. | alan_w_van |
| `narr_w_van_2` | A big white van was backed up to the side door, MONTESDEOCA HOTELES S.A. on its side in gold letters, and two men in overalls were loading long, flat, heavy crates into it from a trolley. | alan_w_van |
| `narr_w_van_3` | Each crate had a sheet of paper stapled to its side. Alan slowed down as he passed, and read the nearest. | Alan walks to the crate and reads (pose) |
| `narr_w_van_4` | One a month. | alan_w_crate_2 ("One a month") |
| `narr_w_van_5` | The man with the trolley saw him reading and moved between him and the crate, not unfriendly, but firmly. 'Display cases,' he said. 'New ones. From Don Ignacio. A gift for the museum.' | guard_w_van |
| `narr_w_van_6` | The man shrugged. 'I just carry them.' | guard_w_carry |
| `narr_w_chano_1` | Chano was waiting for him at the kiosk with a newspaper and a theory. | chano_w_th_1 opens it |
| `narr_w_chano_2` | He let it hang in the air, and sold a woman a lottery ticket. | coins (sfx), a pause |
| `narr_w_chano_3` | Alan thought about a man in a white guayabera with a gold watch and a cigar he wasn't allowed to light, nodding along as Vasco explained the light, as if he understood every word. | alan_w_chano_2 |
| `narr_w_chano_4` | It made sense. It was neat. It was the kind of explanation that a man who was frightened of something much larger would very much like to be true. | alan_w_chano_3 |
| `narr_w_night_2` | He came in grey with dust and exhaustion, and kissed Alan, and fell face down across the bed with his boots still on. | the door and the bed springs; vasco_w_night_1 |
| `narr_w_night_3` | Alan sat on the edge of the bed and unlaced his boots for him. | pickup pose; alan_w_boots |
| `narr_w_night_4` | Alan put the boots side by side on the floor. This was it. He had decided. He would say it now. | alan_w_night_1 |
| `narr_w_night_5` | But Vasco was asleep. | a snore (sfx) |
| `narr_w_night_6` | Alan sat there for a while in the light of the bedside lamp, looking at him. | cut |
| `narr_w_night_7` | Then he took off the rest of Vasco's clothes, as gently as he could, the way you'd undress a child who'd fallen asleep in the car, and pulled the sheet over him, and turned out the light. | the lamp (sfx) |
| `narr_w_night_8` | Tomorrow, he thought. Tomorrow, at the dinner. After his presentation. When he's happy. | alan_w_night_2 |
| `narr_pepe_3` | He was seventy-two. He had been at sea since he was twelve. In 1971 he had been one of the crew of a trawler called the Virgen del Pino, which went down with eleven men and one woman aboard. | Doña Pino (pino_th_pepe_1, 1b) and Chano (chano_th_pepe_1, 6) on Thursday |
| `narr_pepe_4` | He was one of the seven pulled out of the water alive the next morning, clinging to a hatch cover. He had never talked about it, and he had never once since been able to sleep with the window open. | pino_th_pepe_1b, chano_th_pepe_6; the still (the shutters) |
| `narr_pepe_5` | That night the window was shut, as always. The door was locked. The house was quiet and dry and warm. | the still (shutters, the barred door); narr_pepe_1 |
| `narr_pepe_6` | He woke at two in the morning to the smell of salt. | water_lap (sfx) |
| `narr_pepe_7` | He lay in the dark with his heart hammering, and heard it, as close as the pillow under his ear: the slow rush and draw of waves. Then he felt the cold, rising from the foot of the bed. | water_lap, water_rise (sfx) |
| `narr_pepe_8` | Pepe Santana did not shout. He was a fisherman. He knew the sea, and he knew at once, with the whole of his body, that it had come back for what had been taken from it. | pino_th_debts, pino_th_pepe_3 on Thursday |
| `narr_pepe_8b` | Twenty-five years ago, on a cold morning, a fishing boat had hauled him out of the water by his collar. | chano_th_pepe_6, alan_th_merc_pepe |
| `narr_pepe_2` | In the morning his son found him in his bed, under the dry sheets, with the window closed and the door locked, and his lungs full of the sea. | chano_th_pepe_3 on Thursday ("His son found him... lungs full of seawater") |
| `narr_th_chano_1` | Chano told him about Pepe Santana, because Chano told everyone everything. | chano_th_pepe_1 opens it |
| `narr_th_chano_2` | He crossed himself with the newspaper he was folding for a customer, without looking at it. | cut |
| `narr_th_chano_3` | Alan stood at the kiosk with his coins in his hand and felt the morning heat go cold on his skin. | a pause |
| `narr_th_pino_1` | She didn't look up. She was sitting on an upturned crate in her black dress, with a missal open on her knee, looking at the inside cover. | cut |
| `narr_th_pino_2` | Someone had written the names long ago, in blue ink gone purple with age. The line through José Santana was black and new, and the ink had gone through the page. | the missal close-up (S.readPinoList) |
| `narr_th_pino_3` | She looked at him then, properly, with her black, sharp eyes. | cut |
| `narr_th_pino_4` | Alan thought of the cistern under Lisbon. The black water at his chest. The thing in the dark beyond his torch, enormous, patient, knowing him for the blood of the bell-makers. | alan_th_pino_cistern |
| `narr_th_pino_5` | It had let him go. And now it was here. | alan_th_pino_cistern |
| `narr_th_arch_1` | He had sat up half the night with Abreu Galindo on the hotel balcony while Vasco slept. Carmen looked at the book under his arm, and then at him. | carmen_th_1 ("You read it.") |
| `narr_th_arch_2` | She didn't tell him to go away. That was new. She tipped her chin at the chair across the desk, and after a moment he sat in it. | carmen_th_sit |
| `narr_th_arch_3` | She looked at him for a long moment over the sunglasses. Then she told him. | cut |
| `narr_th_arch_4` | She counted it off on her fingers, bored and precise, like a woman reciting her own address. | cut |
| `narr_th_arch_5` | Carmen went very still. | a pause |
| `narr_th_arch_6` | She looked at the face-down photograph on the corner of her desk. Then she lit another cigarette from the end of the first. | match (sfx), a pause |
| `narr_th_arch_7` | She jerked her head at the wall, towards the cathedral. | carmen_th_colon_2 ("Behind Santa Ana") |
| `narr_th_arch_8` | Alan told her about Pepe Santana then. The bed, the closed window, the sea in his lungs. The names in Doña Pino's missal. | alan_ask_carmen_pepe |
| `narr_th_arch_9` | Carmen listened without moving. When he had finished, her eyes went, once, to the clipboard on its nail by the door: the conservation list, with its column of dates. December. January. February. Down to May. And one line more, blank, for June. | alan_th_carmen_list (the clue: the blank line for June) |
| `narr_th_arch_10` | But she said it quietly, and she didn't turn her back. | cut |
| `narr_th_colon_1` | Casa de Colón was two minutes' walk from the cathedral, down a narrow street of old ochre houses: the old governors' palace, where Columbus was supposed to have stayed in 1492 while they mended the Pinta's rudder. | alan_th_colon_out |
| `narr_th_colon_2` | It had a stone doorway carved like lace. | the painting |
| `narr_th_colon_3` | Inside, one courtyard opened onto another, with dark wooden balconies all round and palms in the middle, and, for reasons nobody had ever explained to Alan's satisfaction, two large green parrots in a cage. | the painting |
| `narr_th_colon_4` | They watched him come in, and said something rude in Spanish. | parrot_th_rude |
| `narr_th_merc_1` | Mercedes Quintana was at a long table under the window, with a magnifying glass in one hand and a pencil in the other: small, straight-backed, in a grey cardigan in thirty-degree heat. | Mercedes on screen; alan_look_mercedes |
| `narr_th_merc_2` | She looked at him over her half-moon glasses exactly the way Carmen did. He wondered if they taught it at the university. | alan_th_merc_look |
| `narr_th_merc_2b` | But she put the magnifying glass down. | cut |
| `narr_th_merc_3` | She looked at him for a long, measuring moment. Then she got up without a word, unlocked a tall cabinet, and came back with a bundle of brown, spotted paper, tied with a ribbon that had once been red. | drawer_open, paper (sfx) |
| `narr_th_merc_4` | She untied the ribbon with small, exact fingers, and read aloud, translating the old Castilian as she went, in a dry, level voice, as if she were reading a shopping list. | cut (she reads) |
| `narr_th_merc_5` | She turned a page. | page (sfx) |
| `narr_th_merc_6` | Alan sat very still. | cut |
| `narr_th_merc_juan` | She took off her glasses and polished them on her cardigan. | cut |
| `narr_th_merc_7` | She opened the bundle again at the last page, turned it towards him, and put one finger under a few lines of small, cramped writing in the margin, in a different ink. | page (sfx); mercedes_women |
| `narr_th_merc_8` | She tied the ribbon again, very neatly, put the box back in the cabinet, and locked it. | drawer_open (sfx) |
| `narr_th_merc_9` | Alan thought of Pepe Santana in his bed in La Isleta, with the window shut. Pulled out of the sea by a fishing boat, twenty-five years ago. | alan_th_merc_pepe |
| `narr_th_merc_10` | Mercedes Quintana looked at him over her glasses for a long time. Then she sat down at her table, picked up her magnifying glass, and bent over her work. | cut |
| `narr_th_merc_11` | In the courtyard below, one of the parrots laughed. | parrot_th_laugh |
| `narr_th_folio_1` | She goes into the back and comes out with a bundle tied in faded red tape: the Holy Office's copy, 1505. The folio is in it, misfiled, the way a thing is misfiled on purpose. | mercedes_folio_1b; drawer_open (sfx) |
| `narr_th_call_1` | Paper rustled, eight hundred miles away. | paper_shuffle (sfx) down the line |
| `narr_th_call_2` | Alan leaned his forehead against the glass. | cut |
| `narr_th_call_3` | Inês was quiet for a long time. | a long pause |
| `narr_th_gd_1` | Derek had his camcorder pointed out of the restaurant window, at the sea. Gail was rubbing sun cream into her forearm with grim determination. | gail_th_1 ("Stop filming the sea") |
| `narr_th_gd_2` | Derek lowered the camcorder and looked at him. Something in Alan's voice had got through. | a pause |
| `narr_th_plan_1` | He walked back along Las Canteras with a plan. It wasn't a very good plan, but he had it the way you have a fever. | alan_th_plan_1 |
| `narr_th_plan_4` | He did not, at any point, consider simply telling Vasco what he had seen and asking for his help. | alan_th_plan_2 |
| `narr_th_plan_5` | He noticed that he didn't consider it. He noticed it the way you notice a stone in your shoe, and walk on. | alan_th_plan_2 |
| `narr_th_case_1` | His suitcase had arrived. It was standing in the middle of the lobby, with a label on the handle that said MADRID in red. | nieves_th_case_1 ("It has been to Madrid") |
| `narr_th_case_eyebrow` | One eyebrow rose about two millimetres. | a pause |
| `narr_th_case_3` | He put on the stranger's navy blazer over Vasco's jeans and looked at himself in the lobby mirror, and for the first time since he'd landed he looked like a man who knew what he was doing. | alan_th_mirror |
| `narr_dinner` | The hall of the Museo Canario had been transformed: white cloths and candles under the gaze of the skulls, a projector humming on a trolley, and eighty people in their best summer clothes. | the dinner painting |
| `narr_th_dinner_2` | Vasco was checking his slides with a stack of notes in his hand, too nervous to eat. Alan went up and kissed him on the cheek. | Alan walks to Vasco |
| `narr_th_dinner_collar` | He straightened Alan's collar, and his hand stayed there. | a pause |
| `narr_th_dinner_3` | Alan looked at him, at the nervous, happy, exhausted face, and felt the plan sitting in his chest like something swallowed. | alan_th_dinner_0 |
| `narr_th_dinner_4` | He could still not do it. He could sit at table seven between a German professor and a woman in pearls, and cough at twenty minutes, and go home, and tell him. Just tell him. | alan_th_dinner_0 |
| `narr_th_talk_1` | Vasco began at half past nine. He was good. Once he started, the nerves fell away, and he talked about the light the way other men talk about women. | cut (Vasco's talk itself) |
| `narr_th_talk_2` | The room was very quiet. Ignacio Montesdeoca, heavy and tanned in his white guayabera, turned an unlit cigar in his fingers and nodded slowly, like a man who had paid for the sun as well. | alan_th_talk_watch |
| `narr_th_talk_3` | Rayco Baute sat with his hands folded and his eyes on Vasco, and on his face was pride, and love, and underneath them both something that looked almost like grief. | alan_th_talk_watch |
| `narr_th_talk_4` | By the corridor to the offices, a museum guard sat on a hard chair with his chin on his chest. And Derek was filming. He had been filming since the soup. | the guard and Derek on screen; alan_th_watch |
| `narr_th_timer_1` | Vasco has reached the questions. In this museum the questions are a second talk, given by professors to each other. Ten more minutes, if the academics are slow. | alan_th_timer_q |
| `narr_th_timer_2` | A professor in a cardigan stands up to ask a question that is really a lecture, with footnotes. Alan has as long as it lasts. | alan_th_timer_lecture |
| `narr_th_fall_1` | Derek edged out between the tables, crouching low, with the camcorder in front of his face and Gail hissing his name behind him. He walked straight into the guard's chair. | Derek walks into the guard's chair; chair_scrape |
| `narr_th_fall_2` | The chair went over. Derek went over the chair. The camcorder skidded away under table nine, and Derek went after it on his hands and knees, apologising in loud, slow English to the legs of the guests. | derek_th_fall, gail_th_fall |
| `narr_th_fall_3` | The guard went after Derek, three waiters went after the guard, and for a moment every head in the room was turned to the far corner. | gail_th_fall; alan_th_clear |
| `narr_th_office_1` | The back stairs were dark and smelled of floor polish. He went up them two at a time, with his heart going like a drum, past a framed nineteenth-century doctor with magnificent whiskers. | alan_th_office |
| `narr_th_office_2` | A corridor of closed doors with names on them. DR. R. BAUTE. DIRECTOR DE EXCAVACIONES. | alan_th_office |
| `narr_th_office_3` | The office was dark. Street light came in through a tall window, orange and dim, onto a big wooden desk piled with reports, and a green-shaded lamp. | the painting |
| `narr_th_file_1` | MONTESDEOCA HOTELES S.A. He spread the file on the desk under the lamp, his hands not quite steady. | read pose; alan_th_file_0 |
| `narr_th_file_2` | A sponsorship agreement. Twelve pages. Money for the dig, the conservation, the display cases. In return, Montesdeoca's name on a plaque, on the report, and on a little card on every table tonight. | alan_th_file_0 |
| `narr_th_file_3` | He stood there in the orange light with twelve pages of nothing, and felt the plan begin to slide out from under him. | alan_th_file_2 |
| `narr_th_photo_1` | Then he looked up, and saw the photograph on the wall above the desk, in a plain black frame, and the long map of the island beside it. | alan_th_file_2 |
| `narr_th_photo_2` | A hillside, steep and stony. A bulldozer coming up the slope with its blade raised, and in the foreground, on the bare earth, things he took for white stones until he looked again and saw that they were not stones. | the close-up (S.readBauteDesk: the 1966 photograph) |
| `narr_th_click` | He felt the plan snap back into place with a click. He was reaching up to take the map off its pins when the light came on. | reach pose; the lamp (sfx) |
| `narr_th_caught_1` | Rayco Baute was standing in the doorway. | the still |
| `narr_th_caught_2` | Behind him stood the guard, red in the face. And behind the guard, because somebody had seen the side door open, Montesdeoca, the woman in pearls, two of the professors, and Gail, with her hand over her mouth. | the still |
| `narr_th_caught_3` | And at the back, behind all of them, with his notes still in his hand, Vasco. | the still |
| `narr_th_caught_4` | Nobody said anything. Alan stood behind Baute's desk with the file open under the lamp and his hand raised to the map, and understood, in one long, cold, perfectly clear moment, exactly what he looked like. | alan_th_caught |
| `narr_th_caught_5` | Baute looked at the file. He looked at the map. He looked at the photograph, for a long moment, and something passed over his face and was gone. Then he smiled. | the still; baute_caught_1 |
| `narr_th_caught_6` | It was the kindest smile Alan had ever seen, and it was the worst thing that had happened to him in eight months. | cut |
| `narr_th_caught_7` | He came forward, closed the file quite calmly, and tucked it under his arm. | cut |
| `narr_th_caught_8` | Montesdeoca laughed, a big uncertain laugh, and the woman in pearls laughed too, high and nervous, and they began to drift away down the corridor, murmuring, looking back over their shoulders. | montesdeoca_caught |
| `narr_caught_vasco` | Vasco did not move. He stood in the corridor with his notes in his hand, looking at Alan, and his face had no expression on it at all. | alan_th_caught_vasco |
| `narr_th_caught_9` | It was the face of a man in a church who has just heard something terrible in confession, and has been trained, for many years, not to let anything show. | alan_th_caught_vasco |
| `narr_th_caught_10` | Then he turned and went back down the stairs. | alan_th_caught_vasco; stairs (sfx) |
| `narr_th_mango_2` | The woman in pearls had moved to another table. Around him the dinner went on in a low, bright, unnatural murmur, the way a party goes on after someone has fallen over. | cut |
| `narr_th_mango_3` | Vasco finished his talk. He finished it well, with a small joke about the interruption that got a small laugh, and his voice did not shake once. He did not look at table seven. Not once. | narr_th_mango_1 |
| `narr_th_mango_5` | She lowered her sunglasses, slowly, onto the bridge of her nose, and looked at him over the top of them. Then she pushed them back up and went out into the night. | narr_th_mango_4 |
| `narr_th_night_2` | In the lobby, Nieves looked at their faces, and for the first time since Alan had arrived she didn't raise her eyebrow. She looked down at her register and turned a page. | cut |
| `narr_th_night_3` | The lift sneezed at every floor, and neither of them laughed. | cut |
| `narr_th_night_4` | Vasco hung his good jacket on the back of the chair, carefully, squaring the shoulders. Then he lay down on his side of the bed, on top of the sheet, with his back to Alan, and turned off his lamp. | the lamp (sfx) |
| `narr_th_night_5` | Alan sat on the edge of the bed in the dark for a long time. Through the open balcony doors came the sound of the sea. | a pause; water_lap (sfx) |
| `narr_th_night_7` | He did not close the balcony doors. He lay down on his own side, with his back to Vasco's back, a hand's breadth apart, awake, until the grey light came. | a pause |

## The changed lines, before and after

| id | before | after |
|---|---|---|
| `narr_w_pell_1` | Across the harbour, a big grey salvage boat was tied up at the commercial quay, all cranes and winches, with a name painted on her stern in white letters: Atlantic Recovery. Pell Marine, Nassau. | Across the harbour, a grey salvage boat: Atlantic Recovery, Pell Marine, Nassau. Two men on her deck, watching. Alan didn't notice it. Nobody did. |
| `narr_pepe_1` | A month before, on the seventeenth of May, the night of the new moon. In La Isleta, in a small blue house three streets back from the harbour, a fisherman called Pepe Santana went to bed at half past ten, as he had every night for fifty years. | A month before, on the night of the new moon, in La Isleta, a fisherman called Pepe Santana went to bed with the window shut. |
| `alan_ask_carmen_pepe` | A fisherman drowned in his bed last night, in La Isleta. Doña Pino has a list. | A fisherman drowned in his bed last month, in La Isleta. Doña Pino has a list. |
| `narr_th_mango_1` | The dessert was mango. Alan ate it. He didn't know what else to do. | The dessert was mango. Alan ate it. Vasco finished his talk, well, and didn't look at table seven once. |
| `narr_th_mango_4` | At eleven, as the waiters began to clear, Carmen Trujillo was standing by the door at the back of the hall. She hadn't been at the dinner. | At eleven, Carmen Trujillo at the back door. She hadn't been at the dinner. She looked at him over her sunglasses, and went. |
| `narr_th_night_6` | And under it, so faint he might have imagined it, the slow hiss and draw of waves on a beach that was not this beach, in a place that was not this place, a long way down in the dark. | And under it, so faint he might have imagined it, waves on a beach that was not this beach, a long way down in the dark. |
