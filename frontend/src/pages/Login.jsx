import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, School, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuthContext } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle perubahan input form
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Submit autentikasi user dan sanitasi pesan error
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const data = await authService.login(credentials);
      const user = data.user;

      if (user) {
        setAuthContext(user);
      }

      const role = String(user?.role || '').toUpperCase().trim();

      if (['ADMIN', 'SUPERADMIN', 'OPERATOR'].includes(role)) {
        navigate('/admin/dashboard');
      } else if (role === 'GURU') {
        navigate('/guru/dashboard');
      } else if (['CALON_PENDAFTAR', 'PENDAFTAR'].includes(role)) {
        navigate('/ppdb/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMessage = err.response?.data?.message;
      const isTechnicalError =
        typeof serverMessage === 'string' &&
        (serverMessage.includes('prisma') ||
          serverMessage.includes('Database error') ||
          serverMessage.includes('invocation') ||
          serverMessage.includes('pool timeout'));

      setError(
        isTechnicalError || !serverMessage
          ? 'Gagal masuk. Terjadi kendala sistem, silakan coba lagi beberapa saat lagi.'
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
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Portal Madrasah</h2>
        <p className="mt-2 text-sm text-gray-600">
          Masuk untuk mengakses Sistem Informasi & PPDB
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

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50 shadow-md shadow-emerald-200 cursor-pointer"
            >
              {loading ? (
                'Memproses...'
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Belum punya akun pendaftar? </span>
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500 transition">
              Daftar akun PPDB
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
