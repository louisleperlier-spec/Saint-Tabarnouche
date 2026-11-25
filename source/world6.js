
// ================= JOUR 6 : monde =================
// ---------- Galerie de la Capitale ----------
const MX = 42, MZ = -78;
patch(MX, MZ + 9, 40, 8, 0x8f8f96);
const mall = new THREE.Group(); mall.position.set(MX, 0, MZ); scene.add(mall);
box(34, 6, 10, 0xe4ddd0, 0, 3, 0, mall); box(34.6, 0.6, 10.6, 0x8b2e3c, 0, 6.3, 0, mall);
box(6, 8.5, 3, 0xd9cfbd, 0, 4.25, 4.6, mall);
plane(5.8, 1.6, signTex([{ t: 'GALERIE DE', size: 70, y: 66, color: '#fff' }, { t: 'LA CAPITALE', size: 96, y: 150, color: '#ffd23f' }], { w: 600, h: 210, bg: '#8b2e3c', border: '#ffd23f' }), 0, 7.3, 6.12, 0, mall);
box(3.4, 3, 0.12, 0x9fd3e8, 0, 1.5, 6.1, mall);
function mallShop(x, label, bg, fg, wall) { const g = new THREE.Group(); g.position.set(x, 0, 5.05); mall.add(g); box(6.2, 4.6, 0.3, wall, 0, 2.3, 0, g); box(5.2, 2.6, 0.12, 0x9fd3e8, 0, 1.6, 0.2, g); plane(5.8, 1.0, signTex([{ t: label, size: 100, y: 92, color: fg }], { w: 640, h: 180, bg, border: fg }), 0, 3.85, 0.2, 0, g); return g; }
const shopApple = mallShop(-8, 'APPLENOUCH', '#ffffff', '#222222', 0xf4f4f4);
for (let i = 0; i < 3; i++) box(0.5, 0.9, 0.08, 0x222222, -1.5 + i * 1.5, 1.6, 0.35, shopApple);
const shopSphero = mallShop(7, 'SPHERO', '#111111', '#ffffff', 0x111111);
const shopSub = mallShop(13.6, 'CHEZ SUB 🥪', '#2e9b48', '#f2c230', 0x2e9b48);
// statue dorée du maire sur le toit du Sphero
const goldMat = new THREE.MeshPhongMaterial({ color: 0xd6a531, shininess: 90, specular: 0xffffff });
const statue = character({ mayor: true, beard: true, hat: 'tuque', shirt: 0xd6a531, pants: 0xd6a531, skin: 0xd6a531, hatColor: 0xd6a531, boots: 0xd6a531, pos: [MX + 7, 6.6, MZ + 3.2], ry: 0 });
statue.traverse((o) => { if (o.isMesh) o.material = goldMat; }); statue.scale.setScalar(1.8);
box(2.4, 0.6, 2.4, 0xbfb8aa, MX + 7, 6.9, MZ + 3.2);
const ludo = character({ shirt: 0x22252e, pants: 0x2a2f3d, hat: 'hair', hatColor: 0x2b1d14, glasses: true, frontTex: staffFront('LUDO'), pos: [MX - 8, 0, MZ + 6.6], ry: 0 });
const shana = character({ shirt: 0x111111, pants: 0x111111, hat: 'longhair', hatColor: 0x1b1b1b, skin: 0xc68a5a, frontTex: staffFront('SHANA'), pos: [MX + 7, 0, MZ + 6.6], ry: 0 });
const emma = character({ shirt: 0x2e9b48, pants: 0x2a2f3d, hat: 'longhair', hatColor: 0xc98a3a, frontTex: staffFront('EMMA'), pos: [MX + 13.6, 0, MZ + 6.6], ry: 0 });
box(0.9, 0.25, 0.3, 0xe7b46a, 0, -1.15, 0.25, emma.userData.armR);
const mathixSign = plane(4.6, 1.1, signTex([{ t: 'NOM : Mathix 🙌', size: 80, y: 64 }], { w: 512, h: 128, bg: '#fff3c4', border: '#c79a3a' }), MX - 1, 2.6, MZ + 10.5);
cyl(0.08, 0.08, 2.4, 6, 0x6b4a2f, MX - 1, 1.2, MZ + 10.45);

