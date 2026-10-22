# Story review, 2026-10-22: lines that no longer fit their context

The user asked for this: "run through the whole story and conversations to look for inconsistencies and lines that could make
more sense if context was added … Ines at some point says 'Alan, you're not lazy...' … Please check all the conversations
for similar situations."

**Method.** Four readers each took one part of the game: Chapter I with Inês and the shop, Chapter II with the visits and
Bastos, Chapter III with the Sé, and Chapters IV–V. Each one traced every `say`/`dialog`/`joke` chain in `js/story/*.js`
against the texts in `js/lines.js`, the flags and gates, and `docs/STORY.md`. I removed duplicate findings and checked the
example myself. **Nothing has been changed yet.**

**Tags used below:**
- **[rec]** the line needs re-recording (new text).
- **[code]** only the code changes (a gate, the order, which line plays). Nothing is recorded.
- **[new]** a new line to record.

Every finding has a number. You can answer with "all", "all except I.2, III.16", or just comment on individual items.

---

## Chapter I, Inês and the shop

**I.0 — `ines_coward`** (ch1.js:326). This is your example. Inês says "You're not lazy, Alan. You're the hardest-working coward I know." It follows Alan's "[far too innocent] … What has my face got to do with a museum? Is he... short-sighted?" Nobody has called him lazy, so the line answers something that was cut from the scene.
→ "[dry, fond] Nice try. You're the hardest-working coward I know." Alan's reply stays the same: "Thank you. I've put years into it." **[rec]**

**I.1 — "ring it back" vs "ring it backward".**
- The recorded song's captions and Duarte's lyric sheet both say "ring it **backward**".
- Three lines say "ring it back":
  - `alan_song_back` "'Ring it back.' Everyone in this city wants me to return a call."
  - `amalia_night_sing` "…ring it back, my boy, and bring it home."
  - `alan_look_ledger_decoded` "Not ring it back. Backward."
- "Bring it home" also reads as summoning the sea, which is what Bastos warns against.

→ Keep "backward", since it is the solution to the puzzle:
- `alan_song_back`: "'Ring it backward.' [beat] I didn't know bells had a reverse gear."
- `alan_look_ledger_decoded`: "'Ring it backward. Last to first.' [pause] So she meant it literally. [beat] Grandfather, you could have just left me a letter."
- `amalia_night_sing`: "…ring it backward, my boy, and send it home."

**[rec ×3]**

**I.2 — after the song** (ch1.js:774). `amalia_face` "He chose the sensible thing, menino. You have his face when you lie." answers a lie that Alan never told. It also pushes `alan_ringer` ("A ringer. I've been called many things…") two lines away from the "bell-hands" line it answers.
→ New order: `amalia_after_song`, `alan_ringer`, `amalia_called`, then `amalia_face` rewritten as "[softly] He married the sensible woman, menino, and ran from the rest. You have his face." **[code + rec]**

**I.3 — `alan_take_glass`** "…because I haven't stolen anything yet today." The tavern only opens after the heist.
→ "For luck. And because it's been at least an hour since I stole anything." **[rec]**

**I.4 — `alan_tell_ferreira`** (Rui, Chapter II) "…a tide clock, still keeping the river's time." The option is offered as soon as the lamp is lit, but at that point the tide clock is dead until Alan winds it.
→ Offer the option only once the clock is wound (`tide_wound`). New text: "…All but a tide clock, and that only because I wound it. It keeps the river's time." **[code + rec]**

**I.5 — `alan_what_now` "What now?"** gets the reply `rui_mother_2` "She says the river is breathing. And that you don't eat enough." That doesn't answer the question.
→ Change the option to "And your mother?". Rui's reply becomes "[sighing, fond] She says the river's breathing harder. And that you don't eat enough." **[rec ×2]**

**I.6 — `rui_drawer_2` "Not today, Alan."** turns down a request that Alan never made.
→ "[as Alan glances at it] And no, you can't look. Not today, Alan." **[rec]**

**I.7 — Teixeira.**
- `teixeira_fine` "Do your sketch" can play before anyone has mentioned a sketch.
- After Teixeira's "No drawing the evidence either", taking the bag still plays "Nobody said anything about drawing it, though."

