# Story review, 2026-10-22: lines that no longer fit their context

**What the user asked.** "Run through the whole story and conversations to look for inconsistencies and lines that could
make more sense if context was added … Ines at some point says 'Alan, you're not lazy...' … Please check all the conversations
for similar situations." Then: "Give me the rationale for each of the proposed changes."

**How it was done.** Four readers each took one part of the game:
- Chapter I, with Inês and the shop
- Chapter II, with the visits and Bastos
- Chapter III, with the Sé
- Chapters IV–V

Each one traced every `say`/`dialog`/`joke` chain in `js/story/*.js` against three things: the texts in `js/lines.js`, the flags
and gates that decide what can play when, and `docs/STORY.md`. Duplicates were merged. **Nothing has been changed yet.**

**How to read each finding:**
- **Problem** says what the player hears now.
- **Fix** gives the proposed line or change.
- **Why** gives the reasoning: what goes wrong for the player, why this fix and not another, and what it costs.

**What the tags mean:**
- **[rec]**: the line is re-recorded with new text.
- **[trim]**: the existing take is cut, with no new recording.
- **[code]**: only the code changes (a gate, the order, which line plays). Nothing is recorded.
- **[new]**: a line that doesn't exist yet is recorded.

**Three ideas behind most of the fixes:**
1. **A line can only answer what the player has actually heard.** Many lines were written for an older version of a scene, or
   for one route through it. When the scene changed, or the player took a different route, the line was left answering nothing.
   Your `ines_coward` example is this case.
2. **The fix should be the cheapest one that holds on every route.** If one gate makes the line true on every route, I change
   the gate rather than re-record. If the line can be reached many ways, I rewrite it so it stands on its own.
3. **Don't repeat a fact the player heard a few seconds ago.** In a comedy, the second telling kills the first one's joke. In a
   mystery, it tells the player "this is new", and it isn't.

You can answer with "all", "all except I.2, III.16", or comments on individual numbers.

---

## Chapter I, Inês and the shop

### I.0 — `ines_coward` (ch1.js:326) [rec]
**Problem:**
- Alan says "[far too innocent] …What has my face got to do with a museum? Is he... short-sighted?"
- Inês answers: "You're not lazy, Alan. You're the hardest-working coward I know."
- Nobody has called him lazy.

**Fix:** "[dry, fond] Nice try. You're the hardest-working coward I know." Alan's reply stays the same.

**Why:**
- The scene used to have Alan claiming he was too lazy to help. That line was rewritten into the innocent dodge, and Inês's reply
  was never updated.
- "Nice try" answers what he actually does now: play dumb so he won't be drawn in.
- It keeps the joke's real payload, "hardest-working coward". It also keeps Alan's reply, "Thank you. I've put years into it.",
  so only one take changes.

### I.1 — "ring it back" vs "ring it backward" [rec ×3]
**Problem:**
- The recorded song's captions and Duarte's lyric sheet say "ring it **backward**".
- Three spoken lines say "ring it back":
  - `alan_song_back` "'Ring it back.' Everyone in this city wants me to return a call."
  - `amalia_night_sing` "…ring it back, my boy, and bring it home."
  - `alan_look_ledger_decoded` "Not ring it back. Backward."

**Fix:**
- `alan_song_back` → "'Ring it backward.' [beat] I didn't know bells had a reverse gear."
- `alan_look_ledger_decoded` → "'Ring it backward. Last to first.' [pause] So she meant it literally. [beat] Grandfather, you could
  have just left me a letter."
- `amalia_night_sing` → "…ring it backward, my boy, and send it home."

**Why:**
- "Backward" is the solution to the final puzzle: the bells struck last to first. The song is the player's first clue to it, so
  it must say the same thing every time.
- The other option was to change the captions to "back". I didn't choose it, because then the clue no longer points at the
  solution. It would also need the Portuguese gloss redone.
- The ledger line currently corrects a mishearing ("Not back. Backward.") that, with the captions as they are, the player never
  heard. The new text keeps the moment of realisation without that.
- "Bring it home": since Bastos, "bringing" something by ringing the bell means summoning the sea, the very thing they must not
  do. "Send it home" says the opposite, and it is what the renunciation does.
- The "reverse gear" quip keeps the slot a joke, because the old "return a call" joke only worked with "back".

### I.2 — after the song (ch1.js:774) [code + rec]
**Problem:**
- Amália says "You're the last Sineiro, Alan. The last of the bell-hands."
- Then: "He chose the sensible thing, menino. You have his face **when you lie**."
- Then a silent beat. Only then does Alan answer "bell-hands" with "A ringer. I've been called many things…"

**Fix:** reorder to `amalia_after_song`, `alan_ringer`, `amalia_called`, then `amalia_face` rewritten as "[softly] He married the
sensible woman, menino, and ran from the rest. You have his face."

**Why:**
- Alan hasn't lied. His last line was a quip, so "when you lie" accuses him of nothing the player saw.
- "The sensible thing" only makes sense if the player picked the optional question about Joaquim.
- The rewrite says plainly what Joaquim chose. That is the backstory STORY.md gives: he married into safety and fled the bell.
  It works whether or not that topic was asked.
- Alan's "A ringer" is a reply to "bell-hands". Put two lines and a pause apart, it lands as non-sequitur; moved back next to it,
  the joke works again. STORY.md I.7 has them in this order.

### I.3 — `alan_take_glass` [rec]
**Problem:** "For luck. And because I haven't stolen anything yet today." The tavern only opens after the Sé heist: Alan has
already lifted Vasco's key, and Inês has taken the papers.

