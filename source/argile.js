// ================= LOOK « PÂTE À MODELER » (argile.js) =================
// Se colle APRÈS la construction du monde (base.js + world*.js + story) et AVANT explore.js.
// Ne change pas le plan de la ville : il arrondit et cabosse les formes, ajoute la neige
// qui tombe des sapins, la fumée des cheminées, un bonhomme de neige, des traces de pas
// et de traîneau, un ciel en dégradé avec coucher de soleil et fenêtres qui s'allument.
// Tout est fait en code. À appeler dans la boucle : clayUpdate(t) juste avant renderer.render().
//  - site : clayUpdate(t) fait tourner le cycle jour → coucher de soleil → nuit (CLAY.cycle secondes)
//  - vidéo : clayUpdate(t, { sky: false }) garde l'éclairage choisi par lightAt() et l'habille
const CLAY = (() => {
  const q = new URLSearchParams(location.search);
  const video = typeof window.renderAt === 'function';
  const low = !video && (matchMedia('(pointer:coarse)').matches || Math.min(screen.width, screen.height) < 700);
  const heure = q.get('heure'); // jour | soir | nuit : fige l'heure (pratique pour les captures)
  return { video, low, heure, cycle: 300, night: 0 };
})();

// ---------- 1. formes arrondies et un peu cabossées ----------
const CLAY_GEO = new Map();
function clayNoise(x, y, z, s) {
  return Math.sin(x * 2.3 + s) * Math.sin(y * 2.9 + s * 1.7) * Math.sin(z * 2.1 + s * 0.6) + 0.5 * Math.sin(x * 5.1 - y * 3.7 + z * 4.3 + s * 2.3);
}
function clayBoxGeo(w, h, d, variant) {
  const key = w.toFixed(3) + ',' + h.toFixed(3) + ',' + d.toFixed(3) + ',' + variant;
  let g = CLAY_GEO.get(key); if (g) return g;
  const m = Math.min(w, h, d);
  const r = Math.min(0.24, m * 0.32);
  g = new THREE.BoxGeometry(w, h, d, 3, 3, 3);
  const P = g.attributes.position.array, U = g.attributes.uv.array, N = g.attributes.normal.array;
  const half = [w / 2, h / 2, d / 2], inner = half.map((v) => v - r);
  // a) les lignes intérieures de la grille glissent vers le bord : bande de biseau de largeur r
  for (let i = 0; i < P.length; i += 3) for (let a = 0; a < 3; a++) { const c = P[i + a]; if (Math.abs(c) < half[a] - 1e-5) P[i + a] = Math.sign(c) * inner[a]; }
  // b) UV recalculés pour que les textures (enseignes, visages) ne se déforment pas
  for (let f = 0; f < 6; f++) {
    const o = f * 16, ax = (k) => P[(o + k) * 3], axis = (k0, k1) => { for (let a = 0; a < 3; a++) if (Math.abs(P[(o + k0) * 3 + a] - P[(o + k1) * 3 + a]) > 1e-6) return a; return 0; };
    const Au = axis(0, 1), Av = axis(0, 4);
    for (let k = 0; k < 16; k++) {
      const ix = k % 4, iy = (k - ix) / 4, row0 = iy * 4, col0 = ix;
      const u0 = P[(o + row0) * 3 + Au], u1 = P[(o + row0 + 3) * 3 + Au];
      const v0 = P[(o + col0) * 3 + Av], v1 = P[(o + col0 + 12) * 3 + Av];
      U[(o + k) * 2] = (P[(o + k) * 3 + Au] - u0) / (u1 - u0);
      U[(o + k) * 2 + 1] = 1 - (P[(o + k) * 3 + Av] - v0) / (v1 - v0);
    }
    void ax;
  }
  // c) coins arrondis + bosses de pâte (mêmes valeurs pour les sommets dupliqués)
  const amp = Math.min(0.03, r * 0.16), s = variant * 3.1 + 1;
  for (let i = 0; i < P.length; i += 3) {
    const x = P[i], y = P[i + 1], z = P[i + 2];
    const cx = clamp(x, -inner[0], inner[0]), cy = clamp(y, -inner[1], inner[1]), cz = clamp(z, -inner[2], inner[2]);
    let ox = x - cx, oy = y - cy, oz = z - cz; const L = Math.hypot(ox, oy, oz);
    let nx = N[i], ny = N[i + 1], nz = N[i + 2];
    if (L > 1e-6) { nx = ox / L; ny = oy / L; nz = oz / L; }
    const k = r + amp * clayNoise(x, y, z, s);
    if (L > 1e-6) { P[i] = cx + nx * k; P[i + 1] = cy + ny * k; P[i + 2] = cz + nz * k; }
    else { const b = amp * clayNoise(x, y, z, s); P[i] += nx * b; P[i + 1] += ny * b; P[i + 2] += nz * b; }
    N[i] = nx; N[i + 1] = ny; N[i + 2] = nz;
  }
  g.computeBoundingBox(); g.computeBoundingSphere();
  CLAY_GEO.set(key, g); return g;
}
function clayLumpy(geo, amp, s) { // pour les boules (fumée, roches, neige) : surface bosselée
  const P = geo.attributes.position.array;
  // géométrie non indexée : on fusionne les sommets pour un ombrage doux (pas de facettes)
  geo.deleteAttribute('normal'); geo.deleteAttribute('uv');
  const g2 = THREE.BufferGeometryUtils ? THREE.BufferGeometryUtils.mergeVertices(geo) : clayMerge(geo);
  const Q = g2.attributes.position.array;
  for (let i = 0; i < Q.length; i += 3) { const x = Q[i], y = Q[i + 1], z = Q[i + 2]; const k = 1 + amp * clayNoise(x * 2, y * 2, z * 2, s); Q[i] = x * k; Q[i + 1] = y * k; Q[i + 2] = z * k; }
  g2.computeVertexNormals(); return g2;
}
function clayMerge(geo) { // fusionne les sommets identiques (comme BufferGeometryUtils.mergeVertices)
  const P = geo.attributes.position.array, map = new Map(), out = [], idx = [];
  for (let i = 0; i < P.length; i += 3) { const k = Math.round(P[i] * 1e4) + ',' + Math.round(P[i + 1] * 1e4) + ',' + Math.round(P[i + 2] * 1e4); let j = map.get(k); if (j === undefined) { j = out.length / 3; map.set(k, j); out.push(P[i], P[i + 1], P[i + 2]); } idx.push(j); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.setIndex(idx); return g;
}
// texture de relief : petites traces de doigts dans la pâte
const clayBump = texCanvas(256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h);
  let sd = 11; const R = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  for (let i = 0; i < 260; i++) {
    const x = R() * w, y = R() * h, rr = 6 + R() * 26, v = R() < 0.5 ? 255 : 0;
    const gr = ctx.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(${v},${v},${v},0.10)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
    ctx.fillStyle = gr; for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) { ctx.save(); ctx.translate(dx, dy); ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill(); ctx.restore(); }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 1.2;
  for (let i = 0; i < 40; i++) { const x = R() * w, y = R() * h; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(x, y, 4 + k * 3.5, R() * 3, R() * 3 + 2.4); ctx.stroke(); } }
});
clayBump.colorSpace = THREE.NoColorSpace; clayBump.wrapS = clayBump.wrapT = THREE.RepeatWrapping;

