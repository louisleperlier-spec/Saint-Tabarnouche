// ================= EXPLORATION LIBRE =================
const DATA = JSON.parse(document.getElementById('data').textContent);
const $ = (s) => document.querySelector(s);

// ---------- état du monde : tout ce qui est bâti ----------
['cabane', 'maisons', 'garderie', 'poutine', 'patinoire', 'poupees'].forEach((k) => { builds[k].visible = true; builds[k].scale.y = 1; });
builds.quads.visible = false;
timParts.visible = true; timParts.scale.y = 1; crane.visible = false; queueSigns.visible = true;
staffChars.forEach((c) => (c.visible = true)); queueChars.forEach((c) => (c.visible = true));
dust.forEach((d) => (d.visible = false)); confetti.forEach((c) => (c.visible = false));
quadIntro.visible = false;
// ---------- constructions du 25 novembre (vidéos recensement + aéroport) ----------
lightAt('day'); lampG.visible = false;
scene.traverse((o) => { if (o.isPointLight) o.visible = false; });
sapinG.visible = true; sapinG.scale.set(1, 1, 1); trottoirG.visible = true;
airport.visible = true; airport.scale.set(1, 1, 1); plane1.visible = true; airport.userData.statue.visible = true;
around.visible = true; around.userData.watchers.forEach((c) => (c.visible = true));
passengers.forEach((c, i) => { c.visible = true; c.position.set(APX - 20 + i * 1.6, 0, APZ + 2.5); c.rotation.y = 0; });
moto.position.set(9, 0, 47.2);
// ---------- stand de merch (boutique officielle) ----------
const MSX = 20, MSZ = -8;
const merch = new THREE.Group(); merch.position.set(MSX, 0, MSZ); scene.add(merch);
function merchTex(kind) {
  return texCanvas(256, 256, (ctx) => {
    ctx.clearRect(0, 0, 256, 256); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (kind === 'tee' || kind === 'hoodie') {
      const c = kind === 'tee' ? '#1f56b8' : '#e0343b';
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(78, 30); ctx.lineTo(178, 30); ctx.lineTo(240, 78); ctx.lineTo(214, 118); ctx.lineTo(188, 100); ctx.lineTo(188, 236); ctx.lineTo(68, 236); ctx.lineTo(68, 100); ctx.lineTo(42, 118); ctx.lineTo(16, 78); ctx.closePath(); ctx.fill();
      if (kind === 'hoodie') { ctx.fillStyle = '#b8222a'; ctx.beginPath(); ctx.arc(128, 36, 34, Math.PI, 0); ctx.fill(); ctx.fillRect(98, 170, 60, 34); }
      ctx.fillStyle = '#fff'; ctx.font = '800 54px "Baloo 2", sans-serif'; ctx.fillText('⚜', 128, 112);
      ctx.font = '800 26px "Baloo 2", sans-serif'; ctx.fillText('SAINT-T', 128, 150);
    } else if (kind === 'affiche') {
      ctx.fillStyle = '#fbf7ec'; ctx.fillRect(40, 10, 176, 236); ctx.strokeStyle = '#5a3b22'; ctx.lineWidth = 6; ctx.strokeRect(40, 10, 176, 236);
      ctx.fillStyle = '#1f56b8'; ctx.fillRect(52, 22, 152, 120); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(70, 142); ctx.lineTo(110, 70); ctx.lineTo(150, 142); ctx.fill(); ctx.fillStyle = '#e0343b'; ctx.fillRect(140, 90, 40, 52);
      ctx.fillStyle = '#222'; ctx.font = '800 22px "Baloo 2", sans-serif'; ctx.fillText('SAINT-', 128, 170); ctx.font = '800 26px "Baloo 2", sans-serif'; ctx.fillText('TABARNOUCHE', 128, 198); ctx.fillStyle = '#e0343b'; ctx.font = '800 16px "Baloo 2", sans-serif'; ctx.fillText('LA VILLE BÂTIE PAR TIKTOK', 128, 226);
    } else {
      ctx.fillStyle = '#c79a3a'; ctx.fillRect(14, 40, 228, 176); ctx.fillStyle = '#fffaf0'; ctx.fillRect(26, 52, 204, 152);
      ctx.fillStyle = '#1d2b55'; ctx.font = '800 20px "Baloo 2", sans-serif'; ctx.fillText('CERTIFICAT', 128, 80); ctx.font = '800 14px "Baloo 2", sans-serif'; ctx.fillText('DE MÉTIER OFFICIEL', 128, 102);
      ctx.fillStyle = '#c8102e'; ctx.font = '800 24px "Baloo 2", sans-serif'; ctx.fillText('TON NOM ICI', 128, 138); ctx.fillStyle = '#6b7080'; ctx.font = '800 13px "Baloo 2", sans-serif'; ctx.fillText('Ville de Saint-Tabarnouche', 128, 168);
      ctx.fillStyle = '#d6a531'; ctx.beginPath(); ctx.arc(196, 186, 16, 0, Math.PI * 2); ctx.fill();
    }
  });
}
{
  patch(MSX, MSZ + 3, 12, 9, 0xb5946c);
  box(9, 4.2, 0.4, 0x2a3550, 0, 2.1, -1.8, merch); // mur du fond
  box(9, 1.1, 1.6, 0xf6f1e6, 0, 0.55, 1.4, merch); box(9.2, 0.15, 1.8, 0xe0343b, 0, 1.15, 1.4, merch); // comptoir
  for (const x of [-4.4, 4.4]) for (const z of [-1.6, 2.1]) box(0.25, 4.4, 0.25, 0x6b4a2f, x, 2.2, z, merch);
  for (let i = 0; i < 9; i++) box(1.02, 0.14, 4.4, i % 2 ? 0xffffff : 0xe0343b, -4.1 + i * 1.02, 4.55, 0.25, merch).rotation.x = -0.12;
  plane(8, 1.3, signTex([{ t: 'BOUTIQUE SAINT-T ⚜️', size: 82, y: 70, color: '#fff' }, { t: 'merch officiel', size: 34, y: 140, color: '#ffd23f' }], { w: 700, h: 180, bg: '#1f56b8', border: '#fff' }), 0, 5.4, 2.3, 0, merch);
  [['certif', -3.15], ['affiche', -1.05], ['tee', 1.05], ['hoodie', 3.15]].forEach(([k, x]) => { const m = plane(1.9, 1.9, merchTex(k), x, 2.5, -1.58, 0, merch); m.material.transparent = true; });
  ['CERTIFICAT', 'AFFICHE', 'T-SHIRT', 'HOODIE'].forEach((t, i) => plane(1.6, 0.36, signTex([{ t, size: 60, y: 46, color: '#1d2b55' }], { w: 320, h: 80, bg: '#ffd23f', border: '#ffd23f' }), -3.15 + i * 2.1, 1.3, -1.58, 0, merch));
  // piles de t-shirts pliés sur le comptoir
  for (let i = 0; i < 3; i++) { box(0.9, 0.12, 0.7, 0x1f56b8, -2.5, 1.28 + i * 0.13, 1.3, merch); box(0.9, 0.12, 0.7, 0xe0343b, 2.5, 1.28 + i * 0.13, 1.3, merch); }
  merch.userData.seller = character({ shirt: 0x1f56b8, pants: 0x22252e, hat: 'tuque', hatColor: 0xe0343b, frontTex: staffFront('BOUTIQUE'), pos: [MSX, 0, MSZ + 0.2], ry: 0 });
} moto.rotation.y = -Math.PI / 2;
// pancarte « prochain vote » devant les 3 terrains
plane(6, 1.1, signTex([{ t: 'PROCHAIN VOTE 🗳️', size: 80, y: 90, color: '#fff' }], { w: 640, h: 170, bg: '#e0343b', border: '#fff' }), 0, 3.6, LOTZ - 3.2);
box(0.2, 3.2, 0.2, 0x6b4a2f, -2.6, 1.6, LOTZ - 3.3); box(0.2, 3.2, 0.2, 0x6b4a2f, 2.6, 1.6, LOTZ - 3.3);

