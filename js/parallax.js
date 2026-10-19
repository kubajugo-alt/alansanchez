// The Drowned Bell — parallax (a trial, off unless the address has ?parallax): a room painting with a depth map
// (art/bg/<room>_depth.png, white = near; scripts/depth_map.py) is drawn through a shader that slides each pixel
// by its depth as a gentle virtual camera drifts with Alan, so the near pillars move more than the far garth.
// Everything else drawn into the scene (figures, painted layers, the furniture cut out in front of them) is moved
// by the depth at its own feet with Parallax.at(x, y), so it stays planted on the floor it stands on.
window.Parallax = (function () {
  const W = 1280, H = 720;
  const Z = 1.022;          // a slight zoom, so the edges never come into view
  const D0 = 0.45;          // the depth that holds still: nearer slides one way, farther the other
  let cv = null, gl = null, prog = null, tBg = null, tD = null, bgIm = null, dIm = null, failed = false, U = {};
  let dData = null, dFor = null;
  const cam = { x: 0, y: 0 };
  const on = /[?&]parallax\b/.test(location.search);

  function init() {
    if (gl || failed) return !!gl;
    try {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      gl = cv.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: true });
      if (!gl) throw new Error('no webgl');
      const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*0.5+0.5,0.5-p.y*0.5);gl_Position=vec4(p,0.,1.);}'));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, [
        'precision mediump float;varying vec2 v;uniform sampler2D s,d;uniform vec2 uC;uniform float uZ,uD0;',
        'void main(){vec2 q=(v-0.5)/uZ+0.5;',
        // where this screen pixel comes from: its offset depends on the depth found there, so look twice
        ' vec2 o=uC*(texture2D(d,q).r-uD0);o=uC*(texture2D(d,q-o).r-uD0);',
        ' gl_FragColor=texture2D(s,clamp(q-o,0.0005,0.9995));}'].join('')));
      gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const p = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['s', 'd', 'uC', 'uZ', 'uD0']) U[n] = gl.getUniformLocation(prog, n);
      gl.uniform1i(U.s, 0); gl.uniform1i(U.d, 1);
      const tex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
        return t; };
      tBg = tex(); tD = tex();
      return true;
    } catch (e) { console.info('Parallax off:', e.message); failed = true; gl = null; return false; }
  }
  const upload = (t, unit, im) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); };
  // the depth map read back once, for Parallax.at
  function depthData(im) {
    if (dFor === im) return dData;
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    x.drawImage(im, 0, 0, W, H); dData = x.getImageData(0, 0, W, H).data; dFor = im; return dData;
  }
  const depthAt = (x, y) => { if (!dData) return D0; const X = Math.max(0, Math.min(W - 1, x | 0)), Y = Math.max(0, Math.min(H - 1, y | 0)); return dData[(Y * W + X) * 4] / 255; };

  // the camera: a few pixels across the room with Alan, and a slow sway of its own
  const AMP = 14;
  function update(dt, t, px) {
    const tx = -AMP * Math.max(-1, Math.min(1, ((px == null ? W / 2 : px) - W / 2) / (W / 2))) + 1.6 * Math.sin(t * 0.21);
    const ty = 1.1 * Math.sin(t * 0.17 + 1.3);
    const k = Math.min(1, dt * 1.4); cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
  }
  // the painting, slid by depth (null when there's no depth map or no WebGL: the caller draws it flat)
  function draw(bg, depth) {
    if (!on || !bg || !depth || !init()) return null;
    if (bg !== bgIm) { upload(tBg, 0, bg); bgIm = bg; }
    if (depth !== dIm) { upload(tD, 1, depth); dIm = depth; depthData(depth); }
    gl.viewport(0, 0, W, H);
    gl.uniform2f(U.uC, cam.x / W, cam.y / H); gl.uniform1f(U.uZ, Z); gl.uniform1f(U.uD0, D0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tBg); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tD);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return cv;
  }
  // where a scene point lands on screen: the zoom, and the slide for the depth at (dx, dy) (its feet)
  function at(x, y, dx, dy) {
    const d = depthAt(dx == null ? x : dx, dy == null ? y : dy);
    return [(x + cam.x * (d - D0) - W / 2) * Z + W / 2, (y + cam.y * (d - D0) - H / 2) * Z + H / 2];
  }
  // a canvas transform that moves everything drawn under it as the depth at (fx, fy) moves
  function apply(g, fx, fy) {
    const d = fx == null ? D0 : depthAt(fx, fy);
    g.translate(W / 2, H / 2); g.scale(Z, Z); g.translate(-W / 2 + cam.x * (d - D0), -H / 2 + cam.y * (d - D0));
  }
  // screen -> scene (clicks), the zoom undone at the depth of the floor there
  const unzoom = (x, y) => [(x - W / 2) / Z + W / 2, (y - H / 2) / Z + H / 2];
  return { on, update, draw, at, apply, unzoom, cam, depthAt, get active() { return on && !!gl && !!dIm; } };
})();
