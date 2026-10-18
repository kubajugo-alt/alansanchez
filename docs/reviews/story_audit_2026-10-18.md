# Story audit: The Drowned Bell (branch lore-se-museum)

This was a read-only audit. Nothing in the repo was edited. Sources: `js/lines.js` (1351 lines), `js/story/*.js`, `docs/STORY.md`, `docs/CHARACTERS.md` and `docs/LORE.md`. I ran `node scripts/validate.mjs` to find retired lines.

Notation: `lines.js:N` is the line in js/lines.js where the id is defined. **Re-voice** means the fix changes a voiced line's text and needs ElevenLabs again. **Code-only** and **text-only** fixes need no audio.

Counts: **A = 13, B = 24, C = 36**.

One validator gap to know about: some ids (`ines_liked`, `vasco_hook_2`, `vasco_cameo`, `ines_why`) never play. The validator doesn't flag them because their names appear in pose maps (`ines.js:33`, `se.js:31`, `se.js:49`).

---

## (A) Players will notice

These are contradictions between lines that both play in a normal playthrough, or references to things the player hasn't seen yet.

### A1. The list scene never plays, and four later lines depend on it (code bug)
- `ch1.js:499`: `await say('alan_list_hand', 'rui_water'); await joke('alan_water'); F().saw_list = true;` sits **after a `//` comment** on the same line, so it never runs. The validator reports this as an ERROR. The effects:
  - `alan_list_hand` (lines.js:129, "That's my grandfather's writing. [pause] He's been dead ten days...") never plays. STORY I.4 calls this "the chapter's first real chill".
  - `rui_water` (lines.js:130, "Stay away from water, Sanches.") and `alan_water` never play.
  - `saw_list` is never set (the validator lists it as "read but never set"). So `ines_sketch_founders` / `alan_founders` (lines.js:90–91, gated at `ch1.js:260`) **never play**. Inês never connects the four names to the bell-founders.
  - Dangling references in every playthrough:
    - `alan_descend` (lines.js:521, `ch5.js:39`): "**'Stay away from water,' he said.** ...Rui will be livid."
    - `celeste_maria` (lines.js:218, `ch2.js:325`): "Nobody told him to stay away from water **either**." Celeste also can't know what Rui told Alan.
  - `alan_ask_list` can be asked again and again, because its `!saw_list` gate never closes.
- **Fix (code-only):** move the commented-out code onto its own line after `S.readList()`. No re-voice. Optionally, make Celeste's "either" a general warning; it reads fine once `rui_water` plays.

### A2. Alan answers the retired machine message
- `ch1.js:163,168`: `rui_msg_2` (lines.js:1202) is a worried warning ("A name came up in a case this morning. Yours... call me back"). Alan replies `alan_after_msg` (lines.js:71): "Rui Mendonça **asking me for help**." That reply belongs to the retired `rui_msg_1` ("Come down to the Judiciária").
- **Fix (re-voice `alan_after_msg`):** "Rui Mendonça, worried about me. The fog really has gotten to people."

### A3. Rui's drawer is "upstairs", but it's the cabinet in his own office
- `rui_drawer_1` (lines.js:133, Ch. I topic `ch1.js:502`): "There's a drawer **upstairs** that won't close."
- But the drawer is the filing cabinet in the same room: `narr_look_cabinet` (lines.js:113) "The bottom drawer stands an inch open" (Ch. I), the hotspot at `ch1.js:431`, and `rui_drawer_crowbars` "Bottom one."
- **Fix (re-voice `rui_drawer_1`):** "In this building? There's a drawer in that cabinet that won't close. The only one. That's as strange as it gets."

### A4. Lacerda introduces himself every time Alan talks to him
- `ch3.js:336` plays `lacerda_hello_2` (lines.js:1349) unconditionally at the start of every conversation: "Senhor Sanches, I believe. **We've never met**, but I know the name..."
- The swap needs at least two conversations (look at the box, ask about it; more after a `lacerda_another` reset).
- It is also the second line he speaks. On entry, `lacerda_weather` (lines.js:1244, `ch3.js:319`) has already said "I never get wet, **Senhor Sanches**."
- **Fix:**
  - Code-only: play `lacerda_hello_2` once behind a flag, and open later talks with no greeting.
  - Optional re-voice of `lacerda_weather` to drop "Senhor Sanches" ("I never get wet. It's a family gift.").

