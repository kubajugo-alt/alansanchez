// The dialogue review's flags as data for the approve/reject page (HANDOFF entry 150): every flagged line from
// docs/review/dialogue/review_*.md with its part, scene, severity, the line as it is in js/lines.js, the reviewer's
// rewrite and reason, the scene's ratings. -> art/review/dialogue_flags/flags.json
//   node sequel/scripts/dialogue_flags.mjs
import fs from 'fs'; import path from 'path'; import vm from 'vm';
const SEQ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(SEQ, 'js/lines.js'), 'utf8'), ctx);
const LINES = ctx.window.LINES;
const voiced = new Set(fs.readdirSync(path.join(SEQ, 'audio/voice')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const D = path.join(SEQ, 'docs/review/dialogue');
const flags = [], parts = [];
for (const f of fs.readdirSync(D).filter(f => /^review_.*\.md$/.test(f)).sort()) {
  const t = fs.readFileSync(path.join(D, f), 'utf8').split('\n');
  const part = (t.find(l => l.startsWith('# Dialogue review: ')) || '').replace('# Dialogue review: ', '');
  const ov = (t.find(l => l.startsWith('Overall:')) || '');
  parts.push({ part, file: f, overall: ov.replace(/^Overall:\s*/, '') });
  let scene = null, rating = null;
  for (const l of t) {
    const h = /^## (.+)$/.exec(l); if (h) { scene = h[1]; rating = null; if (/^Summary/.test(scene)) scene = null; continue; }
    const r = /^Sense (\d)\/5 · Naturalism (\d)\/5\.?\s*(.*)$/.exec(l); if (r && scene) { rating = { sense: +r[1], nat: +r[2], note: r[3] }; continue; }
    const m = /^- `([a-z0-9_]+)` \(([^)]+)\) \*\*(must|should|could)\*\*:\s*(.*)$/.exec(l);
    if (!m || !scene) continue;
    let [, id, speaker, sev, rest] = m, cur = '', sug = '', why = '';
    const arrow = rest.indexOf(' → ');
    if (arrow >= 0) {
      cur = rest.slice(0, arrow).trim().replace(/^"|"$/g, '');
      const right = rest.slice(arrow + 3).trim();
      if (right.startsWith('"')) { const e = right.slice(1).search(/"[.,;:]?(\s|$)/); if (e >= 0) { sug = right.slice(1, e + 1); why = right.slice(e + 2).replace(/^[.,;:]?\s*/, ''); } else sug = right; }
      else { sug = ''; why = right; }   // (not a new text: a change of order or of when it plays)
    } else why = rest;
    flags.push({ n: flags.length + 1, part, file: f, scene, rating, id, speaker, sev, current: LINES[id] ? LINES[id][1] : cur, reviewed: cur, suggested: sug, why, recorded: voiced.has(id), exists: !!LINES[id] });
  }
}
fs.writeFileSync(path.join(SEQ, 'art/review/dialogue_flags/flags.json'), JSON.stringify({ parts, flags }, null, 1));
const c = s => flags.filter(f => f.sev === s).length;
console.log(flags.length, 'flags:', c('must'), 'must,', c('should'), 'should,', c('could'), 'could;', flags.filter(f => !f.suggested).length, 'without a new text;', flags.filter(f => !f.exists).length, 'ids not in lines.js;', flags.filter(f => f.reviewed && f.exists && f.reviewed.replace(/\W/g,'').slice(0,30) !== f.current.replace(/\W/g,'').slice(0,30)).length, 'where the quoted text differs');
