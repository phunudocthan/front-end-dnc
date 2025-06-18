import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, CardMedia, Box, Pagination, Stack, Chip, Rating
} from '@mui/material';
import { filmService } from '../services/filmService';
import { IFilm } from '../types';
import { Link } from 'react-router-dom';

const NamPhatHanhDetail = () => {
  const { id } = useParams();
  const [films, setFilms] = useState<IFilm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const isBefore2009 = id === 'before2009';
  const yearLabel = isBefore2009 ? 'Trước 2009' : id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      let params: any = { page, limit: 16, sort: '-createdAt' };
      if (isBefore2009) {
        params.namPhatHanh = 2008;
        params.before = true;
      } else {
        params.namPhatHanh = id;
      }
      const res = await filmService.getAllFilms(params);
      setFilms(res.films);
      setTotalPages(Math.ceil(res.films.length / 16) || 1);
      setLoading(false);
    })();
  }, [id, page]);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#E50914', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, fontSize: '1.5rem', mb: 2 }}>
           PHIM {yearLabel?.toUpperCase()}
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
                Không có phim nào cho năm này
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default NamPhatHanhDetail; 