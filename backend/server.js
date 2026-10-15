require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import Router
const authRoutes = require('./routes/authRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const ppdbRoutes = require('./routes/ppdbRoutes');
const akademikRoutes = require('./routes/akademikRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');        // Rute Admin PPDB
const adminCmsRoutes = require('./routes/adminCmsRoutes');  // Rute Admin CMS Berita & Pengumuman
const adminProfileRoutes = require('./routes/adminProfileRoutes'); // Rute Profil Admin & Sekolah
const publicCmsRoutes = require('./routes/publicCmsRoutes');
const publicProfileRoutes = require('./routes/publicProfileRoutes'); // Import Router Public Profil

const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Konfigurasi Helmet agar mengizinkan pemuatan file statis/gambar Cross-Origin
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Folder untuk Gambar / File Upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);

// Test Endpoint Root
app.get('/', (req, res) => {
  res.json({ message: 'API Sistem Informasi & Web Profil Madrasah Aktif 🚀' });
});

// ==========================================
// REGISTER RUTE API
// ==========================================

// Rute Autentikasi & Public
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/public/cms', publicCmsRoutes); // Disatukan di kelompok public
app.use('/api/public/profile', publicProfileRoutes); // 🟢 TAMBAHKAN BARIS INI

// Rute User & Fitur Utama
app.use('/api/cms', cmsRoutes);
app.use('/api/ppdb', ppdbRoutes);
app.use('/api/akademik', akademikRoutes);

// Rute Admin (Protected)
app.use('/api/admin', adminRoutes);          // Menangani /api/admin/ppdb
app.use('/api/admin/cms', adminCmsRoutes);    // Menangani /api/admin/cms/berita & /kategori
app.use('/api/admin/profile', adminProfileRoutes); // Menangani /api/admin/profile/me & /school

// Global Error Handler (Harus berada di bawah semua rute API)
app.use(errorHandler);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
