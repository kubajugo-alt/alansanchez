// The sea that moves (2026-10-30, the user: "the backgrounds with the sea should go through higgsfield - we need to
// animate the waves", "and others where the sea is visible through the windows"). Each painting with water in it has a
// Higgsfield loop of itself in which only the water moves (art/video/<bg>.mp4, .webm), cut down by scripts/sea_clips.py to the
// box where it moves, with a feathered mask (<bg>_mask.png); S.SEA (js/story/sea_clips.js) says where the box sits.
// A room's animBack calls S.sea(g, bg): the loop drawn through its mask over the painting. It returns false until the
// video can be drawn, so the room keeps its old canvas ripple and foam as the fallback meanwhile.
(function () {
  const vids = {};
  let off = null, drawn = 0;
  function get(key) {
    let v = vids[key];
    if (!v) {
      v = vids[key] = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.src = 'art/video/' + key + (v.canPlayType('video/mp4; codecs="avc1.640028"') ? '.mp4' : '.webm');   // (VP9 where there's no H.264)
      v.mask = new Image(); v.mask.src = 'art/video/' + key + '_mask.png';
    }
    return v;
  }
  S.sea = function (g, key) {
    const c = S.SEA && S.SEA[key];
    if (!c) return false;
    const v = get(key); drawn = performance.now();
    // only the loop on screen plays
    for (const k in vids) if (k !== key && !vids[k].paused) vids[k].pause();
    if (v.paused && !v.starting) { v.starting = true; v.play().catch(() => {}).then(() => { v.starting = false; }); }
    if (v.readyState < 2 || !v.mask.complete || !v.mask.naturalWidth) return false;
    const [x, y, w, h] = c;
    if (!off) off = document.createElement('canvas');
    if (off.width !== w || off.height !== h) { off.width = w; off.height = h; }
    const o = off.getContext('2d');
    o.globalCompositeOperation = 'copy'; o.drawImage(v, 0, 0, w, h);
    o.globalCompositeOperation = 'destination-in'; o.drawImage(v.mask, 0, 0, w, h);
    g.drawImage(off, x, y, w, h);
    return true;
  };
  // every frame (main.js, from each room's animFg): in a room without water, or under a still, nothing keeps playing
  S.seaTick = () => { if (performance.now() - drawn > 400) for (const k in vids) if (!vids[k].paused) vids[k].pause(); };
})();
