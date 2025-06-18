import { IApiResponse, IFilm, ITheLoai, IFilmListResponse } from '../types';
import api from './api';

export const filmService = {
  getAllFilms: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    theLoai?: string;
    search?: string;
    quocGia?: string;
    before?: boolean;
    loaiPhim?: 'le' | 'bo';
  }): Promise<IFilmListResponse> => {
    const response = await api.get<IApiResponse<IFilmListResponse>>('/films', { params });
    console.log('Full API Response in filmService:', response);
    console.log('Response Data in filmService:', response.data);
    return response.data.data;
  },

  getFilmById: async (id: string) => {
    const response = await api.get<IApiResponse<{ film: IFilm }>>(`/films/${id}`);
    return response.data;
  },

  createFilm: async (filmData: FormData) => {
    const response = await api.post<IApiResponse<{ film: IFilm }>>('/films', filmData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateFilm: async (id: string, filmData: FormData) => {
    const response = await api.patch<IApiResponse<{ film: IFilm }>>(`/films/${id}`, filmData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFilm: async (id: string) => {
    const response = await api.delete<IApiResponse<null>>(`/films/${id}`);
    return response.data;
  },
};