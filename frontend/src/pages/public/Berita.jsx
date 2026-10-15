import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Loader2, FileText, Megaphone, Newspaper } from 'lucide-react';
import { publicService } from '../../services/publicService';
import { pengumumanService } from '../../services/pengumumanService';

// Base URL Backend untuk gambar statis
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Berita() {
  const [combinedList, setCombinedList] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Indikator Ringkas
  const stats = [
    { label: 'Total Informasi', value: combinedList.length ? `${combinedList.length} Konten` : '-' },
    { label: 'Update Terakhir', value: 'Hari Ini' },
    { label: 'Kategori Publik', value: `${categories.length} Topik` },
    { label: 'Akses Informasi', value: 'Terbuka / Publik' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [selectedCategory]);

  // Ambil Daftar Kategori dari Backend
  const fetchInitialData = async () => {
    try {
      if (publicService.getKategori && typeof publicService.getKategori === 'function') {
        const resCat = await publicService.getKategori();
        const rawCategories = resCat?.data || resCat || [];
        if (Array.isArray(rawCategories) && rawCategories.length > 0) {
          const catNames = rawCategories.map((c) => c.nama || c.name || c);
          const hasPengumuman = catNames.some((c) => c.toLowerCase() === 'pengumuman');
          setCategories(['Semua', ...catNames, ...(hasPengumuman ? [] : ['Pengumuman'])]);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat kategori dari API, menggunakan daftar default:', err);
      setCategories(['Semua', 'Kegiatan Madrasah', 'Pendidikan & Akademik', 'Pengumuman', 'Prestasi']);
    }
  };

  // Fetch Gabungan: Berita + Pengumuman
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Berita
      const params = selectedCategory !== 'Semua' && selectedCategory !== 'Pengumuman'
        ? { kategori: selectedCategory }
        : {};

      const resBerita = await publicService.getBerita(params);
      const rawBerita = resBerita?.data || resBerita || [];

      // Transformasi Data Berita
      const formattedBerita = (Array.isArray(rawBerita) ? rawBerita : []).map((item) => ({
        ...item,
        type: 'berita',
        categoryName: item.kategori?.nama || item.category || 'Berita',
        targetUrl: `/berita/${item.slug || item.id}`
      }));

      // 2. Fetch Pengumuman
      let formattedPengumuman = [];
      try {
        const resPengumuman = await pengumumanService.getAll();
        const rawPengumuman = resPengumuman?.data || resPengumuman || [];

        formattedPengumuman = (Array.isArray(rawPengumuman) ? rawPengumuman : []).map((item) => ({
          ...item,
          type: 'pengumuman',
          categoryName: 'Pengumuman',
          targetUrl: `/pengumuman/${item.slug || item.id}`
        }));
      } catch (pErr) {
        console.error('Gagal memuat pengumuman:', pErr);
      }

      // 3. Gabungkan Data & Urutkan Berdasarkan Tanggal Terbaru
      const merged = [...formattedBerita, ...formattedPengumuman].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.tanggal || 0);
        const dateB = new Date(b.createdAt || b.tanggal || 0);
        return dateB - dateA;
      });

      setCombinedList(merged);
    } catch (error) {
      console.error('Gagal memuat data gabungan berita & pengumuman:', error);
      setCombinedList([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper URL Gambar
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

  // Helper Format Tanggal
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

  // Helper Clean HTML Tags
  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]+>/g, '').trim();
  };

  // Filter Lokal Berdasarkan Kategori & Pencarian
  const filteredData = combinedList.filter((item) => {
    const itemCat = item.categoryName || 'Berita';
    const matchesCategory =
      selectedCategory === 'Semua' ||
      itemCat.toLowerCase() === selectedCategory.toLowerCase();

    const title = (item.judul || item.title || '').toLowerCase();
    const content = stripHtml(item.konten || item.isi || item.excerpt || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = title.includes(q) || content.includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* 1. TOP BANNER HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              Kabar & Pengumuman
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pusat Informasi Madrasah
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Dapatkan berita terbaru seputar agenda, prestasi siswa, pengumuman resmi, dan beragam kegiatan akademik di lingkungan madrasah.
            </p>
          </div>
          <div className="shrink-0 z-10 hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Newspaper size={32} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & INDIKATOR TICKER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center overflow-x-auto gap-4 text-xs font-semibold scrollbar-none shadow-xs">
          <div className="bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold uppercase shrink-0">
            KABAR TERKINI
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

      {/* 3. FILTER & SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-xs">

          {/* Pilihan Kategori */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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

          {/* Form Pencarian */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="Cari berita atau pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
          </div>
        </div>

        {/* 4. GRID KARTU GABUNGAN BERITA & PENGUMUMAN (2 card Mobile, 5 card Laptop) */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-700 gap-2 font-medium text-xs">
            <Loader2 className="animate-spin" size={18} /> Memuat data berita & pengumuman...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 space-y-3 shadow-xs">
            <FileText size={40} className="mx-auto text-gray-300" />
            <h3 className="text-base font-bold text-gray-800">Informasi Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none">
            {filteredData.map((item) => {
              const itemTitle = item.judul || item.title;
              const itemContent = stripHtml(item.konten || item.isi || item.excerpt);
              const itemCategory = item.categoryName;
              const itemImage = getImageUrl(item);
              const itemDate = formatDate(item.createdAt || item.tanggal);
              const isPengumuman = item.type === 'pengumuman';

              return (
                <article
                  key={`${item.type}-${item.id || item._id || item.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between shrink-0 w-[calc(50%-6px)] sm:w-auto snap-start"
                >
                  <div>
                    <div className="relative h-40 sm:h-44 lg:h-36 w-full overflow-hidden bg-gray-100">
                      <img
                        src={itemImage}
                        alt={itemTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {/* Dark Gradient Bawah Image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                      {/* Badge Kategori */}
                      <span
                        className={`absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs flex items-center gap-1 line-clamp-1 ${
                          isPengumuman ? 'bg-amber-600/90' : 'bg-emerald-800/90'
                        }`}
                      >
                        {isPengumuman && <Megaphone size={10} />}
                        {itemCategory}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 font-medium">
                        <Calendar size={12} className="text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{itemDate}</span>
                      </div>

                      <h2 className="font-bold text-gray-900 text-xs group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                        <Link to={item.targetUrl}>{itemTitle}</Link>
                      </h2>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {itemContent}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 pt-0">
                    <Link
                      to={item.targetUrl}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold transition ${
                        isPengumuman ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-700 hover:text-emerald-800'
                      }`}
                    >
                      <span>{isPengumuman ? 'Pengumuman' : 'Baca Detail'}</span>
                      <ArrowRight size={12} />
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
