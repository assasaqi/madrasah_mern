import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { pengumumanService } from '../../services/pengumumanService';

// Base URL Backend untuk File Static Uploads
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [combinedList, setCombinedList] = useState([]);
  const sliderRef = useRef(null);

  // Indikator Ringkas
  const stats = [
    { label: 'Siswa Aktif', value: '850+' },
    { label: 'Guru & Staf', value: '45' },
    { label: 'Program Unggulan', value: '12' },
    { label: 'Tahun Berdiri', value: '1998' },
    { label: 'Akreditasi', value: 'A (Unggul)' }
  ];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Berita Terbaru
      let newsData = [];
      try {
        const resBerita = await publicService.getBerita();
        newsData = resBerita?.data || resBerita || [];
      } catch (err) {
        console.warn('Gagal memuat berita:', err);
      }

      // 2. Fetch Pengumuman Terbaru
      let pengumumanData = [];
      try {
        const resPengumuman = await pengumumanService.getAll();
        pengumumanData = resPengumuman?.data || resPengumuman || [];
      } catch (err) {
        console.warn('Gagal memuat pengumuman:', err);
      }

      // Format Data Berita
      const formattedNews = (Array.isArray(newsData) ? newsData : []).map((item) => ({
        ...item,
        type: 'berita',
        categoryName: item.kategori?.nama || 'Berita',
        targetUrl: `/berita/${item.slug || item.id}`
      }));

      // Format Data Pengumuman
      const formattedPengumuman = (Array.isArray(pengumumanData) ? pengumumanData : []).map((item) => ({
        ...item,
        type: 'pengumuman',
        categoryName: 'Pengumuman',
        targetUrl: `/pengumuman/${item.slug || item.id}`
      }));

      // Gabungkan & Urutkan Berdasarkan Tanggal
      const merged = [...formattedNews, ...formattedPengumuman].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.tanggal || 0);
        const dateB = new Date(b.createdAt || b.tanggal || 0);
        return dateB - dateA;
      });

      setCombinedList(merged);
    } catch (error) {
      console.error('Error fetchHomeData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper Gambar
  const getImageUrl = (item) => {
    if (item.type === 'pengumuman') {
      return 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80';
    }
    const imagePath = item.gambar || item.image;
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // Fungsi Navigasi Slider Panah Kiri/Kanan
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* 1. TOP BANNER HEADER (Sesuai Banner Kemenag di Gambar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              Portal Layanan Resmi Madrasah
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Yuk, Manfaatkan Layanan Digital Madrasah!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Pendaftaran PPDB Online, Informasi Akademik, serta Pengumuman Resmi kini hadir lebih cepat dan mudah diakses.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              to="/register"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition shadow"
            >
              Daftar PPDB
            </Link>
            <Link
              to="/profil"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs border border-white/20 transition"
            >
              Profil Madrasah
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS & INDIKATOR BAR (Sesuai Baris Indeks Keagamaan) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center overflow-x-auto gap-4 text-xs font-semibold scrollbar-none shadow-xs">
          <div className="bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold uppercase shrink-0">
            STATISTIK MADRASAH
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

      {/* 3. POSTER VERTIKAL SLIDER (Sesuai Tampilan Poster Gambar 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Sepekan Berita & Pengumuman</h2>
          </div>
          <Link to="/berita" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {/* Container Carousel poster vertikal dengan Navigasi Panah Kiri-Kanan */}
        <div className="relative group">
          {/* Tombol Panah Kiri */}
          <button
            onClick={() => scrollSlider('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 transition cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          {/* List Poster Card Horizontal Scroll */}
          <div
            ref={sliderRef}
            className="flex items-center gap-3 overflow-x-auto scroll-smooth pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {loading ? (
              <div className="w-full flex justify-center py-12 text-emerald-600 text-xs gap-2">
                <Loader2 className="animate-spin" size={18} /> Memuat poster berita...
              </div>
            ) : combinedList.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-400 text-xs">Belum ada konten dipublikasikan.</div>
            ) : (
              combinedList.map((item) => {
                const title = item.judul || item.title;
                const isPengumuman = item.type === 'pengumuman';

                return (
                  <Link
                    key={`${item.type}-${item.id || item._id || item.slug}`}
                    to={item.targetUrl}
                    className="shrink-0 w-36 sm:w-44 lg:w-48 h-64 sm:h-72 rounded-xl overflow-hidden relative group/card shadow-sm hover:shadow-xl transition-all duration-300 snap-start border border-gray-100"
                  >
                    {/* Gambar Full Poster Vertikal */}
                    <img
                      src={getImageUrl(item)}
                      alt={title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />

                    {/* Dark Overlay Gradient Bawah */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Badge Tipe di Atas Kiri */}
                    <span
                      className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs ${
                        isPengumuman ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                    >
                      {item.categoryName}
                    </span>

                    {/* Judul & Detail Teks di Bawah Poster */}
                    <div className="absolute bottom-0 inset-x-0 p-3 text-white space-y-1">
                      <h3 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug group-hover/card:text-emerald-300 transition-colors">
                        {title}
                      </h3>
                      <p className="text-[10px] text-gray-300">
                        {new Date(item.createdAt || item.tanggal || Date.now()).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Tombol Panah Kanan */}
          <button
            onClick={() => scrollSlider('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 transition cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* 4. KEUNGGULAN MADRASAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Keunggulan Utama</span>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">Mengapa Memilih Madrasah Kami?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Program Tahfidz Al-Qur\'an dengan Target Terukur',
              'Integrasi Kurikulum Nasional & Pesantren',
              'Fasilitas Laboratorium Komputer & IPA Modern',
              'Pengembangan Minat & Bakat Ekskul Lengkap',
              'Tenaga Pendidik Tersertifikasi & Berpengalaman',
              'Lingkungan Belajar Asri, Aman, dan Islami'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2.5 p-2.5 bg-emerald-50/50 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
