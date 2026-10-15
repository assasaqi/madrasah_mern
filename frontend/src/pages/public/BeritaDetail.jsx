import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, User, ArrowLeft, Loader2, Tag,
  Share2, Clock, ChevronRight
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import api from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BeritaDetail() {
  const { id, slug } = useParams();
  const newsIdentifier = slug || id;

  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (newsIdentifier) {
      fetchDetailAndRelated();
    }
  }, [newsIdentifier]);

  const fetchDetailAndRelated = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      let detail = null;

      // 1. Coba ambil dari Endpoint Detail Publik
      try {
        const resData = await publicService.getBeritaDetail(newsIdentifier);
        detail = resData?.data || resData?.berita || (resData?.judul ? resData : null);
      } catch (err) {
        console.warn('Endpoint direct detail 404, mencoba pencarian dari list berita...');
      }

      // 2. Fallback: Ambil dari daftar berita jika endpoint direct 404
      const allBeritaRes = await publicService.getBerita();
      const list = allBeritaRes?.data || allBeritaRes || [];

      if (!detail && Array.isArray(list)) {
        detail = list.find(
          (item) => String(item.slug) === String(newsIdentifier) || String(item.id) === String(newsIdentifier)
        );
      }

      if (detail && (detail.judul || detail.title)) {
        setNews(detail);

        // Filter berita terkait untuk sidebar
        if (Array.isArray(list)) {
          const filtered = list.filter(
            (item) => String(item.id) !== String(detail.id) && item.slug !== detail.slug
          );
          setRelatedNews(filtered.slice(0, 5));
        }
      } else {
        setNews(null);
        setErrorMsg('Artikel tidak ditemukan.');
      }
    } catch (error) {
      console.error('Gagal memuat detail berita:', error);
      setErrorMsg(error?.response?.data?.message || 'Artikel tidak ditemukan.');
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath.replace(/^\/uploads\//, '')}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.judul || 'Berita Madrasah',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berita berhasil disalin ke clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-emerald-600 gap-3 font-sans">
        <Loader2 className="animate-spin" size={32} />
        <span className="text-xs font-semibold tracking-wide text-gray-500">Memuat berita lengkap...</span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center space-y-4 font-sans">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Tag size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Artikel Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500">{errorMsg || 'Artikel yang Anda cari mungkin telah dihapus atau belum dipublikasikan.'}</p>
        <div className="pt-2">
          <Link to="/berita" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-200">
            <ArrowLeft size={16} /> Kembali ke Portal Berita
          </Link>
        </div>
      </div>
    );
  }

  const title = news.judul || news.title;
  const category = news.kategori?.nama || news.kategori?.name || news.category || 'Berita Utama';
  const authorName = news.author?.email ? news.author.email.split('@')[0] : (news.author || 'Admin Madrasah');
  const publishDate = formatDate(news.createdAt || news.date);
  const imageUrl = getImageUrl(news.gambar || news.image);
  const contentText = news.konten || news.content || '';

  const wordCount = contentText.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-gray-50/60 min-h-screen font-sans pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/" className="hover:text-emerald-600 transition">Beranda</Link>
            <ChevronRight size={12} />
            <Link to="/berita" className="hover:text-emerald-600 transition">Berita</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">{title}</span>
          </div>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <Share2 size={14} /> Bagikan
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <article className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-lg">
                  {category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium ml-auto">
                  <Clock size={12} /> {readTime} min baca
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-snug tracking-tight">
                {title}
              </h1>

              <div className="flex items-center justify-between border-y border-gray-100 py-3 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs uppercase">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 capitalize">{authorName}</p>
                    <p className="text-[10px] text-gray-400">Penulis Artikel</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <Calendar size={14} className="text-emerald-600" />
                  <span>{publishDate}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
              <img
                src={imageUrl}
                alt={title}
                className="w-full max-h-[460px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="prose prose-emerald max-w-none text-gray-800 leading-relaxed text-sm sm:text-base space-y-4 pt-2">
              {contentText.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: contentText }} />
              ) : (
                contentText.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="mb-4 text-justify leading-7 text-gray-700">
                      {paragraph}
                    </p>
                  )
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                Diterbitkan pada portal resmi madrasah.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                >
                  <Share2 size={14} /> Bagikan Artikel
                </button>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 border-b pb-3 flex items-center justify-between">
                <span>Berita Terkait & Terbaru</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </h3>

              {relatedNews.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {relatedNews.map((item) => {
                    const itemImg = item.gambar
                      ? `${API_BASE_URL}/uploads/${item.gambar.replace(/^\/uploads\//, '')}`
                      : 'https://via.placeholder.com/150';

                    return (
                      <Link
                        key={item.id}
                        to={`/berita/${item.slug || item.id}`}
                        className="py-3 flex items-start gap-3 group block transition"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={itemImg}
                            alt={item.judul}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {item.kategori?.nama || 'Berita'}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-2 mt-1 transition">
                            {item.judul}
                          </h4>
                          <span className="text-[10px] text-gray-400 mt-0.5 block">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada berita terkait lainnya.</p>
              )}

              <div className="pt-2 border-t">
                <Link
                  to="/berita"
                  className="w-full text-center inline-block py-2 bg-gray-50 hover:bg-gray-100 text-emerald-700 font-bold text-xs rounded-xl transition"
                >
                  Lihat Semua Berita
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-6 rounded-3xl text-white space-y-3 shadow-md">
              <h4 className="font-bold text-sm">Informasi Madrasah</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Dapatkan update pengumuman dan berita kegiatan belajar mengajar langsung melalui portal resmi.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
