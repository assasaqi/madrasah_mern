const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const env = require('./config/env');

// Import Router
const authRoutes = require('./routes/authRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const ppdbRoutes = require('./routes/ppdbRoutes');
const akademikRoutes = require('./routes/akademikRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminCmsRoutes = require('./routes/adminCmsRoutes');
const adminProfileRoutes = require('./routes/adminProfileRoutes');
const publicCmsRoutes = require('./routes/publicCmsRoutes');
const publicProfileRoutes = require('./routes/publicProfileRoutes');

const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Konfigurasi Keamanan & Middleware Parser
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cookieParser());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Folder & Rate Limiter
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);

// Endpoint Root
app.get('/', (req, res) => {
  res.json({ message: 'API Sistem Informasi & Web Profil Madrasah Aktif 🚀' });
});

// Register Rute API
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/public/cms', publicCmsRoutes);
app.use('/api/public/profile', publicProfileRoutes);

app.use('/api/cms', cmsRoutes);
app.use('/api/ppdb', ppdbRoutes);
app.use('/api/akademik', akademikRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/admin/cms', adminCmsRoutes);
app.use('/api/admin/profile', adminProfileRoutes);

// Global Error Handler
app.use(errorHandler);

// Jalankan Server
app.listen(env.PORT, () => {
  console.log(`Server berjalan di port ${env.PORT}`);
});
