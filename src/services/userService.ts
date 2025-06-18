import { IApiResponse, IUser } from '../types';
import api from './api';
import axios from 'axios';

export const userService = {
  // Lấy thông tin user
  getProfile: async () => {
    const response = await api.get<IApiResponse<{ user: IUser }>>('/users/profile');
    return response.data;
  },

  // Cập nhật thông tin user
  updateProfile: async (userData: FormData) => {
    const response = await api.patch<IApiResponse<{ user: IUser }>>('/users/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await api.patch<IApiResponse<null>>('/users/doimatkhau', passwordData);
    return response.data;
  },

  // Lấy lịch sử đánh giá của user
  getRatingHistory: async () => {
    const response = await api.get<IApiResponse<{ ratings: any[] }>>('/users/ratings');
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (formData: FormData) => {
    const response = await api.post<IApiResponse<{ avatarUrl: string }>>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // New admin methods
  getAllUsers: async () => {
    const response = await api.get<IApiResponse<{ users: IUser[] }>>('/admin/users');
    return response.data;
  },

  createUser: async (userData: { hoTen: string; email: string; role: 'user' | 'admin' }) => {
    const response = await api.post<IApiResponse<{ user: IUser }>>('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: { hoTen?: string; email?: string; role?: 'user' | 'admin' }) => {
    const response = await api.patch<IApiResponse<{ user: IUser }>>(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete<IApiResponse<null>>(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, data: { blocked: boolean }) => {
    const response = await api.patch<IApiResponse<{ user: IUser }>>(`/admin/users/${userId}/status`, data);
    return response.data;
  },
}; 