// ---------- lieux ----------
// f = distance devant la façade (+z) où on arrive ; yaw 0 = on regarde vers -z
const PLACES = [
  { id: 'place', e: '🏛️', n: 'Hôtel de ville', d: 'Là où le maire travaille. Le mur des OG et le recensement sont ici.', x: -1, z: -7, f: 9, j: 1 },
  { id: 'arena', e: '🏒', n: "L'aréna", d: 'Hockey, 2e division et équipe féminine. La cantine est juste à côté.', x: -26, z: -6, f: 11, j: 3 },
  { id: 'interieur', e: '🥅', n: "Intérieur de l'aréna", d: 'Les 3 équipes : Vive le Québec, l\'équipe féminine et les commanditaires.', x: -10, z: -140, f: 2, j: 5 },
  { id: 'tim', e: '☕', n: 'Chez Tim', d: 'Le café du coin, avec la file des premiers clients.', x: -22, z: 16, f: 9, j: 4 },
  { id: 'sapins', e: '🎄', n: 'Les sapins de Noël', d: 'Le magasin de sapins… surveillé par le Grinch.', x: -10, z: 11, f: 7, j: 6 },
  { id: 'poupees', e: '🎀', n: 'Les Poupées qui parlent', d: 'La boutique de TALK. Grande ouverture !', x: 13, z: 18, f: 9, j: 7 },
  { id: 'cabane', e: '🍁', n: 'La cabane à sucre', d: 'Choisie par vous au vote. Tire sur la neige incluse.', x: -36, z: 32, f: 9, j: 5 },
  { id: 'maisons', e: '🏡', n: 'Rue des Érables', d: 'Les premières maisons des abonnés.', x: -1, z: 47, f: 0, j: 6, yaw: 0.0, h: true },
  { id: 'garderie', e: '🧸', n: 'La garderie', d: 'Demandée par user_coralie27.', x: -28, z: 40, f: 10, j: 7 },
  { id: 'poutine', e: '🍟', n: "La Poutine d'Or", d: 'Gagnante du vote du Jour 6. J est la boss.', x: -46, z: -4, f: 10, j: 7 },
  { id: 'patinoire', e: '⛸️', n: 'La patinoire extérieure', d: 'Gagnante du Jour 8 : 1 500 $ du coffre.', x: 26, z: 27, f: 9, j: 8 },
  { id: 'vote', e: '🗳️', n: 'Les terrains du prochain vote', d: '', x: 0, z: 30, f: 8, j: 8 },
  { id: 'merch', e: '👕', n: 'Boutique Saint-T', d: 'Le stand de merch officiel : certificat de métier, affiche, t-shirt et hoodie.', x: 20, z: -8, f: 7, j: 10, merch: true },
  { id: 'sapin', e: '🌲', n: 'Le sapin géant', d: 'Le sapin des roses : débloqué par le live du 24 novembre (100 roses). Merci !', x: 9, z: 9, f: 9, j: 9 },
  { id: 'trottoir', e: '⭐', n: 'Le trottoir des gifts', d: 'Les noms des 11 personnes qui ont aidé pendant le live sont gravés dans le trottoir.', x: -2, z: 12, f: -2.5, j: 9, yaw: Math.PI },
  { id: 'usine', e: '🏭', n: 'Usine Vieilles Épices', d: "L'usine de Vinsso, avec sa statue en or devant.", x: -20, z: 120, f: 15, j: 9 },
  { id: 'lp', e: '🏗️', n: 'Centre de construction LP', d: 'Le chef de chantier de la ville : LP, le plus généreux du live.', x: 28, z: 120, f: 13, j: 9 },
  { id: 'foret', e: '🍄', n: 'La forêt enchantée', d: 'La forêt de Royal, avec sa statue au bout du chemin. Faut venir dans la forêt…', x: -70, z: 112, f: 20, j: 9 },
  { id: 'alp', e: '✈️', n: 'Aéroport Louis-P.-Tessier', d: "L'ALP : terminal, tour de contrôle, l'avion d'Air Tabarnouche et la statue en or à l'entrée. Le vol 001 cherche son pilote !", x: 110, z: 86, f: 10, j: 10 },
  { id: 'hotel', e: '🏨', n: "L'hôtel de l'ALP", d: "L'hôtel juste à côté de l'aéroport.", x: 80, z: 84, f: 9, j: 10 },
  { id: 'animaux', e: '🐶', n: 'Garderie chiens & chats', d: 'Pour faire garder ton animal pendant ton voyage.', x: 140, z: 84, f: 10, j: 10 },
  { id: 'avions', e: '🛫', n: 'Parc des avions', d: "Le parc pour regarder les avions décoller, de l'autre côté de la piste.", x: 106, z: 124, f: 3, j: 10 },
  { id: 'tabar30', e: '🛍️', n: 'Quartier Tabar30', d: "Le grand centre d'achats, relié à l'aéroport par le train TEM.", x: 58, z: 58, f: 11, j: 10 },
  { id: 'tem', e: '🚆', n: 'Gare du TEM', d: "Train Express Tabarnouche : du Quartier Tabar30 jusqu'à l'aéroport.", x: 94, z: 66.5, f: 6, j: 10 },
  { id: 'paroisse', e: '⛪', n: 'La paroisse', d: 'Sœur Marie et Sœur Rosa.', x: 40, z: 5, f: 10, j: 4 },
  { id: 'quinc', e: '🔨', n: 'La quincaillerie', d: 'Tenue par Mike.', x: 52, z: 6, f: 8, j: 4 },
  { id: 'saq', e: '🧃', n: 'La SAQ… de jus', d: 'Version pour enfants : juste du jus.', x: 64, z: 6, f: 8, j: 4 },
  { id: 'crisstement', e: '👕', n: 'Boutique Crisstement', d: 'La boutique de vêtements de Lavende.', x: 76, z: 6, f: 8, j: 5 },
  { id: 'creme', e: '🍦', n: 'La Folie Glacée', d: 'La crèmerie.', x: 40, z: -15, f: 8, j: 4 },
  { id: 'biblio', e: '📚', n: 'La Calisthèque', d: 'La bibliothèque.', x: 53, z: -15, f: 8, j: 4 },
  { id: 'mart', e: '🛒', n: 'Walks to the Mart', d: 'Le grand magasin que vous demandiez (« À quand un Walmart? »). Épiciers et métiers devant.', x: 70, z: -16, f: 10, j: 7 },
  { id: 'banque', e: '🏦', n: 'La banque', d: '', x: 30, z: -40, f: 8, j: 4 },
  { id: 'epicerie', e: '🥕', n: "L'épicerie", d: 'Fondée par GallyxQc.', x: 42, z: -40, f: 8, j: 4 },
  { id: 'lajoie', e: '🐄', n: 'La ferme Lajoie', d: '', x: 54, z: -40, f: 8, j: 4 },
  { id: 'caserne', e: '🚒', n: 'La caserne', d: 'Les pompiers de la ville.', x: 66, z: -40, f: 8, j: 4 },
  { id: 'spa', e: '💆', n: 'Le spa', d: 'Massothérapie et bain chaud.', x: 78, z: -40, f: 8, j: 4 },
  { id: 'galerie', e: '🛍️', n: 'Galerie de la Capitale', d: 'Le centre commercial, nommé par Mathix : Applenouch, Sphero, la sandwicherie.', x: 42, z: -78, f: 12, j: 6 },
  { id: 'ferme', e: '🌾', n: 'La ferme Michaud', d: 'La ferme et la maison de Théa.', x: -76, z: -16, f: 12, j: 5 },
  { id: 'gym', e: '💪', n: 'Gym Nark', d: 'Le gym de gamixlepoisson.', x: -74, z: -74, f: 8, j: 6 },
  { id: 'police', e: '🚓', n: 'Le poste de police', d: 'Commandant Émile et son équipe.', x: -58, z: -74, f: 9, j: 6 },
  { id: 'ecole', e: '🏫', n: "L'école secondaire", d: 'Celle d\'Oli.', x: -42, z: -75, f: 9, j: 6 },
  { id: 'retraite', e: '👵', n: 'La maison de retraite', d: '', x: -24, z: -74, f: 10, j: 6 },
];
const SHORT = {"place": "Hôtel de ville", "arena": "Aréna", "interieur": "Aréna (dedans) ↑", "tim": "Chez Tim", "sapins": "Sapins", "poupees": "Poupées (TALK)", "cabane": "Cabane à sucre", "maisons": "Rue des Érables", "garderie": "Garderie", "poutine": "Poutine d'Or", "patinoire": "Patinoire", "vote": "Prochain vote", "paroisse": "Paroisse", "quinc": "Quincaillerie", "saq": "SAQ de jus", "crisstement": "Crisstement", "creme": "Folie Glacée", "biblio": "Calisthèque", "mart": "Walks to the Mart", "banque": "Banque", "epicerie": "Épicerie", "lajoie": "Ferme Lajoie", "caserne": "Caserne", "spa": "Spa", "galerie": "Galerie", "ferme": "Ferme Michaud", "gym": "Gym Nark", "police": "Police", "ecole": "École", "retraite": "Retraite", "merch": "Boutique", "sapin": "Sapin géant", "trottoir": "Trottoir des gifts", "usine": "Vieilles Épices", "lp": "Centre LP", "foret": "Forêt enchantée", "alp": "Aéroport ALP", "hotel": "Hôtel ALP", "animaux": "Chiens & chats", "avions": "Parc des avions", "tabar30": "Tabar30", "tem": "Gare TEM"};
PLACES.forEach((p) => { p.s = SHORT[p.id] || p.n; });
const PL_MAPZ = { interieur: -93 };
const PL = Object.fromEntries(PLACES.map((p) => [p.id, p]));
PL.vote.d = 'La ville vote pour la suite : ' + DATA.prochainVote.join(' · ') + '. Le commentaire le plus liké décide.';
// où travaille chaque habitant
const WORK = { 'iamtalk': 'poupees', 'Lavende': 'crisstement', 'gamixlepoisson': 'gym', '..L.SHANA.L..': 'galerie', 'Mathix': 'galerie', 'Ludo': 'galerie', 'emmagmorena': 'galerie', 'Mike': 'quinc', 'Émile': 'police', 'Maudit Grizzli': 'police', 'Sœur Marie': 'paroisse', 'Sœur Rosa': 'paroisse', 'beaa.privatee': 'sapins', 'Oli': 'interieur', 'jxst_eve21': 'interieur', 'Anna': 'interieur', 'Rachou': 'interieur', 'not_roroleb': 'maisons', 'user_coralie27': 'garderie', 'Théa Michaud': 'ferme', 'Anthony': 'tim', 'edward.dubthibaul': 'poutine', 'J ♡': 'poutine', 'malie3410': 'arena', 'GallyxQc': 'epicerie' };
const BMAP = { poutine: 'poutine', place: 'place', arena: 'arena', garderie: 'garderie', garage: 'maisons', commerces: 'mart', ferme: 'ferme', tim: 'tim', jo: 'place' };
const EXTRA = [
  { p: 'LP (louphil1)', r: 'Chef de chantier, Centre de construction LP', at: 'lp', j: 9 },
  { p: 'Vinsso (vinsso1)', r: 'Usine Vieilles Épices · statue en or', at: 'usine', j: 9 },
  { p: 'Royal (royal_jpb)', r: 'Arbitre de hockey et poète · statue dans la forêt', at: 'foret', j: 9 },
  ...[['Solopy', 'solopy45'], ['Gab', 'gab.stage6.2t'], ['Kéké', 'nailek97'], ['Chilly', 'chillyof'], ['Cora', ''], ['Cla', 'claa0618'], ['P-Y', 'py_180'], ['Thom', 'thom27090']].map(([n, h]) => ({ p: h ? `${n} (${h})` : n, r: n === 'P-Y' ? 'Fermier laitier · trottoir des gifts' : 'Nom gravé au trottoir des gifts', at: 'trottoir', j: 9 })),
];
const RES = EXTRA.concat(DATA.residents).map((r) => {
  if (r.lot !== undefined) { const side = r.lot % 2, k = Math.floor(r.lot / 2); return { ...r, at: 'maisons', house: { x: -13 + k * 4.8, z: side ? 43 : 51.5, side } }; }
  return { ...r, at: WORK[r.p] || BMAP[r.b] || 'place' };
});
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

