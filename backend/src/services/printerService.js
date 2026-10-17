const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');
require('dotenv').config();

/**
 * Ƙirƙirar sabuwar hulɗa da Thermal Printer
 */
const createPrinterInstance = () => {
  return new ThermalPrinter({
    type: PrinterTypes.EPSON, // Mafi yawan thermal printers (Epson, Xprinter, POS-58/80) suna amfani da ESC/POS
    interface: process.env.PRINTER_INTERFACE || 'tcp://192.168.1.100:9100', // Ko '\\\\.\\LPT1' ko 'printer:USB_NAME'
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: '=',
    options: {
      timeout: 5000, // Lokacin jiran na'ura kafin bayar da kuskure (5s)
    },
  });
};

/**
 * Aikin buga cikakken rasiti na Ayams Clothing & Bespoke
 * @param {Object} receiptData - Bayanan dinki, customer, da kudin da aka biya
 */
const printCustomerReceipt = async (receiptData) => {
  const printer = createPrinterInstance();

  try {
    // Gwada ko na'urar a kunne take kuma a shirye
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      console.warn('⚠️ Thermal Printer ba ta haɗu ba ko tana kashe.');
      return { success: false, message: 'Printer ba ta haɗu ba' };
    }

    // 1. Kan Rasiti (Header & Branding)
    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.setTextDoubleWidth();
    printer.bold(true);
    printer.println('AYAMS CLOTHING');
    printer.println('& BESPOKE');
    printer.setTextNormal();
    printer.bold(false);
    printer.println('Premium Tailoring & Ready-to-Wear');
    printer.println('Waya: +234 800 000 0000');
    printer.drawLine();

    // 2. Bayanan Rasiti da Ranaku
    printer.alignLeft();
    printer.println(`Lambar Rasiti: #${receiptData.receiptNumber || 'AYM-001'}`);
    printer.println(`Kwanan Wata : ${new Date().toLocaleDateString('en-GB')}`);
    printer.println(`Ranar Karba : ${receiptData.deliveryDate || 'Za a sanar'}`);
    printer.drawLine();

    // 3. Bayanan Customer
    printer.bold(true);
    printer.println('BAYANIN CUSTOMER:');
    printer.bold(false);
    printer.println(`Suna: ${receiptData.customerName}`);
    printer.println(`Waya: ${receiptData.customerPhone}`);
    printer.drawLine();

    // 4. Bayanin Kayan Dinki (Items / Job Specs)
    printer.bold(true);
    printer.tableCustom([
      { text: 'Aiki / Salo', align: 'LEFT', width: 0.65 },
      { text: 'Kudi (NGN)', align: 'RIGHT', width: 0.35 },
    ]);
    printer.bold(false);

    if (receiptData.items && receiptData.items.length > 0) {
      receiptData.items.forEach((item) => {
        printer.tableCustom([
          { text: item.description, align: 'LEFT', width: 0.65 },
          { text: Number(item.amount).toLocaleString(), align: 'RIGHT', width: 0.35 },
        ]);
      });
    } else {
      printer.tableCustom([
        { text: receiptData.styleTitle || 'Dinkin Bespoke', align: 'LEFT', width: 0.65 },
        { text: Number(receiptData.totalAmount).toLocaleString(), align: 'RIGHT', width: 0.35 },
      ]);
    }
    printer.drawLine();

    // 5. Lissafin Kudade (Financial Summary)
    printer.alignRight();
    printer.println(`Jimilla: ₦${Number(receiptData.totalAmount).toLocaleString()}`);
    printer.bold(true);
    printer.println(`An Biya: ₦${Number(receiptData.amountPaid).toLocaleString()}`);
    printer.bold(false);

    const balance = Number(receiptData.balanceDue);
    if (balance > 0) {
      printer.bold(true);
      printer.println(`Ragowar Bashi: ₦${balance.toLocaleString()}`);
      printer.bold(false);
    } else {
      printer.println('Ragowar Bashi: ₦0 (An Kammala)');
    }
    printer.drawLine();

    // 6. QR Code don Bibiyar Matsayin Aiki (Live Tracking)
    printer.alignCenter();
    const trackingUrl = `https://ayamsbespoke.com/track/${receiptData.orderNumber || '001'}`;
    printer.printQR(trackingUrl, {
      cellSize: 6,
      correction: 'M',
      model: 2,
    });
    printer.newLine();
    printer.println('Duba halin da kayanka yake ciki');
    printer.println('ta hanyar scan na QR code din sama.');
    printer.newLine();
    printer.println('Mun gode da zabar Ayams Bespoke!');
    printer.newLine();

    // 7. Yanke Takarda (Cut Paper)
    printer.cut();

    // Aika dukkan umarni zuwa printer
    await printer.execute();
    console.log('✅ An yi nasarar buga rasiti a Thermal Printer!');
    return { success: true, message: 'An buga rasiti cikin nasara' };
  } catch (error) {
    console.error('❌ Kuskure wajen tura umarni zuwa Thermal Printer:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  printCustomerReceipt,
};