function clayify(root) {
  let n = 0; const seen = new Set();
  root.traverse((o) => {
    if (!o.isMesh || o.userData.noClay || o === ground) return;
    const g = o.geometry, p = g.parameters || {};
    if (g.type === 'BoxGeometry' && !g.userData.clay) {
      if (Math.max(p.width, p.height, p.depth) < (CLAY.low ? 0.3 : 0.12)) return;
      const ng = clayBoxGeo(p.width, p.height, p.depth, (n++) % 3); ng.userData.clay = true;
      g.dispose(); o.geometry = ng;
    } else if (!CLAY.low && (g.type === 'CylinderGeometry' || g.type === 'ConeGeometry') && p.radialSegments >= 5 && p.radialSegments < 12) {
      const ng = g.type === 'ConeGeometry' ? new THREE.ConeGeometry(p.radius, p.height, 12, 1, p.openEnded) : new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, 14, 1, p.openEnded, p.thetaStart, p.thetaLength);
      g.dispose(); o.geometry = ng;
    } else if (!CLAY.low && (g.type === 'IcosahedronGeometry' || g.type === 'DodecahedronGeometry') && p.detail === 0) {
      const ng = clayLumpy(new THREE.IcosahedronGeometry(p.radius, 1), g.type === 'DodecahedronGeometry' ? 0.12 : 0.05, n++ % 5);
      g.dispose(); o.geometry = ng;
    }
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of ms) {
      if (!m || seen.has(m) || !m.isMeshLambertMaterial) continue; seen.add(m);
      if (!CLAY.low && !m.transparent) { m.bumpMap = clayBump; m.bumpScale = 0.9; m.needsUpdate = true; }
    }
  });
}
clayify(scene);

