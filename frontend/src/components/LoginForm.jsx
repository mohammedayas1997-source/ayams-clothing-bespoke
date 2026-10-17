import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, Loader2, Users, ClipboardList, Shield } from 'lucide-react';
import API from '../services/api';

const LoginForm = ({ onLoginSuccess, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState('staff'); // 'staff', 'manager', 'super_admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await API.post('/auth/login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        const user = response.data.user;

        // Tabbatar ko mutum ya zabi matsayin da ya dace da asusunsa
        if (selectedRole !== user.role && user.role !== 'super_admin') {
          setErrorMsg(`Wannan asusun na ${user.role.toUpperCase()} ne, ba ${selectedRole.toUpperCase()} ba.`);
          setLoading(false);
          return;
        }

        // Ajiye bayanan tsaro
        localStorage.setItem('ayams_token', response.data.token);
        localStorage.setItem('ayams_user', JSON.stringify(user));

        onLoginSuccess(user);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Login failed. Check your username or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative text-neutral-100">
        
        {/* Kan Fom */}
        <div className="text-center space-y-2 mb-6">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Employee Workspace Login</h2>
          <p className="text-xs text-neutral-400">
            Select your assigned role and enter credentials to continue
          </p>
        </div>

        {/* Maɓallan Zaɓin Matsayi (Role Selector Buttons) */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setSelectedRole('staff')}
            className={`flex flex-col items-center py-2.5 rounded-xl text-[11px] font-bold transition ${
              selectedRole === 'staff'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4 mb-1" />
            <span>Staff</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('manager')}
            className={`flex flex-col items-center py-2.5 rounded-xl text-[11px] font-bold transition ${
              selectedRole === 'manager'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ClipboardList className="h-4 w-4 mb-1" />
            <span>Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('super_admin')}
            className={`flex flex-col items-center py-2.5 rounded-xl text-[11px] font-bold transition ${
              selectedRole === 'super_admin'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4 mb-1" />
            <span>Admin</span>
          </button>
        </div>

        {/* Kuskure */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              {selectedRole === 'super_admin' ? 'Super Admin Username' : selectedRole === 'manager' ? 'Store Manager Username' : 'Front Desk Username'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white outline-none transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Login as {selectedRole === 'super_admin' ? 'Admin' : selectedRole === 'manager' ? 'Manager' : 'Staff'}</span>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition"
              >
                Return to Public Showcase
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;