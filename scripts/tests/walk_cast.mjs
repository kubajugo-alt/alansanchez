// The walk lab's readings (slip per change of painting, head size per frame) for each character's walk in the game
// and its candidate walk:  node scripts/tests/walk_cast.mjs alan ines vasco ...   (server on :8098)
// for each character on the command line: the walk lab's slip and size readings for its current and candidate cycles
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript('window.WARP=true');
await p.goto('http://localhost:8098/?scene=walklab'); await p.waitForSelector('#title.ready', { timeout: 120000 });
p.evaluate(() => Game.begin(true)); await p.waitForTimeout(8000);
for (const ch of process.argv.slice(2)) {
  for (const cy of ['in the game now', 'candidate (review screen)']) {
    await p.evaluate(([c, y]) => { const s = document.querySelector('#wl-ch'); s.value = c; s.onchange({ target: s }); const t = document.querySelector('#wl-cy'); t.value = y; t.onchange({ target: t }); }, [ch, cy]);
    await p.waitForTimeout(2500);
    await p.evaluate(y => { const t = document.querySelector('#wl-cy'); t.value = y; t.onchange({ target: t }); }, cy);
    const r = await p.evaluate(() => ({ slip: document.querySelector('#wl-slip').textContent, cy: document.querySelector('#wl-cy').value,
      rows: [...document.querySelectorAll('#walklab tr')].slice(1).map(r => [...r.children].map(c => c.textContent)).map(r => `${r[0]}:${r[1]}`).join(' '),
      foot: [...document.querySelectorAll('#walklab div')].map(d => d.textContent).find(t => /frames\./.test(t)) }));
    console.log(ch, '|', r.cy, '|', r.slip || '(no slip: no plant data)', '|', (r.foot || '').split('.').slice(0, 2).join('.'), '|', r.rows);
  }
}
console.log('errors', errs); await b.close();
