// The Shortest Night: voices every line in js/lines.js with ElevenLabs, from scripts/cast.json (the user's picks,
// 2026-10-28; a speaker set to null is not cast yet and is skipped). A copy of Game I's scripts/generate-voices.mjs,
// with three changes: the key is read from the repository's .env (never printed); a few requests run at once, with a
// retry on rate limits; and the phone lines (Inês, Elena's message, Carmen's answering machine) are kept as recorded
// in audio/voice_src/ and played through scripts/phone_fx.sh into audio/voice/.
//   node sequel/scripts/generate-voices.mjs              # only missing lines
//   node sequel/scripts/generate-voices.mjs --force      # everything cast
//   node sequel/scripts/generate-voices.mjs alan_ring    # specific ids
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'audio', 'voice'), srcDir = path.join(root, 'audio', 'voice_src');
const cast = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'cast.json'), 'utf8'));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js', 'lines.js'), 'utf8'), sandbox);
const LINES = sandbox.window.LINES;

let key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  const env = path.join(root, '..', '.env');
  if (fs.existsSync(env)) key = (fs.readFileSync(env, 'utf8').match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1];
}
if (!key) { console.error('Set ELEVENLABS_API_KEY (or put it in the repository .env)'); process.exit(1); }
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter(a => !a.startsWith('--'));
fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(srcDir, { recursive: true });
const isPhone = (id, who) => cast.phone.speakers.includes(who) || cast.phone.ids.includes(id);

const jobs = [];
const skipped = {};
for (const [id, [who, text]] of Object.entries(LINES)) {
  if (only.length && !only.includes(id)) continue;
  const voice = cast.voices[who];
  if (!voice) { skipped[who] = (skipped[who] || 0) + 1; continue; }
  const file = path.join(outDir, id + '.mp3');
  if (!force && !only.length && fs.existsSync(file)) continue;
  jobs.push({ id, who, text, voice, file });
}
console.log(`${jobs.length} lines to voice` + (Object.keys(skipped).length ? `; not cast yet: ${JSON.stringify(skipped)}` : ''));

// a voice can carry its own model and language: the Spanish cast reads English with language_code "es",
// which is what gives them their accent; Turbo doesn't read [bracket] directions, so those become a pause
function body(j) {
  const model_id = j.voice.model_id || cast.model_id;
  let text = j.text;
  if (/turbo|flash/.test(model_id)) text = text.replace(/\[pause\]/g, '…').replace(/\s*\[[^\]]*\]\s*/g, ' ').trim();
  const b = { text, model_id };
  if (j.voice.language_code) b.language_code = j.voice.language_code;
  return b;
}

const wait = ms => new Promise(r => setTimeout(r, ms));
let done = 0, failed = 0;
async function one(j) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${j.voice.voice_id}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify(body(j)),
    });
    if (res.status === 429 || res.status >= 500) { await wait(2000 * (attempt + 1)); continue; }
    if (!res.ok) { console.error('✗', j.id, res.status, (await res.text()).slice(0, 200)); failed++; return; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (isPhone(j.id, j.who)) {
      const raw = path.join(srcDir, j.id + '.mp3');
      fs.writeFileSync(raw, buf);
      execFileSync('bash', [path.join(root, 'scripts', 'phone_fx.sh'), raw, j.file, cast.phone.preset]);
    } else if (j.voice.fx) {
      // a voice with its own effect (the parrot: pitched up and thinned) is saved raw, then filtered
      const raw = path.join(srcDir, j.id + '.mp3');
      fs.writeFileSync(raw, buf);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', j.voice.fx, j.file]);
    } else fs.writeFileSync(j.file, buf);
    done++; if (done % 25 === 0) console.log(`✓ ${done}/${jobs.length}`);
    return;
  }
  console.error('✗', j.id, 'rate-limited five times'); failed++;
}
const queue = jobs.slice();
await Promise.all(Array.from({ length: 3 }, async () => { while (queue.length) await one(queue.shift()); }));
console.log(`done: ${done} voiced, ${failed} failed`);
await import('./build-manifest.mjs');
