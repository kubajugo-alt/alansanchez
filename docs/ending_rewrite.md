# Ending rewrite: proposal, version 2 (2026-10-22, not approved yet)

## The user's notes
- On the current ending: "Lacerda spent his entire life obsessing about something, and then suddenly one line in a diary
  of someone who he considered an enemy - made him completely passive... I don't think the ledger would be that
  important for him - he wouldn't need the founders any more since he killed most and has the one he needs in the
  cistern."
- On version 1 (Lacerda doesn't know the order): "makes little sense - Lacerda had 40 years to go to the se and read the
  bells", "and he was the order - the founders weren't".

## The premise
Lacerda **is** the Brotherhood. He knows everything:
- the rite;
- the founding order;
- that ringing backward renounces the sea.

The founders were only craftsmen. There is one thing he cannot do himself. The bell answers only its makers' blood, so a
founder's hand has to ring it. That is the only reason he needs Alan. It is also why 1755 needed "a Sanches hand"
(Chapter III), and why he killed the other founders and kept Alan for last.

He has no use for the ledger.

Alan cannot trick him. What Alan has is the rule Bastos taught (Chapter II, the sea talk): "It obeys whoever holds the
right thing... Obeys the hand on the bell." The water answers to the Lacerda name everywhere except at the bell. With a
founder's blooded hand on the bronze, the water answers to that hand. Lacerda knows the rite. He never took the sea's
rules seriously.

## Chapter V: the shop

### Message 3
**[rec]** `lacerda_msg3`: "[cold, measured] Senhor Sanches. Your assistant has been reciting dates to me. She is very
tiresome. The bell wants a founder's hand, and yours is the last one I have. Bring the tongue, and your blood. Come
alone, under the Carmo. The river turns at twenty-five to one."

### Cut
- The ledger demand and `alan_insists`.
- `alan_door_ledger`. The door still needs the call to Rui.

### The cat
Pessoa is lying on the ledger, **open at the last page**. Inês read it while she waited in Chapter IV, and she left it for
Alan.
- **[rec]** `alan_pessoa`: "[pause] He was lying on the ledger. Open at the last page. She left it for me."
- **[new]** `alan_read_last`: "'Afonso Lacerda's last words, as the water rose, were for his son: Vicente, let it go.'
  [pause] She wanted me to know he had a father."

## The cistern

### 1. Kept as they are
- `lacerda_joaquim`
- `alan_fin_angry`
- `lacerda_spared_2`
- `lacerda_ze`
- `lacerda_font`
- `lacerda_interrupted`
- `lacerda_father`
- `alan_father` (the Bastos version)

### 2. The demand
**[rec]** `lacerda_demand`: "Cut your hand, wet the bronze, and ring it as your families cast it. Ferreira first. Then she
walks out of here. I have been patient for forty years."

### 3. The ledger, if Alan offers it (optional)
**[new]** `lacerda_toss`: "Joaquim's diary. I wrote the rite he was hiding from, Senhor Sanches. I don't need his book. I
need his hand." He drops it into the water.

### 4. Light and hands
These steps are kept. Lacerda wants them done, because he wants the bell rung.
- Inês holds the lantern (`lacerda_lamp_ok`: "Where would she go?").
- Alan cuts her ropes.
- The marks show in the light.
- Alan cuts his hand.

As she is freed:
**[new]** `ines_whisper`: "[low, fast] Bastos, Alan. It obeys the hand on the bell. Not him. Yours."

### 5. The strikes: Lacerda sees it at once and comes for him

**Strike 1, Sanches.**
- **[new]** `lacerda_ferreira`: "[very still] Ferreira first, I said."
- He raises his hand to the water. It stirs, then sinks back. The water does not obey him.
- **[new]** `lacerda_listening`: "[slowly] ...It's listening to you. [beat] Then I'll take the hand."
- He starts along the walkway toward the bell. He has walk frames.

**Strike 2, Coutinho.**
- Inês plants herself on the walkway with the lantern.
- **[new]** `ines_block`: "You'll have to go through me."
- **[new]** `lacerda_gladly`: "Gladly."
- He shoves past her, and that costs him a beat.

**Strike 3, Bastos.**
- **[new]** `lacerda_take`: "[to the water] Take him!" The water climbs to Alan's ankles and stops.
- The tide meter still counts:
  - each strike: +1;
  - a wrong strike (forward): +2, and Lacerda gains a step;
  - waiting too long: Lacerda reaches him.
- If Lacerda reaches him, the water takes Alan, and the scene restarts from the strikes.

**Strike 4, Ferreira.**
- `narr_ring` (kept): the bell un-rings.
- Lacerda has reached the platform and has Alan's arm.
- **[new]** `lacerda_come`: "[to the water] Come. [beat] COME!" Nothing answers.
- `narr_renounce` (kept): "...the sea, like any creditor, went looking for the man who had signed for the debt."
- The water rises around Lacerda alone and pulls at him. He doesn't let go of Alan.
- **[new]** `alan_let_go`: "[quietly] Let it go, Vicente."
- **[rec]** `narr_end_1`: "He didn't. He never had. The water took him with his hand still closed, on a torn sleeve and
  nothing else."

### 6. Unchanged
`narr_silence`, the fog lifting, and everything after.

## Lines this removes
- `ines_page`
- `alan_offer`
- `lacerda_cant`
- `alan_seven`
- `lacerda_ledger`
- `lacerda_read_1`
- `lacerda_read_2`
- `lacerda_read_father`
- `lacerda_read_after`
- `ines_page_this`
- `lacerda_ledger_first`
- `narr_reading`
- `alan_ledger`
- `lacerda_good_1`
- `lacerda_good_2`
- `lacerda_good_3`
- `lacerda_realise`

## Cost
- **Recording:** 4 lines re-recorded and 11 new.
- **Code (ch5.js):**
  - no more reading step;
  - the strikes become a race, with Lacerda walking out along the walkway;
  - the ledger becomes an optional item to give;
  - the hints.
- **Docs and tests:** STORY.md V.1 and V.4, and play.mjs.
- **Art:** no new paintings.
  - Lacerda's existing walk frames carry the advance.
  - Grabbing Alan's arm on the platform would need a pose. Without one, he reaches the platform's edge and the water
    takes him there.
