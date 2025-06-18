export interface IUser {
  _id: string;
  hoTen: string;
  email: string;
  role: 'user' | 'admin';
  trangThai?: 'active' | 'khoa';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  danhGia?: IPopulatedDanhGia[];
}

export interface IFilm {
  _id: string;
  tenPhim: string;
  moTa: string;
  thoiLuong: string;
  poster: string;
  trailer: string;
  videoUrl: string;
  theLoaiIds: string[];
  daoDien: string[];
  namPhatHanh: number;
  dienVien: string[];
  quocGia: string;
  loaiPhim: 'le' | 'bo';
  soTap?: string;
  episodes?: string[];
  createdAt: string;
  updatedAt: string;
  theLoai: ITheLoai[];
  diemTrungBinh: number;
  danhGia: IPopulatedDanhGia[];
  danhGiaChiTiet?: IPopulatedDanhGia[];
}

export interface ITheLoai {
  _id: string;
  tenTheLoai: string;
  moTa?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDanhGia {
  _id: string;
  nguoiDung: string;
  phim: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDanhGiaWithDetails extends IDanhGia {
  userName: string;
  filmName: string;
}

export interface IAuthResponse {
  status: string;
  token: string;
  data: {
    user: IUser;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IFilmListResponse {
  films: IFilm[];
  total: number;
  totalPages: number;
  currentPage: number;
  results: number;
}

export interface IStats {
  totalUsers: number;
  totalFilms: number;
  totalRatings: number;
  averageRating: number;
  topRatedFilms: Array<{ filmId: string; title: string; averageRating: number }>;
  mostActiveUsers: Array<{ userId: string; hoTen: string; ratingCount: number }>;
}

export interface IPopulatedDanhGia {
  _id: string;
  nguoiDung: {
    _id: string;
    hoTen: string;
    avatar?: string;
  };
  phim: {
    _id: string;
    tenPhim: string;
    poster: string;
  };
  diem: number;
  nhanXet: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILichSuXem {
  _id: string;
  nguoiDung: string;
  phim: IFilm;
  thoiGianXemCuoi: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILichSuXemResponse {
  success: boolean;
  data: {
    lichSuXem: ILichSuXem;
  };
}

export interface ILichSuXemListResponse {
  success: boolean;
  results: number;
  data: {
    lichSuXem: ILichSuXem[];
  };
}

export interface IYeuThich {
  _id: string;
  nguoiDung: string;
  phim: IFilm;
  createdAt: string;
  updatedAt: string;
}

export interface IYeuThichResponse {
  success: boolean;
  data: {
    yeuThich: IYeuThich;
  };
}

export interface IYeuThichListResponse {
  success: boolean;
  results: number;
  data: {
    yeuThichs: IYeuThich[];
  };
} 