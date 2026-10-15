const prisma = require('../config/prisma');

// --- MANAJEMEN PENGUMUMAN PUBLIK (Tanpa Auth) ---

// Get All Pengumuman Publik (Hanya yang dipublikasikan)
exports.getPublicPengumuman = async (req, res, next) => {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      where: {
        isPublished: true // Hanya ambil yang dipublikasi
      },
      orderBy: { createdAt: 'desc' }
    });

    // Mapping field 'konten' menjadi 'isi' agar cocok dengan frontend
    const formattedData = pengumuman.map((item) => ({
      ...item,
      isi: item.konten || item.isi
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error getPublicPengumuman:', error);
    next(error);
  }
};

// Get Detail Pengumuman Publik by SLUG
exports.getPublicPengumumanBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const pengumuman = await prisma.pengumuman.findUnique({
      where: { slug }
    });

    if (!pengumuman || !pengumuman.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan atau belum dipublikasikan.'
      });
    }

    // Mapping field 'konten' menjadi 'isi' agar cocok dengan komponen React
    const formattedData = {
      ...pengumuman,
      isi: pengumuman.konten || pengumuman.isi
    };

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error getPublicPengumumanBySlug:', error);
    next(error);
  }
};
