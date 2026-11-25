
// ================= JOUR 4 =================
// ---------- Chez Tim (café-beigne) ----------
patch(TX, TZ + 1, 16, 12, 0xb5946c);
const tim = new THREE.Group(); tim.position.set(TX, 0, TZ); scene.add(tim);
const timParts = new THREE.Group(); tim.add(timParts);
box(12, 4.6, 8, 0x9b2f2a, 0, 2.3, 0, timParts);
box(12.3, 0.5, 8.3, 0x8f8f96, 0, 0.25, 0, timParts);
box(12.6, 0.6, 8.6, 0xf4ead6, 0, 4.9, 0, timParts);
box(12.2, 0.9, 0.2, 0xf4ead6, 0, 3.9, 4.05, timParts);
// windows
const winTex = texCanvas(512, 200, (ctx) => { ctx.fillStyle = '#3a2a22'; ctx.fillRect(0, 0, 512, 200); for (let i = 0; i < 4; i++) { ctx.fillStyle = '#ffd88a'; ctx.fillRect(10 + i * 126, 12, 114, 176); } });
box(6.4, 2.4, 0.15, new THREE.MeshLambertMaterial({ map: winTex, emissive: 0x2a1a08 }), -2.4, 2.0, 4.05, timParts);
box(1.6, 2.6, 0.15, 0x4a2b1e, 3.5, 1.3, 4.06, timParts);
box(1.2, 2.2, 0.16, 0xc9e3ef, 3.5, 1.3, 4.1, timParts);
// sign
plane(7.5, 1.5, signTex([{ t: 'CHEZ TIM', size: 120, y: 92, color: '#ffffff' }, { t: 'CAFÉ · BEIGNES', size: 40, y: 178, color: '#ffe3a3' }], { w: 640, h: 220, bg: '#c8102e', border: '#ffffff' }), 0, 5.9, 4.4, 0, timParts);
// awning stripes
for (let i = 0; i < 8; i++) box(0.8, 0.12, 1.3, i % 2 ? 0xffffff : 0xc8102e, -5.6 + i * 0.8, 3.35, 4.6, timParts).rotation.x = 0.35;
// giant donut + hockey stick on roof
const donut = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.65, 10, 24), mat(0xd59a52)); donut.position.set(-3, 7.4, 0); donut.castShadow = true; timParts.add(donut);
const icing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.5, 10, 24, Math.PI * 2), mat(0xe86aa8)); icing.position.set(-3, 7.4, 0.25); icing.scale.set(1, 1, 0.6); timParts.add(icing);
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; box(0.08, 0.25, 0.08, [0xf2c230, 0x29a3c9, 0xffffff, 0x2e9b48][i % 4], -3 + Math.cos(a) * 1.4, 7.4 + Math.sin(a) * 1.4, 0.75, timParts).rotation.z = a * 3; }
cyl(0.12, 0.12, 2.2, 6, 0x777777, -3, 6.1, 0, timParts);
const stick = new THREE.Group(); stick.position.set(3.2, 5.2, 0); stick.rotation.z = -0.25; timParts.add(stick);
box(0.35, 6, 0.35, 0xc9a26b, 0, 3, 0, stick); box(2.2, 0.6, 0.35, 0x222222, 1.0, 0.3, 0, stick); box(0.38, 0.8, 0.38, 0x222222, 0, 5.4, 0, stick);
// giant coffee cup
const cup = new THREE.Group(); cup.position.set(5.2, 0, 5.2); timParts.add(cup);
cyl(0.9, 0.7, 2.0, 14, 0xc8102e, 0, 1.0, 0, cup); cyl(0.95, 0.95, 0.25, 14, 0xffffff, 0, 2.1, 0, cup);
const steamT = []; for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.25, 0), mat(0xffffff, { transparent: true, opacity: 0.7 })); cup.add(s); steamT.push(s); }

