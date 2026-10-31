# Sunday: the lines to read (2026-10-31, less narrator)

The user: "over all, with your re-works there is way too much narrator. We don't need that much description. Some things
should simply be done by the characters, other just said by the characters - we don't need to have it all described"; and
"It is not only the finale with the narrator - it is basically the entire game".

Sunday (`js/story/sun.js`: the choice, Gando and the bad ending, Chano, Carmen's flat, the Land Rover, the cut-away to the
vault, the rescue, the discs, the rock, the path) was gone through line by line, the way Cave 6 was
(`docs/puzzles/CAVE6_LINES.md`): what the game shows (the rooms, the stills, the water, the steam, the message light) or
what a character can do (walk, a pose, a sound, a pause) is no longer narrated; what the player needs (the grandfather and
the habit, the note's words, the dead dig radio, the salt, the waves on the radio, the thing Alan is about to confess) is
said by Alan, Carmen or Vasco; the narrator keeps the time jumps (the taxi, half past nine, five o'clock, past midnight,
four o'clock, the cut-away's "by the evening of Sunday"), the one line over each still, and Alan's joke he didn't make.
Vasco's chapter in the vault (vasco.js) is Saturday's and was not touched; no puzzles.js narration plays on Sunday.

| | before | after |
|---|---|---|
| narrator lines played | 109 | 10 |
| narrator words | 2,812 | 188 |
| longest narrator line | 46 words | 25 words |
| character lines played (with looks and choices) | 226 | 241 (the same 226, and 15 new) |
| character words | 3,029 | 3,324 |

(Words counted without `[pause]`.) 99 narrator lines are no longer played; 8 narrator lines were shortened; 4 character
lines changed (`alan_su_watch`, `alan_su_airport`, `carmen_su_idiot_2`, `alan_lr_smell`) and 15 are new. No character
line was cut, no clue lost. Nothing is recorded: the 12 changed lines' old recordings are in `audio/voice_stale/` (they
play as captions, and are listed in `scripts/voice_redo.txt`); the new ones have no recording yet. Ids are never renamed.

