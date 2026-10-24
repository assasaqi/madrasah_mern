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

// Base URL Backend untuk File Static Uploads
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [combinedList, setCombinedList] = useState([]);
  const sliderRef = useRef(null);

  // Memuat data beranda saat komponen dipasang
  useEffect(() => {
    fetchHomeData();
  }, []);

  // Memuat dan menggabungkan data berita serta pengumuman secara terpusat
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const homeData = await publicService.getHomeData();

      const rawNews = homeData?.latestNews || homeData?.berita || [];
      const rawAnnouncements = homeData?.announcements || homeData?.pengumuman || [];

      // Format Data Berita
      const formattedNews = (Array.isArray(rawNews) ? rawNews : []).map((item) => ({
        ...item,
        type: 'berita',
        categoryName: item.kategori?.nama || 'Berita',
        targetUrl: `/berita/${item.slug || item.id}`
      }));

      // Format Data Pengumuman
      const formattedPengumuman = (Array.isArray(rawAnnouncements) ? rawAnnouncements : []).map((item) => ({
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

  // Helper Pemformatan URL Gambar
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
    const cleanPath = imagePath.replace(/^\/?(uploads\/)?/, '');
    return `${API_BASE_URL}/uploads/${cleanPath}`;
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
      {/* Top Banner Header */}
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
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition shadow cursor-pointer"
            >
              Daftar PPDB
            </Link>
            <Link
              to="/profil"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs border border-white/20 transition cursor-pointer"
            >
              Profil Madrasah
            </Link>
          </div>
        </div>
      </section>

      {/* Poster Vertikal Slider */}
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

        <div className="relative group">
          <button
            onClick={() => scrollSlider('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 transition cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={sliderRef}
            className="flex items-center gap-3 overflow-x-auto scroll-smooth pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {loading ? (
              <div className="w-full flex justify-center py-12 text-emerald-600 text-xs gap-2">
                <Loader2 className="animate-spin" size={18} /> Memuat konten...
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
                    <img
                      src={getImageUrl(item)}
                      alt={title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <span
                      className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs ${
                        isPengumuman ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                    >
                      {item.categoryName}
                    </span>

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

          <button
            onClick={() => scrollSlider('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 transition cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Keunggulan Madrasah */}
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
