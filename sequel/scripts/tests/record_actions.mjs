// Alan's actions where the story plays them (HANDOFF entry 141): for each moment, the room on its day, Alan at the
// hotspot's standing point facing it (or a given point), the Sea's water where it is; then the pose's run on the game's
// own clock (stepped 1/30 s at a time, as record_steps.mjs): in to the hold frame, held for the story's beat, out to
// standing. Each moment's frames go to <outDir>/<name>/f%04d.jpg plus a 1280 strip (before, half way in, the hold, half way
// out, after) <outDir>/<name>_strip.jpg. Serve the game first.
//   node sequel/scripts/tests/record_actions.mjs <baseUrl> <outDir> [name ...]
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const [base, dir, ...only] = process.argv.slice(2);
const FPS = 30;
// name, pose, room, chapter, flags, where (a hotspot name or [x, y, dir]), the story's beat in ms, water {room: level}
const M = [
  ['phone_box', 'phone', 'canteras', 2, {}, 'Phone box', 3000],
  ['clock_drum', 'crank', 'belfry', 2, { clock_key: true }, 'Clock winding drum', 2800],
  ['bell_hand', 'reachup', 'belfry', 2, { clock_wound: true }, 'The north bell', 1400],
  ['bell_rubbing', 'rub', 'belfry', 2, { clock_wound: true }, 'The north bell', 1400],
  ['founders_letter', 'pickup', 'belfry', 2, { clock_wound: true }, 'The north bell', 500],
  ['letter_by_the_dogs', 'read', 'santa_ana', 2, {}, [260, 650, 'w'], 3000],
  ['crate_labels', 'read', 'museum_hall', 2, {}, [1060, 650, 'e'], 4000],
  ['morning_coffee', 'drink', 'hotel_room', 2, {}, [720, 640, 'e'], 1500],
  ['rum_at_rafas', 'drink', 'rafa_bar', 4, { fight_done: true }, [1100, 660, 'w'], 1200],
  ['salt_footprint', 'pickup', 'hotel_room', 5, {}, [560, 645, 'e'], 2500],
  ['packing', 'pickup', 'hotel_room', 6, {}, 'Packed bag', 1600],
  ['vascos_watch', 'reach', 'hotel_room', 6, {}, 'Bed', 700],
  ['note_for_vasco', 'write', 'hotel_room', 6, {}, 'Chest of drawers', 1500],
  ['ticket_back', 'reach', 'gando', 6, {}, [745, 650, 'e'], 600],
  ['hotel_call', 'phone', 'carmen_flat', 6, { chose_carmen: true }, 'Answering machine', 2500],
  ['grille', 'heave', 'vault', 6, { chose_carmen: true, knows_vault: true, su_camp: true }, 'The grille', 1400],
  ['crates', 'pickup', 'vault', 6, { vasco_free: true }, 'Crates', 900],
  ['disc_in_socket', 'setdown', 'cave6_low', 7, { in_water: true }, 'Socket · last quarter', 500, { cave6_low: 0.22 }],
  ['crescent_from_above', 'reachup', 'cave6_low', 7, { in_water: true }, 'The hole above', 700, { cave6_low: 0.26 }],
  ['sun_disc_cold', 'pickup', 'cave6_low', 7, { in_water: true }, 'Socket · the sun', 2500, { cave6_low: 0.3 }],
].filter(m => !only.length || only.includes(m[0]));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(FPS => {
  try { localStorage.setItem('shortest-night-content', 'full'); localStorage.setItem('shortest-night-tips', 'off'); localStorage.setItem('shortest-night-effects', 'full'); } catch (e) {}
  let q = [], t = 0, manual = false;
  window.requestAnimationFrame = cb => { q.push(cb); return q.length; };
  const step = () => { const c = q; q = []; t += 1000 / FPS; c.forEach(f => f(t)); };
  setInterval(() => { if (!manual) step(); }, 16);
  window.__manual = on => { manual = on; window.STEP_DT = on ? 1 / FPS : 0; };
  const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720;
  window.__frame = () => { step(); cv.getContext('2d').drawImage(document.getElementById('scene'), 0, 0, 1280, 720); return cv.toDataURL('image/jpeg', 0.9).slice(23); };
}, FPS);
await p.goto(base); await p.waitForSelector('#title.ready', { timeout: 60000 });
await p.evaluate(() => Game.begin(true)); await p.waitForTimeout(3000);
await p.evaluate(() => { Game.idleSmoke = null; });   // (no cigarette: the stepped clock is slow on the wall's)
const out = [];
for (const [name, pose, room, ch, flags, where, beat, water] of M) {
  const d = `${dir}/${name}`; fs.mkdirSync(d, { recursive: true });
  // (the room, Alan placed, every frame of the run loaded, on the free-running clock; then the stepped one)
  const info = await p.evaluate(async ([room, ch, flags, where, water, pose]) => {
    window.__manual(false);
    Object.assign(Game.flags, { ch, blazer_on: false, undressed: false, as_vasco: false }, flags);
    document.querySelectorAll('.tip,.toast').forEach(e => e.remove());
    await Game.goRoom(room, null, { instant: true, noEnter: true, noSave: true });
    if (water) Object.assign(S.water, water);
    const a = Game.player, R = Engine.ROOMS[room];
    let x, y, dir;
    if (Array.isArray(where)) [x, y, dir] = where;
    else { const h = R.hotspots.find(h => h.name === where); [x, y] = h.at; const cx = h.rect[0] + h.rect[2] / 2; dir = cx < x - 10 ? 'w' : 'e'; }
    a.x = x; a.y = y; a.dir = dir; a.lastEW = dir; a.lastFlip = dir === 'w'; a.visible = true; a.pose = null;
    const P = S.CHARS.alan.frames.poses[pose];
    if (P && P.frames) await Engine.ensure(P.frames.map(k => 'spr:' + k));
    await new Promise(r => setTimeout(r, 1500));
    return { run: !!(P && P.frames), n: P && P.frames ? P.frames.length : 0, hold: P ? P.hold : 0, fps: P ? P.fps : 0, x, y, dir };
  }, [room, ch, flags, where, water || null, pose]);
  await p.evaluate(() => { window.__manual(true); Engine.noteInput(); });
  let n = 0; const keys = [];
  const shot = async () => { fs.writeFileSync(`${d}/f${String(n++).padStart(4, '0')}.jpg`, Buffer.from(await p.evaluate(() => window.__frame()), 'base64')); keys.push(await p.evaluate(() => Game.player.cur)); };
  for (let i = 0; i < 15; i++) await shot();                                   // standing
  await p.evaluate(pose => { Game.player.pose = pose; }, pose);
  const inN = info.run ? Math.ceil((info.hold + 1) / info.fps * FPS) : 0;
  const holdN = Math.max(inN, Math.round(beat / 1000 * FPS));                 // the story's beat from the start of the run
  for (let i = 0; i < holdN; i++) await shot();
  const holdAt = n - 1;
  await p.evaluate(() => { Game.player.pose = null; });
  for (let i = 0; i < 90; i++) { await shot(); if (await p.evaluate(() => !Game.player.poseOut) && i > 5) break; }
  for (let i = 0; i < 15; i++) await shot();                                   // standing again
  out.push({ name, pose, room, ch, ...info, frames: n, holdAt, shown: [...new Set(keys)].length, last: keys[keys.length - 1] });
  process.stdout.write(name + ' ');
}
console.log('\n' + JSON.stringify({ out, errs }, null, 1));
fs.writeFileSync(`${dir}/actions.json`, JSON.stringify(out, null, 1));
await b.close();
