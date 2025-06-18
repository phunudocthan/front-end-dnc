import { IAuthResponse } from '../types';
import api from './api';

interface DangKyData {
  hoTen: string;
  email: string;
  matKhau: string;
}

interface DangNhapData {
  email: string;
  matKhau: string;
}

export const authService = {
  dangKy: async (data: DangKyData) => {
    const response = await api.post('/users/dangky', data);
    return response.data;
  },

  dangNhap: async (data: DangNhapData) => {
    const response = await api.post('/users/dangnhap', data);
    return response.data;
  },

  dangXuat: async () => {
    const response = await api.get('/users/dangxuat');
    return response.data;
  },

  capNhatThongTin: async (data: FormData) => {
    const response = await api.patch('/users/capnhatthongtin', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  doiMatKhau: async (data: { matKhauHienTai: string; matKhauMoi: string }) => {
    const response = await api.patch('/users/doimatkhau', data);
    return response.data;
  },
}; 