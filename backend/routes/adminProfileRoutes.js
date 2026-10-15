const express = require('express');
const router = express.Router();
const profileController = require('../controllers/adminProfileController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Middleware Login & Role Admin
router.use(authenticateToken, authorizeRoles('ADMIN'));

// Profil Akun Admin
router.get('/me', profileController.getAdminProfile);

// Gunakan spread operator (...) jika upload.single() mengembalikan Array
router.put('/me', ...upload.single('foto'), profileController.updateAdminProfile);

router.put('/change-password', profileController.changePassword);

// Profil Sekolah / Publik
router.get('/school', profileController.getSchoolProfile);

router.put(
  '/school',
  ...upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  profileController.updateSchoolProfile
);

module.exports = router;
