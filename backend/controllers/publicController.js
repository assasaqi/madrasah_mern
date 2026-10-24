const { z } = require('zod');
const prisma = require('../config/prisma');

// Schema validasi pesan kontak via Zod
const contactSchema = z.object({
  nama: z.string().trim().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().trim().toLowerCase().email('Format email tidak valid.'),
  subjek: z.string().trim().optional().default('Pesan dari Form Kontak'),
  pesan: z.string().trim().min(5, 'Pesan minimal 5 karakter.')
});

// Get Data Ringkasan untuk Beranda Publik
exports.getHomeData = async (req, res, next) => {
  try {
    const [latestNews, announcementsRaw, totalSiswa, totalGuru, schoolProfile, totalProgram] = await Promise.all([
      prisma.berita.findMany({
        where: { isPublished: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          kategori: { select: { id: true, nama: true, slug: true } }
        }
      }),
      prisma.pengumuman.findMany({
        where: { isPublished: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          judul: true,
          slug: true,
          konten: true,
          fileUrl: true,
          createdAt: true
        }
      }),
      prisma.siswa.count({ where: { status: 'AKTIF' } }),
      prisma.guru.count({ where: { status: 'AKTIF' } }),
      prisma.profilSekolah.findFirst(),
      prisma.programUnggulan.count({ where: { aktif: true } })
    ]);

    const announcements = announcementsRaw.map((item) => ({
      ...item,
      title: item.judul,
      isi: item.konten,
      date: new Date(item.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

    const stats = {
      siswaAktif: `${totalSiswa}+`,
      guruStaf: `${totalGuru}`,
      programUnggulan: `${totalProgram}`,
      tahunBerdiri: schoolProfile?.tahunBerdiri ? String(schoolProfile.tahunBerdiri) : '1998',
      akreditasi: schoolProfile?.akreditasi ? `Akreditasi ${schoolProfile.akreditasi}` : 'A (Unggul)'
    };

    return res.json({
      success: true,
      stats,
      latestNews,
      announcements,
      schoolProfile
    });
  } catch (error) {
    next(error);
  }
};

// Get Daftar Berita Publik dengan Filter Kategori & Paginasi
exports.getBerita = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const { kategoriId, kategori } = req.query;

    const where = { isPublished: true };

    if (kategoriId && kategoriId !== 'Semua') {
      where.kategoriId = String(kategoriId);
    } else if (kategori && kategori !== 'Semua') {
      where.kategori = {
        OR: [
          { id: String(kategori) },
          { nama: String(kategori) },
          { slug: String(kategori) }
        ]
      };
    }

    const [items, total] = await Promise.all([
      prisma.berita.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          kategori: { select: { id: true, nama: true, slug: true } }
        }
      }),
      prisma.berita.count({ where })
    ]);

    return res.json({
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Detail Artikel Berita (Mendukung ID atau SLUG)
exports.getBeritaDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const berita = await prisma.berita.findFirst({
      where: {
        isPublished: true,
        OR: [{ slug: id }, { id: id }]
      },
      include: {
        kategori: { select: { id: true, nama: true, slug: true } },
        author: { select: { id: true, email: true } }
      }
    });

    if (!berita) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      data: berita
    });
  } catch (error) {
    next(error);
  }
};

// Get Seluruh Kategori Berita Publik
exports.getKategori = async (req, res, next) => {
  try {
    const kategori = await prisma.kategoriBerita.findMany({
      orderBy: { nama: 'asc' }
    });

    return res.json({
      success: true,
      data: kategori
    });
  } catch (error) {
    next(error);
  }
};

// Get Seluruh Pengumuman Publik
exports.getPengumuman = async (req, res, next) => {
  try {
    const announcements = await prisma.pengumuman.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });

    const formattedData = announcements.map((item) => ({
      ...item,
      isi: item.konten || item.isi
    }));

    return res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
};

// Get Detail Pengumuman Publik by Slug / ID
exports.getPengumumanDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pengumuman = await prisma.pengumuman.findFirst({
      where: {
        isPublished: true,
        OR: [{ slug: id }, { id: id }]
      }
    });

    if (!pengumuman) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan atau belum dipublikasikan.'
      });
    }

    return res.json({
      success: true,
      data: {
        ...pengumuman,
        isi: pengumuman.konten || pengumuman.isi
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Seluruh Galeri Publik
exports.getGaleri = async (req, res, next) => {
  try {
    const galeri = await prisma.galeri.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: galeri
    });
  } catch (error) {
    next(error);
  }
};

// Kirim Pesan Kontak Publik
exports.submitKontak = async (req, res, next) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    const newMessage = await prisma.pesanKontak.create({
      data: validatedData
    });

    return res.status(201).json({
      success: true,
      message: 'Pesan Anda berhasil dikirimkan ke pihak madrasah.',
      data: newMessage
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }
    next(error);
  }
};
