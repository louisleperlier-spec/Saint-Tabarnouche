
// ================= JOUR 5 : monde =================
function gabled(w, h, d, wallC, roofC, x, z, parent = scene, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  box(w, h, d, wallC, 0, h / 2, 0, g);
  const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, Math.max(w, d) * 0.72, h * 0.6, 4, 1), mat(roofC)); r.rotation.y = Math.PI / 4; r.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); r.position.y = h + h * 0.3; r.castShadow = true; g.add(r);
  return g;
}
function shopFront(w, h, d, wallC, label, signBg, signFg, x, z, parent = scene) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
  box(w, h, d, wallC, 0, h / 2, 0, g); box(w + 0.4, 0.4, d + 0.4, 0xf4f1ea, 0, h + 0.2, 0, g);
  plane(w * 0.8, 1.15, signTex([{ t: label, size: 96, y: 92, color: signFg }], { w: 640, h: 180, bg: signBg, border: '#ffffff' }), 0, h - 0.6, d / 2 + 0.05, 0, g);
  box(w * 0.6, h * 0.4, 0.12, 0x9fd3e8, -w * 0.12, h * 0.33, d / 2 + 0.02, g);
  box(1.2, 2.2, 0.14, 0x5a3b22, w * 0.32, 1.1, d / 2 + 0.03, g);
  return g;
}
function nameTag(text, x, y, z, parent = scene, gold = false, w = 2.6) {
  return plane(w, w * 0.29, signTex([{ t: text, size: 80, y: 64 }], { w: 512, h: 150, bg: gold ? '#fff3c4' : '#fbf7ec', border: gold ? '#c79a3a' : '#4a2f1b' }), x, y, z, 0, parent);
}

// ---------- Ferme Michaud (Théa) ----------
const FX = -76, FZ = -16;
patch(FX + 14, FZ + 10, 34, 4, 0xb5946c); // rang
const theaFarm = new THREE.Group(); theaFarm.position.set(FX, 0, FZ); scene.add(theaFarm);
{
  const barn = gabled(8, 5, 7, 0xb3302b, 0x4a4a52, -6, -2, theaFarm);
  box(3, 3.4, 0.15, 0xf4f4f4, 0, 1.7, 3.52, barn); box(2.6, 3.0, 0.17, 0xb3302b, 0, 1.6, 3.55, barn);
  plane(6, 1.1, signTex([{ t: 'FERME MICHAUD', size: 90, y: 92, color: '#fff' }], { w: 600, h: 180, bg: '#6b4a2f', border: '#f4f4f4' }), 0, 4.3, 3.6, 0, barn);
  cyl(1.6, 1.6, 9, 14, 0xc9ccd2, -12, 4.5, -3, theaFarm); { const d = new THREE.Mesh(new THREE.SphereGeometry(1.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x9aa0a8)); d.position.set(-12, 9, -3); theaFarm.add(d); }
  // fence enclosure + animals
  for (let i = 0; i < 9; i++) { box(0.2, 1.1, 0.2, 0x8b5a2b, -10 + i * 1.5, 0.55, 4.2, theaFarm); }
  box(12, 0.15, 0.12, 0x8b5a2b, -4, 0.9, 4.2, theaFarm); box(12, 0.15, 0.12, 0x8b5a2b, -4, 0.5, 4.2, theaFarm);
  const animals = [];
  const cowAt = (x, z, ry) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; theaFarm.add(c); box(1.8, 1.0, 0.9, 0xffffff, 0, 1.1, 0, c); box(0.6, 0.5, 0.5, 0x222222, 0.3, 1.3, 0.25, c); box(0.6, 0.6, 0.6, 0xffffff, 1.1, 1.5, 0, c); box(0.3, 0.25, 0.5, 0xf0a8b8, 1.45, 1.35, 0, c); for (const [a, b] of [[-0.6, -0.3], [-0.6, 0.3], [0.6, -0.3], [0.6, 0.3]]) box(0.22, 0.6, 0.22, 0xffffff, a, 0.3, b, c); animals.push(c); };
  const sheepAt = (x, z, ry) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; theaFarm.add(c); box(1.2, 0.8, 0.8, 0xf2efe6, 0, 0.8, 0, c); box(0.45, 0.45, 0.45, 0x2b2b2b, 0.75, 1.0, 0, c); for (const [a, b] of [[-0.4, -0.25], [-0.4, 0.25], [0.4, -0.25], [0.4, 0.25]]) box(0.16, 0.45, 0.16, 0x2b2b2b, a, 0.22, b, c); animals.push(c); };
  const henAt = (x, z) => { const c = new THREE.Group(); c.position.set(x, 0, z); theaFarm.add(c); box(0.4, 0.35, 0.5, 0xffffff, 0, 0.35, 0, c); box(0.2, 0.2, 0.2, 0xffffff, 0, 0.6, 0.22, c); box(0.08, 0.1, 0.08, 0xe0343b, 0, 0.75, 0.22, c); box(0.08, 0.06, 0.12, 0xf2c230, 0, 0.58, 0.36, c); animals.push(c); };
  cowAt(-8, 1.5, 0.4); cowAt(-4.5, 2.3, -0.3); sheepAt(-1.6, 1.8, 0.8); sheepAt(-0.4, 3.0, 2.2); henAt(1.2, 5.5); henAt(1.8, 6.2); henAt(0.6, 6.4);
  theaFarm.userData.animals = animals;
  // house
  const house = gabled(7, 3.6, 6, 0x6fa8dc, 0x3b3f4a, 8, 0.5, theaFarm);
  box(1.2, 2.2, 0.14, 0xffffff, 0, 1.1, 3.03, house); box(1.4, 1.1, 0.12, 0xfff2b0, -2.1, 2.0, 3.03, house); box(1.4, 1.1, 0.12, 0xfff2b0, 2.1, 2.0, 3.03, house);
  box(7.4, 0.25, 1.6, 0xffffff, 0, 0.5, 3.8, house); for (const px of [-3.4, 3.4]) box(0.2, 2.6, 0.2, 0xffffff, px, 1.8, 4.5, house); box(7.6, 0.2, 2.0, 0x3b3f4a, 0, 3.1, 3.8, house);
  plane(4.2, 0.8, signTex([{ t: 'CHEZ THÉA ♥', size: 86, y: 64, color: '#c8102e' }], { w: 512, h: 128, bg: '#fff', border: '#6fa8dc' }), 0, 3.75, 3.06, 0, house);
  // mailbox
  box(0.15, 1.2, 0.15, 0x6b4a2f, 11.5, 0.6, 6.5, theaFarm); box(0.6, 0.45, 0.9, 0x2c6fd1, 11.5, 1.35, 6.5, theaFarm);
  plane(1.6, 0.42, signTex([{ t: 'T. MICHAUD', size: 70, y: 56 }], { w: 360, h: 110, bg: '#fff', border: '#2c6fd1' }), 11.5, 1.95, 6.98, 0, theaFarm);
}
const thea = character({ shirt: 0xe86aa8, pants: 0x2f5fa8, hat: 'longhair', hatColor: 0xc98a3a, boots: 0x6b4a2f, pos: [FX + 8, 0, FZ + 5.4], ry: 0 });
box(1.02, 0.7, 0.57, 0x2f5fa8, 0, 1.3, 0.01, thea);

