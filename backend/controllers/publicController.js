const prisma = require('../config/prisma');

// Get Data Ringkasan untuk Beranda Publik
exports.getHomeData = async (req, res, next) => {
  try {
    // Ambil 3 berita publik terbaru (Gunakan isPublished)
    const latestNews = await prisma.berita.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        kategori: {
          select: { id: true, nama: true },
        },
      },
    });

    // Ambil 3 pengumuman terbaru (Gunakan isPublished)
    const announcementsRaw = await prisma.pengumuman.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        judul: true,
        createdAt: true,
      },
    });

    // Hitung statistik dinamis
    const totalSiswa = await prisma.siswa.count();
    const totalGuru = await prisma.guru.count();

    const announcements = announcementsRaw.map((item) => ({
      id: item.id,
      title: item.judul,
      date: new Date(item.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }));

    const stats = [
      { id: 1, label: 'Siswa Aktif', value: `${totalSiswa}+` },
      { id: 2, label: 'Guru & Staf', value: `${totalGuru}` },
      { id: 3, label: 'Program Unggulan', value: '12' },
      { id: 4, label: 'Tahun Berdiri', value: '1998' },
    ];

    res.json({
      latestNews,
      announcements,
      stats,
    });
  } catch (error) {
    console.error('Error getHomeData:', error);
    next(error);
  }
};

// Get Daftar Berita Publik dengan Filter Kategori & Paginasi
exports.getBerita = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, kategoriId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      isPublished: true,
      ...(kategoriId ? { kategoriId: String(kategoriId) } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.berita.findMany({
        where,
        take: Number(limit),
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          kategori: {
            select: { id: true, nama: true },
          },
        },
      }),
      prisma.berita.count({ where }),
    ]);

    res.json({
      data: items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error getBerita:', error);
    next(error);
  }
};

// Get Detail Artikel Berita
exports.getBeritaDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const berita = await prisma.berita.findFirst({
      where: { id, isPublished: true },
      include: {
        kategori: {
          select: { id: true, nama: true },
        },
      },
    });

    if (!berita) {
      return res.status(404).json({ message: 'Artikel berita tidak ditemukan.' });
    }

    res.json(berita);
  } catch (error) {
    console.error('Error getBeritaDetail:', error);
    next(error);
  }
};

// Get Seluruh Pengumuman Publik
exports.getPengumuman = async (req, res, next) => {
  try {
    const announcements = await prisma.pengumuman.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error getPengumuman:', error);
    next(error);
  }
};
