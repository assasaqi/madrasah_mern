// backend/routes/ppdbRoutes.js
const express = require('express');
const router = express.Router();
const ppdbController = require('../controllers/ppdbController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');

// User / Calon Pendaftar
router.get('/status', authenticateToken, ppdbController.getStatusPendaftaran);
router.post('/submit', authenticateToken, ppdbController.submitPendaftaran);
router.post(
  '/upload-dokumen',
  authenticateToken,
  upload.single('dokumen'),
  processImage,
  ppdbController.uploadDokumen
);

// Admin Only
router.patch(
  '/status/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  ppdbController.updateStatusPPDB
);

module.exports = router;

// Admin Only
router.patch(
  '/status/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  ppdbController.updateStatusPPDB
);

// PENTING: Jangan lupa baris ekspor ini agar tidak error di server.js!
module.exports = router;
