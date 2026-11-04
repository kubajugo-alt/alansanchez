# The puzzles across the days

From `js/story/puzzles.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## S.afterPages

> after the notebook closes: what Alan says about a page he's just solved (or got wrong)

- **Alan**: Nearly. One of those is lying to me. *[if]* `alan_pz_one_wrong`
- **Alan**: No. Some of that is wishful thinking. Again. *[if]* `alan_pz_wrong`
  *(filled in below and by the days' scenes)*

## chain

- **Alan**: Don Lolo's hand radio. It smells of fish and tobacco, and it works. `alan_look_radio_lolo`
- **Vasco**: Silver paper. In the right hands, a fuse. In mine, a fire. `vasco_look_foil`

## S.hint

- **Inês (on the phone)**: Two accounts of the same spring. Put them side by side, Alan. You have a notebook. Use it for something other than worrying. `ines_hint_tellings`
- **Inês (on the phone)**: A missing page is a page somebody wanted missing. Ask the woman with the parrot. `ines_hint_folio`
- **Inês (on the phone)**: Write down what you think. All of it. Then you'll see whether you're a detective or a man with a grudge. `ines_hint_case`
- **Inês (on the phone)**: Read it yourself first. It's Portuguese, Alan. You're Portuguese. Fill the gaps with what you've heard this week. `ines_hint_letter`
- **Inês (on the phone)**: Look again at what you thought on Thursday. With what that napkin says. And with what's in that jacket you keep wearing. `ines_hint_case2`
- **Inês (on the phone)**: If the museum's shut, you need a radio. Fishermen have radios. Old men who don't sleep listen to them. `ines_hint_radio`
- **Inês (on the phone)**: Height, he said? Go up something tall. You wound a clock in one, I'm told. `ines_hint_tower`
- **Inês (on the phone)**: Who's on the list, where's lowest, when's the water. You have all three. Look at the sea, for once, instead of the sky. `ines_hint_next`

## tellingsDue

> the two tellings: open the page once he has both (Carmen's and the inquiry), wherever he gets the second

- **Alan**: Two stories about the same three months. The Castilians' and Carmen's. Let me put them side by side. `alan_pz_tellings_open`
- **Alan**: The Castilians wrote down everything they saw, and understood none of it. `alan_pz_tellings_done_1`
- **Alan**: [pause] And the folios. Eleven, then thirteen. Somebody took a page out of the inquiry. `alan_pz_tellings_done_2`

## S.folio12

> folio 12 (Mercedes, thu.js S.talkMercedes)

- **Mercedes Quintana**: Nobody has asked me that in thirty years. [pause] Sit. Don't touch the parrot. `mercedes_folio_1`
  *(into the back, and out with a bundle in faded red tape)*
- **Mercedes Quintana**: Mira. The Holy Office's copy, fifteen-oh-five. Folio twelve is in it, misfiled. The way a thing is misfiled on purpose. `mercedes_folio_1b`
- **Mercedes Quintana**: Folio twelve. The statement of a Canario fisherman, baptised Pedro, of Gáldar. The man who pulled Juan de Quintana out of the sea. `mercedes_folio_2`
- **Mercedes Quintana**: He says the women did not call it on the Castilians. They called it, and it would not be aimed. It took his own village on the third night. `mercedes_folio_3`
- **Mercedes Quintana**: He says they shut it with Magec, at the cave of the light. And that the sea will want back the ones he took from it. [pause] He was right about Juan. `mercedes_folio_4`
- **Mercedes Quintana**: The notary struck it from the record. It contradicted the miracle. And then, I think, he was ashamed, and wrote in the margin. `mercedes_folio_5`
- **Alan**: 'Nadie preguntó a las mujeres.' [pause] And the one man who answered for them, they took out. `alan_th_folio`

## S.gdThu

- **Gail**: And he's ever so proud of his contract with the museum. Says it's framed in Dr. Baute's office, upstairs. He's going to show us after the pudding. `gail_th_contract`
- **Alan**: Right. Everything I know, in order. Before I do something stupid. *[if]* `alan_pz_case_open`
- **Alan**: Montesdeoca. The van, the hotel, the paper upstairs. It all fits. [pause] Things that fit this well usually make me nervous. Not tonight. `alan_pz_case_done`

## S.tickTalk

- **Alan**: He's at the questions. Here that's a second talk, professors to each other. Ten more minutes, if they're slow. `alan_th_timer_q`
- **Alan**: A professor in a cardigan, asking a question that's really a lecture. With footnotes. [pause] I have as long as it lasts. `alan_th_timer_lecture`
- **Alan**: Twenty minutes. If he goes over, I cough. If I go over, I'm caught. `alan_th_timer`

## S.searchDesk

- **Alan**: 'The Sea strikes first at whoever understands the lock. It comes for every soul given back from it. It is shut only at a turning, from inside its own water, at the door, with the sun at its height.' *[if]* `alan_pz_letter_done_1`
- **Alan**: And the last paragraph has gone where old ink goes. [pause] That's the one I'm afraid of. *[if]* `alan_pz_letter_done_2`
- **Alan**: Inês. [pause] The phone box. Before I lose my nerve. *[if]* `alan_s_call_due`
- **Alan**: Something stiff in the lining. [pause] There's a tear by the inside pocket. `alan_look_blazer_sat`
- **Alan**: A receipt. San Nicolás. 'Misa por los difuntos de Tasarte, 1966. Pagado. I. M.' Last month. [pause] And folded in it, one for every year before. `alan_s_receipt_0`
- **Alan**: He pays for a mass for them. Every year. [pause] Guilty of something, Ignacio. And still paying. `alan_s_receipt`

## S.readReceipt

- **Alan**: 'Por los difuntos de Tasarte.' Thirty of them, one a year. `alan_look_receipt`

## S.chanoTasarte

> Chano on Saturday: the guagua, and Tasarte (called from tue.js S.talkChano's dialogue)

- **Chano**: [pause] Where did you get that? [pause] Everybody knows, nobody says. Tasarte. The old burial caves on the hill above the beach. `chano_s_tasarte_1`
- **Chano**: The bulldozers came in sixty-six, for a hotel that was never built. The young one with the clipboard was Ignacio. Twenty-five years old. `chano_s_tasarte_2`
- **Chano**: They put the bones in a skip, chacho. Whole families. Rayco Baute's people were up there. His abuela's. `chano_s_tasarte_3`
- **Chano**: Rayco was at my cousin's wedding once, drunk, for once. He said one day the sea would take back every hotel on that coast. Everybody laughed. He didn't. `chano_s_tasarte_4`
- **Alan**: Six hotels, circled in red. [pause] Not plans. Targets. `alan_s_tasarte`
- **Alan**: The same question. With what I didn't hear on Friday, because I was watching Rafa's hands. `alan_pz_case2_open`
- **Alan**: Baute. Not Montesdeoca. Baute. And Vasco's up there with him, being brilliant at him. [pause] I have to reach him. Today. `alan_pz_case2_done`
- **Alan**: Vasco's books. Three on the sun, one on Portuguese bell-founding, which he says is for work. *[if]* `alan_look_chest`
- **Alan**: Vasco's books. Three on the sun, one on Portuguese bell-founding, which he says is for work. *[if]* `alan_look_chest`

## S.readVnote

- **Alan**: Under his books. His handwriting, from Tuesday: 'If you need me: the museum radios the camp. Canal 9, on the hour. V.' [pause] He thought I might need him. `alan_look_vnote_sat`
- **Alan**: Canal 9, on the hour. And the museum's shut. I need a radio, and I don't know anybody with a radio. `alan_s_need_radio`
- **Alan**: 'Canal 9, on the hour. V.' `alan_look_vnote_radio`
- **Alan**: Chacho. I need your radio. `alan_lolo_chacho`
- **Don Lolo**: [pause] Chacho, he says. `lolo_s_chacho`
- **Alan**: The panza's low today. And under the panza there's something else. `alan_lolo_panza`
- **Don Lolo**: Mmh. [pause] It's not the panza. `lolo_s_panza`
- **Alan**: I missed the guagua to the mountain. Somebody I love is up there. `alan_lolo_guagua`
- **Don Lolo**: The guagua's for people with time. `lolo_s_guagua`
- **Alan**: I know. I'm a guiri. I'm a guiri who's trying. `alan_lolo_guiri`
- **Don Lolo**: [pause] Feo, too. `lolo_s_guiri`

## S.loloRadio

- **Don Lolo**: Mmh. `lolo_mmh`
- **Alan**: Don Lolo, excuse me. I need to borrow your radio, please. It's very important. *[choice]* `alan_lolo_plain`
- **Alan**: I'll come back. Sounding more local. *[choice]* `alan_bye_lolo`
- **Don Lolo**: Mmh. `lolo_mmh`
- **Alan**: He doesn't talk to tourists. I need to stop sounding like one. `alan_s_lolo_think`
- **Don Lolo**: Sit. [pause] What does a Portuguese want with a radio? `lolo_s_talk_1`
- **Alan**: The camp at Risco Caído. Canal 9. I have to reach someone. `alan_lolo_why`
- **Don Lolo**: From here? The city's in the way, and the mountain's behind the city. You want height. Go up the cathedral tower. Higher than the houses, facing the mountain. `lolo_s_talk_2`
- **Don Lolo**: And Portuguese. This afternoon, on the mountain's channel. I listen to everything, I don't sleep. A man said a few words and went. `lolo_s_talk_3`
- **Don Lolo**: A Portuguese, like you. 'Tell Alan,' he said. Something about a van. 'The discs.' 'Under.' Then frying, like fat in a pan. Then nothing. `lolo_s_talk_4`
- **Alan**: [pause] That's him. That's Vasco. `alan_s_lolo_vasco`
- **Don Lolo**: Bring it back. She'll want to know where it went. `lolo_s_talk_5`

## S.talkFermin

- **Don Fermín**: The clock's still going. You have good hands. [pause] Up you go. I'll follow when my lungs agree. *[if]* `fermin_s_up`

## S.talkFerminBelfry

- **Don Fermín**: The clock's still going. You have good hands. [pause] Up you go. I'll follow when my lungs agree. *[if]* `fermin_s_up`
- **Alan**: The floor by the window. A good place to wait for one o'clock. `alan_look_wait_hour`

## S.waitHour

- **Alan**: One o'clock. [pause] My family's bell. `alan_s_wait_bell`

## S.radioCall

- **Alan**: Don Lolo's hand radio. It smells of fish and tobacco, and it works. *[if]* `alan_look_radio_lolo`
- **Alan**: Canal 9. Static. [pause] On the hour, the note said. It's ten to one. `alan_s_radio_static`
  *(one call an hour)*
- **Alan**: Risco Caído, Risco Caído. This is Alan Sanches, in Las Palmas. Is anyone there? Over. `alan_s_radio_1`
- **Baute**: Risco Caído. Baute. [pause] Alan! What a surprise. Over. `baute_r_1`
- **Alan**: I need to speak to Vasco. Please. Over. `alan_s_radio_2`
- **Baute**: Ah. You've just missed him. He finished in the cave today, very pleased with himself, and went down to Las Palmas on the guagua. He'll be at your hotel tonight. I think he wanted to surprise you. Over. `baute_r_2`
- **Alan**: Risco Caído, Risco Caído. This is Alan Sanches, in Las Palmas. Is anyone there? Over. `alan_s_radio_1`
- **Baute**: Baute. Alan, again? He's on his way down to you, I promise. Over. `baute_r_again`
- **Alan**: The guagua from Artenara goes once a day, Dr. Baute. At seven in the morning. Over. *[choice]* `alan_r_catch`
- **Baute**: ...Then he got a lift. Over. `baute_r_lift`
- **Alan**: He's lying. Vasco's up there, and Baute's lying about where. `alan_s_radio_lie`
- **Alan**: When did he leave? Over. *[choice]* `alan_r_when`
- **Baute**: After the cave. After noon. He caught the guagua by the skin of his teeth. Over. `baute_r_when`
- **Alan**: Put him on. Please. Over. *[choice]* `alan_r_put_on`
- **Baute**: He isn't here, Alan. I've just told you. Over. `baute_r_put`
- **Alan**: Then I'll wait at the hotel. Thank you. Over. *[choice]* `alan_r_thanks`
- **Baute**: Good man. Get some sleep. You sounded tired on Thursday. [pause] Are you still there? Over. `baute_r_thanks`
- **Alan**: Over and out. *[choice]* `alan_r_bye`
- **Alan**: The guagua. [pause] How does a guagua even get up that mountain, and when? Chano would know. And they listen every hour. `alan_s_radio_think`
- **Alan**: It comes for the ones it had and lost. One a month, the Virgen del Pino. Who's left, and where, and when? `alan_pz_next_open`

## S.readTides

- **Alan**: TABLA DE MAREAS. 'Pleamar', high water, twice a day. Derek says the sea comes in on top of it now, and higher every day. `alan_look_tides`
- **Alan**: Doña Pino. La Isleta. Four minutes past seven. [pause] Lolo. I have to tell Lolo. `alan_pz_next_done`
- **Alan**: In the order she sang it. Six moons, one a month. And the sun last, at the top of the long day. `alan_pz_telling_done`

## S.warnLolo

> the warning, then the flood (sat.js S.floodScene): Lolo stays awake because Alan told him

- **Alan**: Don Lolo. Tonight, at seven, on the tide. Don't let her sleep. Don't let her lie down. `alan_s_warn`
- **Don Lolo**: [pause] She sleeps in the afternoons now. She says she doesn't. `lolo_s_warn`
- **Don Lolo**: I don't sleep anyway, Portuguese. I'll sit with her. [pause] Give me back my radio. `lolo_s_warn_2`

## S.takeFoil

> ================================================================ VASCO'S CHAPTER: the foil from Yeray's packet

- **Vasco**: Yeray's stove. Yeray's terrible coffee. Yeray's empty cigarette packet. *[if]* `vasco_look_stove`
- **Vasco**: The foil from the packet. [pause] Not a fuse. But it will carry a current, for a little while. `vasco_take_foil`
