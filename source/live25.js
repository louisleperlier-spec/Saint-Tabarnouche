// ================= LIVE DU 25 NOVEMBRE (live25.js) =================
// Ce que les donateurs du live du 25 nov ont débloqué. Collé après story10 (monde complet),
// AVANT argile.js (pour être arrondi comme le reste) et explore.js (pour les collisions).
// Les façades regardent +z sauf la tour et l'allée des gifts, qui regardent la ville (-z).
const L25 = {};
{
  const gold = mat(0xd6a531), stone = mat(0xb9bec8);
  const goldStatue = (o, scale = 1.6) => { const c = character(o); c.scale.setScalar(scale); c.traverse((m) => { if (m.isMesh) m.material = gold; }); anim(c, 0, o.pose || 'idle'); return c; };
  const sign = (w, h, lines, opt, x, y, z, ry = 0, parent = scene) => plane(w, h, signTex(lines, opt), x, y, z, ry, parent);
  const wall = (w, h, d, c, x, z, parent = scene) => box(w, h, d, c, x, h / 2, z, parent);
  const group = (x, z, ry = 0) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); return g; };
  const person = (o) => character({ shirt: 0x3a7bd5, ...o });

  // ---------- 1. Allée des gifts (live 25 nov) qui mène à la Grande Tour ----------
  const GIFTS25 = ['MLTT_48', 'XAV', 'FREDDY MERCURY', 'ABY', 'SAMUEL ST-ONGE', 'AYOUB', 'LEGACY', 'PAQUIN', 'CHARLO', 'RAFA', 'JT33', 'OCÉ', 'CHARLOU_GUERIN', 'MATH', 'VINCE', 'MATYS LAJOIE', 'CASEOH', 'JUJJJ', 'NATHAN', 'MARC', 'RAPH', 'EVE', 'DJYK', 'LOUIS-CHARLES', 'ALEXIS TURCOTTE', 'JOSEPH PORTELANCE', 'NICO', 'CATH DE LA LINE', 'JAY', 'SLIMCLIM', 'JORDAN', 'SEB', 'ETIENNE', 'SIMON', 'TSUKIBEANS', 'JEREMIE', 'DY2812HE', 'VAX13R.7', 'NICOLUX', 'PETITPONEY'];
  L25.gifts = GIFTS25;
  const AX = 0, AZ0 = 62, COLS = [-5.2, -2.7, 2.7, 5.2], ROWS = Math.ceil(GIFTS25.length / COLS.length);
  patch(AX, AZ0 + ROWS, 4.2, ROWS * 2 + 8, 0x8c6a44); // chemin central
  patch(AX, AZ0 + ROWS - 1, 13, ROWS * 2 + 2, 0xb9bec8); // trottoir
  GIFTS25.forEach((n, i) => {
    const c = COLS[i % COLS.length], r = Math.floor(i / COLS.length);
    const m = plane(2.3, 1.8, signTex([{ t: '★', size: 100, y: 90, color: '#d6a531' }, { t: n, size: 58, y: 190, color: '#3a2a10' }], { w: 320, h: 250, bg: '#f3e2a8', border: '#b8892a' }), AX + c, 0.045, AZ0 + r * 2, 0);
    m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI; // lisible en marchant vers la tour
  });
  // arche d'entrée
  for (const s of [-1, 1]) box(0.6, 6, 0.6, 0x6b4a2f, AX + s * 6.6, 3, AZ0 - 2.4);
  box(13.8, 0.6, 0.7, 0x6b4a2f, AX, 6.1, AZ0 - 2.4);
  sign(12, 1.9, [{ t: '⭐ TROTTOIR DES GIFTS ⭐', size: 74, y: 70, color: '#fff' }, { t: 'LIVE DU 25 NOVEMBRE · MERCI !', size: 46, y: 140, color: '#ffe48a' }], { w: 900, h: 190, bg: '#c8102e', border: '#7a1f1f' }, AX, 5, AZ0 - 2.8, Math.PI);

  // ---------- 2. La Grande Tour (merveille du monde) + nom de Jaypvvv12 + statue de Dylan ----------
  const TX = 0, TZ = 92;
  const tour = group(TX, TZ);
  wall(10, 6, 10, 0xe9e4d8, 0, 0, tour);
  const etages = [[8, 10], [6.6, 10], [5.2, 9], [3.8, 8]]; let y = 6;
  etages.forEach(([w, h], i) => { box(w, h, w, i % 2 ? 0xdfe8f2 : 0xc9d6e6, 0, y + h / 2, 0, tour); for (let k = 1; k < h; k += 2) box(w + 0.08, 0.35, w + 0.08, 0x2a3550, 0, y + k, 0, tour); box(w + 0.8, 0.5, w + 0.8, 0xd6a531, 0, y + h, 0, tour); y += h; });
  cyl(0.15, 1.6, 9, 8, gold, 0, y + 4.5, 0, tour); const star = new THREE.Mesh(new THREE.OctahedronGeometry(1.1), new THREE.MeshBasicMaterial({ color: 0xffe066 })); star.position.y = y + 9.6; tour.add(star); L25.star = star;
  sign(9, 1.5, [{ t: 'LA GRANDE TOUR', size: 80, y: 62, color: '#1d2b55' }, { t: 'MERVEILLE DU MONDE · SAINT-TABARNOUCHE', size: 34, y: 125, color: '#8a5a1a' }], { w: 900, h: 160, bg: '#f7f1df', border: '#d6a531' }, 0, 4.6, -5.06, Math.PI, tour);
  // nom de Jaypvvv12 en grosses lettres sur la tour (2 côtés)
  const jayTex = signTex([{ t: 'JAYPVVV12', size: 120, y: 95, color: '#ffe066' }], { w: 640, h: 190, bg: '#1d2b55', border: '#d6a531' });
  [[0, -3.5, Math.PI], [0, 3.5, 0], [-3.5, 0, -Math.PI / 2], [3.5, 0, Math.PI / 2]].forEach(([x, z, ry]) => plane(6.2, 1.85, jayTex, x, 21, z, ry, tour));
  box(2.6, 3.4, 0.3, 0x2a3550, 0, 1.7, -5.05, tour); // porte
  // statue de Dylan à l'entrée
  box(2.6, 1.2, 2.6, stone, TX, 0.6, TZ - 8.5);
  const sd = goldStatue({ hat: 'cap', pos: [TX, 1.2, TZ - 8.5], ry: Math.PI, pose: 'point' }, 1.7);
  sign(2.6, 0.6, [{ t: 'DYLAN', size: 64, y: 55, color: '#1d2b55' }], { w: 300, h: 100, bg: '#e7ecf3', border: '#8a96a8' }, TX, 0.65, TZ - 9.82, Math.PI);
  L25.dylanStatue = sd;

  // ---------- 3. Resto de fruits de mer de Dylan ----------
  const fm = group(16, 90);
  wall(9, 4, 7, 0x2f7fb5, 0, 0, fm); box(9.6, 0.6, 7.6, 0xf2f2f2, 0, 4.3, 0, fm);
  sign(8, 1.4, [{ t: '🦞 CHEZ DYLAN 🦞', size: 72, y: 62, color: '#c8102e' }, { t: 'FRUITS DE MER · GÉRANT DYLAN', size: 34, y: 122, color: '#1d2b55' }], { w: 800, h: 150, bg: '#fff7e8', border: '#c8102e' }, 0, 3.3, 3.56, 0, fm);
  box(2, 2.8, 0.2, 0x5a3b22, 0, 1.4, 3.5, fm); for (const x of [-3, 3]) box(1.8, 1.3, 0.1, 0x8fc6ff, x, 2.1, 3.52, fm);
  // homard géant sur le toit
  { const h = new THREE.Group(); h.position.set(0, 4.6, 0); fm.add(h); const red = 0xd8262b; box(1.4, 1, 3.2, red, 0, 0.5, 0, h); box(1, 0.8, 1.4, red, 0, 0.4, -2.1, h); for (const s of [-1, 1]) { box(0.3, 0.3, 1.6, red, s * 1, 0.6, 1.9, h); box(0.9, 0.6, 1, red, s * 1.2, 0.7, 2.9, h); box(0.15, 0.15, 1.8, 0x7a1f1f, s * 0.35, 1.1, 2.4, h); } L25.homard = h; }
  for (let i = 0; i < 3; i++) { box(1.2, 0.1, 1.2, 0xf2f2f2, -3 + i * 3, 1.0, 6.2, fm); cyl(0.1, 0.1, 1, 6, 0x555555, -3 + i * 3, 0.5, 6.2, fm); }

  // ---------- 4. Monument de Paquin ----------
  const pq = group(-16, 70);
  box(4, 0.6, 4, stone, 0, 0.3, 0, pq); box(2.6, 0.8, 2.6, stone, 0, 1, 0, pq);
  const obe = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.1, 9, 4), mat(0xe9e4d8)); obe.rotation.y = Math.PI / 4; obe.position.y = 5.9; obe.castShadow = true; pq.add(obe);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.4, 4), gold); tip.rotation.y = Math.PI / 4; tip.position.y = 11.1; pq.add(tip);
  sign(2.4, 0.9, [{ t: 'PAQUIN', size: 80, y: 62, color: '#3a2a10' }, { t: 'MONUMENT', size: 34, y: 118, color: '#8a5a1a' }], { w: 320, h: 150, bg: '#f3e2a8', border: '#b8892a' }, 0, 1.1, 1.33, 0, pq);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; cyl(0.08, 0.08, 0.8, 5, 0x333333, Math.cos(a) * 3, 0.4, Math.sin(a) * 3, pq); }

  // ---------- 5. Les roteux à CaseOh (stand de hot-dogs) ----------
  const rx = group(10, 70);
  wall(4.4, 2.4, 2.6, 0xf2c230, 0, 0, rx); box(5, 0.3, 3.4, 0xd8262b, 0, 3.0, 0.4, rx);
  for (const x of [-2.2, 2.2]) cyl(0.08, 0.08, 3, 5, 0x888888, x, 1.5, 1.9, rx);
  box(4.4, 0.2, 0.9, 0xf3efe2, 0, 1.25, 1.6, rx);
  sign(4.4, 1, [{ t: 'LES ROTEUX À CASEOH', size: 60, y: 62, color: '#c8102e' }], { w: 600, h: 130, bg: '#fff7e8', border: '#c8102e' }, 0, 3.6, 2.15, 0, rx);
  { const hd = new THREE.Group(); hd.position.set(0, 3.9, 0); hd.rotation.y = 0.3; rx.add(hd); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 2.2, 4, 8), mat(0xe3b46a)); b.rotation.z = Math.PI / 2; hd.add(b); const s = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 2.8, 4, 8), mat(0xb5462b)); s.rotation.z = Math.PI / 2; s.position.y = 0.32; hd.add(s); box(2.4, 0.08, 0.12, 0xf2c230, 0, 0.62, 0, hd); L25.hotdog = hd; }
  person({ shirt: 0xd8262b, hat: 'cap', hatColor: 0xf2c230, frontTex: staffFront('CASEOH'), pos: [10, 0, 69.3], ry: 0 });

  // ---------- 6. SlimClim : nettoyage d'air climatisé ----------
  const sc = group(-30, 72);
  wall(8, 4, 6, 0xdfe8f2, 0, 0, sc); box(8.4, 0.4, 6.4, 0x5a6b7d, 0, 4.2, 0, sc);
  sign(7.4, 1.4, [{ t: '❄️ SLIMCLIM ❄️', size: 74, y: 62, color: '#1f56b8' }, { t: "NETTOYAGE D'AIR CLIMATISÉ", size: 38, y: 122, color: '#3a3a3a' }], { w: 800, h: 150, bg: '#ffffff', border: '#1f56b8' }, 0, 3.2, 3.06, 0, sc);
  box(2.2, 2.6, 0.2, 0x5a6b7d, -2, 1.3, 3.02, sc);
  for (let i = 0; i < 3; i++) { box(1.3, 1, 0.8, 0xcfd6de, 1.2 + i * 1.5, 1.4, 3.5, sc); const gr = box(0.9, 0.7, 0.05, 0x8a96a8, 1.2 + i * 1.5, 1.4, 3.92, sc); gr.castShadow = false; }
  box(1.6, 1.2, 1.2, 0xcfd6de, -2.5, 4.9, -1, sc); box(1.6, 1.2, 1.2, 0xcfd6de, 1.5, 4.9, -1, sc);
  const van = group(-38.5, 75, Math.PI / 2); box(2, 1.8, 4.2, 0xffffff, 0, 1.2, 0, van); box(1.9, 0.9, 1.2, 0x8fc6ff, 0, 1.6, 2.05, van); for (const [x, z] of [[-1, 1.3], [1, 1.3], [-1, -1.3], [1, -1.3]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 10), mat(0x22252e)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.4, z); van.add(w); }
  plane(3.6, 0.8, signTex([{ t: 'SLIMCLIM', size: 70, y: 60, color: '#1f56b8' }], { w: 400, h: 110, bg: '#ffffff', border: '#ffffff' }), 1.02, 1.3, 0, Math.PI / 2, van);
  person({ shirt: 0x1f56b8, hat: 'cap', hatColor: 0xffffff, frontTex: staffFront('SLIMCLIM'), pos: [-27, 0, 76], ry: 0 });

  // ---------- 7. Garage de Gab ----------
  const gb = group(30, 76);
  wall(11, 4.6, 7, 0x8a8f98, 0, 0, gb); box(11.4, 0.5, 7.4, 0x3b3f4a, 0, 4.85, 0, gb);
  for (const x of [-2.6, 2.6]) { box(4.2, 3.4, 0.15, 0x2a2f3d, x, 1.7, 3.5, gb); }
  sign(10, 1.2, [{ t: '🔧 GARAGE GAB 🔧', size: 80, y: 66, color: '#f2c230' }], { w: 900, h: 130, bg: '#22252e', border: '#f2c230' }, 0, 4.05, 3.6, 0, gb);
  { const car = group(32.6, 82.5, 0.2); box(2.1, 0.9, 4.2, 0xe0343b, 0, 0.75, 0, car); box(1.9, 0.8, 2.2, 0x22252e, 0, 1.55, -0.2, car); for (const [x, z] of [[-1.05, 1.3], [1.05, 1.3], [-1.05, -1.3], [1.05, -1.3]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 10), mat(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.42, z); car.add(w); } }
  for (let i = 0; i < 4; i++) cyl(0.5, 0.5, 0.35, 10, 0x111111, 24.6, 0.18 + i * 0.36, 80.5);
  person({ shirt: 0x2a3550, pants: 0x2a3550, hat: 'cap', hatColor: 0xf2c230, frontTex: staffFront('GAB'), pos: [28, 0, 81], ry: 0 });

  // ---------- 8. Ferme laitière de P-Y ----------
  const py = group(-50, 72);
  const barn = gabled(8, 5, 6, 0xb3302b, 0x3b3f4a, 0, 0, py);
  box(2.6, 3.2, 0.15, 0xf3efe2, 0, 1.6, 3.02, py);
  sign(7, 1.2, [{ t: 'FERME LAITIÈRE P-Y', size: 66, y: 66, color: '#3a2a10' }], { w: 760, h: 130, bg: '#f3e2a8', border: '#6b4a2f' }, 0, 5.6, 3.1, 0, py);
  cyl(1.4, 1.4, 9, 12, 0xd8dde4, 6, 4.5, -1, py); const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x9aa4b8)); dome.position.set(6, 9, -1); py.add(dome);
  for (let i = 0; i < 6; i++) for (const z of [5, 13]) cyl(0.08, 0.08, 1.1, 5, 0x6b4a2f, -12 + i * 2.4, 0.55, z, py);
  box(12.5, 0.12, 0.12, 0x6b4a2f, -6, 0.9, 5, py); box(12.5, 0.12, 0.12, 0x6b4a2f, -6, 0.9, 13, py);
  const cows = [];
  [[-9, 8], [-6, 10], [-3, 7.5], [-7.5, 11.8]].forEach(([x, z], i) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = i * 1.3; py.add(c); box(1.1, 0.9, 2, 0xffffff, 0, 1.1, 0, c); box(0.5, 0.5, 0.4, 0x222222, 0.2, 1.3, 0.3, c); box(0.4, 0.4, 0.4, 0x222222, -0.3, 1.2, -0.5, c); box(0.6, 0.6, 0.7, 0xffffff, 0, 1.4, 1.2, c); box(0.62, 0.3, 0.3, 0xf2a7b5, 0, 1.25, 1.6, c); for (const [lx, lz] of [[-0.35, 0.7], [0.35, 0.7], [-0.35, -0.7], [0.35, -0.7]]) box(0.22, 0.7, 0.22, 0xffffff, lx, 0.35, lz, c); cows.push(c); });
  L25.cows = cows;
  person({ shirt: 0x2e9b48, pants: 0x1d4fa8, hat: 'cap', hatColor: 0x2e9b48, frontTex: staffFront('P-Y'), pos: [-48, 0, 76.5], ry: 0 });

  // ---------- 9. Maison champignon de Royal (dans la forêt enchantée) ----------
  const RX = -60.5, RZ = 106;
  foret.children.slice().forEach((o) => { if (o.isGroup && Math.hypot(o.position.x - RX + 1, o.position.z - RZ) < 7.5) foret.remove(o); });
  const mh = group(RX, RZ, -Math.PI / 2);
  cyl(2.2, 2.5, 3.6, 14, 0xf3efe2, 0, 1.8, 0, mh);
  const capM = new THREE.Mesh(new THREE.SphereGeometry(4, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xd8262b)); capM.scale.y = 0.75; capM.position.y = 3.4; capM.castShadow = true; mh.add(capM);
  [[0.8, 3.2, 1.5], [-1.6, 2.6, 2.6], [2.4, 1.8, 2.4], [-2.6, 1.4, -1.8], [1.2, 2.8, -2.4], [-0.6, 1.2, -3.4], [3.2, 0.9, -1]].forEach(([x, yy, z]) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), mat(0xffffff)); d.scale.y = 0.45; d.position.set(x, 3.4 + yy * 0.75, z); mh.add(d); });
  box(1.2, 2, 0.3, 0x6b4a2f, 0, 1, 2.3, mh); const win = new THREE.Mesh(new THREE.CircleGeometry(0.45, 12), new THREE.MeshBasicMaterial({ color: 0xffe28a })); win.position.set(1.3, 2.4, 2.06); win.rotation.y = 0.5; mh.add(win);
  sign(3, 0.8, [{ t: '🍄 CHEZ ROYAL 🍄', size: 60, y: 58, color: '#7a1f1f' }], { w: 420, h: 110, bg: '#efe2c0', border: '#8a6a44' }, 0, 2.75, 2.6, 0, mh);
  patch((RX + FOX) / 2, RZ, Math.abs(FOX - RX), 1.4, 0x8c6a44);

  // ---------- 10. Magasin de Raph : motos, motoneiges et VR + statue ----------
  const RPX = 112, RPZ = 2;
  const rp = group(RPX, RPZ);
  wall(14, 5, 8, 0x22252e, 0, 0, rp); box(14.4, 0.5, 8.4, 0xe0343b, 0, 5.2, 0, rp);
  box(10, 3.2, 0.12, 0x8fc6ff, -1, 1.9, 4.02, rp);
  sign(13, 1.5, [{ t: 'RAPH SPORTS MOTORISÉS', size: 76, y: 66, color: '#ffffff' }, { t: 'MOTOS · MOTONEIGES · VÉHICULES RÉCRÉATIFS', size: 32, y: 128, color: '#f2c230' }], { w: 1000, h: 160, bg: '#e0343b', border: '#22252e' }, 0, 4.3, 4.1, 0, rp);
  const sled = (x, z, c, ry = 0) => { const s = group(x, z, ry); box(1, 0.6, 2.6, c, 0, 0.6, 0, s); box(0.8, 0.5, 1.1, 0x22252e, 0, 1.1, -0.3, s); box(0.9, 0.35, 0.3, 0x8fc6ff, 0, 1.15, 0.6, s); for (const sx of [-0.55, 0.55]) box(0.15, 0.1, 1.4, 0x333333, sx, 0.12, 1.1, s); box(1, 0.3, 1.6, 0x222222, 0, 0.25, -0.6, s); return s; };
  const bike = (x, z, c, ry = 0) => { const b = group(x, z, ry); for (const zz of [-0.8, 0.8]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 6, 12), mat(0x111111)); w.rotation.y = Math.PI / 2; w.position.set(0, 0.45, zz); b.add(w); } box(0.35, 0.45, 1.4, c, 0, 0.9, 0, b); box(0.3, 0.2, 0.7, 0x111111, 0, 1.2, -0.3, b); box(0.9, 0.08, 0.08, 0x777777, 0, 1.3, 0.6, b); return b; };
  sled(RPX - 5, RPZ + 7, 0xf2c230, 0.4); sled(RPX - 2.4, RPZ + 7.5, 0x1f56b8, 0.2); bike(RPX + 1, RPZ + 7.2, 0xe0343b, -0.3); bike(RPX + 3, RPZ + 7.6, 0x2e9b48, -0.5);
  box(2.6, 1.2, 2.6, stone, RPX + 6.5, 0.6, RPZ + 8);
  const sr = goldStatue({ hat: 'helmet', pos: [RPX + 6.5, 1.2, RPZ + 8], ry: 0, pose: 'point' }, 1.7); L25.raphStatue = sr;
  sign(2.6, 0.6, [{ t: 'RAPH', size: 64, y: 55, color: '#1d2b55' }], { w: 300, h: 100, bg: '#e7ecf3', border: '#8a96a8' }, RPX + 6.5, 0.65, RPZ + 9.32);

  // ---------- 11. Piste de ski de Cora ----------
  const SKX = 130, SKZ = 26;
  const mont = new THREE.Mesh(new THREE.ConeGeometry(13, 15, 9), mat(0xf7f9fc)); mont.position.set(SKX, 7.5, SKZ - 4); mont.castShadow = true; mont.receiveShadow = true; scene.add(mont);
  const rocks = new THREE.Mesh(new THREE.ConeGeometry(4, 4, 9), mat(0x9aa4b8)); rocks.position.set(SKX, 13.5, SKZ - 4); scene.add(rocks); const top = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.6, 9), mat(0xffffff)); top.position.set(SKX, 14.8, SKZ - 4); scene.add(top);
  for (let i = 0; i < 9; i++) { const a = -0.9 + i * 0.22, r = 6 + (i % 3) * 3; tree(SKX + Math.sin(a + 2.2) * r * 1.3, SKZ - 4 + Math.cos(a + 2.2) * r, 0.8); }
  // remontée mécanique
  for (let i = 0; i < 4; i++) { const k = i / 3, px = SKX - 10 + k * 9, pz = SKZ + 5 - k * 8, ph = 2 + k * 10.5; cyl(0.15, 0.15, ph + 3, 6, 0x5a6b7d, px, (ph + 3) / 2, pz); box(1.4, 0.2, 0.2, 0x5a6b7d, px, ph + 3, pz); }
  // drapeaux de slalom
  for (let i = 0; i < 6; i++) { const t = (i + 1) / 7, px = SKX + 2 + Math.sin(i * 1.4) * 1.5 + t * 3, pz = SKZ - 4 + 13 * t, ph = 15 * (1 - Math.hypot(px - SKX, pz - SKZ + 4) / 13); cyl(0.05, 0.05, 1.4, 4, 0x333333, px, ph + 0.7, pz); box(0.05, 0.4, 0.6, i % 2 ? 0x1f56b8 : 0xe0343b, px, ph + 1.2, pz + 0.3); }
  const chalet = group(SKX - 14, SKZ + 8);
  gabled(7, 3.4, 5, 0x8b5a2b, 0x7a1f1f, 0, 0, chalet);
  sign(6.4, 1.2, [{ t: '⛷️ PISTE DE SKI', size: 68, y: 58, color: '#1d2b55' }, { t: 'GÉRANTE : CORA', size: 42, y: 118, color: '#c8102e' }], { w: 720, h: 150, bg: '#f7f1df', border: '#8b5a2b' }, 0, 4.0, 2.56, 0, chalet);
  person({ shirt: 0xe86aa8, hat: 'tuque', hatColor: 0xffffff, frontTex: staffFront('CORA'), pos: [SKX - 11, 0, SKZ + 11.5], ry: 0 });
  const skiers = [];
  for (let i = 0; i < 3; i++) { const s = character({ shirt: [0xf2c230, 0x1f56b8, 0x2e9b48][i], hat: 'helmet', hatColor: 0xffffff, pos: [SKX, 0, SKZ], ry: 0 }); s.scale.setScalar(0.8); skiers.push(s); }
  L25.skiers = skiers; L25.ski = [SKX, SKZ - 4];

  // ---------- 12. NASTA Saint-Tabarnouche (Seb, astronaute et proprio) + la Lune ----------
  const NX = 118, NZ = -40;
  const na = group(NX, NZ);
  wall(12, 6, 9, 0xf2f4f7, 0, 0, na); const ndome = new THREE.Mesh(new THREE.SphereGeometry(3.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xcfd6de)); ndome.position.set(-2, 6, -1); na.add(ndome);
  const logo = texCanvas(512, 512, (ctx, w, h) => { ctx.fillStyle = '#1d3f8f'; ctx.beginPath(); ctx.arc(256, 256, 250, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { ctx.fillRect((i * 97) % 480 + 16, (i * 53) % 480 + 16, 6, 6); } ctx.strokeStyle = '#e0343b'; ctx.lineWidth = 22; ctx.beginPath(); ctx.ellipse(256, 270, 230, 80, -0.4, 0, Math.PI * 2); ctx.stroke(); ctx.font = '900 150px "Baloo 2"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('NASTA', 256, 262); });
  plane(3.4, 3.4, logo, -3.6, 3.4, 4.56, 0, na);
  sign(6.4, 1.6, [{ t: 'NASTA', size: 90, y: 66, color: '#1d3f8f' }, { t: 'SAINT-TABARNOUCHE · PROPRIO : SEB', size: 34, y: 130, color: '#3a3a3a' }], { w: 700, h: 170, bg: '#ffffff', border: '#1d3f8f' }, 2.4, 4.2, 4.56, 0, na);
  box(2.4, 3, 0.2, 0x5a6b7d, 2.4, 1.5, 4.52, na);
  // pas de tir + fusée
  const pad = group(NX + 14, NZ + 2);
  box(6, 0.6, 6, 0x8a96a8, 0, 0.3, 0, pad); box(0.8, 20, 0.8, 0xe0343b, -2.6, 10, 0, pad); for (let k = 3; k < 20; k += 4) box(2, 0.25, 0.25, 0xe0343b, -1.6, k, 0, pad);
  const rocket = new THREE.Group(); rocket.position.y = 0.6; pad.add(rocket);
  cyl(1.1, 1.1, 11, 14, 0xf7f9fc, 0, 6, 0, rocket); const nose = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3, 14), mat(0xe0343b)); nose.position.y = 13; rocket.add(nose);
  for (let i = 0; i < 4; i++) { const f = box(0.15, 2.4, 1.6, 0xe0343b, Math.cos(i * Math.PI / 2) * 1.2, 1.4, Math.sin(i * Math.PI / 2) * 1.2, rocket); f.rotation.y = -i * Math.PI / 2 + Math.PI / 2; }
  plane(1.6, 6, texCanvas(100, 380, (ctx, w, h) => { ctx.fillStyle = '#f7f9fc'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#1d3f8f'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 64px "Baloo 2"'; [...'NASTA'].forEach((c, i) => ctx.fillText(c, w / 2, 45 + i * 72)); }), 0, 7, 1.12, 0, rocket);
  const win2 = new THREE.Mesh(new THREE.CircleGeometry(0.4, 12), mat(0x8fc6ff)); win2.position.set(0, 10.6, 1.11); rocket.add(win2);
  L25.rocket = rocket;
  // Seb en habit d'astronaute + son certificat
  const seb = character({ shirt: 0xf7f9fc, pants: 0xf7f9fc, arm: 0xf7f9fc, hat: 'helmet', hatColor: 0xffffff, frontTex: staffFront('SEB'), pos: [NX + 6, 0, NZ + 7.5], ry: 0 }); anim(seb, 0, 'wave');
  const vis = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 8), new THREE.MeshLambertMaterial({ color: 0xf7f9fc, transparent: true, opacity: 0.5 })); vis.position.y = 2.65; seb.add(vis);
  box(0.12, 1.6, 0.12, 0x6b4a2f, NX + 8.2, 0.8, NZ + 7.4);
  sign(1.8, 1.3, [{ t: '📜 CERTIFICAT', size: 48, y: 60, color: '#8a5a1a' }, { t: 'SEB', size: 70, y: 135, color: '#1d3f8f' }, { t: 'ASTRONAUTE OFFICIEL', size: 30, y: 200, color: '#3a2a10' }], { w: 340, h: 250, bg: '#fbf3dc', border: '#d6a531' }, NX + 8.2, 1.9, NZ + 7.5);
  // la Lune de Saint-Tabarnouche (dans le ciel, au-dessus de NASTA)
  const moon = new THREE.Group(); moon.position.set(200, 150, -240); scene.add(moon);
  const mtex = texCanvas(512, 256, (ctx, w, h) => { ctx.fillStyle = '#e8e6df'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { ctx.fillStyle = i % 2 ? '#cfccc2' : '#d9d6cc'; ctx.beginPath(); ctx.arc((i * 137) % w, (i * 71) % h, 6 + (i * 13) % 22, 0, Math.PI * 2); ctx.fill(); } });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(18, 24, 16), new THREE.MeshBasicMaterial({ map: mtex, fog: false })); moon.add(ball);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 6), new THREE.MeshBasicMaterial({ color: 0x555555, fog: false })); pole.position.y = 23; moon.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ map: signTex([{ t: '⚜️', size: 110, y: 90, color: '#fff' }, { t: 'SAINT-T', size: 70, y: 200, color: '#fff' }], { w: 300, h: 260, bg: '#1f56b8', border: '#ffffff' }), fog: false, side: THREE.DoubleSide })); flag.position.set(4.7, 26, 0); moon.add(flag);
  moon.lookAt(0, 0, 0); L25.moon = moon;

  // ---------- 13. Caserne : les commandants Legacy et Xav ----------
  sign(5, 0.9, [{ t: 'CMDTS LEGACY & XAV', size: 60, y: 58, color: '#fff' }], { w: 600, h: 110, bg: '#c8102e', border: '#7a1f1f' }, 66, 4.9, -36.2);
  person({ shirt: 0xc8102e, pants: 0x22252e, hat: 'helmet', hatColor: 0xf2c230, frontTex: staffFront('LEGACY'), pos: [64.6, 0, -33.2], ry: 0.2 });
  person({ shirt: 0xc8102e, pants: 0x22252e, hat: 'helmet', hatColor: 0xf2c230, frontTex: staffFront('XAV'), pos: [67.4, 0, -33.2], ry: -0.2 });
  // chemins vers les nouveaux coins
  patch(0, 54.5, 4.2, 7, 0x8c6a44); patch(-25, 66.5, 50, 3, 0x8c6a44); patch(20, 66.5, 30, 3, 0x8c6a44);
  patch(100, 11, 40, 4.5); patch(118, -16, 4.5, 50); patch(118, 15, 4.5, 4); patch(124, -33, 12, 3);
}
function live25Update(t) {
  if (L25.star) L25.star.rotation.y = t * 1.2;
  if (L25.hotdog) L25.hotdog.position.y = 3.9 + Math.sin(t * 2) * 0.15;
  if (L25.homard) L25.homard.rotation.y = Math.sin(t * 0.8) * 0.3;
  if (L25.cows) L25.cows.forEach((c, i) => { c.children[3].rotation.x = Math.sin(t * 1.5 + i) * 0.15; });
  if (L25.skiers) L25.skiers.forEach((s, i) => { const k = ((t * 0.07 + i / 3) % 1), [x0, z0] = L25.ski; const px = x0 + 1 + Math.sin(k * 14 + i) * 1.6 + k * 2, pz = z0 + 0.5 + k * 13.5; s.position.set(px, Math.max(0, 15 * (1 - Math.hypot(px - x0, pz - z0) / 13)) + 0.05, pz); s.rotation.y = Math.cos(k * 14 + i) * 0.5; });
}
