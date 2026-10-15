import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Jika belum login (token tidak ada), arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika role pengguna tidak diizinkan, arahkan ke halaman awal
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
