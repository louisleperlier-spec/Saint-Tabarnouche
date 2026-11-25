// Saint-Tabarnouche en mode app : onglets Ville / Habitants / Vidéos & lives / Recensement / Boutique.
// Pour mettre à jour : change seulement le bloc INFOS ci-dessous (le reste vient des données de la ville).
(function () {
  const INFOS = {
    tiktok: 'https://www.tiktok.com/@saint.tabarnouche',
    roblox: 'https://www.roblox.com/search/universes?keyword=Saint-T%20Qu%C3%A9bec%20RP', // à remplacer par le lien exact du jeu
    prochainLive: { quand: 'Annoncé dans les stories TikTok', quoi: 'On bâtit la ville en direct avec vous' },
    videos: [ // les plus récentes en haut
      { j: 10, e: '✈️', n: "L'aéroport ALP, le train TEM et le Quartier Tabar30" },
      { j: 9, e: '📋', n: 'Le grand recensement' },
      { j: 8, e: '⛸️', n: 'La patinoire extérieure' },
      { j: 7, e: '🍟', n: "La Poutine d'Or et la garderie" },
      { j: 6, e: '🏡', n: 'Rue des Érables : les maisons des abonnés' },
      { j: 5, e: '🍁', n: 'La cabane à sucre' },
      { j: 4, e: '☕', n: 'Chez Tim, le café du coin' },
      { j: 3, e: '🏒', n: "L'aréna" },
    ],
    boutique: [
      { e: '📜', n: 'Certificat de métier', d: 'Ta job officielle à Saint-Tabarnouche', prix: '9,99 $', lien: 'https://www.tiktok.com/@saint.tabarnouche' },
      { e: '🖼️', n: 'Affiche de la ville', d: 'La carte de Saint-Tabarnouche', prix: null },
      { e: '👕', n: 'T-shirt Saint-T', d: 'Le merch officiel', prix: null },
      { e: '🧥', n: 'Hoodie Saint-T', d: "Pour l'hiver à Saint-T", prix: null },
    ],
  };

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nb = (n) => Number(n || 0).toLocaleString('fr-CA');
  let D = {}; try { D = JSON.parse($('#data').textContent); } catch (e) {}
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  // service worker (copie hors ligne)
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});

  const TABS = [['ville', '🏘️', 'Ville'], ['habitants', '🔎', 'Habitants'], ['videos', '🎬', 'Vidéos'], ['recensement', '📋', 'Recensement'], ['boutique', '🛍️', 'Boutique']];
  const bar = document.createElement('nav'); bar.id = 'tabs'; bar.setAttribute('aria-label', 'Onglets');
  bar.innerHTML = TABS.map(([id, e, l]) => `<button data-t="${id}"${id === 'ville' ? ' class="on"' : ''}><span>${e}</span>${l}</button>`).join('');
  const sheet = document.createElement('section'); sheet.id = 'sheet';
  sheet.innerHTML = '<div class="wh"><h2 id="sht"></h2><button class="x" id="shx" aria-label="Fermer">✕</button></div><div class="sb" id="shb"></div>';
  const inst = document.createElement('div'); inst.id = 'install';
  inst.innerHTML = '<div style="flex:1">📲 Installe l\'app : touche <b>Partager</b> en bas de Safari, puis <b>« Sur l\'écran d\'accueil »</b>.</div><button aria-label="Fermer">✕</button>';
  document.body.append(sheet, bar, inst); document.body.classList.add('tabs');

  let cur = 'ville';
  function setOn(id) { cur = id; bar.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.t === id)); }
  function closeAll() {
    sheet.classList.remove('open');
    if ($('#who') && $('#who').classList.contains('open')) $('#whoclose').click();
    if ($('#mapwrap') && $('#mapwrap').classList.contains('open')) $('#mapclose').click();
  }
  function openSheet(title, html) { $('#sht').textContent = title; $('#shb').innerHTML = html; $('#shb').scrollTop = 0; sheet.classList.add('open'); }

  const pages = {
    videos() {
      const vote = (D.prochainVote || []).map((s) => `<div class="li"><span class="e">${esc(s.split(' ')[0])}</span><span class="t">${esc(s.slice(s.indexOf(' ') + 1))}</span></div>`).join('');
      return `<div class="livebox"><small style="font-weight:900;font-size:11px;letter-spacing:.5px">🔴 PROCHAIN LIVE</small><b>${esc(INFOS.prochainLive.quand)}</b><span style="font-weight:800;font-size:13px">${esc(INFOS.prochainLive.quoi)}</span></div>
        <a class="btn" href="${INFOS.tiktok}" target="_blank" rel="noopener">Suivre @saint.tabarnouche sur TikTok</a>
        ${vote ? `<h3>🗳️ Le vote en cours</h3><p>Vote dans les commentaires de la dernière vidéo.</p>${vote}` : ''}
        <h3>🎬 Les vidéos Jour par Jour</h3>
        ${INFOS.videos.map((v) => `<a class="li" style="color:inherit;text-decoration:none" href="${INFOS.tiktok}" target="_blank" rel="noopener"><span class="e">${v.e}</span><span class="t">${esc(v.n)}<small>Jour ${v.j}</small></span><span class="tag">Voir</span></a>`).join('')}
        <a class="btn alt" href="${INFOS.roblox}" target="_blank" rel="noopener">🎮 Jouer à Saint-T Québec RP sur Roblox</a>`;
    },
    recensement() {
      const pct = Math.min(100, Math.round((D.habitants || 0) / (D.objectif || 1) * 100));
      const og = (D.og || []).map((p, i) => `<div class="li"><span class="e">${['🥇', '🥈', '🥉'][i] || '⭐'}</span><span class="t">${esc(p)}<small>OG #${i + 1}</small></span></div>`).join('');
      return `<div class="big"><div class="stat"><small>POPULATION</small><b>${nb(D.habitants)}</b></div><div class="stat"><small>COFFRE</small><b style="color:var(--vert,#2e9b48)">${nb(D.coffre)} $</b></div></div>
        <div class="bar"><i style="width:${pct}%"></i></div><p style="font-size:12px;color:var(--muted)">${pct} % de l'objectif de ${nb(D.objectif)} habitants · Jour ${esc(D.jour || '')} · mis à jour le ${esc(D.maj || '')}</p>
        <h3>📋 Fais-toi recenser</h3><p>Écris ton nom TikTok et la job que tu veux en commentaire. Le maire t'ajoute dans la ville, avec ta maison ou ta job.</p>
        <a class="btn" href="${INFOS.tiktok}" target="_blank" rel="noopener">Commenter sur TikTok</a>
        <button class="btn ghost" data-go="habitants">🔎 Vérifier si je suis déjà dans la ville</button>
        ${og ? `<h3>🏆 Le mur des OG</h3>${og}` : ''}
        <h3>🏗️ Ce que vous avez bâti</h3>${(D.batiments || []).slice().reverse().map((b) => `<div class="li"><span class="e">🧱</span><span class="t">${esc(b.n)}<small>Jour ${b.j} · ${esc(b.d)}</small></span></div>`).join('')}`;
    },
    boutique() {
      return `<p>Le merch officiel de la ville. Le stand est aussi dans la ville.</p>
        ${INFOS.boutique.map((m) => `<div class="li"><span class="e">${m.e}</span><span class="t">${esc(m.n)}<small>${esc(m.d)}</small></span>${m.prix ? (m.lien ? `<a class="tag" style="text-decoration:none" href="${m.lien}" target="_blank" rel="noopener">${m.prix}</a>` : `<span class="tag">${m.prix}</span>`) : '<span class="tag soon">Bientôt</span>'}</div>`).join('')}
        <a class="btn" href="${INFOS.boutique[0].lien}" target="_blank" rel="noopener">Acheter mon certificat (lien en bio)</a>
        <button class="btn alt" data-go="stand">👕 Aller au stand dans la ville</button>`;
    },
  };
  const titles = { videos: 'Vidéos & lives', recensement: 'Recensement', boutique: 'Boutique Saint-T' };

  function go(id) {
    if (id === 'ville') { const again = cur === 'ville'; closeAll(); setOn('ville'); if (again && $('#mm')) $('#mm').click(); return; }
    if (id === 'habitants') { closeAll(); setOn(id); $('#btnWho') && $('#btnWho').click(); return; }
    if (cur === id && sheet.classList.contains('open')) { closeAll(); setOn('ville'); return; }
    closeAll(); setOn(id); openSheet(titles[id], pages[id]());
  }
  bar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.t); });
  $('#shx').addEventListener('click', () => { closeAll(); setOn('ville'); });
  sheet.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    if (b.dataset.go === 'stand') { closeAll(); setOn('ville'); window.__go && window.__go('Boutique Saint-T'); }
    else go(b.dataset.go);
  });
  // quand le panneau Habitants se ferme par son ✕, on revient sur Ville
  const who = $('#who'); if (who) new MutationObserver(() => { if (cur === 'habitants' && !who.classList.contains('open')) setOn('ville'); }).observe(who, { attributes: true, attributeFilter: ['class'] });

  // conseil d'installation (iPhone, dans Safari seulement)
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  if (ios && !standalone && !store.get('st-install-vu')) {
    const enter = $('#enter'); const show = () => setTimeout(() => inst.classList.add('show'), 4000);
    enter ? enter.addEventListener('click', show, { once: true }) : show();
    inst.querySelector('button').addEventListener('click', () => { inst.classList.remove('show'); store.set('st-install-vu', '1'); });
  }
})();
