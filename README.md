# Visite Saint-Tabarnouche

Ville 3D à visiter dans le navigateur (cellulaire et ordi), bâtie à partir du même monde three.js que les vidéos TikTok @saint.tabarnouche.

- `index.html` : la page publiée (aucune étape de build pour Vercel, c'est un site statique).
- `source/` : les morceaux qui génèrent la page (`python3 source/build.py`, lit les données de la ville dans `site-ville/index.html` du projet).
- `jeu-live.html` : jeu « Bâtisseurs contre Grinch » à capturer dans TikTok LIVE Studio (barre de cadeaux, touches 1-3 / 7-9 / L / F / Z).
