import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Chip,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Divider,
  Rating,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box as MuiBox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Movie as MovieIcon,
  RateReview as RateReviewIcon,
} from '@mui/icons-material';
import { filmService } from '../services/filmService';
import { theLoaiService } from '../services/theLoaiService';
import { userService } from '../services/userService';
import { danhGiaService } from '../services/danhGiaService';
import { adminService } from '../services/adminService';
import { IFilm, ITheLoai, IUser, IDanhGia, IDanhGiaWithDetails, IPopulatedDanhGia } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { IDashboardStats } from '../services/adminService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface FilmFormData {
  tenPhim: string;
  moTa: string;
  thoiLuong: string;
  poster: string;
  videoUrl: string;
  theLoaiIds: string[];
  daoDien: string;
  namPhatHanh: string;
  dienVien: string;
  quocGia: string;
  loaiPhim: 'le' | 'bo';
  soTap: string;
  episodes: { name: string; url: string; }[];
}

interface TheLoaiFormData {
  tenTheLoai: string;
  moTa: string;
}

interface FilmWithCategories extends IFilm {
  theLoai: ITheLoai[];
}

const defaultFilmForm: FilmFormData = {
  tenPhim: '',
  moTa: '',
  thoiLuong: '',
  poster: '',
  videoUrl: '',
  theLoaiIds: [],
  daoDien: '',
  namPhatHanh: '',
  dienVien: '',
  quocGia: '',
  loaiPhim: 'le',
  soTap: '',
  episodes: [],
};

