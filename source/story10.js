// ================= LOGIQUE « HISTOIRE » (style À Saint-Tabarnouche…) =================
const KINDS = CFG.kinds;
(CFG.builtBefore || []).forEach((k) => { builds[k].visible = true; });
timParts.visible = true; timParts.scale.y = 1; crane.visible = false; queueSigns.visible = true;
staffChars.forEach((c) => (c.visible = true)); queueChars.forEach((c) => (c.visible = true));
lotSigns.forEach((s) => (s.visible = false));
const capStart = (si, i) => (T[si].caps[i] ? T[si].caps[i][0] : 99);
const inCap = (si, lt, i) => { const c = T[si].caps[i]; return c && lt >= c[0] && lt < c[1]; };

// ---------- éclairage jour / nuit ----------
const hemi = scene.children.find((o) => o.isHemisphereLight);
const DAY = { bg: new THREE.Color(0xdfe6ee), hemiC: new THREE.Color(0xf4f7ff), hemiI: 1.35, sunC: new THREE.Color(0xfff4e6), sunI: 1.6 };
const NIGHT = { bg: new THREE.Color(0x0b1430), hemiC: new THREE.Color(0x7d93d6), hemiI: 0.55, sunC: new THREE.Color(0x9fb6ff), sunI: 0.35 };
const DUSK = { bg: new THREE.Color(0xf2a36b), hemiC: new THREE.Color(0xffd9b8), hemiI: 1.0, sunC: new THREE.Color(0xffb070), sunI: 1.2 };
const LIGHTS = { day: DAY, night: NIGHT, dusk: DUSK };
const lampG = new THREE.Group(); scene.add(lampG);
function lamp(x, y, z, c = 0xffb45a, i = 40, d = 26) { const l = new THREE.PointLight(c, i, d, 1.6); l.position.set(x, y, z); lampG.add(l); return l; }
const tmpC = new THREE.Color();
function lightAt(k) { // k: 0 = jour, 1 = nuit (ou palette nommée)
  const a = LIGHTS[k] || NIGHT;
  scene.background.copy(a.bg); scene.fog.color.copy(a.bg);
  hemi.color.copy(a.hemiC); hemi.intensity = a.hemiI; sun.color.copy(a.sunC); sun.intensity = a.sunI;
  lampG.visible = (k === 'night');
}

// ---------- sapin géant (place) ----------
const SPX = CFG.sapin ? CFG.sapin[0] : 9, SPZ = CFG.sapin ? CFG.sapin[1] : 9;
const sapinG = new THREE.Group(); sapinG.position.set(SPX, 0, SPZ); scene.add(sapinG); sapinG.visible = false;
const sapinBulbs = [];
{
  cyl(0.9, 1.1, 3, 8, 0x6b4a2f, 0, 1.5, 0, sapinG);
  const L = [[6.5, 6, 4.5], [5.2, 5.5, 8], [4, 5, 11.2], [2.8, 4.5, 14.2], [1.6, 3.6, 16.8]];
  for (const [r, h, y] of L) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 9), mat(0x1f6b34)); c.position.y = y; c.castShadow = true; sapinG.add(c);
    const s = new THREE.Mesh(new THREE.ConeGeometry(r * 0.5, h * 0.35, 9), mat(0xf7f9fc)); s.position.y = y + h * 0.33; sapinG.add(s);
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + y; const rr = r * 0.78; const b = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 4), new THREE.MeshBasicMaterial({ color: [0xff3b3b, 0xffd23f, 0x3b9bff, 0x3bff6b, 0xff7ad9][i % 5] })); b.position.set(Math.cos(a) * rr, y - h * 0.25, Math.sin(a) * rr); sapinG.add(b); sapinBulbs.push(b); }
  }
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), new THREE.MeshBasicMaterial({ color: 0xffd23f })); star.position.y = 19.4; star.scale.set(1, 1.3, 0.4); sapinG.add(star); sapinG.userData.star = star;
  // cadeaux
  [[2.5, 1.8, 0xd8262b], [-2.2, 2.6, 0x1d4fa8], [0.4, 3.2, 0xf2c230], [-3.1, -1, 0x2e9b48]].forEach(([x, z, c]) => { box(1.2, 1, 1.2, c, x, 0.5, z, sapinG); box(1.25, 0.2, 0.25, 0xffffff, x, 1.02, z, sapinG); });
  const pl = new THREE.PointLight(0xffc477, 0, 30, 1.6); pl.position.set(0, 9, 7); sapinG.add(pl); sapinG.userData.pl = pl;
}
// sapin : merci aux spectateurs du live
plane(4.6, 1.2, signTex([{ t: 'SAPIN DES ROSES 🌹', size: 46, y: 62 }, { t: 'merci au live du 24 nov.', size: 30, y: 112, color: '#c8102e' }], { w: 520, h: 140, bg: '#fbf7ec', border: '#5a3b22' }), 0, 1.3, 3.9, 0, sapinG);
box(0.15, 1.2, 0.15, 0x6b4a2f, -1.8, 0.6, 3.85, sapinG); box(0.15, 1.2, 0.15, 0x6b4a2f, 1.8, 0.6, 3.85, sapinG);

// ---------- trottoir des gifts ----------
const TRX = CFG.trottoir ? CFG.trottoir[0] : 5.2, TRZ = CFG.trottoir ? CFG.trottoir[1] : 8;
const trottoirG = new THREE.Group(); scene.add(trottoirG); trottoirG.visible = !!CFG.trottoirOn;
patch(TRX, TRZ + (CFG.gifts || []).length * 0.95, 2.2, (CFG.gifts || []).length * 1.9 + 2, 0xb9bec8);
(CFG.gifts || []).forEach((n, i) => {
  const m = plane(1.7, 1.7, signTex([{ t: '★', size: 120, y: 120, color: '#d6a531' }, { t: n, size: n.length > 6 ? 46 : 58, y: 205, color: '#3a2a10' }], { w: 256, h: 256, bg: '#f3e2a8', border: '#b8892a' }), TRX, 0.04, TRZ + i * 1.9, 0, trottoirG);
  m.rotation.set(-Math.PI / 2, 0, Math.PI);
});