→ `teixeira_fine`: "F-fine. Whatever you came to do, do it. Just… let me f-finish with my mother first." Play `alan_bag_draw` only if Teixeira hasn't already said no. **[rec + code]**

**I.8 — `alan_phone_ch1`** "I could ring Rui back…" can play before Alan has heard Rui's message.
→ Before the machine has been played: [new] "Nobody to ring. The machine's blinking, though." **[new + code]**

**I.9 — two of Inês's scores mention the cat:** "The cat laughed." and "The cat left the room." They can play in the Sé, at Bastos's flat or in the cistern, where there is no cat.
→ Keep both for the shop only. **[code]**

**I.10 — `ines_hint_convent`** "The song said a church that prays without a roof. That's the Carmo." The song names the Carmo itself.
→ "The song told you where: the Carmo, where the stone weeps salt. Go and see what it's crying about." **[rec]**

**I.11 — the genealogy page** (signed J.S., 1994) crosses out Ferreira and Bastos. Joaquim died before both of them, so he couldn't have known.
→ Remove the crossings-out. **[code]**

**I.12 — the notebook** has "They die when the river turns" in two entries in a row.
→ Celeste's entry becomes "Celeste: the river breathes. The tiles are bits of the sea. Bronze breaks them." **[code]**

**I.13 — "Case fifty-five, one-fourteen"** is said twice in a row (the look at the file, then the reading).
→ `alan_read_file` starts at "'J. Sanches, bookseller, forty-three…'" (trim the audio). **[rec or trim]**

**I.14 — `rui_hands_off`** "Talk to me first." still plays after Alan has talked to Rui.
→ For that case: [new] "Not while I'm standing here, Alan. Look, don't touch." **[new + code]**

**I.15 — the answering machine "has one message"**, but there are two (and a third later).
→ "Its messages have been heard, and the red light has finally stopped nagging." In Chapter V, before message 3, show the blinking look instead. **[rec + code]**

**I.16 — `alan_box_tell`** "…It was in his flat." "His" reads as Lacerda's.
→ "…It was in Grandfather's flat when he died." **[rec]**

**I.17 — hints that use "it" with nothing for it to refer to.**
- `ines_hint_guard` → "…guarding the tile?"
- `ines_hint_paper_2` → "Tell Rui about that tide clock. He sent you the key; he'll want to know what you found."

**[rec ×2]**

**I.18 — the opening tells Alan to play his messages twice.**
→ `ines_intro_4`: "And the rent is due on Friday. So try selling a book. Any book." **[rec]**

**I.19 — room looks that don't follow the room's state** (low priority).
- The street lamp is "burning at noon" even at night. → [new] "…burning, for once, at the proper hour."
- The cabinet drawer "stands an inch open" even after it has been opened. → [new] variant line.

**[new ×2]**

## Chapter II, the visits and Bastos

**II.1 — `celeste_suit`** "A gentleman came asking after **Maria**…" The notebook and STORY say he was asking about her **son**, which is the point, because Lacerda is hunting Zé.
→ "…came asking after her boy, the week before she died. Cream linen suit, in this weather. Lovely manners. He said he could wait." **[rec]**

**II.2 — `alan_tape_found`** "The collector was looking for a seal…" plays before the tape that introduces "the collector".
→ "[pause] In the little boat. He gave it to Iemanjá to keep. Whoever turned this room over wasn't looking for manners." **[rec]**

**II.3 — Celeste, about Rui:** "There's the cat. I feed him. It's complicated. **Tell me about the river.**" Nobody answers, and the menu just comes back.
→ Cut the last sentence (trim). **[trim]**

**II.4 — Celeste's greeting** "Joaquim's boy. I'd know that chin in a fog…" repeats on every visit.
→ First visit only. After that she goes straight to her gossip. **[code]**

**II.5 — `ines_pull`** "a church that prays without a roof can only be the Carmo". The Carmo has already been named three times.
→ "So. Your grandfather came up out of the Carmo cistern in fifty-five, and Amália's song sends us to the same place: the church that prays without a roof." **[rec]**

**II.6 — Ferreira's shop, lamp lit:** "Every clock stopped at the same minute…" is followed straight away by "They stopped. Together. Twelve minutes past three."
→ Play `alan_clocks` first, then shorten `alan_enter_ferreira` to "The only man in Lisbon who died on time." **[code + trim]**

