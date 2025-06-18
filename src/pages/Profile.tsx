import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Rating,
  Stack,
  Divider,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CardMedia,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { IUser, IDanhGia } from '../types';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    hoTen: '',
    email: '',
  });
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        if (!authUser?._id) return;
        const response = await userService.getProfile();
        setUser(response.data.user);
        console.log('DEBUG (Profile): User object received from API:', response.data.user);
        setEditForm({
          hoTen: response.data.user.hoTen,
          email: response.data.user.email,
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Có lỗi xảy ra khi tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser?._id]);

  const handleEditSubmit = async () => {
    try {
      if (!user?._id) return;
      setSubmitting(true);

      const formData = new FormData();
      formData.append('hoTen', editForm.hoTen);
      formData.append('email', editForm.email);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await userService.updateProfile(formData);
      setUser(response.data.user);
      updateUser(response.data.user);
      setOpenEditDialog(false);
      setAvatar(null);
    } catch (error) {
      console.error('Error updating user profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePasswordSubmit = async () => {
    setChangePasswordError(null);
    setChangePasswordSuccess(null);
    if (changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword) {
      setChangePasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    if (changePasswordForm.newPassword.length < 6) {
      setChangePasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      setSubmitting(true);
      await userService.changePassword({
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      });
      setChangePasswordSuccess('Đổi mật khẩu thành công!');
      setOpenChangePasswordDialog(false);
      setChangePasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      setChangePasswordError(error.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log('DEBUG (Profile): Selected avatar file:', selectedFile);
      setAvatar(selectedFile);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container>
        <Typography color="error">{error || 'Không tìm thấy người dùng'}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user.avatar ? `http://localhost:3001/${user.avatar}` : '/default-avatar.png'}
              alt={user.hoTen}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {user.hoTen[0]}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.hoTen}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenEditDialog(true)}
              sx={{ mt: 2 }}
            >
              Chỉnh sửa thông tin
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenChangePasswordDialog(true);
                setChangePasswordError(null);
                setChangePasswordSuccess(null);
              }}
              sx={{ mt: 2, ml: 2 }}
            >
              Đổi mật khẩu
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Đánh giá của tôi
          </Typography>
          <Stack spacing={2}>
            {user.danhGia?.map((danhGia) => (
              <Card key={danhGia._id}>
                <CardContent>
                  <Box
                    component={Link}
                    to={`/films/${danhGia.phim._id}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      textDecoration: 'none',
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={danhGia.phim.poster ? `http://localhost:3001/${danhGia.phim.poster}` : '/default-poster.jpg'}
                      alt={danhGia.phim.tenPhim}
                      sx={{ width: 80, height: 120, objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <Box>
                      <Typography variant="h6" color="text.primary">
                        {danhGia.phim.tenPhim}
                      </Typography>
                      <Rating value={danhGia.diem} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body1">{danhGia.nhanXet}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Đánh giá vào:{' '}
                    {new Date(danhGia.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {(user.danhGia?.length || 0) === 0 && (
              <Typography textAlign="center" color="text.secondary">
                Bạn chưa có đánh giá nào
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Họ tên"
              value={editForm.hoTen}
              onChange={(e) =>
                setEditForm({ ...editForm, hoTen: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button variant="outlined" component="label" fullWidth>
              {avatar ? 'Thay đổi ảnh đại diện' : 'Tải lên ảnh đại diện'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
            {avatar && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Đã chọn: {avatar.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleEditSubmit} disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              type={showCurrentPassword ? 'text' : 'password'}
              value={changePasswordForm.currentPassword}
              onChange={(e) =>
                setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showNewPassword ? 'text' : 'password'}
              value={changePasswordForm.newPassword}
              onChange={(e) =>
                setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type={showConfirmNewPassword ? 'text' : 'password'}
              value={changePasswordForm.confirmNewPassword}
              onChange={(e) =>
                setChangePasswordForm({ ...changePasswordForm, confirmNewPassword: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      edge="end"
                    >
                      {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {changePasswordError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {changePasswordError}
              </Typography>
            )}
            {changePasswordSuccess && (
              <Typography color="success.main" sx={{ mb: 2 }}>
                {changePasswordSuccess}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordDialog(false)}>Hủy</Button>
          <Button onClick={handleChangePasswordSubmit} disabled={submitting}>
            {submitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;