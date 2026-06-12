// Amazon PA-API requer aprovação separada (Product Advertising API).
// Por enquanto: retorna link de busca com tag de afiliado.
// Quando aprovado, expandir com chamadas reais à PA-API.

const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'garagempro-20';

function getAmazonSearchResult(query) {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.amazon.com.br/s?k=${encodedQuery}&tag=${AMAZON_AFFILIATE_TAG}`;

  return [
    {
      id: `amazon_search_${hashQuery(query)}`,
      title: `Buscar "${query}" na Amazon`,
      price: 0,
      originalPrice: null,
      discountPercent: null,
      thumbnailUrl: null,
      affiliateUrl: searchUrl,
      store: 'AMAZON',
      condition: 'NEW',
      freeShipping: false,
      rating: null,
      reviewCount: null,
      isSearchLink: true, // flag para o app saber que é link de busca, não produto real
    },
  ];
}

function hashQuery(query) {
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

module.exports = { getAmazonSearchResult };
