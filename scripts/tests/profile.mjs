// CPU profile of one scene for 5 s (effects off): the functions with the most self time.
//   node scripts/tests/profile.mjs laundry
// CPU profile of one scene for 5 s (effects off): the functions with the most self time
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } }); const p = await ctx.newPage();
await p.addInitScript(() => { window.WARP = false; });
await p.goto('http://localhost:8098/?scene=' + process.argv[2]); await p.waitForSelector('#title.ready', { timeout: 120000 });
p.evaluate(() => Game.begin(true)).catch(() => {}); await p.waitForTimeout(6000);
const cdp = await ctx.newCDPSession(p); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
await cdp.send('Profiler.start'); await p.waitForTimeout(5000); const { profile } = await cdp.send('Profiler.stop');
const self = {}, dt = profile.timeDeltas, byId = Object.fromEntries(profile.nodes.map(n => [n.id, n]));
profile.samples.forEach((id, i) => { const n = byId[id], f = n.callFrame, k = `${f.functionName || '(anon)'} ${f.url.split('/').pop().split('?')[0]}:${f.lineNumber + 1}`; self[k] = (self[k] || 0) + (dt[i] || 0); });
const tot = Object.values(self).reduce((a, b) => a + b, 0);
for (const [k, v] of Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 14)) console.log((v / tot * 100).toFixed(1).padStart(5) + '%', k);
await b.close();