// ---------- rendu plein écran ----------
const LOW = matchMedia('(pointer:coarse)').matches || Math.min(screen.width, screen.height) < 700;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, LOW ? 1.5 : 2));
if (LOW) { renderer.shadowMap.enabled = false; scene.traverse((o) => { o.castShadow = false; o.receiveShadow = false; }); sun.castShadow = false; }
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < h ? 62 : 50; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.fog.near = 40; scene.fog.far = 150;

// ---------- le joueur ----------
const ME_COL = [[0xe0343b, 0xd8262b], [0x1f56b8, 0xf2c230], [0x2e9b48, 0xffffff], [0x7b4fd0, 0xe86aa8], [0xff8a3d, 0x1d2b55]];
let meStyle = Math.floor(Math.random() * ME_COL.length);
let me = null, meTag = null, meName = '';
function makeMe(name) {
  const old = me; const [sh, tq] = ME_COL[meStyle];
  me = character({ shirt: sh, pants: 0x22252e, hat: 'tuque', hatColor: tq, boots: 0x3b2a20 });
  if (old) { me.position.copy(old.position); me.rotation.y = old.rotation.y; scene.remove(old); } else me.position.set(0.3, 0, 16);
  me.traverse((o) => { o.userData.isMe = true; });
  if (name) { meTag = nameTag(name, 0, 3.55, 0, me, true, Math.min(3.6, 1.2 + name.length * 0.17)); }
}
makeMe('');

