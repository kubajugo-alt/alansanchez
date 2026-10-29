// Rooms: depth scaling, going from room to room (door sounds, fades, music, ambience, autosave),
// the NPCs and background extras in a room, and the room's painted labels.
(function () {
  const E = window.Engine;
  const { W, H, $, labelsEl, ROOMS, CHARS, IMG, wait } = E;

  function scaleAt(y) {
    const sc = (E.room && E.room.scale) || [540, 300, 716, 360];
    const t = Math.max(0, Math.min(1, (y - sc[0]) / (sc[2] - sc[0])));
    return sc[1] + (sc[3] - sc[1]) * t;
  }


  // ---------------------------------------------------------------- rooms
  // What you hear between rooms: a room's own door sound (door: 'door' | 'shop_bell' | ...) going in or out of it,
  // the map's paper when unfolding it. A pair can be silent (ROOMS[x].quietTo = ['y']).
  function passSound(from, to) {
    const A = ROOMS[from] || {}, B = ROOMS[to] || {};
    if ((A.quietTo || []).includes(to) || (B.quietTo || []).includes(from)) return null;
    if (B.door || A.door) return B.door || A.door;
    return from === 'map' || to === 'map' ? 'page' : null;
  }
  async function goRoom(id, entry, opts) {
    opts = opts || {};
    if (!ROOMS[id]) throw new Error('no room ' + id);
    E.busy++;
    // (try/finally: a leave hook that throws must not leave the screen black and every click refused)
    try {
      if (E.room && !opts.instant) { const s = opts.sound !== undefined ? opts.sound : passSound(E.room.id, id); if (s) Sound.sfx(s); await fade(true); }
      if (E.roomReady) await E.roomReady(id); // the room's art and its people, if they haven't streamed in yet
      if (E.room && E.room.leave) { try { E.room.leave(); } catch (err) { console.error('leave hook of ' + E.room.id, err); } }
      E.room = ROOMS[id];
      E.state.room = id;
      if (E.room.fog) {
        E.fogA = FX.makeFog(id.length * 31 + 1, E.room.fogRGB || '214,218,214', 1);
        E.fogB = FX.makeFog(id.length * 17 + 7, E.room.fogRGB || '200,206,206', 0.8);
      }
      const e = (entry && E.room.entries && E.room.entries[entry]) || (E.room.entries && E.room.entries.default) || [640, 640, 'e'];
      if (opts.pos) { E.player.x = opts.pos[0]; E.player.y = opts.pos[1]; E.player.dir = opts.pos[2] || 'e'; }
      else { E.player.x = e[0]; E.player.y = e[1]; E.player.dir = e[2] || 'e'; }
      E.player.stop();
      E.player.visible = E.room.player !== false;
      refreshNpcs(true);
      renderLabels();
      Sound.playMusic(typeof E.room.music === 'function' ? E.room.music() : E.room.music);
      Sound.ambience((typeof E.room.ambience === 'function' ? E.room.ambience() : E.room.ambience) || null);
      Sound.setRoom(E.room.acoustic || E.room.id);
      E.clearSpeech();
      if (!opts.instant) await fade(false);
    } catch (err) { $('#fade').classList.remove('on'); throw err; } finally { E.busy--; }
    if (!opts.noEnter && E.room.enter) { E.busy++; try { await E.room.enter(entry); } finally { E.busy--; } }
    if (!E.busy && !E.room.noSave && !opts.noSave) E.autosave();
    E.updateHover();
  }
  function refreshNpcs(reset) {
    const keep = reset ? new Map() : new Map(E.npcs.map(a => [a.id, a]));
    // extras whose sprites are not painted yet are simply absent
    const amb = (E.room.ambient || []).filter(a => IMG['spr:' + a.frames[0]]).map(a => {
      if (!CHARS[a.id]) CHARS[a.id] = { scale: a.scale || 1, idleHold: a.idleHold || [8, 20], variantHold: a.variantHold || [1.6, 3.2], frames: { idle: a.frames, walk: a.walk, talk: a.talkFrames, poses: a.poses, sets: a.sets } };
      return Object.assign({ ambient: true, fixedDir: true, ch: a.id }, a);
    });
    E.npcs = (E.room.npcs || []).concat(amb).filter(n => !n.when || n.when()).map(n => {
      if (keep.has(n.id)) return keep.get(n.id);
      const a = new E.Actor(n.id, n.ch || n.id, n.x, n.y, n.dir);
      a.def = n; a.h = n.h || null; if (n.rot) a.rot = n.rot * Math.PI / 180; a.overlay = n.overlay || null; a.loop = n.loop || null; a.set = (typeof n.set === 'function' ? n.set() : n.set) || null;
      if (n.init) n.init(a);
      return a;
    });
  }
  function renderLabels() {
    labelsEl.innerHTML = '';
    for (const l of (E.room.labels || [])) {
      if (l.when && !l.when()) continue;
      const d = document.createElement('div');
      d.className = 'lbl'; d.textContent = typeof l.text === 'function' ? l.text() : l.text;
      d.style.left = (l.x / W * 100) + '%'; d.style.top = (l.y / H * 100) + '%';
      labelsEl.appendChild(d); E.keepInside(d, 6);
    }
  }
  function fade(on) {
    const f = $('#fade'); if (f.classList.contains('on') === !!on) return wait(0); // already black (or clear): no extra pause
    f.classList.toggle('on', on); return wait(480);
  }

  Object.assign(E, { scaleAt, goRoom, refreshNpcs, renderLabels, fade });
})();