// ---------- usine « Vieilles Épices » + statue de Vinsso ----------
const UX = -20, UZ = 120;
const usine = new THREE.Group(); usine.position.set(UX, 0, UZ); scene.add(usine);
{
  patch(UX, UZ + 2, 30, 22, 0x8a8f99);
  box(20, 9, 12, 0x9b2d24, 0, 4.5, -4, usine); box(20.4, 0.6, 12.4, 0x3a3f4a, 0, 9.2, -4, usine);
  for (let i = 0; i < 3; i++) { box(6.6, 2.2, 12, 0x7c231c, -6.6 + i * 6.6, 10.4, -4, usine); }
  for (const x of [-6, 6]) { cyl(1, 1.2, 10, 10, 0x5a5f6a, x, 14, -8, usine); }
  for (let i = 0; i < 6; i++) box(2, 2.4, 0.1, 0xffd27a, -7.5 + i * 3, 4, 2.05, usine);
  box(5, 5, 0.1, 0x3a3f4a, 0, 2.5, 2.06, usine);
  plane(16, 2.6, signTex([{ t: 'USINE VIEILLES ÉPICES', size: 70, y: 80, color: '#ffffff' }, { t: 'déodorant · savon · fierté', size: 36, y: 128, color: '#ffd23f' }], { w: 900, h: 150, bg: '#7c1d16', border: '#ffffff' }), 0, 7.4, 2.1, 0, usine);
  box(3, 1.4, 3, 0xb9bec8, 0, 0.7, 8, usine);
  const sv = character({ shirt: 0x9b2d24, pos: [UX, 1.4, UZ + 8], ry: 0 }); sv.scale.setScalar(1.7);
  sv.traverse((o) => { if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: 0xe0b23a, metalness: 0.6, roughness: 0.3 }); }); anim(sv, 0, 'cheer'); usine.userData.statue = sv;
  plane(3, 0.7, signTex([{ t: 'VINSSO', size: 70, y: 70, color: '#3a2a10' }], { w: 320, h: 100, bg: '#f3e2a8', border: '#b8892a' }), 0, 0.7, 9.52, 0, usine);
  usine.userData.smoke = []; for (let i = 0; i < 8; i++) { const sm = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({ color: 0xdfe3ea, transparent: true, opacity: 0.6 })); usine.add(sm); usine.userData.smoke.push(sm); }
  const ul = new THREE.PointLight(0xffc477, 60, 30, 1.5); ul.position.set(0, 6, 9); usine.add(ul);
}

