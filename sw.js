// The offline copy's service worker (Game II's HANDOFF entry 127; js/offline.js downloads the copy). The same file in
// both games (each is its own site, so their caches never meet).
// Registered only in a browser that has asked for the offline copy (the menu's "Play offline"), so everyone else plays
// straight from the network as before. What it does:
// - index.html (any visit to the game's address) and offline.json: from the network when there is one, so a new
//   deploy is seen at once; the stored copy when there is none.
// - every file of the pack: from the offline copy when the copy's file is the one the newest offline.json lists
//   (its hash), else from the network; with no network, the copy whatever its age (so a copy never mixes with nothing).
//   The ?v= stamps on the game's urls are ignored for the lookup (the copy is stored by path).
// - Range requests (audio and video elements ask for byte ranges; Safari insists) are answered with a 206 slice.
// - Google Fonts: kept once seen, refreshed in the background (the game still works without them).
const PACK = 'sn-offline', META = 'sn-offline-meta', FONTS = 'sn-fonts';
const BASE = new URL('./', self.location).href;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// the newest offline.json seen (path -> hash), kept in META so a restarted worker still knows it
let latest = null;
async function readLatest() {
  if (latest) return latest;
  try { const r = await (await caches.open(META)).match('latest'); if (r) latest = index(await r.json()); } catch (e) { /* none yet */ }
  return latest;
}
function index(j) { const m = new Map(); for (const e of (j && j.list) || []) m.set(e.p, e.h); return { version: j && j.version, map: m }; }
async function fetchLatest() {
  const r = await timed(fetch(BASE + 'offline.json', { cache: 'no-store' }), 6000);
  if (!r.ok) throw new Error('offline.json ' + r.status);
  const j = await r.clone().json();
  latest = index(j);
  await (await caches.open(META)).put('latest', new Response(JSON.stringify(j), { headers: { 'Content-Type': 'application/json' } }));
  return r;
}
const timed = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return e.respondWith(font(e));
  if (!req.url.startsWith(BASE)) return;
  if (url.searchParams.has('offline-dl')) return;          // the downloader's own requests go to the network
  let rel = decodeURIComponent(url.pathname.slice(new URL(BASE).pathname.length));
  if (req.mode === 'navigate' || rel === '' || rel === 'index.html') return e.respondWith(page(req));
  if (rel === 'offline.json') return e.respondWith(fetchLatest().catch(async () => (await caches.open(META)).match('latest') || Response.error()));
  if (rel === 'sw.js') return;
  e.respondWith(file(req, rel));
});

// the page: network first (with offline.json alongside, so the files it asks for next are judged against the newest
// list); the stored index.html with no network
async function page(req) {
  const listed = fetchLatest().catch(() => null);
  try {
    const r = await timed(fetch(req.url, { cache: 'no-store', credentials: 'same-origin' }), 8000);   // (a navigate Request can't be refetched with options)
    await timed(listed, 3000).catch(() => null);
    return r;
  } catch (err) {
    const c = await (await caches.open(PACK)).match(BASE + 'index.html');
    return c || Response.error();
  }
}

async function file(req, rel) {
  const cache = await caches.open(PACK);
  const hit = await cache.match(BASE + rel);
  if (hit) {
    const L = await readLatest(), want = L && L.map.get(rel);
    if (!want || hit.headers.get('X-Offline-Hash') === want) return ranged(req, hit);
    // the copy is older than the deploy: the network's, or the copy if there's no network
    try { return await fetch(req); } catch (err) { return ranged(req, hit); }
  }
  return fetch(req);
}

// a byte range out of a whole stored file (206), or the whole file
async function ranged(req, res) {
  const range = req.headers.get('Range');
  if (!range) return res;
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  const blob = await res.blob(), size = blob.size;
  let start, end;
  if (m && m[1] !== '') { start = +m[1]; end = m[2] !== '' ? Math.min(+m[2], size - 1) : size - 1; }
  else if (m && m[2] !== '') { start = Math.max(0, size - +m[2]); end = size - 1; }
  if (!m || start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  const h = new Headers(res.headers);
  h.set('Content-Range', `bytes ${start}-${end}/${size}`);
  h.set('Content-Length', String(end - start + 1));
  h.set('Accept-Ranges', 'bytes');
  return new Response(blob.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers: h });
}

// Google Fonts: the stored copy at once, refreshed behind it; network when there's none
async function font(e) {
  const cache = await caches.open(FONTS);
  const hit = await cache.match(e.request.url, { ignoreVary: true });
  const fresh = fetch(e.request.url, { mode: 'cors', credentials: 'omit' })
    .then(r => { if (r.ok) cache.put(e.request.url, r.clone()); return r; });
  if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
  return fresh.catch(() => fetch(e.request));
}

// js/offline.js asks the worker to forget the newest list when the copy is removed
self.addEventListener('message', e => { if (e.data === 'forget') latest = null; });
