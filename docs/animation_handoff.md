# Animation handoff

State of the four-phase animation plan as of 2026-10-18, branch `lore-se-museum` (everything committed and pushed).
The live site (https://alan-sanchez-drowned-bell.netlify.app) runs **`e9ef055`**: Netlify deploy `6ad4584bc9604d71e07d557f`, made 2026-10-18 at the user's request.
It has Phase 4 lip-sync and blinking on Alan's four side frames (`alan_side`, `alan_idle2`, `alan_talk`, `alan_talk2`), the story-audit fixes and the date (Tuesday 31 October 1995).
Before the deploy, the clean export passed the smoke tests on every scene, and a non-FAST bath-scene run checked the lip-sync. The full playthrough passed on the working tree (story-fixes agent).

**Faces for Alan's other frames (in progress, waiting for approval).** 58 more frames have lip-sync and blinking, all with `"ok": false` in `js/faces.js` (shown in the game only with `?faces=all`):
- 13 side-like frames take alan_side's set through `scripts/face_transfer.py`; the smoking frames blink only.
- 42 have their own Gemini set (`scripts/face_kit.py gen`: mouths A-F and shut eyes at 1K, about $0.04 an edit), cut by `face_kit.py build`.
- 3 borrow the set of a frame with the same painted head (`face_kit.py borrow`): trunks_step (fling), undress_belt (front_walk1), write (read).
- Review page: https://claude.ai/artifact/BermCuEtYFLfErj9WBMnPw (db collection `faces`, one doc per frame: `decision` approved/rejected). Set `"ok": true` in `js/faces.js` for the approved ones.
- **Blocked: the Gemini prepaid credit ran out** (HTTP 402) after about $12 of this run. 70 frames still need a set: most undress/trunks/wash frames, all the cop/guitar/Vasco pair paintings except pair_vasco_coffee, alan_ring, alan_wring, alan_walkUp (their side transfer was wrong), alan_wobble. Once the credit is topped up, `python3 scripts/face_kit.py gen` resumes (finished edits are kept), then `build`.

**Next job (assessment given, not started):** a hybrid skeletal + sprite Alan. The user's six-step brief is in the session; stop after each step for approval.

## Standing rules (from the user)

- **Gemini** (`gemini-nano-banana-2.1`, key in `.env` as `GEMINI_API_KEY`, git-ignored; never print it, commit it or use it on the live site):
  - Use it only for variations of existing Canva art, and always edit an existing image of the same character.
  - Send the style refs and the fixed style text on every call.
  - Lock the palette and key out the background.
  - Match the canvas and the feet anchor.
  - Generate each set in one run.
  - Log every call in `art/review/log.md`.
- **Approval:** nothing goes into the game until the user approves it on the review screen (`?review`). No GIFs.
- **Combined sprites:**
  - Never warp or scale them.
  - Alan stands exactly where his solo sprite stood, and neither character jumps on the way in or out.
- **Facing:** a frame facing right must never morph into a frame facing left, for any character (stated 2026-10-18).
- **Instructions apply everywhere:** a rule given for one example applies to every scene with combined characters, and to everything else in general, not only the example.
- **Other characters:** don't change their solo sprites.
- **Text:** spell the name "Sanches".
- **Story changes are additive.**
- **Git and deploy:**
  - Commit and push often.
  - No PRs.
  - Deploy only a clean `git archive` export, and only when the user asks.

## Per character

**Alan**: the only character in the four-phase plan so far. Once the user approves Alan, he becomes the template for the rest of the cast.

| Phase | What | Status |
|---|---|---|
| 1 | Gemini setup, frame inventory, alignment (one height, feet anchor), state map, palette unification (leather/denim), bath and dress frames | **Done and approved**, deployed in `e13beed` |
| 2 | Smoothing in code (eased cross-fades for near-identical frames, in-betweens, walk start and stop, walk ground lengths), plus 24 Gemini in-betweens | **Code done, art awaiting approval.** The 24 in-betweens are candidates on the review screen. Proposals A to D are waiting for answers (below). |
| 3 | Review screen (Part A); combined-sprite alignment and transitions (Part B) | **Part A done** (`5e2b771`). **Part B in progress**: see "Where it stopped". |
| 4 | Lip-sync (Rhubarb) and blinking, solo and in combined sprites | **Not started.** Brief received 2026-10-18 (see below). |

**Inês** and **Vasco**: no phase of this plan has been run for them. Earlier, separate passes (before the four-phase plan) integrated Inês's v2 sprite set and Vasco's frames, expressions and staging. Those were reviewed and deployed. Both characters will follow the four phases with Alan as the template once he is approved.

## Where it stopped (Phase 3 Part B)

The user asked to stop mid-task. The work is committed (`2f3b066`) and, since then, deployed (`f2b227f`).

What this means on the live site:

- The combined sprites already stand on Alan's feet, draw rigid, and cross-fade in and out (0.25 s).
- No Gemini frames are live: `approvals.json` is `{}`, and the game loads only approved candidates.
- `?review` works on the live site. Decisions made there are kept in that browser, and "save" downloads `approvals.json` to send back for committing.

**Done:**

- **`scripts/pair_anchors.py --apply`:**
  - Every `pair_*` sprite in `js/sprites.js` now has `ax`/`fy` on Alan's feet, `px`/`pfy` on the partner's feet, and `h` set to Alan's standing height.
  - Frames where Alan stoops below 690 px or isn't standing keep `h` at 720, so the painting is never enlarged.
  - Every pair sprite carries `rigid: true`.
  - The report is in `art/review/alan/phase3/pair_anchors.json`.
- **Engine (`js/engine.js`):**
  - Rigid frames get no mesh warp, no breathing, no morph. One pair painting dissolves into the next over 0.16 s (`PAIR_STEP`).
  - `actor.fade(to, dur)` fades a whole figure (the partner melting into the pair); shadows fade with it.
  - `actor.crossFade(dur)` turns the next frame change into a dissolve (`PAIR_FADE` 0.25 s).
  - Mouth-overlay hook for Phase 4: a `window.MOUTHS[key][speaker]` placeholder, not populated yet.
  - `player.pairWho` makes the partner's lines speak from the pair.
  - Facing rule: `sameFacing()` blocks every right-to-left morph. 174 such pairs were also removed from `js/morphs.js`, and `scripts/morphs.py` no longer builds them.
- **Story (`js/story/core.js`):**
  - `S.pairSpot`, `S.pairPartnerAt`, `S.pairIn(npc, key, {walk})` and `S.pairOut(npc, {pose, dir})`.
  - Every pair scene uses them: police station (ch1 flirt and Rui's return), guitar lesson (ch1), Celeste and the sheet (ch2), Zé (ch4), Vasco (`S.withPair`/`S.vpair` in `se.js`), and the bedroom visits (`pair()` in `visits.js`; the partner steps to the spot the painting needs).
  - `S.pairMode()` reads `localStorage['pair-transition']`: `xfade` (the default) or `gemini`.
- **Gemini in-betweens:**
  - `scripts/gen_pair_ibs.py` with `scripts/pair_ibs.json`.
  - **26 in/out frames**, `art/review/alan/phase3/ib_<pair>_<in|out>.png`. They are wired as candidates (`kind: pair-inbetween`) by `scripts/review_candidates.py` and played through `frames.pairIb[key].in/out` (wiring in `S.applyCandidate`, `js/story/main.js`).
  - The first tries at `vasco_shirtless` in/out and `vasco_card_in` were wrong (jackets put back on; Alan's back to us). They were redone with a note, and the old ones moved to `phase3/rejected/`.
- **Review screen:**
  - The Combined tab lists all 50 pair sprites by scene, each with a "view" button, plus the 9 stills that paint Alan with someone.
  - Transition test for the police station: cross-fade vs Gemini, played on its own.
  - Hide-panel button.

**Not finished (pick up here):**

1. **31 step in-betweens.** These are the frames between one pair painting and the next: Teixeira 8, Duarte 19, Zé 2, the sheet 2. They are generated (`art/review/alan/phase3/ib_<a>__<b>.png`, listed in `pair_ibs.json` under `"steps"`) but **not wired**:
   - Add them to `review_candidates.py`.
   - Add a `pairIb['a>b'].step` wiring to `S.applyCandidate`.
   - Make `pair()` in `visits.js`, the Zé sequence in `ch4.js` and the wring loop in `ch2.js` play them in `gemini` mode.
   - Nobody has looked at them yet; check the `_sbs.png` files for wrong clothes or extra figures.
2. **The full playthrough** (`play_v9.js`) was stopped before it finished. The smoke tests passed on all 14 pair scenes. Re-run the playthrough before any deploy.
3. **Delivery for Phase 3** (not sent yet): a checklist of what to check on the review screen, the Gemini cost, and `git diff --stat`.
4. **Phase 4** (brief received, not started):
   - Rhubarb Lip Sync installed locally, run at build time on every Alan line (convert to WAV, pass the text with `-d`), cues saved as JSON per line id.
   - Mouth overlays A to H and X for each head angle (side, three-quarter, front) and for every combined sprite. Only the speaker's mouth moves; no warping.
   - Blinking: eyes half-closed and closed overlays; a blink every 2 to 6 s, about 150 ms, sometimes double; none when his eyes are already closed or mid pose change; in pairs, independent of the other character.
   - A lip-sync section on the review screen.
   - Deliver: a checklist, the total Gemini cost for all four phases, and `git diff --stat`.

## Also changed this session (outside the phases)

- **Walk regression (reported by the user after the last deploy).** Phase 1 had re-anchored the walk frames on the hips with a per-frame scale "bob", so his feet slid. The walk cycle frames are restored to their old hand-tuned `ax`/`h`, the original 8-frame cycle is back (with `walkDown`; no `walkLen`), their morphs are rebuilt, and `scripts/align_alan.py` now leaves the walk cycles alone. **Deployed** (`f2b227f`).
- **Rui's newspaper (the user was stuck after the clockmaker).** The desk hotspot sat behind Rui. Now he hands the Diário over when he offers it, and a save past that point gets "Your Diário, Inspector?". Commit `faa267c`. **Deployed** (`f2b227f`).

## Waiting for the user

- **Transition type for combined sprites.** **No choice made yet.** The game defaults to the cross-fade (0.25 s). The user said they would pick after comparing on the review screen: Combined tab, the radio buttons and "Transition test".
- **Approve or reject** on the review screen (New frames tab; decisions go to `art/review/approvals.json`, currently `{}`):
  - the 24 Phase 2 in-betweens;
  - the 26 Phase 3 pair in/out frames;
  - later, the 31 step frames once they're wired.
- **Phase 2 proposals:**
  - (A) use `alan_untie` for the successful haul on the mooring line (this is the `wire_alan_untie` candidate);
  - (B) leave `alan_hands` out (Gemini refused to paint it; the scene uses the towel pose);
  - (C) keep `alan_asleep` unused;
  - (D) an optional extra "weight shift" frame at the start of a walk.
- **Deploy.** Only when asked. The last deploy was `f2b227f`, on request.
- **Feedback on the live build:**
  - Is the walk smooth again?
  - Is the Diário reachable now?
  - Do the pair scenes enter and leave without jumps?

## Things I was unsure about

- Restoring the old walk anchors overrides part of the Phase 1 alignment the user had approved, on the user's own report that the walk got worse. Worth a look on the review screen (Walk tab).
- `pair_vasco_kneel` and `pair_vasco_thumb` are painted but not placed in any scene.
- Pair scale: frames where Alan stands under 690 px keep `h` at 720 instead of matching his height. That's a judgement call between "never scale" and "same height as his solo frames".
- `pair_wring_3` has Alan's feet 37 px further left in the painting than `wring_1`/`wring_2`, so Celeste shifts a little on that frame now that pairs stand on Alan's feet.
- The bedroom visit with Teixeira lines his back up against the bookshelf per frame (`TORSO` in `visits.js`), so Alan moves between those frames. I left that as it was.
- The stills with Alan and a partner fade in and out over the scene. Whether Phase 4 should add blinking or lip-sync to them hasn't been decided (in most of them his eyes are closed or nobody speaks on screen).
- The guitar-lesson spot can fall outside the tavern's walkable area. `S.pairIn` puts Alan on the spot after the walk anyway.

## Key files

- **Gemini:**
  - `scripts/gen_image.py`: one call; it handles refs, keying, palette, framing, the side-by-side image and the log.
  - `scripts/gen_pair_ibs.py` with `scripts/pair_ibs.json`: the pair in-between batches.
- **Style references:** `art/style_refs/` (`alan_side.png`, `alan_front.png`, `pair_cop_belt.png`).
- **Call log and cost:** `art/review/log.md`. The total so far is **$9.79 over 135 calls**: Phase 1 and earlier about $3.14, Phase 2 $2.14 (30 calls), Phase 3 $4.51 (60 calls).
- **Approvals:**
  - `art/review/approvals.json`: committed decisions, written by `scripts/review-server.mjs` (`POST /api/approvals`) on localhost.
  - A reviewer's own decisions are kept in `localStorage['review-approvals']`.
  - Candidates are in `art/review/candidates.json` and `art/review/candidates/*.webp`, rebuilt with `python3 scripts/review_candidates.py`.
  - Only approved candidates load into the game (`loadApproved` / `S.applyCandidate` in `js/story/main.js`).
- **Review screen:**
  - `js/review.js`, loaded only when `?review` is in the address (`js/story/main.js`). Never shown in normal play or the menus.
  - Run `node scripts/review-server.mjs` on port 8099 and open `http://localhost:8099/?review`.
- **State maps and reports:**
  - `art/review/alan/phase1/state_map.png` and `.svg`, plus `REPORT.md` and `alignment.json`.
  - `art/review/alan/phase2/REPORT.md` and `_inbetweens.jpg`.
  - `art/review/alan/phase3/pair_anchors.json`.
- **Generators for engine data:**
  - `scripts/align_alan.py`: solo anchors.
  - `scripts/pair_anchors.py`: pair anchors.
  - `scripts/morphs.py`: `js/morphs.js`.
  - `scripts/similar.py`: `js/similar.js`.
  - `scripts/unify_palette.py`: palette.
  - `node scripts/build-manifest.mjs`: asset version hashes in `index.html`.
- **Engine and story:** `js/engine/actor.js` (Actor, `composeFrames`, `sameFacing`; the engine was split into `js/engine/*.js` after this handoff, see `docs/CODEMAP.md`) and `js/story/core.js` (Alan's frames, the pair helpers).
- **Tests:**
  - Smoke test: a Playwright script that opens each `?scene=` preview and checks for page errors (scene keys in `PREVIEW`, `js/story/main.js`).
  - Full playthrough script: plays the game to the end and must finish with `won: true` and no errors.
  - Both scripts lived in the old session's scratchpad and **did not survive**, so rewrite them if needed.
  - Serve the working tree with `npx http-server -p 8097 -c-1`. Chromium for Playwright is at `/opt/pw-browsers/chromium`.
- **Deploy (only when the user asks):**
  1. `git archive HEAD | tar -x -C <empty dir>`, then `git init` and one commit there.
  2. Smoke-test that folder on its own port.
  3. Call the Netlify MCP `deploy-site` tool with site id `9d2c5b0d-c539-48f1-ab5a-acdc2920aae9`.
  4. Run the `npx -y @netlify/mcp@latest --site-id … --proxy-path …` command it returns, from the export folder.
  5. Check the live JS and that `/.env` returns 404.
  6. `.gitattributes` keeps `art/review/**` out of the export, except the candidates and `approvals.json`.
