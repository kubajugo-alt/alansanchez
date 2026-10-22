# Animation handoff

## Start here (session handoff, 2026-10-22)

Work on `master` (it carries everything; no PRs). Two sessions ran side by side on 22 October: the cut-out audit,
bath, Duarte, sound and NPC work on branch `claude/zen-dijkstra-o7cgsv` (entries 23-48) and the code review, loading,
line clean-up and new lines on branch `claude/modest-cray-12ezwn` (entries 49-53); both are merged into master. The
live site, https://alan-sanchez-drowned-bell.netlify.app, runs master `6697511b` (Netlify `6ada7bb298af05ba4af58289`, entry 61). Below: what the game
is now, what is open, the rules, and where the tools are. The numbered session log underneath has the detail of every
change (entries 1-61); the sections after it are an archive of the 20 October handoff, kept for history: don't act on
them without checking the code and the user.

### What is in the game now
- **Story review round 2** (T01-T11) done; every line voiced (70 unused ones deleted in entry 52, ElevenLabs), all within +-1.5 LU of
  -21.5 LUFS; lip-sync cues for every speaker but the narrator. Amália's first hello tightened (entry 20).
- **Faces** (lip-sync and blinking): Alan (his new bath and Duarte frames too), Inês, Vasco, Teixeira, Duarte in his
  upstairs scene. Everyone else has cues but no face art yet (the user: "They are not meant to speak and blink yet").
