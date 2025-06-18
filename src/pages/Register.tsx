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
  hoTen: yup
    .string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  matKhau: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  xacNhanMatKhau: yup
    .string()
    .oneOf([yup.ref('matKhau')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      hoTen: '',
      email: '',
      matKhau: '',
      xacNhanMatKhau: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { xacNhanMatKhau, ...registerData } = values;
        const response = await authService.dangKy(registerData);
        dispatch(setCredentials({ user: response.data.user, token: response.token }));
        navigate('/');
      } catch (error: any) {
        formik.setErrors({ email: error.response?.data?.message || 'Đăng ký thất bại' });
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
          Đăng ký
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="hoTen"
            label="Họ tên"
            name="hoTen"
            autoComplete="name"
            autoFocus
            value={formik.values.hoTen}
            onChange={formik.handleChange}
            error={formik.touched.hoTen && Boolean(formik.errors.hoTen)}
            helperText={formik.touched.hoTen && formik.errors.hoTen}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="xacNhanMatKhau"
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? 'text' : 'password'}
            id="xacNhanMatKhau"
            autoComplete="new-password"
            value={formik.values.xacNhanMatKhau}
            onChange={formik.handleChange}
            error={formik.touched.xacNhanMatKhau && Boolean(formik.errors.xacNhanMatKhau)}
            helperText={formik.touched.xacNhanMatKhau && formik.errors.xacNhanMatKhau}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            {formik.isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              {"Đã có tài khoản? Đăng nhập"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 