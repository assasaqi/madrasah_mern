import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import PPDBLayout from './layouts/PPDBLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/public/Home';
import Profil from './pages/public/Profil';
import Berita from './pages/public/Berita';
import BeritaDetail from './pages/public/BeritaDetail';
import Pengumuman from './pages/public/Pengumuman';
import DetailPengumuman from './pages/public/DetailPengumuman';
import Galeri from './pages/public/Galeri';
import Kontak from './pages/public/Kontak';

import Login from './pages/Login';
import Register from './pages/Register';

import PPDBDashboard from './pages/ppdb/Dashboard';
import PPDBForm from './pages/ppdb/PPDBForm';

import AdminDashboard from './pages/admin/Dashboard';
import AdminPublicProfile from './pages/admin/AdminPublicProfile';
import AdminPPDB from './pages/admin/AdminPPDB';
import AdminBerita from './pages/admin/AdminBerita';
import AdminPengumuman from './pages/admin/AdminPengumuman';
import AdminProfile from './pages/admin/AdminProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik dengan Persistent PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<BeritaDetail />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/pengumuman/:id" element={<DetailPengumuman />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        {/* Rute Autentikasi */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Terproteksi PPDB dengan Persistent PPDBLayout */}
        <Route path="/ppdb" element={<PPDBLayout />}>
          <Route index element={<Navigate to="/ppdb/dashboard" replace />} />
          <Route path="dashboard" element={<PPDBDashboard />} />
          <Route path="formulir" element={<PPDBForm />} />
        </Route>

        {/* Rute Terproteksi Admin dengan Persistent AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profil-sekolah" element={<AdminPublicProfile />} />
          <Route path="ppdb" element={<AdminPPDB />} />
          <Route path="berita" element={<AdminBerita />} />
          <Route path="pengumuman" element={<AdminPengumuman />} />
          <Route path="pengaturan-profil" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
