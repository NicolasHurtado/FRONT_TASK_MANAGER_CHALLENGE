'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

// Importar el componente de login de forma dinámica sin SSR
const LoginForm = dynamic(() => import('./LoginForm'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  ),
});

export default function LoginPage() {
  return <LoginForm />;
} 