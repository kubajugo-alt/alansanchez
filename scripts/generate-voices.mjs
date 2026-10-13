// Regenerates voice-over for every line in js/lines.js using the ElevenLabs API.
//   ELEVENLABS_API_KEY=... node scripts/generate-voices.mjs            # only missing lines
//   ELEVENLABS_API_KEY=... node scripts/generate-voices.mjs --force    # everything
//   ELEVENLABS_API_KEY=... node scripts/generate-voices.mjs alan_ring  # specific ids
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'audio', 'voice');
const cast = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'cast.json'), 'utf8'));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js', 'lines.js'), 'utf8'), sandbox);
const LINES = sandbox.window.LINES;

const key = process.env.ELEVENLABS_API_KEY;
if (!key) { console.error('Set ELEVENLABS_API_KEY'); process.exit(1); }
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter(a => !a.startsWith('--'));
fs.mkdirSync(outDir, { recursive: true });

for (const [id, [who, text]] of Object.entries(LINES)) {
  if (only.length && !only.includes(id)) continue;
  const file = path.join(outDir, id + '.mp3');
  if (!force && !only.length && fs.existsSync(file)) continue;
  const voice = cast.voices[who];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: cast.model_id }),
  });
  if (!res.ok) { console.error(id, res.status, await res.text()); continue; }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('✓', id);
}
await import('./build-manifest.mjs');
