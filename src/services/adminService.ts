import api from './api';
import { IApiResponse } from '../types';

export interface IDashboardStats {
  totalUsers: number;
  totalFilms: number;
  totalRatings: number;
  averageRating: number;
  topRatedFilms: Array<{ _id: string; tenPhim: string; diemTrungBinh: number; totalRatings: number }>;
  mostActiveUsers: Array<{ _id: string; hoTen: string; email: string; totalRatings: number }>;
}

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get<IApiResponse<IDashboardStats>>('/admin/dashboard-stats');
    return response.data.data;
  },
}; 