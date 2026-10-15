const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Memastikan direktori penyimpanan unggahan berkas PPDB tersedia
const uploadDir = path.join(__dirname, '../../uploads/ppdb');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.'), false);
  }
};

const ppdbUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file 2MB
  fileFilter,
}).fields([
  { name: 'fileKK', maxCount: 1 },
  { name: 'fileAkta', maxCount: 1 },
  { name: 'fileFoto', maxCount: 1 },
]);

module.exports = ppdbUpload;
