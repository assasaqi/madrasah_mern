import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Calendar, Loader2, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminPengumuman() {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', targetDate: '' });

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/cms/pengumuman');
      setPengumumanList(res.data || []);
    } catch (err) {
      console.error('Gagal memuat pengumuman:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/cms/pengumuman', formData);
      alert('Pengumuman berhasil diterbitkan!');
      setShowModal(false);
      setFormData({ title: '', content: '', targetDate: '' });
      fetchPengumuman();
    } catch (err) {
      alert('Gagal menambah pengumuman.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    try {
      await api.delete(`/admin/cms/pengumuman/${id}`);
      setPengumumanList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Gagal menghapus pengumuman.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="text-emerald-600" size={24} /> Pengumuman Resmi
          </h1>
          <p className="text-xs text-gray-500 mt-1">Kelola papan pengumuman singkat yang tampil pada halaman utama madrasah.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Buat Pengumuman
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-emerald-600 flex justify-center items-center gap-2 text-xs">
            <Loader2 className="animate-spin" size={18} /> Memuat pengumuman...
          </div>
        ) : pengumumanList.length > 0 ? (
          pengumumanList.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                  <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString('id-ID')}
                </span>
                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.content}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 text-xs">
            Belum ada pengumuman resmi.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-gray-900">Buat Pengumuman Baru</h3>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pembukaan PPDB TA 2027/2028"
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detail Pengumuman</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Isi rincian pengumuman..."
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">Terbitkan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