// staff + comptoir extérieur
function staffFront(name) {
  return texCanvas(256, 256, (ctx) => {
    ctx.fillStyle = '#7a1f1f'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#fff'; ctx.fillRect(40, 70, 176, 80); ctx.fillStyle = '#7a1f1f';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; fitText(ctx, name, 160, 58); ctx.fillText(name, 128, 112);
  });
}
box(7.4, 1.15, 0.9, 0xf4ead6, TX - 4, 0.58, TZ + 6.4); box(7.6, 0.12, 1.1, 0xc8102e, TX - 4, 1.2, TZ + 6.4);
const STAFF = [
  { n: 'MASSÉ', x: -6.6, o: { hat: 'longhair', hatColor: 0x3a2418, skin: 0xf6d2b4 } },
  { n: 'JAY #74', x: -4.9, o: { hat: 'cap', hatColor: 0x7a1f1f, skin: 0xc68a5a } },
  { n: 'TRISTAN', x: -3.2, o: { hat: 'cap', hatColor: 0x7a1f1f } },
  { n: 'MARLEAU', x: -1.5, o: { hat: 'hair', hatColor: 0x6b4a2f, skin: 0xf1c9a0 } },
];
const staffChars = STAFF.map((s) => character({ shirt: 0x7a1f1f, pants: 0x2a2f3d, frontTex: staffFront(s.n), pos: [TX + s.x, 0, TZ + 5.4], ry: 0, ...s.o }));
// cards in Marleau's hand
{ const m = staffChars[3]; const cardTex = signTex([{ t: '#9', size: 120, y: 120, color: '#c8102e' }], { w: 160, h: 230, bg: '#fff', border: '#1d4fa8' });
  for (let i = 0; i < 3; i++) { const p = plane(0.42, 0.6, cardTex, -0.3 + i * 0.3, 1.9 + (i % 2) * 0.05, 0.75, 0, m); p.rotation.z = (i - 1) * 0.25; }
  box(0.7, 0.45, 0.45, 0xc8102e, 0, 1.25, 0.55, m); }
// donuts + cups on the counter
for (let i = 0; i < 5; i++) { const d = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.08, 6, 12), mat([0xd59a52, 0xe86aa8, 0x5b3a24][i % 3])); d.rotation.x = -Math.PI / 2; d.position.set(TX - 7 + i * 1.3, 1.32, TZ + 6.5); scene.add(d); }
for (let i = 0; i < 3; i++) cyl(0.13, 0.1, 0.3, 10, 0xc8102e, TX - 6.3 + i * 2.2, 1.42, TZ + 6.6);

// queue with residents' names
const QUEUE = ['John_therod', 'Olivier', 'Victoria Z.', 'Frank leboeuf', 'sophie_val', 'Momo', 'Koko_baddies', 'Sam Joly Janelle', 'Abygaël', 'Ben 🇨🇦', 'MattketchupF1', 'BEDARD92', 'Jo 🫧', 'LAURA', 'Zk72', 'Logan'];
const QX = TX + 3.5, QZ0 = TZ + 6.2, QS = 1.75;
const queueChars = []; const queueSigns = new THREE.Group(); scene.add(queueSigns);
QUEUE.forEach((n, i) => {
  const c = vcol[i % vcol.length];
  const z = QZ0 + i * QS;
  const ch = character({ shirt: c[0], pants: c[1], skin: [0xf1c9a0, 0xc68a5a, 0x8d5a3b, 0xf6d2b4][i % 4], hat: ['tuque', 'cap', 'hair', 'longhair', 'tuque'][i % 5], hatColor: [0xd8262b, 0x2e9b48, 0x4a2f1e, 0x6b4a2f, 0x3a7bd5][i % 5], pos: [QX + (i % 2 ? 0.25 : -0.25), 0, z], ry: Math.PI - 0.9 });
  queueChars.push(ch);
  const gold = i === 0;
  plane(1.9, 0.57, signTex([{ t: (gold ? '★ ' : '') + n, size: 84, y: 64 }], { w: 512, h: 150, bg: gold ? '#fff3c4' : '#fbf7ec', border: gold ? '#c79a3a' : '#4a2f1b' }), QX + 0.2, i % 2 ? 4.0 : 4.75, z, Math.PI / 2, queueSigns);
  if (gold) plane(1.6, 0.45, signTex([{ t: '1er CLIENT', size: 70, y: 52, color: '#fff' }], { w: 360, h: 100, bg: '#c8102e', border: '#c8102e' }), QX + 0.25, 5.35, z, Math.PI / 2, queueSigns);
});


