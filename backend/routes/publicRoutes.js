const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Endpoint tanpa autentikasi (Terbuka untuk Umum)
router.get('/home', publicController.getHomeData);
router.get('/berita', publicController.getBerita);
router.get('/berita/:id', publicController.getBeritaDetail);
router.get('/pengumuman', publicController.getPengumuman);
router.get('/pengumuman/:id', publicController.getPengumumanDetail);
router.get('/kategori', publicController.getKategori);
router.get('/galeri', publicController.getGaleri);
router.post('/kontak', publicController.submitKontak);

module.exports = router;