// ---------- centre de construction de LP ----------
const CX = CFG.lpCentre ? CFG.lpCentre[0] : 28, CZ = CFG.lpCentre ? CFG.lpCentre[1] : 120;
const lpG = new THREE.Group(); lpG.position.set(CX, 0, CZ); scene.add(lpG);
let lpChar;
{
  patch(CX, CZ + 2, 34, 24, 0x9a8f7c);
  box(18, 8, 11, 0xf2b81f, 0, 4, -5, lpG); box(18.4, 0.6, 11.4, 0x3a3f4a, 0, 8.2, -5, lpG);
  box(6, 5.4, 0.1, 0x3a3f4a, -4, 2.7, 0.56, lpG); for (let i = 0; i < 4; i++) box(0.1, 5.4, 0.12, 0xf2b81f, -6.5 + i * 1.7, 2.7, 0.6, lpG);
  for (let i = 0; i < 3; i++) box(2, 2, 0.1, 0xffe6a0, 2 + i * 2.6, 4.5, 0.56, lpG);
  plane(15, 2.4, signTex([{ t: 'CENTRE DE CONSTRUCTION LP', size: 60, y: 74, color: '#1d1d1d' }, { t: 'chef de chantier : LP', size: 34, y: 122, color: '#c8102e' }], { w: 900, h: 150, bg: '#ffffff', border: '#1d1d1d' }), 0, 9.8, 0.6, 0, lpG);
  // grue
  box(1, 22, 1, 0xf2b81f, 12, 11, -8, lpG); box(20, 0.9, 0.9, 0xf2b81f, 6, 22, -8, lpG); box(2.4, 2, 2.4, 0x3a3f4a, 12, 21, -8, lpG); box(0.1, 8, 0.1, 0x222222, -1, 18, -8, lpG); box(3, 0.4, 1.2, 0xc8102e, -1, 14, -8, lpG);
  // piles de bois, cônes, briques
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) box(4, 0.4, 0.4, 0xc79a5b, -12, 0.2 + i * 0.42, 3 + j * 0.45, lpG);
  for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 8), mat(0xff6a1a)); c.position.set(-6 + i * 2.6, 0.45, 7); lpG.add(c); }
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) box(1.2, 0.6, 0.6, 0xa8432f, 9 + j * 1.25 + i * 0.6, 0.3 + i * 0.6, 4, lpG);
  lpChar = character({ shirt: 0xff7a1a, pants: 0x2a3550, hat: 'helmet', hatColor: 0xf2c230, pos: [CX, 0, CZ + 5], ry: 0 });
  lpChar.scale.setScalar(1.3);
  plane(2.4, 0.6, signTex([{ t: 'LP', size: 64, y: 70 }], { w: 300, h: 100, bg: '#fbf7ec', border: '#5a3b22' }), 0, 4.0, 0, 0, lpChar);
  const ll = new THREE.PointLight(0xffd27a, 50, 30, 1.5); ll.position.set(0, 6, 8); lpG.add(ll);
}
// ---------- forêt enchantée + statue de Royal ----------
const FOX = -70, FOZ = 112;
const foret = new THREE.Group(); scene.add(foret);
const fireflies = [];
{
  patch(FOX, FOZ, 2.4, 40, 0x8c6a44); // chemin
  let r = 7; const rr = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  for (let i = 0; i < 70; i++) { const side = i % 2 ? 1 : -1; const x = FOX + side * (5.5 + rr() * 14), z = FOZ - 20 + rr() * 40; const tr = tree(x, z, 1.2 + rr() * 1.2); foret.add(tr); }
  for (let i = 0; i < 18; i++) { const side = i % 2 ? 1 : -1; const g = new THREE.Group(); g.position.set(FOX + side * (1.8 + rr() * 2), 0, FOZ - 18 + i * 2.1); foret.add(g); cyl(0.12, 0.15, 0.5, 6, 0xf3efe2, 0, 0.25, 0, g); const cap = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: [0xff5ad6, 0x5ae0ff, 0xb07cff][i % 3] })); cap.position.y = 0.5; g.add(cap); }
  for (let i = 0; i < 40; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.09, 5, 4), new THREE.MeshBasicMaterial({ color: 0xfff27a })); f.userData = { x: FOX + (rr() - 0.5) * 12, z: FOZ - 18 + rr() * 36, y: 0.8 + rr() * 3, o: rr() * 6 }; foret.add(f); fireflies.push(f); }
  // statue de Royal (arbitre) + phrase gravée
  box(3, 1.4, 3, 0xb9bec8, FOX, 0.7, FOZ + 14);
  const sr = character({ shirt: 0x111111, hat: 'cap', hatColor: 0x111111, pos: [FOX, 1.4, FOZ + 14], ry: 0 }); sr.scale.setScalar(1.7);
  sr.traverse((o) => { if (o.isMesh) o.material = mat(0xa9b4c2); }); anim(sr, 0, 'point'); foret.userData.statue = sr;
  plane(3.2, 0.7, signTex([{ t: 'ROYAL', size: 70, y: 70, color: '#1d2b55' }], { w: 320, h: 100, bg: '#e7ecf3', border: '#8a96a8' }), FOX, 0.7, FOZ + 15.52, 0);
  const q = plane(2.2, 7, signTex(CFG.royalQuote ? (CFG.royalQuote.match(/.{1,22}(\s|$)/g) || [CFG.royalQuote]).slice(0, 7).map((l, i) => ({ t: l.trim(), size: 30, y: 60 + i * 44, color: '#3a2a10' })).concat([{ t: '— Royal', size: 30, y: 60 + Math.min(7, (CFG.royalQuote.match(/.{1,22}(\s|$)/g) || [1]).length) * 44 + 10, color: '#8a5a1a' }]) : [{ t: '« … »', size: 40, y: 120 }], { w: 300, h: 420, bg: '#efe2c0', border: '#8a6a44' }), FOX, 0.03, FOZ + 4); q.rotation.x = -Math.PI / 2; foret.userData.quote = q;
  const fl = new THREE.PointLight(0xb07cff, 50, 30, 1.5); fl.position.set(FOX, 5, FOZ + 6); foret.add(fl);
}
// ---------- aéroport ----------
const APX = CFG.airport ? CFG.airport[0] : 78, APZ = CFG.airport ? CFG.airport[1] : 0;
const airport = new THREE.Group(); airport.position.set(APX, 0, APZ); scene.add(airport); airport.visible = !!CFG.airportOn;
let plane1, pilotSeat, passengers = [];
{
  patch(APX, APZ + 8, 70, 9, 0x4a4f5a); // piste
  for (let i = 0; i < 14; i++) patch(APX - 30 + i * 4.6, APZ + 8, 2, 0.4, 0xf2f2f2);
  patch(APX - 6, APZ - 6, 26, 12, 0x6d7380); // tarmac
  // terminal
  box(26, 7, 9, 0xdfe6ee, 0, 3.5, -18, airport); box(26.4, 0.6, 9.4, 0x1d4fa8, 0, 7.2, -18, airport);
  for (let i = 0; i < 8; i++) box(2.4, 3.6, 0.1, 0x8fc6ff, -10.5 + i * 3, 3.4, -13.45, airport);
  box(6, 9.5, 6, 0xc9d2de, 15, 4.75, -18, airport); box(7, 2.4, 7, 0x2a3550, 15, 10.6, -18, airport); box(6.6, 1.6, 6.6, 0x8fc6ff, 15, 10.6, -18, airport); // tour
  plane(18, 2.2, signTex([{ t: CFG.airportName || 'AÉROPORT INTERNATIONAL', size: 46, y: 62, color: '#ffffff' }, { t: CFG.airportSub || 'SAINT-TABARNOUCHE · ALP', size: 34, y: 110, color: '#ffd23f' }], { w: 900, h: 140, bg: '#1d4fa8', border: '#ffffff' }), 0, 8.8, -13.35, 0, airport);
  for (const [x, z] of [[-14, -8], [6, -8], [-20, 14], [0, 14]]) { const l = new THREE.PointLight(0xffd9a0, 60, 32, 1.4); l.position.set(x, 8, z); airport.add(l); }
  // statue du maire à l'entrée
  box(2.6, 1.4, 2.6, 0xb9bec8, -8, 0.7, -10, airport);
  const st = character(CFG.statueName ? { hat: 'hair', shirt: 0xd6a531, pos: [APX - 8, 1.4, APZ - 10], ry: 0.3 } : { mayor: true, beard: true, hat: 'tuque', shirt: 0xd6a531, pants: 0xd6a531, skin: 0xd6a531, boots: 0xd6a531, pos: [APX - 8, 1.4, APZ - 10], ry: 0.3 });
  st.scale.setScalar(1.6); st.traverse((o) => { if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: 0xe0b23a, metalness: 0.6, roughness: 0.3 }); }); anim(st, 0, 'wave'); airport.userData.statue = st;
  if (CFG.statueName) plane(3.4, 0.7, signTex([{ t: CFG.statueName, size: 52, y: 66, color: '#3a2a10' }], { w: 380, h: 100, bg: '#f3e2a8', border: '#b8892a' }), -8, 0.75, -8.68, 0, airport);
  // avion
  plane1 = new THREE.Group(); plane1.position.set(APX - 14, 0, APZ + 8); plane1.rotation.y = Math.PI / 2; scene.add(plane1);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 20, 12), mat(0xf7f9fc)); body.rotation.x = Math.PI / 2; body.position.y = 3; body.castShadow = true; plane1.add(body);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1.7, 12, 8), mat(0xf7f9fc)); nose.position.set(0, 3, 10); nose.scale.z = 1.4; plane1.add(nose);
  box(3.45, 0.5, 20, 0xc8102e, 0, 2.2, 0, plane1); // bande
  box(22, 0.4, 3.4, 0xdfe6ee, 0, 2.6, 0.5, plane1); // ailes
  box(0.4, 4, 3, 0xc8102e, 0, 5.6, -9, plane1); box(7, 0.3, 2.2, 0xdfe6ee, 0, 3.4, -9, plane1);
  for (let i = 0; i < 9; i++) { box(0.1, 0.55, 0.7, 0x2a3550, 1.68, 3.6, -6.5 + i * 1.6, plane1); box(0.1, 0.55, 0.7, 0x2a3550, -1.68, 3.6, -6.5 + i * 1.6, plane1); }
  box(2.4, 0.8, 0.2, 0x2a3550, 0, 4, 11.6, plane1); // cockpit
  for (const x of [-5.5, 5.5]) { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 10), mat(0x9aa4b8)); e.rotation.x = Math.PI / 2; e.position.set(x, 1.8, 1.2); plane1.add(e); }
  [[0, 0.9, 7], [-3, 0.9, -1], [3, 0.9, -1]].forEach(([x, y, z]) => { box(0.3, 1.8, 0.3, 0x333333, x, y, z, plane1); });
  plane(9, 1.2, signTex([{ t: 'AIR TABARNOUCHE', size: 64, y: 70, color: '#c8102e' }], { w: 720, h: 110, bg: '#f7f9fc', border: '#f7f9fc' }), 1.72, 4.6, 0, Math.PI / 2, plane1);
  plane1.visible = !!CFG.airportOn;
  // passagers (file vers l'escalier)
  box(1.6, 0.2, 4.5, 0x9aa4b8, 0, 1.5, 0, airport).visible = false;
  (CFG.gifts || []).slice(0, 11).forEach((n, i) => {
    const c = character({ shirt: [0x3a7bd5, 0xe0343b, 0x2e9b48, 0xf2c230, 0x8e44ad, 0xff7a3b][i % 6], hat: ['tuque', 'cap', 'hair', 'longhair', 'helmet'][i % 5], hatColor: [0x6b4a2f, 0x1d4fa8, 0xd8262b, 0x3b2416, 0x2e9b48][i % 5], pos: [APX - 20 + i * 1.6, 0, APZ + 2], ry: Math.PI / 2 });
    c.visible = !!CFG.airportOn; c.userData.tag = n; passengers.push(c);
  });
}

