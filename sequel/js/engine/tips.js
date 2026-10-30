// First-time tips: one short line in the corner the first time each thing would help (how to walk and look, hurrying,
// showing what can be clicked, the bag, skipping a line, saving, asking Inês, the notebook in Chapter V). Each shows
// once (kept per browser), never over a scene, a line or a choice, one at a time; the menu's Tips button turns them off.
// Loaded after saves.js: it wraps a few engine functions to notice the moments (E.giveItem, E.say, E.dialog, E.card).
(function () {
  const E = window.Engine;
  const { $, canvas } = E;
  const KEY = 'shortest-night-tips';
  let store = { seen: [], off: false };
  try { store = Object.assign(store, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* private mode */ }
  const keep = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* private mode */ } };
  let touch = false; try { touch = matchMedia('(pointer: coarse)').matches; } catch (e) { /* old browser */ }
  const T = (mouse, tap) => touch ? tap : mouse;
  const TIPS = {
    move: () => T('Click the floor to walk, and things or people to use them or talk. Right-click to look closer.',
      'Tap the floor to walk, and things or people to use them or talk. Press and hold to look closer.'),
    hurry: () => T('Double-click to hurry. On a door, to go straight through.', 'Double-tap to hurry. On a door, to go straight through.'),
    hotspots: () => T('Not sure what you can click? Press H, or the ◎ button.', 'Not sure what you can tap? The ◎ button shows everything.'),
    item: () => T('It\'s in your bag (✦, or I). Pick it, then click where to use it, or on another of your things.',
      'It\'s in your bag (✦). Pick it, then tap where to use it, or another of your things.'),
    line: () => T('Click, or press Space, to skip a line.', 'Tap to skip a line.'),
    dialog: () => T('Pick what to say: click a line, or press its number.', 'Tap what to say.'),
    saves: () => 'The game saves itself as you go. ☰ to keep a copy, or to change the text size, sound and motion.',
    ines: () => 'Stuck? Call Inês from the phone box on Las Canteras: she always knows what to try next.',
    vasco: () => 'You are Vasco now: slower, and he reads his way through. Look at everything.',
  };

  // ---------------------------------------------------------------- showing one
  const el = document.createElement('div'); el.id = 'tip';
  el.innerHTML = '<span></span><button title="Got it" aria-label="Close the tip">✕</button>';
  E.wrap.appendChild(el);
  const queue = []; let showing = null, hideT = null;
  const free = () => E.room && !E.busy && !E.cutscene && !E.still && !E.dialogResolve && !E.speaking && $('#title').classList.contains('hidden')
    && !document.querySelector('.modal:not(.hidden)') && $('#closeup').classList.contains('hidden');
  function hide() { el.classList.remove('on'); showing = null; clearTimeout(hideT); }
  el.querySelector('button').addEventListener('click', e => { e.stopPropagation(); hide(); });
  function tip(id) {
    if (window.FAST || store.off || !TIPS[id] || store.seen.includes(id) || queue.includes(id) || showing === id) return;
    queue.push(id);
  }
  // a tip waits for a quiet moment, shows for long enough to read (about 14 characters a second, 5 s at least)
  setInterval(() => {
    if (showing && !free() && E.cutscene) hide(); // a scene starting takes the corner back
    if (showing || !queue.length || !free()) return;
    const id = queue.shift(); if (store.seen.includes(id)) return;
    const text = TIPS[id](); el.querySelector('span').textContent = text;
    el.classList.add('on'); showing = id; store.seen.push(id); keep();
    hideT = setTimeout(hide, Math.max(5000, 1500 + text.length * 70));
  }, 400);

  // ---------------------------------------------------------------- the moments
  const wrapFn = (name, before) => { const f = E[name]; if (typeof f !== 'function') return; E[name] = function (...a) { try { before(...a); } catch (e) { /* a tip never breaks the game */ } return f.apply(this, a); }; };
  wrapFn('giveItem', (id, silent) => { if (!silent) tip('item'); });
  wrapFn('say', () => { if (E.room && !E.cutscene) tip('line'); });
  wrapFn('dialog', () => tip('dialog'));
  const card = E.card; if (card) E.card = async function (...a) { const r = await card.apply(this, a); tip('saves'); return r; };

  // control: the first quiet moment in a room with Alan in it
  setInterval(() => { if (E.player && E.player.visible && free()) tip('move'); }, 1500);
  // a long walk (after the first tip): hurrying; clicks on nothing, or a minute with nothing done: what can be clicked
  let misses = [], lastAct = performance.now();
  canvas.addEventListener('click', () => {
    const t0 = performance.now(); lastAct = t0;
    setTimeout(() => {
      const p = E.player; if (!p || E.busy) return;
      const target = p.path && p.path.length ? p.path[p.path.length - 1] : p.target && [p.target.x, p.target.y];
      if (p.walking && target && Math.hypot(target[0] - p.x, target[1] - p.y) > 380 && store.seen.includes('move')) tip('hurry');
      const hov = $('#hover'); if (p.walking && (!hov || hov.style.display === 'none')) { misses = misses.filter(m => t0 - m < 25000).concat(t0); if (misses.length >= 3) tip('hotspots'); }
    }, 60);
  }, true);
  ['keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { lastAct = performance.now(); }, { passive: true }));
  // stuck: a minute without acting shows the hotspots tip; three minutes with no story flag changing (Ch. I-IV) suggests Inês
  let flagsSig = '', flagsAt = performance.now();
  // (both clocks run only while the player has control: the title, a scene or a line don't count as being stuck)
  setInterval(() => {
    const now = performance.now();
    if (!E.state || !E.room || !free()) { lastAct = now; flagsAt = now; return; }
    const f = E.state.flags, sig = Object.keys(f).length + ':' + JSON.stringify(f).length;
    if (sig !== flagsSig) { flagsSig = sig; flagsAt = now; }
    if (now - lastAct > 60000) tip('hotspots');
    if (now - flagsAt > 180000 && store.seen.includes('hotspots')) tip('ines');
  }, 5000);

  // ---------------------------------------------------------------- the menu's Tips button
  (function tipsButton() {
    const menu = $('#menu'); if (!menu || $('#opt-tips')) return;
    const b = document.createElement('button'); b.id = 'opt-tips';
    const label = () => { b.textContent = 'Tips: ' + (store.off ? 'Off' : 'On'); };
    b.onclick = e => { e.stopPropagation(); store.off = !store.off; if (store.off) { hide(); queue.length = 0; } keep(); label(); };
    label(); menu.insertBefore(b, $('#opt-save'));
  })();

  Object.assign(E, { tip });
})();