// ---------- Ti-Gus en quad ----------
const plaidTex = texCanvas(128, 128, (ctx) => { ctx.fillStyle = '#c8202a'; ctx.fillRect(0, 0, 128, 128); ctx.fillStyle = 'rgba(0,0,0,.55)'; for (let i = 0; i < 4; i++) { ctx.fillRect(i * 32, 0, 12, 128); ctx.fillRect(0, i * 32, 128, 12); } });
const camoTex = texCanvas(128, 128, (ctx) => { ctx.fillStyle = '#5b6b3a'; ctx.fillRect(0, 0, 128, 128); for (let i = 0; i < 26; i++) { ctx.fillStyle = ['#3d4a26', '#7a7a4a', '#2b2b1e'][i % 3]; ctx.beginPath(); ctx.ellipse(rnd() * 128, rnd() * 128, 8 + rnd() * 14, 5 + rnd() * 8, rnd() * 3, 0, Math.PI * 2); ctx.fill(); } });
function quadWithTigus() {
  const q = new THREE.Group(); scene.add(q);
  const cm = new THREE.MeshLambertMaterial({ map: camoTex });
  box(1.6, 0.6, 2.6, cm, 0, 1.0, 0, q); box(1.9, 0.18, 1.0, cm, 0, 1.4, 1.0, q); box(1.9, 0.18, 0.9, cm, 0, 1.4, -1.0, q);
  box(0.9, 0.3, 1.0, 0x222222, 0, 1.45, -0.1, q);
  box(1.4, 0.1, 0.1, 0x333333, 0, 1.95, 0.8, q); box(0.1, 0.5, 0.1, 0x333333, 0, 1.7, 0.85, q);
  box(0.5, 0.2, 0.1, 0xfff2b0, -0.4, 1.15, 1.32, q); box(0.5, 0.2, 0.1, 0xfff2b0, 0.4, 1.15, 1.32, q);
  for (const sx of [-0.95, 0.95]) for (const sz of [-0.95, 0.95]) { const w = cyl(0.5, 0.5, 0.45, 12, 0x1b1b1b, sx, 0.5, sz, q); w.rotation.z = Math.PI / 2; }
  const g = character({ hat: 'cap', hatColor: 0xf07c2a, beard: true, shirt: 0xc8202a, frontTex: plaidTex, backTex: plaidTex, arm: new THREE.MeshLambertMaterial({ map: plaidTex }), pants: 0x3a4a2a, boots: 0x3b2a20, pos: [0, 0.55, -0.15], parent: q });
  g.userData.legL.visible = g.userData.legR.visible = false; box(1.0, 0.3, 1.0, 0x3a4a2a, 0, 0.85, 0.2, g);
  q.userData.rider = g; return q;
}
const quadIntro = quadWithTigus(); quadIntro.rotation.y = Math.PI;
const quadQ = quadWithTigus(); quadQ.rotation.y = Math.PI; quadQ.position.set(QX, 0, QZ0 + QUEUE.length * QS + 1.2); queueChars.push(quadQ);
plane(2.2, 0.66, signTex([{ t: '★ Ti-Gus en quad', size: 80, y: 64 }], { w: 512, h: 150, bg: '#fff3c4', border: '#f07c2a' }), QX + 0.4, 5.4, QZ0 + QUEUE.length * QS + 1.2, Math.PI / 2, queueSigns);

