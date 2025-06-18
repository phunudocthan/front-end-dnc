import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Chip,
  Rating,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { filmService } from "../services/filmService";
import { theLoaiService } from "../services/theLoaiService";
import { IFilm, ITheLoai } from "../types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomeCustomSlider.css";
import { getPosterUrl } from "../utils/imageUtils";

const RedArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 64,
        height: 64,
        background: "rgba(0,0,0,0.15)",
        borderRadius: 32,
        position: "absolute",
        top: "50%",
        right: "-32px",
        transform: "translateY(-50%)",
        opacity: 0.3,
        transition: "opacity 0.2s",
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        style={{
          fill: "#E50914",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
        }}
      >
        <polygon
          points="18,12 36,24 18,36"
          rx="8"
          style={{ borderRadius: 12 }}
        />
      </svg>
    </div>
  );
};
const RedArrowPrev = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 64,
        height: 64,
        background: "rgba(0,0,0,0.15)",
        borderRadius: 32,
        position: "absolute",
        top: "50%",
        left: "-32px",
        transform: "translateY(-50%)",
        opacity: 0.3,
        transition: "opacity 0.2s",
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        style={{
          fill: "#E50914",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
          transform: "rotate(180deg)",
        }}
      >
        <polygon
          points="18,12 36,24 18,36"
          rx="8"
          style={{ borderRadius: 12 }}
        />
      </svg>
    </div>
  );
};

const Home = () => {
  const [deCuFilms, setDeCuFilms] = useState<IFilm[]>([]);
  const [leFilms, setLeFilms] = useState<IFilm[]>([]);
  const [boFilms, setBoFilms] = useState<IFilm[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilms = async () => {
      // Lấy phim ngẫu nhiên cho đề cử
      const allRes = await filmService.getAllFilms({ sort: "", limit: 50 });
      const shuffled = allRes.films.sort(() => 0.5 - Math.random());
      setDeCuFilms(shuffled.slice(0, 12));
      // Lấy 12 phim lẻ mới nhất
      const leRes = await filmService.getAllFilms({
        sort: "-createdAt",
        limit: 12,
        loaiPhim: "le",
      });
      setLeFilms(leRes.films);
      console.log("DEBUG: Home.tsx - leFilms:", leRes.films);
      // Lấy 12 phim bộ mới nhất
      const boRes = await filmService.getAllFilms({
        sort: "-createdAt",
        limit: 12,
        loaiPhim: "bo",
      });
      setBoFilms(boRes.films);
      console.log("DEBUG: Home.tsx - boFilms:", boRes.films);
    };
    fetchFilms();
  }, []);

  // Hàm lấy _id thể loại theo tên
  const getTheLoaiId = async (keyword: string) => {
    const res = await theLoaiService.getAllCategories();
    const theLoais = res.data.categories || [];
    const found = theLoais.find((tl: ITheLoai) =>
      tl.tenTheLoai.toLowerCase().includes(keyword)
    );
    return found?._id;
  };

  // Slider settings cho phim đề cử
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <RedArrow />,
    prevArrow: <RedArrowPrev />,
  };

  return (
    <Container>
      {/* PHIM ĐỀ CỬ */}
      <Box sx={{ mb: 6, position: "relative" }}>
        <Typography
          variant="h5"
          sx={{
            color: "#E50914",
            fontWeight: 900,
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Phim đề cử
        </Typography>
        <Slider {...sliderSettings}>
          {deCuFilms.map((film) => {
            console.log(
              "DEBUG: Slider film poster:",
              `/uploads/posters/${film.poster}`
            );
            return (
              <Box key={film._id} sx={{ px: 1 }}>
                <Card
                  component={Link}
                  to={`/films/${film._id}`}
                  sx={{
                    height: 470,
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={getPosterUrl(film.poster)}
                    alt={film.tenPhim}
                    style={{
                      height: "350px",
                      width: "100%",
                      objectFit: "contain",
                      borderRadius: 2,
                    }}
                  />
                  <CardContent
                    sx={{ flexGrow: 1, p: 1, pt: 0, textAlign: "center" }}
                  >
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      component="div"
                      sx={{ color: "#fff", fontWeight: 600, m: 0 }}
                      noWrap
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
                      <Typography variant="body2" color="text.secondary">
                        ({film.danhGiaChiTiet?.length || 0})
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Slider>
      </Box>
      {/* PHIM LẺ */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#E50914",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Phim lẻ
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#E50914", fontWeight: 700 }}
            onClick={() => navigate("/films?type=single")}
          >
            Xem tất cả
          </Button>
        </Box>
        <Grid container spacing={2}>
          {leFilms.map((film) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={film._id}>
              <Card
                component={Link}
                to={`/films/${film._id}`}
                sx={{
                  height: 470,
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                }}
              >
                <img
                  src={getPosterUrl(film.poster)}
                  alt={film.tenPhim}
                  style={{
                    height: "350px",
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
                <CardContent
                  sx={{ flexGrow: 1, p: 1, pt: 0, textAlign: "center" }}
                >
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ color: "#fff", fontWeight: 600, m: 0 }}
                    noWrap
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
      </Box>
      {/* PHIM BỘ */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#E50914",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Phim bộ
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#E50914", fontWeight: 700 }}
            onClick={() => navigate("/films?type=series")}
          >
            Xem tất cả
          </Button>
        </Box>
        <Grid container spacing={2}>
          {boFilms.map((film) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={film._id}>
              <Card
                component={Link}
                to={`/films/${film._id}`}
                sx={{
                  height: 470,
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                }}
              >
                <img
                  src={getPosterUrl(film.poster)}
                  alt={film.tenPhim}
                  style={{
                    height: "350px",
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
                <CardContent
                  sx={{ flexGrow: 1, p: 1, pt: 0, textAlign: "center" }}
                >
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ color: "#fff", fontWeight: 600, m: 0 }}
                    noWrap
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
      </Box>
    </Container>
  );
};

export default Home;
