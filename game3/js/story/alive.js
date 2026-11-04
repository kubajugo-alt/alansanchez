// The Forgotten Rhythm — the rooms come alive: small movements drawn over the paintings (as Games I and II: nothing in
// art/bg changes; everything is drawn over it each frame, deterministic in t). Each js/story/alive_<n>.js registers
//   S.ALIVE[roomId] = (g, t, bg, im) => {...}     behind the figures (bg: the painting showing now, im: its image)
//   S.ALIVE_FG[roomId] = (g, t, bg, im) => {...}  in front of them (rain on the glass, smoke, mist)
// and this file chains them after whatever the story already draws in the room (its own animBack / animFg).
(function () {
  const S = window.S, { G, ROOMS } = S, E = window.Engine;
  const cur = () => { try { return E.curBg ? E.curBg() : (G.room && G.room.bg); } catch (e) { return G.room && G.room.bg; } };
  const wrap = (r, key, fn) => {
    const own = r[key];
    r[key] = function (g, t) {
      if (own) own.call(this, g, t);
      if (window.CALM) return;                      // (the menu's reduced motion: the paintings hold still)
      try { g.save(); fn(g, t, cur(), G.bgImage()); } catch (e) { if (!wrap.warned) { wrap.warned = true; console.error('alive ' + r.id, e); } } finally { g.restore(); }
    };
  };
  for (const [id, fn] of Object.entries(S.ALIVE)) if (ROOMS[id]) wrap(ROOMS[id], 'animBack', fn);
  for (const [id, fn] of Object.entries(S.ALIVE_FG)) if (ROOMS[id]) wrap(ROOMS[id], 'animFg', fn);
})();
