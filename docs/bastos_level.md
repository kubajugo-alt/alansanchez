# Graça: Professor Bastos's flat (Chapter III) — DRAFT FOR APPROVAL

Nothing here is in the game yet. Approve (or mark changes on) the script below; then the room is painted in Canva for
a review page, Bastos's voice is picked from candidates, and only then is it built, recorded and tested.

## The idea

Professor Henrique Bastos (died Friday 27 October 1995, day 5 of the fog), retired anthropologist at the University of Lisbon: sea myths, drowned cities, the occult.
(Rui's recorded line, "a retired teacher up in Graça", stays true.) A founder's descendant who spent forty years
studying his own family's legend without believing it. On the morning of Friday 27 October, "a collector" visited him with a gift:
a tile, on the morning of the day he died (a tile drowns a sleeper at the next turning: rule 4). He fought sleep, and drowned in his bed at 15:38, at the top of the highest hill in Lisbon.

His flat is where the magic is explained properly: the sea as the oldest force, the debt every seafaring people kept to
it, and what a bell baptised in the sea really is: the Brotherhood rang it to call back their drowned, and the
sea answered by coming itself, in waves, not with the dead. Inês comes along and reads his books; his own voice explains the
rest on his lecture tapes.

## Where it sits

- **Chapter III**, after the ledger is decoded at the Carmo: a third thread beside the Sé tower and the antiques shop,
  in any order. **Required** to close the chapter (the shop's chapter-end check adds `bastos_done`).
- **Unlock:** back in the shop after the decode, Inês recognises the second name on the list. The map gains a pin,
  "Graça · Prof. Bastos". Choosing it, Inês comes too; she stays in the flat with Alan (talking to her gives the hints
  there) and is back at the shop afterwards.
- **Getting in:** police tape and a Ferreira lock: Joaquim's desk key opens it on arrival ("All my founder locks share
  one key-square", the repair book, Ch. II).

## The room (one painting, Canva first)

A top-floor study and living room in Graça (approved: Canva MAHYw-NyuDY): bookshelves on the left with the objects of
the cultures they describe, knocked out of order, books on the floor; a world map with coloured pins between two tall
windows over the rooftops, the river lost in the fog; a desk and a glass display case holding a reel-to-reel tape
recorder; a leather sofa, an armchair and a side table on the right. Light and airy, soft daylight through fog. No bed:
the flat is only the living room (his death is already told elsewhere).

## The puzzle

1. **The collection** (the heart of the level). Lacerda went through the flat looking for "the old seal", and every
   object is off its shelf. Bastos drew a label on each book's spine with the motif of its object (a fish, a net, a
   bell, two jewels, a seal...). Click an object, then a book (or the other way round). Wrong: an Alan line. Right:
   Inês takes the book down and reads the myth (a close-up page in Bastos's hand, HTML text like the ledger), then Alan
   reacts. Eight pairs. The notebook gains a page, "The Sea".
2. **The case opens** when all eight are back: inside, the tape recorder and his labelled reels.
3. **The lecture tapes** (Bastos's own voice): what a bell baptism is; that the Brotherhood had theirs baptised in the sea to call
   back their drowned; that the sea answered by coming itself, in the three waves of 1 November 1755, not with the dead;
   and that renouncing undoes a baptism.
   **The recording riddle** (a close-up of the recorder): nothing is threaded. Put a lesson reel on the left spindle,
   lead the tape through the head to the empty take-up reel on the right, press Play. Out of order: an Alan line.
4. **The missing last reel**: the box "27 de Outubro" is empty, with a small rose drawn on its label, the same motif as
   the Iemanjá book. Bastos hid the reel from the collector in Iemanjá's toy boat on the shelf. Take it from the boat,
   thread it, play it: the morning he died, up to "I am going to lie down. Only for a minute."

Done when the last tape has been heard (`bastos_done`).

## The eight objects and their myths

| Object | Book's spine label | Myth | What it explains in our story |
|---|---|---|---|
| Ídolo de Tara and a *pintadera* (Gran Canaria, pre-Hispanic) | a seal | The *harimaguadas* struck the sea to call the rain; family seals; the Fortunate Isles as Atlantis's remains | Striking water makes it answer; marks bind the sea |
| Small bronze bell (Douarnenez, Brittany) | a bell | Ys, drowned for its sins; its bells still ring under the bay | A bell that belongs to the sea |
| Net float and a gold ring (Norse) | a net | Rán drags the drowned down; sailors carried gold to pay her | The sea as creditor |
| Two carved jewels (Japan) | two jewels | The tide jewels *kanju* and *manju* | Whoever holds the right object commands the tide |
| Clay tablet (Mesopotamia) | a boat | Utnapishtim, warned in a dream, builds the boat | The flood comes for the unwarned |
| Fish figurine (India) | a fish | Matsya, the small fish that saves Manu | The warning |
| Bronze trident (Greece) | a trident | Deucalion and Pyrrha; every flood ends in a bargain | Bargaining with the sea |
| White roses and a toy boat (Bahia, Brazil) | a rose | Iemanjá; Inês's avó | The sea is thanked, not owned |

## The script

Tags in [brackets] are performance directions (not shown on screen). ★ marks Alan's double-meaning jokes; (no joke)
marks the beats where he means it (STORY.md, Alan's humour, rule 4). **About 70 lines.**

### Unlock (the shop, Ch. III, after the decode)

| Id | Speaker | Line |
|---|---|---|
| ines_bastos_1 | Inês | Bastos. Alan, the second name on your list. Henrique Bastos? He taught anthropology for thirty years. Sea myths, drowned cities, the occult. I quoted him in my thesis. Twice. |
| alan_bastos_1 | Alan | A professor of drowning. And they drowned him. At the top of a hill. |
| ines_bastos_2 | Inês | If anyone in Lisbon knew what that bell is, it was him. And I'm coming. A professor's library, and you expect me to mind the till? |
| alan_bastos_2 ★ | Alan | Pessoa can mind the till. He's been in training for it all his life. |
| ines_hint_bastos | Inês | (hint) Henrique Bastos, in Graça. Let's go and read his books before somebody else does. |

### Arrival

| Id | Speaker | Line |
|---|---|---|
| narr_bastos_arrive | Narrator | The top floor of a house at the top of a hill, in the highest parish in Lisbon. The professor had lived as far from the water as a man can get in this city. It had not been far enough. |
| alan_bastos_door ★ | Alan | Police tape and a Ferreira lock. One key-square for four old families. Grandfather, you'd hate how handy this is. |
| ines_bastos_smell | Inês | [softly] It smells of the sea in here. |
| narr_look_bastos_shelves | Narrator | Books on every wall, in eleven languages, and in front of them the things the books are about. Someone has been through them. Not to read. |
| alan_bastos_mess ★ | Alan | Somebody's tidied up the way I tidy up. Everything out, nothing back. |
| ines_bastos_labels | Inês | He kept every object with its book. Look at the spines: a fish, a bell, a net. He drew the labels himself. |
| alan_bastos_order ★ | Alan | So we put the sea back in order. Story of my afternoon. |

### Wrong pairs (in turn)

| Id | Speaker | Line |
|---|---|---|
| alan_match_wrong_1 | Alan | Wrong shelf. The labels don't match, and I own a bookshop. |
| alan_match_wrong_2 | Alan | That's not where it lives. He drew the labels himself; the least I can do is read them. |
| alan_match_wrong_3 ★ | Alan | No. The sea's in enough of a mess without me filing it under the wrong letter. |

### The eight myths (Inês reads; Alan answers)

**Gran Canaria (the Tara idol and the pintadera; the seal)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_canaria_1 | Inês | Gran Canaria, before the Spanish came. When the rain wouldn't come, the harimaguadas, the island's holy women, walked into the sea and struck the water with rods until it answered. |
| ines_myth_canaria_2 | Inês | And these clay seals, the pintaderas. Every family stamped its own mark. He's underlined it: "A mark is a name the sea can read." |
| ines_myth_canaria_3 | Inês | The old geographers called them the Fortunate Isles. What was left of Atlantis, they said. Fortunate, because the sea forgot them. |
| alan_myth_canaria ★ | Alan | Hitting the water until it listens. I've tried that with my plumbing. |

**Brittany (the bronze bell)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_ys | Inês | Ys, in Brittany. A city below the sea behind a gate. The king's daughter gave the key to a stranger, the sea came in, and on calm days the bells of Ys still ring under the bay. |
| alan_myth_ys | Alan | [quiet] Bells under the water, still ringing. I heard that earlier today, in a song, from a woman who meant it. |

**Norse (the net float and the gold ring)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_ran | Inês | Rán, the Norse sea goddess. She drags the drowned down in her net. Sailors carried a little gold, so they'd have something to pay her with. |
| ines_myth_ran_2 | Inês | He's written in the margin: "The sea does not kill. It collects." |
| alan_myth_ran ★ | Alan | A creditor with a net. I've had one of those since 1987. |

**Japan (the tide jewels)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_jewels | Inês | Japan. The tide jewels: one raises the sea, one lets it fall. The Dragon King lent them to a prince, and whoever held them held the tide. |
| alan_myth_jewels | Alan | Whoever holds the right thing, the water does what he says. [beat] I know a man in a cream suit who'd like that. |

**Mesopotamia (the clay tablet)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_gilgamesh | Inês | The oldest story anybody ever wrote down. Utnapishtim was warned in a dream: tear down your house, build a boat. He listened. Everyone who didn't, drowned. |
| alan_myth_gilgamesh ★ | Alan | Warned in a dream. I get warned by a dripping answering machine. Progress. |

**India (the fish)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_matsya | Inês | India. A little fish begged Manu to save it, and he did. It grew and grew, and when the flood came, it towed his boat to safety. |
| alan_myth_matsya ★ | Alan | Be kind to small fish. Noted. Pessoa will be appalled. |

**Greece (the trident)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_deucalion | Inês | Greece. Zeus drowned the world, and Deucalion and Pyrrha floated through it in a wooden chest. Afterwards they threw stones over their shoulders, and the stones became people. |
| ines_myth_deucalion_2 | Inês | His note: "Every flood ends in a bargain." |
| alan_myth_deucalion ★ | Alan | Throwing stones over your shoulder to make friends. Explains Lisbon's pavements. |

**Bahia (the white roses and the toy boat)**

| Id | Speaker | Line |
|---|---|---|
| ines_myth_iemanja | Inês | Iemanjá. Mother of the sea, in Bahia. On New Year's Eve they set white flowers and little boats on the waves for her, and if she takes them, the year will be kind. |
| ines_myth_iemanja_2 | Inês | [quietly] My avó used to take me. She said you don't bargain with Iemanjá. You say thank you, and you mind your manners. |
| alan_myth_iemanja (no joke) | Alan | [pause] Then we'll mind our manners. |

### The case

| Id | Speaker | Line |
|---|---|---|
| narr_bastos_case | Narrator | With the last of them back in its place, the room looked as if a man had only just stepped out of it. The glass case by the desk gave a small, polite click. |
| ines_bastos_card | Inês | His last index card. "Every people that lived by the sea kept a debt to it. The bells were how Europe paid the instalments." |
| alan_bastos_card ★ | Alan | Bells as repayments. Every Sunday morning, ding-dong, the cheque's in the post. |

### The lecture tapes (Bastos, on tape)

| Id | Speaker | Line |
|---|---|---|
| alan_tapes_play | Alan | "Lição um: o sino e o mar." Lesson one, the bell and the sea. Let's hear it from the man himself. |
| bastos_tape_1 | Bastos | [lecturing, warm, precise] Bells were baptised, ladies and gentlemen, like children. Holy water, a name, godparents. And then they were rung against the storm. A bell says no to the sea, on our behalf. |
| bastos_tape_2 | Bastos | But in 1754 a brotherhood of widows and shipowners had a bell baptised in the sea itself. Not to keep the sea out. To call to it. They wanted their drowned back. |
| bastos_tape_3 | Bastos | [beat] And the sea answered. It always answers. It came on the first of November, in three waves, up the river and into the Baixa. It did not bring their husbands home. It came to collect more. |
| bastos_tape_4 | Bastos | So a bell baptised in the sea is not a shield. It is a summons. The godparent speaks for it, and the water obeys the godparent's family. And whoever rings it again, hoping for the dead, will get the same answer. |
| bastos_tape_5 | Bastos | And how do you undo a baptism? You renounce. Whatever was promised in the bell's name, the bell itself must take back. [beat] That is all for today. Read chapter four. |
| ines_tape_wave | Inês | [quietly] They rang it to get their husbands back. And the sea came for the whole city instead. |
| alan_tapes_after | Alan | He makes it sound like a lecture. Which is worse, somehow. It means it's on the exam. |
| ines_tape_missing | Inês | The last reel's empty. Look at the label: "vinte e sete de Outubro". The day he died. |

### The recorder (the recording riddle)

| Id | Speaker | Line |
|---|---|---|
| narr_look_recorder | Narrator | A reel-to-reel recorder, lid up, nothing threaded. Beside it a rack of reels in his handwriting: five lessons, and one box with no tape in it. |
| alan_thread_wrong_1 | Alan | It wants a reel on the left before it'll do anything. Machines of that age have principles. |
| alan_thread_wrong_2 | Alan | Through the head, not round it. Even I know that much about recording. |
| alan_thread_wrong_3 | Alan | Play, with nothing threaded. Forty minutes of a motor humming. Very avant-garde. |
| alan_threaded ★ | Alan | Left to right, under the head, round the roller. My father taught me on a Grundig. He'd be appalled at how long that took. |

### The last reel

| Id | Speaker | Line |
|---|---|---|
| narr_look_empty_box | Narrator | The box is empty. Under the date, in pencil, a small drawing of a rose. |
| ines_hint_reel | Inês | There's a rose drawn on the empty box. He labelled his books the same way, Alan. |
| alan_tape_found (no joke) | Alan | [pause] In the little boat. He gave it to Iemanjá to keep. The collector was looking for a seal, not for manners. |
| bastos_last_1 | Bastos | [tired, calm] Twenty-seventh of October. Midday. This morning a collector came with a gift. A tile. A bell under three waves. Very old. Very fine. |
| bastos_last_2 | Bastos | I know what it is now, and I must not sleep. Forty years I have written about the sea, and it has come to correct my footnotes. |
| bastos_last_3 | Bastos | If anyone hears this: four families cast that bell. Ferreira, Bastos, Coutinho, Sanches. Ferreira went on Tuesday. Find the Sanches boy. Tell him the bell must say no. |
| bastos_last_4 | Bastos | [very tired, quiet] I have hidden this where he will not look. And now I am going to lie down. Only for a minute. |
| narr_tape_end | Narrator | The tape ran on for a minute more, recording an empty room. |
| alan_after_tape (no joke) | Alan | [long pause] He knew my name. A stranger at the top of a hill, and his last words were for me. |
| ines_after_tape | Inês | [softly] Then let's not waste them. |

### Other looks

| Id | Speaker | Line |
|---|---|---|
| narr_look_bastos_map | Narrator | A map of the world with pins in every coast. Blue for floods, red for drowned cities, and one black pin in Lisbon, pushed in so hard it has split the paper. |
| alan_look_bastos_map ★ | Alan | Every coast on Earth, and they all owe the sea money. Lisbon's the one he underlined. |
| narr_look_bastos_window | Narrator | Below, the whole city under the fog, and at the bottom of it the river, breathing. |
| narr_look_bastos_case | Narrator | A glass case with a lock that is all show: it opens when the room is in order. A professor's joke. |
| ines_bastos_case_locked | Inês | It's not locked, it's waiting. He said that about the sea once, in a lecture. |

### Inês's hints in the flat

| Id | Speaker | Line |
|---|---|---|
| ines_hint_shelves | Inês | Every object with its book, Alan. Match the drawings on the spines. |
| ines_hint_thread | Inês | Reel on the left, tape through the head, then Play. My tio had one of these for his sambas. |
| ines_hint_play | Inês | Play it, Alan. He's waited long enough to be heard. |

### Leaving

| Id | Speaker | Line |
|---|---|---|
| ines_bastos_leave | Inês | I'm taking his Iemanjá book. Somebody should keep reading it. |
| alan_bastos_leave | Alan | Take the lot. He'd rather they were read than collected. |

## The notebook: "The Sea" page

- Every people that lived by the sea kept a debt to it (Bastos).
- The Brotherhood baptised the bell in the sea to call back their drowned. The sea answered by coming itself: the three
  waves of 1 November 1755. Not the dead. It came to collect more.
- A bell baptised in the sea is a summons, not a shield. The godparent's family commands the water; whoever rings it
  again, hoping for the dead, gets the same answer.
- A baptism is undone by renouncing.
- A "collector" gave him a tile the morning he died. He hid his last tape from him in Iemanjá's boat.

## What it takes

- **Art (your approval):** the room (Canva, then a depth map and the walkable floor); eight small object images for
  the matching; the recorder close-up (Canva); the book pages are HTML (no art). Review page first.
- **Voice (your pick):** Bastos, for the tapes: two or three ElevenLabs candidates, an old Portuguese academic, warm and
  precise.
- **Lines:** about 70 (Alan, Inês, the narrator, Bastos), one take each, levelled and lip-synced like the rest.
- **Code:** the room, the matching close-up, the tapes, the map pin, flags, Inês's hints, the notebook page, the chapter
  end, save compatibility; STORY.md, play.mjs and the handoff.
