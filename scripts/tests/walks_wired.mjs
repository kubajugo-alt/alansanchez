// Which walk cycle each character really plays in the game (approved candidates applied) and whether it has step
// lengths (walkLen):  node scripts/tests/walks_wired.mjs   (server on :8098; edit the URL for the live site)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
await p.goto('http://localhost:8098/'); await p.waitForSelector('#title.ready', { timeout: 120000 });
console.log(await p.evaluate(() => ['alan', 'ines', 'vasco', 'lacerda', 'celeste', 'ze', 'cop_visit', 'guitar_visit'].map(ch => {
  const F = S.CHARS[ch].frames; return `${ch}: ${F.walk.join(',').slice(0, 70)} | len ${F.walkLen ? 'yes' : 'none'}`; }).join('\n')));
await b.close();
