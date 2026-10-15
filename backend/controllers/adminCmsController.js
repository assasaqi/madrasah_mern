const prisma = require('../config/prisma');
const { deleteFile } = require('../middleware/upload'); // Import helper untuk hapus file fisik

// Helper function untuk generate Slug dari Judul
const createSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Ganti spasi/karakter non-alphanumeric dengan "-"
    .replace(/^-+|-+$/g, '');   // Hapus strip di awal/akhir
};

// --- 1. MANAJEMEN BERITA ---

// Get All Berita (Admin)
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

// Alias untuk getAdminBerita
exports.getAdminBerita = exports.getAllBerita;

// Create Berita Baru
exports.createBerita = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { judul, konten, kategoriId, isPublished } = body;

    if (!judul || !konten) {
      return res.status(400).json({ success: false, message: 'Judul dan konten berita wajib diisi.' });
    }

    // Validasi Notifikasi: Panjang Judul Maksimal 200 Karakter
    if (judul.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: `Judul berita terlalu panjang (${judul.trim().length} karakter). Maksimal 200 karakter.`
      });
    }

    // Generate Slug Unik (Dipotong max 190 karakter untuk keamanan database)
    let slugBase = createSlug(judul).substring(0, 190);
    let slug = slugBase;
    const existingBerita = await prisma.berita.findUnique({ where: { slug } });
    if (existingBerita) {
      slug = `${slugBase}-${Date.now()}`;
    }

    // Ambil ID User dari Token Authenticated
    const authorId = req.user?.id || req.user?.userId;
    if (!authorId) {
      return res.status(401).json({ success: false, message: 'User pengunggah tidak terautentikasi.' });
    }

    // Normalisasi kategoriId
    let parsedKategoriId = null;
    if (kategoriId && kategoriId !== 'null' && kategoriId !== 'undefined' && kategoriId !== '') {
      parsedKategoriId = String(kategoriId);
    }

    const newBerita = await prisma.berita.create({
      data: {
        judul: judul.trim(),
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
    if (error.code === 'P2000') {
      return res.status(400).json({
        success: false,
        message: 'Judul berita atau data input terlalu panjang melebihi kapasitas kolom database.'
      });
    }
    next(error);
  }
};

// Update Berita
exports.updateBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beritaId = !isNaN(id) && Number.isInteger(Number(id)) ? parseInt(id, 10) : String(id);
    const body = req.body || {};
    const { judul, konten, kategoriId, isPublished } = body;

    const existingBerita = await prisma.berita.findUnique({ where: { id: beritaId } });
    if (!existingBerita) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
    }

    if (judul && judul.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: `Judul berita terlalu panjang (${judul.trim().length} karakter). Maksimal 200 karakter.`
      });
    }

    let gambarPath = existingBerita.gambar;
    // Hapus foto lama jika ada pengunggahan foto baru
    if (req.file) {
      if (existingBerita.gambar) {
        deleteFile(existingBerita.gambar);
      }
      gambarPath = req.file.filename;
    }

    let slug = existingBerita.slug;
    if (judul && judul !== existingBerita.judul) {
      let slugBase = createSlug(judul).substring(0, 190);
      slug = slugBase;
      const slugExists = await prisma.berita.findFirst({
        where: { slug, NOT: { id: beritaId } }
      });
      if (slugExists) {
        slug = `${slugBase}-${Date.now()}`;
      }
    }

    let parsedKategoriId = existingBerita.kategoriId;
    if (kategoriId !== undefined) {
      parsedKategoriId = (kategoriId && kategoriId !== 'null' && kategoriId !== 'undefined' && kategoriId !== '')
        ? String(kategoriId)
        : null;
    }

    const updatedBerita = await prisma.berita.update({
      where: { id: beritaId },
      data: {
        ...(judul && { judul: judul.trim() }),
        ...(slug && { slug }),
        ...(konten && { konten }),
        gambar: gambarPath,
        ...(isPublished !== undefined && { isPublished: isPublished === 'true' || isPublished === true }),
        kategoriId: parsedKategoriId
      },
      include: { kategori: true }
    });

    res.json({ success: true, message: 'Berita berhasil diperbarui', data: updatedBerita });
  } catch (error) {
    console.error('Error updateBerita:', error);
    if (error.code === 'P2000') {
      return res.status(400).json({
        success: false,
        message: 'Judul berita atau data input terlalu panjang melebihi kapasitas kolom database.'
      });
    }
    next(error);
  }
};

