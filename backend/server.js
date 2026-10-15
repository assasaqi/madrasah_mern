// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Pastikan import rute ini mengarah ke file yang benar
const authRoutes = require('./routes/authRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const ppdbRoutes = require('./routes/ppdbRoutes');
const akademikRoutes = require('./routes/akademikRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');


const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.json({ message: 'API Sistem Informasi & Web Profil Madrasah Aktif 🚀' });
});

// Pastikan semua di bawah ini memanggil fungsi router yang valid
app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/ppdb', ppdbRoutes);
app.use('/api/akademik', akademikRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes); // <-- Mount di sini

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
