import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Share2, Loader2, Bookmark } from 'lucide-react';
import { publicService } from '../../services/publicService';

export default function BeritaDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data fallback detail
  const fallbackDetail = {
    id: id,
    title: 'Siswa Madrasah Raih Medali Emas Olimpiade Sains Nasional 2026',
    category: 'Prestasi',
    author: 'Humas Madrasah',
    date: '12 Oktober 2026',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    content: `
      <p>Kabar membanggakan kembali datang dari civitas akademika madrasah. Ahmad Fauzi, siswa kelas XI MIPA, berhasil menyumbangkan medali emas dalam ajang Olimpiade Sains Nasional (OSN) 2026 tingkat nasional yang diselenggarakan di Jakarta.</p>

      <p>Kompetisi tahunan yang diikuti oleh ribuan peserta dari seluruh Indonesia ini berlangsung ketat. Ahmad tampil unggul dalam bidang studi Matematika setelah melalui babak penyisihan teori dan pemecahan masalah sains terpadu.</p>

      <h3>Dukungan Penuh Madrasah</h3>
      <p>Kepala Madrasah menyampaikan apresiasi yang setinggi-tingginya atas pencapaian ini. "Prestasi ini merupakan bukti nyata dari komitmen madrasah dalam memadukan keunggulan akademik dengan nilai-nilai keislaman. Kami akan terus mendukung potensi para siswa di semua bidang," ujarnya.</p>

      <p>Atas raihan ini, Ahmad berhak mendapatkan beasiswa pendidikan penuh dan pembinaan intensif untuk persiapan olimpiade tingkat internasional mendatang.</p>
    `,
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await publicService.getBeritaDetail(id);
      if (res) {
        setNews(res);
      } else {
        setNews(fallbackDetail);
      }
    } catch (error) {
      setNews(fallbackDetail);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-emerald-600 gap-2">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-sm font-medium">Memuat artikel...</span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Artikel Tidak Ditemukan</h2>
        <Link to="/berita" className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm">
          <ArrowLeft size={16} /> Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

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
          <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-lg">
            {news.category || news.kategori?.nama || 'Berita'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 border-y border-gray-100 py-3">
            <div className="flex items-center gap-1.5">
              <User size={16} className="text-emerald-600" />
              <span>{news.author || 'Admin Madrasah'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-emerald-600" />
              <span>{news.date || new Date(news.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Gambar Utama Artikel */}
        <div className="rounded-3xl overflow-hidden shadow-md">
          <img
            src={news.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'}
            alt={news.title}
            className="w-full h-80 sm:h-[420px] object-cover"
          />
        </div>

        {/* Isi Teks Artikel */}
        <div
          className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: news.content || news.konten }}
        />
      </div>
    </div>
  );
}
