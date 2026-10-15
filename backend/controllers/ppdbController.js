const prisma = require('../config/prisma');

// 1. Get Status & Ringkasan Pendaftaran PPDB User
exports.getStatusPendaftaran = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Sesi pengguna tidak valid. Silakan login kembali.' });
    }

    const pendaftaran = await prisma.pendaftaranPPDB.findUnique({
      where: { userId },
      include: {
        biodata: true,
        orangTua: true,
        dokumen: true,
      },
    });

    if (!pendaftaran) {
      return res.status(200).json({ status: 'BELUM_ISI' });
    }

    res.status(200).json(pendaftaran);
  } catch (error) {
    console.error('Error getStatusPendaftaran:', error);
    next(error);
  }
};

// 2. Submit Data Biodata Pendaftaran PPDB
exports.submitPendaftaran = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Sesi pengguna tidak valid. Silakan login kembali.' });
    }

    const {
      namaLengkap,
      nik,
      nisn,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      sekolahAsal,
      alamat,
      namaAyah,
      pekerjaanAyah,
      namaIbu,
      pekerjaanIbu,
      noWhatsapp,
    } = req.body;

    const parsedDate = tanggalLahir ? new Date(tanggalLahir) : null;
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Format tanggal lahir tidak valid.' });
    }

    // Nomor pendaftaran unik untuk data baru
    const nomorPendaftaran = `PPDB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pendaftaran = await prisma.pendaftaranPPDB.upsert({
      where: { userId },
      update: {
        status: 'DITINJAU',
        biodata: {
          upsert: {
            create: {
              namaLengkap,
              nik: nik || null,
              nisn: nisn || null,
              tempatLahir,
              tanggalLahir: parsedDate,
              jenisKelamin,
              asalSekolah: sekolahAsal,
              alamat,
            },
            update: {
              namaLengkap,
              nik: nik || null,
              nisn: nisn || null,
              tempatLahir,
              tanggalLahir: parsedDate,
              jenisKelamin,
              asalSekolah: sekolahAsal,
              alamat,
            },
          },
        },
        orangTua: {
          upsert: {
            create: {
              namaAyah,
              pekerjaanAyah: pekerjaanAyah || null,
              noHpAyah: noWhatsapp,
              namaIbu,
              pekerjaanIbu: pekerjaanIbu || null,
              noHpIbu: noWhatsapp,
              alamatOrangTua: alamat,
            },
            update: {
              namaAyah,
              pekerjaanAyah: pekerjaanAyah || null,
              noHpAyah: noWhatsapp,
              namaIbu,
              pekerjaanIbu: pekerjaanIbu || null,
              noHpIbu: noWhatsapp,
              alamatOrangTua: alamat,
            },
          },
        },
      },
      create: {
        userId,
        nomorPendaftaran,
        status: 'DITINJAU',
        biodata: {
          create: {
            namaLengkap,
            nik: nik || null,
            nisn: nisn || null,
            tempatLahir,
            tanggalLahir: parsedDate,
            jenisKelamin,
            asalSekolah: sekolahAsal,
            alamat,
          },
        },
        orangTua: {
          create: {
            namaAyah,
            pekerjaanAyah: pekerjaanAyah || null,
            noHpAyah: noWhatsapp,
            namaIbu,
            pekerjaanIbu: pekerjaanIbu || null,
            noHpIbu: noWhatsapp,
            alamatOrangTua: alamat,
          },
        },
      },
      include: {
        biodata: true,
        orangTua: true,
      },
    });

    res.status(200).json({
      message: 'Data pendaftaran berhasil disimpan.',
      data: pendaftaran,
    });
  } catch (error) {
    console.error('Error submitPendaftaran:', error);
    next(error);
  }
};

// 3. Upload Dokumen Persyaratan
exports.uploadDokumen = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { jenisDokumen } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!filePath) {
      return res.status(400).json({ message: 'Tidak ada berkas yang diunggah.' });
    }

    const pendaftaran = await prisma.pendaftaranPPDB.findUnique({
      where: { userId },
    });

    if (!pendaftaran) {
      return res.status(400).json({ message: 'Data pendaftaran tidak ditemukan. Isi biodata terlebih dahulu.' });
    }

    // Mapping jenis dokumen string dari frontend ke Enum Prisma
    const enumMap = {
      fileKK: 'KARTU_KELUARGA',
      fileAkta: 'AKTA_KELAHIRAN',
      fileFoto: 'PAS_FOTO',
    };
    const targetEnum = enumMap[jenisDokumen] || jenisDokumen;

    const dokumen = await prisma.dokumenPPDB.upsert({
      where: {
        pendaftaranId_jenisDokumen: {
          pendaftaranId: pendaftaran.id,
          jenisDokumen: targetEnum,
        },
      },
      update: {
        fileUrl: filePath,
      },
      create: {
        pendaftaranId: pendaftaran.id,
        jenisDokumen: targetEnum,
        fileUrl: filePath,
      },
    });

    res.status(200).json({
      message: 'Dokumen berhasil diunggah.',
      data: dokumen,
    });
  } catch (error) {
    console.error('Error uploadDokumen:', error);
    next(error);
  }
};

// 4. Update Status PPDB (Khusus Admin)
exports.updateStatusPPDB = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pendaftaran = await prisma.pendaftaranPPDB.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      message: `Status pendaftaran berhasil diperbarui menjadi ${status}.`,
      data: pendaftaran,
    });
  } catch (error) {
    console.error('Error updateStatusPPDB:', error);
    next(error);
  }
};
