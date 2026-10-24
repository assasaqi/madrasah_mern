// const rateLimit = require('express-rate-limit');

// // Rate Limiter untuk Endpoint Publik & Auth
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 Menit
//   max: 10, // Maksimal 10 percobaan login/register
//   message: { message: 'Terlalu banyak percobaan. Silakan coba lagi setelah 15 menit.' },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Rate Limiter Umum API
// const apiLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 Menit
//   max: 100, // Maksimal 100 request per menit
//   message: { message: 'Terlalu banyak permintaan. Silakan pelankan akses Anda.' },
// });

// module.exports = { authLimiter, apiLimiter };


const rateLimit = require('express-rate-limit');
const env = require('../config/env');

// Limitasi khusus endpoint autentikasi dengan toleransi tinggi saat development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 100 : 10,
  message: { message: 'Terlalu banyak percobaan. Silakan coba lagi setelah 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitasi umum rute API dengan toleransi tinggi saat development
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 1000 : 100,
  message: { message: 'Terlalu banyak permintaan. Silakan pelankan akses Anda.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
