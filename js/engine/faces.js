// Lip-sync and blinking on the paintings that have them (js/faces.js, made by scripts/face_transfer.py).
// While a character speaks, their mouth follows the line's Rhubarb cues (js/lipsync.js,
// scripts/lipsync.py); every few seconds they blink. Both are patches laid into the painting itself
// before it is lit and bent, so breath, sway and the head's tilt carry them like the rest of the face.
(function () {
  const E = window.Engine;
  // a frame's set is used once approved on the review page ("ok"); ?faces=all shows the ones still waiting
  const ALL = /[?&]faces=all\b/.test(location.search);
  const FACES = Object.fromEntries(Object.entries(window.FACES || {}).filter(([, D]) => D.ok !== false || ALL));

  // ---------------------------------------------------------------- the patches
  const PATCH = {}; // 'frame_state' -> Image
  function patch(n) {
    let im = PATCH[n];
    if (!im) { im = PATCH[n] = new Image(); im.src = 'art/faces/' + n + '.webp'; }
    return im.complete && im.naturalWidth ? im : null;
  }
  // a frame's patches load the first time it is on screen (the side frames he stands and talks in, up front)
  const asked = new Set();
  function want(f) {
    const D = FACES[f];
    if (asked.has(f) || !D) return;
    asked.add(f);
    D.mouths.forEach(s => patch(f + '_' + s));
    D.eyes.forEach(s => patch(f + '_eyes_' + s));
  }
  function preload() {
    if (!window.FAST) ['alan_side', 'alan_idle2', 'alan_talk', 'alan_talk2'].forEach(want);
  }

  // ---------------------------------------------------------------- the cues
  // a shape held under 70 ms merges into the one before it (a closed mouth, A, is kept from 50 ms):
  // Rhubarb's raw cues flicker faster than a painted mouth can read
  function clean(c, d) {
    const out = [];
    c.forEach(([t0, v], k) => {
      const t1 = k + 1 < c.length ? c[k + 1][0] : d, prev = out[out.length - 1];
      if (prev && prev[1] === v) return;
      if (prev && t1 - t0 < (v === 'A' ? 0.05 : 0.07) && k + 1 < c.length) return;
      out.push([t0, v]);
    });
    return out;
  }
  const CUES = new Map(); // line id -> cleaned cues (js/lipsync.js, made by scripts/lipsync.py)
  function cues(who, id) {
    if (!CUES.has(id)) { const L = window.LIPSYNC && LIPSYNC[who] && LIPSYNC[who][id]; CUES.set(id, L ? clean(L[1], L[0]) : null); }
    return CUES.get(id);
  }
  const at = (c, t) => { let s = 'X'; for (const [t0, v] of c) { if (t0 <= t) s = v; else break; } return s; };

  // ---------------------------------------------------------------- the jaw
  // how far each shape opens the jaw (degrees, scripts/mouth_swaps.py); the jaw travels through the
  // in-betweens (40% and 70% open) one step at a time, never jumping from shut to wide
  const OPEN = { X: 0, A: 0, B: 0.25, G: 0, F: 1.75, H: 2, C: 2.75, E: 3.25, D: 6.25 };
  const FR = k => ('CDEFH'.includes(k) ? [0.4, 0.7, 1] : [1]);
  const LEAD = 0.06;  // the mouth leads the voice by a frame or two, as animators do
  const STEP = 0.028; // one jaw position per step (s)
  function stepJaw(m, want) {
    if (m.k === want && m.f >= 1) return;
    const a0 = OPEN[m.k] * m.f, aw = OPEN[want];
    if (aw >= a0) { // opening (or a shape as open): the wanted shape, at its next fraction above where the jaw is
      const fs = FR(want).filter(f => aw * f > a0 + 0.01 || f === 1);
      m.f = m.k === want ? (FR(want).find(f => f > m.f) || 1) : fs[0]; m.k = want;
    } else { // closing: this shape steps down first, then the wanted one
      const lower = FR(m.k).filter(f => f < m.f && OPEN[m.k] * f > aw + 0.01);
      if (lower.length) m.f = lower[lower.length - 1]; else { m.k = want; m.f = 1; }
    }
  }
  // the mouth on screen for this actor now: a patch name, or null for the painting's own mouth
  function mouthOf(a) {
    const sp = E.speaking, id = sp && sp.actor === a && window.Sound && Sound.voiceId && Sound.voiceId();
    if (!id || id !== sp.id) { a.lip = null; return null; }
    const c = cues(a.talkWho || a.ch, id), t = Sound.voiceTime();
    if (!c || t == null) { a.lip = null; return null; }
    let want = at(c, t + LEAD);
    if (want === 'X') want = 'A'; // between words: a relaxed closed mouth (his smile is for when he's quiet)
    const m = a.lip || (a.lip = { k: 'A', f: 1, at: 0 });
    if (E.time - m.at >= STEP) { stepJaw(m, want); m.at = E.time; }
    return m.f >= 1 ? m.k : m.k + '_' + Math.round(m.f * 100);
  }

  // ---------------------------------------------------------------- blinking
  // every 2 to 6 s: half shut, shut, half shut (150 ms), now and then twice
  const BLINK = [[0.04, 'half'], [0.11, 'closed'], [0.15, 'half']];
  function lidOf(a) {
    const b = a.blink || (a.blink = { next: E.time + 1 + Math.random() * 4, t0: -1 });
    if (b.t0 < 0 && E.time >= b.next) b.t0 = E.time;
    if (b.t0 < 0) return null;
    const u = E.time - b.t0, s = BLINK.find(([end]) => u < end);
    if (s) return s[1];
    const again = !b.twice && Math.random() < 0.25;
    b.twice = again; b.t0 = -1; b.next = E.time + (again ? 0.12 : 2 + Math.random() * 4);
    return null;
  }

  // the nearest shape a frame has: most frames have A to F only (G, F/V, borrows B; H, L, borrows C), and only the
  // side frames have the jaw's in-betweens (a jaw on its way open shows B until it is most of the way there)
  const STANDIN = { G: 'B', H: 'C', X: 'A' };
  function mouthFor(D, m) {
    if (D.mouths.includes(m)) return m;
    let [k, f] = m.split('_');
    if (f && +f < 60) k = 'B';
    if (!D.mouths.includes(k)) k = STANDIN[k];
    return k && D.mouths.includes(k) ? k : null;
  }

  // ---------------------------------------------------------------- the painting with its face
  const cache = new Map();
  // the frame `key` as painted, or with the actor's mouth and eyelids laid in (a canvas the size of the painting)
  function faceImage(a, key, im) {
    const D = FACES[key];
    if (!D || window.FAST || !im || !im.naturalWidth || (E.SPRITES[key] && E.SPRITES[key].src)) return im;
    want(key);
    if (a.faceAt !== E.time) { a.faceAt = E.time; a.faceM = mouthOf(a); a.faceL = lidOf(a); } // once a frame, whichever paintings are up
    const m = a.faceM && mouthFor(D, a.faceM), mn = m ? key + '_' + m : null;
    const lid = a.faceL && (D.eyes.includes(a.faceL) ? a.faceL : D.eyes.includes('closed') ? 'closed' : null); // no half-shut painting: shut for the whole blink
    const ln = lid ? key + '_eyes_' + lid : null;
    const mp = mn && patch(mn), lp = ln && patch(ln);
    if (!mp && !lp) return im;
    const ck = key + '|' + (mp ? mn : '') + '|' + (lp ? ln : '');
    let cv = cache.get(ck);
    if (!cv) {
      if (cache.size > 120) cache.clear();
      cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight;
      const c = cv.getContext('2d'), [x, y, w, h] = D.box;
      c.drawImage(im, 0, 0);
      if (mp) { c.clearRect(x, y, w, h); c.drawImage(mp, x, y, w, h); } // the lower face replaces the box, so no painted lips show under it
      if (lp) c.drawImage(lp, x, y, w, h);
      cache.set(ck, cv);
    }
    return cv;
  }

  Object.assign(E, { faceImage, preloadFaces: preload });
  if (document.readyState === 'complete') setTimeout(preload, 0); else window.addEventListener('load', () => setTimeout(preload, 0));
})();