// ---------- collisions (boîtes et cylindres du décor) ----------
scene.updateMatrixWorld(true);
const CELL = 10, grid = new Map(), colliders = [];
function isChar(o) { for (let p = o; p; p = p.parent) { if (p.userData && p.userData.armL) return true; if (!p.visible) return true; } return false; }
const _b = new THREE.Box3();
scene.traverse((o) => {
  if (!o.isMesh || o === ground || o.userData.isMe) return;
  const t = o.geometry.type; if (t !== 'BoxGeometry' && t !== 'CylinderGeometry') return;
  if (isChar(o)) return;
  _b.setFromObject(o);
  if (_b.min.y > 1.7 || _b.max.y < 0.45) return;
  const sx = _b.max.x - _b.min.x, sz = _b.max.z - _b.min.z;
  if (sx < 0.1 && sz < 0.1) return;
  if (sx > 60 || sz > 60) return;
  const c = [_b.min.x, _b.min.z, _b.max.x, _b.max.z, _b.max.y]; colliders.push(c);
  for (let i = Math.floor(c[0] / CELL); i <= Math.floor(c[2] / CELL); i++) for (let k = Math.floor(c[1] / CELL); k <= Math.floor(c[3] / CELL); k++) { const key = i + ',' + k; if (!grid.has(key)) grid.set(key, []); grid.get(key).push(c); }
});
const R = 0.42;
function collide(p) {
  const key = Math.floor(p.x / CELL) + ',' + Math.floor(p.z / CELL);
  for (let pass = 0; pass < 2; pass++) {
    for (let di = -1; di <= 1; di++) for (let dk = -1; dk <= 1; dk++) {
      const arr = grid.get((Math.floor(p.x / CELL) + di) + ',' + (Math.floor(p.z / CELL) + dk)); if (!arr) continue;
      for (const c of arr) {
        const x0 = c[0] - R, z0 = c[1] - R, x1 = c[2] + R, z1 = c[3] + R;
        if (p.x <= x0 || p.x >= x1 || p.z <= z0 || p.z >= z1) continue;
        const dl = p.x - x0, dr = x1 - p.x, dn = p.z - z0, ds = z1 - p.z; const m = Math.min(dl, dr, dn, ds);
        if (m === dl) p.x = x0; else if (m === dr) p.x = x1; else if (m === dn) p.z = z0; else p.z = z1;
      }
    }
  }
  p.x = clamp(p.x, -140, 190); p.z = clamp(p.z, -190, 170);
}

