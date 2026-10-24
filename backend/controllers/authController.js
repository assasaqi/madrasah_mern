const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma'); // Menggunakan instance Prisma terpusat
const env = require('../config/env'); // Wajib diimpor untuk JWT_SECRET & NODE_ENV

// Register User (Calon Pendaftar / Admin / Guru / dll)
exports.register = async (req, res, next) => {
  try {
    const { email, password, role, nama } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'CALON_PENDAFTAR',
      },
      select: { id: true, email: true, role: true, foto: true, createdAt: true },
    });

    const displayName = nama ? nama.trim() : cleanEmail.split('@')[0];

    res.status(201).json({
      message: 'Registrasi berhasil. Silakan login untuk melanjutkan.',
      user: {
        ...user,
        nama: displayName
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User dengan Implementasi HTTP-Only Cookie
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        guruProfile: { select: { namaLengkap: true } },
        siswaProfile: { select: { namaLengkap: true } },
        pendaftaran: {
          include: { biodata: { select: { namaLengkap: true } } }
        }
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 Menit
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Hari
    });

    const displayName =
      user.guruProfile?.namaLengkap ||
      user.siswaProfile?.namaLengkap ||
      user.pendaftaran?.biodata?.namaLengkap ||
      cleanEmail.split('@')[0];

    res.status(200).json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        foto: user.foto,
        nama: displayName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ambil Profil User Login Saat Ini
exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        foto: true,
        guruProfile: true,
        siswaProfile: true,
        pendaftaran: {
          include: {
            biodata: true,
            orangTua: true,
            dokumen: true
          }
        },
      },
    });

    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

    const displayName =
      user.guruProfile?.namaLengkap ||
      user.siswaProfile?.namaLengkap ||
      user.pendaftaran?.biodata?.namaLengkap ||
      user.email.split('@')[0];

    res.json({
      user: {
        ...user,
        nama: displayName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout User & Bersihkan Cookie
exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout berhasil.' });
};
