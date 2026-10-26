const { z } = require('zod');
const prisma = require('../config/prisma');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Schema validasi pesan kontak via Zod
const contactSchema = z.object({
  nama: z.string().trim().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().trim().toLowerCase().email('Format email tidak valid.'),
  subjek: z.string().trim().optional().default('Pesan dari Form Kontak'),
  pesan: z.string().trim().min(5, 'Pesan minimal 5 karakter.')
});

// Mengambil data ringkasan dan statistik untuk beranda publik
exports.getHomeData = catchAsync(async (req, res, next) => {
  const [latestNews, announcementsRaw, totalSiswa, totalGuru, schoolProfile] = await Promise.all([
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
    prisma.siswa.count(),
    prisma.guru.count(),
    prisma.profilSekolah.findFirst()
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
    programUnggulan: '5+',
    tahunBerdiri: '1998',
    akreditasi: schoolProfile?.akreditasi ? `Akreditasi ${schoolProfile.akreditasi}` : 'A (Unggul)'
  };

  res.status(200).json({
    success: true,
    stats,
    latestNews,
    announcements,
    schoolProfile
  });
});

// Mengambil daftar berita publik dengan filter kategori dan paginasi
exports.getBerita = catchAsync(async (req, res, next) => {
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

  res.status(200).json({
    success: true,
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Mengambil detail artikel berita berdasarkan ID atau Slug
exports.getBeritaDetail = catchAsync(async (req, res, next) => {
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
    return next(new AppError('Artikel berita tidak ditemukan.', 404));
  }

  res.status(200).json({
    success: true,
    data: berita
  });
});

// Mengambil seluruh kategori berita publik
exports.getKategori = catchAsync(async (req, res, next) => {
  const kategori = await prisma.kategoriBerita.findMany({
    orderBy: { nama: 'asc' }
  });

  res.status(200).json({
    success: true,
    data: kategori
  });
});

// Mengambil seluruh daftar pengumuman publik
exports.getPengumuman = catchAsync(async (req, res, next) => {
  const announcements = await prisma.pengumuman.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  const formattedData = announcements.map((item) => ({
    ...item,
    isi: item.konten
  }));

  res.status(200).json({
    success: true,
    data: formattedData
  });
});

// Mengambil detail pengumuman publik berdasarkan ID atau Slug
exports.getPengumumanDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const pengumuman = await prisma.pengumuman.findFirst({
    where: {
      isPublished: true,
      OR: [{ slug: id }, { id: id }]
    }
  });

  if (!pengumuman) {
    return next(new AppError('Pengumuman tidak ditemukan atau belum dipublikasikan.', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      ...pengumuman,
      isi: pengumuman.konten
    }
  });
});

// Mengambil seluruh data galeri publik
exports.getGaleri = catchAsync(async (req, res, next) => {
  const galeri = await prisma.galeri.findMany({
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: galeri
  });
});

// Menyimpan pesan kontak publik ke dalam database
exports.submitKontak = catchAsync(async (req, res, next) => {
  const parseResult = contactSchema.safeParse(req.body);

  if (!parseResult.success) {
    return next(new AppError(parseResult.error.errors[0].message, 400));
  }

  const newMessage = await prisma.pesanKontak.create({
    data: parseResult.data
  });

  res.status(201).json({
    success: true,
    message: 'Pesan Anda berhasil dikirimkan ke pihak madrasah.',
    data: newMessage
  });
});