// ---------- 2. sol de neige avec des congères (relief juste dans l'éclairage, le sol reste plat) ----------
{
  const S = CLAY.low ? 90 : 160;
  const gg = new THREE.PlaneGeometry(600, 600, S, S); const P = gg.attributes.position.array, N = gg.attributes.normal.array;
  const col = new Float32Array(P.length);
  const hgt = (x, y) => Math.sin(x * 0.21) * Math.cos(y * 0.17) * 0.6 + Math.sin(x * 0.07 + y * 0.11) * 1.2 + Math.sin(x * 0.53 - y * 0.47) * 0.25;
  for (let i = 0; i < P.length; i += 3) {
    const x = P[i], y = P[i + 1], e = 0.5;
    const dx = (hgt(x + e, y) - hgt(x - e, y)) / (2 * e), dy = (hgt(x, y + e) - hgt(x, y - e)) / (2 * e);
    const L = Math.hypot(dx * 0.5, dy * 0.5, 1); N[i] = -dx * 0.5 / L; N[i + 1] = -dy * 0.5 / L; N[i + 2] = 1 / L;
    const k = clamp(0.5 + hgt(x, y) * 0.18, 0, 1);
    col[i] = lerp(0.86, 1.0, k); col[i + 1] = lerp(0.9, 1.0, k); col[i + 2] = 1.0;
  }
  gg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  ground.geometry.dispose(); ground.geometry = gg;
  ground.material = new THREE.MeshLambertMaterial({ color: 0xf6f8fc, vertexColors: true });
}

// ---------- 3. toits enneigés + cheminées qui fument ----------
const clayChimneys = [];
const clayGlass = new THREE.MeshLambertMaterial({ color: 0x6f86a8, emissive: 0x000000 });
{
  const roofs = []; scene.traverse((o) => { if (o.isMesh && o.geometry.type === 'CylinderGeometry' && o.geometry.parameters.radialSegments === 4 && o.geometry.parameters.radiusTop < 0.05) roofs.push(o); });
  const snowM = new THREE.MeshLambertMaterial({ color: 0xfbfcff, bumpMap: CLAY.low ? null : clayBump, bumpScale: 0.6 });
  const brick = mat(0x9c4a3a), capC = mat(0x5a4a44);
  roofs.forEach((r, i) => {
    const p = r.geometry.parameters, k = 0.58;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.01, p.radiusBottom * k * 1.06, p.height * k * 1.03, 4, 1), snowM);
    cap.rotation.copy(r.rotation); cap.scale.copy(r.scale);
    cap.position.copy(r.position); cap.position.y += (p.height * (1 - k) / 2) * r.scale.y + 0.03; cap.userData.noClay = true;
    r.parent.add(cap);
    const wall = r.parent.children.find((c) => c.isMesh && c.geometry.type === 'BoxGeometry' && Math.abs(c.position.x) < 0.01 && Math.abs(c.position.z) < 0.01);
    if (wall && !CLAY.noWin) {
      const wp = wall.geometry.parameters;
      if (wp.height > 2 && wp.height < 6 && wp.depth > 2.4) for (const sx of [-1, 1]) for (const zz of [-0.24, 0.24]) {
        const fr = new THREE.Mesh(clayBoxGeo(0.12, 0.95, 0.95, 1), mat(0xf4f1ea)); fr.position.set(sx * (wp.width / 2 + 0.03), wp.height * 0.56, zz * wp.depth); r.parent.add(fr);
        const gl = new THREE.Mesh(clayBoxGeo(0.12, 0.7, 0.7, 2), clayGlass); gl.position.set(sx * (wp.width / 2 + 0.07), wp.height * 0.56, zz * wp.depth); r.parent.add(gl);
      }
    }
    const R = p.radiusBottom * Math.max(r.scale.x, r.scale.z);
    if (R > 7 || clayChimneys.length > 46 || r.userData.noChimney) return;
    const H = p.height * r.scale.y, top = r.position.y + H / 2;
    const cx = r.position.x + R * 0.3 * (i % 2 ? 1 : -1) * 0.7, cz = r.position.z - R * 0.22;
    const ch = new THREE.Group(); ch.position.set(cx, top - H * 0.55, cz); r.parent.add(ch);
    const hh = H * 0.75 + 0.5;
    const b = new THREE.Mesh(clayBoxGeo(0.55, hh, 0.55, i % 3), brick); b.position.y = hh / 2; b.castShadow = true; ch.add(b);
    const c = new THREE.Mesh(clayBoxGeo(0.72, 0.16, 0.72, 1), capC); c.position.y = hh; ch.add(c);
    const s = new THREE.Mesh(clayBoxGeo(0.6, 0.1, 0.6, 2), snowM); s.position.y = hh + 0.11; ch.add(s);
    ch.userData.top = hh + 0.2; clayChimneys.push(ch);
  });
  // la cheminée de l'hôtel de ville fume aussi
  scene.traverse((o) => { if (o.isMesh && o.material === mat(0xa4473a) && o.geometry.parameters && o.geometry.parameters.height > 2 && o.geometry.parameters.width < 1.5) { const g = new THREE.Group(); o.parent.add(g); g.position.copy(o.position); g.userData.top = o.geometry.parameters.height / 2 + 0.3; clayChimneys.push(g); } });
}
const SMOKE_PER = CLAY.low ? 4 : 6;
const claySmoke = new THREE.InstancedMesh(clayLumpy(new THREE.IcosahedronGeometry(0.42, 1), 0.12, 2), new THREE.MeshLambertMaterial({ color: 0xeef0f4 }), clayChimneys.length * SMOKE_PER);
claySmoke.frustumCulled = false; claySmoke.userData.noClay = true; scene.add(claySmoke);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _e = new THREE.Euler();
const chimTop = clayChimneys.map(() => new THREE.Vector3());
function smokeAt(t) {
  let k = 0;
  clayChimneys.forEach((ch, ci) => {
    const w = chimTop[ci]; if (!w.userData) { ch.updateWorldMatrix(true, false); w.set(0, ch.userData.top, 0).applyMatrix4(ch.matrixWorld); w.userData = 1; }
    const vis = ch.parent && clayVisible(ch);
    for (let i = 0; i < SMOKE_PER; i++) {
      const ph = (t * 0.22 + i / SMOKE_PER + ci * 0.137) % 1;
      const sc = vis ? Math.sin(Math.min(1, ph * 1.15) * Math.PI) * (0.55 + ph * 1.3) : 0.0001;
      _v.set(w.x + Math.sin(ph * 5 + ci) * 0.3 + ph * 1.6, w.y + ph * 4.2, w.z + Math.cos(ph * 4 + ci) * 0.25 + ph * 0.8);
      _q.setFromEuler(_e.set(ph * 2 + i, ph * 3 + ci, 0)); _s.setScalar(sc);
      claySmoke.setMatrixAt(k++, _m4.compose(_v, _q, _s));
    }
  });
  claySmoke.instanceMatrix.needsUpdate = true;
}
function clayVisible(o) { for (let p = o; p; p = p.parent) { if (!p.visible) return false; if (p.scale.y < 0.05) return false; } return true; }

