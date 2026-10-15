import api from './api';

/**
 * Service Layer untuk Pengelolaan Admin Berita & Kategori CMS
 */
export const beritaService = {
  /**
   * Mengambil semua daftar berita
   * @returns {Promise<Array>} Array list berita
   */
  getAllBerita: async () => {
    try {
      const response = await api.get('/admin/cms/berita');
      const resData = response?.data !== undefined ? response.data : response;

      if (Array.isArray(resData)) return resData;
      if (Array.isArray(resData?.data)) return resData.data;
      if (Array.isArray(resData?.berita)) return resData.berita;
      if (Array.isArray(resData?.data?.berita)) return resData.data.berita;
      if (Array.isArray(resData?.result)) return resData.result;

      return [];
    } catch (error) {
      console.error('Error [beritaService.getAllBerita]:', error);
      throw error;
    }
  },

  /**
   * Mengambil daftar kategori berita untuk dropdown select
   * @returns {Promise<Array>} Array list kategori
   */
  getKategoriList: async () => {
    try {
      const response = await api.get('/admin/cms/kategori');
      const resData = response?.data !== undefined ? response.data : response;

      if (Array.isArray(resData)) return resData;
      if (Array.isArray(resData?.data)) return resData.data;
      if (Array.isArray(resData?.kategori)) return resData.kategori;
      if (Array.isArray(resData?.data?.kategori)) return resData.data.kategori;

      return [];
    } catch (error) {
      console.error('Error [beritaService.getKategoriList]:', error);
      throw error;
    }
  },

  /**
   * Membuat artikel berita baru (Mendukung upload gambar Multipart/Form-Data)
   * @param {Object} formDataPayload - Object berisi judul, konten, kategoriId, isPublished, dan imageFile
   * @returns {Promise<Object>} Respon pembuatan berita
   */
  createBerita: async (formDataPayload) => {
    try {
      const data = new FormData();
      data.append('judul', formDataPayload.judul || '');
      data.append('konten', formDataPayload.konten || '');
      data.append('isPublished', formDataPayload.isPublished ?? true);

      if (formDataPayload.kategoriId) {
        data.append('kategoriId', formDataPayload.kategoriId);
      }

      if (formDataPayload.imageFile) {
        // Nama field 'gambar' disesuaikan dengan upload.single('gambar') di backend
        data.append('gambar', formDataPayload.imageFile);
      }

      const response = await api.post('/admin/cms/berita', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error [beritaService.createBerita]:', error);
      throw error;
    }
  },

  /**
   * Menghapus artikel berita berdasarkan UUID
   * @param {string} id - UUID Berita
   * @returns {Promise<Object>} Respon penghapusan berita
   */
  deleteBerita: async (id) => {
    try {
      const response = await api.delete(`/admin/cms/berita/${id}`);
      return response?.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error [beritaService.deleteBerita]:', error);
      throw error;
    }
  }
};

export default beritaService;