// ---------- autour de l'aéroport : hôtel, garderie chiens/chats, parc des avions, Tabar30 + TEM ----------
const around = new THREE.Group(); around.position.set(APX, 0, APZ); scene.add(around); around.visible = false;
let temTrain;
const MLX = -52, MLZ = -42; // centre d'achats (relatif à l'aéroport)
const TRZ2 = -30;          // voie du TEM (relatif)
{
  // hôtel
  box(10, 16, 8, 0xe9e2d0, -30, 8, -16, around); box(10.4, 0.6, 8.4, 0x2a3550, -30, 16.3, -16, around);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) box(1.4, 1.4, 0.1, 0xffe6a0, -33.6 + c * 2.4, 2.6 + r * 2.4, -11.95, around);
  plane(9, 1.6, signTex([{ t: "HÔTEL DE L'ALP", size: 62, y: 72, color: '#ffffff' }], { w: 640, h: 110, bg: '#2a3550', border: '#ffd23f' }), -30, 17.6, -11.9, 0, around);
  // garderie chiens & chats
  box(10, 4.5, 7, 0xff9fc6, 30, 2.25, -16, around); box(10.6, 0.5, 7.6, 0x8e44ad, 30, 4.7, -16, around);
  box(2, 3, 0.1, 0x5a3b22, 30, 1.5, -12.45, around);
  plane(9.4, 1.6, signTex([{ t: 'GARDERIE CHIENS & CHATS', size: 50, y: 64, color: '#ffffff' }, { t: '🐶 🐱', size: 40, y: 112 }], { w: 760, h: 140, bg: '#8e44ad', border: '#ffffff' }), 30, 6, -12.4, 0, around);
  const pets = [];
  for (let i = 0; i < 6; i++) { const g = new THREE.Group(); const dog = i % 2 === 0; const c = [0xc68a5a, 0x3b2416, 0xf2f2f2, 0xff9a3b, 0x777777, 0x222222][i];
    box(dog ? 1.1 : 0.8, 0.6, 0.5, c, 0, 0.55, 0, g); box(0.5, 0.5, 0.5, c, dog ? 0.7 : 0.5, 0.95, 0, g);
    box(0.15, 0.3, 0.15, c, (dog ? 0.7 : 0.5) + 0.1, 1.3, 0.15, g); box(0.15, 0.3, 0.15, c, (dog ? 0.7 : 0.5) + 0.1, 1.3, -0.15, g);
    for (const [x, z] of [[-0.35, 0.18], [-0.35, -0.18], [0.35, 0.18], [0.35, -0.18]]) box(0.15, 0.3, 0.15, c, x, 0.15, z, g);
    g.position.set(25 + i * 1.8, 0, -9 + (i % 3)); g.userData.o = i; around.add(g); pets.push(g); }
  around.userData.pets = pets;
  box(12, 0.8, 0.15, 0xffffff, 30, 0.4, -7.4, around);
  // parc pour observer les avions (de l'autre côté de la piste)
  patch(APX - 4, APZ + 24, 22, 8, 0x6fa86a);
  for (let i = 0; i < 3; i++) { box(2.4, 0.2, 0.7, 0x8a5a2b, -12 + i * 6, 0.6, 24, around); box(2.4, 0.7, 0.15, 0x8a5a2b, -12 + i * 6, 1, 24.35, around); }
  for (let i = 0; i < 12; i++) box(0.12, 1, 0.12, 0x5a3b22, -15 + i * 2, 0.5, 20.6, around);
  box(22, 0.1, 0.1, 0x5a3b22, -4, 0.95, 20.6, around);
  plane(6, 1.3, signTex([{ t: 'PARC DES AVIONS ✈️', size: 50, y: 64, color: '#1d4fa8' }], { w: 460, h: 100, bg: '#fbf7ec', border: '#1d4fa8' }), 4, 2, 21, Math.PI, around);
  box(0.2, 2, 0.2, 0x5a3b22, 2, 1, 21.05, around); box(0.2, 2, 0.2, 0x5a3b22, 6, 1, 21.05, around);
  const watchers = [];
  for (let i = 0; i < 4; i++) { const c = character({ shirt: [0x3a7bd5, 0xe0343b, 0x2e9b48, 0xf2c230][i], hat: ['tuque', 'cap', 'hair', 'longhair'][i], hatColor: [0xd8262b, 0x1d4fa8, 0x3b2416, 0x6b4a2f][i], pos: [APX - 10 + i * 3, 0, APZ + 22.5], ry: Math.PI }); c.visible = false; watchers.push(c); }
  around.userData.watchers = watchers;
  // centre d'achats Tabar30
  box(26, 7, 14, 0xd9dde4, MLX, 3.5, MLZ, around); box(26.4, 0.6, 14.4, 0x1d1d1d, MLX, 7.2, MLZ, around);
  for (let i = 0; i < 6; i++) box(3, 3.6, 0.1, 0x8fc6ff, MLX - 10 + i * 4, 2.2, MLZ + 7.05, around);
  plane(18, 2.4, signTex([{ t: 'QUARTIER TABAR30', size: 72, y: 80, color: '#ffffff' }, { t: "centre d'achats", size: 34, y: 126, color: '#ffd23f' }], { w: 900, h: 150, bg: '#1d1d1d', border: '#ffffff' }), MLX, 9, MLZ + 7.1, 0, around);
  // voie du TEM : du centre d'achats jusqu'au terminal
  patch(APX + (MLX + 4) / 2 - 2, APZ + TRZ2, Math.abs(MLX) + 14, 2.4, 0x55504a);
  for (const dz of [-0.6, 0.6]) box(Math.abs(MLX) + 14, 0.15, 0.15, 0x9aa4b8, (MLX + 4) / 2 - 2, 0.12, TRZ2 + dz, around);
  for (let i = 0; i < 26; i++) box(0.4, 0.1, 2, 0x6b4a2f, MLX - 6 + i * 2.5, 0.06, TRZ2, around);
  box(7, 4, 4, 0xdfe6ee, -16, 2, TRZ2 - 3.5, around); box(7.4, 0.4, 4.4, 0x0fa3a3, -16, 4.1, TRZ2 - 3.5, around);
  plane(6, 1, signTex([{ t: 'GARE TEM · ALP', size: 50, y: 62, color: '#ffffff' }], { w: 460, h: 90, bg: '#0fa3a3', border: '#ffffff' }), -16, 3.4, TRZ2 - 1.45, 0, around);
  temTrain = new THREE.Group(); around.add(temTrain);
  for (let i = 0; i < 3; i++) { const x = -i * 7.4; box(7, 3, 2.6, 0xf7f9fc, x, 1.9, 0, temTrain); box(7.02, 0.6, 2.62, 0x0fa3a3, x, 1.2, 0, temTrain); for (let w = 0; w < 4; w++) { box(1.1, 0.9, 0.05, 0x2a3550, x - 2.4 + w * 1.6, 2.5, 1.32, temTrain); box(1.1, 0.9, 0.05, 0x2a3550, x - 2.4 + w * 1.6, 2.5, -1.32, temTrain); } }
  box(0.1, 1.2, 2, 0x2a3550, 3.52, 2.4, 0, temTrain);
  plane(5, 0.7, signTex([{ t: 'TEM · Train Express Tabarnouche', size: 34, y: 46, color: '#0fa3a3' }], { w: 600, h: 70, bg: '#f7f9fc', border: '#f7f9fc' }), -7.4, 2.5, 1.36, 0, temTrain);
  temTrain.position.set(MLX + 10, 0, TRZ2);
  for (const [x, z] of [[-30, -10], [30, -10], [MLX, MLZ + 9], [-4, 24]]) { const l = new THREE.PointLight(0xffd9a0, 50, 30, 1.4); l.position.set(x, 7, z); around.add(l); }
}
// tags de noms au-dessus des passagers
const tagG = passengers.map((c) => { const p = plane(2.4, 0.6, signTex([{ t: c.userData.tag, size: 64, y: 70 }], { w: 300, h: 100, bg: '#fbf7ec', border: '#5a3b22' }), 0, 4.0, 0, 0, c); return p; });

