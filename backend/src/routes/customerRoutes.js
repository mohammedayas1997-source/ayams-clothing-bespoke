const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Hanyar binciken customer ta suna ko lamba: GET /api/customers/search?q=0803...
router.get('/search', customerController.searchCustomers);

// Hanyar duba cikakken profile na customer: GET /api/customers/:id
router.get('/:id', customerController.getCustomerDetails);

// Hanyar shigar da sabon customer: POST /api/customers
router.post('/', customerController.createCustomer);

module.exports = router;