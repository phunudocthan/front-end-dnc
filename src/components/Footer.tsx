import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} FilmHub. Bản quyền thuộc về FilmHub.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}{new Date().getFullYear()}{' FilmHub'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 