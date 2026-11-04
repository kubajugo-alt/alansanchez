// Water that moves: Higgsfield video loops drawn through feathered masks onto the paintings (ported from Game II's
// sequel/js/story/sea.js, 2026-11-04). Each painting with water in it can have a loop of itself in which only the water
// moves (art/video/<key>.mp4, .webm), cut down by scripts/sea_clips.py to the box where it moves, with a feathered mask
// (<key>_mask.png); S.SEA (js/story/sea_clips.js) says where the box sits on the 1280x720 painting.
//
// A water room's animBack calls S.seaLoop(g, key): the loop drawn through its mask into the painting. It returns false
// while the room has no clip (S.SEA empty: as shipped) or until the video can be drawn, and the room keeps its old canvas
// shimmer as the fallback; an `anim` hook asks S.seaOn(key) whether the loop is showing this frame.
// (Named seaLoop, not Game II's S.sea: in this game S.sea is the notebook's "The Sea" page, js/story/bastos.js.)
// S.seaTick() pauses any loop not drawn in the last 400 ms (another room, a still over the room): main.js runs it.
(function () {
  const S = window.S;
  const vids = {}, shown = {};
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
  S.seaLoop = function (g, key) {
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
    shown[key] = drawn;
    return true;
  };
  // did the loop draw this frame (animBack runs before anim)? false whenever the room has no clip
  S.seaOn = key => !!(S.SEA && S.SEA[key]) && performance.now() - (shown[key] || -1e9) < 250;
  S.seaTick = () => { if (performance.now() - drawn > 400) for (const k in vids) if (!vids[k].paused) vids[k].pause(); };
})();
