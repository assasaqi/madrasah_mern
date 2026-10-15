const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Harap unggah Gambar (JPG/PNG) atau PDF.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter,
});

// Middleware Pemroses Gambar & PDF
const processImage = async (req, res, next) => {
  if (!req.file && !req.files) return next();

  try {
    // 1. Penanganan Single File (req.file)
    if (req.file) {
      // 🛑 CEK: Abaikan jika buffer kosong (tidak ada file baru diunggah)
      if (!req.file.buffer || req.file.buffer.length === 0) {
        req.file = undefined;
      } else if (req.file.mimetype === 'application/pdf') {
        const filename = `doc-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
        fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        req.file.filename = filename;
        req.file.fileUrl = `/uploads/${filename}`;
      } else {
        const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        await sharp(req.file.buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(uploadDir, filename));

        req.file.filename = filename;
        req.file.fileUrl = `/uploads/${filename}`;
      }
    }

    // 2. Penanganan Multiple Fields (req.files) - Digunakan di Profil Sekolah
    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        // Filter hanya file yang memiliki isi (buffer.length > 0)
        const validFiles = [];

        for (const file of req.files[fieldName]) {
          // 🛑 CEK: Abaikan jika buffer kosong
          if (!file.buffer || file.buffer.length === 0) continue;

          if (file.mimetype === 'application/pdf') {
            const filename = `${fieldName}-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
            fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
            file.filename = filename;
            file.fileUrl = `/uploads/${filename}`;
            validFiles.push(file);
          } else {
            const filename = `${fieldName}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
            await sharp(file.buffer)
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(path.join(uploadDir, filename));

            file.filename = filename;
            file.fileUrl = `/uploads/${filename}`;
            validFiles.push(file);
          }
        }

        // Update req.files[fieldName] dengan file yang benar-benar diunggah
        if (validFiles.length > 0) {
          req.files[fieldName] = validFiles;
        } else {
          delete req.files[fieldName];
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Helper Menghapus File Fisik
const deleteFile = (filename) => {
  if (!filename) return;
  const cleanFilename = filename.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
  const filePath = path.join(uploadDir, cleanFilename);

  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Gagal menghapus file ${cleanFilename}:`, err.message);
    } else {
      console.log(`File fisik berhasil dihapus: ${cleanFilename}`);
    }
  });
};

module.exports = {
  upload,
  processImage,
  deleteFile,
  single: (fieldname) => [upload.single(fieldname), processImage],
  fields: (fieldsArray) => [upload.fields(fieldsArray), processImage]
};