**Fix:** "For luck. And because it's been at least an hour since I stole anything."

**Why:**
- The joke is that Alan is a petty thief by habit. The new line keeps that and makes it true.
- It is also funnier, because the player knows exactly what he stole an hour ago.

### I.4 — `alan_tell_ferreira` (Rui, Chapter II) [code + rec]
**Problem:**
- Alan tells Rui "…a tide clock, still keeping the river's time."
- The option is offered as soon as the lamp in Ferreira's shop is lit. At that point the tide clock is "quite dead. Its winding
  key is missing" until Alan winds it.

**Fix:**
- Offer the option only after `tide_wound`.
- Text: "…All but a tide clock, and that only because I wound it. It keeps the river's time."

**Why:**
- Without the gate, Alan reports something false.
- "Still keeping" also implies the clock survived on its own, which is wrong. Ferreira's clocks stopped with him; Alan restarted
  the tide clock with Joaquim's key.
- The gate matches Inês's hint, which only points to Rui once the clock is known.
- The Chapter II reader found the same thing independently.

### I.5 — "What now?" → `rui_mother_2` [rec ×2]
**Problem:** Alan asks "What now?" and Rui says "She says the river is breathing. And that you don't eat enough." That answers
nothing about what to do. It also repeats "My mother says the river is breathing", the line that unlocks the option.

**Fix:**
- The option becomes "And your mother?"
- Rui: "[sighing, fond] She says the river's breathing harder. And that you don't eat enough."

**Why:**
- Rui's reply is about his mother, so the question should be too. That costs one short Alan take.
- "Harder" makes the repeat a development: the fog is getting worse.
- It keeps the warm "you don't eat enough" joke.

### I.6 — `rui_drawer_2` "Not today, Alan." [rec]
**Problem:**
- Alan asks "Ever seen anything like this before?"
- Rui describes a drawer that won't shut.
- Then Rui says "Not today, Alan.", refusing a request Alan never made.

**Fix:** "[as Alan glances at it] And no, you can't look. Not today, Alan."

**Why:**
- The refusal needs something to refuse. Here Rui reads Alan's glance, which is in character: Rui has known Alan's nosiness for
  years.
- The other option, a new Alan line "Can I see it?", would cost a take and slow the exchange down.

### I.7 — Teixeira and the sketch [rec + code]
**Problem:**
- Charming Teixeira can happen before Alan tries to draw anything. Inês's hint even tells the player to charm him first. Yet he
  says "F-fine. Do your sketch."
- In the other order, Teixeira says "No drawing the evidence either", and picking up the bag still plays Alan's "Nobody said
  anything about drawing it, though."

**Fix:**
- `teixeira_fine` → "F-fine. Whatever you came to do, do it. Just… let me f-finish with my mother first."
- Play `alan_bag_draw` only if Teixeira hasn't already forbidden drawing.

**Why:**
- The new Teixeira line works in both orders, and his flustered phone call with his mother stays.
- Alan's bag line is a joke about a loophole, so it is false once the loophole has been closed. The gate removes it only on
  that route.

### I.8 — `alan_phone_ch1` [new + code]
**Problem:** Before the answering machine has been played, the shop phone gives "I could ring Rui back. But then he'd know I
listen to my messages." Alan doesn't know Rui has called.

**Fix:** before the machine: [new] "Nobody to ring. The machine's blinking, though."

**Why:**
- The player who clicks the phone first gets a line that makes sense.
- It also nudges them to the machine, which is the next step anyway.
- The existing line is kept for after the message, where it is a good joke.

### I.9 — cat scores away from the shop [code]
**Problem:** Two of Inês's scores, "The cat laughed." and "The cat left the room.", can play in the Sé, in Bastos's flat or in
the cistern. Pessoa, the cat, is only in the shop.

**Fix:** add both to `SHOP_SCORES`, the list that already holds the other shop-only lines.

**Why:**
- A joke about an absent cat sounds like a bug.
- The system for this already exists, so this is a one-line change with no recording.
- There are still 38 lines left to choose from elsewhere.

### I.10 — `ines_hint_convent` [rec]
**Problem:** "The song said a church that prays without a roof. That's the Carmo." The recorded song already names the Carmo,
so Inês is solving a riddle that the song solved itself.

**Fix:** "The song told you where: the Carmo, where the stone weeps salt. Go and see what it's crying about."

**Why:**
- A hint should point at what is left to do, not re-solve what is already known.
- "Where the stone weeps salt" comes from the song and names what to look at when you get there, so the hint moves the player
  on.

### I.11 — the genealogy page (docs.js) [code]
**Problem:** The page is signed "J.S., 1994", but it crosses out Ferreira and Bastos. They died on the 24th and 27th, both after
Joaquim died, about the 21st. Meanwhile Maria Coutinho, also dead, isn't crossed out.

**Fix:** remove the crossings-out.

**Why:**
- A dead man can't record later deaths. A careful player will notice, since the dates are in the same notebook.
- The other option was to strike all three as "Inês's pencil". That adds a story beat nobody wrote. Removing the strikes is
  free and correct.

### I.12 — the notebook repeats itself [code]
**Problem:** Two entries in a row both say "They die when the river turns."

**Fix:** Celeste's entry becomes "Celeste: the river breathes. The tiles are bits of the sea. Bronze breaks them."

**Why:**
- The notebook is the player's summary. A duplicated sentence wastes it, and looks like a mistake.
- "The river breathes" is Celeste's own phrase, and it is what she adds to the earlier entry.

