import React, { useState } from 'react';
import { Image as ImageIcon, Video, X, ZoomIn, Calendar, Tag, Filter } from 'lucide-react';

export default function Galeri() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeMedia, setActiveMedia] = useState(null); // State untuk modal preview

  const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas', 'Ekstrakurikuler'];

  // Data galeri (Foto & Video)
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

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/60 text-emerald-100 border border-emerald-400/30">
            Etalase Madrasah
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Galeri & Dokumentasi</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Merekam setiap momen berharga, prestasi, dan ragam kegiatan civitas akademika madrasah.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Kategori Navigasi */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Kartu Galeri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMedia(item)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-emerald-800 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">
                    <ZoomIn size={22} />
                  </div>
                </div>
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium pt-2 border-t border-gray-100">
                  <Calendar size={13} />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MODAL PREVIEW / LIGHTBOX */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0">
            {/* Tombol Tutup */}
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
            >
              <X size={20} />
            </button>

            {/* Gambar Pratinjau */}
            <div className="max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeMedia.url}
                alt={activeMedia.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {/* Informasi Rincian Media */}
            <div className="p-6 space-y-2 bg-white">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                  {activeMedia.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">{activeMedia.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{activeMedia.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{activeMedia.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
