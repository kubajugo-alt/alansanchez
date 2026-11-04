// Every room's hotspots as the game has them (HANDOFF entry 146), for the hotspot tool: room, its paintings, each
// hotspot's name (as layout.js keys it), box, whether it's an exit, and when it shows; the walkable floor.
//   node sequel/scripts/tests/spots_dump.mjs <baseUrl> <out.json>
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const [base, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
await p.goto(base, { timeout: 90000 }); await p.waitForSelector('#title.ready', { timeout: 90000 });
const data = await p.evaluate(() => {
  const nameOf = h => { try { return typeof h.name === 'function' ? h.name() : h.name; } catch (e) { return null; } };
  const src = f => typeof f === 'function' ? String(f).replace(/\s+/g, ' ').replace(/^\(\)\s*=>\s*/, '').slice(0, 160) : null;
  const rooms = {};
  for (const [id, r] of Object.entries(Engine.ROOMS)) {
    const hs = (r.hotspots || []).map(h => ({ name: nameOf(h), rect: Array.isArray(h.rect) ? h.rect.map(Math.round) : null,
      exit: h.exit || null, when: src(h.when), at: h.at || null, noBox: !!h.noBox })).filter(h => h.name && h.rect);
    if (!hs.length) continue;
    const bgs = [r.bg].concat(r.bgs || []).filter((v, i, a) => v && a.indexOf(v) === i);
    rooms[id] = { name: typeof r.name === 'function' ? null : r.name, bgs, hotspots: hs, walk: r.walk || null, painted: !!r.painted };
  }
  return rooms;
});
fs.writeFileSync(out, JSON.stringify(data, null, 1));
console.log(Object.keys(data).length, 'rooms,', Object.values(data).reduce((n, r) => n + r.hotspots.length, 0), 'hotspots');
await b.close();
