// Checks the sequel's story against its data: every line id the code says exists in js/lines.js (and the reverse:
// lines nothing says), every speaker has a name, every room's painting, every still and every frame a character
// uses exists on disk.   node sequel/scripts/validate.mjs [--list]
// Also, from Game I's scripts/validate.mjs: code swallowed by a trailing // comment (error); every voiced line has its
// mp3 (error; the lines set aside in audio/voice_stale/ until re-recorded, HANDOFF entry 104, and speakers not cast yet
// are warnings); lip-sync cues made from the current recording, and cues for every voiced line of a speaker with face
// sets (warnings: the game still plays, the mouth is wrong or still); flags read but never set, set but never read
// (warnings); a talk or idle frame drawn at a different size from its standing frame (warning). It changes nothing.
// --list prints every id behind a counted warning (default: a few examples each).
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const SEQ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['js/lines.js', 'js/sprites_game1.js', 'js/sprites_placeholders.js', 'js/sprites_canva.js', 'js/sprites_ludo.js']) vm.runInContext(fs.readFileSync(path.join(SEQ, f), 'utf8'), ctx);
const { LINES, SPEAKERS, SPRITES } = ctx.window;
const story = fs.readdirSync(path.join(SEQ, 'js/story')).map(f => fs.readFileSync(path.join(SEQ, 'js/story', f), 'utf8')).join('\n')
  + fs.readFileSync(path.join(SEQ, 'js/engine/input.js'), 'utf8');
let errors = 0, warns = 0;
const err = m => { errors++; console.log('ERROR ' + m); }, warn = m => { warns++; console.log('warn  ' + m); };

// line ids: quoted words that look like ids and aren't frames, rooms, items or flags
const PREFIX = Object.keys(SPEAKERS).concat(['gc']).join('|');
const used = new Set();
for (const m of story.matchAll(new RegExp(`'((?:${PREFIX})_[a-z0-9_]+)'`, 'g'))) used.add(m[1]);
// ids built at run time: 'alan_look_steps_' + n and the like
for (const m of story.matchAll(/'([a-z]+_[a-z0-9_]*_)' \+/g)) for (const k of Object.keys(LINES)) if (k.startsWith(m[1])) used.add(k);
for (const who of ['alan', 'vasco']) for (const k of Object.keys(LINES)) if (new RegExp(`^${who}_(fail_\\d\\d|fail_look|fail_talk|fail_take|def_item|npc_busy)$`).test(k)) used.add(k);
used.add('narr_death'); // (the death modal's text: LINES.narr_death)
const NOT_LINES = new Set(Object.keys(SPRITES).concat(['baute_office', 'rafa_bar', 'rafa_studio', 'elena_car', 'carmen_flat', 'carmen_field', 'baute_dig', 'gc_photo', 'elena_notebook', 'elena_charts']));
for (const id of used) if (!LINES[id] && !NOT_LINES.has(id) && !/_$/.test(id)) err('line used but not written: ' + id);
for (const id of Object.keys(LINES)) if (!used.has(id)) warn('line never used: ' + id);
for (const [id, [who]] of Object.entries(LINES)) if (!SPEAKERS[who]) err(`line ${id}: speaker '${who}' has no name in SPEAKERS`);

