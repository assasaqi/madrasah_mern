import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Image as ImageIcon, Save, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { getAdminSchoolProfile, updateAdminSchoolProfile } from '../../services/profileService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPublicProfile() {
  const [profileData, setProfileData] = useState({
    namaSekolah: '',
    npsn: '',
    akreditasi: 'A',
    tagline: '',
    deskripsi: '',
    alamat: '',
    email: '',
    telepon: '',
    whatsapp: '',
    mapsUrl: '',
    visi: '',
    misi: ['']
  });

  const [files, setFiles] = useState({ logo: null, banner: null });
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Memuat data profil sekolah saat komponen pertama kali dipasang
  useEffect(() => {
    fetchSchoolData();
  }, []);

  // Format URL media berkas gambar berbasis environment variable
  const formatImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${API_BASE_URL}/uploads/${path.replace(/^\/uploads\//, '')}`;
  };

  // Memuat data profil sekolah dari API backend
  const fetchSchoolData = async () => {
    try {
      setFetching(true);
      const res = await getAdminSchoolProfile();
      if (res.success && res.data) {
        const d = res.data;

        let parsedMisi = [''];
        if (Array.isArray(d.misi) && d.misi.length > 0) {
          parsedMisi = d.misi;
        } else if (typeof d.misi === 'string') {
          try {
            parsedMisi = JSON.parse(d.misi);
          } catch {
            parsedMisi = [d.misi];
          }
        }

        setProfileData({
          namaSekolah: d.namaSekolah || '',
          npsn: d.npsn || '',
          akreditasi: d.akreditasi || 'A',
          tagline: d.tagline || '',
          deskripsi: d.deskripsi || '',
          alamat: d.alamat || '',
          email: d.email || '',
          telepon: d.telepon || '',
          whatsapp: d.whatsapp || '',
          mapsUrl: d.mapsUrl || '',
          visi: d.visi || '',
          misi: parsedMisi
        });

        if (d.logo) setLogoPreview(formatImageUrl(d.logo));
        if (d.banner) setBannerPreview(formatImageUrl(d.banner));
      }
    } catch (err) {
      console.error('Error load school profile:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      setStatusMsg({
        type: 'error',
        text: isTechError || !serverMsg ? 'Gagal memuat profil sekolah dari server.' : serverMsg
      });
    } finally {
      setFetching(false);
    }
  };

  // Memproses perubahan pada input teks profil
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Mengubah nilai poin misi berdasarkan indeks
  const handleMisiChange = (index, value) => {
    const updatedMisi = [...profileData.misi];
    updatedMisi[index] = value;
    setProfileData({ ...profileData, misi: updatedMisi });
  };

  // Menambahkan baris poin misi baru
  const addMisi = () => {
    setProfileData({ ...profileData, misi: [...profileData.misi, ''] });
  };

  // Menghapus baris poin misi berdasarkan indeks
  const removeMisi = (index) => {
    const updatedMisi = profileData.misi.filter((_, i) => i !== index);
    setProfileData({ ...profileData, misi: updatedMisi.length ? updatedMisi : [''] });
  };

  // Memproses berkas logo baru dan memperbarui pratinjau
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Memproses berkas banner baru dan memperbarui pratinjau
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, banner: file }));
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Mengirimkan pembaruan data profil sekolah ke server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(profileData).forEach((key) => {
        if (key === 'misi') {
          const filteredMisi = profileData.misi.filter((m) => m.trim() !== '');
          formData.append('misi', JSON.stringify(filteredMisi));
        } else {
          formData.append(key, profileData[key] || '');
        }
      });

      if (files.logo instanceof File) formData.append('logo', files.logo);
      if (files.banner instanceof File) formData.append('banner', files.banner);

      const res = await updateAdminSchoolProfile(formData);

      setStatusMsg({
        type: 'success',
        text: res.message || 'Profil publik sekolah berhasil diperbarui!'
      });

      setFiles({ logo: null, banner: null });

      if (res.data?.logo) setLogoPreview(formatImageUrl(res.data.logo));
      if (res.data?.banner) setBannerPreview(formatImageUrl(res.data.banner));
    } catch (err) {
      console.error('Error submit school profile:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      setStatusMsg({
        type: 'error',
        text: isTechError || !serverMsg ? 'Gagal menyimpan perubahan profil sekolah.' : serverMsg
      });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-center text-xs font-semibold text-gray-500">
        Memuat data profil sekolah...
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 pb-12 font-sans text-gray-800">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Kelola Profil Sekolah (Website Publik)</h1>
        <p className="text-xs text-gray-500 mt-1">
          Perbarui informasi identitas madrasah, alamat, kontak, serta visi dan misi yang ditampilkan pada landing page.
        </p>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <ImageIcon className="text-emerald-600" size={20} />
            <h2 className="font-bold text-gray-800 text-sm">Logo & Banner Utama</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Logo Sekolah</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building2 className="text-gray-400" size={32} />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl transition border border-emerald-100 inline-block">
                    Ubah Logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Rekomendasi WebP/PNG transparan (Maks 2MB)</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Banner / Foto Gedung</label>
              <div className="flex items-center gap-4">
                <div className="w-36 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Belum ada foto</span>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl transition border border-emerald-100 inline-block">
                    Ubah Banner
                    <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Rekomendasi rasio 16:9 (Maks 2MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Building2 className="text-emerald-600" size={20} />
            <h2 className="font-bold text-gray-800 text-sm">Informasi Umum Madrasah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Madrasah / Sekolah</label>
              <input
                type="text"
                name="namaSekolah"
                value={profileData.namaSekolah}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">NPSN</label>
              <input
                type="text"
                name="npsn"
                value={profileData.npsn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Akreditasi</label>
              <select
                name="akreditasi"
                value={profileData.akreditasi}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="A">A (Unggul)</option>
                <option value="B">B (Baik)</option>
                <option value="C">C (Cukup)</option>
                <option value="-">Belum Terakreditasi</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tagline / Slogan</label>
              <input
                type="text"
                name="tagline"
                value={profileData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi / Profil Singkat</label>
            <textarea
              name="deskripsi"
              rows={3}
              value={profileData.deskripsi}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MapPin className="text-emerald-600" size={20} />
            <h2 className="font-bold text-gray-800 text-sm">Alamat & Kontak</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Alamat Lengkap</label>
            <textarea
              name="alamat"
              rows={2}
              value={profileData.alamat}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Sekolah</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">No. Telepon Kantor</label>
              <input
                type="text"
                name="telepon"
                value={profileData.telepon}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp Admin / Helpdesk</label>
              <input
                type="text"
                name="whatsapp"
                value={profileData.whatsapp}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Globe className="text-emerald-600" size={20} />
            <h2 className="font-bold text-gray-800 text-sm">Visi & Misi</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Visi Madrasah</label>
            <textarea
              name="visi"
              rows={2}
              value={profileData.visi}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-600">Poin-poin Misi</label>
              <button
                type="button"
                onClick={addMisi}
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-bold cursor-pointer"
              >
                <Plus size={14} /> Tambah Misi
              </button>
            </div>
            <div className="space-y-2">
              {profileData.misi.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => handleMisiChange(idx, e.target.value)}
                    placeholder={`Misi poin ke-${idx + 1}`}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                  {profileData.misi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMisi(idx)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-emerald-200 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Seluruh Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
