// What a room's movement moves (HANDOFF entry 142): each room's animBack drawn over its bare painting (no camera, no
// figures, no grade) at N moments 1/10 s apart, in the page's own canvas; per pixel the spread over those moments.
// Writes <outDir>/<room>_spread.png (grey: how much it moves, x8) and <outDir>/<room>_frames/f%03d.png when FRAMES=1,
// and prints the spread inside named boxes. Serve the game first.
//   node sequel/scripts/tests/anim_delta.mjs <baseUrl> <outDir> room:chapter[:bg] ...     (?env=2 in baseUrl for the new pass)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const [base, dir, ...rooms] = process.argv.slice(2);
const N = +(process.env.N || 40), FRAMES = !!process.env.FRAMES;
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400 && !/\.mp3/.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
await p.goto(base, { timeout: 90000 }); await p.waitForSelector('#title.ready', { timeout: 90000 });
p.evaluate(() => Game.begin(true)).catch(() => {}); await p.waitForTimeout(3000);
for (const rc of rooms) {
  const [room, ch, bgName] = rc.split(':');
  await p.evaluate(([room, ch]) => { Game.flags.ch = +ch; Game.goRoom(room, null, { instant: true, noEnter: true, noSave: true }); }, [room, ch]);
  await p.waitForFunction(r => Game.room && Game.room.id === r, room, { timeout: 60000 });
  await p.waitForTimeout(3000);   // (masks, sky, video in)
  const res = await p.evaluate(async ([N, frames, bgName]) => {
    const R = Game.room, im = bgName ? Engine.IMG['bg:' + bgName] : Game.bgImage();
    const c = document.createElement('canvas'); c.width = 640; c.height = 360; const g = c.getContext('2d', { willReadFrequently: true });
    const sum = new Float32Array(640 * 360), sq = new Float32Array(640 * 360), out = [];
    for (let i = 0; i < N; i++) {
      const t = 20 + i * 0.1;
      // (the bare painting drawn first and taken off: what's left is only what animBack changed this moment)
      g.setTransform(0.5, 0, 0, 0.5, 0, 0); g.drawImage(im, 0, 0, 1280, 720);
      const d0 = g.getImageData(0, 0, 640, 360).data;
      if (R.animBack) R.animBack(g, t);
      g.setTransform(1, 0, 0, 1, 0, 0);
      const d = g.getImageData(0, 0, 640, 360).data;
      for (let k = 0, j = 0; k < d.length; k += 4, j++) { const v = 0.3 * (d[k] - d0[k]) + 0.59 * (d[k + 1] - d0[k + 1]) + 0.11 * (d[k + 2] - d0[k + 2]); sum[j] += v; sq[j] += v * v; }
      if (frames) out.push(c.toDataURL('image/png').slice(22));
      await new Promise(r => setTimeout(r, 30));
    }
    const s = new Uint8ClampedArray(640 * 360 * 4);
    for (let j = 0; j < sum.length; j++) { const m = sum[j] / N, v = Math.sqrt(Math.max(0, sq[j] / N - m * m)) * 8; s[j * 4] = s[j * 4 + 1] = s[j * 4 + 2] = v; s[j * 4 + 3] = 255; }
    g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(new ImageData(s, 640, 360), 0, 0);
    return { spread: c.toDataURL('image/png').slice(22), frames: out, bg: im && im.src.split('/').pop() };
  }, [N, FRAMES, bgName || null]);
  const name = room + (bgName ? '_' + bgName : '');
  fs.writeFileSync(`${dir}/${name}_spread.png`, Buffer.from(res.spread, 'base64'));
  if (FRAMES) { fs.mkdirSync(`${dir}/${name}_frames`, { recursive: true }); res.frames.forEach((f, i) => fs.writeFileSync(`${dir}/${name}_frames/f${String(i).padStart(3, '0')}.png`, Buffer.from(f, 'base64'))); }
  console.log(name, res.bg);
}
console.log(JSON.stringify({ errs }));
await b.close();