### I.13 — "Case fifty-five, one-fourteen" twice [trim]
**Problem:** The look at the file ends with "A photocopy of case fifty-five, one-fourteen…". Then the reading starts with "Case
fifty-five, one-fourteen…" a second later.

**Fix:** cut the case number from the start of `alan_read_file`.

**Why:**
- The second reading adds nothing.
- Trimming the existing take costs no recording and loses no information.

### I.14 — `rui_hands_off` [new + code]
**Problem:** Rui says "Hands off my evidence, Alan. **Talk to me first.**" even after Alan has already talked to him about the
drownings.

**Fix:** after the talk: [new] "Not while I'm standing here, Alan. Look, don't touch."

**Why:**
- "Talk to me first" is an instruction the player has already followed, so it reads as Rui not listening.
- The new line keeps the "no" and gives the reason that applies now: he is standing right there. It also hints that the way in is
  to get him to leave, which is the actual puzzle.

### I.15 — the machine "has one message" [rec + code]
**Problem:** "Its one message has been heard…" The machine plays two: Rui, then the dripping water.

**Fix:**
- "Its messages have been heard, and the red light has finally stopped nagging."
- In Chapter V, before message 3, show the blinking description instead (see V.5).

**Why:**
- It is a plain factual slip about something the player has just listened to.
- The Chapter V change is the same line's other problem: there, the light is blinking again.

### I.16 — `alan_box_tell` [rec]
**Problem:** "And Rui, he has Amália's music box… It was in **his** flat." The last man named is Lacerda, so "his" reads as
Lacerda's flat. Alan actually saw the box in Lacerda's shop, and it was taken from Joaquim's flat.

**Fix:** "…It was in Grandfather's flat when he died."

**Why:**
- This is the evidence that ties Lacerda to Joaquim's death. A pronoun that points to the wrong man muddles the accusation at the
  moment it should be clearest.
- The Chapter V reader flagged the same line.

### I.17 — hints with "it" pointing at nothing [rec ×2]
**Problem:** A hint plays on its own, out of the blue, so there is nothing for "it" to refer to.
- "Rui left a nervous boy in uniform guarding **it**?"
- "Take **it** to Rui. He gave you the key…" Also, Teixeira brought the key, not Rui.

**Fix:**
- "…guarding the tile?"
- "Tell Rui about that tide clock. He sent you the key; he'll want to know what you found."

**Why:**
- A hint is read by a stuck player, so it has to name its object. These two currently don't say what to act on.
- "Sent" is true: Rui did send Teixeira with the key.

### I.18 — the opening sends Alan to the machine twice [rec]
**Problem:** In the first minute, Inês says "listen to it", Alan says "That's the machine", and then Inês's next line says "So
play your messages…"

**Fix:** "And the rent is due on Friday. So try selling a book. Any book."

**Why:**
- The opening is the player's first impression. Two identical nudges in a row make Inês sound like a tutorial.
- The new line keeps her teasing and adds a piece of character, the rent, instead of repeating the instruction.

### I.19 — room looks out of step with the room (low priority) [new ×2]
**Problem:**
- The street lamp is "burning at noon" on the night street in Chapters IV–V.
- The cabinet drawer "stands an inch open, as if it were listening" after Alan has opened it.

**Fix:**
- The lamp at night: "…burning, for once, at the proper hour."
- A matching variant for the open drawer.

**Why:**
- Both lines describe something that is visibly no longer true.
- They are low priority because players rarely re-examine these, but they cost little and the lamp line is a joke in its own
  right.

## Chapter II, the visits and Bastos

### II.1 — `celeste_suit` [rec]
**Problem:** "A gentleman came asking after **Maria**, the week before she died. Cream linen suit…" The notebook's own entry says
he was asking about Maria's **son**, and so does STORY.md.

**Fix:** "…came asking after her boy, the week before she died. Cream linen suit, in this weather. Lovely manners. He said he could
wait."

**Why:**
- This is a plot clue, not colour. Lacerda is looking for Zé, the fourth heir.
- If Celeste says "Maria", the player has no reason to think of the son. The Chapter IV turn, Zé being the target, then comes
  from nowhere.
- It also contradicts the notebook the player is reading.
- The rest of the line is kept, including the menace of "he said he could wait".

### II.2 — `alan_tape_found` [rec]
**Problem:** "The collector was looking for a seal, not for manners." It plays before the last tape, which is the first place
"the collector" is mentioned. Nothing so far has said anyone was searching for a seal.

**Fix:** "[pause] In the little boat. He gave it to Iemanjá to keep. Whoever turned this room over wasn't looking for manners."

**Why:**
- Alan would be quoting a tape he hasn't heard yet, which also spoils the reveal on the tape.
- The new line uses only what the player can see, a ransacked flat, and keeps the joke and the pause.

### II.3 — Celeste on Rui [trim]
**Problem:** "There's the cat. I feed him. It's complicated. **Tell me about the river.**" Nobody answers. The menu just comes
back, and the river topic may already have been used up.

**Fix:** cut the last sentence from the take.

**Why:**
- Alan asks a question that the game then ignores, which feels broken.
- The remaining lines already end on a joke, "It's complicated."
- A trim costs nothing. The other option, playing the river exchange straight after, would force a topic the player may not want.

### II.4 — Celeste's greeting on every visit [code]
**Problem:** Every time you talk to her, she says "Joaquim's boy. I'd know that chin in a fog. And look, we have one." This is a
first-meeting line.

**Fix:** first visit only. After that she goes straight to her gossip.

