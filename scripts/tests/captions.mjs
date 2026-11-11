// node scripts/tests/captions.mjs <url>
// The caption over a speaker (js/engine/speech.js positionSpeech, worked out from sizes measured once) sits where the old
// way put it (write, measure the page, nudge: keepInside): speakers all over the room, short and long lines, three
// window sizes and the three text sizes.
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/';
const b = await chromium.launch(); let bad = 0, n = 0, worst = 0; const errs = [];
for (const [vw, vh] of [[1280, 720], [900, 700], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } }); p.on('pageerror', e => errs.push(String(e)));
  await p.goto(base + '?scene=shopjobs', { waitUntil: 'load' }); await p.waitForSelector('#title.ready', { timeout: 120000 });
  await p.evaluate(() => { Game.begin(true); }); await p.waitForTimeout(3500);
  const r = await p.evaluate(async () => {
    const E = window.Engine, el = E.speechEl, raf = () => new Promise(r => requestAnimationFrame(r));
    window.HOLD = true; await raf();
    const rect = () => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; };
    const out = []; const a = E.player; a.visible = true; E.speaking = { id: 'x', actor: a }; el.style.display = 'block';
    el.textContent = 'Fonts first.'; await raf(); try { await document.fonts.ready; } catch (e) { /* none */ } await raf(); // (the caption's font loads on first use)
    for (const cap of [0.85, 1, 1.25]) { document.documentElement.style.setProperty('--cap', cap);
      for (const text of ['Yes.', 'A longer line, the kind that wraps onto a second row when the frame is narrow.', 'One very long line indeed: ' + 'the tide card, the ledger and the list of names, '.repeat(4)]) {
        el.textContent = text;
        for (const [x, y] of [[640, 600], [20, 600], [1260, 600], [640, 180], [5, 150], [1275, 715], [300, 420]]) {
          a.x = x; a.y = y;
          window.CAPTION_OLD = false; E.positionSpeech(true); const fresh = rect();
          await raf(); E.positionSpeech(); const again = rect(); // (the next frame: from the kept sizes)
          window.CAPTION_OLD = true; E.positionSpeech(); const old = rect(); window.CAPTION_OLD = false;
          const d = Math.max(...old.map((v, i) => Math.max(Math.abs(v - fresh[i]), Math.abs(v - again[i]))));
          out.push({ cap, x, y, len: text.length, d: +d.toFixed(2), fresh: fresh.map(Math.round), again: again.map(Math.round), old: old.map(Math.round) });
        }
      } }
    // a frame with nothing changed writes nothing
    window.CAPTION_OLD = false; E.positionSpeech(true); let writes = 0; const mo = new MutationObserver(m => { writes += m.length; }); mo.observe(el, { attributes: true });
    for (let i = 0; i < 5; i++) E.positionSpeech(); await raf(); await raf(); mo.disconnect();
    window.HOLD = false; el.style.display = 'none'; E.speaking = null;
    return { out, writes };
  });
  for (const o of r.out) { n++; worst = Math.max(worst, o.d); if (o.d > 1) { bad++; if (bad < 6) console.log('off', vw + 'x' + vh, JSON.stringify(o)); } }
  if (r.writes) { bad++; console.log('wrote', r.writes, 'times with nothing changed'); }
  await p.close();
}
console.log((bad || errs.length ? 'FAIL' : 'PASS') + ' captions: ' + n + ' places, furthest from the old place ' + worst.toFixed(2) + ' px, ' + bad + ' off by more than 1 px; errors: ' + errs.length + ' ' + errs.slice(0, 2).join(' ; '));
await b.close();
