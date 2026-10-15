const prisma = require('../config/prisma');

// Helper function untuk generate Slug dari Judul
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Ganti spasi/karakter non-alphanumeric dengan "-"
    .replace(/^-+|-+$/g, '');   // Hapus strip di awal/akhir
};

// --- 1. MANAJEMEN BERITA ---
exports.getAllBerita = async (req, res, next) => {
  try {
    const berita = await prisma.berita.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        kategori: true,
        author: {
          select: { id: true, email: true }
        }
      }
    });
    res.json({ success: true, data: berita });
  } catch (error) {
    next(error);
  }
};

exports.createBerita = async (req, res, next) => {
  try {
    const { judul, konten, kategoriId, isPublished } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi.' });
    }

    // Generate Slug Unik
    let slug = createSlug(judul);
    const existingBerita = await prisma.berita.findUnique({ where: { slug } });
    if (existingBerita) {
      slug = `${slug}-${Date.now()}`;
    }

    // Ambil ID User dari Token Authenticated (Mendukung req.user.id atau req.user.userId)
    const authorId = req.user?.id || req.user?.userId;
    if (!authorId) {
      return res.status(401).json({ success: false, message: 'User pengunggah tidak terautentikasi.' });
    }

    // Penanganan Tipe Data kategoriId (Konversi ke Int jika angka, atau string jika String/CUID/UUID)
    let parsedKategoriId = null;
    if (kategoriId && kategoriId !== 'null' && kategoriId !== 'undefined') {
      parsedKategoriId = !isNaN(kategoriId) ? parseInt(kategoriId, 10) : kategoriId;
    }

    const newBerita = await prisma.berita.create({
      data: {
        judul,
        slug,
        konten,
        isPublished: isPublished === 'true' || isPublished === true,
        authorId,
        kategoriId: parsedKategoriId,
        gambar: req.file ? req.file.filename : null
      },
      include: { kategori: true }
    });

    res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan', data: newBerita });
  } catch (error) {
    console.error('Error createBerita:', error);
    next(error);
  }
};

exports.deleteBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Format ID jika Integer
    const beritaId = !isNaN(id) ? parseInt(id, 10) : id;

    await prisma.berita.delete({ where: { id: beritaId } });
    res.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

// --- 2. MANAJEMEN KATEGORI BERITA ---
exports.getAllKategori = async (req, res, next) => {
  try {
    const kategori = await prisma.kategoriBerita.findMany({
      orderBy: { nama: 'asc' }
    });
    res.json({ success: true, data: kategori });
  } catch (error) {
    next(error);
  }
};

// --- 3. MANAJEMEN PENGUMUMAN ---
exports.getAllPengumuman = async (req, res, next) => {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: pengumuman });
  } catch (error) {
    next(error);
  }
};

exports.createPengumuman = async (req, res, next) => {
  try {
    const { judul, konten, isPublished } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ success: false, message: 'Judul dan konten pengumuman wajib diisi.' });
    }

    let slug = createSlug(judul);
    const existingPengumuman = await prisma.pengumuman.findUnique({ where: { slug } });
    if (existingPengumuman) {
      slug = `${slug}-${Date.now()}`;
    }

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        slug,
        konten,
        isPublished: isPublished === 'true' || isPublished === true
      }
    });

    res.status(201).json({ success: true, message: 'Pengumuman berhasil dibuat', data: newPengumuman });
  } catch (error) {
    next(error);
  }
};

exports.deletePengumuman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pengumumanId = !isNaN(id) ? parseInt(id, 10) : id;

    await prisma.pengumuman.delete({ where: { id: pengumumanId } });
    res.json({ success: true, message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};
