const db = require('../config/db');

// 1. Instant Search ta Suna ko Lambar Waya
exports.searchCustomers = async (req, res) => {
  try {
    const { q } = req.query; // Misali: /api/customers/search?q=0803 ko ?q=Aminu
    if (!q || q.trim() === '') {
      return res.status(200).json({ success: true, data: [] });
    }

    const searchQuery = `%${q.trim()}%`;
    const result = await db.query(
      `SELECT id, full_name, phone_number, notes, created_at 
       FROM customers 
       WHERE phone_number ILIKE $1 OR full_name ILIKE $1 
       ORDER BY updated_at DESC 
       LIMIT 10`,
      [searchQuery]
    );

    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen binciken customer', error: error.message });
  }
};

// 2. Samo cikakken bayanin customer (Profile + Measurements + Order History)
exports.getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // A. Bayanin Customer
    const customerResult = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ba a sami wannan customer din ba.' });
    }
    const customer = customerResult.rows[0];

    // B. Ma'aunin Maza da na Mata
    const maleMeas = await db.query('SELECT * FROM male_measurements WHERE customer_id = $1', [id]);
    const femaleMeas = await db.query('SELECT * FROM female_measurements WHERE customer_id = $1', [id]);

    // C. Tarihin Dinki da Biyan Kudi
    const ordersResult = await db.query(
      `SELECT o.id, o.order_number, o.order_type, o.status, o.delivery_date, o.created_at,
              p.total_amount, p.amount_paid, p.balance_due, p.payment_status
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        profile: customer,
        measurements: {
          male: maleMeas.rows[0] || null,
          female: femaleMeas.rows[0] || null,
        },
        orders: ordersResult.rows,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen daukowa', error: error.message });
  }
};

// 3. Kirkirar Sabon Customer tare da Ma'auni
exports.createCustomer = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { full_name, phone_number, notes, gender, measurements } = req.body;

    if (!full_name || !phone_number) {
      return res.status(400).json({ success: false, message: 'Dole ne a saka Suna da Lambar Waya.' });
    }

    // Fara Database Transaction
    await client.query('BEGIN');

    // Ajiye customer
    const insertCustomerQuery = `
      INSERT INTO customers (full_name, phone_number, notes)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const customerResult = await client.query(insertCustomerQuery, [full_name.trim(), phone_number.trim(), notes || '']);
    const newCustomer = customerResult.rows[0];

    // Ajiye ma'auni idan an shigar
    if (gender === 'Male' && measurements) {
      const maleQuery = `
        INSERT INTO male_measurements (
          customer_id, neck_circumference, chest, shoulder, sleeve_length, 
          bicep, wrist, shirt_length, waist, trouser_length, thigh, knee, ankle
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
      `;
      const m = measurements;
      await client.query(maleQuery, [
        newCustomer.id, m.neck, m.chest, m.shoulder, m.sleeve,
        m.bicep, m.wrist, m.shirt_length, m.waist, m.trouser_length, m.thigh, m.knee, m.ankle
      ]);
    } else if (gender === 'Female' && measurements) {
      const femaleQuery = `
        INSERT INTO female_measurements (
          customer_id, bust, under_bust, waist, hip, shoulder, 
          sleeve_length, arm_hole, gown_length, skirt_length, blouse_length, breast_point, shoulder_to_underbust
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
      `;
      const f = measurements;
      await client.query(femaleQuery, [
        newCustomer.id, f.bust, f.under_bust, f.waist, f.hip, f.shoulder,
        f.sleeve, f.arm_hole, f.gown_length, f.skirt_length, f.blouse_length, f.breast_point, f.shoulder_to_underbust
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'An yi nasarar ajiye bayanan customer!', data: newCustomer });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') { // Duplicate phone number
      return res.status(409).json({ success: false, message: 'Wannan lambar wayar ta riga ta kasance a tsarin.' });
    }
    res.status(500).json({ success: false, message: 'Kuskure wajen ajiye customer', error: error.message });
  } finally {
    client.release();
  }
};