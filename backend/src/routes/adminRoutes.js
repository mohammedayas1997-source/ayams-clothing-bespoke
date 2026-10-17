const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Super Admin kadai ke da ikon shiga dukkan wadannan hanyoyi
router.use(verifyToken, authorizeRoles('super_admin'));

// 1. Kirkirar ma'aikaci (Manager ko Staff): POST /api/admin/employees
router.post('/employees', admin.createEmployee);

// 2. Rahoton Kudi da Hadahada (Analytics): GET /api/admin/overview
router.get('/overview', admin.getFinancialOverview);

// 3. Kulle ko bude asusun ma'aikaci: PATCH /api/admin/employees/:id/status
router.patch('/employees/:id/status', admin.toggleUserStatus);

module.exports = router;