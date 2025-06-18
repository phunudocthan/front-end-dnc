import axios from 'axios';

// Sử dụng environment variable hoặc fallback về localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Lịch sử xem
export const lichSuXemService = {
  themVaoLichSuXem: (phimId: string) => 
    api.post('/lichsuxem', { phimId }),
  
  layLichSuXemCuaToi: () => 
    api.get('/lichsuxem'),
  
  xoaKhoiLichSuXem: (id: string) => 
    api.delete(`/lichsuxem/${id}`),
  
  xoaToanBoLichSuXem: () => 
    api.delete('/lichsuxem')
};

// Yêu thích
export const yeuThichService = {
  themVaoYeuThich: (phimId: string) => 
    api.post('/yeuthichs', { phimId }),
  
  layDanhSachYeuThichCuaToi: () => 
    api.get('/yeuthichs'),
  
  xoaKhoiYeuThich: (id: string) => 
    api.delete(`/yeuthichs/${id}`)
}; 