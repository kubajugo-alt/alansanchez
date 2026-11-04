# Saturday 22 June (Vasco), the mountain

From `js/story/vasco.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## S.startVasco

  *above the cloud, trying very hard not to think about Alan (the novel's opening of Chapter Seven); the painting is the*
- **Narrator**: Vasco hasn't slept since Thursday. Seven on Saturday morning, above the clouds, trying very hard not to think about Alan. `narr_v_camp_1`
- **Vasco**: Alan would make a joke about this. Something about heaven, and being overdressed for it. `vasco_v_wake`
- **Vasco**: I'm not thinking about Alan. `vasco_v_wake_2`
  *(the cloud doesn't answer)*

## room camp

> ================================================================ THE CAMP

- **Vasco**: Yeray, hungover, making coffee on a camping stove. He's twenty-four and looks like he's carried something heavy all night. *[if]* `vasco_look_yeray`
- **Vasco**: Rayco, in his shirtsleeves and his field hat, with a thermos. The way he's stood at the mouth of every cave I've seen him in. As if he owns the view. *[if]* `vasco_look_baute`
- **Alan**: Carmen, a torch in her hand and her sunglasses on her head at midnight. She hasn't lit a cigarette since the cloud. *[if]* `alan_look_carmen_camp`
- **Carmen**: The steps are past the finds table. Go. I'm right behind you. *[if]* `carmen_su_camp`
- **Vasco**: Cloud to the horizon, and Teide standing out of it. Somewhere under it, the hotel. [pause] Stop it. *[if]* `vasco_look_cloud`
- **Alan**: The sea of cloud by starlight, orange underneath where the city's burning its bonfires. *[if]* `alan_look_cloud_night`
- **Alan**: The sun on the sea of cloud. The most beautiful thing I've ever seen, and I can't look at it for long. I have work. *[if]* `alan_look_cloud_mon`
- **Vasco**: Yeray's stove. Yeray's terrible coffee. Yeray's empty cigarette packet. `vasco_look_stove`
- **Vasco**: I have what I need. More than I wanted. *[if]* `vasco_finds_again`
- **Vasco**: The expedition files, in grey boxes. At the back of the last one, my predecessor's papers, filed and forgotten. *[if]* `vasco_look_finds`
- **Alan**: The finds table under its tarpaulin. Labels, trays, a thermos. Baute's thermos. I'm not drinking anything up here. *[if]* `alan_look_finds_camp`
- **Vasco**: Not without Elena's charts. I'd only be guessing, and the cave deserves better. `vasco_need_charts`
  *the painting is a morning: Sunday night darkens it, Monday's sunrise warms it*
  *the radio or the poles, and the awning lifts and settles (a vertical billow on the cloth only)*
  *the awning in the wind*
  *the broom by the generator*
  *the grass on the path*
  *ravens over the cloud*
  *the painting is a morning: Sunday night darkens it, Monday's sunrise warms it*

## S.yerayCoffee

> Yeray at the stove: the terrible coffee, the Portuguese guy at Rafa's bar ("Sad, though"), and the discs that aren't going to Las Palmas. Then he walks off towards the tents before Vasco can ask.

- **Yeray**: Ask Dr. Baute. Please. Not me. `yeray_v_05`
- **Yeray**: Morning, doctor. Coffee? It's terrible. `yeray_v_01`
- **Vasco**: Then yes. `vasco_v_01`
- **Yeray**: I was in Vegueta last night. At Rafa's bar. You know it? Behind the cathedral. `yeray_v_02`
- **Vasco**: No. `vasco_v_yeray_1`
- **Yeray**: You should go. Everyone goes. [pause] There was a Portuguese guy there. `yeray_v_02b`
  *(Vasco doesn't move)*
- **Yeray**: Funny. Making Rafa laugh. Making everyone laugh. `yeray_v_02c`
- **Yeray**: Sad, though. Underneath. Like a man at his own fiesta who doesn't know why he came. `yeray_v_02d`
- **Vasco**: There are a great many Portuguese men in Las Palmas. [pause] Most of them are sad. It's the national sport. `vasco_v_02`
- **Yeray**: Doctor. [pause] The discs. `yeray_v_03`
- **Vasco**: Yes? `vasco_v_yeray_2`
- **Yeray**: Dr. Baute says they're going down to Las Palmas. To the museo. For conservation. `yeray_v_03b`
- **Vasco**: Yes. I signed the sheets. `vasco_v_03`
- **Yeray**: They're not going to Las Palmas. `yeray_v_04`
- **Vasco**: What do you mean? `vasco_v_yeray_3`
  *he throws the rest of his coffee over the edge, into the cloud*
- **Yeray**: Forget it. I'm hungover. I talk rubbish. `yeray_v_04b`
- **Yeray**: Ask Dr. Baute. Please. Not me. `yeray_v_05`
- **Vasco**: A Portuguese guy at Rafa's bar. Funny. Sad underneath. [pause] I'm not thinking about Alan. `vasco_v_yeray_4`

## S.takeCharts

> the expedition files: Elena Suárez's charts of the sockets, and on the last one the sun disc in pencil, and a word

- **Alan**: The finds table under its tarpaulin. Labels, trays, a thermos. Baute's thermos. I'm not drinking anything up here. `alan_look_finds_camp`
- **Vasco**: I have what I need. More than I wanted. `vasco_finds_again`
- **Vasco**: Elena Suárez. My predecessor. Rayco said her name once, the first day, flat as a wall: an accident in December, on the mountain road. `vasco_take_1`
- **Vasco**: Good hand. [pause] Better than mine. `vasco_take_2`
- **Vasco**: And the last sheet, only pencil. The sun disc on its own, tipped off the flat. A number. An hour. `vasco_take_3`
- **Vasco**: And in the margin, in a hand gone big and fast, one word. Underlined three times. [pause] 'Puerta.' Door. `vasco_take_4`
- **Vasco**: Her charts, my chalk and my notebook. A day's work. `vasco_take_charts`

## S.lookRadio

- **Alan**: The radio's alive. The Guardia are coming. Everything's coming. *[if]* `alan_radio_mon`
- **Alan**: The camp radio. No fuse. Dead as a door. *[if]* `alan_radio_dead`
- **Alan**: The camp radio. No fuse. Dead as a door. `alan_radio_dead`
  *the morning: he could call the museum, and the museum the hotel. And say what?*
- **Vasco**: Off. Leave it off. `vasco_look_radio_again`
- **Vasco**: I could call the museum. The museum could call the hotel. In ten minutes I could be hearing his voice. `vasco_look_radio_1`
- **Vasco**: [pause] And say what? `vasco_look_radio_2`
- **Vasco**: Off. [pause] Good. I don't want to talk to him either. `vasco_look_radio`
  *after the cave: dead, and the fuse gone. Then a shadow across the radio: Rayco, with a thermos and two mugs*
- **Vasco**: Empty. [pause] The fuse is gone. [pause] Radios don't lose their fuses by themselves. `vasco_radio_fuse`
- **Vasco**: Yeray, frightened. The marks round the empty sockets. Elena's word in the margin. And Rayco's face: an accident in December, on the mountain road. `vasco_v_see_0`
- **Vasco**: I haven't wanted to see this. I've walked past it every day for a week, because I didn't want to see it. `vasco_v_see`
- **Vasco**: No fuse. No radio. No one. `vasco_radio_fuse_2`

## S.foilRadio

> (2026-10-30) the foil from Yeray's packet as a fuse: a few seconds on the air, the message Don Lolo heard (puzzles.js); then the foil burns through, and Rayco's shadow falls across the radio

- **Vasco**: Silver paper. In the right hands, a fuse. In mine, a fire. `vasco_look_foil`
- **Vasco**: Folded twice. Into the holder. [pause] God forgive me, Lorenzo, I'm doing electrics. `vasco_r_foil_1`
- **Vasco**: It hums. [pause] Channel nine, the museum's. God knows how long I've got. `vasco_r_on`
- **Vasco**: Risco Caído. If anyone hears this, tell Alan Sanches at the Hotel Cristina. It isn't the van. The discs aren't going to the lab, they're going down, under— `vasco_r_send`
  *the foil flares and burns through; the dial dies*
- **Vasco**: [pause] 'Under.' Well done, Vasco. A whole sentence about where, and you stopped at the only word that mattered. `vasco_r_after`
  *Rayco comes along the path behind him, with a thermos and two mugs*
- **Baute**: You've solved it. I knew you would. `baute_v_01`
- **Baute**: That radio's been dead since Thursday. Yeray is hopeless with fuses. `baute_v_heard`
- **Baute**: Café? Mine's better than Yeray's. `baute_v_01b`
  *socket i holds FLOOR[i] and lights triangle 6 - i*
  *(the disc sprites, from discs.json)*

## room cave6

- **Alan**: Vasco on his knees at the rim, grey with tiredness, Elena's charts sodden in one hand and his notebook in the other. His legs are shaking. His voice isn't. *[if]* `alan_look_vasco_cave`
- **Alan**: Carmen, in her rust-coloured shirt, watching the light in the roof go from grey to white. *[if]* `alan_look_carmen_mirror`
- **Alan**: Yeray, at the back, very pale. He'll be all right. He doesn't know that yet. *[if]* `alan_look_yeray_cave`
- **Alan**: Baute on his camp stool, the sixth disc in his cracked hands, very calm. The pendant at his throat. *[if]* `alan_look_baute_cave`
- **Vasco**: The great triangle at the back of the cave. The biggest arrow of all, pointing at the floor. *[if]* `vasco_look_great`
- **Alan**: The great triangle. Point down. At the floor. At the door. *[if]* `alan_look_great`
- **Vasco**: Fertility symbols, the textbooks say. [pause] They're arrows. Every one of them points down. *[if]* `vasco_look_triangles`
- **Alan**: Arrows. All pointing down. Into the floor. At the door. *[if]* `alan_look_triangles`
- **Alan**: Arrows. All pointing down. Into the floor. At the door. `alan_look_triangles`
- **Vasco**: One small hole, straight up through the rock to the top of the cliff. A shaft. The sun only looks down it at noon. *[if]* `vasco_look_opening`
- **Alan**: Photographs of a cave: a dome, engraved triangles, a column of light coming down from the roof. Cave 6. *[if]* `alan_look_cave_photos`
- **Vasco**: A round hole in the floor, and a rope ladder going down into the dark. A cool breath coming up out of it. *[if]* `vasco_look_hole`
- **Alan**: A round hole in the floor, a rope ladder going down into it, and the sound of water breathing at the bottom. *[if]* `alan_look_hole`
- **Vasco**: Down there, with a torch that's dying? Not yet. Let the sun go down first. It does, every noon. *[if]* `vasco_ladder_dark`
- **Alan**: A round hole in the floor, a rope ladder going down into it, and the sound of water breathing at the bottom. `alan_look_hole`
- **Vasco**: A white crust low on the wall. [pause] Salt. A thousand metres above the sea. That isn't possible. `vasco_look_salt`
- **Vasco**: A flat rock by the mouth, worn smooth by nine hundred years of people sitting on it and waiting for the sun. *[if]* `vasco_look_rock`
  *the cloud below the arch rolling, dust in the sun through the arch*
  *Vasco's first time in today: he walks in under the triangles (the room shows the arch, the dome, the opening and*
  *the hole; he says what can't be seen from the door: the signs, and the scenes too fine to see without a torch)*
- **Narrator**: Vasco stands in the middle of the cave and feels, as he has every morning for eight days, his heart turn over. `narr_v_cave_5`
- **Vasco**: Seven triangles, every one pointing down. A sign over each, worn almost smooth. [pause] And round each one, something scratched too fine to see without a torch. `vasco_cave_in`

## room cave6_low

> ---------------------------------------------------------------- the chamber under it (lower)

  *the seven sockets, by the sign cut in front of each (floor order: the wall in a mirror)*
- **Vasco**: No. Not wrong. Turned round. As if the floor were the wall in a mirror. *[if]* `vasco_floor_2`
- **Vasco**: The same signs, cut in the floor, one by each socket. [pause] In the wrong order. The thin new moon at the right-hand end, not the left. *[if]* `vasco_floor_1`
- **Alan**: A sign cut in front of every socket. The same seven Vasco scratched on the wall of the granary, in the same order. *[if]* `alan_look_floor_signs`
- **Vasco**: The middle of the floor, under the hole. Damp. [pause] Nothing else in this cave is damp. *[if]* `vasco_look_low_door`
- **Alan**: I'm in it to my waist. It's cold. It's patient. It's very, very patient. *[if]* `alan_look_door_in`
- **Alan**: The middle of the floor, under the hole. Where every arrow on the wall upstairs points. The door. *[if]* `alan_look_door`
- **Vasco**: Suns, triangles, chequers, spirals. The clay seals, painted big. [pause] No story down here. The story's upstairs, round the triangles. *[if]* `vasco_look_low_walls`
- **Alan**: Red and white and black, painted all over: suns, triangles, spirals. Nothing that tells you anything. That's upstairs. *[if]* `alan_look_low_walls`
- **Vasco**: Through the hole, the wall upstairs, and the triangles on it, small as stamps. `vasco_look_low_opening`
- **Alan**: Vasco on his knees at the rim, grey with tiredness, Elena's charts sodden in one hand and his notebook in the other. His legs are shaking. His voice isn't. *[if]* `alan_look_vasco_cave`
- **Alan**: I'm in. I'm not getting out until it's shut. *[if]* `alan_m_in_already`
- **Alan**: I'm in. I'm not getting out until it's shut. *[if]* `alan_m_in_already`
- **Vasco**: Seven sockets, a sign cut by each. [pause] And only the sun left down here to throw the light back. *[if]* `vasco_low_in`

## S.lookSocket

- **Vasco**: Obsidian, polished to a mirror. I can see myself in it. I look like a man who hasn't slept. `vasco_look_disc`
- **Vasco**: Seven sockets in a row in the floor. Six empty. Only the sun's still in, in the middle. `vasco_look_sockets_1`
- **Vasco**: [pause] I never counted them, the first day. I was looking at the light. `vasco_look_sockets_2`
- **Vasco**: Fresh tool marks round the empty ones. Steel, not stone. Someone's been prying these out with a modern chisel. `vasco_look_sockets`
- **Vasco**: Fresh tool marks round the empty ones. Steel, not stone. Someone's been prying these out with a modern chisel. `vasco_look_sockets`
- **Alan**: The sun disc, flat in the middle. Where the women set it. *[if]* `alan_look_seventh_set`
- **Alan**: The sun disc, in the middle, tipped in its socket by Baute's hand. Wrong. *[if]* `alan_look_seventh`
- **Alan**: That one's back. Black glass in old stone. *[if]* `alan_socket_set`
- **Alan**: An empty socket, worn smooth by nine hundred summers. A sign cut in the floor in front of it. *[if]* `alan_socket_empty`

## S.useSocket

- **Vasco**: Fresh tool marks round the empty ones. Steel, not stone. Someone's been prying these out with a modern chisel. `vasco_look_sockets`

## S.chalkSigns

> ---------------------------------------------------------------- Saturday: reading the cave the chalk in the worn cuts over the triangles: the seven signs, as they stand on the wall

- **Alan**: Arrows. All pointing down. Into the floor. At the door. `alan_look_triangles`
- **Vasco**: I need something to mark it with. `vasco_need_chalk`
- **Vasco**: Seven signs, in my notebook, in the order they stand on the wall. `vasco_chalk_again`
  *he chalks the signs along the wall, left to right, and writes them down as they come up*
- **Vasco**: A moon. A thin one, growing. [pause] And the next: half a moon. Then nearly full. `vasco_chalk_1`
- **Vasco**: Over the great triangle, the sun, with his rays. Then the moon again, going the other way: nearly full, half, thin. [pause] Six moons and a sun. `vasco_chalk_2`
- **Vasco**: The moon pulls the sea. And the moon has no light of her own: every bit of it is his. [pause] They lit the moons with the sun. That's the leash. `vasco_chalk_3`

## S.readScenes

> the scenes round the triangles, by the torch raked across the wall: he knows them, and hasn't the words

- **Alan**: Arrows. All pointing down. Into the floor. At the door. `alan_look_triangles`
- **Vasco**: The signs first. Then the pictures. One thing at a time. `vasco_scenes_early`
- **Vasco**: Seven scenes, and no order to put them in. `vasco_scenes_again`
  *(the torch held flat to the wall)*
- **Vasco**: People. Round every triangle, scratched fine as hair. [pause] Round the sun, nobody: Magec, alone. Round the thin old moon at the end, the moon going down into the sea, and one woman standing in it. `vasco_scenes_1`
- **Vasco**: I know this. [pause] It's the grandmothers' romance. The women and the moons. The old women in Artenara say it at the fire, and they won't say it to me. `vasco_scenes_2`
- **Vasco**: That's the key. The order's in a song, and I don't have the words. `vasco_scenes_3`

## S.waitNoon

> the rock by the mouth: the morning goes by, and at four minutes past two (Canary summer time) the sun looks down

- **Vasco**: Noon. The sun's at the top of the sky. It won't stay there. `vasco_noon_again`
- **Vasco**: Now I wait. Up here the sun is two hours behind the clocks. It won't stand at the top of the sky till past two. `vasco_noon_wait`
  *the column comes down the shaft and one comes back up onto the great triangle: he gets up to look*
- **Vasco**: Down the shaft, through the floor, and back up. [pause] One lit, out of seven. The others have nothing down there to throw the light. `vasco_noon_1`

## S.sunTest

- **Vasco**: No. Once was enough. I felt something listen. `vasco_test_again`
  *he lifts the sun disc into the next socket: its column jumps across the wall; the water stirs; he puts it back*
- **Vasco**: It jumped across. [pause] The columns cross: right down here is left up there. That's why the floor is the wall in a mirror. `vasco_test_1`
- **Vasco**: They're keyed. Each disc has its word, and its place in the sentence. [pause] And something under the floor just moved. Back. Quickly. `vasco_test_2`

## S.understand

> Elena's last sheet against the floor: how to send the sun back (the angle, the hour), and, turned round, how to shut it. He swallows the corner with the numbers; what the cave is for; Alan; and out to the radio

- **Vasco**: Not yet. I don't know what she was looking at. The wall first, and the floor. `vasco_puerta_early`
- **Vasco**: I have what I need. More than I wanted. `vasco_finds_again`
  *her last sheet spread on the floor by the sun disc; he works her numbers through, and laughs*
- **Vasco**: Her last sheet. The sun disc, tipped four degrees thirty-six minutes, south. And in the margin, fourteen oh five. [pause] Square to the sun at the top of the day. Of course it is. `vasco_v_04`
- **Vasco**: A mirror square to the sun throws it straight back where it came from. [pause] She worked out how to send the sun back. Up the shaft, out of the cave. Take the sun out of the middle, and the moons have no one to obey. `vasco_puerta_1`
- **Vasco**: And turned round, it's how you shut it. Every disc in its own socket, the sun flat in the middle. At the same minute. `vasco_shut`
  *where the door is: the middle of the floor, under the hole, where the water stirred*
- **Vasco**: Puerta. [pause] A door. `vasco_v_door`
- **Narrator**: He tears the corner with her numbers off the sheet, folds it very small, and swallows it. `narr_v_angle_5`
- **Vasco**: The triangles. Arrows, every one, pointing down. At the rock, at the mountain. And under the mountain, a thousand metres down, at the sea. `vasco_v_arrows`
- **Vasco**: And at noon the light comes down, and the discs throw it up onto every triangle at once: a moon on each, and the sun in the middle. Someone reading a sentence aloud, every summer day, to keep it true. `vasco_v_read`
- **Vasco**: And every disc that comes out is a word gone missing. `vasco_v_read_2`
- **Vasco**: It isn't counting days. It isn't a calendar. [pause] It's holding something down. `vasco_v_05`
- **Vasco**: Every disc is a nail. [pause] And someone's pulling the nails out. `vasco_v_06`
- **Vasco**: Alan. `vasco_v_alan`
- **Narrator**: The mist on the promenade. The thing Alan told him on Friday morning, in the grey light, too fast and in the wrong order: the thing Vasco was too angry to hear. `narr_v_alan_2`
- **Narrator**: The sea coming up the steps. The old fisherman drowned in his bed. It's here. The thing from the cistern. It's here. `narr_v_alan_3`
- **Vasco**: And I said, you could have just asked me. [pause] I said, go home. `vasco_v_alan_2`
- **Vasco**: The radio. `vasco_v_radio`
  *out, up the rope ladder, fast*

## S.refusal

> ---------------------------------------------------------------- the refusal (choices change tone, not outcome) (the novel's Chapter Eight, rewritten 2026-10-30 with Sunday: the coffee with something in it; the thesis; Tasarte and the boy at the bottom of the hill; the number; Elena's disc; "It's very inconvenient")

  *to the drugging, and the fisherman are Vasco's to say)*
- **Baute**: Sit. Por favor. Sit with me a moment. The cloud is beautiful from here. `baute_v_coffee`
- **Vasco**: Cinnamon? [pause] And something bitter under it. [pause] I haven't eaten since Friday. `vasco_v8_coffee`
- **Baute**: You wrote in your thesis that a baptised bell is a voice the dead can hear. That when it rings, it isn't calling the living to church. `baute_v_02`
- **Baute**: It's telling the dead that someone still remembers them. [pause] I read it three times. I read it the week before I hired you. `baute_v8_02b`
- **Baute**: You were right. Whatever happens now. You were right about bells, and you were right about the light. `baute_v8_02c`
- **Baute**: This is ours. The priestesses made it. Every summer for five hundred years el sol has come through that hole and said the same prayer across the wall, and the sea has stayed down. `baute_v_03`
- **Vasco**: And you're taking the prayer apart. *[choice]* `vasco_v_07a`
- **Vasco**: Rayco. What's in the vault? *[choice]* `vasco_v_07b`
  *(Rayco doesn't deny it)*
- **Baute**: In 1966 I was twenty-six. A new degree from La Laguna and no power at all. Nada. A boy with a piece of paper. `baute_v_04`
- **Baute**: My grandmother's village was Tasarte, on the west coast. Above it there was a hill, and in the hill, caves, and in the caves, our dead. Five hundred years of them. `baute_v8_04b`
- **Baute**: My abuela used to take me up there and tell me their names. Not their real names. She made them up. So they'd have names. `baute_v8_04c`
- **Baute**: A company bought the hill for a hotel. I wrote letters. I sat in a corridor in Madrid for three days. And in August they sent in the bulldozers. `baute_v8_04d`
- **Baute**: They scraped the caves out like a pot. They put the bones in a skip. [pause] I picked some of them up off the road afterwards. I kept them in a cardboard box under my bed for a year. `baute_v8_04e`
- **Baute**: The site manager was a young man called Ignacio Montesdeoca. Very charming. He gave me a cigarette while I watched, and told me not to take it personally. `baute_v8_04f`
- **Baute**: Now he sponsors my dig. He shakes my hand at dinners. He bought the new display cases. [pause] He doesn't remember me. Why would he? I was a boy at the bottom of a hill. `baute_v8_04g`
- **Baute**: Thirty years of objections, Vasco. Every hotel, every golf course, every marina. I've lost every one. [pause] La isla has asked politely since 1483. Nobody has ever listened. `baute_v_05`
- **Baute**: I need one thing from you. Elena had it, and she's gone, and I'm a digger, not an astronomer. What to do with the last disc. `baute_v_06`
- **Baute**: So that on San Juan, at the top of the day, el sol goes back where it came from, and the door opens. And el mar takes back what was taken from it. The concrete. The hotels on our graves. Not the people. `baute_v8_06b`
- **Vasco**: A fisherman drowned in his bed in La Isleta, Rayco. Alan told me. Nowhere near any concrete. `vasco_v8_fisherman`
- **Vasco**: It doesn't take orders, Rayco. `vasco_v_08`
- **Baute**: Mine will. `baute_v_07`
  *he gets up and goes to the edge, because he can't look at Rayco's face any more*
- **Vasco**: Elena worked this out too. Didn't she. *[choice]* `vasco_v_09a`
- **Vasco**: Where's Dr. Suárez, Rayco? *[choice]* `vasco_v_09b`
  *(a long silence; he turns round)*
- **Baute**: I took out one disc. One. In December, on the night of the twentieth, after everyone was asleep. Just to see if it was true, what the old women said. `baute_v_08`
- **Baute**: She found the socket the next day. She went down the mountain that night to tell Carmen. She never got there. `baute_v8_08b`
- **Vasco**: You killed her. `vasco_v8_killed`
- **Baute**: I didn't touch her. I didn't touch her, Vasco. I was at the camp. I watched her lights go down the road. I went to bed. `baute_v_09`
- **Baute**: El mar came for her. Not me. That afternoon she read the cave right, for the first time, after a year of reading it wrong. And it knew. [pause] I didn't know it did that. That it watches. `baute_v8_09b`
- **Baute**: I know now. `baute_v8_09c`
- **Vasco**: You know now. Then you know what it will do to the rest of them. The people on the beaches. You know what's happening in Las Palmas every night, and you're still... `vasco_v_10`
- **Baute**: [pause] The number, Vasco. `baute_v_10`
- **Vasco**: No. `vasco_v_11`
- **Baute**: [pause] I thought you'd say that. You're a better man than me. It's very inconvenient. `baute_v_11`

## S.toVault

> down the road to Artenara on foot (the keys are gone); the road tilts; Yeray's "I'm sorry"; the grille

- **Vasco**: I'm going down to Las Palmas. Now. I'm going to tell Carmen, and the museum, and the Guardia Civil. [pause] And then I'm going to find Alan. `vasco_v_walk`
- **Baute**: I know. `baute_v_see`
- **Vasco**: The keys aren't in the Land Rover. Or on the hook. [pause] You've been down to the village. [pause] Then I'll walk. `vasco_v8_keys`
  *road; it tilts; he sits down; footsteps behind him, two sets: Rayco, and Yeray come back*
- **Narrator**: He got as far as the top of the road to Artenara. Then the road began to tilt. `narr_v_drug`
- **Vasco**: The coffee. [pause] Cinnamon, and something under it. [pause] Sit down, Vasco. Before your legs do it for you. `vasco_v8_drug`
- **Yeray**: I'm sorry, doctor. I'm sorry. Lo siento. `yeray_v8_sorry`
- **Baute**: It's only to make you sleep. Elena kept it in the camp for her back. You'll wake with a headache, that's all. [pause] I would never hurt you, Vasco. `baute_v8_sleep`
- **Vasco**: You hurt... [pause] You hurt her... `vasco_v8_hurt`
- **Vasco**: My head. [pause] Steps. Bars. And a brand-new brass padlock, like an earring on a corpse. `vasco_v8_wake`
- **Baute**: Mira. A Canario granary. Twelfth century, perhaps. Grain, cheese, figs. It's dry. It's always been dry. [pause] You'll be safe here. `baute_v8_granary`
- **Baute**: I'll come for you on Monday. After noon. After it's done. [pause] You have my word. `baute_v_12`
- **Vasco**: Your word's under a hotel, Rayco. `vasco_v_12`
  *Rayco's footsteps going back up the cleft, and Yeray's, slower; then nothing*
- **Vasco**: My torch. For reading inscriptions in dark chapels. [pause] And the battery isn't new. `vasco_v8_torch`

## room vault

  *(the grille torn out and down: a second painting)*
  *the grille doesn't block the exit"): Vasco is behind the bars, in the alcove the painting shows, until he's out*
- **Alan**: Vasco. His face tipped back against the bars, the water at his nose. His eyes are open. They're on me. *[if]* `alan_look_vasco_vault`
- **Alan**: Vasco, soaked, grey, alive. Breathing like it's a new hobby. *[if]* `alan_look_vasco_vault_2`
- **Alan**: Yeray. The boy from the bar. He came down with bread, and went back for a pick. *[if]* `alan_look_yeray_vault`
- **Alan**: Carmen, at the bottom of the steps, her torch on the grille. She came down that cleft sideways and didn't say a word. *[if]* `alan_look_carmen_vault`
  *(Saturday: the first look counts them, and thinks)*
- **Alan**: Five crates. In each, a black glass disc wrapped in cloth. The nails Baute pulled out. *[if]* `alan_look_crates`
- **Vasco**: The museum's crates. I signed the sheets: 'Conservation transfer.' [pause] An obsidian disc in each, in straw. The missing nails. All here. *[if]* `vasco_look_crates`
- **Vasco**: The museum's crates. I signed the sheets: 'Conservation transfer.' [pause] An obsidian disc in each, in straw. The missing nails. All here. *[if]* `vasco_look_crates`
- **Vasco**: Five here. The sun's still in the cave, and Rayco keeps the sixth on him. On Monday he'll tip the sun by guesswork. [pause] And he thinks he can't do it without me. *[if]* `vasco_look_crates_2`
- **Vasco**: With six nails out, close might be enough. [pause] Think. You have until Monday. Think. *[if]* `vasco_look_crates_3`
- **Alan**: Pick marks, old as anything. And low down, behind a crate, a coiled snake carved in the rock. Vasco looks at it and says nothing. So I say nothing. *[if]* `alan_look_walls`
- **Vasco**: Pick marks, and the serpent behind the last crate. I'll think about it later. If there's a later. *[if]* `vasco_look_walls_2`
- **Vasco**: The Church teaches you one thing: when you're frightened and alone in a dark stone room, you look at the walls. [pause] Pick marks. Nine hundred years old. *[if]* `vasco_look_walls`
- **Vasco**: And low, behind the last crate, worn almost away: a serpent, coiled tight on itself, its mouth open at the centre. [pause] Seven coils. *[if]* `vasco_look_serpent`
- **Vasco**: Nineteenth-century iron, new padlock. Rayco always did respect the original fabric. [pause] The top's in hard basalt. The bottom's leaded into the soft tuff of the threshold. The lead's gone to powder. *[if]* `vasco_look_grille`
- **Alan**: The grille, torn out and down on the stone. Three idiots and a pick. Four, counting Vasco, who did most of it. *[if]* `alan_look_grille_off`
- **Alan**: The grille. One bottom anchor gone, the other a centimetre from giving. Yeray's pick in the gap. *[if]* `alan_look_grille`
- **Vasco**: Nineteenth-century iron, new padlock. Rayco always did respect the original fabric. [pause] The top's in hard basalt. The bottom's leaded into the soft tuff of the threshold. The lead's gone to powder. `vasco_look_grille`
- **Vasco**: That one's out. *[if]* `vasco_anchor_out`
- **Vasco**: A bottom anchor of the grille, leaded into soft tuff. If both come out, the grille might swing out at the bottom on its chain. Like a cat flap. Alan would like that. *[if]* `vasco_look_anchor`
- **Vasco**: A centimetre. One centimetre of lead and no blade left. *[if]* `vasco_anchor_cm`
- **Vasco**: A bottom anchor of the grille, leaded into soft tuff. If both come out, the grille might swing out at the bottom on its chain. Like a cat flap. Alan would like that. *[if]* `vasco_look_anchor`
- **Vasco**: Seven signs and an A. [pause] The most I can say, after Friday. *[if]* `vasco_look_mark`
- **Alan**: Six moons and a sun. A. *[if]* `alan_look_mark`
- **Vasco**: Soft rock by the grille, at eye height. You could write on it with a trowel. *[if]* `vasco_look_wallbit`
- **Alan**: Six moons and a sun. A. `alan_look_mark`
- **Alan**: Not without Vasco. *[if]* `alan_vault_not_without`
- **Alan**: The discs. We'll need them. All of them. *[if]* `alan_vault_discs`
  *small moving details over the painting: the storm lantern, the torch by the grille, the light down the steps*
  *Sunday, Vasco still behind the bars: the water stands at his face (also when the room is reached from a save or a*
  *sheen, and its rings spread there)*
  *the bars); then the bars again over Vasco and the water (cut from the painting itself: so he's in the cell, not in*
  *front of it)*
  *the dark, and what the torch still shows*

## room vault_cell

> ================================================================ THE CELL (Saturday: the vault from inside) (the user, 2026-10-30: "for the inside ones, we need to paint a new room, in which Vasco sees the other room from a different perspective, from behind the bars"; "narrower... you'd see the crates only"): the alcove behind Sunday's grille; through the bars the crates, the lantern's light from the right, the stairs' grey daylight from the left

- **Vasco**: Nineteenth-century iron, new padlock. Rayco always did respect the original fabric. [pause] The top's in hard basalt. The bottom's leaded into the soft tuff of the threshold. The lead's gone to powder. `vasco_look_grille`
- **Vasco**: Nineteenth-century iron, new padlock. Rayco always did respect the original fabric. [pause] The top's in hard basalt. The bottom's leaded into the soft tuff of the threshold. The lead's gone to powder. `vasco_look_grille`
- **Vasco**: The museum's crates. I signed the sheets: 'Conservation transfer.' [pause] An obsidian disc in each, in straw. The missing nails. All here. *[if]* `vasco_look_crates`
- **Vasco**: The museum's crates. I signed the sheets: 'Conservation transfer.' [pause] An obsidian disc in each, in straw. The missing nails. All here. *[if]* `vasco_look_crates`
- **Vasco**: Five here. The sun's still in the cave, and Rayco keeps the sixth on him. On Monday he'll tip the sun by guesswork. [pause] And he thinks he can't do it without me. *[if]* `vasco_look_crates_2`
- **Vasco**: With six nails out, close might be enough. [pause] Think. You have until Monday. Think. *[if]* `vasco_look_crates_3`
- **Vasco**: Through the bars, a metre away. It might as well be Lisbon. `vasco_crates_reach`
- **Vasco**: Through the bars, a metre away. It might as well be Lisbon. `vasco_crates_reach`
- **Vasco**: Pick marks, and the serpent behind the last crate. I'll think about it later. If there's a later. *[if]* `vasco_look_walls_2`
- **Vasco**: The Church teaches you one thing: when you're frightened and alone in a dark stone room, you look at the walls. [pause] Pick marks. Nine hundred years old. *[if]* `vasco_look_walls`
- **Vasco**: And low, behind the last crate, worn almost away: a serpent, coiled tight on itself, its mouth open at the centre. [pause] Seven coils. *[if]* `vasco_look_serpent`
- **Vasco**: That one's out. *[if]* `vasco_anchor_out`
- **Vasco**: A bottom anchor of the grille, leaded into soft tuff. If both come out, the grille might swing out at the bottom on its chain. Like a cat flap. Alan would like that. *[if]* `vasco_look_anchor`
- **Vasco**: A centimetre. One centimetre of lead and no blade left. *[if]* `vasco_anchor_cm`
- **Vasco**: A bottom anchor of the grille, leaded into soft tuff. If both come out, the grille might swing out at the bottom on its chain. Like a cat flap. Alan would like that. *[if]* `vasco_look_anchor`
- **Vasco**: Seven signs and an A. [pause] The most I can say, after Friday. *[if]* `vasco_look_mark`
- **Vasco**: Soft rock by the grille, at eye height. You could write on it with a trowel. *[if]* `vasco_look_wallbit`
  *the lantern beyond the corner, the grey daylight from the stairs; the water in the cell (the whole floor is the*
  *cell: at the grille it stands like a wall and never passes); the torch failing*

## S.scratchMark

- **Alan**: Six moons and a sun. A. `alan_look_mark`
- **Vasco**: It's there. Whoever comes. `vasco_mark_done`
- **Vasco**: Dig first. Write if there's time. There's always time to write, my mother says. She means letters of complaint. `vasco_mark_early`
  *Lorenzo's trowel: "For the day you find something worth keeping"; the closing angle, for whoever comes; the A*
- **Vasco**: Lorenzo's trowel. 'L. a V. Roma.' My twenty-seventh birthday, a café in Trastevere, the dome going pink. `vasco_trowel_1`
- **Vasco**: 'For the day you find something worth keeping.' [pause] I thought I had. `vasco_trowel_2`
- **Vasco**: The seven signs, in the order they lie in the floor. Moon, moon, moon, the sun, moon, moon, moon. [pause] What opens it stays in my head. Only in my head. `vasco_mark_1_scratch`
- **Vasco**: [pause] And underneath. A. [pause] A signature, or a message, or a prayer. I don't know which. `vasco_mark_a`
  *his knees go wet: salt water, a thousand metres up, and rising; and for the first time since Friday he isn't angry*
- **Vasco**: My knees are wet. [pause] Salt. In a granary. A thousand metres up. `vasco_wet_1`
- **Vasco**: So this is what Alan meant. [pause] And I'm not angry with him. Not any more. `vasco_wet_2`
- **Vasco**: Elena read the cave right, and it came for her that same night. Today I read it right too. [pause] Ah. So it's me. `vasco_wet_3`
- **Vasco**: [pause] Torch off. Keep digging. `vasco_wet_4`

## S.dig

- **Vasco**: Not with my fingernails. Not yet. `vasco_dig_hands`
- **Vasco**: That one's out. `vasco_anchor_out`
- **Vasco**: Before I start on the other. Something on the wall, for whoever comes. In case. *[if]* `vasco_right_first_mark`
- **Vasco**: The left one first. One thing at a time. Lorenzo used to say I dig like I pray: in order. *[if]* `vasco_right_first`
- **Vasco**: A centimetre. One centimetre of lead and no blade left. `vasco_anchor_cm`
- **Vasco**: The lead crumbles. Slowly. Torch off. Save it. Dig by feel. `vasco_dig_1`
- **Vasco**: Nearly. A centimetre of lead and a lot of nerve. `vasco_dig_2`
- **Vasco**: Out. One anchor out. [pause] Before the other one, something for whoever comes. `vasco_dig_left_out`
- **Vasco**: It's at my waist. It doesn't spill through the bars. It stays with me, wherever I stand. Like a dog. Keep digging. `vasco_dig_right_1`
  *Sunday evening it's at his chest still, 0.4, and only then at his mouth, 0.46)*
- **Vasco**: [pause] The blade. Lorenzo's blade, snapped. A centimetre left. [pause] Of course. `vasco_snap`

## S.vaultEnd

  *the prayer, the first since January; Alan; "send the idiot", smiling in the dark*
- **Narrator**: Some time in the night, in the dark and the rising water, he prayed. For the first time since January. `narr_v8_pray`
- **Vasco**: Pai nosso, que estais no céu... [pause] `vasco_v_13`
- **Vasco**: I'm sorry. I've been working on a Saturday. [pause] I know You're busy. `vasco_v_14`
- **Vasco**: There's a man. Alan. White to the lips on the promenade, saying 'sunburn'. Caught behind a desk with his hand on a map, like a schoolboy and a thief. `vasco_v_prayer_1`
- **Vasco**: On Friday he told me everything. Too fast, in the wrong order, too late. And I didn't listen. I was too frightened of what it meant. `vasco_v_prayer_2`
- **Vasco**: He might be on a plane by tomorrow lunchtime. I told him to go. [pause] Or he might not. `vasco_v_prayer_3`
- **Vasco**: [pause] If You can't come... send the idiot. `vasco_v_15`
- **Narrator**: Fifty kilometres away and a thousand metres down, Alan lay on the hotel bed in his clothes, staring at a telephone that did not ring. `narr_cut_alan`
- **Alan**: Ring. [pause] Please. `alan_s_night`