// Delete Berita
exports.deleteBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beritaId = !isNaN(id) && Number.isInteger(Number(id)) ? parseInt(id, 10) : String(id);

    // 1. Cari data berita untuk mendapatkan nama file gambar
    const existingBerita = await prisma.berita.findUnique({ where: { id: beritaId } });

    if (!existingBerita) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    // 2. Hapus file gambar fisik dari folder /uploads jika ada
    if (existingBerita.gambar) {
      deleteFile(existingBerita.gambar);
    }

    // 3. Hapus data dari database
    await prisma.berita.delete({ where: { id: beritaId } });

    res.json({ success: true, message: 'Berita dan gambar terkait berhasil dihapus' });
  } catch (error) {
    console.error('Error deleteBerita:', error);
    next(error);
  }
};

// --- 2. MANAJEMEN KATEGORI BERITA ---
exports.getAllKategori = async (req, res, next) => {
  try {
    const kategoriModel = prisma.kategoriBerita || prisma.kategori;

    if (!kategoriModel) {
      return res.status(500).json({ success: false, message: 'Model Kategori tidak ditemukan pada Prisma Client.' });
    }

    const kategori = await kategoriModel.findMany({
      orderBy: { nama: 'asc' }
    });
    res.json({ success: true, data: kategori });
  } catch (error) {
    console.error('Error getAllKategori:', error);
    next(error);
  }
};

// --- 3. MANAJEMEN PENGUMUMAN ---

// Get All Pengumuman (Admin)
exports.getAllPengumuman = async (req, res, next) => {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });
    res.json({ success: true, data: pengumuman });
  } catch (error) {
    next(error);
  }
};

// --- 3. MANAJEMEN PENGUMUMAN ---

// Get All Pengumuman
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

// Create Pengumuman
exports.createPengumuman = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { judul, konten, isPublished } = body;

    if (!judul || !konten) {
      return res.status(400).json({ success: false, message: 'Judul dan konten pengumuman wajib diisi.' });
    }

    if (judul.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: `Judul pengumuman terlalu panjang (${judul.trim().length} karakter). Maksimal 200 karakter.`
      });
    }

    let slugBase = createSlug(judul).substring(0, 190);
    let slug = slugBase;
    const existingPengumuman = await prisma.pengumuman.findUnique({ where: { slug } });
    if (existingPengumuman) {
      slug = `${slugBase}-${Date.now()}`;
    }

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul: judul.trim(),
        slug,
        konten,
        isPublished: isPublished === 'true' || isPublished === true
      }
    });

    res.status(201).json({ success: true, message: 'Pengumuman berhasil dibuat', data: newPengumuman });
  } catch (error) {
    console.error('Error createPengumuman:', error);
    next(error);
  }
};

// Update Pengumuman
exports.updatePengumuman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pengumumanId = !isNaN(id) && Number.isInteger(Number(id)) ? parseInt(id, 10) : String(id);
    const body = req.body || {};
    const { judul, konten, isPublished } = body;

    const existingPengumuman = await prisma.pengumuman.findUnique({ where: { id: pengumumanId } });
    if (!existingPengumuman) {
      return res.status(404).json({ success: false, message: 'Pengumuman tidak ditemukan.' });
    }

    let slug = existingPengumuman.slug;
    if (judul && judul !== existingPengumuman.judul) {
      let slugBase = createSlug(judul).substring(0, 190);
      slug = slugBase;
      const slugExists = await prisma.pengumuman.findFirst({
        where: { slug, NOT: { id: pengumumanId } }
      });
      if (slugExists) {
        slug = `${slugBase}-${Date.now()}`;
      }
    }

    const updatedPengumuman = await prisma.pengumuman.update({
      where: { id: pengumumanId },
      data: {
        ...(judul && { judul: judul.trim() }),
        ...(slug && { slug }),
        ...(konten && { konten }),
        ...(isPublished !== undefined && { isPublished: isPublished === 'true' || isPublished === true })
      }
    });

    res.json({ success: true, message: 'Pengumuman berhasil diperbarui', data: updatedPengumuman });
  } catch (error) {
    console.error('Error updatePengumuman:', error);
    next(error);
  }
};

// Delete Pengumuman
exports.deletePengumuman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pengumumanId = !isNaN(id) && Number.isInteger(Number(id)) ? parseInt(id, 10) : String(id);

    await prisma.pengumuman.delete({ where: { id: pengumumanId } });
    res.json({ success: true, message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    console.error('Error deletePengumuman:', error);
    next(error);
  }
};
