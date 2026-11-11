// node scripts/tests/figcache.mjs <url> [scene] [rooms,comma,separated] [device pixel ratio]; WARP=1 forces the mesh warp (the GPU path)
// the figure cache draws what the uncached path draws: the same instant drawn both ways, compared pixel by pixel
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8098/', scene = process.argv[3] || 'shopjobs', rooms = (process.argv[4] || 'shop,tavern,street,police,cistern,boat').split(','), dpr = +(process.argv[5] || 1);
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: dpr }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.addInitScript(o => { if (o.warp) window.WARP = true; }, { warp: !!process.env.WARP });
await p.goto(base + '?scene=' + scene, { waitUntil: 'load' }); await p.waitForSelector('#title.ready', { timeout: 120000 });
await p.evaluate(() => { Game.begin(true); }); await p.waitForTimeout(5000);
if (process.env.SUNBURN) await p.evaluate(k => { window.Engine.sunburn = () => k; }, +process.env.SUNBURN); // (Game II: Alan's skin recoloured, js/story/tue.js skinTint)
let bad = 0;
const shot = async (label, again) => {
  const r = await p.evaluate(async () => {
    const E = window.Engine, c = E.canvas, raf = () => new Promise(r => requestAnimationFrame(() => r()));
    const grab = async (on, n) => { window.FIGCACHE = on; window.OCCCACHE = on; window.ADVANCE = n; for (let i = 0; i < n + 2; i++) await raf(); return c.getContext('2d').getImageData(0, 0, c.width, c.height).data; };
    window.STEP_DT = 1e-9; window.HOLD = true; await raf();
    const A = await grab(false, 1), B = await grab(true, 3), A2 = await grab(false, 1);
    const diff = (x, y) => { let n = 0, mx = 0; for (let i = 0; i < x.length; i++) { const d = Math.abs(x[i] - y[i]); if (d > mx) mx = d; if (d > 2) n++; } return [n, mx]; };
    const out = { size: c.width + 'x' + c.height, figures: E.npcs.filter(a => a.visible).length + (E.player.visible ? 1 : 0), cached: E.npcs.concat(E.player).filter(a => a.visible && a.fig && a.fig.sig).length, mouths: E.npcs.concat(E.player).filter(a => a.lip).length, cut: (E.room.occluders || []).length, warp: window.WARP !== false && Warp.ok, onVsOff: diff(A, B), offVsOff: diff(A, A2) };
    window.HOLD = false; window.STEP_DT = 0; window.FIGCACHE = true; window.OCCCACHE = true;
    return out;
  });
  // (a few edge pixels may differ by a few levels: the browser scales into a canvas of another size, and the GPU samples a
  // texture of another size, a hair differently; anything a player could see is far above these limits)
  // (something the story runs on a timer changed between the shots, Inês at her jobs: the two uncached shots differ, so
  // this one says nothing; once more)
  if (r.offVsOff[0] > 400 && !again) { await p.waitForTimeout(700); return shot(label, true); }
  const ok = r.cached > 0 && r.onVsOff[0] <= 400 && r.onVsOff[1] <= 10; if (!ok) bad++;
  console.log((ok ? 'PASS ' : 'FAIL ') + label + ' ' + JSON.stringify(r));
};
for (const id of rooms) {
  await p.evaluate(id => Game.goRoom(id), id).catch(e => console.log('goRoom', id, String(e).slice(0, 80))); await p.waitForTimeout(2500);
  await shot(id);
  // someone speaking (mouth and gesture frames change under the cache)
  const who = await p.evaluate(() => { const E = window.Engine, ids = E.npcs.filter(a => a.visible).map(a => a.id).concat('alan'); const k = Object.keys(LINES).find(k => ids.includes(LINES[k][0])); if (k) Game.say(k); return k; });
  if (who) { await p.waitForTimeout(900); await shot(id + ' speaking ' + who); await p.evaluate(() => Game.skipLine()); await p.waitForTimeout(400); }
  // Alan walking (steps and the stop: cache off and on again)
  await p.evaluate(() => { const E = window.Engine; if (E.room.walk && E.player.visible) { const w = E.room.walk, cx = w.reduce((s, q) => s + q[0], 0) / w.length, cy = w.reduce((s, q) => s + q[1], 0) / w.length; E.player.walkTo(...E.clampToPoly(cx, cy, w)); } });
  await p.waitForTimeout(500); await shot(id + ' walking'); await p.waitForTimeout(2500); await shot(id + ' after the walk');
}
console.log(bad ? bad + ' FAILED' : 'all passed', 'errors:', errs.length, errs.slice(0, 3).join(' ; '));
await b.close();