// ---------- services : gym, police, école, retraite ----------
const SVX = -74, SVZ = -74;
patch(SVX + 24, SVZ + 7, 62, 4.5);
const gym = shopFront(9, 4.4, 6, 0x2a2e3a, 'GYM NARK 💪', '#e0343b', '#ffffff', SVX, SVZ);
const gamixG = character({ shirt: 0xe0343b, pants: 0x22252e, hat: 'hair', hatColor: 0x4a2f1e, pos: [0.5, 0, 4.1], ry: 0, parent: gym });
const barbell = new THREE.Group(); gamixG.add(barbell); box(3, 0.12, 0.12, 0x777777, 0, 0, 0, barbell); for (const s of [-1.4, 1.4]) cyl(0.45, 0.45, 0.2, 12, 0x111111, s, 0, 0, barbell).rotation.z = Math.PI / 2;
const police = new THREE.Group(); police.position.set(SVX + 16, 0, SVZ); scene.add(police);
box(10, 4.6, 6, 0xd9d4c8, 0, 2.3, 0, police); box(10.4, 0.5, 6.4, 0x1d2b55, 0, 4.85, 0, police);
plane(7, 1.2, signTex([{ t: 'POSTE DE POLICE', size: 80, y: 92, color: '#fff' }], { w: 640, h: 180, bg: '#1d2b55', border: '#fff' }), 0, 3.9, 3.06, 0, police);
box(1.6, 2.6, 0.14, 0x1d2b55, 0, 1.3, 3.03, police);
const pcar = new THREE.Group(); pcar.position.set(-3.6, 0, 5.4); pcar.rotation.y = Math.PI / 2; police.add(pcar);
box(4, 1.0, 2, 0xffffff, 0, 0.8, 0, pcar); box(2.2, 0.8, 1.8, 0x1d2b55, -0.2, 1.7, 0, pcar);
const lightR = box(0.4, 0.25, 0.5, 0xff2222, -0.2, 2.25, -0.35, pcar), lightB = box(0.4, 0.25, 0.5, 0x2255ff, -0.2, 2.25, 0.35, pcar);
for (const sx of [-1.3, 1.3]) for (const sz of [-1.0, 1.0]) { const w = cyl(0.4, 0.4, 0.3, 10, 0x1b1b1b, sx, 0.4, sz, pcar); w.rotation.x = Math.PI / 2; }
const cop = (x, n, cap) => { const c = character({ shirt: 0x1d2b55, pants: 0x1d2b55, hat: 'cap', hatColor: cap, frontTex: staffFront(n), boots: 0x111111, pos: [x, 0, 4.2], ry: 0, parent: police }); return c; };
const emile = cop(0, 'ÉMILE', 0xd6a531), grizzli = cop(1.8, 'GRIZZLI', 0x1d2b55), tsun = cop(3.6, 'TSUNDERE', 0x1d2b55);
box(0.9, 0.12, 0.92, 0xd6a531, 0, 1.0, 0, emile.userData.head);
const ecole = new THREE.Group(); ecole.position.set(SVX + 32, 0, SVZ - 1); scene.add(ecole);
box(14, 6, 7, 0xb5452f, 0, 3, 0, ecole); box(14.4, 0.4, 7.4, 0xf4f1ea, 0, 6.2, 0, ecole);
for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) box(1.4, 1.2, 0.12, 0xfff2b0, -5.5 + i * 2.2, 2.0 + r * 2.4, 3.53, ecole);
plane(8, 1.2, signTex([{ t: 'ÉCOLE SECONDAIRE', size: 76, y: 92, color: '#fff' }], { w: 640, h: 180, bg: '#3a2418', border: '#ffd23f' }), 0, 5.4, 3.6, 0, ecole);
box(1.8, 2.4, 0.14, 0x5a3b22, 0, 1.2, 3.55, ecole);
const oliE = character({ shirt: 0x2c6fd1, pants: 0x22252e, hat: 'hair', hatColor: 0x6b4a2f, glasses: true, frontTex: staffFront('OLI'), pos: [SVX + 32, 0, SVZ + 4.0], ry: 0 });
box(0.5, 0.65, 0.05, 0x2e9b48, 0, -0.9, 0.3, oliE.userData.armL);
const retraite = gabled(12, 4, 6, 0xf2e6c9, 0x6b4a2f, SVX + 50, SVZ);
plane(8, 1.1, signTex([{ t: 'MAISON DE RETRAITE', size: 70, y: 90, color: '#3a2418' }], { w: 640, h: 170, bg: '#fff', border: '#6b4a2f' }), 0, 3.4, 3.06, 0, retraite);
box(12.4, 0.3, 2.4, 0xffffff, 0, 0.4, 4.2, retraite); box(12.6, 0.2, 2.6, 0x6b4a2f, 0, 3.0, 4.2, retraite);
const elders = []; for (let i = 0; i < 4; i++) { const ch = new THREE.Group(); ch.position.set(-4.5 + i * 3, 0.55, 4.4); retraite.add(ch); box(1.0, 0.12, 1.0, 0x8b5a2b, 0, 0.5, 0, ch); box(1.0, 1.2, 0.12, 0x8b5a2b, 0, 1.1, -0.45, ch); for (const s of [-0.45, 0.45]) { const rk = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 4, 12, Math.PI / 2), mat(0x6b4a2f)); rk.rotation.set(0, Math.PI / 2, Math.PI * 1.25); rk.position.set(s, 0.35, 0); ch.add(rk); } const e = character({ shirt: [0x9b6bd6, 0x6b5a45, 0xe86aa8, 0x2f5fa8][i], pants: 0x5a6070, hat: 'hair', hatColor: 0xdddddd, glasses: i % 2 === 0, pos: [0, 0.1, 0], parent: ch }); e.userData.legL.rotation.x = e.userData.legR.rotation.x = -1.4; e.scale.setScalar(0.85); elders.push(ch); }