// ---------- 4. sapins qui laissent tomber leur neige ----------
const clayTrees = [];
scene.traverse((o) => { if (o.isMesh && (o.geometry.type === 'ConeGeometry') && (o.material === mat(0x2f7a3e)) && o.parent && o.parent !== scene && !clayTrees.includes(o.parent)) clayTrees.push(o.parent); });
const DROP_SLOTS = CLAY.low ? 5 : 9, DROP_BALLS = 7;
const clayDrops = new THREE.InstancedMesh(clayLumpy(new THREE.IcosahedronGeometry(0.2, 1), 0.15, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }), DROP_SLOTS * DROP_BALLS);
clayDrops.frustumCulled = false; scene.add(clayDrops);
const treeBase = clayTrees.map((g) => ({ rx: g.rotation.x, rz: g.rotation.z }));
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function treeDropAt(t, cam) {
  const near = []; for (let i = 0; i < clayTrees.length; i++) { const g = clayTrees[i]; if (!clayVisible(g)) continue; const p = g.getWorldPosition(_v); const d = Math.hypot(p.x - cam.x, p.z - cam.z); if (d < 45) near.push(i); g.rotation.z = treeBase[i].rz; g.rotation.x = treeBase[i].rx; }
  let k = 0; const P = 3.4;
  for (let j = 0; j < DROP_SLOTS; j++) {
    const tt = t + j * P / DROP_SLOTS, c = Math.floor(tt / P), ph = (tt / P) - c;
    const ok = near.length > 0;
    const ti = ok ? near[Math.floor(hash(c * 7.13 + j * 3.7) * near.length)] : -1;
    const g = ti >= 0 ? clayTrees[ti] : null;
    let base = null, s = 1;
    if (g) { base = g.getWorldPosition(new THREE.Vector3()); s = g.scale.y; if (ph < 0.25) { const sh = Math.sin(ph * 60) * 0.05 * (1 - ph * 4); g.rotation.z = treeBase[ti].rz + sh; g.rotation.x = treeBase[ti].rx + sh * 0.6; } }
    for (let b = 0; b < DROP_BALLS; b++) {
      if (!g || ph > 0.62) { _s.setScalar(0.0001); clayDrops.setMatrixAt(k++, _m4.compose(_v.set(0, -5, 0), _q.identity(), _s)); continue; }
      const a = hash(c * 3.1 + b * 1.7 + j) * Math.PI * 2, rr = (0.8 + hash(b + c) * 1.2) * s, h0 = (3.2 + hash(b * 9 + j) * 1.8) * s;
      const f = clamp((ph - 0.05 - b * 0.012) / 0.4); const y = Math.max(0.12, h0 - 9.8 * Math.pow(f * 1.3, 2) * 1.2);
      const land = y <= 0.13; const sc = land ? 0.9 * (1 - clamp((ph - 0.45) / 0.17)) * (1.2 + hash(b) * 0.6) : 0.8 + hash(b * 5) * 0.6;
      _v.set(base.x + Math.cos(a) * rr * (1 + f * 0.5), y, base.z + Math.sin(a) * rr * (1 + f * 0.5));
      _s.set(sc * (land ? 1.6 : 1), sc * (land ? 0.45 : 1), sc * (land ? 1.6 : 1));
      clayDrops.setMatrixAt(k++, _m4.compose(_v, _q.identity(), _s));
    }
  }
  clayDrops.instanceMatrix.needsUpdate = true;
}

