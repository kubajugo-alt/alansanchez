// Static checks for the story scripts, run before every commit:  node scripts/validate.mjs
// Errors (exit 1): code swallowed by a // comment on the same line; a line id the code uses that isn't in
// js/lines.js; a line with no mp3; a pose that names a sprite that doesn't exist.
// js/lipsync.js cues made from an older recording (or for a line that's gone).
// Warnings: flags read but never set, flags set but never read, lines nothing uses (retired ids); a talk or
// idle frame drawn at a different size from its character's standing frame.
// It reads the files as text and makes no changes. --quiet prints errors only.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rel = p => path.relative(ROOT, p);
const quiet = process.argv.includes('--quiet');
const load = (file, name) => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, file), 'utf8'))(w); return w[name]; };

const LINES = load('js/lines.js', 'LINES'), SPRITES = load('js/sprites.js', 'SPRITES');
const SFX = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'audio/sfx/manifest.json'), 'utf8')).files || {}));
const VOICE = new Set(fs.readdirSync(path.join(ROOT, 'audio/voice')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
// every hand-written script (generated data and the review screen aside)
// (lipsync.js and faces.js name every voiced line and frame: counting them would hide lines nothing plays)
const GENERATED = new Set(['js/lines.js', 'js/sprites.js', 'js/morphs.js', 'js/similar.js', 'js/lipsync.js', 'js/faces.js']);
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []);
const FILES = walk(path.join(ROOT, 'js')).filter(f => !GENERATED.has(rel(f)));
const SRC = Object.fromEntries(FILES.map(f => [f, fs.readFileSync(f, 'utf8')]));

const errors = [], warnings = [];
const at = (f, i) => `${rel(f)}:${i + 1}`;

// ---------------------------------------------------------------- code hidden in a trailing comment
// `x(); // note   y();` runs only x(): a statement after the comment marker is dead (both bugs the playthrough found)
const CODE_IN_COMMENT = /(?:^|[\s;{}()])(?:await [\w.]+\(|F\(\)\.\w+\s*=(?!=)|when:\s*\(\)\s*=>|(?:say|joke)\('\w+')/;
const inString = code => { let q = null; for (let i = 0; i < code.length; i++) { const c = code[i]; if (q) { if (c === '\\') i++; else if (c === q) q = null; } else if (c === "'" || c === '"' || c === '`') q = c; } return !!q; };
for (const [f, src] of Object.entries(SRC)) {
  src.split('\n').forEach((line, i) => {
    let m = null; // code, then a comment on the same line (the first // that isn't inside a string)
    for (const x of line.matchAll(/\s\/\/(?!\/)/g)) { const code = line.slice(0, x.index); if (code.trim() && !inString(code)) { m = [null, code, line.slice(x.index + 3)]; break; } }
    if (!m) return;
    if (CODE_IN_COMMENT.test(m[2].trim())) errors.push(`${at(f, i)}: code after a // comment never runs: ${m[2].trim().slice(0, 90)}`);
  });
}

// ---------------------------------------------------------------- line ids
// a quoted word shaped like a line id (speaker_something) must be a line, unless it's a sprite, a sound or a known other key
const SPEAKERS = new Set(Object.values(LINES).map(v => v[0]));
const OTHER = new Set([...Object.keys(SPRITES), ...SFX]);
const used = new Set();
for (const [f, src] of Object.entries(SRC)) {
  src.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/['"]([a-z][a-z0-9]*_[a-z0-9_]+)['"]/g)) {
      const id = m[1];
      if (LINES[id]) { used.add(id); continue; }
      if (id.endsWith('_')) continue; // a prefix the code completes at run time ('narr_fun_' + n)
      if (!SPEAKERS.has(id.split('_')[0]) || OTHER.has(id)) continue;
      // only where a line is expected: say/joke/sayChoice arguments and line/look/react/hint fields
      const before = line.slice(0, m.index);
      if (/(?:say|joke|says|sayChoice|lyrics)\([^)]*$|\b(?:line|look|react|hint|talk)\s*:\s*$/.test(before)) errors.push(`${at(f, i)}: '${id}' is not in js/lines.js`);
    }
  });
}
for (const id of Object.keys(LINES)) if (!VOICE.has(id)) errors.push(`js/lines.js: '${id}' has no audio/voice/${id}.mp3`);
const unused = Object.keys(LINES).filter(id => !used.has(id));
// ids built at run time (prefix + number) count as used when their prefix appears in the code
const ALL = Object.values(SRC).join('\n');
const dynamic = id => { const p = id.replace(/\d+$/, ''); return p !== id && (ALL.includes(`'${p}'`) || ALL.includes(`\`${p}`) || ALL.includes(`'${p}' +`)); };
const retired = unused.filter(id => !dynamic(id));
if (retired.length) warnings.push(`${retired.length} lines in js/lines.js are never used by the code: ${retired.join(', ')}`);

// ---------------------------------------------------------------- poses name real sprites
for (const [f, src] of Object.entries(SRC)) {
  const m = src.match(/poses:\s*\{([^}]*)\}/g) || [];
  for (const block of m) for (const p of block.matchAll(/(\w+):\s*'([a-z0-9_]+)'/g)) {
    if (!SPRITES[p[2]]) warnings.push(`${rel(f)}: pose '${p[1]}' names '${p[2]}', which has no sprite (the scene falls back)`);
  }
}

