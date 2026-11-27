#!/bin/bash
# Mac : double-clique sur ce fichier pour brancher le jeu sur ton live TikTok.
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Il manque Node.js. Installe la version LTS sur https://nodejs.org puis relance ce fichier."
  read -r -p "Appuie sur Entrée pour fermer."; exit 1
fi
[ -d node_modules ] || npm install --no-fund --no-audit
(sleep 3; open "http://localhost:21213") &
node pont.js "${1:-saint.tabarnouche}"
read -r -p "Appuie sur Entrée pour fermer."
