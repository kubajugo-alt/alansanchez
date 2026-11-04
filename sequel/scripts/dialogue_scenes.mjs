// The dialogue scene by scene (HANDOFF entry 149): every story file cut into its scenes (a room, or one scripted moment,
// S.<name> = function), each with the code's own comments as stage directions and every line in the order it appears
// in the code, with speaker and text. Order in the code is play order within a scene, except where a scene branches
// (dialogue choices, "again" lines, day-dependent lines): those are marked. Lines with no recording are marked too.
//   node sequel/scripts/dialogue_scenes.mjs        -> sequel/docs/review/dialogue/scenes/<nn>_<file>.md
import fs from 'fs'; import path from 'path'; import vm from 'vm';
const SEQ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(SEQ, 'js/lines.js'), 'utf8'), ctx);
const LINES = ctx.window.LINES, SPEAKERS = ctx.window.SPEAKERS || {};
const voiced = new Set(fs.readdirSync(path.join(SEQ, 'audio/voice')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const who = id => { const s = LINES[id][0]; const n = SPEAKERS[s]; const name = Array.isArray(n) ? n[0] : n && n.name ? n.name : typeof n === 'string' ? n : null; return name || (s === 'narr' || s === 'narrator' ? 'Narrator' : s); };
// (the code's comments are kept as stage directions, less the ones about the code itself)
const TECH = /HANDOFF|env=2|\.js\b|\bjs\/|scripts\/|\bS\.[A-Za-z]|\bFX\b|\bsway\b|mask|painting under|\bG\.|\bF\(\)|\b(?:sprite|hotspot|layout|preview|frames?|pose|run|Ludo|Higgsfield|Kling|webm|mp4|png|px)\b|the user, 20\d\d|20\d\d-\d\d-\d\d/i;
const FILES = [['00', 'prologue', 'The prologue: 21 December 1995'], ['01', 'tue', 'Tuesday 18 June'], ['02', 'wed', 'Wednesday 19 June'],
  ['03', 'thu', 'Thursday 20 June'], ['04', 'fri', 'Friday 21 June'], ['05', 'sat', 'Saturday 22 June (Alan)'], ['06', 'vasco', 'Saturday 22 June (Vasco), the mountain'],
  ['07', 'sun', 'Sunday 23 June'], ['08', 'mon', 'Monday 24 June'], ['09', 'puzzles', 'The puzzles across the days'], ['10', 'core', 'Every day: the phone box, Inês, the notebook'], ['11', 'bgtalk', 'Background people'], ['12', 'docs', 'Close-ups: letters, papers, notebooks']];
const START = /^  (?:S\.([A-Za-z0-9_]+)\s*=\s*(?:async\s+)?(?:function|\()|ROOMS\.([a-z_0-9]+)(?:\.enter)?\s*=|const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s+)?(?:function|\())/;
let total = 0;
const used = new Set();
for (const [nn, file, title] of FILES) {
  const src = fs.readFileSync(path.join(SEQ, 'js/story', file + '.js'), 'utf8').split('\n');
  const scenes = []; let cur = { name: '(file head)', notes: [], items: [] }, pend = [];
  for (const line of src) {
    const m = START.exec(line);
    if (m) { scenes.push(cur); cur = { name: m[1] ? 'S.' + m[1] : m[2] ? (line.includes('.enter') ? 'room ' + m[2] + ' (arrival)' : 'room ' + m[2]) : m[3], notes: pend.slice(), items: [] }; pend = []; }
    const c = /^\s*\/\/\s?(.*)$/.exec(line);
    if (c) { if (/^  \/\//.test(line) && !/^   /.test(line)) pend.push(c[1]); else cur.items.push({ note: c[1] }); continue; }
    if (!/^\s*$/.test(line) && !/^  \/\//.test(line)) pend = [];
    const tail = /\/\/\s?(.*)$/.exec(line);
    const choice = /line:\s*'/.test(line), cond = /\?\s*'|\bch\(\)|F\(\)\.|f\.[a-z_]+\s*\?/.test(line);
    if (file === 'bgtalk' && /S\.BG = \{/.test(line)) {   // (the figures' talk: one JSON object, by figure)
      const BG = JSON.parse(line.slice(line.indexOf('{'), line.lastIndexOf('}') + 1));
      for (const [fig, rooms] of Object.entries(BG)) for (const [room, t] of Object.entries(rooms)) {
        cur.items.push({ note: `${t.name} (${fig.replace(/^x_/, '')}${room === '*' ? '' : ', ' + room}): first time, then again` });
        for (const id of [].concat(t.first, t.again)) if (LINES[id]) { cur.items.push({ id, tag: '' }); used.add(id); }
      }
      continue;
    }
    for (const mm of line.matchAll(/['"]([a-z][a-z0-9_]*)['"](\s*\+)?/g)) {
      const id = mm[1];
      if (mm[2] && /_$/.test(id)) {   // an id built in the code ('vasco_nudge_' + sign): every line of that set
        const set = Object.keys(LINES).filter(k => k.startsWith(id)).sort();
        if (set.length) { cur.items.push({ note: `one of the set ${id}* (${set.length}), chosen in the code:` }); set.forEach(k => { cur.items.push({ id: k, tag: 'set' }); used.add(k); }); }
        continue;
      }
      if (!LINES[id]) continue;
      const tag = choice && line.indexOf("line: '" + id) >= 0 ? 'choice' : cond ? 'if' : '';
      cur.items.push({ id, tag }); used.add(id);
    }
    if (tail && !c) cur.items.push({ note: tail[1], inline: true });
  }
  scenes.push(cur);
  const out = [`# ${title}`, '', `From \`js/story/${file}.js\`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.`, ''];
  let n = 0;
  for (const s of scenes) {
    const lines = s.items.filter(i => i.id); if (!lines.length) continue;
    const head = s.notes.join(' ').replace(/\s+/g, ' ');
    out.push(`## ${s.name}`, ''); if (head && !/^\(?with \?env/.test(head)) out.push('> ' + head, '');
    let lastNote = null;
    for (const i of s.items) {
      if (i.note) { if (i.note !== lastNote && i.note.length > 3 && !TECH.test(i.note)) { out.push(`  *${i.note.replace(/\*/g, '')}*`); lastNote = i.note; } continue; }
      const [, text] = LINES[i.id];
      out.push(`- **${who(i.id)}**: ${text}${i.tag ? ` *[${i.tag}]*` : ''}${voiced.has(i.id) ? '' : ' *(no recording)*'} \`${i.id}\``);
      n++;
    }
    out.push('');
  }
  fs.writeFileSync(path.join(SEQ, 'docs/review/dialogue/scenes', `${nn}_${file}.md`), out.join('\n'));
  total += n; console.log(`${nn}_${file}.md: ${scenes.filter(s => s.items.some(i => i.id)).length} scenes, ${n} lines`);
}
// the engine's refusals (js/engine/input.js, inventory.js: "that doesn't work", by the player's own voice)
{ const f = path.join(SEQ, 'docs/review/dialogue/scenes/10_core.md'); const ids = Object.keys(LINES).filter(k => /^(alan|vasco)_(fail_\w+|def_item|npc_busy)$/.test(k));
  fs.appendFileSync(f, ['## The engine\'s refusals', '', '> Said when an action or item does nothing (js/engine/input.js, inventory.js), picked at random; Alan\'s, and Vasco\'s in his chapter.', '']
    .concat(ids.map(id => `- **${who(id)}**: ${LINES[id][1]} *[set]*${voiced.has(id) ? '' : ' *(no recording)*'} \`${id}\``), ['']).join('\n'));
  ids.forEach(id => used.add(id)); total += ids.length; }
const unused = Object.keys(LINES).filter(id => !used.has(id));
console.log(total, 'line uses;', used.size, 'distinct lines;', unused.length, 'lines not found in any scene (mostly the narrator cuts)');
