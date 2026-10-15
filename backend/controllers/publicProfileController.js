const prisma = require('../config/prisma');

exports.getPublicSchoolProfile = async (req, res, next) => {
  try {
    let profil = await prisma.profilSekolah.findFirst();

    if (!profil) {
      return res.status(404).json({
        success: false,
        message: 'Data profil sekolah belum dikonfigurasi.'
      });
    }

    res.json({
      success: true,
      data: profil
    });
  } catch (error) {
    console.error('Error getPublicSchoolProfile:', error);
    next(error);
  }
};
