import api from './api';

// ==========================================
// 1. SERVICE ADMIN (PROTECTED ROUTES)
// ==========================================

// Ambil profil admin
export const getAdminProfile = async () => {
  const response = await api.get('/admin/profile/me');
  return response.data;
};

// Update profil admin (mendukung upload file multipart/form-data)
export const updateAdminProfile = async (formData) => {
  const response = await api.put('/admin/profile/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Ubah password admin
export const changeAdminPassword = async (passwordData) => {
  const response = await api.put('/admin/profile/change-password', passwordData);
  return response.data;
};

// Ambil profil sekolah untuk formulir admin
export const getAdminSchoolProfile = async () => {
  const response = await api.get('/admin/profile/school');
  return response.data;
};

// Update profil sekolah (mendukung upload file multipart/form-data)
export const updateAdminSchoolProfile = async (formData) => {
  const response = await api.put('/admin/profile/school', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ==========================================
// 2. SERVICE PUBLIC (TANPA AUTH / LOGIN)
// ==========================================

// Ambil profil sekolah untuk landing page publik
export const getPublicSchoolProfile = async () => {
  const response = await api.get('/public/profile/school');
  return response.data;
};