// art: rooms' paintings, stills, frames
for (const m of story.matchAll(/bg: '([a-z0-9_]+)'/g)) if (!fs.existsSync(path.join(SEQ, 'art/bg', m[1] + '.jpg'))) err('room painting missing: art/bg/' + m[1] + '.jpg');
for (const m of story.matchAll(/'(still_[a-z0-9_]+)'/g)) if (!fs.existsSync(path.join(SEQ, 'art/stills', m[1] + '.jpg'))) err('still missing: art/stills/' + m[1] + '.jpg');
for (const k of Object.keys(SPRITES)) if (!fs.existsSync(path.join(SEQ, 'art/sprites', k + '.webp'))) err('frame missing: art/sprites/' + k + '.webp');
for (const m of story.matchAll(/'([a-z]+_ph_[a-z0-9]+|alan_[a-z0-9_]+|vasco_[a-z0-9_]+)'/g)) if (/_ph_|^(alan|vasco)_(side|idle|talk|walk|w24|front|back|reach|read|pickup|write|phone|fluster|flirt|wink|drink|yawn|stretch|climb|pull|asleep|kneel|trowel|coffee|worried|stern|tender|laugh|find|give|crouch|sit|hand|deflate)/.test(m[1]) && !/_$/.test(m[1]) && !SPRITES[m[1]] && !LINES[m[1]]) warn('frame named but not in sprites: ' + m[1]);

// ---------------------------------------------------------------- (Game I's checks, adapted)
const LIST = process.argv.includes('--list');
const some = (ids, n = 6) => LIST || ids.length <= n ? ids.join(', ') : ids.slice(0, n).join(', ') + ` ... (${ids.length - n} more; --list for all)`;
const rel = f => path.relative(SEQ, f);
// every hand-written script (generated data aside: they name every line and frame)
const GENERATED = new Set(['js/lines.js', 'js/sprites_game1.js', 'js/sprites_placeholders.js', 'js/sprites_canva.js', 'js/sprites_ludo.js',
  'js/lipsync.js', 'js/faces.js', 'js/story/extras.js', 'js/story/sea_clips.js']);
const walkJs = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walkJs(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []);
const SRC = Object.fromEntries(walkJs(path.join(SEQ, 'js')).filter(f => !GENERATED.has(rel(f))).map(f => [f, fs.readFileSync(f, 'utf8')]));
const at = (f, i) => `${rel(f)}:${i + 1}`;