### A5. Rui reports the withdrawn Sé complaint twice
- In the first Ch. II talk, the gossip hook (`visits.js:490`, `ch1.js:494`) plays `rui_gossip_3` (lines.js:1053): "Someone reported a theft from the Sé reserve and then withdrew the complaint."
- `teixeira_scene` isn't set yet, so this is the first gossip entry eligible.
- Then `alan_ask_theft` / `rui_withdrawn_2` (lines.js:1218–1219) play. They are a menu topic and also fire automatically after `alan_tell_ferreira` (`ch1.js:507`): "Anything new on the Sé break-in?" / "**Funny you should ask.** The curator came in and withdrew the complaint himself."
- **Fix (code-only):** remove the `rui_gossip_3` entry from `GOSSIP.rui`, which also retires `alan_deny_rui_3`.

### A6. Tomás says Vasco has "started coming to Mass" on the day they met
- `tomas_gossip_1` (lines.js:1051) plays at Alan's first talk with Tomás in **every** game (`visits.js:493` gated on `vasco_thursday`, which the mandatory heist sets; `ch3.js:81`).
- The line: "Doctor Teles **has started coming to Mass**. He sits near the door, watching it."
- The heist was this morning, so a few hours earlier.
- **Fix:** code-only, drop it from `GOSSIP.tomas` (with `alan_deny_tomas_1`). Or re-voice it as something that fits one afternoon, e.g. "Doctor Teles telephoned at lunch to ask whether the Carmo needs a curator. It has no roof."

