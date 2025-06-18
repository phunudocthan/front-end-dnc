import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CardMedia,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { filmService } from '../services/filmService';
import { IFilm } from '../types';

const COUNTRY_LIST = [
  { label: 'Việt Nam', value: 'vietnam' },
  { label: 'Hàn Quốc', value: 'korea' },
  { label: 'Trung Quốc', value: 'china' },
  { label: 'Mỹ', value: 'usa' },
  { label: 'Nhật Bản', value: 'japan' },
  { label: 'Thái Lan', value: 'thailand' },
  { label: 'Châu Âu', value: 'europe' },
];

const QuocGia = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilms = async () => {
      if (!selectedCountry) return;
      setLoading(true);
      try {
        const res = await filmService.getAllFilms({ quocGia: selectedCountry, page, limit: 16, sort: '-createdAt' });
        setFilms(res.data.films);
        setTotalPages(Math.ceil(res.data.films.length / 16) || 1);
      } catch (err) {
        setFilms([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, [selectedCountry, page]);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quốc gia
        </Typography>
        <List sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
          {COUNTRY_LIST.map((country) => (
            <ListItem
              key={country.value}
              onClick={() => { setSelectedCountry(country.value); setPage(1); }}
              sx={{ width: 'auto', cursor: 'pointer', mr: 2, mb: 1, borderRadius: 2, bgcolor: selectedCountry === country.value ? 'primary.main' : 'background.paper', color: selectedCountry === country.value ? 'white' : 'inherit', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
            >
              <ListItemText primary={country.label} />
            </ListItem>
          ))}
        </List>
        {selectedCountry && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>Danh sách phim theo quốc gia</Typography>
            {loading ? (
              <Typography>Đang tải...</Typography>
            ) : (
              <>
                <Grid container spacing={2}>
                  {films.map((film) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={film._id}>
                      <Card
                        component={Link}
                        to={`/films/${film._id}`}
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
                      >
                        <CardMedia
                          component="img"
                          image={`http://localhost:5000/uploads/posters/${film.poster}`}
                          alt={film.tenPhim}
                          sx={{ height: 300, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {film.tenPhim}
                          </Typography>
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
                    Không có phim nào cho quốc gia này
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QuocGia; 