const NodeCache = require('node-cache');

const ttl = parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10);

// Cache em memória — "pneu 185/65R15" buscado por 50 usuários no mesmo dia = 1 chamada real às APIs
const cache = new NodeCache({ stdTTL: ttl, checkperiod: 120 });

module.exports = cache;
