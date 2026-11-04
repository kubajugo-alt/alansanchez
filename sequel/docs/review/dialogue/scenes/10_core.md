# Every day: the phone box, Inês, the notebook

From `js/story/core.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## still

  *Gail and Derek at their table in the hotel restaurant (one painting split down the middle, so each half is its own*
  *Derek sit at it")*
  *the hold: breathe out to the hold, and when he's stopped, the rest is him dropping it and treading it out*
  *painting (vascor_profile_k), so he walks straight across; he stands and talks on vascor_side_k as before. The back*
  *view is the old back painting with the shirt recoloured to the repaint's cream (vascor_back_k)*
  *reception to the end of the walk on the promenade, Thursday at the dinner; his own head, so his face set fits*
- **Carmen**: If it isn't a cigarette or a reason, don't show it to me. `alan_fail_carmen_item`
- **Baute**: Keep it, Mr. Sanches. I have more than enough of other people's things. `alan_fail_baute_item`
- **Nieves**: The hotel can't keep that for you, señor. Or won't. `alan_fail_nieves_item`
- **Rafa**: Cute. Put it away. `alan_fail_rafa_item`

## S.restorePlayer

> a save made while playing Vasco comes back as Vasco

  *stay in art/icons/ but no item shows them now)*
- **Alan**: A five-thousand-peseta note. Big enough to buy a paper, too big for a phone box. `alan_look_note`
- **Alan**: Hundred-peseta coins. Each one's a minute of Inês telling me what to do. *[if]* `alan_look_coins`
- **Alan**: Aloe vera, a whole forest of it. Spiky, fat and full of something cold. Exactly what I need on every inch of me. `alan_look_aloe`
- **Alan**: A packet of Coronas. Canarian tobacco. Not for me: it's the toll for the archive. `alan_look_cigarettes`
- **Alan**: I look like a man who owns a yacht and argues with it. *[if]* `alan_look_blazer_on`
- **Alan**: Navy, brass buttons, a smell of cigars. Somebody rich lost this. Somebody rich enough not to notice. *[if]* `alan_look_blazer`
- **Alan**: A dinner knife. Good for butter, cheese and the locks of trusting people. `alan_look_knife`
- **Alan**: Me, in pencil, on a napkin. A dozen lines. Tired, amused, and something far back behind the eyes. [pause] He saw that in a dozen lines. `alan_look_napkin`
- **Alan**: Two litres of water. For the radiator, and for courage. `alan_look_water`
- **Alan**: Obsidian. The nails. I'm putting the nails back. *[if]* `alan_look_discs`
- **Alan**: The sixth disc. Warm from Baute's hand. `alan_look_disc6`
- **Alan**: A small silver trowel with half its blade gone. The most romantic thing anyone's ever given me, and it's broken. That seems right. `alan_look_trowel`
- **Alan**: The camp radio's fuse. A glass tube the size of my thumb. Yeray carried it in his pocket for two days, like a sin. `alan_look_fuse`
  *Vasco's pockets*
- **Vasco**: Hold it up to the light and you can still read it. 'I'm sorry.' [pause] It isn't for the cave. *[if]* `vasco_look_notebook_2`
- **Vasco**: Twelve pages of measurements from yesterday, the solstice. And on the thirteenth, one sentence, crossed out four times, so hard the pen went through. *[if]* `vasco_look_notebook`
- **Vasco**: Chalk. The archaeologist's confession: I was here, I thought this mattered. `vasco_look_chalk`
- **Vasco**: Lorenzo gave me this in Rome. 'For the day you find something worth keeping.' [pause] I thought I had. `vasco_look_trowel`
- **Vasco**: A pocket torch with a dying battery. Use it like a prayer: briefly, and only when it matters. `vasco_look_torch`

## S.toMap

> the way out to the map from a street, as a hotspot

- **Alan**: The city. Or as much of it as fits in a taxi. `alan_look_tomap`
  *[flag, when, lines, how]: the calls the story needs, in order. how.direct: the call opens on its own*
  *first line, not Inês's hello; how.hangup: it ends when the money or the line runs out, with no "What now?"*

## S.callTue1

> Tuesday, before the reception: Pessoa and the Eça, the surfers, "Don't break anything"; and the money runs out

- **Inês (on the phone)**: Pessoa has been sick on the Eça de Queirós. `ines_t_eca_1`
- **Alan**: Hello, Inês. `alan_t_call_1`
- **Inês (on the phone)**: On the first edition. The one in the window. `ines_t_eca_2`
- **Alan**: Is he all right? `alan_t_call_2`
- **Inês (on the phone)**: He's fine. He's asleep on the Saramago. The Eça is not fine. [pause] How is it? How's the sun? How's the boyfriend? How is the man who leaves the shop to me for a week, three weeks before I submit my thesis? `ines_t_eca_3`
- **Alan**: You could close the shop. `alan_t_call_3`
- **Inês (on the phone)**: I could, but then I would have to write my thesis. [pause] Well? `ines_t_eca_4`
- **Alan**: When did surfers get so young? `alan_t_call_4`
- **Inês (on the phone)**: What? `ines_t_what`
- **Alan**: Oh. [pause] When I didn't. `alan_t_call_5`
- **Inês (on the phone)**: Alan. `ines_t_alan`
- **Alan**: It's fine. It's lovely. He's lovely. He's happy, Inês. He's been here a month and he's already a different person. He talks about the cave like it's a person. He calls his boss by his first name. `alan_t_call_6`
- **Inês (on the phone)**: [pause] And you're jealous. `ines_t_jealous`
- **Alan**: Of a cave. `alan_t_call_7`
- **Inês (on the phone)**: Of a cave. [pause] Alan. Go to the party. Be charming. Don't break anything. `ines_t_party`
- **Alan**: I'm wearing a stranger's jacket. `alan_t_call_8`
- **Inês (on the phone)**: I don't want to know. `ines_t_dontknow`
- **Alan**: Inês? [pause] And that's the money gone. `alan_t_call_money`

## S.callTue

> Tuesday, midnight: "It's here. It's come for me." And the line goes dead.

- **Alan**: It's here. [pause] It's come for me. `alan_call_tue_1`
- **Inês (on the phone)**: [pause] What's here? `ines_call_tue_1`
- **Alan**: You know what. `alan_call_tue_2`
- **Inês (on the phone)**: Alan. [pause] Are you sure? `ines_call_tue_2`
- **Alan**: I smelled it. I'd know that smell anywhere, Inês. I'll smell it on my deathbed. `alan_call_tue_3`
- **Alan**: It can't be. We put it back. It's thirteen hundred kilometres from Lisbon. `alan_call_tue_3b`
- **Inês (on the phone)**: It's the same sea, Alan. It's always been the same sea. `ines_call_tue_3b`
- **Inês (on the phone)**: Have you told Vasco? [pause] Alan. Have you told Vasco? `ines_call_tue_3`
- **Alan**: He's happy. He's so happy. It's his week. It's the first thing he's ever had that's just his. I can't walk into the middle of it and say, sorry, darling, I'm being haunted again. `alan_call_tue_4`
- **Inês (on the phone)**: You're not being haunted. You're being sensible. Tell him. `ines_call_tue_4`
- **Alan**: Tomorrow. `alan_call_tue_5`
- **Inês (on the phone)**: Alan. `ines_call_tue_5`
- **Alan**: Tomorrow. I promise. Find out what you can. Anything. Old papers. Anything about the Canaries. `alan_call_tue_6`
- **Inês (on the phone)**: I have a thesis. `ines_call_tue_6`
- **Alan**: Then you'll want something to do instead. `alan_call_tue_7`

## S.callWed

- **Alan**: Inês. There's a bell in the cathedral here with our mark on it. 'Sanches me fez.' 1751. `alan_call_wed_1`
- **Inês (on the phone)**: Seventeen fifty-one. [pause] Four years before Lisbon, Alan. `ines_call_wed_1`
- **Alan**: And a letter. The founders left it with the sacristan's family, sealed. 'For the next founder who comes.' Nobody came for two hundred and forty-five years. `alan_call_wed_2`
- **Inês (on the phone)**: Until you. [pause] What does it say? `ines_call_wed_2`
- **Alan**: One word in four. 'Lock'. 'Mountain'. 'Water'. And 'Mar', with a capital M. `alan_call_wed_3`
- **Inês (on the phone)**: Fax it. Every page, both sides, and draw me the mark. I'll be up all night with Bastos's dictionary. `ines_call_wed_3`
- **Alan**: Your thesis. `alan_call_wed_4`
- **Inês (on the phone)**: My thesis can wait. It's about the dead. They're patient. `ines_call_wed_4`
- **Alan**: Inês. I haven't told him yet. `alan_call_wed_5`
- **Inês (on the phone)**: Alan. [pause] Then tell him tonight. Not when it's convenient. Tonight. `ines_call_wed_5`

## S.callThu

> (the narrator cut back: the ledger's pages are heard down the line, and Inês's silence is a pause)

- **Inês (on the phone)**: I haven't finished the letter. It's two hundred and forty years old and someone wrote it with a chicken. [pause] But I've found something else. `ines_call_thu_1`
- **Alan**: Where? `alan_call_thu_1`
- **Inês (on the phone)**: Your grandfather's boxes. In the back room. The ones you never open. `ines_call_thu_2`
- **Inês (on the phone)**: There's a ledger. The foundry's accounts, seventeen-forty to seventeen-sixty. Bells cast, bells sold, bronze bought. `ines_call_thu_3`
- **Inês (on the phone)**: And in seventeen fifty-one, a voyage. Passage for four, to the Canaries, with their tools and their bronze in the hold. And in the margin, in the same hand as your letter: para estudar a fechadura. `ines_th_call_4`
- **Alan**: To study the lock. `alan_call_thu_2`
- **Inês (on the phone)**: And in seventeen fifty-five, after the earthquake, after the wave, there's a page with no figures on it at all. Just a sentence. `ines_th_call_5`
- **Inês (on the phone)**: Fizemos o que aprendemos nas Canárias. O Mar está calado. [pause] We did what we learned in the Canaries. The Sea is silent. `ines_th_call_6`
- **Alan**: They shut it. In Lisbon. With what they learned here. `alan_call_thu_3`
- **Inês (on the phone)**: They shut it. Which means it can be shut. Which means it knows the people who shut it. `ines_th_call_7`
- **Inês (on the phone)**: Alan. Your blood. That's why it backed off you in the cistern. It knew you. `ines_th_call_8`
- **Alan**: And here? `alan_th_call_4`
- **Inês (on the phone)**: Here, I'd keep away from the water. `ines_th_call_9`
- **Alan**: I'm on an island, Inês. `alan_th_call_5`
- **Inês (on the phone)**: Then tell Vasco. Tonight. Whatever you're planning, and I can hear that you're planning something, tell him first. `ines_call_thu_4`

## S.callFri

- **Inês (on the phone)**: Alan. [pause] You sound like a man who hasn't slept. What did you do? `ines_call_fri_1`
- **Alan**: I got caught going through Baute's desk at the dinner. In front of everyone. In front of Vasco. He's gone up the mountain till Monday. `alan_call_fri_1`
- **Inês (on the phone)**: And you had the fight. [pause] Did he say the thing? The thing he's been not saying since January? `ines_call_fri_2`
- **Alan**: He told me about a man called Lorenzo. And a coffee pot. `alan_call_fri_2`
- **Inês (on the phone)**: Oh, Alan. [pause] Go to Carmen. Do something useful with the ache. And don't drink alone tonight. `ines_call_fri_3`

## S.callDue

- **Inês (on the phone)**: He sleeps on your pillow and looks at me like I've killed you. I'm considering it. `ines_pessoa_1`
- **Inês (on the phone)**: He ate a sardine off the counter while a customer was paying. The customer applauded. `ines_pessoa_2`
- **Inês (on the phone)**: He's sulking in the window. People take photos. We've sold four books to people who came in to pet him. `ines_pessoa_3`
- **Inês (on the phone)**: Grieving. Or overfed. It's hard to tell with him. It's hard to tell with you. `ines_pessoa_4`
- **Inês (on the phone)**: He's fine. He's a cat. He'll outlive us both out of spite. `ines_pessoa_5`

## S.phoneBox

- **Alan**: No time for phone calls. Not today. `alan_phone_no_time`
- **Alan**: It doesn't take five-thousand-peseta notes. Nobody does. I need change from the kiosk. *[if]* `alan_phone_note`
- **Alan**: No coins. Chano at the kiosk will have change. Chano has everything. *[if]* `alan_phone_nocoins`
- **Inês (on the phone)**: Livraria Sanches. [pause] Oh, it's you. Pessoa, it's him. He's ignoring you, in case you were wondering. `ines_hello`
- **Alan**: Inês. What would you do now? *[choice]* `alan_ask_ines_now`
- **Alan**: How's Pessoa? *[choice]* `alan_ask_ines_pessoa`
- **Alan**: And your thesis? *[choice]* `alan_ask_ines_thesis`
- **Inês (on the phone)**: Three weeks to submission and I'm reading your grandfather's foundry papers instead. It's called research. It's called avoidance. You'd know. `ines_thesis`
- **Alan**: I have to go. The box is eating my coins. *[choice]* `alan_bye_ines`
- **Inês (on the phone)**: Call me. Don't do anything stupid. Or call me first if you're going to. `ines_bye`

## S.hint

> ---------------------------------------------------------------- hints (Inês, "What now?")

- **Inês (on the phone)**: Two hours to kill on a beach and you're phoning me? Go and look at the sea, Alan. Talk to someone young. It'll do you good, or at least it'll do you something. `ines_hint_beach`
- **Inês (on the phone)**: You're burnt? Of course you are. Ask the English couple in your hotel restaurant. Sunburn is their national sport. `ines_hint_burn`
- **Inês (on the phone)**: You fell asleep in the sun. Of course you did. Do what the English lady said, find the plant woman at the market, and don't argue with her. `ines_hint_aloe`
- **Inês (on the phone)**: So the English lady told you whose blazer it is. Then describe it to the receptionist like it's yours. Down to the pocket. *[if]* `ines_hint_nieves`
- **Inês (on the phone)**: A jacket, by eight. Ask the English lady with the camcorder husband. Tourists notice everything that isn't theirs. *[if]* `ines_hint_gail`
- **Inês (on the phone)**: You've got the blazer. Now go upstairs and put trousers on. Vasco's, if you must. Then call me back. `ines_hint_dress`
- **Inês (on the phone)**: You've got a jacket and an hour. Ring me from the box on the beach before you go, I want to hear about the boyfriend. `ines_hint_call_first`
- **Inês (on the phone)**: You have a jacket. Go to the museum. Meet the professor. Be charming. You know how. You were born doing it. `ines_hint_reception`
- **Inês (on the phone)**: Go back to your hotel. Go to Vasco. And tell him about the mist. [pause] No? Fine. Go to him anyway. `ines_hint_hotel`
- **Inês (on the phone)**: If the sea's acting strangely, ask the people who live off it. Find the fishermen. Find the oldest one. `ines_hint_isleta`
- **Inês (on the phone)**: You wound a clock? Look at the bells while you're up there. Bells are our family business, God help us. *[if]* `ines_hint_bell`
- **Inês (on the phone)**: Every city has a cathedral and every cathedral has a sacristan who knows everything. Find him. Make yourself useful. *[if]* `ines_hint_cathedral`
- **Inês (on the phone)**: Fax me what you found. Your hotel has a fax. Hotels always have a fax. Give it to the woman with the eyebrow. `ines_hint_fax`
- **Inês (on the phone)**: Go and see the museum archive. There's always a list on a board somewhere. Read the boring things. That's where they hide the interesting things. `ines_hint_museum`
- **Inês (on the phone)**: Go back to the hotel, Alan. Wait up for him. [pause] And tell him. `ines_hint_wed_done`
- **Inês (on the phone)**: The archivist. She knows the island's history and she knows something about your mist. Go back. Take cigarettes. `ines_hint_carmen_lore`
- **Inês (on the phone)**: Go and see the Castilian side. Columbus's house. The lady with the glasses. *[if]* `ines_hint_colon`
- **Inês (on the phone)**: The archivist. She knows the island's history and she knows something about your mist. Go back. Take cigarettes. *[if]* `ines_hint_carmen_lore`
- **Inês (on the phone)**: Go back to the hotel and make yourself presentable. It's Vasco's big night. Don't embarrass him. `ines_hint_suitcase`
- **Inês (on the phone)**: A locked drawer and a dinner table full of knives. I'm not telling you that. I'm telling you nothing. I'm in Lisbon. *[if]* `ines_hint_desk`
- **Inês (on the phone)**: The guard at the dinner? Guards move for two things: their boss, and trouble. Find some trouble. Preferably someone else's. *[if]* `ines_hint_guard`
- **Inês (on the phone)**: Go to bed. Say sorry. Mean it. `ines_hint_thu_done`
- **Inês (on the phone)**: Go to Carmen. Do something useful with the ache. `ines_hint_carmen_fri`
- **Inês (on the phone)**: Go and have one drink. One, Alan. And then go back to the hotel and call me. `ines_hint_fri_night`
- **Inês (on the phone)**: Go to your hotel. The fax. Read it sitting down. `ines_hint_fax_sat`
- **Inês (on the phone)**: Doña Pino. The list. If the Sea's collecting tonight, she's on it. Go to La Isleta. `ines_hint_isleta_sat`
- **Inês (on the phone)**: You've told me. Now you have to tell him. Go to the mountain, Alan. `ines_hint_vasco`
- **Inês (on the phone)**: Go to him, Alan. `ines_hint_general`
  *[when, text]: everything Alan has written down, in story order*
## The engine's refusals

> Said when an action or item does nothing (js/engine/input.js, inventory.js), picked at random; Alan's, and Vasco's in his chapter.

- **Alan**: No. Even on holiday, no. *[set]* `alan_fail_01`
- **Alan**: That's not how anything works. I've sold the manuals. *[set]* `alan_fail_02`
- **Alan**: Interesting idea. Wrong, but interesting. Like my twenties. *[set]* `alan_fail_03`
- **Alan**: No. And I say that as a man who has said yes to a lot of bad ideas. *[set]* `alan_fail_04`
- **Alan**: If that worked, someone in my family would have done it already. Probably with a bell. *[set]* `alan_fail_05`
- **Alan**: I'm improvising, not hallucinating. It's the heat. *[set]* `alan_fail_06`
- **Alan**: Inês would make a face. I can feel her making it from Lisbon. *[set]* `alan_fail_07`
- **Alan**: Not unless I want to explain myself to the Guardia Civil in my third language. *[set]* `alan_fail_08`
- **Alan**: I'm sunburnt, not desperate. [pause] Not that desperate. *[set]* `alan_fail_09`
- **Alan**: That would be a story. A short, stupid story. *[set]* `alan_fail_10`
- **Alan**: Nothing there I can use. Nothing anywhere I can use, some days. *[set]* `alan_fail_look`
- **Alan**: It's not much of a conversationalist. *[set]* `alan_fail_talk`
- **Alan**: I don't need that. I barely need half of what I've got, and the airline has the other half. *[set]* `alan_fail_take`
- **Alan**: Those two have nothing to say to each other. *[set]* `alan_def_item`
- **Alan**: They're busy. Somebody on this island has to be. *[set]* `alan_npc_busy`
- **Carmen**: If it isn't a cigarette or a reason, don't show it to me. *[set]* `alan_fail_carmen_item`
- **Baute**: Keep it, Mr. Sanches. I have more than enough of other people's things. *[set]* `alan_fail_baute_item`
- **Nieves**: The hotel can't keep that for you, señor. Or won't. *[set]* `alan_fail_nieves_item`
- **Rafa**: Cute. Put it away. *[set]* `alan_fail_rafa_item`
- **Alan**: It takes coins. Only coins. The one honest machine on the island. *[set]* `alan_fail_phone_item`
- **Vasco**: No. *[set]* `vasco_fail_01`
- **Vasco**: That isn't how stone works. I've spent twenty years asking it. *[set]* `vasco_fail_02`
- **Vasco**: Alan would try that. [pause] I'm not thinking about Alan. *[set]* `vasco_fail_03`
- **Vasco**: Pointless. Patient, but pointless. *[set]* `vasco_fail_04`
- **Vasco**: The dead wouldn't thank me for that. *[set]* `vasco_fail_05`
- **Vasco**: Think first. Then touch. In that order. *[set]* `vasco_fail_06`
- **Vasco**: No. Not with that. *[set]* `vasco_fail_07`
- **Vasco**: A good idea, in a different century. *[set]* `vasco_fail_08`
- **Vasco**: I'd only be doing it to feel busy. *[set]* `vasco_fail_09`
- **Vasco**: No. Read it again. *[set]* `vasco_fail_10`
- **Vasco**: Nothing. Recent, and nothing. *[set]* `vasco_fail_look`
- **Vasco**: It hasn't spoken in nine hundred years. It won't start for me. *[set]* `vasco_fail_talk`
- **Vasco**: It belongs where it is. Most things do. *[set]* `vasco_fail_take`
- **Vasco**: They don't go together. *[set]* `vasco_def_item`
- **Vasco**: Busy. Leave them. *[set]* `vasco_npc_busy`
