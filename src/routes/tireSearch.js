const express = require('express');
const router = express.Router();

const { searchShopeeProducts } = require('../services/shopeeService');
const { searchMercadoLivreProducts } = require('../services/mercadoLivreService');
const { getAmazonSearchResult } = require('../services/amazonService');
const cache = require('../utils/cache');
const { tireSearchLimiter } = require('../middleware/rateLimiter');

// Autenticação simples — impede uso aberto da API
function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'API key inválida' });
  }
  next();
}

/**
 * GET /api/tires/search?q=pneu+185/65R15&type=CAR
 *
 * Busca nas 3 lojas em paralelo e retorna resultados intercalados (round-robin).
 * Respostas ficam em cache por CACHE_TTL_SECONDS (padrão 1h).
 */
router.get('/search', requireApiKey, tireSearchLimiter, async (req, res) => {
  const { q, type } = req.query;

  if (!q || q.trim().length < 3) {
    return res.status(400).json({ error: 'Parâmetro "q" obrigatório (mín. 3 caracteres)' });
  }

  const cacheKey = `tire_search_${type || 'CAR'}_${q.toLowerCase().trim()}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }

  try {
    // Busca nas 3 lojas em paralelo — falha individual retorna lista vazia
    const [shopeeResults, mlResults, amazonResults] = await Promise.all([
      searchShopeeProducts(q, 6),
      searchMercadoLivreProducts(q, 6),
      Promise.resolve(getAmazonSearchResult(q)),
    ]);

    // Round-robin: ML1, Shopee1, Amazon1, ML2, Shopee2...
    const interleaved = interleave(mlResults, shopeeResults, amazonResults);

    const result = {
      query: q,
      vehicleType: type || 'CAR',
      results: interleaved,
      counts: {
        mercadoLivre: mlResults.length,
        shopee: shopeeResults.length,
        amazon: amazonResults.length,
      },
      fromCache: false,
    };

    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('[TireSearch] Erro geral:', error.message);
    res.status(500).json({ error: 'Erro ao buscar produtos. Tente novamente.' });
  }
});

function interleave(...lists) {
  const result = [];
  const maxLen = Math.max(...lists.map((l) => l.length));
  for (let i = 0; i < maxLen; i++) {
    for (const list of lists) {
      if (i < list.length) result.push(list[i]);
    }
  }
  return result;
}

module.exports = router;
