import * as THREE from 'three';
await document.fonts.load('800 40px "Baloo 2"'); await document.fonts.load('900 40px "Nunito"'); await document.fonts.load('40px "Noto Color Emoji"');

// ---------- timeline ----------
const DUR = T.map((s) => s.dur);
const GAP = 0.35;
const START = []; { let t = 0; for (const d of DUR) { START.push(t); t += d + GAP; } }
const NS = DUR.length;
const TOTAL = START[NS - 1] + DUR[NS - 1] + 1.6;
window.TOTAL = TOTAL; window.START = START;

// ---------- renderer ----------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(540, 960, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe6ee);
scene.fog = new THREE.Fog(0xdfe6ee, 45, 130);
const camera = new THREE.PerspectiveCamera(50, 540 / 960, 0.1, 400);

scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x9aa4b8, 1.35));
const sun = new THREE.DirectionalLight(0xfff4e6, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera; sc.left = -28; sc.right = 28; sc.top = 28; sc.bottom = -28; sc.near = 1; sc.far = 120;
sun.shadow.bias = -0.0005;
scene.add(sun, sun.target);
function sunAt(x, z) { sun.position.set(x + 18, 40, z + 22); sun.target.position.set(x, 0, z); }

// ---------- helpers ----------
const matCache = {};
function mat(color, opts = {}) {
  const k = color + JSON.stringify(opts);
  if (!matCache[k]) matCache[k] = new THREE.MeshLambertMaterial({ color, ...opts });
  return matCache[k];
}
function box(w, h, d, m, x = 0, y = 0, z = 0, parent = scene) {
  const g = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(g, typeof m === 'number' ? mat(m) : m);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
  parent.add(mesh); return mesh;
}
function cyl(rt, rb, h, seg, m, x, y, z, parent = scene) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), typeof m === 'number' ? mat(m) : m);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function texCanvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function fitText(ctx, text, maxW, size, font = '"Baloo 2"') {
  let s = size; ctx.font = `800 ${s}px ${font}`;
  while (ctx.measureText(text).width > maxW && s > 10) { s -= 2; ctx.font = `800 ${s}px ${font}`; }
  return s;
}
function signTex(lines, { bg = '#f6f1e6', fg = '#222', w = 512, h = 256, border = '#5a3b22', band } = {}) {
  return texCanvas(w, h, (ctx) => {
    ctx.fillStyle = border; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = bg; ctx.fillRect(10, 10, w - 20, h - 20);
    if (band) { ctx.fillStyle = band.color; ctx.fillRect(10, h - 10 - band.h, w - 20, band.h); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const L of lines) {
      ctx.fillStyle = L.color || fg;
      fitText(ctx, L.t, w - 50, L.size);
      ctx.fillText(L.t, w / 2, L.y);
    }
  });
}
function plane(w, h, tex, x, y, z, ry = 0, parent = scene) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex, transparent: true }));
  m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
// seeded random
let seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

// ---------- ground ----------
const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat(0xf3f5f9));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
function patch(x, z, w, d, color = 0xb5946c) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color)); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, z); m.receiveShadow = true; scene.add(m); return m;
}
function puddle(x, z, r) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 6), mat(0xc9dde9)); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.035, z); scene.add(m);
}
// main dirt road through village
patch(0, 6, 5, 30); patch(-14, 4, 30, 4.5); patch(15, -1, 26, 4.5);
puddle(-0.8, 10, 0.9); puddle(1.2, 4, 0.7); puddle(-8, 4.5, 0.8); puddle(12, -1.3, 0.8);
for (let i = 0; i < 18; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25 + rnd() * 0.3, 0), mat(0x8a7560)); r.position.set(-2.8 + rnd() * 5.6 * (i % 2), 0.1, -2 + rnd() * 18); r.castShadow = true; scene.add(r); }

