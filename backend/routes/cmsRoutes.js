const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');

// Public Access
router.get('/berita', cmsController.getBerita);
router.get('/galeri', cmsController.getGaleri);

// Admin Access
router.post(
  '/berita',
  authenticateToken,
  authorizeRoles('ADMIN'),
  upload.single('gambar'),
  processImage,
  cmsController.createBerita
);

module.exports = router;
