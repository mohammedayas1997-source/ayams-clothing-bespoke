import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import API from '../services/api';

const ManagerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflow = async () => {
    try {
      const res = await API.get('/manager/workflow');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Kuskure wajen dauko ayyukan dinki:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchWorkflow(); // Sake loda sabbin bayanai
    } catch (err) {
      alert('Kuskure wajen sauya matsayin dinki');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin mx-auto mb-2" />
        <p className="text-neutral-400 text-sm">Ana loda ayyukan shagon dinki...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kan Shafi */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-amber-400" />
            Store Operations & Tailoring Workflow
          </h2>
          <p className="text-xs text-neutral-400">Track bespoke garments from cutting stage to pickup delivery</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
          Active Jobs: {orders.length}
        </span>
      </div>

      {/* Jerin Ayyukan Dinki da Matsayinsu */}
      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((o) => (
            <div
              key={o.id}
              className="bg-neutral-900/70 border border-neutral-800/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-white font-mono">#{o.order_number}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                    {o.order_type}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-200">
                  Client: {o.customer_name} <span className="font-mono text-neutral-500 text-xs">({o.phone_number})</span>
                </h4>
                <p className="text-xs text-neutral-400 italic">Notes: {o.tailor_notes || 'No specific notes'}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <div>
                  <span className="text-neutral-500 block">Due Date</span>
                  <span className="text-neutral-300 font-mono flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-amber-400" />
                    {new Date(o.delivery_date).toLocaleDateString('en-GB')}
                  </span>
                </div>

                {/* Matsayin Dinki Selector */}
                <div>
                  <span className="text-neutral-500 block mb-1">Tailoring Status</span>
                  <select
                    value={o.status}
                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                    className="bg-neutral-950 border border-neutral-700 text-amber-400 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-amber-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Cutting">Cutting</option>
                    <option value="Sewing">Sewing</option>
                    <option value="Finishing">Finishing / Ironing</option>
                    <option value="Ready">Ready for Pickup</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
            <p className="text-neutral-500 text-sm">Babu wani aiki a halin yanzu. Dukkan dinki an kammala!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;