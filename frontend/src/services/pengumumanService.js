import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/cms/pengumuman';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchPengumuman = async () => {
  const response = await axios.get(API_URL, getHeaders());
  return response.data;
};

export const createPengumuman = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePengumuman = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePengumuman = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return response.data;
};
