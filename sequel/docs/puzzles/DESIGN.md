# New puzzles: design (2026-10-30)

The user: "there is too little multi-stage puzzles. Most of the tasks Alan has are 'go to a place, talk to a person'...
something with attempting the contact with Vasco via the radio... more with the documents... the Castilian and Canarii
perspective... the Montesdeoca/Baute motives... the rules about the sea, that are now essentially handed by Inês". The
proposal (nine ideas) was approved: "all sound like a very good idea".

The rule behind all of it: **knowledge is inventory.** Alan collects words (a phrase, a name, a date) by reading and
listening; he uses them on notebook pages, in conversations and on documents, the way he'd use a key. The game used to
narrate three deductions (Thursday's misread map, Saturday's "Not Montesdeoca. Baute.", Sunday's "Alan thinks it
through") and let three people read the history aloud (Inês, Carmen, Mercedes). Now the player does the thinking.

Everything new is text only until the user has played it: no voices are generated (lines without a file play as
captions). The story's rules hold: the Sea is never shown, never voiced, never funny.

## The mechanic: words, and pages with blanks

- `S.learn(id)`: Alan notes a word (`F().words`), with a toast ("Noted: fechadura"). `js/story/puzzles.js` lists every
  word (`S.WORDS`: id → what shows on the page) and where it's learned.
- `S.PAGES`: notebook pages with blanks. Each blank has a pool of candidate words; only the ones Alan has learned are
  offered (the rest show as "…"). Click a blank to cycle through them. When every blank is filled the page checks
  itself: right, it's solved (a flag, Alan's line); wrong, Alan says how many he's sure of ("Two of these are wrong.",
  as The Case of the Golden Idol does), and the player tries again.
- The pages live in Alan's notebook (N), after his notes, when they're open. A page that the story needs solved has a
  hint line in Inês's "What now?".
- Tests drive a page with `S.fillPage(id, {blank: word})`.

## The puzzles, day by day

### Thursday: two tellings of 1483 (the Castilian and the Canario side)
After Carmen's history and Mercedes's inquiry, a page with two columns: what the Castilians wrote (the inquiry, Abreu
Galindo's chronicle, written for the conquerors), and what it was (Carmen, the Artenara grandmothers, Galindo's own
asides). Four rows:
| The Castilians wrote | It was |
|---|---|
| "women in white singing on the cliffs" | the **harimaguadas** (Galindo: the women who served at the holy places and bathed in the sea) |
| "the sea rose black against the wind" | they **called** it (Carmen: the legend) |
| "a miracle of the Baptist" on Saint John's morning | **Magec**, the sun, at the turn (Galindo; Carmen) |
| "it did not come again" | **la cueva aguanta el mar** (the grandmothers) |
Distractors in the pools: witches (las brujas del 83), the Baptist, a storm, the equinox, panza de burro.
**Then folio 12.** The inquiry jumps from fol. 11 to fol. 13 (now on its pages). With the page solved, Alan asks
Mercedes; she finds fol. 12 misfiled in the Holy Office's 1505 bundle: the sworn statement of the Canario fisherman
who pulled Juan de Quintana out of the water. The only Canario voice in the Castilian file, struck from the record
because it contradicted the miracle: the women did not call it on the Castilians, they called it, and it would not be
aimed; they shut it with Magec at the cave; and "the sea will want back the ones I took from it". The notary's "Nadie
preguntó a las mujeres" is now under a folio somebody removed. (Fiction, as the rest of 1483.) Required for the dinner.

