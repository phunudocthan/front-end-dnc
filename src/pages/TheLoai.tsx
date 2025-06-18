import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CardMedia,
} from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { theLoaiService } from '../services/theLoaiService';
import { filmService } from '../services/filmService';
import { ITheLoai, IFilm } from '../types';

const TheLoai = () => {
  const [theLoais, setTheLoais] = useState<ITheLoai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedTheLoai, setSelectedTheLoai] = useState<string | null>(null);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTheLoais = async () => {
      try {
        setLoading(true);
        const response = await theLoaiService.getAllCategories();
        setTheLoais(response.data.categories || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Có lỗi xảy ra khi tải danh sách thể loại');
      } finally {
        setLoading(false);
      }
    };

    fetchTheLoais();
  }, []);

  useEffect(() => {
    const fetchFilms = async () => {
      if (!selectedTheLoai) return;
      try {
        const res = await filmService.getAllFilms({ theLoai: selectedTheLoai, page, limit: 16, sort: '-createdAt' });
        setFilms(res.films);
        setTotalPages(Math.ceil(res.total / 16) || 1);
      } catch (err) {
        console.error("Error fetching films:", err);
      }
    };
    fetchFilms();
  }, [selectedTheLoai, page]);

  const filteredTheLoais = theLoais.filter((theLoai) =>
    theLoai.tenTheLoai.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thể loại phim
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <TextField
            placeholder="Tìm kiếm thể loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
          >
            <ToggleButton value="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {view === 'grid' ? (
          <Grid container spacing={3}>
            {filteredTheLoais.map((theLoai) => (
              <Grid item key={theLoai._id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  onClick={() => setSelectedTheLoai(theLoai._id)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      color="text.primary"
                    >
                      {theLoai.tenTheLoai}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {theLoai.moTa}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <List>
            {filteredTheLoais.map((theLoai) => (
              <ListItem
                key={theLoai._id}
                onClick={() => setSelectedTheLoai(theLoai._id)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemText
                  primary={theLoai.tenTheLoai}
                  secondary={theLoai.moTa}
                  primaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {filteredTheLoais.length === 0 && (
          <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
            Không tìm thấy thể loại nào
          </Typography>
        )}

        {selectedTheLoai && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Danh sách phim thuộc thể loại</Typography>
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
                      image={`http://localhost:3001/uploads/posters/${film.poster}`}
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
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TheLoai; 