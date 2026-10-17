const db = require('../config/db');
const { printCustomerReceipt } = require('../services/printerService');

// 1. Shigar da biyan kudi da hannu (Cash / POS a counter)
exports.recordPayment = async (req, res) => {
  try {
    const { order_id, total_amount, amount_paid, payment_method, transaction_reference } = req.body;

    const balance_due = Number(total_amount) - Number(amount_paid);
    const receipt_number = `RCT-${Math.floor(1000 + Math.random() * 9000)}`;

    const queryText = `
      INSERT INTO payments (order_id, receipt_number, total_amount, amount_paid, balance_due, payment_method, transaction_reference, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Verified')
      RETURNING *;
    `;
    const result = await db.query(queryText, [
      order_id, receipt_number, total_amount, amount_paid, balance_due, payment_method, transaction_reference || null
    ]);

    // Daukowa tare da hada bayanan customer don buga rasiti
    const orderInfo = await db.query(
      `SELECT o.order_number, o.delivery_date, c.full_name, c.phone_number 
       FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = $1`,
      [order_id]
    );

    const fullData = orderInfo.rows[0];

    // Buga rasiti a Thermal Printer kai tsaye!
    await printCustomerReceipt({
      receiptNumber: receipt_number,
      orderNumber: fullData.order_number,
      customerName: fullData.full_name,
      customerPhone: fullData.phone_number,
      deliveryDate: fullData.delivery_date,
      totalAmount: total_amount,
      amountPaid: amount_paid,
      balanceDue: balance_due,
    });

    res.status(201).json({
      success: true,
      message: 'An karbi kudi kuma an aika umarni zuwa ga Printer!',
      payment: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen ajiye biyan kudi', error: error.message });
  }
};

// 2. Karbar Webhook na Banki (Bank Transfer / Monnify / Paystack Webhook)
exports.handleBankWebhook = async (req, res) => {
  try {
    const event = req.body; // Sakon da banki ya turo ta intanet

    // Misalin tsarin da banki ke aiko da sanarwar ciniki mai nasara
    if (event && (event.event === 'charge.success' || event.status === 'PAID')) {
      const reference = event.data ? event.data.reference : event.transactionReference;
      const amountPaid = event.data ? event.data.amount / 100 : event.amount; // Idan kobo ne a maida shi naira

      // Nemo payment record a database ka sabunta shi
      const updateResult = await db.query(
        `UPDATE payments 
         SET payment_status = 'Verified', amount_paid = amount_paid + $1, balance_due = total_amount - (amount_paid + $1)
         WHERE transaction_reference = $2 RETURNING *`,
        [amountPaid, reference]
      );

      if (updateResult.rows.length > 0) {
        const payment = updateResult.rows[0];

        // Dauko bayanan aiki domin fitar da rasiti
        const orderInfo = await db.query(
          `SELECT o.order_number, o.delivery_date, c.full_name, c.phone_number 
           FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = $1`,
          [payment.order_id]
        );
        const order = orderInfo.rows[0];

        // Printer ta fito da rasiti nan take ba tare da kowa ya taba kwamfuta ba!
        await printCustomerReceipt({
          receiptNumber: payment.receipt_number,
          orderNumber: order.order_number,
          customerName: order.full_name,
          customerPhone: order.phone_number,
          deliveryDate: order.delivery_date,
          totalAmount: payment.total_amount,
          amountPaid: payment.amount_paid,
          balanceDue: payment.balance_due,
        });
      }
    }

    // Dole ne a mayar wa banki da amsar 200 OK domin su san sakon ya iso
    res.status(200).send('Webhook Received');
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).send('Webhook Processing Error');
  }
};