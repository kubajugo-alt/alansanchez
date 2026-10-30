// Skeletal Alan (trial): his side view cut into parts (scripts/rig_cut.py, art/rigs/alan/side/), each bent
// through the mesh (js/warp.js) with soft joints, posed from data, and drawn into one canvas that the actor then
// lights and breathes like any painting. The legs are solved from where the feet must be (two-bone IK), so a
// planted foot stays where it was put while the walk carries him on. Switch: Engine.rigOn(ch), set per character
// by ?rig=1 / ?rig=0 or localStorage 'rig-<ch>' = '1'; the frame-based figure stays the default.
(function () {
  const E = window.Engine;
  const { IMG } = E;
  const TAU = Math.PI * 2;
  const M = { x: 150, top: 40, bottom: 12 }; // room round the base painting for limbs that swing out
  const RIGS = {};                            // ch -> { def, im: {part: Image}, cv, g }

  function rigOn(ch) {
    const q = new URLSearchParams(location.search).get('rig');
    if (q === '0' || q === '1') return q === '1' && !!RIGS[ch];
    try { return localStorage.getItem('rig-' + ch) === '1' && !!RIGS[ch]; } catch (e) { return false; }
  }
  async function load(ch, dir) {
    const def = await fetch(dir + 'rig.json').then(r => r.json());
    const im = {};
    await Promise.all(Object.keys(def.parts).map(k => new Promise(res => { const i = new Image(); i.onload = res; i.onerror = res; i.src = dir + k + '.png'; im[k] = i; })));
    const [W, H] = def.size, cv = document.createElement('canvas');
    cv.width = W + 2 * M.x; cv.height = H + M.top + M.bottom;
    // the parts packed side by side in one texture (uploaded once; again only when his face changes)
    const atlas = document.createElement('canvas'), at = {};
    atlas.width = Object.values(def.parts).reduce((s, p) => s + p.w + 2, 0); atlas.height = Math.max(...Object.values(def.parts).map(p => p.h));
    let ax = 0; for (const k of Object.keys(def.parts)) { at[k] = ax; atlas.getContext('2d').drawImage(im[k], ax, 0); ax += def.parts[k].w + 2; }
    while (!E.SPRITES[def.base]) await new Promise(r => setTimeout(r, 100)); // the engine hands over the frame list at boot
    RIGS[ch] = { def, im, cv, g: cv.getContext('2d'), atlas, at, ver: 1 };
    // a sprite like any other, so placing, lighting, shadows and room scale all work as they do for frames
    const sp = E.SPRITES[def.base];
    E.SPRITES['rig:' + ch] = Object.assign({}, sp, { w: cv.width, hh: cv.height, ax: sp.ax + M.x, fy: sp.fy + M.top, top: sp.top + M.top, rigid: false });
    IMG['spr:rig:' + ch] = cv;
  }

  // ---------------------------------------------------------------- geometry
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], len = v => Math.hypot(v[0], v[1]), ang = v => Math.atan2(v[1], v[0]);
  const rot = (p, c, a) => { const s = Math.sin(a), k = Math.cos(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * k - y * s, c[1] + x * s + y * k]; };
  const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  // a point's place along a chain of joints: which bone it follows, blended softly across each joint
  function chainWeights(p, J, soft) {
    // project onto the chain: the position along it (in joint units, 0 at the root)
    let best = 1e9, s = 0;
    for (let i = 0; i < J.length - 1; i++) {
      const d = sub(J[i + 1], J[i]), L = len(d), t = Math.max(0, Math.min(1, ((p[0] - J[i][0]) * d[0] + (p[1] - J[i][1]) * d[1]) / (L * L)));
      const q = [J[i][0] + d[0] * t, J[i][1] + d[1] * t], e = len(sub(p, q));
      if (e < best) { best = e; s = i + t; }
    }
    // weight of each bone past the first: how far past its joint (soft = blend half-width in joint units)
    return J.slice(1, -1).map((_, i) => ss(i + 1 - soft[i], i + 1 + soft[i], s));
  }
  // a limb: the root moves rigidly (T0), each joint after it turns its bone and everything below
  function limbFn(J, angles, base, soft) {
    // positions of the joints once posed
    const P = [base(J[0])];
    let acc = 0;
    const turns = [];
    for (let i = 0; i < J.length - 1; i++) {
      acc += angles[i];
      turns.push(acc);
      const d = sub(J[i + 1], J[i]);
      P.push([P[i][0] + d[0] * Math.cos(acc) - d[1] * Math.sin(acc), P[i][1] + d[0] * Math.sin(acc) + d[1] * Math.cos(acc)]);
    }
    return p => {
      const w = chainWeights(p, J, soft);
      // the point carried by each bone: its offset from the bone's joint, turned by the bone's total angle
      const by = i => { const o = sub(p, J[i]), a = turns[i]; return [P[i][0] + o[0] * Math.cos(a) - o[1] * Math.sin(a), P[i][1] + o[0] * Math.sin(a) + o[1] * Math.cos(a)]; };
      let q = by(0);
      for (let i = 1; i < J.length - 1; i++) { const r = by(i); q = [q[0] + (r[0] - q[0]) * w[i - 1], q[1] + (r[1] - q[1]) * w[i - 1]]; }
      return q;
    };
  }
  // two-bone IK: the turns at hip and knee (from the painted pose) that put the ankle at A, knee forward
  function ik(hip, knee, ankle, H, A, kneeFwd) {
    const L1 = len(sub(knee, hip)), L2 = len(sub(ankle, knee));
    let d = sub(A, H), D = len(d);
    const Dm = (L1 + L2) * 0.999;
    if (D > Dm) { d = [d[0] * Dm / D, d[1] * Dm / D]; D = Dm; }
    const a0 = ang(d), c = Math.max(-1, Math.min(1, (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D)));
    const thigh = a0 - kneeFwd * Math.acos(c);                        // the knee points the way he faces
    const kneeP = [H[0] + L1 * Math.cos(thigh), H[1] + L1 * Math.sin(thigh)];
    const shin = ang(sub(A, kneeP));
    const t0 = ang(sub(knee, hip)), s0 = ang(sub(ankle, knee));
    return [thigh - t0, (shin - s0) - (thigh - t0)];
  }

  // ---------------------------------------------------------------- poses
  const STEP = 175;          // a step on the ground (base px); a stride is two
  const STANCE = 0.6;        // of each leg's cycle, its foot is down
  const LIFT = 26;           // how high the swinging foot clears the floor
  const ns = (t, s) => Math.sin(t * 1.0 + s) * 0.6 + Math.sin(t * 0.37 + s * 2.1) * 0.4; // slow, never-repeating drift
  function legPose(_, u) {
    // u: this leg's cycle (0 = heel down in front). Stance: the foot stays put while the hip passes over it
    const reach = STEP * 0.6;
    if (u < STANCE) {
      const k = u / STANCE;
      return { x: reach - 2 * reach * k, y: 0, foot: k < 0.15 ? -0.18 * (1 - k / 0.15) : k > 0.75 ? 0.6 * ss(0.75, 1, k) : 0 };
    }
    const k = (u - STANCE) / (1 - STANCE), e = k * k * (3 - 2 * k);
    return { x: -reach + 2 * reach * e, y: -LIFT * Math.sin(Math.PI * k) * (k < 0.5 ? 1 : 0.8), foot: 0.6 * (1 - ss(0, 0.45, k)) + (-0.18) * ss(0.6, 1, k) };
  }
  // the pose for an actor now: walking (u: strides) or standing (t: seconds), blended by w (1 = walking).
  // Angles turn from the painted pose (radians, + clockwise on screen); he faces right.
  function pose(R, st) {
    const P = {}, u = st.u % 1, t = st.t, w = st.w;
    // walking: the near heel goes down at u = 0, the far one half a stride later
    const nearW = legPose(null, u), farW = legPose(null, (u + 0.5) % 1);
    // standing: feet a little apart, the weight drifting from one to the other, never quite repeating
    const shift = 3.2 * ns(t * 0.55, st.seed), sway = ns(t * 0.8, st.seed + 3);
    const nearS = { x: 12, y: 0, foot: 0 }, farS = { x: -4, y: 0, foot: 0 };
    const mix = (a, b) => ({ x: a.x + (b.x - a.x) * w, y: a.y + (b.y - a.y) * w, foot: a.foot + (b.foot - a.foot) * w });
    P.near = mix(nearS, nearW); P.far = mix(farS, farW);
    // the hips ride lowest with both feet down, highest over the planted one; when still they carry the weight shift
    P.hipX = shift * (1 - w); P.hipY = (1 - w) * (0.8 * sway - 7) + w * (0.5 + 7.5 * Math.cos(TAU * 2 * u)); // legs near straight when still; walking, lowest with both feet down
    // the body leans into the walk; the shoulders follow the hips a beat late; a slow settle when still
    P.lean = w * (0.04 + 0.012 * Math.sin(TAU * 2 * u - 0.6)) + (1 - w) * 0.01 * sway;
    // arms swing against the legs, the far one later and smaller (never mirror images); when still they hang
    const sN = Math.cos(TAU * (u - 0.06)), sF = Math.cos(TAU * (u - 0.1));
    const hang = 0.02 * ns(t * 0.7, st.seed + 1);
    P.nearArm = [w * (-0.1 + 0.42 * sN) + (1 - w) * (-0.2 + hang), w * (-0.08 - 0.25 * Math.max(0, -sN)) + (1 - w) * -0.05, 0];
    P.farArm = [w * (-0.1 - 0.34 * sF) + (1 - w) * (-0.16 - hang), w * (-0.08 - 0.22 * Math.max(0, sF)) + (1 - w) * -0.08, 0]; // the near arm's painting, hung from the far shoulder
    // the head keeps the eyes level against the lean and drifts a little when still
    P.head = -P.lean * 0.7 + (1 - w) * 0.025 * ns(t * 0.45, st.seed + 7) + (st.talk || 0);
    return P;
  }

  // ---------------------------------------------------------------- drawing
  function render(R, P) {
    const { def, im, cv, g } = R, B = def.bones, [W, H] = def.size;
    const ground = 698;                                               // the floor line of the base painting
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
    // the body: hips moved, everything above turning about them
    const hip0 = B.torso.hip, hipP = [hip0[0] + P.hipX, hip0[1] + P.hipY];
    const body = p => rot([p[0] + P.hipX, p[1] + P.hipY], hipP, P.lean);
    const neckP = body(B.torso.neck);
    const torsoFn = p => {
      const q = body(p), k = ss(B.torso.neck[1] + 14, B.torso.neck[1] - 8, p[1]);   // the head turns on the neck
      return k > 0 ? (r => [q[0] + (r[0] - q[0]) * k, q[1] + (r[1] - q[1]) * k])(rot(q, neckP, P.head)) : q;
    };
    // legs: hips follow the pelvis (not the lean); each ankle goes where the walk puts it
    const leg = (name, L) => {
      const b = B[name], h = [b.hip[0] + P.hipX, b.hip[1] + P.hipY];
      // the ankle: L.x from where the painting has this hip, at ankle height off the floor (lifted by L.y)
      const A = [b.hip[0] + L.x, ground - 66 + L.y];
      const [aHip, aKnee] = ik(b.hip, b.knee, b.ankle, h, A, 1);
      // the foot: level on the floor while planted (whatever the painting had), rolled by the walk
      const flat = 0.405, painted = ang(sub(b.toe, b.ankle));
      const aFoot = (flat + L.foot) - painted - aHip - aKnee;
      const f = limbFn([b.hip, b.knee, b.ankle, b.toe], [aHip, aKnee, aFoot], () => h, [0.09, 0.12]);
      // above the hip joint (under the jacket) the leg goes with the pelvis, so a swung thigh never pokes out behind
      return p => { const q = f(p), k = ss(b.hip[1] - 15, b.hip[1] + 60, p[1]) * ss(b.hip[0] - 40, b.hip[0] + 10, p[0]) + ss(b.hip[1] + 10, b.hip[1] + 60, p[1]) * (1 - ss(b.hip[0] - 40, b.hip[0] + 10, p[0])); return [p[0] + P.hipX + (q[0] - p[0] - P.hipX) * k, p[1] + P.hipY + (q[1] - p[1] - P.hipY) * k]; };
    };
    const arm = (name, A) => {
      const b = B[name], s = body(b.shoulder);
      const turn = P.lean + A[0];
      const f = limbFn([b.shoulder, b.elbow, b.wrist, [b.wrist[0] + (b.wrist[0] - b.elbow[0]) * 0.4, b.wrist[1] + (b.wrist[1] - b.elbow[1]) * 0.4]], [turn, A[1], A[2]], () => s, [0.12, 0.1]);
      // the top of the sleeve stays on the shoulder (with the body); the arm swings below it
      return p => { const q = f(p), r = body(p), k = ss(b.shoulder[1] - 30, b.shoulder[1] + 25, p[1]); return [r[0] + (q[0] - r[0]) * k, r[1] + (q[1] - r[1]) * k]; };
    };
    const FN = { torso: torsoFn, near_leg: leg('near_leg', P.near), far_leg: leg('far_leg', P.far), near_arm: arm('near_arm', P.nearArm), far_arm: arm('far_arm', P.farArm) };
    const meshes = def.order.map(k => { const p = def.parts[k], f = FN[k];
      return { sx: R.at[k], sy: 0, sw: p.w, sh: p.h, ox: p.x + M.x, oy: p.y + M.top, fn: (x, y) => { const q = f([x + p.x, y + p.y]); return [q[0] - p.x, q[1] - p.y]; } }; });
    if (!(window.Warp && Warp.drawMany && Warp.drawMany(g, R.atlas, 'rig:' + R.ver, meshes, cv.width, cv.height)))
      for (const k of def.order) { const p = def.parts[k]; g.drawImage(R.atlas, R.at[k], 0, p.w, p.h, p.x + M.x, p.y + M.top, p.w, p.h); } // no WebGL: the parts unbent
  }

  // the actor's rig, posed for now; returns the canvas (its sprite image)
  function draw(a) {
    const R = RIGS[a.ch];
    if (!R) return null;
    const st = a.rigS || (a.rigS = { u: 0, t: Math.random() * 50, w: 0, seed: Math.random() * 10, last: E.time });
    const dt = Math.max(0, Math.min(0.1, E.time - st.last)); st.last = E.time; st.t += dt;
    st.w += ((a.walking ? 1 : 0) - st.w) * Math.min(1, dt * (a.walking ? 7 : 4));   // into the walk quickly, settles out of it
    if (!a.walking && st.w < 0.02) st.u = 0;
    st.talk = a.talking ? 0.02 * Math.sin(st.t * 5.3) * (a.lvl || 0) : 0;                  // small head moves with the voice
    // the face (lip-sync, blinking) goes into the head before it is bent, as on a painted frame
    const base = IMG['spr:' + R.def.base], faced = E.faceImage ? E.faceImage(a, R.def.base, base, true) : base;
    if (faced !== R.faced) { // a new mouth or eyelid: the torso in the atlas gets it
      R.faced = faced;
      const p = R.def.parts.torso, ag = R.atlas.getContext('2d'), x = R.at.torso;
      ag.clearRect(x, 0, p.w, R.atlas.height); ag.drawImage(R.im.torso, x, 0);
      if (faced !== base) { ag.save(); ag.beginPath(); ag.rect(x, 0, p.w, p.h); ag.clip(); ag.globalCompositeOperation = 'source-atop'; ag.drawImage(faced, x - p.x, -p.y); ag.restore(); }
      R.ver++;
    }
    render(R, pose(R, st));
    return R.cv;
  }
  // ground covered by one stride, as a fraction of his height (the actor advances u by it)
  const strideOf = ch => { const R = RIGS[ch], sp = R && E.SPRITES[R.def.base]; return sp ? 2 * STEP / (sp.fy - sp.top) : 0.3; };

  Object.assign(E, { rigOn, rigLoad: load, rigDraw: draw, rigStride: strideOf });
  // loaded only where it is switched on (the review screen's comparison, or a player who chose it)
  const wanted = ch => { const q = new URLSearchParams(location.search).get('rig'); if (q) return q === '1'; try { return localStorage.getItem('rig-' + ch) === '1'; } catch (e) { return false; } };
  if (wanted('alan')) load('alan', 'art/rigs/alan/side/');
})();
