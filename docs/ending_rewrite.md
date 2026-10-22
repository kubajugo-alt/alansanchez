# Ending rewrite: proposal (2026-10-22, not approved yet)

## The user's note

> "Lacerda spent his entire life obsessing about something, and then suddenly one line in a diary of someone who he
> considered an enemy - made him completely passive. This makes absolutely no sense. We might need to re-write the ending
> completely. I don't think the ledger would be that important for him - he wouldn't need the founders any more since he
> killed most and has the one he needs in the cistern."

## What happens now (STORY.md V.4)

1. Alan hands Lacerda the ledger.
2. Lacerda kneels on the step and reads it, with his back to the bell.
3. He reaches "Vicente, let it go" and stops paying attention.
4. Alan frees Inês, lights the bell and rings it backward.
5. Lacerda "doesn't fight it. He goes back to the ledger" and drowns while he reads.

## The new premise

**Lacerda never knew the order.** The Brotherhood made sure no Lacerda would. The order is kept in two places only:
- on the four bells of the Sé, which Alan read with the glass;
- in the founders' own hands, which means Joaquim's ledger.

**This explains three things the story already shows:**
- why Lacerda turned over Bastos's flat;
- why he searched the Sanches shop and left salt on the floor;
- why he took Inês alive: she bluffed that she knew the dates ("Your assistant has been reciting dates to me").

**He doesn't want the ledger. He wants Alan,** the last founder and the one man who read the bells. Your point ("he has
the one he needs in the cistern") becomes his own line.

**Alan's weapon is a lie.** Lacerda has to take Alan's word for the order. Alan rings it last to first and tells him it's
the founders' order. Lacerda stays dangerous and active the whole time, and dies fighting.

## Chapter V: the shop

### Message 3
**[rec]** `lacerda_msg3`: "[cold, measured] Senhor Sanches. Your assistant has been reciting dates to me. Wrong ones, I
think. She tells me you read the bells at the Sé. Then you know their order, and I never did. Bring the tongue, and your
blood. Come alone, under the Carmo. The river turns at twenty-five to one."

### Cut
The appended "And bring your grandfather's ledger. The young lady insists." and `alan_insists` both go.

The door no longer needs the ledger, so `alan_door_ledger` goes too. The door still needs the call to Rui.

### Kept
Pessoa is still lying on the ledger. Inês hid it from Lacerda when he searched the shop, and this is now the reason he
searched. Alan pockets it.

## The cistern

### 1. The confrontation
These stay as they are:
- `lacerda_joaquim`
- `alan_fin_angry`
- `lacerda_spared_2`
- `lacerda_ze`
- `lacerda_font`
- `lacerda_interrupted`
- `lacerda_father`
- `alan_father` (the Bastos version you approved)

**[rec]** `lacerda_demand`: "Four families, four bells, and the order hidden where only a founder would look. Two hundred
years, and no Lacerda was ever allowed to read it. [beat] You read it. Cut your hand, wet the bronze, ring it in the
founders' order, and she walks out of here."

### 2. The ledger, if Alan offers it (optional; this answers your note on screen)
**[new]** `lacerda_toss`: "[turning it over] Joaquim's diary. Forty years of guilt, in cipher." *(He drops it into the
water.)* "I don't need the founders' book, Senhor Sanches. I have the founder."

### 3. Light and hands
These steps stay as they are:
1. Alan asks for Inês to hold the lantern.
2. `lacerda_lamp_ok`: "By all means. Cut her loose. The water answers to me. Where would she go?" He wants the bell lit,
   because he wants to watch.
3. Alan cuts her loose with the knife.
4. She takes the lantern, the marks show (`narr_bell_lit`), and Alan cuts his hand for the blood.

**[new]** `ines_order_whisper`, as she is freed: "[low, fast] He doesn't know the order, Alan. He has to take your word
for it." This is the player's hint that a lie is possible.

### 4. The strikes, with Lacerda watching every one
These are last to first, as now.

**Strike 1, Sanches.**
- **[new]** `lacerda_sanches_first`: "[sharp] Sanches first?"
- **[new]** `alan_humility` ★: "Youngest family first. Humility. Very Catholic."
- **[rec]** `lacerda_good_1`: "[slowly, watching the water] ...It's rising. Go on."

**Strike 2, Coutinho.**
- **[rec]** `lacerda_good_2`: "[eager] Yes... the river is listening."

**Strike 3, Bastos.** The sound is a breath drawn in, not a toll.
- **[new]** `lacerda_lied`: "[cold] That isn't a summons. That's a breath held in. [beat] You lied to me."
- He turns his hand to the water under Inês on the walkway. The tide meter now climbs on its own (one mark every few
  seconds) until Alan strikes again.
- Inês: "Alan—!"

**Strike 4, Ferreira.** It has to come now. At six marks the water takes them, as it does now, and the scene restarts
from the strikes.

### 5. The silence: he fights to the end
1. `narr_ring`: the bell un-rings (kept).
2. **[new]** `lacerda_command`: "[to the water] Come. [beat] COME!" Nothing answers.
3. `narr_renounce` (kept): "The bell renounced the sea. And the sea, like any creditor, went looking for the man who had
   signed for the debt."
4. **[new]** `lacerda_ring_it`: "[wading out toward the bell] Then I'll ring it myself."
5. **[rec]** `narr_end_1`: "He was an arm's length from the bronze when the water closed over him. It had answered to his
   name for two hundred years. It answered once more."
6. **[rec]** `alan_ledger` becomes **[new]** `alan_let_go`, said quietly after a silence, with no joke and no score:
   "[quietly] His father told him to let it go. He never did."

`alan_let_go` only works if the player has read the ledger's last page. So Alan reads it aloud once in the shop, after
Pessoa moves (the existing `ines_page`/`lacerda_read_father` text, as Alan's line). Without that page, the alternative
is "[quietly] Forty years of patience. The sea had more."

### 6. Unchanged
`narr_silence`, the fog lifting, `ines_end`, and everything after.

## Lines this removes
These play only in the ledger-reading version:
- `ines_page`
- `alan_offer`
- `lacerda_cant`
- `alan_seven`
- `lacerda_ledger`
- `lacerda_read_1`
- `lacerda_read_2`
- `lacerda_read_after`
- `ines_page_this`
- `lacerda_ledger_first`
- `narr_reading`
- `lacerda_good_3`

## Totals
- **Code:** in ch5.js:
  - the distraction step goes;
  - the "watched" rule now holds for the whole scene;
  - the third strike starts the timed rise;
  - the ledger becomes an optional item to give.

  Also: the hints (`S.ch5Hint` and the cistern hints), STORY.md V.1 and V.4, and play.mjs.
- **Recording:** 6 re-recorded, 7 new.
- **Art:** no new paintings. One open question: is there a sprite pose for Lacerda wading toward the bell, or does the
  water simply rise over him where he stands, as it does now?
