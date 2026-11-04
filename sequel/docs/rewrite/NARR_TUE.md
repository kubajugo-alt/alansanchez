# The prologue and Tuesday: the narrator cut back (2026-10-31)

The user: "over all, with your re-works there is way too much narrator. We don't need that much description. Some things should simply be done by the characters, other just said by the characters - we don't need to have it all described" and "It is not only the finale with the narrator - it is basically the entire game".

Done as Cave 6 was (`docs/puzzles/CAVE6_LINES.md`, HANDOFF 109): every narrator line played in the prologue (`js/story/prologue.js`) and on Tuesday (`js/story/tue.js`, Tuesday's two calls in `js/story/core.js`, the opening line in `js/story/main.js`) gone through one by one. What the room or the still shows, what the characters can do (walk, turn, a sound, a pause), is no longer narrated; what the player needs is said by Elena, the Guardia, Alan, Vasco, Nieves, Baute or Carmen; the narrator keeps the chapter openers, the time jumps and the end of the night. Tuesday's reception and the corridor moment (HANDOFF 86, 107) keep every beat: only their narration changed.

| | before | after |
|---|---|---|
| narrator lines played (prologue / Tuesday) | 78 (18 / 60) | 9 (3 / 6) |
| narrator words | 2203 (444 / 1759) | 190 (72 / 118) |
| character lines played (in the scenes below) | 179 | 197 (the same ones, and 18 new) |
| character words | 2186 | 2456 |

69 lines of these scenes are no longer played (all narrator lines); 12 lines were shortened or rewritten to take over what the cut narration said (7 narrator, 5 character); 18 new lines. No character line was cut. The longest narrator line left is 26 words. Nothing here is recorded: the changed lines' old recordings are in `audio/voice_stale/` (they play as captions) and their ids are in `scripts/voice_redo.txt`; the new lines play as captions. Ids are never renamed. (The Discreet setting's `narr_love_1_discreet` and Saturday's `narr_surf_after` are unchanged and not counted.)

The prologue is not played at the moment (`S.PLAY_PROLOGUE` is off, the user, 2026-10-29); it was cut back all the same, and checked by playing it with the flag on.

Below, each scene in play order, as it now plays. *Italics* are what the game shows or the characters do (no line). Status: **new**, **changed** (this pass), unchanged (recorded) or unchanged (no recording yet).

## The prologue (21 December 1995)

### The bar in Artenara (still: still_elena_bar)

The painting shows the bar, Paco and the chairs, Elena at the telephone on the wall.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *a chair scraped onto a table (sound)* | |
| 1 | `narr_pro_bar_1` | narr | Artenara, the last bar on the mountain, closing. At the telephone on the wall, feeding it coins: Dr. Elena Suárez, awake since five. | **changed** |
| | | | *coins into the telephone (sound)* | |
| 2 | `carmen_machine` | carmen | Trujillo. Speak, or don't. | unchanged (recorded) |
| 3 | `elena_msg_01` | elena | Carmen. It's me. I know it's late. [pause] Somebody's taken one of the discs out of the floor. The wear marks are fresh. It isn't conservation. | unchanged |
| 4 | `elena_msg_02` | elena | And it isn't a calendar either. I've been reading it wrong for a year. [pause] It's a door, Carmen. And someone's opening it. | unchanged (recorded) |
| 5 | `elena_msg_03` | elena | I'm driving down now. Don't smoke all of them before I get there. [pause] Te quiero. | unchanged (recorded) |
| | | | *she hangs up (sound); Paco goes on with the chairs (sound)* | |
| 6 | `barman_stay` | barman | There's cloud on the road, doctora. Thick tonight. Stay. My wife will make up the room. | unchanged (recorded) |
| 7 | `elena_stay` | elena | There's always cloud on the road. | unchanged (recorded) |
| | | | *the bar door (sound): she goes out into the cold* | |

### Elena's Renault 4: the road (played)

The car is painted; the stars, the moon on the cloud tops and the headlights are drawn.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *fade in on the car* | |
| 1 | `elena_pro_road` | elena | Hairpins all the way down, and the cloud waiting at the bottom. [pause] Silver tonight. Like a frozen sea. | **new** |
| | | | *the player looks round the car: the radio, the notebook, the mirror, the crank (her own lines, unchanged)* | |

### Into the cloud

Drawn: the windscreen goes grey, then charcoal, then black.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the cloud closes over the car (sound, and drawn darkening)* | |
| | | | *a pause* | |
| 1 | `elena_pro_cloud` | elena | Into the cloud. [pause] Grey. Darker. [pause] Like driving into ink. | **new** |
| | | | *the player looks again: the air, the crank that won't turn (her own lines, unchanged)* | |

### The water

Drawn: the water rising in the car, the triangle her finger draws on the fogged glass.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *water seeping in (sound)* | |
| 1 | `elena_salt` | elena | Water on the inside of the glass. On the inside. | unchanged (recorded) |
| | | | *the water rises to her knees (sound, drawn)* | |
| 2 | `elena_pro_feet` | elena | And at my feet. Cold, and coming up. [pause] From below. | **new** |
| 3 | `elena_pro_brake` | elena | The brake. [pause] Nada. It won't slow. It's driving itself, as if it knows the way. | **new** |
| 4 | `elena_doors` | elena | The doors. [pause] No. It's a door, Carmen. I told you it was a door. | unchanged (recorded) |
| | | | *a pause: she stops trying* | |
| | | | *she draws the triangle on the glass, point down (drawn)* | |
| 5 | `elena_pro_triangle` | elena | Point down. [pause] At the sea. | **new** |
| | | | *the water rises over the windows (sound, drawn); black* | |

### The barranco (still: still_barranco)

The painting shows the car upright in the dry barranco in the morning, and the two Guardia Civil.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *dawn birds (sound)* | |
| 1 | `gc_locked` | gc2 | Doors locked from the inside, windows up. [pause] And mira, on the windscreen. A triangle, dried white. It's salt. | **new** |
| 2 | `gc_01` | gc1 | Flash flood. Has to be. | unchanged (recorded) |
| 3 | `gc_02` | gc2 | There's no water in this barranco, hombre. | unchanged (recorded) |
| | | | *a long pause (the older one looks at the car)* | |
| 4 | `gc_03` | gc1 | Then it went somewhere. | unchanged (recorded) |
| 5 | `narr_open_01` | narr | Her lungs were full of water, and the water was salt. It hadn't rained on that side of the mountain for forty days. | **changed** |
| 6 | `narr_open_03` | narr | After that, once a month, at the dark of the moon, someone drowned in a dry place on the island. Nobody put them side by side. | **changed** |
| | | | *the title painting* | |

## Tuesday 18 June

### Gando: the opening (main.js)

The airport is painted; Alan by the belt.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_tue_1` | narr | Alan Sanches had been on Gran Canaria for fifty-five minutes, and in that time he had lost his luggage, his dignity, and his sense of direction. | unchanged (recorded) |
| 2 | `alan_t_land` | alan | My suitcase has gone to Madrid. To retire, by the sound of it. [pause] Tomorrow, said the woman at the Iberia desk. Or Thursday. It's June, she said, as though that explained it. | **changed** |

### Gando: Vasco

Vasco is standing across the hall.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *Vasco walks across to Alan* | |
| 1 | `vasco_t_hello` | vasco | You're here. | unchanged (recorded) |
| | | | *a pause (the kiss)* | |
| 2 | `alan_t_hello` | alan | I'm here. [pause] In front of two nuns and a family from Düsseldorf, apparently. My trousers are not entirely here. My suitcase is in Madrid. | **changed** |
| 3 | `vasco_t_luggage` | vasco | Madrid. | unchanged (recorded) |
| 4 | `vasco_t_missed` | vasco | Madrid can keep it. [pause] Come here. Eight days. I counted them. I'm an archaeologist, I count things. | unchanged (recorded) |
| 5 | `alan_t_missed` | alan | You smell of dust and sun cream and coffee. | unchanged (recorded) |
| 6 | `vasco_t_missed_2` | vasco | [laughs softly] I live in a cave now. [pause] I've missed you. It's stupid, how much. | unchanged (recorded) |
| | | | *a pause (they hold on)* | |
| 7 | `alan_t_missed_2` | alan | Not stupid. [pause] Well. A bit stupid. Do it again. | unchanged (recorded) |
| 8 | `alan_t_luggage` | alan | I've been standing here for twenty minutes. | unchanged (recorded) |
| 9 | `vasco_t_sorry` | vasco | I know. I'm sorry. We found something in the chamber under Cave 6 this morning. Marks in the floor, very small, by the sockets. I think they're for the equinox, and I couldn't leave until we'd drawn them. | unchanged |
| 10 | `vasco_t_cave` | vasco | You'll see it. Not tomorrow. Thursday, perhaps. Rayco wants everything recorded before anyone else goes in. | unchanged (recorded) |
| 11 | `vasco_t_light` | vasco | Alan, the light. Wait until you see what the light does in there. At noon it comes straight down through the roof like a column, and every triangle on the wall lights at once, like someone reading a sentence out loud. | unchanged |
| 12 | `alan_t_cave` | alan | Rayco. | unchanged (recorded) |
| 13 | `vasco_t_rayco` | vasco | Dr. Baute. The director. You'll meet him tonight. | unchanged (recorded) |
| 14 | `alan_t_rayco` | alan | You call him Rayco. | unchanged (recorded) |
| 15 | `vasco_t_rayco_2` | vasco | [pause] He asked me to. | unchanged (recorded) |
| 16 | `alan_t_proud` | alan | Of course he did. | unchanged (recorded) |
| 17 | `vasco_t_go` | vasco | Come on. I've moved out of the university flat for the week. We're at a hotel on the beach. It isn't a good hotel. You'll love it. | unchanged (recorded) |

### The drive north (over black)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *fade to black* | |
| 1 | `narr_t_drive_1` | narr | Halfway to Las Palmas they drove under the edge of the cloud, and the light changed as if someone had closed a lid. | **changed** |
| 2 | `alan_t_rain` | alan | Is it going to rain? | unchanged (recorded) |
| 3 | `vasco_t_panza_1` | vasco | It never rains. It's the panza de burro. The donkey's belly. | unchanged (recorded) |
| 4 | `vasco_t_panza_2` | vasco | Every June the trade winds pile the cloud up against the north of the island, and it just sits there. Down in the city it's grey and warm and close, like living in a steam room. And up in the mountains, above it, it's blazing sun. | unchanged (recorded) |
| 5 | `vasco_t_panza_3` | vasco | Every morning I drive up through it. Ten minutes of fog, and then you come out on top, and the whole cloud is underneath you like a white sea. All the way to the horizon. [pause] You'll see it. | unchanged (recorded) |
| 6 | `alan_t_thursday` | alan | Thursday, perhaps. | unchanged (recorded) |
| 7 | `vasco_t_knee` | vasco | Thursday. I promise, amor. [pause] Give me that knee. It's coming out of your trousers. | **new** |

### Hotel Cristina: the lobby, check-in at two

The lobby is painted (rattan, palms, the San Juan poster, the lift); Nieves at the desk.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_t_hotel` | vasco | The owner pays for the dig, so the dig sleeps here. Cheap. [pause] The lift sneezes. You'll get used to it. | **new** |
| 2 | `nieves_t_hello` | nieves | Señor Sanches. Welcome. [pause] Your luggage has not arrived. | unchanged (recorded) |
| 3 | `alan_t_nieves_1` | alan | No. | unchanged (recorded) |
| 4 | `nieves_t_1` | nieves | And you have. | unchanged (recorded) |
| | | | *a pause (the eyebrow)* | |
| 5 | `alan_t_eyebrow` | alan | Two millimetres of eyebrow. [pause] I've been reviewed. | **new** |
| 6 | `nieves_t_checkin` | nieves | Your room will be ready at fourteen hundred, señor. Check-in is at two. | unchanged (recorded) |
| 7 | `alan_t_checkin` | alan | It's twelve o'clock. | unchanged (recorded) |
| 8 | `nieves_t_checkin_2` | nieves | Then you have two hours to enjoy Las Palmas. [pause] The beach is outside. It is very difficult to miss. | unchanged (recorded) |
| 9 | `vasco_t_lobby_1` | vasco | There's a reception tonight. At the museum. Jacket required. | unchanged (recorded) |
| 10 | `vasco_t_lobby_go` | vasco | I have to take the drawings back to Rayco. Go to the beach, it's right there. [pause] Eight o'clock, El Museo Canario. A jacket. Please don't be late. It matters, this one. | unchanged (recorded) |

### Las Canteras, first time

The promenade, the reef, the kiosk and the phone box are painted.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *no narration* | |

### The beach, first time

The sand and the panza de burro are painted; Vasco explained the panza on the drive.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_t_swell` | alan | Well. The swell's up. [pause] I mean the sea's. Mostly the sea's. | unchanged (recorded) |

### The surfer, and the sun

The painting switches to the sunny beach.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `surfer_bark_1` | surfer | No wind and the swell's up, man. Doesn't make sense. | unchanged (recorded) |
| | | | *the cloud tears open (sound; the sunny painting)* | |
| | | | *a pause* | |
| 2 | `alan_t_sun_1` | alan | Two hours to kill, a beach, and the sun, apparently, by appointment. [pause] Vasco would say sun cream. Vasco isn't here. | unchanged (recorded) |

### The towels: five minutes

Alan walks to the towels and undresses (the undressing frames), then the nap still.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *he walks to the towels and undresses (animation), facing us in his underwear* | |
| 1 | `alan_t_sun_2` | alan | Five minutes. Just five. | unchanged (recorded) |
| | | | *still: still_nap; the sea (sound)* | |
| 2 | `narr_t_sun_3` | narr | It was not five minutes. | unchanged (recorded) |
| | | | *the cloud is back; he is dressed again* | |
| 3 | `alan_t_burnt` | alan | Oh, no. [pause] Oh, no, no. I'm the colour of a postbox. A Portuguese postbox. | unchanged (recorded) |
| | | | *back into his clothes, very carefully (sound)* | |

### The restaurant: Gail and Derek

The restaurant is painted; Gail and Derek at their table. (Unchanged, for context.)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *no narration on entering* | |
| 1 | `gail_t_1` | gail | Oh, you're Portuguese! We did Portugal. Didn't we, Derek? Lovely tiles. | unchanged (recorded) |
| 2 | `derek_t_1` | derek | Too many hills. | unchanged (recorded) |
| | | | *after the burn* | |
| 3 | `gail_t_burn_1` | gail | Oh, love. Look at you. Derek, look at him. | unchanged (recorded) |
| 4 | `derek_t_burn` | derek | Lobster. | unchanged (recorded) |
| 5 | `gail_t_burn_2` | gail | You want aloe vera. Not the green jelly from the chemist, the real thing, the plant. There's a market by the park, the Mercado del Puerto. The lady with all the plants. She did my shoulders on Saturday. | unchanged (recorded) |
| 6 | `alan_t_burn` | alan | Thank you. Both of you. [pause] Is it very bad? | unchanged (recorded) |
| 7 | `derek_t_burn_2` | derek | Lobster. | unchanged (recorded) |

### Mercado del Puerto: Doña Candelaria

The market is painted. (Unchanged, for context.)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *no narration on entering* | |
| 1 | `candelaria_1` | candelaria | ¡Ay, mi niño! Look at you. Who cooked you? | unchanged (recorded) |
| 2 | `alan_t_cand_1` | alan | The sun. I fell asleep on the beach. A lady from Manchester said you have aloe. | unchanged (recorded) |
| 3 | `candelaria_2` | candelaria | Sábila. Aloe vera. The best on the island, from my own patio in Telde. Five hundred pesetas, and I cut it fresh for you. | unchanged (recorded) |
| 4 | `alan_t_cand_note` | alan | I only have this. | unchanged (recorded) |
| 5 | `candelaria_note` | candelaria | ¡Chacho! Five thousand? I sell plants, mi niño, I'm not the Banco de España. Go and break it and come back. I'm not going anywhere. I've been here thirty years. | unchanged (recorded) |

### Chano: change for Lisbon (unchanged, for context)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_t_chano_1` | alan | I need change. For the telephone. To call Lisbon. | unchanged (recorded) |
| 2 | `chano_t_lisbon` | chano | Lisbon. [pause] That's a lot of coins. | unchanged (recorded) |
| 3 | `alan_t_chano_2` | alan | I know. | unchanged (recorded) |
| 4 | `chano_t_doctor` | chano | You're with el doctor. The Portuguese doctor, at the dig. The one who smiles. | unchanged (recorded) |
| 5 | `alan_t_chano_3` | alan | How do you know that? | unchanged (recorded) |
| 6 | `chano_hello` | chano | I'm Chano. [pause] You buy a newspaper, I give you a good rate. You don't buy a newspaper, I give you the tourist rate. | unchanged (recorded) |
| 7 | `alan_buy_paper` | alan | I'll buy a newspaper. | unchanged (recorded) |
| | | | *coins (sound)* | |
| 8 | `chano_change` | chano | Good. Six coins for the box. [pause] Now I tell you a secret, for free. | unchanged (recorded) |
| 9 | `chano_t_secret` | chano | Don't swim after dark this week. | unchanged (recorded) |
| 10 | `alan_t_chano_why` | alan | Why not? | unchanged (recorded) |
| 11 | `chano_t_knees` | chano | The sea's in a bad mood. My knees can tell. | unchanged (recorded) |
| 12 | `alan_t_chacho` | alan | The lady at the market said 'chacho' at me. Was that bad? | unchanged (recorded) |
| 13 | `chano_t_chacho` | chano | Chacho? [laughs] Chacho is everything, man. Chacho, look at that. Chacho, what are you doing. Chacho, five thousand pesetas! [pause] You'll be saying it by Friday. | unchanged (recorded) |

### Room 404: the jeans and the blazer

Alan in the blazer and Vasco's jeans (his frames follow the flag).

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_look_fieldbag_jeans` | alan | Vasco's bag. His good jeans are in here. He's an inch taller, and he'll never let me forget it. [pause] Beggars can't be choosers. | unchanged (recorded) |
| | | | *fade; the jacket on (sound); fade in, dressed* | |
| 2 | `alan_t_jeans_tight` | alan | These are tight. These are cruelly tight. [pause] Every step, they bite me in the balls. I'm going to the museum like a cowboy with a secret. | unchanged (recorded) |
| 3 | `alan_blazer_on` | alan | I'll stand up straight. I'll be a whole new man. [pause] A whole new man with short arms. | unchanged (recorded) |

### The phone box: the first call to Inês (core.js)

Alan at the phone (pose).

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *coins, dialling (sound)* | |
| 1 | `ines_t_eca_1` | ines | Pessoa has been sick on the Eça de Queirós. | unchanged (recorded) |
| 2 | `alan_t_call_1` | alan | Hello, Inês. | unchanged (recorded) |
| 3 | `ines_t_eca_2` | ines | On the first edition. The one in the window. | unchanged (recorded) |
| 4 | `alan_t_call_2` | alan | Is he all right? | unchanged (recorded) |
| 5 | `ines_t_eca_3` | ines | He's fine. He's asleep on the Saramago. The Eça is not fine. [pause] How is it? How's the sun? How's the boyfriend? How is the man who leaves the shop to me for a week, three weeks before I submit my thesis? | unchanged (recorded) |
| 6 | `alan_t_call_3` | alan | You could close the shop. | unchanged (recorded) |
| 7 | `ines_t_eca_4` | ines | I could, but then I would have to write my thesis. [pause] Well? | unchanged (recorded) |
| 8 | `alan_t_call_4` | alan | When did surfers get so young? | unchanged (recorded) |
| 9 | `ines_t_what` | ines | What? | unchanged (recorded) |
| 10 | `alan_t_call_5` | alan | Oh. [pause] When I didn't. | unchanged (recorded) |
| 11 | `ines_t_alan` | ines | Alan. | unchanged (recorded) |
| 12 | `alan_t_call_6` | alan | It's fine. It's lovely. He's lovely. He's happy, Inês. He's been here a month and he's already a different person. He talks about the cave like it's a person. He calls his boss by his first name. | unchanged (recorded) |
| 13 | `ines_t_jealous` | ines | [pause] And you're jealous. | unchanged (recorded) |
| 14 | `alan_t_call_7` | alan | Of a cave. | unchanged (recorded) |
| 15 | `ines_t_party` | ines | Of a cave. [pause] Alan. Go to the party. Be charming. Don't break anything. | unchanged (recorded) |
| 16 | `alan_t_call_8` | alan | I'm wearing a stranger's jacket. | unchanged (recorded) |
| 17 | `ines_t_dontknow` | ines | I don't want to know. | unchanged (recorded) |
| | | | *the beep (sound)* | |
| 18 | `alan_t_call_money` | alan | Inês? [pause] And that's the money gone. | **new** |
| | | | *he hangs up (sound)* | |

### El Museo Canario: arriving

The hall is painted: the cases of skulls, the lanterns, the guests (extras who talk about his sunburn); Vasco across the room.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_p_arrive` | vasco | Alan! [pause] One minute! | **new** |
| 2 | `alan_p_arrive` | alan | One minute. [pause] I know exactly how long Vasco's minutes are. | unchanged (recorded) |

### The reception: Vasco has no time (talk to Vasco, 1)

HANDOFF 86's beats kept.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_p_1` | vasco | Alan! You came. [pause] Meu Deus, you're red. Did you fall asleep on the beach? | unchanged (recorded) |
| 2 | `alan_p_1` | alan | Briefly. For about two hours. | unchanged (recorded) |
| 3 | `vasco_p_2` | vasco | Aloe. Tonight. [pause] Listen, I can't, not now. These are the people from the Cabildo. They decide the money. Give me ten minutes. Get a drink. Talk to someone. | unchanged (recorded) |
| | | | *Vasco turns his back on Alan, to the Cabildo* | |
| | | | *a pause* | |
| 4 | `alan_p_2` | alan | Talk to someone. Right. [pause] Handed in at the door like a coat. I'll talk to the skulls. They look like good listeners. | **changed** |
| | | | *(Vasco turns back)* | |

### The reception: Montesdeoca (unchanged, for context)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `montesdeoca_t_1` | montesdeoca | Ignacio Montesdeoca. I pay for all this. [pause] Nice jacket. I had one exactly like it. I left it somewhere. | unchanged (recorded) |
| 2 | `alan_t_monte_1` | alan | They're very popular this year. | unchanged (recorded) |
| 3 | `montesdeoca_t_alan` | montesdeoca | And you fill it better than I ever did. [pause] Ha! Don't tell my wife I said that. | unchanged (recorded) |
| 4 | `alan_t_flirt_monte` | alan | Your secret's safe with me, señor. [pause] The jacket's, too. | unchanged (recorded) |
| 5 | `montesdeoca_p_burn` | montesdeoca | And look at the colour of you! Another inglés who thinks the panza de burro can't burn him. My hotels live off people like you. The aloe, the after-sun, a second week to recover. Ha! | unchanged (recorded) |
| 6 | `alan_p_monte_1` | alan | Glad to be good for business. | unchanged (recorded) |
| 7 | `montesdeoca_p_vasco` | montesdeoca | You're with the Portuguese? The light man? [pause] Clever boy. Rayco found him, I pay for him. That makes him a little bit mine, no? Ha! Don't look at me like that, it's a joke. | unchanged (recorded) |
| 8 | `alan_p_monte_2` | alan | He's nobody's. [pause] Some days he's barely even mine. | unchanged (recorded) |
| 9 | `montesdeoca_t_2` | montesdeoca | Ha! Enjoy it. Enjoy everything. Life is short and the island is beautiful, and I own two of the beaches. | unchanged (recorded) |

### The reception: Vasco brings him to Baute (talk to Vasco, 2)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_p_3` | vasco | Montesdeoca found you. I'm sorry. He finds everyone. [pause] Come. Rayco wants to meet you. Properly. | unchanged (recorded) |
| | | | *Vasco and Alan walk across the room together to Baute* | |
| 2 | `vasco_p_4` | vasco | Rayco. This is Alan. [pause] My Alan. | unchanged (recorded) |
| 3 | `baute_t_skulls` | baute | They're not frightening. People think they're frightening. They're not. [pause] They're just waiting for us to pay attention. | unchanged (recorded) |
| 4 | `baute_t_1` | baute | You're Alan. Vasco has told me nada about you, which is how I know he's in love. [pause] Rayco Baute. | unchanged (recorded) |
| 5 | `alan_t_baute_1` | alan | He's told me a great deal about you. | unchanged (recorded) |
| 6 | `baute_t_2` | baute | Then I'm in trouble. I've stolen him from you, I'm afraid. For the week. I'll give him back on Monday. | unchanged (recorded) |
| 7 | `baute_t_2b` | baute | He's the best reader of sacred light I've ever worked with, and I've worked with the best. He sees things the rest of us walk past. | unchanged (recorded) |
| 8 | `alan_t_baute_2` | alan | He does. | unchanged (recorded) |
| 9 | `baute_t_gran_1` | baute | When I was a boy, my abuela used to take me up to the burial caves above her village. She'd tell me their names. Not the real ones. Nobody remembers the real ones. | unchanged (recorded) |
| 10 | `baute_t_gran_2` | baute | She gave them names, so they'd have names. 'This is Tamara. This is Guayasén. Say buenos días.' [pause] This little seal was hers. | **changed** |
| 11 | `baute_t_3` | baute | There's a hotel there now. With a swimming pool. [pause] You'd like it. Everybody likes it. | unchanged (recorded) |
| | | | *a pause* | |
| 12 | `alan_t_baute_after` | alan | I think I've just been told something important. [pause] In a language I don't speak. | **new** |

### Baute, asked again (dialogue)

The questions (cave, Vasco, discs) unchanged; only the Montesdeoca one changed.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *Alan asks about Montesdeoca (alan_ask_baute_monte)* | |
| 1 | `baute_p_monte` | baute | Ignacio is very generous. [pause] He pays for the cave. He pays for the vino. He pays for this whole evening, and he'll tell you so. Twice. | unchanged (recorded) |
| 2 | `alan_p_baute_smile` | alan | A very good smile. [pause] It stops just below the eyes. | **new** |

### The corridor of skulls: Vasco's moment (talk to Vasco, 3)

HANDOFF 86 and 107's beats kept: the corridor (painted), his office door at the end.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_p_5` | vasco | Hey. Come here a second. [pause] Somewhere quieter. | unchanged (recorded) |
| | | | *into the corridor; the two of them walk down it between the cases, towards his door* | |
| | | | *a pause* | |
| 2 | `vasco_p_6` | vasco | Thank you. For coming. For the beach and the jacket and all of it. I know this isn't your world. | unchanged (recorded) |
| 3 | `alan_p_3` | alan | It's a nice world. It has skulls. | unchanged (recorded) |
| 4 | `vasco_p_7` | vasco | Alan. [pause] Since Dr. Suárez died, it's me. My reading. My name on the paper. Rayco trusts me with the cave. Nobody has ever trusted me with anything like this. | unchanged (recorded) |
| 5 | `vasco_p_8` | vasco | And I wanted you to see it. Not hear about it on the phone, at midnight. See it. | unchanged (recorded) |
| 6 | `alan_p_4` | alan | I see it. [pause] You're brilliant. Everyone in that room wants a piece of you. [pause] And I get ten minutes. | **changed** |
| 7 | `vasco_p_9` | vasco | They can have a piece. [pause] You get the rest. | unchanged (recorded) |
| | | | *a pause; back to the hall* | |
| 8 | `alan_p_5` | alan | The rest. [pause] I'll take the rest. | unchanged (recorded) |

### The courtyard steps: Carmen

The courtyard is painted; Carmen on the steps.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *no narration on entering* | |
| | | | *her lighter: three tries (sound)* | |
| 1 | `alan_t_carmen_1` | alan | Can I have one of those? | unchanged (recorded) |
| | | | *a pause (she looks him over)* | |
| 2 | `carmen_t_1` | carmen | No. | unchanged (recorded) |
| 3 | `alan_t_carmen_2` | alan | Fair enough. | unchanged (recorded) |
| | | | *a silence; laughter from inside (sound)* | |
| 4 | `carmen_t_2` | carmen | You're the boyfriend. | unchanged (recorded) |
| 5 | `alan_t_carmen_3` | alan | I'm the boyfriend. | unchanged (recorded) |
| 6 | `carmen_t_3` | carmen | The bookseller. | unchanged (recorded) |
| 7 | `alan_t_carmen_4` | alan | Alan. | unchanged (recorded) |
| 8 | `carmen_t_4` | carmen | Carmen Trujillo. I run the archive. [pause] I don't do parties. | unchanged (recorded) |
| 9 | `alan_t_carmen_5` | alan | You're at a party. | unchanged (recorded) |
| 10 | `carmen_t_5` | carmen | I'm outside a fiesta. There's a difference. [pause] You should know. You're outside it too. | unchanged (recorded) |
| | | | *a pause* | |
| 11 | `carmen_t_coronas` | carmen | Toma. Coronas. [pause] Don't thank me. They're terrible. | **new** |
| | | | *the lighter, three tries (sound)* | |
| 12 | `carmen_t_6` | carmen | Your doctor's very good. Everybody says so. Rayco's in love with him. [pause] Not like that. Rayco's in love with anyone who sees what he sees. | unchanged (recorded) |
| 13 | `alan_t_carmen_6` | alan | And what does he see? | unchanged (recorded) |
| | | | *a long pause* | |
| 14 | `carmen_t_7` | carmen | Ask him. [pause] Welcome to Gran Canaria. Don't swim after dark. | unchanged (recorded) |
| 15 | `alan_t_carmen_7` | alan | Why does everybody keep saying that? | unchanged (recorded) |

### The toast

Back in the hall, once Baute, the moment and Carmen are done.

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *a glass tapped (sound); a pause* | |
| 1 | `montesdeoca_p_toast_1` | montesdeoca | ¡Amigos! Two minutes, I promise. [pause] Ten years ago they told me: Ignacio, nobody pays for old bones. I said: watch me. And here we are. Look at all the old bones! | unchanged (recorded) |
| 2 | `montesdeoca_p_toast_2` | montesdeoca | Cave 6! The Guanche calendar! And soon, right beside it, a little hotel with a swimming pool... no, no, Rayco, a joke! A joke! Ha! | unchanged (recorded) |
| | | | *the room laughs (sound)* | |
| 3 | `alan_p_knuckles` | alan | Everyone's laughing. Baute too. [pause] His glass hasn't moved. His knuckles have gone white. | **new** |
| 4 | `montesdeoca_p_toast_3` | montesdeoca | To Rayco Baute, who digs. And to his Portuguese... what do we call him? His magician of the light! Vasco! ¡Salud! | unchanged (recorded) |
| | | | *sixty glasses, applause (sound)* | |
| 5 | `alan_p_toast` | alan | To Vasco. [pause] Sixty people in this room know what he thinks about the light. One of them knows what he looks like asleep. I win. | unchanged (recorded) |

### Las Canteras after nine: the walk and the black mist

Vasco on the promenade in his navy blazer; the bonfire under construction is on the painting.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_t_walk_1` | narr | After nine, on the promenade, and Vasco still talking about the light. Alan let him. It was like standing next to a fire. | **changed** |
| 2 | `alan_t_walk_1` | alan | Let's walk. I want to see the beach. | unchanged (recorded) |
| | | | *they walk along the promenade to the bonfire* | |
| 3 | `alan_t_walk_pyre` | alan | What are they building? [pause] It looks like a furniture shop fell over and somebody's very proud of it. | **new** |
| 4 | `vasco_t_sanjuan_1` | vasco | For San Juan. Sunday night. They light bonfires all along the beach and the whole city comes down to the sea. You jump over the fires for luck, and at midnight you go into the water. | unchanged (recorded) |
| 5 | `vasco_t_sanjuan_2` | vasco | Rayco says the beach looks like it's burning from end to end. | unchanged (recorded) |
| 6 | `alan_t_walk_2` | alan | Rayco says. | unchanged (recorded) |
| 7 | `vasco_t_walk_alan` | vasco | Alan. | unchanged (recorded) |
| 8 | `alan_t_walk_3` | alan | I'm teasing. [pause] Will we be here for it? | unchanged (recorded) |
| 9 | `vasco_t_sanjuan_3` | vasco | I'll be on the mountain. Noon on the twenty-fourth is the whole point. It's the day the light turns back. [pause] But you could come up. You could see it with me. | unchanged |
| 10 | `alan_t_walk_4` | alan | I could. | unchanged (recorded) |
| | | | *a pause; they walk on to the rail over the sea* | |
| | | | *still: still_mist; the surf on the reef (sound), then quiet* | |
| 11 | `alan_mist_1` | alan | That isn't the panza. [pause] It's black. Lying on the sea like smoke. And it's coming in against the wind. | **new** |
| | | | *the water (sound); a pause* | |
| 12 | `alan_mist_2` | alan | Salt. Cold stone. Rust. [pause] Old, deep water that's never seen the sun. | unchanged (recorded) |
| 13 | `alan_mist_lisbon` | alan | I know that smell. The cistern under Lisbon, up to my chest in black water. [pause] It knew whose blood I had. And it let me go. | **new** |
| 14 | `vasco_t_mist_1` | vasco | Alan? [pause] What is it? | unchanged (recorded) |
| | | | *a long pause* | |
| 15 | `alan_mist_3` | alan | Nothing. I'm tired. And I think I'm sunburnt in places I didn't know I had. | unchanged (recorded) |
| | | | *a pause; fade back to the promenade* | |
| 16 | `vasco_t_walk_up` | vasco | I'm going up. Shower. [pause] Don't be long. | unchanged (recorded) |

### The phone box at midnight (core.js, unchanged)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_call_tue_1` | alan | It's here. [pause] It's come for me. | unchanged (recorded) |
| 2 | `ines_call_tue_1` | ines | [pause] What's here? | unchanged (recorded) |
| 3 | `alan_call_tue_2` | alan | You know what. | unchanged (recorded) |
| 4 | `ines_call_tue_2` | ines | Alan. [pause] Are you sure? | unchanged (recorded) |
| 5 | `alan_call_tue_3` | alan | I smelled it. I'd know that smell anywhere, Inês. I'll smell it on my deathbed. | unchanged (recorded) |
| 6 | `alan_call_tue_3b` | alan | It can't be. We put it back. It's thirteen hundred kilometres from Lisbon. | unchanged (recorded) |
| 7 | `ines_call_tue_3b` | ines | It's the same sea, Alan. It's always been the same sea. | unchanged (recorded) |
| 8 | `ines_call_tue_3` | ines | Have you told Vasco? [pause] Alan. Have you told Vasco? | unchanged (recorded) |
| 9 | `alan_call_tue_4` | alan | He's happy. He's so happy. It's his week. It's the first thing he's ever had that's just his. I can't walk into the middle of it and say, sorry, darling, I'm being haunted again. | unchanged (recorded) |
| 10 | `ines_call_tue_4` | ines | You're not being haunted. You're being sensible. Tell him. | unchanged (recorded) |
| 11 | `alan_call_tue_5` | alan | Tomorrow. | unchanged (recorded) |
| 12 | `ines_call_tue_5` | ines | Alan. | unchanged (recorded) |
| 13 | `alan_call_tue_6` | alan | Tomorrow. I promise. Find out what you can. Anything. Old papers. Anything about the Canaries. | unchanged (recorded) |
| 14 | `ines_call_tue_6` | ines | I have a thesis. | unchanged (recorded) |
| 15 | `alan_call_tue_7` | alan | Then you'll want something to do instead. | unchanged (recorded) |
| | | | *the dial tone (sound)* | |

### Room 404: the night

Vasco in the room.

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_t_night_1` | vasco | You've been on the phone to Inês. | unchanged (recorded) |
| 2 | `alan_t_night_1` | alan | How do you know? | unchanged (recorded) |
| 3 | `vasco_t_night_2` | vasco | You've got your Inês face. Guilty, and a bit pleased with yourself. [pause] What did she say? | unchanged (recorded) |
| 4 | `alan_t_night_2` | alan | Pessoa was sick on the Eça de Queirós. | unchanged (recorded) |
| 5 | `vasco_t_night_3` | vasco | The first edition? | unchanged (recorded) |
| 6 | `alan_t_night_3` | alan | The first edition. | unchanged (recorded) |
| 7 | `vasco_t_night_4` | vasco | [pause] He always did hate Eça. | unchanged (recorded) |
| | | | *Alan laughs out loud (his laugh, sound)* | |
| 8 | `vasco_t_night_5` | vasco | Take off that terrible jacket. And come here. | unchanged (recorded) |
| | | | *still: still_love_1; a pause* | |
| 9 | `narr_love_1b` | narr | Halfway through, the lift down the corridor sneezed, very loudly, and they both lost it completely. | **changed** |
| | | | *(Discreet: black, and narr_love_1_discreet, unchanged)* | |
| | | | *black; the sea through the balcony doors (sound)* | |
| 10 | `narr_t_end_2` | narr | A bed by the sea, and a man who loved him, asleep with an arm across his chest. [pause] Everything he had ever been afraid of. | **changed** |
| | | | *Wednesday* | |

## The cut lines, and what does their job now

| id | was | now |
|---|---|---|
| `narr_pro_bar_2` | The last customer was standing at the telephone on the wall, feeding it coins. Dr. Elena Suárez, forty-five, awake since five that morning, with a pencil pushed through the knot of her hair. | folded into narr_pro_bar_1 (who she is, at the telephone); the painting shows the rest |
| `narr_pro_paco` | Paco did not look up from the chairs. | the painting shows Paco and the chairs; a chair scraping (sound) |
| `narr_pro_out` | She smiled at him, and went out into the cold. | the bar door (sound) |
| `narr_pro_road` | The road from Artenara falls off the top of Gran Canaria like a dropped ribbon. Hairpin after hairpin, pine trees on one side and nothing at all on the other. | the painted car and the drawn moonlit cloud; Elena: elena_pro_road |
| `narr_pro_road_2` | And below, always, the cloud. Tonight it lay silver under the moon, like a frozen ocean, and it was coming up to meet her. | Elena: elena_pro_road ("Silver tonight. Like a frozen sea.") |
| `narr_pro_cloud` | Then the car went into the cloud, and the world went grey, pressing against the windscreen like wet wool. | drawn (the windscreen goes grey) and the fog sound; Elena: elena_pro_cloud |
| `narr_pro_dark` | The grey grew darker. Charcoal. Then black, until the headlights were two weak yellow smudges, and then not even that. It was like driving into ink. | drawn (grey to black); Elena: elena_pro_cloud ("Like driving into ink.") |
| `narr_pro_footwell` | She looked down. There was water in the footwell. Black, and cold, and rising round her boots the way a tide rises, patiently, from below. | the water drawn rising in the car (sound); Elena: elena_pro_feet |
| `narr_pro_brake` | She pressed the brake. The car did not slow. It went on down the hairpins at the same gentle crawl, as if someone else were driving it. As if it knew the way. | Elena: elena_pro_brake ("It's driving itself, as if it knows the way.") |
| `narr_pro_stop` | Elena Suárez had spent her whole life reading the marks other people left on stone. When she understood there was nothing left she could do, she stopped doing things. | a pause after elena_doors: she stops trying the doors |
| `narr_pro_triangle` | She raised one finger and drew on the fogged glass. Three lines. A triangle, point down. She kept her finger on the glass, at the point. Pointing at the sea. | the triangle drawn on the glass, point down; Elena: elena_pro_triangle ("At the sea.") |
| `narr_pro_morning` | In the morning a goatherd found the car at the bottom of a dry barranco a little below the road. Upright. Undamaged. The windows closed, the doors locked from the inside. | the barranco still shows the car in the morning; the Guardia: gc_locked (locked from the inside) |
| `narr_pro_crust` | On the windscreen a shape had dried into the glass in a fine white crust. A triangle, pointing down. The crust was salt. | the Guardia: gc_locked ("A triangle, dried white. It's salt."); still in docs.js's Guardia photograph later |
| `narr_pro_cigarette` | The older officer lit a cigarette and looked at the car for a long time. | a long pause before gc_03 |
| `narr_open_02` | It hadn't rained on that side of the mountain for forty days. | folded into narr_open_01 (forty days without rain) |
| `narr_t_gando_2` | The luggage was in Madrid. The woman at the Iberia desk had told him so with enormous sympathy and no urgency at all, as if Madrid were a place suitcases went to retire. | Alan: alan_t_land (Madrid, "to retire", the woman at the Iberia desk) |
| `narr_t_vasco_1` | Vasco had been on the island for a week. A week was apparently all it took. He was radiant. There was no other word. He was lit up from inside like a church on a feast day. | Vasco walks across to him; Alan's look at Vasco (alan_look_vasco_gando: "never been happier in his life") is there for the player |
| `narr_t_kiss` | He kissed him, quickly and firmly, on the mouth, in front of a taxi driver, two nuns and a family from Düsseldorf. | a pause after vasco_t_hello; Alan: alan_t_hello ("In front of two nuns and a family from Düsseldorf, apparently.") |
| `narr_t_hold` | For a moment neither of them moved. Vasco held on, his forehead against Alan's, and the family from Düsseldorf found something very interesting on the arrivals board. | a pause; alan_t_missed_2 ("Do it again.") |
| `narr_t_drive_2` | Vasco heard it. He was quiet for a moment. Then he reached over and put his hand on Alan's knee, on the split seam, and left it there for the rest of the drive. | Vasco: vasco_t_knee ("Give me that knee. It's coming out of your trousers.") |
| `narr_t_hotel_1` | The hotel was not a good hotel. It had rattan chairs and potted palms, a faded poster for the Fiestas de San Juan, and a lift that announced each floor with a sound like a sneeze. | the painted lobby; the lift's sneeze is in vasco_t_hotel and alan_look_lifts |
| `narr_t_hotel_2` | The expedition had booked it because it was cheap, and the owner sponsored the dig. | Vasco: vasco_t_hotel ("The owner pays for the dig, so the dig sleeps here.") |
| `narr_t_eyebrow` | Her eyes travelled down to his trousers, and paused there, and came back up. One eyebrow rose about two millimetres. It was the most eloquent eyebrow Alan had ever seen. | a pause after nieves_t_1; Alan: alan_t_eyebrow ("Two millimetres of eyebrow. I've been reviewed.") |
| `narr_t_canteras_1` | Las Canteras: a long curve of golden beach, a stone promenade the length of it, and a reef a few hundred metres out that broke the Atlantic into lazy, harmless waves. | the painting |
| `narr_t_canteras_2` | On the corner, by a phone box, stood a little green kiosk hung with newspapers pegged on a line like washing. | the painting (the kiosk and the phone box are hotspots with their own looks) |
| `narr_beach_1` | The sand of Las Canteras, under a sky the colour of a wet sheet. The islanders call it the panza de burro, the donkey's belly. It sits on the city all summer, and the city sits under it and gets on with things. | the painting; the panza is Vasco's on the drive (vasco_t_panza_1/2) and Alan's look at the sky |
| `narr_t_sun_1` | And then, as if the surfer had said something rude to it, the panza de burro tore open. The sun came through like a slap. | the fog-lift sound and the sunny painting; alan_t_sun_1 |
| `narr_t_sun_2` | He folded his clothes into a neat, defeated pile and lay down on a borrowed towel in his underwear, which in Lisbon would have been a scandal and on Las Canteras was a Tuesday. | the undressing animation; alan_look_towels keeps the "Here it's a Tuesday" joke |
| `narr_t_dress_beach` | The cloud had closed again, as if nothing had happened. He got back into his clothes very, very carefully. | the painting goes grey again; he is dressed; a cloth sound |
| `narr_restaurant_1` | The Hotel Cristina's restaurant smelled of coffee and suncream. The buffet had been open since seven and had the look of a battlefield after the armies had gone home. | the painting; alan_look_buffet |
| `narr_t_mercado` | The Mercado del Puerto was a hundred years old, iron and glass, and it smelled of bananas, fish and cheese, in that order, depending on where you stood. | the painting; Alan's looks at the fruit, the cheese, the roof |
| `narr_t_dress` | He put on Vasco's jeans and the stranger's blazer and looked at himself in the wardrobe mirror. The sleeves stopped a good two inches above his wrists. The sunburn glowed over the collar like a warning light. | Alan is shown in the blazer and jeans; alan_blazer_on has the short arms |
| `narr_t_surfers` | Across the promenade, young surfers were coming in out of the water, their wetsuits peeled to the waist, their hair bleached into stiff gold ropes by the salt, laughing about something. | cut: Alan's own "When did surfers get so young?" says he's looking at them |
| `narr_t_money` | And the money ran out. | the beep (sound); Alan: alan_t_call_money ("And that's the money gone.") |
| `narr_t_museum_1` | El Museo Canario: pale stone and dark wooden balconies around a courtyard in Vegueta. Waiters with warm white wine, a string quartet playing Vivaldi to nobody, and sixty people talking at the tops of their voices. | the painting (hall, lanterns, guests); the guests talk when clicked |
| `narr_t_museum_2` | And all around them, in the old glass cases that lined the walls, the dead. Row after row of skulls, staring out with polite, patient eyes. It was like holding a cocktail party in a crypt. | the painting (the cases of skulls); alan_look_cases |
| `narr_p_arrive` | Vasco was in the middle of the room in a navy blazer Alan had never seen before, a glass he hadn't touched in one hand, explaining something with the other to four people in expensive linen. He saw Alan, lit up, and raised one finger: one minute. | Vasco: vasco_p_arrive ("Alan! One minute!"), then alan_p_arrive |
| `narr_p_1` | And he turned back to them, already smiling, already somebody else. Alan stood there with his hands in the pockets of a stranger's blazer, feeling like a coat someone had handed in at the door. | Vasco turns his back to Alan; Alan: alan_p_2 ("Handed in at the door like a coat.") |
| `narr_p_2` | Vasco took his hand, there in front of everyone, and walked him across the room. | Vasco and Alan walk across the room to Baute together |
| `narr_t_baute_1` | He had a long, deeply tanned face, silver hair swept back, and a short grey beard. At his throat, on a leather thong, hung a small seal of red clay, carved with triangles. | his sprite (face, beard, the pendant); the pendant named in Baute's own line baute_t_gran_2 ("This little seal was hers") |
| `narr_t_baute_2` | Alan found that he meant it, and that it hurt. | cut: alan_t_baute_2 ("He does.") and the corridor carry it |
| `narr_t_pendant` | He touched the clay pendant at his throat, lightly, with two fingers. | Baute: baute_t_gran_2 (the seal was his abuela's) |
| `narr_t_baute_3` | Alan was left with a glass of warm white wine and the feeling of having been told something important in a language he didn't speak. | Alan: alan_t_baute_after ("I think I've just been told something important. In a language I don't speak.") |
| `narr_p_baute_monte` | He smiled when he said it. It was a very good smile. It stopped just below the eyes. | Alan: alan_p_baute_smile ("It stops just below the eyes.") |
| `narr_p_3` | He led Alan down the corridor, between the skulls and the mummies in their cases, to the door at the end with his name on it, where the party was only a murmur, and for a moment he didn't say anything at all. | the corridor room; they walk down it towards his door; a pause |
| `narr_p_4` | He meant it. He was proud of him, so proud it ached. And underneath, small and mean and impossible to swallow, was the other thing: the whole room had Vasco, and Alan had ten minutes. | Alan: alan_p_4 ("And I get ten minutes."), so vasco_p_9 ("You get the rest") answers it |
| `narr_p_5` | He kissed him, quickly, at the corner of the mouth, and walked him back down the corridor to the Cabildo. | a pause; back to the hall |
| `narr_courtyard_1` | Behind the party, the old house went on being an old house: a stone courtyard, a dragon tree older than the museum, balconies of dark carved wood, and the noise of the reception muffled to a murmur. | the painting; Alan's looks at the dragon tree and the fountain |
| `narr_t_carmen_1` | There was a woman sitting on the museum steps. She was on her third attempt to light a cigarette with a lighter that didn't want to work. On the third attempt, it did. | her lighter, three tries (sound) |
| `narr_t_carmen_2` | She looked at him. She looked at the jacket. She lowered the sunglasses from the top of her head and looked at him over them, the way a customs officer looks at a suitcase. | a pause before carmen_t_1 ("No.") |
| `narr_t_carmen_3` | They sat in silence for a while. From inside came the string quartet, and Vasco's voice, rising with enthusiasm, and a burst of laughter. | a silence and laughter from inside (sound) |
| `narr_t_carmen_4` | Alan said nothing. Carmen held out the packet: Coronas, the local brand, crushed almost flat. She lit one for him, and it took her three tries. | Carmen: carmen_t_coronas ("Toma. Coronas."), then the lighter, three tries (sound) |
| `narr_t_carmen_5` | Carmen looked at him for a long moment. Something moved behind her eyes, something tired and guarded, and then it was gone. | a long pause before carmen_t_7 |
| `narr_p_toast_1` | Somebody tapped a glass. The quartet stopped in the middle of a phrase, gratefully. Montesdeoca climbed two steps up the staircase, so that everybody could see the gold watch. | the glass tapped (sound); a pause |
| `narr_p_toast_2` | Everybody laughed. Baute laughed with them. His glass did not move, and the hand around it had gone white at the knuckles. | the room's laugh (sound); Alan: alan_p_knuckles ("His glass hasn't moved. His knuckles have gone white.") |
| `narr_p_toast_3` | Sixty glasses went up. Vasco went red under his tan and laughed and didn't know what to do with his hands. Across the room, Alan raised his warm white wine with everybody else. | glasses and applause (sound); alan_p_toast |
| `narr_t_walk_2` | Further down the sand, men were building something out of wooden pallets and old furniture and dried palm fronds: a great untidy pyramid, taller than a man. | they walk to the bonfire; Alan: alan_t_walk_pyre ("What are they building?") |
| `narr_t_walk_3` | He squeezed Vasco's hand, and didn't say yes. They walked to the end of the promenade and stood at the rail. The air was so warm and so heavy it was like breathing through a damp cloth. | alan_t_walk_4 ("I could.") and a pause; they walk on to the rail |
| `narr_mist_1` | And then, out on the water, past the reef, Alan saw the mist. A low black line, like a second horizon. Not the high grey of the panza. Black, oily black, hugging the sea like smoke from a burning ship. | the still (still_mist); Alan: alan_mist_1 ("It's black. Lying on the sea like smoke.") |
| `narr_mist_2` | It was coming in against the wind. He could feel the wind on his face, blowing off the land and out to sea. And the black mist rolled in against it, slowly, deliberately, the way a tide comes in. | Alan: alan_mist_1 ("coming in against the wind": the 1483 page's "the sea rose black against the wind") |
| `narr_mist_3` | It reached the reef, and the waves breaking on the reef went quiet, all at once, as if someone had laid a hand over them. It reached the sand. And then the smell reached him. | the surf on the reef (sound), then quiet; alan_mist_2 (the smell) |
| `narr_mist_4` | He had smelled it once before, eight months ago, at the bottom of a cistern under Lisbon, up to his chest in black water. Something there had looked at him, and known him for the blood of the men who made the bells, and withdrawn. | Alan: alan_mist_lisbon ("The cistern under Lisbon... It knew whose blood I had. And it let me go.") |
| `narr_mist_5` | He thought about Vasco's face in the museum, lit up. About the week Vasco was having, the best week of his life, perhaps. About how the light would go out of that face if he said it. | a long pause; why he says nothing is his to say to Inês at midnight (alan_call_tue_4) |
| `narr_mist_6` | Vasco smiled, and put his arm around Alan's shoulders, and turned him gently away from the sea. Behind them, the mist lay along the waterline like something sleeping, and did not move again. | cut; the mist "like something asleep" is Alan's look at the sea afterwards (alan_look_sea_mist) |
| `narr_t_room_1` | Vasco was lying on the bed in a towel, reading his notebook and frowning at it, with his glasses on the end of his nose. The ceiling fan turned slowly overhead, stirring the warm air and doing nothing about it. | Vasco in the room; Alan's look (alan_look_vasco_room) |
| `narr_t_laugh` | Alan laughed. It came out of him too suddenly, too loud, like something escaping, and Vasco smiled, and held out his hand. | Alan's laugh (sound, v_alan_chuckle) |
| `narr_love_1` | It was easy. That was the thing about it. It was easy, and it was funny, and it was familiar, and familiar had always been the word that frightened him most. | the still (still_love_1); its narration is the one line narr_love_1b |
| `narr_t_end_1` | Afterwards, Vasco fell asleep almost at once, one arm thrown across Alan's chest like a claim. Alan lay awake, listening to the sea through the open balcony doors, and listening for the other sound, the one under the waves. | the sea through the balcony doors (sound) over black |
| `narr_t_end_3` | Outside, on the dark beach, the bonfire stood unlit, waiting for Sunday. | cut (the bonfire is on the promenade every day from Wednesday, taller each day) |

## Changed lines, before and after

| id | speaker | before | after |
|---|---|---|---|
| `narr_pro_bar_1` | narr | The bar in Artenara had been closing for an hour. The shutters were halfway down, the television was off, and Paco was putting the chairs up on the tables, one at a time. | Artenara, the last bar on the mountain, closing. At the telephone on the wall, feeding it coins: Dr. Elena Suárez, awake since five. |
| `narr_open_01` | narr | The Guardia Civil recorded the death of Dr. Elena Suárez as an accident caused by a flash flood. Her lungs were full of water, and the water was salt. | Her lungs were full of water, and the water was salt. It hadn't rained on that side of the mountain for forty days. |
| `narr_open_03` | narr | After that, once a month, on the darkest night of the moon, somebody on the island drowned in a dry place. Old people, in five towns, months apart. Nobody put them side by side. | After that, once a month, at the dark of the moon, someone drowned in a dry place on the island. Nobody put them side by side. |
| `alan_t_land` | alan | It would come tomorrow, she said. Or Thursday. It's June, she said, as though that explained it. [pause] Perhaps on Gran Canaria it does. | My suitcase has gone to Madrid. To retire, by the sound of it. [pause] Tomorrow, said the woman at the Iberia desk. Or Thursday. It's June, she said, as though that explained it. |
| `alan_t_hello` | alan | I'm here. My trousers are not entirely here. My suitcase is in Madrid. | I'm here. [pause] In front of two nuns and a family from Düsseldorf, apparently. My trousers are not entirely here. My suitcase is in Madrid. |
| `narr_t_drive_1` | narr | It had been blue sky at the airport. Halfway to Las Palmas they drove under the edge of the cloud, and the light changed as if someone had closed a lid. | Halfway to Las Palmas they drove under the edge of the cloud, and the light changed as if someone had closed a lid. |
| `alan_p_2` | alan | Talk to someone. Right. [pause] I'll talk to the skulls. They look like good listeners. | Talk to someone. Right. [pause] Handed in at the door like a coat. I'll talk to the skulls. They look like good listeners. |
| `baute_t_gran_2` | baute | She gave them names, so they'd have names. 'This is Tamara. This is Guayasén. Say buenos días.' | She gave them names, so they'd have names. 'This is Tamara. This is Guayasén. Say buenos días.' [pause] This little seal was hers. |
| `alan_p_4` | alan | I see it. [pause] You're brilliant. Everyone in that room wants a piece of you. | I see it. [pause] You're brilliant. Everyone in that room wants a piece of you. [pause] And I get ten minutes. |
| `narr_t_walk_1` | narr | After nine, and Vasco still talking: about Baute, the hidden chamber, the dinner, the light. Alan let him. It was like standing next to a fire. | After nine, on the promenade, and Vasco still talking about the light. Alan let him. It was like standing next to a fire. |
| `narr_love_1b` | narr | Halfway through, the lift down the corridor sneezed, very loudly, and they both lost it completely, and lay there shaking with laughter with their foreheads pressed together. And then stopped laughing, and didn't need to say anything. | Halfway through, the lift down the corridor sneezed, very loudly, and they both lost it completely. |
| `narr_t_end_2` | narr | Eight months. A bed by the sea. A man who loved him, asleep with an arm across his chest, as if he might otherwise float away. [pause] This was everything he had ever been afraid of. | A bed by the sea, and a man who loved him, asleep with an arm across his chest. [pause] Everything he had ever been afraid of. |
