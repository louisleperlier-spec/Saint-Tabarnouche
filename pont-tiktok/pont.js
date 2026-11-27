// Pont TikTok LIVE -> jeu « Bâtisseurs contre Grinch ».
// Lance : node pont.js [pseudo TikTok]   puis ouvre http://localhost:21213
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector';

const PORT = 21213;
const PSEUDO = (process.argv[2] || process.env.TIKTOK || 'saint.tabarnouche').replace(/^@/, '').trim();
const ICI = path.dirname(fileURLToPath(import.meta.url));
const JEU = path.join(ICI, '..', 'jeu-live.html');

// Petit serveur : la page du jeu sur / et les événements en direct sur /pont
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url.startsWith('/?') || req.url.startsWith('/jeu-live.html')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(fs.readFileSync(JEU));
  } else { res.writeHead(404); res.end(); }
});
const wss = new WebSocketServer({ server, path: '/pont' });
let etat = { type: 'etat', ok: false, texte: 'Connexion à TikTok…' };
function envoyer(o) { const s = JSON.stringify(o); for (const c of wss.clients) if (c.readyState === 1) c.send(s); }
function statut(ok, texte) { etat = { type: 'etat', ok, texte }; envoyer(etat); console.log((ok ? '✅ ' : '⏳ ') + texte); }
wss.on('connection', ws => ws.send(JSON.stringify(etat)));

// TikTok
const live = new TikTokLiveConnection(PSEUDO, { enableExtendedGiftInfo: false });
const series = new Map(); // séries de cadeaux (combo) : on n'ajoute que la différence
let essai;
function reessayer(sec) { clearTimeout(essai); essai = setTimeout(connecter, sec * 1000); }
function connecter() {
  statut(false, `Connexion au live de @${PSEUDO}…`);
  live.connect().then(() => statut(true, `Branché sur le live de @${PSEUDO}`))
    .catch(e => { statut(false, `@${PSEUDO} n'est pas en live (ou TikTok refuse). Nouvel essai dans 20 s.`); if (process.env.DEBUG) console.error(e); reessayer(20); });
}
live.on(ControlEvent.DISCONNECTED, () => { statut(false, 'Déconnecté de TikTok. Nouvel essai dans 10 s.'); reessayer(10); });
live.on(WebcastEvent.STREAM_END, () => { statut(false, 'Le live est terminé.'); reessayer(30); });

live.on(WebcastEvent.GIFT, d => {
  const g = d.giftDetails || {};
  const nom = g.giftName || d.extendedGiftInfo?.name || ('Cadeau ' + d.giftId);
  const qui = d.user?.nickname || d.user?.uniqueId || '';
  const cle = (d.user?.userId || qui) + ':' + d.giftId + ':' + (d.groupId || '');
  const total = d.repeatCount || 1;
  let n = total;
  if (g.giftType === 1) {          // cadeau en série : on compte au fur et à mesure
    n = total - (series.get(cle) || 0);
    if (d.repeatEnd) series.delete(cle); else series.set(cle, total);
  }
  if (n <= 0) return;
  console.log(`🎁 ${qui} : ${nom} x${n} (${g.diamondCount || '?'} 💎)`);
  envoyer({ type: 'cadeau', nom, n, diamants: g.diamondCount || 0, qui });
});
live.on(WebcastEvent.LIKE, d => envoyer({ type: 'likes', n: d.likeCount || 0, qui: d.user?.nickname || '' }));
live.on(WebcastEvent.FOLLOW, d => envoyer({ type: 'abonnement', qui: d.user?.nickname || d.user?.uniqueId || '' }));
live.on(WebcastEvent.CHAT, d => envoyer({ type: 'commentaire', texte: d.comment || '', qui: d.user?.nickname || d.user?.uniqueId || '', id: d.user?.userId || d.user?.uniqueId || '' }));

server.listen(PORT, () => {
  console.log(`\n🎮 Jeu prêt : ouvre http://localhost:${PORT} dans ton navigateur (et capture cette fenêtre dans LIVE Studio).`);
  console.log('   Pour arrêter : ferme cette fenêtre (ou Ctrl+C).\n');
  connecter();
});
