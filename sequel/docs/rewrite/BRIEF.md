# Rewriting one day of "The Shortest Night" (Game II, repo /home/user/alansanchez/sequel) from the novel

The user: "yesterday we were planning to adjust the game to the novel - with amended bible. we did tuesday only... do all
of the days". Tuesday was done on 2026-10-28 (sequel/docs/HANDOFF.md entry 17: read it first, it is the method and the
bar). Your job: do the same for ONE day (given in your prompt), in parallel with five other agents doing the others.

## Read first
- /home/user/alansanchez/CLAUDE.md and sequel/docs/HANDOFF.md "Start here" + entry 17 (the Tuesday method) + entries 60-86
  skimmed for features the user asked for that must survive (below).
- sequel/docs/story-bible.md, section "Dialogue and atmosphere": the ten rules, the voice sheet, the chapter-to-scene map,
  and the worked Carmen example. This is the tone reference. sequel/docs/BIBLE.md for plot facts.
- Your novel chapter(s) in sequel/docs/novel/the-shortest-night.md (line ranges in your prompt). The novel is the tone and
  content reference: bring the game's dialogue up to it, scene by scene, in the novel's order, using its best lines.
- Your day's story file(s) and every line id they use in sequel/js/lines.js (format: `id: ['speaker', "text"],`;
  window.SPEAKERS lists the speakers). sequel/scripts/tests/play.mjs: your day's section is the route the test plays.

## What to produce
1. Edit ONLY your own story file(s) (named in your prompt). Restructure scenes, add narration beats, dialogue menus,
   new lines, as Tuesday did. Keep every puzzle, item, flag, hotspot name, exit and the day's chain to the next day
   working. Keep the route in play.mjs working, or give the exact new route.
2. Do NOT edit sequel/js/lines.js (six agents share it). Write your lines to
   sequel/docs/rewrite/<day>.json:
   {"changed": {"id": ["speaker", "text"]},   // existing ids, new text (they get re-recorded)
    "new":     {"id": ["speaker", "text"]},   // new ids; prefix them by day like the existing ones (e.g. carmen_w_, alan_th_)
    "removed": ["id", ...],                    // ids your file no longer uses (only ones nothing else uses: grep)
    "speakers": {"id": ["Name", "#color"]},   // only if a NEW speaker is needed (avoid; say in notes what voice)
    "emotions": {"embarrassed": ["alan_..."]}, // optional: Alan's lines that should show a face (sparingly)
    "core_changes": "...",                      // anything needed in files you may not edit (core.js pins/hints/calls, etc.), exact
    "play_route": "...",                        // the exact replacement for your day's play.mjs section, if it changes
    "notes": "..."}
   Speakers: existing ids only (alan, vasco, carmen, narr, ines, chano, ...). Every id you reference in code must exist
   in lines.js or in your json.
3. Line rules (from Tuesday): action beats are narrator lines (and S.sfx sounds), never brackets; the only bracket allowed
   in text is [pause]. British spelling. Lines short enough to read as captions (split long speeches into several ids).
   The Spanish-speaking characters (Carmen, Chano, Doña Pino, Lolo, Don Fermín, Mercedes, Baute, Montesdeoca, Rafa,
   Yeray, Nieves...) drop a Spanish word into about a third of their sentences (the user's rule: obvious words like
   playa, sol, museo, vale, hombre, mira, gracias), as the current lines do.
4. Must survive (the user asked for them):
   - Carmen's toll: wed.js S.carmenToll at the start of S.talkCarmen (no archive talk Wed-Fri without a packet of Coronas
     from Chano; lines carmen_cigs_*). Keep it, whatever else changes in her scenes.
   - Gail and Derek sit in the hotel restaurant (seat_gail/seat_derek, tue.js, not yours); background people's lines
     (bgtalk.js, not yours); the Thursday dinner's layout and Vasco in navy (tue.js/layout.js, not yours).
   - Alan's character: people sometimes comment on his looks; he flirts back with men, gets embarrassed with women.
     Self-conscious, funny, proud of Vasco and a little jealous of his world (the user, today).
   - Montesdeoca is vulgar, rich and rude ("an asshole", the user); Baute is charming and secretly can't stand him.
5. Do not touch: tue.js, core.js, layout.js, extras*.js, bgtalk.js, lines.js, js/engine/*, index.html, play.mjs, art,
   audio. No commits, no voice generation, no deploys. Never print or read the keys in /home/user/alansanchez/.env.
   Check your JS parses: `node --check <file>`.
6. Finish with a short report: what changed scene by scene, line counts (changed/new/removed), anything in core_changes
   or play_route, and anything you were unsure of.