// ---------- trees ----------
function tree(x, z, s = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
  cyl(0.25, 0.3, 1.2, 6, 0x6b4a2f, 0, 0.6, 0, g);
  const layers = [[2.2, 2.4, 1.9], [1.75, 2.1, 3.3], [1.25, 1.9, 4.6]];
  for (const [r, h, y] of layers) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), mat(0x2f7a3e)); c.position.y = y; c.castShadow = true; g.add(c);
    const s2 = new THREE.Mesh(new THREE.ConeGeometry(r * 0.45, h * 0.42, 7), mat(0xf7f9fc)); s2.position.y = y + h * 0.3; g.add(s2);
  }
  return g;
}
for (let i = 0; i < 70; i++) {
  const a = rnd() * Math.PI * 2, d = 26 + rnd() * 40;
  const x = Math.cos(a) * d, z = Math.sin(a) * d - 10;
  const ex = [[-95, -48, -80, 30], [35, 110, -35, 35], [20, 70, -50, -20], [-58, 12, -22, 34], [-16, 16, 14, 56], [-46, -8, 6, 62], [5, 95, -54, -26], [-102, -50, -42, 12], [10, 78, -98, -56], [-84, -8, -98, -52], [-48, 28, -178, -102], [-44, -18, 38, 70], [14, 40, 16, 38], [-60, -30, -12, 22]];
  if (ex.some(([x0, x1, z0, z1]) => x > x0 && x < x1 && z > z0 && z < z1)) continue;
  tree(x, z, 0.9 + rnd() * 0.8);
}
[[-6, -14], [7, -15], [10, -12], [-4, -18], [4, -19], [12, -6], [9, -5.5]].forEach(([x, z]) => tree(x, z, 1 + rnd() * 0.5));
// ---------- character ----------
function faceTex(kind = 'smile', skin = '#f1c9a0', beard = false) {
  return texCanvas(128, 128, (ctx) => {
    ctx.fillStyle = skin; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#1b1b1b';
    if (kind === 'angry') {
      ctx.fillRect(30, 50, 16, 12); ctx.fillRect(82, 50, 16, 12);
      ctx.lineWidth = 7; ctx.strokeStyle = '#1b1b1b';
      ctx.beginPath(); ctx.moveTo(24, 36); ctx.lineTo(54, 46); ctx.moveTo(104, 36); ctx.lineTo(74, 46); ctx.stroke();
      ctx.beginPath(); ctx.arc(64, 100, 18, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else if (kind === 'sing') {
      ctx.fillRect(32, 46, 14, 8); ctx.fillRect(82, 46, 14, 8);
      ctx.beginPath(); ctx.ellipse(64, 88, 13, 17, 0, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'serious') {
      ctx.fillRect(34, 50, 12, 12); ctx.fillRect(82, 50, 12, 12);
      ctx.fillRect(46, 92, 36, 6);
    } else {
      ctx.fillRect(34, 46, 12, 16); ctx.fillRect(82, 46, 12, 16);
      ctx.lineWidth = 7; ctx.strokeStyle = '#1b1b1b';
      ctx.beginPath(); ctx.arc(64, 70, 26, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
    }
    if (beard) {
      ctx.fillStyle = '#5b3a24'; ctx.fillRect(0, 74, 128, 54); ctx.fillRect(0, 40, 14, 60); ctx.fillRect(114, 40, 14, 60);
      ctx.fillStyle = '#f1c9a0'; ctx.fillRect(40, 84, 48, 12);
      ctx.fillStyle = '#7a3b2a'; ctx.fillRect(46, 87, 36, 6);
    }
  });
}
function jerseyTex(name, num, color = '#1d4fa8') {
  return texCanvas(256, 256, (ctx) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 196, 256, 18); ctx.fillStyle = '#e0343b'; ctx.fillRect(0, 214, 256, 14);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#e0343b'; ctx.lineWidth = 6;
    fitText(ctx, name, 236, 46); ctx.strokeText(name, 128, 40); ctx.fillText(name, 128, 40);
    if (num !== '') { ctx.font = '800 120px "Baloo 2"'; ctx.strokeText(num, 128, 132); ctx.fillText(num, 128, 132); }
  });
}
function jerseyFront(color = '#1d4fa8') {
  return texCanvas(256, 256, (ctx) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 196, 256, 18); ctx.fillStyle = '#e0343b'; ctx.fillRect(0, 214, 256, 14);
    ctx.beginPath(); ctx.arc(128, 105, 62, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(128, 105, 52, 0, Math.PI * 2); ctx.fillStyle = '#e0343b'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 80px "Baloo 2"'; ctx.fillText('D', 128, 112);
  });
}
const sashTex = texCanvas(128, 32, (ctx) => {
  const cols = ['#d3312f', '#f2c230', '#2c6fd1', '#2e9b48', '#f07c2a'];
  for (let i = 0; i < 16; i++) { ctx.fillStyle = cols[i % 5]; ctx.beginPath(); ctx.moveTo(i * 10, 0); ctx.lineTo(i * 10 + 10, 0); ctx.lineTo(i * 10 - 6, 32); ctx.lineTo(i * 10 - 16, 32); ctx.fill(); }
});

function character(o = {}) {
  const g = new THREE.Group();
  const skin = o.skin || 0xf1c9a0;
  const shirt = o.shirt ?? 0x3a7bd5, pants = o.pants ?? 0x2a2f3d;
  const legL = box(0.46, 1.0, 0.46, pants, -0.25, 0.5, 0, g), legR = box(0.46, 1.0, 0.46, pants, 0.25, 0.5, 0, g);
  if (o.boots) { box(0.5, 0.25, 0.56, o.boots, -0.25, 0.12, 0.03, g); box(0.5, 0.25, 0.56, o.boots, 0.25, 0.12, 0.03, g); }
  // torso with per-face materials
  const tm = mat(shirt);
  const faces = [tm, tm, tm, tm, o.frontTex ? new THREE.MeshLambertMaterial({ map: o.frontTex }) : tm, o.backTex ? new THREE.MeshLambertMaterial({ map: o.backTex }) : tm];
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.05, 0.55), faces); torso.position.y = 1.52; torso.castShadow = true; g.add(torso);
  const armMat = o.arm ?? shirt;
  const armL = new THREE.Group(); armL.position.set(-0.72, 2.0, 0); g.add(armL); box(0.4, 1.0, 0.42, armMat, 0, -0.45, 0, armL); box(0.38, 0.2, 0.4, skin, 0, -1.02, 0, armL);
  const armR = new THREE.Group(); armR.position.set(0.72, 2.0, 0); g.add(armR); box(0.4, 1.0, 0.42, armMat, 0, -0.45, 0, armR); box(0.38, 0.2, 0.4, skin, 0, -1.02, 0, armR);
  const head = new THREE.Group(); head.position.y = 2.5; g.add(head);
  const hm = mat(skin);
  const ft = new THREE.MeshLambertMaterial({ map: faceTex(o.face || 'smile', '#' + new THREE.Color(skin).getHexString(), o.beard) });
  const bm = o.beard ? mat(0x5b3a24) : hm;
  const hd = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.82, 0.82), [o.beard ? bm : hm, o.beard ? bm : hm, hm, bm, ft, hm]); hd.position.y = 0.41; hd.castShadow = true; head.add(hd);
  if (o.hat === 'tuque') {
    box(0.9, 0.36, 0.9, o.hatColor ?? 0xd8262b, 0, 0.92, 0, head); box(0.92, 0.16, 0.92, 0xf7f7f7, 0, 0.76, 0, head);
    const p = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), mat(0xffffff)); p.position.y = 1.18; head.add(p);
  } else if (o.hat === 'helmet') {
    box(0.9, 0.34, 0.9, o.hatColor ?? 0x1d4fa8, 0, 0.92, 0, head); box(0.9, 0.08, 0.2, 0x222222, 0, 0.62, 0.42, head);
  } else if (o.hat === 'cap') {
    box(0.88, 0.25, 0.88, o.hatColor ?? 0x2e9b48, 0, 0.92, 0, head); box(0.88, 0.06, 0.45, o.hatColor ?? 0x2e9b48, 0, 0.82, 0.6, head);
  } else if (o.hat === 'hair') {
    box(0.88, 0.22, 0.88, o.hatColor ?? 0x6b4a2f, 0, 0.9, 0, head); box(0.88, 0.6, 0.18, o.hatColor ?? 0x6b4a2f, 0, 0.55, -0.38, head);
  } else if (o.hat === 'longhair') {
    box(0.9, 0.24, 0.9, o.hatColor, 0, 0.9, 0, head); box(0.92, 1.25, 0.25, o.hatColor, 0, 0.25, -0.38, head);
    box(0.14, 0.9, 0.7, o.hatColor, -0.46, 0.4, -0.05, head); box(0.14, 0.9, 0.7, o.hatColor, 0.46, 0.4, -0.05, head);
  }
  if (o.glasses) { box(0.25, 0.14, 0.04, 0x111111, -0.18, 0.5, 0.42, head); box(0.25, 0.14, 0.04, 0x111111, 0.18, 0.5, 0.42, head); }
  if (o.mayor) {
    // gold chain, buttons, sash
    const ch = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 6, 16, Math.PI), mat(0xd6a531)); ch.position.set(0, 1.85, 0.29); ch.rotation.z = Math.PI; g.add(ch);
    box(0.12, 0.12, 0.05, 0xd6a531, 0, 1.55, 0.29, g);
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.18, 0.6), new THREE.MeshLambertMaterial({ map: sashTex })); s.position.y = 1.15; g.add(s);
    box(0.12, 0.5, 0.05, 0xd3312f, 0.3, 0.88, 0.3, g);
    box(1.02, 0.12, 0.57, 0xc6262c, 0, 1.0, 0, g);
  }
  if (o.dress) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 1.2, 8), o.dress); d.position.y = 0.6; g.add(d); legL.visible = legR.visible = false; }
  g.userData = { armL, armR, head, legL, legR };
  if (o.pos) g.position.set(...o.pos);
  if (o.ry !== undefined) g.rotation.y = o.ry;
  (o.parent || scene).add(g);
  return g;
}
function anim(ch, t, mode = 'idle', ph = 0) {
  const u = ch.userData;
  u.head.rotation.y = Math.sin(t * 1.3 + ph) * 0.12;
  u.armL.rotation.x = 0; u.armR.rotation.x = 0; u.armL.rotation.z = 0; u.armR.rotation.z = 0;
  if (mode === 'wave') { u.armR.rotation.z = 2.5 + Math.sin(t * 9 + ph) * 0.35; }
  else if (mode === 'point') { u.armR.rotation.x = -1.45; u.armR.rotation.z = 0.15; }
  else if (mode === 'cheer') { u.armL.rotation.z = -2.6 - Math.sin(t * 8 + ph) * 0.3; u.armR.rotation.z = 2.6 + Math.sin(t * 8 + ph) * 0.3; ch.position.y = Math.abs(Math.sin(t * 6 + ph)) * 0.25; }
  else if (mode === 'fist') { u.armR.rotation.z = 2.8; u.armR.rotation.x = Math.sin(t * 12 + ph) * 0.25; u.head.rotation.x = -0.35; }
  else if (mode === 'sing') { u.armL.rotation.z = -1.9; u.armR.rotation.z = 1.9; u.head.rotation.x = -0.25; }
  else { u.armL.rotation.x = Math.sin(t * 2 + ph) * 0.08; u.armR.rotation.x = -Math.sin(t * 2 + ph) * 0.08; }
}

