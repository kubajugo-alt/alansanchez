// The women of light (HANDOFF entry 110; the user: "the harimaguadas animation should fade in in a flash of light and
// fade out the same way", "ideally, alan should stand in the circle between them, with the occlusions done right").
// The closing of Cave 6 (js/story/mon.js S.closeLock sets S.closing): the approved Higgsfield/Kling loop of seven women
// of light dancing in a ring, split offline by scripts/dance_layers.py into the far half of the ring (BACK) and the
// near half (FRONT), stacked in one video so the halves can never drift apart: art/video/harimaguadas.mp4 / .webm,
// 960 x 1080, back on top, front below, 8 s, looping. Screen-blended over the chamber, the ring round the noon column
// with Alan standing in it (his feet between the far women's and the near women's).
// Drawn from the room's animFg, after the figures and the Sea's water (js/engine/render.js): BACK first, with every
// figure's sprite silhouette cut out of it (so Alan stands in front of the far women), then FRONT over him. Both a
// little dimmer below the water's surface (their lower parts in it). A warm white-gold flash from the noon column
// brings them in and takes them away. Without video (not loaded in time, an error): the old code-drawn women
// (vasco.js S.harimaguada), in a ring round Alan, through the same back/front split.
(function () {
  const E = window.Engine, S = window.S, F = S.F;
  // seconds from S.closing: the flash in peaks at FLASH_UP, the flash out starts at OUT; the scene waits S.DANCE_MS
  const FLASH_UP = 0.25, FLASH_DOWN = 0.8, OUT = 15.0;
  S.DANCE_MS = Math.round((OUT + FLASH_UP + FLASH_DOWN) * 1000) + 50;   // 16.1 s: two loops of the dance
  // where the video sits (1280 x 720): each layer 960 x 540 drawn at K; the ring's centre (video x 471) on the noon
  // column, the far women's feet (video y ~322) above Alan's at the seventh socket (655), the near ones' (~500) below
  // (set when the closing starts, from where Alan stands: 641, 655 at the seventh socket, the hotspot's standing point)
  const K = 0.82, VW = 960, VH = 540, DW = Math.round(VW * K), DH = Math.round(VH * K);
  let CX = 641, X0 = Math.round(CX - 471 * K), Y0 = 293;
  const centre = () => {
    const p = E.player, x = p && p.visible ? Math.max(560, Math.min(720, p.x)) : 641, y = p && p.visible ? Math.max(630, Math.min(670, p.y)) : 655;
    CX = Math.round(x); X0 = Math.round(CX - 471 * K); Y0 = Math.round(y - 362);
  };
  const smooth = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const flashK = t => t < 0 ? 0 : t < FLASH_UP ? smooth(0, FLASH_UP, t) : Math.pow(Math.max(0, 1 - (t - FLASH_UP) / FLASH_DOWN), 2);
  // the women's opacity: up under the flash in, down under the flash out
  S.danceAlpha = e => smooth(0.08, 0.4, e) * (1 - smooth(OUT + 0.05, OUT + FLASH_UP + 0.05, e));
  // the triangles' flare (vasco.js S.drawLowLight) follows the same envelope, a little slower
  S.closingEnv = e => smooth(0, 1, e) * (1 - smooth(OUT, OUT + FLASH_UP + FLASH_DOWN, e));

  let vid = null, seen = null, mode = null;   // mode, decided once per closing: 'video' | 'code'
  function video() {
    if (vid) return vid;
    const v = vid = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.onerror = () => { v.failed = true; };
    v.src = 'art/video/harimaguadas' + (v.canPlayType('video/mp4; codecs="avc1.640028"') ? '.mp4' : '.webm');   // (VP9 where there's no H.264)
    v.load();
    return v;
  }
  // fetched ahead, from the moment the last discs are in hand in the chamber
  const soon = () => { const f = F(); return f.ch === 7 && !f.lock_closed && (f.placed || []).length >= 5; };

  const off = document.createElement('canvas'), og = off.getContext('2d');
  off.width = DW; off.height = DH;
  // the code-drawn women (the fallback): a ring round Alan, the far half or the near half
  function codeRing(g, e, near, ax, ay) {
    const ring = [];
    for (let j = 0; j < 7; j++) { const a = e * 0.55 + j * Math.PI * 2 / 7, z = Math.cos(a); if ((z >= 0) === near) ring.push([z, a, j]); }
    ring.sort((p, q) => p[0] - q[0]).forEach(([z, a, j]) => S.harimaguada(g, ax + Math.sin(a) * 200, ay + z * 42, 1.25 + z * 0.2, e, j, 0.6 + 0.35 * (z + 1) / 2));
  }
  // the figures standing inside the dance's box, cut out of the far half (their own sprite frames, as water.js does)
  function cutFigures(o) {
    o.globalCompositeOperation = 'destination-out';
    const figs = E.npcs.filter(a => a.visible).concat(E.player && E.player.visible ? [E.player] : []);
    for (const a of figs) {
      const P = a.cur && a.place(a.cur, !!a.curFlip); if (!P || !P.im) continue;
      o.save(); o.globalAlpha = a.alpha == null ? 1 : Math.max(0, Math.min(1, a.alpha));
      o.translate(a.x + P.x - X0, a.y + P.y - Y0);
      if (P.flipped) { o.translate(P.w, 0); o.scale(-1, 1); }
      o.drawImage(P.im, 0, 0, P.w, P.h); o.restore();
    }
  }
  // below the water's surface (as it stands on a figure at Alan's feet): dimmer, in it
  function wet(o) {
    const lvl = S.water && S.water.cave6_low; if (!(lvl > 0.01) || !S.waterH) return;
    const ay = E.player ? E.player.y : 655, yw = ay - S.waterH(lvl) * E.scaleAt(ay) - Y0;
    const gr = o.createLinearGradient(0, yw - 10, 0, yw + 30);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.35)');
    o.globalCompositeOperation = 'destination-out'; o.fillStyle = gr; o.fillRect(0, Math.max(0, yw - 10), DW, DH);
  }
  function layer(g, src, alpha, back) {
    og.setTransform(1, 0, 0, 1, 0, 0); og.globalAlpha = 1; og.globalCompositeOperation = 'source-over';
    og.clearRect(0, 0, DW, DH); src(og);
    if (back) cutFigures(og);
    wet(og);
    og.globalCompositeOperation = 'source-over';
    g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = alpha; g.drawImage(off, X0, Y0); g.restore();
  }
  // the flash: a warm white-gold bloom from the noon column over the whole frame
  function flash(g, k) {
    if (k <= 0.002) return;
    g.save(); g.globalCompositeOperation = 'screen';
    const r = g.createRadialGradient(640, 360, 0, 640, 360, 900);   // (the noon column)
    r.addColorStop(0, `rgba(255,248,226,${0.95 * k})`); r.addColorStop(0.25, `rgba(255,236,190,${0.75 * k})`); r.addColorStop(1, `rgba(255,214,150,${0.45 * k})`);
    g.fillStyle = r; g.fillRect(0, 0, 1280, 720);
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35 * k;
    g.fillStyle = 'rgb(255,240,205)'; g.fillRect(0, 0, 1280, 720);   // (the column itself whitens out at the peak)
    g.restore();
  }

  // every frame in the chamber (its animFg)
  S.drawDance = function (g) {
    if (!S.closing) {
      if (seen) { seen = null; mode = null; if (vid && !vid.paused) vid.pause(); }
      if (soon() && !window.FAST) video();
      return;
    }
    const e = performance.now() / 1000 - S.closing;
    if (seen !== S.closing) {   // a new closing: the dance from its first frame
      seen = S.closing; mode = null; centre();
      const v = video(); try { v.currentTime = 0; } catch (err) {}
      v.play().catch(() => { v.failed = true; });
    }
    const v = vid;
    if (!mode) {
      if (v && !v.failed && v.readyState >= 3 && !v.paused) mode = 'video';
      else if (e > 0.6 || (v && v.failed)) mode = 'code';   // (not ready by the flash's peak: the drawn women, for the whole dance)
    }
    const a = S.danceAlpha(e);
    if (mode && a > 0.002) {
      const ax = E.player ? E.player.x : CX, ay = E.player ? E.player.y : 655;
      if (mode === 'video' && v.readyState >= 2) {
        layer(g, o => o.drawImage(v, 0, 0, VW, VH, 0, 0, DW, DH), a, true);
        layer(g, o => o.drawImage(v, 0, VH, VW, VH, 0, 0, DW, DH), a, false);
      } else if (mode === 'code') {
        layer(g, o => { o.save(); o.translate(-X0, -Y0); codeRing(o, e, false, ax, ay); o.restore(); }, a, true);
        layer(g, o => { o.save(); o.translate(-X0, -Y0); codeRing(o, e, true, ax, ay); o.restore(); }, a, false);
      }
    }
    flash(g, Math.max(flashK(e), flashK(e - OUT)));
  };
  // (tests and the review: which way it is drawing)
  S.danceMode = () => mode;
})();
