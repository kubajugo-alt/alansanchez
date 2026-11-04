# Friday and Saturday (Alan): the lines to read, with the narrator cut back (2026-10-31)

The user: "over all, with your re-works there is way too much narrator. We don't need that much description. Some things
should simply be done by the characters, other just said by the characters - we don't need to have it all described"; and
"It is not only the finale with the narrator - it is basically the entire game, after you've redone it based on the novel".

Same pass as Cave 6 (`docs/puzzles/CAVE6_LINES.md`, entry 109), for Friday (`js/story/fri.js`: the fight, the sea wall and
Chano, Carmen's coffee, the dusk, Rafa's bar, the studio night) and Saturday as Alan (`js/story/sat.js`, and the Saturday
narration `js/story/puzzles.js` plays: the receipt, the belfry and the radio, the run to Don Lolo). Vasco's Saturday
chapter (`vasco.js`) is not in this pass. Rafa's bar keeps entry 107 (Yeray drunk at his table, then asleep on it).

Every narrator line was gone through: what the game shows (the rooms, the stills, the mist, Yeray asleep) or what a
character can do (walk, turn, a sound, a pause) is no longer narrated; what the player needs (a fact, a clue, a feeling)
is said by Alan, Vasco, Carmen, Rafa, Chano or Doña Pino; the narrator keeps the chapter openers, the time jumps
(the three tries to leave, nine o'clock, the walk inland, the walk back, the flood at seven and after, the night) and
a few beats nothing else carries (the horn, the quiet door, "he should have asked", the two rules, the bell at three).
The two love-scene stills now carry one short line (the night) and none (the drawing: Alan says it).

| | before | after |
|---|---|---|
| narrator lines played | 186 (Friday 107, Saturday 79) | 20 (Friday 14, Saturday 6) |
| narrator words | 4,022 (Friday 2,380, Saturday 1,642) | 330 (Friday 219, Saturday 111) |
| character lines (every id the scenes use, looks included) | 300 | 336 (the same 300, and 36 new) |
| character words | 3,665 | 4,332 |

166 narrator lines are no longer played (left in `js/lines.js`, so `validate.mjs` lists them as unused; nearly all were
recorded, and the recordings stay on disk). 13 narrator lines were shortened or rewritten; 3 character lines changed
(`carmen_f_go_home`, `alan_bar_in`, `alan_rafa_rum`); 36 new character lines (Alan 31, most of them
his own thoughts; Rafa 1, Chano 1, Doña Pino 3). The longest narrator line left is 25 words. No character line was cut, no clue lost:
the clues that lived in narration are now said (the headline Chano reads, the receipt Alan reads, the footprint, the
museum/cars/bus he tried, the plane at eleven fifteen against the bus at seven).

Nothing here is recorded. The 16 changed lines are in `scripts/voice_redo.txt` and their old recordings moved to
`audio/voice_stale/`, so they play as captions; the 36 new lines have no recording yet. Ids are never renamed.

Done in code instead of told: Vasco faces away on the bed, turns round, walks to the window, turns again, walks to the
door; footsteps after the still; Chano walks over with the beers and back; Rafa walks up the bar past Alan after the
napkin and back, comes round the bar to stand close to him at two, and leads him back down the bar; Rafa fetches the
drawing from the easel; Alan walks to the studio window, kneels by the footprint, lies down by the bed at night; sounds
(cups, paper, the drawer, pours, coins, the pips, the dial tone, clicks on the radio, the pen) and pauses for the silences.

Below, each scene in play order, as it now plays. *Italics* are what the game shows or the characters do (no line).
Status: **new** (this pass), **changed** (this pass), unchanged (in the scene, as it was).

### Friday: the fight (room 404, five in the morning)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the day card; Vasco on the edge of the bed, his back to Alan* | |
| 1 | `narr_f_1` | narr | Neither of them slept. At five o'clock, when the alarm goes, neither of them pretends to. | unchanged |
| 2 | `vasco_f_1` | vasco | The team's picking me up at half past. Rayco wants everyone on site for the solstice. | unchanged |
| 3 | `vasco_f_1b` | vasco | We're staying up there tonight. Tomorrow too, probably. Through to Monday. | unchanged |
| 4 | `alan_f_1` | alan | Through to Monday. | unchanged |
| 5 | `vasco_f_sunrise` | vasco | Noon on Monday is the one that matters. San Juan. I told you. | unchanged |
| 6 | `alan_f_told` | alan | You told me. | unchanged |
| | | | *a pause* | |
| 7 | `alan_f_ask` | alan | Are you going to ask me? What I was doing in his office? | unchanged |
| 8 | `vasco_f_2` | vasco | I know what you were doing in his office. You were looking for something to prove that someone was doing something wrong. | unchanged |
| 9 | `vasco_f_2b` | vasco | Because you'd decided something was wrong, and instead of telling me, you broke into my director's office in the middle of my presentation. | unchanged |
| 10 | `vasco_f_2c` | vasco | In front of the people who are paying for the work I've wanted to do my whole life. | unchanged |
| 11 | `alan_f_monte` | alan | It's Montesdeoca. Vasco, listen to me. The discs from the cave are going into his van. One a month. He wants a hotel at Artenara, Chano says... | unchanged |
| 12 | `vasco_f_chano` | vasco | Chano. [pause] The man at the kiosk. | unchanged |
| 13 | `alan_f_chano` | alan | He knows everything. | unchanged |
| 14 | `vasco_f_lottery` | vasco | He sells lottery tickets, Alan. | unchanged |
| | | | *Vasco turns round on the bed at last* | |
| 15 | `vasco_f_van` | vasco | The discs go in Ignacio's van because Ignacio paid for the new display cases and offered the van to take them down. That's all. | unchanged |
| 16 | `vasco_f_van_2` | vasco | I signed the transfer sheets myself. They're in the conservation lab in the museum's basement. You could have asked me. [pause] You could have just asked me. | unchanged |
| 17 | `alan_f_else` | alan | There's something else. | unchanged |
| 18 | `vasco_f_course` | vasco | Of course there is. | unchanged |
| 19 | `alan_f_mist` | alan | On Tuesday. On the promenade. There was a mist. | unchanged |
| 20 | `alan_f_told_all` | alan | The black mist, coming in against the wind. The smell of the cistern. A helmet in Doña Pino's net. A fisherman drowned in his bed, nowhere near the water. | **new** |
| 21 | `alan_f_told_all_2` | alan | The tide a step higher every morning. My family's mark on a bell in Santa Ana. A sealed letter. I faxed it to Inês. | **new** |
| | | | *a long pause* | |
| 22 | `vasco_f_tuesday` | vasco | Tuesday. | unchanged |
| 23 | `alan_f_vasco` | alan | Vasco... | unchanged |
| 24 | `vasco_f_tuesday_2` | vasco | You saw it on Tuesday. You stood next to me on the promenade, and you smelled the thing that nearly killed you in that cistern, and you said sunburn. | unchanged |
| 25 | `vasco_f_sunburn` | vasco | Sunburn. [pause] And then you went to bed with me. | unchanged |
| | | | **the choice (one of three)** | |
| 26 | `alan_f_choice_c` | alan | I didn't want to spoil it for you. | unchanged |
| 27 | `vasco_f_3c` | vasco | Spoil it. | unchanged |
| 28 | `alan_f_spoil` | alan | Your week. Your cave. You were so happy, Vasco. You were lit up. I've never seen you like that. | unchanged |
| 29 | `alan_f_spoil_2` | alan | I didn't want to walk in with my ghosts and turn it into a week about me. | unchanged |
| 30 | `vasco_f_eighty` | vasco | So instead you made it about you in front of eighty people. | unchanged |
| 31 | `alan_f_choice_a` | alan | Because nobody would have believed me. | unchanged |
| 32 | `vasco_f_3a` | vasco | Nobody? I'm not nobody, Alan. You didn't ask me. You never ask. You'd rather break into a desk than say 'Vasco, I'm frightened'. | unchanged |
| 33 | `alan_f_choice_b` | alan | In my defence, I was very sunburnt. | unchanged |
| 34 | `vasco_f_3b` | vasco | Don't do that. Don't make it a joke so I have to laugh. You always do that, and I always laugh, and I'm not laughing. | unchanged |
| | | | *a pause; Vasco goes to the window and stands with his back to the room* | |
| 35 | `vasco_f_4` | vasco | Do you know what I've been doing for eight months? I've been waiting. Every morning. | unchanged |
| 36 | `vasco_f_coffee` | vasco | I make the coffee and I put it by the bed, and I wait for you to decide whether you're staying. Every single morning. | unchanged |
| 37 | `vasco_f_coffee_2` | vasco | I can see you deciding. You wake up, and you look at the coffee, and you look at me, and I can see you thinking: is this the day I go? | unchanged |
| 38 | `alan_f_4` | alan | That's not true. | unchanged |
| 39 | `vasco_f_true` | vasco | It's true. You know it's true. | unchanged |
| | | | *he turns round* | |
| 40 | `vasco_f_true_2` | vasco | And I've never said anything. Because I thought, he'll stop. He'll get used to it. One morning he'll wake up and just drink the coffee. | unchanged |
| 41 | `vasco_f_true_3` | vasco | And every time you go off on your own and keep something from me, and handle it, the way you always handle things, on your own, so you never have to need anybody... | unchanged |
| 42 | `vasco_f_true_4` | vasco | I think: that's him packing. That's him getting ready to leave. | unchanged |
| 43 | `alan_f_5` | alan | I'm not leaving. | unchanged |
| 44 | `vasco_f_know` | vasco | You don't know that. You've never known that. | unchanged |
| | | | *a pause* | |
| 45 | `vasco_f_tell` | vasco | I'm going to tell you something. I should have told you in January, before I moved in. I didn't, because I was ashamed. | unchanged |
| 46 | `vasco_f_lorenzo_1` | vasco | When I was in Rome, at the Gregorian, I was twenty-six. There was a man called Lorenzo. An architect. | unchanged |
| 47 | `vasco_f_lorenzo_1b` | vasco | He was restoring a church in Trastevere, and I was writing about the same church, and we met on the scaffolding. | unchanged |
| 48 | `vasco_f_lorenzo_2` | vasco | He was very kind. Very patient. He knew what I was, and what I wanted to be, and he never once asked me to choose. He just waited. For four years. | unchanged |
| 49 | `vasco_f_lorenzo_2b` | vasco | He'd say, whenever you're ready. Whenever you're ready, Vasco, I'll be here. | unchanged |
| 50 | `vasco_f_lorenzo_flat` | vasco | And then one day I was ready. Or nearly. He'd found a flat for us. Two rooms over a bakery, with a terrace where you could see the dome of Saint Peter's. | unchanged |
| 51 | `vasco_f_lorenzo_4` | vasco | He took me to see it. He'd already bought a coffee pot. | unchanged |
| | | | *a pause: his voice catches, and he waits until it doesn't* | |
| 52 | `vasco_f_lorenzo_5` | vasco | And I went home that night, and packed my bags, and took the night train to Lisbon. I didn't tell him. I didn't leave a note. I didn't call. | unchanged |
| 53 | `vasco_f_lorenzo_6` | vasco | I was so frightened of wanting something that much that I ran away from it in the middle of the night, like a thief. | unchanged |
| 54 | `vasco_f_lorenzo_7` | vasco | And I hid in the Church for nine years, because the Church was the one place he couldn't follow me. | unchanged |
| | | | *a pause* | |
| 55 | `vasco_f_lorenzo_3` | vasco | I've been the one who leaves. I know what it looks like from the inside. I know exactly what it does to the person who's left. | unchanged |
| 56 | `vasco_f_lorenzo_8` | vasco | And I won't be left by a man who's scared. Not again. Not by you. [pause] I'd rather go first. | unchanged |
| 57 | `narr_f_19` | narr | Outside, a horn sounds. Twice. | unchanged |
| | | | *clothes (sound); a pause; Vasco walks to the door* | |
| | | | **the still (still_fight)** | |
| 58 | `vasco_f_leave` | vasco | If you're right. About the mist. About the sea. If it's really here. [pause] | unchanged |
| 59 | `vasco_f_leave_2` | vasco | Then you should go home, Alan. Go back to Lisbon. There's a flight on Sunday. Go and be safe. | unchanged |
| 60 | `alan_f_you` | alan | And you? | unchanged |
| 61 | `vasco_f_needed` | vasco | I'm needed here. | unchanged |
| | | | *the door (sound)* | |
| 62 | `narr_fight` | narr | The door closes quietly. Vasco has never slammed a door in his life. | unchanged |
| | | | *back in the room, Vasco gone; his footsteps down the corridor (sound)* | |
| 63 | `alan_f_cup` | alan | His cup from yesterday. [pause] No coffee by the bed this morning. | **new** |
| 64 | `alan_f_alone` | alan | [pause] There's a flight on Sunday. | unchanged |

### Friday: the sea wall all day, and Chano with two beers (Las Canteras)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *on the wall by the kiosk* | |
| 1 | `narr_f_wall_1` | narr | He doesn't go to La Isleta, or the cathedral, or the phone box. He sits on the sea wall. | **changed** |
| 2 | `alan_f_wall_1` | alan | The longest day of the year. Somewhere over the panza the sun is standing still. [pause] It feels like everything is. | **new** |
| | | | *the water (sound), a pause* | |
| 3 | `alan_f_wall_2` | alan | Lorenzo, in an empty flat in Rome, with a new coffee pot. [pause] And Vasco was right. Every morning for eight months I've looked at the coffee and wondered if this was the day. | **new** |
| 4 | `alan_f_wall_3` | alan | Not because I wanted to go. Because I was so frightened of how much I wanted to stay. [pause] And he saw it, every morning. And made the coffee anyway. | **new** |
| | | | *Chano walks over from the kiosk; bottles set down (sound)* | |
| 5 | `narr_f_chano_1` | narr | In the afternoon Chano sits down beside him with two beers, and says nothing for twenty minutes. For Chano, a kind of miracle. | **changed** |
| 6 | `chano_f_1` | chano | El doctor left early this morning. | unchanged |
| 7 | `alan_f_chano_1` | alan | Yes. | unchanged |
| 8 | `chano_f_2` | chano | With a face. | unchanged |
| 9 | `alan_f_chano_2` | alan | Yes. | unchanged |
| | | | *a pause* | |
| 10 | `chano_f_3` | chano | My wife left me once. Nineteen seventy-nine. Three weeks. She went to her sister's in Telde. | unchanged |
| 11 | `alan_f_chano_3` | alan | What did you do? | unchanged |
| 12 | `chano_f_4` | chano | I went to Telde, hombre. What do you think? | unchanged |
| 13 | `chano_f_5` | chano | She's still angry about it. Seventeen years. She says I took too long. | unchanged |
| | | | *Chano walks back to his kiosk* | |
| 14 | `alan_f_wall_end` | alan | Carmen. [pause] Carmen will be rude to me. That's something to do. | unchanged |

### Friday: Carmen's coffee and how the cave works (the archive)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *coffee cups (sound), a pause* | |
| 1 | `carmen_f_1` | carmen | That was the stupidest thing I have ever seen anyone do in this building. And I once watched a deputy minister try on a mummy's necklace. | unchanged |
| 2 | `alan_f_carmen_1` | alan | Thank you. | unchanged |
| 3 | `carmen_f_coffee` | carmen | It wasn't a compliment. [pause] He left this morning. Your doctor. I heard. | unchanged |
| 4 | `alan_f_carmen_1b` | alan | Everyone hears everything here. | unchanged |
| 5 | `carmen_f_island` | carmen | It's an island. [pause] What do you want, Señor Sanches? | unchanged |
| 6 | `alan_f_carmen_2` | alan | The cave. Tell me how it works. Not the story. The stone. | unchanged |
| | | | *the photographs come out (sound)* | |
| 7 | `carmen_f_photo` | carmen | Cave 6. Mira: seven triangles on the back wall, a sign over each. A little hole in the roof, and a bigger one in the floor, under it. | unchanged |
| 8 | `carmen_f_beam` | carmen | From the spring equinox to the autumn one, el sol comes straight down that hole at noon, through a hole in the floor, onto seven black discs in the room underneath. | unchanged |
| 9 | `carmen_f_beam_2` | carmen | And the discs throw it back up. Each one onto its own triangle, mira, on the wall upstairs. At the solstice the column's at its fullest. | unchanged |
| 10 | `carmen_f_triangles` | carmen | They all point down. Every one. The textbooks say they're fertility symbols. | unchanged |
| 11 | `alan_f_carmen_and` | alan | And you? | unchanged |
| 12 | `carmen_f_discs` | carmen | A friend of mine thought they were arrows. [pause] She thought the discs were mirrors. Each one keeping its own triangle lit. | unchanged |
| 13 | `carmen_f_door` | carmen | She thought all the triangles pointed at one place. [pause] A door, she said. Una puerta. In the floor. | unchanged |
| 14 | `alan_f_door` | alan | Porta. [pause] In Portuguese it's the same word, with less hope in it. | unchanged |
| 15 | `carmen_f_sentence` | carmen | She thought the whole thing was a sentence, and the light was reading it out loud, every day, so it stayed true. | unchanged |
| 16 | `alan_f_carmen_friend` | alan | Your friend? | unchanged |
| 17 | `carmen_f_dead` | carmen | She's dead. | unchanged |
| | | | *the photographs go back (sound)* | |
| 18 | `carmen_f_san_juan` | carmen | Las Palmas was founded on Saint John's day. The twenty-fourth of June. Did you know that? In the old reckoning, that was the solstice. | unchanged |
| 19 | `carmen_f_san_juan_2` | carmen | El sol stands still for three days, and on the fourth day it turns back. The Canarios knew it. The Church knew it. Rejón knew it when he planted his flag. | unchanged |
| | | | *the drawer (sound)* | |
| 20 | `carmen_f_san_juan_3` | carmen | Everybody on la isla has always known that morning matters. Nobody remembers why. | unchanged |
| 21 | `alan_f_carmen_why` | alan | Matters how? What happens if the light doesn't stay on its path? | unchanged |
| 22 | `carmen_f_friend` | carmen | My friend said the lock is weakest the day el sol turns back. At noon. [pause] I don't know why I'm telling you this. | unchanged |
| 23 | `alan_f_carmen_3` | alan | Because I'm the only one who's said 'black mist' to you out loud. | unchanged |
| | | | *a pause* | |
| 24 | `carmen_f_go_home` | carmen | Go home, Señor Sanches. [pause] Before Sunday. [pause] Por favor. I'm asking you. | **changed** |
| | | | **then the questions, for those who ask** | |
| 25 | `alan_ask_carmen_friend` | alan | Your friend. Was it Dr. Suárez? | unchanged |
| 26 | `carmen_f_friend_2` | carmen | Was. [pause] Drink your café. | unchanged |
| 27 | `alan_ask_carmen_sunday` | alan | What happens on Sunday? | unchanged |
| 28 | `carmen_f_sunday` | carmen | San Juan. The bonfires. The whole city in el mar at midnight. And at noon, the cave. [pause] I don't know. That's why you should go home. | unchanged |
| 29 | `alan_ask_carmen_dinner` | alan | You saw his face. At the dinner. | unchanged |
| 30 | `carmen_f_dinner` | carmen | I saw. [pause] The face of a man hit by somebody he loves. It's a particular face. I wore it for a year, in my marriage. | unchanged |
| 31 | `carmen_f_dinner_2` | carmen | It doesn't last, hombre. It's the other face you want to worry about. The one that stops minding. | unchanged |
| 32 | `alan_bye_carmen` | alan | Thank you, Carmen. | unchanged |
| 33 | `carmen_f_bye` | carmen | Don't thank me. Go home. | unchanged |

### Friday: dusk, the mist up the steps, the walk inland (Las Canteras)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *at the rail, facing the sea* | |
| 1 | `alan_f_dusk_0` | alan | Artenara. The long white road up through the cloud. I could hire a car and be there in two hours. | **new** |
| 2 | `alan_f_dusk_1` | alan | And say what? | unchanged |
| 3 | `alan_f_dusk_2` | alan | I'm sorry. I'm scared. I'm scared of the sea and I'm scared of you. [pause] And I'm much more scared of you. | unchanged |
| | | | *a pause* | |
| 4 | `narr_f_dusk_3` | narr | Nine o'clock. Under the panza he can't see the sun go down: only the light going dull, then bruised. | **changed** |
| | | | *a wave (sound); the mist comes in, heavier than Tuesday (drawn)* | |
| 5 | `alan_f_dusk_3` | alan | There. Past the reef. [pause] Against the wind, like Tuesday. Faster. Thicker. | **new** |
| | | | *a dog (sound)* | |
| 6 | `alan_f_dusk_4` | alan | Over the sand. Up the first step, the second. [pause] Somebody's saying panza. It isn't the panza. The panza's up there, where it always is. This is underneath it. | **new** |
| | | | *the water (sound)* | |
| 7 | `alan_f_dusk_5` | alan | The cistern. [pause] I can smell the cistern. | **new** |
| | | | *Alan walks away from the sea, inland; fade; steps on cobbles (sound)* | |
| 8 | `narr_f_walk_1` | narr | He walks a long time, away from the sea, into the old town: wanting, for one night, to be someone with nothing to lose. | **changed** |

### Friday: Rafa's bar (Yeray drunk at the corner table, then asleep)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | **in** | |
| 1 | `alan_bar_in` | alan | No mist in here. [pause] Two drinks. Then the hotel. And in the morning a car, and the mountain, and something to say to him. I'll think of it on the way up. | **changed** |
| | | | **Rafa, the first time** | |
| 2 | `rafa_1` | rafa | You look like a man who needs rum. | unchanged |
| 3 | `alan_rafa_1` | alan | Is that how I look? | unchanged |
| 4 | `rafa_2` | rafa | That, or a priest. You have the face of a man who's been listening to confessions all day. | unchanged |
| 5 | `rafa_2b` | rafa | Ron. Local. It's terrible. You'll love it. | unchanged |
| | | | *the rum poured (sound), Alan drinks* | |
| 6 | `alan_rafa_rum` | alan | [pause] That's terrible. [pause] Another. | **changed** |
| | | | *poured again* | |
| 7 | `rafa_3` | rafa | Rafa. | unchanged |
| 8 | `alan_rafa_2` | alan | Alan. | unchanged |
| 9 | `rafa_4` | rafa | Alan. [pause] Inglés? | unchanged |
| 10 | `alan_rafa_3` | alan | Portuguese. With an American mother. It's complicated. | unchanged |
| 11 | `rafa_5` | rafa | Everything's complicated, hombre. Drink your rum. | unchanged |
| | | | **Rafa, the questions** | |
| 12 | `alan_ask_rafa_paint` | alan | The faces on the walls. Are they yours? | unchanged |
| 13 | `rafa_paint` | rafa | All mine. I paint everyone who comes in. It's a sort of tax. Since I was sixteen. | unchanged |
| 14 | `rafa_paint_2` | rafa | Madrid, one day. Art school, when I've saved enough. [pause] I've been saying that for seven years. I think I like it here too much. | unchanged |
| 15 | `alan_rafa_paint` | alan | And where would I go? Between the dog in the hat and the fisherman? | unchanged |
| 16 | `rafa_paint_3` | rafa | By the door. Where I can see you come in. | unchanged |
| 17 | `alan_rafa_flatter` | alan | Careful. I'm very easily flattered after two rums. | unchanged |
| 18 | `alan_ask_rafa_island` | alan | Why not go now? Madrid's not far. | unchanged |
| 19 | `rafa_island` | rafa | The light. You can't get light like this in Madrid. In Madrid the light is like a government building. Here it's... | unchanged |
| | | | *a pause (he looks for the word)* | |
| 20 | `rafa_island_2` | rafa | Here it's alive. | unchanged |
| 21 | `alan_rafa_island` | alan | It's been grey since I arrived. | unchanged |
| 22 | `rafa_island_3` | rafa | That's the panza. That's not the light. The light's above it. You have to go up to see it. [pause] Have you been up? | unchanged |
| 23 | `alan_rafa_island_2` | alan | No. [pause] Not yet. | unchanged |
| 24 | `yeray_bar_3` | yeray | ...and el doctor— el doctor doesn't know. The Portuguese. Pobre. He thinks they go to Las Palmas, to the... the lab. Yeray, the lab, he says. The lab, the lab... | unchanged |
| 25 | `alan_ask_rafa_draw` | alan | What are you doing with that pencil? | unchanged |
| 26 | `rafa_draw_1` | rafa | Paying my tax. | unchanged |
| | | | *the pencil (sound)* | |
| 27 | `yeray_bar_1` | yeray | ...once a month... once— I'm telling you, eh, once a month since Christmas. Every moon. When the moon is new. When the others are asleep. Asleep... | unchanged |
| 28 | `rafa_draw_2` | rafa | Hold still. You're laughing. Stop laughing. No, keep laughing. | unchanged |
| | | | *a pause; the napkin is given* | |
| 29 | `alan_rafa_napkin_0` | alan | It's me. A dozen lines. Not the face I check in the mirror for grey. The one I've got tonight. | **new** |
| 30 | `alan_rafa_napkin` | alan | That's not fair. | unchanged |
| 31 | `rafa_draw_3` | rafa | Drawing's never fair. That's what it's for. | unchanged |
| 32 | `yeray_bar_2` | yeray | ...down to the— the vault. The old granary. Under the caves. And he locks it. Click. [hiccup] And only he's got the key. Only him. | unchanged |
| | | | *Rafa goes up the bar, past Alan* | |
| 33 | `alan_rafa_touch` | alan | He touched my shoulder going past. [pause] I didn't hear another word anyone said. | **new** |
| | | | *he comes back* | |
| 34 | `alan_ask_rafa_another` | alan | Another one. | unchanged |
| 35 | `rafa_another` | rafa | Salud. [pause] To terrible ron. | unchanged |
| 36 | `alan_bye_rafa` | alan | Back in a minute. | unchanged |
| 37 | `rafa_bye` | rafa | I'm not going anywhere, hombre. I work here. | unchanged |
| | | | **Yeray (talked to)** | |
| 38 | `alan_yeray_1` | alan | You all right there? | unchanged |
| 39 | `yeray_bar_4` | yeray | Me? I'm fine. Fine, fine, fine. [pause] Forget it, hombre. Forget it. | unchanged |
| | | | *a pause: he goes back to talking to his glass* | |
| 40 | `yeray_bar_5` | yeray | ...conservation, he says. Con-ser-va-ción. Pfff. Six moons, and not one gets to the lab. Not one. I carried them down myself. With these hands, mira... | unchanged |
| 41 | `yeray_bar_6` | yeray | ...and I say sí, doctor, sí, the lab, and I can't look at him... I can't. If I open my mouth I lose everything. Everything. He's been like a father to me. A father, you understand? | unchanged |
| 42 | `alan_yeray_2` | alan | Sounds rough. | unchanged |
| | | | **the door, before Rafa** | |
| 43 | `alan_stay_0` | alan | I came in for two drinks. I haven't had one yet. | unchanged |
| | | | **the first try to leave** | |
| 44 | `narr_leave_1` | narr | The first time he tries to leave is at eleven. | unchanged |
| | | | *coins (sound)* | |
| 45 | `alan_leave_1` | alan | I should go. | unchanged |
| 46 | `rafa_leave_1` | rafa | Already? You've only had three. Nobody leaves after three. It's bad luck. | unchanged |
| 47 | `rafa_leave_1b` | rafa | It's like leaving a story in the middle. | unchanged |
| 48 | `alan_leave_1b` | alan | I have to be up early. | unchanged |
| 49 | `rafa_leave_1c` | rafa | Why? | unchanged |
| 50 | `alan_leave_1c` | alan | [pause] Nobody needs me up early. Nobody's waiting for me. [pause] There's no coffee by the bed. | **new** |
| 51 | `alan_stay_1` | alan | [pause] One more. | unchanged |
| | | | *pour (sound)* | |
| | | | **the second try: the telephone** | |
| 52 | `narr_leave_2` | narr | The second time is at midnight. | unchanged |
| 53 | `alan_leave_2` | alan | Rafa. Have you got a telephone? | unchanged |
| 54 | `rafa_phone` | rafa | Toma. [pause] It eats coins, cuidado. | **new** |
| | | | *coins, the dial (sound)* | |
| 55 | `alan_leave_2b` | alan | Is there any way to reach the dig at Risco Caído? The camp has a radio. Could the museum radio the camp? | unchanged |
| | | | *a long pause* | |
| 56 | `guard_f_1` | guard | Nada, señor. No answer from the camp. The radio must be switched off. Perhaps they're all asleep. It's midnight. | unchanged |
| 57 | `guard_f_2` | guard | Is it an emergency? | unchanged |
| | | | *a pause* | |
| 58 | `alan_leave_2c` | alan | No. [pause] No. It can wait. | unchanged |
| | | | *the receiver down (sound)* | |
| 59 | `alan_stay_2` | alan | He's not even answering his radio. | unchanged |
| | | | *Rafa pours (sound)* | |
| | | | *Yeray falls asleep on his table (the sprite changes)* | |
| 60 | `alan_yeray_face` | alan | The boy's asleep. A nice face. An unhappy one. Even asleep. | **new** |
| 61 | `rafa_yeray_1` | rafa | Yeray. He's on the dig, up at Artenara. He comes down when he can't stand it. | unchanged |
| 62 | `rafa_yeray_2` | rafa | He's got a lot on his mind, pobrecito. Let him sleep. | unchanged |
| 63 | `narr_yeray_go_3` | narr | Alan should have asked. Later he'll think about this moment more than any other. | **changed** |
| 64 | `alan_yeray_3` | alan | Hasn't everyone. | unchanged |
| | | | *Rafa's pencil on the back of the napkin (sound)* | |
| | | | **the third try: the question** | |
| 65 | `narr_leave_3` | narr | The third time is at two, when the radio is off and Rafa is putting the chairs up. | **changed** |
| | | | *chairs going up (sound)* | |
| 66 | `alan_leave_3` | alan | I should go. | unchanged |
| | | | *Rafa comes round the bar to stand close to him* | |
| 67 | `alan_stay_3` | alan | I'm just talking. I'm just... I just needed somewhere to sit. I'm not... | unchanged |
| 68 | `rafa_closing` | rafa | I know. [pause] Me too. | unchanged |
| 69 | `rafa_upstairs` | rafa | My studio's upstairs. I've got café. Real café. Not the terrible ron. | unchanged |
| | | | *a pause* | |
| 70 | `rafa_someone` | rafa | Is there someone? | unchanged |
| | | | *a long pause* | |
| 71 | `narr_q_5` | narr | He thinks of a man asleep with one arm across his chest, and of two conditions, said in a Lisbon kitchen in January. | **changed** |
| 72 | `narr_q_6` | narr | Tell me first. Not after. And never to settle a fight. | unchanged |
| 73 | `alan_q_1` | alan | He told me to go home. [pause] I'm thirty-eight, and I've never stayed anywhere long enough to be left. I'm not going to start tonight. | **new** |
| | | | **the answer (either)** | |
| 74 | `alan_someone_no` | alan | No. | unchanged |
| | | | *a pause* | |
| 75 | `alan_someone_no2` | alan | [pause] No. | unchanged |
| | | | *a long look; Rafa leads him back down the bar; the stairs (sound)* | |
| | | | **the still (still_rafa_night; Discreet: black)** | |
| | | | *a long pause; Santa Ana's bells (sound)* | |
| 76 | `narr_rafa_night_6` | narr | Santa Ana strikes three. His family's bell hums on in the dark, asking him something. He doesn't answer. | **changed** |
| | | | *the bell humming (sound), a pause* | |

### Saturday: the studio, the morning after

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the day card; bells (sound); Rafa at the gas ring* | |
| 1 | `narr_s_wake_1` | narr | He wakes to Santa Ana's bells. For a few seconds, eyes closed, he doesn't know where he is, and he is happy. | **changed** |
| | | | *a pause* | |
| 2 | `alan_s_wake_1` | alan | Grey light through a window I don't know. Turpentine. A pillow that smells of someone else's shampoo. | unchanged |
| 3 | `alan_s_wake_2` | alan | [pause] Oh, no. [pause] Oh, Alan. | unchanged |
| | | | **the still (still_rafa_drawing)** | |
| 4 | `alan_s_drawing` | alan | Me. Asleep. [pause] The most beautiful drawing anyone has ever made of me. [pause] I feel sick. | **new** |
| | | | *his clothes (sound)* | |
| 5 | `alan_s_go` | alan | I could go now, before he turns round. Money on the table, out of the door, someone else by lunchtime. [pause] I always have. | **new** |
| | | | *he walks to the window instead* | |
| 6 | `alan_s_window_1` | alan | I lied to him. He asked me, straight out, and I lied. | unchanged |
| 7 | `alan_s_window_2` | alan | And Vasco said two things. Only two. Tell me first. Never to settle a fight. | unchanged |
| 8 | `alan_s_window_3` | alan | I broke both of them in one night. [pause] And the second one I broke on purpose. | unchanged |
| | | | **Rafa: coffee (and the sketchbook, if not read yet)** | |
| 9 | `rafa_s_1` | rafa | Café. Real coffee. I promised. | unchanged |
| | | | *poured (sound)* | |
| 10 | `alan_s_napkin` | alan | His sketchbook. With a napkin from the bar in it, like a bookmark. | **new** |
| | | | *the sketchbook close-up (docs.js), then a pause* | |
| 11 | `alan_s_sketch_1` | alan | Not Montesdeoca. Not the van, not the hotel, not the circled resorts on the map. | unchanged |
| 12 | `alan_s_sketch_2` | alan | Baute. [pause] One a month, one by one, down into a vault under the mountain. Only he has the key. And Vasco signed the transfer sheets himself. | unchanged |
| 13 | `alan_s_sketch_3` | alan | He's up there now. With Baute. Through to Monday. Calling him Rayco. | unchanged |
| 14 | `alan_s_sketch_4` | alan | I heard every word of it last night. I was too busy watching Rafa's hands to listen. | unchanged |
| 15 | `rafa_s_yeray_1` | rafa | Yeray. Pobre. He talks when he drinks. I write it down. | unchanged |
| 16 | `rafa_s_yeray_2` | rafa | It's a bad habit. I'll stop one day. [pause] You know him? | unchanged |
| 17 | `alan_s_rafa_1` | alan | No. I know the man he works for. | unchanged |
| | | | **the truth** | |
| 18 | `alan_s_truth` | alan | Rafa. Last night. When you asked me if there was someone. | unchanged |
| | | | *a pause* | |
| 19 | `alan_s_truth_2` | alan | There is. His name's Vasco. Eight months. He's up on the mountain at Artenara, on the dig. Yeray's dig. | unchanged |
| 20 | `alan_s_truth_4` | alan | We had a fight yesterday morning, and he left. And I came out last night to be someone who didn't have anything to lose. | unchanged |
| 21 | `alan_s_truth_3` | alan | And I lied to you. You asked me straight, and you deserved a straight answer. I'm sorry. | unchanged |
| | | | *a long pause* | |
| 22 | `rafa_s_truth_1` | rafa | I know. | unchanged |
| 23 | `alan_s_truth_5` | alan | You know? | unchanged |
| 24 | `rafa_s_truth_2` | rafa | You said no. [pause] Nobody says no like that unless it's yes. | unchanged |
| 25 | `rafa_s_truth_3` | rafa | I'm twenty-three, Alan. I'm not stupid. I just thought, he's sad, and he's beautiful, and he's leaving on Sunday anyway. | unchanged |
| 26 | `rafa_s_truth_4` | rafa | What does it matter, hombre? | unchanged |
| 27 | `rafa_s_truth_5` | rafa | [pause] It matters. I know it matters. I'm sorry too. | unchanged |
| | | | *a pause; Rafa fetches the drawing from the easel* | |
| 28 | `rafa_s_drawing` | rafa | Take it. | unchanged |
| 29 | `alan_s_cant` | alan | I can't. | unchanged |
| 30 | `rafa_s_drawing_2` | rafa | Take it. It's yours. It's not mine. I just saw it. | unchanged |
| | | | *the drawing is given* | |
| 31 | `rafa_s_drawing_3` | rafa | It's the last time you'll look that young. You should have something to remember it by. | unchanged |
| 32 | `alan_s_thanks` | alan | Thank you. [pause] For the coffee. For the drawing. Mostly for the coffee. | unchanged |
| 33 | `rafa_s_bye` | rafa | Vale. Go and tell him. [pause] Before Yeray does. Yeray tells everybody everything. | unchanged |

### Saturday: the walk back, Nieves, the footprint

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *out of the door; fade; bells (sound)* | |
| 1 | `narr_s_walk_1` | narr | He walks back through a city getting ready for its birthday. Fiestas Fundacionales: five hundred and eighteen years, on the day the sun turns back. | **changed** |
| | | | *the lobby; a pause* | |
| 2 | `alan_s_nieves_0` | alan | Her eyebrow doesn't move at all. [pause] That's how bad I look. | **new** |
| 3 | `alan_sat_nieves` | alan | Any messages? | unchanged |
| 4 | `nieves_sat_eyebrow` | nieves | No. | unchanged |
| 5 | `alan_s_msg_2` | alan | From Dr. Teles? From the dig? | unchanged |
| | | | *a long pause* | |
| 6 | `nieves_s_msg` | nieves | No. Nothing, señor. | unchanged |
| 7 | `nieves_s_coffee` | nieves | There's café in the machine. It's still terrible. I'll bring you some. | unchanged |
| | | | *room 404* | |
| 8 | `alan_s_room_1` | alan | Just as he left it. His good jacket on the chair. [pause] His watch. He forgot his watch. | **new** |
| 9 | `alan_s_room_2` | alan | And on the tiles by his side of the bed... a footprint. Wet. One bare foot, long and narrow, pointing at where I should have been asleep. | **new** |
| 10 | `alan_s_print_1` | alan | The balcony doors are shut. [pause] The bathroom's dry. | unchanged |
| | | | *a pause* | |
| 11 | `alan_s_father` | alan | I don't know why I'm thinking of my father. Pedro Sanches. He went out fishing off Cascais when I was a boy, and never came back. [pause] I can't remember his face any more. | **new** |
| | | | *he walks to it and kneels; water (sound), a pause* | |
| 12 | `alan_s_salt` | alan | Cold. [pause] Salt. | **new** |
| | | | *a knock (sound), a pause* | |
| 13 | `alan_s_dried` | alan | [pause] Dry. Nothing there at all. | **new** |
| 14 | `alan_s_letter_first` | alan | Inês will ring. Before she does, I want to read it myself. It's my language. It's my family's hand. | unchanged |

### Saturday: the call (Inês)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `ines_call_sat_1` | ines | Where have you been? I've been calling the hotel since eight o'clock. | unchanged |
| 2 | `ines_call_sat_1b` | ines | The woman at the desk says you didn't come back last night. The woman at the desk sounds like a disappointed nun. | unchanged |
| 3 | `alan_call_sat_0` | alan | Inês. | unchanged |
| 4 | `ines_call_sat_1c` | ines | Alan. Where were you? | unchanged |
| 5 | `alan_call_sat_1` | alan | I did something. Last night. Vasco and I had a fight, and he went up the mountain. | unchanged |
| 6 | `alan_call_sat_1b` | alan | And I went out, and I met someone. And I slept with him. | unchanged |
| | | | *a long silence on the line* | |
| 7 | `ines_call_sat_2` | ines | And you're telling me. Before you've told Vasco. | unchanged |
| 8 | `alan_call_sat_2` | alan | Yes. | unchanged |
| 9 | `ines_call_sat_2b` | ines | Alan, the rules. The two rules. He told me about them, in the shop, in January. He was so proud of himself for being modern. | unchanged |
| 10 | `ines_call_sat_2c` | ines | Tell me first. Never to settle a fight. [pause] So you broke both of them. | unchanged |
| 11 | `alan_call_sat_2b` | alan | I know, Inês. | unchanged |
| | | | *a pause* | |
| 12 | `ines_call_sat_3` | ines | Tell him. Today. Not when it's convenient. Not when it's safe. Not when you've worked out how to make it sound better. Today. | unchanged |
| 13 | `alan_call_sat_3` | alan | I can't reach him. He's on the mountain. The radio's off. | unchanged |
| 14 | `ines_call_sat_4` | ines | Then find a way. You've always been very good at finding ways into places you shouldn't be. Find a way into one you should. | unchanged |
| 15 | `ines_call_sat_5` | ines | And Alan. The letter from the cathedral. I've read it. | unchanged |
| 16 | `ines_call_sat_6` | ines | It took me two days, a dictionary of eighteenth-century abbreviations, and a professor of palaeography who thinks I'm in love with him. | unchanged |
| 17 | `ines_call_sat_7` | ines | It's from the founders. Four of them signed it. Your family. Bartolomeu Sanches is the first signature. [pause] Are you sitting down? | unchanged |
| 18 | `alan_call_sat_4` | alan | I'm in a phone box. | unchanged |
| 19 | `alan_call_sat_read` | alan | I read it too. This morning. Most of it. | unchanged |
| 20 | `ines_call_sat_you` | ines | You read it? That hand? It took me a professor. | unchanged |
| 21 | `alan_call_sat_rules` | alan | It strikes first at whoever understands the lock. It comes for the ones it gave back. It's shut only at a turning, from inside its water, at the door, at noon. [pause] I couldn't read the last paragraph. | unchanged |
| 22 | `ines_call_sat_last` | ines | No. [pause] I wish I couldn't have either. Here it is. | unchanged |
| | | | *a pause* | |
| 23 | `ines_call_sat_11` | ines | 'To shut the door again, one must stand in its water, at the door, at the noon of the turning, and set the stones while it rises.' | unchanged |
| 24 | `ines_call_sat_12` | ines | 'The last of the priestesses did this. She set the stones, and the Sea withdrew. And it drew her down with it as it went, and she was not seen again.' | unchanged |
| 25 | `ines_call_sat_16` | ines | Alan. The cistern backed away from you because of whose blood you are. In Lisbon that saved you. Here, with the door opening, it's the reason it'll want you first. | unchanged |
| 26 | `alan_call_sat_5` | alan | I know. | unchanged |
| 27 | `ines_call_sat_17` | ines | So if it's opened in your time— | unchanged |
| 28 | `alan_call_sat_6` | alan | I know, Inês. | unchanged |
| | | | *the pips (sound)* | |
| 29 | `ines_call_sat_18` | ines | Tell him today. Tell him everything. And then come home. Promise me. Promise me you'll come h— | unchanged |
| | | | *the dial tone (sound)* | |

### Saturday: Chano's newspaper

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `chano_s_1` | chano | Another one. [pause] No. Worse. Somebody counted. | unchanged |
| 2 | `chano_s_paper` | chano | Mira. Page six, under the tides. 'Seis muertes por ahogamiento lejos del agua desde diciembre. La policía no ve relación.' Six drowned, nowhere near the water. | **new** |
| | | | *Today's La Provincia is given* | |
| 3 | `chano_s_2` | chano | Agaete. Arguineguín. Gáldar. Telde. La Isleta. And the doctora on the mountain road, at Christmas. | unchanged |
| 4 | `chano_s_3` | chano | Old people, in their beds, in their chairs. One in a bath with no water in it. | unchanged |
| 5 | `chano_s_4` | chano | One a month, they say. Every dark moon. And the police see no relation. [pause] I see one. | unchanged |
| 6 | `alan_s_chano_1` | alan | The old ones. Were they on a boat? All of them? | unchanged |
| | | | *Chano stares; a pause* | |
| 7 | `chano_s_5` | chano | The Virgen del Pino. Seventy-one. Everybody in La Isleta knows that story. | unchanged |
| 8 | `chano_s_6` | chano | [pause] How did you know, hombre? | unchanged |
| | | | *a pause* | |
| 9 | `alan_s_chano_2` | alan | Taken back. [pause] The hotel. Inês's fax. | unchanged |

### Saturday: the receipt in the blazer (puzzles.js)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_look_blazer_sat` | alan | Something stiff in the lining. [pause] There's a tear by the inside pocket. | unchanged |
| 2 | `alan_s_receipt_0` | alan | A receipt. San Nicolás. 'Misa por los difuntos de Tasarte, 1966. Pagado. I. M.' Last month. [pause] And folded in it, one for every year before. | **new** |
| | | | *the receipt is given* | |
| 3 | `alan_s_receipt` | alan | He pays for a mass for them. Every year. [pause] Guilty of something, Ignacio. And still paying. | unchanged |

### Saturday: the belfry, the hour, the radio (puzzles.js)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *he sits and waits: fade; the clock chimes, the bell hums (sound); a pause* | |
| 1 | `alan_s_wait_bell` | alan | One o'clock. [pause] My family's bell. | **new** |
| | | | *a click (sound)* | |
| 2 | `alan_s_radio_1` | alan | Risco Caído, Risco Caído. This is Alan Sanches, in Las Palmas. Is anyone there? Over. | unchanged |
| | | | *a click (sound), a pause* | |
| 3 | `baute_r_1` | baute | Risco Caído. Baute. [pause] Alan! What a surprise. Over. | unchanged |
| 4 | `alan_s_radio_2` | alan | I need to speak to Vasco. Please. Over. | unchanged |
| 5 | `baute_r_2` | baute | Ah. You've just missed him. He finished in the cave today, very pleased with himself, and went down to Las Palmas on the guagua. He'll be at your hotel tonight. I think he wanted to surprise you. Over. | unchanged |
| | | | **catching him (with "guagua")** | |
| 6 | `alan_r_catch` | alan | The guagua from Artenara goes once a day, Dr. Baute. At seven in the morning. Over. | unchanged |
| | | | *a long silence* | |
| 7 | `baute_r_lift` | baute | ...Then he got a lift. Over. | unchanged |
| | | | *a click (sound), a pause* | |
| 8 | `alan_s_radio_lie` | alan | He's lying. Vasco's up there, and Baute's lying about where. | unchanged |

### Saturday: he tries (sat.js S.tried)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *fade* | |
| 1 | `narr_s_tried_1` | narr | He tries. Later, he will need to know that he tried. | unchanged |
| 2 | `alan_s_tried_list` | alan | The museum's shut for the weekend. Every car on the island is booked for San Juan. And the only guagua to Artenara went at seven this morning. | **new** |
| 3 | `alan_s_tried` | alan | Fifty kilometres. Uphill. Through the cloud. | unchanged |
| 4 | `alan_s_bus` | alan | The seven o'clock bus tomorrow, then. At the dig by ten. Find Vasco, tell him everything, deal with Baute together. [pause] Very reasonable. I hate it. | **new** |

### Saturday: La Isleta floods

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *he arrives at Don Lolo's, running* | |
| 1 | `alan_s_warn` | alan | Don Lolo. Tonight, at seven, on the tide. Don't let her sleep. Don't let her lie down. | unchanged |
| 2 | `lolo_s_warn` | lolo | [pause] She sleeps in the afternoons now. She says she doesn't. | unchanged |
| 3 | `lolo_s_warn_2` | lolo | I don't sleep anyway, Portuguese. I'll sit with her. [pause] Give me back my radio. | unchanged |
| | | | **the still (still_isleta_flood)** | |
| | | | *water rising (sound)* | |
| 4 | `narr_flood_1` | narr | Seven o'clock. The sea comes into La Isleta: not from the harbour, but up through the drains. | **changed** |
| | | | *a pause* | |
| 5 | `pino_s_1` | pino | Madre mía. I fell asleep. I never fall asleep in the afternoon. | unchanged |
| 6 | `pino_s_1b` | pino | I sat down to say a rosary and I fell asleep, and I woke up drowning in my own bed. | unchanged |
| 7 | `pino_s_2` | pino | He doesn't sleep. Fifty-five years married, and he has never once slept through the night. I always said it would kill me. | unchanged |
| 8 | `pino_s_3` | pino | It saved me. He heard the sea in the room. He pulled me up by my hair. | unchanged |
| 9 | `lolo_s_1` | lolo | By your collar. | unchanged |
| 10 | `pino_s_4` | pino | By my hair! | unchanged |
| 11 | `lolo_s_2` | lolo | Collar. | unchanged |
| | | | *a pause* | |
| 12 | `lolo_s_watched` | lolo | You said watch. I watched. | unchanged |
| 13 | `lolo_s_3` | lolo | Fifty-five years, señor. And she still hasn't forgiven me for the first one. | unchanged |
| | | | **after** | |
| | | | *water draining (sound)* | |
| 14 | `narr_flood_later` | narr | Later, the water sinks back into the drains. The neighbours come with towels and soup and opinions. | **changed** |
| 15 | `pino_s_hospital` | pino | Hospital. Pfff. I told that boy where he could put his hospital. [pause] Madre mía, he went red to the ears. | **new** |
| 16 | `pino_s_missal` | pino | Mira. My list. Two crossed out. Two not. | **new** |
| 17 | `pino_s_list` | pino | Antonio is in Venezuela. Maybe it can't reach Venezuela. Maybe it can. Dios sabe. | unchanged |
| 18 | `pino_s_list_2` | pino | [pause] And me. | unchanged |
| 19 | `alan_s_list` | alan | It came back for you. And it'll come again. | unchanged |
| 20 | `pino_s_know` | pino | Sí. [pause] You know a lot about what the sea does, Portuguese. | unchanged |
| 21 | `alan_s_coming` | alan | It's coming for me too. Not for the same reason. But it's coming. | unchanged |
| | | | *a pause* | |
| 22 | `alan_s_tell_pino` | alan | In Lisbon, in a cistern, it had me up to the chest. It knew my blood, and it backed away. [pause] And there's a bell in Santa Ana with my family's mark on it, Doña Pino. | **new** |
| | | | *a long pause* | |
| 23 | `pino_s_pen` | pino | [pause] Toma. My pen. Write it under mine. | **new** |
| | | | *the pen (sound), a pause; the list close-up shows his name under hers* | |
| 24 | `pino_s_name` | pino | Now God knows too. | unchanged |
| 25 | `pino_s_name_2` | pino | Go home, Portuguese. Go to bed. Say your prayers. | unchanged |

### Saturday: the night (room 404)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the sea through the balcony doors (sound)* | |
| 1 | `narr_s_night_1` | narr | He goes back to the hotel and lies down in his clothes, on his own side of the bed. | **changed** |
| | | | *he walks to the bed; a pause* | |
| 2 | `alan_s_night_1` | alan | The ticket. Lisbon, via Madrid. Tomorrow, eleven fifteen. [pause] Or the guagua at seven, up the mountain. | **new** |
| 3 | `alan_s_night_2` | alan | One of them might save my life. I don't know which. [pause] And the phone doesn't ring. | **new** |
| | | | *then Vasco's chapter (vasco.js, not in this pass)* | |

## Narration cut (no longer played; left in `js/lines.js`, so `validate.mjs` lists them as unused)

| id | old narration | what does it now |
|---|---|---|
| `narr_f_2` | Vasco sits on the edge of the bed with his back to Alan and his head in his hands. Outside it's still dark. The fan goes round. Down the corridor, the lift sneezes, once, for nobody. | Vasco sits with his back to Alan (he faces away); the room and its fan are the painting |
| `narr_f_3` | Vasco doesn't move. Alan lies on his back and watches the fan going round. | a pause |
| `narr_f_4` | Vasco lifts his head. | cut (he turns round a line later) |
| `narr_f_5` | Vasco turns round on the bed at last and looks at him. His eyes are red. | Vasco turns round on the bed |
| `narr_f_6` | Alan sits up. | cut |
| `narr_f_7` | And he tells him. All of it, in the grey light, in the wrong order, too fast, the way you tell something you've been carrying for too long. | Alan tells it himself: alan_f_told_all, alan_f_told_all_2 |
| `narr_f_8` | The black mist coming in against the wind. The smell of the cistern. The helmet in Doña Pino's net, the fisherman drowned in his bed, the tide on the steps. | Alan says it: alan_f_told_all |
| `narr_f_8b` | The bell in Santa Ana with his family's mark on it. The sealed letter. The fax to Inês. | Alan says it: alan_f_told_all_2 |
| `narr_f_9` | Vasco listens without moving. When it's done, he's quiet for a long time. | a long pause |
| `narr_f_10` | He laughs: a short, terrible laugh with no air in it. | cut (vasco_f_sunburn carries it) |
| `narr_f_11` | Alan opens his mouth, and closes it. | a pause |
| `narr_f_12` | Vasco gets up and goes to the window, and stands with his back to the room, looking out at the dark sea. In his shorts, with his shoulders hunched, he looks much older than thirty-nine, and much younger. | Vasco walks to the window and stands with his back to the room |
| `narr_f_13` | He turns round. | Vasco turns round |
| `narr_f_14` | The room is getting lighter. Below the window a lorry goes by on the promenade with a load of wooden pallets for the bonfires. | cut |
| `narr_f_15` | Vasco sits down on the chair by the window, heavily, as if his legs have stopped holding him up. | a pause |
| `narr_f_smile` | He almost smiles. | cut |
| `narr_f_16` | He looks down at his hands. | cut |
| `narr_f_17` | His voice catches, and he waits until it doesn't. | a pause before vasco_f_lorenzo_5 |
| `narr_f_fan` | The fan goes round. | a pause (the fan turns in the room) |
| `narr_f_18` | He looks up at Alan. His eyes are wet, and very steady. | cut |
| `narr_f_20` | Vasco dresses quickly, in his field clothes: the dusty trousers, the shirt, the boots. Notebook, water bottle, hat. Alan sits on the bed and watches him, and can't think of a single word. | clothes (sound), Vasco walks to the door |
| `narr_f_21` | At the door, Vasco stops. He doesn't turn round. | the still shows it |
| `narr_f_22` | Alan listens to the footsteps going down the corridor. The lift sneezing. The street door, the Land Rover's door, the engine, and the Land Rover pulling away along the promenade in the grey dawn, towards the mountains. | footsteps in the corridor (sound) |
| `narr_f_23` | On the bedside table, Vasco's cup from yesterday morning is still standing where he left it, a ring of dried coffee in the bottom. | Alan says it: alan_f_cup |
| `narr_f_24` | There is no coffee by the bed this morning. | Alan says it: alan_f_cup |
| `narr_f_wall_2` | The longest day of the year. On the solstice the sun seems to stand still in the sky: sol stitium, the sun standing. Somewhere above the grey lid of the panza, it's standing still. | Alan thinks it: alan_f_wall_1 |
| `narr_f_wall_3` | And he feels exactly the same. As if something has stopped. As if the world is holding its breath, waiting to see which way it will turn. | Alan thinks it: alan_f_wall_1 |
| `narr_f_wall_4` | The tide comes up the steps, one higher than yesterday. Nobody is filming it. | the tide on the steps is drawn (S.tideStep) |
| `narr_f_wall_5` | The bonfire on the beach is nearly finished: three times the height of a man, pallets and broken chairs and old doors and dried palm fronds, with a straw figure tied to the top in a hat. | the bonfire is on the beach |
| `narr_f_wall_5b` | Along the beach there are others, getting smaller into the distance, like the teeth of a comb. | cut |
| `narr_f_wall_6` | He sits there for most of the day. He thinks about Lorenzo, whom he has never met, standing in an empty flat in Rome with a new coffee pot, waiting for someone who has already got on a train. | Alan thinks it: alan_f_wall_2 |
| `narr_f_wall_7` | He thinks about the coffee by the bed. About the fact that Vasco was right. That's the worst of it. Every morning for eight months, Alan has looked at the coffee and wondered whether this was the day. | Alan thinks it: alan_f_wall_2 |
| `narr_f_wall_8` | Not because he wanted to go. Because he was so frightened of how much he wanted to stay. And Vasco saw it, every single morning. And made the coffee anyway. | Alan thinks it: alan_f_wall_3 |
| `narr_f_chano_2` | Chano nods slowly. He drinks his beer and looks at the sea. | a pause |
| `narr_f_chano_3` | He finishes his beer and stands up. | Chano walks back to his kiosk |
| `narr_f_chano_4` | He goes back to his kiosk. | Chano walks back to his kiosk |
| `narr_f_arch_1` | She was at the dinner. She saw everything. He waits for the sunglasses to come down. | cut (carmen_f_1 says she saw it) |
| `narr_f_arch_2` | They don't. She gets up, goes to a camping stove under the PROHIBIDO FUMAR sign, makes two small cups of coffee in a battered pot, and puts one in front of him. | coffee cups (sound) |
| `narr_f_arch_3` | She's quiet for a moment. Then she takes an envelope of photographs from a drawer and spreads them on the desk between them. | paper (sound); carmen_f_photo "Cave 6. Mira:" |
| `narr_f_arch_4` | She touches it in the photograph, lightly, with one nicotine-stained finger. | cut |
| `narr_f_arch_5` | Carmen gathers the photographs up again, quickly, and puts them back in the envelope. | paper (sound) |
| `narr_f_arch_6` | She shuts the drawer. | the drawer (sound) |
| `narr_f_arch_7` | She looks at him then. Properly. And Alan sees, for the first time, that she's frightened. | Carmen's own last line: carmen_f_go_home now ends "Por favor. I'm asking you." |
| `narr_f_dusk_1` | Back on the sea wall, late in the afternoon, he thinks about Artenara. The mountain. The long white road going up through the cloud. He could hire a car. He could be there in two hours. | Alan says it: alan_f_dusk_0 |
| `narr_f_dusk_2` | He doesn't hire a car. | cut (he walks the other way) |
| `narr_f_dusk_4` | And then, out on the water, past the reef, the black line. It comes in against the wind, as it did on Tuesday, low and oily and slow. But faster tonight. Thicker. | drawn (the mist, heavier); Alan: alan_f_dusk_3 |
| `narr_f_dusk_5` | It doesn't stop at the waterline. It comes up over the sand, between the unlit bonfires, curling round their bases like smoke round the legs of a table, and up over the first step, and the second. | Alan: alan_f_dusk_4 |
| `narr_f_dusk_6` | People are noticing now. A dog barks and pulls away. Some teenagers on the wall stand up, laugh nervously, and move further along. A waiter comes out of the café, looks at it, crosses himself, and goes back in. | a dog (sound) |
| `narr_f_dusk_7` | 'Panza,' says a woman going past, to her husband, in the voice of someone who has lived through forty Junes. 'It's just the panza, coming down low.' | Alan: alan_f_dusk_4 ("Somebody's saying panza") |
| `narr_f_dusk_8` | It isn't the panza. The panza is above them, grey and high and still, where it always is. This is underneath it. | Alan: alan_f_dusk_4 |
| `narr_f_dusk_9` | The smell comes up the steps. Alan doesn't decide to stand up. He finds he's standing, and then walking, fast, away from the sea. Not running. Not quite. | Alan: alan_f_dusk_5; he walks away inland |
| `narr_f_walk_2` | Into Vegueta, the old town, the cobbled streets round the cathedral, where the houses lean together over his head and the iron lamps make yellow pools on the stones, and every corner has a candle burning in a little shrine. | folded into narr_f_walk_1 |
| `narr_f_walk_3` | He doesn't know where he's going. That's the point. It's the night the sun stands still, and he wants, very badly, for one night, to be someone who has nothing to lose. | folded into narr_f_walk_1 ("to be someone with nothing to lose") |
| `narr_f_walk_4` | At the bottom of a narrow street behind the cathedral there's a bar with its doors open, and music coming out of it, and warm yellow light, and laughter. He goes in. | the bar room itself |
| `narr_bar` | The bar has no name over the door. It's just the bar at the bottom of the street behind the cathedral, the one the locals go to. | the painting |
| `narr_bar_2` | One long narrow room under dark beams. Every inch of wall is faces: portraits in charcoal and ink and watercolour, pinned up and overlapping. Old men with cigarettes. Fishermen. Children. A dog in a hat. | the painting; alan_look_portraits |
| `narr_bar_3` | At the far end, dominoes slapped down as if they'd insulted somebody. A radio singing about a woman who went to Venezuela and never came back. It smells of rum and coffee and the sea. | the room's sound (tavern) |
| `narr_bar_4` | And there's no mist in here at all. | Alan: alan_bar_in now opens "No mist in here." |
| `narr_rafa_1` | The barman is young, lean and brown, with tight black curls he has forgotten about. A cobalt shirt open over a white vest, a pencil behind his ear, a towel on his shoulder. His fingers are smudged black. | Rafa's figure; alan_look_rafa |
| `narr_rafa_2` | He finishes his sentence and comes down the bar, smiling: a wide, easy smile, the kind that doesn't ask anything. | cut |
| `narr_rafa_3` | It's terrible. Sweet and rough, burnt sugar and wood, and it goes down his throat like a lit match. He loves it. | Alan: alan_rafa_rum "That's terrible. Another." |
| `narr_rafa_4` | The barman laughs, pours another, and leans on the counter. | poured again (sound) |
| `narr_rafa_light` | He searches for the word, gives up, and makes a shape in the air with his blackened fingers. | a pause |
| `narr_rafa_draw` | He doesn't look down at the napkin. He looks at Alan, and talks, and laughs, and the pencil moves on the paper by itself, quickly, lightly, like something with its own mind. | the pencil (sound) |
| `narr_napkin` | He turns the napkin round. It's Alan: three quarters, chin on hand, at the counter. A dozen lines, no more. And somehow exactly him. | Alan: alan_rafa_napkin_0 (the napkin is also an item with its own look) |
| `narr_napkin_2` | Not the face he checks in the mirror for grey. The face he has tonight: tired and amused and, somewhere far back behind the eyes, frightened. | Alan: alan_rafa_napkin_0 |
| `narr_rafa_touch` | Someone at the tables calls for Rafa. He goes up the bar, and touches Alan's shoulder as he passes, very lightly, and Alan feels it all the way down his arm, and doesn't hear anything else at all. | Rafa walks up the bar past him; Alan: alan_rafa_touch |
| `narr_leave_1b` | And Alan stands there with his money on the counter, and can't think of a single reason. Nobody needs him up early. Nobody is waiting for him. There's no coffee by the bed. | Alan: alan_leave_1c |
| `narr_leave_2b` | Rafa puts an old black telephone with a coin box on the counter. Alan feeds it most of his change and calls the museum, which is closed, and then the night number, which is a security guard who has obviously been asleep. | Rafa: rafa_phone; coins and the dial (sound) |
| `narr_leave_2c` | The guard goes away for a long time. | a long pause |
| `narr_leave_2d` | Alan stands by the counter with the receiver in his hand. Is it an emergency? | a pause |
| `narr_leave_2e` | Rafa pours him another rum without being asked, and doesn't say anything, and that's somehow worse and better than anything he could have said. | Rafa pours (sound) |
| `narr_yeray_go_1` | At about one the boy at the corner table puts his head down beside the empty bottle, slowly, the way a building comes down, and goes to sleep. | the sprite changes to Yeray asleep |
| `narr_yeray_go_2` | A nice face, Alan thinks, vaguely. An unhappy face. Even asleep. | Alan: alan_yeray_face |
| `narr_yeray_go_4` | Rafa looks at him for a moment. Then he picks up the napkin he was drawing on while Yeray talked, turns it over, draws something on the back, and puts it in his pocket. | the pencil (sound); Rafa says it on Saturday (rafa_s_yeray_1 "He talks when he drinks. I write it down.") |
| `narr_yeray_talk` | He turns back to his glass and goes on talking to it, low and blurred, as if Alan had never asked. | a pause |
| `narr_yeray_talk_2` | He's already looking back down the bar, at Rafa's hands. | cut |
| `narr_q_1` | Rafa puts the last chair up and comes round the end of the bar, wiping his hands on the towel, and stands in front of Alan, very close. He has to tilt his head back a little to look at him. He does, and smiles. | Rafa walks round to stand close to him |
| `narr_q_2` | They stand there in the empty bar, under the hundreds of painted faces. | cut |
| `narr_q_3` | Alan doesn't move. And then Rafa asks it, simply, lightly, the way you'd ask someone the time, not looking away. He's asked it before. He's the kind of man who asks. | a pause |
| `narr_q_4` | The bar is very quiet. | a long pause |
| `narr_q_7` | He thinks: he told me to go home. He thinks: he's not even answering his radio. | Alan: alan_q_1 |
| `narr_q_8` | He thinks: I'm thirty-eight years old, and I have never once stayed anywhere long enough to be left, and I'm not going to start tonight. | Alan: alan_q_1 |
| `narr_q_9` | And then, because some part of him still wants to be caught, still wants Rafa to hear it, he says it again, quieter, with a pause in front of it that anyone could have heard. | a pause before "No." (Rafa reads it on Saturday: rafa_s_truth_2) |
| `narr_q_10` | Rafa looks at him for a long moment, with his head a little on one side, the way he looked at Yeray. | a long pause |
| `narr_q_11` | Then he takes the pencil from behind his ear and puts it in his pocket, and takes Alan's hand in his blackened fingers, and leads him to the stairs. | Rafa leads him down the bar; the stairs (sound) |
| `narr_rafa_night` | The studio is one room under the roof, hot from the day, with a big window open on the dark rooftops of Vegueta and the cathedral's two towers black against the orange sky. Turpentine and coffee and the sea. | the still |
| `narr_rafa_night_2` | Rafa doesn't make the coffee. | the still |
| `narr_rafa_night_3` | It's nothing like the hotel. Nothing familiar, nothing known. For an hour, in the hot dark under the roof, with Santa Ana striking the quarters, Alan is twenty-three again, and there's nothing he can lose. | the still |
| `narr_rafa_night_4` | It's wonderful. That's the worst of it. He'd hoped, somewhere, that it would be terrible. It isn't. It's warm and real and generous and kind. | the still |
| `narr_rafa_night_5` | Afterwards Rafa falls asleep almost at once, sprawled across the mattress like a cat in the sun. Alan lies on his back and looks at the ceiling. | the still |
| `narr_rafa_night_7` | The sound goes on in the dark long after the striking stops, the way a bell does, humming, remembering, and it seems to be asking him something, over and over, in a language he has always understood and always pretended not to. | folded into narr_rafa_night_6; the bell hum (sound) |
| `narr_rafa_night_8` | He doesn't answer it. | folded into narr_rafa_night_6 |
| `narr_s_wake_2` | Then he opens his eyes. | a pause |
| `narr_s_wake_rafa` | Rafa is at the gas ring in the corner, barefoot, in his shorts, humming. His back is brown and young, and there's charcoal on his shoulder blade in the shape of a thumbprint. | Rafa at the gas ring in the room; alan_look_rafa_morning |
| `narr_s_wake_drawing` | And propped against the wall at the foot of the mattress, where Alan would see it the moment he woke, is a sheet of heavy paper with a drawing on it. | the still |
| `narr_s_drawing_1` | It's Alan, asleep. Charcoal, quick and soft, a few dozen lines. One hand under his cheek, his mouth a little open, his face completely unguarded. Younger than it has any right to be. | the still |
| `narr_s_drawing_2` | It's the most beautiful drawing anyone has ever made of him. He looks at it, and he feels sick. | Alan: alan_s_drawing |
| `narr_s_dress` | He finds his clothes on the floor and puts them on. Yesterday's trousers and vest smell of rum and turpentine and someone else's skin. | clothes (sound) |
| `narr_s_go` | He should go now, before Rafa turns round. Leave the money on the counter and go, and be someone else by lunchtime. That's what he has always done. | Alan: alan_s_go |
| `narr_s_didnt` | He doesn't go. | he walks to the window instead |
| `narr_s_window` | He stands at the window with his hands on the sill, looking at the cathedral's two black towers and the grey sky, and makes himself think it, in words, all the way to the end. | he walks to the window |
| `narr_s_sketch_1` | He reads it three times. Then he sits down, slowly, on the edge of the table among the brushes, and puts the napkin down very carefully, as if it might go off. | a pause after the close-up |
| `narr_s_coffee` | He makes it in an old aluminium pot, yawning. They drink it at the table by the window. It's very good coffee. | poured (sound) |
| `narr_s_napkin` | On the table between them the sketchbook lies open, a paper napkin from the bar tucked into it like a bookmark. Alan looks at it without meaning to. | Alan: alan_s_napkin |
| `narr_s_rafa_sees` | Rafa sees his face, and sees the napkin, and sees where Alan's eyes keep going. | cut (rafa_s_yeray_1 answers the look) |
| `narr_s_truth_1` | Rafa doesn't move. | a pause |
| `narr_s_truth_2` | Rafa looks at him for a long moment. Then he looks down at his coffee. | a long pause |
| `narr_s_truth_3` | He smiles, a little, but it's a different smile from last night's. Older. | cut |
| `narr_s_truth_4` | They sit there in the grey light. | a pause |
| `narr_s_truth_5` | Then Rafa gets up and fetches the drawing from the foot of the mattress. He blows on it, gently, to lift off the loose dust, and holds it out. | Rafa walks to the easel and back |
| `narr_s_walk_2` | The city is getting ready for its fiesta. Flags going up across the streets, strings of coloured bulbs, men unloading crates of beer on every corner. | folded into narr_s_walk_1 |
| `narr_s_walk_3` | In Triana a brass band practises in a doorway, badly. Posters everywhere: Fiestas Fundacionales. San Juan 1996. Five hundred and eighteen years. | folded into narr_s_walk_1 |
| `narr_s_walk_4` | Five hundred and eighteen years since the city was founded, on the twenty-fourth of June: the day the sun turns back. | folded into narr_s_walk_1 |
| `narr_s_walk_5` | The beach is already full of families claiming their places for Sunday night. The tide is up the steps again. Nobody seems to notice. | cut (the tide and the beach are seen at the phone box) |
| `narr_s_nieves_1` | Nieves is behind the desk. She looks at him as he comes in: at the clothes, and the hour, and the roll of paper under his arm, and his face. | a pause |
| `narr_s_nieves_2` | Her eyebrow doesn't move at all. That's how he knows how bad he looks. | Alan: alan_s_nieves_0 |
| `narr_s_pigeon` | Nieves looks at the pigeonhole for 404. It's empty. She looks at it slightly longer than she needs to, as if something might appear in it, for his sake. | a long pause |
| `narr_s_room_1` | The room is exactly as he left it, and exactly as Vasco left it the morning before. The bed unmade on one side. Vasco's good jacket on the chair. Vasco's watch on the bedside table, forgotten. | Alan: alan_s_room_1 |
| `narr_s_room_2` | And on the tiles by Vasco's side of the bed, a footprint. | Alan: alan_s_room_2 |
| `narr_s_room_3` | Wet. A man's bare foot, long and narrow, dark on the terracotta. Just one, pointing at the bed. | Alan: alan_s_room_2 |
| `narr_s_room_3b` | As if someone had stepped out of the sea and stood there in the night, looking down at where Alan should have been sleeping. | Alan: alan_s_room_2 ("pointing at where I should have been asleep") |
| `narr_s_room_4` | He thinks, for no reason he can name, of his father. Pedro Sanches, who went out fishing off Cascais one morning when Alan was a boy, and never came back. | Alan: alan_s_father |
| `narr_s_room_5` | Alan can't remember his face any more. Only a shape against a bright window. | Alan: alan_s_father |
| `narr_s_room_6` | He kneels and touches the footprint. It's cold, and his fingertips come away tasting of salt. | he walks to it and kneels; water (sound); Alan: alan_s_salt |
| `narr_s_room_7` | By the time Nieves knocks with the coffee, it has dried, and there is nothing there at all. | the knock (sound); Alan: alan_s_dried |
| `narr_call_sat_1` | He stands with his forehead against the glass. Outside, Chano is serving a queue of people buying fireworks. | cut |
| `narr_call_sat_2` | A long silence on the line from Lisbon. | a long silence |
| `narr_call_sat_3` | When she speaks again her voice is different. Not soft. She doesn't do soft. But steady. | a pause |
| `narr_call_sat_5` | Alan's hand is tight on the receiver. | a pause |
| `narr_call_sat_7` | The pips. The money's running out. | the pips (sound) |
| `narr_call_sat_8` | The line goes dead. | the dial tone (sound) |
| `narr_s_chano_1` | Chano has a newspaper for him, and a face. | cut (the newspaper is given) |
| `narr_s_chano_2` | He turns the paper round on the counter. A short column on page six, under the tide tables: 'Seis muertes por ahogamiento lejos del agua desde diciembre. La policía no ve relación.' | Chano reads it: chano_s_paper |
| `narr_s_chano_cross` | He crosses himself. | cut |
| `narr_s_chano_stare` | Chano stares at him. | a pause |
| `narr_s_chano_3` | Alan doesn't answer. He's looking at the beach: at the tide on the steps, and the families laying out their towels round the bonfires for tomorrow night. | a pause |
| `narr_s_tried_2` | The museum is closed for the weekend. When he hammers on the door, the guard comes and looks at him through the glass, and shakes his head. | Alan: alan_s_tried_list |
| `narr_s_tried_4` | Every car on the island is booked for San Juan. The woman at the car-hire desk in Triana laughs at him, not unkindly. | Alan: alan_s_tried_list |
| `narr_s_tried_5` | The bus to Artenara goes once a day, at seven in the morning. It has gone. | Alan: alan_s_tried_list |
| `narr_s_tried_6` | He'll take the bus in the morning. Seven o'clock. At the dig by ten. He'll find Vasco and tell him everything, and they'll deal with Baute together. | Alan: alan_s_bus |
| `narr_s_tried_7` | It's the most reasonable decision he has made all week, and he hates it. | Alan: alan_s_bus ("Very reasonable. I hate it.") |
| `narr_flood_2` | It comes up through the drains and the cracks between the cobbles, quietly, steadily, black and cold. Ankle deep, then shin deep, in the low streets where Pepe Santana lived. | the still |
| `narr_flood_3` | Old women stand in their doorways sweeping it back with brooms, and it comes in round the brooms. Men carry televisions up the stairs. A child is crying. | the still (the brooms, the television carried up) |
| `narr_flood_4` | A dog swims past, paddling furiously, with an expression of enormous offence. | the still (the dog) |
| `narr_flood_5` | And under the grey panza, low on the water, the black mist lies over the harbour like smoke over a battlefield. | the still (the black mist on the harbour) |
| `narr_flood_door` | Doña Pino's door is open, the water over the step. Inside, by a candle, Don Lolo sits on a kitchen chair with his trousers rolled to the knee and his feet in the black water, mending a net in his lap. | cut (Doña Pino and Don Lolo tell it) |
| `narr_flood_bed` | Behind him, on a narrow bed, Doña Pino. Soaked. Coughing up water, salt water, onto the pillow. But alive, propped on her elbows, and glaring. | Doña Pino tells it: pino_s_1, pino_s_1b |
| `narr_flood_lolo` | Don Lolo looks up at Alan. He takes the cigarette out of the corner of his mouth, looks at it, and puts it back. | a pause |
| `narr_flood_later_2` | Doña Pino, in dry clothes, refuses the hospital in terms that turn a young doctor red to the ears. | Doña Pino: pino_s_hospital |
| `narr_flood_missal` | Alan sits by her. She has her missal on her knee, open at the inside cover. Two names crossed out. Two not. | Doña Pino: pino_s_missal |
| `narr_flood_still` | She goes very still. | a pause |
| `narr_flood_told` | He tells her. Not all of it. The cistern. The black water at his chest. The thing in the dark that looked at him, and knew his blood, and backed away. The bells. His family. | Alan: alan_s_tell_pino |
| `narr_flood_pen` | When he has finished she is quiet a long time. Then she unscrews an old fountain pen and holds it out to him, with the missal, open at the names. | Doña Pino: pino_s_pen |
| `narr_flood_name` | At the bottom of the list, under her name, Alan writes his own. His hand is perfectly steady. | the pen (sound); the list close-up shows his name under hers |
| `narr_s_night_2` | He puts the rolled-up drawing on the pillow beside him. The phone on the bedside table does not ring. | Alan: alan_s_night_2 ("the phone doesn't ring") |
| `narr_s_night_3` | The sea comes in through the balcony doors, and under it, closer every night, the other sound. | the sea through the balcony doors (sound) |
| `narr_s_night_4` | On the desk by the door, his plane ticket. Lisbon, via Madrid. Sunday, eleven fifteen. | Alan: alan_s_night_1 |
| `narr_s_night_5` | Tomorrow there will be two things to choose between: a bus at seven that goes up the mountain, and a plane at eleven fifteen that goes home. One of them might save his life. | Alan: alan_s_night_1, alan_s_night_2 |
| `narr_s_night_6` | He doesn't know which. He lies awake and stares at the phone, and it doesn't ring. | Alan: alan_s_night_2 |
| `narr_s_receipt` | Folded small and soft as cloth from years in a lining: a receipt from the parish of San Nicolás. 'Misa por los difuntos de Tasarte, 1966. Pagado. I. M.' Dated last month. Folded inside it, older ones, one for every year. | Alan reads it: alan_s_receipt_0 |
| `narr_s_wait_bell` | He waits with the radio in his lap. At one o'clock the clock he wound on Wednesday strikes, and the north bell, his family's bell, gives one deep note over Vegueta. | the clock and the bell (sound); Alan: alan_s_wait_bell |
| `narr_s_radio_1` | Static. Then a click, and a voice he knows from a party, warm and unhurried. | a click (sound); Baute names himself (baute_r_1) |
| `narr_r_silence` | A long silence, with the mountain's wind in it. | a long silence |
| `narr_r_click` | A click. Canal 9 is static again, and it stays static. | a click (sound) |
| `narr_s_warn_1` | He runs. The flags are up in the streets for the city's birthday, and the black mist is lying on the harbour like smoke. | cut (he arrives; alan_s_warn) |

## Not touched

- Vasco's Saturday chapter (`vasco.js`): another pass.
- The docs close-ups (the sketchbook, the fax, Doña Pino's list, the receipt, the drawing's look) have no narration and are as they were.
- `narr_surf_after` (tue.js, the surf school from Saturday on) is a look line in another day's file.
