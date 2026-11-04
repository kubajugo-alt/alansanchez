// Record a ?scene= preview from the running game as video, with its sound (ported from Game II's
// sequel/scripts/tests/record_scene.mjs, 2026-11-04). Playwright records picture only, so two ways to the sound:
//   1. the game's own mix, captured: every Web Audio connection to the speakers is also sent to a MediaRecorder
//      (voices, music, effects, ambience, the room's reverb, the ducking, exactly as heard) -> audio.webm;
//   2. a log of when each voice line, music cue and ambience started -> log.json, which scripts/record_mix.py can lay
//      the files onto if the capture came back empty (a browser without audio rendering).
// A sync mark (a white frame and a short pip) as the scene starts lines the two up; record_mix.py cuts it off.
// Then:  python3 scripts/record_mix.py <outDir>        (writes <outDir>/<scene>.mp4)
//
//   node scripts/tests/record_scene.mjs <baseUrl> <outDir> <scene> [maxSeconds]
//   e.g. node scripts/tests/record_scene.mjs http://localhost:8098/ /tmp/rec quayfish 60
// Serve the game first (npx -y http-server -p 8098 -c-1 -s .). The scene runs in real time (no FAST) until it's done
// (the game idle for 3 s, no dialog open) or maxSeconds (default 90); dialog menus are answered with their first choice.
// Record from a clean export of a commit if files are being edited at the same time.
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [base, dir, scene, maxS] = process.argv.slice(2);
if (!base || !dir || !scene) { console.log('usage: record_scene.mjs <baseUrl> <outDir> <scene> [maxSeconds]'); process.exit(1); }
const MAX = (+maxS || 90) * 1000;
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } } });
const T0 = Date.now();   // (the video starts with the context; everything below is timed from here)
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
const log = []; const chunks = [];
await p.exposeFunction('__recLog', (what, id) => log.push([(Date.now() - T0) / 1000, what, id]));
await p.exposeFunction('__recAudio', b64 => { chunks.push(Buffer.from(b64, 'base64')); });
await p.addInitScript(() => {
  try { localStorage.setItem('drowned-bell-content', 'full'); localStorage.setItem('drowned-bell-tips', JSON.stringify({ seen: [], off: true })); } catch (e) {}
  // the game's mix: whatever reaches the speakers also goes to a recorder
  const taps = new WeakMap(), connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dest, ...r) {
    const out = connect.call(this, dest, ...r);
    if (dest instanceof AudioDestinationNode) {
      const ac = dest.context; let tap = taps.get(ac);
      if (!tap) {
        tap = ac.createMediaStreamDestination(); taps.set(ac, tap);
        const rec = new MediaRecorder(tap.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160000 });
        rec.ondataavailable = async e => { if (!e.data.size) return;
          const u = new Uint8Array(await e.data.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
          window.__recAudio(btoa(s)); };
        window.__recStop = () => new Promise(res => { rec.onstop = () => setTimeout(res, 300); rec.stop(); });
        window.__recCtx = ac; rec.start(1000);
      }
      try { connect.call(this, tap); } catch (e) {}
    }
    return out;
  };
});
await p.goto(base + '?scene=' + encodeURIComponent(scene)); await p.waitForSelector('#title.ready', { timeout: 120000 });
// the log: voice lines, music and ambience as the game starts them
await p.evaluate(() => {
  const S0 = window.Sound, wrap = (k, what) => { const f = S0[k]; S0[k] = function (id, ...r) { window.__recLog(what, typeof id === 'string' ? id : (id && id.id) || null); return f.call(this, id, ...r); }; };
  wrap('ambience', 'ambience'); wrap('sfx', 'sfx');
  // a line is logged when it really starts (playVoice resolves once its source has started, after the fetch and decode)
  const pv = S0.playVoice; S0.playVoice = function (id, ...r) { const q = pv.call(this, id, ...r); Promise.resolve(q).then(d => { if (d) window.__recLog('voice', id); }); return q; };
  let n = 0; setInterval(() => { const L = S0.musicLog || []; for (; n < L.length; n++) if (/^(play|cue|song|stop|cue-end|song-end|retune)$/.test(L[n].what)) window.__recLog('music-' + L[n].what, L[n].id); }, 100);
});
console.log('start', ((Date.now() - T0) / 1000).toFixed(1));
const t1 = Date.now();
const done = p.evaluate(() => Game.begin(true).then(async () => { let quiet = 0; for (;;) { await new Promise(r => setTimeout(r, 200)); quiet = (Game.isBusy || document.querySelector('#dialog.open')) ? 0 : quiet + 1; if (quiet >= 15) return 'done'; } }));
// a sync mark as the scene starts (the game's audio exists from Game.begin): the frame white for 300 ms and a 2 kHz
// pip in the mix, at one logged moment, so scripts/record_mix.py can line the video and the sound up on it (and trims it off)
await p.evaluate(async () => {
  for (let i = 0; i < 60 && !(window.__recCtx && window.__recCtx.state === 'running'); i++) await new Promise(r => setTimeout(r, 50));
  const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99999';
  await new Promise(r => requestAnimationFrame(r)); document.body.appendChild(d); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const ac = window.__recCtx;
  if (ac) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 2000; g.gain.value = 0.5; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.12); }
  window.__recLog('mark', ac ? 'pip' : null); await new Promise(r => setTimeout(r, 300)); d.remove();
}).catch(() => {});
const clicker = setInterval(() => p.evaluate(() => { const bs = [...document.querySelectorAll('#dialog.open button')]; if (bs.length) bs[0].click(); }).catch(() => {}), 1500);
const result = await Promise.race([done, new Promise(r => setTimeout(() => r('time limit'), MAX))]).catch(e => 'threw: ' + e.message);
clearInterval(clicker);
await p.waitForTimeout(1000);
await p.evaluate(() => window.__recStop && window.__recStop()).catch(() => null);
await p.waitForTimeout(500);
const end = (Date.now() - T0) / 1000;
const video = await p.video().path();
await ctx.close(); await b.close();
const out = { scene, result, start: (t1 - T0) / 1000, end, video: path.basename(video), audio: null, log, errs };
if (chunks.length) { fs.writeFileSync(path.join(dir, 'audio.webm'), Buffer.concat(chunks)); out.audio = 'audio.webm'; }
fs.writeFileSync(path.join(dir, 'log.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify({ result, seconds: end.toFixed(1), lines: log.filter(l => l[1] === 'voice').length, audio: out.audio, video: out.video, errs }));
