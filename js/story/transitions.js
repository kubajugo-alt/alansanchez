// The Drowned Bell — chapter transitions and the fado slideshow.
// At the end of each chapter, before the next chapter card: two or three paintings, each with one narrator
// line, a slow pan and a cross-fade into the next (about twenty seconds, skippable with Esc or the Skip button;
// a click or Space moves on to the next painting). During Amália's fado the room gives way to eight paintings
// of the legend, timed to the stanzas, with the English captions running over them; the live taberna comes
// back for the final refrain.
// Paintings that are not on disk are left out; with none, the old cut straight to the card plays.
(function () {
  const S = window.S, { G, F } = S;
  const fast = () => !!window.FAST;
  const T = ms => G.wait(fast() ? 20 : ms);

  // ---------------------------------------------------------------- the paintings
  // [still, narrator line, pan from → to (centre of view, 0..1), zoom from → to]
  const L2R = [[0.42, 0.5], [0.58, 0.5]], R2L = [[0.58, 0.5], [0.42, 0.5]], UP = [[0.5, 0.58], [0.5, 0.42]], DOWN = [[0.5, 0.42], [0.5, 0.58]];
  const IN = [1.06, 1.16], OUT = [1.16, 1.06];
  S.TRANSITIONS = {
    1: [['still_tr1_maria', 'narr_tr1_1', L2R, IN], ['still_tr1_list', 'narr_tr1_2', DOWN, IN], ['still_tr1_se_fog', 'narr_tr1_3', UP, OUT]],
    2: [['still_tr2_lavadouro', 'narr_tr2_1', R2L, IN], ['still_tr2_tideclock', 'narr_tr2_2', UP, IN], ['still_tr2_ines', 'narr_tr2_3', L2R, OUT]],
    3: [['still_tr3_bells', 'narr_tr3_1', UP, IN], ['still_tr3_tomas', 'narr_tr3_2', L2R, IN], ['still_tr3_case', 'narr_tr3_3', R2L, OUT]],
    4: [['still_tr4_boat', 'narr_tr4_1', L2R, IN], ['still_tr4_shop', 'narr_tr4_2', R2L, IN], ['still_tr4_machine', 'narr_tr4_3', DOWN, IN]],
    5: [['still_tr5_cistern', 'narr_tr5_1', UP, IN], ['still_tr5_dawn', 'narr_tr5_2', L2R, OUT], ['still_tr5_receiver', 'narr_tr5_3', R2L, IN]],
  };
  // O Sino Afogado: [seconds into the recording, painting] (S.SINO_LYRICS in ch1.js has the sung lines);
  // null brings back the live room for the final refrain
  S.FADO_SLIDES = [
    [14.0, 'still_fado_harbour', L2R],     // intro, into "Nine days the fog lies over the river, over the quay"
    [27.2, 'still_fado_widow', R2L],       // "nine nights the bronze sleeps where no one hears it any more"
    [35.8, 'still_fado_cistern', UP],      // "The founders, out of fear, cut out its tongue one day"
    [42.8, 'still_fado_pour', DOWN],       // "and bound it with the blood that ran in their veins"
    [50.0, 'still_fado_lowering', DOWN],   // first chorus: "Oh, my bell-founder love, don't speak to me of your bell"
    [66.5, 'still_fado_fog', L2R],         // "for I know the sea is long, and your blood is your fate"
    [79.5, 'still_fado_wave', R2L],        // "Where the Carmo prays without a roof, the stone weeps cold salt" (1755)
    [101.5, 'still_fado_alfama', L2R],     // "turn the letters seven times, son of the bronze and the river" … "ring it backward"
    [125.5, null],                         // the final refrain: back to the taberna
  ];
  window.EXTRA_STILLS = (window.EXTRA_STILLS || []).concat(
    ...Object.values(S.TRANSITIONS).map(l => l.map(s => s[0])), S.FADO_SLIDES.map(s => s[1]).filter(Boolean));

  // ---------------------------------------------------------------- skip
  // Esc or the Skip button ends the whole transition; a click or Space only ends the current line (engine)
  let skipAll = null;
  const btn = document.createElement('button');
  btn.id = 'tr-skip'; btn.textContent = 'Skip ›'; btn.title = 'Skip (Esc)';
  btn.style.cssText = 'position:absolute;right:2.2%;bottom:3.2%;z-index:30;display:none;background:rgba(10,8,6,.55);color:#e0c890;'
    + 'border:1px solid rgba(224,184,102,.45);border-radius:4px;padding:.35em .9em;font:inherit;font-size:.95em;letter-spacing:.08em;cursor:pointer';
  btn.onclick = e => { e.stopPropagation(); if (skipAll) skipAll(); };
  btn.onpointerdown = e => e.stopPropagation();
  (document.getElementById('game') || document.body).appendChild(btn);
  document.addEventListener('keydown', e => { if (skipAll && e.key === 'Escape') skipAll(); }, true);

  // ---------------------------------------------------------------- chapter transitions
  // Plays the paintings that close chapter n. Returns true when the last painting is still up (the chapter
  // card covers it and S.chapter lets it go); with opts.toBlack, or when the screen was black before,
  // it ends on black instead.
  S.transition = async function (n, opts) {
    opts = opts || {};
    const shots = (S.TRANSITIONS[n] || []).filter(([k]) => G.image('still:' + k));
    if (!shots.length) return false;
    const fadeEl = document.getElementById('fade'), wasBlack = !!(fadeEl && fadeEl.classList.contains('on'));
    let skipped = false, current = null, onSkip = null;
    const skipP = new Promise(r => { onSkip = r; });
    G.cutscene = true;
    // MUSIC HOOK (js/audio.js, music agent): chapter transition starts → "Main Theme, low"
    if (window.Sound && Sound.transitionMusic) try { Sound.transitionMusic(true, n); } catch (e) { /* music is optional */ }
    btn.style.display = 'block';
    skipAll = () => { skipped = true; onSkip(); };
    try {
      for (let i = 0; i < shots.length && !skipped; i++) {
        const [name, line, pan, zoom] = shots[i];
        G.stillTo(name, { cross: i > 0, dur: 9, pan, zoom, rate: i > 0 ? 1.6 : 2.2, vignette: 0.5 });
        if (i === 0 && wasBlack) await G.fade(false);
        await Promise.race([T(i === 0 ? 900 : 1100), skipP]);
        if (skipped) break;
        let said = false; current = G.say(line, { offscreen: true }).then(() => { said = true; });
        await Promise.race([Promise.all([current, T(5600)]), skipP]);
        if (said) current = null;
      }
    } finally {
      // a skipped line may still be closing: let it finish so it never talks over the card
      if (current) {
        let over = false; current.then(() => { over = true; });
        while (!over) { if (G.skipLine) G.skipLine(); await G.wait(120); }
      }
      skipAll = null; btn.style.display = 'none';
      if (window.Sound && Sound.transitionMusic) try { Sound.transitionMusic(false, n); } catch (e) { /* music is optional */ }
      // MUSIC HOOK end: the transition is over here (the chapter card, or the dawn, follows)
      G.cutscene = false;
    }
    if (opts.toBlack || wasBlack) { await G.fade(true); G.endStill(); await T(300); return false; }
    if (opts.release) { G.endStill(); await T(800); return false; }
    await T(500);
    return true; // the last painting stays up under the chapter card
  };

  // ---------------------------------------------------------------- the fado slideshow
  // Runs alongside G.lyrics(song, S.SINO_LYRICS): follows the recording's clock, cross-fades on the stanzas,
  // and gives the room back for the final refrain. Returns { stop } (stop() is safe to call twice).
  S.fadoSlides = function (song) {
    const slides = S.FADO_SLIDES.filter(([, k]) => !k || G.image('still:' + k));
    if (!song || !song.el || slides.length < 2 || fast()) return null;
    let shown = -1, live = false, stopped = false;
    const tick = setInterval(() => {
      if (stopped) return;
      const t = song.el.currentTime; let k = -1;
      slides.forEach(([at], i) => { if (t >= at) k = i; });
      if (k === shown || k < 0) return;
      shown = k;
      const [, name, pan] = slides[k];
      if (!name) { live = true; G.endStill(); return; }
      G.stillTo(name, { cross: true, rate: 1.4, dur: Math.max(8, ((slides[k + 1] || [t + 12])[0]) - slides[k][0] + 2), pan, zoom: [1.05, 1.15], vignette: 0.5 });
    }, 100);
    return { stop() { if (stopped) return; stopped = true; clearInterval(tick); if (!live && shown >= 0) G.endStill(); } };
  };
})();
