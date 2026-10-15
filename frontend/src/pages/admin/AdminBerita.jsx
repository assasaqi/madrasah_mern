import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Trash2,
  Loader2, X, RefreshCw, AlertCircle
} from 'lucide-react';
import { beritaService } from '../../services/beritaService';

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State Form Tambah Berita (Presisi dengan Prisma Schema & Controller)
  const [formData, setFormData] = useState({
    judul: '',
    kategoriId: '',
    konten: '',
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBerita();
    fetchKategori();
  }, []);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await beritaService.getAllBerita();
      setBeritaList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat berita:', err);
      const msg = err?.response?.data?.message || err?.message || 'Gagal terhubung ke server API.';
      setErrorMsg(msg);
      setBeritaList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const data = await beritaService.getKategoriList();
      setKategoriList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat kategori berita:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await beritaService.createBerita({
        judul: formData.judul,
        konten: formData.konten,
        kategoriId: formData.kategoriId,
        isPublished: formData.isPublished,
        imageFile: imageFile
      });

      alert('Berita berhasil ditambahkan!');
      setShowModal(false);
      setFormData({ judul: '', kategoriId: '', konten: '', isPublished: true });
      setImageFile(null);
      fetchBerita();
    } catch (err) {
      console.error('Gagal menyimpan berita:', err);
      const errorText = err?.response?.data?.message || err?.message || 'Gagal menambah berita. Periksa koneksi atau inputan Anda.';
      alert(`Error: ${errorText}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      await beritaService.deleteBerita(id);
      setBeritaList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Gagal menghapus berita:', err);
      alert(err?.response?.data?.message || 'Gagal menghapus berita.');
    }
  };

  // Helper pencarian aman & fleksibel
  const filteredBerita = (Array.isArray(beritaList) ? beritaList : []).filter((item) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;

    const judul = String(item?.judul || item?.title || '').toLowerCase();
    const katNama = String(item?.kategori?.nama || item?.category || '').toLowerCase();
    const konten = String(item?.konten || item?.content || '').toLowerCase();

    return judul.includes(q) || katNama.includes(q) || konten.includes(q);
  });

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center text-emerald-600 gap-2 font-sans">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-xs font-semibold">Memuat data berita admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* Header Halaman */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-emerald-600" size={24} /> Kelola Berita & Artikel
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Buat, sunting, dan publikasikan artikel berita madrasah ke portal publik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBerita}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-200 cursor-pointer"
          >
            <Plus size={16} /> Buat Artikel Baru
          </button>
        </div>
      </div>

      {/* Banner Error */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span><strong>Gagal memuat data:</strong> {errorMsg}</span>
          </div>
          <button onClick={fetchBerita} className="underline font-bold hover:text-red-900 cursor-pointer">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Bar Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari judul berita, isi, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          Total: <strong className="text-emerald-700">{filteredBerita.length} Artikel</strong>
        </span>
      </div>

      {/* Tabel Berita */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Gambar</th>
                <th className="py-3.5 px-6">Judul Berita</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBerita.length > 0 ? (
                filteredBerita.map((item, idx) => {
                  const id = item.id || idx;
                  const rawGambar = item.gambar || item.imageUrl;
                  const gambarUrl = rawGambar
                    ? (rawGambar.startsWith('http') ? rawGambar : `http://localhost:5000/uploads/${rawGambar.replace(/^\/uploads\//, '')}`)
                    : 'https://via.placeholder.com/150';

                  const isTerbit = item.isPublished ?? item.published ?? true;

                  return (
                    <tr key={id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                          <img
                            src={gambarUrl}
                            alt={item.judul || item.title || 'Berita'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 max-w-xs">
                        <p className="font-bold text-gray-900 line-clamp-1">{item.judul || item.title || '-'}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.konten || item.content || '-'}</p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                          {item.kategori?.nama || item.category || 'Umum'}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isTerbit ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isTerbit ? 'Terbit' : 'Draf'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Hapus Berita"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 text-gray-300" size={32} />
                    <p className="font-medium text-xs">Belum ada artikel berita yang sesuai filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah Berita */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">Buat Berita Baru</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Judul Berita</label>
                <input
                  type="text"
                  name="judul"
                  required
                  value={formData.judul}
                  onChange={handleInputChange}
                  placeholder="Contoh: Siswa Madrasah Meraih Juara 1 OSN 2026"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori</label>
                  <select
                    name="kategoriId"
                    value={formData.kategoriId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {kategoriList.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Foto Header</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Isi Artikel Lengkap</label>
                <textarea
                  name="konten"
                  rows={6}
                  required
                  value={formData.konten}
                  onChange={handleInputChange}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isPublished" className="font-semibold text-gray-700 cursor-pointer">
                  Langsung Terbitkan ke Portal Publik
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />} Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
