const jwt = require('jsonwebtoken');

// Verifikasi JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Sesi Anda telah berakhir. Silakan login kembali.'
      });
    }
    return res.status(401).json({
      message: 'Token tidak valid.'
    });
  }
};

// Verifikasi Role (RBAC Tahan Case-Sensitive)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = String(req.user?.role || '').trim().toUpperCase();
    const uppercaseAllowed = allowedRoles.map((r) => String(r).trim().toUpperCase());

    if (!req.user || !uppercaseAllowed.includes(userRole)) {
      return res.status(403).json({
        message: 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.'
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
