# Alan animation — Phase 2 report

## 1. In-betweens waiting for your approval (24 frames)
The review sheet is `_inbetweens.jpg`. Each new frame (blue panel) sits between the two poses it links, all drawn at the scale the game uses. Each in-between also plays in reverse for the way back.

| frame | links | used for |
|---|---|---|
| ib_walk_start / ib_walk_stop | side → walk / walk → side | the first and last step of every side walk |
| ib_turn34 | side ↔ front | turning to face us; also leads into the flirt gag, the yawn and the fado (¾ views) |
| ib_turn34back | side ↔ back | turning away |
| ib_smoke_in / ib_smoke_out | side ↔ cigarette | hand to the pocket; flicking the butt away |
| ib_stretch1, ib_stretch2, ib_stretch_down | yawn → stretch → side | arms rising, then lowering |
| ib_read, ib_write, ib_phone, ib_drink, ib_cut | side ↔ each pose | raising the book, notebook, receiver, glass, knife |
| ib_reach | side ↔ reach | arm half out |
| ib_pick1, ib_pick2 | side ↔ pick up | bending, then half way down |
| ib_throw, ib_ring, ib_pull, ib_wobble | side ↔ each action | the wind-up |
| ib_lantern | side ↔ lantern set | lifting the lantern |
| ib_coffee_walk1, ib_coffee_walk2 | coffees | a carry walk (contact and passing) |

Not made, with reasons:
- **Sitting:** the only sitting frame, `alan_asleep`, isn't used anywhere.
- **Undress and dress chains:** they got their in-betweens in the bath rounds.

Redone before showing you:
- **ib_pick1, ib_pick2:** Gemini drew two figures.
- **ib_pull, ib_ring:** two figures, then too small; fixed by using the wider target pose as the main reference.

## 2. Phase 1 flagged frames: status and proposals
- **Already fixed and approved earlier:**
  - **Fixed in place:** the colour families, the walk-cycle denim, the arms-up scale, the close-ups' build and face, the bodybuilder frames and pickup's proportions.
  - **Missing frames:** filled by the 29 new bath and dress frames.
- **Proposal A, `alan_untie`** (no new art): it's painted but unused. Use it for the successful haul on the mooring line (Ch. IV); the failed first try keeps `alan_pull`, so the two tries look different.
- **Proposal B, `alan_hands`:** Google refused it twice. Leave it out; the scene already falls back to the towel pose.
- **Proposal C, `alan_asleep`:** unused. Keep it on file for a later scene.
- **Proposal D, a new walk "loading" frame** (optional, about $0.07): `walkDown` is out of the walk cycle (see section 3). A repainted loading frame with the foot in the right place would bring the cycle back to 8 frames.

## 3. Smoothing in code (done, in the game once committed)
- **Short cross-fades:** near-identical frames (13 pairs found by `scripts/similar.py`, outlines overlapping at least 85%) now ease over 100 ms instead of cutting. Examples: talk and idle, the cigarette drags, read and write, wash1 and wash4. Big pose changes keep their 0.34 s morph.
- **Easing:** walks already speed up over 0.24 s and slow into the last step. Morphs and the new cross-fades are eased, and the in-between holds are 110 ms each.
- **No foot sliding:** the walk now advances each frame by the distance his planted foot moves in that painting (measured from the sprites). It used to use one fixed step for every frame. `walkDown` is out of the cycle because its planted foot sat ahead of the contact frame's, so it slid forward and snapped back every stride. The cycle is now contact, passing, toe-off on each foot. Smoothing data was added for the new frame pairs. His speed is unchanged: 0.62 heights per second, about 1.8 steps a second.
- **Breathing:** idle breathing and sway were already in (a 3.9 s breath, a slight random tempo for each figure). Unchanged.
- **Idle cigarette:** unchanged (after 20 s, never in a church or mid-scene). It already morphs in and out of every frame. Once approved, `ib_smoke_in` will open it.
- **In-between support:** the engine can now play in-betweens for any pose change (`frames.inbetween: { 'from>to': [...] }`), plus a walk start and stop step (`frames.walkStart`, `frames.walkStop`). Both are dormant until you approve the frames; wiring them in is just data in `js/story/core.js`.

## 4. Cost
- Phase 2 Gemini: $2.14 (30 calls, retries included).
- All Gemini work so far: $5.29 (76 calls).
