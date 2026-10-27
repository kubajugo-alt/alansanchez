// A screenshot of the game at a ?scene= preview (or the title), with page errors listed.
// usage: node shot.mjs <baseUrl> <scene|title> <out.png> [ms to wait]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [base, scene, out, ms] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
await page.addInitScript(() => { try { localStorage.setItem('shortest-night-content', 'full'); } catch (e) {} });
await page.goto(base + (scene && scene !== 'title' ? '?scene=' + scene : ''), { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 60000 });
if (scene && scene !== 'title') await page.evaluate(() => { Game.begin(true); });
await page.waitForTimeout(+(ms || 4000));
await page.screenshot({ path: out });
console.log(errs.join('\n') || 'no errors');
await browser.close();
