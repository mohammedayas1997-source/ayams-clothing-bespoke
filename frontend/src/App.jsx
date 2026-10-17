import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import LoginForm from './components/LoginForm';
import ManageGalleryModal from './components/ManageGalleryModal';
import { 
  Scissors, 
  Sparkles, 
  LayoutGrid, 
  Users, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  ClipboardList, 
  UploadCloud, 
  Phone, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';

function App() {
  const [currentTab, setCurrentTab] = useState('gallery'); // 'gallery', 'dashboard', 'manager', 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Bayanan Tuntuba na Shagon Ayams Bespoke
  const contactInfo = {
    phone: '+234 803 000 0000',
    whatsapp: '+2348030000000',
    address: 'Ayams Flagship Boutique, Plot 14 Commercial Avenue, Kano / Abuja, Nigeria',
    email: 'contact@ayamsbespoke.com',
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('ayams_user');
    const token = localStorage.getItem('ayams_token');
    if (savedUser && token) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session');
      }
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
      
      {/* Top Banner: Quick Contact Bar */}
      <div className="bg-neutral-950/90 border-b border-neutral-800/60 px-6 py-2 text-[11px] text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition">
              <MapPin className="h-3 w-3 text-amber-500" />
              <span>{contactInfo.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <a 
              href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Phone className="h-3 w-3 text-amber-500" />
              <span>{contactInfo.phone}</span>
            </a>
            <a 
              href={`https://wa.me/${contactInfo.whatsapp}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              <MessageCircle className="h-3 w-3" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Luxury Navigation Bar */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
         {/* Logo & Brand Display */}
          <div className="flex items-center gap-3.5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-amber-500/40 bg-neutral-950 flex items-center justify-center shadow-xl shadow-amber-500/10 shrink-0">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Ayams Bespoke Logo"
                  onError={() => setLogoError(true)}
                  className="h-full w-full object-cover scale-110"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black text-xl">
                  <Scissors className="h-8 w-8 rotate-90" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-widest text-neutral-50 uppercase">
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
              <button
                onClick={() => handleTabSwitch('gallery')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                  currentTab === 'gallery' ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Showcase</span>
              </button>

              <button
                onClick={() => handleTabSwitch('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                  currentTab === 'dashboard' ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {currentUser ? <Users className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5 text-amber-400" />}
                <span>Client Desk</span>
              </button>

              {/* Idan Manager ko Super Admin ne */}
              {currentUser && (currentUser.role === 'manager' || currentUser.role === 'super_admin') && (
                <button
                  onClick={() => handleTabSwitch('manager')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition ${
                    currentTab === 'manager' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
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
                    currentTab === 'admin' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </div>

            {/* Profile Info / Admin Showcase Management / Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-white block capitalize">{currentUser.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">{currentUser.role}</span>
                </div>

                {(currentUser.role === 'manager' || currentUser.role === 'super_admin') && (
                  <button
                    onClick={() => setShowGalleryManager(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
                    title="Upload or Edit Media and Prices"
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

      {/* Admin Showcase Manager Modal */}
      <ManageGalleryModal
        isOpen={showGalleryManager}
        onClose={() => setShowGalleryManager(false)}
      />

      {/* Comprehensive Footer With Full Contact & Address */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10 px-6 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <h3 className="text-white font-black tracking-widest text-sm uppercase">
              AYAMS <span className="text-amber-400 font-light">BESPOKE</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed text-xs">
              Handcrafted precision, imperial styling, and bespoke tailoring designed to reflect elegance, status, and royalty.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">Atelier & Boutique Address</h4>
            <div className="flex items-start gap-2 text-neutral-400">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{contactInfo.address}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">Direct Inquiries & Bookings</h4>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-400" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp: {contactInfo.whatsapp}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-900 text-center text-[11px] text-neutral-500">
          &copy; {new Date().getFullYear()} Ayams Clothing & Bespoke Ltd. All Rights Reserved. Engineered for Precision.
        </div>
      </footer>

    </div>
  );
}

export default App;