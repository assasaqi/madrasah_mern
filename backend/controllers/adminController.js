const prisma = require('../config/prisma');

// 1. Mengambil seluruh data pendaftar untuk Dashboard Admin
const getAllPendaftar = async (req, res) => {
  try {
    const pendaftarList = await prisma.pendaftaranPPDB.findMany({
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
        biodata: true,
        orangTua: true,
        dokumen: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(pendaftarList);
  } catch (error) {
    console.error('Gagal mengambil data pendaftar admin:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// 2. Memperbarui status verifikasi/seleksi pendaftar
const updateStatusPendaftaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Enum: 'DITINJAU', 'LULUS_ADMINISTRASI', 'TIDAK_LULUS', 'LULUS_FINAL'

    const updatedPendaftaran = await prisma.pendaftaranPPDB.update({
      where: { id: String(id) }, // id berupa String UUID
      data: { status },
    });

    return res.status(200).json({
      message: 'Status pendaftaran berhasil diperbarui.',
      data: updatedPendaftaran,
    });
  } catch (error) {
    console.error('Gagal memperbarui status pendaftaran:', error);
    return res.status(500).json({ message: 'Gagal memperbarui status pendaftaran.' });
  }
};

module.exports = {
  getAllPendaftar,
  updateStatusPendaftaran,
};
