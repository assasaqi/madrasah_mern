const express = require('express');
const router = express.Router();
const akademikController = require('../controllers/akademikController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Guru Input Tahfidz
router.post(
  '/tahfidz',
  authenticateToken,
  authorizeRoles('GURU', 'ADMIN'),
  akademikController.inputTahfidz
);

// Rekap Tahfidz Siswa & Orang Tua
router.get(
  '/tahfidz/:siswaId',
  authenticateToken,
  authorizeRoles('SISWA', 'ORANG_TUA', 'GURU', 'ADMIN'),
  akademikController.getRekapTahfidz
);

module.exports = router;
