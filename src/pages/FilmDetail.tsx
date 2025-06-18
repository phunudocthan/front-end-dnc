import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Rating,
  Chip,
  Stack,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { filmService } from '../services/filmService';
import { danhGiaService } from '../services/danhGiaService';
import { lichSuXemService, yeuThichService } from '../services/api';
import { IFilm, IYeuThich } from '../types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toast } from 'react-toastify';

const FilmDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [film, setFilm] = useState<IFilm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userFavoriteId, setUserFavoriteId] = useState<string | null>(null);

  console.log(`Poster path in FilmDetail (outside JSX): ${film?.poster}`);
  if (film?.loaiPhim === 'le' && film?.videoUrl) {
    console.log(`Video URL (le) in FilmDetail (outside JSX): ${film.videoUrl.includes('youtube.com/embed') ? film.videoUrl : `http://localhost:3001/${film.videoUrl}`}`);
  }
  if (film?.loaiPhim === 'bo' && film?.episodes && film.episodes.length > 0) {
    console.log("DEBUG: Film Episodes Array:", film.episodes);
    console.log(`Video URL (bo) in FilmDetail (outside JSX): ${film.episodes[currentEpisode] ? `http://localhost:3001/${film.episodes[currentEpisode]}` : undefined}`);
  }

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const response = await filmService.getFilmById(id);
        console.log('API response (FilmDetail):', response);
        console.log('API response.data (FilmDetail):', response.data); 
        console.log('API response.data.film (FilmDetail):', response.data?.film); 
        const filmRaw = response.data?.film || {};
        console.log('FILM RAW DEBUG (FilmDetail):', filmRaw);
        const filmData = {
          ...filmRaw,
          theLoai: Array.isArray(filmRaw.theLoai) ? filmRaw.theLoai : [],
          danhGia: Array.isArray(filmRaw.danhGia) ? filmRaw.danhGia : [],
          danhGiaChiTiet: Array.isArray(filmRaw.danhGiaChiTiet) ? filmRaw.danhGiaChiTiet : [],
          diemTrungBinh: typeof filmRaw.diemTrungBinh === 'number' ? filmRaw.diemTrungBinh : 0,
          daoDien: filmRaw.daoDien ?? '',
          dienVien: Array.isArray(filmRaw.dienVien) && filmRaw.dienVien.length > 0 ? filmRaw.dienVien : [],
          thoiLuong: filmRaw.thoiLuong ?? '',
          namPhatHanh: typeof filmRaw.namPhatHanh === 'number' ? filmRaw.namPhatHanh : 0,
        };
        setFilm(filmData);
        setError(null);

        if (isAuthenticated && id) {
          const favResponse = await yeuThichService.layDanhSachYeuThichCuaToi();
          const favoriteItem = favResponse.data.data.yeuThichs.find((fav: IYeuThich) => fav.phim._id === id);
          if (favoriteItem) {
            setIsFavorite(true);
            setUserFavoriteId(favoriteItem._id);
          } else {
            setIsFavorite(false);
            setUserFavoriteId(null);
          }
        }

      } catch (error) {
        console.error('Error fetching film or favorite status:', error);
        setError('Có lỗi xảy ra khi tải thông tin phim hoặc trạng thái yêu thích');
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.warn('Vui lòng đăng nhập để thêm phim vào danh sách yêu thích.');
      return;
    }
    if (!film) return;

    try {
      if (isFavorite) {
        if (userFavoriteId) {
          await yeuThichService.xoaKhoiYeuThich(userFavoriteId);
          setIsFavorite(false);
          setUserFavoriteId(null);
          toast.success('Đã xóa phim khỏi danh sách yêu thích.');
        }
      } else {
        const response = await yeuThichService.themVaoYeuThich(film._id);
        setIsFavorite(true);
        setUserFavoriteId(response.data.data.yeuThich._id);
        toast.success('Đã thêm phim vào danh sách yêu thích.');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật trạng thái yêu thích:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái yêu thích.');
    }
  };

  useEffect(() => {
    let timeoutId: number;
    if (isAuthenticated && film && film._id) {
      timeoutId = setTimeout(async () => {
        try {
          await lichSuXemService.themVaoLichSuXem(film._id);
          console.log('Đã lưu lịch sử xem cho phim:', film.tenPhim);
        } catch (error) {
          console.error('Lỗi khi lưu lịch sử xem:', error);
        }
      }, 5000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [film, isAuthenticated]);

  const handleReviewSubmit = async () => {
    try {
      if (!id || !reviewRating) return;
      setSubmitting(true);
      await danhGiaService.themDanhGia(id, {
        diem: Math.round(reviewRating),
        nhanXet: reviewComment,
      });
      const response = await filmService.getFilmById(id);
      console.log('API response (handleReviewSubmit):', response);
      console.log('API response.data (handleReviewSubmit):', response.data); 
      console.log('API response.data.film (handleReviewSubmit):', response.data?.film); 
      const filmRaw = response.data?.film || {};
      const filmData = {
        ...filmRaw,
        theLoai: Array.isArray(filmRaw.theLoai) ? filmRaw.theLoai : [],
        danhGia: Array.isArray(filmRaw.danhGia) ? filmRaw.danhGia : [],
        danhGiaChiTiet: Array.isArray(filmRaw.danhGiaChiTiet) ? filmRaw.danhGiaChiTiet : [],
        diemTrungBinh: typeof filmRaw.diemTrungBinh === 'number' ? filmRaw.diemTrungBinh : 0,
        daoDien: filmRaw.daoDien ?? '',
        dienVien: Array.isArray(filmRaw.dienVien) && filmRaw.dienVien.length > 0 ? filmRaw.dienVien : [],
        thoiLuong: filmRaw.thoiLuong ?? '',
        namPhatHanh: typeof filmRaw.namPhatHanh === 'number' ? filmRaw.namPhatHanh : 0,
      };
      console.log('DEBUG (FilmDetail): filmData.diemTrungBinh after API response:', filmData.diemTrungBinh);
      console.log('DEBUG (FilmDetail): filmData.danhGiaChiTiet.length after API response:', filmData.danhGiaChiTiet?.length);
      setFilm(filmData);
      setOpenReviewDialog(false);
      setReviewRating(0);
      setReviewComment('');
      toast.success('Đánh giá của bạn đã được gửi!');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi đánh giá.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextEpisode = () => {
    if (film?.episodes && currentEpisode < film.episodes.length - 1) {
      setCurrentEpisode(currentEpisode + 1);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisode > 0) {
      setCurrentEpisode(currentEpisode - 1);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (error || !film) {
    return (
      <Container>
        <Typography color="error">{error || 'Không tìm thấy phim'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={film.poster ? `http://localhost:3001/${film.poster}` : '/default-poster.jpg'}
            alt={film.tenPhim || 'Poster'}
            style={{
              width: '100%',
              height: '350px',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
            {film.tenPhim}
          </Typography>
          <Stack direction="row" spacing={1} mb={3}>
            {film.theLoai.map((theLoai) => (
              <Chip
                key={theLoai._id}
                label={theLoai.tenTheLoai}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            ))}
          </Stack>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Rating value={film.diemTrungBinh} precision={0.5} readOnly />
            <Typography component="span" ml={1} sx={{ color: 'white' }}>
              ({film.danhGiaChiTiet?.length || 0} đánh giá)
            </Typography>
            {isAuthenticated && (
              <Button
                variant="contained"
                color={isFavorite ? "error" : "primary"}
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleToggleFavorite}
                sx={{ ml: 3, textTransform: 'none' }}
              >
                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </Button>
            )}
          </Box>
          <Typography variant="body1" paragraph sx={{ flexGrow: 1, mb: 4, color: '#e0e0e0' }}>
            {film.moTa}
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ color: '#e0e0e0' }}>
              <strong>Đạo diễn:</strong> {film.daoDien ? film.daoDien : 'Không rõ'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#e0e0e0' }}>
              <strong>Diễn viên:</strong> {Array.isArray(film.dienVien) && film.dienVien.length > 0 ? film.dienVien.join(', ') : 'Không rõ'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#e0e0e0' }}>
              <strong>Thời lượng:</strong> {film.thoiLuong ? film.thoiLuong : 'Không rõ'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#e0e0e0' }}>
              <strong>Năm phát hành:</strong> {typeof film.namPhatHanh === 'number' && film.namPhatHanh > 0 ? film.namPhatHanh : 'Không rõ'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#e0e0e0' }}>
              <strong>Quốc gia:</strong> {film.quocGia ? film.quocGia : 'Không rõ'}
            </Typography>
          </Box>
          {isAuthenticated && (
            <Button
              variant="contained"
              onClick={() => setOpenReviewDialog(true)}
              sx={{
                mt: 2,
                backgroundColor: '#E50914',
                '&:hover': {
                  backgroundColor: '#B30710',
                },
              }}
            >
              Viết đánh giá
            </Button>
          )}
        </Grid>
      </Grid>

      {film.loaiPhim === 'le' && film.videoUrl && (
        <Box sx={{ mt: 4, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Video
          </Typography>
          <Box sx={{
            width: '100%',
            aspectRatio: '16/9'
          }}>
            {film.videoUrl.includes('youtube.com/embed') ? (
              <iframe
                width="100%"
                height="500"
                src={film.videoUrl}
                title="Video Phim"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ aspectRatio: '16/9' }}
              />
            ) : (
              <video
                width="100%"
                height="500"
                controls
                src={film.videoUrl ? `http://localhost:3001/${film.videoUrl}` : undefined}
                title="Video Phim"
                style={{ aspectRatio: '16/9' }}
              />
            )}
          </Box>
        </Box>
      )}

      {film.loaiPhim === 'bo' && film.episodes && film.episodes.length > 0 && (
        <Box sx={{ mt: 4, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Danh sách Tập phim
          </Typography>
          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
            {film.episodes.map((_, index) => (
              <Button
                key={index}
                variant={currentEpisode === index ? "contained" : "outlined"}
                onClick={() => setCurrentEpisode(index)}
                size="small"
              >
                Tập {index + 1}
              </Button>
            ))}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              Đang phát: Tập {currentEpisode + 1}
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={handlePrevEpisode}
                disabled={currentEpisode === 0}
                sx={{ mr: 1 }}
              >
                Tập trước
              </Button>
              <Button
                variant="contained"
                onClick={handleNextEpisode}
                disabled={currentEpisode === (film.episodes.length - 1)}
              >
                Tập sau
              </Button>
            </Box>
          </Box>
          <Box sx={{
            width: '100%',
            aspectRatio: '16/9'
          }}>
            <video
              width="100%"
              height="500"
              controls
              src={film.episodes[currentEpisode] ? `http://localhost:3001/${film.episodes[currentEpisode]}` : undefined}
              title={`Video Tập ${currentEpisode + 1}`}
              style={{ aspectRatio: '16/9' }}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Đánh giá & Bình luận
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        {film.danhGiaChiTiet && film.danhGiaChiTiet.length > 0 ? (
          <Stack spacing={2}>
            {film.danhGiaChiTiet.map((danhGia) => (
              <Card key={danhGia._id} sx={{ bgcolor: '#1a1a1a', color: 'white', boxShadow: 'none' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      src={danhGia.nguoiDung.avatar ? `http://localhost:3001/uploads/avatars/${danhGia.nguoiDung.avatar}` : '/default-avatar.png'}
                      alt={danhGia.nguoiDung.hoTen}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {danhGia.nguoiDung.hoTen}
                    </Typography>
                  </Box>
                  <Rating value={danhGia.diem} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" paragraph>
                    {danhGia.nhanXet}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(danhGia.createdAt).toLocaleDateString()} {new Date(danhGia.createdAt).toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Chưa có đánh giá nào cho phim này.
          </Typography>
        )}
      </Box>

      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e1e1e', color: 'white' }}>Viết đánh giá của bạn</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1a1a1a', color: 'white', pt: 2 }}>
          <Typography component="legend" sx={{ mb: 1, color: 'white' }}>Đánh giá của bạn</Typography>
          <Rating
            name="review-rating"
            value={reviewRating}
            precision={0.5}
            onChange={(event, newValue) => {
              setReviewRating(newValue);
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Bình luận (tùy chọn)"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            sx={{
              '& label': { color: '#aaa' },
              '& input': { color: 'white' },
              '& textarea': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#777' },
                '&.Mui-focused fieldset': { borderColor: '#E50914' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e1e1e', pb: 2, pr: 2 }}>
          <Button onClick={() => setOpenReviewDialog(false)} sx={{ color: '#aaa' }}>Hủy</Button>
          <Button onClick={handleReviewSubmit} disabled={submitting || reviewRating === 0} variant="contained" sx={{ bgcolor: '#E50914', '&:hover': { bgcolor: '#B30710' } }}>
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FilmDetail; 