// ---------- Noël ----------
const xmas = new THREE.Group(); scene.add(xmas);
const bulbs = [];
function lightString(x0, y0, z0, x1, y1, z1, n) { for (let i = 0; i <= n; i++) { const k = i / n; const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 4), new THREE.MeshBasicMaterial({ color: [0xff3b3b, 0x3bff6b, 0xffd23f, 0x3b9bff][i % 4] })); b.position.set(lerp(x0, x1, k), lerp(y0, y1, k) - Math.sin(k * Math.PI) * 0.3, lerp(z0, z1, k)); xmas.add(b); bulbs.push(b); } }
lightString(-6.5, 4.6, -3.9, 4.5, 4.6, -3.9, 26); // hôtel de ville
lightString(TX - 6, 4.7, TZ + 4.3, TX + 6, 4.7, TZ + 4.3, 26); // Chez Tim
lightString(MX - 17, 6.1, MZ + 5.4, MX + 17, 6.1, MZ + 5.4, 60);
function wreath(x, y, z, parent = xmas) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.18, 6, 14), mat(0x1f6b33)); w.position.set(x, y, z); parent.add(w); box(0.3, 0.2, 0.1, 0xe0343b, x, y - 0.5, z + 0.12, parent); }
wreath(-1, 3.2, -3.85); wreath(TX + 3.5, 3.0, TZ + 4.2);
// magasin de sapins
const SAX = -10, SAZ = 11;
patch(SAX, SAZ, 9, 6, 0xe1e6ee);
const sapinShop = new THREE.Group(); sapinShop.position.set(SAX, 0, SAZ); scene.add(sapinShop);
box(3, 2.4, 2, 0xc7302e, -3, 1.2, -2, sapinShop); plane(3.6, 0.8, signTex([{ t: 'SAPINS 🎄', size: 90, y: 64, color: '#fff' }], { w: 512, h: 128, bg: '#1f6b33', border: '#fff' }), -3, 2.8, -0.95, 0, sapinShop);
const sapins = []; for (let i = 0; i < 8; i++) { const t = tree(0, 0, 0.35 + (i % 3) * 0.08); t.position.set(SAX - 1.5 + (i % 4) * 1.6, 0, SAZ - 0.8 + Math.floor(i / 4) * 2.2); sapins.push(t); }
const balls = []; sapins.forEach((t, i) => { for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshPhongMaterial({ color: [0xe0343b, 0xf2c230, 0x2c6fd1, 0xe86aa8][k], shininess: 80 })); b.position.set(Math.cos(k * 1.7) * 1.5, 2.2 + k * 0.7, Math.sin(k * 1.7) * 1.5); t.add(b); balls.push(b); } });
// le Grinch
const grinch = character({ shirt: 0xc7302e, pants: 0xc7302e, skin: 0x7dbb3a, hat: 'tuque', hatColor: 0xc7302e, face: 'angry', pos: [SAX + 3.4, 0, SAZ + 2.6], ry: -0.8 });
const stolen = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshPhongMaterial({ color: 0xe0343b, shininess: 80 })); stolen.position.set(0, -1.2, 0.3); grinch.userData.armR.add(stolen);
const giftG = box(0.8, 0.8, 0.8, 0x2c6fd1, SAX + 4.2, 0.4, SAZ + 3.2); box(0.85, 0.12, 0.85, 0xf2c230, SAX + 4.2, 0.82, SAZ + 3.2);
xmas.visible = sapinShop.visible = grinch.visible = giftG.visible = !!CFG.xmas; sapins.forEach((t) => (t.visible = !!CFG.xmas));
