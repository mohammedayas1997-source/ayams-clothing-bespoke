const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Customer Quick Login / Register ta Suna da Lambar Waya
exports.customerAuth = async (req, res) => {
  try {
    const { full_name, phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ success: false, message: 'Shigar da lambar waya.' });
    }

    const cleanPhone = phone_number.trim();

    // Nemo ko customer yana nan a database
    let customerResult = await db.query('SELECT * FROM customers WHERE phone_number = $1', [cleanPhone]);
    let customer;

    if (customerResult.rows.length === 0) {
      // Idan sabo ne, dole ya saka cikakken suna
      if (!full_name) {
        return res.status(400).json({ success: false, message: 'Sabon customer dole ya shigar da cikakken suna.' });
      }

      // Yi masa rijista nan take
      const insertResult = await db.query(
        'INSERT INTO customers (full_name, phone_number) VALUES ($1, $2) RETURNING *',
        [full_name.trim(), cleanPhone]
      );
      customer = insertResult.rows[0];
    } else {
      customer = customerResult.rows[0];
    }

    // Samar da Customer JWT Token
    const token = jwt.sign(
      { id: customer.id, phone_number: customer.phone_number, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: `Barka da zuwa, ${customer.full_name}!`,
      token,
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        phone_number: customer.phone_number,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure a rajista/login', error: error.message });
  }
};

// 2. Sayen Kaya Kai Tsaye (Ready-to-Wear Direct Purchase)
exports.buyReadyToWear = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { customer_id, style_id, amount, delivery_address } = req.body;

    await client.query('BEGIN');

    // 1. Samar da Order ta musamman (e.g. AYM-RTW-4821)
    const orderNumber = `RTW-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderQuery = `
      INSERT INTO orders (order_number, customer_id, style_id, order_type, gender, status, delivery_date, tailor_notes)
      VALUES ($1, $2, $3, 'Ready-to-Wear', 'Unisex', 'Pending', CURRENT_DATE, $4)
      RETURNING *;
    `;
    const orderRes = await client.query(orderQuery, [
      orderNumber,
      customer_id,
      style_id,
      delivery_address ? `Direct Purchase Delivery: ${delivery_address}` : 'Store Pickup',
    ]);
    const newOrder = orderRes.rows[0];

    // 2. Samar da Payment Record (Jiran Biyan Kudi)
    const receiptNumber = `RCT-RTW-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentQuery = `
      INSERT INTO payments (order_id, receipt_number, total_amount, amount_paid, balance_due, payment_method, payment_status)
      VALUES ($1, $2, $3, 0, $3, 'Bank_Transfer', 'Pending')
      RETURNING *;
    `;
    const paymentRes = await client.query(paymentQuery, [newOrder.id, receiptNumber, amount]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'An bude odar kaya cikin nasara! Mataki na gaba: Biyan kudi.',
      order: newOrder,
      payment: paymentRes.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Kuskure wajen bude oda', error: error.message });
  } finally {
    client.release();
  }
};