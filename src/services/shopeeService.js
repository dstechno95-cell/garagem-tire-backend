const axios = require('axios');
const { buildShopeeAuthHeader } = require('../utils/signature');

const SHOPEE_GRAPHQL_URL = 'https://open-api.affiliate.shopee.com.br/graphql';

const SHOPEE_APP_ID = process.env.SHOPEE_APP_ID;
const SHOPEE_APP_SECRET = process.env.SHOPEE_APP_SECRET;

/**
 * Busca produtos na Shopee via Affiliate Open API (GraphQL).
 * @param {string} query - ex: "pneu 185/65R15"
 * @param {number} limit - quantidade de resultados
 */
async function searchShopeeProducts(query, limit = 6) {
  const graphqlQuery = {
    query: `
      query ProductOfferV2($keyword: String, $limit: Int) {
        productOfferV2(keyword: $keyword, limit: $limit) {
          nodes {
            itemId
            productName
            price
            priceMin
            priceMax
            imageUrl
            offerLink
            shopName
            ratingStar
            sales
            commissionRate
          }
        }
      }
    `,
    variables: {
      keyword: query,
      limit: limit,
    },
  };

  const payload = JSON.stringify(graphqlQuery);
  const { authHeader } = buildShopeeAuthHeader(SHOPEE_APP_ID, SHOPEE_APP_SECRET, payload);

  try {
    const response = await axios.post(SHOPEE_GRAPHQL_URL, graphqlQuery, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      timeout: 10000,
    });

    const nodes = response.data?.data?.productOfferV2?.nodes || [];

    return nodes.map((item) => ({
      id: `shopee_${item.itemId}`,
      title: item.productName,
      price: parseFloat(item.price) || 0,
      originalPrice: parseFloat(item.priceMax) || null,
      discountPercent: calculateDiscount(item.price, item.priceMax),
      thumbnailUrl: item.imageUrl,
      affiliateUrl: item.offerLink, // já vem com tracking da Shopee
      store: 'SHOPEE',
      condition: 'NEW',
      freeShipping: false,
      rating: parseFloat(item.ratingStar) || null,
      reviewCount: item.sales || null,
      shopName: item.shopName,
    }));

  } catch (error) {
    console.error('[Shopee] Erro na busca:', error.response?.data || error.message);
    return [];
  }
}

function calculateDiscount(price, priceMax) {
  const p = parseFloat(price);
  const max = parseFloat(priceMax);
  if (!p || !max || max <= p) return null;
  return Math.round((1 - p / max) * 100);
}

module.exports = { searchShopeeProducts };
