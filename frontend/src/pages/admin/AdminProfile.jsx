import React, { useState } from 'react';
import { User, Lock, Upload, Save, CheckCircle2 } from 'lucide-react';

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    nama: 'Admin Operator',
    email: 'admin@madrasah.sch.id',
    foto: null
  });

  const [passwordData, setPasswordData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: ''
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, foto: file });
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // API Call Update Profil
    setStatusMsg({ type: 'success', text: 'Profil berhasil diperbarui!' });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordData.passwordBaru !== passwordData.konfirmasiPassword) {
      setStatusMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
      return;
    }
    // API Call Update Password
    setStatusMsg({ type: 'success', text: 'Password berhasil diubah!' });
    setPasswordData({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Pengaturan Profil & Keamanan</h1>
        <p className="text-xs text-gray-500 mt-1">
          Kelola informasi personal akun admin dan ubah kata sandi Anda.
        </p>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <CheckCircle2 size={18} />
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
                  <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  profile.nama.charAt(0)
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
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={profile.nama}
                onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm shadow-emerald-200 cursor-pointer"
            >
              <Save size={16} /> Simpan Profil
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
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm shadow-emerald-200 cursor-pointer"
            >
              <Save size={16} /> Ubah Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
