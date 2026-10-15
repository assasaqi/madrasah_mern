import React, { useState } from 'react';
import { ZoomIn, Calendar, X, Images } from 'lucide-react';

export default function Galeri() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeMedia, setActiveMedia] = useState(null);

  const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas', 'Ekstrakurikuler'];

  // Data galeri
  const galleryItems = [
    {
      id: 1,
      title: 'Peringatan Hari Santri Nasional 2026',
      category: 'Kegiatan',
      type: 'image',
      date: '22 Okt 2026',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      description: 'Apel bendera dan kirab santri diikuti oleh seluruh siswa dan dewan guru.',
    },
    {
      id: 2,
      title: 'Juara 1 Olimpiade Sains Nasional (OSN)',
      category: 'Prestasi',
      type: 'image',
      date: '15 Okt 2026',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      description: 'Penyerahan piala dan penghargaan siswa berprestasi di tingkat nasional.',
    },
    {
      id: 3,
      title: 'Gedung Laboratorium Komputer Baru',
      category: 'Fasilitas',
      type: 'image',
      date: '05 Sep 2026',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      description: 'Fasilitas komputer modern pendukung asesmen dan pembelajaran berbasis IT.',
    },
    {
      id: 4,
      title: 'Latihan Rutin Pramuka & Tapak Suci',
      category: 'Ekstrakurikuler',
      type: 'image',
      date: '28 Agu 2026',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      description: 'Kegiatan pembentukan karakter dan kedisiplinan siswa melalui ekskul wajib.',
    },
    {
      id: 5,
      title: 'Wisuda Tahfidz Al-Qur\'an Angkatan X',
      category: 'Kegiatan',
      type: 'image',
      date: '10 Jun 2026',
      url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
      description: 'Prosesi wisuda dan uji publik hafalan santri khatam 30 juz.',
    },
    {
      id: 6,
      title: 'Perpustakaan & Ruang Baca Digital',
      category: 'Fasilitas',
      type: 'image',
      date: '12 Mei 2026',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      description: 'Area belajar nyaman dilengkapi dengan akses koleksi e-book.',
    },
  ];

  // Filter items berdasarkan kategori
  const filteredItems = selectedCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  // Indikator Ringkas Ticker Bar
  const stats = [
    { label: 'Total Foto', value: `${galleryItems.length} Dokumentasi` },
    { label: 'Kategori', value: `${categories.length - 1} Sektor` },
    { label: 'Update Terakhir', value: 'Oktober 2026' },
    { label: 'Kualitas Media', value: 'High Definition' }
  ];

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* 1. TOP BANNER HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              Etalase & Dokumentasi
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Galeri Kegiatan Madrasah
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Merekam setiap momen berharga, prestasi, sarana prasarana, serta ragam kegiatan civitas akademika madrasah.
            </p>
          </div>
          <div className="shrink-0 z-10 hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Images size={32} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & INDIKATOR TICKER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center overflow-x-auto gap-4 text-xs font-semibold scrollbar-none shadow-xs">
          <div className="bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold uppercase shrink-0">
            ARSIP DOKUMENTASI
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

      {/* 3. FILTER NAVIGASI KATEGORI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium hidden sm:block shrink-0 pr-2">
            Menampilkan {filteredItems.length} Item
          </span>
        </div>

        {/* 4. GRID KARTU GALERI (2 card di Mobile & 5 card di Laptop) */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMedia(item)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between shrink-0 w-[calc(50%-6px)] sm:w-auto snap-start"
            >
              <div>
                <div className="relative h-40 sm:h-44 lg:h-36 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Overlay Zoom */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 text-emerald-800 flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition">
                      <ZoomIn size={16} />
                    </div>
                  </div>

                  {/* Badge Kategori */}
                  <span className="absolute top-2 left-2 bg-emerald-800/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs line-clamp-1">
                    {item.category}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 font-medium">
                    <Calendar size={12} className="text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{item.date}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-xs group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MODAL PREVIEW LIGHTBOX */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0">
            {/* Tombol Tutup */}
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Gambar Pratinjau */}
            <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeMedia.url}
                alt={activeMedia.title}
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>

            {/* Detail Media */}
            <div className="p-5 space-y-2 bg-white">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {activeMedia.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">{activeMedia.date}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">{activeMedia.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{activeMedia.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
