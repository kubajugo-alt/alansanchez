// What moves in a room: its painting with the alive layer, plus where it changed over a second (red), for checking that
// the movement sits on the right things.   node alive_shot.mjs <baseUrl> <room> [bgVariant] [ch] <out.png>
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [base, room, variant, chs, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && /alive/.test(m.text())) errs.push(m.text()); });
await p.goto(base + '?rs=1', { waitUntil: 'load' });
await p.waitForSelector('#title.ready', { timeout: 60000 });
await p.evaluate(() => { Game.begin(true); });
await p.waitForFunction(() => Game.room, null, { timeout: 30000 });
await p.evaluate(async ([room, variant, ch]) => {
  Engine.busy++; Game.flags.ch = +ch || 3; if (variant && variant !== '-') Game.flags['bg_' + room] = variant;
  await Game.goRoom(room, null, { instant: true, noEnter: true });
  Engine.player.visible = false; Engine.npcs.length = 0;
  document.querySelectorAll('#tip,#narration,#speech,#cutcard,#mini').forEach(e => e.style.display = 'none');
  document.getElementById('cutcard').classList.remove('on');
}, [room, variant, chs]);
await p.waitForTimeout(1500);
const grab = () => p.evaluate(() => document.getElementById('scene').toDataURL('image/png'));
const a = await grab(); await p.waitForTimeout(700); const c = await grab();
await p.evaluate(([a, c, out]) => new Promise(res => {
  const A = new Image(), C = new Image(); let n = 0;
  const go = () => { if (++n < 2) return;
    const w = 1280, h = 720, cv = document.createElement('canvas'); cv.width = w; cv.height = h * 2; const x = cv.getContext('2d');
    x.drawImage(A, 0, 0, w, h);
    const t = document.createElement('canvas'); t.width = w; t.height = h; const tx = t.getContext('2d');
    tx.drawImage(A, 0, 0, w, h); const da = tx.getImageData(0, 0, w, h); tx.drawImage(C, 0, 0, w, h); const dc = tx.getImageData(0, 0, w, h);
    const o = tx.createImageData(w, h);
    for (let i = 0; i < da.data.length; i += 4) { const d = Math.abs(da.data[i] - dc.data[i]) + Math.abs(da.data[i + 1] - dc.data[i + 1]) + Math.abs(da.data[i + 2] - dc.data[i + 2]);
      const gr = (da.data[i] + da.data[i + 1] + da.data[i + 2]) / 9; o.data[i] = d > 6 ? 255 : gr; o.data[i + 1] = d > 6 ? 40 : gr; o.data[i + 2] = d > 6 ? 40 : gr; o.data[i + 3] = 255; }
    tx.putImageData(o, 0, 0); x.drawImage(t, 0, h); window.__out = cv.toDataURL('image/jpeg', 0.8); res(); };
  A.onload = go; C.onload = go; A.src = a; C.src = c;
}), [a, c, out]);
const data = await p.evaluate(() => window.__out);
(await import('fs')).writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
console.log(out, errs.join(' | '));
await b.close();
