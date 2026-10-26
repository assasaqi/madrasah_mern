// Membungkus fungsi asinkron rute untuk menangkap error secara otomatis
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