**II.7 — the tide table is introduced twice**, once on each side of the close-up.
→ Drop `alan_tide_card` before the close-up. **[code]**

**II.8 — Teixeira** "My shift starts at six!" He is on duty right now.
→ "[panicking] I'm on duty! They'll send a car!" **[rec]**

**II.9 — `alan_repair_hint`** "…the desk key should fit anything he made for us." It is then used on Ferreira's own clock.
→ "…So Grandfather's desk key should fit anything he made for the four families. His own clock included." **[rec]**

**II.10 — `ines_bastos_1`** "Bastos. Alan, the second name on your list." Alan has just said this himself.
→ "Professor H. Bastos? Henrique Bastos? Alan, I never put the two together. He taught anthropology for thirty years…" (the rest unchanged). **[rec]**

**II.11 — "Ferreira cut keys" is said three times:** `alan_spare`, `alan_spare_bastos`, then `alan_bastos_door`.
→ Cut "Ferreira cut his keys too." from `alan_spare_bastos`, and the second sentence from `alan_bastos_door`. **[trim ×2]**

**II.12 — the key board look** doesn't mention Bastos's tag, even though Inês's hint sends you there.
→ When Bastos's key is still on the board, add [new] "Another: 'Prof. H. Bastos, Graça'." **[new + code]**

**II.13 — `ines_tape_missing`** "The last **reel's** empty." It's the **box** that is empty; the reel is hidden in the boat.
→ "The last box is empty. Look at the label: 'vinte e sete de Outubro'. The day he died." **[rec]**

**II.14 — `alan_teixeira_sorry`** "I'm a lot after lunch, **too**." The "too" has nothing to refer to.
→ "Sorry, Teixeira. I'm a lot before lunch. After lunch, I'm worse. Mind the third step." **[rec]**

**II.15 — Iemanjá, a fact:** "On New Year's Eve…" is Rio's custom. In Bahia, Inês's home, the festival is on 2 February.
→ "…On the second of February they set white flowers and little boats on the waves for her…" **[rec]**

**II.16 (your call) — `ines_sea_3`** "The Brotherhood with their bell". Only the tapes, which come next, say what the bell is for.
→ "…The holy women on Gran Canaria. The bells of Ys." **[rec]**

## Chapter III, the Sé, Tomás, Abílio and Lacerda

**III.1 — `alan_vasco_sorry_2`** "**The other day**, in the pit." The heist was this morning.
→ "This morning, in the pit." (rest unchanged) **[rec]**

**III.2 — Tomás and the godparent.** Rule III of the charter Tomás is holding already says "The House of Lacerda stood as its godparents". Yet:
- Alan asks who stood godparent;
- Tomás says "I was never told which";
- his "Where did you get this?" follows a question that never shows him anything;
- "your Brotherhood" gives away his Chapter V secret.

→ The fix:
- Alan: "Professor Bastos said the Brotherhood baptised the bell in the sea. On tape. And this says who stood godparent."
- Tomás ends: "…That's why the water still answers to that family. [beat] I had prayed the line had died out."

**[rec ×2]**

**III.3 — the decode scene order.** Tomás's "Ring it backward and the bell renounces the sea" comes two lines after the rite. It also splits Joaquim's "I ran" from Alan's "He ran", and Bastos already said it on tape.
→ Move it to straight after the rite: "Your professor had it right. At a baptism you renounce. Ring it backward and the bell renounces the sea." **[code + rec]**

**III.4 — `alan_decode_1`** "'The Brotherhood rang the drowned bell.' That's the headline." Bastos has already told him this.
→ "'The Brotherhood rang the drowned bell.' [beat] Bastos had that much. Let's see what he didn't." **[rec]**

**III.5 — `ines_hint_order`** "Tomás said the Sé. Go and talk to a deaf man about bells…" can only fire after Alan has already met Abílio.
→ "You've met Abílio. Read the four bells with the glass, and ask him about the founders' blood. Tell him whose grandson you are first." **[rec]**

**III.6 — Abílio names Joaquim to a stranger.** The tongue and 1955 questions can come before Alan has said who he is.
→ Gate them the way "blood" already is. **[code]**

