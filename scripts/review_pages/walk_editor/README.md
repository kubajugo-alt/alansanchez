# Walk cycle editor (review page)

The source of the walk review page at https://claude.ai/artifact/RoCMGALM4FXgJWdTKrg3v9 (a claude.ai artifact: one tab
per walking character; current walk vs the edited cycle playing with the engine's timing; drag, swap from a library,
nudge, mark missing frames; Approve / Keep current saved to the page's database, `decision/<char>`, Alan's doc is
`decision/alan_walk6`).

- `template.html`: the page; `__DATA__` is replaced by `data.json`.
- `data.json`: per character the walk in the game (`old`, with `oldStep` when it has no foot data), the proposed set,
  speed and scale, and the library (`lib`: each frame's `id`, `group`, `pose`, `meta` {ax, fy, h, facesLeft} and
  `plant`). Snapshot of 2026-10-21; since then Alan's and Inês's walks are their walk7 cycles and the other six
  are their approved walk6 sets.
- The pictures (`f/<id>.webp`) are published with the page: candidates from `art/review/candidates/`, game frames
  from `art/sprites/`, and the other Gemini tries fitted by
  `LIB_OUT=<folder> python3 scripts/walk_sheet_cast.py library <char> ...` (writes `<char>.json` library entries and
  `<prefix>_try<n>/pose<N>.png`, converted to webp under the frame's id).
- A saved cycle goes into the game with `scripts/walk_apply_cycle.py` (see docs/animation_handoff.md, entry 19).
