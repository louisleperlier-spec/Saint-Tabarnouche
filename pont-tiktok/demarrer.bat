@echo off
REM Windows : double-clique sur ce fichier pour brancher le jeu sur ton live TikTok.
cd /d "%~dp0"
where node >nul 2>nul || (echo Il manque Node.js. Installe la version LTS sur https://nodejs.org puis relance ce fichier. & pause & exit /b 1)
if not exist node_modules call npm install --no-fund --no-audit
start "" cmd /c "timeout /t 3 >nul & start http://localhost:21213"
node pont.js saint.tabarnouche
pause
