# Wednesday 19 June

From `js/story/wed.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## S.startWed

> Wednesday opens the novel's way (Chapter Two): Vasco leaving at dawn, in the grey light, and the thing Alan doesn't say

  *(the room in the grey light; Alan is in bed, half asleep)*
- **Narrator**: Vasco left at dawn. `narr_w_dawn_1`
  *(heard, not narrated: a tall man trying to be quiet in the grey light, and failing)*
- **Vasco**: Coffee's by the bed. It's terrible. It's from the machine in the lobby. Nieves made me promise not to tell anyone it exists. `vasco_w_dawn_1`
- **Alan**: Mm. `alan_w_dawn_1`
- **Vasco**: I'll be back for dinner. Late. Go and see the island. `vasco_w_dawn_2`
- **Alan**: Mm. `alan_w_dawn_1`
- **Vasco**: Alan. [pause] Are you all right? Last night, on the promenade. You looked like you'd seen a ghost. `vasco_w_dawn_3`
- **Alan**: Say it. I did see a ghost. The thing from the cistern. It's here, and I'm frightened. `alan_w_dawn_say`
- **Alan**: Sunburn. [pause] I'm delicate. `alan_w_dawn_3`
  *he gets up, and drinks the terrible coffee*
- **Alan**: [pause] He was right. It's terrible. `alan_w_coffee`
- **Alan**: Up the mountain, into the sun. Down here it's grey, and I have a whole day and nothing to do with it but worry. `alan_w_wake`

## room isleta

- **Alan**: A small woman in black on the quay, sorting the catch with hands like old rope. Her eyes don't miss anything. *[if]* `alan_look_pino`
- **Alan**: An old man in a flat cap, mending nets, with a cigarette he never lights. *[if]* `alan_look_lolo`
- **Alan**: Something in the net the colour of dried blood. A helmet. A conquistador's helmet, in a fishing net. *[if]* `alan_look_nets_wed`
- **Alan**: Nets drying on the quay. Patched and patched again. Like everything that lasts. *[if]* `alan_look_nets`
- **Alan**: Painted boats. Virgen del Carmen. Virgen del Pino. Half the fleet is named after the Virgin, which seems sensible here. `alan_look_boats`
  *one of the set alan_look_finds_ (4), chosen in the code:*
- **Alan**: A clay pot, a cannonball grown over with orange coral, an iron bolt and the helmet. Five hundred years down there. All of it coming up this week. *[set]* `alan_look_finds_2`
- **Alan**: More since yesterday. A sword hilt. A Castilian coin. The sea is clearing its shelves. *[set]* `alan_look_finds_3`
- **Alan**: A ship's bell, green with age. Nobody's touching it. I'm not going to either. *[set]* `alan_look_finds_4`
- **Alan**: The finds table under its tarpaulin. Labels, trays, a thermos. Baute's thermos. I'm not drinking anything up here. *[set]* `alan_look_finds_camp`
  *the lit lamp on the left quay*
  *the palm over the far quay*
  *the harbour: the boats' reflections wavering (the hulls themselves stay put), a few glints*
  *gulls*

## S.talkPino

  *the novel's quay: the net giving up the conquest, "the sea's emptying its pockets", the sea's memory; and, across*
  *the harbour, a salvage boat nobody notices (Pell's one trace, the bible's series layer)*
  *(the net's finds are on the quay, painted; Alan names them; she tips the crab back into the harbour)*
- **Alan**: A pot furred with weed. An iron ball grown over with coral. And a helmet, with a crab living in it. `alan_w_pino_0`
- **Alan**: That's old. `alan_w_pino_1`
- **Doña Pino**: Fourteen seventy-eight. The year the Castilians came. My grandson took one like it to el museo last week, and they told him. `pino_w_2`
- **Doña Pino**: Five hundred years in el mar, and it comes up in my net in the same week. `pino_w_2b`
- **Doña Pino**: Fuera, cangrejo. Go and find your own house. `pino_w_crab`
- **Doña Pino**: Every day this week. Every day, something. Cannonballs. Crossbow bolts. Pots. A sword on Saturday, all in one piece. [pause] The sea's emptying its pockets. `pino_w_2c`
- **Alan**: Why? `alan_w_pino_2`
- **Doña Pino**: Because it's looking for something. When you lose something, you empty your pockets. `pino_w_3`
- **Doña Pino**: Pino. Doña Pino, to you. That's Lolo. He doesn't talk. `pino_w_1`
- **Don Lolo**: I talk. `lolo_w_talk`
- **Doña Pino**: He doesn't talk to tourists. `pino_w_tourists`
- **Alan**: I'm not a tourist. I'm Portuguese. `alan_w_pino_3`
- **Doña Pino**: That's worse. The Portuguese think they own el mar. `pino_w_worse`
- **Doña Pino**: Pretty, though. Lolo, mira. A pretty one. [pause] Pity about the trousers. `pino_w_pretty`
- **Alan**: Thank you. I think. [pause] The trousers have had a very difficult week. `alan_w_pino_shy`
- **Doña Pino**: You know what the old people said here, when I was a girl? They said the sea has a memory. `pino_w_memory_1`
- **Doña Pino**: It never forgets anything it's taken. [pause] And it never forgets anything that was taken back from it. `pino_w_memory_2`
- **Doña Pino**: It's been very quiet for a long time, the sea here. Five hundred years. Now it's restless. [pause] No me gusta. I don't like it. `pino_w_restless`
- **Alan**: No. [pause] Neither do I. `alan_w_pino_4`
  *Pell's salvage boat across the harbour: the one thing nobody in the scene can say (the bible: narrated)*
- **Narrator**: Across the harbour, a grey salvage boat: Atlantic Recovery, Pell Marine, Nassau. Two men on her deck, watching. Alan didn't notice it. Nobody did. `narr_w_pell_1`
- **Alan**: A sword, you said? All in one piece? *[choice]* `alan_ask_pino_sword`
- **Doña Pino**: On Saturday. My grandson wanted to sell it to a German on la playa. I hit him with it. [pause] The flat side. I'm not a savage. `pino_w_sword`
- **Alan**: Is Don Lolo your husband? *[choice]* `alan_ask_pino_lolo`
- **Doña Pino**: Fifty-five years. He mends the nets. I mend everything else. `pino_w_lolo`
- **Don Lolo**: Fifty-five years. I married her in a storm. She hasn't forgiven me for the storm. `lolo_w_1`
- **Alan**: Look after yourself, Doña Pino. *[choice]* `alan_bye_pino`
- **Doña Pino**: Go on, Portuguese. Go and look at something dry. La catedral. [pause] I'll keep the helmet. Somebody should. `pino_w_again`
- **Alan**: Pepe Santana. The fisherman. Did you know him? *[choice]* `alan_ask_pino_pepe`
- **Doña Pino**: The Virgen del Pino. Nineteen seventy-one. Eleven men and one woman, because the cook was sick and I went in his place, for the money. `pino_th_pepe_1`
- **Doña Pino**: I keep the names in my missal, mi niño. Look. `pino_th_pepe_2`
- **Doña Pino**: You know what the old women said, when I was a girl? El mar never forgets a debt. `pino_th_debts`
- **Alan**: Yes. [pause] I think I do. `alan_th_debts`
- **Alan**: What's happening to the sea, Doña Pino? *[choice]* `alan_ask_pino_sea`
- **Doña Pino**: It's coming in at the wrong hours. It whispers at Las Canteras. And there is a black fog that comes at dusk against the wind, and everyone says, 'It's the panza, Pino, it's June.' [pause] I'm seventy-four. I know June. `pino_th_sea`
- **Alan**: Look after yourself, Doña Pino. *[choice]* `alan_bye_pino`
- **Doña Pino**: Lolo looks after me. He doesn't sleep. Never has. `pino_bye`
- **Doña Pino**: Now God knows too. *[if]* `pino_s_name`
- **Doña Pino**: A radio? He has one. He listens to the whole harbour all night, he doesn't sleep. [pause] He won't answer a guiri, Portuguese. Talk to him like a person from here. *[if]* `pino_s_lolo_hint`
- **Doña Pino**: Five crossed out. One a month, every dark moon since Christmas. Pepe was May. [pause] June is mine. Go home, Portuguese. `pino_f_1`

## S.talkLolo

- **Don Lolo**: You've got the face of a man who did something stupid. I've had that face. Fifty-five years, and she still hasn't forgiven me for the first one. *[if]* `lolo_f_1`
- **Alan**: And you stayed. *[if]* `alan_f_lolo`
- **Don Lolo**: Staying's not hard. It's every day. That's all it is. Every day. *[if]* `lolo_f_2`
- **Don Lolo**: Mmh. *[if]* `lolo_again`
- **Don Lolo**: Fifty-five years. I married her in a storm. She hasn't forgiven me for the storm. *[if]* `lolo_w_1`

## room santa_ana

> ================================================================ SANTA ANA

- **Alan**: Going again. A clock I wound. My grandfather would have something to say about that. He'd say it in a ledger. *[if]* `alan_look_clock_going`
- **Alan**: The cathedral clock. Stopped. Every so often something up there grinds, and catches, and gives up. I know the feeling. *[if]* `alan_look_clock_stopped`
- **Alan**: Eight bronze dogs, life-sized. Nobody has ever been able to explain them to me. The islands were named for dogs, apparently. Canis. `alan_look_dogs`
- **Alan**: Santa Ana. Big, grey, Gothic outside, with a sense of humour inside, I bet. `alan_look_cathedral_door`
  *first time: the decision made on the walk ("the kind of decision that felt brave at the time") and the plaza; with*
  *the founders' letter, back down from the tower: he opens it on the fountain's edge, between two of the dogs*
- **Alan**: I've made up my mind. I tell Vasco tonight. Properly. Sit him down, pour him a drink, and say it plainly. *[if]* `alan_w_decide_1`
- **Alan**: But first I find out what I can. So I sound less like a man who's frightened of the sea, and more like one who knows something. *[if]* `alan_w_decide_2`
- **Narrator**: It was the kind of decision that felt brave at the time. *[if]* `narr_w_decide_4`
- **Alan**: Cathedrals are where bells are. And bells, in my experience, are where trouble is. *[if]* `alan_w_plaza`
  *he sits down by the bronze dogs and opens it*
- **Alan**: Four sheets, both sides, in a small brown hand. Portuguese. The Portuguese of two and a half centuries ago. `alan_w_open_0`
- **Alan**: Aos que vierem depois de nós. [pause] To those who come after us. `alan_w_open_1`
- **Alan**: And further down: Mar. The Sea. [pause] With a capital letter. `alan_w_open_mar`
- **Alan**: One word in four I can read. Inês can read all of them. [pause] Inês needs a fax machine. `alan_w_letter`
  *the cloud moving behind the towers, the two palms' crowns stirring, pigeons now and then. The painted*
  *clocks are left alone (stopped until Alan winds the cathedral's; their hands are painted).*

## room santa_ana_inside

> ================================================================ SANTA ANA: inside (Don Fermín; the stair to the bells)

- **Alan**: A small man bent like a question mark in a black cassock-coat, with an enormous ring of keys and glasses as thick as bottle ends. *[if]* `alan_look_fermin`
- **Alan**: Stone palm trees. Somebody in fifteen hundred and something looked at this island and thought, yes, but in granite. `alan_look_columns`
- **Alan**: Gold, all the way up, and candles in front of it. It glows like the only lit window in a dark street. `alan_look_altarpiece`
- **Alan**: A small door, and behind it a stone stair winding up into the tower. The bells live up there. And the clock that stopped. `alan_look_tower_door`
- **Alan**: Locked. Don Fermín has the keys. All of them, by the look of it. *[if]* `alan_cathedral_locked`
  *(the nave is painted; somewhere above, the clock grinding and failing to strike)*
  *the altar candles alive (the left chapel's and the side altar's), a little light down from the high window, dust in it*

## S.talkFermin

  *the novel's first meeting: the clock stuck since Sunday, the gallbladder, Fuerteventura, the broken accordion*
- **Alan**: It's stuck. `alan_w_fermin_1`
- **Don Fermín**: It has been stuck since Sunday. The man who winds it is in hospital with his gallbladder. `fermin_w_1`
- **Don Fermín**: The man who replaces the man who winds it is on holiday in Fuerteventura. The bishop says, Fermín, wind it yourself. `fermin_w_2`
- **Don Fermín**: Fermín is seventy-six years old and has a heart like a broken accordion. [pause] The bishop is not seventy-six. `fermin_w_3`
- **Alan**: What's wrong with it? *[choice]* `alan_ask_fermin_clock`
- **Don Fermín**: Old age. Something inside it has slipped. It grinds, it catches, and then nada. Like me on the stairs. `fermin_clock_1`
- **Don Fermín**: The canon says get a young man. I say young men don't come to cathedrals. [pause] You came. `fermin_clock_2`
- **Alan**: I could try. Let me wind it. *[choice]* `alan_offer_wind`
- **Alan**: How many bells? *[choice]* `alan_ask_fermin_bells`
- **Don Fermín**: Four. The big one, the north one, is the oldest. Cast in 1751. My grandfather never liked to talk about her. `fermin_bells`
- **Alan**: The founders. What else do the records say? *[choice]* `alan_ask_fermin_founders`
- **Don Fermín**: That they went up to Artenara for a month, and came back quiet. And one of them came back white as a candle, and never said why. `fermin_founders`
- **Alan**: Thank you, Don Fermín. *[choice]* `alan_bye_fermin`
- **Don Fermín**: Go with God. He's slower than he was too. `fermin_bye`

## S.pickKey

> the ring of keys: the clock's is the one with a bell on its bow ("everything here has a bell on it")

  *"I know bells." (he hears himself say it); then the ring of forty keys, held out*
- **Don Fermín**: You know clocks? `fermin_w_clocks`
- **Alan**: I know bells. My family made them. A long time ago. `alan_w_bells`
- **Alan**: [pause] Now why did I tell him that? `alan_w_bells_2`
- **Don Fermín**: The clock key's on the ring. It has a bell on its bow, like everything here. Which one is it? `fermin_ring`
- **Don Fermín**: That's the west door. You want to open the cathedral to every tourist in Vegueta? Again. `fermin_key_wrong_1`
- **Don Fermín**: That one. Go up, señor. I'll come behind you. [pause] Slowly. If I die on the stairs, finish the clock first. `fermin_key_right`
- **Don Fermín**: That one's for the canon's vino. We don't touch that one. Again. `fermin_key_wrong_2`

## room belfry

> ================================================================ SANTA ANA: the bell chamber

- **Alan**: A small man bent like a question mark in a black cassock-coat, with an enormous ring of keys and glasses as thick as bottle ends. `alan_look_fermin`
- **Alan**: Ticking. Slowly, like a heart starting. My left hand paid for it. *[if]* `alan_look_drum_wound`
- **Alan**: The clock: a great black box of wheels and ratchets, two chains down through the floor to the weights. Something in there has slipped a tooth. I can hear it. *[if]* `alan_look_drum`
- **Alan**: I want a copy of the inscription, not a souvenir. Paper and pencil. My notebook. `alan_bell_item`
- **Alan**: I'm not ringing a bell. Not after last time. Not ever again, ideally. `alan_use_bell`
- **Alan**: The whole of Vegueta: flat roofs, palm trees, the sea. And over everything, the grey lid. `alan_look_bell_window`
  *first time: a hundred and twelve steps, Don Fermín dying on every landing; the room, the clock and the bells*
  *(the chamber, the clock and the bells are painted; the climb is heard, and Don Fermín's landings)*
- **Don Fermín**: Ciento doce. A hundred and twelve steps, señor, and I die on every landing. `fermin_w_steps`
- **Don Fermín**: Not this one. [pause] The next one, señor. Tell the bishop. `fermin_w_landing`
  *only the window lives: the cloud over the city, the palm, the sea, a gull; dust in the light, and the ropes*
  *stirring in the draught. The bell hangs still (nobody rings it) and the clock's drum turns only when wound.*
  *the clapper's rope, free at the floor*
  *the rope down from the ceiling, held at both ends*

## S.windClock

- **Alan**: It's going. I'm leaving it alone. Clocks are like cats: they prefer it when you stop helping. `alan_drum_again`
  *the novel: twenty minutes, a slipped tooth in the escapement, the skin of his left hand; then "Founder's hands" and the*
  *name, and the old man very still*
- **Alan**: Something in the escapement's slipped a tooth. [pause] Come on. Come on, you old... `alan_w_clock_0`
  *(twenty minutes)*
- **Alan**: There. [pause] I'd like my skin back, but there. `alan_w_clock`
- **Don Fermín**: Founder's hands. `fermin_founder_hands`
- **Alan**: What? `alan_w_hands`
- **Don Fermín**: You have founder's hands. My grandfather said you could always tell. The men who make bells understand the things that hang. `fermin_name`
- **Don Fermín**: What did you say your name was? `fermin_w_yourname`
- **Alan**: Sanches. Alan Sanches. `alan_w_name`
  *(the old man very still)*
- **Don Fermín**: Come. Look at her waist. Where the shadow is. `fermin_bell_show`

## S.lookBell

- **Alan**: A great dark shape. I can't see a thing up here. It's all shadow and pigeons. `alan_look_bell_dark`
- **Alan**: Sanches me fez. [pause] I keep looking at it as if it might change its mind. `alan_look_bell_mark_2`
- **Alan**: The S between two bells. And round it, a ring of tiny letters. [pause] Sanches me fez. Lisboa. 1751. `alan_look_bell_mark`
- **Alan**: Sanches made me. [pause] I've seen this mark at the bottom of a flooded tower in Lisbon. On my grandfather's books. In my dreams. `alan_w_bell_lisbon`
  *his hand on the bronze: it hums*

## S.rubBell

- **Alan**: A great dark shape. I can't see a thing up here. It's all shadow and pigeons. `alan_look_bell_dark`
- **Alan**: I've got the rubbing. One's enough. More than enough. `alan_rub_again`
  *(the mark found first, the novel's moment, even if he goes straight for the pencil)*
- **Alan**: A rubbing of the inscription and the mark. Inês will want to see this. Inês will want to frame this. `alan_rub_bell`

## S.talkFerminBelfry

- **Don Fermín**: The clock, señor. There, sulking. I'll sit here and wheeze quietly while you work. `fermin_belfry_wind`
- **Don Fermín**: Look at la campana, señor. The north one. Look at her waist. `fermin_belfry_look`
  *the founders from Lisbon who "came to look at the mountain, not the sea"; the chest; the oilcloth packet under black wax*
- **Don Fermín**: The founders came from Lisbon, señor. In seventeen fifty-one. On a ship, with their tools in the hold, to make a bell for Santa Ana. A gift, they said. `fermin_founders_1`
- **Don Fermín**: They cast her here, with their own hands. And then they went up into the mountains for a month. `fermin_founders_2`
- **Don Fermín**: My grandfather's grandfather was sacristan then. He wrote it down. He said it was the strangest thing. `fermin_founders_3`
- **Don Fermín**: Bell founders, from Lisbon. [pause] And they came to look at the mountain, not el mar. `fermin_founders_4`
- **Alan**: What were they looking for? `alan_w_founders_q`
  *(out of the chest by the wall: an oilcloth packet, sealed in black wax with the same mark)*
- **Alan**: Oilcloth, and black wax. [pause] And in the wax, the same mark. `alan_w_wax`
- **Don Fermín**: They left this. With my family. 'For the next founder who comes.' That's what it says on the outside. `fermin_letter_1`
- **Don Fermín**: Two hundred and forty-five years we've kept it. My father said, Fermín, nobody will ever come. [pause] My father was wrong about many things. `fermin_letter_2`
- **Alan**: It weighs nothing. [pause] It feels heavier than the bell. `alan_w_letter_take`
- **Alan**: I'll come back and tell you what it says. When I know. `alan_w_fermin_thanks`
- **Don Fermín**: Do. Before I die on the stairs. [pause] And mind the third step on the way down, señor. `fermin_belfry_again`
- **Don Fermín**: Do. Before I die on the stairs. [pause] And mind the third step on the way down, señor. `fermin_belfry_again`

## room archive

> ================================================================ EL MUSEO CANARIO: the archive

- **Alan**: Carmen Trujillo, in a men's linen shirt the colour of rust, sunglasses on her head and a cigarette she isn't supposed to have down here. *[if]* `alan_look_carmen`
- **Carmen**: A Portuguese bell in Santa Ana. Fascinating. I'm still busy. `carmen_inscription`
- **Carmen**: Eighteenth-century Portuguese. Not my department. Not my century. Not my problem. `carmen_letter`
- **Carmen**: If it isn't a cigarette or a reason, don't show it to me. `alan_fail_carmen_item`
  *one of the set alan_look_ashtray_ (3), chosen in the code:*
- **Alan**: Four stubs, all the same brand, all half smoked. Somebody keeps starting and stopping. *[set]* `alan_look_ashtray_2`
- **Alan**: Fuller. She's not sleeping. That makes two of us. *[set]* `alan_look_ashtray_3`
- **Alan**: Overflowing. And a lighter with no flint left in it. *[set]* `alan_look_ashtray_4`
- **Alan**: The triangles. All pointing down. Arrows. Carmen's right. Elena was right. *[if]* `alan_look_cave_photos_2`
- **Alan**: Photographs of a cave: a dome, engraved triangles, a column of light coming down from the roof. Cave 6. *[if]* `alan_look_cave_photos`
- **Alan**: Shelves to the ceiling. Boxes marked by decade. The island's memory, in cardboard. `alan_look_stacks`
  *first time: the basement, PROHIBIDO FUMAR, and Carmen smoking under it*
- **Alan**: 'Prohibido fumar.' [pause] And Carmen Trujillo, smoking under it. `alan_w_arch`
  *the hanging lantern and the stair lamp burning, daylight from the little window with dust in it, a moth*

## S.carmenToll

> the toll (the user, 2026-10-30): no talk in the archive without a packet of cigarettes from Chano's kiosk, once a day

- **Carmen**: Still no tabaco? Then still no Carmen. *[if]* `carmen_cigs_none_2`
- **Carmen**: No. Not one word until there's a cigarette in my hand. Bring me cigarettes. The kiosk on Las Canteras. Coronas. Vamos. *[if]* `carmen_cigs_none`
- **Alan**: The toll. Right. Back in a minute. *[if]* `alan_cigs_none`
- **Alan**: Coronas, Doctor. Your fee. *[if]* `alan_cigs_give`
  *one of the set carmen_cigs_thanks_ (3), chosen in the code:*
- **Carmen**: Coronas. Gracias. [pause] That buys you the chair. Not the conversation. *[set]* `carmen_cigs_thanks_2`
- **Carmen**: You're learning, inglés. Good. That's the first thing anyone has learned in this museum in years. *[set]* `carmen_cigs_thanks_3`
- **Carmen**: Coronas. Even today. [pause] Bueno. *[set]* `carmen_cigs_thanks_4`

## S.talkCarmen

- **Carmen**: Read the book, Señor Sanches. Then come back. [pause] With Coronas. `carmen_w_again`

## S.carmenWed

> Wednesday in the archive, the novel's scene: "No." / "I haven't asked anything." / "You were going to."; the discs; the mist and the helmet (her pen stops); June, the panza, every June a theory; her back turned, the photograph face down; Abreu Galindo held out behind her. Then, when he has gone, Carmen alone: the photograph righted, the message she has never erased, the lighter's three tries. Alan comes back to the hall.

- **Carmen**: No. `carmen_w_1`
- **Alan**: I haven't asked anything. `alan_w_carmen_0`
- **Carmen**: You were going to. `carmen_w_no2`
- **Alan**: The discs from the cave. The obsidian ones. There's a list upstairs. One a month, since December. Why? `alan_w_carmen_discs`
- **Carmen**: Conservation. `carmen_w_cons`
- **Alan**: Of what? They've been there five hundred years. `alan_w_carmen_cons`
- **Carmen**: That's why they need conserving. `carmen_w_cons2`
  *(back to her file)*
- **Alan**: Carmen. `alan_w_carmen_name`
- **Carmen**: Mi mesa, Señor Sanches. Not a chair. `carmen_w_desk`
- **Alan**: Last night on the beach there was a mist. A black mist. It came in off the sea against the wind. `alan_w_carmen_1`
- **Alan**: It smelled of salt, and of something old. I've smelled it before, in Lisbon. And when I smelled it there, people died. `alan_w_carmen_2`
  *(her pen has stopped)*
- **Alan**: [pause] Your pen's stopped, Doctor. `alan_w_carmen_pen`
- **Alan**: And today I watched an old woman in La Isleta pull a conquistador's helmet out of her net. She says the sea's been giving things back all week. `alan_w_carmen_helmet`
- **Alan**: And at the same time, somebody is taking the cave apart, one piece a month, and calling it conservation. `alan_w_carmen_cave`
- **Carmen**: It's June. It's the panza de burro. Every June the cloud comes down, and the tourists see shapes in it. `carmen_w_2`
- **Carmen**: Every June the fishermen pull up junk, because the currents change. Every June someone comes into my archive with a theory. `carmen_w_june2`
  *(the cigarette stubbed out, too hard)*
- **Carmen**: Go to la playa, Señor Sanches. Swim. In the daytime. Go and buy your boyfriend a present. It's a beautiful island. Enjoy it. `carmen_w_3`
  *(her back to him, a box she doesn't need)*
- **Alan**: A photograph on the corner of her desk, face down. [pause] I don't touch it. `alan_w_carmen_photo`
- **Alan**: Thank you. `alan_w_carmen_thanks`
- **Carmen**: Señor Sanches. `carmen_w_senor`
  *(the book held out behind her, without turning round)*
- **Carmen**: Abreu Galindo, fifteen-nineties. If you want to understand this island, start with the people it belonged to. `carmen_w_galindo`
- **Carmen**: Read the part about the harimaguadas. [pause] And bring it back. It's the archive's copy. If you get sand in it, I'll have you deported. `carmen_w_galindo2`
  *Carmen alone (Alan has gone up the stairs): the photograph righted, Elena's message in her head, the lighter's three tries*
- **Carmen**: Two idiots on a mountain, squinting at el sol. [pause] I still haven't erased your message, Elena. `carmen_w_alone`
- **Elena**: And it isn't a calendar either. I've been reading it wrong for a year. [pause] It's a door, Carmen. And someone's opening it. `elena_msg_02`

## room museum_hall (arrival)

  *the van at the side door (the hall's door, x 1150), the crates going out; he stops by the nearest and reads its sheet*
- **Alan**: A van at the side door. Montesdeoca Hoteles, in gold letters. They're loading crates into it. `alan_w_van`
- **Alan**: 'Conservation transfer. Risco Caído, Cave 6.' [pause] 'Obsidian disc, polished, two of seven. Removed for conservation. Twentieth of January.' `alan_w_crate_1`
- **Alan**: And under it, the others. One a month since December. Six lines, six signatures. [pause] And the crate's going down the hill today. `alan_w_crate_2`
- **Guard**: Display cases, señor. Nuevas. A gift for el museo, from Don Ignacio. `guard_w_van`
- **Alan**: And the discs? `alan_w_crate_3`
- **Guard**: I just carry them, señor. `guard_w_carry`

## S.chanoTheory

> ---------------------------------------------------------------- Chano's theory (after the archive) The novel: "Chano was waiting for him at the kiosk with a newspaper and a theory." Montesdeoca's hotel in Artenara, the neat explanation a frightened man would like to be true. On the way into Las Canteras, or at the kiosk.

- **Chano**: You've been to el museo. You saw Montesdeoca's van. `chano_w_th_1`
- **Alan**: How do you... `alan_w_chano_1`
- **Chano**: Everyone saw Montesdeoca's van. Montesdeoca's van is very big. `chano_w_th_2`
- **Chano**: You know what he wants? A hotel in Artenara. A big one. Guanche-themed. With a cave restaurant, and waiters in goatskins, hombre. `chano_w_th_3`
- **Chano**: And the only thing in his way is that dig. If the cave's important, he can't build. But if somebody proves the cave's not important... `chano_w_th_4`
  *(he lets it hang, and sells a woman a lottery ticket)*
- **Alan**: Montesdeoca, nodding along while Vasco explained the light, as if he understood every word. `alan_w_chano_2`
- **Alan**: It makes sense. It's neat. [pause] It's exactly what a frightened man would like to be true. `alan_w_chano_3`

## S.checkWed

- **Alan**: A helmet from the conquest, discs leaving a cave one a month, our mark on a bell, and a letter nobody's opened in two hundred and forty-five years. `alan_w_done`
- **Alan**: Back to the hotel. Vasco's home tonight. [pause] And tonight I tell him. `alan_w_done_2`

## S.endWed

  *(the evening goes by)*
- **Narrator**: Vasco didn't get back until after ten. `narr_w_night_1`
  *he comes in grey with dust and falls across the bed in his boots; Alan unlaces them*
- **Vasco**: I love it. I love it so much. [pause] My back is broken. `vasco_w_night_1`
- **Alan**: Boots off, professor. [pause] Come here. `alan_w_boots`
- **Vasco**: Six sockets empty now. They came out before I got here, one a month. Rayco's sent them all down to the city for conservation. I signed the papers for the lot my first week. `vasco_w_night_2`
- **Vasco**: He wants them stabilised before the public opening in the autumn. He's right, obsidian splits along the grain. `vasco_w_night_3`
- **Vasco**: But I hate it. I hate seeing the empty sockets. [pause] It's like a smile with teeth missing. `vasco_w_night_4`
- **Alan**: Vasco. `alan_w_night_1`
  *(asleep)*
- **Alan**: Tomorrow, then. At the dinner. After his talk, when he's happy. `alan_w_night_2`
- **Narrator**: It was the kind of decision that felt kind at the time. `narr_w_night_9`
  *Pepe Santana (the novel's cutaway, ending on his last words)*
  *(the still shows him in bed, the shutters closed, the door barred; the sea is heard, never shown; Chano and Doña*
  *Pino tell the rest on Thursday: 1971, the son who found him, the lungs full of the sea)*
- **Narrator**: A month before, on the night of the new moon, in La Isleta, a fisherman called Pepe Santana went to bed with the window shut. `narr_pepe_1`
- **Narrator**: He only said, very quietly, into the dark: 'Ah. There you are.' `narr_pepe_9`
