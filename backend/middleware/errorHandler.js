// backend/middleware/errorHandler.js
const { Prisma } = require('@prisma/client');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  // Selalu catat error asli di konsol server untuk kebutuhan debugging
  console.error('🔥 Server Error:', err);

  let statusCode = err.statusCode || 500;
  let message = 'Terjadi kesalahan internal pada server.';

  // Tangani error validasi kustom atau input yang tidak valid
  if (err.name === 'ValidationError' || err.status === 400) {
    statusCode = 400;
    message = err.message;
  }

  // Sembunyikan pesan internal Prisma (seperti timeout, query salah, dll)
  if (err instanceof Prisma.PrismaClientKnownRequestError ||
      err instanceof Prisma.PrismaClientInitializationError ||
      err instanceof Prisma.PrismaClientRustPanickedError) {
    statusCode = 500;
    message = 'Gagal terhubung ke layanan basis data. Silakan coba beberapa saat lagi.';
  }

  // Jika error timeout atau database pool penuh
  if (err.message && err.message.includes('pool timeout')) {
    statusCode = 503;
    message = 'Layanan sedang sibuk (padat). Silakan coba lagi.';
  }

  // Kirim respon aman ke frontend
  res.status(statusCode).json({
    success: false,
    message: env.NODE_ENV === 'development' ? err.message : message,
    // stack trace hanya dikirim pada mode development jika benar-benar dibutuhkan
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
