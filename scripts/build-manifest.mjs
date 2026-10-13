// Writes audio/voice/manifest.json: the list of line ids that have a recording.
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'audio', 'voice');
const ids = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(ids, null, 0) + '\n');
console.log(`manifest: ${ids.length} voice lines`);
