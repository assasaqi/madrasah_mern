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

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  if (req.file.mimetype === 'application/pdf') {
    const filename = `doc-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    const outputPath = path.join(uploadDir, filename);
    fs.writeFileSync(outputPath, req.file.buffer);
    req.file.filename = filename;
    req.file.fileUrl = `/uploads/${filename}`;
    return next();
  }

  try {
    const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.fileUrl = `/uploads/${filename}`;
    next();
  } catch (error) {
    next(error);
  }
};

// 🟢 HELPER: Menghapus File Fisik di Folder Uploads
const deleteFile = (filename) => {
  if (!filename) return;
  // Bersihkan path jika ada prefix /uploads/
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

module.exports = { upload, processImage, deleteFile };
