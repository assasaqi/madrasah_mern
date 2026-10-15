const prisma = require('../config/prisma');

// --- 1. MANAJEMEN BERITA ---
exports.getAllBerita = async (req, res, next) => {
  try {
    const berita = await prisma.berita.findMany({
      orderBy: { createdAt: 'desc' },
      include: { kategori: true }
    });
    res.json(berita);
  } catch (error) {
    next(error);
  }
};

exports.createBerita = async (req, res, next) => {
  try {
    const { title, category, excerpt, content, published } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newBerita = await prisma.berita.create({
      data: {
        title,
        category,
        excerpt,
        content,
        imageUrl,
        published: published === 'true' || published === true
      }
    });
    res.status(201).json({ message: 'Berita berhasil ditambahkan', data: newBerita });
  } catch (error) {
    next(error);
  }
};

exports.deleteBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.berita.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

// --- 2. MANAJEMEN PENGUMUMAN ---
exports.getAllPengumuman = async (req, res, next) => {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(pengumuman);
  } catch (error) {
    next(error);
  }
};

exports.createPengumuman = async (req, res, next) => {
  try {
    const { title, content, targetDate } = req.body;
    const newPengumuman = await prisma.pengumuman.create({
      data: { title, content, targetDate: targetDate ? new Date(targetDate) : null }
    });
    res.status(201).json({ message: 'Pengumuman berhasil dibuat', data: newPengumuman });
  } catch (error) {
    next(error);
  }
};

exports.deletePengumuman = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.pengumuman.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};