// ---------------------------------------------------------------- flags
// set: F().x = / += / ++, Object.assign(F(), { x }), F()[x] = ; read: every other F().x
// (G.flags.x and f.x, in a file that names F() as f, count the same as F().x)
const set = new Map(), read = new Map();
const note = (map, k, where) => { if (!map.has(k)) map.set(k, where); };
for (const [f, src] of Object.entries(SRC)) {
  if (/js\/(review|walklab)\.js$/.test(f)) continue; // tools, not the game (their f is something else)
  const flagRef = /\b(?:const|let)\s+f\s*=\s*F\(\)/.test(src) ? /(?:F\(\)|G\.flags|\bf)\.(\w+)(\s*(?:[+\-*|&]?=(?!=)|\+\+|--))?/g : /(?:F\(\)|G\.flags)\.(\w+)(\s*(?:[+\-*|&]?=(?!=)|\+\+|--))?/g;
  src.split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '');
    for (const m of code.matchAll(flagRef)) note(m[2] ? set : read, m[1], at(f, i));
    for (const m of code.matchAll(/Object\.assign\(F\(\),\s*\{([^}]*)\}/g)) for (const k of m[1].matchAll(/(\w+)\s*:/g)) note(set, k[1], at(f, i));
    for (const m of code.matchAll(/delete F\(\)\.(\w+)/g)) note(set, m[1], at(f, i));
  });
}
// preview links (main.js PREVIEW) set flags to jump into a scene; they don't count as the game setting them
const preview = new Set();
for (const src of Object.values(SRC)) for (const m of src.matchAll(/flags:\s*\{([^}]*)\}/g)) for (const k of m[1].matchAll(/(\w+)\s*:/g)) preview.add(k[1]);
const neverSet = [...read.keys()].filter(k => !set.has(k)).sort();
const neverRead = [...set.keys()].filter(k => !read.has(k)).sort();
if (neverSet.length) warnings.push(`flags read but never set by the game: ${neverSet.map(k => `${k} (${read.get(k)}${preview.has(k) ? ', preview only' : ''})`).join(', ')}`);
if (neverRead.length) warnings.push(`flags set but never read: ${neverRead.map(k => `${k} (${set.get(k)})`).join(', ')}`);

// ---------------------------------------------------------------- frame heights
// a talk or idle frame drawn at a different size from its character's standing frame makes the figure grow or
// shrink as it talks: the drawn height is (fy - top) / h, so it should match the base frame's to within 4%
const drawn = m => (m.fy - m.top) / m.h;
for (const [k, m] of Object.entries(SPRITES)) {
  const mm = k.match(/^(.+?)_(talk|idle)\d*$/); if (!mm || !SPRITES[mm[1]] || m.rigid) continue;
  const r = drawn(m) / drawn(SPRITES[mm[1]]);
  if (Math.abs(r - 1) > 0.04) warnings.push(`js/sprites.js: '${k}' draws at ${(r * 100).toFixed(0)}% of '${mm[1]}' (fix its "h")`);
}

// ---------------------------------------------------------------- lip-sync is for the current recording
// lipsync/<speaker>/<id>.json keeps the sha1 of the mp3 it was made from (scripts/lipsync.py)
const sha1 = f => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const LIPDIR = path.join(ROOT, 'lipsync');
if (fs.existsSync(LIPDIR)) for (const who of fs.readdirSync(LIPDIR)) {
  const dir = path.join(LIPDIR, who); if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const id = f.slice(0, -5), mp3 = path.join(ROOT, 'audio/voice', id + '.mp3');
    if (!LINES[id]) { errors.push(`lipsync/${who}/${f}: no such line (retired? delete it)`); continue; }
    if (!fs.existsSync(mp3)) { errors.push(`lipsync/${who}/${f}: the line has no recording (delete it)`); continue; }
    try { if (JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).src !== sha1(mp3)) errors.push(`lipsync/${who}/${f}: made from an older recording (run scripts/lipsync.py --speaker ${who})`); }
    catch (e) { errors.push(`lipsync/${who}/${f}: unreadable`); }
  }
}

// ---------------------------------------------------------------- report
if (!quiet) for (const w of warnings) console.log('warning: ' + w);
for (const e of errors) console.log('ERROR: ' + e);
console.log(`${FILES.length} scripts, ${Object.keys(LINES).length} lines, ${set.size} flags: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
