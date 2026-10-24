import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Megaphone,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPendaftar: 0,
    ditinjau: 0,
    lulusAdmin: 0,
    lulusFinal: 0,
    tidakLulus: 0,
    totalBerita: 0,
    totalPengumuman: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Ambil data statistik dashboard saat komponen pertama kali dipasang
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Memuat seluruh data statistik sistem dari API backend secara paralel
  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const [ppdbRes, beritaRes, pengumumanRes] = await Promise.allSettled([
        api.get('/admin/ppdb'),
        api.get('/admin/cms/berita'),
        api.get('/admin/cms/pengumuman')
      ]);

      const ppdbData = ppdbRes.status === 'fulfilled' ? (ppdbRes.value.data?.data || ppdbRes.value.data || []) : [];
      const beritaData = beritaRes.status === 'fulfilled' ? (beritaRes.value.data?.data || beritaRes.value.data || []) : [];
      const pengumumanData = pengumumanRes.status === 'fulfilled' ? (pengumumanRes.value.data?.data || pengumumanRes.value.data || []) : [];

      const pendaftarList = Array.isArray(ppdbData) ? ppdbData : [];

      setStats({
        totalPendaftar: pendaftarList.length,
        ditinjau: pendaftarList.filter(i => String(i.status || 'DITINJAU').toUpperCase() === 'DITINJAU').length,
        lulusAdmin: pendaftarList.filter(i => String(i.status).toUpperCase() === 'LULUS_ADMINISTRASI').length,
        lulusFinal: pendaftarList.filter(i => String(i.status).toUpperCase() === 'LULUS_FINAL').length,
        tidakLulus: pendaftarList.filter(i => String(i.status).toUpperCase() === 'TIDAK_LULUS').length,
        totalBerita: Array.isArray(beritaData) ? beritaData.length : 0,
        totalPengumuman: Array.isArray(pengumumanData) ? pengumumanData.length : 0
      });
    } catch (err) {
      console.error('Gagal mengambil data statistik dashboard:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <h1 className="text-xl font-bold text-gray-900">Ringkasan Sistem Informasi</h1>
        <p className="text-xs text-gray-500 mt-1">
          Pantau statistik pendaftaran PPDB online dan konten publik madrasah secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Pendaftar</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              {loadingStats ? '...' : `${stats.totalPendaftar} Siswa`}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600">Perlu Ditinjau</p>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">
              {loadingStats ? '...' : `${stats.ditinjau} Siswa`}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600">Lulus Administrasi</p>
            <p className="text-2xl font-extrabold text-emerald-900 mt-1">
              {loadingStats ? '...' : `${stats.lulusAdmin} Siswa`}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600">Lulus Final</p>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">
              {loadingStats ? '...' : `${stats.lulusFinal} Siswa`}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-500">Tidak Lulus</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {loadingStats ? '...' : `${stats.tidakLulus} Siswa`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Berita CMS</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {loadingStats ? '...' : `${stats.totalBerita} Artikel`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Pengumuman</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {loadingStats ? '...' : `${stats.totalPengumuman} Pengumuman`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Megaphone size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
