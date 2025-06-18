import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { yeuThichService } from '../services/api';
import { IYeuThich } from '../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const YeuThich: React.FC = () => {
  const [yeuThichs, setYeuThichs] = useState<IYeuThich[]>([]);
  const navigate = useNavigate();

  const fetchYeuThichs = async () => {
    try {
      const response = await yeuThichService.layDanhSachYeuThichCuaToi();
      setYeuThichs(response.data.data.yeuThichs);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu thích:', error);
      toast.error('Không thể tải danh sách yêu thích');
    }
  };

  useEffect(() => {
    fetchYeuThichs();
  }, []);

  const handleXoaKhoiYeuThich = async (id: string) => {
    try {
      await yeuThichService.xoaKhoiYeuThich(id);
      toast.success('Đã xóa khỏi danh sách yêu thích');
      fetchYeuThichs(); // Refresh danh sách
    } catch (error) {
      console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
      toast.error('Không thể xóa khỏi danh sách yêu thích');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Phim Yêu Thích
      </Typography>

      {yeuThichs.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          Bạn chưa có phim yêu thích nào
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {yeuThichs.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="350"
                  image={`http://localhost:3001/${item.phim.poster}`}
                  alt={item.phim.tenPhim}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/films/${item.phim._id}`)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {item.phim.tenPhim}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thêm vào: {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  onClick={() => handleXoaKhoiYeuThich(item._id)}
                >
                  <DeleteIcon sx={{ color: 'white' }} />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default YeuThich; 