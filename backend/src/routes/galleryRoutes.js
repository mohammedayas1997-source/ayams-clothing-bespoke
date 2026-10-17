const express = require('express');
const router = express.Router();
const gallery = require('../controllers/galleryController');

const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/', gallery.getAllStyles);
router.post('/', gallery.addStyle);
router.put('/:id', gallery.updateStyle);
router.delete('/:id', gallery.deleteStyle);

// Sai Super Admin ko Manager ne za su iya dorawa, gyarawa, ko gogewa:
router.post('/', verifyToken, authorizeRoles('super_admin', 'manager'), gallery.addStyle);
router.put('/:id', verifyToken, authorizeRoles('super_admin', 'manager'), gallery.updateStyle);
router.delete('/:id', verifyToken, authorizeRoles('super_admin', 'manager'), gallery.deleteStyle);

module.exports = router;