// ---------- Rue du live (paroisse, quincaillerie, jus, Crisstement) ----------
const LX = 40, LZ = 6;
patch(LX + 18, LZ + 5.5, 50, 4.5);
const church = new THREE.Group(); church.position.set(LX, 0, LZ - 1); scene.add(church);
box(7, 5, 8, 0xe9e2d4, 0, 2.5, 0, church);
{ const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 5.6, 2.8, 4, 1), mat(0x7a8a9a)); r.rotation.y = Math.PI / 4; r.scale.set(0.9, 1, 1.1); r.position.y = 6.4; church.add(r); }
box(2.2, 7, 2.2, 0xe9e2d4, 0, 3.5, 4.4, church);
{ const sp = new THREE.Mesh(new THREE.ConeGeometry(1.4, 4.5, 4), mat(0x7a8a9a)); sp.rotation.y = Math.PI / 4; sp.position.set(0, 9.2, 4.4); church.add(sp); }
box(0.15, 1.4, 0.15, 0xd6a531, 0, 12.1, 4.4, church); box(0.8, 0.15, 0.15, 0xd6a531, 0, 12.3, 4.4, church);
box(1.4, 2.6, 0.15, 0x5a3b22, 0, 1.3, 5.52, church);
plane(4.5, 0.9, signTex([{ t: 'PAROISSE', size: 96, y: 70, color: '#fff' }], { w: 512, h: 120, bg: '#5a3b22', border: '#d6a531' }), 0, 5.6, 5.55, 0, church);
const nun = (x) => { const n = character({ shirt: 0x1b1b1b, pants: 0x1b1b1b, hat: 'longhair', hatColor: 0x1b1b1b, skin: 0xf1c9a0, dress: mat(0x1b1b1b), pos: [x, 0, 6.7], parent: church }); box(0.86, 0.14, 0.2, 0xffffff, 0, 3.15, 0.42, n); return n; };
const soeurMarie = nun(-1.4), soeurRosa = nun(1.4);
nameTag('Sœur Marie', -1.4, 4.4, 6.7, church, false, 2.0); nameTag('Sœur Rosa', 1.4, 4.4, 6.7, church, false, 2.0);
const quinc = shopFront(8, 4, 5.5, 0xd9d9d9, 'QUINCAILLERIE', '#1d4fa8', '#ffffff', LX + 12, LZ);
for (let i = 0; i < 3; i++) { box(0.6, 1.4, 0.1, 0x8b5a2b, -3 + i * 0.5, 0.9, 3.4, quinc).rotation.z = 0.15; }
const mike = character({ shirt: 0x1d4fa8, pants: 0x2a2f3d, hat: 'cap', hatColor: 0x1d4fa8, frontTex: staffFront('MIKE'), pos: [1.2, 0, 3.9], parent: quinc });
{ const h = new THREE.Group(); mike.userData.armR.add(h); h.position.set(0, -1.05, 0.2); box(0.08, 0.7, 0.08, 0x8b5a2b, 0, 0.3, 0, h); box(0.35, 0.18, 0.18, 0x555555, 0, 0.65, 0, h); }
const jus = shopFront(8, 4, 5.5, 0x2e9b48, 'LA SAQ… DE JUS', '#ffffff', '#2e9b48', LX + 24, LZ);
for (let i = 0; i < 6; i++) { box(0.4, 0.55, 0.3, [0xf2c230, 0xe0343b, 0xff8a3d][i % 3], -2.6 + i * 0.55, 1.4, 2.95, jus); }
const jusKid = character({ shirt: 0xff8a3d, pants: 0x3a7bd5, hat: 'cap', hatColor: 0xe0343b, pos: [-1.4, 0, 3.9], parent: jus }); jusKid.scale.setScalar(0.7);
box(0.3, 0.45, 0.25, 0xf2c230, 0, -1.2, 0.2, jusKid.userData.armR);
const crist = shopFront(8, 4, 5.5, 0xe8c7e8, 'CRISSTEMENT', '#7b2d8b', '#ffffff', LX + 36, LZ);
for (let i = 0; i < 3; i++) { const m = character({ shirt: [0xe86aa8, 0xf2c230, 0x29a3c9][i], pants: 0x22252e, hat: 'longhair', hatColor: 0x4a2f1e, pos: [-3 + i * 1.3, 0, 2.2], parent: crist }); m.scale.setScalar(0.75); }
const lavende = character({ shirt: 0x9b6bd6, pants: 0x22252e, hat: 'longhair', hatColor: 0xe6c35c, dress: mat(0x9b6bd6), pos: [1.6, 0, 3.9], parent: crist });

