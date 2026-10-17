const db = require('../config/db');

// 1. Duba ayyukan dinki da suka shigo da kuma inda aka kwana (Shop Workflow)
exports.getShopWorkflow = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.id, o.order_number, o.order_type, o.status, o.delivery_date, o.tailor_notes,
        c.full_name AS customer_name, c.phone_number
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.status != 'Delivered'
      ORDER BY o.delivery_date ASC;
    `);

    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure', error: error.message });
  }
};

// 2. Canza ranar karbar kaya (Extend ko Reschedule Delivery Date)
exports.rescheduleOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { new_delivery_date, reason } = req.body;

    const result = await db.query(
      `UPDATE orders 
       SET delivery_date = $1, tailor_notes = CONCAT(tailor_notes, ' | An daga rana: ', $2::text)
       WHERE id = $3 RETURNING *`,
      [new_delivery_date, reason || 'Babu dalili', order_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ba a sami odar ba.' });
    }

    res.status(200).json({ success: true, message: 'An canza ranar karba lafiya!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Duba ma'aikata masu aiki a shagon
exports.getStoreStaff = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, full_name, username, role, is_active, created_at 
       FROM users 
       WHERE role = 'staff'
       ORDER BY full_name ASC;`
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};