// ---------- town hall ----------
function hall() {
  const g = new THREE.Group(); g.position.set(-1, 0, -7); scene.add(g);
  box(10, 4.6, 6, 0xe9dcc4, 0, 2.3, 0, g);
  box(10.4, 0.5, 6.4, 0x8f8f96, 0, 0.25, 0, g);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 4.6, 3, 4, 1), mat(0xc7302e)); roof.rotation.y = Math.PI / 4; roof.scale.set(1.62, 1, 1.0); roof.position.y = 6.1; roof.castShadow = true; g.add(roof);
  box(11, 0.3, 7, 0xffffff, 0, 4.7, 0, g);
  box(1.0, 2.2, 1.0, 0xa4473a, 3, 7.2, -1, g); box(1.2, 0.3, 1.2, 0xffffff, 3, 8.35, -1, g);
  for (let i = 0; i < 14; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5 + (i % 3) * 0.25, 4), mat(0xd9eef9, { transparent: true, opacity: 0.85 })); c.rotation.x = Math.PI; c.position.set(-5 + i * 0.75, 4.3, 3.15); g.add(c); }
  plane(5, 0.8, signTex([{ t: 'HÔTEL DE VILLE', size: 70, y: 64 }], { w: 640, h: 128, bg: '#f4f1ea', border: '#333' }), 0, 4.05, 3.02, 0, g);
  box(2.4, 2.8, 0.15, 0xc5ccd6, 0, 1.9, 3.0, g);
  box(1.6, 1.4, 0.12, 0xf3d27a, -3.4, 2.6, 3.0, g); box(1.6, 1.4, 0.12, 0xf3d27a, 3.4, 2.6, 3.0, g);
  box(1.75, 0.12, 0.15, 0xc79a3a, -3.4, 2.6, 3.06, g); box(0.12, 1.5, 0.15, 0xc79a3a, -3.4, 2.6, 3.06, g);
  box(1.75, 0.12, 0.15, 0xc79a3a, 3.4, 2.6, 3.06, g); box(0.12, 1.5, 0.15, 0xc79a3a, 3.4, 2.6, 3.06, g);
}
hall();
// flag
const flagTex = texCanvas(300, 200, (ctx) => {
  ctx.fillStyle = '#0a3fa0'; ctx.fillRect(0, 0, 300, 200); ctx.fillStyle = '#fff'; ctx.fillRect(125, 0, 50, 200); ctx.fillRect(0, 75, 300, 50);
  ctx.font = '60px "Noto Color Emoji"'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '800 58px serif'; for (const [x, y] of [[62, 38], [238, 38], [62, 162], [238, 162]]) ctx.fillText('⚜', x, y + 4);
});
cyl(0.08, 0.1, 9, 8, 0x9aa0a8, 5, 4.5, -4);
const flagGeo = new THREE.PlaneGeometry(3, 2, 12, 4);
const flag = new THREE.Mesh(flagGeo, new THREE.MeshLambertMaterial({ map: flagTex, side: THREE.DoubleSide })); flag.position.set(6.55, 7.9, -4); scene.add(flag);
const flagBase = flagGeo.attributes.position.array.slice();
function flagAt(t) { const p = flagGeo.attributes.position.array; for (let i = 0; i < p.length; i += 3) { const x = flagBase[i] + 1.5; p[i + 2] = Math.sin(x * 2.2 - t * 5) * 0.12 * x / 3; } flagGeo.attributes.position.needsUpdate = true; }
// village sign
const villageSign = new THREE.Group(); villageSign.position.set(5, 0, 1.5); scene.add(villageSign);
box(0.25, 2.2, 0.25, 0x6b4a2f, -1.6, 1.1, 0, villageSign); box(0.25, 2.2, 0.25, 0x6b4a2f, 1.6, 1.1, 0, villageSign);
const vsTex = signTex([{ t: 'SAINT-', size: 46, y: 62 }, { t: 'TABARNOUCHE', size: 84, y: 128 }, { t: 'POP. ' + CFG.popTo.toLocaleString('fr-CA').replace(/\u202f|\u00a0|,/g, ' ') + ' · RECENSEMENT LE 25 NOV.', size: 32, y: 212, color: '#fff' }], { w: 640, h: 260, bg: '#f6f1e6', border: '#f6f1e6', band: { color: '#1f56b8', h: 70 } });
box(4.2, 1.75, 0.2, new THREE.MeshLambertMaterial({ color: 0xf6f1e6 }), 0, 2.4, -0.05, villageSign);
plane(4.0, 1.62, vsTex, 0, 2.4, 0.07, 0, villageSign);
box(4.4, 0.15, 0.4, 0xffffff, 0, 3.33, 0, villageSign);

