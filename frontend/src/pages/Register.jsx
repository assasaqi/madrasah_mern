import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, School, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CALON_PENDAFTAR',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle perubahan nilai bidang formulir
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit pendaftaran pengguna baru dan sanitasi pesan error
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const namaClean = formData.namaLengkap.trim();
    const emailClean = formData.email.trim().toLowerCase();

    if (namaClean.length < 3) {
      setError('Nama lengkap minimal 3 karakter.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setError('Format alamat email tidak valid.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak sesuai.');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        nama: namaClean,
        email: emailClean,
        password: formData.password,
        role: formData.role,
      });

      alert(`Pendaftaran akun berhasil! Silakan masuk.`);
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      const serverMessage = err.response?.data?.message;
      const isTechnicalError =
        typeof serverMessage === 'string' &&
        (serverMessage.includes('prisma') ||
          serverMessage.includes('Database error') ||
          serverMessage.includes('invocation') ||
          serverMessage.includes('pool timeout'));

      setError(
        isTechnicalError || !serverMessage
          ? 'Gagal mendaftar. Terjadi kendala sistem, silakan coba lagi beberapa saat lagi.'
          : serverMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 mb-4">
          <School size={36} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Buat Akun Portal</h2>
        <p className="mt-2 text-sm text-gray-600">
          Daftar akun baru untuk mengakses Sistem Informasi & PPDB
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-100 rounded-2xl border border-gray-100 sm:px-10">
          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peran Akun (Role)</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck size={18} />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition"
                >
                  <option value="CALON_PENDAFTAR">Calon Pendaftar (PPDB)</option>
                  <option value="ADMIN">Admin / Operator</option>
                  <option value="GURU">Guru / Tenaga Pendidik</option>
                  <option value="SISWA">Siswa</option>
                  <option value="ORANG_TUA">Orang Tua / Wali</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="namaLengkap"
                  required
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  placeholder="Ahmad Fauzi"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-emerald-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50 shadow-md shadow-emerald-200 mt-2"
            >
              {loading ? (
                'Memproses...'
              ) : (
                <>
                  <UserPlus size={18} />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Sudah memiliki akun? </span>
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