**III.7 — museum exhibits when Inês is not there:** "A year and a half? I get homesick in Belém." and the Benfica joke answer lines she didn't say.
→ Solo versions:
- [new] "Gold of the fleets. Inês says her country paid for half of Lisbon. A year and a half each way? I get homesick in Belém."
- [new] "Alminhas. Souls with no grave. Inês says saudade starts here. I always blamed the Benfica defence."

**[new ×2 + code]**

**III.8 — `vasco_fragment`** "It came up this morning." Alan was in that pit this morning.
→ "Your family's. It came up after you'd gone. I thought you should have it." **[rec]**

**III.9 — Abílio** "THE CURATOR WAS ASKING ABOUT **IT** THIS MORNING." The "it" refers to nothing.
→ "THE CURATOR WAS ASKING ABOUT YOU THIS MORNING. A TALL BOOKSELLER, HE SAID. HE THINKS I CAN'T HEAR." **[rec]**

**III.10 — `alan_thu_truth`** confesses the key and the papers again, but Alan already did that at the twin.
→ "You said bring the truth. So, the rest of it. The bell, the man in the Chiado… I'm not sorry I did it. I'm sorry I made you wait for it." **[rec]**

**III.11 — Lacerda's clocks** are shown and described a second time if Alan has already looked at them.
→ Only the first time. **[code]**

**III.12 — `ines_hint_see_case`** "Lacerda's glass case…" fires before anyone knows there is a case.
→ Before the shop: [new] "Antiguidades Lacerda, in the Chiado. Go and see what a man like that keeps behind glass." **[new + code]**

**III.13 — "Tomás knows more about bells"** (`alan_stone_wait`, `ines_hint_bells2`). After Bastos, the open question is who stood godparent.
→ The lines:
- `alan_stone_wait`: "Not yet. Bastos told me what the bell is. Tomás hasn't told me who it answers to, and he knows."
- `ines_hint_bells2`: "Ask Tomás who stood godparent, Alan. He's dying to tell you, in his way."

**[rec ×2]**

**III.14 — Abílio's "Read them yourself"** is still offered after all four bells have been read.
→ Hide it then. **[code]**

**III.15 — Vasco's idle lines in Chapter III.** He is out of the pit but still says "Found a sherd." He also says "Did you know bells were baptised? Of course you didn't."
→ Drop the digging lines in Chapter III. Rewrite #15: "Bells were baptised, you know. Nobody ever lets me finish that sentence." **[code + rec]**

**III.16 — `ines_steam`** "…like a man who's seen a clock." The J.C. clock is optional.
→ "…like a man who's seen a murderer's shop." **[rec]**

**III.17 — `tomas_novena`** repeats Bastos's tape ("They rang it to call their dead home").
→ "Nine days of fog is a novena. In 1755 it ended on All Saints' Day, the eve of the Day of the Dead. The tenth day is when it's answered." **[rec]**

## Chapters IV–V

**V.1 — the knot.** Celeste's hint ("Tail back through the loop!") gives the old instruction, which contradicts her current one.
→ "The line, menino! Break its back. Bend it the wrong way and it gives!" **[rec]**

**V.2 — `celeste_hint_wake`** "I told you…" can play when she hasn't told him anything.
→ "Shouting won't do it, menino. Move the boat wrong and he'll come up like a cork." **[rec]**

**V.3 — Chapter V shop door:** "Rui first. If I'm going down a hole at midnight…" can play before the message that names the Carmo.
→ Before message 3, use the "machine first" line instead. **[code]**

**V.4 — `alan_ask_midnight`** "You said to ask." Tomás's "Ask me at midnight" is optional.
→ "It's midnight, Father. Whatever you've been keeping for forty years, I think it's time." **[rec]**

**V.5 — the machine in Chapter V** "has finally stopped nagging" while it is blinking.
→ Use the blinking look until message 3 has been heard. **[code]** (Shares a line with I.15.)

**V.6 — the end of Chapter IV says the same things three times.**
- The note "crossed the river" to the Chiado, but the Chiado is uphill on the same bank.
- `narr_tr4_2` repeats it straight away.
- "She rang twice" is said three times.

→ The fixes:
- `narr_ch4_end`: "The note from the tongue rolled up off the river and climbed to the Chiado…"
- `narr_tr4_2`: "Up in the Chiado, a man who had waited forty years decided he had waited long enough."
- `alan_kettle_rang`: "[quietly] She was frightened, and I was below decks."

**[rec ×3]**

