# Prompt for the next session (written 2026-11-03)

Paste the block below into the next Claude Code session on this repository.

---

You're picking up Game II, *Alan Sanches II: The Shortest Night*, in `sequel/` of kubajugo-alt/alansanchez. Work on
the branch `claude/happy-ptolemy-m086fu` (draft PR #15); you are the only session working on it.

**Read first, in this order:**
1. `CLAUDE.md` (the rules for both games).
2. `sequel/docs/HANDOFF.md`, "Start here" in full, then the session log from entry 130 to the end (130-139: the bibles,
   the recordings, the action sprites and the idle cigarette, the sea loops and the sky, the vault, the last deploy).
3. `sequel/docs/PIPELINES.md` (how we work and every external service), `sequel/docs/CODEMAP.md` ("Alan's actions" and
   the fork's table), and `sequel/docs/review/env_movement.md` (the movement review).

**The rules that matter most:** nothing goes into the game without my approval (show me a review page or a clip
first); the room paintings don't change unless I say so; deploy only when I ask, from a clean `git archive
HEAD:sequel` export with `scripts/build-manifest.mjs` run last and `scripts/tests/play.mjs` won on the export; the keys
in the root `.env` are never printed or committed (a fresh container won't have `.env`: ask me); voices are only the
cast's own ElevenLabs voices, never others or clones; every animated action starts and ends on the character's
standing painting, and a held object stays in one hand. Keep the HANDOFF log going, one entry per change.

**Review first (before new work):**
- Check the live site matches the branch (the last deploy is in HANDOFF entry 139).
- Redo the before/after recordings of the sea and sky change (entry 137) that a restart cut off, using
  `scripts/tests/record_steps.mjs` (before: an export of commit `816627c1`; after: the branch), for the rooms gando,
  hotel_room, canteras, beach, hotel_restaurant, museum_courtyard, santa_ana, isleta. Look at the loop points and the
  clouds yourself, frame by frame, and put the clips on a review page for me.
- Walk through the places Alan's new actions play (`docs/review/action_sprites.md` lists them) in the running game
  and note anything that looks wrong (timing, a jump between the run and the standing painting, a pose that doesn't
  fit its moment). The idle cigarette: rooms where it shouldn't happen, and that it stops cleanly.

**Then focus on (no external services needed):**
1. The rest of the environment movement in `docs/review/env_movement.md`: G3 (a masked, edge-feathered sway so only
   plants and cloth move, not frames, pillars, signs or facades), G4 (a gusty rhythm), G6 (electric lights that don't
   flicker), and the room fixes in its top-ten table (the prologue car's pale quad, the Land Rover's rosary and lights,
   what shouldn't move, the camp's clouds, the two still exteriors). That review was written before the rooms were
   repainted: re-check each finding on today's painting first, and drop what no longer applies. One before/after clip
   per room for my approval before it goes in.
2. Small code tidy-ups: the clinometer item and `S.tideStep` left from the old Cave 6, the stale sun.js comment, the
   speck the set-down action leaves on the floor.
3. Extend `scripts/tests/play.mjs` to check that the action runs play (the frames shown during a pose) and that the
   cigarette starts after idling and stops on input.

**Waiting on me (ask, don't assume):** Baute's seven verses (need the ElevenLabs key in `.env`); the Ludo work still to
make (Alan's stretch and blazer set, Vasco's actions, about 16 Ludo credits each with 34 left, and the key should be
rotated); the line contradictions listed in "Start here" (fixing them means re-recording); whether the vault's water
on Sunday should be clearer; the first surge's level; the Gando arrivals board.
