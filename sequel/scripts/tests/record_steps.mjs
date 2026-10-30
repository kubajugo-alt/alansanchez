// A smooth, true-speed recording of rooms however slow the browser renders (2026-10-30, the parallax for the user):
// the game's frame loop is driven one 1/30 s step at a time (requestAnimationFrame taken over, window.STEP_DT), the
// sea loops seeked to the same clock, and each frame's canvas saved as a JPEG; then ffmpeg makes the video.
// In each room Alan walks right across and back, so the parallax camera drifts with him. Serve the game first.
//   node sequel/scripts/tests/record_steps.mjs <baseUrl> <outDir> room:chapter [room:chapter ...]
//   ffmpeg -framerate 30 -i <outDir>/f%05d.jpg -c:v libx264 -pix_fmt yuv420p out.mp4
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const [base, dir, ...rooms] = process.argv.slice(2);
const FPS = 30, LEG = 4.5;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(FPS => {
  try { localStorage.setItem('shortest-night-content', 'full'); localStorage.setItem('shortest-night-tips', 'off'); localStorage.setItem('shortest-night-effects', 'full'); } catch (e) {}
  let q = [], t = 0, manual = false; const vids = [];
  const mk = document.createElement.bind(document);
  document.createElement = (n, o) => { const el = mk(n, o); if (String(n).toLowerCase() === 'video') vids.push(el); return el; };
  window.requestAnimationFrame = cb => { q.push(cb); return q.length; };
  const step = () => { const c = q; q = []; t += 1000 / FPS; c.forEach(f => f(t)); };
  setInterval(() => { if (!manual) step(); }, 16);
  window.__manual = () => { manual = true; window.STEP_DT = 1 / FPS; };
  const cv = mk('canvas'); cv.width = 1280; cv.height = 720;
  window.__frame = async () => {
    // the sea loops on the same clock as the game
    await Promise.all(vids.filter(v => v.readyState >= 1 && v.duration).map(v => new Promise(r => {
      v.pause(); const to = (t / 1000) % v.duration; if (Math.abs(v.currentTime - to) < 1e-3) return r();
      v.addEventListener('seeked', r, { once: true }); v.currentTime = to; setTimeout(r, 500); })));
    step();
    cv.getContext('2d').drawImage(document.getElementById('scene'), 0, 0, 1280, 720);
    return cv.toDataURL('image/jpeg', 0.88).slice(23);
  };
}, FPS);
await p.goto(base); await p.waitForSelector('#title.ready', { timeout: 60000 });
await p.evaluate(() => Game.begin(true)); await p.waitForTimeout(3000);
await p.evaluate(() => { window.__manual(); window.CALM = false; });
let n = 0; const marks = [];
const frames = async k => { for (let i = 0; i < k; i++) fs.writeFileSync(`${dir}/f${String(n++).padStart(5, '0')}.jpg`, Buffer.from(await p.evaluate(() => window.__frame()), 'base64')); };
for (const rc of rooms) {
  const [room, ch] = rc.split(':');
  await p.evaluate(async ([room, ch]) => { Game.flags.ch = +ch; document.querySelectorAll('.tip,.toast').forEach(e => e.remove());
    await Game.goRoom(room, null, { instant: true, noEnter: true, noSave: true }); const a = Game.player; if (a) { a.x = 240; a.walkTo(1040, a.y); } }, [room, ch]);
  marks.push([room, n / FPS, await p.evaluate(() => !!(window.Parallax && Parallax.active))]);
  await frames(Math.round(LEG * FPS));
  await p.evaluate(() => { const a = Game.player; if (a) a.walkTo(240, a.y); });
  await frames(Math.round(LEG * FPS));
  process.stdout.write(room + ' ');
}
console.log('\n' + JSON.stringify({ frames: n, marks, errs }));
await b.close();