// ---------- 5. bonhomme de neige (il regarde la caméra) + traîneau ----------
const snowman = new THREE.Group(); snowman.position.set(-6.6, 0, 17.4); scene.add(snowman);
{
  const sm = new THREE.MeshLambertMaterial({ color: 0xfbfcff, bumpMap: CLAY.low ? null : clayBump, bumpScale: 1 });
  const ball = (r, y, s) => { const m = new THREE.Mesh(clayLumpy(new THREE.IcosahedronGeometry(r, CLAY.low ? 2 : 3), 0.05, s), sm); m.position.y = y; m.castShadow = true; m.receiveShadow = true; snowman.add(m); return m; };
  ball(1.05, 0.9, 1); ball(0.78, 2.35, 2);
  const head = new THREE.Group(); head.position.y = 3.45; snowman.add(head); snowman.userData.head = head;
  const hb = new THREE.Mesh(clayLumpy(new THREE.IcosahedronGeometry(0.55, CLAY.low ? 2 : 3), 0.05, 3), sm); hb.castShadow = true; head.add(hb);
  const coal = mat(0x222226);
  for (const x of [-0.19, 0.19]) { const e = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), coal); e.position.set(x, 0.12, 0.49); head.add(e); }
  for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.45; const e = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 1), coal); e.position.set(Math.sin(a) * 0.27, -0.16 - Math.cos(a) * 0.08, 0.47); head.add(e); }
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.6, 10), mat(0xf07c2a)); nose.rotation.x = Math.PI / 2; nose.position.set(0, 0, 0.78); head.add(nose);
  // tuque rouge + pompon
  const tq = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.5, 0.55, 14), mat(0xd8262b)); tq.position.y = 0.55; head.add(tq);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 18), mat(0xf7f7f7)); rim.rotation.x = Math.PI / 2; rim.position.y = 0.32; head.add(rim);
  const pp = new THREE.Mesh(clayLumpy(new THREE.IcosahedronGeometry(0.17, 1), 0.1, 6), mat(0xffffff)); pp.position.y = 0.92; head.add(pp);
  // foulard ceinture fléchée
  const sc = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.13, 8, 20), new THREE.MeshLambertMaterial({ map: sashTex })); sc.rotation.x = Math.PI / 2; sc.position.y = 2.95; snowman.add(sc);
  const tail = new THREE.Mesh(clayBoxGeo(0.28, 0.75, 0.1, 2), new THREE.MeshLambertMaterial({ map: sashTex })); tail.position.set(0.35, 2.55, 0.55); tail.rotation.z = 0.2; snowman.add(tail);
  // bras en branches
  const wood = mat(0x6b4a2f);
  for (const sx of [-1, 1]) { const a = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.5, 6), wood); a.position.set(sx * 1.25, 2.6, 0); a.rotation.z = sx * -1.0; snowman.add(a); const f = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.4, 5), wood); f.position.set(sx * 1.75, 3.05, 0); f.rotation.z = sx * -0.3; snowman.add(f); }
  for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 1), coal); b.position.set(0, 2.15 + i * 0.27, 0.76 - Math.abs(i - 1) * 0.03); snowman.add(b); }
}
// traîneau de bois au bout des traces
const sled = new THREE.Group(); sled.position.set(-11.5, 0, 19); sled.rotation.y = 0.9; scene.add(sled);
{
  const wd = mat(0xb5793f), rn = mat(0xc7302e);
  for (let i = 0; i < 4; i++) box(0.28, 0.08, 1.9, wd, -0.48 + i * 0.32, 0.42, 0, sled);
  box(1.3, 0.08, 0.25, wd, 0, 0.36, -0.6, sled); box(1.3, 0.08, 0.25, wd, 0, 0.36, 0.6, sled);
  for (const sx of [-0.55, 0.55]) { box(0.08, 0.08, 2.2, rn, sx, 0.08, -0.05, sled); box(0.08, 0.36, 0.08, rn, sx, 0.22, -0.6, sled); box(0.08, 0.36, 0.08, rn, sx, 0.22, 0.6, sled); const c = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 6, 12, Math.PI / 2), rn); c.position.set(sx, 0.3, 1.05); c.rotation.y = Math.PI / 2; sled.add(c); }
}
clayify(sled);

