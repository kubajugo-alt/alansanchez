# Animation handoff

State as of 2026-10-20. `master` now carries everything (it was fast-forwarded to `lore-se-museum`; work on
`master` from here). The live site (https://alan-sanchez-drowned-bell.netlify.app) runs the deploy recorded
at the end of this section.

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

## Where things stand (session handoff, 2026-10-20)

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

**Live deploy:** commit `fb14daf`, Netlify deploy `6ad7e93c84d2806cc3aee6a8` (2026-10-20): every walker's new walk is live: Alan and Inês on the cycles the user built in the editor (entry 19), the other six as in entry 17. Smoke on the export: intro, ineskey, bench, laundry; on the live site Alan and Inês load their walk7 cycles with step lengths; live files checked byte for byte, `/.env` 404. (Before it: `3de0a82`, deploy `6ad7e68d92574a66573bfd21`.)

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

## Standing rules (from the user)

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
