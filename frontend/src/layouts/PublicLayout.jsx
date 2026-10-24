import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { School, Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '../components/public/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Navbar Komponen Terpisah */}
      <Navbar />

      {/* Konten Utama */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-100 pt-12 pb-8 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <School size={24} />
              <span>Madrasah Digital</span>
            </div>
            <p className="text-sm text-emerald-200 leading-relaxed">
              Mewujudkan generasi terpelajar, berakhlak mulia, dan unggul dalam prestasi akademik maupun non-akademik.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li><Link to="/profil" className="hover:underline">Visi & Misi</Link></li>
              <li><Link to="/berita" className="hover:underline">Pengumuman Terbaru</Link></li>
              <li><Link to="/register" className="hover:underline">Pendaftaran PPDB Online</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Kontak Madrasah</h4>
            <ul className="space-y-2.5 text-sm text-emerald-200">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>Jl. Pendidikan No. 123, Kota Madrasah</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="shrink-0" />
                <span>(021) 555-0192</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="shrink-0" />
                <span>info@madrasah.sch.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-emerald-800 text-center text-xs text-emerald-300">
          © {new Date().getFullYear()} Portal Informasi Madrasah. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
