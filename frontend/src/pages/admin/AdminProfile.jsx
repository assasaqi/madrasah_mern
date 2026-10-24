import React, { useState, useEffect, useContext } from 'react';
import { User, Lock, Upload, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../../services/profileService';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminProfile() {
  const { user, login: setAuthContext } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    email: '',
    foto: null
  });

  const [passwordData, setPasswordData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: ''
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Memuat data profil admin dari API saat komponen pertama kali dimuat
  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memuat data profil admin dari API backend
  const fetchProfileData = async () => {
    try {
      setFetching(true);
      const res = await getAdminProfile();

      if (res.success && res.data) {
        setProfile({
          email: res.data.email || '',
          foto: null
        });

        if (res.data.foto) {
          setPreviewFoto(`${API_BASE_URL}/uploads/${res.data.foto.replace(/^\/uploads\//, '')}`);
        }

        setAuthContext({ ...user, ...res.data });
      }
    } catch (err) {
      console.error('Gagal mengambil data profil:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      setStatusMsg({
        type: 'error',
        text: isTechError || !serverMsg ? 'Gagal memuat data profil admin. Terjadi kendala sistem.' : serverMsg
      });
    } finally {
      setFetching(false);
    }
  };

  // Memproses unggahan foto profil dan menampilkan pratinjau
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, foto: file }));
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  // Mengirim pembaruan data profil ke server dan memperbarui state global
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      if (profile.email) formData.append('email', profile.email);
      if (profile.foto instanceof File) formData.append('foto', profile.foto);

      const res = await updateAdminProfile(formData);

      setStatusMsg({
        type: 'success',
        text: res.message || 'Profil berhasil diperbarui!'
      });

      setProfile((prev) => ({ ...prev, foto: null }));

      if (res.data?.foto) {
        setPreviewFoto(`${API_BASE_URL}/uploads/${res.data.foto.replace(/^\/uploads\//, '')}`);
      }

      const updatedUser = { ...user, ...(res.data || {}), email: profile.email || user?.email };
      setAuthContext(updatedUser);
    } catch (err) {
      console.error('Error save profile:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      setStatusMsg({
        type: 'error',
        text: isTechError || !serverMsg ? 'Gagal memperbarui profil. Terjadi kendala pada server.' : serverMsg
      });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
    }
  };

  // Mengubah kata sandi akun admin setelah validasi input
  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.passwordLama || !passwordData.passwordBaru) {
      setStatusMsg({ type: 'error', text: 'Semua kolom password wajib diisi!' });
      return;
    }

    if (passwordData.passwordBaru !== passwordData.konfirmasiPassword) {
      setStatusMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    setLoading(true);

    try {
      const res = await changeAdminPassword({
        passwordLama: passwordData.passwordLama,
        passwordBaru: passwordData.passwordBaru
      });

      setStatusMsg({
        type: 'success',
        text: res.message || 'Password berhasil diubah!'
      });

      setPasswordData({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
    } catch (err) {
      console.error('Error change password:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      setStatusMsg({
        type: 'error',
        text: isTechError || !serverMsg ? 'Gagal mengubah password. Terjadi kendala pada server.' : serverMsg
      });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-center text-xs font-semibold text-gray-500">
        Memuat data profil admin...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 font-sans text-gray-800">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Pengaturan Profil & Keamanan</h1>
        <p className="text-xs text-gray-500 mt-1">
          Kelola informasi personal akun admin dan ubah kata sandi Anda.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Profil */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <User className="text-emerald-600" size={20} />
            <h2 className="font-bold text-gray-800 text-sm">Informasi Pengguna</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center overflow-hidden font-bold text-emerald-700 text-xl">
                {previewFoto ? (
                  <img src={previewFoto} alt="Preview Foto Admin" className="w-full h-full object-cover" />
                ) : (
                  profile.email ? profile.email.charAt(0).toUpperCase() : 'A'
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl transition border border-emerald-100">
                  <Upload size={14} /> Upload Foto
                  <input type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Maksimal 2MB (Format WebP/JPG/PNG)</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Akun</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm shadow-emerald-200 cursor-pointer disabled:opacity-50"
            >
              <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        </div>

        {/* Form Password */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Lock className="text-emerald-600" size={20} />
            <h2 className="font-bold text-gray-800 text-sm">Ganti Password</h2>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password Saat Ini</label>
              <input
                type="password"
                value={passwordData.passwordLama}
                onChange={(e) => setPasswordData({ ...passwordData, passwordLama: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password Baru</label>
              <input
                type="password"
                value={passwordData.passwordBaru}
                onChange={(e) => setPasswordData({ ...passwordData, passwordBaru: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={passwordData.konfirmasiPassword}
                onChange={(e) => setPasswordData({ ...passwordData, konfirmasiPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm shadow-emerald-200 cursor-pointer disabled:opacity-50"
            >
              <Save size={16} /> {loading ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
