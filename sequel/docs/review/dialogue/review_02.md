# Dialogue review: Wednesday

Overall: sense 4/5, naturalism 4/5. Wednesday is the best-shaped day so far: the Pino, Fermín and Carmen scenes keep the novel's rhythm, every character sounds like their voice-sheet entry, and the running jokes (Fermín dying on the stairs, "Mi mesa", the deported book) land. The real problems are a few logic slips around the scripted moments: at dawn Alan says the truth aloud before he lies, and he drinks the coffee, which spends the game's last gesture on day two. Carmen also demands a cigarette while she is smoking one. Smaller repeats: the van and crate logic doesn't add up, two reveals get no follow-up (Fermín's Artenara, Chano's sponsor theory), and Lolo's Wednesday line gets in ahead of his Friday punchline.

## S.startWed
Sense 3/5 · Naturalism 4/5. The dawn exchange is warm and sparse, but as built (`off(...)` plays both in a row) Alan says the confession aloud to Vasco and then says "Sunburn", and the coffee he drinks undercuts the ending.
- `alan_w_dawn_say` (Alan) **must**: "Say it. I did see a ghost. The thing from the cistern. It's here, and I'm frightened." → keep the text but play it after the door closes, as what he should have said: "I should have said it. I saw a ghost. The thing from the cistern. It's here, and I'm frightened." In the current sequence it is spoken in Alan's voice straight to Vasco, so the player hears him tell the truth and then lie in the next breath.
- `alan_w_coffee` (Alan) **must**: "[pause] He was right. It's terrible." → "[pause] Terrible, he says. [pause] I'll take his word for it." The bible's motif is that Alan looks at the coffee every morning and only drinks it on the last one. If he drinks it on Wednesday the final image is already spent (the 'drink' pose would need to change to a look).
- `alan_w_wake` (Alan) **could**: "Up the mountain, into the sun. Down here it's grey, and I have a whole day and nothing to do with it but worry." → "He's gone up the mountain, into the sun. Down here it's grey, and I have a whole day and nothing to do with it but worry." Without a subject the opening fragment reads as Alan's plan, not Vasco's.

## room isleta
Sense 4/5 · Naturalism 4/5. Good, short looks that grow stranger as the week goes on. Only the boats line still jokes beside the sea after Tuesday, against rule 7.
- `alan_look_boats` (Alan) **could**: "Painted boats. Virgen del Carmen. Virgen del Pino. Half the fleet is named after the Virgin, which seems sensible here." → "Painted boats. Virgen del Carmen. Virgen del Pino. Half the fleet named for the Virgin. Somebody out here wants looking after." Rule 7: near the sea after Tuesday, no jokes. This version also plants the *Virgen del Pino* for Thursday.

## S.talkPino
Sense 4/5 · Naturalism 4/5. A strong, novel-true scene ("emptying its pockets", the memory, "I'm not a savage"). It stumbles where "Because it's looking for something" is dropped for an unprompted introduction, and the trousers joke may not fit what Alan is wearing.
- `pino_w_1` (Doña Pino) **should**: "Pino. Doña Pino, to you. That's Lolo. He doesn't talk." → "Don't ask me for what. Ask el mar. [pause] I'm Pino. Doña Pino, to you. That's Lolo. He doesn't talk." Right now the obvious "looking for what?" goes unasked and she introduces herself out of nowhere. One clause covers both (rule 2).
- `pino_w_pretty` (Doña Pino) **should**: "Pretty, though. Lolo, mira. A pretty one. [pause] Pity about the trousers." → "Pretty, though. Lolo, mira. A pretty one. [pause] Pity about the shorts." By day Alan is drawn in the black vest and cargo shorts (HANDOFF 320). Check the Wednesday sprite: if he is in shorts, "trousers" is wrong on screen.
- `alan_w_pino_shy` (Alan) **should** (only with the line above): "Thank you. I think. [pause] The trousers have had a very difficult week." → "Thank you. I think. [pause] They're borrowed. So is most of me, this week." This matches the outfit, and the old line's "very difficult week" was said on his first full day.
- `lolo_w_1` (Don Lolo) **should**: "Fifty-five years. I married her in a storm. She hasn't forgiven me for the storm." → "Fifty-five. [pause] In a storm." Lolo is "almost nothing" with "one full sentence, at the end". This line uses up his Friday punchline ("she still hasn't forgiven me for the first one") two days early, and it also plays from S.talkLolo.
- `pino_w_2b` (Doña Pino) **could**: "Five hundred years in el mar, and it comes up in my net in the same week." → "Five hundred years in el mar, and now two in one week. His, and mine." It's not clear what "the same week" refers to. This ties it to the grandson's helmet from the line before.

## S.talkLolo
Sense 5/5 · Naturalism 5/5. Friday's three lines are the bible's best quiet beat, and "Mmh." is right. (`lolo_w_1` is flagged under S.talkPino.)

