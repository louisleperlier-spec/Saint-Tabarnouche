# Visite Saint-Tabarnouche

Ville 3D à visiter dans le navigateur (cellulaire et ordi), bâtie à partir du même monde three.js que les vidéos TikTok @saint.tabarnouche.

- `index.html` : la page publiée (aucune étape de build pour Vercel, c'est un site statique).
- `source/` : les morceaux qui génèrent la page (`python3 source/build.py`, lit les données de la ville dans `site-ville/index.html` du projet).
- `jeu-live.html` : jeu « Bâtisseurs contre Grinch » à capturer dans TikTok LIVE Studio (barre de cadeaux, touches 1-3 / 7-9 / L / F / Z).
- `source/argile.js` : le look « pâte à modeler » (formes arrondies, neige qui tombe des sapins, fumée des cheminées, bonhomme de neige, traces, ciel avec coucher de soleil et fenêtres qui s'allument, caméra cinéma). Collé après le monde, avant `explore.js`. Pour une vidéo : coller `argile.js` à la fin de `main.js` et appeler `clayUpdate(t, { sky: false })` juste avant `renderer.render` dans `renderAt`.
- Bâtir : `python3 source/build.py` réécrit `index.html` (page complète) et `source/index.html` (version Artifact).
- Options d'URL : `?heure=jour|dore|soir|nuit` fige l'heure, `?cine=1` part en mode cinéma 🎬.
