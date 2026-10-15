const prisma = require('../config/prisma');

// Fetch Berita Publik
exports.getBerita = async (req, res, next) => {
  try {
    const berita = await prisma.berita.findMany({
      where: { isPublished: true },
      include: { kategori: true, author: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: berita });
  } catch (error) {
    next(error);
  }
};

// Tambah Berita Baru (Admin Only)
exports.createBerita = async (req, res, next) => {
  try {
    const { judul, konten, kategoriId } = req.body;
    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const gambarUrl = req.file ? req.file.fileUrl : null;

    const berita = await prisma.berita.create({
      data: {
        judul,
        slug: `${slug}-${Date.now()}`,
        konten,
        gambarUrl,
        kategoriId,
        authorId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Berita berhasil diterbitkan', data: berita });
  } catch (error) {
    next(error);
  }
};

// Fetch Galeri Foto
exports.getGaleri = async (req, res, next) => {
  try {
    const galeri = await prisma.galeri.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: galeri });
  } catch (error) {
    next(error);
  }
};
