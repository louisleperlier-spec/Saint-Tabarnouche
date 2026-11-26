// Nombre d'abonnés TikTok de @saint.tabarnouche, relu au plus toutes les 30 minutes
// (le cache de Vercel garde la réponse 30 min). Renvoie {"value": N} ou {"value": null}.
const COMPTE = 'saint.tabarnouche';

module.exports = async (req, res) => {
  let value = null;
  try {
    const r = await fetch('https://www.tiktok.com/@' + COMPTE, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'accept-language': 'fr-CA,fr;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
    });
    const html = await r.text();
    const m = html.match(/"followerCount":\s*(\d+)/);
    if (m) value = Number(m[1]);
  } catch (e) {}
  res.setHeader('content-type', 'application/json; charset=utf-8');
  // Réussi : gardé 30 min. Raté : on réessaie après 5 min.
  res.setHeader('cache-control', value ? 'public, s-maxage=1800, stale-while-revalidate=600' : 'public, s-maxage=300');
  res.end(JSON.stringify({ value }));
};
