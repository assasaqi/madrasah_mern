import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Megaphone,
  User,
  Globe, // <-- Menambahkan Globe
  LogOut,
  Building2,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

// Import komponen-komponen admin
import AdminPublicProfile from './AdminPublicProfile'; // <-- Menambahkan Import
import AdminPPDB from './AdminPPDB';
import AdminBerita from './AdminBerita';
import AdminPengumuman from './AdminPengumuman';
import AdminProfile from './AdminProfile';
AdminPublicProfile

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { id: 'profile', label: 'Edit Profil', icon: User },
  ];

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

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 py-3.5 px-4 lg:hidden flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-sm text-gray-900">Panel Admin</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Tampilan Overview */}
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

          {/* Render Komponen Tab Aktif */}
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