function blocked(x, y, z) {
  const arr = grid.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)); if (!arr) return false;
  for (const c of arr) if (x > c[0] - 0.3 && x < c[2] + 0.3 && z > c[1] - 0.3 && z < c[3] + 0.3 && y < c[4] + 0.6) return true;
  return false;
}
// le terrain gris de la future concession de quads n'existe pas encore
scene.children.forEach((o) => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.position.x + 31) < 0.1 && Math.abs(o.position.z - 62) < 0.1) o.visible = false; });
// ---------- contrôles ----------
let camSm = null, yaw = 0, pitch = innerWidth < innerHeight ? 0.38 : 0.32, dist = innerWidth < innerHeight ? 12.5 : 9, aerial = 0, aerialTarget = 0;
const keys = {};
addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT') return; keys[e.code] = true; if (e.code === 'KeyM') toggleMap(); });
addEventListener('keyup', (e) => { keys[e.code] = false; });
const joy = { x: 0, y: 0, id: null };
const jEl = $('#joy'), jKnob = $('#knob');
function joyMove(e) { const r = jEl.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = e.clientX - cx, dy = e.clientY - cy; const L = Math.hypot(dx, dy), M = r.width / 2 - 10; if (L > M) { dx *= M / L; dy *= M / L; } joy.x = dx / M; joy.y = dy / M; jKnob.style.transform = `translate(${dx}px,${dy}px)`; }
jEl.addEventListener('pointerdown', (e) => { joy.id = e.pointerId; jEl.setPointerCapture(e.pointerId); joyMove(e); e.preventDefault(); });
jEl.addEventListener('pointermove', (e) => { if (e.pointerId === joy.id) joyMove(e); });
const joyEnd = (e) => { if (e.pointerId !== joy.id) return; joy.id = null; joy.x = joy.y = 0; jKnob.style.transform = ''; };
jEl.addEventListener('pointerup', joyEnd); jEl.addEventListener('pointercancel', joyEnd);
// glisser sur la scène = tourner la caméra ; 2 doigts / molette = zoom
const drags = new Map();
canvas.addEventListener('pointerdown', (e) => { drags.set(e.pointerId, [e.clientX, e.clientY]); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  const p = drags.get(e.pointerId); if (!p) return;
  if (drags.size === 2) { const [a, b] = [...drags.values()]; const d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); drags.set(e.pointerId, [e.clientX, e.clientY]); const [a2, b2] = [...drags.values()]; const d1 = Math.hypot(a2[0] - b2[0], a2[1] - b2[1]); dist = clamp(dist * d0 / Math.max(1, d1), 4, 22); return; }
  yaw -= (e.clientX - p[0]) * 0.006; pitch = clamp(pitch + (e.clientY - p[1]) * 0.004, 0.05, 1.2); drags.set(e.pointerId, [e.clientX, e.clientY]);
});
const dragEnd = (e) => drags.delete(e.pointerId);
canvas.addEventListener('pointerup', dragEnd); canvas.addEventListener('pointercancel', dragEnd);
canvas.addEventListener('wheel', (e) => { dist = clamp(dist * (1 + Math.sign(e.deltaY) * 0.1), 4, 22); e.preventDefault(); }, { passive: false });
let running = false; $('#run').addEventListener('click', () => { running = !running; $('#run').classList.toggle('on', running); });
$('#sky').addEventListener('click', () => { aerialTarget = aerialTarget ? 0 : 1; $('#sky').classList.toggle('on', !!aerialTarget); });

// ---------- téléportation ----------
let beacon = null;
{ const g = new THREE.Group(); scene.add(g); const m = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 4), new THREE.MeshBasicMaterial({ color: 0xffd23f })); m.rotation.x = Math.PI; g.add(m); const ring = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.5, 24), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.8, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = -5.5; g.add(ring); g.visible = false; beacon = g; }
let fly = null;
function goTo(x, z, faceYaw, mark, pitch1) {
  const from = me.position.clone();
  fly = { t: 0, from, to: new THREE.Vector3(x, 0, z), yaw0: yaw, yaw1: faceYaw, p0: pitch, p1: pitch1 ?? Math.min(pitch, 0.45) };
  if (mark) { beacon.position.set(mark[0], 6, mark[1]); beacon.visible = true; } else beacon.visible = false;
  aerialTarget = 0; $('#sky').classList.remove('on'); closePanels();
}
function goPlace(id) {
  const p = PL[id]; if (!p) return;
  if (id === 'maisons') return goTo(-1, 47, Math.PI / 2, null);
  goTo(p.x, p.z + p.f, p.yaw || 0, [p.x, p.z]);
}
function goResident(r) {
  if (r.house) { const h = r.house; goTo(h.x, 47, h.side ? 0 : Math.PI, [h.x, h.z], 0.85); showCard(PL.maisons, r); return; }
  goPlace(r.at); showCard(PL[r.at], r);
}

// ---------- carte (mini + plein écran) ----------
const mm = $('#mm'), mctx = mm.getContext('2d');
const BOUND = { x0: -92, x1: 148, z0: -96, z1: 135 };
function drawMap(ctx, W, H, big) {
  const s = Math.min(W / (BOUND.x1 - BOUND.x0), H / (BOUND.z1 - BOUND.z0));
  const ox = (W - (BOUND.x1 - BOUND.x0) * s) / 2, oz = (H - (BOUND.z1 - BOUND.z0) * s) / 2;
  const P = (x, z) => [ox + (x - BOUND.x0) * s, oz + (z - BOUND.z0) * s];
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#eef2f7'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c9b293';
  for (const [x, z, w, d] of [[0, 6, 5, 30], [-14, 4, 30, 4.5], [15, -1, 26, 4.5], [0, 21, 5, 18], [-1, 47, 32, 4], [58, -9.5, 50, 4.5]]) { const [a, b] = P(x - w / 2, z - d / 2); ctx.fillRect(a, b, w * s, d * s); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const placed = [];
  for (const p of PLACES) { const [a, b] = P(p.x, PL_MAPZ[p.id] ?? p.z); ctx.font = `${big ? 22 : 11}px "Noto Color Emoji", sans-serif`; ctx.fillText(p.e, a, b);
    if (big) { ctx.font = '800 10px Nunito, sans-serif'; const w = ctx.measureText(p.s).width + 4, r = [a - w / 2, b + 11, a + w / 2, b + 23];
      if (!placed.some((q) => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1])) { placed.push(r); ctx.lineWidth = 3; ctx.strokeStyle = '#eef2f7'; ctx.strokeText(p.s, a, b + 17); ctx.fillStyle = '#1c1f2a'; ctx.fillText(p.s, a, b + 17); } } }
  const [px, pz] = P(clamp(me.position.x, BOUND.x0, BOUND.x1), clamp(me.position.z, BOUND.z0, BOUND.z1));
  ctx.save(); ctx.translate(px, pz); ctx.rotate(-me.rotation.y + Math.PI); ctx.fillStyle = '#e0343b'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); const k = big ? 12 : 7; ctx.moveTo(0, -k); ctx.lineTo(k * 0.7, k * 0.8); ctx.lineTo(-k * 0.7, k * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  return { P, s };
}
const bigMap = $('#bigmap'), bctx = bigMap.getContext('2d'); let mapOpen = false, mapGeo = null;
function toggleMap(force) { mapOpen = force ?? !mapOpen; $('#mapwrap').classList.toggle('open', mapOpen); if (mapOpen) { closePanels(true); renderBig(); } }
function renderBig() {
  const r = bigMap.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
  bigMap.width = r.width * dpr; bigMap.height = r.height * dpr; bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  mapGeo = drawMap(bctx, r.width, r.height, true);
}
mm.addEventListener('click', () => toggleMap(true));
$('#mapclose').addEventListener('click', () => toggleMap(false));
bigMap.addEventListener('click', (e) => {
  const r = bigMap.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
  let best = null, bd = 30; for (const p of PLACES) { const [a, b] = mapGeo.P(p.x, PL_MAPZ[p.id] ?? p.z); const d = Math.hypot(a - x, b - y); if (d < bd) { bd = d; best = p; } }
  if (best) { toggleMap(false); goPlace(best.id); showCard(best); }
});

