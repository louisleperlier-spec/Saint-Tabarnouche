// ================= L'ESPACE DE SAINT-TABARNOUCHE (espace.js) =================
// La Lune qu'on peut visiter + la station spatiale de Seb (NASTA).
// La zone spatiale est loin à l'est (x ≈ 420), hors du sol de la ville : on y va par « Trouve ta place » ou la carte.
// Le ciel noir étoilé n'apparaît que quand la caméra est dans l'espace.
const ESP = { x: 420, z: 0, st: [420, -64] };
{
  const g = (x, z, ry = 0) => { const o = new THREE.Group(); o.position.set(x, 0, z); o.rotation.y = ry; scene.add(o); return o; };
  const signE = (w, h, lines, opt, x, y, z, ry = 0, parent = scene) => plane(w, h, signTex(lines, opt), x, y, z, ry, parent);
  const EX = ESP.x, EZ = ESP.z;

  // ---------- ciel de l'espace (noir + étoiles + la Terre) ----------
  const sky = new THREE.Group(); sky.position.set(EX, 0, EZ - 20); scene.add(sky); sky.visible = false;
  sky.add(new THREE.Mesh(new THREE.SphereGeometry(140, 24, 16), new THREE.MeshBasicMaterial({ color: 0x05070f, side: THREE.BackSide, fog: false, depthWrite: false })));
  { const pos = []; let r = 11; const rr = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; }; for (let i = 0; i < 700; i++) { const u = rr() * 2 - 1, a = rr() * Math.PI * 2, s = Math.sqrt(1 - u * u); pos.push(Math.cos(a) * s * 130, Math.abs(u) * 130 - 5, Math.sin(a) * s * 130); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sky.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, fog: false }))); }
  const earthTex = texCanvas(512, 256, (ctx, w, h) => { ctx.fillStyle = '#2f6fd1'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#3fae5a'; [[60, 80, 70, 50], [200, 60, 90, 70], [330, 140, 80, 60], [430, 70, 50, 40], [120, 170, 60, 40]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.ellipse(x, y, a, b, 0.4, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(0, 0, w, 16); ctx.fillRect(0, h - 16, w, 16); });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(14, 28, 18), new THREE.MeshBasicMaterial({ map: earthTex, fog: false })); earth.position.set(-60, 55, -80); sky.add(earth);
  const pin = signE(14, 3, [{ t: '📍 SAINT-TABARNOUCHE EST ICI', size: 50, y: 60, color: '#ffffff' }], { w: 700, h: 120, bg: '#c8102e', border: '#ffffff' }, -60, 74, -80, 0, sky); pin.material.fog = false;
  ESP.sky = sky; ESP.earth = earth;
  const lightE = new THREE.PointLight(0xffffff, 60, 120, 1.2); lightE.position.set(EX + 10, 30, EZ + 20); scene.add(lightE);

  // ---------- la Lune : surface à visiter ----------
  const grey = mat(0xb9b8b2), dark = mat(0x8e8d88);
  const surf = new THREE.Mesh(new THREE.CylinderGeometry(34, 30, 4, 48), grey); surf.position.set(EX, -2, EZ); surf.receiveShadow = true; scene.add(surf);
  let s = 3; const rr = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < 16; i++) { const a = rr() * Math.PI * 2, d = 8 + rr() * 22, r = 1 + rr() * 3; if (Math.abs(Math.cos(a) * d) < 7 && Math.sin(a) * d > -6 && Math.sin(a) * d < 14) continue;
    const cx = EX + Math.cos(a) * d, cz = EZ + Math.sin(a) * d;
    const pit = new THREE.Mesh(new THREE.CircleGeometry(r, 18), dark); pit.rotation.x = -Math.PI / 2; pit.position.set(cx, 0.03, cz); scene.add(pit);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.22 + r * 0.06, 6, 20), grey); rim.rotation.x = -Math.PI / 2; rim.position.set(cx, 0.05, cz); scene.add(rim); }
  for (let i = 0; i < 22; i++) { const a = rr() * Math.PI * 2, d = 6 + rr() * 26; const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + rr() * 0.7, 0), dark); rock.position.set(EX + Math.cos(a) * d, 0.2, EZ + Math.sin(a) * d); rock.castShadow = true; scene.add(rock); }
  // pas d'astronautes sur le sol
  for (let i = 0; i < 10; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.6), dark); f.rotation.x = -Math.PI / 2; f.position.set(EX - 4 + (i % 2) * 0.6, 0.04, EZ + 12 - i * 1.2); scene.add(f); }

  // drapeau de Saint-Tabarnouche planté sur la Lune
  cyl(0.12, 0.12, 7, 8, 0xdfe3ea, EX - 7, 3.5, EZ + 4);
  box(4.2, 0.12, 0.12, 0xdfe3ea, EX - 4.9, 6.9, EZ + 4);
  const fTex = texCanvas(480, 300, (ctx, w, h) => { ctx.fillStyle = '#1f56b8'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff'; ctx.fillRect(w / 2 - 20, 0, 40, h); ctx.fillRect(0, h / 2 - 20, w, 40); ctx.fillStyle = '#ffd24a'; ctx.font = '900 62px "Baloo 2"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ST-T', w / 4, h / 4 + 4); ctx.fillText('ST-T', 3 * w / 4, 3 * h / 4 + 4); ctx.fillStyle = '#fff'; ctx.font = '110px "Noto Color Emoji", sans-serif'; ctx.fillText('⚜', 3 * w / 4, h / 4 + 6); ctx.fillText('⚜', w / 4, 3 * h / 4 + 6); });
  const lf = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.6), new THREE.MeshLambertMaterial({ map: fTex, side: THREE.DoubleSide })); lf.position.set(EX - 4.9, 5.55, EZ + 4); scene.add(lf);
  box(2.4, 0.9, 0.3, 0xcfd6de, EX - 7, 0.45, EZ + 5.6);
  signE(2.3, 0.85, [{ t: 'LUNE DE SAINT-TABARNOUCHE', size: 30, y: 40, color: '#1d2b55' }, { t: 'Conquise au live du 25 nov', size: 26, y: 82, color: '#8a5a1a' }], { w: 360, h: 120, bg: '#f7f9fc', border: '#8a96a8' }, EX - 7, 0.5, EZ + 5.77);

  // base lunaire de la NASTA
  const base = g(EX + 2, EZ - 4);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.55 })); base.add(dome);
  cyl(5.1, 5.1, 0.5, 24, 0xdfe3ea, 0, 0.25, 0, base);
  for (let i = 0; i < 3; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 8), mat([0x3fae5a, 0x2f7a3e, 0x5fae5a][i])); p.position.set(-2 + i * 2, 0.9, -1.5); base.add(p); }
  box(2.2, 2.6, 0.3, 0xdfe3ea, 0, 1.3, 4.9, base); box(1.2, 2, 0.1, 0x2a3550, 0, 1.1, 5.08, base);
  for (const sx of [-1, 1]) { const mod = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 5, 16), mat(0xf2f4f7)); mod.rotation.z = Math.PI / 2; mod.position.set(sx * 7.6, 1.6, 0); mod.castShadow = true; base.add(mod); box(0.2, 1.6, 1.6, 0xe0343b, sx * 10.1, 1.6, 0, base); }
  signE(6, 1.1, [{ t: 'BASE LUNAIRE · NASTA', size: 64, y: 58, color: '#1d3f8f' }], { w: 720, h: 130, bg: '#ffffff', border: '#1d3f8f' }, 0, 3.4, 5.1, 0, base);
  // antenne
  cyl(0.1, 0.1, 6, 6, 0x9aa4b8, 9, 3, -3, base); const dish = new THREE.Mesh(new THREE.SphereGeometry(1.4, 14, 8, 0, Math.PI * 2, 0, Math.PI / 3), mat(0xf2f4f7)); dish.position.set(9, 6.2, -3); dish.rotation.x = -2.2; base.add(dish); ESP.dish = dish;
  // rover
  const rover = g(EX + 10, EZ + 9, 0.6);
  box(2.4, 0.6, 3.2, 0xf2f4f7, 0, 1, 0, rover); box(1.8, 0.8, 1, 0xd6a531, 0, 1.6, -0.7, rover);
  for (const [x, z] of [[-1.3, 1.1], [1.3, 1.1], [-1.3, -1.1], [1.3, -1.1]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12), mat(0x22252e)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.5, z); rover.add(w); }
  ESP.rover = rover;
  // astronautes en apesanteur
  const astro = (x, z, name) => { const c = character({ shirt: 0xf7f9fc, pants: 0xf7f9fc, arm: 0xf7f9fc, hat: 'helmet', hatColor: 0xffffff, frontTex: name ? staffFront(name) : undefined, pos: [x, 0, z], ry: 0 }); const v = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 8), new THREE.MeshLambertMaterial({ color: 0xd6a531, transparent: true, opacity: 0.55 })); v.position.y = 2.65; c.add(v); box(0.8, 0.9, 0.4, 0xdfe3ea, 0, 1.55, -0.45, c); return c; };
  ESP.astros = [astro(EX - 5, EZ + 8, 'NASTA'), astro(EX + 5, EZ + 4, null), astro(EX - 2, EZ + 14, null)];

  // ---------- passerelle Lune → station ----------
  for (let i = 0; i < 9; i++) box(2.4, 0.2, 2, 0x9aa4b8, EX, -0.1, EZ - 33 - i * 2.05);
  for (const sx of [-1.25, 1.25]) box(0.1, 1, 18.6, 0x5a6b7d, EX + sx, 0.4, EZ - 41.3).userData.noClay = true;

  // ---------- station spatiale de Seb (on peut marcher dessus) ----------
  const [SX, SZ] = ESP.st;
  const st = g(SX, SZ);
  box(14, 0.5, 14, 0xdfe3ea, 0, -0.25, 0, st); // pont principal
  for (let i = -2; i <= 2; i++) box(0.12, 0.02, 13.4, 0x9aa4b8, i * 2.6, 0.01, 0, st);
  const modH = (x, z, len, ry, c = 0xf2f4f7) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, len, 16), mat(c)); m.rotation.z = Math.PI / 2; m.rotation.y = ry; m.position.set(x, 1.7, z); m.castShadow = true; st.add(m); for (const e of [-1, 1]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.15, 6, 18), mat(0x9aa4b8)); ring.rotation.y = Math.PI / 2 + ry; ring.position.set(x + Math.cos(ry) * e * len / 2, 1.7, z - Math.sin(ry) * e * len / 2); st.add(ring); } return m; };
  modH(0, -4.5, 12, 0); modH(-5, 1, 8, Math.PI / 2, 0xe9e4d8);
  const core = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 12), mat(0xf2f4f7)); core.position.set(0, 2.2, -4.5); st.add(core);
  for (let i = 0; i < 4; i++) { const w = new THREE.Mesh(new THREE.CircleGeometry(0.35, 12), new THREE.MeshBasicMaterial({ color: 0x8fc6ff })); w.position.set(-4 + i * 2.6, 1.7, -2.78); st.add(w); }
  // panneaux solaires géants
  const panelTex = texCanvas(256, 128, (ctx, w, h) => { ctx.fillStyle = '#1b3a8a'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#7fa8ff'; ctx.lineWidth = 3; for (let x = 0; x <= w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y <= h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } });
  const panels = [];
  for (const sx of [-1, 1]) { box(9, 0.2, 0.2, 0x9aa4b8, sx * 11.5, 1.7, -4.5, st); for (const k of [0, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.4), new THREE.MeshLambertMaterial({ map: panelTex, side: THREE.DoubleSide })); p.position.set(sx * (10.5 + k * 0), 1.7, -4.5 + (k ? 2.2 : -2.2)); p.rotation.x = -Math.PI / 2; st.add(p); panels.push(p); } }
  ESP.panels = panels;
  signE(10, 1.6, [{ t: '🛰️ STATION SPATIALE SEB', size: 66, y: 60, color: '#ffffff' }, { t: 'NASTA · SAINT-TABARNOUCHE', size: 38, y: 122, color: '#ffe48a' }], { w: 900, h: 160, bg: '#1d3f8f', border: '#ffffff' }, 0, 4.6, -2.6, 0, st);
  // Seb, commandant de la station + son certificat
  const seb = astro(SX + 3, SZ + 3, 'SEB'); ESP.seb = seb;
  box(0.12, 1.6, 0.12, 0x6b4a2f, SX + 5.2, 0.8, SZ + 2.9);
  signE(1.8, 1.3, [{ t: '📜 CERTIFICAT', size: 48, y: 60, color: '#8a5a1a' }, { t: 'SEB', size: 70, y: 135, color: '#1d3f8f' }, { t: 'COMMANDANT DE LA STATION', size: 26, y: 200, color: '#3a2a10' }], { w: 340, h: 250, bg: '#fbf3dc', border: '#d6a531' }, SX + 5.2, 1.9, SZ + 3.0);
  // capsule amarrée
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.6, 14), mat(0xf7f9fc)); cap.rotation.x = Math.PI / 2; cap.position.set(SX, 1.6, SZ - 13); scene.add(cap); box(1, 1, 2.2, 0x9aa4b8, SX, 1.6, SZ - 11);

  // ---------- la station vue de la ville : elle tourne en orbite au-dessus de la NASTA ----------
  const orbit = new THREE.Group(); orbit.position.set(118, 85, -40); scene.add(orbit);
  const mini = new THREE.Group(); mini.position.x = 45; orbit.add(mini); mini.scale.setScalar(0.9);
  { const m = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf2f4f7, fog: false })); m.rotation.z = Math.PI / 2; mini.add(m);
    for (const sx of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(7, 8), new THREE.MeshBasicMaterial({ map: panelTex, fog: false, side: THREE.DoubleSide })); p.position.x = sx * 10.5; p.rotation.x = -Math.PI / 2; mini.add(p); } }
  ESP.orbit = orbit;
}
function espaceUpdate(t) {
  const inSpace = camera.position.x > 290;
  ESP.sky.visible = inSpace;
  if (typeof bigSnow !== 'undefined') bigSnow.visible = !inSpace;
  if (inSpace) { if (!ESP.was) ESP.near = scene.fog.near; scene.fog.near = 200; scene.fog.far = 1000; } else if (ESP.was) scene.fog.near = ESP.near;
  ESP.was = inSpace;
  ESP.earth.rotation.y = t * 0.05;
  ESP.orbit.rotation.y = t * 0.06; ESP.orbit.children[0].rotation.y = -t * 0.06;
  ESP.dish.rotation.z = Math.sin(t * 0.4) * 0.6;
  ESP.astros.forEach((c, i) => { c.position.y = Math.abs(Math.sin(t * 1.1 + i * 2)) * 1.4; anim(c, t, i === 0 ? 'wave' : 'cheer', i); });
  ESP.seb.position.y = 0.2 + Math.sin(t * 1.3) * 0.2; anim(ESP.seb, t, 'wave');
  { const a = t * 0.15; ESP.rover.position.set(ESP.x + 12 + Math.cos(a) * 6, 0, ESP.z + 6 + Math.sin(a) * 6); ESP.rover.rotation.y = -a; }
}
