const express = require('express');
const router = express.Router();
const manager = require('../controllers/managerController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Super Admin da Manager na iya amfani da wannan bangaren
router.use(verifyToken, authorizeRoles('super_admin', 'manager'));

// 1. Duba tsarin ayyukan shago (Active Workflow): GET /api/manager/workflow
router.get('/workflow', manager.getShopWorkflow);

// 2. Canza ranar karbar dinki (Reschedule): PATCH /api/manager/orders/:order_id/reschedule
router.patch('/orders/:order_id/reschedule', manager.rescheduleOrder);

// 3. Jerin ma'aikatan shago (Staff list): GET /api/manager/staff
router.get('/staff', manager.getStoreStaff);

module.exports = router;