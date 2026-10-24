import api from './api';

// Helper ekstraksi respons API terstandar
const extractData = (response) => response?.data?.data ?? response?.data ?? response;

export const authService = {
  // Autentikasi pengguna dan set HTTP-Only cookie via backend
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return extractData(response);
  },

  // Pendaftaran pengguna baru
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return extractData(response);
  },

  // Verifikasi sesi cookie dan ambil profil pengguna aktif
  getMe: async () => {
    const response = await api.get('/auth/me');
    return extractData(response);
  },

  // Alias untuk kemudahan pemanggilan profil pengguna
  getCurrentUser: async () => {
    return authService.getMe();
  },

  // Hapus kredensial cookie di server & bersihkan header Authorization Axios
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return extractData(response);
    } finally {
      delete api.defaults.headers.common['Authorization'];
    }
  }
};

export default authService;
