// Checks the game's data in the running page: every line id the story's code names exists, every room's painting is on
// disk, every exit goes to a room, every figure's frames exist, every item has a name.   usage: node validate.mjs [baseUrl]
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8097/';
const G3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
await page.goto(base, { waitUntil: 'load' });
await page.waitForFunction(() => window.S && window.Engine && Engine.ROOMS && Object.keys(Engine.ROOMS).length > 5, null, { timeout: 60000 });
const data = await page.evaluate(() => {
  const out = { rooms: {}, lines: Object.keys(LINES), speakers: Object.keys(SPEAKERS), sprites: Object.keys(Engine.SPRITES), chars: {}, items: {} };
  for (const [id, r] of Object.entries(Engine.ROOMS)) out.rooms[id] = { bg: [r.bg].concat(r.bgs || []), exits: (r.hotspots || []).filter(h => h.exit && typeof h.exit === 'string').map(h => h.exit),
    npcs: (r.npcs || []).map(n => n.ch || n.id) };
  for (const [id, c] of Object.entries(Engine.CHARS)) { const ks = new Set(); const walk = v => { if (typeof v === 'string') ks.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }; walk(c.frames); out.chars[id] = [...ks]; }
  for (const [id, it] of Object.entries(Engine.ITEMS)) out.items[id] = !!it.name;
  out.lineSpk = Object.entries(LINES).filter(([k, v]) => !SPEAKERS[v[0]]).map(([k, v]) => k + ':' + v[0]);
  return out;
});
const problems = [];
const lines = new Set(data.lines), sprites = new Set(data.sprites);
for (const [id, r] of Object.entries(data.rooms)) {
  for (const b of r.bg) if (b && !fs.existsSync(path.join(G3, 'art/bg', b + '.jpg'))) problems.push(`room ${id}: no painting art/bg/${b}.jpg`);
  for (const x of r.exits) if (!data.rooms[x]) problems.push(`room ${id}: exit to unknown room ${x}`);
  for (const n of r.npcs) if (!data.chars[n]) problems.push(`room ${id}: person ${n} has no character`);
}
for (const [id, ks] of Object.entries(data.chars)) for (const k of ks) if (!sprites.has(k) && /_/.test(k) && !/^(walkStep|frontStep|backStep)$/.test(k)) problems.push(`character ${id}: no frame ${k}`);
for (const [id, ok] of Object.entries(data.items)) if (!ok) problems.push(`item ${id}: no name`);
for (const x of data.lineSpk) problems.push(`line ${x}: unknown speaker`);
// line ids named in the story's code: quoted words that look like ids (speaker_...) or are passed to say()
const spk = data.speakers.join('|');
const re = new RegExp(`['"]((?:${spk})_[a-z0-9_]+)['"]`, 'g');
const files = fs.readdirSync(path.join(G3, 'js/story')).map(f => path.join(G3, 'js/story', f));
const frames = new Set(data.sprites);
for (const f of files) { const t = fs.readFileSync(f, 'utf8'); let m; while ((m = re.exec(t))) { const id = m[1]; if (!lines.has(id) && !frames.has(id) && !/_g3$|_fail_$|_ded_$|_k$/.test(id)) problems.push(`${path.basename(f)}: line ${id} does not exist`); } }
console.log(`${data.lines.length} lines, ${Object.keys(data.rooms).length} rooms, ${Object.keys(data.chars).length} characters, ${Object.keys(data.items).length} items`);
const uniq = [...new Set(problems.concat(errs))];
uniq.slice(0, 80).forEach(p => console.log('  ' + p));
console.log(uniq.length ? uniq.length + ' problems' : 'no problems');
await browser.close();
process.exit(uniq.length ? 1 : 0);
