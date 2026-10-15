import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Users,
  Calendar,
  ChevronRight,
  Megaphone,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { publicService } from '../../services/publicService';

// Base URL Backend untuk File Static Uploads
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { id: 1, label: 'Siswa Aktif', value: '850+', icon: Users },
    { id: 2, label: 'Guru & Staf', value: '45', icon: Award },
    { id: 3, label: 'Program Unggulan', value: '12', icon: BookOpen },
    { id: 4, label: 'Tahun Berdiri', value: '1998', icon: Calendar },
  ]);
  const [announcements, setAnnouncements] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Ambil Data Utama dari Public Service
      const resData = await publicService.getHomeData();
      const data = resData?.data || resData || {};

      // 1. Set Data Pengumuman
      const rawAnnouncements = data.announcements || data.pengumuman || [];
      if (Array.isArray(rawAnnouncements)) {
        setAnnouncements(rawAnnouncements);
      }

      // 2. Set Data Berita Terbaru
      const rawNews = data.latestNews || data.berita || [];
      if (Array.isArray(rawNews)) {
        setLatestNews(rawNews);
      }

      // 3. Set Data Statistik jika ada dari API
      if (data.stats && Array.isArray(data.stats)) {
        setStats(data.stats);
      }
    } catch (error) {
      console.warn('Gagal memuat data utama dari server API, menggunakan data fallback lokal.', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk Memformat URL Gambar dari Backend
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // Helper Format Tanggal Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/60 text-emerald-100 border border-emerald-400/30 backdrop-blur-sm">
              <Megaphone size={14} /> Selamat Datang di Portal Resmi
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Mewujudkan Generasi <span className="text-emerald-300">Islami & Berprestasi</span>
            </h1>
            <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Mendidik dengan hati, membekali dengan ilmu, berlandaskan akhlakul karimah untuk melahirkan calon pemimpin masa depan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-emerald-900 bg-emerald-300 hover:bg-emerald-200 transition shadow-lg shadow-emerald-950/20"
              >
                Daftar PPDB Online
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/profil"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition"
              >
                Tentang Madrasah
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80"
                alt="Kegiatan Siswa"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">Pendidikan Berkualitas</p>
                  <p className="text-lg font-bold">Kurikulum Terintegrasi Sains & Agama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK RINGKAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon || Users;
            return (
              <div
                key={stat.id || stat.label}
                className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center space-y-2 hover:-translate-y-1 transition"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <IconComponent size={24} />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PENGUMUMAN & KEUNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-4">
                <Megaphone size={18} />
                <span>Pengumuman Terbaru</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-emerald-200 py-4">
                  <Loader2 size={16} className="animate-spin" /> Memuat pengumuman...
                </div>
              ) : announcements.length === 0 ? (
                <p className="text-xs text-emerald-200 py-2">Belum ada pengumuman terbaru.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((item) => (
                    <div key={item.id} className="border-b border-emerald-800 pb-3 last:border-0 last:pb-0">
                      <span className="text-xs text-emerald-300 font-medium">
                        {formatDate(item.createdAt || item.date)}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1 hover:text-emerald-200 cursor-pointer transition line-clamp-2">
                        {item.judul || item.title}
                      </h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/berita"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition"
            >
              Lihat Semua Pengumuman <ChevronRight size={14} />
            </Link>
          </div>

          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Keunggulan Madrasah</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Mengapa Memilih Madrasah Kami?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Program Tahfidz Al-Qur\'an dengan Target Terukur',
                'Integrasi Kurikulum Nasional & Pesantren',
                'Fasilitas Laboratorium Komputer & IPA Modern',
                'Pengembangan Minat & Bakat Ekskul Lengkap',
                'Tenaga Pendidik Tersertifikasi & Berpengalaman',
                'Lingkungan Belajar Asri, Aman, dan Islami',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BERITA TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kabar Madrasah</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Berita & Artikel Terbaru</h2>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            Lihat Berita Lainnya <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500 gap-2 text-sm">
            <Loader2 size={20} className="animate-spin text-emerald-600" /> Memuat berita terbaru...
          </div>
        ) : latestNews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">Belum ada artikel berita yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.slice(0, 3).map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(news.gambar || news.image)}
                    alt={news.judul || news.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow">
                    {news.kategori?.nama || news.category || 'Berita'}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDate(news.createdAt || news.date)}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-1 line-clamp-2 hover:text-emerald-600 cursor-pointer transition">
                      {news.judul || news.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {news.konten ? news.konten.replace(/<[^>]+>/g, '').substring(0, 110) + '...' : news.excerpt}
                    </p>
                  </div>
                  <Link
                    to={`/berita/${news.slug || news.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition pt-2"
                  >
                    Baca Selengkapnya <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. BANNER CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Penerimaan Peserta Didik Baru (PPDB)</h2>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
              Pendaftaran siswa baru tahun ajaran 2027/2028 telah dibuka secara online. Mari bergabung bersama keluarga besar madrasah kami.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 px-8 py-4 bg-white text-emerald-800 font-bold text-sm sm:text-base rounded-2xl hover:bg-emerald-50 transition shadow-lg"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
