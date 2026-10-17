import React, { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingBag, UserPlus, TrendingUp, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({
    financials: { total_revenue_expected: 0, total_cash_received: 0, total_unpaid_debt: 0 },
    total_orders: 0,
    total_customers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fom din sabon ma'aikaci
  const [newStaff, setNewStaff] = useState({ full_name: '', username: '', password: '', role: 'staff' });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchOverview = async () => {
    try {
      const res = await API.get('/admin/overview');
      if (res.data.success) {
        setOverview(res.data.data);
      }
    } catch (err) {
      console.error('Kuskure wajen dauko bayanan Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await API.post('/admin/employees', newStaff);
      if (res.data.success) {
        setMsg({ type: 'success', text: `An yi nasarar ƙirƙirar ${newStaff.role} (${newStaff.full_name})!` });
        setNewStaff({ full_name: '', username: '', password: '', role: 'staff' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'An sami matsala wajen ƙirƙirar maaikaci.' });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin mx-auto mb-2" />
        <p className="text-neutral-400 text-sm">Ana loda bayanan Super Admin...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Kan Shafi */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
            Executive Admin Control Center
          </h2>
          <p className="text-xs text-neutral-400">Total revenue metrics and enterprise personnel management</p>
        </div>
      </div>

      {/* Katunan Lissafin Kudi (Analytics Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Total Cash Received</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><DollarSign className="h-4 w-4" /></span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            ₦{Number(overview.financials.total_cash_received || 0).toLocaleString()}
          </h3>
          <span className="text-[11px] text-neutral-500">Kudin da suka shigo asusun shago</span>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Uncollected Debts</span>
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400"><AlertTriangle className="h-4 w-4" /></span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-red-400 mt-2">
            ₦{Number(overview.financials.total_unpaid_debt || 0).toLocaleString()}
          </h3>
          <span className="text-[11px] text-neutral-500">Ragowar bashin da ke kan customers</span>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Total Bespoke Orders</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><ShoppingBag className="h-4 w-4" /></span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-white mt-2">
            {overview.total_orders}
          </h3>
          <span className="text-[11px] text-neutral-500">Yawan dinkin da aka karba</span>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Registered Clients</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Users className="h-4 w-4" /></span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-white mt-2">
            {overview.total_customers}
          </h3>
          <span className="text-[11px] text-neutral-500">Abokan ciniki a database</span>
        </div>
      </div>

      {/* Fom din Kirkirar Ma'aikaci */}
      <div className="bg-neutral-900/60 border border-neutral-800 p-8 rounded-3xl shadow-2xl max-w-2xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <UserPlus className="h-5 w-5 text-amber-400" />
          Create New Employee Portal
        </h3>
        <p className="text-xs text-neutral-400 mb-6">Create credentials for Managers or Front Desk Staff</p>

        {msg.text && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-semibold ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Full Name</label>
              <input
                required
                type="text"
                value={newStaff.full_name}
                onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                placeholder="e.g. Sani Bello"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Login Username</label>
              <input
                required
                type="text"
                value={newStaff.username}
                onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                placeholder="sanibello"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Password</label>
              <input
                required
                type="password"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Assign Role</label>
              <select
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white outline-none focus:border-amber-500"
              >
                <option value="staff">Staff (Front Desk)</option>
                <option value="manager">Store Manager</option>
                <option value="super_admin">Super Admin (Partner)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-98"
          >
            {creating ? 'Creating Employee...' : 'Register Authorized Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;