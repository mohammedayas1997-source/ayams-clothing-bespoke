const express = require('express');
const router = express.Router();
const payments = require('../controllers/paymentController');

router.post('/record', payments.recordPayment);
router.post('/webhook', payments.handleBankWebhook);

module.exports = router;