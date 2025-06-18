import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Chip,
  Stack,
  SelectChangeEvent,
  Button,
  Menu,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { filmService } from "../services/filmService";
import { theLoaiService } from "../services/theLoaiService";
import { IFilm, ITheLoai } from "../types";
import { getPosterUrl } from "../utils/imageUtils";

const Films = () => {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [theLoais, setTheLoais] = useState<ITheLoai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTheLoai, setSelectedTheLoai] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [anchorTheLoai, setAnchorTheLoai] = useState<null | HTMLElement>(null);
  const [openTheLoai, setOpenTheLoai] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();

  useEffect(() => {
    const fetchTheLoais = async () => {
      try {
        const response = await theLoaiService.getAllCategories();
        setTheLoais(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchTheLoais();
  }, []);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 12,
          sort,
        };

        const queryParams = new URLSearchParams(location.search);
        const searchFromUrl = queryParams.get("q");
        const typeFromUrl = queryParams.get("type");

        if (searchFromUrl) {
          params.search = searchFromUrl;
        } else if (searchQuery) {
          params.search = searchQuery;
        }

        if (selectedTheLoai) {
          params.theLoai = selectedTheLoai;
        }

        if (typeFromUrl === "single") {
          params.loaiPhim = "le";
        } else if (typeFromUrl === "series") {
          params.loaiPhim = "bo";
        }

        const res = await filmService.getAllFilms(params);
        setFilms(res.films);
        setTotalPages(res.totalPages || 1);
        setError(null);
      } catch (error) {
        console.error("Error fetching films:", error);
        setError("Có lỗi xảy ra khi tải danh sách phim");
        setFilms([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, [page, location.search, searchQuery, selectedTheLoai, sort]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleTheLoaiChange = (event: SelectChangeEvent) => {
    setSelectedTheLoai(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleOpenTheLoai = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorTheLoai(event.currentTarget);
    setOpenTheLoai(true);
  };

  const handleCloseTheLoai = () => {
    setAnchorTheLoai(null);
    setOpenTheLoai(false);
  };

  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get("type");
  const searchFromUrl = queryParams.get("q");

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            color: searchFromUrl ? "#fff" : "#E50914",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: "1.5rem",
            mb: 2,
          }}
        >
          {typeFromUrl === "single"
            ? "PHIM LẺ"
            : typeFromUrl === "series"
            ? "PHIM BỘ"
            : searchFromUrl
            ? `KẾT QUẢ TÌM KIẾM CHO: "${decodeURIComponent(searchFromUrl)}"`
            : "DANH SÁCH PHIM"}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextField
            label="Tìm kiếm phim"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: "200px" }}
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Thể loại</InputLabel>
            <Select
              value={selectedTheLoai}
              label="Thể loại"
              onChange={handleTheLoaiChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {theLoais.map((theLoai) => (
                <MenuItem key={theLoai._id} value={theLoai._id}>
                  {theLoai.tenTheLoai}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={sort}
              label="Sắp xếp theo"
              onChange={handleSortChange}
            >
              <MenuItem value="-createdAt">Mới nhất</MenuItem>
              <MenuItem value="createdAt">Cũ nhất</MenuItem>
              <MenuItem value="diemTrungBinh">
                Điểm trung bình (thấp nhất)
              </MenuItem>
              <MenuItem value="-diemTrungBinh">
                Điểm trung bình (cao nhất)
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={2}>
          {films.map((film) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={film._id}>
              <Card
                component={Link}
                to={`/films/${film._id}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={getPosterUrl(film.poster)}
                  alt={film.tenPhim}
                  sx={{
                    height: "350px",
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 1,
                    pt: 0,
                    minHeight: "120px",
                    backgroundColor: "#1c1c1c",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    noWrap
                    sx={{ color: "#fff" }}
                  >
                    {film.tenPhim}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    mb={1}
                    justifyContent="center"
                  >
                    {film.theLoai.slice(0, 2).map((theLoai) => (
                      <Chip
                        key={theLoai._id}
                        label={theLoai.tenTheLoai}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                        }}
                      />
                    ))}
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Rating
                      value={film.diemTrungBinh}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" sx={{ color: "white" }}>
                      ({film.danhGiaChiTiet?.length || 0})
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
            p: 2,
            borderRadius: "8px",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#E50914",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#C20812",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Films;
