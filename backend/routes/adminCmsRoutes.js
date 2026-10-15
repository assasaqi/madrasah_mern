const express = require('express');
const router = express.Router();
const adminCmsController = require('../controllers/adminCmsController');

// 🟢 PERBAIKAN: Arahkan require ke ../middleware/auth (bukan ./routes/authRoutes)
const authMiddleware = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');

// Normalisasi Auth Middleware
const authenticateToken = authMiddleware.authenticateToken || authMiddleware.verifyToken || authMiddleware;
const authorizeRoles = typeof authMiddleware.authorizeRoles === 'function'
  ? authMiddleware.authorizeRoles('ADMIN')
  : (authMiddleware.isAdmin || ((req, res, next) => next()));

// Proteksi Auth Admin
router.use(authenticateToken);
router.use(authorizeRoles);

// --- 1. RUTE BERITA ---
router.get('/berita', adminCmsController.getAllBerita);
router.post(
  '/berita',
  upload.single('gambar'),
  processImage,
  adminCmsController.createBerita
);
router.delete('/berita/:id', adminCmsController.deleteBerita);

// --- 2. RUTE KATEGORI BERITA ---
router.get('/kategori', adminCmsController.getAllKategori);

// --- 3. RUTE PENGUMUMAN ---
router.get('/pengumuman', adminCmsController.getAllPengumuman);
router.post('/pengumuman', adminCmsController.createPengumuman);
router.delete('/pengumuman/:id', adminCmsController.deletePengumuman);

module.exports = router;