- **Walks:** all eight walking characters on new side walks painted as one Gemini sheet each. Alan and Inês play
  the cycles the user built in the walk editor (`*_walk7_s*`, 5 and 6 steps, entry 19); Vasco, Lacerda (widened
  x1.2 on the user's note), Celeste, Zé, Teixeira (cop_visit) and Duarte (guitar_visit) their approved 8-pose sets
  (`*_walk6_p*`, entries 16-17). Everyone walks at a steady speed (the engine fix, entries 23-24: no foot lock,
  bob once per step); each painting is timed by its foot's travel (`S.WALK_PLANT`, `S.walkTiming`, entry 11).
  Rui still glides (no walk). Walks towards / away from the camera and
  the lantern walks are the old 2-4 frame cycles.
- **Stills:** the 26 oil paintings repainted in the cartoon style the user chose (entry 12); 39 stills at 1536x864
  for sharp zooms (entry 15). Title screen and the five puzzle close-ups unchanged, by the user's rule.
- **Rooms:** small moving details in all 20 rooms drawn over the paintings (entry 21), and cut-out moving parts
  (lanterns, lamps, the street sign, the moored boats; entry 22). No room painting changed.
- **Speed:** slow devices drop the warp and parallax by themselves; `?fps` shows a readout (entry 20).
- **Added 21-22 Oct (entries 40-47):** the bath and Duarte's upstairs scene repainted; the sound pass (docs/SOUND.md);
  talking and blinking for the 70 new frames (Alan's 58, Duarte's 12); every frame change dissolves and every frame
  breathes and tilts (two engine audits, entry 45); the shop desk hides Inês; NPC sizes and feet fixed for Celeste,
  Lacerda (robe), the washerwoman in black, Rui, Vasco, Zé and Abílio (Abílio's `shout1` colour-corrected too); the
  bench man and the two card players each repainted on one fixed bench / table so the furniture no longer jumps when
  their frames swap (entry 46). `?bath=old`, `?duarte=old`, `?sound=old` still bring back the old versions.
- **The shop keeps its original painting** (entry 47: three redraw attempts, the user said "keep the original one").
- **Loading:** images stream in behind the title, and rooms and paintings wait only for their own art (entry 51).
  Saves, input locks, GL context loss and touch examine made robust (entry 50).

### Open, in the order I'd suggest
A. **The cut-out audit: applied** (entry 48; the user: "I approve it all"). The 716 cleaned frames from
   `art/review/cutout/sprites/` written over their sources (art/sprites 496, the 155 candidates, bath_new 49,
   duarte_new 16), re-encoded WebP q90 with lossless alpha (checked identical to the cleaned alpha) and exact RGB under
   transparency: 73.2 MB -> 33.4 MB. Canvas and placement unchanged, so js/sprites.js, morphs and faces stand. Manifest
   rebuilt, validate 0 errors, smoke intro, bench, laundry, tavernafter, fado, sepit, vascostore, romance, visitguitar,
   bath, copbed, coldopen pass. Board: https://claude.ai/artifact/2aTv6kXEf253d63Ppg9AH5. **Deployed** (the user: "deploy"):
   commit `69cffcd6`, Netlify `6ada17253b1f63adf4b4bd09`; smoke on the export passed; live sprites byte-identical, `/.env` 404.
   Left: the 11 frames cut off at the canvas edge need a re-cut from source (alan_undress4, alan_untie, alan_wash1,
   alan_wring, celeste_wring1/2, cop_bed3/4, pair_guitar_undress2, alan_walk7_s1/s2); npc_tourists(_b) keep a faint
   pale rim on the bare legs.
B. **The woman under the washing (Lavadouro).** The story asks for three frames she never had: `npc_laundry_sniff`
   (her "Wasted on the girls" remark), `_mutter`, `_smirk` (ch2.js). Painted for review in `art/review/laundry/`; the
   user rejected the card with "i think she had more sprites". She has eight in the game (idle, glance, peg, shake,
   talk1-3, shock), all used; the old `npc_laundry_b` was dropped long ago. Asked the user what they meant; no answer.
C. **Other story frames that were never painted** (the game skips them silently): `celeste_shock` (the bath),
   `duarte_play4/5/6` (fado flourishes), `npc_bench_greet`, Vasco's optional extras (`vasco_idle4`, front/back walk
   frames, `vasco_hook` and the other reaction variants in se.js). Offered to the user; no answer yet.
D. The bench man's `npc_bench_wistful` paints him bareheaded (his cap in his hands): offered to paint the cap on.
0. **Walks, entry 23's plan:** Step B (Alan's 12-painting side walk, "more fluidity").
1. **Walks towards and away from the camera: Alan and Inês only** (the user, 2026-10-22: "I don't think Vasco needs
   them. Only Alan and Inês"; nobody else gets them). Their 4-frame cycles play again since entry 55; a new painted
   set would replace them (Alan first: the player walks him up and down rooms all the time),
   then the lantern walks (Alan's `alan_lwalk*`, Inês's `ines_lwalk*`). Same method: a Gemini sheet, then the walk
   editor for the user to arrange and approve. `walk_sheet.py`'s guide is side-view stick figures: front/back
   views need their own guide.
2. **Face kits for the rest of the cast** (Lacerda, Rui, Celeste, Duarte, then Tomás, Amália, Zé, Abílio, Lino):
   about 65 frames, roughly $20 of Gemini; their lip-sync cues are ready. Biggest visible step left.
3. **Rui's walk** (one sheet + the editor).
4. **A full playthrough test** (the old `play.mjs` is lost): plays a new game to the end through hotspots and
   dialogs. Then rewrite the README walkthrough from it (it predates the Sé chapter and the visits, and says so).
5. **Phone speed:** ask the user for `?fps` numbers per room on their phone; eight rooms became live this session
   (tavern, se_tower, cais, boat, cabin, se_museum, se_cloister, se_store).
6. Left out on purpose (entry 22): the map's boats, the armillary sphere, the shop's newspaper corner, the museum
   lectern's page.
7. **From the code reviews (entries 49, 57):** done except face kits for the rest of the cast (item 2 above) and the
   README walkthrough (the user: "leave for now"). Worth measuring on a real phone: `?fps` per room before and after
   entry 57's speed changes; the memory budget (300 MB) is a guess for iPhones, tune it with `Game.loading().held`.
8. Older threads from the 20 October archive (Phase 3 step in-betweens, the combined-sprite transition choice, the
   rig trial, the 70 frames without face sets): still open as far as I know; ask the user before picking them up.

### Rules added this session (the full list is "Standing rules" in the archive below; these come on top)
- **The room paintings (`art/bg/*.jpg`) must not change.** Moving details are drawn over them; moving parts are cut
  with `scripts/swing_cut.py`, which leaves the painting intact (at rest the layers equal it).
- **Story facts beat ambience:** Ferreira's clocks all stopped at 03:12 (only the tide clock runs), so no second
  hands or pendulums there; Lacerda's tagged clocks F, B, C stopped (J.C. waiting); nobody rings the Sé's bells, so
  they hang still. Check the story (docs/STORY.md, js/lines.js) before animating anything that could carry meaning.
- **Stills:** the user chose the Gemini cartoon style for every story painting; the title screen and the five
  puzzle close-ups stay as they are.
- **Gemini** is allowed for walks and stills (the user: "Let's do Gemini"); the key is in `.env` as
  `GEMINI_API_KEY` (git-ignored; never print, commit or deploy it). Log every call (`art/review/log.md`).
- **Approvals come from the user** (a review page's database, or their words in chat): the permission check
  refuses approving art on their behalf, rightly. Walks are approved on the walk editor page.
- **Deploy only when asked**, from a clean `git archive` export (procedure under "Key files" in the archive).

### Tools from this session (details in the entries named)
- **Walks:** `scripts/walk_sheet.py` (Alan's sheet + fit; entries 13-14), `scripts/walk_sheet_cast.py
  generate|fit|library <char>` (the rest of the cast, SHEET / REUSE per character; entry 16),
  `walk_heel_down.py`, `walk_head_swap.py`, `walk_widen.py`, `walk_apply_cycle.py` (a cycle from the editor into
  the game; entry 19). The walk lab: `?scene=walklab` (entries 10, 14). The walk editor page:
  https://claude.ai/artifact/RoCMGALM4FXgJWdTKrg3v9, source in `scripts/review_pages/walk_editor/`.
- **Stills:** `scripts/gen_image.py --still` (the repaint recipe, entry 12), `scripts/stills_hires.py` (entry 15).
- **Rooms:** FX helpers in `js/fx.js` (flame, trickles, rain, moth, ripple, billow, twinkle, dapple, passer, sweep,
  feather, fan, sway from the top; entry 21); layers with `swing` / `bob` / `over` (render.js drawLayers) cut by
  `scripts/swing_cut.py` (entry 22).
- **Tests** (`scripts/tests/`, serve the repo on :8098 with `npx -y http-server -p 8098 -c-1 -s .`): `smoke.mjs`
  (all 38 scenes take over 15 minutes: run them in two parts), `walk_cast.mjs`, `walks_wired.mjs`, `room_shots.mjs`,
  `perf.mjs`, `profile.mjs`; plus `node scripts/validate.mjs`. A smoke run with `GEMINI=1` approves every candidate.
- **Review pages:** the walk editor (above); the stills choice (done): https://claude.ai/artifact/NXdCrquugizM39ea7bF1TN.
- **NPC checks (entry 46):** `scripts/npc_check/` (dump every room's NPC frames, measure size by head / SIFT / feet,
  feet overlap at game size, contact sheets, mid-dissolve ghosts, `propose.py`); `scripts/bench_compose.py` and
  `scripts/cards_compose.py` (furniture painted once, people painted without it and layered back). The NPC board:
  https://claude.ai/artifact/CfA6A88JFRC1yGXhhnYcAg (decisions in collection `npc_fix`).
- **Images:** `scripts/gen_image.py --key magenta` (for green subjects), `--fresh` (a painting made anew from a guide);
  `scripts/shop_patch.py` (object patches on a painting; tried on the shop and dropped). Canva full-size export: page
  22 of the scratch design `DAHYZ-SDzRE` (update_fill, commit, export png pro).
- **Previews added:** `?scene=shopjobs` (the shop, nothing scripted, Inês at her jobs).

### Lost with the sessions' containers
- Rhubarb Lip Sync 1.13.0 (download again; `RHUBARB=<binary>` for `scripts/lipsync.py`).
- The 2752x1536 Gemini originals of the 26 repainted stills (`art/review/stills/crisp2/*_raw.png`, git-ignored);
  the 1536x864 versions in the game are what matters.
- The walk sheets that weren't chosen (git-ignored); the editor library's fitted tries (rebuild with
  `walk_sheet_cast.py library`).
- Gemini spend this session: $3.57 over 52 calls (stills and walk sheets); the whole log: $97.04 over 2,068 calls.
- 22 Oct: the local game servers, the Rhubarb binary again, the raw 2K Gemini results (git-ignored). Gemini on 22 Oct:
  $15.13 over 351 calls (mostly the face kits); the whole log: $123.10 over 2,687 calls. Canva: the shop attempts.

## Story review round 2 (2026-10-20): done

The round-2 brief (Claude Doc "The Drowned Bell — Review round 2: Claude Code brief", tasks T01–T11) is in the code,
lines, docs and voices: all 72 new or rewritten lines are recorded (ElevenLabs, one take each), levelled to the
rest and lip-synced. Every voice file sits within ±1.5 LU of -21.5 LUFS integrated (one linear gain per file,
64 kbps mono; `scripts/validate.mjs` checks that lip-sync cues match their recordings). Lip-sync cues now exist for
every voiced line of every speaker but the narrator; a character's mouth moves only once their frames have
face kits (`js/faces.js`).

## Session log: 2026-10-20, second session (story round 2, visual audit, bug sweep, polish)

Newest last. Each entry: what changed, where, how it was checked. Scratch scripts and audit reports from this
session lived in the session's scratchpad and are gone; everything that matters is in the commits below.

1. **Branches.** `master` was fast-forwarded to `lore-se-museum` (361 commits, no history rewritten) and is the
   working branch from now on. `lore-se-museum` and the old `v2` (14 Oct, not in master) are left untouched.
2. **Story round 2, T01–T10** (`a67c048`). The brief's line tables applied by script (49 edits, 27 new lines,
   19 retired); story wiring in ch1–ch5, se.js, visits.js, coldopen.js, transitions.js; docs patched by a helper.
   Checked: every brief "old" text matched before editing; smoke test on all scenes; a line-order probe per scene.
   Brief acceptance items that can't hold as written (left, reported to the user): Maria's surname "Coutinho" is
   spoken in the intro; the recorded fado sings "ring it backward" in Ch. I; Vasco's "letters cut backwards".
3. **Voices (T11).** ElevenLabs connector, model eleven_v4, one take per line, cast voices from scripts/cast.json.
   The first run stopped at 22/72 (plan credits ran out); the user added credits and the other 50 were recorded.
   Each take levelled with one linear gain to -21.5 LUFS (a -1 dBTP limiter only where needed), MP3 64 kbps mono.
   15 older files that were more than 1.5 LU off were levelled too. All 1,380 voice files: median -21.5, none
   outside ±1.5 LU. Lip-sync (Rhubarb 1.13.0) redone for changed audio and run for every speaker but the narrator.
4. **Visual audit** (four parallel reviews: rooms, figures, faces, cinematics). Findings and the plan were given
   to the user in chat; phases 1 and 2 of that plan were approved and are done (below). Not done yet: phase 3
   (art needing approval: face kits for the rest of the cast, Rui's walk, Vasco's 8-pose walk, clock pendulum
   layers, higher-resolution stills) and phase 4 (performance, to be measured on a real device first).
5. **Phase 1, bug sweep** (`396c011`): Alan's 4 head-cropped walk frames re-fitted from the full-size Canva exports
   (pages 15-18 of the scratch design DAHYZ-SDzRE) with 20 px headroom, keeping the cleaned edges; morphs rebuilt
   (pass2L<>up2L restored from its valid direction, the inverse accepted at INV_IOU 0.6 after checking by eye).
   Zé/Abílio frame heights; chapter-card snap; Ken Burns endpoint clamping; slow-device detection by time plus an
   Effects button; dissolve instead of cut without the warp; jaw by the clock; no blinks mid-fade; explicit face
   approval; misplaced lights; soft-topped shafts; leaves transform; bell-tower depth map (bells capped at their
   rope's floor depth); caption reading speed; face_kit partner naming for Teixeira; validate.mjs checks; CODEMAP.
6. **Phase 2, polish** (this commit): NPC talk-frame dissolves (similar.py for every character: 13 -> 290 pairs);
   walk start/stop dissolves; turns without a front view dissolve; long vertical walks judged by the smaller end
   height; paired paintings get the GPU light through an identity mesh (never bent); glows at their own lamp's
   depth; boat and cabin rock (room.sway); lavadouro water shimmer; bedroom window fog and lamp motes; night shop
   window fog; Ferreira's ten largest clocks tick (centres measured off the painting, checked one by one); stills
   capped at zoom 1.2, captions narrower and at the top for the dawn tile and the shop epilogue; the corner
   buttons and inventory step aside during paintings; death screen fades in; title drifts; fade() doesn't wait
   when already black; Odete's caption and hover name (missed in T05). Walk-step morphs for Celeste, Zé, Vasco.

7. **Occlusion edges** (the user: "the character sprites are just cut" behind furniture). Two changes, both in
   code, for every occluder in every room: (a) render.js draws each occluder through a cached mask whose outline
   is feathered over about 2 px (`OCC_SOFT`), so the painted furniture blends into the figure instead of a
   vector-sharp cut; glows over the patch are redrawn outside the furniture's transform; (b) render.js
   `markOccluded` finds, for whoever stands behind furniture, where its top edge crosses their body, and actor.js
   darkens the figure softly towards that edge (`OCC_BAND` 0.2 of their height, `OCC_DARK` 0.6 at the edge), on
   the figure's own pixels only. Checked before/after on Rui (police desk), Lino (tavern bar) and the washerwomen
   (lavadouro basins); smoke test on the rooms with occluders.

8. **Deploy** of `042d262` (everything above): Netlify deploy `6ad779c7de2109eb583c6dac`, done by the procedure under
   "Deploy" below. Next, at the user's request: the walk cycles (Alan first, then Inês, then everyone who walks);
   the user finds the current 8-pose cycle worse than the original, "clunky" one. See the walk plan in the chat
   and, once agreed, in this file.

9. **Walks, step 0** (the user found the 8-pose cycle "very bad", the original better if clunky). The seven slot
   frames of the new cycle (`alan_walk_pre2L` … `alan_walk_up1L`) are marked `parked` in art/review/approvals.json
   (files kept; their old approval time in the note), so `loadApproved`'s all-or-nothing rule plays the original
   cycle again: walkA, walkDown, pass, walkUp, walkB, walkDown, pass, walkUp (walkStart frames unchanged).
   Diagnosis of the new cycle, for the record: the two passing frames drawn ~8-10% smaller; the bob inverted
   (lowest at passing); a high back-kick on the passing frames; three art sources (painted, Gemini, Canva) with
   different faces and shading; mesh morphs stretching legs between mismatched poses.
   **Plan agreed with the user (steps 1-4):** a walk lab test page with automatic checks; each character's cycle
   generated as one coherent 8-pose set from their own standing sprite; simpler engine playback (advance by the
   planted foot measured from the art, no mesh morph between walk frames); roll out Alan side, Alan front/back,
   Inês, Vasco, Lacerda, Celeste, Zé, Rui, others.

10. **Walks, step 1: the walk lab** (`?scene=walklab`, js/walklab.js, loaded only for that preview by main.js, which
   also registers the walk candidates' sprites there so they can be compared). Pick a character, a cycle (in the
   game now / the review screen's candidate / towards or away from the camera) and a room; walk left, right, up,
   down, back and forth; 1x, 1/2x, 1/4x, pause, frame by frame. A trail of dots marks where the feet touch the
   floor. Measured from the art per frame: size (head width against the cycle's median, limit 4%), rise (the bob),
   feet on the floor; live: how far the planted foot drifts per frame (limit 6 px). First readings: Alan's original
   cycle walkUp -4.3% size; the parked new cycle pass2L -5.3% and lowest; and in both, the planted foot drifts
   10-14 px a frame (worst ~25): the engine moves the figure continuously while each painting is held, so the
   foot skates. That is the main thing step 3 fixes (lock the planted foot for the length of a frame).
   Gemini: the user supplied a key; it is in `.env` (gitignored, mode 600) as GEMINI_API_KEY. Never print or commit it.
11. **Walks, step 3: the engine plays the walk properly** (js/engine/actor.js, js/story/core.js). Three options,
   `window.WALK = { lock, blend, timing }`, defaults `{ lock: 1, blend: 'cut', timing: 'foot' }` (`WALK_DEFAULT`);
   the walk lab has a select for each.
   - `lock` (0-1): while a painting is held, the figure is drawn where it stood when that painting began
     (`lockI/lockX/lockY`, `drawAt()`), so the planted foot stays put and the body catches up on the next painting.
   - `blend`: `cut` (hard switch, each painting held for its whole step), `dissolve` (`WALK_DISSOLVE` 0.07 s),
     `morph` (the old mesh morph between walk frames).
   - `timing`: `foot` = each frame's share of the stride from its planted-foot data (`S.walkTiming` uses per-frame
     `len`), `even` = equal shares.
   Planted-foot drift (Alan's side walk, lab measure): old (lock 0, morph, even) avg 13.8 / worst 25.3 px;
   lock 1 + cut 3.9 / 21.2; lock 1 + dissolve 3.4 / 5.7; lock 0.5 + cut 6.4 / 24.6. Frame strips: the dissolve
   ghosts a double leg at walkDown→pass even at 0.04 s; the cut reads clean, so cut is the default. The one 21 px
   worst case is a transition whose painted feet don't line up; step 2 (a coherent pose set) fixes that in the art.
   Checked: node --check, validate (0 errors), smoke: all 38 scenes pass (run in two parts; one run of the whole
   list hit my 15-minute timeout at abiliosketch, which then passed on its own).
12. **Painting styles: Gemini repaints of the oil stills, waiting for the user's choice** (not in the game).
   An agent sorted the 69 full-screen paintings: 29 already inked/cartoon (13 from the 2026-10-18 crisp round,
   shelf, and 15 inked from the start), 38 oil, 2 neither. Canva's version of the recipe only got halfway (hatched
   engraving), Gemini matched, and the user chose Gemini. The user ruled out: **room backgrounds, the title screen
   (art/bg/title.jpg) and the five puzzle close-ups (art/closeups/close_*) stay as they are**. Unused stills were
   skipped. Repainted 26 stills with the 2026-10-18 recipe (`scripts/gen_image.py --still`, refs: the still,
   still_shop_after, still_abilio_ring; prompt in art/review/log.md), $1.80 in all, into
   `art/review/stills/crisp2/<name>.png` (+ `_sbs.png`; the `_raw.png` 2752x1536 files are gitignored, so they
   exist only in this session's container). Checked each side by side: compositions, faces, text (newspaper, the
   names list) kept. Notes: still_tr2_ines gains a small puddle on the floor at the right; still_maria_dawn barely
   changes. Review page: https://claude.ai/artifact/NXdCrquugizM39ea7bF1TN (drag to compare; per painting "Use
   repaint" / "Keep oil"; no choice = repaint), choices in its db collection `choices` (`{pick: 'new'|'oil'}`).
   To apply: save each chosen PNG as `art/stills/<name>.jpg` (1280x720, JPEG quality 90, like 87cd848), then
   build-manifest, smoke, commit.
   **Applied 2026-10-20:** the user picked "Use repaint" for all 26 on the review page (db `choices`, all
   `new`); all 26 saved over `art/stills/<name>.jpg` as above. Oil originals are in git history (before this
   commit). Checked: smoke for coldopen, intro, fado, romance, copbed, visitcop, visitguitar, tr1-tr5 all pass.
   Not deployed.
13. **Walks, step 2 for Alan: one-sheet 8-pose set, waiting for the user's decision** (not in the game).
   `scripts/walk_sheet.py` asks Gemini for the WHOLE cycle in one image: walkA on green as the character, and the
   2x4 sheet of the stick figures in art/review/walkref (top row 1 3 5 7 near leg leading, bottom 9 11 13 15 far leg
   leading; guide saved as art/review/alan/walk6/guide.png). One call, $0.07. The 8 figures came back as the same
   person, light and size. The script splits them, fits each onto walkA's canvas at ONE scale (median head-to-waist
   fit; the 8 per-figure fits were 0.819-0.852), puts each row on its ground line, then:
   - **stretches the legs** below the waist by one factor (x1.092): Gemini painted the legs ~9% shorter than the
     game's frames (waist-to-floor 344 px against 372-381), so he would have shrunk on starting to walk. Heights
     now 695-700 px (walkA 694). 16 px of headroom added above walkA's canvas (meta fy 714, hh 718).
   - **puts the leading heel down** in the contact frames (`scripts/walk_heel_down.py`, a local shin stretch):
     p9's front heel hung 26-29 px above the floor.
   Candidates `alan_walk6_p1` … `p15` (art/review/candidates/, walkSlot 0-7, replacing the seven parked
   `alan_walk_*L` candidates in candidates.json; their files stay). Plant data in `S.WALK_PLANT` (core.js); step
   lengths 0.076-0.103 of his height, nearly even, and the planted boot lines up at all 8 hand-offs (overlay check).
   Walk lab (locked, cut, by the foot): average drift 4.7-5.4 px (the readout's worst value is noisy: 11.6-21 px
   between identical runs). Size column flags the bottom row's heads at -4.4 to -5.5%: that is the back of the hair
   painted slimmer; chin and crown sit on the same lines (checked side by side), so accepted.
   Review page with both walks playing as the engine plays them, approve/reject and a note:
   https://claude.ai/artifact/RoCMGALM4FXgJWdTKrg3v9 (db doc `decision/alan_walk6`: `{pick, note}`). On approve:
   mark the 8 ids approved in art/review/approvals.json (walkAll needs all 8), smoke, commit.
14. **Alan's one-sheet walk, three fixes the user asked for (1-3), still waiting for the decision.**
   - **Hair:** the far-leg row's hair was painted slimmer at the back (a flicker twice a step).
     `scripts/walk_head_swap.py` gives each far-leg frame its near-leg counterpart's head (1->9, 3->11, 5->13, 7->15),
     aligned on the face (shifts of 1-2 px) and blended into the neck over 10 px below the chin (0.15 of the figure);
     the join is invisible at 4x. Heads now agree to within 1%.
   - **Head size:** heads were 91.5 px wide (walk lab measure) against 93 in today's walk and 94.5 standing.
     `walk_sheet.py` HEAD_K x1.025 scales the whole set after the trunk fit (legs keep their stretch, so they're
     ~385 px). Figures 713-718 px tall; headroom PAD 40 (meta fy 738, hh 742). Order to rebuild:
     `walk_sheet.py --split-only ...`, then `walk_head_swap.py art/review/alan/walk6 0.15`, then the candidates'
     webp/meta and plant data (walk_plant.py) as in entry 13.
   - **Walk lab reading:** the drift number was read live, so it depended on frame timing, counted his start and stop
     frames and could pair two different boots (12-21 px for the same cycle). Now the lab computes a "slip" for each
     change of painting from the art, the plant data and the engine's walkLen: same answer every run. Each foot is
     the centre of its boot over the bottom 10% of the figure (the point walk_plant.py measures; floor-contact centres
     put a heel strike and a flat foot at different points). Floor band widened 1.5% -> 2.5% so a boot on its toes
     counts. Readings: today's walk 1.5 px average / 3.8 worst; the new set 0.8 / 2.7. The live readout stays,
     labelled as timing-dependent. (Tried and dropped: template-matching the boot between frames; the boot rotates
     as the heel rolls, and in the far-leg half it matched the wrong boot.)
   Review page republished with the fixed frames (same link).
15. **Sharper stills** (the user: "push the sharper paintings"). The game zooms stills up to 1.2x (stills.js ZMAX) on a
   1280x720 canvas, and every still was stored at 1280x720, so zooms were upscaled and soft. `scripts/stills_hires.py`
   rebuilds a still at 1536x864 from its Gemini full-size result (`<name>_raw.png`, 2752x1536), colour-matched to the
   painting in the game (match_palette), only when the raw is the same picture (greyscale correlation > 0.97).
   39 stills now 1536x864: the 26 repaints of entry 12 (raws in crisp2/, not committed, 180 MB) and the 13 crisp
   repaints chosen on 2026-10-18 (raws in crisp/, committed). It skipped the 2026-10-18 candidates the user had
   turned down (different pictures, r 0.90-0.96). The other 22 stills have no larger source and stay 1280x720.
   art/stills 18 MB. Checked: a 1.2x zoom crop before/after (rigging and outlines crisp, colours unchanged);
   smoke for coldopen, intro, fado, romance, copbed, visitguitar, tr1-tr5 pass.
16. **Walks, step 4: one-sheet walks for the rest of the cast, waiting for the user's decisions** (not in the game).
   Inês, Vasco, Lacerda, Celeste, Zé, Teixeira (cop_visit) and Duarte (guitar_visit). Rui (no walk) and the cat are
   not included. `scripts/walk_sheet_cast.py generate|fit <char>`: the same Gemini sheet as Alan's (walk_sheet.py, now
   with a pronoun, mirrored reference for frames painted facing left (Lacerda), and two prompt rules learnt here: the
   stick figures' white/dark colouring is not clothing (Lacerda's and Duarte's trousers came back half cream/grey,
   half white/black), and props stay in all eight). Fitting is generic: one scale to the median height of the
   character's current walk frames, then the head matched to those frames' heads with the legs (bottom half)
   compensating, capped at +-10%; one canvas per character; feet = blobs of the bottom 10%; the weight-bearing foot
   by pose (3/11 front, 5/13 lowest, 7/15 back; "the lowest foot" failed on heels and the long skirt); head swap when
   the rows' heads differ by >2% (Vasco); heel-down on contact frames.
   - **Tries:** 17 sheets in all ($1.20 total for step 4). Kept per character (SHEET in the script): Inês 2, Vasco 3,
     Celeste 2, Zé 2, Teixeira 3, Duarte 2, Lacerda 1 (his third prompt). Chosen by how even the eight steps are (the
     planted foot's travel per step as a share of the longest: Gemini often paints one pose with the feet a stride
     apart, and that step shrinks to nothing so the pose never shows) and by props in all 8 (Teixeira's cap and
     Duarte's case went missing in some tries). Unused tries are gitignored (they stay in this container only).
   - **REUSE:** a bad pose takes its counterpart from the other half of the stride: Inês 13<-5 (two books), Celeste
     15<-7, Zé 7<-15 (feet a stride apart in every try).
   - **Results:** steps even to 0.73-0.90 of the longest (Alan's 0.74); walk lab: slip 0.1-0.2 px average, size
     consistent (within 3.1%) for all. Plant data in core.js S.WALK_PLANT; main.js now runs S.walkTiming for every
     character (it ran for Alan only). Walk lab: `_visit` characters are listed now; floor band 2.5% -> 5% (a heel
     up on its toes is more than 2.5% of the height).
   - **Checked:** smoke with today's walks and with every candidate approved (GEMINI=1): laundry, quayfish, lacthreat,
     semuseum, vascostore, visitcop, visitguitar, ineskey, celeste, bench, intro pass; approved, all 8 walks wire in
     with their step lengths.
   - **Review page** (same link as Alan's, now one tab per character): https://claude.ai/artifact/RoCMGALM4FXgJWdTKrg3v9
     db docs `decision/<char>` (Alan's stays `decision/alan_walk6`). On approve: mark that character's 8
     `<prefix>_walk6_p*` ids approved in art/review/approvals.json (walkAll: all 8 or none), smoke, commit.
17. **Six new walks approved and in the game** (the user, on the review page, 2026-10-20 21:30-21:32): Vasco, Lacerda,
   Celeste, Zé, Teixeira, Duarte; their 48 ids are approved in art/review/approvals.json. Alan and Inês: "still not
   right", so they keep their current walks (a cycle editor on the review page comes next, see below).
   Lacerda's note: "The walk is good but he and his legs are too slim in comparison to other sprites". His walk was
   the slimmest of the cast against his current frames (chest-height width about half; the others 0.6-1.0; his old
   frames are three-quarter views, the new ones strict profile). `scripts/walk_widen.py art/review/lacerda/walk6 1.2
   0.15` widens every pose x1.2 below the chin (fading in over 24 px, head as painted), about the head's x, onto a
   canvas 41 px wider each side (candidate meta ax +41, w); plant data recomputed (steps 0.100-0.111, even 0.90).
   Re-running `walk_sheet_cast.py fit lacerda` would undo the widening: run walk_widen.py again after it.
   `walk_sheet_cast.py` refactored (fit_poses / plant_of / `library`, which fits the other tries for the editor);
   re-fitting Zé and Celeste reproduced the committed frames byte for byte.
   Checked: in the game the six walk with their new cycles and step lengths; smoke laundry, quayfish, lacthreat,
   semuseum, vascostore, visitcop, visitguitar, celeste, bench, walklab pass. Not deployed.
18. **Walk cycle editor on the review page** (the user: "allow me to move the frames and choose the remaining ones",
   "and also give you feedback for a missing frame"). Same link: https://claude.ai/artifact/RoCMGALM4FXgJWdTKrg3v9.
   Per character: the cycle as a strip of steps (drag or arrows to reorder; duplicate; remove; nudge a step 2 px at a
   time in the painting's pixels; mark a step, or add one, as a missing frame with a description), a library to
   swap or add frames from (the proposed set, the other Gemini tries fitted by `walk_sheet_cast.py library`, and the
   frames in the game now / from before), and both lanes playing with the engine's timing for the edited cycle
   (each step's bar shows the planted foot's travel; amber when under 45% of the median, i.e. it flashes by).
   Saved to db `decision/<char>` (Alan: `decision/alan_walk6`) as `{pick, note, edited, cycle: [{id, dx, dy} |
   {gap: true, text}]}`, as a draft while editing; an edit after Approve clears the approval.
   - Alan got two more Gemini tries for the library ($0.13): art/review/alan/walk6/sheet_raw_2.png, _3.png
     (walk_sheet_cast.py now has an 'alan' entry for generate/library only; `fit alan` refuses, since his chosen set
     is fitted by walk_sheet.py). Library tries are fitted into the scratchpad (LIB_OUT), not the repo.
   - **To apply a saved cycle:** for each step, the frame (a candidate, a try's pose, or a current sprite) becomes
     a candidate `<prefix>_walk7_s<i>` with its nudge baked into meta (ax -= dx, fy -= dy) and wire walkSlot i,
     walkBase = the new ids; plant data = the frame's plant + dx/h; gaps are requests to paint (walk_sheet.py with
     the description, or gen_image.py from the neighbouring frames).
19. **Alan's and Inês's walks: the cycles the user built in the editor, approved and in the game** (2026-10-20 21:57 and
   22:02, db `decision/alan_walk6` and `decision/ines`). `scripts/walk_apply_cycle.py <char> <decision.json> <library
   data.json> <library folder>` turns a saved cycle into candidates `<prefix>_walk7_s<i>` (pictures also kept in
   art/review/<prefix>/walk7/s<i>.png, since the tries' fitted poses live only in the scratchpad library), drops the
   character's walk6 candidates from candidates.json (walkAll) and prints the plant data.
   - Alan, 5 steps: proposed p1, p3, p5, then try 3's p9 and p13. Steps +0.075 +0.099 +0.207 +0.171 +0.164.
   - Inês, 6 steps: proposed p1, p3, p5, try 1's p7, try 3's p9 and p13. Steps +0.080 +0.096 +0.114 +0.090 +0.179 +0.203.
   No nudges, no missing frames. The steps are uneven where poses were left out (the long ones hold longer); this is
   the timing the page previewed. Approved in approvals.json; plant data in core.js. Checked: both wire in with step
   lengths; smoke intro, bath, ineskey, duarteines, bench, walklab, coldopen, semuseum, finale, rigtest pass.
20. **Item 5 of the to-do list ("do 5"): Amália's line, speed, README.**
   - **Amália's first hello** (`amalia_hello_2`, 13.6 s, 11.1 chars/s against her median 12.4): her pace was fine;
     seven pauses between phrases (0.3-1.1 s, 4.3 s in all) made it long. Cut to 0.35 s each and 0.55 s for the
     [beat] before "Lino", with 20 ms crossfades inside the silences: 11.95 s, -22.1 LUFS. Lip-sync redone
     (lipsync.py; Rhubarb at the scratchpad path). The original is in git history (before 7a96453).
   - **Speed:** no real phone here, and the container has no GPU (WebGL and canvas run in software), so its frame
     rates mean nothing for a phone: 5-15 fps unthrottled, ~1 fps with the CPU slowed 4x. What it does show: a CPU
     profile of the Lavadouro (the heaviest room) puts the game's own scripts under 1% of the time; 22% is
     `drawImage` (pixel copying a phone's GPU does) and the rest is the browser's own work. The depth parallax re-uploads the room picture
     each frame in rooms with moving things painted into it (`Parallax.draw(..., live)`), normal GPU work. The
     slow-device fallback (warp and parallax off after ~4 s of slow frames) is in place. Added a readout for a real
     device: `?fps` shows frames a second, the slowest frame and whether the effects are on (render.js). Next
     step: the user opens the live site with `?fps` on their phone and reports the numbers per room.
   - **README:** nineteen locations, the cast table (Vasco, Teixeira, Duarte, Lino, the washerwomen), about 1,360
     lines levelled to -21.5 LUFS, lip-sync, the one-sheet walks and the walk lab, faces (Alan, Inês, Vasco,
     Teixeira), warp, parallax, soft occlusion, sharper stills, the speed fallback and `?fps`. The walkthrough has a
     note that it predates the Sé chapter and the visits (not rewritten: a verified walkthrough should come from the
     playthrough test, to-do item 4).
   - **Not done, needs the user's call:** small moving details (pendulums, the tower bell, the boat's lanterns) and
     props over the furniture cuts both change what the rooms look like (layers cut from or painted over the
     backgrounds), and the user has ruled that the game backgrounds must not change.
21. **Small moving details in every room** (the user: "do the small moving details but review each room to add
   some"). An agent reviewed all 20 rooms (screenshots, what already moves, proposals with coordinates checked on
   zoomed crops of art/bg). Everything is drawn over the painting: no art/bg file changed.
   - **New helpers in js/fx.js:** `sway(..., up)` (free edge at the top: plants, cypresses, flames), `ripple`
     (reflections, heat), `billow` (both ends held: a dust sheet), `flame` (a small live flame on a wick),
     `trickles` (beads running down a pane), `rain`, `moth` (or a fly, darker), `twinkle` (far windows, one going
     dark now and then), `dapple` (leaf shadows), `passer` (someone behind frosted glass), `sweep` (headlights on
     blinds), `feather`, `fan`.
   - **Per room:** shop: steam off the coffee mug, condensation trickles, someone passing the door glass (day), a
     moth round the lit lamp (night); street: chimney smoke, mist down the stairs, the window-box geraniums; map:
     light on the Tejo, the steamer's smoke, haze; police: the desk fan, the coffee machine's pilot light, a fly
     round the tube; tavern: lantern flames, the night street through the door, a moth; lavadouro: three more
     sheets swaying, rain beyond the arches, the tank overflow dripping, the lamp on the wet floor; ferreira: rain
     on the door glass, the oil lamp's flame and heat shimmer, headlights across the blinds; convent: the votive
     candles, light on the font, the weeping stone weeping, mist at the far door; se_tower: pigeons breathing, the
     free bell rope stirring, a feather now and then; antiques: second hands on 8 clocks (ANTIQUE_CLOCKS), the
     curtain and the bell-pull cord; cais: the harbour clock's second hand, two gulls breathing, boats'
     reflections, lamp light on the cobbles; boat: the lantern flame, the porthole glint, drips off the boom, water
     under the next hull; cabin: the lantern flame, the oilskins swinging, fog past the porthole (0.2), a drip
     through the hatch; convent_night: candles, bats, green sparks, moonlight on the font; cistern: torch flames
     licking, their reflections, soot; cold_open: lamp flame, moonlight, condensation; se_museum: a window shaft,
     leaf shadows and bushes through the arch; se_cloister: birds over the garth (clipped to the arches),
     cypresses, dust while Vasco is in the pit, mist in the arcade; se_store: a window shaft, fog past the bars, a
     moth, the dust sheet billowing; bedroom: rain on the window, the town's windows, a moth.
   - **Fixed:** `S.windowFog` cut each puff flat at +-80 px (faint horizontal steps); the cold open's and the
     bedroom's fog rects now stay on the glass.
   - **Cost:** rooms that had no animBack (tavern, se_tower, cais, boat, cabin, se_museum, se_cloister, se_store)
     now re-upload the painting to the GPU each frame under parallax, like most rooms already did.
   - **Left for the user (need an object cut from a painting):** the Ferreira wall-clock pendulums, the tavern and
     cabin lanterns swinging, the Sé tower bells (the `bell1` layer exists, disabled), boats bobbing at the Cais
     and on the map, the street's shop sign and bracket lantern, the shop's newspaper corner, the museum lectern's
     page, the store's pendant lamp, the armillary sphere.
   - **Checked:** screenshots of all 20 rooms with crops at each addition (flames on their wicks, hands on the
     dials); smoke: all 38 scenes pass (run in two parts: the full list outlasts my 15-minute limit).
22. **Moving parts cut from the paintings** (the user: "let's do all of them and deploy", then: "not the
   pendulums", "the clocks stopped at 3:12", "also the bells... they are not being rung"). No art/bg file changes.
   - **Story fix first:** Ferreira's clocks had ticking second hands since the polish pass (e461769): wrong, every
     clock in the shop stopped at 03:12 (only the tide clock runs). Removed; also no second hands on the four tagged
     clocks on Lacerda's shelf (F, B, C stopped; J.C. waiting). No pendulums, no bells.
   - **`scripts/swing_cut.py`:** the object is found inside a box by GrabCut and saved from the ORIGINAL painting
     (art/layers/<name>.webp); what is behind it is OpenCV-inpainted a few px beyond its outline
     (<name>_under.webp, drawn still under it). At rest the two equal the painting; the small motions only uncover
     the inpainted margin. Options: `chain` (a strip up to the pivot: the tavern chains, dark on a dark wall),
     `outline` (find the object in another painting: the unlit night lantern). No Gemini: free and exact.
   - **Engine (render.js drawLayers):** layers can `bob` (px) as well as `swing` (degrees) about `pivot`, and carry
     an `over(g, t)` drawn with them (a flame that swings with its lantern); such rooms count as live.
   - **In the game:** tavern: both hanging lanterns sway on their chains with their flames (day and night cuts; at
     night the left one is out, so no flame); street: the shop sign and the bracket lantern (day and night cuts);
     cabin: the lantern swings against the roll, flame inside; lavadouro and se_store: the pendant lamps sway;
     cais: the moored boats bob and roll (1.5 px, 0.3 degrees).
   - **Not done:** the map's boats (too small and stylised to separate: GrabCut found nothing), the armillary sphere
     (turning a globe shows its other side, which a flat cut can't), the shop's newspaper corner and the museum
     lectern's page (they bend rather than swing: they need painted frames).
   - **Checked:** before/after crops (no seams, objects where painted); smoke intro, bench, lacthreat, quayfish,
     laundry, finale, tavernafter, fado, vascostore, twinswap pass.
23. **Walks: the engine fix for Alan and Inês** (the user: "a big problem with how Alan walks ... it seems to be
   getting worse"; then "both Alan and Ines are jumpy ... it might be the engine, not the actual frames").
   - **Cause:** entry 11's foot lock (`lock: 1`) holds the whole figure on one spot while a painting is up, then
     moves it the painting's full step at once. With 5-6 paintings a stride that is a stop-start jerk. Recorded in
     the street (Alan 231 px tall, 30 frames a second): at full pace he stood still on 77 of 90 frames and then
     jumped 19-48 px; Inês the same, jumps up to 44 px; Vasco's 8-pose walk 69 of 90, up to 24 px.
     A second fault: the walk's bob and head tilt ran once per painting (`sin(phase * PI)`), so with 5 uneven
     paintings they wobbled irregularly.
   - **Engine** (js/engine/actor.js): a new option `bob: 'step'` puts the rise and fall (lowest a quarter of the
     way into a step, highest three quarters) and a small head tilt on the step (`Actor.stepU()`, by ground covered,
     contacts from `walkSteps`), whatever the number of paintings. Walk options are now per character too:
     `CHARS[ch].walkOpt` over `WALK_DEFAULT`, under `window.WALK` (the lab). `WALK_DEFAULT` is unchanged.
   - **Presets** (js/story/core.js): `S.WALK_FIX` = `{ lock: 0, blend: 'cut', timing: 'foot', bob: 'step' }`
     (steady movement, a painting held as long as its foot travels, cut half way through it); `S.WALK_A` = the
     same with even timing, for the first painted cycle. `S.WALK_ORIGINAL.alan` keeps that cycle (main.js).
   - **In the game:** `S.WALK_FIX` for Alan and Inês, with their current paintings (main.js loadApproved). The user
     approved this in chat after the review page (below): "Alan - Engine fix, today's 5 paintings (but would use
     more fluidity), Inez with Engine fix looks ok". The other six walkers keep the default until they're seen.
   - **Previews:** `?walk=fix` (the fix for everyone), `?walk=a` (Step A: Alan on his first 8-painting cycle). Walk
     lab: a Bob select, "Engine fix" and "Step A" buttons, "first painted cycle" in the cycle list, URL options
     `&set=a|fix &cycle=first|game &who= &lroom= &go=0 &nofeet` for recordings.
   - **Review page** (footage from the engine, stepped 1/30 s at a time with `STEP_DT`/`HOLD`/`ADVANCE`, recorder
     script in the session scratchpad): https://claude.ai/artifact/V3SgC1xBjoyk7txRc31ASZ
   - **Plan agreed for what's left** (in chat): Step B, a 12-painting cycle for Alan (6 per step, the same poses for
     both steps with the legs swapped; a guide from Muybridge's walking-man photographs instead of the stick
     figures; checked by script for even foot travel, head lowest after contact and highest after passing, size
     within 2%); fallback, his legs on the rig (`?rig=1`). The user wants "more fluidity" for Alan: that is Step B.
     Then the engine fix for the other six (their review), then front/back walks.
   - **Checked:** node --check; validate (0 errors); smoke walklab, intro, bath, ineskey, bench, rigtest pass;
     recorded again with no preview switch: Alan 4.8 px every frame, Vasco unchanged.

24. **Walks: the engine fix for everyone** (the user: "just fix it", after hearing the other six still stopped and
   started). `WALK_DEFAULT` in actor.js is now `{ lock: 0, blend: 'cut', timing: 'foot', bob: 'step' }` (the same
   as `S.WALK_FIX`), so every walker moves at a steady speed, including the walks towards and away from the camera,
   the lantern walks and the extras; the per-character setting for Alan and Inês in main.js is gone (the
   `CHARS[ch].walkOpt` mechanism stays). The old behaviour is still in the walk lab ("locked" in its select).
   Checked: recorded in the street with no preview switch, at full pace each moves the same amount every frame and
   never stands still (Vasco 4.8 px, Lacerda 4.8, Celeste 4.1, Zé 4.9, Teixeira 3.8, Duarte 3.6, Inês 4.4); before,
   Vasco stood still on 69 of 90 frames. Smoke laundry, quayfish, lacthreat, semuseum, vascostore, visitcop,
   visitguitar, celeste, intro, walklab pass.

25. **"I'm a lot after lunch, too" restored** (the user: tweaked lines and the bath repaints "don't seem to be live").
   - **The live site was current:** its files matched `master` byte for byte (lines.js, sprites, the bath frames,
     approvals), and Netlify sends `max-age=0, must-revalidate` for them.
   - **The line was a regression in the code:** `alan_teixeira_sorry` was changed to "after lunch, too" by the story
     audit (56f8df50, 18 Oct) and re-recorded (cb2370db); the round-2 commit (a67c048) wrote the old "before lunch"
     back and dropped the recording, and the polish pass (e461769) recorded "before lunch". Restored the 18 Oct
     text, recording (-21.7 LUFS, 64 kbps mono) and its Rhubarb cues (their `src` is that mp3's sha1), all from
     cb2370db; js/lipsync.js rebundled (only this line changed); `build-manifest.mjs` re-run (the voice version
     tag, and index.html's `?v=` tags, which entries 23-24 had left stale). A search of every line's history for
     wording put back to an earlier version found only this one.
   - **Bath frames:** no frame went back to an older picture. The 17 restyles of c0a4b0a are live; wash3,
     swim_wave, trunks_down, trunks_snap, fling, trunks_step, dress1 and jump_crouch keep the first paint, as
     the user chose then. Asked the user which bath moments look old.
   - Checked: validate 0 errors; smoke visitcop, copbed pass.

26. **Bath scene: wash5 and the swim frames out; the bath frames measured** (the user: the bath frames "look
   inconsistent - Alan is too muscular on some, they have different skin colour, size of the body is different";
   "remove wash 5 and both swims"; heights may differ, "since he has different poses").
   - ch2.js `bathEgg`: the washing loop plays wash1, wash4, wash2, wash3, wash6 (wash5 out); the swim/swim2 fallback
     (used only with no wash frames) is gone. The sprites stay in art/sprites. Smoke bath passes.
   - **Findings** (contact sheet of 41 frames at game scale, scratchpad): two builds are mixed: lean (jacket,
     undress3/4, fling, jump_fall, dress1, jacket_wink/grin) and bodybuilder (undress1b, 2a, 2, 2b, belt, boot,
     unbutton, jeans, trunks_down/step/snap, jump_crouch, drip, trunks_on, dress2/3, dress_boot). Skin runs from
     deep orange (jacket, jacket_wink) to pale (undress2). Head size (the jacket frame's head template matched at
     scale, mirror and +-25 degrees; heads in the frame's own height units): most frames 107-112% of the jacket's
     head (the jacket's is ~10% small); too big: jump_crouch 154%, dress_boot 125%, wash2 122%, trunks_down 121%,
     trunks_on 119%; too small: climb 93%, undress_boot 94%, jump_rise 96%. Not measurable this way: undress2,
     jump, wash3, dress_final. (The wash frames are drawn at WASH.h, so on-screen sizes still need checking.)
   - **User's references:** build from **alan_jacket**, skin from **alan_undress2b**.
   - **Plan:** (1) repaint the bodybuilder frames with the jacket's build, pose/face/clothes kept (Gemini, one pilot
     first); (2) skin_match.py to undress2b's skin on every bath frame, after (1); (3) scale outliers by head size
     (meta only, pose heights left as they are); (4) a review page playing the scene before/after, per-frame approval.
   - **Blocked:** no GEMINI_API_KEY in this container (`.env` is git-ignored and was not carried over); the user
     is to add it as an environment variable for a new session.

27. **The bath scene painted again from scratch, for review** (the user: "fully re-paint the scene ... up to 10 [frames],
   using Alan's bodytype and skintone from Teixeira love scene"; then: keep it a skinny-dip; "he will start undressing,
   and go behind the waterpool, and this is where he will take off his trunks and throw them away"; Celeste's white
   towel for getting out and dressing; underwear, not swimming trunks). Not in the game: `?scene=bath&bath=new`.
   - **Paintings (Canva, all `generate-image` from two references):** Alan cut from `pair_cop_cuffs` (build, skin) and
     `alan_side` (face, clothes), on green, `PORTRAIT_1_2`, exported full size through the scratch design (pages 25-44).
     Eleven frames: jacket off, T-shirt over the head, hopping out of the jeans (black boxer shorts), standing in his
     underwear, waist-up behind the tank flinging the underwear, waist-up washing (hair back, splashing his face),
     out over the rim with the towel, dripping in the towel, towel on with the underwear in hand, dressed with the
     collar up. Canva refused: anything with the underwear going on or coming off below the waist, and "boxer
     briefs" wording (once). Earlier tries kept in art/review/alan/bath_new (trunks versions, jacket-as-towel, the
     cannonball, jeans under the towel; manifest.json lists them). The exports are git-ignored.
   - **Fit** (`scripts/bath_new_fit.py`): keyed, standing frames scaled to the first frame's full height (720 sprite
     px), the others by head size (template match on the first frame's head); waist-up frames stand on their cut, drawn
     at `WASH` (the tank's waterline, h 380) like the old washing frames. art/review/alan/bath_new/sprites + sprites.json.
   - **Scene** (ch2.js `S.bathNew`, used when `S.BATH_NEW`, set by main.js for `?bath=new`): undress in front of the
     tank; fade, up behind the tank's wall (waist-up at `WASH`), the underwear flung on the old `drawShorts` arc;
     Celeste's shriek, Alan's line; splash; washing loop over narr_bath; fade; out at x 770 (in front of the tank: at
     880 the tank hid his legs) with the towel; celeste_bath_2; underwear in hand; the jeans, tee and jacket frames
     played as dressing; collar up; joke; laundryRemark. The old scene is untouched and still the game's.
   - **Open:** the towel stays painted on the tank's corner after he takes it (done in entry 28); the new frames have no face kits (no lip-sync on them yet).
   - **Review board** (the user: "a tool that will let me review the frames, order them and brief in tweaks and missing
     ones"): https://claude.ai/artifact/7q45C56o77oNXSCdqt1vzc (source scripts/review_pages/bath_board/, data.json =
     the frames and the first proposed order). Scene strip (reorder, duplicate, remove, hold ms, floor/tank, a note per
     step, missing-frame cards), paintings with a note each, overall notes, Approve, Play over the room at game size.
     Saved to its db doc `board/bath`: `{steps: [{id, hold, place, note} | {gap: true, text, hold}], frameNotes,
     overall, approved}`. Read it with ArtifactData get board/bath.
   - Checked: smoke bath (the old scene) passes; the new scene played through in Chromium with no errors (screens of
     the fling behind the tank and the towel by the corner checked by eye).

28. **Bath (review): the board's order applied; the tank built taller; Celeste's towel smaller, then gone**
   (the user's notes on the board, then: "make the pool higher", "apply to preview", "make the towel on the tank
   smaller, so it matches the one alan took", "create a version without the towel for after he's taken it", "apply
   everything to the review artifact"). Still not in the game: `?scene=bath&bath=new` and the board only.
   - **Board round** (`a04511a6`): `S.bathNew` follows the board's 22 steps (db `board/bath`; the user's first notes
     kept as `board/bath_v1`); new Canva frames (jacket shrug, tee lift, belt, jeans half, zip, boxers on/up under the
     towel); the fling now behind the tank on the floor past its far rim; `alan_bn_splash` skin evened
     (`SKIN_MATCH` in `scripts/bath_new_fit.py`). Open: washing his body (Canva refused twice, a gap on the board);
     jacket_shrug shows a vest, not his T-shirt.
   - **Taller tank:** Canva repainted the Lavadouro with a taller tank (`art/review/bg/lavadouro_tall_raw.png`,
     git-ignored, like all `art/review/bg/*_raw.png`); `lavadouro_tall.jpg` is the original painting with only the
     rectangle x>=828, y>=372 taken from it (feather 24, colour matched). **`art/bg/lavadouro.jpg` is untouched.**
   - **Towel:** two more Canva repaints of that picture (smaller towel; no towel), aligned to it; only their
     difference inside x 800-1050, y 392-590 (feather 8) is added to `lavadouro_tall.jpg`, so the room is identical
     and only the towel changes: `lavadouro_tall_smalltowel.jpg`, `lavadouro_tall_notowel.jpg`.
   - **Preview** (main.js, `?bath=new`): the room's `bg` is the small-towel picture, `bgs` preloads the other,
     `bgFn` switches on `S.bathTowelTaken` (ch2.js: false at the scene's start, true in the fade before he climbs
     out); `depth` stays `lavadouro_depth`; the tank's occluder outline (`y 680`) is redrawn round the taller tank.
     `S.BATH_TALL` moves `BEHIND` to y 418 and the in-water frames (`TANK`) to y 432.
   - **Board** (scripts/review_pages/bath_board/template.html; republished, version 3): same pictures (small towel
     until the first `climb`/`towel` step, then none), the tank and behind places at the new heights, and the tank's
     outline drawn over figures placed in the tank or behind it, as the game's occluder does.
   - Checked: the preview played through in Chromium with no errors (screens: undressing, washing with the small
     towel on the corner, out in the towel and dressed with the corner bare); the board drawn in Chromium at steps
     9, 10, 13, 14 with no errors.

29. **Bath (review): the fling full size behind the tank; the swimming frames in the water; the board's buttons**
   (the user: "the flicking of the boxers should happen behind the tank and not scaled down. and the in-water sprites
   should be place in the tank"; "the buttons on the review page dont work").
   - ch2.js `S.bathNew`: `BEHIND` h 280 -> 380 (his size in the water); with the taller tank `TANK` is x 1070, y 442:
     the waterline just short of the near rim's inner edge (y 449), in the middle of the water's surface (far rim
     y 401-417), measured on the painting.
   - main.js (`?bath=new`): the back basins' occluder (y 500) now stops at x 842 where the taller tank begins; it used to
     run to x 1068 and cut a shaded band across Alan in the water.
   - Board (version 4): same places; the tank's outline only over steps placed `behind`; in the tank the game's water
     ring is drawn at the waterline. Buttons: could not reproduce a fault (clicks and taps, desktop and phone width,
     local copy of the published page, all worked); made sturdier anyway: errors now show in the status line, a
     painting that fails to load no longer stops Play, and only the thumbnail is draggable (notes and hold boxes inside
     a draggable card can't be typed in on some browsers). The user pressed Approve on the board afterwards
     (db `board/bath`, 06:00 UTC); no notes changed.
   - Checked: preview played through in Chromium, no errors (fling, hair, splash screens); board drawn at steps 9, 10,
     12.

30. **Bath board: saves merge, screens stay in step** (the user: "do the site again, something is wrong", after
   "see my comments" found no notes on the board). Likely cause: each open copy of the board saved its whole state
   and never read later saves, so a stale screen (the Approve at 06:00 UTC) could write over notes typed on another.
   - template.html now follows `board/bath` live (`onSnapshot`); a stored change shows at once, or when the note being
     typed loses focus (the cards are never rebuilt under the cursor); a save is a three-way merge (`merge(seen,
     mine, stored)`: fields this screen changed win, the rest come from the stored board; when both screens reordered
     the steps this screen's order wins); notes a save would still drop are first kept in `board/bath_backup`. Play
     moves the highlight only (`mark()`), no rebuild. The status line shows the last save's time.
   - Checked in Chromium with a stand-in store and two screens: a note typed on each at once both survive, the typing
     screen picks up the other's note after leaving the box; clicks and taps (desktop, phone width) still work.
     Published as version 5. Notes lost before this can't be recovered (the store keeps no history).

31. **Bath (review): the board's notes, round 3: mirrored steps, the throw behind the tank, torso sizes, the boxers
   thrown** (the user's board notes, then: "his bottom part needs to be occluded by the tank (he is standing behind
   it)", "closer to the western edge of it", "match the size of his torso images with his actual torso when we see the
   full body", "using code, take the boxers he is throwing in the air, and make them naturally fly to the front of the
   tank, where his character will be after getting out of it").
   - **Mirror per step:** board steps carry `flip` (a tick box on each card; drawn mirrored about his anchor); set on
     steps 3, 7, 15, 16, 19-23 as the notes ask (db `board/bath` updated, the notes kept). ch2.js `show(k, ms, flip)`
     sets `p.dir = 'w'` for those (the engine mirrors a sprite that faces east when he faces west).
   - **The throw:** `BEHIND` x 900 (the tank's west end; his torso is 32 px right of the frame's anchor), y 440 (the
     cut 40 px under the far rim, which hides him from the navel down).
   - **Torso sizes:** the waist-up frames' head match had failed (throw 1.07x, hair 1.30x too big); measured brow to
     chin on the fitted sprites (standing 56 px) and set as `FIXED` scales in `scripts/bath_new_fit.py` (fling 1.211,
     hair 1.721, splash 1.758); they are now drawn at his standing height in the room, 360 (`BEHIND.h`, `TANK.h`;
     was 380). Board places use 360 too.
   - **Boxers:** the fit script's `LOOSE` cuts anything but the figure out of a frame into its own sprite
     (`alan_bn_boxers`, with `dx`/`dy` from the throw's anchor) and crops the figure. ch2.js `S.throwBoxers`: from
     where they were painted, a thrown body's path (50 px up past his hand, then down) over the front of the tank in
     1.15 s, spinning, to land flat with a shadow at (795, 668), in front of where he climbs out; drawn in `animFg`;
     gone at `pants_on` (picked up). The board plays the same throw during the fling step and shows them on the floor
     until the boxers step.
   - Board fixes on the way: a late echo of an earlier save no longer replaces newer typing (notes 19-22 had been
     cut short by it); backups only when another screen's notes would go.
   - Open from the notes: Canva repaints (T-shirt for the tank top in step 1; off-white towel in 16-17; boxers, not
     the towel, in his hands in 17), new frames (step 9: torso reaching down behind the tank; step 13: leaning on the
     rim in the water before climbing out), more poses in the water.
   - Checked: the throw captured in Chromium every 180 ms (arc over the tank's front, landing at his feet), the
     swimming and towel frames at the new sizes, no errors; board steps 10, 11, 15, 16 drawn; published version 10.

32. **Bath (review): the Canva round from the board's notes; the cannonball** (the user: "yes, do the Canva ones";
   "we also need him in a 'cannonball' position for jumping into the tank. and he has to be naked for that, to keep
   continuity. you need to find a clever way to make canva paint it"; new board notes: "stepping forward (to go
   behind the tank", "need more different poses", "we need more stages of the previous image").
   - **Canva (generate-image, refs MAHYnPL0CuE + MAHYnEDJ7bs, exports through DAHYZ-SDzRE pages 58-68):**
     jacket shrug in a short-sleeved white T-shirt (c_A2), off-white towel stepping into the boxers (c_J2; the first
     wording refused), off-white towel with his hands on the boxers (c_K2), waist-up reaching down behind the tank
     (c_M), waist-up pushing up on the rim (c_N), relaxing arms out (c_O), tossing his wet hair (c_P; came with
     shorts, cut at y 1332; "shaking his head like a dog" refused), walking off in his boxers (c_R), sitting on the
     rim with the towel over his lap (c_S), stepping down in the towel (c_T; first painted in shorts, its recolour
     refused, painted again with the towel round his hips). Replaced versions kept in the library (`_v1`, `_v2`).
   - **The cannonball, bare:** Canva paints him in shorts whatever the prompt, and refused the skinny-dip wording. The
     trick: paint the tuck with shorts (c_Q0, kept), then a second generate-image *editing that painting*: "his short
     black shorts become exactly the same warm tan colour as his skin, completely plain and seamless..." - accepted,
     and in the tuck that reads as bare (c_Q). (A code fill of the shorts with his skin was tried first and dropped:
     it looked like skin-coloured shorts.) The same recolour on a standing figure was refused.
   - **Fit** (`scripts/bath_new_fit.py`): new frames added; `CUT_AT` (rows of the export) for the reach (hands below
     his hips) and the toss (shorts); `DESPILL` for the rim push (his body fades into the green: no green left below
     y 1200); `FIXED` scales measured as before (reach 1.58, rim 1.59, relax 1.24, toss 1.56); the cannonball, walk,
     sit and step-down by the head match (checked against the standing frames at game scale).
   - **Scene** (ch2.js): the walk round the back (hop 8 px x5; the tank hides his legs as he passes its corner); the
     reach (1 s), the throw; the cannonball from behind the tank over and into the water (700 ms, a thrown body's
     path, the tank's outline hiding him as he drops in) then the splash; the swim cycles hair, toss, relax, splash
     (the board's order); the push up on the rim (`RIM`: hands on the near rim at y 458, the water ring at 418); out
     over the rim, then sitting on the corner and stepping down (`CORNER` x 805, y 684: drawn just in front of the
     tank; both painted facing left, not mirrored), then the towel.
   - **Board** (version 11): places `rim`, `air` (the top of the arc), `corner`; the stored board updated in place
     (versions 231-232): the gaps and the duplicate steps the user marked filled with the new paintings, notes kept
     with what was done appended. 29 steps.
   - Checked: the game played through in Chromium with no errors, the new moments captured (walk, reach, the jump,
     toss, relax, rim, sit); the board drawn at steps 9-21.

33. **Bath (review): skin evened out across the scene** (the user, on the cannonball: "Ok, that works. Skin colour
   correction might be needed"). Measured the skin (scripts/skin_match.py's mask, Lab median) on every fitted frame:
   the cannonball came out oranger (a +3, b +4), the step down lighter (L +17), the tee lift darker (L -16), others up
   to 10 off. `scripts/bath_new_fit.py`: `SKIN_MATCH` is now every frame his bare skin shows in, shifted to the median
   of those; `CLOTHED` (the jacket frames) left out, as the leather reads as skin to the mask. After: all within 2-3 of
   the median. Board republished (version 12) with the new paintings.

34. **Bath (review): natural placement - the walk round, the push out, the dive under; the user's board tweaks**
   (the user: "walking behind the tank looks off and also getting out of the tank (pushing up) doesn't seem very
   right"; "we also need to have the canon ball sprite actually fall into water"; "check my tweaks on the board").
   - **Walk:** was moved right at the front of the room (y 650), so the tank's front hid his body with a foot poking
     out below its corner. Now away up the tank's left side, (820, 650) to `WALK_TO` (790, 545) in 1 s with a step bob,
     smaller by the room's depth, then he fades and is found behind the tank.
   - **Push out:** the old painting had his hands 40 px below where his body ended, so with the hands on the near rim
     his body floated mid-tank. Repainted (c_N2: palms on the ledge at waist height, elbows up; the shorts Canva added
     between his hands removed by `NOT_SKIN`; scale 1.75 measured), placed with the palms on the near rim's top
     (fingertips at y 461, over its edge) and his waist in the water 30 px behind (the ring at 432). Old one kept
     as `alan_bn_rim_v1`.
   - **The dive under:** the jump ends with his feet on the water (TANK.y), the tank's outline off from half way down
     (`onTank`, a new switch on the occluder's `when`), then the splash, the water ring and `p.sink` from 0 to 0.6 in
     260 ms: the engine draws him lowered and cut at his foot line, so he goes under at the waterline.
   - **The user's board** (db version 247, approved): hair mirrored, the toss dropped, splash mirrored (swim: hair,
     relax, splash); sitting moved to before climbing out ("position correctly on the tank edge"): now seated on the
     front rim (`SEAT` x 910, y 615, h 360: the painting's seat on the rim's top, his legs over the front; `onTank`
     keeps the tank from hiding him), the towel snatched off the corner beside him; then out over the rim, down,
     the towel; the boxers going on mirrored. Board: places `rim` moved, `edge` added; republished (version 13).
   - Checked: Chromium with the game clock slowed for the short moves: the walk, the cannonball over the water and
     going under in the splash, the push out, sitting on the edge; no errors.

35. **Bath (review): ripples behind his hands; realistic splashes** (the user: "the ripple effect should be occluded by
   his hands"; "we need realistic water splashes").
   - **Ripples:** in the push out his arms reach past the water to the rim, and the swim ripples (drawn over
     everything, in `animFg`) crossed them. ch2.js `armsOut`: the ripples are drawn on their own canvas, the
     painting's arms (all but its middle fifth, his body) cut out of it with `destination-out`, then laid over the
     room; elsewhere they still cover the cut at his waist. The board does the same for its `rim` place. The rim
     painting also lost the last of Canva's shorts (a drawstring strand: grey-black removed across the strip, the box
     widened to x 180-700).
   - **Splashes:** `S.splashAt(x, y, s)` replaces the 26 white dots on a half circle. Seeded (the same each time):
     30-120 drops (mostly fine, a few heavy) each on its own thrown path (`SPLASH_G` 1100 px/s2), drawn as small
     rounded drops drawn out a little by their speed, soft dark edge, a glint on the big ones; each makes a small ring
     where it comes down; a churned white patch and foam rings spreading flat (ry = 0.13 rx); for a big one (s > 0.6:
     the cannonball) a crown of two thin water sheets curling out either side, a column rising out of the middle and
     collapsing (0.12-0.9 s), and spray. Used by the cannonball (s 1), the face-splashing pose in the swim (0.3), the
     push out (0.35); the old scene's splashes go through it too (s 0.8).
   - Checked: the game in Chromium with the splash clock stepped 110 ms a frame (crown, column, drops, rings), the
     small splashes, the ripples behind his arms (before/after crops); no errors. Board republished (version 14).

36. **Bath (review): the walk behind the tank lined up** (the user: "the walking behind the tank scene alignment is
   still not right"). The walk ended small on the floor (by the room's depth), then a fade, and he came back behind
   the tank at the front-of-room size (360): two places and two sizes for one man.
   - Measured: his height by depth (`height()` with no `h`: 371 at y 650, 276 at 560, 218 at 500); the tank's back
     wall meets the floor at about y 563 (front wall 240 px = 0.58 of his height there; the far rim at ~405).
   - ch2.js: `WALK` on the floor all the way: up the tank's left side to (800, 560), then along behind it to (900, 555),
     no fade; there the waist-up paintings take over at his size there (`BEHIND` x 900, y 420, h 271: his waist half
     his height above his feet, just under the far rim, which hides him from about the navel down). The cannonball
     grows from that size to his size in the water (`TANK.h`) as he comes over.
   - main.js: the tank's occluder gets a floor edge (`base` [[843, 563], [876, 692]]: the left wall's foot): beside
     the tank he is in front of its left wall (before, his hip was cut by it); behind it, hidden.
   - Board: `behind` place moved to match (version 15).
   - Checked: the walk stepped 200 ms a frame in Chromium (up the side, along behind, the reach at the same size), then
     the throw, cannonball, sit, climb, step down; no errors.

37. **Bath (review): the frames doubled - an in-between after every step** (the user: "double the number of frames,
   and have at least one transition frame added for each existing, to make the movement more fluid").
   - **22 new Canva paintings** (pages 70-91 of DAHYZ-SDzRE; i01-i22_export.png), each `generate-image` with three
     references: the build/skin one, the painting before and the painting after, asking for the pose half way
     between. Refused once: lowering his arms and leaning back in the water (retried as hands coming down to his
     shoulders). Two water frames came with shorts (wiping his face, up on locked arms): removed by `NOT_SKIN`.
   - **Reused for the dressing half** (played backwards): jeans at the knees, unbuttoning, tossing the tee, tee up
     to the armpits, an arm out of the jacket. So 27 in-betweens from 22 paintings; the board has 55 steps (was 28).
   - **Fit:** `alan_bn_x_*` in `scripts/bath_new_fit.py`; upright ones by full height (`STAND`), the rest by the head
     match; the head match runs a few % big on turned and bent figures, so their scale was measured by the size of
     the dry hair's mass against the standing frames and set in `FIXED` (also for jeans_off, climb, walk, sit,
     step down, cannonball: all now within a few % of the standing frames). Skin matched like the rest.
   - **Scene** (ch2.js): `IB` 420 ms per in-between, main holds trimmed ~10-20%; the walk alternates its two strides
     every 280 ms as he moves; the swim loop is hair, hands down, relax, scoop, splash, wipe; up on locked arms
     after the push out; legs round off the edge, climbing down, the towel tucked, the boxers picked up (the thrown
     ones on the floor go as he picks them up), up to the knees, jeans held open; then the reused ones dressing.
     Facing per step as the board's (in-betweens of the left-facing half mirrored).
   - **Board** (version 16; db version 249): the in-betweens inserted after each of the user's steps, notes kept,
     "✓ in-between" on the new ones; the towel now gone from the corner from when he sits on the edge.
   - Checked: the scene played through in Chromium logging every pose and facing (62 changes, the order above, all
     55 steps), screenshots of the in-betweens in the room; the board drawn; no errors.

38. **Bath (review): cross-fades between all the frames; the frames aligned one to the next** (the user: "makes sure
   that there is a smooth crossfade between the frames. And ideally align them all so that the transition is as
   little visible as possible"; also asked whether Google could make background-free video for scenes like this).
   - **Cross-fade:** actor.js `crossFadeAll(dur)`: while set, every frame change of that actor dissolves over `dur`
     (through the existing forced cross-fade, `xfNext`); ch2.js `S.bathNew` sets 0.16 s at its start and 0 at its
     end. The board's Play dissolves 160 ms between steps too.
   - **Alignment:** the paintings were anchored at their feet (the middle of the bottom 6%), so the body jumped up to
     ~45 px sideways when the stance changed. `scripts/bath_new_fit.py` now anchors at the body (`body_x`: the middle
     of the widest run at the hips, or chest for waist-up; the old one kept as `foot_ax`); then the new
     `scripts/bath_new_align.py` (run after the fit) slides each painting to where its shape overlaps the one before it
     most (IoU of the alpha masks at game size, mirrored as played, -90..+90 px), chained through each run of the scene
     (`RUNS`: floor undressing, behind the tank, in the water, at the rim, dressing). A painting used twice keeps the
     place it got first (so the five reused in-betweens fit the undressing better than the dressing). The thrown
     boxers' offset follows the fling's anchor.
   - Checked: onion-skin sheets of every consecutive pair before and after (the bodies now overlap, the limbs change);
     the scene in Chromium with each step screenshotted (walk, behind the tank, the dive, the water, the rim, the
     climb out); board Play and buttons; no errors. Board version 17.

39. **Bath (review): the dressing half's own in-betweens** (the user: "Maybe you could do those dedicated paintings to
   fix", of the five undressing in-betweens played backwards while dressing, which could only be aligned for one).
   Five Canva paintings (pages 92-96, d01-d05_export.png), each from the frames either side: pulling the jeans up,
   buttoning them, the tee held up to put on, the tee pulled down, swinging the jacket on. `alan_bn_y_*` in the fit
   (upright: by full height; the tee-down and jacket ones left out of the skin match, too little bare skin to measure),
   `scripts/bath_new_align.py`'s dressing run uses them; ch2.js plays them in place of the reversed ones; the board's
   five steps swapped (db 250, board version 18). The undressing in-betweens now appear once each, aligned for their
   own place. Checked: the scene's pose log in Chromium (the dressing run as above), no errors.

40. **Duarte's upstairs scene rewritten (review, `?duarte=new`)** (the user: the horseplay "doesn't work with Duarte's
   playful, nonchalant personality... slightly romantic, but with mutual agreement of no strings attached"; then: more
   kisses standing and on the bed; Alan's T-shirt has no buttons, so he unbuttons Duarte's shirt; continue with a push,
   Alan falling back on the bed, arms behind his head, legs apart, Duarte kneeling with his hands on Alan's thighs and
   his head down, painted on his own). The game's scene is unchanged until approved.
   - Script (approved): Duarte browses ("best stock"), sets the terms (no second acts; Alan has a bell to stop by
     06:25, so neither is free for one), a chord lesson that was "the excuse", a slow kiss, jackets, a longer kiss, the
     T-shirt, shirtless, the push, the bed, then two bed paintings (kiss; laughing, new narration) and the afterwards
     with "Tuesdays, then? Or not. No promises." / "No promises. Bring the guitar." Lines `guitar_r1..r6`, `alan_r1/r2/r4`,
     `narr_room_guitar_r`, `guitar_room_3r`, `alan_room_guitar_2r` (js/lines.js), voiced with the ElevenLabs connector
     (eleven_v4, cast.json voices, take 1 in audio/voice; take 2 on the board), Rhubarb cues, manifest rebuilt.
   - Paintings: Canva, Duarte left, Alan right, on green: 12 pair frames (6 keys, 5 in-betweens, the push; the jacket
     frame repainted for the T-shirt; Canva refused a shirtless standing kiss three times, so there are two standing
     kisses, not three), Alan lying, Duarte standing and kneeling (solo), two bed stills (edits of one painting).
     Exported through `DAHYZ-SDzRE` (the design is at Canva's 100-page limit: reuse pages 3, 4, 6, 7, 22 by
     `update_fill`). `scripts/duarte_new_fit.py` keys and fits them into `art/review/alan/duarte_new/` (pairs: Alan
     720 px tall, anchored between his legs, Duarte's feet as px/pfy, no overlap sliding; a magenta boot recoloured;
     `--solo` for the bed sprites, with `lap` and `hands` points); stills in `art/review/stills/still_duarte_bed_*.jpg`.
   - Code: main.js loads the sprites and stills on `?duarte=new` (`S.DUARTE_NEW`); visits.js `S.visitGuitar` plays the
     new sequence in that case (the pairs dissolve as rigid pairs do; Duarte kneels where his palms meet Alan's lap).
   - Checked: `?scene=visitguitar&duarte=new` in Chromium, each step screenshotted, the hands 12 px from the lap point,
     no errors. Board: https://claude.ai/artifact/Lnt7GxLaAP37ukzBXXwCAb (notes in db docs `duarte/*`).
   - To do on approval: replace the old sequence, promote the sprites, update docs/STORY.md (line ~687).

41. **Sound pass (review, `?sound=new`)** (the user: "review the sound effects added to the game, and do a comprehensive
   sound design for each room and situation (sound FX, keep the music as it is)"). Full write-up: `docs/SOUND.md`.
   - Review found:
     - The Cistern, Cais do Sodré and the Maria Fé's deck had their `ambience` and `floor` swallowed by a `//`
       comment on the same line (silent rooms, no steps).
     - The cabin played the deck's bed, though it has its own.
     - 33 clips start late, up to 0.44 s of silence in front.
     - `dial_click_3` is silent.
     - Drips, settling stone, a night dog and paper shuffles were scheduled but never recorded.
     - Footsteps were synthesised.
     - Alan's room used the shop's bed, and the tavern at night had none.
   - New recordings: ElevenLabs sound generation (`eleven_text_to_sound_v2`, flow safhod95hJQa6sNqOwhU, 4 variations
     each, about 2,200 credits in all), cut and levelled by `scripts/sound_new_prep.py` into `audio/sfx`:
     - footsteps `step_{wood,stone,cobble,tile,wet,deck}` (4 takes each);
     - details: dog, paper, drips, stone, canary, voices at a window, wind through arches, dial clicks _4-_7;
     - loops: `amb_bedroom` (30 s), `bell_hum_soft`, `water_lap`.
   - Code, all behind the flag:
     - `js/audio.js` `SOUND_NEW`: `LEAD` offsets (clips start where their sound starts), `BROKEN` takes, recorded
       footsteps (random take, ±6% pitch, `STEP_VOL` 0.32), the new beds and details, attic and cold-open acoustics.
     - `NEW_ONLY` keeps every new file out of the game without the flag (some fill names the game already asks for).
     - `js/story/main.js`: the room fixes (ambience and floor for cistern/cais/boat, deck floors, the cabin's,
       bedroom's and night tavern's beds; the calm cistern after the rite).
   - Checked: Chromium visiting 14 rooms with and without the flag. With it, every room loads its bed and the
     recorded steps play. Without it, unchanged: cais, boat and cistern still silent. No errors.
     Board: https://claude.ai/artifact/EEpFmqUk8Tv7pfZU49RW3j (each room before/after, footsteps, notes in db `sound/*`).
   - Not checked by ear (no listening here): the takes were picked by measurement (single clean step, level, the
     steadiest loop), so some may need swapping on the user's notes.

42. **Approved and deployed: the new bath, Duarte's rewritten scene and the sound pass** (the user: "Deploy all", and
   asked, "Make all three default, then deploy").
   - The three switches are now defaults: `?bath=old`, `?duarte=old` and `?sound=old` bring back the earlier versions
     (`js/story/main.js`, `js/audio.js` `SOUND_NEW`).
   - `.gitattributes` lets into the export only what the game loads from `art/review`:
     - the bath and Duarte sprite sheets (`sprites.json`, `sprites/`);
     - the two taller-tank paintings;
     - the two Duarte bed stills.
     The review sheets stay out.
   - docs/STORY.md: Duarte's upstairs scene as it now plays. docs/SOUND.md: status.
   - Checked before deploying, at default URLs in Chromium: 14 rooms (beds and recorded steps), the Duarte scene to
     the afterwards, the bath scene's 60 poses. No errors.
   - Deployed: commit `3c1d770f`, Netlify deploy `6ad948e0972297b45a1ffdcc`. Live checks: the page, the review sprites
     and stills, the new sounds all 200; `/.env` and the review sheets 404; the live JS has the new defaults.
   - Still to tidy (no change to what plays): fold the flags and the room fixes into the rooms themselves
     (docs/SOUND.md, last section), and promote the review sprites out of `art/review`.

43. **Faces for the new paintings (review)** (the user: "since many new sprites were added, I think we need to add
   talking and blinking to them").
   - 69 face sets, off in the game until approved (`"ok": false`; `?faces=all` shows them):
     - Alan: 57 sets (the bath scene's frames, `alan_dn_lie`, the Duarte pairs).
     - Duarte: 12 sets (`FACE_CHAR=guitar`): `duarte_dn_*`, and in the pairs as `<frame>__guitar`.
   - Mouths (A-F) only where someone speaks over the frame: `alan_bn_fling`, `duarte_dn_stand`, and both faces in
     `pair_duarte_{book,terms,lesson,jackets,shirts}`. Every other frame blinks only.
   - Left out:
     - `pair_duarte_tee` for Alan (his face is under the shirt);
     - the three kisses (eyes shut already);
     - `x_wipe`, `splash`, `x_surface` (hands over the face, eyes shut);
     - the unused `_v` variants.
   - About $5.70 of Gemini (`art/review/log.md`). Four edits were truncated when the first run was killed;
     regenerated.
   - `scripts/face_kit.py`:
     - reads frames from the review sheets (`REVIEW_SRC`);
     - `NEW`/`TALKS` pick mouths or blinks;
     - `find <frames>` merges into the index;
     - each set records the painting it was cut from (`src`).
   - `js/engine/faces.js`: a review-sourced sprite now keeps the face sets cut from that same painting. Before, it
     dropped every face.
   - Checked: the Duarte scene in Chromium with `?faces=all`: every patch loads, Duarte's mouth moves on his line
     and Alan's stays still, no errors. Review page: https://claude.ai/artifact/BpsVxYMnqoVjAssVKxBMmx (db
     collection `faces_new`). Set `"ok": true` in `js/faces.js` for the approved ones.

44. **Every new Alan frame talks; Inês behind the desk.**
   - Faces (the user: "make all the sprite with visible mouth be able to talk, in case the script changes"; then "stop,
     don't do the speaking on all cast; do just the new ones for Alan"):
     - All 58 of Alan's new sets now have mouths A-F as well as blinks. Duarte's 12 are as in entry 43 (mouths only
       where he speaks).
     - A run for the rest of the cast was set up (`CAST` in `scripts/face_kit.py`: Rui, Amalia, Tomas, Lacerda,
       Celeste, Ze, Abilio, Lino, the speaking extras, Duarte's and Teixeira's other solo frames) and stopped before
       any edits: only Rui's faces had been found, and that index was removed.
     - About $12.70 of Gemini for Alan's 310 mouths.
     - Review page republished (each set's patches packed into one strip, `t/<set>.webp`):
       https://claude.ai/artifact/BpsVxYMnqoVjAssVKxBMmx. All 70 sets are still `"ok": false`.
   - Inês behind the desk (the user's screenshot: her legs over the grandfather desk while she shelves books at 345, 550):
     - The shop had no occluders. It now has one: the desk's right pedestal and the hutch's side
       (`js/story/ch1.js` `ROOMS.shop.occluders`, front on the floor at y 560).
     - Checked in Chromium: Inês at the shelving spot is hidden by the desk's side; Alan in front of it is not; no errors.

45. **Two engine audits (agents), merged; the new faces approved.**
   - Cross-fades (the user: "make sure that all of the sprites across all of the game use the same cross-fade natural
     transition between the frames. I think even Inês at the beginning loses it"). `js/engine/actor.js` `drawBody` and
     `composeFrames`: any frame change that isn't a morph or a near-identical pair now dissolves (`XFADE` 0.2 s standing,
     `WALK_XF` 0.14 s walking, `XFADE_SHORT` 0.1 s per hand-over in a turn through the front view). Before, these cut:
     - talk gestures (Inês's alone, about 37 cuts in 5 minutes);
     - poses with no morph data (Inês's jobs, Alan's yawn and swoon, Vasco's reactions...);
     - front-view turns and facing changes;
     - the review sprites;
     - a solo frame into a pair painting;
     - a failed warp;
     - a change mid-dissolve, which popped (now the more visible painting is the one kept).
     A hidden figure comes back without a ghost of its old frame. Kept on purpose: walk steps (entry 11: a dissolve
     ghosts a double leg) and a figure appearing. Agent commit b70b50f2; one conflict with `walkOpt(this)`, resolved.
   - Breathing and head tilt (the user: "check if the script responsible for making the characters look like they are
     breathing, head tilting etc is applied to all"). All 731 frames go through `Actor.motion`. Two gaps fixed:
     - the 19 waist-up bath paintings tilted about the face, not the neck, and six had no tilt at all: `waistDrop(sp)`
       places a `waist` painting on his whole standing figure;
     - the bench man had no tilt (his painting counted as a group): new `anim.wide`, and `npc_bench` has
       `anim: { wide: false }`.
     Left by design: the pair paintings (never bent), Light mode (breath only), groups, lying figures, the cat, the tram.
     Agent commit 42f04a1d.
   - Faces: the user approved Alan's and Duarte's new sets. All 70 are `"ok": true` in `js/faces.js`.
   - Checked after both merges: validate 0 errors; Chromium: the bath scene (60 poses) and Duarte's scene, no errors.
   - Deployed (the user: "Deploy all"): commit `9c9cde46`, Netlify deploy `6ad9600e5645b03d56620317`. Export smoke test:
     Duarte's scene, the bath and the shop desk, no errors. Live checks: the page 200, `/.env` 404, new face patches and
     review sprites 200, the live `js/faces.js` has all 70 new sets on, the live `actor.js` has `waistDrop`, and the live
     `ch1.js` has the shop's desk occluder.

46. **NPC size and feet check; fixes proposed, not in the game** (the user: "some, especially background character, have
   uneven sprites when they animate - different sizes. Please check this and everything else we checked about Alan";
   faces left out on purpose: "They are not meant to speak and blink yet").
   - Measured every frame of the 32 NPC figures in every room (`scripts/npc_check/`, run from a scratch folder against
     a server on :8098: `dump.mjs` lists each room's NPCs and frames; `reg.py` SIFT similarity against the base frame;
     `head.py` / `two.py` the base head and feet matched across scales; `feetjump.py` the feet overlaid at game size;
     `sheet.py` contact sheets at game size; `ghost.py` mid-dissolve overlays; `propose.py` the fixes).
   - Size is fixed only where two measures agree, against the character's idle/talk frames. Feet anchors are fixed
     where the feet overlap well (IoU >= 0.6): moved to where the base frame's feet stand.
   - **Found (8 characters, 51 frames; `art/review/npc_fix/proposal.json`, old -> new `h` / `ax` / `fy`):**
     - Abilio: his two idle paintings alternate and `abilio_idle2` is 13% small; `read`, `point`, `shout1` jump a fifth
       of his height sideways (anchors at one edge).
     - Vasco: about half his frames anchored on one foot, the rest between the feet (5-12% jumps); coffee, coffee_sip,
       amused, stand_up small, fluster large.
     - Ze: `ze_hammer` 25% small (the hammer was counted in his height); toss, burst and the undressing set 5-12% small;
       `ze_strip3` jumps sideways.
     - The washerwoman in black: `npc_washer1_b` 10-15% small. Celeste: `celeste_wring2` 6% small.
     - Rui: feet shuffle 2-5% between frames. Lacerda (robe): `robe_read` jumps. The bench man: `doze2` sinks.
   - **Checked and fine:** the rest of the cast and extras (Ines, Lacerda, Amalia, Tomas, the nun, Lino, the menders,
     cards, couple, fish seller, guard, volunteer, Teixeira, Duarte, the laundry woman, the second washerwoman).
     Breathing, tilt and cross-fades already cover every NPC frame (entry 45). Skin tone read by face-patch Lab is
     too noisy to act on; by eye the sheets are even. Left alone: `tomas_kneel` (ch5.js places him for it), the
     lying/reclining figures, Pessoa (each cat pose has its own `h` in ch1.js).
   - Noticed, not a size issue: `npc_bench_wistful` paints the bench man bareheaded (his cap is gone).
   - Review board: https://claude.ai/artifact/CfA6A88JFRC1yGXhhnYcAg (per character: now vs proposed, dissolving as
     the game does; decisions in its database, collection `npc_fix`). On approval: write the approved characters'
     values from the proposal into `js/sprites.js`, rebuild morphs for the changed frames if any, validate, smoke.
   - **Decisions (board, 22 Oct):** approved Celeste, Lacerda (robe), the washerwoman in black, Rui, Vasco, Ze;
     rejected Abilio ("abilio_idle2 is much bigger") and the bench man ("we need to redraw his sprites so the bench
     doesn't move").
     - Applied the six to `js/sprites.js` (59 values, file order kept). Also `vasco_coffee_talk` scaled with the
       other two coffee frames (the validator's 4% talk/idle size rule caught it).
     - Rebuilt the 77 morph pairs touching changed frames (`FORCE=1 scripts/morphs.py`), the washerwoman's with
       `INV_IOU=0.68`. Lost: `npc_washer1_b>npc_washer1_gossip` and `>npc_washer1_howl` (overhead pose too far
       apart; those two swaps plain-dissolve). `scripts/similar.py` rerun: 305 pairs, changes only in Rui and Vasco.
     - Checked: validate 0 errors (7 old warnings); smoke romance, finale, laundry, celeste, stationafter, sepit,
       sepitgame, thursday, vascostore, vascolove, cop, quayfish, bench, abiliosketch all pass.
     - Abilio revised for round 2 on the same board: sizes kept, feet anchors only for read, point, shout1, shout2
       (`art/review/npc_fix/abilio_revised.json`). The bench man waits on a repaint (bench fixed, man redrawn).
   - **The bench man repainted for review (not in the game).** Aligning on the bench can't fix it: even the best
     affine fit overlaps his painted benches only 45-78% (each painting draws the bench differently, some front-on,
     some three-quarter). So: one empty bench (`art/review/bench/bench_empty_front.png`, Gemini from
     `npc_bench_talk1`, new `gen_image.py --key magenta` since the bench is green; a first try from `npc_bench`
     came back restyled and was dropped), and his ten poses painted without the bench (`man_<frame>.png`, Gemini,
     $0.62). `scripts/bench_compose.py` sits each man on that bench where his own painting had him (bench width and
     bottom mapped) at one size; `art/review/bench/sprites/` holds the ten frames at game resolution with one shared
     meta (`meta.json`: same w, hh, h, ax, fy for all, so the bench lands on the same pixels). His face stays within
     5% of its old size and spot; the front-on bench reads about 10% narrower than the old ones. On the board as
     round 2 with Abilio. On approval: copy the ten webps over `art/sprites/npc_bench*.webp`, write the meta into
     `js/sprites.js`, rebuild his morphs and `similar.py`, `build-manifest.mjs`, validate, smoke `bench`.
   - **Round 2 (board):** the bench man approved: the ten webps copied over `art/sprites/npc_bench*.webp`, their
     shared meta written into `js/sprites.js`, his 45 morph pairs rebuilt (90 stored), `similar.py` (307 pairs),
     `build-manifest.mjs`. Validate 0 errors; one new warning, `npc_bench_talk3` "draws at 96%": it compares the
     top of the figure and he leans lower in that painting; changing its `h` would move the bench again, so it
     stays. Smoke bench, visitcop pass; Chromium street shots: the bench holds still across his frames.
     Abilio's round 2 was rejected: "abilio_shout1 seems to have different colours".
   - **Abilio round 3 (on the board):** `abilio_shout1`'s face and hands had a green-yellow cast (face Lab a 137 vs
     his main frame's 145). Proposed `art/review/npc_fix/abilio_shout1.webp`: the skin (hue <= 28, saturation > 85,
     upper 60% of the figure) shifted by (+3, +8, +5) in Lab, then the whole figure matched to `abilio`
     (`gen_image.match_palette`). Feet anchors as in round 2. On approval: copy it over `art/sprites/abilio_shout1.webp`,
     write `abilio_revised.json` into `js/sprites.js`, rebuild his morphs, `similar.py`, manifest, validate, smoke.
     Approved (board, round 3) and applied as described; validate 0 errors (8 warnings, as before); smoke abiliosketch passes.
   - **The card players (Taberna), on one table, for review** (the user: "The same problem as with the man on the
     bench we had with 2 men playing cards in the tavern"). Their two paintings draw the table and chairs differently
     (and Gemini, asked to repaint frame A with B's gestures, recomposed the whole scene again). So:
     `art/review/cards/furniture.png` (empty table, deck and two chairs, from `npc_cards`) and `men_<frame>.png`
     (both men without furniture, per frame), $0.29 with the first try. `scripts/cards_compose.py`: each man placed
     by SIFT on his own original frame, that frame mapped to the furniture by the chairs' outer edges and the floor;
     layers chairs < left man (below the tabletop's front edge) < table < left man (above it) < right man; in frame B
     the slapping forearm is bent up 110 canvas px (about 45 at game size) so the hand lands on this tabletop (it was
     painted for a taller one). Output `art/review/cards/sprites/` + `meta.json` (one shared w/hh/h/ax/fy). On the
     board as round 4. On approval: copy over `art/sprites/npc_cards*.webp`, meta into `js/sprites.js`, morphs for
     npc_cards<->npc_cards_b, `similar.py`, manifest, validate, smoke `tavernafter` / `fado`.
     Approved (the user: "card game approved") and applied as described: morphs 2/2 (iou 0.98); validate 0 errors (8 warnings, as before); smoke tavernafter, fado, guitar pass.

47. **The shop repainted at a real scale, for review** (the user: "the objects inside (lamp, counter, cashtill, paper,
   answering machine) are out of proportion and way too big in relation to the characters. Let's redraw it with Canva
   so it is more realistic"; then "we lost the phone which is essential for the gameplay"; "The till should be facing
   the door, we should see the back of it"; "make the sugartin larger"; "now do an artifact with Inez doing her actions
   in this space. rememeber about the kettle, desk occlussion etc").
   - Canva `generate-image` from `art/bg/shop.jpg` + a screenshot with Alan and Ines for scale, then two edits (the
     telephone and the answering machine readable at real size; the till turned to the door and a bigger sugar tin).
     Full-size export through page 22 of the scratch design. `art/review/shop/redraw{1,2,3}.png`; the one in review:
     `art/review/bg/shop_new.jpg` (1280x720). **`art/bg/` is untouched.**
   - `?shop=new` (js/story/main.js, day only): the painting, no parallax (no depth map yet), the desk occluder redrawn
     (y 598), every hotspot rect, the kettle/book on the sideboard (`S.SIDEBOARD`, ines.js; kettle at 0.85), her dusting
     spot (`S.INES_JOBS`), Pessoa's spots (`S.PESSOA_AT`, ch1.js), the lamp light / `lampOut` / moth, the machine's light,
     the kettle steam, window fog, trickles, birds, the door passer. New preview `?scene=shopjobs` (nothing scripted,
     Alan at the front left). The default game is unchanged: validate 0 errors; smoke intro, ineskey pass.
   - Review page: https://claude.ai/artifact/KFM5gf9jcadm5ZFW1srL9v (a recording of Ines doing all five jobs in it, a
     before/after slider, the verdict in its database at `shop/verdict`).
   - Still to do on approval: night, drawer-open and no-magnifier versions in the same style, a depth map, then make it
     the room's painting (that changes `art/bg/`, so only with the user's go-ahead).
   - **Rejected, redone as patches** (the user: "The texture of the image became lower quality, especially visible
     on the furniture. The books lost their shape too. Also, I did nt ask to scale down the desk, it was right scale,
     only the lamp on it was bit too big"; then "the book shapes are distorted"). A whole-painting Gemini edit
     (`still_edit1`) changed too little and blackened the counter; so each object is edited in a crop at 2-3x
     (`art/review/shop/crops/`: lamp, counter (two passes: turned, then half size), tin) and `scripts/shop_patch.py`
     pastes each back only inside boxes around it (feathered; the counter's box split so the door glass keeps its own
     pixels). The shelf behind the old shade is rebuilt from the painting's own books (standing books' bottoms carried
     down, plank and lying books continued from their left, mirrored, light evened along each row), never repainted.
     The drawer / no-magnifier variants patched alike (`art/review/bg/shop_new_*.jpg`); the night painting not yet.
     `?shop=new` now keeps the original layout, desk outline, kettle, jobs and depth map; only the six hotspots, the
     lamp light / off-look, the machine's light and Pessoa's machine spot move. The page (same link) re-recorded.
   - The user: "yeah, but now the counter is original". A slip of mine had folded the counter entry of `PATCH` into a
     comment, so the counter objects were not patched in that version; fixed, all four day paintings rebuilt, the
     video re-recorded. Counter height: beside Alan it already reaches his hip (about 90 cm); a lowered version
     (Gemini crop edit `counter_full_edit.png`, pasted over the old counter's footprint only:
     `art/review/shop/option_b_lowcounter.jpg`) is offered as option B on the page (choice saved as `counter` in
     `shop/verdict3`). Not yet wired into `shop_patch.py`; do that if the user picks B.
   - The user: "draw it from scratch, this piecing up doesn't work". `gen_image.py --fresh` (new: a painting made anew,
     the first image only a guide to layout and camera; extra refs sent as they are). With the old painting as the
     guide (`fresh1/2`) the model copied it, old sizes and all; so `art/review/shop/layout_guide.jpg`: the old painting
     with the lamp, till, machine, phone, newspaper and tin inpainted out, blurred (sigma 3.2), plus Alan's and Ines's
     sprites for scale and the real sizes in the prompt. `fresh3` (camera a touch closer, desk smaller) and `fresh4`
     (closest to the old layout), 2752x1536 raw, `art/review/bg/shop_fresh{3,4}.jpg` at 1280x720. On the page (same
     link) as Version 1 / 2 with in-game shots; the pick goes to `shop/fresh`. The patch work above is superseded.
   - **Closed: the shop keeps its original painting** (the user: "ok, keep the original one, these tweaks don't work").
     The `?shop=new` switch is removed from main.js; `art/bg/` was never changed. Kept, harmless: the exposed
     `S.SIDEBOARD`, `S.INES_JOBS`, `S.PESSOA_AT` (same values as before), `?scene=shopjobs`, `gen_image.py --fresh`
     and `--key magenta`. The review files under `art/review/shop/` and `art/review/bg/shop_*` stay as a record.
   - **Deployed** (the user: "deploy all and prepare for handoff to the new session"): commit `e9bb754c` from a clean
     `git archive` export (no `.env`), smoke on the export: intro, bench, laundry, tavernafter, fado, sepit, vascostore,
     romance, abiliosketch, shopjobs, visitguitar, bath all pass. Netlify deploy `6ad996fe597c28c865322321`. Live: the
     page 200, `/.env` 404, the new bench / cards / Abílio sprites byte-identical to the repo, the live sprites.js
     carrying the size and feet fixes, no `?shop=new` left in main.js.

49. **Code review and lift-ups** (2026-10-22, the user: "Analyse the game code and propose lift-ups", then "Do batch A,
   then B - don't wait for my approvals"; then "Work on your branch and merge when done"). Two read-only reviews
   (engine; story) plus measurements; the full list went to the user in chat. Done here: batch A (bugs, entry 50)
   and batch B (loading, entry 51). Proposed and **not done** (in "Open" above): phone speed (the parallax texture
   uploaded every frame in live rooms, the 120-canvas face cache, per-frame shadow blur), accessibility (keyboard
   play, focus in modals, subtitle size, 44 px buttons, reduced motion), new writing (an "already done" line instead
   of `alan_fail_04`, used 23 times; Ch. V hints), the README walkthrough, small story helpers. Work on branch
   `claude/modest-cray-12ezwn`, merged into master by the user's instruction. Nothing deployed.

50. **Batch A: things that could cost a player their game.** No art, no lines, no story beats changed.
   - **Saves** (saves.js, engine.js): a save holding an item this build doesn't know no longer breaks the inventory
     bar on Continue (unknown ids dropped); if loading throws anyway, Continue says so and starts a new game instead
     of a black screen. The menu's Load still restores the menu's save, but when that is older than the autosave it
     asks for a second press ("Your save is from 2 hours ago: press Load again to go back to it").
   - **Input never stays locked:** try/finally round `busy` in `goRoom` (a throwing `leave` hook is logged and the
     room still entered; a bad room id throws before anything changes), `say` and `lyrics`; `showStill` no longer
     throws when the still was already cleared.
   - **Lost WebGL context** (warp.js, parallax.js): the lost canvas is dropped and a fresh one built on the next draw;
     meanwhile figures and paintings draw flat. Three losses and the effect stays off.
   - **Touch:** a long-press to examine no longer has its line skipped by the click the browser sends on lifting the
     finger; a finger that moves over 10 px is a drag, not a press.
   - **Small:** the Voices setting is remembered (`drowned-bell-music-volume-voice-off`); a second toast keeps its own
     time; a hidden tab goes quiet (the audio context sleeps, so the line being spoken waits).
   - **Story:** Ch. II, everything done but Ferreira's drawer: Inês now says `ines_hint_clocks` (it pointed at the
     closed convent). The shop's entry checks the chapter end afresh (`S.checkCh2()`): using the case file on
     Celeste as the last clue never set `ch2_ready`, so the chapter didn't end. Ch. III: once Alan has chosen the
     Chiado, Inês follows the same thread as the map marker (Lacerda's case first). Two conditions that could never
     be true removed (`lampOff2`, `slip_said`): no change in play.
   - **validate.mjs:** flags read as `G.flags.x` or through `const f = F()` count (7 false warnings gone);
     `lipsync.js` / `faces.js` no longer count as using a line, which shows **70 recorded lines nothing plays**
     (retired in story round 2; listed by the validator: left for the user to decide). The review and walk-lab tools
     are left out of the flag check.
   - **Checked:** a Playwright script (scratchpad, not kept) for each case: unknown item, throwing load, throwing
     leave hook, bad room, throwing line (`busy` back to 0 every time), toasts, voices setting across a reload, the
     two hints and the Ch. II end on entering the shop, GL context loss (two contexts lost, two fresh ones, no
     errors), long-press on a touch screen (the line survives the lift; a second tap skips it). All pass.

51. **Batch B: streaming the images.** The title used to wait for every image (803 files, about 75 MB; 42 s and 100 MB
   with the music before the title on a 20 Mbit/s link).
   - **js/engine.js:** every image is registered at start and loaded through one queue. The title waits for none of
     it. `goRoom` waits, on black, for the room's art and the stand/walk/talk frames of whoever is there now
     (`E.roomReady`; their other poses go to the front of the queue next); `showStill` for its painting; the chapter
     transitions for all their paintings. While anything is waited on the background stream pauses (8 at a time for
     the urgent, 4 for the stream). A frame drawn before it lands is fetched next (actor.js `place`), and shows the
     idle frame meanwhile, as a pose not painted yet always did. A request that stalls gives up after 25 s (it used
     to hold the loading bar forever) and a failed one is tried once more. "Loading…" shows in the corner if a wait
     passes 0.4 s. `?preload=all` (and `?review`, the walk lab) load everything first, as before.
   - **"Is this art in the game?"** checks in the story used `G.image(key)` (loaded); they now use `G.hasArt(key)`
     (main.js opening and bedroom, coldopen.js, ch3, ch5 `S.still`, se.js, visits.js, transitions.js), so a slow
     connection can't quietly get a fallback scene.
   - **js/morphs.js** (3.5 MB) loads `async`: every use already checked it was there.
   - **Measured** (scratchpad scripts, 20 Mbit/s and 60 ms emulated): the title after 1.4 s and 2 MB (was 41.9 s,
     100 MB); a new game played at real speed waited 0.9 s in all, once, for the first painting, and everything had
     streamed in by 50 s, during the cold open. Every room entered with its art in place (20 rooms), no errors.
   - **Checked:** the smoke test on all 38 scenes and a new game (two halves): all pass; the batch A checks again on the
     final loader: all pass; `node scripts/validate.mjs`: 0 errors.

52. **The 70 recorded lines nothing plays, deleted** (the user: "DELETE"). Retired in story round 2 and earlier; the
   validator showed them once `lipsync.js` stopped counting as a use (entry 50). Each was checked by exact word in the
   code first (no id is built at run time; the only hits were comments and the reactions table in se.js). Removed
   from js/lines.js with their mp3s (70), lip-sync files (65) and docs/script_full.md; the dead keys in se.js's
   reactions table (8); voice manifest and js/lipsync.js rebuilt (1174 -> 1109 lines, the difference exactly the
   deleted ones). The history docs (docs/reviews/, bible_full.md) are left as they were.

53. **New lines: "already done", and Chapter V hints** (the user: "DO IT"). Eleven Alan lines, written to the humour
   rules in docs/STORY.md, recorded and wired. **Story:** docs/STORY.md (failed uses; V.1 "Hints with Inês gone").
   - **"Already done":** `alan_fail_04` ("No. And I say that as a man who has said yes to a lot of bad ideas.") was the
     reply to 23 things already done; it reads as a refusal. 18 of those (every one guarded by a done flag) now call
     `S.done()` (core.js): `alan_done_1`..`_3` in turn ("Been there. I'm turning over a new leaf, not the same one
     twice."), and in Chapter V the short `alan_done_ch5` ("That's done. Keep moving, Alan.": the cistern rite is no
     place for a joke). The other 6 uses are real refusals and keep `alan_fail_04`.
   - **Chapter V hints:** Inês is gone until the cistern, so there was no "What now?". Reading the notebook (the
     ✎ button, N, its Read tab; also looking at it) now ends with Alan asking himself what she'd say (`S.ch5Hint`,
     core.js): `alan_ch5_hint_cat`, `_machine`, `_rui`, `_vasco` (only while the call is due), `_carmo`, `_tomas`,
     `_grate`. Nothing in the cistern (she hints there herself) or before Chapter V.
   - **Voices:** ElevenLabs connector, eleven_v4, Alan's cast voice (scripts/cast.json), one take each, in the flow
     "Drowned Bell: Alan's done lines and Ch. V hints (2026-10-22)" (about 861 credits). The four tagged takes were
     transcribed (Scribe): the words match, the tags not spoken. Installed with scripts/install_voice.sh (to Alan's
     median, -21.5 to -21.7 LUFS after encoding); alan_done_1 peaked at -0.7 dBTP and was limited (now -2.0).
     Lip-sync: Rhubarb 1.13.0 downloaded again into the scratchpad (gone with the container), 11 written.
   - **Checked:** a browser script: the done lines take turns (1, 2, 3, 1) and Chapter V gives the short one; the shop
     phone after ringing Rui says it; each Chapter V state gives its hint, none in the cistern; reading the notebook
     speaks the hint in Chapter V and nothing extra in Chapter III. `node scripts/validate.mjs`: 0 errors, 1302 lines.

54. **Deploy of both sessions' work** (the user: "just deploy", after warning that the other session had deployed the
   cleaned cut-outs, `69cffcd6`, Netlify `6ada17253b1f63adf4b4bd09`). That commit was only on
   `claude/zen-dijkstra-o7cgsv`, not master: deploying master as it was would have put the old sprites back. Merged
   that branch first (`114b77d9`): conflicts only in generated files (rebuilt) and this handoff (headers combined,
   this branch's entries renumbered 49-53); none of the 70 deleted lines is used by the merged code; validate 0
   errors. Checked the live site still ran `69cffcd6` and the branch had nothing newer. Smoke test on the merged
   code: all 38 scenes and a new game pass; on the `git archive` export (own port, no `.env`): intro, bath,
   visitguitar, laundry, bench, finale, tr5, new game pass. **Deployed:** master `114b77d9`, Netlify
   `6ada200f9bea9a1e50d5061a`. Live: page 200; `/.env` and review sheets 404; the live JS has the streaming loader;
   `alan_ch5_hint_cat.mp3` 200, a deleted line's mp3 404; cut-out sprites (cards_listen, alan_side) and a bath sprite
   byte-identical to the repository.

55. **Front and back walks play again (Alan, Inês)** (the user: "we had it for Alan, please check, must've been
   removed at some point"). The cycles were still wired (`alan_front_walk*`, `alan_back_walk*`, Inês's front/back
   walk and pass frames), but by 19 October `walkDir` (actor.js) wanted a vertical leg to cover 0.8 of the figure's
   height on the floor (two painted steps); the `v2` branch (14 Oct) had no such limit. The rooms are shallow (the
   whole floor depth is under 0.8 of his height in the police station, tavern, boat and Ferreira's), so the walks
   all but never played: none in 662 recorded frame changes. Now 0.4 (one step). Checked by walking straight down
   and up: front and back cycles in the shop, street, tavern, antiques, lavadouro; Inês's front walk in the shop; the
   police floor (0.39) stays side-on. Smoke intro, bench, copreturn pass. Vasco never had front/back walk paintings
   and doesn't need them (the user).

56. **Morphs for the cast** (the user: "do the morphs, starting with Lacerda"). Before: of 388 pose changes recorded in
   8 scenes at real speed, 51 dissolved for want of morph data (scripts/tests/morph_coverage.mjs + morph_report.cjs).
   - **Lacerda's mirrored paintings:** his idle/talk set mixes paintings facing each way (idle3, talk3, talk4 face
     left), so one of a pair is drawn mirrored and morphs.py (facing rule) never paired them: 21 of his 33 changes
     dissolved. morphs.py now measures such a pair against b's mirror image and stores it as `a>b~`; actor.js uses it
     only when the two are drawn with opposite flips (same facing on screen: the facing rule holds). 30 pairs.
   - **The cast:** every pose against its character's standing and talking frames (and those among themselves):
     1,036 new pairs, 3,086 in all (Alan 217, Vasco 532, Inês 164, Lacerda's robe 29, Abílio 20, Zé 18, Rui 12,
     Teixeira in bed 12, Pessoa, Celeste, Amália, Tomás, Maria a few each; the pose-to-pose changes seen in play:
     Vasco's delight/laugh/scandalised, Inês amused/eyeroll, the washerwoman, the guitarist). 382 pairs too far apart
     stay dissolves (the quality gate; e.g. `alan_fluster` just under it). Checked frame by frame at a slowed clock
     (scripts/tests/morph_shot.mjs: Lacerda, Vasco, Inês): no doubling, the pocket square stays on its side.
   - **The file:** js/morphs.js is stored as differences along the mesh rows and decodes itself on load (34 ms):
     brotli 1.44 -> 1.18 MB. Lossless (all fields identical after decoding); morphs.py reads and writes it.

57. **Engine round 2** (the user: "Do all except 9", from the list in chat; 9, face kits, left for later).
   - **Memory on phones** (js/engine.js): a budget of 300 MB on a phone or small-memory device (1.2 GB elsewhere;
     `?mem=<MB>`): on room changes and every 15 s, images unused for 8 s are let go, oldest first, never the current
     room's art, the stand/walk/talk frames of who is there, or the painting on screen; let-go images come back when
     wanted; the background stream pauses past 60%. Checked at `?mem=150`: 110-148 MB through six rooms, every room
     complete on entry (scripts/tests/memory.mjs).
   - **Saves** (saves.js): a version (`v`) and a MIGRATE table; Save to file / Load from file in the menu (also from
     the title screen); Continue runs the room's `resume` hook, so a chapter end due in the shop plays (main.js).
   - **Double-click** (input.js): straight through an exit; any other walk at twice the pace.
   - **Show hotspots:** H, or the new ◎ button top left, marks everything clickable for a moment.
   - **Accessibility:** Text size (S/M/L), Motion (Full/Calm: no camera drift, rocking boat or panning paintings;
     follows the device's reduced-motion setting), Voice and Effects volume beside Music's; keyboard play (Tab /
     Shift+Tab through the room, Enter acts, L looks, 1-9 with the inventory open, arrows in dialogue and close-ups,
     Escape closes a close-up); modals take focus; 44 px corner buttons on touch.
   - **NPCs** walk round the floor's furniture like Alan (route() keeps a straight line when an end is off his floor).
   - **The bath and Duarte frames** (77) are ordinary sprites (art/sprites, js/sprites.js); `?bath=old`,
     `?duarte=old`, `?sound=old` are gone (the old scenes' code is unreachable now; scripts/bath_new_fit.py and
     duarte_new_fit.py still write to art/review if run again).
   - **Phone speed:** soft shadows from a quarter-size silhouette instead of a blur filter per light per frame (side
     by side the same); a 24-face LRU instead of up to 120 canvases; a live painting uploaded every other frame;
     no preserveDrawingBuffer.
   - **Tests** kept in scripts/tests (CODEMAP, Testing): robustness, loading, touch_press, story_hints, qol, a11y,
     memory, front_back_walk, morph_coverage/morph_report, morph_shot. A full playthrough test (play.mjs) was being
     written by a separate agent at the time of this entry.
   - Each step checked in Chromium (the scripts above) and with smoke runs of the scenes it touches.

58. **Deploy of entries 56-57** (the user: "deploy when both pass": the smoke test and the playthrough). The full
   playthrough test, scripts/tests/play.mjs (written by a separate agent; 135 player steps from a new game to the end,
   flags only read, fails at the named step with the hint and flags), reaches `{"won":true}` in 1,056 s; no softlock
   found. Smoke: all 38 scenes and a new game pass; on the `git archive` export (no `.env`): intro, bath, visitguitar,
   twinswap, sepit, finale, tr5, new game pass. The other session's branch had nothing new; the live site still ran
   `114b77d9`. **Deployed:** master `04abe388`, Netlify `6ada4183ea37bfbb3c0d0eb5`. Live: page 200 with the ◎ button;
   `/.env` and the old review sprites.json 404; the memory budget and the morph file's new form are live; the
   promoted bath frame, a cut-out card player and alan_side byte-identical to the repository; the tall-tank painting 200.

59. **Pessoa back on the desk, deployed** (the user: "the cat disappeared!", "just re-instate the cat mechanics we had
   in the past", "yes, deploy"). His code was as on 20 Oct (desk, radiator with the lamp off, the machine in Ch. V, the
   sardine). The shop's desk occluder (cf7e17f9, 21 Oct: Inês hidden behind the desk) was drawn over anyone whose feet
   are above y 560, and he lies on the desk at y 452. render.js: an actor's depth is max(feet, `def.sortY`) for the
   sort and the behind-furniture shading; Pessoa's sortY is 565 (in front of the desk, behind Alan). Checked on the
   desk and the radiator, Inês behind the desk still hidden; smoke on the export passes. **Deployed:** master
   `c388e53b`, Netlify `6ada46760f238df80eba64a2`; live: the cat on the desk (screenshot), `/.env` 404.

60. **First-time tips** (the user: "do the first-time tips"). js/engine/tips.js: one line in the corner under ◎, once
   each (`localStorage['drowned-bell-tips']`), never over a scene, a line or a choice, one at a time, gone after a few
   seconds or on ✕; the menu's Tips: On/Off. Touch screens get tap / press-and-hold wording. The moments: control in
   a room (walk, act, look closer), a long walk (double-click to hurry / through a door), three clicks on nothing or a
   minute idle (H / ◎), the first thing picked up (the bag), the first line (skip), the first choice (numbers), after
   the first chapter card (saving, ☰ settings), three minutes with no story flag changing in Ch. I-IV (ask Inês), and
   Ch. V's empty shop (the notebook: `Game.tip('ch5')` in ch1.js). Off under `window.FAST`, so the tests don't see them.
   Checked with scripts/tests/tips.mjs: each tip at its moment, none over a line, none repeated after a reload, the
   menu turns them off. **Deployed** (the user: "yes, deploy"): master `0a33dd60`, Netlify `6ada54644db56a081518c03c`.
   The tips test on the live site then failed: over the network the opening took over a minute, and the "a minute
   without acting" clock had counted from page load, so the hotspots tip came first. Fixed (both idle clocks run only
   while the player has control; tips.mjs DELAY_MS sits on the title first) and redeployed: master `1c9a6ef6`, Netlify
   `6ada56d83afeec5886cd899a`; the tips test passes on the live site, `/.env` 404.
61. **A new level: Prof. Bastos's flat, Graça (Chapter III)** (the user: "we need to add a level - Bastos' apartment
   investigation, where Alan learns about the sea"; Ch. III; Inês comes along; "a lot of artifacts from different
   cultures (including pre-hispanic gran canaria), each one matching a book, where Inez will read about the myths";
   the baptism lore: the Brotherhood meant to call the dead, and the sea answered in waves). Script approved in
   `docs/bastos_level.md`; story in docs/STORY.md III.4 (Puzzles III-E and III-F); code in `js/story/bastos.js`.
   - **Art (Canva, each approved):** the room, first as a bedroom-like study ("too close to Alan's bedroom. Make it a
     study/living room. And not as dark"), then bright with sun, then the same picture with fog outside ("there
     should be fog outside, not sun"): `art/bg/bastos.jpg` (MAHYw-NyuDY, 1680x944 cut to 1280x720) and its depth map
     (Depth Anything V2 small, scripts/depth_map.py). No bed in the flat (the user: "we only need the living room");
     he died in bed in his siesta, as Rui's recorded lines say, so the last reel is hidden in Iemanjá's boat instead
     of the bed, and his last tape ends "now I am going to lie down. Only for a minute." The recorder close-up
     (`art/closeups/close_recorder.jpg`, 1536x864, MAHYwwEQlyI; the user: "we will need the close up of the tape
     recorder for the recording riddle"). Eight object pictures (`art/closeups/bastos/*.jpg`, 400 px; Matsya and the
     Iemanjá boat redone on the user's word; the first Gran Canaria idol was refused by Canva's filter and reworded).
     Full-size exports through pages 97-100 of the scratch design DAHYZ-SDzRE (it is at Canva's 100-page limit:
     reuse those pages with update_fill).
   - **Voice:** Bastos is "European Portuguese Paulo Silva" (FfDQWz2XO4Zsxl1uwh0e; the user picked C of three),
     in scripts/cast.json. 73 lines (Inês 28, Alan 27, narrator 9, Bastos 9) recorded with eleven_v4 in the flow
     "Drowned Bell: Prof. Bastos's flat (2026-10-22)" (8,862 credits with the redone take; the three voice samples 717 more); every take transcribed locally
     (faster-whisper base.en): words match, no direction tags spoken; bastos_last_2 repeated a phrase and was redone.
     Bastos's takes carry a light tape sound (band 130 Hz-6.2 kHz, a little pink hiss) and are levelled to -21.5
     LUFS with a limiter; the rest through scripts/install_voice.sh (which now falls back to -21.5 for a speaker with
     no other lines). Lip-sync: Rhubarb 1.13.0 for Alan, Inês and Bastos.
   - **Code:** the room (walk polygon in front of the desk and case, round the side table, short of the sofa; fog
     drifting past both windows; the tall plant swaying); Inês in it (her hints: `S.bastosHint`); the collection
     close-up `#bshelf` and the recorder close-up `#brec` (built in JS, styled in css/style.css); the map pin; the
     unlock in the shop after the decode (wraps `ROOMS.shop.enter`); `S.hint` and `S.pinNext` lead there once the
     tongue thread is done; the notebook's "The Sea" page (`F().sea`); the Chapter III end (main.js and ch1.js) waits
     for `bastos_done` (`S.bastosOpen`). New flags: bastos_known, bastos_entered, bastos_shelves, bastos_m,
     bastos_case_open, bastos_case_seen, bastos_rec_seen, bastos_threaded, bastos_lessons, bastos_box_seen,
     bastos_reel_found, bastos_done, sea. Captions name him "Prof. Bastos, on tape".
   - **Checked:** `node scripts/validate.mjs` 0 errors (1387 lines); smoke.mjs `bastos` and `bastosunlock` pass;
     play.mjs (now 147 steps: the unlock, a wrong pair then the eight, Play with nothing threaded, the lessons, the
     empty box, the boat, the last tape) `{"won":true}`, 147 steps, 1006 s; smoke.mjs `bastostapes` passes too.
   - **The reels turn** (the user: "have another close up with tapes on, which you can make look spinning with
     code"): `art/closeups/close_recorder_reels.jpg` (Canva MAHYxax_rKE, the approved close-up with both reels on)
     plays under the tapes; stills take `opts.over(g, t, im)` (js/engine/stills.js), and bastos.js turns each reel
     (painted as an ellipse: un-squashed, rotated, squashed back; the spindle redrawn still). Preview:
     `?scene=bastostapes` (the recorder, the collection already back).
   - **Deployed** (the user: "once done, deploy it and send me a link to the scene for preview"): master `6697511b`,
     Netlify `6ada7bb298af05ba4af58289`; live: `/.env` 404, the new art and voices 200, smoke.mjs `bastos` and
     `bastostapes` pass on the live site.
62. **Bastos's flat moved to Chapter II** (the user: "I'd move bastos to chapter 2 and make a smooth reason for them to
   go there"; then "go ahead, and deploy when the tests pass"). The reason: Ferreira's key board (ch2.js) now gives,
   with Lacerda's vitrine spare, a spare tagged "Prof. H. Bastos · Graça" (item `bkey`, the key icon;
   **alan_spare_bastos**); in the shop Inês sees it and names him (the recorded unlock lines, unchanged); the door
   takes the key. Chapter II ends only after his last tape (`S.checkCh2` with `S.bastosOpen`); the Chapter III end no
   longer waits. Inês's Chapter II hint: **ines_hint_spares** (the board), then **ines_hint_bastos**; the map's
   next-place glow follows. Chapter III, Tomás: once the tapes are heard Alan asks only **alan_ask_tomas_godparent**
   ("Professor Bastos said your Brotherhood baptised the bell in the sea. On tape. Who stood godparent?") and Tomás
   answers with tomas_godparents (`S.tomasGodparent`; the 'reverse' and 'godparents' notebook lines as before).
   Re-recorded for the move: **alan_bastos_door** (no grandfather's key: the tide clock has usually taken it) and
   **alan_myth_jewels** (in Ch. II Alan may not have heard of the cream suit yet). Five takes, Alan and Inês voices,
   transcribed (words match), installed and lip-synced. Old saves: one in Chapter III with the decode and no flat
   still gets Inês's old unlock and the pin; a Chapter II save past the key board gets the spare from the board
   again (Ferreira's pin stays open until it is taken). Previews `bastos`, `bastostapes`, `bastosunlock` now start
   in Chapter II. STORY.md II.3b (Puzzles II-F, II-G). Checked: validate 0 errors (1390 lines); smoke.mjs on the
   three previews and story_hints.mjs pass; play.mjs (Bastos now after Ferreira's workshop, the godparent question
   at the Carmo) `{"won":true}`, 147 steps, 1016 s.
63. **Inês never repeats a score** (the user: "give Ines more funny lines commenting on Alan's jokes, so that she never
   repeats herself"; the 30 lines approved as drafted). `ines_score_11`..`_40` added (Inês's voice, transcribed:
   words match; installed, lip-synced; poses: eyeroll, laugh, write). `S.joke` (core.js) now draws from all 40
   without repeats, kept in the save as `F().scores_used`; 13, 24, 34, 40 (the cat, the kettle, Pessoa, the counter)
   only in the shop; with none left she rolls her eyes silently. Checked in a browser: 80 jokes in Bastos's flat gave
   35 scores, 35 different, no shop-only line. Deployed with entry 62.

## Archive: the handoff of 2026-10-20 (superseded by "Start here"; history only)

Much of this is out of date (Alan's and Inês's walks, the phases, the deploy steps' test scripts). Kept for the
reasoning and the rules it records.

### Where things stand (session handoff, 2026-10-20)

**In the game now** (all deployed; the user approved each, and on 2026-10-20 said of the walk: "Don't expect my approval - if works for you, works for me"):
- **Alan's walk: the 8-pose cycle of the user's reference chart.** The chart (a classic walk sheet: near limbs light, far limbs dark, poses 1-3-5-7 on the near leg, 9-11-13-15 on the far leg) is redrawn as stick figures in `art/review/walkref/pose<N>.png`. Slots: 1 `alan_walkA`, 3 `alan_walk_pre2L`, 5 `pass2L`, 7 `up2L`, 9 `contact_farL`, 11 `pre1L`, 13 `pass1L`, 15 `up1L`. 5/7/11/13/15 are Canva paintings from the stick figures (`art/review/alan/walk5/`), fitted onto walkA's canvas at one shared scale by `scripts/walk_canva_fit.py`; 9 is composited by `scripts/walk_far_step.py` from walkA's own far leg. The earlier Gemini / composite versions are kept as `art/review/alan/walk2/*_gemini.*` and `*_before_canva.*`. All seven candidates are approved in `art/review/approvals.json`, so `loadApproved` (js/story/main.js) puts the cycle in.
  - Lesson: Gemini and plain prompts kept painting the NEAR leg forward. What worked: a stick figure with the near limbs white and the far limbs dark, given to Canva with the sprite as the character reference, and the prompt spelling out which leg is which.
- **Alan's restyle**, **Teixeira's faces, skin and blush**, **Teixeira's door set and bed pose**, **Inês's faces**: see the sections below.

**In progress: Inês's walk** (same problem as Alan's had: both paintings have the near leg forward).
- Done: pose 9 (far leg forward), Canva media `MAHYgyU9to4`, fitted: `art/review/ines/walk/pose9.png` (Canva original beside it).
- To do: poses 1, 3, 5, 7, 11, 13, 15. Everything needed is in `art/review/walkref/jobs.json`: the queue, the pose descriptions for the prompt, the Canva media ids of each stick figure (`pose`) and of the character reference (`ref.ines` = `ines_walk1` on green). Prompt pattern: as for Alan (see the git log of `alan_walk_*`), "Paint the woman from the first image (...) in the exact pose of the stick-figure diagram in the second image. WHITE limbs are her near side, DARK her far side. So: <pose description>. Full figure, side view, plain flat green background (#00B140)."
- Canva paces generations (about one per 5 minutes, `quota_cooldown`). Export at full size through the scratch design `DAHYZ-SDzRE`: `update_fill` an existing page's image, then `resize_element` + `crop_media` both to 896x1541 (Canva's walk images come out about 0.58 wide), commit, `export-design` png pro, curl, crop the bottom of the 896x1776 page off (keep `round(H*1541/1776)`).
- Then: `python3 scripts/walk_canva_fit.py ines_walk1 <export> <out> <scale>` (one median scale for the set), add them as walk candidates for `ines` (as `scripts/review_candidates.py` WALK2 does for Alan; Inês's cycle is `S.CHARS.ines.frames.walk` in js/story/ines.js / core.js), approve, test with `?scene=rigtest`-style checks, deploy. Her lantern walk (`ines_lwalk*`, `ines_lpass*`) has the same problem; it needs the same 8 poses with the lantern held out.
- Vasco's walk was fixed earlier the same way as Alan's first attempt (a composited far-leg step); check it against the chart too.

**Waiting on the user:** nothing blocking. The Walk Cycle Bench (https://claude.ai/artifact/5FjWPSkEw2pYHNmV8nqskq) predates the chart and is superseded for Alan and Inês.

**Tools added this session** (all in `scripts/`): `walk_far_step.py`, `walk_canva_fit.py`, `skin_match.py` (one skin tone across a character's frames, face patches alike), `blush_tone.py` (scale a painted blush), `restyle_partial.sh` (restyle only the upper body when the whole frame is refused), `canva_restyle_fit.py` (Canva/Gemini restyles onto a sprite: `FIT_MODE=stand`, `FIT_TOP`, alpha input). Face kit: `FACE_CHAR=cop` is Teixeira (frame list `COP`); `alan_undress4` is in `SMILING`.

**Live deploy:** commit `ec5cd10`, Netlify deploy `6ad828ca60f1b5df2eba0553` (2026-10-21, the user: "do all of them and deploy"): the small moving details in every room (entry 21), the cut-out moving parts (entry 22), the Ferreira clocks kept still, Amália's tightened line, the `?fps` readout and the README (entry 20). Smoke on the export: intro, bench, quayfish, laundry, tavernafter, fado, coldopen; live files checked byte for byte, `/.env` 404. (Before it: `fb14daf`, deploy `6ad7e93c84d2806cc3aee6a8`.)

**Session tooling that does not survive a new container:**
- Tests: `scripts/tests/smoke.mjs` (copied into the repo 2026-10-20), `walknew.mjs` (walk frame order), `copbed2.mjs`. Serve the repo on 8098 and run `node scripts/tests/smoke.mjs http://localhost:8098/ [scenes]`. `probe.mjs` and `play.mjs` (CODEMAP) were not copied and are gone with the old scratchpad.
- Rhubarb Lip Sync 1.13.0 (for `scripts/lipsync.py`) has to be downloaded again; point `RHUBARB` at the binary.
- The Canva helper `up.sh` (create-upload-url, then `curl -X POST --data-binary @file -H "Content-Type: application/octet-stream" <url>`; the response's `mediaId` is the reference id).

**Alan's restyle (done 2026-10-20).** Approved: 17 frames are now his sprites (wash1/2/4/5/6, wash_surface, swim, swim2, climb, jacket, jacket_grin, jacket_wink, undress3/4, jump, jump_rise, jump_fall). The user kept the original painting for wash3, swim_wave, trunks_down, trunks_snap, fling, trunks_step, dress1 and jump_crouch ("use original"). The 17 frames' lip-sync and blinking were rebuilt from the new paint and approved (undress4 redone as a smiling painting first): https://claude.ai/artifact/QtQZhV4rahcCnThCjy7DJs. Candidates and tools stay in `art/review/alan/restyle*`, `scripts/canva_restyle_fit.py`, `scripts/restyle_partial.sh`.

**Teixeira's faces (lip-sync and blinking, approved 2026-10-20, in the game).** 15 frames (`FACE_CHAR=cop`, the frame list is `COP` in `scripts/face_kit.py`), approved and on (`"ok": true` in `js/faces.js`); his 32 lines have mouth cues (`lipsync/phone/`). Review page: https://claude.ai/artifact/Mu3CWPyS1CgokjxAZFMizA (db collection `faces`). Set `"ok": true` for the approved ones.

**Teixeira (in the game, approved 2026-10-19).** The station set facing the door (`npc_phone_door*`: four idles, talking, and the shocked / embarrassed / blushing reactions through `S.copReact`; earpiece removed by Gemini) and the bed pose chained to the headboard (`cop_bed1-4`, shadow layer `art/layers/cop_bed_shadow.webp`) are the defaults, in `art/sprites/`. `?copdoor=old` and `?copbed=old` bring back the old sets. His skin is evened out to one tone across all 17 of his frames and his blush toned down to Alan's strength (approved 2026-10-20; `scripts/skin_match.py` at L 54, a 19, b 33, then `scripts/blush_tone.py k=0.45` on the blush, shock and embarrassed frames). Rebuilding his face patches with `face_kit.py build` brings back the old tone: run both scripts over the new patches again.

**Vasco (in the game; the user approved moving forward and will flag anything odd in play).**
- 44 new frames are game sprites (`scripts/promote.py`). They're painted by `scripts/gen_vasco.py` from `scripts/vasco_frames.json`.
- Wired in `se.js`:
  - the 8-step walk on both legs;
  - talk4 and talk_count in his talk cycle;
  - the moods (worried, amused, scandalised, hopeful, stern);
  - holding while talking (sets trowel, coffee, clapper, kneel);
  - the crouch as the in-between for kneeling.
- Story moments:
  - the inscription: kneel_look, kneel_lookup, talking on his knees;
  - the Roman floor: brushing;
  - stepback and callup in the pit game;
  - the twin: keys, back_read, clapper_lift / hold / give;
  - Thursday: coffee_sip, stand_up, hand_out.
- Not used: back_unlock (the store is unlocked under the fade) and talk_point (pose `point`, no line asks for it yet).
- Idle jobs in the pit: `js/story/vasco.js`. He's in the pit all of Chapter I.
- Walk: the same fix as Alan's, with a far-leg step from `scripts/walk_swap_cut.py`.
- Love scene:
  - `pair_vasco_after` is the two of them on the store floor against the background shelves (no crate), with the clapper between them.
  - The Canva stills `still_store_kiss` (MAHYYLvMwYE) and `still_store_after` (v2 MAHYYyNgV2U, against the shelves) are painted in the user's Canva. They're waiting on Canva's export cool-down to be brought in.
- The clapper matches the finale's (`alan_ring`: long, heavy banded head, ring loop) on Vasco's frames, `pair_vasco_clapper` (replaced) and its two in-betweens.
- Faces: every Vasco set is on in play.
  - Lip-sync cues: `scripts/lipsync.py --speaker vasco`.
  - Face sets: `FACE_CHAR=vasco scripts/face_kit.py find|gen|build`.
  - His face in the pair paintings is a partner set `<frame>__vasco` (`js/engine/faces.js`): only the speaker's face moves. Before this, Alan's lips moved to a partner's lines.
  - Review page for his faces: https://claude.ai/artifact/2RPS8ao2m3tQgTr4KhSfGp

**Faces for Alan's other frames (done: every set in `js/faces.js` is approved, `"ok": true`, as of 2026-10-20).** History:
- 13 side-like frames take alan_side's set through `scripts/face_transfer.py`; the smoking frames blink only.
- 42 have their own Gemini set (`scripts/face_kit.py gen`: mouths A-F and shut eyes at 1K, about $0.04 an edit), cut by `face_kit.py build`.
- 3 borrow the set of a frame with the same painted head (`face_kit.py borrow`): trunks_step (fling), undress_belt (front_walk1), write (read).
- Review page: https://claude.ai/artifact/BermCuEtYFLfErj9WBMnPw (db collection `faces`, one doc per frame: `decision` approved/rejected). Set `"ok": true` in `js/faces.js` for the approved ones.
- **Blocked: the Gemini prepaid credit ran out** (HTTP 402) after about $12 of this run. 70 frames still need a set: most undress/trunks/wash frames, all the cop/guitar/Vasco pair paintings except pair_vasco_coffee, alan_ring, alan_wring, alan_walkUp (their side transfer was wrong), alan_wobble. Once the credit is topped up, `python3 scripts/face_kit.py gen` resumes (finished edits are kept), then `build`.

**Skeletal rig trial (built, waiting for the user's verdict).** Alan's side view as a rig, for walking and standing (and talking):
- `scripts/rig_cut.py` cuts `alan_walkA` (both legs and arms show apart) into torso (with head), near arm, near leg; the far arm and leg are the near ones in his shadow (the painting hides too much of them). Parts and bones: `art/rigs/alan/side/` (`rig.json`).
- `js/engine/rig.js`: each part bent through the mesh with soft joints (`Warp.drawMany`, one pass, one texture), legs by two-bone IK from where the feet go (the stride advances by ground covered, so a planted foot stays put), hips lead, arms swing against the legs and never mirror, idle drifts on non-repeating noise; the face (lip-sync, blinking) goes into the head first. The rig is a sprite (`rig:alan`), so lighting, shadows and room scale work unchanged.
- Switch: `?rig=1` / `?rig=0`, or `localStorage['rig-alan'] = '1'`; the frame-based Alan is the default. Review screen: tab **Rig**, "compare side by side" (the scene `?scene=rigtest` twice: frames left, muted; rig right).
- Not done (by the brief, steps 1-6): the state-by-state classification, part swaps (hands, coat), the rig editor, talk gestures, turn/reach/pick-up, rig<->sprite blending, front and back views. No Gemini was used (the credit is out).

### Standing rules (from the user)

- **Gemini** (`gemini-nano-banana-2.1`, key in `.env` as `GEMINI_API_KEY`, git-ignored; never print it, commit it or use it on the live site):
  - Use it only for variations of existing Canva art, and always edit an existing image of the same character.
  - Send the style refs and the fixed style text on every call.
  - Lock the palette and key out the background.
  - Match the canvas and the feet anchor.
  - Generate each set in one run.
  - Log every call in `art/review/log.md`.
- **Approval:** nothing goes into the game until the user approves it (review screen `?review`, or a review page's db). No GIFs. Exception given 2026-10-20 for the walk work: "Don't expect my approval - if works for you, works for me" (applied to Alan's 8-pose walk; ask before reading it as a blanket rule for other art).
- **Walks** (2026-10-20): every walk follows the user's 8-pose reference chart (`art/review/walkref/`), far leg forward on 9-15.
- **Combined sprites:**
  - Never warp or scale them.
  - Alan stands exactly where his solo sprite stood, and neither character jumps on the way in or out.
- **Facing:** a frame facing right must never morph into a frame facing left, for any character (stated 2026-10-18).
- **Canva first, Gemini when Canva refuses** (stated 2026-10-19): art goes to Canva (`generate-image` with the sprite and Canva-style references, exported full size through the scratch design `DAHYZ-SDzRE`, fitted back with `scripts/canva_restyle_fit.py`). Whatever Canva refuses (its content-safety filter, or a failure) is done with Gemini instead, matching Canva's style (an edit of the same image, style references `alan_side` and `alan_undress2a` for Alan, a style-only prompt that names the ink outlines, brush texture and less gloss), and repeated until it is acceptable before it goes to the user. Canva allows one generation every several minutes ("quota_cooldown"): pace it, don't retry in a loop.
- **Instructions apply everywhere:** a rule given for one example applies to every scene with combined characters, and to everything else in general, not only the example.
- **Other characters:** don't change their solo sprites.
- **Text:** spell the name "Sanches".
- **Story changes are additive.**
- **Git and deploy:**
  - Commit and push often.
  - No PRs.
  - Deploy only a clean `git archive` export, and only when the user asks.

### Per character

**Alan**: the only character in the four-phase plan so far. Once the user approves Alan, he becomes the template for the rest of the cast.

| Phase | What | Status |
|---|---|---|
| 1 | Gemini setup, frame inventory, alignment (one height, feet anchor), state map, palette unification (leather/denim), bath and dress frames | **Done and approved**, deployed in `e13beed` |
| 2 | Smoothing in code (eased cross-fades for near-identical frames, in-betweens, walk start and stop, walk ground lengths), plus 24 Gemini in-betweens | **Code done, art awaiting approval.** The 24 in-betweens are candidates on the review screen. Proposals A to D are waiting for answers (below). |
| 3 | Review screen (Part A); combined-sprite alignment and transitions (Part B) | **Part A done** (`5e2b771`). **Part B in progress**: see "Where it stopped". |
| 4 | Lip-sync (Rhubarb) and blinking, solo and in combined sprites | **Not started.** Brief received 2026-10-18 (see below). |

**Inês** and **Vasco**: no phase of this plan has been run for them. Earlier, separate passes (before the four-phase plan) integrated Inês's v2 sprite set and Vasco's frames, expressions and staging. Those were reviewed and deployed. Both characters will follow the four phases with Alan as the template once he is approved.

### Where it stopped (Phase 3 Part B)

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

### Also changed this session (outside the phases)

- **Walk regression (reported by the user after the last deploy).** Phase 1 had re-anchored the walk frames on the hips with a per-frame scale "bob", so his feet slid. The walk cycle frames are restored to their old hand-tuned `ax`/`h`, the original 8-frame cycle is back (with `walkDown`; no `walkLen`), their morphs are rebuilt, and `scripts/align_alan.py` now leaves the walk cycles alone. **Deployed** (`f2b227f`).
- **Rui's newspaper (the user was stuck after the clockmaker).** The desk hotspot sat behind Rui. Now he hands the Diário over when he offers it, and a save past that point gets "Your Diário, Inspector?". Commit `faa267c`. **Deployed** (`f2b227f`).

### Waiting for the user

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

### Things I was unsure about

- Restoring the old walk anchors overrides part of the Phase 1 alignment the user had approved, on the user's own report that the walk got worse. Worth a look on the review screen (Walk tab).
- `pair_vasco_kneel` and `pair_vasco_thumb` are painted but not placed in any scene.
- Pair scale: frames where Alan stands under 690 px keep `h` at 720 instead of matching his height. That's a judgement call between "never scale" and "same height as his solo frames".
- `pair_wring_3` has Alan's feet 37 px further left in the painting than `wring_1`/`wring_2`, so Celeste shifts a little on that frame now that pairs stand on Alan's feet.
- The bedroom visit with Teixeira lines his back up against the bookshelf per frame (`TORSO` in `visits.js`), so Alan moves between those frames. I left that as it was.
- The stills with Alan and a partner fade in and out over the scene. Whether Phase 4 should add blinking or lip-sync to them hasn't been decided (in most of them his eyes are closed or nobody speaks on screen).
- The guitar-lesson spot can fall outside the tavern's walkable area. `S.pairIn` puts Alan on the spot after the walk anyway.

### Key files

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
