// The Shortest Night (a copy of Game I's scripts/build-manifest.mjs, run on sequel/). Writes audio/voice/manifest.json and audio/sfx/manifest.json: the lists of
// voice lines and sound effects that have a recording.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'audio');
for (const sub of ['voice', 'sfx']) {
  const dir = path.join(root, sub);
  if (!fs.existsSync(dir)) continue;
  // id -> short content hash: audio is cached for a year, so every recording is
  // fetched as name.mp3?v=<hash> and a re-recorded line is never served stale
  const ids = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
  const out = {};
  for (const id of ids) out[id] = crypto.createHash('md5').update(fs.readFileSync(path.join(dir, id + '.mp3'))).digest('hex').slice(0, 8);
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(out, null, 0) + '\n');
  console.log(`manifest: ${ids.length} ${sub} files`);
}

// A line id defined twice in js/lines.js silently keeps the later text while the
// recording on disk belongs to the earlier one: voice and caption no longer match.
const lines = fs.readFileSync(path.join(root, '..', 'js', 'lines.js'), 'utf8');
const seen = new Map(), dupes = [];
for (const m of lines.matchAll(/^\s+([a-z0-9_]+): \[/gm)) { if (seen.has(m[1])) dupes.push(m[1]); seen.set(m[1], true); }
if (dupes.length) { console.error('duplicate line ids in js/lines.js: ' + dupes.join(', ')); process.exit(1); }

// Scripts and the stylesheet are stamped with a content hash in index.html, so a
// phone that holds on to an old copy can never mix new story code with old lines.
const top = path.join(root, '..'), indexFile = path.join(top, 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');
html = html.replace(/(<script src="|<link rel="stylesheet" href=")((?:js|css)\/[^"?]+)(?:\?v=[0-9a-f]+)?"/g, (m, pre, file) => {
  const f = path.join(top, file);
  if (!fs.existsSync(f)) return m;
  return `${pre}${file}?v=${crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8)}"`;
});
fs.writeFileSync(indexFile, html);