## room santa_ana
Sense 4/5 · Naturalism 4/5. The decision lines and the letter opening are good. The player will ask why a Portuguese bookseller can read only one word in four of a Portuguese letter, and the scene never says.
- `alan_w_open_0` (Alan) **should**: "Four sheets, both sides, in a small brown hand. Portuguese. The Portuguese of two and a half centuries ago." → "Four sheets, both sides, in a small brown hand, faded almost to nothing. Portuguese, two and a half centuries old." The BIBLE's reason (the ink is faded) is missing, so "One word in four I can read" (`alan_w_letter`) sounds wrong from a Lisbon bookseller. It also sets up Saturday, when he reads it himself.
- `alan_look_dogs` (Alan) **could**: "Eight bronze dogs, life-sized. Nobody has ever been able to explain them to me. The islands were named for dogs, apparently. Canis." → "Eight bronze dogs, life-sized. The islands were named for dogs, apparently. Canis. [pause] Not a canary in sight." The line says nobody can explain the dogs and then explains them, and "ever... to me" implies he has been here before.

## room santa_ana_inside
Sense 5/5 · Naturalism 4/5. The examine lines are tidy and funny ("yes, but in granite").

## S.talkFermin
Sense 4/5 · Naturalism 5/5. Fermín is perfectly in voice. Two optional answers give away or drop a reveal.
- `fermin_bells` (Don Fermín) **should**: "Four. The big one, the north one, is the oldest. Cast in 1751. My grandfather never liked to talk about her." → "Four. The big one, the north one, is the oldest. Older than the clock. [pause] My grandfather never liked to talk about her." If the player asks this first, the date gives away the "Lisboa. 1751." moment on the bell.
- `fermin_founders` (Don Fermín) **should**: "That they went up to Artenara for a month, and came back quiet. And one of them came back white as a candle, and never said why." → "Up to Artenara, señor, for a month. Where the caves are. They came back quiet, and one of them white as a candle, and never said why." Artenara is where Vasco's cave is, and Alan gets no reaction to it. The line should make the link itself, since there is no follow-up (rule 2).

## S.pickKey
Sense 5/5 · Naturalism 5/5. "Now why did I tell him that?" and the wrong-key retorts are just right.

## room belfry
Sense 5/5 · Naturalism 4/5. "Not after last time" and the grey lid from the window are good. Nothing to flag.

## S.windClock
Sense 4/5 · Naturalism 5/5. The novel's beat is kept intact. "Founder's hands" is slightly blunted because Alan has just told Fermín his family made bells, but that is the novel's order and works.

## S.lookBell
Sense 5/5 · Naturalism 5/5. The mark and "Sanches made me" carry the day's emotional peak in two lines.

## S.rubBell
Sense 5/5 · Naturalism 4/5. Fine.

## S.talkFerminBelfry
Sense 5/5 · Naturalism 5/5. The founders' story has the right shape. The letter itself answers "What were they looking for?", and "My father was wrong about many things" is the scene's best line.

## room archive
Sense 4/5 · Naturalism 4/5. Good arrival beat (PROHIBIDO FUMAR). The ashtray's "all the same brand" makes the toll problem below worse.

## S.carmenToll
Sense 3/5 · Naturalism 4/5. The toll is a good running device. On Wednesday, though, Carmen is shown smoking (`alan_look_carmen`, `alan_w_arch`, four stubs of her own) when she says she won't talk until there's a cigarette in her hand.
- `carmen_cigs_none` (Carmen) **must**: "No. Not one word until there's a cigarette in my hand. Bring me cigarettes. The kiosk on Las Canteras. Coronas. Vamos." → "Not one word. This is my last one, and I'm not wasting it on you. Bring me Coronas. The kiosk on Las Canteras. Vamos." This fixes a contradiction the player has just seen on screen. Dropping her "No." also keeps it fresh for the novel's "No." / "I haven't asked anything." when he comes back.
- `carmen_cigs_thanks_3` (Carmen, Thursday) **could**: "You're learning, inglés. Good..." → "You're learning, portugués. Good..." She knows exactly who he is, and everyone else on the island makes a point of "Portuguese". Keep "inglés" only if it is meant as a jab.

## S.talkCarmen
Sense 5/5 · Naturalism 4/5. Fine.

## S.carmenWed
Sense 5/5 · Naturalism 5/5. The strongest scene of the day: denial played as denial, the pen, the cigarette stubbed out, the book held out behind her. One small on-the-nose line when she is alone.
- `carmen_w_alone` (Carmen) **could**: "Two idiots on a mountain, squinting at el sol. [pause] I still haven't erased your message, Elena." → "Two idiots on a mountain, squinting at el sol. [pause] He smelled it too, Elena." Elena's message, heard straight after, already sets up the tape. This line explains it to the person who left it, when it could react to what Alan just said.

