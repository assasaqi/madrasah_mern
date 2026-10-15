import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Calendar, ChevronRight, Search, FileText } from 'lucide-react';
import { pengumumanService } from '../../services/pengumumanService';

export default function Pengumuman() {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDataPengumuman();
  }, []);

  const fetchDataPengumuman = async () => {
    try {
      setLoading(true);
      // Memanggil API melalui pengumumanService
      const data = await pengumumanService.getAll();
      setPengumumanList(data?.data || data || []);
    } catch (error) {
      console.error('Gagal mengambil data pengumuman:', error);
      setPengumumanList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPengumuman = pengumumanList.filter((item) =>
    item.judul?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-700 rounded-2xl mb-3 shadow-sm">
            <Megaphone size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pengumuman Resmi
          </h1>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Informasi penting, edaran, dan pengumuman resmi dari Madrasah.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition"
          />
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredPengumuman.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">Belum ada pengumuman yang ditayangkan.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPengumuman.map((item) => (
              <Link
                key={item.id || item._id}
                to={`/pengumuman/${item.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
                    <Calendar size={13} />
                    <span>
                      {new Date(item.createdAt || item.tanggal || Date.now()).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition line-clamp-1">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.ringkasan || item.isi?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                  </p>
                </div>

                <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition shrink-0">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
