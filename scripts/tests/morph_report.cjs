// Sorts the frame changes recorded by morph_coverage.mjs: morph data present, missing, or not morphed by design.
const fs = require('fs'), path = require('path');
global.window = {}; require(__dirname + '/../../js/sprites.js'); require(__dirname + '/../../js/morphs.js');
const S = window.SPRITES, M = window.MORPHS;
const rows = process.argv.slice(2).flatMap(f => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)));
const cats = {}, missing = {}, byChar = {};
const add = (c, ch) => { cats[c] = (cats[c] || 0) + 1; byChar[ch] = byChar[ch] || {}; byChar[ch][c] = (byChar[ch][c] || 0) + 1; };
for (const [scene, ch, a, b, same, walking, talking, pose] of rows) {
  let c;
  if (!S[a] || !S[b]) c = 'review sprite (not in sprites.js)';
  else if (S[a].rigid || S[b].rigid) c = 'combined sprite (never morphs)';
  else if (walking) c = 'walk step';
  else if (!same) c = 'facing change (never morphs)';
  else if (talking && !pose) c = 'talk swap (never morphs)';
  else if (M[a + '>' + b] && M[b + '>' + a]) c = 'pose change: MORPHS';
  else { c = 'pose change: no morph data'; const k = a + ' <> ' + b; missing[k] = missing[k] || { n: 0, ch, scenes: new Set() }; missing[k].n++; missing[k].scenes.add(scene); }
  add(c, ch);
}
console.log('frame changes recorded:', rows.length);
for (const [c, n] of Object.entries(cats).sort((x, y) => y[1] - x[1])) console.log(String(n).padStart(5), c);
console.log('\nby character (pose changes with / without morph data):');
for (const [ch, v] of Object.entries(byChar)) { const y = v['pose change: MORPHS'] || 0, n = v['pose change: no morph data'] || 0; if (y + n) console.log(' ', ch.padEnd(14), 'with', String(y).padStart(3), ' without', String(n).padStart(3)); }
console.log('\npose changes with no morph data, most frequent first:');
for (const [k, v] of Object.entries(missing).sort((x, y) => y[1].n - x[1].n).slice(0, 40)) console.log(String(v.n).padStart(4), v.ch.padEnd(12), k, ' [' + [...v.scenes].join(',') + ']');