## room museum_hall (arrival)
Sense 3/5 · Naturalism 4/5. The red herring works in spirit, but the logistics are muddled: crates are going out, the guard says they are new cases coming in as a gift, and "down the hill" makes no sense at a museum in Vegueta. "Six signatures" also invites the question whose, when Alan would know Vasco's hand.
- `alan_w_crate_2` (Alan) **should**: "And under it, the others. One a month since December. Six lines, six signatures. [pause] And the crate's going down the hill today." → "And under it, the others. One a month since December. Six lines, six dates. [pause] And the crate's going out today, in a hotelier's van." The herring is the van's owner, not the slope. Naming signatures would make Alan look at them, and Friday depends on him not having noticed Vasco's.
- `guard_w_van` (Guard) **should**: "Display cases, señor. Nuevas. A gift for el museo, from Don Ignacio." → "The cases come in, señor. Nuevas, a gift from Don Ignacio. These go out." The scene shows crates being loaded, so as written the guard's answer contradicts what the player sees. "And the discs?" / "I just carry them" then follows naturally.

## S.chanoTheory
Sense 4/5 · Naturalism 4/5. Chano's gossip rhythm is good ("Montesdeoca's van is very big"). The theory skips the question anyone would ask: why would the dig's sponsor want the cave to be worthless?
- `chano_w_th_4` (Chano) **should**: "And the only thing in his way is that dig. If the cave's important, he can't build. But if somebody proves the cave's not important..." → "Why do you think he pays for the dig, hombre? So he's holding the spade. If the cave's important, he can't build. But if somebody proves it's not..." This answers the obvious objection, so Alan's "It's neat" can still be the trap it is meant to be.

## S.checkWed
Sense 4/5 · Naturalism 4/5. A useful recap. One tense slip.
- `alan_w_done` (Alan) **could**: "...and a letter nobody's opened in two hundred and forty-five years." → "...and a letter that waited two hundred and forty-five years for me." He opened it on the fountain an hour earlier. The rewrite is also more personal.

## S.endWed
Sense 4/5 · Naturalism 5/5. Vasco's tired joy, the boots, the "smile with teeth missing" and "felt kind at the time" all land. Two small wording points.
- `vasco_w_night_2` (Vasco) **could**: "Six sockets empty now. They came out before I got here..." → "Six sockets empty. They came out before I got here..." "Now" suggests a change today, when the last disc came out in May, before he arrived.
- `narr_pepe_9` (Narrator) **could**: "He only said, very quietly, into the dark: 'Ah. There you are.'" → "At the end he said, very quietly, into the dark: 'Ah. There you are.'" With the middle narrator lines cut, "only" has nothing left to contrast with.

## Summary of flags

| severity | line id | speaker | problem (short) |
|---|---|---|---|
| must | `alan_w_dawn_say` | Alan | Confession spoken aloud to Vasco, then "Sunburn" |
| must | `alan_w_coffee` | Alan | Drinks the coffee on day two; spends the ending's motif |
| must | `carmen_cigs_none` | Carmen | Demands a cigarette while smoking one |
| should | `pino_w_1` | Doña Pino | Unprompted intro; "looking for what?" dropped |
| should | `pino_w_pretty` | Doña Pino | "Trousers" while Alan is drawn in shorts (check sprite) |
| should | `alan_w_pino_shy` | Alan | Follows the trousers fix; "difficult week" on day two |
| should | `lolo_w_1` | Don Lolo | Too many words; pre-empts Friday's punchline |
| should | `alan_w_open_0` | Alan | No reason given why he can't read Portuguese (faded ink) |
| should | `fermin_bells` | Don Fermín | Gives away the 1751 reveal on the bell |
| should | `fermin_founders` | Don Fermín | Artenara reveal with no link or reaction |
| should | `alan_w_crate_2` | Alan | "Down the hill"; "six signatures" invites whose |
| should | `guard_w_van` | Guard | Cases "coming in" while crates go out |
| should | `chano_w_th_4` | Chano | Sponsor-wants-it-worthless left unexplained |
| could | `alan_w_wake` | Alan | Subjectless fragment |
| could | `alan_look_boats` | Alan | Joke beside the sea after Tuesday (rule 7) |
| could | `pino_w_2b` | Doña Pino | Vague "the same week" |
| could | `alan_look_dogs` | Alan | Contradicts itself; implies he has been before |
| could | `carmen_cigs_thanks_3` | Carmen | Calls him "inglés" |
| could | `carmen_w_alone` | Carmen | Explains the message to the dead |
| could | `alan_w_done` | Alan | "Nobody's opened" after he opened it |
| could | `vasco_w_night_2` | Vasco | "Now" implies a change today |
| could | `narr_pepe_9` | Narrator | "Only" left over from cut lines |
