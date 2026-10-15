import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Loader2, FileText } from 'lucide-react';
import { publicService } from '../../services/publicService';

// URL Base Backend untuk gambar statis
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Berita() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBerita();
  }, [selectedCategory]);

  // Ambil Daftar Kategori & Data Awal
  const fetchInitialData = async () => {
    try {
      if (publicService.getKategori && typeof publicService.getKategori === 'function') {
        const resCat = await publicService.getKategori();
        const rawCategories = resCat?.data || resCat || [];
        if (Array.isArray(rawCategories) && rawCategories.length > 0) {
          const catNames = rawCategories.map((c) => c.nama || c.name || c);
          setCategories(['Semua', ...catNames]);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat kategori dari API, menggunakan kategori default:', err);
      setCategories(['Semua', 'Prestasi', 'Kegiatan', 'Tahfidz', 'Pengumuman']);
    }
  };

  // Ambil Daftar Berita dari Server API
  const fetchBerita = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'Semua' ? { kategori: selectedCategory } : {};
      const res = await publicService.getBerita(params);

      const rawData = res?.data || res || [];
      if (Array.isArray(rawData)) {
        setNewsList(rawData);
      } else {
        setNewsList([]);
      }
    } catch (error) {
      console.error('Gagal memuat berita dari API:', error);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper Formatter URL Gambar dari Backend
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
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper Membersihkan HTML Tag dari Konten
  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]+>/g, '').trim();
  };

  // Filter Pencarian Lokal
  const filteredNews = newsList.filter((item) => {
    const itemCategory = item.kategori?.nama || item.category || 'Berita';
    const matchesCategory = selectedCategory === 'Semua' || itemCategory.toLowerCase() === selectedCategory.toLowerCase();

    const title = (item.judul || item.title || '').toLowerCase();
    const content = stripHtml(item.konten || item.excerpt || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = title.includes(q) || content.includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/60 text-emerald-100 border border-emerald-400/30">
            Kabar Madrasah
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Berita & Pengumuman</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Dapatkan informasi terbaru seputar agenda, prestasi, pengumuman resmi, dan kegiatan madrasah.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          {/* Pilihan Kategori */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Form Pencarian */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Daftar Kartu Berita */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600 gap-2 font-medium text-sm">
            <Loader2 className="animate-spin" size={20} /> Memuat artikel berita...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 space-y-3">
            <FileText size={48} className="mx-auto text-gray-300" />
            <h3 className="text-lg font-bold text-gray-800">Artikel Tidak Ditemukan</h3>
            <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => {
              const newsTitle = news.judul || news.title;
              const newsContent = stripHtml(news.konten || news.excerpt);
              const newsCategory = news.kategori?.nama || news.category || 'Berita';
              const newsImage = getImageUrl(news.gambar || news.image);
              const newsDate = formatDate(news.createdAt || news.date);

              return (
                <article
                  key={news.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={newsImage}
                        alt={newsTitle}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow">
                        {newsCategory}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <Calendar size={14} />
                        <span>{newsDate}</span>
                      </div>

                      <h2 className="font-bold text-gray-900 text-base line-clamp-2 hover:text-emerald-600 cursor-pointer transition">
                        {newsTitle}
                      </h2>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {newsContent}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      to={`/berita/${news.slug || news.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                    >
                      Baca Selengkapnya <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