// ---------- nouveaux résidents (rue nord-est) ----------
const JX = 30, JZ = -40;
patch(JX + 18, JZ + 6, 50, 4.5);
// bank
const bank = new THREE.Group(); bank.position.set(JX, 0, JZ); scene.add(bank);
box(9, 4.6, 5.5, 0xd9d4c8, 0, 2.3, 0, bank); box(9.6, 0.5, 6, 0xb9b4a8, 0, 4.85, 0, bank);
{ const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 5.4, 1.8, 4, 1), mat(0xb9b4a8)); r.rotation.y = Math.PI / 4; r.scale.set(1.25, 1, 0.75); r.position.y = 6; bank.add(r); }
for (let i = 0; i < 4; i++) cyl(0.32, 0.32, 4.2, 10, 0xf4f1ea, -3 + i * 2, 2.3, 3.1, bank);
plane(6, 1.1, signTex([{ t: 'BANQUE', size: 110, y: 92, color: '#f2c230' }], { w: 600, h: 180, bg: '#1d2b55', border: '#f2c230' }), 0, 4.3, 3.45, 0, bank);
box(1.6, 2.6, 0.15, 0x5a3b22, 0, 1.3, 2.8, bank);
const julien = character({ shirt: 0x22252e, pants: 0x22252e, hat: 'hair', hatColor: 0x2b1d14, glasses: true, pos: [1.6, 0, 3.9], ry: -0.2, parent: bank });
box(0.12, 0.6, 0.05, 0xc8102e, 0, 1.6, 0.29, julien);
box(0.55, 0.42, 0.18, 0x5a3b22, 0, -1.15, 0.15, julien.userData.armR);
const citron = character({ shirt: 0x6b5a45, pants: 0x4a4038, hat: 'tuque', hatColor: 0x777777, beard: true, face: 'smile', pos: [-2.3, 0, 3.9], ry: 0.25, parent: bank });
cyl(0.16, 0.12, 0.3, 10, 0xf2c230, 0, -1.2, 0.3, citron.userData.armR);
plane(1.4, 0.7, signTex([{ t: 'UN 2 $', size: 60, y: 46 }, { t: 'SVP 🙏', size: 46, y: 100 }], { w: 220, h: 130, bg: '#d9b98a', border: '#6b4a2f' }), -3.5, 0.6, 4.3, 0.2, bank);
// épicerie
const epi = new THREE.Group(); epi.position.set(JX + 12, 0, JZ); scene.add(epi);
box(9, 4, 5.5, 0xf4f4f4, 0, 2, 0, epi); box(9.4, 0.4, 5.9, 0x2e9b48, 0, 4.2, 0, epi);
plane(6.5, 1.2, signTex([{ t: 'ÉPICERIE', size: 110, y: 96, color: '#fff' }], { w: 600, h: 190, bg: '#2e9b48', border: '#fff' }), 0, 4.95, 2.9, 0, epi);
box(6, 2.2, 0.15, 0x9fd3e8, 0, 1.9, 2.8, epi);
for (let i = 0; i < 6; i++) box(0.8, 0.12, 1.2, i % 2 ? 0xffffff : 0x2e9b48, -2.0 + i * 0.8, 3.25, 3.3, epi).rotation.x = 0.35;
for (let i = 0; i < 3; i++) { box(1.1, 0.5, 0.8, 0x8b5a2b, 2.5 + (i % 2) * 1.2, 0.25 + Math.floor(i / 2) * 0.5, 3.6, epi); for (let k = 0; k < 6; k++) { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15, 0), mat([0xe0343b, 0xf2c230, 0x2e9b48][i])); f.position.set(2.1 + (i % 2) * 1.2 + (k % 3) * 0.3, 0.6 + Math.floor(i / 2) * 0.5, 3.45 + Math.floor(k / 3) * 0.3); epi.add(f); } }
const gally = character({ shirt: 0x2e9b48, pants: 0x2a2f3d, hat: 'cap', hatColor: 0x2e9b48, skin: 0xf6d2b4, frontTex: staffFront('GALLY'), pos: [0, 0, 3.9], ry: 0, parent: epi });
// ferme
const farm = new THREE.Group(); farm.position.set(JX + 24, 0, JZ); scene.add(farm);
box(8, 4.4, 6, 0xb3302b, 0, 2.2, 0, farm);
{ const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 5.0, 2.4, 4, 1), mat(0x4a4a52)); r.rotation.y = Math.PI / 4; r.scale.set(1.15, 1, 0.85); r.position.y = 5.6; farm.add(r); }
box(3, 3, 0.15, 0xf4f4f4, 0, 1.5, 3.02, farm); box(2.6, 2.6, 0.17, 0xb3302b, 0, 1.5, 3.05, farm);
plane(5.5, 1.1, signTex([{ t: 'FERME LAJOIE', size: 90, y: 92, color: '#fff' }], { w: 600, h: 180, bg: '#6b4a2f', border: '#f4f4f4' }), 0, 3.9, 3.12, 0, farm);
for (let i = 0; i < 3; i++) { const h = cyl(0.6, 0.6, 1.1, 12, 0xe6c35c, 3.6 + (i % 2) * 0.4, 0.6 + Math.floor(i / 2) * 1.0, 3.5 - i * 0.6, farm); h.rotation.z = Math.PI / 2; }
const cow = new THREE.Group(); cow.position.set(-3.4, 0, 4.4); cow.rotation.y = 0.6; farm.add(cow);
box(1.8, 1.0, 0.9, 0xffffff, 0, 1.1, 0, cow); box(0.6, 0.5, 0.5, 0x222222, 0.3, 1.3, 0.25, cow); box(0.6, 0.6, 0.6, 0xffffff, 1.1, 1.5, 0, cow); box(0.3, 0.25, 0.5, 0xf0a8b8, 1.45, 1.35, 0, cow);
for (const [x, z] of [[-0.6, -0.3], [-0.6, 0.3], [0.6, -0.3], [0.6, 0.3]]) box(0.22, 0.6, 0.22, 0xffffff, x, 0.3, z, cow);
const tristanL = character({ shirt: 0xc8302e, pants: 0x2f5fa8, hat: 'cap', hatColor: 0x2e9b48, pos: [1.6, 0, 4.1], ry: -0.2, parent: farm });
box(1.02, 0.7, 0.57, 0x2f5fa8, 0, 1.3, 0.01, tristanL);
{ const pf = new THREE.Group(); pf.position.set(0, -1.05, 0.2); tristanL.userData.armR.add(pf); box(0.07, 2.4, 0.07, 0x8b5a2b, 0, 0.5, 0, pf); for (const dx of [-0.15, 0, 0.15]) box(0.04, 0.4, 0.04, 0x999999, dx, 1.85, 0, pf); box(0.36, 0.05, 0.05, 0x999999, 0, 1.65, 0, pf); }
// caserne
const fire = new THREE.Group(); fire.position.set(JX + 36, 0, JZ); scene.add(fire);
box(9, 4.6, 6, 0xa4473a, 0, 2.3, 0, fire); box(9.4, 0.4, 6.4, 0xf4f1ea, 0, 4.8, 0, fire);
plane(6, 1.1, signTex([{ t: 'CASERNE', size: 110, y: 92, color: '#fff' }], { w: 600, h: 180, bg: '#c8102e', border: '#fff' }), 0, 4.0, 3.05, 0, fire);
box(4.2, 3.0, 0.15, 0x2a2e3a, -1.6, 1.5, 3.0, fire);
const truck = new THREE.Group(); truck.position.set(-1.6, 0, 4.4); fire.add(truck);
box(2.4, 1.6, 4.4, 0xd3262b, 0, 1.2, 0, truck); box(2.2, 0.9, 1.2, 0xd3262b, 0, 2.3, 1.4, truck); box(2.0, 0.6, 0.1, 0x9fd3e8, 0, 2.35, 2.02, truck);
box(0.6, 0.15, 3.4, 0xcccccc, 0, 2.2, -0.6, truck); box(1.0, 0.25, 0.25, 0x2c6fd1, 0, 2.85, 1.4, truck);
for (const sx of [-1.2, 1.2]) for (const sz of [-1.4, 1.4]) { const w = cyl(0.45, 0.45, 0.3, 10, 0x222222, sx, 0.45, sz, truck); w.rotation.z = Math.PI / 2; }
const ced = character({ shirt: 0x2a2a2a, pants: 0x2a2a2a, hat: 'helmet', hatColor: 0xf2c230, boots: 0x111111, pos: [2.6, 0, 4.2], ry: -0.3, parent: fire });
box(1.02, 0.12, 0.57, 0xf2c230, 0, 1.25, 0, ced); box(1.02, 0.12, 0.57, 0xf2c230, 0, 1.75, 0, ced);


