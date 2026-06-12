const rateLimit = require('express-rate-limit');

// 30 buscas por IP por minuto — suficiente para uso normal, bloqueia abuso
const tireSearchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Muitas buscas. Tente novamente em um minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { tireSearchLimiter };