// ---------------------------------------------------------------- code hidden in a trailing comment
// `x(); // note   y();` runs only x(): a statement after the comment marker is dead
const CODE_IN_COMMENT = /(?:^|[\s;{}()])(?:await [\w.]+\(|F\(\)\.\w+\s*=(?!=)|when:\s*\(\)\s*=>|(?:say|says|joke)\('\w+')/;
const inString = code => { let q = null; for (let i = 0; i < code.length; i++) { const c = code[i]; if (q) { if (c === '\\') i++; else if (c === q) q = null; } else if (c === "'" || c === '"' || c === '`') q = c; } return !!q; };
for (const [f, src] of Object.entries(SRC)) {
  src.split('\n').forEach((line, i) => {
    let rest = null; // code, then a comment on the same line (the first // that isn't inside a string)
    for (const x of line.matchAll(/\s\/\/(?!\/)/g)) { const code = line.slice(0, x.index); if (code.trim() && !inString(code)) { rest = line.slice(x.index + 3); break; } }
    if (rest != null && CODE_IN_COMMENT.test(rest.trim())) err(`${at(f, i)}: code after a // comment never runs: ${rest.trim().slice(0, 90)}`);
  });
}

// ---------------------------------------------------------------- every voiced line has its recording
// A speaker cast in scripts/cast.json (the narrator is: Eleanor, Game I's) is voiced, so each of their lines needs
// audio/voice/<id>.mp3, else it plays as a caption only. The 48 lines whose text changed on 2026-10-30 had their old
// recordings moved to audio/voice_stale/ (HANDOFF entry 104) until the user has read them and they are re-recorded with
// the same voices: those are a warning, not an error. The game plays what audio/voice/manifest.json lists.
const CAST = JSON.parse(fs.readFileSync(path.join(SEQ, 'scripts/cast.json'), 'utf8'));
const mp3s = d => fs.existsSync(path.join(SEQ, d)) ? new Set(fs.readdirSync(path.join(SEQ, d)).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4))) : new Set();
const VOICE = mp3s('audio/voice'), STALE = mp3s('audio/voice_stale'), VSRC = mp3s('audio/voice_src');
const cast = who => !!(CAST.voices[who] && CAST.voices[who].voice_id);
const setAside = [], uncast = {}, missing = [];
for (const [id, [who]] of Object.entries(LINES)) {
  if (VOICE.has(id)) continue;
  if (STALE.has(id)) setAside.push(id);
  else if (!cast(who)) (uncast[who] = uncast[who] || []).push(id);
  else missing.push(id);
}
for (const id of missing) err(`js/lines.js: '${id}' (${LINES[id][0]}) has no audio/voice/${id}.mp3`);
if (setAside.length) warn(`${setAside.length} lines set aside, re-record (their old takes are in audio/voice_stale/, HANDOFF entry 104; captions only until then): ${some(setAside, 48)}`);
for (const [who, ids] of Object.entries(uncast)) warn(`${ids.length} lines of '${who}' have no recording: not cast yet in scripts/cast.json (${some(ids)})`);
const orphan = [...VOICE].filter(id => !LINES[id]);
if (orphan.length) warn(`${orphan.length} recordings in audio/voice/ have no line in js/lines.js: ${some(orphan)}`);
const backAgain = [...STALE].filter(id => VOICE.has(id));
if (backAgain.length) warn(`${backAgain.length} lines are re-recorded but their old take is still in audio/voice_stale/ (delete it): ${some(backAgain)}`);
let MANIFEST = null; try { const j = JSON.parse(fs.readFileSync(path.join(SEQ, 'audio/voice/manifest.json'), 'utf8')); MANIFEST = new Set(Array.isArray(j) ? j : Object.keys(j)); } catch (e) { /* none */ }
if (!MANIFEST) warn('audio/voice/manifest.json missing or unreadable: no line plays its recording (node scripts/build-manifest.mjs)');
else {
  const notListed = [...VOICE].filter(id => !MANIFEST.has(id)), gone = [...MANIFEST].filter(id => !VOICE.has(id));
  if (notListed.length) warn(`${notListed.length} recordings are not in audio/voice/manifest.json, so they play as captions (node scripts/build-manifest.mjs): ${some(notListed)}`);
  if (gone.length) warn(`audio/voice/manifest.json lists ${gone.length} recordings that aren't on disk (node scripts/build-manifest.mjs): ${some(gone)}`);
}