const Admin: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [films, setFilms] = useState<FilmWithCategories[]>([]);
  const [categories, setCategories] = useState<ITheLoai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Film dialog state
  const [openFilmDialog, setOpenFilmDialog] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<FilmWithCategories | null>(null);
  const [filmForm, setFilmForm] = useState<FilmFormData>(defaultFilmForm);
  const [poster, setPoster] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadedEpisodeFiles, setUploadedEpisodeFiles] = useState<Map<string, File>>(new Map());

  // Category dialog state
  const [openTheLoaiDialog, setOpenTheLoaiDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ITheLoai | null>(null);
  const [theLoaiForm, setTheLoaiForm] = useState<TheLoaiFormData>({
    tenTheLoai: '',
    moTa: '',
  });

  // Delete confirmation dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'film' | 'theLoai' | 'user' | 'rating'>('film');
  const [deleteId, setDeleteId] = useState<string>('');

  // New states for users management
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [userForm, setUserForm] = useState<{ hoTen: string; email: string; role: 'user' | 'admin' }>(
    { hoTen: '', email: '', role: 'user' }
  );

  // New states for ratings management
  const [ratings, setRatings] = useState<IDanhGiaWithDetails[]>([]);
  const [selectedRating, setSelectedRating] = useState<IDanhGiaWithDetails | null>(null);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);

  // New states for statistics
  const [stats, setStats] = useState<IDashboardStats>({
    totalUsers: 0,
    totalFilms: 0,
    totalRatings: 0,
    averageRating: 0,
    topRatedFilms: [],
    mostActiveUsers: [],
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [filmsRes, categoriesRes, usersRes, ratingsRes, statsRes] = await Promise.all([
          filmService.getAllFilms({ limit: 1000 }),
          theLoaiService.getAllCategories(),
          userService.getAllUsers(),
          danhGiaService.getAllRatings(),
          adminService.getDashboardStats(),
        ]);
        const categoriesList = categoriesRes.data?.categories || [];
        const filmsList = filmsRes.films || [];
        const usersList = usersRes.data?.users || [];
        const ratingsList = ratingsRes.data?.ratings || [];

        console.log('DEBUG: Admin.tsx - filmsList (after assignment):', filmsList);
        console.log('DEBUG: Admin.tsx - usersList (after assignment):', usersList);
        console.log('DEBUG: Admin.tsx - ratingsList (after assignment):', ratingsList);

        const filmsWithCategories: FilmWithCategories[] = (filmsList || []).map(film => ({
          ...film,
          theLoai: (film.theLoaiIds || []).map(id =>
            (categoriesList || []).find(cat => cat._id === id)
          ).filter(Boolean) as ITheLoai[],
        }));
        
    // Enrich ratings with user names and film titles
    const enrichedRatings: IDanhGiaWithDetails[] = ratingsList.map((rating: IPopulatedDanhGia) => {
      return {
        _id: rating._id,
        // Map populated object to string ID for IDanhGia
        nguoiDung: rating.nguoiDung._id,
        // Map populated object to string ID for IDanhGia
        phim: rating.phim._id,
        // Map diem to rating for IDanhGiaWithDetails
        rating: rating.diem,
        // Map nhanXet to comment for IDanhGiaWithDetails
        comment: rating.nhanXet,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
        userName: rating.nguoiDung?.hoTen || 'N/A',
        filmName: rating.phim?.tenPhim || 'N/A',
      };
    });
        setFilms(filmsWithCategories);
        setCategories(categoriesList);
        setUsers(usersList);
        setRatings(enrichedRatings);
        setStats(statsRes);
        console.log('DEBUG: Films fetched and set in state:', filmsWithCategories);
        console.log('DEBUG: Users fetched:', usersList);
        console.log('DEBUG: Ratings fetched (raw):', ratingsList);
        console.log('DEBUG: Enriched Ratings:', enrichedRatings);
      } catch (err: any) {
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeFilmForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name === 'dienVien' || name === 'daoDien') {
      setFilmForm({
        ...filmForm,
        [name]: typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : [],
      });
    } else if (name === 'namPhatHanh' || name === 'soTap') {
      setFilmForm({
        ...filmForm,
        [name]: value as string,
      });
    } else if (name === 'episodes') {
      setFilmForm({
        ...filmForm,
        [name]: Array.isArray(value) ? value : [],
      });
    } else if (name === 'loaiPhim') {
      setFilmForm(prev => {
        const newForm = { ...prev, [name]: value as 'le' | 'bo' };
        if (newForm.loaiPhim === 'le') {
          setUploadedEpisodeFiles(new Map());
          newForm.episodes = [];
        } else {
          setVideoFile(null);
          newForm.videoUrl = '';
        }
        return newForm;
      });
    } else {
      setFilmForm({
        ...filmForm,
        [name as keyof FilmFormData]: value as string,
      });
    }
  };

  const handleLoaiPhimChange = (e: SelectChangeEvent<'le' | 'bo'>) => {
    const newLoaiPhim = e.target.value as 'le' | 'bo';
    setFilmForm(prev => {
      const newForm = { ...prev, loaiPhim: newLoaiPhim };
      if (newForm.loaiPhim === 'le') {
        setUploadedEpisodeFiles(new Map());
        newForm.episodes = [];
      } else {
        setVideoFile(null);
        newForm.videoUrl = '';
      }
      return newForm;
    });
  };

  const handleChangeTheLoaiForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTheLoaiForm({
      ...theLoaiForm,
      [name]: value,
    });
  };

  const handleChangeUserForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name as keyof IUser]: value as string,
    });
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPoster(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleEpisodeFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFilmForm(prev => {
        const updatedEpisodes = [...prev.episodes];
        updatedEpisodes[index] = { ...updatedEpisodes[index], name: file.name, url: '' };
        setUploadedEpisodeFiles(prevMap => new Map(prevMap).set(file.name, file));
        return { ...prev, episodes: updatedEpisodes };
      });
    }
  };

  const addEpisodeField = () => {
    setFilmForm(prev => ({
      ...prev,
      episodes: [...prev.episodes, { name: '', url: '' }],
    }));
  };

  const removeEpisodeField = (index: number) => {
    setFilmForm(prev => ({
      ...prev,
      episodes: prev.episodes.filter((_, i) => i !== index),
    }));
    setUploadedEpisodeFiles(prev => {
      const newMap = new Map(prev);
      const episodeNameToRemove = filmForm.episodes[index]?.name;
      if (episodeNameToRemove) {
        newMap.delete(episodeNameToRemove);
      }
      return newMap;
    });
  };

  const handleFilmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

      const formData = new FormData();

    // Append text fields
    formData.append('tenPhim', filmForm.tenPhim);
    formData.append('moTa', filmForm.moTa);
    formData.append('thoiLuong', filmForm.thoiLuong);
    formData.append('namPhatHanh', filmForm.namPhatHanh.toString());
    formData.append('quocGia', filmForm.quocGia);
    formData.append('loaiPhim', filmForm.loaiPhim);
    formData.append('soTap', filmForm.soTap.toString());
    formData.append('theLoaiIds', JSON.stringify(filmForm.theLoaiIds));
    formData.append('dienVien', JSON.stringify(filmForm.dienVien));
    formData.append('daoDien', JSON.stringify(filmForm.daoDien));

    // Append poster file if exists
    if (poster) {
      formData.append('poster', poster);
      console.log('DEBUG: Admin.tsx - Appending poster:', poster.name);
    }

    // Append video file if exists (for 'Phim lẻ')
    if (filmForm.loaiPhim === 'le' && videoFile) {
      formData.append('video', videoFile);
      console.log('DEBUG: Admin.tsx - Appending video (single film):', videoFile.name);
    }

    // Append episode files and update episodes array for 'Phim bộ'
          if (filmForm.loaiPhim === 'bo') {
      const episodesToSubmit = filmForm.episodes.map(episode => {
        // If an episode has a newly uploaded file, we need to handle it.
        // Otherwise, it's an existing episode or a new one without a file yet.
        if (uploadedEpisodeFiles.has(episode.name)) {
          const file = uploadedEpisodeFiles.get(episode.name);
          if (file) {
            formData.append('episodeFiles', file, episode.name); // Append with original name
            console.log(`DEBUG: Admin.tsx - Appending episode file: ${file.name} for episode name: ${episode.name}`);
            return { name: episode.name, url: file.name }; // Return the original name for the backend to look up
          }
        }
        return { name: episode.name, url: episode.url }; // For existing episodes without new files, keep their current name/url
      });
      formData.append('clientEpisodesData', JSON.stringify(episodesToSubmit));
      console.log('DEBUG: Admin.tsx - Appending clientEpisodesData:', JSON.stringify(episodesToSubmit));
    }

    // Log all FormData entries for debugging
    console.log('DEBUG: Admin.tsx - FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    try {
      if (selectedFilm) {
        await filmService.updateFilm(selectedFilm._id, formData);
      } else {
        await filmService.createFilm(formData);
      }
      setOpenFilmDialog(false);
      setSelectedFilm(null);
      resetFilmForm();
      // Re-fetch data to update the list
      const [filmsRes, categoriesRes, usersRes, ratingsRes, statsRes] = await Promise.all([
        filmService.getAllFilms({ limit: 1000 }),
        theLoaiService.getAllCategories(),
        userService.getAllUsers(),
        danhGiaService.getAllRatings(),
        adminService.getDashboardStats(),
      ]);
      const categoriesList = categoriesRes.data?.categories || [];
      const filmsList = filmsRes.films || [];
      const filmsWithCategories: FilmWithCategories[] = (filmsList || []).map(film => ({
        ...film,
        theLoai: (film.theLoaiIds || []).map(id =>
          (categoriesList || []).find(cat => cat._id === id)
        ).filter(Boolean) as ITheLoai[],
      }));
      setFilms(filmsWithCategories);
      setCategories(categoriesList);
      setUsers(usersRes.data?.users || []);
      setRatings(ratingsRes.data?.ratings || []);
      setStats(statsRes);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError('Lỗi khi lưu phim: ' + (err.response?.data?.message || err.message));
      console.error('Film submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTheLoaiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await theLoaiService.updateCategory(selectedCategory._id, theLoaiForm);
      } else {
        await theLoaiService.createCategory(theLoaiForm);
      }

      const response = await theLoaiService.getAllCategories();
      const categoriesList = response.data?.categories || [];
      setCategories(categoriesList);
      setOpenTheLoaiDialog(false);
      setSelectedCategory(null);
      setTheLoaiForm({ tenTheLoai: '', moTa: '' });
      setVideoFile(null);
      setUploadedEpisodeFiles(new Map());
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Có lỗi xảy ra khi lưu thể loại. Vui lòng thử lại sau.');
    }
  };

  const handleDelete = async () => {
    try {
      switch (deleteType) {
        case 'film':
          await filmService.deleteFilm(deleteId);
          setFilms(films.filter(film => film._id !== deleteId));
          break;
        case 'theLoai':
          await theLoaiService.deleteCategory(deleteId);
          setCategories(categories.filter(cat => cat._id !== deleteId));
          break;
        case 'user':
          await userService.deleteUser(deleteId);
          setUsers(users.filter(user => user._id !== deleteId));
          break;
        case 'rating':
          await danhGiaService.deleteRatingAdmin(deleteId);
          setRatings(ratings.filter(rating => rating._id !== deleteId));
          break;
      }
      setOpenDeleteDialog(false);
      setDeleteId('');
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const resetFilmForm = () => {
    setFilmForm(defaultFilmForm);
    setPoster(null);
    setVideoFile(null);
    setUploadedEpisodeFiles(new Map());
    setSelectedFilm(null);
  };

  const resetTheLoaiForm = () => {
    setTheLoaiForm({
      tenTheLoai: '',
      moTa: '',
    });
    setSelectedCategory(null);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser._id, userForm);
      } else {
        await userService.createUser(userForm);
      }
      const response = await userService.getAllUsers();
      const usersList = response.data?.users || [];
      setUsers(usersList);
      setOpenUserDialog(false);
      setSelectedUser(null);
      setUserForm({ hoTen: '', email: '', role: 'user' });
    } catch (error) {
      console.error('Error submitting user:', error);
      setError('Có lỗi xảy ra khi lưu người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleUserEdit = (user: IUser) => {
    setSelectedUser(user);
    setUserForm({
      hoTen: user.hoTen,
      email: user.email,
      role: user.role as 'user' | 'admin',
    });
    setOpenUserDialog(true);
  };

  const handleUserDelete = async (userId: string) => {
    setDeleteType('user');
    setDeleteId(userId);
    setOpenDeleteDialog(true);
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await userService.updateUserStatus(userId, { blocked: !currentStatus });
      const response = await userService.getAllUsers();
      const usersList = response.data?.users || [];
      setUsers(usersList);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Có lỗi xảy ra khi cập nhật trạng thái người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleRatingDelete = async (ratingId: string) => {
    setDeleteType('rating');
    setDeleteId(ratingId);
    setOpenDeleteDialog(true);
  };

  const handleFilmEdit = (film: FilmWithCategories) => {
    setSelectedFilm(film);
    setFilmForm({
      tenPhim: film.tenPhim,
      moTa: film.moTa,
      thoiLuong: film.thoiLuong,
      poster: film.poster || '',
      videoUrl: film.videoUrl || '',
      theLoaiIds: film.theLoai.map(cat => cat._id),
      daoDien: film.daoDien.join(','),
      namPhatHanh: film.namPhatHanh.toString(),
      dienVien: film.dienVien.join(','),
      quocGia: film.quocGia,
      loaiPhim: film.loaiPhim,
      soTap: film.soTap ? film.soTap.toString() : '',
      episodes: film.episodes?.map(url => ({
        name: url.split('/').pop() || '',
        url: url,
      })) || [],
    });
    setPoster(null);
    setVideoFile(null);
    setUploadedEpisodeFiles(new Map());
    setOpenFilmDialog(true);
  };

  const handleTheLoaiEdit = (category: ITheLoai) => {
    setSelectedCategory(category);
    setTheLoaiForm({
      tenTheLoai: category.tenTheLoai,
      moTa: category.moTa || '',
    });
    setOpenTheLoaiDialog(true);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Thống kê" />
          <Tab label="Quản lý Phim" />
          <Tab label="Quản lý Thể loại" />
          <Tab label="Quản lý Người dùng" />
          <Tab label="Quản lý Đánh giá" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thống kê chung
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, py: 2 }}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Tổng số người dùng
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h3" color="primary.main">
                    {stats.totalUsers}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, py: 2 }}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Tổng số phim
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MovieIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
                  <Typography variant="h3" color="secondary.main">
                    {stats.totalFilms}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, py: 2 }}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Tổng số đánh giá
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RateReviewIcon sx={{ fontSize: 40, mr: 2, color: 'info.main' }} />
                  <Typography variant="h3" color="info.main">
                    {stats.totalRatings}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, py: 2 }}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Điểm đánh giá trung bình
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StarIcon sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
                  <Typography variant="h3" color="warning.main">
                    {(stats.averageRating || 0).toFixed(1)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Phim được đánh giá cao nhất
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên phim</TableCell>
                    <TableCell align="right">Điểm trung bình</TableCell>
                    <TableCell align="right">Số lượt đánh giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topRatedFilms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Không có dữ liệu phim được đánh giá cao nhất.
                      </TableCell>
                    </TableRow>
                  ) : (
                    console.log('DEBUG: Admin.tsx - topRatedFilms data:', stats.topRatedFilms),
                    stats.topRatedFilms.map((film) => (
                      <TableRow key={film._id}>
                        <TableCell>{film.tenPhim}</TableCell>
                        <TableCell align="right">
                          <Rating value={film.diemTrungBinh} precision={0.1} readOnly size="small" />
                        </TableCell>
                        <TableCell align="right">{film.totalRatings}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Người dùng hoạt động nhiều nhất
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Số lượt đánh giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.mostActiveUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Không có dữ liệu người dùng hoạt động nhiều nhất.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stats.mostActiveUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.hoTen}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="right">{user.totalRatings}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setOpenFilmDialog(true); resetFilmForm(); }}
          >
            Thêm Phim Mới
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên phim</TableCell>
                <TableCell>Loại phim</TableCell>
                <TableCell>Quốc gia</TableCell>
                <TableCell>Năm phát hành</TableCell>
                <TableCell>Đạo diễn</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {films.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có phim nào.
                  </TableCell>
                </TableRow>
              ) : (
                films.map((film) => (
                  <TableRow key={film._id}>
                    <TableCell>{film.tenPhim}</TableCell>
                    <TableCell>{film.loaiPhim === 'le' ? 'Phim lẻ' : 'Phim bộ'}</TableCell>
                    <TableCell>{film.quocGia}</TableCell>
                    <TableCell>{film.namPhatHanh}</TableCell>
                    <TableCell>{film.daoDien}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {film.theLoai?.map((cat) => (
                          <Chip key={cat._id} label={cat.tenTheLoai} size="small" />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleFilmEdit(film)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => {
                        setDeleteId(film._id);
                        setDeleteType('film');
                        setOpenDeleteDialog(true);
                      }} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setOpenTheLoaiDialog(true); resetTheLoaiForm(); }}
          >
            Thêm Thể Loại Mới
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên thể loại</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Không có thể loại nào.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.tenTheLoai}</TableCell>
                    <TableCell>{category.moTa}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleTheLoaiEdit(category)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => {
                        setDeleteId(category._id);
                        setDeleteType('theLoai');
                        setOpenDeleteDialog(true);
                      }} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setOpenUserDialog(true); setUserForm({ hoTen: '', email: '', role: 'user' }); setSelectedUser(null); }}
          >
            Thêm Người Dùng Mới
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có người dùng nào.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.hoTen}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.trangThai === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        color={user.trangThai === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleUserEdit(user)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleUserStatusToggle(user._id, user.trangThai === 'active')} size="small">
                        {user.trangThai === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      </IconButton>
                      <IconButton onClick={() => {
                        setDeleteId(user._id);
                        setDeleteType('user');
                        setOpenDeleteDialog(true);
                      }} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tab} index={4}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Phim</TableCell>
                <TableCell align="right">Điểm</TableCell>
                <TableCell>Bình luận</TableCell>
                <TableCell>Ngày đánh giá</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có đánh giá nào.
                  </TableCell>
                </TableRow>
              ) : (
                ratings.map((rating) => (
                  <TableRow key={rating._id}>
                    <TableCell>{rating.userName}</TableCell>
                    <TableCell>{rating.filmName}</TableCell>
                    <TableCell align="right"><Rating value={rating.rating} readOnly size="small" /></TableCell>
                    <TableCell>{rating.comment}</TableCell>
                    <TableCell>{new Date(rating.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        setDeleteId(rating._id);
                        setDeleteType('rating');
                        setOpenDeleteDialog(true);
                      }} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Film Dialog */}
      <Dialog open={openFilmDialog} onClose={() => setOpenFilmDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>{selectedFilm ? 'Chỉnh sửa phim' : 'Thêm phim mới'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFilmSubmit} id="film-form">
            <TextField
              label="Tên phim"
              name="tenPhim"
              value={filmForm.tenPhim}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Mô tả"
              name="moTa"
              value={filmForm.moTa}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              label="Thời lượng (ví dụ: 1h30m hoặc 25 phút / tập)"
              name="thoiLuong"
              value={filmForm.thoiLuong}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Loại phim</InputLabel>
              <Select
                name="loaiPhim"
                value={filmForm.loaiPhim}
                onChange={handleLoaiPhimChange}
                required
              >
                <MenuItem value="le">Phim lẻ</MenuItem>
                <MenuItem value="bo">Phim bộ</MenuItem>
              </Select>
            </FormControl>
            {filmForm.loaiPhim === 'bo' && (
              <TextField
                label="Số tập"
                name="soTap"
                type="number"
                value={filmForm.soTap}
                onChange={handleChangeFilmForm}
                fullWidth
                margin="normal"
                required
              />
            )}
            <TextField
              label="Năm phát hành"
              name="namPhatHanh"
              type="number"
              value={filmForm.namPhatHanh}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Đạo diễn"
              name="daoDien"
              value={filmForm.daoDien}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Diễn viên (cách nhau bởi dấu phẩy)"
              name="dienVien"
              value={filmForm.dienVien}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quốc gia"
              name="quocGia"
              value={filmForm.quocGia}
              onChange={handleChangeFilmForm}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Thể loại</InputLabel>
              <Select
                name="theLoaiIds"
                multiple
                value={filmForm.theLoaiIds}
                onChange={(e) => setFilmForm({ ...filmForm, theLoaiIds: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[] })}
                label="Thể loại"
                required
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const category = categories.find(cat => cat._id === value);
                      return <Chip key={value} label={category ? category.tenTheLoai : value} />;
                    })}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.tenTheLoai}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Tải lên Poster
              <input type="file" hidden onChange={handlePosterChange} name="poster" />
            </Button>
            {poster ? (
              <Typography variant="body2" sx={{ mt: 1 }}>{poster.name}</Typography>
            ) : (
              filmForm.poster && (
                <Typography variant="body2" sx={{ mt: 1 }}>{filmForm.poster.startsWith('blob:') ? 'Poster đã chọn' : `Poster hiện tại: ${filmForm.poster}`}</Typography>
              )
            )}

            {filmForm.loaiPhim === 'le' && (
              <Box>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mt: 2 }}
                >
                  Tải lên Video (Phim lẻ)
                  <input type="file" hidden onChange={handleVideoChange} name="video" accept="video/*" />
                </Button>
                {videoFile ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>{videoFile.name}</Typography>
                ) : (
                  filmForm.videoUrl && (
                    <Typography variant="body2" sx={{ mt: 1 }}>{`Video hiện tại: ${filmForm.videoUrl}`}</Typography>
                  )
                )}
              </Box>
            )}

            {filmForm.loaiPhim === 'bo' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Quản lý Tập phim</Typography>
                {filmForm.episodes.map((episode, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, border: '1px solid #333', borderRadius: '4px' }}>
                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      color="primary"
                    >
                      Tải lên tập #{index + 1}
                      <input type="file" hidden onChange={(e) => handleEpisodeFileChange(index, e)} name={`episodeFile-${index}`} accept="video/*" />
                    </Button>
                    {uploadedEpisodeFiles.has(episode.name) ? (
                      <Typography variant="body2" sx={{ mt: 1 }}>{uploadedEpisodeFiles.get(episode.name)?.name}</Typography>
                    ) : (
                      episode.url && (
                        <Typography variant="body2" sx={{ mt: 1 }}>{`Tệp hiện tại: ${episode.url.includes('youtube.com/embed') ? 'Liên kết YouTube' : episode.url.split('/').pop()}`}</Typography>
                      )
                    )}
                    <IconButton onClick={() => removeEpisodeField(index)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button onClick={addEpisodeField} startIcon={<AddIcon />}>Thêm tập</Button>
              </Box>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilmDialog(false)}>Hủy</Button>
          <Button type="submit" form="film-form" variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={openTheLoaiDialog} onClose={() => setOpenTheLoaiDialog(false)}>
        <DialogTitle>{selectedCategory ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleTheLoaiSubmit} id="theloai-form">
            <TextField
              label="Tên thể loại"
              name="tenTheLoai"
              value={theLoaiForm.tenTheLoai}
              onChange={handleChangeTheLoaiForm}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Mô tả"
              name="moTa"
              value={theLoaiForm.moTa}
              onChange={handleChangeTheLoaiForm}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTheLoaiDialog(false)}>Hủy</Button>
          <Button type="submit" form="theloai-form" variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUserSubmit} id="user-form">
            <TextField
              label="Họ tên"
              name="hoTen"
              value={userForm.hoTen}
              onChange={handleChangeUserForm}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={userForm.email}
              onChange={handleChangeUserForm}
              fullWidth
              margin="normal"
              required
            />
            <FormControl component="fieldset" margin="normal">
              <RadioGroup
                row
                name="role"
                value={userForm.role}
                onChange={handleChangeUserForm}
              >
                <FormControlLabel value="user" control={<Radio />} label="User" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Hủy</Button>
          <Button type="submit" form="user-form" variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin; 