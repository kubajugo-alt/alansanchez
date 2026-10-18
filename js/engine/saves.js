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
  function snapshot() {
    let music = null; try { music = Sound.musicState ? Sound.musicState() : null; } catch (e) { music = null; }
    return JSON.stringify(Object.assign({}, E.state, { px: E.player.x, py: E.player.y, dir: E.player.dir, music, savedAt: Date.now() }));
  }
  function autosave() { if (/[?&]scene=/.test(location.search) || (E.state && E.state.flags.dawn)) return false; // past dawn the save is wiped, not rewritten
    try { localStorage.setItem(SAVE_KEY, snapshot()); return true; } catch (e) { return false; /* storage unavailable */ } }
  const readKey = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  function hasSave() { return !!(readKey(SAVE_KEY) || readKey(SAVE_KEY_MANUAL)); }
  function saveManual() { if (E.state && E.state.flags.dawn) return false; try { localStorage.setItem(SAVE_KEY_MANUAL, snapshot()); return true; } catch (e) { return false; } }
  // Continue picks whichever save is newer (the autosave or the menu's); Load from the menu prefers the menu's save
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
    // saves from before the sketch became an item: hand it over so Inês and Celeste can take it
    if (E.state.flags.sketched_tile && !E.state.inv.includes('sketch')) E.state.inv.push('sketch');
    E.state.inv = E.state.inv.filter(id => id !== 'weight'); // the brass weight was taken out of the game
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
    return true;
  }
  function checkpoint() { E.state.flags._checkpoint = null; E.state.flags._checkpoint = snapshot(); }

  // ---------------------------------------------------------------- cards & menu
  async function card(t1, t2, ms) {
    const c = $('#card');
    c.querySelector('.t1').textContent = t1; c.querySelector('.t2').textContent = t2;
    c.classList.add('on'); await wait(window.FAST ? 50 : (ms || 2800)); c.classList.remove('on');
  }
  function showModal(id, on) { $('#' + id).classList.toggle('hidden', !on); }
  function syncOptions() {
    $('#opt-music').classList.toggle('off', !Sound.musicOn);
    $('#opt-voice').classList.toggle('off', !Sound.voiceOn);
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
  $('#opt-load').onclick = async e => { e.stopPropagation(); $('#menu').classList.remove('open');
    if (midScene()) return toast("Can't load during a scene");
    if (!hasSave()) return toast('No saved game');
    toast((await loadSave(readKey(SAVE_KEY_MANUAL) || readKey(SAVE_KEY))) ? 'Game loaded' : 'That save could not be read'); };
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1500); }

  Object.assign(E, { autosave, hasSave, clearSaves, loadSave, checkpoint, card, showModal, syncOptions, toast });
})();
