const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Tabbatar da cewa mutum ya yi login
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Ba a ba ka izini ba. Da fatan ka yi login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Takardar izini ba ta aiki ko ta mutu.' });
  }
};

// 2. Tabbatar da Matsayi (Role Check)
// Misali: authorizeRoles('super_admin', 'manager')
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Ba ka da ikon yin wannan aikin. Sai Super Admin ko Manager.',
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
};