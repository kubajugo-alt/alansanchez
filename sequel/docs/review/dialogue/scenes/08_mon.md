# Monday 24 June

From `js/story/mon.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## placedN

- **Alan**: The sixth disc. Warm from Baute's hand. *[if]* `alan_look_disc6`
- **Alan**: Obsidian. The nails. I'm putting the nails back. *[if]* `alan_look_discs`

## S.callNow

> what Vasco would say now, to put Alan back on the thread (after a surge, after a retry)

- **Vasco**: Seven verses and seven scenes. Put them together, Alan. I'll read you any one you want. *[if]* `vasco_m_page`
- **Vasco**: Listen to me, and only me. Each one in the socket with its sign. Then tip it until its light is on its own triangle. I'll tell you what you've hit. *[if]* `vasco_m_ready`
- **Vasco**: I've lost the light! I can't read it without the light! `vasco_m_light`
- **Vasco**: When that light gets out of the top of the shaft, the door's open. [pause] Flat, Alan. Onto the great triangle. *(no recording)* `vasco_m_seventh_2`
- **Vasco**: Two minutes. Now the sun. In the middle. Alan, listen to me. Lay it flat. Send its light to the great triangle, not up the shaft. `vasco_m_seventh`

## S.startMon

> ---------------------------------------------------------------- dawn: Baute on his stool, and Alan's answer; noon

- **Baute**: I tipped it myself. The sun. At four o'clock. By eye. `baute_m_1`
- **Baute**: I watched Elena do it a hundred times. And I watched you do it, Vasco, on Saturday, when you thought I wasn't looking. *(no recording)* `baute_m_1b`
- **Baute**: I'm not a mathematician. But I'm not a fool either. [pause] With six of seven gone, close will do. I can see in your face that you know it. `baute_m_1c`
  *Vasco goes to the rim and looks down at the sun disc, tipped in its socket*
- **Vasco**: It's wrong. `vasco_m_1`
- **Baute**: It's close. `baute_m_close`
- **Vasco**: It's tipped by eye, Rayco. At twelve it won't face the sun. [pause] But some time after, it will. Near enough. `vasco_m_1b`
- **Vasco**: You've got it nearly right. [pause] That's the worst thing you could have done. `vasco_m_1c`
- **Baute**: Mira. The light doesn't point the sea, Vasco. It just opens the door. `baute_m_2`
- **Baute**: I'll point it. I've waited thirty years to point it. It'll come where it's called. `baute_m_2b`
- **Alan**: It won't. `alan_m_1`
  *(Baute looks at him, properly, for the first time)*
- **Alan**: It doesn't come where it's called. It goes where it wants, and it takes whatever's in its way. `alan_m_1b`
- **Alan**: A man in Lisbon tried to point it, eight months ago. Vicente Lacerda. He had a reason too. A very good one. He'd lost someone he loved. `alan_m_1c`
- **Alan**: When it came, it took him. In his own cistern, in his own water. It had me too, and it let me go, because of whose blood I've got. [pause] I don't think it'll do that twice. *(no recording)* `alan_m_1d`
- **Alan**: It doesn't listen, Dr. Baute. It's not a weapon. It's not even angry. It's just the sea. `alan_m_1e`
  *the water comes up in the hole (heard from up here; Yeray at the edge sees it), and the morning goes over them*
- **Yeray**: Doctor! The hole. [pause] It came up a whole rung. Just like that. `yeray_m_rung`
- **Narrator**: The morning went over them. Every half hour the water climbed another rung of the rope ladder. `narr_mon_wait`
- **Vasco**: Look. Up the shaft, at a slant. [pause] Magec's sending the sun back. Without him the moons answer to no one. And neither does the sea. *(no recording)* `vasco_m_twenty`
- **Vasco**: It'll climb. When it reaches the sky, at five past two, the door opens. [pause] Alan. The discs. `vasco_m_climb`
- **Carmen**: Five. Mira, there are only five. We need six. `carmen_m_five`
- **Alan**: The sixth disc's in his hands. [pause] And they've just closed on it. Tighter. `alan_m_disc`
- **Vasco**: I'll stay up here, at the rim. The wall can only be read from up here. I'll read it to you. `vasco_m_halves`
- **Vasco**: And someone has to go down. Into the water, at the door, and set them while it rises. [pause] You said it on the rock. I hated it then. I hate it now. `vasco_m_who`

## S.talkVascoCave

- **Vasco**: The door's down there, under the water. Whoever stands in it can reach the sockets. [pause] Not you, Alan. `vasco_m_door`

## S.talkCarmenCave

- **Carmen**: They're coming. Go and talk to your man. Go. *[if]* `carmen_m_guardia_done`
- **Carmen**: Yeray's got the radio fuse. Get it in the radio and I'll call the Guardia. Rayco's waiting for them. Look at him. He's waiting. *[if]* `carmen_m_fuse`
- **Carmen**: Do what he says, hombre. For once in your life, do exactly what somebody says. `carmen_m_1`

## S.talkYerayCave

- **Yeray**: The radio fuse. Dr. Baute told me to take it, Saturday. I've had it the whole time. [pause] Lo siento. Call whoever you have to call. `yeray_m_fuse`
  *(the fuse, in a twist of paper)*
- **Alan**: Thank you, Yeray. You came back down with bread and a pick. That counts. `alan_m_fuse`
- **Yeray**: I'll tell them. All of it. *[if]* `yeray_m_after`
- **Yeray**: I've got... there's something in my pocket, I should have... [pause] Forget it. After. Do what el doctor says. *[if]* `yeray_m_1`

## S.talkBauteCave

- **Baute**: I'll go down with them. I opened the door. I'll answer for who came through it. [pause] Elena. Juan Afonso. Tomás Rivero. Andrés Ojeda. Domingo Hernández. Pepe Santana. [pause] I'll say their names. *[if]* `baute_m_turn_in`
- **Baute**: [pause] When the Guardia come, I'll go with them. I'd like to walk down to the car on my own feet. *[if]* `baute_m_after`
- **Baute**: I've given it. That's all I have left to give. *[if]* `baute_m_given`
- **Baute**: I know what you're going to say. Everyone has always known what to say to me. *[if]* `baute_m_hold`

## S.stepIn

> ---------------------------------------------------------------- down the rope ladder, into the water

- **Alan**: A round hole in the floor, a rope ladder going down into it, and the sound of water breathing at the bottom. `alan_look_hole`
  *(a save from before the redesign: the bag of five)*
- **Alan**: Not with empty hands. The discs. `alan_m_no_discs`
- **Alan**: You can't do both. `alan_m_coming`
- **Vasco**: Alan. No. `vasco_m_no`
- **Alan**: It's coming for me anyway. I'd rather it found me doing something useful. `alan_m_anyway`
- **Narrator**: And it was quiet. The breathing under the floor had stopped. The water lay round his legs and did not pull. It only held him, the way something very large holds still when it is looking at you. `narr_m_quiet_2`
- **Alan**: It knows me. It remembers the cistern. [pause] It's waiting for me to slip. `alan_m_knows`
- **Vasco**: Listen to me, and only me. Each one in the socket with its sign. Then tip it until its light is on its own triangle. I'll tell you what you've hit. `vasco_m_ready`

## S.talkVascoBelow

> Vasco at the rim, above: he reads the scene round any triangle; he can't say which comes first; when the cloud has taken the light, Alan shouts for Carmen instead

  *has Vasco read the scene round the next disc's triangle in the telling's order, never naming its sign*
- **Alan**: Which one goes next? *[if]* `alan_m_ask_next`
- **Alan**: Which one goes first? *[if]* `alan_m_ask_first`
  *one of the set vasco_nudge_ (7), chosen in the code:*
- **Vasco**: Next, the women in the water to the waist, beating it with branches. *[set]* `vasco_nudge_first_quarter`
- **Vasco**: Now the houses under water. Fields gone, a boat on a roof. *[set]* `vasco_nudge_last_quarter`
- **Vasco**: Now the one with nobody round it at all. Where the story ends. *[set]* `vasco_nudge_sun`
- **Vasco**: The last of them: one woman standing in the sea, and the moon going down into it with her. *[set]* `vasco_nudge_wan_crescent`
- **Vasco**: Now the women pouring jars into the sea. Rings spreading out. *[set]* `vasco_nudge_wan_gibbous`
- **Vasco**: Next, the women coming down the cliff paths. In white, in a line. *[set]* `vasco_nudge_wax_crescent`
- **Vasco**: Find the one where the sea stands up, black, higher than the cliffs. The trees bent the wrong way. *[set]* `vasco_nudge_wax_gibbous`
  *one of the set vasco_scene_ (7), chosen in the code:*
- **Vasco**: The half moon, growing: the women in the water to the waist, beating it with branches. The water turning down. *[set]* `vasco_scene_first_quarter`
- **Vasco**: The half moon, going: fields and houses under water. A boat on a roof. *[set]* `vasco_scene_last_quarter`
- **Vasco**: Magec. The rays. Nothing round him. It's where the story ends. *[set]* `vasco_scene_sun`
- **Vasco**: The thin old moon: the moon going down into the sea, and one woman standing in it. *[set]* `vasco_scene_wan_crescent`
- **Vasco**: The moon nearly full, going: the women pouring jars into the sea. Rings spreading. *[set]* `vasco_scene_wan_gibbous`
- **Vasco**: The thin new moon: women in white, coming down the cliff paths in a line. *[set]* `vasco_scene_wax_crescent`
- **Vasco**: The moon nearly full, growing: the sea standing up, black, higher than the cliffs. The trees bent the wrong way. *[set]* `vasco_scene_wax_gibbous`
- **Vasco**: I can read you every one of them. I can't tell you which comes first. [pause] It's a song, Alan, and I don't have the words. `vasco_m_stuck`
- **Alan**: In the order she sang it. Six moons, one a month. And the sun last, at the top of the long day. `alan_pz_telling_done`
- **Vasco**: Seven verses and seven scenes. Put them together, Alan. I'll read you any one you want. `vasco_m_page`
  *(tests: fn(socket, sign) -> the triangle to set it on)*

## S.placeDisc

> a disc into a socket, then aimed: right (its own triangle, in its turn), bare rock (aim again), or a surge

- **Alan**: The sun disc, in the middle, tipped in its socket by Baute's hand. Wrong. `alan_look_seventh`
- **Alan**: That one's back. Black glass in old stone. `alan_socket_set`
- **Vasco**: Bare rock. Nothing. Again. `vasco_m_rock`
  *(taken out again: no harm done)*
  *(the socket this disc belongs in)*
  *one of the set vasco_hit_ (7), chosen in the code:*
- **Vasco**: That's the half moon's, the growing one! *[set]* `vasco_hit_first_quarter`
- **Vasco**: That's the last quarter's triangle! *[set]* `vasco_hit_last_quarter`
- **Vasco**: That's the sun's! The great triangle! Not that one! *[set]* `vasco_hit_sun`
- **Vasco**: That's the thin old moon's triangle! *[set]* `vasco_hit_wan_crescent`
- **Vasco**: That's the moon nearly full, the one going! *[set]* `vasco_hit_wan_gibbous`
- **Vasco**: That's the thin new moon's triangle! *[set]* `vasco_hit_wax_crescent`
- **Vasco**: That's the moon nearly full, the growing one! *[set]* `vasco_hit_wax_gibbous`
- **Vasco**: Take it out! That's not where it goes. [pause] Listen to me, Alan. Only me. `vasco_m_wrong_1`
- **Vasco**: It's lit, and the water's coming! [pause] Right place, wrong time. It's out of its turn in the song. `vasco_m_turn`
- **Vasco**: More. There. Stop. Leave it. `vasco_m_good_1`
- **Vasco**: Good. `vasco_m_good_2`
- **Vasco**: Yes. It's following. It's following the triangles. `vasco_m_good_3`
- **Vasco**: Good. One more of ours. `vasco_m_good_4`
- **Vasco**: Five. [pause] Ten minutes. `vasco_m_good_5`
- **Vasco**: Six. [pause] Good. `vasco_m_good_6`
  *one of the set vasco_scene_ (7), chosen in the code:*
- **Vasco**: The half moon, growing: the women in the water to the waist, beating it with branches. The water turning down. *[set]* `vasco_scene_first_quarter`
- **Vasco**: The half moon, going: fields and houses under water. A boat on a roof. *[set]* `vasco_scene_last_quarter`
- **Vasco**: Magec. The rays. Nothing round him. It's where the story ends. *[set]* `vasco_scene_sun`
- **Vasco**: The thin old moon: the moon going down into the sea, and one woman standing in it. *[set]* `vasco_scene_wan_crescent`
- **Vasco**: The moon nearly full, going: the women pouring jars into the sea. Rings spreading. *[set]* `vasco_scene_wan_gibbous`
- **Vasco**: The thin new moon: women in white, coming down the cliff paths in a line. *[set]* `vasco_scene_wax_crescent`
- **Vasco**: The moon nearly full, growing: the sea standing up, black, higher than the cliffs. The trees bent the wrong way. *[set]* `vasco_scene_wax_gibbous`

## S.surge

> a wrong disc (or the sun set wrong): the water surges; three and it takes him

  *(the rope ladder swinging)*
- **Carmen**: ¡Alan! Hold on to something! `carmen_m_surge`
- **Vasco**: Take it out! That's not where it goes. [pause] Listen to me, Alan. Only me. `vasco_m_wrong_1`
- **Narrator**: The water dropped back to his knees, slowly, like a dog called off that hasn't taken its eyes off you. *(no recording)* `narr_m_dog`
- **Vasco**: I can read you every one of them. I can't tell you which comes first. [pause] It's a song, Alan, and I don't have the words. `vasco_m_stuck`
- **Vasco**: Alan! It's at your chest. Please. [pause] Listen to me. `vasco_m_wrong_2`

## S.bauteGives

> ---------------------------------------------------------------- Baute's last help: the stain over the city, the telling (his grandmother's, verse by verse; Vasco says each one down into the hole in English), the crescent

  *(the clock and the spot of gold climbing the shaft show the time; Baute is up at the rim, out of Alan's sight)*
- **Vasco**: Alan. Rayco's on his feet, with a disc in his hands. [pause] He's looking out at the cloud. `vasco_m_rayco_up`
- **Narrator**: It had been white all night under the stars. It wasn't white now. Over Las Palmas a stain was spreading through it, black, oily black, like ink dropped into milk, coming up through the white from underneath. `narr_m_stain`
- **Narrator**: And in the south, where the resorts were, the cloud was clean. The great white hotels of Maspalomas stood along a blue and empty sea in a line like teeth, with nothing coming for them at all. `narr_m_south`
- **Carmen**: That's my street. Under there. Calle Perdomo, above the farmacia. `carmen_m_street`
- **Carmen**: That's La Isleta. That's where Doña Pino lives. She's seventy-four. That's the playa where Elena nearly drowned when she was a girl. `carmen_m_street_2`
- **Carmen**: There are ten thousand people on it right now, Rayco. Our people. Canarios. Sleeping off San Juan. *(no recording)* `carmen_m_street_3`
- **Carmen**: And there's your concrete. In el sol. Look at it. Not a drop. `carmen_m_concrete`
- **Narrator**: Something went out of Baute's face, all at once, the way a candle goes out. Thirty years of it. `narr_m_goes_out`
- **Baute**: It was never going to listen. Was it. `baute_m_stain_3`
- **Baute**: Mi abuela said it at the fire in Tasarte, every winter. I'm the only one left who has the words. `baute_m_grandmother`
  *one of the set baute_m_verse_ (7), chosen in the code:*
- **Baute**: Cuando el sol era más chico, el agua se levantó más alta que la montaña, y el viento no la podía empujar. *[set]* *(no recording)* `baute_m_verse_1`
- **Baute**: En la segunda luna se acostó en nuestras casas, y allí durmió. *[set]* *(no recording)* `baute_m_verse_2`
- **Baute**: En la tercera luna bajaron las blancas por los caminos de las cabras. *[set]* *(no recording)* `baute_m_verse_3`
- **Baute**: En la cuarta luna le dieron la leche de las cabras, y bebió. *[set]* *(no recording)* `baute_m_verse_4`
- **Baute**: En la quinta luna la apalearon como a un perro, y se fue a su cama. *[set]* *(no recording)* `baute_m_verse_5`
- **Baute**: En la sexta luna una se quedó en el agua, y la luna entró con ella. *[set]* *(no recording)* `baute_m_verse_6`
- **Baute**: Y en el día largo, en lo alto del día, pusieron el sol en el medio, y empezó el año. *[set]* *(no recording)* `baute_m_verse_7`
  *one of the set vasco_m_verse_ (7), chosen in the code:*
- **Vasco**: When the sun was smallest, the water stood up taller than the mountain, and the wind could not push it. *[set]* `vasco_m_verse_1`
- **Vasco**: In the second moon it lay down in our houses and slept there. *[set]* `vasco_m_verse_2`
- **Vasco**: In the third moon the white ones came down the goat paths. *[set]* `vasco_m_verse_3`
- **Vasco**: In the fourth moon they gave it the goats' milk, and it drank. *[set]* `vasco_m_verse_4`
- **Vasco**: In the fifth moon they beat it like a dog, and it went down to its bed. *[set]* `vasco_m_verse_5`
- **Vasco**: In the sixth moon one stayed in the water, and the moon went in with her. *[set]* `vasco_m_verse_6`
- **Vasco**: And on the long day, at the top of the day, they set the sun in the middle, and the year began. *[set]* `vasco_m_verse_7`
  *he holds the crescent down into the hole; Alan reaches up and takes it*
- **Baute**: I'm sorry. I'm so sorry. [pause] Take it. Por favor. Quickly. `baute_m_listen`
- **Baute**: The last one I took. In May. The thin moon, going. [pause] I kept it on me. No sé por qué. `baute_m_crescent`
- **Vasco**: Seven verses and seven scenes. Put them together, Alan. I'll read you any one you want. `vasco_m_page`

## S.sixSet

> six moons set: two minutes; the sun, flat, in the middle

- **Vasco**: Two minutes. Now the sun. In the middle. Alan, listen to me. Lay it flat. Send its light to the great triangle, not up the shaft. `vasco_m_seventh`
- **Vasco**: Tip it towards you, and its light comes down off the shaft and across the wall. I'll tell you where it lands. Dead centre. `vasco_m_seventh_3`
- **Alan**: Yes. `alan_m_yes`
- **Vasco**: Dead centre, Alan. Not close. `vasco_m_dead_centre`
- **Alan**: I understand. `alan_m_understand`

## S.turnSeventh

> ---------------------------------------------------------------- the seventh: the cloud, the mirror, the sun laid flat

- **Alan**: The sun disc, flat in the middle. Where the women set it. `alan_look_seventh_set`
- **Vasco**: Not yet. The six first. It only works in order. `vasco_m_seventh_wait`
- **Alan**: I can't see where it lands. Nobody can. Not without the sun. `alan_m_dark`
- **Vasco**: I've lost the light! I can't read it without the light! `vasco_m_light`

## S.cloudCrosses

- **Alan**: It's cold. Colder than the others. Colder than the water. `alan_m_cold`
- **Narrator**: The water was at his chest. Two metres off the floor of the cave, and the sea at his chest, holding him the way you hold something you are not yet sure whether to keep. `narr_m_chest`
- **Vasco**: A cloud! Where did that come from? Over the sun! `vasco_m_cloud`
- **Vasco**: No. No, no, no. `vasco_m_nonono`
- **Narrator**: The water surged to Alan's chin. Under the floor the breathing came back, louder than it had ever been, a great hollow roar like surf in a sea cave, and the whole mountain seemed to shake with it. `narr_m_roar`
- **Vasco**: I've lost the light! I can't read it without the light! `vasco_m_light`

## S.wingMirror

> Alan shouts up for Carmen: she's already gone, to the Land Rover, and up onto the rock with its wing mirror

- **Alan**: Carmen! The sun! Anything that shines! `alan_m_carmen_light`
- **Yeray**: She's gone, Alan! She ran out, towards the camp! `yeray_m_gone`
  *the wing mirror torn off the Land Rover (heard), and Carmen up on the rock over the shaft*
- **Yeray**: She's got the mirror off the Land Rover! Madre mía, she's going up the rock! `yeray_m_mirror`
- **Carmen**: Venga. Venga, you ugly thing. [pause] Come on! `carmen_m_mirror`
- **Vasco**: She's got it down the shaft! Six lit. [pause] And the sun's still sending it back up. `vasco_m_mirror_lit`
- **Vasco**: When that light gets out of the top of the shaft, the door's open. [pause] Flat, Alan. Onto the great triangle. *(no recording)* `vasco_m_seventh_2`

## S.layFlat

> the sun disc, tipped by Baute, laid flat and aimed like the others: onto the great triangle, in the middle

- **Carmen**: I'm holding it. My arms are going to fall off, hombre. Turn the thing. `carmen_m_holding`
- **Vasco**: Bare rock. Nothing. Again. `vasco_m_rock`
  *one of the set vasco_hit_ (7), chosen in the code:*
- **Vasco**: That's the half moon's, the growing one! *[set]* `vasco_hit_first_quarter`
- **Vasco**: That's the last quarter's triangle! *[set]* `vasco_hit_last_quarter`
- **Vasco**: That's the sun's! The great triangle! Not that one! *[set]* `vasco_hit_sun`
- **Vasco**: That's the thin old moon's triangle! *[set]* `vasco_hit_wan_crescent`
- **Vasco**: That's the moon nearly full, the one going! *[set]* `vasco_hit_wan_gibbous`
- **Vasco**: That's the thin new moon's triangle! *[set]* `vasco_hit_wax_crescent`
- **Vasco**: That's the moon nearly full, the growing one! *[set]* `vasco_hit_wax_gibbous`
- **Narrator**: The water was at his mouth. He tipped his head back to breathe. He couldn't feel his hands any more. He could only see them, in the gold light, on the black disc, turning. `narr_m_mouth`

## S.closeLock

  *the cloud slides off; the real light comes down onto all seven, and seven columns go back up, the sun's on the*
- **Carmen**: ¡El sol! It's out! Hombre, it's out! `carmen_m_sun`
- **Vasco**: There. There. Stop. Alan. Stop. Don't move. [pause] That's it. That's the one. `vasco_m_true`
  *the triangles flare; the women of light, in a ring round the noon column with Alan in it, come in a flash of*
  *light, dance (two loops, no words) and go in another; then only the columns*
- **Narrator**: Then it breathed out. A long, slow, vast exhalation, through the rock, through the mountain, through the whole island. And the water began to go down. `narr_m_breath`
- **Narrator**: It went down the way it had come, into the rock, and it took Alan with it, as easily as a hand pulls a weed. `narr_m_drag`
- **Narrator**: Black. Cold. The roar in his ears, and the pull, down and down. And below him, where the floor of the cave should have been, there was no stone. Only more dark, opening. `narr_m_drag_2`
- **Alan**: So this is how she went. The one who stayed in the water, when the door shut. *(no recording)* `alan_m_so_this`
- **Narrator**: He stopped fighting. The light was on the triangle. He had done it. Nothing else mattered. `narr_m_stops`
- **Narrator**: And a hand closed on his wrist. Hard enough to hurt. The way a man holds a rope over a cliff. `narr_m_hand`
- **Vasco**: No. [pause] No, you don't. `vasco_m_hold`
- **Narrator**: The water pulled, and the hand held. Someone above him was shouting, and someone had hold of the man who was shouting, and someone had hold of them. A chain of hands, in the black, against the sea. `narr_m_chain`
- **Narrator**: Then the pull was gone. He was lying on dry stone in the upper cave, in the gold light, coughing up the sea. `narr_m_dry`
- **Narrator**: Vasco knelt over him with Alan's wrist in both hands. Behind him Carmen had her fists knotted in the back of Vasco's shirt. Behind her, soaked to the shoulders, Yeray. And behind Yeray, both arms locked round the boy's waist, Rayco Baute. `narr_m_chain_2`
- **Narrator**: Nobody let go for a long time. `narr_m_nobody`
- **Vasco**: You stopped. I saw your face. You were letting it take you. `vasco_m_stopped`
- **Vasco**: I've let go of people before. I got on a train once, in the middle of the night, and let go of a good man without a word. *(no recording)* `vasco_m_twice`
- **Vasco**: I wasn't going to do it twice. `vasco_m_twice_2`
- **Carmen**: Mira. Over the city. [pause] The black's going back into the cloud. Like ink in water. `carmen_m_city`
- **Narrator**: Far below, through the tear, the sea lay blue. For a moment something very large turned over under it, like a sleeper, and went down. `narr_m_glimpse`
  *they come out to the cave mouth, into the sun*
- **Alan**: You were right. It's beautiful. [pause] It's the most beautiful place I've ever stood. `alan_m_after`
- **Carmen**: [pause] Huh. One try. `carmen_m_after`
- **Yeray**: Is it over? Doctor, is it over? `yeray_m_after_1`
- **Alan**: Nearly. [pause] Tell him, Alan. Today. Not when it's convenient. *(no recording)* `alan_m_today`

## S.confessionTalk

> ---------------------------------------------------------------- the confession: when, and how

- **Vasco**: The Guardia, then the road down. Then we'll see. *[if]* `vasco_m_after_trowel`
- **Vasco**: Go and help Carmen with the radio. I need a minute with the sun. *[if]* `vasco_m_after`
- **Alan**: Are you hurt? *[choice]* `alan_m_ask_hurt`
- **Vasco**: I've got a lump on my forehead the size of a quail's egg, from the doorway of this cave, and I can't remember getting it. `vasco_m_hurt`
- **Vasco**: [pause] I'm all right. You held on. I held on. `vasco_m_hurt_2`
- **Alan**: The map. I thought it was Montesdeoca. *[choice]* `alan_m_ask_monte`
- **Vasco**: He ran the bulldozers in sixty-six. Over Rayco's grandmother's dead. He's guilty of that. Not of this. [pause] Most people are guilty of something. Not usually of the thing you're looking for. `vasco_m_monte`
- **Alan**: Vasco. I have to tell you something. Before you ask. *[choice]* `alan_m_confess`
- **Alan**: Nothing. Later. *[choice]* `alan_m_later`
- **Vasco**: Later is when things go wrong with us. You know that. `vasco_m_later`
- **Alan**: Later. [pause] I can hear myself saying it. I hate the sound of it. `alan_m_later_2`
- **Vasco**: Yeray told me. On Saturday morning, at the camp. He said there was a Portuguese guy at Rafa's bar on Friday night. `vasco_m_plain_1`
- **Vasco**: He said he was funny. Sad underneath. Like a man at his own party who doesn't know why he came. *(no recording)* `vasco_m_knew_2`
- **Vasco**: I told myself it couldn't be you. There are a great many Portuguese men in Las Palmas. I lay in that vault a night and a day and told myself that, over and over. *(no recording)* `vasco_m_knew_3`
- **Vasco**: [pause] And I knew. Of course I knew. `vasco_m_knew_4`
- **Vasco**: Then you came down the steps into the water to get me. And I thought: if he's the man I think he is, he'll tell me before I ask. If he isn't, he'll wait until I do. *(no recording)* `vasco_m_knew_5`

## S.confess

  *(Vasco turns to him)*
- **Alan**: On Friday night, after you left, I went out. To a bar in Vegueta. Rafa's bar. I drank too much rum. `alan_m_confess_1`
- **Alan**: And I met someone. The barman. Rafa. And I slept with him. `alan_m_confess_1b`
- **Alan**: He asked me if there was someone. Straight out. And I said no. [pause] I said it twice. `alan_m_confess_1c`
- **Alan**: I broke both of them. Both our rules. I didn't tell you first. And I did it on purpose. *[choice]* *(no recording)* `alan_m_plain`
- **Alan**: Because we'd had a fight. Because you'd left. Because I was angry and frightened and I wanted, for one night, to be somebody with nothing to lose. `alan_m_plain_2`
- **Alan**: I lied to him about you. And I would have lied to you about him. On Saturday morning I was already working out how. *(no recording)* `alan_m_plain_3`
- **Alan**: That's all of it. I won't say I was drunk. I won't say it meant nothing. [pause] It didn't. I'm not lying about that either. `alan_m_plain_4`
  *(a very long look)*
- **Vasco**: You didn't wait. `vasco_m_didnt_wait`
- **Alan**: No. `alan_m_no`
- **Vasco**: [pause] Thank you for telling me first. `vasco_m_first`
- **Alan**: You'd left. I was drunk. I thought we were over. I thought you'd gone. *[choice]* `alan_m_excuses`
- **Alan**: You'd walked out. It was the solstice. I'd had five rums. I was trying not to think, and I'm very good at that. `alan_m_excuses_2`
  *(Vasco says nothing for a long time)*
- **Vasco**: [pause] I know I left. I know about the rum. [pause] That's not the bit that hurts. You told him there was no one. *(no recording)* `vasco_m_excuses_1`
- **Vasco**: [pause] Thank you for telling me first. `vasco_m_first`
- **Alan**: And it's all my fault. Everything. The desk, the fight, the bar. I'm a disaster. I don't deserve you. You should go. *[choice]* `alan_m_blame`
- **Alan**: I'm the worst thing that's ever happened to you. Worse than the Church. Worse than that night train. *(no recording)* `alan_m_blame_2`
- **Vasco**: Stop. [pause] Don't make it so big that I have to comfort you. That's another kind of door, Alan. Stay in the room. `vasco_m_blame_1`
- **Vasco**: You didn't wait. `vasco_m_didnt_wait`
- **Alan**: No. `alan_m_no`
- **Vasco**: [pause] Thank you for telling me first. `vasco_m_first`
  *(he doesn't move away)*
  *Lorenzo's trowel, held out on his palm*
- **Vasco**: Lorenzo gave me this. In Rome, on my twenty-seventh birthday. He said: 'For the day you find something worth keeping.' `vasco_m_trowel_1`
- **Vasco**: I kept it twelve years. Through the whole of the Church. I used it in the vault to write on the wall, and to dig my way out, and I broke it. `vasco_m_trowel_1b`
- **Vasco**: [pause] I don't need it any more. `vasco_m_trowel_1c`
- **Vasco**: For the day you find something worth keeping. [pause] Keep it. `vasco_m_trowel_2`
- **Alan**: [pause] I'll keep it. `alan_m_trowel`
- **Alan**: Warm, from his pocket. [pause] I keep my hand on it. `alan_m_trowel_2`

## S.fuseIn

> the radio, fuse restored: the Guardia Civil

- **Alan**: The camp radio. No fuse. Dead as a doornail. *(no recording)* `alan_radio_dead`
- **Alan**: The radio's alive. The Guardia are coming. Everything's coming. `alan_radio_mon`
- **Alan**: The fuse in. A crackle, a hiss, and a voice from Artenara saying 'Diga'. `alan_m_fuse_in`
- **Carmen**: Give me that. [pause] Guardia Civil, Artenara. This is Dr. Carmen Trujillo, at Risco Caído. I have a man here who wants to turn himself in. [pause] No, I'm not joking. When do I joke? `carmen_m_radio`
  *(she talks to her cousin, the sergeant, for a long time, low)*
- **Carmen**: Mi primo. The sergeant, the one who gave me the photographs. [pause] They'll be here in an hour, from Artenara. I told them Rayco would be waiting. `carmen_m_guardia`

## S.ending

> ---------------------------------------------------------------- the ending

  *Carmen and Rayco on the rock at the cave mouth; the keys; the Guardia at nine*
  *the narrator keeps the Guardia's coming, and one line over the drive down)*
- **Carmen**: It's done, Rayco. They're on their way. I said you'd be here. *(no recording)* `carmen_m_tell_rayco`
- **Baute**: [pause] I'll wait. `baute_m_wait`
- **Carmen**: I'll come down with you. In the car. I'm not letting you go down that road on your own. `carmen_m_ride`
- **Baute**: Carmen. [pause] Elena... `baute_m_elena`
- **Carmen**: I know. I know, Rayco. Not now. There'll be time for that. `carmen_m_notnow`
- **Carmen**: I'll visit. I'll bring you cigarettes. I'll shout at you through the glass. Every week, for as long as it takes. `carmen_m_visit`
- **Carmen**: You were right about Tasarte. You were right about all of it. Somebody has to keep saying it. Properly. In a way that doesn't drown anyone. `carmen_m_right`
- **Carmen**: [pause] Looks like it's going to have to be me. `carmen_m_me`
  *(one for him, one for her)*
  *(thrown over her shoulder; Alan catches them)*
- **Carmen**: Bring it back to the flat. Calle Perdomo, above the farmacia. Fill the radiator at the bottom of the hill. `carmen_m_keys`
- **Carmen**: It doesn't have a left wing mirror any more. Don't let it see you hating it. `carmen_m_keys_2`
- **Narrator**: The Guardia came at four, in a Land Rover older than Carmen's: two young officers who looked at Baute as if sent to arrest a mountain. `narr_end_guardia`
- **Baute**: You'll make a fine director one day, Vasco. Of something. [pause] Don't let them put you in a museo. `baute_m_director`
- **Alan**: And then it's just the two of us. On a mountain. With a Land Rover that's lost a wing mirror. `alan_end_alone`
  *the road down, through the cloud (the still shows the hand on the gearstick)*
- **Narrator**: It wasn't forgiveness. It was careful, and quiet, and it was a start. *[if]* `narr_end_excuses`
- **Narrator**: It wasn't forgiveness. Neither of them pretended it was. But the hand stayed. *[if]* `narr_end_plain`
- **Alan**: Vasco. Are we... I mean, after this. Are we going to be... `alan_end_ask`
- **Vasco**: [pause] Ask me again in Santo Domingo. `vasco_end_last`
  *the city's birthday; Nieves*
- **Narrator**: Las Palmas was five hundred and eighteen years old that day. Nobody knew how nearly it hadn't been. `narr_end_city`
- **Alan**: Nieves looks at Vasco's blanket. Then at my clothes: rum, turpentine, a flooded granary, a flooded cave. `alan_end_nieves`
- **Alan**: Her eyebrow goes up. All the way up. [pause] And then she smiles. I didn't know she could. `alan_end_nieves_2`
- **Nieves**: Welcome back, Dr. Teles. Señor Sanches. [pause] There are no messages. `nieves_end_1`
- **Nieves**: There is fresh café in the machine. I made it myself. [pause] It is still terrible. `nieves_end_2`
  *Chano at dusk, and San Borondón*
- **Chano**: You found him. `chano_end_1`
- **Alan**: I found him. `alan_end_found`
- **Chano**: Up the montaña. `chano_end_2`
- **Alan**: Up the mountain. `alan_end_mountain`
  *(Chano nods, as if he'd said so all along, and leans over the counter)*
- **Chano**: My cousin's wife's sister's husband was out on his boat at sunrise this morning. Off Agaete. And he swears to God, on his mother's grave, he saw San Borondón. *(no recording)* `chano_end_3`
- **Chano**: The island. The one that's only there sometimes. It came up out of the sea at sunrise, green, with trees on it, and mountains. Then el sol came up, and it was gone. `chano_end_4`
- **Chano**: Of course, he's a liar. Everybody knows he's a liar. [pause] But still. Strange day. `chano_end_5`
- **Alan**: Strange day. `alan_end_strange`
  *the fireworks from the balcony; the last night*
- **Narrator**: Below them, the ordinary sea came in and went out on the sand. `narr_end_fireworks_2`
- **Narrator**: Not like Tuesday. Too tired, too careful, nothing mended yet. Not forgiveness. A choice. *[if]* `narr_love_2_quiet`
- **Narrator**: Not like Tuesday. Two men who knew what they had nearly lost, choosing, in the dark, not to lose it. *[if]* `narr_love_2_warm`
  *the morning: the coffee by the bed*
- **Narrator**: In the morning Vasco had already gone down to the lobby. On the bedside table, on Alan's side, a cup of coffee. `narr_end_morning`
- **Alan**: From the machine in the lobby. [pause] It'll be terrible. `alan_end_coffee`
- **Narrator**: Alan lay there and looked at it for a long time. Then he sat up, and reached for it, and drank it. `narr_end_drank`
  *(no more saves past the end)*