**Why:**
- Recognising Alan on the fourth visit makes her sound like she has forgotten him.
- The gossip system already gives her fresh things to say, so no new recording is needed.

### II.5 — `ines_pull` [rec]
**Problem:** "So. Your grandfather was in **that** cistern in fifty-five, and a church that prays without a roof can only be the
Carmo."
- By now the Carmo has been named three times: by Celeste, by Alan and in a hint.
- "That cistern" refers to nothing said in this scene.

**Fix:** "So. Your grandfather came up out of the Carmo cistern in fifty-five, and Amália's song sends us to the same place: the
church that prays without a roof."

**Why:**
- This line is the chapter's deduction, so it should feel like two facts clicking together. It shouldn't feel like a fresh
  discovery of something already said three times.
- The rewrite puts the two sources side by side, Celeste's 1955 story and the song, so the "click" is the payload.

### II.6 — Ferreira's shop, lamp lit [code + trim]
**Problem:** The two lines play back to back and say the same thing:
- "Every clock stopped at the same minute. The only man in Lisbon who died on time."
- "They didn't run down. They stopped. Together. Twelve minutes past three."

**Fix:** play `alan_clocks` first, then only "The only man in Lisbon who died on time."

**Why:**
- The observation is better the first time with the detail (03:12, which matters to the story), and the joke works better as the
  punchline after it.
- It is a reorder and a trim, so no recording is needed.
- 03:12 itself is untouched, as the standing rule asks.

### II.7 — the tide table introduced twice [code]
**Problem:** "A tide table from a clockmaker…" plays, then the close-up opens, then "Ferreira's tide table. In the margin…" plays.
That is two introductions either side of the same picture.

**Fix:** drop the first line there. It stays for the path where the card is recovered later.

**Why:**
- The close-up line has the clue, the margin note, so it is the one to keep.
- No recording is needed.

### II.8 — Teixeira "My shift starts at six!" [rec]
**Problem:** He is on duty right now. He came on patrol, his radio has called him eleven times and the station is asking where he
is.

**Fix:** "[panicking] I'm on duty! They'll send a car!"

**Why:**
- The comedy of the scene is a policeman handcuffed while on duty. "My shift starts at six" undoes it and contradicts three other
  lines.
- The new line raises the stakes, because they'll come looking.

### II.9 — `alan_repair_hint` [rec]
**Problem:** "…the desk key should fit anything he made for **us**." Alan then uses it on Ferreira's own tide clock, which Ferreira
made for himself, not for the Sanches.

**Fix:** "…So Grandfather's desk key should fit anything he made for the four families. His own clock included."

**Why:**
- The hint's logic should match the action it leads to. Otherwise the player who follows it hits a contradiction.
- Widening "us" to "the four families" is true, because Ferreira was one of them, and it teaches the player that the families are
  linked.

### II.10 — `ines_bastos_1` [rec]
**Problem:** "Bastos. Alan, the second name on your list." Alan said exactly that seconds earlier, when he took the key. Inês
herself read the four names out in Chapter I.

**Fix:** "Professor H. Bastos? Henrique Bastos? Alan, I never put the two together. He taught anthropology for thirty years…" The
rest is unchanged.

**Why:**
- What is news to Inês, and to the player, is that the victim is the professor she has been quoting.
- The rewrite gives her that surprise instead of a repeat. It also explains why she's keen to go.

### II.11 — "Ferreira cut keys" three times [trim ×2]
**Problem:** The same fact comes three times:
- "Ferreira kept spares of everyone's locks."
- "…Ferreira cut his keys too."
- At the door: "He cut keys for half the old families in Lisbon."

**Fix:** trim the second and third lines down.

**Why:**
- One telling is enough; the third telling makes Alan sound like he's reminding himself.
- Trimming means no new recording.

### II.12 — the key board look doesn't mention Bastos [new + code]
**Problem:** Inês's hint, "Ferreira kept spares…", sends the player to look at the key board. Looking at it mentions Lacerda's tag
but not Bastos's.

**Fix:** while the key is still on the board, add [new] "Another: 'Prof. H. Bastos, Graça'."

**Why:**
- A hint that sends you to look at something should be rewarded by the look.
- This is the hand-off into the whole Bastos level, so the player must be able to find it.

### II.13 — `ines_tape_missing` [rec]
**Problem:** "The last **reel's** empty." It's the box that is empty. The reel is hidden in the boat, and that is the puzzle.

**Fix:** "The last box is empty. Look at the label: 'vinte e sete de Outubro'. The day he died."

**Why:**
- "Reel" tells the player the reel exists and is blank, which points them away from the real solution.
- "Box" is what's on screen, and it is what the other two lines say.

### II.14 — `alan_teixeira_sorry` [rec]
**Problem:** "I'm a lot after lunch, **too**." Nobody has said anything about Alan being "a lot", so "too" has no partner.

**Fix:** "Sorry, Teixeira. I'm a lot before lunch. After lunch, I'm worse. Mind the third step."

**Why:**
- It is STORY.md's original wording, with the stair callback.
- It is a complete joke on its own, instead of half of one.

### II.15 — the date of Iemanjá's festival [rec]
**Problem:** Inês says "On New Year's Eve they set white flowers…" That is Rio de Janeiro's custom. In Bahia, her home, the great
Iemanjá festival is 2 February at Rio Vermelho.

**Fix:** "…On the second of February they set white flowers and little boats on the waves for her…"

**Why:**
- Inês is a historian from Salvador. Getting her own city's best-known festival wrong undermines her as the expert.
- Brazilian players would notice.

