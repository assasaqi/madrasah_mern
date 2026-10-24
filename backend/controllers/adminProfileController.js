const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

// ==========================================
// 1. PROFIL AKUN ADMIN (USER)
// ==========================================

// Get Profil Admin Saat Ini
exports.getAdminProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        foto: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error getAdminProfile:', error);
    next(error);
  }
};

// Update Informasi Profil (Email & Foto)
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    }

    const body = req.body || {};
    const { email } = body;

    const updateData = {};

    if (email) updateData.email = email.trim();

    // Jika mengunggah foto baru via Sharp/Multer (WebP format)
    if (req.file) {
      updateData.foto = req.file.filename;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        foto: true
      }
    });

    res.json({ success: true, message: 'Profil berhasil diperbarui', data: updatedUser });
  } catch (error) {
    console.error('Error updateAdminProfile:', error);
    next(error);
  }
};

// Ubah Password Admin
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    }

    const { passwordLama, passwordBaru } = req.body || {};

    if (!passwordLama || !passwordBaru) {
      return res.status(400).json({ success: false, message: 'Password saat ini dan password baru wajib diisi.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordBaru, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (error) {
    console.error('Error changePassword:', error);
    next(error);
  }
};

// ==========================================
// 2. PROFIL SEKOLAH / PUBLIK
// ==========================================

// Get Profil Sekolah
exports.getSchoolProfile = async (req, res, next) => {
  try {
    let profil = await prisma.profilSekolah.findFirst();
    if (!profil) {
      profil = await prisma.profilSekolah.create({
        data: {
          namaSekolah: 'MA Negeri 1',
          npsn: '12345678',
          akreditasi: 'A'
        }
      });
    }
    res.json({ success: true, data: profil });
  } catch (error) {
    console.error('Error getSchoolProfile:', error);
    next(error);
  }
};

// Update Profil Sekolah
exports.updateSchoolProfile = async (req, res, next) => {
  try {
    const existing = await prisma.profilSekolah.findFirst();
    const body = req.body || {};
    const {
      namaSekolah,
      npsn,
      akreditasi,
      tagline,
      deskripsi,
      alamat,
      email,
      telepon,
      whatsapp,
      mapsUrl,
      visi,
      misi
    } = body;

    const dataPayload = {
      ...(namaSekolah && { namaSekolah: namaSekolah.trim() }),
      ...(npsn && { npsn: npsn.trim() }),
      ...(akreditasi && { akreditasi }),
      ...(tagline !== undefined && { tagline }),
      ...(deskripsi !== undefined && { deskripsi }),
      ...(alamat !== undefined && { alamat }),
      ...(email !== undefined && { email }),
      ...(telepon !== undefined && { telepon }),
      ...(whatsapp !== undefined && { whatsapp }),
      ...(mapsUrl !== undefined && { mapsUrl }),
      ...(visi !== undefined && { visi }),
      ...(misi !== undefined && {
        misi: (() => {
          if (Array.isArray(misi)) return misi;
          if (typeof misi === 'string') {
            try { return JSON.parse(misi); } catch (e) { return [misi]; }
          }
          return misi;
        })()
      })
    };

    if (req.files?.logo) {
      dataPayload.logo = req.files.logo[0].filename;
    }
    if (req.files?.banner) {
      dataPayload.banner = req.files.banner[0].filename;
    }

    const result = existing
      ? await prisma.profilSekolah.update({ where: { id: existing.id }, data: dataPayload })
      : await prisma.profilSekolah.create({ data: dataPayload });

    res.json({ success: true, message: 'Profil sekolah berhasil diperbarui', data: result });
  } catch (error) {
    console.error('Error updateSchoolProfile:', error);
    next(error);
  }
};
