import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Tag, ArrowRight, Loader2, Megaphone, FileText } from 'lucide-react';
import { publicService } from '../../services/publicService';

export default function Berita() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState(['Semua', 'Prestasi', 'Kegiatan', 'Tahfidz', 'Pengumuman']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Data fallback berita jika API belum siap
  const dummyNews = [
    {
      id: '1',
      title: 'Siswa Madrasah Raih Medali Emas Olimpiade Sains Nasional 2026',
      category: 'Prestasi',
      date: '12 Okt 2026',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      excerpt: 'Prestasi membanggakan kembali diraih oleh siswa dalam ajang OSN tingkat nasional bidang Matematika dan IPA.',
    },
    {
      id: '2',
      title: 'Kegiatan Peringatan Hari Santri Nasional Berlangsung Khidmat',
      category: 'Kegiatan',
      date: '08 Okt 2026',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      excerpt: 'Seluruh civitas akademika madrasah mengikuti apel bendera dan rangkaian perlombaan keagamaan antar kelas.',
    },
    {
      id: '3',
      title: 'Program Wisuda Tahfidz Qur\'an Angkatan ke-10',
      category: 'Tahfidz',
      date: '01 Okt 2026',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      excerpt: 'Sebanyak 50 santri dan santriwati resmi diwisuda setelah mengkhatamkan hafalan 30 Juz Al-Qur\'an.',
    },
    {
      id: '4',
      title: 'Jadwal Pelaksanaan Ujian Tengah Semester (UTS) Ganjil 2026/2027',
      category: 'Pengumuman',
      date: '25 Sep 2026',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      excerpt: 'Informasi lengkap teknis, tata tertib, dan jadwal mata pelajaran ujian tengah semester untuk seluruh jenjang.',
    },
  ];

  useEffect(() => {
    fetchBerita();
  }, [selectedCategory]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'Semua' ? { kategori: selectedCategory } : {};
      const res = await publicService.getBerita(params);
      if (res.data && res.data.length > 0) {
        setNewsList(res.data);
      } else {
        setNewsList(dummyNews);
      }
    } catch (error) {
      setNewsList(dummyNews);
    } finally {
      setLoading(false);
    }
  };

  // Filter pencarian lokal
  const filteredNews = newsList.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || (item.category || item.kategori?.nama) === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
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
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={news.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'}
                      alt={news.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {news.category || news.kategori?.nama || 'Berita'}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Calendar size={14} />
                      <span>{news.date || new Date(news.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>

                    <h2 className="font-bold text-gray-900 text-base line-clamp-2 hover:text-emerald-600 cursor-pointer transition">
                      {news.title}
                    </h2>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {news.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/berita/${news.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                  >
                    Baca Selengkapnya <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
