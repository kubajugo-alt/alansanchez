// The Drowned Bell — mesh warp: a painted frame drawn through a fine grid whose vertices
// can be displaced, so a single painting can breathe, sway, nod and bob smoothly (GPU, WebGL).
// Warp.draw() returns false when WebGL is unavailable and the caller draws the frame flat.
window.Warp = (function () {
  const COLS = 10, ROWS = 26;
  let cv = null, gl = null, prog = null, pbuf, tbuf, ibuf, tex, uRes, nIdx = 0, ready = false, failed = false;
  let pos = null, uv = null;
  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function init() {
    if (ready || failed) return ready;
    try {
      cv = document.createElement('canvas'); cv.width = 512; cv.height = 1024;
      gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: true, depth: false, stencil: false });
      if (!gl) throw new Error('no webgl');
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p;attribute vec2 t;uniform vec2 r;varying vec2 v;void main(){v=t;gl_Position=vec4(p.x/r.x*2.0-1.0,1.0-p.y/r.y*2.0,0.0,1.0);}'));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec2 v;uniform sampler2D s;void main(){gl_FragColor=texture2D(s,v);}'));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
      uRes = gl.getUniformLocation(prog, 'r');
      pbuf = gl.createBuffer(); tbuf = gl.createBuffer(); ibuf = gl.createBuffer();
      const idx = [];
      for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
        const a = j * (COLS + 1) + i, b = a + 1, c = a + COLS + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
      nIdx = idx.length;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
      pos = new Float32Array((COLS + 1) * (ROWS + 1) * 2); uv = new Float32Array(pos.length);
      const lp = gl.getAttribLocation(prog, 'p'), lt = gl.getAttribLocation(prog, 't');
      gl.bindBuffer(gl.ARRAY_BUFFER, pbuf); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, tbuf); gl.enableVertexAttribArray(lt); gl.vertexAttribPointer(lt, 2, gl.FLOAT, false, 0, 0);
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
      ready = true;
    } catch (e) { failed = true; console.warn('Warp disabled:', e.message || e); }
    return ready;
  }
  // src: canvas holding the frame at (0,0)-(sw,sh). fn(x, y) -> [x', y'] in the same pixel space.
  // Drawn to g with the source origin at (dx, dy); pad is the room the displacement may need.
  function draw(g, src, sw, sh, dx, dy, fn, pad) {
    if (window.WARP === false || !init()) return false;
    pad = Math.ceil(pad);
    const W = Math.ceil(sw) + pad * 2, H = Math.ceil(sh) + pad * 2;
    if (cv.width < W || cv.height < H) { cv.width = Math.max(cv.width, W); cv.height = Math.max(cv.height, H); }
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform2f(uRes, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    const tw = src.width, th = src.height;
    let k = 0;
    for (let j = 0; j <= ROWS; j++) {
      const y = sh * j / ROWS;
      for (let i = 0; i <= COLS; i++) {
        const x = sw * i / COLS, q = fn(x, y);
        pos[k] = q[0] + pad; pos[k + 1] = q[1] + pad; uv[k] = x / tw; uv[k + 1] = y / th; k += 2;
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, pbuf); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, tbuf); gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);
    gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
    g.drawImage(cv, 0, 0, W, H, dx - pad, dy - pad, W, H);
    return true;
  }
  return { draw, get ok() { return init(); } };
})();
