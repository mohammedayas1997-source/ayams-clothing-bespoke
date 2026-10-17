const express = require('express');
const router = express.Router();
const staff = require('../controllers/staffController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Kowane ma'aikaci da ya yi login na iya shiga
router.use(verifyToken, authorizeRoles('super_admin', 'manager', 'staff'));

// 1. Duba kayan da suka kammala (Ready for Pickup): GET /api/staff/ready-orders
router.get('/ready-orders', staff.getReadyOrders);

// 2. Damka wa customer kaya bayan duba bashi: PATCH /api/staff/handover/:order_id
router.patch('/handover/:order_id', staff.handoverToCustomer);

// 3. Sake buga rasiti a printer (Reprint): POST /api/staff/reprint/:order_id
router.post('/reprint/:order_id', staff.reprintReceipt);

module.exports = router;