### II.16 (your call) — `ines_sea_3` [rec]
**Problem:** In the sea conversation, Inês lists "…The Brotherhood with their bell." That comes before the tapes, which are where
the player learns the Brotherhood rang it to call the sea.

**Fix:** "…The holy women on Gran Canaria. The bells of Ys."

**Why:**
- It is a small spoiler of the tapes' reveal. It also isn't quite something she knows yet.
- I've left it to you, because Chapter I hints loosely at it ("a bell for the drowned"), and you approved the conversation as it
  is.

## Chapter III, the Sé, Tomás, Abílio and Lacerda

### III.1 — `alan_vasco_sorry_2` [rec]
**Problem:** "**The other day**, in the pit." The whole game takes place on one Tuesday, and the heist was this morning. Abílio's
gossip even says "THIS MORNING".

**Fix:** "This morning, in the pit." The rest is unchanged.

**Why:**
- It is the timeline. "The other day" also makes the apology feel late, when it's meant to be raw.

### III.2 — Tomás and the godparent [rec ×2]
**Problem:** Tomás is holding the charter, whose rule III says "The House of Lacerda stood as its godparents". Yet:
- Alan asks "Who stood godparent?", and Tomás ends "I was never told which."
- Tomás's "Where did you get this?" follows a question that shows him nothing.
- "**Your** Brotherhood" tells the player that Tomás belongs to it. That is his Chapter V confession.

**Fix:**
- Alan: "Professor Bastos said the Brotherhood baptised the bell in the sea. On tape. And this says who stood godparent."
- Tomás ends: "…That's why the water still answers to that family. [beat] I had prayed the line had died out."

**Why:**
- At the moment Tomás says "I was never told which", he is holding the answer, so he sounds either stupid or lying for no reason.
- The rewrite has Alan put the document in front of him, so "Where did you get this?" makes sense. Tomás now reacts to the name
  instead of not knowing it.
- "I had prayed the line had died out" hints that Tomás knows more, setting up Chapter V without giving it away.
- Dropping "your" keeps his secret.

### III.3 — the decode scene order [code + rec]
**Problem:** Tomás's line "Ring it backward and the bell renounces the sea" comes two lines after the rite it explains. It falls
between Joaquim's written "I ran… His boy watched" and Alan's "[quietly] He ran…", splitting a quiet moment. Bastos has already
told the player the same thing on tape.

**Fix:**
- Move it straight after the rite.
- New text: "Your professor had it right. At a baptism you renounce. Ring it backward and the bell renounces the sea."

**Why:**
- An explanation belongs next to the thing it explains.
- Joaquim's confession and Alan's reaction are the emotional centre of the chapter, so they should be next to each other.
- "Your professor had it right" turns a repeat into confirmation: the old priest agrees with the dead scholar. It also gets the
  "I'm going to the Chiado" exit right after "Only one of them sells antiques".

### III.4 — `alan_decode_1` [rec]
**Problem:** "'The Brotherhood rang the drowned bell.' Well. That's the headline." Since the move, the player always hears
Bastos's tapes first, and the tapes already said it.

**Fix:** "'The Brotherhood rang the drowned bell.' [beat] Bastos had that much. Let's see what he didn't."

**Why:**
- Moving Bastos to Chapter II made the tapes compulsory before this point, so "headline" is now old news.
- The new line acknowledges it and turns the player's attention to the next card, which has the real news: a Sanches hand rang
  it.

### III.5 — `ines_hint_order` [rec]
**Problem:** "Tomás said the Sé. Go and talk to a deaf man about bells. Write it down for him." Because of how the flags work,
this hint can only fire after Alan has already met Abílio and talked to him in writing.

**Fix:** "You've met Abílio. Read the four bells with the glass, and ask him about the founders' blood. Tell him whose grandson you
are first."

**Why:**
- A hint that tells you to do something you've done is useless to a stuck player.
- The new one names the three things that can actually be left at that point, in the order the game needs them.

### III.6 — Abílio names Joaquim to a stranger [code]
**Problem:** Two of the written questions, about the tongue and about 1955, can be asked before Alan has told Abílio who he is.
Abílio then volunteers "JOAQUIM BROUGHT THE TWIN UP THESE STAIRS…" and "JOAQUIM ASKED ME NOT TO…" to a stranger.

**Fix:** show those two only after Alan has introduced himself, as the "blood" question already does.

**Why:**
- Abílio is the keeper of Joaquim's secrets, so blurting them to anyone breaks his character.
- A comment in the code already states this rule; two questions were missed.
- No recording is needed.

### III.7 — museum exhibits without Inês [new ×2 + code]
**Problem:** In Chapter III, and in Chapter I after she leaves, only Alan's half of the exhibit exchanges plays.
- "A year and a half? I get homesick in Belém." answers her "The India run took a year and a half".
- "And here's me thinking it came from the Benfica defence." answers "where saudade comes from".

The player hears replies to nothing.

**Fix:** solo versions for when she's absent.
- "Gold of the fleets. Inês says her country paid for half of Lisbon. A year and a half each way? I get homesick in Belém."
- "Alminhas. Souls with no grave. Inês says saudade starts here. I always blamed the Benfica defence."

**Why:**
- Both jokes are good, and they only need their set-up.
- Quoting Inês keeps her voice in the room, and makes Alan sound like he listened to her, which is nice for the relationship.

### III.8 — `vasco_fragment` [rec]
**Problem:** "Your family's. It came up **this morning**." Alan was in that pit with Vasco this morning, and Vasco showed him the
Sanches marks then.

**Fix:** "Your family's. It came up after you'd gone. I thought you should have it."

