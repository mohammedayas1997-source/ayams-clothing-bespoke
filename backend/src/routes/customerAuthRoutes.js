const express = require('express');
const router = express.Router();
const customerAuth = require('../controllers/customerAuthController');

// Customer Login / Register: POST /api/shop/auth
router.post('/auth', customerAuth.customerAuth);

// Direct Purchase: POST /api/shop/buy
router.post('/buy', customerAuth.buyReadyToWear);

module.exports = router;