// ---------------------------------------------------------------- lip-sync is for the current recording
// lipsync/<who>/<id>.json keeps the sha1 of the mp3 it was made from (scripts/lipsync.py, from audio/voice/<id>.mp3:
// for Inês and the phone lines that is the phone-treated copy; a cue made from the untreated take in
// audio/voice_src/ counts as current too). Cues only show on a speaker with face sets (js/faces.js, approved), so
// for the others they are counted, not warned about. All of it is a warning: the line still plays, only the mouth is
// wrong (stale) or shut (none); the fix is free and local: RHUBARB=<binary> python3 scripts/lipsync.py --speaker <who>.
vm.runInContext(fs.readFileSync(path.join(SEQ, 'js/faces.js'), 'utf8'), ctx);
const FACES = ctx.window.FACES || {};
// a face set's frame belongs to a speaker: alan_side, alanv_side_k (vest), vascor_side_k, baute2_k, carmen_r...
const ownerOf = k => { let p = k.replace(/^talk_/, '').split('_')[0]; if (SPEAKERS[p]) return p; p = p.replace(/\d+$/, ''); if (SPEAKERS[p]) return p; p = p.slice(0, -1); return SPEAKERS[p] ? p : null; };
const FACED = new Set(Object.entries(FACES).filter(([, v]) => v.ok && v.mouths && v.mouths.length).map(([k]) => ownerOf(k)).filter(Boolean));
const sha1 = f => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const LIPDIR = path.join(SEQ, 'lipsync'), cued = new Set();
const lip = { stale: {}, staleBare: {}, aside: [], gone: [], wrongDir: [] };
const push = (o, who, id) => (o[who] = o[who] || []).push(id);
if (fs.existsSync(LIPDIR)) for (const who of fs.readdirSync(LIPDIR)) {
  const dir = path.join(LIPDIR, who); if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const id = f.slice(0, -5);
    let cue; try { cue = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { err(`lipsync/${who}/${f}: unreadable`); continue; }
    if (!LINES[id]) { lip.gone.push(`${who}/${id}`); continue; }
    if (LINES[id][0] !== who) { lip.wrongDir.push(`${who}/${id} (spoken by ${LINES[id][0]})`); continue; }
    if (!VOICE.has(id)) { lip.aside.push(id); continue; } // (its recording set aside: redone with the new take)
    const made = [path.join(SEQ, 'audio/voice', id + '.mp3')].concat(VSRC.has(id) ? [path.join(SEQ, 'audio/voice_src', id + '.mp3')] : []);
    if (made.some(m => sha1(m) === cue.src)) cued.add(id);
    else push(FACED.has(who) ? lip.stale : lip.staleBare, who, id);
  }
}
const perWho = o => Object.entries(o).sort((a, b) => b[1].length - a[1].length).map(([w, ids]) => `${w} ${ids.length}`).join(', ');
const allOf = o => Object.values(o).flat();
const nStale = allOf(lip.stale).length;
if (nStale) warn(`${nStale} lip-sync cues were made from an older recording (the mouth follows the old take; scripts/lipsync.py --speaker <who>): ${perWho(lip.stale)}. e.g. ${some(allOf(lip.stale))}`);
const noCue = {}, noCueBare = {};
for (const [id, [who]] of Object.entries(LINES)) if (VOICE.has(id) && !cued.has(id) && !allOf(lip.stale).includes(id) && !allOf(lip.staleBare).includes(id)) push(FACED.has(who) ? noCue : noCueBare, who, id);
const nNoCue = allOf(noCue).length;
if (nNoCue) warn(`${nNoCue} voiced lines of speakers with face sets have no lip-sync cues (the mouth stays shut; scripts/lipsync.py --speaker <who>): ${perWho(noCue)}. e.g. ${some(allOf(noCue))}`);
if (lip.gone.length) warn(`${lip.gone.length} lip-sync files are for lines no longer in js/lines.js (left out of js/lipsync.js; delete them): ${some(lip.gone)}`);
if (lip.wrongDir.length) warn(`${lip.wrongDir.length} lip-sync files sit under the wrong speaker (left out of js/lipsync.js): ${some(lip.wrongDir)}`);
if (lip.aside.length) warn(`${lip.aside.length} lip-sync files are for lines set aside (no recording yet; redo after re-recording): ${some(lip.aside)}`);
// js/lipsync.js is the bundle the game reads: a cue file changed or added since it was built isn't played
vm.runInContext(fs.readFileSync(path.join(SEQ, 'js/lipsync.js'), 'utf8'), ctx);
const BUNDLE = ctx.window.LIPSYNC || {}, unbundled = [];
if (fs.existsSync(LIPDIR)) for (const who of fs.readdirSync(LIPDIR)) {
  const dir = path.join(LIPDIR, who); if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const id = f.slice(0, -5); if (!LINES[id] || LINES[id][0] !== who) continue;
    try { const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), b = BUNDLE[who] && BUNDLE[who][id]; if (!b || JSON.stringify([d.d, d.c]) !== JSON.stringify(b)) unbundled.push(`${who}/${id}`); } catch (e) { /* reported above */ }
  }
}
if (unbundled.length) warn(`${unbundled.length} lip-sync files differ from js/lipsync.js (rebuild it: scripts/lipsync.py): ${some(unbundled)}`);
console.log(`note  lip-sync: ${cued.size} lines current; speakers with face sets: ${[...FACED].sort().join(', ')}. Speakers without face art (cues not drawn): ${allOf(lip.staleBare).length} stale (${perWho(lip.staleBare) || 'none'}), ${allOf(noCueBare).length} voiced lines with none (${perWho(noCueBare) || 'none'}).`);