// ---------- Rue 2 : crèmerie, Calisthèque, Walks to the Mart ----------
const L2Z = -15;
patch(LX + 18, L2Z + 5.5, 50, 4.5);
const creme = shopFront(7, 3.6, 5, 0xfff0f5, 'FOLIE GLACÉE', '#e86aa8', '#ffffff', LX, L2Z);
{ const c = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.6, 10), mat(0xd59a52)); c.rotation.x = Math.PI; c.position.set(0, 5.4, 0); creme.add(c); const s = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 10), mat(0xf7c6d9)); s.position.set(0, 7.0, 0); creme.add(s); const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 10), mat(0xfff6e8)); s2.position.set(0, 7.9, 0); creme.add(s2); }
const biblio = shopFront(9, 4.4, 6, 0xc9a26b, 'LA CALISTHÈQUE', '#3a2418', '#ffd23f', LX + 13, L2Z);
for (let i = 0; i < 5; i++) box(0.3, 0.9, 0.6, [0xe0343b, 0x2c6fd1, 0x2e9b48, 0xf2c230, 0x7b4fd0][i], -3.2 + i * 0.35, 1.0, 3.0, biblio);
const mart = new THREE.Group(); mart.position.set(LX + 30, 0, L2Z - 1); scene.add(mart);
box(16, 5, 8, 0x2a6fd1, 0, 2.5, 0, mart); box(16.4, 0.5, 8.4, 0xf2c230, 0, 5.2, 0, mart);
plane(12, 1.5, signTex([{ t: 'WALKS TO THE MART 🚶', size: 92, y: 96, color: '#ffffff' }], { w: 900, h: 190, bg: '#2a6fd1', border: '#f2c230' }), 0, 4.2, 4.08, 0, mart);
box(5, 2.6, 0.12, 0x9fd3e8, 0, 1.3, 4.05, mart);
for (let i = 0; i < 4; i++) { const cart = new THREE.Group(); cart.position.set(-6 + i * 0.9, 0, 6.2); mart.add(cart); box(0.8, 0.6, 1.1, 0x9aa0a8, 0, 0.8, 0, cart); for (const sx of [-0.3, 0.3]) for (const sz of [-0.4, 0.4]) box(0.12, 0.3, 0.12, 0x222222, sx, 0.2, sz, cart); }
// métiers
const METIERS = [['FERMIER', 0x2f5fa8, 'cap', 0x2e9b48], ['BOULANGER', 0xffffff, 'tuque', 0xffffff], ['BOUCHER', 0xffffff, 'cap', 0xe0343b], ['ÉPICIER', 0x2e9b48, 'cap', 0x2e9b48]];
const metierChars = METIERS.map(([n, sh, hat, hc], i) => { const c = character({ shirt: sh, pants: 0x2a2f3d, hat, hatColor: hc, frontTex: staffFront(n), pos: [LX + 25 + i * 2.2, 0, L2Z + 5.4], ry: 0 }); return c; });
box(0.6, 0.5, 0.15, 0xc8302e, 0, 1.4, 0.32, metierChars[2]); // tablier boucher
// Anthony au Tim
const anthony = character({ shirt: 0x7a1f1f, pants: 0x2a2f3d, hat: 'cap', hatColor: 0x7a1f1f, skin: 0xc68a5a, frontTex: staffFront('ANTHONY'), pos: [TX + 0.3, 0, TZ + 5.4], ry: 0 });

