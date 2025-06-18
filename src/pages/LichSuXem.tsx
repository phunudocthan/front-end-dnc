import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { lichSuXemService } from '../services/api';
import { ILichSuXem } from '../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const LichSuXem: React.FC = () => {
  const [lichSuXem, setLichSuXem] = useState<ILichSuXem[]>([]);
  const navigate = useNavigate();

  const fetchLichSuXem = async () => {
    try {
      const response = await lichSuXemService.layLichSuXemCuaToi();
      setLichSuXem(response.data.data.lichSuXem);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử xem:', error);
      toast.error('Không thể tải lịch sử xem');
    }
  };

  useEffect(() => {
    fetchLichSuXem();
  }, []);

  const handleXoaKhoiLichSuXem = async (id: string) => {
    try {
      await lichSuXemService.xoaKhoiLichSuXem(id);
      toast.success('Đã xóa khỏi lịch sử xem');
      fetchLichSuXem(); // Refresh danh sách
    } catch (error) {
      console.error('Lỗi khi xóa khỏi lịch sử xem:', error);
      toast.error('Không thể xóa khỏi lịch sử xem');
    }
  };

  const handleXoaToanBoLichSuXem = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem?')) {
      try {
        await lichSuXemService.xoaToanBoLichSuXem();
        toast.success('Đã xóa toàn bộ lịch sử xem');
        setLichSuXem([]);
      } catch (error) {
        console.error('Lỗi khi xóa toàn bộ lịch sử xem:', error);
        toast.error('Không thể xóa toàn bộ lịch sử xem');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch Sử Xem
        </Typography>
        {lichSuXem.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleXoaToanBoLichSuXem}
          >
            Xóa Tất Cả
          </Button>
        )}
      </Box>

      {lichSuXem.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          Bạn chưa xem phim nào
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {lichSuXem.map((item) => {
            return (
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
                      Thời gian xem: {new Date(item.thoiGianXemCuoi).toLocaleString()}
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
                    onClick={() => handleXoaKhoiLichSuXem(item._id)}
                  >
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default LichSuXem; 