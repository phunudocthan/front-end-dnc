import { IApiResponse, IDanhGia } from '../types';
import api from './api';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: api.defaults.baseURL,
});

export const danhGiaService = {
  layDanhGiaTheoPhim: async (filmId: string) => {
    const response = await api.get<IApiResponse<{ danhGias: IDanhGia[] }>>(`/films/${filmId}/danhgia`);
    return response.data;
  },

  themDanhGia: async (filmId: string, data: { diem: number; nhanXet: string }) => {
    const response = await api.post<IApiResponse<{ danhGia: IDanhGia }>>(`/films/${filmId}/danhgia`, data);
    return response.data;
  },

  capNhatDanhGia: async (id: string, data: { diem?: number; nhanXet?: string }) => {
    const response = await api.patch<IApiResponse<{ danhGia: IDanhGia }>>(`/danhgia/${id}`, data);
    return response.data;
  },

  xoaDanhGia: async (id: string) => {
    const response = await api.delete(`/danhgia/${id}`);
    return response.data;
  },

  thichDanhGia: async (id: string) => {
    const response = await api.patch<IApiResponse<{ danhGia: IDanhGia }>>(`/danhgia/${id}/thich`);
    return response.data;
  },

  getFilmRatings: async (filmId: string) => {
    const response = await api.get<IApiResponse<{ ratings: IDanhGia[] }>>(`/films/${filmId}/ratings`);
    return response.data;
  },

  addRating: async (filmId: string, ratingData: { diem: number; noiDung: string }) => {
    const response = await api.post<IApiResponse<{ rating: IDanhGia }>>(`/films/${filmId}/ratings`, ratingData);
    return response.data;
  },

  updateRating: async (filmId: string, ratingId: string, ratingData: { diem?: number; noiDung?: string }) => {
    const response = await api.patch<IApiResponse<{ rating: IDanhGia }>>(`/films/${filmId}/ratings/${ratingId}`, ratingData);
    return response.data;
  },

  deleteRating: async (filmId: string, ratingId: string) => {
    const response = await api.delete<IApiResponse<null>>(`/films/${filmId}/ratings/${ratingId}`);
    return response.data;
  },

  getAllRatings: async () => {
    const response = await api.get('/admin/ratings');
    return response.data;
  },

  deleteRatingAdmin: async (ratingId: string) => {
    const response = await api.delete<IApiResponse<null>>(`/admin/ratings/${ratingId}`);
    return response.data;
  },

  getRatingStats: async () => {
    const response = await api.get('/admin/ratings/stats');
    return response;
  },
}; 