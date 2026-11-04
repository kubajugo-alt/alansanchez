# Tuesday 18 June

From `js/story/tue.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## room gando

> ================================================================ GANDO

  *the sky over the apron through the glass (between the mullions, above the Iberia tail), a gull or two*
  *the empty belt going round ("The belt goes round. My suitcase doesn't."): its slats sliding by*
  *the strip light hums; the palm by the taxi door stirs in the street air*
- **Alan**: Vasco. A month on the island and he's brown as a saddle. He looks like a man who's slept four hours a night and never been happier in his life. *(no recording)* `alan_look_vasco_gando`
- **Alan**: The Iberia desk. The same woman who sent my suitcase to Madrid on Tuesday. Everything about leaving is very easy. `alan_look_clerk`
- **Alan**: Nothing on the belt. Nothing coming. That's me. I'm the luggage. *[if]* `alan_look_belt_sun`
- **Alan**: The belt goes round. My suitcase doesn't. It's having a lovely time in Madrid without me. *[if]* `alan_look_belt`
- **Alan**: Nothing on the belt. Nothing coming. That's me. I'm the luggage. *[if]* `alan_look_belt_sun`
- **Alan**: I'm not watching it again. I have some pride. Not much. Some. *[if]* `alan_use_belt_2`
- **Alan**: I'll wait one more lap. [pause] That was the lap. It's gone. *[if]* `alan_use_belt`
- **Alan**: Lisbon, via Madrid. Eleven fifteen. On time. Of course it's on time. *[if]* `alan_look_board_sun`
- **Alan**: Madrid, Lisbon, Düsseldorf, Manchester. Half of Europe comes here to turn pink. I give myself a day. *[if]* *(no recording)* `alan_look_board`
- **Alan**: Not without Vasco. He's here somewhere, looking pleased with himself. *[if]* `alan_taxi_wait`
- **Alan**: The doors out to the taxis. The city's back that way, under the cloud. And above the cloud, the mountains. *[if]* `alan_look_back`

## S.kissAtGando

> the kiss: one figure (the two of them, Ludo) on Alan's feet while they are hidden; in, held, back to where they stood

- **Narrator**: He kissed him, quickly and firmly, on the mouth, in front of a taxi driver, two nuns and a family from Düsseldorf. `narr_t_kiss`

## S.meetVasco

- **Vasco**: You're here. `vasco_t_hello`
- **Alan**: I'm here. [pause] In front of two nuns and a family from Düsseldorf, apparently. My trousers are not entirely here. My suitcase is in Madrid. `alan_t_hello`
- **Vasco**: Madrid. `vasco_t_luggage`
- **Vasco**: Madrid can keep it. [pause] Come here. Twenty-five days. I counted them. I'm an archaeologist, I count things. *(no recording)* `vasco_t_missed`
- **Alan**: You smell of dust and sun cream and coffee. `alan_t_missed`
- **Vasco**: [laughs softly] I live in a cave now. [pause] I've missed you. It's stupid, how much. `vasco_t_missed_2`
- **Alan**: Not stupid. [pause] Well. A bit stupid. Do it again. `alan_t_missed_2`
- **Alan**: I've been standing here for twenty minutes. `alan_t_luggage`
- **Vasco**: I know. I'm sorry. We found something in the chamber under Cave 6 this morning. Marks in the floor, very small, by the sockets. I think they're for the equinox, and I couldn't leave until we'd drawn them. `vasco_t_sorry`
- **Vasco**: You'll see it. Not tomorrow. Thursday, perhaps. Rayco wants everything recorded before anyone else goes in. `vasco_t_cave`
- **Vasco**: Alan, the light. Wait until you see what the light does in there. At noon it comes straight down through the roof like a column, and every triangle on the wall lights at once, like someone reading a sentence out loud. `vasco_t_light`
- **Alan**: Rayco. `alan_t_cave`
- **Vasco**: Dr. Baute. The director. You'll meet him tonight. `vasco_t_rayco`
- **Alan**: You call him Rayco. `alan_t_rayco`
- **Vasco**: [pause] He asked me to. `vasco_t_rayco_2`
- **Alan**: Of course he did. `alan_t_proud`
- **Vasco**: Come on. I've moved out of the university flat for the week. We're at a hotel on the beach. It isn't a good hotel. You'll love it. `vasco_t_go`
  *the drive north, under the edge of the cloud (heard over black)*
- **Narrator**: Halfway to Las Palmas they drove under the edge of the cloud, and the light changed as if someone had closed a lid. `narr_t_drive_1`
- **Alan**: Is it going to rain? `alan_t_rain`
- **Vasco**: It never rains. It's the panza de burro. The donkey's belly. `vasco_t_panza_1`
- **Vasco**: Every June the trade winds pile the cloud up against the north of the island, and it just sits there. Down in the city it's grey and warm and close, like living in a steam room. And up in the mountains, above it, it's blazing sun. `vasco_t_panza_2`
- **Vasco**: Every morning I drive up through it. Ten minutes of fog, and then you come out on top, and the whole cloud is underneath you like a white sea. All the way to the horizon. [pause] You'll see it. `vasco_t_panza_3`
- **Alan**: Thursday, perhaps. `alan_t_thursday`
- **Vasco**: Thursday. I promise, amor. [pause] Give me that knee. It's coming out of your trousers. `vasco_t_knee`

## room hotel_lobby

  *the painting is the lobby at night; by day the street windows show the promenade under the cloud (hotel_lobby_day,*
  *the wall lantern's flame and the desk lamp*
- **Alan**: She saw me come in, in last night's clothes. Her eyebrow didn't move. That's how I know how bad I look. *[if]* `alan_look_nieves_sat`
- **Alan**: Nieves. A bun so tight it looks structural, and an eyebrow that could run the hotel on its own. *[if]* `alan_look_nieves`
- **Nieves**: The hotel can't keep that for you, señor. Or won't. `alan_fail_nieves_item`
- **Alan**: Odd socks, a snorkel and someone's novel with the last chapter torn out. Merciful. *[if]* `alan_look_lostfound_2`
- **Alan**: Four jackets. A ski anorak, a child's, a linen thing that's been on a smaller man. And a navy blazer with brass buttons. Beautiful. It isn't mine. Yet. *[if]* `alan_look_lostfound`
- **Alan**: Not with Nieves watching. She'd have me in the lost and found. *[if]* `alan_use_lostfound`
- **Alan**: Not with Nieves watching. She'd have me in the lost and found. *[if]* `alan_use_lostfound`
- **Alan**: A fax machine, behind the desk. The hotel's window on the world, and Nieves holds the key. `alan_look_fax_machine`
- **Alan**: I can't fax air. I need something to send. And Nieves to press the button. `alan_use_fax_machine`
- **Alan**: The house phone. For room service and complaints. I could use both. `alan_look_house_phone`
- **Alan**: The lift. It announces each floor with a sound like a sneeze. I like it already. It's the only thing here that's as tired as I am. `alan_look_lifts`
- **Alan**: Not yet. One more call first. Inês should know. *[if]* `alan_lift_call`
- **Alan**: Two o'clock. Nieves has the keys and the eyebrow. I'm not arguing with either of them. *[if]* `alan_lift_checkin`
- **Alan**: No point going up. Everything I own is in Madrid. I need a jacket first. *[if]* `alan_lift_tue`

## S.lobbyArrival

- **Vasco**: The owner pays for the dig, so the dig gets a rate. Cheap. [pause] The lift sneezes. You'll get used to it. *(no recording)* `vasco_t_hotel`
- **Nieves**: Señor Sanches. Welcome. [pause] Your luggage has not arrived. `nieves_t_hello`
- **Alan**: No. `alan_t_nieves_1`
- **Nieves**: And you have. `nieves_t_1`
- **Alan**: Two millimetres of eyebrow. [pause] I've been reviewed. `alan_t_eyebrow`
- **Nieves**: Your room will be ready at fourteen hundred, señor. Check-in is at two. `nieves_t_checkin`
- **Alan**: It's twelve o'clock. `alan_t_checkin`
- **Nieves**: Then you have two hours to enjoy Las Palmas. [pause] The beach is outside. It is very difficult to miss. `nieves_t_checkin_2`
- **Vasco**: There's a reception tonight. At the museum. Jacket required. `vasco_t_lobby_1`
- **Vasco**: I have to take the drawings back to Rayco. Go to the beach, it's right there. [pause] Eight o'clock, El Museo Canario. A jacket. Please don't be late. It matters, this one. `vasco_t_lobby_go`

## S.talkNieves

- **Nieves**: Señor. You have been to la playa. [pause] All of you, I think. Every part that the hotel can see. *[if]* `nieves_t_burnt_look`
- **Alan**: Not every part. [pause] Oh, God. Forget I said that. Please. *[if]* `alan_t_shy_nieves`
- **Alan**: Is there any chance the room's ready a little early? *[choice]* `alan_ask_room_early`
- **Nieves**: At two, señor. The clock is behind you, if you would like to watch it. *[if]* `nieves_room_early`
- **Alan**: I don't suppose the hotel has a lost and found? Somewhere I might find a jacket that's lost its way? *[choice]* `alan_ask_lostfound`
- **Nieves**: Lost property is returned to its owner, señor. The owner describes it. That is how we know he is the owner. *[if]* `nieves_lostfound`
- **Alan**: I seem to have lost a blazer. Navy. Brass buttons. Very sad about it. *[choice]* `alan_claim_blazer`
- **Alan**: Any messages for me? *[choice]* `alan_ask_message`
- **Nieves**: No message from Dr. Teles, señor. [pause] None. *[if]* `nieves_no_message_sat`
- **Nieves**: Dr. Teles left at half past five, señor. No message. [pause] He looked at the stairs for some time first. *[if]* `nieves_message_fri`
- **Nieves**: No message, señor. Dr. Teles left at six. With an apple. *[if]* `nieves_message_day`
- **Alan**: Could you fax something to Lisbon for me? *[choice]* `alan_ask_fax`
- **Nieves**: Give me what you want sent, señor, and the number. The hotel charges by the page. The hotel charges for everything. *[if]* `nieves_fax_how`
- **Alan**: Has a fax come for me? From Lisbon? *[choice]* `alan_ask_fax_in`
- **Alan**: Is it always this grey in June? I was promised sun. *[choice]* `alan_ask_nieves_island`
- **Nieves**: June is the panza de burro, señor. The donkey's belly. Grey on the coast, sun on the mountain. You have to go up for the sun. `nieves_island`
- **Alan**: Thank you, Nieves. *[choice]* `alan_bye_nieves`
- **Nieves**: Señor. `nieves_bye`

## S.claimBlazer

- **Nieves**: Of course, señor. And in the pocket? `nieves_pocket`
- **Alan**: A cigar band. Montecristo. I've given them up, I keep the bands for the memories. *[choice]* `alan_pocket_cigar`
- **Nieves**: [pause] Montecristo. Of course. [pause] Please return it to us when its owner finds you, señor. *(no recording)* `nieves_blazer_ok`
- **Nieves**: And your key, señor. Four-oh-four. Dr. Teles's bag went up at two. `nieves_t_key`
- **Alan**: My dignity. *[choice]* `alan_pocket_dignity`
- **Nieves**: We don't keep that, señor. Nobody hands it in. `nieves_pocket_dignity`
- **Alan**: Nothing at all. I'm a minimalist. *[choice]* `alan_pocket_nothing`
- **Nieves**: Then it isn't yours, señor. `nieves_pocket_nothing`

## S.talkGail

- **Gail**: Have you tried the papas arrugadas? Wrinkly potatoes. Derek won't. *[if]* `gail_t_again`
- **Gail**: Oh, you're Portuguese! We did Portugal. Didn't we, Derek? Lovely tiles. *[if]* `gail_t_1`
- **Derek**: Too many hills. *[if]* `derek_t_1`
- **Gail**: The Mercado del Puerto, love. By the park. Go on, before you blister. *[if]* `gail_t_burn_again`
- **Gail**: Oh, love. Look at you. Derek, look at him. *[if]* `gail_t_burn_1`
- **Derek**: Lobster. *[if]* `derek_t_burn`
- **Gail**: You want aloe vera. Not the green jelly from the chemist, the real thing, the plant. There's a market by the park, the Mercado del Puerto. The lady with all the plants. She did my shoulders on Saturday. *[if]* `gail_t_burn_2`
- **Alan**: Thank you. Both of you. [pause] Is it very bad? *[if]* `alan_t_burn`
- **Derek**: Lobster. *[if]* `derek_t_burn_2`
- **Gail**: Oh, that's better. You smell like a garden centre. `gail_t_aloe`
- **Gail**: Mind you, there's a lovely pair of shoulders under all that red. Isn't there, Derek? `gail_t_shoulders`
- **Derek**: Lobster. `derek_t_burn_2`
- **Alan**: Oh. Gosh. [pause] I'll just stand behind the potted palm for a bit. `alan_t_shy_gail`
- **Alan**: Now all I need is a jacket. There's a reception tonight, and my luggage is in Madrid. `alan_t_jacket`
- **Gail**: A jacket! There was a gentleman left a lovely navy blazer on the hotel terrace on Saturday. Derek nearly walked off with it. It smelled of cigars. They'll have it behind the desk, I should think. `gail_t_blazer`
- **Derek**: Montecristo. Number Four. `derek_t_cigar`
- **Alan**: Derek knows his cigars. `alan_t_gail`
- **Gail**: Have you tried the papas arrugadas? Wrinkly potatoes. Derek won't. `gail_t_again`
- **Gail**: I'm going to sit by the pool. Pools don't do anything funny. *[if]* `gail_w_again`
- **Gail**: Ooh, look at you, love. Brown as a conker overnight. Derek, why don't you go brown like that? [pause] Don't answer. *[if]* `gail_w_1`
- **Gail**: We're going down to the beach tonight for the bonfires! They say everyone walks into the sea at midnight. Derek's bought new trunks. *[if]* `gail_su_1`
- **Derek**: Union Jack. Matching. *[if]* `derek_su_1`

## S.dressTue

> Tuesday, room 404: Vasco's good jeans from his bag, then the stranger's blazer (the user, 2026-10-29: "he should go to the room, get the jeans from Vasco's bag and then put the jacket on"; "they are tight... biting into his balls")

- **Alan**: Vasco's field bag. Trowels, brushes, notebooks, a compass and one apple. The man is a monk with a mortgage. *[if]* `alan_look_fieldbag`
- **Alan**: Vasco's bag. His good jeans are in here. He's an inch taller, and he'll never let me forget it. [pause] Beggars can't be choosers. `alan_look_fieldbag_jeans`
- **Alan**: These are tight. These are cruelly tight. [pause] Every step, they bite me in the balls. I'm going to the museum like a cowboy with a secret. `alan_t_jeans_tight`
- **Alan**: I'll stand up straight. I'll be a whole new man. [pause] A whole new man with short arms. `alan_blazer_on`

## S.talkDerek

- **Derek**: Lobster. *[if]* `derek_t_burn_2`
- **Derek**: Forty quid this camcorder. And she won't let me film anything interesting. *[if]* `derek_t_2`
- **Alan**: Film the sea. Nobody can stop you filming the sea. *[if]* *(no recording)* `alan_t_derek`
- **Derek**: Filmed the sea this morning like you said. Came in backwards. Gail says I had the camera upside down. *[if]* `derek_w_1`
- **Derek**: Midnight. Into the sea. Forty quid camcorder, waterproof bag. I'm ready. *[if]* `derek_su_2`

## S.fax

> the fax machine behind the desk: Nieves sends things to Lisbon (the number's on Alan's card)

- **Nieves**: That has already gone, señor. Twice would be extravagant, even for a Portuguese. `nieves_fax_done`
- **Alan**: This rubbing, please, to Livraria Sanches, Lisbon. The number's on my card. *[if]* `alan_fax_inscription`
- **Alan**: And this. Eight pages, both sides, carefully. On the cover sheet: 'Inês. Sorry. Can you read this? It's urgent. A.' *[if]* `alan_fax_letter`
- **Nieves**: All sent, señor. Lisbon has already replied: one word, 'OBRIGADA', in capitals. It did not look grateful. *[if]* `nieves_fax_both`
- **Nieves**: Sent, señor. At hotel prices, I hope it was a love letter. *[if]* `nieves_fax_one`

## S.housePhone

- **Alan**: The dig camp. It rings and rings. Nobody. The radio's off, or somebody's turned it off. *[if]* `alan_dig_no_answer`
- **Alan**: Room service? No. I'll save my pesetas for Inês. `alan_use_house_phone`

## room hotel_room

  *through the open balcony door: the lid of cloud drifting, the bay moving, the surf on the far beach*
  *the air off the sea: the curtains breathe, the fan turns slowly*
  *(the lid of cloud through the balcony door, after the curtains)*
- **Alan**: Vasco, on the bed, reading. He reads in bed like other men breathe. `alan_look_vasco_room`
  *Tuesday night: up from the promenade, showered, on the bed in a towel ("Take off that terrible jacket. And come*
  *here."); he speaks from here (speaker), until the still*
- **Alan**: Vasco, on the bed, reading. He reads in bed like other men breathe. *[if]* `alan_look_vasco_room`
- **Alan**: The sea, the beach, the grey lid of cloud. And a bonfire, half built, for something. *[if]* `alan_look_window_1`
- **Alan**: The beach, a morning. Two bonfires now. They're building them like they mean it. *[if]* `alan_look_window_2`
- **Alan**: Grey again. The tide's higher than it was. I'm noticing tides. That's never a good sign. *[if]* `alan_look_window_3`
- **Alan**: A lorry of pallets going by for the bonfires. No Land Rover. *[if]* `alan_look_window_4`
- **Alan**: I can't look at the sea this morning. It's looking back. *[if]* `alan_look_window_5`
- **Alan**: The bonfires are taller than the lifeguard tower. The tide's on the sixth step. Nobody's looking at it. *[if]* `alan_look_window_6`
- **Alan**: The city's birthday. Everyone down there thinks it's an ordinary day. *[if]* `alan_look_window_7`
- **Alan**: Unmade on Vasco's side, from yesterday morning. His jacket on the chair, shoulders squared. His watch, forgotten. *[if]* `alan_look_bed_sat`
- **Alan**: The bed. Eight months of sharing one and I still sleep on the edge, like a guest. *[if]* `alan_look_bed`
- **Alan**: Unmade on Vasco's side, from yesterday morning. His jacket on the chair, shoulders squared. His watch, forgotten. *[if]* `alan_look_bed_sat`
- **Alan**: Not now. If I lie down I'll think, and I've been avoiding that all week. *[if]* `alan_use_bed`
- **Alan**: 'Coffee by the bed. It's terrible. Go and see the island. V.' [pause] He put a kiss and crossed it out and put it back. *[if]* `alan_look_vnote`
- **Alan**: 'Coffee by the bed. It's terrible. Go and see the island. V.' [pause] He put a kiss and crossed it out and put it back. *[if]* `alan_look_vnote`
- **Alan**: Vasco's bag. His good jeans are in here. He's an inch taller, and he'll never let me forget it. [pause] Beggars can't be choosers. *[if]* `alan_look_fieldbag_jeans`
- **Alan**: Vasco's field bag. Trowels, brushes, notebooks, a compass and one apple. The man is a monk with a mortgage. *[if]* `alan_look_fieldbag`
- **Alan**: My bag. Packed at five in the morning, by my hands, without me. *[if]* `alan_look_packed`
- **Alan**: Not now. He's talking. For once I should listen. *[if]* `alan_door_fight`
- **Alan**: I have to decide first. Where I'm going. Who I am, roughly. *[if]* `alan_door_choice`

## room canteras

> ================================================================ LAS CANTERAS The visible clocks: the tide one step higher on the promenade every day; the San Juan bonfires taller every day.

  *the panza de burro drifting over the bay, gulls, the sea moving and the foam on the shore*
  *the palms by the hotel and the newspapers pegged on the kiosk*
  *the cloud and the gulls last, through the painted sky only (the palms pass in front)*
- **Alan**: Vasco, still lit up from the party. He hasn't stopped talking about the light since the door. *[if]* *(no recording)* `alan_look_vasco_walk`
- **Vasco**: Alan. *[if]* `vasco_t_walk_alan`
- **Alan**: A round man with a magnificent moustache and a transistor radio held to one ear. He's listening to the football and watching everything else. `alan_look_chano`
- **Chano**: Keep them for the phone. It's hungrier than me. `chano_coins`
- **Chano**: I don't buy, hombre. I only sell. And gossip. *(no recording)* `chano_any`
  *one of the set alan_look_bonfire_ (6), chosen in the code:*
- **Alan**: A pile of pallets on the sand. *[set]* `alan_look_bonfire_1`
- **Alan**: Bonfires for San Juan, on Sunday night. Two of them. Children dragging old furniture down the beach. *[set]* `alan_look_bonfire_2`
- **Alan**: Five bonfires now, taller than a man. The city's building fires to welcome the shortest night. *[set]* `alan_look_bonfire_3`
- **Alan**: Three times the height of a man. A straw figure on top in somebody's hat. He burns on Sunday night. *[set]* `alan_look_bonfire_4`
- **Alan**: Families are already claiming their places for tomorrow night. Towels, cool boxes, folding chairs, round the bonfires. Right down by the water. *[set]* `alan_look_bonfire_5`
- **Alan**: Tonight they burn. And tomorrow, at noon, the door opens. Unless. *[set]* *(no recording)* `alan_look_bonfire_6`
- **Alan**: A phone box with a view of the sea. Coins only. Every call to Lisbon costs a hundred pesetas and some dignity. `alan_look_phonebox`
- **Alan**: It takes coins. Only coins. The one honest machine on the island. `alan_fail_phone_item`
- **Alan**: Newspapers pegged on a line, sweets, cigarettes, postcards of the beach looking sunnier than the beach. `alan_look_kiosk`
  *(the promenade, the kiosk and the phone box are painted: no narration)*

## S.lookSea

- **Alan**: The mist lies along the waterline like something asleep. The wind's blowing out to sea. It isn't going anywhere. *[if]* `alan_look_sea_mist`
- **Alan**: Grey sea under a grey sky. The Atlantic in its office clothes. *[if]* `alan_look_sea_1`
- **Alan**: The tide came in at ten this morning. The tide table on the promenade says three. *[if]* `alan_look_sea_2`
- **Alan**: A man drowned in his bed a month ago, with the window shut, and the sea looks innocent. That's how you know. *[if]* *(no recording)* `alan_look_sea_3`
- **Alan**: I don't look at it for long any more. *[if]* `alan_look_sea_4`
- **Alan**: I don't want to look at it. It's looking at me. It knows what I did last night. It doesn't care, which is worse. *[if]* `alan_look_sea_5`
- **Alan**: The tide's at the top step. The bonfires are on the sand below it. *[if]* `alan_look_sea_6`
- **Alan**: Flat. Ordinary. Blue, even. *[if]* `alan_look_sea_7`
- **Alan**: When did surfers get so young? [pause] Oh. When I didn't. `alan_surf_1`
- **Alan**: I could do that. [pause] I could absolutely not do that. `alan_surf_2`
- **Alan**: Looking is free. Looking is also, apparently, all I do now. `alan_surf_3`
- **Alan**: Vasco would say they're fine examples of the human form. Vasco would be right. `alan_surf_4`

## S.lookSurfers

- **Narrator**: He doesn't look at them. *[if]* `narr_surf_after`
  *(no joke: the absence of a joke is the joke failing)*
- **Alan**: I've looked. I'm done looking. For today. *[if]* `alan_surf_again`

## S.talkSurfers

- **Surfer**: No wind and the swell's up, man. Doesn't make sense. *[if]* `surfer_bark_1`
- **Surfer**: The waves are coming in backwards, man. Swear to God. *[if]* `surfer_bark_2`
- **Surfer**: Nobody's going out at dusk. That fog. Smells like a fish market in hell. *[if]* `surfer_bark_3`
- **Surfer**: Solstice session! [pause] Nah. Look at it. Nah. *[if]* `surfer_bark_4`
- **Surfer**: My cousin in La Isleta says the sea's giving stuff back. Old stuff. Cannonballs. *[if]* `surfer_bark_5`
- **Surfer**: We're going up to Pico de las Nieves tonight. Above the cloud. Something's wrong down here. *[if]* `surfer_bark_6`
  *Tuesday: as if the surfer had said something rude to it, the cloud tears open*
- **Surfer**: Hey, the red guy! Nice tan, man. [pause] Nice everything, actually. You surf? *[if]* `surfer_t_alan`
- **Alan**: Not with a board. [pause] But I'm a very fast learner, if someone's prepared to show me. *[if]* `alan_t_flirt_surfer`
- **Alan**: Two hours to kill, a beach, and the sun, apparently, by appointment. [pause] Vasco would say sun cream. Vasco isn't here. *[if]* `alan_t_sun_1`

## S.sunbathe

- **Alan**: Towels laid out and abandoned. In Lisbon that's a crime scene. Here it's a Tuesday. `alan_look_towels`
  *(facing us in his underwear)*
- **Alan**: Five minutes. Just five. `alan_t_sun_2`
- **Narrator**: It was not five minutes. `narr_t_sun_3`
  *the cloud is back, it's ten past four, and he's the colour of a postbox*
- **Alan**: Oh, no. [pause] Oh, no, no. I'm the colour of a postbox. A Portuguese postbox. `alan_t_burnt`
  *(back into his clothes, very carefully)*

## S.buyPaper

> Chano: change for the phone, a paper a day, gossip and the weather Tuesday: change for Lisbon, a paper for the good rate, and a secret for free

- **Alan**: I need change. For the telephone. To call Lisbon. `alan_t_chano_1`
- **Chano**: Lisbon. [pause] That's a lot of coins. `chano_t_lisbon`
- **Alan**: I know. `alan_t_chano_2`
- **Chano**: You're with el doctor. The Portuguese doctor, at the dig. The one who smiles. `chano_t_doctor`
- **Alan**: How do you know that? `alan_t_chano_3`
- **Chano**: I'm Chano. [pause] You buy a newspaper, I give you a good rate. You don't buy a newspaper, I give you the tourist rate. `chano_hello`
- **Alan**: I'll buy a newspaper. `alan_buy_paper`
- **Chano**: Good. Six coins for the box. [pause] Now I tell you a secret, for free. `chano_change`
- **Chano**: Don't swim after dark this week. `chano_t_secret`
- **Alan**: Why not? `alan_t_chano_why`
- **Chano**: The sea's in a bad mood. My knees can tell. `chano_t_knees`
- **Alan**: The lady at the market said 'chacho' at me. Was that bad? `alan_t_chacho`
- **Chano**: Chacho? [laughs] Chacho is everything, man. Chacho, look at that. Chacho, what are you doing. Chacho, five thousand pesetas! [pause] You'll be saying it by Friday. `chano_t_chacho`

## S.talkChano

- **Chano**: I'm Chano. [pause] You buy a newspaper, I give you a good rate. You don't buy a newspaper, I give you the tourist rate. `chano_hello`
- **Chano**: Chacho, look at you! In that jacket you look like a film star. [pause] A film star with short arms, but a film star. *[if]* `chano_t_filmstar`
- **Alan**: Careful, Chano. Keep talking like that and I'll buy two newspapers. *[if]* `alan_t_flirt_chano`
- **Alan**: Could you break a five-thousand note? I need coins for the phone. *[choice]* `alan_ask_change`
- **Alan**: I'm out of coins again. Lisbon is very talkative. *[choice]* `alan_ask_change_again`
  *one of the set chano_change_again_ (6), chosen in the code:*
- **Chano**: Four more. Tell her she's lucky. *[set]* `chano_change_again_1`
- **Chano**: Four coins. You know, a postcard is cheaper. And it doesn't talk back. *[set]* `chano_change_again_2`
- **Chano**: Again? Four. Pepe Santana used to buy his paper here. [pause] Four coins. *[set]* `chano_change_again_3`
- **Chano**: Four. You look like a man who needs to talk to someone. Good. Talk. *[set]* `chano_change_again_4`
- **Chano**: Four. And on the house, a little advice: eat something. *[set]* `chano_change_again_5`
- **Chano**: Four. For the last day. If it's the last day. *[set]* `chano_change_again_6`
- **Alan**: Today's paper, please. *[choice]* `alan_ask_paper`
- **Chano**: La Provincia. All the news that fits. *[if]* `chano_paper`
- **Alan**: A packet of Coronas, please. *[choice]* `alan_ask_cigs`
- **Chano**: Coronas? For la doctora up at the museum, I bet. Twenty years she's been smoking my Coronas. Tell her Chano says hola. `chano_cigs`
- **Alan**: What's the news that doesn't fit? *[choice]* `alan_ask_gossip`
  *one of the set chano_gossip_ (6), chosen in the code:*
- **Chano**: The museum is having a fiesta for its rich friends. Montesdeoca will be there, laughing louder than the band. *[set]* `chano_gossip_1`
- **Chano**: You want to see the real Las Palmas, go to La Isleta. The tourists don't go. The fishermen are still there. My mother's family is from there. They'll rob you, hombre, but honestly. *[set]* `chano_gossip_2`
- **Chano**: Tonight the museo has its big dinner. Montesdeoca's paying. My cousin's wife's sister is doing the canapés: papas arrugadas for eighty, and he wants them in the shape of his hotels. *[set]* `chano_gossip_3`
- **Chano**: The surfers say the waves come in backwards. Surfers say a lot of things. This one, I believe. *[set]* `chano_gossip_4`
- **Chano**: Have you seen La Provincia? Somebody counted. Six drowned since Christmas, and not one of them near the water. *[set]* `chano_gossip_5`
- **Chano**: Last night La Isleta had el mar in its streets. No rain. No wind. Tonight is San Juan. We'll all go down and walk into the water at midnight. [pause] Maybe not this year. *[set]* `chano_gossip_6`
- **Alan**: And the forecast? *[choice]* `alan_ask_weather`
  *one of the set chano_weather_ (6), chosen in the code:*
- **Chano**: Panza de burro. Grey, warm, all week. Go up the mountain if you want sun. *[set]* `chano_weather_1`
- **Chano**: Grey. A little mist at dusk. Normal. [pause] Not normal. *[set]* `chano_weather_2`
- **Chano**: Grey. The mist again, lower. My knees say rain. My knees are liars. *[set]* `chano_weather_3`
- **Chano**: The solstice. Longest day, grey all of it. And that black fog at dusk. My radio fizzes when it comes. *[set]* `chano_weather_4`
- **Chano**: Don't go near the water tonight. That's not a forecast. That's my abuela. *[set]* `chano_weather_5`
- **Chano**: Bonfires at midnight. And something else. I don't know what. I've never not known. *[set]* `chano_weather_6`
- **Alan**: Chano, how does a man get up the mountain? To Artenara? *[choice]* `alan_ask_chano_guagua`
- **Chano**: La guagua. Once a day, chacho, seven in the morning, from San Telmo. Miss it and you walk. Or you marry someone with a car. *[if]* `chano_s_guagua`
- **Alan**: Chano. What happened at Tasarte in 1966? *[choice]* `alan_ask_chano_tasarte`
- **Alan**: The lady at the market said 'chacho' at me. Was that bad? *[choice]* `alan_t_chacho`
- **Chano**: Chacho? [laughs] Chacho is everything, man. Chacho, look at that. Chacho, what are you doing. Chacho, five thousand pesetas! [pause] You'll be saying it by Friday. `chano_t_chacho`
  *a postcard to Inês (Tuesday): bought here, written in the inventory, posted here*
- **Alan**: Do you sell postcards? And stamps? *[choice]* `alan_ask_postcard`
- **Chano**: Postcard and a stamp, sixty pesetas. Las Canteras at sunset. [pause] On the postcards we have sun every day. `chano_postcard`
- **Alan**: Thanks, Chano. *[choice]* `alan_bye_chano`
- **Chano**: Go with God, and with coins. `chano_bye`

## S.postCard

> the postcard: written from the inventory (a look), posted at the kiosk (Chano gives it to the postman at five)

- **Alan**: Written. Now it just has to get to Lisbon before I do. `alan_postcard_written`
- **Chano**: The postman comes at five. [pause] I won't read it. I'll only look at the picture. `chano_postcard_post`

## S.walkTue

> after nine: the walk on the promenade, the bonfire for San Juan, and the black mist, against the wind, under the grey panza de burro. Only Alan knows the smell, and he doesn't say.

  *says what it is to himself, and nothing to Vasco)*
- **Narrator**: After nine, on the promenade, and Vasco still talking about the light. Alan let him. It was like standing next to a fire. `narr_t_walk_1`
- **Alan**: Let's walk. I've only seen the beach lying down. *(no recording)* `alan_t_walk_1`
- **Alan**: What are they building? [pause] It looks like a furniture shop fell over and somebody's very proud of it. `alan_t_walk_pyre`
- **Vasco**: For San Juan. Sunday night. They light bonfires all along the beach and the whole city comes down to the sea. You jump over the fires for luck, and at midnight you go into the water. `vasco_t_sanjuan_1`
- **Vasco**: Rayco says the beach looks like it's burning from end to end. `vasco_t_sanjuan_2`
- **Alan**: Rayco says. `alan_t_walk_2`
- **Vasco**: Alan. `vasco_t_walk_alan`
- **Alan**: I'm teasing. [pause] Will we be here for it? `alan_t_walk_3`
- **Vasco**: I'll be on the mountain. Noon on the twenty-fourth is the whole point. It's the day the light turns back. [pause] But you could come up. You could see it with me. `vasco_t_sanjuan_3`
- **Alan**: I could. `alan_t_walk_4`
  *the surf on the reef, and then not: the mist has reached it*
- **Alan**: That isn't the panza. [pause] It's black. Lying on the sea like smoke. And it's coming in against the wind. `alan_mist_1`
- **Alan**: Salt. Cold stone. Rust. [pause] Old, deep water that's never seen the sun. `alan_mist_2`
- **Alan**: I know that smell. The cistern under Lisbon, up to my chest in black water. [pause] It knew whose blood I had. And it let me go. `alan_mist_lisbon`
- **Vasco**: Alan? [pause] What is it? `vasco_t_mist_1`
- **Alan**: Nothing. I'm tired. And I think I'm sunburnt in places I didn't know I had. `alan_mist_3`
- **Vasco**: I'm going up. Shower. [pause] Don't be long. `vasco_t_walk_up`

## room museum_hall

  *the hanging lanterns' flames*
  *the courtyard through the open door: its plants stir; cigarette smoke drifting in from the steps (Carmen's)*
- **Alan**: Tall, thin and very still. A sponsor's suit and a digger's hands. When he looks at you, you feel looked at. *[if]* `alan_look_baute`
- **Alan**: I can't just walk up to the man who runs the place and say hello, I'm the boyfriend. [pause] Vasco should introduce me. Vasco said he would. *[if]* `alan_p_baute_shy`
- **Baute**: Shh. Listen to him, Señor Sanches. This is the good part. *[if]* `baute_th_busy`
- **Baute**: Keep it, Mr. Sanches. I have more than enough of other people's things. *[if]* `alan_fail_baute_item`
- **Alan**: Vasco, surrounded, drawing the path of the light in the air with both hands. They're really listening to him. [pause] He isn't lost here. *[if]* `alan_look_vasco_reception`
- **Alan**: Vasco in the navy suit, talking with his hands, and eighty people leaning towards him. I knew he'd be good. I didn't know how good. *[if]* `alan_look_vasco_dinner`
- **Vasco**: Alan. I'm on slide fourteen. [pause] Cough at twenty minutes. *[if]* `vasco_th_dinner`
- **Alan**: Montesdeoca, supervising men with crates. He shouts at the crates as if they owe him money. *[if]* `alan_look_montesdeoca_wed`
- **Alan**: A heavy man in a white guayabera, with a gold watch and a cigar he isn't allowed to light, nodding along as if he understood every word. *[if]* `alan_look_montesdeoca`
- **Alan**: The museum guard, in a chair by the corridor to the offices. He's asleep. Asleep with one eye, like a cat. `alan_look_guard`
- **Guard**: Offices are closed, señor. Toilets are the other way. Everything you want is the other way. `guard_th_1`
- **Alan**: Gail, in her good frock, pink shoulders out, whispering at Derek like a cinema usher. *[if]* *(no recording)* `alan_look_gail_dinner`
- **Gail**: He's been filming since the soup. A waiter's asked him once already. I said, Derek, they'll think you're a spy. *[if]* `gail_th_dinner`
- **Alan**: Derek, camcorder up, red light glowing, filming the back of a bishop with total commitment. *[if]* `alan_look_derek_cam`
- **Alan**: Pintaderas, and the space where Montesdeoca's new cases are going. He's paying for the furniture. Who's paying for the dead? *[if]* `alan_look_cases_wed`
- **Alan**: Skulls, shelf after shelf. Mummies in goatskin, curled up like sleepers. The only people in the room I'm not expected to talk to. *[if]* `alan_look_cases`
- **Alan**: MONTESDEOCA HOTELES S.A., in gold, on a van at the side door. Long flat crates going in, each with a sheet stapled to it. *[if]* `alan_look_van`
- **Alan**: The door to the courtyard steps. Cigarette smoke drifts in. The only honest thing at this party. *[if]* `alan_look_steps_door`
- **Alan**: The chair's empty. Somewhere, Derek is having the best night of his holiday. *[if]* `alan_look_corridor_free`
- **Alan**: A corridor to the offices, and a guard between me and it. *[if]* `alan_look_corridor`
- **Guard**: Señor. The other way. *[if]* `guard_th_stop`
- **Alan**: The buffet. Papas arrugadas, ham, a cheese the size of a cartwheel, and a knife at every plate. Montesdeoca's money, all of it. *[if]* `alan_look_table`
- **Alan**: One knife's theft. Two is a cutlery problem. *[if]* `alan_table_again`
- **Alan**: A dinner knife. Good steel. [pause] Nobody's looking. Everybody's looking at Vasco. *[if]* `alan_take_knife`
- **Alan**: I'm not leaving without what's in that office. I've come this far, alone, like an idiot. *[if]* `alan_dinner_stay`
- **Alan**: Not yet. Vasco said he wanted a word. *[if]* `alan_reception_vasco`
- **Alan**: Not yet. Vasco wants me to meet people. And I'm still owed ten minutes. *[if]* *(no recording)* `alan_reception_stay`
- **Vasco**: Alan! [pause] One minute! *[if]* `vasco_p_arrive`
- **Alan**: One minute. [pause] I know exactly how long Vasco's minutes are. *[if]* `alan_p_arrive`

## room museum_corridor

> ================================================================ THE CORRIDOR OF SKULLS (Tuesday: Vasco's moment) the museum's corridor of skulls and mummies, Vasco's office at the end (repainted, take B, 2026-10-30); only the reception's quiet moment uses it: Vasco walks Alan down here and back

- **Alan**: Vasco, still lit up from the party. He hasn't stopped talking about the light since the door. *[if]* *(no recording)* `alan_look_vasco_walk`
- **Vasco**: Go and find Carmen, on the steps outside. She's terrifying. You'll love her. *[if]* `vasco_p_later`
- **Alan**: It's a nice world. It has skulls. `alan_p_3`

## room beach

> ================================================================ LAS CANTERAS: the sand (the surfers' place)

  *the sea between the boards rolling, the swash running up the sand and back*
  *the beach umbrella's skirt and the palms along the promenade*
  *the panza de burro sliding in off the sea, gulls over the surf, last and in the painted sky only (no cloud while*
  *the sun's out: the sunny painting's sky is its own)*
- **Alan**: Three boards stuck in the sand like headstones for people who are still very much alive and doing it better than me. `alan_look_surfboards`
- **Alan**: The donkey's belly. Grey from one end of the sky to the other, and warm underneath. Like being kept in a pocket. `alan_look_beach_sky`
- **Alan**: A spare towel, stripes, abandoned. A sign from God. A small, striped God. *[if]* `alan_look_towels_sun`
- **Alan**: Towels laid out and abandoned. In Lisbon that's a crime scene. Here it's a Tuesday. *[if]* `alan_look_towels`
- **Alan**: Towels laid out and abandoned. In Lisbon that's a crime scene. Here it's a Tuesday. *[if]* `alan_look_towels`
  *(the sand and the panza are painted, and Vasco explained the panza on the drive)*
- **Alan**: Well. The swell's up. [pause] I mean the sea's. Mostly the sea's. *[if]* `alan_t_swell`

## room mercado

> ================================================================ MERCADO DEL PUERTO (Tuesday afternoon: the aloe) The 1891 iron-and-glass market by Parque Santa Catalina (the user, 2026-10-29: Gail and Derek send the sunburnt Alan here; the aloe unlocks Gail's blazer). Doña Candelaria's aloe costs five hundred, and she can't change a 5,000 note.

  *the hanging globe lamps glowing, dust turning in the light under the glass roof*
- **Alan**: A small, solid woman with a knife and a great many plants. I trust her completely. `alan_look_candelaria`
- **Doña Candelaria**: Change, mi niño. Small money. Then I make you better. `candelaria_again`
- **Alan**: Papayas, mangoes, and a pile of tiny freckled bananas. The Canary banana. Small, sweet and very proud of itself. `alan_look_fruit`
- **Alan**: Cheeses the size of cartwheels. One is smoked, one is from Guía, and one, apparently, is from somebody's aunt. `alan_look_cheese`
- **Alan**: A bar inside a market. Coffee, beer and papas arrugadas at four in the afternoon. This city has its priorities right. `alan_look_mercado_bar`
- **Alan**: Aloe vera, a whole forest of it. Spiky, fat and full of something cold. Exactly what I need on every inch of me. `alan_look_aloe`
- **Alan**: Iron and glass, a hundred years old. Like a railway station that decided to sell fish instead. `alan_look_mercado_roof`

## S.talkCandelaria

- **Doña Candelaria**: Out of the sun, mi niño! `candelaria_bye`
- **Doña Candelaria**: ¡Ay, mi niño! Look at you. Who cooked you? `candelaria_1`
- **Alan**: The sun. I fell asleep on the beach. A lady from Manchester said you have aloe. `alan_t_cand_1`
- **Doña Candelaria**: Sábila. Aloe vera. The best on the island, from my own patio in Telde. Five hundred pesetas, and I cut it fresh for you. `candelaria_2`
- **Alan**: I only have this. `alan_t_cand_note`
- **Doña Candelaria**: ¡Chacho! Five thousand? I sell plants, mi niño, I'm not the Banco de España. Go and break it and come back. I'm not going anywhere. I've been here thirty years. `candelaria_note`
- **Doña Candelaria**: Change, mi niño. Small money. Then I make you better. `candelaria_again`
- **Doña Candelaria**: Now. Turn around. [pause] Cold, no? Tomorrow you'll be brown. On Thursday you'll peel like a lizard. `candelaria_3`
- **Doña Candelaria**: Ay, what shoulders. [pause] If I was thirty years younger, mi niño, I'd charge you nothing. `candelaria_shoulders`
- **Alan**: I... thank you. That's... [pause] The aloe's very cold. That's why I've gone this colour. `alan_t_shy_cand`
- **Alan**: Thank you. Really. [pause] That's the best thing that's happened to me all day. `alan_t_cand_2`
- **Doña Candelaria**: Then it was a bad day, mi niño. Go on. Keep the leaf. Rub it on tonight. `candelaria_4`

## room hotel_restaurant

> ================================================================ HOTEL CRISTINA: the restaurant (Gail and Derek)

  *through the arched windows: the cloud drifting, the surf rolling in*
  *(the cloud through the arches; nothing in this room redraws the painting over it)*
  *the fans turning, steam off the chafing dishes, the sconces and the lamp*
- **Alan**: English. Pink shoulders, a sun hat, a paperback with a man in an open shirt on the cover. Living my dream. *[if]* `alan_look_gail`
- **Alan**: Union Jack shorts, socks with sandals, and a camcorder he points at things the way other men point at dogs. *[if]* `alan_look_derek`
- **Alan**: English. Pink shoulders, a sun hat, a paperback with a man in an open shirt on the cover. Living my dream. `alan_look_gail`
- **Alan**: Union Jack shorts, socks with sandals, and a camcorder he points at things the way other men point at dogs. `alan_look_derek`
- **Alan**: A buffet. Eggs in a steel coffin, ham sweating gently, a pyramid of fruit nobody has dared to start. `alan_look_buffet`
- **Alan**: The beach through the glass, under the grey. Everyone in here faces the sea and nobody looks at it. `alan_look_restaurant_windows`
- **Alan**: The dessert trolley. A tower of flan, trembling every time a waiter walks past. I know how it feels. `alan_look_dessert_trolley`

## room museum_courtyard

> ================================================================ EL MUSEO CANARIO: the courtyard (where Alan finds Carmen)

  *the dragon tree's crown and the bamboo by the fountain stir; the wall lanterns (the fountain stays dry)*
- **Alan**: A woman on the steps outside, smoking. Or trying to. Her lighter doesn't want to work. With her back to the party. My kind of person. `alan_look_carmen_steps`
- **Alan**: A dragon tree. They bleed red when you cut them. The Guanches used the sap for their dead. Everything here comes back to the dead. `alan_look_dragon_tree`
- **Alan**: A stone fountain with no water in it. Very restful. Very museum. `alan_look_courtyard_fountain`
- **Alan**: Archive boxes, stacked by the door like they're waiting for a taxi. `alan_look_courtyard_boxes`

## S.talkVascoTue

> Vasco at the reception (the user, 2026-10-30): he invited Alan and has no time for him; after Montesdeoca has had a go at Alan he brings him to Baute (only then can Alan talk to Baute); after Baute, a moment for the two of them. Alan: self-conscious, proud of him, a little jealous.

- **Vasco**: Alan! You came. [pause] Meu Deus, you're red. Did you fall asleep on the beach? `vasco_p_1`
- **Alan**: Briefly. For about two hours. `alan_p_1`
- **Vasco**: Aloe. Tonight. [pause] Listen, I can't, not now. These are the people from the Cabildo. They decide the money. Give me ten minutes. Get a drink. Talk to someone. `vasco_p_2`
- **Alan**: Talk to someone. Right. [pause] Handed in at the door like a coat. I'll talk to the skulls. They look like good listeners. `alan_p_2`
- **Vasco**: Ten minutes, amor. Go and charm somebody. You're good at that. `vasco_p_wait`
- **Vasco**: Montesdeoca found you. I'm sorry. He finds everyone. [pause] Come. Rayco wants to meet you. Properly. `vasco_p_3`
  *he takes Alan's hand in front of everyone and walks him across the room to Baute (the two of them walk)*
- **Vasco**: Rayco. This is Alan. [pause] My Alan. `vasco_p_4`
- **Vasco**: Hey. Come here a second. [pause] Somewhere quieter. `vasco_p_5`
  *down the corridor between the cases to his office door at the end, where the party is only a murmur*
- **Vasco**: Thank you. For coming. For the jacket, and my jeans, and all of it. I know this isn't your world. *(no recording)* `vasco_p_6`
- **Alan**: It's a nice world. It has skulls. `alan_p_3`
- **Vasco**: Alan. [pause] Since Dr. Suárez died, it's me. My reading. My name on the paper. Rayco trusts me with the cave. Nobody has ever trusted me with anything like this. `vasco_p_7`
- **Vasco**: And I wanted you to see it. Not hear about it on the phone, at midnight. See it. `vasco_p_8`
- **Alan**: I see it. [pause] You're brilliant. Everyone in that room wants a piece of you. [pause] And I get ten minutes. `alan_p_4`
- **Vasco**: They can have a piece. [pause] You get the rest. `vasco_p_9`
- **Alan**: The rest. [pause] I'll take the rest. `alan_p_5`
- **Vasco**: Ten more minutes. I promise. Real minutes. *[if]* `vasco_p_later2`
- **Vasco**: Go and find Carmen, on the steps outside. She's terrifying. You'll love her. *[if]* `vasco_p_later`

## S.maybeToast

> after Carmen on the steps (and Baute, and Vasco's moment): Montesdeoca's toast, and the evening can end

- **Montesdeoca**: ¡Amigos! Two minutes, I promise. [pause] Ten years ago they told me: Ignacio, nobody pays for old bones. I said: watch me. And here we are. Look at all the old bones! `montesdeoca_p_toast_1`
- **Montesdeoca**: Cave 6! The Guanche calendar! And soon, right beside it, a little hotel with a swimming pool... no, no, Rayco, a joke! A joke! Ha! `montesdeoca_p_toast_2`
- **Alan**: Everyone's laughing. Baute too. [pause] His glass hasn't moved. His knuckles have gone white. `alan_p_knuckles`
- **Montesdeoca**: To Rayco Baute, who digs. And to his Portuguese... what do we call him? His magician of the light! Vasco! ¡Salud! `montesdeoca_p_toast_3`
- **Alan**: To Vasco. [pause] Sixty people in this room know what he thinks about the light. One of them knows what he looks like asleep. I win. `alan_p_toast`

## S.talkBauteTue

- **Baute**: They're not frightening. People think they're frightening. They're not. [pause] They're just waiting for us to pay attention. `baute_t_skulls`
- **Baute**: So you're Alan. Vasco has told me nada about you, which is how I know he's in love. [pause] Rayco Baute. *(no recording)* `baute_t_1`
- **Alan**: He's told me a great deal about you. `alan_t_baute_1`
- **Baute**: Then I'm in trouble. I've stolen him from you, I'm afraid. For the week. I'll give him back on Monday. `baute_t_2`
- **Baute**: He's the best reader of sacred light I've ever worked with, and I've worked with the best. He sees things the rest of us walk past. `baute_t_2b`
- **Alan**: He does. `alan_t_baute_2`
- **Baute**: When I was a boy, my abuela used to take me up to the burial caves above her village. She'd tell me their names. Not the real ones. Nobody remembers the real ones. `baute_t_gran_1`
- **Baute**: She gave them names, so they'd have names. 'This is Tamara. This is Guayasén. Say buenos días.' [pause] This little seal was hers. `baute_t_gran_2`
- **Baute**: There's a hotel there now. With a swimming pool. [pause] You'd like it. Everybody likes it. `baute_t_3`
- **Alan**: I think I've just been told something important. [pause] In a language I don't speak. `alan_t_baute_after`
- **Alan**: What exactly is it, your cave? *[choice]* `alan_ask_baute_cave`
- **Baute**: Cave 6. A dome cut into the rock by people who had no metal. One small opening in the roof. From the equinox all through the summer, el sol comes down it at noon and lights the engravings on the wall. A calendar, the papers say. `baute_t_cave`
- **Baute**: I say it's a prayer. Vasco is going to prove which. `baute_t_cave_2`
- **Alan**: Why him? There must be people on the island. *[choice]* `alan_ask_baute_vasco`
- **Baute**: There was. Dr. Suárez. She died in December, on the road down. A terrible thing. [pause] And Vasco reads light the way you read a page. `baute_t_vasco`
- **Alan**: I heard there are mirrors. Obsidian. *[choice]* `alan_ask_baute_discs`
- **Baute**: Seven discs, in the floor of a little chamber under the cave. We've been taking them out to conserve them, one at a time. Nine hundred years is long enough in the damp. *(no recording)* `baute_t_discs`
- **Alan**: And Señor Montesdeoca? *[choice]* `alan_ask_baute_monte`
- **Baute**: Ignacio is very generous. [pause] He pays for the cave. He pays for the vino. He pays for this whole evening, and he'll tell you so. Twice. `baute_p_monte`
- **Alan**: A very good smile. [pause] It stops just below the eyes. `alan_p_baute_smile`
- **Alan**: I'll leave you to your sponsors. *[choice]* `alan_bye_baute`
- **Baute**: They're not mine, Mr. Sanches. I'm theirs. That's the arrangement. `baute_t_bye`

## S.talkCarmenTue

  *her lighter: three tries (one try, later in the week, when she's at peace)*
- **Alan**: Can I have one of those? `alan_t_carmen_1`
- **Carmen**: No. `carmen_t_1`
- **Alan**: Fair enough. `alan_t_carmen_2`
- **Carmen**: You're the boyfriend. `carmen_t_2`
- **Alan**: I'm the boyfriend. `alan_t_carmen_3`
- **Carmen**: The bookseller. `carmen_t_3`
- **Alan**: Alan. `alan_t_carmen_4`
- **Carmen**: Carmen Trujillo. I run the archive. [pause] I don't do parties. `carmen_t_4`
- **Alan**: You're at a party. `alan_t_carmen_5`
- **Carmen**: I'm outside a fiesta. There's a difference. [pause] You should know. You're outside it too. `carmen_t_5`
- **Carmen**: Toma. Coronas. [pause] Don't thank me. They're terrible. `carmen_t_coronas`
- **Carmen**: Your doctor's very good. Everybody says so. Rayco's in love with him. [pause] Not like that. Rayco's in love with anyone who sees what he sees. `carmen_t_6`
- **Alan**: And what does he see? `alan_t_carmen_6`
- **Carmen**: Ask him. [pause] Welcome to Gran Canaria. Don't swim after dark. `carmen_t_7`
- **Alan**: Why does everybody keep saying that? `alan_t_carmen_7`
- **Carmen**: Go back in, bookseller. Your doctor's being brilliant without you. `carmen_t_again`

## S.talkMontesdeoca

- **Montesdeoca**: Ignacio Montesdeoca. I pay for all this. [pause] Nice jacket. I had one exactly like it. I left it somewhere. `montesdeoca_t_1`
- **Alan**: They're very popular this year. `alan_t_monte_1`
- **Montesdeoca**: And you fill it better than I ever did. [pause] Ha! Don't tell my wife I said that. `montesdeoca_t_alan`
- **Alan**: Your secret's safe with me, señor. [pause] The jacket's, too. `alan_t_flirt_monte`
- **Montesdeoca**: And look at the colour of you! Another inglés who thinks the panza de burro can't burn him. My hotels live off people like you. The aloe, the after-sun, a second week to recover. Ha! `montesdeoca_p_burn`
- **Alan**: Glad to be good for business. `alan_p_monte_1`
- **Montesdeoca**: You're with the Portuguese? The light man? [pause] Clever boy. Rayco found him, I pay for him. That makes him a little bit mine, no? Ha! Don't look at me like that, it's a joke. `montesdeoca_p_vasco`
- **Alan**: He's nobody's. [pause] Some days he's barely even mine. `alan_p_monte_2`
- **Montesdeoca**: Ha! Enjoy it. Enjoy everything. Life is short and the island is beautiful, and I own two of the beaches. `montesdeoca_t_2`
- **Montesdeoca**: Try the gofio. It's like eating the island. Ha! `montesdeoca_t_again`
- **Montesdeoca**: ¡Hombre! The Portuguese, without the jacket! Brown already, look. Yesterday a lobster, today a nice prawn. The ladies like a prawn. *[if]* *(no recording)* `montesdeoca_w_1`
- **Alan**: Only the ladies? [pause] Shame. What's going in the van, Don Ignacio? *[if]* `alan_w_monte_1`
- **Montesdeoca**: Cases, hombre. Display cases. German glass, steel, the best. My gift to el museo. *[if]* `montesdeoca_w_2`
- **Alan**: And the discs from the cave? *[if]* `alan_w_monte_2`
- **Montesdeoca**: Rayco's little stones? Ask Rayco. He takes things out of holes. I put hotels in them. ¡Ja! *[if]* `montesdeoca_w_3`
- **Montesdeoca**: Portuguese! Your boyfriend talks like a priest, and I pay for the sermon. Ha! Eat the ham, hombre. It cost more than your shop. `montesdeoca_th_1`

## S.endTue

> ---------------------------------------------------------------- the night

- **Vasco**: You've been on the phone to Inês. `vasco_t_night_1`
- **Alan**: How do you know? `alan_t_night_1`
- **Vasco**: You've got your Inês face. Guilty, and a bit pleased with yourself. [pause] What did she say? `vasco_t_night_2`
- **Alan**: Pessoa was sick on the Eça de Queirós. `alan_t_night_2`
- **Vasco**: The first edition? `vasco_t_night_3`
- **Alan**: The first edition. `alan_t_night_3`
- **Vasco**: [pause] He always did hate Eça. `vasco_t_night_4`
- **Vasco**: Take off that terrible jacket. And come here. `vasco_t_night_5`
- **Narrator**: Halfway through, the lift down the corridor sneezed, very loudly, and they both lost it completely. `narr_love_1b`
- **Narrator**: Alan took off the terrible jacket. [pause] Later, down the corridor, the lift sneezed, very loudly, and they both lost it completely. `narr_love_1_discreet`
- **Narrator**: A bed by the sea, and a man who loved him, asleep with an arm across his chest. [pause] Everything he had ever been afraid of. `narr_t_end_2`
