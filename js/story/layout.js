// Where the placement tool stood people (ported from Game II's js/story/layout.js, 2026-11-04). The tool (a review page
// built by scripts/placer_build.py) shows each room's painting with its cast and background people where the game
// stands them; the user drags, sizes, flips and layers them; scripts/placer_install.py turns the result into
// S.PLACED (js/story/placed.js): {room: {person key: {x, y, dir?, flip?, h?, size?, z?}}}, a person key being the
// npc's or extra's id ("id#2" for the second def with the same id in a room). This file writes those values into the
// rooms' definitions before the game starts. With S.PLACED empty (as shipped) it changes nothing.
// Loaded after every file that defines rooms and before main.js.
(function () {
  const S = window.S, P = S.PLACED || {};
  const set = (o, k, v) => Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: true });   // (over a getter too)
  S.applyPlacements = function (ROOMS) {
    for (const [id, at] of Object.entries(P)) {
      const r = ROOMS[id]; if (!r) continue;
      const seen = {};
      for (const n of (r.npcs || []).concat(r.ambient || [])) {
        const k = seen[n.id] = (seen[n.id] || 0) + 1, p = at[k > 1 ? `${n.id}#${k}` : n.id];
        if (!p) continue;
        for (const f of ['x', 'y', 'dir', 'h', 'size', 'z']) if (p[f] != null) set(n, f, p[f]);
        if (p.flip) set(n, 'flip', true);
      }
    }
  };
  S.applyPlacements(S.ROOMS);
})();
