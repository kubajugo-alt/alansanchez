# The dialogue review, scene by scene (2026-11-04)

How it was made (HANDOFF entry 149): `scripts/dialogue_scenes.mjs` cut every story file into its scenes (each room, each scripted moment) with every line in code order, speaker, stage directions, choices and branches marked: `scenes/` (13 files, 2,166 distinct lines: everything the game plays). Then nine Claude reviewers, one per day, each read the story bible's dialogue rules, the voice sheet and the characters, rated every scene for **sense** (logic, continuity, what each character knows when) and **naturalism** (sounds like people, in their own voice), and flagged the lines that don't work with a rewrite and a severity: **must** (a contradiction or a line that breaks the scene), **should**, **could**. They were told to be selective, since every changed line has to be re-recorded, and to keep what is deliberate (the Spanish words, the flirting, the Sea's rules, the sparse narrator).

Nothing in the game was changed. Each flag keeps the line's id; applying one means editing `js/lines.js` (and re-recording that line, or it plays as a caption).

| Part | Review | Sense | Naturalism | Scenes | must | should | could | Weakest scenes (sense/naturalism ≤ 3) |
|---|---|---|---|---|---|---|---|---|
| The prologue and Tuesday | [review_00-01.md](review_00-01.md) | 4/5 | 4/5 | 39 | 3 | 6 | 8 | room gando (3/4); S.talkDerek (3/5); room canteras (3/4); S.lookSea (3/5) |
| Wednesday | [review_02.md](review_02.md) | 4/5 | 4/5 | 21 | 3 | 10 | 9 | S.startWed (3/4); S.carmenToll (3/4); room museum_hall (arrival) (3/4) |
| Thursday | [review_03.md](review_03.md) | 4/5 | 4/5 | 15 | 4 | 9 | 6 | S.startThu (3/5); S.chanoNewsThu (3/4); S.pinoMissal (3/4); S.readInquiryAloud (3/4); room museum_hall (arrival) (3/5); S.searchDesk (3/4) |
| Friday | [review_04.md](review_04.md) | 4/5 | 4/5 | 12 | 2 | 8 | 7 | S.carmenCave (3/4); S.yerayLeaves (3/4); S.talkYerayBar (3/4) |
| Saturday (Alan) | [review_05.md](review_05.md) | 3/5 | 4/5 | 14 | 3 | 10 | 5 | S.readSketchbookSat (3/4); S.lobbySat (2/5); S.callSatScene (3/4); S.chanoSat (3/4); S.faxArrives (3/4); S.tried (3/4); S.floodScene (3/5) |
| Saturday (Vasco) and the mountain | [review_06.md](review_06.md) | 4/5 | 4/5 | 22 | 1 | 10 | 8 | S.foilRadio (3/4); S.lookSocket (3/4); S.understand (4/3) |
| Sunday | [review_07.md](review_07.md) | 4/5 | 4/5 | 26 | 3 | 7 | 2 | room carmen_flat (3/4); S.elenaBox (3/4); S.whereIsVasco (3/4); S.drive (3/5) |
| Monday | [review_08.md](review_08.md) | 4/5 | 4/5 | 22 | 1 | 10 | 9 | — |
| Across the days: puzzles, the phone box and Ines, background people, close-ups, refusals | [review_09-12.md](review_09-12.md) | 4/5 | 4/5 | 43 | 4 | 13 | 9 | chain (3/4); S.tickTalk (3/4); S.searchDesk (3/4); S.loloRadio (3/2); S.waitHour (2/5); S.radioCall (3/4); S.warnLolo (4/3); S.readInscription (3/4); S.readFax (3/3); S.readSketchbook (3/4) |
| **All** | | | | | **24** | **83** | **63** | |

## The must flags

Checked against `docs/BIBLE.md` by the session that ran the review: the facts they rest on hold (Vasco came after all six discs were out, so "eight days" and "a week on the island" are wrong; Pino's missal strikes five; Pepe died on 17 May; Saturday's radio). Some are the contradictions already listed in HANDOFF "Start here" (Pino's list, Chano's "Now two", Lolo's "this afternoon"); Saturday's timing needs a story decision first (Alan's call at one o'clock, or Vasco's message before it).


### The prologue and Tuesday

- `alan_look_vasco_gando` (Alan): "Vasco. A week on the island and he's brown already. He looks like a man who's slept four hours a night and never been happier in his life." → "Vasco. A month on the island and he's brown as a saddle. He looks like a man who's slept four hours a night and never been happier in his life." Vasco has been in Gran Canaria a month (bible, HANDOFF 103), not a week.
- `vasco_t_missed` (Vasco): "Madrid can keep it. [pause] Come here. Eight days. I counted them. I'm an archaeologist, I count things." → "Madrid can keep it. [pause] Come here. Twenty-five days. I counted them. I'm an archaeologist, I count things." Nothing says they met eight days ago, and he has been on the island about a month. Set the exact number from Vasco's arrival date in HANDOFF 103, and the joke gets better the more precise it is.
- `alan_look_sea_3` (Alan): "A man drowned in his bed last night and the sea looks innocent. That's how you know." → "A man drowned in his bed a month ago, with the window shut, and the sea looks innocent. That's how you know." (Thursday.) Pepe drowned on 17 May. Wednesday night's cutscene is a flashback, and Chano tells Alan on Thursday "A month ago now", so nobody drowned "last night".

### Wednesday

- `alan_w_dawn_say` (Alan): "Say it. I did see a ghost. The thing from the cistern. It's here, and I'm frightened." → keep the text but play it after the door closes, as what he should have said: "I should have said it. I saw a ghost. The thing from the cistern. It's here, and I'm frightened." In the current sequence it is spoken in Alan's voice straight to Vasco, so the player hears him tell the truth and then lie in the next breath.
- `alan_w_coffee` (Alan): "[pause] He was right. It's terrible." → "[pause] Terrible, he says. [pause] I'll take his word for it." The bible's motif is that Alan looks at the coffee every morning and only drinks it on the last one. If he drinks it on Wednesday the final image is already spent (the 'drink' pose would need to change to a look).
- `carmen_cigs_none` (Carmen): "No. Not one word until there's a cigarette in my hand. Bring me cigarettes. The kiosk on Las Canteras. Coronas. Vamos." → "Not one word. This is my last one, and I'm not wasting it on you. Bring me Coronas. The kiosk on Las Canteras. Vamos." This fixes a contradiction the player has just seen on screen. Dropping her "No." also keeps it fresh for the novel's "No." / "I haven't asked anything." when he comes back.

### Thursday

- `chano_th_pepe_6` (Chano): "Doña Pino. Sí. She was on the same boat as Pepe, in seventy-one. The Virgen del Pino. [pause] Seven came up out of el mar the next morning. Since Christmas they've been going, one a month. Now two." → "Doña Pino. Sí. She was on the same boat as Pepe, in seventy-one. The Virgen del Pino. [pause] Go and ask her, chacho. Gently. She keeps the names." "Now two" reads as "now two have died". Chano also hands over the pattern (one a month) that belongs to Pino's missal and Saturday's paper, and Pino repeats "seven pulled out in the morning" one scene later. The new line keeps the hook that sends Alan to her.
- `alan_ask_carmen_elena` (Alan): "The list says disc one came out in December. The night before Dr. Suárez died." → "The list says disc one came out in December. [pause] Dr. Suárez died in December." Alan has only heard "she died in December" (Baute, Tuesday), so he can't know the night. It also spells out Baute's secret (the first disc, then Elena the next night), which the bible keeps for Saturday.
- `mercedes_juan_3` (Mercedes Quintana): "He drowned in his own bed eleven days later. With the window shut. The family has always said it was drink." → "He drowned in his own bed eleven days after he swore to this. With the window shut. The family has always said it was drink." Coming after "pulled him out of the water at Gáldar", "later" reads as eleven days after the rescue in 1483, which is impossible for a man who testifies in 1484 about the whole three months. The fol. 13 page says "after giving this testimony". Note for the story owner: a 1484 drowning sits after "the sea went back, and has not risen since", so either the line makes that oddness deliberate or the date moves.
- `vasco_th_speech_1` (Vasco): "...and carved its walls with triangles. Dozens of them, all pointing down." → "...and carved its walls with triangles. Seven of them, all pointing down." The game's cave has seven triangles for seven discs (Carmen's photograph on Friday, the lock), and the cave's own expert can't get the number wrong in his big speech.

### Friday

- `vasco_f_van_2` (Vasco): "I signed the transfer sheets myself. They're in the conservation lab in the museum's basement. You could have asked me. [pause] You could have just asked me." → "I signed the transfer sheets myself. They're at the conservation lab, in Las Palmas. You could have asked me. [pause] You could have just asked me." If the lab were in the museum's basement, Alan would check it himself that afternoon while he is down there with Carmen. On Sunday Carmen has to phone "a number Alan didn't know" to reach it, and Yeray says "they go to Las Palmas, to the lab".
- `yeray_bar_2` (Yeray): "...down to the— the vault. The old granary. Under the caves. And he locks it. Click. [hiccup] And only he's got the key. Only him." → "...down to the— the vault. The old granary. Under the caves. And he locks it. Click. [pause] And only he's got the key. Only him." "[hiccup]" breaks the rule that [pause] is the only bracket allowed in a line, and a voice engine may read it aloud.

### Saturday (Alan)

- `nieves_sat_eyebrow` (Nieves): "No." → "A Señora Carvalho, from Lisbon. Three times since eight." Fixes the continuity, sets up `alan_s_letter_first` ("Inês will ring"), and makes the empty pigeonhole sharper: only Vasco hasn't called.
- `ines_call_sat_last` (Inês): "No. [pause] I wish I couldn't have either. Here it is." → "No. [pause] I wish I couldn't have either. The rest's on your hotel's fax. Here's the end." With `ines_call_sat_8` cut, nothing tells Alan there is a fax, yet he says "Inês's fax" to Chano and asks Nieves for it.
- `pino_s_missal` (Doña Pino): "Mira. My list. Two crossed out. Two not." → "Mira. My list. Five crossed out. Two not." The missal on screen strikes five of the seven, Chano has just counted them, and on Friday she said "Five crossed out" (`pino_f_1`).

### Saturday (Vasco) and the mountain

- `vasco_v_07b` (Vasco): "Rayco. What's in the vault?" → "Rayco. Where are the discs?" Vasco knows nothing about a vault until he wakes in it (Baute even introduces it: "Mira. A Canario granary"); all he has is Yeray's "They're not going to Las Palmas", and "Rayco doesn't deny it" still works after the new line.

### Sunday

- `alan_su_idiot_4` (Alan): "Two people have drowned in their beds, and Vasco is up on that mountain with Rayco Baute, and I can't reach him." → "Six people have drowned since December, and Vasco is up on that mountain with Rayco Baute, and I can't reach him." Chano's paper counted six on Saturday, Alan wrote his own name under Pino's list, and "two in their beds" matches nothing he knows.
- `carmen_su_museum` (Carmen): "The museum. The guard tried the dig radio twice. Nada. [pause] The camp's been silent since Friday morning." → "The museum. The guard tried the dig radio twice. Nada. [pause] The camp's been silent since yesterday afternoon." The camp was on the air on Saturday (Baute answered Alan from it at one; the fuse went into Yeray's pocket after that).
- `alan_su_think_2` (Alan): "The radio's been dead since Friday. Not one message in two days, from a man who leaves notes about the coffee." → "The radio's been dead since yesterday. Two days, and not one word to me, from a man who leaves notes about the coffee." The current line contradicts Saturday's radio call and `alan_su_lolo`, which plays just before it (Vasco's "Tell Alan... Under.").

### Monday

- `alan_m_1d` (Alan): "When it came, it took him. It took half the people on the shore. It had me too, and it let me go, because of whose blood I've got. [pause] I don't think it'll do that twice." → "When it came, it took him. In his own cistern, in his own water. It had me too, and it let me go, because of whose blood I've got. [pause] I don't think it'll do that twice." In Game I the Sea took three people in locked rooms and Vicente in the cistern, and the tide turned with "nobody drowned"; nobody on a shore died, so this line breaks the first game's canon.

### Across the days: puzzles, the phone box and Ines, background people, close-ups, refusals

- `lolo_s_talk_2` (Don Lolo): "From here? The city's in the way, and the mountain's behind the city. You want height. Go up the cathedral tower. Higher than the houses, facing the mountain." → "From here? No. The city's in the way. [pause] Height. The cathedral tower. It faces the mountain." Too fluent for Lolo, and it keeps the same clue.
- `lolo_s_talk_3` (Don Lolo): "And Portuguese. This afternoon, on the mountain's channel. I listen to everything, I don't sleep. A man said a few words and went." → "And Portuguese. Today. The mountain's channel. [pause] I don't sleep. I listen." Same reason, and "a man said a few words and went" repeats what `lolo_s_talk_4` says.
- `alan_s_wait_bell` (Alan): "One o'clock. [pause] My family's bell." → "Four o'clock. [pause] My family's bell." Part of the timing fix below. The narrator's `narr_s_wait_bell` and the BIBLE's "at one o'clock" need the same change.
- `alan_s_radio_static` (Alan): "Canal 9. Static. [pause] On the hour, the note said. It's ten to one." → "Canal 9. Static. [pause] On the hour, the note said. It's ten to four." The timing contradiction above.
