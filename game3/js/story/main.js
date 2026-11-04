// The Forgotten Rhythm — boot: what the engine preloads, the rooms' enter hooks, the ?scene= previews, a new game, init.
// Each part of the story registers: S.PREVIEW[name] = { flags, room, pos, as, items, run } (a ?scene=name start), and
// S.SOLVE[ch] = async () => {...} (the test harness's walk through that part, fast, from its first moment to its last;
// it ends where the next part's SOLVE begins). S.START[ch] = async () => {...} starts that part from its card.
(function () {
  const S = window.S, { G, F, say, ROOMS } = S;
  const E = window.Engine;
  window.FIRST_ROOM = 'p1586_river_mouth';
  window.STILLS = [];
  window.CLOSEUPS = ['paper_aged', 'bell_frieze', 'coin_1586', 'elconde_tray', 'grandmother_photo', 'photo_face_down', 'stmichael_offerings', 'tata_notebook', 'tata_photo', 'tijean_boat'];

  // every room: its enter hooks (S.onEnter), and a spot to stand at for every hotspot
  for (const [id, r] of Object.entries(ROOMS)) {
    for (const h of r.hotspots || []) if (!h.at && h.rect && r.player !== false) h.at = [Math.max(60, Math.min(1220, h.rect[0] + h.rect[2] / 2)), 660];
    const own = r.enter;
    r.enter = async function (entry) {
      if (own) await own.call(this, entry);
      for (const fn of S.ENTER[id] || []) { if (G.room !== r) break; await fn(entry); }
    };
    r.id = r.id || id;
  }
  // the items every part declared (S.item) are already in S.ITEMS; the engine reads S.ITEMS at init
  const load = E.loadSave;
  E.loadSave = async function (...a) { const res = await load.apply(this, a); if (res) S.restorePlayer(); return res; };

  // ---------------------------------------------------------------- ?scene= previews
  S.PREVIEW = S.PREVIEW || {};
  async function preview(k) {
    const P = S.PREVIEW[k];
    Object.assign(F(), P.flags || {});
    if (P.as === 'ines') S.becomeInes(); else if (P.as === 'catalina') S.becomeCatalina(); else S.give('notebook', true);
    for (const it of P.items || []) S.give(it, true);
    await G.goRoom(P.room, null, { noEnter: !P.enter, instant: true, pos: P.pos });
    await G.wait(400);
    if (P.run) await G.busy(() => P.run());
  }

  // ---------------------------------------------------------------- a new game: the prologue, 1586
  S.START = S.START || {};
  async function newGame() {
    const scene = new URLSearchParams(location.search).get('scene');
    if (S.PREVIEW[scene]) return preview(scene);
    const start = S.START[0];
    if (!start) throw new Error('no prologue');
    await G.busy(() => start());
    G.autosave();
  }
  window.Story = { newGame };
  document.getElementById('btn-new').onclick = () => G.begin(true);
  document.getElementById('btn-continue').onclick = () => G.begin(false);

  // ---------------------------------------------------------------- the test harness's way in (scripts/tests/run.mjs)
  S.SOLVE = S.SOLVE || {};
  // the SOLVE helpers: wait for the game to settle, act on a hotspot or person (by name / id), walk through a door
  S.quiet = () => new Promise(res => { const iv = setInterval(() => { if (!E.busy && !E.cutscene && !document.querySelector('#dialog.open') && !document.querySelector('#mini.on') && document.getElementById('closeup').classList.contains('hidden')) { clearInterval(iv); res(); } }, 25); });
  S.act = async (target, verb, item, choices) => { await S.quiet(); window.__choices = (choices || []).slice(); await G.act(target, verb || null, item || null); await S.quiet(); };
  S.go = async (room, entry) => { await S.quiet(); await G.goRoom(room, entry || 'hub'); await S.quiet(); };
  S.expect = (what, cond) => { if (!cond(F())) throw new Error('expected ' + what + ' in ' + (G.room && G.room.id)); };
  window.TEST = {
    S, run: async (from, to) => { for (let c = from; c <= to; c++) { if (!S.SOLVE[c]) throw new Error('no SOLVE for part ' + c); await S.SOLVE[c](); } return Object.assign({}, F()); },
  };

  G.init(S.CHARS, S.ITEMS, ROOMS, window.SPRITES);
})();
