// Middleware domin tare duk wani kuskure da ya faru a sabar ba tare da ta mutu ba
const errorHandler = (err, req, res, next) => {
  console.error('❌ Kuskure ya faru:', err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Wata matsala ta faru a cikin uwar garken (Server Error)',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;