// ---------- 6. traces de pas et de traîneau dans la neige ----------
{
  const prints = [], tracks = [];
  const path = (pts, step, fn) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, z0] = pts[i], [x1, z1] = pts[i + 1]; const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.floor(L / step)); for (let k = 0; k < n; k++) { const f = k / n; fn(lerp(x0, x1, f), lerp(z0, z1, f), Math.atan2(x1 - x0, z1 - z0), prints.length + tracks.length); } } };
  const foot = (x, z, a, i) => { const side = i % 2 ? 1 : -1; prints.push([x + Math.cos(a) * 0.18 * side, z - Math.sin(a) * 0.18 * side, a]); };
  // promeneurs autour du bonhomme et sur la place
  path([[-3.6, 14.6], [-4.6, 16], [-4.9, 19.2], [-6.6, 20.1], [-8.7, 19.4], [-9.2, 17], [-8, 15.3], [-5.8, 15.1]], 0.55, foot);
  path([[3.2, 22], [5.5, 18.5], [6.8, 15], [5.2, 12.8]], 0.55, foot);
  path([[-3.4, 25], [-6.2, 23.4], [-9.4, 21.6], [-11, 20.2]], 0.55, foot);
  // traces du traîneau : deux lignes parallèles
  const sledPath = [[-26, 30], [-21, 27.5], [-16.5, 23.4], [-13.2, 20.4], [-11.6, 19.1]];
  path(sledPath, 0.35, (x, z, a) => { for (const sx of [-0.55, 0.55]) tracks.push([x + Math.cos(a) * sx, z - Math.sin(a) * sx, a]); });
  const pm = new THREE.MeshLambertMaterial({ color: 0xc9d4e6, transparent: true, opacity: 0.75, depthWrite: false });
  const pg = new THREE.CircleGeometry(0.13, 10); pg.rotateX(-Math.PI / 2); pg.scale(1, 1, 1.9);
  const im = new THREE.InstancedMesh(pg, pm, prints.length);
  prints.forEach(([x, z, a], i) => im.setMatrixAt(i, _m4.compose(_v.set(x, 0.04, z), _q.setFromEuler(_e.set(0, a, 0)), _s.set(1, 1, 1))));
  scene.add(im);
  const tg = new THREE.PlaneGeometry(0.1, 0.42); tg.rotateX(-Math.PI / 2);
  const it = new THREE.InstancedMesh(tg, pm, tracks.length);
  tracks.forEach(([x, z, a], i) => it.setMatrixAt(i, _m4.compose(_v.set(x, 0.041, z), _q.setFromEuler(_e.set(0, a, 0)), _s.set(1, 1, 1))));
  scene.add(it);
}

// ---------- 7. flocons ronds en plus (gros, lents, près de la caméra) ----------
const BIGN = CLAY.low ? 90 : 180;
const bigGeo = new THREE.BufferGeometry(); const bigPos = new Float32Array(BIGN * 3); bigGeo.setAttribute('position', new THREE.BufferAttribute(bigPos, 3));
const bigSeed = []; for (let i = 0; i < BIGN; i++) bigSeed.push([rnd(), rnd(), rnd(), rnd()]);
const bigSnow = new THREE.Points(bigGeo, new THREE.PointsMaterial({ size: 0.2, map: flake, transparent: true, depthWrite: false, fog: true })); bigSnow.frustumCulled = false; scene.add(bigSnow);
function bigSnowAt(t, c) {
  for (let i = 0; i < BIGN; i++) {
    const [a, b, d, e] = bigSeed[i];
    bigPos[i * 3] = c.x + (a - 0.5) * 22 + Math.sin(t * 0.6 + e * 9) * 0.6;
    bigPos[i * 3 + 1] = c.y + 6 - (((d * 12) + t * (0.45 + e * 0.35)) % 12);
    bigPos[i * 3 + 2] = c.z + (b - 0.5) * 22 + Math.cos(t * 0.5 + a * 7) * 0.5;
  }
  bigGeo.attributes.position.needsUpdate = true;
}

