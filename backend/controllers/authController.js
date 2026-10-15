const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Register User (Calon Pendaftar / Admin / Guru / dll)
exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'CALON_PENDAFTAR', // Menerima role dari request body
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({
      message: 'Registrasi berhasil. Silakan login untuk melanjutkan.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Login User (Semua Peran)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
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
        guruProfile: true,
        siswaProfile: true,
        pendaftaran: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
