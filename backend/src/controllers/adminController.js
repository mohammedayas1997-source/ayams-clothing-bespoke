const bcrypt = require('bcryptjs');
const db = require('../config/db');

// 1. Kirkirar sabon ma'aikaci (Manager ko Staff)
exports.createEmployee = async (req, res) => {
  try {
    const { full_name, username, password, role } = req.body;

    if (!full_name || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Dole ne a shigar da dukkan bayanai.' });
    }

    const validRoles = ['super_admin', 'manager', 'staff'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Wannan matsayin (role) ba a sani ba.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const queryText = `
      INSERT INTO users (full_name, username, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, username, role, created_at;
    `;
    const result = await db.query(queryText, [full_name.trim(), username.trim().toLowerCase(), password_hash, role]);

    res.status(201).json({
      success: true,
      message: `An yi nasarar kirkirar ${role}!`,
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Wannan sunan maaikacin (username) yana nan a tsarin.' });
    }
    res.status(500).json({ success: false, message: 'Kuskure wajen kirkirar maaikaci', error: error.message });
  }
};

// 2. Rahoton Kudi da Hadahadar Kasuwanci (Admin Analytics)
exports.getFinancialOverview = async (req, res) => {
  try {
    const revenueQuery = `
      SELECT 
        COALESCE(SUM(total_amount), 0) AS total_revenue_expected,
        COALESCE(SUM(amount_paid), 0) AS total_cash_received,
        COALESCE(SUM(balance_due), 0) AS total_unpaid_debt
      FROM payments;
    `;
    const ordersCountQuery = `SELECT COUNT(*) AS total_orders FROM orders;`;
    const customerCountQuery = `SELECT COUNT(*) AS total_customers FROM customers;`;

    const [revenueRes, ordersRes, customersRes] = await Promise.all([
      db.query(revenueQuery),
      db.query(ordersCountQuery),
      db.query(customerCountQuery),
    ]);

    res.status(200).json({
      success: true,
      data: {
        financials: revenueRes.rows[0],
        total_orders: ordersRes.rows[0].total_orders,
        total_customers: customersRes.rows[0].total_customers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen daukowa', error: error.message });
  }
};

// 3. Kulle ko Bude Asunsu na Ma'aikaci (Deactivate/Activate)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body; // true ko false

    const result = await db.query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, full_name, username, is_active',
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ba a sami wannan maaikacin ba.' });
    }

    res.status(200).json({
      success: true,
      message: `An canza matsayin maaikaci zuwa: ${is_active ? 'Yana aiki' : 'An dakatar'}`,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};