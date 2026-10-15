import api from './api';

export const publicService = {
  // Mengambil data ringkasan untuk halaman beranda
  getHomeData: async () => {
    const response = await api.get('/public/home');
    return response.data;
  },

  // Mengambil daftar berita publik
  getBerita: async (params) => {
    const response = await api.get('/public/berita', { params });
    return response.data;
  },

  // Mengambil pengumuman terbaru
  getPengumuman: async () => {
    const response = await api.get('/public/pengumuman');
    return response.data;
  },
};
