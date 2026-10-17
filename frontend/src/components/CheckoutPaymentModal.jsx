import React, { useState } from 'react';
import { X, CheckCircle, Copy, ShieldCheck, Download, Printer, Scissors, MapPin, Phone, User, Calendar } from 'lucide-react';

const CheckoutPaymentModal = ({ isOpen, onClose, orderDetails, clientInfo, item }) => {
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  if (!isOpen || !orderDetails) return null;

  const bankAccount = {
    bankName: 'Jaiz Bank / Zenith Bank',
    accountNumber: '1029384756',
    accountName: 'Ayams Clothing & Bespoke Ltd',
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const itemImage = item?.thumbnail || item?.media || item?.media_url;
  const itemPrice = item?.price || `₦${Number(item?.base_price || 0).toLocaleString()}`;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-neutral-100 max-h-[92vh] overflow-y-auto print:max-h-none print:m-0 print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Kan Akwati (Ba ya fita a print) */}
        <div className="flex justify-between items-center pb-4 border-b border-neutral-800 print:hidden">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              {paymentConfirmed ? 'Order Receipt & Invoice' : 'Complete Your Payment'}
            </h2>
            <p className="text-xs text-neutral-400">Order Ref: #{orderDetails.order_number}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!paymentConfirmed ? (
          /* MATAKI NA 1: TURA KUDI ZUWA BANKI */
          <div className="space-y-4 my-4">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {itemImage && (
                  <img
                    src={itemImage}
                    alt={item?.title}
                    className="h-12 w-12 rounded-xl object-cover border border-neutral-800"
                  />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{item?.title}</h4>
                  <span className="text-xs text-neutral-400">{item?.category} Ready-to-Wear</span>
                </div>
              </div>
              <span className="text-amber-400 font-mono font-black text-base">{itemPrice}</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-300 leading-relaxed">
              Tura kuɗin zuwa asusun kamfanin <strong>Ayams Clothing &amp; Bespoke</strong> na ƙasa domin tabbatar da odarka:
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Bank Name:</span>
                <span className="font-semibold text-white">{bankAccount.bankName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-400">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-amber-400">{bankAccount.accountNumber}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Account Name:</span>
                <span className="font-semibold text-white">{bankAccount.accountName}</span>
              </div>
            </div>

            <button
              onClick={() => setPaymentConfirmed(true)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>I Have Sent The Transfer (Generate Receipt)</span>
            </button>
          </div>
        ) : (
          /* MATAKI NA 2: RASITI MAI HOTON KAYA DON DOWNLOAD/PRINT */
          <div className="space-y-6 pt-2">
            
            {/* Tsarin Rasiti */}
            <div
              id="printable-receipt"
              className="bg-white text-neutral-950 p-6 rounded-2xl border border-neutral-300 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0"
            >
              {/* Kan Rasiti */}
              <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Scissors className="h-5 w-5 text-amber-600" />
                    <h1 className="text-base font-black tracking-widest text-neutral-900 uppercase">
                      AYAMS BESPOKE
                    </h1>
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    Official Purchase Invoice &amp; Receipt
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Order Number</span>
                  <span className="text-sm font-extrabold font-mono text-neutral-900">
                    #{orderDetails.order_number}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">{currentDate}</span>
                </div>
              </div>

              {/* Bayanan Kayan da Aka Saya Tare da Hoto */}
              <div className="flex gap-4 items-center bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                {itemImage && (
                  <img
                    src={itemImage}
                    alt={item?.title}
                    className="h-20 w-20 rounded-lg object-cover border border-neutral-300 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    {item?.category} Ready-To-Wear
                  </span>
                  <h3 className="font-bold text-neutral-900 text-sm truncate">{item?.title}</h3>
                  <p className="text-[11px] text-neutral-600 line-clamp-1">{item?.desc}</p>
                  <div className="mt-1 font-mono font-black text-neutral-900 text-sm">
                    {itemPrice}
                  </div>
                </div>
              </div>

              {/* Bayanan Customer & Delivery Address */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-neutral-200 py-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-0.5">Billed To:</span>
                  <span className="font-bold text-neutral-800 block">{clientInfo?.full_name}</span>
                  <span className="font-mono text-neutral-600 block">{clientInfo?.phone_number}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-0.5">Delivery Destination:</span>
                  <span className="text-neutral-700 font-medium block leading-snug">
                    {orderDetails.tailor_notes?.replace('Direct Purchase Delivery: ', '') || 'Store Pickup'}
                  </span>
                </div>
              </div>

              {/* Lissafin Kudi & Status */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Payment Method:</span>
                  <span>Direct Bank Transfer</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Payment Status:</span>
                  <span className="text-emerald-700 font-bold">VERIFIED &amp; PAID</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-200 pt-2">
                  <span>Total Paid:</span>
                  <span className="text-base text-amber-700">{itemPrice}</span>
                </div>
              </div>

              {/* Kasan Rasiti */}
              <div className="text-center border-t border-dashed border-neutral-200 pt-3">
                <p className="text-[10px] text-neutral-500">
                  Thank you for patronizing Ayams Clothing &amp; Bespoke. Engineered for royalty.
                </p>
              </div>
            </div>

            {/* Maballan Saukarwa (Download / Print) - Ba sa fitowa a print */}
            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download / Save PDF Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl text-xs transition"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutPaymentModal;