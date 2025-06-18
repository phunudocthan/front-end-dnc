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

const YEAR_LIST = [
  { label: '2024', value: 2024 },
  { label: '2023', value: 2023 },
  { label: '2022', value: 2022 },
  { label: '2021', value: 2021 },
  { label: '2020', value: 2020 },
  { label: '2019', value: 2019 },
  { label: '2018', value: 2018 },
  { label: '2017', value: 2017 },
  { label: '2016', value: 2016 },
  { label: '2015', value: 2015 },
  { label: '2014', value: 2014 },
  { label: '2013', value: 2013 },
  { label: '2012', value: 2012 },
  { label: '2011', value: 2011 },
  { label: '2010', value: 2010 },
  { label: 'Trước 2009', value: 'before2009' },
];

const NamPhatHanh = () => {
  const [selectedYear, setSelectedYear] = useState<number | 'before2009' | null>(null);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilms = async () => {
      if (!selectedYear) return;
      setLoading(true);
      try {
        let params: any = { page, limit: 16, sort: '-createdAt' };
        if (selectedYear === 'before2009') {
          params.namPhatHanh = 2008;
          params.before = true;
        } else {
          params.namPhatHanh = selectedYear;
        }
        const res = await filmService.getAllFilms(params);
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
  }, [selectedYear, page]);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Năm phát hành
        </Typography>
        <List sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
          {YEAR_LIST.map((year) => (
            <ListItem
              key={year.value}
              onClick={() => { setSelectedYear(year.value as number | 'before2009'); setPage(1); }}
              sx={{ width: 'auto', cursor: 'pointer', mr: 2, mb: 1, borderRadius: 2, bgcolor: selectedYear === year.value ? 'primary.main' : 'background.paper', color: selectedYear === year.value ? 'white' : 'inherit', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
            >
              <ListItemText primary={year.label} />
            </ListItem>
          ))}
        </List>
        {selectedYear && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>Danh sách phim theo năm phát hành</Typography>
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
                    Không có phim nào cho năm này
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

export default NamPhatHanh; 