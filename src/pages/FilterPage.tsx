import React, { useEffect, useState } from 'react';
console.log('DEBUG: FilterPage file is loaded.');
import {
  Container,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Chip,
  Stack,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { filmService } from '../services/filmService';
import { theLoaiService } from '../services/theLoaiService';
import { IFilm, ITheLoai } from '../types';

const FilterPage = () => {
  console.log('DEBUG: FilterPage component is rendering.');
  const [films, setFilms] = useState<IFilm[]>([]);
  const [theLoais, setTheLoais] = useState<ITheLoai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTheLoai, setSelectedTheLoai] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoaiPhim, setSelectedLoaiPhim] = useState('');
  const [selectedNamPhatHanh, setSelectedNamPhatHanh] = useState('');
  const [selectedQuocGia, setSelectedQuocGia] = useState('');

  const location = useLocation();

  // State để lưu trữ các giá trị lọc tạm thời
  const [tempSelectedTheLoai, setTempSelectedTheLoai] = useState('');
  const [tempSort, setTempSort] = useState('-createdAt');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [tempSelectedLoaiPhim, setTempSelectedLoaiPhim] = useState('');
  const [tempSelectedNamPhatHanh, setTempSelectedNamPhatHanh] = useState('');
  const [tempSelectedQuocGia, setTempSelectedQuocGia] = useState('');

  useEffect(() => {
    const fetchTheLoais = async () => {
      try {
        const response = await theLoaiService.getAllCategories();
        setTheLoais(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchTheLoais();
  }, []);

  const fetchFilmsData = async (
    currentPage: number,
    currentSearchQuery: string,
    currentSelectedTheLoai: string,
    currentSort: string,
    currentSelectedLoaiPhim: string,
    currentSelectedNamPhatHanh: string,
    currentSelectedQuocGia: string
  ) => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
        sort: currentSort,
      };

      if (currentSearchQuery) {
        params.search = currentSearchQuery;
      }
      if (currentSelectedTheLoai) {
        params.theLoai = currentSelectedTheLoai;
      }
      if (currentSelectedLoaiPhim) {
        params.loaiPhim = currentSelectedLoaiPhim;
      }
      if (currentSelectedNamPhatHanh) {
        if (currentSelectedNamPhatHanh === 'before2009') {
          params.namPhatHanh = 2008;
          params.before = true;
        } else {
          params.namPhatHanh = parseInt(currentSelectedNamPhatHanh, 10);
        }
      }
      if (currentSelectedQuocGia) {
        params.quocGia = currentSelectedQuocGia;
      }

      const res = await filmService.getAllFilms(params);
      setFilms(res.films);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (error) {
      console.error('Error fetching films:', error);
      setError('Có lỗi xảy ra khi tải danh sách phim');
      setFilms([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilmsData(
      page,
      searchQuery,
      selectedTheLoai,
      sort,
      selectedLoaiPhim,
      selectedNamPhatHanh,
      selectedQuocGia
    );
  }, [page, searchQuery, selectedTheLoai, sort, selectedLoaiPhim, selectedNamPhatHanh, selectedQuocGia]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTempSortChange = (event: SelectChangeEvent) => {
    setTempSort(event.target.value);
  };

  const handleTempTheLoaiChange = (event: SelectChangeEvent) => {
    setTempSelectedTheLoai(event.target.value);
  };

  const handleTempSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchQuery(event.target.value);
  };

  const handleTempLoaiPhimChange = (event: SelectChangeEvent) => {
    setTempSelectedLoaiPhim(event.target.value);
  };

  const handleTempNamPhatHanhChange = (event: SelectChangeEvent) => {
    setTempSelectedNamPhatHanh(event.target.value);
  };

  const handleTempQuocGiaChange = (event: SelectChangeEvent) => {
    setTempSelectedQuocGia(event.target.value);
  };

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page on new filter application
    setSearchQuery(tempSearchQuery);
    setSelectedTheLoai(tempSelectedTheLoai);
    setSort(tempSort);
    setSelectedLoaiPhim(tempSelectedLoaiPhim);
    setSelectedNamPhatHanh(tempSelectedNamPhatHanh);
    setSelectedQuocGia(tempSelectedQuocGia);
  };

  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse();

  const COUNTRIES = {
    "Việt Nam": "vietnam",
    "Hàn Quốc": "korea",
    "Trung Quốc": "china",
    "Mỹ": "usa",
    "Nhật Bản": "japan",
    "Thái Lan": "thailand",
    "Châu Âu": "europe",
  };
  const countryOptions = Object.keys(COUNTRIES).map(key => ({ label: key, value: COUNTRIES[key as keyof typeof COUNTRIES] }));


  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#E50914', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, fontSize: '1.5rem', mb: 2 }}>
          LỌC PHIM
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Thể loại</InputLabel>
            <Select
              value={tempSelectedTheLoai}
              label="Thể loại"
              onChange={handleTempTheLoaiChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {theLoais.map((theLoai) => (
                <MenuItem key={theLoai._id} value={theLoai._id}>
                  {theLoai.tenTheLoai}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Loại phim</InputLabel>
            <Select
              value={tempSelectedLoaiPhim}
              label="Loại phim"
              onChange={handleTempLoaiPhimChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="le">Phim lẻ</MenuItem>
              <MenuItem value="bo">Phim bộ</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Năm phát hành</InputLabel>
            <Select
              value={tempSelectedNamPhatHanh}
              label="Năm phát hành"
              onChange={handleTempNamPhatHanhChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="before2009">Trước 2009</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={String(year)}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Quốc gia</InputLabel>
            <Select
              value={tempSelectedQuocGia}
              label="Quốc gia"
              onChange={handleTempQuocGiaChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {countryOptions.map((country) => (
                <MenuItem key={country.value} value={country.label}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={tempSort}
              label="Sắp xếp theo"
              onChange={handleTempSortChange}
            >
              <MenuItem value="-createdAt">Mới nhất</MenuItem>
              <MenuItem value="createdAt">Cũ nhất</MenuItem>
              <MenuItem value="diemTrungBinh">Điểm trung bình (thấp nhất)</MenuItem>
              <MenuItem value="-diemTrungBinh">Điểm trung bình (cao nhất)</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            sx={{
              width: '150px',
              height: '40px',
              bgcolor: '#E50914',
              px: 3,
              py: 1,
              fontSize: '1.05rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#B30710',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            Tìm kiếm
          </Button>
        </Box>
        {loading ? <Typography>Đang tải phim...</Typography> : (
          <>
            <Grid container spacing={2}>
              {films.map((film) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={film._id}>
                  <Card
                    component={Link}
                    to={`/films/${film._id}`}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={film.poster ? `http://localhost:3001/${film.poster}` : '/default-poster.jpg'}
                      alt={film.tenPhim}
                      sx={{ height: '350px', width: '100%', objectFit: 'contain', borderRadius: '8px 8px 0 0' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 1, pt: 0, minHeight: '120px', backgroundColor: '#1c1c1c' }}>
                      <Typography gutterBottom variant="h6" component="div" noWrap sx={{ color: '#fff' }}>
                        {film.tenPhim}
                      </Typography>
                      <Stack direction="row" spacing={1} mb={1} justifyContent="center">
                        {film.theLoai.slice(0, 2).map((theLoai) => (
                          <Chip key={theLoai._id} label={theLoai.tenTheLoai} size="small" sx={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }} />
                        ))}
                      </Stack>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <Rating value={film.diemTrungBinh} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          ({film.danhGiaChiTiet?.length || 0})
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {films.length > 0 && totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#fff',
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: '#E50914',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#C20812',
                      },
                    },
                  }}
                />
              </Box>
            )}
            {films.length === 0 && (
              <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                Không có phim nào phù hợp với tiêu chí lọc của bạn.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default FilterPage; 