// ---------- fiche du lieu ----------
const card = $('#card'); let cardPlace = null, cardPinned = 0;
function chip(r) { return `<button class="chip" data-p="${encodeURIComponent(r.p)}"><b>${esc(r.p)}</b><span>${esc(r.r)}</span></button>`; }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function showCard(p, focus) {
  if (!p) return; cardPlace = p.id; cardPinned = performance.now() + 4000;
  const who = RES.filter((r) => r.at === p.id);
  card.innerHTML = `<div class="ch"><span class="ce">${p.e}</span><div><div class="cn">${esc(p.n)}</div><div class="cj">Bâti au Jour ${p.j}</div></div></div>`
    + (focus ? `<div class="found">📍 ${esc(focus.p)} · ${esc(focus.r)}</div>` : '')
    + (p.d ? `<p class="cd">${esc(p.d)}</p>` : '')
    + (p.merch ? MERCH_HTML : '')
    + (who.length ? `<div class="chips">${who.map(chip).join('')}</div>` : '');
  card.classList.add('show');
}
const MERCH = [['📜', 'Certificat de métier', '9,99 $ · lien en bio'], ['🖼️', 'Affiche de la ville', 'Bientôt'], ['👕', 'T-shirt Saint-T', 'Bientôt'], ['🧥', 'Hoodie Saint-T', 'Bientôt']];
const MERCH_HTML = `<div class="merch">${MERCH.map(([e, n, s]) => `<div class="mi"><span>${e}</span><b>${n}</b><small>${s}</small></div>`).join('')}</div><a class="cta" href="https://www.tiktok.com/@saint.tabarnouche" target="_blank" rel="noopener">Voir le lien en bio</a>`;
function hideCard() { card.classList.remove('show'); cardPlace = null; }
card.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; const r = RES.find((x) => x.p === decodeURIComponent(b.dataset.p)); if (r) goResident(r); });

// ---------- habitants (recherche « trouve ta place ») ----------
const list = $('#list');
function renderList(q) {
  const n = norm(q || '');
  const rows = RES.filter((r) => !n || norm(r.p).includes(n) || norm(r.r).includes(n) || norm(PL[r.at].n).includes(n));
  list.innerHTML = rows.length ? rows.map((r) => `<button class="row" data-p="${encodeURIComponent(r.p)}"><span class="re">${PL[r.at].e}</span><span class="rt"><b>${esc(r.p)}</b><small>${esc(r.r)} · ${esc(PL[r.at].n)}</small></span><span class="go">Y aller</span></button>`).join('')
    : `<div class="empty">Pas encore dans la ville. Commente ton nom + la job que tu veux sur le dernier TikTok : le maire bâtit les demandes les plus likées.</div>`;
}
list.addEventListener('click', (e) => { const b = e.target.closest('.row'); if (!b) return; const r = RES.find((x) => x.p === decodeURIComponent(b.dataset.p)); if (r) goResident(r); });
$('#q').addEventListener('input', (e) => renderList(e.target.value));
$('#btnWho').addEventListener('click', () => { const o = !$('#who').classList.contains('open'); closePanels(); if (o) { $('#who').classList.add('open'); renderList($('#q').value); } });
$('#whoclose').addEventListener('click', () => closePanels());
function closePanels(keepMap) { $('#who').classList.remove('open'); if (!keepMap) toggleMap(false); }

// ---------- HUD ----------
const fmtN = (n) => n.toLocaleString('fr-CA').replace(/ | |,/g, ' ');
function setPop(n) {
  $('#pop').textContent = fmtN(n);
  $('#goal').style.width = Math.min(100, n / DATA.objectif * 100) + '%';
  $('#goalt').textContent = fmtN(n) + ' / ' + fmtN(DATA.objectif) + ' habitants';
}
setPop(DATA.habitants); $('#cof').textContent = fmtN(DATA.coffre) + ' $'; $('#jour').textContent = 'JOUR ' + DATA.jour;
// Abonnés TikTok en direct (fonction Vercel /api/abonnes, relue aux 30 min). Sinon on garde le chiffre de base.
function abonnes() {
  if (!/^https?:$/.test(location.protocol)) return;
  fetch('/api/abonnes').then((r) => r.json()).then((d) => {
    if (typeof d.value === 'number' && d.value >= DATA.habitants * 0.8) setPop(d.value);
  }).catch(() => {});
}
abonnes(); setInterval(abonnes, 30 * 60 * 1000);

