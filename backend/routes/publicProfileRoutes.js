const express = require('express');
const router = express.Router();
const publicProfileController = require('../controllers/publicProfileController');

// GET /api/public/profile/school
router.get('/school', publicProfileController.getPublicSchoolProfile);

module.exports = router;