// mayor + chest
const mayor = character({ mayor: true, beard: true, hat: 'tuque', shirt: 0x1d2b55, pants: 0x1c1c22, boots: 0x3b2a20, pos: [1.6, 0, 2.2], ry: 0.2 });
const chest = new THREE.Group(); chest.position.set(-0.6, 0, 2.6); scene.add(chest);
box(1.4, 0.8, 0.9, 0x8b5a2b, 0, 0.4, 0, chest); box(1.45, 0.12, 0.95, 0xd6a531, 0, 0.75, 0, chest);
const lid = new THREE.Group(); lid.position.set(0, 0.8, -0.45); chest.add(lid); box(1.4, 0.3, 0.9, 0x8b5a2b, 0, 0.15, 0.45, lid);
for (let i = 0; i < 14; i++) { const c = cyl(0.13, 0.13, 0.05, 10, 0xf2c230, -0.5 + (i % 5) * 0.25, 0.85 + Math.floor(i / 5) * 0.06, -0.25 + (i % 3) * 0.22, chest); c.rotation.x = 0.3 * (i % 3); }
lid.rotation.x = -1.9;
// villagers around hall
const villagers = [];
const vcol = [[0xe0343b, 0x2a2f3d], [0x2e9b48, 0x3d3020], [0x7b4fd0, 0x22252e], [0xf2c230, 0x3a4a7a], [0xff8a3d, 0x2a2f3d], [0x29a3c9, 0x3a2a20], [0xe85d9b, 0x22252e]];
for (let i = 0; i < 9; i++) {
  const c = vcol[i % vcol.length];
  const v = character({ shirt: c[0], pants: c[1], skin: [0xf1c9a0, 0xc68a5a, 0x8d5a3b, 0xf6d2b4][i % 4], hat: ['cap', 'tuque', 'hair', null][i % 4], hatColor: [0x2e9b48, 0x3a7bd5, 0x4a2f1e, 0][i % 4], pos: [[-6, 0], [-4.5, 1], [-7.2, 2], [-5.6, 3.2], [-3.6, -0.6], [8.8, -1.6], [10.4, 0], [9.6, -3.2], [-8.2, -1]][i].flatMap((v, j) => j ? [0, v] : [v]), ry: (i < 5 || i == 8 ? 0.5 : -0.5) + (rnd() - 0.5) * 0.4 });
  villagers.push(v);
}
// ---------- arena (west) ----------
const AX = -26, AZ = -6;
const arena = new THREE.Group(); arena.position.set(AX, 0, AZ); scene.add(arena);
const arenaParts = new THREE.Group(); arena.add(arenaParts);
box(18, 6, 12, 0xcfd3da, 0, 3, 0, arenaParts);
box(18.2, 0.6, 12.2, 0x8f8f96, 0, 0.3, 0, arenaParts);
{ const r = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 18.4, 18, 1, false, 0, Math.PI), mat(0xc7302e)); r.rotation.z = Math.PI / 2; r.scale.set(1, 1, 0.55); r.position.y = 6; r.castShadow = true; arenaParts.add(r); }
// glass facade
const glassTex = texCanvas(512, 256, (ctx) => {
  ctx.fillStyle = '#2b3550'; ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) { ctx.fillStyle = j === 2 ? '#ffd88a' : '#ffcf6b'; ctx.globalAlpha = 0.75 + 0.25 * ((i + j) % 2); ctx.fillRect(8 + i * 63, 10 + j * 82, 55, 72); }
  ctx.globalAlpha = 1;
});
box(14, 4, 0.2, new THREE.MeshLambertMaterial({ map: glassTex, emissive: 0x332a10 }), 0, 2.6, 6.05, arenaParts);
plane(9, 1.8, signTex([{ t: 'ARÉNA', size: 150, y: 128, color: '#ffffff' }], { w: 512, h: 256, bg: '#d32a2f', border: '#ffffff' }), 0, 5.6, 6.18, 0, arenaParts);
// cantine
const cantine = new THREE.Group(); cantine.position.set(AX + 13, 0, AZ + 7); scene.add(cantine);
box(5, 3, 3.5, 0xf2c230, 0, 1.5, 0, cantine); box(5.6, 0.35, 4.2, 0xe0343b, 0, 3.15, 0, cantine);
box(4.2, 1.2, 0.2, 0x2b3550, 0, 1.9, 1.76, cantine); box(4.6, 0.25, 0.9, 0xffffff, 0, 1.2, 2.1, cantine);
plane(4.2, 1.0, signTex([{ t: 'CANTINE', size: 110, y: 118, color: '#e0343b' }], { w: 512, h: 220, bg: '#fff8e5', border: '#e0343b' }), 0, 3.9, 0.6, 0, cantine);
// awning stripes
for (let i = 0; i < 6; i++) box(0.8, 0.12, 1.2, i % 2 ? 0xffffff : 0xe0343b, -2.0 + i * 0.8, 2.75, 2.2, cantine).rotation.x = 0.35;
// poutine + hot chocolate
const poutine = new THREE.Group(); poutine.position.set(-0.9, 1.36, 2.15); cantine.add(poutine);
box(0.6, 0.25, 0.45, 0xffffff, 0, 0, 0, poutine); for (let i = 0; i < 8; i++) box(0.08, 0.08, 0.35, 0xf5c542, -0.2 + (i % 4) * 0.13, 0.17, -0.08 + Math.floor(i / 4) * 0.1, poutine).rotation.y = i;
box(0.5, 0.06, 0.3, 0x7a4a24, 0, 0.24, 0, poutine);
const mug = cyl(0.16, 0.14, 0.32, 10, 0xe0343b, 0.8, 1.4, 2.15, cantine);
const hotdog = new THREE.Group(); hotdog.position.set(0.1, 1.33, 2.2); cantine.add(hotdog); box(0.6, 0.14, 0.22, 0xe7b46a, 0, 0, 0, hotdog); box(0.7, 0.1, 0.1, 0xb64a2e, 0, 0.08, 0, hotdog);
const steam = []; for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), mat(0xffffff, { transparent: true, opacity: 0.7 })); cantine.add(s); steam.push(s); }
const cantineGuy = character({ shirt: 0xffffff, pants: 0x2a2f3d, hat: 'cap', hatColor: 0xe0343b, pos: [0, 0, 0.6], parent: cantine });
// construction crane + dust
const TX = -22, TZ = 16;
const crane = new THREE.Group(); crane.position.set(TX + 9, 0, TZ - 6); scene.add(crane);
box(0.6, 16, 0.6, 0xf2c230, 0, 8, 0, crane); box(14, 0.5, 0.5, 0xf2c230, -4, 16, 0, crane); box(0.08, 6, 0.08, 0x333333, -9, 13, 0, crane);
const dust = []; for (let i = 0; i < 26; i++) { const d = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 + rnd() * 0.8, 0), mat(0xe9e4dc, { transparent: true, opacity: 0.8 })); d.position.set(TX + (rnd() - 0.5) * 16, 0.5, TZ + (rnd() - 0.5) * 12); d.userData.v = [(rnd() - 0.5) * 2, rnd() * 1.2 + 0.3, (rnd() - 0.5) * 2]; d.userData.o = d.position.clone(); scene.add(d); dust.push(d); }
// census official
const official = character({ shirt: 0x5a6070, pants: 0x3a3f4a, hat: 'hair', hatColor: 0x8a8a8a, face: 'serious', glasses: true, pos: [7.5, 0, 3.6], ry: -0.5 });
box(0.6, 0.45, 0.15, 0x5a3b22, 0, -1.1, 0.15, official.userData.armR);
box(0.5, 0.65, 0.05, 0xffffff, 0, -0.9, 0.3, official.userData.armL);
// vote lots
const LOTX = 0, LOTZ = 30; const lotSigns = [];
for (let i = 0; i < 3; i++) {
  const x = LOTX - 7 + i * 7;
  patch(x, LOTZ, 5.5, 5, 0xe1e6ee);
  box(5.5, 0.4, 0.15, 0x8b5a2b, x, 0.6, LOTZ + 2.5); box(5.5, 0.4, 0.15, 0x8b5a2b, x, 0.6, LOTZ - 2.5);
  for (const sx of [-2.7, 2.7]) for (const sz of [-2.5, 2.5]) box(0.25, 1.2, 0.25, 0x6b4a2f, x + sx, 0.6, LOTZ + sz);
  box(0.2, 2.2, 0.2, 0x6b4a2f, x, 1.1, LOTZ + 1.6);
  lotSigns.push(plane(2.2, 1.4, signTex([{ t: CFG.vote[i][0], size: 120, y: 95 }, { t: '?', size: 60, y: 190 }], { w: 300, h: 240, bg: '#fbf7ec', border: '#5a3b22' }), x, 2.4, LOTZ + 1.72));
}
patch(0, 21, 5, 18);
const mayor2 = character({ mayor: true, beard: true, hat: 'tuque', shirt: 0x1d2b55, pants: 0x1c1c22, boots: 0x3b2a20, pos: [3.6, 0, LOTZ + 5.2], ry: -0.4 });
// ---------- falling snow (global, attached to camera space region) ----------
const SN = 900; const snowGeo = new THREE.BufferGeometry(); const snowPos = new Float32Array(SN * 3); const snowSeed = [];
for (let i = 0; i < SN; i++) snowSeed.push([rnd(), rnd(), rnd(), rnd()]);
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const flake = texCanvas(32, 32, (ctx) => { const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 32); });
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ size: 0.16, map: flake, transparent: true, depthWrite: false })); scene.add(snow);
function snowAt(t, c) {
  for (let i = 0; i < SN; i++) {
    const [a, b, d, e] = snowSeed[i];
    const x = c.x + (a - 0.5) * 30, z = c.z + (b - 0.5) * 30;
    const y = c.y + 10 - (((d * 20) + t * (0.8 + e * 0.6)) % 20);
    snowPos[i * 3] = x + Math.sin(t * 0.8 + e * 6) * 0.4; snowPos[i * 3 + 1] = y; snowPos[i * 3 + 2] = z;
  }
  snowGeo.attributes.position.needsUpdate = true;
}

// ---------- overlay ----------
const ov = document.getElementById('ov');
const fmt = (n) => Math.round(n).toLocaleString('fr-CA').replace(/ | /g, ' ');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const pop = (x) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, x) => a + (b - a) * x;
const V = (x, y, z) => new THREE.Vector3(x, y, z);