// ---------- compteur de visiteurs (abacus, gratuit, sans compte) ----------
(function visites() {
  // Compteur de visites (abacus). La pastille s'affiche tout de suite, puis le chiffre arrive.
  const base = 'https://abacus.jasoncameron.dev/';
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const show = (n) => { $('#vis').textContent = fmtN(n); };
  $('#vis').textContent = '…'; $('#visw').hidden = false;
  const last = Number(ls('stt-vn')); if (last > 0) show(last);
  let tries = 0;
  function go() {
    const mode = ls('stt-vu') ? 'get' : 'hit';
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
    fetch(base + mode + '/saint-tabarnouche-ville/visiteurs', { signal: ctl.signal, cache: 'no-store' })
      .then((r) => r.json()).then((d) => {
        clearTimeout(t);
        if (typeof d.value !== 'number') throw 0;
        ls('stt-vu', '1'); ls('stt-vn', String(d.value)); show(d.value);
      }).catch(() => {
        clearTimeout(t);
        if (++tries < 3) setTimeout(go, 2500 * tries);
        else if (!(last > 0)) $('#visw').hidden = true;
      });
  }
  go();
})();
// ---------- écran d'accueil ----------
const sw = $('#swatches');
ME_COL.forEach(([c], i) => { const b = document.createElement('button'); b.className = 'sw' + (i === meStyle ? ' on' : ''); b.style.background = '#' + c.toString(16).padStart(6, '0'); b.setAttribute('aria-label', 'Couleur ' + (i + 1)); b.onclick = () => { meStyle = i; sw.querySelectorAll('.sw').forEach((x, k) => x.classList.toggle('on', k === i)); }; sw.appendChild(b); });
function enter() {
  meName = $('#name').value.trim().slice(0, 24);
  if (me && meTag) { me.remove(meTag); }
  makeMe(meName);
  try { localStorage.setItem('stt-nom', meName); localStorage.setItem('stt-col', meStyle); } catch (e) {}
  $('#intro').classList.add('gone');
  const r = meName && RES.find((x) => norm(x.p) === norm(meName)) || (meName && norm(meName).length >= 3 && RES.find((x) => norm(x.p).includes(norm(meName))));
  if (r) { toast(`Bienvenue chez vous, ${r.p} ! 🎉`); goResident(r); }
  else if (meName) toast(`Bienvenue à Saint-Tabarnouche, ${meName} !`);
}
try { const n = localStorage.getItem('stt-nom'); if (n) $('#name').value = n; const c = +localStorage.getItem('stt-col'); if (c >= 0 && c < ME_COL.length && localStorage.getItem('stt-col') !== null) { meStyle = c; sw.querySelectorAll('.sw').forEach((x, k) => x.classList.toggle('on', k === c)); } } catch (e) {}
$('#enter').addEventListener('click', enter);
$('#name').addEventListener('keydown', (e) => { if (e.key === 'Enter') enter(); });
let toastT = 0; function toast(s) { const t = $('#toast'); t.textContent = s; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200); }

