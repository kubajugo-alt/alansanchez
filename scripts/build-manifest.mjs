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
