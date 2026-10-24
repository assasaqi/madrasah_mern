// Middleware untuk validasi request menggunakan skema Zod
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Validasi gagal', details: error.errors });
  }
};

module.exports = validate;
