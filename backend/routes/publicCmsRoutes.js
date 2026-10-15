const express = require('express');
const router = express.Router();

const {
  getPublicPengumuman,
  getPublicPengumumanBySlug
} = require('../controllers/adminCmsController'); // Sesuaikan path jika controller Anda terpisah

router.get('/pengumuman', getPublicPengumuman);
router.get('/pengumuman/:slug', getPublicPengumumanBySlug);

module.exports = router;
