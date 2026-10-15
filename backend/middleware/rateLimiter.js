const rateLimit = require('express-rate-limit');

// Rate Limiter untuk Endpoint Publik & Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Menit
  max: 10, // Maksimal 10 percobaan login/register
  message: { message: 'Terlalu banyak percobaan. Silakan coba lagi setelah 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter Umum API
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Menit
  max: 100, // Maksimal 100 request per menit
  message: { message: 'Terlalu banyak permintaan. Silakan pelankan akses Anda.' },
});

module.exports = { authLimiter, apiLimiter };