**Why:**
- If it came up while Alan was there, Vasco would have handed it over then.
- "After you'd gone" also carries a touch of the hurt of that morning, which suits the reconciliation.

### III.9 — Abílio "ASKING ABOUT IT" [rec]
**Problem:** "THE CURATOR WAS ASKING ABOUT **IT** THIS MORNING." It plays right after Alan writes his introduction, so "it" has
nothing to refer to.

**Fix:** "THE CURATOR WAS ASKING ABOUT YOU THIS MORNING. A TALL BOOKSELLER, HE SAID. HE THINKS I CAN'T HEAR."

**Why:**
- The intended joke is that Vasco has been asking around about Alan after the heist. With "it", the joke is lost.
- "YOU" makes it land, and also tells the player the heist has consequences.

### III.10 — `alan_thu_truth` [rec]
**Problem:** "You said bring the truth. So, all of it. The key off your lanyard, the papers…" This scene can only happen after
Alan has already confessed the key and the papers to Vasco at the twin.

**Fix:** "You said bring the truth. So, the rest of it. The bell, the man in the Chiado… I'm not sorry I did it. I'm sorry I made
you wait for it."

**Why:**
- Re-confessing makes it sound like the earlier scene didn't happen.
- What Alan withheld was the why, and "the rest of it" delivers that.
- The new ending is more honest and more Alan, and the apology still stands.

### III.11 — Lacerda's clocks shown again [code]
**Problem:** Asking Lacerda about the clocks always replays the clock close-up and Alan's "F, three twelve… The fourth is
waiting…", even if the player has just looked at them.

**Fix:** only if they haven't been seen.

**Why:**
- The repeat drains the menace from the reveal.
- No recording is needed.

### III.12 — `ines_hint_see_case` [new + code]
**Problem:** "Lacerda's glass case, Alan. Go and look at what's in it…" can fire straight after the decode, before either of them
has been to the shop or knows there is a case.

**Fix:** before the shop: [new] "Antiguidades Lacerda, in the Chiado. Go and see what a man like that keeps behind glass."

**Why:**
- Inês can't know about a case she hasn't seen.
- The new hint gives the player the right next step, the shop itself, and still teases the case.

### III.13 — "Tomás knows more about bells" [rec ×2]
**Problem:**
- Alan: "Not yet. I don't even know what I'd be washing. Father Tomás knows more about bells than he's telling."
- Inês: "Ask Tomás about bells, Alan."

After the Bastos tapes, both of them know exactly what the bell is. What's open now is who it answers to.

**Fix:**
- `alan_stone_wait` → "Not yet. Bastos told me what the bell is. Tomás hasn't told me who it answers to, and he knows."
- `ines_hint_bells2` → "Ask Tomás who stood godparent, Alan. He's dying to tell you, in his way."

**Why:**
- Moving Bastos to Chapter II made these out of date.
- They now point at the godparent question, which is the real next step (see III.2), so the hint is useful again.

### III.14 — Abílio's "Read them yourself" [code]
**Problem:** The question that gets "READ THEM YOURSELF, BOY…" is still offered after all four bells have been read.

**Fix:** hide it once all four are read.

**Why:**
- It sends the player to do something they've finished.
- No recording is needed.

### III.15 — Vasco's idle lines in Chapter III [code + rec]
**Problem:** After his cameo, Vasco stands in the cloister, out of the pit, but still says digging lines like "Sorry. Found a
sherd." He also says "Did you know bells were baptised? Of course you didn't." By Chapter III, Alan very much did.

**Fix:**
- Drop the digging lines in Chapter III.
- #15 becomes "Bells were baptised, you know. Nobody ever lets me finish that sentence."

**Why:**
- Vasco should match what's on screen.
- The rewrite keeps his running gag (nobody listens to him) and makes it true in every chapter.

### III.16 — `ines_steam` [rec]
**Problem:** "…you look like a man who's seen a clock." The joke depends on the J.C. clock in Lacerda's shop, which is optional.
A player who skipped it gets a reference to nothing.

**Fix:** "…like a man who's seen a murderer's shop."

**Why:**
- Every player has seen the shop, because it ends the chapter.
- The other fix, making the clock compulsory, adds a gate to the chapter end for one joke.

### III.17 — `tomas_novena` [rec]
**Problem:** "Nine days of fog is a novena… They rang it to call their dead home." The last sentence repeats Bastos's tape and
Inês's comment on it.

**Fix:** "Nine days of fog is a novena. In 1755 it ended on All Saints' Day, the eve of the Day of the Dead. The tenth day is when
it's answered."

**Why:**
- It replaces a repeat with a new and ominous piece of information.
- It ties the nine days to the real 1 November 1755 earthquake, and sets the deadline for the finale.

## Chapters IV–V

### V.1 — the knot [rec]
**Problem:**
- Celeste instructs: "Break its back, menino! Bend it the wrong way and it gives."
- Her hint says "Tail back through the loop!", the old solution from before the puzzle changed.

**Fix:** "The line, menino! Break its back. Bend it the wrong way and it gives!"

**Why:** a hint that describes the old solution actively misleads a stuck player. This is the worst kind of inconsistency.

### V.2 — `celeste_hint_wake` [rec]
**Problem:** "**I told you.** Move the boat wrong and he'll come up like a cork." It plays even if the player never asked her how
to wake Zé, so she never told him.

**Fix:** "Shouting won't do it, menino. Move the boat wrong and he'll come up like a cork."

**Why:**
- It works whether or not the question was asked.
- "Shouting won't do it" reacts to what the player has just tried.

