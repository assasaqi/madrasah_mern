const prisma = require('../config/prisma');

// Guru: Input Catatan Hafalan Tahfidz
exports.inputTahfidz = async (req, res, next) => {
  try {
    const { siswaId, surah, ayatMulai, ayatSelesai, predikat, catatan } = req.body;

    // Cari ID Guru berdasarkan user ID login
    const guru = await prisma.guru.findUnique({ where: { userId: req.user.id } });
    if (!guru) return res.status(403).json({ message: 'Profil Guru tidak ditemukan.' });

    const record = await prisma.tahfidz.create({
      data: {
        siswaId,
        surah,
        ayatMulai: parseInt(ayatMulai),
        ayatSelesai: parseInt(ayatSelesai),
        predikat,
        catatan,
        pembimbingId: guru.id,
      },
    });

    res.status(201).json({ message: 'Setoran hafalan berhasil dicatat', data: record });
  } catch (error) {
    next(error);
  }
};

// Siswa/Orang Tua: Lihat Rekap Tahfidz
exports.getRekapTahfidz = async (req, res, next) => {
  try {
    const { siswaId } = req.params;

    const data = await prisma.tahfidz.findMany({
      where: { siswaId },
      include: { pembimbing: { select: { namaLengkap: true } } },
      orderBy: { tanggal: 'desc' },
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};
