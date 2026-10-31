# How we work on Game II (the pipelines)

Written 2026-10-30, at the user's request ("make sure that the documentation holds instructions about everything we did
in terms of animations, sea, sounds, environment movement etc - so that new sessions know exactly how we operated").
`HANDOFF.md` is the log (what changed, when, why, how it was checked); `CODEMAP.md` is the code; this file is the
method: for each kind of work, the tool, the script, the files it writes, and how it was approved. The numbers in
brackets are HANDOFF entries with the detail.

## 0. The rules that govern all of it

- **Nothing goes into the game without the user's approval.** Art, animation, voices, music: make candidates, show
  them (a review page, a sheet, a clip, a recording from the game), wait for the word, then install. Text changes the
  user asked for go straight in, but are shown (a recording) before a deploy.
- **The room paintings (`art/bg/`) never change once approved.** Everything that moves is drawn over them at run time
  (room movement, the sea loops, extras, props). A different look of a room is a *new* painting file beside it (the
  lobby by day, the sunny beach), switched by `bgFn`; real-place repaints were made only when the user asked (60, 61).
- **Deploy only when asked**, from a clean export (section 12). Never print or commit the keys in the root `.env`
  (`ELEVENLABS_API_KEY`, `LUDO_API_KEY`, `GEMINI_API_KEY`).
- **The story decides**: check `docs/BIBLE.md`, `docs/story-bible.md` (dialogue rules, voice sheet, chapter map) and
  `docs/novel/the-shortest-night.md` before animating or writing anything that could carry meaning. The Sea is never
  shown but once, never funny, never given a voice. Santa Ana's clock stays stopped until wound; no bell moves.
- **Every change gets a HANDOFF entry**: what, where, how checked. Commit and push after each piece of work (the stop
  hook wants a clean tree; mid-work snapshots are committed as "WIP").
