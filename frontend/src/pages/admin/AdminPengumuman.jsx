import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Edit, Calendar, Loader2, X, FileText, CheckCircle, XCircle, Eye, ExternalLink, Download } from 'lucide-react';
import api from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPengumuman() {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    isPublished: true,
  });
  const [lampiran, setLampiran] = useState(null);

  // Ambil data pengumuman saat komponen pertama kali dimuat
  useEffect(() => {
    fetchPengumuman();
  }, []);

  // Memuat daftar pengumuman resmi dari API backend
  const fetchPengumuman = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/cms/pengumuman');
      setPengumumanList(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Gagal memuat pengumuman:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mereset nilai masukan formulir ke kondisi awal
  const resetForm = () => {
    setFormData({ judul: '', konten: '', isPublished: true });
    setLampiran(null);
    setEditId(null);
  };

  // Membuka modal untuk pembuatan pengumuman baru
  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Membuka modal untuk penyuntingan pengumuman terpilih
  const handleOpenEditModal = (item) => {
    setEditId(item.id);
    setFormData({
      judul: item.judul || '',
      konten: item.konten || '',
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
    });
    setLampiran(null);
    setShowModal(true);
  };

  // Menampilkan berkas lampiran dokumen dalam jendela pratinjau
  const handleViewFile = (fileName, title) => {
    const fileUrl = fileName.startsWith('http')
      ? fileName
      : `${API_BASE_URL}/uploads/${fileName.replace(/^\/uploads\//, '')}`;
    const isPdf = fileName.toLowerCase().endsWith('.pdf');

    setPreviewFile({
      url: fileUrl,
      title: title || 'Lampiran Pengumuman',
      isPdf
    });
  };

  // Mengirimkan formulir pengumuman baru atau pembaruan ke API backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append('judul', formData.judul);
      payload.append('konten', formData.konten);
      payload.append('isPublished', formData.isPublished);

      if (lampiran instanceof File) {
        payload.append('lampiran', lampiran);
      }

      if (editId) {
        await api.put(`/admin/cms/pengumuman/${editId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Pengumuman berhasil diperbarui!');
      } else {
        await api.post('/admin/cms/pengumuman', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Pengumuman berhasil diterbitkan!');
      }

      setShowModal(false);
      resetForm();
      fetchPengumuman();
    } catch (err) {
      console.error('Gagal menyimpan pengumuman:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      alert(isTechError || !serverMsg ? 'Gagal menyimpan pengumuman. Terjadi kendala sistem pada server.' : serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Menghapus item pengumuman berdasarkan ID
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    try {
      await api.delete(`/admin/cms/pengumuman/${id}`);
      setPengumumanList((prev) => prev.filter((p) => p.id !== id));
      alert('Pengumuman berhasil dihapus.');
    } catch (err) {
      console.error('Gagal menghapus pengumuman:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      alert(isTechError || !serverMsg ? 'Gagal menghapus pengumuman. Terjadi kendala pada server.' : serverMsg);
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* Header Halaman */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="text-emerald-600" size={24} /> Pengumuman Resmi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola papan pengumuman singkat yang tampil pada halaman utama madrasah.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Buat Pengumuman
        </button>
      </div>

      {/* Grid Pengumuman */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-emerald-600 flex justify-center items-center gap-2 text-xs">
            <Loader2 className="animate-spin" size={18} /> Memuat pengumuman...
          </div>
        ) : pengumumanList.length > 0 ? (
          pengumumanList.map((item) => {
            const fileName = item.fileLampiran || item.lampiran || item.file || item.fileUrl;
            const fileFullUrl = fileName
              ? (fileName.startsWith('http') ? fileName : `${API_BASE_URL}/uploads/${fileName.replace(/^\/uploads\//, '')}`)
              : null;

            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start gap-4 hover:border-emerald-200 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                      <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    {item.isPublished ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                        <CheckCircle size={10} /> Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                        <XCircle size={10} /> Draf
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm">{item.judul}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{item.konten}</p>

                  {/* Tombol Berkas Lampiran */}
                  {fileName && (
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewFile(fileName, item.judul)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl text-[11px] font-semibold transition cursor-pointer"
                      >
                        <Eye size={14} /> Lihat Berkas
                      </button>
                      <a
                        href={fileFullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 font-semibold hover:underline"
                      >
                        <ExternalLink size={12} /> Buka Tab Baru
                      </a>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                    title="Edit Pengumuman"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 text-xs">
            Belum ada pengumuman resmi.
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-gray-900">
                {editId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Pembukaan PPDB TA 2027/2028"
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detail Pengumuman</label>
                <textarea
                  rows={4}
                  required
                  value={formData.konten}
                  onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                  placeholder="Isi rincian pengumuman..."
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Lampiran (PDF / Gambar) - Opsional
                </label>
                <input
                  type="file"
                  onChange={(e) => setLampiran(e.target.files[0])}
                  className="w-full text-xs text-gray-500 border border-gray-200 rounded-xl p-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isPublished" className="font-semibold text-gray-700 cursor-pointer">
                  Terbitkan Pengumuman Ini
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  {editId ? 'Simpan Perubahan' : 'Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Berkas / Lampiran */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <FileText className="text-emerald-600" size={20} />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">
                    {previewFile.title}
                  </h3>
                  <p className="text-[11px] text-gray-400">Preview Lampiran Dokumen</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                  title="Unduh / Buka File"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 p-4 overflow-auto flex items-center justify-center">
              {previewFile.isPdf ? (
                <iframe
                  src={previewFile.url}
                  title="PDF Preview"
                  className="w-full h-full rounded-2xl border-0 shadow-inner bg-white"
                />
              ) : (
                <img
                  src={previewFile.url}
                  alt={previewFile.title}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
