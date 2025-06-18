import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, CardMedia, Box, Pagination, Stack, Chip, Rating
} from '@mui/material';
import { filmService } from '../services/filmService';
import { theLoaiService } from '../services/theLoaiService';
import { IFilm, ITheLoai } from '../types';
import { Link } from 'react-router-dom';

const TheLoaiDetail = () => {
  const { id } = useParams();
  const [theLoai, setTheLoai] = useState<ITheLoai | null>(null);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await theLoaiService.getCategoryById(id);
        console.log('🔗 Raw response from getCategoryById:', res);
        if (res && res.category) {
          setTheLoai(res.category);
          console.log('✅ theLoai set to:', res.category);
        } else {
          console.error('❌ getCategoryById returned no category or an invalid response:', res);
          setTheLoai(null);
        }
      } catch (error) {
        console.error('❌ Error fetching category details:', error);
        setTheLoai(null);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await filmService.getAllFilms({ theLoai: id, page, limit: 16, sort: '-createdAt' });
        console.log('🔗 Raw response from getAllFilms:', res);
        if (res && res.films) {
          setFilms(res.films);
          setTotalPages(Math.ceil(res.total / 16) || 1);
          console.log('✅ films set to:', res.films);
        } else {
          console.error('❌ getAllFilms returned no films or an invalid response:', res);
          setFilms([]);
          setTotalPages(1);
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching films for category:', error);
        setFilms([]);
        setTotalPages(1);
        setLoading(false);
      }
    })();
  }, [id, page]);

  if (!theLoai) {
    console.log('Waiting for theLoai to be set...');
    return <Container><Typography>Đang tải...</Typography></Container>;
  }

  // Debugging: Log theLoai and films right before render
  console.log('✨ Rendering with theLoai:', theLoai);
  console.log('✨ Rendering with films:', films);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#E50914', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, fontSize: '1.5rem', mb: 2 }}>
          {['PHIM LẺ', 'PHIM BỘ'].includes(theLoai.tenTheLoai?.toUpperCase() || '')
            ? theLoai.tenTheLoai?.toUpperCase()
            : `PHIM ${theLoai.tenTheLoai?.toUpperCase() || ''}`}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ textTransform: 'uppercase', fontSize: '1rem', fontWeight: 500 }}>
          {theLoai.moTa?.toUpperCase()}
        </Typography>
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
                    <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                      <Typography gutterBottom variant="h6" component="div" noWrap sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '1rem' }}>
                        {film.tenPhim.toUpperCase()}
                      </Typography>
                      <Stack direction="row" spacing={1} mb={1}>
                        {film.theLoai.slice(0, 2).map((theLoai) => (
                          <Chip key={theLoai._id} label={theLoai.tenTheLoai} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }} />
                        ))}
                      </Stack>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={film.diemTrungBinh} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          ({film.danhGia.length})
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
              </Box>
            )}
            {films.length === 0 && (
              <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                Không có phim nào cho thể loại này
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default TheLoaiDetail; 