// ---------- Aréna intérieure : 3 équipes ----------
const RX = -10, RZ = -140;
const rink = new THREE.Group(); rink.position.set(RX, 0, RZ); scene.add(rink);
{
  const ice = new THREE.Mesh(new THREE.PlaneGeometry(40, 22), new THREE.MeshLambertMaterial({ map: texCanvas(1024, 564, (ctx) => {
    ctx.fillStyle = '#f2f7fb'; ctx.fillRect(0, 0, 1024, 564);
    ctx.fillStyle = '#d32a2f'; ctx.fillRect(506, 0, 12, 564); ctx.fillStyle = '#1f56b8'; ctx.fillRect(330, 0, 14, 564); ctx.fillRect(680, 0, 14, 564);
    ctx.strokeStyle = '#1f56b8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(512, 282, 90, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '120px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1f56b8'; ctx.globalAlpha = 0.8; ctx.fillText('⚜', 512, 290);
  }) }));
  ice.rotation.x = -Math.PI / 2; ice.position.y = 0.05; ice.receiveShadow = true; rink.add(ice);
  const boardTex = texCanvas(1024, 64, (ctx) => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1024, 64); for (let i = 0; i < 4; i++) { ctx.fillStyle = '#2e9b48'; ctx.fillRect(20 + i * 256, 8, 216, 48); ctx.fillStyle = '#fff'; ctx.font = '800 34px "Baloo 2"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COMMANDITAIRE : GallyxQc', 128 + i * 256, 34); } });
  box(40, 1.1, 0.25, new THREE.MeshLambertMaterial({ map: boardTex }), 0, 0.55, -11, rink); box(40, 0.15, 0.3, 0xf2c230, 0, 1.15, -11, rink);
  box(40, 1.1, 0.25, new THREE.MeshLambertMaterial({ map: boardTex }), 0, 0.55, 11, rink);
  box(0.25, 1.1, 22, 0xffffff, -20, 0.55, 0, rink); box(0.25, 1.1, 22, 0xffffff, 20, 0.55, 0, rink);
  for (let k = 0; k < 6; k++) { box(46, 0.9, 1.6, 0x1d2b55, 0, 1.4 + k * 0.9, -12.5 - k * 1.6, rink); box(46, 0.9, 1.6, 0x1d2b55, 0, 1.4 + k * 0.9, 12.5 + k * 1.6, rink); }
  for (let i = 0; i < 160; i++) { const side = i % 2 ? 1 : -1, k = Math.floor(rnd() * 6); box(0.55, 0.8, 0.45, [0xe0343b, 0x1f56b8, 0xffffff, 0xf2c230, 0xe86aa8][i % 5], -22 + rnd() * 44, 2.2 + k * 0.9, side * (12.5 + k * 1.6), rink); }
  box(60, 22, 1, 0x2a2e3a, 0, 11, -24, rink); box(60, 22, 1, 0x2a2e3a, 0, 11, 24, rink); box(1, 22, 50, 0x2a2e3a, -28, 11, 0, rink); box(1, 22, 50, 0x2a2e3a, 28, 11, 0, rink);
  box(60, 1, 50, 0x23262f, 0, 22, 0, rink);
  plane(9, 5, signTex([{ t: 'VIVE LE', size: 80, y: 80, color: '#fff' }, { t: 'QUÉBEC ⚜️', size: 100, y: 180, color: '#ffffff' }, { t: '2e DIVISION', size: 50, y: 262, color: '#ffd23f' }], { w: 512, h: 300, bg: '#1f56b8', border: '#fff' }), 10, 12, -23.3, 0, rink);
  plane(9, 5, signTex([{ t: 'ÉQUIPE', size: 80, y: 80, color: '#fff' }, { t: 'FÉMININE', size: 100, y: 180, color: '#fff' }, { t: 'ANNA · RACHOU', size: 50, y: 262, color: '#ffd23f' }], { w: 512, h: 300, bg: '#b8327a', border: '#fff' }), -10, 12, -23.3, 0, rink);
  const lt1 = new THREE.PointLight(0xffffff, 60, 60); lt1.position.set(0, 18, 0); rink.add(lt1);
}
function jerseyFL(color = '#ffffff', fg = '#1f56b8') { return texCanvas(256, 256, (ctx) => { ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 256); ctx.fillStyle = fg; ctx.fillRect(0, 196, 256, 30); ctx.font = '140px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚜', 128, 105); }); }
function jerseyBack(name, num, bg, fg) { return texCanvas(256, 256, (ctx) => { ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 256); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = fg; fitText(ctx, name, 236, 46); ctx.fillText(name, 128, 40); if (num !== '') { ctx.font = '800 120px "Baloo 2"'; ctx.fillText(num, 128, 140); } }); }
function player(o) {
  const ch = character({ shirt: o.shirt, pants: o.pants, skin: o.skin, hat: o.hair ? 'longhair' : 'helmet', hatColor: o.hair ? o.hair : o.helmet, frontTex: o.front, backTex: o.back, boots: 0x111111, pos: o.pos, ry: o.ry });
  if (o.hair) box(0.9, 0.3, 0.9, o.helmet, 0, 0.98, 0, ch.userData.head);
  if (o.c) { const ct = texCanvas(64, 64, (ctx) => { ctx.fillStyle = o.cbg; ctx.fillRect(0, 0, 64, 64); ctx.fillStyle = '#fff'; ctx.font = '800 54px "Baloo 2"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('C', 32, 36); }); plane(0.3, 0.3, ct, -0.3, 1.8, 0.29, 0, ch); }
  const st = box(0.1, 1.8, 0.1, 0x8b5a2b, 0, -0.9, 0.15, ch.userData.armR); st.rotation.x = 0.3; box(0.12, 0.12, 0.6, 0x222222, 0, -1.75, 0.45, ch.userData.armR);
  return ch;
}
// Vive le Québec (blanc) : rangée à droite, face caméra (+z)
const VLQ = [['OLI', '1', true], ['ÉMILE LAFLAMME', '17', false], ['JAY#74', '74', false], ['VLQ', '22'], ['VLQ', '9'], ['VLQ', '30']];
const vlqChars = VLQ.map(([n, num, c], i) => player({ shirt: 0xffffff, pants: 0x1f56b8, helmet: 0x1f56b8, front: jerseyFL(), back: jerseyBack(n, num, '#ffffff', '#1f56b8'), pos: [RX + 3 + i * 1.8, 0, RZ + 2 + (i % 2) * 0.5], ry: 0, c, cbg: '#1f56b8', skin: [0xf1c9a0, 0xc68a5a, 0xf6d2b4][i % 3] }));
vlqChars.slice(0, 3).forEach((ch, i) => nameTag(VLQ[i][0] + (VLQ[i][2] ? ' (C)' : ''), RX + 3 + i * 1.8, 4.3 + (i % 2) * 0.7, RZ + 2.3 + (i % 2) * 0.5, scene, i === 0, 2.2));
// Équipe féminine (rose) : rangée à gauche
const FEM = [['ANNA', '7', true], ['RACHOU', '11', true], ['FÉM', '4'], ['FÉM', '19'], ['FÉM', '2']];
const femChars = FEM.map(([n, num, c], i) => player({ shirt: 0xb8327a, pants: 0x22252e, helmet: 0xb8327a, hair: [0xc98a3a, 0x3a2418, 0xe6c35c, 0x6b4a2f, 0x1b1b1b][i], front: jerseyBack('', '', '#b8327a', '#fff'), back: jerseyBack(n, num, '#b8327a', '#ffffff'), pos: [RX - 14 + i * 1.8, 0, RZ + 2 + (i % 2) * 0.5], ry: 0, c, cbg: '#b8327a', skin: [0xf6d2b4, 0xc68a5a, 0xf1c9a0][i % 3] }));
const coachEve = character({ shirt: 0x22252e, pants: 0x22252e, hat: 'longhair', hatColor: 0x3a2418, frontTex: staffFront('COACH'), pos: [RX - 5.5, 0, RZ + 3.6], ry: 0 });
box(0.5, 0.65, 0.05, 0xffffff, 0, -0.9, 0.3, coachEve.userData.armL);
[['ANNA (C)', -14], ['RACHOU (C)', -12.2], ['COACH jxst_eve21', -5.5]].forEach(([n, x], i) => nameTag(n, RX + x, 4.3 + (i % 2) * 0.7, RZ + 2.3 + (i === 1 ? 0.5 : 0) + (i === 2 ? 1.6 : 0), scene, i < 2, 2.4));

// ---------- les 3 constructions possibles ----------
const builds = {};
{ // cabane à sucre au bout du rang
  const g = new THREE.Group(); g.position.set(-36, 0, 32); scene.add(g); builds.cabane = g;
  const c = gabled(9, 3.4, 6, 0x8b5a2b, 0x7a1f1f, 0, 0, g);
  box(1.2, 2.2, 0.14, 0x4a2b1e, 0, 1.1, 3.03, c);
  plane(6, 1.1, signTex([{ t: 'CABANE À SUCRE', size: 82, y: 92, color: '#fff' }], { w: 600, h: 180, bg: '#7a1f1f', border: '#f2c230' }), 0, 2.85, 3.08, 0, c);
  box(1.2, 2.6, 1.2, 0xc9ccd2, 2.5, 5.2, -1, g);
  for (let i = 0; i < 6; i++) { const t = new THREE.Group(); t.position.set(-8 + (i % 3) * 3.2, 0, -6 - Math.floor(i / 3) * 3.5); g.add(t); cyl(0.35, 0.45, 5, 8, 0x5b3a24, 0, 2.5, 0, t); const f = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 0), mat(0xf3f5f9)); f.position.y = 5.4; t.add(f); cyl(0.2, 0.16, 0.35, 8, 0x9aa0a8, 0, 1.4, 0.42, t); }
  // tire sur la neige
  box(3, 0.4, 1.4, 0xffffff, -3.5, 0.6, 5, g); for (let i = 0; i < 5; i++) box(0.4, 0.08, 0.9, 0xc8822a, -4.5 + i * 0.5, 0.84, 5, g);
  const smoke = []; for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), mat(0xf0f0f0, { transparent: true, opacity: 0.6 })); g.add(s); smoke.push(s); } g.userData.smoke = smoke;
}
{ // rue de maisons (Jour 6)
  const g = new THREE.Group(); g.position.set(0, 0, 0); scene.add(g); builds.maisons = g;
  patch(-1, 47, 32, 4, 0xb5946c);
  const MN = CFG.houseNames || [];
  const cols = [0xe6a72a, 0x6fa8dc, 0xe86aa8, 0x2e8b4a, 0xc7302e, 0x9b6bd6, 0xf2efe6];
  MN.forEach((n, i) => { const side = i % 2, k = Math.floor(i / 2); const x = -13 + k * 4.8, z = side ? 43 : 51.5; const h = gabled(3.6, 2.8, 3.4, cols[i % cols.length], 0x3b3f4a, x, z, g, side ? 0 : Math.PI); box(0.9, 1.7, 0.12, 0x5a3b22, 0, 0.85, 1.72, h); plane(3.2, 0.8, signTex([{ t: n, size: 80, y: 64 }], { w: 512, h: 128, bg: '#fbf7ec', border: '#4a2f1b' }), 0, 2.35, 1.78, 0, h); });
}
{ // resto de poutine
  const g = new THREE.Group(); g.position.set(-46, 0, -4); scene.add(g); builds.poutine = g;
  box(8, 4, 6, 0xf2c230, 0, 2, 0, g); box(8.4, 0.4, 6.4, 0x7a1f1f, 0, 4.2, 0, g);
  plane(6.5, 1.2, signTex([{ t: "POUTINE D'OR 🍟", size: 96, y: 96, color: '#7a1f1f' }], { w: 600, h: 190, bg: '#ffd84a', border: '#7a1f1f' }), 0, 3.4, 3.06, 0, g);
  box(1.3, 2.2, 0.14, 0x5a3b22, 2.5, 1.1, 3.03, g); box(3.4, 1.4, 0.12, 0x9fd3e8, -1.4, 1.9, 3.03, g);
  const bowl = cyl(1.8, 1.3, 1.1, 16, 0xffffff, 0, 5.0, 0, g); for (let i = 0; i < 18; i++) box(0.22, 0.22, 1.1, 0xf5c542, -1.1 + (i % 6) * 0.45, 5.7, -0.8 + Math.floor(i / 6) * 0.8, g).rotation.y = i;
  cyl(1.5, 1.5, 0.15, 16, 0x7a4a24, 0, 5.85, 0, g);
  // comptoir de cartons, chacun au nom d'un résident
  const PN = ['John_therod', 'Olivier', 'Victoria Z.', 'Frank leboeuf', 'sophie_val', 'Momo', 'Koko_baddies', 'Abygaël', 'MattketchupF1', 'BEDARD92', 'LAURA', 'Zk72', 'Charles_8', 'brandonmainville2'];
  box(11, 1.0, 2.2, 0x8b5a2b, 0, 0.5, 5.6, g);
  PN.forEach((n, i) => { const row = Math.floor(i / 7), k = i % 7; const x = -4.5 + k * 1.5 + row * 0.75, z = 5.1 + row * 1.0, y = 1.0 + row * 0.25;
    if (row) box(11, 0.25, 1.0, 0x8b5a2b, 0, 1.12, 6.1, g);
    box(1.0, 0.35, 0.7, 0xffffff, x, y + 0.18, z, g); box(0.85, 0.12, 0.55, 0xf5c542, x, y + 0.4, z, g); box(0.8, 0.06, 0.5, 0x7a4a24, x, y + 0.48, z, g);
    const tg = nameTag(n, x, y + 0.85 + row * 0.55, z + 0.36, g, false, 1.4); tg.rotation.x = -0.25; });
  const boss = character({ shirt: 0xffd84a, pants: 0x22252e, hat: 'longhair', hatColor: 0x3a2418, frontTex: staffFront('BOSS'), pos: [-3.2, 0, 3.6], parent: g });
  nameTag('J · LA BOSS 👑', -3.2, 3.7, 3.7, g, true, 2.6);
  const line = []; for (let i = 0; i < 5; i++) { const c = character({ shirt: 0xe0343b, pants: 0x1d2b55, hat: 'helmet', hatColor: 0x1d2b55, frontTex: jerseyFront('#e0343b'), boots: 0x111111, pos: [-6.5 - i * 1.5, 0, 3.4 + (i % 2) * 0.4], ry: 1.2, parent: g }); line.push(c); }
  g.userData.boss = boss; g.userData.line = line;
}
{ // concession de quads (Ti-Gus)
  const g = new THREE.Group(); g.position.set(-31, 0, 58); scene.add(g); builds.quads = g;
  patch(-31, 62, 16, 8, 0x8f8f96);
  box(10, 4, 6, 0xd9d4c8, 0, 2, -3, g); box(10.4, 0.4, 6.4, 0xf07c2a, 0, 4.2, -3, g);
  plane(8, 1.3, signTex([{ t: 'QUADS TI-GUS 🛻', size: 88, y: 96, color: '#fff' }], { w: 640, h: 190, bg: '#f07c2a', border: '#222' }), 0, 3.3, 0.06, 0, g);
  box(5, 2.4, 0.12, 0x9fd3e8, -1.5, 1.4, 0.03, g);
  const qs = []; for (let i = 0; i < 4; i++) { const q = new THREE.Group(); q.position.set(-5.4 + i * 3.6, 0, 4.2); q.rotation.y = 0.5; g.add(q);
    const c = [0xd3312f, 0x2e9b48, 0x2c6fd1, 0xf2c230][i]; box(1.4, 0.5, 2.2, c, 0, 0.75, 0, q); box(1.2, 0.3, 0.9, 0x222222, 0, 1.15, -0.2, q); box(1.6, 0.12, 0.25, 0x333333, 0, 1.3, 0.85, q);
    for (const sx of [-0.8, 0.8]) for (const sz of [-0.75, 0.75]) { const w = cyl(0.42, 0.42, 0.35, 10, 0x1b1b1b, sx, 0.42, sz, q); w.rotation.z = Math.PI / 2; }
    plane(1.0, 0.45, signTex([{ t: ['1 200 $', '1 500 $', '999 $', 'VENDU'][i], size: 80, y: 60, color: '#c8102e' }], { w: 240, h: 110, bg: '#fff', border: '#c8102e' }), 0, 1.75, 1.0, 0, q); qs.push(q); }
  g.userData.quads = qs;
}
{ // patinoire extérieure
  const g = new THREE.Group(); g.position.set(26, 0, 27); scene.add(g); builds.patinoire = g;
  const ice = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), mat(0xdff1fb)); ice.rotation.x = -Math.PI / 2; ice.position.y = 0.06; g.add(ice);
  for (const z of [-4.6, 4.6]) box(16.4, 0.8, 0.25, 0xffffff, 0, 0.4, z, g); for (const x of [-8.1, 8.1]) box(0.25, 0.8, 9.4, 0xffffff, x, 0.4, 0, g);
  for (const x of [-7.4, 7.4]) { box(0.08, 1.2, 1.8, 0xd3312f, x, 0.6, 0, g); }
  for (let i = 0; i < 4; i++) { cyl(0.1, 0.1, 5, 6, 0x6b4a2f, -8 + i * 5.33, 2.5, -5.2, g); box(0.5, 0.3, 0.3, 0xfff2b0, -8 + i * 5.33, 5.1, -5.0, g); }
  box(16, 0.06, 0.06, 0x333333, 0, 4.9, -5.2, g);
  plane(7, 1.2, signTex([{ t: 'PATINOIRE ⛸️', size: 96, y: 96, color: '#fff' }], { w: 640, h: 190, bg: '#1f56b8', border: '#fff' }), 0, 3.2, -5.1, 0, g);
  cyl(0.1, 0.1, 3, 6, 0x6b4a2f, -2.5, 1.5, -5.2, g); cyl(0.1, 0.1, 3, 6, 0x6b4a2f, 2.5, 1.5, -5.2, g);
  const sk = []; for (let i = 0; i < 6; i++) { const c = character({ shirt: [0xe0343b, 0x2c6fd1, 0xf2c230, 0xe86aa8, 0x2e9b48, 0x7b4fd0][i], pants: 0x22252e, hat: i % 2 ? 'tuque' : 'longhair', hatColor: [0xd8262b, 0x3a2418, 0x2c6fd1, 0xc98a3a, 0xf2c230, 0x1b1b1b][i], parent: g }); c.scale.setScalar(0.8); sk.push(c); }
  g.userData.skaters = sk;
}
{ // garderie (Jour 7, demande de user_coralie27)
  const g = new THREE.Group(); g.position.set(-28, 0, 40); scene.add(g); builds.garderie = g;
  const h = gabled(7, 3.2, 5, 0xfff0a8, 0xe86aa8, 0, 0, g);
  box(1.2, 2.0, 0.14, 0x2c6fd1, 0, 1.0, 2.53, h); box(1.3, 1.0, 0.12, 0x9fd3e8, -2.2, 1.8, 2.53, h); box(1.3, 1.0, 0.12, 0x9fd3e8, 2.2, 1.8, 2.53, h);
  plane(5.4, 1.0, signTex([{ t: 'GARDERIE 🧸', size: 96, y: 92, color: '#fff' }], { w: 600, h: 170, bg: '#e86aa8', border: '#fff' }), 0, 2.85, 2.56, 0, h);
  // clôture + jeux
  for (let i = 0; i < 11; i++) box(0.15, 0.8, 0.15, 0xffffff, -5 + i, 0.4, 7, g); box(10, 0.1, 0.1, 0xffffff, 0, 0.7, 7, g);
  const sl = new THREE.Group(); sl.position.set(3.4, 0, 5); g.add(sl); box(1.2, 1.6, 1.2, 0xe0343b, 0, 0.8, 0, sl); const ramp = box(0.9, 0.12, 2.4, 0xf2c230, 0, 0.9, 1.5, sl); ramp.rotation.x = 0.6;
  box(1.6, 0.3, 1.6, 0xf2c230, -3.4, 0.15, 5, g); for (let i = 0; i < 6; i++) box(0.3, 0.3, 0.3, [0xe0343b, 0x2c6fd1, 0x2e9b48][i % 3], -3.9 + (i % 3) * 0.5, 0.45, 4.6 + Math.floor(i / 3) * 0.6, g);
  const kids = []; for (let i = 0; i < 4; i++) { const c = character({ shirt: [0x2c6fd1, 0xe86aa8, 0x2e9b48, 0xf2c230][i], pants: 0x22252e, hat: i % 2 ? 'tuque' : 'hair', hatColor: [0x6b4a2f, 0xe0343b, 0x3a2418, 0x2c6fd1][i], pos: [-2.6 + i * 1.3 + (i > 1 ? 2.2 : 0), 0, 4.6], parent: g }); c.scale.setScalar(0.55); kids.push(c); }
  const coralie = character({ shirt: 0xe86aa8, pants: 0x22252e, hat: 'longhair', hatColor: 0x6b4a2f, frontTex: staffFront('GARDIENNE'), pos: [0.6, 0, 5.9], parent: g });
  nameTag('coralie27', 0.6, 3.5, 5.9, g, true, 2.2);
  g.userData.kids = kids; g.userData.coralie = coralie;
}
{ // Les Poupées qui parlent (TALK) — version IG
  const g = new THREE.Group(); g.position.set(13, 0, 18); scene.add(g); builds.poupees = g;
  const sf = shopFront(9, 4.4, 6, 0xf7d6e6, 'LES POUPÉES QUI PARLENT', '#c2185b', '#ffffff', 0, 0, g);
  for (let i = 0; i < 4; i++) { const d = character({ shirt: [0xe86aa8, 0xf2c230, 0x9b6bd6, 0x29a3c9][i], pants: 0xffffff, hat: 'longhair', hatColor: [0xe6c35c, 0x3a2418, 0xc98a3a, 0x1b1b1b][i], dress: mat([0xe86aa8, 0xf2c230, 0x9b6bd6, 0x29a3c9][i]), pos: [-3.4 + i * 1.0, 1.0, 2.6], parent: g }); d.scale.setScalar(0.4); }
  // ruban + ballons
  box(9.6, 0.25, 0.06, 0xe0343b, 0, 1.3, 4.6, g); for (const x of [-4.8, 4.8]) cyl(0.08, 0.08, 1.6, 6, 0xd6a531, x, 0.8, 4.6, g);
  const balloons = []; for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), new THREE.MeshPhongMaterial({ color: [0xe86aa8, 0xffffff, 0xc2185b][i % 3], shininess: 80 })); b.position.set(i < 3 ? -5.4 : 5.4, 4.6 + (i % 3) * 0.6, 3.2 + (i % 3) * 0.3); g.add(b); balloons.push(b); }
  plane(5.4, 0.9, signTex([{ t: 'GRANDE OUVERTURE 🎉', size: 80, y: 66, color: '#fff' }], { w: 640, h: 130, bg: '#e0343b', border: '#ffd23f' }), 0, 5.3, 3.1, 0, g);
  const talk = character({ shirt: 0x111111, pants: 0x111111, hat: 'longhair', hatColor: 0x1b1b1b, pos: [1.6, 0, 5.4], parent: g });
  nameTag('TALK 🎀', 1.6, 3.5, 5.4, g, true, 2.0);
  g.userData.talk = talk; g.userData.balloons = balloons;
}
Object.values(builds).forEach((g) => (g.visible = false));