// ---------------------------------------------------------------- flags
// set: F().x = / += / ++, Object.assign(F(), { x }), delete F().x; read: every other F().x. G.flags.x, E.state.flags.x
// and f.x in a file that names F() (or G.flags) as f count the same. Names given to S.once / S.chat, the phone's
// S.CALLS and a notebook page's done: are set (and read) by the helper that takes them.
const fset = new Map(), fread = new Map();
const note = (map, k, where) => { if (!map.has(k)) map.set(k, where); };
const dynSet = []; // [name prefix, where]
for (const [f, src] of Object.entries(SRC)) {
  if (/js\/(review|walklab)\.js$/.test(f)) continue; // tools, not the game (their f is something else)
  const hasF = /\b(?:const|let)\s+f\s*=\s*(?:F\(\)|G\.flags|S\.F\(\))/.test(src);
  const flagRef = new RegExp(`(?:F\\(\\)|G\\.flags|E\\.state\\.flags${hasF ? '|(?<![\\w.])f' : ''})\\.(\\w+)(\\s*(?:[+\\-*|&]?=(?!=)|\\+\\+|--))?`, 'g');
  src.split('\n').forEach((line, i) => {
    const code = line.replace(/(^|[^:'"`\\])\/\/.*$/, '$1');
    for (const m of code.matchAll(flagRef)) note(m[2] ? fset : fread, m[1], at(f, i));
    for (const m of code.matchAll(/(?:\+\+|--)(?:F\(\)|G\.flags|\bf)\.(\w+)/g)) note(fset, m[1], at(f, i));
    for (const m of code.matchAll(/Object\.assign\((?:F\(\)|G\.flags|\bf),\s*\{([^}]*)\}/g)) for (const k of m[1].matchAll(/(\w+)\s*:/g)) note(fset, k[1], at(f, i));
    for (const m of code.matchAll(/delete (?:F\(\)|G\.flags|\bf)\.(\w+)/g)) note(fset, m[1], at(f, i));
    for (const m of code.matchAll(/S\.(?:once|chat)\(\s*'(\w+)'/g)) { note(fset, m[1], at(f, i)); note(fread, m[1], at(f, i)); }
    for (const m of code.matchAll(/\bdone:\s*'(\w+)'/g)) { note(fset, m[1], at(f, i)); note(fread, m[1], at(f, i)); } // (puzzles.js reads F()[p.done])
    for (const m of code.matchAll(/^\s*\[\s*'(called_\w+)'/g)) { note(fset, m[1], at(f, i)); note(fread, m[1], at(f, i)); } // (S.callDue reads F()[c[0]])
    // a name built at run time: f['faxed_' + what] = ..., or f[k] = with const k = 'v_' + side a few lines up
    for (const m of code.matchAll(/\b(?:f|F\(\))\[\s*'(\w+)'\s*\+[^\]]*\]\s*(?:[+\-*|&]?=(?!=)|\+\+|--)/g)) dynSet.push([m[1], at(f, i)]);
    for (const m of code.matchAll(/\b(?:f|F\(\))\[(\w+)\]\s*(?:[+\-*|&]?=(?!=)|\+\+|--)/g)) {
      const def = src.split('\n').slice(Math.max(0, i - 12), i + 1).reverse().find(l => new RegExp(`\\b${m[1]}\\s*=\\s*'\\w+'\\s*\\+`).test(l));
      if (def) dynSet.push([def.match(new RegExp(`\\b${m[1]}\\s*=\\s*'(\\w+)'`))[1], at(f, i)]);
    }
  });
}
for (const [pre, where] of dynSet) for (const k of fread.keys()) if (k.startsWith(pre)) note(fset, k, where);
// preview links (main.js PREVIEW) set flags to jump into a scene; they don't count as the game setting them
const preview = new Set();
for (const src of Object.values(SRC)) for (const m of src.matchAll(/flags:\s*\{([^}]*)\}/g)) for (const k of m[1].matchAll(/(\w+)\s*:/g)) preview.add(k[1]);
const neverSet = [...fread.keys()].filter(k => !fset.has(k)).sort();
const neverRead = [...fset.keys()].filter(k => !fread.has(k)).sort();
if (neverSet.length) warn(`${neverSet.length} flags read but never set by the game: ${neverSet.map(k => `${k} (${fread.get(k)}${preview.has(k) ? ', preview only' : ''})`).join(', ')}`);
if (neverRead.length) warn(`${neverRead.length} flags set but never read: ${neverRead.map(k => `${k} (${fset.get(k)})`).join(', ')}`);

// ---------------------------------------------------------------- frame heights
// a talk or idle frame drawn at a different size from its character's standing frame makes the figure grow or shrink
// as it talks: the drawn height is (fy - top) / h (actor.js place: scale = height / h, feet at fy), so it should match
// the standing frame's to within 4%. Standing frames: Game I's (alan_talk -> alan_side, vasco_talk2 -> vasco), the
// placeholders' (carmen_ph_talk -> carmen_ph_idle), the Ludo talk loops (talk_carmen_07 -> carmen_r, the Canva
// sprite; alanv_talk_a_12 -> alanv_side_k). A Ludo loop is reported once, by its run.
const drawn = m => (m.fy - m.top) / m.h;
const STAND = { baute: 'baute_r', chano: 'chano_r' }; // (core.js STATIC)
function standOf(k) {
  let m;
  if ((m = k.match(/^talk_([a-z]+)_\d+$/))) { const w = m[1]; return [STAND[w], w + '_r', w + '_c'].find(x => x && SPRITES[x]); }
  if ((m = k.match(/^([a-z]+)_talk_[a-z]_\d+$/))) return [m[1] + '_side_k', m[1] + 'r_side_k', m[1]].find(x => SPRITES[x]); // (vasco_talk_a: vascor_side_k)
  if ((m = k.match(/^([a-z_]+_ph)_talk$/))) return SPRITES[m[1] + '_idle'] ? m[1] + '_idle' : null;
  if ((m = k.match(/^(.+?)_(talk|idle)\d*$/))) return [m[1], m[1] + '_side'].find(x => SPRITES[x] && x !== k);
  return null;
}
const sizeOff = new Map(); // run (or frame) -> [worst ratio, frame, base, count]
let sized = 0;
for (const [k, m] of Object.entries(SPRITES)) {
  const base = standOf(k); if (!base || m.rigid) continue;
  sized++;
  const r = drawn(m) / drawn(SPRITES[base]); if (Math.abs(r - 1) <= 0.04) continue;
  const run = k.replace(/_\d+$/, '').match(/^(talk_[a-z]+|[a-z]+_talk_[a-z])$/) ? k.replace(/_\d+$/, '') : k;
  const o = sizeOff.get(run); if (!o || Math.abs(r - 1) > Math.abs(o[0] - 1)) sizeOff.set(run, [r, k, base, (o ? o[3] : 0) + 1]); else o[3]++;
}
console.log(`note  frame sizes: ${sized} talk and idle frames checked against their standing frames, ${sizeOff.size} off by more than 4%`);
for (const [run, [r, k, base, n]] of sizeOff) warn(`'${run === k ? k : run + '_*'}' draws at ${(r * 100).toFixed(0)}% of its standing frame '${base}'${n > 1 ? ` (${n} frames; worst ${k})` : ''} (fix its "h")`);

console.log(`\n${Object.keys(LINES).length} lines, ${used.size} ids referenced; ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
