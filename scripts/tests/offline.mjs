// Play offline, end to end (Game II's HANDOFF entry 127; the same file in both games since entry 157, Game I's 91): serves a folder, downloads the offline copy through the menu's panel
// (with a pause and a continue on the way), then stops the server and turns the browser offline and plays scenes from
// the copy: page errors, requests that failed, voices decoded, media elements playing (and their 206 ranges), videos
// drawing. Then an update: one file changed in the served folder (and its offline.json entry), Update fetches only it.
// usage: node offline.mjs <folder to serve> <out dir> [port] [scenes,comma,separated]
//   the folder is changed by the update step (one file rewritten): give it a copy (cp -al sequel /tmp/x is fine:
//   the test unlinks the file before rewriting it)
import { createRequire } from 'module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [dir, out, port = '8199', scenesArg = 'tue,wed,mist,aim,cave_low'] = process.argv.slice(2);   // (Game I: e.g. intro,shopjobs,quayfish,bath,finale)
fs.mkdirSync(out, { recursive: true });
const base = `http://localhost:${port}/`;
let server = null;
async function serve(on) {
  if (!on) { if (server) { server.kill('SIGKILL'); server = null; } await new Promise(r => setTimeout(r, 800)); return; }
  server = spawn('/opt/node22/bin/node', ['/opt/node22/lib/node_modules/http-server/bin/http-server', dir, '-p', port, '-c-1', '-s'], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) { try { if ((await fetch(base + 'offline.json')).ok) return; } catch (e) { /* not yet */ } await new Promise(r => setTimeout(r, 200)); }
  throw new Error('server did not start');
}
const log = (...a) => console.log(...a);
await serve(true);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
await context.addInitScript(() => {
  try { for (const k of ['shortest-night', 'drowned-bell']) localStorage.setItem(k + '-content', 'full'); } catch (e) { /* none */ }   // (either game)
  window.__au = { decoded: 0, decodeFail: 0, playing: [], media: [] };
  const dec = AudioContext.prototype.decodeAudioData;
  AudioContext.prototype.decodeAudioData = function (b, ok, bad) {
    const p = dec.call(this, b, x => { window.__au.decoded++; ok && ok(x); }, e => { window.__au.decodeFail++; bad && bad(e); });
    if (p && p.then) p.catch(() => {});
    return p;
  };
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (!window.__au.media.includes(this)) { window.__au.media.push(this); this.addEventListener('playing', () => window.__au.playing.push((this.currentSrc || this.src).replace(location.origin, '').slice(0, 80))); }
    return play.call(this);
  };
});
const report = { errors: [] };

async function watch(page, tag) {
  const r = { tag, pageErrors: [], consoleErrors: [], failed: [], fromSW: 0, net: 0, ranges206: 0 };
  page.on('pageerror', e => r.pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') r.consoleErrors.push(m.text().slice(0, 200)); });
  page.on('requestfailed', q => r.failed.push(q.url().replace(base, '') + ' ' + (q.failure() || {}).errorText));
  page.on('response', s => { if (s.fromServiceWorker()) r.fromSW++; else r.net++; if (s.status() === 206) r.ranges206++; });
  return r;
}
async function panelText(page) { return page.evaluate(() => { const b = document.querySelector('#offline .card'); return b ? b.innerText.replace(/\s+/g, ' ') : ''; }); }
async function clickPanel(page, label) {
  await page.evaluate(l => { const b = [...document.querySelectorAll('#offline .btns button')].find(x => x.textContent === l); if (!b) throw new Error('no button ' + l); b.click(); }, label);
}

// ---------------------------------------------------------------- 1. download (pause, continue)
{
  const page = await context.newPage();
  const w = await watch(page, 'download');
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  await page.screenshot({ path: path.join(out, '1_title.png') });
  // a player who never opens Play offline gets no service worker
  const regs = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length);
  if (regs) report.errors.push('a service worker before Play offline was used');
  await page.click('#btn-offline');
  await page.waitForFunction(() => /Download for offline/.test(document.querySelector('#offline .btns').innerText));
  log('panel:', await panelText(page));
  await page.screenshot({ path: path.join(out, '2_panel.png') });
  const t0 = Date.now();
  await clickPanel(page, 'Download for offline');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(out, '3_progress.png') });
  log('progress:', await panelText(page));
  await clickPanel(page, 'Pause');
  await page.waitForFunction(() => /Continue/.test(document.querySelector('#offline .btns').innerText), null, { timeout: 30000 });
  log('paused:', await panelText(page));
  await page.screenshot({ path: path.join(out, '4_paused.png') });
  // a reload in the middle: the part already stored is kept
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  await page.evaluate(() => Offline.open());
  await page.waitForFunction(() => /Continue/.test(document.querySelector('#offline .btns').innerText), null, { timeout: 30000 });
  log('after reload:', await panelText(page));
  await clickPanel(page, 'Continue');
  let last = 0;
  await page.waitForFunction(() => { const s = Offline.state(); return s.state && s.state.version && !s.job; }, null, { timeout: 30 * 60000, polling: 2000 }).catch(e => report.errors.push('download did not finish: ' + e.message));
  log('ready in', Math.round((Date.now() - t0) / 1000), 's:', await panelText(page));
  await page.screenshot({ path: path.join(out, '5_ready.png') });
  const est = await page.evaluate(async () => { const e = await navigator.storage.estimate(); const c = await caches.open('sn-offline'); return { usage: e.usage, quota: e.quota, entries: (await c.keys()).length, persisted: await navigator.storage.persisted(), sw: !!navigator.serviceWorker.controller }; });
  log('storage:', JSON.stringify(est));
  report.download = { ...w, est };
  await page.close();
}

