import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth & Protection
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import PublicLayout from './components/public/PublicLayout';
import Home from './pages/public/Home';
import Profil from './pages/public/Profil';
import Berita from './pages/public/Berita';
import BeritaDetail from './pages/public/BeritaDetail';
import Galeri from './pages/public/Galeri';
import Kontak from './pages/public/Kontak';

// PPDB Pages (Calon Siswa)
import PPDBDashboard from './pages/ppdb/Dashboard';
import PPDBForm from './pages/ppdb/PPDBForm';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'; // <-- Import Dashboard Admin Utama
import AdminPPDB from './pages/admin/AdminPPDB';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<BeritaDetail />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PPDB Protected Routes (Khusus CALON_PENDAFTAR) */}
        <Route element={<ProtectedRoute allowedRoles={['CALON_PENDAFTAR']} />}>
          <Route path="/ppdb/dashboard" element={<PPDBDashboard />} />
          <Route path="/ppdb/formulir" element={<PPDBForm />} />
        </Route>

        {/* Admin Protected Routes (Khusus ADMIN) */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="ppdb" element={<AdminPPDB />} />
        </Route>

        {/* Fallback 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">404</h1>
                <p className="text-gray-600 mt-2">Halaman tidak ditemukan.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
