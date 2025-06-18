import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store';
import theme from './theme';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Films from './pages/Films';
import FilmDetail from './pages/FilmDetail';
import TheLoai from './pages/TheLoai';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import SeriesFilms from './pages/SeriesFilms';
import QuocGia from './pages/QuocGia';
import NamPhatHanh from './pages/NamPhatHanh';
import TheLoaiDetail from './pages/TheLoaiDetail';
import QuocGiaDetail from './pages/QuocGiaDetail';
import NamPhatHanhDetail from './pages/NamPhatHanhDetail';
import LichSuXem from './pages/LichSuXem';
import YeuThich from './pages/YeuThich';
import FilterPage from './pages/FilterPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="films" element={<Films />} />
              <Route path="films/:id" element={<FilmDetail />} />
              <Route path="films?type=series" element={<SeriesFilms />} />
              <Route path="series" element={<SeriesFilms />} />
              <Route path="theloai" element={<TheLoai />} />
              <Route path="theloai/:id" element={<TheLoaiDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin/*" element={<Admin />} />
              <Route path="quocgia" element={<QuocGia />} />
              <Route path="quocgia/:id" element={<QuocGiaDetail />} />
              <Route path="namphathanh" element={<NamPhatHanh />} />
              <Route path="namphathanh/:id" element={<NamPhatHanhDetail />} />
              <Route path="lichsuxem" element={<LichSuXem />} />
              <Route path="yeuthich" element={<YeuThich />} />
              <Route path="filter" element={<FilterPage />} />
              <Route path="search" element={<Films />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
