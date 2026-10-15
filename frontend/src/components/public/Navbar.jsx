import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, LogIn, LayoutDashboard, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menentukan rute dashboard berdasarkan role user
  const getDashboardPath = () => {
    const rawRole = user?.role || '';
    const role = String(rawRole).toUpperCase().trim();

    if (role === 'ADMIN' || role === 'SUPERADMIN' || role === 'OPERATOR') {
      return '/admin/dashboard';
    } else if (role === 'GURU') {
      return '/guru/dashboard';
    } else if (role === 'CALON_PENDAFTAR' || role === 'PENDAFTAR') {
      return '/ppdb/dashboard';
    }
    return '/dashboard';
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  // Menutup dropdown ketika pengguna mengklik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ambil inisial nama pengguna
  const userName = user?.nama || user?.name || '';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-700">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
            <School size={22} />
          </div>
          <span>Madrasah</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-emerald-600 transition">Beranda</Link>
          <Link to="/profil" className="hover:text-emerald-600 transition">Profil</Link>
          <Link to="/berita" className="hover:text-emerald-600 transition">Berita</Link>
          <Link to="/galeri" className="hover:text-emerald-600 transition">Galeri</Link>
          <Link to="/kontak" className="hover:text-emerald-600 transition">Kontak</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              {/* Tombol Profil Circle */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 transition shadow-md shadow-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                title={userName}
              >
                {initial || <User size={20} />}
              </button>

              {/* Menu Dropdown Logout */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                    <p className="text-xs text-emerald-600 font-medium capitalize mt-0.5">
                      {user?.role ? String(user.role).toLowerCase() : 'Pengguna'}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      Keluar / Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
            >
              <LogIn size={16} />
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
