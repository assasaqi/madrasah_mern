import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Megaphone,
  User,
  Globe,
  LogOut,
  Building2,
  Menu,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Import komponen-komponen admin
import AdminPublicProfile from './AdminPublicProfile';
import AdminPPDB from './AdminPPDB';
import AdminBerita from './AdminBerita';
import AdminPengumuman from './AdminPengumuman';
import AdminProfile from './AdminProfile';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const dropdownRef = useRef(null);

  // Ambil & dengarkan perubahan data user di localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    };

    loadUser(); // Muat data pertama kali

    // Listener otomatis saat localStorage diperbarui oleh AdminProfile.jsx
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  // Tutup dropdown jika klik di luar area profil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'public-profile', label: 'Profil Sekolah', icon: Globe },
    { id: 'ppdb', label: 'Verifikasi PPDB', icon: Users },
    { id: 'berita', label: 'Kelola Berita', icon: FileText },
    { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone },
  ];

  // Penanganan fleksibel untuk properti foto/avatar
  const photoPath = currentUser?.foto || currentUser?.avatar || currentUser?.image;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigasi */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm leading-tight">Admin Madrasah</h2>
              <p className="text-[11px] text-gray-400">Panel Operator</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition border border-red-100 cursor-pointer"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Area Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar / Header Utama */}
        <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer lg:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-sm text-gray-900 hidden sm:inline-block">
              {activeTab === 'overview' && 'Dashboard Utama'}
              {activeTab === 'public-profile' && 'Profil Sekolah'}
              {activeTab === 'ppdb' && 'Verifikasi PPDB'}
              {activeTab === 'berita' && 'Kelola Berita'}
              {activeTab === 'pengumuman' && 'Pengumuman'}
              {activeTab === 'profile' && 'Edit Profil Akun'}
            </span>
          </div>

          {/* Profil User Pojok Kanan Atas */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-gray-100 transition cursor-pointer border border-transparent hover:border-gray-200"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0">
                {photoPath ? (
                  <img
                    src={
                      photoPath.startsWith('http')
                        ? photoPath
                        : `http://localhost:5000/uploads/${photoPath}`
                    }
                    alt={currentUser?.nama || 'Admin'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback jika file foto di server tidak ditemukan/error
                      e.target.onerror = null;
                      setCurrentUser((prev) => ({ ...prev, foto: null }));
                    }}
                  />
                ) : (
                  <User className="text-emerald-700" size={18} />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  {currentUser?.nama || currentUser?.email || 'Admin Madrasah'}
                </p>
                <p className="text-[10px] text-gray-400 capitalize">
                  {currentUser?.role || 'Administrator'}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg py-1.5 z-50">
                <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                  <p className="text-xs font-bold text-gray-900">{currentUser?.nama || 'Admin'}</p>
                  <p className="text-[10px] text-gray-400">{currentUser?.email || 'admin@madrasah.sch.id'}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                >
                  <User size={16} /> Edit Profil Akun
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Selamat Datang di Panel Admin</h1>
                <p className="text-xs text-gray-500 mt-1">
                  Pilih modul di bawah ini untuk mengelola verifikasi PPDB, berita & pengumuman, profil publik sekolah, atau pengaturan akun.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('ppdb')}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Modul PPDB</p>
                    <h3 className="text-base font-bold text-gray-900 mt-1">Verifikasi Pendaftar</h3>
                  </div>
                  <ChevronRight size={20} className="text-emerald-600" />
                </div>

                <div
                  onClick={() => setActiveTab('berita')}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Modul CMS</p>
                    <h3 className="text-base font-bold text-gray-900 mt-1">Kelola Berita</h3>
                  </div>
                  <ChevronRight size={20} className="text-emerald-600" />
                </div>

                <div
                  onClick={() => setActiveTab('pengumuman')}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Modul CMS</p>
                    <h3 className="text-base font-bold text-gray-900 mt-1">Kelola Pengumuman</h3>
                  </div>
                  <ChevronRight size={20} className="text-emerald-600" />
                </div>

                <div
                  onClick={() => setActiveTab('public-profile')}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Informasi Publik</p>
                    <h3 className="text-base font-bold text-gray-900 mt-1">Profil Sekolah</h3>
                  </div>
                  <ChevronRight size={20} className="text-emerald-600" />
                </div>

                <div
                  onClick={() => setActiveTab('profile')}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Pengaturan</p>
                    <h3 className="text-base font-bold text-gray-900 mt-1">Edit Profil Akun</h3>
                  </div>
                  <ChevronRight size={20} className="text-emerald-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'public-profile' && <AdminPublicProfile />}
          {activeTab === 'ppdb' && <AdminPPDB />}
          {activeTab === 'berita' && <AdminBerita />}
          {activeTab === 'pengumuman' && <AdminPengumuman />}
          {activeTab === 'profile' && <AdminProfile />}
        </main>
      </div>
    </div>
  );
}