Done in code instead of said: Alan packs, takes the watch and writes the note (poses, sounds); takes his ticket back and
walks out; Carmen answers the door herself, steps back as it shuts and walks back in after the chain; the long look before
she plays the message; Alan goes to her and holds her shoulder (pose, a long hold); Alan on the phone (pose) and the
hang-up; Carmen's two calls (dial tones); the steam, the gauge and the footwell (drawn); the waves under the radio (sound);
in the cut-away Yeray's bottle breaking and Yeray running out (he walks off); Carmen going to the pick handle; Vasco out of
the cell (the vault's open painting and his figure on the stone: `G.refreshNpcs(true)`, so the figure is really swapped);
Alan holding on (pose); the discs taken (pose); on the rock, Vasco coming close, the watch held out (pose), the silences.

Below, each scene in play order, as it now plays. *Italics* are what the game shows or the characters do (no line).
Status: **new** or **changed** (this pass), unchanged.

### Sunday, five in the morning: packing (the hotel room)

The room is painted; Alan packs (pose and sounds), takes Vasco's watch, writes the note.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_su_wake` | alan | Five in the morning. Sunday. [pause] My hands are packing. Nobody asked them to. | unchanged |
| | | | *he packs (pose, the shirts)* | |
| 2 | `alan_su_pack` | alan | Fold the shirt. Roll the socks. Passport, ticket. [pause] Paris. New York. London. Whenever it got too close, my hands always knew the way. | **new** |
| | | | *he picks up Vasco's watch (pose)* | |
| 3 | `alan_su_watch` | alan | Vasco's watch, on the bedside table. [pause] To give it back. In Lisbon. When he comes home. [pause] If. | **changed** |
| | | | *he writes the note (pose, pencil, paper)* | |
| 4 | `alan_su_note` | alan | A note for his pigeonhole. Four tries. [pause] 'Gone home. I'm sorry. A.' | **new** |
| 5 | `narr_su_taxi` | narr | A taxi on the promenade. He had meant to say the bus station, and the seven o'clock bus to Artenara. | **changed** |
| 6 | `alan_su_gando` | alan | Gando. The airport. | unchanged |

### Gando: the queue

The airport is painted: the crowd, the belt, the Iberia desk and its clerk.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_su_airport` | alan | Half past six, and half of Europe going home sunburnt. [pause] The Iberia queue moves slowly. Which gives me time to think. The last thing I want. | **changed** |
| | | | *Alan talks to the clerk* | |
| 2 | `alan_su_queue_1` | alan | My grandfather saw the Sea come once. Joaquim Sanches, the last bell founder in Lisbon. He got on a boat, and pretended for the rest of his life it hadn't happened. | **new** |
| 3 | `alan_su_queue_2` | alan | He left me a name, a box of old books, and a habit. [pause] The habit's standing in the Iberia queue with a suitcase. | **new** |
| 4 | `alan_su_hands` | alan | Founder's hands, Don Fermín said. The men who make bells understand the things that hang. | unchanged |
| | | | *a pause* | |
| 5 | `alan_su_queue_3` | alan | If I stay, someone has to stand in the black water at the door. And I know who. I can't imagine asking anyone else. | **new** |
| 6 | `alan_su_queue_4` | alan | If I get on the plane, I might live. The shop, Inês, Pessoa, growing old. [pause] And Vasco on the mountain with Baute, calling him Rayco. Not knowing. | **new** |
| 7 | `clerk_su_next` | clerk | ¡Siguiente! [pause] Señor Sanches! And your suitcase is with you this time! You see? Everything comes in the end. | unchanged |
| 8 | `alan_su_yes` | alan | Yes. | unchanged |
| 9 | `clerk_su_tan` | clerk | And the sunburn is a tan now. Very guapo. Lisbon will not recognise you. | unchanged |
| 10 | `alan_su_tan` | alan | Thank you. [pause] It's mostly peeling. Underneath, it's still me. | unchanged |
| 11 | `clerk_1` | clerk | Lisbon, via Madrid. Eleven fifteen. [pause] Window or aisle? | unchanged |
| | | | *a pause* | |
| 12 | `alan_su_desk` | alan | Behind her, past the runway, the panza lies over the north like a lid. [pause] And above it, small and clear, the mountains. | **new** |
| | | | *the choice: Window / Aisle / I've left something behind* | |

### The bad ending (Window or Aisle)

The still shows the plane, the island under its lid and the stain over the city.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `clerk_2` | clerk | Lovely. Gate four, boarding at half past ten. Buen viaje, señor. | unchanged |
| | | | *the still (still_bad_ending), a moment without words* | |
| 2 | `narr_bad_3` | narr | That night the city goes down to the sea. In the morning, in the vault above the cloud, there is only salt on the steps. | **changed** |
| | | | *card: That isn't how it ends. Back to the desk* | |
| 3 | `clerk_su_again` | clerk | Señor? Window or aisle? | unchanged |

### "I've left something behind": out of the airport; Chano

Alan takes the ticket back (pose, paper) and walks out through the crowd; Las Canteras is painted, Chano at his kiosk.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *he takes the ticket back (pose) and walks out* | |
| 1 | `clerk_su_june` | clerk | It's June. | unchanged |
| | | | *fade; Las Canteras* | |
| 2 | `narr_su_back` | narr | Half past nine, back in the city. The bus to Artenara went at seven. | **changed** |
| 3 | `alan_su_chano_think` | alan | Chano. | unchanged |
| 4 | `chano_su_1` | chano | You came back. | unchanged |
| 5 | `alan_su_chano_1` | alan | I came back. | unchanged |
| 6 | `chano_su_2` | chano | From el aeropuerto. | unchanged |
| 7 | `alan_su_chano_2` | alan | How do you... | unchanged |
| 8 | `chano_su_3` | chano | You've got the airport face. Everybody comes back from the airport with the same face. | unchanged |
| 9 | `chano_su_4` | chano | Like a man who has been to the edge of a cliff and looked over. | unchanged |
| | | | *coins: a box of rockets sold* | |
| 10 | `chano_su_5` | chano | Bueno. What do you need? | unchanged |
| 11 | `alan_su_chano_3` | alan | Carmen Trujillo. From the museum. Where does she live? | unchanged |
| 12 | `chano_su_6` | chano | Calle Perdomo, number twelve, third floor, above the farmacia. Her Land Rover is parked outside. It's always parked outside. It doesn't go anywhere. | unchanged |
| 13 | `chano_su_6b` | chano | My cousin's wife's sister cuts her hair. Once a year. She doesn't tip. | unchanged |
| 14 | `chano_su_7` | chano | [pause] She lost her friend in December. The one who drowned in the car on the mountain. Did you know that? | unchanged |
| 15 | `alan_su_chano_4` | alan | I'm beginning to. | unchanged |
| 16 | `chano_su_8` | chano | And my knees say stay off la playa tonight. [pause] Nobody listens to my knees. | unchanged |
| 17 | `alan_su_perdomo` | alan | Calle Perdomo. Triana. [pause] Thank you, Chano. | unchanged |

### Carmen's flat: the door on its chain

The flat is painted (books, ashtrays, the machine's red light blinking). Carmen stands at the door the first time; it shuts (sound); the chain comes off (sound); she walks back in.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *knocks; the door opens* | |
| 1 | `carmen_su_door` | carmen | No. | unchanged |
| 2 | `alan_su_idiot` | alan | I'm an idiot. | unchanged |
| | | | *a pause* | |
| 3 | `alan_su_idiot_2` | alan | I've been an idiot all week. I broke into the wrong office. I suspected the wrong man. | unchanged |
| 4 | `alan_su_idiot_3` | alan | I lied to the man I love because I thought I was protecting him. And then I lied to someone else to punish myself for it. | unchanged |
| 5 | `alan_su_idiot_4` | alan | I've been doing everything on my own because I'm frightened of needing anyone. Two people have drowned in their beds, and Vasco is up on that mountain with Rayco Baute, and I can't reach him. | unchanged |
| 6 | `alan_su_idiot_5` | alan | And I've just come back from the airport. [pause] I need your help. I've never been able to do anything on my own. I've just been very good at pretending. | unchanged |
| 7 | `carmen_su_baute` | carmen | [pause] Baute. | unchanged |
| 8 | `alan_su_baute` | alan | Not Montesdeoca. Baute. The discs never went to the city. They go down to a vault under the caves, at night. Yeray carries them. And only Rayco has the key. | unchanged |
| | | | *a pause* | |
| 9 | `alan_su_friend` | alan | Carmen. Your friend. In December, on the mountain road. [pause] She found it first. Didn't she. | unchanged |
| | | | *Carmen steps back; the door shuts* | |
| 10 | `alan_su_thats_that` | alan | Well. That's that, then. | unchanged |
| | | | *the chain comes off; the door opens* | |
| 11 | `carmen_su_idiot` | carmen | Everybody's an idiot, cariño. Come in before you say it to the neighbours. | unchanged |
| | | | *Carmen walks back into the room* | |

### Carmen's flat: Elena, and the message

The machine is used. The red light goes out when the message has played (drawn). Alan walks to Carmen and puts a hand on her shoulder (pose), a long hold.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `carmen_su_elena_1` | carmen | Her name was Elena. Elena Suárez. She had Vasco's job before Vasco had it. The best reader of the cave anyone ever had. | unchanged |
| 2 | `carmen_su_elena_2` | carmen | And she was... [pause] We'd been together eleven years. | unchanged |
| 3 | `carmen_su_elena_3` | carmen | I was married before. To a man. A long time ago. He was very nice. It was very boring. | unchanged |
| | | | *a pause* | |
| 4 | `carmen_su_elena_4` | carmen | She drove down the mountain on the twenty-first of December, and the Guardia found her in a dry barranco the next morning with her lungs full of el mar. | unchanged |
| 5 | `alan_su_know` | alan | I know. | unchanged |
| 6 | `carmen_su_elena_5` | carmen | She rang me first. From the bar in Artenara. I was out. A stupid Christmas fiesta at the museum. | unchanged |
| 7 | `carmen_su_elena_6` | carmen | I got home at two and the light was blinking, and I thought, she's being dramatic, she'll be here in an hour. And I went to sleep. | unchanged |
| 8 | `carmen_su_elena_7` | carmen | I've never listened to it since. I can't. And I can't erase it. So it just sits there. Blinking. | unchanged |
| 9 | `alan_su_machine` | alan | Play it. | unchanged |
| 10 | `carmen_su_dont` | carmen | No. | unchanged |
| 11 | `alan_su_please` | alan | Carmen. Please. I think she was trying to tell you what I'm trying to tell you. I think she found it first. [pause] Play it. | unchanged |
| | | | *a long look; the button (click, beep)* | |
| 12 | `elena_msg_01` | elena | Carmen. It's me. I know it's late. [pause] Somebody's taken one of the discs out of the floor. The wear marks are fresh. It isn't conservation. | unchanged |
| | | | *a pause* | |
| 13 | `elena_msg_02` | elena | And it isn't a calendar either. I've been reading it wrong for a year. [pause] It's a door, Carmen. And someone's opening it. | unchanged |
| 14 | `elena_msg_03` | elena | I'm driving down now. Don't smoke all of them before I get there. [pause] Te quiero. | unchanged |
| | | | *click; the light goes out; Alan goes to her, a hand on her shoulder (pose), a long hold* | |
| 15 | `carmen_su_dress` | carmen | [pause] Bueno. One minute. Nobody saves anybody in a dressing gown. | **new** |
| | | | *fade, clothes; back* | |
| 16 | `carmen_su_box` | carmen | The Guardia gave me her things in January. The photographs too, because I asked, and because the sergeant was my cousin. | unchanged |
| 17 | `carmen_su_box_2` | carmen | Her notebook's been in that box six months. I've never opened it. [pause] You open it. | unchanged |

### Carmen's flat: Elena's box

Elena's notebook and the Guardia photograph open as pages (as before).

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_su_box` | alan | Her notebook, green, swollen with damp. And a police photograph of a windscreen. | unchanged |
| | | | *Elena's notebook, the photograph (pages)* | |
| 2 | `alan_su_triangle` | alan | The triangle on the windscreen. The same as the arrows on the cave wall. She drew it while the water came up. She was telling us where. | unchanged |
| 3 | `alan_su_finish` | alan | She never finished it. [pause] Whoever stands in the water goes down with it. | unchanged |
| 4 | `carmen_su_how` | carmen | How do you know that? | unchanged |
| 5 | `alan_su_told` | alan | Because I've stood in it. [pause] A cistern under Lisbon. Black water, and something in the dark that knew me. And Doña Pino's list has my name at the bottom. | **new** |
| | | | *her lighter: four tries (sound); a long silence* | |
| 6 | `carmen_su_anyway` | carmen | So it's coming for you anyway. And someone has to stand in its water to shut it. And the last one who did didn't come back. | unchanged |
| 7 | `alan_su_apparently` | alan | Apparently. | unchanged |
| 8 | `carmen_su_airport` | carmen | And you came back from el aeropuerto. | unchanged |
| 9 | `alan_su_apparently_2` | alan | [pause] Apparently. | unchanged |
| | | | *a pause* | |
| 10 | `carmen_su_idiot_2` | carmen | [pause] You are an idiot, cariño. [pause] The good kind. | **changed** |

### Carmen's flat: where's Vasco (the calls, the deduction)

Alan on the phone (pose); Carmen's two calls are heard (dial, hang up).

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_su_where` | alan | Where's Vasco? | unchanged |
| 2 | `alan_su_phone` | alan | Can I use your phone? [pause] The hotel. | unchanged |
| | | | *Alan on the phone (pose)* | |
| 3 | `nieves_su_1` | nieves | Hotel Cristina, buenos días. [pause] Señor Sanches. There is a message in Dr. Teles's pigeonhole. | unchanged |
| 4 | `nieves_su_2` | nieves | From you, señor. It says, 'Gone home. I'm sorry.' [pause] I have not given it to anyone. | unchanged |
| 5 | `alan_su_burn` | alan | Burn it. | unchanged |
| 6 | `nieves_su_burn` | nieves | With pleasure. | unchanged |
| 7 | `alan_su_nothing` | alan | Nothing from him? Nothing at all? Since Friday? | unchanged |
| 8 | `nieves_su_3` | nieves | Nothing, señor. I would have kept it for you. | unchanged |
| 9 | `nieves_su_4` | nieves | [pause] Señor Sanches. Is he all right? | unchanged |
| | | | *he puts the phone down without answering* | |
| | | | *Carmen dials the museum* | |
| 10 | `carmen_su_museum` | carmen | The museum. The guard tried the dig radio twice. Nada. [pause] The camp's been silent since Friday morning. | **new** |
| | | | *she dials the lab* | |
| 11 | `carmen_su_lab_1` | carmen | The conservation lab. I asked how many discs from Risco Caído they've had since December. None. Nada. Not one, ever. | unchanged |
| 12 | `carmen_su_lab_2` | carmen | And the transfer sheets go back to December. Six discs, one a month. Rayco's signature on every one, and Vasco's under them, all in the same week. | unchanged |
| 13 | `alan_su_six` | alan | Six. Out of seven. | unchanged |
| | | | *a pause: he thinks it through* | |
| 14 | `alan_su_lolo` | alan | Lolo heard him. Saturday morning, on the radio: 'The discs aren't going to the lab. They're going down. Under.' And Baute told me he'd gone down on the guagua. | unchanged |
| 15 | `alan_su_think_1` | alan | Vasco went up on Friday, angry. He'd solve the cave the way Elena solved it. And Vasco can't look at a wrong thing and say nothing. Not for long. | unchanged |
| 16 | `alan_su_think_2` | alan | The radio's been dead since Friday. Not one message in two days, from a man who leaves notes about the coffee. | unchanged |
| 17 | `alan_su_think_3` | alan | And Yeray, in Rafa's sketchbook, while I was busy not listening: the discs go down to the lower vault at night. The old granary under the caves. And only Rayco has the key. | unchanged |
| | | | *the choice: camp / Lisbon / the lower vault* | |
| 18 | `alan_su_vasco_vault` | alan | He's in the lower vault. The old granary under the caves, with the discs. | unchanged |
| 19 | `alan_su_vault_1` | alan | Vasco refused him something. He must have. Something about the light. | unchanged |
| 20 | `alan_su_vault_2` | alan | And Baute isn't a killer. He doesn't want to hurt anyone. He just wants it done. So he's put Vasco where he puts the things he can't let go of. | unchanged |
| 21 | `carmen_su_vault` | carmen | The old granary. Rayco had a padlock put on that grille in May. For 'security', he said. [pause] Madre mía. | unchanged |
| 22 | `alan_su_sea_too` | alan | And the letter: the Sea strikes first at whoever understands the lock. Elena read it right. Vasco will have read it too. [pause] Carmen. It'll be coming for him. | unchanged |
| | | | *keys (sound)* | |
| 23 | `carmen_su_go` | carmen | Shoes. Keys. Vamos. | unchanged |
| 24 | `carmen_su_water` | carmen | And bring water from the fridge. The radiator drinks more than I do. | unchanged |

### The Land Rover: up into the cloud

The cab is painted; the gauge, the steam over the bonnet, the mist, the water in the footwell (drawn) and the sounds.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `carmen_su_lets_go` | carmen | Vámonos. | unchanged |
| | | | *fade; the Land Rover* | |
| 2 | `narr_lr_1` | narr | Five o'clock. The whole city going down to the beaches, and the Land Rover going the other way: up, into the cloud. | **changed** |
| 3 | `carmen_lr_1` | carmen | Ten minutes in the cloud, cariño. Then we come out on top. | unchanged |
| | | | *a pause* | |
| 4 | `alan_lr_1` | alan | Carmen. That needle. | unchanged |
| 5 | `carmen_lr_2` | carmen | It's the radiator. It does this. [pause] Pretend you can't hear it. | unchanged |
| | | | *steam out of the bonnet (drawn, sounds)* | |
| 6 | `carmen_lr_boil` | carmen | Mierda. | unchanged |
| | | | *a pause: the lay-by* | |
| 7 | `carmen_lr_water` | carmen | Bueno. You brought the water. Hold this rag, and when I say, unscrew the cap. Slowly. If you do it fast it will boil your face off. | unchanged |
| | | | *Alan uses the water on the bonnet (pour, steam)* | |
| 8 | `alan_lr_fill` | alan | Merda! [pause] Merda, merda. It didn't boil my face off. It boiled my hand. A little. | unchanged |
| 9 | `carmen_lr_go` | carmen | Elena used to do this. Every time we came up the mountain. I'd swear at it, and she'd hold the rag. | unchanged |
| 10 | `carmen_lr_go_2` | carmen | She'd say, it's not the car, Carmen, it's you. It can feel you hating it. [pause] She was probably right. | unchanged |
| | | | *a pause* | |
| 11 | `alan_lr_smell` | alan | Carmen. [pause] Salt. Cold stone. Up here. | **changed** |
| 12 | `carmen_lr_smell` | carmen | I know. I can smell it. | unchanged |
| | | | *waves under the static (sound)* | |
| 13 | `carmen_lr_radio` | carmen | Escucha. The radio. [pause] Under the static: waves. [pause] She heard them too. On this road. | **new** |
| | | | *the water in the footwell (drawn)* | |
| 14 | `alan_lr_feet` | alan | Carmen. There's water in the footwell. [pause] Only on my side. | unchanged |
| 15 | `alan_lr_me` | alan | It's me. It's come for me. I'm on the list. | unchanged |
| | | | *it rises* | |
| 16 | `alan_lr_door` | alan | It's at my knees. It's pulling, like the sea going out. [pause] The door won't open! | **new** |
| 17 | `carmen_lr_through` | carmen | Not him. Not this one. Not on my road. [pause] You've had yours. Not this one. | unchanged |
| 18 | `alan_lr_carmen` | alan | Carmen... | unchanged |
| 19 | `carmen_lr_rag` | carmen | Hold the rag. Hold the rag, Alan. | unchanged |
| | | | *the still: out of the cloud (still_cloud_climb)* | |
| 20 | `narr_lr_stars` | narr | They came out of the cloud the way a swimmer comes up out of the sea: clean mountain air, and stars. The footwell was dry. | **changed** |
| 21 | `carmen_lr_bonfires` | carmen | The bonfires. San Juan. They're lighting them now, along all the playas. The whole city's down there, by the sea. | unchanged |
| 22 | `alan_lr_bonfires` | alan | [pause] All of them. On the beaches. | unchanged |
| | | | *a pause* | |
| 23 | `carmen_lr_twenty` | carmen | Twenty minutes. | unchanged |

### Cut away: the vault at dusk (Vasco and Yeray)

The vault is painted, Vasco behind the bars with the water at his chest (drawn), Yeray in the room.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_vy_1` | narr | By the evening of Sunday, the water was at Vasco's chest. | unchanged |
| | | | *steps down the cleft; the bottle breaks on the stone (sounds)* | |
| 2 | `yeray_vy_1` | yeray | Madre de Dios. | unchanged |
| 3 | `vasco_vy_1` | vasco | Yeray. Listen to me. I haven't got long, so I'll only say it once. | unchanged |
| 4 | `vasco_vy_2` | vasco | You carried the discs. You've seen the empty sockets. You know what Rayco's going to do on Monday, at noon. | unchanged |
| 5 | `vasco_vy_3` | vasco | And you know what this is. Water doesn't stand up on its own, Yeray. This is what killed Dr. Suárez. You knew her. | unchanged |
| 6 | `yeray_vy_2` | yeray | She was kind to me. | unchanged |
| 7 | `vasco_vy_4` | vasco | She was. And it killed her because she understood the cave. It's killing me for the same reason. | unchanged |
| 8 | `vasco_vy_5` | vasco | And on Monday, when Rayco sends the sun back, it won't stop at me. It'll go down into the city. Onto the beach at Las Canteras, where half of Las Palmas will be asleep on the sand. | unchanged |
| 9 | `vasco_vy_6` | vasco | [pause] Where does your mother live, Yeray? | unchanged |
| | | | *a long pause* | |
| 10 | `vasco_vy_7` | vasco | He's been like a father to you. I know. He was kind to me too. He made me coffee. | unchanged |
| 11 | `vasco_vy_8` | vasco | I'm not asking you to betray him. I'm asking you to stop him doing the one thing he will never forgive himself for. | unchanged |
| 12 | `vasco_vy_9` | vasco | There's a pick by the finds table. The bottom of the grille is almost free. I can't do the last of it from in here. You can. | unchanged |
| | | | *the water rises over his mouth (drawn)* | |
| | | | *Yeray runs out (walks off, steps)* | |

### The camp in the dark

The camp is painted; the clock reads 22:40.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_camp_su` | alan | No lantern. No fire. The museum's Land Rover with its doors hanging open. [pause] Nobody. | **new** |
| | | | *iron on stone, below (sounds)* | |
| 2 | `yeray_su_1` | yeray | Come on! Come on! Come on! | unchanged |
| 3 | `carmen_su_here` | carmen | That's Yeray. [pause] Under the caves. The granary steps, past the finds table. Vamos. | unchanged |

### The vault: the rescue

Yeray at the grille with the pick, Vasco behind the bars with the water at his nose (drawn). Pulling the grille is Alan's pose; Carmen walks to the pick handle; the grille tears out (the open painting), Vasco is out (his figure on the stone) and the water sinks (drawn).

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *iron on stone* | |
| 1 | `yeray_su_come` | yeray | Come on. Come on. ¡Vamos! | unchanged |
| 2 | `alan_vault_su` | alan | Vasco! [pause] Hold on. Hold on! | **new** |
| | | | *use the grille* | |
| 3 | `alan_su_pull` | alan | Yeray, lever! Carmen, the handle! | unchanged |
| | | | *pull (pose, chain, stone)* | |
| 4 | `yeray_su_2` | yeray | Again! ¡Otra vez! | unchanged |
| 5 | `alan_su_more_hands` | alan | It moved. It's not enough. [pause] Carmen! The handle, with Yeray! | unchanged |
| | | | *talk to Carmen* | |
| 6 | `carmen_vault_pull` | carmen | I've got the handle, cariño. Pull! | unchanged |
| | | | *use the grille: Carmen to the handle; pull (pose); the grille tears out; Vasco out* | |
| | | | *the water sinks into the floor (drawn)* | |
| 7 | `narr_grille_5` | narr | Vasco on his back on the stone, coughing up the sea. Alan had a joke ready. He always had a joke ready. | **changed** |
| 8 | `narr_grille_6` | narr | He didn't make it. | unchanged |
| 9 | `vasco_su_out_1` | vasco | You came. | unchanged |
| 10 | `alan_su_out_1` | alan | You sent for me. | unchanged |
| | | | *a pause* | |
| 11 | `vasco_su_out_2` | vasco | I asked for the idiot. [pause] I didn't think He'd actually send you. | unchanged |
| | | | *Alan holds on (pose)* | |

### The vault: the discs, the mark

The crates are painted; Alan takes the discs (pose), Carmen's jacket (sound).

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *Alan takes the discs (pose)* | |
| 1 | `alan_su_discs` | alan | Five discs. Heavy, cold, and my reflection in every one of them, looking frightened. | unchanged |
| 2 | `vasco_su_discs` | vasco | Five. Rayco keeps the sixth on him. The sun never left its socket. | unchanged |
| 3 | `alan_su_mark` | alan | On the wall by the grille, where anyone coming down would see it: seven little signs in a row. Moons, and a sun in the middle. [pause] And under them, small, an A. | unchanged |
| | | | *a long pause* | |

### The rock (the camp, after midnight)

The camp: Vasco on the rock, Carmen by the stove, Yeray off at the edge of the light.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *coffee cups (sound)* | |
| 1 | `narr_rock_1` | narr | Past midnight, on a rock at the edge of the camp: a blanket round Vasco, Carmen's coffee, and slowly the shaking eased. | **changed** |
| 2 | `vasco_rock_1` | vasco | Rayco. Where is he? | unchanged |
| 3 | `alan_rock_1` | alan | At the cave. Yeray says. With a disc. Waiting for the sun. | unchanged |
| 4 | `vasco_rock_2` | vasco | He went up to the cave this morning. I heard him through the rock. He was up there a long time. | unchanged |
| 5 | `vasco_rock_3` | vasco | Listen to me. Seven sockets, in the floor of the chamber under the cave. Six empty. The sun disc's still in the middle. At noon on Monday Rayco needs it tipped, square to the sun, to send the light back up and open the door. | unchanged |
| 6 | `vasco_rock_4` | vasco | He asked me how, and when. I didn't tell him. | unchanged |
| 7 | `alan_rock_2` | alan | The signs on the wall. Seven of them. | unchanged |
| 8 | `vasco_rock_5` | vasco | That's the other thing. How it shuts. Every disc in its own socket, the sun flat in the middle, the light on every triangle, and the lock closes. | unchanged |
| 9 | `vasco_rock_6` | vasco | The one Rayco wanted, I never wrote down. [pause] It's in here. Only in here. | unchanged |
| 10 | `alan_rock_3` | alan | Can he guess it? | unchanged |
| 11 | `vasco_rock_7` | vasco | He'll try. By hand, by eye. He won't get it exactly. But with six of the seven gone, the lock's so loose already that it might not need to be exact. Close might be enough. | unchanged |
| 12 | `carmen_rock_1` | carmen | Then why can't you do it, hombre? You know where every one of them goes. | unchanged |
| 13 | `vasco_rock_8` | vasco | Where, yes. Not when. The order's in a song, and I don't have the words. [pause] And the wall can only be read from above, and the discs can only be set from below. | unchanged |
| 14 | `vasco_rock_9` | vasco | So someone has to be down at the sockets. In the water. | unchanged |
| | | | *a pause: Vasco looks at Alan* | |
| 15 | `alan_rock_4` | alan | It's coming for me anyway. I'd rather it found me doing something useful. | unchanged |
| | | | *a long silence* | |
| 16 | `carmen_rock_2` | carmen | What time is noon, cariño? | unchanged |
| 17 | `vasco_su_dawn` | vasco | Five past two. By your watch. | unchanged |
| | | | *(if he took the watch) Alan holds it out (pose)* | |
| 18 | `vasco_rock_watch` | vasco | [pause] You brought my watch. | unchanged |
| 19 | `alan_rock_5` | alan | I was going to give it back to you. In Lisbon. | unchanged |
| 20 | `alan_rock_6` | alan | I went to the airport this morning, Vasco. I got as far as the desk. She asked me window or aisle. | unchanged |
| | | | *he puts it on (a pause)* | |
| 21 | `vasco_rock_10` | vasco | And you said? | unchanged |
| 22 | `alan_rock_7` | alan | I said I'd left something behind. | unchanged |
| | | | *Vasco comes close* | |
| 23 | `alan_rock_friday` | alan | Vasco. [pause] On Friday night. After you left... | **new** |
| 24 | `vasco_rock_11` | vasco | Not now. | unchanged |
| | | | *a pause* | |
| 25 | `vasco_rock_12` | vasco | Whatever it is. I can feel you carrying it. You've been carrying something since you came down those steps. | unchanged |
| 26 | `vasco_rock_13` | vasco | Not now. After. Tell me after, if there's an after. [pause] I want to hear it when I can see your face. | unchanged |
| | | | *Alan holds on (pose)* | |
| | | | *Why is he doing this?* | |
| 27 | `alan_rock_ask_why` | alan | Why is he doing this? Baute. Rayco. | unchanged |
| 28 | `vasco_rock_tasarte_1` | vasco | Tasarte. His grandmother's village, on the west coast. Caves in the hill above it, and in the caves, their dead. Five hundred years of them. | unchanged |
| 29 | `vasco_rock_tasarte_2` | vasco | In August 1966 a company sent in the bulldozers for a hotel. They put the bones in a skip. He picked some up off the road afterwards and kept them in a cardboard box under his bed for a year. | unchanged |
| 30 | `vasco_rock_tasarte_3` | vasco | The site manager was twenty-eight. Charming. He gave the boy a cigarette and told him not to take it personally. [pause] Ignacio Montesdeoca. Who doesn't remember. | unchanged |
| | | | *a match: one try (sound)* | |
| 31 | `carmen_rock_3` | carmen | I knew he was angry. I studied under him, twenty years ago. He used to stand at the front of the lecture hall and talk about the conquest, and you could see it in him, like a coal. | unchanged |
| 32 | `carmen_rock_4` | carmen | I was angry too. I'm still angry. [pause] But I never thought... | unchanged |
| 33 | `vasco_rock_14` | vasco | He's not wrong. That's the worst of it. About Tasarte, about the bones. He's right about what was done to this island. He's only wrong about what to do. | unchanged |
| 34 | `alan_rock_8` | alan | He's wrong about the sea. | unchanged |
| 35 | `alan_rock_9` | alan | He thinks it'll take the concrete and leave the people. It won't. It doesn't take orders. It does whatever it has to, to stay open, and it takes whatever's in its way. | unchanged |
| 36 | `alan_rock_10` | alan | And what's nearest is them. The whole city's down there tonight. On the beaches. By the sea. | unchanged |
| | | | *a long silence* | |
| | | | *Your trowel* | |
| 37 | `alan_rock_ask_trowel` | alan | Your trowel. Lorenzo's. | unchanged |
| 38 | `vasco_rock_trowel` | vasco | Snapped. Half the blade's somewhere under the floor of a granary. [pause] It did its job. It found something worth keeping. | unchanged |
| 39 | `alan_rock_trowel` | alan | [pause] I'm not going to say anything. I want you to notice that I'm not saying anything. | unchanged |
| | | | *We should go* | |
| 40 | `alan_rock_go` | alan | We should go. | unchanged |

### The path to Cave 6

Then Monday (mon.js, Cave 6: not this pass).

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `yeray_rock_time` | yeray | It's four o'clock. | unchanged |
| 2 | `vasco_rock_go` | vasco | Then we'd better go. [pause] I'd like to talk to him first. Before the sun. | unchanged |
| 3 | `narr_path_1` | narr | Four o'clock. The path along the cliff in the dark: Carmen first with the lantern, the discs in her jacket against Alan's chest. | **changed** |
| | | | *fade; over the black, the cave mouth breathing (water sound)* | |

## Narration cut (no longer played; left in `js/lines.js`, so `validate.mjs` lists them as unused)

| id | narration (recorded, unchanged) | what does it now |
|---|---|---|
| `narr_su_pack_1` | He packed at five in the morning without deciding to. | Alan packs (pose, sounds); alan_su_wake says it |
| `narr_su_pack_2` | His hands folded shirts into the suitcase from Madrid the way they always had, all his life, whenever things got too close. Paris. New York. London. A dozen flats in Lisbon. | Alan: alan_su_pack (Paris, New York, London) |
| `narr_su_pack_3` | Fold the shirt. Roll the socks. Passport, wallet, ticket. His body knew how to do it without asking him. | Alan: alan_su_pack |
| `narr_su_watch` | Vasco's good jacket on the back of the chair. Vasco's watch on the bedside table. He picked the watch up, and held it, and put it in his pocket. | he picks it up (pose); alan_su_watch names it |
| `narr_su_note` | Downstairs, Nieves was not on the desk; a young man with a moustache was, half asleep. Alan paid for the room and left a note in Vasco's pigeonhole. He wrote it four times. In the end it said only: Gone home. I'm sorry. A. | he writes it (pose, sounds); alan_su_note gives the words (Nieves reads it again later) |
| `narr_su_bonfires` | On the beach the bonfires stood in their long line in the grey, waiting for tonight, with their straw figures on top in their hats. The tide was on the sixth step. Nobody was looking at it. | cut (the bonfires are seen from Carmen's window and the Land Rover) |
| `narr_su_gando_1` | Gando airport at half past six on a Sunday in June was full of people going home. Sunburnt Germans in sandals. Sunburnt English in socks. | the room; alan_su_airport (half past six, half of Europe going home sunburnt) |
| `narr_su_gando_2` | Families with sleeping children draped over their shoulders and duty-free rum in plastic bags. A queue of pensioners from Manchester in matching T-shirts that said WHAT HAPPENS IN GRAN CANARIA. | the room; alan_su_airport |
| `narr_su_queue_1` | He thought about his grandfather. Joaquim Sanches, the last bell founder in Lisbon, who had seen the Sea come once, as a young man, and had not stayed to face it. | Alan: alan_su_queue_1 |
| `narr_su_queue_2` | He had taken his wife and his son and got on a boat, and spent the rest of his life pretending none of it had happened. He had left his grandson a name, a box of old books, and a habit. | Alan: alan_su_queue_1, alan_su_queue_2 |
| `narr_su_queue_3` | The habit was standing in the queue at the Iberia desk with a suitcase. | Alan: alan_su_queue_2 |
| `narr_su_queue_4` | If he stayed, someone would have to stand in the black water at the door, and he already knew who it would be, because he could not imagine asking anyone else. When the door shut, the priestess had gone down with it. | Alan: alan_su_queue_3 |
| `narr_su_queue_5` | If he got on the plane, he might live. He might go back to the shop, and Inês, and Pessoa, and sell books, and grow old, and never stand in the black water again. | Alan: alan_su_queue_4 |
| `narr_su_queue_6` | And Vasco would be on the mountain. With Baute. Calling him Rayco. Not knowing. | Alan: alan_su_queue_4 |
| `narr_su_desk` | Alan looked at her. Behind her, through the big glass windows, past the runway and the scrubby brown hills, the edge of the panza lay over the north of the island like a lid. | Alan: alan_su_desk |
| `narr_su_desk_2` | And above it, very far away, small and brown and clear in the morning sun, the tops of the mountains. | Alan: alan_su_desk |
| `narr_bad_1` | From the window of the plane, the island lies under its grey lid, and the lid has a black stain spreading in it, over the city. | the still |
| `narr_bad_2` | That night Las Palmas goes down to the sea for San Juan, as it always has. | narr_bad_3, shortened, now says it |
| `narr_su_leave` | He leaned over the desk and took his ticket back out of her hand, and picked up his suitcase, and walked back through the crowd, past the pensioners from Manchester, past the sleeping children. | Alan takes the ticket back (pose, paper) and walks out |
| `narr_su_shrug` | Behind him, the woman at the Iberia desk looked at the empty space where he had been, and shrugged, and said to nobody in particular: | clerk_su_june, after him |
| `narr_su_kiosk` | Chano was at the kiosk, of course, selling fireworks to a queue of small boys. He looked at Alan, and at the suitcase. | the room (Chano at his kiosk) |
| `narr_su_rockets` | He sold a box of rockets to a child who could not have been more than eight. | the coins (sound) |
| `narr_su_flat_1` | The Land Rover was parked outside the pharmacy, half on the pavement: an ancient square thing the colour of dried mud, with a dented wing and a sticker on the back window, NUCLEAR? NO GRACIAS, faded almost to nothing. | cut (Chano has said the Land Rover is always parked outside) |
| `narr_su_flat_2` | Alan left his suitcase with the pharmacist, who looked at him as if he were mad, and went up three flights of stairs to a door with a brass knocker in the shape of a hand. | cut |
| `narr_su_flat_3` | The door opened about four inches, on a chain. Carmen, in a man's dressing gown, her black hair flat on one side, and her sunglasses, for once, not on her head. | Carmen at the door; the room; alan_look_carmen_flat for the dressing gown |
| `narr_su_stopped` | She stopped closing the door. | a pause |
| `narr_su_knuckles` | She didn't say anything. But her hand had tightened on the edge of the door so that her knuckles had gone white. | a pause |
| `narr_su_closed` | The door closed. | the door shuts (sound) |
| `narr_su_chain` | Then he heard the chain come off, and the door opened again, all the way. | the chain, the door (sounds) |
| `narr_su_inside` | The flat was small and full of books and smelled of smoke. Ashtrays on every surface. | the painting |
| `narr_su_inside_2` | And by the door, an old grey answering machine, its little red light blinking. Slowly. Steadily. As it had blinked, Alan understood, every day for six months. | the painting (the machine's light blinking, drawn); alan_look_machine |
| `narr_su_laugh` | A small, dry, terrible laugh. | a pause |
| `narr_su_press` | Carmen looked at him. Her eyes were very dry. Then she reached out with one finger, and pressed the button. | a long pause; the click and the beep |
| `narr_su_sofa` | Carmen sat down on the arm of the sofa, very suddenly, as if her legs had gone. | a pause |
| `narr_su_light_out` | Click. The red light stopped blinking. It went steady, and then it went out. | the click; the red light goes out (drawn) |
| `narr_su_shoulder` | Carmen sat with her hands over her face. She didn't make any sound at all. | Alan goes to her, a hand on her shoulder (pose), a long hold |
| `narr_su_shoulder_2` | After a while Alan put his hand on her shoulder, and she let him, and they stayed like that for a long time, with the city getting ready for its party in the street below. | the same |
| `narr_su_changed` | When she took her hands away from her face, she was Carmen again. A minute later she came out of the bedroom in her rust-coloured shirt and desert boots, car keys on a carabiner, sunglasses back on top of her head. | Carmen: carmen_su_dress; the fade; alan_look_carmen_flat_2 |
| `narr_su_told` | He told her. The cistern under Lisbon. The black water. The thing in the dark that had known him. Doña Pino's list, with his name at the bottom. | Alan: alan_su_told |
| `narr_su_lighter` | Carmen lit a cigarette. It took her four tries this time. She smoked half of it in silence, standing at the window, looking out over the rooftops towards the grey sea. | four tries on the lighter (sounds), a long silence |
| `narr_su_glasses` | She looked at him for a long moment over the top of the sunglasses, which she had lowered without seeming to notice. | a pause |
| `narr_su_different` | But it sounded different this time. | carmen_su_idiot_2 ("The good kind.") |
| `narr_su_hangup` | Alan put the phone down without answering. | the hang-up (sound) on Nieves's question |
| `narr_su_museum` | Carmen rang the museum. The security guard tried the dig radio twice while she waited. Nothing. The camp had been silent since Friday morning. | Carmen: carmen_su_museum |
| `narr_su_lab` | Then she rang a number Alan didn't know, and asked a quick question, and listened, and her face changed. | the dialling; carmen_su_lab_1 |
| `narr_su_think` | He sat down at Carmen's table, put his hands flat on either side of Elena's notebook, and made himself think. Slowly. In order. All the way to the end. The way he had not done one single time all week. | a pause; alan_su_think_1..3 |
| `narr_su_keys` | Carmen was already picking up her keys. | keys (sound); carmen_su_go |
| `narr_lr_1b` | Everyone going down to the sea. The Land Rover went the other way. Up, into the underside of the cloud, like driving into a ceiling. The light went dim. The windscreen wipers came on. | narr_lr_1, shortened |
| `narr_lr_whine` | The engine was making a noise: a high, thin whine, and under it a sort of bubbling. On the dashboard, a needle had been creeping steadily into the red. | the gauge (drawn); alan_lr_1 |
| `narr_lr_steam` | At the next bend, steam began to come out from under the bonnet. | the steam (drawn, sounds) |
| `narr_lr_layby` | They stopped in a lay-by in the grey, with the cloud pressing on the windows. Carmen got out, opened the bonnet and swore at it, comprehensively, in Canarian Spanish, for about a minute. | a pause; carmen_lr_boil, carmen_lr_water |
| `narr_lr_dark` | They went on. And the cloud got darker. Grey to slate, slate to charcoal. The headlights made two yellow tunnels that grew shorter and shorter. | the mist (drawn) |
| `narr_lr_smell` | And then the smell. Salt. Cold stone. Old, deep water. | Alan: alan_lr_smell |
| `narr_lr_radio` | On the radio the football commentator's voice stretched and dissolved into static. And under the static, as Elena had heard it six months ago on this same road, the long slow hiss and draw of waves. | the waves (sound); Carmen: carmen_lr_radio |
| `narr_lr_feet` | Black water round his shoes, rising out of the floor of the Land Rover as if the floor were the bottom of the sea. Carmen's feet, on the pedals, were dry. | the water on his side only (drawn); alan_lr_feet |
| `narr_lr_door` | It was at his knees, so cold it burned, pulling gently, the way the sea pulls at your legs when a wave goes out. He reached for the door handle. It wouldn't move. | Alan: alan_lr_door |
| `narr_lr_floor` | Carmen looked at the water. She looked at Alan. She looked at the road, what she could see of it. Then she put her foot to the floor. | carmen_lr_through |
| `narr_lr_stars_2` | Below the road the cloud lay in the starlight like a sea of milk, flat and silver and still, all the way to the horizon. The footwell was dry. There was nothing in it but an old map and a crushed cigarette packet. | the still; narr_lr_stars (the footwell dry) |
| `narr_lr_glow` | All along the coast, far below, the cloud was glowing: small soft patches of orange in a long line, following the shore, as if someone had lit lanterns under a sheet. | the still; carmen_lr_bonfires |
| `narr_lr_sea` | And somewhere down there, in the dark, under the cloud, the Sea was coming in. | alan_lr_bonfires |
| `narr_camp_su_1` | The camp was dark when they got there. No lantern. No fire. The tents stood in the starlight like grey stones, and the museum's Land Rover was parked by the finds table with its doors hanging open. | the room; Alan: alan_camp_su |
| `narr_camp_su_2` | Nobody. Carmen turned off the engine. And in the silence they heard it: from somewhere below the cliff, under the caves, iron ringing on stone. And a young man's voice, high and frightened. | the sounds, Yeray off-screen |
| `narr_vy_2` | At dawn he had heard footsteps on the rock above his head, slow and regular, going up towards the caves: Rayco, alone, going to look at what was left. | vasco_rock_2 says it on the rock |
| `narr_vy_2b` | Since then the water had climbed as if someone had opened a sluice. | the water (drawn) |
| `narr_vy_3` | It did not behave like water. Wherever he went, it stood at the same height on his body. It did not run out through the bars. It was not filling the room. It was filling the space around him. | the water standing in the cell only (drawn) |
| `narr_vy_4` | The lead was gone, and most of the stone round the last anchor. A centimetre held, out of reach under the black water, where Lorenzo's blade had snapped. He stood on the top step with his face to the bars, and waited. | played in Vasco's chapter (the anchors, the snapped blade) |
| `narr_vy_5` | At dusk, footsteps in the cleft. A lantern. Yeray, with a loaf of bread and a bottle of water, as Rayco had told him, so the prisoner wouldn't starve. | steps (sound); Yeray there |
| `narr_vy_5b` | He looked at the water standing behind the bars, flat and black, held up by nothing. The bottle slipped out of his hand and broke on the stone. | the bottle breaking (sound) |
| `narr_vy_face` | Yeray said nothing. His face was working. | a long pause |
| `narr_vy_6` | The water closed over his mouth. He stood on his toes on the top step, with his face pressed to the bars, breathing through his nose, and looked at Yeray, and waited. | the water over his mouth (drawn) |
| `narr_vy_7` | Yeray dropped the bread and ran. | Yeray runs out (walk, steps) |
| `narr_vault_su` | The path went down past the dark mouths of the caves, and into a cleft in the rock so narrow they had to go through it sideways, Carmen first with her torch. | the room |
| `narr_vault_su_2` | At the end of it: a lantern on the ground, a grille set into the rock, and Yeray, bent double, driving the point of a pick into the stone under the bottom of the grille and heaving on the handle. | the room (Yeray at the grille), the sound |
| `narr_vault_su_3` | Behind the grille there was water. It stood behind the bars, black and flat and level, at the height of a man's face, held up by nothing at all. | drawn (the water behind the bars) |
| `narr_vault_su_4` | And in it, pressed against the bars, a face, tipped back as far as it would go, with the water at its nose. | drawn (Vasco behind the bars); Alan: alan_vault_su |
| `narr_grille_1` | Alan never remembered crossing the space between them. He only remembered that he had hold of the bottom of the grille with both hands, beside the point of Yeray's pick, and was pulling. | the pull (pose) |
| `narr_grille_2` | Carmen was behind Yeray with all her weight on the end of the pick handle, swearing. The iron was cold, and the water coming through the bars onto his hands was colder. | Carmen walks to the pick handle; the pull (pose, sounds) |
| `narr_grille` | Something gave: a crack deep in the stone, like a bone breaking. The grille tore out of the threshold and swung outward on its chain, and Alan reached in under it, into the black water, and got Vasco by the collar, and pulled. | the open painting; Vasco's figure out on the stone |
| `narr_grille_3` | Vasco came out under the bars in one long slithering rush, and the two of them went over backwards together onto the stone of the cleft. | the same |
| `narr_grille_4` | The water did not follow him. It stood behind the grille, black and level, at the height where his face had been, for a long moment, as if it were looking at them. Then it sank, quietly, the way it had come, down into the floor. | the water sinks (drawn, sound) |
| `narr_grille_smile` | Something happened at the corner of Vasco's mouth that might, in better light, have been a smile. | a pause |
| `narr_grille_7` | Alan put his forehead down against Vasco's, and stayed there. Behind them Yeray sat on the stone with the pick across his knees, crying, and Carmen stood over him with one hand on his shoulder, not saying anything at all. | Alan holds on (pose); Yeray and Carmen in the room |
| `narr_discs_1` | The granary was dry. Bone dry, dusty, smelling of old stone, as if no water had ever been in it. | the painting |
| `narr_discs_2` | Five wooden crates stood along the left-hand wall, and in each, nested in straw, wrapped in a white cloth, a disc of obsidian. Carmen took off her field jacket and wrapped them in it. | Alan takes the discs (pose), the jacket (sound); alan_su_discs, vasco_su_discs |
| `narr_mark_su_2` | Alan stood and looked at the letter for a long time. | a long pause |
| `narr_rock_2` | Carmen lit the camping stove and made coffee. Yeray stood a little way off, in the dark, not coming closer, as if he didn't think he was allowed. Slowly the shaking eased. | the room (Carmen by the stove, Yeray at the edge of the light) |
| `narr_rock_look` | He looked at Alan. | a pause |
| `narr_rock_3` | Nobody said anything. Alan watched Vasco understand it, and decide not to say anything about it, and put it away somewhere behind his eyes. | a long silence |
| `narr_rock_watch` | Alan reached into his pocket. Vasco's watch, from the bedside table in the hotel, still going. He held it out. | Alan holds it out (pose); vasco_rock_watch |
| `narr_rock_strap` | Vasco took the watch, and put it on, slowly, with his stiff, cold fingers, and did up the strap. | a pause |
| `narr_rock_4` | Vasco leaned his head against Alan's shoulder, the whole weight of it, the way he did sometimes in the mornings in Lisbon, half asleep, before the coffee. | Vasco comes close |
| `narr_rock_5` | And there it was. Now. The thing he had to say. Vasco. On Friday night. After you left. He opened his mouth. | Alan: alan_rock_friday |
| `narr_rock_cold` | Alan went cold. Colder than the water. | vasco_rock_12 |
| `narr_rock_hold` | Alan put his arm round him, and held on. | Alan holds on (pose) |
| `narr_rock_one_try` | Carmen lit a cigarette. It took her one try. | one match (sound), after Carmen's four in the flat |
| `narr_rock_silence` | Nobody said anything for a long time. Below them, under the stars, the sea of cloud lay silver and still, glowing softly orange all along the coast. | a long silence |
| `narr_path_2` | Carmen went first, with the lantern. Then Vasco, one hand on the rope and the other on Alan's shoulder; then Alan, with the discs in Carmen's jacket against his chest. Then Yeray, last, carrying the pick for no reason. | narr_path_1, shortened |
| `narr_path_3` | As they came round the buttress they saw a light in the cave mouth. And they heard the water: a long, deep, breathing sound, in and out, like surf on a beach a long way down. Or like something very large, asleep, beginning to wake. | the water's breathing (sound), over the black |
| `narr_path_4` | The smell came out of the cave mouth to meet them. Salt. Stone. Deep water that had never seen the sun. Vasco's hand tightened on Alan's shoulder. | cut |