// ---------- 8. ciel en dégradé, soleil bas, fenêtres qui s'allument ----------
const skyU = { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunC: { value: new THREE.Color() }, sunA: { value: 0 } };
const skyDome = new THREE.Mesh(new THREE.SphereGeometry(380, 24, 14), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: 'uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform vec3 sunC; uniform float sunA; varying vec3 vD; void main(){ float h = clamp(vD.y * 1.4, 0.0, 1.0); vec3 c = mix(bot, top, pow(h, 0.75)); float s = max(dot(normalize(vD), normalize(sunDir)), 0.0); c += sunC * (pow(s, 600.0) * 1.2 + pow(s, 12.0) * 0.35) * sunA; gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}'
}));
skyDome.renderOrder = -10; skyDome.frustumCulled = false; skyDome.userData.noClay = true; scene.add(skyDome);
const hemiL = scene.children.find((o) => o.isHemisphereLight);
const PAL = {
  jour: { top: 0x8db5de, bot: 0xe6edf4, hs: 0xf4f7ff, hg: 0x9aa4b8, hi: 1.35, sc: 0xfff4e6, si: 1.6, el: 0.95, night: 0 },
  dore: { top: 0x7f9ed2, bot: 0xffdcb0, hs: 0xffe8d0, hg: 0xa49ab0, hi: 1.2, sc: 0xffc48a, si: 1.55, el: 0.42, night: 0 },
  soir: { top: 0x46589a, bot: 0xff9c64, hs: 0xffc6a6, hg: 0x8f86a8, hi: 1.0, sc: 0xff8a4a, si: 1.15, el: 0.12, night: 0.55 },
  nuit: { top: 0x0a1230, bot: 0x2c3c70, hs: 0x8ea2e0, hg: 0x2a3050, hi: 0.72, sc: 0xa9bcff, si: 0.45, el: 0.85, night: 1 },
};
const KEYS = [[0, 'jour'], [0.5, 'jour'], [0.6, 'dore'], [0.69, 'soir'], [0.76, 'nuit'], [0.92, 'nuit'], [0.97, 'soir'], [1, 'jour']];
const _ca = new THREE.Color(), _cb = new THREE.Color();
function palMix(f) {
  if (CLAY.heure) { const m = { jour: 'jour', soir: 'soir', coucher: 'soir', dore: 'dore', nuit: 'nuit' }[CLAY.heure] || 'jour'; return [PAL[m], PAL[m], 0]; }
  for (let i = 0; i < KEYS.length - 1; i++) if (f >= KEYS[i][0] && f <= KEYS[i + 1][0]) { const k = (f - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0] || 1); return [PAL[KEYS[i][1]], PAL[KEYS[i + 1][1]], ease(k)]; }
  return [PAL.jour, PAL.jour, 0];
}
const mixC = (out, a, b, k) => out.copy(_ca.setHex(a)).lerp(_cb.setHex(b), k);
// fenêtres : vitres jaunes / textures de vitrines → elles brillent le soir
const clayWins = [];
{
  const seen = new Set(), hsl = {};
  scene.traverse((o) => {
    if (!o.isMesh) return; const ms = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of ms) {
      if (!m || seen.has(m) || !m.color || !(m.isMeshLambertMaterial || m.isMeshStandardMaterial)) continue;
      if (m.emissive && m.emissive.getHex() !== 0 && m.map) { seen.add(m); clayWins.push([m, m.emissive.clone(), 'tex']); continue; }
      const p = o.geometry.parameters || {};
      const thin = o.geometry.type === 'BoxGeometry' && Math.min(p.width, p.height, p.depth) < 0.22 && Math.max(p.width, p.height, p.depth) < 4;
      m.color.getHSL(hsl);
      if (thin && !m.map && ((hsl.h > 0.1 && hsl.h < 0.17 && hsl.s > 0.6 && hsl.l > 0.6) || (hsl.h > 0.5 && hsl.h < 0.58 && hsl.s > 0.35 && hsl.l > 0.68))) { seen.add(m); clayWins.push([m, m.emissive.clone(), 'col']); }
    }
  });
}
clayWins.push([clayGlass, new THREE.Color(0), 'glass']);
const warm = new THREE.Color(0xffb54a);
function windowsAt(night) {
  clayGlass.color.setHex(0x6f86a8).lerp(_cb.setHex(0x3a2a18), night);
  for (const [m, e0, kind] of clayWins) {
    if (kind === 'glass') { m.emissive.setHex(0xffb24a).multiplyScalar(night * 1.1); continue; }
    if (kind === 'tex') { m.emissive.copy(e0).lerp(_ca.setHex(0xffc870), night * 0.75); }
    else m.emissive.copy(e0).lerp(warm, night * 0.85);
  }
}
const sunDisc = new THREE.Vector3();
function skyAt(t, lookAt) {
  let night;
  if (CLAY.video) {
    // vidéo : l'éclairage vient de lightAt() → le ciel suit la couleur de fond
    const bg = scene.background; const L = bg.r * 0.3 + bg.g * 0.59 + bg.b * 0.11;
    skyU.bot.value.copy(bg); if (L < 0.3) skyU.top.value.copy(bg).multiplyScalar(0.45); else skyU.top.value.copy(bg).lerp(_ca.setHex(0x5f7fc0), 0.5);
    night = clamp((0.62 - L) / 0.4); skyU.sunA.value = 0;
  } else {
    const f = ((t / CLAY.cycle) + 0.12) % 1; const [a, b, k] = palMix(f);
    mixC(skyU.top.value, a.top, b.top, k); mixC(skyU.bot.value, a.bot, b.bot, k);
    scene.background.copy(skyU.bot.value); scene.fog.color.copy(skyU.bot.value);
    if (hemiL) { mixC(hemiL.color, a.hs, b.hs, k); mixC(hemiL.groundColor, a.hg, b.hg, k); hemiL.intensity = lerp(a.hi, b.hi, k); }
    mixC(sun.color, a.sc, b.sc, k); sun.intensity = lerp(a.si, b.si, k);
    const el = lerp(a.el, b.el, k), az = 0.65 + f * 1.4;
    sunDisc.set(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el));
    sun.position.set(lookAt.x + sunDisc.x * 60, Math.max(6, sunDisc.y * 60), lookAt.z + sunDisc.z * 60);
    skyU.sunDir.value.copy(sunDisc); skyU.sunC.value.copy(sun.color); skyU.sunA.value = 1 - lerp(a.night, b.night, k) * 0.6;
    night = lerp(a.night, b.night, k);
  }
  CLAY.night = night; windowsAt(night);
}

