// Writes audio/voice/manifest.json and audio/sfx/manifest.json: the lists of
// voice lines and sound effects that have a recording.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'audio');
for (const sub of ['voice', 'sfx']) {
  const dir = path.join(root, sub);
  if (!fs.existsSync(dir)) continue;
  const ids = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(ids, null, 0) + '\n');
  console.log(`manifest: ${ids.length} ${sub} files`);
}

// A line id defined twice in js/lines.js silently keeps the later text while the
// recording on disk belongs to the earlier one: voice and caption no longer match.
const lines = fs.readFileSync(path.join(root, '..', 'js', 'lines.js'), 'utf8');
const seen = new Map(), dupes = [];
for (const m of lines.matchAll(/^\s+([a-z0-9_]+): \[/gm)) { if (seen.has(m[1])) dupes.push(m[1]); seen.set(m[1], true); }
if (dupes.length) { console.error('duplicate line ids in js/lines.js: ' + dupes.join(', ')); process.exit(1); }
