const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Kowa na iya zuwa login
router.post('/login', authController.login);

// Super Admin kadai zai iya kirkirar sabon ma'aikaci
router.post('/staff', verifyToken, authorizeRoles('super_admin'), authController.createStaff);

// Super Admin da Manager na iya ganin jerin ma'aikatan shagon
router.get('/staff', verifyToken, authorizeRoles('super_admin', 'manager'), authController.getAllStaff);

module.exports = router;