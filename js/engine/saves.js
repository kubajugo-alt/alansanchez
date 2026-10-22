// Saves (the autosave and the menu's), chapter cards, the menu (music, voices, save, load) and
// toasts.
(function () {
  const E = window.Engine;
  const { $, ROOMS, wait, freshState } = E;

  // ---------------------------------------------------------------- saves
  // a save holds the whole of `state` (room, inventory, flags: chapter in flags.ch, the painted clock in
  // flags.clock), plus where Alan stands, the clock overlay and the scene's music cue (Sound.musicState)
  const SAVE_KEY = 'drowned-bell-save-v3';             // the autosave: every room change, chapter card, finished scene
  const SAVE_KEY_MANUAL = 'drowned-bell-save-v3-manual'; // the menu's Save: kept until the player saves again
  // the shape of a save (v): a save without one is from before 22 Oct 2026. When the shape changes, bump it and add a
  // step to MIGRATE, so older saves are brought up to date instead of being thrown away
  const SAVE_VERSION = 1;
  const MIGRATE = {
    0: st => { // before versions: the sketch became an item (Inês and Celeste take it)
      if (st.flags.sketched_tile && !st.inv.includes('sketch')) st.inv.push('sketch');
    },
  };
  function snapshot() {
    let music = null; try { music = Sound.musicState ? Sound.musicState() : null; } catch (e) { music = null; }
    return JSON.stringify(Object.assign({}, E.state, { v: SAVE_VERSION, px: E.player.x, py: E.player.y, dir: E.player.dir, music, savedAt: Date.now() }));
  }
  function autosave() { if (/[?&]scene=/.test(location.search) || (E.state && E.state.flags.dawn)) return false; // past dawn the save is wiped, not rewritten
    try { localStorage.setItem(SAVE_KEY, snapshot()); return true; } catch (e) { return false; /* storage unavailable */ } }
  const readKey = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  function hasSave() { return !!(readKey(SAVE_KEY) || readKey(SAVE_KEY_MANUAL)); }
  function saveManual() {
    if (E.state && E.state.flags.dawn) return false;
    try { localStorage.setItem(SAVE_KEY_MANUAL, snapshot()); return true; } catch (e) { return false; }
  }
  // Continue picks whichever save is newer (the autosave or the menu's); Load from the menu prefers the menu's save
  // (asking twice when it is the older one)
  function newestSave() {
    const a = readKey(SAVE_KEY), m = readKey(SAVE_KEY_MANUAL);
    const t = j => { try { return JSON.parse(j).savedAt || 0; } catch (e) { return -1; } };
    return !m ? a : !a ? m : (t(m) >= t(a) ? m : a);
  }
  function clearSaves() { try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(SAVE_KEY_MANUAL); } catch (e) { /* ignore */ } }
  async function loadSave(json) {
    let data = json;
    if (!data) data = newestSave();
    if (!data) return false;
    let parsed;
    try { parsed = JSON.parse(data); } catch (e) { parsed = null; }
    if (!parsed || !parsed.flags || !ROOMS[parsed.room]) return false; // corrupt or from a retired build: start fresh
    E.state = Object.assign(freshState(), parsed);
    if (!Array.isArray(E.state.inv)) E.state.inv = [];
    for (let v = parsed.v || 0; v < SAVE_VERSION; v++) if (MIGRATE[v]) MIGRATE[v](E.state);
    E.state.v = SAVE_VERSION;
    // items taken out of the game (the brass weight, or any id this build no longer has) would break the inventory bar
    if (!Array.isArray(E.state.inv)) E.state.inv = [];
    E.state.inv = E.state.inv.filter(id => id !== 'weight' && E.ITEMS[id]);
    E.selItem = null; E.renderInv();
    // loading over a game in progress: put the old room away cleanly first (its leave hook, Alan's pose, the cigarette, any line)
    E.noteInput(); if (E.player) { E.player.pose = null; E.player.stop(); }
    try { Sound.stopVoice && Sound.stopVoice(); } catch (e) { /* ignore */ }
    E.clearSpeech();
    if (E.room && E.room.leave) { try { E.room.leave(); } catch (e) { /* ignore */ } }
    E.room = null;
    await E.goRoom(E.state.room, null, { pos: [E.state.px, E.state.py, E.state.dir], noEnter: true, noSave: true });
    E.setClock(E.state.clockText || null);
    try { if (Sound.restoreMusic && E.state.music) Sound.restoreMusic(E.state.music); } catch (e) { /* ignore */ }
    // the room's way-in is skipped (the scene is already set), but anything due there still happens (a chapter end in
    // the shop): the room's resume hook. (Not awaited: Continue returns and the game runs it like any scene.)
    if (E.room && E.room.resume) setTimeout(() => { const r = E.room.resume(); if (r && r.then) { E.busy++; r.finally(() => { E.busy--; }); } }, 0);
    return true;
  }
  function checkpoint() { E.state.flags._checkpoint = null; E.state.flags._checkpoint = snapshot(); }

  // ---------------------------------------------------------------- cards & menu
  async function card(t1, t2, ms) {
    const c = $('#card');
    c.querySelector('.t1').textContent = t1; c.querySelector('.t2').textContent = t2;
    // the fade in and out lasts exactly as long as the card is held, so it never snaps back at the end
    const dur = window.FAST ? 50 : (ms || 2800);
    c.style.animationDuration = dur + 'ms';
    c.classList.add('on'); await wait(dur); c.classList.remove('on');
  }
  function showModal(id, on) {
    const m = $('#' + id); m.classList.toggle('hidden', !on);
    // a modal that opens takes the keyboard: its first button has the focus (Enter answers it)
    if (on) setTimeout(() => { const b = m.querySelector('button:not([disabled]), input, [tabindex]'); if (b && !m.classList.contains('hidden')) b.focus({ preventScroll: true }); }, 50);
  }
  // Effects: Full (mesh warp, GPU light and depth parallax) or Light (flat frames, no parallax). Automatic until
  // the player picks one; a slow device drops to Light by itself (render.js). Kept per browser.
  const FX_KEY = 'drowned-bell-effects';
  const fxPref = () => { try { return localStorage.getItem(FX_KEY); } catch (e) { return null; } };
  function setEffects(full, keep) {
    window.WARP = full ? (keep ? true : null) : false;
    if (window.Parallax && Parallax.set) Parallax.set(full);
    if (keep) try { localStorage.setItem(FX_KEY, full ? 'full' : 'light'); } catch (e) { /* private mode */ }
  }
  if (fxPref() && !/[?&](warp|lit3d)=/.test(location.search)) setEffects(fxPref() === 'full', true);
  (function effectsButton() {
    const menu = $('#menu'); if (!menu || $('#opt-fx')) return;
    const b = document.createElement('button'); b.id = 'opt-fx'; b.textContent = 'Effects';
    b.onclick = e => { e.stopPropagation(); setEffects(window.WARP === false, true); syncOptions(); toast('Effects: ' + (window.WARP === false ? 'Light' : 'Full')); };
    menu.insertBefore(b, $('#opt-save'));
  })();
  // Text size (captions, choices, hover names) and Motion (calm: no camera drift, rocking boat or panning paintings),
  // kept per browser; Motion starts from the device's reduced-motion setting
  const TEXT_KEY = 'drowned-bell-text', MOTION_KEY = 'drowned-bell-motion';
  const SIZES = [['Small', 0.85], ['Medium', 1], ['Large', 1.25]];
  const pref = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const keep = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } };
  let textI = Math.max(0, SIZES.findIndex(s => s[0] === pref(TEXT_KEY))); if (pref(TEXT_KEY) == null) textI = 1;
  const applyText = () => document.documentElement.style.setProperty('--cap', SIZES[textI][1]);
  const sysCalm = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  const applyMotion = () => { window.CALM = pref(MOTION_KEY) ? pref(MOTION_KEY) === 'calm' : sysCalm(); document.body.classList.toggle('calm', !!window.CALM); };
  applyText(); applyMotion();
  (function settingButtons() {
    const menu = $('#menu'); if (!menu || $('#opt-text')) return;
    const add = (id, fn) => { const b = document.createElement('button'); b.id = id; b.onclick = e => { e.stopPropagation(); fn(); syncOptions(); }; menu.insertBefore(b, $('#opt-save')); };
    add('opt-text', () => { textI = (textI + 1) % SIZES.length; keep(TEXT_KEY, SIZES[textI][0]); applyText(); });
    add('opt-motion', () => { keep(MOTION_KEY, window.CALM ? 'full' : 'calm'); applyMotion(); });
  })();
  function syncOptions() {
    if ($('#opt-text')) $('#opt-text').textContent = 'Text: ' + SIZES[textI][0];
    if ($('#opt-motion')) $('#opt-motion').textContent = 'Motion: ' + (window.CALM ? 'Calm' : 'Full');
    $('#opt-music').classList.toggle('off', !Sound.musicOn);
    $('#opt-voice').classList.toggle('off', !Sound.voiceOn);
    const fx = $('#opt-fx'); if (fx) fx.classList.toggle('off', window.WARP === false);
  }
  $('#menu-btn').onclick = e => { e.stopPropagation(); $('#menu').classList.toggle('open'); };
  $('#opt-music').onclick = e => { e.stopPropagation(); Sound.setMusic(!Sound.musicOn); syncOptions(); };
  $('#opt-voice').onclick = e => { e.stopPropagation(); Sound.setVoice(!Sound.voiceOn); syncOptions(); };
  // (never silent: a refused save or load says why)
  const midScene = () => E.busy > 0 || !!E.dialogResolve || E.cutscene > 0;
  $('#opt-save').onclick = e => { e.stopPropagation(); $('#menu').classList.remove('open');
    if (!E.state || !E.room) return toast('Nothing to save yet');
    if (midScene()) return toast("Can't save during a scene");
    if (E.room.noSave && E.room.id !== 'map') return toast("Can't save here"); // (the map is fine: Continue opens it again)
    if (E.state.flags.dawn) return toast('The story is over');
    toast(saveManual() ? 'Game saved' : 'Saving failed (browser storage is off)'); };
  // Load restores the menu's save; when that is older than the autosave it asks for a second press first, so an old
  // save from chapter I can't quietly throw away the hours since
  let loadArmed = 0;
  $('#opt-load').onclick = async e => { e.stopPropagation(); $('#menu').classList.remove('open');
    if (midScene()) return toast("Can't load during a scene");
    if (!hasSave()) return toast('No saved game');
    const m = readKey(SAVE_KEY_MANUAL), a = readKey(SAVE_KEY);
    const at = j => { try { return JSON.parse(j).savedAt || 0; } catch (err) { return 0; } };
    if (m && a && at(m) < at(a) && Date.now() - loadArmed > 4000) {
      loadArmed = Date.now();
      const mins = Math.round((Date.now() - at(m)) / 60000);
      const ago = mins < 2 ? 'a minute' : mins < 120 ? mins + ' minutes' : Math.round(mins / 60) + ' hours';
      return toast('Your save is from ' + ago + ' ago: press Load again to go back to it', 3500);
    }
    loadArmed = 0;
    toast((await loadSave(m || a)) ? 'Game loaded' : 'That save could not be read'); };
  // the game as a file (the browser's storage can be cleared, or the player moves to another device): Save to file
  // downloads what the menu's Save would keep; Load from file reads one back
  (function fileButtons() {
    const menu = $('#menu'); if (!menu || $('#opt-export')) return;
    const add = (id, label, fn) => { const b = document.createElement('button'); b.id = id; b.textContent = label; b.onclick = e => { e.stopPropagation(); menu.classList.remove('open'); fn(); }; menu.appendChild(b); };
    add('opt-export', 'Save to file', () => {
      if (!E.state || !E.room) return toast('Nothing to save yet');
      if (midScene()) return toast("Can't save during a scene");
      if (E.state.flags.dawn) return toast('The story is over');
      const blob = new Blob([snapshot()], { type: 'application/json' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'drowned-bell-' + new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-') + '.json';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast('Saved to a file');
    });
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'; input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = async () => {
      const f = input.files && input.files[0]; input.value = ''; if (!f) return;
      let ok = false; try { ok = await loadSave(await f.text()); } catch (err) { ok = false; }
      if (ok) { try { Sound.init(); } catch (err) { /* no audio */ } E.showModal('title', false); E.autosave(); } // (from the title screen too)
      toast(ok ? 'Game loaded' : 'That file could not be read');
    };
    add('opt-import', 'Load from file', () => { if (midScene()) return toast("Can't load during a scene"); input.click(); });
  })();
  let toastT = null;
  function toast(msg, ms) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms || 1500); }

  Object.assign(E, { newestSave, autosave, hasSave, clearSaves, loadSave, checkpoint, card, showModal, syncOptions, toast });
})();
