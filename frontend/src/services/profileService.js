import axios from 'axios';

// Base URL Backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Helper untuk mengambil Token Authorization dari LocalStorage
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isMultipart && { 'Content-Type': 'multipart/form-data' }),
    },
  };
};

// ==========================================
// 1. SERVICE ADMIN (PROTECTED ROUTES)
// ==========================================

// Fetch Data Akun Admin
export const getAdminProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/profile/me`, getAuthHeaders());
  return response.data;
};

// Update Data Akun Admin (Email & Foto WebP)
export const updateAdminProfile = async (formData) => {
  const response = await axios.put(
    `${API_BASE_URL}/admin/profile/me`,
    formData,
    getAuthHeaders(true)
  );
  return response.data;
};

// Ubah Password Admin
export const changeAdminPassword = async (passwordData) => {
  const response = await axios.put(
    `${API_BASE_URL}/admin/profile/change-password`,
    passwordData,
    getAuthHeaders()
  );
  return response.data;
};

// Fetch Profil Sekolah untuk Panel Admin (Form Edit)
export const getAdminSchoolProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/profile/school`, getAuthHeaders());
  return response.data;
};

// Update Profil Sekolah (Logo, Banner, Identity, Visi/Misi)
export const updateAdminSchoolProfile = async (formData) => {
  const response = await axios.put(
    `${API_BASE_URL}/admin/profile/school`,
    formData,
    getAuthHeaders(true)
  );
  return response.data;
};

// ==========================================
// 2. SERVICE PUBLIC (TANPA AUTH / LOGIN)
// ==========================================

// Fetch Profil Sekolah untuk Halaman Depan Publik / Landing Page
export const getPublicSchoolProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/public/profile/school`);
  return response.data;
};
