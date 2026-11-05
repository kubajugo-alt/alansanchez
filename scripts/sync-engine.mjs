// The engine both games share (Game I's handoff entry 86, Game II's 153): these files are the same, byte for byte, in
// the repository root (Game I) and in sequel/ (Game II). A fix is made in one and copied to the other with this script;
// anything that belongs to one game is data the engine reads (js/game.js, the story), never an edit to these files.
//   node scripts/sync-engine.mjs --check          lists the files that differ (exit 1 if any): both validators run this
//   node scripts/sync-engine.mjs --from game1     copies Game I's copy over Game II's (or --from game2 the other way)
// Copying never guesses: it refuses when both copies changed since they last matched (git's HEAD), so a fix in each game
// is merged by hand, not overwritten.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const SHARED = [
  'js/engine/base.js', 'js/engine/actor.js', 'js/engine/lights.js', 'js/engine/geometry.js', 'js/engine/rooms.js',
  'js/engine/render.js', 'js/engine/faces.js', 'js/engine/rig.js', 'js/engine/smoke.js', 'js/engine/speech.js',
  'js/engine/inventory.js', 'js/engine/input.js', 'js/engine/stills.js', 'js/engine/saves.js', 'js/engine/tips.js',
  'js/engine.js', 'js/fx.js', 'js/audio.js', 'js/warp.js', 'js/parallax.js', 'js/offline.js', 'sw.js', 'css/style.css',
  'scripts/tests/offline.mjs',
];
const G1 = f => path.join(ROOT, f), G2 = f => path.join(ROOT, 'sequel', f);
const read = p => { try { return fs.readFileSync(p); } catch (e) { return null; } };
export function differing() { return SHARED.filter(f => { const a = read(G1(f)), b = read(G2(f)); return !a || !b || !a.equals(b); }); }

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2), from = args.includes('--from') ? args[args.indexOf('--from') + 1] : null;
  const diff = differing();
  if (!from) {
    if (!diff.length) { console.log(`engine: the ${SHARED.length} shared files match in both games`); process.exit(0); }
    console.log('engine: these shared files differ between Game I and Game II (node scripts/sync-engine.mjs --from game1|game2):');
    for (const f of diff) console.log('  ' + f);
    process.exit(1);
  }
  if (!['game1', 'game2'].includes(from)) { console.error('--from game1 or --from game2'); process.exit(2); }
  const src = from === 'game1' ? G1 : G2, dst = from === 'game1' ? G2 : G1;
  // the last agreed copy: HEAD's, when both games' copies matched there
  const head = f => { try { return execFileSync('git', ['show', 'HEAD:' + f], { cwd: ROOT, maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { return null; } };
  let refused = 0;
  for (const f of diff) {
    const base = head(f), other = read(dst(f));
    if (base && other && !other.equals(base) && read(src(f)) && !read(src(f)).equals(base)) {
      console.error(`refused: ${f} changed in both games since HEAD; merge it by hand`); refused++; continue;
    }
    fs.mkdirSync(path.dirname(dst(f)), { recursive: true });
    fs.copyFileSync(src(f), dst(f)); console.log(`copied ${f} (${from} -> ${from === 'game1' ? 'game2' : 'game1'})`);
  }
  process.exit(refused ? 1 : 0);
}