// ---------------------------------------------------------------- 2. offline: no server, browser offline
await serve(false);
await context.setOffline(true);
for (const scene of scenesArg.split(',')) {
  const page = await context.newPage();
  const w = await watch(page, scene);
  await page.goto(base + '?scene=' + scene, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  await page.evaluate(() => Game.begin(true));
  await page.waitForTimeout(15000);
  await page.screenshot({ path: path.join(out, `6_offline_${scene}.png`) });
  const media = await page.evaluate(() => ({
    decoded: __au.decoded, decodeFail: __au.decodeFail, playing: __au.playing.slice(0, 12),
    elements: __au.media.map(m => ({ src: (m.currentSrc || m.src).replace(location.origin, '').slice(0, 60), ready: m.readyState, t: +m.currentTime.toFixed(2), paused: m.paused, err: m.error && m.error.code })).filter(m => !/^data:|^blob:/.test(m.src)).slice(0, 12),
    online: navigator.onLine, controlled: !!navigator.serviceWorker.controller, water: window.S && S.waterStats ? JSON.stringify(S.waterStats).slice(0, 80) : null,
  }));
  Object.assign(w, { media });
  log(`\n[offline ${scene}]`, JSON.stringify({ pageErrors: w.pageErrors, consoleErrors: w.consoleErrors.slice(0, 8), failed: w.failed.slice(0, 10), fromSW: w.fromSW, net: w.net, ranges206: w.ranges206, ...media }, null, 1));
  report[scene] = w;
  if (w.pageErrors.length || w.failed.length || media.decodeFail) report.errors.push(`offline ${scene}: ` + JSON.stringify({ pageErrors: w.pageErrors, failed: w.failed, decodeFail: media.decodeFail }));
  await page.close();
}

// every video of the pack from the copy: plays, and draws into 2D (getImageData) and WebGL (texImage2D) untainted;
// the fonts came from the copy
{
  const page = await context.newPage();
  await page.goto(base + '?scene=title', { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  const vids = await page.evaluate(async () => {
    const list = (await (await fetch('offline.json')).json()).list.filter(e => /^art\/video\/.*\.(mp4|webm)$/.test(e.p));
    const probe = document.createElement('video'), fmt = probe.canPlayType('video/mp4; codecs="avc1.640028"') ? 'mp4' : 'webm';
    const out = [];
    for (const e of list.filter(x => x.alt === fmt)) {
      const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.src = e.p;
      const r = { p: e.p };
      try {
        await Promise.race([v.play(), new Promise((_, rej) => setTimeout(() => rej(new Error('no play in 8 s')), 8000))]);
        await new Promise(res => setTimeout(res, 600));
        r.t = +v.currentTime.toFixed(2); r.size = v.videoWidth + 'x' + v.videoHeight;
        const c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d'); g.drawImage(v, 0, 0, 64, 64);
        const px = g.getImageData(0, 0, 64, 64).data; let sum = 0; for (let i = 0; i < px.length; i += 4) sum += px[i] + px[i + 1] + px[i + 2]; r.lum = Math.round(sum / 4096 / 3);
        const gl = document.createElement('canvas').getContext('webgl');
        if (gl) { const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v); r.gl = gl.getError() === 0 ? 'ok' : 'gl error'; }
      } catch (err) { r.err = err.name + ': ' + err.message; }
      v.pause(); v.removeAttribute('src'); v.load();
      out.push(r);
    }
    const fontKeys = (await caches.has('sn-fonts')) ? (await (await caches.open('sn-fonts')).keys()).length : 0;
    await document.fonts.ready;
    return { out, fontKeys, cinzel: document.fonts.check('16px Cinzel'), fontsLoaded: [...document.fonts].filter(f => f.status === 'loaded').length };
  });
  log('\n[offline videos]', JSON.stringify(vids, null, 1));
  report.videos = vids;
  if (vids.fontKeys < 20) report.errors.push('fonts not kept: ' + vids.fontKeys);
  for (const r of vids.out) if (r.err || r.gl !== 'ok' || !(r.t > 0)) report.errors.push('video ' + r.p + ' ' + JSON.stringify(r));
  await page.close();
}

// ---------------------------------------------------------------- 3. an update: one file changed online
await context.setOffline(false);
{
  const rel = 'js/story/docs.js', f = path.join(dir, rel);   // (a story file both games have)
  const body = fs.readFileSync(f, 'utf8') + '\n// offline update test ' + Date.now() + '\n';
  fs.unlinkSync(f); fs.writeFileSync(f, body);   // (unlink first: the folder may be hard links to the working tree)
  const oj = path.join(dir, 'offline.json'), o = JSON.parse(fs.readFileSync(oj, 'utf8'));
  const e = o.list.find(x => x.p === rel); e.b = Buffer.byteLength(body); e.h = crypto.createHash('md5').update(body).digest('hex').slice(0, 10);
  o.version = 'test' + Date.now().toString(16).slice(-6);
  fs.unlinkSync(oj); fs.writeFileSync(oj, JSON.stringify(o));
}
await serve(true);
{
  const page = await context.newPage();
  const w = await watch(page, 'update');
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  await page.evaluate(() => Offline.open());
  await page.waitForFunction(() => /Update/.test(document.querySelector('#offline .btns').innerText), null, { timeout: 30000 }).catch(e => report.errors.push('no update offered'));
  log('\nupdate offered:', await panelText(page));
  await page.screenshot({ path: path.join(out, '7_update.png') });
  await clickPanel(page, 'Update').catch(e => report.errors.push(e.message));
  await page.waitForFunction(() => { const s = Offline.state(); return s.state && /^test/.test(s.state.version) && !s.job; }, null, { timeout: 120000, polling: 500 }).catch(e => report.errors.push('update did not finish'));
  log('after update:', await panelText(page));
  await page.screenshot({ path: path.join(out, '8_updated.png') });
  await page.close();
}
await serve(false);
await context.setOffline(true);
{
  const page = await context.newPage();
  const w = await watch(page, 'after-update');
  await page.goto(base + '?scene=' + scenesArg.split(',')[0], { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  const txt = await page.evaluate(async () => (await (await fetch('js/story/docs.js')).text()).slice(-60));
  log('offline docs.js ends with:', JSON.stringify(txt), 'errors:', w.pageErrors);
  if (!/offline update test/.test(txt)) report.errors.push('updated file not served offline');
  await page.close();
}
// ---------------------------------------------------------------- 4. remove
await context.setOffline(false);
await serve(true);
{
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForSelector('#title.ready', { timeout: 60000 });
  await page.evaluate(() => Offline.open());
  await page.waitForFunction(() => /Remove offline copy/.test(document.querySelector('#offline .btns').innerText), null, { timeout: 30000 });
  await clickPanel(page, 'Remove offline copy');
  await page.waitForTimeout(3000);
  const left = await page.evaluate(async () => ({ caches: await caches.keys(), regs: (await navigator.serviceWorker.getRegistrations()).length, text: document.querySelector('#offline .card').innerText.replace(/\s+/g, ' ') }));
  log('\nafter remove:', JSON.stringify(left));
  await page.screenshot({ path: path.join(out, '9_removed.png') });
  if (left.caches.length || left.regs) report.errors.push('remove left something: ' + JSON.stringify(left));
}
await browser.close();
await serve(false);
log('\nerrors:', report.errors.length ? report.errors : 'none');
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
