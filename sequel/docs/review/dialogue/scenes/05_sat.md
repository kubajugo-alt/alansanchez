# Saturday 22 June (Alan)

From `js/story/sat.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## S.startSat

> ---------------------------------------------------------------- the morning: the bells, the drawing, the rules

  *does to him; he dresses (heard), thinks of going, and goes to the window instead)*
- **Narrator**: He wakes to Santa Ana's bells. For a few seconds, eyes closed, he doesn't know where he is, and he is happy. `narr_s_wake_1`
- **Alan**: Grey light through a window I don't know. Turpentine. A pillow that smells of someone else's shampoo. `alan_s_wake_1`
- **Alan**: [pause] Oh, no. [pause] Oh, Alan. `alan_s_wake_2`
- **Alan**: Me. Asleep. [pause] The most beautiful drawing anyone has ever made of me. [pause] I feel sick. `alan_s_drawing`
- **Alan**: I could go now, before he turns round. Money on the table, out of the door, someone else by lunchtime. [pause] I always have. `alan_s_go`
  *the window: he makes himself think it, in words, all the way to the end*
- **Alan**: I lied to him. He asked me, straight out, and I lied. `alan_s_window_1`
- **Alan**: And Vasco said two things. Only two. Tell me first. Never to settle a fight. `alan_s_window_2`
- **Alan**: I broke both of them in one night. [pause] And the second one I broke on purpose. `alan_s_window_3`

## room rafa_studio

> ================================================================ RAFA'S STUDIO

- **Alan**: Rafa, barefoot at the gas ring, his hair standing up on one side. There's charcoal on his shoulder blade, in the shape of a thumbprint. `alan_look_rafa_morning`
- **Rafa**: Keep that too. Frame it. Or burn it. Up to you. `rafa_napkin_keep`
- **Rafa**: Cute. Put it away. `alan_fail_rafa_item`
- **Alan**: The mattress. My clothes all over the floor, in a way that tells the whole story without anybody needing to tell it. `alan_look_rafa_bed`
- **Alan**: The cathedral's two black towers, and a grey sky. Santa Ana's bells have stopped. I haven't. `alan_look_studio_window`
- **Alan**: Not like that. Not without saying it. I've done enough leaving without saying it to last me. *[if]* `alan_studio_stay`
  *small moving details over the painting: the morning sun through the window, the coffee, the palm outside*
  *the palm beyond the window*
  *dust turning in the light that falls from the window to the floor by the bed*
  *the moka pot's spout*
  *Rafa's cup*
  *Alan's cup*
  *the stair lamp, an electric bulb: steady*

## S.readSketchbookSat

> the sketchbook on the table, a napkin from the bar in it like a bookmark: Yeray, and what he said (the close-up and Alan's first three lines are docs.js S.readSketchbook); then what it means, the first time

- **Alan**: Not Montesdeoca. Not the van, not the hotel, not the circled resorts on the map. `alan_s_sketch_1`
- **Alan**: Baute. [pause] One a month, one by one, down into a vault under the mountain. Only he has the key. And Vasco signed the transfer sheets himself. `alan_s_sketch_2`
- **Alan**: He's up there now. With Baute. Through to Monday. Calling him Rayco. `alan_s_sketch_3`
- **Alan**: I heard every word of it last night. I was too busy watching Rafa's hands to listen. `alan_s_sketch_4`

## S.rafaMorning

> coffee, Yeray, and the truth: "I know." "You know?"; the drawing given; then out, and back to the hotel

- **Rafa**: Go on. Tell him. `rafa_s_again`
- **Rafa**: Café. Real coffee. I promised. `rafa_s_1`
- **Alan**: His sketchbook. With a napkin from the bar in it, like a bookmark. `alan_s_napkin`
- **Rafa**: Yeray. Pobre. He talks when he drinks. I write it down. `rafa_s_yeray_1`
- **Rafa**: It's a bad habit. I'll stop one day. [pause] You know him? `rafa_s_yeray_2`
- **Alan**: No. I know the man he works for. `alan_s_rafa_1`
- **Alan**: Rafa. Last night. When you asked me if there was someone. *[choice]* `alan_s_truth`
- **Alan**: What else did he say? Yeray. *[choice]* `alan_s_ask_yeray`
- **Rafa**: That his professor is a great man. He said it six times. `rafa_s_yeray_more`
- **Rafa**: Nobody says it six times about a great man, hombre. `rafa_s_yeray_more_2`
- **Alan**: When did you draw me? *[choice]* `alan_s_ask_drawing`
- **Rafa**: At dawn. The light was good and you weren't talking. `rafa_s_drawn`
- **Rafa**: You sleep like a man who's been let off something. `rafa_s_drawn_2`
- **Alan**: [pause] I haven't been. `alan_s_drawn`
- **Alan**: Is there sugar? *[choice]* `alan_s_coffee`
- **Rafa**: No. There's honesty. Have some of that. `rafa_s_coffee`
- **Alan**: Let me drink this first. *[choice]* `alan_s_later`
- **Rafa**: Drink. I'm not going anywhere. It's my flat. `rafa_s_later`

## S.rafaTruth

- **Alan**: There is. His name's Vasco. Eight months. He's up on the mountain at Artenara, on the dig. Yeray's dig. `alan_s_truth_2`
- **Alan**: We had a fight yesterday morning, and he left. And I came out last night to be someone who didn't have anything to lose. `alan_s_truth_4`
- **Alan**: And I lied to you. You asked me straight, and you deserved a straight answer. I'm sorry. `alan_s_truth_3`
- **Rafa**: I know. `rafa_s_truth_1`
- **Alan**: You know? `alan_s_truth_5`
- **Rafa**: You said no. [pause] Nobody says no like that unless it's yes. `rafa_s_truth_2`
- **Rafa**: I'm twenty-three, Alan. I'm not stupid. I just thought, he's sad, and he's beautiful, and he's leaving on Sunday anyway. `rafa_s_truth_3`
- **Rafa**: What does it matter, hombre? `rafa_s_truth_4`
- **Rafa**: [pause] It matters. I know it matters. I'm sorry too. `rafa_s_truth_5`
- **Rafa**: Take it. `rafa_s_drawing`
- **Alan**: I can't. `alan_s_cant`
- **Rafa**: Take it. It's yours. It's not mine. I just saw it. `rafa_s_drawing_2`
- **Rafa**: It's the last time you'll look that young. You should have something to remember it by. `rafa_s_drawing_3`
- **Alan**: Thank you. [pause] For the coffee. For the drawing. Mostly for the coffee. `alan_s_thanks`
- **Rafa**: Vale. Go and tell him. [pause] Before Yeray does. Yeray tells everybody everything. `rafa_s_bye`

## S.leaveStudio

> ---------------------------------------------------------------- the walk back; Nieves; the footprint

- **Narrator**: He walks back through a city getting ready for its birthday. Fiestas Fundacionales: five hundred and eighteen years, on the day the sun turns back. `narr_s_walk_1`

## S.lobbySat

> Nieves: the eyebrow that doesn't move, the empty pigeonhole, the coffee

  *(Nieves looks at him: the clothes, the hour, the roll of paper, his face)*
- **Alan**: Her eyebrow doesn't move at all. [pause] That's how bad I look. `alan_s_nieves_0`
- **Alan**: Any messages? `alan_sat_nieves`
- **Nieves**: No. `nieves_sat_eyebrow`
- **Alan**: From Dr. Teles? From the dig? `alan_s_msg_2`
  *(she looks at the empty pigeonhole for 404 longer than she needs to)*
- **Nieves**: No. Nothing, señor. `nieves_s_msg`
- **Nieves**: There's café in the machine. It's still terrible. I'll bring you some. `nieves_s_coffee`

## S.footprint

> room 404, exactly as Vasco left it; and on the tiles by his side of the bed, one wet footprint (Pedro's trace: never explained)

- **Alan**: Just as he left it. His good jacket on the chair. [pause] His watch. He forgot his watch. `alan_s_room_1`
- **Alan**: And on the tiles by his side of the bed... a footprint. Wet. One bare foot, long and narrow, pointing at where I should have been asleep. `alan_s_room_2`
- **Alan**: The balcony doors are shut. [pause] The bathroom's dry. `alan_s_print_1`
- **Alan**: I don't know why I'm thinking of my father. Pedro Sanches. He went out fishing off Cascais when I was a boy, and never came back. [pause] I can't remember his face any more. `alan_s_father`
- **Alan**: Cold. [pause] Salt. `alan_s_salt`
- **Alan**: [pause] Dry. Nothing there at all. `alan_s_dried`
- **Alan**: Inês will ring. Before she does, I want to read it myself. It's my language. It's my family's hand. `alan_s_letter_first`
- **Alan**: Inês. [pause] The phone box. Before I lose my nerve. `alan_s_call_due`

## S.callSatScene

> ---------------------------------------------------------------- the call (core.js S.CALLS, called_sat): Inês The novel's call at eleven, with the last of his change: the confession, "Tell him. Today.", the letter read down the line, the pips, "Promise me you'll come h—". It ends on the dead line, with no "What now?".

- **Inês (on the phone)**: Where have you been? I've been calling the hotel since eight o'clock. `ines_call_sat_1`
- **Inês (on the phone)**: The woman at the desk says you didn't come back last night. The woman at the desk sounds like a disappointed nun. `ines_call_sat_1b`
- **Alan**: Inês. `alan_call_sat_0`
- **Inês (on the phone)**: Alan. Where were you? `ines_call_sat_1c`
- **Alan**: I did something. Last night. Vasco and I had a fight, and he went up the mountain. `alan_call_sat_1`
- **Alan**: And I went out, and I met someone. And I slept with him. `alan_call_sat_1b`
- **Inês (on the phone)**: And you're telling me. Before you've told Vasco. `ines_call_sat_2`
- **Alan**: Yes. `alan_call_sat_2`
- **Inês (on the phone)**: Alan, the rules. The two rules. He told me about them, in the shop, in January. He was so proud of himself for being modern. `ines_call_sat_2b`
- **Inês (on the phone)**: Tell me first. Never to settle a fight. [pause] So you broke both of them. `ines_call_sat_2c`
- **Alan**: I know, Inês. `alan_call_sat_2b`
- **Inês (on the phone)**: Tell him. Today. Not when it's convenient. Not when it's safe. Not when you've worked out how to make it sound better. Today. `ines_call_sat_3`
- **Alan**: I can't reach him. He's on the mountain. The radio's off. `alan_call_sat_3`
- **Inês (on the phone)**: Then find a way. You've always been very good at finding ways into places you shouldn't be. Find a way into one you should. `ines_call_sat_4`
- **Inês (on the phone)**: And Alan. The letter from the cathedral. I've read it. `ines_call_sat_5`
- **Inês (on the phone)**: It took me two days, a dictionary of eighteenth-century abbreviations, and a professor of palaeography who thinks I'm in love with him. `ines_call_sat_6`
- **Inês (on the phone)**: It's from the founders. Four of them signed it. Your family. Bartolomeu Sanches is the first signature. [pause] Are you sitting down? `ines_call_sat_7`
- **Alan**: I'm in a phone box. `alan_call_sat_4`
- **Alan**: I read it too. This morning. Most of it. `alan_call_sat_read`
- **Inês (on the phone)**: You read it? That hand? It took me a professor. `ines_call_sat_you`
- **Alan**: It strikes first at whoever understands the lock. It comes for the ones it gave back. It's shut only at a turning, from inside its water, at the door, at noon. [pause] I couldn't read the last paragraph. `alan_call_sat_rules`
- **Inês (on the phone)**: No. [pause] I wish I couldn't have either. Here it is. `ines_call_sat_last`
- **Inês (on the phone)**: 'To shut the door again, one must stand in its water, at the door, at the noon of the turning, and set the stones while it rises.' `ines_call_sat_11`
- **Inês (on the phone)**: 'The last of the priestesses did this. She set the stones, and the Sea withdrew. And it drew her down with it as it went, and she was not seen again.' `ines_call_sat_12`
- **Inês (on the phone)**: Alan. The cistern backed away from you because of whose blood you are. In Lisbon that saved you. Here, with the door opening, it's the reason it'll want you first. `ines_call_sat_16`
- **Alan**: I know. `alan_call_sat_5`
- **Inês (on the phone)**: So if it's opened in your time— `ines_call_sat_17`
- **Alan**: I know, Inês. `alan_call_sat_6`
- **Inês (on the phone)**: Tell him today. Tell him everything. And then come home. Promise me. Promise me you'll come h— `ines_call_sat_18`

## S.chanoSat

- **Chano**: Another one. [pause] No. Worse. Somebody counted. `chano_s_1`
- **Chano**: Mira. Page six, under the tides. 'Seis muertes por ahogamiento lejos del agua desde diciembre. La policía no ve relación.' Six drowned, nowhere near the water. `chano_s_paper`
- **Chano**: Agaete. Arguineguín. Gáldar. Telde. La Isleta. And the doctora on the mountain road, at Christmas. `chano_s_2`
- **Chano**: Old people, in their beds, in their chairs. One in a bath with no water in it. `chano_s_3`
- **Chano**: One a month, they say. Every dark moon. And the police see no relation. [pause] I see one. `chano_s_4`
- **Alan**: The old ones. Were they on a boat? All of them? `alan_s_chano_1`
- **Chano**: The Virgen del Pino. Seventy-one. Everybody in La Isleta knows that story. `chano_s_5`
- **Chano**: [pause] How did you know, hombre? `chano_s_6`
- **Alan**: Taken back. [pause] The hotel. Inês's fax. `alan_s_chano_2`

## S.faxArrives

> ---------------------------------------------------------------- the fax (Nieves, tue.js), and he tries

- **Nieves**: Four pages, señor, an hour ago. The machine nearly gave up. `nieves_fax_in`
- **Alan**: Whoever understands the lock. [pause] And Vasco's up there, understanding it. He's the best in the world at understanding things. `alan_s_vasco`
- **Alan**: I have to reach him. Today. `alan_s_after_fax`

## S.tried

> Later, he would need to know that he had tried: the museum shut, the dig's radio dead, no car on the island, the bus gone. Tomorrow, the seven o'clock bus. Then, at seven in the evening, people running towards La Isleta.

  *news shouted past the hotel any more: he works out where and when it will come)*
- **Narrator**: He tries. Later, he will need to know that he tried. `narr_s_tried_1`
- **Alan**: The museum's shut for the weekend. Every car on the island is booked for San Juan. And the only guagua to Artenara went at seven this morning. `alan_s_tried_list`
- **Alan**: Fifty kilometres. Uphill. Through the cloud. `alan_s_tried`
- **Alan**: The seven o'clock bus tomorrow, then. At the dig by ten. Find Vasco, tell him everything, deal with Baute together. [pause] Very reasonable. I hate it. `alan_s_bus`

## S.floodScene

> ---------------------------------------------------------------- La Isleta floods Not from the harbour: up through the drains, at seven, with the black mist over the water. Doña Pino in her bed, pulled up by Don Lolo ("By your collar." "By my hair!"); later, the missal, and Alan's name under hers.

- **Narrator**: Seven o'clock. The sea comes into La Isleta: not from the harbour, but up through the drains. `narr_flood_1`
- **Doña Pino**: Madre mía. I fell asleep. I never fall asleep in the afternoon. `pino_s_1`
- **Doña Pino**: I sat down to say a rosary and I fell asleep, and I woke up drowning in my own bed. `pino_s_1b`
- **Doña Pino**: He doesn't sleep. Fifty-five years married, and he has never once slept through the night. I always said it would kill me. `pino_s_2`
- **Doña Pino**: It saved me. He heard the sea in the room. He pulled me up by my hair. `pino_s_3`
- **Don Lolo**: By your collar. `lolo_s_1`
- **Doña Pino**: By my hair! `pino_s_4`
- **Don Lolo**: Collar. `lolo_s_2`
- **Don Lolo**: You said watch. I watched. `lolo_s_watched`
- **Don Lolo**: Fifty-five years, señor. And she still hasn't forgiven me for the first one. `lolo_s_3`
- **Narrator**: Later, the water sinks back into the drains. The neighbours come with towels and soup and opinions. `narr_flood_later`
- **Doña Pino**: Hospital. Pfff. I told that boy where he could put his hospital. [pause] Madre mía, he went red to the ears. `pino_s_hospital`
- **Doña Pino**: Mira. My list. Two crossed out. Two not. `pino_s_missal`
- **Doña Pino**: Antonio is in Venezuela. Maybe it can't reach Venezuela. Maybe it can. Dios sabe. `pino_s_list`
- **Doña Pino**: [pause] And me. `pino_s_list_2`
- **Alan**: It came back for you. And it'll come again. `alan_s_list`
- **Doña Pino**: Sí. [pause] You know a lot about what the sea does, Portuguese. `pino_s_know`
- **Alan**: It's coming for me too. Not for the same reason. But it's coming. `alan_s_coming`
- **Alan**: In Lisbon, in a cistern, it had me up to the chest. It knew my blood, and it backed away. [pause] And there's a bell in Santa Ana with my family's mark on it, Doña Pino. `alan_s_tell_pino`
- **Doña Pino**: [pause] Toma. My pen. Write it under mine. `pino_s_pen`
- **Doña Pino**: Now God knows too. `pino_s_name`
- **Doña Pino**: Go home, Portuguese. Go to bed. Say your prayers. `pino_s_name_2`

## S.alanNight

> the night: on his side of the bed, facing Vasco's; the drawing on the pillow; the phone that doesn't ring; the bus at seven or the plane at eleven fifteen

- **Narrator**: He goes back to the hotel and lies down in his clothes, on his own side of the bed. `narr_s_night_1`
- **Alan**: The ticket. Lisbon, via Madrid. Tomorrow, eleven fifteen. [pause] Or the guagua at seven, up the mountain. `alan_s_night_1`
- **Alan**: One of them might save my life. I don't know which. [pause] And the phone doesn't ring. `alan_s_night_2`
