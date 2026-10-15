const express = require('express');
const router = express.Router();
const adminCms = require('../controllers/adminCmsController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Middleware Multer

// Proteksi semua rute khusus Admin
router.use(verifyToken, isAdmin);

// Berita Routes
router.get('/berita', adminCms.getAllBerita);
router.post('/berita', upload.single('image'), adminCms.createBerita);
router.delete('/berita/:id', adminCms.deleteBerita);

// Pengumuman Routes
router.get('/pengumuman', adminCms.getAllPengumuman);
router.post('/pengumuman', adminCms.createPengumuman);
router.delete('/pengumuman/:id', adminCms.deletePengumuman);

module.exports = router;