// ---------- caméra ----------
function seg(lt, marks) {
  let x = marks[0][1]; for (let i = 1; i < marks.length; i++) { const [tb, xb] = marks[i]; if (lt >= tb - 0.6) x = lerp(marks[i - 1][1], xb, ease((lt - (tb - 0.6)) / 0.6)); } return x;
}
function tour(lt, P) { const c = (j, w) => seg(lt, P.map((e) => [e[0], e[w][j]])); const drift = Math.sin(lt * 0.5) * 0.25; return [V(c(0, 1) + drift, c(1, 1), c(2, 1)), V(c(0, 2), c(1, 2), c(2, 2))]; }
function shot(si, i, p, l) { return [i === 0 ? 0 : capStart(si, i), p, l]; }
function dolly(lt, d, p0, p1, l0, l1) { const k = ease(lt / d); return [V(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)), V(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k))]; }
const AP = (x, y, z) => [APX + x, y, APZ + z];
function camPath(si, lt, d) {
  const kind = KINDS[si];
  switch (kind) {
    case 'open': return dolly(lt, d, [-30, 34, 70], [-6, 16, 34], [-6, 0, 8], [0, 2, 4]);
    case 'live': return tour(lt, [[0, [4.5, 3.2, 9.5], [1.6, 2.4, 2.2]], shot(si, 1, [7, 5, 14], [0, 1.5, 5]), shot(si, 2, [2.6, 2.9, 5.6], [1.6, 2.6, 2.2])]);
    case 'doubt': return dolly(lt, d, [-14, 5, 16], [-8, 4, 12], [-4, 1.5, 6], [-2, 1.5, 5]);
    case 'sapin': { const a = capStart(si, 3); if (lt < a) return dolly(lt, a, [SPX + 3, 2.5, SPZ + 22], [SPX + 1, 2.2, SPZ + 17], [SPX, 1.5, SPZ], [SPX, 2, SPZ]); const k = ease((lt - a) / 3.5); return [V(SPX + lerp(1, 6, k), lerp(2.2, 8, k), SPZ + lerp(17, 30, k)), V(SPX, lerp(2, 11, k), SPZ)]; }
    case 'trottoir': { const n = (CFG.gifts || []).length; const z0 = TRZ - 3.5, z1 = TRZ + (n - 1) * 1.9 - 4; const k = clamp(lt / (d - 1)); return [V(TRX + 0.4, 6, lerp(z0, z1, ease(k))), V(TRX, 0, lerp(z0, z1, ease(k)) + 4)]; }
    case 'usine': { const a = capStart(si, 1); if (lt < a) return dolly(lt, a, [UX - 14, 12, UZ + 30], [UX - 6, 8, UZ + 24], [UX, 6, UZ - 2], [UX, 5, UZ]); return dolly(lt - a, d - a, [UX + 6, 4.5, UZ + 22], [UX + 4, 4.2, UZ + 19], [UX, 4.5, UZ + 8], [UX, 4.8, UZ + 8]); }
    case 'lp': { const a = capStart(si, 1); if (lt < a) return dolly(lt, a, [CX - 16, 14, CZ + 34], [CX - 6, 9, CZ + 24], [CX, 6, CZ - 4], [CX, 6, CZ]); return dolly(lt - a, d - a, [CX + 5, 3.4, CZ + 13], [CX + 3, 3, CZ + 11], [CX, 2.8, CZ + 5], [CX, 3, CZ + 4]); }
    case 'foret': { const a = capStart(si, 2); if (lt < a) return dolly(lt, a, [FOX, 2.6, FOZ - 20], [FOX, 2.4, FOZ - 4], [FOX, 1.5, FOZ + 10], [FOX, 1.2, FOZ + 8]); return dolly(lt - a, d - a, [FOX + 0.4, 4.2, FOZ + 0.6], [FOX + 0.2, 5.4, FOZ + 1.2], [FOX, 0, FOZ + 4], [FOX, 1.5, FOZ + 12]); }
    case 'twist': return dolly(lt, d, [SPX + 14, 6, SPZ + 30], [SPX + 4, 22, SPZ + 50], [SPX, 6, SPZ], [SPX - 2, 4, SPZ]);
    // aéroport
    case 'aopen': return dolly(lt, d, [-40, 30, 60], [-12, 10, 30], [-4, 0, 6], [0, 2, 0]);
    case 'aquads': return dolly(lt, d, [-22, 4, 64], [-26, 3.4, 58], [-31, 1, 60], [-31, 1, 58]);
    case 'abuild': { const a = capStart(si, 1); if (lt < a) return dolly(lt, a, AP(-40, 6, 30), AP(-38, 7, 28), AP(-10, 1, 0), AP(-5, 2, -5)); const k = ease((lt - a) / 3); return [V(APX - 38 + k * 6, 7 + k * 18, APZ + 28 + k * 18), V(APX - 2, 2, APZ - 6)]; }
    case 'aextras': return tour(lt, [[0, AP(-18, 9, 4), AP(-30, 9, -14)], shot(si, 1, AP(18, 5, -1), AP(29, 2, -12)), shot(si, 2, AP(-3, 6, 33), AP(-6, 3, 8))]);
    case 'arem': { const k = clamp((lt - 2.2) / (d - 2.7)); const x = lerp(MLX + 10, -12, ease(k)); return [V(APX + x - 3, 12, APZ + TRZ2 + 13), V(APX + x - 6, 2.5, APZ + TRZ2 - 6)]; }
    case 'aname': return tour(lt, [[0, AP(-6, 5, 8), AP(-2, 6, -13)], shot(si, 2, AP(2, 6, -4), AP(-8, 5.4, -10))]);
    case 'aboard': return tour(lt, [[0, AP(-14, 6, -15), AP(-14, 2, 2)], shot(si, 1, AP(-1, 5, -9), AP(-14, 2.5, 4))]);
    case 'aengine': return tour(lt, [[0, AP(-2, 4, 20), AP(-14, 3, 8)], shot(si, 2, AP(-4, 5, 13), AP(-14, 3.6, 8)), shot(si, 3, AP(7, 4.6, 10), AP(-5, 4, 8))]);
    case 'apilot': return dolly(lt, d, AP(2, 4.5, 9), AP(10, 12, 26), AP(-3, 4, 8), AP(-10, 3, 6));
  }
  return [V(10, 10, 30), V(0, 0, 0)];
}