- Credits: Gemini about $19 of $23 used (stop at ~$20, ledgers in the scripts); Higgsfield credits (check `balance`);
  Ludo credits (check before a run); ElevenLabs (the user's plan). The user does **not** want other voices or cloned
  voices as a fallback: if ElevenLabs runs out, stop and say so.

## External services (what each is for, how it's reached, what it costs)

| Service | Used for | How we reach it | Notes |
|---|---|---|---|
| **ElevenLabs** | every voiced line (2,500+), voice auditions | API from `scripts/generate-voices.mjs` with `ELEVENLABS_API_KEY` in the root `.env`; the ElevenLabs MCP connector (`creative_list_voices`, `creative_generate_speech`) for searching the library and quick samples | Library voices only (no designed, no cloned voices, no other providers). Credits on the user's plan; ~120 lines a minute. |
| **Higgsfield** | images (`gpt_image_2_5`: cast and extras designs, outfits, props, room repaints, day/night edits, film paintings) and video (`kling3_0`: the sea loops, the opening film) | Higgsfield MCP: `generate_image(_batch)`, `generate_video(_batch)`, `jobs_wait`, `media_upload` + `curl PUT` (headers `Content-Type`, `If-None-Match: *`) + `media_confirm`; download `result_url` with curl | Credits: check `balance`. Image ~2.75 credits, Kling pro ~12 per 8 s. Decline its suggested presets with `declined_preset_id`. It has ElevenLabs inside, but not our library voices: not for the game's voices. |
| **Ludo.ai** | sprite animation (walk cycles, talk loops, the undressing) | API `https://api.ludo.ai/api` from `scripts/ludo.py`, `LUDO_API_KEY` in the root `.env` | Credits (~420 left at the last count). hydra refuses on moderation: use `--model forge`. |
| **Google Gemini** | face patches (mouths, eyes, emotions: `gemini-nano-banana-2.1` in `face_kit.py`, `face_emotions.py`) and the room music (Lyria 3 Pro, `gen_music.py`) | API, `GEMINI_API_KEY` in the root `.env` | Budget $23, about $19 used: ledgers in the scripts stop at $20. |
| **Canva** | the first rooms and cast designs | Canva MCP (`generate-design`, `export-design`, uploads); `scripts/canva_in.py` imports exports | Has cooldowns; Higgsfield took over when it cooled down. |
| **Netlify** | hosting: project `alan-sanchez-shortest-night`, site `a5e71264-d9a4-439a-b1e5-60ec3f98812d`, https://alan-sanchez-shortest-night.netlify.app | Netlify MCP `deploy-site`, then the `npx -y @netlify/mcp@latest --site-id ... --proxy-path ...` command it returns, run from the export folder | Deploy only when the user asks (section 12). |
| **GitHub** | the repository `kubajugo-alt/alansanchez`, branch `claude/sequel-shortest-night` | git (push through the session's proxy); GitHub MCP tools for pull requests | Commit and push after every piece of work. |
| **claude.ai Artifacts** | review pages (voices, animations, emotion tags, music, storyboards) and the placement tool | the Artifact tool (publish/read), `ArtifactData` for their databases (`verdicts`, `notes`, `placements`) | Private to the user. Reading a page's db is how we get the user's verdicts and placements. A session can watch at most 10 artifacts. |
| **OpenStreetMap** | the map of Las Palmas (`scripts/map_from_osm.py`, from a stitched tile render) | one-off | © OpenStreetMap contributors (ODbL), credited in the game. |
| Local tools | Rhubarb Lip Sync 1.13 (`RHUBARB=` path; not in the repo, https://github.com/DanielSWolf/rhubarb-lip-sync), OpenCV models `scripts/models/yunet.onnx` and `sface.onnx` (faces), ffmpeg, Playwright + Chromium (`/opt/pw-browsers/chromium`), Python (numpy, Pillow, opencv) | | |

## 1. Rooms (paintings, layout, day and night)

- **Painting**: Canva (`scripts/canva_in.py`, record in `art/canva/log.md`) for the first set; later real-place
  repaints in Higgsfield, `gpt_image_2_5` with the old painting and the user's photo as `image_references` (60, 61).
  Old versions kept in `art/designs/rooms_real/old_*`.
- **Layout** (`js/story/layout.js`): per room the walkable polygon (`walk`), the depth scale `[y0, h0, y1, h1]` (a
  figure's height in px at two floor lines), entries, hotspot rectangles (`spots`), walk-to points (`at`), cast stands
  (`npcs`), occluders (things in front of people, e.g. Chano's kiosk: polygons with a `y`). Measure on the painting.
- **Day/night or weather variants**: a second painting `art/bg/<room>_<variant>.jpg`, listed in the room's `bgs` (so it
  preloads) and chosen by `bgFn: () => ...`. The lobby by day (75) is the night painting with only its windows replaced
  from a Higgsfield day edit (an edit of the whole room lost the lettering): composite, don't re-generate.
- **Sharpness** (92): every painting goes through Higgsfield `upscale_image` (bytedance, `resolution: "2k"`, width
  1280, height 720: it returns 3840x2160; 2 credits each; at most 8 jobs at once), is downscaled to 2560x1440 (Lanczos,
  JPEG q88) and saved over `art/bg/<room>.jpg`; the 1280 original goes to `art/designs/rooms_1280/` first. The
  upscaler repaints fine detail, so check every room before installing: original beside upscale, a change map (both
  blurred, abs difference), then every detail the story names (`grep` the hotspot names and lines). Paste the
  original back, feathered, where a story detail changed (Rafa's easel drawing); keep the original where the whole
  thing got worse (the map). A new or repainted room: upscale it the same way once the user approves it. Scripts that
  read positions from a painting scale it to 1280x720 first.

## 2. Room movement (the environment, drawn over the paintings)

As Game I (its entry 21), approved in 28: each room's `animBack(g, t)` draws over the painting, deterministic in `t`.
Helpers in `js/fx.js` (`sway` for palms and plants, `ripple`, `water`, `billow` for curtains, `flame`, `glow`,
`flicker`, `shaft`, `motes`, `birds`, `wisps` for smoke, `moth`, `twinkle` for stars, `rain`, `drips`, `leaves`, `fan`,
`drawClouds`), and local ones at the top of `js/story/tue.js`: `drift` (the panza de burro, a cloud bank clipped to the
painted sky), `foam` (a line of foam washing up a painted shoreline), `ceilFan`, `lamp`. Rooms can also have `lights`
(flame/gas glows) and `vignette`. Keep it small ("there's no wind"); never move anything the story keeps still. Review:
a clip per room on a page, then the user's word.

## 3. The sea (Higgsfield loops) (75)

1. Upload the room painting to Higgsfield (`media_upload`, then `curl -X PUT` with `Content-Type` and
   `If-None-Match: *`, then `media_confirm`).
2. `generate_video_batch`, model `kling3_0`, mode pro, 5 s, sound off, 16:9, **start_image and end_image both the
   painting** (so it loops), `declined_preset_id` when it suggests a preset. Prompt: "A painted game background brought
   gently to life. Locked-off static camera... Only the sea moves: waves roll in... Everything else stays perfectly
   still: <list the room's things>. Same painted style. The last frame matches the first exactly."
3. Check: per-pixel spread over the frames (only the water may move), alignment with the painting (it was exact, 2-3
   levels darker), first/last difference.
4. `python3 scripts/sea_clips.py <room> <video.mp4> ...`: finds where it moves (with an `ROI` per room to exclude a palm
   or a phone box), crops to that box, feathered mask, lifts the darkening; writes `art/video/<bg>.mp4` (h264) +
   `.webm` (VP9) + `_mask.png`, and `js/story/sea_clips.js` (`S.SEA`).
5. In the room's `animBack`: `if (!S.sea(g, '<bg>')) { ...the old canvas ripple/foam... }` (`js/story/sea.js` draws
   the playing loop through its mask; the fallback runs until the video can play). A night loop that came back still
   (the lobby) was simply not used.

## 4. The cast's sprites

- **Designs**: painted on flat green, full body, in Alan's hand-painted style. Canva first (prompts in
  `art/designs/repaint_queue.json`), then Higgsfield `gpt_image_2_5` with the approved cast sheet as the style
  reference (50). Describe each face against Alan's or it takes his face. Heights: `repaint_queue.json` "heights".
- **Cut**: `scripts/figure_cut.py` keys the green, trims, scales to 720 px figure height in a 760 canvas (feet at 740),
  writes `art/sprites/<id>.webp` and the metadata in `art/designs/sprites.json`, from which `js/sprites_canva.js` is
  generated (`extras_install.py` rewrites it too). `head_scale.py` resizes a head about the neck when asked.
- **Static sprites only** (32, the user): the cast stand and talk on their static paintings (`<id>_r`, `*_side_k`,
  `*_front_k`); only Alan walks (Ludo walk loops). No footsteps (`audio.js FOOTSTEPS = false`). No intro film yet.
- **A new outfit for an existing figure** (Vasco's navy suit, 85; Alan's underwear): Higgsfield edit of the sprite on
  green ("keep everything else exactly the same"), then `scripts/vasco_dinner.py`'s method: key, scale and place where
  the old sprite stands, paste the figure's *own* head back down to the collar (feathered), and copy its face set under
  the new name (js/faces.js entry + `art/faces/<new>_*`) so blinks and lip-sync still fit. Switch with a getter on
  `S.CHARS.<id>.frames` and list both in `.outfits` (engine.js preloads every outfit).
- **Sunburn**: `Engine.sunburn()` and the `skinTint` hook in `js/engine/faces.js` redden skin pixels at run time.

## 5. Faces: lip-sync, blinks, emotions (30-42, 57-58, 62-66)

- **Lip-sync**: Rhubarb 1.13 (`scripts/lipsync.py`, Game I's) on each voiced line -> `lipsync/<who>/<id>.json`,
  bundled into `js/lipsync.js`. Re-run for new or re-recorded lines (the narrator has none).
- **Mouth and eye patches** per sprite: `scripts/face_kit.py find|gen|build <who>` (Gemini mouths A-F and shut eyes on
  the figure's face, fitted back; `STATIC` maps who to sprite), `scripts/face_jaw.py <who>` (moves the real jaw, lays
  only the new lips; `JAW_CAP` limits a wide mouth), `scripts/face_from_game1.py` (Alan's side faces from Game I),
  `scripts/face_defringe.py` (cleans pale fringes, run by the generators). Sets live in `js/faces.js` with
  `"ok": false` until the user approves them (shown with `?faces=all`), then `true`.
- **Emotions** (Alan only): `scripts/face_emotions.py gen|build|install` (soft set: joy, fear, anger, sadness,
  concern, surprise, embarrassed, mischievous), drawn by `js/engine/faces.js`; which lines carry one:
  `js/story/emotions.js` (`TAGS`). Use sparingly ("in most cases he will just have his regular face"). Flirting with men
  -> mischievous; embarrassed with women -> embarrassed.

## 6. Animation (Ludo, loops, cutscene frames) (26, 29, 43-47, 67)

- **Ludo**: `scripts/ludo.py` (runs in `scripts/ludo_runs.json`; `gen` accepts `--model forge` when hydra refuses on
  moderation, `--take N` for a new take of the same request, `--margin-v/-h` for room so limbs aren't cut). Install:
  `scripts/ludo_install.py` (frames to `art/sprites/<run>_NN.webp`, `js/sprites_ludo.js`), `ludo_measure.py` (ground
  per frame). Today only Alan's walks are used.
- **Seamless walks**: `scripts/walk_loop.py [install] <run>` finds the cleanest stride, removes drift, retimes with
  optical-flow in-betweens when the spacing is uneven. Runs listed in its `TAKES` are read straight from their fitted
  Ludo takes (no install needed) and also get an `across_<run>.mp4` clip; `install <run>` then puts them in (125).
- **Side walks need a profile start frame**: Ludo keeps the start frame's angle, so a three-quarter standing painting
  walks diagonally; Vasco's side walks start from profile paintings (`vascor_profile_k`, `vascor_dinner_profile_k`, 125).
- **A one-off action** (the undressing, 67/73): Ludo frames, faces fixed with `scripts/head_swap.py <ref> <prefix>`
  (YuNet landmarks; originals kept in `art/review/head_swap/`), sprites flagged `cut: true` (straight cuts, no breathing
  bend), played frame by frame from the story (`p.poses.x = key; p.pose = 'x'`), preloaded with `Engine.ensure(keys)`.
  Kling refused the undressing; Ludo (forge) did it.
- **Two people in one action** (the airport kiss, HANDOFF 119): put both standing sprites side by side in one 720-tall
  frame (`art/sprites/pair_gando_stand.webp`), Ludo from that single frame with a prompt, play forward, hold, then
  backwards so they end as they stood; one `duo_*` character on the first person's feet, both real actors hidden
  meanwhile; `def.shadow` stretches the contact shadow over both. Time it to the line that describes it.

## 7. Background people and props (51-56, 71-74, 79-85)

- **Figures**: Higgsfield `gpt_image_2_5` on green, the cast sheet as the style reference (`art/designs/extras/`,
  spec in `extras.json`: room, description, `place [x, y, k]` where k is height in figure-heights). `python3
  scripts/extras.py` cuts them (`art/review/extras/cut/`) and makes per-room previews.
- **Placement tool** (the user places everything): artifact https://claude.ai/artifact/1wi1TWruWDpxmZY97YAn9n, files in
  `art/review/extras/placer/` (`index.html`, `data.json`: rooms, extras, the cast per room; `cast_rooms.json`: how the
  game stands the cast). To add a room: its painting as `bg_<room>.jpg`, its entry in `data.json` rooms (walk, scale
  from layout.js), its cast (a cut-out `c_<sprite>.webp` cropped to 720 px, its anchor `ax`, its height `h` from the
  running game) in `data.json` cast and `cast_rooms.json`; republish with `files`. A room laid out differently for an
  occasion is a **variant tab** (`museum_hall_dinner`), installed through `S.VARIANTS` (layout.js) and `BASE` in
  `extras_install.py`.
- **Install**: when the user says "done", read the tool's db (`ArtifactData query placements where room == ...`), copy
  the records into `art/designs/extras/placements.json`, `python3 scripts/extras_install.py` (writes `art/sprites/x_*.webp`,
  `js/story/extras.js`: `S.EXTRAS` and `S.CAST_AT`), screenshot the room in the game. Watching the artifact for changes
  doesn't work (webhook limit): wait for the user's word.
- **When they're there**: `S.EXTRAS_WHEN[room]` (e.g. the museum's guests only at the parties).
- **They talk** (82): `js/story/bgtalk.js` (`S.BG`: name, first exchange, a line after; half flirt with Alan;
  `S.BG_BURN`: the reception's sunburn remarks); voices in `cast.json` per figure.
- **Props** (tables, buffet): made the same way; graded into their room's light with `scripts/prop_grade.py` (84;
  ungraded originals in `art/designs/props_ungraded/`).

## 8. Stills and documents

Painted stills (`art/stills/`) are shown with `S.paint(key, async () => ..., { zoom })`; the content setting
("Discreet") replaces the love scenes with a fade. Close-up documents (letters, the paper, the sketchbook) are HTML pages
in `js/story/docs.js` (`G.closeup([page(...)])`).

## 9. Voices (ElevenLabs)

- **Cast**: `scripts/cast.json`, one voice per speaker. Alan, Vasco, Inês and the narrator keep Game I's voices. The
  Spanish-speaking cast: `model_id: eleven_v4`, `language_code: es`, `voice_settings {stability 0.3, similarity_boost
  0.75, style 0.5, speed 1.08}`, `prefix "[strong Spanish accent] "` ("v4 lively + accent cue", 64-66). Gail and Derek
  British (v3). Library voices only, never designed or cloned. Recasting: samples on a page, the user picks.
- **Out of credits**: stop and tell the user ("we can't have different voices", "don't clone then"); never another
  service or a clone. Lines with no file play as text. `scripts/voice_redo.txt` keeps the ids whose text changed after
  recording (88).
- **Generate**: `node sequel/scripts/generate-voices.mjs` voices every missing line; pass ids to re-record changed lines
  (`... id1 id2 ...`); `--force` everything. Inês and the answering machine go through `scripts/phone_fx.sh`. Then
  `node sequel/scripts/build-manifest.mjs` (also stamps the scripts in index.html: commit that).
- **Lines** (`js/lines.js`, `id: ['speaker', "text"]`): action beats are narrator lines, never brackets; the only
  bracket is `[pause]`. The Spanish speakers drop a Spanish word into about a third of their sentences (68,
  `scripts/spanish_words.py`). People comment on Alan's looks: he flirts back with men, blushes with women (69). Ids
  name recordings: never rename one; a changed text needs re-recording.

- **A word said the Spanish way** (HANDOFF 99): `scripts/tts_text.json` holds, by line id, the text the voice reads
  where it must differ from the caption (e.g. the price in Spanish); `generate-voices.mjs --tts=FILE --out=DIR` makes
  auditions without touching the game's recordings.
- **Emotion** (HANDOFF 118): the same file carries ElevenLabs v4 audio tags (`[hurt, rising]`, `[shouting, frantic]`,
  `[voice breaking]`), every word of the caption kept. Make auditions into `art/review/voices/<pass>/`, a review page
  (copy `vasco_emotion_2/page/`: Now/New, approve/redo, db `verdicts`), install on approval (old mp3 to
  `audio/voice_stale/<pass>_old/`, the tags into `tts_text.json`), then lip-sync those ids. Budget first: check
  `GET /v1/user/subscription` (character_limit - character_count); a line costs about its tagged length.

## 10. Music and sound

- **Music**: one track per room, Lyria 3 Pro (`scripts/gen_music.py`, ledger stops at $20), the user picks a take,
  `scripts/music_install.py` levels to -23 LUFS and encodes `audio/music/<id>.opus.m4a` + `.aac.m4a`; rooms say
  `music: '<id>'`, the map `map`, the title `title` (27).
- **Ambience and effects**: Game I's sound effects copied into `audio/sfx/` (`manifest.json`, built by build-manifest);
  a room's `ambience:` loop plays under its music; story sounds with `S.sfx('<name>', volume)`. No footsteps.

## 11. Writing and rewriting the story

- The novel is the tone reference (`docs/novel/the-shortest-night.md`); `docs/story-bible.md` has the ten dialogue
  rules, the voice sheet and the chapter-to-scene map. Tuesday was rewritten by hand (17, 67, 86); Wednesday to Monday
  and the prologue by six parallel agents (87), each with `docs/rewrite/BRIEF.md`, editing only its own day's file and
  writing its lines to `docs/rewrite/<day>.json`; `scripts/merge_rewrite.py <days>` merges them into lines.js and
  emotions.js. Their requested changes to shared files were applied by hand. Re-use that setup for big rewrites.
- A room is defined once, in the file of the day it first appears; later days hook in by **chaining**, never replacing:
  `const prev = ROOMS.x.enter; ROOMS.x.enter = async function (e) { if (prev) await prev.call(this, e); ... }` (a
  replaced enter() once silently killed Tuesday's arrival narration).

## 12. Checking, recording, deploying

- Serve: `cd sequel && setsid nohup python3 -m http.server 8099 &` (setsid: plain background servers die).
- `node scripts/validate.mjs` (0 errors), `node scripts/tests/play.mjs http://localhost:8099/` (plays every day to the
  ending, ~15 min; update its route when a scene changes), `scripts/tests/rooms_shot.mjs` (screenshots of rooms at a
  chapter). Playwright's Chromium is at `/opt/pw-browsers/chromium`.
- **Recordings for the user**: `scripts/tests/record_scene.mjs` (video + a log of each line's start) and
  `scripts/record_mix.py` (lays the voices and the room's music onto the silent video). Record from a clean export of
  a commit if files are being edited at the same time.
- **Reviews**: private artifacts with a db (`verdicts`, `notes`), or `SendUserFile` for sheets and clips.
- **Deploy** (only when asked): `node sequel/scripts/build-manifest.mjs`, commit; `git archive HEAD:sequel | tar -x -C
  <empty dir>`; serve that dir and run play.mjs on it; Netlify MCP `deploy-site` (site `a5e71264-d9a4-439a-b1e5-60ec3f98812d`),
  run the returned `npx @netlify/mcp ...` command from the export dir; check the live page and that `/.env` is 404.
