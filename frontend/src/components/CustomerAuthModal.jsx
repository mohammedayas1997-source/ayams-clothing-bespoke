import React, { useState } from 'react';
import { X, ShoppingBag, Phone, User, Loader2, ArrowRight, MapPin, Truck } from 'lucide-react';
import { customerPortalAuth } from '../services/api';

const CustomerAuthModal = ({ isOpen, onClose, onSuccess, selectedItem }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' ko 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [stateCity, setStateCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (deliveryMethod === 'delivery' && (!deliveryAddress.trim() || !stateCity.trim())) {
      setErrorMsg('Please enter your full delivery address and state/city.');
      setLoading(false);
      return;
    }

    try {
      const res = await customerPortalAuth({
        phone_number: phoneNumber.trim(),
        full_name: fullName.trim(),
      });

      if (res.data.success) {
        const fullDeliveryInfo =
          deliveryMethod === 'pickup'
            ? 'Store Pickup (Ayams Flagship Boutique)'
            : `${deliveryAddress.trim()}, ${stateCity.trim()}`;

        localStorage.setItem('ayams_customer_token', res.data.token);
        localStorage.setItem('ayams_customer_data', JSON.stringify(res.data.customer));
        
        // Aika bayanan customer tare da cikakken adireshinsa
        onSuccess(res.data.customer, fullDeliveryInfo);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to authenticate. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-7 shadow-2xl relative text-neutral-100 max-h-[92vh] overflow-y-auto">
        
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Client Checkout & Delivery</h2>
              <p className="text-xs text-neutral-400">Provide contact credentials and shipping address</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {selectedItem && (
          <div className="mb-5 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedItem.thumbnail || selectedItem.media || selectedItem.media_url}
                alt={selectedItem.title}
                className="h-11 w-11 rounded-xl object-cover border border-neutral-800"
              />
              <div>
                <h4 className="text-xs font-bold text-white">{selectedItem.title}</h4>
                <span className="text-[11px] text-neutral-400">{selectedItem.category} Bespoke</span>
              </div>
            </div>
            <span className="text-amber-400 font-mono font-bold text-sm">
              {selectedItem.price || `₦${Number(selectedItem.base_price).toLocaleString()}`}
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  required
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="080XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl focus:border-amber-500 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl focus:border-amber-500 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method Selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Delivery Method</label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
                  deliveryMethod === 'delivery'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Doorstep Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
                  deliveryMethod === 'pickup'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Store Pickup</span>
              </button>
            </div>
          </div>

          {/* Akwatin Shigar da Adireshi (Idan ya zabi Doorstep Delivery) */}
          {deliveryMethod === 'delivery' ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Destination State &amp; City
                </label>
                <input
                  required
                  type="text"
                  value={stateCity}
                  onChange={(e) => setStateCity(e.target.value)}
                  placeholder="e.g. Abuja (FCT) or Kano / Nassarawa"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Complete Street / Residential Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                  <textarea
                    required
                    rows="2"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House Number, Street Name, Landmark..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
              <span>You will pick up your packaged garment at <strong>Ayams Flagship Boutique Counter</strong>.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Proceed to Bank Transfer &amp; Receipt</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerAuthModal;