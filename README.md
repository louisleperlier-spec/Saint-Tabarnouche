# Visite Saint-Tabarnouche

Ville 3D à visiter dans le navigateur (cellulaire et ordi), bâtie à partir du même monde three.js que les vidéos TikTok @saint.tabarnouche.

- `index.html` : la page publiée (aucune étape de build pour Vercel, c'est un site statique).
- `source/` : les morceaux qui génèrent la page (`python3 source/build.py`, lit les données de la ville dans `site-ville/index.html` du projet).

## Mode app (iPhone)

- Le site s'installe comme une app : dans Safari, Partager → « Sur l'écran d'accueil » (icône Saint-T, plein écran).
- `app.js` + `app.css` ajoutent la barre d'onglets (Ville, Habitants, Vidéos & lives, Recensement, Boutique). Pour changer le prochain live, les vidéos, les prix ou les liens, modifie seulement le bloc `INFOS` en haut de `app.js`.
- `manifest.webmanifest`, `icons/` et `sw.js` (copie hors ligne) servent à l'installation. Ces fichiers sont branchés dans le `<head>` de `index.html` : si tu régénères la page avec `build.py`, garde ces lignes.
