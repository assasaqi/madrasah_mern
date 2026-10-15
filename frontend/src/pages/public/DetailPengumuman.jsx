import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Download, Check } from 'lucide-react';
import { pengumumanService } from '../../services/pengumumanService';

export default function DetailPengumuman() {
  const { slug } = useParams();
  const [pengumuman, setPengumuman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await pengumumanService.getBySlug(slug);
      setPengumuman(data?.data || data);
    } catch (error) {
      console.error('Gagal memuat detail pengumuman:', error);
      setPengumuman(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!pengumuman) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengumuman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Pengumuman yang Anda cari mungkin telah dihapus atau diubah.</p>
        <Link
          to="/pengumuman"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Pengumuman
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Navigasi Kembali & Bagikan */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/pengumuman"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition shadow-sm cursor-pointer"
            title="Bagikan Pengumuman"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-600">Tautan Disalin!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>

        {/* Card Detail */}
        <article className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-lg mb-4">
            <Calendar size={14} />
            <span>
              {new Date(pengumuman.createdAt || pengumuman.tanggal || Date.now()).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-6">
            {pengumuman.judul}
          </h1>

          <div className="border-t border-gray-100 pt-6">
            {/* Render HTML / Konten Teks */}
            <div
              className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: pengumuman.isi }}
            />
          </div>

          {/* Lampiran File jika ada */}
          {(pengumuman.fileUrl || pengumuman.lampiran) && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Dokumen / Lampiran Resmi
              </h3>
              <a
                href={pengumuman.fileUrl || pengumuman.lampiran}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition border border-emerald-200"
              >
                <Download size={16} />
                <span>Unduh Lampiran Pengumuman</span>
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