// ---------- boucle ----------
const clock = new THREE.Clock(); let T0 = 0; const tmp = new THREE.Vector3(); let lastNear = null;
function frame() {
  const dt = Math.min(0.05, clock.getDelta()); T0 += dt; const t = T0;
  // déplacement
  let ix = joy.x, iy = joy.y;
  if (keys.KeyW || keys.ArrowUp || keys.KeyZ) iy -= 1; if (keys.KeyS || keys.ArrowDown) iy += 1;
  if (keys.KeyA || keys.ArrowLeft || keys.KeyQ) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1;
  const L = Math.hypot(ix, iy); if (L > 1) { ix /= L; iy /= L; }
  const fast = running || keys.ShiftLeft || keys.ShiftRight;
  const speed = (fast ? 11 : 6) * Math.min(1, L);
  let moving = false;
  if (fly) {
    fly.t += dt / 1.1; const k = ease(clamp(fly.t));
    me.position.lerpVectors(fly.from, fly.to, k); me.position.y = Math.sin(k * Math.PI) * 14;
    let dy = fly.yaw1 - fly.yaw0; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); yaw = fly.yaw0 + dy * k; pitch = lerp(fly.p0, fly.p1, k);
    me.rotation.y = yaw + Math.PI;
    if (fly.t >= 1) { me.position.y = 0; fly = null; }
  } else if (speed > 0.05) {
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const mx = fx * -iy + rx * ix, mz = fz * -iy + rz * ix; const ml = Math.hypot(mx, mz) || 1;
    me.position.x += mx / ml * speed * dt; me.position.z += mz / ml * speed * dt;
    collide(me.position);
    const target = Math.atan2(mx, mz); let d = target - me.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); me.rotation.y += d * Math.min(1, dt * 12);
    moving = true; beacon.visible = beacon.visible && me.position.distanceTo(tmp.set(beacon.position.x, 0, beacon.position.z)) > 3;
  }
  // animation du perso
  const u = me.userData;
  if (moving) { const sp = fast ? 15 : 10; const a = Math.sin(t * sp) * 0.7; u.legL.rotation.x = a; u.legR.rotation.x = -a; u.armL.rotation.x = -a * 0.8; u.armR.rotation.x = a * 0.8; u.armL.rotation.z = u.armR.rotation.z = 0; me.position.y = Math.abs(Math.sin(t * sp)) * 0.08; }
  else if (!fly) { u.legL.rotation.x = u.legR.rotation.x = 0; anim(me, t, 'idle'); me.position.y = 0; }
  // caméra
  aerial += (aerialTarget - aerial) * Math.min(1, dt * 3);
  const D = lerp(dist, 75, aerial), P = lerp(pitch, 1.15, aerial);
  const cx = me.position.x + Math.sin(yaw) * Math.cos(P) * D, cz = me.position.z + Math.cos(yaw) * Math.cos(P) * D, cy = Math.max(1.2, me.position.y + 2.2 + Math.sin(P) * D);
  let camK = 1;
  if (aerial < 0.2) { const hx = me.position.x, hy = me.position.y + 2.0, hz = me.position.z; for (let i = 1; i <= 14; i++) { const k = i / 14; if (blocked(lerp(hx, cx, k), lerp(hy, cy, k), lerp(hz, cz, k))) { camK = Math.max(0.12, (i - 1) / 14); break; } } }
  camSm = camSm === null ? camK : (camK < camSm ? camK : camSm + (camK - camSm) * Math.min(1, dt * 3));
  camera.position.set(lerp(me.position.x, cx, camSm), lerp(me.position.y + 2.2, cy, camSm), lerp(me.position.z, cz, camSm)); camera.lookAt(me.position.x, me.position.y + 2.0, me.position.z);
  scene.fog.far = lerp(150, 260, aerial);
  sunAt(me.position.x, me.position.z);
  // monde vivant
  flagAt(t); snowAt(t, camera.position);
  beacon.rotation.y = t * 2; beacon.children[0].position.y = Math.sin(t * 4) * 0.4;
  builds.cabane.userData.smoke.forEach((s, i) => { const ph = (t * 0.4 + i / 4) % 1; s.position.set(2.5 + Math.sin(ph * 5 + i) * 0.3, 6.6 + ph * 3, -1); s.scale.setScalar(0.6 + ph * 1.5); s.material.opacity = 0.6 * (1 - ph); });
  anim(mayor, t, 'wave'); anim(mayor2, t, 'point');
  villagers.forEach((v, i) => anim(v, t, 'idle', i));
  steam.forEach((s, i) => { const ph = (t * 0.8 + i / 3) % 1; s.position.set(0.8 + Math.sin(ph * 6 + i) * 0.1, 1.6 + ph * 1.2, 2.15); s.scale.setScalar(0.6 + ph); });
  steamT.forEach((s, i) => { const ph = (t * 0.6 + i / 3) % 1; s.position.set(Math.sin(ph * 6 + i) * 0.2, 2.3 + ph * 2.0, 0); s.scale.setScalar(0.6 + ph * 1.2); s.material.opacity = 0.7 * (1 - ph); });
  tubSteam.forEach((s, i) => { const ph = (t * 0.5 + i / 6) % 1; s.position.set(Math.cos(i * 1.7) * 0.9, 1.0 + ph * 2.2, Math.sin(i * 1.7) * 0.9); s.scale.setScalar(0.5 + ph * 1.4); s.material.opacity = 0.55 * (1 - ph); });
  anim(cantineGuy, t, 'idle'); anim(official, t, 'idle');
  staffChars.forEach((c, i) => anim(c, t, 'idle', i));
  queueChars.forEach((c, i) => c.userData.head && anim(c, t, 'idle', i * 0.9));
  quadQ.position.y = Math.abs(Math.sin(t * 7)) * 0.03; anim(quadQ.userData.rider, t, 'wave', 3);
  anim(thea, t, 'wave'); (theaFarm.userData.animals || []).forEach((a, i) => { a.position.y = Math.abs(Math.sin(t * 3 + i)) * 0.06; });
  [soeurMarie, soeurRosa, mike, jusKid, lavende, anthony, ludo, shana, emma, emile, grizzli, tsun, oliE].forEach((c, i) => anim(c, t, 'idle', i));
  metierChars.forEach((c, i) => anim(c, t, 'idle', i));
  vlqChars.forEach((c, i) => anim(c, t, 'idle', i)); femChars.forEach((c, i) => anim(c, t, 'idle', i)); anim(coachEve, t, 'point');
  anim(statue, 0, 'wave');
  anim(gamixG, t, 'idle'); gamixG.userData.armL.rotation.z = -2.9; gamixG.userData.armR.rotation.z = 2.9; barbell.position.set(0, 3.0 + Math.abs(Math.sin(t * 3)) * 0.5, 0);
  elders.forEach((e, i) => { e.rotation.x = Math.sin(t * 2 + i) * 0.12; });
  const blink = Math.floor(t * 4) % 2; lightR.material = mat(blink ? 0xff2222 : 0x551111); lightB.material = mat(blink ? 0x221144 : 0x2255ff);
  bulbs.forEach((b, i) => { b.visible = (Math.floor(t * 2) + i) % 3 !== 0; }); anim(grinch, t, 'idle');
  builds.patinoire.userData.skaters.forEach((c, i) => { const a = t * 0.5 + i * 1.05; c.position.set(Math.cos(a) * 5.5, 0.06, Math.sin(a) * 2.8); c.rotation.y = -a; anim(c, t, 'idle', i); });
  { const g = builds.garderie.userData; g.kids.forEach((c, i) => { c.position.y = Math.abs(Math.sin(t * 5 + i)) * 0.3; anim(c, t, 'cheer', i); }); anim(g.coralie, t, 'wave'); }
  { const g = builds.poutine.userData; anim(g.boss, t, 'wave'); g.line.forEach((c, i) => anim(c, t, 'idle', i)); }
  { const g = builds.poupees.userData; anim(g.talk, t, 'wave'); g.balloons.forEach((b, i) => { b.position.y = 4.6 + (i % 3) * 0.6 + Math.sin(t * 2 + i) * 0.15; }); }
  sapinG.userData.star.rotation.y = t * 1.2; sapinBulbs.forEach((b, i) => { b.visible = (Math.floor(t * 2) + i) % 4 !== 0; });
  usine.userData.smoke.forEach((sm, i) => { const ph = (t * 0.3 + i / 8) % 1; const x = i % 2 ? 6 : -6; sm.position.set(x + Math.sin(ph * 4 + i) * 0.6, 19 + ph * 8, -8); sm.scale.setScalar(0.8 + ph * 2); sm.material.opacity = 0.6 * (1 - ph); });
  fireflies.forEach((f) => { const u = f.userData; f.position.set(u.x + Math.sin(t * 0.7 + u.o) * 0.8, u.y + Math.sin(t * 1.3 + u.o * 2) * 0.4, u.z + Math.cos(t * 0.6 + u.o) * 0.8); });
  around.userData.pets.forEach((g) => { const o = g.userData.o; g.position.y = Math.abs(Math.sin(t * 6 + o)) * 0.25; g.rotation.y = Math.sin(t * 0.8 + o) * 0.8; });
  around.userData.watchers.forEach((c, i) => anim(c, t, 'point', i)); passengers.forEach((c, i) => anim(c, t, 'wave', i)); anim(lpChar, t, 'wave');
  { const k = (Math.sin(t * 0.25) + 1) / 2; temTrain.position.x = lerp(MLX + 10, -9, ease(k)); }
  anim(merch.userData.seller, t, 'wave');
  moto.userData.body.rotation.x = -0.35 - Math.sin(t * 3) * 0.1; moto.userData.body.position.y = 0.85;
  // lieu le plus proche → fiche
  if (!fly) {
    let near = null, nd = 1e9;
    for (const p of PLACES) { const dx = me.position.x - p.x, dz = me.position.z - (p.z + p.f * 0.6); const d = Math.hypot(dx, dz); if (d < nd) { nd = d; near = p; } }
    if (nd < 9 && near) { if (cardPlace !== near.id && (performance.now() > cardPinned || !cardPlace)) showCard(near); }
    else if (cardPlace && performance.now() > cardPinned) hideCard();
  }
  renderer.render(scene, camera);
  drawMap(mctx, mm.width, mm.height, false);
  if (mapOpen && Math.floor(t * 10) % 3 === 0) renderBig();
  requestAnimationFrame(frame);
}
yaw = 0; me.rotation.y = Math.PI;
window.READY = true; window.__go = (q) => { const n = norm(q); const p = PLACES.find((x) => norm(x.n).includes(n) || norm(x.s).includes(n)); if (p) { goPlace(p.id); showCard(p); } }; window.__dbg = () => ({ camSm, dist, x: me.position.x, z: me.position.z });
$('#loading').remove();
requestAnimationFrame(frame);
