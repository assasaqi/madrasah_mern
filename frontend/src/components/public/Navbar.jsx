import React from 'react';
import { Link } from 'react-router-dom';
import { School, LogIn } from 'lucide-react';

export default function Navbar() {
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
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
          >
            <LogIn size={16} />
            Masuk / PPDB
          </Link>
        </div>
      </div>
    </header>
  );
}
