# Saturday (Vasco) and Monday: the lines to read (2026-10-31, less narrator)

The user: "over all, with your re-works there is way too much narrator. We don't need that much description. Some things
should simply be done by the characters, other just said by the characters - we don't need to have it all described"; and
"It is not only the finale with the narrator - it is basically the entire game".

Vasco's Saturday (`js/story/vasco.js`: the camp at seven, Yeray's coffee, Elena's charts, the radio and the foil, Baute's
refusal, the road down, the cell, the mark, the water, the prayer, and the cut back to Alan's night) and Monday outside
the cave's finale (`js/story/mon.js`: the dawn in the cave, Yeray's fuse, the confession, the radio and the Guardia, the
rock, the road down, Nieves, Chano and San Borondón, the fireworks, the last night, the coffee) were gone through line by
line the way Cave 6 was (`docs/puzzles/CAVE6_LINES.md`). Not touched: Cave 6 and the chamber under it on Saturday (entry
109), the finale in the water and `S.closeLock` with the dance and the two stills after it (entries 109, 110: so
`narr_m_out`, `narr_m_one_try`, `narr_m_baute_hat`, `narr_m_old_thing` still play there), and Sunday.

What the game shows (the rooms, the stills, the water, the dark) or a character can do (walk, turn, a pose, a sound, a
pause) is no longer narrated; what the player needs (Elena's accident, "Puerta", the missing fuse, the cinnamon in the
coffee, the fisherman, the torch's old battery, the seven coils, the prayer, the sixth disc in Baute's hands, the
sergeant cousin, Nieves's eyebrow, the terrible coffee) is said by Vasco, Alan or Carmen; the narrator keeps the
chapter's opener, the time jumps (the road to Artenara, the night, the cut to Alan, the morning going over them, the
Guardia at four, the city's birthday, the morning after), one line over each still, and the game's last line.

| | before | after |
|---|---|---|
| narrator lines played | 97 (Saturday 52, Monday 45) | 14 (Saturday 4, Monday 10) |
| narrator words | 2,526 | 261 |
| longest narrator line | 43 words | 26 words (`narr_end_guardia`, from entry 109) |
| character lines played (with looks and choices) | 228 | 249 (the same 228, and 21 new) |
| character words | 3,417 | 3,846 |

(Words counted without `[pause]`; Monday's counts include both branches of the two choices that change a line, the
confession's way of telling over the road down and the last night.) 83 narrator lines are no longer played; 10
narrator lines were shortened; 7 of Vasco's lines and 1 of Carmen's changed (`vasco_v_02`, `vasco_v_yeray_4`,
`vasco_take_1`, `vasco_radio_fuse`, `vasco_look_serpent`, `vasco_mark_a`, `vasco_wet_2`, `carmen_m_guardia`) and 21 are
new. No character line was cut, no choice or clue lost: the confession's three ways keep their own lines and their own
line on the road down and in the last night. Nothing is recorded: the 17 changed lines' old recordings are in
`audio/voice_stale/` (they play as captions, and are listed in `scripts/voice_redo.txt`); the new ones have no recording
yet. Ids are never renamed.

Done in code instead of said: Vasco walks to the edge at seven; the coffee poured and thrown (sounds); Yeray walks off and
Vasco turns back to the cloud; the radio clicked on and off and the case opened (pose, sounds); the foil burning; Rayco
walking in along the path behind Vasco; sitting and drinking (poses, the cup); Vasco walking to the edge with his back to
Rayco, the silences, turning round; Vasco walking to the top of the road and sitting down, Rayco and Yeray walking up
behind him (footsteps), played in the room rather than over the black, where captions don't show; Rayco's and
Yeray's footsteps going back up the cleft, the torch clicked on; the pause in the water before "So this is what Alan
meant"; kneeling to pray. Monday: the pauses at dawn; Alan taking the fuse; Vasco turning to Alan, the long looks and
silences in the confession; Alan taking the trowel; the pause while Carmen talks to the sergeant; Carmen walking over to
Rayco, the two matches, the keys caught; Rayco walking to Vasco, then Rayco, Carmen and Yeray walking out of the cave; a
pause on the fireworks still and for Chano's nod; the cup in the morning.

The narration over the stills (still_road_down, still_fireworks, still_love_2, and the morning after) is one short line
each; these stay proposals for the user, like the rest.

Below, each scene in play order, as it now plays. *Italics* are what the game shows or the characters do (no line).
Status: **new** or **changed** (this pass), unchanged.


### Saturday, Vasco: the camp at seven

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the card: RISCO CAÍDO · The same morning · 07:00; the painting shows the sea of cloud, Teide and the sun* | |
| 1 | `narr_v_camp_1` | narr | Vasco hasn't slept since Thursday. Seven on Saturday morning, above the clouds, trying very hard not to think about Alan. | **changed** |
| | | | *Vasco walks to the edge and looks out* | |
| 2 | `vasco_v_wake` | vasco | Alan would make a joke about this. Something about heaven, and being overdressed for it. | unchanged |
| 3 | `vasco_v_wake_2` | vasco | I'm not thinking about Alan. | unchanged |
| | | | *a pause (the cloud doesn't answer)* | |

#### Looking round the camp

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_look_cloud` | vasco | Cloud to the horizon, and Teide standing out of it. Somewhere under it, the hotel. [pause] Stop it. | unchanged |
| 2 | `vasco_look_yeray` | vasco | Yeray, hungover, making coffee on a camping stove. He's twenty-four and looks like he's carried something heavy all night. | unchanged |
| 3 | `vasco_look_stove` | vasco | Yeray's stove. Yeray's terrible coffee. Yeray's empty cigarette packet. | unchanged |
| 4 | `vasco_look_finds` | vasco | The expedition files, in grey boxes. At the back of the last one, my predecessor's papers, filed and forgotten. | unchanged |
| 5 | `vasco_need_charts` | vasco | Not without Elena's charts. I'd only be guessing, and the cave deserves better. | unchanged |

### Yeray's terrible coffee (talk to Yeray)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the cups* | |
| 1 | `yeray_v_01` | yeray | Morning, doctor. Coffee? It's terrible. | unchanged |
| 2 | `vasco_v_01` | vasco | Then yes. | unchanged |
| | | | *the coffee poured (heard); Vasco holds his mug* | |
| 3 | `yeray_v_02` | yeray | I was in Vegueta last night. At Rafa's bar. You know it? Behind the cathedral. | unchanged |
| 4 | `vasco_v_yeray_1` | vasco | No. | unchanged |
| 5 | `yeray_v_02b` | yeray | You should go. Everyone goes. [pause] There was a Portuguese guy there. | unchanged |
| | | | *a pause: Vasco doesn't move* | |
| 6 | `yeray_v_02c` | yeray | Funny. Making Rafa laugh. Making everyone laugh. | unchanged |
| 7 | `yeray_v_02d` | yeray | Sad, though. Underneath. Like a man at his own fiesta who doesn't know why he came. | unchanged |
| 8 | `vasco_v_02` | vasco | There are a great many Portuguese men in Las Palmas. [pause] Most of them are sad. It's the national sport. | **changed** |
| | | | *a pause* | |
| 9 | `yeray_v_03` | yeray | Doctor. [pause] The discs. | unchanged |
| 10 | `vasco_v_yeray_2` | vasco | Yes? | unchanged |
| 11 | `yeray_v_03b` | yeray | Dr. Baute says they're going down to Las Palmas. To the museo. For conservation. | unchanged |
| 12 | `vasco_v_03` | vasco | Yes. I signed the sheets. | unchanged |
| | | | *a pause* | |
| 13 | `yeray_v_04` | yeray | They're not going to Las Palmas. | unchanged |
| 14 | `vasco_v_yeray_3` | vasco | What do you mean? | unchanged |
| | | | *Yeray throws the rest of his coffee over the edge (heard)* | |
| 15 | `yeray_v_04b` | yeray | Forget it. I'm hungover. I talk rubbish. | unchanged |
| 16 | `yeray_v_05` | yeray | Ask Dr. Baute. Please. Not me. | unchanged |
| | | | *Yeray walks off towards the tents; Vasco turns back to the cloud; a pause* | |
| 17 | `vasco_v_yeray_4` | vasco | A Portuguese guy at Rafa's bar. Funny. Sad underneath. [pause] I'm not thinking about Alan. | **changed** |

### Elena's charts (the finds table)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *papers* | |
| 1 | `vasco_take_1` | vasco | Elena Suárez. My predecessor. Rayco said her name once, the first day, flat as a wall: an accident in December, on the mountain road. | **changed** |
| 2 | `vasco_take_2` | vasco | Good hand. [pause] Better than mine. | unchanged |
| 3 | `vasco_take_3` | vasco | And the last sheet, only pencil. The sun disc on its own, tipped off the flat. A number. An hour. | unchanged |
| 4 | `vasco_take_4` | vasco | And in the margin, in a hand gone big and fast, one word. Underlined three times. [pause] 'Puerta.' Door. | **new** |
| | | | *Elena's charts, the chalk and the notebook go into his pockets* | |
| 5 | `vasco_take_charts` | vasco | Her charts, my chalk and my notebook. A day's work. | unchanged |

### The radio, in the morning

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_look_radio_1` | vasco | I could call the museum. The museum could call the hotel. In ten minutes I could be hearing his voice. | unchanged |
| 2 | `vasco_look_radio_2` | vasco | [pause] And say what? | unchanged |
| 3 | `vasco_look_radio` | vasco | Off. [pause] Good. I don't want to talk to him either. | unchanged |

### (Cave 6 and the chamber under it: done in entry 109, docs/puzzles/CAVE6_LINES.md; not touched)

### The radio, after the cave: the fuse

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *on, off, on again: two clicks, nothing; he kneels and opens the case* | |
| 1 | `vasco_radio_fuse` | vasco | Empty. [pause] The fuse is gone. [pause] Radios don't lose their fuses by themselves. | **changed** |
| 2 | `vasco_v_see_0` | vasco | Yeray, frightened. The marks round the empty sockets. Elena's word in the margin. And Rayco's face: an accident in December, on the mountain road. | **new** |
| 3 | `vasco_v_see` | vasco | I haven't wanted to see this. I've walked past it every day for a week, because I didn't want to see it. | unchanged |
| 4 | `vasco_radio_fuse_2` | vasco | No fuse. No radio. No one. | unchanged |

### The foil (the stove's cigarette packet, into the radio)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_look_foil` | vasco | Silver paper. In the right hands, a fuse. In mine, a fire. | unchanged |
| | | | *he kneels, folds the foil into the holder* | |
| 2 | `vasco_r_foil_1` | vasco | Folded twice. Into the holder. [pause] God forgive me, Lorenzo, I'm doing electrics. | unchanged |
| | | | *a click: the radio comes on* | |
| 3 | `vasco_r_on` | vasco | It hums. [pause] Channel nine, the museum's. God knows how long I've got. | **new** |
| 4 | `vasco_r_send` | vasco | Risco Caído. If anyone hears this, tell Alan Sanches at the Hotel Cristina. It isn't the van. The discs aren't going to the lab, they're going down, under— | unchanged |
| | | | *the foil flares and burns through (heard); the dial dies* | |
| 5 | `vasco_r_after` | vasco | [pause] 'Under.' Well done, Vasco. A whole sentence about where, and you stopped at the only word that mattered. | unchanged |
| | | | *Rayco walks in along the path behind him, with a thermos and two mugs; Vasco turns* | |
| 6 | `baute_v_01` | baute | You've solved it. I knew you would. | unchanged |
| 7 | `baute_v_heard` | baute | That radio's been dead since Thursday. Yeray is hopeless with fuses. | unchanged |
| 8 | `baute_v_01b` | baute | Café? Mine's better than Yeray's. | unchanged |
| 9 | `vasco_look_baute` | vasco | Rayco, in his shirtsleeves and his field hat, with a thermos. The way he's stood at the mouth of every cave I've seen him in. As if he owns the view. | unchanged |

### The refusal (talk to Rayco)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `baute_v_coffee` | baute | Sit. Por favor. Sit with me a moment. The cloud is beautiful from here. | unchanged |
| | | | *they sit; the thermos cup (heard); Vasco drinks* | |
| 2 | `vasco_v8_coffee` | vasco | Cinnamon? [pause] And something bitter under it. [pause] I haven't eaten since Friday. | **new** |
| 3 | `baute_v_02` | baute | You wrote in your thesis that a baptised bell is a voice the dead can hear. That when it rings, it isn't calling the living to church. | unchanged |
| 4 | `baute_v8_02b` | baute | It's telling the dead that someone still remembers them. [pause] I read it three times. I read it the week before I hired you. | unchanged |
| 5 | `baute_v8_02c` | baute | You were right. Whatever happens now. You were right about bells, and you were right about the light. | unchanged |
| 6 | `baute_v_03` | baute | This is ours. The priestesses made it. Every summer for five hundred years el sol has come through that hole and said the same prayer across the wall, and the sea has stayed down. | unchanged |
| | | | *choice:* | |
| 7 | `vasco_v_07a` | vasco | And you're taking the prayer apart. | unchanged |
| 8 | `vasco_v_07b` | vasco | Rayco. What's in the vault? | unchanged |
| | | | *a pause: Rayco doesn't deny it* | |
| 9 | `baute_v_04` | baute | In 1966 I was twenty-six. A new degree from La Laguna and no power at all. Nada. A boy with a piece of paper. | unchanged |
| 10 | `baute_v8_04b` | baute | My grandmother's village was Tasarte, on the west coast. Above it there was a hill, and in the hill, caves, and in the caves, our dead. Five hundred years of them. | unchanged |
| 11 | `baute_v8_04c` | baute | My abuela used to take me up there and tell me their names. Not their real names. She made them up. So they'd have names. | unchanged |
| 12 | `baute_v8_04d` | baute | A company bought the hill for a hotel. I wrote letters. I sat in a corridor in Madrid for three days. And in August they sent in the bulldozers. | unchanged |
| 13 | `baute_v8_04e` | baute | They scraped the caves out like a pot. They put the bones in a skip. [pause] I picked some of them up off the road afterwards. I kept them in a cardboard box under my bed for a year. | unchanged |
| 14 | `baute_v8_04f` | baute | The site manager was a young man called Ignacio Montesdeoca. Very charming. He gave me a cigarette while I watched, and told me not to take it personally. | unchanged |
| 15 | `baute_v8_04g` | baute | Now he sponsors my dig. He shakes my hand at dinners. He bought the new display cases. [pause] He doesn't remember me. Why would he? I was a boy at the bottom of a hill. | unchanged |
| 16 | `baute_v_05` | baute | Thirty years of objections, Vasco. Every hotel, every golf course, every marina. I've lost every one. [pause] La isla has asked politely since 1483. Nobody has ever listened. | unchanged |
| 17 | `baute_v_06` | baute | I need one thing from you. Elena had it, and she's gone, and I'm a digger, not an astronomer. What to do with the last disc. | unchanged |
| 18 | `baute_v8_06b` | baute | So that on San Juan, at the top of the day, el sol goes back where it came from, and the door opens. And el mar takes back what was taken from it. The concrete. The hotels on our graves. Not the people. | unchanged |
| 19 | `vasco_v8_fisherman` | vasco | A fisherman drowned in his bed in La Isleta, Rayco. Alan told me. Nowhere near any concrete. | **new** |
| 20 | `vasco_v_08` | vasco | It doesn't take orders, Rayco. | unchanged |
| 21 | `baute_v_07` | baute | Mine will. | unchanged |
| | | | *Vasco gets up and walks to the edge, his back to Rayco* | |
| | | | *choice:* | |
| 22 | `vasco_v_09a` | vasco | Elena worked this out too. Didn't she. | unchanged |
| 23 | `vasco_v_09b` | vasco | Where's Dr. Suárez, Rayco? | unchanged |
| | | | *a long silence; he turns round* | |
| 24 | `baute_v_08` | baute | I took out one disc. One. In December, on the night of the twentieth, after everyone was asleep. Just to see if it was true, what the old women said. | unchanged |
| 25 | `baute_v8_08b` | baute | She found the socket the next day. She went down the mountain that night to tell Carmen. She never got there. | unchanged |
| 26 | `vasco_v8_killed` | vasco | You killed her. | unchanged |
| 27 | `baute_v_09` | baute | I didn't touch her. I didn't touch her, Vasco. I was at the camp. I watched her lights go down the road. I went to bed. | unchanged |
| 28 | `baute_v8_09b` | baute | El mar came for her. Not me. That afternoon she read the cave right, for the first time, after a year of reading it wrong. And it knew. [pause] I didn't know it did that. That it watches. | unchanged |
| 29 | `baute_v8_09c` | baute | I know now. | unchanged |
| 30 | `vasco_v_10` | vasco | You know now. Then you know what it will do to the rest of them. The people on the beaches. You know what's happening in Las Palmas every night, and you're still... | unchanged |
| 31 | `baute_v_10` | baute | [pause] The number, Vasco. | unchanged |
| 32 | `vasco_v_11` | vasco | No. | unchanged |
| | | | *a pause* | |
| 33 | `baute_v_11` | baute | [pause] I thought you'd say that. You're a better man than me. It's very inconvenient. | unchanged |

### The road down, and the granary

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_v_walk` | vasco | I'm going down to Las Palmas. Now. I'm going to tell Carmen, and the museum, and the Guardia Civil. [pause] And then I'm going to find Alan. | unchanged |
| 2 | `baute_v_see` | baute | I know. | unchanged |
| 3 | `vasco_v8_keys` | vasco | The keys aren't in the Land Rover. Or on the hook. [pause] You've been down to the village. [pause] Then I'll walk. | **new** |
| | | | *Vasco walks to the top of the road, at the left of the camp* | |
| 4 | `narr_v_drug` | narr | He got as far as the top of the road to Artenara. Then the road began to tilt. | **changed** |
| | | | *he sits down* | |
| 5 | `vasco_v8_drug` | vasco | The coffee. [pause] Cinnamon, and something under it. [pause] Sit down, Vasco. Before your legs do it for you. | **new** |
| | | | *footsteps behind him: Rayco, and Yeray come back, walk up to him* | |
| 6 | `yeray_v8_sorry` | yeray | I'm sorry, doctor. I'm sorry. Lo siento. | unchanged |
| 7 | `baute_v8_sleep` | baute | It's only to make you sleep. Elena kept it in the camp for her back. You'll wake with a headache, that's all. [pause] I would never hurt you, Vasco. | unchanged |
| 8 | `vasco_v8_hurt` | vasco | You hurt... [pause] You hurt her... | **new** |
| | | | *fade to black; the cell, from behind the grille (vault_cell); his torch on* | |
| 9 | `vasco_v8_wake` | vasco | My head. [pause] Steps. Bars. And a brand-new brass padlock, like an earring on a corpse. | **new** |
| 10 | `baute_v8_granary` | baute | Mira. A Canario granary. Twelfth century, perhaps. Grain, cheese, figs. It's dry. It's always been dry. [pause] You'll be safe here. | unchanged |
| 11 | `baute_v_12` | baute | I'll come for you on Monday. After noon. After it's done. [pause] You have my word. | unchanged |
| 12 | `vasco_v_12` | vasco | Your word's under a hotel, Rayco. | unchanged |
| | | | *Rayco's footsteps going back up the cleft, and Yeray's (heard); a long pause; a click: the torch* | |
| 13 | `vasco_v8_torch` | vasco | My torch. For reading inscriptions in dark chapels. [pause] And the battery isn't new. | **new** |

### The cell: looking

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `vasco_look_grille` | vasco | Nineteenth-century iron, new padlock. Rayco always did respect the original fabric. [pause] The top's in hard basalt. The bottom's leaded into the soft tuff of the threshold. The lead's gone to powder. | unchanged |
| 2 | `vasco_look_crates` | vasco | The museum's crates. I signed the sheets: 'Conservation transfer.' [pause] An obsidian disc in each, in straw. The missing nails. All here. | unchanged |
| 3 | `vasco_look_crates_2` | vasco | Five here. The sun's still in the cave, and Rayco keeps the sixth on him. On Monday he'll tip the sun by guesswork. [pause] And he thinks he can't do it without me. | unchanged |
| 4 | `vasco_look_crates_3` | vasco | With six nails out, close might be enough. [pause] Think. You have until Monday. Think. | unchanged |
| 5 | `vasco_crates_reach` | vasco | Through the bars, a metre away. It might as well be Lisbon. | unchanged |
| 6 | `vasco_look_walls` | vasco | The Church teaches you one thing: when you're frightened and alone in a dark stone room, you look at the walls. [pause] Pick marks. Nine hundred years old. | unchanged |
| 7 | `vasco_look_serpent` | vasco | And low, behind the last crate, worn almost away: a serpent, coiled tight on itself, its mouth open at the centre. [pause] Seven coils. | **changed** |
| 8 | `vasco_look_walls_2` | vasco | Pick marks, and the serpent behind the last crate. I'll think about it later. If there's a later. | unchanged |
| 9 | `vasco_look_anchor` | vasco | A bottom anchor of the grille, leaded into soft tuff. If both come out, the grille might swing out at the bottom on its chain. Like a cat flap. Alan would like that. | unchanged |
| 10 | `vasco_look_wallbit` | vasco | Soft rock by the grille, at eye height. You could write on it with a trowel. | unchanged |

### The cell: digging, the mark, the water

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the trowel on the left anchor (pose, sounds), three times; the torch dimmer each time* | |
| 1 | `vasco_dig_1` | vasco | The lead crumbles. Slowly. Torch off. Save it. Dig by feel. | unchanged |
| 2 | `vasco_dig_2` | vasco | Nearly. A centimetre of lead and a lot of nerve. | unchanged |
| 3 | `vasco_dig_left_out` | vasco | Out. One anchor out. [pause] Before the other one, something for whoever comes. | unchanged |
| | | | *Lorenzo's trowel on the wall by the grille* | |
| 4 | `vasco_trowel_1` | vasco | Lorenzo's trowel. 'L. a V. Roma.' My twenty-seventh birthday, a café in Trastevere, the dome going pink. | unchanged |
| 5 | `vasco_trowel_2` | vasco | 'For the day you find something worth keeping.' [pause] I thought I had. | unchanged |
| | | | *he kneels and scratches (heard)* | |
| 6 | `vasco_mark_1_scratch` | vasco | The seven signs, in the order they lie in the floor. Moon, moon, moon, the sun, moon, moon, moon. [pause] What opens it stays in my head. Only in my head. | unchanged |
| 7 | `vasco_mark_a` | vasco | [pause] And underneath. A. [pause] A signature, or a message, or a prayer. I don't know which. | **changed** |
| | | | *the water seeps in, and rises (drawn)* | |
| 8 | `vasco_wet_1` | vasco | My knees are wet. [pause] Salt. In a granary. A thousand metres up. | unchanged |
| | | | *a pause* | |
| 9 | `vasco_wet_2` | vasco | So this is what Alan meant. [pause] And I'm not angry with him. Not any more. | **changed** |
| 10 | `vasco_wet_3` | vasco | Elena read the cave right, and it came for her that same night. Today I read it right too. [pause] Ah. So it's me. | unchanged |
| 11 | `vasco_wet_4` | vasco | [pause] Torch off. Keep digging. | unchanged |
| | | | *the right anchor* | |
| 12 | `vasco_dig_right_1` | vasco | It's at my waist. It doesn't spill through the bars. It stays with me, wherever I stand. Like a dog. Keep digging. | unchanged |
| | | | *the blade snaps (heard)* | |
| 13 | `vasco_snap` | vasco | [pause] The blade. Lorenzo's blade, snapped. A centimetre left. [pause] Of course. | unchanged |
| | | | *the water at his chest (drawn)* | |

### The prayer, and Alan's night

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_v8_pray` | narr | Some time in the night, in the dark and the rising water, he prayed. For the first time since January. | **changed** |
| | | | *he kneels in the water* | |
| 2 | `vasco_v_13` | vasco | Pai nosso, que estais no céu... [pause] | unchanged |
| | | | *a pause* | |
| 3 | `vasco_v_14` | vasco | I'm sorry. I've been working on a Saturday. [pause] I know You're busy. | unchanged |
| 4 | `vasco_v_prayer_1` | vasco | There's a man. Alan. White to the lips on the promenade, saying 'sunburn'. Caught behind a desk with his hand on a map, like a schoolboy and a thief. | **new** |
| 5 | `vasco_v_prayer_2` | vasco | On Friday he told me everything. Too fast, in the wrong order, too late. And I didn't listen. I was too frightened of what it meant. | **new** |
| 6 | `vasco_v_prayer_3` | vasco | He might be on a plane by tomorrow lunchtime. I told him to go. [pause] Or he might not. | **new** |
| | | | *the torch goes out* | |
| 7 | `vasco_v_15` | vasco | [pause] If You can't come... send the idiot. | unchanged |
| | | | *a pause; fade; the hotel room* | |
| 8 | `narr_cut_alan` | narr | Fifty kilometres away and a thousand metres down, Alan lay on the hotel bed in his clothes, staring at a telephone that did not ring. | **changed** |
| 9 | `alan_s_night` | alan | Ring. [pause] Please. | unchanged |

### Monday: dawn in the cave (the start of the finale; the rest of the cave: CAVE6_LINES.md)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *the card: MONDAY · 24 June · San Juan; the cave at dawn: Baute on his camp stool, the disc in his hands; a pause* | |
| 1 | `baute_m_1` | baute | I tipped it myself. The sun. At four o'clock. By eye. | unchanged |
| 2 | `baute_m_1b` | baute | I watched Elena do it a hundred times. And I watched you do it, Vasco, last week, when you thought I wasn't looking. | unchanged |
| 3 | `baute_m_1c` | baute | I'm not a mathematician. But I'm not a fool either. [pause] With six of seven gone, close will do. I can see in your face that you know it. | unchanged |
| | | | *Vasco walks to the rim and looks down at the sun disc* | |
| 4 | `vasco_m_1` | vasco | It's wrong. | unchanged |
| 5 | `baute_m_close` | baute | It's close. | unchanged |
| 6 | `vasco_m_1b` | vasco | It's tipped by eye, Rayco. At twelve it won't face the sun. [pause] But some time after, it will. Near enough. | unchanged |
| 7 | `vasco_m_1c` | vasco | You've got it nearly right. [pause] That's the worst thing you could have done. | unchanged |
| | | | *a pause* | |
| 8 | `baute_m_2` | baute | Mira. The light doesn't point the sea, Vasco. It just opens the door. | unchanged |
| 9 | `baute_m_2b` | baute | I'll point it. I've waited thirty years to point it. It'll come where it's called. | unchanged |
| 10 | `alan_m_1` | alan | It won't. | unchanged |
| | | | *a pause: Baute looks at Alan, properly, for the first time* | |
| 11 | `alan_m_1b` | alan | It doesn't come where it's called. It goes where it wants, and it takes whatever's in its way. | unchanged |
| 12 | `alan_m_1c` | alan | A man in Lisbon tried to point it, eight months ago. Vicente Lacerda. He had a reason too. A very good one. He'd lost someone he loved. | unchanged |
| 13 | `alan_m_1d` | alan | When it came, it took him. It took half the people on the shore. It had me too, and it let me go, because of whose blood I've got. [pause] I don't think it'll do that twice. | unchanged |
| 14 | `alan_m_1e` | alan | It doesn't listen, Dr. Baute. It's not a weapon. It's not even angry. It's just the sea. | unchanged |
| | | | *a deep sound; the water comes up in the hole* | |
| 15 | `yeray_m_rung` | yeray | Doctor! The hole. [pause] It came up a whole rung. Just like that. | unchanged |
| 16 | `narr_mon_wait` | narr | The morning went over them. Every half hour the water climbed another rung of the rope ladder. | unchanged |
| | | | *the clock to twelve; the column comes down and goes back up the shaft at a slant (drawn)* | |
| 17 | `vasco_m_twenty` | vasco | Look. Up the shaft, at a slant. [pause] He's sending the sun back. Without him the moon's no one's. And the sea's no one's. | unchanged |
| 18 | `vasco_m_climb` | vasco | It'll climb. When it reaches the sky, at five past two, the door opens. [pause] Alan. The discs. | unchanged |
| 19 | `carmen_m_five` | carmen | Five. Mira, there are only five. We need six. | unchanged |
| 20 | `alan_m_disc` | alan | The sixth disc's in his hands. [pause] And they've just closed on it. Tighter. | **new** |
| 21 | `vasco_m_halves` | vasco | I'll stay up here, at the rim. The wall can only be read from up here. I'll read it to you. | unchanged |
| 22 | `vasco_m_who` | vasco | And someone has to go down. Into the water, at the door, and set them while it rises. [pause] You said it on the rock. I hated it then. I hate it now. | unchanged |

### Monday, after the lock: Yeray's fuse (talk to Yeray)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `yeray_m_fuse` | yeray | The radio fuse. Dr. Baute told me to take it, Saturday. I've had it the whole time. [pause] Lo siento. Call whoever you have to call. | unchanged |
| | | | *Alan takes it (pose)* | |
| 2 | `alan_m_fuse` | alan | Thank you, Yeray. You came back down with bread and a pick. That counts. | unchanged |

### The confession (talk to Vasco)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *choices (the first two once each):* | |
| 1 | `alan_m_ask_hurt` | alan | Are you hurt? | unchanged |
| 2 | `vasco_m_hurt` | vasco | I've got a lump on my forehead the size of a quail's egg, from the doorway of this cave, and I can't remember getting it. | unchanged |
| 3 | `vasco_m_hurt_2` | vasco | [pause] I'm all right. You held on. I held on. | unchanged |
| 4 | `alan_m_ask_monte` | alan | The map. I thought it was Montesdeoca. | unchanged |
| 5 | `vasco_m_monte` | vasco | He ran the bulldozers in sixty-six. Over Rayco's grandmother's dead. He's guilty of that. Not of this. [pause] Most people are guilty of something. Not usually of the thing you're looking for. | unchanged |
| 6 | `alan_m_later` | alan | Nothing. Later. | unchanged |
| 7 | `vasco_m_later` | vasco | Later is when things go wrong with us. You know that. | unchanged |
| 8 | `alan_m_later_2` | alan | Later. [pause] I can hear myself saying it. I hate the sound of it. | **new** |
| 9 | `alan_m_confess` | alan | Vasco. I have to tell you something. Before you ask. | unchanged |
| | | | *Vasco turns to him; a pause* | |
| 10 | `alan_m_confess_1` | alan | On Friday night, after you left, I went out. To a bar in Vegueta. Rafa's bar. I drank too much rum. | unchanged |
| 11 | `alan_m_confess_1b` | alan | And I met someone. The barman. Rafa. And I slept with him. | unchanged |
| 12 | `alan_m_confess_1c` | alan | He asked me if there was someone. Straight out. And I said no. [pause] I said it twice. | unchanged |
| | | | *choice: how* | |

#### Plainly

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_m_plain` | alan | I broke both of them. Both your rules. I didn't tell you first. And I did it on purpose. | unchanged |
| 2 | `alan_m_plain_2` | alan | Because we'd had a fight. Because you'd left. Because I was angry and frightened and I wanted, for one night, to be somebody with nothing to lose. | unchanged |
| 3 | `alan_m_plain_3` | alan | And then I lied to him about you. And I would have lied to you about him. On Saturday morning I was already working out how. | unchanged |
| 4 | `alan_m_plain_4` | alan | That's all of it. I won't say I was drunk. I won't say it meant nothing. [pause] It didn't. I'm not lying about that either. | **new** |
| | | | *a very long look* | |
| 5 | `vasco_m_plain_1` | vasco | Yeray told me. On Saturday morning, at the camp. He said there was a Portuguese guy at Rafa's bar on Friday night. | unchanged |
| 6 | `vasco_m_knew_2` | vasco | Funny. Sad underneath. Like a man at his own party who doesn't know why he came. | unchanged |
| 7 | `vasco_m_knew_3` | vasco | I told myself it couldn't be you. There are a great many Portuguese men in Las Palmas. I lay in that vault all night and told myself that, over and over. | unchanged |
| 8 | `vasco_m_knew_4` | vasco | [pause] And I knew. Of course I knew. | unchanged |
| 9 | `vasco_m_knew_5` | vasco | Then you came down the steps into the water to get me. And I thought: if he tells me, he'll tell me before I ask. And if he doesn't, he'll wait until I do. | unchanged |
| 10 | `vasco_m_didnt_wait` | vasco | You didn't wait. | unchanged |
| 11 | `alan_m_no` | alan | No. | unchanged |
| | | | *a pause* | |
| 12 | `vasco_m_first` | vasco | [pause] Thank you for telling me first. | unchanged |

#### With excuses

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_m_excuses` | alan | You'd left. I was drunk. I thought we were over. I thought you'd gone. | unchanged |
| 2 | `alan_m_excuses_2` | alan | You'd walked out. It was the solstice. I'd had five rums. I was trying not to think, and I'm very good at that. | unchanged |
| | | | *Vasco says nothing for a long time* | |
| 3 | `vasco_m_excuses_1` | vasco | [pause] I know I left. I know about the rum. [pause] That's not the bit that hurts. | unchanged |
| | | | *then the same five (vasco_m_plain_1 … vasco_m_knew_5); a pause; vasco_m_first* | |

#### Blaming himself

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `alan_m_blame` | alan | And it's all my fault. Everything. The desk, the fight, the bar. I'm a disaster. I don't deserve you. You should go. | unchanged |
| 2 | `alan_m_blame_2` | alan | I'm the worst thing that's ever happened to you. Worse than the Church. Worse than Rome. | unchanged |
| 3 | `vasco_m_blame_1` | vasco | Stop. [pause] Don't make it so big that I have to comfort you. That's another kind of door, Alan. Stay in the room. | unchanged |
| | | | *then the same five; vasco_m_didnt_wait, alan_m_no; a pause; vasco_m_first* | |

#### Then, whichever way

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *a long pause: he doesn't move away* | |
| 1 | `vasco_m_trowel_1` | vasco | Lorenzo gave me this. In Rome, on my twenty-seventh birthday. He said: 'For the day you find something worth keeping.' | unchanged |
| 2 | `vasco_m_trowel_1b` | vasco | I kept it twelve years. Through the whole of the Church. I used it in the vault to write on the wall, and to dig my way out, and I broke it. | unchanged |
| 3 | `vasco_m_trowel_1c` | vasco | [pause] I don't need it any more. | unchanged |
| 4 | `vasco_m_trowel_2` | vasco | For the day you find something worth keeping. [pause] Keep it. | unchanged |
| | | | *Alan takes it (pose); the trowel in his pockets* | |
| 5 | `alan_m_trowel` | alan | [pause] I'll keep it. | unchanged |
| 6 | `alan_m_trowel_2` | alan | Warm, from his pocket. [pause] I keep my hand on it. | **new** |
| 7 | `vasco_m_after` | vasco | Go and help Carmen with the radio. I need a minute with the sun. | unchanged |
| 8 | `vasco_m_after_trowel` | vasco | The Guardia, then the road down. Then we'll see. | unchanged |

### The radio: the Guardia (the fuse into the camp radio)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *a click* | |
| 1 | `alan_m_fuse_in` | alan | The fuse in. A crackle, a hiss, and a voice from Artenara saying 'Diga'. | unchanged |
| 2 | `carmen_m_radio` | carmen | Give me that. [pause] Guardia Civil, Artenara. This is Dr. Carmen Trujillo, at Risco Caído. I have a man here who wants to turn himself in. [pause] No, I'm not joking. When do I joke? | unchanged |
| | | | *a long pause: she talks to the sergeant, low* | |
| 3 | `carmen_m_guardia` | carmen | Mi primo. The sergeant, the one who gave me the photographs. [pause] They'll be here in an hour, from Artenara. I told them Rayco would be waiting. | **changed** |

### The ending: on the rock

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *Carmen walks over to Rayco* | |
| 1 | `carmen_m_tell_rayco` | carmen | They'll be here in an hour, Rayco. I told them you'd be waiting. | unchanged |
| 2 | `baute_m_wait` | baute | [pause] I'll wait. | unchanged |
| 3 | `carmen_m_ride` | carmen | I'll come down with you. In the car. I'm not letting you go down that road on your own. | unchanged |
| 4 | `baute_m_elena` | baute | Carmen. [pause] Elena... | unchanged |
| 5 | `carmen_m_notnow` | carmen | I know. I know, Rayco. Not now. There'll be time for that. | unchanged |
| 6 | `carmen_m_visit` | carmen | I'll visit. I'll bring you cigarettes. I'll shout at you through the glass. Every week, for as long as it takes. | unchanged |
| 7 | `carmen_m_right` | carmen | You were right about Tasarte. You were right about all of it. Somebody has to keep saying it. Properly. In a way that doesn't drown anyone. | unchanged |
| 8 | `carmen_m_me` | carmen | [pause] Looks like it's going to have to be me. | unchanged |
| | | | *two matches: one for him, one for her; a pause* | |
| | | | *the keys (heard), thrown; Alan catches them (pose)* | |
| 9 | `carmen_m_keys` | carmen | Bring it back to the flat. Calle Perdomo, above the farmacia. Fill the radiator at the bottom of the hill. | unchanged |
| 10 | `carmen_m_keys_2` | carmen | It doesn't have a left wing mirror any more. Don't let it see you hating it. | unchanged |
| 11 | `narr_end_guardia` | narr | The Guardia came at four, in a Land Rover older than Carmen's: two young officers who looked at Baute as if sent to arrest a mountain. | unchanged |
| | | | *Rayco walks to Vasco* | |
| 12 | `baute_m_director` | baute | You'll make a fine director one day, Vasco. Of something. [pause] Don't let them put you in a museo. | unchanged |
| | | | *Rayco, Carmen and Yeray walk out of the cave* | |
| 13 | `alan_end_alone` | alan | And then it's just the two of us. On a mountain. With a Land Rover that's lost a wing mirror. | **new** |

### still_road_down (the hand on the gearstick is painted)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_end_plain` | narr | It wasn't forgiveness. Neither of them pretended it was. But the hand stayed. | unchanged |
| 2 | `narr_end_excuses` | narr | It wasn't forgiveness. It was careful, and quiet, and it was a start. | unchanged |
| 3 | `alan_end_ask` | alan | Vasco. Are we... I mean, after this. Are we going to be... | unchanged |
| 4 | `vasco_end_last` | vasco | [pause] Ask me again in Santo Domingo. | unchanged |

### The hotel lobby

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_end_city` | narr | Las Palmas was five hundred and eighteen years old that day. Nobody knew how nearly it hadn't been. | **changed** |
| 2 | `alan_end_nieves` | alan | Nieves looks at Vasco's blanket. Then at my clothes: rum, turpentine, a flooded granary, a flooded cave. | **new** |
| 3 | `alan_end_nieves_2` | alan | Her eyebrow goes up. All the way up. [pause] And then she smiles. I didn't know she could. | **new** |
| 4 | `nieves_end_1` | nieves | Welcome back, Dr. Teles. Señor Sanches. [pause] There are no messages. | unchanged |
| 5 | `nieves_end_2` | nieves | There is fresh café in the machine. I made it myself. [pause] It is still terrible. | unchanged |

### Las Canteras: Chano

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `chano_end_1` | chano | You found him. | unchanged |
| 2 | `alan_end_found` | alan | I found him. | unchanged |
| 3 | `chano_end_2` | chano | Up the montaña. | unchanged |
| 4 | `alan_end_mountain` | alan | Up the mountain. | unchanged |
| | | | *a pause: Chano nods, and leans over the counter* | |
| 5 | `chano_end_3` | chano | My cousin's husband's brother was out on his boat at sunrise this morning. Off Agaete. And he swears to God, on his mother's grave, he saw San Borondón. | unchanged |
| 6 | `chano_end_4` | chano | The island. The one that's only there sometimes. It came up out of the sea at sunrise, green, with trees on it, and mountains. Then el sol came up, and it was gone. | unchanged |
| 7 | `chano_end_5` | chano | Of course, he's a liar. Everybody knows he's a liar. [pause] But still. Strange day. | unchanged |
| 8 | `alan_end_strange` | alan | Strange day. | unchanged |

### still_fireworks (the two of them at the rail, hands together, painted)

| | id | speaker | line | status |
|---|---|---|---|---|
| | | | *a pause* | |
| 1 | `narr_end_fireworks_2` | narr | Below them, the ordinary sea came in and went out on the sand. | **changed** |

### still_love_2 (not in Discreet)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_love_2_warm` | narr | Not like Tuesday. Two men who knew what they had nearly lost, choosing, in the dark, not to lose it. | **changed** |
| 2 | `narr_love_2_quiet` | narr | Not like Tuesday. Too tired, too careful, nothing mended yet. Not forgiveness. A choice. | **changed** |

### The morning (the hotel room, Alan in bed, not shown)

| | id | speaker | line | status |
|---|---|---|---|---|
| 1 | `narr_end_morning` | narr | In the morning Vasco had already gone down to the lobby. On the bedside table, on Alan's side, a cup of coffee. | **changed** |
| 2 | `alan_end_coffee` | alan | From the machine in the lobby. [pause] It'll be terrible. | **new** |
| | | | *a pause; the cup (heard)* | |
| 3 | `narr_end_drank` | narr | Alan lay there and looked at it for a long time. Then he sat up, and reached for it, and drank it. | unchanged |
| | | | *the ending card* | |

## The changed lines, before and after

| id | was | now |
|---|---|---|
| `narr_v_camp_1` | Vasco Teles hasn't slept since Thursday. At seven on Saturday morning he's standing on the edge of a cliff above the clouds, trying very hard not to think about Alan. | Vasco hasn't slept since Thursday. Seven on Saturday morning, above the clouds, trying very hard not to think about Alan. |
| `vasco_v_02` | Most Portuguese men are sad. It's the national sport. | There are a great many Portuguese men in Las Palmas. [pause] Most of them are sad. It's the national sport. |
| `vasco_v_yeray_4` | [pause] I'm not thinking about Alan. | A Portuguese guy at Rafa's bar. Funny. Sad underneath. [pause] I'm not thinking about Alan. |
| `vasco_take_1` | Suárez. My predecessor. | Elena Suárez. My predecessor. Rayco said her name once, the first day, flat as a wall: an accident in December, on the mountain road. |
| `vasco_radio_fuse` | Empty. [pause] The fuse is gone. | Empty. [pause] The fuse is gone. [pause] Radios don't lose their fuses by themselves. |
| `narr_v_drug` | Three hundred metres down the road to Artenara, the road began to tilt. The pines leaned. The sky began to turn, slowly, like water going down a drain. | He got as far as the top of the road to Artenara. Then the road began to tilt. |
| `vasco_look_serpent` | And low, behind the last crate, worn almost away: a serpent, coiled tight on itself, its mouth open at the centre. | And low, behind the last crate, worn almost away: a serpent, coiled tight on itself, its mouth open at the centre. [pause] Seven coils. |
| `vasco_mark_a` | [pause] And underneath. A. | [pause] And underneath. A. [pause] A signature, or a message, or a prayer. I don't know which. |
| `vasco_wet_2` | So this is what Alan meant. | So this is what Alan meant. [pause] And I'm not angry with him. Not any more. |
| `narr_v8_pray` | Some time in the night, kneeling in the dark in the cold rising water, he did something he had not done since January, since the day he walked out of the Patriarchate with two suitcases and his grandmother's coffee pot. | Some time in the night, in the dark and the rising water, he prayed. For the first time since January. |
| `narr_cut_alan` | Fifty kilometres away and a thousand metres down, under the grey lid of the panza, in a hotel room on Las Canteras, Alan Sanches was lying on his side on the bed, in his clothes, staring at a telephone that did not ring. | Fifty kilometres away and a thousand metres down, Alan lay on the hotel bed in his clothes, staring at a telephone that did not ring. |
| `carmen_m_guardia` | They'll be here in an hour. From Artenara. [pause] I told them Rayco would be waiting. | Mi primo. The sergeant, the one who gave me the photographs. [pause] They'll be here in an hour, from Artenara. I told them Rayco would be waiting. |
| `narr_end_city` | The city was having its birthday. Flags, brass bands, smoke from the food stalls, children with sparklers. Five hundred and eighteen years. Nobody knew how nearly it hadn't had a five hundred and nineteenth. | Las Palmas was five hundred and eighteen years old that day. Nobody knew how nearly it hadn't been. |
| `narr_end_fireworks_2` | Below them the sea came in and went out on the sand, quietly, harmlessly, the ordinary sea. After a while Vasco's hand found Alan's on the rail. | Below them, the ordinary sea came in and went out on the sand. |
| `narr_love_2_quiet` | It was not like Tuesday night. They were too tired and too careful, and nothing had been mended yet. It was quiet. It was slow. It wasn't forgiveness. It was a choice. | Not like Tuesday. Too tired, too careful, nothing mended yet. Not forgiveness. A choice. |
| `narr_love_2_warm` | It was not like Tuesday night. It wasn't easy, and it wasn't funny. It was two men who knew exactly what they had nearly lost, choosing, very deliberately, in the dark, not to lose it. | Not like Tuesday. Two men who knew what they had nearly lost, choosing, in the dark, not to lose it. |
| `narr_end_morning` | In the morning, when Alan woke, Vasco had already gone down to the lobby. The balcony doors were open, and the grey light of the panza lay over the room, the way it would every morning until July. | In the morning Vasco had already gone down to the lobby. On the bedside table, on Alan's side, a cup of coffee. |

## Narration cut (no longer played; left in `js/lines.js`, so `validate.mjs` lists them as unused)

| id | old narration | what does it now |
|---|---|---|
| `narr_v_camp_2` | The panza de burro lies under him like a frozen sea, flat and white to the horizon, filling the valleys, swallowing the coast. Far to the west, Teide stands up out of it like another island. | the painting (the cloud, Teide); vasco_look_cloud |
| `narr_v_camp_3` | And over it all, the sun. Blazing, enormous, with nothing between it and him. | the painting (the sun) |
| `narr_v_camp_4` | Down there, under the cloud, it's grey. Down there, Alan is asleep in a hotel room, or not asleep. Down there is the sea. | cut (Vasco walks to the edge; his own lines are about Alan) |
| `narr_v_camp_5` | The cloud doesn't answer. | a pause after "I'm not thinking about Alan." |
| `narr_v_yeray_1` | Yeray pours it into a tin mug and hands it over without meeting his eyes. They stand side by side at the edge of the camp and look at the cloud. | the coffee poured (sound); the mug (pose) |
| `narr_v_yeray_2` | Vasco doesn't move. | a pause |
| `narr_v_yeray_3` | There are a great many Portuguese men in the world. There are probably several in Las Palmas on any given night. | Vasco says it: vasco_v_02 ("There are a great many Portuguese men in Las Palmas…") |
| `narr_v_yeray_4` | Yeray laughs, briefly, and winces at the noise. Then he gathers himself, the way a man does before jumping into cold water. | a pause |
| `narr_v_yeray_5` | Yeray looks at him then, straight in the face, for the first time. The boy isn't hungover. He's frightened. | a pause; yeray_v_04 carries the fear |
| `narr_v_yeray_6` | Yeray throws the rest of his coffee out over the edge, in a brown arc that vanishes into the white. | the coffee thrown over the edge (sound), Yeray turns |
| `narr_v_yeray_7` | Vasco stands at the edge of the cliff with his tin mug. A Portuguese man in Rafa's bar. Funny. Sad underneath. | Vasco says it: vasco_v_yeray_4 ("A Portuguese guy at Rafa's bar. Funny. Sad underneath.") |
| `narr_v_charts_1` | Dr. Elena Suárez, the sacred-light specialist before him. Rayco mentioned her once, on the first day, with a strange flat look: an accident in December, on the mountain road. Then he changed the subject. | Vasco says it: vasco_take_1 (Rayco's flat look; an accident in December, on the mountain road) |
| `narr_v_charts_4` | In the margin, in a hand no longer small or patient, one word, underlined three times. Puerta. Door. | Vasco says it: vasco_take_4 ('Puerta.' Door.) |
| `narr_v_radio` | He looks at the little dead dial, and feels something like relief, and is ashamed of the relief. He doesn't touch it. | cut (vasco_look_radio: "Good. I don't want to talk to him either.") |
| `narr_v_fuse_1` | He switches it on. Nothing. Off, and on again. The dial stays dead: no hum, no light. | the switch clicks twice, nothing |
| `narr_v_fuse_2` | He kneels and opens the metal case. The neat rows of valves and wires, and the little glass holder where the fuse should be. | he kneels, the case opens (pose, sound); vasco_radio_fuse |
| `narr_v_fuse_3` | Radios do not lose their fuses by themselves. | Vasco says it: vasco_radio_fuse ("Radios don't lose their fuses by themselves.") |
| `narr_v_fuse_4` | He thinks of Yeray's face, frightened. Of the steel marks round the empty sockets. Of Elena's second line, and the word in the margin. | Vasco says it: vasco_v_see_0 |
| `narr_v_fuse_5` | Of Rayco's face on the first day, flat and strange: an accident in December, on the mountain road. | Vasco says it: vasco_v_see_0 (Rayco's face; the accident in December) |
| `narr_v_r_1` | The dial glows. A hum. He turns it to the museum's channel, nine, and presses the button, and has no idea how long he has. | Vasco says it: vasco_r_on (it hums; channel nine; how long) |
| `narr_v_r_2` | The foil flares and goes black. A thread of smoke. The dial dies. | the foil burning (sound), a pause |
| `narr_v_shadow` | A shadow falls across the radio. | Rayco walks in behind him |
| `narr_v_baute_1` | Rayco Baute stands at the edge of the camp in his shirtsleeves and his faded field hat, against the blue sky and the white sea of cloud, a thermos in one hand and two tin mugs in the other. | Rayco on screen with the thermos; vasco_look_baute |
| `narr_v_baute_2` | He's smiling at Vasco with enormous affection, and enormous sadness, the way a father smiles at a son who has just found out something about him. | cut |
| `narr_v8_rock_1` | They sat on a flat rock at the edge of the camp, with the sea of cloud spread out below them to the end of the world. Rayco poured two cups from his thermos, and his hand was perfectly steady. | they sit (pose); the thermos cup (sound) |
| `narr_v8_rock_2` | It was very good coffee, black and strong, with something in it, cinnamon perhaps, and a bitterness underneath. Vasco hadn't eaten since Friday. He drank it without thinking, all of it, the way you drink water. | Vasco says it: vasco_v8_coffee (cinnamon, something bitter; nothing eaten since Friday: the clue to the drugging) |
| `narr_v8_rock_3` | Rayco didn't deny it. He looked, if anything, relieved, the way a man looks when a doctor finally says the word he has been waiting for. Below them, a single hawk was circling over the white. | a pause |
| `narr_v8_pendant` | He touched the little clay seal at his throat. | cut |
| `narr_v8_tears` | He looked at Vasco, and his dark eyes were full of tears, and completely steady. | cut |
| `narr_v8_think` | Vasco thought of Alan in the grey light on Friday morning, saying: the sea is coming up the steps. He thought of a fisherman drowned in his bed in La Isleta, a long way from any concrete. | Vasco says it: vasco_v8_fisherman (the fisherman drowned in his bed, nowhere near any concrete) |
| `narr_v8_edge` | Vasco stood up and walked to the edge of the rock, because he couldn't look at Rayco's face any more. | Vasco walks to the edge, his back to Rayco |
| `narr_v8_old` | The silence went on so long that he turned round. Rayco was sitting with his hands between his knees, looking at the ground. He looked suddenly very old. | a long pause; Vasco turns round |
| `narr_v8_hawk` | They looked at each other. The hawk had gone. The cloud lay under them, perfectly white, perfectly still. | a pause |
| `narr_v8_keys` | The Land Rover's keys weren't in the ignition, where they were always left, or on the hook in the finds tent. Rayco had been down to the village this morning for more than supplies. Vasco started walking. | Vasco says it: vasco_v8_keys |
| `narr_v8_drug_2` | The coffee, he thought. Cinnamon, and something bitter under it. He sat down on the edge of the road, quite carefully, because his legs had decided for him. Footsteps behind him. Two sets. | narr_v_drug (shortened) and Vasco: vasco_v8_drug; he sits; Rayco and Yeray walk up behind him (footsteps) |
| `narr_v8_drug_3` | Vasco wanted to say: you hurt her. He didn't get as far as the words. | Vasco: vasco_v8_hurt ("You hurt… You hurt her…") |
| `narr_v8_wake` | He woke on stone steps in the dark, with a headache like an iron band and the taste of cinnamon. Above him, iron bars, and a shiny new brass padlock hanging from them like an earring on a corpse. | the cell (painted); Vasco: vasco_v8_wake (the padlock like an earring on a corpse) |
| `narr_v_silence` | Rayco flinched, as if he had been struck. His footsteps went back up the cleft, and Yeray's, slower, stopping once, and then going on. Then nothing. | the footsteps going back up the cleft (sound), a long pause |
| `narr_v8_torch` | He had a pocket torch, the kind you use for reading inscriptions in dark chapels, and the battery was not new. | Vasco says it: vasco_v8_torch (the battery isn't new: why the torch dims) |
| `narr_v8_coils` | He counted the coils without meaning to. Seven. He didn't say anything. He didn't know what to say. | Vasco says it: vasco_look_serpent ("Seven coils.") |
| `narr_v8_a` | He didn't know if it was a signature or a message or a prayer. Only that it was the most he could say, after Friday, and that he needed to say it somewhere. | Vasco says it: vasco_mark_a |
| `narr_v8_wet` | He knelt there with the salt on his tongue, and for the first time since Friday he wasn't angry with Alan at all. | Vasco says it: vasco_wet_2 ("I'm not angry with him. Not any more.") |
| `narr_v8_rusty` | The words felt rusty in his mouth, like a door that hasn't been opened in a long time. | a pause in the Pai nosso |
| `narr_v8_thighs` | The water lapped at his thighs. | the water (drawn) |
| `narr_prayer_1` | He thought of Alan. Alan on the promenade on Tuesday, white to the lips, saying sunburn. Alan caught behind a desk with his hand on a map, looking like a schoolboy and a thief. | Vasco prays it: vasco_v_prayer_1 |
| `narr_prayer_2` | Alan on Friday morning in the grey light, telling him everything, too fast, in the wrong order, too late. And Vasco not listening, because he was too frightened of what it meant. | Vasco prays it: vasco_v_prayer_2 |
| `narr_prayer_3` | Alan, who might be on a plane by tomorrow lunchtime, because Vasco had told him to go. Or who might not. | Vasco prays it: vasco_v_prayer_3 |
| `narr_v8_smile` | He was smiling, though there was no one to see it. | cut (in the dark; no one to see it) |
| `narr_mon_baute` | Rayco Baute looked back at them, quite calmly, from his camp stool. A black glass disc lay in his cracked hands. | the room (Baute on his stool, the disc in his hands); a pause |
| `narr_mon_smile` | Baute smiled at him, very gently, the way you smile at a child who has had a bad dream. | a pause |
| `narr_mon_alan` | Baute looked at him then, for the first time, properly. The bookseller. The boyfriend. The man caught behind his desk with his hand on a map. | a pause before Alan goes on |
| `narr_mon_tighter` | Alan looked at the disc in Baute's hands. Baute looked down at it, and his hands closed on it, tighter. | Alan says it: alan_m_disc |
| `narr_m_fuse_twist` | Yeray took it out of the pocket of his shorts, wrapped in a twist of paper, and held it out without a word. | yeray_m_fuse; Alan takes it (pose) |
| `narr_m_later` | Alan looked at the cloud. Later. He could hear himself saying it, and he hated the sound. | Alan says it: alan_m_later_2 |
| `narr_m_turned` | Vasco turned and looked at him. And Alan told him, before he could say what is it, or not now, or anything at all. Plainly, in the sun, with the others near enough to hear and none of them looking. | Vasco turns to him; a pause |
| `narr_m_all` | He stopped. That was all of it. He didn't say I was drunk. He didn't say it meant nothing, because it hadn't meant nothing, and he wasn't going to lie about that either. | Alan says it: alan_m_plain_4 (the plain telling only, as before) |
| `narr_m_hawk` | Vasco looked at him for a very long time. Above them a hawk was turning, very high, in the blue. The cigarette in Carmen's fingers burned down, unsmoked. | a very long pause |
| `narr_m_watch` | Vasco looked down at his hands. He didn't say it's all right. He didn't say I forgive you. Vasco wasn't a man who said things he didn't mean yet. | a pause before vasco_m_first |
| `narr_m_silence` | Vasco said nothing for a long time. Above them a hawk was turning, very high, in the blue. The sun climbed a finger's width over the cloud. | a long pause (the excuses telling) |
| `narr_m_stay` | And he didn't move away. They stood side by side on the rock in the sun, a hand's breadth apart, as if something held under the surface for a very long time had been let go, and had drawn back, and was gone. | a long pause |
| `narr_m_pocket` | After a while Vasco reached into his shirt pocket and held something out to Alan on his palm. A small silver trowel, with a worn black handle and half a blade. | Vasco holds it out with his lines (vasco_m_trowel_1…); the trowel to the inventory |
| `narr_m_warm` | It was warm from Vasco's pocket. Alan closed his hand round it and put it in his own, and his hand stayed on it there, through the wet cloth, for a long time. | Alan says it: alan_m_trowel_2 |
| `narr_m_radio` | The radio hummed. The dial lit up. Carmen came up behind Alan, took the handset out of his hand, and turned her back on everyone. | cut (carmen_m_radio opens "Give me that.") |
| `narr_m_cousin` | The someone at the Guardia Civil turned out, after some confusion, to be her cousin, the sergeant, the one who had given her the photographs in January. She talked to him for a long time, in a low voice. | Carmen says it: carmen_m_guardia ("Mi primo. The sergeant…"); a long pause |
| `narr_end_rock` | Carmen went over to Rayco, who was still sitting on the rock with his hat in his hands, and stood looking down at him. Her old teacher. | Carmen walks over to Rayco |
| `narr_end_smoke` | She lit a cigarette and gave it to him, and lit another for herself, and they sat side by side on the rock and smoked, and looked at the sea of cloud, and didn't say anything else. | two matches (sound), a pause |
| `narr_end_keys` | After a while Carmen took the Land Rover's keys off their carabiner and threw them over her shoulder without looking. Alan caught them. | the keys (sound); Alan catches them (pose) |
| `narr_end_handshake` | He went with them quietly. At the door of the car he shook Vasco's hand, and held it, and didn't let go for a long moment. | Rayco walks to Vasco; baute_m_director |
| `narr_end_away` | Carmen got in beside him, and Yeray got in the front, and the white Land Rover went away down the dirt road towards Artenara in a cloud of red dust. And Alan and Vasco were alone on the mountain. | Rayco, Carmen and Yeray walk out; Alan: alan_end_alone |
| `narr_end_road` | They drove down in the afternoon. Alan drove. The Land Rover started on the third try, and boiled once at the top of the first hill, and Vasco swore at it in Portuguese until it stopped. | still_road_down shows it |
| `narr_end_cloud` | Then they went down into the cloud. It was only cloud. Grey and cool, ten minutes of it, the wipers going, smelling of pine and wet earth. There was no salt in it at all. | still_road_down |
| `vasco_end_hand` | At the bottom of the cloud, where the grey city began to show through, Alan changed gear for the next bend, and Vasco reached over and put his hand on Alan's, on the gearstick. And left it there. | still_road_down (the hand on the gearstick is painted) |
| `narr_end_promise` | Alan didn't say anything for a long time. Then, because he had promised himself he would never again not say a thing because he was afraid of the answer, he said it. | alan_end_ask carries it |
| `narr_end_window` | Vasco looked out at the grey city coming up to meet them, at the long curve of Las Canteras, and the sea, and beyond it, very far away, along the old sail route from Lisbon to the Americas, the next island. | still_road_down (the city and the sea through the windscreen) |
| `narr_end_gearstick` | And his hand stayed on Alan's on the gearstick, all the way down. | still_road_down |
| `narr_end_nieves` | Nieves was behind the desk when they came in. She looked at Vasco's forehead, and the blanket he was still wearing, and at Alan's clothes, which had been through rum and turpentine and a flooded granary and a flooded cave. | Alan says it: alan_end_nieves |
| `narr_end_eyebrow` | Her eyebrow went up. All the way up. As far as it would go. And then she smiled. Alan had never seen her smile. It transformed her entirely. | Alan says it: alan_end_nieves_2 |
| `narr_end_chano` | Chano was at his kiosk on the corner, selling the last of the fireworks, and he waved a box of rockets at them as they came out onto the promenade at dusk. | cut (Chano at his kiosk; chano_end_1) |
| `narr_end_chano_nod` | Chano nodded, satisfied, as if this were exactly what he had predicted all along. Then he leaned over the counter and lowered his voice. | a pause |
| `narr_end_fireworks` | They watched the fireworks from the balcony of the hotel room: gold and red and green and white, bursting under the grey lid of the panza, so that the whole cloud lit up from underneath like a lampshade. | still_fireworks shows it |
| `narr_love_2_after` | Afterwards Vasco didn't fall asleep at once, the way he usually did. He lay with his head on Alan's chest, and they listened to the sea together until the grey light came. | cut (the morning line follows) |
| `narr_end_lift` | The ceiling fan went round. Down the corridor, the lift sneezed. | cut |
| `narr_end_coffee` | And on the bedside table, on Alan's side of the bed, there was a cup of coffee. From the machine in the lobby. It would be terrible. | narr_end_morning (shortened) and Alan: alan_end_coffee ("It'll be terrible.") |
