// The placement tool, step 1 (ported from Game II's placer, 2026-11-04): read every room's floor, depth scale and
// people (cast and background extras, with each one's first frame, facing and height on screen) out of the running game,
// so scripts/placer_build.py can make the tool's page from them. Nothing in the game changes.
//   node scripts/tests/placer_dump.mjs <baseUrl> [out.json]      (default art/review/placer/rooms.json; serve the game first)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://localhost:8098/';
const out = process.argv[3] || 'art/review/placer/rooms.json';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { window.FAST = true; });
await p.goto(base); await p.waitForSelector('#title.ready', { timeout: 120000 });
const rooms = await p.evaluate(() => {
  const val = v => { try { return typeof v === 'function' ? v() : v; } catch (e) { return null; } };
  const first = v => Array.isArray(v) ? v[0] : v;
  const SP = window.SPRITES, out = [];
  for (const [id, r] of Object.entries(S.ROOMS)) {
    if (!r.bg || r.player === false || !r.walk) continue;
    const sc = r.scale || [540, 300, 716, 360];
    const at = y => sc[1] + (sc[3] - sc[1]) * Math.max(0, Math.min(1, (y - sc[0]) / (sc[2] - sc[0])));
    const people = [], seen = {};
    const add = (n, ambient) => {
      const ch = n.ch || n.id, C = S.CHARS[ch];
      let frame = null, scale = 1;
      if (ambient) { frame = first(n.frames); scale = n.scale || 1; }
      else if (C && C.frames) {
        const set = val(n.set), F = C.frames;
        frame = first((set && F.sets && F.sets[set] && F.sets[set].idle) || F.idle); scale = C.scale || 1;
      }
      const sp = frame && SP[frame];
      const k = seen[n.id] = (seen[n.id] || 0) + 1;   // (the same id twice in a room: its second def is "id#2")
      const x = val(n.x), y = val(n.y), dir = val(n.dir) || 'e';
      if (x == null || y == null) return;
      const flip = ambient && !n.flip ? false : dir === 'w' ? !(sp && sp.facesLeft) : dir === 'e' ? !!(sp && sp.facesLeft) : false;
      people.push({ key: k > 1 ? `${n.id}#${k}` : n.id, id: n.id, name: val(n.name) || null, ambient: !!ambient, when: !!n.when, frame, src: sp ? (sp.src || null) : null,
        sprite: sp ? { w: sp.w, hh: sp.hh, h: sp.h, ax: sp.ax, fy: sp.fy, top: sp.top, facesLeft: !!sp.facesLeft } : null,
        x, y, dir, flip, fixedH: n.h || null, size: n.size || 1, z: n.z || 0, scale, hShown: (n.h || at(y)) * scale * (n.size || 1) });
    };
    for (const n of r.npcs || []) add(n, false);
    for (const n of r.ambient || []) add(n, true);
    out.push({ id, name: val(r.name) || id, bg: r.bg, walk: r.walk, scale: sc, people });
  }
  const a = SP[first(S.CHARS.alan.frames.idle)];
  return { rooms: out, alan: { frame: first(S.CHARS.alan.frames.idle), sprite: a, scale: S.CHARS.alan.scale || 1 } };
});
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(rooms, null, 1));
console.log(rooms.rooms.length, 'rooms,', rooms.rooms.reduce((s, r) => s + r.people.length, 0), 'people ->', out, errs.length ? 'errors: ' + errs.join(' | ') : '');
await b.close();
