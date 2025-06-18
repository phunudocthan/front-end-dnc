import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../store/slices/authSlice";
import { theLoaiService } from "../services/theLoaiService";
import { ITheLoai } from "../types";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const pages = [
  { title: "Trang chủ", path: "/" },
  { title: "Phim lẻ", path: "/films?type=single" },
  { title: "Phim bộ", path: "/series" },
  { title: "Thể loại", path: "/theloai" },
  { title: "Phim hot", path: "/trending" },
];

const countryList = [
  { label: "Việt Nam", value: "vietnam" },
  { label: "Hàn Quốc", value: "korea" },
  { label: "Trung Quốc", value: "china" },
  { label: "Mỹ", value: "usa" },
  { label: "Nhật Bản", value: "japan" },
  { label: "Thái Lan", value: "thailand" },
  { label: "Châu Âu", value: "europe" },
];
const yearList = [
  2024,
  2023,
  2022,
  2021,
  2020,
  2019,
  2018,
  2017,
  2016,
  2015,
  2014,
  2013,
  2012,
  2011,
  2010,
  "Trước 2009",
];

const menuItems = [
  { title: "TRANG CHỦ", path: "/" },
  { title: "PHIM LẺ", path: "/films?type=single" },
  { title: "PHIM BỘ", path: "/series" },
  { title: "THỂ LOẠI", type: "dropdown" },
  { title: "QUỐC GIA", type: "dropdown" },
  { title: "NĂM PHÁT HÀNH", type: "dropdown" },
  { title: "LỌC PHIM", path: "/filter" },
];

const SearchBox = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "140px",
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingLeft: theme.spacing(2),
  fontSize: "1rem",
}));