### A7. The Ch. II transition makes Inês "a girl from Barreiro" and sets up a secret the game never pays off
- `narr_tr2_3` (lines.js:1461, `transitions.js:19`, over `still_tr2_ines`, every playthrough): "And for ten days, **a girl from Barreiro** had kept something to herself."
- Game: Inês is from Salvador (`ines_fog` lines.js:737 "Back in Salvador, my avó...", `ines_gold` 938 "My country...", `ines_duarte_2` 1124 "In Salvador we eat musicians..."). The CHARACTERS.md author decision says "Inês stays as in the game... Salvador. Ignore the Barreiro version".
- The secret (CHARACTERS: she found Joaquim's body) is never revealed in any line.
- **Fix (re-voice `narr_tr2_3`), something the game pays off:** "And in a bookshop in the Alfama, a woman from Salvador was counting the days to the tenth morning." (Ties to `ines_tenth`.)

### A8. Vasco calls him "Alan" in Ch. I, which spoils the Ch. V first-name beat
- `vasco_inscription_2` (lines.js:1318, `se.js:422`, every heist): "...Your family again, **Alan**."
- The Ch. V call builds to the first name: `vasco_fcall_5` "Be careful, Senhor Sanches." → `alan_vcall_5` "Alan." → `vasco_vcall_5` "Be careful, Alan." (`ch1.js:207–209`). STORY V.1 says: "He calls him Alan **for the first time**."
- Every other Vasco line uses "Senhor Sanches" (`vasco_liar`, `vasco_bye_alan`, `vasco_idle_3`).
- **Fix (re-voice `vasco_inscription_2`):** "...Your family again, Senhor Sanches."

### A9. "That's the two sentences" answers a prompt nobody gave
- `alan_two_sentences` (lines.js:448, `ch4.js:346`, always plays): "...somebody wants us both to pay for it. **That's the two sentences.** The joke is that I'm the one who came to save you."
- Zé never asks for two sentences. His challenge is `ze_ten` (lines.js:423): "You've got **ten seconds**".
- **Fix (re-voice `alan_two_sentences`):** "...That's the ten seconds. The joke is that I'm the one who came to save you."

### A10. Zé knows Alan's name without being told
- `ze_rom_take` (lines.js:461) "...do as you're told, **Sanches**", `ze_rom_2` (465) "Stop talking, **Sanches**" and `ze_back` (645) "Tell **Alan**..."
- Alan never introduces himself to Zé. `alan_tide_sense` (425) is "A bookseller with a terrible sense of timing...", and Celeste stays on the quay.
- **Fix (re-voice `alan_tide_sense`):** "Alan Sanches. A bookseller with a terrible sense of timing and an excellent sense of tide."

### A11. Lacerda's message asks for the ledger twice in a row
- `ch1.js:151–152` plays `lacerda_msg3` (lines.js:491) "...She mentions a book. **Bring it.**..." and straight away `lacerda_msg3_ledger` (1174) "**And bring your grandfather's ledger.** The young lady insists."
- **Fix (code-only):** drop `lacerda_msg3_ledger` and `alan_insists`. Or, if "the young lady insists" should stay, re-voice `lacerda_msg3` without "She mentions a book. Bring it."

### A12. (known, confirmed) Rui "gave" the Ferreira key that Teixeira brings
- `alan_ferreira_sealed` (lines.js:225) plays on the first entry (`ch2.js:423`): "**Rui gave me the key**".
- In a fresh game the key arrives only through `teixeira_key_first` (`visits.js:182–183`, after `rui_key_2` "I'll try to find a way..."). `rui_key` only plays for old saves (`ch1.js:489`).
- Related: `ines_hint_paper_2` (1209) "He gave you the key" and `alan_look_fkey` (679) "from a policeman who didn't give it to me" read loosely but acceptably.
- **Fix (re-voice `alan_ferreira_sealed`):** "Sealed with police tape. Rui sent me the key, which makes this a perfectly legal accident."

### A13. (known, confirmed) Zé's post-credits jacket line contradicts the picture
- `ch5.js:436` shows `still_jacket`. STORY says it is Lacerda's **cream linen** jacket pulled from the Tagus.
- `ze_back` (645) says: "Not mine to keep. Tell Alan **he left it on my bunk**."
- Alan wears leather, and the jacket is Lacerda's.
- **Fix (re-voice `ze_back`):** "[pause] Not mine to keep. [softly] Cream linen. Somebody should tell Alan the river gave it back."

---

## (B) Minor, or only on optional or rare paths

### B1. Which weekday is "today"?
- On-screen text: the Diário's tide rows (`docs.js:110`) label the fog days `Sex 6 … Sáb 14`, so day 9 is **Saturday 14 Oct 1995** (the dates match October 1995).
- `LORE.md:260–261` says Maria drowns "**the Wednesday**", with Thursday the next day.
- Lines that disagree:
  - `guitar_visit_2` (lines.js:827) "Tuesday came early this week" only works on a day **before** Tuesday.
  - `lino_talk_1b` (895, Ch. IV after Duarte's visit) "Duarte's stool has been empty **since Tuesday**" contradicts Duarte playing the fado earlier today, on either reading.
  - `nun_talk_1` (578) "The stone has been weeping **since Sunday**" vs `tomas_stone` (281) "It weeps every fog". The fog began on day 1, which is Friday on the Diário or Tuesday on LORE.
- **Fix:**
  - Pick one weekday and relabel the Diário rows (text-only).
  - Re-voice `lino_talk_1b` ("Duarte's stool has been empty since this afternoon, menino...") and `nun_talk_1` ("...weeping since the fog came").
  - Keep `guitar_visit_2` only if today is Sat–Mon.

### B2. Same-day gossip that implies days have passed
- `amalia_gossip_1` (908; Ch. IV tavern, about an hour after Duarte's visit): "My guitarist **has stopped coming to rehearsals**... taking private lessons."
  - Re-voice: "My guitarist missed rehearsal this afternoon, menino. He says he was giving a private lesson. In a bookshop."
- `celeste_gossip_1` (904): "Your sheets came in **this week**, filho. **Twice**." It plays hours after Teixeira's visit. Arguable; accept, or re-voice "Your sheets will be in by Thursday, filho, I hear."
- `ines_gossip_5` (1047): "He's written your name on the back of a reliquary label." How would Inês know? Vasco met Alan that morning and never left the pit while she was in the reserve.
  - Code-only: drop it from `GOSSIP.ines`.
- `abilio_gossip_1b` (1351): "THE CURATOR WAS ASKING ABOUT IT THIS MORNING. **HE THINKS I CAN'T HEAR.**" The deaf Abílio overhears speech, and "IT" has no referent.
  - Re-voice: "THE CURATOR WROTE ME A NOTE ABOUT YOU THIS MORNING. THREE PAGES. HE HAS BEAUTIFUL HANDWRITING."

### B3. Alan "lies" to Vasco after already confessing
- `alan_rom_hesitate` (457, Ch. IV): "A man with a trowel, **who doesn't know I lie to him**."
- In Ch. III Alan has already confessed the heist (`alan_vasco_sorry_2` 1347, `se.js:731`, mandatory) and promised the rest for Thursday.
- **Fix (re-voice `alan_rom_hesitate`):** "...A man with a trowel, who's still waiting for the truth from me."

### B4. "Rui says you think the river is breathing" assumes an optional topic
- `alan_ask_river` (206, `ch2.js:314`) is only true if the player asked Rui about the fog (`alan_ask_fog`, optional, `ch1.js:504`).
- **Fix (code-only):** show it as an unvoiced `label: 'Tell me about the river.'` when `!F().rui_fog_heard`.

### B5. Alan knows Abílio by name in Ch. I, then meets him as a stranger in Ch. III
- `alan_stair_chained` (959, Sé cloister in Ch. I) says "**Abílio** only rings at six."
- Abílio is introduced in Ch. III by `tomas_order` (299, "Abílio at the Sé knows it...") and by `ines_hint_order` ("talk to a deaf man about bells").
- **Fix (re-voice `alan_stair_chained`):** "The bell-ringer only rings at six. And he doesn't like visitors before he's rung."

### B6. Abílio says "YOURS" before he knows who Alan is
- `abilio_drowned` (1078) says "**YOURS** HAS FOUR FAMILIES IN IT".
- `alan_w_blood` is the first written topic (`ch3.js:222`) and can come before `alan_w_joaquim`, which is the moment Abílio learns Alan is a Sanches.
- **Fix (code-only):** gate `alan_w_blood` on `alan_w_joaquim` having been asked, or run the Joaquim note first automatically.

### B7. Amália's night reprise quotes a lyric the player never heard
- `amalia_night_sing` (505) "Come back, come back, **my bell-boy**, and ring it backward with this song" comes from the old spoken fallback `amalia_sing_3` (166).
- The recorded fado, its captions (`ch1.js:584–597`) and Duarte's lyrics sheet have no "bell-boy" line.
- **Fix (re-voice `amalia_night_sing`):** "[singing softly, alone] The sea waits, the sea is long: ring it backward, once and for all."
- Note: `amalia_sing_1..3` differ from the recording ("son of the founders" vs "son of the bronze and the river"). They only play when the mp3 is missing.

### B8. "Heard that song all his life" vs "nobody sings it anymore"
- `narr_melody` (1167; Duarte's visit declined): "Alan had heard that song **all his life** without listening to it."
- Against it:
  - `ines_sketch_3` (93) "Nobody sings it anymore".
  - `amalia_after_song` "made me promise never to sing that for a stranger".
  - `narr_vig_night` "for the first time in her life... to a full room".
- **Fix (re-voice `narr_melody`):** "Alan had heard that song once, a few hours ago. This time he listened."

### B9. "Under the cathedral"
- `narr_tr1_3` (1458, end of Ch. I): "And **under the cathedral**, something old had begun to count."
- The drowned bell is under the **Carmo** (`narr_1755` 292, `narr_look_cistern`, the charter). The Sé is the cathedral.
- **Fix (re-voice):** "And under the Carmo, something old had begun to count."

### B10. Ch. III transition misplaces Alan's decision
- `narr_tr3_1` (1462): "The last of it was standing **in a tower, deciding whether to run**."
- The choice was made at the Carmo with Tomás (`alan_choice`, `ch3.js:141`), before the tower. By this transition, after the swap, it's long settled.
- **Fix (re-voice):** "...The last of it had climbed a tower instead of running."

### B11. The dawn phone call is narrated twice
- `narr_tr5_3` (1470) "At dawn, Alan Sanches... **made a phone call**" plays in `S.dawn` (`ch5.js:412`).
- The epilogue then ends on `narr_call` (644, `ch5.js:441`) for the same call, after eight paintings.
- **Fix (re-voice `narr_tr5_3`):** "At dawn, the city woke, and never knew how close it had come."

### B12. The epilogue's press and "the Camões nobody bought" are set up only by retired lines
- `narr_epi_shop2` (1423): "on **the bookbinding press**, holding down **the Camões nobody bought**."
- The shop has no press hotspot (`ch1.js:69–102`). The setup was `narr_look_press` and `alan_camoes`, both retired; `narr_look_press` mentions the removed brass weight.
- **Fix:** add a press hotspot and re-voice `narr_look_press` without the weight ("A bookbinding press, clamping a Camões that nobody has bought since nineteen seventy-two."). That also brings back `alan_camoes`. Or re-voice the epilogue line to "on the counter".

### B13. Notebook lore: "Mine at least sent postcards" (not voiced)
- `docs.js:98`, the 'father' entry: "Lacerda wants his father back. ~~So do I. Mine at least sent postcards.~~"
- Alan's father died: genealogy "Joaquim — son, d. 1967" (`docs.js:36`), `alan_father` "Mine's gone too". CHARACTERS says it was Eleanor who "sent cards".
- **Fix (text-only):** "~~So do I. Mine never came home either.~~"

### B14. Notebook phone number is Portuguese (not voiced)
- `docs.js:77`: "Mãe — 22 31 70 4?" is a Portuguese (Porto-style) number.
- Canon: Alan's mother lives in **St. Augustine, Florida** (CHARACTERS author decision, STORY cast table). CHARACTERS even flags the old "in Porto" error.
- **Fix (text-only):** "Mãe — 001 904 82? …"

### B15. Looking at the reserve key you already hold says you can't get it
- `se.js:603`: the `reserve_key` item's look is `alan_lanyard_far` (978): "He'd notice. I need to be a lot closer..."
- Alan already has the key in his pocket when he can look at it. It's also the response to key-on-reserve-door (`se.js:188`), which half-works.
- **Fix (code-only):** use `alan_toss_wait` for the item look ("Not while he's watching me...").

### B16. Ferreira's drawer hotspot is never gated (code bug)
- `ch2.js:410`: the drawer's `when: () => lit() && !F().drawer_unlocked` sits inside a `//` comment (validator ERROR).
- So "Four digits. A clockmaker's lock." (`alan_drawer_lock` 1235) works in the pitch-dark shop, where every other hotspot is hidden and Alan "can't see a thing", and it stays after the drawer is open.
- **Fix (code-only):** move the `when` out of the comment.

### B17. Tomás refers to "those steps"
- `gag_tomas` (554, `ch5.js:55`): "go and find whoever you were thinking of **on those steps**".
- Tomás never saw Alan on any steps. It plays before the descent; the stair pause was at the Sé (`alan_stair`).
- **Fix (re-voice):** "...whoever you were thinking of on your way here."

### B18. Alan says "Vicente" without being told
- `alan_father` (1088): "Mine's gone too, **Vicente**."
- The first name appears only in look narration (`narr_look_lacerda` 335). Lacerda never gives it, and Joaquim's "Vicente, let it go" page is shown later in the rite.
- **Fix:** accept (the player has read it), or re-voice "...Senhor Lacerda."

### B19. Inês names the Lacerdas as the culprits in Ch. II
- `ines_fate` (1059, optional Ch. II topic): "...**The Lacerdas** didn't [drown]. They're the ones who decided it hadn't worked yet."
- This points at the villain's family before Alan has met him. STORY II.1: "No suspect is named over a surname."
- **Fix:** gate the topic on `lac_suit_seen`, or accept it as foreshadowing.

### B20. Maria's death: yesterday or this morning?
- The tide card and the deduction page (`docs.js:58,118`) put 04:01 on **day 8**. Day 9 has no 04:01 turning: its turnings are 00:37, 06:49, 13:01 and 18:25.
- LORE ("the Wednesday... Maria drowns at 04:01. The game begins at 11:00") and CHARACTERS ("This morning his mother drowned") say day 9.
- The lines are ambiguous:
  - `rui_msg_2` "A name came up in a case this morning".
  - `ze_tile` "I thought it was from her things".
  - `narr_look_ze` "black band on his sleeve".
  - `narr_look_news`: today's paper reports the third drowning, which fits day 8.
- **Fix:** keep the table (it's the maths) and correct LORE and CHARACTERS. No re-voice.

### B21. Two Duarte gossip beats can't play or don't fit
- `celeste_gossip_2` (906, needs `duarte_scene`) is unreachable. Celeste is only at the lavadouro while `ch < 4` (`ch2.js:35`), and `duarte_scene` is set at the very end of Ch. III.
- `lino_talk_1b` (895) "since Tuesday" (see B1).
- **Fix:** retire `celeste_gossip_2`, or re-voice it for the quay and hook it into `talkCelesteQuay`.

### B22. Teixeira's apology is set before lunch, but it's afternoon
- `alan_teixeira_sorry` (1208): "I'm a lot **before lunch**."
- Ch. II starts at 13:30; Teixeira greets them "Boa tarde" (`phone_visit_1`), and an hour of cigarettes has passed.
- **Fix (re-voice):** "I'm a lot after lunch, too."

### B23. Vasco asks "Any relation?" right after the introduction
- `vasco_marks` (969): "This one's an S under a bell. **Sanches, I think. Any relation?**"
- This comes moments after `alan_vasco_hello` (963) "Alan Sanches. Bookseller."
- **Fix:** accept as teasing, or re-voice "Sanches. Your name. Any relation, or just good taste?"

### B24. The fragment "came up this morning", but Alan was in the pit at noon
- `vasco_fragment` (1098): "It came up **this morning**."
- Alan was in that pit with him around noon, and Vasco didn't mention it.
- **Fix:** accept, or re-voice "It came up after you left."

---

## (C) Docs-only mismatches and nitpicks

Where the game and the docs disagree, the game is the truth; both sides are given.

1. **(known)** CHARACTERS.md:493 says Zé was born 1950 (45). The game says thirty-four (`narr_look_ze` 422), as do STORY's cast table and continuity list. CHARACTERS also gives him a "father lost at sea"; the game says "no father registered" (`alan_read_coutinho` 385, genealogy).
2. **(known)** The `?scene=lacthreat` preview (`main.js:73`) still exists and runs `S.talkLacerda()`, which has no threat. The comment at `main.js:66` ("...and Lacerda's threat about Vasco") sits above the unrelated `bench` entry. The threat lines `lacerda_expose`, `lacerda_reputation`, `lacerda_curator`, `alan_thursday_threat`, `alan_cold` and `lacerda_who` are all retired.
3. CHARACTERS gives Joaquim's birth as 1914, aged 81. The game's file says "J. Sanches... 43" in 1955 (born 1912), and STORY says he died at 83.
4. Joaquim's wife: CHARACTERS says Rosa (married 1935, Pedro born 1936); STORY says Graça (married 1936, son born 1937). In-game, "Rosa" is the quay fishwife and "Graça" a washerwoman.
5. CHARACTERS has Inês in the shop since 1989 (six years). In-game, `gag_ines_1` says "In **four** years I've never once seen you look at one."
6. 1955 and the tongue: CHARACTERS says Celeste saw Joaquim "carrying a boy" and that Joaquim "dropped what he was holding". The game (`celeste_1955_2`) has "Joaquim Sanches and a small boy... carrying something heavy in sailcloth". STORY says Joaquim kept the tongue 40 years and Lacerda took it from his flat. CHARACTERS should follow the game.
7. Rui in CHARACTERS:
   - "his **avó** is right" should be his mother.
   - It still quotes "Stop feeling up my constable" (retired by the author).
   - It says Rui tells Alan about the complaint in Ch. V; in the game it's Ch. II.
   - "Twenty-five years on" vs `narr_look_rui` "Twenty years of murders".
8. Vasco: `ines_vasco` "Thirty-eight, Coimbra"; CHARACTERS says born in Braga (Coimbra is his university; fine). CHARACTERS has him at the Sé since 1990 (five years); `vasco_tag` says "every day for **six** years". CHARACTERS mentions a "reliquary glass", but the game uses a find tray's glass lid (`narr_glimpse`).
9. Abílio: CHARACTERS says "Joaquim left the tower to marry"; `abilio_joaquim` says "THEN HE WENT TO SELL BOOKS". Both rules say he shouts every line, but `abilio_tongue` (1079) drops to lowercase ("While their hearts beat, it waits for them."). Making it caps changes the subtitle only.
10. Amália: CHARACTERS says she "sang his song every night for decades". The game has the promise not to sing it, "Nobody sings it anymore", and `narr_vig_night` "first time in her life... to a full room".
11. Celeste: CHARACTERS says "fifty-five years" of washing; `narr_look_celeste` says "fifty years".
12. Duarte: CHARACTERS says "Tuesdays and Fridays. **Never Thursdays.**" `alan_room_guitar_2` (839) has Alan say "And **Thursdays**", hours after his Thursday date with Vasco. That may be deliberate; check with the author. Duarte was born 1964 (31), but `guitar_flirt_1` claims "Thirty years of practice".
13. Teixeira in CHARACTERS "unhooks his own handcuffs and holds them out". In the game Alan takes them (`alan_cuff_1/2`).
14. CHARACTERS minor figures: the cruel remark on the quay is "a fisherman from Zé's crew"; in the game it's Rosa the fishwife. The "taberna owner" is Senhor Lino the barman in the game.
15. LORE's "Where players learn it" key lines don't exist in the build:
    - Vasco: "A tolled bell calls the dead home".
    - Celeste: "The river's full of men nobody buried".
    - Abílio: "Your blood's in that bronze, boy!"
    - Tomás: "The godparents answer for the bell..."
    - Tomás in Ch. V: "They don't hate us, Alan..."
    - The Sea's "floor that isn't a floor" glimpse is not in the build either.
16. LORE gives "Fools twice over... They made the bell, and then they rang it" to Amália. In the game, Tomás says it (`tomas_founders` 278); Amália only has "Bell-founders, twice over" (`amalia_who`).
17. Lacerdas as priests:
    - LORE: "Godparents, **not priests**".
    - Game: `tomas_godparents` (1068) "The Lacerda **priest** held it over the font".
    - STORY rule 4: "The Brotherhood's priests were Lacerdas".
    - Pick one; changing it means re-voicing `tomas_godparents`.
18. What raises the fog: LORE says a godparent begins a novena at the cistern; STORY rule 3 says the tongue coming near the cistern. The game doesn't state either.
19. Brotherhood membership: LORE says widows and mothers; STORY I.5b and notebook lore 'irmandade' say "widows and **shipowners**"; `ines_irmandade` says "Widows... A sailors' brotherhood".
20. STORY I.4 still presents `alan_list_hand`, `rui_water` and `alan_water` as played (see A1). STORY V.1 says "calls him Alan for the first time" (see A8). Some STORY texts differ from lines.js: `ines_tenth`, `alan_read_file`, the Ferreira-dark hint. STORY's Production-spec lyrics are the old spoken ones, not the recorded song.
21. `narr_ch1_end` says "a quarter past one"; the Ch. II card says 13:30. Both are narrative, so this is harmless.
22. `narr_look_marks` (527) says "Six marks are **painted**", while STORY and the code say chiselled. It also says "The lowest is already wet", but the meter starts at 0.
23. `narr_bell_lit` "four centuries of patience" (bells 1611–1739, the bell cast in 1754) and `narr_tr5_1` "two hundred years" (actually 240) are loose figures.
24. `cards_talk_1` "two-handed **since the Revolution**" vs `alan_npc_cards` "the same game **since Salazar**".
25. Greetings repeat at every conversation: `amalia_hello` ("Joaquim's grandson. You have his face..."), `celeste_hello` ("I'd know that chin in a fog") and `tomas_hello`. Consider short repeat greetings (code).
26. `rui_gossip_2` "brought back only the hat": Inês freed Teixeira, so the cuffs should have come back too. It's a joke; harmless.
27. `alan_look_fkey`, "from a policeman who didn't give it to me", is now literally false, since a policeman (Teixeira) handed it over. Acceptable as deniability.
28. The tide-card header mixes languages: "dia | turnings" (`docs.js:66`).
29. `narr_epi_shop2` says "an appointment at the Sé, **on Thursday**", but LORE says the epilogue morning *is* Thursday. This depends on B1.
30. `gag_alan_ines_1` "I look at lots of women. **My mother.**" comes from a man who hasn't called her in two years. It's a joke and fine, but it brushes the arc.
31. `lacerda_spared_2` "you never once came asking about bells": Alan asked him about a bell's tongue that same afternoon. It's fine as "before now".
32. `alan_rom_guilt` / `alan_thu_truth` repeat the heist confession already made in Ch. III. Acceptable ("all of it").
33. Retired lines that contradict canon (no action needed, listed for completeness):
    - `lacerda_hello` "You **always** look like a man who needs to sell" (they've never met).
    - `teixeira_key` "I... forgot".
    - `rui_send`.
    - `rui_msg_1` (the source of A2).
    - `rui_list_1` "old spelling".
    - `alan_turnings`.
    - `alan_lacerda_name`.
    - `rui_gossip_1` "all week".
    - The brass-weight lines `narr_look_case_after`, `alan_swap`, `narr_ch3_lacerda`, `alan_look_weight` and `ines_hint_theft`.
    - `narr_pit`.
    - `abilio_backward`, a duplicate of `_2`.
34. Duplicate texts in lines.js, none played twice:
    - `ines_liked` / `ines_liked_2`.
    - `vasco_hook_2` / `vasco_hook_3`.
    - `vasco_cameo` / `vasco_after_2` ("Thursday?").
    - `alan_cameo` / `alan_fcall_5` ("Thursday."), intentional.
    - `alan_stair` / `alan_face_pause` ("...").
    - `alan_ask_ines_now` / `alan_ask_ines_se_now` / `alan_what_now`.
    - `ines_liked`, `vasco_hook_2`, `vasco_cameo` and `ines_why` never play but escape the validator, because pose maps mention them.
35. Spelling: "Sanchez" appears **nowhere** in shown text (lines, code strings, index.html). It appears only in the Netlify site slug in `docs/animation_handoff.md:4`. Inês, Amália, Abílio, Zé, Tomás, Sé, Judiciária, Cais do Sodré and Diário are consistent in lines.js and in displayed names (`engine.js:14`). No unaccented variants were found.
36. The founders' order and dates are consistent everywhere: the list, Rui, the genealogy, the repair note, the bells (MDCXI, MDCXLVIII, MDCCII, MDCCXXXIX), `alan_order`, `ORDER` in `ch5.js:65` and the notebook. So are the 18:25 and 00:35 turnings, the 03:12, 15:38 and 04:01 death times, the nine days of fog, 1755, 1934, 1955/56 and Alan's age of 37.

---

## Re-voicing summary

**Code-only (no audio):**
- A1 (biggest win)
- A4 (the once-flag)
- A5
- A6 (drop option)
- A11 (drop option)
- B2 (`ines_gossip_5`)
- B4
- B6
- B15
- B16
- B21 (retire)

**Text-only, not voiced:**
- B1 (Diário labels)
- B13
- B14
- C9 (`abilio_tongue` caps)

**Re-voice, one line each:**

| Fix | Line |
|---|---|
| A2 | `alan_after_msg` |
| A3 | `rui_drawer_1` |
| A7 | `narr_tr2_3` |
| A8 | `vasco_inscription_2` |
| A9 | `alan_two_sentences` |
| A10 | `alan_tide_sense` |
| A12 | `alan_ferreira_sealed` |
| A13 | `ze_back` |
| B3 | `alan_rom_hesitate` |
| B5 | `alan_stair_chained` |
| B7 | `amalia_night_sing` |
| B8 | `narr_melody` |
| B9 | `narr_tr1_3` |
| B10 | `narr_tr3_1` |
| B11 | `narr_tr5_3` |
| B17 | `gag_tomas` |
| B22 | `alan_teixeira_sorry` |

Optional re-voices:
- A4: `lacerda_weather`
- B1: `lino_talk_1b`, `nun_talk_1`
- B2: `amalia_gossip_1`, `abilio_gossip_1b`
- B12: `narr_look_press`
- C17: `tomas_godparents`