### V.3 — Chapter V shop door [code]
**Problem:** "Rui first. If I'm going down a hole at midnight, someone should know which hole." This can play before Lacerda's
message, which is what names the Carmo and midnight.

**Fix:** before message 3, use the existing "machine first" line.

**Why:**
- Alan would be quoting a message he hasn't heard.
- The replacement line already exists and points at the right next step.

### V.4 — `alan_ask_midnight` [rec]
**Problem:** "It's midnight, Father. **You said to ask.**" Tomás's "Ask me at midnight" is an optional line in Chapter III that
many players won't hear.

**Fix:** "It's midnight, Father. Whatever you've been keeping for forty years, I think it's time."

**Why:**
- The confession is a big moment, so it shouldn't open on a callback half the players missed.
- The new line works on every route, and puts the weight on the forty years of silence.

### V.5 — the machine in Chapter V [code]
**Problem:** In Chapter V, looking at the machine says the light "has finally stopped nagging". At that moment the machine is
blinking with Lacerda's message.

**Fix:** until message 3 has been heard, use the blinking description.

**Why:**
- The look contradicts what is on screen, and it hides the one thing the player should notice.
- See I.15 for the text of the heard version.

### V.6 — the end of Chapter IV [rec ×3]
**Problem:**
- The narrator says the note "crossed the river" to the Chiado. Cais do Sodré and the Chiado are on the same bank; the Chiado
  is straight uphill.
- The next card, `narr_tr4_2`, says the same beat again: a tile was broken and a man heard it.
- "Inês rang twice" is said by the narrator, by Celeste and by Alan.

**Fix:**
- `narr_ch4_end` → "The note from the tongue rolled up off the river and climbed to the Chiado…"
- `narr_tr4_2` → "Up in the Chiado, a man who had waited forty years decided he had waited long enough."
- `alan_kettle_rang` → "[quietly] She was frightened, and I was below decks."

**Why:**
- The geography is real Lisbon, and local players would notice.
- The chapter card should move the story on. The new one gives Lacerda's decision, which is what Chapter V is about.
- Alan's line now carries guilt instead of a third telling of the number of calls.

### V.7 — `narr_turn` [rec]
**Problem:** "At twenty-five past six the river turned, and for the first time in nine days, nobody drowned." The river turns four
times a day, and only three people died, so this implies drownings at every turning.

**Fix:** "At twenty-five past six the river turned, and for the first time, a tile lay on a bed and nobody drowned."

**Why:**
- The new line is accurate. It also states the actual victory: the tile came, as it did for the others, and failed.

### V.8 — `narr_bell_lit` [rec]
**Problem:** "…four centuries of patience." The bell was cast in 1754, about 240 years ago, and two other narrator lines say "two
hundred years".

**Fix:** "…two hundred and forty years of patience."

**Why:**
- It is arithmetic, and it appears on the climactic shot.

### V.9 — `amalia_alone` [rec]
**Problem:** "Joaquim ran because he was alone down there." Tomás's confession says Joaquim had the eleven-year-old Tomás with him,
and ran to carry him out. Celeste saw "Joaquim Sanches and a small boy".

**Fix:** "Joaquim had nobody beside him down there but a frightened child. You are not alone, menino…"

**Why:**
- The tavern can be visited after the confession, so the player may have just learned the truth Amália contradicts.
- The rewrite keeps her point: you have help, he didn't. It also agrees with Tomás, and even deepens it, since Joaquim's running
  was to save a child.

### V.10 — the Chapter IV clock [code]
**Problem:** Inês says "It's twenty past five", then the scene sets the on-screen clock to 17:15, so time runs backwards.

**Fix:** set it to 17:20.

**Why:** a one-character fix, with no recording.

### V.11 — quay "again" / "still" [new + rec + code]
**Problem:** These assume earlier chats that are optional.
- Rosa: "Browsing **again**, menino? You browsed that boat for half an hour!" This answers Alan's "I'm only browsing", which only
  plays if he spoke to her before.
- The mender: "**Still** in my light, bookseller."

**Fix:**
- Rosa, if you haven't chatted: [new] "You, menino! You were on that boat half an hour! The whole quay heard the hull knocking!"
- The mender: "In my light, bookseller. But sit down. You've earned it."

**Why:**
- Both lines reward the player for the boat scene. They should do that on every route, not only after the optional chats.

### V.12 — "what the bell remembers" [rec ×2]
**Problem:** Celeste's original line, "Nothing breaks it but what the bell remembers", is optional in Chapter II. Two later lines
quote it as if the player heard it: Alan's "…Only what the bell remembers, she said." and Celeste's hint "What else does a bell
remember?"

**Fix:**
- `celeste_hint_tile` → "Nothing breaks that clay but what the bell remembers, menino. You're carrying it."
- `alan_fragment_tile` → "…Bronze from the bell itself, not just any bronze."

**Why:**
- This is the solution to the chapter's key puzzle. A player who skipped the Chapter II topic gets a riddle that refers back to
  nothing.
- Now the hint states the rule itself, and Alan's line states the conclusion.

### V.13 — Zé's "Just do it." [new + code]
**Problem:** Talking to Zé in the cabin before the tile is broken plays "Just do it.", which is his reply to Alan asking about the
tongue. It can play before Alan has even picked up the tile.

**Fix:** for the plain talk: [new] "There. On the bunk. Whatever you came to do, bookseller, do it."

**Why:**
- "Just do it" with no question before it sounds rude rather than desperate.
- The new line points at the tile, which helps a stuck player.

