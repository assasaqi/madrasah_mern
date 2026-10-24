import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  School,
  Users,
  FileText,
  Megaphone,
  User,
  LogOut,
  X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login: setAuthContext } = useContext(AuthContext);

  // Memproses sesi keluar akun admin dan membersihkan state global
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      if (setAuthContext) setAuthContext(null);
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/profil-sekolah', label: 'Profil Sekolah', icon: School },
    { path: '/admin/ppdb', label: 'Verifikasi PPDB', icon: Users },
    { path: '/admin/berita', label: 'Kelola Berita', icon: FileText },
    { path: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone },
    { path: '/admin/pengaturan-profil', label: 'Pengaturan Profil', icon: User },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:static lg:inset-auto flex flex-col justify-between shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-200">
                A
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-xs tracking-wide">PANEL ADMIN</h1>
                <p className="text-[10px] text-gray-400 font-medium">Sistem Informasi</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Menu Utama
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </>
  );
}