// ---------- overlay ----------
const syl = (w) => Math.max(1, (w.toLowerCase().replace(/e(s|nt)?$/, '').match(/[aeiouyàâéèêëîïôûùü]+/g) || []).length) + (/[.,!?…:]$/.test(w) ? 0.8 : 0);
function chunks(txt) {
  const words = txt.split(/\s+/).filter(Boolean); const out = []; let cur = [];
  for (const w of words) {
    cur.push(w); const len = cur.join(' ').length;
    if (/[.,!?…:]$/.test(w) || cur.length >= 3 || len >= 14) { out.push(cur); cur = []; }
  }
  if (cur.length) { if (out.length && cur.length === 1 && cur[0].length < 5 && out[out.length - 1].length < 3) out[out.length - 1].push(...cur); else out.push(cur); }
  return out;
}
const HOT = new RegExp('^(tabarnouche|sapin|géant|roses?|cent|six|merci|recensement|habitants|usine|statue|or|forêt|enchantée|aéroport|pilote|avion|vol|live|onze|mille|' + (CFG.gifts || []).map((g) => g.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '')).join('|') + ')$', 'iu');
function wordAt(si, lt) {
  const caps = T[si].caps;
  for (const [a, b, ca, cb] of caps) {
    if (lt < a || lt >= b) continue;
    const txt = (cb || ca || '').trim(); if (!txt) return null;
    const ch = chunks(txt); const end = Math.min(b, a + Math.max(0.5, (b - a) - 0.25));
    const w8 = ch.map((c) => c.reduce((x, w) => x + syl(w), 0)); const tot = w8.reduce((x, y) => x + y, 0);
    const k = clamp((lt - a) / (end - a)) * tot; let acc = 0, i = 0;
    for (; i < ch.length - 1; i++) { acc += w8[i]; if (k < acc) break; }
    if (i === ch.length - 1) acc = tot; const ws = acc - w8[i];
    return { words: ch[i], t: lt - (a + (ws / tot) * (end - a)) };
  }
  return null;
}
function overlay(t, si, lt) {
  const kind = KINDS[si]; let h = '';
  const w = wordAt(si, lt);
  if (w) {
    const s = pop(w.t / 0.12);
    const html = w.words.map((x) => { const bare = x.replace(/[^\p{L}\p{N}-]/gu, ''); const tab = /TABARNOUCHE/i.test(x); const hot = tab || HOT.test(bare) || /\d/.test(x); return `<span style="color:${hot ? '#ffd23f' : '#fff'};${tab ? 'font-size:1.2em;' : ''}">${x.replace(/\.\.\.$|…$/, '…')}</span>`; }).join(' ');
    h += `<div class="big" style="top:420px;left:40px;right:40px;font-size:56px;line-height:1.08;-webkit-text-stroke:9px #111;text-shadow:0 6px 0 rgba(0,0,0,.35);transform:scale(${s.toFixed(3)})">${html}</div>`;
  }

  if (kind === 'twist') { const a = capStart(si, 1); if (lt >= a) { const k = ease((lt - a) / 1.4); const out = 1 - clamp((lt - capStart(si, 3)) / 0.3); if (out > 0) h += `<div class="card" style="top:180px;width:380px;padding:14px 18px;text-align:center;opacity:${out}"><div style="font-weight:900;font-size:18px;color:#c8102e">📋 RECENSEMENT · 25 NOV.</div><div style="font-weight:900;font-size:58px;line-height:1.05">${fmt(lerp(0, CFG.census, k))}</div><div style="font-weight:900;font-size:18px;color:#555">habitants · objectif 10 000</div></div>`; } }
  if (kind === 'aboard') { const a = capStart(si, 1); if (lt >= a) { const k = clamp((lt - a) / 0.3); h += `<div class="card" style="top:150px;width:440px;padding:14px 18px;opacity:${k};transform:translateX(-50%) scale(${pop(k)})"><div style="font-weight:900;font-size:16px;color:#c8102e">✈️ AIR TABARNOUCHE · VOL 001 · CARTE D'EMBARQUEMENT</div><div style="font-weight:900;font-size:19px;line-height:1.35;margin-top:6px">${(CFG.gifts || []).join(' · ')}</div></div>`; } }
  if (CFG.endCard && si === NS - 1) { const a = T[si].caps[T[si].caps.length - 1][0]; if (lt > a) { const k = clamp((lt - a) / 0.3); h += `<div class="big" style="top:760px;opacity:${k};font-size:26px;color:#fff">${CFG.endCard}</div>`; } }
  ov.innerHTML = h;
}