### Thursday: the case against the wrong man (built by the player)
Before the dinner, the plan is the player's: a page "Who is taking the discs?":
"[Montesdeoca] is taking the discs. His [van] carries them out of the museum. He wants [a hotel at Artenara] and needs
the cave worthless. The proof will be in [Baute's office]." Words from Tuesday to Thursday (the reception, the van, Chano's
theory, Gail's news that Montesdeoca's contract with the museum is upstairs in Baute's office). Thursday's answer is
the wrong man, and that's the point: the mistake is the player's. Required for the suitcase (it replaces "he makes his
plan the way you have a fever"). After Friday's fight the page shows Vasco's answers struck through it.

### Thursday: the break-in against the clock
"If I go over twenty minutes, cough." Vasco's talk is the window: the clock overlay counts it down while the dinner is
on, a few minutes an action. When it runs out before the drawer is open, the talk ends and the questions begin ("ten
more minutes, if the academics are slow"); the second time, a professor asks a question that is really a lecture,
and Alan has as long as it lasts. Pressure, never a dead end. He's caught anyway, because he stays too long over the
photograph.

### Saturday: the case, again
After Rafa's sketchbook, the same page re-sorted. Two new things to find first:
- **The blazer's lining** (Montesdeoca's blazer, still in Alan's bag): a receipt folded small, from a parish on the west
  coast, a mass every year "por los difuntos de Tasarte, 1966. I. M." He's guilty of 1966 and still paying for it.
- **Chano**, shown the receipt: Tasarte. The bulldozers in '66; the young site manager with a clipboard was Ignacio
  Montesdeoca; the people they put in the skip were the Bautes' dead. Everyone knows, nobody says.
The page: "[Baute] is taking the discs. [Yeray] carries them down to the vault under the caves. In 1966 Montesdeoca's
bulldozers cleared [Tasarte], where Baute's grandmother's people were buried. The six circled hotels aren't
Montesdeoca's plans; they're Baute's [targets]." Solving it opens the day: Alan has to reach Vasco.

### Saturday: the founders' letter, read by Alan himself
Alan is Portuguese; what he can't read is 1751's handwriting: faded ink, abbreviations, letters gone. On Saturday
morning, in 404, before Inês rings, he sits down with it. A page of the letter with four gaps, each a word with letters
missing, and the words he's met this week to fill them:
- "o Mar fere primeiro a quem entende a f·ch·d·ra" — **fechadura** (Inês, Thursday: the ledger, "para estudar a
  fechadura")
- "vem buscar toda alma que lhe foi dev·lv·da" — **devolvida** (Doña Pino's list: "Los que el mar devolvió")
- "só se fecha numa v·r·g·m" — **viragem** (Carmen, Friday: "the morning el sol turns back")
- "de dentro da sua água, à p·rt·, enquanto o sol nasce" — **porta** (Carmen, Friday: Elena thought the triangles
  pointed at a door)
The last paragraph is too far gone; that's the one Inês reads him down the line (the cost: the last priestess, "she was
not seen again"). The rules are now Alan's; the call keeps the confession, "Tell him. Today.", the cost and the pips.
Required for the call.

### Saturday: the two radios (and Vasco's chapter)
- **Room 404:** under Vasco's books on the chest of drawers, the note he left on Tuesday: "If you need me: the museum
  radios the camp. Canal 9, on the hour. V." The museum is shut. Alan needs a radio.
- **Chano:** "La guagua? To Artenara? Once a day, chacho. At seven in the morning." (and Tasarte, above)
- **La Isleta, Don Lolo:** he has a hand radio for the harbour, and he doesn't talk to tourists. He answers someone who
  talks like the island: Alan has to use island words (chacho, guagua, panza de burro), a short exchange in which
  plain English gets "Mmh." Then Lolo lends it, and tells him two things: the mountain's behind the city, so go up
  high, the cathedral tower; and that this morning, on the mountain channel, a Portuguese voice said a few words and
  went: "Tell Alan... not the van... the discs... under—", then frying.
- **Santa Ana:** Don Fermín lets him up (the clock Alan wound on Wednesday is going). At the bell window: static. The
  camp listens on the hour. The clock says ten to one; wait for it; Alan's family's bell strikes one.
- **Baute answers.** Warm and easy: Vasco finished in the cave this morning and went down to Las Palmas on the guagua;
  he'll be at the hotel tonight, he wanted to surprise you. The player has to catch it: "The guagua from Artenara goes
  at seven in the morning, Dr. Baute. Once a day." Other answers only make Baute add detail. Caught, a silence; "Then he
  got a lift. Over." Nothing more. Alan knows Vasco is up there and Baute is lying about it.
- **Vasco's chapter (played afterwards):** the radio has no fuse; Vasco bridges it with the foil from Yeray's cigarette
  packet by the stove, and gets a few seconds out ("If anyone hears this, tell Alan, it isn't the van, the discs aren't
  going to the lab, they're going down, under—") before the foil burns through and Rayco's shadow falls across the
  radio. The player sends the message Lolo heard.
- **Sunday:** Alan's reasoning in Carmen's flat names Lolo's "under" and Baute's lie with the granary.

### Saturday: who's next (the Sea's rules, used)
After the radio, a page: "It comes for the ones it lost. Next on Doña Pino's list, still in the city: [Pino Medina]
(Antonio is in Venezuela; Manuel lives high up in Tamaraceite). It comes up from below, where the city is [lowest]: La
Isleta. It comes with the tide: high water tonight at [19:04]." The tide table on the promenade (a new close-up at Las
Canteras) gives the hour. Solved, Alan runs to La Isleta before seven and warns Don Lolo, who now trusts him; Lolo
sits up by the bed with his feet in a basin of nothing. The flood comes, and Lolo pulls her up; this time he was
awake because Alan told him. ("You said watch the drains. I watched.") Alan still writes his own name at the bottom of
her list.

### Island words (Tuesday to Saturday)
Words people teach Alan: chacho (Chano, Tuesday), panza de burro (Vasco, Tuesday's drive), guagua (Chano, Saturday),
guiri (the parrots). Used on Don Lolo (required) and, for fun, on the parrots at Casa de Colón.

## What stays as it was
The finale (Vasco calls the discs, Alan sets them: the puzzle is the relationship), the confession, the bar night, the
fight's choice, every existing line id (recordings are named by id; changed text means a re-record later).
