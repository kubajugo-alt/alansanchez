// "Play offline" (Game II's HANDOFF entry 127; the same file in both games since 2026-11-04, Game I's handoff entry 91). The menu's (and the title's) Play offline opens a panel that
// downloads the whole game (offline.json, written by scripts/build-manifest.mjs) into this browser's Cache Storage and
// registers sw.js, which then serves the game from that copy with no connection. Resumable (files already stored with
// the right hash are skipped); an update fetches only the files whose hash changed, into a staging cache that replaces
// the copy's files only once it is complete (so an update cut short never leaves a copy mixed from two versions).
// Remove deletes the copy and unregisters the worker. Nothing here runs for a player who never opens the panel.
(function () {
  const KEY = window.GAME_KEY + '-offline';   // (shortest-night-offline, drowned-bell-offline: js/game.js)
  // (the cache names below are the same in both games: each game is its own site, and caches belong to their site;
  // Game II's copies already downloaded under these names keep working)
  const PACK = 'sn-offline', STAGE = 'sn-offline-stage', META = 'sn-offline-meta', FONTS = 'sn-fonts';
  const BASE = new URL('./', location.href.split(/[?#]/)[0]).href;
  const can = /^https?:$/.test(location.protocol) && 'serviceWorker' in navigator && 'caches' in window;
  const $ = s => document.querySelector(s);
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const keep = v => { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ } };
  let state = read();   // { version, date, files, bytes } once a copy is complete; { pending: version } while one is downloading
  let job = null;       // the download running now: { done, of, got, bytes, stop }
  let pack = null;      // the newest offline.json
  let note = '';        // the last thing that went wrong

  if (can && state) register();   // keeps the worker (and so the copy) in step with every visit
  function register() { return navigator.serviceWorker.register('sw.js', { scope: './' }).catch(e => { console.warn('offline: no service worker', e); }); }

  // music and video come in two formats: the ones this browser plays (the same tests as js/audio.js and js/story/sea.js)
  function alts() {
    let music = 'aac', video = 'webm';
    try { const a = document.createElement('audio'); if (a.canPlayType('audio/mp4; codecs="opus"')) music = 'opus'; } catch (e) { /* no media */ }
    try { const v = document.createElement('video'); if (v.canPlayType('video/mp4; codecs="avc1.640028"')) video = 'mp4'; } catch (e) { /* no media */ }
    return [music, video];
  }
  const wanted = list => { const a = alts(); return list.filter(e => !e.alt || a.includes(e.alt)); };
  const MB = b => b < 1e5 ? Math.max(1, Math.round(b / 1e3)) + ' KB' : (b / 1e6 >= 100 ? Math.round(b / 1e6) : (b / 1e6).toFixed(1)) + ' MB';
  const GB = b => b >= 1e9 ? (b / 1e9).toFixed(1) + ' GB' : MB(b);
  const n = x => x.toLocaleString('en-GB');
  const files = x => n(x) + (x === 1 ? ' file' : ' files');
  const day = iso => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  async function getPack() {
    const r = await fetch('offline.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('offline.json ' + r.status);
    return (pack = await r.json());
  }
  // what is stored where: path -> hash, kept beside the copy and checked against what the caches really hold
  async function haveMap(name) {
    try {
      if (!(await caches.has(META))) return {};   // (opening it would make it: after Remove nothing must be left)
      const meta = await caches.open(META), r = await meta.match('have-' + name);
      const m = r ? await r.json() : {};
      if (!(await caches.has(name))) return {};
      const keys = new Set((await (await caches.open(name)).keys()).map(q => q.url.slice(BASE.length)));
      for (const p of Object.keys(m)) if (!keys.has(p)) delete m[p];
      return m;
    } catch (e) { return {}; }
  }
  async function saveHave(name, m) { await (await caches.open(META)).put('have-' + name, new Response(JSON.stringify(m), { headers: { 'Content-Type': 'application/json' } })); }

  // what's left to fetch for the newest pack: [entries, bytes]
  async function todo() {
    const list = wanted(pack.list), main = await haveMap(PACK), stage = state && state.version ? await haveMap(STAGE) : {};
    const left = list.filter(e => main[e.p] !== e.h && stage[e.p] !== e.h);
    return { list, left, bytes: left.reduce((s, e) => s + e.b, 0), total: list.reduce((s, e) => s + e.b, 0) };
  }

  // (one download at a time: the checks before it starts take a moment, and a second tap then started a second
  // download sharing the counter, which ran past the total on an iPhone, 2026-10-31)
  let starting = false;
  async function download() {
    if (job || starting) return;
    starting = true;
    try { await run(); } finally { starting = false; }
  }
  async function run() {
    note = '';
    try { await getPack(); } catch (e) { note = "Can't reach the game's server. Connect to the internet and try again."; return draw(); }
    await register();
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { /* not offered */ }
    const update = !!(state && state.version && state.version !== pack.version);
    const { list, left, bytes } = await todo();
    const target = update ? STAGE : PACK, cache = await caches.open(target);
    const have = await haveMap(target);
    if (!update) keep(state = { pending: pack.version });
    const J = job = { done: list.length - left.length, of: list.length, got: 0, bytes, stopped: false, failed: 0 };
    draw();
    const queue = left.slice();
    let dirty = 0;
    const one = async e => {
      for (let tryN = 0; ; tryN++) {
        try {
          const r = await fetch(BASE + e.p.split('/').map(encodeURIComponent).join('/') + '?offline-dl=' + e.h, { cache: 'no-store' });
          if (!r.ok) throw new Error(r.status);
          const blob = await r.blob();
          if (blob.size !== e.b) throw Object.assign(new Error('size'), { stale: true });
          const h = new Headers({ 'Content-Type': r.headers.get('Content-Type') || blob.type || 'application/octet-stream', 'Content-Length': String(blob.size), 'X-Offline-Hash': e.h });
          await cache.put(BASE + e.p, new Response(blob, { status: 200, headers: h }));
          if (have[e.p] !== e.h) { have[e.p] = e.h; J.done++; J.got += e.b; }
          if (++dirty >= 40) { dirty = 0; await saveHave(target, have); }
          return;
        } catch (err) {
          if (err && err.name === 'QuotaExceededError') throw err;
          if (err && err.stale) throw err;
          if (tryN >= 3 || J.stopped) throw err;
          await new Promise(r => setTimeout(r, 800 * (tryN + 1)));
        }
      }
    };
    let error = null;
    const worker = async () => {
      while (queue.length && !J.stopped && !error) {
        const e = queue.shift();
        try { await one(e); } catch (err) { error = err; }
        tick();
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    await saveHave(target, have);
    const stopped = J.stopped;
    job = null;
    if (error) {
      note = error.name === 'QuotaExceededError' ? 'The browser ran out of storage for this site. Free some space (or use another browser) and press Continue.'
        : error.stale ? 'The game was updated online while downloading. Press Continue to get the new version.'
        : 'The download stopped (the connection dropped?). Press Continue: it carries on from where it stopped.';
      return draw();
    }
    if (stopped) return draw();
    // complete: an update's files replace the old ones now, all together
    if (update) {
      const main = await caches.open(PACK), mainHave = await haveMap(PACK);
      const want = new Map(list.map(e => [e.p, e.h]));
      for (const req of await cache.keys()) {   // (only the staged files of this version: a stage left by an older update may hold others)
        const r = await cache.match(req), p = req.url.slice(BASE.length), h = r.headers.get('X-Offline-Hash');
        if (want.get(p) === h) { await main.put(req, r); mainHave[p] = h; }
      }
      await caches.delete(STAGE); await (await caches.open(META)).delete('have-' + STAGE);
      await saveHave(PACK, mainHave);
    }
    // files the pack no longer holds (or the other format's) go
    const keepSet = new Set(list.map(e => e.p)), main = await caches.open(PACK), mainHave = await haveMap(PACK);
    for (const req of await main.keys()) { const p = req.url.slice(BASE.length); if (!keepSet.has(p)) { await main.delete(req); delete mainHave[p]; } }
    await saveHave(PACK, mainHave);
    await (await caches.open(META)).put('latest', new Response(JSON.stringify(pack), { headers: { 'Content-Type': 'application/json' } }));
    await fonts();
    keep(state = { version: pack.version, built: pack.built, date: new Date().toISOString(), files: list.length, bytes: list.reduce((s, e) => s + e.b, 0) });
    draw();
  }

  // the Google Fonts stylesheet index.html links, and the font files it names (for this browser): kept for offline
  async function fonts() {
    try {
      const link = $('link[rel="stylesheet"][href*="fonts.googleapis.com"]'); if (!link) return;   // (not the preconnect link)
      const cache = await caches.open(FONTS);
      const r = await fetch(link.href, { mode: 'cors', credentials: 'omit' }); if (!r.ok) return;
      const css = await r.clone().text(); await cache.put(link.href, r);
      const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
      await Promise.all(urls.map(u => fetch(u, { mode: 'cors', credentials: 'omit' }).then(f => f.ok && cache.put(u, f)).catch(() => {})));
    } catch (e) { /* the game falls back on the browser's fonts */ }
  }

  async function remove() {
    if (job) job.stopped = true;
    for (const c of [PACK, STAGE, META, FONTS]) await caches.delete(c).catch(() => {});
    keep(state = null);
    try { for (const r of await navigator.serviceWorker.getRegistrations()) if (r.scope === BASE) { if (r.active) r.active.postMessage('forget'); await r.unregister(); } } catch (e) { /* none */ }
    note = 'The offline copy is removed.';
    draw();
  }

  // ---------------------------------------------------------------- the panel
  let box = null, lastTick = 0;
  function open() {
    $('#menu') && $('#menu').classList.remove('open');
    if (!box) {
      box = document.createElement('div'); box.id = 'offline'; box.className = 'modal';
      box.innerHTML = '<div class="card"><h3>Play offline</h3><p class="msg"></p><div class="bar hidden"><i></i></div><p class="prog"></p><p class="store"></p><p class="btns"></p></div>';
      box.addEventListener('click', e => { e.stopPropagation(); if (e.target === box) close(); });
      ($('#game') || document.body).appendChild(box);
    }
    box.classList.remove('hidden');
    draw(true);
  }
  function close() { if (box) box.classList.add('hidden'); }
  function tick() { const t = performance.now(); if (t - lastTick > 250 || !job) { lastTick = t; draw(); } label(); }
  function button(text, fn) { const b = document.createElement('button'); b.textContent = text; b.onclick = e => { e.stopPropagation(); fn(); }; return b; }

  let drawing = 0;
  async function draw(refetch) {
    label();
    if (!box || box.classList.contains('hidden')) return;
    const me = ++drawing, q = s => box.querySelector(s);
    const msg = q('.msg'), bar = q('.bar'), prog = q('.prog'), store = q('.store'), btns = q('.btns');
    const set = (m, p, buttons) => { if (me !== drawing) return; msg.innerHTML = m; prog.textContent = p || ''; btns.replaceChildren(...buttons, button('Close', close)); };
    bar.classList.toggle('hidden', !job);
    if (!can) return set(location.protocol === 'file:' ? 'Offline play needs the game opened from its web address (not from a file on disk).'
      : "This browser can't keep an offline copy. Try a current Chrome, Edge, Firefox or Safari.", '', []);
    if (job) {
      const pc = Math.min(1, job.bytes ? job.got / job.bytes : job.done / job.of);
      if (performance.now() - (job.shown || 0) > 3000) { job.shown = performance.now(); storage(job.bytes - job.got); }
      bar.firstChild.style.width = (pc * 100).toFixed(1) + '%';
      return set('Downloading the game into this browser. You can keep playing; leave this page open until it is done.',
        `${n(job.done)} of ${n(job.of)} files · ${MB(job.got)} of ${MB(job.bytes)}`, [button('Pause', () => { if (job) job.stopped = true; note = 'Paused. Continue carries on from where it stopped.'; })]);
    }
    if (refetch || !pack) { try { await getPack(); } catch (e) { /* offline, no copy yet */ } }
    if (me !== drawing) return;
    const extra = note ? `<br><span class="note">${note}</span>` : '';
    if (!pack) return set((state && state.version ? readyText() : "You're not connected, so the game can't be downloaded now.") + extra, '', state ? [button('Remove offline copy', remove)] : []);
    const t = await todo();
    if (me !== drawing) return;
    storage(t.bytes);
    if (state && state.version && state.version === pack.version && !t.left.length) return set(readyText() + extra, '', [button('Remove offline copy', remove)]);
    if (state && state.version) return set(readyText() + (state.version === pack.version ? `<br>Some files are missing from it: ${files(t.left.length)}, ${MB(t.bytes)}.` : `<br>A newer version is online: ${files(t.left.length)}, ${MB(t.bytes)} to download.`) + extra, '',
      [button('Update', download), button('Remove offline copy', remove)]);
    const started = t.left.length < t.list.length;
    set((started ? `Part-downloaded: ${MB(t.total - t.bytes)} of ${MB(t.total)}.` : `Download the whole game into this browser (${MB(t.total)}), then play it here without the internet: open this same address in this browser, even offline. Bookmark it, or add it to your home screen.`) + extra,
      '', [button(started ? 'Continue' : 'Download for offline', download), ...(started ? [button('Remove', remove)] : [])]);
  }
  function readyText() { return `Ready offline ✓ <span class="small">version ${state.version}${state.built ? ' of ' + day(state.built) : ''}, downloaded ${day(state.date)}, ${MB(state.bytes)}.</span><br>Open this address in this browser to play, with or without the internet.`; }
  async function storage(need) {
    const el = box && box.querySelector('.store'); if (!el) return;
    el.textContent = '';
    try {
      if (!navigator.storage || !navigator.storage.estimate) return;
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      const free = quota - usage;
      el.textContent = `Storage for this site: ${GB(usage)} used, about ${GB(free)} more allowed.` + (need > free ? ' Not enough for the download: free some space, or try another browser.' : '');
      el.classList.toggle('warn', need > free);
    } catch (e) { /* not offered */ }
  }
  // the menu's label shows a download running
  function label() {
    const b = $('#opt-offline'); if (!b) return;
    b.textContent = job ? `Offline: ${Math.floor(100 * (job.bytes ? job.got / job.bytes : job.done / job.of))}%` : state && state.version ? 'Offline ✓' : 'Play offline';
  }
  (function buttons() {
    const menu = $('#menu');
    if (menu && !$('#opt-offline')) { const b = button('Play offline', open); b.id = 'opt-offline'; menu.appendChild(b); label(); }
    const t = $('#title .menu');
    if (t && !$('#btn-offline')) { const b = button('Play offline', open); b.id = 'btn-offline'; b.className = 'quiet'; t.appendChild(b); }
  })();
  window.Offline = { open, download, remove, state: () => ({ state, job: job && Object.assign({}, job), pack: pack && pack.version }) };
})();
