import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
p.on('pageerror', e => console.error('ERR', e.message));
await p.addInitScript(() => { window.FAST = true; });
await p.goto('http://localhost:8098/', { waitUntil: 'load' });
await p.waitForSelector('#title.ready', { timeout: 120000 });
const out = await p.evaluate(() => {
  const E = window.Engine, strs = (o, acc = new Set()) => { if (!o) return acc; if (typeof o === 'string') acc.add(o); else if (Array.isArray(o)) o.forEach(x => strs(x, acc)); else if (typeof o === 'object') Object.values(o).forEach(x => strs(x, acc)); return acc; };
  const rooms = {};
  for (const [id, r] of Object.entries(E.ROOMS)) {
    const list = [];
    for (const n of (r.npcs || [])) list.push({ id: n.id, ch: n.ch || n.id, h: n.h || null, x: n.x, y: n.y, kind: 'npc' });
    for (const a of (r.ambient || [])) list.push({ id: a.id, ch: a.id, h: a.h || null, x: a.x, y: a.y, scale: a.scale || 1, kind: "ambient", frames: [...strs([a.frames, a.walk, a.talkFrames, a.poses, a.sets, a.loop])], main: [...strs([a.frames, a.talkFrames])] });
    rooms[id] = { scale: r.scale || null, list };
  }
  const chars = {};
  for (const [id, c] of Object.entries(E.CHARS)) chars[id] = { scale: c.scale || 1, frames: [...strs(c.frames)], main: [...strs([c.frames.idle, c.frames.talk])], anim: c.anim || null };
  return { rooms, chars };
});
console.log(JSON.stringify(out));
await b.close();
