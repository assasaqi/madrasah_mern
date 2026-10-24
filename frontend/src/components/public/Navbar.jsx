import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, LogIn, LayoutDashboard, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menentukan rute dashboard berdasarkan peran pengguna
  const getDashboardPath = () => {
    const role = String(user?.role || '').toUpperCase().trim();
    if (['ADMIN', 'SUPERADMIN', 'OPERATOR'].includes(role)) return '/admin/dashboard';
    if (role === 'GURU') return '/guru/dashboard';
    if (['CALON_PENDAFTAR', 'PENDAFTAR'].includes(role)) return '/ppdb/dashboard';
    return '/dashboard';
  };

  // Memproses logout dan navigasi ke beranda
  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  // Menutup dropdown saat klik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.nama || user?.name || 'Pengguna';
  const initial = userName.charAt(0).toUpperCase();
  const photoPath = user?.foto || user?.avatar || user?.image;
  const photoUrl = photoPath
    ? (photoPath.startsWith('http') ? photoPath : `${API_BASE_URL}/uploads/${photoPath.replace(/^\/uploads\//, '')}`)
    : null;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 font-sans">
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
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 transition shadow-md shadow-emerald-200 overflow-hidden cursor-pointer border-2 border-emerald-100"
                title={userName}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                  />
                ) : (
                  initial || <User size={20} />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                    <p className="text-xs text-emerald-600 font-medium capitalize mt-0.5">
                      {user?.role ? String(user.role).toLowerCase().replace('_', ' ') : 'Pengguna'}
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
