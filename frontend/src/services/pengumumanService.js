import axios from 'axios';

// Endpoint Admin & Publik
const ADMIN_API_URL = 'http://localhost:5000/api/admin/cms/pengumuman';
const PUBLIC_API_URL = 'http://localhost:5000/api/public/pengumuman'; // Sesuaikan jika backend public belum dipisah

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- KUMPULAN FUNGSI SERVICE ---

// 1. Fungsi Publik (Tanpa Token Admin)
export const getAll = async () => {
  try {
    const response = await axios.get(PUBLIC_API_URL);
    return response.data;
  } catch (error) {
    // Fallback jika API publik belum ada, coba panggil API admin
    const response = await axios.get(ADMIN_API_URL, getHeaders());
    return response.data;
  }
};

export const getBySlug = async (slug) => {
  try {
    const response = await axios.get(`${PUBLIC_API_URL}/${slug}`);
    return response.data;
  } catch (error) {
    const response = await axios.get(`${ADMIN_API_URL}/${slug}`, getHeaders());
    return response.data;
  }
};

// 2. Fungsi Admin (Dengan Token & Mutasi Data)
export const fetchPengumuman = async () => {
  const response = await axios.get(ADMIN_API_URL, getHeaders());
  return response.data;
};

export const createPengumuman = async (formData) => {
  const response = await axios.post(ADMIN_API_URL, formData, {
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePengumuman = async (id, formData) => {
  const response = await axios.put(`${ADMIN_API_URL}/${id}`, formData, {
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePengumuman = async (id) => {
  const response = await axios.delete(`${ADMIN_API_URL}/${id}`, getHeaders());
  return response.data;
};

// --- OBJECT UNTUK DUKUNGAN NAMED & DEFAULT EXPORT ---
export const pengumumanService = {
  getAll,
  getBySlug,
  fetchPengumuman,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
};

export default pengumumanService;
