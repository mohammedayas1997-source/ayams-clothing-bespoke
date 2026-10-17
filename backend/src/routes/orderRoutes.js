const express = require('express');
const router = express.Router();
const orders = require('../controllers/orderController');

router.post('/', orders.createOrder);
router.patch('/:id/status', orders.updateOrderStatus);
router.get('/track/:orderNumber', orders.trackOrder);

module.exports = router;