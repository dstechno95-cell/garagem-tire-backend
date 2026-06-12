// Shopee Affiliate API — autenticação via header HMAC-SHA256
// Authorization: SHA256 Credential={appId}, Signature={signature}, Timestamp={timestamp}
// signature = SHA256(appId + timestamp + payload + appSecret)

const crypto = require('crypto');

function generateShopeeSignature(appId, appSecret, timestamp, payload) {
  const baseString = `${appId}${timestamp}${payload}${appSecret}`;
  return crypto
    .createHash('sha256')
    .update(baseString)
    .digest('hex');
}

function buildShopeeAuthHeader(appId, appSecret, payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateShopeeSignature(appId, appSecret, timestamp, payload);

  return {
    authHeader: `SHA256 Credential=${appId}, Signature=${signature}, Timestamp=${timestamp}`,
    timestamp,
  };
}

module.exports = { generateShopeeSignature, buildShopeeAuthHeader };