const settings = [
  { name: "Tài khoản", path: "/profile" },
  { name: "Lịch sử xem", path: "/lichsuxem" },
  { name: "Yêu thích", path: "/yeuthich" },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { isAuthenticated, user, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const [theLoais, setTheLoais] = useState<ITheLoai[]>([]);
  const [anchorTheLoai, setAnchorTheLoai] = useState<null | HTMLElement>(null);
  const [anchorCountry, setAnchorCountry] = useState<null | HTMLElement>(null);
  const [anchorYear, setAnchorYear] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState("");

  console.log({ userFromNavbar: user, avatarFileName: user?.avatar });

  // Thêm biến timeout cho dropdown
  const closeTimeout = React.useRef<number | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    (async () => {
      const res = await theLoaiService.getAllCategories();
      setTheLoais(res.data.categories);
    })();
  }, []);

  useEffect(() => {
    setAnchorTheLoai(null);
    setAnchorCountry(null);
    setAnchorYear(null);
  }, [location.pathname]);

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const quocGiaItems = [
    { label: "Việt Nam", value: "vietnam" },
    { label: "Hàn Quốc", value: "korea" },
    { label: "Trung Quốc", value: "china" },
    { label: "Mỹ", value: "usa" },
    { label: "Nhật Bản", value: "japan" },
    { label: "Thái Lan", value: "thailand" },
    { label: "Châu Âu", value: "europe" },
  ];
  const quocGiaButton = (
    <Button color="inherit" component={RouterLink} to="/quocgia">
      Quốc gia
    </Button>
  );

  const namPhatHanhButton = (
    <Button color="inherit" component={RouterLink} to="/namphathanh">
      Năm phát hành
    </Button>
  );

  return (
    <AppBar
      position="fixed"
      className={trigger ? "scrolled" : ""}
      sx={{
        background: isHomePage
          ? "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)"
          : "#141414",
        boxShadow: trigger ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container
        maxWidth={false}
        sx={{ width: "100vw", overflow: "visible", p: 0 }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 2, sm: 4 },
            height: "48px",
            minHeight: "48px",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            overflow: "visible",
          }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
              mr: 4,
              height: "48px",
            }}
          >
            <Typography
              noWrap
              sx={{
                fontFamily: "Netflix Sans",
                fontWeight: 900,
                color: "#E50914",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                letterSpacing: "-1px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                lineHeight: 1,
                height: "48px",
                display: "flex",
                alignItems: "center",
                position: "relative",
                top: "2px",
              }}
            >
              FilmHub
            </Typography>
          </Box>
          {/* Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              height: "48px",
              overflow: "visible",
            }}
          >
            {menuItems.map((item, idx) => {
              const buttonSx = {
                color: "white",
                display: "flex",
                alignItems: "center",
                fontSize: "0.89rem",
                fontWeight: 700,
                textTransform: "none",
                px: 2,
                lineHeight: 1,
                height: "48px",
                paddingTop: 0,
                paddingBottom: 0,
                minHeight: "unset",
                gap: "2px",
                ml: idx === 0 ? 0 : 2,
                "&:hover": { color: "#E50914", backgroundColor: "transparent" },
              };
              if (item.type === "dropdown") {
                let onClick, open, anchorEl, setAnchor;
                if (item.title === "THỂ LOẠI") {
                  onClick = (e: React.MouseEvent<HTMLElement>) =>
                    setAnchorTheLoai(anchorTheLoai ? null : e.currentTarget);
                  open = Boolean(anchorTheLoai);
                  anchorEl = anchorTheLoai;
                  setAnchor = setAnchorTheLoai;
                } else if (item.title === "QUỐC GIA") {
                  onClick = (e: React.MouseEvent<HTMLElement>) =>
                    setAnchorCountry(anchorCountry ? null : e.currentTarget);
                  open = Boolean(anchorCountry);
                  anchorEl = anchorCountry;
                  setAnchor = setAnchorCountry;
                } else if (item.title === "NĂM PHÁT HÀNH") {
                  onClick = (e: React.MouseEvent<HTMLElement>) =>
                    setAnchorYear(anchorYear ? null : e.currentTarget);
                  open = Boolean(anchorYear);
                  anchorEl = anchorYear;
                  setAnchor = setAnchorYear;
                }
                return (
                  <Button
                    key={item.title}
                    endIcon={
                      <ArrowDropDownIcon
                        sx={{ fontSize: "1rem", ml: "2px", mr: "-6px" }}
                      />
                    }
                    sx={buttonSx}
                    onClick={onClick}
                  >
                    {item.title}
                  </Button>
                );
              } else {
                return (
                  <Button
                    key={item.title}
                    component={RouterLink}
                    to={String(item.path || "/")}
                    sx={buttonSx}
                  >
                    {item.title}
                  </Button>
                );
              }
            })}
          </Box>
          {/* SearchBox */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: "auto",
              flexShrink: 0,
              width: "auto",
              justifyContent: "flex-end",
            }}
          >
            <SearchBox
              onSubmit={handleSearchSubmit}
              sx={{ width: "140px", marginRight: 1, flexShrink: 0 }}
            >
              <StyledInputBase
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                inputProps={{
                  "aria-label": "search",
                  style: {
                    height: 40,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              />
              <IconButton
                type="submit"
                aria-label="search"
                sx={{
                  color: "white",
                  ml: 1,
                  height: 40,
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleSearchSubmit}
              >
                <SearchIcon />
              </IconButton>
            </SearchBox>
            {/* Right Menu */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                ml: 1,
                mr: 2,
              }}
            >
              {isAuthenticated ? (
                <>
                  <Tooltip title="Mở menu">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0,
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        transition: "transform 0.2s",
                      }}
                      aria-controls={
                        Boolean(anchorElUser) ? "menu-appbar" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={Boolean(anchorElUser) ? "true" : undefined}
                    >
                      <Avatar
                        alt={user?.hoTen}
                        src={
                          user?.avatar
                            ? `http://localhost:3001/${user.avatar}`
                            : undefined
                        }
                        sx={{
                          width: 36,
                          height: 36,
                          border: "2px solid #E50914",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        {user?.hoTen?.[0]}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{
                      mt: "45px",
                      "& .MuiPaper-root": {
                        backgroundColor: "rgba(24, 24, 24, 0.95)",
                        backdropFilter: "blur(10px)",
                        minWidth: 220,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      },
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Typography sx={{ color: "#8C8C8C", fontSize: "0.9rem" }}>
                        Xin chào,
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontWeight: 500,
                          fontSize: "1.1rem",
                        }}
                      >
                        {user?.hoTen}
                      </Typography>
                    </Box>
                    {isAdmin && (
                      <MenuItem
                        onClick={() => {
                          handleCloseUserMenu();
                          navigate("/admin");
                        }}
                      >
                        Quản trị
                      </MenuItem>
                    )}
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting.name}
                        onClick={() => {
                          handleCloseUserMenu();
                          navigate(setting.path);
                        }}
                      >
                        {setting.name}
                      </MenuItem>
                    ))}
                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  sx={{
                    bgcolor: "#E50914",
                    px: 3,
                    py: 1,
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    textTransform: "none",
                    mr: 2,
                    "&:hover": {
                      bgcolor: "#B30710",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Đăng nhập
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
        {/* Menu dropdowns */}
        <Menu
          anchorEl={anchorTheLoai}
          open={Boolean(anchorTheLoai)}
          onClose={() => setAnchorTheLoai(null)}
          transitionDuration={0}
          sx={{
            mt: 1,
            "& .MuiPaper-root": {
              backgroundColor: "rgba(24, 24, 24, 0.95)",
              backdropFilter: "blur(10px)",
              minWidth: 400,
              maxWidth: 700,
              p: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", width: 400 }}>
            {Array.from({ length: 2 }).map((_, colIdx) => (
              <Box key={colIdx} sx={{ minWidth: 180, mr: 2 }}>
                {(theLoais || [])
                  .slice(
                    Math.ceil((theLoais?.length || 0) / 2) * colIdx,
                    Math.ceil((theLoais?.length || 0) / 2) * (colIdx + 1)
                  )
                  .map((theLoai: ITheLoai) => (
                    <MenuItem
                      key={theLoai._id}
                      component={RouterLink}
                      to={`/theloai/${theLoai._id}`}
                      onClick={() => {}}
                      sx={{
                        color: "white",
                        py: 1,
                        "&:hover": {
                          color: "#E50914",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {theLoai.tenTheLoai}
                    </MenuItem>
                  ))}
              </Box>
            ))}
          </Box>
        </Menu>
        <Menu
          anchorEl={anchorCountry}
          open={Boolean(anchorCountry)}
          onClose={() => setAnchorCountry(null)}
          transitionDuration={0}
          sx={{
            mt: 1,
            "& .MuiPaper-root": {
              backgroundColor: "rgba(24, 24, 24, 0.95)",
              backdropFilter: "blur(10px)",
              minWidth: 300,
              p: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", width: 300 }}>
            {Array.from({ length: 2 }).map((_, colIdx) => (
              <Box key={colIdx} sx={{ minWidth: 120, mr: 2 }}>
                {countryList
                  .slice(
                    Math.ceil(countryList.length / 2) * colIdx,
                    Math.ceil(countryList.length / 2) * (colIdx + 1)
                  )
                  .map((country) => (
                    <MenuItem
                      key={country.value}
                      component={RouterLink}
                      to={`/quocgia/${country.value}`}
                      onClick={() => {}}
                      sx={{
                        color: "white",
                        py: 1,
                        "&:hover": {
                          color: "#E50914",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {country.label}
                    </MenuItem>
                  ))}
              </Box>
            ))}
          </Box>
        </Menu>
        <Menu
          anchorEl={anchorYear}
          open={Boolean(anchorYear)}
          onClose={() => setAnchorYear(null)}
          transitionDuration={0}
          sx={{
            mt: 1,
            "& .MuiPaper-root": {
              backgroundColor: "rgba(24, 24, 24, 0.95)",
              backdropFilter: "blur(10px)",
              minWidth: 220,
              p: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              width: 220,
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                minWidth: 100,
                mr: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {(yearList || []).slice(0, 8).map((year) => (
                <MenuItem
                  key={year}
                  component={RouterLink}
                  to={`/namphathanh/${
                    year === "Trước 2009" ? "before2009" : year
                  }`}
                  onClick={() => {}}
                  sx={{
                    color: "white",
                    py: 1,
                    minWidth: 100,
                    "&:hover": {
                      color: "#E50914",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {year}
                </MenuItem>
              ))}
            </Box>
            <Box
              sx={{
                minWidth: 100,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {(yearList || []).slice(8).map((year) => (
                <MenuItem
                  key={year}
                  component={RouterLink}
                  to={`/namphathanh/${
                    year === "Trước 2009" ? "before2009" : year
                  }`}
                  onClick={() => {}}
                  sx={{
                    color: "white",
                    py: 1,
                    minWidth: 100,
                    "&:hover": {
                      color: "#E50914",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {year}
                </MenuItem>
              ))}
            </Box>
          </Box>
        </Menu>
      </Container>
    </AppBar>
  );
};

export default Navbar;
