// Frame times per scene on an emulated phone (CPU slowed by the first argument), effects on and off, and whether the
// slow-device fallback switched them off. In a container without a GPU the absolute numbers mean little (WebGL and
// canvas run in software): compare scenes and settings, and measure real devices with ?fps.
//   DPR=1 node scripts/tests/perf.mjs 4 laundry semuseum ...
// emulated phone: 390x844 at DPR 3, CPU slowed (argv[2]x); for each scene, frame intervals over 6 s with the effects
// on (warp + parallax) and off, and whether the game's own slow-device fallback switched them off
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const rate = +process.argv[2] || 4, scenes = process.argv.slice(3);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const warp of ['auto', 'off']) for (const sc of scenes) {
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: +(process.env.DPR || 1) });
  const p = await ctx.newPage(); const logs = []; p.on('console', m => logs.push(m.text()));
  if (warp === 'off') await p.addInitScript(() => { window.WARP = false; });
  await p.goto('http://localhost:8098/?scene=' + sc); await p.waitForSelector('#title.ready', { timeout: 120000 });
  p.evaluate(() => Game.begin(true)).catch(() => {}); await p.waitForTimeout(5000);
  const cdp = await ctx.newCDPSession(p); await cdp.send('Performance.enable'); await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  const r = await p.evaluate(() => new Promise(done => { const t = []; let l = performance.now(); const s = l;
    const f = n => { t.push(n - l); l = n; if (n - s < 6000) requestAnimationFrame(f); else done(t); }; requestAnimationFrame(f); }));
  const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const busy = (m1.TaskDuration - m0.TaskDuration) / (m1.Timestamp - m0.Timestamp), script = (m1.ScriptDuration - m0.ScriptDuration) / (m1.Timestamp - m0.Timestamp);
  const fell = logs.some(x => /Warp and parallax off/.test(x)), warpNow = await p.evaluate(() => window.WARP);
  r.sort((a, b) => a - b); const med = r[r.length >> 1], p95 = r[Math.floor(r.length * 0.95)];
  console.log(`${warp.padEnd(4)} ${sc.padEnd(12)} fps ${(1000 / med).toFixed(0).padStart(3)}  median ${med.toFixed(1)} ms  p95 ${p95.toFixed(1)} ms  main thread busy ${(busy * 100).toFixed(0)}% (script ${(script * 100).toFixed(0)}%)  ${fell ? 'FELL BACK to flat' : ''} warp=${warpNow}`);
  await ctx.close();
}
await b.close();
