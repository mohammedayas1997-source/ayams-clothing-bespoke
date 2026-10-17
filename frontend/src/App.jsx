import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import LoginForm from './components/LoginForm';
import { Scissors, Sparkles, LayoutGrid, Users, LogOut, ShieldCheck, Lock, ClipboardList } from 'lucide-react';
import ManageGalleryModal from './components/ManageGalleryModal';
import { UploadCloud } from 'lucide-react';

function App() {
  const [currentTab, setCurrentTab] = useState('gallery'); // 'gallery', 'dashboard', 'manager', 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGalleryManager, setShowGalleryManager] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ayams_user');
    const token = localStorage.getItem('ayams_token');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleTabSwitch = (tab) => {
    if (!currentUser && tab !== 'gallery') {
      setShowLoginModal(true);
    } else {
      setCurrentTab(tab);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    if (user.role === 'super_admin') setCurrentTab('admin');
    else if (user.role === 'manager') setCurrentTab('manager');
    else setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('ayams_token');
    localStorage.removeItem('ayams_user');
    setCurrentUser(null);
    setCurrentTab('gallery');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Top Luxury Navigation Bar */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/20">
              <Scissors className="h-5 w-5 rotate-90" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-widest text-neutral-50 uppercase">
                  AYAMS <span className="text-amber-400 font-light">BESPOKE</span>
                </h1>
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Sparkles className="h-2.5 w-2.5" /> Haute Couture
                </span>
              </div>
              <p className="text-xs text-neutral-400 tracking-wide">
                Premium Bespoke Fashion & Tailoring House
              </p>
            </div>
          </div>

          {/* Dynamic Navigation Based on Role */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
              <button
                onClick={() => handleTabSwitch('gallery')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                  currentTab === 'gallery' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Showcase</span>
              </button>

              <button
                onClick={() => handleTabSwitch('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                  currentTab === 'dashboard' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Client Desk</span>
              </button>

              {/* Idan Manager ko Admin ne */}
              {currentUser && (currentUser.role === 'manager' || currentUser.role === 'super_admin') && (
                <button
                  onClick={() => handleTabSwitch('manager')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                    currentTab === 'manager' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>Workflow</span>
                </button>
              )}

              {/* Idan Super Admin ne */}
              {currentUser && currentUser.role === 'super_admin' && (
                <button
                  onClick={() => handleTabSwitch('admin')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                    currentTab === 'admin' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </div>

            {/* Profile Info / Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-white block capitalize">{currentUser.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">{currentUser.role}</span>
                </div>
                {currentUser && (currentUser.role === 'manager' || currentUser.role === 'super_admin') && (
  <button
    onClick={() => setShowGalleryManager(true)}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
  >
    <UploadCloud className="h-3.5 w-3.5" />
    <span className="hidden sm:inline">Manage Showcase</span>
  </button>
)}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl bg-neutral-800/80 hover:bg-red-500/20 hover:text-red-400 border border-neutral-700/60 text-neutral-400 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition"
              >
                Staff Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Display */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {currentTab === 'gallery' && (
          <GalleryPage
            onSelectStyleForOrder={(style) => {
              if (!currentUser) setShowLoginModal(true);
              else setCurrentTab('dashboard');
            }}
          />
        )}
        {currentTab === 'dashboard' && currentUser && <Dashboard />}
        {currentTab === 'manager' && currentUser && <ManagerDashboard />}
        {currentTab === 'admin' && currentUser && <AdminDashboard />}
      </main>

      {/* Login Popup */}
      {showLoginModal && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowLoginModal(false)}
        />
      )}
      <ManageGalleryModal
  isOpen={showGalleryManager}
  onClose={() => setShowGalleryManager(false)}
/>

      {/* Footer */}
      <footer className="border-t border-neutral-800/60 py-6 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} Ayams Clothing & Bespoke. All Rights Reserved. Engineered for Precision.
      </footer>
    </div>
  );
}

export default App;