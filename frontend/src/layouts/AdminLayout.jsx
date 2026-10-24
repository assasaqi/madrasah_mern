import React, { useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, login: setAuthContext } = useContext(AuthContext);

  // Memproses sesi keluar akun admin
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (setAuthContext) setAuthContext(null);
      window.location.href = '/login';
    }
  };

  // Menentukan judul header berdasarkan rute aktif saat ini
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard': return 'Ringkasan Data Dashboard';
      case '/admin/profil-sekolah': return 'Profil Sekolah';
      case '/admin/ppdb': return 'Verifikasi PPDB';
      case '/admin/berita': return 'Kelola Berita';
      case '/admin/pengumuman': return 'Pengumuman';
      case '/admin/pengaturan-profil': return 'Edit Profil Akun';
      default: return 'Panel Administrator';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* Sidebar Admin Persisten */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Navbar Admin terpisah sebagai komponen independen */}
        <Navbar
          setSidebarOpen={setSidebarOpen}
          getPageTitle={getPageTitle}
          user={user}
          handleLogout={handleLogout}
        />

        {/* Konten Halaman Admin */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ sidebarOpen, setSidebarOpen }} />
        </main>
      </div>
    </div>
  );
}
