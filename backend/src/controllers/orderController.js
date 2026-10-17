const db = require('../config/db');

// Kirkirar sabuwar Odar Dinki
exports.createOrder = async (req, res) => {
  try {
    const { customer_id, style_id, order_type, gender, delivery_date, tailor_notes } = req.body;

    if (!customer_id || !order_type || !gender || !delivery_date) {
      return res.status(400).json({ success: false, message: 'Bayanan da aka turo basu cika ba.' });
    }

    // Samar da lambar oda ta musamman (e.g., AYM-7492)
    const orderNumber = `AYM-${Math.floor(1000 + Math.random() * 9000)}`;

    const queryText = `
      INSERT INTO orders (order_number, customer_id, style_id, order_type, gender, delivery_date, tailor_notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [orderNumber, customer_id, style_id || null, order_type, gender, delivery_date, tailor_notes || ''];

    const result = await db.query(queryText, values);
    res.status(201).json({ success: true, message: 'An bude sabuwar oda!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen bude oda', error: error.message });
  }
};

// Sauya matsayin dinki (Update Status misali daga Cutting zuwa Ready)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Pending', 'Cutting', 'Sewing', 'Finishing', 'Ready', 'Delivered'

    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ba a sami wannan odar ba.' });
    }

    res.status(200).json({ success: true, message: 'An sabunta matsayin dinki!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen sabuntawa', error: error.message });
  }
};

// Bibiyar dinki ta QR Code ko Order Number (Live Tracking)
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const result = await db.query(
      `SELECT o.order_number, o.status, o.delivery_date, o.order_type, c.full_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.order_number = $1`,
      [orderNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lambar odar ba daidai ba ce.' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen tracking', error: error.message });
  }
};