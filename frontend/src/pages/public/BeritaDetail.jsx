import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { publicService } from '../../services/publicService';
import api from '../../services/api'; // Direct API fallback

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BeritaDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      let resData = null;

      // 1. Coba panggil via publicService
      if (publicService && typeof publicService.getBeritaDetail === 'function') {
        resData = await publicService.getBeritaDetail(id);
      } else if (publicService && typeof publicService.getBeritaById === 'function') {
        resData = await publicService.getBeritaById(id);
      } else if (publicService && typeof publicService.getBeritaBySlug === 'function') {
        resData = await publicService.getBeritaBySlug(id);
      } else {
        // 2. Direct Fallback via Axios API instance
        const response = await api.get(`/public/berita/${id}`);
        resData = response?.data;
      }

      // Normalisasi pembungkus data { success: true, data: { ... } }
      const detail = resData?.data || resData || null;

      if (detail && (detail.judul || detail.title)) {
        setNews(detail);
      } else {
        setNews(null);
      }
    } catch (error) {
      console.error('Gagal memuat detail berita:', error);
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper Formatter URL Gambar dari Backend Express
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80';
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-emerald-600 gap-2 font-medium text-sm">
        <Loader2 className="animate-spin" size={24} />
        <span>Memuat artikel berita...</span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Artikel Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">Artikel yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
        <div className="pt-2">
          <Link to="/berita" className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:underline">
            <ArrowLeft size={16} /> Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  // Extract & Normalize Data Field
  const title = news.judul || news.title;
  const category = news.kategori?.nama || news.category || 'Berita';
  const authorName = news.author?.email ? news.author.email.split('@')[0] : (news.author || 'Admin Madrasah');
  const publishDate = formatDate(news.createdAt || news.date);
  const imageUrl = getImageUrl(news.gambar || news.image);
  const contentHtml = news.konten || news.content || '<p>Tidak ada konten artikel.</p>';

  return (
    <div className="pb-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Tombol Kembali */}
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl transition"
        >
          <ArrowLeft size={16} /> Kembali ke Berita
        </Link>

        {/* Judul & Meta Informasi */}
        <div className="space-y-4">
          <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
            {category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 border-y border-gray-100 py-3">
            <div className="flex items-center gap-1.5 capitalize">
              <User size={16} className="text-emerald-600" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-emerald-600" />
              <span>{publishDate}</span>
            </div>
          </div>
        </div>

        {/* Gambar Utama Artikel */}
        <div className="rounded-3xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-80 sm:h-[420px] object-cover"
          />
        </div>

        {/* Isi Teks Artikel */}
        <div
          className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
