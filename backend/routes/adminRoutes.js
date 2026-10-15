// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAllPendaftar, updateStatusPendaftaran } = require('../controllers/adminController');

// Impor sesuai nama eksport di auth.js
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Gunakan authenticateToken dan authorizeRoles('ADMIN')
router.get('/ppdb', authenticateToken, authorizeRoles('ADMIN'), getAllPendaftar);
router.put('/ppdb/:id/status', authenticateToken, authorizeRoles('ADMIN'), updateStatusPendaftaran);

module.exports = router;
