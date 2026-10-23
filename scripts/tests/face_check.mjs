// Lip-sync and blinking on Alan's frames as the game draws them: plays a scene at real speed (REAL clock) with the Ludo
// runs previewed as approved (LUDO=1) or not, and records each drawn frame of Alan's while he speaks or blinks: which
// frame is up, whether a mouth and eyelid patch were laid in. Prints per frame kind (painting / Ludo run) the share of
// speaking frames with a moving mouth.   node scripts/tests/face_check.mjs <scene> [seconds]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const scene = process.argv[2] || 'bench', secs = +(process.argv[3] || 60);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
if (process.env.LUDO) {
  const C = await (await fetch('http://localhost:8098/art/review/candidates.json')).json(), A = {};
  for (const c of C.candidates) if (/_lu_/.test(c.id)) A[c.id] = { decision: 'approved' };
  await page.addInitScript(a => localStorage.setItem('review-approvals', a), JSON.stringify(A));
}
await page.addInitScript(() => { localStorage.setItem('drowned-bell-tips', '{"off":true}'); window.__FC = []; });
await page.goto('http://localhost:8098/?scene=' + scene + (process.env.FACES_ALL ? '&faces=all' : ''), { waitUntil: 'load' });
await page.waitForSelector('#title.ready', { timeout: 120000 });
await page.evaluate(() => {
  const E = Engine, f0 = E.faceImage;
  E.faceImage = function (a, key, im, any) {
    const out = f0.apply(this, arguments);
    if (a === E.player) { const sp = E.speaking && E.speaking.actor === a; window.__FC.push([key, sp ? 1 : 0, out !== im ? 1 : 0, a.faceM || '', (a.faceL && a.faceL.blink) || '']); }
    return out;
  };
  Game.begin(true);
});
const clicker = setInterval(() => page.evaluate(() => { const b = document.querySelector('#dialog.open button'); if (b) b.click(); }).catch(() => {}), 400);
await page.waitForTimeout(secs * 1000);
clearInterval(clicker);
const R = await page.evaluate(() => window.__FC);
const kind = k => /_lu_/.test(k) ? 'ludo' : 'painting';
const S = {};
for (const [k, sp, laid, m, lid] of R) {
  const g = S[kind(k)] || (S[kind(k)] = { frames: 0, speaking: 0, mouth: 0, blinkFrames: 0, keys: new Set() });
  g.frames++; g.keys.add(k); if (sp) { g.speaking++; if (laid && m) g.mouth++; } if (lid && laid) g.blinkFrames++;
}
for (const [k, g] of Object.entries(S)) console.log(k, JSON.stringify({ frames: g.frames, speaking: g.speaking, mouthLaid: g.mouth, blinkLaid: g.blinkFrames, distinct: g.keys.size }));
const ludoSpeaking = [...new Set(R.filter(r => r[1] && /_lu_/.test(r[0])).map(r => r[0]))];
console.log('Ludo frames up while he speaks:', ludoSpeaking.length, ludoSpeaking.slice(0, 12).join(' '));
console.log('errors:', errs.join(' | ') || 'none');
await browser.close();
