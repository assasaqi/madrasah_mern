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
  Sparkles,
  Award as AwardIcon
} from 'lucide-react';

export default function Profil() {
  const [activeTab, setActiveTab] = useState('visi-misi');

  // Indikator Ringkas Profil Madrasah
  const stats = [
    { label: 'Tahun Berdiri', value: '1998' },
    { label: 'Akreditasi', value: 'A (Unggul)' },
    { label: 'Siswa Terbina', value: '850+' },
    { label: 'Tenaga Pendidik', value: '45 Guru' },
    { label: 'Luas Area', value: '1.5 Hektar' }
  ];

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
    <div className="space-y-8 pb-16 font-sans">

      {/* 1. TOP BANNER HEADER PROFIL (Senada dengan Home Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              Tentang Kami
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Profil & Identitas Madrasah
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Mengenal lebih dekat visi, misi, sejarah perjalanan, jajaran pengelola, serta sarana prasarana pendukung pembelajaran di madrasah kami.
            </p>
          </div>
          <div className="shrink-0 z-10 hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Building2 size={32} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & INDIKATOR TICKER BAR (Senada dengan Home Indeks Bar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center overflow-x-auto gap-4 text-xs font-semibold scrollbar-none shadow-xs">
          <div className="bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold uppercase shrink-0">
            SEKILAS PROFIL
          </div>
          <div className="flex items-center gap-6 divide-x divide-gray-200 shrink-0">
            {stats.map((stat, idx) => (
              <div key={idx} className="pl-6 first:pl-2 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-gray-500 font-medium">{stat.label}</span>
                <span className="text-emerald-700 font-extrabold text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TAB NAVIGASI SEKSI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-xl p-1.5 shadow-xs">
          <nav className="flex space-x-2 overflow-x-auto">
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
                  className={`flex items-center gap-2 py-2.5 px-4 font-bold text-xs sm:text-sm rounded-lg whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. KONTEN TAB PROFIL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SEKSI: VISI & MISI */}
        {activeTab === 'visi-misi' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Visi */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-100 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-xs mb-1">
                <Target size={20} />
              </span>
              <h2 className="text-xl font-extrabold text-gray-900">Visi Madrasah</h2>
              <p className="text-base sm:text-lg font-semibold text-emerald-900 max-w-3xl mx-auto italic leading-relaxed">
                "Terwujudnya Generasi Qur’ani yang Unggul dalam Prestasi Akademik, Berakhlak Mulia, dan Menguasai Teknologi Informasi."
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <BookOpen size={20} className="text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-900">Misi Madrasah</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Menyelenggarakan pendidikan agama Islam berbasis Al-Qur\'an dan Sunnah secara mendalam.',
                  'Mengembangkan kurikulum akademik terintegrasi dengan sains dan teknologi modern.',
                  'Membimbing dan memfasilitasi program Tahfidz Al-Qur\'an secara intensif.',
                  'Menerapkan budaya berakhlakul karimah dalam kehidupan sehari-hari di lingkungan madrasah.',
                  'Menyelenggarakan kegiatan ekstrakurikuler yang beragam untuk menggali minat dan bakat siswa.',
                  'Membangun kemitraan sinergis antara madrasah, orang tua, dan masyarakat luas.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 p-3 bg-emerald-50/40 rounded-xl border border-emerald-50">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SEKSI: SEJARAH SINGKAT */}
        {activeTab === 'sejarah' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <History size={20} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Sejarah Pendirian</h2>
            </div>
            <div className="text-gray-700 text-xs sm:text-sm leading-relaxed space-y-3">
              <p>
                Madrasah ini didirikan pada tahun <strong className="text-emerald-800">1998</strong> atas prakarsa para tokoh agama dan cendekiawan muslim daerah setempat yang bercita-cita menyediakan wadah pendidikan Islam terpadu berkualitas tinggi.
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
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pimpinan & Jajaran Pengelola</h2>
                <p className="text-xs text-gray-500">Tenaga pendidik dan pengelola struktural madrasah.</p>
              </div>
            </div>

            {/* Layout Poster Vertikal (Scroll Mobile, 10 Kolom di Laptop) */}
            <div className="flex lg:grid lg:grid-cols-10 gap-3 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-none">
              {leaders.map((leader, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col shrink-0 w-[calc(50%-6px)] lg:w-auto snap-start"
                >
                  {/* Container Foto Penuh */}
                  <div className="relative h-44 sm:h-48 lg:h-40 w-full overflow-hidden bg-gray-100">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark Gradient Overlay Bawah */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Badge Jabatan Melayang */}
                    <span className="absolute top-2 left-2 bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs line-clamp-1">
                      {leader.role}
                    </span>
                  </div>

                  {/* Area Nama & Detail */}
                  <div className="p-2 sm:p-2.5 text-center bg-white flex-1 flex flex-col justify-center border-t border-gray-50">
                    <h3 className="font-bold text-gray-900 text-xs group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {leader.name}
                    </h3>
                    <p className="text-[10px] font-medium text-emerald-600 mt-0.5 line-clamp-1">
                      {leader.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKSI: FASILITAS */}
        {activeTab === 'fasilitas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Sarana & Prasarana</h2>
                <p className="text-xs text-gray-500">Fasilitas pendukung kegiatan belajar mengajar dan pengembangan bakat siswa.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {facilities.map((facility) => {
                const IconComp = facility.icon;
                return (
                  <div key={facility.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2.5 hover:-translate-y-0.5 transition duration-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <IconComp size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{facility.title}</h3>
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
