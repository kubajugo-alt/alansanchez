# Phase 3 delivery: combined sprites (Alan with someone)

2026-10-18 · branch `lore-se-museum`

## What Phase 3 does

- **Review screen (`?review`)**: states, transitions, walk, new frames to approve or reject, and every scene with combined sprites.
- **Combined sprites stand on Alan's feet**: every `pair_*` painting is anchored on his feet (and the partner's feet), drawn rigid (no warp, no breathing, no morph), at his standing height. Alan steps to the one spot where the partner's painted feet land on the partner's own feet, so neither of them jumps going in or out.
- **Transitions**, your choice (Combined tab, kept in your browser):
  - **cross-fade**: 0.25 s in and out, one pair painting dissolving into the next. The default.
  - **Gemini in-betweens**: a painted frame on the way in, one on the way out, and one between each pair painting and the next. Only frames you approve are used.
- **Facing rule**: no frame facing right morphs into one facing left, for anyone.

## What to check on the review screen

Open the site with `?review` at the end of the address.

1. **New frames tab**: approve or reject each frame. Each one shows the paintings it was made from beside it; **▶ try it** plays it in motion.
   - [ ] 24 Phase 2 in-betweens (turns, reaching, the first and last step of a walk, the coffee walk…)
   - [ ] 26 Phase 3 in/out frames (`pair_ib_<pair>_in` / `_out`): Alan stepping into and out of each combined sprite
   - [ ] 31 Phase 3 step frames (`pair_ib_<a>__<b>`): from one combined painting to the next (Teixeira 8, Duarte 19, Zé 2, the sheet 2)
   - [ ] For each frame, look for: wrong or missing clothes, an extra or missing person, a bare foot, Alan's back turned the wrong way, the partner's face changing, anything held in the wrong hand.
   - [ ] **💾 Save decisions**: on the live site this downloads `approvals.json`. Send it to Claude to commit.
2. **Combined tab**
   - [ ] **Transition test: the police station**: play the cross-fade and the Gemini version one after the other, then pick a transition with the radio buttons. **Your choice of transition is still open.**
   - [ ] **▶ each scene** (police station, guitar lesson, the sheet, Zé, Vasco, both bedroom visits): does anyone jump going into or out of a combined sprite? Does Alan stay where his solo frame stood?
   - [ ] The sprite buttons under each scene show each painting on its own, on Alan's feet.
3. **Walk tab**
   - [ ] Is the walk smooth? The walk frames were put back on their old hand-tuned anchors after your report.

## Fixed or changed this session

- The 31 step frames are wired (`S.pairStep`) into the Teixeira and Duarte visits, Zé's kiss and the sheet, and are listed for review.
- Three step frames were wrong and were redone with a note (the old ones are in `art/review/alan/phase3/rejected/`):
  - Duarte's leap onto Alan's back: both men fully dressed, Duarte in a different shirt.
  - The jeans throw: the jeans back in Alan's hands.
  - Shoes still on, but one bare foot.
- The review screen was showing three rejected Vasco frames instead of the redone ones. Fixed.
- `?scene=visitcop` and `?scene=visitguitar` played nothing (the visits had moved in the story). Fixed, so the Combined tab's bedroom-visit buttons work again.

## Tests

- Smoke test (every `?scene=` preview, fast mode): all pass. The only failures logged were music files stopped mid-load in fast mode, which is not a real error.
- The combined-sprite scenes in Gemini mode, with every frame approved: all pass, and each scene plays its in-betweens in order.
- Full new-game playthrough: reaches the ending (`won: true`), no errors, no soft-locks, no shortcuts. It found two small bugs (a comment swallowing code in `ch1.js` and `ch2.js`), to be fixed after the code reorganisation is merged.

## Gemini cost

| | Calls | Cost |
|---|---|---|
| Phase 3 (in/out, steps, redos) | 63 | $4.74 |
| All four phases and earlier, to date | 139 | $10.10 |

Every call is logged in `art/review/log.md`.

## Files changed since Phase 2 (`git diff --stat 29785bc HEAD`, code and docs)

```
 docs/animation_handoff.md    | 167 +++++++++++++
 index.html                   |  20 +-
 js/engine.js                 |  87 +++++--
 js/morphs.js                 |   2 +-
 js/review.js                 | 317 +++++++++++++++++++++++++
 js/sprites.js                | 554 +++++++++++++++++++++++++----------------
 js/story/ch1.js              |  35 ++-
 js/story/ch2.js              |  16 +-
 js/story/ch4.js              |  15 +-
 js/story/core.js             |  63 ++++-
 js/story/main.js             |  38 ++-
 js/story/se.js               |  31 ++-
 js/story/visits.js           |  24 +-
 scripts/align_alan.py        |   9 +-
 scripts/gen_pair_ibs.py      |  57 +++++
 scripts/lipsync.py           |  66 ++++++
 scripts/morphs.py            |  11 +-
 scripts/pair_anchors.py      |  68 ++++++
 scripts/pair_ibs.json        | 404 +++++++++++++++++++++++++++++++
 scripts/review-server.mjs    |  32 +++
 scripts/review_candidates.py | 116 +++++++++
 21 files changed, 1840 insertions(+), 292 deletions(-)
```

Plus 342 art files (new frames, side-by-sides, candidates and the call log): 3,537 insertions.
