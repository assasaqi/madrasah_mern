const express = require('express');
const router = express.Router();
const adminCmsController = require('../controllers/adminCmsController');

// Import Middleware
const authMiddleware = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');

// Normalisasi Auth Middleware
const authenticateToken = authMiddleware.authenticateToken || authMiddleware.verifyToken || authMiddleware;
const authorizeRoles = typeof authMiddleware.authorizeRoles === 'function'
  ? authMiddleware.authorizeRoles('ADMIN')
  : (authMiddleware.isAdmin || ((req, res, next) => next()));

// Helper Middleware untuk menangani upload gambar Berita (field 'gambar' atau 'imageFile')
const handleImageUpload = (req, res, next) => {
  upload.single('gambar')(req, res, (err) => {
    if (err) {
      // Fallback mencoba field 'imageFile' jika 'gambar' tidak ditemukan
      return upload.single('imageFile')(req, res, (err2) => {
        if (err2) return next(err2);
        next();
      });
    }
    next();
  });
};

// Helper Middleware untuk menangani upload file Lampiran Pengumuman ('lampiran', 'file', atau 'fileLampiran')
const handleLampiranUpload = (req, res, next) => {
  upload.single('lampiran')(req, res, (err) => {
    if (err) {
      return upload.single('file')(req, res, (err2) => {
        if (err2) {
          return upload.single('fileLampiran')(req, res, (err3) => {
            if (err3) return next(err3);
            next();
          });
        }
        next();
      });
    }
    next();
  });
};

// Proteksi Auth Admin
router.use(authenticateToken);
router.use(authorizeRoles);

// --- 1. RUTE BERITA ---
router.get('/berita', adminCmsController.getAllBerita);

router.post(
  '/berita',
  handleImageUpload,
  processImage,
  adminCmsController.createBerita
);

router.put(
  '/berita/:id',
  handleImageUpload,
  processImage,
  adminCmsController.updateBerita
);

router.delete('/berita/:id', adminCmsController.deleteBerita);

// --- 2. RUTE KATEGORI BERITA ---
router.get('/kategori', adminCmsController.getAllKategori);

// --- 3. RUTE PENGUMUMAN ---
router.get('/pengumuman', adminCmsController.getAllPengumuman);

router.post(
  '/pengumuman',
  handleLampiranUpload,
  processImage,
  adminCmsController.createPengumuman
);

router.put(
  '/pengumuman/:id',
  handleLampiranUpload,
  processImage,
  adminCmsController.updatePengumuman
);

router.delete('/pengumuman/:id', adminCmsController.deletePengumuman);

module.exports = router;
