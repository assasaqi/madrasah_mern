import React, { useRef, useEffect, useState, useContext } from 'react';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar({ setSidebarOpen, getPageTitle }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ambil state & fungsi logout langsung dari AuthContext
  const { user, logout } = useContext(AuthContext);

  // Menutup dropdown profil saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Eksekusi fungsi logout terpusat AuthContext
  const handleAdminLogout = async () => {
    setProfileDropdownOpen(false);
    await logout();
    window.location.href = '/login';
  };

  const photoPath = user?.foto || user?.avatar || user?.image;
  const photoUrl = photoPath
    ? (photoPath.startsWith('http') ? photoPath : `${API_BASE_URL}/uploads/${photoPath.replace(/^\/uploads\//, '')}`)
    : null;

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-bold text-sm sm:text-base text-gray-900">
          {getPageTitle()}
        </h2>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-gray-100 transition cursor-pointer border border-transparent hover:border-gray-200"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={user?.nama || 'Admin'}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; }}
              />
            ) : (
              <User className="text-emerald-700" size={16} />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {user?.nama || 'Admin Madrasah'}
            </p>
            <p className="text-[10px] text-gray-400 capitalize">
              {user?.role ? String(user.role).toLowerCase().replace('_', ' ') : 'Administrator'}
            </p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {profileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg py-1.5 z-50">
            <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
              <p className="text-xs font-bold text-gray-900">{user?.nama || 'Admin Madrasah'}</p>
            </div>
            <button
              onClick={handleAdminLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