// ---------- 9. caméra cinéma (pour le mode 🎬 du site ou une vidéo) ----------
// clayCine(t, spots) → [position, cible]. Change de plan aux 6 s : plan large, travelling bas,
// grue qui monte, orbite, vue d'oiseau. spots = [{x, z}] (lieux à filmer).
const _cp = new THREE.Vector3(), _cl = new THREE.Vector3();
function clayCine(t, spots, shotLen = 6) {
  const n = Math.floor(t / shotLen), f = (t % shotLen) / shotLen, s = spots[Math.floor(hash(n * 1.37) * spots.length)] || { x: 0, z: 0 };
  const kind = n % 5, a0 = Math.PI / 2 + (hash(n * 2.9) - 0.5) * 1.8, F = (s.f || 6) * 0.5;
  if (kind === 0) { const a = a0 + f * 0.5; _cp.set(s.x + Math.cos(a) * 30, 14 - f * 3, s.z + Math.sin(a) * 30); _cl.set(s.x, 2, s.z); }
  else if (kind === 1) { const d = lerp(28, 15, ease(f)) + F; _cp.set(s.x + Math.cos(a0) * d, 1.3, s.z + Math.sin(a0) * d); _cl.set(s.x, 2.4, s.z); }
  else if (kind === 2) { _cp.set(s.x + Math.cos(a0) * (14 + F), lerp(1.5, 16, ease(f)), s.z + Math.sin(a0) * 14); _cl.set(s.x, lerp(2.5, 0, f), s.z); }
  else if (kind === 3) { const a = a0 - 0.8 + f * 1.6; _cp.set(s.x + Math.cos(a) * (12 + F), 4.5, s.z + Math.sin(a) * 12); _cl.set(s.x, 2.2, s.z); }
  else { _cp.set(s.x + lerp(-20, 20, f) * Math.cos(a0), 42, s.z + lerp(-20, 20, f) * Math.sin(a0) + 18); _cl.set(s.x, 0, s.z); }
  return [_cp, _cl];
}

// ---------- boucle ----------
const _look = new THREE.Vector3();
function clayUpdate(t, opts = {}) {
  _look.copy(sun.target.position);
  if (opts.sky !== false) skyAt(t, _look); else { CLAY.video = true; skyAt(t, _look); }
  skyDome.position.copy(camera.position);
  smokeAt(t); treeDropAt(t, camera.position); bigSnowAt(t, camera.position);
  const h = snowman.userData.head; const dx = camera.position.x - snowman.position.x, dz = camera.position.z - snowman.position.z;
  let want = Math.atan2(dx, dz); want = clamp(want, -1.2, 1.2); h.rotation.y = want; h.rotation.z = Math.sin(t * 0.9) * 0.05;
}
window.CLAY = CLAY;
window.__info = () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geos: renderer.info.memory.geometries });