**V.7 — `narr_turn`** "…for the first time in nine days, nobody drowned." This implies someone drowned at every turning.
→ "At twenty-five past six the river turned, and for the first time, a tile lay on a bed and nobody drowned." **[rec]**

**V.8 — `narr_bell_lit`** "four centuries of patience". The bell was cast in 1754.
→ "…two hundred and forty years of patience." **[rec]**

**V.9 — `amalia_alone`** "Joaquim ran because he was alone down there." Tomás and Celeste both say he had the boy with him.
→ "Joaquim had nobody beside him down there but a frightened child. You are not alone, menino…" **[rec]**

**V.10 — Chapter IV clock.** It is 17:20 in Inês's line, then the scene sets the clock to 17:15.
→ Set it to 17:20. **[code]**

**V.11 — the quay.**
- Rosa says "Browsing **again**?" and the mender says "**Still** in my light". Both assume earlier chats that may not have happened.

→ The fixes:
- Rosa, when you haven't chatted: [new] "You, menino! You were on that boat half an hour! The whole quay heard the hull knocking!"
- The mender: "In my light, bookseller. But sit down. You've earned it."

**[new + rec + code]**

**V.12 — "what the bell remembers"** is quoted twice, but Celeste's original line is optional.
→ The fixes:
- `celeste_hint_tile`: "Nothing breaks that clay but what the bell remembers, menino. You're carrying it."
- `alan_fragment_tile`: "…Bronze from the bell itself, not just any bronze."

**[rec ×2]**

**V.13 — the cabin.** Zé's "Just do it." answers a question that hasn't been asked.
→ [new] "There. On the bunk. Whatever you came to do, bookseller, do it." **[new + code]**

**V.14 — after the romance**, giving Zé an item still gets "He wants me off his boat."
→ Use a generic fail line once he's saved. **[code]**

**V.15 — the lit bell** still says "With his own blood on the bronze…" after Alan has cut his palm.
→ After the cut, play the last-to-first nudge instead. **[code]**

**V.16 — the machine in Chapter V, before the cat is fed,** gives the lamp-trick line.
→ Use the "He's dug in" line. **[code]**

**V.17 — Celeste** "Which boat did you say?" She hasn't named a boat.
→ "It's tidal. Purely tidal. Which one's his boat?" **[rec]**

**V.18 — dawn is said twice within a minute**, and the "breath" image is used twice.
→ `narr_tr5_3`: "At dawn, a bookseller and a historian climbed out of a hole in a church, and the sun was waiting." **[rec]**

**V.19 — the final talk with Lacerda** replays "You killed him." every time.
→ First time only. **[code]**

**V.20 — `alan_jc_unknown`** repeats what Alan has just read aloud.
→ "Zé. And the next turning is twenty-five past six." **[rec]**

**V.21 — `alan_descend`** "'Stay away from water,' **he** said." The "he" has nothing before it.
→ "'Stay away from water,' Rui said. Midnight, a flooded church basement, a dead man's bell. He'll be livid." **[rec]**

**V.22 — small wording fixes.**
- `ines_kettle` "I'll **keep** ringing Rui" → "I'll ring Rui till he answers, and I'll keep the kettle on."
- `ines_hint_blood` "You read it to me" (he didn't) → "'His own blood on the bronze,' Alan. It's in Joaquim's hand."

**[rec ×2]**

**V.23 — the paper cut.** It can draw a joke score from Inês while she is still terrified.
→ Make it a plain line, not a joke. **[code]**

**V.24 (your call) — the bell's waves.** `narr_look_bell` says "four great waves", but the seal and Bastos say three. I'll check the painting; if it shows three, the line becomes "three great waves". **[rec?]**

**V.25 (optional, nice to have) — Bastos callbacks in the finale.**
- `alan_father`: "[pause] Mine's gone too, Vicente. Bastos said it: ring it for the dead and the sea comes to collect more. I'm not ringing it your way."
- `alan_strike_1`: "[under his breath] Last to first, Grandfather. Say no."

**[rec ×2]**

---

## Totals

- About 62 lines to re-record or trim.
- About 12 new lines.
- About 20 code-only fixes.

Every changed line is re-transcribed and lip-synced, and its STORY.md quote is updated. Then validate, smoke and a full play.mjs run, and one handoff entry.