// moto électrique de not_roroleb (wheelie)
const moto = new THREE.Group(); scene.add(moto);
{ const b = new THREE.Group(); b.position.y = 0.55; moto.add(b); moto.userData.body = b;
  for (const z of [-0.85, 0.85]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.14, 8, 16), mat(0x1b1b1b)); w.rotation.y = Math.PI / 2; w.position.set(0, 0, z); b.add(w); }
  box(0.25, 0.5, 1.2, 0x1b1b1b, 0, 0.35, 0, b); box(0.3, 0.12, 0.8, 0x111111, 0, 0.7, -0.15, b); for (let i = 0; i < 3; i++) box(0.31, 0.03, 0.1, 0x8a3fc7, 0, 0.77, -0.35 + i * 0.14, b); box(0.35, 0.3, 0.35, 0x1b1b1b, 0, 0.6, 0.55, b);
  for (const x of [-0.12, 0.12]) box(0.07, 0.8, 0.07, 0xd6a531, x, 0.5, 0.82, b); box(0.9, 0.08, 0.08, 0x111111, 0, 0.95, 0.75, b);
  const r = character({ shirt: 0x8fe03a, pants: 0x22252e, hat: 'helmet', hatColor: 0x111111, boots: 0x111111, parent: b });
  r.position.set(0, 0.05, -0.1); r.scale.setScalar(0.75); r.userData.legL.rotation.x = -1.2; r.userData.legR.rotation.x = -1.2; r.userData.armL.rotation.x = -1.3; r.userData.armR.rotation.x = -1.3;
  moto.userData.rider = r; }
const motoTag = nameTag('not_roroleb', 0, 3.4, 0, moto, true, 2.4);
// ---------- confettis ----------
const confetti = []; for (let i = 0; i < 140; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.1), new THREE.MeshBasicMaterial({ color: [0xe0343b, 0xf2c230, 0x2c6fd1, 0x2e9b48, 0xe86aa8][i % 5], side: THREE.DoubleSide })); c.userData = { x: (rnd() - 0.5) * 14, z: (rnd() - 0.5) * 8, o: rnd(), s: 0.6 + rnd() * 0.8 }; c.visible = false; scene.add(c); confetti.push(c); }
function confettiAt(on, t, cx, cz) { confetti.forEach((c) => { c.visible = on; if (!on) return; const u = c.userData; const ph = (t * 0.25 * u.s + u.o) % 1; c.position.set(cx + u.x + Math.sin(t * 2 + u.o * 9) * 0.4, 9 - ph * 9, cz + u.z); c.rotation.set(t * 3 * u.s, t * 2, u.o * 6); }); }
