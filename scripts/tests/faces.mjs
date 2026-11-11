// node scripts/tests/faces.mjs <url> [scene]
// The face laid into a painting (js/engine/faces.js: one canvas per figure and painting, repainted in place) is the picture
// the engine made before 2026-11-11 (a fresh canvas per mouth, eyelid and emotion; kept here as fixtures/faces_old.js
// and run beside the new one): every frame with a face set, through a run of mouths, blinks and emotions, pixel for pixel.
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/', scene = process.argv[3] || 'shopjobs';
const OLD = readFileSync(fileURLToPath(new URL('./fixtures/faces_old.js', import.meta.url)), 'utf8');
const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(base + '?scene=' + scene + '&faces=all', { waitUntil: 'load' }); await p.waitForSelector('#title.ready', { timeout: 120000 });
const r = await p.evaluate(async OLD => {
  const E = window.Engine, shim = Object.create(E);
  // the old file, with its own caches, adding its functions to the stand-in instead of the engine
  new Function('window', 'document', OLD)(new Proxy({}, { get: (_, k) => k === 'Engine' ? shim : k === 'addEventListener' ? () => {} : window[k] }), document);
  const oldFace = shim.faceImage, newFace = E.faceImage;
  window.HOLD = true; await new Promise(r => requestAnimationFrame(r));
  const keys = Object.keys(window.FACES).filter(k => !k.includes('__') && E.SPRITES[k]);
  const px = im => { const c = document.createElement('canvas'); c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
  const MOUTHS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'C_40', 'D_70', null], LIDS = [null, 'half', 'closed'];
  let seed = 7; const rnd = n => (seed = (seed * 1103515245 + 12345) >>> 0) % n;
  const out = { frames: 0, shots: 0, changed: 0, bad: [], skipped: 0 };
  const A1 = { ch: 'x' }, A2 = { ch: 'x' }; // one figure through every painting: its canvases are used again and again
  const lim = +(new URLSearchParams(location.search).get('n') || 0) || keys.length;
  for (const key of keys.slice(0, lim)) {
    await Game.ensure(['spr:' + key]); const im = Game.image('spr:' + key); if (!im) { out.skipped++; continue; }
    const D = window.FACES[key], who = [null].concat(Object.keys(window.FACES).filter(k => k.startsWith(key + '__')).map(k => k.slice(key.length + 2)));
    const emos = [null].concat((D.emo && D.emo.set) || []).slice(0, 4);
    const set = (a, s) => Object.assign(a, { faceAt: E.time, faceEmoAt: E.time, faceM: s.m, faceWho: s.m ? (s.w || 'x') : null, faceL: { blink: s.l, ['blink_' + (who[1] || '')]: s.l2 }, faceE: s.e });
    const states = []; for (let i = 0; i < 14; i++) states.push({ m: MOUTHS[rnd(MOUTHS.length)], l: LIDS[rnd(3)], l2: LIDS[rnd(3)], e: emos[rnd(emos.length)], w: who[rnd(who.length)] });
    // once through to ask for the patches, then wait for them
    for (const s of states) { set(A1, s); oldFace(A1, key, im, true); set(A2, s); newFace(A2, key, im, true); }
    await new Promise(r => setTimeout(r, 350));
    out.frames++;
    for (const s of states) {
      set(A1, s); const o = oldFace(A1, key, im, true); set(A2, s); const n = newFace(A2, key, im, true);
      out.shots++; if (o !== im) out.changed++;
      if ((o === im) !== (n === im)) { out.bad.push(key + ' ' + JSON.stringify(s) + ' one is the bare painting'); continue; }
      if (o === im) continue;
      const a = px(o), c = px(n); let d = a.length !== c.length ? -1 : 0; if (!d) for (let i = 0; i < a.length; i++) if (a[i] !== c[i]) d++;
      if (d) out.bad.push(key + ' ' + JSON.stringify(s) + ' ' + d + ' values differ');
    }
  }
  out.held = A2.faceCv ? A2.faceCv.size : 0;
  return out;
}, OLD);
console.log(JSON.stringify({ ...r, bad: r.bad.slice(0, 8), nbad: r.bad.length }));
console.log((r.bad.length || errs.length || !r.changed ? 'FAIL' : 'PASS') + ' faces: ' + r.frames + ' paintings, ' + r.shots + ' faces (' + r.changed + ' with a patch laid in), ' + r.bad.length + ' differ; canvases held by the figure: ' + r.held + '; errors: ' + errs.length + ' ' + errs.slice(0, 2).join(' ; '));
await b.close();
