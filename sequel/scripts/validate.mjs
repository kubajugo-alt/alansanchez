// Checks the sequel's story against its data: every line id the code says exists in js/lines.js (and the reverse:
// lines nothing says), every speaker has a name, every room's painting, every still and every frame a character
// uses exists on disk.   node sequel/scripts/validate.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const SEQ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['js/lines.js', 'js/sprites_game1.js', 'js/sprites_placeholders.js', 'js/sprites_canva.js']) vm.runInContext(fs.readFileSync(path.join(SEQ, f), 'utf8'), ctx);
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
const NOT_LINES = new Set(Object.keys(SPRITES).concat(['baute_office', 'rafa_bar', 'rafa_studio', 'elena_car', 'carmen_flat', 'carmen_field', 'baute_dig', 'gc_photo', 'elena_notebook', 'elena_charts', 'yeray_drunk', 'yeray_asleep', 'museum_corridor']));
for (const id of used) if (!LINES[id] && !NOT_LINES.has(id) && !/_$/.test(id)) err('line used but not written: ' + id);
for (const id of Object.keys(LINES)) if (!used.has(id)) warn('line never used: ' + id);
for (const [id, [who]] of Object.entries(LINES)) if (!SPEAKERS[who]) err(`line ${id}: speaker '${who}' has no name in SPEAKERS`);

// art: rooms' paintings, stills, frames
for (const m of story.matchAll(/bg: '([a-z0-9_]+)'/g)) if (!fs.existsSync(path.join(SEQ, 'art/bg', m[1] + '.jpg'))) err('room painting missing: art/bg/' + m[1] + '.jpg');
for (const m of story.matchAll(/'(still_[a-z0-9_]+)'/g)) if (!fs.existsSync(path.join(SEQ, 'art/stills', m[1] + '.jpg'))) err('still missing: art/stills/' + m[1] + '.jpg');
for (const k of Object.keys(SPRITES)) if (!fs.existsSync(path.join(SEQ, 'art/sprites', k + '.webp'))) err('frame missing: art/sprites/' + k + '.webp');
for (const m of story.matchAll(/'([a-z]+_ph_[a-z0-9]+|alan_[a-z0-9_]+|vasco_[a-z0-9_]+)'/g)) if (/_ph_|^(alan|vasco)_(side|idle|talk|walk|w24|front|back|reach|read|pickup|write|phone|fluster|flirt|wink|drink|yawn|stretch|climb|pull|asleep|kneel|trowel|coffee|worried|stern|tender|laugh|find|give|crouch|sit|hand|deflate)/.test(m[1]) && !/_$/.test(m[1]) && !SPRITES[m[1]] && !LINES[m[1]]) warn('frame named but not in sprites: ' + m[1]);

console.log(`\n${Object.keys(LINES).length} lines, ${used.size} ids referenced; ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