### V.14 — after the romance [code]
**Problem:** After Zé's "…you know where I moor", giving him any item still gets "He doesn't want that. He wants me off his boat."

**Fix:** once he's saved, use a generic fail line.

**Why:**
- The fail line contradicts the warm ending the player just earned.
- No recording is needed.

### V.15 — the lit bell [code]
**Problem:** After Alan has cut his palm, clicking the bell still says "'With his own blood on the bronze.'… I was hoping it was a
metaphor."

**Fix:** after the cut, play the existing last-to-first nudge.

**Why:**
- The line tells the player to do what they've just done, which makes them think it didn't work. That is a real risk of getting
  stuck at the climax.

### V.16 — the machine before the cat is fed [code]
**Problem:** Clicking the machine in Chapter V before the cat is fed gives "He's learned. The machine is warm by itself." That
line only makes sense after the lamp trick.

**Fix:** use the existing "He's dug in. Nine kilos of no…" line.

**Why:**
- The right line already exists and describes what is on screen: the cat sitting on the machine.

### V.17 — Celeste "Which boat did you say?" [rec]
**Problem:** Alan says "It's tidal. Purely tidal. **Which boat did you say?**" Celeste hasn't named a boat; that is a separate
topic.

**Fix:** "It's tidal. Purely tidal. Which one's his boat?"

**Why:**
- It works in either order, and it leads naturally into the boat topic.

### V.18 — dawn said twice [rec]
**Problem:**
- The card says "At dawn, the city woke, and never knew how close it had come."
- A minute later, the epilogue says "…and nobody drowned. Nobody noticed."
- Separately, "breath" is used for the fog in two lines in a row.

**Fix:** `narr_tr5_3` → "At dawn, a bookseller and a historian climbed out of a hole in a church, and the sun was waiting."

**Why:**
- The epilogue's "nobody noticed" is the better ending, and it belongs to Alan's point of view, so it should be the only one.
- The card instead gets the two of them, and the first sun after nine days of fog. It is an image the game hasn't shown yet.

### V.19 — Lacerda "You killed him." [code]
**Problem:** Every talk with Lacerda in the finale replays Alan's "You killed him.", which already played in the scene's intro.

**Fix:** first time only.

**Why:**
- An accusation said once is powerful. Said on every click, it is a stuck record.
- No recording is needed.

### V.20 — `alan_jc_unknown` [rec]
**Problem:** "José Coutinho. Maria's son, on a boat at Cais do Sodré, and he doesn't even know." Alan has just read exactly that
aloud from the letter a second earlier.

**Fix:** "Zé. And the next turning is twenty-five past six."

**Why:**
- It replaces the repeat with the one thing the letter doesn't say: the deadline.
- That is what launches the chapter.

### V.21 — `alan_descend` [rec]
**Problem:** "'Stay away from water,' **he** said. … Rui will be livid." It plays right after Tomás or a thought about Vasco, so
"he" reads as one of them. Rui's original warning was in an optional branch.

**Fix:** "'Stay away from water,' Rui said. Midnight, a flooded church basement, a dead man's bell. He'll be livid."

**Why:**
- The joke depends on knowing who said it.
- Naming Rui makes it work for players who missed the original line.

### V.22 — small wording fixes [rec ×2]
**Problem:**
- `ines_kettle`: "I'll **keep** ringing Rui". Nothing has shown her ringing him.
- `ines_hint_blood`: "You read it to me." There is no scene where Alan reads it to her; he decoded it with Tomás.

**Fix:**
- `ines_kettle` → "I'll ring Rui till he answers, and I'll keep the kettle on."
- `ines_hint_blood` → "'His own blood on the bronze,' Alan. It's in Joaquim's hand."

**Why:**
- Both are small false claims about earlier scenes. The new text is true and keeps the warmth.

### V.23 — the paper cut [code]
**Problem:** "alan_papercut" is played as a joke, so Inês may score it. At that moment she has just been freed and is terrified,
and her last line was a frightened "Alan…". A score like "Zero, Alan. The cat left the room." lands straight after it.

**Fix:** play it as a plain line, not a joke.

**Why:**
- The tone is wrong. That is the one place in the game where she shouldn't be keeping score.

### V.24 (your call) — the bell's waves [rec?]
**Problem:** The narrator says the bell is "carved with four great waves". The seal on the tiles is "a bell under three waves", and
Bastos's sea "came in three waves".

**Fix:** if the painting shows three, change the line to three. The painting can't change.

**Why:**
- It is the story's main symbol, so the count should be consistent. I'll check the painting before proposing a change.

### V.25 (optional) — Bastos callbacks in the finale [rec ×2]
**Proposal:**
- `alan_father` → "[pause] Mine's gone too, Vicente. Bastos said it: ring it for the dead and the sea comes to collect more. I'm not
  ringing it your way."
- `alan_strike_1` → "[under his breath] Last to first, Grandfather. Say no."

**Why:**
- Nothing is wrong here.
- Since Bastos is now compulsory, the finale could use what he taught. Lacerda wants to ring the bell to bring his father back;
  Bastos's tape is the reason that's a disaster. Letting Alan say so turns the Chapter II level into a payoff.
- Purely optional.

---

## Totals and what happens after approval

**Totals:**
- About 62 lines re-recorded or trimmed.
- About 12 new lines.
- About 20 code-only fixes.

**After approval:**
- Every changed line is re-transcribed to check the words, then lip-synced.
- STORY.md quotes are updated to match.
- Checks: validate, smoke and a full play.mjs run.
- One handoff log entry.
- No deploy until you ask.
