// Writes audio/voice/manifest.json and audio/sfx/manifest.json: the lists of
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

// offline.json: the offline pack (from Game II, its HANDOFF entry 127; here handoff entry 91). Every file Game I's export
// (`git archive HEAD`) holds that
// the game can load: what the menu's "Play offline" downloads into the browser and sw.js serves without a connection.
// Built from git's file list (tracked, plus new files not ignored, so files about to be committed count) less what
// .gitattributes export-ignores, less files the game never loads. Run after the other stamps above (index.html's hash
// changes with them). Each file has its size and a short content hash: an update fetches only the files that changed.
// Music and video come in two formats; `alt` says which one, and a browser downloads only the one it plays.
import { execFileSync } from 'node:child_process';
{
  const git = (args, input) => execFileSync('git', args, { cwd: top, input, maxBuffer: 1 << 28, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
  // (Netlify runs this script again on the export: with no git there, the committed offline.json stands)
  let files = [];
  try { files = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '.']).split('\0').filter(Boolean)
    .filter(f => fs.existsSync(path.join(top, f)) && fs.statSync(path.join(top, f)).isFile()); } catch (e) { files = null; }
  if (files) {
  // export-ignore set on a folder (`/scripts`) covers everything under it: ask git about every path and its folders
  const dirs = new Set();
  for (const f of files) { const p = f.split('/'); for (let i = 1; i < p.length; i++) dirs.add(p.slice(0, i).join('/')); }
  const ignored = new Set();
  const out = git(['check-attr', '--stdin', '-z', 'export-ignore'], [...files, ...dirs].join('\0') + '\0').split('\0');
  for (let i = 0; i + 2 < out.length; i += 3) if (out[i + 2] === 'set') ignored.add(out[i]);
  const exported = f => { if (ignored.has(f)) return false; const p = f.split('/'); for (let i = 1; i < p.length; i++) if (ignored.has(p.slice(0, i).join('/'))) return false; return true; };
  // in the export but never loaded by the game: the host's config, git's, notes beside the art
  // (Game I's export also carries its tools, notes and lip-sync sources: scripts/, docs/, lipsync/; js/lipsync.js is the game's.
  // sequel/ is out of the export by .gitattributes, but as a folder pattern, which the check above does not see)
  const NOT_GAME = /^(netlify\.toml|\.gitattributes|\.gitignore|offline\.json|sw\.js)$|^(scripts|docs|lipsync|sequel)\/|(^|\/)\.keep$|\.(md|txt)$/;
  const pack = [];
  let total = 0;
  const vh = crypto.createHash('md5');
  for (const f of files.filter(exported).filter(f => !NOT_GAME.test(f)).sort()) {
    const buf = fs.readFileSync(path.join(top, f));
    const h = crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
    const e = { p: f, b: buf.length, h };
    const alt = /\.(opus|aac)\.m4a$/.exec(f) || (f.startsWith('art/video/') && /\.(mp4|webm)$/.exec(f));
    if (alt) e.alt = alt[1];
    pack.push(e); total += buf.length; vh.update(f + ' ' + h + '\n');
  }
  const offline = { version: vh.digest('hex').slice(0, 10), built: new Date().toISOString().slice(0, 10), files: pack.length, totalBytes: total, list: pack };
  // the date alone never changes the version, so keep the old date when nothing else changed (no noise in git)
  try { const old = JSON.parse(fs.readFileSync(path.join(top, 'offline.json'), 'utf8')); if (old.version === offline.version) offline.built = old.built; } catch (e) { /* first build */ }
  fs.writeFileSync(path.join(top, 'offline.json'), JSON.stringify(offline).replace(/\},\{/g, '},\n{') + '\n');
  console.log(`offline pack: ${pack.length} files, ${(total / 1e6).toFixed(1)} MB (version ${offline.version})`);
  } else console.log('offline pack: no git here, offline.json left as committed');
}
