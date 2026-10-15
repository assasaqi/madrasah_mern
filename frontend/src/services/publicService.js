import api from './api';

export const publicService = {
  // 1. Mengambil data ringkasan untuk halaman beranda
  getHomeData: async () => {
    try {
      const response = await api.get('/public/home');
      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      // Fallback manual ke endpoint terpisah jika /public/home belum tersedia
      const [beritaRes, pengumumanRes] = await Promise.allSettled([
        api.get('/public/berita'),
        api.get('/public/pengumuman')
      ]);
      return {
        latestNews: beritaRes.status === 'fulfilled' ? (beritaRes.value?.data?.data || beritaRes.value?.data || []) : [],
        announcements: pengumumanRes.status === 'fulfilled' ? (pengumumanRes.value?.data?.data || pengumumanRes.value?.data || []) : []
      };
    }
  },

  // 2. Mengambil daftar berita publik
  getBerita: async (params = {}) => {
    try {
      const response = await api.get('/public/berita', { params });
      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error [publicService.getBerita]:', error);
      throw error;
    }
  },

  // 3. 🟢 DITAMBAHKAN: Mengambil detail berita berdasarkan ID atau Slug
  getBeritaDetail: async (idOrSlug) => {
    try {
      const response = await api.get(`/public/berita/${idOrSlug}`);
      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error [publicService.getBeritaDetail]:', error);
      throw error;
    }
  },

  // 4. 🟢 DITAMBAHKAN: Mengambil daftar kategori berita publik
  getKategori: async () => {
    try {
      const response = await api.get('/public/kategori');
      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error [publicService.getKategori]:', error);
      throw error;
    }
  },

  // 5. Mengambil pengumuman terbaru
  getPengumuman: async () => {
    try {
      const response = await api.get('/public/pengumuman');
      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error [publicService.getPengumuman]:', error);
      throw error;
    }
  },
};

export default publicService;
