// The Drowned Bell — mesh warp: a painted frame drawn through a fine grid whose vertices
// can be displaced, so a single painting can breathe, sway, nod and bob smoothly (GPU, WebGL).
// Warp.draw() returns false when WebGL is unavailable and the caller draws the frame flat.
window.Warp = (function () {
  const COLS = 10, ROWS = 26;
  let cv = null, gl = null, prog = null, pbuf, tbuf, ibuf, tex, uRes, nIdx = 0, ready = false, failed = false;
  let pos = null, uv = null, U = {};
  // Lighting for painted figures: a surface direction is read off the silhouette (the gradient of the
  // alpha at two radii, so edges round off and broad shapes bulge), then each light shades the side
  // facing it in its own colour, catches the rim when it's behind, and the room colour and fog finish it.
  const FS = [
    'precision mediump float;varying vec2 v;uniform sampler2D s;',
    'uniform float uLit,uR,uKeySide,uFeet,uFig;uniform vec2 uTex;uniform vec3 uAmb;uniform vec4 uFog,uKey;',
    'uniform vec4 uLP[4];uniform vec3 uLC[4];',
    'float A(vec2 o){return texture2D(s,v+o/uTex).a;}',
    'void main(){vec4 c=texture2D(s,v);',
    ' if(uLit<0.5||c.a<0.004){gl_FragColor=c;return;}',
    ' vec3 col=c.rgb/c.a;float r1=uR,r2=uR*3.0;',
    ' float gx=(A(vec2(r1,0.))-A(vec2(-r1,0.)))*0.55+(A(vec2(r2,0.))-A(vec2(-r2,0.)))*0.45;',
    ' float gy=(A(vec2(0.,r1))-A(vec2(0.,-r1)))*0.55+(A(vec2(0.,r2))-A(vec2(0.,-r2)))*0.45;',
    ' vec3 N=normalize(vec3(-gx*1.6,-gy*1.6,0.6));vec2 p=v*uTex;',
    ' float ao=1.0-0.13*smoothstep(uFeet-uFig*0.25,uFeet,p.y);',
    ' vec3 lit=col*uAmb*(0.92+0.14*N.z)*ao;',
    ' for(int i=0;i<4;i++){float I=uLP[i].z;if(I<=0.0)continue;vec2 d=uLP[i].xy-p;',
    '  vec3 Ld=normalize(vec3(d,length(d)*0.5+uFig*0.25));float lam=max(0.0,dot(N,Ld))*0.62+0.38;',
    '  lit+=col*uLC[i]*I*lam*ao;',
    '  vec2 nd=N.xy/(length(N.xy)+1e-4);float edge=pow(clamp(1.0-N.z,0.0,1.0),1.1);',
    '  float rim=edge*max(0.0,dot(nd,normalize(d)));',
    '  lit=mix(lit,uLC[i]/max(0.001,max(uLC[i].r,max(uLC[i].g,uLC[i].b))),clamp(uLP[i].w*(rim*1.1+0.06),0.0,0.6));}',
    ' if(uKey.a>0.0){vec2 nd=N.xy/(length(N.xy)+1e-4);float k=pow(clamp(1.0-N.z,0.0,1.0),1.1)*max(0.0,nd.x*uKeySide);lit=mix(lit,uKey.rgb,uKey.a*(k*1.2+0.08));}',
    ' lit=mix(lit,uFog.rgb,uFog.a);',
    ' gl_FragColor=vec4(clamp(lit,0.0,1.0)*c.a,c.a);}',
  ].join('');
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
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
      uRes = gl.getUniformLocation(prog, 'r');
      for (const n of ['uLit', 'uR', 'uKeySide', 'uFeet', 'uFig', 'uTex', 'uAmb', 'uFog', 'uKey', 'uLP', 'uLC']) U[n] = gl.getUniformLocation(prog, n);
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
  // L (optional): lighting in source pixels { amb:[r,g,b], fog:[r,g,b,a], key:[r,g,b,a], keySide, feet, fig, lights:[{x,y,rgb:[r,g,b],I,rim}] }
  function draw(g, src, sw, sh, dx, dy, fn, pad, L) {
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
    gl.uniform1f(U.uLit, L ? 1 : 0);
    if (L) {
      gl.uniform2f(U.uTex, tw, th); gl.uniform1f(U.uR, Math.max(2, L.fig * 0.012)); gl.uniform1f(U.uFeet, L.feet); gl.uniform1f(U.uFig, L.fig);
      gl.uniform3fv(U.uAmb, L.amb); gl.uniform4fv(U.uFog, L.fog || [0, 0, 0, 0]); gl.uniform4fv(U.uKey, L.key || [0, 0, 0, 0]); gl.uniform1f(U.uKeySide, L.keySide || 1);
      const lp = new Float32Array(16), lc = new Float32Array(12);
      (L.lights || []).slice(0, 4).forEach((l, i) => { lp.set([l.x, l.y, l.I, l.rim], i * 4); lc.set(l.rgb, i * 3); });
      gl.uniform4fv(U.uLP, lp); gl.uniform3fv(U.uLC, lc);
    }
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
