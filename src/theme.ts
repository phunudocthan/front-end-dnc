import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E50914', // Netflix red
      light: '#FF0F1A',
      dark: '#B30710',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#cccccc',
      contrastText: '#000000',
    },
    background: {
      default: '#141414', // Netflix background
      paper: '#181818', // Netflix card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#8C8C8C', // Netflix secondary text
    },
    error: {
      main: '#E50914',
    },
  },
  typography: {
    fontFamily: [
      'Netflix Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      color: '#E50914',
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      color: '#8C8C8C',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontWeight: 600,
          padding: '8px 20px',
        },
        contained: {
          backgroundColor: '#E50914',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#B30710',
          },
        },
        outlined: {
          borderColor: '#ffffff',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent)',
          boxShadow: 'none',
          transition: 'background-color 0.3s ease',
          '&.scrolled': {
            backgroundColor: '#141414',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          borderRadius: 4,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: 1,
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#181818',
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#333333',
            borderRadius: 4,
            '& fieldset': {
              borderColor: '#333333',
            },
            '&:hover fieldset': {
              borderColor: '#666666',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
          },
        },
      },
    },
  },
});

export default theme; 