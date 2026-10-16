import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Loader2,
  Eye,
  Check,
  X,
  AlertCircle,
  FileText,
  RefreshCw,
  Award,
  RotateCcw,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import { ppdbService } from '../../services/ppdbService';

export default function AdminPPDB({ hideHeader = false }) {
  const navigate = useNavigate();
  const [pendaftarList, setPendaftarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPendaftar, setSelectedPendaftar] = useState(null);
  const [catatanVerifikator, setCatatanVerifikator] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendaftar();
  }, []);

  const fetchPendaftar = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      let response;
      if (ppdbService && typeof ppdbService.getAllPendaftar === 'function') {
        response = await ppdbService.getAllPendaftar();
      } else if (ppdbService && typeof ppdbService.getAdminPPDB === 'function') {
        response = await ppdbService.getAdminPPDB();
      } else {
        response = await api.get('/admin/ppdb');
      }

      const resData = response?.data !== undefined ? response.data : response;

      let rawList = [];
      if (Array.isArray(resData)) {
        rawList = resData;
      } else if (Array.isArray(resData?.data)) {
        rawList = resData.data;
      } else if (Array.isArray(resData?.data?.pendaftar)) {
        rawList = resData.data.pendaftar;
      } else if (Array.isArray(resData?.pendaftar)) {
        rawList = resData.pendaftar;
      } else if (Array.isArray(resData?.result)) {
        rawList = resData.result;
      }

      setPendaftarList(rawList);
    } catch (err) {
      console.error('Gagal memuat data pendaftar:', err);
      const message = err?.response?.data?.message || err?.message || 'Gagal terhubung ke server API.';
      setErrorMsg(message);
      setPendaftarList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);
      const payload = {
        status: newStatus,
        catatan: catatanVerifikator
      };

      if (ppdbService && typeof ppdbService.updateStatus === 'function') {
        await ppdbService.updateStatus(id, newStatus, catatanVerifikator);
      } else {
        await api.put(`/admin/ppdb/${id}/status`, payload);
      }

      await fetchPendaftar();
      setSelectedPendaftar(null);
      setCatatanVerifikator('');
    } catch (err) {
      console.error('Gagal memperbarui status:', err);
      alert(err?.response?.data?.message || 'Gagal memperbarui status pendaftaran.');
    } finally {
      setActionLoading(false);
    }
  };

  const getField = (item, paths, fallback = '-') => {
    for (const path of paths) {
      const keys = path.split('.');
      let val = item;
      for (const k of keys) {
        val = val?.[k];
      }
      if (val !== undefined && val !== null && val !== '') {
        return val;
      }
    }
    return fallback;
  };

  const formatFileUrl = (path) => {
    if (!path || path === '#') return '#';
    return path.startsWith('http') ? path : `http://localhost:5000/uploads/${path}`;
  };

  const filteredPendaftar = (Array.isArray(pendaftarList) ? pendaftarList : []).filter((item) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const itemStatus = String(item.status || 'DITINJAU').toUpperCase();

    if (statusFilter !== 'ALL' && itemStatus !== statusFilter) {
      return false;
    }

    if (!q) return true;

    const nama = getField(item, ['biodata.namaLengkap', 'namaLengkap', 'nama_lengkap', 'nama'], '').toLowerCase();
    const noPendaftaran = getField(item, ['nomorPendaftaran', 'noPendaftaran', 'no_pendaftaran'], '').toLowerCase();
    const asalSekolah = getField(item, ['biodata.asalSekolah', 'asalSekolah', 'asal_sekolah'], '').toLowerCase();

    return nama.includes(q) || noPendaftaran.includes(q) || asalSekolah.includes(q);
  });

  // Hitung statistik
  const stats = {
    total: pendaftarList.length,
    ditinjau: pendaftarList.filter(i => String(i.status || 'DITINJAU').toUpperCase() === 'DITINJAU').length,
    lulusAdmin: pendaftarList.filter(i => String(i.status).toUpperCase() === 'LULUS_ADMINISTRASI').length,
    lulusFinal: pendaftarList.filter(i => String(i.status).toUpperCase() === 'LULUS_FINAL').length,
    ditolak: pendaftarList.filter(i => String(i.status).toUpperCase() === 'TIDAK_LULUS').length,
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    switch (s) {
      case 'LULUS_ADMINISTRASI':
      case 'LULUS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} /> Lulus Administrasi
          </span>
        );
      case 'LULUS_FINAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Award size={12} /> Lulus Final
          </span>
        );
      case 'TIDAK_LULUS':
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertCircle size={12} /> Tidak Lulus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={12} /> Ditinjau
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center text-emerald-600 gap-2 font-sans">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-xs font-semibold">Memuat data verifikasi admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {!hideHeader && (
        <header className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Users size={22} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm sm:text-base">Verifikasi & Panitia PPDB</h1>
              <p className="text-xs text-gray-500">Kelola verifikasi berkas dan penentuan kelulusan calon siswa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPendaftar}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition cursor-pointer"
              title="Muat ulang data"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </header>
      )}

      {/* Ringkasan Kartu Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[11px] font-semibold text-gray-400">Total Pendaftar</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{stats.total} Siswa</p>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/60 shadow-xs">
          <p className="text-[11px] font-semibold text-amber-700">Perlu Ditinjau</p>
          <p className="text-lg font-bold text-amber-900 mt-0.5">{stats.ditinjau} Siswa</p>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-700">Lulus Administrasi</p>
          <p className="text-lg font-bold text-emerald-900 mt-0.5">{stats.lulusAdmin} Siswa</p>
        </div>
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-700">Lulus Final</p>
          <p className="text-lg font-bold text-blue-900 mt-0.5">{stats.lulusFinal} Siswa</p>
        </div>
      </div>

      {/* Bar Filter & Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama, asal sekolah, atau nomor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <button
              onClick={fetchPendaftar}
              className="p-2 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={14} />
            </button>
            <span>
              Total: <strong className="text-emerald-700">{filteredPendaftar.length} / {pendaftarList.length} Siswa</strong>
            </span>
          </div>
        </div>

        {/* Tab Filter Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-400 text-[11px] font-semibold flex items-center gap-1 pr-2">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'DITINJAU', label: 'Ditinjau' },
            { id: 'LULUS_ADMINISTRASI', label: 'Lulus Administrasi' },
            { id: 'LULUS_FINAL', label: 'Lulus Final' },
            { id: 'TIDAK_LULUS', label: 'Tidak Lulus' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Daftar Pendaftar */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">No. Pendaftaran</th>
                <th className="py-3.5 px-6">Nama Lengkap</th>
                <th className="py-3.5 px-6">Asal Sekolah</th>
                <th className="py-3.5 px-6">Status Seleksi</th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPendaftar.length > 0 ? (
                filteredPendaftar.map((item, idx) => {
                  const id = item.id || idx;
                  const noPendaftaran = getField(item, ['nomorPendaftaran', 'noPendaftaran', 'no_pendaftaran']);
                  const namaLengkap = getField(item, ['biodata.namaLengkap', 'namaLengkap', 'nama_lengkap', 'nama']);
                  const asalSekolah = getField(item, ['biodata.asalSekolah', 'asalSekolah', 'asal_sekolah']);

                  return (
                    <tr key={id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-semibold text-emerald-700">{noPendaftaran}</td>
                      <td className="py-4 px-6 font-bold text-gray-900">{namaLengkap}</td>
                      <td className="py-4 px-6 text-gray-600">{asalSekolah}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-4 px-6 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPendaftar(item);
                            setCatatanVerifikator(item.catatan || '');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl transition cursor-pointer"
                        >
                          <Eye size={14} /> Detail & Verifikasi
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 text-gray-300" size={32} />
                    <p className="font-medium text-xs">Belum ada data pendaftar yang sesuai filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Verifikasi & Penetapan Status */}
      {selectedPendaftar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Verifikasi & Penetapan Status Kelulusan</h3>
                <p className="text-xs text-gray-500">Tinjau kelengkapan berkas dan tentukan kelulusan siswa</p>
              </div>
              <button
                onClick={() => setSelectedPendaftar(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-600">Status Seleksi Saat Ini:</span>
                {getStatusBadge(selectedPendaftar.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block font-medium">No. Pendaftaran</span>
                  <strong className="text-gray-800 text-sm">
                    {getField(selectedPendaftar, ['nomorPendaftaran', 'noPendaftaran', 'no_pendaftaran'])}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Nama Lengkap</span>
                  <strong className="text-gray-800 text-sm">
                    {getField(selectedPendaftar, ['biodata.namaLengkap', 'namaLengkap', 'nama_lengkap', 'nama'])}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">NIK / NISN</span>
                  <strong className="text-gray-800">
                    {getField(selectedPendaftar, ['biodata.nik', 'nik'])} / {getField(selectedPendaftar, ['biodata.nisn', 'nisn'])}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Asal Sekolah</span>
                  <strong className="text-gray-800">
                    {getField(selectedPendaftar, ['biodata.asalSekolah', 'asalSekolah', 'asal_sekolah'])}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Nama Ayah / Ibu</span>
                  <strong className="text-gray-800">
                    {getField(selectedPendaftar, ['orangTua.namaAyah', 'namaAyah'])} / {getField(selectedPendaftar, ['orangTua.namaIbu', 'namaIbu'])}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">No. WhatsApp Wali</span>
                  <strong className="text-emerald-700">
                    {getField(selectedPendaftar, ['orangTua.noHpAyah', 'orangTua.noHpIbu', 'noHpAyah', 'noWhatsapp'])}
                  </strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2.5">Dokumen Persyaratan:</h4>
                <div className="space-y-2">
                  {(() => {
                    const docs = selectedPendaftar.dokumen || selectedPendaftar.documents || [];
                    if (Array.isArray(docs) && docs.length > 0) {
                      return docs.map((doc, dIdx) => {
                        const labelMap = {
                          KARTU_KELUARGA: 'Kartu Keluarga (KK)',
                          AKTA_KELAHIRAN: 'Akta Kelahiran',
                          PAS_FOTO: 'Pas Foto 3x4'
                        };
                        const jenis = doc.jenisDokumen || doc.jenis || doc.type || '';
                        const docName = labelMap[jenis] || jenis || 'Dokumen Persyaratan';
                        const fileLink = formatFileUrl(doc.fileUrl || doc.filePath || doc.url);

                        return (
                          <div key={doc.id || dIdx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                            <span className="font-semibold text-gray-700">{docName}</span>
                            {fileLink && fileLink !== '#' ? (
                              <a
                                href={fileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 hover:underline font-bold text-xs"
                              >
                                Lihat Dokumen ↗
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">File tidak ditemukan</span>
                            )}
                          </div>
                        );
                      });
                    }
                    return (
                      <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-center">
                        Pendaftar belum mengunggah dokumen berkas persyaratan.
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Input Catatan Verifikator */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Catatan Verifikator (Opsional / Alasan Penolakan):
                </label>
                <textarea
                  value={catatanVerifikator}
                  onChange={(e) => setCatatanVerifikator(e.target.value)}
                  placeholder="Contoh: Berkas Pas Foto belum sesuai kriteria, mohon unggah ulang..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={2}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Ubah Status Kelulusan Pendaftar:
              </p>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedPendaftar.id, 'DITINJAU')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition flex items-center gap-1.5 text-xs disabled:opacity-50 cursor-pointer"
                >
                  <RotateCcw size={14} /> Reset Ditinjau
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedPendaftar.id, 'TIDAK_LULUS')}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition flex items-center gap-1.5 text-xs disabled:opacity-50 cursor-pointer"
                >
                  <X size={14} /> Tidak Lulus
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedPendaftar.id, 'LULUS_ADMINISTRASI')}
                  className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition flex items-center gap-1.5 text-xs disabled:opacity-50 cursor-pointer"
                >
                  <Check size={14} /> Lulus Administrasi
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedPendaftar.id, 'LULUS_FINAL')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 text-xs shadow-md shadow-blue-200 disabled:opacity-50 cursor-pointer"
                >
                  <Award size={14} /> Tetapkan LULUS FINAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
