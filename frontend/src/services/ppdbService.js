import api from './api';

export const ppdbService = {
  // 1. Kirim Biodata Pendaftaran (Langkah 1 & 2)
  submitPendaftaran: async (data) => {
    const response = await api.post('/ppdb/submit', data);
    return response.data;
  },

  // 2. Unggah Dokumen Persyaratan (Langkah 3)
  uploadDokumen: async (file, jenisDokumen) => {
    const formData = new FormData();
    formData.append('dokumen', file);
    formData.append('jenisDokumen', jenisDokumen); // 'fileKK', 'fileAkta', atau 'fileFoto'

    const response = await api.post('/ppdb/upload-dokumen', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
