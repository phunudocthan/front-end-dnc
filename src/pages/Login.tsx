import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { authService } from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  matKhau: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      matKhau: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.dangNhap(values);
        dispatch(setCredentials({ user: response.data.user, token: response.token }));
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/';
      } catch (error: any) {
        formik.setErrors({ email: error.response?.data?.message || 'Đăng nhập thất bại' });
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="matKhau"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            id="matKhau"
            autoComplete="current-password"
            value={formik.values.matKhau}
            onChange={formik.handleChange}
            error={formik.touched.matKhau && Boolean(formik.errors.matKhau)}
            helperText={formik.touched.matKhau && formik.errors.matKhau}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/register" variant="body2">
              {"Chưa có tài khoản? Đăng ký"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 