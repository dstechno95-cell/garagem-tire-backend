const axios = require('axios');

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';
const ML_AFFILIATE_TOOL = process.env.ML_AFFILIATE_TOOL || '16023631';

/**
 * Busca produtos no Mercado Livre via API pública.
 * Sem categoria — query de texto já é suficientemente precisa.
 * Filtro "pneu"/"tire" no título evita ruído.
 */
async function searchMercadoLivreProducts(query, limit = 6) {
  try {
    const response = await axios.get(ML_SEARCH_URL, {
      params: {
        q: query,
        condition: 'new',
        limit,
      },
      timeout: 10000,
    });

    const results = response.data?.results || [];

    return results
      .filter((item) => {
        const title = item.title.toLowerCase();
        return title.includes('pneu') || title.includes('tire');
      })
      .map((item) => {
        const discount = calculateDiscount(item.price, item.original_price);

        return {
          id: `ml_${item.id}`,
          title: item.title,
          price: item.price,
          originalPrice: item.original_price || null,
          discountPercent: discount,
          thumbnailUrl: item.thumbnail.replace('http://', 'https://'),
          affiliateUrl: buildMlAffiliateUrl(item.permalink),
          store: 'MERCADO_LIVRE',
          condition: item.condition === 'new' ? 'NEW' : 'USED',
          freeShipping: item.shipping?.free_shipping || false,
          rating: null,
          reviewCount: null,
        };
      });

  } catch (error) {
    console.error('[ML] Erro na busca:', error.message);
    return [];
  }
}

function buildMlAffiliateUrl(permalink) {
  const separator = permalink.includes('?') ? '&' : '?';
  return `${permalink}${separator}matt_tool=${ML_AFFILIATE_TOOL}&matt_word=garagem_pro`;
}

function calculateDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

module.exports = { searchMercadoLivreProducts };