// spa / massothérapie
const spa = new THREE.Group(); spa.position.set(JX + 48, 0, JZ); scene.add(spa);
box(9, 4, 5.5, 0xcfe7ea, 0, 2, -0.5, spa); box(9.4, 0.4, 5.9, 0x8b5a2b, 0, 4.2, -0.5, spa);
plane(7, 1.3, signTex([{ t: 'SPA', size: 100, y: 78, color: '#2a6f7a' }, { t: 'MASSOTHÉRAPIE', size: 48, y: 170, color: '#2a6f7a' }], { w: 600, h: 220, bg: '#ffffff', border: '#8b5a2b' }), 0, 3.2, 2.3, 0, spa);
box(1.4, 2.2, 0.15, 0x8b5a2b, 3, 1.1, 2.26, spa);
// massage table + client
box(2.6, 0.18, 1.0, 0xffffff, -1.9, 1.0, 4.2, spa); for (const [x, z] of [[-1.1, -0.4], [-1.1, 0.4], [1.1, -0.4], [1.1, 0.4]]) box(0.12, 0.95, 0.12, 0x8b5a2b, -1.9 + x, 0.48, 4.2 + z, spa);
const client = character({ shirt: 0xf1c9a0, pants: 0xffffff, hat: 'hair', hatColor: 0x4a2f1e, parent: spa });
client.rotation.set(-Math.PI / 2, 0, Math.PI / 2); client.position.set(-0.6, 1.4, 4.2); client.scale.setScalar(0.8);
box(0.9, 0.12, 0.7, 0xffffff, -1.9, 1.17, 4.2, spa);
const masso = character({ shirt: 0xffffff, pants: 0xffffff, hat: 'longhair', hatColor: 0x2b1d14, skin: 0xc68a5a, pos: [-1.9, 0, 3.0], ry: 0.15, parent: spa });
const assistant = character({ shirt: 0xf2c230, pants: 0x2a2f3d, hat: 'cap', hatColor: 0xf2c230, frontTex: signTex([{ t: 'MVP', size: 110, y: 130, color: '#1d2b55' }], { w: 256, h: 256, bg: '#f2c230', border: '#f2c230' }), pos: [0.2, 0, 3.5], ry: 0, parent: spa });
plane(2.4, 0.7, signTex([{ t: '★ PHM_Cxrlot · MVP', size: 70, y: 64 }], { w: 560, h: 140, bg: '#fff3c4', border: '#c79a3a' }), 0.2, 4.0, 3.5, 0, spa);
// hot tub
const tub = new THREE.Group(); tub.position.set(2.2, 0, 4.6); spa.add(tub);
cyl(1.5, 1.5, 0.9, 16, 0x8b5a2b, 0, 0.45, 0, tub);
const water = cyl(1.32, 1.32, 0.1, 16, new THREE.MeshLambertMaterial({ color: 0x5ccbe0, emissive: 0x0a3a44 }), 0, 0.88, 0, tub);
const tubSteam = []; for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), mat(0xffffff, { transparent: true, opacity: 0.5 })); tub.add(s); tubSteam.push(s); }
const bather = character({ shirt: 0x29a3c9, pants: 0x29a3c9, hat: 'tuque', hatColor: 0xd8262b, pos: [0.3, -0.9, -0.3], ry: 0.3, parent: tub });
plane(1.5, 0.6, signTex([{ t: 'BAIN CHAUD', size: 70, y: 56, color: '#fff' }], { w: 360, h: 120, bg: '#2a6f7a', border: '#fff' }), 0, 1.4, 1.55, 0, tub);

