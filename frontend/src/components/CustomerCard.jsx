import React from 'react';
import { User, Phone, Ruler, Calendar, CheckCircle2, Clock, PlusCircle } from 'lucide-react';

const CustomerCard = ({ customerData, onNewOrder }) => {
  if (!customerData) return null;

  const { profile, measurements, orders } = customerData;
  const isMale = measurements.male !== null;
  const activeMeas = measurements.male || measurements.female;

  return (
    <div className="bg-neutral-900/80 rounded-3xl border border-neutral-800/80 p-8 shadow-2xl space-y-8 backdrop-blur-sm">
      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">{profile.full_name}</h2>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              {isMale ? 'Gentleman' : 'Lady'}
            </span>
          </div>
          <p className="flex items-center gap-2 text-neutral-400 mt-1.5 font-mono text-sm">
            <Phone className="h-4 w-4 text-amber-400" />
            {profile.phone_number}
          </p>
        </div>

        <button
          onClick={() => onNewOrder(profile.id)}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium rounded-xl text-sm border border-neutral-700 transition"
        >
          <PlusCircle className="h-4 w-4 text-amber-400" />
          <span>New Bespoke Order</span>
        </button>
      </div>

      {/* Measurement Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 font-bold text-neutral-200 text-sm uppercase tracking-wider">
            <Ruler className="h-4 w-4 text-amber-400" />
            Bespoke Profile Measurements ({isMale ? 'Men' : 'Women'})
          </h3>
          <span className="text-xs text-neutral-500">Unit: Inches (in)</span>
        </div>

        {activeMeas ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Object.entries(activeMeas)
              .filter(([k]) => !['id', 'customer_id', 'updated_at'].includes(k))
              .map(([key, val]) => (
                <div key={key} className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/60">
                  <span className="text-[11px] font-medium text-neutral-400 capitalize block truncate">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-extrabold text-amber-400 font-mono text-lg mt-0.5 block">
                    {val ? `${val}"` : '-'}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-sm text-neutral-500">
            No measurements recorded yet for this profile.
          </div>
        )}
      </div>

      {/* Order & Payment History */}
      <div>
        <h3 className="flex items-center gap-2 font-bold text-neutral-200 text-sm uppercase tracking-wider mb-4">
          <Clock className="h-4 w-4 text-amber-400" />
          Order & Tailoring History ({orders?.length || 0})
        </h3>
        
        <div className="space-y-3">
          {orders && orders.length > 0 ? (
            orders.map((o) => (
              <div
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/50 hover:border-neutral-700/80 transition text-sm gap-3"
              >
                <div>
                  <span className="font-bold text-white block font-mono text-base">
                    #{o.order_number}
                  </span>
                  <span className="text-xs text-neutral-400">{o.order_type}</span>
                </div>

                <div>
                  <span className="text-xs text-neutral-500 block">Delivery Date</span>
                  <span className="font-medium text-neutral-300">
                    {new Date(o.delivery_date).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                      o.status === 'Ready'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : o.status === 'Delivered'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="text-xs text-neutral-400 block mt-1">
                    Balance: <strong className="text-neutral-200 font-mono">₦{Number(o.balance_due || 0).toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-neutral-950/40 border border-dashed border-neutral-800 text-center text-sm text-neutral-500">
              No previous orders found for this client.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;