const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./config/env');

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

// Inisialisasi middleware keamanan dan parser HTTP request
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cookieParser());
app.use(cors({
  origin: env.FRONTEND_URL || env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Pengaturan direktori statis dan pembatas laju request API
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);

// Konfigurasi dokumentasi Swagger OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Madrasah MERN API', version: '1.0.0', description: 'Dokumentasi REST API Sistem Informasi Madrasah' }
  },
  apis: ['./routes/*.js']
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// Endpoint utama pemeriksa status server
app.get('/', (req, res) => {
  res.json({ message: 'API Sistem Informasi & Web Profil Madrasah Aktif 🚀' });
});

// Pendaftaran rute API aplikasi
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

// Penanganan rute 404 yang tidak ditemukan kompatibel dengan Express 5
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: `Rute ${req.originalUrl} tidak ditemukan` });
});

// Penanganan eror global aplikasi
app.use(errorHandler);

// Menjalankan server Express pada port terkonfigurasi jika bukan lingkungan pengujian
if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`Server berjalan di port ${env.PORT}`);
  });
}

module.exports = app;
