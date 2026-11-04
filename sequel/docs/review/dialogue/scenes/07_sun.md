# Sunday 23 June

From `js/story/sun.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## S.startSun

- **Alan**: Five in the morning. Sunday. [pause] My hands are packing. Nobody asked them to. `alan_su_wake`

## S.theChoice

> ---------------------------------------------------------------- five in the morning: packing without deciding to

- **Alan**: Fold the shirt. Roll the socks. Passport, ticket. [pause] Paris. New York. London. Whenever it got too close, my hands always knew the way. `alan_su_pack`
- **Alan**: Vasco's watch, on the bedside table. [pause] To give it back. In Lisbon. When he comes home. [pause] If. `alan_su_watch`
- **Alan**: A note for his pigeonhole. Four tries. [pause] 'Gone home. I'm sorry. A.' `alan_su_note`
- **Narrator**: A taxi on the promenade. He had meant to say the bus station, and the seven o'clock bus to Artenara. `narr_su_taxi`
- **Alan**: Gando. The airport. `alan_su_gando`

## S.toAirport

- **Alan**: Half past six, and half of Europe going home sunburnt. [pause] The Iberia queue moves slowly. Which gives me time to think. The last thing I want. `alan_su_airport`

## S.backToChoice

> Gando's way out, before the desk

- **Alan**: My feet are in the queue. [pause] Let's see what the rest of me does at the desk. `alan_su_queue_back`

## S.badEnding

> ---------------------------------------------------------------- the Iberia desk (the clerk who lost his suitcase on Tuesday)

- **Alan**: The Iberia desk. The same woman who sent my suitcase to Madrid on Tuesday. Everything about leaving is very easy. `alan_look_clerk`
  *(his grandfather, the habit, what staying means: in his own voice, in the queue)*
- **Alan**: My grandfather saw the Sea come once. Joaquim Sanches, the last bell founder in Lisbon. He got on a boat, and pretended for the rest of his life it hadn't happened. `alan_su_queue_1`
- **Alan**: He left me a name, a box of old books, and a habit. [pause] The habit's standing in the Iberia queue with a suitcase. `alan_su_queue_2`
- **Alan**: Founder's hands, Don Fermín said. The men who make bells understand the things that hang. `alan_su_hands`
- **Alan**: If I stay, someone has to stand in the black water at the door. And I know who. I can't imagine asking anyone else. `alan_su_queue_3`
- **Alan**: If I get on the plane, I might live. The shop, Inês, Pessoa, growing old. [pause] And Vasco on the mountain with Baute, calling him Rayco. Not knowing. `alan_su_queue_4`
- **Clerk**: ¡Siguiente! [pause] Señor Sanches! And your suitcase is with you this time! You see? Everything comes in the end. `clerk_su_next`
- **Alan**: Yes. `alan_su_yes`
- **Clerk**: And the sunburn is a tan now. Very guapo. Lisbon will not recognise you. `clerk_su_tan`
- **Alan**: Thank you. [pause] It's mostly peeling. Underneath, it's still me. `alan_su_tan`
- **Clerk**: Lisbon, via Madrid. Eleven fifteen. [pause] Window or aisle? `clerk_1`
- **Alan**: Behind her, past the runway, the panza lies over the north like a lid. [pause] And above it, small and clear, the mountains. `alan_su_desk`
- **Clerk**: Señor? Window or aisle? `clerk_su_again`

## S.deskChoice

- **Alan**: [pause] Window. *[choice]* `alan_su_clerk`
- **Alan**: Aisle. *[choice]* `alan_su_aisle`
- **Alan**: I'm sorry. I've left something behind. *[choice]* `alan_su_behind`

## S.flyHome

> the bad ending: the plane home, and the stain spreading under the cloud over Las Palmas; then back to the desk

- **Clerk**: Lovely. Gate four, boarding at half past ten. Buen viaje, señor. `clerk_2`
  *(the still shows the plane, the island under its lid and the stain over the city: one line)*
- **Narrator**: That night the city goes down to the sea. In the morning, in the vault above the cloud, there is only salt on the steps. `narr_bad_3`
- **Clerk**: Señor? Window or aisle? `clerk_su_again`

## S.leaveAirport

> "I've left something behind": out through the crowd; the bus has gone; Chano

  *he takes his ticket back out of her hand and walks back through the crowd; she shrugs after him*
- **Clerk**: It's June. `clerk_su_june`
- **Narrator**: Half past nine, back in the city. The bus to Artenara went at seven. `narr_su_back`
- **Alan**: Chano. `alan_su_chano_think`
- **Chano**: You came back. `chano_su_1`
- **Alan**: I came back. `alan_su_chano_1`
- **Chano**: From el aeropuerto. `chano_su_2`
- **Alan**: How do you... `alan_su_chano_2`
- **Chano**: You've got the airport face. Everybody comes back from the airport with the same face. `chano_su_3`
- **Chano**: Like a man who has been to the edge of a cliff and looked over. `chano_su_4`
  *(a box of rockets to a small boy)*
- **Chano**: Bueno. What do you need? `chano_su_5`
- **Alan**: Carmen Trujillo. From the museum. Where does she live? `alan_su_chano_3`
- **Chano**: Calle Perdomo, number twelve, third floor, above the farmacia. Her Land Rover is parked outside. It's always parked outside. It doesn't go anywhere. `chano_su_6`
- **Chano**: My cousin's wife's sister cuts her hair. Once a year. She doesn't tip. `chano_su_6b`
- **Chano**: [pause] She lost her friend in December. The one who drowned in the car on the mountain. Did you know that? `chano_su_7`
- **Alan**: I'm beginning to. `alan_su_chano_4`
- **Chano**: And my knees say stay off la playa tonight. [pause] Nobody listens to my knees. `chano_su_8`
- **Alan**: Calle Perdomo. Triana. [pause] Thank you, Chano. `alan_su_perdomo`

## room carmen_flat

> ================================================================ CARMEN'S FLAT

  *(at the door, the first time)*
- **Alan**: Carmen in her field clothes, keys on a carabiner, sunglasses back on her head. Whoever she was ten minutes ago, she's put her away for later. *[if]* `alan_look_carmen_flat_2`
- **Alan**: Carmen at home: a man's dressing gown, no sunglasses, a cigarette she hasn't lit. Without the sunglasses she looks bare, and tired, and older. *[if]* `alan_look_carmen_flat`
- **Carmen**: [pause] Rafa's hand. Everyone in Vegueta has one. [pause] Oh, cariño. `carmen_su_drawing`
- **Carmen**: If it isn't a cigarette or a reason, don't show it to me. `alan_fail_carmen_item`
- **Alan**: The light's out. Six months of blinking, and now it's out. *[if]* `alan_look_machine_2`
- **Alan**: An old grey answering machine with a cassette in it. The red light's blinking. Slowly. Steadily. Every day for six months, I'd guess. *[if]* `alan_look_machine`
- **Alan**: A shoebox. 'E.' on the lid in marker. Everything left of a woman fits in a shoebox. It never seems right. *[if]* `alan_look_elena_box`
- **Alan**: A fridge with wine, olives, gofio and six bottles of water. A woman who keeps water by the litre, for a car that drinks it. `alan_look_fridge`
- **Alan**: Triana's rooftops, and beyond them, the sea, and on the sea, the bonfires being built for tonight. `alan_look_carmen_window`
- **Alan**: Books about the island, and a photograph of two women laughing on a mountain. One of them is Carmen. The other has a pencil through her hair. `alan_look_carmen_shelves`
  *(the two women on the mountain: the close-up, entry 116)*
- **Alan**: The Land Rover's downstairs. Carmen has the keys. Let's go. *[if]* `alan_su_go`
- **Alan**: Not yet. Not without knowing where he is. *[if]* `alan_su_not_leaving`
  *the door on its chain: "No." / "I'm an idiot."*
  *goes back in and he follows. The flat, the ashtrays and the blinking machine are the painting's.*
- **Carmen**: No. `carmen_su_door`
- **Alan**: I'm an idiot. `alan_su_idiot`
- **Alan**: I've been an idiot all week. I broke into the wrong office. I suspected the wrong man. `alan_su_idiot_2`
- **Alan**: I lied to the man I love because I thought I was protecting him. And then I lied to someone else to punish myself for it. `alan_su_idiot_3`
- **Alan**: I've been doing everything on my own because I'm frightened of needing anyone. Two people have drowned in their beds, and Vasco is up on that mountain with Rayco Baute, and I can't reach him. `alan_su_idiot_4`
- **Alan**: And I've just come back from the airport. [pause] I need your help. I've never been able to do anything on my own. I've just been very good at pretending. `alan_su_idiot_5`
- **Carmen**: [pause] Baute. `carmen_su_baute`
- **Alan**: Not Montesdeoca. Baute. The discs never went to the city. They go down to a vault under the caves, at night. Yeray carries them. And only Rayco has the key. `alan_su_baute`
- **Alan**: Carmen. Your friend. In December, on the mountain road. [pause] She found it first. Didn't she. `alan_su_friend`
- **Alan**: Well. That's that, then. `alan_su_thats_that`
- **Carmen**: Everybody's an idiot, cariño. Come in before you say it to the neighbours. `carmen_su_idiot`
  *small moving details over the painting: the hanging lamp, the view from the kitchen window, the machine's light*
  *the ivy trailing off the top shelf*
  *the sea beyond the roofs, under the cloud*
  *the message light: Elena's message waiting, blinking until it's played (then it goes out)*

## S.playElena

> Elena: who she was, the call she missed; "Play it."; the message; Carmen again, in her field clothes; the box

- **Carmen**: Once. Once was enough, cariño. `carmen_su_again`
- **Carmen**: Her name was Elena. Elena Suárez. She had Vasco's job before Vasco had it. The best reader of the cave anyone ever had. `carmen_su_elena_1`
- **Carmen**: And she was... [pause] We'd been together eleven years. `carmen_su_elena_2`
- **Carmen**: I was married before. To a man. A long time ago. He was very nice. It was very boring. `carmen_su_elena_3`
- **Carmen**: She drove down the mountain on the twenty-first of December, and the Guardia found her in a dry barranco the next morning with her lungs full of el mar. `carmen_su_elena_4`
- **Alan**: I know. `alan_su_know`
- **Carmen**: She rang me first. From the bar in Artenara. I was out. A stupid Christmas fiesta at the museum. `carmen_su_elena_5`
- **Carmen**: I got home at two and the light was blinking, and I thought, she's being dramatic, she'll be here in an hour. And I went to sleep. `carmen_su_elena_6`
- **Carmen**: I've never listened to it since. I can't. And I can't erase it. So it just sits there. Blinking. `carmen_su_elena_7`
- **Alan**: Play it. `alan_su_machine`
- **Carmen**: No. `carmen_su_dont`
- **Alan**: Carmen. Please. I think she was trying to tell you what I'm trying to tell you. I think she found it first. [pause] Play it. `alan_su_please`
  *(she looks at him a long time; then presses the button)*
- **Elena**: Carmen. It's me. I know it's late. [pause] Somebody's taken one of the discs out of the floor. The wear marks are fresh. It isn't conservation. `elena_msg_01`
- **Elena**: And it isn't a calendar either. I've been reading it wrong for a year. [pause] It's a door, Carmen. And someone's opening it. `elena_msg_02`
- **Elena**: I'm driving down now. Don't smoke all of them before I get there. [pause] Te quiero. `elena_msg_03`
  *(the red light stops blinking, and goes out: animBack)*
  *he goes to her and puts his hand on her shoulder, and they stay like that a long time*
- **Carmen**: [pause] Bueno. One minute. Nobody saves anybody in a dressing gown. `carmen_su_dress`
- **Carmen**: The Guardia gave me her things in January. The photographs too, because I asked, and because the sergeant was my cousin. `carmen_su_box`
- **Carmen**: Her notebook's been in that box six months. I've never opened it. [pause] You open it. `carmen_su_box_2`

## S.elenaBox

- **Alan**: I've got them. I'll bring them back. I'll bring everything back. `alan_box_again`
- **Alan**: Her notebook, green, swollen with damp. And a police photograph of a windscreen. `alan_su_box`
- **Alan**: The triangle on the windscreen. The same as the arrows on the cave wall. She drew it while the water came up. She was telling us where. *[if]* `alan_su_triangle`
- **Alan**: A triangle, point down, drawn in salt on a windscreen. She was telling someone something. *[if]* `alan_su_triangle_2`
  *the sentence she didn't finish; the cistern, told; the lighter, four tries*
- **Alan**: She never finished it. [pause] Whoever stands in the water goes down with it. `alan_su_finish`
- **Carmen**: How do you know that? `carmen_su_how`
- **Alan**: Because I've stood in it. [pause] A cistern under Lisbon. Black water, and something in the dark that knew me. And Doña Pino's list has my name at the bottom. `alan_su_told`
  *her lighter: four tries this time; half the cigarette in silence*
- **Carmen**: So it's coming for you anyway. And someone has to stand in its water to shut it. And the last one who did didn't come back. `carmen_su_anyway`
- **Alan**: Apparently. `alan_su_apparently`
- **Carmen**: And you came back from el aeropuerto. `carmen_su_airport`
- **Alan**: [pause] Apparently. `alan_su_apparently_2`
- **Carmen**: [pause] You are an idiot, cariño. [pause] The good kind. `carmen_su_idiot_2`

## S.takeWater

- **Alan**: I've got water. More would just slosh. *[if]* `alan_fridge_again`
- **Alan**: Two litres of water. For the radiator, or for me, whichever boils first. `alan_take_water`

## S.talkCarmenSun

- **Alan**: Where's Vasco? *[choice]* `alan_su_where`
- **Alan**: Tell me about her. *[choice]* `alan_ask_carmen_elena_su`
- **Carmen**: She laughed at everything. She drew everything. She left her socks in the bath for eleven years. [pause] We were going to buy a house in Artenara. Above the cloud. `carmen_su_elena`
- **Alan**: Will the Land Rover make it up the mountain? *[choice]* `alan_ask_carmen_radiator`
- **Carmen**: It's made it up for nineteen years. Faith, water and swearing. You bring the water. `carmen_su_radiator`
- **Alan**: Give me a moment. *[choice]* `alan_bye_carmen_su`
- **Carmen**: Keys. Water. Shoes. Go. *[if]* `carmen_su_keys`
- **Carmen**: Think faster. *[if]* `carmen_su_think`

## S.whereIsVasco

> the deduction: the calls first (Nieves has only his own note; the dig radio's dead; the lab has never had a disc, and its transfer sheets show six out, one a month since December), then thinking it through in order; the letter says the Sea strikes first at whoever understands the lock

- **Alan**: I don't know enough yet. Elena knew. Let me read what Elena knew. `alan_su_where_early`
- **Alan**: Can I use your phone? [pause] The hotel. `alan_su_phone`
  *the hotel: he puts the phone down on Nieves's question without answering it*
- **Nieves**: Hotel Cristina, buenos días. [pause] Señor Sanches. There is a message in Dr. Teles's pigeonhole. `nieves_su_1`
- **Nieves**: From you, señor. It says, 'Gone home. I'm sorry.' [pause] I have not given it to anyone. `nieves_su_2`
- **Alan**: Burn it. `alan_su_burn`
- **Nieves**: With pleasure. `nieves_su_burn`
- **Alan**: Nothing from him? Nothing at all? Since Friday? `alan_su_nothing`
- **Nieves**: Nothing, señor. I would have kept it for you. `nieves_su_3`
- **Nieves**: [pause] Señor Sanches. Is he all right? `nieves_su_4`
  *Carmen's calls: the museum (the dig radio), then the conservation lab*
- **Carmen**: The museum. The guard tried the dig radio twice. Nada. [pause] The camp's been silent since Friday morning. `carmen_su_museum`
- **Carmen**: The conservation lab. I asked how many discs from Risco Caído they've had since December. None. Nada. Not one, ever. `carmen_su_lab_1`
- **Carmen**: And the transfer sheets go back to December. Six discs, one a month. Rayco's signature on every one, and Vasco's under them, all in the same week. `carmen_su_lab_2`
- **Alan**: Six. Out of seven. `alan_su_six`
  *(he sits down with Elena's notebook and makes himself think, in order)*
- **Alan**: Lolo heard him. Saturday morning, on the radio: 'The discs aren't going to the lab. They're going down. Under.' And Baute told me he'd gone down on the guagua. `alan_su_lolo`
- **Alan**: Vasco went up on Friday, angry. He'd solve the cave the way Elena solved it. And Vasco can't look at a wrong thing and say nothing. Not for long. `alan_su_think_1`
- **Alan**: The radio's been dead since Friday. Not one message in two days, from a man who leaves notes about the coffee. `alan_su_think_2`
- **Alan**: And Yeray, in Rafa's sketchbook, while I was busy not listening: the discs go down to the lower vault at night. The old granary under the caves. And only Rayco has the key. `alan_su_think_3`
- **Alan**: He's at the camp, sulking. With the radio off. *[choice]* `alan_su_vasco_camp`
- **Carmen**: Vasco doesn't sulk with the radio off. Vasco sulks with the radio on, so you can hear him not calling. `carmen_su_camp_no`
- **Alan**: He's gone home. To Lisbon. Without me. *[choice]* `alan_su_vasco_lisbon`
- **Carmen**: His bags are at your hotel, cariño. Nobody leaves without their trowels. `carmen_su_lisbon_no`
- **Alan**: He's in the lower vault. The old granary under the caves, with the discs. *[choice]* `alan_su_vasco_vault`
- **Alan**: Vasco refused him something. He must have. Something about the light. `alan_su_vault_1`
- **Alan**: And Baute isn't a killer. He doesn't want to hurt anyone. He just wants it done. So he's put Vasco where he puts the things he can't let go of. `alan_su_vault_2`
- **Carmen**: The old granary. Rayco had a padlock put on that grille in May. For 'security', he said. [pause] Madre mía. `carmen_su_vault`
- **Alan**: And the letter: the Sea strikes first at whoever understands the lock. Elena read it right. Vasco will have read it too. [pause] Carmen. It'll be coming for him. `alan_su_sea_too`
  *(she's already picking up her keys)*
- **Carmen**: Shoes. Keys. Vamos. `carmen_su_go`
- **Carmen**: And bring water from the fridge. The radiator drinks more than I do. `carmen_su_water`

## room landrover

- **Alan**: Carmen, both hands on the wheel, a cigarette unlit in her mouth. The lighter's in her pocket. She hasn't the hands free for it. *[if]* `alan_look_carmen_driving`
- **Carmen**: The water, Alan! And slowly with the cap! *[if]* `carmen_lr_boil_talk`
- **Carmen**: Eyes on the road, cariño. If you see it before I do, shout. *[if]* `carmen_lr_talk`
- **Alan**: In the red. Past the red. In a part of the gauge they don't paint. *[if]* `alan_lr_gauge_red`
- **Alan**: The temperature gauge. A needle I don't like the look of, creeping towards the red. *[if]* `alan_lr_gauge`
- **Alan**: Steam out of the bonnet, white in the grey. Carmen's swearing at it. I've got the water. `alan_lr_steam`
- **Alan**: Steam out of the bonnet, white in the grey. Carmen's swearing at it. I've got the water. `alan_lr_steam`
- **Alan**: Black water round my ankles. It knows me. I can feel it knowing me. *[if]* `alan_lr_footwell`
  *the road under the wheels*
  *the stars over the sea of cloud*
  *then the beads and the cross swinging a little about the mirror with the road; the headlights' glow steady, its*
  *pool jolting with the bumps*
  *the rosary off the mirror, swinging with the road*
  *the headlights, jolting*

## S.drive

> out of Las Palmas at five, against the crowds going down to the beaches; up into the cloud; the radiator

- **Carmen**: Vámonos. `carmen_su_lets_go`
- **Narrator**: Five o'clock. The whole city going down to the beaches, and the Land Rover going the other way: up, into the cloud. `narr_lr_1`
- **Carmen**: Ten minutes in the cloud, cariño. Then we come out on top. `carmen_lr_1`
- **Alan**: Carmen. That needle. `alan_lr_1`
- **Carmen**: It's the radiator. It does this. [pause] Pretend you can't hear it. `carmen_lr_2`
- **Carmen**: Mierda. `carmen_lr_boil`
  *(the lay-by; the bonnet up, and a minute's swearing at it)*
- **Carmen**: Bueno. You brought the water. Hold this rag, and when I say, unscrew the cap. Slowly. If you do it fast it will boil your face off. `carmen_lr_water`

## S.fillRadiator

- **Alan**: Merda! [pause] Merda, merda. It didn't boil my face off. It boiled my hand. A little. `alan_lr_fill`
- **Carmen**: Elena used to do this. Every time we came up the mountain. I'd swear at it, and she'd hold the rag. `carmen_lr_go`
- **Carmen**: She'd say, it's not the car, Carmen, it's you. It can feel you hating it. [pause] She was probably right. `carmen_lr_go_2`
  *darker: the smell, the radio's waves; the Sea's water in the footwell, on his side only; Carmen drives through it*
- **Alan**: Carmen. [pause] Salt. Cold stone. Up here. `alan_lr_smell`
- **Carmen**: I know. I can smell it. `carmen_lr_smell`
  *(the waves under the radio's static, as Elena heard them on this road)*
- **Carmen**: Escucha. The radio. [pause] Under the static: waves. [pause] She heard them too. On this road. `carmen_lr_radio`
- **Alan**: Carmen. There's water in the footwell. [pause] Only on my side. `alan_lr_feet`
- **Alan**: It's me. It's come for me. I'm on the list. `alan_lr_me`
- **Alan**: It's at my knees. It's pulling, like the sea going out. [pause] The door won't open! `alan_lr_door`
- **Carmen**: Not him. Not this one. Not on my road. [pause] You've had yours. Not this one. `carmen_lr_through`
- **Alan**: Carmen... `alan_lr_carmen`
- **Carmen**: Hold the rag. Hold the rag, Alan. `carmen_lr_rag`
  *(the still: out of the cloud, the stars, the sea of cloud glowing orange along the coast)*
- **Narrator**: They came out of the cloud the way a swimmer comes up out of the sea: clean mountain air, and stars. The footwell was dry. `narr_lr_stars`
- **Carmen**: The bonfires. San Juan. They're lighting them now, along all the playas. The whole city's down there, by the sea. `carmen_lr_bonfires`
- **Alan**: [pause] All of them. On the beaches. `alan_lr_bonfires`
- **Carmen**: Twenty minutes. `carmen_lr_twenty`
  *the camp in the dark; iron ringing on stone below the cliff, and Yeray's voice*
- **Alan**: No lantern. No fire. The museum's Land Rover with its doors hanging open. [pause] Nobody. `alan_camp_su`
- **Yeray**: Come on! Come on! Come on! `yeray_su_1`
- **Carmen**: That's Yeray. [pause] Under the caves. The granary steps, past the finds table. Vamos. `carmen_su_here`

## S.vaultCutaway

> ---------------------------------------------------------------- the vault at dusk (cut away to): Vasco and Yeray

  *the bread and water Rayco sends, sees it, and drops the bottle)*
- **Narrator**: By the evening of Sunday, the water was at Vasco's chest. `narr_vy_1`
- **Yeray**: Madre de Dios. `yeray_vy_1`
- **Vasco**: Yeray. Listen to me. I haven't got long, so I'll only say it once. `vasco_vy_1`
- **Vasco**: You carried the discs. You've seen the empty sockets. You know what Rayco's going to do on Monday, at noon. `vasco_vy_2`
- **Vasco**: And you know what this is. Water doesn't stand up on its own, Yeray. This is what killed Dr. Suárez. You knew her. `vasco_vy_3`
- **Yeray**: She was kind to me. `yeray_vy_2`
- **Vasco**: She was. And it killed her because she understood the cave. It's killing me for the same reason. `vasco_vy_4`
- **Vasco**: And on Monday, when Rayco sends the sun back, it won't stop at me. It'll go down into the city. Onto the beach at Las Canteras, where half of Las Palmas will be asleep on the sand. `vasco_vy_5`
- **Vasco**: [pause] Where does your mother live, Yeray? `vasco_vy_6`
  *(Yeray says nothing; his face working)*
- **Vasco**: He's been like a father to you. I know. He was kind to me too. He made me coffee. `vasco_vy_7`
- **Vasco**: I'm not asking you to betray him. I'm asking you to stop him doing the one thing he will never forgive himself for. `vasco_vy_8`
- **Vasco**: There's a pick by the finds table. The bottom of the grille is almost free. I can't do the last of it from in here. You can. `vasco_vy_9`
  *(over his mouth)*
  *Yeray runs for the pick*

## room vault (arrival)

> ---------------------------------------------------------------- the vault, Sunday night: the rescue

  *(the cleft, Yeray at the grille with the pick, the water standing behind the bars at Vasco's face: all shown)*
- **Yeray**: Come on. Come on. ¡Vamos! `yeray_su_come`
- **Alan**: Vasco! [pause] Hold on. Hold on! `alan_vault_su`

## S.talkYerayVault

- **Yeray**: I carried el doctor down here. Saturday. Me and Dr. Baute. [pause] I'll tell the Guardia. All of it. *[if]* `yeray_su_after`
- **Yeray**: The grille! Pull when I lever! ¡Juntos! *[if]* `yeray_su_pull`

## S.talkVascoVault

- **Vasco**: [pause] Give me a minute. I'm breathing. It's a novelty. *[if]* `vasco_su_vault`
- **Alan**: He can't answer. The water's at his nose. [pause] Pull first. Talk later. *[if]* `alan_su_vasco_talk`

## S.talkCarmenVault

> (2026-10-30) the first heave, Alan and Yeray: it moves, and holds; it needs Carmen's weight on the pick handle too

- **Carmen**: Up. Vamos, all of you. Before I start crying in front of Yeray. *[if]* `carmen_vault_up`
- **Carmen**: The crates, cariño. Get the discs. I'll wrap them in my jacket. *[if]* `carmen_vault_after`
- **Carmen**: I've got the handle, cariño. Pull! *[if]* `carmen_vault_pull`

## S.tearGrille

- **Alan**: The grille, torn out and down on the stone. Three idiots and a pick. Four, counting Vasco, who did most of it. `alan_look_grille_off`
- **Alan**: Yeray, lever! Carmen, the handle! `alan_su_pull`
- **Yeray**: Again! ¡Otra vez! `yeray_su_2`
- **Alan**: It moved. It's not enough. [pause] Carmen! The handle, with Yeray! `alan_su_more_hands`
- **Alan**: It moved. It's not enough. [pause] Carmen! The handle, with Yeray! `alan_su_more_hands`
  *Carmen's weight on the pick handle with Yeray; the crack in the stone; the grille tears out and Alan pulls Vasco*
  *out under it (the open painting, Vasco on the stone); the water stands a moment, and sinks into the floor*
  *(out: the vasco_free figure, in front of the open alcove; a fresh cast, so he's swapped)*
- **Narrator**: Vasco on his back on the stone, coughing up the sea. Alan had a joke ready. He always had a joke ready. `narr_grille_5`
- **Narrator**: He didn't make it. `narr_grille_6`
- **Vasco**: You came. `vasco_su_out_1`
- **Alan**: You sent for me. `alan_su_out_1`
- **Vasco**: I asked for the idiot. [pause] I didn't think He'd actually send you. `vasco_su_out_2`
  *(his forehead against Vasco's; Yeray crying on the stone, Carmen's hand on him)*

## S.takeDiscs

> the granary, dry; five crates; Carmen's field jacket; the mark on the wall; then up to the rock

- **Vasco**: The museum's crates. I signed the sheets: 'Conservation transfer.' [pause] An obsidian disc in each, in straw. The missing nails. All here. *[if]* `vasco_look_crates`
- **Alan**: Vasco first. Then the discs. In that order, always, from now on. `alan_crates_first`
- **Alan**: Empty now. Good. `alan_crates_empty`
  *the five crates, a disc in straw in each; Carmen wraps them in her field jacket*
- **Alan**: Five discs. Heavy, cold, and my reflection in every one of them, looking frightened. `alan_su_discs`
- **Vasco**: Five. Rayco keeps the sixth on him. The sun never left its socket. `vasco_su_discs`
- **Alan**: On the wall by the grille, where anyone coming down would see it: seven little signs in a row. Moons, and a sun in the middle. [pause] And under them, small, an A. `alan_su_mark`
- **Alan**: Vasco in a blanket, with my coffee and his watch. He's stopped shaking. Mostly. *[if]* `alan_look_vasco_rock`
- **Vasco**: Five past two. Stay close. *[if]* `vasco_rock_again`
- **Alan**: Yeray, at the edge of the light, holding the pick as if he doesn't know what else to hold. *[if]* `alan_look_yeray_rock`
- **Yeray**: I'm sorry, doctor. [pause] I'm sorry. *[if]* `yeray_rock_1`
- **Vasco**: You came back with a pick, Yeray. That's the part I'll remember. *[if]* `vasco_rock_yeray`

## S.onTheRock

- **Narrator**: Past midnight, on a rock at the edge of the camp: a blanket round Vasco, Carmen's coffee, and slowly the shaking eased. `narr_rock_1`
- **Vasco**: Rayco. Where is he? `vasco_rock_1`
- **Alan**: At the cave. Yeray says. With a disc. Waiting for the sun. `alan_rock_1`
- **Vasco**: He went up to the cave this morning. I heard him through the rock. He was up there a long time. `vasco_rock_2`
- **Vasco**: Listen to me. Seven sockets, in the floor of the chamber under the cave. Six empty. The sun disc's still in the middle. At noon on Monday Rayco needs it tipped, square to the sun, to send the light back up and open the door. `vasco_rock_3`
- **Vasco**: He asked me how, and when. I didn't tell him. `vasco_rock_4`
- **Alan**: The signs on the wall. Seven of them. `alan_rock_2`
- **Vasco**: That's the other thing. How it shuts. Every disc in its own socket, the sun flat in the middle, the light on every triangle, and the lock closes. `vasco_rock_5`
- **Vasco**: The one Rayco wanted, I never wrote down. [pause] It's in here. Only in here. `vasco_rock_6`
- **Alan**: Can he guess it? `alan_rock_3`
- **Vasco**: He'll try. By hand, by eye. He won't get it exactly. But with six of the seven gone, the lock's so loose already that it might not need to be exact. Close might be enough. `vasco_rock_7`
- **Carmen**: Then why can't you do it, hombre? You know where every one of them goes. `carmen_rock_1`
- **Vasco**: Where, yes. Not when. The order's in a song, and I don't have the words. [pause] And the wall can only be read from above, and the discs can only be set from below. `vasco_rock_8`
- **Vasco**: So someone has to be down at the sockets. In the water. `vasco_rock_9`
  *(he looks at Alan)*
- **Alan**: It's coming for me anyway. I'd rather it found me doing something useful. `alan_rock_4`
  *(nobody says anything: Vasco understands it, and puts it away behind his eyes)*
- **Carmen**: What time is noon, cariño? `carmen_rock_2`
- **Vasco**: Five past two. By your watch. `vasco_su_dawn`
- **Vasco**: [pause] You brought my watch. `vasco_rock_watch`
  *(the watch, held out)*
- **Alan**: I was going to give it back to you. In Lisbon. `alan_rock_5`
- **Alan**: I went to the airport this morning, Vasco. I got as far as the desk. She asked me window or aisle. `alan_rock_6`
  *(he puts it on, slowly, with cold fingers)*
- **Vasco**: And you said? `vasco_rock_10`
- **Alan**: I said I'd left something behind. `alan_rock_7`
  *Vasco's head on his shoulder; and now the thing Alan has to say*
- **Alan**: Vasco. [pause] On Friday night. After you left... `alan_rock_friday`
- **Vasco**: Not now. `vasco_rock_11`
- **Vasco**: Whatever it is. I can feel you carrying it. You've been carrying something since you came down those steps. `vasco_rock_12`
- **Vasco**: Not now. After. Tell me after, if there's an after. [pause] I want to hear it when I can see your face. `vasco_rock_13`
  *(he holds on)*
- **Alan**: Why is he doing this? Baute. Rayco. *[choice]* `alan_rock_ask_why`
- **Vasco**: Tasarte. His grandmother's village, on the west coast. Caves in the hill above it, and in the caves, their dead. Five hundred years of them. `vasco_rock_tasarte_1`
- **Vasco**: In August 1966 a company sent in the bulldozers for a hotel. They put the bones in a skip. He picked some up off the road afterwards and kept them in a cardboard box under his bed for a year. `vasco_rock_tasarte_2`
- **Vasco**: The site manager was twenty-eight. Charming. He gave the boy a cigarette and told him not to take it personally. [pause] Ignacio Montesdeoca. Who doesn't remember. `vasco_rock_tasarte_3`
  *(Carmen's lighter: one try, this time)*
- **Carmen**: I knew he was angry. I studied under him, twenty years ago. He used to stand at the front of the lecture hall and talk about the conquest, and you could see it in him, like a coal. `carmen_rock_3`
- **Carmen**: I was angry too. I'm still angry. [pause] But I never thought... `carmen_rock_4`
- **Vasco**: He's not wrong. That's the worst of it. About Tasarte, about the bones. He's right about what was done to this island. He's only wrong about what to do. `vasco_rock_14`
- **Alan**: He's wrong about the sea. `alan_rock_8`
- **Alan**: He thinks it'll take the concrete and leave the people. It won't. It doesn't take orders. It does whatever it has to, to stay open, and it takes whatever's in its way. `alan_rock_9`
- **Alan**: And what's nearest is them. The whole city's down there tonight. On the beaches. By the sea. `alan_rock_10`
- **Alan**: Your trowel. Lorenzo's. *[choice]* `alan_rock_ask_trowel`
- **Vasco**: Snapped. Half the blade's somewhere under the floor of a granary. [pause] It did its job. It found something worth keeping. `vasco_rock_trowel`
- **Alan**: [pause] I'm not going to say anything. I want you to notice that I'm not saying anything. `alan_rock_trowel`
- **Alan**: We should go. *[choice]* `alan_rock_go`

## S.pathToCave

> "It's four o'clock." The path along the cliff in the dark; the breathing in the cave mouth; in. (Monday: mon.js)

- **Yeray**: It's four o'clock. `yeray_rock_time`
- **Vasco**: Then we'd better go. [pause] I'd like to talk to him first. Before the sun. `vasco_rock_go`
- **Narrator**: Four o'clock. The path along the cliff in the dark: Carmen first with the lantern, the discs in her jacket against Alan's chest. `narr_path_1`
  *(over the black: the cave mouth breathing, like surf a long way down)*
