const db = require('../config/db');
const { printCustomerReceipt } = require('../services/printerService');

// 1. Duba kayan da suka kammala dinki wadanda customer zai zo ya karba (Ready for Pickup)
exports.getReadyOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.id, o.order_number, o.status, o.delivery_date,
        c.full_name AS customer_name, c.phone_number,
        p.balance_due
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE o.status = 'Ready'
      ORDER BY o.delivery_date ASC;
    `);

    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure', error: error.message });
  }
};

// 2. Damka wa customer kayansa idan ya zo karba (Mark as Delivered)
exports.handoverToCustomer = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Tabbatar ko customer yana da sauran bashi kafin a ba shi kaya
    const paymentCheck = await db.query('SELECT balance_due FROM payments WHERE order_id = $1', [order_id]);
    if (paymentCheck.rows.length > 0 && Number(paymentCheck.rows[0].balance_due) > 0) {
      return res.status(400).json({
        success: false,
        message: `Customer yana da ragowar bashi na NGN ${paymentCheck.rows[0].balance_due}. Dole sai an karbi kudi kafin a ba shi kaya.`,
      });
    }

    const result = await db.query(
      "UPDATE orders SET status = 'Delivered' WHERE id = $1 RETURNING *",
      [order_id]
    );

    res.status(200).json({ success: true, message: 'An damka kaya wa customer!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Sake buga rasiti a Thermal Printer (Reprint Receipt)
exports.reprintReceipt = async (req, res) => {
  try {
    const { order_id } = req.params;

    const dataQuery = await db.query(`
      SELECT o.order_number, o.delivery_date, c.full_name, c.phone_number,
             p.receipt_number, p.total_amount, p.amount_paid, p.balance_due
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN payments p ON o.id = p.order_id
      WHERE o.id = $1;
    `, [order_id]);

    if (dataQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ba a sami bayanin wannan odar ba.' });
    }

    const data = dataQuery.rows[0];

    // Tura umarni zuwa printer
    await printCustomerReceipt({
      receiptNumber: data.receipt_number,
      orderNumber: data.order_number,
      customerName: data.full_name,
      customerPhone: data.phone_number,
      deliveryDate: data.delivery_date,
      totalAmount: data.total_amount,
      amountPaid: data.amount_paid,
      balanceDue: data.balance_due,
    });

    res.status(200).json({ success: true, message: 'An sake tura rasiti zuwa printer!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};