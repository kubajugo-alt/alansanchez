// Lip-sync and blinking on the paintings that have them (js/faces.js, made by scripts/face_transfer.py).
// While a character speaks, their mouth follows the line's Rhubarb cues (js/lipsync.js,
// scripts/lipsync.py); every few seconds they blink. Both are patches laid into the painting itself
// before it is lit and bent, so breath, sway and the head's tilt carry them like the rest of the face.
(function () {
  const E = window.Engine;
  // a frame's set is used once approved on the review page ("ok"); ?faces=all shows the ones still waiting
  const ALL = /[?&]faces=all\b/.test(location.search);
  const FACES = Object.fromEntries(Object.entries(window.FACES || {}).filter(([, D]) => D.ok === true || ALL)); // (no "ok" at all is not an approval)

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
    const D = FACES[f] || (window.FACES || {})[f];
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
    // the jaw steps by the clock, not once per drawn frame, so it keeps up with the voice on a slow device
    for (let n = 0; E.time - m.at >= STEP && n < 12; n++) { stepJaw(m, want); m.at += STEP; }
    if (E.time - m.at >= STEP) m.at = E.time; // (a long stall: catch up and carry on)
    return m.f >= 1 ? m.k : m.k + '_' + Math.round(m.f * 100);
  }

  // ---------------------------------------------------------------- blinking
  // every 2 to 6 s: half shut, shut, half shut (150 ms), now and then twice; `slot` keeps a pair partner's blink apart
  const BLINK = [[0.04, 'half'], [0.11, 'closed'], [0.15, 'half']];
  function lidOf(a, slot = 'blink') {
    const b = a[slot] || (a[slot] = { next: E.time + 1 + Math.random() * 4, t0: -1 });
    // no blink starts while the figure is dissolving or stepping through in-betweens (it would show on one painting only)
    if (b.t0 < 0 && E.time >= b.next && !(a.fadeT > 0) && !a.ibSeq) b.t0 = E.time;
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
  // a pair painting holds its partner's face too, as the set '<frame>__<speaker>' (Vasco in pair_vasco_card:
  // 'pair_vasco_card__vasco'); a partner's line, spoken through Alan's actor (speech.js actorFor), moves only that face
  const partners = new Map();
  function partnerSets(key, any) {
    const src = any ? (window.FACES || {}) : FACES, ck = key + (any ? '|any' : '');
    if (!partners.has(ck)) partners.set(ck, Object.keys(src).filter(k => k.startsWith(key + '__')).map(k => [k, src[k], k.slice(key.length + 2)]));
    return partners.get(ck);
  }
  // the frame `key` as painted, or with the actor's mouth and eyelids laid in (a canvas the size of the painting)
  function faceImage(a, key, im, any) {
    // a frame repainted on the review page (its sprite's src) keeps only the sets cut from that same painting
    const src = E.SPRITES[key] && E.SPRITES[key].src, fits = S => !src || S.src === src;
    let D = FACES[key] || (any && (window.FACES || {})[key]); // any: the rig's head uses its base frame's set, approved or not
    if (D && !fits(D)) D = null;
    if (window.FAST || !im || !im.naturalWidth) return im;
    const P = partnerSets(key, any).filter(p => fits(p[1])), self = a === E.player ? a.ch : null; // Alan's own face moves only to his own lines; anyone else's to whatever they say
    const sets = (D ? [[key, D, self]] : []).concat(P);
    if (!sets.length) return im;
    if (a.faceAt !== E.time) { // once a frame, whichever paintings are up
      a.faceAt = E.time; a.faceM = mouthOf(a); a.faceWho = a.faceM ? (a.talkWho || a.ch) : null; a.faceL = {};
    }
    const layers = [];
    for (const [k, S, who] of sets) {
      want(k);
      const own = k === key, lidAt = own ? 'blink' : 'blink_' + who;
      if (!(lidAt in a.faceL)) a.faceL[lidAt] = lidOf(a, lidAt);
      const talks = own ? a.faceWho && (who === null || who === a.faceWho) && !P.some(p => p[2] === a.faceWho) : a.faceWho === who;
      const m = talks && mouthFor(S, a.faceM), mn = m ? k + '_' + m : null; // only the speaker's own face talks
      const l = a.faceL[lidAt], lid = l && (S.eyes.includes(l) ? l : S.eyes.includes('closed') ? 'closed' : null); // no half-shut painting: shut for the whole blink
      const ln = lid ? k + '_eyes_' + lid : null;
      const mp = mn && patch(mn), lp = ln && patch(ln);
      if (mp || lp) layers.push([S.box, mp, lp, (mp ? mn : '') + '|' + (lp ? ln : '')]);
    }
    if (!layers.length) return im;
    const ck = key + '|' + layers.map(l => l[3]).join('|');
    let cv = cache.get(ck);
    if (cv) { cache.delete(ck); cache.set(ck, cv); } // (most recent last: the oldest goes first)
    if (!cv) {
      // each entry is a full-size canvas (a megabyte or more): keep the 24 most recent, not 120 (a phone's canvas memory)
      while (cache.size >= 24) cache.delete(cache.keys().next().value);
      cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight;
      const c = cv.getContext('2d');
      c.drawImage(im, 0, 0);
      // the lower face replaces the box, so no painted lips show under it; eyes after every mouth (two faces close together
      // in a pair painting can share some of a box)
      for (const [[x, y, w, h], mp] of layers) if (mp) { c.clearRect(x, y, w, h); c.drawImage(mp, x, y, w, h); }
      for (const [[x, y, w, h], , lp] of layers) if (lp) c.drawImage(lp, x, y, w, h);
      cache.set(ck, cv);
    }
    return cv;
  }

  Object.assign(E, { faceImage, preloadFaces: preload });
  if (document.readyState === 'complete') setTimeout(preload, 0); else window.addEventListener('load', () => setTimeout(preload, 0));
})();
