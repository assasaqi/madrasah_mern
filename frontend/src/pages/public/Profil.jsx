import React, { useState } from 'react';
import {
  Building2,
  Target,
  History,
  Users,
  CheckCircle2,
  BookOpen,
  Award,
  Monitor,
  Library,
  Compass,
  Sparkles
} from 'lucide-react';

export default function Profil() {
  const [activeTab, setActiveTab] = useState('visi-misi');

  // Data Fasilitas Madrasah
  const facilities = [
    {
      id: 1,
      title: 'Ruang Kelas Ber-AC & LCD',
      icon: Building2,
      description: 'Kelas nyaman dilengkapi pendingin udara, proyektor LCD, dan papan tulis interaktif.',
    },
    {
      id: 2,
      title: 'Laboratorium Komputer & CBT',
      icon: Monitor,
      description: 'Puluhan unit komputer spesifikasi tinggi untuk pembelajaran IT dan ujian berbasis komputer.',
    },
    {
      id: 3,
      title: 'Perpustakaan Digital',
      icon: Library,
      description: 'Koleksi ribuan buku fisik dan e-book dengan sistem peminjaman terintegrasi.',
    },
    {
      id: 4,
      title: 'Laboratorium Sains (IPA)',
      icon: Compass,
      description: 'Peralatan praktikum Fisika, Kimia, dan Biologi yang lengkap dan aman.',
    },
    {
      id: 5,
      title: 'Masjid & Pusat Tahfidz',
      icon: Sparkles,
      description: 'Masjid luas dua lantai sebagai pusat sholat berjamaah, pembinaan karakter, dan kegiatan Tahfidz.',
    },
    {
      id: 6,
      title: 'Lapangan Olahraga Multi-fungsi',
      icon: Award,
      description: 'Fasilitas olahraga mencakup lapangan basket, futsal, voli, dan bulu tangkis.',
    },
  ];

  // Data Struktur Organisasi / Pimpinan
  const leaders = [
    {
      role: 'Kepala Madrasah',
      name: 'Dr. H. Ahmad Dahlan, M.Pd.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    },
    {
      role: 'Waka Kurikulum',
      name: 'Ustadz Muhammad Ridwan, S.Ag.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      role: 'Waka Kesiswaan',
      name: 'Dra. Hj. Siti Aminah, M.S.I.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      role: 'Waka Sarana & Prasarana',
      name: 'Ustadz Faisal Basri, S.T.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* 1. HEADER HERO PROFIL */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/60 text-emerald-100 border border-emerald-400/30">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Profil Madrasah</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat visi, misi, sejarah perjalanan, serta fasilitas pendukung pembelajaran di madrasah kami.
          </p>
        </div>
      </section>

      {/* 2. TAB NAVIGASI SEKSI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto py-2">
            {[
              { id: 'visi-misi', label: 'Visi & Misi', icon: Target },
              { id: 'sejarah', label: 'Sejarah Singkat', icon: History },
              { id: 'organisasi', label: 'Struktur Organisasi', icon: Users },
              { id: 'fasilitas', label: 'Fasilitas', icon: Building2 },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. KONTEN SEKSI DASAR TAB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEKSI: VISI & MISI */}
        {activeTab === 'visi-misi' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Visi */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200 mb-2">
                <Target size={24} />
              </span>
              <h2 className="text-2xl font-bold text-gray-900">Visi Madrasah</h2>
              <p className="text-lg sm:text-xl font-medium text-emerald-900 max-w-3xl mx-auto italic leading-relaxed">
                "Terwujudnya Generasi Qur’ani yang Unggul dalam Prestasi Akademik, Berakhlak Mulia, dan Menguasai Teknologi Informasi."
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <BookOpen size={24} className="text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Misi Madrasah</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Menyelenggarakan pendidikan agama Islam berbasis Al-Qur\'an dan Sunnah secara mendalam.',
                  'Mengembangkan kurikulum akademik terintegrasi dengan sains dan teknologi modern.',
                  'Membimbing dan memfasilitasi program Tahfidz Al-Qur\'an secara intensif.',
                  'Menerapkan budaya berakhlakul karimah dalam kehidupan sehari-hari di lingkungan madrasah.',
                  'Menyelenggarakan kegiatan ekstrakurikuler yang beragam untuk menggali minat dan bakat siswa.',
                  'Membangun kemitraan sinergis antara madrasah, orang tua, dan masyarakat luas.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-gray-50/60 rounded-xl">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SEKSI: SEJARAH SINGKAT */}
        {activeTab === 'sejarah' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <History size={24} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Sejarah Pendirian</h2>
            </div>
            <div className="prose prose-emerald max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Madrasah ini didirikan pada tahun <strong>1998</strong> atas prakarsa para tokoh agama dan cendekiawan muslim daerah setempat yang bercita-cita menyediakan wadah pendidikan Islam terpadu berkualitas tinggi.
              </p>
              <p>
                Berawal dari bangunan sederhana dengan 3 ruang kelas dan 45 siswa, madrasah terus berkembang pesat seiring tingginya kepercayaan masyarakat. Pada tahun 2010, madrasah berhasil meraih Akreditasi "A" (Unggul) dari Badan Akreditasi Nasional Sekolah/Madrasah.
              </p>
              <p>
                Kini, madrasah telah membina lebih dari 800 siswa dengan fasilitas sarana dan prasarana modern, serta lulusan yang tersebar di berbagai perguruan tinggi negeri maupun luar negeri.
              </p>
            </div>
          </div>
        )}

        {/* SEKSI: STRUKTUR ORGANISASI */}
        {activeTab === 'organisasi' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Pimpinan & Jajaran Pengelola</h2>
              <p className="text-sm text-gray-600">Tenaga pendidik dan pengelola struktural madrasah.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {leaders.map((leader, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition space-y-3">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-emerald-500 shadow"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{leader.name}</h3>
                    <p className="text-xs font-medium text-emerald-600 mt-0.5">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKSI: FASILITAS */}
        {activeTab === 'fasilitas' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Sarana & Prasarana</h2>
              <p className="text-sm text-gray-600">Fasilitas pendukung kegiatan belajar mengajar dan pengembangan bakat siswa.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {facilities.map((facility) => {
                const IconComp = facility.icon;
                return (
                  <div key={facility.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:-translate-y-1 transition">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <IconComp size={22} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{facility.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{facility.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