// ---------- rendu ----------
window.renderAt = function (t) {
  let si = NS - 1; for (let i = 0; i < NS; i++) if (t < START[i] + DUR[i] + GAP) { si = i; break; }
  const lt = t - START[si]; const d = DUR[si] + GAP; const kind = KINDS[si];
  lightAt((CFG.light || {})[kind] || CFG.lightDefault || 'night');
  const [p, look] = camPath(si, Math.min(lt, d), d);
  camera.position.copy(p); camera.lookAt(look);
  sunAt(look.x, look.z); flagAt(t); snowAt(t, camera.position);
  // sapin : pousse au « Tabarnouche »
  const sI = KINDS.indexOf('sapin');
  if (sI >= 0) { const grow = si > sI ? 1 : (si === sI ? ease((lt - capStart(si, 3)) / 1.8) : 0); sapinG.visible = grow > 0.002; sapinG.scale.set(1, Math.max(0.001, grow), 1); sapinG.userData.pl.intensity = 80 * grow; }
  sapinBulbs.forEach((b, i) => { b.visible = (Math.floor(t * 3) + i) % 4 !== 0; });
  if (sapinG.userData.star) sapinG.userData.star.rotation.y = t * 1.2;
  trottoirG.visible = !!CFG.trottoirOn || si >= KINDS.indexOf('trottoir') && KINDS.indexOf('trottoir') >= 0;
  // aéroport : apparaît au « Tabarnouche »
  const aI = KINDS.indexOf('abuild');
  if (aI >= 0) { const g = si > aI ? 1 : (si === aI ? ease((lt - capStart(si, 1)) / 2.2) : 0); airport.visible = g > 0.002; airport.scale.set(1, Math.max(0.001, g), 1); plane1.visible = g > 0.5; airport.userData.statue.visible = g > 0.5; passengers.forEach((c) => (c.visible = g > 0.5)); }
  { const aI2 = KINDS.indexOf('abuild'); const on = aI2 >= 0 && (si > aI2 || (si === aI2 && lt > capStart(si, 1) + 1.5)); around.visible = on; around.userData.watchers.forEach((c, i) => { c.visible = on; anim(c, t, 'point', i); });
    around.userData.pets.forEach((g) => { const o = g.userData.o; g.position.y = Math.abs(Math.sin(t * 6 + o)) * 0.25; g.rotation.y = Math.sin(t * 0.8 + o) * 0.8; });
    const rI = KINDS.indexOf('arem'); const k = si > rI ? 1 : si === rI ? clamp((lt - 2.2) / (DUR[si] + GAP - 2.7)) : 0; temTrain.position.x = lerp(MLX + 10, -12, ease(k)); }
  // passagers : marchent vers l'avion pendant l'embarquement
  const bI = KINDS.indexOf('aboard');
  passengers.forEach((c, i) => { const k = si > bI ? 1 : si === bI ? clamp((lt - 0.5 - i * 0.25) / 4) : 0; c.position.set(APX - 22 + i * 1.5 + k * 4, 0, APZ + lerp(-4, 4.5, k)); c.visible = c.visible && k < 0.98; anim(c, t, k > 0 && k < 1 ? 'idle' : 'wave', i); });
  // moteurs : vibration
  const eI = KINDS.indexOf('aengine');
  if (eI >= 0 && si >= eI) plane1.position.y = Math.sin(t * 40) * 0.03;
  // persos
  anim(mayor, t, kind === 'live' ? (inCap(si, lt, 1) ? 'point' : 'wave') : (kind === 'sapin' && lt > capStart(si, 3) ? 'cheer' : (kind === 'twist' ? 'cheer' : 'idle')));
  villagers.forEach((v, i) => anim(v, t, kind === 'doubt' ? 'point' : (kind === 'sapin' && lt > capStart(si, 3) ? 'cheer' : 'idle'), i));
  usine.userData.smoke.forEach((sm, i) => { const ph = (t * 0.3 + i / 8) % 1; const x = i % 2 ? 6 : -6; sm.position.set(x + Math.sin(ph * 4 + i) * 0.6, 19 + ph * 8, -8); sm.scale.setScalar(0.8 + ph * 2); sm.material.opacity = 0.55 * (1 - ph); });
  anim(lpChar, t, kind === 'lp' && lt > capStart(si, 1) ? 'cheer' : 'wave');
  fireflies.forEach((f) => { const u = f.userData; f.position.set(u.x + Math.sin(t * 0.7 + u.o) * 0.8, u.y + Math.sin(t * 1.3 + u.o * 2) * 0.4, u.z + Math.cos(t * 0.6 + u.o) * 0.8); f.visible = Math.sin(t * 3 + u.o * 5) > -0.6; });
  staffChars.forEach((c, i) => anim(c, t, 'idle', i)); queueChars.forEach((c, i) => c.userData.head && anim(c, t, 'idle', i * 0.9));
  quadIntro.visible = false;
  bulbs.forEach((b, i) => { b.visible = (Math.floor(t * 2) + i) % 3 !== 0; });
  if (builds.patinoire.visible) builds.patinoire.userData.skaters.forEach((c, i) => { const a = t * 0.5 + i * 1.05; c.position.set(Math.cos(a) * 5.5, 0.06, Math.sin(a) * 2.8); c.rotation.y = -a; anim(c, t, 'idle', i); });
  if (builds.cabane.visible) builds.cabane.userData.smoke.forEach((s, i) => { const ph = (t * 0.4 + i / 4) % 1; s.position.set(2.5 + Math.sin(ph * 5 + i) * 0.3, 6.6 + ph * 3, -1); s.scale.setScalar(0.6 + ph * 1.5); s.material.opacity = 0.6 * (1 - ph); });
  overlay(t, si, lt);
  renderer.render(scene, camera);
  return si;
};
window.READY = true;
