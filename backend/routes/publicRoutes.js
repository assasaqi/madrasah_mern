const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Endpoint beranda publik untuk mengambil statistik dan ringkasan data
router.get('/home', publicController.getHomeData);

// Endpoint daftar berita publik dengan paginasi dan filter
router.get('/berita', publicController.getBerita);

// Endpoint detail artikel berita berdasarkan ID atau Slug
router.get('/berita/:id', publicController.getBeritaDetail);

// Endpoint daftar pengumuman publik yang telah dipublikasikan
router.get('/pengumuman', publicController.getPengumuman);

// Endpoint detail pengumuman publik berdasarkan ID atau Slug
router.get('/pengumuman/:id', publicController.getPengumumanDetail);

// Endpoint mengambil seluruh kategori berita publik
router.get('/kategori', publicController.getKategori);

// Endpoint mengambil seluruh foto galeri kegiatan madrasah
router.get('/galeri', publicController.getGaleri);

// Endpoint mengirimkan pesan kontak dari pengunjung publik
router.post('/kontak', publicController.submitKontak);

module.exports = router;
