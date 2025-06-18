import { IApiResponse, ITheLoai } from '../types';
import api from './api';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: api.defaults.baseURL,
  headers: api.defaults.headers,
});

export const theLoaiService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return { data: { categories: response.data.data?.categories || [] } };
  },

  getCategoryById: async (id: string): Promise<{ category: ITheLoai }> => {
    const response = await api.get<IApiResponse<{ category: ITheLoai }>>(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (category: any) => {
    const response = await api.post('/categories', category);
    return response;
  },

  updateCategory: async (id: string, category: any) => {
    const response = await api.patch(`/categories/${id}`, category);
    return response;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response;
  },
}; 